import { router } from "./index";
import { authRouter } from "../routes/auth";

const appRouter = router({
  auth: authRouter,
});

export { appRouter };
export type AppRouter = typeof appRouter;
