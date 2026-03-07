import CreateButton from "@/components/create-button";
import PostList from "@/components/post-list";
import { auth } from "@/server/auth";
import { trpcServerCaller } from "@/trpc-caller/server";

type Props = {
  params: Promise<{ name: string }>;
};

export default async function TopicDetailPage({ params }: Props) {
  const { name } = await params;
  const session = await auth();
  const decodedName = decodeURIComponent(name);
  const posts = await trpcServerCaller({ session }).post.getListWithTopicName({ name: decodedName})
  return (
    <div>
        <div className="flex justify-between gap-20">
          <div className="flex-1 max-w-2xl space-y-5">
            <h1>{decodedName}</h1>
            <PostList posts={posts}/>
          </div>
          <div className="flex flex-col gap-4">
            <CreateButton path={`/topics/new?name=${name}`}>创建帖子</CreateButton>
          </div>
        </div>
    </div>
  )
}