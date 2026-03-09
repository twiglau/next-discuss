import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "../auth";
import superjson from "superjson";

const t = initTRPC.create({
  transformer: superjson,
});
const { router, procedure } = t;

const loggedMiddleware = t.middleware(async ({ next, ctx }) => {
  const start = Date.now();
  const result = await next();
  const duration = Date.now() - start;
  console.log(`[DEBUG] api time: ${duration}ms`);
  return result;
});
const withSessionMiddleware = t.middleware(async ({ next, ctx }) => {
  const session = await auth();

  return next({
    ctx: {
      session,
    },
  });
});

const withLoggerProcedure = procedure.use(loggedMiddleware);

const protectedProcedure = procedure
  .use(loggedMiddleware)
  .use(withSessionMiddleware)
  .use(async ({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({
        code: "FORBIDDEN",
      });
    }
    return next({
      ctx: {
        session: ctx.session,
      },
    });
  });

const withAppProcedure = withLoggerProcedure.use(async ({ ctx, next }) => {
  return next();
});

export { router, protectedProcedure, withAppProcedure, withLoggerProcedure };
