import { trpcServerCaller } from "@/trpc-caller/server"



export default async function Postbox({postId}:{postId:string}) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const post = await trpcServerCaller({}).post.detail({postId})
  return (
    <div className="space-y-4">
        <h1>{post?.title}</h1>
        <p className="dark:bg-gray-800 bg-gray-200 rounded-md p-4">{post?.content}</p>
    </div>
  )
}