/**
 * /guide 分组定义与派生（轻量，仅依赖 guide-labels）：
 * - guideHubGroups：/guide 索引 hub 的分组（原 hubs-guide.ts，抽出以便 /guide/:slug 详情页复用而不引入 hub 索引数据）；
 * - relatedGuideSlugs：/guide/:slug 详情页「相关行业指南」互链——同组内从自身之后环绕取最多 max 个。
 */
import { GUIDE_LABELS } from "./guide-labels";

const GUIDE_CATEGORY_DEFS: { id: string; zh: string; en: string; members: string[] }[] = [
  { id: "tech", zh: "科技与互联网", en: "Tech & internet", members: ["saas", "ai", "agent", "devtools", "web3", "security", "hardware", "opensource", "indiehacker", "indiegame", "drone", "solar", "3dprint", "evcharging", "energystorage", "robotics", "nocode", "datingapp"] },
  { id: "ecommerce", zh: "电商与零售", en: "E-commerce & retail", members: ["ecommerce", "crossborder", "wig", "autoparts", "livestream", "resale", "fleamarket", "sourcing", "forwarder", "usedcar", "fashion", "jewelry", "toys", "furniture", "hanfu", "petsupplies", "gearrental", "vending", "fragrance", "upcycling", "convenience", "stationery", "grocery", "babystore", "giftcustom", "wholesale", "trading", "coupon", "flashsale", "flowerdelivery", "kidswear", "souvenir", "luxuryresale", "organicfood", "homedecor", "fashionbuyer", "candle", "instrumentstore", "soapmaking", "modelkit", "recordstore"] },
  { id: "food", zh: "餐饮与食品", en: "Food & beverage", members: ["food", "coffee", "bakery", "brewery", "farm", "foodtruck", "mealprep", "bar", "hotpot", "dessert", "noodle", "teahouse", "bubbletea", "bbq", "catering", "fruitshop", "seafood", "deli", "winery", "sushi", "icecream", "tea", "pizza", "taproom", "izakaya", "snacks", "cookingclass", "craftvodka", "juicebar", "beekeeping"] },
  { id: "content", zh: "内容与创作", en: "Content & creators", members: ["blog", "podcast", "newsletter", "creator", "music", "photography", "travelshoot", "mcn", "boardgame", "pottery", "petphoto", "zine", "weddingphoto", "kidsphoto", "productphoto", "portrait", "foodreview", "shortvideo", "audiobook", "postproduction", "animation", "documentary", "newsmedia", "esportsnews", "sportsodds", "fanclub", "leathercraft", "woodworking", "recordingstudio", "glassblowing", "embroidery"] },
  { id: "edu", zh: "教育与知识", en: "Education & knowledge", members: ["edu", "courses", "studyabroad", "codingschool", "language", "preschool", "bookstore", "translation", "knowledgepay", "swimschool", "kidsart", "danceschool", "drivingschool", "studytour", "musicschool", "chess", "tutoring", "calligraphy"] },
  { id: "health", zh: "健康与运动", en: "Health & fitness", members: ["fitness", "health", "yoga", "coach", "crossfit", "therapy", "dental", "eldercare", "ski", "climbing", "martialarts", "billiards", "massage", "diving", "skateshop", "surf", "golf", "pharmacy", "clinic", "nutrition", "physio", "runclub", "tennis", "soccer", "football", "hockey", "pickleball", "pilates", "equestrian", "archery", "bowling", "trampoline", "badminton", "gokart", "sauna", "dayspa", "orthodontics", "futsal", "basketball", "rugby", "cricket", "volleyball", "tabletennis", "baseball", "boxing", "taekwondo", "fencing", "gymnastics", "cheerleading", "squash", "lacrosse", "judo", "bjj", "wrestling", "muaythai", "handball", "curling", "rowing", "skating", "meditation", "hearingaid"] },
  { id: "travel", zh: "旅行与出行", en: "Travel & mobility", members: ["travel", "bnb", "outdoor", "automotive", "moving", "logistics", "rvtravel", "bikeshop", "fishing", "campgear", "carrental", "travelagency", "hotel", "towing", "hostel", "hotspring", "yachtcharter", "villarental", "cruise", "customtour", "limoservice", "seafishing", "horseranch"] },
  { id: "local", zh: "生活服务", en: "Local services", members: ["pets", "vet", "aquarium", "cleaning", "barber", "beauty", "skincare", "makeupartist", "homestaging", "wedding", "florist", "gardening", "interior", "events", "escaperoom", "parenting", "pettraining", "nailsalon", "laundry", "matchmaking", "tattoo", "repair", "optician", "carwash", "petboarding", "locksmith", "printshop", "errand", "plumber", "petcafe", "footspa", "parcel", "apartment", "construction", "appliancerepair", "karaoke", "hvac", "recycling", "petgrooming", "housekeeping", "kidsplayground", "pestcontrol", "roofing", "selfstorage", "signage", "tailor", "funeral", "partyplanner", "singlesevents", "permanentmakeup", "tabletopclub", "aquascaping", "framing", "watchrepair", "bonsai"] },
  { id: "business", zh: "商业与专业服务", en: "Business & professional", members: ["fintech", "legal", "accounting", "insurance", "recruiting", "realestate", "agency", "freelance", "marketing", "coworking", "resume", "nonprofit", "community", "game", "esports", "careercoach", "vr", "cybercafe", "realtor", "propertymgmt", "equipmentrental", "retrofit", "watertreatment", "companyreg", "consulting", "immigration", "securityguard", "ipagency", "ticketing", "lawfirm", "giveaway"] },
];

const GUIDE_FALLBACK = { id: "more", zh: "更多行业", en: "More industries" };

export function guideHubGroups(): { id: string; zh: string; en: string; slugs: string[] }[] {
  const listed = new Set(GUIDE_CATEGORY_DEFS.flatMap((c) => c.members));
  const slugs = GUIDE_LABELS.map((g) => g.slug);
  const groups = GUIDE_CATEGORY_DEFS.map((c) => ({ id: c.id, zh: c.zh, en: c.en, slugs: slugs.filter((s) => c.members.includes(s)) }));
  const rest = slugs.filter((s) => !listed.has(s));
  if (rest.length > 0) groups.push({ ...GUIDE_FALLBACK, slugs: rest });
  return groups.filter((g) => g.slugs.length > 0);
}

/** 同组相邻行业指南：从自身位置之后环绕取最多 max 个（确定性派生，SSR 与客户端一致） */
export function relatedGuideSlugs(slug: string, max = 6): string[] {
  const group = guideHubGroups().find((g) => g.slugs.includes(slug));
  if (!group) return [];
  const others = group.slugs.filter((s) => s !== slug);
  if (others.length <= max) return others;
  const idx = group.slugs.indexOf(slug);
  return [...others.slice(idx), ...others.slice(0, idx)].slice(0, max);
}
