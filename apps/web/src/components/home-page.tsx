import { useEffect, useRef, useState } from "react";
import { ArrowRight, Brain, Check, ChevronDown, Copy, ExternalLink, History, Loader2, Plus, Ruler, SearchCheck, ShieldCheck, Sparkles, Star, Wand2, X, Zap } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ExpiryNote, WatchCta } from "@/components/domain-row";
import { addRecentSearch, clearRecentSearches, loadRecentSearches, type RecentSearch } from "@/lib/history";
import { useI18n, type I18nKey } from "@/lib/i18n";
import { toUsd, usePrices } from "@/lib/prices";
import { REGISTRARS } from "@/lib/registrars";
import { cn } from "@/lib/utils";
import { VARIANT_PREFIXES, VARIANT_SUFFIXES } from "@/lib/variants";
import { tldPrice, type Row } from "@/types";

const EXAMPLES = ["独立开发者的 AI 周报工具", "宠物营养订阅电商", "极简冥想 App", "跨境 SaaS 数据看板"];
const EXAMPLES_EN = ["AI weekly-report tool for indie devs", "Pet nutrition subscription store", "Minimal meditation app", "Cross-border SaaS dashboard"];
const PRESET_TLDS = ["com", "cn", "io", "ai", "app", "dev"];
const MAX_LEN = 500;
const LABEL_RE = /^[a-z0-9][a-z0-9-]{0,62}$/i;
const EXACT_DOMAIN_RE = /^([a-z0-9][a-z0-9-]{0,62})\.([a-z0-9-]{2,24})$/i;
// 常见可注册 TLD：避免把拼写错误（如 baidu.iox）当作精确域名去核验
const KNOWN_TLDS = new Set([
  "com", "net", "org", "cn", "io", "ai", "app", "dev", "co", "cc", "tv", "xyz", "me", "info", "biz", "top", "vip", "pro", "site",
  "online", "store", "shop", "tech", "cloud", "space", "fun", "art", "design", "studio", "agency", "digital", "live", "life", "world", "today", "media", "center", "works",
  "news", "blog", "wiki", "link", "club", "team", "work", "zone", "run", "games", "game", "gg", "so", "sh", "im", "fm", "am", "to", "ly", "is",
  "us", "uk", "de", "jp", "hk", "tw", "sg", "eu", "in", "ca", "one", "page", "email", "group", "network", "software", "systems", "tools", "chat", "bot", "codes", "company", "finance", "global", "host", "social", "video", "fund", "land", "click", "icu", "bio", "ink", "moe", "lol", "cool", "red", "best", "wtf", "pizza", "bar", "cafe", "money", "gold", "band", "cash", "city", "estate", "expert", "farm", "blue", "pink", "black", "ninja", "rocks", "pet", "academy", "school", "coach", "care", "doctor", "restaurant", "boutique", "clinic", "dental", "fitness", "photos", "gallery", "salon", "yoga", "coffee", "wine", "kitchen", "garden", "photography", "events", "solutions", "services", "consulting", "marketing", "ventures", "capital", "guru", "tips",
]);

/** 输入看起来已经是现成名字/域名时，提供免 AI 额度的直接核验 */
function parseQuickCheck(input: string): { label: string; tld?: string } | null {
  const d = input.trim().toLowerCase();
  if (LABEL_RE.test(d)) return { label: d };
  const m = EXACT_DOMAIN_RE.exec(d);
  return m && KNOWN_TLDS.has(m[2]) ? { label: m[1], tld: m[2] } : null;
}

// 行业模板：寓意 + 气质 + 场景 三段式描述，点击填入输入框，用户可再编辑；slug 对应 /guide/:slug 与 /?tpl= 预填入口
const TEMPLATES: { slug: string; labelZh: string; labelEn: string; zh: string; en: string }[] = [
  {
    slug: "saas",
    labelZh: "SaaS 工具",
    labelEn: "SaaS tool",
    zh: "一款面向中小团队的协作 SaaS 工具，寓意「把繁琐的工作流理顺、让团队更快交付」；气质要专业、可靠、有效率感；场景是公司官网、产品登录页和邮件签名里都好记好读。",
    en: "A collaboration SaaS tool for small teams. The name should evoke smoothing out messy workflows and helping teams ship faster; the vibe is professional, reliable, and efficient; it needs to read well on a company homepage, a login page, and in email signatures.",
  },
  {
    slug: "ecommerce",
    labelZh: "电商品牌",
    labelEn: "E-commerce brand",
    zh: "一个面向年轻人的生活方式电商品牌，寓意「把好物带进日常、让生活更有质感」；气质要温润、有品味、容易产生信任；场景是包装盒、购物袋和社交媒体主页上都上镜好记。",
    en: "A lifestyle e-commerce brand for young shoppers. The name should suggest bringing well-made things into everyday life; the vibe is warm, tasteful, and trustworthy; it has to look good on packaging, shopping bags, and a social media profile.",
  },
  {
    slug: "ai",
    labelZh: "AI 产品",
    labelEn: "AI product",
    zh: "一款 AI 驱动的智能助手产品，寓意「像多了一个聪明同事，把重复劳动交给机器」；气质要聪明、前沿、有未来感但不冰冷；场景是 Product Hunt 发布、技术博客和投资人 PPT 里都站得住。",
    en: "An AI-powered assistant product. The name should feel like having a brilliant teammate who takes over the repetitive work; the vibe is smart, cutting-edge, futuristic but not cold; it should hold up on a Product Hunt launch, in tech blogs, and on an investor deck.",
  },
  {
    slug: "blog",
    labelZh: "个人博客",
    labelEn: "Personal blog",
    zh: "一个记录思考与创作的个人博客，寓意「把想法沉淀下来、慢慢长成自己的小花园」；气质要安静、真诚、有书卷气；场景是读者在深夜读完一篇文章后，能凭名字记住并再次找到你。",
    en: "A personal blog for essays and creative work. The name should feel like a quiet garden where ideas settle and grow over time; the vibe is calm, sincere, and bookish; a reader who finishes a late-night post should remember the name and find their way back.",
  },
  {
    slug: "pets",
    labelZh: "宠物",
    labelEn: "Pets",
    zh: "一个宠物用品与服务品牌，寓意「把毛孩子当家人，认真对待它们的每一餐每一天」；气质要温暖、活泼、让人会心一笑；场景是实体店招牌、外卖包装和小红书笔记里都可爱好认。",
    en: "A pet supplies and services brand. The name should convey treating furry kids as family and caring about every meal and every day; the vibe is warm, playful, and smile-inducing; it should charm on a storefront sign, delivery packaging, and social posts.",
  },
  {
    slug: "fintech",
    labelZh: "金融科技",
    labelEn: "Fintech",
    zh: "一款面向年轻用户的理财记账工具，寓意「把钱管明白、让财富稳稳生长」；气质要可信、清爽、专业但不古板；场景是应用商店榜单和银行合作发布会上都拿得出手。",
    en: "A personal finance and budgeting app for younger users. The name should suggest understanding your money and letting wealth grow steadily; the vibe is trustworthy, clean, professional yet friendly; it must look credible on app store charts and at a bank partnership launch.",
  },
  {
    slug: "game",
    labelZh: "游戏",
    labelEn: "Games",
    zh: "一款轻量多人在线小游戏，寓意「一局开黑、即点即玩的快乐」；气质要好玩、有能量、喊起来顺口；场景是主播在直播间反复喊出名字、玩家在商店列表里一眼记住。",
    en: "A lightweight multiplayer web game. The name should evoke instant, jump-in-and-play fun with friends; the vibe is playful, energetic, and satisfying to shout; it must be memorable when streamers yell it on stream and players scroll past it in a store list.",
  },
  {
    slug: "edu",
    labelZh: "教育学习",
    labelEn: "Education",
    zh: "一款让学习不再痛苦的在线学习工具，寓意「每天进步一点点、把知识点亮」；气质要可靠又有趣、不说教；场景是家长在付费页觉得靠谱、学习者每天打开时觉得轻松。",
    en: "An online learning tool that makes studying painless. The name should suggest steady daily progress and knowledge lighting up; the vibe is reliable yet fun, never preachy; it must reassure parents on the checkout page and feel light when learners open it every day.",
  },
  {
    slug: "travel",
    labelZh: "旅行",
    labelEn: "Travel",
    zh: "一个帮人发现小众目的地的旅行品牌，寓意「出发去看没见过的世界」；气质要自由、开阔、有远方感；场景是朋友间口头推荐时一听就记住，机场广告牌上一眼有画面。",
    en: "A travel brand that helps people discover offbeat destinations. The name should evoke setting off to see an unseen world; the vibe is free, open, full of wanderlust; it must stick after one spoken referral and paint a picture on an airport billboard.",
  },
  {
    slug: "food",
    labelZh: "餐饮美食",
    labelEn: "Food & dining",
    zh: "一个主打现做轻食的餐饮品牌，寓意「新鲜、认真做好每一餐」；气质要温暖、干净、有食欲感；场景是门头招牌三米外看得清、外卖列表里一眼被点开、朋友说「今天吃它」顺口。",
    en: "A fresh-made casual food brand. The name should convey freshness and care in every meal; the vibe is warm, clean, appetizing; it must read from three meters on a storefront, get tapped in a delivery list, and roll off the tongue in \"let's eat there\".",
  },
  {
    slug: "fitness",
    labelZh: "健身健康",
    labelEn: "Fitness",
    zh: "一款帮人养成运动习惯的健身产品，寓意「每天坚持一点、成为更强的自己」；气质要有能量、正向、像一枚身份徽章；场景是印在运动服上不违和、喊在训练营里带感。",
    en: "A fitness product that builds workout habits. The name should suggest daily persistence and becoming a stronger self; the vibe is energetic, positive, badge-like; it should look right printed on apparel and sound great shouted in a boot camp.",
  },
  {
    slug: "devtools",
    labelZh: "开发者工具",
    labelEn: "Dev tools",
    zh: "一款让开发者提效的命令行工具，寓意「把重复的构建部署活儿一键搞定」；气质要极客、干脆、有点冷幽默；场景是全小写敲进终端手感顺滑、在 GitHub README 里酷而不装。",
    en: "A CLI tool that saves developers time. The name should evoke one-command builds and deploys; the vibe is hacker-ish, crisp, with a dry sense of humor; it must feel smooth typed lowercase in a terminal and look cool-but-not-trying in a GitHub README.",
  },
  {
    slug: "web3",
    labelZh: "Web3 项目",
    labelEn: "Web3 project",
    zh: "一个链上数据基础设施项目，寓意「像水电一样可靠的链上服务」；气质要专业、中立、有协议感、绝不土狗；场景是出现在审计报告和交易所公告里都站得住。",
    en: "An on-chain data infrastructure project. The name should feel like utility-grade reliability for the chain; the vibe is professional, neutral, protocol-like, never memecoin-ish; it must hold up in audit reports and exchange announcements.",
  },
  {
    slug: "agency",
    labelZh: "咨询工作室",
    labelEn: "Agency / studio",
    zh: "一家小而美的设计咨询工作室，寓意「用专业判断帮客户把事做对」；气质要克制、可信、有方法论感；场景是印在提案封面和合同抬头上显得体面有分量。",
    en: "A small, sharp design consultancy. The name should convey professional judgment that gets things right; the vibe is restrained, credible, methodology-driven; it must carry weight on a proposal cover and a contract header.",
  },
  {
    slug: "photography",
    labelZh: "摄影工作室",
    labelEn: "Photo studio",
    zh: "一家人像与婚礼摄影工作室，寓意「把最重要的瞬间拍得配得上回忆」；气质要温暖、有作者感、经得起印在水印和请柬上；场景是客户向闺蜜转介绍时一遍就能说清。",
    en: "A portrait and wedding photography studio. The name should say the most important moments deserve this craft; the vibe is warm, authorial, worthy of a watermark and a wedding invitation; it must land in one telling when a client refers a friend.",
  },
  {
    slug: "podcast",
    labelZh: "播客节目",
    labelEn: "Podcast",
    zh: "一档聊科技与生活的双人对谈播客，寓意「认真但不正经的深夜聊天」；气质要松弛、有态度、口播念起来顺；场景是听众通勤听到节目名，晚上还能凭记忆搜到。",
    en: "A two-host talk show on tech and life. The name should feel like earnest but playful late-night conversation; the vibe is relaxed, opinionated, smooth in a spoken intro; a commuter who hears it once must find it by memory that night.",
  },
  {
    slug: "realestate",
    labelZh: "房产家居",
    labelEn: "Real estate",
    zh: "一个帮年轻人找到理想住处的找房平台，寓意「安家这件事值得被认真对待」；气质要稳重、可信、带一点温度；场景是出现在中介门店招牌和 App 商店里都让人放心。",
    en: "A home-finding platform for young renters and buyers. The name should say settling down deserves real care; the vibe is steady, trustworthy, with a touch of warmth; it must reassure on a storefront sign and in an app store alike.",
  },
  {
    slug: "health",
    labelZh: "医疗健康",
    labelEn: "Health app",
    zh: "一款帮用户管理睡眠与压力的健康应用，寓意「被科学而温柔地照顾」；气质要安心、专业、绝不冰冷；场景是用户愿意推荐给爸妈用，说出名字时对方不会犹豫。",
    en: "A health app for sleep and stress. The name should feel like being cared for with science and gentleness; the vibe is reassuring, credible, never clinical-cold; users should feel comfortable recommending it to their parents by name.",
  },
  {
    slug: "legal",
    labelZh: "法律服务",
    labelEn: "Legal service",
    zh: "一个面向小微企业的在线法律服务平台，寓意「请律师不该让人紧张」；气质要专业、可靠、亲切不吓人；场景是印在合同模板页脚和官网首页都稳得住。",
    en: "An online legal service for small businesses. The name should say hiring a lawyer shouldn't be intimidating; the vibe is professional, dependable, approachable; it must hold steady in a contract footer and on a homepage.",
  },
  {
    slug: "newsletter",
    labelZh: "Newsletter",
    labelEn: "Newsletter",
    zh: "一份每周精选科技与商业洞察的 newsletter，寓意「每周一杯高浓度的认知咖啡」；气质要聪明、有节奏感、在收件箱里一眼想点开；场景是读者向同事转发时名字自带推荐语。",
    en: "A weekly newsletter of tech and business insight. The name should feel like a weekly shot of concentrated thinking; the vibe is smart, rhythmic, instantly clickable in an inbox; when a reader forwards it, the name itself is the endorsement.",
  },
  {
    slug: "music",
    labelZh: "音乐人",
    labelEn: "Music & labels",
    zh: "一个独立音乐厂牌与音乐人主页，寓意「把耳朵里的世界做成据点」；气质要有态度、耐听、带一点地下感；场景是歌单封面、演出海报和乐迷口口相传里都一次记住。",
    en: "An indie music label and artist hub. The name should feel like turning the world in your ears into home turf; the vibe is opinionated, listenable, a little underground; it must stick on playlist covers, gig posters, and in word of mouth on the first hearing.",
  },
  {
    slug: "beauty",
    labelZh: "美妆个护",
    labelEn: "Beauty brand",
    zh: "一个主打温和护肤的美妆个护品牌，寓意「善待皮肤，也善待每一天的自己」；气质要干净、有质感、值得信赖；场景是印在瓶身和出现在小红书笔记标题里都好看好记。",
    en: "A gentle-skincare beauty brand. The name should say be kind to your skin and to yourself; the vibe is clean, textured, trustworthy; it has to look beautiful printed on a bottle and read well in a social caption.",
  },
  {
    slug: "nonprofit",
    labelZh: "公益组织",
    labelEn: "Nonprofit",
    zh: "一个乡村儿童阅读公益项目，寓意「一本书就是一扇窗」；气质要真诚、透明、有行动感；场景是出现在捐赠页和媒体报道里，让人第一眼就相信钱会花在孩子身上。",
    en: "A nonprofit bringing books to rural children. The name should say every book is a window; the vibe is sincere, transparent, action-driven; on a donation page or in press coverage it must make people trust where the money goes at first glance.",
  },
  {
    slug: "parenting",
    labelZh: "母婴亲子",
    labelEn: "Baby & parenting",
    zh: "一个新生代母婴用品品牌，寓意「陪孩子慢慢长大，也让父母安心」；气质要柔软、安全、有一点点童趣；场景是印在包装盒上让家长放心，说出口让孩子觉得亲切。",
    en: "A modern baby and parenting brand. The name should feel like growing up slowly together while parents rest easy; the vibe is soft, safe, gently playful; it must reassure parents on a package and sound friendly to a child's ear.",
  },
  {
    slug: "hardware",
    labelZh: "智能硬件",
    labelEn: "Hardware",
    zh: "一款面向创造者的智能硬件产品，寓意「把想法握在手里」；气质要精密、克制、有工业美感；场景是刻在铝合金机身上、印在包装盒上和出现在众筹页标题里都成立。",
    en: "A smart hardware product for makers. The name should feel like holding an idea in your hand; the vibe is precise, restrained, industrially beautiful; it must work engraved on an aluminum body, printed on a box, and in a crowdfunding headline.",
  },
  {
    slug: "security",
    labelZh: "网络安全",
    labelEn: "Cybersecurity",
    zh: "一家面向中小企业的网络安全服务公司，寓意「有人替你守着门」；气质要可靠、专业、有威慑力但不吓人；场景是出现在企业采购文档和安全报告里都站得住。",
    en: "A cybersecurity service for small businesses. The name should feel like someone standing guard at your door; the vibe is dependable, professional, deterrent without fear-mongering; it must hold up in procurement documents and security reports.",
  },
  {
    slug: "creator",
    labelZh: "视频创作者",
    labelEn: "Creator",
    zh: "一个视频创作者的频道品牌，寓意「把有意思的东西讲给更多人听」；气质要鲜活、有记忆点、一听就会拼写；场景是片头口播、跨平台账号名和商务合作介绍里都好念好记。",
    en: "A video creator's channel brand. The name should feel like telling fascinating things to a growing audience; the vibe is lively, hooky, and instantly spellable after one listen; it must work spoken in intros, as a cross-platform handle, and in sponsorship decks.",
  },
  {
    slug: "freelance",
    labelZh: "自由职业",
    labelEn: "Freelance",
    zh: "一个自由职业者的个人工作室品牌，寓意「一个人也能交付专业水准」；气质要专业、可信、有手艺人感；场景是报价单、发票抬头和作品集网站上都站得住。",
    en: "A freelancer's one-person studio brand. The name should say a single craftsperson can deliver professional-grade work; the vibe is professional, trustworthy, artisan; it must hold up on quotes, invoice headers, and a portfolio site.",
  },
  {
    slug: "fashion",
    labelZh: "服饰潮牌",
    labelEn: "Fashion label",
    zh: "一个面向年轻人的服饰潮牌，寓意「把态度穿在身上」；气质要有张力、克制的酷、经得起印在胸口；场景是吊牌、胸前印花和电商详情页里都好看好记。",
    en: "A streetwear label for young customers. The name should feel like wearing an attitude; the vibe is tense, coolly restrained, and worthy of a chest print; it has to look good on hang tags, prints, and a product page.",
  },
  {
    slug: "coffee",
    labelZh: "咖啡茶饮",
    labelEn: "Coffee & tea",
    zh: "一家社区咖啡馆兼线上豆单品牌，寓意「一杯好咖啡带来的片刻安顿」；气质要温暖、有场所感、值得拍照分享；场景是招牌、杯身和豆袋包装上都上镜好认。",
    en: "A neighborhood café that also sells beans online. The name should evoke the settled moment a good cup brings; the vibe is warm, place-like, photo-worthy; it must charm on a signboard, a cup, and a coffee-bag label.",
  },
  {
    slug: "automotive",
    labelZh: "汽车出行",
    labelEn: "Automotive",
    zh: "一个新能源出行品牌，寓意「把远方变近，把出发变简单」；气质要有速度感、可靠、面向未来但不浮夸；场景是车尾标、发布会大屏和 App 图标上都立得住。",
    en: "A new-energy mobility brand. The name should make distance feel closer and setting off feel effortless; the vibe is fast, dependable, future-facing without hype; it must hold up on a tailgate badge, a launch-event screen, and an app icon.",
  },
  {
    slug: "community",
    labelZh: "社区俱乐部",
    labelEn: "Community",
    zh: "一个付费会员制社区，寓意「同路人聚在一起互相点亮」；气质要有归属感、值得自称、圈内人一眼认亲；场景是成员自我介绍、社区首页和续费页里都自然得体。",
    en: "A paid membership community. The name should feel like fellow travelers gathering to light each other up; the vibe is belonging, worth self-identifying with, instantly recognizable to insiders; it must feel natural in member intros, on the community homepage, and on the renewal page.",
  },
  {
    slug: "wedding",
    labelZh: "婚庆策划",
    labelEn: "Wedding planning",
    zh: "一个高端婚礼策划工作室，寓意「把一生一次的时刻办得郑重又动人」；气质要浪漫、有审美、值得托付；场景是婚礼展台、请柬落款和准新娘转发给闺蜜的链接里都优雅得体。",
    en: "A high-end wedding planning studio. The name should convey making a once-in-a-lifetime moment solemn and moving; the vibe is romantic, tasteful, and trustworthy; it must look elegant on an expo booth, an invitation footer, and in the link a bride forwards to her best friend.",
  },
  {
    slug: "bnb",
    labelZh: "民宿短租",
    labelEn: "BnB & stays",
    zh: "一个有主人温度的民宿品牌，寓意「推开门就是另一种生活」；气质要在地、温暖、有栖居感；场景是订房平台列表里一眼与连锁酒店区分开，客人退房后向朋友转述时顺口好记。",
    en: "A boutique BnB brand with a host's warmth. The name should feel like opening a door into another way of living; the vibe is local, warm, and homelike; it must stand apart from chain hotels in a booking list and roll off the tongue when guests retell it to friends.",
  },
  {
    slug: "courses",
    labelZh: "在线课程",
    labelEn: "Online courses",
    zh: "一个在线课程与知识付费品牌，寓意「学完就能看见更好的自己」；气质要专业、有结果感、值得付费；场景是转发海报的大标题、付款页和学员说「我报了它的课」时都站得住。",
    en: "An online course and creator-education brand. The name should promise a better self on the other side of the course; the vibe is expert, outcome-driven, worth paying for; it must hold up as a launch-graphic headline, on the checkout page, and in \"I enrolled in X\".",
  },
  {
    slug: "boardgame",
    labelZh: "桌游工作室",
    labelEn: "Board games",
    zh: "一个原创桌游工作室，寓意「把朋友聚到一张桌子上创造回忆」；气质要有想象力、有出品感、喊起来顺口；场景是游戏盒封面、众筹页标题和「今晚玩它吧」的提议里都响亮好记。",
    en: "An indie tabletop game studio. The name should evoke gathering friends around one table to make memories; the vibe is imaginative, well-crafted, and satisfying to say; it must ring out on a game box cover, a crowdfunding headline, and in \"let's play it tonight\".",
  },
  {
    slug: "outdoor",
    labelZh: "户外露营",
    labelEn: "Outdoor & camping",
    zh: "一个户外露营装备与生活方式品牌，寓意「离开城市，去更大的世界扎营」；气质要辽阔、可靠、有山野气；场景是绣在冲锋衣胸口、压印在钛杯上和营地口碑推荐里都经得起打量。",
    en: "An outdoor gear and camp-life brand. The name should evoke leaving the city to pitch camp in a wider world; the vibe is vast, dependable, mountain-worn; it must hold up embroidered on a jacket chest, stamped on a titanium mug, and in campsite word of mouth.",
  },
  {
    slug: "cleaning",
    labelZh: "家政清洁",
    labelEn: "Cleaning services",
    zh: "一个上门家政清洁服务品牌，寓意「推开家门那一刻焕然一新的如释重负」；气质要可靠、亲切、值得托付钥匙；场景是地图搜索卡片、客户通讯录备注和邻里转介绍里都专业好记。",
    en: "An on-demand home cleaning service brand. The name should capture the fresh relief of opening the door to a spotless home; the vibe is reliable, friendly, key-trustworthy; it must look professional in a map listing, survive being saved in contacts, and travel in neighbor referrals.",
  },
  {
    slug: "marketing",
    labelZh: "数字营销",
    labelEn: "Digital marketing",
    zh: "一个数字营销机构/MCN 品牌，寓意「让品牌被看见、让增长有方法」；气质要专业、有创意锋芒、比稿会议上念出来有底气；场景是提案封面、邮件签名和「我们请了 X 来做投放」的转述里都立得住。",
    en: "A digital marketing agency or creator-network brand. The name should promise visibility and methodical growth; the vibe is sharp, creative, boardroom-credible; it must hold up on a proposal cover, in an email signature, and in \"we hired X for our campaigns\".",
  },
  {
    slug: "therapy",
    labelZh: "心理咨询",
    labelEn: "Therapy & mental health",
    zh: "一个心理咨询与心理健康服务品牌，寓意「一个不被评判的安全所在」；气质要温和、可信赖、零威胁感；场景是深夜搜索的结果页、朋友间的推荐和「我在用 X」的坦然表达里都让人安心。",
    en: "A therapy and mental wellness brand. The name should feel like a safe, unjudging place; the vibe is gentle, trustworthy, zero-threat; it must reassure on a late-night search results page, in a friend's recommendation, and in saying \"I've been using X\" out loud.",
  },
  {
    slug: "resale",
    labelZh: "二手循环",
    labelEn: "Resale & recommerce",
    zh: "一个二手交易/循环经济平台品牌，寓意「让好东西再流转一次，淘到即是缘分」；气质要轻快、有寻宝感、不显旧；场景是闲置转让的对话、开箱分享和「我在 X 上淘到的」炫耀里都好玩好记。",
    en: "A resale and circular-economy marketplace brand. The name should evoke good things finding a second life and the thrill of the find; the vibe is playful, treasure-hunty, never shabby; it must sparkle in listing chats, unboxing posts, and \"I scored this on X\" brags.",
  },
  {
    slug: "recruiting",
    labelZh: "招聘人力",
    labelEn: "Recruiting & HR",
    zh: "一个招聘平台/HR 服务品牌，寓意「让人与机会彼此找到」；气质要专业、有机遇感、对求职者尊重对企业可靠；场景是「我在 X 上找到这份工作」的口碑、HR 采购清单和职场社交里都自然顺口。",
    en: "A recruiting platform or HR services brand. The name should evoke people and opportunities finding each other; the vibe is professional, opportunity-charged, respectful to candidates and credible to employers; it must flow in \"I found this job on X\", on procurement lists, and across professional networks.",
  },
  {
    slug: "eldercare",
    labelZh: "养老服务",
    labelEn: "Senior care",
    zh: "一个养老服务与银发生活品牌，寓意「岁月向晚，生活继续体面而丰盛」；气质要有尊严、温暖、值得托付；场景是子女在家庭群里的推荐、长辈「我住在 X」的自豪表达和亲友转述里都安心得体。",
    en: "A senior care and later-life brand. The name should promise life continuing with dignity and abundance; the vibe is dignified, warm, worthy of a family's trust; it must reassure in a family group chat, sound proud in \"I live at X\", and travel gracefully in word of mouth.",
  },
  {
    slug: "logistics",
    labelZh: "物流货运",
    labelEn: "Logistics & freight",
    zh: "一个物流货运/跨境供应链品牌，寓意「使命必达，每一件货都被稳稳送到」；气质要可靠、高效、有网络感；场景是货车车身、快递面单和「发 X 的货，放心」的口碑里都清晰响亮。",
    en: "A logistics, freight or cross-border supply-chain brand. The name should promise every shipment arriving surely and on time; the vibe is dependable, efficient, network-strong; it must read clearly on a truck side, a shipping label, and in \"ship it with X, don't worry\".",
  },
  {
    slug: "agent",
    labelZh: "AI 智能体",
    labelEn: "AI agents",
    zh: "一个 AI 智能体/Agent 产品品牌，寓意「一个可以放心把活交给它的 AI 同事」；气质要拟人、可托付、稳重不轻佻；场景是「让 X 帮我处理一下」的日常委托、企业安全审查清单和开发者社区讨论里都立得住。",
    en: "An AI agent product brand. The name should feel like an AI coworker you can hand work to; the vibe is human-like, delegation-worthy, steady not gimmicky; it must work in \"let X handle it\", on an enterprise security-review list, and in developer-community threads.",
  },
  {
    slug: "crossborder",
    labelZh: "跨境电商",
    labelEn: "Cross-border e-commerce",
    zh: "一个跨境电商/出海品牌，寓意「无国界的好货与信任」；气质要国际化、好读好拼、无文化歧义；场景是海外社交广告、亚马逊搜索框和不同母语客人的口口相传里都念得出、记得住。",
    en: "A cross-border e-commerce brand going global. The name should carry borderless quality and trust; the vibe is international, easy to read and spell, free of cultural landmines; it must survive social ads abroad, the Amazon search box, and word of mouth across native languages.",
  },
  {
    slug: "escaperoom",
    labelZh: "剧本杀密室",
    labelEn: "Escape rooms",
    zh: "一个剧本杀/密室逃脱/沉浸式娱乐品牌，寓意「推开门就进入另一个世界」；气质要有悬念、有戏剧感、让人好奇；场景是「周六去 X 玩不玩」的组局邀约、点评平台搜索和玩家探店笔记里都抓人好记。",
    en: "An escape room or immersive entertainment venue brand. The name should feel like a doorway into another world; the vibe is mysterious, theatrical, curiosity-sparking; it must hook in \"anyone up for X on Saturday?\", stand out in review-app search, and stick in players' visit notes.",
  },
  {
    slug: "bakery",
    labelZh: "烘焙甜品",
    labelEn: "Bakeries & desserts",
    zh: "一个烘焙甜品/私房蛋糕品牌，寓意「出炉那一刻的香气与庆祝时刻的甜」；气质要温暖、手作、上镜好看；场景是礼盒丝带、生日贺卡和「我在 X 订的蛋糕」的晒图里都甜而不腻。",
    en: "A bakery or dessert brand. The name should carry the aroma of fresh-from-the-oven and the sweetness of celebration; the vibe is warm, handcrafted, camera-ready; it must look right on a gift-box ribbon, a birthday card, and in \"I ordered it from X\" posts.",
  },
  {
    slug: "bookstore",
    labelZh: "书店出版",
    labelEn: "Bookstores & publishing",
    zh: "一个书店/独立出版品牌，寓意「一个可以安放精神的地方」；气质要有书卷气、有立场、经得起读书人审视；场景是书脊、门头灯箱和读者「我常去 X」的归属感表达里都隽永耐看。",
    en: "A bookstore or independent press brand. The name should feel like a place for the mind to dwell; the vibe is literary, principled, able to survive well-read scrutiny; it must age well on a book spine, a storefront sign, and in a reader's \"I'm a regular at X\".",
  },
  {
    slug: "florist",
    labelZh: "花店花艺",
    labelEn: "Florists",
    zh: "一个花店/花艺工作室品牌，寓意「把心意开成一束花」；气质要诗意、美好、配得上被当作礼物送出；场景是贺卡署名、节日订花搜索和客户晒花束的照片里都添一分心意。",
    en: "A florist or floral design studio brand. The name should read like sentiment arranged into a bouquet; the vibe is poetic, beautiful, worthy of being given; it must add grace to a gift-card signature, holiday flower searches, and customers' bouquet photos.",
  },
  {
    slug: "interior",
    labelZh: "装修设计",
    labelEn: "Interior & renovation",
    zh: "一个装修/室内设计品牌，寓意「把毛坯变成想回去的家」；气质要可靠、有审美、值得托付钥匙和预算；场景是作品集封面、业主群转介绍和「我家是 X 做的」的口碑里都专业立得住。",
    en: "An interior design or renovation brand. The name should evoke turning bare walls into a home worth coming back to; the vibe is dependable, tasteful, worthy of keys and budget; it must hold up on a portfolio cover, in homeowner group referrals, and in \"X did our place\".",
  },
  {
    slug: "studyabroad",
    labelZh: "留学教育",
    labelEn: "Study abroad",
    zh: "一个留学咨询/国际教育品牌，寓意「从此岸到彼岸的可靠引路人」；气质要专业、有出路感、家长信任学生不嫌土；场景是家长群推荐、申请邮件署名和院校合作名录里双语都立得住。",
    en: "A study-abroad consultancy or international education brand. The name should feel like a trusted guide across the crossing; the vibe is professional, opportunity-rich, credible to parents yet cool enough for students; it must work in parent group chats, application email signatures, and university partner lists in both languages.",
  },
  {
    slug: "usedcar",
    labelZh: "二手车",
    labelEn: "Used cars",
    zh: "一个二手车品牌/车行，寓意「每一辆车的过去都查得清、买得放心」；气质要透明、实在、无套路；场景是电话报价、本地车友群和「我在 X 看了一辆」的转述里都可信顺口。",
    en: "A used car marketplace or dealership brand. The name should promise every car's history is checkable and the deal is safe; the vibe is transparent, straight-dealing, no games; it must sound credible in a phone quote, a local car group, and in \"I saw one at X\".",
  },
  {
    slug: "insurance",
    labelZh: "保险经纪",
    labelEn: "Insurance",
    zh: "一个保险经纪/保险科技品牌，寓意「出事那天真的有人管」；气质要稳重、可信、又不冷冰冰；场景是家人群里的推荐、理赔时刻打开的 App 和「我买的是 X 家」的坦然表达里都安心。",
    en: "An insurance brokerage or insurtech brand. The name should promise someone's really got you on the bad day; the vibe is steady, trustworthy, yet human not cold; it must reassure in a family group recommendation, on the app opened at claim time, and in \"I'm covered by X\".",
  },
  {
    slug: "farm",
    labelZh: "农场生鲜",
    labelEn: "Farms & fresh food",
    zh: "一个农场/生鲜品牌，寓意「离土地最近的新鲜与实在」；气质要自然、时令、有产地故事；场景是包装箱面、社区团购开团文案和「我家一直吃 X」的复购口碑里都可信好念。",
    en: "A farm or fresh food brand. The name should carry the freshness and honesty of being close to the land; the vibe is natural, seasonal, rich with provenance; it must read true on a produce box, in a group-buy announcement, and in \"we've always bought from X\".",
  },
  {
    slug: "barber",
    labelZh: "美发理容",
    labelEn: "Barbershops & salons",
    zh: "一个理发店/美发工作室品牌，寓意「把接下来一个月的形象放心交给它」；气质要有手艺感、亲切、经得起十年熟客；场景是门头招牌、地图搜索和「我一直在 X 剪」的长期转述里都顺口耐听。",
    en: "A barbershop or hair salon brand. The name should feel worth trusting with next month's look; the vibe is craft-forward, friendly, built for ten-year regulars; it must wear well on a shopfront sign, in map search, and in \"I've been going to X for years\".",
  },
  {
    slug: "yoga",
    labelZh: "瑜伽普拉提",
    labelEn: "Yoga & Pilates",
    zh: "一个瑜伽馆/普拉提工作室品牌，寓意「一小时属于自己的呼吸与平衡」；气质要安静、有灵性又专业不玄；场景是会员卡、小红书打卡照和「我每周去 X 上三次课」的长期转述里都顺口耐听。",
    en: "A yoga or Pilates studio brand. The name should evoke an hour of breath and balance that belongs to you; the vibe is calm, soulful yet professionally grounded; it must wear well on a membership card, in check-in photos, and in \"I take three classes a week at X\".",
  },
  {
    slug: "vet",
    labelZh: "宠物医院",
    labelEn: "Vet clinics",
    zh: "一家宠物医院/动物诊所品牌，寓意「毛孩子生病的那天，真的有专业的人管」；气质要专业安心、温暖不轻浮；场景是深夜急诊搜索、诊所门头和「快送 X 医院」的紧急呼喊里都可信好认。",
    en: "A veterinary clinic or animal hospital brand. The name should promise that on the day a furry kid gets sick, real professionals have it handled; the vibe is clinically credible, warm, never flippant; it must hold up in a midnight emergency search, on the clinic sign, and in \"get her to X, now!\".",
  },
  {
    slug: "esports",
    labelZh: "电竞战队",
    labelEn: "Esports team",
    zh: "一支电竞战队/电竞俱乐部品牌，寓意「为胜利而战、让粉丝喊得热血」；气质要有战意、够潮、缩写好看；场景是解说嘶吼、比分牌缩写和粉丝弹幕应援里都响亮带感。",
    en: "An esports team or gaming org brand. The name should burn with the will to win and give fans something to scream; the vibe is fierce, streetwear-cool, with a great-looking tag; it must ring out in a caster's shoutcall, on the scoreboard abbreviation, and in fan chat spam.",
  },
  {
    slug: "drone",
    labelZh: "无人机航拍",
    labelEn: "Drone & aerial",
    zh: "一个无人机航拍/飞行服务品牌，寓意「用从未见过的角度看世界」；气质要专业、开阔、有技术感不像玩具；场景是片尾署名、作品集网站和企业巡检投标书里都立得住。",
    en: "A drone services or aerial photography brand. The name should evoke seeing the world from an angle no one has seen; the vibe is professional, expansive, engineered rather than toy-like; it must hold up in video end credits, on a portfolio site, and in an enterprise inspection bid.",
  },
  {
    slug: "hanfu",
    labelZh: "汉服国潮",
    labelEn: "Hanfu & guochao",
    zh: "一个汉服/国潮品牌，寓意「把千年的美穿回日常」；气质要有古意、有出处、好念好打不生僻；场景是直播间口播、话题标签和出海独立站的拼音形态里都雅致好传播。",
    en: "A hanfu or China-chic (guochao) brand. The name should carry a millennium of beauty back into everyday wear; the vibe is classical, well-sourced, easy to say and type; it must stay graceful in livestream shout-outs, hashtags, and the romanized form on an overseas store.",
  },
  {
    slug: "dental",
    labelZh: "口腔诊所",
    labelEn: "Dental clinic",
    zh: "一家口腔诊所/牙科品牌，寓意「看牙不再可怕，笑容值得被认真对待」；气质要安心、专业、有微笑感不冰冷；场景是家庭群推荐、诊所招牌和「明天去 X 看牙」的日常表达里都让人放松。",
    en: "A dental clinic or oral care brand. The name should make dental visits feel safe and smiles worth caring for; the vibe is reassuring, professional, smile-warm rather than clinical-cold; it must relax people in a family group recommendation, on the clinic sign, and in \"I'm going to X tomorrow\".",
  },
  {
    slug: "accounting",
    labelZh: "会计财税",
    labelEn: "Accounting & tax",
    zh: "一家会计事务所/财税服务品牌，寓意「账本交给它就不会出错」；气质要稳健、专业、值得托付不轻飘；场景是审计报告署名、企业客户尽调和「记账找 X」的老板圈转介绍里都立得住。",
    en: "An accounting firm or tax service brand. The name should promise that the books are in hands that don't make mistakes; the vibe is steady, professional, trustworthy rather than flashy; it must hold up as an audit report signature, in client due diligence, and in \"use X for your books\" referrals.",
  },
  {
    slug: "livestream",
    labelZh: "直播电商",
    labelEn: "Livestream commerce",
    zh: "一个直播电商/主播 IP 品牌，寓意「进直播间就像逛一个信得过的好店」；气质要响亮、有人设、口播喊得出；场景是主播口播、弹幕刷屏和「去 X 直播间蹲折扣」的日常转述里都好听好记。",
    en: "A livestream commerce or creator shop brand. The name should feel like walking into a trusted store that happens to be live; the vibe is loud-friendly, persona-driven, made to be shouted; it must ring out in host shout-outs, chat spam, and \"catch the drop at X tonight\".",
  },
  {
    slug: "translation",
    labelZh: "翻译本地化",
    labelEn: "Translation & localization",
    zh: "一个翻译/本地化服务品牌，寓意「跨过语言的墙，意思一点不丢」；气质要专业、国际化、名字自己先经得起多语言念读；场景是跨国合同署名、开发者文档和「本地化交给 X」的采购推荐里都可信顺口。",
    en: "A translation or localization brand. The name should promise that meaning crosses the language wall intact; the vibe is professional, international, and the name itself must read cleanly in every major language; it must hold up on cross-border contracts, in developer docs, and in \"we use X for localization\".",
  },
  {
    slug: "gardening",
    labelZh: "园艺绿植",
    labelEn: "Gardening & plants",
    zh: "一个园艺绿植品牌，寓意「给生活留一平米会呼吸的绿」；气质要治愈、有生长感、好养活不娇气；场景是快递包裹、窗台打卡照和「我在 X 买的绿萝一直活着」的口碑转述里都温暖耐看。",
    en: "A gardening or plant brand. The name should evoke a square meter of breathing green in everyday life; the vibe is soothing, growth-minded, hardy rather than precious; it must wear well on a shipping box, in windowsill photos, and in \"my plant from X is still thriving\".",
  },
  {
    slug: "coworking",
    labelZh: "联合办公",
    labelEn: "Coworking space",
    zh: "一个联合办公/共享空间品牌，寓意「和一群同路人把事做成的地方」；气质要有归属感、专业不失活力；场景是楼宇招牌、地图搜索和「我在 X 上班」的日常介绍里都体面顺口。",
    en: "A coworking or shared space brand. The name should feel like the place where fellow travelers get things done; the vibe is belonging-first, professional yet energetic; it must look right on building signage, in map search, and sound good in \"I work out of X\".",
  },
  {
    slug: "solar",
    labelZh: "光伏新能源",
    labelEn: "Solar & clean energy",
    zh: "一个光伏/新能源品牌，寓意「把阳光变成每个月省下的电费」；气质要可靠、有科技感、扛得住二十五年质保的托付；场景是屋顶工程合同、投标书和「装光伏找 X」的邻里转介绍里都有分量。",
    en: "A solar or clean energy brand. The name should turn sunlight into a lower bill every month; the vibe is dependable, engineered, solid enough for a 25-year warranty; it must carry weight on an installation contract, in a project bid, and in \"get your panels from X\" neighbor referrals.",
  },
  {
    slug: "coach",
    labelZh: "健身私教",
    labelEn: "Personal training",
    zh: "一个健身私教/私教工作室品牌，寓意「把身体交给一个真正靠谱的人」；气质要专业、有能量、不吓人不推销；场景是学员转介绍口播、地图搜索和「你去找 X 练」的朋友推荐里都可信顺口。",
    en: "A personal trainer or PT studio brand. The name should feel like handing your body to someone truly reliable; the vibe is professional, energetic, never intimidating or salesy; it must hold up in client referrals, map search, and a friend's \"just train with X\".",
  },
  {
    slug: "codingschool",
    labelZh: "编程培训",
    labelEn: "Coding bootcamp",
    zh: "一家编程培训/少儿编程机构品牌，寓意「让代码从黑魔法变成亲手做东西的乐趣」；气质要聪明、有趣、不像应试补习班；场景是家长群转发、学员简历和「我在 X 学的编程」的转介绍里都体面好记。",
    en: "A coding school or bootcamp brand. The name should turn code from dark art into the joy of making things; the vibe is smart, fun, nothing like a test-prep shop; it must look right forwarded in a parents' group, on a graduate's resume, and in \"I learned to code at X\".",
  },
  {
    slug: "jewelry",
    labelZh: "珠宝首饰",
    labelEn: "Jewelry",
    zh: "一个珠宝首饰品牌，寓意「值得刻在戒圈内侧、写进故事里的名字」；气质要优雅、有故事感、十年不过时；场景是礼盒印字、求婚讲述和「她戴的是 X」的转述里都配得上价格。",
    en: "A jewelry brand. The name should deserve to be engraved inside a ring and written into a story; the vibe is elegant, storied, timeless for a decade; it must earn its price on a gift box, in a proposal retelling, and in \"she wears X\".",
  },
  {
    slug: "toys",
    labelZh: "玩具品牌",
    labelEn: "Toy brand",
    zh: "一个玩具/潮玩品牌，寓意「孩子念着开心、大人拆盒惊喜」；气质要欢乐、有弹跳感、留得住 IP 想象；场景是货架包装、拆盒视频和「给娃买 X」的家长转述里都好念好记。",
    en: "A toy or designer-toy brand. The name should be fun in a child's mouth and a thrill at unboxing for adults; the vibe is joyful, bouncy, with room for an IP universe; it must pop on shelf packaging, in unboxing videos, and in \"get the kids an X\".",
  },
  {
    slug: "brewery",
    labelZh: "精酿酒饮",
    labelEn: "Craft beer & drinks",
    zh: "一个精酿啤酒/新酒饮品牌，寓意「杯子里装的是态度不是水啤」；气质要有梗、敢反叛、酒标画得出来；场景是酒吧口播点单、冰柜货架和「尝尝 X 的新款」的酒友安利里都响亮带感。",
    en: "A craft brewery or drinks brand. The name should put attitude in the glass, not watery lager; the vibe is witty, rebellious, drawable as label art; it must ring out when ordered at the bar, stand out on the fridge shelf, and carry \"try the new one from X\".",
  },
  {
    slug: "furniture",
    labelZh: "家具品牌",
    labelEn: "Furniture",
    zh: "一个家具/家居品牌，寓意「一件陪你住十年的东西，名字也要耐看十年」；气质要温润、有材质感、经得起岁月；场景是新家开箱、朋友问「这沙发哪买的」和二手转卖页里都体面耐看。",
    en: "A furniture or home brand. The name should wear as well as a piece that lives with you for a decade; the vibe is warm, material-honest, built to age gracefully; it must look right at a housewarming, in \"where's this sofa from?\", and even on a resale listing.",
  },
  {
    slug: "crossfit",
    labelZh: "CrossFit 综合体能",
    labelEn: "CrossFit & functional fitness",
    zh: "一个 CrossFit/综合体能馆品牌，寓意「一群人互相打气把自己练崩再练强」；气质要有汗味、有战意、有部落图腾感；场景是教练开场口号、队服背印和「周六来 X 玩一场」的会员邀约里都喊得响。",
    en: "A CrossFit box or functional fitness gym. The name should carry the tribe that cheers each other through brutal workouts; the vibe is sweaty, battle-ready, totem-like; it must roar in a coach's class opener, print well on team shirts, and carry \"come try a class at X on Saturday\".",
  },
  {
    slug: "language",
    labelZh: "语言学习",
    labelEn: "Language learning",
    zh: "一个语言学习产品，寓意「每天五分钟，离另一种语言更近一点」；气质要轻盈、游戏感、跨语言都好念；场景是打卡分享、应用商店搜索和「我在用 X 学日语」的朋友转述里都轻松上口。",
    en: "A language learning product. The name should make \"five minutes a day\" feel believable; the vibe is light, playful, pronounceable in any native tongue; it must shine in streak shares, app-store search, and \"I'm learning Japanese on X\".",
  },
  {
    slug: "resume",
    labelZh: "简历求职",
    labelEn: "Resume & job search",
    zh: "一个简历/求职工具，寓意「用了它，面试敲门更有底气」；气质要专业、给人信心、敢被 HR 看见；场景是简历页脚署名、深夜投递和「我靠 X 拿到 offer」的转述里都体面加分。",
    en: "A resume builder or job-search tool. The name should make users walk into interviews taller; the vibe is professional, confidence-giving, proud to be seen by recruiters; it must look right in a resume footer, at a midnight application, and in \"I landed the offer with X\".",
  },
  {
    slug: "events",
    labelZh: "活动策划",
    labelEn: "Event planning",
    zh: "一个活动策划公司，寓意「不容有失的时刻，交给我准没错」；气质要专业稳当、又藏着创意火花；场景是比稿 PPT 封面、场地背板署名和「年会找 X 办准没错」的转介绍里都撑得住场。",
    en: "An event planning company. The name should promise a moment that cannot fail is in good hands; the vibe is dependable with a creative spark; it must hold up on a pitch-deck cover, a venue backdrop credit, and \"for the gala, just call X\".",
  },
  {
    slug: "moving",
    labelZh: "搬家服务",
    labelEn: "Moving services",
    zh: "一个搬家服务品牌，寓意「全部家当交给它，稳稳当当搬进新生活」；气质要可靠、利落、有人情味；场景是电话报价自报家门、货车车身和「搬家就找 X」的邻里推荐里都一听就放心。",
    en: "A moving services brand. The name should promise everything you own arrives safely in the new life; the vibe is reliable, brisk, human; it must land in one hearing on a quote call, read at a glance on the truck, and carry \"just use X\" between neighbors.",
  },
  {
    slug: "aquarium",
    labelZh: "水族爬宠",
    labelEn: "Aquariums & reptiles",
    zh: "一个水族/爬宠品牌，寓意「一缸一世界的静观生态美学」；气质要静谧、通透、专业懂行；场景是开缸分享帖标题、器材包装和爬友圈的口碑安利里都显得内行。",
    en: "An aquarium or reptile brand. The name should hold a world in a glass box; the vibe is still, crystal-clear, quietly expert; it must read right titling a tank-journal post, on gear packaging, and in word of mouth among serious keepers.",
  },
  {
    slug: "indiehacker",
    labelZh: "独立开发者",
    labelEn: "Indie hacker",
    zh: "一款独立开发者做的效率小工具，寓意「一个人也能做出很多人爱用的产品」；气质要轻巧、真诚、有极客味；场景是 Product Hunt 发布页、X 帖子和「我做了 X」的自我介绍里都顺口好记。",
    en: "A productivity tool built by an indie hacker. The name should feel like one person shipping something many people love; the vibe is light, sincere, quietly geeky; it must roll off the tongue on a Product Hunt launch, in an X post, and in \"I built X\".",
  },
  {
    slug: "petsupplies",
    labelZh: "宠物用品电商",
    labelEn: "Pet supplies store",
    zh: "一个宠物用品电商品牌，寓意「毛孩子的每一餐每一个玩具都值得认真挑」；气质要温暖、可信、让人愿意月月回购；场景是电商搜索结果、快递箱面单和铲屎官群里的安利都好认好念。",
    en: "A pet supplies e-commerce brand. The name should promise every meal and toy for the furry kid is carefully chosen; the vibe is warm, trustworthy, worth reordering monthly; it must stand out in marketplace search, on the shipping box, and in pet-owner group chats.",
  },
  {
    slug: "preschool",
    labelZh: "儿童早教",
    labelEn: "Early education",
    zh: "一个儿童早教与启蒙品牌，寓意「像种子发芽一样，陪孩子一点点长大」；气质要温暖专业、让家长放心、让孩子喜欢；场景是妈妈群转介绍、报名页和孩子喊「我要玩 X」时都成立。",
    en: "An early childhood education brand. The name should feel like a seed sprouting — growing with the child day by day; the vibe is warm yet expert, reassuring to parents, delightful to kids; it must work in parent group referrals, on the enrollment page, and when a toddler shouts \"I want to play X\".",
  },
  {
    slug: "travelshoot",
    labelZh: "旅拍摄影",
    labelEn: "Travel photography",
    zh: "一个旅拍摄影品牌，寓意「把此刻在此地的时光定格带走」；气质要浪漫、通透、有远方感又显专业；场景是照片水印、小红书定位标签和评论区「摄影师是谁求 @」里都好记好搜。",
    en: "A travel photography brand. The name should promise this moment, in this place, kept forever; the vibe is romantic, luminous, wanderlust-tinged yet professional; it must read well as a photo watermark, in a location tag, and in \"who's the photographer? tag them!\" comments.",
  },
  {
    slug: "forwarder",
    labelZh: "跨境物流",
    labelEn: "Cross-border logistics",
    zh: "一个跨境物流货代品牌，寓意「货一定安全准时到达世界任何角落」；气质要稳、专业、有全球网络感；场景是卖家询价微信、海外代理英文邮件和报价单抬头上都可信顺口。",
    en: "A cross-border freight forwarding brand. The name should promise cargo arrives safely and on time anywhere in the world; the vibe is steady, professional, globally networked; it must sound credible in a seller's quote request, an overseas agent's email, and on the rate card header.",
  },
  {
    slug: "mcn",
    labelZh: "短视频 MCN",
    labelEn: "Short-video MCN",
    zh: "一家短视频 MCN 机构，寓意「一套能把达人做火的造星系统」；气质要有能量、正规、有内容宇宙感；场景是达人签约谈判、品牌方报价单和平台机构榜单里都拿得出手。",
    en: "A short-video MCN agency. The name should feel like a star-making system that turns creators into hits; the vibe is energetic, legitimate, universe-scale; it must impress in creator signing talks, on a brand's rate card, and on platform agency leaderboards.",
  },
  {
    slug: "opensource",
    labelZh: "开源项目",
    labelEn: "Open source",
    zh: "一个开源项目，寓意「一群人一起把一个好工具做到极致」；气质要简洁、有极客彩蛋感、全小写好敲；场景是 npm install 命令、README 标题和技术分享里的「我们用 X 替换了它」都顺手顺口。",
    en: "An open source project. The name should feel like a community polishing one great tool together; the vibe is minimal, quietly witty, all-lowercase and typeable; it must work as an npm install command, a README title, and in \"we replaced it with X\" conference talks.",
  },
  {
    slug: "indiegame",
    labelZh: "独立游戏",
    labelEn: "Indie games",
    zh: "一款独立游戏或游戏工作室，寓意「一段只有这里才有的独特体验」；气质要有情绪浓度、有世界观想象、一听就想搜；场景是 Steam 搜索框、主播口播「今天玩 X」和玩家安利帖里都好找好记。",
    en: "An indie game or studio. The name should promise an experience found nowhere else; the vibe is emotionally dense, world-evoking, instantly searchable; it must be findable in the Steam search box, in a streamer's \"today we're playing X\", and in fan recommendation posts.",
  },
  {
    slug: "gearrental",
    labelZh: "影棚器材租赁",
    labelEn: "Gear & studio rentals",
    zh: "一个摄影棚与摄影器材租赁品牌，寓意「设备准时到、灯全亮、棚准点开门」；气质要专业、靠谱、有圈内懂行感；场景是摄影师的「棚我订的 X」转介绍、报价单抬头和同城闪送面单上都可信顺口。",
    en: "A photo studio and camera gear rental brand. The name should promise the gear arrives, the lights fire, the studio opens on time; the vibe is professional, dependable, insider-fluent; it must sound right in a photographer's referral, on a quote header, and on a same-day delivery label.",
  },
  {
    slug: "sourcing",
    labelZh: "电商选品",
    labelEn: "Product sourcing",
    zh: "一个电商选品与市场分析工具，寓意「比别人早一步看到爆款」；气质要敏锐、数据感、像一台选品雷达；场景是卖家教程口播「我用的是 X」、卖家社群安利和订阅付费页上都可信好记。",
    en: "An e-commerce product research tool. The name should feel like seeing the winning product one step before everyone else; the vibe is sharp, data-driven, radar-like; it must land in tutorial voice-overs (\"I use X\"), seller community referrals, and on the subscription pricing page.",
  },
  {
    slug: "fleamarket",
    labelZh: "线下市集",
    labelEn: "Markets & pop-ups",
    zh: "一个线下市集与快闪活动品牌，寓意「有趣的人在有趣地聚集」；气质要好玩、上镜、有在地文化感；场景是小红书封面海报、朋友圈「这周末去 X」和主理人招商函里都亮眼可信。",
    en: "A flea market and pop-up event brand. The name should feel like interesting people gathering interestingly; the vibe is playful, photogenic, rooted in local culture; it must pop on a poster, in \"let's hit X this weekend\" messages, and in vendor recruitment letters.",
  },
  {
    slug: "ski",
    labelZh: "滑雪户外",
    labelEn: "Ski & snow",
    zh: "一个滑雪装备与雪友社群品牌，寓意「山就在那里，雪季永远值得」；气质要野、有速度感、又撑得起专业信任；场景是雪道上的呼喊、雪具吊牌和雪友群「去 X 家拿板」的安利里都一遍听清。",
    en: "A ski gear and snow community brand. The name should feel like the mountain is calling and the season is always worth it; the vibe is wild, fast, yet safety-grade trustworthy; it must carry through a shout across the slope, on a gear hangtag, and in \"grab your board at X\" crew chats.",
  },
  {
    slug: "aiart",
    labelZh: "AI 绘画",
    labelEn: "AI art tool",
    zh: "一款 AI 绘画与图像生成工具，寓意「把脑海里的画面念咒成像」；气质要有魔法感、想象力、又像一件可靠的创作工具；场景是作品水印、社区话题标签和「用 X 跑的」口播安利里都短小好搜。",
    en: "An AI image generation tool. The name should feel like conjuring the picture in your head into pixels; the vibe is magical, imaginative, yet dependable as a creative tool; it must stay short and searchable as a watermark, in hashtags, and in \"made with X\" mentions.",
  },
  {
    slug: "campsite",
    labelZh: "露营地",
    labelEn: "Campground",
    zh: "一个露营地与营地运营品牌，寓意「离开城市，把日子搬到星空下」；气质要野而不糙、有画面感、让人想立刻出发；场景是小红书定位标签、导航目的地和「这周末去 X」的召唤里都好记好搜。",
    en: "A campground and camp operations brand. The name should feel like moving life under the stars, away from the city; the vibe is wild yet polished, scenic, instantly wanderlust-inducing; it must work as a location tag, a navigation destination, and in \"X this weekend?\" group chats.",
  },
  {
    slug: "tcm",
    labelZh: "中医养生",
    labelEn: "TCM wellness",
    zh: "一个中医养生与草本理疗品牌，寓意「顺着节气把身体慢慢养回来」；气质要温润专业、有东方底蕴、又不老气说教；场景是预约小程序、门店招牌和年轻人「去 X 做个推拿」的安利里都可信顺口。",
    en: "A TCM wellness and herbal therapy brand. The name should feel like gently nursing the body back in rhythm with the seasons; the vibe is warm, professional, deeply Eastern yet never musty; it must sound credible on a booking page, a storefront sign, and in \"let's get a massage at X\" referrals.",
  },
  {
    slug: "deskcraft",
    labelZh: "桌面文创",
    labelEn: "Desk & stationery",
    zh: "一个桌面文创与文具周边品牌，寓意「把 8 小时的案头过成自己喜欢的样子」；气质要有审美立场、治愈、值得收集；场景是桌搭笔记、开箱视频和市集摊位招牌上入镜都好看好记。",
    en: "A stationery and desk accessories brand. The name should feel like making your eight desk-bound hours your own; the vibe is aesthetically opinionated, soothing, collectible; it must look good on camera in desk-setup posts, unboxing videos, and on a market-stall sign.",
  },
  {
    slug: "petmemorial",
    labelZh: "宠物殡葬",
    labelEn: "Pet memorial",
    zh: "一个宠物殡葬与纪念服务品牌，寓意「温柔地送毛孩子走完最后一程」；气质要温暖、庄重而不冰冷、值得托付；场景是深夜含泪的搜索、宠物医院的转介绍和纪念品包装上都温柔可信。",
    en: "A pet aftercare and memorial service brand. The name should promise a gentle send-off for the furry family member; the vibe is warm, dignified without coldness, worthy of trust; it must feel tender in a tearful 2 a.m. search, a vet's referral, and on keepsake packaging.",
  },
  {
    slug: "postpartum",
    labelZh: "月子中心",
    labelEn: "Postpartum care",
    zh: "一个月子中心与产后护理品牌，寓意「新手妈妈被温柔地接住」；气质要轻奢温暖、有医护级专业感、全家人都放心；场景是妈妈群转介绍、参观预约页和长辈口中念出来都顺口吉利。",
    en: "A postpartum retreat and maternal care brand. The name should feel like a new mother being gently caught; the vibe is softly luxurious, nurse-grade professional, reassuring to the whole family; it must work in mom-group referrals, on the tour booking page, and sound auspicious when grandparents say it aloud.",
  },
  {
    slug: "pettraining",
    labelZh: "宠物训练",
    labelEn: "Pet training",
    zh: "一个宠物训练与行为矫正品牌，寓意「让人和毛孩子学会互相理解」；气质要温柔专业、正向不打骂、像犬校一样可信；场景是遛狗时的转介绍、预约小程序和训犬师认证墙上都顺口可靠。",
    en: "A pet training and behavior brand. The name should feel like helping humans and their dogs learn to understand each other; the vibe is gentle, professional, positive-method, credible like a proper school; it must roll off the tongue in dog-park referrals, on the booking page, and beside the trainer certification wall.",
  },
  {
    slug: "nailsalon",
    labelZh: "美甲美睫",
    labelEn: "Nail & lash studios",
    zh: "一个美甲美睫工作室品牌，寓意「把方寸指尖过成自己的审美」；气质要有风格立场、精致治愈、像闺蜜的工作室；场景是小红书主页、预约链接和「你指甲在哪做的」的口播转介绍里都好念好记。",
    en: "A nail and lash studio brand. The name should feel like making the two-centimeter canvas your own aesthetic; the vibe is stylistically opinionated, polished, soothing, like a best friend's atelier; it must look good on an Instagram bio, a booking link, and travel well in \"where did you get your nails done?\"",
  },
  {
    slug: "laundry",
    labelZh: "洗衣洗护",
    labelEn: "Laundry & garment care",
    zh: "一个洗衣与衣物护理品牌，寓意「让心爱的衣物穿回第一天的样子」；气质要干净利落、专业可托付、有焕新感；场景是小程序下单、取送短信和写字楼电梯广告里都清爽可信。",
    en: "A laundry and garment care brand. The name should promise beloved garments worn like day one; the vibe is crisp, professional, entrustable, with a sense of renewal; it must feel clean and credible in an ordering app, a pickup notification, and an office-tower elevator ad.",
  },
  {
    slug: "rvtravel",
    labelZh: "房车旅行",
    labelEn: "RV travel",
    zh: "一个房车租赁与房车旅行品牌，寓意「带着家去看世界」；气质要自由松弛、又靠谱安心、全家都喜欢；场景是亲子游攻略、租车比价页和营地招牌上都好记顺口。",
    en: "An RV rental and camper travel brand. The name should feel like taking your home to see the world; the vibe is free and easygoing yet reliable and reassuring, loved by the whole family; it must be memorable in family trip guides, on rental comparison pages, and on a campground sign.",
  },
  {
    slug: "knowledgepay",
    labelZh: "知识付费",
    labelEn: "Paid knowledge",
    zh: "一个知识付费与付费社群品牌，寓意「学了真的有收获，还遇见同路人」；气质要有获得感、体系专业、不割韭菜；场景是直播口播「搜 X 加入」、社群裂变海报和年费续订页上都清晰可信。",
    en: "A paid courses and membership community brand. The name should promise real takeaways and finding your people; the vibe is outcome-driven, structured, professional, never grifty; it must be unambiguous in a live-stream \"search X to join,\" on referral posters, and on the annual renewal page.",
  },
  {
    slug: "matchmaking",
    labelZh: "婚恋相亲",
    labelEn: "Matchmaking & dating",
    zh: "一个婚恋相亲与高端匹配服务品牌，寓意「认真的人遇见认真的人」；气质要真诚郑重、有缘分感、父母听着也放心；场景是会员注册页、红娘回访电话和家庭饭桌上的提起都得体可信。",
    en: "A matchmaking and dating service brand. The name should feel like serious people meeting serious people; the vibe is sincere, respectful, touched with destiny, reassuring even to parents; it must sound proper on the membership page, in a matchmaker's follow-up call, and when mentioned at the family dinner table.",
  },
  {
    slug: "tattoo",
    labelZh: "纹身工作室",
    labelEn: "Tattoo studios",
    zh: "一个纹身工作室品牌，寓意「把值得纪念的故事郑重地留在身上」；气质要有风格立场、专业卫生、带一点永恒的仪式感；场景是作品集主页、预约私信和「你这是在哪纹的」的口播转介绍里都好记有型。",
    en: "A tattoo studio brand. The name should feel like stories worth keeping, marked with ceremony; the vibe is stylistically opinionated, professional, hygienic, with a touch of permanence; it must look sharp on a portfolio page, in booking DMs, and travel well in \"where did you get that done?\"",
  },
  {
    slug: "climbing",
    labelZh: "攀岩馆",
    labelEn: "Climbing gyms",
    zh: "一个攀岩馆与抱石馆品牌，寓意「每个人都能爬出自己的高度」；气质要有社群归属感、街头工业风、对新手友好；场景是「周末去哪爬」的岩友邀约、体验课预约页和馆内墙面招牌上都顺口带劲。",
    en: "A climbing and bouldering gym brand. The name should feel like everyone can climb to their own height; the vibe is community-driven, industrial-street, beginner-friendly; it must roll off the tongue in \"where are you climbing this weekend?\", on the intro-class booking page, and on the gym wall.",
  },
  {
    slug: "swimschool",
    labelZh: "游泳培训",
    labelEn: "Swim schools",
    zh: "一个游泳培训与亲子水育品牌，寓意「让孩子像小鱼一样自在」；气质要安全专业、童趣欢快、家长放心；场景是妈妈群转介绍、课程包续费页和孩子喊出「我要去 XX 游泳」时都顺口好记。",
    en: "A swim school and baby-swimming brand. The name should promise kids swimming as freely as little fish; the vibe is safe, professional, playfully cheerful, reassuring to parents; it must work in mom-group referrals, on the class-pack renewal page, and when a child shouts \"I want to go swim at X!\"",
  },
  {
    slug: "3dprint",
    labelZh: "3D 打印",
    labelEn: "3D printing",
    zh: "一个 3D 打印与按需制造服务品牌，寓意「想得出就做得出」；气质要专业快速、有造物的科技感、工程师与个人客户都信任；场景是对公报价单、创客社区口碑和「打样明天就能拿」的承诺里都干脆可信。",
    en: "A 3D printing and on-demand manufacturing brand. The name should promise that anything imaginable can be made; the vibe is professional, fast, maker-tech, trusted by engineers and hobbyists alike; it must look solid on a B2B quote, in maker-community word of mouth, and behind a next-day prototype promise.",
  },
  {
    slug: "vending",
    labelZh: "无人零售",
    labelEn: "Vending & unattended retail",
    zh: "一个自动售货与无人零售品牌，寓意「你需要的时候它都在」；气质要便利可靠、聪明高效、带一点人情味；场景是写字楼机身贴纸、点位合作提案和扫码小程序上都清爽好认。",
    en: "A vending and unattended retail brand. The name should promise it's always there when you need it; the vibe is convenient, reliable, smartly efficient, with a touch of warmth; it must read cleanly on a machine wrap in an office lobby, in a site-partnership deck, and on the scan-to-pay mini app.",
  },
  {
    slug: "kidsart",
    labelZh: "少儿美术",
    labelEn: "Kids' art schools",
    zh: "一个少儿美术与创意教育品牌，寓意「保护每个孩子敢想敢画的天性」；气质要色彩明快、童趣专业、家长觉得有体系；场景是家长群转介绍、试听课海报和孩子喊出「我要去 XX 画画」时都欢快好念。",
    en: "A children's art education brand. The name should feel like protecting every child's daring to imagine and paint; the vibe is colorful, playful yet professional, structured enough for parents; it must charm in parent-group referrals, on trial-class posters, and when a child shouts \"I want to paint at X!\"",
  },
  {
    slug: "danceschool",
    labelZh: "舞蹈工作室",
    labelEn: "Dance studios",
    zh: "一个舞蹈工作室与舞蹈培训品牌，寓意「在节拍里遇见更自信的自己」；气质要有律动感、有厂牌范儿、对新手友好；场景是短视频话题标签、课堂喊队名和「你在哪学跳舞」的口播里都带节拍好记。",
    en: "A dance studio brand. The name should feel like meeting a bolder you inside the beat; the vibe is rhythmic, label-cool, welcoming to beginners; it must carry a beat in short-video hashtags, in class chants, and in \"where do you take dance?\" word of mouth.",
  },
  {
    slug: "martialarts",
    labelZh: "武术格斗馆",
    labelEn: "Martial arts gyms",
    zh: "一个武术格斗馆品牌，寓意「练的是拳，修的是自己」；气质要专业血性但不戾气、师承有据、家长也放心；场景是体验课转介绍、少儿班招生页和「我在 XX 练拳」的口播里都立得住。",
    en: "A martial arts gym brand. The name should feel like training the fist to forge the self; the vibe is credible and gritty without malice, lineage-backed, reassuring to parents; it must stand up in trial-class referrals, on the kids' program page, and in \"I train at X.\"",
  },
  {
    slug: "bikeshop",
    labelZh: "骑行单车",
    labelEn: "Bike shops & cycling",
    zh: "一个骑行品牌与单车店，寓意「用自己的力量抵达」；气质要有风的速度感、圈内格调、对通勤家庭客也友好；场景是周末约骑的车队名、装备电商详情页和「去 XX 保养车」的口播里都顺口有型。",
    en: "A cycling brand or bike shop. The name should feel like arriving under your own power; the vibe is wind-fast, insider-stylish, yet friendly to commuters and families; it must sound sharp as a weekend ride crew name, on a gear product page, and in \"take it to X for a tune-up.\"",
  },
  {
    slug: "fishing",
    labelZh: "垂钓渔具",
    labelEn: "Fishing & tackle",
    zh: "一个垂钓渔具品牌，寓意「静得下心，也钓得上鱼」；气质要硬核可靠、有水边的宁静感、对新手钓客也友好；场景是钓友圈装备推荐、直播间口播和「用的 XX 的竿」的爆护分享里都立得住。",
    en: "A fishing and tackle brand. The name should feel like stillness that lands the fish; the vibe is hardcore-reliable, waterside-calm, welcoming to new anglers; it must hold up in tackle recommendations among fishing buddies, in livestream shoutouts, and in \"caught it on an X rod.\"",
  },
  {
    slug: "foodtruck",
    labelZh: "餐车小吃",
    labelEn: "Food trucks & street food",
    zh: "一个餐车与街头小吃品牌，寓意「烟火气开到哪，香到哪」；气质要香辣诱人、有人情味、一瞥就知道卖什么；场景是夜市招牌远看、排队拍照发圈和「今天车停哪」的社媒追踪里都好认好传。",
    en: "A food truck and street food brand. The name should smell delicious wherever the wheels stop; the vibe is sizzling, warm-hearted, instantly clear about what's cooking; it must read from across a night market, look great in queue photos, and travel in \"where's the truck today?\" posts.",
  },
  {
    slug: "repair",
    labelZh: "维修服务",
    labelEn: "Repair & handyman services",
    zh: "一个家电维修与上门服务品牌，寓意「一次修好，明码实价」；气质要诚信靠谱、师傅专业、快而不敲竹杠；场景是邻里群转介绍、上门工单和「我认识个 XX，靠谱」这句话里都让人放心开门。",
    en: "An appliance repair and handyman brand. The name should promise fixed right the first time, priced honestly; the vibe is trustworthy, craftsman-professional, fast without gouging; it must reassure in neighborhood referrals, on a service work order, and in \"I know a guy at X — reliable.\"",
  },
  {
    slug: "pottery",
    labelZh: "陶艺手作",
    labelEn: "Pottery & ceramics",
    zh: "一个陶艺工作室与手作器物品牌，寓意「把一下午的专注烧成一件器物」；气质要温润安静、有手作的不完美温度、发得出朋友圈；场景是体验课转介绍、器物电商详情页和「我在 XX 做了个碗」的分享里都好念好记。",
    en: "A pottery studio and handmade ceramics brand. The name should feel like an afternoon of focus fired into an object; the vibe is warm, quiet, alive with handmade imperfection, postable; it must carry in class referrals, on a ceramics shop page, and in \"I threw a bowl at X.\"",
  },
  {
    slug: "billiards",
    labelZh: "台球桌球馆",
    labelEn: "Billiards & pool halls",
    zh: "一个台球馆与桌球俱乐部品牌，寓意「一杆进袋的干脆利落」；气质要有会所格调也不失松弛、懂球的人会心、朋友聚会想得起；场景是「附近台球」地图搜索、球友约局口播和店招远看里都一眼认出是打球的地方。",
    en: "A billiards hall and pool club brand. The name should feel like the clean snap of a perfect pot; the vibe is club-polished yet easygoing, knowing to insiders, first to mind for a night out; it must read as a place to play in map searches, in \"rack 'em at X\" invites, and on the sign from across the street.",
  },
  {
    slug: "drivingschool",
    labelZh: "驾校驾培",
    labelEn: "Driving schools",
    zh: "一个驾校与驾培品牌，寓意「一次学好，一路顺遂」；气质要正规靠谱、教练耐心不吼人、家长与上班族都放心；场景是「城市+驾校」搜索、老学员转介绍和「我在 XX 学的车，教练不错」这句口播里都立得住。",
    en: "A driving school brand. The name should promise learned right once, smooth roads after; the vibe is legitimate, patient, no-yelling, reassuring to parents and commuters alike; it must hold up in \"driving school near me\" searches, in alumni referrals, and in \"I learned at X — great instructor.\"",
  },
  {
    slug: "optician",
    labelZh: "眼镜视光",
    labelEn: "Opticians & eyewear",
    zh: "一个眼镜店与视光中心品牌，寓意「把世界重新调回高清」；气质要专业可信、验光有体系、镜框又有设计感；场景是商场招牌、儿童近视防控咨询和「我在 XX 配的镜，验光很细」的转介绍里都让人放心。",
    en: "An optical shop and eyewear brand. The name should feel like the world tuned back to high definition; the vibe is clinically credible with designer frames on top; it must reassure on a mall storefront, in a kids' myopia-control consult, and in \"I got fitted at X — thorough exam.\"",
  },
  {
    slug: "massage",
    labelZh: "按摩推拿",
    labelEn: "Massage & bodywork",
    zh: "一个按摩推拿与身体调理品牌，寓意「把绷了一周的肩颈松回来」；气质要正规清爽、手法专业、白领敢把店名发进家庭群；场景是「附近按摩」搜索、下班顺路进店和「XX 家手法真不错」的回头客转述里都好念好记。",
    en: "A massage and bodywork brand. The name should feel like a week of shoulder tension finally released; the vibe is clean, legitimate, professionally skilled — a name you'd post in the family group chat; it must work in \"massage near me\" searches, after-work walk-ins, and regulars' word of mouth.",
  },
  {
    slug: "mealprep",
    labelZh: "轻食健康餐",
    labelEn: "Meal prep & healthy eats",
    zh: "一个轻食与健康餐品牌，寓意「好好吃饭，轻装上阵」；气质要清爽有食欲、健康不苦行、自律而松弛；场景是外卖列表小图旁、健身房联名海报和「中午吃 XX，下午不困」的同事安利里都清爽好记。",
    en: "A healthy meal and salad brand. The name should feel like eating well and traveling light; the vibe is fresh but appetizing, disciplined without the diet gloom; it must pop beside a delivery-app thumbnail, on a gym partnership poster, and in \"X for lunch — no afternoon slump\" coworker recs.",
  },
  {
    slug: "petphoto",
    labelZh: "宠物摄影",
    labelEn: "Pet photography",
    zh: "一个宠物摄影工作室品牌，寓意「把毛孩子的每个瞬间定格成家庭纪念」；气质要温暖专业、拟人视角、拍的是家人不是动物；场景是小红书作品流标签、预约咨询和「我家孩子在 XX 拍的写真」的家长转述里都好念好记。",
    en: "A pet photography studio brand. The name should feel like freezing a fur kid's every moment into a family keepsake; the vibe is warm and professional, shooting family members rather than animals; it must work as an Instagram hashtag, in booking chats, and in \"we got our baby's portraits at X\" pet-parent word of mouth.",
  },
  {
    slug: "campgear",
    labelZh: "露营装备",
    labelEn: "Camping gear",
    zh: "一个露营装备品牌，寓意「可靠的装备是通往山野的门票」；气质要结实可信又带荒野浪漫、雪峰篝火感；场景是装备评测视频、海淘清单和「我这顶帐篷是 XX 的，暴雨没漏」的圈内口碑里都好认好记。",
    en: "A camping gear brand. The name should feel like reliable gear as the ticket to the wild; the vibe is rugged and trustworthy with a streak of wilderness romance — snow peaks and campfires; it must hold up in gear review videos, cross-border shopping lists, and \"my X tent survived the storm\" campfire word of mouth.",
  },
  {
    slug: "careercoach",
    labelZh: "职业规划咨询",
    labelEn: "Career coaching",
    zh: "一个职业规划与生涯咨询品牌，寓意「帮人在职业迷雾里找到北极星」；气质要专业可信、有方向感、卖终点不卖焦虑；场景是公众号标题、播客片头和「我找 XX 做了职业咨询，思路清晰多了」的转介绍里都顺口可信。",
    en: "A career planning and coaching brand. The name should feel like finding your north star in a career fog; the vibe is credible and directional, selling destinations rather than anxiety; it must sit naturally in a post headline, a podcast intro, and \"I did a session with X — so much clearer now\" referrals.",
  },
  {
    slug: "fragrance",
    labelZh: "香氛蜡烛",
    labelEn: "Home fragrance & candles",
    zh: "一个香氛蜡烛与家居香品牌，寓意「点燃一支蜡烛，回到某个想念的时刻」；气质要有通感画面、轻奢克制、好念但有距离感；场景是礼盒烫金、朋友圈晒单和「这支雪松香是 XX 家的」的种草转述里都得体好记。",
    en: "A candle and home fragrance brand. The name should feel like lighting a candle and returning to a moment you miss; the vibe is synesthetic, quietly luxurious, pronounceable but slightly distant; it must emboss well on a gift box, share easily in a caption, and carry in \"that cedar candle is from X\" recommendations.",
  },
  {
    slug: "diving",
    labelZh: "潜水俱乐部",
    labelEn: "Diving & scuba",
    zh: "一个潜水俱乐部与潜店品牌，寓意「潜入深蓝，像飞一样自由」；气质要向往感与专业感并存、深蓝浪漫但安全可信；场景是考证攻略搜索、出行社群召集和「我在 XX 考的证，教练特别细」的老带新转述里都好读好记。",
    en: "A dive shop and scuba club brand. The name should feel like sinking into deep blue and flying free; the vibe balances longing with professionalism — ocean romance backed by safety credibility; it must read well in certification-guide searches, trip group invites, and \"I got certified at X — great instructors\" buddy referrals.",
  },
  {
    slug: "carwash",
    labelZh: "汽车美容洗车",
    labelEn: "Car wash & detailing",
    zh: "一个洗车与汽车美容品牌，寓意「开走时像提新车」；气质要干净利落、效率与仪式感兼顾、连锁招牌统一得起来；场景是「附近洗车」地图搜索、路过招牌和「我在 XX 办的月卡，顺路就洗」的车主安利里都好认好记。",
    en: "A car wash and detailing brand. The name should feel like driving away in a brand-new car; the vibe is clean and efficient with room for ritual, ready to unify across chain storefronts; it must stand out in \"car wash near me\" maps, read from a drive-by sign, and carry in \"I got the monthly pass at X\" owner recs.",
  },
];

/** /?tpl=<slug> 预填行业模板（行业命名指南页 CTA 入口）；slug 对不上忽略 */
function templateFromQuery(lang: string): string {
  const q = new URLSearchParams(window.location.search).get("tpl")?.trim().toLowerCase();
  const tpl = q ? TEMPLATES.find((x) => x.slug === q) : undefined;
  return tpl ? (lang === "zh" ? tpl.zh : tpl.en) : "";
}

/** /?q=<描述> 预填搜索描述（分享搜索链接入口），优先于 tpl */
function descriptionFromQuery(): string {
  return new URLSearchParams(window.location.search).get("q")?.trim().slice(0, MAX_LEN) ?? "";
}

/** /?style= 与 /?len= 预填风格/长度偏好（分享搜索链接入口）；对不上选项忽略 */
function optionFromQuery(param: string, options: { value: string }[]): string {
  const q = new URLSearchParams(window.location.search).get(param)?.trim();
  return q && options.some((o) => o.value === q) ? q : "";
}

// value 保持中文（传给 AI 的提示词），label 按语言切换
export const STYLE_OPTIONS: { value: string; labelKey: I18nKey }[] = [
  { value: "none", labelKey: "home.style.none" },
  { value: "极客风", labelKey: "home.style.geek" },
  { value: "商务专业", labelKey: "home.style.business" },
  { value: "文艺诗意", labelKey: "home.style.poetic" },
  { value: "中文拼音", labelKey: "home.style.pinyin" },
];

export const LENGTH_OPTIONS: { value: string; labelKey: I18nKey }[] = [
  { value: "none", labelKey: "home.len.none" },
  { value: "短小精悍（≤8 字符）", labelKey: "home.len.short" },
  { value: "中等（9–12 字符）", labelKey: "home.len.mid" },
  { value: "长一点也可以（>12 字符）", labelKey: "home.len.long" },
];

export interface HomeValues {
  description: string;
  tlds: string[];
  style: string;
  lengthPref: string;
}

function MiniSelect({
  icon: Icon,
  value,
  options,
  onChange,
}: {
  icon: typeof Wand2;
  value: string;
  options: { value: string; labelKey: I18nKey }[];
  onChange: (v: string) => void;
}) {
  const { t } = useI18n();
  const current = options.find((o) => o.value === value) ?? options[0];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex h-11 items-center gap-1 rounded-lg border border-line bg-bg1 px-2.5 text-xs text-txt1 hover:text-txt0 sm:h-8">
          <Icon className="h-3.5 w-3.5" />
          {t(current.labelKey)}
          <ChevronDown className="h-3 w-3" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {options.map((o) => (
          <DropdownMenuItem key={o.value} onSelect={() => onChange(o.value)} className={cn(o.value === value && "text-brand")}>
            {t(o.labelKey)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** 可注册 chip 上的首年价（实时优先，静态参考价带 ≈）；续费≥3×首年时加「↑」提示续费陷阱，tooltip 显示续费价 */
function ChipPrice({ domain }: { domain: string }) {
  const { t } = useI18n();
  const prices = usePrices();
  const tld = domain.slice(domain.indexOf(".") + 1);
  const p = prices?.[tld];
  const s = tldPrice(tld);
  const text = p ? `$${p.registration}` : s ? `≈$${toUsd(s.first)}` : undefined;
  if (!text) return null;
  const renew = p ? p.renewal : s ? toUsd(s.renew) : undefined;
  const trap = p !== undefined && renew !== undefined && renew >= p.registration * 3;
  const tip = renew !== undefined ? t("quick.renewTip").replace("{price}", `${p ? "" : "≈"}$${renew}`) : undefined;
  return (
    <i title={tip} className="not-italic font-sans text-[10px] opacity-75">
      {text}
      {trap && <span className="text-amber-500">↑</span>}
    </i>
  );
}

/** 快速核验在所选 TLD 之外额外覆盖的主流后缀（显式 TLD 与所选优先，总数封顶 10） */
const QUICK_EXTRA_TLDS = ["com", "io", "ai", "app", "dev", "co", "net", "me"];

/** 「查更多后缀」按钮覆盖的第二批后缀（同样走 /api/search，0 AI 额度） */
const QUICK_MORE_TLDS = ["org", "xyz", "info", "cc", "tv", "tech", "online", "store", "site", "top", "shop", "cloud", "pro", "vip", "club", "link", "live", "space", "fun", "art", "design", "studio", "sh", "gg", "so", "us", "in", "world", "life", "agency", "games", "email", "network", "digital", "media", "group", "center", "works", "zone", "news", "tools", "run", "codes", "company", "wiki", "blog", "team", "chat", "finance", "global", "host", "social", "video", "fund", "land", "click", "icu", "page", "bio", "ink", "moe", "lol", "uk", "fm", "one", "cool", "red", "today", "best", "wtf", "pizza", "bar", "cafe", "money", "gold", "band", "cash", "city", "estate", "expert", "farm", "blue", "pink", "black", "ninja", "rocks", "pet", "academy", "school", "coach", "care", "doctor", "restaurant", "boutique", "clinic", "dental", "fitness", "photos", "gallery", "salon", "yoga", "coffee", "wine", "kitchen", "garden", "photography", "events", "solutions", "services", "consulting", "software", "marketing", "systems", "ventures", "capital", "guru", "tips"];

/** 快速核验的 chip（可注册/已注册）都可收藏到候选清单 */
function domainToRow(domain: string, status: Row["status"] = "available", expiresAt?: string): Row {
  const dot = domain.indexOf(".");
  return { domain, label: domain.slice(0, dot), tld: domain.slice(dot + 1), status, round: 0, expiresAt };
}

export function HomePage({
  initial,
  onSubmit,
  onBackToResults,
  onOpenAdvanced,
  shortlist,
}: {
  initial: HomeValues;
  onSubmit: (v: HomeValues) => void;
  onBackToResults?: () => void;
  onOpenAdvanced: () => void;
  shortlist: { has: (domain: string) => boolean; toggle: (row: Row) => void };
}) {
  const { t, lang } = useI18n();
  const [description, setDescription] = useState(() => descriptionFromQuery() || initial.description || templateFromQuery(lang));
  const [totalChecked, setTotalChecked] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/stats")
      .then((r) => (r.ok ? (r.json() as Promise<{ totalChecked: number }>) : null))
      .then((d) => {
        if (!cancelled && d && d.totalChecked > 0) setTotalChecked(d.totalChecked);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);
  const [tlds, setTlds] = useState<string[]>(initial.tlds);
  const [style, setStyle] = useState(() => initial.style || optionFromQuery("style", STYLE_OPTIONS) || "none");
  const [lengthPref, setLengthPref] = useState(() => initial.lengthPref || optionFromQuery("len", LENGTH_OPTIONS) || "none");
  const [customTld, setCustomTld] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  // 搜索模式分段器：AI 猎名（默认）/ 精确核验（免 AI 额度直接核验现成名字）；批量核验直达高级模式
  const [searchMode, setSearchMode] = useState<"ai" | "exact">("ai");

  const customTlds = tlds.filter((t) => !PRESET_TLDS.includes(t));
  const toggleTld = (t: string) => setTlds((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const addCustomTld = () => {
    const t = customTld.trim().toLowerCase().replace(/^\./, "");
    if (t && /^[a-z0-9-]{2,}$/.test(t) && !tlds.includes(t)) setTlds((prev) => [...prev, t]);
    setCustomTld("");
    setShowCustom(false);
  };

  const canRun = description.trim().length > 0 && tlds.length > 0;

  const quick = parseQuickCheck(description);
  const [quickRows, setQuickRows] = useState<{ domain: string; status: "checking" | "available" | "taken" | "unknown"; expiresAt?: string }[]>([]);
  const [quickRunning, setQuickRunning] = useState(false);
  const [quickMoreDone, setQuickMoreDone] = useState(false);
  // quick-check 图例过滤（IDS 式）：按状态筛 chips
  const [quickFilter, setQuickFilter] = useState<"all" | "available" | "taken" | "unknown">("all");
  const [quickCopied, setQuickCopied] = useState(false);
  const [variantCopied, setVariantCopied] = useState(false);
  const quickAbortRef = useRef<AbortController | null>(null);

  // 变体建议：心仪名字被注册时，用前后缀组合免费核验一批变体（同样不消耗 AI 次数）
  const [variantRows, setVariantRows] = useState<{ domain: string; status: "available" | "taken" | "unknown"; expiresAt?: string }[]>([]);
  const [variantChecked, setVariantChecked] = useState(0);
  const [variantTotal, setVariantTotal] = useState(0);
  const [variantRunning, setVariantRunning] = useState(false);
  const variantAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // 输入变化后清空上次快速核验结果；停顿 800ms 后对现成名字自动核验（走缓存的 /api/search，不消耗 AI 次数）
    quickAbortRef.current?.abort();
    variantAbortRef.current?.abort();
    setQuickRows([]);
    setQuickRunning(false);
    setQuickMoreDone(false);
    setQuickFilter("all");
    setVariantRows([]);
    setVariantChecked(0);
    setVariantTotal(0);
    setVariantRunning(false);
    if (!quick || quick.label.length < 3) return;
    const id = setTimeout(() => void runQuickCheck(), 800);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description]);

  async function runQuickCheck(more = false) {
    if (!quick) return;
    const baseTlds = [...new Set([...(quick.tld ? [quick.tld] : []), ...tlds, ...QUICK_EXTRA_TLDS])].slice(0, 10);
    const checkTlds = more ? QUICK_MORE_TLDS.filter((t) => !baseTlds.includes(t)) : baseTlds;
    if (checkTlds.length === 0) return;
    quickAbortRef.current?.abort();
    const ac = new AbortController();
    quickAbortRef.current = ac;
    const newRows = checkTlds.map((t) => ({ domain: `${quick.label}.${t}`, status: "checking" as const }));
    if (more) {
      setQuickMoreDone(true);
      setQuickRows((prev) => [...prev, ...newRows]);
    } else {
      setQuickMoreDone(false);
      setQuickRows(newRows);
    }
    setQuickRunning(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ roots: [quick.label], tlds: checkTlds }),
        signal: ac.signal,
      });
      if (!res.ok || !res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop()!;
        for (const line of lines) {
          if (!line) continue;
          const r = JSON.parse(line) as { domain?: string; status?: "available" | "taken" | "unknown"; expiresAt?: string; type?: string };
          if (r.type || !r.domain || !r.status) continue;
          setQuickRows((prev) => prev.map((row) => (row.domain === r.domain ? { ...row, status: r.status!, expiresAt: r.expiresAt } : row)));
        }
      }
    } catch {
      /* 中断/网络错误：保留已有结果 */
    } finally {
      if (!ac.signal.aborted) setQuickRunning(false);
    }
  }

  async function runVariantCheck() {
    if (!quick) return;
    const tld = quick.tld ?? tlds[0] ?? "com";
    variantAbortRef.current?.abort();
    const ac = new AbortController();
    variantAbortRef.current = ac;
    const total = (VARIANT_PREFIXES.length + 1) * (VARIANT_SUFFIXES.length + 1) - 1; // 去掉裸 root（已在上方核验过）
    setVariantRows([]);
    setVariantChecked(0);
    setVariantTotal(total);
    setVariantRunning(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ roots: [quick.label], prefixes: VARIANT_PREFIXES, suffixes: VARIANT_SUFFIXES, tlds: [tld] }),
        signal: ac.signal,
      });
      if (!res.ok || !res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop()!;
        for (const line of lines) {
          if (!line) continue;
          const r = JSON.parse(line) as { domain?: string; status?: "available" | "taken" | "unknown"; expiresAt?: string; type?: string };
          if (r.type || !r.domain || !r.status) continue;
          if (r.domain === `${quick.label}.${tld}`) continue; // 裸 root 不重复计
          setVariantChecked((n) => n + 1);
          setVariantRows((prev) => [...prev, { domain: r.domain!, status: r.status!, expiresAt: r.expiresAt }]);
        }
      }
    } catch {
      /* 中断/网络错误：保留已有结果 */
    } finally {
      if (!ac.signal.aborted) setVariantRunning(false);
    }
  }

  const submit = (desc = description) => {
    if (!desc.trim() || tlds.length === 0) return;
    setRecent(addRecentSearch({ description: desc.trim(), tlds, style, lengthPref }));
    onSubmit({
      description: desc.trim(),
      tlds,
      style: style === "none" ? "" : style,
      lengthPref: lengthPref === "none" ? "" : lengthPref,
    });
  };

  // 最近搜索：本地保存，点击回填描述/TLD/风格/长度，不自动运行
  const [recent, setRecent] = useState<RecentSearch[]>(() => loadRecentSearches());
  const applyRecent = (r: RecentSearch) => {
    setDescription(r.description);
    if (r.tlds.length > 0) setTlds(r.tlds);
    setStyle(r.style || "none");
    setLengthPref(r.lengthPref || "none");
  };

  return (
    <main className="relative min-w-0 flex-1">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px]" style={{ background: "var(--glow)" }} />
      <div className="relative mx-auto max-w-3xl px-4 pb-16 pt-16 md:pt-24">
        {onBackToResults && (
          <div className="mb-4 flex justify-center">
            <button
              onClick={onBackToResults}
              className="inline-flex h-11 items-center gap-1 rounded-full border border-line px-3 text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand sm:h-8"
            >
              {t("home.backToResults")}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
        <div className="mb-5 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-line bg-brand-dim px-3 py-1.5 text-xs text-brand">
            <span className="dot-breathe h-1.5 w-1.5 rounded-full bg-brand" />
            {t("home.badge")}
          </span>
        </div>

        <h1 className="text-center text-4xl font-extrabold leading-[1.12] tracking-[-0.03em] md:text-[52px]" style={{ textWrap: "balance" }}>
          {t("home.title1")}<br className="md:hidden" />
          <span className={lang === "zh" ? "whitespace-nowrap" : undefined}>{t("home.title2")}</span>
          <wbr />
          <span className="whitespace-nowrap">{t("home.title2b")}</span>
        </h1>
        <p className="mt-4 text-center text-base text-txt1 md:text-lg">
          {t("home.subtitle")}
        </p>

        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-full border border-line bg-bg1 p-1" role="group" aria-label={t("home.mode.aria")}>
            {(
              [
                { key: "ai" as const, label: "home.mode.ai" as I18nKey },
                { key: "exact" as const, label: "home.mode.exact" as I18nKey },
              ]
            ).map((m) => (
              <button
                key={m.key}
                aria-pressed={searchMode === m.key}
                onClick={() => setSearchMode(m.key)}
                className={cn(
                  "h-11 rounded-full px-3.5 text-xs transition-colors sm:h-7",
                  searchMode === m.key ? "bg-brand-dim font-semibold text-brand" : "text-txt1 hover:text-txt0",
                )}
              >
                {t(m.label)}
              </button>
            ))}
            <button
              onClick={onOpenAdvanced}
              className="h-11 rounded-full px-3.5 text-xs text-txt1 transition-colors hover:text-txt0 sm:h-7"
            >
              {t("home.mode.bulk")}
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-line-strong bg-bg2 shadow-[0_24px_48px_-24px_rgba(0,0,0,.5)] focus-within:border-brand-line">
          <textarea
            rows={3}
            className="w-full resize-none bg-transparent px-5 pb-2 pt-4 text-[15px] leading-relaxed outline-none"
            placeholder={t(searchMode === "exact" ? "home.placeholderExact" : "home.placeholder")}
            value={description}
            maxLength={MAX_LEN}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (searchMode === "exact" || e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                if (searchMode === "exact") void runQuickCheck();
                else submit();
              }
            }}
          />
          <div className="flex flex-wrap items-center gap-2 px-3 pb-3">
            <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-lg border border-line bg-bg1 p-1 no-scrollbar">
              {[...PRESET_TLDS, ...customTlds].map((t) => {
                const active = tlds.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleTld(t)}
                    aria-pressed={active}
                    className={cn(
                      "flex min-h-[44px] shrink-0 items-center rounded-md px-2.5 font-mono text-xs sm:min-h-0 sm:px-2 sm:py-1",
                      active ? "bg-brand-dim font-semibold text-brand" : "text-txt1 hover:text-txt0",
                    )}
                  >
                    .{t}
                  </button>
                );
              })}
              {showCustom ? (
                <input
                  autoFocus
                  className="w-16 shrink-0 rounded-md bg-transparent px-1.5 py-1 font-mono text-xs outline-none"
                  placeholder="net"
                  value={customTld}
                  onChange={(e) => setCustomTld(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustomTld()}
                  onBlur={addCustomTld}
                />
              ) : (
                <button onClick={() => setShowCustom(true)} title={t("home.customTld")} className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-md text-xs text-txt2 hover:text-txt0 sm:min-h-0 sm:min-w-0 sm:px-1.5 sm:py-1">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            {searchMode === "ai" && (
              <>
                <MiniSelect icon={Wand2} value={style} options={STYLE_OPTIONS} onChange={setStyle} />
                <MiniSelect icon={Ruler} value={lengthPref} options={LENGTH_OPTIONS} onChange={setLengthPref} />
              </>
            )}
            <div className="flex-1" />
            <span className="tnum hidden text-[11px] text-txt2 md:inline">
              {description.length > 0 && `${description.length}/${MAX_LEN} · `}{searchMode === "exact" ? "Enter" : "⌘ Enter"}
            </span>
            {searchMode === "exact" ? (
              <button
                disabled={!quick || quick.label.length < 3 || quickRunning}
                onClick={() => void runQuickCheck()}
                className="flex h-11 items-center gap-1.5 rounded-xl bg-brand px-4 text-sm font-semibold text-brand-ink transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50 sm:h-9"
              >
                {quickRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <SearchCheck className="h-4 w-4" />}
                {t("home.exactCheck")}
              </button>
            ) : (
              <button
                disabled={!canRun}
                onClick={() => submit()}
                className="flex h-11 items-center gap-1.5 rounded-xl bg-brand px-4 text-sm font-semibold text-brand-ink transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50 sm:h-9"
              >
                <Sparkles className="h-4 w-4" />
                {t("home.start")}
              </button>
            )}
          </div>
        </div>

        {/* 最近搜索：点击回填，不自动运行 */}
        {recent.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] text-txt2">
              <History className="h-3 w-3" />
              {t("home.recent")}
            </span>
            {recent.map((r) => (
              <button
                key={r.at}
                onClick={() => applyRecent(r)}
                title={r.description}
                className="flex min-h-[44px] max-w-[240px] items-center truncate rounded-full border border-line bg-bg1 px-3 text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand sm:min-h-[32px]"
              >
                <span className="truncate">{r.description}</span>
              </button>
            ))}
            <button
              onClick={() => {
                clearRecentSearches();
                setRecent([]);
              }}
              title={t("home.recentClear")}
              className="flex h-11 w-11 items-center justify-center rounded-full text-txt2 hover:text-txt0 sm:h-6 sm:w-6"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* 输入像现成名字/域名：提供免 AI 额度的直接核验 */}
        {quick && (
          <div className="mt-3 rounded-xl border border-line bg-bg1 px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-txt1">{t("home.quickCheckHint")}</span>
              <button
                onClick={() => void runQuickCheck()}
                disabled={quickRunning}
                className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-brand-line bg-brand-dim px-3 text-xs font-semibold text-brand transition-opacity hover:opacity-90 disabled:opacity-50 sm:h-8"
              >
                {quickRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <SearchCheck className="h-3.5 w-3.5" />}
                {t("home.quickCheckBtn", { label: quick.label })}
              </button>
            </div>
            {/* 读屏状态播报：仅在整批核验结束后播报一次汇总，避免逐行流式轰炸 */}
            {!quickRunning && quickRows.length > 0 && (
              <p role="status" className="sr-only">
                {t("home.quickDoneStatus", { available: quickRows.filter((r) => r.status === "available").length, total: quickRows.length })}
              </p>
            )}
            {/* 图例过滤：chips 多时按状态筛选（可注册/已注册/未知） */}
            {quickRows.length >= 6 && !quickRunning && (
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                {(
                  [
                    { key: "all", dot: "bg-txt2", n: quickRows.length },
                    { key: "available", dot: "bg-brand", n: quickRows.filter((r) => r.status === "available").length },
                    { key: "taken", dot: "bg-taken", n: quickRows.filter((r) => r.status === "taken").length },
                    { key: "unknown", dot: "bg-txt2/50", n: quickRows.filter((r) => r.status === "unknown").length },
                  ] as { key: typeof quickFilter; dot: string; n: number }[]
                )
                  .filter((f) => f.key === "all" || f.n > 0)
                  .map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setQuickFilter(f.key)}
                      aria-pressed={quickFilter === f.key}
                      className={cn(
                        "tnum inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-2.5 text-[11px] sm:min-h-[32px]",
                        quickFilter === f.key ? "border-brand-line bg-brand-dim font-semibold text-brand" : "border-line text-txt1 hover:text-txt0",
                      )}
                    >
                      <span className={cn("h-2 w-2 rounded-sm", f.dot)} />
                      {t(`home.quickLegend.${f.key}` as I18nKey, { n: f.n })}
                    </button>
                  ))}
              </div>
            )}
            {quickRows.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-2">
                {quickRows.filter((row) => quickFilter === "all" || row.status === quickFilter).map((row) =>
                  row.status === "available" ? (
                    <span key={row.domain} className="inline-flex max-w-full items-stretch overflow-hidden rounded-lg border border-brand-line bg-brand-dim font-mono text-xs text-brand">
                      <a
                        href={REGISTRARS[0].url(row.domain)}
                        target="_blank"
                        rel="noreferrer"
                        title={t("home.quickRegister", { domain: row.domain })}
                        className="inline-flex min-h-[44px] min-w-0 items-center gap-1.5 px-2.5 py-1.5 transition-opacity hover:opacity-85 sm:min-h-0"
                      >
                        <span className="min-w-0 truncate">{row.domain}</span>
                        <i className="not-italic font-sans text-[10px]">{t("status.available")}</i>
                        <ChipPrice domain={row.domain} />
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <button
                        onClick={() => shortlist.toggle(domainToRow(row.domain))}
                        title={shortlist.has(row.domain) ? t("results.favRemove") : t("results.favAdd")}
                        aria-pressed={shortlist.has(row.domain)}
                        className="border-l border-brand-line/50 px-3 transition-opacity hover:opacity-85 sm:px-2"
                      >
                        <Star className={cn("h-3.5 w-3.5", shortlist.has(row.domain) && "fill-current")} />
                      </button>
                    </span>
                  ) : row.status === "taken" ? (
                    <span key={row.domain} className="inline-flex max-w-full items-stretch overflow-hidden rounded-lg border border-line font-mono text-xs text-txt2">
                      <span className="inline-flex min-h-[44px] min-w-0 items-center gap-1.5 px-2.5 py-1.5 sm:min-h-0">
                        <span title={row.domain} className="min-w-0 truncate line-through">{row.domain}</span>
                        <i className="not-italic font-sans text-[10px] text-taken">{t("status.taken")}</i>
                        {row.expiresAt && <ExpiryNote iso={row.expiresAt} className="font-sans" />}
                      </span>
                      <button
                        onClick={() => shortlist.toggle(domainToRow(row.domain, "taken", row.expiresAt))}
                        title={shortlist.has(row.domain) ? t("results.favRemove") : t("results.favAdd")}
                        aria-label={shortlist.has(row.domain) ? t("results.favRemove") : t("results.favAdd")}
                        aria-pressed={shortlist.has(row.domain)}
                        className={cn("border-l border-line/70 px-3 transition-colors hover:text-txt0 sm:px-2", shortlist.has(row.domain) && "text-taken")}
                      >
                        <Star className={cn("h-3.5 w-3.5", shortlist.has(row.domain) && "fill-current")} />
                      </button>
                      {row.expiresAt && (
                        <WatchCta
                          domain={row.domain}
                          expiresAt={row.expiresAt}
                          variant="chip"
                          onAddShortlist={() => {
                            if (!shortlist.has(row.domain)) shortlist.toggle(domainToRow(row.domain, "taken", row.expiresAt));
                          }}
                        />
                      )}
                    </span>
                  ) : (
                    <span
                      key={row.domain}
                      className={cn(
                        "inline-flex max-w-full items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-mono text-xs",
                        row.status === "unknown" && "border-line text-txt1",
                        row.status === "checking" && "border-line text-txt2",
                      )}
                    >
                      <span title={row.domain} className="min-w-0 truncate">{row.domain}</span>
                      <i className="not-italic font-sans text-[10px]">{t(`status.${row.status}` as I18nKey)}</i>
                    </span>
                  ),
                )}
                {!quickRunning && !quickMoreDone && (
                  <button
                    onClick={() => void runQuickCheck(true)}
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-dashed border-line px-2.5 py-1.5 font-mono text-xs text-txt2 transition-colors hover:border-brand-line hover:text-brand sm:min-h-0"
                  >
                    <Plus className="h-3 w-3" />
                    {t("home.quickMoreBtn", { n: QUICK_MORE_TLDS.filter((x) => !quickRows.some((r) => r.domain === `${quick.label}.${x}`)).length })}
                  </button>
                )}
                {!quickRunning && quickRows.filter((r) => r.status === "available").length >= 2 && (
                  <button
                    onClick={() => {
                      void navigator.clipboard.writeText(
                        quickRows.filter((r) => r.status === "available").map((r) => r.domain).join("\n"),
                      );
                      setQuickCopied(true);
                      setTimeout(() => setQuickCopied(false), 1500);
                    }}
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 font-mono text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand sm:min-h-0"
                  >
                    {quickCopied ? <Check className="h-3 w-3 text-brand" /> : <Copy className="h-3 w-3" />}
                    {quickCopied
                      ? t("home.quickCopied")
                      : t("home.quickCopyBtn", { n: quickRows.filter((r) => r.status === "available").length })}
                  </button>
                )}
                {/* 心仪名字被注册：免费变体核验 + 一键转 AI 搜相似寓意的可注册名字（与 chips 同行，展开更多后缀后也可见） */}
                {!quickRunning && quickRows.some((r) => r.status === "taken") && variantTotal === 0 && (
                  <button
                    onClick={() => void runVariantCheck()}
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-brand-line/60 bg-brand-dim/30 px-2.5 py-1.5 font-mono text-xs font-semibold text-brand transition-colors hover:border-brand-line hover:bg-brand-dim sm:min-h-0"
                  >
                    <SearchCheck className="h-3 w-3" />
                    {t("home.quickVariantsBtn", { n: (VARIANT_PREFIXES.length + 1) * (VARIANT_SUFFIXES.length + 1) - 1 })}
                  </button>
                )}
                {!quickRunning && quickRows.some((r) => r.status === "taken") && (
                  <button
                    onClick={() => submit(t("home.quickAiDesc", { label: quick.label }))}
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 font-mono text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand sm:min-h-0"
                  >
                    <Sparkles className="h-3 w-3" />
                    {t("home.quickAiCta")}
                  </button>
                )}
              </div>
            )}
            {/* 变体核验进度与可注册变体 chips */}
            {variantTotal > 0 && (
              <div className="mt-2.5">
                <p className="flex items-center gap-1.5 text-[11px] text-txt2">
                  {variantRunning && <Loader2 className="h-3 w-3 animate-spin" />}
                  {t("home.quickVariantsProgress", { checked: variantChecked, total: variantTotal, n: variantRows.filter((r) => r.status === "available").length })}
                </p>
                {variantRows.some((r) => r.status === "available") && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {variantRows
                      .filter((r) => r.status === "available")
                      .map((row) => (
                        <span key={row.domain} className="inline-flex max-w-full items-stretch overflow-hidden rounded-lg border border-brand-line bg-brand-dim font-mono text-xs text-brand">
                          <a
                            href={REGISTRARS[0].url(row.domain)}
                            target="_blank"
                            rel="noreferrer"
                            title={t("home.quickRegister", { domain: row.domain })}
                            className="inline-flex min-h-[44px] min-w-0 items-center gap-1.5 px-2.5 py-1.5 transition-opacity hover:opacity-85 sm:min-h-0"
                          >
                            <span className="min-w-0 truncate">{row.domain}</span>
                            <i className="not-italic font-sans text-[10px]">{t("status.available")}</i>
                            <ChipPrice domain={row.domain} />
                            <ExternalLink className="h-3 w-3" />
                          </a>
                          <button
                            onClick={() => shortlist.toggle(domainToRow(row.domain))}
                            title={shortlist.has(row.domain) ? t("results.favRemove") : t("results.favAdd")}
                            aria-pressed={shortlist.has(row.domain)}
                            className="border-l border-brand-line/50 px-3 transition-opacity hover:opacity-85 sm:px-2"
                          >
                            <Star className={cn("h-3.5 w-3.5", shortlist.has(row.domain) && "fill-current")} />
                          </button>
                        </span>
                      ))}
                    {!variantRunning && variantRows.filter((r) => r.status === "available").length >= 2 && (
                      <button
                        onClick={() => {
                          void navigator.clipboard.writeText(
                            variantRows.filter((r) => r.status === "available").map((r) => r.domain).join("\n"),
                          );
                          setVariantCopied(true);
                          setTimeout(() => setVariantCopied(false), 1500);
                        }}
                        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 font-mono text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand sm:min-h-0"
                      >
                        {variantCopied ? <Check className="h-3 w-3 text-brand" /> : <Copy className="h-3 w-3" />}
                        {variantCopied
                          ? t("home.quickCopied")
                          : t("home.quickCopyBtn", { n: variantRows.filter((r) => r.status === "available").length })}
                      </button>
                    )}
                  </div>
                )}
                {/* 已注册变体也可收藏（进候选清单后可开监控） */}
                {variantRows.some((r) => r.status === "taken") && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {variantRows
                      .filter((r) => r.status === "taken")
                      .map((row) => (
                        <span key={row.domain} className="inline-flex max-w-full items-stretch overflow-hidden rounded-lg border border-line font-mono text-xs text-txt2">
                          <span className="inline-flex min-h-[44px] min-w-0 items-center gap-1.5 px-2.5 py-1.5 sm:min-h-0">
                            <span title={row.domain} className="min-w-0 truncate line-through">{row.domain}</span>
                            <i className="not-italic font-sans text-[10px] text-taken">{t("status.taken")}</i>
                          </span>
                          <button
                            onClick={() => shortlist.toggle(domainToRow(row.domain, "taken", row.expiresAt))}
                            title={shortlist.has(row.domain) ? t("results.favRemove") : t("results.favAdd")}
                            aria-label={shortlist.has(row.domain) ? t("results.favRemove") : t("results.favAdd")}
                            aria-pressed={shortlist.has(row.domain)}
                            className={cn("border-l border-line/70 px-3 transition-colors hover:text-txt0 sm:px-2", shortlist.has(row.domain) && "text-taken")}
                          >
                            <Star className={cn("h-3.5 w-3.5", shortlist.has(row.domain) && "fill-current")} />
                          </button>
                        </span>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 行业模板 chips：点击填入描述模板，用户可再编辑后搜索；默认收起只显示前 10 个 */}
        <div className="mt-4">
          <p className="text-center text-[11px] text-txt2">{t("home.templates")}</p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {(showAllTemplates ? TEMPLATES : TEMPLATES.slice(0, 10)).map((tpl) => (
              <button
                key={tpl.labelZh}
                onClick={() => setDescription(lang === "zh" ? tpl.zh : tpl.en)}
                className="h-11 rounded-full border border-brand-line/60 bg-brand-dim/30 px-3 text-xs text-brand transition-colors hover:border-brand-line hover:bg-brand-dim sm:h-8"
              >
                {lang === "zh" ? tpl.labelZh : tpl.labelEn}
              </button>
            ))}
            {!showAllTemplates && (
              <button
                onClick={() => setShowAllTemplates(true)}
                className="h-11 rounded-full border border-dashed border-brand-line/60 px-3 text-xs text-txt2 transition-colors hover:border-brand-line hover:text-brand sm:h-8"
              >
                +{TEMPLATES.length - 10}
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {(lang === "zh" ? EXAMPLES : EXAMPLES_EN).map((ex) => (
            <button
              key={ex}
              onClick={() => {
                setDescription(ex);
                submit(ex);
              }}
              className="h-11 rounded-full border border-line px-3 text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand sm:h-9"
            >
              {ex}
            </button>
          ))}
        </div>

        <p className="mt-10 flex flex-wrap items-center justify-center gap-4 text-center text-xs text-txt2">
          {totalChecked !== null && (
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-brand" />
              {t("home.trustChecked")} <b className="tnum font-mono text-txt1">{totalChecked.toLocaleString()}</b> {t("home.trustCheckedUnit")}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Zap className="h-3.5 w-3.5 text-brand" />
            {t("home.trustStream")}
          </span>
          <span className="flex items-center gap-1">{t("home.trustOss")}</span>
        </p>

        {/* 怎么用 / 为什么好用：三步说明 */}
        <div className="mt-16">
          <h2 className="text-center text-sm font-semibold text-txt1">{t("home.how.title")}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {(
              [
                { icon: Brain, title: "home.how.step1.title", desc: "home.how.step1.desc" },
                { icon: ShieldCheck, title: "home.how.step2.title", desc: "home.how.step2.desc" },
                { icon: Sparkles, title: "home.how.step3.title", desc: "home.how.step3.desc" },
              ] as { icon: typeof Brain; title: I18nKey; desc: I18nKey }[]
            ).map((s, i) => (
              <div key={s.title} className="rounded-xl border border-line bg-bg1 p-5">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-lg border border-brand-line bg-brand-dim">
                    <s.icon className="h-3.5 w-3.5 text-brand" />
                  </span>
                  <span className="tnum font-mono text-[11px] text-txt2">0{i + 1}</span>
                </div>
                <h3 className="mt-3 text-sm font-semibold">{t(s.title)}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-txt1">{t(s.desc)}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center">
            <a href={`/why?lang=${lang}`} className="inline-flex min-h-[44px] items-center px-2 text-xs text-txt2 hover:text-brand hover:underline">
              {t("home.whyLink")}
            </a>
          </p>
        </div>

        {/* 常见问题（与 SSR 注入的 FAQPage JSON-LD 内容一致） */}
        <div className="mt-16">
          <h2 className="text-center text-sm font-semibold text-txt1">{t("home.faq.title")}</h2>
          <div className="mt-5 space-y-2">
            {([1, 2, 3, 4, 5, 6] as const).map((i) => (
              <details key={i} className="group rounded-xl border border-line bg-bg1 px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-txt1 [&::-webkit-details-marker]:hidden">
                  {t(`home.faq.q${i}` as I18nKey)}
                  <ChevronDown className="h-4 w-4 shrink-0 text-txt2 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-2.5 text-xs leading-relaxed text-txt1 [overflow-wrap:anywhere]">{t(`home.faq.a${i}` as I18nKey)}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
