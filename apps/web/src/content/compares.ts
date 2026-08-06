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
};

/** 全部对比页 slug（sitemap / 互链使用） */
export const COMPARE_LIST = Object.keys(TLD_COMPARES);

/** 与某 TLD 相关的对比页 slug 列表 */
export const comparesForTld = (tld: string): string[] =>
  COMPARE_LIST.filter((slug) => TLD_COMPARES[slug].a === tld || TLD_COMPARES[slug].b === tld);
