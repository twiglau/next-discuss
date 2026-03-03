import CreateButton from "@/components/create-button";

type Props = {
  params: Promise<{ name: string }>;
};

export default async function TopicDetailPage({ params }: Props) {
  const { name } = await params;
  return (
    <div>
        <div className="flex justify-between">
          <h1>{name}</h1>
          <div className="flex flex-col gap-4">
            <CreateButton path="/topics/new">创建帖子</CreateButton>
          </div>
        </div>
    </div>
  )
}