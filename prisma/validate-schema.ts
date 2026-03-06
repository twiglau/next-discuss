import { z } from "zod";
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
  name: z.string(),
  title: z.string().min(2, "标题不能低于2位"),
  content: z
    .string()
    .min(5, "内容不嫩低于5位")
    .max(255, "内容长度不能多于255字符"),
});
export type CreatePostType = z.infer<typeof createPostSchema>;
