import { createTopicSchema } from "@/prisma/validate-schema";
import { protectedProcedure, router } from "@/server/trpc";

export const topicRouter = router({
  create: protectedProcedure
    .input(createTopicSchema)
    .mutation(async ({ ctx, input }) => {}),
});
