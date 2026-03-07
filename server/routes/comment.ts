import { prisma } from "@/prisma/db";
import { protectedProcedure, router } from "../trpc";
import { createCommentSchema } from "@/prisma/validate-schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { cache } from "react";
import { unstable_cache, revalidateTag, revalidatePath } from "next/cache";

// 1. 定义获取评论的逻辑，并开启 Next.js 的 Data Cache (跨请求缓存)
const getCommentsCached = (postId: string) =>
  unstable_cache(
    async () => {
      console.log(`[DB Query] Fetching ALL comments for post: ${postId}`);
      const startTime = Date.now();

      const [total, comments] = await Promise.all([
        prisma.comment.count({ where: { postId } }),
        prisma.comment.findMany({
          where: { postId },
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
    [`comments-${postId}-all`], // 缓存 Key
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
        revalidatePath(`/topics/[name]/posts/[id]`, "page");

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
      }),
    )
    .query(async ({ input }) => {
      try {
        return await getCommentsMemoized(input.postId);
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
});
