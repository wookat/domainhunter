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
};

/** 全部对比页 slug（sitemap / 互链使用） */
export const COMPARE_LIST = Object.keys(TLD_COMPARES);

/** 与某 TLD 相关的对比页 slug 列表 */
export const comparesForTld = (tld: string): string[] =>
  COMPARE_LIST.filter((slug) => TLD_COMPARES[slug].a === tld || TLD_COMPARES[slug].b === tld);
