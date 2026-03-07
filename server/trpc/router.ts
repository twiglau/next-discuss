import { router } from "./index";
import { authRouter } from "../routes/auth";
import { topicRouter } from "../routes/topic";
import { postRouter } from "../routes/post";
import { commentRouter } from "../routes/comment";

const appRouter = router({
  auth: authRouter,
  topic: topicRouter,
  post: postRouter,
  comment: commentRouter,
});

export { appRouter };
export type AppRouter = typeof appRouter;
