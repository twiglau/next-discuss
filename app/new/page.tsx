"use client";

import { createTopicSchema, type CreateTopicType } from "@/prisma/validate-schema";
import { Alert, Button, Input, Select, SelectItem, Textarea } from "@heroui/react"
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { trpcClientReact } from "@/trpc-caller/client";

type NewTopicProps = {
  isTitle?: boolean;
  onClose?: () => void;
}

export default function NewTopicPage({isTitle = true, onClose}:NewTopicProps) {

  const { isPending, mutate: createTopic, error } = trpcClientReact.topic.create.useMutation({
    onSuccess(data) {
      location.href = "/topics/" + data.name;
    }
  })
  const form = useForm<CreateTopicType>({
    resolver: zodResolver(createTopicSchema),
    defaultValues: {
      name: "",
      description: "",
      tag: "default"
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
        name="name"
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
        name="description"
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
        <Controller
        name="tag"
        control={form.control}
        render={({field, fieldState}) => (
          <Select 
          {...field}
          label="标签类型"
          labelPlacement="outside-top"
          isInvalid={fieldState.invalid}
          errorMessage={fieldState.error?.message}
          >
            <SelectItem key="default">Default</SelectItem>
            <SelectItem key="primary">Primary</SelectItem>
            <SelectItem key="secondary">Secondary</SelectItem>
            <SelectItem key="success">Success</SelectItem>
            <SelectItem key="warning">Warning</SelectItem>
            <SelectItem key="danger">Danger</SelectItem>
          </Select>
        )}
        />
      
        {error && <Alert color={"warning"} title={error.message} />}
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