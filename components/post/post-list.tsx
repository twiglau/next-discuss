"use client";

import { PostListType } from "@/prisma/validate-schema";
import { Avatar, Listbox, ListboxItem } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function PostList({posts}:{posts: PostListType[]}) {
  const router = useRouter();
  return (
    <Listbox
      aria-label="TOP Post List"
      className="p-0 w-full overflow-visible shadow-small"
      itemClasses={{
        base: "px-3 mt-5 rounded-md gap-3 bg-default-50  data-[hover=true]:bg-default-100/80",
      }}
    >
      {
        posts.map((post) => (
          <ListboxItem
            key={post.id}
            title={post.title}
            startContent={
              post.user.image && <Avatar src={post.user.image} alt={post.user.name || ""} />
            }
            description={
              <div className="flex items-center justify-between pt-4">
                <div>{post.user.name}</div>
                <div className="text-gray-400">{post._count.comments} Comments</div>
              </div>
            }
            onPress={
              () => router.push(`/topics/${post.topic.name}/posts/${post.id}`)
            }
          />
        ))
      }
      
    </Listbox>
  );
}
