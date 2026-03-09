import { prisma } from "@/prisma/db";
import { protectedProcedure, router } from "../trpc";
import {
  CommentListType,
  CommentListWithChildren,
  createCommentSchema,
} from "@/prisma/validate-schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { cache } from "react";
import { unstable_cache, revalidateTag } from "next/cache";
// 全局中间件 responseFormatMiddleware 会自动处理 Date 到 String 的转换

// 1. 定义获取评论的逻辑，并开启 Next.js 的 Data Cache (跨请求缓存)
const getCommentsCached = (postId: string, parentId?: string) =>
  unstable_cache(
    async () => {
      console.log(`[DB Query] Fetching ALL comments for post: ${postId}`);
      const startTime = Date.now();

      const [total, comments] = await Promise.all([
        prisma.comment.count({ where: { postId, parentId: parentId ?? null } }),
        prisma.comment.findMany({
          where: { postId, parentId: parentId ?? null },
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { name: true, image: true } },
            post: { select: { title: true } },
          },
        }),
      ]);

      console.log(
        `[DB Query] Done in ${Date.now() - startTime}ms. Found ${total} total comments.`,
      );
      return { total, comments };
    },
    [`comments-${postId}-${parentId ?? "root"}`], // 缓存 Key
    {
      revalidate: 3600,
      tags: ["comments", `comments-post-${postId}`], // 缓存标签
    },
  )();

// 2. 使用 React 的 cache 进行请求内记忆化
const getCommentsMemoized = cache(getCommentsCached);

export const commentRouter = router({
  create: protectedProcedure
    .input(createCommentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { content, commentId, postId } = input;

        const comment = await prisma.comment.create({
          data: {
            userId: ctx.session.user.id,
            content,
            postId,
            parentId: commentId,
          },
        });

        // 发表评论完成后，立使该帖子的评论缓存失效
        revalidateTag(`comments-post-${postId}`, "default");

        return comment;
      } catch (error) {
        let message = "未知错误";
        if (error instanceof Error) {
          message = error.message;
        }
        throw new TRPCError({
          code: "BAD_REQUEST",
          message,
        });
      }
    }),

  getListWithId: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        parentId: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      try {
        return await getCommentsMemoized(input.postId, input.parentId);
      } catch (error) {
        let message = "未知错误";
        if (error instanceof Error) {
          message = error.message;
        }
        throw new TRPCError({
          code: "BAD_REQUEST",
          message,
        });
      }
    }),

  getCommentTree: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        page: z.number().default(1),
        pageSize: z.number().default(10),
      }),
    )
    .query(async ({ input }) => {
      const { postId, page, pageSize } = input;
      const skip = (page - 1) * pageSize;

      // 1. 分页获取根评论
      const [totalRoots, roots] = await Promise.all([
        prisma.comment.count({ where: { postId, parentId: null } }),
        prisma.comment.findMany({
          where: { postId, parentId: null },
          orderBy: { createdAt: "desc" },
          skip,
          take: pageSize,
          include: {
            user: { select: { name: true, image: true } },
            _count: { select: { children: true } },
          },
        }),
      ]);

      if (roots.length === 0) return { roots: [], totalRoots };

      // 2. 批量获取这些根评论的子评论 (Level 1)
      const rootIds = roots.map((r) => r.id);
      const level1Comments = await prisma.comment.findMany({
        where: { parentId: { in: rootIds } },
        orderBy: { createdAt: "asc" },
        include: {
          user: { select: { name: true, image: true } },
          _count: { select: { children: true } },
        },
      });

      // 3. 批量获取这些 Level 1 评论的子评论 (Level 2)
      const level1Ids = level1Comments.map((c) => c.id);
      let level2Comments: CommentListType[] = [];
      if (level1Ids.length > 0) {
        level2Comments = await prisma.comment.findMany({
          where: { parentId: { in: level1Ids } },
          orderBy: { createdAt: "asc" },
          include: {
            user: { select: { name: true, image: true } },
            _count: { select: { children: true } },
          },
        });
      }

      // 4. 构建树结构 (手动挂载)
      const allComments = [...level1Comments, ...level2Comments];
      const commentMap = new Map<string, CommentListWithChildren>();
      allComments.forEach((c) => commentMap.set(c.id, { ...c, children: [] }));

      // 将 Level 2 挂到 Level 1
      level2Comments.forEach((c) => {
        const parent = commentMap.get(c.parentId!);
        if (parent) parent.children!.push(commentMap.get(c.id)!);
      });

      // 将 Level 1 挂到根评论
      const treeRoots = roots.map((root) => {
        const children = level1Comments
          .filter((c) => c.parentId === root.id)
          .map((c) => commentMap.get(c.id));
        return { ...root, children };
      });

      return { roots: treeRoots, totalRoots };
    }),

  getPaginatedReplies: protectedProcedure
    .input(
      z.object({
        parentId: z.string(),
        page: z.number().default(1),
        pageSize: z.number().default(5),
      }),
    )
    .query(async ({ input }) => {
      const { parentId, page, pageSize } = input;
      const skip = (page - 1) * pageSize;

      const [total, comments] = await Promise.all([
        prisma.comment.count({ where: { parentId } }),
        prisma.comment.findMany({
          where: { parentId },
          orderBy: { createdAt: "asc" },
          skip,
          take: pageSize,
          include: {
            user: { select: { name: true, image: true } },
            _count: { select: { children: true } },
          },
        }),
      ]);

      return { total, comments };
    }),
});
