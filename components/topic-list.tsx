import { trpcServerCaller } from "@/trpc-caller/server"
import { auth } from "@/server/auth";
import { Chip, type ChipProps } from "@heroui/chip";
import { Badge } from "@heroui/badge";
import Link from "next/link";


export default async function TopicList() {
    const session = await auth();
    const topics = await trpcServerCaller({session}).topic.list();
    return (
        <div className="flex flex-wrap gap-4 max-w-sm">
            {topics.map((topic) => (
                <div key={topic.id}>
                    <Badge 
                    content={topic._count.posts} 
                    shape="rectangle" 
                    color="danger" 
                    placement="top-right">
                      <Chip 
                      color={topic.tag as  ChipProps['color']}
                      size="sm"
                      className="shadow-md"
                      >
                        <Link href={`/topics/${topic.name}`}>
                          {topic.name}
                        </Link>
                      </Chip>
                    </Badge>
                </div>
            ))}
        </div>
    )
}