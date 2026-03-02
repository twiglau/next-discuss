import { z } from "zod";
export const createTopicSchema = z.object({
  title: z.string().min(2, "标题不能低于2位"),
  content: z
    .string()
    .min(5, "内容不嫩低于5位")
    .max(255, "内容长度不能多于255字符"),
});
export type CreateTopicType = z.infer<typeof createTopicSchema>;
