"use client";

import React, { useState } from "react";
import { Button } from "@heroui/button";
import { trpcPureClient } from "@/trpc-caller/client";
import CommentBox from "./comment-box";
import { CommentListType } from "@/prisma/validate-schema";

type CommentBranchLoaderProps = {
  parentId: string;
  initialDepth: number;
  totalReplies: number;
  alreadyLoadedCount: number;
}

export default function CommentBranchLoader({
  parentId,
  initialDepth,
  totalReplies,
  alreadyLoadedCount,
}: CommentBranchLoaderProps) {
  const [replies, setReplies] = useState<CommentListType[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasLoadedInitially, setHasLoadedInitially] = useState(alreadyLoadedCount > 0);

  const pageSize = 2;
  const remainingCount = totalReplies - (alreadyLoadedCount + replies.length);

  const loadMore = async () => {
    setLoading(true);
    try {
      const result = await trpcPureClient.comment.getPaginatedReplies.query({
        parentId,
        page: page,
        pageSize,
      });

      setReplies((prev) => [...prev, ...result.comments]);
      setPage((prev) => prev + 1);
      setHasLoadedInitially(true);
    } catch (error) {
      console.error("Failed to load replies:", error);
    } finally {
      setLoading(false);
    }
  };

  if (remainingCount <= 0 && hasLoadedInitially) {
    return null;
  }

  return (
    <div className="mt-2">
      {/* 渲染加载到的回复 */}
      {replies.map((reply) => (
        <CommentBox key={reply.id} comment={reply} depth={initialDepth} />
      ))}

      {/* 加载更多按钮 */}
      {remainingCount > 0 && (
        <Button
          variant="light"
          size="sm"
          onPress={loadMore}
          isLoading={loading}
          className="text-primary font-medium"
        >
          {loading ? "加载中..." : !hasLoadedInitially ? `查看回复 (${remainingCount})` : `更多回复 (${remainingCount})`}
        </Button>
      )}
    </div>
  );
}
