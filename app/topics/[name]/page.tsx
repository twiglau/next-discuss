
type Props = {
  params: Promise<{ name: string }>;
};

export default async function TopicDetailPage({ params }: Props) {
  const { name } = await params;
  return (
    <div>
      <h1>{name}</h1>
    </div>
  )
}