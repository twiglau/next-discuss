"use client";

import React from "react";
import { Button } from "@heroui/button"
import { Alert } from "@heroui/alert"
import { Input, Textarea} from "@heroui/input"
import { createPost, type PostFormState } from "@/actions";
import { useSearchParams } from "next/navigation";

type NewPostProps = {
  isTitle?: boolean;
  onClose?: () => void;
}

export default function NewPostPage({isTitle = true, onClose}:NewPostProps) {
 
 const searchParams = useSearchParams();
 const name = searchParams.get("name");
 const [_, startTransition] = React.useTransition();
 const [status, action, isPending] = React.useActionState<PostFormState, FormData>(createPost, {errors:{}});

 const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // e => FormData
  // FormData中需要加入name
  const formData = new FormData(e.target as HTMLFormElement);
  formData.append("name", name as string);
  startTransition(async () => {
    await action(formData);
  })
 }
  
  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      {isTitle && <h1 className="text-xl text-center mt-20">创建帖子</h1>}
      <form className="flex flex-col gap-3 w-full" onSubmit={handleSubmit} noValidate>
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