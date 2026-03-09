import { trpcServerCaller } from "@/trpc-caller/server";
import CommentBox from "./comment-box";
import CommentListPagination from "./comment-list-pagination";
import { CommentListType } from "@/prisma/validate-schema";

export default async function CommentList({ 
  postId, 
  page = 1 
}: { 
  postId: string; 
  page?: number; 
}) {
  console.log(`[Server Component] Rendering CommentList for post: ${postId}, page: ${page}`);
  
  const pageSize = 10;
  const { totalRoots, roots } = await trpcServerCaller({}).comment.getCommentTree({
    postId,
    page,
    pageSize,
  });

  const totalPages = Math.ceil(totalRoots / pageSize);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">
        全部评论 (<strong>{totalRoots}</strong>)
      </h1>
      
      <div className="space-y-4">
        {roots.map((comment: CommentListType) => (
          <CommentBox key={comment.id} comment={comment} depth={0} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center pt-6">
          <CommentListPagination totalPages={totalPages} currentPage={page} />
        </div>
      )}
    </div>
  );
}
