import { trpcServerCaller } from "@/trpc-caller/server";
import CommentBox from "./comment-box";


export default async function CommentList({postId}: {postId: string}) {
    const {total, comments} = await trpcServerCaller({}).comment.getListWithPostId({postId})
    return <div className="space-y-4">
        <h1 className="text-lg">评论列表 (<strong>{total}</strong>)</h1>
        {
            comments.map((comment) => (
                <CommentBox key={comment.id} comment={comment} />
            ))
        }
    </div>
}