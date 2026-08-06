/**
 * TLD 对比页内容（/vs/:slug）。纯数据常量：前端页面与 worker（SSR meta / sitemap / OG）共用。
 * 两列基础信息（intro/bestFor/价格）复用 TLD_GUIDES，本文件只维护对比结论。
 */

export interface TldCompareLocale {
  /** 页面标题（不含站点名） */
  title: string;
  /** SEO meta description */
  metaDescription: string;
  /** 对比结论段落 */
  verdict: string;
  /** 选 A 的场景 */
  pickA: string[];
  /** 选 B 的场景 */
  pickB: string[];
}

export interface TldCompare {
  slug: string;
  a: string;
  b: string;
  zh: TldCompareLocale;
  en: TldCompareLocale;
}

export const TLD_COMPARES: Record<string, TldCompare> = {
  "com-vs-cn": {
    slug: "com-vs-cn",
    a: "com",
    b: "cn",
    zh: {
      title: ".com 和 .cn 怎么选：面向人群、备案与品牌保护对比",
      metaDescription: ".com 国际通用、.cn 面向国内市场且需实名。对比两者的适用人群、注册价格、备案要求与品牌保护策略，并用 AI 直接猎取两个后缀下都可注册的名字。",
      verdict:
        "看用户在哪里：主要做国内市场、需要 ICP 备案接入国内主机，.cn 是标配且价格便宜得多；面向国际用户或计划出海，.com 的认知度无可替代。预算允许时，成熟品牌通常两个都注册——.com 做主站，.cn 防抢注并 301 跳转。注意 .cn 注册需实名认证，个人与企业均可注册但流程比 .com 多一步。",
      pickA: ["面向国际用户或计划出海", "品牌主站与长期资产", "不想处理实名/备案流程", "希望转售流动性最好"],
      pickB: ["主要做国内市场", "需要 ICP 备案接入国内服务器", "预算敏感（首年与续费都便宜）", "拼音品牌词在 .com 已被注册"],
    },
    en: {
      title: ".com vs .cn: Audience, Compliance & Brand Protection Compared",
      metaDescription:
        ".com is the global default; .cn targets the Chinese market and requires real-name verification. Compare audiences, pricing and brand strategy, then hunt names available on both.",
      verdict:
        "It comes down to where your users are. For a China-focused product that needs ICP filing and domestic hosting, .cn is standard and far cheaper. For international audiences, .com's recognition is irreplaceable. Established brands usually register both — .com as the primary site, .cn defensively with a 301. Note .cn requires real-name verification for registration, one extra step compared to .com.",
      pickA: ["International or global audience", "Primary brand site and long-term asset", "No real-name/ICP paperwork", "Best resale liquidity"],
      pickB: ["China-focused market", "Need ICP filing with domestic hosting", "Budget-sensitive (cheap first year and renewal)", "Your pinyin brand word is taken on .com"],
    },
  },
  "com-vs-io": {
    slug: "com-vs-io",
    a: "com",
    b: "io",
    zh: {
      title: ".com 和 .io 怎么选：信任感与极客感的取舍",
      metaDescription: ".com 认知度最高，.io 是开发者圈的身份标识但续费更贵。对比两者的气质、价格与库存差异，并用 AI 猎取两个后缀下都可注册的好名字。",
      verdict:
        "面向大众就选 .com，面向开发者/技术圈 .io 完全站得住——GitHub 生态里 .io 甚至比 .com 更「圈内」。关键差异在价格与库存：.io 注册和续费都明显更贵，但同样的短词库存好得多；.com 便宜但好名字几乎绝迹。务实策略：先在 .io 上拿到心仪的短名字上线，品牌起量后再收购对应 .com。",
      pickA: ["面向大众消费者的产品", "预算敏感、在意续费成本", "品牌计划长期持有转售", "非技术行业（电商、线下、内容）"],
      pickB: ["开发者工具、API、开源项目", "技术圈品牌（.io 自带极客身份）", "心仪短名字 .com 已被注册", "先上线后收购 .com 的策略"],
    },
    en: {
      title: ".com vs .io: Trust vs Hacker Credibility",
      metaDescription:
        ".com has universal recognition; .io is the developer world's badge but costs more to renew. Compare vibe, pricing and inventory, then hunt names available on both.",
      verdict:
        "For a mainstream audience pick .com; for developer-facing products .io holds its own — in the GitHub ecosystem it can read even more native than .com. The real trade-off is price versus inventory: .io registration and renewal cost noticeably more, but short-name availability is far better; .com is cheap but good names are gone. A pragmatic play: launch on the .io you love, then acquire the matching .com once the brand has traction.",
      pickA: ["Consumer-facing mainstream products", "Renewal-cost sensitive", "Long-term hold and resale value", "Non-technical industries (commerce, offline, content)"],
      pickB: ["Developer tools, APIs, open source", "Tech-circle branding (.io is the badge)", "Your short name is taken on .com", "Launch-now-acquire-.com-later strategy"],
    },
  },
  "com-vs-net": {
    slug: "com-vs-net",
    a: "com",
    b: "net",
    zh: {
      title: ".com 和 .net 怎么选：主选与备选的正确用法",
      metaDescription: ".net 常被当作 .com 的第一备选，但并不总是安全。对比两者的信任度、分流风险与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两者价格接近，差别在认知：用户默认补全的是 .com，.net 的技术/基础设施气质更重。把 .net 当备选只有在品牌词足够独特时才安全——如果是常见词而 .com 在别人手里，会持续分流并造成品牌混淆。反过来，网络工具、云服务、API 平台这类产品用 .net 名正言顺，且同样的名单在 .net 下命中率高得多。",
      pickA: ["几乎所有面向大众的正式品牌", "品牌词常见、怕分流混淆", "长期品牌资产与转售", "口头传播场景多（广告、播客）"],
      pickB: ["网络服务、云、API、基础设施产品", "品牌词非常独特、.com 已被注册", "功能词入名的务实技术产品", "想要更高的可注册命中率"],
    },
    en: {
      title: ".com vs .net: Using the Fallback Right",
      metaDescription:
        ".net is the classic fallback when .com is taken — but it isn't always safe. Compare trust, traffic-leak risk and fit, then hunt names available on both.",
      verdict:
        "Pricing is similar; the difference is perception. Users autocomplete .com by reflex, while .net reads technical and infrastructural. Using .net as a fallback is only safe when your brand word is distinctive — with a common word whose .com someone else operates, you'll leak traffic and invite confusion indefinitely. Conversely, network services, cloud products and API platforms wear .net naturally, and the same shortlist scores far more available hits on .net.",
      pickA: ["Almost any mainstream consumer brand", "Common brand words at risk of confusion", "Long-term brand asset and resale", "Heavy word-of-mouth channels (ads, podcasts)"],
      pickB: ["Network, cloud, API and infrastructure products", "Distinctive brand word whose .com is taken", "Pragmatic technical products with functional names", "Better availability odds for the same list"],
    },
  },
  "io-vs-ai": {
    slug: "io-vs-ai",
    a: "io",
    b: "ai",
    zh: {
      title: ".io 和 .ai 怎么选：开发者身份与 AI 叙事的对比",
      metaDescription: ".io 是开发者工具的经典后缀，.ai 是 AI 产品的品类信号但价格更高。对比两者的气质、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "产品核心是 AI 能力就选 .ai——后缀本身就是品类信号，投资人与用户一眼读懂；通用开发者工具、API、开源项目则 .io 更稳，不会把品牌绑死在单一叙事上。价格上 .ai 注册与续费都显著更贵（两年起注），预算敏感要算清楚。注意别为了蹭热点硬用 .ai：产品与 AI 无关时反而显得投机，热潮退去后改名成本更高。",
      pickA: ["通用开发者工具与 API", "开源项目与技术社区", "不想绑死 AI 叙事的技术品牌", "续费预算敏感"],
      pickB: ["核心卖点是 AI 的产品", "希望后缀直接传达品类", "融资叙事需要（AI 赛道信号）", "短品牌词在 .io/.com 均已被注册"],
    },
    en: {
      title: ".io vs .ai: Developer Badge vs AI Narrative",
      metaDescription:
        ".io is the classic developer-tool suffix; .ai signals the AI category at a premium price. Compare vibe, pricing and fit, then hunt names available on both.",
      verdict:
        "If AI is the product's core, pick .ai — the suffix itself signals the category to users and investors at a glance. For general developer tools, APIs and open source, .io is the safer badge and doesn't chain your brand to one narrative. On price, .ai costs significantly more to register and renew (two-year minimum), so budget accordingly. And don't force .ai onto a non-AI product — it reads opportunistic now and expensive to rename later.",
      pickA: ["General developer tools and APIs", "Open source and technical communities", "Tech brands avoiding AI lock-in", "Renewal-budget sensitive"],
      pickB: ["Products whose core value is AI", "Category signal right in the suffix", "Fundraising narrative in the AI space", "Short brand word taken on .io/.com"],
    },
  },
  "app-vs-dev": {
    slug: "app-vs-dev",
    a: "app",
    b: "dev",
    zh: {
      title: ".app 和 .dev 怎么选：面向用户还是面向开发者",
      metaDescription: ".app 适合面向最终用户的应用，.dev 适合开发者工具与技术内容，两者都强制 HTTPS。对比适用场景与命名策略，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "同属 Google 注册局、都强制 HTTPS、价格相近，选择只看受众：产品交付物是给最终用户的应用（移动/桌面/Web App）就用 .app，域名即品类；受众是开发者——工具链、SDK、技术博客、文档站——.dev 的圈内感更强。两者库存都远好于 .com，短而准的好名字仍能注册到，是新产品起步性价比很高的选择。",
      pickA: ["移动/桌面/Web 应用主站", "面向最终用户的 SaaS 产品", "下载/安装转化场景（域名即品类）", "消费级品牌但 .com 无货"],
      pickB: ["开发者工具与 CLI/SDK", "技术博客、文档与开源主页", "开发者社区与技术品牌", "个人开发者作品集"],
    },
    en: {
      title: ".app vs .dev: End Users or Developers",
      metaDescription:
        ".app suits end-user applications; .dev suits developer tools and technical content — both enforce HTTPS. Compare fit and naming strategy, then hunt names available on both.",
      verdict:
        "Same Google registry, both HTTPS-enforced, similar pricing — the choice is purely about audience. If you ship an application to end users (mobile, desktop, web), .app makes the category part of the domain. If your audience is developers — toolchains, SDKs, docs, technical blogs — .dev carries stronger insider credibility. Both have far better inventory than .com, so short precise names are still registrable: excellent value for a new product.",
      pickA: ["Mobile/desktop/web app home", "End-user-facing SaaS", "Download/install conversion flows", "Consumer brand when .com is gone"],
      pickB: ["Developer tools, CLIs and SDKs", "Docs sites, technical blogs, open source homes", "Developer communities and tech brands", "Personal developer portfolios"],
    },
  },
  "co-vs-me": {
    slug: "co-vs-me",
    a: "co",
    b: "me",
    zh: {
      title: ".co 和 .me 怎么选：品牌简写与个人品牌的对比",
      metaDescription: ".co 是创业公司爱用的 .com 替身，.me 天然适合个人品牌与作品集。对比两者的气质、误输风险与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两者都短，但气质完全不同：.co 读作 company，是创业公司与新消费品牌的 .com 替身，干脆利落；.me 读作「我」，个人站、简历、作品集、newsletter 用它自然贴切，还能玩出 hire.me、about.me 这类语义梗。用 .co 要注意误输风险——用户手滑打成 .com 的流量会流向别人，品牌词越常见风险越大；.me 则更适合个人而非公司主站。",
      pickA: ["创业公司与新消费品牌", "追求比 .com 短一个字母的利落感", "品牌词独特、误输风险可控", "国际化公司主站"],
      pickB: ["个人品牌、简历与作品集", "newsletter 与个人博客", "语义梗域名（hire.me 类）", "独立开发者的个人产品"],
    },
    en: {
      title: ".co vs .me: Startup Shorthand or Personal Brand",
      metaDescription:
        ".co is the startup world's .com stand-in; .me is built for personal brands and portfolios. Compare vibe, typo risk and fit, then hunt names available on both.",
      verdict:
        "Both are short, but the vibes differ completely. .co reads as company — the crisp .com stand-in beloved by startups and consumer brands. .me reads as, well, you — personal sites, résumés, portfolios and newsletters wear it naturally, with room for semantic plays like hire.me. With .co, watch the typo risk: users who autocomplete .com hand traffic to whoever owns it, and the more common your word, the bigger the leak. .me suits people better than company homepages.",
      pickA: ["Startups and consumer brands", "One letter crisper than .com", "Distinctive brand words with managed typo risk", "International company sites"],
      pickB: ["Personal brands, résumés, portfolios", "Newsletters and personal blogs", "Semantic-pun domains (hire.me style)", "Indie developers' personal products"],
    },
  },
};

/** 全部对比页 slug（sitemap / 互链使用） */
export const COMPARE_LIST = Object.keys(TLD_COMPARES);

/** 与某 TLD 相关的对比页 slug 列表 */
export const comparesForTld = (tld: string): string[] =>
  COMPARE_LIST.filter((slug) => TLD_COMPARES[slug].a === tld || TLD_COMPARES[slug].b === tld);
