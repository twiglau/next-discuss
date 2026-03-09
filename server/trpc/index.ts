import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "../auth";
import { deepFormatDates } from "../utils/date-utils";

const t = initTRPC.create();
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

/**
 * 自动转换所有返回结果中的 Date 到 String
 */
const responseFormatMiddleware = t.middleware(async ({ next }) => {
  const result = await next();
  if (result.ok && result.data) {
    return {
      ...result,
      data: deepFormatDates(result.data),
    };
  }
  return result;
});

const withLoggerProcedure = procedure
  .use(loggedMiddleware)
  .use(responseFormatMiddleware);

const protectedProcedure = procedure
  .use(loggedMiddleware)
  .use(responseFormatMiddleware)
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
