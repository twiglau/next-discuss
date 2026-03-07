import { createPostSchema } from "@/prisma/validate-schema";
import { protectedProcedure, router } from "../trpc";
import { prisma } from "@/prisma/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const postRouter = router({
  create: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const topic = await prisma.topic.findUnique({
          where: {
            name: input.name,
          },
        });
        if (!topic) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "话题不存在",
          });
        }
        const post = await prisma.post.create({
          data: {
            title: input.title,
            content: input.content,
            userId: ctx.session.user.id,
            topicId: topic.id,
          },
          include: {
            topic: true,
          },
        });
        return post;
      } catch (error) {
        let message = " 未知错误";
        if (error instanceof Error) {
          message = error.message;
        }
        throw new TRPCError({
          code: "BAD_REQUEST",
          message,
        });
      }
    }),
  detail: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const post = await prisma.post.findUnique({
          where: { id: input.postId },
        });
        return post;
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
  getListWithTopicName: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const posts = await prisma.post.findMany({
          where: {
            topic: {
              name: input.name,
            },
          },
          include: {
            user: {
              select: { name: true },
            },
            topic: {
              select: { name: true },
            },
            _count: {
              select: { comments: true },
            },
          },
        });
        return posts;
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
  getTop5List: protectedProcedure.query(async () => {
    try {
      const posts = await prisma.post.findMany({
        orderBy: {
          comments: {
            _count: "desc",
          },
        },
        include: {
          user: {
            select: { name: true, image: true },
          },
          topic: {
            select: { name: true },
          },
          _count: {
            select: { comments: true },
          },
        },
      });
      return posts;
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
