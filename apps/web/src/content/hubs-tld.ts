/**
 * /tld 索引 hub 专属数据：双语元信息 + 分组逻辑。
 * 只依赖 tld-list + 生成的 hub-index-tld，不引入其他 hub 的索引，
 * /tld 页 chunk 只含自己那份数据（R282 移动性能优化）。
 */
import { TLD_ONE_LINERS } from "./hub-index-tld";
import { TLD_LIST, type Tld } from "./tld-list";

type Lang = "zh" | "en";

export const tldOneLiner = (tld: string, lang: Lang): string => TLD_ONE_LINERS[tld as Tld][lang];

/* ---------- /tld 分组：按用途归类，未列出的 TLD 自动进「更多后缀」 ---------- */

const TLD_CATEGORY_DEFS: { id: string; zh: string; en: string; members: string[] }[] = [
  { id: "general", zh: "通用主流", en: "General & mainstream", members: ["com", "net", "org", "co", "me", "info", "pro", "one", "top", "xyz", "icu", "link", "click", "best", "today", "cool", "plus", "website", "help", "day"] },
  { id: "tech", zh: "科技与开发", en: "Tech & developers", members: ["io", "ai", "app", "dev", "tech", "cloud", "codes", "tools", "run", "host", "network", "digital", "sh", "gg", "so", "zone", "wiki", "software", "systems", "support", "technology", "computer"] },
  { id: "creative", zh: "创意与设计", en: "Creative & design", members: ["art", "design", "studio", "ink", "moe", "lol", "wtf", "red", "page", "bio", "photos", "gallery", "photography", "style", "fashion", "beauty", "photo", "hair", "skin", "makeup", "camera", "clothing", "tattoo", "moda", "meme"] },
  { id: "media", zh: "内容与媒体", en: "Content & media", members: ["blog", "news", "media", "video", "tv", "fm", "chat", "social", "email", "live", "band", "watch", "show", "community", "guide", "reviews", "fyi", "press", "stream", "movie", "pictures", "productions", "audio", "forum", "review"] },
  { id: "commerce", zh: "商业与电商", en: "Business & commerce", members: ["shop", "store", "online", "site", "company", "group", "agency", "team", "works", "center", "global", "expert", "boutique", "solutions", "services", "consulting", "marketing", "guru", "tips", "directory", "international", "partners", "market", "work", "sale", "law", "tax", "shoes", "toys", "gifts", "ltd", "biz", "llc", "promo", "express", "lawyer", "legal", "delivery", "jewelry", "careers", "management", "equipment", "supply", "parts", "auction", "deals", "coupons", "discount", "business", "limited", "associates", "cheap", "bargains", "supplies", "diamonds", "accountants", "attorney", "gift", "luxury"] },
  { id: "finance", zh: "金融与资产", en: "Finance & assets", members: ["finance", "fund", "money", "cash", "gold", "estate", "land", "ventures", "capital", "exchange", "properties", "rentals", "apartments", "credit", "loans", "investments", "holdings", "mortgage", "rent", "homes", "casa"] },
  { id: "lifestyle", zh: "生活与行业", en: "Lifestyle & industries", members: ["life", "world", "club", "vip", "space", "fun", "games", "pizza", "bar", "cafe", "restaurant", "city", "farm", "academy", "school", "coach", "care", "doctor", "clinic", "dental", "fitness", "salon", "yoga", "coffee", "wine", "kitchen", "garden", "events", "institute", "house", "education", "training", "love", "wedding", "menu", "bike", "travel", "tours", "vacations", "holiday", "flights", "taxi", "builders", "construction", "repair", "energy", "solar", "green", "eco", "earth", "engineering", "family", "baby", "mom", "dad", "dog", "health", "fit", "dance", "golf", "tennis", "soccer", "football", "hockey", "surf", "vet", "recipes", "church", "cleaning", "plumbing", "catering", "florist", "courses", "degree", "mba", "study", "boats", "autos", "contractors", "furniture", "lighting", "camp", "theater", "engineer", "villas", "cruises", "voyage", "limo", "tickets", "flowers", "beer", "pub", "spa", "food", "dentist", "cooking", "party", "fishing", "horse", "singles", "dating", "organic", "vodka", "casino", "bet", "poker", "futbol", "basketball", "rugby", "cricket", "fish", "fan", "win", "quest", "kids", "foundation"] },
  { id: "geo", zh: "国别与地域", en: "Country & regional", members: ["cn", "us", "uk", "in", "cc", "wang"] },
];

const TLD_FALLBACK = { id: "more", zh: "更多后缀", en: "More TLDs" };

export function tldHubGroups(): { id: string; zh: string; en: string; tlds: string[] }[] {
  const listed = new Set(TLD_CATEGORY_DEFS.flatMap((c) => c.members));
  const groups = TLD_CATEGORY_DEFS.map((c) => ({ id: c.id, zh: c.zh, en: c.en, tlds: TLD_LIST.filter((t) => c.members.includes(t)) as string[] }));
  const rest = TLD_LIST.filter((t) => !listed.has(t));
  if (rest.length > 0) groups.push({ ...TLD_FALLBACK, tlds: rest });
  return groups.filter((g) => g.tlds.length > 0);
}

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
