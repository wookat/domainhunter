/**
 * 内容枢纽索引页（/tld、/guide、/vs）共享数据：双语元信息 + 分组逻辑。
 * 前端 hub 页面组件与 worker（SSR meta / 骨架 / OG）共用。
 * 计数与条目全部从 TLD_LIST / GUIDE_LIST / COMPARE_LIST 动态派生；
 * 分组只声明成员归属，未归类的新条目自动落入「更多」兜底分组。
 */
import { TLD_LIST } from "./tld-list";
import { TLD_GUIDES } from "./tlds";
import { GUIDE_LIST, INDUSTRY_GUIDES } from "./guides";
import { COMPARE_LIST, TLD_COMPARES } from "./compares";

type Lang = "zh" | "en";

/** 取 metaDescription 首句作一句话定位（zh 以「。」断句，en 以 ". " 断句） */
const firstSentence = (s: string, lang: Lang): string => {
  const cut = lang === "zh" ? s.split("。")[0] + "。" : s.split(". ")[0].replace(/\.?$/, ".");
  return cut;
};

export const tldOneLiner = (tld: string, lang: Lang): string => firstSentence(TLD_GUIDES[tld][lang].metaDescription, lang);

export const guideOneLiner = (slug: string, lang: Lang): string => firstSentence(INDUSTRY_GUIDES[slug][lang].metaDescription, lang);

/* ---------- /tld 分组：按用途归类，未列出的 TLD 自动进「更多后缀」 ---------- */

const TLD_CATEGORY_DEFS: { id: string; zh: string; en: string; members: string[] }[] = [
  { id: "general", zh: "通用主流", en: "General & mainstream", members: ["com", "net", "org", "co", "me", "info", "pro", "one", "top", "xyz", "icu", "link", "click", "best", "today", "cool"] },
  { id: "tech", zh: "科技与开发", en: "Tech & developers", members: ["io", "ai", "app", "dev", "tech", "cloud", "codes", "tools", "run", "host", "network", "digital", "sh", "gg", "so", "zone", "wiki", "software"] },
  { id: "creative", zh: "创意与设计", en: "Creative & design", members: ["art", "design", "studio", "ink", "moe", "lol", "wtf", "red", "page", "bio", "photos", "gallery", "photography"] },
  { id: "media", zh: "内容与媒体", en: "Content & media", members: ["blog", "news", "media", "video", "tv", "fm", "chat", "social", "email", "live", "band"] },
  { id: "commerce", zh: "商业与电商", en: "Business & commerce", members: ["shop", "store", "online", "site", "company", "group", "agency", "team", "works", "center", "global", "expert", "boutique", "solutions", "services", "consulting"] },
  { id: "finance", zh: "金融与资产", en: "Finance & assets", members: ["finance", "fund", "money", "cash", "gold", "estate", "land"] },
  { id: "lifestyle", zh: "生活与行业", en: "Lifestyle & industries", members: ["life", "world", "club", "vip", "space", "fun", "games", "pizza", "bar", "cafe", "restaurant", "city", "farm", "academy", "school", "coach", "care", "doctor", "clinic", "dental", "fitness", "salon", "yoga", "coffee", "wine", "kitchen", "garden", "events"] },
  { id: "geo", zh: "国别与地域", en: "Country & regional", members: ["cn", "us", "uk", "in", "cc"] },
];

const TLD_FALLBACK = { id: "more", zh: "更多后缀", en: "More TLDs" };

export function tldHubGroups(): { id: string; zh: string; en: string; tlds: string[] }[] {
  const listed = new Set(TLD_CATEGORY_DEFS.flatMap((c) => c.members));
  const groups = TLD_CATEGORY_DEFS.map((c) => ({ id: c.id, zh: c.zh, en: c.en, tlds: TLD_LIST.filter((t) => c.members.includes(t)) as string[] }));
  const rest = TLD_LIST.filter((t) => !listed.has(t));
  if (rest.length > 0) groups.push({ ...TLD_FALLBACK, tlds: rest });
  return groups.filter((g) => g.tlds.length > 0);
}

/* ---------- /guide 分组：按行业大类归类，未列出的 slug 自动进「更多行业」 ---------- */

const GUIDE_CATEGORY_DEFS: { id: string; zh: string; en: string; members: string[] }[] = [
  { id: "tech", zh: "科技与互联网", en: "Tech & internet", members: ["saas", "ai", "agent", "devtools", "web3", "security", "hardware", "opensource", "indiehacker", "indiegame", "drone", "solar", "3dprint"] },
  { id: "ecommerce", zh: "电商与零售", en: "E-commerce & retail", members: ["ecommerce", "crossborder", "livestream", "resale", "fleamarket", "sourcing", "forwarder", "usedcar", "fashion", "jewelry", "toys", "furniture", "hanfu", "petsupplies", "gearrental", "vending"] },
  { id: "food", zh: "餐饮与食品", en: "Food & beverage", members: ["food", "coffee", "bakery", "brewery", "farm", "foodtruck", "mealprep"] },
  { id: "content", zh: "内容与创作", en: "Content & creators", members: ["blog", "podcast", "newsletter", "creator", "music", "photography", "travelshoot", "mcn", "boardgame", "pottery"] },
  { id: "edu", zh: "教育与知识", en: "Education & knowledge", members: ["edu", "courses", "studyabroad", "codingschool", "language", "preschool", "bookstore", "translation", "knowledgepay", "swimschool", "kidsart", "danceschool", "drivingschool"] },
  { id: "health", zh: "健康与运动", en: "Health & fitness", members: ["fitness", "health", "yoga", "coach", "crossfit", "therapy", "dental", "eldercare", "ski", "climbing", "martialarts", "billiards", "massage"] },
  { id: "travel", zh: "旅行与出行", en: "Travel & mobility", members: ["travel", "bnb", "outdoor", "automotive", "moving", "logistics", "rvtravel", "bikeshop", "fishing"] },
  { id: "local", zh: "生活服务", en: "Local services", members: ["pets", "vet", "aquarium", "cleaning", "barber", "beauty", "wedding", "florist", "gardening", "interior", "events", "escaperoom", "parenting", "pettraining", "nailsalon", "laundry", "matchmaking", "tattoo", "repair", "optician"] },
  { id: "business", zh: "商业与专业服务", en: "Business & professional", members: ["fintech", "legal", "accounting", "insurance", "recruiting", "realestate", "agency", "freelance", "marketing", "coworking", "resume", "nonprofit", "community", "game", "esports"] },
];

const GUIDE_FALLBACK = { id: "more", zh: "更多行业", en: "More industries" };

export function guideHubGroups(): { id: string; zh: string; en: string; slugs: string[] }[] {
  const listed = new Set(GUIDE_CATEGORY_DEFS.flatMap((c) => c.members));
  const groups = GUIDE_CATEGORY_DEFS.map((c) => ({ id: c.id, zh: c.zh, en: c.en, slugs: GUIDE_LIST.filter((s) => c.members.includes(s)) }));
  const rest = GUIDE_LIST.filter((s) => !listed.has(s));
  if (rest.length > 0) groups.push({ ...GUIDE_FALLBACK, slugs: rest });
  return groups.filter((g) => g.slugs.length > 0);
}

/* ---------- /vs 分组：按左侧（a 位）TLD 分组，组内保持收录顺序 ---------- */

export function compareHubGroups(): { tld: string; slugs: string[] }[] {
  const byTld = new Map<string, string[]>();
  for (const slug of COMPARE_LIST) {
    const a = TLD_COMPARES[slug].a;
    const arr = byTld.get(a) ?? [];
    arr.push(slug);
    byTld.set(a, arr);
  }
  return [...byTld.entries()]
    .sort((x, y) => (x[0] < y[0] ? -1 : 1))
    .map(([tld, slugs]) => ({ tld, slugs }));
}

/* ---------- 三个 hub 页的双语元信息（SSR meta 与 SPA 页面共用） ---------- */

export const HUB_META = {
  tld: {
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
  },
  guide: {
    zh: {
      kicker: "行业指南",
      title: `全部行业命名指南：${GUIDE_LIST.length} 个行业怎么起名`,
      desc: `${GUIDE_LIST.length} 个行业的产品命名指南索引：按科技/电商/餐饮/内容/教育/健康等大类浏览，每个行业一句话概览，含命名思路、好名字拆解与推荐 TLD。`,
      intro: `好名字的标准因行业而异：SaaS 要能当动词用，餐饮要有画面感，法律要稳重可靠。这里按大类收录全部 ${GUIDE_LIST.length} 个行业的命名指南——每篇含命名思路、知名品牌好名字拆解、推荐 TLD 与常见误区，看完直接用 AI 按行业模板猎名。`,
    },
    en: {
      kicker: "Industry guides",
      title: `All Industry Naming Guides: How to Name a Product in ${GUIDE_LIST.length} Industries`,
      desc: `Index of naming guides for ${GUIDE_LIST.length} industries, grouped by category — tech, e-commerce, food, content, education, health and more. One-line overview per industry, with naming strategies, name breakdowns and recommended TLDs.`,
      intro: `What makes a great name differs by industry: SaaS names should work as verbs, food brands need imagery, legal services need gravitas. Browse all ${GUIDE_LIST.length} industry naming guides by category — each covers naming strategies, famous-name breakdowns, recommended TLDs and common mistakes, then hunt names with the AI template.`,
    },
  },
  vs: {
    zh: {
      kicker: "后缀对比",
      title: `全部后缀对比：${COMPARE_LIST.length} 组 TLD 怎么选`,
      desc: `${COMPARE_LIST.length} 组域名后缀对比索引：com vs cn、io vs ai 等常见纠结组合，按后缀分组浏览，每组给出结论、适用场景与价格差异，帮你快速拍板。`,
      intro: `选后缀常在两个之间纠结：com 还是 cn？io 还是 ai？这里按左侧后缀分组收录全部 ${COMPARE_LIST.length} 组对比——每组给出怎么选的结论、各自适用场景与价格差异，看完直接用 AI 同时在两个后缀下猎名。`,
    },
    en: {
      kicker: "TLD comparisons",
      title: `All TLD Comparisons: ${COMPARE_LIST.length} Head-to-Head Matchups`,
      desc: `Index of ${COMPARE_LIST.length} TLD comparisons — com vs cn, io vs ai and other common dilemmas, grouped by suffix. Each gives a verdict, pick-when scenarios and price differences to help you decide fast.`,
      intro: `Choosing a suffix usually comes down to two finalists: com or cn? io or ai? Browse all ${COMPARE_LIST.length} matchups grouped by the left-hand suffix — each gives a verdict, pick-when scenarios and price differences, then hunt names on both suffixes at once with AI.`,
    },
  },
} as const;
