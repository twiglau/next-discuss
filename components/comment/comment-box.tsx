
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { CommentListWithChildren } from "@/prisma/validate-schema";
import { CommentReplyProvider, CommentReplyTrigger, CommentReplyForm } from "./comment-reply-wrapper";
import CommentBranchLoader from "./comment-branch-loader";
import { format } from "date-fns";



type CommentBoxProps = {
  comment: CommentListWithChildren;
  depth?: number;
}

export default function CommentBox({ comment, depth = 0 }: CommentBoxProps) {
    const hasChildren = comment.children && comment.children.length > 0;
    const totalReplies = comment._count?.children || 0;
    const loadedRepliesCount = comment.children?.length || 0;

    return (
      <CommentReplyProvider>
        <Card className="w-full py-2 border-none shadow-none bg-transparent">
          <CardHeader className="justify-between px-3 py-2">
            <div className="flex gap-3">
              <Avatar
                isBordered
                radius="full"
                size="sm"
                src={comment.user.image || ""}
              />
              <div className="flex flex-col gap-0 items-start justify-center">
                <h4 className="text-small font-semibold leading-none text-default-600">{comment.user.name}</h4>
                <h5  className="text-tiny tracking-tight text-default-400">{format(comment.createdAt,"PPP")}</h5>
              </div>
            </div>
            <CommentReplyTrigger />
          </CardHeader>
          <CardBody className="px-3 py-0 text-small text-default-600 space-y-3 pl-12">
            <p className="">{comment.content || ""}</p>
            <CommentReplyForm postId={comment.postId} commentId={comment.id} />
            
            {/* 递归渲染子评论 */}
            <div className="border-l-2 dark:border-gray-800 ml-1 pl-4 mt-2 space-y-3">
               {hasChildren && depth < 2 && (
                 comment.children!.map(child => (
                   <CommentBox key={child.id} comment={child} depth={depth + 1} />
                 ))
               )}

               {/* 如果深度达到限制，或者还有更多评论没加载，显示分支加载器 */}
               {(depth >= 2 || loadedRepliesCount < totalReplies) && totalReplies > 0 && (
                 <CommentBranchLoader 
                   parentId={comment.id} 
                   initialDepth={depth + 1}
                   totalReplies={totalReplies}
                   alreadyLoadedCount={depth < 2 ? loadedRepliesCount : 0}
                 />
               )}
            </div>
          </CardBody>
        </Card>
      </CommentReplyProvider>
    )
}