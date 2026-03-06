"use server";

import { trpcServerCaller } from "@/trpc-caller/server";
import { createPostSchema } from "@/prisma/validate-schema";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { Post } from "@/server/db/prisma";

export type PostFormState = {
  errors: {
    topicId?: string[];
    title?: string[];
    content?: string[];
    _form?: string[];
  };
};
export async function createPost(
  prevStatus: PostFormState,
  formData: FormData,
) {
  let post: Post | undefined;
  const name = formData.get("name") as string;
  try {
    const session = await auth();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const info = createPostSchema.safeParse({ name, title, content });
    if (!info.success) {
      return { errors: info.error.flatten().fieldErrors };
    }
    post = await trpcServerCaller({ session }).post.create(info.data);
    console.log("post创建成功", post);
  } catch (error) {
    console.log("post创建失败", error);
    if (error instanceof Error) {
      return { errors: { _form: [error.message] } } as PostFormState;
    }
    return { errors: { _form: ["未知错误"] } } as PostFormState;
  }
  redirect(`/topics/${encodeURIComponent(name)}/posts/${post?.id}`);
}
