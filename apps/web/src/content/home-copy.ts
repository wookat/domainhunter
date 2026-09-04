/**
 * 首页定位文案的唯一来源（纯 TS，客户端与 worker 共用）：
 * - hero（badge / h1 / 副标题）：lib/i18n.tsx 词典引用 + worker 首屏 SSR 骨架
 * - FAQ：首页 FAQ 区块 + worker FAQPage JSON-LD
 * - meta：index.html 静态兜底 + worker 按语言替换 title/description/og
 * 同源保证 SSR HTML 与水合后文案逐字一致。
 */
export type HomeLang = "zh" | "en";

export interface HomeHero {
  badge: string;
  title1: string;
  title2: string;
  title2b: string;
  subtitle: string;
}

export const HOME_HERO: Record<HomeLang, HomeHero> = {
  zh: {
    badge: "中文创业者的域名猎手 · RDAP + WHOIS 实时核验",
    title1: "用中文说出寓意，",
    title2: "猎到真正可注册的",
    title2b: ".cn / .com 好域名",
    subtitle: "一句中文说寓意，AI 沿拼音、英文、拼音英文混搭多路构思，逐个实时核验 .cn / .com.cn / .com 的注册状态——只给你能立刻注册的，附到期日与人民币参考价。",
  },
  en: {
    badge: "For Chinese founders · Live RDAP + WHOIS checks",
    title1: "Name it in Chinese or English, ",
    title2: "hunt .cn / .com domains you can ",
    title2b: "actually register",
    subtitle:
      "For Chinese founders and teams going global: describe the meaning in Chinese or English, get pinyin, English and blended names, each verified live for .cn / .com.cn / .com — only registrable ones, with expiry dates and prices.",
  },
};

export interface HomeMeta {
  title: string;
  desc: string;
  ogTitle: string;
  ogDesc: string;
}

export const HOME_META: Record<HomeLang, HomeMeta> = {
  zh: {
    title: "DomainHunter — 中文创业者的域名猎手 | 用中文说寓意，猎到真正可注册的 .cn / .com 好域名",
    desc: "面向中文创业者、独立开发者与出海团队：用中文描述寓意，AI 沿拼音/英文/混搭多路构思，RDAP + WHOIS 实时核验 .cn / .com.cn / .com 注册状态，附到期日与价格，支持批量核验、CSV 导出与到期监控。免费、开源、无需登录。",
    ogTitle: "DomainHunter — 中文创业者的域名猎手",
    ogDesc: "用中文说寓意，拼音/英文/混搭多路构思，RDAP + WHOIS 实时核验——只给你真正可注册的 .cn / .com 好域名。",
  },
  en: {
    title: "DomainHunter — Domain hunter for Chinese founders | Bilingual naming, verified .cn / .com availability",
    desc: "Built for Chinese founders, indie developers and teams going global: describe the meaning in Chinese or English, AI brainstorms pinyin, English and pinyin-English blends, and every name is verified live via RDAP + WHOIS across .cn / .com.cn / .com — with expiry dates, prices, bulk checks, CSV export and drop monitoring. Free, open source, no login.",
    ogTitle: "DomainHunter — Domain hunter for Chinese founders",
    ogDesc: "Bilingual naming — pinyin, English and blends — verified live via RDAP + WHOIS. Only registrable .cn / .com domains.",
  },
};

const TLD_MORE =
  "org/xyz/info/cc/tv/tech/online/store/site/top/shop/cloud/pro/vip/club/link/live/space/fun/art/design/studio/sh/gg/so/us/in/world/life/agency/games/email/network/digital/media/group/center/works/zone/news/tools/run/codes/company/wiki/blog/team/chat/finance/global/host/social/video/fund/land/click/icu/page/bio/ink/moe/lol/uk/fm/one/cool/red/today/best/wtf/pizza/bar/cafe/money/gold/band/cash/city/estate/expert/farm/blue/pink/black/ninja/rocks/pet/academy/school/coach/care/doctor/restaurant/boutique/clinic/dental/fitness/photos/gallery/salon/yoga/coffee/wine/kitchen/garden/photography/events/solutions/services/consulting/software/marketing/systems/ventures/capital/guru/tips/directory/exchange/institute/international/partners/support/plus/house/market/watch/style/show/website/technology/community/education/training/love/beauty/fashion/work/sale/help/wedding/law/tax/menu/bike/toys/shoes/travel/tours/vacations/holiday/flights/taxi/properties/rentals/apartments/builders/construction/repair/energy/solar/green/eco/earth/engineering/family/baby/mom/dad/dog/gifts/photo/health/fit/dance/guide/reviews/golf/tennis/soccer/football/hockey/surf/ltd/biz/llc/fyi/promo/express/press/stream/movie/pictures/productions/audio/credit/loans/investments/holdings/mortgage/computer/vet/lawyer/legal/delivery/recipes/rent/church/jewelry/cleaning/plumbing/catering/florist";

export interface HomeFaqItem {
  q: string;
  a: string;
}

/** 首页 FAQ（6 条，顺序即页面顺序；home-page.tsx 按 1..6 索引取 i18n 键） */
export const HOME_FAQ: Record<HomeLang, readonly [HomeFaqItem, HomeFaqItem, HomeFaqItem, HomeFaqItem, HomeFaqItem, HomeFaqItem]> = {
  zh: [
    {
      q: "DomainHunter 是什么？",
      a: "面向中文创业者、独立开发者与出海团队的域名猎手：用一句中文描述寓意，AI 沿拼音、英文、拼音英文混搭多路构思候选并实时核验，直接给出一批真正可注册的 .cn / .com 等好域名。",
    },
    {
      q: "核验结果准确吗？",
      a: "每个域名经 DNS + RDAP + WHOIS 三级核验：.cn / .com.cn 直查 CNNIC WHOIS，.com 等直查注册局 RDAP，可注册状态来自注册局权威数据；注册前建议在注册商页面再确认一次。",
    },
    { q: "使用收费吗？", a: "完全免费。AI 搜索有每小时次数限制；即输即查、更多后缀与前后缀变体核验不限量、不消耗 AI 次数。" },
    { q: "会自动帮我注册域名吗？", a: "不会。我们只提供核验结果与注册商跳转链接（如 Porkbun），注册和付费在注册商完成。" },
    { q: "支持哪些后缀？", a: `AI 搜索支持任意 TLD；即输即查默认覆盖 com/cn/io/ai/app/dev/co/net/me，点「查更多后缀」再覆盖 ${TLD_MORE}。` },
    { q: "我的搜索会被保存吗？", a: "不保存输入内容和 IP，只记录匿名的聚合次数统计；收藏清单保存在你自己的浏览器本地。" },
  ],
  en: [
    {
      q: "What is DomainHunter?",
      a: "A domain hunter built for Chinese founders, indie developers and teams going global: describe the meaning in Chinese or English, AI brainstorms pinyin, English and pinyin-English blend candidates and verifies each one live, and you get a batch of genuinely registrable .cn / .com names.",
    },
    {
      q: "How accurate are the availability checks?",
      a: "Every domain goes through DNS + RDAP + WHOIS checks: .cn / .com.cn against CNNIC WHOIS, .com and others against registry RDAP, so availability comes from authoritative registry data. We still recommend a final confirmation on the registrar's page before buying.",
    },
    { q: "Is it free?", a: "Completely free. AI search has an hourly rate limit; instant checks, extra-TLD checks, and prefix/suffix variants are unlimited and never use AI quota." },
    { q: "Will it register domains for me automatically?", a: "No. We only provide verification results and registrar links (e.g. Porkbun) — registration and payment happen at the registrar." },
    { q: "Which TLDs are supported?", a: `AI search supports any TLD. Instant check covers com/cn/io/ai/app/dev/co/net/me by default, plus ${TLD_MORE} via the “more TLDs” button.` },
    { q: "Do you store my searches?", a: "We never store your input or IP — only anonymous aggregate counters. Your shortlist lives in your own browser's local storage." },
  ],
};
