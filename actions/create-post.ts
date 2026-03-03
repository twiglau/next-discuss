"use server";

import { trpcServerCaller } from "@/trpc-caller/server";
import { createPostSchema } from "@/prisma/validate-schema";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

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
  try {
    const session = await auth();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const info = createPostSchema.safeParse({ title, content });
    if (!info.success) {
      return { errors: info.error.flatten().fieldErrors };
    }
    await trpcServerCaller({ session }).post.create(info.data);
    return { errors: {} };
  } catch (error) {
    if (error instanceof Error) {
      return { errors: { _form: [error.message] } } as PostFormState;
    }
    return { errors: { _form: ["未知错误"] } } as PostFormState;
  }
}
