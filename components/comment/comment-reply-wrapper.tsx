"use client";

import React, { createContext, useContext, useState } from "react";
import { Button } from "@heroui/button";
import CommentForm from "./comment-form";

type CommentReplyContextType = {
  isComment: boolean;
  setIsComment: React.Dispatch<React.SetStateAction<boolean>>;
};

const CommentReplyContext = createContext<CommentReplyContextType | undefined>(undefined);

export function CommentReplyProvider({ children }: { children: React.ReactNode }) {
  const [isComment, setIsComment] = useState(false);
  return (
    <CommentReplyContext.Provider value={{ isComment, setIsComment }}>
      {children}
    </CommentReplyContext.Provider>
  );
}

export function CommentReplyTrigger() {
  const context = useContext(CommentReplyContext);
  if (!context) throw new Error("CommentReplyTrigger must be used within CommentReplyProvider");

  return (
    <Button
      color="primary"
      radius="full"
      size="sm"
      onPress={() => context.setIsComment((state) => !state)}
    >
      {context.isComment ? "取消回复" : "回复"}
    </Button>
  );
}

export function CommentReplyForm({ postId, commentId }: { postId: string; commentId: string }) {
  const context = useContext(CommentReplyContext);
  if (!context) throw new Error("CommentReplyForm must be used within CommentReplyProvider");

  if (!context.isComment) return null;

  return (
    <div className="mt-2 border-t pt-2 border-default-100">
      <CommentForm postId={postId} commentId={commentId} />
    </div>
  );
}
