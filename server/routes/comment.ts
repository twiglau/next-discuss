import { prisma } from "@/prisma/db";
import { protectedProcedure, router } from "../trpc";
import { createCommentSchema } from "@/prisma/validate-schema";
import { TRPCError } from "@trpc/server";

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
});
