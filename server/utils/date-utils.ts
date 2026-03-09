import { format } from "date-fns";

type DeepFormat<T> = T extends Date
  ? string
  : T extends Array<infer R>
    ? Array<DeepFormat<R>>
    : T extends object
      ? { [K in keyof T]: DeepFormat<T[K]> }
      : T;

/**
 * 递归遍历对象，将所有 Date 类型转换为指定格式的字符串
 */
export function deepFormatDates<T>(obj: T): DeepFormat<T> {
  if (obj === null || obj === undefined) return obj as DeepFormat<T>;

  // 如果是 Date 对象，直接格式化
  if (obj instanceof Date) {
    return format(obj, "yyyy-MM-dd HH:mm:ss") as DeepFormat<T>;
  }

  // 如果是数组，递归处理每一项
  if (Array.isArray(obj)) {
    return obj.map((item) => deepFormatDates(item)) as DeepFormat<T>;
  }

  // 如果是普通的 Object，递归处理每个 Key
  if (typeof obj === "object") {
    const newObj: Record<string, unknown> = {};
    const sourceObj = obj as Record<string, unknown>;

    for (const key in sourceObj) {
      if (Object.prototype.hasOwnProperty.call(sourceObj, key)) {
        newObj[key] = deepFormatDates(sourceObj[key]);
      }
    }
    return newObj as DeepFormat<T>;
  }

  return obj as DeepFormat<T>;
}

/**
 * 保留原有函数名以兼容现有代码（稍后会删除）
 */
export const formatDates = <T extends { createdAt: Date; updatedAt: Date }>(
  obj: T,
) => deepFormatDates(obj);

export const formatDatesMany = <T extends { createdAt: Date; updatedAt: Date }>(
  list: T[],
) => deepFormatDates(list);
