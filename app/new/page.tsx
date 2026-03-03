"use client";

import { createTopicSchema, type CreateTopicType } from "@/prisma/validate-schema";
import { Button, Input, Textarea } from "@heroui/react"
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { trpcClientReact } from "@/trpc-caller/client";
import { redirect } from "next/navigation"

type NewTopicProps = {
  isTitle?: boolean;
  onClose?: () => void;
}

export default function NewTopicPage({isTitle = true, onClose}:NewTopicProps) {

  const { isPending, mutate: createTopic } = trpcClientReact.topic.create.useMutation({
    onSuccess() {
      onClose?.();
      redirect("/");
    }
  })
  const form = useForm<CreateTopicType>({
    resolver: zodResolver(createTopicSchema),
    defaultValues: {
      title: "",
      content: ""
    }
  })

  const onSubmit: SubmitHandler<CreateTopicType> = (data) => {
    createTopic(data);
  }
  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      {isTitle && <h1 className="text-xl text-center mt-20">创建话题</h1>}
      <form className="flex flex-col gap-3 w-full" onSubmit={form.handleSubmit(onSubmit)}>
        <Controller 
        name="title"
        control={form.control}
        render={({field, fieldState}) => (
          <Input 
          {...field}
          label="话题"
          labelPlacement="outside-top"
          isInvalid={fieldState.invalid}
          errorMessage={fieldState.error?.message}
          />

        )}
          />
        <Controller
        name="content"
        control={form.control}
        render={({field, fieldState}) => (

          <Textarea
          {...field}
          label="话题内容"
          labelPlacement="outside-top"
          isInvalid={fieldState.invalid}
          errorMessage={fieldState.error?.message}
          />

        )}
        />
        <Button 
        className="w-full" 
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