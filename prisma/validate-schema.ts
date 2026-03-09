import { z } from "zod";
import { Post, Comment } from "./db";

export const createTopicSchema = z.object({
  name: z.string().min(2, "标题不能低于2位"),
  tag: z.string().min(2, "标签不能低于2位"),
  description: z
    .string()
    .min(5, "内容不嫩低于5位")
    .max(255, "内容长度不能多于255字符"),
});
export type CreateTopicType = z.infer<typeof createTopicSchema>;

export const createPostSchema = z.object({
  name: z.string().optional(),
  title: z.string().min(2, "标题不能低于2位"),
  content: z
    .string()
    .min(5, "内容不嫩低于5位")
    .max(255, "内容长度不能多于255字符"),
});
export type CreatePostType = z.infer<typeof createPostSchema>;

export type PostListType = {
  user: {
    name: string | null;
    image?: string | null;
  };
  topic: {
    name: string;
  };
  _count: {
    comments: number;
  };
} & Post;

export const createCommentSchema = z.object({
  postId: z.string(),
  commentId: z.string().optional(),
  content: z.string().min(5, "评论最少5位字符"),
});

export type CreateCommentType = z.infer<typeof createCommentSchema>;

export type CommentListType = {
  user: {
    name: string | null;
    image?: string | null;
  };
  _count: {
    children: number;
  };
  createdAt: string;
  updatedAt: string;
} & Omit<Comment, "createdAt" | "updatedAt">;
