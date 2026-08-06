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

export function friendlyError(e: Error, t: TFunc): string {
  if (e instanceof TypeError) return t("error.network");
  return e.message || t("error.unknown");
}
