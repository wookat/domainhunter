import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function friendlyHttpError(status: number): string {
  if (status === 400) return "请求内容不符合要求：请检查描述是否为空或过长（最多 500 字）";
  if (status === 429) return "请求太频繁，请稍后再试";
  if (status >= 500) return "服务暂时不可用，请稍后再试";
  return `请求失败，请稍后再试（错误码 ${status}）`;
}

export function friendlyError(e: Error): string {
  if (e instanceof TypeError) return "网络连接异常，请检查网络后重试";
  return e.message || "发生未知错误，请稍后再试";
}
