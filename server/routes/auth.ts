import * as auth from "../auth";
import { router, withLoggerProcedure } from "../trpc";

export const authRouter = router({
  signIn: withLoggerProcedure.mutation(async ({ ctx, input }) => {
    return auth.signIn("github");
  }),
  signOut: withLoggerProcedure.mutation(async ({ ctx, input }) => {
    return auth.signOut();
  }),
});
