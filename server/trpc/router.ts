import { router } from "./index";
import { authRouter } from "../routes/auth";
import { topicRouter } from "../routes/topic";
import { postRouter } from "../routes/post";

const appRouter = router({
  auth: authRouter,
  topic: topicRouter,
  post: postRouter,
});

export { appRouter };
export type AppRouter = typeof appRouter;
