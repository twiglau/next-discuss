import { trpcServerCaller } from "@/trpc-caller/server";
import CommentBox from "./comment-box";

export default async function CommentList({ postId }: { postId: string }) {
  console.log(`[Server Component] Rendering CommentList for post: ${postId}`);
  // 只获取根评论 (parentId 不传，后台默认为 undefined)
  const { total, comments } = await trpcServerCaller({}).comment.getListWithId({
    postId,
  });

  return (
    <div className="space-y-4">
      <h1 className="text-lg">
        全部评论 (<strong>{total}</strong>)
      </h1>
      {comments.map((comment) => (
        <CommentBox key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
