import { createPostSchema } from "@/prisma/validate-schema";
import { protectedProcedure, router } from "../trpc";
import { prisma } from "@/server/db/prisma";
import { TRPCError } from "@trpc/server";

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
      return;
    }),
});
