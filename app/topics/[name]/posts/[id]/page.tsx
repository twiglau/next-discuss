import CommentForm from "@/components/comment-form";
import Postbox from "@/components/post-box";
import PostboxLoading from "@/components/post-box-loading";
import { Suspense } from "react";


type PostDetailPageProps = {
    params: Promise<{
        name: string;
        id: string;
    }>
}

export default async function PostDetailPage({params}: PostDetailPageProps) {
    const {name, id} = await params;
    return <div className="space-y-4">
        <Suspense fallback={<PostboxLoading />}>
            <Postbox postId={id} />
        </Suspense>
        <CommentForm postId={id} />
    </div>
}