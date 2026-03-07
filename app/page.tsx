import CreateButton from "@/components/create-button";
import TopicList from "@/components/topic-list";
import PostList from "@/components/post-list";
import { trpcServerCaller } from "@/trpc-caller/server";


export default async function App() {
  const posts = await trpcServerCaller({}).post.getTop5List();
  return (
    <div>
      <div className="flex justify-between gap-20">
        <div className="flex flex-col gap-4 flex-1">
          <h1 className="text-xl mt-20">TOP 帖子</h1>
          <PostList posts={posts}/>
        </div>
        <div className="flex flex-col gap-4">
          <CreateButton path="/new">创建话题</CreateButton>
          <TopicList />
        </div>
      </div>
    </div>
  )
}