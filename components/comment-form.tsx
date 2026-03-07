"use client";
import { createCommentSchema, CreateCommentType } from "@/prisma/validate-schema";
import { trpcClientReact } from "@/trpc-caller/client";
import { Button, Textarea } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";



export default function CommentForm({postId, commentId}: Omit<CreateCommentType, "content">) {

    const router = useRouter();
    const {mutate: createComment,isPending} = trpcClientReact.comment.create.useMutation({
        onSuccess: () => {
            form.reset()
            router.refresh();
        }
    })
    const form = useForm<CreateCommentType>({
        resolver: zodResolver(createCommentSchema),
        defaultValues: {
            postId,
            commentId,
            content: "",
        }
    })
    const onSubmit: SubmitHandler<CreateCommentType> = (data) => {
        createComment(data)
    }
    return <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
        <Controller
        name="content"
        control={form.control}
        render={({field, fieldState}) => (
          <Textarea
          {...field}
          minRows={3}
          label="评论" 
          variant="flat"
          classNames={{
            input: "py-2"
          }}
          placeholder="请输入评论内容" 
          labelPlacement="outside-top"
          isInvalid={fieldState.invalid}
          errorMessage={fieldState.error?.message}
          />
        )}
        />
        <Button 
        type="submit" 
        color="primary"
        disabled={isPending} 
        isLoading={isPending}>
            提交评论
        </Button>
    </form>
}