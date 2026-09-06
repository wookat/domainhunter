export type SearchMode = "ai" | "exact";

/**
 * 首页落地时的搜索模式：
 * - `?mode=exact` 显式指定精确核验；
 * - `?q=` 看起来是现成名字/域名（分享搜索链接、/tld /guide「去核验」、/monitors「查可用性」）→ 精确核验，
 *   避免「AI 猎名」tab 高亮 + 主按钮「开始猎取」误导用户消耗 AI 额度；
 * - 其余（自然语言寓意、`?tpl=` 模板、无参数）→ AI 猎名。
 * 只影响本次落地的初始 tab，不写入任何偏好存储。
 */
export function landingSearchMode(search: string, looksExact: (q: string) => boolean): SearchMode {
  const params = new URLSearchParams(search);
  if (params.get("mode") === "exact") return "exact";
  const q = params.get("q")?.trim();
  if (q && looksExact(q)) return "exact";
  return "ai";
}

/** 是否为 `?q=` 精确核验落地（用于结果区就位后自动滚动到结果，仅落地那一次） */
export function isExactQueryLanding(search: string, looksExact: (q: string) => boolean): boolean {
  const params = new URLSearchParams(search);
  const q = params.get("q")?.trim();
  return Boolean(q && looksExact(q));
}
