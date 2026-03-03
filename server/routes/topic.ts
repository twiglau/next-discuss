import { createTopicSchema } from "@/prisma/validate-schema";
import { protectedProcedure, router } from "@/server/trpc";
import { prisma } from "@/server/db/prisma";
import { TRPCError } from "@trpc/server";

export const topicRouter = router({
  create: protectedProcedure
    .input(createTopicSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const topic = await prisma.topic.create({
          data: {
            name: input.name,
            description: input.description,
            tag: input.tag,
            userId: ctx.session.user.id,
          },
        });
        return topic;
      } catch (error) {
        let message = "";
        if (error instanceof Error) {
          message = error.message;
        } else {
          message = "Failed to create topic";
        }
        throw new TRPCError({
          code: "BAD_REQUEST",
          message,
        });
      }
    }),
  list: protectedProcedure.query(async ({ ctx }) => {
    try {
      const topics = await prisma.topic.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        include: {
          _count: {
            select: { posts: true },
          },
        },
      });
      return topics;
    } catch (error) {
      let message = "";
      if (error instanceof Error) {
        message = error.message;
      } else {
        message = "Failed to list topics";
      }
      throw new TRPCError({
        code: "BAD_REQUEST",
        message,
      });
    }
  }),
});
