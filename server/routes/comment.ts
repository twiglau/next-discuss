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
        pageSize: z.number().default(5),
      }),
    )
    .query(async ({ input }) => {
      const { postId, page, pageSize } = input;
      const skip = (page - 1) * pageSize;

      // 1. 分页获取根评论 (Level 0)
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

      // 2. 批量获取 Level 1 评论 (每个根评论取前 5 条)
      const level1Results = await Promise.all(
        roots.map((root) =>
          prisma.comment.findMany({
            where: { parentId: root.id },
            orderBy: { createdAt: "asc" },
            take: 5,
            include: {
              user: { select: { name: true, image: true } },
              _count: { select: { children: true } },
            },
          }),
        ),
      );
      const level1Comments = level1Results.flat();

      // 3. 批量获取 Level 2 评论 (每个 Level 1 评论取前 5 条)
      let level2Comments: CommentListType[] = [];
      if (level1Comments.length > 0) {
        const level2Results = await Promise.all(
          level1Comments.map((c) =>
            prisma.comment.findMany({
              where: { parentId: c.id },
              orderBy: { createdAt: "asc" },
              take: 5,
              include: {
                user: { select: { name: true, image: true } },
                _count: { select: { children: true } },
              },
            }),
          ),
        );
        level2Comments = level2Results.flat();
      }

      // 4. 构建树结构
      const commentMap = new Map<string, CommentListWithChildren>();

      // 先放入 Level 2 到 Map
      level2Comments.forEach((c) => {
        commentMap.set(c.id, { ...c, children: [] });
      });

      // 处理 Level 1 并挂载 Level 2
      const processedLevel1 = level1Comments.map((c) => {
        const children = level2Comments
          .filter((l2) => l2.parentId === c.id)
          .map((l2) => commentMap.get(l2.id)!);
        const node = { ...c, children };
        commentMap.set(c.id, node);
        return node;
      });

      // 将 Level 1 挂到根评论
      const treeRoots = roots.map((root) => {
        const children = processedLevel1.filter((c) => c.parentId === root.id);
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
