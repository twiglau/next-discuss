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
  name: string,
  prevStatus: PostFormState,
  formData: FormData,
) {
  let post: Post | undefined;
  try {
    const session = await auth();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    // 只需要校验 title,content
    const info = createPostSchema.safeParse({ title, content });
    if (!info.success) {
      return { errors: info.error.flatten().fieldErrors };
    }
    // 创建时，需要name
    post = await trpcServerCaller({ session }).post.create({
      ...info.data,
      name,
    });
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
