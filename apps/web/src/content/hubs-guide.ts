/**
 * /guide 索引 hub 专属数据：双语元信息 + 分组逻辑。
 * 只依赖生成的 hub-index-guide，不引入其他 hub 的索引，
 * /guide 页 chunk 只含自己那份数据（R282 移动性能优化）。
 */
import { GUIDE_INDEX } from "./hub-index-guide";

type Lang = "zh" | "en";

export { GUIDE_INDEX };

const GUIDE_BY_SLUG = new Map(GUIDE_INDEX.map((g) => [g.slug, g]));

export const guideOneLiner = (slug: string, lang: Lang): string => GUIDE_BY_SLUG.get(slug)!.oneLiner[lang];

export const guideHubLabel = (slug: string, lang: Lang): string => GUIDE_BY_SLUG.get(slug)!.label[lang];

/** 同义搜索词（仅参与 hub 即时过滤匹配，不渲染到卡面） */
export const guideKeywords = (slug: string): string[] => GUIDE_BY_SLUG.get(slug)!.keywords ?? [];

/* /guide 分组逻辑已抽至 guide-groups.ts（轻量、无 hub 索引依赖），供 /guide/:slug 详情页「相关行业指南」复用 */
export { guideHubGroups } from "./guide-groups";

/* ---------- /guide hub 页双语元信息（SSR meta 与 SPA 页面共用） ---------- */

export const GUIDE_HUB_META = {
  zh: {
    kicker: "行业指南",
    title: `全部行业命名指南：${GUIDE_INDEX.length} 个行业怎么起名`,
    desc: `${GUIDE_INDEX.length} 个行业的产品命名指南索引：按科技/电商/餐饮/内容/教育/健康等大类浏览，每个行业一句话概览，含命名思路、好名字拆解与推荐 TLD。`,
    intro: `好名字的标准因行业而异：SaaS 要能当动词用，餐饮要有画面感，法律要稳重可靠。这里按大类收录全部 ${GUIDE_INDEX.length} 个行业的命名指南——每篇含命名思路、知名品牌好名字拆解、推荐 TLD 与常见误区，看完直接用 AI 按行业模板猎名。`,
  },
  en: {
    kicker: "Industry guides",
    title: `All Industry Naming Guides: How to Name a Product in ${GUIDE_INDEX.length} Industries`,
    desc: `Index of naming guides for ${GUIDE_INDEX.length} industries, grouped by category — tech, e-commerce, food, content, education, health and more. One-line overview per industry, with naming strategies, name breakdowns and recommended TLDs.`,
    intro: `What makes a great name differs by industry: SaaS names should work as verbs, food brands need imagery, legal services need gravitas. Browse all ${GUIDE_INDEX.length} industry naming guides by category — each covers naming strategies, famous-name breakdowns, recommended TLDs and common mistakes, then hunt names with the AI template.`,
  },
} as const;
