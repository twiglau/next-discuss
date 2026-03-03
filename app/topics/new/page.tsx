"use client";

import { Button } from "@heroui/button"
import { Alert } from "@heroui/alert"
import { Input, Textarea} from "@heroui/input"
import { trpcServerCaller } from "@/trpc-caller/server";
import { createPostSchema } from "@/prisma/validate-schema";
import React from "react";
import { useSession } from "next-auth/react";

type NewPostProps = {
  isTitle?: boolean;
  onClose?: () => void;
}
type FormState = {
    errors: {
        topicId?: string[];
        title?: string[];
        content?: string[];
        _form?:string[];
    }
}

export default function NewPostPage({isTitle = true, onClose}:NewPostProps) {
    const {data:session} = useSession();

    const onAction = async (prevStatus:FormState, formData: FormData) => {
        "use server";

        try {
            const title = formData.get("title") as string;
            const content = formData.get("content") as string;
            const info = createPostSchema.safeParse({title, content});
            if (!info.success) {
                return { errors: info.error.flatten().fieldErrors };
            }   
            const result = await trpcServerCaller({session}).post.create(info.data);
            if (result) {
                onClose?.();
            }
            return {errors:{}};
        } catch (error) {
            if (error instanceof Error) {
                return { errors: { _form: [error.message] } } as FormState;
            }
            return { errors: { _form: ["未知错误"] } } as FormState;
        }
    }

    const [status, action, isPending] = React.useActionState<FormState, FormData>(onAction, {errors:{}});

  
  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      {isTitle && <h1 className="text-xl text-center mt-20">创建帖子</h1>}
      <form className="flex flex-col gap-3 w-full" action={action}>
        <Input 
          name="title"
          label="帖子标题"
          labelPlacement="outside-top"
          isInvalid={!!status.errors.title}
          errorMessage={status.errors.title?.join(",")}
          />
        <Textarea
          name="content"
          label="帖子内容"
          labelPlacement="outside-top"
          isInvalid={!!status.errors.content}
          errorMessage={status.errors.content?.join(",")}
          />
      
        {!!status.errors._form && <Alert color={"warning"} title={status.errors._form.join(",")} />}
        <Button 
        className="w-full mt-4" 
        color="secondary" 
        type="submit"
        isLoading={isPending}
        isDisabled={isPending}
        >
          确认
        </Button>
      </form>
    </div>
  )
}