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

/* ---------- /guide 分组：按行业大类归类，未列出的 slug 自动进「更多行业」 ---------- */

const GUIDE_CATEGORY_DEFS: { id: string; zh: string; en: string; members: string[] }[] = [
  { id: "tech", zh: "科技与互联网", en: "Tech & internet", members: ["saas", "ai", "agent", "devtools", "web3", "security", "hardware", "opensource", "indiehacker", "indiegame", "drone", "solar", "3dprint"] },
  { id: "ecommerce", zh: "电商与零售", en: "E-commerce & retail", members: ["ecommerce", "crossborder", "livestream", "resale", "fleamarket", "sourcing", "forwarder", "usedcar", "fashion", "jewelry", "toys", "furniture", "hanfu", "petsupplies", "gearrental", "vending", "fragrance", "upcycling", "convenience", "stationery", "grocery"] },
  { id: "food", zh: "餐饮与食品", en: "Food & beverage", members: ["food", "coffee", "bakery", "brewery", "farm", "foodtruck", "mealprep", "bar", "hotpot", "dessert", "noodle"] },
  { id: "content", zh: "内容与创作", en: "Content & creators", members: ["blog", "podcast", "newsletter", "creator", "music", "photography", "travelshoot", "mcn", "boardgame", "pottery", "petphoto", "zine"] },
  { id: "edu", zh: "教育与知识", en: "Education & knowledge", members: ["edu", "courses", "studyabroad", "codingschool", "language", "preschool", "bookstore", "translation", "knowledgepay", "swimschool", "kidsart", "danceschool", "drivingschool", "studytour", "musicschool", "chess", "tutoring"] },
  { id: "health", zh: "健康与运动", en: "Health & fitness", members: ["fitness", "health", "yoga", "coach", "crossfit", "therapy", "dental", "eldercare", "ski", "climbing", "martialarts", "billiards", "massage", "diving", "skateshop", "surf", "golf"] },
  { id: "travel", zh: "旅行与出行", en: "Travel & mobility", members: ["travel", "bnb", "outdoor", "automotive", "moving", "logistics", "rvtravel", "bikeshop", "fishing", "campgear", "carrental"] },
  { id: "local", zh: "生活服务", en: "Local services", members: ["pets", "vet", "aquarium", "cleaning", "barber", "beauty", "wedding", "florist", "gardening", "interior", "events", "escaperoom", "parenting", "pettraining", "nailsalon", "laundry", "matchmaking", "tattoo", "repair", "optician", "carwash", "petboarding", "locksmith", "printshop", "errand", "plumber"] },
  { id: "business", zh: "商业与专业服务", en: "Business & professional", members: ["fintech", "legal", "accounting", "insurance", "recruiting", "realestate", "agency", "freelance", "marketing", "coworking", "resume", "nonprofit", "community", "game", "esports", "careercoach", "vr", "cybercafe"] },
];

const GUIDE_FALLBACK = { id: "more", zh: "更多行业", en: "More industries" };

export function guideHubGroups(): { id: string; zh: string; en: string; slugs: string[] }[] {
  const listed = new Set(GUIDE_CATEGORY_DEFS.flatMap((c) => c.members));
  const slugs = GUIDE_INDEX.map((g) => g.slug);
  const groups = GUIDE_CATEGORY_DEFS.map((c) => ({ id: c.id, zh: c.zh, en: c.en, slugs: slugs.filter((s) => c.members.includes(s)) }));
  const rest = slugs.filter((s) => !listed.has(s));
  if (rest.length > 0) groups.push({ ...GUIDE_FALLBACK, slugs: rest });
  return groups.filter((g) => g.slugs.length > 0);
}

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
