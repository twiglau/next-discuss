import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { CommentListType } from "@/prisma/validate-schema";
import { format } from "date-fns";
import { CommentReplyProvider, CommentReplyTrigger, CommentReplyForm } from "./comment-reply-wrapper";
import { trpcServerCaller } from "@/trpc-caller/server";

type CommentBoxProps = {
  comment: CommentListType;
  children?: React.ReactNode;
}

export default async function CommentBox({comment}: CommentBoxProps) {
    console.log(`[Server Component] Rendering CommentBox for comment: ${comment.id}`);
    const { comments } = await trpcServerCaller({}).comment.getListWithId({
      postId: comment.postId,
      parentId: comment.id
    })
    return (
      <CommentReplyProvider>
        <Card className="w-full py-2">
          <CardHeader className="justify-between">
            <div className="flex gap-5">
              <Avatar
                isBordered
                radius="full"
                size="md"
                src={comment.user.image || ""}
              />
              <div className="flex flex-col gap-1 items-start justify-center">
                <h4 className="text-small font-semibold leading-none text-default-600">{comment.user.name}</h4>
                <h5  className="text-small tracking-tight text-default-400">{format(comment.createdAt, "PPP")}</h5>
              </div>
            </div>
            <CommentReplyTrigger />
          </CardHeader>
          <CardBody className="px-3 py-0 text-small text-default-400 space-y-5">
            <p className="line-clamp-3">{comment.content || ""}</p>
            <CommentReplyForm postId={comment.postId} commentId={comment.id} />
            {comments.length > 0 && (
              <div className="border-l-2 dark:border-gray-800 ml-4 pl-4 space-y-3">
                {comments.map(ele => (
                  <CommentBox key={ele.id} comment={ele} />
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </CommentReplyProvider>
    )
}