/**
 * /tld 分组定义与派生（轻量，仅依赖 tld-list）：
 * - tldHubGroups：/tld 索引 hub 的分组（原 hubs-tld.ts，抽出以便 /tld/:slug 详情页复用而不引入 hub 索引数据）；
 * - relatedTlds：/tld/:slug 详情页「相关 TLD」互链——同组内从自身之后环绕取最多 max 个。
 */
import { TLD_LIST } from "./tld-list";

const TLD_CATEGORY_DEFS: { id: string; zh: string; en: string; members: string[] }[] = [
  { id: "general", zh: "通用主流", en: "General & mainstream", members: ["com", "net", "org", "co", "me", "info", "pro", "one", "top", "xyz", "icu", "link", "click", "best", "today", "cool", "plus", "website", "help", "day", "sbs", "cyou"] },
  { id: "tech", zh: "科技与开发", en: "Tech & developers", members: ["io", "ai", "app", "dev", "tech", "cloud", "codes", "tools", "run", "host", "network", "digital", "sh", "gg", "so", "zone", "wiki", "software", "systems", "support", "technology", "computer", "mobi", "domains"] },
  { id: "creative", zh: "创意与设计", en: "Creative & design", members: ["art", "design", "studio", "ink", "moe", "lol", "wtf", "red", "page", "bio", "photos", "gallery", "photography", "style", "fashion", "beauty", "photo", "hair", "skin", "makeup", "camera", "clothing", "tattoo", "moda", "meme", "pics", "graphics", "actor"] },
  { id: "media", zh: "内容与媒体", en: "Content & media", members: ["blog", "news", "media", "video", "tv", "fm", "chat", "social", "email", "live", "band", "watch", "show", "community", "guide", "reviews", "fyi", "press", "stream", "movie", "pictures", "productions", "audio", "forum", "review", "buzz", "fans", "report"] },
  { id: "commerce", zh: "商业与电商", en: "Business & commerce", members: ["shop", "store", "online", "site", "company", "group", "agency", "team", "works", "center", "global", "expert", "boutique", "solutions", "services", "consulting", "marketing", "guru", "tips", "directory", "international", "partners", "market", "work", "sale", "law", "tax", "shoes", "toys", "gifts", "ltd", "biz", "llc", "promo", "express", "lawyer", "legal", "delivery", "jewelry", "careers", "management", "equipment", "supply", "parts", "auction", "deals", "coupons", "discount", "business", "limited", "associates", "cheap", "bargains", "supplies", "diamonds", "accountants", "attorney", "gift", "luxury", "shopping", "gmbh", "abogado", "kaufen"] },
  { id: "finance", zh: "金融与资产", en: "Finance & assets", members: ["finance", "fund", "money", "cash", "gold", "estate", "land", "ventures", "capital", "exchange", "properties", "rentals", "apartments", "credit", "loans", "investments", "holdings", "mortgage", "rent", "homes", "casa", "bond", "immo", "condos"] },
  { id: "lifestyle", zh: "生活与行业", en: "Lifestyle & industries", members: ["life", "world", "club", "vip", "space", "fun", "games", "pizza", "bar", "cafe", "restaurant", "city", "farm", "academy", "school", "coach", "care", "doctor", "clinic", "dental", "fitness", "salon", "yoga", "coffee", "wine", "kitchen", "garden", "events", "institute", "house", "education", "training", "love", "wedding", "menu", "bike", "travel", "tours", "vacations", "holiday", "flights", "taxi", "builders", "construction", "repair", "energy", "solar", "green", "eco", "earth", "engineering", "family", "baby", "mom", "dad", "dog", "health", "fit", "dance", "golf", "tennis", "soccer", "football", "hockey", "surf", "vet", "recipes", "church", "cleaning", "plumbing", "catering", "florist", "courses", "degree", "mba", "study", "boats", "autos", "contractors", "furniture", "lighting", "camp", "theater", "engineer", "villas", "cruises", "voyage", "limo", "tickets", "flowers", "beer", "pub", "spa", "food", "dentist", "cooking", "party", "fishing", "horse", "singles", "dating", "organic", "vodka", "casino", "bet", "poker", "futbol", "basketball", "rugby", "cricket", "fish", "fan", "win", "quest", "kids", "foundation", "monster", "glass", "vision", "tires", "surgery", "college", "vin", "university", "hospital", "rehab", "healthcare"] },
  { id: "geo", zh: "国别与地域", en: "Country & regional", members: ["cn", "us", "uk", "in", "cc", "wang", "asia", "place", "town", "nyc", "london", "tokyo", "miami", "boston"] },
];

const TLD_FALLBACK = { id: "more", zh: "更多后缀", en: "More TLDs" };

export function tldHubGroups(): { id: string; zh: string; en: string; tlds: string[] }[] {
  const listed = new Set(TLD_CATEGORY_DEFS.flatMap((c) => c.members));
  const groups = TLD_CATEGORY_DEFS.map((c) => ({ id: c.id, zh: c.zh, en: c.en, tlds: TLD_LIST.filter((t) => c.members.includes(t)) as string[] }));
  const rest = TLD_LIST.filter((t) => !listed.has(t));
  if (rest.length > 0) groups.push({ ...TLD_FALLBACK, tlds: rest });
  return groups.filter((g) => g.tlds.length > 0);
}

/** 同组相邻 TLD：从自身位置之后环绕取最多 max 个（确定性派生，SSR 与客户端一致） */
export function relatedTlds(tld: string, max = 6): string[] {
  const group = tldHubGroups().find((g) => g.tlds.includes(tld));
  if (!group) return [];
  const others = group.tlds.filter((t) => t !== tld);
  if (others.length <= max) return others;
  const idx = group.tlds.indexOf(tld);
  return [...others.slice(idx), ...others.slice(0, idx)].slice(0, max);
}
