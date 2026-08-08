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
const MAX_PLAUSIBLE_EXPIRY_YEARS = 15;

/** 到期日期是否可信：不超过今天 + 15 年（域名单次最长注册 10 年；部分注册局对保留域返回 3000-01-01 等哨兵值）。过去日期（已过期）有效 */
export function isPlausibleExpiry(iso: string): boolean {
  const ts = Date.parse(iso);
  if (!Number.isFinite(ts)) return false;
  const max = new Date();
  max.setUTCFullYear(max.getUTCFullYear() + MAX_PLAUSIBLE_EXPIRY_YEARS);
  return ts <= max.getTime();
}

/** 到期时间格式化为 YYYY-MM-DD（UTC），非法或不可信输入返回 null */
export function formatExpiry(iso: string): string | null {
  if (!isPlausibleExpiry(iso)) return null;
  return new Date(Date.parse(iso)).toISOString().slice(0, 10);
}

const PLAUSIBLE_MIN_TS = Date.UTC(1990, 0, 1);
const PLAUSIBLE_MAX_YEARS_MS = 50 * 365 * 24 * 60 * 60 * 1000;

/** 注册局哨兵值（如 1970-01-01、9999-12-31）不是真实到期时间，不予展示 */
export function isPlausibleExpiry(iso: string): boolean {
  const ts = Date.parse(iso);
  return Number.isFinite(ts) && ts >= PLAUSIBLE_MIN_TS && ts - Date.now() < PLAUSIBLE_MAX_YEARS_MS;
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
