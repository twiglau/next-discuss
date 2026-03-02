import { router } from "./index";
import { authRouter } from "../routes/auth";
import { topicRouter } from "../routes/topic";

const appRouter = router({
  auth: authRouter,
  topic: topicRouter,
});

export { appRouter };
export type AppRouter = typeof appRouter;
