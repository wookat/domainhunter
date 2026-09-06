/**
 * 内容页底部「其他 TLD 指南 / 其他行业命名指南 / 其他后缀对比」链接 chip 的选择规则（R520，R512 建议 #3）。
 * 纯函数、确定性派生，SSR（ssr-html.ts）与 SPA（tld-page / guide-page / compare-page）共用，逐字一致。
 *
 * 规则：
 * - 只取「同组」页面（tld-groups.ts / guide-groups.ts 的现有分组，含兜底组「更多后缀 / 更多行业」）；
 * - 组内保持现有顺序（TLD_LIST / GUIDE_LIST / COMPARE_SLUGS 收录顺序），排除自身；
 * - 超过 GROUP_CHIP_MAX（30）个时截断为前 30 个（不做环绕/随机，保证每页 chip 集合稳定）；
 *   被截断的同组页仍可经紧随其后的『查看全部 N 个 →』hub 链接（带分组锚点）及 hub 页全量到达，
 *   相邻页另由「相关 TLD / 相关行业指南」（relatedTlds / relatedGuideSlugs，自身之后环绕 6 个）覆盖；
 * - /vs：取两侧 TLD 所属组 TLD 集合的并集 U（无组归属的 TLD 视为单元素组 {tld}，即 U 至少含两侧 TLD 自身），
 *   候选 = COMPARE_SLUGS 中「两侧 TLD 都 ∈ U」的对比（去重、排除自身、保持 COMPARE_SLUGS 顺序），再截断前 COMPARE_CHIP_MAX（24）；
 *   /vs chip 文案「.com vs .cn」计 3 词（tld/guide chip 为 1–2 词），24 个使英文正文最短的 /vs 页链接占比也 <25%（实测 30 个时 25.9%）；
 *   候选为空（两侧都无组且没有其他共享 TLD 的对比）时返回 []，页面只渲染 hub 链接。
 * - N 由现有计数源派生（TLD_LIST / GUIDE_LABELS / COMPARE_SLUGS 长度），不写死。
 */
import { COMPARE_SLUGS } from "./compare-slugs";
import { GUIDE_LABELS } from "./guide-labels";
import { guideHubGroups } from "./guide-groups";
import { tldHubGroups } from "./tld-groups";
import { TLD_LIST } from "./tld-list";

type Lang = "zh" | "en";

export const GROUP_CHIP_MAX = 30;
/** /vs 专用上限（≤ GROUP_CHIP_MAX，见文件头说明） */
export const COMPARE_CHIP_MAX = 24;

/** 同组 chip 选择结果：chips 为最多 max 个 slug；anchor 为对应 hub 页的分组锚点 id（hub-g-<anchor>，无组归属为 null） */
export interface GroupChips {
  chips: string[];
  anchor: string | null;
  /** 排除自身后的同组总数（>chips.length 即发生了截断） */
  total: number;
}

const pick = (members: readonly string[], self: string, max: number): string[] => members.filter((m) => m !== self).slice(0, max);

/** /tld/:tld 底部「其他 TLD 指南」：同组（TLD_LIST 顺序）排除自身取前 max 个 */
export function tldGroupChips(tld: string, max = GROUP_CHIP_MAX): GroupChips {
  const group = tldHubGroups().find((g) => g.tlds.includes(tld));
  if (!group) return { chips: [], anchor: null, total: 0 };
  return { chips: pick(group.tlds, tld, max), anchor: group.id, total: group.tlds.length - 1 };
}

/** /guide/:slug 底部「其他行业命名指南」：同组（GUIDE_LIST 顺序）排除自身取前 max 个 */
export function guideGroupChips(slug: string, max = GROUP_CHIP_MAX): GroupChips {
  const group = guideHubGroups().find((g) => g.slugs.includes(slug));
  if (!group) return { chips: [], anchor: null, total: 0 };
  return { chips: pick(group.slugs, slug, max), anchor: group.id, total: group.slugs.length - 1 };
}

/**
 * /vs/:slug 底部「其他后缀对比」：两侧 TLD 所属组并集 U 内的对比（两侧都 ∈ U），COMPARE_SLUGS 顺序、去重、排除自身、前 max（默认 24）个。
 * 无组归属的 TLD 以自身为单元素组兜底；anchor 为 a 侧 TLD（/vs hub 按 a 侧 TLD 分组，锚点 hub-g-<a>）。
 */
export function compareGroupChips(slug: string, max = COMPARE_CHIP_MAX, slugs: readonly string[] = COMPARE_SLUGS): GroupChips {
  const [a, b] = slug.split("-vs-");
  if (!a || !b) return { chips: [], anchor: null, total: 0 };
  const groups = tldHubGroups();
  const ga = groups.find((g) => g.tlds.includes(a));
  const gb = groups.find((g) => g.tlds.includes(b));
  const union = new Set<string>([a, b, ...(ga?.tlds ?? []), ...(gb?.tlds ?? [])]);
  const pool = [...new Set(slugs)].filter((s) => s !== slug && s.split("-vs-").every((t) => union.has(t)));
  return { chips: pool.slice(0, max), anchor: a, total: pool.length };
}

/** 『查看全部 N 个 →』hub 链接文案：N 由现有计数源派生（与 i18n prices.seeAll 同风格），SSR/SPA 同源 */
export const VIEW_ALL_LABEL: Record<"tld" | "guide" | "vs", Record<Lang, string>> = {
  tld: { zh: `查看全部 ${TLD_LIST.length} 个 TLD 指南 →`, en: `View all ${TLD_LIST.length} TLD guides →` },
  guide: { zh: `查看全部 ${GUIDE_LABELS.length} 个行业命名指南 →`, en: `View all ${GUIDE_LABELS.length} industry naming guides →` },
  vs: { zh: `查看全部 ${COMPARE_SLUGS.length} 个后缀对比 →`, en: `View all ${COMPARE_SLUGS.length} TLD comparisons →` },
};

/** 『查看全部』指向的 hub 路径（有组归属时带 hub 页分组锚点 #hub-g-<anchor>，与 ssr-html hubSection / hub 页 section id 一致） */
export function viewAllHref(kind: "tld" | "guide" | "vs", anchor: string | null, lang: Lang): string {
  return `/${kind}?lang=${lang}${anchor ? `#hub-g-${anchor}` : ""}`;
}
