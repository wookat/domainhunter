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
  "com-vs-ai": {
    slug: "com-vs-ai",
    a: "com",
    b: "ai",
    zh: {
      title: ".com 和 .ai 怎么选：通用信任与 AI 品类信号的取舍",
      metaDescription: ".com 认知度最高，.ai 直接传达 AI 品类但价格贵得多。对比两者的信任度、价格与命名策略，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "产品核心卖点是 AI，.ai 后缀本身就是最短的自我介绍——投资人、媒体与用户一眼归类；其余情况 .com 仍是默认答案，认知与信任无可替代。价格差距要算清：.ai 注册与续费都显著更贵且两年起注，长期持有成本是 .com 的数倍。常见组合打法：主品牌收 .com 做官网，产品线或模型入口用 .ai 分流叙事；预算有限时先拿 .ai 上线、品牌起量后回购 .com。",
      pickA: ["面向大众的主品牌官网", "长期品牌资产与转售价值", "续费预算敏感", "产品与 AI 弱相关，避免叙事绑定"],
      pickB: ["核心卖点是 AI 的产品", "融资/媒体叙事需要品类信号", "心仪短词 .com 已被注册", "作为 AI 产品线的独立入口"],
    },
    en: {
      title: ".com vs .ai: Universal Trust or AI Category Signal",
      metaDescription:
        ".com has the highest recognition; .ai signals the AI category at a much higher price. Compare trust, pricing and naming strategy, then hunt names available on both.",
      verdict:
        "If AI is the product's core value, .ai is the shortest possible pitch — investors, press and users categorize you at a glance. Otherwise .com remains the default answer with irreplaceable recognition. Do the math on price: .ai costs several times more to register and renew (two-year minimum). A common combo: secure .com for the main brand site and run the AI product line on .ai; on a tight budget, launch on .ai first and buy the .com back once the brand has traction.",
      pickA: ["Mainstream primary brand site", "Long-term brand asset and resale value", "Renewal-budget sensitive", "Products only loosely related to AI"],
      pickB: ["Products whose core value is AI", "Category signal for fundraising and press", "Short word taken on .com", "Dedicated entry for an AI product line"],
    },
  },
  "net-vs-org": {
    slug: "net-vs-org",
    a: "net",
    b: "org",
    zh: {
      title: ".net 和 .org 怎么选：技术气质与公信力的对比",
      metaDescription: ".net 偏技术与基础设施，.org 自带非营利与社区公信力。对比两者的气质、误用风险与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两者都是 1985 年的元老后缀、价格接近，但气质分工明确：.net 读作 network，网络服务、云与基础设施产品用它名正言顺；.org 读作 organization，几十年来被非营利、开源基金会与社区站点塑造成「公益与中立」的信号。商业公司硬用 .org 会有违和感甚至信任反噬；反之开源项目、行业协会、文档与社区用 .org 比 .net 更贴切。两者好名字库存都明显好于 .com。",
      pickA: ["网络服务、云与基础设施产品", "技术工具与 API 平台", "功能词入名的务实技术品牌", "商业公司的备选后缀"],
      pickB: ["开源项目与基金会", "非营利组织与公益站点", "行业协会、社区与知识库", "需要中立公信力的内容站"],
    },
    en: {
      title: ".net vs .org: Technical Vibe or Public Trust",
      metaDescription:
        ".net reads technical and infrastructural; .org carries nonprofit and community credibility. Compare vibe, misuse risk and fit, then hunt names available on both.",
      verdict:
        "Both are 1985 originals with similar pricing, but their vibes divide cleanly. .net reads as network — natural for network services, cloud and infrastructure products. .org reads as organization, shaped by decades of nonprofits, open-source foundations and community sites into a signal of neutrality and public good. A commercial company forcing .org can feel off and even backfire on trust; conversely, open-source projects, associations, docs and communities wear .org better than .net. Both have far better name inventory than .com.",
      pickA: ["Network, cloud and infrastructure products", "Technical tools and API platforms", "Pragmatic technical brands with functional names", "Commercial fallback suffix"],
      pickB: ["Open-source projects and foundations", "Nonprofits and public-good sites", "Associations, communities and knowledge bases", "Content sites needing neutral credibility"],
    },
  },
  "com-vs-xyz": {
    slug: "com-vs-xyz",
    a: "com",
    b: "xyz",
    zh: {
      title: ".com 和 .xyz 怎么选：默认信任与新锐低价的取舍",
      metaDescription: ".com 是默认信任，.xyz 便宜、库存好、在 Web3 圈有独特身份。对比两者的信任度、续费陷阱与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "谷歌母公司 Alphabet 用 abc.xyz 给了 .xyz 一张最好的名片，加上 Web3 与加密圈的偏爱，.xyz 已从「便宜后缀」长出了自己的新锐气质；库存极好，首年价格常常只要几块钱。但要注意两点：一是续费价通常远高于首年促销价，注册前先看清楚续费；二是部分邮件与安全网关对 .xyz 域名更警惕，正式商务场景可能吃亏。面向大众的正式品牌 .com 仍是稳妥答案。",
      pickA: ["面向大众的正式品牌", "邮件送达率敏感的业务", "长期品牌资产与转售", "不想解释「为什么不是 .com」"],
      pickB: ["Web3、加密与新锐科技品牌", "预算极限的试验项目与 side project", "短词/三字母组合在 .com 绝迹", "品牌本身想传达打破常规"],
    },
    en: {
      title: ".com vs .xyz: Default Trust or Edgy Bargain",
      metaDescription:
        ".com is the default trust; .xyz is cheap, well-stocked and carries Web3 credibility. Compare trust, renewal traps and fit, then hunt names available on both.",
      verdict:
        "Alphabet's abc.xyz gave .xyz the best possible business card, and the Web3/crypto world adopted it as a badge — it has outgrown 'cheap suffix' into a genuinely edgy identity, with excellent inventory and first-year prices often just a couple of dollars. Two cautions: renewal prices usually far exceed the promo price, so check before registering; and some mail and security gateways treat .xyz with more suspicion, which can hurt formal business use. For a mainstream brand, .com remains the safe answer.",
      pickA: ["Mainstream formal brands", "Email-deliverability-sensitive businesses", "Long-term brand asset and resale", "No appetite for explaining 'why not .com'"],
      pickB: ["Web3, crypto and edgy tech brands", "Ultra-low-budget experiments and side projects", "Short words/three-letter combos extinct on .com", "Brands that want to signal breaking convention"],
    },
  },
  "io-vs-co": {
    slug: "io-vs-co",
    a: "io",
    b: "co",
    zh: {
      title: ".io 和 .co 怎么选：极客身份与创业简写的对比",
      metaDescription: ".io 是开发者圈的身份标识，.co 是创业公司爱用的 .com 替身。对比两者的气质、受众与误输风险，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "受众决定选择：产品卖给开发者，.io 的圈内感无可替代——GitHub 生态里它甚至比 .com 更自然；产品面向大众消费者，.co 读作 company，比 .io 好解释得多。价格上两者都比 .com 贵，.io 通常更贵一档。.co 要评估误输风险：用户手滑补全 .com 的流量会流向别人，品牌词越常见风险越大；.io 的风险则是非技术用户可能完全不认识这个后缀。",
      pickA: ["开发者工具、API 与开源项目", "技术圈品牌与 SaaS 后台产品", "受众以工程师为主", "短词在 .com/.co 均被注册"],
      pickB: ["面向大众的创业公司与新消费品牌", "需要向非技术用户解释域名", "追求比 .com 短一个字母的利落感", "国际化公司主站"],
    },
    en: {
      title: ".io vs .co: Hacker Badge or Startup Shorthand",
      metaDescription:
        ".io is the developer world's badge; .co is the startup's .com stand-in. Compare vibe, audience and typo risk, then hunt names available on both.",
      verdict:
        "Audience decides. Selling to developers, .io's insider credibility is unmatched — in the GitHub ecosystem it reads even more native than .com. Selling to mainstream consumers, .co reads as company and needs far less explaining than .io. Both cost more than .com, with .io usually a tier higher. With .co, weigh the typo risk: users who autocomplete .com hand traffic to whoever owns it, and common words leak the most. With .io, the risk is that non-technical users may simply not recognize the suffix.",
      pickA: ["Developer tools, APIs and open source", "Tech-circle brands and backend SaaS", "Engineer-dominated audiences", "Short words taken on both .com and .co"],
      pickB: ["Consumer-facing startups and brands", "Domains you must explain to non-technical users", "One letter crisper than .com", "International company sites"],
    },
  },
  "ai-vs-dev": {
    slug: "ai-vs-dev",
    a: "ai",
    b: "dev",
    zh: {
      title: ".ai 和 .dev 怎么选：品类叙事与工程师信誉的对比",
      metaDescription: ".ai 传达 AI 品类叙事但价格高，.dev 便宜可靠且自带工程师信誉。对比两者的定位、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "同样做 AI 相关产品，两个后缀讲的是不同故事：.ai 对外——向用户、投资人与媒体宣告品类；.dev 对内——向工程师传达「这是给你们的工具」。模型产品、AI 应用、面向大众的 AI 服务选 .ai；SDK、CLI、API 文档、开发者平台选 .dev 更贴切且便宜得多（.dev 还强制 HTTPS，Google 注册局）。预算与叙事都想要时，常见做法是 .ai 做产品主站、.dev 做开发者文档与社区入口。",
      pickA: ["面向大众的 AI 产品与模型服务", "融资与媒体叙事需要品类信号", "AI 是产品的核心卖点", "短品牌词在主流后缀均被注册"],
      pickB: ["SDK、CLI 与开发者平台", "API 文档站与技术社区", "预算敏感的工程师品牌", "强制 HTTPS 的安全默认"],
    },
    en: {
      title: ".ai vs .dev: Category Narrative or Engineer Credibility",
      metaDescription:
        ".ai tells the AI category story at a premium; .dev is cheap, reliable and carries engineer credibility. Compare positioning, pricing and fit, then hunt names available on both.",
      verdict:
        "For AI-adjacent products the two suffixes tell different stories. .ai speaks outward — announcing the category to users, investors and press. .dev speaks inward — telling engineers 'this tool is for you'. Model products, AI apps and consumer AI services fit .ai; SDKs, CLIs, API docs and developer platforms wear .dev better and much cheaper (.dev also enforces HTTPS, Google registry). Want both narrative and budget? A common split: .ai for the product site, .dev for developer docs and community.",
      pickA: ["Consumer AI products and model services", "Category signal for fundraising and press", "AI as the core selling point", "Short brand words taken on mainstream suffixes"],
      pickB: ["SDKs, CLIs and developer platforms", "API docs and technical communities", "Budget-conscious engineer brands", "HTTPS-enforced secure default"],
    },
  },
  "xyz-vs-top": {
    slug: "xyz-vs-top",
    a: "xyz",
    b: "top",
    zh: {
      title: ".xyz 和 .top 怎么选：两大低价后缀的真实差别",
      metaDescription: ".xyz 与 .top 都以低价著称，但认知圈层完全不同。对比两者的气质、续费与信誉差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都是首年几块钱的低价后缀，差别在认知圈层：.xyz 有 Alphabet（abc.xyz）与 Web3 圈背书，在国际新锐科技圈是「便宜但有态度」；.top 注册量主要在国内，国际认知弱，更多用于短链、活动页与临时项目。两者共同的坑：续费价远高于首年促销价，且低价后缀历史上被滥用较多，部分邮件网关与安全软件更警惕。正式品牌主站建议只把它们当过渡或防御性注册。",
      pickA: ["Web3 与国际新锐科技项目", "预算极限的 side project", "想要 Alphabet 同款后缀的态度", "短词组合在主流后缀绝迹"],
      pickB: ["面向国内的活动页与短期项目", "批量防御性注册", "预算最敏感的试验站", "短链与跳转域名"],
    },
    en: {
      title: ".xyz vs .top: What Really Separates the Two Budget Suffixes",
      metaDescription:
        ".xyz and .top are both known for rock-bottom prices, but their recognition circles differ completely. Compare vibe, renewals and reputation, then hunt names available on both.",
      verdict:
        "Both cost a couple of dollars in year one; the difference is who recognizes them. .xyz carries Alphabet (abc.xyz) and Web3 endorsement — 'cheap but with attitude' in international tech circles. .top's registrations concentrate in China with weak international recognition, mostly powering short links, campaign pages and temporary projects. Shared pitfalls: renewals far above the promo price, and budget suffixes' history of abuse makes some mail gateways and security tools warier. For a serious brand's primary site, treat both as transitional or defensive registrations.",
      pickA: ["Web3 and international edgy tech projects", "Ultra-low-budget side projects", "The Alphabet-style suffix attitude", "Short combos extinct on mainstream suffixes"],
      pickB: ["China-facing campaign and short-term pages", "Bulk defensive registrations", "Most price-sensitive experiments", "Short-link and redirect domains"],
    },
  },
  "shop-vs-store": {
    slug: "shop-vs-store",
    a: "shop",
    b: "store",
    zh: {
      title: ".shop 和 .store 怎么选：电商域名双雄对比",
      metaDescription: ".shop 与 .store 都是电商专属后缀，语义相近但气质与价格不同。对比两者的读感、续费与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两者语义几乎重叠，差别在读感与价格：.shop 更短、更口语，「品牌 + .shop」读起来就是一句行动号召，全球注册量也明显更大；.store 更像实体「商店」的正式称谓，品牌旗舰店气质更重。价格上两者首年促销都很便宜，但续费都不便宜——注册前务必看清续费价。选择建议：日常电商与 DTC 独立站选 .shop，品牌官方旗舰店或线下品牌线上化选 .store；高客单价场景两者都建议搭配 .com 做信任背书。",
      pickA: ["DTC 独立站与日常电商", "更短更口语的行动号召感", "国际市场（注册量与认知更大）", "品类词域名（coffee.shop 类）"],
      pickB: ["品牌官方旗舰店", "线下零售品牌的线上入口", "「商店」正式感更强的定位", "shop 下心仪名字已被注册"],
    },
    en: {
      title: ".shop vs .store: The Two E-commerce Suffixes Compared",
      metaDescription:
        ".shop and .store are both e-commerce suffixes with similar meaning but different vibes and pricing. Compare readability, renewals and fit, then hunt names available on both.",
      verdict:
        "Their meanings nearly overlap; the differences are cadence and price. .shop is shorter and more conversational — 'brand + .shop' reads like a call to action — and has significantly more registrations worldwide. .store reads like the formal word for a physical shop, giving flagship-store gravitas. Both offer cheap first-year promos with much higher renewals, so check renewal pricing before registering. Rule of thumb: everyday e-commerce and DTC sites take .shop; official brand flagships and offline retailers going online take .store. For high-ticket commerce, pair either with a .com for trust.",
      pickA: ["DTC and everyday e-commerce sites", "Shorter, call-to-action cadence", "International markets (bigger recognition)", "Category-word domains (coffee.shop style)"],
      pickB: ["Official brand flagship stores", "Offline retailers moving online", "Formal 'store' positioning", "Your name is taken on .shop"],
    },
  },
  "cloud-vs-tech": {
    slug: "cloud-vs-tech",
    a: "cloud",
    b: "tech",
    zh: {
      title: ".cloud 和 .tech 怎么选：云服务与泛科技的定位对比",
      metaDescription: ".cloud 精准指向云与 SaaS，.tech 覆盖一切科技叙事。对比两者的定位精度、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两者都是科技叙事，精度不同：.cloud 一词就把「云服务/SaaS/托管平台」说完了，产品形态是云交付时几乎零解释成本；.tech 更宽，硬件、初创、社区、黑客松都装得下，但也因此少了一层具体指向。价格上 .tech 首年促销常见极低价、续费高出数倍，.cloud 相对平缓。选择建议：产品核心是云端交付（SaaS、PaaS、托管、存储）用 .cloud；泛科技品牌、硬件、技术社区与活动用 .tech。两者库存都远好于 .com。",
      pickA: ["SaaS 与云交付产品", "托管、存储与基础设施平台", "「云」是品类关键词的品牌", "定位精准不想解释的场景"],
      pickB: ["泛科技品牌与硬件产品", "技术社区、活动与黑客松", "科技媒体与内容站", "cloud 下心仪名字已被注册"],
    },
    en: {
      title: ".cloud vs .tech: Precise Cloud Positioning or Broad Tech",
      metaDescription:
        ".cloud points precisely at cloud and SaaS; .tech covers every technology narrative. Compare positioning precision, pricing and fit, then hunt names available on both.",
      verdict:
        "Both tell a technology story at different precision. .cloud says 'cloud service / SaaS / hosted platform' in one word — near-zero explanation cost when your product is cloud-delivered. .tech is broader: hardware, startups, communities and hackathons all fit, at the cost of specificity. On price, .tech's first-year promos run extremely cheap with renewals several times higher; .cloud is flatter. Rule of thumb: cloud-delivered products (SaaS, PaaS, hosting, storage) take .cloud; broad tech brands, hardware, communities and events take .tech. Both have far better inventory than .com.",
      pickA: ["SaaS and cloud-delivered products", "Hosting, storage and infrastructure platforms", "Brands where 'cloud' is the category word", "Zero-explanation precise positioning"],
      pickB: ["Broad tech brands and hardware", "Tech communities, events and hackathons", "Tech media and content sites", "Your name is taken on .cloud"],
    },
  },
  "pro-vs-co": {
    slug: "pro-vs-co",
    a: "pro",
    b: "co",
    zh: {
      title: ".pro 和 .co 怎么选：专业人士与创业公司的对比",
      metaDescription: ".pro 自带「专业」标签，适合个人专业服务；.co 是创业公司的 .com 替身。对比两者的气质与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "一个说「我是专业的」，一个说「我们是公司」：.pro 天然适合以个人专业能力为卖点的服务——律师、设计师、咨询师、教练、自由职业者，「名字 + .pro」就是一张数字名片；.co 读作 company，适合团队与创业公司的主站。价格上 .pro 首年常有低价促销、续费中等；.co 续费明显更贵且要留意误输 .com 的分流风险。个人品牌选 .pro，公司品牌选 .co，是最省心的分法。",
      pickA: ["律师、咨询师、设计师等专业服务", "自由职业者与个人工作室", "「专业认证感」是卖点的服务", "个人数字名片站"],
      pickB: ["创业公司与团队主站", "新消费品牌", "追求比 .com 短一个字母的利落感", "国际化公司形象"],
    },
    en: {
      title: ".pro vs .co: Professional Badge or Startup Shorthand",
      metaDescription:
        ".pro carries a built-in 'professional' badge for individual services; .co is the startup's .com stand-in. Compare vibe and fit, then hunt names available on both.",
      verdict:
        "One says 'I'm a professional', the other says 'we're a company'. .pro naturally fits services sold on personal expertise — lawyers, designers, consultants, coaches, freelancers — where 'name + .pro' works as a digital business card. .co reads as company, fitting teams and startup homepages. On price, .pro often has cheap first-year promos with moderate renewals; .co renews noticeably higher and carries the .com typo-leak risk. The simplest split: personal brands take .pro, company brands take .co.",
      pickA: ["Lawyers, consultants, designers and professional services", "Freelancers and solo studios", "Services selling certified expertise", "Personal digital business cards"],
      pickB: ["Startup and team homepages", "Consumer brands", "One letter crisper than .com", "International company image"],
    },
  },
  "vip-vs-club": {
    slug: "vip-vs-club",
    a: "vip",
    b: "club",
    zh: {
      title: ".vip 和 .club 怎么选：会员体系与社群文化的对比",
      metaDescription: ".vip 主打会员尊享感，.club 主打社群归属感。对比两者的气质、认知圈层与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都围绕「圈子」，指向不同：.vip 强调分层与尊享——会员体系、付费订阅、高端服务用它顺理成章，且 vip 一词在中文互联网认知度极高，国内会员场景几乎零解释；.club 强调平等与归属——兴趣社群、俱乐部、粉丝组织、线下活动用它更自然，国际化读感也更好。价格上两者首年都便宜、续费中等。选择建议：卖「等级与特权」用 .vip，卖「归属与同好」用 .club。",
      pickA: ["会员体系与付费订阅服务", "面向国内用户的高端服务", "电商会员与忠诚度计划", "「尊享感」是卖点的品牌"],
      pickB: ["兴趣社群与俱乐部", "粉丝组织与创作者社群", "线下活动与运动俱乐部", "国际化社群品牌"],
    },
    en: {
      title: ".vip vs .club: Membership Tiers or Community Belonging",
      metaDescription:
        ".vip sells exclusive membership; .club sells community belonging. Compare vibe, recognition circles and fit, then hunt names available on both.",
      verdict:
        "Both are about circles, pointed differently. .vip emphasizes tiers and privilege — membership programs, paid subscriptions and premium services wear it naturally, and the word 'vip' has enormous recognition on the Chinese internet, making it near zero-explanation for China-facing membership products. .club emphasizes equality and belonging — hobby communities, clubs, fan organizations and offline events read more natural, with better international cadence. Both are cheap in year one with moderate renewals. Rule of thumb: selling tiers and privilege, take .vip; selling belonging and shared interest, take .club.",
      pickA: ["Membership programs and paid subscriptions", "China-facing premium services", "E-commerce loyalty programs", "Brands selling exclusivity"],
      pickB: ["Hobby communities and clubs", "Fan organizations and creator communities", "Offline events and sports clubs", "International community brands"],
    },
  },
  "link-vs-cc": {
    slug: "link-vs-cc",
    a: "link",
    b: "cc",
    zh: {
      title: ".link 和 .cc 怎么选：链接工具与万能简写的对比",
      metaDescription: ".link 语义直白适合链接与导航类产品，.cc 是短小的万能后缀。对比两者的语义、认知与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "一个语义精准，一个短而万能：.link 一词就说清「这是个链接/导航/聚合入口」，bio link、短链服务、资源导航站用它零解释成本；.cc 只有两个字母、无固定语义，创意工作室（creative content）、个人站、社区项目都能用，中文圈也常读作「西西」朗朗上口。价格上 .cc 通常更便宜且续费平缓，.link 续费中等。选择建议：产品核心是「链接」这件事就用 .link；想要短、通用、不被语义绑定就用 .cc。",
      pickA: ["bio link 与个人主页聚合", "短链与跳转服务", "资源导航与聚合站", "「链接」是产品核心动作"],
      pickB: ["创意工作室与个人站", "社区与开源项目", "想要两字母短后缀的利落感", "不想被后缀语义绑定"],
    },
    en: {
      title: ".link vs .cc: Literal Link Tools or the Versatile Two-Letter",
      metaDescription:
        ".link says exactly what link products do; .cc is the short versatile suffix with no fixed meaning. Compare semantics, recognition and fit, then hunt names available on both.",
      verdict:
        "One is semantically precise, the other short and versatile. .link explains itself — bio links, URL shorteners, navigation and aggregator products get zero-explanation domains. .cc is just two letters with no fixed meaning: creative studios, personal sites and community projects all wear it, and it's catchy in Chinese circles too. On price, .cc is usually cheaper with flatter renewals; .link renews moderate. Rule of thumb: if 'the link' is your product's core action, take .link; if you want short, versatile and semantically unbound, take .cc.",
      pickA: ["Bio-link and profile aggregation pages", "URL shorteners and redirect services", "Resource navigation and aggregator sites", "Products whose core action is the link"],
      pickB: ["Creative studios and personal sites", "Communities and open-source projects", "Two-letter crispness", "No semantic lock-in"],
    },
  },
  "shop-vs-com": {
    slug: "shop-vs-com",
    a: "shop",
    b: "com",
    zh: {
      title: ".shop 和 .com 怎么选：电商专属与默认信任的取舍",
      metaDescription: ".shop 语义直白是电商天然后缀，.com 是默认信任但好名字难求。对比两者的信任度、库存与组合打法，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "电商场景的经典取舍：.com 信任度无可替代，但短而好的名字几乎绝迹、收购成本高；.shop 语义直白、库存极好，「品牌 + .shop」本身就是行动号召，首年价格常常只要几块钱。要注意 .shop 续费显著高于首年促销价，以及部分高客单价用户对新后缀的信任折扣。务实打法：预算有限先用 .shop 上线卖货，品牌起量后收购对应 .com 做 301；或 .com 做品牌官网、.shop 做促销/活动落地页分工。",
      pickA: ["预算有限先上线的电商", "「买」是核心动作的落地页", "品类词域名（sneaker.shop 类）", "心仪名字 .com 已被注册"],
      pickB: ["高客单价与信任敏感品类", "长期品牌资产与转售", "口头传播多的品牌（广告、直播）", "面向所有人群的正式官网"],
    },
    en: {
      title: ".shop vs .com: E-commerce Native or Default Trust",
      metaDescription:
        ".shop is the literal e-commerce suffix with great inventory; .com is default trust with scarce good names. Compare trust, inventory and combo strategies, then hunt names available on both.",
      verdict:
        "The classic e-commerce trade-off. .com's trust is irreplaceable, but short good names are essentially extinct and expensive to acquire. .shop says what it does, has excellent inventory, and 'brand + .shop' doubles as a call to action — often just a few dollars in year one. Watch two things: .shop renewals run far above the promo price, and some high-ticket shoppers discount newer suffixes on trust. Pragmatic plays: launch and sell on .shop first, acquire the matching .com once the brand has traction; or split duties — .com for the brand site, .shop for promo and campaign landers.",
      pickA: ["Budget-first e-commerce launches", "Landers where buying is the core action", "Category-word domains (sneaker.shop style)", "Your name is taken on .com"],
      pickB: ["High-ticket, trust-sensitive categories", "Long-term brand asset and resale", "Word-of-mouth-heavy brands (ads, livestreams)", "Formal primary site for every audience"],
    },
  },
  "com-vs-me": {
    slug: "com-vs-me",
    a: "com",
    b: "me",
    zh: {
      title: ".com 和 .me 怎么选：品牌资产与个人表达的取舍",
      metaDescription: ".com 是品牌与商业的默认选择，.me 天然适合个人品牌与作品集。对比两者的气质、价格与语义玩法，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "看主体是「公司」还是「人」：做商业产品、公司官网，.com 的默认信任无可替代；做个人主页、作品集、简历站、newsletter，.me 语义天然——about.me、hire.me 式的表达是 .com 给不了的。价格上 .me 注册与续费都明显高于 .com，纯从成本看不占优，赢在语义。务实策略：个人品牌先用「名字.me」上线，日后商业化再补对应 .com；动词短语（find.me、read.me 类）则 .me 是唯一解。",
      pickA: ["商业产品与公司官网", "长期品牌资产与转售", "预算敏感、在意续费成本", "面向大众的正式站点"],
      pickB: ["个人主页、作品集、简历站", "个人 newsletter 或博客", "动词短语域名（hire.me 类）", "心仪名字 .com 已被注册"],
    },
    en: {
      title: ".com vs .me: Brand Asset or Personal Expression",
      metaDescription:
        ".com is the default for brands and business; .me is built for personal sites and portfolios. Compare vibe, pricing and semantic hacks, then hunt names available on both.",
      verdict:
        "It hinges on whether the subject is a company or a person. For commercial products and company sites, .com's default trust is irreplaceable. For personal pages, portfolios, resumes and newsletters, .me is semantically native — about.me and hire.me style phrasing is something .com simply can't do. On price, .me costs more to register and renew, so it wins on meaning, not cost. Pragmatic play: launch your personal brand on name.me and pick up the matching .com if you commercialize; for verb phrases (find.me, read.me), .me is the only answer.",
      pickA: ["Commercial products and company sites", "Long-term brand asset and resale", "Budget-sensitive, renewal-conscious", "Formal site for a broad audience"],
      pickB: ["Personal pages, portfolios, resumes", "Personal newsletters or blogs", "Verb-phrase domains (hire.me style)", "Your name is taken on .com"],
    },
  },
  "io-vs-tech": {
    slug: "io-vs-tech",
    a: "io",
    b: "tech",
    zh: {
      title: ".io 和 .tech 怎么选：极客身份与直白语义的取舍",
      metaDescription: ".io 是开发者圈的身份标识，.tech 语义直白且库存更好。对比两者的圈内认知、价格结构与库存差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两个都是技术向后缀，差别在「圈内认知」与「价格结构」：.io 在开发者/开源/SaaS 圈的地位多年积累，天然带极客身份，但注册与续费都贵且好名字消耗快；.tech 语义谁都看得懂，首年常有超低促销价、库存明显更好，缺点是续费涨幅大（典型的首年便宜续费贵）、圈内辨识度不如 .io。面向开发者的产品优先 .io；面向大众讲「科技感」的品牌、黑客松、硬件团队，.tech 直白够用。两个后缀都要注意长期续费成本。",
      pickA: ["开发者工具、API、开源项目", "SaaS 与技术圈品牌", "在意圈内身份认同", "预算能接受较高续费"],
      pickB: ["面向大众的科技品牌", "黑客松、技术活动、社区", "首年预算敏感（促销价极低）", "心仪名字 .io 已被注册"],
    },
    en: {
      title: ".io vs .tech: Hacker Cred or Literal Meaning",
      metaDescription:
        ".io carries developer-scene credibility; .tech is literal with better inventory. Compare in-crowd recognition, price structure and inventory, then hunt names available on both.",
      verdict:
        "Both are tech suffixes; the difference is in-crowd recognition versus price structure. .io has years of accumulated status in the developer, open-source and SaaS scene — instant hacker cred — but costs more to register and renew, and good names go fast. .tech is understood by everyone, often has rock-bottom first-year promos and much better inventory, but renewals jump hard (the classic cheap-year-one trap) and it carries less insider weight. Developer-facing products should default to .io; consumer-facing 'tech vibe' brands, hackathons and hardware teams do fine on .tech. Watch long-term renewal cost on both.",
      pickA: ["Developer tools, APIs, open source", "SaaS and tech-scene brands", "In-crowd identity matters", "Budget tolerates higher renewals"],
      pickB: ["Consumer-facing tech brands", "Hackathons, tech events, communities", "First-year budget sensitivity (deep promos)", "Your name is taken on .io"],
    },
  },
  "online-vs-site": {
    slug: "online-vs-site",
    a: "online",
    b: "site",
    zh: {
      title: ".online 和 .site 怎么选：两个通用后缀的实用对比",
      metaDescription: ".online 和 .site 都是语义通用、库存极好的后缀。对比两者的读感、长度、价格与续费结构，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两者定位几乎重叠：语义通用、什么行业都能用、库存都极好、首年都常有低价促销。差别主要在读感与长度：.site 只有 4 个字母，更短更利落，「品牌 + site」读起来像「某某网站」；.online 7 个字母偏长，但「品牌 + online」有「上线了/在线服务」的动词感，做「传统品牌转线上」的叙事更顺。两者续费都显著高于首年促销价，注册前务必看清续费。同名都可注册时，短优先选 .site；讲「线上化」故事选 .online。",
      pickA: ["「转线上/在线服务」叙事的品牌", "传统行业的线上入口", "首年预算敏感（促销价低）", "心仪名字 .site 已被注册"],
      pickB: ["想要更短更利落的域名", "通用落地页与项目站", "首年预算敏感（促销价低）", "心仪名字 .online 已被注册"],
    },
    en: {
      title: ".online vs .site: A Practical Comparison of Two Generic Suffixes",
      metaDescription:
        ".online and .site are both generic, high-inventory suffixes. Compare readability, length, pricing and renewal structure, then hunt names available on both.",
      verdict:
        "Their positioning almost fully overlaps: generic meaning, industry-agnostic, excellent inventory, frequent first-year promos. The real differences are readability and length. .site is just four letters — shorter and snappier, 'brand + site' reads as 'the website of X'. .online is seven letters but 'brand + online' has a verb-ish 'now live / online service' feel, which suits a brick-to-click story. Both renew far above the promo price, so check renewals before registering. When the name is free on both, pick .site for brevity or .online for the going-online narrative.",
      pickA: ["Brands telling a going-online story", "Online entry point for offline businesses", "First-year budget sensitivity (deep promos)", "Your name is taken on .site"],
      pickB: ["You want the shorter, snappier domain", "Generic landers and project sites", "First-year budget sensitivity (deep promos)", "Your name is taken on .online"],
    },
  },
  "store-vs-online": {
    slug: "store-vs-online",
    a: "store",
    b: "online",
    zh: {
      title: ".store 和 .online 怎么选：卖货语义与通用在线的取舍",
      metaDescription: ".store 明确指向「商店」，.online 语义更泛。对比两者的转化语义、适用场景与续费结构，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "核心问题是「你的站点是不是商店」：如果是，.store 语义精准——「品牌 + store」用户一眼知道能买东西，转化语义比 .online 强；如果站点不止卖货（内容 + 服务 + 商城混合），.online 更泛更保险。两者库存都好、首年都有低价促销、续费都明显更贵。电商独立站优先 .store；工具站、服务站或还没想清楚形态的项目选 .online。也有品牌两个都注册：.store 直达商城页，.online 做主站。",
      pickA: ["电商独立站与品牌商城", "「买」是核心动作的站点", "品类词 + store 的组合打法", "心仪名字 .online 已被注册"],
      pickB: ["内容/服务/商城混合的站点", "形态未定的早期项目", "「在线服务」叙事的品牌", "心仪名字 .store 已被注册"],
    },
    en: {
      title: ".store vs .online: Commerce Semantics or Generic Presence",
      metaDescription:
        ".store literally means shop; .online is broader. Compare conversion semantics, use cases and renewal structure, then hunt names available on both.",
      verdict:
        "The core question: is your site a store? If yes, .store is semantically precise — 'brand + store' tells users they can buy at a glance, stronger conversion language than .online. If the site mixes content, services and commerce, .online is broader and safer. Both have great inventory, deep first-year promos and much higher renewals. Standalone e-commerce sites should default to .store; tools, services and still-forming projects fit .online. Some brands register both: .store deep-links to the shop, .online serves as the main site.",
      pickA: ["Standalone e-commerce and brand shops", "Sites where buying is the core action", "Category-word + store combos", "Your name is taken on .online"],
      pickB: ["Mixed content/service/shop sites", "Early projects with undecided shape", "Brands telling an online-service story", "Your name is taken on .store"],
    },
  },
  "cc-vs-tv": {
    slug: "cc-vs-tv",
    a: "cc",
    b: "tv",
    zh: {
      title: ".cc 和 .tv 怎么选：两个「转义」国别后缀的对比",
      metaDescription: ".cc 中性百搭常被当作 .com 替补，.tv 天然绑定视频与直播。对比两者的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两个都是被「转义」使用的国别后缀（.cc 科科斯群岛、.tv 图瓦卢），但走向完全不同：.cc 中性、无固定语义，常被当作 .com 的替补，短域名库存好、价格适中，中文圈接受度尤其高；.tv 语义被「电视/视频」牢牢锁定，做视频、直播、流媒体内容是天然选择，但价格明显更贵，且用在非视频场景会造成预期错位。做视频内容选 .tv 不用犹豫；只是想要一个短而中性的域名，.cc 性价比更好。",
      pickA: ["想要 .com 替补的短域名", "中文圈品牌（.cc 接受度高）", "预算适中、语义中性的项目", "心仪名字 .tv 太贵或已被注册"],
      pickB: ["视频、直播、流媒体内容", "UP 主/主播的个人频道站", "「频道感」是品牌的一部分", "预算能接受较高注册与续费"],
    },
    en: {
      title: ".cc vs .tv: Two Repurposed Country Codes Compared",
      metaDescription:
        ".cc is neutral and versatile, often a .com understudy; .tv is locked to video and streaming. Compare semantics, pricing and use cases, then hunt names available on both.",
      verdict:
        "Both are repurposed country codes (.cc for Cocos Islands, .tv for Tuvalu) that took opposite paths. .cc is neutral with no fixed meaning — a common .com understudy with good short-name inventory, moderate pricing, and especially strong acceptance in Chinese-speaking markets. .tv is firmly locked to television and video: the natural pick for video, livestreaming and media content, but noticeably pricier, and using it outside video sets the wrong expectation. Making video content? Take .tv without hesitation. Just want a short neutral name? .cc is the better value.",
      pickA: ["Short .com-understudy domains", "Chinese-market brands (.cc is well accepted)", "Neutral-meaning projects on a moderate budget", "Your name is too pricey or taken on .tv"],
      pickB: ["Video, livestreaming, media content", "Creator channel sites", "The 'channel' feel is part of the brand", "Budget tolerates higher pricing"],
    },
  },
  "cn-vs-top": {
    slug: "cn-vs-top",
    a: "cn",
    b: "top",
    zh: {
      title: ".cn 和 .top 怎么选：两个低价后缀的实用对比",
      metaDescription: ".cn 是国内市场标配且续费便宜，.top 首年极便宜但语义弱。对比两者的合规要求、价格结构与信任度，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两个都以便宜著称，但便宜的方式不同：.cn 注册与续费都稳定低价，是国内市场的标配，代价是需要实名认证、接入国内主机需 ICP 备案；.top 首年常常一两美元、无实名门槛，但语义弱（「顶级」的说服力有限）、历史上被低质站大量使用导致信任折扣，部分邮件服务对 .top 域名更严格。面向国内正经做品牌，.cn 是更稳的选择；做实验项目、临时活动页、纯测试用途，.top 的首年价格几乎无敌——但别把重要品牌押在上面。",
      pickA: ["面向国内市场的正式品牌", "需要 ICP 备案接入国内服务器", "在意长期续费稳定低价", "拼音品牌词的天然归属"],
      pickB: ["实验项目与临时活动页", "首年预算极度敏感", "不想做实名认证流程", "心仪名字 .cn 已被注册"],
    },
    en: {
      title: ".cn vs .top: A Practical Comparison of Two Budget Suffixes",
      metaDescription:
        ".cn is the China-market standard with cheap renewals; .top is ultra-cheap in year one but semantically weak. Compare compliance, price structure and trust, then hunt names available on both.",
      verdict:
        "Both are famously cheap, but in different ways. .cn is consistently low-priced to register and renew and is the standard for the Chinese market — the trade-off is real-name verification, plus ICP filing if you host domestically. .top often costs a dollar or two in year one with no identity hurdle, but its meaning is weak, heavy historical use by low-quality sites created a trust discount, and some mail providers treat .top more strictly. Building a serious China-facing brand? .cn is the steadier pick. Experiments, temporary campaign pages, throwaway tests? .top's year-one price is unbeatable — just don't bet an important brand on it.",
      pickA: ["Serious China-facing brands", "Need ICP filing with domestic hosting", "Stable low renewals long-term", "Natural home for pinyin brand words"],
      pickB: ["Experiments and temporary campaign pages", "Extreme first-year budget sensitivity", "No real-name verification process", "Your name is taken on .cn"],
    },
  },
  "art-vs-design": {
    slug: "art-vs-design",
    a: "art",
    b: "design",
    zh: {
      title: ".art 和 .design 怎么选：艺术身份与设计职业的取舍",
      metaDescription: ".art 面向艺术家与画廊，.design 面向设计师与设计团队。对比两者的适用人群、价格与库存，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "看你的身份关键词：做「作品」的选 .art，做「职业」的选 .design。艺术家、画廊、展览项目用 .art 更像一张艺术名片；UI/UX、品牌设计师和设计工作室用 .design 则直接把职业写进域名，在简历与邮件签名里辨识度更高。价格上 .art 明显更便宜且续费稳定，.design 定价偏高但库存好；两者的人名、风格词库存都远好于 .com。跨界创意人（既做艺术也接设计单）可以 .art 做作品集、.design 做商单入口。",
      pickA: ["艺术家个人站与作品集", "画廊、美术馆与艺术机构", "展览与艺术项目页", "预算敏感（价格更低续费稳）"],
      pickB: ["UI/UX 与品牌设计师个人品牌", "设计工作室与咨询", "公司设计团队子站", "简历/名片上的职业身份域名"],
    },
    en: {
      title: ".art vs .design: Artistic Identity or Professional Craft",
      metaDescription:
        ".art serves artists and galleries; .design serves designers and studios. Compare audiences, pricing and inventory, then hunt names available on both with AI.",
      verdict:
        "It comes down to your identity keyword: choose .art for the work, .design for the profession. Artists, galleries and exhibitions read like an art business card on .art; UI/UX and brand designers write their profession into the domain with .design, which stands out on resumes and signatures. On price, .art is notably cheaper with stable renewals, while .design sits at the premium end but with strong inventory — both have far better name availability than .com. Cross-disciplinary creatives can split: portfolio on .art, client work entry on .design.",
      pickA: ["Artist portfolios & personal sites", "Galleries, museums & institutions", "Exhibition & art project pages", "Budget-minded (cheaper, stable renewals)"],
      pickB: ["UI/UX & brand designer personal brands", "Design studios & consultancies", "Company design-team sites", "Resume-grade professional identity"],
    },
  },
  "studio-vs-design": {
    slug: "studio-vs-design",
    a: "studio",
    b: "design",
    zh: {
      title: ".studio 和 .design 怎么选：团队形态与职业身份的取舍",
      metaDescription: ".studio 强调团队形态，.design 强调设计职业。对比两者的气质、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两者都是创意圈好后缀，差别在重心：.studio 说的是「我们是一个小团队」，设计、影像、游戏、播客团队都适用；.design 说的是「我们做设计」，垂直但职业辨识度更高。非设计类创意团队（影像/动画/音频）直接选 .studio；纯设计业务的工作室两个都行，.design 更垂直、.studio 更柔和。价格上 .studio 中等、.design 偏高；都比 .com 库存好得多。一个实用判断：团队名本身已含「design」语义时选 .studio 避免重复（如 mono.studio 而非 monodesign.design）。",
      pickA: ["影像、动画与音频团队", "游戏与独立开发小团队", "多元创意业务的工作室", "团队名已含 design 语义"],
      pickB: ["纯设计业务的工作室", "设计师个人品牌", "公司设计团队子站", "想把职业写进域名的辨识度"],
    },
    en: {
      title: ".studio vs .design: Team Shape or Professional Label",
      metaDescription:
        ".studio signals a small creative team; .design signals the design profession. Compare vibes, pricing and fit, then hunt names available on both with AI.",
      verdict:
        "Both are strong creative-scene suffixes; the difference is emphasis. .studio says 'we're a small team' — it fits design, film, game and podcast crews alike. .design says 'we do design' — more vertical, with higher professional recognition. Non-design creative teams (film, animation, audio) should go straight to .studio; design-only shops can use either — .design reads more vertical, .studio softer. Pricing: .studio moderate, .design premium; both have far better inventory than .com. One practical rule: if your team name already carries design semantics, pick .studio to avoid repetition (mono.studio, not monodesign.design).",
      pickA: ["Film, animation & audio teams", "Game & indie dev crews", "Multi-disciplinary creative shops", "Team names already containing 'design'"],
      pickB: ["Design-only studios", "Designer personal brands", "Company design-team sites", "Profession-in-the-domain recognition"],
    },
  },
  "live-vs-tv": {
    slug: "live-vs-tv",
    a: "live",
    b: "tv",
    zh: {
      title: ".live 和 .tv 怎么选：直播现场感与视频频道感的取舍",
      metaDescription: ".live 强调正在发生的现场，.tv 是视频频道的老牌身份。对比两者的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "看内容形态：强调「正在发生」的选 .live，强调「频道/栏目」的选 .tv。直播互动、线上活动、实时看板用 .live 更贴；长期经营的视频频道、栏目化内容、主播个人频道用 .tv 更像一个「台」。价格差异明显：.live 首年便宜但续费上浮；.tv 注册与续费都偏贵但稳定，适合当长期品牌持有。Twitch 时代 .tv 在直播圈的认知度仍在，但新一代活动/实时产品更多选 .live。两个都避开了 .com 的库存枯竭。",
      pickA: ["直播互动与线上活动页", "实时数据与状态看板", "发布会与线上峰会", "首年预算敏感的短期项目"],
      pickB: ["长期经营的视频频道", "主播/栏目个人品牌", "影视与媒体机构", "愿为稳定续费付溢价的长期品牌"],
    },
    en: {
      title: ".live vs .tv: Happening Now or Channel Brand",
      metaDescription:
        ".live means happening now; .tv is the veteran video-channel suffix. Compare semantics, pricing and fit, then hunt names available on both with AI.",
      verdict:
        "It's about content shape: pick .live for 'happening now', .tv for 'a channel'. Live interaction, online events and real-time dashboards read best on .live; long-running video channels, shows and creator brands feel like a station on .tv. Pricing differs sharply: .live is cheap year one with rising renewals, while .tv costs more but stays stable — better for a long-hold brand. Twitch-era recognition keeps .tv strong in streaming, but newer event/real-time products increasingly pick .live. Both dodge .com's exhausted inventory.",
      pickA: ["Live interaction & online events", "Real-time dashboards & status pages", "Launches & online summits", "Budget-sensitive short-run projects"],
      pickB: ["Long-running video channels", "Streamer & show personal brands", "Film & media organizations", "Long-hold brands that value stable renewals"],
    },
  },
  "fun-vs-club": {
    slug: "fun-vs-club",
    a: "fun",
    b: "club",
    zh: {
      title: ".fun 和 .club 怎么选：好玩体验与归属感社群的取舍",
      metaDescription: ".fun 卖的是好玩体验，.club 卖的是圈子归属感。对比两者的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "问自己一个问题：用户是来「玩一把」还是来「加入我们」？小游戏、趣味测试、互动营销页选 .fun，体验即产品；兴趣社群、付费会员、粉丝组织选 .club，归属即产品。两者都便宜、库存都好，.fun 首年更极端但续费上浮更多，.club 续费相对温和。注意语境：.fun 与严肃行业相斥，.club 在部分词搭配下有夜店联想。活动型社群（定期组局的兴趣小组）两个都行，看品牌调性：俏皮选 .fun，正经归属选 .club。",
      pickA: ["小游戏与休闲游戏站", "趣味测试与创意小工具", "互动营销 campaign 页", "俏皮轻快的品牌调性"],
      pickB: ["兴趣社群与付费社群", "会员修与粉丝俾乐部", "读书会与线下俾乐部", "主品牌的社区子站"],
    },
    en: {
      title: ".fun vs .club: Playful Experience or Belonging",
      metaDescription:
        ".fun sells a playful experience; .club sells belonging. Compare semantics, pricing and fit, then hunt names available on both with AI.",
      verdict:
        "Ask one question: do users come to play, or to join? Casual games, quizzes and interactive campaigns belong on .fun — the experience is the product. Interest groups, paid communities and fan organizations belong on .club — belonging is the product. Both are cheap with deep inventory; .fun is more extreme year one but renews higher, .club renews more gently. Mind the context: .fun clashes with serious verticals, and .club can carry nightlife connotations with certain words. Activity-shaped communities work on either — playful brands lean .fun, membership-shaped ones lean .club.",
      pickA: ["Casual game & entertainment sites", "Quizzes & playful tools", "Interactive marketing campaigns", "Playful, cheeky brand voice"],
      pickB: ["Interest & paid communities", "Membership & fan clubs", "Book clubs & local clubs", "Brand community companion sites"],
    },
  },
  "space-vs-site": {
    slug: "space-vs-site",
    a: "space",
    b: "site",
    zh: {
      title: ".space 和 .site 怎么选：个人小天地与通用建站的取舍",
      metaDescription: ".space 语义柔和适合创意空间，.site 是最通用的建站后缀。对比两者的气质、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两者都是便宜能打的通用新后缀，差在气质：.space 读起来有「地方感」——创作者的小天地、团队的空间、社区的聚集地，适合想要一点人情味的个人站与创意项目；.site 则完全中性，「名字 + .site」就是「这是我的网站」，临时页、活动页、工具站都合适但不加分。航天/太空主题产品 .space 语义满分。两者首年都很便宜、续费都上浮，注册前看清续费；库存都深，好词命中率高。要区分度选 .space，要中性百搭选 .site。",
      pickA: ["个人站与创意实验项目", "协作空间与社区品牌", "航天/太空主题产品", "想要有记忆点的气质后缀"],
      pickB: ["临时页与活动落地页", "工具站与实用小站", "完全中性的通用建站", "预算极度敏感的项目"],
    },
    en: {
      title: ".space vs .site: A Place With Character or a Neutral Website",
      metaDescription:
        ".space reads soft and place-like; .site is the most neutral website suffix. Compare vibes, pricing and fit, then hunt names available on both with AI.",
      verdict:
        "Both are cheap, capable generic new TLDs; the difference is character. .space reads like a place — a creator's corner, a team's space, a community's gathering spot — great when you want warmth in a personal site or creative project. .site is perfectly neutral: 'name + .site' just means 'this is my website' — fine for landing pages, tools and utilities, but it adds nothing. Space-themed products get perfect semantics on .space for free. Both are cheap year one with higher renewals (check before registering) and deep inventory. Want character, pick .space; want neutral versatility, pick .site.",
      pickA: ["Personal sites & creative experiments", "Collaborative-space & community brands", "Aerospace / space-themed products", "A suffix with memorable character"],
      pickB: ["Landing & campaign pages", "Tools & utility sites", "Fully neutral general websites", "Extremely budget-sensitive projects"],
    },
  },
  "live-vs-online": {
    slug: "live-vs-online",
    a: "live",
    b: "online",
    zh: {
      title: ".live 和 .online 怎么选：实时现场感与线上存在感的取舍",
      metaDescription: ".live 强调正在发生，.online 强调线上存在。对比两者的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "语义强度不同：.live 是强语义——「点进来看现场」，直播、活动、实时看板用它自带号召力；.online 是弱语义——「我们在线上」，传统生意的线上化、通用官网都能用，但不制造期待。内容是实时的选 .live，内容只是「在线上」的选 .online。两者首年都便宜、续费都明显上浮（.online 续费尤其高，注意长期持有成本）；库存都好。若两个都可注册且预算有限，优先看产品是否真有「实时」属性——有则 .live 加分，无则 .online 更稳。",
      pickA: ["直播与实时互动产品", "线上活动与发布会页", "实时数据看板", "需要「看现场」号召力的品牌"],
      pickB: ["传统生意的线上化官网", "通用产品站与服务页", "无实时属性的线上品牌", "想要最宽泛的语义兼容性"],
    },
    en: {
      title: ".live vs .online: Happening Now or Simply Online",
      metaDescription:
        ".live means happening now; .online just means you exist on the internet. Compare semantics, pricing and fit, then hunt names available on both with AI.",
      verdict:
        "The semantic strength differs: .live is strong — 'come watch now' — with a built-in call to action for streams, events and real-time dashboards. .online is weak — 'we're on the internet' — fine for a traditional business going digital or a generic site, but it sets no expectation. If your content is genuinely real-time, .live earns its keep; if it's merely online, .online is the safer neutral. Both are cheap year one with sharply higher renewals (.online especially — mind the long-term cost) and good inventory. With limited budget and both available, decide on whether your product truly has a live dimension.",
      pickA: ["Streaming & real-time interaction", "Online events & launch pages", "Live data dashboards", "Brands that need a 'watch now' CTA"],
      pickB: ["Traditional businesses going digital", "Generic product & service sites", "Online brands without a live dimension", "Broadest semantic compatibility"],
    },
  },
  "com-vs-app": {
    slug: "com-vs-app",
    a: "com",
    b: "app",
    zh: {
      title: ".com 和 .app 怎么选：通用信任与应用属性的取舍",
      metaDescription: ".com 是万能默认，.app 一眼说明「这是个应用」且全后缀强制 HTTPS。对比两者的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "产品核心是一个 App（移动端或 Web 应用），.app 几乎零解释成本——名字+后缀直接完成自我介绍，且 Google 注册局强制全后缀 HTTPS，安全底线自带；产品不止是应用（内容、服务、电商、公司官网），.com 的通用性更稳。价格上 .app 注册与续费都适中且稳定。常见组合：主品牌 .com 做公司站，产品线用 name.app 做下载/落地页。若两个都可注册且产品确实是应用，.app 的语义加成值得优先考虑。",
      pickA: ["公司官网与多产品品牌", "内容、电商等非应用业务", "追求最大通用性与转售价值", "面向不熟悉新后缀的大众用户"],
      pickB: ["移动/Web 应用本体", "应用下载与落地页", "看重强制 HTTPS 的安全属性", "name.com 已被注册但 name.app 可用"],
    },
    en: {
      title: ".com vs .app: Universal Trust or Built-in App Semantics",
      metaDescription:
        ".com is the universal default; .app says 'this is an app' at a glance and enforces HTTPS zone-wide. Compare semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "If your product is an app (mobile or web), .app introduces itself for free — name plus suffix does the explaining — and Google's registry enforces HTTPS across the whole zone. If you're more than an app (content, commerce, a company site), .com's universality is the safer long-term asset. .app pricing is moderate and stable on both registration and renewal. A common split: the company lives on .com while each product ships on name.app as its download/landing page. If both are free and the product genuinely is an app, the semantic boost of .app is worth taking.",
      pickA: ["Company sites & multi-product brands", "Content, commerce and non-app businesses", "Maximum universality and resale value", "Mainstream audiences unfamiliar with new TLDs"],
      pickB: ["The app itself (mobile or web)", "Download & landing pages", "Zone-wide enforced HTTPS", "name.com is taken but name.app is free"],
    },
  },
  "com-vs-dev": {
    slug: "com-vs-dev",
    a: "com",
    b: "dev",
    zh: {
      title: ".com 和 .dev 怎么选：大众品牌与开发者身份的取舍",
      metaDescription: ".com 面向所有人，.dev 是开发者品牌的身份标识且强制 HTTPS。对比两者的受众、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "看受众是谁：面向开发者的工具、文档、个人技术站，.dev 自带圈内身份——看到后缀就知道「这是给写代码的人的」，且与 .app 同属 Google 注册局、全后缀强制 HTTPS；面向大众或企业客户，.com 仍是默认信任。价格上 .dev 注册续费都适中。很多开发者工具的打法：产品站 name.dev，公司站 name.com，文档 docs.name.dev。若你的用户全是开发者，.dev 不是妥协而是加分项。",
      pickA: ["面向大众或企业客户的产品", "非技术业务与公司官网", "追求最大认知度与转售流动性", "品牌计划超出开发者圈层"],
      pickB: ["开发者工具与 API 产品", "技术文档与开源项目站", "个人技术博客与作品集", "圈内身份与强制 HTTPS 加分"],
    },
    en: {
      title: ".com vs .dev: Mainstream Brand or Developer Identity",
      metaDescription:
        ".com speaks to everyone; .dev is a badge for developer-facing brands with enforced HTTPS. Compare audiences, pricing and fit, then hunt names available on both.",
      verdict:
        "It comes down to who you serve. For developer tools, docs and personal tech sites, .dev is an identity badge — the suffix alone says 'built for people who code' — and like .app it's a Google registry zone with enforced HTTPS. For mainstream or enterprise audiences, .com remains the default trust signal. .dev pricing is moderate on both registration and renewal. A common developer-tool pattern: product on name.dev, company on name.com, docs on docs.name.dev. If your entire audience writes code, .dev is an upgrade, not a compromise.",
      pickA: ["Mainstream or enterprise-facing products", "Non-technical businesses & company sites", "Maximum recognition and resale liquidity", "Brands that will outgrow the developer niche"],
      pickB: ["Developer tools & API products", "Docs sites & open-source projects", "Personal tech blogs & portfolios", "Insider identity plus enforced HTTPS"],
    },
  },
  "io-vs-dev": {
    slug: "io-vs-dev",
    a: "io",
    b: "dev",
    zh: {
      title: ".io 和 .dev 怎么选：极客老牌与开发者新贵的对比",
      metaDescription: ".io 是技术圈十余年的老牌身份，.dev 语义更直白且便宜得多。对比两者的气质、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两者都是开发者品牌的主流选择，差异在气质与成本：.io 资历更老、创业圈联想更强（YC 系产品的默认气质），但注册与续费都明显更贵；.dev 语义更直白（就是「开发」）、价格便宜一半以上，且强制 HTTPS。库存上两者的短词都比 .com 好得多。务实建议：预算敏感或产品语义就是「给开发者用的」，选 .dev；想要创业圈的老牌极客气质、且预算允许，.io 依然是硬通货。两个都可注册时，先看每年续费差价是否值得为气质买单。",
      pickA: ["创业公司与 YC 系气质品牌", "已有 .io 生态联想的产品线", "看重后缀资历与转售流动性", "预算充足、气质优先"],
      pickB: ["预算敏感的开发者工具", "语义直白的「开发」类产品", "看重强制 HTTPS", "长期持有、在意续费成本"],
    },
    en: {
      title: ".io vs .dev: The Veteran Hacker Suffix or the Purpose-Built One",
      metaDescription:
        ".io has a decade of startup credibility; .dev is semantically literal and much cheaper. Compare vibes, pricing and fit, then hunt names available on both with AI.",
      verdict:
        "Both are mainstream choices for developer brands; the difference is vibe versus cost. .io has seniority — the default YC-startup aesthetic — but registers and renews at a clear premium. .dev is literal ('this is for development'), costs less than half as much, and enforces HTTPS zone-wide. Short-word inventory is far better than .com on both. Pragmatically: if you're budget-conscious or the product is literally for developers, take .dev; if you want the veteran startup credibility and the budget allows, .io is still hard currency. When both are available, ask whether the yearly renewal gap is worth paying for vibe.",
      pickA: ["Startups with YC-adjacent branding", "Products already in the .io ecosystem", "Suffix seniority and resale liquidity", "Budget allows paying for vibe"],
      pickB: ["Budget-conscious developer tools", "Literally development-focused products", "Zone-wide enforced HTTPS", "Long-term holds sensitive to renewal cost"],
    },
  },
  "ai-vs-app": {
    slug: "ai-vs-app",
    a: "ai",
    b: "app",
    zh: {
      title: ".ai 和 .app 怎么选：AI 光环与应用属性的取舍",
      metaDescription: ".ai 是 AI 产品的品类信号但价格昂贵，.app 说明产品形态且便宜稳定。对比两者的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两个后缀回答的是不同问题：.ai 回答「你是做什么的」（AI 品类信号），.app 回答「你是什么形态」（一个应用）。产品的核心卖点是 AI 能力、且融资/获客都吃 AI 光环，.ai 的品类溢价值得付——但注意它注册与续费都贵出一个量级。产品形态是应用、AI 只是内部实现，.app 更诚实也便宜得多。判断标准：如果三年后 AI 不再是卖点你会不会想换域名？会，就选 .app；不会（AI 就是产品本体），选 .ai。",
      pickA: ["AI 原生产品与模型服务", "融资叙事依赖 AI 品类", "AI 光环直接影响获客", "预算能承受高续费"],
      pickB: ["形态是应用、AI 只是实现", "预算敏感的独立开发者", "看重强制 HTTPS 与价格稳定", "担心 AI 标签三年后过时"],
    },
    en: {
      title: ".ai vs .app: The AI Halo or the App Identity",
      metaDescription:
        ".ai signals the AI category at a premium price; .app states the product form cheaply and stably. Compare semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "The two suffixes answer different questions: .ai answers 'what do you do' (the AI category), .app answers 'what are you' (an application). If AI capability is the core pitch — for fundraising and acquisition alike — the .ai category premium can be worth paying, but registration and renewal both cost an order of magnitude more. If the product is an app and AI is just the implementation detail, .app is more honest and far cheaper. A useful test: if AI stopped being a selling point in three years, would you want to change domains? If yes, take .app; if AI is the product itself, take .ai.",
      pickA: ["AI-native products & model services", "Fundraising narratives built on AI", "The AI halo directly drives acquisition", "Budget absorbs the premium renewal"],
      pickB: ["Apps where AI is an implementation detail", "Budget-conscious indie developers", "Enforced HTTPS and stable pricing", "Worried the AI label ages badly"],
    },
  },
  "pro-vs-vip": {
    slug: "pro-vs-vip",
    a: "pro",
    b: "vip",
    zh: {
      title: ".pro 和 .vip 怎么选：专业感与会员感的取舍",
      metaDescription: ".pro 传递专业资质，.vip 传递会员尊享。对比两者的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "语义方向完全不同：.pro 是「我很专业」——咨询、设计、法律、自由职业者的资质名片；.vip 是「你很尊贵」——会员制、私域、粉丝俱乐部的门牌。面向客户展示专业能力，选 .pro；面向会员营造归属感与稀缺感，选 .vip。.vip 在中文互联网的认知度尤其高（「贵宾」直觉），出海品牌则 .pro 的通用性更好。两者价格都亲民，续费注意各自的上浮幅度。同一品牌也可组合：主站 .pro 展示专业，会员区 .vip 做私域入口。",
      pickA: ["咨询、法律、设计等专业服务", "自由职业者个人品牌", "需要传递资质与信任", "面向国际市场的专业站"],
      pickB: ["会员制与订阅制业务", "粉丝俱乐部与私域社群", "中文市场（VIP 认知度高）", "营造尊享与稀缺感"],
    },
    en: {
      title: ".pro vs .vip: Professional Credentials or Member Exclusivity",
      metaDescription:
        ".pro signals professional expertise; .vip signals member privilege. Compare semantics, pricing and fit, then hunt names available on both with AI.",
      verdict:
        "The semantics point in opposite directions: .pro says 'I am a professional' — a credentials badge for consulting, design, legal and freelance brands; .vip says 'you are special' — a door sign for memberships, fan clubs and private communities. To showcase expertise to clients, take .pro; to make members feel exclusive, take .vip. Note .vip enjoys unusually strong recognition in the Chinese-speaking internet, while .pro travels better globally. Both are affordable; check each one's renewal markup. They even combine well within one brand: the main site on .pro, the members' area on .vip.",
      pickA: ["Consulting, legal, design & professional services", "Freelancer personal brands", "Trust and credentials messaging", "International professional audiences"],
      pickB: ["Membership & subscription businesses", "Fan clubs & private communities", "Chinese-market brands (high VIP recognition)", "Exclusivity and scarcity positioning"],
    },
  },
  "cloud-vs-online": {
    slug: "cloud-vs-online",
    a: "cloud",
    b: "online",
    zh: {
      title: ".cloud 和 .online 怎么选：云服务属性与通用线上存在的取舍",
      metaDescription: ".cloud 自带云服务与基础设施联想，.online 是最中性的线上后缀。对比两者的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "语义精确度不同：.cloud 是行业词——云服务、SaaS、基础设施、托管产品用它一眼对味，非云业务用则显得牵强；.online 是万金油——任何「在线上」的业务都能用，但也不传递任何专业信号。产品与云/托管/基础设施相关，.cloud 的语义加成明显；只是需要一个便宜的通用后缀，.online 库存深、首年便宜（注意续费上浮明显）。判断标准很简单：向别人介绍产品时会不会自然说出「云」这个字？会，选 .cloud；不会，.online 或其他中性后缀更合适。",
      pickA: ["云服务与托管产品", "SaaS 与基础设施工具", "DevOps 与企业 IT 品牌", "「云」是产品叙事的一部分"],
      pickB: ["通用线上业务与官网", "传统生意的线上化", "预算敏感的落地页", "不想被行业语义绑定"],
    },
    en: {
      title: ".cloud vs .online: Cloud-Native Semantics or Neutral Web Presence",
      metaDescription:
        ".cloud carries cloud-service and infrastructure connotations; .online is the most neutral web suffix. Compare semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "The difference is semantic precision. .cloud is an industry word — cloud services, SaaS, infrastructure and hosting products feel instantly at home on it, while unrelated businesses feel forced. .online is the all-purpose neutral: any business that exists on the internet can use it, but it signals nothing. If your product touches cloud, hosting or infrastructure, .cloud's semantic boost is real; if you just need a cheap generic suffix, .online has deep inventory and low first-year pricing (mind the steep renewal). The test is simple: would you naturally say the word 'cloud' when describing the product? If yes, take .cloud; if not, .online or another neutral suffix fits better.",
      pickA: ["Cloud services & hosting products", "SaaS & infrastructure tools", "DevOps & enterprise IT brands", "'Cloud' is part of the product story"],
      pickB: ["Generic online businesses & sites", "Traditional businesses going digital", "Budget-sensitive landing pages", "Avoiding industry-specific semantics"],
    },
  },
  "sh-vs-dev": {
    slug: "sh-vs-dev",
    a: "sh",
    b: "dev",
    zh: {
      title: ".sh 和 .dev 怎么选：极客暗号与官方认证的取舍",
      metaDescription: ".sh 是 shell 梗的开发者暗号，.dev 是 Google 运营的开发者官方后缀。对比两者的气质、价格与 HTTPS 要求，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两个都是开发者后缀，气质完全不同。.sh 是圈内梗：两个字母极短，「动词 + .sh」读起来像一条命令，CLI/终端工具用它最出彩，但价格贵好几倍且是国家后缀。.dev 是 Google 运营的通用后缀，语义直白官方，强制 HTTPS（HSTS 预载），价格便宜续费稳，适合更「正式」的开发者产品——文档站、开发者平台、个人技术品牌。判断标准：产品越靠近终端和脚本，.sh 的梗越值钱；越靠近平台和大众开发者，.dev 越稳妥。",
      pickA: ["CLI 与终端工具", "「动词.sh」能读成命令的名字", "极短域名优先（2 字母后缀）", "圈内梗带来的品牌加成"],
      pickB: ["开发者平台与文档站", "预算敏感、在意续费", "需要 HTTPS 强制的安全形象", "更大众的开发者受众"],
    },
    en: {
      title: ".sh vs .dev: Insider Pun or the Official Developer TLD",
      metaDescription:
        ".sh is the shell-script insider pun; .dev is Google's official developer TLD with forced HTTPS. Compare vibes, pricing and fit, then hunt names available on both.",
      verdict:
        "Both are developer suffixes with completely different personalities. .sh is the insider handshake: two letters, and \"verb + .sh\" reads like a command — unbeatable for CLI and terminal tools, but several times pricier and technically a ccTLD. .dev is Google-operated, semantically literal and official, with forced HTTPS via HSTS preload, cheap and stable — the safer home for more \"formal\" developer products: docs sites, platforms, personal tech brands. The test: the closer your product lives to the terminal, the more the .sh pun is worth; the closer to a platform and mainstream developers, the more .dev makes sense.",
      pickA: ["CLI & terminal tools", "Names where \"verb.sh\" reads as a command", "Shortest possible domain (2-letter suffix)", "Insider-pun brand equity"],
      pickB: ["Developer platforms & docs sites", "Budget-sensitive, renewal-conscious", "Forced-HTTPS security posture", "Broader developer audiences"],
    },
  },
  "gg-vs-tv": {
    slug: "gg-vs-tv",
    a: "gg",
    b: "tv",
    zh: {
      title: ".gg 和 .tv 怎么选：游戏圈暗号与直播视频的取舍",
      metaDescription: ".gg 是游戏电竞圈的 good game 暗号，.tv 是直播与视频内容的经典后缀。对比两者的受众、价格与语义边界，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "重叠区在直播——但受众信号不同。.gg 说的是「游戏」：电竞战队、Discord 工具、游戏数据站用它圈内认同拉满，游戏主播用它也顺；.tv 说的是「视频/频道」：直播平台、视频内容、播客视频版用它更直白，非游戏类主播和内容品牌 .tv 明显更贴。价格上两者都是中上档的国家后缀。判断标准：内容以游戏为核心选 .gg，以「频道/节目」为核心选 .tv；两个都做的头部主播，通常 .gg 做社区、.tv 做内容站。",
      pickA: ["游戏与电竞产品/战队", "Discord 社区与工具", "游戏数据与攻略站", "游戏主播个人品牌"],
      pickB: ["直播平台与视频内容", "非游戏类主播/频道", "播客与节目品牌", "「频道感」大于「游戏感」的内容"],
    },
    en: {
      title: ".gg vs .tv: Gaming Cred or Streaming Heritage",
      metaDescription:
        ".gg is the good-game badge of gaming and esports; .tv is the classic suffix for streaming and video. Compare audiences and semantics, then hunt names available on both.",
      verdict:
        "They overlap on streaming — but signal different things. .gg says \"gaming\": esports teams, Discord tools and game-stats sites get maximum insider credibility, and gaming streamers wear it naturally. .tv says \"video/channel\": streaming platforms, video content and video podcasts read instantly, and non-gaming streamers and content brands fit .tv much better. Both are mid-to-high-priced ccTLDs. The test: if the content is gaming-first, take .gg; if it's channel-first, take .tv. Big streamers doing both often run community on .gg and the content site on .tv.",
      pickA: ["Games & esports products/teams", "Discord communities & tools", "Game stats & guide sites", "Gaming streamer personal brands"],
      pickB: ["Streaming platforms & video content", "Non-gaming streamers/channels", "Podcast & show brands", "Channel-feel over gaming-feel"],
    },
  },
  "so-vs-io": {
    slug: "so-vs-io",
    a: "so",
    b: "io",
    zh: {
      title: ".so 和 .io 怎么选：Notion 系新贵与技术圈老牌的取舍",
      metaDescription: ".so 因 Notion.so 走红、适合效率工具，.io 是技术圈身份标识但更贵。对比两者的认知度、价格与库存，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都是被明星产品带火的国家后缀。.io 更早更普及：开发者工具、API、开源项目的默认选项，圈内认知无需教育，代价是注册续费都贵、短词也被抢得差不多了。.so 是效率工具赛道的「Notion 认证」：单词能连读成短语（do.so 式）时特别出彩，库存明显更好，价格相近或略低。判断标准：纯开发者产品优先 .io（受众默认）；效率/协作/AI 工具且名字能读成短语，.so 的品牌记忆点更强。两个都要防守时，注意同名 .com 是否可得。",
      pickA: ["效率与协作工具", "名字能连读成短语（word.so）", "Notion 系受众的新产品", ".io 上心仪短词已绝迹"],
      pickB: ["开发者工具、API、开源项目", "技术圈默认认知（无需教育）", "更活跃的二手交易市场", "圈内投资人/用户的熟悉感"],
    },
    en: {
      title: ".so vs .io: The Notion-Era Upstart or the Dev-Scene Classic",
      metaDescription:
        ".so rose with Notion.so and fits productivity tools; .io is the developer-scene badge but pricier. Compare recognition, pricing and inventory, then hunt names available on both.",
      verdict:
        "Both are ccTLDs made famous by flagship products. .io came first and runs deeper: the default for developer tools, APIs and open source, requiring zero audience education — at the cost of expensive registration and renewals, with short words largely gone. .so carries the \"Notion stamp\" in productivity: it shines when the name chains into a phrase (do.so style), inventory is visibly better, and pricing is similar or slightly lower. The test: developer-first products default to .io; productivity, collaboration and AI tools whose name reads as a phrase get more brand recall from .so. Either way, check whether the matching .com is gettable for defense.",
      pickA: ["Productivity & collaboration tools", "Names that chain into a phrase (word.so)", "Notion-era product audiences", "Your short word is long gone on .io"],
      pickB: ["Developer tools, APIs & open source", "Default dev-scene recognition", "More liquid aftermarket", "Investor/user familiarity in tech"],
    },
  },
  "us-vs-com": {
    slug: "us-vs-com",
    a: "us",
    b: "com",
    zh: {
      title: ".us 和 .com 怎么选：美国本土信号与全球通用的取舍",
      metaDescription: ".us 便宜且可玩「与我们」短语梗但注册需美国关联，.com 全球通用。对比两者的注册限制、隐私政策与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "先看资格再看品牌。.us 注册要求美国关联（公民/居民/企业，需申报 Nexus），且注册局禁止 WHOIS 隐私——注册人信息公开，这两条就排除了很多人。资格没问题的话，.us 有独特优势：价格便宜，且「join.us、near.us」式短语域名把后缀读进品牌里，社区和本地服务用起来非常出彩。.com 则是不需要任何解释的全球默认：面向国际、长期品牌资产、转售流动性都是它赢。判断标准：美国本土业务 + 短语梗成立选 .us；其余场景 .com 仍是第一选择。",
      pickA: ["美国本土产品与服务", "「动词.us」短语域名（join.us 式）", "预算敏感（便宜续费稳）", "社区与协作类品牌"],
      pickB: ["面向全球用户", "需要 WHOIS 隐私保护", "无美国关联（不符合 .us 资格）", "长期品牌资产与转售"],
    },
    en: {
      title: ".us vs .com: The Domestic Signal or the Global Default",
      metaDescription:
        ".us is cheap with a built-in \"us = we\" wordplay but requires a US nexus; .com is the global default. Compare eligibility, privacy and fit, then hunt names available on both.",
      verdict:
        "Check eligibility before branding. .us requires a genuine US nexus (citizen, resident or US business, declared at registration) and the registry forbids WHOIS privacy — registrant details are public, which alone rules out many buyers. If you qualify, .us has real upside: budget pricing, and phrase domains like join.us or near.us read the suffix straight into the brand — brilliant for communities and local services. .com remains the explanation-free global default: international reach, long-term brand equity and resale liquidity all favor it. The test: US-domestic business plus a working phrase pun → .us; everything else still starts at .com.",
      pickA: ["US-domestic products & services", "\"Verb.us\" phrase domains (join.us)", "Budget-sensitive, stable renewals", "Community & collaboration brands"],
      pickB: ["Global audiences", "Need WHOIS privacy", "No US nexus (ineligible for .us)", "Long-term brand asset & resale"],
    },
  },
  "in-vs-com": {
    slug: "in-vs-com",
    a: "in",
    b: "com",
    zh: {
      title: ".in 和 .com 怎么选：印度市场与短语梗 vs 全球默认",
      metaDescription: ".in 面向印度市场且可玩介词短语梗（check.in 式），.com 全球通用。对比两者的受众、价格与创意空间，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        ".in 有两条独立的胜负手：一是印度市场——本地化产品、跨境电商在印度用户眼里 .in 就是「本土」信号，且对所有人开放注册、价格便宜；二是介词梗——「check.in、log.in、move.in」式短语在全球都成立，签到、入驻、打卡类产品能把后缀读进品牌。除这两条外，.com 的全球默认地位仍然碾压：认知零成本、资产流动性最好。判断标准：主攻印度市场，或名字恰好能补全一个「in」短语，选 .in；否则 .com。成熟品牌进印度通常两个都持有。",
      pickA: ["面向印度市场的产品", "「动词.in」短语域名（check.in 式）", "签到/入驻/打卡类语义", "预算敏感（便宜且开放注册）"],
      pickB: ["面向全球用户", "长期品牌资产与转售", "不依赖短语梗的普通品牌词", "认知零成本的默认选择"],
    },
    en: {
      title: ".in vs .com: India Reach and Phrase Puns vs the Global Default",
      metaDescription:
        ".in targets India and doubles as the preposition \"in\" (check.in style); .com is the global default. Compare audiences, pricing and creative room, then hunt names available on both.",
      verdict:
        ".in wins on two independent fronts: India — for localized products and cross-border commerce, .in reads as \"domestic\" to Indian users, registration is open to anyone and pricing is cheap; and the preposition pun — check.in, log.in, move.in phrases work worldwide, letting check-in and onboarding products read the suffix into the brand. Outside those two, .com's global-default status still dominates: zero-cost recognition and the most liquid aftermarket. The test: India-first market or a name that completes an \"in\" phrase → .in; otherwise .com. Brands entering India at scale usually hold both.",
      pickA: ["India-market products", "\"Verb.in\" phrase domains (check.in)", "Check-in / onboarding semantics", "Budget-friendly, open registration"],
      pickB: ["Global audiences", "Long-term brand asset & resale", "Ordinary brand words without the pun", "Zero-education default choice"],
    },
  },
  "info-vs-org": {
    slug: "info-vs-org",
    a: "info",
    b: "org",
    zh: {
      title: ".info 和 .org 怎么选：信息站与公信力的取舍",
      metaDescription: ".info 便宜适合资料站，.org 自带非营利公信力。对比两者的信任感、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都是「非商业感」后缀，信任层级不同。.org 二十多年积累的公信力仍在：非营利组织、开源基金会、行业协会、公共服务用它，用户默认「这不是来卖货的」。.info 语义直白但历史包袱重——低价导致的垃圾站历史让它的信任感明显弱一档，适合资料站、文档、活动页这类不需要背书的信息发布。价格上 .info 首年极便宜但续费翻数倍，.org 全程稳定。判断标准：需要公信力背书（组织、社区、公益）选 .org；纯信息发布、低成本试验选 .info。",
      pickA: ["资料站与行业百科", "产品文档与帮助站", "活动与信息发布页", "低成本内容试验"],
      pickB: ["非营利组织与公益项目", "开源项目与基金会", "行业协会与社区", "需要中立公信力背书"],
    },
    en: {
      title: ".info vs .org: Information Utility or Institutional Trust",
      metaDescription:
        ".info is cheap and fits resource sites; .org carries nonprofit-grade credibility. Compare trust, pricing and fit, then hunt names available on both.",
      verdict:
        "Both read \"non-commercial,\" at different trust tiers. .org still carries two decades of institutional credibility: nonprofits, open-source foundations, industry associations and public services get an automatic \"not here to sell you\" from users. .info is semantically literal but carries baggage — its bargain pricing attracted years of spam, leaving trust a clear notch lower; it suits resource sites, docs and event pages that don't need endorsement. On price, .info's first year is nearly free but renewals multiply, while .org stays flat. The test: need institutional trust (organizations, communities, causes) → .org; pure information publishing or low-cost experiments → .info.",
      pickA: ["Resource sites & industry wikis", "Product docs & help sites", "Event & information pages", "Low-cost content experiments"],
      pickB: ["Nonprofits & causes", "Open-source projects & foundations", "Associations & communities", "Neutral institutional credibility"],
    },
  },
  "com-vs-org": {
    slug: "com-vs-org",
    a: "com",
    b: "org",
    zh: {
      title: ".com 和 .org 怎么选：商业默认与公益公信力的分界",
      metaDescription: ".com 是商业世界的默认后缀，.org 自带非营利公信力。对比两者的信任语义、价格与误用风险，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "这对组合的分界线最清晰：卖东西、做产品、追求增长，用 .com；组织、社区、公益、开源基金会，用 .org。两者价格接近（.org 续费略高一点），真正的差异在语义承诺——用户看到 .org 会默认「这不是来卖货的」，商业产品硬套 .org 会显得违和甚至误导；反过来非营利组织用 .com 会削弱捐赠者信任。唯一的灰色地带是开源项目：社区主导选 .org（如 mozilla.org），公司主导的商业开源选 .com 并把 .org 留给基金会。成熟组织通常两个都注册防混淆。",
      pickA: ["商业产品与付费服务", "创业公司主站", "电商与增长导向业务", "长期品牌资产与转售"],
      pickB: ["非营利组织与公益项目", "开源基金会与社区", "行业协会与标准组织", "需要「非商业」信任背书"],
    },
    en: {
      title: ".com vs .org: Commercial Default or Nonprofit Credibility",
      metaDescription:
        ".com is the commercial default; .org signals nonprofit-grade trust. Compare semantics, pricing and misuse risk, then hunt names available on both.",
      verdict:
        "This pair has the cleanest dividing line of any comparison: selling something, building a product, chasing growth → .com; organizations, communities, causes and open-source foundations → .org. Pricing is close (.org renews slightly higher), so the real difference is the semantic promise — users read .org as \"not here to sell you,\" and a commercial product wearing it feels off or even misleading; conversely a nonprofit on .com quietly erodes donor trust. The one grey zone is open source: community-led projects fit .org (mozilla.org), while company-led commercial open source belongs on .com with .org reserved for the foundation. Established organizations usually register both to prevent confusion.",
      pickA: ["Commercial products & paid services", "Startup primary sites", "E-commerce & growth-driven businesses", "Long-term brand asset & resale"],
      pickB: ["Nonprofits & causes", "Open-source foundations & communities", "Associations & standards bodies", "Need the \"non-commercial\" trust signal"],
    },
  },
  "com-vs-co": {
    slug: "com-vs-co",
    a: "com",
    b: "co",
    zh: {
      title: ".com 和 .co 怎么选：一个字母的分流代价",
      metaDescription: ".co 是创业圈认可的 .com 替身，但少一个字母意味着持续分流。对比两者的信任度、价格与防混淆策略，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        ".co 是所有 .com 替身里最像 .com 的——「company」的联想干净利落，创业圈与投资人早已接受（angel.co 时代确立的认知）。但它的最大风险恰恰来自这份相似：用户手滑补全 .com 是肌肉记忆，如果对应 .com 在别人手里且在运营，你会永久性分流流量，广告和口头传播的损耗尤其明显。价格上 .co 续费比 .com 贵一截，且没有 .com 的转售流动性。判断标准：心仪短名字 .com 已被注册且对方只是停放（而非运营），.co 可放心上；对方在运营同类业务，宁可换名字也别用 .co。",
      pickA: ["面向大众、依赖口头传播", "对应 .com 被同行运营中", "长期品牌资产与转售流动性", "不想为防分流多买域名"],
      pickB: ["创业公司与融资叙事", "心仪短名 .com 仅被停放", "「company/co.」语义入名（xx.co）", "接受略高续费换更好库存"],
    },
    en: {
      title: ".com vs .co: What One Missing Letter Costs You",
      metaDescription:
        ".co is the most .com-like alternative, accepted across startup circles — but one missing letter means permanent traffic leak risk. Compare trust, pricing and defense strategy, then hunt names available on both.",
      verdict:
        ".co is the most convincing .com stand-in there is — the \"company\" association is clean, and startup circles accepted it long ago (the angel.co era settled that). Its biggest risk comes from that very similarity: typing .com is muscle memory, so if the matching .com is owned and operated by someone else, you leak traffic permanently — worst in ads and word-of-mouth. On price, .co renews noticeably higher than .com and lacks its aftermarket liquidity. The test: if the .com you want is merely parked, .co is safe to build on; if it's an operating business — especially a similar one — change the name rather than take .co.",
      pickA: ["Mainstream audience, word-of-mouth heavy", "Matching .com runs a live business", "Long-term asset & resale liquidity", "Don't want to buy extra defensive domains"],
      pickB: ["Startups & fundraising narrative", "The .com you want is only parked", "\"Company/co.\" wordplay names (xx.co)", "Accept higher renewal for better inventory"],
    },
  },
  "club-vs-gg": {
    slug: "club-vs-gg",
    a: "club",
    b: "gg",
    zh: {
      title: ".club 和 .gg 怎么选：泛社区与游戏圈的身份对比",
      metaDescription: ".club 泛社区通用且便宜，.gg 是游戏圈的身份标识但续费更贵。对比两者的圈层语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都是社区后缀，圈层完全不同。.gg 源自游戏术语「good game」，在电竞、游戏公会、Discord 社区里就是身份证——战队官网、赛事平台用 .gg 无需解释，圈外后缀反而显得外行。.club 语义更泛：会员制社区、兴趣小组、付费社群、线下俱乐部都成立，且注册和续费都便宜得多。价格是关键取舍：.gg 续费是 .club 的数倍，非游戏社区为 .gg 买单不值。判断标准：游戏/电竞相关，闭眼选 .gg；其他类型社区（读书会、会员制、兴趣圈），.club 性价比高得多。",
      pickA: ["会员制社区与付费社群", "兴趣小组与线下俱乐部", "预算敏感（注册续费都便宜）", "非游戏类社区品牌"],
      pickB: ["电竞战队与游戏公会", "游戏工具与赛事平台", "Discord 社区与直播周边", "圈内身份信号（gg 即 good game）"],
    },
    en: {
      title: ".club vs .gg: General Community or Gaming Credibility",
      metaDescription:
        ".club is the affordable all-purpose community suffix; .gg is gaming's identity badge at a premium renewal. Compare tribe semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both are community suffixes serving entirely different tribes. .gg comes from the gaming sign-off \"good game\" — in esports, guilds and Discord communities it IS the badge: team sites and tournament platforms on .gg need zero explanation, while an outsider suffix reads amateur. .club is broader: membership communities, hobby groups, paid circles and offline clubs all fit, and both registration and renewal cost far less. Price is the real trade-off — .gg renews at several times .club's rate, hard to justify outside gaming. The test: anything gaming or esports → .gg without hesitation; every other community type (book clubs, memberships, hobby circles) → .club wins on value.",
      pickA: ["Membership & paid communities", "Hobby groups & offline clubs", "Budget-sensitive (cheap to register and renew)", "Non-gaming community brands"],
      pickB: ["Esports teams & gaming guilds", "Gaming tools & tournament platforms", "Discord communities & streaming brands", "In-group signal (gg = good game)"],
    },
  },
  "studio-vs-co": {
    slug: "studio-vs-co",
    a: "studio",
    b: "co",
    zh: {
      title: ".studio 和 .co 怎么选：作品气质与公司气质的取舍",
      metaDescription: ".studio 直接把「工作室」写进域名，.co 更短更商业。对比两者的气质、长度代价与价格，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "定位差异一目了然：.studio 把「工作室」三个字写进域名，设计工作室、独立游戏团队、摄影/影像机构用它自带作品集气质，客户还没点开就知道你是创作者；.co 短、商业感强，适合想被当作「公司」而非「小团队」的品牌。代价在长度与输入成本——.studio 六个字母偏长，口头传播略吃亏；.co 则要防 .com 手滑分流。价格上两者续费接近，都不算便宜。判断标准：卖创意与作品（设计、影像、游戏），.studio 的语义红利大于长度代价；卖服务与产品、强调专业公司形象，选 .co。",
      pickA: ["设计/品牌工作室与作品集", "独立游戏与影像团队", "摄影与创意机构", "「名字+studio」读起来自然的品牌"],
      pickB: ["想被当作公司而非小团队", "追求短域名与输入效率", "商业服务与产品品牌", "创业公司通用备选"],
    },
    en: {
      title: ".studio vs .co: Portfolio Vibe or Company Polish",
      metaDescription:
        ".studio writes your identity into the domain; .co is shorter and more corporate. Compare vibe, length cost and pricing, then hunt names available on both.",
      verdict:
        "The positioning gap is obvious at a glance: .studio writes what you are into the address — design studios, indie game teams and photo/video shops get instant portfolio credibility before the page even loads. .co is short and corporate, for brands that want to read as a company rather than a small team. The cost is length versus leak: .studio's six letters are a mouthful in spoken channels, while .co must guard against .com typo drift. Renewal pricing is similar and neither is bargain-tier. The test: selling creativity and portfolio work (design, video, games) → .studio's semantic payoff beats the length tax; selling services and products with a professional-company image → .co.",
      pickA: ["Design & branding studios with portfolios", "Indie game & video teams", "Photography & creative shops", "Names where \"x.studio\" reads naturally"],
      pickB: ["Want to read as a company, not a crew", "Short domain & typing efficiency", "Business services & product brands", "General-purpose startup fallback"],
    },
  },
  "me-vs-io": {
    slug: "me-vs-io",
    a: "me",
    b: "io",
    zh: {
      title: ".me 和 .io 怎么选：个人品牌与技术身份的对比",
      metaDescription: ".me 是个人品牌与作品集的天然后缀，.io 是开发者圈的技术标识。对比两者的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "同是个人开发者，两个后缀讲的是不同的故事。.me 讲「我这个人」：个人主页、简历站、作品集、newsletter，「名字.me」读起来就是自我介绍，about.me 确立的认知至今有效；.io 讲「我做的东西」：开源项目、side project、开发者工具，挂 .io 天然像个产品。价格上 .me 续费明显更便宜，.io 贵但短名库存更好。判断标准：域名指向「人」（找工作、接案、个人影响力）选 .me；指向「产品」（希望项目被当作正经工具而非个人练手）选 .io。很多开发者两个都持有：.me 放简历，.io 放项目。",
      pickA: ["个人主页与在线简历", "作品集与 newsletter", "自由职业者接案品牌", "续费预算敏感"],
      pickB: ["开源项目与 side project", "开发者工具与 API", "希望被当作产品而非个人站", "技术圈身份信号"],
    },
    en: {
      title: ".me vs .io: Personal Brand or Technical Identity",
      metaDescription:
        ".me is the natural suffix for personal brands and portfolios; .io is the developer world's badge. Compare semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "For the same indie developer, these suffixes tell different stories. .me is about the person: homepage, résumé site, portfolio, newsletter — \"yourname.me\" reads as a self-introduction, a perception about.me cemented years ago. .io is about the thing you built: open-source projects, side projects and dev tools on .io read as products by default. On price, .me renews noticeably cheaper, while .io costs more but has better short-name inventory. The test: if the domain points at you (job hunting, freelancing, personal reach) → .me; if it points at a product you want taken seriously as a tool rather than a hobby page → .io. Many developers hold both: .me for the résumé, .io for the projects.",
      pickA: ["Personal homepages & online résumés", "Portfolios & newsletters", "Freelancer brands", "Renewal-budget sensitive"],
      pickB: ["Open-source & side projects", "Developer tools & APIs", "Want it read as a product, not a personal page", "Tech-circle identity signal"],
    },
  },
  "ai-vs-tech": {
    slug: "ai-vs-tech",
    a: "ai",
    b: "tech",
    zh: {
      title: ".ai 和 .tech 怎么选：品类信号与泛科技的取舍",
      metaDescription: ".ai 精准锁定 AI 品类但价格高昂，.tech 覆盖全科技赛道且便宜得多。对比两者的信号强度、价格与转型空间，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "信号精度换价格：.ai 把品类写死在后缀上，AI 产品用它用户与投资人零解释成本，但注册两年起步、续费显著昂贵，且产品一旦转向非 AI 方向后缀就成了包袱；.tech 覆盖整个科技赛道——硬件、SaaS、机器人、AI 都装得下，价格便宜数倍，转型不用改名。库存上两者的短名字都远好于 .com/.io。判断标准：产品核心叙事就是 AI，且预算撑得起长期续费，.ai 的信号红利值回票价；产品是「科技公司但不只做 AI」，或想给方向留余地，.tech 更稳。别忽视一个细节：.ai 域名删除后有溢价拍卖机制，捡漏成本比 .tech 高得多。",
      pickA: ["核心卖点是 AI 的产品", "融资叙事需要品类信号", "预算能覆盖高额续费", "短品牌词在主流后缀均被注册"],
      pickB: ["泛科技公司（硬件/SaaS/机器人）", "方向可能演进、不想绑死 AI", "预算敏感（便宜数倍）", "科技园区/孵化器/媒体品牌"],
    },
    en: {
      title: ".ai vs .tech: Category Precision or Broad-Tech Flexibility",
      metaDescription:
        ".ai locks in the AI category at a premium; .tech covers the whole technology space for far less. Compare signal strength, pricing and pivot room, then hunt names available on both.",
      verdict:
        "You're trading signal precision for price. .ai hard-codes the category into the suffix — zero explanation needed for users or investors — but registration starts at two years, renewals are steep, and if the product pivots away from AI the suffix becomes baggage. .tech spans the entire technology space — hardware, SaaS, robotics and AI all fit — at a fraction of the cost, with no rename needed when direction shifts. Short-name inventory on both beats .com/.io comfortably. The test: if AI is the core narrative and the budget sustains premium renewals for years, .ai's signal pays for itself; if you're a tech company that does more than AI, or want pivot room, .tech is the safer hold. One detail worth knowing: expired .ai domains go through premium auctions, so bargain-hunting drops costs far more than on .tech.",
      pickA: ["Products whose core value is AI", "Fundraising narrative needs the category signal", "Budget sustains premium renewals", "Short brand word taken on mainstream suffixes"],
      pickB: ["Broad tech companies (hardware/SaaS/robotics)", "Might pivot — don't lock into AI", "Budget-sensitive (several times cheaper)", "Tech parks, incubators & media brands"],
    },
  },
  "world-vs-com": {
    slug: "world-vs-com",
    a: "world",
    b: "com",
    zh: {
      title: ".world 和 .com 怎么选：全球化叙事与万能默认的取舍",
      metaDescription: ".world 库存充裕、自带全球化口号感，.com 认知度无可替代但好名字几乎绝迹。对比两者的价格续费、库存与品牌策略，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "这是一场「叙事」对「默认」的对比。.world 的最大红利是库存与口号感：coffee.world、maker.world 这样的常见单词组合在 .com 下早已绝迹，在 .world 下大多还能注册，域名本身就能当一句品牌宣言念出来。.com 则是用户手指的肌肉记忆——地址栏默认补全、口头传播零解释成本。价格结构完全不同：.com 注册与续费都稳定在几十元且多年不变；.world 首年促销常见十几元，但续费跳到两百元上下（约 3–10 倍差），长期持有必须按续费价核算。务实判断：品牌故事本身围绕「世界/全球/宇宙观」（出海产品、元宇宙、跨文化社区），.world 是加分项而非妥协；若品牌词在 .com 下还能拿到，主站仍优先 .com，把 .world 留作活动页或世界观子站。",
      pickA: ["品牌叙事围绕「世界/全球」的产品", "想要单词域名当口号（coffee.world 式）", "游戏/元宇宙与跨文化社区", "心仪单词在 .com 已绝迹"],
      pickB: ["面向大众的正式主站品牌", "在意续费成本的长期持有（.com 续费稳定便宜）", "口头传播多、依赖用户默认补全", "长期资产与转售流动性"],
    },
    en: {
      title: ".world vs .com: Global Storytelling or the Universal Default",
      metaDescription:
        ".world offers dictionary-word inventory and slogan-like branding; .com has unbeatable recognition but scarce names. Compare pricing, renewals and strategy, then hunt names available on both.",
      verdict:
        "This is narrative versus default. .world's big win is inventory and slogan power: dictionary combos like coffee.world or maker.world — long extinct on .com — are mostly still registrable, and the domain itself reads as a brand statement. .com is muscle memory: browsers autocomplete it and word-of-mouth needs zero explanation. Pricing diverges sharply: .com registration and renewal both sit stably around $10–12 year after year, while .world runs cheap promos (a few dollars) then jumps to $25–30 renewals — a 3–10x gap you must budget for. The pragmatic test: if your brand story is literally about worlds, global reach or a universe (go-global products, metaverse, cross-cultural communities), .world is a feature, not a compromise. If your brand word is still gettable on .com, keep .com as the primary site and use .world for campaigns or lore sub-sites.",
      pickA: ["Brands whose story is about worlds/global reach", "Slogan-like dictionary domains (coffee.world style)", "Games, metaverse & cross-cultural communities", "Your word is extinct on .com"],
      pickB: ["Mainstream primary brand sites", "Renewal-cost sensitive long-term holds (.com stays cheap)", "Heavy word-of-mouth relying on autocomplete", "Long-term asset & resale liquidity"],
    },
  },
  "life-vs-me": {
    slug: "life-vs-me",
    a: "life",
    b: "me",
    zh: {
      title: ".life 和 .me 怎么选：生活方式品牌与个人身份的对比",
      metaDescription: ".life 语义温暖适合健康与生活方式品牌，.me 是个人主页与简历站的天然后缀。对比两者的语义指向、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两个后缀都很「人味」，但指向不同：.me 指向「这个人」——个人主页、在线简历、作品集、newsletter，about.me 多年前就把这个认知焊死了；.life 指向「这种生活」——健康管理、生活方式品牌、家庭服务、心理成长，品牌 + .life 读起来像一句承诺（better.life、simple.life）。价格上 .me 是黑山国别域名，注册与续费都在百元上下且差价小；.life 是典型新顶级域结构——首年十几元促销、续费两百元档，长期要按续费算账。库存 .life 明显更好，sleep、balance、slow 这类生活词汇大多可注册，而 .me 短词已相当稀缺。判断标准：域名代表你个人（求职、自由职业、个人影响力）→ .me；域名代表一个生活方式产品或内容品牌 → .life。品牌名以 me 或 life 结尾时，各自的域名 hack 拆分（hire.me、better.life）都是加分玩法。",
      pickA: ["健康、养生与生活方式品牌", "生活类内容站与博客", "家庭、保险与个人成长服务", "想要 better.life 式承诺感域名"],
      pickB: ["个人主页与在线简历", "自由职业者个人品牌", "作品集与 newsletter", "品牌词以 me 结尾的域名 hack"],
    },
    en: {
      title: ".life vs .me: Lifestyle Brand or Personal Identity",
      metaDescription:
        ".life has warm semantics for health and lifestyle brands; .me is the natural home for personal pages. Compare semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both suffixes feel human, but they point at different things. .me points at the person: homepages, online résumés, portfolios, newsletters — about.me cemented that reading years ago. .life points at a way of living: wellness, lifestyle brands, family services, personal growth — brand + .life reads like a promise (better.life, simple.life). On price, .me is Montenegro's ccTLD with registration and renewal both around $15–20 and a small gap; .life follows the classic new-gTLD curve — a few dollars the first year, then $25–30 renewals, so budget on renewal. Inventory clearly favors .life: everyday words like sleep, balance or slow are often still available, while short .me names are scarce. The test: if the domain represents you (job hunting, freelancing, personal reach) → .me; if it represents a lifestyle product or content brand → .life. And if your brand ends in \"me\" or \"life\", the respective domain hacks (hire.me, better.life) are a bonus.",
      pickA: ["Health, wellness & lifestyle brands", "Lifestyle content sites and blogs", "Family, insurance & personal-growth services", "Promise-like domains (better.life style)"],
      pickB: ["Personal homepages & online résumés", "Freelancer personal brands", "Portfolios & newsletters", "Domain hacks for brands ending in \"me\""],
    },
  },
  "agency-vs-co": {
    slug: "agency-vs-co",
    a: "agency",
    b: "co",
    zh: {
      title: ".agency 和 .co 怎么选：行业自述与简洁公司感的对比",
      metaDescription: ".agency 把业务类型写进后缀，.co 是最体面的 .com 替身。对比两者的语义、长度、价格与分流风险，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "服务型公司选域名的经典两难：要说明力还是要简洁。.agency 是自我介绍式后缀——设计工作室、营销团队、公关猎头用 name.agency，客户一眼知道你是干什么的，词根可以更抽象大胆；代价是 6 字符后缀偏长，口播要念清楚。.co 只有两个字符，读起来像 company 的缩写，气质接近 .com 且更利落；代价是永远存在向 .com 分流的风险——输入时少打一个 m 的用户会落到 .com 持有者手里，选它之前务必查查对应 .com 在谁手里。价格上 .co 注册百元上下但续费明显高于 .com；.agency 首年十几元促销、续费一百多元，两者长期成本相近。库存 .agency 显著更好，几乎任何风格词都能注册到。判断标准：客户来源靠搜索与转介绍、需要后缀帮你说明业务 → .agency；品牌词本身够独特、追求名片上的简洁 → .co。",
      pickA: ["设计/营销/公关等代理机构", "想让后缀说明业务、词根更大胆", "库存要求高（词根选择自由）", "作品集式机构官网（name.agency）"],
      pickB: ["品牌词独特、追求简洁利落", "两字符后缀、口播与名片友好", "泛公司定位而非明确代理业态", "对应 .com 无活跃竞品、分流风险可控"],
    },
    en: {
      title: ".agency vs .co: Self-Describing Suffix or Sleek Company Shorthand",
      metaDescription:
        ".agency writes your business type into the suffix; .co is the most respectable .com stand-in. Compare semantics, length, pricing and leak risk, then hunt names available on both.",
      verdict:
        "The classic dilemma for service firms: explanatory power or brevity. .agency introduces you by itself — design studios, marketing teams, PR and recruiting firms on name.agency need no tagline, freeing the root to be bold and abstract; the cost is a six-character suffix that must be spoken carefully. .co is two characters, reads as shorthand for company, and feels closest to .com; the cost is permanent leak risk — users who type the missing \"m\" land on whoever owns the .com, so check that owner before committing. On price, .co registers around $10 but renews notably higher than .com ($25–35 at many registrars); .agency runs cheap promos then renews around $20–25 — long-term costs end up similar. Inventory strongly favors .agency: nearly any word style is still available. The test: if clients come via search and referrals and you want the suffix to explain the business → .agency; if your brand word is distinctive and you want business-card sleekness → .co.",
      pickA: ["Design/marketing/PR and other agencies", "Let the suffix explain the business, keep roots bold", "Need wide inventory and root freedom", "Portfolio-style firm sites (name.agency)"],
      pickB: ["Distinctive brand words wanting sleekness", "Two-character suffix — spoken & card friendly", "General company positioning, not strictly an agency", "The matching .com has no active competitor"],
    },
  },
  "games-vs-gg": {
    slug: "games-vs-gg",
    a: "games",
    b: "gg",
    zh: {
      title: ".games 和 .gg 怎么选：语义完整与电竞黑话的对比",
      metaDescription: ".games 把行业写进域名且价格亲民，.gg 是电竞圈的 good game 黑话但续费更贵。对比两者的气质、价格与库存，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "同为游戏行业后缀，气质完全不同。.games 语义完整直白——工作室官网、独立游戏作品集、游戏媒体用它一眼即懂，首年百元级、续费一两百元，是游戏行业性价比最高的语义后缀。.gg 是根西岛国别域名，被电竞圈用「good game」黑话收编：战队、直播工具、对战平台用 .gg 自带圈内身份，Discord 的 discord.gg 短链更是把它焊进了玩家心智；代价是价格更高——注册与续费普遍在四五百元档，且两字符后缀好词稀缺。判断标准：面向玩家社区、电竞与直播场景，圈内认同感重要 → .gg 值回票价；工作室官网、作品集、游戏媒体这类「行业内容」载体 → .games 更划算且词根选择自由得多。预算充裕的电竞品牌常两个都拿：.gg 做社区与短链，.games 做内容站。",
      pickA: ["游戏工作室官网与作品集", "游戏媒体与社区内容站", "预算敏感（续费便宜数倍）", "词根想用 pixel/quest 类完整单词"],
      pickB: ["电竞战队与赛事品牌", "直播、对战与玩家社区工具", "想要圈内身份信号（good game）", "两字符短域名与短链场景"],
    },
    en: {
      title: ".games vs .gg: Full-Word Clarity or Esports Slang",
      metaDescription:
        ".games spells out the industry at friendly prices; .gg is esports slang for good game with pricier renewals. Compare vibe, pricing and inventory, then hunt names available on both.",
      verdict:
        "Both are gaming suffixes with completely different vibes. .games is fully literal — studio sites, indie portfolios and gaming media read instantly, at roughly $15–20 first year and $20–25 renewal, the best-value semantic TLD in gaming. .gg is Guernsey's ccTLD adopted by esports as \"good game\" slang: teams, streaming tools and matchmaking platforms wear it as an insider badge, and Discord's discord.gg invite links welded it into player culture. The cost: registration and renewal typically run $60–80, and good words on a two-character suffix are scarce. The test: for player communities, esports and streaming where insider identity matters, .gg earns its premium; for studio sites, portfolios and media — industry content — .games is far cheaper with much freer root choice. Well-funded esports brands often take both: .gg for community and short links, .games for the content site.",
      pickA: ["Game studio sites & portfolios", "Gaming media & community content", "Budget-sensitive (renewals several times cheaper)", "Want full-word roots like pixel/quest"],
      pickB: ["Esports teams & tournament brands", "Streaming, matchmaking & player-community tools", "Insider identity signal (good game)", "Two-character short domains & link use"],
    },
  },
  "email-vs-net": {
    slug: "email-vs-net",
    a: "email",
    b: "net",
    zh: {
      title: ".email 和 .net 怎么选：品类精准与老牌通用的取舍",
      metaDescription: ".email 把邮件品类写在门牌上，.net 是老牌通用技术后缀。对比两者的语义宽窄、价格与转型空间，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "这是语义宽窄的选择。.email 品类锁定极强——邮件 API、营销自动化、newsletter 平台、送达率工具用 send.email、inbox.email 这样的域名，产品说明写在门牌上，开发者与 SaaS 圈接受度不错；代价是窄：业务一旦超出邮件范畴，域名立刻变成束缚。.net 与互联网同龄，语义宽到几乎不设限——网络服务、云、基础设施都装得下，用户认知成熟，价格与 .com 接近且续费稳定（百元上下）；代价是「泛」：它不会帮你说明产品是做什么的，且经典短词早被抢空。价格结构上 .email 首年二三十元促销、续费一百多元，与 .net 长期成本接近，差别不在钱在语义。判断标准：产品核心确定长期围绕邮件（邮件 API、newsletter、反垃圾）→ .email 的品类信号是免费广告；产品是更宽的通讯/网络服务，或未来可能扩展 → .net 留足余地。注意 .email 词根别再含 mail，避免 sendmail.email 式冗余。",
      pickA: ["邮件 API 与邮件基础设施", "邮件营销与自动化工具", "Newsletter 平台与送达率服务", "想要 send.email 式功能说明域名"],
      pickB: ["泛通讯/网络/云服务", "业务未来可能扩展出邮件范畴", "偏好用户认知成熟的老牌后缀", "续费稳定、转售流动性更好"],
    },
    en: {
      title: ".email vs .net: Category Precision or Veteran Generality",
      metaDescription:
        ".email puts the category on the door; .net is the veteran general-purpose tech suffix. Compare semantic width, pricing and pivot room, then hunt names available on both.",
      verdict:
        "This is a choice about semantic width. .email locks the category hard: email APIs, marketing automation, newsletter platforms and deliverability tools on send.email or inbox.email carry their product description in the address, with solid developer and SaaS acceptance. The cost is narrowness — outgrow email and the domain becomes a constraint. .net is as old as the internet and nearly unlimited in scope — network services, cloud and infrastructure all fit — with mature user recognition and .com-like stable pricing (around $12–15). The cost is vagueness: it explains nothing about your product, and classic short words are long gone. Long-term costs are similar (.email runs cheap promos then ~$20 renewals), so the decision is semantics, not money. The test: if email is the confirmed long-term core (email API, newsletter, anti-spam) → .email's category signal is free advertising; if you're a broader communications or network product, or might expand → .net leaves room. And keep \"mail\" out of the .email root to avoid sendmail.email redundancy.",
      pickA: ["Email APIs & email infrastructure", "Email marketing & automation tools", "Newsletter platforms & deliverability services", "Feature-statement domains (send.email style)"],
      pickB: ["Broader communications/network/cloud services", "Business may expand beyond email", "Prefer a veteran suffix users already trust", "Stable renewals & better resale liquidity"],
    },
  },
  "network-vs-tech": {
    slug: "network-vs-tech",
    a: "network",
    b: "tech",
    zh: {
      title: ".network 和 .tech 怎么选：协议叙事与泛科技的对比",
      metaDescription: ".network 契合基础设施与协议叙事，.tech 覆盖全科技赛道。对比两者的语义、长度、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两个都是技术后缀，讲的故事不同。.network 是一句完整的定位——mesh.network、relay.network 读出来就是产品说明，CDN、VPN、节点服务天然契合，区块链圈更是把它当主流选择（「协议即网络」的叙事完美对齐），行业社群与播客联盟也用得顺手。.tech 覆盖整个科技赛道——硬件、SaaS、机器人、AI 都装得下，词根不用解释行业属性，转型也不用改名，科技园区与黑客松尤其偏爱。长度是显性差异：.network 7 字符偏长，词根必须控制在短词；.tech 4 字符轻快得多。价格结构相似——两者首年都有十几二十元促销，续费都在一两百元档（.tech 略高），差别不在钱。库存都远好于 .com/.net，.network 下连 .net 绝迹的短词都常有货。判断标准：产品本质是「一张网」（基础设施、协议、节点、社群网络）→ .network 的叙事契合度无可替代；产品是泛科技公司或方向未定 → .tech 更宽、更短、更留余地。",
      pickA: ["网络基础设施（CDN/VPN/节点）", "区块链协议与公链官网", "行业社群与人脉网络", "想要 mesh.network 式定位域名"],
      pickB: ["泛科技公司（硬件/SaaS/机器人）", "方向可能演进、不想绑死叙事", "想要更短的后缀（4 字符 vs 7 字符）", "科技园区、黑客松与开发者社区"],
    },
    en: {
      title: ".network vs .tech: Protocol Narrative or Broad-Tech Flexibility",
      metaDescription:
        ".network fits infrastructure and protocol narratives; .tech spans the whole technology space. Compare semantics, length, pricing and fit, then hunt names available on both.",
      verdict:
        "Both are technical suffixes telling different stories. .network is a complete positioning statement — mesh.network or relay.network reads as a product description. CDNs, VPNs and node services fit naturally, crypto made it a mainstream choice (\"the protocol is the network\" aligns perfectly), and professional communities and podcast collectives wear it well too. .tech spans the entire technology space — hardware, SaaS, robotics and AI all fit — so the root needs no industry explanation and pivots need no rename; tech parks and hackathons especially favor it. Length is the visible difference: .network's seven characters demand a short root, while .tech's four keep things nimble. Pricing is similar — both run cheap first-year promos with renewals in the $20–30 range (.tech slightly higher) — so money isn't the deciding factor. Inventory on both far exceeds .com/.net, and .network often stocks short words extinct on .net. The test: if your product is fundamentally a network (infrastructure, protocols, nodes, community networks) → .network's narrative fit is unmatched; if you're a broad tech company or the direction may shift → .tech is wider, shorter and safer.",
      pickA: ["Network infrastructure (CDN/VPN/nodes)", "Blockchain protocols & chain sites", "Professional communities & people networks", "Positioning domains (mesh.network style)"],
      pickB: ["Broad tech companies (hardware/SaaS/robotics)", "Direction may evolve — don't lock the narrative", "Want a shorter suffix (4 chars vs 7)", "Tech parks, hackathons & developer communities"],
    },
  },
  "life-vs-live": {
    slug: "life-vs-live",
    a: "life",
    b: "live",
    zh: {
      title: ".life 和 .live 怎么选：生活方式与实时现场的分野",
      metaDescription: ".life 语义温暖、面向生活方式与健康品牌，.live 主打直播与实时现场。对比两者的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "只差一个字母，讲的却是两种完全不同的故事。.life 是「过好日子」——健康管理、生活方式品牌、家庭服务、心理成长，「品牌 + .life」读起来像一句承诺，生活方式博主用它比 .com 更有温度；.live 是「正在发生」——直播频道、线上活动、演出赛事、实时看板，「名字 + .live」自带「点进来看现场」的号召力。价格结构几乎相同：两者都是 Identity Digital 系新后缀，首年一二十元促销、续费两百元档，成本不构成决策因素。库存都好，常见生活词与动词短语大多可注册。判断标准很简单：内容是「陪你长期过日子」的（健康、习惯、家庭）→ .life；内容是「此刻正在发生」的（直播、活动、实时数据）→ .live。用反了会造成预期错位——直播站挂 .life 显得安静，冥想应用挂 .live 显得吵闹。",
      pickA: ["健康、生活方式与个人成长品牌", "家庭服务、保险与养老业务", "生活方式博客与 vlog 站点", "品牌名以 life 结尾的自然拆分"],
      pickB: ["直播频道与主播个人站", "线上活动、发布会与赛事页", "实时数据看板与状态页", "主站 .com + 直播页同名 .live 的分工"],
    },
    en: {
      title: ".life vs .live: Lifestyle Brand or Real-Time Broadcast",
      metaDescription:
        ".life reads warm and fits lifestyle and wellness brands; .live signals streaming and real-time events. Compare semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "One letter apart, two entirely different stories. .life says \"living well\" — wellness products, lifestyle brands, family services and personal growth all read like a promise as brand.life, and lifestyle bloggers often find it warmer than .com. .live says \"happening now\" — streaming channels, online events, shows and real-time dashboards, where name.live carries a built-in call to tune in. Pricing is nearly identical: both are Identity Digital-family suffixes with cheap first-year promos and renewals around $25–30, so cost won't decide this. Inventory is good on both, with common lifestyle words and verb phrases widely available. The test is simple: content that accompanies daily life long-term (health, habits, family) → .life; content that is happening right now (streams, events, live data) → .live. Swap them and expectations break — a streaming site on .life feels quiet, a meditation app on .live feels loud.",
      pickA: ["Wellness, lifestyle & personal-growth brands", "Family services, insurance & senior care", "Lifestyle blogs and vlog sites", "Natural splits when the brand ends in life"],
      pickB: ["Streaming channels & creator live pages", "Online events, launches & tournaments", "Real-time dashboards & status pages", ".com main site + matching .live stream page"],
    },
  },
  "email-vs-cloud": {
    slug: "email-vs-cloud",
    a: "email",
    b: "cloud",
    zh: {
      title: ".email 和 .cloud 怎么选：通信工具与云平台的定位对比",
      metaDescription: ".email 是邮件与通信产品的品类后缀，.cloud 覆盖云服务与 SaaS 全赛道。对比两者的语义宽窄、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两个都是「功能写进后缀」的品类域名，宽窄差一个量级。.email 语义极窄也极准：邮件客户端、邮件营销、收发件基础设施、临时邮箱工具，「产品名.email」本身就是一句产品说明，甚至能直接当品牌用（如 hey.email 式的定位）；窄的代价是转型受限——产品一旦超出邮件范畴，后缀就成了包袱。.cloud 宽得多：云主机、SaaS、托管平台、DevOps 工具都装得下，面向企业客户比 .io 更正式，还常被用作客户实例域名（客户名.产品.cloud）扩展性好。价格上两者都是中等价位的新后缀，首年促销常见、续费一两百元档，差异不大。库存都充足，主流功能词基本可注册。判断标准：产品此生只做邮件/通信 → .email 的精准无可替代；产品是云服务或未来可能长出多条产品线 → .cloud 留足余地。",
      pickA: ["邮件客户端与收发件工具", "邮件营销与送达率服务", "临时邮箱、别名与隐私转发", "「名字.email」直接当产品定位"],
      pickB: ["云主机、托管与部署平台", "面向企业客户的 SaaS", "DevOps 与基础设施工具", "需要客户实例子域的多租户产品"],
    },
    en: {
      title: ".email vs .cloud: Messaging Niche or Cloud-Platform Breadth",
      metaDescription:
        ".email is the category suffix for mail and messaging products; .cloud spans hosting, SaaS and DevOps. Compare semantic breadth, pricing and fit, then hunt names available on both.",
      verdict:
        "Both put the function in the suffix; the difference is breadth. .email is razor-narrow and razor-accurate: mail clients, email marketing, deliverability infrastructure and disposable-inbox tools all read as product statements at name.email — the suffix can even carry the positioning by itself. The cost of that precision is lock-in: outgrow email and the suffix becomes baggage. .cloud is an order of magnitude wider — hosting, SaaS, deployment platforms and DevOps tools all fit, it reads more enterprise-appropriate than .io, and it scales into per-customer instance domains (customer.product.cloud). Pricing is comparable: mid-priced new suffixes with frequent first-year promos and renewals around $20–30. Inventory is healthy on both, with mainstream functional words still available. The test: if the product will always be about mail and messaging → .email's precision is unbeatable; if it's a cloud service or may grow product lines → .cloud leaves room to expand.",
      pickA: ["Mail clients & inbox tools", "Email marketing & deliverability services", "Disposable inboxes, aliases & privacy relays", "Positioning domains (name.email style)"],
      pickB: ["Hosting, deployment & managed platforms", "Enterprise-facing SaaS", "DevOps & infrastructure tooling", "Multi-tenant products needing instance subdomains"],
    },
  },
  "dev-vs-tech": {
    slug: "dev-vs-tech",
    a: "dev",
    b: "tech",
    zh: {
      title: ".dev 和 .tech 怎么选：开发者身份与泛科技声明的对比",
      metaDescription: ".dev 由 Google 运营、强制 HTTPS，是开发者产品标配；.tech 把「科技」写进后缀、覆盖全赛道。对比两者的受众、价格与适用场景，并用 AI 猎取可注册的名字。",
      verdict:
        "都是技术后缀，说话的对象不同。.dev 对开发者说话：由 Google 运营、全后缀强制 HTTPS（HSTS 预加载），开发工具、SDK、技术博客、个人作品集用它就是圈内身份证，web.dev、Google 自家大量使用更给足了背书；但对非技术人群，「dev」三个字母未必可读。.tech 对所有人说话：硬件公司、机器人团队、科技媒体、黑客松官网用 name.tech，访客不需要任何解释——CES 官网 ces.tech 就是明证。价格上 .dev 注册续费百元上下、结构稳定；.tech 首年促销极低但续费明显上浮，长期持有要按续费算账。库存两者都远好于 .com，.tech 因为更长更宽，双词组合几乎随便挑。判断标准：产品的用户会打开终端 → .dev 的圈内信号更准；用户是投资人、媒体与大众 → .tech 的行业声明更响。",
      pickA: ["开发工具、SDK 与 API 文档站", "个人技术博客与作品集", "开源项目官网", "在意 HTTPS 强制与 Google 背书"],
      pickB: ["硬科技、硬件与机器人公司", "科技媒体、园区与黑客松", "面向大众/投资人的科技品牌", "想要双词组合的充足库存"],
    },
    en: {
      title: ".dev vs .tech: Developer Badge or Broad Tech Statement",
      metaDescription:
        ".dev is Google-run, HTTPS-enforced and the developer default; .tech writes the industry into the suffix for everyone. Compare audiences, pricing and fit, then hunt names available on both.",
      verdict:
        "Both are technical suffixes speaking to different rooms. .dev speaks to developers: run by Google with HTTPS enforced across the zone (HSTS preload), it's the insider badge for dev tools, SDKs, technical blogs and portfolios — web.dev and Google's own heavy use supply the credibility. To non-technical audiences, though, \"dev\" may not even parse. .tech speaks to everyone: hardware companies, robotics teams, tech media and hackathons need no explanation at name.tech — CES runs on ces.tech. On price, .dev sits stable around $12–15 for both registration and renewal; .tech runs deep first-year promos with noticeably higher renewals, so long-term holders should budget on the renewal price. Inventory on both far exceeds .com, and .tech's breadth means two-word combos are practically free pickings. The test: if your users open a terminal → .dev's insider signal is sharper; if your audience is investors, press and the public → .tech's industry statement carries further.",
      pickA: ["Dev tools, SDKs & API doc sites", "Personal technical blogs & portfolios", "Open-source project homes", "Value enforced HTTPS & Google stewardship"],
      pickB: ["Hard-tech, hardware & robotics companies", "Tech media, parks & hackathons", "Tech brands facing investors & the public", "Abundant two-word combo inventory"],
    },
  },
  "app-vs-io": {
    slug: "app-vs-io",
    a: "app",
    b: "io",
    zh: {
      title: ".app 和 .io 怎么选：应用产品与技术圈层的取舍",
      metaDescription: ".app 语义零解释成本、强制 HTTPS，.io 是开发者圈的经典身份标签但续费更贵。对比两者的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "看产品形态和说话对象。.app 的语义零解释成本：用户看到 name.app 就知道这是个应用，App 下载落地页、Web App、小工具官网用它顺理成章，Google 运营加全后缀强制 HTTPS 也让它天生「正经」；面向大众用户的应用，.app 比 .io 可读得多。.io 则是技术圈层的身份标签：开发工具、API、SaaS、开源项目用 .io 是 GitHub 生态的默认审美，还能玩 domain hack（socket.io），但对圈外用户它只是两个陌生字母。价格差异明显：.app 注册续费百元上下、结构稳定；.io 注册与续费都是数倍于此，长期成本要算清。库存两者都不错，.app 的干净产品词略多。判断标准：产品「是一个应用」且用户是大众 → .app 的直白无可替代；产品是开发者工具或技术平台 → .io 的圈内信号更值钱。注意 .app 会把品牌绑定在「应用」形态上，业务超出应用范畴（内容、电商）就不合适了。",
      pickA: ["移动/Web 应用与下载落地页", "面向大众用户的工具产品", "在意强制 HTTPS 的安全背书", "预算敏感、在意续费成本"],
      pickB: ["开发者工具、API 与 SaaS", "开源项目与技术社区", "想玩 domain hack 的短名字", "业务形态可能超出「应用」范畴"],
    },
    en: {
      title: ".app vs .io: Product Clarity or Developer Cachet",
      metaDescription:
        ".app needs zero explanation and enforces HTTPS; .io is the developer scene's classic badge at a higher renewal. Compare semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "It depends on what the product is and who you're talking to. .app explains itself: users see name.app and know it's an application, so download landing pages, web apps and utility tools wear it naturally — Google's stewardship and zone-wide enforced HTTPS add built-in seriousness. For mainstream users, .app reads far better than .io. .io is the tech scene's badge: dev tools, APIs, SaaS and open source live on .io as the GitHub-era default, with domain hacks (socket.io) as a bonus — but to outsiders it's just two odd letters. Pricing splits clearly: .app sits stable around $15–20 while .io costs several times more for both registration and renewal, so long-term budgets matter. Inventory is decent on both, with .app slightly richer in clean product words. The test: if the product is an app for a general audience → .app's clarity is unbeatable; if it's a developer tool or platform → .io's insider signal is worth the premium. One caveat: .app locks the brand to the app form factor — content or commerce businesses shouldn't wear it.",
      pickA: ["Mobile/web apps & download landing pages", "Consumer-facing utility products", "Value enforced-HTTPS security posture", "Renewal-budget sensitive"],
      pickB: ["Developer tools, APIs & SaaS", "Open source & technical communities", "Short names with domain-hack potential", "Business may outgrow the app form factor"],
    },
  },
  "info-vs-net": {
    slug: "info-vs-net",
    a: "info",
    b: "net",
    zh: {
      title: ".info 和 .net 怎么选：信息站与技术备选的老牌对决",
      metaDescription: ".info 是最早的信息类后缀、首年极便宜，.net 是仅次于 .com 的老牌通用域。对比两者的信任度、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两个都是二十年以上的老后缀，气质和价格结构完全不同。.info 语义就是「信息」：资料站、行业百科、文档站、活动信息页用它顺理成章，首年常年一两美元，做内容矩阵的成本几乎可以忽略；短板是历史上被垃圾站大量使用，直接做商业主站信任感偏弱，且续费比首年高出一个量级。.net 是 .com 之外资历最老的通用域：价格稳定（注册续费都百元上下）、无信任折扣，网络服务、云工具、API 平台用它名正言顺，也常被当作 .com 被注册后的第一备选——前提是品牌词足够独特。库存 .info 明显更好，几乎任何词都能注册到。判断标准：站点是「查资料」性质的（百科、文档、指南）或低成本验证内容项目 → .info 的性价比无敌；站点是长期经营的产品或服务 → .net 的稳定信任更值得，尤其技术产品。",
      pickA: ["资料站、百科与文档站", "活动/项目信息页", "低成本验证的内容 side project", "内容矩阵与主品牌的信息子站"],
      pickB: ["长期经营的技术产品与服务", "网络服务、云与 API 平台", "品牌词独特、.com 被注册的备选", "在意稳定续费与无信任折扣"],
    },
    en: {
      title: ".info vs .net: Information Hub or Legacy Workhorse",
      metaDescription:
        ".info is the original information suffix with rock-bottom first-year pricing; .net is the oldest generic after .com. Compare trust, pricing and fit, then hunt names available on both.",
      verdict:
        "Both are twenty-plus-year-old suffixes with opposite personalities and price curves. .info means exactly what it says: reference sites, industry wikis, documentation hubs and event-info pages wear it naturally, and first-year pricing sits at a dollar or two — content networks cost almost nothing to spin up. The catch: heavy historical spam use gives it a trust discount for commercial main sites, and renewals jump an order of magnitude above year one. .net is the senior generic after .com: stable pricing (registration and renewal both around $12–15), no trust discount, and a natural home for network services, cloud tools and API platforms — plus the classic .com fallback when your brand word is distinctive. Inventory clearly favors .info, where almost any word is still available. The test: a look-it-up destination (wiki, docs, guides) or a cheap content experiment → .info's value is unbeatable; a long-lived product or service, especially technical → .net's steady trust earns the difference.",
      pickA: ["Reference sites, wikis & documentation", "Event & project information pages", "Low-cost content side projects", "Info satellites around a main brand"],
      pickB: ["Long-lived technical products & services", "Network, cloud & API platforms", "Distinctive-word .com fallback", "Stable renewals with no trust discount"],
    },
  },
  "fun-vs-games": {
    slug: "fun-vs-games",
    a: "fun",
    b: "games",
    zh: {
      title: ".fun 和 .games 怎么选：泛娱乐与游戏垂直的定位对比",
      metaDescription: ".fun 语义宽泛、首年极便宜，适合一切娱乐场景；.games 是游戏行业的垂直声明。对比两者的语义宽窄、价格与适用场景，并用 AI 猎取可注册的名字。",
      verdict:
        "都是「玩」，宽窄不同。.fun 覆盖一切想让用户「玩起来」的场景：小游戏站、趣味测试、互动营销页、派对策划、玩具与亲子品牌，首年常年一两美元、库存极好，做 campaign 页和趣味副项目几乎零成本；代价是太便宜导致低质站多，品牌要靠内容撑住第一印象。.games 是游戏行业的垂直声明：游戏工作室、独立游戏官网、电竞战队、游戏媒体用 name.games，一眼就是「正经做游戏的」，行业内认知度高；价格结构上首年促销常见、续费一两百元档，比 .fun 的续费略高但差距不大。判断标准：业务核心是游戏本身（开发、发行、电竞、游戏媒体）→ .games 的垂直信号更专业；业务是泛娱乐或「游戏只是形式」（营销互动、趣味工具、活动）→ .fun 更宽、更便宜、更轻松。两个都不适合正经严肃的场景——金融、医疗别碰。",
      pickA: ["趣味测试与互动营销页", "派对、活动与玩具亲子品牌", "创意小工具与娱乐副项目", "预算极低的轻量娱乐站"],
      pickB: ["游戏工作室与独立游戏官网", "电竞战队与赛事", "游戏媒体与社区", "想要行业垂直信号的游戏品牌"],
    },
    en: {
      title: ".fun vs .games: Broad Playfulness or Gaming-Industry Signal",
      metaDescription:
        ".fun is broad, cheap and fits anything entertaining; .games is the gaming industry's vertical statement. Compare semantic breadth, pricing and fit, then hunt names available on both.",
      verdict:
        "Both say play; the difference is breadth. .fun covers anything meant to be enjoyed: casual game portals, quizzes, interactive marketing pages, party planning, toy and family brands — with first-year pricing at a dollar or two and excellent inventory, campaign pages and playful side projects cost almost nothing. The trade-off: rock-bottom pricing attracts low-quality sites, so your content must carry the first impression. .games is the gaming industry's vertical statement: studios, indie game sites, esports teams and gaming media read instantly serious-about-games at name.games, with strong recognition inside the industry. Its pricing runs cheap first-year promos with renewals around $20–30, slightly above .fun's but not decisively. The test: if games are the business itself (development, publishing, esports, media) → .games' vertical signal reads professional; if the business is broadly entertaining and play is just the medium (marketing, quizzes, events) → .fun is wider, cheaper and lighter. Neither suits serious verticals — keep finance and healthcare away from both.",
      pickA: ["Quizzes & interactive marketing pages", "Party, event, toy & family brands", "Creative toys & entertainment side projects", "Ultra-low-budget playful sites"],
      pickB: ["Game studios & indie game sites", "Esports teams & tournaments", "Gaming media & communities", "Gaming brands wanting the vertical signal"],
    },
  },
  "digital-vs-tech": {
    slug: "digital-vs-tech",
    a: "digital",
    b: "tech",
    zh: {
      title: ".digital 和 .tech 怎么选：数字服务与科技品牌的定位对比",
      metaDescription: ".digital 说的是「数字化业务」，.tech 说的是「科技本身」。对比两者的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两个后缀都很「现代」，但说的不是一回事。.digital 描述业务形态：数字化转型咨询、数字营销机构、数字产品工作室——「我们做的是数字化生意」，海外 digital agency 用 name.digital 当官网已是常态。.tech 描述行业属性：科技公司、硬件品牌、技术社区与黑客松——「我们是搞技术的」，语义更宽也更抽象。价格结构相似：都是首年低价促销、续费两百元档，长期成本按续费算。库存两边都充裕。判断标准：客户买的是「数字化服务」（营销、转型、数字内容）→ .digital 把业务写进域名；产品本身是技术或面向技术圈 → .tech 的行业信号更准。注意 .digital 后缀 7 字符明显偏长，词根要短；.tech 则要小心与 .io/.dev 的开发者气质区分——它更偏「泛科技」而非「写代码的」。",
      pickA: ["数字化转型与咨询服务", "数字营销与广告机构", "数字产品与内容工作室", "品牌名含 digital 的自然拆分"],
      pickB: ["泛科技公司与硬件品牌", "技术社区、大会与黑客松", "科技媒体与内容站", "词根较长、需要短后缀平衡"],
    },
    en: {
      title: ".digital vs .tech: Digital Services or Tech Identity",
      metaDescription:
        ".digital describes a digital-services business; .tech claims the technology industry itself. Compare semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both suffixes read modern, but they say different things. .digital describes what the business does: digital-transformation consulting, marketing agencies, digital product studios — 'we run a digital business', and agencies abroad routinely run their site on name.digital. .tech describes what the business is: tech companies, hardware brands, technical communities and hackathons — 'we are technology people', a broader and more abstract claim. Pricing follows the same curve on both: cheap promo first years with renewals in the $30–40 range, so budget on renewals. Inventory is generous on both sides. The test: if clients buy digital services (marketing, transformation, content) → .digital writes the offering into the address; if the product is technology itself or targets the tech crowd → .tech sends the sharper industry signal. Two cautions: .digital is a long seven-character suffix, so keep roots short; and .tech reads 'general technology' rather than 'developer' — for developer tools, .io or .dev still carry more insider weight.",
      pickA: ["Digital transformation & consulting firms", "Digital marketing & ad agencies", "Digital product & content studios", "Brands containing the word 'digital'"],
      pickB: ["General tech companies & hardware brands", "Tech communities, conferences & hackathons", "Tech media & content sites", "Longer roots that need a short suffix"],
    },
  },
  "media-vs-studio": {
    slug: "media-vs-studio",
    a: "media",
    b: "studio",
    zh: {
      title: ".media 和 .studio 怎么选：内容公司与创作工作室的对比",
      metaDescription: ".media 是内容行业的公司级后缀，.studio 是创作团队的工坊招牌。对比两者的语感、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都在内容创意圈，规模感不同。.media 读起来是「一家媒体公司」：播客网络、视频厂牌、新媒体矩阵、内容营销公司，name.media 就是公司全称，气质偏机构与发行方。.studio 读起来是「一间工作室」：设计工作室、动画与游戏团队、摄影棚、独立创作者，name.studio 像挂在门口的工坊招牌，气质偏创作与手艺。价格上 .studio 首年促销常见、续费两百元上下，.media 略贵一档，两者差距不大。库存两边都好，风格词与题材词大多可注册。判断标准：业务核心是「做内容并分发」（节目、频道、媒体矩阵）→ .media 的发行方气质更对；业务核心是「接案创作与交付作品」（设计、动画、影像制作）→ .studio 的工坊感更亲切。同一团队两条业务线并行时，也常见 name.studio 做作品集、name.media 做内容厂牌的分工。",
      pickA: ["播客网络与视频厂牌", "新媒体公司与内容矩阵", "内容营销与发行机构", "品牌名以 media 结尾的拆分"],
      pickB: ["设计与动画工作室", "摄影、影像与制作团队", "独立创作者与小团队作品集", "强调手艺与创作气质的品牌"],
    },
    en: {
      title: ".media vs .studio: Content Company or Creative Workshop",
      metaDescription:
        ".media reads like a content company; .studio reads like a creative workshop's signboard. Compare vibe, pricing and fit, then hunt names available on both.",
      verdict:
        "Both live in the content and creative world; the difference is scale and posture. .media reads institutional: podcast networks, video labels, new-media portfolios and content-marketing firms — name.media sounds like the full company name, with a publisher's air. .studio reads artisanal: design studios, animation and game teams, photo studios and independent creators — name.studio hangs like a workshop sign on the door, all craft and making. On price, .studio runs frequent first-year promos with renewals around $25–30, while .media sits one notch higher; the gap is small. Inventory is good on both, with style and topic words widely available. The test: if the core business is producing and distributing content (shows, channels, media brands) → .media's publisher posture fits; if it's client work and crafted deliverables (design, animation, film production) → .studio's workshop warmth wins. Teams running both lines often split them: name.studio for the portfolio, name.media for the content label.",
      pickA: ["Podcast networks & video labels", "New-media companies & content portfolios", "Content marketing & distribution firms", "Brands ending in 'media'"],
      pickB: ["Design & animation studios", "Photo, film & production teams", "Indie creators & small-team portfolios", "Brands built on craft and making"],
    },
  },
  "group-vs-agency": {
    slug: "group-vs-agency",
    a: "group",
    b: "agency",
    zh: {
      title: ".group 和 .agency 怎么选：集团母牌与服务机构的对比",
      metaDescription: ".group 是集团与多品牌母公司的后缀，.agency 是服务机构的行业声明。对比两者的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "一个说「我们是谁」，一个说「我们干什么」。.group 是组织形态的声明：集团公司、控股平台、家族企业、多品牌矩阵的母品牌，name.group 读出来就是「某某集团」，旗下品牌再各持独立域名——它回答的是结构问题。.agency 是业务形态的声明：广告、公关、设计、招聘、营销机构，name.agency 一眼说明「我们是接案服务方」——它回答的是生意问题。价格上两者都属新顶级域友好档：.group 续费一百多元且价差小、适合长期持有，.agency 首年促销多、续费两百元上下。库存两边都好，姓氏与行业词大多可注册。判断标准：实体是控股/母公司、需要一个品牌枢纽 → .group；实体靠承接客户项目吃饭、要在域名里完成自我介绍 → .agency。注意组合陷阱：服务机构用 .group 会显得像控股集团，反而模糊定位；集团母牌用 .agency 则直接错位。",
      pickA: ["集团与控股公司官网", "多品牌矩阵的母品牌枢纽", "家族企业与投资集团", "长期持有、在意续费稳定"],
      pickB: ["广告、公关与营销机构", "设计与创意服务公司", "招聘与人才服务机构", "想在域名里说清「服务方」身份"],
    },
    en: {
      title: ".group vs .agency: Corporate Parent or Service Shop",
      metaDescription:
        ".group declares corporate structure; .agency declares a client-services business. Compare semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "One says who we are, the other says what we do. .group declares structure: holding companies, conglomerates, family businesses and the parent of a multi-brand portfolio — name.group literally reads 'the X Group', with subsidiaries keeping their own domains. .agency declares the business model: advertising, PR, design, recruiting and marketing shops — name.agency introduces you as the client-services firm at a glance. Both price in the friendly new-gTLD tier: .group renews under $20 with a small promo gap, ideal for long holds, while .agency runs cheap first-year promos with renewals around $25–30. Inventory is strong on both — surnames and industry words are widely available. The test: a holding entity or brand hub → .group; a firm that lives on client work and wants the domain to do the introduction → .agency. Mind the mismatch trap: a services shop on .group reads like a holding company and blurs its pitch, while a corporate parent on .agency is simply miscast.",
      pickA: ["Holding & group company websites", "Parent-brand hubs of multi-brand portfolios", "Family businesses & investment groups", "Long-term holds valuing stable renewals"],
      pickB: ["Advertising, PR & marketing agencies", "Design & creative service firms", "Recruiting & talent agencies", "Domains that introduce a services firm"],
    },
  },
  "center-vs-club": {
    slug: "center-vs-club",
    a: "center",
    b: "club",
    zh: {
      title: ".center 和 .club 怎么选：服务枢纽与会员社群的对比",
      metaDescription: ".center 语义是「中心/枢纽」，.club 语义是「会员与归属」。对比两者的语感、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "问一个问题：用户来这里是「办事/获取资源」还是「加入圈子」？.center 是场所与枢纽的语义：帮助中心、培训与考试中心、健身与医疗中心、资源下载站，业务形态叫「某某中心」的，后缀直接完成命名；开发者还能把支持站放在 help.center、docs.center 这类分工明确的域名上。.club 是归属感的语义：兴趣社群、付费会员、粉丝组织、俱乐部品牌，name.club 天然带「加入我们」的号召。价格都在亲民档：两者首年都常见十几二十元促销，.club 续费略低一档。库存两边都极好。判断标准：提供服务与资源、用户「来了就走」→ .center 的枢纽感更专业；经营会员关系、用户「留下来玩」→ .club 的社群感更贴。注意各自短板：.center 有 center/centre 拼写分歧，面向英联邦用户要防御注册；.club 搭配某些词会有夜店联想，正式机构慎用。",
      pickA: ["帮助中心与文档支持站", "培训、考试与服务中心", "健身、医疗等实体中心", "资源聚合与下载枢纽"],
      pickB: ["兴趣社群与粉丝组织", "付费会员与订阅制社区", "俱乐部与圈子品牌", "运营「归属感」的产品"],
    },
    en: {
      title: ".center vs .club: Service Hub or Member Community",
      metaDescription:
        ".center means a hub people visit for services; .club means belonging and membership. Compare vibe, pricing and fit, then hunt names available on both.",
      verdict:
        "Ask one question: do users come to get something done, or to belong? .center is the semantics of place and hub: help centers, training and testing centers, fitness and medical centers, resource and download hubs — if the business is called 'the X Center', the suffix finishes the name, and developers get literal domains like help.center or docs.center for support sites. .club is the semantics of belonging: interest communities, paid memberships, fan organizations and club brands — name.club carries a built-in 'join us'. Both price in the budget tier with promo first years of a few dollars; .club renews slightly cheaper. Inventory is excellent on both. The test: serving visitors who arrive, get value and leave → .center's hub posture reads professional; cultivating members who stay and participate → .club's community warmth fits. Mind each one's catch: .center has the center/centre spelling split for Commonwealth audiences (register defensively), and .club can carry nightlife connotations with certain words — formal institutions should check the pairing.",
      pickA: ["Help centers & documentation sites", "Training, testing & service centers", "Fitness, medical & physical centers", "Resource aggregation & download hubs"],
      pickB: ["Interest communities & fan organizations", "Paid memberships & subscription communities", "Club and circle brands", "Products built on belonging"],
    },
  },
  "works-vs-studio": {
    slug: "works-vs-studio",
    a: "works",
    b: "studio",
    zh: {
      title: ".works 和 .studio 怎么选：工坊双关与创作招牌的对比",
      metaDescription: ".works 双关「作品」与「能用」，.studio 是创作团队的经典招牌。对比两者的语感、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两个都是「做东西的人」的后缀，气质一实一雅。.works 自带双关：既是传统的「工坊/作品」（iron works、design works），也是口语的「it works（能用）」——这让它对工具型产品格外友好，flow.works、ship.works 读出来就是「这东西真的能用」的口播广告；工程、制造、自动化品牌用它同样名正言顺。.studio 则是创意行业的经典招牌：设计、动画、摄影、游戏工作室，name.studio 优雅、安静、有作品感。价格结构接近：都是首年促销、续费两百元上下档。库存两边都好，动词与工艺词大多可注册。判断标准：品牌想强调「可靠、能跑、出活」——开发者工具、自动化、工程制造 → .works 的实干双关更值钱；品牌想强调「审美、创作、作品集」——设计与影像团队 → .studio 的气质更对。同名两个都能注册时，工具产品选 .works、创意团队选 .studio，几乎不会错。",
      pickA: ["开发者工具与自动化产品", "工程、制造与硬件品牌", "手作工坊与「能用」叙事的产品", "想把口碑写进域名的工具"],
      pickB: ["设计与动画工作室", "摄影与影像创作团队", "个人与团队作品集", "审美驱动的创意品牌"],
    },
    en: {
      title: ".works vs .studio: It-Works Pun or Creative Signboard",
      metaDescription:
        ".works puns on craftsmanship and 'it works'; .studio is the creative team's classic signboard. Compare vibe, pricing and fit, then hunt names available on both.",
      verdict:
        "Both belong to people who make things; one reads hands-on, the other refined. .works carries a built-in double meaning: the traditional works of craftsmanship (iron works, design works) and the colloquial 'it works' — which makes it unusually good for tools, where flow.works or ship.works doubles as a spoken slogan that the thing actually runs; engineering, manufacturing and automation brands wear it just as naturally. .studio is the creative industry's classic signboard: design, animation, photography and game studios read quiet, elegant and portfolio-ready on name.studio. Pricing curves are similar — promo first years with renewals in the $25–35 range — and inventory is strong on both, with verbs and craft words widely available. The test: a brand staking itself on reliability and output (developer tools, automation, engineering) → .works' pragmatic pun earns its keep; a brand staking itself on aesthetics and craft (design and film teams) → .studio's posture fits. When the same name is free on both, tools take .works and creative teams take .studio — that split rarely misses.",
      pickA: ["Developer tools & automation products", "Engineering, manufacturing & hardware brands", "Workshops with an 'it works' story", "Tools that want the slogan in the domain"],
      pickB: ["Design & animation studios", "Photography & film teams", "Personal and team portfolios", "Aesthetics-driven creative brands"],
    },
  },
  "zone-vs-site": {
    slug: "zone-vs-site",
    a: "zone",
    b: "site",
    zh: {
      title: ".zone 和 .site 怎么选：主题地带与通用建站的对比",
      metaDescription: ".zone 语义是「专区/地带」、自带氛围感，.site 是最中性的通用建站后缀。对比两者的语义强弱、价格与适用场景，并用 AI 猎取可注册的名字。",
      verdict:
        "一个有性格，一个求百搭。.zone 语义鲜明：「某某地带/专区」——游戏社区、粉丝站、主题内容站、开发者沙盒用它自带氛围感，fan.zone、war.zone 读出来就是「入场」的感觉；技术圈还有 DNS zone 文件的梗加成（dns.zone、edge.zone）。.site 则是最中性的「网站」后缀：任何类型的站点都不违和，也不加分——它的价值在于价格与命中率，几乎任何词根都能注册到，首年常年一两美元。续费上两者都要按两百元上下核算（.site 价差尤其大，首年便宜别当长期成本）。判断标准：站点有明确的「圈子/主题/领地」属性——社区、粉丝站、游戏、沙盒 → .zone 的氛围感是免费的品牌资产；站点只是「需要一个网址」——落地页、临时项目、通用官网 → .site 的中性与低价更务实。注意 .zone 对正式企业官网偏随意，.site 则要靠内容自证质量——两者都不是大众市场的信任型后缀。",
      pickA: ["游戏社区与竞技站", "粉丝专区与主题内容站", "开发者沙盒与试验场", "想要「领地感」的圈子品牌"],
      pickB: ["快速上线的落地页", "临时活动与 campaign 站", "通用官网与个人主页", "预算极低、追求命中率"],
    },
    en: {
      title: ".zone vs .site: Themed Territory or Neutral Website",
      metaDescription:
        ".zone names a themed territory with built-in atmosphere; .site is the most neutral website suffix. Compare semantic strength, pricing and fit, then hunt available names.",
      verdict:
        "One has personality, the other aims for universal fit. .zone is vivid: topic + .zone literally names a territory — gaming communities, fan sites, themed hubs and developer sandboxes get free atmosphere (fan.zone, war.zone read like an entrance sign), plus the DNS zone-file pun lands with technical audiences (dns.zone, edge.zone). .site is the most neutral 'website' suffix: nothing clashes with it and nothing gains from it — its value is price and availability, with almost any root registrable and first years at a dollar or two. Renewals on both should be budgeted around $25–35 (.site's promo-to-renewal gap is especially steep — don't mistake year one for the long-term cost). The test: a site with a real circle, theme or territory — communities, fan zones, games, sandboxes → .zone's atmosphere is free brand equity; a site that just needs an address — landing pages, temporary projects, generic homepages → .site's neutrality and price are the pragmatic pick. Note that .zone reads casual for formal corporate sites, and .site must prove its quality through content — neither is a mainstream trust suffix.",
      pickA: ["Gaming communities & arenas", "Fan zones & themed content hubs", "Developer sandboxes & playgrounds", "Circle brands that want territory vibes"],
      pickB: ["Fast-launch landing pages", "Temporary campaigns & event sites", "Generic homepages & personal sites", "Ultra-low budgets chasing availability"],
    },
  },
  "site-vs-com": {
    slug: "site-vs-com",
    a: "site",
    b: "com",
    zh: {
      title: ".site 和 .com 怎么选：一美元起步与黄金标准的取舍",
      metaDescription: ".site 首年常见一两美元、几乎什么词都能注册到，.com 是无需解释的黄金标准。对比两者的信任度、续费成本与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "这是「起步成本」与「长期信任」的经典对决。.site 的优势全在入场端：首年常年一两美元，且因为库存深，几乎任何词根都能原样注册——同一份名单在 .site 下的命中率是 .com 的许多倍。但代价有两个：一是续费跳价明显（要按两百元上下核算，别被首年价格骗了），二是信任折扣——用户对陌生 .site 域名的第一反应偏谨慎，冷启动投放和邮件触达都要多花力气自证。.com 反过来：好名字几乎绝迹、要么加长要么加钱收购，但拿到之后就是零解释成本的资产，口播、名片、投资人邮件全都顺。判断标准：验证期项目、落地页、campaign 站——.site 的低成本试错完全合理；一旦确认要长期经营品牌，尽早把 .com 收下做主站，.site 可以留着做活动短链或 301。",
      pickA: ["快速验证的 MVP 与落地页", "临时活动与 campaign 站", "预算极低、追求注册命中率", "名单里的词根在 .com 全军覆没"],
      pickB: ["长期经营的品牌主站", "口头传播多的场景（广告、播客、销售）", "需要用户零犹豫信任（支付、注册转化）", "计划持有增值或转售"],
    },
    en: {
      title: ".site vs .com: One-Dollar Entry or the Gold Standard",
      metaDescription:
        ".site starts at a dollar or two with deep inventory; .com is the zero-explanation gold standard. Compare trust, renewal costs and fit, then hunt names available on both.",
      verdict:
        "This is the classic entry-cost versus long-term-trust trade. .site wins entirely at the door: first years run a dollar or two, and inventory is so deep that almost any root registers as-is — the same shortlist scores many times more hits on .site than on .com. The costs are twofold: renewals jump steeply (budget $25–35 and don't let year one fool you), and there's a trust discount — users approach an unfamiliar .site with mild caution, so cold ads and outreach emails work harder to prove legitimacy. .com is the inverse: good names are effectively gone — you lengthen the name or pay an aftermarket price — but once secured it's a zero-explanation asset that works in speech, on business cards and in investor emails. The test: validation-stage projects, landing pages and campaigns → .site's cheap iteration is entirely rational; the moment a brand is confirmed for the long haul, secure the .com as the primary site and keep .site for campaign short links or a 301.",
      pickA: ["MVPs and landing pages under validation", "Temporary campaigns and event sites", "Ultra-low budgets chasing availability", "Your whole shortlist is dead on .com"],
      pickB: ["Long-term primary brand site", "Heavy word-of-mouth channels (ads, podcasts, sales)", "Zero-hesitation trust (payments, signup conversion)", "Hold-and-appreciate or resale plans"],
    },
  },
  "tech-vs-com": {
    slug: "tech-vs-com",
    a: "tech",
    b: "com",
    zh: {
      title: ".tech 和 .com 怎么选：行业标签与万能默认的对比",
      metaDescription: ".tech 把「科技公司」写进后缀，.com 是所有行业的万能默认。对比两者的语义价值、价格与转化差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "问题不是「哪个更好」，而是「行业标签值不值得换掉万能默认」。.tech 的价值在语义：name.tech 一眼就是科技公司，黑客松、硬件创业、技术博客用它省一句自我介绍，而且短词库存远好于 .com——心仪的词大概率还能原样注册。短板同样明显：大众用户的地址栏肌肉记忆仍是 .com，口播场景要多说一句「点 tech」；续费也比 .com 贵（首年促销后回到百元以上量级）。.com 则没有语义加成但也没有解释成本，任何行业、任何受众都不违和。判断标准：受众是技术圈内（开发者、极客、行业媒体）且品牌词与科技强绑定 → .tech 的标签价值真实存在；受众是大众市场或企业采购 → .com 的默认信任更值钱。折中方案也常见：.tech 做产品/开发者站点，.com 留给公司主站。",
      pickA: ["科技创业公司与硬件品牌", "黑客松、技术大会与社区", "开发者与极客受众的产品", "心仪短词 .com 已被注册"],
      pickB: ["大众市场与企业客户", "口头传播多、怕拼错后缀", "多业务线的公司主站", "长期品牌资产与转售流动性"],
    },
    en: {
      title: ".tech vs .com: Industry Label or Universal Default",
      metaDescription:
        ".tech writes 'technology company' into the suffix; .com is every industry's default. Compare semantic value, pricing and conversion, then hunt names available on both.",
      verdict:
        "The question isn't which is better — it's whether an industry label is worth trading away the universal default. .tech's value is semantic: name.tech reads as a technology company at a glance, saving hackathons, hardware startups and engineering blogs a line of introduction, and short-word inventory is far better than .com — your favorite word is probably still registrable as-is. The weaknesses are equally clear: mainstream muscle memory still autocompletes .com, spoken mentions need an extra 'dot tech', and renewals cost more than .com (promo first years snap back to the $40–50 range). .com carries no semantic bonus but also no explanation cost — nothing clashes with it in any industry. The test: a tech-native audience (developers, geeks, industry press) with a brand genuinely bound to technology → .tech's label earns its keep; a mainstream or enterprise-procurement audience → .com's default trust is worth more. The hybrid is common too: .tech for the product or developer site, .com reserved for the corporate home.",
      pickA: ["Tech startups and hardware brands", "Hackathons, conferences and communities", "Developer and geek audiences", "Your short word is taken on .com"],
      pickB: ["Mainstream and enterprise customers", "Heavy spoken mentions, suffix-typo averse", "Multi-line corporate homepages", "Long-term brand asset and resale liquidity"],
    },
  },
  "store-vs-com": {
    slug: "store-vs-com",
    a: "store",
    b: "com",
    zh: {
      title: ".store 和 .com 怎么选：把「商店」写进域名值不值",
      metaDescription: ".store 让品牌词直接变成「某某商店」，.com 是电商的默认信任后缀。对比两者的转化认知、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "电商选域名的核心是「买家敢不敢下单」。.com 在这一点上仍是基准线：消费者对陌生店铺本来就警惕，.com 至少不额外扣分。.store 的打法不同——它把「这是家店」写进域名本身，brand.store 读出来就是店铺招牌，品牌词 + .store 的组合库存极好，短词、品类词大多还能原样注册；国际大牌（emirates.store 这类官方商店）也在用它做旗舰店副站，认知度在电商圈内不断累积。真正要小心的是价格曲线：.store 首年常见一两美元，续费却要按三四百元核算，是所有新后缀里价差最陡的之一。判断标准：独立站主站、需要投放冷流量、买家决策重（高客单）→ .com 的默认信任直接影响转化；品牌店铺副站、DTC 新品牌、社交流量为主（粉丝本来就认识你）→ .store 的语义与库存优势可以放心用。",
      pickA: ["DTC 新品牌与独立站", "社交/私域流量为主的店铺", "大品牌的官方商店副站", "品类词+store 的组合还可注册"],
      pickB: ["冷流量投放为主的电商主站", "高客单、买家决策重的品类", "长期品牌资产与转售", "怕续费跳价的预算敏感卖家"],
    },
    en: {
      title: ".store vs .com: Is Writing 'Store' into the Domain Worth It",
      metaDescription:
        ".store turns your brand word into a literal storefront; .com is e-commerce's default trust suffix. Compare buyer perception, pricing and fit, then hunt names available on both.",
      verdict:
        "For e-commerce the core question is whether buyers dare to check out. .com remains the baseline there: consumers are wary of unfamiliar shops by default, and .com at least deducts nothing. .store plays a different game — it writes 'this is a shop' into the domain itself: brand.store reads like a storefront sign, inventory for brand-word + .store combinations is excellent with short and category words widely registrable, and global brands (think official shops like emirates.store) keep building its recognition in commerce circles. The real caution is the price curve: .store first years run a dollar or two while renewals should be budgeted around $50–60 — one of the steepest promo-to-renewal gaps of any new suffix. The test: a primary independent store running cold-traffic ads with high-consideration purchases → .com's default trust directly moves conversion; a DTC newcomer, a brand's official-shop satellite, or social/community-driven traffic where buyers already know you → .store's semantics and inventory are safe to lean on.",
      pickA: ["DTC newcomers and independent shops", "Social and community-driven storefronts", "Official-shop satellites of larger brands", "Category word + store still registrable"],
      pickB: ["Cold-traffic ad-driven primary stores", "High-ticket, high-consideration categories", "Long-term brand asset and resale", "Renewal-gap-averse budget sellers"],
    },
  },
  "vip-vs-top": {
    slug: "vip-vs-top",
    a: "vip",
    b: "top",
    zh: {
      title: ".vip 和 .top 怎么选：会员感与性价比的国内市场对比",
      metaDescription: ".vip 自带会员/尊享语义且在国内认知度高，.top 是价格最低的通用后缀之一。对比两者的语义、价格与口碑差异，并用 AI 猎取可注册的名字。",
      verdict:
        "两个都是国内市场保有量靠前的新后缀，但气质完全不同。.vip 的语义是真资产：「会员、尊享、贵宾」在中文互联网里无需解释，会员制电商、私域社群、粉丝俱乐部用 brand.vip 等于把定位写进域名，且三字母后缀短、好念好记；价格适中，续费在几十元量级。.top 的优势只有一个但很硬：便宜——首年和续费都在个位数到十几元，是批量注册和试错成本最低的选择之一，「top/顶级」的语义也算正面。但要正视口碑问题：因为太便宜，.top 历史上被垃圾站大量使用，部分邮件网关和用户对它的第一印象偏谨慎，正式品牌用它要靠内容和备案自证。判断标准：会员制、私域、粉丝经济等「身份感」业务 → .vip 的语义溢价值得付；域名投资批量注册、个人项目、极限预算 → .top 的成本优势无可替代。两者都建议同时核验 .com 防未来被动。",
      pickA: ["会员制电商与订阅业务", "私域社群与粉丝俱乐部", "「尊享/贵宾」定位的品牌", "想要三字母短后缀的好记域名"],
      pickB: ["批量注册与域名投资", "个人项目与试验站", "极限预算的起步项目", "「顶级/第一」语义能用上的品牌"],
    },
    en: {
      title: ".vip vs .top: Membership Cachet vs Rock-Bottom Price",
      metaDescription:
        ".vip carries built-in membership semantics with strong recognition in China; .top is one of the cheapest suffixes anywhere. Compare semantics, pricing and reputation, then hunt available names.",
      verdict:
        "Both rank among China's most-registered new suffixes, but their characters couldn't differ more. .vip's semantics are a real asset: 'member, exclusive, VIP' needs zero explanation on the Chinese internet, so membership commerce, private communities and fan clubs get their positioning written into brand.vip — and the three-letter suffix is short and easy to say, with renewals in the moderate $10–20 range. .top has exactly one advantage, but it's hard: price — registration and renewal both sit in the low single digits, making it one of the cheapest options for bulk registration and throwaway experiments, with a mildly positive 'top-tier' meaning. Face the reputation issue squarely though: precisely because it's cheap, .top has been heavily used by spam sites, so some mail gateways and users approach it with caution — a serious brand on .top must prove itself through content. The test: identity-driven businesses (memberships, private communities, fan economies) → .vip's semantic premium is worth paying; bulk registration, personal projects and extreme budgets → .top's cost advantage is unmatched. In both cases, check the matching .com to avoid future hostage situations.",
      pickA: ["Membership commerce and subscriptions", "Private communities and fan clubs", "Brands positioned around exclusivity", "Short, memorable three-letter suffix"],
      pickB: ["Bulk registration and domain investing", "Personal projects and experiments", "Extreme starter budgets", "Brands that can use the 'top-tier' pun"],
    },
  },
  "art-vs-studio": {
    slug: "art-vs-studio",
    a: "art",
    b: "studio",
    zh: {
      title: ".art 和 .studio 怎么选：作品身份与工作室招牌的对比",
      metaDescription: ".art 是艺术圈的身份后缀（博物馆与画廊都在用），.studio 是创意团队的经典招牌。对比两者的气质、价格与适用场景，并用 AI 猎取可注册的名字。",
      verdict:
        "两个都属于创意行业，分界线在「作品」还是「团队」。.art 的语义指向作品与艺术身份本身：艺术家个人站、作品集、画廊、NFT/数字艺术项目用 name.art 等于自我声明「这是艺术」，而且这个后缀有真实的机构背书——全球不少博物馆和画廊在用，圈内认知度扎实；四个字母也够短。.studio 指向的是「一间工作室」：设计、动画、摄影、游戏团队挂 name.studio 像挂了块含蓄的招牌，重点是「我们承接创作」而非「这是作品」。价格上两者续费都在中档（百元量级），库存都好，常用词大多可注册。判断标准：主体是艺术家个人或作品本身（画廊、收藏、策展、数字艺术）→ .art 的身份感更纯粹；主体是接案团队或创意服务（设计工作室、影像团队、独立游戏）→ .studio 的「营业中」气质更对。同名两个都能注册时，个人作品集拿 .art、团队官网拿 .studio 是最不出错的分法。",
      pickA: ["艺术家个人站与作品集", "画廊、策展与收藏机构", "数字艺术与 NFT 项目", "「这是艺术」的身份声明"],
      pickB: ["设计与动画工作室", "摄影与影像团队", "独立游戏工作室", "承接创作服务的团队招牌"],
    },
    en: {
      title: ".art vs .studio: Artistic Identity or Studio Signboard",
      metaDescription:
        ".art is the art world's identity suffix (used by real museums and galleries); .studio is the creative team's classic signboard. Compare vibe, pricing and fit, then hunt available names.",
      verdict:
        "Both belong to the creative industry; the dividing line is work versus team. .art points at the work and the artistic identity itself: artist portfolios, galleries and digital-art or NFT projects on name.art are self-declarations that this is art — and the suffix carries real institutional backing, with museums and galleries worldwide using it, so recognition inside the art world is solid; four letters keep it short. .studio points at a workshop: design, animation, photography and game teams hang name.studio like an understated signboard whose message is 'we take on creative work', not 'this is the work'. Pricing is similar — mid-range renewals around $20–35 on both — and inventory is strong, with common words widely registrable. The test: the subject is an individual artist or the work itself (galleries, curation, collections, digital art) → .art's identity reads purer; the subject is a client-serving team (design studios, film crews, indie game shops) → .studio's open-for-business posture fits better. When the same name is free on both, portfolios take .art and team sites take .studio — that split rarely misses.",
      pickA: ["Artist portfolios and personal sites", "Galleries, curation and collections", "Digital art and NFT projects", "An explicit 'this is art' identity"],
      pickB: ["Design and animation studios", "Photography and film teams", "Indie game studios", "Client-facing creative service signboards"],
    },
  },
  "media-vs-tv": {
    slug: "media-vs-tv",
    a: "media",
    b: "tv",
    zh: {
      title: ".media 和 .tv 怎么选：全媒体品牌与视频频道的对比",
      metaDescription: ".media 覆盖全媒体形态，.tv 是视频/直播的专属信号且价格更高。对比两者的语义宽窄、价格与适用场景，并用 AI 猎取可注册的名字。",
      verdict:
        "分界线是内容形态的宽窄。.media 是个宽口径后缀：图文、播客、视频、社媒代运营全都装得下，媒体集团、内容工作室、营销机构用 name.media 像一块「我们做内容」的通用招牌，续费中档（百元量级），常用词库存好。.tv 则窄而锋利：它在大众心智里就等于「电视/视频」，直播频道、视频栏目、流媒体项目用 name.tv 一眼可懂——Twitch 主播圈和体育直播已经把这个认知打得很透。代价是价格：.tv 续费明显更贵（两三百元量级），而且它本质是图瓦卢的国家后缀，语义之外没有折扣。判断标准：内容形态多元或还没定型（图文+播客+视频混合）→ .media 的宽口径不锁死方向；核心产品就是视频/直播频道 → .tv 的信号精准且值这个溢价。要注意反向错配：纯图文媒体用 .tv 会让用户期待视频，视频频道用 .media 则浪费了 .tv 的即时可懂——按主形态选，别按「以后可能做」选。",
      pickA: ["多形态内容工作室与媒体集团", "营销与社媒代运营机构", "播客与图文为主的媒体", "内容方向还没定型的新品牌"],
      pickB: ["直播频道与主播个人站", "视频栏目与流媒体项目", "体育/赛事直播品牌", "「打开就是看视频」的产品"],
    },
    en: {
      title: ".media vs .tv: Full-Stack Media Brand or Video Channel",
      metaDescription:
        ".media covers every content format; .tv is the dedicated video/streaming signal at a premium. Compare semantic breadth, pricing and fit, then hunt available names.",
      verdict:
        "The dividing line is how wide your content format runs. .media is a broad suffix: articles, podcasts, video and social-media services all fit, so media groups, content studios and marketing agencies wear name.media like a general 'we make content' signboard, with mid-range renewals around $25–35 and good inventory on common words. .tv is narrow and sharp: in the public mind it simply means television/video, so live channels, video shows and streaming projects on name.tv are understood at a glance — Twitch streamers and sports broadcasting have hammered that recognition home. The cost is price: .tv renewals run noticeably higher ($30–45 range), and it's technically Tuvalu's country suffix with no discount beyond the semantics. The test: diverse or still-forming content formats (articles + podcast + video mixed) → .media's breadth doesn't lock your direction; the core product is a video or live channel → .tv's precision earns its premium. Watch the reverse mismatch too: a text-first publication on .tv sets false video expectations, while a video channel on .media wastes .tv's instant readability — choose by your primary format, not by what you might do someday.",
      pickA: ["Multi-format content studios and media groups", "Marketing and social-media agencies", "Podcast and article-first publications", "New brands with unsettled content direction"],
      pickB: ["Live channels and streamer sites", "Video shows and streaming projects", "Sports and event broadcasting brands", "Products that open straight into video"],
    },
  },
  "news-vs-media": {
    slug: "news-vs-media",
    a: "news",
    b: "media",
    zh: {
      title: ".news 和 .media 怎么选：资讯站招牌与内容公司门牌的对比",
      metaDescription: ".news 语义精准指向「资讯」，.media 覆盖整个内容行业。对比两者的语义宽窄、价格与更新预期，并用 AI 猎取可注册的名字。",
      verdict:
        "两个都是内容行业的后缀，分界线在「产品」还是「公司」。.news 指向的是内容产品本身：垂直资讯站、行业周报、付费 newsletter、公司 newsroom，「主题 + .news」读出来就是完整的站名（ai.news 式），用户点进去的预期就是看最新资讯——这个精准度是 .media 给不了的。但它也带着隐性契约：挂在 .news 上的站必须持续更新，半年不动的 .news 域名比任何后缀都伤信任。.media 指向的是内容公司这个主体：播客网络、视频制作团队、内容营销工作室，「品牌 + .media」是公司全称而非某个站，内容形态换了、产品线加了都不违和。价格上 .news 续费约 $26/年（约 ¥190），.media 略贵一档（两百多元），都属温和。判断标准：交付物是一个持续出内容的资讯产品 → .news 的精准语义直接帮转化；主体是一家做多种内容业务的公司或团队 → .media 的宽口径不锁死方向。两者都做时也有成熟分法：公司官网挂 .media，旗下资讯产品挂 .news。",
      pickA: ["垂直行业资讯与独立媒体", "付费 newsletter 与行业周报", "公司官方 newsroom（brand.news）", "「主题词+news」即站名的赛道站"],
      pickB: ["播客网络与视频制作团队", "内容营销与社媒代运营公司", "多形态内容工作室的公司主站", "内容方向还会扩展的新品牌"],
    },
    en: {
      title: ".news vs .media: Publication Sign or Content-Company Nameplate",
      metaDescription:
        ".news points precisely at journalism and updates; .media covers the whole content industry. Compare semantic breadth, pricing and update expectations, then hunt available names.",
      verdict:
        "Both live in the content industry; the dividing line is product versus company. .news names the content product itself: vertical publications, industry digests, paid newsletters and corporate newsrooms — 'topic + .news' reads as a complete site name (think ai.news), and visitors arrive expecting fresh coverage, a precision .media can't match. That precision carries an implicit contract though: a .news site must keep publishing — six stale months hurt trust more here than on any other suffix. .media names the company behind the content: podcast networks, video production teams and content-marketing studios wear 'brand + .media' as a full company name, and nothing clashes when formats change or product lines grow. On price, .news renews around $26/year with .media a notch higher ($25–35) — both moderate. The test: your deliverable is one continuously publishing news product → .news's precise semantics convert directly; your subject is a company running several content businesses → .media's breadth keeps options open. Running both is a mature split too: the company site on .media, its publications on .news.",
      pickA: ["Vertical publications and independent media", "Paid newsletters and industry digests", "Official corporate newsrooms (brand.news)", "Topic + news as the complete site name"],
      pickB: ["Podcast networks and video production teams", "Content-marketing and social-media agencies", "Multi-format content studios' company home", "New brands whose content direction will grow"],
    },
  },
  "tools-vs-app": {
    slug: "tools-vs-app",
    a: "tools",
    b: "app",
    zh: {
      title: ".tools 和 .app 怎么选：工具箱招牌与应用产品的对比",
      metaDescription: ".tools 是工具聚合站的天然招牌，.app 是 Google 运营的强制 HTTPS 应用后缀。对比两者的语义、价格与安全属性，并用 AI 猎取可注册的名字。",
      verdict:
        "两个后缀都在说「拿来干活的东西」，差别在单数还是复数、轻还是重。.tools 的语义是「一箱工具」：在线转换器合集、生成器矩阵、开发者工具链、设计资源站，「功能词 + .tools」读出来就是某某工具箱，独立开发者的工具聚合站近年大量选它，用户点进去就知道是来干活的，转化路径极短。.app 指向「一个应用」：有完整产品形态的 Web App、移动应用官网、需要注册登录的 SaaS——而且它是 Google 运营、全后缀 HSTS 预加载强制 HTTPS，浏览器直接拒绝不安全连接，对正经产品是隐性的信任加分。价格上 .tools 首年 $10 上下、续费约 $29/年（约 ¥210）；.app 适中、续费略高于 .com，两者差距不大。判断标准：产品是「一堆小工具的集合」或纯前端的实用站 → .tools 的复数语义与工具箱气质更贴；产品是「一个有名字的应用」、有账号体系与持续迭代 → .app 的单数指向和安全背书更对。别反着用：单一产品挂 .tools 显得杂，工具合集挂 .app 又抬高了用户对「完整应用」的预期。",
      pickA: ["在线工具聚合站（转换器/生成器合集）", "开发者工具链与 CLI 集合", "设计/办公资源站", "独立开发者的多工具矩阵"],
      pickB: ["有完整产品形态的 Web/移动应用", "需要注册登录的 SaaS 产品", "看重强制 HTTPS 安全背书", "App 下载落地页与产品官网"],
    },
    en: {
      title: ".tools vs .app: Toolbox Sign or Application Product",
      metaDescription:
        ".tools is the natural sign for utility collections; .app is Google's HTTPS-enforced application suffix. Compare semantics, pricing and security, then hunt available names.",
      verdict:
        "Both suffixes say 'things that get work done'; the difference is plural versus singular, light versus heavy. .tools means a toolbox: converter collections, generator matrices, developer toolchains and design-resource sites — 'function word + .tools' reads as a literal toolkit, indie developers have adopted it heavily for utility hubs, and visitors arrive knowing they came to get something done, which keeps conversion paths short. .app points at one application: a full-fledged web app, a mobile app's home, a SaaS with accounts — and it's Google-operated with the whole zone HSTS-preloaded, so browsers refuse insecure connections outright, a quiet trust bonus for serious products. Pricing is close: .tools runs about $10 first year and $29 renewal; .app is moderate with renewals slightly above .com. The test: your product is a collection of small utilities or a front-end-only helper site → .tools's plural, workbench character fits; your product is one named application with accounts and ongoing iteration → .app's singular focus and security backing win. Don't cross them: a single product on .tools reads scattered, while a utility collection on .app over-promises a full application.",
      pickA: ["Online utility hubs (converters, generators)", "Developer toolchains and CLI collections", "Design and productivity resource sites", "Indie developers' multi-tool matrices"],
      pickB: ["Full-fledged web or mobile applications", "SaaS products with accounts and login", "HTTPS-enforced security as a trust signal", "App download landing pages and product homes"],
    },
  },
  "run-vs-club": {
    slug: "run-vs-club",
    a: "run",
    b: "club",
    zh: {
      title: ".run 和 .club 怎么选：跑步双关与社群归属感的对比",
      metaDescription: ".run 一词双关「运行」与「跑步」，.club 是社群的通用后缀。对比两者在运动与技术场景下的语义、价格与适用边界，并用 AI 猎取可注册的名字。",
      verdict:
        "这对组合在两个场景相遇。运动场景里两者短兵相接：跑团选 name.run 是把「跑」写进域名——短、动感、名字即动作；选 name.club 则强调「这是个圈子」——归属感、会员制、线下活动的气质更浓。判断只看重心：以跑步这件事为核心（赛事、训练计划、装备）→ .run；以人群和会员关系为核心（付费社群、俱乐部运营）→ .club。技术场景则只有 .run 在场：它的「运行」双关让运行时、部署平台、沙盒 demo 站用 name.run 暗示「点开就能跑」，cloud.run 已经完成了用户教育，.club 在这里帮不上忙。价格两者都亲民：.run 首年 $4 左右、续费约 $22/年（约 ¥160）；.club 常年低位、库存充足，NFT 热潮释放的好词正是捡漏窗口。还有一条通用提醒：.club 语义绑定「圈子」，正式商业产品用它会显得轻；.run 语义绑定「动」，静态内容站用它则浪费了双关。",
      pickA: ["跑步赛事、训练计划与装备品牌", "运行时、部署平台与沙盒环境", "「点开就能跑」的 demo/playground 站", "想要三字母短后缀的动感命名"],
      pickB: ["付费社群与会员制业务", "兴趣圈子、读书会与线下俱乐部", "粉丝俱乐部与 NFT 社区", "「加入我们」气质的归属感品牌"],
    },
    en: {
      title: ".run vs .club: The Running Pun or Community Belonging",
      metaDescription:
        ".run puns on both 'execute' and 'running'; .club is the universal community suffix. Compare semantics, pricing and fit across sports and tech, then hunt available names.",
      verdict:
        "These two meet in two different arenas. In sports they compete head-on: a running crew on name.run writes the action into the domain — short, kinetic, name-as-verb; on name.club it emphasizes the circle — belonging, membership, offline meetups. Judge by your center of gravity: if the activity itself is the core (races, training plans, gear) → .run; if the people and membership relationship are the core (paid communities, club operations) → .club. In tech only .run shows up: its 'execute' reading lets runtimes, deploy platforms and sandbox demos on name.run whisper 'click and it runs' — cloud.run finished the user education — while .club has nothing to offer here. Both are budget-friendly: .run registers around $4 with ~$22 renewals; .club stays cheap year-round with deep inventory, and the NFT boom's released names make this a bargain window. One caution each: .club's circle semantics read light for formal commercial products, and .run's kinetic pun is wasted on static content sites.",
      pickA: ["Races, training plans and running-gear brands", "Runtimes, deploy platforms and sandboxes", "Click-and-it-runs demo/playground sites", "Kinetic naming on a three-letter suffix"],
      pickB: ["Paid communities and membership businesses", "Interest circles, book clubs and offline clubs", "Fan clubs and NFT communities", "Brands built around 'join us' belonging"],
    },
  },
  "codes-vs-dev": {
    slug: "codes-vs-dev",
    a: "codes",
    b: "dev",
    zh: {
      title: ".codes 和 .dev 怎么选：双赛道后缀与开发者标配的对比",
      metaDescription: ".codes 同时吃「代码」与「优惠码」两个赛道但续费最贵，.dev 是 Google 运营的开发者标配。对比两者的语义、价格结构与圈内认知，并用 AI 猎取可注册的名字。",
      verdict:
        "先说结论：纯开发者场景下 .dev 几乎总是更优。它是 Google 运营、全后缀强制 HTTPS，web.dev、kubernetes.dev 早已完成圈内教育，个人站 yourname.dev 是干净专业的标配，续费适中。.codes 在开发者场景是「另一种口味」：name.codes 当个人作品集在海外开发者圈是成熟玩法，复数形式带点手工感和个性——但要为此付出真金白银：首年 $5 便宜，续费约 $57/年（约 ¥410），是收录后缀里续费最贵的新顶级域之一，长期持有要想清楚。.codes 真正的独占赛道是「优惠码/兑换码」：折扣码聚合站、游戏兑换码、promo codes 站点的流量词本身就带 codes，brand.codes 域名即品类，这个场景 .dev 完全帮不上忙。判断标准：开发者工具、技术博客、开源主页 → .dev 的圈内认知和价格都更稳；折扣码/兑换码内容站 → .codes 是唯一的语义正解；个人作品集两者都行，预算优先 .dev、个性优先 .codes。",
      pickA: ["折扣码/兑换码聚合站（域名即品类）", "游戏兑换码与 promo codes 内容站", "想要复数手工感的个人作品集", "「codes」本身就是流量词的场景"],
      pickB: ["开发者工具、CLI 与 SDK", "技术博客与开源项目主页", "个人开发者品牌（yourname.dev）", "续费预算敏感的长期持有"],
    },
    en: {
      title: ".codes vs .dev: The Two-Track Suffix or the Developer Standard",
      metaDescription:
        ".codes plays both the code and promo-code tracks but renews expensive; .dev is Google's developer standard. Compare semantics, price structure and credibility, then hunt available names.",
      verdict:
        "Verdict first: in purely developer scenarios .dev nearly always wins. It's Google-operated with zone-wide enforced HTTPS, web.dev and kubernetes.dev finished the community education long ago, yourname.dev is the clean professional standard for personal sites, and renewals are moderate. .codes in developer land is an alternate flavor: name.codes as a portfolio is an established pattern among developers abroad, and the plural adds a handcrafted personality — but you pay real money for it: $5 first year snaps to roughly $57/year renewal, among the steepest of any new gTLD, so think hard before holding long-term. Where .codes owns the field outright is promo and redemption codes: discount-code aggregators, game redemption codes and promo-codes sites carry 'codes' in their own traffic keywords, making brand.codes a domain-as-category — a scenario where .dev is useless. The test: developer tools, technical blogs, open-source homes → .dev's credibility and pricing are safer; discount/redemption-code content sites → .codes is the only semantically correct answer; for portfolios either works — budget favors .dev, personality favors .codes.",
      pickA: ["Discount-code aggregators (domain-as-category)", "Game redemption and promo-codes sites", "Portfolios wanting the plural, handcrafted feel", "Scenarios where 'codes' is the traffic keyword"],
      pickB: ["Developer tools, CLIs and SDKs", "Technical blogs and open-source homes", "Personal developer brands (yourname.dev)", "Renewal-budget-sensitive long-term holds"],
    },
  },
  "company-vs-group": {
    slug: "company-vs-group",
    a: "company",
    b: "group",
    zh: {
      title: ".company 和 .group 怎么选：一家公司与一个集团的门牌对比",
      metaDescription: ".company 把「公司」写进域名且续费便宜，.group 自带「集团」气质适合多品牌矩阵。对比两者的语义级别、价格与适用主体，并用 AI 猎取可注册的名字。",
      verdict:
        "两个后缀都在给「企业主体」挂门牌，分界线是主体的级别。.company 说的是「一家公司」：中小企业官网、工作室的正式主体页、「the XX company」式的复古品牌命名（The Coffee Company 这种格式），brand.company 读出来自然又完整；它还是收录后缀里最便宜的一档——首年 $3 左右、续费约 $17/年（约 ¥125），比 .com 续费还低，把正式感和低成本难得地放在了一起。.group 说的是「一个集团」：控股平台、多品牌矩阵的母品牌、家族企业与投资集团，name.group 当集团官网、旗下品牌各自持有独立域名是海外成熟玩法；它还有第二语义——社群与兴趣小组（微信群、Telegram 群的落地页），这是 .company 没有的方向。判断标准：单一经营主体、一家店/一个工作室/一家公司 → .company 的级别刚好且成本最低；名下有多个品牌或计划做控股结构 → .group 的「集团」语义撑得起来。反向错配要避免：个人小站用 .group 显得虚张声势，真正的集团用 .company 又降了级。",
      pickA: ["中小企业与工作室官网", "「The XX Company」式复古品牌", "控股结构里的子公司主体页", "想要正式感但预算敏感（续费最低档）"],
      pickB: ["集团公司与控股平台母站", "多品牌矩阵的母品牌门牌", "家族企业与投资集团", "社群/兴趣小组的落地页"],
    },
    en: {
      title: ".company vs .group: Nameplate for a Company or a Group",
      metaDescription:
        ".company writes 'company' into the domain at bargain renewals; .group carries holding-company gravitas for multi-brand portfolios. Compare semantic level, pricing and fit, then hunt available names.",
      verdict:
        "Both suffixes hang a nameplate on a business entity; the dividing line is the entity's level. .company says one company: small-business sites, a studio's formal corporate page, and retro 'the XX company' branding (The Coffee Company format) all read naturally as brand.company — and it's among the cheapest suffixes listed anywhere: roughly $3 first year and $17/year renewal, below even .com, a rare pairing of formality and low cost. .group says a group: holding platforms, the parent brand of a multi-brand portfolio, family businesses and investment groups — name.group as the group's home with each brand on its own domain is an established pattern abroad. It also carries a second meaning .company lacks: communities and interest groups (landing pages for chat groups and clubs). The test: a single operating entity — one shop, one studio, one company → .company sits at exactly the right level at the lowest cost; multiple brands under one roof or a holding structure in the plans → .group's gravitas carries it. Avoid the reverse mismatch: a personal site on .group reads as posturing, while a genuine conglomerate on .company undersells itself.",
      pickA: ["Small-business and studio corporate sites", "Retro 'The XX Company' branding", "Subsidiary entity pages in a holding structure", "Formality on a budget (bottom-tier renewals)"],
      pickB: ["Conglomerates and holding-platform homes", "Parent nameplate of multi-brand portfolios", "Family businesses and investment groups", "Community and interest-group landing pages"],
    },
  },
  "wiki-vs-info": {
    slug: "wiki-vs-info",
    a: "wiki",
    b: "info",
    zh: {
      title: ".wiki 和 .info 怎么选：百科招牌与信息老将的对比",
      metaDescription: ".wiki 借维基之名自带「百科/知识库」语义，.info 是 2001 年首批新后缀的信息老将。对比两者的语义强度、历史包袱与价格，并用 AI 猎取可注册的名字。",
      verdict:
        "两个后缀都在说「这里有资料」，差别在语义的形状。.wiki 的语义是「结构化的知识库」：借维基百科之名，「主题 + .wiki」读出来就是某某百科——产品文档站、游戏/动漫粉丝百科、开源项目 wiki、团队知识库对外版，用户点进去的预期就是查资料，而且隐含「可协作、会更新」的活文档气质；首年 $2 左右、续费约 $26/年（约 ¥190），注册局 Top Level Design。.info 的语义更泛也更老：2001 年首批新后缀，二十多年历史让它的认知度在新后缀里名列前茅，资料站、活动信息页、产品说明站都装得下，首年常年一两美元、给主品牌配信息子站的成本几乎可以忽略。但历史也是包袱：.info 曾被大量垃圾站使用，直接做商业主站的信任感偏弱，更适合当配角。判断标准：内容是结构化、持续维护的知识体系（词条、文档、攻略库）→ .wiki 的百科招牌精准且现代；内容是单向发布的静态信息（活动页、说明站、品牌信息子站）→ .info 的低成本和老资格够用。别把 .wiki 挂在不更新的静态站上——「wiki」暗示的活文档预期落空比 .info 更伤。",
      pickA: ["产品文档与开发者知识库", "游戏/动漫粉丝百科（fandom 式）", "开源项目 wiki 与攻略库", "结构化、持续维护的知识体系"],
      pickB: ["活动信息页与产品说明站", "主品牌的信息子站（成本近乎零）", "单向发布的静态资料站", "看重二十年老后缀的认知度"],
    },
    en: {
      title: ".wiki vs .info: The Encyclopedia Sign or the Information Veteran",
      metaDescription:
        ".wiki borrows Wikipedia's name for built-in knowledge-base semantics; .info is the 2001 first-wave information veteran. Compare semantic strength, legacy baggage and pricing, then hunt available names.",
      verdict:
        "Both suffixes say 'reference material here'; the difference is the shape of the semantics. .wiki means a structured knowledge base: borrowing Wikipedia's name, 'topic + .wiki' reads as an encyclopedia — product docs, game and fandom wikis, open-source project wikis, public team knowledge bases — visitors arrive expecting to look things up, with an implied living-document promise of collaboration and updates. It runs about $2 first year and $26/year renewal under registry Top Level Design. .info is broader and older: part of 2001's first new-gTLD wave, its two decades give it top-tier recognition among alternative suffixes, it fits reference sites, event pages and product-information satellites, and first years routinely cost a dollar or two — a near-zero cost to give a main brand an info companion site. But the history is also baggage: heavy historical spam use leaves .info's trust too weak for a primary commercial site; it works best in a supporting role. The test: structured, continuously maintained knowledge (entries, docs, guides) → .wiki's encyclopedia sign is precise and modern; one-way static information (event pages, spec sites, brand info satellites) → .info's low cost and seniority suffice. Never park a stale static site on .wiki — the broken living-document expectation hurts more there than on .info.",
      pickA: ["Product docs and developer knowledge bases", "Game and fandom wikis", "Open-source project wikis and guide libraries", "Structured, continuously maintained knowledge"],
      pickB: ["Event pages and product-information sites", "Info satellites for a main brand (near-zero cost)", "One-way static reference sites", "Two decades of suffix recognition"],
    },
  },
  "blog-vs-com": {
    slug: "blog-vs-com",
    a: "blog",
    b: "com",
    zh: {
      title: ".blog 和 .com 怎么选：写作者身份与万能默认的对比",
      metaDescription: ".blog 是写作者的身份后缀、好名字库存充裕，.com 是万能默认但好词绝迹。对比两者的语义、价格与库存差异，并用 AI 猎取可注册的名字。",
      verdict:
        "先问一个问题：这个站的核心是「读内容」还是「做生意」？答案是前者，.blog 几乎总是更优——它由 WordPress 母公司 Automattic 旗下注册局运营，name.blog 天然读成「某某的博客」，人名、笔名、主题词在这里大多还能注册（yourname.blog、coffee.blog 这类在 .com 下早已绝迹），首年 $3 上下、续费约 $21/年，对个人创作者可长期负担。答案是后者，.com 仍是无可替代的默认：电商、SaaS、企业主站挂在 .blog 上会显得业余，用户口头传播时也默认补全 .com。价格上 .com 注册与续费都便宜稳定，但代价是好名字几乎要靠收购。成熟的组合玩法是分工：brand.com 做产品主站，brand.blog 做内容分站——内容营销越重的品牌越值得两个都拿。",
      pickA: ["个人博客与独立写作者", "Newsletter 网页版与专栏", "品牌的内容营销分站（brand.blog）", "人名/主题词在 .com 已绝迹"],
      pickB: ["电商、SaaS 与企业主站", "口头传播场景多（用户默认补全 .com）", "长期品牌资产与转售", "内容只是站点的一部分而非全部"],
    },
    en: {
      title: ".blog vs .com: Writer Identity vs the Universal Default",
      metaDescription:
        ".blog is the writer's identity suffix with great inventory; .com is the universal default with good words long gone. Compare semantics, pricing and inventory, then hunt available names.",
      verdict:
        "Ask one question first: is this site primarily for reading content or for doing business? If reading, .blog nearly always wins — run by a registry under Automattic (the WordPress company), name.blog literally parses as \"NAME's blog\", and real names, pen names and topic words are mostly still open here (yourname.blog and coffee.blog went extinct on .com years ago), at about $3 first year and $21/yr renewal — sustainable for individual creators. If business, .com remains the irreplaceable default: e-commerce, SaaS and corporate main sites look amateur on .blog, and word-of-mouth autocompletes to .com. .com is cheap and stable to hold, but good names are effectively acquisition-only. The mature play is division of labor: brand.com for the product, brand.blog for the content hub — the heavier your content marketing, the more it pays to own both.",
      pickA: ["Personal blogs & independent writers", "Newsletter web homes and columns", "Brand content hubs (brand.blog)", "Your name or topic word is extinct on .com"],
      pickB: ["E-commerce, SaaS and corporate main sites", "Heavy word-of-mouth (users autocomplete .com)", "Long-term brand asset and resale", "Content is one part of the site, not all of it"],
    },
  },
  "team-vs-com": {
    slug: "team-vs-com",
    a: "team",
    b: "com",
    zh: {
      title: ".team 和 .com 怎么选：讲「人」的后缀与讲「产品」的默认",
      metaDescription: ".team 把「团队」写进域名，适合协作工具、招聘页与战队；.com 是产品主站的默认。对比两者的分工、价格与适用场景，并用 AI 猎取可注册的名字。",
      verdict:
        "这组对比的正解往往不是二选一，而是分工：.com 讲产品，.team 讲人。协作与团队管理 SaaS 把「为团队而生」直接写进域名（name.team 一眼即懂）、公司招聘与雇主品牌页（join.team 式表达比 careers 子页面更有态度）、电竞战队与运动俱乐部主页——这些「人」维度的场景 .team 都名正言顺，且 dream.team 这类现成短语在 .com 里根本不存在。价格上 .team 首年 $5 上下、续费约 $29/年，中等价位；.com 便宜稳定但好名字绝迹。什么时候只选 .com：产品主站、面向大众的正式品牌、口头传播多的场景——单独用 .team 做公司主站语义偏窄，且「team」在中文语境认知度不如 com 直白。预算允许时，产品主站 .com + 招聘/团队页 .team 是海外成熟玩法。",
      pickA: ["协作与团队管理工具", "招聘与雇主品牌页（join.team 式）", "电竞战队与运动俱乐部", "dream.team 类现成短语可遇不可求"],
      pickB: ["产品主站与正式品牌", "面向大众、口头传播多", "长期品牌资产与转售", "面向纯国内用户（认知度更稳）"],
    },
    en: {
      title: ".team vs .com: The People Suffix vs the Product Default",
      metaDescription:
        ".team writes the team into the domain — for collaboration tools, hiring pages and squads; .com is the product-site default. Compare roles, pricing and fit, then hunt available names.",
      verdict:
        "The right answer here is often not either/or but division of labor: .com speaks for the product, .team speaks for the people. Collaboration and team-management SaaS write \"built for teams\" into the domain itself (name.team is instantly legible), hiring and employer-brand pages get more attitude from join.team than a buried careers subpage, and esports squads and sports clubs wear it natively — plus ready-made phrases like dream.team simply don't exist on .com. On price, .team runs about $5 first year with $29/yr renewals — mid-tier; .com is cheap and stable but good names are gone. When to pick only .com: the product main site, mainstream consumer brands, heavy word-of-mouth — .team alone reads narrow as a corporate main site. With budget, the established pattern abroad is brand.com for the product plus a .team for hiring and the people story.",
      pickA: ["Collaboration & team-management tools", "Hiring & employer-brand pages (join.team style)", "Esports squads and sports clubs", "Ready-made phrases like dream.team"],
      pickB: ["Product main sites and formal brands", "Mainstream audience, heavy word-of-mouth", "Long-term brand asset and resale", "Best default recognition everywhere"],
    },
  },
  "chat-vs-app": {
    slug: "chat-vs-app",
    a: "chat",
    b: "app",
    zh: {
      title: ".chat 和 .app 怎么选：对话形态与应用形态的信号对比",
      metaDescription: ".chat 说「点进来能对话」，.app 说「这是个应用」。对比两者的语义精度、价格与强制 HTTPS 等差异，并用 AI 猎取可注册的名字。",
      verdict:
        "两个后缀都在描述产品形态，分界线是交互方式。产品的核心体验是「对话」——AI 助手、Chatbot、客服与在线咨询、社区群聊——.chat 的语义精度无可替代：用户看到 name.chat 就预期点进去能聊，转化路径最短；ChatGPT 之后它更成了 AI 对话产品的性价比之选（比 .ai 便宜得多）。产品是更广义的「应用」——工具、效率、任何 App 形态——.app 更稳：Google 运营、全后缀强制 HTTPS（HSTS 预加载），name.app 零解释成本，且不把产品绑死在「聊天」这一种形态上。价格上 .app 注册与续费都适中；.chat 首年 $6 上下、续费约 $37/年，中等偏上。判断标准：打开产品第一屏是对话框 → .chat；对话只是功能之一或未来可能转型 → .app 留足余地。反向错配都伤：非对话产品用 .chat 误导预期，纯聊天产品用 .app 又浪费了品类信号。",
      pickA: ["AI 对话助手与 Chatbot", "客服与在线咨询工具（support.chat 式）", "社区与群聊产品", "AI 产品预算有限（.ai 的高性价比替身）"],
      pickB: ["工具与效率类应用", "对话只是功能之一的产品", "看重强制 HTTPS 的安全背书", "未来可能扩展形态、不想绑死「聊天」"],
    },
    en: {
      title: ".chat vs .app: Conversation Signal vs Application Signal",
      metaDescription:
        ".chat says \"talk to it\"; .app says \"it's an application\". Compare semantic precision, pricing and enforced HTTPS, then hunt available names.",
      verdict:
        "Both suffixes describe a product's form factor; the dividing line is the interaction. If the core experience is conversation — AI assistants, chatbots, customer support and live consultation, community chat — .chat's precision is unmatched: visitors seeing name.chat expect to talk to something the moment they land, the shortest conversion path there is; after ChatGPT it also became the value pick for AI conversation products (far cheaper than .ai). If the product is an application in the broader sense — tools, productivity, anything app-shaped — .app is the safer badge: Google-operated with zone-wide enforced HTTPS (HSTS preload), name.app costs zero explanation and doesn't chain you to the chat form factor. On price .app is moderate both ways; .chat runs about $6 first year with $37/yr renewals, mid-to-upper. The test: if the first screen is a chat box → .chat; if conversation is one feature among several or a pivot is possible → .app leaves room. Both mismatches hurt: .chat on a non-conversational product misleads, .app on a pure chat product wastes the category signal.",
      pickA: ["AI assistants & chatbots", "Customer support & live consultation (support.chat)", "Community & group-chat products", "AI products on a budget (.ai's value alternative)"],
      pickB: ["Tools and productivity apps", "Products where chat is one feature of many", "Enforced-HTTPS security endorsement", "Room to pivot beyond the chat form factor"],
    },
  },
  "finance-vs-com": {
    slug: "finance-vs-com",
    a: "finance",
    b: "com",
    zh: {
      title: ".finance 和 .com 怎么选：品类信号与通用信任的对比",
      metaDescription: ".finance 把「金融」写进后缀、DeFi 圈已成惯例，.com 是金融机构的传统默认。对比两者的信任来源、价格与合规预期，并用 AI 猎取可注册的名字。",
      verdict:
        "金融产品选域名，本质是在选「信任的来源」。.com 的信任来自资历：银行、券商、持牌机构的用户预期就是 .com，面向大众的理财与支付产品用它最不需要解释。.finance 的信任来自语义：后缀本身就在说「我是做金融的」，金融科技创业公司、记账与预算工具、B2B 财务 SaaS 用它名正言顺；DeFi 圈更是把它用成了行业惯例——yearn.finance 等头部协议完成了用户教育，加密金融项目选 .finance 几乎零解释成本，甚至比 .com 更「圈内」。价格差异明显：.finance 首年 $7 上下、续费约 $52/年，偏高；.com 便宜稳定但金融类好词几乎绝迹。两点提醒：金融语义自带监管预期，.finance 站点务必展示合规信息与真实主体，否则「像钓鱼站」的怀疑会反噬；传统持牌业务（银行、保险）用户习惯 .com，别用 .finance 挑战预期。",
      pickA: ["金融科技创业公司", "DeFi 与加密金融协议（行业惯例）", "记账/预算/报销工具", "金融词根在 .com 已被注册"],
      pickB: ["银行、券商与持牌机构", "面向大众的理财与支付产品", "长期品牌资产与转售", "续费预算敏感（.finance 续费偏高）"],
    },
    en: {
      title: ".finance vs .com: Category Signal vs Universal Trust",
      metaDescription:
        ".finance spells the industry into the suffix and rules DeFi; .com is the traditional default of financial institutions. Compare trust sources, pricing and compliance expectations, then hunt available names.",
      verdict:
        "Choosing a domain for a financial product is really choosing where the trust comes from. .com's trust comes from seniority: users expect banks, brokers and licensed institutions on .com, and mainstream money and payment products need zero explanation there. .finance's trust comes from semantics: the suffix itself says \"we do finance\" — fintech startups, budgeting and expense tools and B2B finance SaaS all wear it legitimately, and DeFi went further and made it the industry convention: protocols like yearn.finance finished the user education, so crypto-finance projects pay zero explanation cost — on .finance they can read even more native than on .com. The price gap is real: .finance runs about $7 first year with $52/yr renewals; .com is cheap and stable but finance words are effectively extinct. Two cautions: financial semantics invite regulatory expectations — a .finance site must show compliance details and a real legal entity or risk reading as phishing; and traditional licensed businesses (banks, insurance) should not challenge the .com habit their users already have.",
      pickA: ["Fintech startups", "DeFi & crypto-finance protocols (the convention)", "Budgeting/expense/invoicing tools", "Your finance word is taken on .com"],
      pickB: ["Banks, brokers and licensed institutions", "Mainstream money and payment products", "Long-term brand asset and resale", "Renewal-budget sensitive (.finance renews high)"],
    },
  },
  "global-vs-world": {
    slug: "global-vs-world",
    a: "global",
    b: "world",
    zh: {
      title: ".global 和 .world 怎么选：企业宣言与叙事画布的对比",
      metaDescription: ".global 是跨国业务的正式宣言、定价高门槛，.world 是开放叙事的画布、首年便宜。对比两者的气质、价格结构与适用场景，并用 AI 猎取可注册的名字。",
      verdict:
        "两个后缀都在说「不止一个市场」，气质却分得很开。.global 是企业宣言：跨国公司的国际主站、集团品牌页、国际组织与联盟，brand.global 读出来就是「某某的全球站」，正式、克制、面向 B2B；注册约 $31、续费约 $78/年的高定价本身就在筛选认真做国际业务的注册者——投机囤积少，好词存量反而比价格更低的后缀好。.world 是叙事画布：游戏与元宇宙的「某某世界」、跨文化社区、旅行与移民服务，「名词 + .world」当口号读（coffee.world、maker.world），hello.world 式组合还自带程序员梗；首年促销价常见十几到几十元，但续费会跳到两百元上下，预算要按续费价核算。判断标准：主体是公司、要传达的是「我们在全球做生意」→ .global 的正式感撑得起；主体是产品/社区、要传达的是「这是一个世界」→ .world 的想象力更值钱。反向提醒：小团队用 .global 口气大于实力会反噬，严肃 B2B 用 .world 又显得轻。",
      pickA: ["跨国公司国际主站与集团品牌页", "国际组织与行业联盟", "全球物流/支付/招聘服务", "高定价筛选后的好词存量"],
      pickB: ["游戏与虚拟世界/元宇宙项目", "跨文化社区与旅行/移民服务", "「xx 世界」式品牌叙事", "首年预算有限（促销价便宜）"],
    },
    en: {
      title: ".global vs .world: Corporate Statement vs Narrative Canvas",
      metaDescription:
        ".global is the formal declaration of multinational business at premium pricing; .world is the open narrative canvas with cheap first years. Compare vibe, price structure and fit, then hunt available names.",
      verdict:
        "Both suffixes say \"more than one market\", but their temperaments split cleanly. .global is a corporate statement: multinational main sites, group brand pages, international organizations and alliances — brand.global reads as \"BRAND, worldwide\": formal, restrained, B2B-facing. Its premium pricing (about $31 to register, $78/yr to renew) itself filters for serious international registrants, keeping speculation low and word inventory surprisingly good. .world is a narrative canvas: game and metaverse \"worlds\", cross-cultural communities, travel and immigration services — noun + .world reads like a slogan (coffee.world, maker.world), and hello.world combos carry a built-in programmer wink. First-year promos run a few dollars, but renewals jump to roughly $28/yr, so budget on the renewal price. The test: if the entity is a company and the message is \"we do business globally\" → .global's formality carries it; if the entity is a product or community and the message is \"this is a world\" → .world's imagination is worth more. Mind the reverse mismatches: a small team on .global overclaims and invites backlash, while serious B2B on .world reads light.",
      pickA: ["Multinational main sites & group brand pages", "International orgs and alliances", "Global logistics/payments/hiring services", "Premium-filtered word inventory"],
      pickB: ["Game and metaverse world projects", "Cross-cultural communities, travel & immigration", "\"X world\" brand narratives", "Tight first-year budget (cheap promos)"],
    },
  },
  "host-vs-cloud": {
    slug: "host-vs-cloud",
    a: "host",
    b: "cloud",
    zh: {
      title: ".host 和 .cloud 怎么选：托管行业词与云品类词的对比",
      metaDescription: ".host 精准指向主机托管行业但续费最贵，.cloud 覆盖更广的云与 SaaS 且价格中等。对比两者的语义宽度、价格结构与适用场景，并用 AI 猎取可注册的名字。",
      verdict:
        "两个后缀同属基础设施赛道，差别在语义的宽度和钱包的深度。.host 窄而准：虚拟主机与 VPS 服务商、游戏服务器托管、静态托管与部署平台、homelab 自建服务门户，name.host 读出来就是「某某托管」，「我们帮你跑起来」的定位不言自明；但价格结构要看清——首年常有 $5 上下的促销，续费约 $82/年，是典型的「首年便宜续费贵」，认真商用前先算多年成本。.cloud 宽而稳：云服务、SaaS、DevOps 工具、企业 IT 服务都装得下，面向企业客户时比 .io 更正式，价格中等、库存充足，还适合做客户实例域名的根域（app.acme.cloud）。判断标准：业务就是「托管」本身（卖主机、跑服务器）→ .host 的行业词精准且库存极好；业务是更广义的云产品或 SaaS → .cloud 的宽语义和低续费更稳。两个都别给非基础设施业务用——语义错位只会困惑用户。",
      pickA: ["虚拟主机与 VPS 服务商", "游戏服务器托管", "静态托管与部署平台", "以 host 结尾的 domain hack（g.host 式）"],
      pickB: ["云服务与 SaaS 产品", "企业 IT 与 DevOps 服务", "客户实例域名的根域（app.acme.cloud）", "续费预算敏感（.host 续费最贵档）"],
    },
    en: {
      title: ".host vs .cloud: The Hosting Trade Word vs the Cloud Category Word",
      metaDescription:
        ".host points squarely at the hosting trade but renews steep; .cloud covers the broader cloud/SaaS category at mid-range prices. Compare semantic width, price structure and fit, then hunt available names.",
      verdict:
        "Both suffixes live on the infrastructure track; the difference is semantic width versus wallet depth. .host is narrow and precise: web hosts and VPS providers, game-server hosting, static-hosting and deployment platforms, homelab portals — name.host reads as \"the NAME host\", making \"we run it for you\" self-evident. But read the price structure: first-year promos around $5 snap to roughly $82/yr renewals, a textbook cheap-year-one suffix, so price multi-year costs before committing commercially. .cloud is wide and steady: cloud services, SaaS, DevOps tools and enterprise IT all fit, it reads more professional than .io for B2B, pricing is mid-range with plentiful inventory, and it makes a great root domain for customer instances (app.acme.cloud). The test: if the business is hosting itself — selling servers, running workloads → .host's trade word is precise and its inventory excellent; if it's a broader cloud product or SaaS → .cloud's width and lower renewals are the safer hold. Neither belongs on a non-infrastructure business — mismatched semantics just confuse users.",
      pickA: ["Web hosts & VPS providers", "Game-server hosting", "Static hosting & deployment platforms", "Domain hacks on words ending in host (g.host)"],
      pickB: ["Cloud services & SaaS products", "Enterprise IT & DevOps services", "Root domain for customer instances (app.acme.cloud)", "Renewal-budget sensitive (.host renews steepest)"],
    },
  },
  "social-vs-com": {
    slug: "social-vs-com",
    a: "social",
    b: "com",
    zh: {
      title: ".social 和 .com 怎么选：社区身份词与通用默认值的对比",
      metaDescription: ".social 把社区语义写进后缀且是联邦宇宙惯例，.com 认知度最高但好名字近乎绝迹。对比两者的语义、价格与库存差异，并用 AI 猎取可注册的名字。",
      verdict:
        "先问一句：你做的是「社区」还是「公司」？做社区论坛、兴趣社群、Mastodon/Misskey 等联邦宇宙实例、创作者粉丝阵地，.social 的语义加成是 .com 给不了的——mastodon.social 已经完成了全网用户教育，圈内看到 .social 天然默认「这是个人聚起来的地方」，而同样的社区名在 .com 里九成已被注册或标着四五位数的溢价。反过来，做面向大众的正式公司主站、电商或需要口头传播的品牌，.com 的默认补全与信任度仍是最优解。价格上 .social 注册约 $7、续费约 $33/年，比 .com（约 $10/年）贵一档但可长期负担。务实的组合打法：社区阵地用 name.social 当主域，品牌起量后再收购对应 .com 做跳转——反着来（先守着贵价 .com 等社区长大）通常不划算。",
      pickA: ["社区论坛与兴趣社群", "Mastodon 等联邦宇宙实例", "创作者粉丝阵地与私域", "心仪社区名在 .com 已被注册"],
      pickB: ["面向大众的正式公司主站", "电商与线下业务", "口头传播场景多（广告、播客）", "长期品牌资产与转售价值"],
    },
    en: {
      title: ".social vs .com: Community Badge vs Universal Default",
      metaDescription:
        ".social writes community into the suffix and rules the Fediverse; .com has universal recognition but empty shelves. Compare semantics, pricing and inventory, then hunt available names.",
      verdict:
        "Start with one question: are you building a community or a company? For forums, interest groups, Mastodon/Misskey instances and creator fan hubs, .social carries a semantic bonus .com can't match — mastodon.social educated the whole internet, so insiders read name.social as \"a place where people gather\" by default, while the same community names on .com are long registered or priced at four-figure premiums. Conversely, for a mainstream company site, e-commerce or any brand spread by word of mouth, .com's autocomplete reflex and trust remain unbeatable. On price, .social runs about $7 to register and $33/yr to renew — a tier above .com's ~$10/yr but sustainable long-term. The pragmatic play: run the community on name.social as the primary domain, and acquire the matching .com for redirects once the brand has traction — waiting on an expensive .com before the community exists rarely pays.",
      pickA: ["Community forums & interest groups", "Mastodon / Fediverse instances", "Creator fan hubs & memberships", "Your community name is taken on .com"],
      pickB: ["Mainstream corporate main sites", "E-commerce and offline businesses", "Heavy word-of-mouth channels (ads, podcasts)", "Long-term brand asset and resale value"],
    },
  },
  "video-vs-tv": {
    slug: "video-vs-tv",
    a: "video",
    b: "tv",
    zh: {
      title: ".video 和 .tv 怎么选：内容形态词与频道气质词的对比",
      metaDescription: ".video 语义直白、价格温和、库存大开，.tv 有 Twitch 级行业地位但溢价更高。对比两者的气质、价格与适用场景，并用 AI 猎取可注册的名字。",
      verdict:
        "两个后缀都指向视频，分野在气质与钱包。.tv 是「频道感」：Twitch.tv 一个案例就奠定了它在直播与流媒体圈的行业地位，做直播平台、视频栏目、主播个人品牌，name.tv 读出来就像一个频道号，用户看到就期待「有内容可看」——代价是价格高于 .com 一截（为图瓦卢财政做贡献的溢价）。.video 是「形态感」：视频托管与剪辑工具、字幕与转码服务、课程平台、企业的视频专区（brand.video 放产品演示与教程库），语义更工具化、更中性；注册约 $8、续费约 $29/年，在行业词后缀里属温和一档，且库存大片空着——「xx视频」类词根在 .tv 与 .com 里早被抢完，.video 里命中率高得多。判断标准：品牌是「一个频道/一个节目」→ .tv 的频道气质与行业惯例更值；产品是「处理视频的工具或视频内容库」→ .video 更准更便宜。",
      pickA: ["视频托管/剪辑/字幕工具", "课程与视频 SaaS 平台", "品牌视频专区（brand.video）", "续费预算敏感、想要更高命中率"],
      pickB: ["直播平台与流媒体品牌", "视频栏目与节目名", "主播与频道个人品牌", "看重 Twitch 级行业惯例背书"],
    },
    en: {
      title: ".video vs .tv: The Format Word vs the Channel Vibe",
      metaDescription:
        ".video is literal, moderately priced and wide open; .tv carries Twitch-grade industry status at a premium. Compare vibe, pricing and fit, then hunt available names.",
      verdict:
        "Both suffixes point at video; the split is vibe versus wallet. .tv is channel energy: Twitch.tv single-handedly settled its status in streaming, so live platforms, video shows and streamer personal brands read name.tv like a channel handle — viewers expect something to watch. The cost is a real premium over .com (your contribution to Tuvalu's treasury). .video is format energy: hosting and editing tools, subtitle and transcoding services, course platforms, and corporate video hubs (brand.video for demos and tutorials) wear its more neutral, tool-like semantics well. At about $8 to register and $29/yr to renew it sits in the moderate tier, and inventory is wide open — video-flavored roots were hoarded on .tv and .com years ago but score dramatically better here. The test: if the brand is a channel or a show → .tv's vibe and industry convention earn the premium; if the product is a tool that processes video or a video library → .video is more precise and cheaper.",
      pickA: ["Video hosting / editing / subtitle tools", "Course & video SaaS platforms", "Corporate video hubs (brand.video)", "Renewal-sensitive with better availability odds"],
      pickB: ["Live-streaming platforms & media brands", "Video shows and program titles", "Streamer & channel personal brands", "Twitch-grade industry convention matters"],
    },
  },
  "fund-vs-finance": {
    slug: "fund-vs-finance",
    a: "fund",
    b: "finance",
    zh: {
      title: ".fund 和 .finance 怎么选：一只基金与一个行业的对比",
      metaDescription: ".fund 精准指向基金与募资，.finance 覆盖更宽的金融品类且是 DeFi 惯例。对比两者的语义宽度、价格与合规注意点，并用 AI 猎取可注册的名字。",
      verdict:
        "同属金融赛道的行业词，差别在语义的口径。.fund 窄而准：风投与私募基金官网（brand.fund 比 xxxcapital.com 短一截还更专业，VC 圈已有惯例）、加密基金与 DAO 金库、公益筹款页、奖学金计划——它说的是「一笔聚起来的钱」。.finance 宽而正：金融科技创业公司、记账与预算工具、财务咨询、企业财务 SaaS 都装得下，且 DeFi 圈已把它用成行业惯例（yearn.finance 完成了用户教育）。价格接近：.fund 注册约 $9、续费约 $57/年；.finance 首年 $7 上下、续费约 $52/年——都属续费偏高档，对管理真金白银的团队不值一提，副业试水要算清。共同的注意点：金融语义自带监管预期，页面必须放清楚主体信息与合规声明，否则会被当作募资骗局。判断标准：业务是「一只基金/一个募资计划」→ .fund 点题最准；业务是更广义的金融产品或工具 → .finance 的宽语义与 DeFi 惯例更稳。",
      pickA: ["风投与私募基金官网", "加密基金与 DAO 金库", "公益筹款与奖学金计划", "想要比 xxxcapital.com 更短的表达"],
      pickB: ["金融科技创业公司", "DeFi 与加密金融协议", "记账/预算/报销工具", "财务咨询与企业财务 SaaS"],
    },
    en: {
      title: ".fund vs .finance: One Fund vs a Whole Industry",
      metaDescription:
        ".fund points precisely at funds and fundraising; .finance covers the broader money category and rules DeFi. Compare semantic width, pricing and compliance, then hunt available names.",
      verdict:
        "Both are financial trade words; the difference is semantic aperture. .fund is narrow and precise: VC and private-equity fund sites (brand.fund beats the clunky xxxcapital.com — shorter and already a VC convention), crypto funds and DAO treasuries, charity fundraising pages and grant programs — it names \"a pool of money\". .finance is wide and formal: fintech startups, budgeting tools, advisory firms and corporate finance SaaS all fit, and DeFi made it an industry convention (yearn.finance educated the users). Pricing is comparable: .fund runs about $9 to register with renewals near $57/yr; .finance about $7 in year one with renewals near $52/yr — both renew steep, trivial for teams managing real money, worth budgeting for side projects. The shared caution: financial semantics invite regulatory expectations, so publish your legal entity and compliance details or risk reading like a scam. The test: if the business is a fund or a fundraising program → .fund names it exactly; if it's a broader financial product or tool → .finance's width and DeFi convention are the safer hold.",
      pickA: ["VC & private-equity fund sites", "Crypto funds & DAO treasuries", "Charity fundraising & grant programs", "A shorter read than xxxcapital.com"],
      pickB: ["Fintech startups", "DeFi & crypto-finance protocols", "Budgeting / expense / payment tools", "Advisory firms & corporate finance SaaS"],
    },
  },
  "land-vs-com": {
    slug: "land-vs-com",
    a: "land",
    b: "com",
    zh: {
      title: ".land 和 .com 怎么选：世界感行业词与通用默认值的对比",
      metaDescription: ".land 兼具「土地」与「乐园」双重语义且库存大开，.com 信任度最高但好名字绝迹。对比两者的语义、价格与断词玩法，并用 AI 猎取可注册的名字。",
      verdict:
        ".land 的胜负手是它的双重语义。字面层是「土地」：房产与土地交易平台、农场与农业项目、露营地与户外目的地，name.land 直接点题；引申层是「乐园/世界」：英语 -land 本就是「某某之地」的构词法（Disneyland 式），游戏世界、虚拟社区、元宇宙项目用它自带想象力，还有断词 hack 的加成（wonderland → wonder.land）。这些场景里，同样的词根在 .com 早被囤完或标着溢价，.land 却大片空着且中档价位（注册约 $9、续费约 $33/年）。.com 的优势依旧是那两条：用户默认补全、长期资产流动性最好——面向大众的正式品牌、与「土地/空间/世界」不沾边的业务，仍应首选 .com，硬用 .land 只会显得莫名其妙。判断标准：业务或品牌叙事里有「地」的意象 → .land 的语义与库存都是红利；没有 → 回到 .com 的安全区。",
      pickA: ["房产与土地交易平台", "农业与户外目的地项目", "游戏世界与元宇宙", "-land 结尾词的断词 hack（wonder.land）"],
      pickB: ["面向大众的正式品牌主站", "业务与土地/空间/世界无关", "长期资产与转售流动性", "口头传播多、怕拼写解释成本"],
    },
    en: {
      title: ".land vs .com: The World-Building Word vs the Universal Default",
      metaDescription:
        ".land carries both real-estate and theme-park semantics with wide-open inventory; .com has maximum trust but empty shelves. Compare semantics, pricing and domain hacks, then hunt available names.",
      verdict:
        ".land's edge is its double reading. The literal layer is land: real-estate and land marketplaces, farms and agriculture ventures, campgrounds and outdoor destinations — name.land says it outright. The figurative layer is worlds: English builds \"a place of X\" with -land (think Disneyland), so game worlds, virtual communities and metaverse projects wear it with built-in imagination, plus the domain-hack bonus (wonderland → wonder.land). In these niches the same roots are long hoarded or premium-priced on .com while .land sits wide open at mid-tier prices (about $9 to register, $33/yr to renew). .com's case remains the classic two: autocomplete reflex and the best long-term asset liquidity — mainstream brands, and any business unrelated to land, space or worlds, should still default to .com; forcing .land there just reads as random. The test: if your business or brand story carries the imagery of a place → .land's semantics and inventory are pure upside; if not → stay in .com's safety zone.",
      pickA: ["Real-estate & land marketplaces", "Agriculture & outdoor destinations", "Game worlds & metaverse projects", "Domain hacks on -land words (wonder.land)"],
      pickB: ["Mainstream consumer brand sites", "Businesses unrelated to land or worlds", "Long-term asset and resale liquidity", "Heavy word-of-mouth, low explanation budget"],
    },
  },
  "click-vs-link": {
    slug: "click-vs-link",
    a: "click",
    b: "link",
    zh: {
      title: ".click 和 .link 怎么选：动作号召与聚合语义的对比",
      metaDescription: ".click 念出来就是指令、价格全场最低，.link 语义即「链接聚合」且续费稳定。对比两者的语义、价格与信誉注意点，并用 AI 猎取可注册的名字。",
      verdict:
        "两个后缀都活在「跳转」的世界里，分工其实很清楚。.click 是动词：念出来就是一个指令——点它。营销活动落地页、下载/购买按钮背后的追踪域、campaign 专属短域用它自带行动号召（try.click、save.click），而且它是价格谷底：注册约 $2、续费约 $11/年，便宜到可以给每个 campaign 配一个专属域。.link 是名词：语义即「链接的聚合处」，link-in-bio 个人主页、导航站、资源合集、产品的分享短链域（主站 .com + 同名 .link 分享域）用它一眼即懂，价格亲民且续费稳定。共同的短板要认清：便宜后缀历来被垃圾邮件与钓鱼滥用，两者在部分邮件网关与安全网关的信誉分都偏低——都别做主品牌或发件域，养域名信誉是企业级用法的前置功课。判断标准：域名本身要当「按钮」用 → .click 的动作感无可替代；域名是「链接的家」→ .link 的聚合语义更准。",
      pickA: ["营销活动落地页与追踪域", "campaign 专属短域（每个活动一个）", "动词/口号型域名（try.click）", "预算极致敏感（全场最低价档）"],
      pickB: ["link-in-bio 个人主页聚合", "导航站与资源合集", "产品分享短链域（主站 .com 分工）", "看重续费长期稳定"],
    },
    en: {
      title: ".click vs .link: Call-to-Action vs Link-Hub Semantics",
      metaDescription:
        ".click reads as a spoken instruction at rock-bottom prices; .link means the place links live, with steady renewals. Compare semantics, pricing and reputation caveats, then hunt available names.",
      verdict:
        "Both suffixes live in the redirect business, and the division of labor is clean. .click is a verb: spoken aloud it's literally an instruction — click it. Campaign landing pages, tracking domains behind download/buy buttons and per-campaign short domains get a built-in call to action (try.click, save.click), and it's the price floor: about $2 to register and $11/yr to renew — cheap enough to give every campaign its own domain. .link is a noun: it means \"where the links live\" — link-in-bio hubs, navigation sites, resource collections and a product's share domain (main site on .com, the matching .link for shares) all read instantly, at friendly prices with unusually steady renewals. Own the shared weakness: bargain suffixes attract spam and phishing, and both score lower with some mail and security gateways — use neither as a primary brand or sending domain, and warm up reputation before enterprise-grade use. The test: if the domain itself is a button → .click's action feel is unmatched; if the domain is a home for links → .link's hub semantics are more precise.",
      pickA: ["Campaign landing pages & tracking domains", "A dedicated short domain per campaign", "Verb/slogan domains (try.click)", "Rock-bottom budget (cheapest tier)"],
      pickB: ["Link-in-bio personal hubs", "Navigation sites & resource collections", "Product share domains (paired with a .com)", "Long-term renewal stability matters"],
    },
  },
  "icu-vs-xyz": {
    slug: "icu-vs-xyz",
    a: "icu",
    b: "xyz",
    zh: {
      title: ".icu 和 .xyz 怎么选：低价三字母梗与年轻反叛旗帜的对比",
      metaDescription: ".icu 读作 I see you、长期持有成本几乎最低，.xyz 有 Alphabet 背书与 Web3 亚文化地位。对比两者的气质、价格结构与信誉注意点，并用 AI 猎取可注册的名字。",
      verdict:
        "两个都是「便宜且有态度」的后缀，态度的方向不同。.xyz 的资本是文化地位：Alphabet 用 abc.xyz 做官网给了它最高背书，Web3 与加密圈把它用成了亚文化旗帜——造词、梗词、实验代号配 .xyz 都很自由；但价格结构要看清，首年常常只要几块钱，续费会回到约首年十倍的正常水平。.icu 的资本是梗加长期成本：官方读法「I see you」自带社交彩蛋，监控/观测类工具与个人主页用它出彩（yourname.icu = 「看见你」），注册约 $3、续费约 $16/年——三字母后缀里几乎最低的长期持有成本，比 .xyz 的续费还友好。共同的暗面：两者都上过垃圾邮件统计的榜单，部分邮件服务与企业防火墙更敏感，严肃商业主站都要三思。中文用户再记一条：icu 在中文互联网常指「重症监护室」，医疗歧义要避开。判断标准：要 Web3/创意圈的身份信号 → .xyz；要梗、要三字母、要最低长期成本 → .icu。",
      pickA: ["监控与观测工具（玩 I see you 梗）", "个人主页与联系页", "低成本三字母短域刚需", "长期持有成本敏感（续费约 $16/年）"],
      pickB: ["Web3 与加密项目（圈内旗帜）", "创意实验与造词品牌", "看重 Alphabet（abc.xyz）级背书", "首年批量验证想法（几块钱一个）"],
    },
    en: {
      title: ".icu vs .xyz: The Bargain Three-Letter Pun vs the Young Rebel Flag",
      metaDescription:
        ".icu reads \"I see you\" with nearly the lowest holding cost; .xyz has Alphabet's endorsement and Web3 subculture status. Compare vibe, price structure and reputation caveats, then hunt available names.",
      verdict:
        "Both are cheap suffixes with attitude — pointed in different directions. .xyz's asset is cultural standing: Alphabet's abc.xyz gave it the ultimate endorsement, and Web3 turned it into a subculture flag — coined words, meme words and experiment codenames all fly free on .xyz. But read the price structure: first years often cost a few dollars while renewals snap back to roughly ten times that. .icu's asset is the pun plus holding cost: it officially reads \"I see you\", a built-in social wink that makes monitoring/observability tools and personal pages shine (yourname.icu = \"see you\"), at about $3 to register and $16/yr to renew — nearly the lowest long-term cost of any three-letter TLD, friendlier than .xyz's renewal. The shared shadow: both have appeared on spam-volume charts, so some mail services and corporate firewalls treat them warily — think twice for a serious commercial main site. One more note: in hospital contexts ICU means intensive care, so avoid medical-adjacent branding. The test: Web3/creative identity signal → .xyz; a pun, three letters and the lowest holding cost → .icu.",
      pickA: ["Monitoring & observability tools (the \"I see you\" pun)", "Personal home & contact pages", "Budget three-letter short domains", "Holding-cost sensitive (~$16/yr renewals)"],
      pickB: ["Web3 & crypto projects (the insider flag)", "Creative experiments & coined brands", "Alphabet-grade endorsement (abc.xyz)", "Bulk idea validation on cheap first years"],
    },
  },
  "page-vs-com": {
    slug: "page-vs-com",
    a: "page",
    b: "com",
    zh: {
      title: ".page 和 .com 怎么选：Google 系诚实定价与通用默认值的对比",
      metaDescription: ".page 由 Google 运营、全后缀强制 HTTPS 且注册续费同价，.com 认知度最高但好名字绝迹。对比两者的信任机制、价格与适用场景，并用 AI 猎取可注册的名字。",
      verdict:
        "两者的信任来源完全不同。.com 的信任来自三十年的用户习惯：口头传播时用户默认补全 .com，正式品牌主站、长期资产与转售流动性它仍是无可争议的第一——问题只有一个，好名字几乎绝迹，短词要么被囤要么标着溢价。.page 的信任来自技术强制：Google Registry 把整个后缀写进 HSTS 预加载列表，所有 .page 站点强制 HTTPS，浏览器直接拒绝不安全连接，这条硬规矩本身就是安全背书；语义上「page = 页面」，个人主页与简历页（yourname.page）、产品落地页、文档与更新日志站用它名正言顺，且库存大开、常用词命中率高。价格同样是 .page 的加分项：注册约 $11、续费同价——不打首年折扣也不涨续费，长期成本可预期，与 .com 的十来美元属同一量级。判断标准：做的是轻量、单一目的的「一页」（主页、落地页、文档）→ .page 的语义、库存与强制 HTTPS 都是红利；做面向大众的正式品牌主站、要长期持有与转售 → .com 的默认值地位仍然无可替代。",
      pickA: ["个人主页与简历页", "产品落地页与发布页", "文档与更新日志站", "心仪短词在 .com 已被注册"],
      pickB: ["面向大众的正式品牌主站", "长期品牌资产与转售流动性", "口头传播多、依赖默认补全", "多产品线的大型平台"],
    },
    en: {
      title: ".page vs .com: Google's Honest Pricing vs the Universal Default",
      metaDescription:
        ".page is Google-run, HTTPS-only, with identical registration and renewal pricing; .com has maximum recognition but empty shelves. Compare trust models, pricing and fit, then hunt available names.",
      verdict:
        "The two earn trust in completely different ways. .com's trust is thirty years of habit: users autocomplete .com when they hear a name, and for a formal brand site, a long-term asset or resale liquidity it remains the undisputed first choice — the only problem is that good names are essentially gone, hoarded or premium-priced. .page's trust is technically enforced: Google Registry put the entire TLD on the HSTS preload list, so every .page site is HTTPS-only and browsers refuse insecure connections — a hard rule that doubles as a security endorsement. Semantically \"page\" fits personal home and résumé pages (yourname.page), product landing pages, and docs or changelog sites naturally, with wide-open inventory where common words still hit. Pricing is another point for .page: about $11 to register and the same to renew — no first-year teaser, no renewal jump — predictable long-term cost in the same ballpark as .com. The test: building a lightweight single-purpose \"page\" (home page, landing page, docs) → .page's semantics, inventory and enforced HTTPS are pure upside; building a mainstream brand's primary site to hold and resell → .com's default status is still irreplaceable.",
      pickA: ["Personal home & résumé pages", "Product landing & launch pages", "Docs & changelog sites", "Your short word is taken on .com"],
      pickB: ["Mainstream consumer brand sites", "Long-term asset and resale liquidity", "Heavy word-of-mouth, autocomplete reflex", "Sprawling multi-product platforms"],
    },
  },
  "bio-vs-me": {
    slug: "bio-vs-me",
    a: "bio",
    b: "me",
    zh: {
      title: ".bio 和 .me 怎么选：创作者简介页与个人品牌的对比",
      metaDescription: ".bio 是「link in bio」时代的创作者暗号，.me 是最经典的个人品牌后缀。对比两者的语义、价格结构与适用场景，并用 AI 猎取可注册的名字。",
      verdict:
        "两个都是「个人」后缀，分界线在场景的具体程度。.bio 精准踩中创作者经济的暗号：社交平台人人都有一栏 bio，「link in bio」是全球创作者的通用话术，yourname.bio 天然就是你的链接聚合页与简介页——做的就是这件事时，语义精准度无可替代；它还有一层「生物/有机」语义，生物科技公司与有机品牌也用得名正言顺。.me 则是更宽的个人品牌画布：个人主页、简历站、开发者作品集、博客都装得下，还能拼动词短语域名（about.me、visit.me 式），二十年积累的认知度也更稳。价格结构差别要算清：.bio 首年常见约 $6 引流价但续费约 $58/年，长期持有明显更贵；.me 首年常有低价促销、续费约 $20/年量级，长期成本友好得多。判断标准：站点本体就是「简介 + 链接聚合」、面向粉丝与社交流量 → .bio 的场景语义直接命中；要做完整的个人站、博客、作品集并长期持有 → .me 的宽语义和低续费更划算。两者都想要时，成熟分法是 .me 做个人主站、.bio 挂链接聚合页。",
      pickA: ["创作者 link-in-bio 聚合页", "社交主页导流的简介页", "生物科技与有机品牌", "「bio」话术贴合的粉丝场景"],
      pickB: ["完整的个人主站与博客", "简历与开发者作品集", "动词短语域名（visit.me 式）", "长期持有、续费成本敏感"],
    },
    en: {
      title: ".bio vs .me: The Creator Bio Page vs the Personal Brand Classic",
      metaDescription:
        ".bio is the creator economy's \"link in bio\" password; .me is the classic personal-brand suffix. Compare semantics, price structure and fit, then hunt available names.",
      verdict:
        "Both are personal suffixes; the divide is how specific the scene is. .bio lands exactly on the creator economy's password: every social profile has a bio field, \"link in bio\" is the universal creator phrase, and yourname.bio reads instantly as your link hub and intro page — when that's literally what you're building, no other suffix matches the semantics; it also carries a second biology/organic reading that biotech companies and organic brands wear legitimately. .me is the wider personal-brand canvas: full personal sites, résumé pages, developer portfolios and blogs all fit, plus verb-phrase domain hacks (about.me, visit.me-style), backed by two decades of recognition. Do the price math: .bio often teases around $6 for year one but renews near $58/yr — noticeably expensive to hold; .me runs cheap first-year promos with renewals around the $20/yr tier, far friendlier long term. The test: if the site is a bio-plus-links hub fed by social traffic → .bio's scene-specific semantics hit directly; for a full personal site, blog or portfolio held for years → .me's broader meaning and lower renewals win. Want both? The mature split: .me for the personal main site, .bio for the link hub.",
      pickA: ["Creator link-in-bio hubs", "Intro pages fed by social profiles", "Biotech & organic brands", "Fan-facing scenes where \"bio\" is the word"],
      pickB: ["Full personal sites & blogs", "Résumés & developer portfolios", "Verb-phrase hacks (visit.me-style)", "Long-term holds, renewal-cost sensitive"],
    },
  },
  "ink-vs-art": {
    slug: "ink-vs-art",
    a: "ink",
    b: "art",
    zh: {
      title: ".ink 和 .art 怎么选：用墨的手艺与艺术圈名片的对比",
      metaDescription: ".ink 语义是「墨水」，纹身与写作行当的行话；.art 是艺术圈的通用名片。对比两者的语义口径、价格与圈层认同，并用 AI 猎取可注册的名字。",
      verdict:
        "两个都是创意后缀，口径一窄一宽。.ink 是行话：语义死死绑定「用墨的行当」——纹身圈把 ink 当自己人暗号（get inked = 去纹身），纹身工作室与刺青师用 name.ink 是最正统的用法；作家、书法家、插画与漫画作者、杂志出版项目也都贴切。它还有结构红利：三字母单音节，name.ink 往往比同名 .com 更短；首年约 $2 引流价、续费约 $26/年，试错几乎免费。.art 是名片：为整个艺术圈量身定制，艺术家作品集、画廊与美术馆、展览与创意机构用它身份一眼可辨，注册局长期面向艺术社区运营，圈内认可度在垂直后缀里属较高一档；语义比 .ink 宽得多——数字艺术、NFT、摄影、策展都装得下。价格上 .art 首年也常见低价、续费中档量级，两者长期成本相近。判断标准：业务与「墨」强相关（纹身、书写、插画、出版）→ .ink 的行话身份与短域名是独有红利；更宽的艺术创作与机构身份 → .art 的通用名片更稳。注意 .ink 与 .in 一字母之差，口头传播记得说清 i-n-k。",
      pickA: ["纹身工作室与刺青师", "作家与写作项目", "插画师与漫画作者", "三字母短域名刚需（name.ink 更短）"],
      pickB: ["艺术家作品集与个人站", "画廊、美术馆与展览", "设计与创意机构", "数字艺术与策展项目"],
    },
    en: {
      title: ".ink vs .art: The Ink Trade's Slang vs the Art World's Business Card",
      metaDescription:
        ".ink means ink — the tattoo and writing trades' slang; .art is the art world's universal badge. Compare semantic width, pricing and community credibility, then hunt available names.",
      verdict:
        "Both are creative suffixes; one is narrow, one is wide. .ink is trade slang: hard-bound to crafts that work in ink — tattoo culture owns the word (\"get inked\"), so studios and tattoo artists on name.ink wear the most authentic use; writers, calligraphers, illustrators, comic artists and publishing projects fit just as naturally. It also has a structural bonus: three letters, one syllable, so name.ink often beats the matching .com on length; at about $2 for year one and $26/yr to renew, trying it is nearly free. .art is the business card: purpose-built for the whole art world — artist portfolios, galleries and museums, exhibitions and creative agencies read instantly, and the registry has courted the art community for years, earning top-tier credibility among vertical suffixes; its semantics are far wider than .ink's, covering digital art, NFTs, photography and curation. .art also runs cheap first years with mid-tier renewals, so long-term costs are comparable. The test: if the work is literally about ink (tattoos, writing, illustration, publishing) → .ink's insider identity and shorter domain are unique upside; for broader artistic practice or institutional identity → .art's universal badge is the safer fit. One caution: .ink is one letter from .in — spell out i-n-k aloud.",
      pickA: ["Tattoo studios & artists", "Writers & writing projects", "Illustrators & comic artists", "Three-letter short-domain needs (name.ink)"],
      pickB: ["Artist portfolios & personal sites", "Galleries, museums & exhibitions", "Design & creative agencies", "Digital art & curation projects"],
    },
  },
  "moe-vs-fun": {
    slug: "moe-vs-fun",
    a: "moe",
    b: "fun",
    zh: {
      title: ".moe 和 .fun 怎么选：二次元身份牌与泛娱乐后缀的对比",
      metaDescription: ".moe 源自日语「萌え」、是 ACG 圈的文化身份牌，.fun 语义即「好玩」、覆盖一切泛娱乐。对比两者的圈层深度、价格与适用场景，并用 AI 猎取可注册的名字。",
      verdict:
        "两个都是「快乐」后缀，深度完全不同。.moe 是文化身份牌：源自日语「萌え」，由日本注册局 Interlink 专为二次元文化推出——动漫资讯站、同人社团与画师主页、VTuber 企划、字幕组与图站用 name.moe 等于亮明圈内身份，目标用户一眼共鸣，圈内真实用例的积累让它的文化认同度在小众后缀里数一数二；注册约 $13、续费同价，定价诚实无陷阱。.fun 是泛娱乐通配符：语义即「好玩」，小游戏站、互动营销页、趣味测试、派对与活动策划、玩具品牌都装得下，不挑圈层、谁都看得懂；首年常见一两美元的引流价，但续费会回到二十多美元的正常水平，长期成本要算清。判断标准很直接：受众是二次元圈内人 → .moe 的身份信号是 .fun 给不了的，圈内人看到 .moe 会心一笑、看到 .fun 只觉得普通；受众是泛大众、内容是广义的「好玩」→ .fun 的通用语义更稳，硬用 .moe 反而把圈外用户挡在门外。还要记住 .moe 的反面：文化属性极强，非 ACG 业务用它毫无意义；同人商用注意 IP 版权边界。",
      pickA: ["动漫资讯与评论站", "同人社团与画师主页", "VTuber 与虚拟偶像企划", "二次元社区与工具"],
      pickB: ["小游戏与休闲游戏站", "互动营销与趣味测试", "派对与活动策划", "面向泛大众的娱乐品牌"],
    },
    en: {
      title: ".moe vs .fun: The Anime Identity Badge vs the General Entertainment Suffix",
      metaDescription:
        ".moe comes from Japanese \"moe\" — the ACG culture badge; .fun means fun and covers all entertainment. Compare community depth, pricing and fit, then hunt available names.",
      verdict:
        "Both are happy suffixes at completely different depths. .moe is a cultural identity badge: born from Japanese 萌え and launched by registry Interlink specifically for otaku culture — anime news sites, doujin circles and illustrator pages, VTuber projects, fansub groups and art boards use name.moe as an insider signal their audience recognizes instantly, and years of real adoption give it top-tier cultural credibility among niche suffixes; about $13 to register and the same to renew — honest, no traps. .fun is the general entertainment wildcard: it just means fun, so casual game sites, interactive marketing pages, quizzes, party and event planning, and toy brands all fit — no subculture required, everyone gets it; year one often costs a dollar or two, but renewals snap back to the twenty-something range, so budget the hold. The test is blunt: if your audience lives inside anime culture → .moe sends a signal .fun never can — insiders smile at .moe and shrug at .fun; if your audience is the general public and the content is broadly \"fun\" → .fun's universal reading is safer, and forcing .moe would lock outsiders out. Remember .moe's flip side: the cultural identity is so strong that non-ACG businesses gain nothing, and commercial fan projects should mind franchise IP rights.",
      pickA: ["Anime news & review sites", "Doujin circles & illustrator pages", "VTuber & virtual idol projects", "Otaku communities & tools"],
      pickB: ["Casual & mini-game sites", "Interactive marketing & quizzes", "Party & event planning", "Mass-audience entertainment brands"],
    },
  },
  "lol-vs-gg": {
    slug: "lol-vs-gg",
    a: "lol",
    b: "gg",
    zh: {
      title: ".lol 和 .gg 怎么选：梗后缀与电竞行货的对比",
      metaDescription: ".lol 就是「laughing out loud」、自带笑点且价格便宜，.gg 是游戏电竞圈的行货后缀（good game）。对比两者的气质、价格与信任差异，并用 AI 猎取可注册的名字。",
      verdict:
        "两个后缀在游戏圈有交集（LOL 既是「大笑」也是英雄联盟），但气质完全不同。.lol 是梗：XYZ Registry 运营，语义就是全世界最通用的「哈哈哈」——梗图与段子站、搞笑视频、恶搞与愚人节页面用 name.lol 域名本身就是内容的一部分；首年约 $2、续费约 $26/年，整活成本忽略不计，英雄联盟社区还能玩双关。.gg 是行货：源自电竞礼仪「good game」，Discord（discord.gg）把它用成了游戏圈基础设施的一部分，游戏工作室、战队与赛事、游戏工具与社区用 .gg 是圈内公认的正式选择——它传达的是「认真做游戏」，而非玩笑。代价是价格：.gg 是根西岛国家后缀，注册与续费都明显偏贵（几十美元一年量级），首年也没有低价钩子。判断标准：内容以幽默、整活、梗为核心 → .lol 的笑点与白菜价无可替代；做正式的游戏产品、战队、工具或社区 → .gg 的圈内信任值回票价。反着用都亏：严肃游戏产品挂 .lol 显得不专业，纯整活页面用 .gg 又白花钱。预算允许的战队/厂牌可以两个都拿：.gg 做正式门面，.lol 做梗营销页。",
      pickA: ["梗图与段子站", "搞笑视频与整活企划", "恶搞与愚人节页面", "预算极致敏感的趣味项目"],
      pickB: ["游戏工作室与产品官网", "战队与电竞赛事", "游戏工具与社区（Discord 生态）", "看重圈内正式信任感"],
    },
    en: {
      title: ".lol vs .gg: The Meme Suffix vs Esports Standard Issue",
      metaDescription:
        ".lol is literally \"laughing out loud\" — built-in humor at bargain prices; .gg is gaming's standard-issue suffix (good game). Compare vibe, pricing and trust, then hunt available names.",
      verdict:
        "The two overlap in gaming (LOL is both the laugh and League of Legends) but wear completely different vibes. .lol is the meme: run by XYZ Registry, it's the internet's universal laugh — meme and joke sites, comedy video projects, prank and April Fools' pages get a built-in punchline where the domain is part of the content; at about $2 for year one and $26/yr to renew, a gag page costs nothing, with a bonus pun for League communities. .gg is standard issue: born from the esports courtesy \"good game\" and cemented by Discord (discord.gg) as part of gaming's infrastructure, it's the recognized formal choice for game studios, esports teams and events, gaming tools and communities — it says \"serious about games\", not \"joking\". The price is the price: .gg is Guernsey's ccTLD and costs noticeably more to register and renew (tens of dollars a year, no teaser). The test: if humor and memes are the content → .lol's punchline and bargain price are unmatched; building a real game product, team, tool or community → .gg's insider trust earns its cost. Cross them and you lose both ways: a serious game on .lol reads unprofessional, a gag page on .gg wastes money. Teams with budget take both: .gg as the formal front door, .lol for meme marketing.",
      pickA: ["Meme & joke sites", "Comedy video projects", "Prank & April Fools' pages", "Rock-bottom budget fun projects"],
      pickB: ["Game studios & product sites", "Esports teams & events", "Gaming tools & communities (Discord ecosystem)", "Formal insider trust matters"],
    },
  },
  "uk-vs-com": {
    slug: "uk-vs-com",
    a: "uk",
    b: "com",
    zh: {
      title: ".uk 和 .com 怎么选：英国本地信任与全球默认值的对比",
      metaDescription: ".uk 是英国国家域名、本地信任度与本地 SEO 双加成，.com 全球通用但好名字绝迹。对比两者的市场定位、合规要求与品牌策略，并用 AI 猎取可注册的名字。",
      verdict:
        "和所有「ccTLD vs .com」的选择一样，看用户在哪里。主攻英国市场时 .uk 几乎是标配：Nominet 运营超过 25 年、上千万注册量，英国消费者把 .uk/.co.uk 当「本地生意」的默认信号，信任度远超一般新后缀；Google 也会把 .uk 站点与英国地区相关联，本地 SEO 有天然加成。2014 年起可直接注册二级 .uk，name.uk 比 name.co.uk 短一截也更现代；注册约 $6、续费同价，ccTLD 里的良心价。面向全球用户或计划出海，.com 的认知度无可替代——口头传播默认补全、长期资产流动性最好。预算允许的成熟英国品牌通常两个都拿：.uk（连同 .co.uk）做本地门面或防抢注，.com 做国际主站。两条 .uk 特有的注意事项：Nominet 要求注册人提供英国境内送达地址，海外注册人需确认注册商代理支持；同名 .co.uk 若在他人手里，先评估品牌混淆风险再入场。判断标准：用户、物流、合规都在英国 → .uk 的本地信任是 .com 给不了的；全球市场 → .com 仍是安全区。",
      pickA: ["面向英国市场的电商", "英国本地服务与商铺", "英国媒体与内容站", "在英品牌与机构官网"],
      pickB: ["面向全球用户或计划出海", "品牌主站与长期资产", "口头传播多、依赖默认补全", "转售流动性最好"],
    },
    en: {
      title: ".uk vs .com: British Local Trust vs the Global Default",
      metaDescription:
        ".uk is the UK's country domain with local trust and local-SEO upside; .com is the global default with empty shelves. Compare market focus, compliance and brand strategy, then hunt available names.",
      verdict:
        "As with every ccTLD-versus-.com call, it comes down to where your users are. For a UK-focused business, .uk is near-mandatory: run by Nominet for over 25 years with registrations in the tens of millions, British consumers read .uk/.co.uk as the default signal of a local business — trust far beyond any new gTLD — and Google geo-associates .uk sites with the UK, a free local-SEO boost. Since 2014 you can register directly at the second level, and name.uk is shorter and more modern than name.co.uk; about $6 to register with the same renewal — honest ccTLD pricing. For a global audience, .com's recognition is irreplaceable — autocomplete reflex and the best long-term asset liquidity. Established UK brands with budget usually take both: .uk (plus .co.uk) as the local front door or defensively, .com as the international main site. Two .uk-specific cautions: Nominet requires a UK address for service, so overseas registrants must confirm their registrar proxies it; and if someone else holds the matching .co.uk, weigh the brand-confusion risk before committing. The test: users, logistics and compliance all in the UK → .uk delivers local trust .com can't; global market → .com remains the safety zone.",
      pickA: ["UK-facing e-commerce", "Local UK services & shops", "British media & content sites", "UK brand & institution sites"],
      pickB: ["Global audience or expansion plans", "Primary brand site and long-term asset", "Heavy word-of-mouth, autocomplete reflex", "Best resale liquidity"],
    },
  },
  "io-vs-sh": {
    slug: "io-vs-sh",
    a: "io",
    b: "sh",
    zh: {
      title: ".io 和 .sh 怎么选：开发者两大极客后缀的对比",
      metaDescription: ".io 是开发者工具的主流身份后缀，.sh 撞上 shell 脚本梗、更小众也更锋利。对比两者的圈层认知、价格与适用场景，并用 AI 猎取可注册的名字。",
      verdict:
        "两个都是开发者圈的身份后缀，区别在宽度与锐度。.io 是主流：I/O（输入/输出）的联想加上 GitHub Pages（github.io）多年的用户教育，让它成为开发者工具、SaaS、API 服务的默认技术后缀——圈内圈外都认识，投资人和媒体也见怪不怪，是技术产品里最「安全」的非 .com 选择。.sh 更锋利也更小众：圣赫勒拿岛的国家后缀撞上 Unix shell 的 .sh 脚本扩展名，CLI 工具、终端产品、DevOps 服务用「动词 + .sh」读起来就像一条命令（类似 fig.sh、warp.sh 的玩法），对味的用户一眼会心，但圈外人完全不懂梗。价格上两者都不便宜（均为几十美元/年量级），.sh 通常还略贵一点。判断标准：产品面向广义技术用户（SaaS、API、平台）→ .io 的普适技术认知更稳；产品就是给终端里的人用的（CLI、脚本、DevOps）→ .sh 的命令感是 .io 给不了的，且同样的短词 .sh 下库存更好。两个都是国家后缀，理论上受注册局政策影响，重要品牌注意续费与政策动向。",
      pickA: ["开发者工具与 SaaS 平台", "API 服务与技术社区", "需要圈外（投资人/媒体）也认识", "主流技术品牌的长期主域名"],
      pickB: ["CLI 与终端工具", "DevOps 与脚本类产品", "「动词 + .sh」命令感命名", "心仪短词在 .io 已被注册"],
    },
    en: {
      title: ".io vs .sh: Developer Suffix Showdown",
      metaDescription:
        ".io is the mainstream developer badge; .sh rides the shell-script pun — sharper but nichier. Compare recognition, pricing and fit, then hunt available names.",
      verdict:
        "Both are developer identity suffixes; the difference is breadth versus edge. .io is mainstream: the I/O association plus years of GitHub Pages (github.io) education made it the default technical suffix for dev tools, SaaS and API services — recognized inside and outside the community, unremarkable to investors and press, the safest non-.com choice for a technical product. .sh is sharper and nichier: Saint Helena's ccTLD collides with the Unix shell's .sh script extension, so CLI tools, terminal products and DevOps services on a verb + .sh domain read like a literal command (the fig.sh / warp.sh play) — insiders smile instantly, outsiders miss the joke entirely. Neither is cheap (both run tens of dollars a year), with .sh usually slightly pricier. The test: a product for the broad technical audience (SaaS, APIs, platforms) → .io's universal tech recognition is steadier; a product for people who live in a terminal (CLI, scripts, DevOps) → .sh delivers a command-line vibe .io can't, and the same short words are far more available on .sh. Both are ccTLDs, so keep an eye on registry policy and renewals for critical brands.",
      pickA: ["Developer tools & SaaS platforms", "API services & tech communities", "Recognition beyond the community (investors, press)", "Long-term primary domain for a tech brand"],
      pickB: ["CLI & terminal tools", "DevOps & scripting products", "Verb + .sh command-style naming", "Your short word is taken on .io"],
    },
  },
  "blog-vs-me": {
    slug: "blog-vs-me",
    a: "blog",
    b: "me",
    zh: {
      title: ".blog 和 .me 怎么选：写作者与个人品牌后缀的对比",
      metaDescription: ".blog 一眼读成「某某的博客」、专为写作者而生，.me 是个人品牌的通用后缀、还能拼动词短语。对比两者的定位、价格与适用场景，并用 AI 猎取可注册的名字。",
      verdict:
        "两个都是「个人」后缀，回答的问题不同。.blog 回答「这里是什么」：由 WordPress 母公司 Automattic 旗下注册局运营，name.blog 天然读成「某某的博客」，读者零解释就知道来这里是读内容的——个人博客、独立写作者、Newsletter 网页版、品牌内容分站（brand.blog 配 brand.com）都名正言顺；首年常见 $3 上下、续费约 $21/年，对个人创作者可长期负担。.me 回答「这里是谁」：黑山国家后缀借「me＝我」成为个人品牌的通用后缀，个人主页、简历站、作品集用 name.me 一眼就懂，且不把你锁死在「博客」这一种形态——今天写博客、明天放作品集、后天挂产品都不违和；还有独门的动词短语玩法（hire.me、about.me 一类）。价格与 .com 接近，常见人名昵称的库存远好于 .com。判断标准：内容写作就是主体、希望域名自带「来读我」的信号 → .blog 语义更准；做的是完整的个人 IP（写作只是其中一块）或想要动词短语域名 → .me 的弹性更大。两个都别用来做企业官网——它们的气质就是个人的。",
      pickA: ["个人博客与独立写作者", "Newsletter 的网页版", "品牌内容分站（brand.blog）", "以「读内容」为核心的站点"],
      pickB: ["个人主页与简历站", "开发者/设计师作品集", "动词短语域名（hire.me 类）", "形态会演进的个人 IP 主阵地"],
    },
    en: {
      title: ".blog vs .me: The Writer's Suffix vs the Personal Brand Suffix",
      metaDescription:
        ".blog parses instantly as \"NAME's blog\" — built for writers; .me is the all-purpose personal-brand suffix with verb-phrase tricks. Compare fit and pricing, then hunt available names.",
      verdict:
        "Both are personal suffixes answering different questions. .blog answers \"what is this place\": run by a registry under Automattic (the WordPress company), name.blog literally parses as \"NAME's blog\" — readers need zero explanation that this is where you read. Personal blogs, independent writers, the web home of a newsletter, and brand content satellites (brand.blog alongside brand.com) all wear it naturally; around $3 for year one and roughly $21/yr to renew, sustainable for individual creators. .me answers \"who is this\": Montenegro's ccTLD turned universal personal-brand suffix via the me = I reading — personal homepages, résumé sites and portfolios on name.me are instantly clear, and it doesn't lock you into the blog format: write today, showcase a portfolio tomorrow, launch a product later, all without friction; plus the signature verb-phrase play (hire.me, about.me style). Pricing sits near .com with far better availability for real names and nicknames. The test: writing is the product and you want the domain itself to say \"come read\" → .blog is semantically sharper; you're building a whole personal brand where writing is one piece, or want a verb-phrase domain → .me flexes further. Neither belongs on a corporate main site — their vibe is personal by design.",
      pickA: ["Personal blogs & independent writers", "Web home of a newsletter", "Brand content satellites (brand.blog)", "Sites whose core action is reading"],
      pickB: ["Personal homepages & résumé sites", "Developer/designer portfolios", "Verb-phrase domains (hire.me style)", "Evolving personal-brand home bases"],
    },
  },
  "org-vs-co": {
    slug: "org-vs-co",
    a: "org",
    b: "co",
    zh: {
      title: ".org 和 .co 怎么选：公信力与商业感的对比",
      metaDescription: ".org 自带非营利与公益的公信力，.co 是「company」的现代商业速记。对比两者的气质、信任来源与适用场景，并用 AI 猎取可注册的名字。",
      verdict:
        "两个后缀的信任来源完全相反。.org 的信任来自「不为赚钱」：三十多年的历史让用户默认 .org 背后是非营利组织、开源项目、行业协会或公益机构——维基百科（wikipedia.org）与无数开源官网完成了全球用户教育，捐款页、志愿者招募、标准组织用 .org 天然可信；价格与 .com 相当，好词库存明显更好。.co 的信任来自「就是生意」：哥伦比亚国家后缀被全球重塑为 company 的速记，比 .com 少一个字母、气质更轻更现代，创业公司、品牌先行的商业产品用 .co 显得利落。把它们用反是真实的伤害：商业产品挂 .org 会让用户产生「这是公益？」的错位感，甚至有借公信力营销的嫌疑；非营利组织用 .co 则平白丢掉品类信任。还有两条实操注意：.co 的输入流量会漏向同名 .com（注册前先查 .com 在谁手里）；.org 虽无注册限制、商业公司也能注册，但语义惯性极强，别硬顶。判断标准：组织的叙事是使命与公益 → .org 的公信力是花钱买不到的；叙事是产品与增长 → .co 的商业感更顺。",
      pickA: ["非营利组织与基金会", "开源项目与技术社区", "行业协会与标准组织", "公益活动与捐赠页"],
      pickB: ["创业公司与商业品牌", "品牌词独特、.com 已被注册", "想要比 .com 更短更现代", "产品与增长叙事的主站"],
    },
    en: {
      title: ".org vs .co: Institutional Trust vs Startup Energy",
      metaDescription:
        ".org carries nonprofit-grade credibility; .co is modern shorthand for company. Compare where each suffix's trust comes from and which fits, then hunt available names.",
      verdict:
        "The two suffixes earn trust from opposite directions. .org's trust comes from not being about money: three decades of history taught users that .org means a nonprofit, an open-source project, an industry association or a public-interest institution — Wikipedia and countless open-source homepages finished the global education, so donation pages, volunteer drives and standards bodies read instantly credible on .org; pricing sits near .com with far better availability. .co's trust comes from being exactly about business: Colombia's ccTLD rebranded globally as shorthand for company, one letter shorter than .com and lighter, more modern in tone — startups and brand-first commercial products look sharp on .co. Crossing them does real damage: a commercial product on .org confuses users (\"is this a charity?\") and can smell like borrowed credibility, while a nonprofit on .co throws away category trust for nothing. Two practical notes: .co leaks type-in traffic to the matching .com (check who holds it first), and while .org has no registration restrictions — companies can register it — the semantic gravity is strong, so don't fight it. The test: if your story is mission and public good → .org's institutional credibility can't be bought elsewhere; if your story is product and growth → .co fits the pitch.",
      pickA: ["Nonprofits & foundations", "Open-source projects & communities", "Industry associations & standards bodies", "Campaigns & donation pages"],
      pickB: ["Startups & commercial brands", "Distinctive brand word whose .com is taken", "Shorter, more modern than .com", "Product-and-growth main sites"],
    },
  },
  "app-vs-site": {
    slug: "app-vs-site",
    a: "app",
    b: "site",
    zh: {
      title: ".app 和 .site 怎么选：产品信号与万能白纸的对比",
      metaDescription: ".app 语义即应用、还强制 HTTPS，.site 是不预设行业的中性后缀、价格极低。对比两者的语义强度、价格与适用场景，并用 AI 猎取可注册的名字。",
      verdict:
        "一个语义极强，一个语义为零。.app 由 Google 运营，是少数带硬性安全保证的后缀——整个区强制 HSTS 预载，浏览器直接拒绝不安全连接；语义上零解释成本：用户看到 name.app 就知道是个应用，下载落地页、Web App、PWA、效率工具用它天生合身，价格适中（续费略高于 .com）、干净的产品词库存远好于 .com。.site 则是「白纸」：不预设行业、不限定气质，什么网站都装得下——作品集、文档站、社区、临时项目都行；首年常低至一两美元、库存几乎无限，但中性也意味着它不为品牌加分，一切靠主体名撑，且首年与续费价差大要算清。判断标准：产品就是一个应用、希望域名本身完成定位 → .app 的品类信号与安全背书是 .site 给不了的；还在验证想法、要快速上线、或做主品牌的配套子站（文档、工具、活动页）→ .site 的成本几乎可以忽略。注意 .app 的边界同样清晰：不是应用的业务（内容站、电商、企业官网）硬用 .app 会错位；而认真的长期产品用 .site 做主域名，气质上会显得临时。",
      pickA: ["移动/桌面应用的官网与下载页", "Web App 与 PWA", "效率与实用工具产品", "看重强制 HTTPS 的安全背书"],
      pickB: ["快速验证的想法与临时项目", "主品牌的配套子站（文档/工具）", "预算敏感、要立刻上线", "不带行业暗示的中性站点"],
    },
    en: {
      title: ".app vs .site: The Product Signal vs the Blank Canvas",
      metaDescription:
        ".app means application and enforces HTTPS; .site presumes nothing and costs almost nothing. Compare semantic strength, pricing and fit, then hunt available names.",
      verdict:
        "One suffix is all signal, the other is deliberately blank. .app, operated by Google, is among the few TLDs with a hard security guarantee — the whole zone is HSTS-preloaded, so browsers refuse insecure connections outright; semantically it costs zero explanation: users see name.app and know it's an application. Download landing pages, web apps, PWAs and utility tools fit natively, at moderate prices (renewals slightly above .com) with far better inventory of clean product words than .com. .site is the blank canvas: no industry assumption, no vibe — portfolios, docs sites, communities and temporary projects all fit; year one often costs a dollar or two with near-infinite inventory, but neutrality means it adds nothing to your brand — the name must carry everything — and the first-year-to-renewal price gap deserves a look. The test: your product is an app and you want the domain to do the positioning → .app's category signal and security pedigree are things .site can't offer; you're validating an idea, need to ship today, or want a satellite site for a main brand (docs, tools, campaign pages) → .site's cost rounds to zero. Mind .app's boundary too: non-app businesses (content, e-commerce, corporate sites) look misplaced on it — and a serious long-term product on a .site main domain reads temporary.",
      pickA: ["App homepages & download pages", "Web apps & PWAs", "Utility & productivity products", "HSTS-enforced security pedigree matters"],
      pickB: ["Quick idea validation & temporary projects", "Satellite sites for a main brand (docs/tools)", "Budget-sensitive, ship-today launches", "Neutral sites with no industry hint"],
    },
  },
  "com-vs-top": {
    slug: "com-vs-top",
    a: "com",
    b: "top",
    zh: {
      title: ".com 和 .top 怎么选：全球默认值与极致性价比的对比",
      metaDescription: ".com 是全球默认后缀但好名字绝迹，.top 注册量位居新后缀前列、价格极低且可正常备案。对比两者的信任、价格与适用场景，并用 AI 猎取可注册的名字。",
      verdict:
        "这是「信任溢价」与「极致性价比」的选择。.com 的优势不用重复：全球默认补全、最强转售流动性、跨行业跨地域通吃——代价是好名字几乎绝迹，心仪的词大概率要花大钱收购。.top 走另一条路：注册量常年位居新后缀前列，在国内市场尤其活跃——通过工信部资质、可正常 ICP 备案，价格常年处于最低档，双拼、行业词、品牌词基本都能注册到，「top＝顶尖」的含义用在排行榜、精选、评测类站点上还很顺滑。但要坦率算上它的隐性成本：极低的价格吸引了大量批量注册与低质站点，部分海外邮件服务和安全系统对 .top 的信任评分偏低——依赖邮件送达或面向海外用户的业务要慎重。判断标准：面向国际用户、品牌要长期持有转售 → .com 的信任溢价值得付；国内个人项目、内容站、排行榜类产品、或给主品牌批量注册保护性域名 → .top 的价格优势是实打实的。折中策略也常见：主站用 .com（或收购预算内的其他主流后缀），.top 做活动页、内容矩阵与防御性注册。",
      pickA: ["面向国际用户或计划出海", "品牌主站与长期资产", "依赖邮件送达的业务", "希望转售流动性最好"],
      pickB: ["国内个人项目与内容站", "排行榜、精选、评测类站点", "预算极致敏感的起步项目", "批量注册保护性域名"],
    },
    en: {
      title: ".com vs .top: The Global Default vs Rock-Bottom Pricing",
      metaDescription:
        ".com is the global default with empty shelves; .top leads new-gTLD registration charts at rock-bottom prices. Compare trust, cost and fit, then hunt available names.",
      verdict:
        "This is a trade between trust premium and raw value. .com's case needs no repeating: universal autocomplete, the best resale liquidity, works across every industry and geography — the cost is that good names are essentially extinct, and the word you want likely means an expensive acquisition. .top runs the opposite play: perennially near the top of new-gTLD registration charts and especially active in the Chinese market — it's MIIT-accredited so ICP filing works normally, prices sit in the lowest tier year-round, and pinyin pairs, industry words and brand words are almost all still available; the top = best reading even fits ranking, curation and review sites naturally. Be honest about the hidden cost though: rock-bottom pricing attracts bulk registrations and low-quality sites, so some overseas mail services and security systems score .top's trust lower — think twice if your business depends on email deliverability or targets international users. The test: international audience, long-term brand asset → .com's trust premium is worth paying; China-focused personal projects, content sites, ranking products, or bulk defensive registrations for a main brand → .top's price advantage is real money saved. The hybrid play is common too: .com (or another mainstream suffix within budget) as the main site, .top for campaign pages, content networks and defensive coverage.",
      pickA: ["International or global audience", "Primary brand site and long-term asset", "Email-deliverability-dependent businesses", "Best resale liquidity"],
      pickB: ["China-focused personal projects & content sites", "Ranking, curation & review sites", "Rock-bottom budget launches", "Bulk defensive registrations"],
    },
  },
  "info-vs-com": {
    slug: "info-vs-com",
    a: "info",
    b: "com",
    zh: {
      title: ".info 和 .com 怎么选：信息站专属与商业默认值的对比",
      metaDescription: ".info 语义即「信息」、首年极便宜，适合资料站与文档；.com 是商业主站的默认值。对比两者的语义、价格与适用场景，并用 AI 猎取可注册的名字。",
      verdict:
        "两个后缀各守一个场景，重叠比想象中少。.info 是 2001 年第一批新通用后缀之一，语义就是「信息」：资料站、行业百科、开源项目文档、活动信息页、产品说明站用它顺理成章，二十多年历史让它的认知度在非 .com 后缀里名列前茅；首年价常年极低（经常一两美元），给主品牌配一个信息子站（brand.info 放文档与说明）的成本几乎可以忽略。但它的短板同样来自低价与历史：曾被大量垃圾站使用，直接做商业主站的信任感明显弱于 .com，且续费价比首年高数倍。.com 则是商业主站的默认值：用户口头传播时默认补全、跨行业通吃、长期资产流动性最好——如果站点要收钱、要建立品牌、要长期经营，.com 的信任基础难以替代。判断标准：站点的角色是「提供信息」（百科、文档、指南、活动页）→ .info 语义精准且起步成本极低；站点的角色是「经营生意」→ 别为省首年几美元把主品牌放在 .info 上，信任折价会一直伴随你。最常见的正确用法其实是组合：.com 做主站，.info 做配套的资料/文档分站。",
      pickA: ["行业百科与资料站", "开源项目与产品文档", "活动与会议信息页", "主品牌的信息子站（brand.info）"],
      pickB: ["商业主站与品牌官网", "电商与需要收款的业务", "长期品牌资产与转售", "口头传播场景多（广告、播客）"],
    },
    en: {
      title: ".info vs .com: The Information Suffix vs the Commercial Default",
      metaDescription:
        ".info literally means information — dirt-cheap year one, ideal for docs and reference sites; .com is the commercial default. Compare semantics, pricing and fit, then hunt available names.",
      verdict:
        "Each suffix owns one scenario, and they overlap less than you'd think. .info was in the first wave of new gTLDs back in 2001 and means exactly what it says: reference sites, industry wikis, open-source docs, event information pages and product manuals wear it naturally, with two decades of history putting its recognition near the top of non-.com suffixes; first-year pricing is perennially tiny (often a dollar or two), so giving a main brand an information satellite (brand.info for docs and guides) costs nearly nothing. Its weakness comes from the same cheapness and history: heavy past spam usage means noticeably weaker trust than .com for a commercial main site, and renewals run several times the intro price. .com is the commercial default: word-of-mouth autocompletes to it, it works across every industry, and it holds the best long-term asset liquidity — if the site takes money, builds a brand and runs for years, .com's trust base is hard to replace. The test: the site's job is providing information (wikis, docs, guides, event pages) → .info is semantically precise with near-zero startup cost; the site's job is running a business → don't park your main brand on .info to save a few first-year dollars, because the trust discount follows you forever. The most common right answer is the combo: .com as the main site, .info as the companion reference/docs satellite.",
      pickA: ["Industry wikis & reference sites", "Open-source & product documentation", "Event & conference info pages", "Information satellites for a main brand (brand.info)"],
      pickB: ["Commercial main sites & brand homes", "E-commerce & payment-taking businesses", "Long-term brand asset and resale", "Heavy word-of-mouth channels (ads, podcasts)"],
    },
  },
  "cc-vs-com": {
    slug: "cc-vs-com",
    a: "cc",
    b: "com",
    zh: {
      title: ".cc 和 .com 怎么选：最像 .com 的替补与默认值本尊的对比",
      metaDescription: ".cc 视觉上最接近 .com、库存好得多；.com 是全球默认值但好名字绝迹。对比两者的信任、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "在所有 .com 替补里，.cc 是「长得最像」的一个：同样两个字母、同样干净利落，口头念出来也顺（cc 常被解读为 company/community/creative content）。它本是科科斯群岛的国家代码，但早已全球开放注册、按通用后缀运营，国内可正常备案，短域名与双拼库存远好于 .com——同一份名单在 .cc 下的命中率高出一大截，价格也常年温和。但要诚实面对差距：用户口头传播时默认补全的仍是 .com，如果你的 .cc 对应的 .com 在别人手里且在运营，分流与品牌混淆会长期存在；转售市场上 .cc 的流动性也远不及 .com（顶级短 .cc 除外）。判断标准：品牌词足够独特、或者你要的短名字 / 双拼在 .com 下只能高价收购 → .cc 是性价比最高的平替，先上线再图 .com 完全可行；品牌词常见、依赖口碑传播、或者要做长期持有的核心资产 → 咬牙上 .com，替补省下的钱迟早要在品牌混淆上还回去。",
      pickA: ["心仪短名字/双拼在 .com 已被注册", "预算有限先上线的新项目", "创意、社区、内容类品牌（cc 语义顺）", "想要更高的可注册命中率"],
      pickB: ["品牌词常见、怕分流混淆", "长期品牌资产与转售", "口头传播场景多（广告、播客）", "面向大众的正式商业品牌"],
    },
    en: {
      title: ".cc vs .com: The Closest Lookalike vs the Real Default",
      metaDescription:
        ".cc looks the most like .com with far better inventory; .com is the global default with empty shelves. Compare trust, pricing and fit, then hunt names available on both.",
      verdict:
        "Among all .com substitutes, .cc is the closest lookalike: the same two letters, the same clean read, and it says well out loud (cc is often read as company, community or creative content). Technically the country code of the Cocos Islands, it has long been open to global registration and run like a generic suffix, with short names and brandable words in far better supply than .com — the same shortlist scores dramatically more hits on .cc, at consistently moderate prices. Be honest about the gap though: word-of-mouth still autocompletes to .com, so if the matching .com is owned and operated by someone else, traffic leakage and brand confusion never fully go away; resale liquidity for .cc also trails .com by a wide margin (elite short .cc names excepted). The test: your brand word is distinctive, or the short name you want on .com means an expensive acquisition → .cc is the best-value stand-in, and launching on it now while eyeing the .com later is a legitimate play; your brand word is common, you lean on word-of-mouth, or the domain is a core long-term asset → pay up for .com, because the money a substitute saves tends to come back as confusion costs.",
      pickA: ["Your short name is taken on .com", "Budget-conscious launches", "Creative, community & content brands (cc reads well)", "Better availability odds for the same list"],
      pickB: ["Common brand words at risk of confusion", "Long-term brand asset and resale", "Heavy word-of-mouth channels (ads, podcasts)", "Mainstream commercial brands"],
    },
  },
  "tv-vs-com": {
    slug: "tv-vs-com",
    a: "tv",
    b: "com",
    zh: {
      title: ".tv 和 .com 怎么选：视频品类信号与商业默认值的对比",
      metaDescription: ".tv 一眼可读作「电视/视频」，是直播与视频品牌的品类信号；.com 是商业默认值。对比两者的语义、价格与适用场景，并用 AI 猎取可注册的名字。",
      verdict:
        "先明确一点：.tv 是图瓦卢的国家代码，但全世界都把它读成 television——这份「天然误读」让它成为视频与直播赛道最强的品类后缀，Twitch.tv 把这条路走通了。如果你的产品核心是视频内容、直播、影视娱乐，.tv 让品牌名和品类信号一次说完，短名与好词的库存也远比 .com 充裕；代价是注册与续费明显更贵，且离开视频语境后这个后缀的说服力会打折。.com 的逻辑正相反：不传达任何品类，但在任何品类都可信，用户默认补全、转售流动性最好。判断标准：产品名会不会出现在「今晚八点直播，上 xxx.tv」这样的句子里？会——.tv 的品类信号值回票价；产品是综合平台、工具或电商，视频只是功能之一——用 .com 保住普适信任，别把品牌绑死在单一媒介上。预算充足的视频品牌通常两个都要：.tv 做主域名立人设，.com 防守跳转。",
      pickA: ["直播平台与主播个人品牌", "视频内容、影视、流媒体产品", "希望后缀直接传达「视频」品类", "心仪短名字在 .com 已被注册"],
      pickB: ["综合平台与多品类业务", "视频只是功能之一的产品", "续费预算敏感", "长期品牌资产与转售"],
    },
    en: {
      title: ".tv vs .com: The Video Category Signal vs the Commercial Default",
      metaDescription:
        ".tv reads instantly as television — the strongest category suffix for video and streaming brands; .com is the commercial default. Compare semantics, pricing and fit, then hunt available names.",
      verdict:
        "First the fun fact: .tv is Tuvalu's country code, but the whole world reads it as television — and that built-in misreading makes it the strongest category suffix in video and streaming, a path Twitch.tv proved at scale. If your product's core is video content, live streaming or entertainment, .tv says the brand and the category in one breath, and short names plus good words are in far better supply than on .com; the trade-off is noticeably higher registration and renewal prices, and a suffix whose persuasive power fades outside video contexts. .com runs the opposite logic: it signals no category but is trusted in every category, with default autocomplete and the best resale liquidity. The test: will your name appear in sentences like 'going live tonight at yourname.tv'? Then the category signal pays for itself. If you're a general platform, tool or store where video is just one feature, keep the universal trust of .com and don't chain the brand to a single medium. Well-funded video brands usually take both: .tv as the identity-defining primary, .com as the defensive redirect.",
      pickA: ["Streaming platforms & creator brands", "Video content, film & entertainment products", "Category signal right in the suffix", "Your short name is taken on .com"],
      pickB: ["General platforms & multi-category businesses", "Products where video is one feature among many", "Renewal-budget sensitive", "Long-term brand asset and resale"],
    },
  },
  "fm-vs-tv": {
    slug: "fm-vs-tv",
    a: "fm",
    b: "tv",
    zh: {
      title: ".fm 和 .tv 怎么选：音频电台感与视频直播感的对比",
      metaDescription: ".fm 自带电台/播客气质，.tv 是视频直播的品类信号。对比两个媒体后缀的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "这是媒体产品里最经典的一对「品类后缀」，选择标准出奇地简单：你的内容进耳朵还是进眼睛？.fm 是密克罗尼西亚的国家代码，但全世界都读成调频电台——播客、音乐、电台、语音社交用它一步到位，Last.fm 与 Anchor.fm 早已把认知铺好；.tv 则被普遍读作 television，是直播与视频内容的默认品类后缀。两者都比主流后缀贵（.fm 的注册续费尤其高），买的都是「后缀即定位」的表达效率。容易被忽略的坑：内容形态会迁移——不少播客后来做起了视频节目，视频主播也常出音频版，后缀绑得太死会让扩张时略显别扭。判断标准：品牌核心资产是声音（播客、音乐、电台）→ .fm，短好记且圈内认同度高；核心资产是画面（直播、剧集、视频节目）→ .tv；两栖内容或还没想清楚 → 考虑 .com/.me 等中性后缀，把品类留给产品本身去说。",
      pickA: ["播客与电台品牌", "音乐、音频内容平台", "语音社交与音频社区", "圈内认同（Last.fm/Anchor.fm 先例）"],
      pickB: ["直播平台与主播个人品牌", "视频节目与影视内容", "游戏直播与电竞内容", "希望后缀直接传达「视频」品类"],
    },
    en: {
      title: ".fm vs .tv: Radio Vibes vs Streaming Vibes",
      metaDescription:
        ".fm carries built-in radio and podcast energy; .tv is the category signal for video and live streaming. Compare the two media suffixes, then hunt names available on both.",
      verdict:
        "This is the classic pairing of media category suffixes, and the test is surprisingly simple: does your content go into ears or eyes? .fm is Micronesia's country code but reads universally as FM radio — podcasts, music, radio and voice-social products get instant positioning from it, with Last.fm and Anchor.fm having paved the recognition; .tv reads as television and is the default category suffix for live streaming and video. Both cost more than mainstream suffixes (.fm renewals especially), and what you're buying is the expressive efficiency of suffix-as-positioning. The overlooked trap: content formats migrate — plenty of podcasts grow video shows, and streamers ship audio feeds, so a suffix bound too tightly to one medium can feel awkward at expansion time. The test: your brand's core asset is sound (podcasts, music, radio) → .fm, short, memorable and respected in the audio world; your core asset is picture (streams, shows, video) → .tv; amphibious content or still deciding → consider a neutral suffix like .com or .me and let the product state the category.",
      pickA: ["Podcast & radio brands", "Music & audio content platforms", "Voice-social & audio communities", "Audio-world recognition (Last.fm/Anchor.fm precedent)"],
      pickB: ["Streaming platforms & creator brands", "Video shows & entertainment content", "Game streaming & esports content", "Category signal right in the suffix"],
    },
  },
  "one-vs-me": {
    slug: "one-vs-me",
    a: "one",
    b: "me",
    zh: {
      title: ".one 和 .me 怎么选：极简品牌词与个人化后缀的对比",
      metaDescription: ".one 语义是「唯一/首选」、价格低且库存好；.me 是个人品牌与工具类产品的经典后缀。对比两者的语义、价格与适用场景，并用 AI 猎取可注册的名字。",
      verdict:
        "两个后缀都短、都好念，分野在语义指向：.one 读作「唯一、第一、合而为一」，天然适合做品牌陈述——brand.one 读起来像一句口号（XX 首选），全家桶入口、账号中心（account.one 类用法）、极简品牌都顺；作为 2015 年才开放的新后缀，好词库存充足且注册续费常年便宜。.me 是黑山的国家代码，但全世界读成「我」：个人主页、简历站、link-in-bio、以及「动词.me」的工具类命名（remind.me 式祈使句）是它的主场，二十年个人品牌场景的积累让它在这个赛道的认知度无可替代。判断标准：域名主语是「品牌」——想表达唯一与首选 → .one 便宜、干净、库存好；域名主语是「用户自己」——个人站、作品集、或产品名想玩「动词 + me」的句式 → .me 的语义没有对手。都不沾的通用业务，两者都不如老老实实回到 .com/.co 的普适信任。",
      pickA: ["极简品牌与「首选」定位（brand.one）", "全家桶入口与账号中心", "预算敏感、要低续费", "好词在 .me/.com 已被注册"],
      pickB: ["个人主页、简历与作品集", "link-in-bio 与个人品牌", "「动词.me」式产品命名", "面向个人用户的工具与社区"],
    },
    en: {
      title: ".one vs .me: The Minimalist Brand Word vs the Personal Suffix",
      metaDescription:
        ".one means the one — cheap with good inventory; .me is the classic suffix for personal brands and verb-style product names. Compare semantics, pricing and fit, then hunt available names.",
      verdict:
        "Both suffixes are short and say well; the split is in what they point at. .one reads as the one, number one, all-in-one — a natural brand statement where brand.one lands like a slogan, fitting suite entry points, account hubs (the account.one pattern) and minimalist brands; as a 2015-wave new gTLD it still has deep inventory of good words at perennially low registration and renewal prices. .me is Montenegro's country code but reads universally as me: personal homepages, résumé sites, link-in-bio pages and imperative verb.me product names (the remind.me pattern) are its home turf, with two decades of personal-brand usage making its recognition in that lane irreplaceable. The test: the domain's subject is the brand — you want to say the one, the first choice → .one is cheap, clean and well-stocked; the domain's subject is the user — a personal site, portfolio, or a product name playing the verb-plus-me sentence → .me's semantics have no rival. For generic businesses that fit neither story, both lose to the universal trust of plain .com or .co.",
      pickA: ["Minimalist brands & 'the one' positioning (brand.one)", "Suite entry points & account hubs", "Budget-sensitive with low renewals", "Your word is taken on .me/.com"],
      pickB: ["Personal homepages, résumés & portfolios", "Link-in-bio & personal branding", "verb.me style product names", "Consumer tools & communities"],
    },
  },
  "cool-vs-fun": {
    slug: "cool-vs-fun",
    a: "cool",
    b: "fun",
    zh: {
      title: ".cool 和 .fun 怎么选：酷感调性与玩乐气质的对比",
      metaDescription: ".cool 传达酷感与态度，适合潮牌与创意工作室；.fun 主打玩乐与娱乐场景。对比两个情绪后缀的语义、价格与适用场景，并用 AI 猎取可注册的名字。",
      verdict:
        "这是一对「情绪后缀」：都不描述行业，只传达气质，选哪个取决于品牌想让人产生什么感受。.cool 是形容词，读起来像一句评价——brand.cool 自带「这玩意儿很酷」的态度，潮牌、设计师品牌、创意工作室、亚文化社区用它能把调性钉死；它的注册量不大，反而意味着好词库存充足。.fun 是名词也是承诺——「来这儿玩」，游戏、活动、派对、娱乐平台、儿童向产品用它一眼即懂，注册量比 .cool 大一个量级，首年价常年极低（续费会回到正常档，注册前先查续费价）。共同的坑：情绪后缀撑不起严肃场景，金融、医疗、企业服务放在 .cool/.fun 上会显得不可信；且两者的转售流动性都有限，别当投资品囤。判断标准：品牌的核心气质是「有态度、有审美」→ .cool；核心气质是「好玩、热闹」→ .fun；说不清是哪种 → 说明你需要的其实是中性后缀。",
      pickA: ["潮牌与设计师品牌", "创意工作室与作品集", "亚文化社区与内容站", "想要「酷」的品牌态度"],
      pickB: ["游戏与娱乐平台", "活动、派对与线下娱乐", "儿童向与家庭向产品", "首年预算极致敏感"],
    },
    en: {
      title: ".cool vs .fun: Attitude vs Playfulness",
      metaDescription:
        ".cool signals attitude and taste — great for streetwear and studios; .fun promises play and entertainment. Compare the two mood suffixes, then hunt available names.",
      verdict:
        "This is a pair of mood suffixes: neither describes an industry — they transmit a feeling, and the choice is about what you want people to feel. .cool is an adjective that lands like a verdict — brand.cool carries built-in 'this thing is cool' attitude, nailing the tone for streetwear, designer brands, creative studios and subculture communities; its modest registration volume means good words are still plentiful. .fun is both a noun and a promise — 'come play' — instantly legible for games, events, parties, entertainment platforms and kid-facing products, with registration volume an order of magnitude larger than .cool and rock-bottom first-year pricing (renewals return to normal tiers, so check before registering). The shared trap: mood suffixes can't carry serious contexts — finance, healthcare or enterprise services on .cool/.fun read untrustworthy — and neither has meaningful resale liquidity, so don't hoard them as investments. The test: your brand's core vibe is attitude and taste → .cool; it's play and energy → .fun; if you can't say which, what you actually need is a neutral suffix.",
      pickA: ["Streetwear & designer brands", "Creative studios & portfolios", "Subculture communities & content sites", "Brands built on attitude"],
      pickB: ["Games & entertainment platforms", "Events, parties & offline fun", "Kid- & family-facing products", "Rock-bottom first-year budgets"],
    },
  },
  "red-vs-vip": {
    slug: "red-vs-vip",
    a: "red",
    b: "vip",
    zh: {
      title: ".red 和 .vip 怎么选：红色喜庆感与会员尊贵感的对比",
      metaDescription: ".red 主打红色与喜庆语义，在中文语境格外讨喜；.vip 传达会员与尊贵感、注册量更大。对比两者的语义、价格与适用场景，并用 AI 猎取可注册的名字。",
      verdict:
        "两个后缀在中文互联网语境里都有独特的化学反应。.red 的字面是颜色，但在中文语境自动叠加「红火、喜庆、网红」的联想——喜庆礼品、婚庆、国潮品牌、红色主题内容用它格外顺，donuts 系新后缀里它注册量不大，好词库存充足且价格温和；短板是出了中文语境，red 就只是一种颜色，海外用户读不出额外含义。.vip 则是全球通用的三个字母：会员体系、尊享服务、高端定位一眼即懂，中国市场注册量长期位居新后缀前列、通过工信部资质可正常备案，电商大促场景（xx.vip 会员入口）已被反复验证；代价是 vip 的气质偏营销，放在需要克制感的品牌上会显得用力过猛。判断标准：品牌吃「喜庆红火」的情绪红利（礼品、婚庆、国潮、节庆营销）→ .red 讨喜且便宜；品牌卖「会员与尊贵」（会员制电商、俱乐部、高端服务）→ .vip 的语义直给且认知度更广。两者都强依赖具体场景，通用业务请回到中性后缀。",
      pickA: ["喜庆礼品与婚庆品牌", "国潮与红色主题内容", "节庆营销活动页", "中文语境的「红火」联想"],
      pickB: ["会员制电商与俱乐部", "尊享服务与高端定位", "大促会员入口（xx.vip）", "需要更大后缀认知度"],
    },
    en: {
      title: ".red vs .vip: Festive Red vs Members-Only Prestige",
      metaDescription:
        ".red owns the color and its festive readings — especially strong in Chinese contexts; .vip signals membership and prestige with far larger registration volume. Compare and hunt available names.",
      verdict:
        "Both suffixes have special chemistry in the Chinese internet context. .red is literally the color, but in Chinese it auto-loads associations of festivity, prosperity and internet fame — gift brands, wedding services, guochao (China-chic) labels and red-themed content wear it beautifully; among the Donuts-wave gTLDs its registration base is small, so good words remain plentiful at moderate prices. The catch: outside Chinese contexts, red is just a color and carries no extra meaning for international users. .vip is three letters the whole world reads the same way: membership systems, premium services and upscale positioning are instantly legible, its registration volume has long ranked near the top of new gTLDs in China, it's MIIT-accredited for ICP filing, and the member-entrance pattern (brand.vip) is battle-tested in e-commerce campaigns; the cost is a promotional flavor that reads try-hard on brands aiming for restraint. The test: your brand feeds on festive-red emotional energy (gifts, weddings, guochao, seasonal campaigns) → .red is charming and cheap; your brand sells membership and prestige (member-based commerce, clubs, premium services) → .vip is more direct with broader recognition. Both are heavily scenario-dependent — generic businesses should return to a neutral suffix.",
      pickA: ["Festive gift & wedding brands", "Guochao & red-themed content", "Seasonal campaign pages", "Chinese-context festive readings"],
      pickB: ["Member-based commerce & clubs", "Premium services & upscale positioning", "Campaign member entrances (brand.vip)", "Broader suffix recognition"],
    },
  },
  "bar-vs-cafe": {
    slug: "bar-vs-cafe",
    a: "bar",
    b: "cafe",
    zh: {
      title: ".bar 和 .cafe 怎么选：酒吧夜场与咖啡日常的后缀对比",
      metaDescription: ".bar 覆盖酒吧、清吧与鸡尾酒场景，.cafe 是咖啡馆与烘焙品牌的天然后缀。对比两者的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两个都是把「业态」直接写进域名的行业后缀，选择只看你开的是什么店。.bar 的语义是酒吧、清吧、鸡尾酒与夜间经济——mixology.bar、jazz.bar 这类组合读起来就是门牌；它还有一层隐藏彩蛋：bar 在技术圈是经典占位词（foo.bar），开发者向的小工具偶尔也借它玩梗。.cafe 则牢牢绑定咖啡与日间业态：咖啡馆、烘焙工作室、猫咖、书店咖啡角，甚至线上社区也爱用「某某咖啡馆」的意象营造轻松氛围。两者注册量都不大，好词库存充足、价格温和，本地店铺完全可以拿到「品类词+后缀」的黄金组合。判断标准很简单：卖酒精与夜场体验 → .bar；卖咖啡与日常第三空间 → .cafe。业态混合（日咖夜酒）就看主打时段与品牌气质，或者两个都注册分别做入口。",
      pickA: ["酒吧、清吧与鸡尾酒品牌", "夜间经济与演出场地", "酒类电商与订阅（威士忌、精酿）", "开发者玩梗域名（foo.bar 类）"],
      pickB: ["咖啡馆与连锁咖啡品牌", "烘焙工作室与甜品店", "猫咖、书店咖啡角等复合空间", "轻松氛围的线上社区"],
    },
    en: {
      title: ".bar vs .cafe: Nightlife or Daytime Coffee Culture",
      metaDescription:
        ".bar covers bars, lounges and cocktail culture; .cafe is the natural home for coffee shops and bakeries. Compare semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both suffixes put the venue type right in the domain, so the choice is simply what you're pouring. .bar means bars, lounges, cocktails and the night economy — mixology.bar or jazz.bar reads like the sign above the door. It also carries a hidden bonus: bar is the classic programmer placeholder (foo.bar), so developer-facing toys occasionally borrow it for the pun. .cafe is firmly bound to coffee and daytime hospitality: coffee shops, roasteries, cat cafés, bookstore corners — even online communities use the café metaphor for a relaxed vibe. Registration volume is modest on both, so category-word-plus-suffix gems are still available at moderate prices — gold for local venues. The test is simple: selling alcohol and nightlife → .bar; selling coffee and the daytime third place → .cafe. Hybrid day-café-night-bar concepts should follow the flagship daypart, or register both as separate entrances.",
      pickA: ["Bars, lounges and cocktail brands", "Nightlife venues and live-music spots", "Alcohol e-commerce and subscriptions", "Developer pun domains (foo.bar style)"],
      pickB: ["Coffee shops and café chains", "Roasteries, bakeries and dessert bars", "Cat cafés and hybrid third places", "Relaxed-vibe online communities"],
    },
  },
  "cafe-vs-shop": {
    slug: "cafe-vs-shop",
    a: "cafe",
    b: "shop",
    zh: {
      title: ".cafe 和 .shop 怎么选：场景氛围与电商通用的对比",
      metaDescription: ".cafe 传达咖啡馆的场景与氛围，.shop 是电商通用后缀、认知度大得多。对比两者的语义宽度、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "这是「窄而准」与「宽而稳」的典型取舍。.cafe 语义极窄但极准：域名本身就把「咖啡馆」三个字说完了，线下门店、烘焙品牌、咖啡订阅用它，用户看一眼就知道你卖什么；代价是业务一旦扩张到咖啡之外，后缀会变成天花板。.shop 则是新后缀里电商认知度最高的通用选项，全球注册量长期领先，卖什么都不违和——咖啡豆电商用 .shop 同样成立，只是少了一层氛围感。价格上两者接近，好词库存 .cafe 明显更宽裕。判断标准：品牌核心是「咖啡馆」这个场景与身份（门店、空间、社区）→ .cafe 的氛围无可替代；品牌核心是「卖货」（多品类、扩张预期、纯线上）→ .shop 的宽容度与认知度更稳。连锁品牌常见组合：主站 .shop 做电商，门店/会员社区用 .cafe。",
      pickA: ["线下咖啡馆与连锁门店", "咖啡订阅与烘焙品牌", "强调空间与社区氛围的品牌", "「品类词.cafe」黄金组合仍可注册"],
      pickB: ["多品类电商与零售", "有扩张预期、不想被品类锁死", "纯线上店铺（认知度优先）", "全球市场（.shop 注册量领先）"],
    },
    en: {
      title: ".cafe vs .shop: Venue Vibe or E-commerce Default",
      metaDescription:
        ".cafe carries the atmosphere of a coffee shop; .shop is the general e-commerce suffix with far broader recognition. Compare semantic width, pricing and fit, then hunt names on both.",
      verdict:
        "A classic narrow-and-precise versus wide-and-safe trade-off. .cafe is extremely narrow but extremely accurate: the domain itself says coffee shop, so physical venues, roastery brands and coffee subscriptions are instantly legible; the cost is a ceiling — expand beyond coffee and the suffix starts to pinch. .shop is the most recognized commerce suffix of the new-gTLD wave, with globally leading registration volume, and nothing looks out of place on it — a coffee-bean store on .shop works fine, just without the atmospheric layer. Pricing is similar; short-word inventory is clearly better on .cafe. The test: if the brand's core is the café as a place and identity (venue, space, community) → .cafe's vibe is irreplaceable; if the core is selling things (multi-category, expansion plans, online-only) → .shop's flexibility and recognition are safer. Chains often run both: .shop for the store, .cafe for venues and the member community.",
      pickA: ["Physical coffee shops and chains", "Coffee subscriptions and roastery brands", "Space- and community-first brands", "Category-word .cafe gems still available"],
      pickB: ["Multi-category e-commerce and retail", "Expansion plans beyond one category", "Online-only stores (recognition first)", "Global markets (.shop leads registrations)"],
    },
  },
  "pizza-vs-com": {
    slug: "pizza-vs-com",
    a: "pizza",
    b: "com",
    zh: {
      title: ".pizza 和 .com 怎么选：品类直给与通用信任的对比",
      metaDescription: ".pizza 把品类直接写进域名、好词库存充足，.com 认知度最高但餐饮好名字早已绝迹。对比两者的记忆点、价格与适用场景，并用 AI 猎取可注册的名字。",
      verdict:
        "对披萨店与餐饮品牌来说，这是「记忆点」与「默认信任」的取舍。.pizza 的优势是域名即菜单：tony.pizza、napoli.pizza 念出来就是广告词，口头传播零损耗，而且注册量小、城市名/人名/风格词的好组合仍大量可注册；短板是续费比 .com 贵一截，且出了餐饮场景后缀就失去意义。.com 的信任与自动补全无可替代，但现实是餐饮类常见词的 .com 几乎全部有主，可注册的往往是加了 -pizzeria、城市前后缀的长域名，反而不好记。判断标准：独立披萨店、本地连锁、外卖品牌——域名主要靠口碑与线下传播 → .pizza 的记忆点是碾压性的；全国性连锁或计划多品类扩张的餐饮集团 → 主品牌仍应收 .com，.pizza 适合做产品线或活动入口。预算允许时两个都拿：.pizza 印在菜单上，.com 做跳转兜底。",
      pickA: ["独立披萨店与本地连锁", "外卖与预订入口（域名即广告）", "城市名/人名组合仍可注册", "口头与线下传播为主的获客"],
      pickB: ["全国性餐饮集团主品牌", "多品类扩张预期", "需要最大信任与自动补全", "长期品牌资产与转售价值"],
    },
    en: {
      title: ".pizza vs .com: Category Punch or Universal Trust",
      metaDescription:
        ".pizza puts the category right in the domain with plenty of good names left; .com has maximum trust but food-service names are long gone. Compare memorability, pricing and fit, then hunt available names.",
      verdict:
        "For pizzerias and food brands this is memorability versus default trust. .pizza's superpower is that the domain is the menu: tony.pizza or napoli.pizza spoken aloud is a finished ad, word-of-mouth carries it losslessly, and with low registration volume, city names, family names and style words are still widely available; the trade-offs are renewal pricing above .com and a suffix that means nothing outside food. .com's trust and autocomplete are unbeatable, but in practice every common food word on .com is taken — what's left are long compounds with -pizzeria or city prefixes that are harder to remember, not easier. The test: independent pizzerias, local chains and delivery brands living on word-of-mouth and offline exposure → .pizza's memorability wins by a mile; national chains or groups planning multi-category expansion → keep the main brand on .com and use .pizza for product lines or campaigns. With budget, take both: print .pizza on the menu, keep .com as the redirect backstop.",
      pickA: ["Independent pizzerias and local chains", "Delivery and booking entrances (domain as ad)", "City/family-name combos still available", "Word-of-mouth and offline-first acquisition"],
      pickB: ["National restaurant-group main brands", "Multi-category expansion plans", "Maximum trust and autocomplete", "Long-term brand asset and resale value"],
    },
  },
  "money-vs-finance": {
    slug: "money-vs-finance",
    a: "money",
    b: "finance",
    zh: {
      title: ".money 和 .finance 怎么选：直白钱味与专业金融感的对比",
      metaDescription: ".money 直白有冲击力、适合消费金融与理财内容，.finance 更正式、适合机构与 B2B。对比两者的气质、合规观感与适用场景，并用 AI 猎取可注册的名字。",
      verdict:
        "两个后缀都姓「钱」，气质却差一个衣柜。.money 直白、口语、有冲击力——省钱攻略、返现工具、个人理财社区、加密钱包用它顺口又好记，get.money 这类组合自带传播力；代价是「money」的直白在严肃金融场景里容易显得轻浮，甚至触发用户对「快速致富」套路的警惕。.finance 则是西装革履的那一个：财务顾问、资管机构、企业金融 SaaS、DeFi 协议用它立刻多三分专业感，DeFi 世界里 .finance 甚至已经成了协议命名的惯例后缀之一。两者价格相近、库存都宽裕。判断标准：面向大众、讲「钱怎么省怎么赚」的消费级产品与内容 → .money 的直白是资产；面向机构或高客单、讲「资产怎么管」的专业服务 → .finance 的正式感更配。合规敏感业务（借贷、投资建议）建议一律偏向 .finance，第一印象即专业。",
      pickA: ["省钱/返现/比价工具", "个人理财内容与社区", "加密钱包与消费级 fintech", "需要口语传播力的产品"],
      pickB: ["财务顾问与资管机构", "企业金融与 B2B SaaS", "DeFi 协议（惯例后缀之一）", "合规敏感的借贷与投资业务"],
    },
    en: {
      title: ".money vs .finance: Blunt Cash Appeal or Institutional Polish",
      metaDescription:
        ".money is blunt and punchy — great for consumer finance and money content; .finance reads formal and institutional. Compare vibe, compliance optics and fit, then hunt available names.",
      verdict:
        "Both suffixes are about money, but they dress very differently. .money is blunt, colloquial and punchy — savings hacks, cashback tools, personal-finance communities and crypto wallets wear it memorably, and combos like get.money spread themselves; the cost is that bluntness reads flippant in serious financial contexts and can even trigger get-rich-quick suspicion. .finance is the one in the suit: advisors, asset managers, corporate-finance SaaS and DeFi protocols gain instant professionalism, and in DeFi, .finance has become one of the conventional protocol suffixes. Pricing and inventory are similar on both. The test: consumer products and content about saving and making money for a mass audience → .money's bluntness is an asset; professional services for institutions or high-ticket clients about managing assets → .finance matches the required formality. For compliance-sensitive businesses (lending, investment advice), default to .finance — the first impression is the professional one.",
      pickA: ["Savings, cashback and comparison tools", "Personal-finance content and communities", "Crypto wallets and consumer fintech", "Products that spread by word of mouth"],
      pickB: ["Advisors and asset managers", "Corporate finance and B2B SaaS", "DeFi protocols (a conventional suffix)", "Compliance-sensitive lending and investing"],
    },
  },
  "gold-vs-vip": {
    slug: "gold-vs-vip",
    a: "gold",
    b: "vip",
    zh: {
      title: ".gold 和 .vip 怎么选：贵金属质感与会员尊贵感的对比",
      metaDescription: ".gold 自带贵金属与「金牌」语义，.vip 传达会员尊贵感且注册量大得多。对比两者的语义、认知度与适用场景，并用 AI 猎取可注册的名字。",
      verdict:
        "两个后缀都在卖「高端感」，但来源不同。.gold 的底色是实物与等级：黄金珠宝、贵金属投资、奢侈品用它是字面意义的精准；「金牌服务」「gold tier」的等级语义又让它能延伸到会员体系的最高档与竞技领域的冠军叙事。注册量小，好词库存充足。.vip 的底色是身份与圈层：三个字母全球通读，会员制电商、俱乐部、尊享服务一眼即懂，在中国市场注册量长期位居新后缀前列、可正常备案，认知度远超 .gold；代价是 vip 气质偏营销，且大量促销页用它，稀缺感反而被稀释。判断标准：业务与黄金/贵金属/奢侈品直接相关，或想借「金牌/冠军」叙事 → .gold 字面精准且更稀缺；业务核心是会员体系与身份圈层 → .vip 的认知度直给。两者都是强场景后缀，中性业务请回到通用后缀。",
      pickA: ["黄金珠宝与贵金属投资", "奢侈品与高端礼品", "会员体系最高档（gold tier）", "「金牌/冠军」叙事的品牌"],
      pickB: ["会员制电商与俱乐部", "尊享服务与身份圈层运营", "中国市场（认知度高、可备案）", "大促会员入口（brand.vip）"],
    },
    en: {
      title: ".gold vs .vip: Precious-Metal Weight or Members-Only Status",
      metaDescription:
        ".gold carries precious-metal and gold-tier semantics; .vip signals membership status with far larger registration volume. Compare semantics, recognition and fit, then hunt available names.",
      verdict:
        "Both suffixes sell premium, but from different sources. .gold is grounded in the physical and the ranked: gold jewelry, precious-metal investment and luxury goods wear it with literal precision, while the gold-tier and gold-medal readings extend it to top membership levels and champion narratives. Registration volume is small, so good words remain plentiful. .vip is about identity and inner circles: three letters read the same worldwide, member-based commerce, clubs and premium services are instantly legible, and in China its registration volume has long led the new-gTLD pack with full ICP-filing accreditation — recognition far beyond .gold. The catch: .vip's promotional flavor, amplified by countless campaign pages, dilutes the exclusivity it promises. The test: business tied to gold, precious metals or luxury, or a brand built on gold-medal narratives → .gold is literal and scarcer; business built on membership and status circles → .vip's recognition is more direct. Both are strongly scenario-bound — neutral businesses should return to a generic suffix.",
      pickA: ["Gold jewelry and precious-metal investment", "Luxury goods and premium gifts", "Top membership tiers (gold tier)", "Gold-medal and champion brand narratives"],
      pickB: ["Member-based commerce and clubs", "Premium services and status circles", "China market (recognition + ICP filing)", "Campaign member entrances (brand.vip)"],
    },
  },
  "wtf-vs-lol": {
    slug: "wtf-vs-lol",
    a: "wtf",
    b: "lol",
    zh: {
      title: ".wtf 和 .lol 怎么选：荒诞冲击与轻松好笑的对比",
      metaDescription: ".wtf 主打荒诞与冲击力，.lol 传达轻松好笑的网络文化。对比两种网络梗后缀的气质、风险与适用场景，并用 AI 猎取可注册的名字。",
      verdict:
        "两个都是把网络俚语做成后缀的「态度域名」，差别在情绪的方向。.wtf 的情绪是惊讶与荒诞——猎奇内容站、吐槽合集、离谱产品博物馆、故意反差的营销活动页用它，域名本身就是标题党；它的冲击力也是双刃剑：粗口缩写的底色让它天然进不了正式场合，企业邮箱用 .wtf 会非常灾难。.lol 的情绪是轻松与好笑——梗图站、搞笑内容、休闲小游戏、整蛊礼物用它明快无害，比 .wtf 安全得多；英雄联盟（League of Legends 缩写 LoL）的玩家社区与周边内容也常借它一语双关。两者注册量都小、价格温和、好词充足。判断标准：内容主打「离谱到必须点开」的冲击力 → .wtf 的态度更烈；主打「好笑无害」的日常娱乐 → .lol 更耐用。两者都只适合娱乐与创意场景，正经业务请绕行。",
      pickA: ["猎奇与吐槽内容站", "反差营销活动页", "离谱产品/失败案例合集", "需要标题党冲击力的创意项目"],
      pickB: ["梗图与搞笑内容站", "休闲小游戏与整蛊礼物", "英雄联盟社区（LoL 双关）", "轻松无害的娱乐品牌"],
    },
    en: {
      title: ".wtf vs .lol: Absurd Shock Value or Harmless Fun",
      metaDescription:
        ".wtf trades in absurdity and shock value; .lol reads light and funny. Compare the two internet-slang suffixes on vibe, risk and fit, then hunt available names.",
      verdict:
        "Both are attitude domains built from internet slang; the difference is which emotion they load. .wtf runs on surprise and absurdity — weird-content sites, rant collections, museums of ridiculous products and deliberately jarring campaign pages wear it as a built-in clickbait headline. That punch cuts both ways: the profanity underneath keeps it out of anything formal, and a corporate email on .wtf is a disaster. .lol runs on lightness — meme sites, comedy content, casual games and gag gifts wear it brightly and harmlessly, making it much safer than .wtf; League of Legends communities also borrow it for the obvious double meaning. Both have small registration bases, moderate prices and plentiful inventory. The test: content that wins on so-absurd-you-must-click energy → .wtf hits harder; everyday entertainment that wins on harmless fun → .lol wears longer. Both belong strictly to entertainment and creative projects — serious businesses should steer clear.",
      pickA: ["Weird-content and rant sites", "Deliberately jarring campaign pages", "Ridiculous-product and fail collections", "Creative projects that need shock value"],
      pickB: ["Meme and comedy content sites", "Casual games and gag gifts", "League of Legends communities (LoL pun)", "Light, harmless entertainment brands"],
    },
  },
  "band-vs-fm": {
    slug: "band-vs-fm",
    a: "band",
    b: "fm",
    zh: {
      title: ".band 和 .fm 怎么选：乐队身份与音频行业标签的对比",
      metaDescription: ".band 是乐队与音乐团体的专属后缀，.fm 是播客与音频产品的行业标签但价格贵得多。对比两者的语义、价格与适用场景，并用 AI 猎取可注册的名字。",
      verdict:
        "两个都是音乐圈后缀，但指向完全不同的主体。.band 指向「人」——乐队、合唱团、管乐团这些表演团体，yourname.band 天然读作乐队官网，巡演日程、周边商店、粉丝社群都顺理成章；注册约 $16、续费约 $25/年，价差小无钓鱼，独立乐队长期持有毫无压力。.fm 指向「内容」——播客、电台、音乐流媒体这些「能听的东西」，Anchor（anchor.fm）、Last.fm 把它做成了音频产品的身份标签，两字符短后缀好念好记；代价是注册与续费都在 $88 上下，是 .band 的三倍多。判断标准：主体是一支乐队或表演团体、卖的是「我们这群人」→ .band 语义更准且便宜得多；主体是一档节目或音频平台、卖的是「这个声音产品」→ .fm 的行业认知无可替代。乐队若同时做播客，务实做法是官网用 .band、节目用 .fm 分工。",
      pickA: ["乐队与表演团体官网", "巡演日程与售票落地页", "粉丝社群与周边商店", "续费预算敏感的独立乐队"],
      pickB: ["播客与电台节目", "音乐流媒体与音频平台", "音频社区与声音产品", "需要行业身份标签（.fm 圈内感）"],
    },
    en: {
      title: ".band vs .fm: Band Identity or Audio-Industry Badge",
      metaDescription:
        ".band is the purpose-built suffix for bands and music groups; .fm is the audio industry's badge at a much higher price. Compare semantics, pricing and fit, then hunt available names.",
      verdict:
        "Both are music-world suffixes, but they point at different subjects. .band points at people — bands, choirs and performing groups; yourname.band reads as the official band site by default, with tour dates, merch and fan communities all fitting naturally. At about $16 to register and $25/yr to renew with no first-year bait, it's comfortable for independent bands to hold long term. .fm points at content — podcasts, radio and streaming, the things you listen to; Anchor (anchor.fm) and Last.fm made it the identity badge of audio products, and the two-letter suffix keeps domains short and speakable. The cost: registration and renewal both sit around $88, more than triple .band. The test: the subject is a band or performing group selling \"us as a group\" → .band is semantically precise and far cheaper; the subject is a show or audio platform selling \"this sound product\" → .fm's industry recognition is irreplaceable. A band that also runs a podcast can split the work: .band for the band site, .fm for the show.",
      pickA: ["Band and performing-group websites", "Tour dates and ticketing pages", "Fan communities and merch stores", "Renewal-budget-sensitive independent bands"],
      pickB: ["Podcasts and radio shows", "Music streaming and audio platforms", "Audio communities and sound products", "Industry badge recognition (.fm insider signal)"],
    },
  },
  "cash-vs-money": {
    slug: "cash-vs-money",
    a: "cash",
    b: "money",
    zh: {
      title: ".cash 和 .money 怎么选：到手的钱与理财叙事的对比",
      metaDescription: ".cash 强调即时到手的钱，适合支付与返现；.money 偏理财与规划叙事，适合财务内容与工具。对比两者的语义、价格与适用场景，并用 AI 猎取可注册的名字。",
      verdict:
        "两个都把「钱」写在脸上，差别在钱的状态。.cash 是「到手的钱」——支付与转账工具、返现与优惠平台、点数变现、加密货币产品用它，强调即时、直给：秒到账、立返现、当天结算，动词 + .cash（get、send、swap 类）读出来就是一个动作指令。.money 是「打理中的钱」——理财博客、预算记账工具、比价服务、面向个人的财务内容用它，smart.money、save.money 读出来像一句理财建议。价格接近：.cash 注册约 $10、续费约 $31/年；.money 注册约 $11、续费约 $28/年，都属温和档。共同的坑也一样：金钱主题是钓鱼与诈骗重灾区，两个后缀的新站都要用真实主体信息、HTTPS 与清晰的资金流说明对冲怀疑；受强监管的持牌业务（券商、银行）用哪个都不够正式，仍建议 .com。判断标准：产品卖「钱的流动」（支付、返现、变现）→ .cash 更直给；产品卖「钱的管理」（理财、预算、比价）→ .money 更耐读。",
      pickA: ["支付与转账工具", "返现与优惠平台", "加密货币与数字资产产品", "强调即时到账的结算服务"],
      pickB: ["理财内容与财务博客", "预算与记账工具", "比价与省钱服务", "面向个人的财务规划产品"],
    },
    en: {
      title: ".cash vs .money: Money in Hand or Money Managed",
      metaDescription:
        ".cash means money in hand — payments and cashback; .money reads as personal finance and planning. Compare semantics, pricing and fit, then hunt available names.",
      verdict:
        "Both wear money on their sleeve; the difference is the money's state. .cash is money in hand — payment and transfer tools, cashback platforms, points-to-cash services and crypto products use it to promise immediacy: instant settlement, cash back now; verb + .cash combos (get, send, swap) read as action commands. .money is money being managed — personal-finance blogs, budgeting tools, price-comparison and savings services; smart.money or save.money reads like a piece of financial advice. Pricing is close: .cash runs about $10 to register and $31/yr to renew, .money about $11 and $28/yr — both moderate. They share the same trap: money is phishing's favorite theme, so new sites on either suffix need real entity info, HTTPS and a clear explanation of where funds flow; and licensed, regulated businesses (brokers, banks) look under-dressed on either — stick with .com there. The test: the product sells money moving (payments, cashback, cash-out) → .cash is more direct; the product sells money managed (planning, budgeting, comparison) → .money wears longer.",
      pickA: ["Payment and transfer tools", "Cashback and deals platforms", "Crypto and digital-asset products", "Instant-settlement services"],
      pickB: ["Personal-finance content and blogs", "Budgeting and bookkeeping tools", "Price-comparison and savings services", "Individual financial-planning products"],
    },
  },
  "city-vs-world": {
    slug: "city-vs-world",
    a: "city",
    b: "world",
    zh: {
      title: ".city 和 .world 怎么选：本地指向与全球叙事的对比",
      metaDescription: ".city 指向具体城市与本地服务，.world 传达全球化与「某某世界」的宏大叙事。对比两者的语义、价格与适用场景，并用 AI 猎取可注册的名字。",
      verdict:
        "两个都是「地方感」后缀，尺度完全相反。.city 往小处收——城市指南、本地新闻、活动日历、生活服务聚合用「城市名 + .city」，对本地用户的指向性无可替代；比喻用法「××之城」也成立，把游戏社区、垂直内容站做成一座主题之城。注册约 $5、续费约 $23/年，长期成本很低。.world 往大处放——「brand.world」读作「某某的世界」，跨境品牌、多语言平台、元宇宙与虚拟世界项目、想传达包罗万象的社区用它，叙事一步到位。判断标准：用户在一个具体的地理范围内、内容围绕一座城 → .city 的本地指向更准且更便宜；用户跨地域、品牌想讲「一个完整世界」的故事 → .world 的格局感是 .city 给不了的。注意两端的坑：.city 用城市名可能触碰地方政府与商标口径，先查清楚；.world 的宏大承诺需要内容体量撑住，单薄的站点用它反而显得空。",
      pickA: ["城市指南与本地新闻", "本地生活服务与活动日历", "主题「之城」社区（游戏、垂直内容）", "长期成本敏感的本地项目"],
      pickB: ["跨境与多语言品牌", "元宇宙与虚拟世界项目", "「brand.world」式品牌叙事", "包罗万象的大型社区与平台"],
    },
    en: {
      title: ".city vs .world: Local Focus or Global Narrative",
      metaDescription:
        ".city points at a specific city and local services; .world tells a global, everything-inside story. Compare semantics, pricing and fit, then hunt available names.",
      verdict:
        "Both are place suffixes at opposite ends of the zoom. .city zooms in — city guides, local news, event calendars and local-services aggregators on cityname.city speak to local users like nothing else, and the metaphorical \"city of X\" also works for gaming communities and vertical content hubs. At about $5 to register and $23/yr to renew, long-term cost is among the lowest. .world zooms out — brand.world reads as \"the world of X\": cross-border brands, multilingual platforms, metaverse and virtual-world projects, and communities that want to feel all-encompassing get the narrative in one word. The test: your users live in one geography and the content orbits one city → .city is more precise and cheaper; your users span regions and the brand sells a whole universe → .world delivers a scale .city can't. Mind each end's trap: city names can touch municipal-government and trademark protections, so check first; and .world's grand promise needs real content volume behind it — a thin site wears it hollow.",
      pickA: ["City guides and local news", "Local services and event calendars", "Themed \"city of X\" communities", "Cost-sensitive local projects"],
      pickB: ["Cross-border and multilingual brands", "Metaverse and virtual-world projects", "brand.world naming narratives", "Large all-encompassing communities and platforms"],
    },
  },
  "estate-vs-land": {
    slug: "estate-vs-land",
    a: "estate",
    b: "land",
    zh: {
      title: ".estate 和 .land 怎么选：房产品牌与土地语义的对比",
      metaDescription: ".estate 面向房产经纪与豪宅项目自带高端感，.land 覆盖土地交易与「乐园/世界」双重语义。对比两者的气质、价格与适用场景，并用 AI 猎取可注册的名字。",
      verdict:
        "两个都能做房地产，气质与延展方向不同。.estate 是行业招牌——经纪人与中介品牌、豪宅与庄园项目、物业与资产管理用 name.estate，行业属性一目了然（real.estate 是注册局自己的旗舰组合），smith.estate 比 smithrealestate.com 短一半且更显高端；它还有「遗产/资产」第二层语义，家族办公室与遗产规划用得顺。注册约 $8、续费约 $31/年。.land 更宽——字面的「土地」覆盖地块交易、农场、露营地与户外目的地；引申的「-land 之地」（Disneyland 式构词）让游戏世界、虚拟社区、元宇宙地块项目也用得自然，Sandbox 带火过一波 .land 注册。注册约 $9、续费约 $33/年，价格几乎相同。判断标准：业务是房产经纪、豪宅、资产管理这类「高端服务」→ .estate 的庄园气质与行业指向更准；业务围绕土地本身（地块、农场、户外）或想玩「某某乐园」的想象 → .land 的延展性更强。共同注意：两者对国内大众认知度都低，更适合涉外或海外业务；平价刚需盘用 .estate 会有气质落差。",
      pickA: ["房产经纪与中介品牌", "豪宅与庄园项目", "物业与资产管理", "家族办公室与遗产规划"],
      pickB: ["土地与地块交易平台", "农场、露营地与户外目的地", "游戏世界与元宇宙地块项目", "「-land 乐园」式品牌命名"],
    },
    en: {
      title: ".estate vs .land: Property Brand or Land Semantics",
      metaDescription:
        ".estate reads upscale for agents and luxury property; .land covers literal land plus the \"-land\" world-building metaphor. Compare vibe, pricing and fit, then hunt available names.",
      verdict:
        "Both can carry real estate; they differ in register and reach. .estate is the industry shingle — agent and brokerage brands, luxury property projects and asset-management firms on name.estate declare the trade at a glance (real.estate is the registry's own flagship), and smith.estate is half the length of smithrealestate.com while reading more upscale; the second meaning — estates as legacy — suits family offices and estate planning. About $8 to register, $31/yr to renew. .land is broader — literal land covers plot marketplaces, farms, campgrounds and outdoor destinations, while the \"-land\" word-building metaphor (Disneyland-style) makes game worlds, virtual communities and metaverse land projects feel native; Sandbox drove a wave of .land registrations. About $9 and $33/yr — pricing is nearly identical. The test: the business is upscale service around property (agents, luxury, asset management) → .estate's manor-house register and industry precision win; the business orbits land itself (plots, farms, outdoors) or plays the \"world of X\" card → .land stretches further. Shared caution: both have low recognition among mainland-Chinese consumers, so they fit international-facing businesses best — and budget listings clash with .estate's upscale tone.",
      pickA: ["Real-estate agents and brokerages", "Luxury property projects", "Property and asset management", "Family offices and estate planning"],
      pickB: ["Land and plot marketplaces", "Farms, campgrounds and outdoor destinations", "Game worlds and metaverse land projects", "\"-land\" world-building brand names"],
    },
  },
  "expert-vs-pro": {
    slug: "expert-vs-pro",
    a: "expert",
    b: "pro",
    zh: {
      title: ".expert 和 .pro 怎么选：权威个体与泛专业感的对比",
      metaDescription: ".expert 把「专家」身份写进域名但续费贵，.pro 传达泛专业感且价格低。对比两者的语义强度、价格结构与适用场景，并用 AI 猎取可注册的名字。",
      verdict:
        "两个都卖「专业」，浓度不同。.expert 是一句自我介绍——name.expert 直接告诉访客「这是某领域的专家」，seo.expert、tax.expert 这样的「领域词 + .expert」就是数字招牌，适合独立顾问、律师会计等专业人士把个人 IP 做成品牌。代价在价格结构：首年约 $7 很低，但续费约 $50/年是典型的「首年引流、续费收割」，预算必须按续费核算。.pro 更泛也更便宜——「专业」的语义沉淀（历史上曾要求职业资质）让它给个人品牌加一层资质感，同时它还是产品「Pro 版」的天然域名：主站在 .com，付费专业版落在同名 .pro。判断标准：卖的是「我这个人/团队的权威」、内容深度撑得起「expert」的承诺 → .expert 的招牌感更强，但要认真经营才值回续费；卖的是泛专业服务、或给产品做 Pro 版/付费升级页 → .pro 更便宜更百搭。共同提醒：「专家」是承诺，空壳站用 .expert 反而放大质疑；监管行业（法律、医疗、金融）的「专家」表述注意广告合规。",
      pickA: ["独立顾问与咨询师个人 IP", "「领域词 + .expert」数字招牌", "垂直评测与知识付费站", "内容深度撑得起权威承诺的站点"],
      pickB: ["泛专业服务与工作室", "产品 Pro 版与付费升级页", "续费预算敏感的个人品牌", "与主域名配合的专业子品牌"],
    },
    en: {
      title: ".expert vs .pro: Named Authority or Generic Professionalism",
      metaDescription:
        ".expert puts the expert claim in the domain but renews high; .pro signals generic professionalism at a low price. Compare signal strength, pricing and fit, then hunt available names.",
      verdict:
        "Both sell professionalism at different concentrations. .expert is an introduction — name.expert tells visitors exactly who you claim to be, and field-word combos like seo.expert or tax.expert are digital shingles, ideal for consultants, lawyers and accountants building a personal brand into a name. The catch is the pricing structure: about $7 the first year but ~$50/yr to renew — classic promo-then-harvest, so budget strictly on the renewal. .pro is broader and cheaper — its professional semantics (it once required credentials to register) add a layer of qualification to personal brands, and it's also the natural home for a product's Pro tier: main site on .com, the paid version on the matching .pro. The test: you sell the authority of a named person or team, with content deep enough to back the \"expert\" claim → .expert's shingle is stronger, but only pays if you run the practice seriously; you sell general professional services or need a Pro-tier landing page → .pro is cheaper and more versatile. Shared caution: \"expert\" is a promise — thin content amplifies skepticism — and in regulated fields (law, medicine, finance) expert claims can trip advertising rules.",
      pickA: ["Consultant and advisor personal brands", "Field-word digital shingles (seo.expert)", "Vertical review and paid-knowledge sites", "Sites with depth to back the expert claim"],
      pickB: ["General professional services and studios", "Product Pro tiers and paid-upgrade pages", "Renewal-budget-sensitive personal brands", "Professional sub-brands beside a main domain"],
    },
  },
  "farm-vs-cafe": {
    slug: "farm-vs-cafe",
    a: "farm",
    b: "cafe",
    zh: {
      title: ".farm 和 .cafe 怎么选：产地直供与场所空间的对比",
      metaDescription: ".farm 讲「从农场到餐桌」的产地故事，.cafe 指向咖啡馆与线上「聚集地」。对比两个食物系后缀的语义、价格与适用场景，并用 AI 猎取可注册的名字。",
      verdict:
        "两个都是食物系后缀，讲的故事不同。.farm 讲「源头」——家庭农场直销、有机食品品牌、农家乐与农业科技用 name.farm，「从农场到餐桌」的故事从域名就开始讲，对被 .com 占名的小生产者格外友好；技术圈还有一层梗：render farm、server farm 的集群语义让算力与自动化项目用它自带幽默。注册约 $8、续费约 $31/年。.cafe 讲「场所」——独立咖啡店、烘焙工作室、猫咖书咖用 name.cafe，域名和店招完全同构；「cafe」在互联网语境里更是「轻松聚集地」的代名词，读书会、语言角、开发者社区拿它做线上客厅比 .com 更有温度。注册约 $5、续费约 $42/年，首年友好但续费更高。判断标准：卖的是「东西从哪来」（农产品、食材、产地信任）→ .farm 的源头叙事更准；卖的是「人来哪聚」（店面、空间、社区客厅）→ .cafe 的场所感无可替代。共同注意：两者行业气质都浓，业务不沾边硬用会错位；食品生鲜先备好许可证，内容站则要避开「content farm」的负面联想。",
      pickA: ["家庭农场与农产品直销", "有机食品与生鲜品牌", "休闲农业与农家乐", "算力集群与自动化项目（server farm 梗）"],
      pickB: ["独立咖啡店与烘焙工作室", "猫咖、书咖等主题空间", "线上社区「客厅」（读书会、开发者社区）", "轻松聚集气质的生活方式品牌"],
    },
    en: {
      title: ".farm vs .cafe: Source Story or Gathering Place",
      metaDescription:
        ".farm tells the farm-to-table source story; .cafe points at coffee shops and cozy online gathering places. Compare the two food-world suffixes on semantics, pricing and fit, then hunt available names.",
      verdict:
        "Both are food-world suffixes telling different stories. .farm tells the source story — family farms selling direct, organic food brands, farm stays and agtech on name.farm start the farm-to-table narrative in the address bar, and it's especially kind to small producers whose names are taken on .com; tech culture adds a wink, since render farms and server farms make .farm a natural fit for compute and automation projects. About $8 to register, $31/yr to renew. .cafe tells the place story — independent coffee shops, roasteries and themed cafés wear name.cafe as a domain identical to the shop sign, and since \"cafe\" doubles as internet shorthand for a cozy gathering spot, book clubs, language corners and developer communities use it as a warmer online living room than .com. About $5 to register but $42/yr to renew — friendly first year, higher carry. The test: you sell where things come from (produce, ingredients, source trust) → .farm's origin story is more precise; you sell where people gather (a shop, a space, a community living room) → .cafe's sense of place is irreplaceable. Shared caution: both carry strong industry flavor that miscasts unrelated businesses; food commerce needs licenses first, and content sites should weigh the \"content farm\" pejorative.",
      pickA: ["Family farms and direct selling", "Organic and fresh food brands", "Farm stays and agritourism", "Compute clusters and automation (server-farm wink)"],
      pickB: ["Independent coffee shops and roasteries", "Themed café spaces (cat cafés, book cafés)", "Online community living rooms (book clubs, dev communities)", "Laid-back lifestyle gathering brands"],
    },
  },
  "ninja-vs-dev": {
    slug: "ninja-vs-dev",
    a: "ninja",
    b: "dev",
    zh: {
      title: ".ninja 和 .dev 怎么选：梗后缀与开发者正装的对比",
      metaDescription: ".ninja 玩「某领域高手」的梗且注册极便宜，.dev 是 Google 系的开发者正装后缀。对比两者的调性、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两个都面向技术人，穿的是完全不同的衣服。.ninja 是梗——「X ninja」在英语里就是「X 领域的高手」，api.ninja、css.ninja 这样的「技能词 + .ninja」自带幽默与个性，注册约 $6、续费约 $25/年，试错成本几乎可以忽略，个人项目、side project、电竞战队用它轻松又出挑。.dev 是正装——Google 注册局运营、全区强制 HTTPS，开发者工具、SDK、文档站、技术博客用它是圈内公认的专业信号，客户与雇主一眼认账。判断标准：项目要的是个性与传播梗（个人品牌、社区、游戏向）→ .ninja 更便宜也更好玩；项目要的是专业信任（商业工具、企业客户、长期品牌）→ .dev 的正装感与 HTTPS 强制是加分项。注意 .ninja 的梗在英语圈最强、严肃 B2B 场景会打折扣；.dev 则要求全站配好证书才能访问，部署时别忘了。",
      pickA: ["个人技术品牌与 side project", "电竞战队与游戏社区", "「技能词 + .ninja」的梗式招牌", "注册与续费预算敏感"],
      pickB: ["开发者工具、CLI 与 SDK", "文档站与技术博客", "面向企业客户的商业工具", "看重强制 HTTPS 的安全信号"],
    },
    en: {
      title: ".ninja vs .dev: Meme Badge or Developer Formalwear",
      metaDescription:
        ".ninja plays the \"master of X\" meme at a rock-bottom price; .dev is Google's buttoned-up developer suffix. Compare tone, pricing and fit, then hunt names available on both.",
      verdict:
        "Both speak to technical people in completely different outfits. .ninja is the meme — \"X ninja\" means a master of X, and skill-word combos like api.ninja or css.ninja carry built-in humor and personality; at about $6 to register and $25/yr to renew, the trial cost is nearly negligible, perfect for personal projects, side projects and esports teams. .dev is the formalwear — run by Google's registry with HTTPS enforced zone-wide, it's the recognized professional signal for developer tools, SDKs, docs sites and technical blogs; clients and employers credit it at a glance. The test: the project trades on personality and meme-ability (personal brands, communities, gaming) → .ninja is cheaper and more fun; the project trades on professional trust (commercial tools, enterprise customers, long-term brands) → .dev's polish and enforced HTTPS earn their keep. Note the ninja meme lands strongest in English-speaking markets and discounts in serious B2B contexts, and .dev sites simply won't load without a valid certificate — plan deployment accordingly.",
      pickA: ["Personal tech brands and side projects", "Esports teams and gaming communities", "Skill-word meme shingles (api.ninja)", "Registration and renewal budget sensitive"],
      pickB: ["Developer tools, CLIs and SDKs", "Docs sites and technical blogs", "Commercial tools for enterprise customers", "Enforced-HTTPS security signal"],
    },
  },
  "pet-vs-shop": {
    slug: "pet-vs-shop",
    a: "pet",
    b: "shop",
    zh: {
      title: ".pet 和 .shop 怎么选：行业专属与电商通用的对比",
      metaDescription: ".pet 三个字母写清宠物行业，.shop 是电商通用后缀覆盖所有品类。对比两者的语义精度、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "一个说「卖什么」，一个说「在卖」。.pet 是行业指向最明确的后缀之一——宠物用品电商、宠物医院、美容寄养、宠物科技用 name.pet，三个字母把行业写清，比 petsomething.com 的拼接短得多，mars.pet（玛氏宠物）这样的品牌延伸就是背书；注册约 $11、续费约 $21/年，对客单价可观的宠物行业毫无压力。.shop 更宽——它只说「这里能买东西」，不限品类，宠物店能用、服装店也能用，全球电商采用量大、用户认知成熟，商品词与品牌词的库存也深。判断标准：业务垂直在宠物赛道且打算长期深耕 → .pet 的行业精度是 .shop 给不了的，域名本身就是定位；业务品类多元、或未来可能扩品 → .shop 不会把品牌锁死在单一行业。组合打法也常见：品牌主站用 .shop 承接全品类，宠物子品牌线用 .pet 做垂直入口。注意 .pet 对国内大众认知度一般，建议配合中文品牌词；.shop 则要靠品牌词本身把「卖什么」讲清楚。",
      pickA: ["宠物用品电商与线下门店", "宠物医院、美容与寄养服务", "宠物科技与智能硬件", "深耕宠物赛道的垂直品牌"],
      pickB: ["多品类电商与集合店", "未来可能扩品的零售品牌", "看重用户对后缀的成熟认知", "商品词入名的通用网店"],
    },
    en: {
      title: ".pet vs .shop: Industry Precision or E-commerce Generic",
      metaDescription:
        ".pet says the pet industry in three letters; .shop covers every retail category. Compare semantic precision, pricing and fit, then hunt names available on both.",
      verdict:
        "One says what you sell; the other says that you sell. .pet is among the most industry-explicit suffixes anywhere — pet-supply stores, vet clinics, grooming and boarding, and pet tech on name.pet declare the trade in three letters, far shorter than any petsomething.com compound, with corporate extensions like mars.pet (Mars Petcare) endorsing it at the highest level; about $11 to register and $21/yr to renew is trivial for an industry with healthy ticket sizes. .shop is broader — it only says \"you can buy here\", category-agnostic, with huge global adoption, mature user recognition and deep inventory of product and brand words. The test: the business is vertical in pets and staying there → .pet's precision is something .shop can't match — the domain is the positioning; the business spans categories or may expand → .shop won't lock the brand into one industry. The combo play is common too: main store on .shop for the full catalog, the pet line on a matching .pet as a vertical entry. Note .pet's recognition among mainland-Chinese consumers is moderate — pair it with a strong Chinese brand name — while .shop leans on the brand word itself to say what's sold.",
      pickA: ["Pet-supply e-commerce and stores", "Vet clinics, grooming and boarding", "Pet tech and smart hardware", "Vertical brands committed to the pet space"],
      pickB: ["Multi-category stores and marketplaces", "Retail brands that may expand categories", "Mature user recognition of the suffix", "Generic storefronts with product-word names"],
    },
  },
  "blue-vs-red": {
    slug: "blue-vs-red",
    a: "blue",
    b: "red",
    zh: {
      title: ".blue 和 .red 怎么选：冷静信任与热情流量的颜色对比",
      metaDescription: ".blue 传达专业冷静的信任感，.red 自带热情醒目与中文「走红」寓意。对比两个颜色后缀的气质、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "同属 Identity Digital 的颜色系后缀、定价都温和，选择只看品牌要传达的情绪。.blue 是颜色系里最商务的——蓝色代表专业、冷静与信任，金融、科技、医疗类品牌的主色十有八九是蓝，jet.blue 式的「品牌词 + .blue」等于把 VI 写进域名；注册约 $13、续费约 $20/年，续费比注册没贵多少。.red 是热情与流量——红色跨文化通吃醒目与能量，中文语境更叠加喜庆、走红、网红的意味，「红」本身就是流量词，婚庆节庆、美妆潮流、内容项目都有天然的解释空间；注册约 $8、续费约 $19/年。判断标准：品牌卖「靠谱」（专业服务、工具、健康）且主视觉是蓝 → .blue 的冷静气质更配；品牌卖「热闹」（节庆、潮流、内容流量）或面向中文用户玩「走红」梗 → .red 更有戏。共同注意：颜色后缀不自带行业指向，首屏要快速讲清业务；且后缀要服务品牌故事——主视觉不是这个颜色就别硬凑。",
      pickA: ["以蓝色为主视觉的专业品牌", "金融、科技与健康类项目", "海洋、天空与航空主题", "看重「冷静信任」的品牌气质"],
      pickB: ["婚庆节庆与喜庆业务", "美妆潮流与内容流量项目", "面向中文用户玩「走红」寓意", "以红色为主视觉的品牌"],
    },
    en: {
      title: ".blue vs .red: Calm Trust or Hot Energy in a Color",
      metaDescription:
        ".blue signals professional calm and trust; .red brings heat, visibility and festive energy. Compare the two color suffixes on vibe, pricing and fit, then hunt names available on both.",
      verdict:
        "Both are Identity Digital color TLDs with gentle pricing, so the choice is purely about the emotion your brand leads with. .blue is the businesslike one — blue means professionalism, calm and trust, the primary color of most finance, tech and healthcare brands, and jet.blue-style combos write the brand book into the address bar; about $13 to register, $20/yr to renew, barely above registration. .red is heat and attention — red reads energetic and eye-catching across cultures, and in Chinese contexts it stacks festive and viral connotations (\"going red\" means going viral), giving wedding and festival businesses, beauty and trend brands, and content projects a story for free; about $8 to register, $19/yr to renew. The test: the brand sells reliability (professional services, tools, health) with a blue-first identity → .blue's calm fits; the brand sells excitement (festivals, trends, content virality) or plays the Chinese \"going red\" card → .red has more theater. Shared caution: color suffixes carry no industry signal, so the homepage must say what you do fast — and the suffix should serve the brand story; don't force a color that isn't yours.",
      pickA: ["Blue-first professional brand identities", "Finance, tech and health projects", "Ocean, sky and aviation themes", "Brands leading with calm trust"],
      pickB: ["Wedding, festival and celebration businesses", "Beauty, trend and content-virality projects", "Chinese-market \"going red\" wordplay", "Red-first brand identities"],
    },
  },
  "black-vs-gold": {
    slug: "black-vs-gold",
    a: "black",
    b: "gold",
    zh: {
      title: ".black 和 .gold 怎么选：黑金两色的高端叙事对比",
      metaDescription: ".black 自带奢华神秘的黑卡气质，.gold 一词双关黄金实物与金牌品质。对比两个高端后缀的语义、续费成本与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "黑与金是高端品牌语言里的两大主色，两个后缀讲的高端却不同款。.black 讲「克制的奢华」——设计师品牌、黑卡级会员体系、威士忌与精品咖啡、暗黑美学的游戏与潮牌用 name.black，把调性焊死在域名上；注册约 $16、续费约 $52/年，只配认真经营的品牌主域。.gold 讲「货真价实」——本义黄金让金店、珠宝、贵金属业务一秒传达行业，引申义「金牌/顶级」让会员最高档、精品推荐也用得顺；注册约 $6 很低，但续费约 $83/年是更高档，预算同样要按续费核算。判断标准：品牌卖「神秘感与身份」（会员制、暗色系美学、小众精品）→ .black 的黑卡气质更准；品牌卖「实物或金牌品质」（珠宝贵金属、高端服务的品质承诺）→ .gold 的双关更实。两者共同点：续费都贵、都只适合旗舰域名而非囤名；高端语义都是承诺，产品与视觉撑不起反而显得廉价。另注意「black」有黑市联想、金融交易类慎用，「gold」的贵金属交易属强监管领域、注意合规。",
      pickA: ["设计师品牌与小众精品", "黑卡级会员体系与私享服务", "威士忌、精品咖啡等鉴赏品牌", "暗黑美学游戏与潮牌"],
      pickB: ["金店、珠宝与贵金属业务", "金牌品质承诺的高端服务", "会员体系的最高档命名", "金色系视觉的品牌主域"],
    },
    en: {
      title: ".black vs .gold: Two Colors of Premium",
      metaDescription:
        ".black carries black-card luxury and mystique; .gold puns on physical gold and gold-tier quality. Compare the two premium suffixes on semantics, renewal cost and fit, then hunt names available on both.",
      verdict:
        "Black and gold are the two lead colors of premium brand language, and the suffixes sell different kinds of premium. .black sells restrained luxury — designer labels, black-card membership tiers, whisky and specialty-coffee brands, and dark-aesthetic games or streetwear weld the tone into name.black; about $16 to register and $52/yr to renew, it only pays as a flagship domain you'll seriously run. .gold sells the real thing — literal gold makes jewelers, bullion and precious-metals businesses instantly legible, while the gold-tier metaphor suits top membership levels and curated picks; about $6 to register but ~$83/yr to renew, so budget strictly on the renewal here too. The test: the brand trades on mystique and status (memberships, dark aesthetics, niche luxury) → .black's black-card register is sharper; the brand trades on the physical metal or a gold-standard quality promise → .gold's double meaning does more work. They share the caveats: both renew expensive and fit flagship domains, not hoarding; and premium semantics are a promise — thin products and visuals make either read cheap. Also note \"black\" can evoke black markets (weigh it for finance and trading), and precious-metals trading is heavily regulated — compliance first.",
      pickA: ["Designer labels and niche luxury", "Black-card membership tiers", "Whisky, specialty coffee and connoisseur brands", "Dark-aesthetic games and streetwear"],
      pickB: ["Jewelers, bullion and precious metals", "Gold-standard premium service promises", "Top-tier membership naming", "Gold-first flagship brand domains"],
    },
  },
  "rocks-vs-fun": {
    slug: "rocks-vs-fun",
    a: "rocks",
    b: "fun",
    zh: {
      title: ".rocks 和 .fun 怎么选：喝彩表达与娱乐气质的对比",
      metaDescription: ".rocks 把「X 真棒」写进域名适合粉丝站与社区，.fun 直接标注娱乐属性。对比两个表达型后缀的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两个都是「气氛组」后缀，喊的口号不同。.rocks 是一句喝彩——「X rocks!」就是「X 真棒！」，粉丝站与应援站、乐队与音乐现场、开源项目社区（vuejs.rocks 式）用它热情溢出，还有地质、攀岩、矿石收藏的字面双关；注册约 $4、续费约 $18/年，几乎零门槛。.fun 是一块招牌——它不夸谁，只说「这里好玩」，游戏娱乐站、活动派对、儿童向产品、休闲小工具挂上 .fun，用户预期立刻对齐。判断标准：站点围绕「热爱的对象」（偶像、球队、乐队、开源项目）→ .rocks 的喝彩语义更带感，「对象 + .rocks」读出来要顺口才有梗；站点围绕「好玩的体验」（游戏、活动、玩乐内容）→ .fun 的品类标注更直接。共同注意：两者都是口语化后缀，正式商务主域会显得随意，更适合社区、副项目与品牌的玩乐分线；低价后缀历史上垃圾站占比偏高，认真项目要靠内容质量把信任拉回来。",
      pickA: ["粉丝站与应援站", "乐队、音乐现场与巡演站", "开源项目与社区（vuejs.rocks 式）", "攀岩馆与地质科普的双关"],
      pickB: ["游戏与娱乐内容站", "活动、派对与线下玩乐", "儿童向产品与休闲工具", "品牌的玩乐向子站"],
    },
    en: {
      title: ".rocks vs .fun: A Cheer or an Amusement Sign",
      metaDescription:
        ".rocks puts \"X rocks!\" in the domain for fan sites and communities; .fun labels entertainment outright. Compare the two expressive suffixes on semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both are mood suffixes shouting different lines. .rocks is a cheer — \"X rocks!\" is pure enthusiasm, so fan and supporter sites, bands and live-music venues, and open-source communities (the vuejs.rocks pattern) wear it with the exclamation mark built in, plus a free pun for climbing gyms and geology projects; about $4 to register and $18/yr to renew — nearly zero barrier. .fun is a sign over the door — it praises nothing, it just says \"this is where the fun is\": games and entertainment sites, events and parties, kids' products and playful tools align user expectations instantly. The test: the site orbits something you love (an idol, a team, a band, a project) → .rocks lands the cheer, as long as name + rocks reads smoothly aloud; the site orbits a fun experience (games, events, playful content) → .fun's category label is more direct. Shared caution: both read colloquial — better for communities, side projects and a brand's playful sub-site than a formal corporate flagship — and cheap TLDs historically attract spam, so serious projects must earn trust back with content quality.",
      pickA: ["Fan sites and supporter hubs", "Bands, venues and tour sites", "Open-source communities (vuejs.rocks style)", "Climbing and geology puns"],
      pickB: ["Games and entertainment content", "Events, parties and offline fun", "Kids' products and playful tools", "A brand's playful sub-site"],
    },
  },
  "pink-vs-me": {
    slug: "pink-vs-me",
    a: "pink",
    b: "me",
    zh: {
      title: ".pink 和 .me 怎么选：甜美调性与个人身份的对比",
      metaDescription: ".pink 一眼定调甜美少女感，.me 天然指向个人品牌与作品集。对比两者的气质、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两个都常被个人与小品牌选中，说的却是不同的话。.pink 说「我是什么调性」——甜美、柔软、少女感，美妆美甲、甜品烘焙、婚礼花艺、少女感设计用 name.pink，用户还没进站脑海里已有粉色画面，粉红丝带公益项目用它也名正言顺；注册约 $8、续费约 $21/年，成本温和。.me 说「这是我本人」——个人站、简历、作品集、newsletter 的经典后缀，还能玩 hire.me、about.me 式的语义梗，不限调性、不限行业。判断标准：主体是「品牌的视觉气质」且这个气质就是粉色系（美妆、甜品、婚礼）→ .pink 把 VI 写进域名，一眼定调是行业后缀给不了的；主体是「你这个人」（作品集、个人 IP、简历页）→ .me 的身份语义更普适，跟着人走不跟着调性走。注意 .pink 的气质即限制——严肃行业用它显得轻佻，面向男性为主的客群也要斟酌；.me 则是个人属性强于公司属性，公司主站另选。",
      pickA: ["美妆美甲与时尚品牌", "甜品烘焙与下午茶", "婚礼花艺与少女感设计", "粉红丝带公益项目"],
      pickB: ["个人品牌、简历与作品集", "newsletter 与个人博客", "语义梗域名（hire.me 类）", "不想被单一调性绑定的个人站"],
    },
    en: {
      title: ".pink vs .me: A Color Mood or a Personal Identity",
      metaDescription:
        ".pink sets a sweet, feminine tone at a glance; .me points straight at personal brands and portfolios. Compare vibe, pricing and fit, then hunt names available on both.",
      verdict:
        "Both attract individuals and small brands, but they say different things. .pink says what mood I am — sweet, soft, feminine: beauty and nail brands, bakeries and afternoon-tea shops, wedding florists and girly design studios on name.pink put the pink picture in the visitor's head before the page loads, and pink-ribbon charity projects wear it with full legitimacy; about $8 to register and $21/yr to renew keeps costs gentle. .me says this is me — the classic suffix for personal sites, résumés, portfolios and newsletters, with room for semantic plays like hire.me, unbound by tone or industry. The test: the subject is a brand's visual mood and that mood is pink (beauty, desserts, weddings) → .pink writes the brand book into the domain in a way no industry suffix can; the subject is you as a person (portfolio, personal IP, résumé page) → .me's identity semantics travel with the person, not the palette. Note .pink's vibe is also its limit — it reads flippant in serious industries and needs weighing for male-skewing audiences — while .me suits people better than company homepages.",
      pickA: ["Beauty, nail and fashion brands", "Bakeries and afternoon-tea shops", "Wedding florists and girly design", "Pink-ribbon charity projects"],
      pickB: ["Personal brands, résumés, portfolios", "Newsletters and personal blogs", "Semantic-pun domains (hire.me style)", "Personal sites avoiding a single tone lock-in"],
    },
  },
  "academy-vs-school": {
    slug: "academy-vs-school",
    a: "academy",
    b: "school",
    zh: {
      title: ".academy 和 .school 怎么选：体系化学院与日常学校的对比",
      metaDescription: ".academy 自带体系化、专业化的进阶感，.school 直白亲切适合面向孩子与家长。对比两个教育后缀的气质、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "同属 Identity Digital 的教育后缀，说的却是两种「教」。.academy 讲「体系」——academy 一词在英语里自带成建制、专业化的意味，Khan Academy 把它在教育界的认知推到顶点：在线课程平台、编程训练营、企业培训与品牌学院（brand academy）用 name.academy，传达的是「一套课程体系」而非单节课；注册约 $12、续费约 $38/年。.school 讲「日常」——它是教育后缀里最直白的一个，name.school 读出来就是一所学校，气质亲切，幼儿园、K12 课外班、驾校舞校、兴趣班这类面向孩子与家长的场景刚好，「学一门手艺」的项目（sourdough.school 式）用它也出彩；注册约 $6、续费约 $29/年，两头都比 .academy 便宜。判断标准：课程成体系、面向成人或企业、想立「专业进阶」人设 → .academy 的进阶感更配；面向孩子家长、气质要亲切、或预算敏感 → .school 更实。共同注意：两者都不是办学资质，正规资质要页面另行呈现；且都是长后缀（7 与 6 个字母），主体名务必要短。",
      pickA: ["在线课程平台与训练营", "企业培训与品牌学院", "面向成人的体系化课程", "「专业进阶」的品牌人设"],
      pickB: ["幼儿园与 K12 课外班", "驾校舞校与兴趣班", "「学一门手艺」的轻量项目", "预算敏感的教育创业"],
    },
    en: {
      title: ".academy vs .school: Structured Curriculum or Everyday Classroom",
      metaDescription:
        ".academy signals structured, professional curriculum; .school reads warm and literal for kids-and-parents audiences. Compare vibe, pricing and fit, then hunt names available on both.",
      verdict:
        "Both are Identity Digital education suffixes, but they teach in different registers. .academy says structure — the word carries a sense of organized, professional curriculum, an association Khan Academy pushed to its peak: online course platforms, coding bootcamps, corporate training and brand academies on name.academy promise a program, not a single lesson; about $12 to register and $38/yr to renew. .school says everyday — the most literal education suffix there is, name.school reads as exactly what it is, warm and approachable: kindergartens, after-school programs, driving and dance schools, and hobby classes aimed at kids and parents fit perfectly, and learn-a-craft projects (the sourdough.school pattern) charm on it too; about $6 to register and $29/yr to renew — cheaper on both ends. The test: a structured curriculum for adults or companies, positioning as professional advancement → .academy's register fits; a kids-and-parents audience, a warm tone, or a tight budget → .school does more with less. Shared cautions: neither is an accreditation — formal credentials belong on the page; and both are long suffixes (seven and six letters), so keep the subject word short.",
      pickA: ["Online course platforms & bootcamps", "Corporate training & brand academies", "Structured programs for adults", "Professional-advancement positioning"],
      pickB: ["Kindergartens & K-12 after-school programs", "Driving, dance & hobby schools", "Learn-a-craft side projects", "Budget-sensitive education startups"],
    },
  },
  "care-vs-doctor": {
    slug: "care-vs-doctor",
    a: "care",
    b: "doctor",
    zh: {
      title: ".care 和 .doctor 怎么选：服务温度与专业身份的对比",
      metaDescription: ".care 把「关怀」写进域名传达服务温度，.doctor 把医生身份写进域名建立专业权威。对比两个健康类后缀的语义、续费成本与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "同在大健康赛道，一个讲「我们在乎你」，一个讲「我是专业的」。.care 是温度——养老护理、居家照护、心理健康、母婴与宠物护理用 name.care，服务属性一秒传达，home.care 式组合本身就是搜索品类词，国际大牌还把 brand.care 用作客服售后入口；注册约 $12、续费约 $36/年，成本温和。.doctor 是身份——医生个人品牌、私人诊所、在线问诊、专科门诊用 name.doctor，专业权威从域名开始，「X 医生」的引申义还让 bike doctor、plant doctor 式维修养护生意自带亲切感；但注册约 $8 的低门槛背后是续费约 $93/年的高价，典型「首年甜、续费贵」。判断标准：主体是「机构与服务」（护理、照护、关怀型业务）→ .care 的温度更准、成本更省；主体是「执业者个人或诊所」要立专业人设 → .doctor 的身份感是 .care 给不了的，但预算必须按续费核算。共同注意：医疗语境都涉及执业资质与广告合规，资质信息必须页面清晰呈现；.doctor 在医疗场景更有暗示资质之嫌，非医疗的比喻用法反而没这个包袱。",
      pickA: ["养老护理与居家照护", "心理健康与母婴护理", "宠物护理与关怀型服务", "品牌客户关怀入口"],
      pickB: ["医生个人品牌与私人诊所", "在线问诊与专科服务", "口腔眼科等专科门诊", "维修养护类「X 医生」品牌"],
    },
    en: {
      title: ".care vs .doctor: Service Warmth or Professional Authority",
      metaDescription:
        ".care puts compassion in the domain; .doctor puts the white coat in it. Compare the two health suffixes on semantics, renewal cost and fit, then hunt names available on both.",
      verdict:
        "Both live in the health economy; one says \"we care about you\", the other says \"I'm the professional\". .care is warmth — senior and home care, mental health, mother-and-baby and pet care on name.care declare the service instantly, combos like home.care read as search-category keywords, and global brands use brand.care as a customer-care portal; about $12 to register and $36/yr to renew keeps costs gentle. .doctor is identity — physician personal brands, private clinics, telehealth and specialist practices on name.doctor build authority from the address itself, and the \"X doctor\" metaphor gives bike-doctor or plant-doctor style repair businesses instant charm; but the modest ~$8 registration hides a ~$93/yr renewal — the classic cheap-first-year, expensive-renewal suffix. The test: the subject is an organization and its service (care, caregiving, compassion-led businesses) → .care is warmer and far cheaper to keep; the subject is a practitioner or clinic staking a professional identity → .doctor carries an authority .care can't, budgeted strictly on the renewal. Shared cautions: medical contexts carry licensing and advertising-compliance obligations — credentials must be displayed clearly; and .doctor can imply licensure in medical use, a burden the metaphorical uses don't carry.",
      pickA: ["Senior & home care services", "Mental health & baby care", "Pet care & compassion-led brands", "Brand customer-care portals"],
      pickB: ["Physician brands & private clinics", "Telehealth & specialist services", "Dental, eye & specialty practices", "\"X doctor\" repair & care brands"],
    },
  },
  "coach-vs-expert": {
    slug: "coach-vs-expert",
    a: "coach",
    b: "expert",
    zh: {
      title: ".coach 和 .expert 怎么选：带练身份与权威招牌的对比",
      metaDescription: ".coach 说「我带你变强」，.expert 说「我是这个领域的权威」。对比两个专业身份后缀的语义、续费成本与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两个都是把专业身份写进域名的后缀，姿态却不同。.coach 说「我带你变强」——健身私教、人生教练、职业教练、高管教练，凡是一对一带练的生意，name.coach 都是身份即域名，life.coach 这样的组合本身就是品类词；注册约 $11、续费约 $62/年。.expert 说「我是权威」——独立顾问、律师会计等专业人士、垂直咨询、深度评测与知识付费用 name.expert，seo.expert、tax.expert 式的「领域词 + .expert」就是一块数字招牌；注册约 $7 很低、续费约 $50/年，同样是首年甜续费贵。判断标准：交付形态是「陪伴式带练」（课程、训练营、一对一辅导），客户买的是过程 → .coach 的动作感更准；交付形态是「权威输出」（咨询意见、深度内容、专业服务），客户买的是判断 → .expert 的招牌感更配。两者续费都不便宜，只适合认真经营的获客主域而非囤货；且都是承诺型后缀——内容与案例撑不起时反而放大质疑，教练要挂 ICF 等认证，专家要有作品与案例，监管行业（法律、医疗、金融）的「专家」表述还要注意广告合规。",
      pickA: ["健身私教与运动教练", "人生教练与职业教练", "高管教练与企业教练", "陪伴式课程与训练营"],
      pickB: ["独立顾问与垂直咨询", "律师会计等专业人士", "深度评测与知识付费", "「领域词 + 权威」的数字招牌"],
    },
    en: {
      title: ".coach vs .expert: Training Partner or Authority Sign",
      metaDescription:
        ".coach says \"I make you better\"; .expert says \"I'm the authority\". Compare the two professional-identity suffixes on semantics, renewal cost and fit, then hunt names available on both.",
      verdict:
        "Both weld a professional identity into the domain, in different postures. .coach says I make you better — personal trainers, life coaches, career and executive coaches, any one-on-one improvement business turns identity into address with name.coach, and combos like life.coach are category keywords outright; about $11 to register, $62/yr to renew. .expert says I'm the authority — independent consultants, lawyers and accountants, vertical consultancies, deep reviews and paid-knowledge sites on name.expert hang a digital shingle, with domain-word combos like seo.expert or tax.expert doing the positioning by themselves; about $7 to register but $50/yr to renew — cheap first year, real renewal. The test: the deliverable is guided practice (programs, bootcamps, one-on-one coaching) and clients buy the process → .coach's verb energy fits; the deliverable is authoritative judgment (advice, deep content, professional services) and clients buy the verdict → .expert's shingle fits. Both renew expensive — flagship client-acquisition domains only, no stockpiling — and both are promises: thin content amplifies doubt, so coaches should display certifications (ICF and the like), experts need work and case studies, and \"expert\" claims in regulated industries (law, medicine, finance) need compliance care.",
      pickA: ["Personal trainers & sports coaches", "Life & career coaches", "Executive & business coaches", "Guided programs & bootcamps"],
      pickB: ["Independent consultants & vertical advisory", "Lawyers, accountants & professionals", "Deep reviews & paid knowledge", "Field-word digital shingles (seo.expert)"],
    },
  },
  "restaurant-vs-cafe": {
    slug: "restaurant-vs-cafe",
    a: "restaurant",
    b: "cafe",
    zh: {
      title: ".restaurant 和 .cafe 怎么选：正餐门面与轻食空间的对比",
      metaDescription: ".restaurant 全拼写清全服务餐厅的身份，.cafe 短小温暖适合咖啡馆与轻松聚集地。对比两个餐饮后缀的长度、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都是把餐饮身份写进域名，选择先看业态、再看长度。.restaurant 是正餐门面——全服务餐厅、连锁品牌、餐饮集团、预订平台用 name.restaurant，行业身份一目了然；餐厅店名多是人名地名，.com 早被占光，而「店名 + .restaurant」库存极好，多品牌集团用统一后缀归拢旗下官网也优雅；注册约 $13、续费约 $52/年，对正经餐厅可忽略。但 restaurant 十个字母是最长后缀之一，店名必须短。.cafe 是轻食空间——四个字母短小温暖，独立咖啡店、烘焙工作室、猫咖书咖用 name.cafe，域名和店招完全同构；「cafe」在互联网语境里还是「轻松聚集地」的代名词，读书会、开发者社区拿它做线上客厅也顺；注册约 $5、续费约 $42/年，两头更便宜。判断标准：全服务正餐、多品牌集团、要「餐厅」二字的正式感 → .restaurant；咖啡轻食、休闲空间、或线上社区的温度感 → .cafe 更短更亲。共同注意：食客多从地图与点评平台进店，域名的角色是菜单、订座与品牌的稳定入口；快餐酒吧另有更贴的 .pizza/.bar 可选。",
      pickA: ["全服务餐厅与连锁品牌", "餐饮集团多品牌官网", "预订与点评平台", "菜系与主题正餐厅"],
      pickB: ["独立咖啡店与烘焙工作室", "猫咖书咖等主题空间", "轻食简餐与下午茶", "读书会与社区的线上客厅"],
    },
    en: {
      title: ".restaurant vs .cafe: Full-Service Storefront or Cozy Corner",
      metaDescription:
        ".restaurant spells out a full-service dining identity; .cafe is short and warm for coffee shops and casual hangouts. Compare length, pricing and fit, then hunt names available on both.",
      verdict:
        "Both write the food business into the domain; choose by format first, length second. .restaurant is the full-service storefront — restaurants, chains, hospitality groups and booking platforms on name.restaurant are unmistakable; restaurant names are typically personal names or places whose .com vanished decades ago, while name + .restaurant inventory is wide open, and groups can unify multiple brand sites under one suffix; about $13 to register and $52/yr to renew is a rounding error for a real restaurant. The catch: at ten letters it's one of the longest suffixes anywhere, so the name in front must be short. .cafe is the cozy corner — four letters, warm and short: independent coffee shops, bakery studios, cat and book cafés on name.cafe make the domain and the shop sign one and the same, and since \"cafe\" doubles as internet shorthand for a relaxed gathering place, book clubs and developer communities use it as an online living room; about $5 to register and $42/yr to renew — cheaper on both ends. The test: full-service dining, multi-brand groups, the formality of the word \"restaurant\" → .restaurant; coffee, light meals, casual spaces or community warmth → .cafe is shorter and friendlier. Shared note: diners mostly arrive via maps and review platforms, so the domain's job is a stable home for menu, reservations and brand — and fast food or bars have tighter fits in .pizza and .bar.",
      pickA: ["Full-service restaurants & chains", "Hospitality group brand sites", "Booking & review platforms", "Cuisine & theme dining"],
      pickB: ["Independent coffee shops & bakeries", "Cat & book cafés and themed spaces", "Light meals & afternoon tea", "Community \"online living rooms\""],
    },
  },
  "academy-vs-coach": {
    slug: "academy-vs-coach",
    a: "academy",
    b: "coach",
    zh: {
      title: ".academy 和 .coach 怎么选：课程体系与个人带练的对比",
      metaDescription: ".academy 卖一套课程体系，.coach 卖一个带练的人。对比两个培训类后缀的语义、续费成本与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "同做「教人变强」的生意，卖的东西不同。.academy 卖「体系」——name.academy 传达的是成建制的课程：在线课程平台、编程训练营、企业培训与品牌学院用它，用户预期是一套教学产品，规模化交付、多讲师、有课程表；注册约 $12、续费约 $38/年，在培训类后缀里性价比高。.coach 卖「人」——name.coach 传达的是一对一带练的教练本人：健身私教、人生教练、高管教练用它，获客靠个人信任，「人名/细分领域 + .coach」把身份写进域名比任何 slogan 都高效；注册约 $11 与 .academy 相当，但续费约 $62/年明显更贵，预算要按续费核算。判断标准：产品是「课程」（可复制、可规模化、卖内容体系）→ .academy 的机构感更配，也更省；产品是「你这个人」（一对一、小班带练、卖陪伴与反馈）→ .coach 的身份感更准。成长路径也常见：个人教练做大后用 .academy 升级成课程品牌，两个后缀正好是业务的两个阶段。共同注意：都不是资质证明，教练认证（ICF 等）与课程口碑要页面呈现；主体名都要短，academy 七个字母、coach 五个字母，域名整体别过长。",
      pickA: ["在线课程平台与训练营", "企业培训与品牌学院", "多讲师规模化教学产品", "从个人教练升级的课程品牌"],
      pickB: ["健身私教与运动教练", "人生教练与高管教练", "一对一与小班带练", "「人名 + .coach」的个人 IP"],
    },
    en: {
      title: ".academy vs .coach: A Curriculum or a Person",
      metaDescription:
        ".academy sells a structured program; .coach sells the person training you. Compare the two training suffixes on semantics, renewal cost and fit, then hunt names available on both.",
      verdict:
        "Both are in the business of making people better; they sell different products. .academy sells the program — name.academy promises an organized curriculum: online course platforms, coding bootcamps, corporate training and brand academies use it when the product is a teaching system with scale, multiple instructors and a syllabus; about $12 to register and $38/yr to renew, good value among training suffixes. .coach sells the person — name.coach promises the one-on-one trainer themselves: personal trainers, life coaches and executive coaches acquire clients on personal trust, and writing the identity into the domain (your name or niche + .coach) beats any slogan; registration (~$11) matches .academy, but renewal around $62/yr is clearly higher — budget on the renewal. The test: the product is a course (replicable, scalable, content-led) → .academy's institutional register fits and costs less to keep; the product is you (one-on-one, small groups, accountability and feedback) → .coach's identity signal is sharper. The growth path is common too: a solo coach who scales into a course brand graduates from .coach to .academy — the two suffixes map to two stages of the same business. Shared cautions: neither certifies anything — display coaching credentials (ICF etc.) and course outcomes on the page; and both are long-ish (seven and five letters), so keep the front word short.",
      pickA: ["Online course platforms & bootcamps", "Corporate training & brand academies", "Scalable multi-instructor programs", "Course brands graduating from solo coaching"],
      pickB: ["Personal trainers & sports coaches", "Life & executive coaches", "One-on-one & small-group training", "Your-name + .coach personal IP"],
    },
  },
  "restaurant-vs-bar": {
    slug: "restaurant-vs-bar",
    a: "restaurant",
    b: "bar",
    zh: {
      title: ".restaurant 和 .bar 怎么选：正餐招牌与夜生活霓虹的对比",
      metaDescription: ".restaurant 全拼写清正餐身份，.bar 短促上口自带夜生活霓虹感。对比两个餐饮后缀的长度、价格结构与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "一个是白天的招牌，一个是夜里的霓虹。.restaurant 写清「正餐」——全服务餐厅、连锁品牌、餐饮集团用 name.restaurant，身份一目了然，店名词的 .com 被占也不愁，「店名 + .restaurant」库存极好；注册约 $13、续费约 $52/年，Identity Digital 运营，价格结构平稳。但它十个字母，店名必须短。.bar 是霓虹灯上的三个字母——鸡尾酒吧、清吧、livehouse、夜生活品牌用 name.bar，海报和霓虹灯上「XX.bar」就是完整店名，短促上口正是夜生活口头传播要的；开发者还能玩「条/栏」的双关做工具站。Team Internet 系运营，首年常见约 $3 的引流价、续费约 $52/年——首年便宜续费跳档，预算按续费核算，且保留与溢价词较多，下单前以注册商实时报价为准。判断标准：业态是坐下来吃饭的正餐 → .restaurant 的正式感与语义精度更配；业态是喝酒社交的夜场、或名字要印上霓虹灯 → .bar 的短促更帅。折中提示：既做正餐又做酒吧的 bistro 类业态，可主域用 .restaurant、酒吧线用 .bar 分线。共同注意：食客多从地图与点评进店，域名是菜单订座与品牌的稳定入口，名字都要好读好拼。",
      pickA: ["全服务餐厅与连锁品牌", "餐饮集团多品牌官网", "菜系与主题正餐厅", "预订与点评平台"],
      pickB: ["鸡尾酒吧与清吧", "livehouse 与夜生活品牌", "霓虹灯招牌式短域名", "开发者工具站（bar 双关）"],
    },
    en: {
      title: ".restaurant vs .bar: Daytime Sign or Neon Lights",
      metaDescription:
        ".restaurant spells out full-service dining; .bar is three neon-ready letters for nightlife. Compare length, price structure and fit, then hunt names available on both.",
      verdict:
        "One is the daytime sign, the other the neon at night. .restaurant spells out full-service dining — restaurants, chains and hospitality groups on name.restaurant are unmistakable, and with restaurant-name .coms long gone, name + .restaurant inventory stays wide open; about $13 to register and $52/yr to renew under Identity Digital, with a flat price structure. The cost is length: ten letters means the name in front must be short. .bar is three letters made for neon — cocktail bars, lounges, livehouses and nightlife brands wear name.bar as the complete shop sign on posters and signage, and the short, punchy read is exactly what word-of-mouth nightlife needs; developers even pun on the UI \"bar\" for tool sites. Run by the Team Internet family, the first year is often a ~$3 teaser while renewal runs ~$52/yr — budget on the renewal, and note the registry holds back premium words, so confirm live registrar pricing before ordering. The test: a sit-down dining format → .restaurant's formality and precision fit; a drinks-and-social night venue, or a name destined for a neon sign → .bar is cooler and shorter. The hybrid play: bistro-style venues can run the main site on .restaurant with the bar line on .bar. Shared note: diners arrive via maps and review platforms — the domain is the stable home for menu, reservations and brand, and either way the name must read aloud easily.",
      pickA: ["Full-service restaurants & chains", "Hospitality group brand sites", "Cuisine & theme dining", "Booking & review platforms"],
      pickB: ["Cocktail bars & lounges", "Livehouses & nightlife brands", "Neon-sign-ready short domains", "Developer tool sites (the bar pun)"],
    },
  },
  "clinic-vs-care": {
    slug: "clinic-vs-care",
    a: "clinic",
    b: "care",
    zh: {
      title: ".clinic 和 .care 怎么选：门诊场所与服务温度的对比",
      metaDescription: ".clinic 把「诊所」这个场所写进域名，.care 把「关怀」这份温度写进域名。对比两个健康类后缀的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "同在大健康赛道，一个说「这里是诊所」，一个说「我们在乎你」。.clinic 是场所——口腔、眼科、皮肤、医美、理疗、宠物诊所这类「门诊制」业务用 name.clinic，读出来就是一家诊所，连锁门诊归拢多城市站点也顺；英语里 clinic 还有「诊断式服务」的引申义，SEO clinic、resume clinic 式咨询生意用它自带专业感；注册约 $11、续费约 $52/年。.care 是温度——养老护理、居家照护、心理健康、母婴与宠物护理用 name.care，服务属性一秒传达，国际大牌还把 brand.care 用作客服售后入口；注册约 $12 与 .clinic 相当，续费约 $36/年明显更省。判断标准：业务有「门诊/场所」属性、用户是来「看诊」的 → .clinic 的机构感更准；业务是持续性「照护/关怀」、卖的是陪伴与服务 → .care 的温度更对，续费也更轻。两者常常都能用的模糊地带（心理咨询、宠物健康）就看你想强调场所还是关系。共同注意：医疗语境都涉及执业资质与广告合规，资质信息必须页面清晰呈现；两个词都不短（六与四个字母），主体名尽量短。",
      pickA: ["口腔眼科医美等专科诊所", "连锁门诊与多城市站点", "宠物诊所与理疗门诊", "诊断式咨询（X clinic）品牌"],
      pickB: ["养老护理与居家照护", "心理健康与母婴护理", "持续性关怀型服务", "品牌客户关怀入口"],
    },
    en: {
      title: ".clinic vs .care: The Place You Visit or the Way You're Treated",
      metaDescription:
        ".clinic names the place where patients walk in; .care names the warmth of ongoing service. Compare the two health suffixes on semantics, renewal cost and fit, then hunt names available on both.",
      verdict:
        "Both live in the health space; one says \"this is a clinic\", the other says \"we care about you\". .clinic is the place — dental, eye, skin, medspa, physio and veterinary practices on name.clinic read as exactly what they are, and chains can gather multi-city sites under one suffix; English also lends clinic a diagnostic-service sense, so SEO clinics and resume clinics wear it with instant authority; about $11 to register and $52/yr to renew. .care is the warmth — elder care, home care, mental health, maternal and pet care on name.care communicate the service in one word, and global brands even run brand.care as the customer-care door; registration (~$12) matches .clinic while renewal around $36/yr is clearly lighter. The test: the business has a walk-in, appointment-based venue → .clinic's institutional precision fits; the business is ongoing caregiving where the product is the relationship → .care's warmth is truer and cheaper to keep. In the overlap zone (counseling, pet health) pick by what you want to emphasize: the place or the relationship. Shared cautions: medical contexts demand licensing and advertising compliance shown clearly on the page; and with six and four letters respectively, keep the front word short.",
      pickA: ["Dental, eye & medspa practices", "Clinic chains & multi-city sites", "Veterinary & physio clinics", "Diagnostic-consulting (X clinic) brands"],
      pickB: ["Elder & home care services", "Mental-health & maternal care", "Ongoing caregiving businesses", "Brand customer-care portals"],
    },
  },
  "dental-vs-doctor": {
    slug: "dental-vs-doctor",
    a: "dental",
    b: "doctor",
    zh: {
      title: ".dental 和 .doctor 怎么选：垂直科室与执业身份的对比",
      metaDescription: ".dental 垂直到牙科一个科室，.doctor 覆盖所有医生的执业身份。对比两个医疗后缀的语义精度、续费成本与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "一个垂直到科室，一个覆盖整个职业。.dental 只说牙科——牙科诊所、正畸种植品牌、儿牙、口腔护理产品、技工所用 name.dental，零解释成本；牙科是本地获客竞争最激烈的医疗细分，店名几乎都是「名字/地名 + Dental」，对应 .com 早被扫光，同名 .dental 库存极好还省去重复打 dental；注册与续费均约 $62/年，平进平出没有首年甜头，但对牙科客单价毫无压力。.doctor 说的是「医生」这个身份——各科医生个人品牌、私人诊所、在线问诊用 name.doctor，专业权威从域名开始，「X 医生」的引申义还让 bike doctor、plant doctor 式维修养护生意自带亲切感；注册约 $8 门槛很低，但续费约 $93/年是高价档，典型「首年甜、续费贵」。判断标准：业务就是牙科 → .dental 的垂直精度无可替代，预算也更可控；主体是「医生个人」或跨科室的诊疗品牌 → .doctor 的身份感更广，但必须按续费核算。共同注意：都涉及执业资质与广告合规，种植正畸类宣传监管尤其严格，资质要页面清晰呈现；.doctor 在医疗场景更有暗示资质之嫌，非医疗的比喻用法反而没这个包袱。",
      pickA: ["牙科诊所与连锁", "正畸种植与儿牙品牌", "口腔护理产品", "牙科技工所与供应商"],
      pickB: ["医生个人品牌与私人诊所", "在线问诊与跨科室平台", "「X 医生」式维修养护生意", "把域名当门面资产的执业者"],
    },
    en: {
      title: ".dental vs .doctor: One Specialty Deep or the Whole Profession",
      metaDescription:
        ".dental goes all-in on one specialty; .doctor covers every physician's professional identity. Compare precision, renewal cost and fit, then hunt names available on both.",
      verdict:
        "One drills into a single specialty; the other spans the whole profession. .dental says dentistry and nothing else — practices, ortho and implant brands, pediatric dentistry, oral-care products and labs on name.dental carry zero explanation cost; dentistry is among the most competitive local-acquisition niches, practice names are overwhelmingly \"name/place + Dental\" with those .coms long gone, while the same name + .dental is wide open and even saves typing dental twice; about $62/yr flat for both registration and renewal — no teaser, but painless against dental ticket sizes. .doctor names the identity — physician personal brands, private practices and telemedicine on name.doctor start from authority, and the \"X doctor\" metaphor gives bike-doctor and plant-doctor repair businesses instant charm; registration around $8 is a low door, but renewal near $93/yr sits in the premium tier — classic sweet-year, pricey-renewal. The test: the business is dentistry → .dental's vertical precision is unmatched and the budget more predictable; the subject is a physician's personal brand or a cross-specialty practice → .doctor's identity signal reaches wider, but budget on the renewal. Shared cautions: both carry licensing and advertising compliance duties — implant and ortho claims are especially regulated, so show credentials clearly; and .doctor risks implying credentials in medical contexts, a burden the non-medical metaphor uses don't carry.",
      pickA: ["Dental practices & chains", "Ortho, implant & pediatric brands", "Oral-care product brands", "Dental labs & suppliers"],
      pickB: ["Physician personal brands & practices", "Telemedicine & cross-specialty platforms", "\"X doctor\" repair & maintenance businesses", "Practitioners treating the domain as a facade asset"],
    },
  },
  "fitness-vs-coach": {
    slug: "fitness-vs-coach",
    a: "fitness",
    b: "coach",
    zh: {
      title: ".fitness 和 .coach 怎么选：场馆项目与教练个人的对比",
      metaDescription: ".fitness 强调场馆与课程项目，.coach 强调带练的教练本人。对比两个健身类后缀的语义、续费成本与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "同在健身赛道，卖的东西不同。.fitness 卖「场馆与项目」——健身房、瑜伽普拉提馆、CrossFit 场馆、线上健身课程与健身 App 用 name.fitness，行业身份一目了然；健身生意的名字大多是气质词与人名，.com 几乎必然被占，同名 .fitness 库存极好；注册约 $6 很便宜、续费约 $33/年也温和，对月卡收入可以忽略。.coach 卖「人」——健身私教、跑步教练、人生教练、高管教练用 name.coach，获客靠个人信任，「人名/细分领域 + .coach」把身份写进域名比任何 slogan 都高效；注册约 $11，但续费约 $62/年接近 .fitness 的两倍，预算按续费核算。判断标准：开店、做课程产品、做 App → .fitness 的场馆感更配也更省；卖「你这个人」的一对一带练与陪伴 → .coach 的身份感更准。成长路径也常见：私教做大开馆后从 .coach 升级到 .fitness，两个后缀正好是业务的两个阶段。共同注意：健身获客重度依赖短视频与本地平台，域名的角色是品牌官网与课程预约的稳定入口；fitness 七个字母、coach 五个字母，主体名都要短促有力。",
      pickA: ["健身房与瑜伽普拉提馆", "CrossFit 与团课场馆", "线上健身课程与 App", "运动补剂与健康品牌"],
      pickB: ["健身私教与跑步教练", "人生教练与高管教练", "一对一与小班带练", "「人名 + .coach」的个人 IP"],
    },
    en: {
      title: ".fitness vs .coach: The Venue and Program or the Person Training You",
      metaDescription:
        ".fitness emphasizes the venue and the program; .coach emphasizes the person doing the training. Compare semantics, renewal cost and fit, then hunt names available on both.",
      verdict:
        "Both live in the fitness economy; they sell different things. .fitness sells the venue and the program — gyms, yoga and pilates spaces, CrossFit boxes, online programs and fitness apps on name.fitness are unmistakable; fitness businesses name themselves with mood words and personal names whose .coms vanished long ago, while the same name + .fitness is wide open; about $6 to register and $33/yr to renew — a rounding error against membership revenue. .coach sells the person — personal trainers, running coaches, life and executive coaches on name.coach acquire clients on personal trust, and writing the identity into the domain (your name or niche + .coach) beats any slogan; registration around $11, but renewal near $62/yr runs almost double .fitness — budget on the renewal. The test: opening a venue, building a program or an app → .fitness's institutional register fits and costs less to keep; selling you — one-on-one training, accountability, feedback → .coach's identity signal is sharper. The growth path is common: a solo trainer who opens a gym graduates from .coach to .fitness — two suffixes, two stages of the same business. Shared notes: fitness client acquisition leans on short video and local platforms, so the domain's job is the brand site and booking home; and at seven and five letters, keep the front word short and punchy.",
      pickA: ["Gyms, yoga & pilates spaces", "CrossFit & group-class venues", "Online programs & fitness apps", "Supplement & health brands"],
      pickB: ["Personal trainers & running coaches", "Life & executive coaches", "One-on-one & small-group training", "Your-name + .coach personal IP"],
    },
  },
  "photos-vs-gallery": {
    slug: "photos-vs-gallery",
    a: "photos",
    b: "gallery",
    zh: {
      title: ".photos 和 .gallery 怎么选：照片交付与策展陈列的对比",
      metaDescription: ".photos 直白说「这里是照片」，.gallery 暗示「这里在展出」。对比两个创意后缀的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "同是视觉创作者的后缀，说的是两个动作。.photos 说「照片在这里」——摄影师作品集、婚礼与人像工作室、活动跟拍、照片交付站点用 name.photos，复数名词天然带所有格感，「人名 + .photos」读作「某某的照片」最顺；它还有独特的实用玩法：按项目/客户开「照片交付页」，链接发出去客户秒懂；注册约 $8、续费约 $24/年是创意后缀里的温和档。.gallery 说「作品在展出」——实体画廊、策展人、把作品集当展览做的创作者、NFT 与数字艺术展厅用 name.gallery，「白墙射灯」的安静高级感从域名开始；注册与续费均约 $23/年，平进平出没有首年甜头，但绝对价格不高。判断标准：卖「拍摄与交付」的服务（婚礼、人像、活动）→ .photos 的直白与交付玩法更实用；有「策展/陈列」动作、想立艺术调性 → .gallery 的展览感更高级。摄影师两者都合适时看客群：接单生意用 .photos，办展卖作品用 .gallery。共同注意：视觉创作者获客主阵地在 Instagram 与小红书，域名是作品集与交付的稳定入口；photos 六个字母、gallery 七个字母，主体名尽量短，艺术家全名偏长时用姓氏或艺名。",
      pickA: ["摄影师作品集与接单", "婚礼与人像工作室", "活动跟拍与照片交付页", "图库与照片社区"],
      pickB: ["实体画廊与策展机构", "作品集即展览的创作者", "NFT 与数字艺术展厅", "设计作品与主题展"],
    },
    en: {
      title: ".photos vs .gallery: Delivering Pictures or Curating a Show",
      metaDescription:
        ".photos says pictures live here; .gallery says work is on exhibition. Compare the two creative suffixes on semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both serve visual creators; they describe two different acts. .photos says the pictures live here — portfolios, wedding and portrait studios, event shooters and client-delivery sites on name.photos read naturally possessive, \"someone's photos\", which is exactly the charm; it also enables a uniquely practical pattern: per-project or per-client delivery pages where the link explains itself the moment it's sent; about $8 to register and $24/yr to renew — the mild tier among creative suffixes. .gallery says the work is on show — physical galleries, curators, creators who treat the portfolio as an exhibition, and NFT or digital-art showrooms on name.gallery whisper quiet white-wall sophistication from the address; about $23/yr flat for both registration and renewal — no teaser, but the absolute price sits low. The test: selling shoot-and-deliver services (weddings, portraits, events) → .photos's literalness and delivery pattern are more practical; a curatorial act or an art-register positioning → .gallery reads more refined. When a photographer fits both, pick by audience: client work takes .photos, exhibiting and selling prints takes .gallery. Shared notes: visual creators win clients on Instagram and social platforms, so the domain is the stable portfolio and delivery home; and at six and seven letters, keep the front word short — long full names read better as a surname or artist name.",
      pickA: ["Photographer portfolios & client work", "Wedding & portrait studios", "Event shooting & delivery pages", "Stock libraries & photo communities"],
      pickB: ["Art galleries & curators", "Portfolio-as-exhibition creators", "NFT & digital-art showrooms", "Design showcases & themed shows"],
    },
  },
  "boutique-vs-shop": {
    slug: "boutique-vs-shop",
    a: "boutique",
    b: "shop",
    zh: {
      title: ".boutique 和 .shop 怎么选：策展精品与货架电商的对比",
      metaDescription: ".boutique 自带小而美的策展感，.shop 是最直白的电商货架。对比两个零售后缀的气质、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都是开店，气质两个方向。.boutique 是策展感——独立设计师品牌、买手店、古着首饰小店、手作工作室、精品民宿用 name.boutique，「小而美、卖审美与稀缺」的定位从域名立住，客单价越高越合适；法语血统自带「贵」的暗示，平价走量的店用它气质错位；注册约 $3 是最便宜档之一、续费约 $26/年也温和，试错成本几乎为零。.shop 是货架感——独立站、DTC 品牌商店、垂直品类电商用 name.shop，语义最直白，「品牌 + .shop」本身就是一句行动号召，全球注册量大、认知广；首年常有低价促销但续费明显更高，长期持有先看清续费价。判断标准：卖策展、审美与稀缺，客单价高 → .boutique 的精品感更准，续费还更省；卖转化、走量与直白的「来买」→ .shop 的行动号召更强。折中玩法也常见：品牌主站用 .shop 走量，高端线或买手系列用 .boutique 分线。共同注意：boutique 八个字母且 -que 结尾拼写有门槛，主体名务必短；高客单价场景两者都建议搭配 .com 做信任背书。",
      pickA: ["独立设计品牌与买手店", "古着首饰与手作工作室", "精品民宿与精品咨询", "高客单价的审美生意"],
      pickB: ["DTC 独立站与日常电商", "品牌官方商店子站", "垂直品类电商", "线下店铺线上入口"],
    },
    en: {
      title: ".boutique vs .shop: Curated Taste or Conversion Shelf",
      metaDescription:
        ".boutique carries small-and-beautiful curation; .shop is the most literal e-commerce shelf. Compare vibe, pricing and fit, then hunt names available on both.",
      verdict:
        "Both open a store; the registers point opposite ways. .boutique is curation — independent design labels, concept and curated stores, vintage and jewelry shops, artisan studios and boutique guesthouses on name.boutique establish \"curated, not mass\" from the address, and the higher the ticket size the better the fit; its French pedigree whispers expensive, so a discount volume store on .boutique feels mismatched; registration around $3 is among the cheapest tiers and renewal near $26/yr stays mild — practically zero cost to try. .shop is the shelf — DTC sites, official brand stores and category e-commerce on name.shop say exactly what they mean, \"brand + .shop\" reads like a call to action, and its global registration base gives it the widest recognition; first-year promos run cheap but renewals are clearly higher, so check renewal pricing before holding long-term. The test: selling taste, scarcity and high tickets → .boutique's register is truer and cheaper to keep; selling conversion, volume and a plain \"come buy\" → .shop's call-to-action is stronger. The hybrid play: run the main store on .shop and a premium or curated line on .boutique. Shared cautions: boutique is eight letters and the -que ending trips spellers, so keep the front word short; for high-ticket commerce, pair either with a .com for trust.",
      pickA: ["Indie design labels & concept stores", "Vintage, jewelry & artisan studios", "Boutique guesthouses & consultancies", "High-ticket taste-led businesses"],
      pickB: ["DTC and everyday e-commerce sites", "Official brand store sub-sites", "Category e-commerce", "Offline stores moving online"],
    },
  },
  "gallery-vs-art": {
    slug: "gallery-vs-art",
    a: "gallery",
    b: "art",
    zh: {
      title: ".gallery 和 .art 怎么选：展出动作与艺术身份的对比",
      metaDescription: ".gallery 说「这里在展出」，.art 说「这是艺术」。对比两个艺术后缀的语义角色、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "同为艺术圈的后缀，角色不同：.art 说「这是艺术」，.gallery 说「这里在展出」。.art 是身份——艺术家个人站与作品集、画廊美术馆、展览博览会、设计与创意机构用 name.art，「名字 + .art」本身就像一张名片，注册局长期面向艺术社区运营，圈内认可度在垂直后缀里属于较高一档；三个字母极短，价格中等、续费稳定，好名字库存充足。.gallery 是动作——有「陈列/策展」行为的主体更配：画廊主、策展人、把作品集当展览做的创作者、NFT 与数字艺术展厅，name.gallery 的「白墙射灯」气质从域名开始；注册与续费均约 $23/年，平进平出。判断标准：主体是「艺术家/机构」的身份主域名 → .art 更短更通用，当名片用最顺；主体是「一个展览空间」（实体或数字）→ .gallery 的场所感与策展暗示更准。两者也常配合：艺术家主站用 name.art，个展或系列展用 theme.gallery 分线。共同注意：gallery 七个字母，主体名尽量短，全名偏长用姓氏或艺名；卖作品的电商功能可搭配 .shop/.store 分工，交易合规要想清楚。",
      pickA: ["实体画廊与策展机构", "作品集即展览的创作者", "NFT 与数字艺术展厅", "主题展与系列展分线"],
      pickB: ["艺术家个人品牌主域名", "画廊美术馆与艺术机构官网", "展览与艺术项目页", "设计与创意工作者名片"],
    },
    en: {
      title: ".gallery vs .art: The Act of Exhibiting or the Identity of Art",
      metaDescription:
        ".gallery says work is being exhibited here; .art says this is art. Compare the two art-world suffixes on role, pricing and fit, then hunt names available on both.",
      verdict:
        "Both belong to the art world; the roles differ — .art says \"this is art\", .gallery says \"this is being exhibited\". .art is the identity: artist personal sites and portfolios, galleries and museums, fairs and creative agencies on name.art read like a business card, the registry has long cultivated the art community, and recognition inside the scene ranks high among vertical suffixes; at three letters it's extremely short, with moderate pricing, stable renewals and plenty of good names left. .gallery is the act: anyone with a curatorial gesture fits better — gallerists, curators, creators who treat the portfolio as a show, and NFT or digital-art showrooms — with name.gallery whispering quiet white-wall sophistication; about $23/yr flat for registration and renewal. The test: the subject is an artist's or institution's identity domain → .art is shorter and more universal, the natural business card; the subject is an exhibition space, physical or digital → .gallery's sense of place and curation is truer. They also pair well: run the artist's main site on name.art and solo or themed shows on theme.gallery. Shared notes: gallery is seven letters, so keep the front word short — long full names read better as a surname or artist name; and selling work is better split onto .shop/.store, with trading compliance thought through.",
      pickA: ["Art galleries & curators", "Portfolio-as-exhibition creators", "NFT & digital-art showrooms", "Solo & themed show lines"],
      pickB: ["Artist identity domains", "Gallery, museum & institution sites", "Exhibition & art project pages", "Creative professionals' business cards"],
    },
  },
  "salon-vs-studio": {
    slug: "salon-vs-studio",
    a: "salon",
    b: "studio",
    zh: {
      title: ".salon 和 .studio 怎么选：美业门店与创作团队的对比",
      metaDescription: ".salon 把美业门店写进域名，.studio 是创作团队的经典招牌。对比两个工作室后缀的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都叫「工作室」，说的是两种手艺。.salon 是美业的门店——美发、美甲、美容、化妆造型、美睫美肤、宠物美容用 name.salon，读出来就是「椅子、镜子、预约表」的到店场景；美业店名多是人名与风格词，.com 早被占光，同名 .salon 库存极好；Identity Digital 运营，注册约 $11、续费约 $46/年，对美业客单价与复购负担很轻；salon 还有「文艺沙龙」的雅义，读书会与播客沙龙用它也出彩。.studio 是创作团队的招牌——设计、影像、动画、游戏工作室用 name.studio，「小而专的创作团队」气质从域名立住；首年常有促销、续费约 $25–35/年更省，通用性也更广，不绑定行业。判断标准：业务是「进店做造型/护理」的美业服务 → .salon 的行业精度无可替代，访客一秒懂你卖什么；业务是「交付作品」的创意生产（拍摄、设计、剪辑）→ .studio 的通用创作感更准，还更便宜。模糊地带看重心：美发师转型做教学与内容，主站可以 .studio、门店线用 .salon 分线。共同注意：两个词都不短（五与六个字母），主体名务必短促；美业与创意获客都重社交平台，域名的角色是品牌官网与预约/作品集入口。",
      pickA: ["美发美甲与美容门店", "化妆造型与美睫美肤", "宠物美容工作室", "读书会与文艺沙龙"],
      pickB: ["设计与影像工作室", "动画与游戏团队", "摄影与内容制作方", "不绑定行业的创作品牌"],
    },
    en: {
      title: ".salon vs .studio: The Beauty Storefront or the Creative Workshop",
      metaDescription:
        ".salon writes the beauty trade into the address; .studio is the classic creative-team signboard. Compare semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both mean a workshop; they name two different crafts. .salon is the beauty storefront — hair, nails, skin care, makeup and styling, lashes and pet grooming on name.salon read instantly as chairs, mirrors and an appointment book; beauty shops name themselves with personal names and style words whose .coms vanished long ago, while the same name + .salon is wide open; run by Identity Digital at about $11 to register and $46/yr to renew — light against beauty ticket sizes and repeat visits; the word also keeps its artsy salon sense, so reading circles and podcast salons wear it elegantly. .studio is the creative signboard — design, film, animation and game teams on name.studio establish the small-and-focused maker register from the address; frequent first-year promos with renewals around $25–35/yr make it cheaper, and it binds to no single industry. The test: a come-in-for-a-treatment beauty business → .salon's precision is unmatched, visitors know what you sell in a second; a deliver-the-work creative practice (shoots, design, editing) → .studio's general maker register fits and costs less. In the overlap — a stylist pivoting to teaching and content — run the main site on .studio and the shop line on .salon. Shared notes: at five and six letters keep the front word short; both trades win clients on social platforms, so the domain is the brand site and the booking or portfolio front door.",
      pickA: ["Hair, nail & beauty shops", "Makeup, styling & lash artists", "Pet grooming studios", "Reading circles & creative salons"],
      pickB: ["Design & film studios", "Animation & game teams", "Photo & content production", "Industry-agnostic maker brands"],
    },
  },
  "yoga-vs-fitness": {
    slug: "yoga-vs-fitness",
    a: "yoga",
    b: "fitness",
    zh: {
      title: ".yoga 和 .fitness 怎么选：垂直流派与全场馆的对比",
      metaDescription: ".yoga 垂直到瑜伽一个流派，.fitness 覆盖整个健身行业。对比两个运动后缀的语义精度、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "同在运动赛道，一个说流派、一个说行业。.yoga 垂直到不能再垂直——瑜伽馆、瑜伽老师个人品牌、教培认证、线上课程、冥想与正念应用用 name.yoga，受众一眼知道你做什么；气质是呼吸、拉伸与平静，普拉提与身心疗愈品牌借它也顺；GoDaddy Registry 运营，注册续费同价约 $26/年，平进平出没有涨价陷阱；yoga 还是全球通用词，出海教培零翻译成本。.fitness 覆盖整个行业——健身房、CrossFit 场馆、团课、线上健身课程与 App 用 name.fitness，力量感与场馆感直给；注册约 $6 更便宜、续费约 $33/年也温和。判断标准：业务就是瑜伽（或借瑜伽气质的身心项目）→ .yoga 的垂直精度无可替代，四个字母还更短；业务是综合健身、器械力量、或未来会扩品类 → .fitness 的行业宽度更稳，改卖操课加私教都不用换域名。要小心的反向错位：纯瑜伽馆用 .fitness 会稀释「平静专注」的调性，综合健身房用 .yoga 则直接误导。共同注意：运动获客重社交与口碑，域名是品牌官网、课表与预约入口；行业热词（flow、om、fit 类）在两个后缀下都被大量注册，先查再爱。",
      pickA: ["瑜伽馆与工作室", "瑜伽老师个人品牌与教培", "线上课程与冥想应用", "普拉提与身心疗愈品牌"],
      pickB: ["综合健身房与团课场馆", "CrossFit 与力量训练", "线上健身课程与 App", "会扩品类的运动品牌"],
    },
    en: {
      title: ".yoga vs .fitness: One Practice Deep or the Whole Gym Floor",
      metaDescription:
        ".yoga goes all-in on one practice; .fitness covers the whole industry. Compare precision, pricing and fit, then hunt names available on both.",
      verdict:
        "Both live in the movement economy; one names a practice, the other an industry. .yoga is as vertical as it gets — studios, teacher personal brands, trainings, online courses, meditation and mindfulness apps on name.yoga tell the audience exactly what you do; the register is breath, stretch and calm, and pilates and mind-body brands borrow it naturally; run by GoDaddy Registry at a flat ~$26/yr for registration and renewal — no teaser, no trap; and yoga is a global word with zero translation cost for international teacher-training brands. .fitness spans the floor — gyms, CrossFit boxes, group classes, online programs and apps on name.fitness flex venue and strength; about $6 to register and a mild $33/yr to renew. The test: the business is yoga (or a mind-body practice borrowing its calm) → .yoga's vertical precision is unmatched, and at four letters it's shorter too; the business is general fitness, strength training, or plans to widen the offering → .fitness's industry breadth is safer — add classes or personal training without changing domains. Watch the mismatch in both directions: a pure yoga studio on .fitness dilutes the calm; a full gym on .yoga misleads outright. Shared notes: the industry wins students on social and word of mouth, so the domain is the brand site, schedule and booking home; and hot words (flow, om, fit) are heavily registered on both — check before you fall in love.",
      pickA: ["Yoga studios", "Teacher brands & trainings", "Online courses & meditation apps", "Pilates & mind-body brands"],
      pickB: ["Full gyms & group-class venues", "CrossFit & strength training", "Online programs & fitness apps", "Brands planning to widen the offering"],
    },
  },
  "coffee-vs-cafe": {
    slug: "coffee-vs-cafe",
    a: "coffee",
    b: "cafe",
    zh: {
      title: ".coffee 和 .cafe 怎么选：咖啡这件事与那家店的对比",
      metaDescription: ".coffee 指「咖啡本身」，.cafe 指「那家店」。对比两个咖啡后缀的语义分工、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "同一杯咖啡，两个视角。.coffee 说「这件事」——烘焙工作室、咖啡豆与器具电商、咖啡订阅、测评与内容社区用 name.coffee，卖的是咖啡本身而不是某家店；「let's grab coffee」还是英语社交邀约的通用语，约聊工具借这层意思很妙；Identity Digital 运营，注册约 $11、续费约 $35/年，行业后缀温和档。.cafe 说「那家店」——独立咖啡店、烘焙店、猫咖书咖用 name.cafe，域名和店招完全同构，菜单预约外卖链接印上去毫无违和；「cafe」在互联网语境里还是「轻松聚集地」的代名词，读书会与开发者社区拿它做线上客厅比 .com 更有温度；注册约 $5 更便宜、续费约 $42/年略高。判断标准最简单：卖豆子、做订阅、做内容 → .coffee 指物更准；开门迎客的空间（线下店或线上社区）→ .cafe 指地更亲。两条业务线都有的品牌分线也顺：门店用 name.cafe，电商与豆子用 name.coffee，一个品牌两个入口互不打架。共同注意：coffee 双写字母（ff、ee）口播要多提醒，cafe 四个字母几乎零拼写成本；本地门店获客靠地图与社交平台，域名做品牌官网与线上商城/预约入口。",
      pickA: ["烘焙工作室与咖啡豆电商", "咖啡订阅与器具商店", "咖啡测评与内容社区", "约聊与社交产品（grab coffee 梗）"],
      pickB: ["独立咖啡馆与烘焙店", "猫咖书咖等主题空间", "线上社区与读书会", "本地生活方式品牌"],
    },
    en: {
      title: ".coffee vs .cafe: The Thing Itself or the Place You Sit",
      metaDescription:
        ".coffee names the thing; .cafe names the place. Compare the two coffee suffixes on semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Same cup, two viewpoints. .coffee names the thing — roasteries, bean and gear e-commerce, subscriptions, review sites and content communities on name.coffee sell coffee itself rather than any one shop; English keeps \"let's grab coffee\" as the universal social invite, a layer chat products borrow cleverly; run by Identity Digital at about $11 to register and $35/yr to renew, the mild tier among industry suffixes. .cafe names the place — independent coffee shops, bakeries, cat and book cafés on name.cafe match the shop sign exactly, with menu, booking and delivery links printing naturally; \"cafe\" also doubles online as the cozy gathering spot, so reading circles and developer communities run warmer on name.cafe than on .com; about $5 to register, with renewal near $42/yr a notch higher. The test could not be simpler: selling beans, subscriptions or content → .coffee points at the thing; a space that welcomes people (a physical shop or an online living room) → .cafe points at the place. Brands running both lines split cleanly: the shop on name.cafe, the beans and e-commerce on name.coffee — one brand, two doors, no conflict. Shared notes: coffee doubles two letters (ff, ee) so spell it out when spoken, while cafe's four letters cost nothing; and local shops win customers on maps and social, so the domain is the brand site and the store or booking front door.",
      pickA: ["Roasteries & bean e-commerce", "Subscriptions & gear stores", "Reviews & content communities", "Social products (the grab-coffee pun)"],
      pickB: ["Indie cafés & bakeries", "Cat & book café spaces", "Online communities & reading circles", "Local lifestyle brands"],
    },
  },
  "wine-vs-bar": {
    slug: "wine-vs-bar",
    a: "wine",
    b: "bar",
    zh: {
      title: ".wine 和 .bar 怎么选：产业链与夜场门店的对比",
      metaDescription: ".wine 覆盖葡萄酒整条产业链，.bar 是夜生活门店的霓虹招牌。对比两个酒类后缀的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都跟酒有关，一个说产业、一个说门店。.wine 覆盖整条产业链——酒庄官网、葡萄酒电商与订阅、进口商、侍酒师个人品牌、酒评与品鉴内容用 name.wine，风土从域名开始，种植酿造贸易内容体验全都装得下；Identity Digital 运营，注册约 $6 便宜、续费约 $48/年是首年数倍，预算按续费核算。.bar 是门店的霓虹——鸡尾酒吧、清吧、livehouse、夜生活品牌用 name.bar，三个字母印上海报和霓虹灯就是完整店名；Team Internet 系运营，首年常见约 $3 引流价、续费约 $52/年，保留与溢价词较多，下单前看实时报价。判断标准：业务围绕「酒这个产品」——卖酒、评酒、酿酒、教人喝酒 → .wine 的产业语义更准；业务是「喝酒这个场所」——坐下来社交的夜场 → .bar 的门店感与短促更帅。葡萄酒吧（wine bar）正好卡在中间：以卖酒零售与品鉴课为主用 .wine，以夜场社交为主用 .bar，或者干脆 name.wine 做电商、name.bar 做门店分线。共同注意：酒类电商与广告在多数市场有牌照与年龄门槛，合规是第一课；欧洲产区名（champagne 类）受地理标志保护，起名避开；两个后缀续费都不便宜，都按续费价核算长期成本。",
      pickA: ["酒庄与葡萄园官网", "葡萄酒电商与订阅", "进口商与侍酒师品牌", "酒评与品鉴内容"],
      pickB: ["鸡尾酒吧与清吧", "livehouse 与夜生活品牌", "霓虹灯招牌式短域名", "开发者工具站（bar 双关）"],
    },
    en: {
      title: ".wine vs .bar: The Whole Chain or the Neon Doorway",
      metaDescription:
        ".wine spans the whole wine trade; .bar is the neon sign over a nightlife venue. Compare semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both pour a drink; one names an industry, the other a doorway. .wine spans the whole chain — winery sites, wine e-commerce and subscriptions, importers, sommelier personal brands, review and tasting content on name.wine carry terroir from the address, with room for growing, making, trading, writing and tasting alike; run by Identity Digital at a cheap ~$6 first year but ~$48/yr renewal, several times the teaser — budget on the renewal. .bar is the neon — cocktail bars, lounges, livehouses and nightlife brands wear name.bar as the complete shop sign in three letters on posters and signage; run by the Team Internet family with a frequent ~$3 first year and ~$52/yr renewal, plus a large premium-reserve list — confirm live registrar pricing before ordering. The test: the business orbits the product — selling, reviewing, making or teaching wine → .wine's industry semantics are sharper; the business is the venue — a sit-down, social drinking spot → .bar's doorway register and punch win. The wine bar sits exactly in between: retail and tastings lean .wine, nightlife leans .bar, or split cleanly with name.wine for e-commerce and name.bar for the venue. Shared cautions: alcohol e-commerce and advertising carry licensing and age-gate duties in most markets — compliance first; European appellations (champagne and kin) are GI-protected, steer clear; and neither renewal is cheap, so price the long hold on renewal rates.",
      pickA: ["Wineries & vineyards", "Wine e-commerce & subscriptions", "Importers & sommelier brands", "Wine reviews & tasting content"],
      pickB: ["Cocktail bars & lounges", "Livehouses & nightlife brands", "Neon-sign-ready short domains", "Developer tool sites (the bar pun)"],
    },
  },
  "kitchen-vs-restaurant": {
    slug: "kitchen-vs-restaurant",
    a: "kitchen",
    b: "restaurant",
    zh: {
      title: ".kitchen 和 .restaurant 怎么选：做菜的地方与堂食的店的对比",
      metaDescription: ".kitchen 是「做菜的地方」，.restaurant 是「堂食的店」。对比两个餐饮后缀的场景分工、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都在餐饮赛道，分工看场景。.kitchen 是「做菜的地方」——私厨与定制餐饮、不设堂食的云厨房与外卖品牌、烹饪课程与美食工作室、食谱与美食内容用 name.kitchen，烟火气直给；「test kitchen」还是美食媒体的经典栏目名，内容品牌借它很顺；Identity Digital 运营，注册约 $8、续费约 $52/年是首年数倍，预算按续费核算。.restaurant 是「堂食的店」——全服务餐厅、连锁品牌、餐饮集团、预订平台用 name.restaurant，正餐身份一目了然，「店名 + .restaurant」库存极好，多品牌集团归拢旗下官网也优雅；注册约 $13、续费约 $52/年，价格结构平稳。判断标准就一句话：客人来店里坐下吃 → .restaurant 的正式感与语义精度更配；客人不进店（外卖、上门私厨、看内容学做菜）→ .kitchen 的场景更准还更亲。长度都是硬约束：kitchen 七个字母、restaurant 十个字母，主体名务必短促。成长路径也常见：云厨房做出堂食店后，从 .kitchen 升级 .restaurant 或两线并行。共同注意：餐饮获客靠外卖平台、地图与社交内容，域名的角色是品牌官网、菜单与订座入口；两个续费价相同，按业态选就好，不用纠结价格。",
      pickA: ["私厨与云厨房品牌", "烹饪课程与美食工作室", "食谱与美食内容", "厨房用品与橱柜定制"],
      pickB: ["全服务餐厅与连锁品牌", "餐饮集团多品牌官网", "菜系与主题正餐厅", "预订与点评平台"],
    },
    en: {
      title: ".kitchen vs .restaurant: Where You Cook or Where They Dine",
      metaDescription:
        ".kitchen is the place you cook; .restaurant is the place they dine. Compare the two food suffixes on scene, pricing and fit, then hunt names available on both.",
      verdict:
        "Both feed people; the split is the scene. .kitchen is where you cook — private chefs and catering, delivery-only cloud kitchens, cooking classes and food studios, recipe and food content on name.kitchen feel warm from the address; \"test kitchen\" remains a classic food-media franchise that content brands borrow naturally; run by Identity Digital at about $8 to register but ~$52/yr to renew, several times the first year — budget on the renewal. .restaurant is where they dine — full-service restaurants, chains, hospitality groups and booking platforms on name.restaurant are unmistakably in the dining business, name + .restaurant inventory stays wide open, and multi-brand groups gather their sites elegantly under one suffix; about $13 to register and $52/yr to renew, with a flat price structure. The test fits in one line: guests sit down at your tables → .restaurant's formality and precision fit; guests never enter (delivery, private-chef visits, learning to cook from your content) → .kitchen's scene is truer and warmer. Length binds both: kitchen is seven letters and restaurant ten, so keep the front word short and punchy. The growth path is common too: a cloud kitchen that opens a dining room graduates to .restaurant or runs both lines. Shared notes: food businesses win customers on delivery platforms, maps and social content — the domain is the brand site, menu and reservations home; and with identical renewals, choose by format, not price.",
      pickA: ["Private chefs & cloud kitchens", "Cooking classes & food studios", "Recipe & food content", "Kitchenware & cabinetry brands"],
      pickB: ["Full-service restaurants & chains", "Hospitality group brand sites", "Cuisine & theme dining", "Booking & review platforms"],
    },
  },
  "garden-vs-farm": {
    slug: "garden-vs-farm",
    a: "garden",
    b: "farm",
    zh: {
      title: ".garden 和 .farm 怎么选：花园意象与农场直供的对比",
      metaDescription: ".garden 卖「花园」的绿意与意象，.farm 卖「农场直供」的信任。对比两个绿色后缀的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都长在土里，卖的东西不同。.garden 卖意象——园艺电商与苗圃、景观设计与庭院施工、植物养护内容、花店与植物生活方式品牌用 name.garden，绿意从域名开始；它还有数字世界的妙用：「digital garden」是知识管理圈的流行隐喻，个人知识库与博客用 name.garden 自带圈内身份；GoDaddy Registry 运营，注册约 $2 是最便宜档之一、续费约 $26/年也温和，试错成本几乎为零。.farm 卖信任——家庭农场与农产品直销、有机食品品牌、农家乐与休闲农业、农业科技用 name.farm，「从农场到餐桌」的故事从域名讲起，比 .com 更强化产地直供；技术圈还拿它玩 render farm、server farm 的梗；Identity Digital 运营，注册约 $8、续费约 $31/年。判断标准：卖「美与生活方式」——观赏植物、庭院设计、花艺、知识花园 → .garden 的意象更准还更便宜；卖「吃与产地」——食材直销、有机品牌、农业生产 → .farm 的直供信任感无可替代。城市农场与市民菜园卡在中间：以观赏休闲为主用 .garden，以产出食材为主用 .farm。共同注意：两个词都是六字母上下，主体名短一点读起来才像门牌；园艺农产都是季节性生意，内容与电商结合比纯货架更有粘性。",
      pickA: ["园艺电商与苗圃", "景观设计与庭院施工", "植物内容与花店品牌", "数字花园与个人知识库"],
      pickB: ["家庭农场与农产品直销", "有机食品与产地品牌", "农家乐与休闲农业", "农业科技与算力农场（farm 梗）"],
    },
    en: {
      title: ".garden vs .farm: Green Imagery or Farm-to-Table Trust",
      metaDescription:
        ".garden sells greenery and imagery; .farm sells farm-to-table trust. Compare the two green suffixes on semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both grow from the soil; they sell different things. .garden sells the imagery — garden e-commerce and nurseries, landscaping and yard design, plant-care content, florists and plant lifestyle brands on name.garden feel green from the address; it also has a lovely digital-world use: the \"digital garden\" is a beloved metaphor in the personal-knowledge-management scene, so a wiki or blog on name.garden carries instant identity there; run by GoDaddy Registry at about $2 to register — among the cheapest tiers — and a mild $26/yr to renew, practically zero cost to try. .farm sells the trust — family farms and direct-to-consumer produce, organic food brands, agritourism and agtech on name.farm start the farm-to-table story at the domain, reinforcing origin better than any .com; the tech crowd even puns on render farms and server farms; run by Identity Digital at about $8 to register and $31/yr to renew. The test: selling beauty and lifestyle — ornamental plants, yard design, floristry, knowledge gardens → .garden's imagery is truer and cheaper; selling food and origin — produce, organic brands, agricultural production → .farm's direct-supply trust is unmatched. Urban farms and community plots sit in between: leisure-led picks .garden, harvest-led picks .farm. Shared notes: both words run about six letters, so a short front word reads like a gate sign; and both trades are seasonal — content plus commerce beats bare shelves for retention.",
      pickA: ["Garden e-commerce & nurseries", "Landscaping & yard design", "Plant content & florist brands", "Digital gardens & personal wikis"],
      pickB: ["Family farms & direct-to-consumer produce", "Organic & origin food brands", "Agritourism & leisure farming", "Agtech & compute farms (the farm pun)"],
    },
  },
  "photography-vs-photos": {
    slug: "photography-vs-photos",
    a: "photography",
    b: "photos",
    zh: {
      title: ".photography 和 .photos 怎么选：手艺身份与照片本身的对比",
      metaDescription: ".photography 卖「摄影这门手艺」的专业身份，.photos 卖「照片本身」的轻快直白。对比两个摄影后缀的语义、长度与价格差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "同一个行业的两副面孔。.photography 卖手艺——摄影师个人作品集、婚礼与人像工作室、商业与产品摄影用 name.photography，全拼写出「摄影是我的职业」，名片与作品集水印上最见功力；Identity Digital 运营，注册约 $6、续费约 $29/年，行业后缀温和档；代价是十一个字母的长度，主体名必须短，口播成本也高。.photos 卖照片——图库与相册站、活动照片交付、照片打印与周边、图片分享社区用 name.photos，六个字母轻快直白，「这里有照片看」的意思秒懂；注册约 $8、续费约 $24/年，比 .photography 还便宜一点。判断标准：卖「服务与专业身份」——接单拍摄、档期预约、个人品牌 → .photography 的正式感更准；卖「照片这个东西」——看图、存图、买图、晒图 → .photos 更短更顺口。不少摄影师两个都用：name.photography 做作品集官网，客片交付走 gallery.photos 式的短域名。共同注意：摄影获客重平台与口碑，域名的角色是作品集与预约入口；两个后缀认知度都不如 .com，首屏视觉要立刻像个摄影站。",
      pickA: ["摄影师个人作品集与预约", "婚礼与人像工作室", "商业与产品摄影服务", "摄影课程与手艺内容"],
      pickB: ["图库与在线相册", "客片交付与照片分享", "照片打印与周边电商", "图片社区与照片墙"],
    },
    en: {
      title: ".photography vs .photos: The Craft or The Pictures",
      metaDescription:
        ".photography sells the craft and professional identity; .photos sells the pictures themselves. Compare the two photo suffixes on semantics, length and pricing, then hunt names available on both.",
      verdict:
        "Two faces of the same trade. .photography sells the craft — photographer portfolios, wedding and portrait studios, commercial and product shooters on name.photography spell out \"photography is my profession\" in full, strongest on business cards and portfolio watermarks; run by Identity Digital at about $6 to register and $29/yr to renew, the mild tier among industry suffixes; the cost is length — eleven letters means the front word must stay short, and spoken-out-loud friction is real. .photos sells the pictures — galleries and album sites, client-photo delivery, print and merch shops, photo-sharing communities on name.photos read instantly as \"pictures live here\" in a brisk six letters; about $8 to register and $24/yr to renew, slightly cheaper than .photography. The test: selling service and professional identity — bookings, availability, personal brand → .photography's formality is truer; selling the photos as the thing — viewing, storing, buying, sharing → .photos is shorter and smoother. Many photographers run both: the portfolio on name.photography, client delivery on a short gallery-style .photos. Shared notes: photographers win clients on platforms and word of mouth, so the domain is the portfolio and booking front door; and neither suffix carries .com-level recognition, so the first screen must look like a photo site immediately.",
      pickA: ["Photographer portfolios & bookings", "Wedding & portrait studios", "Commercial & product shooting", "Photo courses & craft content"],
      pickB: ["Stock galleries & online albums", "Client-photo delivery & sharing", "Print & photo merch shops", "Photo communities & walls"],
    },
  },
  "events-vs-live": {
    slug: "events-vs-live",
    a: "events",
    b: "live",
    zh: {
      title: ".events 和 .live 怎么选：活动日历与正在直播的对比",
      metaDescription: ".events 卖「活动排期」的日历感，.live 卖「正在进行」的即时感。对比两个现场后缀的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都指向「现场」，时态不同。.events 是日历——活动策划与执行公司、会展与峰会主办方、演出售票与城市活动指南、婚礼派对策划用 name.events，天然复数读出来就是「这里有很多场活动」，做系列活动与年度大会尤其顺；Identity Digital 运营，注册约 $10、续费约 $37/年，活动行业客单价下无压力。.live 是进行时——直播主播与直播平台、线上演出与电竞赛事、24 小时电台式内容用 name.live，「正在播」的即时感从域名开始；首年促销常见几块钱、续费约 $25/年，价格更轻，但语义强绑定「实时」，做录播与图文内容会名不副实。判断标准：卖「排期与组织」——观众看日历、买票、报名 → .events 的日历感更准；卖「此刻与陪伴」——观众点开就看、追直播间 → .live 的即时感无可替代。线上活动平台卡在中间：以议程与报名为主用 .events，以直播观看为主用 .live。共同注意：两个行业获客都重社交裂变与平台分发，域名的角色是品牌官网与入口；活动与直播都有强时效性，主体名选能长期复用的品牌词，别把日期或单场活动名写进域名。",
      pickA: ["活动策划与会展公司", "峰会与系列活动品牌", "演出售票与活动日历", "婚礼派对与社群聚会"],
      pickB: ["直播主播与直播平台", "线上演出与电竞赛事", "实时数据与直播工具", "24 小时电台式内容"],
    },
    en: {
      title: ".events vs .live: The Calendar or The Broadcast",
      metaDescription:
        ".events sells the calendar of what's coming; .live sells the thrill of what's happening now. Compare the two showtime suffixes on semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both point at the stage; the tense differs. .events is the calendar — event planners and production companies, conference and summit hosts, ticketing and city event guides, wedding and party planners on name.events read as \"many happenings live here\" thanks to the natural plural, perfect for series and annual gatherings; run by Identity Digital at about $10 to register and $37/yr to renew, painless against event-industry ticket sizes. .live is the present tense — streamers and live platforms, online concerts and esports broadcasts, always-on radio-style content on name.live start the \"we're on air\" feeling at the address; promo first years often run a few dollars with renewal near $25/yr, lighter on price, but the semantics bind hard to real-time — recorded or text content on .live rings false. The test: selling schedule and organization — audiences browse a calendar, buy tickets, register → .events is truer; selling right-now and presence — audiences click in and watch → .live's immediacy is unmatched. Online event platforms sit in between: agenda-and-registration-led picks .events, watch-the-stream-led picks .live. Shared notes: both trades win audiences through social virality and platform distribution, so the domain is the brand home and entry point; and both are time-sensitive businesses — pick a reusable brand word, never a date or a single show's name.",
      pickA: ["Event planners & production firms", "Conference & summit brands", "Ticketing & event calendars", "Weddings, parties & meetups"],
      pickB: ["Streamers & live platforms", "Online concerts & esports", "Real-time data & live tooling", "Always-on radio-style content"],
    },
  },
  "solutions-vs-services": {
    slug: "solutions-vs-services",
    a: "solutions",
    b: "services",
    zh: {
      title: ".solutions 和 .services 怎么选：解决问题与提供服务的对比",
      metaDescription: ".solutions 说「我帮你解决问题」，.services 说「我提供这些服务」。对比两个商务后缀的语气、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "一对近义词，语气差一档。.solutions 是顾问腔——IT 服务与系统集成、定制软件、咨询公司与行业方案商用 name.solutions，在 RFP 与投标文件里就是行业黑话本话，说的是「你有问题，我有方案」；Identity Digital 运营，注册约 $4 是便宜档、续费约 $25/年也温和，B2B 客单价下几乎隐形。.services 是清单腔——会计法务人力等专业服务、家政维修安装、企业外包与本地服务商用 name.services，说的是「我提供这些服务，明码标价」，蓝领与本地生意用它反而更实在可信；注册约 $9、续费约 $31/年。判断标准：客户买的是「结果与方案」——项目制、定制化、按方案报价 → .solutions 的顾问感更配；客户买的是「服务本身」——按次按月、标准化、看菜单下单 → .services 的直白更可信。两个都要避免空洞：主体名务必具体（行业词、技术词、动词），「泛词 + solutions/services」是企业官网最容易显得空洞的写法。共同注意：两个都是复数商务词、2C 品牌慎用；企业采购周期长，域名的角色是稳定专业的官网与企业邮箱，别指望域名本身带来流量。",
      pickA: ["IT 服务与系统集成", "定制软件与开发外包", "咨询公司与行业方案商", "B2B 技术品牌"],
      pickB: ["会计法务等专业服务", "家政维修与安装服务", "企业外包与托管运维", "本地生活服务商"],
    },
    en: {
      title: ".solutions vs .services: We Fix Problems or We Offer Services",
      metaDescription:
        ".solutions says \"we fix your problem\"; .services says \"here's what we offer\". Compare the two business suffixes on tone, pricing and fit, then hunt names available on both.",
      verdict:
        "Near-synonyms, one register apart. .solutions is consultant-speak — IT services and systems integrators, custom software shops, consultancies and industry vendors on name.solutions talk the native language of RFPs and tenders: \"you have a problem, we have the answer\"; run by Identity Digital at about $4 to register — the cheap tier — and a mild $25/yr to renew, invisible against B2B deal sizes. .services is menu-speak — accounting, legal and HR firms, cleaning, repair and installation trades, outsourcing and local providers on name.services say \"here is what we offer, priced and listed\", which reads more credible for trades and local businesses precisely because it is humbler; about $9 to register and $31/yr to renew. The test: clients buy outcomes and proposals — project-based, customized, quoted per solution → .solutions' consulting tone fits; clients buy the service itself — per-visit or monthly, standardized, ordered off a menu → .services' plainness earns more trust. Both punish vagueness: make the front word concrete (an industry, technology or trade word) — vague word + solutions/services is the fastest way to sound hollow. Shared notes: both are plural business words, wrong register for consumer brands; and enterprise buying cycles are long, so the domain's job is a stable, professional site and email — don't expect the suffix itself to bring traffic.",
      pickA: ["IT services & systems integrators", "Custom software & dev shops", "Consultancies & industry vendors", "B2B technology brands"],
      pickB: ["Accounting, legal & HR firms", "Cleaning, repair & installation", "Outsourcing & managed ops", "Local service providers"],
    },
  },
  "consulting-vs-expert": {
    slug: "consulting-vs-expert",
    a: "consulting",
    b: "expert",
    zh: {
      title: ".consulting 和 .expert 怎么选：职业身份与专业断言的对比",
      metaDescription: ".consulting 说「我以此为业」，.expert 说「我很懂这个」。对比两个专家后缀的语气、价格与续费差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都在卖专业，宣称方式不同。.consulting 是职业陈述——独立顾问、精品咨询公司、战略/IT/营销咨询用 name.consulting，「姓氏 + .consulting」是麦肯锡式传统写法，企业采购语境里正式可信，name@name.consulting 的邮箱签名本身就是广告；Identity Digital 运营，注册约 $21、续费约 $44/年，对咨询客单价九牛一毛；代价是十个字母偏长，主体名用姓氏或领域词。.expert 是能力断言——细分领域专家、技术顾问、评测与攻略内容、付费问答用 name.expert，六个字母更短更响，「领域词 + .expert」读出来就是定位宣言；注意价格结构：注册约 $7 很低，但续费约 $50/年比 .consulting 还贵——典型的首年引流定价，按续费核算预算。判断标准：卖「咨询这门生意」——按项目签约、出报告、进采购流程 → .consulting 的职业感更配；卖「我这个人的判断」——个人 IP、内容变现、付费咨询 → .expert 的断言更响亮。还有一层语气差：expert 是自封的形容词，配合真实履历与案例才立得住，否则容易显得王婆卖瓜；consulting 是中性的行业词，没有这个风险。共同注意：两个行业获客都靠人脉与内容，域名的角色是专业官网与信任背书，首屏放案例与资质比放口号有用。",
      pickA: ["独立顾问与精品咨询公司", "战略/IT/营销咨询", "企业采购与投标场景", "顾问企业邮箱与官网"],
      pickB: ["细分领域个人专家 IP", "评测攻略与专业内容", "付费问答与专家咨询", "想要更短更响的域名"],
    },
    en: {
      title: ".consulting vs .expert: The Profession or The Claim",
      metaDescription:
        ".consulting states a profession; .expert asserts mastery. Compare the two expertise suffixes on tone, pricing and renewal traps, then hunt names available on both.",
      verdict:
        "Both sell expertise; they claim it differently. .consulting states a profession — independent consultants, boutique firms, strategy, IT and marketing advisories on name.consulting follow the McKinsey tradition of surname + .consulting, read formal and credible in enterprise procurement, and a name@name.consulting email signature is an ad in itself; run by Identity Digital at about $21 to register and $44/yr to renew, a rounding error against consulting fees; the cost is ten letters — keep the front word to a surname or field word. .expert asserts mastery — niche specialists, technical advisors, review and how-to content, paid Q&A on name.expert get a shorter, punchier six letters where field word + .expert reads as a positioning statement; watch the pricing though: about $7 to register but ~$50/yr to renew — more than .consulting — classic first-year-bait pricing, so budget on the renewal. The test: selling consulting as a business — project contracts, reports, procurement processes → .consulting's professional register fits; selling your personal judgment — personal brand, content monetization, paid advice → .expert's claim rings louder. One more tonal note: \"expert\" is a self-awarded adjective that only stands up with real credentials and case studies behind it, while \"consulting\" is neutral trade vocabulary with no such risk. Shared notes: both trades win work through networks and content, so the domain is the professional site and trust anchor — lead the first screen with cases and credentials, not slogans.",
      pickA: ["Independent consultants & boutiques", "Strategy, IT & marketing advisory", "Enterprise procurement contexts", "Professional email & firm sites"],
      pickB: ["Niche personal expert brands", "Reviews & how-to content", "Paid Q&A & advice products", "Shorter, punchier domain"],
    },
  },
  "software-vs-app": {
    slug: "software-vs-app",
    a: "software",
    b: "app",
    zh: {
      title: ".software 和 .app 怎么选：正经软件与轻快应用的对比",
      metaDescription: ".software 卖「正经软件产品与公司」的正式感，.app 卖「装了就用」的轻快。对比两个软件后缀的气质、HTTPS 要求与价格，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都卖软件，体感不同。.software 是西装——软件公司官网、桌面与企业应用、行业系统、软件外包团队用 name.software，访客不用猜你卖什么，「行业 + .software」还能精准命中企业采购搜索；Identity Digital 运营，注册约 $16、续费约 $33/年；代价是八个字母偏长，主体名务必短。.app 是 T 恤——移动应用、小工具、独立开发者产品用 name.app，Google 运营的这个后缀自带开发者圈认知，三个字母短促轻快，「下载我」的意思从域名开始；注册约 $14、续费约 $16/年，续费比 .software 便宜一半，且强制 HTTPS 预载（浏览器拒绝非加密访问），安全基线直接拉满。判断标准：卖给企业、按席位或授权收费、有采购流程 → .software 的正式感更配；卖给个人、应用商店分发、点开就用 → .app 的轻快更准。桌面工具卡在中间：面向开发者与极客用 .app 也顺（很多 Mac 独立应用就是 name.app），面向企业 IT 用 .software 更稳。共同注意：.app 的 HTTPS 强制意味着必须配好证书才能上线，别拿它做纯跳转域名；两个后缀在应用商店与搜索里都不加分，域名的角色是官网、文档与下载入口。",
      pickA: ["软件公司与产品官网", "桌面与企业级应用", "行业系统与采购场景", "软件外包与定制团队"],
      pickB: ["移动应用与小工具", "独立开发者产品", "应用商店分发的产品", "想要更短更便宜的续费"],
    },
    en: {
      title: ".software vs .app: The Suit or The T-Shirt",
      metaDescription:
        ".software reads formal — serious products and companies; .app reads instant — tap and use. Compare the two software suffixes on vibe, HTTPS rules and pricing, then hunt names available on both.",
      verdict:
        "Both sell software; they feel different. .software is the suit — software company sites, desktop and enterprise applications, industry systems and custom-dev teams on name.software leave no guessing about what you sell, and industry + .software nails enterprise procurement searches; run by Identity Digital at about $16 to register and $33/yr to renew; the cost is eight letters, so keep the front word short. .app is the T-shirt — mobile apps, utilities and indie-developer products on name.app ride Google's suffix with built-in developer recognition, three brisk letters that whisper \"install me\" from the address; about $14 to register and $16/yr to renew — half of .software's renewal — plus enforced HTTPS preload (browsers refuse unencrypted connections), which sets the security baseline for free. The test: selling to companies, priced per seat or license, with a procurement process → .software's formality fits; selling to individuals, distributed through app stores, tap-and-use → .app's lightness is truer. Desktop tools sit in between: developer- and geek-facing ones wear .app naturally (plenty of indie Mac apps live on name.app), enterprise-IT-facing ones read steadier on .software. Shared notes: .app's HTTPS enforcement means certificates must be ready before launch — don't use it for bare redirects; and neither suffix boosts app-store or search rankings, so the domain's job is the product site, docs and download page.",
      pickA: ["Software companies & product sites", "Desktop & enterprise applications", "Industry systems & procurement", "Outsourcing & custom dev teams"],
      pickB: ["Mobile apps & utilities", "Indie developer products", "App-store-distributed products", "Shorter name, cheaper renewal"],
    },
  },
  "services-vs-agency": {
    slug: "services-vs-agency",
    a: "services",
    b: "agency",
    zh: {
      title: ".services 和 .agency 怎么选：服务清单与创意团队的对比",
      metaDescription: ".services 卖「明码标价的服务清单」，.agency 卖「有创意的专业团队」。对比两个乙方后缀的气质、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都是乙方，气质两路。.services 是清单——会计法务人力等专业服务、家政保洁与维修安装、企业外包与本地服务商用 name.services，读出来就是「我提供这些服务」，朴素直白反而可信，「城市 + 行业 + .services」还能精准命中本地搜索；Identity Digital 运营，注册约 $9、续费约 $31/年。.agency 是团队——广告与品牌代理、设计工作室、数字营销、公关与增长团队用 name.agency，agency 一词自带「创意 + 专业 + 团队作战」的行业身份，创意行业的乙方用它比 .com 更圈内；首年促销常见十几块钱、续费约 $24/年，比 .services 还便宜。判断标准：卖「标准化的活」——按次按月计费、流程清晰、看菜单下单 → .services 的实在感更配；卖「创意与策略」——比稿、提案、按项目或月费服务 → .agency 的行业身份更准。中介类生意（保险、房产、招聘）两个都通：偏流程与清单用 .services，偏撮合与代理用 .agency 更贴词源。共同注意：两个都要求主体名说清「做什么的」，行业词或城市词入名最有效；乙方获客靠案例与口碑，域名的角色是作品集官网与询价入口，首屏放案例比放形容词有用。",
      pickA: ["会计法务等专业服务", "家政维修与本地服务", "企业外包与托管运维", "标准化按单计费的生意"],
      pickB: ["广告与品牌代理", "设计与数字营销工作室", "公关与增长团队", "保险房产招聘等中介"],
    },
    en: {
      title: ".services vs .agency: The Menu or The Team",
      metaDescription:
        ".services sells a priced menu of what you do; .agency sells a creative professional team. Compare the two vendor suffixes on vibe, pricing and fit, then hunt names available on both.",
      verdict:
        "Both are vendors; the vibes fork. .services is the menu — accounting, legal and HR firms, cleaning, repair and installation trades, outsourcing and local providers on name.services read as \"here is what we offer\", and the plainness earns trust; city + trade + .services even nails local search intent; run by Identity Digital at about $9 to register and $31/yr to renew. .agency is the team — advertising and brand agencies, design studios, digital marketing, PR and growth teams on name.agency inherit the word's built-in identity of creativity, professionalism and teamwork; in creative industries it reads more native than .com; promo first years often run a couple of dollars with renewal near $24/yr — cheaper than .services. The test: selling standardized work — per-visit or monthly billing, clear processes, ordered off a menu → .services' matter-of-factness fits; selling creativity and strategy — pitches, proposals, project or retainer engagements → .agency's industry badge is truer. Brokerage businesses (insurance, real estate, recruiting) can go either way: process-and-menu-led picks .services, matchmaking-and-representation-led picks .agency, closer to the word's root. Shared notes: both demand a front word that says what you do — trade or city words work hardest; and vendors win clients on portfolios and referrals, so the domain is the case-study site and quote front door — lead with work, not adjectives.",
      pickA: ["Accounting, legal & HR firms", "Home repair & local services", "Outsourcing & managed ops", "Standardized per-job businesses"],
      pickB: ["Advertising & brand agencies", "Design & digital marketing studios", "PR & growth teams", "Insurance, realty & recruiting brokers"],
    },
  },
  "marketing-vs-agency": {
    slug: "marketing-vs-agency",
    a: "marketing",
    b: "agency",
    zh: {
      title: ".marketing 和 .agency 怎么选：专业能力与机构身份的对比",
      metaDescription: ".marketing 说「我们做的是营销」，.agency 说「我们是一家机构」。对比两个乙方后缀的焦点、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "同一批客户，两种自我介绍。.marketing 报专业——营销代理、增长与投放团队、营销 SaaS、营销博客与课程用 name.marketing，域名直接说「营销是我们的手艺」，卖专业能力时最点题，「领域 + .marketing」（content、email 类）还能精准命中垂类搜索；Identity Digital 运营，注册约 $6、续费约 $33/年；代价是九个字母偏长，主体名务必短。.agency 报身份——广告与品牌代理、设计工作室、公关与增长团队用 name.agency，agency 一词自带「创意 + 团队作战」的行业气质，且不锁定营销一个领域，设计、公关、招聘中介都能用；首年促销常见十几块钱、续费约 $24/年，比 .marketing 便宜。判断标准：卖「营销这门专业」——增长顾问、投放服务、营销工具 → .marketing 的点题更准；卖「机构与团队」——全案代理、多业务线、创意比稿 → .agency 的身份更配。业务未来可能超出营销范围的，选 .agency 不锁死；只做营销且想吃垂类搜索的，选 .marketing。共同注意：两个都是乙方后缀，获客靠案例与口碑，域名的角色是作品集官网与线索入口，首屏放案例比放形容词有用。",
      pickA: ["营销代理与增长团队", "营销 SaaS 与投放工具", "营销博客与课程", "想吃垂类搜索的营销专家"],
      pickB: ["广告与品牌全案代理", "设计与公关工作室", "业务多元的创意团队", "想要更便宜续费的乙方"],
    },
    en: {
      title: ".marketing vs .agency: The Expertise or The Firm",
      metaDescription:
        ".marketing says \"marketing is what we do\"; .agency says \"we are a firm\". Compare the two vendor suffixes on focus, pricing and fit, then hunt names available on both.",
      verdict:
        "Same clients, two introductions. .marketing states the expertise — marketing agencies, growth and performance teams, martech SaaS, marketing blogs and courses on name.marketing spell out \"marketing is our craft\", sharpest when you sell the skill itself, and field + .marketing (content, email) nails vertical searches; run by Identity Digital at about $6 to register and $33/yr to renew; the cost is nine letters, so keep the front word short. .agency states the identity — advertising and brand agencies, design studios, PR and growth teams on name.agency inherit the word's built-in vibe of creativity and teamwork, and it doesn't lock you to marketing: design, PR and recruiting firms wear it too; promo first years often run a couple of dollars with renewal near $24/yr — cheaper than .marketing. The test: selling the marketing discipline — growth consulting, paid media, martech tools → .marketing's precision fits; selling the firm and the team — full-service accounts, multiple practice lines, creative pitches → .agency's badge is truer. If the business may outgrow marketing, .agency keeps the door open; if marketing is the whole game and vertical search matters, .marketing earns its length. Shared notes: both are vendor suffixes — clients come through portfolios and referrals, so the domain is the case-study site and lead front door; lead with work, not adjectives.",
      pickA: ["Marketing agencies & growth teams", "Martech SaaS & media tools", "Marketing blogs & courses", "Vertical-search-hungry specialists"],
      pickB: ["Full-service ad & brand agencies", "Design & PR studios", "Multi-line creative firms", "Cheaper renewal for vendors"],
    },
  },
  "capital-vs-fund": {
    slug: "capital-vs-fund",
    a: "capital",
    b: "fund",
    zh: {
      title: ".capital 和 .fund 怎么选：机构全名与一只基金的对比",
      metaDescription: ".capital 是资管机构的正装全名，.fund 指向一只具体的基金或募资计划。对比两个资本后缀的语义、价格与合规注意，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都在管钱，指向不同。.capital 是机构——私募与风投基金、资产管理与量化机构、家族办公室用 name.capital，英文基金名以 Capital 结尾是行业惯例，「品牌词 + .capital」读出来就是注册主体全名，管理规模越大越合身；Identity Digital 运营，注册约 $6、续费约 $57/年，对资管行业完全无感。.fund 是那只基金——单一基金、主题募资计划、公益与社区基金用 name.fund，「主题 + .fund」（climate.fund 类）直接说明钱往哪去，比 .capital 更具体也更亲民；注册约 $9、续费约 $57/年，与 .capital 同档。判断标准：域名代表「管理公司」——多只基金、长期机构品牌、对 LP 的正式门面 → .capital 的机构感更配；域名代表「一笔钱」——单一主题基金、募资落地页、捐赠与资助计划 → .fund 的指向更准。不少机构两个都用：管理公司在 name.capital，旗下主题基金用 theme.fund 分站。共同注意：金融语义自带监管预期，页面要放清楚主体信息与合规声明，否则容易被当作募资骗局；主体名务必稳重，姓氏与意象词是主流，轻佻词毁掉信任感。",
      pickA: ["私募与风投管理公司", "资产管理与量化机构", "家族办公室", "面向 LP 的机构门面"],
      pickB: ["单一主题基金与募资计划", "公益与社区基金", "捐赠与资助落地页", "「主题 + .fund」的具体叙事"],
    },
    en: {
      title: ".capital vs .fund: The Firm or The Pool of Money",
      metaDescription:
        ".capital reads as the asset manager's full name; .fund points at one specific fund or raise. Compare the two finance suffixes on semantics, pricing and compliance, then hunt names available on both.",
      verdict:
        "Both manage money; they point at different things. .capital is the firm — PE and VC managers, asset managers and quant shops, family offices on name.capital ride the industry convention of fund names ending in \"Capital\", so brand word + .capital reads out as the registered entity's full name, and the bigger the AUM the better it fits; run by Identity Digital at about $6 to register and $57/yr to renew — invisible to an asset manager. .fund is the pool — a single fund, a thematic raise, charity and community funds on name.fund say where the money goes, and theme + .fund (think climate.fund) is more concrete and approachable than .capital; about $9 to register and $57/yr to renew, the same tier. The test: the domain represents the management company — multiple funds, a long-term institutional brand, the formal front door for LPs → .capital's institutional register fits; the domain represents one pot of money — a thematic fund, a raise landing page, grants and endowments → .fund's specificity is truer. Many firms run both: the manager on name.capital, thematic vehicles on theme + .fund satellites. Shared notes: financial semantics invite regulatory scrutiny — publish your legal entity and compliance details or risk reading like a scam; and front words must be steady — surnames and imagery words dominate, flippancy kills trust.",
      pickA: ["PE & VC management firms", "Asset managers & quant shops", "Family offices", "Institutional front door for LPs"],
      pickB: ["Single thematic funds & raises", "Charity & community funds", "Grant & endowment pages", "Theme + .fund storytelling"],
    },
  },
  "guru-vs-expert": {
    slug: "guru-vs-expert",
    a: "guru",
    b: "expert",
    zh: {
      title: ".guru 和 .expert 怎么选：亲切人设与一本正经的对比",
      metaDescription: ".guru 带一点自嘲的亲切专家人设，.expert 是一本正经的能力断言。对比两个专家后缀的语气、价格陷阱与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都在说「这事问我」，语气差一档。.guru 是笑着说的——教程与攻略站、修理与生活技能达人、兴趣领域 KOL 用 name.guru，自带一点幽默的专家人设，面向大众的内容用它更好记更易传播（fitness.guru 比 fitness.expert 顺口）；Identity Digital 运营，注册约 $3 是便宜档，续费约 $35/年，注意差价。.expert 是板着脸说的——细分领域专家、技术顾问、付费问答与专业咨询用 name.expert，断言更正式，企业客户与严肃场景里更立得住；注册约 $7 很低，但续费约 $50/年是高档——两个都是典型的首年引流定价，预算必须按续费核算。判断标准：面向大众、内容轻快、靠传播起量 → .guru 的亲切更配；面向企业、客单价高、靠履历背书 → .expert 的正式更准。监管行业（法律、医疗、金融）的「专家」表述可能触碰广告合规，两个后缀都要谨慎措辞，正式 B2B 咨询用 .consulting 更稳。共同注意：两个都是「自封」的形容词，内容深度与案例撑不起人设时会反噬——空壳站用专家后缀只会放大质疑；获客靠内容与口碑，域名的角色是个人品牌门面，首屏放真实履历与案例。",
      pickA: ["教程与攻略内容站", "生活技能与修理达人", "兴趣领域 KOL 与自媒体", "想要便宜首年与传播度"],
      pickB: ["细分领域技术顾问", "付费问答与专业咨询", "面向企业的严肃场景", "想要更正式的断言"],
    },
    en: {
      title: ".guru vs .expert: The Wink or The Straight Face",
      metaDescription:
        ".guru wears expertise with a wink; .expert asserts it straight-faced. Compare the two expert suffixes on tone, pricing traps and fit, then hunt names available on both.",
      verdict:
        "Both say \"ask me about this\"; the delivery differs by one notch. .guru says it smiling — how-to and tutorial sites, repair and life-skill teachers, hobby authorities on name.guru wear a self-aware expert persona, and for mass-audience content it's more memorable and shareable (fitness.guru rolls better than fitness.expert); run by Identity Digital at about $3 to register — the cheap tier — and about $35/yr to renew, so mind the gap. .expert says it straight-faced — niche specialists, technical advisors, paid Q&A and professional consulting on name.expert make the more formal claim, which stands up better with corporate clients and serious contexts; about $7 to register but ~$50/yr to renew — the high tier. Both are classic first-year-bait pricing, so budget strictly on the renewal. The test: mass audience, light content, growth through sharing → .guru's warmth fits; corporate clients, high ticket sizes, credential-backed trust → .expert's formality is truer. In regulated fields (legal, medical, financial), \"expert\" claims can trip advertising rules on either suffix — word carefully, and for formal B2B consulting .consulting reads safer still. Shared notes: both are self-awarded adjectives that backfire without real depth behind them — a thin site on an expert suffix amplifies doubt; clients come through content and word of mouth, so the domain is the personal-brand front door — lead with real credentials and cases.",
      pickA: ["How-to & tutorial content sites", "Life-skill & repair teachers", "Hobby authorities & creators", "Cheap first year, shareable name"],
      pickB: ["Niche technical advisors", "Paid Q&A & professional advice", "Corporate-facing serious contexts", "The more formal claim"],
    },
  },
  "systems-vs-network": {
    slug: "systems-vs-network",
    a: "systems",
    b: "network",
    zh: {
      title: ".systems 和 .network 怎么选：成套工程与互联叙事的对比",
      metaDescription: ".systems 卖「我们造的是正经系统」的工程气质，.network 卖「协议即网络」的互联叙事。对比两个基建后缀的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都是基建后缀，叙事分两路。.systems 说「我们造系统」——基础设施与 DevOps 团队、企业系统集成商、IoT 与嵌入式公司、安全与监控平台用 name.systems，域名自带工程房间的嗡嗡声，「单音节词 + .systems」是基建初创的标准写法；Identity Digital 运营，注册约 $12、续费约 $28/年，温和档。.network 说「我们连节点」——CDN、VPN 与节点服务、区块链协议与公链、行业社群与人脉平台用 name.network，「协议即网络」的叙事让它成为链圈主流选择，mesh.network 读出来就是产品定位；首年常见几美元、续费约 $20/年，比 .systems 还便宜。判断标准：产品是「一套自成体系的工程」——数据库、操作系统、监控系统、嵌入式 → .systems 的成套感更准；产品是「连接节点的网络」——协议、P2P、社群、联盟 → .network 的互联叙事更配。社会意义的网络（行业社群、播客联盟）只有 .network 能接，.systems 接不了。共同注意：两个后缀都是七字母偏长，主体名务必短；都偏冷硬工程气质，2C 产品另选后缀；这类团队获客靠技术声誉（GitHub、技术博客、会议演讲），域名的角色是工程品牌门面与文档站。",
      pickA: ["基础设施与 DevOps 团队", "企业系统集成与行业系统", "IoT 与嵌入式公司", "安全与监控平台"],
      pickB: ["区块链协议与公链", "CDN/VPN 与节点服务", "行业社群与人脉平台", "媒体与播客联盟"],
    },
    en: {
      title: ".systems vs .network: The Machine or The Mesh",
      metaDescription:
        ".systems hums \"we build serious systems\"; .network tells the \"protocol is the network\" story. Compare the two infrastructure suffixes on semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both are infrastructure suffixes; the stories fork. .systems says \"we build the machine\" — infrastructure and DevOps teams, enterprise integrators, IoT and embedded companies, security and monitoring platforms on name.systems hum like a server room, and one syllable + .systems is the infra-startup standard; run by Identity Digital at about $12 to register and $28/yr to renew — the mild tier. .network says \"we connect the nodes\" — CDNs, VPNs and node services, blockchain protocols and chains, industry communities and professional platforms on name.network ride the \"protocol is the network\" narrative that made it a crypto mainstay; mesh.network reads as a positioning statement; a few dollars first year and around $20/yr to renew — cheaper than .systems. The test: the product is a self-contained engineered whole — databases, operating systems, monitoring stacks, embedded → .systems' completeness is truer; the product is a mesh of connected nodes — protocols, P2P, communities, collectives → .network's story fits. And the social sense of \"network\" (industry communities, podcast collectives) only works on .network — .systems can't carry it. Shared notes: both suffixes run seven letters, so front words must stay short; both wear a cold engineering register — consumer brands look elsewhere; and these teams win business on technical reputation (GitHub, engineering blogs, conference talks), so the domain is the engineering brand front door and docs site.",
      pickA: ["Infrastructure & DevOps teams", "Enterprise integrators & industry systems", "IoT & embedded companies", "Security & monitoring platforms"],
      pickB: ["Blockchain protocols & chains", "CDN/VPN & node services", "Industry communities & platforms", "Media & podcast collectives"],
    },
  },
  "ventures-vs-capital": {
    slug: "ventures-vs-capital",
    a: "ventures",
    b: "capital",
    zh: {
      title: ".ventures 和 .capital 怎么选：早期押注与机构规模的对比",
      metaDescription: ".ventures 偏早期与冒险的押注语气，.capital 偏机构与规模的正装语气。对比两个基金后缀的阶段感、价格与命名传统，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都是基金后缀，阶段感不同。.ventures 是押注——风投与天使基金、创业工作室、孵化器与加速器、连续创业者的控股主体用 name.ventures，英文基金名带 ventures 是行业标准写法（Sequoia、a16z 全名都有），域名直接用后缀省掉主体里的重复，语气偏早期与冒险；Identity Digital 运营，注册约 $6、续费约 $48/年。.capital 是正装——私募与风投管理公司、资产管理与量化机构、家族办公室用 name.capital，Capital 结尾同样是行业惯例（Benchmark Capital 类），但语气更机构、更规模化，管理规模越大越合身；注册约 $6、续费约 $57/年，比 .ventures 略贵。判断标准：品牌想传达「我们押注未来」——早期基金、venture studio、孵化器 → .ventures 的冒险感更准；品牌想传达「我们管理资本」——成长期与并购基金、资管机构、家办 → .capital 的分量更配。同一家机构做大后从 .ventures 换到 .capital 的叙事也常见——先按十年后的定位选，省一次换域名。命名传统两边一致：姓氏与合伙人组合最主流，主题基金用「领域 + 后缀」（climate、bio 类）一眼点明赛道。共同注意：机构与资本语气，单一产品或 2C 品牌都不合适；基金品牌重信任，主体名稳重为先，页面放清楚主体与合规信息。",
      pickA: ["风投与天使基金", "创业工作室与孵化器", "连续创业者控股主体", "早期与冒险的品牌语气"],
      pickB: ["成长期与并购基金", "资产管理与量化机构", "家族办公室", "机构与规模的品牌分量"],
    },
    en: {
      title: ".ventures vs .capital: The Bet or The Institution",
      metaDescription:
        ".ventures leans early-stage and adventurous; .capital leans institutional and scaled. Compare the two fund suffixes on stage, pricing and naming tradition, then hunt names available on both.",
      verdict:
        "Both are fund suffixes; the stage differs. .ventures is the bet — VC and angel funds, venture studios, incubators and accelerators, serial founders' holdcos on name.ventures ride the industry-standard trailing word (Sequoia and a16z both carry \"ventures\" in their full names), the TLD saves repeating it in the name, and the register leans early and adventurous; run by Identity Digital at about $6 to register and $48/yr to renew. .capital is the suit — PE and VC management firms, asset managers and quant shops, family offices on name.capital ride the equally traditional \"Capital\" ending (think Benchmark Capital), but the register is institutional and scaled: the bigger the AUM, the better it fits; about $6 to register and $57/yr to renew, slightly above .ventures. The test: the brand says \"we bet on the future\" — early-stage funds, venture studios, incubators → .ventures' adventure fits; the brand says \"we manage capital\" — growth and buyout funds, asset managers, family offices → .capital's weight is truer. Graduating from .ventures to .capital as a firm scales is a familiar story — pick for where you'll be in ten years and skip the rebrand. Naming tradition is shared: surnames and partner combinations dominate, and thesis funds say the lane as field + suffix (climate, bio). Shared notes: both carry an institutional-capital register — wrong for a single product or consumer brand; fund brands trade on trust, so keep front words steady and publish entity and compliance details.",
      pickA: ["VC & angel funds", "Venture studios & incubators", "Serial founders' holdcos", "Early-stage, adventurous register"],
      pickB: ["Growth & buyout funds", "Asset managers & quant shops", "Family offices", "Institutional, scaled weight"],
    },
  },
  "tips-vs-blog": {
    slug: "tips-vs-blog",
    a: "tips",
    b: "blog",
    zh: {
      title: ".tips 和 .blog 怎么选：实用承诺与写作园地的对比",
      metaDescription: ".tips 承诺「点开就有实用建议」，.blog 承诺「这里有人持续在写」。对比两个内容后缀的预期、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都是内容后缀，承诺不同。.tips 承诺有用——攻略与技巧站、垂类内容博客、工具型 newsletter、生活妙招与省钱指南用 name.tips，「领域 + .tips」（travel.tips、tax.tips 类）读出来就是搜索框里的查询词，天然贴合搜索意图；Identity Digital 运营，注册约 $8、续费约 $25/年，温和档。.blog 承诺有人——个人写作者、品牌内容分站、长文与观点输出用 name.blog，格式一眼即懂：这里是持续更新的写作园地，深度长文与个人叙事都装得下；注册约 $3、续费约 $21/年，比 .tips 还便宜，对个人创作者可长期负担。判断标准：内容是「一条条可执行的建议」——攻略、清单、妙招、速查 → .tips 的实用预期更准；内容是「一个人的持续输出」——观点、随笔、深度文章、个人品牌 → .blog 的园地感更配。SEO 玩法也分两路：.tips 吃「领域 + tips」的长尾搜索词，.blog 吃作者名与品牌词的认知积累。注意 .tips 设定了轻内容预期，严肃研究站用 .blog 更合；.blog 则不适合做电商或 SaaS 主站，两个都定位内容资产。共同注意：内容站的域名是承诺，更新频率与质量撑不起时任何后缀都救不了；起量靠搜索与订阅，首屏放最好的内容而不是自我介绍。",
      pickA: ["攻略与技巧站", "生活妙招与省钱指南", "工具型 newsletter", "吃长尾搜索的垂类站"],
      pickB: ["个人写作者主阵地", "品牌内容分站（brand.blog）", "深度长文与观点输出", "想要最便宜的续费"],
    },
    en: {
      title: ".tips vs .blog: The Promise of Useful or The Promise of Writing",
      metaDescription:
        ".tips promises useful advice on click; .blog promises a living writing home. Compare the two content suffixes on expectations, pricing and fit, then hunt names available on both.",
      verdict:
        "Both are content suffixes; the promises differ. .tips promises useful — how-to and technique sites, niche blogs, utility newsletters, life hacks and savings guides on name.tips read like the search query itself (travel.tips, tax.tips), naturally aligned with search intent; run by Identity Digital at about $8 to register and $25/yr to renew — the mild tier. .blog promises a person — independent writers, brand content satellites, long-form and opinion writing on name.blog carry an instantly understood format: a living, updating writing home that fits deep essays and personal narrative alike; about $3 to register and $21/yr to renew — cheaper than .tips and sustainable for individual creators. The test: the content is actionable items — guides, checklists, hacks, quick answers → .tips' utility expectation is truer; the content is one voice writing over time — opinions, essays, deep dives, a personal brand → .blog's home-base feel fits. The SEO games differ too: .tips harvests field + tips long-tail queries, while .blog compounds recognition around an author or brand name. Note .tips sets a light-content expectation — serious research sites wear .blog better; and .blog looks amateur on an e-commerce or SaaS main site — both are content assets, not storefronts. Shared notes: a content domain is a promise, and no suffix survives thin or stale content; growth comes from search and subscriptions, so lead the first screen with your best work, not an about page.",
      pickA: ["How-to & technique sites", "Life hacks & savings guides", "Utility newsletters", "Long-tail-search vertical sites"],
      pickB: ["Independent writers' home base", "Brand content satellites (brand.blog)", "Long-form essays & opinion", "Cheapest renewal for creators"],
    },
  },
  "market-vs-exchange": {
    slug: "market-vs-exchange",
    a: "market",
    b: "exchange",
    zh: {
      title: ".market 和 .exchange 怎么选：多方陈列与双向撮合的对比",
      metaDescription: ".market 说「这里是集市，来逛来买」，.exchange 说「这里撮合双方流动」。对比两个平台后缀的方向感、价格与合规注意，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都是平台后缀，方向不同。.market 是陈列——垂直电商集市、二手与本地市集、数字资产与模板商店、农夫与周末市集用 name.market，点进来之前就知道「这里能逛能买」，「品类 + .market」还是天然英文短语（art.market、nft.market 的节奏），语义 SEO 有真实红利；Identity Digital 运营，注册约 $36、续费约 $36/年——没有首年甜头，但也没有续费陷阱，长期成本透明。.exchange 是撮合——交易与匹配平台、二手置换与以物易物社区、货币与积分兑换、数据与 API 市场用 name.exchange，把平台的核心动作直接写进域名，供需双向流动的平台用它更准；注册约 $6、续费约 $31/年，温和档，首年比 .market 便宜得多。判断标准：平台聚合多个卖家做「陈列与出售」——集市、商城、模板店 → .market 的集市感更准；平台撮合双边做「流动与交换」——交易所、置换、兑换 → .exchange 的动词更点题。注意 .exchange 在英文里自带证券交易所的联想，金融类项目要把牌照与合规信息放在明面上——域名越像交易所，监管目光越多。共同注意：双边平台冷启动靠两侧供给，域名的角色是平台可信度门面而不是流量来源；两个词都不算短，主体名务必短。",
      pickA: ["垂直电商与多卖家集市", "二手与本地市集", "数字资产与模板商店", "想要成本透明的长期持有"],
      pickB: ["交易与撮合平台", "置换与以物易物社区", "货币与积分兑换工具", "数据与 API 市场"],
    },
    en: {
      title: ".market vs .exchange: The Bazaar or The Match",
      metaDescription:
        ".market says \"browse and buy here\"; .exchange says \"two-way flow matched here\". Compare the two platform suffixes on direction, pricing and compliance, then hunt names available on both.",
      verdict:
        "Both are platform suffixes; the direction differs. .market is display — vertical e-commerce marketplaces, secondhand and local markets, digital-asset and template stores, farmers and weekend markets on name.market tell visitors \"browse and buy\" before the click, and category + .market is a natural English phrase (the art.market, nft.market cadence) with a real semantic-SEO dividend; run by Identity Digital at about $36 to register and $36/yr to renew — no first-year sweetener, but no renewal trap either, so the long-term cost is transparent. .exchange is matching — trading and matching platforms, swap and barter communities, currency and points converters, data and API marketplaces on name.exchange write the platform's core verb into the address, truest for platforms matching both sides of supply and demand; about $6 to register and $31/yr to renew — the mild tier, far cheaper up front than .market. The test: the platform aggregates many sellers to display and sell — marketplaces, malls, template stores → .market's bazaar reads truer; the platform matches two sides in motion — exchanges, swaps, conversions → .exchange's verb is sharper. Note that in English, exchange rings of stock exchanges — financial projects should put licensing and compliance front and center, because the more exchange-like the domain, the more regulatory scrutiny it invites. Shared notes: two-sided platforms cold-start on supply, so the domain's job is instant platform credibility, not traffic; and neither word is short — keep the front word tight.",
      pickA: ["Vertical & multi-vendor marketplaces", "Secondhand & local markets", "Digital-asset & template stores", "Transparent long-term holding cost"],
      pickB: ["Trading & matching platforms", "Swap & barter communities", "Currency & points converters", "Data & API marketplaces"],
    },
  },
  "watch-vs-show": {
    slug: "watch-vs-show",
    a: "watch",
    b: "show",
    zh: {
      title: ".watch 和 .show 怎么选：观看动作与节目名号的对比",
      metaDescription: ".watch 把「看」这个动作写进域名，.show 把「节目」这个名号写进域名。对比两个内容后缀的语义、价格陷阱与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都指向内容消费，指的不是一回事。.watch 是动作——视频与流媒体聚合、赛事与剧集观看指南、价格与舆情监控工具（price watch、whale watch 的语感）、手表电商与钟表社区用 name.watch，一个后缀横跨「观看、盯梢、腕表」三个场景，「对象 + .watch」是地道英文习语（storm.watch 的节奏）；Identity Digital 运营，注册约 $3 是全站最便宜档之一，但续费约 $36/年是 10 倍跳涨——验证想法便宜，长期持有要按续费算账。.show 是名号——播客与视频节目、脱口秀与综艺、演出与展览、作品集展示页用 name.show，英文节目名以 Show 结尾是百年传统（The Tonight Show 的节奏），「节目名 + .show」读出来就是完整片名，播客受益最大；注册约 $8、续费约 $36/年，中间档。判断标准：站点的核心是「观看或监控某个对象」——聚合站、观看指南、监控工具 → .watch 的动作更准；站点本身就是「一档节目」——播客、访谈、演出 → .show 的名号更配。注意 .watch 一词三义是资产也是歧义，首屏必须立刻说清你是看剧、盯价还是卖表；流媒体聚合站要注意版权，域名越点题越显眼。共同注意：节目与内容站是持续承诺，断更的 .show 比断更的博客更伤；获客靠内容与订阅，域名的角色是品牌门面，首屏放最好的内容。",
      pickA: ["视频与流媒体聚合站", "赛事与剧集观看指南", "价格与舆情监控工具", "手表电商与钟表社区"],
      pickB: ["播客与视频节目", "脱口秀与访谈栏目", "演出与展览页面", "作品集展示（brand.show）"],
    },
    en: {
      title: ".watch vs .show: The Verb or The Title",
      metaDescription:
        ".watch writes the act of watching into the address; .show writes the program's title. Compare the two content suffixes on semantics, pricing traps and fit, then hunt names available on both.",
      verdict:
        "Both point at content; they point differently. .watch is the verb — video and streaming aggregators, sports and show viewing guides, price and sentiment monitors (the price watch, whale watch cadence), watch retailers and horology communities on name.watch stretch one suffix across three scenes, and target + .watch is native English idiom (the storm.watch rhythm); run by Identity Digital at about $3 to register — one of the cheapest first years anywhere — but about $36/yr to renew, a 10x jump: cheap to validate an idea, a real line item to hold. .show is the title — podcasts and video shows, talk shows and variety formats, performances and exhibitions, portfolio showcases on name.show ride a century-old convention of programs ending in \"Show\" (The Tonight Show cadence), so show name + suffix reads out as the complete title — podcasters benefit most; about $8 to register and $36/yr to renew, the mid tier. The test: the site's core is watching or monitoring something — aggregators, viewing guides, alert tools → .watch's verb is sharper; the site is itself a program — podcasts, interviews, performances → .show's title fits. Note .watch's triple meaning is an asset and an ambiguity — the hero must instantly say whether you stream, monitor, or sell timepieces; and streaming aggregators should mind copyright, because the more on-the-nose the domain, the more attention it draws. Shared notes: shows and content sites are ongoing promises — an abandoned .show reads worse than an abandoned blog; growth comes from content and subscriptions, so lead the first screen with your best work.",
      pickA: ["Video & streaming aggregators", "Sports & series viewing guides", "Price & sentiment monitors", "Watch retail & horology communities"],
      pickB: ["Podcasts & video shows", "Talk shows & interview formats", "Performance & exhibition pages", "Portfolio showcases (brand.show)"],
    },
  },
  "house-vs-style": {
    slug: "house-vs-style",
    a: "house",
    b: "style",
    zh: {
      title: ".house 和 .style 怎么选：居住场景与审美主张的对比",
      metaDescription: ".house 把「住」写进域名，.style 把「品味」写进域名。对比两个生活方式后缀的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都是生活方式后缀，落点不同。.house 是场景——房产中介与租房平台、家装家居品牌、民宿与短租、建筑与室内设计工作室用 name.house，一眼「与居住有关」；还有一层加成：创意机构、唱片厂牌与出版社的英文名传统以 House 结尾（design house、publishing house），「品牌词 + .house」读出来就是机构全名，比 .studio 多一分居家感；Identity Digital 运营，注册约 $15、续费约 $36/年，中间档。.style 是主张——穿搭与时尚博主、造型师与形象顾问、美妆与服饰品牌、生活方式媒体用 name.style，域名自带「有品味」的气质，比 .fashion 更宽：穿搭、家居、文字甚至代码规范都装得下（brand style guide 就是它的地盘），「人名 + .style」读出来就是「某某的风格」；注册约 $7、续费约 $31/年，温和档，比 .house 便宜。判断标准：业务围绕「房子与居住」——房产、家装、民宿、设计工作室 → .house 的场景更准；业务围绕「审美与个人品牌」——穿搭、美妆、造型、生活方式内容 → .style 的主张更配。家居品牌两边都能站：卖「住的产品」偏 .house，卖「生活的品味」偏 .style。注意房产是极度本地的生意，「城市 + .house」比泛词更接本地搜索；.style 是主观承诺，站点视觉必须撑得住——粗糙的 .style 站比普通域名更减分。共同注意：两个都偏轻快生活气质，严肃 B2B 与金融另选后缀。",
      pickA: ["房产中介与租房平台", "家装与家居品牌", "民宿与短租页面", "建筑与设计工作室（brand.house）"],
      pickB: ["穿搭与时尚博主", "造型师与形象顾问", "美妆与服饰品牌", "个人品牌（yourname.style）"],
    },
    en: {
      title: ".house vs .style: The Place or The Taste",
      metaDescription:
        ".house writes living into the address; .style writes taste into it. Compare the two lifestyle suffixes on semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both are lifestyle suffixes; they land differently. .house is the place — real-estate agents and rental platforms, home-improvement and furnishing brands, guesthouses and short-term rentals, architecture and interior studios on name.house read instantly \"about living\"; and there's a bonus register: creative agencies, record labels and publishers traditionally end in House (design house, publishing house), so brand word + .house reads out as the organization's full name, one notch homier than .studio; run by Identity Digital at about $15 to register and $36/yr to renew — the mid tier. .style is the taste — fashion and outfit bloggers, stylists and image consultants, beauty and apparel brands, lifestyle media on name.style carry a \"taste included\" air, broader than .fashion: outfits, interiors, writing, even code conventions fit (the brand style guide is its turf), and yourname.style reads out as \"so-and-so's style\"; about $7 to register and $31/yr to renew — the mild tier, cheaper than .house. The test: the business is about homes and living — property, furnishing, rentals, design studios → .house's scene is truer; the business is about aesthetics and personal brand — outfits, beauty, styling, lifestyle content → .style's claim fits. Home brands can stand on either: selling the product of living leans .house, selling the taste of living leans .style. Note property is a fiercely local business — city + .house catches local search better than generic words; and .style is a subjective promise, so the site's visuals must deliver — a rough-looking .style site hurts more than a plain domain. Shared notes: both wear a light lifestyle register — sober B2B and finance look elsewhere.",
      pickA: ["Real-estate agents & rental platforms", "Home-improvement & furnishing brands", "Guesthouses & short-term rentals", "Architecture & design studios (brand.house)"],
      pickB: ["Fashion & outfit bloggers", "Stylists & image consultants", "Beauty & apparel brands", "Personal brands (yourname.style)"],
    },
  },
  "institute-vs-international": {
    slug: "institute-vs-international",
    a: "institute",
    b: "international",
    zh: {
      title: ".institute 和 .international 怎么选：研究权威与全球版图的对比",
      metaDescription: ".institute 是研究机构的正式名号，.international 把全球化写进域名。对比两个机构后缀的语义、价格与命名传统，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都是机构后缀，说的不是一件事。.institute 说「我们做研究」——智库与研究团队、培训与认证机构、行业研究组织、公益研究项目用 name.institute，英文机构名以 Institute 结尾是行业惯例（AI 安全、经济政策类机构都这么起名），「领域词 + .institute」读出来就是机构全名，发布报告与标准的组织用它最立得住；Identity Digital 运营，注册约 $8、续费约 $22/年，温和档且续费友好。.international 说「我们做全球」——跨境企业与全球品牌、国际组织与 NGO、留学与移民服务、货运与外贸公司用 name.international，公司名以 International 结尾是老牌跨国企业的经典写法，「品牌词 + .international」读出来就是注册主体全名，比塞进主体名优雅得多；注册约 $8、续费约 $25/年，同样温和档。判断标准：机构的立身之本是「研究与权威」——发报告、定标准、做认证 → .institute 的学术分量更准；机构的立身之本是「跨境与版图」——多国经营、国际服务、全球品牌 → .international 的全球叙事更配。两个都能是同一家机构的不同侧面：研究院用 .institute，集团全球站用 .international。注意 .institute 语气正式，个人博客与轻内容撑不起来，空壳站会显得越界；.international 长达十三个字母，主体名必须极短，两三个音节封顶；部分司法辖区对注册名里的 institute 有监管，注意表述。共同注意：机构后缀吃信任，页面放清楚主体资质与联系信息，承诺要兑现——单语言单市场的 .international 站会显得空洞。",
      pickA: ["智库与研究团队", "培训与认证机构", "行业研究与标准组织", "公益研究项目"],
      pickB: ["跨境企业与全球品牌", "国际组织与 NGO", "留学移民与国际服务", "货运与外贸公司"],
    },
    en: {
      title: ".institute vs .international: The Authority or The Footprint",
      metaDescription:
        ".institute is the research body's formal name; .international writes the global footprint into the address. Compare the two institutional suffixes on semantics, pricing and naming tradition, then hunt names available on both.",
      verdict:
        "Both are institutional suffixes; they claim different things. .institute says \"we do research\" — think tanks and research groups, training and certification bodies, industry research organizations, nonprofit research projects on name.institute ride the convention of organizations ending in Institute (AI-safety and economic-policy shops alike), so field word + suffix reads out as the institution's full name — organizations that publish reports and standards wear it best; run by Identity Digital at about $8 to register and $22/yr to renew — mild tier with a friendly renewal. .international says \"we operate worldwide\" — cross-border businesses and global brands, international organizations and NGOs, study-abroad and immigration services, freight and trade companies on name.international ride the classic multinational convention of company names ending in International, so brand word + suffix equals the registered entity — far more elegant than cramming it into the name; about $8 to register and $25/yr to renew, the same mild tier. The test: the organization stands on research and authority — reports, standards, certification → .institute's academic weight is truer; the organization stands on borders and footprint — multi-country operations, international services, global brands → .international's story fits. They can even be two faces of one organization: the research arm on .institute, the group's global site on .international. Note .institute's register is formal — personal blogs and thin content read as overreach, and some jurisdictions regulate \"institute\" in registered names; and .international runs thirteen letters — among the longest TLDs anywhere — so the front word must be very short. Shared notes: institutional suffixes trade on trust — publish entity, credentials and contacts, and keep the promise: a single-language, single-market .international site rings hollow.",
      pickA: ["Think tanks & research groups", "Training & certification bodies", "Industry research & standards orgs", "Nonprofit research projects"],
      pickB: ["Cross-border businesses & global brands", "International organizations & NGOs", "Study-abroad & immigration services", "Freight & trade companies"],
    },
  },
  "partners-vs-group": {
    slug: "partners-vs-group",
    a: "partners",
    b: "group",
    zh: {
      title: ".partners 和 .group 怎么选：合伙名号与集团门面的对比",
      metaDescription: ".partners 是专业事务所的铜牌名号，.group 是集团与多品牌矩阵的母品牌门面。对比两个机构后缀的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都是机构后缀，组织形态不同。.partners 是合伙——律所与会计师事务所、咨询公司、投资合伙（LP/GP 结构）、企业渠道与联盟计划用 name.partners，英文事务所与基金以 Partners 结尾是行业传统，「姓氏 + .partners」读出来就是注册主体全名；Identity Digital 运营，注册约 $8、续费约 $57/年——续费高档，但对专业服务费率完全无感；「品牌 + .partners」做企业合作伙伴计划入口也是经典用法，值得防御注册。.group 是集团——控股公司、多品牌矩阵的母品牌、家族企业用 name.group，读出来就是「X 集团」，比冗长的 xxgroup.com 干净得多；它还有第二条路：社群与兴趣小组的落地页同样自然；注册首年常见几美元、续费不到 $20/年，促销与续费差价比多数新后缀小，适合长期持有。判断标准：组织是「合伙人执业」——律师、会计师、咨询师、基金 GP → .partners 的名号传统更准；组织是「集团与矩阵」——控股母公司、多子品牌、家族企业 → .group 的母品牌门面更配。注意 .partners 是复数与机构语气，单人顾问用 .pro 或 .expert 更合身；合伙品牌吃信任，主体名用姓氏与稳重词，切忌轻佻。共同注意：两个都是机构门面后缀，获客靠口碑与关系，域名的角色是正式官网与信任背书，页面放清楚主体资质与团队信息。",
      pickA: ["律所与会计师事务所", "咨询公司与基金 GP", "投资合伙（LP/GP）主体", "企业合作伙伴计划（brand.partners）"],
      pickB: ["控股公司与集团母站", "多品牌矩阵的母品牌", "家族企业官网", "社群与兴趣小组落地页"],
    },
    en: {
      title: ".partners vs .group: The Nameplate or The Parent",
      metaDescription:
        ".partners is the professional firm's brass nameplate; .group is the parent brand of a conglomerate. Compare the two institutional suffixes on semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both are institutional suffixes; the org charts differ. .partners is the partnership — law and accounting firms, consultancies, investment partnerships (LP/GP structures), corporate channel and alliance programs on name.partners ride the tradition of firms and funds ending in Partners, so surname + suffix reads out as the registered entity's full name; run by Identity Digital at about $8 to register and $57/yr to renew — a high-tier renewal, invisible against professional-services fees; and brand.partners as a company's partner-program front door is a classic worth a defensive registration. .group is the parent — holding companies, the parent brand of a multi-brand portfolio, family businesses on name.group read literally as \"the X Group\", far cleaner than a long xxgroup.com; it runs a second road too: landing pages for communities and interest groups read just as naturally; a few dollars first year with renewals under $20 — a smaller promo-to-renewal gap than most new gTLDs, good for long-term holding. The test: the organization is partners practicing — lawyers, accountants, consultants, fund GPs → .partners' nameplate tradition is truer; the organization is a group and its portfolio — holdcos, multi-brand parents, family businesses → .group's parent front door fits. Note .partners is plural and institutional — a solo consultant reads better on .pro or .expert; and partnership brands trade on trust, so front words should be surnames or steady words, never flippant. Shared notes: both are institutional front-door suffixes — business comes through reputation and relationships, so the domain's job is the formal site and trust anchor: publish entity credentials and the team.",
      pickA: ["Law & accounting firms", "Consultancies & fund GPs", "Investment partnerships (LP/GP)", "Partner programs (brand.partners)"],
      pickB: ["Holding companies & group sites", "Multi-brand portfolio parents", "Family business sites", "Community & club landing pages"],
    },
  },
  "support-vs-center": {
    slug: "support-vs-center",
    a: "support",
    b: "center",
    zh: {
      title: ".support 和 .center 怎么选：帮助入口与枢纽名号的对比",
      metaDescription: ".support 把「来这求助」写进域名，.center 把「这里是枢纽」写进域名。对比两个功能后缀的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都是功能后缀，功能不同。.support 是求助入口——产品帮助中心与知识库、客服与售后团队、IT 与技术支持服务商、互助社区用 name.support，用户凭直觉就会试 brand.support，主站在品牌域名、帮助中心在 brand.support，比 support.brand.com 子域名更短更顺，是最自解释的后缀之一；Identity Digital 运营，注册约 $7、续费约 $22/年，便宜档，任何品牌都值得防御注册。.center 是枢纽名号——帮助中心、资源与下载站、培训与考试中心、医疗与健身中心、社区服务中心用 name.center，业务本身叫「X 中心」的，后缀替你把名字说完；开发者场景同样顺手：产品的支持站、文档与状态页放在 help.center、docs.center 这类语义直白的域名上，与主域干净分离；注册首年几美元、续费约 $20/年，同为便宜档。判断标准：域名的功能是「求助的门」——客服、售后、技术支持 → .support 的直觉入口更准；主体本身是「一个中心」——线下场馆、培训机构、资源枢纽 → .center 的名号更配。帮助中心两边都能站：挂在品牌下的求助门偏 brand.support，独立运营的资源站偏 name.center。注意两个都是功能词不是品牌词——主站另备品牌域名，让它们做配套入口；.support 承诺了帮助，响应质量必须跟上，没人回的 .support 比没有更伤；.center 要留意英式 centre 拼写分流，必要时防御注册。共同注意：功能后缀的价值在「一看就懂」，落地页第一屏就要兑现域名的承诺。",
      pickA: ["产品帮助中心与知识库", "客服与售后团队入口", "IT 与技术支持服务商", "品牌防御注册（brand.support）"],
      pickB: ["线下中心类机构", "资源与下载枢纽", "文档与状态页（docs.center）", "培训与考试中心"],
    },
    en: {
      title: ".support vs .center: The Help Door or The Hub",
      metaDescription:
        ".support writes the help entrance into the address; .center names the hub. Compare the two function suffixes on semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both are function suffixes; the functions differ. .support is the help door — product help centers and knowledge bases, customer service and after-sales teams, IT and tech-support providers, mutual-aid communities on name.support give users the address they'd instinctively try: main site on the brand domain, help center on brand.support — shorter and smoother than a support.brand.com subdomain, one of the most self-explaining suffixes anywhere; run by Identity Digital at about $7 to register and $22/yr to renew — the cheap tier, an easy defensive registration for any brand. .center is the hub's name — help centers, resource and download hubs, training and testing centers, medical and fitness centers, community service centers on name.center get the suffix to finish the name when the business is literally \"the X Center\"; developers get a bonus pattern: support sites, docs and status pages read perfectly on semantically literal domains like help.center or docs.center, cleanly separated from the main domain; a few dollars first year and renewals around $20 — the same budget tier. The test: the domain's function is the door people knock on for help — customer service, after-sales, tech support → .support's instinctive entrance is truer; the entity itself is a center — physical venues, training bodies, resource hubs → .center's name fits. Help centers can stand on either: a brand's help door leans brand.support, an independently run resource hub leans name.center. Note both are function words, not brand words — keep a separate main domain and let these be companion doors; .support promises help, so response quality must follow — an unanswered .support hurts more than none; and .center should mind the centre spelling split for Commonwealth audiences. Shared notes: a function suffix's value is instant clarity — the first screen must deliver what the domain promises.",
      pickA: ["Product help centers & knowledge bases", "Customer service & after-sales doors", "IT & tech-support providers", "Defensive registration (brand.support)"],
      pickB: ["Physical center-style institutions", "Resource & download hubs", "Docs & status pages (docs.center)", "Training & testing centers"],
    },
  },
  "website-vs-site": {
    slug: "website-vs-site",
    a: "website",
    b: "site",
    zh: {
      title: ".website 和 .site 怎么选：完整单词与中性白纸的对比",
      metaDescription: ".website 是普通人一听就懂的完整单词，.site 是不带任何暗示的中性白纸。对比 Radix 同门两个通用后缀的语感、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "同门兄弟（都由 Radix 运营），差别全在语感。.website 是完整单词——个人主页与作品集、小微企业官网、产品落地页用 name.website，念出来就是「某某的网站」，非技术人群零解释成本，面向大众的小生意用它更稳；注册约 $2、续费约 $21/年——首年是全站最便宜档之一，但续费是首年十倍，长期持有前先想清楚。.site 是中性白纸——不预设行业、不限定气质，作品集、文档站、社区、小工具都装得下，docs、wiki、lab 类功能词组合在它下面读起来最自然；首年常低至一两美元，库存几乎无限，同样注意首年与续费的价差。判断标准：受众是普通消费者、要的是「一听就懂」——本地小店、个人主页、面向大众的落地页 → .website 的完整单词更亲切；受众是网民与开发者、要的是「短与中性」——工具站、文档站、快速试错的副项目 → .site 少两个音节更利落。注意 .website 七个字母偏长，主体名务必选短词；.site 中性不加分，名字本身要独特或直接写清用途。共同注意：两个都是便宜通用后缀，历史上垃圾站偏多，新站要靠真实内容与 HTTPS 尽快建立信任；两个都有首年低价钩子，续费才是真实成本。",
      pickA: ["个人主页与作品集", "本地小店与小微企业官网", "面向大众的产品落地页", "非技术受众（一听就懂）"],
      pickB: ["工具站与文档站（docs/wiki/lab）", "快速试错的副项目", "主品牌的配套子项目", "想要更短更中性的域名"],
    },
    en: {
      title: ".website vs .site: The Full Word or The Blank Canvas",
      metaDescription:
        ".website is the complete word everyone parses instantly; .site is the neutral blank canvas with zero signal. Compare Radix's two generalist suffixes on tone, pricing and fit, then hunt names available on both.",
      verdict:
        "Siblings from the same registry (both run by Radix); the whole difference is register. .website is the complete word — personal pages and portfolios, small-business sites, product landing pages on name.website read out literally as \"so-and-so's website\", zero explanation cost for non-technical audiences, so consumer-facing small businesses read safer here; about $2 to register and $21/yr to renew — one of the cheapest first years anywhere, but a 10x renewal jump, so think before holding long. .site is the blank canvas — no industry assumption, no personality bias: portfolios, doc sites, communities and small tools all fit, and function words like docs, wiki and lab combine most naturally under it; first-year pricing often drops to a dollar or two with effectively unlimited inventory — watch the same intro-vs-renewal gap. The test: the audience is everyday consumers and the goal is instant comprehension — local shops, personal pages, mass-market landing pages → .website's full word is friendlier; the audience is web-native and the goal is short and neutral — tool sites, doc sites, quick experiments → .site saves two syllables and reads cleaner. Note .website runs seven letters, so keep the front word short; and .site's neutrality adds nothing — the name must be distinctive or state the purpose outright. Shared notes: both are cheap generalist suffixes that historically attract spam, so a new site must earn trust fast with real content and HTTPS; and both dangle first-year hooks — the renewal is the real cost.",
      pickA: ["Personal pages & portfolios", "Local shops & small-business sites", "Mass-market landing pages", "Non-technical audiences (instant parse)"],
      pickB: ["Tool & doc sites (docs/wiki/lab)", "Quick experiments & side projects", "Companion projects to a main brand", "Shorter, fully neutral address"],
    },
  },
  "technology-vs-tech": {
    slug: "technology-vs-tech",
    a: "technology",
    b: "tech",
    zh: {
      title: ".technology 和 .tech 怎么选：正式全称与创业短音的对比",
      metaDescription: ".technology 是拼完整的正式全称，.tech 是短促的创业感缩写。对比两个科技后缀的语气、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "同一个词的两种念法。.technology 是正式全称——科技公司官网、面向政企客户的技术公司、深科技与硬科技品牌、研究机构用 name.technology，读起来正式稳重，公司全名带 Technology 的（XX Technology Co.）用 brand.technology 等于把注册名直接搬上域名；Identity Digital 运营，注册约 $10、续费约 $23/年，温和档，续费反而比 .tech 便宜不少。.tech 是创业短音——初创公司、开发者产品、黑客松项目与科技媒体用 name.tech，短促有冲劲，科技圈认知度在新后缀里名列前茅；注册便宜但续费明显更高，长期持有前先算账。判断标准：品牌气质是「正式与分量」——政企客户、深科技、研究机构 → .technology 的全称更压得住；品牌气质是「轻快与冲劲」——创业公司、开发者工具、消费级科技产品 → .tech 的短音更来电。注意 .technology 十个字母是全站最长档之一，主体名必须够短，两三个音节封顶，且配套短域名跳转是常见做法；.tech 反过来赢在短，但正式场合略显随意。共同注意：两个都是行业词后缀，域名说了「科技」，产品就要真有技术含量——落地页放清楚产品与团队，别让后缀空转。",
      pickA: ["面向政企客户的技术公司", "深科技与硬科技品牌", "公司全名带 Technology 的企业", "研究机构与技术团队官网"],
      pickB: ["初创公司与开发者产品", "黑客松项目与科技媒体", "轻快的消费级科技品牌", "想要更短更好念的域名"],
    },
    en: {
      title: ".technology vs .tech: The Full Name or The Startup Clip",
      metaDescription:
        ".technology spells the formal full word; .tech is the clipped startup syllable. Compare the two tech suffixes on tone, pricing and fit, then hunt names available on both.",
      verdict:
        "Two pronunciations of the same word. .technology is the formal full name — corporate tech sites, firms selling to enterprise and government, deep-tech and hard-tech brands, research institutes on name.technology read stately, and companies whose registered name ends in Technology (XX Technology Co.) can put the full name straight into brand.technology; run by Identity Digital at about $10 to register and $23/yr to renew — the mild tier, and notably cheaper to renew than .tech. .tech is the startup clip — startups, developer products, hackathon projects and tech media on name.tech sound quick and punchy, with recognition near the top of the new-TLD class in tech circles; cheap to register but distinctly pricier to renew, so do the math before holding long. The test: the brand's register is formal and weighty — enterprise clients, deep tech, research bodies → .technology's full word carries it; the brand's register is light and fast — startups, dev tools, consumer tech → .tech's clip has the spark. Note .technology runs ten letters — among the longest suffixes anywhere — so the front word must stay very short, and a short redirect domain is common practice; .tech wins on brevity but reads casual in formal settings. Shared notes: both are industry-word suffixes — the domain says technology, so the product must actually have some: put the product and team front and center, and don't let the suffix idle.",
      pickA: ["Firms selling to enterprise & government", "Deep-tech & hard-tech brands", "Companies named XX Technology Co.", "Research institutes & engineering teams"],
      pickB: ["Startups & developer products", "Hackathon projects & tech media", "Playful consumer tech brands", "Shorter, punchier address"],
    },
  },
  "community-vs-club": {
    slug: "community-vs-club",
    a: "community",
    b: "club",
    zh: {
      title: ".community 和 .club 怎么选：开放家园与会员俱乐部的对比",
      metaDescription: ".community 说「这里是一群人的开放家园」，.club 说「这里是有门槛的俱乐部」。对比两个社群后缀的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都是「一群人」的后缀，门的开法不同。.community 是开放家园——兴趣社群与论坛、开源项目的用户社区、本地社区组织用 name.community，访客点开之前就知道「这里欢迎所有人」，品牌或项目开专属社区站（主站放官网、brand.community 放论坛）是它的经典用法，「地名 + .community」在英文里还是通顺短语（riverside.community 的语感）；Identity Digital 运营，注册约 $8、续费约 $37/年，续费中偏上档。.club 是会员俱乐部——付费会员社群、订阅制服务、球队与粉丝会、酒类与咖啡的订阅盒子用 name.club，自带「加入我们」的号召与一点点排他感，会员制商业模式用它一眼点题；注册量长期位居新后缀前列，认知度高，首年常见低价、续费温和。判断标准：社群的气质是「开放与归属」——人人可进的论坛、开源社区、街区组织 → .community 的家园感更准；社群的气质是「会员与身份」——付费入会、订阅制、粉丝会 → .club 的门槛感更配。注意 .community 九个字母偏长，主体名务必选短词；.club 短而好念，但「俱乐部」的轻快语气撑不起严肃机构，那种场景 .org 更合身。共同注意：两个后缀都承诺了「里面有人」，挂上去就要有真实的成员活动——空壳社区比没有更伤品牌；域名的角色是家园的门牌，拉新靠内容与口碑。",
      pickA: ["开放论坛与兴趣社群", "开源项目的用户社区（brand.community）", "本地社区与街区组织", "地名社区站（riverside.community）"],
      pickB: ["付费会员社群与订阅制", "球队、粉丝会与同好会", "订阅盒子（咖啡、酒类）", "想要短而好念的社群域名"],
    },
    en: {
      title: ".community vs .club: The Open Home or The Members' Door",
      metaDescription:
        ".community promises an open home for everyone; .club promises a members' door with a velvet rope. Compare the two group suffixes on semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both are people suffixes; the door swings differently. .community is the open home — interest groups and forums, open-source user communities, local neighborhood organizations on name.community tell visitors \"everyone's welcome\" before the click; the classic play is the dedicated community site (main site on the brand domain, forum on brand.community), and place + .community is a natural English phrase (the riverside.community cadence); run by Identity Digital at about $8 to register and $37/yr to renew — an upper-mid renewal tier. .club is the members' door — paid membership groups, subscription services, teams and fan clubs, coffee and wine subscription boxes on name.club carry a built-in \"join us\" with a hint of exclusivity, the instant fit for membership business models; long among the highest-volume new TLDs, so recognition is strong, with cheap first years and mild renewals. The test: the group's spirit is openness and belonging — public forums, open-source communities, neighborhood orgs → .community's home reads truer; the group's spirit is membership and identity — paid access, subscriptions, fan clubs → .club's velvet rope fits. Note .community runs nine letters, so keep the front word short; .club is short and snappy but too playful for solemn institutions — that's .org turf. Shared notes: both suffixes promise people inside — real member activity must follow, and a ghost town hurts the brand more than none; the domain is the nameplate on the door, while growth comes from content and word of mouth.",
      pickA: ["Open forums & interest groups", "Open-source communities (brand.community)", "Local & neighborhood organizations", "Place-based sites (riverside.community)"],
      pickB: ["Paid membership & subscriptions", "Teams, fan clubs & societies", "Subscription boxes (coffee, wine)", "Short, snappy group address"],
    },
  },
  "education-vs-academy": {
    slug: "education-vs-academy",
    a: "education",
    b: "academy",
    zh: {
      title: ".education 和 .academy 怎么选：行业大词与机构名号的对比",
      metaDescription: ".education 是教育行业的大词，.academy 是一所学院的名号。对比两个教育后缀的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都姓教育，格局不同。.education 是行业大词——教育平台与 EdTech 产品、教育媒体与家长资讯站、学校的对外项目用 name.education，做平台、做媒体、做行业级产品用它格局更大，它也是 .edu 门槛（只对美国认证高校开放）之外最正式的平替；Identity Digital 运营，注册约 $21、续费约 $28/年——注册续费接近同价，没有低价钩子也没有续费陷阱，成本透明。.academy 是机构名号——培训机构、在线课程品牌、编程训练营、企业大学用 name.academy，读出来就是「某某学院」，英文里机构以 Academy 结尾是命名传统，「品牌 + .academy」等于把机构全名搬上域名；注册约 $12、续费约 $38/年，首年便宜、续费中偏上。判断标准：做的是「行业与平台」——聚合课程的平台、教育媒体、EdTech 工具 → .education 的大词更配；做的是「一所学院」——有名字、有老师、有课程体系的教学品牌 → .academy 的名号更准。两个还能是同一盘生意的两层：平台用 .education，平台上的旗舰课程品牌用 .academy。注意 .education 九个字母偏长，主体名选短词；.academy 语气正经，兴趣向轻课程用 .school 或 .training 更松弛。共同注意：教育是强信任行业，后缀不是资质——办学许可、师资展示与学员评价才是转化关键，域名只负责把「做教育的」写在门口。",
      pickA: ["教育平台与 EdTech 产品", "教育媒体与家长资讯站", "学校对外项目与公开课", "想要成本透明的长期持有"],
      pickB: ["培训机构与在线课程品牌", "编程训练营与技能学院", "企业大学与内训学院", "机构名以「学院」收尾的品牌"],
    },
    en: {
      title: ".education vs .academy: The Industry Word or The Institution's Name",
      metaDescription:
        ".education is the industry's umbrella word; .academy is one institution's nameplate. Compare the two education suffixes on semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both belong to education; the scale differs. .education is the industry word — education platforms and EdTech products, education media and parent resources, schools' outreach programs on name.education carry more scale for platforms, media and industry-level products, and it's the most formal substitute outside the .edu gate (restricted to accredited US higher education); run by Identity Digital at about $21 to register and $28/yr to renew — nearly the same both ways: no cheap hook, no renewal trap, transparent cost. .academy is the institution's name — training providers, online course brands, coding bootcamps, corporate universities on name.academy read out as \"the X Academy\", riding the naming tradition of institutions ending in Academy, so brand + .academy puts the full institutional name into the address; about $12 to register and $38/yr to renew — cheap first year, upper-mid renewal. The test: the business is an industry or platform — course marketplaces, education media, EdTech tools → .education's umbrella fits; the business is one school — a named teaching brand with faculty and curriculum → .academy's nameplate is truer. They can even be two layers of one business: the platform on .education, its flagship course brand on .academy. Note .education runs nine letters, so keep the front word short; and .academy's register is proper — casual hobby courses relax better on .school or .training. Shared notes: education is a high-trust business and the suffix is not a credential — licenses, teacher credentials and student reviews drive conversion; the domain just writes \"in education\" on the door.",
      pickA: ["Education platforms & EdTech products", "Education media & parent resources", "School outreach & open courses", "Transparent long-term holding cost"],
      pickB: ["Training providers & course brands", "Coding bootcamps & skill academies", "Corporate universities", "Brands named \"the X Academy\""],
    },
  },
  "training-vs-coach": {
    slug: "training-vs-coach",
    a: "training",
    b: "coach",
    zh: {
      title: ".training 和 .coach 怎么选：练什么与谁来带的对比",
      metaDescription: ".training 把「练什么」写进域名，.coach 把「谁来带」写进域名。对比两个技能后缀的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都在技能生意里，主语不同。.training 说的是事——职业技能培训机构、企业内训与团队赋能、健身与体能课程、认证备考用 name.training，英文里「对象 + training」本来就是通顺短语（dog training、strength training 的语感），语义 SEO 红利实打实；Identity Digital 运营，注册约 $12、续费约 $33/年，中档。.coach 说的是人——健身与运动教练、人生与职业教练、企业高管教练、球队教练组用 name.coach，「名字 + .coach」读出来就是「某某教练」，个人品牌一秒立住，教练这个身份直接写进域名比任何标语都省事；注册约 $11、续费约 $62/年——续费高档，个人服务业务按客单价看通常无感，纯展示站要掂量。判断标准：卖的是「课程与体系」——机构、内训、认证备考、标准化课程 → .training 的事更准；卖的是「这个人」——一对一带练、私教、顾问式服务 → .coach 的人更点题。两个常常是同一门生意的两层：机构用 .training，机构里的明星教练用 .coach 做个人站。注意 .training 八个字母不算短，主体名选短词更利落；.coach 在英文里另有「长途大巴」与品牌 Coach 的歧义，语境不清时配一句副标题。共同注意：技能生意承诺效果，页面要有课程大纲、案例与结果数据——光喊口号转化不动；本地需求强的品类（健身、青训）记得把城市词做进主体名或页面。",
      pickA: ["职业技能培训机构", "企业内训与团队赋能", "认证备考与标准化课程", "「技能词 + .training」的语义红利"],
      pickB: ["健身与运动私教", "人生与职业教练", "高管教练与顾问式服务", "教练个人品牌站（name.coach）"],
    },
    en: {
      title: ".training vs .coach: The Drill or The Person",
      metaDescription:
        ".training writes what you practice into the address; .coach writes who leads you. Compare the two skill suffixes on semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both live in the skills business; the subject differs. .training names the thing — vocational skills providers, corporate training and team enablement, fitness and strength programs, certification prep on name.training ride the fact that target + training is already a natural English phrase (dog training, strength training), a real semantic-SEO dividend; run by Identity Digital at about $12 to register and $33/yr to renew — the mid tier. .coach names the person — fitness and sports coaches, life and career coaches, executive coaches, team coaching staffs on name.coach read out as \"Coach So-and-so\": the personal brand stands up in one second, the identity written into the address better than any tagline; about $11 to register and $62/yr to renew — a high-tier renewal, invisible against personal-service rates but worth weighing for a pure brochure site. The test: you sell the curriculum and system — institutions, corporate programs, cert prep, standardized courses → .training's thing is truer; you sell this person — one-on-one sessions, personal training, advisory work → .coach's person hits harder. They're often two layers of one business: the institution on .training, its star coach's personal site on .coach. Note .training runs eight letters, so keep the front word tight; and coach in English also means the long-distance bus and the handbag brand — add a clarifying subtitle where context is thin. Shared notes: the skills business promises outcomes — pages need syllabi, case studies and results data, slogans alone won't convert; and strongly local categories (fitness, youth sports) should work the city into the name or the page.",
      pickA: ["Vocational training providers", "Corporate training & team enablement", "Certification prep & standard courses", "Semantic wins (skill + .training)"],
      pickB: ["Fitness & sports coaches", "Life & career coaches", "Executive coaching & advisory", "Personal brand sites (name.coach)"],
    },
  },
  "love-vs-me": {
    slug: "love-vs-me",
    a: "love",
    b: "me",
    zh: {
      title: ".love 和 .me 怎么选：情感宣言与个人名片的对比",
      metaDescription: ".love 把情感写进域名，.me 把「我」写进域名。对比两个个人向后缀的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都常用于个人站，说的话不同。.love 是情感宣言——婚礼与求婚站、情侣纪念页、公益与慈善项目、粉丝应援站用 name.love，是极少数「读出来就有情绪」的后缀，两个经典语法：「名字 + .love」（emma.love 的语感，婚礼站标准写法）和「我爱的东西 + .love」（coffee.love、cats.love），后者让品类词直接变成情感宣言；注册约 $9、续费约 $23/年，温和档。.me 是个人名片——个人主页与简历站、开发者作品集、独立创作者的主站用 name.me，「about.me 时代」以来它就是个人域名的代名词，英文里还能玩「动词 + .me」的祈使句（hire.me、read.me 的节奏），黑山国家域但全球开放注册；首年常见低价、续费温和，个人长期持有无压力。判断标准：站点的主题是「一段感情或一份热爱」——婚礼、纪念、公益、应援 → .love 的情绪浓度无可替代；站点的主题是「我这个人」——简历、作品集、个人品牌 → .me 的名片属性更准。注意 .love 情感浓度是双刃剑，严肃 B2B 与金融用它明显违和，婚礼与纪念站过了档期记得续期或做成永久纪念页，别让 .love 域名落到别人手里；.me 中性百搭但不自带情绪，表白与纪念场景压不过 .love。共同注意：两个都是「个人叙事」后缀，域名只负责开场——内容与更新频率才决定访客会不会回来。",
      pickA: ["婚礼与求婚站（名字 + .love）", "情侣与家庭纪念页", "公益与慈善项目", "品类情感宣言（coffee.love）"],
      pickB: ["个人主页与简历站", "开发者与创作者作品集", "个人品牌主站", "祈使句玩法（hire.me）"],
    },
    en: {
      title: ".love vs .me: The Declaration or The Calling Card",
      metaDescription:
        ".love writes the feeling into the address; .me writes the person. Compare the two personal suffixes on semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both serve personal sites; they say different things. .love is the declaration — wedding and proposal sites, couple and family tribute pages, charities, fan projects on name.love ride one of the very few suffixes that lands an emotion on first read, with two classic grammars: name + .love (the emma.love cadence, the wedding-site standard) and thing-I-love + .love (coffee.love, cats.love), which turns a plain category word into a declaration; about $9 to register and $23/yr to renew — the mild tier. .me is the calling card — personal pages and résumé sites, developer portfolios, independent creators' home bases on name.me carry the suffix that has meant \"personal domain\" since the about.me era, plus the imperative trick of verb + .me (the hire.me, read.me rhythm); Montenegro's country code, open to everyone worldwide, with cheap first years and mild renewals — easy to hold long as an individual. The test: the site is about a feeling or a passion — weddings, tributes, charities, fandom → .love's emotional voltage is irreplaceable; the site is about you — résumé, portfolio, personal brand → .me's calling card is truer. Note .love's voltage cuts both ways — sober B2B and finance read plainly wrong here, and wedding or tribute sites have a shelf life: renew or convert to a permanent keepsake page, and never let a .love domain lapse into a stranger's hands; .me is neutral and versatile but carries no emotion of its own — for declarations and tributes it can't outplay .love. Shared notes: both are personal-narrative suffixes, and the domain only opens the story — content and cadence decide whether visitors return.",
      pickA: ["Wedding & proposal sites (name + .love)", "Couple & family tribute pages", "Charities & causes", "Category declarations (coffee.love)"],
      pickB: ["Personal pages & résumé sites", "Developer & creator portfolios", "Personal brand home bases", "Imperative plays (hire.me)"],
    },
  },
  "beauty-vs-salon": {
    slug: "beauty-vs-salon",
    a: "beauty",
    b: "salon",
    zh: {
      title: ".beauty 和 .salon 怎么选：行业大词与门店招牌的对比",
      metaDescription: ".beauty 是美业的行业大词，.salon 是一家店的招牌。对比两个美业后缀的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都在美业里，说话的对象不同。.beauty 是行业大词——美妆品牌与电商、美妆博主与教程站、皮肤管理与造型工作室用 name.beauty，行业定位一眼即明，做品牌、做内容、做电商用它格局更大；XYZ 注册局运营（旗下还有 .hair、.skin、.makeup 一整套美妆系后缀），欧莱雅集团都注册过多个 .beauty 做品牌活动站；注册约 $2、续费约 $13/年——首年近乎白送、续费温和，美妆系后缀里性价比最高。.salon 是门店招牌——美发店、美甲店、皮肤管理与美容院、宠物美容店用 name.salon，读出来就是一家「有椅子有镜子有预约本」的店，到店服务型生意用它更像招牌；它还保留「文艺沙龙」的老义，读书会与播客沙龙用它也优雅；Identity Digital 运营，注册约 $11、续费约 $46/年——续费中偏上，对客单价与复购看这不算什么。判断标准：做的是「品牌与内容」——美妆电商、博主、行业平台 → .beauty 的大词更配；做的是「一家店」——理发店、美甲店、美容院这类要客人上门的生意 → .salon 的招牌感更准。两个还能是同一盘生意的两层：品牌用 .beauty，品牌旗下门店用 .salon。注意 .beauty 六个字母不算短、.salon 只有五个字母，两边主体名都选短词；.beauty 便宜档要靠真实内容快速建立信任。共同注意：美业是视觉行业，域名只是入口——站内质感、作品图与预约转化才是生意本身。",
      pickA: ["美妆品牌与电商", "美妆博主与教程站", "行业平台与内容站", "预算敏感的轻量试错"],
      pickB: ["美发美甲与美容院", "皮肤管理与造型工作室", "宠物美容店", "读书会与文艺沙龙"],
    },
    en: {
      title: ".beauty vs .salon: The Industry Word or The Shop Sign",
      metaDescription:
        ".beauty is the beauty industry's umbrella word; .salon is one shop's sign. Compare the two beauty suffixes on semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both live in the beauty business; they address different people. .beauty is the industry word — cosmetics brands and e-commerce, beauty creators and tutorial sites, skin and styling studios on name.beauty state the industry on first read, carrying more scale for brands, content and commerce; run by the XYZ registry (alongside its .hair, .skin and .makeup family), with L'Oréal already using multiple .beauty domains for campaign sites; about $2 to register and $13/yr to renew — a nearly free first year and a mild renewal, the best value in the beauty family. .salon is the shop sign — hair studios, nail bars, skin clinics and pet groomers on name.salon read as a place with chairs, mirrors and an appointment book, so walk-in service businesses wear it like a storefront; it also keeps the older artsy sense, so reading circles and podcast salons wear it elegantly too; run by Identity Digital at about $11 to register and $46/yr to renew — an upper-mid renewal, trivial against beauty ticket sizes and repeat visits. The test: the business is a brand or content play — beauty commerce, creators, industry platforms → .beauty's umbrella fits; the business is one shop — a place clients visit → .salon's sign is truer. They can even be two layers of one business: the brand on .beauty, its shops on .salon. Note .beauty runs six letters and .salon five, so keep the front word short on both; and .beauty's bargain tier must earn trust fast with real content. Shared notes: beauty is a visual industry — the domain only opens the door; on-site polish, portfolio shots and booking conversion are the business itself.",
      pickA: ["Cosmetics brands & e-commerce", "Beauty creators & tutorial sites", "Industry platforms & content", "Budget-friendly experiments"],
      pickB: ["Hair, nail & beauty studios", "Skin clinics & styling studios", "Pet grooming shops", "Reading circles & creative salons"],
    },
  },
  "fashion-vs-style": {
    slug: "fashion-vs-style",
    a: "fashion",
    b: "style",
    zh: {
      title: ".fashion 和 .style 怎么选：行业专词与审美泛词的对比",
      metaDescription: ".fashion 锁定时装行业，.style 泛指一切风格。对比两个时尚系后缀的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都姓时尚，范围不同。.fashion 是行业专词——服装品牌与买手店、独立设计师工作室、时尚电商与租赁平台用 name.fashion，后缀本身就是行业宣言，做服装的用它指向最准；GoDaddy Registry 运营，注册约 $26、续费约 $26/年——注册续费同价，没有低价钩子也没有续费陷阱，预算一眼算到底，首年即全价也意味着它更适合认真做的品牌而非随手占名。.style 是审美泛词——穿搭博主与造型师、形象顾问、生活方式媒体用 name.style，「名字 + .style」念出来就是「某某的风格」；它比 fashion 宽得多：家居、文字、甚至企业的 brand style guide（brand.style 是设计圈经典用法）都装得下；Identity Digital 运营，注册约 $7、续费约 $31/年，温和档。判断标准：做的是「时装这个行业」——品牌、买手店、时尚电商 → .fashion 的专词更准；做的是「风格这件事」——个人穿搭、形象顾问、生活方式内容 → .style 的泛词更灵活。个人品牌几乎总是 .style 更顺：七个字母的 fashion 配人名偏重，五个字母的 style 轻盈得多。注意 .fashion 七个字母偏长，主体名务必短；.style 承诺审美，站点视觉必须跟上——挂 .style 的网站设计粗糙比普通域名更减分。共同注意：时尚行业视觉即正义，首屏大图与品牌摄影才是气场来源，域名只负责把「懂审美」写在门口。",
      pickA: ["服装品牌与买手店", "独立设计师工作室", "时尚电商与租赁平台", "想要注册续费同价的透明成本"],
      pickB: ["穿搭博主与造型师", "形象顾问与个人品牌", "生活方式媒体", "品牌规范站（brand.style）"],
    },
    en: {
      title: ".fashion vs .style: The Industry Word or The Aesthetic Word",
      metaDescription:
        ".fashion locks onto the apparel industry; .style covers every kind of taste. Compare the two fashion suffixes on semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both belong to fashion; the scope differs. .fashion is the industry word — apparel brands and boutiques, independent designer studios, fashion e-commerce and rental platforms on name.fashion make the suffix itself the industry statement, the truest pick for anyone actually making clothes; run by GoDaddy Registry at about $26 to register and $26/yr to renew — the same both ways: no cheap hook, no renewal trap, and a full-price first year that filters for serious brands over casual squatting. .style is the aesthetic word — outfit creators and stylists, image consultants, lifestyle media on name.style read out as \"so-and-so's style\"; it stretches far wider than fashion: interiors, writing, even corporate brand style guides (brand.style is a design-world classic) all fit; run by Identity Digital at about $7 to register and $31/yr to renew — the mild tier. The test: the business is the apparel industry — brands, boutiques, fashion commerce → .fashion's precision wins; the business is taste itself — personal styling, consulting, lifestyle content → .style's flexibility wins. For personal brands .style almost always reads better: seven-letter fashion weighs a name down, five-letter style keeps it light. Note .fashion runs seven letters, so keep the front word short; and .style promises aesthetics — a rough-looking site under .style loses more points than under a plain domain. Shared notes: fashion is a visuals-first industry — hero imagery and brand photography carry the presence; the domain just writes \"good taste\" on the door.",
      pickA: ["Apparel brands & boutiques", "Independent designer studios", "Fashion e-commerce & rental", "Transparent same-price renewals"],
      pickB: ["Outfit creators & stylists", "Image consultants & personal brands", "Lifestyle media", "Brand style guides (brand.style)"],
    },
  },
  "work-vs-works": {
    slug: "work-vs-works",
    a: "work",
    b: "works",
    zh: {
      title: ".work 和 .works 怎么选：一字之差的职业与作品分工",
      metaDescription: ".work 说的是工作与职业，.works 说的是作品与「能用」。对比一字之差的两个后缀的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "一个 s 的差别，分工完全不同。.work 说的是工作本身——招聘与求职站、自由职业者、远程办公与协作工具、职业培训用 name.work，英文里「对象 + work」本来就是通顺短语（remote.work、find.work 的语感），动词名词两读，域名读出来就是行动号召；GoDaddy Registry 运营，注册约 $2、续费约 $11/年——首年白菜价，续费也是全站最便宜档之一，长期持有毫无压力。.works 说的是作品与运转——设计工坊、木工坊、独立开发者的项目集用 name.works 读起来像老字号招牌（design works、iron works 的传统），另一层双关是「it works（能用）」——实干型工具产品用「品牌 + .works」自带「这东西真的能用」的口播广告（flow.works 式）；Identity Digital 运营，首年十几二十元、续费两百多元，典型新顶级域结构。判断标准：主题是「工作与职业」——招聘、求职、劳务、职业工具 → 单数 .work 更点题；主题是「作品与产品」——工作室、作品集、开发者工具 → 复数 .works 更传神。价格也拉开差距：.work 续费便宜一半以上，占多个名字或长期持有时账要算清。注意 .work 超低价后缀历史上垃圾站比例高，新站要靠真实内容与 HTTPS 快速建立信任；.works 口播时复数 s 要念清，别让用户少打一个字母落到别人手里——预算允许时两个都注册做跳转最省心。共同注意：两个都是四五个字母的短后缀，主体名再选短词，整个域名才利落。",
      pickA: ["招聘与求职站", "自由职业者与劳务平台", "远程办公与协作工具", "超低续费的长期持有"],
      pickB: ["设计与手作工作室", "个人与团队作品集", "开发者工具（it works 双关）", "工程与制造类品牌"],
    },
    en: {
      title: ".work vs .works: One Letter Between the Job and the Craft",
      metaDescription:
        ".work names the job and the career; .works names the craft and \"it works\". Compare the one-letter-apart suffixes on semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "One letter, two entirely different jobs. .work names work itself — job boards and hiring sites, freelancers, remote-work and collaboration tools, vocational training on name.work ride the fact that target + work is already a natural English phrase (the remote.work, find.work cadence), readable as noun or verb, so the domain doubles as a call to action; run by GoDaddy Registry at about $2 to register and $11/yr to renew — a bargain first year and one of the cheapest renewals anywhere, painless to hold forever. .works names the craft and the claim — design shops, woodworkers and indie developers' project collections on name.works read like a heritage shop sign (the design works, iron works tradition), with the second pun being \"it works\": pragmatic tool products on brand + .works carry a built-in word-of-mouth ad (the flow.works play); run by Identity Digital with a cheap first year and a renewal in the typical new-TLD tier. The test: the theme is jobs and careers — hiring, gigs, labor platforms, career tools → singular .work hits harder; the theme is output and products — studios, portfolios, developer tools → plural .works tells the story. Price splits them too: .work renews for a fraction, worth weighing when holding several names long-term. Note .work's bargain tier historically attracts spam, so a new site must earn trust fast with real content and HTTPS; and .works' plural s must be enunciated — don't let a dropped letter send users to someone else; register both and redirect when budget allows. Shared notes: both suffixes are short, so keep the front word short too and the whole domain stays crisp.",
      pickA: ["Job boards & hiring sites", "Freelancers & labor platforms", "Remote-work & collaboration tools", "Ultra-cheap long-term renewals"],
      pickB: ["Design & maker studios", "Personal & team portfolios", "Developer tools (the \"it works\" pun)", "Engineering & manufacturing brands"],
    },
  },
  "sale-vs-shop": {
    slug: "sale-vs-shop",
    a: "sale",
    b: "shop",
    zh: {
      title: ".sale 和 .shop 怎么选：促销档期与常设店面的对比",
      metaDescription: ".sale 喊的是「特价中」，.shop 挂的是「营业中」。对比两个电商后缀的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都在卖货，时态不同。.sale 是促销档期——品牌大促活动站、折扣电商与清仓频道、二手转卖与房产车辆出售页用 name.sale，域名本身就在喊「特价」：英文里「on sale」「for sale」妇孺皆知，brand.sale 读出来就是「某某在打折」，大促季给主站配一个短域名做活动落地页，比长长的 /promotions 路径好记好投放；Identity Digital 运营，注册约 $4、续费约 $31/年——首年便宜续费中偏上，短期活动用一季即弃毫无压力。.shop 是常设店面——独立站、品牌官方商店、垂直品类电商用 name.shop，看到域名就知道这是一家店，「品牌 + .shop」本身就是行动号召；也常做主品牌的商店子站——主站 .com、商店同名 .shop，分工清晰；首年常有低价促销但续费明显更高，长期持有前看清续费价。判断标准：页面有「档期」——大促、清仓、出售单件资产 → .sale 的紧迫感是武器；页面是「店」——常年营业、持续上新 → .shop 的店面感才对。最常见的正确用法是配合：店开在 .shop（或主流后缀），大促季启用 brand.sale 做活动页，档期结束 301 回主站。注意 .sale 常年挂着反而稀释促销力度，且折扣语境与高端定位相冲，奢侈品牌慎用；.shop 在部分用户认知里新后缀感仍强于 .com，大额客单价场景建议搭配主流后缀。共同注意：两个都是电商后缀，信任要素（HTTPS、退换货政策、真实评价）比域名更决定转化。",
      pickA: ["品牌大促活动站", "折扣电商与清仓频道", "二手转卖平台", "房产车辆出售页（house.sale）"],
      pickB: ["独立站与 DTC 电商", "品牌官方商店子站", "垂直品类电商", "线下店铺线上入口"],
    },
    en: {
      title: ".sale vs .shop: The Limited-Time Event or The Open Store",
      metaDescription:
        ".sale shouts \"on sale now\"; .shop hangs the \"open\" sign. Compare the two commerce suffixes on semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both sell; the tense differs. .sale is the limited-time event — brand promo sites, discount and clearance channels, second-hand resale and property or vehicle listings on name.sale make the domain itself shout \"on sale\": the phrases on sale and for sale are universal English, brand.sale reads as \"so-and-so is discounting\", and a short campaign domain beats a long /promotions path for recall and ad spend; run by Identity Digital at about $4 to register and $31/yr to renew — cheap first year, upper-mid renewal, painless for a one-season campaign. .shop is the open store — independent stores, official brand shops and vertical e-commerce on name.shop read as a store on sight, with brand + .shop working as a built-in call to action; it also pairs classically as the store companion to a .com main site; first years are often discounted while renewals run notably higher, so check the renewal before holding long. The test: the page has a run date — a big promo, a clearance, a single asset for sale → .sale's urgency is the weapon; the page is a store — open year-round, restocking continuously → .shop's storefront is right. The most common correct play is both: the store lives on .shop (or a mainstream TLD), brand.sale opens for the campaign season and 301s home after. Note a permanent .sale dilutes the urgency it trades on, and the discount register clashes with luxury positioning; .shop still reads newer than .com to part of the audience, so pair big-ticket businesses with a mainstream suffix. Shared notes: both are commerce suffixes — trust signals (HTTPS, return policy, real reviews) decide conversion more than the domain does.",
      pickA: ["Brand promo campaign sites", "Discount & clearance channels", "Second-hand resale platforms", "Asset listings (house.sale)"],
      pickB: ["Independent & DTC stores", "Official brand shop companions", "Vertical e-commerce", "Offline shops going online"],
    },
  },
  "help-vs-support": {
    slug: "help-vs-support",
    a: "help",
    b: "support",
    zh: {
      title: ".help 和 .support 怎么选：短口语与全称的求助入口对比",
      metaDescription: ".help 是四个字母的短口语，.support 是七个字母的正式全称。对比两个求助入口后缀的语气、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都是给品牌配求助入口的功能后缀，差在语气与账本。.help 短而口语——四个字母，用户遇到问题时下意识就能拼出 brand.help，产品帮助中心、工具教程站、公益求助项目（refugees.help 式天然短语）用它传播零成本；Internet Naming Co. 运营，注册约 $2、续费约 $26/年——首年近乎白送但差价十倍以上，占名前想清楚是长期资产还是一次性试验。.support 长而正式——七个字母写全了「支持」，产品帮助中心与知识库、客服与售后团队、IT 与技术支持服务商用 name.support，企业级语境里它比 help 更庄重，独立服务商用「品类 + .support」（printer、mac 类）接单也顺；Identity Digital 运营，注册约 $7、续费约 $22/年——注册续费差距小，长期持有反而比 .help 便宜，保护性注册毫无压力。判断标准：品牌短、面向消费者、要的是「顺口好拼」→ .help 的四个字母更快；企业级产品、B2B 客服、技术支持服务商 → .support 的全称更稳。长期账本几乎打平甚至倒挂（.support 续费更低），别只看首年价下单。最省心的做法：两个都注册，主用一个、另一个 301——用户在紧急时刻不该猜你用的是哪个。注意两边共同的铁律：域名承诺了帮助，页面必须真能解决问题——挂着 .help/.support 却无人应答比没有更伤信任；它们都是功能词不是品牌词，新品牌主域另选，这两个做配套入口。",
      pickA: ["产品帮助中心与教程站", "面向消费者的口语入口", "公益求助与互助项目", "首年低价的轻量试验"],
      pickB: ["企业级知识库与工单入口", "客服与售后团队", "IT 与技术支持服务商", "长期持有的低续费"],
    },
    en: {
      title: ".help vs .support: The Short Word or The Full Word at the Front Desk",
      metaDescription:
        ".help is the four-letter colloquial cry; .support is the seven-letter formal noun. Compare the two front-desk suffixes on tone, pricing and fit, then hunt names available on both.",
      verdict:
        "Both are functional suffixes for a brand's front desk; the split is tone and the ledger. .help is short and colloquial — four letters a stressed user can type on instinct as brand.help: product help centers, tool tutorial sites and cause projects (the refugees.help natural phrase) spread it at zero cost; run by Internet Naming Co. at about $2 to register and $26/yr to renew — a nearly free first year but a 10x-plus gap, so decide up front whether it's a long-term asset or a one-off experiment. .support is long and formal — seven letters spelling the full word: help centers and knowledge bases, customer-service and after-sales teams, IT and tech-support providers on name.support read more corporate than help, and independent providers book work naturally on category + .support (printer, mac); run by Identity Digital at about $7 to register and $22/yr to renew — a small gap both ways, actually cheaper than .help to hold long, painless as a defensive registration. The test: a short consumer brand that needs the address to roll off the tongue → .help's four letters win; enterprise products, B2B service desks, tech-support providers → .support's full word is steadier. The long-term ledger nearly evens out or flips (.support renews cheaper), so don't buy on first-year price alone. The safest play: register both, run one, 301 the other — a user in trouble shouldn't have to guess which one you chose. One iron rule on both sides: the domain promises help, so the page must actually deliver — a dead .help or .support wounds trust more than having none; and both are function words, not brand words — pick the brand's main domain elsewhere and run these as companions.",
      pickA: ["Product help centers & tutorials", "Consumer-facing colloquial entry", "Cause & mutual-aid projects", "Cheap first-year experiments"],
      pickB: ["Enterprise knowledge bases & ticketing", "Customer service & after-sales teams", "IT & tech-support providers", "Cheaper long-term renewals"],
    },
  },
  "wedding-vs-love": {
    slug: "wedding-vs-love",
    a: "wedding",
    b: "love",
    zh: {
      title: ".wedding 和 .love 怎么选：一场婚礼与一份情感的对比",
      metaDescription: ".wedding 专指婚礼这件事，.love 泛指一切情感。对比两个喜事后缀的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都带喜气，指向不同。.wedding 专指婚礼——新人的电子请柬与纪念站、婚庆策划公司与场地、婚纱摄影与礼服租售、跟拍与主持团队用 name.wedding，后缀一出场就自带喜气：names.wedding 读出来就是「某某的婚礼」，请柬域名的天花板写法，婚庆行业用它行业定位也一眼即明；GoDaddy Registry 运营，注册约 $26、续费约 $26/年——注册续费同价，成本透明。.love 泛指情感——求婚站、情侣与家庭纪念页、公益与慈善项目、粉丝应援站用 name.love，是极少数「读出来就有情绪」的后缀，两个经典语法：「名字 + .love」（emma.love 的语感）和「我爱的东西 + .love」（coffee.love 式品类宣言）；注册约 $9、续费约 $23/年，温和档且比 .wedding 便宜。判断标准：主题是「婚礼这件事」——请柬、婚庆、婚纱摄影、场地 → .wedding 的专词最点题；主题是「一段感情或一份热爱」——求婚、纪念、公益、应援 → .love 的情绪浓度覆盖面更广。新人请柬两个都顺：names.wedding 更正式点题，names.love 更浪漫且续费便宜——婚礼结束后若想留作永久纪念页，.love 的账本更友好。注意 .wedding 七个字母偏长，两人姓名组合选短拼法；两边共同的档期问题：婚礼过后要么续费做成纪念页，要么果断放手，别让带着两人名字的域名过期流入市场。婚庆是本地强需求行业，「城市 + .wedding」能接住本地搜索红利；.love 的情感浓度在严肃 B2B 场景明显违和，商用前想清楚。",
      pickA: ["婚礼请柬与纪念站", "婚庆策划与场地", "婚纱摄影与礼服", "本地婚庆（城市 + .wedding）"],
      pickB: ["求婚与情侣纪念页", "公益与慈善项目", "粉丝应援站", "品类情感宣言（coffee.love）"],
    },
    en: {
      title: ".wedding vs .love: The Big Day or The Big Feeling",
      metaDescription:
        ".wedding names the event; .love names the emotion. Compare the two celebration suffixes on semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both carry the celebration; they point at different things. .wedding names the event — couples' invitation and keepsake sites, wedding planners and venues, bridal photography and dress rental, videography and MC teams on name.wedding arrive with the festivity built in: names.wedding reads out as \"so-and-so's wedding\", the ceiling of invitation-domain grammar, and the trade reads its industry on sight; run by GoDaddy Registry at about $26 to register and $26/yr to renew — the same both ways, transparent cost. .love names the emotion — proposal sites, couple and family tribute pages, charities and causes, fan projects on name.love ride one of the very few suffixes that lands a feeling on first read, with two classic grammars: name + .love (the emma.love cadence) and thing-I-love + .love (the coffee.love category declaration); about $9 to register and $23/yr to renew — the mild tier, cheaper than .wedding. The test: the theme is the wedding itself — invitations, planning, bridal photography, venues → .wedding's precision hits hardest; the theme is a feeling or a passion — proposals, tributes, causes, fandom → .love's emotional range stretches wider. For couples' invitations both work: names.wedding reads more formal and on-topic, names.love more romantic with a cheaper renewal — friendlier math if the site becomes a permanent keepsake page after the day. Note .wedding runs seven letters, so pick short spellings for the couple's names; and both share the shelf-life problem: after the wedding, renew into a keepsake page or let go deliberately — never let a domain carrying two names lapse into the open market. Weddings are a strongly local trade, so city + .wedding catches local search; and .love's voltage reads plainly wrong in sober B2B settings — think before commercial use.",
      pickA: ["Wedding invitations & keepsake sites", "Planners & venues", "Bridal photography & dresses", "Local wedding trade (city + .wedding)"],
      pickB: ["Proposals & couple tributes", "Charities & causes", "Fan projects", "Category declarations (coffee.love)"],
    },
  },
  "law-vs-pro": {
    slug: "law-vs-pro",
    a: "law",
    b: "pro",
    zh: {
      title: ".law 和 .pro 怎么选：行业门牌与泛专业感的对比",
      metaDescription: ".law 专指法律行业，.pro 泛指一切专业服务。对比两个专业系后缀的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都在卖「专业」，颗粒度完全不同。.law 是行业门牌——律师事务所、独立执业律师、法律科技产品用 name.law，三个字母把行业写死在后缀里，smith.law 读出来就是「史密斯律所」，法律这个讲信任的行业里它比一长串 .com 更像烫金门牌；GoDaddy Registry 平台运营，注册约 $83、续费约 $83/年——注册续费同价，是全站较贵档，但对客单价以万计的法律行业，这个门槛反而筛掉垃圾站，让 .law 的域名环境更干净。.pro 是泛专业感——律师、设计师、摄影师、顾问都能用「姓名/技能 + .pro」给个人品牌加一层资质感，它历史上曾要求职业资质、现已放开，但「专业」的语义沉淀保留了下来；价格低、库存充足，短名字命中率高。判断标准：正经执业的律师与律所 → .law 的行业专词最准，$83/年对执业者是名片级投入；跨行业的专业服务者、还没定型的个人品牌、或产品的 Pro 版落地页 → .pro 的低价与泛用性更合适。账本差距是十倍级：.law 约 $83/年 vs .pro 的低价档，学生与试水项目别硬上 .law。注意 .law 各法域对律师广告有执业合规要求，上线前按当地律协规范自查；.pro 对陌生品牌的信任背书弱于 .com，重要业务建议配合主流后缀。",
      pickA: ["律师事务所与执业律师", "法律科技产品", "「城市/领域 + .law」垂直站", "要行业门牌级的专业背书"],
      pickB: ["跨行业专业服务者", "个人品牌与顾问工作室", "产品 Pro 版落地页", "预算敏感的低价试水"],
    },
    en: {
      title: ".law vs .pro: The Industry Nameplate or The Generic Credential",
      metaDescription:
        ".law names the legal profession; .pro signals professionalism at large. Compare the two credential suffixes on semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both sell professionalism; the granularity differs completely. .law is the industry nameplate — law firms, solo attorneys and legal-tech products on name.law hard-code the profession into three letters: smith.law reads out as \"Smith Law\", and in a trust-first trade it lands more like a brass nameplate than any long .com; run on the GoDaddy Registry platform at about $83 to register and $83/yr to renew — the same both ways, one of the pricier tiers on this site, but for an industry billing by the hour that threshold filters spam and keeps the namespace clean. .pro is the generic credential — lawyers, designers, photographers and consultants all add a layer of authority with name or skill + .pro; the registry once required proof of credentials and is open now, but the professional connotation stuck; prices are low, inventory deep, short names still hit. The test: a practicing attorney or firm → .law's industry word aims truest, and $83/yr is business-card money for a practice; cross-industry professionals, personal brands still taking shape, or a product's Pro-tier page → .pro's low price and flexibility fit better. The ledger gap is order-of-magnitude: about $83/yr on .law versus .pro's budget tier — students and experiments shouldn't force .law. Note most jurisdictions regulate attorney advertising, so check your bar's website rules before launching on .law; and .pro persuades less than .com for unknown brands, so pair a mainstream suffix for serious ventures.",
      pickA: ["Law firms & practicing attorneys", "Legal-tech products", "City or practice + .law verticals", "Nameplate-grade professional trust"],
      pickB: ["Cross-industry professionals", "Personal brands & consultancies", "Pro-tier product pages", "Budget-friendly experiments"],
    },
  },
  "tax-vs-finance": {
    slug: "tax-vs-finance",
    a: "tax",
    b: "finance",
    zh: {
      title: ".tax 和 .finance 怎么选：报税专词与金融泛词的对比",
      metaDescription: ".tax 专指税务这件事，.finance 泛指整个金融行业。对比两个钱袋子后缀的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都跟钱打交道，指向不同。.tax 是报税专词——税务师与会计事务所、报税软件与工具、税务咨询与筹划服务用 name.tax，三个字母把业务说得不能再直白，大牌先例现成：Intuit 的 turbo.tax 就是把品牌拆进后缀的教科书写法；Identity Digital 运营，注册约 $8、续费约 $54/年——首年便宜续费跳档，预算按续费价算才稳。.finance 是金融泛词——金融科技、DeFi 协议、财务管理工具、投资内容站用 name.finance，八个字母写全了「金融」，语义严肃正式，DeFi 圈更是把它用成了行业惯例；注册约 $7 上下、续费约 $52/年——账本结构与 .tax 几乎一样。判断标准：业务就是「税」这一件事——报税、税筹、税法内容 → .tax 的专词点题最准，报税季的高意图搜索里直白命名优势明显；业务是更宽的「钱」——理财、支付、投资、DeFi → .finance 的行业词覆盖面更大。两边续费都在 $52-54/年档，长期成本打平，选择纯看语义颗粒度。注意 .tax 在英语里也是动词（tax one's patience），品牌向命名留意歧义；两边都是强合规行业，资质与免责声明必须跟上——域名越专业，内容越要专业。工具类产品「场景 + .tax」（file.tax 式）读出来就是行动号召，.finance 则更适合品牌词打底。",
      pickA: ["税务师与会计事务所", "报税软件与工具", "税务咨询与筹划", "报税季高意图搜索流量"],
      pickB: ["金融科技与支付产品", "DeFi 协议与加密项目", "财务管理与投资工具", "金融内容与研究站"],
    },
    en: {
      title: ".tax vs .finance: The Filing Word or The Industry Word",
      metaDescription:
        ".tax names one job — taxes; .finance names the whole industry. Compare the two money suffixes on semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both handle money; they point at different scopes. .tax is the filing word — tax and accounting firms, filing software and tools, advisory and planning services on name.tax say the trade in three blunt letters, with marquee precedent ready-made: Intuit's turbo.tax is the textbook brand-across-the-dot split; run by Identity Digital at about $8 to register and $54/yr to renew — a cheap first year with a renewal jump, so budget on the renewal price. .finance is the industry word — fintech products, DeFi protocols, money-management tools and investment content sites on name.finance spell the whole sector in eight sober letters, and the DeFi world has made it a de-facto convention; about $7 to register and $52/yr to renew — nearly the same ledger shape as .tax. The test: the business is taxes and nothing else — filing, planning, tax-law content → .tax's precision wins, and blunt names dominate the high-intent searches of filing season; the business is money at large — investing, payments, DeFi → .finance's industry word stretches wider. Both renew in the $52–54/yr band, so long-term cost is a wash and the choice is purely semantic granularity. Note tax is also an English verb (taxing one's patience), so brand-led names should watch the double reading; and both are heavily regulated trades where credentials and disclaimers must back the site — the more professional the domain, the more professional the content must be. For tools, action + .tax (the file.tax pattern) reads out as a call to action; .finance suits brand-word-first naming better.",
      pickA: ["Tax & accounting firms", "Filing software & tools", "Tax advisory & planning", "Filing-season high-intent searches"],
      pickB: ["Fintech & payment products", "DeFi protocols & crypto projects", "Money-management & investing tools", "Finance content & research sites"],
    },
  },
  "menu-vs-restaurant": {
    slug: "menu-vs-restaurant",
    a: "menu",
    b: "restaurant",
    zh: {
      title: ".menu 和 .restaurant 怎么选：一张菜单与一家店的对比",
      metaDescription: ".menu 指菜单这个功能入口，.restaurant 指餐厅这门生意。对比两个餐饮后缀的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都姓餐饮，分工不同。.menu 是功能入口——餐厅在线菜单页、扫码点餐系统、外卖与订餐平台用 name.menu，域名读出来就是「某某家的菜单」，最顺手的玩法是把它印进桌角二维码，顾客扫码直达菜单，比夹在官网深处的 PDF 好一个量级；Wedding TLD2 注册局运营（GoDaddy Registry 平台），注册约 $27、续费约 $27/年——注册续费同价，成本透明。.restaurant 是生意门面——餐厅官网、连锁品牌、订座与本地餐饮服务用 name.restaurant，十个字母写全了「餐厅」，行业定位一眼即明；Identity Digital 运营，注册约 $13、续费约 $52/年——首年便宜续费跳档，对一家正经餐厅的经营成本来说可以忽略。判断标准：要解决的是「菜单这个入口」——扫码点餐、外卖菜单、菜品展示 → .menu 的功能词最点题；要建的是「餐厅的官网门面」——品牌、订座、门店信息 → .restaurant 的行业词更正。最优雅的组合拳其实是两个都用：name.restaurant 做官网、name.menu 印进二维码直达菜单，分工天然。注意 .restaurant 十个字母全站最长档，主体名必须短；.menu 不绑定业态，正餐、酒吧、奶茶店都能用，但品牌主站还是建议搭配主流后缀。餐饮是强本地行业，两边都能靠「城市 + 后缀」接住本地搜索。",
      pickA: ["扫码点餐与桌角二维码", "餐厅在线菜单页", "外卖与订餐平台", "注册续费同价的透明成本"],
      pickB: ["餐厅官网与品牌门面", "连锁餐饮品牌", "订座与本地餐饮服务", "「城市 + .restaurant」本地搜索"],
    },
    en: {
      title: ".menu vs .restaurant: The Card or The House",
      metaDescription:
        ".menu names the functional doorway; .restaurant names the whole business. Compare the two dining suffixes on semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both belong to dining; the jobs differ. .menu is the functional doorway — restaurant menu pages, QR-code ordering systems, delivery and reservation platforms on name.menu read out as \"so-and-so's menu\", and the smoothest play is printing it into a table-corner QR code so guests scan straight to the card — an order of magnitude better than a PDF buried in a website; run by the Wedding TLD2 registry on the GoDaddy Registry platform at about $27 to register and $27/yr to renew — the same both ways, transparent cost. .restaurant is the storefront — restaurant brand sites, chains, reservations and local dining services on name.restaurant spell the whole trade in ten letters, industry positioning legible on sight; run by Identity Digital at about $13 to register and $52/yr to renew — a cheap first year with a renewal jump, negligible against a real restaurant's operating costs. The test: the job is the menu doorway — QR ordering, delivery menus, dish showcases → .menu's function word nails it; the job is the brand home — identity, reservations, locations → .restaurant's industry word reads truer. The most elegant play is actually both: name.restaurant as the site, name.menu printed into the QR code — a natural division of labor. Note .restaurant runs ten letters, among the longest on this site, so the front word must be short; and .menu binds to no format — fine dining, bars and bubble-tea shops all qualify — but pair a mainstream suffix for the main brand site. Dining is fiercely local, so city + suffix catches local search on either side.",
      pickA: ["QR ordering & table codes", "Restaurant online menus", "Delivery & reservation platforms", "Transparent same-price renewals"],
      pickB: ["Restaurant brand sites", "Chains & restaurant groups", "Reservations & local dining services", "City + .restaurant local search"],
    },
  },
  "bike-vs-fitness": {
    slug: "bike-vs-fitness",
    a: "bike",
    b: "fitness",
    zh: {
      title: ".bike 和 .fitness 怎么选：一项运动与一个行业的对比",
      metaDescription: ".bike 专指骑行这项运动，.fitness 泛指健身行业。对比两个运动系后缀的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都在运动场上，范围不同。.bike 是单项专词——自行车品牌与车店、骑行俱乐部与赛事、租赁与修车服务用 name.bike，四个字母把行业说得干脆，它还是 2014 年新顶级域开闸的第一批后缀，先例现成：Trek 注册了 trek.bike；Identity Digital 运营，注册约 $8、续费约 $31/年——首年便宜、续费温和，行业词后缀里的性价比档。.fitness 是行业泛词——健身房与工作室、私教与团课、健身内容与器材电商用 name.fitness，七个字母写全了「健身」，覆盖从撸铁到瑜伽的一切；同为 Identity Digital 运营，注册约 $6、续费约 $33/年——账本结构与 .bike 几乎一样，对健身房月卡收入来说可以忽略。判断标准：生意围着「自行车」转——车店、骑行俱乐部、租车修车 → .bike 的单项专词指向最准；生意是更宽的「身体训练」——健身房、私教、动感单车团课 → .fitness 的行业词更包容。有趣的重叠带是动感单车与骑行训练课：偏器材与户外骑行选 .bike，偏室内课程与训练体系选 .fitness。两边续费都在 $31-33/年档，成本打平，选择纯看语义。注意 bike 在英语里两义（单车/摩托），页面要讲清是哪种；骑行与健身都是强社区行业，「城市 + 后缀」都能精准聚拢本地人群；低价后缀认知度有限，品牌向业务建议同时持有主流后缀。",
      pickA: ["自行车品牌与车店", "骑行俱乐部与赛事", "租赁与修车服务", "「城市/线路 + .bike」聚本地骑友"],
      pickB: ["健身房与训练工作室", "私教与团课品牌", "健身内容与课程", "室内训练与团课体系"],
    },
    en: {
      title: ".bike vs .fitness: One Sport or The Whole Industry",
      metaDescription:
        ".bike names one sport — cycling; .fitness names the training industry at large. Compare the two active suffixes on semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both live on the sports field; the scope differs. .bike is the single-sport word — bicycle brands and shops, cycling clubs and races, rental and repair services on name.bike say the trade in four crisp letters, and it launched in the very first batch of new gTLDs in 2014 with precedent to show: Trek registered trek.bike; run by Identity Digital at about $8 to register and $31/yr to renew — cheap first year, mild renewal, the value tier among industry words. .fitness is the industry word — gyms and studios, personal trainers and group classes, fitness content and gear e-commerce on name.fitness spell the whole trade in seven letters, covering everything from lifting to yoga; also Identity Digital, about $6 to register and $33/yr to renew — nearly the same ledger as .bike, negligible against a gym's membership revenue. The test: the business orbits the bicycle — shops, clubs, rental and repair → .bike's single-sport word aims truest; the business is training the body at large — gyms, coaching, spin classes → .fitness stretches wider. The interesting overlap is indoor cycling: gear and outdoor riding lean .bike; class systems and studio training lean .fitness. Both renew in the $31–33/yr band, so cost is a wash and the choice is purely semantic. Note bike carries two English senses (bicycle and motorcycle), so the hero must say which one fast; both trades are community-first, so city + suffix gathers locals precisely on either side; and cheap-suffix recognition is limited, so brand-led businesses should hold a mainstream suffix too.",
      pickA: ["Bike brands & shops", "Cycling clubs & races", "Rental & repair services", "City or route + .bike for local riders"],
      pickB: ["Gyms & training studios", "Personal trainers & group classes", "Fitness content & courses", "Indoor training & class systems"],
    },
  },
  "toys-vs-shop": {
    slug: "toys-vs-shop",
    a: "toys",
    b: "shop",
    zh: {
      title: ".toys 和 .shop 怎么选：品类货架与万能商店的对比",
      metaDescription: ".toys 专指玩具品类，.shop 是电商的万能后缀。对比垂直品类词与通用商店词的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都在开店，货架宽度不同。.toys 是品类货架——玩具品牌与电商、潮玩与手办店、桌游与积木社区用 name.toys，复数名词天然带「货架感」，读出来就是「某某家的玩具」，大牌先例现成：乐高注册了 lego.toys；Identity Digital 运营，注册约 $11、续费约 $52/年——首年便宜续费跳档，预算按续费价算才稳。.shop 是万能商店——独立站、品牌官方商店、任何品类的垂直电商用 name.shop 都自然，「品牌 + .shop」本身就是一句行动号召，它也常做主品牌的商店子站（主站 .com、商店同名 .shop）；首年常有低价促销、续费明显更高，账本结构与 .toys 类似。判断标准：生意就是「玩具」这一个品类——玩具品牌、潮玩店、桌游社区 → .toys 的品类词一眼点题，lego.toys 式命名自带辨识度；品类更宽、或未来会扩品 → .shop 的万能词不锁死货架，今天卖玩具明天上文具也不违和。反过来说，.toys 锁死品类也是优点——垂直站的后缀即定位，搜索与转发时自带说明书。注意面向儿童的电商与内容受隐私与广告合规约束（如美国 COPPA），站点设计要跟上；潮玩与手办的主战场在社交平台与直播，域名的角色是品牌官网与发售日历的稳定入口；两边续费都不便宜，长期持有先算总账。",
      pickA: ["玩具品牌与垂直电商", "潮玩与手办店", "桌游与积木社区", "「品牌 + .toys」的货架感命名"],
      pickB: ["多品类独立站电商", "品牌官方商店子站", "未来可能扩品的店", "「品牌 + .shop」行动号召命名"],
    },
    en: {
      title: ".toys vs .shop: The Category Shelf or The Universal Store",
      metaDescription:
        ".toys names one category — toys; .shop is e-commerce's universal suffix. Compare the vertical word and the generic store word on semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both open a store; the shelf width differs. .toys is the category shelf — toy brands and e-commerce, designer-toy and figure shops, board-game and block communities on name.toys carry a built-in shelf feel: the plural reads out as \"so-and-so's toys\", with marquee precedent ready-made — LEGO registered lego.toys; run by Identity Digital at about $11 to register and $52/yr to renew — a cheap first year with a renewal jump, so budget on the renewal price. .shop is the universal store — independent stores, official brand shops and vertical commerce of any category read naturally on name.shop, and brand + .shop doubles as a call to action; it's also popular as the store companion to a main brand (.com for the site, the matching .shop for the storefront); intro pricing is often cheap while renewals run noticeably higher — a ledger shaped much like .toys. The test: the business is the toy category and nothing else — toy brands, designer-toy shops, board-game communities → .toys nails the aim on sight, and lego.toys-style naming carries built-in recognition; the catalog is broader, or will broaden → .shop's generic word never locks the shelf, so selling toys today and stationery tomorrow reads fine. Flip it around and .toys' lock-in is also its strength — for a vertical store the suffix is the positioning, a built-in explainer in every search result and share. Note child-facing commerce carries compliance duties (privacy and ad rules like COPPA), so the site must keep up; designer toys live on social platforms and livestreams, so the domain's role is the stable brand home and drop calendar; and neither renewal is cheap, so run the long-term math before holding both.",
      pickA: ["Toy brands & vertical e-commerce", "Designer-toy & figure shops", "Board-game & block communities", "Shelf-feel naming (lego.toys)"],
      pickB: ["Multi-category independent stores", "Official brand storefronts", "Stores that may broaden the catalog", "Call-to-action naming (brand + .shop)"],
    },
  },
  "shoes-vs-fashion": {
    slug: "shoes-vs-fashion",
    a: "shoes",
    b: "fashion",
    zh: {
      title: ".shoes 和 .fashion 怎么选：品类垂直与行业全称的对比",
      metaDescription: ".shoes 专指鞋这个品类，.fashion 泛指整个时装行业。对比垂直品类词与行业词的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都在衣帽间里，颗粒度不同。.shoes 是品类垂直——鞋履品牌与电商、球鞋店与鞋圈社区、手工定制鞋工作室用 name.shoes，品类从后缀就说清了，大牌先例现成：耐克注册了 nike.shoes，「品类/风格 + .shoes」（running.shoes 式）更是一眼点题；Identity Digital 运营，注册约 $21、续费约 $52/年——首年中档、续费跳档，预算按续费价算才稳。.fashion 是行业全称——服装品牌与买手店、独立设计师工作室、时尚电商与租赁平台用 name.fashion，后缀本身就是行业宣言；GoDaddy Registry 运营，注册约 $26、续费约 $26/年——注册续费同价，成本透明，长期持有反而比 .shoes 便宜一半。判断标准：只做鞋——球鞋店、鞋履品牌、定制工坊 → .shoes 的垂直词指向最准，鞋圈语境里它比 fashion 更「圈内」；做整个衣橱——服装、配饰、买手店 → .fashion 的行业词覆盖面更大，只用 .shoes 反而把货架说窄了。长期账本值得注意：.fashion 约 $26/年 vs .shoes 约 $52/年，行业词反而便宜——垂直定位是拿语义精度换的溢价。注意球鞋转售与鉴定是强信任生意，域名专业只是第一步，鉴定背书与保障政策才是成交关键；时尚行业视觉即正义，两边都要求首屏大图与品牌摄影跟上；两个后缀认知度都一般，面向大众的品牌主站建议同时持有主流后缀。",
      pickA: ["鞋履品牌与垂直电商", "球鞋店与鞋圈社区", "手工与定制鞋工作室", "「品类/风格 + .shoes」垂直命名"],
      pickB: ["服装品牌与买手店", "独立设计师工作室", "全品类时尚电商", "注册续费同价的低长期成本"],
    },
    en: {
      title: ".shoes vs .fashion: The Vertical or The Industry",
      metaDescription:
        ".shoes names one category; .fashion names the whole apparel industry. Compare the vertical word and the industry word on semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both live in the wardrobe; the granularity differs. .shoes is the vertical — footwear brands and e-commerce, sneaker shops and communities, custom shoemakers on name.shoes declare the product from the suffix, with marquee precedent ready-made: Nike registered nike.shoes, and category or style + .shoes (the running.shoes pattern) nails the aim on sight; run by Identity Digital at about $21 to register and $52/yr to renew — a mid-tier first year with a renewal jump, so budget on the renewal price. .fashion is the industry word — apparel brands and boutiques, independent designer studios, fashion e-commerce and rental platforms on name.fashion make the suffix itself the industry statement; run by GoDaddy Registry at about $26 to register and $26/yr to renew — the same both ways, transparent cost, and actually half the price of .shoes to hold long-term. The test: the business is shoes and only shoes — sneaker shops, footwear brands, custom workshops → .shoes' vertical word aims truest, and in sneaker culture it reads more native than fashion; the business is the whole wardrobe — apparel, accessories, boutiques → .fashion's industry word stretches wider, and .shoes alone would narrate the shelf too narrow. Watch the long-term ledger: about $26/yr on .fashion versus $52/yr on .shoes — the industry word is the cheaper one, so the vertical's precision is a paid premium. Note sneaker resale and authentication is a trust-first trade — a professional domain is only step one, authentication backing and guarantees close the sale; fashion is a visuals-first industry on both sides — hero imagery and brand photography carry the presence; and both suffixes carry modest recognition, so consumer-facing brand homes should hold a mainstream suffix too.",
      pickA: ["Footwear brands & vertical e-commerce", "Sneaker shops & communities", "Custom & handmade shoemakers", "Vertical naming (running.shoes)"],
      pickB: ["Apparel brands & boutiques", "Independent designer studios", "Full-wardrobe fashion e-commerce", "Cheaper transparent renewals"],
    },
  },
  "plus-vs-vip": {
    slug: "plus-vs-vip",
    a: "plus",
    b: "vip",
    zh: {
      title: ".plus 和 .vip 怎么选：升级入口与会员身份的对比",
      metaDescription: ".plus 说「更好的那一档」，.vip 说「会员专属」。对比两个增值系后缀的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都在做「付费的那一档」，说法不同。.plus 是升级入口——产品的 Pro/会员版、增值服务与升级套餐、工具的扩展版用 name.plus，流媒体时代 Plus 后缀早已深入人心（各大平台的 + 订阅版都是这个语感），brand.plus 读出来就是「同一个东西，更好的那档」；Identity Digital 运营，注册约 $10、续费约 $44/年——续费偏高档，适合真正承载付费业务的入口而非闲置注册。.vip 是会员身份——会员制产品、粉丝社群、高端服务预约、电商会员站用 name.vip，VIP 的概念国人人人皆知，后缀已获工信部资质、可正常 ICP 备案，注册量长期位居新后缀前列；注册约 $6、续费约 $8/年——两边价差五倍多，.vip 是本组的性价比档。判断标准：语义重心在「产品升级了什么」——功能更强、套餐更高 → .plus 的升级语感更准，brand.plus 天然是付费升级跳转页；语义重心在「用户是谁」——会员身份、专属待遇、圈子归属 → .vip 的身份词直给。市场也分岸：.vip 在国内认知远超海外且可备案，面向国内的会员业务用它顺理成章；.plus 的语感在海外订阅制产品里更通行。注意 .plus 是修饰词不是品牌词，主站放品牌主域、它做会员/升级版入口最顺；.vip 自带营销感，严肃工具类产品不太搭；两个都常见的玩法是主站 .com + 同名增值站，分工天然。",
      pickA: ["产品 Pro/升级版入口", "增值服务与套餐页", "海外订阅制产品", "「品牌 + .plus」升级语感命名"],
      pickB: ["面向国内的会员制业务", "粉丝社群与圈子运营", "需要 ICP 备案的会员站", "低续费的长期持有"],
    },
    en: {
      title: ".plus vs .vip: The Upgrade or The Membership",
      metaDescription:
        ".plus says \"the better tier\"; .vip says \"members only\". Compare the two premium-tier suffixes on semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both sell the paid tier; the framing differs. .plus is the upgrade doorway — Pro and premium editions, add-on services and upgrade bundles, extended versions of tools on name.plus ride a suffix the streaming era already taught everyone (every platform's + subscription speaks this language), so brand.plus reads out as \"the same thing, the better tier\"; run by Identity Digital at about $10 to register and $44/yr to renew — a premium renewal, worth it for doorways that actually carry paid business rather than idle registrations. .vip is the membership badge — membership products, fan communities, premium booking services and store membership hubs on name.vip lean on a concept every Chinese user knows cold, with MIIT accreditation for normal ICP filing and registration volumes long among the top new gTLDs; about $6 to register and $8/yr to renew — a five-fold price gap that makes .vip the value pick of this pair. The test: the semantic weight is on what upgraded — stronger features, higher tiers → .plus's upgrade voice aims truer, and brand.plus is a natural paid-upgrade landing page; the weight is on who the user is — member identity, exclusive perks, belonging → .vip's status word says it straight. Markets split too: .vip's recognition in China far outruns overseas and it files for ICP, so China-facing membership plays wear it naturally; .plus travels better among international subscription products. Note .plus is a modifier, not a brand word — keep the brand home on a mainstream domain and let .plus run the members' door; .vip carries a promotional air that sober tooling brands may not want; and the classic play on either side is .com for the main site plus the matching premium domain, a natural division of labor.",
      pickA: ["Pro & premium edition doorways", "Add-on services & upgrade bundles", "International subscription products", "Upgrade-voice naming (brand + .plus)"],
      pickB: ["China-facing membership businesses", "Fan communities & clubs", "Membership sites needing ICP filing", "Cheap long-term renewals"],
    },
  },
  "house-vs-estate": {
    slug: "house-vs-estate",
    a: "house",
    b: "estate",
    zh: {
      title: ".house 和 .estate 怎么选：一栋房子与一份资产的对比",
      metaDescription: ".house 说居住场景里的一栋栋房子，.estate 说资产与地产生意。对比两个房产系后缀的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都姓房产，视角不同。.house 看的是「一栋一栋的房子」——2C 的租售信息平台、家装与家居品牌、民宿与短租、建筑与室内设计工作室用 name.house，居住场景亲切直给；它还有一层妙用：英文里创意机构惯用 House 结尾（design house、publishing house），brand.house 让「品牌词 + 后缀」直接等于机构全名；Identity Digital 运营，注册约 $15、续费约 $36/年——中档价位。.estate 看的是「资产与生意」——经纪人与中介品牌、豪宅与庄园项目、物业与资产管理公司用 name.estate，行业属性一目了然，smith.estate 比 smithrealestate.com 短一半且更显高端；它还兼「遗产/资产」语义，家族办公室与遗产规划也用得顺；同为 Identity Digital 运营，注册约 $8、续费约 $31/年——对客单价极高的房产行业可忽略。判断标准：面向住的人——租房买房的个人、家装、民宿 → .house 的居住词更亲切；面向资产与交易——中介品牌、豪宅盘、物业与资管 → .estate 的行业词更专业，且自带高端庄园气质，刚需平价盘用它反而有落差。两边续费只差 $5/年，成本几乎打平，选择纯看视角。注意房产是强本地强监管行业：「城市/街区 + .house」能接住本地搜索，而中介牌照与备案信息两边都要在页面讲清；两个后缀国内认知都有限，更适合海外或涉外业务的门面。命名上「城市 + .house」「姓氏/品牌 + .estate」是各自最顺的形态。",
      pickA: ["2C 租售与民宿短租", "家装与家居品牌", "建筑与室内设计工作室", "「城市/街区 + .house」本地命名"],
      pickB: ["经纪人与中介品牌", "豪宅与庄园项目", "物业与资产管理", "家族办公室与遗产规划"],
    },
    en: {
      title: ".house vs .estate: The Home or The Asset",
      metaDescription:
        ".house speaks of homes people live in; .estate speaks of property as an asset and a trade. Compare the two real-estate suffixes on semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both belong to property; the lens differs. .house sees homes one at a time — consumer rental and sales platforms, interior and home-living brands, guesthouses and short-term stays, architecture and interior studios on name.house speak the living scene warmly; it hides a bonus too: English creative firms end in House (design house, publishing house), so brand.house makes the domain read as the firm's full name; run by Identity Digital at about $15 to register and $36/yr to renew — mid-tier. .estate sees the asset and the trade — agent and brokerage brands, luxury and manor projects, property and asset managers on name.estate declare the industry on sight, and smith.estate runs half the length of smithrealestate.com while reading twice as upscale; it also carries the inheritance sense, so family offices and estate planning wear it well; also Identity Digital, about $8 to register and $31/yr to renew — negligible against real estate's ticket sizes. The test: the audience is people who live there — renters, buyers, home improvement, guesthouses → .house's home word feels warmer; the audience is the asset side — brokerages, luxury listings, property and asset management → .estate's trade word reads more professional, though its manor air sits awkwardly on budget housing. Renewals differ by just $5/yr, so cost is a wash and the choice is purely the lens. Note property is fiercely local and heavily regulated: city or neighborhood + .house catches local search, and licenses plus real office details must be legible on either suffix; both carry modest recognition in China, so they fit international-facing storefronts best. Naming: city + .house and surname or brand + .estate are each side's most natural patterns.",
      pickA: ["Consumer rentals & short stays", "Interior & home-living brands", "Architecture & design studios", "Local naming (city + .house)"],
      pickB: ["Agent & brokerage brands", "Luxury & manor projects", "Property & asset management", "Family offices & estate planning"],
    },
  },
  "shoes-vs-store": {
    slug: "shoes-vs-store",
    a: "shoes",
    b: "store",
    zh: {
      title: ".shoes 和 .store 怎么选：品类招牌与万能商城的对比",
      metaDescription: ".shoes 把鞋这个品类写进后缀，.store 是电商的万能商城词。对比垂直品类词与通用商店词的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都在卖货，招牌写法不同。.shoes 是品类招牌——鞋履品牌与电商、球鞋店与鞋圈社区、手工定制鞋工作室用 name.shoes，品类从后缀就说清了，大牌先例现成：耐克注册了 nike.shoes，「品类/风格 + .shoes」（running.shoes 式）更是一眼点题；Identity Digital 运营，注册约 $21、续费约 $52/年——首年中档、续费跳档，预算按续费价算才稳。.store 是万能商城——DTC 独立站、品牌官方商城、任何品类的线上入口用 brand.store 语义零损耗，最主流的玩法是主站 .com + 商城同名 .store，两个域名分工明确；首年常见大幅促销、续费约 $53/年，账本结构与 .shoes 几乎一样。判断标准：只做鞋——球鞋店、鞋履品牌、定制工坊 → .shoes 的品类词指向最准，后缀即定位，搜索与转发时自带说明书；品类更宽、或未来会扩品 → .store 的万能词不锁死货架，今天卖鞋明天上服饰也不违和。两边续费都在 $52-53/年档，成本打平，选择纯看货架宽度。注意 .store 的主体名就写品牌本身——后缀已经说了「商店」，主体再带 shop/mall 是画蛇添足；球鞋转售与鉴定是强信任生意，域名专业只是第一步，鉴定背书与保障政策才是成交关键；两个后缀认知度都一般，面向大众的品牌主站建议同时持有主流后缀。",
      pickA: ["鞋履品牌与垂直电商", "球鞋店与鞋圈社区", "手工与定制鞋工作室", "「品类/风格 + .shoes」垂直命名"],
      pickB: ["多品类 DTC 独立站", "品牌官方商城子站", "未来可能扩品的店", "「品牌 + .store」零损耗命名"],
    },
    en: {
      title: ".shoes vs .store: The Category Sign or The Universal Mall",
      metaDescription:
        ".shoes writes one category into the suffix; .store is e-commerce's universal mall word. Compare the vertical word and the generic store word on semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both sell; the shop sign reads differently. .shoes is the category sign — footwear brands and e-commerce, sneaker shops and communities, custom shoemakers on name.shoes declare the product from the suffix, with marquee precedent ready-made: Nike registered nike.shoes, and category or style + .shoes (the running.shoes pattern) nails the aim on sight; run by Identity Digital at about $21 to register and $52/yr to renew — a mid-tier first year with a renewal jump, so budget on the renewal price. .store is the universal mall — DTC independent stores, official brand shops, the online doorway for any category read losslessly on brand.store, and the mainstream play is .com for the main site with the matching .store as the storefront, two domains with a clean division of labor; intro pricing is often heavily discounted while renewals run about $53/yr — a ledger shaped almost exactly like .shoes. The test: the business is shoes and only shoes — sneaker shops, footwear brands, custom workshops → .shoes' category word aims truest, the suffix is the positioning, a built-in explainer in every search result and share; the catalog is broader, or will broaden → .store's generic word never locks the shelf, so selling shoes today and apparel tomorrow reads fine. Both renew in the $52–53/yr band, so cost is a wash and the choice is purely shelf width. Note the front word on .store should be the brand itself — the suffix already says store, so shop or mall in the name is redundant; sneaker resale and authentication is a trust-first trade, so a professional domain is only step one — authentication backing and guarantees close the sale; and both suffixes carry modest recognition, so consumer-facing brand homes should hold a mainstream suffix too.",
      pickA: ["Footwear brands & vertical e-commerce", "Sneaker shops & communities", "Custom & handmade shoemakers", "Vertical naming (running.shoes)"],
      pickB: ["Multi-category DTC stores", "Official brand storefronts", "Stores that may broaden the catalog", "Lossless naming (brand + .store)"],
    },
  },
  "toys-vs-games": {
    slug: "toys-vs-games",
    a: "toys",
    b: "games",
    zh: {
      title: ".toys 和 .games 怎么选：实体玩具与游戏行业的对比",
      metaDescription: ".toys 偏实体玩具与收藏品，.games 偏游戏行业与玩法。对比两个玩乐系后缀的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都在做「好玩」的生意，实体感不同。.toys 偏「摸得着的快乐」——玩具品牌与电商、潮玩与手办店、桌游与积木社区用 name.toys，复数名词天然带「货架感」，读出来就是「某某家的玩具」，大牌先例现成：乐高注册了 lego.toys；Identity Digital 运营，注册约 $11、续费约 $52/年——首年便宜续费跳档，预算按续费价算才稳。.games 偏「游戏与玩法」——游戏工作室官网、独立游戏作品站、电竞战队、游戏媒体与社区用 name.games，行业一眼即懂，Epic 旗下产品页与众多独立开发者的作品集都在用；注册约 $18、续费约 $24/年——续费只有 .toys 的一半不到，是玩乐系后缀里的性价比档。判断标准：卖实体——玩具、手办、积木、收藏品 → .toys 的货架词更准，lego.toys 式命名自带辨识度；做数字——电子游戏、游戏内容、电竞与社区 → .games 的行业词更对味，「工作室名/游戏名 + .games」不需要再解释行业属性。有趣的重叠带是桌游：偏实体收藏与售卖选 .toys，偏玩法社区与赛事选 .games。长期账本值得注意：约 $24/年 vs $52/年，.games 便宜一半——纯看成本时数字侧占优。注意面向儿童的电商与内容受合规约束（隐私与广告规范，如美国 COPPA），两边都要跟上；潮玩与游戏的主战场都在社交平台与直播，域名的角色是品牌官网与发售/上线日历的稳定入口；重度单款品牌可能仍需拿下 .com 防御。",
      pickA: ["玩具品牌与垂直电商", "潮玩与手办店", "积木与实体收藏社区", "「品牌 + .toys」货架感命名"],
      pickB: ["游戏工作室与作品站", "独立游戏与发行页", "电竞战队与游戏社区", "低一半续费的长期持有"],
    },
    en: {
      title: ".toys vs .games: Physical Play or The Games Industry",
      metaDescription:
        ".toys leans physical toys and collectibles; .games leans the games industry and play itself. Compare the two play suffixes on semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both trade in fun; the physicality differs. .toys leans touchable joy — toy brands and e-commerce, designer-toy and figure shops, board-game and block communities on name.toys carry a built-in shelf feel: the plural reads out as \"so-and-so's toys\", with marquee precedent ready-made — LEGO registered lego.toys; run by Identity Digital at about $11 to register and $52/yr to renew — a cheap first year with a renewal jump, so budget on the renewal price. .games leans play itself — game studio sites, indie game homes, esports teams, gaming media and communities on name.games read the industry on sight, with Epic product pages and countless indie portfolios already using it; about $18 to register and $24/yr to renew — less than half of .toys to hold, the value tier among play suffixes. The test: the product is physical — toys, figures, blocks, collectibles → .toys' shelf word aims truer, and lego.toys-style naming carries built-in recognition; the product is digital — video games, gaming content, esports and communities → .games reads more native, and studio or title + .games needs no further industry explainer. The interesting overlap is board games: collecting and selling lean .toys; play communities and events lean .games. Watch the long-term ledger: about $24/yr versus $52/yr — .games holds at half the price, so pure cost favors the digital side. Note child-facing commerce and content carry compliance duties (privacy and ad rules like COPPA) on either suffix; designer toys and games both live on social platforms and livestreams, so the domain's role is the stable brand home and release calendar; and a heavyweight single-title brand may still want the .com for defense.",
      pickA: ["Toy brands & vertical e-commerce", "Designer-toy & figure shops", "Block & physical collector communities", "Shelf-feel naming (lego.toys)"],
      pickB: ["Game studios & portfolios", "Indie games & release pages", "Esports teams & gaming communities", "Half-price long-term renewals"],
    },
  },
  "menu-vs-cafe": {
    slug: "menu-vs-cafe",
    a: "menu",
    b: "cafe",
    zh: {
      title: ".menu 和 .cafe 怎么选：一张菜单与一间咖啡馆的对比",
      metaDescription: ".menu 指菜单这个功能入口，.cafe 指咖啡馆这个场所。对比两个餐饮系后缀的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都在餐饮场上，指向不同。.menu 是功能入口——餐厅在线菜单页、扫码点餐系统、外卖与订餐平台用 name.menu，域名读出来就是「某某家的菜单」，最顺手的玩法是把它印进桌角二维码，顾客扫码直达菜单，比夹在官网深处的 PDF 好一个量级，且不绑定业态，正餐、酒吧、奶茶店都能用；Wedding TLD2 注册局运营（GoDaddy Registry 平台），注册约 $27、续费约 $27/年——注册续费同价，成本透明。.cafe 是场所招牌——独立咖啡店、烘焙工作室、猫咖书咖用 name.cafe，域名和店招完全同构；它的气质还能外溢到线上：「cafe」在互联网语境里早就是「轻松聚集地」的代名词，读书会、语言角、开发者社区拿 name.cafe 做线上客厅比 .com 更有温度；Identity Digital 运营，注册约 $5、续费约 $42/年——首年友好、续费常规档，对实体店成本可忽略。判断标准：要解决的是「菜单这个入口」——扫码点餐、外卖菜单、菜品展示 → .menu 的功能词最点题；要立的是「店这个场所」——咖啡馆官网、店铺品牌、线上社区客厅 → .cafe 的场所词更有画面。开咖啡店的最优组合其实是两个都用：name.cafe 做店铺门面、name.menu 印进二维码直达菜单，分工天然。注意 .menu 长期持有约 $27/年 vs .cafe 约 $42/年，功能词反而便宜；.cafe 行业气质浓，与「休闲聚集」无关的业务用它会显得错位；餐饮是强本地行业，两边都能靠「城市/街区 + 后缀」接住本地搜索，菜单页也建议与本地点评平台并行。",
      pickA: ["扫码点餐与桌角二维码", "餐厅在线菜单页", "外卖与订餐平台", "注册续费同价的透明成本"],
      pickB: ["独立咖啡店与烘焙工作室", "猫咖书咖等主题店", "线上社区的「客厅」站", "「店名/意象词 + .cafe」招牌命名"],
    },
    en: {
      title: ".menu vs .cafe: The Card or The Corner Shop",
      metaDescription:
        ".menu names the functional doorway; .cafe names the place itself. Compare the two dining suffixes on semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both live in dining; the pointer differs. .menu is the functional doorway — restaurant menu pages, QR-code ordering systems, delivery and reservation platforms on name.menu read out as \"so-and-so's menu\", and the smoothest play is printing it into a table-corner QR code so guests scan straight to the card — an order of magnitude better than a PDF buried in a website — while binding to no format: fine dining, bars and bubble-tea shops all qualify; run by the Wedding TLD2 registry on the GoDaddy Registry platform at about $27 to register and $27/yr to renew — the same both ways, transparent cost. .cafe is the shop sign — independent coffee shops, roasteries and bakeries, cat and book cafés on name.cafe make the domain and the storefront read as one; the vibe travels online too — cafe has long meant \"a relaxed gathering place\" on the internet, so reading circles, language corners and developer communities wear name.cafe as a warmer living room than any .com; run by Identity Digital at about $5 to register and $42/yr to renew — a friendly first year, standard renewal, negligible against a physical shop's costs. The test: the job is the menu doorway — QR ordering, delivery menus, dish showcases → .menu's function word nails it; the job is the place — café brand sites, shop identity, online community living rooms → .cafe paints the scene. For a coffee shop the elegant play is both: name.cafe as the storefront, name.menu printed into the QR code — a natural division of labor. Note long-term holding runs about $27/yr on .menu versus $42/yr on .cafe — the function word is the cheaper one; .cafe carries a strong leisure air that mismatched businesses will feel; and dining is fiercely local, so city or neighborhood + suffix catches local search on either side, with menu pages best run alongside local review platforms.",
      pickA: ["QR ordering & table codes", "Restaurant online menus", "Delivery & reservation platforms", "Transparent same-price renewals"],
      pickB: ["Independent cafés & roasteries", "Cat & book café concepts", "Online community living rooms", "Shop-sign naming (corner.cafe)"],
    },
  },
  "law-vs-expert": {
    slug: "law-vs-expert",
    a: "law",
    b: "expert",
    zh: {
      title: ".law 和 .expert 怎么选：行业门牌与权威人设的对比",
      metaDescription: ".law 是法律行业的专属门牌，.expert 是跨领域的权威宣言。对比行业词与身份词的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都在卖专业，凭证不同。.law 是行业门牌——律师事务所、独立执业律师、法律科技产品用 name.law，法律行业讲信任，smith.law 比一长串 .com 更像一块烫金门牌；GoDaddy Registry 平台运营，注册约 $83、续费约 $83/年——注册续费同价，是本站较贵的后缀之一，但对客单价以万计的法律行业，这个门槛反而筛掉了垃圾站，让 .law 整体域名环境更干净。.expert 是权威人设——独立顾问、垂直咨询公司、深度评测与知识付费站用 name.expert，定位一秒立住，seo.expert、tax.expert 这样的「领域词 + .expert」组合就是一块数字招牌，法律之外任何领域都能用；Identity Digital 运营，注册约 $7、续费约 $50/年——首年引流、续费收割的典型定价，预算按续费核算。判断标准：身份是「执业律师/律所」——smith.law 的行业词即执业声明，贵一点的门牌换来的是同行罕有的干净环境；身份是「某领域的专家个体/小团队」——律师之外的顾问、评测人、知识付费作者 → .expert 的身份词覆盖面大得多，法律人做普法内容与个人 IP 也可以用它。价格结构值得注意：.law 约 $83/年 vs .expert 约 $50/年，都不便宜，但 .law 的门槛是有意为之的信任设计。注意「expert」是承诺，内容深度与案例撑不起时反而招致反感——空壳站用这个后缀会放大质疑；法律等监管行业的「专家」表述可能触碰广告合规，谨慎措辞；各法域对律师广告与网站有执业合规要求，.law 站上线前按当地律协规范自查。命名上「姓氏 + .law」「领域词 + .expert」是各自最强的形态。",
      pickA: ["律师事务所与执业律师", "法律科技产品", "「城市/领域 + .law」垂直站", "愿为干净环境付门槛的品牌"],
      pickB: ["独立顾问与咨询公司", "深度评测与知识付费", "法律之外的专业人设", "「领域词 + .expert」数字招牌"],
    },
    en: {
      title: ".law vs .expert: The Trade Plaque or The Authority Claim",
      metaDescription:
        ".law is the legal trade's reserved plaque; .expert is a cross-field authority statement. Compare the industry word and the identity word on semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both sell expertise; the credential differs. .law is the trade plaque — law firms, independent attorneys and legal-tech products on name.law build trust from the suffix up: smith.law reads more like a brass nameplate than any long .com; run on the GoDaddy Registry platform at about $83 to register and $83/yr to renew — the same both ways and among this site's priciest, but against legal-industry ticket sizes the threshold works as a filter, keeping the .law neighborhood notably clean. .expert is the authority claim — independent consultants, vertical advisory firms, deep-dive review and paid-knowledge sites on name.expert lock the positioning in one second, and field word + .expert (the seo.expert, tax.expert pattern) is a digital shingle any discipline can hang; run by Identity Digital at about $7 to register and $50/yr to renew — classic cheap-entry, harvest-on-renewal pricing, so budget on the renewal. The test: the identity is a practicing lawyer or firm — smith.law's industry word is itself a statement of practice, and the pricier plaque buys a cleaner neighborhood than most suffixes enjoy; the identity is an expert individual or small team in any field — consultants, reviewers, paid-knowledge authors beyond the bar → .expert's identity word stretches far wider, and even lawyers doing public-education content and personal brands can wear it. Watch the price structure: about $83/yr on .law versus $50/yr on .expert — neither is cheap, but .law's threshold is trust engineering by design. Note expert is a promise — thin content and missing case studies invite backlash, and an empty shell amplifies doubt under this suffix; regulated fields (law, medicine, finance) restrict expert claims in advertising, so phrase carefully; and every jurisdiction regulates attorney advertising and websites, so audit a .law site against local bar rules before launch. Naming: surname + .law and field word + .expert are each side's strongest patterns.",
      pickA: ["Law firms & practicing attorneys", "Legal-tech products", "City or practice-area + .law verticals", "Brands paying for a clean neighborhood"],
      pickB: ["Independent consultants & advisories", "Deep reviews & paid knowledge", "Expert brands beyond the bar", "Digital-shingle naming (seo.expert)"],
    },
  },
  "com-vs-travel": {
    slug: "com-vs-travel",
    a: "com",
    b: "travel",
    zh: {
      title: ".com 和 .travel 怎么选：万能牌与行业老牌的取舍",
      metaDescription: ".com 认知度最高，.travel 是 2005 年就有的旅游行业专属后缀。对比两者的信任来源、价格与命名空间差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "看信任从哪来：.com 的信任来自二十多年的大众认知，任何行业都通用，续费便宜、转售流动性最好，但旅游类好名字几乎绝迹——目的地词、玩法词在 .com 下不是天价就是被停放。.travel 的信任来自行业身份：2005 年就诞生、早年仅限旅游行业实名注册，沉淀的行业站点让它的「圈内感」远超一般新后缀，japan.travel 式官方先例遍地，目的地词与玩法词库存都很好。代价是价格结构反过来——注册约 $16 不贵，续费约 $119/年 是明显的行业身份溢价，预算必须按续费算。务实策略：旅行社、目的地内容站、预订平台这类一眼旅游的业务，用「目的地/玩法 + .travel」拿到点题短名先跑起来；面向大众的品牌主站、或计划扩到旅游之外的公司，.com 仍是不可替代的底牌，成熟品牌通常两个都持有——.travel 做行业站，.com 防流失并 301。",
      pickA: ["面向大众的品牌主站", "业务可能扩到旅游之外", "在意续费成本与转售流动性", "用户以口口相传/直接输入为主"],
      pickB: ["旅行社与定制游工作室", "目的地攻略与旅游内容站", "心仪的目的地词 .com 已绝迹", "想要行业老牌后缀的圈内信任"],
    },
    en: {
      title: ".com vs .travel: The Universal Card or The Industry Veteran",
      metaDescription:
        ".com has universal recognition; .travel is the tourism industry's dedicated TLD since 2005. Compare trust sources, pricing and inventory, then hunt names available on both.",
      verdict:
        "It comes down to where trust originates. .com earns it from two decades of universal recognition — works in any industry, renews cheap, resells best — but good travel names are gone: destination and activity words under .com are parked or priced for ransom. .travel earns it from industry identity: launched in 2005 and restricted to verified travel businesses in its early years, its namespace accumulated genuine industry sites and carries more insider credibility than typical new suffixes, with official japan.travel-style precedents everywhere and deep inventory of destination and activity words. The price structure inverts: about $16 to register but $119/yr to renew — a clear industry-identity premium, so budget strictly on the renewal. The pragmatic play: unmistakably travel businesses — agencies, destination content, booking platforms — grab the on-target destination + .travel name and launch; consumer brand homes or companies that may expand beyond travel keep .com as the irreplaceable base card. Established brands hold both — .travel for the industry site, .com defensively with a 301.",
      pickA: ["Consumer-facing brand homes", "Business may expand beyond travel", "Renewal-cost and resale sensitive", "Word-of-mouth or type-in traffic"],
      pickB: ["Travel agencies & tour studios", "Destination guides & travel content", "Your destination word is extinct on .com", "Want the veteran suffix's insider trust"],
    },
  },
  "travel-vs-tours": {
    slug: "travel-vs-tours",
    a: "travel",
    b: "tours",
    zh: {
      title: ".travel 和 .tours 怎么选：行业词与产品词的分工",
      metaDescription: ".travel 泛指旅游行业，.tours 专指线路与导览产品。对比两者的语义颗粒度、价格结构与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "分工在颗粒度：.travel 是行业词——旅行社、目的地内容站、预订平台、签证服务，只要生意属于旅游业都装得下，2005 年老牌后缀的信任底子也更厚；.tours 是产品词——一日游、包车路线、徒步向导、美食团，卖的就是「带你走一趟」这件事，本地向导与体验运营商用它指向更准，「目的地 + .tours」读出来就是「某地的团」。价格差异同样明显：.travel 注册约 $16、续费约 $119/年，是六个字母换行业身份的溢价；.tours 注册约 $6、续费约 $50/年，首年便宜、续费跳档但仍不到 .travel 的一半。判断标准：业务线多于「带团」这一种——做内容、订房、签证、定制游的综合旅游生意 → .travel 的行业词覆盖面才够；产品就是线路与导览本身——城市走读、美食团、登山向导 → .tours 更点题也更省钱。注意 .tours 天然复数，暗示多条线路；单一签名式体验用 .travel 或单数语义的名字反而更贴。两个后缀都是 Identity Digital 运营、库存都好，先想清楚卖的是行业还是产品，再去猎名。",
      pickA: ["综合旅游业务（内容+预订+定制）", "目的地攻略与旅游媒体", "想要 2005 老牌后缀的信任底子", "品牌词计划长期覆盖多条业务线"],
      pickB: ["一日游与包车路线", "城市走读与美食团", "徒步登山等户外向导", "预算敏感、按产品线建站"],
    },
    en: {
      title: ".travel vs .tours: The Industry Word or The Product Word",
      metaDescription:
        ".travel means the tourism industry at large; .tours means routes and guided experiences. Compare semantic granularity, pricing and fit, then hunt names available on both.",
      verdict:
        "The split is granularity. .travel is the industry word — agencies, destination content, booking platforms, visa services: anything inside tourism fits, and the 2005 veteran's trust base runs deeper. .tours is the product word — day trips, chartered routes, hiking guides, food tours: it sells exactly the thing itself, so local guides and experience operators aim truer here; destination + .tours reads out as \"tours of that place\". Pricing diverges just as clearly: .travel is about $16 to register and $119/yr to renew — a premium for industry identity; .tours is about $6 and $50/yr — a cheap first year with a renewal jump that still lands under half of .travel. The test: the business spans more than guided trips — content, lodging, visas, bespoke planning → only .travel's industry word covers it all; the product is the route or guided experience itself — city walks, food tours, mountain guides → .tours is more on-target and cheaper. Note .tours is inherently plural, implying multiple routes; a single signature experience may read better on .travel or a singular-flavored name. Both run on Identity Digital with excellent inventory — decide whether you're selling the industry or the product, then hunt.",
      pickA: ["Full-stack travel businesses", "Destination guides & travel media", "Want the 2005 veteran's trust base", "Brand spans multiple business lines"],
      pickB: ["Day trips & chartered routes", "City walks & food tours", "Hiking & outdoor guides", "Budget-sensitive, per-product sites"],
    },
  },
  "vacations-vs-holiday": {
    slug: "vacations-vs-holiday",
    a: "vacations",
    b: "holiday",
    zh: {
      title: ".vacations 和 .holiday 怎么选：度假场景与节庆语义的分野",
      metaDescription: ".vacations 专指度假旅行，.holiday 还覆盖节庆礼赠与假日营销。对比两者的语义、价格与续费差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两个词都带「放假」的情绪，分野在语义宽度：.vacations 专指度假旅行——度假套餐、海岛游、度假村与民宿集群、亲子蜜月主题游，用户搜度假产品时的心理状态正好被这个词接住；.holiday 一词两义——英式语境是「度假」，更普适的语义是「节日」，圣诞新年礼品电商、假日营销活动页、节庆策划用它反而比 vacations 更贴，节日氛围从域名就开始。价格差异值得算清：两者注册都约 $6，但 .vacations 续费约 $31/年、在行业后缀里算温和，.holiday 续费约 $52/年、跳档明显——长期持有 .vacations 压力小得多。判断标准：卖的是「住下来慢慢玩」的旅行产品 → .vacations 语义更专一、续费更便宜；做节庆礼赠、假日限定企划、活动页矩阵 → .holiday 的节日语义是 vacations 完全覆盖不了的。两个注意：.holiday 是单数，别与 .holidays 拼混；美式语境里 holiday 首先指节日，面向北美用户按节庆语义命名更稳。命名上「目的地 + .vacations」（maldives.vacations 式）与「节日 + .holiday」（christmas.holiday 式）各是两边最强的模式。",
      pickA: ["度假套餐与海岛游", "度假村与民宿集群", "亲子与蜜月主题游", "在意续费成本的长期持有"],
      pickB: ["节日礼品与假日营销", "节庆活动策划", "假日限定企划与活动页", "英式「度假」语境的出行产品"],
    },
    en: {
      title: ".vacations vs .holiday: The Getaway Word or The Festive Word",
      metaDescription:
        ".vacations strictly means leisure travel; .holiday also covers seasonal gifting and festive campaigns. Compare semantics, pricing and renewals, then hunt names available on both.",
      verdict:
        "Both words carry the time-off mood; the split is semantic width. .vacations strictly means leisure travel — vacation packages, island trips, resorts and lodging clusters, family and honeymoon themes — catching exactly the state of mind of someone shopping for a getaway. .holiday carries two meanings: the British getaway, and the more universal festive one — Christmas and New Year gift shops, holiday marketing pages and festive event planners fit .holiday better than vacations ever could, with the celebration starting from the address itself. Do the pricing math: both register at about $6, but .vacations renews at about $31/yr — among the gentler industry renewals — while .holiday jumps to about $52/yr, so .vacations is meaningfully cheaper to hold long term. The test: selling settle-in-and-unwind travel products → .vacations is the purer word with the cheaper renewal; selling seasonal gifting, festive limited runs or a campaign-page fleet → .holiday's festive sense is something vacations cannot cover. Two cautions: .holiday is singular — don't blur it with .holidays; and in American usage holiday means the festival first, so name by the festive sense for North American audiences. Naming: destination + .vacations (maldives.vacations) and festival + .holiday (christmas.holiday) are each side's strongest patterns.",
      pickA: ["Vacation packages & island trips", "Resorts & lodging clusters", "Family & honeymoon themes", "Renewal-cost-sensitive long holds"],
      pickB: ["Seasonal gifts & holiday marketing", "Festive event planning", "Limited-run holiday campaigns", "British-sense getaway products"],
    },
  },
  "flights-vs-travel": {
    slug: "flights-vs-travel",
    a: "flights",
    b: "travel",
    zh: {
      title: ".flights 和 .travel 怎么选：垂直航段与行业全域的取舍",
      metaDescription: ".flights 只管「飞」这一段，.travel 覆盖整个旅游行业。对比两者的指向精度、价格结构与合规注意，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "分工在覆盖面：.flights 是旅游家族里最垂直的后缀——机票比价、航线攻略、里程玩法社区、包机与商务航空，只管天上这一段，「目的地 + .flights」直接接住「飞某地」的搜索意图；.travel 是行业全域——旅行社、目的地内容、订房、签证都装得下，2005 年老牌后缀的信任底子也更厚。价格结构是少见的反差：.flights 注册约 $31、续费约 $47/年，首年偏贵但续费平缓；.travel 注册约 $16 便宜、续费约 $119/年 是明显溢价——按五年总持有成本算，.flights 反而便宜一半以上。判断标准：产品就是机票与航空周边——比价、低价订阅、里程内容、包机 → .flights 指向最准、长期成本更低；业务覆盖行程多个环节、或以目的地内容为主 → .travel 的行业词才够宽。两个注意：机票分销有资质门槛（IATA/代理协议），无资质先做内容与比价导流更稳；机票比价巨头林立，独立站要靠里程玩法、错峰攻略这类差异化内容立足。命名上「目的地 + .flights」（tokyo.flights 式）与「目的地 + .travel」（japan.travel 式）各是两边最点题的模式。",
      pickA: ["机票比价与低价订阅提醒", "航线攻略与里程玩法社区", "包机与商务航空", "按五年持有成本算更省"],
      pickB: ["综合旅游业务（内容+预订+签证）", "目的地攻略与旅游媒体", "旅行社与定制游", "想要行业老牌的圈内信任"],
    },
    en: {
      title: ".flights vs .travel: The Vertical Leg or The Whole Industry",
      metaDescription:
        ".flights covers only the airborne leg; .travel covers the tourism industry at large. Compare targeting precision, pricing structure and compliance notes, then hunt names available on both.",
      verdict:
        "The split is coverage. .flights is the most vertical suffix in the travel family — fare comparison, route guides, miles-hacking communities, charter and business aviation: it covers only the airborne leg, and destination + .flights catches \"flights to that place\" search intent head-on. .travel is the whole industry — agencies, destination content, lodging, visas all fit, with the 2005 veteran's deeper trust base. The pricing structure is an unusual inversion: .flights is about $31 to register but a gentle $47/yr to renew; .travel is a cheap $16 in but a premium $119/yr — over a five-year hold, .flights costs less than half. The test: the product is airfare and aviation-adjacent — comparison, cheap-fare alerts, miles content, charters → .flights aims truest and holds cheaper; the business spans multiple legs of the trip or leads with destination content → only .travel's industry word is wide enough. Two cautions: airfare distribution is licence-gated (IATA/agency agreements) — without credentials, content and comparison referral is the safer entry; and fare comparison is giant-dominated (Google Flights, Skyscanner), so independents win on differentiated content like miles hacking and off-peak guides. Naming: destination + .flights (tokyo.flights) and destination + .travel (japan.travel) are each side's on-target patterns.",
      pickA: ["Fare comparison & cheap-fare alerts", "Route guides & miles hacking", "Charter & business aviation", "Cheaper on five-year holding cost"],
      pickB: ["Full-stack travel businesses", "Destination guides & travel media", "Agencies & bespoke tours", "Want the veteran's insider trust"],
    },
  },
  "tours-vs-vacations": {
    slug: "tours-vs-vacations",
    a: "tours",
    b: "vacations",
    zh: {
      title: ".tours 和 .vacations 怎么选：走线路与住下来的场景分工",
      metaDescription: ".tours 是带你走线路的产品词，.vacations 是住下来度假的场景词。对比两者的语义、价格与续费差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两个都是旅游产品词，分工在场景：.tours 是「带你走一趟」——一日游、包车路线、城市走读、美食团、徒步向导，卖的是路线与导览这件具体的事，「目的地 + .tours」读出来就是「某地的团」；.vacations 是「住下来慢慢玩」——度假套餐、海岛游、度假村与民宿集群、亲子蜜月主题，后缀自带「放松、犒赏自己」的情绪价值。价格上两者注册都约 $6，续费差一档：.tours 约 $50/年，.vacations 约 $31/年——vacations 是行业后缀里少有的温和续费，长期持有压力更小。判断标准：产品按「行程」卖——有集合时间、路线图、向导带队 → .tours 更点题；产品按「假期」卖——住宿为核心、节奏自由、套餐打包 → .vacations 情绪更对。两个注意：.tours 天然复数暗示多条线路，单一签名体验用单数语义的名字更贴；.vacations 九个字母偏长，适合线上获客与广告落地页，口头传播弱。命名上「目的地 + .tours」（paris.tours 式）、「主题 + .tours」（food.tours 式）与「目的地 + .vacations」（maldives.vacations 式）、「主题 + .vacations」（ski.vacations 式）各是两边最强的模式，同一目的地词不妨两边都查一下库存。",
      pickA: ["一日游与包车路线", "城市走读与美食团", "徒步登山等户外向导", "按行程/路线组织的产品"],
      pickB: ["度假套餐与海岛游", "度假村与民宿集群", "亲子与蜜月主题游", "在意续费成本的长期持有"],
    },
    en: {
      title: ".tours vs .vacations: The Route or The Stay",
      metaDescription:
        ".tours sells the guided route; .vacations sells the settle-in getaway. Compare semantics, pricing and renewals, then hunt names available on both.",
      verdict:
        "Both are travel product words; the split is the scenario. .tours means taking you on a trip — day trips, chartered routes, city walks, food tours, hiking guides: it sells the route and the guiding itself, and destination + .tours reads out as \"tours of that place\". .vacations means settling in and unwinding — vacation packages, island trips, resorts and lodging clusters, family and honeymoon themes — with built-in emotional value of relaxation and treating yourself. Both register at about $6; renewals differ by a tier: .tours at about $50/yr versus .vacations at about $31/yr — one of the gentler industry renewals, cheaper to hold long term. The test: the product is sold as an itinerary — meeting points, route maps, a guide leading the way → .tours is on-target; the product is sold as a holiday — lodging at the core, free-form pace, bundled packages → .vacations hits the mood. Two cautions: .tours is inherently plural and implies multiple routes, so a single signature experience may read better under a singular-flavored name; and .vacations runs nine letters — strong for online acquisition and ad landing pages, weak by word of mouth. Naming: destination + .tours (paris.tours) and theme + .tours (food.tours) versus destination + .vacations (maldives.vacations) and theme + .vacations (ski.vacations) are each side's strongest patterns — check the same destination word on both.",
      pickA: ["Day trips & chartered routes", "City walks & food tours", "Hiking & outdoor guides", "Itinerary-shaped products"],
      pickB: ["Vacation packages & island trips", "Resorts & lodging clusters", "Family & honeymoon themes", "Renewal-cost-sensitive long holds"],
    },
  },
  "taxi-vs-city": {
    slug: "taxi-vs-city",
    a: "taxi",
    b: "city",
    zh: {
      title: ".taxi 和 .city 怎么选：接送专线与城市门户的分工",
      metaDescription: ".taxi 把打车接送写进域名，.city 是城市门户与本地生活的地理词。对比两者的语义、价格与本地打法，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两个都吃本地流量，分工在业务形态：.taxi 是服务词——本地车队、机场接送、景区酒店接驳、代驾小车队，「城市 + .taxi」读出来就是「某城打车」，且 taxi 在几十种语言里拼法几乎一致，是少有的天然无语言门槛的行业词；.city 是地理词——城市指南、本地新闻、活动日历、生活服务聚合，「城市名 + .city」做的是一座城的门户，还有「××之城」的比喻用法可以把主题做成一座城。价格上 .taxi 注册约 $6、续费约 $50/年，首年便宜续费跳档；.city 注册约 $5、续费约 $23/年，是长期成本最低的档位之一。判断标准：卖的是「送你去」这项服务——预约接送、企业包车、机场专线 → .taxi 点题且有 berlin.taxi 式大量同行先例；做的是「这座城」的内容与聚合——指南、活动、本地商户 → .city 覆盖面宽、续费便宜得多。两个注意：即时叫车主战场在超级 App（Uber、滴滴），.taxi 独立站适合预约制直客生意，别硬拼即时叫车；城市名可能涉及地方政府与商标保护，.city 官方口径的名称要先查清。命名上「城市 + .taxi」「机场码 + .taxi」（jfk.taxi 式）与「城市拼音 + .city」「品类词 + .city」各是两边最自然的模式。",
      pickA: ["本地出租车与网约车队", "机场接送与包车专线", "景区与酒店接驳", "面向多语言游客的接送服务"],
      pickB: ["城市指南与本地门户", "活动日历与本地新闻", "生活服务聚合", "「××之城」主题社区"],
    },
    en: {
      title: ".taxi vs .city: The Ride Service or The City Portal",
      metaDescription:
        ".taxi writes the ride into the address; .city is the geographic word for city portals and local life. Compare semantics, pricing and local playbooks, then hunt names available on both.",
      verdict:
        "Both feed on local traffic; the split is the business shape. .taxi is the service word — local fleets, airport transfers, resort and hotel shuttles, designated-driver crews: city + .taxi reads out as \"a cab in that city\", and taxi is spelled nearly identically across dozens of languages — one of the rare industry words with no language barrier. .city is the geographic word — city guides, local news, event calendars, life-service aggregators: cityname + .city builds the portal of a place, plus the metaphorical \"city of X\" pattern that turns any theme into a town. Pricing: .taxi is about $6 to register and $50/yr to renew — cheap in, renewal jump; .city is about $5 and $23/yr — one of the cheapest long-term holds around. The test: selling the ride itself — scheduled transfers, corporate charters, airport routes → .taxi is on-target with plenty of berlin.taxi-style industry precedent; building content and aggregation about the place — guides, events, local merchants → .city covers far more ground at less than half the renewal. Two cautions: on-demand hailing belongs to the super-apps (Uber, Didi) — a .taxi independent site wins at scheduled direct bookings, not instant rides; and city names can implicate local governments and trademarks, so clear official-sounding names first. Naming: city + .taxi and airport code + .taxi (jfk.taxi) versus city + .city and category word + .city are each side's most natural patterns.",
      pickA: ["Local cab & ride-hail fleets", "Airport transfers & charters", "Resort & hotel shuttles", "Multilingual tourist-facing rides"],
      pickB: ["City guides & local portals", "Event calendars & local news", "Life-service aggregators", "\"City of X\" theme communities"],
    },
  },
  "properties-vs-estate": {
    slug: "properties-vs-estate",
    a: "properties",
    b: "estate",
    zh: {
      title: ".properties 和 .estate 怎么选：资产清单与行业门牌的分工",
      metaDescription: ".properties 指多套物业的资产组合，.estate 是房产行业的门牌词。对比两者的语义、价格与命名模式差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两个都是房产后缀，分工在语气：.properties 是资产词——中介的在售组合、物业管理公司、开发商的楼盘列表、投资组合展示，复数形式天然指「多套物业」，name.properties 读起来就是一份资产清单；.estate 是行业词——real estate 的行业身份直接长在后缀上，经纪个人品牌、精品中介、豪宅盘源用 name.estate 更像一块门牌，单数形式也压得住「某某庄园/宅邸」的高端叙事。价格几乎打平：.properties 注册约 $6、续费约 $31/年，.estate 注册约 $8、续费约 $31/年——都是首年便宜、续费跳档的典型结构，预算按续费算。判断标准：展示的是「一批房源/物业」——组合列表、托管清单、楼盘页 → .properties 的复数语义最贴；打的是「行业身份/个人招牌」——经纪团队、豪宅专家、家族资产品牌 → .estate 更短更好念、门牌感更强。两个注意：.properties 十个字母偏长，适合落地页与投放而非口播；.estate 有「庄园」的第二语义，酒庄、民宿庄园借用也成立，命名时留意歧义。命名上「城市/区域 + .properties」（miami.properties 式）与「姓氏/品牌 + .estate」（smith.estate 式）各是两边最点题的模式。",
      pickA: ["中介在售组合与房源列表", "物业管理与托管清单", "开发商楼盘展示页", "房产投资组合"],
      pickB: ["经纪个人品牌与团队门牌", "豪宅与高端盘源", "家族资产与庄园叙事", "在意更短更好念的后缀"],
    },
    en: {
      title: ".properties vs .estate: The Portfolio Word or The Trade Plaque",
      metaDescription:
        ".properties means a portfolio of real assets; .estate is the trade plaque of the real-estate industry. Compare semantics, pricing and naming patterns, then hunt names available on both.",
      verdict:
        "Both are real-estate suffixes; the split is the register. .properties is the asset word — an agency's active listings, property management firms, a developer's project list, investment portfolios: the plural inherently means multiple units, and name.properties reads like an asset sheet. .estate is the trade word — real estate's industry identity lives right in the suffix, so broker personal brands, boutique agencies and luxury listings wear name.estate like a plaque, and the singular also carries the manor-and-mansion narrative for high-end positioning. Pricing is nearly a wash: .properties about $6 to register and $31/yr to renew, .estate about $8 and $31/yr — both the classic cheap-first-year, renewal-jump structure, so budget on the renewal. The test: showing a batch of listings or managed units — portfolio lists, management inventories, development pages → .properties' plural semantics fit best; leading with trade identity or a personal shingle — broker teams, luxury specialists, family-asset brands → .estate is shorter, easier to say and more plaque-like. Two cautions: at ten letters .properties suits landing pages and campaigns over word of mouth; and .estate carries a second manor meaning — wineries and estate lodges borrow it too, so mind the ambiguity when naming. Naming: city or district + .properties (miami.properties) versus surname or brand + .estate (smith.estate) are each side's on-target patterns.",
      pickA: ["Agency listing portfolios", "Property management inventories", "Developer project showcases", "Property investment portfolios"],
      pickB: ["Broker personal brands & team plaques", "Luxury & high-end listings", "Family-asset & manor narratives", "Want the shorter, easier-said suffix"],
    },
  },
  "apartments-vs-rentals": {
    slug: "apartments-vs-rentals",
    a: "apartments",
    b: "rentals",
    zh: {
      title: ".apartments 和 .rentals 怎么选：房型词与交易词的分工",
      metaDescription: ".apartments 锁定公寓这一种房型，.rentals 覆盖一切出租生意。对比两者的语义颗粒度、价格与续费差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "分工在颗粒度：.apartments 是房型词——长租公寓品牌、服务式公寓、楼盘招租页、学生公寓运营商，锁死「公寓」这一种物业形态，招租页与搜索意图几乎完全对齐；.rentals 是交易词——从房子到相机、从婚纱到脚手架，一切按天按月收费的生意都装得下，是少有的横跨房产与实体租赁两个行业的后缀。价格差一档：.apartments 注册约 $11、续费约 $46/年，.rentals 注册约 $7、续费约 $36/年——都是首年便宜续费跳档，长期持有 .rentals 每年省 $10。判断标准：业务就是公寓——品牌公寓、楼盘招租、学生宿舍 → .apartments 指向最准，parkview.apartments 式楼盘名一眼就是招租页；出租的东西不止一种、或根本不是房子——民宿+车位、设备租赁、活动物品出租 → .rentals 的覆盖面才够。两个注意：两个词都是十个字母上下的长词，适合传单与落地页、不适合口播，命名时前缀尽量短；.apartments 在英联邦市场对应 flats 的说法，面向英式英语用户注意用词习惯。命名上「楼盘名/街区 + .apartments」（parkview.apartments 式）与「品类 + .rentals」（kayak.rentals 式）各是两边最点题的模式，同一个城市词不妨两边都查一下库存。",
      pickA: ["长租公寓品牌", "服务式公寓与楼盘招租", "学生公寓运营商", "只做公寓这一种房型"],
      pickB: ["民宿与短租运营", "汽车与设备租赁", "婚礼与活动物品出租", "在意续费成本的长期持有"],
    },
    en: {
      title: ".apartments vs .rentals: The Property Type or The Transaction Word",
      metaDescription:
        ".apartments locks onto one property type; .rentals covers anything for hire. Compare targeting precision, pricing and renewals, then hunt names available on both.",
      verdict:
        "The split is granularity. .apartments is the property-type word — long-term apartment brands, serviced apartments, development leasing pages, student housing operators: it locks onto one property form, so leasing pages align with search intent almost perfectly. .rentals is the transaction word — from homes to cameras, wedding dresses to scaffolding, anything charged by the day or month fits, one of the rare suffixes spanning both real estate and physical hire. Pricing differs by a tier: .apartments about $11 to register and $46/yr to renew, .rentals about $7 and $36/yr — both cheap in with a renewal jump, and .rentals saves $10 a year on a long hold. The test: the business is apartments — branded blocks, development leasing, student housing → .apartments aims truest, and a parkview.apartments-style building name reads as a leasing page at a glance; you rent out more than one thing, or not property at all — holiday lets plus parking, equipment hire, event rentals → only .rentals covers the ground. Two cautions: both words run about ten letters — good on flyers and landing pages, poor by word of mouth, so keep the prefix short; and .apartments maps to flats in Commonwealth English, so mind the vocabulary for British-English audiences. Naming: building or neighborhood + .apartments (parkview.apartments) versus category + .rentals (kayak.rentals) are each side's on-target patterns — check the same city word on both.",
      pickA: ["Long-term apartment brands", "Serviced apartments & development leasing", "Student housing operators", "Apartments are the only property type"],
      pickB: ["Holiday lets & short-stay hosts", "Car & equipment hire", "Wedding & event rentals", "Renewal-cost-sensitive long holds"],
    },
  },
  "properties-vs-rentals": {
    slug: "properties-vs-rentals",
    a: "properties",
    b: "rentals",
    zh: {
      title: ".properties 和 .rentals 怎么选：卖与租两种生意的分工",
      metaDescription: ".properties 指向买卖与托管的资产端，.rentals 指向按天按月收租的生意端。对比两者的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两个都吃房产流量，分工在生意模式：.properties 站资产端——中介在售组合、物业托管、开发商楼盘、投资组合，语境是「买卖与持有」，name.properties 读起来是一份资产清单；.rentals 站生意端——民宿短租、长租平台、汽车与设备租赁，语境是「按天按月收租」，name.rentals 直接告诉访客这里的东西是租的。价格接近：.properties 注册约 $6、续费约 $31/年，.rentals 注册约 $7、续费约 $36/年——同为首年便宜续费跳档，预算都按续费算。判断标准：核心动作是「卖/托管」——挂盘源、做楼盘页、管物业 → .properties 的资产语义更对；核心动作是「出租」——短租直订、租赁下单、按期收费 → .rentals 点题且不限于房子，相机、婚纱、脚手架都装得下。两个注意：同时做买卖与租赁的综合中介，通常 .properties 做主站、租赁线用子目录或再配一个 .rentals 分流；短租直订站记得把 Airbnb 等平台的评价沉淀到自己域名下，域名才有复利。命名上「城市/区域 + .properties」（miami.properties 式）与「品类 + .rentals」（kayak.rentals 式）各是两边最自然的模式。",
      pickA: ["中介在售盘源与楼盘页", "物业托管与资产管理", "房产投资组合", "核心动作是买卖与持有"],
      pickB: ["民宿与短租直订站", "长租与租房平台", "汽车/设备/物品租赁", "核心动作是按期收租"],
    },
    en: {
      title: ".properties vs .rentals: Selling Assets or Renting Them Out",
      metaDescription:
        ".properties sits on the buy-and-hold asset side; .rentals sits on the charge-by-the-day business side. Compare semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both feed on property traffic; the split is the business model. .properties sits on the asset side — agency listings, managed portfolios, developer projects, investment holdings: the context is buying, selling and holding, and name.properties reads like an asset sheet. .rentals sits on the business side — holiday lets, long-term rental platforms, car and equipment hire: the context is charging by the day or month, and name.rentals tells visitors upfront that things here are for hire. Pricing is close: .properties about $6 to register and $31/yr to renew, .rentals about $7 and $36/yr — both cheap in with a renewal jump, so budget on renewals. The test: the core action is selling or managing — listing inventory, development pages, property management → .properties' asset semantics fit; the core action is renting out — direct-booking short stays, hire checkouts, recurring charges → .rentals is on-target and not limited to property: cameras, dresses and scaffolding all fit. Two cautions: an agency doing both sales and lettings usually runs .properties as the main site with rentals in a subdirectory or a companion .rentals; and direct-booking rental sites should consolidate Airbnb-style reviews under their own domain so the name compounds. Naming: city or district + .properties (miami.properties) versus category + .rentals (kayak.rentals) are each side's most natural patterns.",
      pickA: ["Agency listings & development pages", "Property management & asset holding", "Property investment portfolios", "Core action is buying & selling"],
      pickB: ["Holiday lets & direct-booking stays", "Long-term rental platforms", "Car/equipment/goods hire", "Core action is recurring rent"],
    },
  },
  "builders-vs-construction": {
    slug: "builders-vs-construction",
    a: "builders",
    b: "construction",
    zh: {
      title: ".builders 和 .construction 怎么选：施工班组与工程公司的分工",
      metaDescription: ".builders 是干活的人，.construction 是正式的工程机构。对比两者的语气、价格与命名模式差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两个都是建筑后缀，分工在语气：.builders 是「人」——施工承包班组、自建房与装修团队、定制建造商，复数形式读起来就是一支队伍，还有一层科技红利：builder 在互联网语境里指开发者/创造者，indie hacker 社区用它同样成立；.construction 是「机构」——建筑工程公司、总包分包、基建市政，是新顶级域里最正式的建筑后缀，投标资料与集团子品牌都压得住。价格上 .builders 注册约 $5、续费约 $28/年，是这批建筑后缀里续费最低的；.construction 注册约 $9、续费约 $31/年——差距不大，选择主要看语气而非预算。判断标准：以团队示人——本地施工队、装修班组、姓氏招牌 → .builders 更亲切，smith.builders 式是海外承包商的常见签名；以公司示人——投标、总包、机构官网 → .construction 的正式感才压得住。两个注意：.construction 十二个字母是现役最长的行业后缀之一，适合印在投标书与官网、不适合口播与手机输入；.builders 词义横跨工地与键盘，首屏要立刻讲清做哪种「建造」。最顺的分工其实是并用：公司官网用 .construction，班组与工匠线用 .builders。命名上「姓氏 + .builders」与「公司名 + .construction」（acme.construction 式）各是两边最点题的模式。",
      pickA: ["本地施工队与装修班组", "自建房与定制建造商", "姓氏招牌的承包商", "开发者社区与创客团队"],
      pickB: ["建筑工程公司官网", "总包与分包投标资料", "基建与市政工程", "集团子品牌与机构形象"],
    },
    en: {
      title: ".builders vs .construction: The Crew or The Firm",
      metaDescription:
        ".builders is the people who build; .construction is the formal engineering institution. Compare tone, pricing and naming patterns, then hunt names available on both.",
      verdict:
        "Both are construction suffixes; the split is the tone. .builders is the people — contracting crews, custom-home and renovation teams, bespoke builders: the plural reads as a squad, plus a tech bonus — builder means developer/creator in internet parlance, so indie-hacker communities wear it just as well. .construction is the institution — engineering firms, general and sub-contractors, infrastructure and civil works: the most formal construction suffix among new gTLDs, at home on bid documents and group sub-brands. Pricing: .builders about $5 to register and $28/yr to renew — the cheapest renewal in the property-and-construction batch; .construction about $9 and $31/yr — close enough that tone, not budget, should decide. The test: showing up as a team — local crews, renovation squads, surname shingles → .builders feels right, and smith.builders is the classic overseas contractor signature; showing up as a company — bids, general contracting, corporate sites → only .construction's formality carries it. Two cautions: at twelve letters .construction is among the longest industry suffixes in service — fine on bid documents, poor for word of mouth and mobile typing; and .builders spans the job site and the keyboard, so say which kind of building you do above the fold. The natural split is to use both: company site on .construction, crews and craftsmen on .builders. Naming: surname + .builders versus company name + .construction (acme.construction) are each side's on-target patterns.",
      pickA: ["Local crews & renovation squads", "Custom-home & bespoke builders", "Surname-shingle contractors", "Maker & developer communities"],
      pickB: ["Construction firm corporate sites", "General & sub-contractor bids", "Infrastructure & civil works", "Group sub-brands & institutional image"],
    },
  },
  "repair-vs-services": {
    slug: "repair-vs-services",
    a: "repair",
    b: "services",
    zh: {
      title: ".repair 和 .services 怎么选：修一件事与包一揽子的分工",
      metaDescription: ".repair 把「修什么」写进域名，.services 覆盖一切服务型生意。对比两者的搜索意图、价格与定位差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "分工在颗粒度：.repair 是动作词——手机电脑维修、家电维修、汽修保养，接的是全网最高意图的一类搜索：东西坏了的人马上要找人修，「品类 + repair」正是他们的搜索原文，iphone.repair 式域名等于把搜索词注册成门牌；.services 是行业词——清洁、搬家、IT 外包、咨询、维修都装得下，一个后缀覆盖一切服务型生意，适合业务线多于一种的公司。价格几乎打平：.repair 注册约 $8、续费约 $29/年，.services 注册约 $9、续费约 $31/年——同为首年便宜续费跳档，预算按续费算。判断标准：只干「修」这一件事、且品类明确——手机、家电、汽车 → .repair 指向最准、点击意图最高；服务不止维修一种——维修+安装+保养打包、综合家政、外包公司 → .services 的覆盖面才够，也免得业务扩了域名跟不上。两个注意：维修是强本地生意，Google 商家资料与评价比域名更影响获客，域名的价值在把搜索词变成品牌；.services 语义太宽，前缀必须把行业说清（cleaning.services 式），否则等于什么都没说。命名上「品类 + .repair」（phone.repair 式）与「行业 + .services」（cleaning.services 式）各是两边最点题的模式。",
      pickA: ["手机与电脑维修店", "家电与家庭维修", "汽修与保养门店", "品类明确、只做维修"],
      pickB: ["综合家政与到家服务", "IT 外包与企业服务", "维修+安装+保养打包", "业务线可能继续扩张"],
    },
    en: {
      title: ".repair vs .services: The One Fix or The Full Bundle",
      metaDescription:
        ".repair writes what gets fixed into the address; .services covers every service business. Compare search intent, pricing and positioning, then hunt names available on both.",
      verdict:
        "The split is granularity. .repair is the action word — phone and computer shops, appliance fixes, auto repair: it catches some of the highest-intent searches on the web, because people with something broken need a fix now and category + repair is literally what they type — an iphone.repair-style name registers the search phrase as your storefront. .services is the industry word — cleaning, moving, IT outsourcing, consulting and repair all fit: one suffix for every service business, built for companies with more than one line. Pricing is nearly a wash: .repair about $8 to register and $29/yr to renew, .services about $9 and $31/yr — both cheap in with a renewal jump, so budget on renewals. The test: you do one thing — fix — in a clear category: phones, appliances, cars → .repair aims truest with the highest click intent; you offer more than repair — fix-install-maintain bundles, home services, outsourcing firms → only .services covers the ground, and it won't strand the domain when the business expands. Two cautions: repair is a fiercely local trade — business profiles and reviews win customers more than the domain, whose value is turning the search phrase into a brand; and .services is so broad the prefix must name the trade (cleaning.services), or the address says nothing at all. Naming: category + .repair (phone.repair) versus trade + .services (cleaning.services) are each side's on-target patterns.",
      pickA: ["Phone & computer repair shops", "Appliance & home fixes", "Auto repair & maintenance", "One clear category, repair only"],
      pickB: ["Home services & housekeeping", "IT outsourcing & business services", "Fix-install-maintain bundles", "Business lines likely to expand"],
    },
  },
  "apartments-vs-house": {
    slug: "apartments-vs-house",
    a: "apartments",
    b: "house",
    zh: {
      title: ".apartments 和 .house 怎么选：招租页与家宅品牌的分工",
      metaDescription: ".apartments 锁定公寓招租场景，.house 是更宽的家宅与品牌词。对比两者的语义、价格与命名模式差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "分工在场景：.apartments 是招租词——长租公寓品牌、服务式公寓、楼盘招租页、学生公寓，锁死「公寓出租」这一个场景，parkview.apartments 式楼盘名一眼就是招租页；.house 是家宅与品牌词——除了房产（独栋买卖、自建房、家装），它还有强烈的品牌用法：时尚屋、出版社、创意工作室、俱乐部都爱用 house 自称（design.house 式），场景比 .apartments 宽得多。价格上 .apartments 注册约 $11、续费约 $46/年；.house 注册约 $15、续费约 $36/年——.house 首年更贵但续费便宜 $10/年，长期持有反而更省。判断标准：业务就是公寓招租——品牌公寓、楼盘去化、学生宿舍 → .apartments 与搜索意图对得最齐；卖独栋、做家装、或根本是借「house」做品牌——工作室、厂牌、会员俱乐部 → .house 更短更好念、语义也更宽。两个注意：.apartments 十个字母偏长，适合传单与落地页、不适合口播；.house 的品牌用法与房产用法会互相干扰，首屏要立刻讲清自己是哪种「house」。命名上「楼盘名 + .apartments」（parkview.apartments 式）与「品牌词 + .house」（design.house 式）各是两边最点题的模式。",
      pickA: ["长租公寓品牌与楼盘招租", "服务式公寓与公寓式酒店", "学生公寓运营商", "只做公寓出租这一个场景"],
      pickB: ["独栋买卖与自建房", "家装与家居品牌", "创意工作室与厂牌（house 品牌用法）", "在意更短更好念、续费更低"],
    },
    en: {
      title: ".apartments vs .house: The Leasing Page or The House Brand",
      metaDescription:
        ".apartments locks onto apartment leasing; .house is the wider home-and-brand word. Compare semantics, pricing and naming patterns, then hunt names available on both.",
      verdict:
        "The split is the scenario. .apartments is the leasing word — long-term apartment brands, serviced apartments, development leasing pages, student housing: it locks onto one scenario, apartment rental, and a parkview.apartments-style building name reads as a leasing page at a glance. .house is the home-and-brand word — beyond property (single-family sales, custom homes, renovation), it carries a strong brand usage: fashion houses, publishing houses, creative studios and members' clubs all call themselves a house (design.house), so its range is far wider. Pricing: .apartments about $11 to register and $46/yr to renew; .house about $15 and $36/yr — pricier in but $10/yr cheaper to hold, so the long hold favors .house. The test: the business is apartment leasing — branded blocks, development absorption, student housing → .apartments aligns tightest with search intent; selling single-family homes, doing renovation, or borrowing house as a brand — studios, labels, clubs → .house is shorter, easier to say and semantically wider. Two cautions: at ten letters .apartments suits flyers and landing pages over word of mouth; and .house's brand and property usages interfere, so say which kind of house you are above the fold. Naming: building name + .apartments (parkview.apartments) versus brand word + .house (design.house) are each side's on-target patterns.",
      pickA: ["Apartment brands & development leasing", "Serviced apartments & aparthotels", "Student housing operators", "Apartment leasing is the whole scenario"],
      pickB: ["Single-family sales & custom homes", "Renovation & home brands", "Studios & labels (the house brand usage)", "Want shorter, cheaper-to-hold"],
    },
  },
  "energy-vs-solar": {
    slug: "energy-vs-solar",
    a: "energy",
    b: "solar",
    zh: {
      title: ".energy 和 .solar 怎么选：全行业与单赛道的分工",
      metaDescription: ".energy 覆盖整个能源行业，.solar 锁定光伏一条赛道。对比两者的语义颗粒度、价格与续费差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "分工在颗粒度：.energy 是行业词——售电公司、虚拟电厂、储能与充电桩、能源科技与碳管理 SaaS 都装得下，name.energy 读出来就是「做能源的」，tesla.energy 式是行业标杆用法；.solar 是赛道词——光伏安装商、户用与工商业电站、组件与逆变器品牌、电站监控平台，锁死「太阳能」一条线，「城市 + solar」正是屋顶客户的搜索原文，本地安装商用它接搜索意图最准。价格差一档：.energy 注册约 $12、续费约 $93/年——续费是这批能源后缀里最贵的；.solar 注册约 $6、续费约 $52/年——长持每年省 $41，预算都按续费算。判断标准：业务横跨发电、售电、储能、充电多条线，或做能源行业平台 → .energy 的覆盖面才够，业务扩了域名不用换；只做光伏这一条赛道——安装、组件、监控 → .solar 指向更准、更便宜，austin.solar 式域名等于把搜索词注册成门牌。两个注意：能源是强监管行业，售电与并网资质比域名更影响信任，首屏放资质；.solar 还有「太阳的」本义，光热与天文项目借用也成立，命名时留意语境。命名上「品牌 + .energy」（tesla.energy 式）与「城市 + .solar」（austin.solar 式）各是两边最点题的模式。",
      pickA: ["售电公司与综合能源服务商", "储能、充电桩与多线业务", "能源科技与碳管理 SaaS", "业务可能继续扩张的平台"],
      pickB: ["光伏安装商与经销商", "户用与工商业电站", "组件与逆变器品牌", "在意续费成本的长持"],
    },
    en: {
      title: ".energy vs .solar: The Whole Industry or The Single Lane",
      metaDescription:
        ".energy covers the whole energy industry; .solar locks onto the photovoltaic lane. Compare semantic granularity, pricing and renewals, then hunt names available on both.",
      verdict:
        "The split is granularity. .energy is the industry word — electricity retailers, virtual power plants, storage and EV charging, energy-tech and carbon SaaS all fit: name.energy reads as an energy business, and tesla.energy is the industry-standard pattern. .solar is the lane word — solar installers and dealers, residential and commercial PV, panel and inverter brands, plant monitoring: it locks onto one lane, and city + solar is literally what rooftop customers type, so local installers catch search intent with precision. Pricing differs by a tier: .energy about $12 to register and $93/yr to renew — the priciest renewal among the energy suffixes; .solar about $6 and $52/yr — a $41/yr saving on a long hold, and both should be budgeted on the renewal. The test: the business spans generation, retail, storage or charging, or you run an energy-industry platform → only .energy covers the ground and won't strand the domain when you expand; you do solar and only solar — installation, panels, monitoring → .solar aims truer and costs less, and an austin.solar-style name registers the search phrase as your storefront. Two cautions: energy is a heavily regulated trade, so licenses and grid credentials build trust more than the domain — put them above the fold; and .solar also means of the sun, so solar-thermal and astronomy projects can borrow it — mind the context when naming. Naming: brand + .energy (tesla.energy) versus city + .solar (austin.solar) are each side's on-target patterns.",
      pickA: ["Electricity retailers & integrated energy services", "Storage, EV charging & multi-line businesses", "Energy-tech & carbon SaaS", "Platforms that may keep expanding"],
      pickB: ["Solar installers & dealers", "Residential & commercial PV plants", "Panel & inverter brands", "Renewal-cost-sensitive long holds"],
    },
  },
  "green-vs-eco": {
    slug: "green-vs-eco",
    a: "green",
    b: "eco",
    zh: {
      title: ".green 和 .eco 怎么选：形容词与认证徽章的分工",
      metaDescription: ".green 是人人可注册的绿色形容词，.eco 是需提交环保档案的带门槛后缀。对比两者的信任背书、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两个都是环保后缀，分工在门槛：.green 是形容词——绿色出行、绿色建筑、绿色电力、绿色包装都能修饰，人人可注册零门槛，品牌把可持续微站挂在 brand.green 是标准用法，主站照旧留 .com；.eco 是徽章——Big Room 运营、WWF 等环保组织背书，注册时需在 profiles.eco 提交环保承诺档案，这道门槛反而成了信任背书：挂 .eco 等于公开可查的环保立场，比自说自话的绿色文案硬得多。价格结构完全相反：.green 注册约 $7、续费约 $64/年——首年便宜续费跳档；.eco 注册约 $60、续费同价——全程透明无涨价陷阱，三年总持有成本反而是 .eco 略低。判断标准：绿色是品牌叙事的一部分——可持续产品线、ESG 专题站、环保营销活动 → .green 灵活便宜、修饰万物；环保是机构的身份本身——环保组织、气候行动项目、碳中和服务，且愿意公开承诺档案 → .eco 的门槛就是你的差异化。两个注意：漂绿监管趋严，.green 站上必须放认证与数据，否则形容词反成靶子；.eco 注册后要完成环保档案，否则域名可能被暂停解析。命名上「品牌 + .green」（可持续微站标准写法）与「组织/行动 + .eco」各是两边最点题的模式。",
      pickA: ["品牌可持续微站与 ESG 专题", "绿色出行、建筑、包装等垂类服务", "环保营销活动与内容站", "预算敏感、想先试后扩"],
      pickB: ["环保组织与气候行动项目", "碳中和与循环经济服务", "愿意公开环保承诺档案的品牌", "在意全程透明定价"],
    },
    en: {
      title: ".green vs .eco: The Adjective or The Vetted Badge",
      metaDescription:
        ".green is the open-to-all green adjective; .eco requires a public sustainability profile to register. Compare trust signals, pricing and fit, then hunt names available on both.",
      verdict:
        "Both are environmental suffixes; the split is the gate. .green is the adjective — green mobility, green building, green power, green packaging: it modifies everything, anyone can register, and parking the sustainability microsite on brand.green beside the .com flagship is the standard play. .eco is the badge — operated by Big Room and backed by WWF among others, registration requires filing a sustainability pledge at profiles.eco, and that gate becomes the endorsement: wearing .eco means a publicly auditable environmental stance, far harder currency than self-declared green copy. The pricing structures are opposites: .green about $7 to register and $64/yr to renew — cheap in, renewal jump; .eco about $60 with the same renewal — transparent all the way, and over three years .eco actually totals slightly less. The test: green is part of the brand story — sustainable product lines, ESG microsites, environmental campaigns → .green is flexible, cheap to start and modifies anything; the environment is the institution's identity — environmental nonprofits, climate-action projects, carbon-neutral services willing to publish the pledge → .eco's gate is your differentiation. Two cautions: greenwashing rules are tightening, so a .green site needs certifications and data on the page or the adjective backfires; and .eco registrants must complete the profile or the domain can be suspended. Naming: brand + .green (the standard sustainability-microsite pattern) versus organization or action + .eco are each side's on-target patterns.",
      pickA: ["Brand sustainability microsites & ESG pages", "Green mobility, building & packaging verticals", "Environmental campaigns & content sites", "Budget-sensitive, start-small plays"],
      pickB: ["Environmental nonprofits & climate action", "Carbon-neutral & circular-economy services", "Brands willing to publish a pledge", "Want transparent flat pricing"],
    },
  },
  "eco-vs-earth": {
    slug: "eco-vs-earth",
    a: "eco",
    b: "earth",
    zh: {
      title: ".eco 和 .earth 怎么选：承诺档案与星球叙事的分工",
      metaDescription: ".eco 带环保承诺门槛、自带认证背书，.earth 开放注册、讲星球级叙事。对比两者的信任机制、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两个都面向环保与可持续，分工在信任机制：.eco 靠门槛——注册需在 profiles.eco 提交环保承诺档案，WWF 等组织背书，挂上它等于一份公开可查的环保声明，环保组织、气候行动项目、碳中和服务用它，后缀本身就是资质；.earth 靠叙事——「地球」是比「生态」更大的词，星球级环保项目、地理与自然内容、旅行与探险品牌、甚至「大地色」美学的生活方式品牌都装得下，开放注册无门槛，语义比 .eco 宽一圈。价格都是透明档：.eco 注册约 $60、续费同价，.earth 注册约 $16、续费同价——都无首年低价陷阱，差距在绝对值：.earth 每年便宜 $44，长持成本低得多。判断标准：需要后缀替你背书——机构官网、募捐页、碳服务，愿意公开承诺档案 → .eco 的门槛就是信任；要的是星球格局的品牌叙事——环境内容站、自然纪录片、户外与探险、地球科学项目 → .earth 更便宜、更自由、词也更大。两个注意：.eco 注册后不完成档案可能被暂停解析，流程要走完；.earth 无门槛也意味着无背书，环保立场要靠站内认证与数据自证。命名上「组织/行动 + .eco」与「主题/品牌 + .earth」（save.earth 式的号召感）各是两边最点题的模式。",
      pickA: ["环保组织与气候行动项目", "碳中和与循环经济服务", "需要后缀背书的募捐与机构站", "愿意公开环保承诺档案"],
      pickB: ["环境内容与自然纪录项目", "户外、旅行与探险品牌", "地球科学与地理项目", "预算敏感的长持"],
    },
    en: {
      title: ".eco vs .earth: The Vetted Pledge or The Planet Story",
      metaDescription:
        ".eco gates registration behind a sustainability pledge; .earth is open and tells a planet-scale story. Compare trust mechanics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both face the environmental and sustainability space; the split is the trust mechanism. .eco trusts by gate — registration requires a sustainability pledge at profiles.eco, with WWF-league backing, so wearing it is a publicly auditable environmental statement: nonprofits, climate-action projects and carbon services use the suffix as a credential in itself. .earth trusts by story — earth is a bigger word than eco: planet-scale environmental projects, geography and nature content, travel and adventure brands, even earth-tone lifestyle labels all fit, registration is open with no gate, and the semantics run a ring wider than .eco. Both price transparently: .eco about $60 to register with the same renewal, .earth about $16 the same both ways — no first-year teasers on either, and the gap is the absolute number: .earth saves $44 a year, far cheaper to hold long-term. The test: you need the suffix to vouch for you — institutional sites, donation pages, carbon services, and you'll publish the pledge → .eco's gate is the trust; you want a planet-scale brand narrative — environmental content, nature documentaries, outdoor and adventure, earth science → .earth is cheaper, freer and the bigger word. Two cautions: an .eco registration left without a completed profile can be suspended, so finish the process; and .earth's openness means no endorsement — prove the environmental stance with on-page certifications and data. Naming: organization or action + .eco versus theme or brand + .earth (the save.earth call-to-action cadence) are each side's on-target patterns.",
      pickA: ["Environmental nonprofits & climate action", "Carbon-neutral & circular-economy services", "Donation & institutional sites needing endorsement", "Willing to publish a pledge"],
      pickB: ["Environmental content & nature documentary projects", "Outdoor, travel & adventure brands", "Earth science & geography projects", "Budget-sensitive long holds"],
    },
  },
  "earth-vs-world": {
    slug: "earth-vs-world",
    a: "earth",
    b: "world",
    zh: {
      title: ".earth 和 .world 怎么选：星球词与世界词的分工",
      metaDescription: ".earth 指向自然与星球本身，.world 指向人类世界与「××的世界」。对比两者的语义、价格与命名模式差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "一个指星球、一个指人间：.earth 是自然词——环保与可持续项目、地球科学与地理内容、户外探险与自然旅行、大地色美学品牌，语境是「这颗星球」，save.earth 式域名自带号召感；.world 是叙事词——「××的世界」是它的原生句式，游戏与虚拟世界、品牌宇宙、垂类门户（coffee.world 式）、国际化业务都装得下，语境是「人类世界/某个世界」，比 .earth 更商业、更百搭。价格结构相反：.earth 注册约 $16、续费同价——全程透明；.world 首年促销常见几美元、续费约 $28/年——首年便宜续费跳档，长持 .earth 反而每年省 $12。判断标准：主题是自然、环境、星球本身——环保行动、自然内容、地球科学 → .earth 的语义最正；讲的是「一个世界」——游戏世界观、品牌宇宙、垂类聚合、国际化叙事 → .world 的句式天然成立，什么品类都能接。两个注意：.earth 商业辨识度还在建立期，面向大众的品牌主站建议配一个主流后缀；.world 首年低价吸引了大量批量注册，新站要靠真实内容快速建立信任。命名上「行动/主题 + .earth」（save.earth 式）与「品牌/品类 + .world」（coffee.world 式）各是两边最点题的模式。",
      pickA: ["环保与可持续行动项目", "地球科学与自然内容", "户外探险与自然旅行品牌", "在意续费透明的长持"],
      pickB: ["游戏与虚拟世界项目", "品牌宇宙与主题社区", "垂类门户与聚合站", "国际化业务叙事"],
    },
    en: {
      title: ".earth vs .world: The Planet Word or The People Word",
      metaDescription:
        ".earth points at nature and the planet itself; .world points at the human world and the world of X. Compare semantics, pricing and naming patterns, then hunt names available on both.",
      verdict:
        "One means the planet, the other means the people on it. .earth is the nature word — environmental and sustainability projects, earth science and geography content, outdoor adventure and nature travel, earth-tone aesthetic brands: the context is this planet, and a save.earth-style name carries a built-in call to action. .world is the narrative word — the world of X is its native sentence: games and virtual worlds, brand universes, vertical portals (coffee.world), international businesses all fit; the context is the human world or a world, more commercial and more versatile than .earth. The pricing structures are opposites: .earth about $16 to register with the same renewal — transparent all the way; .world runs first-year promos of a few dollars then renews around $28/yr — cheap in, renewal jump, so a long hold on .earth actually saves $12 a year. The test: the subject is nature, the environment, the planet itself — climate action, nature content, earth science → .earth's semantics aim truest; you're building a world — game universes, brand worlds, vertical aggregators, international narratives → .world's sentence works natively and takes any category. Two cautions: .earth's commercial recognition is still building, so consumer-facing brand homes should pair a mainstream suffix; and .world's cheap first year attracts bulk registrations, so a new site must earn trust fast with real content. Naming: action or theme + .earth (save.earth) versus brand or category + .world (coffee.world) are each side's on-target patterns.",
      pickA: ["Environmental & sustainability action projects", "Earth science & nature content", "Outdoor adventure & nature travel brands", "Transparent-renewal long holds"],
      pickB: ["Games & virtual-world projects", "Brand universes & themed communities", "Vertical portals & aggregators", "International business narratives"],
    },
  },
  "engineering-vs-tech": {
    slug: "engineering-vs-tech",
    a: "engineering",
    b: "tech",
    zh: {
      title: ".engineering 和 .tech 怎么选：职业身份与科技氛围的分工",
      metaDescription: ".engineering 把职业写进域名，.tech 卖的是科技感氛围。对比两者的语气、价格与命名模式差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "分工在语气：.engineering 是职业词——工程设计与咨询公司、机电服务商、工程院校认证机构，把职业身份直接长在后缀上，还有一层科技公司红利：大厂把工程博客挂在 brand.engineering 已成惯例（Uber、Slack 都这么用），招聘页与技术品牌用它比 .com 子目录更有辨识度；.tech 是氛围词——初创公司、黑客松、科技媒体、硬件品牌，四个字母把「科技感」说完，语义宽到什么科技生意都能装，CES 官网就用 ces.tech。价格上 .engineering 注册约 $7、续费约 $52/年；.tech 首年促销常见极低价、续费高出数倍——两个都是首年便宜续费跳档，预算按续费算。判断标准：主体是「工程师/工程公司」——设计院、咨询所、技术团队博客、独立顾问 → .engineering 的职业感压得住，civil.engineering 式垂类词更是点题；要的是泛科技氛围——创业公司、科技活动、硬件电商 → .tech 更短更好念、面向大众更好记。两个注意：.engineering 十一个字母是现役最长后缀之一，适合品牌页与博客、不适合口播，前缀务必用短词；.tech 库存好但同名初创多，起名先查商标撞车。命名上「品牌 + .engineering」（uber.engineering 式博客惯例）与「短品牌词 + .tech」各是两边最点题的模式。",
      pickA: ["工程设计与咨询公司", "大厂工程博客与招聘页", "机电与专业技术服务商", "独立工程顾问个人品牌"],
      pickB: ["科技初创公司官网", "黑客松与科技活动", "科技媒体与硬件品牌", "在意更短更好念的后缀"],
    },
    en: {
      title: ".engineering vs .tech: The Profession or The Vibe",
      metaDescription:
        ".engineering writes the profession into the address; .tech sells the technology vibe. Compare tone, pricing and naming patterns, then hunt names available on both.",
      verdict:
        "The split is the tone. .engineering is the profession word — engineering design and consulting firms, mechanical and electrical providers, schools and certification bodies wear the trade in the suffix itself, with a tech-company bonus: hanging the engineering blog on brand.engineering is an established convention (Uber and Slack both do it), and for hiring pages and tech branding it beats a .com subdirectory on recognition. .tech is the vibe word — startups, hackathons, tech media, hardware brands: four letters that say technology, broad enough for any tech business, and CES itself runs on ces.tech. Pricing: .engineering about $7 to register and $52/yr to renew; .tech runs rock-bottom first-year promos with renewals several times higher — both cheap in with a renewal jump, so budget on renewals. The test: the entity is an engineer or engineering firm — design institutes, consultancies, team blogs, independent consultants → .engineering's professional register carries it, and a civil.engineering-style vertical word is dead on target; you want the general tech vibe — startups, tech events, hardware e-commerce → .tech is shorter, easier to say and easier for consumers to remember. Two cautions: at eleven letters .engineering is among the longest suffixes in service — good for brand pages and blogs, poor by word of mouth, so keep the prefix short; and .tech's healthy inventory means many namesake startups — clear trademarks before naming. Naming: brand + .engineering (the uber.engineering blog convention) versus short brand word + .tech are each side's on-target patterns.",
      pickA: ["Engineering design & consulting firms", "Big-company engineering blogs & hiring pages", "Mechanical & electrical service providers", "Independent consultant personal brands"],
      pickB: ["Tech startup company sites", "Hackathons & tech events", "Tech media & hardware brands", "Want the shorter, easier-said suffix"],
    },
  },
  "engineering-vs-dev": {
    slug: "engineering-vs-dev",
    a: "engineering",
    b: "dev",
    zh: {
      title: ".engineering 和 .dev 怎么选：工程门牌与开发者签名的分工",
      metaDescription: ".engineering 是工程机构的正式门牌，.dev 是开发者个人与工具的圈内签名。对比两者的语气、价格与安全特性差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "分工在主体：.engineering 是机构门牌——工程公司官网、大厂工程博客（uber.engineering 式惯例）、团队招聘页，十一个字母自带正式感，软件与土木两个世界的「工程」都压得住；.dev 是个人与工具的签名——开发者作品集（yourname.dev 是圈内标准写法）、开发工具、技术文档、开源项目主页，Google 运营、全区强制 HTTPS（HSTS 预加载），web.dev、kubernetes.dev 早把用户教育做完了。价格结构不同：.engineering 注册约 $7、续费约 $52/年——首年便宜续费跳档；.dev 注册续费稳定在 $12–15——全程平价无陷阱，长持每年省 $37。判断标准：以「工程组织」示人——公司官网、团队博客、招聘页、垂类咨询 → .engineering 的正式感与职业语义更对；以「开发者/工具」示人——个人品牌、CLI 工具、SDK 文档、开源项目 → .dev 更短更便宜，圈内辨识度也更高。两个注意：.engineering 长，口播与手机输入吃亏，前缀必须短；.dev 语义拉力强，非开发者业务放上去会错位，且全站必须配好 HTTPS 证书才能解析。最顺的分工其实是并用：团队博客用 .engineering，个人与工具用 .dev。命名上「品牌 + .engineering」（uber.engineering 式）与「人名/工具词 + .dev」（yourname.dev 式）各是两边最点题的模式。",
      pickA: ["工程公司官网与团队博客", "招聘页与技术品牌", "土木/机电等传统工程机构", "垂类工程咨询（civil.engineering 式）"],
      pickB: ["开发者个人作品集", "开发工具与 CLI/SDK", "技术文档与开源项目", "在意续费便宜与 HTTPS 保障"],
    },
    en: {
      title: ".engineering vs .dev: The Firm's Plaque or The Developer's Signature",
      metaDescription:
        ".engineering is the formal plaque of an engineering organization; .dev is the in-crowd signature of developers and tools. Compare tone, pricing and security, then hunt names available on both.",
      verdict:
        "The split is the subject. .engineering is the institutional plaque — engineering firm sites, big-company engineering blogs (the uber.engineering convention), team hiring pages: eleven letters with built-in formality, at home in both the software and civil senses of engineering. .dev is the signature of people and tools — developer portfolios (yourname.dev is the in-crowd standard), dev tools, technical docs, open-source homepages: Google-operated with the whole zone HSTS-preloaded, and official sites like web.dev and kubernetes.dev finished the user education years ago. The pricing structures differ: .engineering about $7 to register and $52/yr to renew — cheap in, renewal jump; .dev sits stable around $12–15 both ways — flat and honest, saving $37 a year on a long hold. The test: showing up as an engineering organization — company sites, team blogs, hiring pages, vertical consultancies → .engineering's formality and professional semantics fit; showing up as a developer or a tool — personal brands, CLI tools, SDK docs, open source → .dev is shorter, cheaper and carries more recognition inside the community. Two cautions: .engineering is long — poor for word of mouth and mobile typing, so the prefix must be short; and .dev's semantic pull is strong — non-developer businesses look misplaced, and the site must serve HTTPS or it won't resolve at all. The natural split is to use both: team blog on .engineering, personal sites and tools on .dev. Naming: brand + .engineering (uber.engineering) versus your name or tool word + .dev (yourname.dev) are each side's on-target patterns.",
      pickA: ["Engineering firm sites & team blogs", "Hiring pages & tech branding", "Civil/mechanical traditional engineering institutions", "Vertical consultancies (civil.engineering)"],
      pickB: ["Developer personal portfolios", "Dev tools, CLIs & SDKs", "Technical docs & open-source projects", "Want cheap renewals & enforced HTTPS"],
    },
  },
  "family-vs-com": {
    slug: "family-vs-com",
    a: "family",
    b: "com",
    zh: {
      title: ".family 和 .com 怎么选：家庭温度与通用信任的取舍",
      metaDescription: ".family 把「一家人」写进域名，.com 是通用信任的默认后缀。对比两者的语义、价格与命名模式差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "分工在温度：.family 是归属词——家庭主页与家谱相册、亲子内容与育儿社区、家族企业官网，「姓氏 + .family」是家庭数字资产的标准写法，smith.family 式的名字在 .com 下早被同姓者占光、在这里几乎总有货；.com 是默认词——用户口头补全的永远是 .com，正式商业品牌、面向大众的产品放在上面信任零折损。价格上 .family 注册约 $6、续费约 $31/年——温和档长持无压力；.com 注册续费都在 $10 上下、全程平价，还是转售流动性最好的后缀。判断标准：主体是「一家人」或「家的叙事」——家庭站、家谱、家族企业、亲子品牌 → .family 的温度是 .com 给不了的；主体是正式商业品牌、要触达最广人群 → .com 的认知度无可替代。两个注意：家庭站涉及儿童照片与隐私，域名之外要配访问控制别全公开；.family 六个字母偏长且面向国内用户认知度一般，正式商用建议同时持有 .com 兜底。命名上「姓氏 + .family」（smith.family 式家庭主页）与「品牌词 + .com」各是两边最点题的模式。",
      pickA: ["家庭主页与家谱相册", "亲子内容与育儿社区", "家族企业与传承品牌", "姓氏在 .com 已被注册"],
      pickB: ["正式商业品牌主站", "面向最广人群的产品", "长期品牌资产与转售", "口头传播场景多（广告、口碑）"],
    },
    en: {
      title: ".family vs .com: Warmth of the Household or Default Trust",
      metaDescription:
        ".family writes the household into the address; .com is the default suffix of universal trust. Compare semantics, pricing and naming patterns, then hunt names available on both.",
      verdict:
        "The split is warmth. .family is the belonging word — family homepages and photo archives, parenting content and communities, family-business sites: surname + .family is the standard pattern for a household's digital home, and smith.family-style names long gone on .com nearly always hit here. .com is the default word — what users autocomplete by reflex, where formal commercial brands and mass-market products pay zero trust tax. On price, .family runs about $6 to register and $31/yr to renew — the mild tier, painless to hold; .com sits around $10 both ways with flat pricing and the best resale liquidity of any suffix. The test: the subject is a household or a family narrative — family sites, genealogy, family businesses, parenting brands → .family carries a warmth .com can't; the subject is a formal commercial brand reaching the widest audience → .com's recognition is irreplaceable. Two cautions: family sites carry children's photos, so pair the domain with access control rather than going fully public; and .family is six letters and less recognized outside English markets, so serious commercial plays should hold the .com as backup. Naming: surname + .family (the smith.family homepage pattern) versus brand word + .com are each side's on-target patterns.",
      pickA: ["Family homepages & photo archives", "Parenting content & communities", "Family businesses & heritage brands", "Your surname is taken on .com"],
      pickB: ["Formal commercial brand sites", "Mass-market consumer products", "Long-term brand asset & resale", "Heavy word-of-mouth channels"],
    },
  },
  "baby-vs-store": {
    slug: "baby-vs-store",
    a: "baby",
    b: "store",
    zh: {
      title: ".baby 和 .store 怎么选：母婴垂直与通用货架的分工",
      metaDescription: ".baby 把母婴人群写进域名，.store 是通用电商的货架后缀。对比两者的语义、价格与适用场景差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "分工在客群：.baby 是人群词——母婴用品电商与品牌、月子中心与产后护理、婴幼儿早教与托育，用 name.baby 目标客群一眼锁定，它最初由强生发起、后转入 XYZ 注册局，母婴垂直的定位从注册局层面就写死了；.store 是货架词——看到域名就知道能买东西，什么品类都能装，主站 .com + 商城 .store 的分工已是成熟品牌的惯例。价格结构相似都要看续费：.baby 注册约 $2、续费约 $52/年——首年极便宜续费跳档明显；.store 首年常见大幅促销、续费同样明显更高，两边预算都按续费价算。判断标准：生意就是母婴——母婴品牌、月子中心、婴童品类电商 → .baby 三个字母把人群说完，比 babysomething.com 的拼接短得多也准得多；品类更宽或以后要扩品 → .store 不绑赛道，扩到任何品类都不违和。两个注意：母婴行业信任成本高，资质、成分与安全认证的展示比域名更影响转化；.baby 语义锁死母婴，业务一旦超出这个人群就不合身，扩品预期强的店从一开始就该选 .store。命名上「品牌 + .baby」（母婴品牌的标准用法）与「品牌 + .store」（后缀已说明商店、主体别再叠 shop）各是两边最点题的模式。",
      pickA: ["母婴用品电商与品牌", "月子中心与产后护理", "婴幼儿早教与托育", "育儿内容与新生儿记录"],
      pickB: ["品类更宽的综合电商", "有扩品计划的 DTC 品牌", "主站 .com + 商城分工", "非母婴垂直的零售生意"],
    },
    en: {
      title: ".baby vs .store: The Vertical Audience or The General Shelf",
      metaDescription:
        ".baby writes the parenting audience into the address; .store is the general e-commerce shelf. Compare semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "The split is the audience. .baby is the demographic word — baby product stores and brands, postpartum care centers, early education and childcare: name.baby locks onto the target customer at a glance, and its pedigree is genuinely vertical — launched by Johnson & Johnson and now run by XYZ Registry, the parenting focus is written in at the registry level. .store is the shelf word — visitors know they can buy before they click, any category fits, and the .com-for-brand, .store-for-shop split is an established convention. The pricing structures rhyme — budget on renewals for both: .baby about $2 to register with a jump to about $52/yr; .store runs deep first-year promos with renewals notably higher. The test: the business is parenting and babies — baby brands, postpartum services, child-category stores → .baby says the audience in four letters, shorter and sharper than any babysomething.com compound; the catalog is broader or expansion is planned → .store binds you to no lane and fits whatever you sell next. Two cautions: trust costs are high in the baby trade, so certifications, ingredients and safety credentials convert better than any domain; and .baby's semantics lock hard onto the demographic — a store expecting to outgrow it should start on .store instead. Naming: brand + .baby (the standard baby-brand pattern) versus brand + .store (the suffix already says shop — don't stack shop words) are each side's on-target patterns.",
      pickA: ["Baby product stores & brands", "Postpartum & maternity care services", "Early education & childcare", "Parenting content & baby-book sites"],
      pickB: ["Broader multi-category stores", "DTC brands planning to expand the catalog", "The .com-site-plus-.store-shop split", "Retail outside the parenting vertical"],
    },
  },
  "mom-vs-me": {
    slug: "mom-vs-me",
    a: "mom",
    b: "me",
    zh: {
      title: ".mom 和 .me 怎么选：妈妈身份与个人品牌的分工",
      metaDescription: ".mom 把妈妈身份写进域名，.me 是个人品牌的通用后缀。对比两者的语气、价格与命名模式差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "分工在身份颗粒度：.mom 是身份词——妈妈博客与育儿日记、妈妈社群与团购服务、送妈妈的礼物电商，name.mom 三个字母把视角说完，ask mom、super mom 这类固定搭配让「词 + .mom」读出来就是一句话，妈妈博主与妈妈创业者在这里的个人品牌比通用后缀鲜活得多；.me 是通用个人词——个人主页、简历站、作品集，「me＝我」什么身份都能装，还有 hire.me 式动词短语的独门玩法。价格上 .mom 注册约 $2、续费约 $26/年，.me 与 .com 接近——都是温和档，长持无压力。判断标准：内容以「妈妈视角」为核心——育儿记录、妈妈社群、母婴带货 → .mom 的身份感直接变成品牌资产；身份更宽或以后会转型——个人 IP 覆盖职业、生活多条线 → .me 不绑身份，内容方向怎么变都不违和。两个注意：mom 是美式拼写，面向英联邦市场的受众习惯 mum，市场定位要想清；妈妈内容的主阵地在 Instagram 等平台，域名的角色是个人品牌与商务合作的稳定门面，别指望它单独带流量。命名上「名字 + .mom」（妈妈博主的标准写法）与「名字/昵称 + .me」各是两边最点题的模式。",
      pickA: ["妈妈博客与育儿日记", "妈妈社群与团购服务", "送妈妈的礼物电商", "以妈妈身份带货的博主"],
      pickB: ["身份更宽的个人品牌", "简历站与作品集", "动词短语域名（hire.me 式）", "内容方向可能转型的创作者"],
    },
    en: {
      title: ".mom vs .me: The Mom Identity or The Personal Brand",
      metaDescription:
        ".mom writes the mom identity into the address; .me is the general personal-brand suffix. Compare tone, pricing and naming patterns, then hunt names available on both.",
      verdict:
        "The split is identity granularity. .mom is the identity word — mom blogs and parenting diaries, mom communities and group-buy services, gifts-for-mom stores: name.mom states the point of view in three letters, fixed phrases like ask mom and super mom make word + .mom read as a sentence, and mom bloggers and mompreneurs get a far livelier personal brand here than on any generic suffix. .me is the general personal word — homepages, résumé sites, portfolios: me fits any identity, plus the signature verb-phrase play (hire.me, coach.me) no other suffix offers. On price, .mom runs about $2 to register and $26/yr to renew, and .me sits close to .com — both mild tiers, painless to hold. The test: the content's core is the mom's-eye view — parenting diaries, mom communities, baby-product affiliate work → .mom's identity becomes brand equity directly; the identity is broader or may pivot — a personal brand spanning career and life → .me binds you to nothing and survives any content turn. Two cautions: mom is the American spelling — Commonwealth audiences expect mum, so mind the market; and mom content lives on Instagram and similar platforms, so the domain's job is the stable front door for the brand and sponsorship inquiries, not a traffic source on its own. Naming: first name + .mom (the standard mom-blogger pattern) versus name or nickname + .me are each side's on-target patterns.",
      pickA: ["Mom blogs & parenting diaries", "Mom communities & group-buy services", "Gifts-for-mom stores", "Mom-identity affiliate creators"],
      pickB: ["Broader personal brands", "Résumé sites & portfolios", "Verb-phrase domains (hire.me)", "Creators whose direction may pivot"],
    },
  },
  "dad-vs-blog": {
    slug: "dad-vs-blog",
    a: "dad",
    b: "blog",
    zh: {
      title: ".dad 和 .blog 怎么选：爸爸人设与写作阵地的分工",
      metaDescription: ".dad 把爸爸视角写进域名，.blog 是写作者的通用阵地。对比两者的语气、价格与安全特性差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "分工在人设浓度：.dad 是人设词——爸爸博客与育儿分享、冷笑话与幽默内容站、家庭工具与 DIY 教程，name.dad「爸爸视角」从地址就开始了，英语文化里 dad joke、dad bod 的梗自带流量，它还是 Google 注册局后缀、与 .app/.dev 同门全线强制 HTTPS；.blog 是形态词——Automattic（WordPress 母公司）旗下注册局运营，name.blog 天然读成「某某的博客」，什么主题都能写、读者零解释成本。价格上 .dad 注册约 $11、续费同价——全程透明无陷阱；.blog 首年常见 $3 上下、续费约 $21/年——首年便宜续费温和，长持比 .dad 略省。判断标准：内容以「爸爸人设」立身——育儿视角、冷笑话、父子 DIY → .dad 三个字母把人设说完，比 dadblog.com 式拼接鲜活得多；主题更宽或人设可能淡出——写作本身是主体、育儿只是一条线 → .blog 不绑人设，写什么都成立。两个注意：.dad 幽默气质是双刃剑，严肃的父职咨询用它显得轻佻；Google 后缀必须配好 HTTPS 证书才能解析（主流托管平台自动搞定）。与 .mom 成对做「爸妈视角」双站是现成的内容矩阵玩法。命名上「名字 + .dad」（爸爸博主的标准写法）与「人名/主题词 + .blog」各是两边最点题的模式。",
      pickA: ["爸爸博客与育儿分享", "冷笑话与幽默内容站", "家庭工具与 DIY 教程", "与 .mom 成对的内容矩阵"],
      pickB: ["主题更宽的写作阵地", "人设可能淡出的长期博客", "Newsletter 网页版", "在意续费更便宜的创作者"],
    },
    en: {
      title: ".dad vs .blog: The Dad Persona or The Writing Home",
      metaDescription:
        ".dad writes the dad's-eye view into the address; .blog is the writer's general home. Compare tone, pricing and security, then hunt names available on both.",
      verdict:
        "The split is persona density. .dad is the persona word — dad blogs and parenting diaries, dad-joke and humor sites, home tool and DIY tutorials: name.dad starts the dad's-eye view in the domain, English culture hands it free traffic through dad joke and dad bod memes, and it's a Google Registry suffix — same family as .app and .dev, HTTPS enforced across the zone. .blog is the format word — run by Automattic's registry (the WordPress parent), name.blog reads as someone's blog with zero reader education, and any topic fits. On price, .dad runs about $11 both ways — transparent all the way; .blog is commonly around $3 the first year and about $21/yr to renew — cheaper in and slightly cheaper to hold long-term. The test: the content stands on the dad persona — parenting takes, dad jokes, father-and-kid DIY → .dad says the persona in three letters, far livelier than any dadblog.com compound; the topics are broader or the persona may fade — the writing itself is the subject and parenting just one thread → .blog binds you to no persona and survives any turn. Two cautions: .dad's humor register cuts both ways — serious fatherhood counseling reads flippant on it; and a Google suffix must serve HTTPS or it won't resolve (mainstream hosts handle it automatically). Registering the .mom pair for a two-site parents' matrix is a ready-made content play. Naming: first name + .dad (the standard dad-blogger pattern) versus your name or topic word + .blog are each side's on-target patterns.",
      pickA: ["Dad blogs & parenting diaries", "Dad-joke & humor content sites", "Home tools & DIY tutorials", "A .mom-paired parents' content matrix"],
      pickB: ["Broader-topic writing homes", "Long-term blogs outliving the persona", "Newsletter web homes", "Renewal-cost-conscious writers"],
    },
  },
  "dog-vs-pet": {
    slug: "dog-vs-pet",
    a: "dog",
    b: "pet",
    zh: {
      title: ".dog 和 .pet 怎么选：犬类专营与全宠物赛道的分工",
      metaDescription: ".dog 锁死犬类一个赛道，.pet 覆盖全宠物品类。对比两者的语义锐度、价格与适用场景差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "分工在赛道宽度：.dog 更锐利——pet 泛指宠物、dog 锁死犬类，狗粮订阅、训犬与遛狗平台、犬种社区用 name.dog 定位分毫不差，good dog、top dog 的固定搭配让「词 + .dog」自然成句；.pet 更宽——宠物用品电商与门店、宠物医院与上门服务、宠物科技什么物种都能装，mars.pet（玛氏宠物）式的大公司品牌延伸就是背书。价格结构相反：.dog 注册约 $4、续费约 $52/年——首年便宜续费跳档，预算按续费算；.pet 注册约 $11、续费约 $21/年——价差小更平，长持每年省 $31。判断标准很简单：生意只做狗——狗粮、训犬、遛狗、犬种内容 → .dog 三个字母把赛道说完，垂直人群的搜索与消费极度聚焦；覆盖猫狗与多物种、或以后会扩品类 → .pet 不绑物种，扩到任何宠物都不违和。两个注意：宠物行业信任靠实拍与口碑，域名点题之外用户评价与案例照片才是转化关键；dog 在英语俚语里偶有贬义（dog day 式），品牌词要选正面搭配。命名上「犬种/品牌 + .dog」（corgi.dog 式垂直社区）与「品牌词/动物名 + .pet」各是两边最点题的模式。",
      pickA: ["狗粮电商与订阅服务", "训犬与遛狗平台", "犬种科普与狗狗社区", "纯犬类的垂直品牌"],
      pickB: ["多物种宠物用品电商", "宠物医院与上门服务", "宠物科技（喂食器、定位器）", "有扩品类计划、在意续费更便宜"],
    },
    en: {
      title: ".dog vs .pet: The Dog Lane or The Whole Pet Aisle",
      metaDescription:
        ".dog locks onto the dog lane; .pet covers every species. Compare semantic sharpness, pricing and fit, then hunt names available on both.",
      verdict:
        "The split is lane width. .dog is sharper — pet covers any animal, dog locks onto one lane: food subscriptions, training and walking platforms, breed communities on name.dog aim true to an audience that searches and spends with extreme vertical focus, and fixed phrases like good dog and top dog make word + .dog read as a sentence. .pet is wider — pet supply stores, vet clinics and mobile services, pet tech fit any species, with mars.pet (Mars Petcare) as the big-brand endorsement. The pricing structures are opposites: .dog about $4 to register jumping to about $52/yr — budget on the renewal; .pet about $11 to register and $21/yr to renew — flatter and $31/yr cheaper on a long hold. The test is simple: the business is dogs only — dog food, training, walking, breed content → .dog says the lane in three letters and the vertical focus pays; the catalog spans cats and more, or expansion is planned → .pet binds you to no species and fits whatever you add. Two cautions: trust in the pet trade is built on real photos and reviews — the domain opens the door but testimonials convert; and dog carries occasional negative slang in English (the dog-day sense), so pick positive brand pairings. Naming: breed or brand + .dog (the corgi.dog community pattern) versus brand or animal name + .pet are each side's on-target patterns.",
      pickA: ["Dog food stores & subscriptions", "Training & dog-walking platforms", "Breed guides & dog communities", "Pure dog-lane vertical brands"],
      pickB: ["Multi-species pet supply stores", "Vet clinics & mobile pet services", "Pet tech (feeders, trackers)", "Expansion plans & cheaper renewals"],
    },
  },
  "gifts-vs-shop": {
    slug: "gifts-vs-shop",
    a: "gifts",
    b: "shop",
    zh: {
      title: ".gifts 和 .shop 怎么选：送礼场景与通用店铺的分工",
      metaDescription: ".gifts 把送礼场景写进域名，.shop 是通用电商的店铺后缀。对比两者的语义、价格与适用场景差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "分工在场景锐度：.gifts 是场景词——礼品电商与定制礼物、企业礼品与伴手礼、节日礼物清单与推荐站，「来这儿挑礼物」的用途从地址就说清了，圣诞、情人节、母亲节的搜索高峰周期性爆发，「人群/场景词 + .gifts」正接住这类意图（forhim.gifts 式）；.shop 是店铺词——什么品类都能装，「品牌词 + .shop」本身就是一句行动号召，独立站与 DTC 品牌的通用选择。价格结构不同：.gifts 注册约 $8、续费约 $29/年——温和档长持无压力；.shop 首年常有低价促销、续费明显更高——预算按续费算。判断标准：生意就是「送礼」——礼品专营、定制礼物、企业礼品、节日推荐 → .gifts 的场景感直接变成转化力，比 giftshop.com 式拼接更短更准；品类更宽、送礼只是场景之一 → .shop 不绑场景，卖什么都成立。两个注意：礼品电商强季节性，节前物流履约的保障比域名更影响口碑；gifts 是复数、读作「各种礼物」，单一定制品用「品类 + .gifts」反而更准。命名上「人群/节日词 + .gifts」（直接接住送礼搜索）与「品牌词 + .shop」（后缀已说明店铺、主体别再叠词）各是两边最点题的模式。",
      pickA: ["礼品电商与定制礼物", "企业礼品与伴手礼服务", "节日礼物清单与推荐站", "礼品卡与心愿单工具"],
      pickB: ["品类更宽的独立站电商", "DTC 品牌官方商店", "垂直品类店（非送礼场景）", "线下店铺的线上入口"],
    },
    en: {
      title: ".gifts vs .shop: The Occasion or The Storefront",
      metaDescription:
        ".gifts writes the gifting occasion into the address; .shop is the general storefront suffix. Compare semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "The split is occasion sharpness. .gifts is the occasion word — gift stores and custom gifts, corporate gifting and favors, holiday gift guides: come here to pick a present is announced in the domain itself, and since Christmas, Valentine's and Mother's Day searches spike on schedule, audience or occasion word + .gifts catches exactly that intent (the forhim.gifts pattern). .shop is the storefront word — any category fits, brand + .shop is a call to action in itself, and it's the general choice for independent stores and DTC brands. The pricing structures differ: .gifts about $8 to register and $29/yr to renew — the mild tier, painless to hold; .shop runs cheap first-year promos with renewals notably higher — budget on the renewal. The test: the business is gifting — dedicated gift stores, custom gifts, corporate gifting, seasonal guides → .gifts turns the occasion into conversion power, shorter and sharper than any giftshop.com compound; the catalog is broader and gifting is just one scenario → .shop binds you to no occasion and fits whatever you sell. Two cautions: gifting is fiercely seasonal, so pre-holiday fulfillment builds the reputation more than the domain; and gifts is plural, reading as an assortment — a single custom product aims truer as category + .gifts. Naming: audience or holiday word + .gifts (catching gifting searches directly) versus brand word + .shop (the suffix already says store — don't stack shop words) are each side's on-target patterns.",
      pickA: ["Gift stores & custom gifts", "Corporate gifting & favor services", "Holiday gift guides & lists", "Gift card & wishlist tools"],
      pickB: ["Broader independent stores", "DTC brand storefronts", "Vertical category shops beyond gifting", "Online entrances for offline stores"],
    },
  },
  "photo-vs-photography": {
    slug: "photo-vs-photography",
    a: "photo",
    b: "photography",
    zh: {
      title: ".photo 和 .photography 怎么选：单数名片与全拼手艺的分工",
      metaDescription: ".photo 短促上口像一张名片，.photography 全拼写出职业身份。对比两者的音节、价格与命名模式差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "分工在音节：.photo 是名片词——摄影师个人主页、婚礼跟拍与约拍工作室、照片打印与分享工具用 name.photo，五个字母不带复数不拖长音节，客户在婚礼现场听到 lily.photo 回家就能拼对，口播与社交简介是它的主场；.photography 是手艺词——十一个字母全拼写出「摄影是我的职业」，摄影师作品集、商业与产品摄影工作室用它更显专业分量，名片与作品集水印上最见功力。价格差异明显：.photo 注册约 $26、续费约 $26/年——注册续费同价，无首年低价钓鱼，报价即长期成本；.photography 注册约 $6、续费约 $29/年——首年便宜续费温和，长持两边差距不大。判断标准：名字要靠口播与短促传播——婚礼现场、社交简介、短视频口播 → .photo 的单数短音节赢；主打专业身份与书面呈现——作品集官网、名片、提案文档 → .photography 的全拼更有分量。两个注意：photo 对英文用户是「照片」而非「摄影服务」，约拍业务页面要把服务说清；两者获客主阵地都在 Instagram 等平台，域名的角色是接单与档期预约的稳定门面。命名上「人名 + .photo」（口播友好的摄影师名片）与「人名 + .photography」（书面正式的职业写法）各是两边最点题的模式。",
      pickA: ["口播与社交简介传播为主", "婚礼跟拍与本地约拍", "照片打印与分享工具", "预算按同价长持核算"],
      pickB: ["摄影师作品集官网", "商业与产品摄影工作室", "名片与水印书面呈现", "首年低价起步的个人品牌"],
    },
    en: {
      title: ".photo vs .photography: The Business Card or The Craft in Full",
      metaDescription:
        ".photo is short and spellable like a business card; .photography spells out the profession. Compare syllables, pricing and naming patterns, then hunt names available on both.",
      verdict:
        "The split is syllables. .photo is the business-card word — photographer personal pages, wedding and portrait studios, photo print and sharing tools on name.photo: five letters, no plural, no extra syllables, so a client who hears lily.photo at a wedding can spell it at home; spoken word and social bios are its home turf. .photography is the craft word — eleven letters spelling photography is my profession, carrying professional weight on portfolio sites, commercial and product studios, business cards and watermarks. Pricing differs sharply: .photo runs about $26 to register and $26/yr to renew — same price both ways, no teaser trap, the sticker is the long-term cost; .photography is about $6 to register and $29/yr to renew — cheap in, mild to hold, and over a long hold the two land close. The test: the name travels by voice and quick reads — wedding venues, social bios, short-video mentions → .photo's short singular wins; the play is professional identity in print — portfolio sites, business cards, proposals → .photography's full spelling carries more weight. Two cautions: photo means the picture, not the service, to English ears — booking-led studios should spell out the offer on the page; and both trades win clients on Instagram and similar platforms, so the domain's job is the stable storefront for bookings. Naming: first name + .photo (the speakable photographer card) versus first name + .photography (the formal written pattern) are each side's on-target patterns.",
      pickA: ["Voice-first & social-bio brands", "Wedding & local portrait work", "Photo print & sharing tools", "Flat-price long holds"],
      pickB: ["Photographer portfolio sites", "Commercial & product studios", "Business cards & watermarks", "Cheap first-year personal brands"],
    },
  },
  "health-vs-life": {
    slug: "health-vs-life",
    a: "health",
    b: "life",
    zh: {
      title: ".health 和 .life 怎么选：行业信号与生活温度的取舍",
      metaDescription: ".health 把健康行业写进域名，.life 用温度覆盖整个生活方式赛道。对比两者的语义、价格与信任差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "分工在专业浓度：.health 是行业词——数字健康与健康管理应用、诊所与健康服务机构、企业员工健康福利平台用 name.health，「正经做健康」的信号从地址就发出，CVS、AXA 等大机构启用 .health 站点持续给后缀背书，在信任要求极高的健康赛道这层信号有真金白银的价值；.life 是温度词——健康只是它的一个分区，生活方式品牌、家庭服务、心理与个人成长、保险养老都装得下，「品牌 + .life」像一句承诺而非一份资质。价格差一档：.health 注册约 $11、续费约 $62/年——首年低价续费中高档，预算按续费核算；.life 首年十几元促销、续费两百元档（约 $25–30/年）——长持比 .health 每年省一半以上。判断标准：业务核心是「健康」本身——健康应用、诊所服务、医疗内容 → .health 的行业信号是 .life 给不了的；业务是「过好日子」的泛生活方式——健康只是切入点、以后会横向扩展 → .life 不绑赛道，温度也更亲人。两个注意：健康内容受平台与监管双重审视，医疗声明合规比域名本身更关键；.health 续费约 ¥449/年 对个人博客偏贵，轻量内容站从 .life 起步更稳。命名上「品牌/人群 + .health」（行业身份一步到位）与「品牌 + .life」（生活承诺式写法）各是两边最点题的模式。",
      pickA: ["数字健康与健康管理应用", "诊所与健康服务机构", "企业员工健康福利平台", "信任要求高的健康品牌"],
      pickB: ["泛生活方式品牌与博客", "家庭服务与养老保险", "心理与个人成长社区", "预算敏感的长期内容站"],
    },
    en: {
      title: ".health vs .life: The Industry Signal or The Warmth of Living",
      metaDescription:
        ".health writes the industry into the address; .life covers the whole lifestyle lane with warmth. Compare semantics, pricing and trust, then hunt names available on both.",
      verdict:
        "The split is professional density. .health is the industry word — digital health and wellness apps, clinics and health services, corporate wellness platforms on name.health signal serious about health from the address itself, with CVS, AXA and other large institutions endorsing the suffix by adoption; in a vertical where trust is everything, that signal has cash value. .life is the warmth word — health is just one of its rooms: lifestyle brands, family services, mental health and personal growth, insurance and retirement all fit, and brand + .life reads as a promise rather than a credential. Pricing sits a tier apart: .health about $11 to register jumping to about $62/yr — budget on the renewal; .life runs first-year promos of a few dollars with renewals near $25–30/yr — less than half of .health's holding cost. The test: the business core is health itself — health apps, clinic services, medical content → .health's industry signal is something .life can't give; the business is living well broadly — health is the entry point and expansion is coming → .life binds you to no lane and feels warmer. Two cautions: health content faces platform and regulatory scrutiny alike, so medical-claim compliance matters more than the domain; and $62/yr is steep for a personal blog — lightweight content sites start safer on .life. Naming: brand or audience + .health (industry identity in one step) versus brand + .life (the living-promise pattern) are each side's on-target patterns.",
      pickA: ["Digital health & wellness apps", "Clinics & health services", "Corporate wellness platforms", "Trust-heavy health brands"],
      pickB: ["Broad lifestyle brands & blogs", "Family, insurance & retirement services", "Mental health & growth communities", "Budget-conscious long-term content sites"],
    },
  },
  "fit-vs-fitness": {
    slug: "fit-vs-fitness",
    a: "fit",
    b: "fitness",
    zh: {
      title: ".fit 和 .fitness 怎么选：口号短词与全拼场馆的分工",
      metaDescription: ".fit 三个字母像一句口号，.fitness 全拼写出场馆身份。对比两者的音节、价格与适用场景差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "分工在场景：.fit 是口号词——健身应用与训练计划工具、私教个人品牌、运动穿搭电商用 name.fit，get fit、stay fit 的固定搭配让「动词 + .fit」读起来就是一句口号，三个字母在 App 名与口播场景明显更顺，fit 还有「合身」义、服装电商用它一语双关；.fitness 是场馆词——健身房、瑜伽普拉提馆、CrossFit 场馆、线上健身课程用 name.fitness，全拼写出行业身份，开店的正式感它更足。价格都温和：.fit 注册约 $2、续费约 $26/年——首年白菜价长持无压力；.fitness 注册约 $6、续费约 $33/年——对场馆月卡收入可以忽略，两边预算都不构成决策因素。判断标准：主体是应用、个人或口号——健身 App、私教个人品牌、穿搭电商 → .fit 的短促与双关赢；主体是场馆与项目——实体健身房、课程体系 → .fitness 的全拼更正式，本地学员搜店名核实时也更好认。两个注意：.fit 首年 $2 的低门槛吸引过垃圾站，个别平台对 .fit 链接审查稍严，正经做站内容质量要跟上；健身获客重度依赖短视频与本地平台，域名的角色是品牌官网与课程预约的稳定入口。命名上「动词 + .fit」（get.fit 式口号款）与「店名/风格词 + .fitness」（场馆标准写法）各是两边最点题的模式。",
      pickA: ["健身应用与训练计划工具", "私教个人品牌", "运动穿搭电商（合身双关）", "口播与 App 名场景多"],
      pickB: ["健身房与瑜伽普拉提馆", "CrossFit 与团课场馆", "线上健身课程体系", "本地招生的实体门店"],
    },
    en: {
      title: ".fit vs .fitness: The Slogan or The Gym in Full",
      metaDescription:
        ".fit reads like a three-letter slogan; .fitness spells out the gym. Compare syllables, pricing and fit, then hunt names available on both.",
      verdict:
        "The split is the shape of the business. .fit is the slogan word — fitness apps and training-plan tools, personal-trainer brands, activewear stores on name.fit: fixed phrases like get fit and stay fit make verb + .fit read as a slogan, three letters travel best in app names and spoken mentions, and fit also means well-fitting — a built-in double meaning for apparel. .fitness is the gym word — gyms, yoga and pilates studios, CrossFit boxes, online course programs on name.fitness spell out the industry in full, with the formality a physical venue wants. Both price mild: .fit about $2 to register and $26/yr to renew — painless to hold; .fitness about $6 and $33/yr — a rounding error against membership revenue, so budget decides nothing here. The test: the subject is an app, a person or a slogan — fitness apps, trainer brands, activewear → .fit's brevity and double meaning win; the subject is a venue and its programs — physical gyms, course systems → .fitness reads more formal and is easier for local members verifying the name. Two cautions: .fit's $2 entry drew spam sites historically, so some platforms scrutinize .fit links — quality content carries the reputation; and fitness businesses win clients on short video and local platforms, so the domain's job is the stable booking front door. Naming: verb + .fit (the get.fit slogan pattern) versus venue or style word + .fitness (the standard gym pattern) are each side's on-target patterns.",
      pickA: ["Fitness apps & training tools", "Personal-trainer brands", "Activewear stores (the fit pun)", "App-name & spoken-word contexts"],
      pickB: ["Gyms & yoga/pilates studios", "CrossFit & group-class venues", "Online course programs", "Local member-facing venues"],
    },
  },
  "dance-vs-studio": {
    slug: "dance-vs-studio",
    a: "dance",
    b: "studio",
    zh: {
      title: ".dance 和 .studio 怎么选：舞种锐度与创作空间的分工",
      metaDescription: ".dance 把舞蹈行业写进域名，.studio 是创作团队的通用招牌。对比两者的语义锐度、价格与适用场景差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "分工在锐度：.dance 更锐利——舞蹈工作室与培训机构、舞者个人主页、舞蹈赛事与演出团体用 name.dance，「跳舞的地方」从地址就说清，学员搜「城市 + 舞种」找课、家长搜机构名核实资质，「机构名 + .dance」两件事一次做完，街舞、拉丁、芭蕾等垂直舞种的行业归属感是通用后缀给不了的；.studio 更宽——设计、影像、动画、游戏、舞蹈都装得下，「小而专的创作团队」气质从域名立住，业务跨舞蹈与其他艺术形式时不违和。价格都温和：.dance 注册约 $10、续费约 $22/年——工作室与个人长持无压力；.studio 首年常有促销、续费约 $25–35/年——两边差距不大，预算不构成决策因素。判断标准：生意就是舞蹈——舞蹈培训、舞者品牌、演出团体 → .dance 五个字母把赛道说完，比 dancestudio.com 式拼接更短更准；空间是综合艺术形态——舞蹈只是课程之一、还有音乐美术戏剧 → .studio 不绑舞种，扩什么课都成立。两个注意：舞蹈内容的传播主阵地在抖音/B 站/Instagram，域名的角色是招生报名与档期预订的稳定入口；dance 是英文词，纯中文本地招生要在页面同步中文品牌名。命名上「舞种 + 城市 + .dance」（直接接住找课搜索）与「品牌词 + .studio」（创作团队通用写法）各是两边最点题的模式。",
      pickA: ["舞蹈工作室与培训机构", "舞者个人主页与作品集", "舞蹈赛事与演出团体", "垂直舞种社区（街舞、拉丁）"],
      pickB: ["综合艺术空间与多课程机构", "设计与影像创作团队", "业务可能扩出舞蹈的空间", "小而专的创作团队品牌"],
    },
    en: {
      title: ".dance vs .studio: The Dance Lane or The Creative Room",
      metaDescription:
        ".dance writes the dance trade into the address; .studio is the general sign of a creative team. Compare semantic sharpness, pricing and fit, then hunt names available on both.",
      verdict:
        "The split is sharpness. .dance is sharper — dance studios and academies, dancers' personal pages, competitions and performance troupes on name.dance say the dancing happens here in the domain itself: students search city + style for classes, parents search the school's name to verify it, and school name + .dance does both jobs at once, with a vertical belonging that street, latin and ballet communities feel instantly. .studio is wider — design, film, animation, games and dance all fit, projecting the small-and-focused creative team from the address, and nothing breaks if the business spans dance and other art forms. Both price mild: .dance about $10 to register and $22/yr to renew — painless for studios and individuals; .studio runs frequent first-year promos with renewals near $25–35/yr — close enough that budget decides nothing. The test: the business is dance — academies, dancer brands, troupes → .dance says the lane in five letters, shorter and sharper than any dancestudio.com compound; the space is a broader arts venue — dance is one class among music, art and theater → .studio binds you to no discipline and fits whatever you add. Two cautions: dance content spreads on TikTok, Instagram and their peers, so the domain's job is the stable enrollment and booking entrance; and dance is an English word — purely local-language schools should pair the local brand name on the page. Naming: style + city + .dance (catching class searches directly) versus brand word + .studio (the general creative-team pattern) are each side's on-target patterns.",
      pickA: ["Dance studios & academies", "Dancers' pages & portfolios", "Competitions & performance troupes", "Vertical style communities (street, latin)"],
      pickB: ["Multi-discipline arts venues", "Design & film creative teams", "Spaces that may outgrow dance", "Small focused creative-team brands"],
    },
  },
  "guide-vs-tips": {
    slug: "guide-vs-tips",
    a: "guide",
    b: "tips",
    zh: {
      title: ".guide 和 .tips 怎么选：成体系攻略与轻量技巧的分工",
      metaDescription: ".guide 承诺一份成体系的攻略，.tips 承诺一批轻量实用的技巧。对比两者的内容预期、价格与命名模式差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "分工在内容颗粒度：.guide 是体系词——旅行攻略与城市指南、购物选品与工具评测指南、新手入门教程站用 name.guide，「city guide」「buying guide」都是用户主动敲进搜索框的词，「主题词 + .guide」让域名本身长得像搜索结果，承诺的是一份从头到尾带你走完的攻略，导游与向导服务用它还多一层「真人向导」义；.tips 是技巧词——生活妙招、省钱指南、垂类小技巧站用 name.tips，「领域 + .tips」（travel.tips、tax.tips 类）读出来同样是查询词，但预期是轻量、零散、即取即用的建议。价格都温和：.guide 注册约 $6、续费约 $33/年；.tips 注册约 $8、续费约 $25/年——长持 .tips 略省，差距不构成决策因素。判断标准：内容是成体系的长文攻略——按章节组织、从入门到进阶 → .guide 的体系预期更合身；内容是碎片化技巧合集——每篇一招、随查随用 → .tips 的轻量气质更准。两个注意：两者同属 Identity Digital、注册链路一致，真正的分野只在内容形态，选错不致命但气质会拧；攻略与技巧站竞争都激烈，域名点题只是起点，内容深度与更新频率才是排名关键。命名上「城市/品类 + .guide」（旅行与选品站标准款）与「领域 + .tips」（读出来就是搜索词）各是两边最点题的模式。",
      pickA: ["旅行攻略与城市指南", "购物选品与评测指南", "新手教程与入门体系", "导游与向导服务预订"],
      pickB: ["生活妙招与省钱技巧站", "垂类小技巧博客", "工具型 newsletter", "碎片化即查即用内容"],
    },
    en: {
      title: ".guide vs .tips: The Full Walkthrough or The Quick Trick",
      metaDescription:
        ".guide promises a systematic walkthrough; .tips promises a batch of quick practical tricks. Compare content expectations, pricing and naming patterns, then hunt names available on both.",
      verdict:
        "The split is content granularity. .guide is the system word — travel and city guides, buying and tool-review guides, beginner walkthrough sites on name.guide: city guide and buying guide are queries users type by hand, so topic + .guide makes the domain read like a search result, promising a start-to-finish walkthrough — and tour-guide services get a bonus human-guide reading. .tips is the trick word — life hacks, money-saving advice, vertical quick-tip sites on name.tips: domain + .tips (the travel.tips, tax.tips pattern) reads as a query too, but the expectation is light, granular, grab-and-go advice. Both price mild: .guide about $6 to register and $33/yr to renew; .tips about $8 and $25/yr — .tips slightly cheaper to hold, not enough to decide anything. The test: the content is a structured long-form walkthrough — organized in chapters, beginner to advanced → .guide's systematic expectation fits; the content is a collection of standalone tricks — one move per post, consulted on demand → .tips' lightweight register aims truer. Two cautions: both run on Identity Digital with identical registration plumbing, so the real divide is purely content shape — picking wrong isn't fatal but reads off-key; and guide and tip content are fiercely competitive, so the on-target domain is the start while depth and update cadence decide rankings. Naming: city or category + .guide (the travel and buying-guide standard) versus domain word + .tips (reading as the query itself) are each side's on-target patterns.",
      pickA: ["Travel & city guides", "Buying & review guides", "Beginner walkthrough systems", "Tour-guide service bookings"],
      pickB: ["Life-hack & money-saving sites", "Vertical quick-tip blogs", "Tool-style newsletters", "Grab-and-go fragment content"],
    },
  },
  "reviews-vs-blog": {
    slug: "reviews-vs-blog",
    a: "reviews",
    b: "blog",
    zh: {
      title: ".reviews 和 .blog 怎么选：评测立场与写作阵地的分工",
      metaDescription: ".reviews 把「替你试过」的立场写进域名，.blog 是写作者的通用阵地。对比两者的商业意图、价格与适用场景差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "分工在立场：.reviews 是立场词——产品评测与横向对比站、软件与服务点评平台、影视书籍乐评站用 name.reviews，「产品名 + reviews」是购买决策前的黄金搜索词，「品类 + .reviews」让域名精准卡进这条搜索路径，对联盟营销与比价内容站，这是少数天生带商业意图的后缀；.blog 是形态词——Automattic（WordPress 母公司）旗下注册局运营，name.blog 天然读成「某某的博客」，什么主题都能写、读者零解释成本，评测只是它能装的内容之一。价格结构不同：.reviews 注册约 $5、续费约 $50/年——首年低价续费中档，预算按续费核算；.blog 首年常见 $3 上下、续费约 $21/年——长持每年省 $29，个人创作者可长期负担。判断标准：站点以「评测」立身——测评方法、打分体系、购买建议是主体 → .reviews 的立场直接变成流量入口，商业转化预期它更高；写作本身是主体——评测只是众多主题之一、还有随笔与教程 → .blog 不绑立场，写什么都成立且持有更便宜。两个注意：评测站的生命线是公信力，测评方法透明与利益披露比域名更决定长期口碑；reviews 是复数、读作「一批评价」，聚合对比站用它正好，个人随笔向的单篇点评放 .blog 气质更合。命名上「品类 + .reviews」（直接接住购买前搜索）与「人名/主题词 + .blog」（写作者标准写法）各是两边最点题的模式。",
      pickA: ["产品评测与横向对比站", "软件与服务点评平台", "联盟营销与比价内容站", "本地商家口碑聚合"],
      pickB: ["主题更宽的写作阵地", "个人博客与随笔", "Newsletter 网页版", "在意续费更便宜的创作者"],
    },
    en: {
      title: ".reviews vs .blog: The Verdict Stand or The Writing Home",
      metaDescription:
        ".reviews writes the we-tested-it stance into the address; .blog is the writer's general home. Compare commercial intent, pricing and fit, then hunt names available on both.",
      verdict:
        "The split is stance. .reviews is the stance word — product review and comparison sites, software and service rating platforms, film and book criticism on name.reviews: product name + reviews is the golden pre-purchase query, so category + .reviews parks the domain squarely on that path, and for affiliate and comparison content few suffixes carry commercial intent this natively. .blog is the format word — run by Automattic's registry (the WordPress parent), name.blog reads as someone's blog with zero reader education, any topic fits, and reviews are just one thing it can hold. The pricing structures differ: .reviews about $5 to register jumping to about $50/yr — budget on the renewal; .blog commonly around $3 the first year and about $21/yr to renew — $29/yr cheaper to hold, sustainable for individual creators. The test: the site stands on verdicts — methodology, scoring, buying advice are the substance → .reviews turns the stance into a traffic entrance with higher conversion expectations; the writing itself is the subject — reviews are one thread among essays and tutorials → .blog binds you to no stance and costs less to keep. Two cautions: a review site lives or dies on credibility, so transparent methodology and disclosed affiliations shape the reputation more than the domain; and reviews is plural, reading as a body of verdicts — right for aggregators and comparisons, while personal one-off takes sit more naturally on .blog. Naming: category + .reviews (catching pre-purchase searches directly) versus your name or topic word + .blog (the standard writer pattern) are each side's on-target patterns.",
      pickA: ["Product review & comparison sites", "Software & service rating platforms", "Affiliate & price-comparison content", "Local business review aggregators"],
      pickB: ["Broader-topic writing homes", "Personal blogs & essays", "Newsletter web homes", "Renewal-cost-conscious writers"],
    },
  },
  "golf-vs-club": {
    slug: "golf-vs-club",
    a: "golf",
    b: "club",
    zh: {
      title: ".golf 和 .club 怎么选：球场品类与社群归属的分工",
      metaDescription: ".golf 把高尔夫行业写进域名，.club 是社群与俱乐部的通用招牌。对比两者的语义锐度、价格与适用场景差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "分工在锐度：.golf 是品类词——高尔夫球场与练习场、教练与青少年培训、球具装备电商、订场与差点管理工具用 name.golf，「打球来这儿」从地址就说清，球友搜「城市 + golf」订场、家长搜教练名核实资质，「场地名 + .golf」两件事一次做完，这种行业归属感是通用后缀给不了的；.club 是归属词——会员制球会、球友社群、跨运动的综合俱乐部用 name.club，「加入我们」的号召从域名立住，业务不止高尔夫时也不违和。价格结构不同：.golf 注册约 $5、续费约 $52/年——首年低价、续费中高档，按续费核算预算才稳；.club 首年常见促销、续费温和得多，长持成本明显更低。判断标准：生意是高尔夫本身——球场运营、教学、装备、订场工具 → .golf 四个字母把赛道说完，比 golfclub.com 式拼接更短更准；卖的是会籍与圈子——会员社群、跨项目俱乐部、球友组织 → .club 的归属感更点题，续费也更省。两个注意：.golf 续费约 ¥374/年，对个人球友博客偏贵，轻量内容站可先用 .club 起步；高尔夫客群搜索意图强，域名的角色是订场与报名的稳定入口，页面要把价格与档期做清楚。命名上「城市/场地名 + .golf」（直接接住订场搜索）与「会名 + .club」（会员俱乐部标准款）各是两边最点题的模式。",
      pickA: ["高尔夫球场与练习场", "教练与青少年培训", "球具装备电商与订场工具", "承接「城市 + golf」搜索"],
      pickB: ["会员制球会与球友社群", "跨运动的综合俱乐部", "在意长持续费成本", "主品牌的社群子站"],
    },
    en: {
      title: ".golf vs .club: The Course Category or The Member Circle",
      metaDescription:
        ".golf writes the golf trade into the address; .club is the general sign of a member community. Compare semantic sharpness, pricing and fit, then hunt names available on both.",
      verdict:
        "The split is sharpness. .golf is the category word — courses and driving ranges, coaches and junior academies, gear stores, tee-time and handicap tools on name.golf say the golf happens here in the domain itself: players search city + golf to book, parents search a coach's name to verify, and venue name + .golf does both jobs at once with a vertical belonging no generic suffix can match. .club is the belonging word — member golf clubs, player communities, multi-sport clubs on name.club put the join-us call in the address, and nothing breaks if the club is about more than golf. The pricing structures differ: .golf about $5 to register jumping to about $52/yr — a cheap first year with a mid-to-high renewal, so budget on the renewal; .club runs frequent first-year promos with a much milder renewal, clearly cheaper to hold. The test: the business is golf itself — course operations, coaching, gear, booking tools → .golf says the lane in four letters, shorter and sharper than any golfclub.com compound; the product is membership and the circle — member communities, multi-activity clubs, player groups → .club's belonging aims truer and costs less to keep. Two cautions: .golf's $52/yr is steep for a personal golf blog — lightweight content sites can start on .club; and golf customers search with high intent, so the domain's job is the stable booking and enrollment entrance with clear pricing and availability on the page. Naming: city or venue + .golf (catching tee-time searches directly) versus club name + .club (the member-club standard) are each side's on-target patterns.",
      pickA: ["Courses & driving ranges", "Coaches & junior academies", "Gear stores & booking tools", "Catching city + golf searches"],
      pickB: ["Member clubs & player communities", "Multi-sport clubs", "Renewal-cost-conscious holds", "A brand's community subdomain"],
    },
  },
  "tennis-vs-coach": {
    slug: "tennis-vs-coach",
    a: "tennis",
    b: "coach",
    zh: {
      title: ".tennis 和 .coach 怎么选：项目招牌与职业身份的分工",
      metaDescription: ".tennis 把网球项目写进域名，.coach 写出教练的职业身份。对比两者的语义指向、价格与适用场景差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "分工在指向：.tennis 指向项目——网球俱乐部与场馆订场、青少年培训机构、球拍球线装备电商、赛事与约球社区用 name.tennis，「这里全是网球」从地址就说清，学员搜「城市 + tennis」找场地找课，「场馆名 + .tennis」比杂牌后缀更像正经网球机构；.coach 指向人——网球教练、体能教练、职业发展与人生教练用 name.coach，「我以教学为业」的身份从域名立住，跨项目、跨领域的教学生意都装得下。价格同档偏高：.tennis 注册约 $52、续费约 $52/年——注册续费同价，报价即长期成本；.coach 注册约 $11、续费约 $62/年——首年便宜续费更高，两边都要按年费几十美元核算预算。判断标准：主体是场馆与项目——俱乐部、培训机构、装备电商、赛事组织 → .tennis 的品类归属更锐，本地学员核实场馆时也更好认；主体是教练个人——网球教练的个人品牌、可能扩到体能与其他项目的教学业务 → .coach 的职业身份不绑项目，学员换项目也不用换域名。两个注意：两者续费都在 ¥370–450/年 档，个人兴趣站要算清长持成本；网球获客重度依赖本地搜索与转介绍，域名的角色是报名与订场的稳定入口。命名上「城市/场馆名 + .tennis」（直接接住找场搜索）与「人名 + .coach」（教练个人品牌标准款）各是两边最点题的模式。",
      pickA: ["网球俱乐部与场馆订场", "青少年培训机构", "球拍球线装备电商", "赛事组织与约球社区"],
      pickB: ["网球教练个人品牌", "跨项目的教学业务", "体能与专项训练服务", "以人为核心的教学生意"],
    },
    en: {
      title: ".tennis vs .coach: The Sport's Banner or The Trainer's Title",
      metaDescription:
        ".tennis writes the sport into the address; .coach writes out the trainer's profession. Compare semantic aim, pricing and fit, then hunt names available on both.",
      verdict:
        "The split is what the name points at. .tennis points at the sport — clubs and court booking, junior academies, racquet and string stores, tournaments and hitting-partner communities on name.tennis say everything here is tennis in the domain itself: students search city + tennis for courts and lessons, and venue name + .tennis reads like a proper tennis institution where a generic suffix wouldn't. .coach points at the person — tennis coaches, fitness trainers, career and life coaches on name.coach put teaching is my profession in the address, and the identity holds across sports and fields. Both price in the upper tier: .tennis about $52 to register and $52/yr to renew — same price both ways, the sticker is the long-term cost; .coach about $11 to register and $62/yr to renew — cheap in, higher to hold, so budget both on tens of dollars a year. The test: the subject is the venue and the sport — clubs, academies, gear stores, tournaments → .tennis's category belonging is sharper and easier for local students verifying the venue; the subject is the coach as a person — a tennis coach's personal brand, a teaching business that may expand into fitness or other sports → .coach binds you to no single sport, and switching disciplines never means switching domains. Two cautions: both renew around $50–62/yr, so personal hobby sites should count the holding cost; and tennis businesses win students through local search and referrals, so the domain's job is the stable enrollment and booking entrance. Naming: city or venue + .tennis (catching court searches directly) versus your name + .coach (the coach personal-brand standard) are each side's on-target patterns.",
      pickA: ["Clubs & court booking", "Junior academies", "Racquet & string stores", "Tournaments & hitting communities"],
      pickB: ["Tennis coaches' personal brands", "Cross-sport teaching businesses", "Fitness & performance training", "Person-centered teaching brands"],
    },
  },
  "soccer-vs-football": {
    slug: "soccer-vs-football",
    a: "soccer",
    b: "football",
    zh: {
      title: ".soccer 和 .football 怎么选：北美叫法与全球叫法的分工",
      metaDescription: ".soccer 是北美市场对足球的称呼，.football 是欧洲与全球大多数市场的叫法。对比两者的受众语境、价格与适用场景差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "分工在受众语境：同一项运动，两个后缀各占一个语言世界。.soccer 是北美词——美加的青训营与足球学校、业余联赛、球迷内容站用 name.soccer，家长搜「城市 + youth soccer」找机构，soccer 在美式语境里毫无歧义，因为 football 在那里指橄榄球；.football 是全球词——欧洲、南美、亚非市场对足球的称呼都是 football，俱乐部与球迷会、青训与球员经纪、赛事资讯与数据分析站用 name.football 对国际球迷更自然。价格完全同档：两者注册局同为 Identity Digital，注册都约 $11、续费都约 $21/年——温和档长持无压力，预算不构成决策因素，纯看受众。判断标准：主要用户在北美——美加青训、社区联赛、面向北美家长的培训机构 → .soccer 无歧义直达；面向国际球迷或欧洲市场——俱乐部球迷会、国际赛事内容、全球化的足球产品 → .football 是世界的叫法。两个注意：跨市场项目可以两个都注册、主站选主受众的叫法另一个 301 跳转；涉及俱乐部徽标与赛事名的商标授权要先厘清，球迷站标明非官方身份更稳。命名上「城市 + .soccer」（接住北美找课搜索）与「队名/联赛 + .football」（国际球迷与资讯站标准款）各是两边最点题的模式。",
      pickA: ["美加青训营与足球学校", "北美业余联赛与社区球队", "面向北美家长的培训机构", "美式语境的球迷内容站"],
      pickB: ["面向国际球迷的俱乐部与球迷会", "欧洲与全球市场的足球产品", "赛事资讯与数据分析站", "青训营与球员经纪（国际线）"],
    },
    en: {
      title: ".soccer vs .football: The American Word or The World's Word",
      metaDescription:
        ".soccer is what North America calls the game; .football is what the rest of the world calls it. Compare audience context, pricing and fit, then hunt names available on both.",
      verdict:
        "The split is audience language: one sport, two suffixes, each owning a linguistic world. .soccer is the North American word — US and Canadian youth academies and soccer schools, amateur leagues, fan content sites on name.soccer: parents search city + youth soccer to find programs, and soccer is unambiguous in American English precisely because football there means the gridiron game. .football is the world's word — Europe, South America, Asia and Africa all call the sport football, so clubs and supporter groups, youth camps and player agencies, fixtures and analytics sites on name.football read more natural to an international audience. Pricing is identical: both run on Identity Digital at about $11 to register and $21/yr to renew — the mild tier, painless to hold, so budget decides nothing and the audience decides everything. The test: the users are in North America — US/Canada youth programs, community leagues, parent-facing academies → .soccer lands without ambiguity; the audience is international or European — club supporter groups, global football products, international fixtures content → .football speaks the world's language. Two cautions: cross-market projects can register both, put the primary site on the main audience's word and 301 the other; and club crests and competition names carry trademark weight, so fan sites should state their unofficial status and clear licensing first. Naming: city + .soccer (catching North American class searches) versus club or league + .football (the international fan and news standard) are each side's on-target patterns.",
      pickA: ["US & Canadian youth academies", "North American amateur leagues", "Parent-facing training programs", "American-English fan content"],
      pickB: ["International club & supporter sites", "Europe-facing football products", "Fixtures & analytics sites", "Global youth camps & agencies"],
    },
  },
  "hockey-vs-team": {
    slug: "hockey-vs-team",
    a: "hockey",
    b: "team",
    zh: {
      title: ".hockey 和 .team 怎么选：冰球专营与队伍通用的分工",
      metaDescription: ".hockey 把冰球项目写进域名，.team 是任何队伍的通用后缀。对比两者的语义锐度、价格与适用场景差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "分工在锐度：.hockey 更锐——冰球俱乐部与青训营、冰场与训练设施、球杆护具装备电商、联赛资讯与球迷社区用 name.hockey，「打冰球来这儿」从地址就说清，家长搜「城市 + 冰球培训」找俱乐部，「俱乐部名 + .hockey」比通用后缀更像正经冰球机构，装备电商还能把品类留给后缀、域名主体留给品牌；.team 更宽——任何项目的运动队、公司战队、电竞队、志愿者团队都装得下，「我们是一支队伍」的气质从域名立住，跨项目的体育俱乐部用它不违和。价格结构不同：.hockey 注册约 $8、续费约 $48/年——首年低价、续费中高档，按续费核算才稳；.team 注册约 $5、续费约 $29/年——温和档，长持成本约为 .hockey 的六成。判断标准：生意就是冰球——俱乐部、冰场、装备、联赛 → .hockey 六个字母把赛道说完，垂直归属感通用后缀给不了；主体是「队伍」而项目可能不止一个——综合体育俱乐部、公司球队、电竞战队 → .team 不绑项目，扩什么项目都成立，续费也更省。两个注意：hockey 在英联邦部分市场默认指曲棍球，面向这些市场的页面要说清冰球还是曲棍球；青训获客靠本地搜索与家长转介绍，域名的角色是报名与冰场档期的稳定入口。命名上「城市/俱乐部名 + .hockey」（直接接住找俱乐部搜索）与「队名 + .team」（任何队伍的标准款）各是两边最点题的模式。",
      pickA: ["冰球俱乐部与青训营", "冰场与训练设施", "球杆护具装备电商", "联赛资讯与球迷社区"],
      pickB: ["跨项目的综合运动队", "公司球队与电竞战队", "志愿者与项目团队", "在意长持续费成本"],
    },
    en: {
      title: ".hockey vs .team: The Rink Vertical or The Any-Squad Banner",
      metaDescription:
        ".hockey writes the sport into the address; .team is the general banner of any squad. Compare semantic sharpness, pricing and fit, then hunt names available on both.",
      verdict:
        "The split is sharpness. .hockey is sharper — hockey clubs and youth programs, rinks and training facilities, stick and gear stores, league news and fan communities on name.hockey say the hockey happens here in the domain itself: parents search city + youth hockey to find clubs, club name + .hockey reads like a proper hockey organization where a generic suffix wouldn't, and gear stores get the category from the suffix while keeping the name for the brand. .team is wider — any sport's squad, corporate teams, esports rosters, volunteer crews all fit, projecting we are a team from the address, and a multi-sport club never outgrows it. The pricing structures differ: .hockey about $8 to register jumping to about $48/yr — cheap in, mid-to-high to hold, so budget on the renewal; .team about $5 to register and $29/yr to renew — the mild tier, roughly sixty percent of .hockey's holding cost. The test: the business is hockey itself — clubs, rinks, gear, leagues → .hockey says the lane in six letters with a vertical belonging no generic suffix can match; the subject is the squad and the sport may vary — multi-sport clubs, corporate teams, esports rosters → .team binds you to no discipline and costs less to keep. Two cautions: in parts of the Commonwealth hockey defaults to field hockey, so pages facing those markets should say which game; and youth programs win families through local search and referrals, so the domain's job is the stable enrollment and ice-time entrance. Naming: city or club + .hockey (catching club searches directly) versus squad name + .team (the any-team standard) are each side's on-target patterns.",
      pickA: ["Hockey clubs & youth programs", "Rinks & training facilities", "Stick & gear stores", "League news & fan communities"],
      pickB: ["Multi-sport squads & clubs", "Corporate & esports teams", "Volunteer & project crews", "Renewal-cost-conscious holds"],
    },
  },
  "surf-vs-fun": {
    slug: "surf-vs-fun",
    a: "surf",
    b: "fun",
    zh: {
      title: ".surf 和 .fun 怎么选：浪点垂直与泛娱乐的分工",
      metaDescription: ".surf 把冲浪生活方式写进域名，.fun 是一切好玩事物的通用后缀。对比两者的语义锐度、价格与适用场景差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "分工在锐度：.surf 是浪点词——冲浪学校与教练、冲浪营地与海边民宿、浪板装备电商、浪况预报与冲浪内容站用 name.surf，「下水来这儿」从地址就说清，浪人搜「海滩 + surf」找学校订营地，「地名 + .surf」比通用后缀更像本地浪店；surf 还有「上网冲浪」的双关义，浏览器工具与网页产品也能借它玩出彩。.fun 是气质词——桌游吧、密室逃脱、亲子乐园、活动策划、休闲小游戏用 name.fun，「好玩」两个字从域名立住，什么娱乐形态都装得下。价格都亲民：.surf 注册约 $2、续费约 $26/年；.fun 首年常见白菜价、续费略高但差距不大——两边长持都无压力，预算不构成决策因素。判断标准：生意围着海浪转——冲浪教学、营地民宿、装备、预报工具 → .surf 四个字母把生活方式说完，垂直归属感 .fun 给不了；卖的是「好玩」本身——线下娱乐场馆、亲子活动、休闲游戏 → .fun 的泛娱乐气质更点题，跨形态扩展也不违和。两个注意：两者首年低价都吸引过垃圾站，个别平台对超低价后缀审查稍严，正经做站内容质量要跟上；.fun 与严肃行业相斥，金融、医疗等业务别用。命名上「海滩/地名 + .surf」（直接接住找学校搜索）与「品牌词 + .fun」（泛娱乐标准款）各是两边最点题的模式。",
      pickA: ["冲浪学校与教练", "冲浪营地与海边民宿", "浪板装备电商与预报工具", "网页产品的「冲浪」双关"],
      pickB: ["桌游吧与密室逃脱等线下娱乐", "亲子乐园与活动策划", "休闲小游戏与趣味产品", "跨形态的泛娱乐品牌"],
    },
    en: {
      title: ".surf vs .fun: The Break Vertical or The Playground Banner",
      metaDescription:
        ".surf writes the surf lifestyle into the address; .fun is the general banner of everything playful. Compare semantic sharpness, pricing and fit, then hunt names available on both.",
      verdict:
        "The split is sharpness. .surf is the break word — surf schools and instructors, surf camps and beach stays, board and gear stores, forecast and content sites on name.surf say paddle out here in the domain itself: surfers search beach + surf for schools and camps, and place name + .surf reads like the local surf shop where a generic suffix wouldn't; surf also carries the browse-the-web double meaning, a bonus for browser tools and web products. .fun is the mood word — board-game cafés, escape rooms, family parks, event planners, casual games on name.fun put playful in the address, and any form of entertainment fits. Both price friendly: .surf about $2 to register and $26/yr to renew; .fun commonly a bargain first year with a slightly higher but comparable renewal — both painless to hold, so budget decides nothing. The test: the business orbits the wave — surf lessons, camps and stays, gear, forecast tools → .surf says the lifestyle in four letters with a vertical belonging .fun can't give; the product is fun itself — entertainment venues, family activities, casual games → .fun's playful register aims truer and stretches across formats. Two cautions: both cheap first years have attracted spam sites before, so some platforms eye bargain suffixes a bit harder — serious sites need content quality to carry trust; and .fun repels serious industries — keep finance and healthcare off it. Naming: beach or place + .surf (catching school searches directly) versus brand word + .fun (the general entertainment standard) are each side's on-target patterns.",
      pickA: ["Surf schools & instructors", "Surf camps & beach stays", "Gear stores & forecast tools", "Web products playing the surf pun"],
      pickB: ["Escape rooms & entertainment venues", "Family parks & event planners", "Casual games & playful products", "Cross-format entertainment brands"],
    },
  },
  "golf-vs-travel": {
    slug: "golf-vs-travel",
    a: "golf",
    b: "travel",
    zh: {
      title: ".golf 和 .travel 怎么选：球场生意与行程生意的分工",
      metaDescription: ".golf 把高尔夫行业写进域名，.travel 是旅业机构的行业后缀。对比两者的行业指向、价格与适用场景差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "分工在生意主体：.golf 是球场词——高尔夫球场与练习场、教练与培训、球具装备电商、订场与差点工具用 name.golf，「打球来这儿」从地址就说清，卖的是这一次下场；.travel 是行程词——高尔夫旅游线路、海外打球行程定制、球场度假村的旅业门面用 name.travel，卖的是从机票酒店到球位的整段行程，rgnames 运营的 .travel 历史上曾要求旅业资质、行业身份感更强。高尔夫旅游正好横跨两边：主体是球场与教学选 .golf，主体是行程打包与代订选 .travel。价格差异明显：.golf 注册约 $5、续费约 $52/年——首年低价、续费中高档；.travel 注册约 $16、续费约 $119/年——旅业机构门面价，对个人站偏贵。判断标准：收入来自球场本身——果岭费、教学费、装备销售 → .golf 品类更锐，球友搜「城市 + golf」也直达；收入来自行程差价与服务费——线路定制、团期代订、球场度假打包 → .travel 的旅业身份更点题，客户订整段行程时更信任。两个注意：.travel 续费约 ¥857/年，预算按年费核算清楚；两边获客都重本地搜索与转介绍，域名的角色是订场/订团的稳定入口。命名上「城市/场地名 + .golf」（接住订场搜索）与「目的地 + golf + .travel」式组合（高尔夫旅游标准款）各是两边最点题的模式。",
      pickA: ["高尔夫球场与练习场", "教练与青少年培训", "球具装备电商", "订场与差点管理工具"],
      pickB: ["高尔夫旅游线路定制", "海外打球行程与团期代订", "球场度假村旅业门面", "整段行程打包的旅业生意"],
    },
    en: {
      title: ".golf vs .travel: The Course Business or The Itinerary Business",
      metaDescription:
        ".golf writes the golf trade into the address; .travel is the travel industry's suffix. Compare industry aim, pricing and fit, then hunt names available on both.",
      verdict:
        "The split is what the business sells. .golf is the course word — courses and driving ranges, coaches and academies, gear stores, tee-time and handicap tools on name.golf say the golf happens here, selling this round today. .travel is the itinerary word — golf tour operators, overseas golf-trip planners, resort travel desks on name.travel sell the whole journey from flights and hotels to tee times, and .travel historically required travel-industry credentials, giving it a stronger institutional identity. Golf tourism straddles both: pick .golf when the subject is the course and the teaching, .travel when the subject is the packaged trip. Pricing sits tiers apart: .golf about $5 to register and $52/yr to renew — cheap in, mid-to-high to hold; .travel about $16 and $119/yr — a travel-trade storefront price, steep for personal sites. The test: revenue comes from the course itself — green fees, lessons, gear → .golf's category is sharper and city + golf searches land directly; revenue comes from itinerary margins and service fees — custom tours, group bookings, golf-resort packages → .travel's industry identity aims truer and travelers booking a full trip trust it more. Two cautions: .travel's $119/yr means budgeting on the annual fee; and both trades win customers through local search and referrals, so the domain's job is the stable booking entrance. Naming: city or venue + .golf (catching tee-time searches) versus destination + golf + .travel compounds (the golf-tour standard) are each side's on-target patterns.",
      pickA: ["Courses & driving ranges", "Coaches & junior academies", "Golf gear stores", "Tee-time & handicap tools"],
      pickB: ["Golf tour operators", "Overseas golf-trip planners", "Resort travel desks", "Full-itinerary package businesses"],
    },
  },
  "tennis-vs-club": {
    slug: "tennis-vs-club",
    a: "tennis",
    b: "club",
    zh: {
      title: ".tennis 和 .club 怎么选：网球品类与社群归属的分工",
      metaDescription: ".tennis 把网球项目写进域名，.club 是社群与俱乐部的通用招牌。对比两者的语义锐度、价格与适用场景差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "分工在锐度：.tennis 是品类词——网球场馆与订场平台、教练与青少年培训、球拍球线装备电商、赛事与约球社区用 name.tennis，「打网球来这儿」从地址就说清，学员搜「城市 + tennis」找课订场直达，「场馆名 + .tennis」一眼就是正经网球机构，这种垂直归属感通用后缀给不了；.club 是归属词——会员制网球俱乐部、球友社群、跨项目的综合体育俱乐部用 name.club，「加入我们」的号召从域名立住，业务扩到羽毛球、匹克球也不违和。价格差距是决策关键：.tennis 注册约 $52、续费约 $52/年——注册续费同价，报价即长期成本，属中高档；.club 首年常见白菜价促销、续费温和得多，长持成本约为 .tennis 的三分之一。判断标准：生意是网球本身——场馆运营、教学培训、装备电商、订场工具 → .tennis 六个字母把赛道说完，本地学员核实场馆时更好认；卖的是会籍与圈子——会员社群、球友组织、可能跨项目的俱乐部 → .club 的归属感更点题，续费也省得多。两个注意：.tennis 续费约 ¥374/年，个人球友博客或试水项目偏贵，轻量站可先用 .club 起步验证再升级；网球获客重度依赖本地搜索与家长转介绍，域名的角色是报名与订场的稳定入口，页面要把课表价格做清楚。命名上「城市/场馆名 + .tennis」（直接接住找课搜索）与「会名 + .club」（会员俱乐部标准款）各是两边最点题的模式。",
      pickA: ["网球场馆与订场平台", "教练与青少年培训机构", "球拍球线装备电商", "承接「城市 + tennis」搜索"],
      pickB: ["会员制网球俱乐部与球友社群", "跨项目的综合体育俱乐部", "在意长持续费成本", "试水期的轻量社群站"],
    },
    en: {
      title: ".tennis vs .club: The Court Category or The Member Circle",
      metaDescription:
        ".tennis writes the sport into the address; .club is the general sign of a member community. Compare semantic sharpness, pricing and fit, then hunt names available on both.",
      verdict:
        "The split is sharpness. .tennis is the category word — courts and booking platforms, coaches and junior academies, racquet and string stores, tournaments and hitting communities on name.tennis say the tennis happens here in the domain itself: students search city + tennis for lessons and courts, and venue name + .tennis reads like a proper tennis institution with a vertical belonging no generic suffix can match. .club is the belonging word — member tennis clubs, player communities, multi-sport clubs on name.club put the join-us call in the address, and nothing breaks when the club adds badminton or pickleball. Pricing is the deciding gap: .tennis about $52 to register and $52/yr to renew — same price both ways, the sticker is the long-term cost, upper tier; .club runs bargain first-year promos with a much milder renewal, roughly a third of .tennis to hold. The test: the business is tennis itself — venue operations, coaching, gear, booking tools → .tennis says the lane in six letters and local students verify the venue faster; the product is membership and the circle — member communities, player groups, clubs that may cross sports → .club's belonging aims truer and costs far less to keep. Two cautions: .tennis's $52/yr is steep for a personal tennis blog or a trial project — lightweight sites can start on .club and upgrade later; and tennis businesses win students through local search and parent referrals, so the domain's job is the stable enrollment and booking entrance with clear schedules and pricing. Naming: city or venue + .tennis (catching lesson searches directly) versus club name + .club (the member-club standard) are each side's on-target patterns.",
      pickA: ["Courts & booking platforms", "Coaches & junior academies", "Racquet & string stores", "Catching city + tennis searches"],
      pickB: ["Member clubs & player communities", "Multi-sport clubs", "Renewal-cost-conscious holds", "Lightweight trial community sites"],
    },
  },
  "soccer-vs-club": {
    slug: "soccer-vs-club",
    a: "soccer",
    b: "club",
    zh: {
      title: ".soccer 和 .club 怎么选：足球品类与俱乐部招牌的分工",
      metaDescription: ".soccer 把足球项目写进域名，.club 是俱乐部与社群的通用招牌。对比两者的语义指向、价格与适用场景差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "分工在指向：.soccer 指向项目——青训营与足球学校、业余联赛与社区球队、足球装备电商、球迷内容站用 name.soccer，「踢球来这儿」从地址就说清，北美家长搜「城市 + youth soccer」找机构直达，soccer 在美式语境里无歧义（football 在那里指橄榄球），「机构名 + .soccer」比杂牌后缀更像正经足球机构；.club 指向组织——会员制球会、球迷会、跨项目的综合体育俱乐部用 name.club，「我们是个俱乐部」从域名立住，足球之外还有别的项目也装得下。价格都亲民：.soccer 注册约 $11、续费约 $21/年——温和档长持无压力；.club 首年常见白菜价、续费同样温和——两边预算都不构成负担，纯看语义。判断标准：生意围着足球这个项目转——青训教学、联赛组织、装备、球迷内容 → .soccer 品类更锐，垂直归属感 .club 给不了；主体是俱乐部这个组织——会员社群、球迷会、可能跨项目的体育会 → .club 的组织身份更点题，扩项目也不用换域名。两个注意：soccer 是北美叫法，面向欧洲与全球市场的项目用 .football 或 .club 更自然，别让受众读着别扭；青训获客靠本地搜索与家长转介绍，域名的角色是报名与球队信息的稳定入口。命名上「城市 + .soccer」（直接接住北美找课搜索）与「会名 + .club」（俱乐部标准款）各是两边最点题的模式。",
      pickA: ["美加青训营与足球学校", "业余联赛与社区球队", "足球装备电商", "美式语境的球迷内容站"],
      pickB: ["会员制球会与球迷会", "跨项目的综合体育俱乐部", "足球之外还有其他项目", "组织身份优先的社群站"],
    },
    en: {
      title: ".soccer vs .club: The Pitch Category or The Clubhouse Sign",
      metaDescription:
        ".soccer writes the sport into the address; .club is the general sign of a club or community. Compare semantic aim, pricing and fit, then hunt names available on both.",
      verdict:
        "The split is what the name points at. .soccer points at the sport — youth academies and soccer schools, amateur leagues and community teams, gear stores, fan content sites on name.soccer say the soccer happens here in the domain itself: North American parents search city + youth soccer to find programs, soccer is unambiguous in American English (football there means the gridiron game), and academy name + .soccer reads like a proper soccer institution where a generic suffix wouldn't. .club points at the organization — member clubs, supporter groups, multi-sport clubs on name.club put we are a club in the address, and other sports beyond soccer still fit. Both price friendly: .soccer about $11 to register and $21/yr to renew — the mild tier, painless to hold; .club commonly a bargain first year with a similarly mild renewal — budget decides nothing, semantics decide everything. The test: the business orbits the sport — youth coaching, league operations, gear, fan content → .soccer's category is sharper with a vertical belonging .club can't give; the subject is the organization — member communities, supporter groups, clubs that may cross sports → .club's institutional identity aims truer and expanding never means switching domains. Two cautions: soccer is the North American word — projects facing Europe or global audiences read more natural on .football or .club; and youth programs win families through local search and referrals, so the domain's job is the stable enrollment and team-info entrance. Naming: city + .soccer (catching North American class searches directly) versus club name + .club (the clubhouse standard) are each side's on-target patterns.",
      pickA: ["US & Canadian youth academies", "Amateur leagues & community teams", "Soccer gear stores", "American-English fan content"],
      pickB: ["Member clubs & supporter groups", "Multi-sport clubs", "Clubs beyond just soccer", "Organization-first community sites"],
    },
  },
  "football-vs-team": {
    slug: "football-vs-team",
    a: "football",
    b: "team",
    zh: {
      title: ".football 和 .team 怎么选：足球专营与队伍通用的分工",
      metaDescription: ".football 把足球项目写进域名，.team 是任何队伍的通用后缀。对比两者的语义锐度、价格与适用场景差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "分工在锐度：.football 更锐——足球俱乐部与球迷会、青训营与足球学校、赛事资讯与数据分析站、球员经纪与转会内容用 name.football，「这里全是足球」从地址就说清，football 是欧洲与全球大多数市场对足球的称呼，国际球迷读着最自然，「俱乐部名 + .football」比通用后缀更像正经足球组织；.team 更宽——任何项目的运动队、公司战队、电竞队、志愿者与项目团队都装得下，「我们是一支队伍」的气质从域名立住，跨项目的体育组织用它不违和。价格几乎同档：.football 注册约 $11、续费约 $21/年；.team 注册约 $5、续费约 $29/年——都是温和档，长持无压力，预算不构成决策因素。判断标准：内容围着足球转——俱乐部官网、球迷社区、赛事数据、青训机构 → .football 品类更锐，垂直归属感 .team 给不了；主体是「队伍」而项目可能不止一个——综合体育俱乐部、公司球队、电竞战队、活动团队 → .team 不绑项目，扩什么都成立。两个注意：football 在北美默认指橄榄球，面向美加市场的足球项目用 .soccer 更无歧义，橄榄球项目反而正好用 .football；涉及俱乐部徽标与赛事名的商标要先厘清，球迷站标明非官方身份更稳。命名上「俱乐部/联赛名 + .football」（国际球迷与资讯站标准款）与「队名 + .team」（任何队伍的标准款）各是两边最点题的模式。",
      pickA: ["面向国际球迷的俱乐部与球迷会", "青训营与足球学校（国际线）", "赛事资讯与数据分析站", "球员经纪与转会内容"],
      pickB: ["跨项目的综合运动队", "公司球队与电竞战队", "志愿者与项目团队", "不想绑定单一项目的组织"],
    },
    en: {
      title: ".football vs .team: The Sport Vertical or The Any-Squad Banner",
      metaDescription:
        ".football writes the sport into the address; .team is the general banner of any squad. Compare semantic sharpness, pricing and fit, then hunt names available on both.",
      verdict:
        "The split is sharpness. .football is sharper — clubs and supporter groups, youth academies and football schools, fixtures and analytics sites, player agencies and transfer content on name.football say everything here is football in the domain itself: football is what Europe and most of the world call the sport, international fans read it most naturally, and club name + .football looks like a proper football organization where a generic suffix wouldn't. .team is wider — any sport's squad, corporate teams, esports rosters, volunteer crews all fit, projecting we are a team from the address, and a multi-sport organization never outgrows it. Pricing sits in the same mild tier: .football about $11 to register and $21/yr to renew; .team about $5 and $29/yr — both painless to hold, so budget decides nothing. The test: the content orbits football — club sites, fan communities, match data, academies → .football's category is sharper with a vertical belonging .team can't give; the subject is the squad and the sport may vary — multi-sport clubs, corporate teams, esports rosters, event crews → .team binds you to no discipline and anything you expand into still fits. Two cautions: in North America football defaults to the gridiron game, so soccer projects facing US/Canada read clearer on .soccer — while gridiron projects fit .football perfectly; and club crests and competition names carry trademark weight, so fan sites should state their unofficial status. Naming: club or league + .football (the international fan and news standard) versus squad name + .team (the any-team standard) are each side's on-target patterns.",
      pickA: ["International club & supporter sites", "Youth academies & football schools", "Fixtures & analytics sites", "Player agencies & transfer content"],
      pickB: ["Multi-sport squads & clubs", "Corporate & esports teams", "Volunteer & project crews", "Organizations not tied to one sport"],
    },
  },
  "health-vs-care": {
    slug: "health-vs-care",
    a: "health",
    b: "care",
    zh: {
      title: ".health 和 .care 怎么选：健康行业与照护服务的分工",
      metaDescription: ".health 是健康行业的门面后缀，.care 写出照护与关怀的服务气质。对比两者的语义指向、价格与适用场景差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "分工在指向：.health 指向行业——数字健康平台、健康管理与体检机构、营养与运动健康内容站、健康科技产品用 name.health，「我们做健康这门生意」从地址就说清，行业门面感强，健康赛道融资与合作时递名片也更正式；.care 指向服务——居家养老与照护机构、月子中心与产后护理、宠物照护、心理关怀热线用 name.care，「我们照顾你」的温度从域名立住，服务型机构的信任感更直接。价格差一档：.health 注册约 $11、续费约 $62/年——首年低价、续费中高档，按续费核算才稳；.care 注册约 $12、续费约 $36/年——温和偏上档，长持成本约为 .health 的六成。判断标准：主体是健康这个行业——健康平台、管理机构、科技产品、行业内容 → .health 的行业门面更点题，赛道归属一眼可见；主体是照护这类服务——养老、护理、托育、心理关怀 → .care 的服务温度更打动人，续费也更省。两个注意：健康与医疗内容受平台与监管审查更严，资质说明、隐私政策与免责声明要做全，别让域名的专业感与页面的合规性脱节；两个后缀都不能替代医疗资质，诊疗类业务先核对当地执业与广告法规。命名上「品牌 + .health」（健康行业门面标准款）与「服务词 + .care」（照护机构标准款，如 homecare、eldercare 式组合）各是两边最点题的模式。",
      pickA: ["数字健康平台与健康管理", "体检与健康科技产品", "营养与运动健康内容站", "健康赛道的行业门面"],
      pickB: ["居家养老与照护机构", "月子中心与产后护理", "宠物照护与托育服务", "心理关怀与支持热线"],
    },
    en: {
      title: ".health vs .care: The Industry Storefront or The Service Warmth",
      metaDescription:
        ".health is the health industry's storefront suffix; .care writes the warmth of looking after someone. Compare semantic aim, pricing and fit, then hunt names available on both.",
      verdict:
        "The split is what the name points at. .health points at the industry — digital health platforms, health management and screening services, nutrition and fitness content sites, health-tech products on name.health say we are in the health business from the address itself, with an institutional polish that reads well on a pitch deck or a partnership intro. .care points at the service — home care and elder care providers, postpartum care centers, pet care, mental-health support lines on name.care put we look after you in the domain, and the warmth lands directly with families choosing a provider. Pricing sits a tier apart: .health about $11 to register jumping to about $62/yr — cheap in, mid-to-high to hold, so budget on the renewal; .care about $12 and $36/yr — the milder tier, roughly sixty percent of .health's holding cost. The test: the subject is the health industry — platforms, management services, health tech, industry content → .health's storefront aims truer and the lane reads instantly; the subject is a caring service — elder care, nursing, childcare, emotional support → .care's warmth persuades better and costs less to keep. Two cautions: health and medical content faces stricter platform and regulatory review, so credentials, privacy policies and disclaimers must match the domain's professional promise; and neither suffix substitutes for a medical license — clinical businesses should clear local practice and advertising rules first. Naming: brand + .health (the industry storefront standard) versus service word + .care (the provider standard, homecare/eldercare-style compounds) are each side's on-target patterns.",
      pickA: ["Digital health platforms", "Screening & health-tech products", "Nutrition & fitness content sites", "Health-industry storefronts"],
      pickB: ["Home & elder care providers", "Postpartum care centers", "Pet care & childcare services", "Mental-health support lines"],
    },
  },
  "family-vs-life": {
    slug: "family-vs-life",
    a: "family",
    b: "life",
    zh: {
      title: ".family 和 .life 怎么选：家庭场景与生活方式的分工",
      metaDescription: ".family 把家庭场景写进域名，.life 是生活方式类的通用后缀。对比两者的语义指向、价格与适用场景差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "分工在指向：.family 指向家庭这个单位——家庭相册与家谱站、亲子活动与家庭教育机构、家庭理财与保险规划、面向全家的服务品牌用 name.family，「为一家人服务」从地址就说清，「姓氏 + .family」做家庭主页更是天然款，家人共用的邮箱域名也顺理成章；.life 指向生活这个话题——生活方式博客、健康与自我提升内容、极简与慢生活品牌、生活服务应用用 name.life，「关于怎么生活」的气质从域名立住，个人成长、习惯养成、生活美学都装得下。价格同档温和：.family 注册约 $6、续费约 $31/年；.life 首年十几元促销、续费约 $25–30/年——两边长持都无压力，预算不构成决策因素，纯看语义。判断标准：主体是家庭——受众以「户」为单位，亲子机构、家庭服务、家谱主页 → .family 的场景更准，家长一眼知道这是给全家的；主体是生活方式——受众以「个人」为单位，博客、成长内容、生活品牌 → .life 的话题更宽，从健身写到读书都不违和。两个注意：两者都是内容与服务向后缀，电商主站若重交易信任可配 .com 做主域、这边做内容子站；.life 注册量大、好词消耗快，中意的名字别拖。命名上「姓氏 + .family」（家庭主页标准款）与「主题词 + .life」（生活方式博客标准款，如 slow.life 式组合）各是两边最点题的模式。",
      pickA: ["家庭相册与家谱主页", "亲子活动与家庭教育机构", "家庭理财与保险规划", "面向全家的服务品牌"],
      pickB: ["生活方式博客与内容站", "健康与自我提升品牌", "极简与慢生活品牌", "生活服务类应用"],
    },
    en: {
      title: ".family vs .life: The Household Unit or The Lifestyle Topic",
      metaDescription:
        ".family writes the household into the address; .life is the general suffix of lifestyle topics. Compare semantic aim, pricing and fit, then hunt names available on both.",
      verdict:
        "The split is what the name points at. .family points at the household as a unit — family photo albums and genealogy sites, parent-child activity providers and family education services, family finance and insurance planning, whole-family service brands on name.family say for the whole household from the address; surname + .family is the natural family homepage, and a shared family email domain follows for free. .life points at living as a topic — lifestyle blogs, wellness and self-improvement content, minimalism and slow-living brands, daily-life apps on name.life carry the about how to live register, and personal growth, habits and life aesthetics all fit. Both price in the mild tier: .family about $6 to register and $31/yr to renew; .life a bargain first year with roughly $25–30/yr renewals — painless to hold either way, so semantics decide everything. The test: the subject is the family — the audience counts in households, parent-child services, family businesses, genealogy pages → .family's scene is more precise and parents instantly read it as for the whole family; the subject is a lifestyle — the audience counts in individuals, blogs, growth content, living brands → .life's topic is wider and stretches from fitness to reading without strain. Two cautions: both are content-and-service suffixes, so a transaction-heavy store may keep .com as the main domain with these as the content home; and .life's large registration base burns good words fast — don't sit on a name you like. Naming: surname + .family (the family homepage standard) versus theme word + .life (the lifestyle blog standard, slow.life-style compounds) are each side's on-target patterns.",
      pickA: ["Family albums & genealogy pages", "Parent-child & family education services", "Family finance & insurance planning", "Whole-family service brands"],
      pickB: ["Lifestyle blogs & content sites", "Wellness & self-improvement brands", "Minimalism & slow-living brands", "Daily-life apps"],
    },
  },
  "surf-vs-travel": {
    slug: "surf-vs-travel",
    a: "surf",
    b: "travel",
    zh: {
      title: ".surf 和 .travel 怎么选：浪点生意与行程生意的分工",
      metaDescription: ".surf 把冲浪生活方式写进域名，.travel 是旅业机构的行业后缀。对比两者的行业指向、价格与适用场景差异，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "分工在生意主体：.surf 是浪点词——冲浪学校与教练、浪板装备电商、浪况预报与冲浪内容站、海边浪店用 name.surf，「下水来这儿」从地址就说清，卖的是这一次下水，「地名 + .surf」比通用后缀更像本地浪店；.travel 是行程词——冲浪旅行线路定制、海外浪点行程与营地代订、海岛度假村的旅业门面用 name.travel，卖的是从机票住宿到浪板租赁的整段行程，.travel 历史上曾要求旅业资质、行业身份感更强。冲浪旅游正好横跨两边：主体是教学与浪店选 .surf，主体是行程打包与代订选 .travel。价格差距悬殊：.surf 注册约 $2、续费约 $26/年——温和档长持无压力；.travel 注册约 $16、续费约 $119/年——旅业机构门面价，对个人站明显偏贵。判断标准：收入来自浪点本身——教学费、装备销售、预报订阅 → .surf 品类更锐，浪人搜「海滩 + surf」也直达；收入来自行程差价与服务费——冲浪营线路、海外浪点团期、住宿打包 → .travel 的旅业身份更点题，客户订整段行程时更信任。两个注意：.travel 续费约 ¥857/年，个人冲浪博客别硬上，轻量内容站 .surf 足够；冲浪旅游季节性强，域名的角色是订营与订课的稳定入口，页面要把团期与浪季说清楚。命名上「海滩/地名 + .surf」（直接接住找学校搜索）与「目的地 + surf + .travel」式组合（冲浪旅游标准款）各是两边最点题的模式。",
      pickA: ["冲浪学校与教练", "浪板装备电商与浪店", "浪况预报与冲浪内容站", "承接「海滩 + surf」搜索"],
      pickB: ["冲浪旅行线路定制", "海外浪点行程与营地代订", "海岛度假村旅业门面", "整段行程打包的旅业生意"],
    },
    en: {
      title: ".surf vs .travel: The Break Business or The Itinerary Business",
      metaDescription:
        ".surf writes the surf lifestyle into the address; .travel is the travel industry's suffix. Compare industry aim, pricing and fit, then hunt names available on both.",
      verdict:
        "The split is what the business sells. .surf is the break word — surf schools and instructors, board and gear stores, forecast and content sites, beach surf shops on name.surf say paddle out here, selling this session today, and place name + .surf reads like the local surf shop where a generic suffix wouldn't. .travel is the itinerary word — surf trip operators, overseas break-and-camp booking services, island resort travel desks on name.travel sell the whole journey from flights and stays to board rentals, and .travel historically required travel-industry credentials, giving it a stronger institutional identity. Surf tourism straddles both: pick .surf when the subject is the lessons and the shop, .travel when the subject is the packaged trip. Pricing sits tiers apart: .surf about $2 to register and $26/yr to renew — the mild tier, painless to hold; .travel about $16 and $119/yr — a travel-trade storefront price, plainly steep for personal sites. The test: revenue comes from the break itself — lesson fees, gear sales, forecast subscriptions → .surf's category is sharper and surfers searching beach + surf land directly; revenue comes from itinerary margins and service fees — surf camp tours, overseas trip bookings, stay packages → .travel's industry identity aims truer and travelers booking a full trip trust it more. Two cautions: .travel's $119/yr is not for a personal surf blog — lightweight content sites are fine on .surf; and surf tourism is strongly seasonal, so the domain's job is the stable camp and lesson booking entrance with departure dates and swell seasons made clear. Naming: beach or place + .surf (catching school searches directly) versus destination + surf + .travel compounds (the surf-tour standard) are each side's on-target patterns.",
      pickA: ["Surf schools & instructors", "Board & gear stores", "Forecast & surf content sites", "Catching beach + surf searches"],
      pickB: ["Surf trip operators", "Overseas break & camp bookings", "Island resort travel desks", "Full-itinerary package businesses"],
    },
  },
  "ltd-vs-llc": {
    slug: "ltd-vs-llc",
    a: "ltd",
    b: "llc",
    zh: {
      title: ".ltd 和 .llc 怎么选：注册地决定的公司抬头对比",
      metaDescription: ".ltd 对齐英联邦/中国的有限公司抬头，.llc 对齐美国 LLC 注册文件。对比两者的语义边界、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两个都是「把公司抬头写进域名」的后缀，分工由注册地决定。.ltd 是 limited 的全球通用缩写——英联邦与中国的公司名里天天见，「公司名 + .ltd」与营业执照抬头天然对齐；.llc 强绑定美国 LLC 形态，「公司名 + .llc」与美国注册文件一字不差，对美国客户与平台审核尤其有说服力。价格差一档：.ltd 注册约 $6、续费约 $25/年——首年低价、续费温和；.llc 注册约 $11、续费约 $35/年——中档持有。判断标准就一条：公司注册在哪。英联邦/中国语境的有限公司、集团子公司与新业务线 → .ltd 更贴抬头且更便宜；美国注册的 LLC、跨境卖家的美国主体、接美元收款的独立开发者 → .llc 的实体信号更准。两个注意：没注册 LLC 的主体硬用 .llc 容易名实不符，先落地注册再上域名；两边语义都是「公司官网」，内容站与个人项目用哪个都别扭。命名上「公司名 + 后缀」是两边的标准款，按注册文件抬头选后缀即可。",
      pickA: ["英联邦/中国语境的有限公司", "集团子公司与新业务线", "续费预算敏感的公司官网", "创业公司品牌站"],
      pickB: ["美国注册的 LLC 公司官网", "跨境电商美国主体站", "面向美国客户与平台审核", "自由职业者公司化品牌"],
    },
    en: {
      title: ".ltd vs .llc: The Letterhead Suffix, Picked by Where You're Registered",
      metaDescription:
        ".ltd matches Commonwealth-style limited companies; .llc matches US LLC formation papers. Compare semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both suffixes write the company letterhead into the address; the split is where the entity is registered. .ltd is the global shorthand for limited company — it appears in company names across the Commonwealth and China, so company name + .ltd lines up naturally with the certificate. .llc is tightly bound to America's default company form — company name + .llc matches the formation papers letter for letter, which lands especially well with US clients and platform reviews. Pricing sits a tier apart: .ltd about $6 to register and $25/yr to renew — cheap first year, mild renewal; .llc about $11 and $35/yr — a mid-tier hold. The test is one question: where is the company registered? Commonwealth or China-context limited companies, group subsidiaries and new business lines → .ltd matches the letterhead and costs less; US-registered LLCs, cross-border sellers' US entities and indie developers billing in dollars → .llc's entity signal aims truer. Two cautions: using .llc without an actual LLC invites a mismatch — form the entity first; and both suffixes mean company site, so content projects and personal pages read awkward on either. Naming: company name + suffix is the standard on both sides — pick the suffix that matches the papers.",
      pickA: ["Commonwealth/China-context limited companies", "Group subsidiaries & new business lines", "Renewal-budget-sensitive company sites", "Startup brand homes"],
      pickB: ["US-registered LLC company sites", "Cross-border sellers with US entities", "US clients & platform reviews", "Freelancers going corporate"],
    },
  },
  "ltd-vs-co": {
    slug: "ltd-vs-co",
    a: "ltd",
    b: "co",
    zh: {
      title: ".ltd 和 .co 怎么选：注册抬头与品牌简写的取舍",
      metaDescription: ".ltd 像营业执照抬头，.co 是 company 的品牌化简写。对比两者的气质、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两个都指向「公司」，气质完全不同。.ltd 是注册抬头——「公司名 + .ltd」与营业执照对齐，读起来是「正经注册的有限公司」，适合把合规感写进地址的中小企业与专业服务公司；.co 是品牌简写——两个字母短促轻快，创业公司与融资叙事里 .co 早已是 .com 之外的主流选择，读起来是「一家现代公司」而非「一份注册文件」。价格上 .ltd 注册约 $6、续费约 $25/年；.co 注册约 $10、续费在多数注册商 $25-35/年——长期成本接近，差别主要在首年与气质。判断标准：域名要传达的是「合规实体」还是「品牌」。咨询、代理、集团子公司这类靠资质与信任做生意的 → .ltd 的抬头感是加分项；产品导向的创业公司、想要短域名与融资叙事的 → .co 更轻更潮，且两字母后缀的库存与转售流动性都更好。注意 .co 是哥伦比亚国别域被全球品牌化使用，个别场景会被误敲成 .com——品牌起量后建议把 .com 一并收了；.ltd 则别用在内容站与个人项目上。命名上「公司名 + .ltd」对齐执照，「品牌词 + .co」做主站是两边的标准款。",
      pickA: ["咨询与专业服务公司", "把合规感写进地址的中小企业", "集团子公司与新业务线", "首年预算敏感"],
      pickB: ["产品导向的创业公司", "想要两字母短后缀的品牌", "融资叙事与硅谷气质", "计划后续收购 .com 的主站"],
    },
    en: {
      title: ".ltd vs .co: The Certificate or The Brand Shorthand",
      metaDescription:
        ".ltd reads like the company certificate; .co is the branded shorthand for company. Compare vibe, pricing and fit, then hunt names available on both.",
      verdict:
        "Both point at company, with opposite vibes. .ltd is the letterhead — company name + .ltd lines up with the certificate and reads properly registered limited company, a fit for SMEs and professional-services firms that want compliance in the address. .co is the brand shorthand — two letters, short and quick, long established as the mainstream alternative to .com in startup and fundraising circles; it reads a modern company, not a registration document. On price, .ltd runs about $6 to register and $25/yr to renew; .co registers around $10 and renews at $25–35 at many registrars — long-term costs land close, so the real difference is year one and vibe. The test: should the domain signal a compliant entity or a brand? Consulting firms, agencies and group subsidiaries that trade on credentials and trust → .ltd's letterhead feel is upside; product-led startups wanting a short domain and a fundraising-friendly read → .co travels lighter, with better inventory and resale liquidity for a two-letter suffix. Two cautions: .co is Colombia's country code globally rebranded, and a slice of users will fat-finger .com — buy the matching .com once the brand has traction; and keep .ltd off content sites and personal projects. Naming: company name + .ltd matches the certificate; brand word + .co as the main site is the standard on the other side.",
      pickA: ["Consulting & professional-services firms", "SMEs putting compliance in the address", "Group subsidiaries & new business lines", "First-year-budget sensitive"],
      pickB: ["Product-led startups", "Brands wanting a two-letter suffix", "Fundraising narrative & startup vibe", "Main sites planning to acquire .com later"],
    },
  },
  "biz-vs-com": {
    slug: "biz-vs-com",
    a: "biz",
    b: "com",
    zh: {
      title: ".biz 和 .com 怎么选：老牌替补与默认答案的对比",
      metaDescription: ".biz 是 2001 年就开放的老牌生意后缀，.com 是所有人的默认答案。对比两者的信任度、库存与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "这是「默认答案」与「老牌替补」的对比。.com 认知度无可替代——用户口头听到一个品牌默认补全 .com，长期品牌资产与转售流动性都是天花板；.biz 是 2001 年就开放的老牌 gTLD，business 语义直白，全球注册商与邮箱系统支持度拉满，最大优势是库存：.com 里早被占光的短公司名、行业词在 .biz 大量有货。价格接近：.com 注册续费稳定在 $10-12/年 档；.biz 注册约 $7、续费约 $19/年——都是温和档，成本不构成决策因素。判断标准：品牌词拿不拿得到。.com 能注册或收购价可接受 → 别犹豫，尤其是面向大众的正式品牌与口头传播多的场景；心仪名字 .com 在别人手里、生意本身是外贸/B2B/本地实体 → .biz 的生意语义反而比硬凑一个变体 .com 更直白，海外客户一眼读懂。两个注意：.biz 早年被垃圾邮件站用得多，信任分低于 .com，正经官网内容与 HTTPS 要跟上；品牌词常见且对应 .com 是竞品在运营时，用 .biz 会持续分流——这种情况宁可换名字。命名上「公司名/行业词 + .biz」直接接住生意语义，.com 侧则按「品牌词 + .com」的标准款走。",
      pickA: ["心仪名字 .com 已被注册", "外贸与 B2B 业务站", "本地商家与个体生意", "同名单更高的可注册命中率"],
      pickB: ["面向大众的正式品牌", "长期品牌资产与转售", "口头传播场景多（广告、播客）", "预算允许收购的主站"],
    },
    en: {
      title: ".biz vs .com: The Veteran Fallback or The Default Answer",
      metaDescription:
        ".biz is the 2001-vintage business suffix; .com is everyone's default. Compare trust, inventory and fit, then hunt names available on both.",
      verdict:
        "This is the default answer versus the veteran fallback. .com's recognition is irreplaceable — users hearing a brand out loud autocomplete .com by reflex, and for long-term brand assets and resale liquidity it's the ceiling. .biz is a 2001-vintage gTLD with plain business semantics, universal registrar and email support, and its real edge is inventory: short company names and trade words long gone on .com are widely open on .biz. Pricing is close — .com sits stably around $10–12/yr, .biz about $7 to register and $19/yr to renew — cheap enough that cost isn't the decider. The test: can you get the brand word? If the .com is open or the acquisition price is acceptable → don't hesitate, especially for mainstream consumer brands and heavy word-of-mouth channels. If the name you love is taken on .com and the business itself is trade, B2B or a local storefront → .biz's business semantics read more honestly than a mangled .com variant, and overseas clients parse it instantly. Two cautions: early spam abuse left .biz with less trust than .com, so serious sites need real content and HTTPS to carry it; and if the brand word is common and a competitor operates the .com, .biz will leak traffic indefinitely — better to change the name. Naming: company or trade word + .biz reads business instantly; on the other side, brand word + .com is the standard.",
      pickA: ["Your name is taken on .com", "Trade & B2B ventures", "Local businesses & sole proprietors", "Better availability odds for the same list"],
      pickB: ["Mainstream consumer brands", "Long-term brand asset and resale", "Heavy word-of-mouth channels (ads, podcasts)", "Main sites with acquisition budget"],
    },
  },
  "fyi-vs-info": {
    slug: "fyi-vs-info",
    a: "fyi",
    b: "info",
    zh: {
      title: ".fyi 和 .info 怎么选：轻快速查与正式资料的分工",
      metaDescription: ".fyi 是轻快的「供你参考」，.info 是老牌正式的「信息」。对比两者的气质、续费结构与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两个都是信息类后缀，分工在气质与账本。.fyi 是英文里最日常的信息前缀——docs.fyi、changelog.fyi 读起来就是一句话，轻快俏皮，适合产品文档、更新日志、状态页与速查手册；最难得的是价格结构：注册续费同价约 $6/年，无「首年低价钓鱼」问题，是信息站里最省心的长期持有。.info 是 2001 年第一批新通用后缀，「信息」语义正式，二十多年历史让它的认知度在新后缀里名列前茅——资料站、行业百科、活动信息页用它顺理成章；但账本结构相反：首年常年极低（经常一两美元）、续费翻数倍，长期持有要按续费价核算。判断标准：信息的「体温」。产品配套的文档/changelog/状态页、话题速查站这类轻快内容 → .fyi 的口语感更贴且长期成本可预期；行业百科、正式资料库、活动信息发布这类端着讲的内容 → .info 的正式感与老牌认知更稳。两个注意：fyi 是英文缩写，纯中文受众站点要在页面说清定位；.info 历史上被垃圾站用得多，商业主站信任感弱于 .com。命名上「产品名 + .fyi」挂文档、「话题词 + .fyi」接速查搜索，「主题词 + .info」做正式资料站是两边标准款。",
      pickA: ["产品文档与更新日志站", "状态页与速查手册", "续费成本要可预期的长期持有", "轻快俏皮的话题信息站"],
      pickB: ["行业百科与正式资料库", "活动与信息发布页", "看重老牌后缀认知度", "首年低成本试验内容项目"],
    },
    en: {
      title: ".fyi vs .info: The Quick Lookup or The Formal Reference",
      metaDescription:
        ".fyi is the breezy heads-up; .info is the veteran formal reference suffix. Compare vibe, renewal structure and fit, then hunt names available on both.",
      verdict:
        "Both are information suffixes; the split is vibe and the ledger. .fyi is everyday English for for your information — docs.fyi and changelog.fyi read as a sentence, light and snappy, a fit for product docs, changelogs, status pages and cheat-sheet sites. Its rarest trait is the price structure: flat about $6 to register and renew, no first-year teaser, the most carefree long-term hold among info sites. .info is from the 2001 first wave of new gTLDs with formal information semantics and two decades of recognition — resource sites, industry wikis and event info pages wear it naturally; but its ledger runs the other way: rock-bottom first years (often a dollar or two) with renewals several times higher, so budget on the renewal price. The test is the information's temperature. Product-side docs, changelogs and status pages, topic quick-lookup sites — breezy content → .fyi reads truer and costs stay predictable. Industry wikis, formal reference libraries, event announcements — content that stands on ceremony → .info's formality and veteran recognition carry better. Two cautions: fyi is an English abbreviation, so purely non-English audiences may need the positioning spelled out; and .info's spam history leaves commercial main sites less trusted than .com. Naming: product name + .fyi for docs and topic + .fyi for lookups; theme word + .info is the formal-reference standard on the other side.",
      pickA: ["Product docs & changelog sites", "Status pages & cheat sheets", "Predictable flat renewal for long holds", "Breezy topic info sites"],
      pickB: ["Industry wikis & formal references", "Event & info announcement pages", "Veteran-suffix recognition", "Cheap first-year content experiments"],
    },
  },
  "promo-vs-shop": {
    slug: "promo-vs-shop",
    a: "promo",
    b: "shop",
    zh: {
      title: ".promo 和 .shop 怎么选：活动阵地与常设店铺的分工",
      metaDescription: ".promo 是短期活动与优惠码的阵地，.shop 是常设电商店铺的门面。对比两者的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两个都在电商营销链路里，分工看「卖场是常设还是限时」。.shop 是店铺词——什么品类都能装，「品牌 + .shop」本身就是一句行动号召，独立站与 DTC 品牌的通用门面，全球注册量在电商后缀里最大；.promo 是促销词——促销落地页、优惠码聚合、campaign 微站与达人带货页用它，「这里有优惠」从地址就说清了，比一长串带参数的活动 URL 更好记好读。价格结构不同：.promo 注册约 $11、续费约 $20/年——温和档长持无压力；.shop 首年常有低价促销、续费明显更高——预算按续费价算。判断标准：域名承载的是「货架」还是「活动」。长期运营的独立站、把商品与购物车放上去的 → .shop 的店铺语义是门面；主站已有、要给大促/新品/联盟推广开独立阵地的 → .promo 的活动语义更准，campaign 结束还能复用给下一场。两个注意：.promo 促销语义强，公司主站与产品官网用它撑不起长期品牌；营销类后缀在部分邮箱过滤器眼里更敏感，促销邮件用主域名发、.promo 只做落地页更稳。命名上「品牌 + .shop」做常设店、「品牌/品类 + .promo」做活动阵地是两边标准款。",
      pickA: ["促销活动落地页", "优惠码与折扣聚合站", "品牌 campaign 微站", "达人带货与联盟推广页"],
      pickB: ["长期运营的独立站与 DTC 品牌", "把商品与购物车放上去的常设店", "「品牌 + 行动号召」的门面域名", "电商后缀里最大的注册量与认知"],
    },
    en: {
      title: ".promo vs .shop: The Campaign Outpost or The Permanent Storefront",
      metaDescription:
        ".promo hosts short campaigns and coupon hubs; .shop fronts the permanent store. Compare semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both live in the commerce funnel; the split is whether the venue is permanent or limited-time. .shop is the store word — any category fits, brand + .shop is itself a call to action, the default storefront for independent and DTC brands and the biggest commerce suffix by registrations. .promo is the offer word — promotion landing pages, coupon aggregators, campaign microsites and creator promo pages on name.promo say the deal lives here, beating a parameter-laden campaign URL for memorability. Price structures differ: .promo about $11 to register and $20/yr to renew — a mild tier, painless to hold; .shop runs cheap first-year promos with notably higher renewals — budget on the renewal price. The test: does the domain carry the shelves or the event? A long-running store with products and a cart → .shop's storefront semantics are the face of the business. A main site that needs a separate stage for a big sale, a launch or affiliate pushes → .promo aims truer, and the domain recycles for the next campaign when this one ends. Two cautions: .promo's promo semantics run hot — company homepages can't build a lasting brand on it; and marketing suffixes get extra scrutiny from some mail filters, so send email from the main domain and keep .promo for landing pages. Naming: brand + .shop for the permanent store; brand or niche + .promo for the campaign outpost.",
      pickA: ["Promotion landing pages", "Coupon & discount aggregators", "Brand campaign microsites", "Creator & affiliate promo pages"],
      pickB: ["Long-running independent & DTC stores", "Permanent storefronts with carts", "Brand + call-to-action storefront domains", "Biggest commerce-suffix recognition"],
    },
  },
  "express-vs-store": {
    slug: "express-vs-store",
    a: "express",
    b: "store",
    zh: {
      title: ".express 和 .store 怎么选：快服务与常设商店的分工",
      metaDescription: ".express 把「快」写进域名，.store 是常设商店的正式门面。对比两者的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "分工看生意卖的是「速度」还是「货架」。.express 是速度词——快递与同城配送、跨境物流与货代、上门快修快洗、主打「秒出结果」的工具产品用 name.express，「快」的承诺从地址就说清了；express 刻在全球物流业的行业名里（顺丰速运、联邦快递的英文名都有它），「城市/品牌 + .express」对快递与货代就是行业标准式命名。.store 是商店词——实体「商店」的正式称谓，品牌旗舰店气质重，主站 .com + 同名 .store 做商城是最主流的分工玩法。价格结构不同：.express 注册约 $9、续费约 $31/年——首年低价、续费中档；.store 首年常见大幅促销、续费要按 $50-60/年 核算——电商后缀里最陡的促销-续费差之一。判断标准：收入来自「送得快/修得快」的服务费 → .express 的速度语义更准，同城搜索也接得住；收入来自把商品放上货架卖 → .store 的商店语义是门面。两个注意：express 一词多义（快递/特快/表达），页面首屏要说清做的是哪门生意；.store 续费有分量，纯玩票项目按续费价三思。命名上「城市/线路 + .express」接物流搜索，「品牌 + .store」做旗舰商城是两边标准款。",
      pickA: ["快递与同城配送", "跨境物流与货代", "上门快修快洗服务", "主打速度的工具产品"],
      pickB: ["品牌旗舰店与商城", "主站 .com + 同名 .store 分工", "把商品放上货架的常设店", "电商门面的正式称谓"],
    },
    en: {
      title: ".express vs .store: Selling Speed or Selling Shelves",
      metaDescription:
        ".express writes the fast promise into the address; .store fronts the permanent shop. Compare semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "The split is what the business sells: speed or shelves. .express is the speed word — courier and local delivery, cross-border logistics and freight forwarders, on-demand repair and cleaning, and instant-result tools on name.express make the fast promise in the domain itself; express is baked into the logistics industry's own names (FedEx and half the world's couriers carry it), so city or brand + .express is the standard naming pattern for delivery and freight. .store is the shop word — the formal storefront title with flagship-store gravitas, and main site on .com + the matching .store as the shop is the most common division of labor. Price structures differ: .express about $9 to register and $31/yr to renew — cheap first year, mid renewal; .store runs steep first-year promos with renewals to budget around $50–60/yr — one of the widest promo-to-renewal gaps among commerce suffixes. The test: revenue comes from delivering or fixing fast — service fees → .express's speed semantics aim truer and local delivery searches land directly; revenue comes from putting products on shelves → .store's storefront semantics are the face. Two cautions: express carries several senses (courier, fast, expression), so the hero section should say which business this is; and .store's renewal has real weight — hobby projects should think twice at the renewal price. Naming: city or route + .express catches logistics searches; brand + .store is the flagship-shop standard.",
      pickA: ["Courier & local delivery services", "Cross-border logistics & freight forwarders", "On-demand repair & cleaning services", "Speed-first tool products"],
      pickB: ["Flagship brand stores & malls", ".com main site + matching .store split", "Permanent stores with product shelves", "The formal storefront title"],
    },
  },
  "press-vs-news": {
    slug: "press-vs-news",
    a: "press",
    b: "news",
    zh: {
      title: ".press 和 .news 怎么选：媒体身份与资讯站的分工",
      metaDescription: ".press 是编辑部与出版身份的宣言，.news 是资讯站最直白的门牌。对比两者的语义、续费结构与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两个都是新闻内容后缀，分工在「机构身份」与「内容形态」。.press 在英文里既指新闻业也指出版社，机构宣言感更重——独立编辑部、调查报道项目、学生报刊、公司新闻中心（把 press.brand.com 翻成 brand.press）用它，「这里做新闻」从域名就立住了；.news 语义最直白，看到域名就知道是资讯站——垂直行业资讯、地方新闻、付费 newsletter 用「主题 + .news」，本身就是完整产品名。账本差异明显：.press 注册约 $5、续费约 $64/年，典型首年低价、续费陡升，认真办刊再上；.news 首年几美元到十美元、续费 $26 左右，内容后缀里的温和档，长持压力小得多。判断标准：域名承载的是「编辑部的名字」还是「资讯的主题」。刊名、报头、机构新闻中心 → .press 的出版身份更正；赛道站、聚合站、行业周报 → .news 的资讯语义更准且更省钱。两个注意：.press 续费有分量，个人博客用 .blog 更划算；两者都语义强绑定新闻，非资讯业务硬用会误导预期。命名上「刊名/城市/行业 + .press」像正经出版物，「主题词 + .news」接资讯搜索是两边标准款。",
      pickA: ["独立编辑部与调查报道项目", "学生报刊与刊物品牌", "公司新闻中心（brand.press）", "出版机构身份宣言"],
      pickB: ["垂直行业资讯与赛道站", "地方新闻与聚合站", "付费 newsletter 与行业周报", "续费温和的长期内容站"],
    },
    en: {
      title: ".press vs .news: Editorial Identity or The News Destination",
      metaDescription:
        ".press declares an editorial and publishing identity; .news is the plainest news-site sign. Compare semantics, renewal structure and fit, then hunt names available on both.",
      verdict:
        "Both are journalism suffixes; the split is institutional identity versus content format. In English, press means both the news industry and the publishing house, so .press carries a stronger institutional claim — independent newsrooms, investigative projects, student papers and corporate press centers (flipping press.brand.com into brand.press) plant a flag with it: journalism happens here. .news is the most literal content suffix there is — one glance and readers know it's a news destination; topic + .news is a complete product name for vertical industry coverage, local news and paid newsletters. The ledgers differ sharply: .press runs about $5 to register and $64/yr to renew — the classic cheap-first-year, steep-renewal pattern, so commit before branding; .news runs a few dollars to $10 first year with renewals around $26/yr — a moderate tier that's far lighter to hold. The test: does the domain carry a masthead or a topic? Publication names, mastheads and institutional newsrooms → .press's publishing identity reads truer; niche sites, aggregators and industry digests → .news aims more precisely and costs less. Two cautions: .press's renewal is heavy for a personal blog — .blog fits cheaper; and both suffixes hard-bind to journalism, so non-news businesses mislead expectations on either. Naming: masthead, city or industry + .press feels like a real publication; topic word + .news catches news searches on the other side.",
      pickA: ["Independent newsrooms & investigative projects", "Student papers & publication brands", "Corporate press centers (brand.press)", "A publishing-identity statement"],
      pickB: ["Vertical industry & niche news sites", "Local news & aggregators", "Paid newsletters & industry digests", "Milder renewals for long-term content sites"],
    },
  },
  "stream-vs-live": {
    slug: "stream-vs-live",
    a: "stream",
    b: "live",
    zh: {
      title: ".stream 和 .live 怎么选：流本身与现场感的分工",
      metaDescription: ".stream 把「流」写进域名，横跨内容直播与数据流；.live 主打「正在发生」的现场号召力。对比两者的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两个都在直播语境里，分工看域名强调「流本身」还是「现场感」。.stream 是个动词后缀——主播个人站、推流与转码工具、流媒体内容站用它，「点开就在播」的暗示从地址开始；更妙的是它横跨两个热语境：消费级流媒体与工程界的数据流（Kafka、实时管道、事件处理），做 streaming 基础设施的技术产品用 name.stream 一眼即懂。.live 的语义是「正在发生」——线上活动与发布会页、演出与赛事、实时数据看板用「名字 + .live」自带「点进来看现场」的号召力。账本差异是关键：.stream 注册约 $5、续费约 $6/年，两头都便宜，是新后缀里罕见的无续费陷阱，长持无忧；.live 首年促销便宜但续费明显上浮，注册前看清续费价。判断标准：产品的核心是「持续的流」还是「限时的场」。7×24 的频道、推流工具、数据流产品 → .stream 更准且成本可预期；发布会、峰会、演出这类有开始有结束的「场」 → .live 的现场感更带劲。两个注意：.stream 历史上有垃圾注册记录，重要邮件放主域名发；.live 语义绑定实时，与直播无关的主站会预期错位。命名上「ID/功能词 + .stream」接流媒体与数据流，「活动名 + .live」做现场入口是两边标准款。",
      pickA: ["主播个人站与流媒体内容站", "推流、转码与直播工具", "数据流与实时处理产品", "注册续费都便宜的长期持有"],
      pickB: ["线上活动与发布会页", "演出、赛事与现场活动", "实时数据与状态看板", "「点进来看现场」的号召力"],
    },
    en: {
      title: ".stream vs .live: The Stream Itself or The Live Moment",
      metaDescription:
        ".stream writes the stream into the address, spanning content and data pipelines; .live sells the happening-now moment. Compare semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both live in the broadcast context; the split is whether the domain stresses the stream itself or the live moment. .stream is a verb of a suffix — streamer personal sites, ingest and transcoding tools, and streaming content hubs get the click-and-it's-playing hint right in the address; better still, the word spans two hot contexts, consumer streaming and engineering data streams (Kafka, real-time pipelines, event processing), so streaming-infrastructure products read instantly on name.stream. .live means happening now — online events and launch pages, shows and matches, and real-time dashboards on name.live carry a built-in come watch it live pull. The ledger is the decider: .stream runs about $5 to register and $6/yr to renew — cheap both years, one of the rare new gTLDs with no renewal trap, worry-free to hold; .live runs cheap first-year promos with notably higher renewals, so check the renewal price before registering. The test: is the product a continuous stream or a time-boxed moment? A 24/7 channel, an ingest tool, a data-stream product → .stream aims truer with predictable costs; a launch event, a summit, a show with a start and an end → .live's moment energy hits harder. Two cautions: .stream's spam-registration history makes a few mail gateways wary — keep important email on your main domain; and .live hard-binds to real-time, so unrelated main sites misset expectations. Naming: handle or function word + .stream for streaming and data-stream products; event name + .live as the live entrance on the other side.",
      pickA: ["Streamer sites & streaming content hubs", "Ingest, transcoding & live-streaming tools", "Data-streaming & real-time processing products", "Cheap-both-years long-term holds"],
      pickB: ["Online events & launch pages", "Shows, matches & live performances", "Real-time data & status dashboards", "The come-watch-it-live pull"],
    },
  },
  "movie-vs-tv": {
    slug: "movie-vs-tv",
    a: "movie",
    b: "tv",
    zh: {
      title: ".movie 和 .tv 怎么选：单片战役与频道品牌的分工",
      metaDescription: ".movie 是电影语义最直白的后缀，适合影片宣传战役；.tv 是视频与频道品牌的行业标配。对比两者的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两个都指向影像内容，分工看载体是「一部片」还是「一个频道」。.movie 的电影语义零解释成本——「片名 + .movie」给每部片一个独立地址，比藏在公司站 /movies/片名 的路径好记得多，好莱坞发行方真的在用它做单片宣传站；制片公司、影展也顺理成章。.tv 借图瓦卢国别域名与「电视」的天然联想，成了视频内容的专属后缀——Twitch.tv 一个案例足以说明地位，直播平台、视频栏目、流媒体品牌、影视工作室用 name.tv，用户看到就知道「这里有内容可看」。账本差距是决定性的：.movie 注册约 $37、续费高达 $279/年，是给有营销预算的项目准备的——对宣发预算而言是零头，对个人站是重负，好在宣传站通常只需持有影片两三年生命周期；.tv 价格高于 .com 但远低于 .movie，且续费稳定，适合长期经营的频道品牌。判断标准：域名服务「一部作品的战役」还是「持续更新的频道」。影片宣发、影展、制片公司门面 → .movie 语义最正；栏目、主播、流媒体平台这类长期阵地 → .tv 的性价比与行业认知都更稳。两个注意：.movie 续费按年核算再上，影迷站与影评博客用 .reviews/.blog 更划算；两者都绑定影像语义，无关业务勿用。命名上「片名 + .movie」是战役标准式，「频道名/主播名 + .tv」是长期阵地标准款。",
      pickA: ["影片官方宣传站（片名 + .movie）", "制片公司与工作室门面", "影展与放映活动", "有宣发预算的单片战役"],
      pickB: ["直播平台与主播个人站", "视频栏目与频道品牌", "流媒体与长期内容阵地", "续费稳定的行业标配"],
    },
    en: {
      title: ".movie vs .tv: The Film Campaign or The Channel Brand",
      metaDescription:
        ".movie is the most literal film suffix, built for title campaigns; .tv is the industry standard for video and channel brands. Compare semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both point at moving pictures; the split is whether the domain carries one film or one channel. .movie parses with zero explanation — title + .movie gives each picture its own address, far more memorable than a /movies/title path buried in a corporate site, and Hollywood distributors genuinely run single-film campaign sites on it; production companies and film festivals wear it naturally too. .tv rode Tuvalu's country code into the television association and became video's home suffix — Twitch.tv alone settles its standing; streaming platforms, video shows, channel brands and studios on name.tv tell users there's something to watch here. The ledger decides: .movie runs about $37 to register and a steep $279/yr to renew — built for projects with a marketing budget, a rounding error against P&A spend but a real burden for a personal site, though campaign domains typically only need holding for a film's two-to-three-year life cycle. .tv costs more than .com but far less than .movie, with stable renewals — right for a channel brand you'll run for years. The test: does the domain serve one title's campaign or an ever-updating channel? Film promo, festivals, production-house fronts → .movie reads truest; shows, streamers and platforms holding ground long-term → .tv wins on cost and industry recognition. Two cautions: budget .movie on the renewal price — fan sites and review blogs fit .reviews or .blog far cheaper; and both suffixes hard-bind to video, so unrelated businesses should skip them. Naming: title + .movie is the campaign standard; channel or streamer name + .tv is the long-term pattern.",
      pickA: ["Official film campaign sites (title + .movie)", "Production companies & studio fronts", "Film festivals & screenings", "Single-title campaigns with marketing budgets"],
      pickB: ["Streaming platforms & streamer sites", "Video shows & channel brands", "Long-term streaming content bases", "Stable renewals at the industry standard"],
    },
  },
  "pictures-vs-photos": {
    slug: "pictures-vs-photos",
    a: "pictures",
    b: "photos",
    zh: {
      title: ".pictures 和 .photos 怎么选：制片公司范与照片交付的分工",
      metaDescription: ".pictures 自带「某某影业」的片厂血统，.photos 是摄影师作品与交付最直白的门牌。对比两者的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两个都是影像后缀，分工看做的是「出品」还是「照片」。.pictures 的妙处在片厂血统——Sony Pictures、Universal Pictures 把这个词刻进了行业史，小型制片公司在 brand.pictures 上一秒借到「某某影业」的读法，影视制作、婚礼活动跟拍团队、插画与视觉作品集用它都有分量。.photos 则最直白：「这里是照片」从域名就说清，摄影师作品集、人像与婚礼工作室天然合适，还有独特的实用玩法——按项目/客户开「照片交付页」，链接发出去客户秒懂。价格都温和但结构略异：.pictures 注册约 $8、续费约 $13/年，影像后缀里的性价比之选；.photos 注册约 $8、续费约 $24/年，同样是创意后缀温和档。判断标准：品牌读法是「公司名」还是「作品属性」。团队以「某某 Pictures」自居、卖的是成片与出品 → .pictures 的公司范更正；个人摄影师、卖拍摄服务与照片交付 → .photos 的复数所有格读法（某某的照片）更顺。两个注意：pictures 一词偏「成品」而非「拍摄过程」，卖预约拍摄流程的服务工作室用 .photography/.photo 语义更直接；两个后缀都不短（8/6 字母），前缀保持一两个音节最稳。命名上「姓氏/品牌 + .pictures」像制片公司，「人名/城市 + .photos」接作品集与交付是两边标准款。",
      pickA: ["影视与视频制作公司", "婚礼活动跟拍与出品团队", "「某某影业」式公司门面", "插画与视觉作品集"],
      pickB: ["摄影师个人作品集", "人像与婚礼摄影工作室", "按客户开照片交付页", "「某某的照片」所有格读法"],
    },
    en: {
      title: ".pictures vs .photos: Studio Pedigree or Photo Delivery",
      metaDescription:
        ".pictures borrows the movie-studio pedigree; .photos is the plainest sign for portfolios and photo delivery. Compare semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both are imaging suffixes; the split is whether you sell productions or photos. .pictures's charm is the studio pedigree — Sony Pictures and Universal Pictures carved the word into industry history, so a small production shop borrows the So-and-so Pictures read the moment it brands on brand.pictures; film and video production, wedding and event videography teams, and illustration portfolios all carry weight on it. .photos is the plainest sign there is: the domain says the photos live here — photographer portfolios and portrait or wedding studios fit naturally, plus a uniquely practical play: per-project or per-client photo-delivery pages whose links clients parse instantly. Pricing is mild on both with slightly different shapes: .pictures about $8 to register and $13/yr to renew — the value pick among imaging suffixes; .photos about $8 and $24/yr — the same moderate creative tier. The test: does the brand read as a company name or as the work itself? A team styling itself So-and-so Pictures, selling finished productions → .pictures reads truer as a company; a solo photographer selling shoots and delivering galleries → .photos's possessive plural (someone's photos) reads smoother. Two cautions: pictures connotes finished work rather than the shooting process, so a booking-driven service studio may read more directly on .photography or .photo; and neither suffix is short (8 and 6 letters), so keep the prefix to a syllable or two. Naming: surname or brand + .pictures feels like a production company; name or city + .photos is the portfolio-and-delivery standard.",
      pickA: ["Film & video production companies", "Wedding & event videography teams", "So-and-so Pictures company fronts", "Illustration & visual-art portfolios"],
      pickB: ["Photographer portfolios", "Portrait & wedding photo studios", "Per-client photo-delivery pages", "The someone's-photos possessive read"],
    },
  },
  "productions-vs-studio": {
    slug: "productions-vs-studio",
    a: "productions",
    b: "studio",
    zh: {
      title: ".productions 和 .studio 怎么选：接案制作公司与创意小团队的分工",
      metaDescription: ".productions 补全「某某制作」的行业惯用全称，.studio 是小而专创意团队的气质后缀。对比两者的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两个都是创作团队后缀，分工看团队的「营业形态」。.productions 补全的是行业里最老的公司命名格式——「某某 Productions」，brand.productions 读起来就是完整的公司全称，放名片上、片尾字幕里都正式；影视与广告制作公司、音乐与播客制作团队、活动与演出制作方用它，「接案制作」的定位一目了然。.studio 的语义是「工作室」——设计、影像、游戏与内容团队用「名字 + .studio」，比 .com 更能传达「小而专的创作团队」气质，两三人的创意小组尤其合适。账本接近：.productions 注册约 $8、续费约 $32/年，运营中的制作公司持有无压力；.studio 价格中等、库存充足。库存差异值得一提：.studio 热门词被挑得差不多了，.productions 里人名、工作室名、风格词命中率高得多。判断标准：对外身份是「接活的制作公司」还是「有自己作品的工作室」。给客户做片、做活动、做广告的乙方团队 → .productions 的公司全称感更正；做自己的游戏、内容、设计品牌的创作团队 → .studio 的作者气质更贴。两个注意：.productions 长达 11 个字母，前缀必须短——一个词或一个名字，别再接长词；面向消费者的内容品牌两个都不如 .tv/.media 直接。命名上「创始人名 + .productions」是行业惯例，「名字 + .studio」自带小而专团队气质是两边标准款。",
      pickA: ["影视与广告接案制作公司", "音乐与播客制作团队", "活动与演出制作方", "「某某 Productions」行业惯例全称"],
      pickB: ["设计与创意工作室", "游戏与独立开发小团队", "有自己作品的内容团队", "小而专的作者气质"],
    },
    en: {
      title: ".productions vs .studio: The For-Hire Shop or The Creative Studio",
      metaDescription:
        ".productions completes the So-and-so Productions company format; .studio carries the small-and-focused creative-team vibe. Compare semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both are creative-team suffixes; the split is the team's mode of business. .productions completes the oldest company-name format in the business — So-and-so Productions — so brand.productions reads as the full, legal-sounding name, at home on a business card or in end credits; film and ad production companies, music and podcast teams, and event or show producers wear the for-hire positioning plainly. .studio means the workshop — design, film, game and content teams on name.studio project a small-and-focused creative-team vibe that .com can't, and two-or-three-person crews fit it especially well. The ledgers are close: .productions about $8 to register and $32/yr to renew — painless for an operating production company; .studio sits at a mid price with ample inventory. The inventory gap is worth noting: .studio's hot words are largely picked over, while personal names, studio names and style words nearly all hit on .productions. The test: is the outward identity a for-hire production shop or a studio with its own work? Teams shooting, staging and producing for clients → .productions's full-company-name gravity reads truer; teams building their own games, content or design brand → .studio's authorial vibe fits closer. Two cautions: .productions runs 11 letters, so the prefix must be short — one word or a name, never another long word; and consumer-facing content brands read better on .tv or .media than on either. Naming: founder name + .productions is the industry convention; name + .studio carries the small-team vibe on the other side.",
      pickA: ["For-hire film & ad production companies", "Music & podcast production teams", "Event & show producers", "The So-and-so Productions convention"],
      pickB: ["Design & creative studios", "Game & indie-dev small teams", "Content teams with their own work", "The small-and-focused authorial vibe"],
    },
  },
  "audio-vs-fm": {
    slug: "audio-vs-fm",
    a: "audio",
    b: "fm",
    zh: {
      title: ".audio 和 .fm 怎么选：声音产业与电台气质的分工",
      metaDescription: ".audio 把声音产业写进域名，适合硬件品牌与录音棚；.fm 借调频广播之名成了播客与电台的身份标签。对比两者的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两个都是声音后缀，分工看做的是「声音的生意」还是「声音的节目」。.audio 把行业写进地址——音频硬件与耳机品牌、播客网络与音频平台、录音与母带工作室、音频技术工具用 name.audio 一词说清行业；hi-fi 公司历来以 Audio 结尾命名，brand.audio 对发烧友是熟悉的读法。.fm 借调频广播（FM radio）之名被音频行业彻底认领——Anchor（anchor.fm）、Last.fm 这些标杆让它成了「声音产品」的身份标签，只有两个字符，域名短而好念，节目名、频道名直接上最自然，还能玩 relay.fm 式的 domain hack。账本都是「无低价钩子」的平价结构：.audio 注册续费同价约 $104/年，精品定价从第一天就筛掉玩票项目，反而成了信任资产——挂 .audio 的站一看就是认真做的生意；.fm 注册续费均约 $88/年，成本同样不低，适合长期经营的音频品牌。判断标准：卖的是「设备与服务」还是「节目与内容」。硬件品牌、录音棚、音频技术公司 → .audio 的产业语义更正；播客、电台、音乐节目 → .fm 的电台气质更暖、更圈内。两个注意：单个个人播客两个都偏贵，平台页或 .fm 二级栏目更省；两者语义都绑定声音，无关业务勿用。命名上「品牌 + .audio」接硬件与技术公司，「节目名 + .fm」是播客电台标准款。",
      pickA: ["音频硬件与耳机品牌", "录音、混音与母带工作室", "音频技术工具与平台", "「某某 Audio」产业惯用读法"],
      pickB: ["播客与电台节目", "音乐频道与声音社区", "domain hack 短域名玩法", "电台气质的圈内身份标签"],
    },
    en: {
      title: ".audio vs .fm: The Sound Industry or The Radio Vibe",
      metaDescription:
        ".audio writes the sound industry into the address for gear brands and studios; .fm borrowed the radio band and became podcasting's badge. Compare semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both are sound suffixes; the split is whether you run a sound business or a sound show. .audio writes the industry into the address — audio hardware and headphone brands, podcast networks and platforms, recording and mastering studios, and audio-tech tools state it in one word; hi-fi companies have always ended their names in Audio, so brand.audio is a familiar read to audiophiles. .fm borrowed the FM radio band and got fully claimed by the audio world — Anchor (anchor.fm) and Last.fm made it the badge of things you can listen to; at two characters the whole domain stays short and speakable, show and channel names drop straight in, and relay.fm-style domain hacks are on the table. Both ledgers run flat with no teaser pricing: .audio costs the same to register and renew, about $104/yr — boutique pricing that filters out hobby projects from day one and quietly becomes a trust asset, since an .audio site signals a business that means it; .fm runs about $88/yr both ways, likewise a real commitment fit for brands in it for the long haul. The test: do you sell gear and services or shows and content? Hardware brands, studios and audio-tech companies → .audio's industry semantics read truer; podcasts, stations and music shows → .fm's radio vibe runs warmer and more native. Two cautions: a single personal podcast is pricey on either — a platform page or an .fm subpage is cheaper; and both hard-bind to sound, so unrelated businesses should skip them. Naming: brand + .audio for hardware and technology companies; show name + .fm is the podcast-and-station standard.",
      pickA: ["Audio hardware & headphone brands", "Recording, mixing & mastering studios", "Audio-tech tools & platforms", "The So-and-so Audio industry read"],
      pickB: ["Podcasts & radio-style shows", "Music channels & sound communities", "Short domain-hack plays", "The radio-vibe insider badge"],
    },
  },
  "credit-vs-finance": {
    slug: "credit-vs-finance",
    a: "credit",
    b: "finance",
    zh: {
      title: ".credit 和 .finance 怎么选：信用垂直与综合金融的分工",
      metaDescription: ".credit 把信用业务写进域名，适合征信、信用卡与信用修复；.finance 是综合金融的正装后缀，覆盖金融科技与财务服务。对比两者的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "两个都姓金融，口径一宽一窄。.credit 窄而准——信用评分与征信服务、信用卡比价与返现平台、信用修复与咨询、企业信用额度产品用 name.credit 一词说清业务，check.credit、build.credit 这类「动词 + .credit」读出来就是产品口号；账本要看清：注册约 $7（约 ¥48）、续费约 $83/年（约 ¥597），首年钩子明显、续费近九倍跳档，按 ¥600/年 持有成本核算再下手。.finance 宽而正——金融科技创业公司、财务顾问与资管、记账预算工具、企业金融 SaaS 都装得下，DeFi 圈已把它用成协议命名惯例（yearn.finance 完成了用户教育）；首年 $7 上下（约 ¥48）、续费约 $52/年（约 ¥375），续费同样偏高但比 .credit 温和一档。判断标准：业务核心是「信用」这一个词——征信、信用卡、信用修复 → .credit 点题最准；业务是更广义的金融产品或服务 → .finance 的口径与正式感更配。共同注意：征信与放贷在各地都是强监管业务，务必先核清金融牌照与广告合规，域名不能替代资质。命名上「动词 + .credit」接信用工具，「品牌 + .finance」接金融公司门面。",
      pickA: ["信用评分与征信服务", "信用卡比价与返现平台", "信用修复与咨询机构", "「动词 + .credit」产品口号式命名"],
      pickB: ["金融科技创业公司", "财务顾问与资管机构", "记账、预算与企业金融 SaaS", "DeFi 协议的圈内惯例后缀"],
    },
    en: {
      title: ".credit vs .finance: The Credit Vertical or Finance at Large",
      metaDescription:
        ".credit writes the credit business into the address for bureaus, cards and repair services; .finance is the suit-and-tie suffix for finance at large. Compare semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both live in finance; the split is scope. .credit is narrow and precise — credit scoring and bureau services, card comparison and cashback platforms, credit repair and counseling, and business credit-line products state it in one word on name.credit, and verb + .credit names like check.credit or build.credit read as a product slogan out loud. Mind the ledger: about $7 to register but $83/yr to renew — a steep first-year hook with a near nine-fold jump, so budget the ~$83/yr holding cost first. .finance is broad and formal — fintech startups, financial advisors and asset managers, budgeting tools and corporate-finance SaaS all fit, and DeFi has made it a protocol-naming convention (yearn.finance did the user education); about $7 year one and $52/yr renewal — also premium, but a notch gentler than .credit. The test: if the business is the word credit — bureaus, cards, repair — .credit reads truest; for anything broader in finance, .finance carries the scope and the gravitas. Shared caution: credit and lending are regulated everywhere, so clear licensing and advertising compliance first — a domain never substitutes for a license. Naming: verb + .credit for credit tools; brand + .finance for a financial company's front door.",
      pickA: ["Credit scoring & bureau services", "Card comparison & cashback platforms", "Credit repair & counseling", "Verb + .credit slogan-style names"],
      pickB: ["Fintech startups", "Financial advisors & asset managers", "Budgeting & corporate-finance SaaS", "DeFi's protocol-naming convention"],
    },
  },
  "loans-vs-money": {
    slug: "loans-vs-money",
    a: "loans",
    b: "money",
    zh: {
      title: ".loans 和 .money 怎么选：贷款产品与理财内容的分界",
      metaDescription: ".loans 把贷款业务写进域名，适合贷款产品、比价与助贷平台；.money 直白亲民，适合省钱攻略与个人理财内容。对比两者的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都跟钱打交道，一个卖「借钱」，一个讲「管钱」。.loans 是贷款垂直的行业招牌——个人贷与消费贷产品、贷款比价平台、房贷车贷经纪、面向小微企业的经营贷用 name.loans，业务一词说清，home.loans、fast.loans 这类组合读出来就是获客广告语；账本要算清：注册约 $11（约 ¥78）、续费约 $93/年（约 ¥671），续费约八倍于首年，按 ¥670/年 持有成本核算，短期获客页慎用。.money 直白、口语、有冲击力——省钱攻略、返现工具、预算记账、个人理财社区用它顺口好记，smart.money、save.money 读出来像一句理财建议；注册约 $11（约 ¥78）、续费约 $28/年（约 ¥204），续费在行业后缀里算温和，长期持有压力小得多。判断标准：业务是「贷款产品本身」——放贷、助贷、比价 → .loans 点题最准；业务是「钱怎么省怎么赚」的内容与工具 → .money 的亲民直白更配、持有也更便宜。共同注意：放贷助贷在各地都是强监管业务，上线前核清金融牌照、利率披露与广告合规；金钱主题也是钓鱼重灾区，真实主体信息与 HTTPS 是信任底线。",
      pickA: ["贷款产品与助贷平台", "贷款比价与利率聚合", "房贷车贷与经营贷经纪", "「场景 + .loans」广告语式命名"],
      pickB: ["省钱攻略与理财内容", "返现与优惠工具", "预算记账与比价服务", "续费温和、适合长期内容站"],
    },
    en: {
      title: ".loans vs .money: Lending Products or Money Content",
      metaDescription:
        ".loans writes lending into the address for loan products, brokers and comparison sites; .money is plain-spoken and approachable for personal-finance content. Compare semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both deal in money; one sells borrowing, the other talks managing it. .loans is the lending vertical's industry sign — personal and consumer loan products, comparison platforms, mortgage and auto brokers, and small-business lending read in one word on name.loans, and combos like home.loans or fast.loans sound like acquisition copy out loud. Mind the ledger: about $11 to register and $93/yr to renew — roughly eight times year one — so budget the ~$93/yr holding cost and think twice for short-lived campaign pages. .money is blunt, spoken and punchy — savings guides, cashback tools, budgeting apps and personal-finance communities wear it naturally; smart.money or save.money reads like a piece of advice. At about $11 to register and $28/yr to renew, it's one of the gentler industry suffixes to hold long-term. The test: if the business is the loan product itself — lending, brokering, comparison — .loans reads truest; for how-to-save-and-earn content and tools, .money is friendlier and far cheaper to keep. Shared cautions: lending is heavily regulated everywhere, so clear licensing, rate disclosure and ad compliance first; and money topics attract phishing, so real entity info and HTTPS are the trust baseline.",
      pickA: ["Loan products & lending platforms", "Loan comparison & rate aggregators", "Mortgage, auto & business-loan brokers", "Scenario + .loans ad-copy names"],
      pickB: ["Savings guides & finance content", "Cashback & deals tools", "Budgeting & comparison services", "Gentle renewal for long-term content sites"],
    },
  },
  "investments-vs-fund": {
    slug: "investments-vs-fund",
    a: "investments",
    b: "fund",
    zh: {
      title: ".investments 和 .fund 怎么选：综合投资门面与一笔钱的分工",
      metaDescription: ".investments 全称正式，适合投资公司与财富管理的机构门面；.fund 短而具体，指向单一基金与募资计划。对比两者的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都在讲投资，一个是「门面全称」，一个是「一笔钱」。.investments 是机构门面——投资公司、财富管理与理财顾问、家族办公室、地产投资平台用 name.investments，11 个字符的全称读起来正式有分量，「姓氏 + .investments」等于把主体全名搬上域名；账本是典型的机构定价：注册约 $8（约 ¥59）、续费约 $104/年（约 ¥745），续费在新顶级域里属高档，对管理真金白银的机构不算负担，反而筛掉了玩票项目。.fund 短而准——单一基金官网、主题募资计划、公益与社区基金用 name.fund，「主题 + .fund」（climate.fund 类）直接说明钱往哪去，比全称更具体也更亲民；注册约 $9（约 ¥63）、续费约 $57/年（约 ¥410），同属偏高档但比 .investments 便宜近一半。判断标准：域名代表「一家投资机构」——多条业务线、长期机构品牌、对客户的正式门面 → .investments 的全称更压得住；域名代表「一只基金/一个募资计划」→ .fund 点题最准、成本也更轻。注意 .investments 后缀很长，前缀务必用姓氏或单个短词；两者都自带监管预期，主体信息与合规声明必须上首屏。机构牌子另有 .capital 可选，基金用 .fund，综合投资门面用 .investments。",
      pickA: ["投资公司与财富管理机构", "理财顾问与家族办公室", "地产与另类投资平台", "「姓氏 + 全称后缀」的正式门面"],
      pickB: ["单一基金官网", "主题募资与捐赠计划", "公益与社区基金", "「主题 + .fund」直接说明资金去向"],
    },
    en: {
      title: ".investments vs .fund: The Firm's Front Door or The Single Pool",
      metaDescription:
        ".investments is the formal full-word front door for investment firms and wealth managers; .fund is short and specific, pointing at a single fund or fundraising drive. Compare semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both talk investing; one is the firm's letterhead, the other is a single pool of money. .investments is the institutional front door — investment firms, wealth managers and advisors, family offices and real-estate investment platforms read formal and weighty on name.investments, and surname + .investments puts the registered name right in the address; the ledger is classic institutional pricing: about $8 to register and $104/yr to renew — high-end among new gTLDs, trivial for firms managing real money, and it quietly filters out hobby projects. .fund is short and precise — a single fund's site, a themed fundraising drive, charity and community funds read on name.fund, and theme + .fund names (think climate.fund) say where the money goes; at about $9 to register and $57/yr to renew it costs nearly half as much to hold. The test: if the domain represents the firm — multiple lines, a long-term institutional brand, a formal client-facing front → .investments carries the weight; if it represents one fund or one drive → .fund is on the nose and lighter to keep. Note the 11-character suffix runs long, so keep the prefix to a surname or one short word; both carry regulatory expectations, so put entity info and compliance up front. For a house brand there's also .capital; single funds fit .fund, and the full-service front door fits .investments.",
      pickA: ["Investment firms & wealth managers", "Advisors & family offices", "Real-estate & alternative platforms", "Surname + full-word formal front door"],
      pickB: ["A single fund's website", "Themed fundraising & donation drives", "Charity & community funds", "Theme + .fund says where money goes"],
    },
  },
  "holdings-vs-group": {
    slug: "holdings-vs-group",
    a: "holdings",
    b: "group",
    zh: {
      title: ".holdings 和 .group 怎么选：控股主体与经营集团的分工",
      metaDescription: ".holdings 指向持有资产的控股主体与家族办公室；.group 指向经营型集团与多品牌矩阵母品牌。对比两者的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都是公司层后缀，差别在主体干什么。.holdings 说的是「持有」——控股公司、家族办公室、投资持有主体、多资产组合的母公司用 name.holdings，英文商业世界里 Holdings 结尾就是这类主体的注册名惯例，「姓氏 + .holdings」读出来即公司全名；账本没有套路：注册与续费同价约 $52/年（约 ¥374），无首年钩子也无续费跳档，价格从第一年就筛掉玩票项目，对持有资产的主体不算负担。.group 说的是「经营」——经营型集团、多品牌矩阵的母品牌、家族企业用 name.group，读出来就是「X 集团」，比冗长的 xxgroup.com 干净得多；它还有第二语义——社群与兴趣小组的落地页同样自然，这是 .holdings 没有的方向；价格也是友好档：首年几十元、续费一百多元，价差比多数新顶级域小，适合长期持有。判断标准：主体的角色是「持有资产/股权」——控股平台、家族办公室、投资载体 → .holdings 的注册名惯例最正；主体的角色是「经营业务」——旗下多个品牌实际运营 → .group 的集团语义更贴。两个都是公司层门面：消费品牌站各用品牌域名，别把母公司域名混作产品站。命名上「姓氏 + .holdings」接家族控股，「品牌 + .group」接经营集团。",
      pickA: ["控股公司与投资持有主体", "家族办公室", "多资产组合的母公司", "「姓氏 + Holdings」注册名惯例"],
      pickB: ["经营型集团与家族企业", "多品牌矩阵的母品牌枢纽", "社群与兴趣小组落地页", "续费价差小、适合长期持有"],
    },
    en: {
      title: ".holdings vs .group: The Asset Holder or The Operating Group",
      metaDescription:
        ".holdings points at asset-holding entities and family offices; .group points at operating conglomerates and multi-brand parents. Compare semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both are company-level suffixes; the split is what the entity does. .holdings says ownership — holding companies, family offices, investment vehicles and the parent of a multi-asset portfolio read on name.holdings, and in the English business world a Holdings ending is the registered-name convention for exactly these entities, so surname + .holdings reads as the company's full name. The ledger has no tricks: registration and renewal both run about $52/yr — no teaser, no jump — pricing that filters out hobby projects from day one and costs nothing to an entity that holds assets. .group says operations — operating conglomerates, the parent brand of a multi-brand portfolio and family businesses read as brand + .group, literally \"the X Group,\" far cleaner than a long xxgroup.com; it also has a second life .holdings lacks — community and interest-group landing pages read just as naturally; pricing is friendly too: a few dollars year one, renewals under $20, with a smaller gap than most new gTLDs. The test: if the entity's role is holding assets or equity — holding platforms, family offices, investment vehicles → .holdings matches the registered-name convention; if the role is running businesses with multiple brands underneath → .group's conglomerate read fits better. Both are corporate front doors: keep consumer brand sites on their own domains. Naming: surname + .holdings for family holding entities; brand + .group for operating groups.",
      pickA: ["Holding companies & investment vehicles", "Family offices", "Parents of multi-asset portfolios", "Surname + Holdings naming convention"],
      pickB: ["Operating groups & family businesses", "Multi-brand parent hub pages", "Community & interest-group landing pages", "Small renewal gap for long-term holding"],
    },
  },
  "mortgage-vs-estate": {
    slug: "mortgage-vs-estate",
    a: "mortgage",
    b: "estate",
    zh: {
      title: ".mortgage 和 .estate 怎么选：房贷生意与房产招牌的分工",
      metaDescription: ".mortgage 把房贷业务写进域名，适合房贷经纪与利率比价；.estate 是房地产行业招牌，适合经纪人与物业资产管理。对比两者的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都围着房子转，一个管「钱」，一个管「房」。.mortgage 是房贷垂直——房贷经纪与信贷员个人品牌、利率比价与再融资平台、房贷计算器等内容工具用 name.mortgage，8 个字符把业务说得明明白白，「地名 + .mortgage」（texas.mortgage 类）就是本地获客广告语；注册约 $8（约 ¥59）、续费约 $50/年（约 ¥360），首年便宜、续费中档，在金融类新顶级域里属于好持有的一档。.estate 是房产行业招牌——经纪人与中介品牌、豪宅与庄园项目、物业与资产管理用 name.estate，行业属性一目了然（real.estate 是注册局自己的旗舰组合），smith.estate 比 smithrealestate.com 短一半且更显高端；它还有「遗产/资产」第二层语义，家族办公室与遗产规划用得顺；注册约 $8（约 ¥59）、续费约 $31/年（约 ¥226），比 .mortgage 更便宜一档。判断标准：业务是「房子的钱」——放贷、经纪、比价、再融资 → .mortgage 点题最准；业务是「房子本身」——买卖、租赁、物业、资管 → .estate 的行业指向更广更高端。注意房贷是强监管业务（如美国 NMLS），资质与披露上首屏；同一团队两头做的，常见打法是 .estate 做主站、.mortgage 做贷款业务线的直达入口。",
      pickA: ["房贷经纪与信贷员个人品牌", "利率比价与再融资平台", "房贷计算器与内容工具", "「地名 + .mortgage」本地获客"],
      pickB: ["房产经纪人与中介品牌", "豪宅与庄园项目", "物业与资产管理", "遗产规划的第二层语义"],
    },
    en: {
      title: ".mortgage vs .estate: The Home-Loan Business or The Property Sign",
      metaDescription:
        ".mortgage writes home lending into the address for brokers and rate comparison; .estate is the real-estate industry sign for agents and property management. Compare semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both orbit the house; one handles the money, the other the property. .mortgage is the home-loan vertical — broker and loan-officer personal brands, rate-comparison and refinance platforms, and calculator-style content tools read unmistakably on name.mortgage, and place + .mortgage names (think texas.mortgage) work as local acquisition copy; at about $8 to register and $50/yr to renew it sits in the easy-to-hold tier of finance gTLDs. .estate is the property industry's sign — agent and brokerage brands, luxury and manor projects, property and asset management read instantly on name.estate (real.estate is the registry's own flagship), and smith.estate runs half the length of smithrealestate.com while reading more upscale; it also carries a second inheritance-and-assets meaning that suits family offices and estate planning. At about $8 to register and $31/yr to renew, it's a tier cheaper than .mortgage. The test: if the business is the money side — lending, brokering, comparison, refinancing → .mortgage is on the nose; if it's the property itself — sales, rentals, management → .estate points broader and more upscale. Note mortgages are heavily regulated (NMLS in the US), so put credentials and disclosures up front; teams doing both often run .estate as the main site with .mortgage as the loan line's direct door.",
      pickA: ["Mortgage brokers & loan-officer brands", "Rate comparison & refinance platforms", "Mortgage calculators & content tools", "Place + .mortgage local acquisition"],
      pickB: ["Real-estate agents & brokerage brands", "Luxury & manor projects", "Property & asset management", "The estate-planning second meaning"],
    },
  },
  "computer-vs-tech": {
    slug: "computer-vs-tech",
    a: "computer",
    b: "tech",
    zh: {
      title: ".computer 和 .tech 怎么选：硬件维修具体词与科技泛称的分工",
      metaDescription: ".computer 具体指向电脑硬件——维修店、装机与二手翻新；.tech 是科技行业泛称，适合创业公司与开发者社区。对比两者的语义、价格与适用场景，并用 AI 猎取两个后缀下都可注册的名字。",
      verdict:
        "都是科技词，一个具体到「这台机器」，一个泛指「这个行业」。.computer 的语义具体而实在——电脑维修与上门服务、装机与硬件定制工作室、二手电脑与翻新交易、电脑培训与技能课程用 name.computer，「地名 + .computer」（brooklyn.computer 类）对本地维修店就是一句获客广告；也有独立开发者拿它做个人站玩复古计算机情怀的用法。注册约 $18（约 ¥130）、续费约 $31/年（约 ¥226），首年中档、续费温和，价格结构健康，长期持有无压力。.tech 是行业泛称——初创公司、开发者社区、黑客马拉松、科技媒体用 name.tech，后缀本身就是行业声明，认知度被 ces.tech 这类真实案例验证；注册便宜但续费明显高于首年促销价，长期持有前先算账。判断标准：业务围绕「电脑这台设备」——修、装、卖、教 → .computer 的具体语义比泛称更准、对本地客户更直白；业务是更广义的「科技」——软件、互联网、创业公司 → .tech 的行业泛称与圈内认知度更配。注意 .computer 语义窄，软件与互联网产品用它反而错位；.tech 则相反，具体到硬件维修时不如 .computer 点题。命名上「地名/服务 + .computer」接本地硬件生意，「品牌 + .tech」接科技公司。",
      pickA: ["电脑维修与上门服务", "装机与硬件定制工作室", "二手电脑与翻新交易", "「地名 + .computer」本地获客"],
      pickB: ["科技创业公司", "开发者社区与黑客马拉松", "科技媒体与博客", "圈内认知度高的行业泛称"],
    },
    en: {
      title: ".computer vs .tech: The Machine Itself or The Industry at Large",
      metaDescription:
        ".computer points concretely at the machine — repair shops, custom builds and refurbishing; .tech is the industry's umbrella suffix for startups and developer communities. Compare semantics, pricing and fit, then hunt names available on both.",
      verdict:
        "Both are tech words; one names the machine, the other the industry. .computer is concrete and literal — repair shops and on-site services, custom-build and hardware studios, used and refurbished dealers, and computer-skills training read plainly on name.computer, and place + .computer names (think brooklyn.computer) work as local acquisition copy for a repair shop; indie developers also wear it for retro-computing personal sites. At about $18 to register and $31/yr to renew, the price structure is healthy — mid first year, gentle renewal, easy to hold long-term. .tech is the industry umbrella — startups, developer communities, hackathons and tech media read on name.tech, where the suffix itself is the industry statement, with recognition proven by real adoption like ces.tech; registration is cheap but renewals run well above the first-year promo, so do the math before holding long-term. The test: if the business orbits the machine — fixing, building, selling, teaching → .computer's concrete read beats the umbrella and speaks plainer to local customers; if it's tech at large — software, internet, startups → .tech's category recognition fits better. Note .computer is narrow, so software and internet products read misplaced on it; conversely .tech is less on the nose than .computer for a hardware-repair shop. Naming: place/service + .computer for local hardware businesses; brand + .tech for technology companies.",
      pickA: ["Computer repair & on-site services", "Custom-build & hardware studios", "Used & refurbished dealers", "Place + .computer local acquisition"],
      pickB: ["Tech startups", "Developer communities & hackathons", "Tech media and blogs", "The high-recognition industry umbrella"],
    },
  },
};

/** 全部对比页 slug（sitemap / 互链使用） */
export const COMPARE_LIST = Object.keys(TLD_COMPARES);

/** 与某 TLD 相关的对比页 slug 列表 */
export const comparesForTld = (tld: string): string[] =>
  COMPARE_LIST.filter((slug) => TLD_COMPARES[slug].a === tld || TLD_COMPARES[slug].b === tld);
