import CreateButton from "@/components/create-button";


export default async function App() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1>话题</h1>
        <CreateButton />
      </div>
    </div>
  )
}