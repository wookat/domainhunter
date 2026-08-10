/**
 * /tld 索引 hub 专属数据：双语元信息 + 分组逻辑。
 * 只依赖 tld-list + 生成的 hub-index-tld，不引入其他 hub 的索引，
 * /tld 页 chunk 只含自己那份数据（R282 移动性能优化）。
 */
import { TLD_ONE_LINERS } from "./hub-index-tld";
import { TLD_LIST, type Tld } from "./tld-list";

type Lang = "zh" | "en";

export const tldOneLiner = (tld: string, lang: Lang): string => TLD_ONE_LINERS[tld as Tld][lang];

/* /tld 分组逻辑已抽至 tld-groups.ts（轻量、无 hub 索引依赖），供 /tld/:slug 详情页「相关 TLD」复用 */
export { tldHubGroups } from "./tld-groups";

/* ---------- /tld hub 页双语元信息（SSR meta 与 SPA 页面共用） ---------- */

export const TLD_HUB_META = {
  zh: {
    kicker: "TLD 指南",
    title: `全部 TLD 注册指南：${TLD_LIST.length} 个后缀怎么选`,
    desc: `${TLD_LIST.length} 个主流域名后缀的注册指南索引：按通用/科技/创意/行业/地域分类浏览，每个后缀一句话定位，配实时价格与命名建议，帮你选对后缀再猎名。`,
    intro: `不同后缀气质与价格差异巨大：.com 稳但缺货、.io 极客但贵、新顶级域便宜但认知度低。这里按用途分类收录全部 ${TLD_LIST.length} 个后缀的注册指南——每个后缀一句话定位，点进去看适合谁、多少钱、怎么起名。拿不准价格先看`,
    pricesLink: "价格总览",
  },
  en: {
    kicker: "TLD guides",
    title: `All TLD Registration Guides: How to Choose Among ${TLD_LIST.length} Suffixes`,
    desc: `Index of registration guides for ${TLD_LIST.length} popular TLDs, grouped by purpose — general, tech, creative, industry and regional. One-line positioning for each suffix, with live pricing and naming tips.`,
    intro: `Suffixes differ wildly in vibe and price: .com is safe but sold out, .io is geeky but pricey, new gTLDs are cheap but less recognized. Browse all ${TLD_LIST.length} TLD guides grouped by purpose — a one-liner for each, then dive in for audience, pricing and naming tips. Unsure about cost? Start with the`,
    pricesLink: "price overview",
  },
} as const;
