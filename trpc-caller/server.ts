import { createCallerFactory } from "@trpc/server/unstable-core-do-not-import";
import { appRouter } from "@/server/trpc/router";

const trpcServerCaller = createCallerFactory()(appRouter);

export { trpcServerCaller };
