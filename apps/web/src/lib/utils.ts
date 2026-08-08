import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { TFunc } from "@/lib/i18n";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function friendlyHttpError(status: number, t: TFunc): string {
  if (status === 400) return t("error.badRequest");
  if (status === 429) return t("error.rateLimited");
  if (status >= 500) return t("error.server");
  return t("error.http", { status });
}

const EXPIRING_SOON_MS = 90 * 24 * 60 * 60 * 1000;

/** 到期时间格式化为 YYYY-MM-DD（UTC），非法输入返回 null */
export function formatExpiry(iso: string): string | null {
  const ts = Date.parse(iso);
  if (!Number.isFinite(ts)) return null;
  return new Date(ts).toISOString().slice(0, 10);
}

/** 是否在 90 天内到期（已过期也算），用于琥珀色提示 */
export function isExpiringSoon(iso: string): boolean {
  const ts = Date.parse(iso);
  return Number.isFinite(ts) && ts - Date.now() < EXPIRING_SOON_MS;
}

export function friendlyError(e: Error, t: TFunc): string {
  if (e instanceof TypeError) return t("error.network");
  return e.message || t("error.unknown");
}
