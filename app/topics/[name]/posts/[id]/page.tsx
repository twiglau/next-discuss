import CommentForm from "@/components/comment/comment-form";
import CommentList from "@/components/comment/comment-list";
import Postbox from "@/components/post/post-box";
import PostboxLoading from "@/components/post/post-box-loading";
import { Suspense } from "react";

type PostDetailPageProps = {
  params: Promise<{
    name: string;
    id: string;
  }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function PostDetailPage({
  params,
  searchParams,
}: PostDetailPageProps) {
  const { id } = await params;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  return (
    <div className="space-y-4">
      <Suspense fallback={<PostboxLoading />}>
        <Postbox postId={id} />
      </Suspense>
      <CommentForm postId={id} />
      <CommentList postId={id} page={currentPage} />
    </div>
  );
}