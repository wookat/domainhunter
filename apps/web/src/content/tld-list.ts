/**
 * 轻量 TLD 常量：首屏 bundle（App/prices 等）只需要列表与汇率，
 * 完整指南文案（TLD_GUIDES，约 60KB）留在 tlds.ts，仅由懒加载页面与 worker 引用。
 * TLD_GUIDES 通过 `satisfies Record<Tld, TldGuide>` 与本列表编译期强一致。
 */
export const TLD_LIST = [
  "com", "net", "org", "io", "ai", "co", "app", "dev", "xyz", "cc",
  "tv", "cn", "me", "tech", "online", "store", "site", "top", "shop", "cloud",
  "pro", "vip", "club", "link", "live", "space", "fun", "art", "design", "studio",
  "info", "sh", "gg", "so", "us", "in",
  "world", "life", "agency", "games", "email", "network",
  "digital", "media", "group", "center", "works", "zone",
  "news", "tools", "run", "codes", "company", "wiki",
  "blog", "team", "chat", "finance", "global", "host",
  "social", "video", "fund", "land", "click", "icu",
  "page", "bio", "ink", "moe", "lol", "uk",
  "fm", "one", "cool", "red", "today", "best",
  "wtf", "pizza", "bar", "cafe", "money", "gold",
  "band", "cash", "city", "estate", "expert", "farm",
  "blue", "pink", "black", "ninja", "rocks", "pet",
  "academy", "school", "coach", "care", "doctor", "restaurant",
  "boutique", "clinic", "dental", "fitness", "photos", "gallery",
  "salon", "yoga", "coffee", "wine", "kitchen", "garden",
  "photography", "events", "solutions", "services", "consulting", "software",
  "marketing", "systems", "ventures", "capital", "guru", "tips",
  "directory", "exchange", "institute", "international", "partners", "support",
  "plus", "house", "market", "watch", "style", "show",
  "website", "technology", "community", "education", "training", "love",
  "beauty", "fashion", "work", "sale", "help", "wedding",
  "law", "tax", "menu", "bike", "toys", "shoes",
  "travel", "tours", "vacations", "holiday", "flights", "taxi",
  "properties", "rentals", "apartments", "builders", "construction", "repair",
] as const;

export type Tld = (typeof TLD_LIST)[number];

/** 美元→人民币换算参考汇率（估算值，仅供参考展示） */
export const USD_TO_CNY = 7.2;
