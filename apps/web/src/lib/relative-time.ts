/** 分享快照「创建于 X 天前」双语相对时间（按自然日差计，非 24h 取整） */

const DAY_MS = 24 * 3600 * 1000;

/** createdAt 距 now 的自然日差（本地时区）；createdAt 非法或晚于 now 记 0 */
export function daysBetween(createdAt: number, now: number): number {
  if (!Number.isFinite(createdAt) || createdAt <= 0 || createdAt >= now) return 0;
  const startOfDay = (t: number) => {
    const d = new Date(t);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };
  return Math.max(0, Math.round((startOfDay(now) - startOfDay(createdAt)) / DAY_MS));
}

/** "创建于今天 / 创建于 3 天前" | "Created today / Created 3 days ago" */
export function createdAgoLabel(createdAt: number, lang: string, now: number = Date.now()): string {
  const days = daysBetween(createdAt, now);
  if (lang === "zh") return days === 0 ? "创建于今天" : `创建于 ${days} 天前`;
  if (days === 0) return "Created today";
  return days === 1 ? "Created 1 day ago" : `Created ${days} days ago`;
}
