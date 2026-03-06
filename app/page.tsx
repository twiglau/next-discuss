import CreateButton from "@/components/create-button";
import TopicList from "@/components/topic-list";
import PostList from "@/components/post-list";


export default async function App() {
  return (
    <div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-4">
          <h1 className="text-xl mt-20">TOP Post</h1>
          <PostList />
        </div>
        <div className="flex flex-col gap-4">
          <CreateButton path="/new">创建话题</CreateButton>
          <TopicList />
        </div>
      </div>
    </div>
  )
}