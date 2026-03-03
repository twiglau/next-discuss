import CreateButton from "@/components/create-button";
import TopicList from "@/components/topic-list";


export default async function App() {
  return (
    <div>
      <div className="flex justify-between">
        <h1>TOP话题</h1>
        <div className="flex flex-col gap-4">
          <CreateButton path="/new">创建话题</CreateButton>
          <TopicList />
        </div>
      </div>
    </div>
  )
}