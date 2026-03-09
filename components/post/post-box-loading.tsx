import { Skeleton } from "@heroui/skeleton";

export default function PostboxLoading() {
    return <div className="space-y-5">
        <Skeleton className="rounded-lg max-w-40">
            <div className="h-5 rounded-lg bg-default-300" />
        </Skeleton>
        <Skeleton className="rounded-lg">
            <div className="h-20 rounded-lg bg-default-300" />
        </Skeleton>
    </div>
}