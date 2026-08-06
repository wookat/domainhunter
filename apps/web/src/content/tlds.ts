/**
 * TLD 指南页内容（/tld/:tld）。纯数据常量：前端页面与 worker（SSR meta / sitemap）共用。
 */

/** 美元→人民币换算参考汇率（估算值，仅供参考展示） */
export const USD_TO_CNY = 7.2;

export interface TldGuideLocale {
  /** 页面标题（不含站点名） */
  title: string;
  /** SEO meta description */
  metaDescription: string;
  /** 正文段落：该 TLD 适合什么 */
  intro: string;
  /** 适用场景标签 */
  bestFor: string[];
  /** 命名建议 */
  namingTips: string[];
}

export interface TldGuide {
  tld: string;
  zh: TldGuideLocale;
  en: TldGuideLocale;
}

export const TLD_GUIDES: Record<string, TldGuide> = {
  com: {
    tld: "com",
    zh: {
      title: ".com 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".com 是认知度最高的通用顶级域名，适合几乎所有正式产品与企业官网。查看 .com 实时注册/续费价格、命名建议，并用 AI 立刻猎取可注册的 .com 好域名。",
      intro:
        ".com 是互联网上历史最久、认知度最高的顶级域名，用户在地址栏里下意识补全的就是它。做面向大众的产品、企业官网、电商或任何需要长期经营的品牌，.com 依然是第一选择：它自带信任感，转售市场也最活跃，好的 .com 域名本身就是资产。代价是优质短词几乎被注册殆尽——常见英文单词、两三个字母的组合基本无货，捡漏要靠造词、合成词或拼音组合。如果你的首选名字 .com 已被注册，与其加连字符或数字，不如换一个更独特的造词——这正是 AI 批量构思加实时核验能帮上忙的地方。",
      bestFor: ["企业官网与品牌主站", "面向大众的消费产品", "电商与跨境业务", "需要长期持有的品牌资产"],
      namingTips: [
        "优先 6–10 字符的独特造词（如合成词、辅音+元音交替），常见单词基本已无货",
        "避免连字符与数字：影响口头传播，也显得不专业",
        "拼音品牌面向国内用户可行，但要选好读的双拼（如 zhituo、mofa）",
        "如果预算允许，注册时把对应 .net/.org 一起保护性注册",
      ],
    },
    en: {
      title: ".com Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".com is the most recognized TLD on the internet — the default for serious products and businesses. See live registration/renewal pricing, naming advice, and hunt available .com names with AI.",
      intro:
        ".com is the oldest and most recognized top-level domain — the one users type by reflex. For consumer products, company websites, e-commerce, or any brand you plan to build for years, .com remains the default choice: it carries instant credibility and has by far the most liquid resale market, so a good .com is an asset in itself. The catch is scarcity — dictionary words and short letter combos are long gone. Winning today means invented words, compound names, or creative blends. If your first-choice name is taken on .com, resist hyphens and digits; generate a more distinctive coined name instead — exactly what AI brainstorming plus live availability checking is built for.",
      bestFor: ["Company & brand websites", "Consumer-facing products", "E-commerce and global business", "Long-term brand assets"],
      namingTips: [
        "Aim for distinctive coined names of 6–10 characters; dictionary words are gone",
        "Avoid hyphens and digits — they hurt word-of-mouth and look less professional",
        "Blends and compounds (brand + verb, two short roots) still have inventory",
        "If budget allows, defensively register the matching .net/.org",
      ],
    },
  },
  net: {
    tld: "net",
    zh: {
      title: ".net 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".net 源自网络基础设施，适合网络服务、开发工具与技术平台。查看 .net 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .net 域名。",
      intro:
        ".net 诞生之初是给网络服务商用的，如今是仅次于 .com 的老牌通用域名。它的气质偏技术与基础设施：网络工具、云服务、开发者平台、API 服务用 .net 都很自然，用户也不会觉得陌生。很多团队把 .net 当作 .com 被注册后的第一备选——这个策略在品牌词非常独特时可行，但如果品牌词是常见词，.com 在别人手里容易导致流量流失与品牌混淆，需要权衡。价格与 .com 接近，可注册库存明显更充裕，同样的名字在 .net 下命中率高不少。适合务实的技术产品：名字好读、和网络/连接相关，.net 反而比生僻的 .com 造词更值得选。",
      bestFor: ["网络服务与基础设施", "开发者工具与 API 平台", "云服务与托管产品", ".com 被占用时的务实备选"],
      namingTips: [
        "与「网络/连接/通信」语义相关的词根用 .net 加分（如 link、mesh、relay）",
        "品牌词很常见时慎用：.com 在别人手里会分流",
        "技术产品可直接把功能词入名（如 statuspage 类命名）",
        "同样优先短、无连字符、无数字",
      ],
    },
    en: {
      title: ".net Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".net has infrastructure roots and suits network services, developer tools and technical platforms. See live pricing and naming advice, then hunt available .net names with AI.",
      intro:
        ".net was originally meant for network providers and is the most established alternative to .com. Its personality is technical: networking tools, cloud services, developer platforms, and API products feel right at home on .net, and users recognize it without hesitation. Many teams treat .net as the first fallback when the .com is taken — reasonable if your brand word is distinctive, riskier if it's a common word someone else operates on .com, since you'll leak traffic and invite confusion. Pricing is close to .com while inventory is noticeably better, so the same shortlist scores far more available hits. For pragmatic technical products with network-related semantics, a clean .net often beats an awkward coined .com.",
      bestFor: ["Network services & infrastructure", "Developer tools & API platforms", "Cloud and hosting products", "Pragmatic fallback when .com is taken"],
      namingTips: [
        "Roots evoking networks and connectivity (link, mesh, relay) fit .net well",
        "Be careful using .net when the brand word is common and .com is active",
        "Function-forward names work for technical products",
        "Keep it short, no hyphens, no digits",
      ],
    },
  },
  org: {
    tld: "org",
    zh: {
      title: ".org 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".org 是非营利组织与开源项目的标志性域名，自带公益与公信力气质。查看 .org 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .org 域名。",
      intro:
        ".org 最初面向非营利组织，几十年下来沉淀出独特的公信力：公益机构、行业协会、标准组织、开源项目用 .org，用户会默认它「不是来卖东西的」。Wikipedia、Mozilla 这些标杆让 .org 在开源与知识类项目里几乎成了正统选择。如果你做的是开源工具、社区、文档站或公益项目，.org 比 .com 更贴气质；反过来，商业产品用 .org 会显得错位，甚至让用户怀疑其盈利模式。库存比 .com 充裕得多，常见词与项目名的命中率高。命名上适合直接使用项目名或使命词，清晰比巧妙更重要——.org 的用户在找的是「这个组织是谁」，不是俏皮的品牌。",
      bestFor: ["开源项目与社区", "非营利与公益组织", "行业协会与标准组织", "文档站与知识库"],
      namingTips: [
        "直接用项目名/组织名，清晰第一，不必刻意造词",
        "使命词 + 领域词的组合很自然（如 openfoo、fooalliance）",
        "商业产品不建议主用 .org，气质错位",
        "开源项目建议 .org 与 .com 一起注册，防止商业冒用",
      ],
    },
    en: {
      title: ".org Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".org signals non-profit credibility and is the natural home of open-source projects and communities. See live pricing and naming advice, then hunt available .org names with AI.",
      intro:
        ".org was created for non-profits and has accumulated a unique kind of trust over decades: charities, industry associations, standards bodies and open-source projects live here, and visitors instinctively assume an .org \"isn't trying to sell them something.\" Landmarks like Wikipedia and Mozilla made .org the legitimate choice for open-source and knowledge projects. If you're building an open-source tool, a community, a documentation site or a public-interest project, .org fits better than .com; a commercial product on .org, by contrast, feels off and can even make users question the business model. Inventory is far better than .com. For naming, clarity beats cleverness — use the project or mission name directly; .org visitors want to know who you are, not how witty your brand is.",
      bestFor: ["Open-source projects & communities", "Non-profits and charities", "Associations & standards bodies", "Documentation and knowledge bases"],
      namingTips: [
        "Use the project/organization name directly — clarity first",
        "Mission word + domain word compounds feel natural (openfoo, fooalliance)",
        "Avoid .org as the primary domain for commercial products",
        "Open-source projects should also grab the .com defensively",
      ],
    },
  },
  io: {
    tld: "io",
    zh: {
      title: ".io 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".io 是开发者与科技创业公司的心头好，短、极客、辨识度高。查看 .io 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .io 域名。",
      intro:
        ".io 本是英属印度洋领地的国别域名，却因为 I/O（输入/输出）的极客联想被开发者圈层彻底占领：开发工具、SaaS、API 服务、技术社区大量使用 .io，GitHub Pages（github.io）更把它推成了技术产品的身份标签。它只有两个字符，域名整体显得短而利落，很多在 .com 下无货的好词在 .io 下仍可注册。代价是价格明显偏高（注册与续费都是 .com 的数倍），且受众有圈层性——面向非技术大众的产品用 .io，用户未必买账。适合明确面向开发者或科技从业者的产品：工具名、动词、短造词配 .io 都很出彩，还能玩 domain hack（如 socket.io）。",
      bestFor: ["开发者工具与 SaaS", "API 与数据服务", "技术社区与博客", "科技创业公司"],
      namingTips: [
        "短动词/工具词 + .io 是经典组合（deploy、trace、fetch 类词根）",
        "可以玩 domain hack：品牌词以 io 结尾时直接断词（如 socket.io）",
        "面向非技术大众的产品慎用，认知度不如 .com",
        "注意续费价比注册价更高，长期成本要算进预算",
      ],
    },
    en: {
      title: ".io Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".io is the developer favorite — short, geeky, instantly recognizable in tech circles. See live pricing and naming advice, then hunt available .io names with AI.",
      intro:
        ".io is technically the country domain of the British Indian Ocean Territory, but the I/O (input/output) association let developers claim it completely: dev tools, SaaS products, API services and tech communities live on .io, and GitHub Pages (github.io) cemented it as a badge of technical identity. At just two characters it keeps domains short and sharp, and many words long gone on .com are still available here. The trade-offs: pricing runs several times higher than .com (renewals especially), and the audience is tribal — a mainstream consumer product on .io may not land. It shines for products squarely aimed at developers: tool names, verbs and short coined words all pair beautifully, and domain hacks (socket.io) are a bonus.",
      bestFor: ["Developer tools & SaaS", "API and data services", "Tech communities and blogs", "Tech startups"],
      namingTips: [
        "Short verbs/tool words + .io is the classic combo (deploy, trace, fetch)",
        "Try domain hacks when the brand ends in \"io\" (socket.io)",
        "Think twice for non-technical consumer products",
        "Renewals cost more than registration — budget for it",
      ],
    },
  },
  ai: {
    tld: "ai",
    zh: {
      title: ".ai 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".ai 是 AI 产品的身份标签，贵但直接表达定位。查看 .ai 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .ai 域名。",
      intro:
        ".ai 原是安圭拉的国别域名，如今是 AI 浪潮里最抢手的后缀：产品挂上 .ai，无需解释就完成了定位表达，投资人、用户、媒体一眼读懂。OpenAI 之后几乎所有 AI 创业公司都优先考虑它，也因此价格被推到所有主流后缀里最高的一档——注册和续费都要数百元人民币每年，且好词消耗速度极快。适合核心卖点就是 AI 的产品：模型服务、AI 应用、智能体平台。如果 AI 只是产品的一个特性而非核心身份，用 .ai 反而绑架了品牌叙事，不如 .com。命名上 .ai 有独特玩法：品牌词以 ai 结尾可以做 domain hack（如 mistral.ai 之外的 brandai 断词），两三个音节的造词配 .ai 也普遍好记。",
      bestFor: ["AI 应用与模型服务", "智能体与自动化平台", "AI 基础设施与工具链", "以 AI 为核心叙事的创业公司"],
      namingTips: [
        "产品核心是 AI 才用 .ai，否则会绑架品牌叙事",
        "品牌词以 ai 结尾可做 domain hack（如 bonsai → bons.ai）",
        "两三个音节的造词 + .ai 好读好记",
        "预算敏感者注意：续费常年数百元，长期成本高",
      ],
    },
    en: {
      title: ".ai Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".ai is the identity badge of AI products — expensive but instantly communicates positioning. See live pricing and naming advice, then hunt available .ai names with AI.",
      intro:
        ".ai is Anguilla's country domain turned gold rush: put your product on .ai and the positioning explains itself — investors, users and press get it instantly. Since OpenAI, nearly every AI startup checks .ai first, which pushed prices to the top tier of mainstream TLDs (registration and renewal both run high, and good words vanish fast). It's the right call when AI is your product's core identity: model services, AI apps, agent platforms. If AI is merely a feature rather than the story, .ai can hijack your brand narrative — .com serves you better. Naming-wise .ai has unique tricks: brands ending in \"ai\" make elegant domain hacks (bons.ai), and two-to-three-syllable coined words pair memorably with the suffix.",
      bestFor: ["AI applications & model services", "Agent and automation platforms", "AI infrastructure and tooling", "Startups whose core story is AI"],
      namingTips: [
        "Use .ai only when AI is the core identity, not just a feature",
        "Brands ending in \"ai\" make elegant domain hacks (bons.ai)",
        "Two-to-three-syllable coined words read well with .ai",
        "Watch the renewal cost — it stays high every year",
      ],
    },
  },
  co: {
    tld: "co",
    zh: {
      title: ".co 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".co 短小精悍，是创业公司在 .com 之外的时髦替身。查看 .co 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .co 域名。",
      intro:
        ".co 是哥伦比亚的国别域名，被全球市场重新定义为 company/corporation 的缩写，成为创业公司最体面的 .com 替身：只差一个字母，读起来自然，Twitter 曾用 t.co 做短链更让它出圈。它适合品牌感优先的初创产品——名字本身够独特时，.co 不会拖累气质，甚至比生僻的 .com 造词更利落。风险也来自那一个字母：用户手滑输入 .com 的流量会流向别人，所以品牌词对应的 .com 若在竞品或停放页手里要谨慎。注册价格适中，但续费明显高于 .com，长期成本要算清。命名上适合短造词与双音节品牌词，也可玩 domain hack（品牌以 co 结尾时断词，如 brand.co）。",
      bestFor: ["创业公司与新品牌", "个人品牌与工作室", ".com 被占时的品牌向替身", "短链接与营销落地页"],
      namingTips: [
        "名字要足够独特，避免与活跃 .com 网站只差后缀",
        "品牌词以 co 结尾可断词做 domain hack（如 ves.co）",
        "双音节短品牌词 + .co 读感最好",
        "续费高于 .com，多年持有要算总成本",
      ],
    },
    en: {
      title: ".co Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".co is the stylish one-letter-off alternative to .com favored by startups. See live pricing and naming advice, then hunt available .co names with AI.",
      intro:
        ".co is Colombia's country code, rebranded globally as shorthand for company/corporation — the most respectable stand-in for .com. One letter shorter, it reads naturally, and Twitter's t.co short links made it mainstream. It suits brand-first startups: when the name itself is distinctive, .co keeps things sleek and often beats a contorted coined .com. The risk lives in that same missing letter — type-in traffic leaks to whoever holds the .com, so check who owns it before committing; an active competitor there is a red flag. Registration is affordable but renewals run notably higher than .com, so price the long haul. For naming, short coined words and two-syllable brand names shine, and brands ending in \"co\" unlock clean domain hacks (ves.co).",
      bestFor: ["Startups and new brands", "Personal brands & studios", "Brand-first alternative when .com is taken", "Short links and landing pages"],
      namingTips: [
        "Pick a distinctive name; avoid being one suffix away from an active .com",
        "Brands ending in \"co\" make clean domain hacks (ves.co)",
        "Two-syllable brand words read best with .co",
        "Renewals cost more than .com — budget multi-year",
      ],
    },
  },
  app: {
    tld: "app",
    zh: {
      title: ".app 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".app 由 Google 运营、强制 HTTPS，是移动与 Web 应用的天然后缀。查看 .app 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .app 域名。",
      intro:
        ".app 由 Google 运营，是为数不多带硬性安全要求的后缀：全后缀强制 HTTPS（HSTS 预加载），浏览器直接拒绝不安全连接，这让它天生适合正经的应用产品。语义上它零解释成本——用户看到 name.app 就知道这是个应用，App 下载落地页、Web App、小工具的官网用它都顺理成章。相比 .com 库存充裕，很多干净的产品词仍可注册；价格适中，续费略高于 .com。它的边界也清晰：不是应用形态的业务（内容站、电商、企业官网）用 .app 会显得错位。命名建议直接用产品词或「动词+名词」组合，天然读成「XX 应用」；注意别再在名字里重复 app 字样，name.app 已经说明了一切。",
      bestFor: ["移动 App 官网与下载页", "Web App 与 PWA", "开发者小工具", "应用类产品的品牌主站"],
      namingTips: [
        "产品词直接上，name.app 天然读成「XX 应用」",
        "名字里不要再带 app 字样，避免 todoapp.app 式重复",
        "全后缀强制 HTTPS，上线前配好证书（托管平台一般自动搞定）",
        "动词或「动词+名词」词根很出彩（如 track、plan、noted）",
      ],
    },
    en: {
      title: ".app Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".app is Google-operated with enforced HTTPS — the natural suffix for mobile and web apps. See live pricing and naming advice, then hunt available .app names with AI.",
      intro:
        ".app is operated by Google and is one of the few TLDs with a hard security guarantee: the entire zone is HSTS-preloaded, so browsers refuse insecure connections outright — a natural fit for serious application products. Semantically it costs zero explanation: users see name.app and know it's an app. Download landing pages, web apps and PWAs, and utility tools all feel right here. Inventory is far better than .com, with plenty of clean product words still available at moderate prices (renewals slightly above .com). Its boundary is equally clear: businesses that aren't apps — content sites, e-commerce, corporate sites — look misplaced on .app. Name with the product word directly or a verb+noun compound, and never repeat \"app\" in the name itself; name.app already says it.",
      bestFor: ["Mobile app sites & download pages", "Web apps and PWAs", "Developer utilities", "Brand home for app products"],
      namingTips: [
        "Use the product word directly — name.app reads as \"the NAME app\"",
        "Don't repeat \"app\" in the name (avoid todoapp.app)",
        "HTTPS is mandatory zone-wide; hosting platforms handle certs automatically",
        "Verbs and verb+noun roots shine (track, plan, noted)",
      ],
    },
  },
  dev: {
    tld: "dev",
    zh: {
      title: ".dev 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".dev 由 Google 运营、强制 HTTPS，是开发者产品与技术品牌的标配后缀。查看 .dev 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .dev 域名。",
      intro:
        ".dev 与 .app 同为 Google 运营的安全后缀（全后缀强制 HTTPS），但受众更聚焦：它就是写给开发者看的。开发工具、技术文档、个人技术博客、开源项目主页用 .dev，圈内人一眼认同——web.dev、kubernetes.dev 这些官方站点早已完成用户教育。对个人开发者它尤其友好：yourname.dev 是干净又专业的个人品牌标配。库存充裕、价格适中，很多在 .com/.io 下无货的词这里还在。边界同样明显：面向大众消费者的产品别用 .dev，它的语义指向太强。命名上直接用工具名、技术词或人名即可，配 .dev 自然读成「XX 的开发者站」；短动词与技术词根（build、ship、test）尤其出彩。",
      bestFor: ["开发者工具与 SDK", "技术文档与开源项目主页", "个人技术品牌（yourname.dev）", "技术团队博客"],
      namingTips: [
        "个人品牌直接 yourname.dev，干净专业",
        "工具站用「工具词.dev」天然成立（build、ship、test 类词根）",
        "面向非开发者的产品不要用，语义指向太强",
        "同为强制 HTTPS 后缀，托管时确认证书自动签发",
      ],
    },
    en: {
      title: ".dev Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".dev is Google-operated, HTTPS-enforced, and the default suffix for developer products and personal tech brands. See live pricing and naming advice, then hunt available .dev names with AI.",
      intro:
        ".dev shares .app's Google-operated, HTTPS-enforced foundation but speaks to a sharper audience: it is written for developers. Dev tools, technical docs, personal engineering blogs and open-source homepages all read instantly credible on .dev — official sites like web.dev and kubernetes.dev finished the user education years ago. It's especially kind to individuals: yourname.dev is the clean, professional personal-brand standard. Inventory is healthy and prices moderate; many words extinct on .com and .io still live here. The boundary is just as sharp: consumer products don't belong on .dev — the semantic pull is too strong. Name with the tool word, a technical root, or your own name; short verbs like build, ship and test pair especially well.",
      bestFor: ["Developer tools & SDKs", "Technical docs & open-source homes", "Personal tech brands (yourname.dev)", "Engineering team blogs"],
      namingTips: [
        "For personal brands, yourname.dev is the clean default",
        "Tool-word.dev works out of the box (build, ship, test roots)",
        "Skip it for non-developer products — the semantics are too strong",
        "HTTPS is mandatory; confirm auto-issued certs on your host",
      ],
    },
  },
  xyz: {
    tld: "xyz",
    zh: {
      title: ".xyz 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".xyz 首年极便宜、气质年轻反叛，是 Web3 与实验项目的宠儿。查看 .xyz 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .xyz 域名。",
      intro:
        ".xyz 的定位是「为下一代互联网用户而生」——x、y、z 三代人的 xyz。Google 母公司 Alphabet 用 abc.xyz 做官网给了它最高背书，而 Web3、加密与创意实验圈把它变成了亚文化标志：不想要 .com 的正襟危坐，就用 .xyz 的年轻反叛。它的另一大卖点是价格：首年注册常常只要几块钱，是验证想法、做副业项目、批量注册创意域名的最低成本选择。但要注意两点——续费价会回到正常水平（约为首年的十倍），且因为便宜，.xyz 被垃圾站大量使用，部分邮件服务与企业防火墙对它更敏感，正式商业产品要权衡。适合个性表达优先的项目：造词、梗词、实验代号配 .xyz 都很自由。",
      bestFor: ["Web3 与加密项目", "实验项目与副业 MVP", "创意个人站", "低成本批量注册验证想法"],
      namingTips: [
        "首年便宜但续费恢复原价，长期项目算清总成本",
        "垃圾站聚集导致部分场景信任度低，正式产品慎作主域",
        "造词、梗词、实验代号都合适，气质自由",
        "Web3 项目配 .xyz 已是圈内共识，可放心用",
      ],
    },
    en: {
      title: ".xyz Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".xyz is dirt-cheap in year one with a young, rebellious vibe — beloved by Web3 and experimental projects. See live pricing and naming advice, then hunt available .xyz names with AI.",
      intro:
        ".xyz brands itself as the domain \"for every website, everywhere\" — generations X, Y and Z. Alphabet's abc.xyz gave it the ultimate endorsement, while Web3, crypto and creative circles adopted it as a subculture badge: if .com feels buttoned-up, .xyz feels free. Its other superpower is price — first-year registration often costs pocket change, making it the cheapest way to validate ideas, launch side projects, or bulk-register creative names. Two caveats: renewal snaps back to normal pricing (roughly 10x the intro rate), and because it's cheap, spam sites flock to it, so some mail filters and corporate firewalls treat it warily — weigh that for serious commercial products. For personality-first projects, coined words, memes and experiment codenames all fly on .xyz.",
      bestFor: ["Web3 and crypto projects", "Experiments and side-project MVPs", "Creative personal sites", "Cheap bulk registration to test ideas"],
      namingTips: [
        "Cheap year one, normal renewals — price multi-year holds",
        "Spam association hurts trust in some contexts; think twice as a primary business domain",
        "Coined words, memes and codenames all fit the vibe",
        "For Web3 projects, .xyz is an accepted community convention",
      ],
    },
  },
  cc: {
    tld: "cc",
    zh: {
      title: ".cc 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".cc 短平快、无语义包袱，社区与创意项目常用。查看 .cc 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .cc 域名。",
      intro:
        ".cc 是科科斯群岛的国别域名，因为形似 Creative Commons 的缩写、又只有两个字符，被全球市场当作通用后缀使用多年。它在中文互联网里认知度不错——不少社区、导航站、个人项目用 .cc，读起来干脆（「西西」），且没有 .io 的技术圈层感、也没有 .xyz 的亚文化标签，是一张相对中性的白纸。价格亲民，库存充裕，很多双拼、短词在 .cc 下仍可注册，这是它对国内创业者最实际的价值。要注意它的「无语义」是双刃剑：不像 .app/.dev 自带定位，.cc 需要品牌自己完成表达。适合社区产品、创意工作室、个人站与短品牌名；命名上短是王道，四字符以内的主体配 .cc 读感最佳。",
      bestFor: ["社区与论坛产品", "创意工作室与作品集", "个人网站与短品牌", "双拼/短词在 .com 无货时的备选"],
      namingTips: [
        "主体越短越好，≤6 字符配 .cc 读感最佳",
        "双拼词根在 .cc 下命中率高，适合国内品牌",
        "无语义包袱：品牌表达要靠名字本身完成",
        "与 Creative Commons 无官方关系，别误导用户",
      ],
    },
    en: {
      title: ".cc Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".cc is short, neutral and baggage-free — popular with communities and creative projects. See live pricing and naming advice, then hunt available .cc names with AI.",
      intro:
        ".cc belongs to the Cocos Islands but has been used as a de facto generic TLD for years — two characters, easy to say, and loosely associated with \"creative commons\" in people's minds (no official link). Its real appeal is neutrality: it carries neither .io's tech-tribe signal nor .xyz's subculture edge, giving brands a blank canvas. Prices are friendly and inventory deep — short words and two-syllable roots long gone on .com are often still open here, which is its most practical value. That semantic blankness cuts both ways: unlike .app or .dev, .cc won't explain your product, so the name itself must carry the brand. Best for communities, creative studios, portfolios and short brand names; keep the label short — six characters or fewer reads best with .cc.",
      bestFor: ["Communities and forums", "Creative studios & portfolios", "Personal sites and short brands", "Fallback when short words are gone on .com"],
      namingTips: [
        "Shorter is better — ≤6 characters reads best with .cc",
        "Great hit rate for short roots extinct on .com",
        "No built-in semantics: the name must carry the brand alone",
        "No official Creative Commons link — don't imply one",
      ],
    },
  },
  tv: {
    tld: "tv",
    zh: {
      title: ".tv 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".tv 天然指向视频与直播，是流媒体内容品牌的首选后缀。查看 .tv 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .tv 域名。",
      intro:
        ".tv 是图瓦卢的国别域名，却因为与「电视」的天然联想成了视频内容的专属后缀——Twitch.tv 一个案例就足以说明它的行业地位。做直播平台、视频栏目、流媒体品牌、影视工作室，name.tv 零解释成本，用户看到就知道「这里有内容可看」。有趣的是，域名收入长期占图瓦卢财政的重要部分，你注册 .tv 还算给太平洋岛国做了贡献。价格高于 .com 但低于 .ai，属于「为精准语义付溢价」的典型。它的边界在于：与视频/直播无关的业务用 .tv 会让用户预期错位。命名上节目感与人格感都好使：栏目名、主播名、频道名直接上，短动词与拟声词也出彩。",
      bestFor: ["直播平台与主播个人站", "视频栏目与频道品牌", "流媒体与影视工作室", "赛事与活动直播"],
      namingTips: [
        "栏目名/频道名/主播名直接上，name.tv 自解释",
        "与视频无关的业务勿用，用户预期会错位",
        "短动词、拟声词做词根有节目感（如 wave、boom）",
        "价格高于 .com：为精准语义付的溢价，值不值看业务",
      ],
    },
    en: {
      title: ".tv Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".tv points straight at video and streaming — the suffix of choice for content brands. See live pricing and naming advice, then hunt available .tv names with AI.",
      intro:
        ".tv is Tuvalu's country domain, but the television association made it the de facto home of video content — Twitch.tv alone settles the argument. For live-streaming platforms, video shows, streaming brands and production studios, name.tv explains itself: viewers see it and expect something to watch. A charming footnote: domain revenue has long been a meaningful share of Tuvalu's national income, so registering a .tv modestly funds a Pacific island nation. Pricing sits above .com but below .ai — a classic \"pay for precise semantics\" trade. The boundary is obvious: businesses unrelated to video set the wrong expectation on .tv. For naming, show-business energy works — channel names, host names and program titles go on directly, and short verbs or onomatopoeia (wave, boom) add flair.",
      bestFor: ["Streaming platforms & creator sites", "Video shows and channel brands", "Media and production studios", "Event and esports broadcasts"],
      namingTips: [
        "Channel/show/host names work as-is — name.tv self-explains",
        "Skip it if your business isn't video; expectations will misfire",
        "Short verbs and onomatopoeia read like show titles (wave, boom)",
        "Costs more than .com — pay the semantic premium only if it fits",
      ],
    },
  },
  cn: {
    tld: "cn",
    zh: {
      title: ".cn 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".cn 是中国国家域名，价格亲民、面向国内业务合规友好。查看 .cn 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .cn 域名。",
      intro:
        ".cn 是中国的国家顶级域名，也是国内业务最名正言顺的选择：面向中国用户的产品、需要 ICP 备案上线的网站、政企合作项目，用 .cn 天然合规顺畅——备案流程对 .cn 完全友好，而部分新顶级域名在备案时会遇到限制。价格是主流后缀里最亲民的一档，首年常有活动价，续费也便宜。库存充裕：大量双拼、三拼与行业词在 .com 下早已无货，在 .cn 下仍可注册，这对国内品牌是实打实的机会。注意两点：注册 .cn 需要实名认证（个人或企业均可）；面向海外用户的业务不建议主用 .cn，海外认知度与信任度有限。命名上双拼是王道——好读好记的双拼配 .cn，是国内用户最熟悉的品牌形态。",
      bestFor: ["面向中国用户的产品", "需要 ICP 备案的网站", "国内企业官网", "双拼品牌名（.com 无货时机会大）"],
      namingTips: [
        "双拼是王道：好读的双拼 + .cn 是国内最熟悉的品牌形态",
        "注册需实名认证，企业主体备案更顺畅",
        "面向海外的业务不建议主用 .cn",
        "价格便宜，可把 .com.cn/.cn 一起保护性注册",
      ],
    },
    en: {
      title: ".cn Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".cn is China's country domain — affordable and compliance-friendly for businesses serving Chinese users. See live pricing and naming advice, then hunt available .cn names with AI.",
      intro:
        ".cn is China's country-code TLD and the most legitimate choice for China-facing business: products serving Chinese users, websites that need ICP filing to go live, and government or enterprise projects all run smoothest on .cn — the filing process fully supports it, while some newer TLDs hit restrictions. It's also among the cheapest mainstream options, with low intro and renewal prices. Inventory is a genuine opportunity: countless pinyin and industry words extinct on .com remain open on .cn. Two things to know: registration requires real-name verification (individual or company), and if your audience is primarily overseas, .cn shouldn't be your primary domain — recognition and trust abroad are limited. For naming, double-pinyin rules: a readable two-syllable pinyin word on .cn is the brand shape Chinese users know best.",
      bestFor: ["Products for Chinese users", "Websites needing ICP filing", "Domestic company sites", "Pinyin brand names (great availability)"],
      namingTips: [
        "Double-pinyin roots are the sweet spot for Chinese audiences",
        "Real-name verification is required to register",
        "Not ideal as the primary domain for overseas-first products",
        "It's cheap — grab .com.cn/.cn together defensively",
      ],
    },
  },
  me: {
    tld: "me",
    zh: {
      title: ".me 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".me 天然适合个人品牌、简历主页与开发者作品集，还能拼出动词短语域名。查看 .me 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .me 域名。",
      intro:
        ".me 是黑山的国家域名，但「me＝我」的英文含义让它成为个人品牌的天然后缀：个人主页、简历站、开发者作品集、独立创作者的落地页，name.me 一眼就懂。它还有一个独门玩法——动词短语域名：about.me、call.me、hire.me 这类「动词 + .me」读起来就是一句话，产品把行动指令直接写进域名里，传播效率极高。价格与 .com 接近，库存明显更充裕：常见英文名、昵称、双拼在 .me 下命中率远高于 .com。注意它的气质偏个人与轻量，大型企业官网用 .me 会显得不够正式；但对个人 IP、独立开发者和以「你/我」为叙事核心的产品（社交、效率、健康类），.me 常常比生僻的 .com 造词更出彩。",
      bestFor: ["个人主页与简历站", "开发者作品集", "独立创作者落地页", "动词短语类产品域名（hire.me 式）"],
      namingTips: [
        "动词 + .me 是独门玩法：域名本身就是一句行动指令（hire.me、coach.me）",
        "个人品牌直接用名字/昵称，.me 下库存比 .com 好得多",
        "社交、效率、健康类产品用第二人称叙事很搭",
        "大型企业主站不建议主用，气质偏个人",
      ],
    },
    en: {
      title: ".me Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".me is the natural home for personal brands, portfolios and verb-phrase domains like hire.me. See live pricing and naming advice, then hunt available .me names with AI.",
      intro:
        ".me is Montenegro's country code, but the English word made it the default suffix for personal brands: personal sites, resumes, developer portfolios and creator landing pages read instantly as \"this is about a person.\" Its signature trick is the verb-phrase domain — about.me, call.me, hire.me — where the domain itself is a call to action, which makes word-of-mouth almost free. Pricing sits near .com while inventory is far better: first names, nicknames and short words long gone on .com are often still open. The vibe is personal and lightweight, so a large corporate site on .me feels off; but for personal IP, indie developers, and products narrated in the second person (social, productivity, wellness), a clean .me regularly beats an awkward coined .com.",
      bestFor: ["Personal sites & resumes", "Developer portfolios", "Creator landing pages", "Verb-phrase product domains (hire.me style)"],
      namingTips: [
        "Verb + .me turns the domain into a call to action (hire.me, coach.me)",
        "Use your actual name or handle — availability is far better than .com",
        "Great fit for second-person products: social, productivity, wellness",
        "Skip it for large corporate sites; the tone is personal",
      ],
    },
  },
  tech: {
    tld: "tech",
    zh: {
      title: ".tech 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".tech 把「科技」直接写进后缀，适合硬科技公司、开发者社区与科技媒体。查看 .tech 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .tech 域名。",
      intro:
        ".tech 是含义最直白的新顶级域名之一：后缀本身就是行业声明。硬科技公司、机器人与硬件团队、开发者社区、黑客马拉松、科技媒体用 name.tech，访客不需要任何解释就知道这是科技相关。它在科技圈的接受度已被真实案例验证——CES 官网用的就是 ces.tech。库存极好：几乎任何在 .com 下绝迹的科技词、公司名在 .tech 下都能注册到，双词组合更是随便挑。注意续费价通常明显高于首年促销价，注册前看清楚续费价再决定长期持有。命名上后缀已经交代了行业，主体名反而可以放开——用一个和科技无关、有记忆点的品牌词（水果、动物、神话），比再叠一个技术词更出挑。",
      bestFor: ["硬科技与硬件公司", "开发者社区与黑客马拉松", "科技媒体与博客", "机器人、IoT 与深科技团队"],
      namingTips: [
        "后缀已声明行业，主体名可以大胆用无关但有记忆点的词",
        "首年促销价与续费价差距大，注册前确认续费价",
        "公司名 + .tech 几乎总能注册到，适合品牌保护",
        "避免主体名再含 tech/tek，语义重复（techxx.tech）",
      ],
    },
    en: {
      title: ".tech Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".tech puts the industry right in the suffix — built for hard-tech companies, developer communities and tech media. See live pricing and naming advice, then hunt available .tech names with AI.",
      intro:
        ".tech is one of the most self-explanatory new TLDs: the suffix is the industry statement. Hard-tech companies, robotics and hardware teams, developer communities, hackathons and tech media all read instantly on name.tech — no tagline needed. Credibility is proven by real adoption: CES itself runs on ces.tech. Inventory is excellent — nearly any tech word or company name extinct on .com is available here, and two-word combos are wide open. One caution: renewal prices typically run well above first-year promos, so check the renewal before committing long-term. For naming, since the suffix already declares the industry, the name itself can roam — a memorable unrelated word (fruit, animal, myth) stands out more than stacking another technical term.",
      bestFor: ["Hard-tech & hardware companies", "Developer communities & hackathons", "Tech media and blogs", "Robotics, IoT and deep-tech teams"],
      namingTips: [
        "The suffix declares the industry — pick a memorable, unrelated brand word",
        "Intro prices are heavily discounted; check the renewal price first",
        "company-name.tech is almost always available — good for brand protection",
        "Avoid tech/tek in the name itself; techxx.tech reads redundant",
      ],
    },
  },
  online: {
    tld: "online",
    zh: {
      title: ".online 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".online 读起来就是一句话（品牌 + 上线了），适合线上服务、课程与活动页。查看 .online 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .online 域名。",
      intro:
        ".online 的魅力在于读出来就是一个完整短语：brand.online＝「某某上线了」。线上课程、远程服务、虚拟活动、传统品牌的数字化入口，用它都非常顺口。它是注册量最大的新顶级域名之一，认知度在同类里靠前，首年价格常常低到几美元，非常适合做活动页、发布页这类轻量场景的试错。代价同样是续费价回升明显，长期主站要先算清成本。库存几乎不设限：任何词都注册得到，这既是机会也是提醒——极低的门槛意味着它也被大量低质站使用，主体名本身要足够专业才撑得起信任。命名建议选完整、好读的品牌词，让「brand online」读成自然短语；避免缩写和生僻拼写，那会浪费这个后缀的口语优势。",
      bestFor: ["线上课程与远程服务", "虚拟活动与发布页", "传统品牌的数字化入口", "低成本试错的轻量项目"],
      namingTips: [
        "选完整好读的词，让 brand.online 读成自然短语",
        "首年常有超低促销价，适合活动页试错；长期持有先看续费价",
        "低门槛意味着低质站多，主体名要足够专业来建立信任",
        "避免缩写与生僻拼写，浪费口语传播优势",
      ],
    },
    en: {
      title: ".online Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".online reads as a full phrase — brand, online. Great for courses, remote services and launch pages. See live pricing and naming advice, then hunt available .online names with AI.",
      intro:
        ".online works because it reads as a complete sentence: brand.online = \"we're live.\" Online courses, remote services, virtual events, and digital storefronts for traditional brands all roll off the tongue. It's among the highest-volume new TLDs, so recognition is solid, and first-year pricing often drops to a few dollars — ideal for launch pages and low-cost experiments. The flip side: renewals climb back up, so budget before making it a long-term primary domain. Inventory is effectively unlimited, which cuts both ways — the low barrier means plenty of low-quality sites use it too, so your name itself has to carry the credibility. Pick a full, readable brand word so \"brand online\" sounds natural when spoken; abbreviations and odd spellings waste the suffix's spoken-phrase advantage.",
      bestFor: ["Online courses & remote services", "Virtual events & launch pages", "Digital entries for traditional brands", "Low-cost experiments"],
      namingTips: [
        "Choose a full readable word so brand.online sounds like a phrase",
        "Ultra-cheap intro pricing suits experiments; check renewals for keeps",
        "The low barrier attracts spam — your name must carry the trust",
        "Skip abbreviations and odd spellings; they waste the spoken advantage",
      ],
    },
  },
  store: {
    tld: "store",
    zh: {
      title: ".store 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".store 直接告诉访客「这里能买东西」，适合电商、品牌商城与 DTC 独立站。查看 .store 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .store 域名。",
      intro:
        ".store 是为电商而生的后缀：访客还没点进来就知道这里能买东西。DTC 独立站、品牌官方商城、周边商店、线下零售的线上入口，用 brand.store 语义零损耗。很多成熟品牌把主站放在 .com、商城放在 brand.store，两个域名分工明确，这也是它最主流的用法。库存极好，几乎任何品牌词都注册得到；首年常见大幅促销，续费价明显更高，按主站标准做预算。它的边界同样清晰：内容站、工具类产品用 .store 会误导访客预期。命名上主体名就写品牌本身——后缀已经说了「商店」，主体再带 shop/store/mall 就是画蛇添足；名字短一点，因为用户最终要口头传播的是「某某 store」这个整体。",
      bestFor: ["DTC 独立站与品牌商城", "周边与衍生品商店", "线下零售的线上入口", "多域名策略中的商城分工位"],
      namingTips: [
        "主体名就用品牌词，后缀已说明「商店」，别再叠 shop/mall",
        "主站 .com + 商城 .store 的分工是最主流用法",
        "首年促销大、续费高，按长期成本预算",
        "名字保持短：口头传播的是「brand store」整体",
      ],
    },
    en: {
      title: ".store Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".store tells visitors they can buy here — built for e-commerce, brand shops and DTC sites. See live pricing and naming advice, then hunt available .store names with AI.",
      intro:
        ".store is the suffix built for commerce: visitors know they can buy before the page even loads. DTC brands, official brand shops, merch stores, and online entries for physical retail all get zero semantic loss from brand.store. A common mature pattern is running the main site on .com and the shop on brand.store — a clean division of labor that plays to the suffix's strength. Inventory is excellent, and nearly any brand word is available; intro pricing is heavily discounted while renewals run high, so budget at main-site standards. The boundary is equally clear: content sites and tools on .store set the wrong expectation. For naming, just use the brand itself — the suffix already says \"store,\" so adding shop/mall to the name is redundant; keep it short, because what people say out loud is \"brand store\" as one unit.",
      bestFor: ["DTC brands & official shops", "Merch and spin-off stores", "Online entries for physical retail", "The shop slot in a multi-domain strategy"],
      namingTips: [
        "Use the bare brand word — the suffix already says store",
        "Main site on .com, shop on .store is the proven split",
        "Big intro discounts, high renewals — budget for the long run",
        "Keep it short: people will say \"brand store\" as one phrase",
      ],
    },
  },
  site: {
    tld: "site",
    zh: {
      title: ".site 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".site 是含义最中性的新后缀之一，什么类型的网站都装得下，价格亲民库存充裕。查看 .site 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .site 域名。",
      intro:
        ".site 是新顶级域名里的「白纸」：不预设行业、不限定气质，任何类型的网站都装得下。作品集、文档站、社区、小工具、临时项目——当你想要一个便宜、可注册、不带行业暗示的域名时，.site 是最省心的选择之一。它注册量长期位居新后缀前列，认知度足够；首年价格常低至一两美元，库存几乎无限，心仪的词基本都能拿下。中性是双刃剑：它不为你的品牌加分，也不减分，一切靠主体名撑——所以名字本身要么足够独特（造词、合成词），要么直接把用途写清楚（docs、wiki、lab 类组合）。同样注意首年与续费的价差。对预算敏感、需要快速上线、或者给主品牌配套子项目（工具站、文档站）的场景，.site 的性价比很难被击败。",
      bestFor: ["作品集与文档站", "社区与小工具", "主品牌的配套子项目", "预算敏感的快速上线项目"],
      namingTips: [
        "后缀中性不加分，主体名要独特或直接写清用途",
        "docs/wiki/lab 类功能词组合在 .site 下很自然",
        "首年超低价适合快速试错，长期持有先算续费",
        "给主品牌配套的工具站、文档站是高性价比用法",
      ],
    },
    en: {
      title: ".site Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".site is the most neutral new TLD — it fits any kind of website, with friendly pricing and deep inventory. See live pricing and naming advice, then hunt available .site names with AI.",
      intro:
        ".site is the blank canvas of new TLDs: no industry assumption, no personality bias — any website fits. Portfolios, docs, communities, small tools, temporary projects: whenever you want a cheap, available domain with zero industry signal, .site is one of the easiest calls. It consistently ranks among the highest-volume new TLDs, so recognition is fine; first-year pricing often drops to a dollar or two, and inventory is effectively unlimited. Neutrality cuts both ways: the suffix neither boosts nor hurts your brand, so the name does all the work — make it distinctive (a coined or compound word) or make the purpose explicit (docs, wiki, lab combos). Watch the intro-vs-renewal gap as usual. For budget-sensitive launches and companion projects to a main brand (tool sites, doc sites), .site's value is hard to beat.",
      bestFor: ["Portfolios & documentation sites", "Communities and small tools", "Companion projects to a main brand", "Budget-sensitive quick launches"],
      namingTips: [
        "The neutral suffix adds nothing — the name must be distinctive or explicit",
        "Function words like docs/wiki/lab combine naturally on .site",
        "Dollar-level intro pricing suits experiments; check renewals for keeps",
        "Great for tool/doc companion sites next to your main brand",
      ],
    },
  },
  top: {
    tld: "top",
    zh: {
      title: ".top 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".top 注册量位居新后缀前列、在国内接受度高、价格极低。查看 .top 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .top 域名。",
      intro:
        ".top 是注册量常年位居全球前列的新顶级域名，在国内市场尤其活跃：它通过了工信部资质、可以正常 ICP 备案，价格常年处于最低档，这让它成为国内个人站长和中小项目的常见选择。「top＝顶尖」的含义讨喜，用在排行榜、精选集、评测类内容站上语义顺滑（best、rank、pick 类词根很搭）。库存几乎无限，双拼、行业词、品牌词基本都能注册到。需要坦率说明它的短板：极低的价格吸引了大量批量注册与低质站点，部分海外邮件服务和安全系统对 .top 的信任评分偏低，做海外业务或依赖邮件送达的产品要慎重。定位建议：国内个人项目、内容站、排行榜类产品，以及给主品牌低成本注册保护性域名——这些场景里 .top 的价格优势是实打实的。",
      bestFor: ["国内个人站与中小项目", "排行榜与精选集内容站", "可 ICP 备案的低成本选择", "品牌保护性注册"],
      namingTips: [
        "排行/精选语义的词根（best、rank、pick）与 .top 天然搭配",
        "已获工信部资质，可正常 ICP 备案",
        "海外邮件送达场景慎用，部分系统对 .top 信任分偏低",
        "价格极低，适合批量保护性注册品牌词",
      ],
    },
    en: {
      title: ".top Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".top ranks among the highest-volume new TLDs, is popular in China, and costs very little. See live pricing and naming advice, then hunt available .top names with AI.",
      intro:
        ".top consistently ranks among the world's highest-volume new TLDs and is especially active in China: it holds MIIT accreditation for ICP filing and sits in the lowest price tier, making it a staple for individual webmasters and small projects there. The \"top = best\" meaning is likable, and it reads naturally on rankings, curated lists and review sites (roots like best, rank, pick fit well). Inventory is effectively unlimited — pinyin, industry words and brand names are all up for grabs. An honest caveat: rock-bottom pricing attracts bulk registrations and low-quality sites, and some overseas mail and security systems score .top lower on trust — think twice if your product depends on international email deliverability. Where it shines: China-facing personal projects, content and ranking sites, and cheap defensive registrations of your brand word.",
      bestFor: ["China-facing personal projects", "Ranking and curated-list sites", "Low-cost ICP-filable option", "Defensive brand registrations"],
      namingTips: [
        "Ranking roots (best, rank, pick) pair naturally with .top",
        "MIIT-accredited — ICP filing works normally",
        "Be careful if you rely on international email deliverability",
        "Cheap enough for bulk defensive registrations of brand words",
      ],
    },
  },
};

/** 18 个指南页 TLD 列表（顺序即导航展示顺序） */
export const TLD_LIST = Object.keys(TLD_GUIDES);
