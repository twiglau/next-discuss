

type PostDetailPageProps = {
    params: Promise<{
        name: string;
        id: string;
    }>
}

export default async function PostDetailPage({params}: PostDetailPageProps) {
    const {name, id} = await params;
    return <div>
        <div>{decodeURIComponent(name)}</div>
        <div>{id}</div>
    </div>
}