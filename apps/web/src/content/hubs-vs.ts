/**
 * /vs 索引 hub 专属数据：双语元信息 + 分组逻辑。
 * 只依赖生成的 hub-index-vs，不引入其他 hub 的索引，
 * /vs 页 chunk 只含自己那份数据（R282 移动性能优化）。
 */
import { COMPARE_INDEX } from "./hub-index-vs";

type Lang = "zh" | "en";

export { COMPARE_INDEX };

const COMPARE_BY_SLUG = new Map(COMPARE_INDEX.map((c) => [c.slug, c]));

export const compareHubTitle = (slug: string, lang: Lang): string => COMPARE_BY_SLUG.get(slug)!.title[lang];

export const compareHubPair = (slug: string): { a: string; b: string } => COMPARE_BY_SLUG.get(slug)!;

/* ---------- /vs 分组：按左侧（a 位）TLD 分组，组内保持收录顺序 ---------- */

export function compareHubGroups(): { tld: string; slugs: string[] }[] {
  const byTld = new Map<string, string[]>();
  for (const { slug, a } of COMPARE_INDEX) {
    const arr = byTld.get(a) ?? [];
    arr.push(slug);
    byTld.set(a, arr);
  }
  return [...byTld.entries()]
    .sort((x, y) => (x[0] < y[0] ? -1 : 1))
    .map(([tld, slugs]) => ({ tld, slugs }));
}

/* ---------- /vs hub 页双语元信息（SSR meta 与 SPA 页面共用） ---------- */

export const VS_HUB_META = {
  zh: {
    kicker: "后缀对比",
    title: `全部后缀对比：${COMPARE_INDEX.length} 组 TLD 怎么选`,
    desc: `${COMPARE_INDEX.length} 组域名后缀对比索引：com vs cn、io vs ai 等常见纠结组合，按后缀分组浏览，每组给出结论、适用场景与价格差异，帮你快速拍板。`,
    intro: `选后缀常在两个之间纠结：com 还是 cn？io 还是 ai？这里按左侧后缀分组收录全部 ${COMPARE_INDEX.length} 组对比——每组给出怎么选的结论、各自适用场景与价格差异，看完直接用 AI 同时在两个后缀下猎名。`,
  },
  en: {
    kicker: "TLD comparisons",
    title: `All TLD Comparisons: ${COMPARE_INDEX.length} Head-to-Head Matchups`,
    desc: `Index of ${COMPARE_INDEX.length} TLD comparisons — com vs cn, io vs ai and other common dilemmas, grouped by suffix. Each gives a verdict, pick-when scenarios and price differences to help you decide fast.`,
    intro: `Choosing a suffix usually comes down to two finalists: com or cn? io or ai? Browse all ${COMPARE_INDEX.length} matchups grouped by the left-hand suffix — each gives a verdict, pick-when scenarios and price differences, then hunt names on both suffixes at once with AI.`,
  },
} as const;
