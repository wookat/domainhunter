/**
 * TLD 指南页内容（/tld/:tld）。纯数据常量：前端页面与 worker（SSR meta / sitemap）共用。
 */

import type { Tld } from "./tld-list";

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

const GUIDES = {
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
  shop: {
    tld: "shop",
    zh: {
      title: ".shop 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".shop 语义直白，是电商与品牌商店的天然后缀。查看 .shop 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .shop 域名。",
      intro:
        ".shop 是语义最直白的电商后缀：看到域名就知道这是一家店。独立站、品牌官方商店、垂直品类电商用 .shop 都非常自然，「品牌词 + .shop」本身就是一句完整的行动号召。它也常被用作主品牌的商店子站——主站用 .com，商店用同名 .shop，分工清晰。库存充裕，好记的品牌词、品类词大多还能注册到；首年常有低价促销，但续费明显更高，长期持有前先看清续费价。坦率的短板：在部分用户认知里 .shop 新后缀感仍强于 .com，大额客单价或强信任场景（如奢侈品）建议搭配主流后缀使用。定位建议：独立站电商、DTC 品牌商店、线下店铺的线上入口。",
      bestFor: ["独立站与 DTC 电商", "品牌官方商店子站", "垂直品类电商", "线下店铺线上入口"],
      namingTips: [
        "「品牌词 + .shop」自带行动号召，域名即广告语",
        "品类词（coffee、sneaker 类）在 .shop 下语义顺滑",
        "首年促销价与续费价差距大，长期持有先看续费",
        "高客单价场景建议同时持有 .com 做信任背书",
      ],
    },
    en: {
      title: ".shop Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".shop says exactly what it means — the natural suffix for e-commerce and brand stores. See live pricing and naming advice, then hunt available .shop names with AI.",
      intro:
        ".shop is the most literal e-commerce suffix on the market: the domain itself tells visitors they've arrived at a store. Independent stores, official brand shops and vertical e-commerce all read naturally on .shop, and \"brand + .shop\" doubles as a call to action. It's also popular as the store companion to a main brand — .com for the site, the same name on .shop for the storefront. Inventory is healthy, so memorable brand and category words are still available; intro pricing is often cheap while renewals run noticeably higher, so check renewal costs before committing. Honest caveat: some audiences still perceive new TLDs as less established than .com, so high-ticket or trust-heavy commerce may want a mainstream suffix alongside. Best fit: independent e-commerce, DTC brand stores, and online entrances for physical shops.",
      bestFor: ["Independent & DTC e-commerce", "Official brand storefronts", "Vertical category stores", "Online entrance for physical shops"],
      namingTips: [
        "\"Brand + .shop\" doubles as a call to action",
        "Category words (coffee, sneaker) read naturally on .shop",
        "Intro promos are cheap; renewals are much higher — check first",
        "Pair with a .com for high-ticket, trust-heavy commerce",
      ],
    },
  },
  cloud: {
    tld: "cloud",
    zh: {
      title: ".cloud 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".cloud 是云服务与 SaaS 的品类后缀，语义清晰、库存充足。查看 .cloud 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .cloud 域名。",
      intro:
        ".cloud 是云计算时代的品类后缀：云服务、SaaS、托管平台、DevOps 工具用它一眼即懂。相比 .io/.dev 的极客气质，.cloud 更偏「基础设施与企业服务」——面向企业客户的云产品用 .cloud 反而比 .io 更正式。不少云厂商也把 .cloud 用作产品线域名或客户实例域名（如「客户名.产品.cloud」），可扩展性好。库存充足，价格中等，主流品牌词、功能词大多还能注册到。短板是长度：6 个字母的后缀不算短，名字本体要尽量精炼，避免整体过长。定位建议：云服务与 SaaS 产品、托管与部署平台、企业 IT 服务，以及主品牌的云产品线子站。",
      bestFor: ["云服务与 SaaS 产品", "托管与部署平台", "企业 IT 与 DevOps 服务", "主品牌的云产品线"],
      namingTips: [
        "后缀已表明品类，名字本体不必再带 cloud/host 类词根",
        "后缀较长，名字本体控制在 4–8 字符更平衡",
        "企业云产品用 .cloud 比 .io 更正式",
        "适合做客户实例域名的根域（如 app.acme.cloud）",
      ],
    },
    en: {
      title: ".cloud Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".cloud is the category suffix for cloud services and SaaS — clear semantics, good inventory. See live pricing and naming advice, then hunt available .cloud names with AI.",
      intro:
        ".cloud is the category suffix of the cloud era: cloud services, SaaS products, hosting platforms and DevOps tools are instantly legible on it. Compared to the hacker vibe of .io/.dev, .cloud leans \"infrastructure and enterprise\" — for B2B cloud products it often reads more professional than .io. Many vendors also use .cloud as a product-line domain or for customer instances (customer.product.cloud), which scales nicely. Inventory is plentiful at mid-range prices, so mainstream brand and function words are still available. The trade-off is length: a six-letter suffix isn't short, so keep the name itself tight to avoid an overlong domain. Best fit: cloud services and SaaS, hosting and deployment platforms, enterprise IT services, and cloud product lines of an existing brand.",
      bestFor: ["Cloud services & SaaS", "Hosting & deployment platforms", "Enterprise IT & DevOps", "Cloud product lines of existing brands"],
      namingTips: [
        "The suffix states the category — skip cloud/host roots in the name",
        "Six-letter suffix: keep the name to 4–8 characters",
        ".cloud reads more enterprise than .io for B2B products",
        "Great root domain for customer instances (app.acme.cloud)",
      ],
    },
  },
  pro: {
    tld: "pro",
    zh: {
      title: ".pro 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".pro 传达专业与资质感，适合专业服务、顾问与工具的 Pro 版。查看 .pro 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .pro 域名。",
      intro:
        ".pro 的含义是「专业」：律师、设计师、摄影师、顾问等专业服务者用它给个人品牌加一层资质感，「姓名/技能 + .pro」干净利落。它也是产品「Pro 版」的天然域名——主站在 .com，付费专业版落在同名 .pro，用户一看就懂。这个后缀历史上曾要求注册者提供职业资质，现已放开注册，但「专业」的语义沉淀保留了下来。价格低、库存充足，短名字命中率高。短板是通用信任度一般：完全陌生的品牌只用 .pro 做主站，说服力弱于 .com，更适合与主域名配合或用在明确的「专业/付费」语境里。定位建议：专业服务个人品牌、行业顾问、产品 Pro 版与付费升级页。",
      bestFor: ["专业服务个人品牌", "行业顾问与工作室", "产品 Pro 版落地页", "技能 + pro 的组合命名"],
      namingTips: [
        "「姓名/技能 + .pro」适合个人专业品牌",
        "产品付费版用同名 .pro 与主站分工清晰",
        "价格低、库存足，短名字命中率高",
        "陌生品牌主站慎用，配合 .com 主域更稳",
      ],
    },
    en: {
      title: ".pro Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".pro signals professionalism — great for professional services, consultants, and Pro tiers of products. See live pricing and naming advice, then hunt available .pro names with AI.",
      intro:
        ".pro means exactly what it says: lawyers, designers, photographers and consultants use it to add a layer of credential to a personal brand — \"name/skill + .pro\" is clean and confident. It's also the natural home for a product's Pro tier: main site on .com, the paid professional edition on the matching .pro. Historically the registry required proof of professional credentials; registration is open now, but the \"professional\" connotation stuck. Prices are low and inventory is deep, so short names hit often. The trade-off is general trust: an unknown brand running only on .pro persuades less than .com, so it works best alongside a main domain or in an explicitly \"pro/paid\" context. Best fit: professional-service personal brands, consultants and studios, and Pro-tier landing pages.",
      bestFor: ["Professional-service personal brands", "Consultants & studios", "Pro-tier product pages", "Skill + pro combinations"],
      namingTips: [
        "\"Name/skill + .pro\" suits personal professional brands",
        "Use the matching .pro for your product's paid tier",
        "Low prices and deep inventory — short names still available",
        "For unknown brands, pair with a .com main domain",
      ],
    },
  },
  vip: {
    tld: "vip",
    zh: {
      title: ".vip 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".vip 在国内认知度高、可 ICP 备案，适合会员制产品与粉丝社群。查看 .vip 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .vip 域名。",
      intro:
        ".vip 是少数在国内比海外更主流的新后缀：VIP 的概念国人人人皆知，后缀已获工信部资质、可正常 ICP 备案，注册量长期位居新后缀前列。会员制产品、粉丝社群、高端服务预约、电商会员站用 .vip 语义直给——域名本身就在说「这里是会员专属」。价格亲民、库存极充足，双拼与品牌词命中率很高。坦率的短板：海外用户对 .vip 认知有限，且「VIP」气质自带营销感，严肃工具类产品不太搭。定位建议：面向国内的会员制业务、粉丝与社群运营、品牌会员中心子站（主站 .com + 会员站同名 .vip）。",
      bestFor: ["会员制产品与订阅服务", "粉丝社群与私域运营", "高端服务与预约", "品牌会员中心子站"],
      namingTips: [
        "「品牌词 + .vip」天然表达会员专属语义",
        "已获工信部资质，可正常 ICP 备案",
        "双拼命中率高，适合国内品牌",
        "海外业务与严肃工具类产品不建议做主域",
      ],
    },
    en: {
      title: ".vip Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".vip is unusually strong in China, ICP-filable, and fits membership products and fan communities. See live pricing and naming advice, then hunt available .vip names with AI.",
      intro:
        ".vip is one of the few new TLDs that's bigger in China than anywhere else: the VIP concept is universally understood there, the registry holds MIIT accreditation for ICP filing, and registration volume has ranked near the top of new TLDs for years. Membership products, fan communities, premium booking services and member stores read instantly on .vip — the domain itself says \"members only\". Prices are friendly and inventory is deep, so pinyin and brand words hit often. Honest caveats: overseas recognition is limited, and the VIP vibe carries a promotional flavor that suits marketing better than serious tooling. Best fit: China-facing membership businesses, fan and community operations, and a brand's member-center companion site (main site on .com, members on the matching .vip).",
      bestFor: ["Membership & subscription products", "Fan communities & private ops", "Premium services & booking", "Brand member-center sites"],
      namingTips: [
        "\"Brand + .vip\" natively signals members-only",
        "MIIT-accredited — ICP filing works normally",
        "Pinyin names hit often — great for China-facing brands",
        "Skip it as the main domain for overseas or serious tools",
      ],
    },
  },
  club: {
    tld: "club",
    zh: {
      title: ".club 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".club 是社群与俱乐部的天然后缀，语义友好、价格低。查看 .club 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .club 域名。",
      intro:
        ".club 的语义人人秒懂：这是一个「圈子」。兴趣社群、付费社群、读书会、健身团、NFT/粉丝俱乐部用 .club 都非常自然，「主题词 + .club」念出来就是社群的名字。相比 .com 的商业感，.club 自带归属感与轻松气质，很适合把「加入我们」写进域名里。价格常年低位、库存充足，好词命中率高；曾经的 NFT 热潮让大量 .club 被注册又释放，现在正是捡漏窗口。短板：商业产品主站用 .club 显得不够正式，且部分场景与「夜店/会所」联想有歧义，选词时注意语境。定位建议：兴趣与付费社群、会员俱乐部、社区型产品，以及主品牌的社区子站（主站 .com + 社区同名 .club）。",
      bestFor: ["兴趣社群与付费社群", "读书会与线下俱乐部", "粉丝与会员俱乐部", "主品牌的社区子站"],
      namingTips: [
        "「主题词 + .club」念出来就是社群名",
        "社群产品用 .club 比 .com 更有归属感",
        "价格低、库存足，NFT 退潮后好词回流",
        "注意选词语境，避免歧义联想",
      ],
    },
    en: {
      title: ".club Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".club is the natural suffix for communities and clubs — friendly semantics, low prices. See live pricing and naming advice, then hunt available .club names with AI.",
      intro:
        "Everyone instantly understands .club: it's a circle you can join. Interest groups, paid communities, book clubs, fitness crews and fan clubs all read naturally on it — \"topic + .club\" spoken aloud is the community's name. Where .com feels commercial, .club carries belonging and warmth, which makes \"join us\" part of the domain itself. Prices stay low and inventory is deep; the NFT wave registered and then released a huge batch of .club names, so good words are flowing back. Trade-offs: a commercial product's main site on .club can feel informal, and in some contexts the word carries nightlife connotations — choose your words with the context in mind. Best fit: interest and paid communities, membership clubs, community-shaped products, and a brand's community companion site (main on .com, community on the matching .club).",
      bestFor: ["Interest & paid communities", "Book clubs & local clubs", "Fan & membership clubs", "Brand community sites"],
      namingTips: [
        "\"Topic + .club\" spoken aloud is your community's name",
        "Reads warmer and more belonging than .com for communities",
        "NFT-era names are dropping back into availability",
        "Mind word context to avoid nightlife connotations",
      ],
    },
  },
  link: {
    tld: "link",
    zh: {
      title: ".link 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".link 语义即「链接」，适合导航页、个人主页聚合与短链服务。查看 .link 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .link 域名。",
      intro:
        ".link 的语义就是「链接」：个人主页聚合（link-in-bio）、导航站、短链与跳转服务、资源合集用它一眼即懂，「名字 + .link」天然表达「这里汇总了我的所有链接」。相比功能相似的 .bio/.page，.link 更中性、更技术感，也常被用作产品的分享域名——主站在 .com，分享短链用更短的同名 .link。价格亲民、续费稳定（这在新后缀里难得），库存充足。短板：语义强绑定「链接/聚合」场景，做通用品牌主站不合适；部分安全网关对陌生短链域名会多一层审查，做企业级短链服务要养域名信誉。定位建议：个人 link-in-bio 主页、导航与资源聚合站、产品分享短链域名。",
      bestFor: ["个人主页聚合（link-in-bio）", "导航站与资源合集", "短链与分享跳转服务", "产品的分享短链域名"],
      namingTips: [
        "「名字 + .link」天然表达链接聚合语义",
        "续费价稳定，适合长期持有的工具域名",
        "做短链服务先养域名信誉，避免被安全网关拦截",
        "通用品牌主站不适合，语义绑定链接场景",
      ],
    },
    en: {
      title: ".link Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".link literally means link — perfect for link-in-bio pages, directories and short-link services. See live pricing and naming advice, then hunt available .link names with AI.",
      intro:
        ".link says exactly what it does: link-in-bio pages, directories, short-link and redirect services, and resource collections are instantly legible on it — \"name + .link\" naturally reads as \"all my links live here\". Compared to .bio/.page it feels more neutral and technical, and it's popular as a product's sharing domain — main site on .com, share links on a shorter matching .link. Prices are friendly and renewals are stable, which is rare among new TLDs, and inventory is deep. Trade-offs: the semantics are tightly bound to linking/aggregation, so it's a poor fit for a general brand's main site; and some security gateways scrutinize unfamiliar short-link domains, so enterprise link services need to build domain reputation. Best fit: personal link-in-bio pages, directories and resource hubs, and share-link domains for products.",
      bestFor: ["Link-in-bio personal pages", "Directories & resource hubs", "Short-link & redirect services", "Product share-link domains"],
      namingTips: [
        "\"Name + .link\" natively reads as a link hub",
        "Stable renewals — rare among new TLDs, good for keeps",
        "Build reputation before enterprise short-link use",
        "Semantics are link-bound — not for general brand sites",
      ],
    },
  },
  live: {
    tld: "live",
    zh: {
      title: ".live 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".live 语义即「直播/现场」，适合直播、活动与实时服务。查看 .live 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .live 域名。",
      intro:
        ".live 的语义是「正在发生」：直播频道、线上活动、演出与赛事、实时数据看板用它一眼即懂，「名字 + .live」天然带着「点进来看现场」的号召力。主播个人站、播客的直播页、发布会与线上峰会的活动页都非常合适；实时监控、状态页这类「live data」产品用它也很贴切。价格结构是典型的新后缀：首年促销便宜、续费明显上浮，注册前看清续费价。短板：语义强绑定「实时/现场」，做与直播无关的品牌主站会造成预期错位。定位建议：直播与活动场景做主域名，或主站 .com + 直播页同名 .live 的分工组合。",
      bestFor: ["直播频道与主播个人站", "线上活动与发布会页", "实时数据与状态看板", "主站 .com + 直播页 .live 组合"],
      namingTips: [
        "「名字 + .live」自带「看现场」号召力",
        "活动页可用「活动名 + .live」做短期投放域名",
        "首年促销便宜但续费上浮，注册前看清续费",
        "与直播/实时无关的主站不适合",
      ],
    },
    en: {
      title: ".live Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".live means happening now — built for streaming, events and real-time services. See live pricing and naming advice, then hunt available .live names with AI.",
      intro:
        ".live means it's happening now: streaming channels, online events, shows and matches, and real-time dashboards are instantly legible on it — \"name + .live\" carries a built-in 'come watch' call to action. Streamer personal sites, podcast live pages, launch events and online summits all fit naturally, as do live-data products like monitoring and status pages. Pricing follows the classic new-TLD pattern: cheap promo first year, noticeably higher renewals — check the renewal before you register. Trade-off: the semantics are firmly bound to live/real-time, so an unrelated brand's main site will set the wrong expectation. Best fit: streaming and events as the primary domain, or a split setup — main site on .com, live page on the matching .live.",
      bestFor: ["Streaming channels & creator sites", "Online events & launch pages", "Real-time dashboards & status pages", "Main .com + matching .live combo"],
      namingTips: [
        "\"Name + .live\" is a built-in 'come watch' CTA",
        "Event pages work great as short-run campaign domains",
        "Cheap year one, higher renewals — check before registering",
        "Poor fit for brands unrelated to live/real-time",
      ],
    },
  },
  space: {
    tld: "space",
    zh: {
      title: ".space 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".space 语义开放百搭，适合创意空间、个人站与社区。查看 .space 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .space 域名。",
      intro:
        ".space 是语义最开放的新后缀之一：它可以是创作者的「小天地」、团队的协作空间、社区的聚集地，也可以是航天与太空主题的天然归属。「名字 + .space」读起来柔和不商业，很适合个人站、博客、作品集与实验项目；coworking 空间、艺术空间、虚拟社区用它也顺理成章。价格常年低位、库存深，好词命中率高。短板：认知度一般，正式商业主站用它偏轻；和多数新后缀一样首年便宜续费上浮。定位建议：个人与创意项目的主域名、社区与空间类品牌，以及航天/太空主题产品的第一选择。",
      bestFor: ["个人站与创意实验项目", "协作空间与 coworking 品牌", "虚拟社区与兴趣空间", "航天/太空主题产品"],
      namingTips: [
        "「名字 + .space」读感柔和，适合个人小天地",
        "太空主题产品用 .space 语义天然满分",
        "价格低库存深，好词命中率高",
        "正式商业主站偏轻，注意续费上浮",
      ],
    },
    en: {
      title: ".space Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".space is open-ended and versatile — great for creative spaces, personal sites and communities. See live pricing and naming advice, then hunt available .space names with AI.",
      intro:
        ".space is one of the most open-ended new TLDs: it can be a creator's corner, a team's collaborative space, a community's gathering place — or the literal home of an aerospace project. \"Name + .space\" reads soft and non-commercial, which suits personal sites, blogs, portfolios and experiments; coworking brands, art spaces and virtual communities feel equally natural. Prices stay low and inventory runs deep, so good words are very gettable. Trade-offs: recognition is middling, it reads light for a formal business site, and like most new TLDs the renewal is higher than year one. Best fit: primary domains for personal and creative projects, community and space-as-a-place brands, and the obvious first choice for anything space-themed.",
      bestFor: ["Personal sites & creative experiments", "Coworking & collaborative-space brands", "Virtual communities & interest spaces", "Aerospace / space-themed products"],
      namingTips: [
        "\"Name + .space\" reads soft and personal",
        "Space-themed products get perfect semantics for free",
        "Low prices, deep inventory — good words are gettable",
        "Reads light for formal business; watch renewals",
      ],
    },
  },
  fun: {
    tld: "fun",
    zh: {
      title: ".fun 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".fun 语义即「好玩」，适合游戏、娱乐与活动品牌。查看 .fun 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .fun 域名。",
      intro:
        ".fun 把「好玩」写进了域名：小游戏与休闲游戏站、娱乐内容、派对与活动策划、玩具与亲子品牌用它一眼即懂，「名字 + .fun」天然传达轻松愉快的预期。相比 .games 的垂直，.fun 更宽泛——凡是想让用户「玩起来」的产品都合适：互动营销页、趣味测试、创意小工具。首年价格常年极低（常见一两美元），库存极好；续费会上浮但幅度在新后缀里不算激进。短板：语义与「正经」相斥，金融、医疗、B2B 场景不合适；太便宜也让它被低质站用得多，品牌要靠内容撑住第一印象。定位建议：游戏与娱乐品牌主域名、活动与营销 campaign 页、趣味副项目。",
      bestFor: ["小游戏与休闲游戏站", "娱乐内容与趣味测试", "活动策划与派对品牌", "互动营销 campaign 页"],
      namingTips: [
        "「名字 + .fun」自带轻松愉快预期",
        "首年极便宜，适合 campaign 页快速上线",
        "严肃行业（金融/医疗/B2B）不适合",
        "低价后缀低质站多，靠内容撑住第一印象",
      ],
    },
    en: {
      title: ".fun Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".fun literally means fun — built for games, entertainment and event brands. See live pricing and naming advice, then hunt available .fun names with AI.",
      intro:
        ".fun writes playfulness into the domain itself: casual game sites, entertainment content, party and event planners, toy and family brands are instantly legible on it — \"name + .fun\" sets a light-hearted expectation before the page even loads. Broader than the vertical .games, it fits anything that wants users to play: interactive marketing pages, quizzes, playful side tools. Year-one pricing is consistently rock-bottom (often a dollar or two) with excellent inventory; renewals rise, but less aggressively than many new TLDs. Trade-offs: the semantics clash with seriousness — skip it for finance, health or B2B — and its cheapness attracts low-quality sites, so your content has to carry the first impression. Best fit: game and entertainment brand domains, campaign and event pages, playful side projects.",
      bestFor: ["Casual game & entertainment sites", "Quizzes & playful content", "Party & event planner brands", "Interactive marketing campaigns"],
      namingTips: [
        "\"Name + .fun\" sets a playful expectation instantly",
        "Rock-bottom year one — great for fast campaign launches",
        "Skip for serious verticals (finance, health, B2B)",
        "Cheap TLDs attract junk — let content carry trust",
      ],
    },
  },
  art: {
    tld: "art",
    zh: {
      title: ".art 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".art 是艺术领域的专属后缀，适合艺术家、画廊与创意机构。查看 .art 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .art 域名。",
      intro:
        ".art 是为艺术圈量身定制的后缀：艺术家个人站与作品集、画廊与美术馆、艺术展览与博览会、设计与创意机构用它，身份一眼可辨。「名字 + .art」本身就像一张名片——比 .com 更能说明「我是做艺术的」。注册局也长期面向艺术社区运营，圈内认可度在垂直后缀里属于较高的一档。价格中等、续费稳定，好名字库存仍然充足：常见艺术家人名、风格词、媒介词多数可注册。短板：语义垂直，非艺术类品牌不适合；面向大众售卖的电商场景（卖画、卖周边）可以搭配 .shop/.store 分工。定位建议：艺术家与创意人的个人品牌主域名、画廊与机构官网、展览项目页。",
      bestFor: ["艺术家个人站与作品集", "画廊、美术馆与艺术机构", "展览与艺术项目页", "设计与创意工作者品牌"],
      namingTips: [
        "「人名 + .art」是艺术家最直接的个人品牌",
        "风格词、媒介词（oil、ink、pixel 类）库存充足",
        "机构官网用全名，展览项目可用短代号",
        "卖作品的电商页可搭配 .shop/.store 分工",
      ],
    },
    en: {
      title: ".art Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".art is the dedicated suffix for the art world — artists, galleries and creative institutions. See live pricing and naming advice, then hunt available .art names with AI.",
      intro:
        ".art is purpose-built for the art world: artist portfolios, galleries and museums, exhibitions and fairs, design and creative studios are instantly identifiable on it. \"Name + .art\" works like a business card — it says 'I make art' in a way .com never can. The registry has courted the art community for years, giving it above-average credibility among vertical TLDs. Pricing is moderate with stable renewals, and inventory remains generous: artist names, style words and medium words are mostly still available. Trade-offs: the semantics are vertical, so non-art brands don't fit; for selling work directly, pair it with .shop/.store for the commerce side. Best fit: primary domains for artists and creatives, gallery and institution sites, exhibition project pages.",
      bestFor: ["Artist portfolios & personal sites", "Galleries, museums & institutions", "Exhibitions & art projects", "Design & creative studio brands"],
      namingTips: [
        "\"Yourname + .art\" is the most direct artist brand",
        "Style and medium words (oil, ink, pixel) are still gettable",
        "Full names for institutions, short codes for exhibitions",
        "Pair with .shop/.store when selling work directly",
      ],
    },
  },
  design: {
    tld: "design",
    zh: {
      title: ".design 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".design 是设计师与设计团队的身份后缀。查看 .design 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .design 域名。",
      intro:
        ".design 把职业身份直接写进域名：设计师作品集、设计工作室、设计系统文档、设计资源站用它，专业度不言自明。「名字 + .design」在简历、名片和邮件签名里的辨识度远超普通后缀，国外设计圈（尤其 UI/UX 与品牌设计）使用率很高，不少知名团队的设计子站就在 .design 下。价格偏高（垂直后缀定价），但续费相对稳定，且好名字库存充足——常见人名与风格词大多可注册。短板：7 个字母偏长，口头传播稍逊；语义垂直，非设计类品牌不适合。定位建议：设计师个人品牌、工作室官网，以及产品公司的设计团队子站（主站 .com + design 子站同名 .design）。",
      bestFor: ["设计师作品集与个人品牌", "设计工作室与咨询", "设计系统与文档站", "产品公司的设计子站"],
      namingTips: [
        "「人名 + .design」是设计师简历级域名",
        "公司设计子站可用「品牌 + .design」分工",
        "7 字母偏长，前面的名字尽量短",
        "价格偏高但续费稳定，库存充足",
      ],
    },
    en: {
      title: ".design Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".design puts the profession in the domain — for designers, studios and design teams. See live pricing and naming advice, then hunt available .design names with AI.",
      intro:
        ".design writes the profession into the domain itself: designer portfolios, studios, design-system docs and resource sites read as instantly professional. \"Name + .design\" stands out on resumes, business cards and email signatures far more than a generic suffix, and adoption in the design community — especially UI/UX and brand design — is genuinely high, with well-known companies hosting design team sites on it. Pricing sits at the premium end of vertical TLDs, but renewals are comparatively stable and inventory is strong — most personal names and style words are still available. Trade-offs: seven letters is on the long side for word-of-mouth, and the vertical semantics rule out non-design brands. Best fit: designer personal brands, studio sites, and a product company's design subdomain-style site (main on .com, design team on the matching .design).",
      bestFor: ["Designer portfolios & personal brands", "Design studios & consultancies", "Design systems & documentation", "Company design-team sites"],
      namingTips: [
        "\"Yourname + .design\" is a resume-grade domain",
        "\"Brand + .design\" works for company design teams",
        "Seven letters — keep the name before it short",
        "Premium pricing but stable renewals, good inventory",
      ],
    },
  },
  studio: {
    tld: "studio",
    zh: {
      title: ".studio 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".studio 是创意工作室的天然后缀，适合设计、影像、游戏与内容团队。查看 .studio 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .studio 域名。",
      intro:
        ".studio 的语义是「工作室」：设计工作室、影像与摄影团队、游戏与动画工作室、播客与内容制作方用它，团队属性一眼可辨。「名字 + .studio」比 .com 更能传达「小而专的创作团队」气质，也天然区别于大公司的企业感。独立开发者组的小团队、两三人的创意小组用它尤其合适。价格中等、库存充足，常见的风格词、动物词、地名组合大多可注册。短板：6 个字母不短，且语义绑定「工作室」形态——个人单干或大型企业主站都不太贴。定位建议：创意与内容团队的主域名，或个人品牌升级为团队时从 .me/.design 迁移的自然去处。",
      bestFor: ["设计与创意工作室", "影像、摄影与动画团队", "游戏与独立开发小团队", "播客与内容制作方"],
      namingTips: [
        "「名字 + .studio」自带小而专的团队气质",
        "风格词、动物词组合库存充足",
        "个人单干用 .me/.design 更贴，团队再迁 .studio",
        "6 字母不短，前面的名字尽量短",
      ],
    },
    en: {
      title: ".studio Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".studio is the natural suffix for creative studios — design, film, games and content teams. See live pricing and naming advice, then hunt available .studio names with AI.",
      intro:
        ".studio says exactly what you are: design studios, film and photo teams, game and animation shops, podcast and content producers are instantly legible on it. \"Name + .studio\" conveys a small, focused creative team in a way .com's corporate neutrality can't, which is why it fits indie dev groups and two-to-three-person creative crews so well. Pricing is moderate and inventory is deep — style words, animal words and place-name combos are mostly available. Trade-offs: six letters isn't short, and the semantics are bound to the studio shape — a solo personal site or a large enterprise's main domain both fit awkwardly. Best fit: the primary domain for creative and content teams, and the natural upgrade path when a personal brand on .me/.design grows into a team.",
      bestFor: ["Design & creative studios", "Film, photo & animation teams", "Game & indie dev teams", "Podcast & content producers"],
      namingTips: [
        "\"Name + .studio\" signals a small, focused team",
        "Style and animal-word combos have deep inventory",
        "Solo? Start on .me/.design, move here as a team",
        "Six letters — keep the name before it short",
      ],
    },
  },
  info: {
    tld: "info",
    zh: {
      title: ".info 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".info 是最早的「信息类」通用后缀，适合资料站、文档、百科与项目信息页。查看 .info 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .info 域名。",
      intro:
        ".info 是 2001 年第一批新通用后缀之一，语义就是「信息」：资料站、行业百科、开源项目文档、活动信息页、产品说明站用它顺理成章。二十多年历史让它的认知度在新后缀里名列前茅，且首年价常年极低（经常一两美元），做内容矩阵、给主品牌配一个信息子站的成本几乎可以忽略。短板也来自低价：历史上被大量垃圾站使用过，直接做商业主站的信任感弱于 .com/.co，且续费价明显高于首年。定位建议：主站之外的资料/文档/百科类站点，或验证内容型 side project 的低成本起步——跑通了再升级主后缀。",
      bestFor: ["资料站与行业百科", "开源项目与产品文档", "活动与信息发布页", "低成本内容型试验项目"],
      namingTips: [
        "「主题词 + .info」语义自解释（如 visa.info 式结构）",
        "首年极便宜但续费翻数倍，长期持有先看续费价",
        "不建议做商业主站：信任感弱于 .com/.co",
        "给主品牌配同名 .info 做文档/帮助站是经典分工",
      ],
    },
    en: {
      title: ".info Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".info is the original \"information\" TLD — great for resource sites, docs, wikis and info pages. See live pricing and naming advice, then hunt available .info names with AI.",
      intro:
        ".info launched in 2001 as one of the first new generic TLDs and its meaning is right in the name: resource sites, industry wikis, open-source project docs, event pages and product information sites all read naturally on it. Two decades of history give it better recognition than most newer suffixes, and first-year pricing is routinely a dollar or two — spinning up an info companion site for your main brand costs almost nothing. The cheapness cuts both ways: heavy historical spam usage means a commercial main site on .info carries less trust than .com/.co, and renewal prices run several times the first-year teaser. Best fit: docs, wikis and resource sites alongside a main brand, or the lowest-cost way to validate a content side project before upgrading the suffix.",
      bestFor: ["Resource sites & industry wikis", "Open-source & product docs", "Event & information pages", "Low-cost content experiments"],
      namingTips: [
        "\"Topic + .info\" is self-explanatory by design",
        "Cheap first year, renewals several times higher — check both",
        "Skip it for a commercial main site; trust trails .com/.co",
        "Matching .info for your brand's docs/help site is a classic split",
      ],
    },
  },
  sh: {
    tld: "sh",
    zh: {
      title: ".sh 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".sh 是开发者最爱的极客后缀之一（shell 梗），适合 CLI 工具、开发者产品与技术博客。查看 .sh 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .sh 域名。",
      intro:
        ".sh 本是圣赫勒拿岛的国家后缀，却因为撞上 Unix shell 的 .sh 脚本扩展名成了开发者圈的身份暗号：CLI 工具、终端产品、DevOps 服务、技术博客用它，目标用户一眼会心。知名先例不少（如 fig.sh、warp.sh 一类终端产品），「动词 + .sh」读起来就像一条命令，品牌感和记忆点都很强。只有两个字母的后缀让整个域名极短。短板：价格偏高（几十美元/年），非技术受众不理解梗；且作为国家后缀，理论上受注册局政策变动影响。定位建议：纯开发者产品的主域名，尤其是 CLI/终端/脚本类工具——受众对味时它比 .com 更出彩。",
      bestFor: ["CLI 与终端工具", "DevOps 与基础设施服务", "技术博客与个人站", "开源项目官网"],
      namingTips: [
        "「动词 + .sh」读起来像一条命令（install.sh 式联想）",
        "两字母后缀，配 3–6 字母短词整体极短",
        "只对开发者受众有效，大众产品别用",
        "价格偏高且是国家后缀，注册前看清续费价",
      ],
    },
    en: {
      title: ".sh Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".sh is a developer favorite (the shell-script pun) — great for CLI tools, dev products and tech blogs. See live pricing and naming advice, then hunt available .sh names with AI.",
      intro:
        ".sh is technically the country code of Saint Helena, but colliding with the Unix shell-script extension turned it into an insider handshake for developers: CLI tools, terminal products, DevOps services and tech blogs on .sh are instantly legible to their audience. There are plenty of well-known precedents among terminal-adjacent products, and \"verb + .sh\" reads like a command — strong branding with a built-in mnemonic. At two letters it also keeps the whole domain extremely short. Trade-offs: pricing runs a few tens of dollars a year, the pun means nothing to non-technical audiences, and as a ccTLD it is nominally subject to registry policy shifts. Best fit: the primary domain for developer-only products — especially CLI, terminal and scripting tools — where it out-brands .com with the right crowd.",
      bestFor: ["CLI & terminal tools", "DevOps & infrastructure services", "Tech blogs & personal sites", "Open-source project sites"],
      namingTips: [
        "\"Verb + .sh\" reads like a shell command",
        "Two-letter suffix — pair with a 3–6 letter word for a tiny domain",
        "Only works for developer audiences; skip for consumer products",
        "Pricier ccTLD — check the renewal before committing",
      ],
    },
  },
  gg: {
    tld: "gg",
    zh: {
      title: ".gg 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".gg 是游戏与电竞圈的标志性后缀（good game 梗），适合游戏、社区与直播相关产品。查看 .gg 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .gg 域名。",
      intro:
        ".gg 是根西岛的国家后缀，但在游戏圈它只有一个含义——「good game」。游戏工作室、电竞战队、Discord 社区工具、直播与陪玩平台、游戏数据站用它，圈内认同感拉满：op.gg、dotabuff 一代的数据站与大量 Discord 生态工具都选了 .gg。两个字母的后缀 + 游戏梗，让它在年轻用户里的传播力甚至超过 .com。短板：语义强绑定游戏/电竞，圈外产品不适合；价格中上，且同为国家后缀。定位建议：一切与游戏、电竞、玩家社区相关的产品主域名——这个圈子里 .gg 就是「自己人」的信号。",
      bestFor: ["游戏与电竞产品", "Discord 社区与工具", "直播、陪玩与玩家平台", "游戏数据与攻略站"],
      namingTips: [
        "游戏圈内 .gg 认同感高于 .com，圈外则相反",
        "「战队/社区名 + .gg」是电竞标配",
        "两字母后缀，短词组合整体极短好记",
        "国家后缀价格中上，注意续费价",
      ],
    },
    en: {
      title: ".gg Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".gg is the signature TLD of gaming and esports (the \"good game\" pun) — for games, communities and streaming products. See live pricing and naming advice, then hunt available .gg names with AI.",
      intro:
        ".gg belongs to Guernsey on paper, but in gaming it means exactly one thing: \"good game.\" Game studios, esports teams, Discord community tools, streaming platforms and game-stats sites wear it as a badge — the op.gg generation of stats sites and a large slice of the Discord tool ecosystem chose it. A two-letter suffix plus the gaming pun gives it word-of-mouth power that can beat .com with younger audiences. Trade-offs: the semantics are hard-bound to gaming and esports, so it fits poorly outside the scene; pricing is mid-to-high and it is likewise a ccTLD. Best fit: the primary domain for anything touching games, esports or player communities — inside that world, .gg is the insider signal.",
      bestFor: ["Games & esports products", "Discord communities & tools", "Streaming & player platforms", "Game stats & guide sites"],
      namingTips: [
        "Inside gaming .gg outranks .com for credibility; outside it, the reverse",
        "\"Team/community + .gg\" is the esports standard",
        "Two-letter suffix — short-word combos stay tiny and memorable",
        "Mid-to-high ccTLD pricing; check renewals",
      ],
    },
  },
  so: {
    tld: "so",
    zh: {
      title: ".so 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".so 因 Notion.so 走红，适合效率工具与初创产品，也是共享库文件名的极客梗。查看 .so 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .so 域名。",
      intro:
        ".so 是索马里的国家后缀，被 Notion.so 一举带火：效率工具、笔记与协作产品、初创 SaaS 用它，自带「新一代产品」的联想。它还有一层极客梗——Linux 下共享库文件就是 .so，开发者工具用它也说得通。两个字母极短，读音顺口，「单词 + .so」在英语里常能连读成短语（如 do.so、say.so 式结构），品牌记忆点很强。短板：认知度仍靠 Notion 一个头部案例撑着，大众用户可能误输 .com；国家后缀价格中上。定位建议：效率/协作/AI 工具类初创产品的主域名，尤其当你的品牌词短且 .com 已无货时——Notion 已经帮你完成了用户教育。",
      bestFor: ["效率与协作工具", "笔记与知识管理产品", "初创 SaaS 与 AI 工具", "开发者库与工具"],
      namingTips: [
        "「单词 + .so」能连读成短语的名字最出彩",
        "效率工具赛道用户已被 Notion 教育过，接受度高",
        "防守性注册同名 .com 转发，接住误输流量",
        "国家后缀价格中上，注意续费价",
      ],
    },
    en: {
      title: ".so Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".so was put on the map by Notion.so — a fit for productivity tools and startups, with a shared-library pun for developers. See live pricing and naming advice, then hunt available .so names with AI.",
      intro:
        ".so is Somalia's country code, made famous by Notion.so: productivity tools, note-taking and collaboration products, and startup SaaS wear it with a \"next-generation product\" connotation. There's a developer pun layered in too — .so is the shared-library extension on Linux, so dev tools read naturally on it. Two letters, easy to say, and \"word + .so\" often chains into a phrase in English, which makes for strong brand recall. Trade-offs: recognition still leans on one flagship example, mainstream users may type .com by reflex, and ccTLD pricing is mid-to-high. Best fit: the primary domain for productivity, collaboration and AI-tool startups — especially when your brand word is short and the .com is gone; Notion already did the user education for you.",
      bestFor: ["Productivity & collaboration tools", "Notes & knowledge management", "Startup SaaS & AI tools", "Developer libraries & tools"],
      namingTips: [
        "Names where \"word + .so\" reads as a phrase shine brightest",
        "Productivity users are pre-educated by Notion — adoption is easy",
        "Defensively register the matching .com to catch typed-in traffic",
        "Mid-to-high ccTLD pricing; check renewals",
      ],
    },
  },
  us: {
    tld: "us",
    zh: {
      title: ".us 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".us 是美国国家后缀，便宜且可玩「与我们」的语义梗，适合面向美国市场的产品与社区。查看 .us 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .us 域名。",
      intro:
        ".us 是美国的国家后缀，价格常年在最便宜一档，而且有一个独特的语言优势：us 在英语里就是「我们」，「join.us、near.us」式的域名能把后缀读进品牌短语里，社区、协作与本地服务类产品用起来非常出彩。面向美国市场的业务用 .us 也天然传达「本土」信号。短板必须了解：注册 .us 要求与美国有真实关联（美国公民/居民/企业或在美业务，注册时需申报 Nexus 信息），且注册局不允许 WHOIS 隐私保护——注册人信息公开可查，介意隐私的个人开发者要慎重。定位建议：面向美国用户的产品、社区与本地服务，或能把「us=我们」读进品牌的创意域名。",
      bestFor: ["面向美国市场的产品", "社区与协作类品牌", "美国本地服务", "「与我们」语义的创意域名"],
      namingTips: [
        "「动词/介词 + .us」连读成短语（join.us 式）最出彩",
        "注册需申报美国关联（Nexus），纯海外主体不合规",
        "注册局禁止 WHOIS 隐私，注册人信息公开",
        "价格便宜续费也稳，是最实惠的两字母后缀之一",
      ],
    },
    en: {
      title: ".us Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".us is America's country code — cheap, with a built-in \"us = we\" wordplay. Great for US-market products and communities. See live pricing and naming advice, then hunt available .us names with AI.",
      intro:
        ".us is the United States country code, consistently among the cheapest TLDs, with a unique linguistic bonus: \"us\" is a real English word, so domains like join.us or near.us read the suffix straight into the brand phrase — a gift for communities, collaboration products and local services. For US-market businesses it also signals \"domestic\" by default. Know the constraints before you commit: registration requires a genuine US nexus (citizen, resident, US company or US-based activity, declared at registration), and the registry forbids WHOIS privacy — registrant details are publicly visible, which privacy-minded indie developers should weigh seriously. Best fit: products and communities aimed at US users, local services, or any name where \"us = we\" completes the phrase.",
      bestFor: ["US-market products", "Community & collaboration brands", "US local services", "\"Us = we\" phrase domains"],
      namingTips: [
        "\"Verb/preposition + .us\" phrase reads (join.us) are the standout play",
        "US nexus required at registration — purely offshore entities don't qualify",
        "Registry forbids WHOIS privacy; registrant info is public",
        "Cheap with stable renewals — one of the best-value two-letter TLDs",
      ],
    },
  },
  in: {
    tld: "in",
    zh: {
      title: ".in 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".in 是印度国家后缀，也是英语介词 in 的语义梗，适合面向印度市场的产品与「in」短语域名。查看 .in 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .in 域名。",
      intro:
        ".in 是印度的国家后缀，背后是全球增速最快的互联网市场之一：做印度本地化产品、跨境电商、外包与开发者服务，.in 是身份标配。它同时还是英语介词 in，「check.in、log.in、move.in」式的短语域名读起来浑然一体，全球通用的创意玩法。对任何人开放注册、无本地存在要求，价格也在便宜一档，两个字母让整体域名很短。短板：在印度市场之外，.in 的第一联想仍是「印度」，非印度业务用它要靠短语梗撑住语义；印地语系用户拼写英文品牌词的习惯也值得在起名时考虑。定位建议：印度市场业务的主域名，或能把介词 in 读进品牌的全球产品（签到、打卡、入驻类语义尤其贴）。",
      bestFor: ["面向印度市场的产品", "「in」短语创意域名", "签到/打卡/入驻类产品", "跨境与外包服务"],
      namingTips: [
        "「动词 + .in」短语（check.in 式）全球通用",
        "对所有人开放注册，无本地存在要求",
        "非印度业务要靠短语梗撑语义，否则第一联想是印度",
        "价格便宜、两字母极短，性价比高",
      ],
    },
    en: {
      title: ".in Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".in is India's country code and the English preposition \"in\" — for India-market products and phrase domains. See live pricing and naming advice, then hunt available .in names with AI.",
      intro:
        ".in is the country code of India — one of the fastest-growing internet markets on earth — and the default identity for India-localized products, cross-border commerce, and outsourcing or developer services there. It doubles as the English preposition \"in,\" so phrase domains like check.in, log.in or move.in read as one seamless expression, a creative play that travels globally. Registration is open to anyone with no local-presence requirement, pricing sits in the budget tier, and two letters keep domains short. Trade-offs: outside India the first association is still \"India,\" so non-Indian businesses need the phrase pun to carry the meaning; if you do target India, consider how English brand words transliterate for Hindi-first users. Best fit: the primary domain for India-market businesses, or global products whose brand completes an \"in\" phrase — check-in, move-in and onboarding semantics fit especially well.",
      bestFor: ["India-market products", "\"In\" phrase domains", "Check-in / onboarding products", "Cross-border & outsourcing services"],
      namingTips: [
        "\"Verb + .in\" phrases (check.in style) work worldwide",
        "Open registration, no local presence required",
        "Outside India, lean on the phrase pun or the association is \"India\"",
        "Budget pricing and two letters — strong value",
      ],
    },
  },
  world: {
    tld: "world",
    zh: {
      title: ".world 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".world 自带全球化与开放感，适合国际化产品、社区与元宇宙/虚拟世界项目。查看 .world 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .world 域名。",
      intro:
        ".world 是 Identity Digital 旗下的通用新顶级域，语义直白：全球、世界、无边界。做面向国际市场的产品、跨文化社区、旅行与移民服务，或是游戏/元宇宙里的「某某世界」，「品牌 + .world」读起来就是一句口号——hello.world 式的组合甚至自带程序员梗。知名案例如 Polkadot 生态的 polkadot.world 类社区站，以及不少 Web3 项目把 .world 当宇宙观载体。首年促销价常见十几到几十元，但续费会跳到两百元上下，预算上要按续费价核算。库存充裕，常见英文单词大多仍可注册，这是相对 .com 最大的红利。定位建议：品牌词本身含「世界/宇宙/全球」叙事的产品，或想用一个词讲完愿景的团队。",
      bestFor: ["国际化与出海产品", "游戏与虚拟世界/元宇宙", "旅行、移民与跨文化社区", "「xx 世界」式品牌叙事"],
      namingTips: [
        "「名词 + .world」当口号读：coffee.world、maker.world",
        "hello.world 式程序员梗对开发者产品加分",
        "首年便宜续费贵（约 3–10 倍），按续费价做预算",
        "常见单词库存充裕，别急着妥协成造词",
      ],
    },
    en: {
      title: ".world Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".world signals global reach and openness — great for international products, communities and virtual-world projects. See live pricing and naming advice, then hunt available .world names with AI.",
      intro:
        ".world is an Identity Digital new gTLD with self-explanatory semantics: global, borderless, expansive. For products targeting international markets, cross-cultural communities, travel or relocation services, or game/metaverse projects that literally build a \"world,\" a brand + .world domain reads like a slogan — and hello.world even carries a built-in programmer joke. Plenty of Web3 and gaming projects use .world to frame their universe. First-year promos are cheap (often a few dollars) but renewals jump to the $25–30 range, so budget on the renewal price. Inventory is the big win: most dictionary words are still available, which is unheard of on .com. Best fit: brands whose story is inherently about worlds, universes or global reach — teams that want a single word to carry the vision.",
      bestFor: ["International & go-global products", "Games and virtual worlds / metaverse", "Travel, relocation & cross-cultural communities", "\"X world\" brand storytelling"],
      namingTips: [
        "Noun + .world reads like a slogan: coffee.world, maker.world",
        "hello.world-style puns land well with developer audiences",
        "Cheap first year, 3–10x renewal — budget on renewal",
        "Dictionary-word inventory is plentiful; don't settle for a coined name too fast",
      ],
    },
  },
  life: {
    tld: "life",
    zh: {
      title: ".life 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".life 语义温暖，适合健康、生活方式、家庭与个人成长类产品。查看 .life 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .life 域名。",
      intro:
        ".life 是语义最「柔软」的新顶级域之一：健康管理、生活方式品牌、家庭服务、心理与个人成长、保险与养老，凡是和「过好日子」相关的业务，「品牌 + .life」都像一句承诺。它也是内容创作者的好选择——生活方式博客、vlog 站点用 .life 比 .com 更有温度。注册局同为 Identity Digital，RDAP/注册链路成熟。价格结构是典型的新顶级域模式：首年常有一二十元的促销，续费在两百元档，长期持有要按续费算账。库存好，常见生活词汇（sleep、balance、slow 这类）大多可注册。注意 .life 偏 to C 情感向，硬核 B2B 工具用它会显得错位。定位建议：健康与生活方式产品的主域名，或品牌名以 life 结尾时的自然拆分（如 betterlife → better.life）。",
      bestFor: ["健康与养生产品", "生活方式品牌与博客", "家庭、保险与养老服务", "心理与个人成长社区"],
      namingTips: [
        "品牌名以 life 结尾时直接拆分：better.life、simple.life",
        "生活动词/形容词库存充足：slow、calm、bright 类词可入手",
        "情感向 to C 气质强，B2B 工具慎用",
        "首年促销价与续费价差大，按续费价做长期预算",
      ],
    },
    en: {
      title: ".life Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".life has warm, human semantics — ideal for health, lifestyle, family and personal-growth brands. See live pricing and naming advice, then hunt available .life names with AI.",
      intro:
        ".life is one of the warmest new gTLDs: health and wellness, lifestyle brands, family services, mental health and personal growth, insurance and retirement — any business about living well turns brand + .life into a promise. It's also a natural home for creators: a lifestyle blog on .life feels more personal than .com. The registry is Identity Digital, so RDAP and registrar support are mature. Pricing follows the classic new-gTLD pattern: first-year promos around a few dollars, renewals near $25–30, so long-term holders should budget on renewal. Inventory is good — everyday words like sleep, balance or slow are often still available. One caveat: .life is emotionally consumer-facing; a hardcore B2B tool on .life feels off. Best fit: health and lifestyle products, or brands ending in \"life\" that split naturally (betterlife → better.life).",
      bestFor: ["Health & wellness products", "Lifestyle brands and blogs", "Family, insurance & retirement services", "Mental health & personal growth communities"],
      namingTips: [
        "Brands ending in \"life\" split naturally: better.life, simple.life",
        "Everyday lifestyle words (slow, calm, bright) still have inventory",
        "Strongly consumer-emotional — avoid for hardcore B2B tools",
        "Big gap between promo and renewal price — budget on renewal",
      ],
    },
  },
  agency: {
    tld: "agency",
    zh: {
      title: ".agency 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".agency 直接说明「我是一家代理/机构」，适合设计、营销、公关与创意服务公司。查看 .agency 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .agency 域名。",
      intro:
        ".agency 是行业自我介绍式的后缀：设计工作室、营销与增长团队、公关公司、招聘猎头、旅行社——只要商业形态是「机构/代理」，域名后缀本身就完成了一半的自我介绍。对服务型小团队尤其友好：品牌词 + .agency 组合下，客户一眼知道你是干什么的，比在 .com 里挤一个带 studio/media 后缀的长名字干净得多。海外创意圈用得很普遍，不少独立工作室直接用 name.agency 当作品集主站。价格上首年促销常见十几元，续费一百多元，属于新顶级域的中间档。库存极好，几乎任何风格词都能注册到。短板：后缀较长（6 字符），口播时要念清楚；面向国内传统企业客户时认知度一般，建议名片和物料上把完整域名写出来。",
      bestFor: ["设计与创意工作室", "营销、增长与公关公司", "招聘猎头与人力服务", "旅行社与各类代理业务"],
      namingTips: [
        "品牌词 + .agency 自带业务说明，词根可以更抽象大胆",
        "避免再叠加 agency/studio 语义的词根，防止重复（badcase：agencyx.agency）",
        "6 字符后缀偏长，词根尽量短（≤7 字符）保证整体不拖沓",
        "面向国内客户时在物料上写全域名，弥补认知度",
      ],
    },
    en: {
      title: ".agency Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".agency says exactly what you are — built for design, marketing, PR and creative service firms. See live pricing and naming advice, then hunt available .agency names with AI.",
      intro:
        ".agency is a self-introducing TLD: design studios, marketing and growth teams, PR firms, recruiting agencies, travel agencies — if your business is an agency, the suffix does half the positioning for you. It's especially good for small service teams: brand + .agency tells clients instantly what you do, far cleaner than cramming \"studio\" or \"media\" into a long .com. It's widely adopted in the creative world, with many independent shops running their portfolio on name.agency. Pricing sits mid-tier for new gTLDs: promo first years around a few dollars, renewals around $20–25. Inventory is excellent — nearly any style of word is still available. Trade-offs: at six characters the suffix is long, so keep the root short, and spell out the full domain in materials for audiences less familiar with new TLDs.",
      bestFor: ["Design & creative studios", "Marketing, growth & PR firms", "Recruiting & staffing services", "Travel and other agency businesses"],
      namingTips: [
        "Brand + .agency explains the business — the root can be bold and abstract",
        "Don't stack agency/studio semantics in the root (avoid agencyx.agency)",
        "Six-character suffix is long — keep roots ≤7 characters",
        "Write the full domain on materials for audiences new to nTLDs",
      ],
    },
  },
  games: {
    tld: "games",
    zh: {
      title: ".games 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".games 是游戏行业的语义后缀，适合游戏工作室、独立游戏、电竞与游戏媒体。查看 .games 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .games 域名。",
      intro:
        ".games 把行业写进了域名里：游戏工作室官网、独立游戏作品站、电竞战队、游戏媒体与社区，用 .games 一眼即懂。相比单数的 .game（注册局定价极高，续费常上千元），复数 .games 价格亲民得多——首年百元级、续费一两百元，是游戏行业里性价比最高的语义后缀。海外案例不少：Epic 旗下产品页、众多 Steam 独立开发者的作品集都在用 .games。命名上它特别适合「工作室名 + .games」与「游戏名 + .games」两种形态，词根不需要再解释行业属性，可以专注表达世界观或风格。库存良好，游戏语感的词（pixel、quest、arcade 类）大多可注册。注意区分：做单款重度品牌可能仍需要拿下 .com 防御，社区与作品集则 .games 可以直接当主域名。",
      bestFor: ["游戏工作室官网", "独立游戏与作品集", "电竞战队与赛事", "游戏媒体与社区"],
      namingTips: [
        "工作室名/游戏名 + .games 即成品，词根专注世界观",
        "比单数 .game 便宜一个数量级，预算有限选复数",
        "pixel/quest/arcade 类游戏语感词库存充足",
        "重度单品牌建议同时防御 .com，社区可直接主用 .games",
      ],
    },
    en: {
      title: ".games Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".games puts the industry in the domain — for game studios, indie games, esports and gaming media. See live pricing and naming advice, then hunt available .games names with AI.",
      intro:
        ".games writes the industry into the address: studio sites, indie game portfolios, esports teams, gaming media and communities all read instantly on .games. Unlike the singular .game — premium-priced by its registry with renewals often in the hundreds of dollars — the plural .games is affordable: roughly $15–20 first year and $20–25 renewal, making it the best-value semantic TLD in gaming. Adoption is real, from publisher product pages to countless indie developers' portfolio sites. It shines in two shapes: studio-name + .games and game-title + .games — the suffix explains the industry, freeing the root to express your world and style. Inventory is good; gaming-flavored words (pixel, quest, arcade) are largely available. One nuance: a flagship single-game brand may still want the .com defensively, but for communities and portfolios .games works as the primary domain.",
      bestFor: ["Game studio websites", "Indie games & portfolios", "Esports teams & events", "Gaming media & communities"],
      namingTips: [
        "Studio or title + .games is complete — spend the root on your world",
        "An order of magnitude cheaper than singular .game",
        "Gaming-flavored words (pixel, quest, arcade) still available",
        "Flagship single-game brands: also grab the .com defensively",
      ],
    },
  },
  email: {
    tld: "email",
    zh: {
      title: ".email 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".email 语义唯一指向邮件，适合邮件服务、营销工具与通讯类产品。查看 .email 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .email 域名。",
      intro:
        ".email 是语义最聚焦的新顶级域之一：邮件收发服务、邮件营销与自动化工具、newsletter 平台、反垃圾与送达率服务，用 .email 等于把产品类目写在门牌上。开发者与 SaaS 圈接受度不错——不少邮件 API、临时邮箱和 newsletter 工具用 name.email 当主站或文档站。它还有一个独特玩法：产品的「联系我们」或状态页可以放在 contact.email、status.email 这类语义直白的域名上。价格首年二三十元、续费一百多元，中间档。库存很好，邮件生态的词根（send、inbox、reply 类）多数可注册。短板同样明显：语义太窄，业务一旦超出邮件范畴，域名会变成束缚；建议只在产品核心确定长期围绕邮件时选它。词根避免再含 mail/email，防止 sendmail.email 式冗余。",
      bestFor: ["邮件服务与邮件 API", "邮件营销与自动化工具", "Newsletter 平台", "送达率与反垃圾服务"],
      namingTips: [
        "词根别再含 mail/email，避免 sendmail.email 式冗余",
        "send/inbox/reply 类动词词根 + .email 读起来像功能说明",
        "语义极窄：业务可能扩展出邮件范畴就别选",
        "首年便宜续费贵，按续费价做预算",
      ],
    },
    en: {
      title: ".email Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".email means exactly one thing — perfect for email services, marketing tools and messaging products. See live pricing and naming advice, then hunt available .email names with AI.",
      intro:
        ".email is one of the most focused new gTLDs: email services, marketing automation, newsletter platforms, deliverability and anti-spam tools — the TLD puts your product category on the door. Developer and SaaS adoption is solid, with email APIs, disposable-inbox tools and newsletter products running on name.email as their main or docs site. It also enables a unique pattern: semantically literal domains like contact.email or status.email for a product's touchpoints. Pricing is mid-tier — a few dollars first year, around $20 renewal. Inventory is strong; email-ecosystem roots (send, inbox, reply) are mostly available. The flip side is the narrowness: if your business ever outgrows email, the domain becomes a constraint — choose it only when email is the long-term core. And keep mail/email out of the root to avoid sendmail.email-style redundancy.",
      bestFor: ["Email services & email APIs", "Email marketing & automation", "Newsletter platforms", "Deliverability & anti-spam tools"],
      namingTips: [
        "Keep mail/email out of the root — avoid sendmail.email redundancy",
        "Verb roots (send, inbox, reply) + .email read like a feature statement",
        "Very narrow semantics — skip it if the business may outgrow email",
        "Cheap first year, pricier renewal — budget on renewal",
      ],
    },
  },
  network: {
    tld: "network",
    zh: {
      title: ".network 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".network 适合网络基础设施、去中心化协议与社群网络类产品。查看 .network 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .network 域名。",
      intro:
        ".network 的语义横跨两个热门领域：一是技术意义上的网络——CDN、VPN、节点服务、监控与网络安全工具；二是社会意义上的网络——行业社群、人脉平台、播客与媒体联盟。近几年它在区块链圈尤其流行：大量公链与协议把官网放在 name.network 上（如多个知名 L1/L2 项目），因为「协议即网络」的叙事天然契合。相比 .net 的老牌通用，.network 语义更完整、更像一句话——mesh.network 读出来就是产品定位。价格首年常见十几二十元、续费一百多元。库存充足，连很多 .net 下早已绝迹的短词在 .network 下仍可注册。短板是后缀长（7 字符），整体域名容易偏长，词根务必控制在短词。定位建议：基础设施与协议类项目的主域名，或行业社群网络的品牌载体。",
      bestFor: ["网络基础设施与节点服务", "区块链协议与公链", "行业社群与人脉平台", "媒体与播客联盟"],
      namingTips: [
        "「协议/产品词 + .network」自带定位：mesh.network、relay.network",
        "区块链项目主流选择之一，叙事契合「协议即网络」",
        "后缀 7 字符偏长，词根控制在 ≤6 字符",
        ".net 下绝迹的短词这里常有货，先查再造词",
      ],
    },
    en: {
      title: ".network Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".network fits infrastructure, decentralized protocols and community networks. See live pricing and naming advice, then hunt available .network names with AI.",
      intro:
        ".network spans two hot territories: technical networks — CDNs, VPNs, node services, monitoring and security tools — and social networks — industry communities, professional platforms, podcast and media collectives. It's become especially popular in crypto, where many chains and protocols run their site on name.network because \"the protocol is the network\" fits the narrative perfectly. Compared with the venerable .net, .network is a complete word — mesh.network reads as a positioning statement, not an abbreviation. Pricing runs a few dollars first year and around $20 renewal. Inventory is generous: short words long extinct on .net are often still available on .network. The trade-off is length — seven characters of suffix means the root must stay short. Best fit: infrastructure and protocol projects, or the brand home of a professional community network.",
      bestFor: ["Network infrastructure & node services", "Blockchain protocols & chains", "Industry communities & professional networks", "Media and podcast collectives"],
      namingTips: [
        "Product word + .network states the positioning: mesh.network, relay.network",
        "A mainstream pick for blockchain protocols — the narrative fits",
        "Seven-character suffix — keep roots ≤6 characters",
        "Short words gone on .net are often available here; check before coining",
      ],
    },
  },
  digital: {
    tld: "digital",
    zh: {
      title: ".digital 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".digital 适合数字化转型服务、数字营销机构与一切「数字化」叙事的产品。查看 .digital 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .digital 域名。",
      intro:
        ".digital 把「数字化」写进了域名：数字化转型咨询、数字营销与广告机构、数字产品工作室、线上教育与数字藏品平台，用 .digital 等于把行业标签挂在门口。它在海外机构圈接受度很高——大量 digital agency 直接用 name.digital 当官网，省掉了在 .com 里挤 digital 一词的长域名。注册局是 Identity Digital，RDAP/注册链路成熟，主流注册商都支持。价格是典型新顶级域结构：首年常见十几到三十元促销，续费两百多元，长期持有按续费核算。库存充裕，行业词与风格词大多可注册。短板：后缀 7 字符偏长，且语义与「数字」强绑定，传统实体业务用它会错位。定位建议：数字服务机构的主域名，或品牌名本身含 digital 时的自然拆分（如 godigital → go.digital）。",
      bestFor: ["数字化转型与咨询服务", "数字营销与广告机构", "数字产品工作室", "线上教育与数字内容平台"],
      namingTips: [
        "品牌名含 digital 时直接拆分：go.digital、we.digital",
        "机构类词根 + .digital 自带业务说明，词根可更大胆",
        "后缀 7 字符偏长，词根控制在 ≤6 字符",
        "首年促销续费贵，按续费价做长期预算",
      ],
    },
    en: {
      title: ".digital Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".digital fits digital-transformation services, marketing agencies and anything with a digital story. See live pricing and naming advice, then hunt available .digital names with AI.",
      intro:
        ".digital writes the industry into the address: digital-transformation consultancies, marketing and ad agencies, digital product studios, online education and digital-collectible platforms all read instantly on it. Adoption among agencies is real — many run their site on name.digital rather than cramming \"digital\" into a long .com. The registry is Identity Digital, so RDAP and registrar support are mature. Pricing follows the classic new-gTLD pattern: promo first years of a few dollars, renewals in the $30–40 range — budget on the renewal. Inventory is generous, with most industry and style words still available. Trade-offs: the seven-character suffix is long, and the semantics bind you to \"digital\" — a poor fit for traditional physical businesses. Best fit: the primary domain for digital service firms, or a natural split when the brand contains the word (godigital → go.digital).",
      bestFor: ["Digital transformation & consulting", "Digital marketing & ad agencies", "Digital product studios", "Online education & digital content"],
      namingTips: [
        "Brands containing \"digital\" split naturally: go.digital, we.digital",
        "Agency-style roots + .digital explain the business — the root can be bold",
        "Seven-character suffix — keep roots ≤6 characters",
        "Cheap first year, pricier renewal — budget on renewal",
      ],
    },
  },
  media: {
    tld: "media",
    zh: {
      title: ".media 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".media 是内容与媒体行业的语义后缀，适合媒体公司、播客、视频团队与内容工作室。查看 .media 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .media 域名。",
      intro:
        ".media 一词覆盖了整个内容行业：新媒体公司、播客网络、视频制作团队、内容营销工作室、独立创作者联盟，「品牌 + .media」读出来就是公司全称。相比在 .com 里注册 xxmedia 的长域名，直接用 xx.media 更短更现代，这也是海外大量制作公司与播客网络的选择。注册局 Identity Digital，链路成熟。价格属于新顶级域的中高档：首年常见几十到一百元，续费两百多元。库存良好，风格词、地名词、题材词大多可注册。命名上它极适合「题材/风格 + .media」的组合——词根说内容方向，后缀说行业形态。短板：语义绑定内容行业，工具类 SaaS 用它会让用户误以为是媒体；另外 media 一词在国内偏机构语感，个人博客用 .blog/.site 可能更贴。定位建议：内容公司与制作团队的主域名，或品牌名以 media 结尾时的自然拆分。",
      bestFor: ["新媒体与内容公司", "播客网络与视频团队", "内容营销与制作工作室", "创作者联盟与内容品牌"],
      namingTips: [
        "品牌名以 media 结尾时直接拆分：bright.media、north.media",
        "题材/风格词 + .media 自带定位：true.media、slow.media",
        "工具型 SaaS 慎用，易被误认为媒体公司",
        "首年与续费价差明显，按续费价核算",
      ],
    },
    en: {
      title: ".media Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".media is the content industry's suffix — for media companies, podcasts, video teams and content studios. See live pricing and naming advice, then hunt available .media names with AI.",
      intro:
        ".media covers the whole content industry in one word: new-media companies, podcast networks, video production teams, content-marketing studios and creator collectives all read naturally as brand + .media — the domain is the company name. Compared with registering a long xxmedia .com, xx.media is shorter and more modern, which is exactly why many production companies and podcast networks abroad chose it. The registry is Identity Digital with mature RDAP support. Pricing sits mid-to-upper tier for new gTLDs: roughly $10–15 first year and $35–40 renewal. Inventory is good — style words, place words and topic words are largely available. It shines as topic/style + .media: the root states the content direction, the suffix states the industry. Trade-offs: the semantics bind you to content — a SaaS tool on .media risks being mistaken for a media company. Best fit: primary domains for content companies and production teams, or a natural split for brands ending in \"media\".",
      bestFor: ["New-media & content companies", "Podcast networks & video teams", "Content marketing & production studios", "Creator collectives & content brands"],
      namingTips: [
        "Brands ending in \"media\" split naturally: bright.media, north.media",
        "Topic/style word + .media states the positioning: true.media, slow.media",
        "Avoid for SaaS tools — users may assume you're a media company",
        "Noticeable promo-to-renewal gap — budget on renewal",
      ],
    },
  },
  group: {
    tld: "group",
    zh: {
      title: ".group 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".group 适合集团公司、控股企业与多品牌矩阵的母品牌官网。查看 .group 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .group 域名。",
      intro:
        ".group 的气质天然偏企业：集团公司、控股平台、多品牌矩阵的母品牌，「品牌 + .group」读出来就是「某某集团」，比 xxgroup.com 的长域名干净得多。海外不少家族企业与投资集团直接用 name.group 当集团官网，旗下品牌再各自持有独立域名。它也适合另一个方向：社群与兴趣小组——微信群、Telegram 群、学习小组的落地页用 .group 语义同样自然。注册局 Identity Digital。价格在新顶级域里属于友好档：首年几十元，续费一百多元，价差比多数新顶级域小。库存很好，姓氏、行业词、地名词大多可注册。短板：后缀 5 字符适中但认知度在国内一般，正式集团用途建议物料写全域名。定位建议：集团/控股母品牌官网、多品牌企业的品牌枢纽页，或社群组织的落地页。",
      bestFor: ["集团与控股公司官网", "多品牌矩阵的母品牌", "家族企业与投资集团", "社群与兴趣小组落地页"],
      namingTips: [
        "品牌名以 group 结尾时直接拆分：nova.group、lee.group",
        "姓氏 + .group 适合家族企业与投资集团",
        "续费价差比多数新顶级域小，适合长期持有",
        "国内正式场合建议物料写全域名，弥补认知度",
      ],
    },
    en: {
      title: ".group Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".group suits holding companies, multi-brand parents and community groups. See live pricing and naming advice, then hunt available .group names with AI.",
      intro:
        ".group has a naturally corporate feel: holding companies, conglomerates and the parent brand of a multi-brand portfolio read as brand + .group — literally \"the X Group\" — far cleaner than a long xxgroup.com. Family businesses and investment groups abroad run their corporate site on name.group while each subsidiary keeps its own domain. It also works in a second direction: communities and interest groups — a landing page for a study group, club or messaging community reads just as naturally. The registry is Identity Digital. Pricing is friendly for a new gTLD: several dollars first year, renewals under $20, with a smaller promo-to-renewal gap than most peers — good for long-term holding. Inventory is strong: surnames, industry words and place names are largely available. Trade-off: recognition is still growing, so spell out the full domain on formal materials. Best fit: corporate parent sites, brand hub pages, and community landing pages.",
      bestFor: ["Holding & group company websites", "Parent brands of multi-brand portfolios", "Family businesses & investment groups", "Community and interest-group pages"],
      namingTips: [
        "Brands ending in \"group\" split naturally: nova.group, lee.group",
        "Surname + .group fits family businesses and investment firms",
        "Smaller renewal gap than most new gTLDs — good for long-term holding",
        "Spell out the full domain on formal materials for recognition",
      ],
    },
  },
  center: {
    tld: "center",
    zh: {
      title: ".center 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".center 适合帮助中心、资源中心、培训与服务中心类站点。查看 .center 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .center 域名。",
      intro:
        ".center 的语义是「中心/枢纽」：帮助中心、资源下载中心、培训与考试中心、医疗与健身中心、社区服务中心，凡是业务形态叫「某某中心」的，域名后缀直接完成命名。它有一个对开发者友好的独特用法：产品的支持站、文档站、状态页可以放在 help.center、docs.center 这类语义直白的域名上，与主域名分工清晰。注册局 Identity Digital，价格是新顶级域里的亲民档：首年十几二十元，续费一百多元。库存极好，行业词、地名词、功能词几乎随便挑。短板：拼写上美式 center 与英式 centre 有差异，面向英联邦用户时要考虑防御性注册或明确物料拼写；语义偏「场所/枢纽」，抽象品牌用它不加分。定位建议：实体中心类机构的官网、产品的支持/资源子站，或「聚合 + 分发」形态的内容枢纽。",
      bestFor: ["帮助中心与文档站", "培训、考试与服务中心", "医疗、健身等实体中心", "资源聚合与内容枢纽"],
      namingTips: [
        "功能词 + .center 语义直白：help.center、data.center",
        "实体机构直接用业务词：yoga.center、test.center",
        "注意 center/centre 拼写差异，必要时防御注册",
        "价格亲民库存极好，常见词优先于造词",
      ],
    },
    en: {
      title: ".center Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".center fits help centers, resource hubs, training and service centers. See live pricing and naming advice, then hunt available .center names with AI.",
      intro:
        ".center means hub: help centers, resource and download hubs, training and testing centers, medical and fitness centers, community service centers — if your business is called \"the X Center,\" the suffix finishes the name for you. It also has a developer-friendly pattern: a product's support site, docs or status page reads perfectly on semantically literal domains like help.center or docs.center, cleanly separated from the main domain. The registry is Identity Digital, and pricing sits in the budget tier: a few dollars first year, renewals around $20. Inventory is excellent — industry words, place words and function words are nearly all available. Trade-offs: mind the center/centre spelling split for Commonwealth audiences (consider a defensive registration), and the \"place/hub\" semantics add little to abstract brands. Best fit: physical center-style institutions, product support/resource subdomains, and aggregation-style content hubs.",
      bestFor: ["Help centers & documentation sites", "Training, testing & service centers", "Medical, fitness & physical centers", "Resource aggregation & content hubs"],
      namingTips: [
        "Function word + .center is self-explanatory: help.center, data.center",
        "Physical institutions can use the business word directly: yoga.center",
        "Mind the center/centre spelling split — register defensively if needed",
        "Budget pricing and deep inventory — prefer real words over coinages",
      ],
    },
  },
  works: {
    tld: "works",
    zh: {
      title: ".works 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".works 语义双关「作品」与「能用」，适合工作室、作品集与实干型工具产品。查看 .works 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .works 域名。",
      intro:
        ".works 是少数自带双关的后缀：既是「作品/工坊」（design works、iron works 的传统用法），也是「it works（能用）」的口语肯定。这让它同时适合两类用户：一是工作室与作品集——设计工坊、木工坊、独立开发者的项目集，name.works 读起来像老字号招牌；二是实干型工具产品——「品牌 + .works」暗示「这东西真的能用」，对开发者工具与自动化产品是天然的口播广告（如 zapier 式的自动化工具用 flow.works）。注册局 Identity Digital。价格首年十几二十元、续费两百多元，典型新顶级域结构。库存很好，动词、工艺词、工具词大多可注册。短板：语义偏具体执行，抽象品牌与金融类产品用它不贴；后缀 5 字符适中但复数 s 口播时要念清。定位建议：工作室/工坊官网、个人作品集、以及强调「可靠能用」的工具产品。",
      bestFor: ["设计与手作工作室", "个人与团队作品集", "开发者工具与自动化产品", "工程与制造类品牌"],
      namingTips: [
        "「品牌 + .works」自带「能用」暗示：flow.works、ship.works",
        "工艺词/材料词适合工坊：wood.works、pixel.works",
        "口播时注意复数 s，物料写全域名",
        "首年便宜续费贵，按续费价做预算",
      ],
    },
    en: {
      title: ".works Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".works puns on \"works of craft\" and \"it works\" — great for studios, portfolios and dependable tools. See live pricing and naming advice, then hunt available .works names with AI.",
      intro:
        ".works is one of the few TLDs with a built-in double meaning: the traditional \"works\" of craftsmanship (design works, iron works) and the colloquial \"it works.\" That serves two audiences at once. Studios and portfolios — design shops, maker spaces, indie developers' project collections — read like a heritage signboard on name.works. And pragmatic tool products get a free slogan: brand + .works implies the thing actually works, a natural word-of-mouth hook for developer tools and automation products (think flow.works for an automation tool). The registry is Identity Digital. Pricing is the classic pattern: a few dollars first year, renewals in the $30 range. Inventory is strong — verbs, craft words and tool words are largely available. Trade-offs: the semantics are concrete and hands-on, a poor match for abstract or financial brands, and the plural \"s\" needs care when spoken. Best fit: studio and workshop sites, portfolios, and tools that stake their brand on reliability.",
      bestFor: ["Design & craft studios", "Personal and team portfolios", "Developer tools & automation products", "Engineering and manufacturing brands"],
      namingTips: [
        "Brand + .works implies \"it works\": flow.works, ship.works",
        "Craft and material words suit workshops: wood.works, pixel.works",
        "Mind the plural \"s\" when spoken — spell out the domain on materials",
        "Cheap first year, pricier renewal — budget on renewal",
      ],
    },
  },
  zone: {
    tld: "zone",
    zh: {
      title: ".zone 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".zone 语义是「地带/专区」，适合游戏社区、主题站与开发者试验场。查看 .zone 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .zone 域名。",
      intro:
        ".zone 的语义是「地带/专区/领域」：游戏社区（战区、竞技区）、主题内容站（某某专区）、粉丝站、开发者的试验场与沙盒项目，用 .zone 都非常自然——「主题 + .zone」读出来就是「某某地带」。它在技术圈还有一层亲切感：DNS 里的 zone 文件让 dns.zone、edge.zone 这类域名对开发者自带梗。知名案例如 CNCF 生态里不少工具的演示站。注册局 Identity Digital。价格首年十几二十元、续费两百元上下。库存极好，主题词、游戏词、技术词几乎随便挑。短板：语义偏「围起来的区域」，正式企业官网用它显得随意；「zone」在中文语境里认知度一般，面向国内大众的产品要斟酌。定位建议：游戏与兴趣社区、主题内容站、开发者 side project 与沙盒环境——在这些场景里 .zone 比 .com 更有氛围感。",
      bestFor: ["游戏社区与竞技站", "主题内容与粉丝专区", "开发者试验场与沙盒", "兴趣圈子与主题活动页"],
      namingTips: [
        "主题词 + .zone 即「某某地带」：war.zone、fan.zone",
        "DNS zone 的技术梗对开发者产品加分：dns.zone、edge.zone",
        "正式企业官网慎用，气质偏随意",
        "库存极好价格亲民，适合 side project 批量注册",
      ],
    },
    en: {
      title: ".zone Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".zone means a dedicated space — great for gaming communities, topic hubs and developer playgrounds. See live pricing and naming advice, then hunt available .zone names with AI.",
      intro:
        ".zone means a dedicated space or territory: gaming communities (battle zones, arenas), topic hubs, fan sites and developer playgrounds all read naturally — topic + .zone literally names the place. It carries an extra wink for technical audiences: DNS zone files make domains like dns.zone or edge.zone an insider joke, and plenty of developer tools run demos on .zone. The registry is Identity Digital. Pricing runs a few dollars first year with renewals around $30. Inventory is excellent — theme words, gaming words and tech words are nearly all available. Trade-offs: the \"fenced-off area\" semantics feel casual for a formal corporate site, and recognition among mainstream audiences is still growing. Best fit: gaming and interest communities, topic content hubs, side projects and sandbox environments — places where .zone brings more atmosphere than a generic .com ever could.",
      bestFor: ["Gaming communities & arenas", "Topic hubs & fan zones", "Developer playgrounds & sandboxes", "Interest circles & event pages"],
      namingTips: [
        "Topic + .zone names the place: war.zone, fan.zone",
        "The DNS-zone pun lands with developers: dns.zone, edge.zone",
        "Feels casual — think twice for formal corporate sites",
        "Deep inventory and budget pricing — great for side projects",
      ],
    },
  },
  news: {
    tld: "news",
    zh: {
      title: ".news 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".news 语义直白「新闻/资讯」，适合媒体、行业资讯站与 newsletter。查看 .news 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .news 域名。",
      intro:
        ".news 是语义最直白的内容类后缀：看到域名就知道这是资讯站。独立媒体、垂直行业资讯（如 ai.news 类的赛道站）、地方新闻、公司新闻中心（brand.news 当官方 newsroom）、以及付费 newsletter 都非常合适——「主题 + .news」本身就是完整的产品名，省掉了在名字里再塞 daily、report 这类词。注册局 Identity Digital，运营稳定。价格首年几美元到十美元、续费 $26 左右（约 ¥190/年），在内容类后缀里属于温和水平。库存好：行业词、地名、赛道词大多可注册。短板：语义强绑定「资讯」，做工具或电商用它会误导用户预期；「新闻」属性也意味着内容更新频率要跟上，挂一个半年不更新的站在 .news 上观感很差。定位建议：真的持续产出资讯内容的站——垂直媒体、行业周报、公司 newsroom，在这些场景 .news 比 .com 更精准。",
      bestFor: ["垂直行业资讯与独立媒体", "付费 newsletter 与行业周报", "公司官方新闻中心（newsroom）", "地方与社区新闻站"],
      namingTips: [
        "行业/主题词 + .news 就是完整站名：ai.news、crypto.news 式命名",
        "地名 + .news 适合地方媒体，认知零成本",
        "品牌 newsroom 用 brand.news，与主站 .com 分工清晰",
        "确保内容会持续更新——.news 挂静态站会伤害信任",
      ],
    },
    en: {
      title: ".news Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".news says exactly what it means — built for media sites, industry news hubs and newsletters. See live pricing and naming advice, then hunt available .news names with AI.",
      intro:
        ".news is the most literal content TLD there is: one glance at the domain and readers know it's a news destination. Independent media, vertical industry coverage (think ai.news-style niche sites), local news, corporate newsrooms (brand.news as the official press hub) and paid newsletters all fit naturally — topic + .news is a complete product name on its own, no need to cram daily or report into the name. The registry is Identity Digital and operations are stable. Pricing runs a few dollars to $10 first year with renewals around $26/yr — moderate for a content TLD. Inventory is good: industry words, place names and niche terms are mostly available. Trade-offs: the semantics are hard-bound to journalism, so tools or shops on .news mislead expectations, and a .news site that hasn't published in six months looks worse than a stale .com. Best fit: sites that genuinely publish — vertical media, industry digests, corporate newsrooms — where .news is more precise than any .com.",
      bestFor: ["Vertical media & independent journalism", "Paid newsletters & industry digests", "Corporate newsrooms", "Local & community news sites"],
      namingTips: [
        "Topic + .news is a complete site name: ai.news, crypto.news",
        "Place + .news works instantly for local media",
        "Use brand.news as a newsroom alongside your .com main site",
        "Commit to publishing — a stale .news site erodes trust fast",
      ],
    },
  },
  tools: {
    tld: "tools",
    zh: {
      title: ".tools 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".tools 语义是「工具集」，适合在线工具站、开发者工具与实用软件。查看 .tools 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .tools 域名。",
      intro:
        ".tools 对工具类产品是量身定做：在线工具站（转换器、生成器、计算器合集）、开发者工具链、设计资源站，「品牌/功能词 + .tools」读出来就是「某某工具箱」。近几年独立开发者做的工具聚合站大量选择它，用户看到 .tools 就知道点进去是拿来干活的，转化路径极短。注册局 Identity Digital。价格首年 $10 上下、续费 $29 左右（约 ¥210/年）。库存很好：功能词（pdf、image、text）、赛道词（seo、dev、ai）大多有货。短板：复数形式暗示「一组工具」，如果产品是单一功能的 SaaS，用 .tools 会显得名不副实；正式企业官网也不适合。定位建议：工具合集站、开发者工具箱、面向创作者的实用套件——名字里不用再出现 tool 字样，后缀已经说明一切。",
      bestFor: ["在线工具合集站", "开发者工具与 CLI 套件", "设计与创作者资源站", "效率与自动化小工具"],
      namingTips: [
        "功能词 + .tools 即是产品名：pdf.tools、seo.tools 式命名",
        "名字里不要再带 tool/toolkit——后缀已经说了",
        "复数语义适合「一组工具」，单一功能 SaaS 慎用",
        "开发者向可用技术栈词：rust.tools、api.tools",
      ],
    },
    en: {
      title: ".tools Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".tools is purpose-built for utility sites, developer toolchains and practical software. See live pricing and naming advice, then hunt available .tools names with AI.",
      intro:
        ".tools is tailor-made for utility products: online tool collections (converters, generators, calculators), developer toolchains and design resource hubs all read perfectly as brand + .tools — literally \"someone's toolbox\". Indie hackers have adopted it heavily for tool aggregator sites because the suffix sets expectations instantly: visitors know they're clicking through to get something done, which keeps the conversion path short. The registry is Identity Digital. Pricing runs around $10 first year with renewals near $29/yr. Inventory is strong — function words (pdf, image, text) and niche words (seo, dev, ai) are widely available. Trade-offs: the plural implies a collection, so a single-feature SaaS on .tools can feel mislabeled, and it's too casual for a formal corporate site. Best fit: tool collections, developer toolboxes and creator utility suites — and you can drop \"tool\" from the name itself, because the suffix already says it.",
      bestFor: ["Online tool collections", "Developer tools & CLI suites", "Design & creator resource hubs", "Productivity & automation utilities"],
      namingTips: [
        "Function word + .tools is the product name: pdf.tools, seo.tools",
        "Never repeat tool/toolkit in the name — the suffix says it",
        "The plural implies a collection; single-feature SaaS may misfit",
        "Stack words work for dev audiences: rust.tools, api.tools",
      ],
    },
  },
  run: {
    tld: "run",
    zh: {
      title: ".run 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".run 语义双关「运行」与「跑步」，适合开发者运行时/部署产品与运动健身品牌。查看 .run 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .run 域名。",
      intro:
        ".run 自带双关：技术圈读作「运行」——运行时、部署平台、沙盒环境、demo 站，「品牌 + .run」暗示「点开就能跑」，知名先例如 Google Cloud Run 的官方域名 cloud.run 与 val.town 类的代码运行平台；运动圈读作「跑步」——跑团、马拉松赛事、跑步装备与训练计划，语义同样零解释成本。注册局 Identity Digital。价格是本站收录里最亲民的一档：首年 $4 左右、续费 $22 上下（约 ¥160/年），做 side project 几乎无负担。库存极好，动词、品牌词、赛事名大多可注册。短板：3 字符后缀简短好记，但双关也意味着模糊——不看内容猜不出你是代码平台还是跑步社区；正式企业站不适合。定位建议：开发者的部署/运行时产品、在线 demo 与 playground，以及跑步赛事与社群——两个圈子里它都是气质后缀。",
      bestFor: ["运行时与部署平台（cloud.run 式）", "在线 demo 与代码 playground", "跑团、马拉松与训练计划", "运动装备与健身品牌"],
      namingTips: [
        "技术产品用「品牌 + .run」暗示即点即跑：app.run、demo.run",
        "跑步场景用赛事/城市名：cityname.run 是天然赛事域名",
        "3 字符后缀本身短，前缀可以稍长仍好记",
        "双关是特色也是模糊点——落地页第一屏要立刻说清你是谁",
      ],
    },
    en: {
      title: ".run Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".run puns on executing code and running sports — great for runtimes, deploy platforms and running brands. See live pricing and naming advice, then hunt available .run names with AI.",
      intro:
        ".run carries a built-in double meaning. To developers it says execute: runtimes, deploy platforms, sandboxes and live demos — brand + .run implies \"click and it runs\", with Google's cloud.run as the flagship precedent. To athletes it says running: race events, running clubs, gear and training plans read just as naturally. The registry is Identity Digital. Pricing is among the friendliest we track: around $4 first year with renewals near $22/yr, so side projects carry almost no cost. Inventory is excellent — verbs, brand words and event names are mostly open. Trade-offs: the 3-character suffix is short and memorable, but the pun cuts both ways — without seeing the content, nobody knows if you're a code platform or a running community; it's also too playful for formal corporate sites. Best fit: developer deploy/runtime products, online demos and playgrounds, plus race events and running communities — it's a personality suffix in both worlds.",
      bestFor: ["Runtimes & deploy platforms (cloud.run style)", "Live demos & code playgrounds", "Running clubs, races & training plans", "Sports gear & fitness brands"],
      namingTips: [
        "For dev products, brand + .run implies instant execution: app.run, demo.run",
        "For sports, city or event names work: cityname.run is a natural race domain",
        "The suffix is only 3 chars — a slightly longer prefix stays memorable",
        "The pun is charming but ambiguous — clarify who you are above the fold",
      ],
    },
  },
  codes: {
    tld: "codes",
    zh: {
      title: ".codes 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".codes 语义覆盖「代码」与「优惠码」，适合开发者个人站、代码产品与折扣码聚合站。查看 .codes 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .codes 域名。",
      intro:
        ".codes 一个后缀吃两个赛道：一是「代码」——开发者个人站（name.codes 当作品集在海外开发者圈是成熟玩法）、代码教学、开源项目展示；二是「优惠码/兑换码」——折扣码聚合站、游戏兑换码、promo codes 站点，这类站的流量词本身就带 codes。注册局 Identity Digital。价格结构要特别注意：首年 $5 左右很便宜，但续费约 $57/年（约 ¥410），是本站收录里续费最贵的新顶级域之一，长期持有成本接近 .io。库存很好，人名、技术词、赛道词大多可注册。短板：除了续费贵，复数形式对单一产品也稍显泛化；面向国内大众的认知度低。定位建议：开发者个人品牌站（name.codes 的签名感很强）、优惠码内容站这类能直接吃语义红利的项目——但注册前务必想清楚续费成本，只打算玩一年的 side project 反而合适，长期主站建议先比价。",
      bestFor: ["开发者个人站与作品集（name.codes）", "优惠码与兑换码聚合站", "代码教学与开源项目展示", "编程社区与黑客松活动页"],
      namingTips: [
        "人名/ID + .codes 是开发者个人品牌成熟玩法",
        "优惠码站直接用品类词：game.codes、travel.codes 式命名",
        "续费约 $57/年是硬成本——注册前按 3 年总价算账",
        "面向国内大众认知度低，主打海外或开发者圈更稳",
      ],
    },
    en: {
      title: ".codes Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".codes covers both source code and promo codes — great for developer portfolios, code products and coupon sites. See live pricing and naming advice, then hunt available .codes names with AI.",
      intro:
        ".codes serves two audiences with one suffix. For developers it means source code: name.codes is an established pattern for personal portfolio sites in the dev community, and it suits coding education and open-source showcases. For commerce it means promo codes: coupon aggregators, game redemption codes and discount sites — niches where \"codes\" is literally the search keyword. The registry is Identity Digital. Watch the pricing structure carefully: around $5 for the first year, but renewals run about $57/yr — one of the priciest renewals among new TLDs we track, approaching .io territory for long-term holding. Inventory is strong: personal names, tech words and niche terms are mostly open. Trade-offs: beyond the renewal cost, the plural feels generic for a single product, and mainstream recognition is limited. Best fit: developer personal brands (name.codes has real signature energy) and coupon content sites that ride the semantics directly — but do the 3-year math before registering; a one-year side project is fine, a long-term main site deserves a price comparison first.",
      bestFor: ["Developer portfolios (name.codes)", "Coupon & promo code aggregators", "Coding education & open-source showcases", "Programming communities & hackathon pages"],
      namingTips: [
        "Name/handle + .codes is the established developer-portfolio pattern",
        "Coupon sites should use category words: game.codes, travel.codes",
        "Renewals near $57/yr are the real cost — budget 3 years upfront",
        "Recognition skews to dev and deal-hunter circles — lean into them",
      ],
    },
  },
  company: {
    tld: "company",
    zh: {
      title: ".company 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".company 语义是「公司」，适合中小企业官网、控股主体与品牌旗下公司页。查看 .company 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .company 域名。",
      intro:
        ".company 把「公司」两个字直接写进域名：中小企业官网、工作室的正式主体页、控股结构里的母公司站（brand.company 挂公司信息，产品各自用产品域名）、以及「the XX company」式的复古品牌命名（美国不少精品品牌喜欢自称 The Coffee Company 这种格式），用它都很顺。注册局 Identity Digital。价格是本站收录里最便宜的一档：首年 $3 左右、续费约 $17/年（约 ¥125），比 .com 续费还便宜，作为长期持有的企业域名成本极低。库存极好，公司名、姓氏、行业词几乎随便注册。短板：后缀 7 字符偏长，口播时不如 .com 顺；在中文语境「.company」认知度一般，面向国内客户的企业更常选 .com/.cn。定位建议：海外中小企业与工作室官网、集团/控股主体页、以及「The XX Company」式品牌——预算敏感又要正式感时，它是被低估的选择。",
      bestFor: ["中小企业与工作室官网", "集团母公司与控股主体页", "「The XX Company」式品牌", "企业信息与招聘页"],
      namingTips: [
        "公司名 + .company 语义完整：acme.company 读作「Acme 公司」",
        "「The XX Company」式品牌天然匹配：coffee.company",
        "续费比 .com 还便宜，适合长期持有的正式主体页",
        "7 字符偏长，口播场景多的品牌要权衡",
      ],
    },
    en: {
      title: ".company Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".company literally says what you are — great for SMB websites, holding entities and \"The X Company\" brands. See live pricing and naming advice, then hunt available .company names with AI.",
      intro:
        ".company writes your legal nature straight into the domain: small-business websites, studios wanting a formal entity page, holding structures (brand.company for corporate info while products live on their own domains), and retro \"The X Company\" branding — a format plenty of boutique brands love — all read naturally. The registry is Identity Digital. Pricing is among the cheapest we track: around $3 first year and roughly $17/yr renewal — cheaper than a .com renewal — making it one of the lowest-cost domains for long-term corporate holding. Inventory is superb: company names, surnames and industry words are nearly all open. Trade-offs: at 7 characters the suffix is on the long side and less punchy than .com when spoken aloud, and mainstream recognition still trails the classics. Best fit: SMB and studio websites, group/holding entity pages, and \"The X Company\" brands — an underrated pick when you want formality on a budget.",
      bestFor: ["SMB & studio websites", "Group & holding entity pages", "\"The X Company\" style brands", "Corporate info & careers pages"],
      namingTips: [
        "Company name + .company completes the sentence: acme.company",
        "\"The X Company\" brands map perfectly: coffee.company",
        "Renews cheaper than .com — great for long-term corporate holding",
        "7 characters is long — weigh it if word-of-mouth matters",
      ],
    },
  },
  wiki: {
    tld: "wiki",
    zh: {
      title: ".wiki 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".wiki 语义是「百科/知识库」，适合产品文档、粉丝百科与团队知识库。查看 .wiki 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .wiki 域名。",
      intro:
        ".wiki 借维基百科之名把「知识库」语义焊死在后缀上：产品文档站（docs 的另一种选择）、游戏/动漫粉丝百科（fandom 式社区自建站）、开源项目 wiki、团队内部知识库对外版，「主题 + .wiki」读出来就是「某某百科」，用户预期精准——点进去就是查资料的。注册局 Top Level Design（rdap.nic.wiki），是本批里少数非 Identity Digital 的后缀。价格首年 $2 左右极便宜、续费约 $26/年（约 ¥190）。库存很好：游戏名、产品名、领域词大多可注册。短板：语义强绑定「协作百科/资料站」，拿来做产品官网或电商会错位；「wiki」一词自带 UGC 联想，纯官方单向输出的文档站用它要接受这层预期。定位建议：粉丝百科、游戏攻略库、开源项目文档、垂直领域知识库——内容型站点里它是少数「后缀即产品定位」的选择。",
      bestFor: ["游戏与动漫粉丝百科", "产品文档与开源项目 wiki", "垂直领域知识库", "团队知识库对外版"],
      namingTips: [
        "主题 + .wiki 就是站名：gamename.wiki、topic.wiki",
        "游戏/IP 名注册要避开商标风险，粉丝站注明非官方",
        "文档站可用 product.wiki 与主站分工",
        "「wiki」自带协作联想——纯官方文档要在页面说明定位",
      ],
    },
    en: {
      title: ".wiki Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".wiki means knowledge base — built for product docs, fan wikis and team knowledge hubs. See live pricing and naming advice, then hunt available .wiki names with AI.",
      intro:
        ".wiki borrows Wikipedia's mindshare to weld \"knowledge base\" onto the suffix itself: product documentation (a fresh alternative to docs subdomains), game and fandom wikis (the self-hosted answer to Fandom.com), open-source project wikis and public team knowledge bases all read as topic + .wiki — literally \"the encyclopedia of X\". Visitor expectations are laser-precise: they're coming to look something up. The registry is Top Level Design (rdap.nic.wiki), one of the few non-Identity-Digital suffixes in this batch. Pricing runs about $2 first year with renewals near $26/yr. Inventory is strong: game names, product names and domain words are mostly open. Trade-offs: the semantics are hard-bound to reference content, so product homepages or shops on .wiki feel misplaced, and the word carries a UGC/collaboration connotation that a strictly official docs site should be ready to manage. Best fit: fan wikis, game guide hubs, open-source docs and vertical knowledge bases — one of the rare suffixes where the TLD is the product positioning.",
      bestFor: ["Game & fandom wikis", "Product docs & open-source wikis", "Vertical knowledge bases", "Public team knowledge hubs"],
      namingTips: [
        "Topic + .wiki is the site name: gamename.wiki, topic.wiki",
        "Watch trademarks on game/IP names — label fan sites unofficial",
        "Use product.wiki for docs, cleanly split from the main site",
        "\"Wiki\" implies collaboration — clarify if it's official-only docs",
      ],
    },
  },
  blog: {
    tld: "blog",
    zh: {
      title: ".blog 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".blog 语义直白，是个人博客与内容创作者的身份后缀。查看 .blog 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .blog 域名。",
      intro:
        ".blog 由 WordPress 母公司 Automattic 旗下注册局运营（Knock Knock WHOIS There），血统与用途完全一致：它就是为写作者准备的。个人博客、独立写作者、公司内容站、Newsletter 的网页版用 .blog，读者不需要任何解释就知道这里是「读内容的地方」——name.blog 天然读成「某某的博客」。相比在 .com 里给博客造词，.blog 让人名、笔名、主题词直接可用：yourname.blog、coffee.blog 这类在 .com 下早已绝迹的名字这里大多还在。首年注册常见 $3 上下（约 ¥20），续费约 $21/年（约 ¥155），对个人创作者是可长期负担的价位。边界也清楚：电商、SaaS、企业主站用 .blog 会显得业余；它适合做品牌的内容分站（brand.blog 与 brand.com 分工）或独立写作者的主阵地。命名上清晰第一——用真名、笔名或垂直主题词，别造生僻词。",
      bestFor: ["个人博客与独立写作者", "Newsletter 网页版", "公司内容营销分站", "垂直主题内容站"],
      namingTips: [
        "人名/笔名直接上：yourname.blog 就是个人品牌",
        "垂直主题词很出彩：coffee.blog、climbing.blog",
        "公司内容站用 brand.blog，与 brand.com 主站分工",
        "别在名字里重复 blog 字样，避免 myblog.blog",
      ],
    },
    en: {
      title: ".blog Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".blog says exactly what it is — the identity suffix for writers and content creators. See live pricing and naming advice, then hunt available .blog names with AI.",
      intro:
        ".blog is run by a registry under Automattic, the company behind WordPress — pedigree and purpose in perfect alignment: it exists for writers. Personal blogs, independent authors, company content hubs and the web home of your newsletter all read instantly on .blog: name.blog literally parses as \"NAME's blog\", zero explanation needed. Instead of contorting a coined .com, .blog lets real names, pen names and topic words work directly — yourname.blog or coffee.blog, long extinct on .com, are mostly still open here. First-year registration runs around $3 with renewals near $21/yr, sustainable for individual creators. The boundary is equally clear: e-commerce, SaaS or corporate main sites look amateur on .blog; it shines as a brand's content satellite (brand.blog alongside brand.com) or as an independent writer's home base. Name for clarity — your real name, pen name or vertical topic beats any invented word.",
      bestFor: ["Personal blogs & independent writers", "Newsletter web homes", "Company content-marketing hubs", "Vertical topic sites"],
      namingTips: [
        "Real or pen names work as-is: yourname.blog is the personal brand",
        "Vertical topic words shine: coffee.blog, climbing.blog",
        "Use brand.blog as the content satellite of brand.com",
        "Never repeat \"blog\" in the name — avoid myblog.blog",
      ],
    },
  },
  team: {
    tld: "team",
    zh: {
      title: ".team 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".team 语义是「团队」，适合协作工具、招聘页、战队与俱乐部主页。查看 .team 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .team 域名。",
      intro:
        ".team 是 Identity Digital 运营的语义后缀，含义人人秒懂：这是一个「团队」的家。用法比看上去宽：协作与团队管理 SaaS（把「为团队而生」写进域名）、公司招聘与雇主品牌页（join.team 式表达比 careers 子页面更有态度）、电竞战队与运动俱乐部主页、开源核心团队站。brand.team 与 brand.com 分工——主站讲产品，.team 讲人。首年注册 $5 上下（约 ¥35），续费约 $29/年（约 ¥212），中等价位。库存充足：常见团队名、动词短语大多可注册。注意两点：单独作为公司主站语义偏窄，更适合做「人」维度的分站；「team」在中文语境认知度不如 app/shop 直白，面向纯国内用户要权衡。命名上「动词 + .team」和「品牌 + .team」都自然，dream.team 这类现成短语更是可遇不可求的记忆点。",
      bestFor: ["协作与团队管理工具", "招聘与雇主品牌页", "电竞战队与运动俱乐部", "开源项目核心团队站"],
      namingTips: [
        "招聘页用 join + 品牌或 work + 品牌的组合表达",
        "现成短语是宝：dream.team、a.team 式的可遇不可求",
        "brand.team 做「人」的分站，与 brand.com 产品主站分工",
        "战队/俱乐部直接用队名，短且好喊",
      ],
    },
    en: {
      title: ".team Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".team means exactly that — built for collaboration tools, hiring pages, esports squads and clubs. See live pricing and naming advice, then hunt available .team names with AI.",
      intro:
        ".team, operated by Identity Digital, needs no translation: it's the home of a team. Its range is wider than it looks — collaboration and team-management SaaS (writing \"built for teams\" into the domain itself), hiring and employer-brand pages (join.team beats a buried careers subpage for attitude), esports squads and sports clubs, and open-source core-team sites. The natural split: brand.com tells the product story, brand.team tells the people story. Registration runs about $5 first year with renewals near $29/yr — mid-tier pricing. Inventory is healthy: common team names and verb phrases are largely open. Two cautions: as a company's only domain the semantics are narrow — it works best as the people-facing satellite; and ready-made phrases are the jackpot, dream.team-style names are once-in-a-lifetime memorable. Verb + .team and brand + .team both read naturally.",
      bestFor: ["Collaboration & team-management tools", "Hiring & employer-brand pages", "Esports squads & sports clubs", "Open-source core-team sites"],
      namingTips: [
        "Hiring pages: join + brand or work + brand compounds",
        "Ready-made phrases are gold: dream.team-style names",
        "Use brand.team as the people satellite of brand.com",
        "Squads and clubs: the team name itself, short and chantable",
      ],
    },
  },
  chat: {
    tld: "chat",
    zh: {
      title: ".chat 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".chat 是 AI 对话产品与社区聊天工具的天然后缀。查看 .chat 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .chat 域名。",
      intro:
        ".chat 在 ChatGPT 之后彻底翻红：AI 对话产品把「聊」写进域名，name.chat 读出来就是产品形态本身。除了 AI 助手与 Chatbot，它同样适合客服与在线咨询工具（support.chat 式表达）、社区与群聊产品、语音/视频聊天应用。语义强是它最大的资产——用户看到 .chat 就预期「点进去能对话」，转化路径清晰。Identity Digital 运营，首年注册 $6 上下（约 ¥40），续费约 $37/年（约 ¥265），中等偏上但远低于 .ai。对 AI 创业者它是 .ai 之外性价比最高的表达：brand.chat 比 brandai.com 更直接说明「这是个对话产品」。库存好：大量单词与造词可注册。边界同样清晰：非对话形态的产品用 .chat 会误导用户预期。命名建议用品牌词或场景词直接组合，让「和谁聊、聊什么」一目了然。",
      bestFor: ["AI 对话助手与 Chatbot", "客服与在线咨询工具", "社区与群聊产品", "语音/视频聊天应用"],
      namingTips: [
        "品牌 + .chat 直接说明产品形态：brand.chat",
        "场景词表达「聊什么」：legal.chat、doctor.chat 类组合",
        "AI 产品预算有限时，.chat 是 .ai 的高性价比替身",
        "非对话产品别用，会误导用户预期",
      ],
    },
    en: {
      title: ".chat Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".chat is the natural suffix for AI conversation products and community chat tools. See live pricing and naming advice, then hunt available .chat names with AI.",
      intro:
        ".chat found its moment after ChatGPT: AI conversation products write the interaction itself into the domain — name.chat is the product form factor spoken aloud. Beyond AI assistants and chatbots it fits customer support and live-consultation tools (support.chat-style), community and group-chat products, and voice/video chat apps. Strong semantics are its biggest asset: visitors seeing .chat expect to talk to something the moment they land, which makes conversion paths obvious. Operated by Identity Digital; registration runs about $6 first year, renewals near $37/yr — mid-to-upper tier but far below .ai. For AI founders it's the best value statement after .ai: brand.chat says \"this is a conversational product\" more directly than brandai.com. Inventory is good, with plenty of words and coined names open. The boundary is just as sharp — non-conversational products on .chat mislead expectations. Name with a brand word or scenario word so \"who you talk to and about what\" is instant.",
      bestFor: ["AI assistants & chatbots", "Customer support & live consultation", "Community & group-chat products", "Voice/video chat apps"],
      namingTips: [
        "Brand + .chat states the form factor: brand.chat",
        "Scenario words say what you talk about: legal.chat, doctor.chat",
        "On a budget, .chat is the value alternative to .ai for AI products",
        "Skip it for non-conversational products — it misleads",
      ],
    },
  },
  finance: {
    tld: "finance",
    zh: {
      title: ".finance 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".finance 语义严肃专业，适合金融科技、DeFi 与财务工具。查看 .finance 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .finance 域名。",
      intro:
        ".finance 把「金融」两个字写进后缀，气质严肃、专业、值钱——这正是金融类产品最需要传递的信号。金融科技创业公司、记账与预算工具、财务咨询机构、面向企业的财务 SaaS 用它都名正言顺；DeFi 圈更是把 .finance 用成了行业惯例（yearn.finance 等头部协议完成了用户教育），加密金融项目选它几乎零解释成本。Identity Digital 运营，首年 $7 上下（约 ¥48），续费约 $52/年（约 ¥375）——续费在本批里偏高，认真做金融品牌的团队通常不在乎这个量级，但副业试水要算清。库存充裕：大量金融相关词、品牌词可注册。两点提醒：金融语义带监管预期，页面要有合规信息与真实主体背书，否则「看起来像钓鱼站」的怀疑会反噬；8 个字符偏长，口头传播不如短后缀利落。命名建议品牌词直接上，或「场景词 + .finance」讲清服务对象。",
      bestFor: ["金融科技创业公司", "DeFi 与加密金融协议", "记账/预算/报销工具", "财务咨询与企业财务 SaaS"],
      namingTips: [
        "DeFi 项目用 .finance 已是行业惯例，圈内零解释成本",
        "金融语义自带监管预期：页面务必有合规信息与真实主体",
        "续费约 $52/年偏高，长期持有先算总成本",
        "8 字符偏长，品牌词要短，避免整体过长",
      ],
    },
    en: {
      title: ".finance Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".finance reads serious and professional — built for fintech, DeFi and money tools. See live pricing and naming advice, then hunt available .finance names with AI.",
      intro:
        ".finance spells the industry into the suffix — serious, professional, monied, exactly the signal financial products need to send. Fintech startups, budgeting and expense tools, advisory firms and B2B finance SaaS all wear it legitimately; the DeFi world went further and made .finance an industry convention — protocols like yearn.finance finished the user education, so crypto-finance projects pay zero explanation cost here. Operated by Identity Digital; about $7 first year with renewals near $52/yr — the highest renewal in this batch, trivial for a serious finance brand but worth budgeting for side projects. Inventory is rich: plenty of finance-adjacent words and brand names remain open. Two cautions: financial semantics invite regulatory expectations — publish compliance details and a real legal entity or risk looking like a phishing page; and at 8 characters the suffix is long, so keep the brand word short. Name with the brand directly, or scenario word + .finance to state who you serve.",
      bestFor: ["Fintech startups", "DeFi & crypto-finance protocols", "Budgeting/expense/invoicing tools", "Advisory firms & B2B finance SaaS"],
      namingTips: [
        "For DeFi, .finance is the established convention — zero explanation",
        "Financial semantics invite scrutiny: show compliance and a real entity",
        "Renewals near $52/yr — price the long haul for side projects",
        "The suffix is 8 characters — keep the brand word short",
      ],
    },
  },
  global: {
    tld: "global",
    zh: {
      title: ".global 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".global 一词表达全球化定位，适合跨国业务、国际组织与出海品牌。查看 .global 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .global 域名。",
      intro:
        ".global 用一个词完成全球化宣言：brand.global 读出来就是「某某的全球站」。它最自然的用法是跨国公司的国际主站或集团品牌页（把区域站点收拢到 brand.global 之下）、国际组织与联盟、出海品牌的海外阵地、以及任何以「全球服务」为卖点的业务（物流、支付、招聘、留学）。相比国别后缀的地域绑定，.global 反其道而行——它明确告诉用户「我们不属于任何单一市场」。Identity Digital 运营，价格是本批最高档：注册约 $31（约 ¥225），续费约 $78/年（约 ¥560），定价本身就在筛选认真做国际业务的注册者，投机囤积少、好词存量比价格更低的后缀反而好。风险与代价：6 字符不算短，且「global」对小团队可能显得口气大于实力——名不副实时用户反感更强。适合确实有多市场布局或以国际化为核心叙事的品牌；命名用品牌词直接上，别再叠加 world/international 等冗余词。",
      bestFor: ["跨国公司国际主站", "出海品牌海外阵地", "国际组织与行业联盟", "全球物流/支付/招聘服务"],
      namingTips: [
        "brand.global 做国际主站，区域站点归拢其下",
        "别叠加冗余词：worldx.global 是双重表达",
        "小团队慎用——「global」口气大，名不副实会反噬",
        "注册约 $31、续费约 $78/年，属高价后缀，预算先行",
      ],
    },
    en: {
      title: ".global Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".global declares worldwide positioning in one word — for multinationals, international orgs and expanding brands. See live pricing and naming advice, then hunt available .global names with AI.",
      intro:
        ".global makes the globalization statement in a single word: brand.global reads as \"BRAND, worldwide\". Its natural homes are the international main site of a multinational (folding regional sites under brand.global), international organizations and alliances, the overseas base of an expanding brand, and any business whose pitch is global service — logistics, payments, hiring, education. Where country-code TLDs bind you to one market, .global does the opposite: it tells users you belong to no single one. Operated by Identity Digital at this batch's premium tier — about $31 to register and $78/yr to renew — pricing that itself filters for serious international registrants, which keeps speculation low and word inventory surprisingly good. The trade-offs: six characters isn't short, and \"global\" can sound bigger than a small team's reality — overclaiming invites backlash. Choose it when multi-market presence or an international narrative is genuinely core. Name with the brand word alone; stacking world/international on top is redundant.",
      bestFor: ["Multinational main sites", "Brands expanding overseas", "International orgs & alliances", "Global logistics/payments/hiring services"],
      namingTips: [
        "Use brand.global as the international hub over regional sites",
        "Don't stack redundant words — worldx.global says it twice",
        "Small teams beware: overclaiming \"global\" invites backlash",
        "About $31 to register, $78/yr to renew — budget first",
      ],
    },
  },
  host: {
    tld: "host",
    zh: {
      title: ".host 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".host 是主机托管与基础设施服务的行业后缀。查看 .host 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .host 域名。",
      intro:
        ".host 由 Radix 运营（与 .online/.site/.store 同门），语义精准指向托管与基础设施行业：虚拟主机与 VPS 服务商、游戏服务器托管、静态托管与部署平台、家庭实验室（homelab）玩家的自建服务门户，用 name.host 都一目了然——它就是「某某托管」。对基础设施创业者它有一层巧思：产品名 + .host 让「我们帮你跑起来」的定位不言自明，比在 .com 里挤一个 hosting 词根优雅得多。价格结构要看清：首年常有 $5 上下的促销价（约 ¥35），但续费约 $82/年（约 ¥590）——本批续费最高，是典型的「首年便宜续费贵」后缀，认真商用前先把多年成本算清。库存极好：主机行业常用词、品牌词几乎随便挑。边界很窄是它的特点：非托管/基础设施业务用 .host 会让用户困惑。domain hack 也有玩法：以 host 结尾的词可断词（如 ghost → g.host 式创意）。",
      bestFor: ["虚拟主机与 VPS 服务商", "游戏服务器托管", "静态托管与部署平台", "自建服务与 homelab 门户"],
      namingTips: [
        "产品词 + .host 定位不言自明：deploy.host、pixel.host",
        "首年 $5 续费 $82 是典型促销结构，多年成本先算清",
        "以 host 结尾的词可玩 domain hack（g.host 式断词）",
        "非托管/基础设施业务别用，语义太窄会困惑用户",
      ],
    },
    en: {
      title: ".host Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".host is the industry suffix for hosting and infrastructure services. See live pricing and naming advice, then hunt available .host names with AI.",
      intro:
        ".host is run by Radix (the registry behind .online/.site/.store) and points squarely at the hosting and infrastructure trade: web hosts and VPS providers, game-server hosting, static-hosting and deployment platforms, and homelab self-hosting portals all read instantly as name.host — \"the NAME host\". For infrastructure founders there's an elegant trick: product word + .host makes \"we run it for you\" self-evident, far cleaner than cramming a hosting root into a .com. Read the price structure carefully: first-year promos often run around $5, but renewals sit near $82/yr — the highest in this batch and a textbook cheap-year-one suffix, so price multi-year costs before committing commercially. Inventory is excellent: industry words and brand names are wide open. Its narrowness is the point — non-hosting businesses on .host just confuse people. Domain hacks work too: words ending in \"host\" split neatly (ghost → g.host).",
      bestFor: ["Web hosts & VPS providers", "Game-server hosting", "Static hosting & deployment platforms", "Self-hosting & homelab portals"],
      namingTips: [
        "Product word + .host states the positioning: deploy.host, pixel.host",
        "$5 year one, ~$82 renewal — classic promo structure, do the math",
        "Words ending in \"host\" make clean domain hacks (g.host)",
        "Skip it outside hosting/infrastructure — the semantics are narrow",
      ],
    },
  },
  social: {
    tld: "social",
    zh: {
      title: ".social 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".social 是社区、社交产品与创作者阵地的行业后缀。查看 .social 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .social 域名。",
      intro:
        ".social 把「社交/社区」直接写进后缀，语义一目了然：社区论坛、去中心化社交实例、创作者的粉丝阵地、社群运营工具用 name.social 都不需要解释。它在联邦宇宙（Fediverse）里已经是事实惯例——Mastodon 官方实例 mastodon.social 完成了全网用户教育，自建 Mastodon/Misskey 实例、Bluesky 周边工具选 .social 几乎是圈内正统。Identity Digital 运营，注册约 $7（约 ¥48），续费约 $33/年（约 ¥240），属中档价位，认真做社区可以长期负担。库存很好：社区名、品牌词、城市/兴趣词基本随便挑。注意两点：一是 .social 语义偏「人聚在一起」，纯工具类产品用它会显得错位；二是 6 字符后缀不算短，前面的名字尽量控制在两个音节内。命名上「社群主题词 + .social」最自然（如 indie.social、pixel.social），品牌词直接上也完全成立。",
      bestFor: ["社区论坛与兴趣社群", "Mastodon 等联邦宇宙实例", "创作者粉丝阵地", "社群运营与私域工具"],
      namingTips: [
        "社群主题词 + .social 最自然：indie.social、pixel.social",
        "自建 Fediverse 实例选 .social 是圈内惯例，零解释成本",
        "后缀已含「社交」语义，别再叠加 hub/club 等冗余词",
        "6 字符后缀不短，名字控制在两个音节内更好读",
      ],
    },
    en: {
      title: ".social Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".social is the industry suffix for communities, social products and creator hubs. See live pricing and naming advice, then hunt available .social names with AI.",
      intro:
        ".social writes \"community\" straight into the suffix: forums, decentralized social instances, creator fan hubs and community-management tools all read instantly as name.social. In the Fediverse it's already the de-facto convention — Mastodon's flagship instance mastodon.social educated the entire internet, so self-hosted Mastodon/Misskey instances and Bluesky-adjacent tools choosing .social get insider legitimacy for free. Operated by Identity Digital at a mid-tier price — about $7 to register and $33/yr to renew — sustainable for a serious community. Inventory is excellent: community names, brand words and interest words are wide open. Two cautions: the semantics lean \"people gathering\", so a pure utility product on .social feels off; and at six characters the suffix isn't short, so keep the name to two syllables. Theme word + .social is the most natural pattern (indie.social, pixel.social); a straight brand word works just as well.",
      bestFor: ["Community forums & interest groups", "Mastodon / Fediverse instances", "Creator fan hubs", "Community management tools"],
      namingTips: [
        "Theme word + .social reads naturally: indie.social, pixel.social",
        "For Fediverse instances .social is the established convention",
        "The suffix already says \"social\" — skip redundant hub/club words",
        "Six-character suffix: keep the name to two syllables",
      ],
    },
  },
  video: {
    tld: "video",
    zh: {
      title: ".video 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".video 语义直指视频内容与视频工具，适合创作者、视频平台与视频类 SaaS。查看 .video 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .video 域名。",
      intro:
        ".video 的语义再直白不过：视频创作者的作品集主页、视频托管与剪辑工具、课程与直播平台、企业的视频官网入口，用 name.video 一眼就知道你是干什么的。视频是当下互联网最大的内容形态，但对应的好 .com 几乎绝迹——「xx视频」类的名字在 .com 里早被囤完，.video 里却大片空着，同一个词根命中率天差地别。Identity Digital 运营，注册约 $8（约 ¥60），续费约 $29/年（约 ¥210），在行业词后缀里属于价格温和的一档。它还有个隐藏用法：brand.video 做品牌的视频专区（产品演示、教程库），与主站分工明确，很多海外企业就这么用。注意：.video 是 5 字符后缀，念出来三个音节，名字本体要短；纯图文/音频产品别蹭这个后缀，语义错位反而减分。命名上「内容主题 + .video」或「工具动词 + .video」都很顺（如 cook.video、edit.video）。",
      bestFor: ["视频创作者作品集", "视频托管/剪辑/字幕工具", "课程与直播平台", "品牌视频专区（brand.video）"],
      namingTips: [
        "主题词 + .video 一眼看懂：cook.video、edit.video",
        "brand.video 可做品牌视频专区，与主站分工",
        "后缀念出来三个音节，名字本体尽量单音节或双音节",
        "非视频业务别蹭，语义错位减分",
      ],
    },
    en: {
      title: ".video Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".video points straight at video content and video tools — for creators, platforms and video SaaS. See live pricing and naming advice, then hunt available .video names with AI.",
      intro:
        ".video couldn't be more literal: a creator's portfolio, a hosting or editing tool, a course or live-streaming platform, or a company's video hub all read instantly as name.video. Video is the internet's dominant content format, yet the matching .com inventory is long gone — video-related names were hoarded years ago — while .video sits wide open, so the same shortlist scores dramatically more hits. Operated by Identity Digital at a friendly price for an industry suffix: about $8 to register, $29/yr to renew. There's also a clever pattern: brand.video as a company's dedicated video hub (demos, tutorials) cleanly separated from the main site — plenty of companies do exactly this. Caveats: the suffix is five characters and three spoken syllables, so keep the name itself short; and text- or audio-only products shouldn't borrow it — mismatched semantics subtract credibility. Theme word + .video or verb + .video both flow well (cook.video, edit.video).",
      bestFor: ["Video creator portfolios", "Hosting / editing / caption tools", "Course & live-streaming platforms", "Brand video hubs (brand.video)"],
      namingTips: [
        "Theme word + .video is self-explanatory: cook.video, edit.video",
        "Use brand.video as a dedicated video hub beside the main site",
        "Three spoken syllables in the suffix — keep the name to one or two",
        "Skip it for non-video products; mismatched semantics hurt",
      ],
    },
  },
  fund: {
    tld: "fund",
    zh: {
      title: ".fund 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".fund 语义直指基金与募资，适合投资基金、众筹项目与公益筹款。查看 .fund 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .fund 域名。",
      intro:
        ".fund 是「基金/资金」的行业后缀，指向性极强：风投与私募基金的官网（如 name.fund 直接就是「某某基金」）、加密与 DAO 金库、公益与社区筹款页、奖学金与资助计划，用它都名正言顺。VC 圈已经有不少标杆用法——很多小型基金嫌 xxxcapital.com 冗长，直接用 brand.fund，短一截还更专业。Identity Digital 运营，注册约 $9（约 ¥63），续费约 $57/年（约 ¥410）——续费在本批里偏高，但对管理真金白银的基金而言不值一提；个人side project 要掂量。库存很好：基金常用词、主题词基本可挑。两个注意点：一是金融语义自带监管预期，页面要放清楚主体信息与合规声明，否则容易被当作募资骗局；二是 .fund 适合「一只基金/一个募资计划」，泛金融工具（记账、支付）用 .finance 或 .app 更贴。命名上品牌词直接上最干净，或「主题 + .fund」表达资金用途（如 climate.fund、oss.fund）。",
      bestFor: ["风投与私募基金官网", "加密基金与 DAO 金库", "公益与社区筹款", "奖学金与资助计划"],
      namingTips: [
        "brand.fund 比 xxxcapital.com 短且专业，VC 圈已有惯例",
        "主题 + .fund 表达资金用途：climate.fund、oss.fund",
        "金融语义引监管预期：主体信息与合规声明要放全",
        "续费约 $57/年偏高，个人项目先算长期成本",
      ],
    },
    en: {
      title: ".fund Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".fund points straight at funds and fundraising — for investment funds, crowdfunding and grant programs. See live pricing and naming advice, then hunt available .fund names with AI.",
      intro:
        ".fund is the industry suffix for money pools, and its aim is precise: venture and private-equity fund sites (name.fund literally reads \"the NAME fund\"), crypto funds and DAO treasuries, charity and community fundraising pages, scholarship and grant programs. The VC world already set the pattern — plenty of small funds skip the clunky xxxcapital.com and go straight to brand.fund: shorter and more professional. Operated by Identity Digital; about $9 to register with renewals near $57/yr — high for this batch, trivial for anyone managing real money, worth budgeting for side projects. Inventory is rich: fund-adjacent words and theme words remain open. Two cautions: financial semantics invite regulatory expectations — publish your legal entity and compliance details or risk reading like a scam; and .fund fits \"a fund / a fundraising program\", while general finance tools (budgeting, payments) sit better on .finance or .app. Name with the brand word alone, or theme + .fund to state the money's purpose (climate.fund, oss.fund).",
      bestFor: ["VC & private-equity fund sites", "Crypto funds & DAO treasuries", "Charity & community fundraising", "Scholarship & grant programs"],
      namingTips: [
        "brand.fund beats xxxcapital.com — shorter and already a VC convention",
        "Theme + .fund states the purpose: climate.fund, oss.fund",
        "Financial semantics invite scrutiny — show your entity and compliance",
        "Renewals near $57/yr — do the math for side projects",
      ],
    },
  },
  land: {
    tld: "land",
    zh: {
      title: ".land 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".land 语义指向土地、地产与虚拟世界，适合房产地产、农业与元宇宙项目。查看 .land 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .land 域名。",
      intro:
        ".land 的语义有两层，都好用。第一层是字面的「土地」：房产与土地交易平台、农场与农业项目、露营地与户外目的地、地块信息服务，用 name.land 直接点题。第二层是引申的「乐园/世界」：英语里 -land 本来就是「某某之地」的构词法（Disneyland 式），游戏世界、虚拟社区、元宇宙地块项目用它自带想象力——Sandbox 等项目带火过一波 .land 注册。Identity Digital 运营，注册约 $9（约 ¥63），续费约 $33/年（约 ¥240），中档价位。库存很好，双语玩法也多：中文品牌可以把「XX之地/XX乐园」直译成 brand.land。注意：.land 不是通用后缀，业务和「土地/空间/世界」完全不沾边时用它会显得莫名其妙；另外以 -land 结尾的英文词可以玩断词 hack（如 wonderland → wonder.land），好记度直接拉满。命名上「地名/主题 + .land」和「品牌词 + .land」都成立。",
      bestFor: ["房产与土地交易平台", "农业与农场项目", "游戏世界与元宇宙", "露营地与户外目的地"],
      namingTips: [
        "字面用法点题：farm.land 式的地产/农业命名",
        "引申用法造世界：主题词 + .land 自带乐园感",
        "-land 结尾的词可玩断词 hack：wonder.land",
        "业务与「土地/空间/世界」不沾边就别用",
      ],
    },
    en: {
      title: ".land Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".land evokes real estate, farmland and virtual worlds — for property, agriculture and metaverse projects. See live pricing and naming advice, then hunt available .land names with AI.",
      intro:
        ".land carries two useful readings. The literal one: real-estate and land marketplaces, farms and agriculture ventures, campgrounds and outdoor destinations, parcel-data services — name.land says it outright. The figurative one: English builds \"a place of X\" with -land (think Disneyland), so game worlds, virtual communities and metaverse land projects wear it with built-in imagination — Sandbox-era projects drove a whole wave of .land registrations. Operated by Identity Digital at a mid-tier price: about $9 to register, $33/yr to renew. Inventory is strong, and words ending in -land make superb domain hacks (wonderland → wonder.land) that max out memorability. The caveat: .land is not a generic suffix — if your business has nothing to do with land, space or worlds, it reads as random. Both place/theme + .land and brand + .land work well.",
      bestFor: ["Real-estate & land marketplaces", "Farms & agriculture ventures", "Game worlds & metaverse projects", "Campgrounds & outdoor destinations"],
      namingTips: [
        "Literal naming states the trade: farm.land-style property names",
        "Figurative naming builds worlds: theme + .land feels like a park",
        "Words ending in -land split into great hacks: wonder.land",
        "Skip it if your business has nothing to do with land or worlds",
      ],
    },
  },
  click: {
    tld: "click",
    zh: {
      title: ".click 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".click 便宜且动作感强，适合短链跳转、落地页与营销活动页。查看 .click 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .click 域名。",
      intro:
        ".click 是「动作后缀」的代表：它念出来就是一个指令——点它。短链与跳转服务、营销活动落地页、创作者的 link-in-bio 主页、下载/购买按钮背后的追踪域，用 name.click 天然带行动号召。它也是本批最便宜的后缀之一：GoDaddy Registry 运营，注册约 $2（约 ¥11），续费约 $11/年（约 ¥78）——首年续费都便宜，批量注册活动域、给每个 campaign 配一个专属域名毫无压力。库存近乎全开：动词、品牌词、口号词随便挑。代价也要认清：便宜后缀历来被垃圾邮件与钓鱼滥用，.click 在部分邮件网关的信誉分偏低，拿它做主品牌或发件域要三思——更稳的用法是主站用 .com/.app，营销跳转用 .click 分工。命名上「动词/口号 + .click」最能发挥它的动作感（如 try.click、save.click），短促有力是第一原则。",
      bestFor: ["短链与跳转服务", "营销活动落地页", "link-in-bio 个人主页", "campaign 专属追踪域"],
      namingTips: [
        "动词/口号 + .click 自带行动号召：try.click、save.click",
        "便宜到可以每个 campaign 配一个专属域",
        "别做主品牌或发件域：便宜后缀邮件信誉分偏低",
        "短促有力是第一原则，名字最好单音节",
      ],
    },
    en: {
      title: ".click Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".click is cheap and action-charged — for short links, landing pages and marketing campaigns. See live pricing and naming advice, then hunt available .click names with AI.",
      intro:
        ".click is the archetypal action suffix: spoken aloud, it's literally an instruction. Short-link and redirect services, campaign landing pages, creator link-in-bio hubs and tracking domains behind download/buy buttons all gain a built-in call to action as name.click. It's also among the cheapest in this batch: run by GoDaddy Registry at about $2 to register and $11/yr to renew — cheap in year one and every year after, so registering a dedicated domain per campaign costs nothing. Inventory is essentially wide open: verbs, brand words, slogans, take your pick. Know the trade-off: cheap suffixes attract spam and phishing, and .click scores lower with some mail gateways — think twice before making it your primary brand or sending domain. The robust pattern is division of labor: main site on .com/.app, marketing redirects on .click. Verb/slogan + .click exploits the action feel best (try.click, save.click); punchy and short is rule number one.",
      bestFor: ["Short-link & redirect services", "Campaign landing pages", "Link-in-bio hubs", "Per-campaign tracking domains"],
      namingTips: [
        "Verb/slogan + .click is a built-in CTA: try.click, save.click",
        "Cheap enough for a dedicated domain per campaign",
        "Avoid it as a primary brand or sending domain — mail reputation is weaker",
        "Punchy and short wins — one-syllable names work best",
      ],
    },
  },
  icu: {
    tld: "icu",
    zh: {
      title: ".icu 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".icu 读作 I see you，超低价且有梗，适合个人主页、实验项目与创意短域。查看 .icu 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .icu 域名。",
      intro:
        ".icu 官方读法是「I see you（我看见你）」——一个自带社交梗的三字母后缀。它曾靠超低价冲进全球注册量前列，如今定位更清晰：个人主页与联系我页面（yourname.icu = 「看见你」）、实验与 demo 项目、监控/观测类工具（「I see you」的语义和 watch/monitor 天然契合）、以及任何想要三字母短后缀又不想付 .io/.ai 价格的场景。ShortDot 运营，注册约 $3（约 ¥18），续费约 $16/年（约 ¥115）——三字母后缀里几乎最便宜的长期持有成本。要认清两面性：低价后缀历史上被批量滥用过，.icu 在垃圾邮件统计里榜上有名，严肃商业主站慎用；但反过来，个人项目、极客玩具、内部工具用它毫无包袱，短、便宜、有梗全占。中文用户还有一层谐音注意：icu 在中文互联网常指「重症监护室」，品牌向命名要避开医疗歧义。命名上「名字/动词 + .icu」玩「看见」的梗最出彩（如 nowyou.icu 式）。",
      bestFor: ["个人主页与联系页", "实验与 demo 项目", "监控与观测工具", "低成本三字母短域需求"],
      namingTips: [
        "玩 I see you 的梗：监控工具、个人主页都出彩",
        "三字母后缀里长期成本几乎最低，实验项目无压力",
        "严肃商业主站慎用：低价后缀垃圾邮件信誉差",
        "中文语境注意「重症监护室」歧义，医疗向命名避开",
      ],
    },
    en: {
      title: ".icu Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".icu reads \"I see you\" — ultra-cheap with a built-in pun, for personal pages, experiments and creative short domains. See live pricing and naming advice, then hunt available .icu names with AI.",
      intro:
        ".icu officially reads \"I see you\" — a three-letter suffix with a pun baked in. It once rocketed up the global registration charts on rock-bottom pricing; today its niche is clearer: personal home and contact pages (yourname.icu = \"see you\"), experiments and demos, monitoring and observability tools (the \"I see you\" semantics fit watch/monitor products perfectly), and anyone who wants a three-letter suffix without paying .io/.ai prices. Run by ShortDot at about $3 to register and $16/yr to renew — nearly the lowest long-term cost of any three-letter TLD. Be clear-eyed about both sides: bargain suffixes get bulk-abused, and .icu has appeared on spam-volume charts, so think twice for a serious commercial main site; conversely, personal projects, hacker toys and internal tools wear it with zero baggage — short, cheap and witty all at once. One more note: in hospital contexts ICU means intensive care, so avoid medical-adjacent branding. Name/verb + .icu playing on \"see\" lands best (nowyou.icu-style).",
      bestFor: ["Personal home & contact pages", "Experiments & demo projects", "Monitoring & observability tools", "Budget three-letter short domains"],
      namingTips: [
        "Play the \"I see you\" pun — monitoring tools and personal pages shine",
        "Nearly the cheapest three-letter TLD to hold long-term",
        "Think twice for serious commercial main sites — spam reputation",
        "ICU also means intensive care — avoid medical-adjacent branding",
      ],
    },
  },
  page: {
    tld: "page",
    zh: {
      title: ".page 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".page 是 Google 运营的「页面」后缀，全站强制 HTTPS，适合个人主页、产品落地页与文档站。查看 .page 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .page 域名。",
      intro:
        ".page 由 Google Registry 运营，和 .app/.dev 同属一族：整个后缀写进了 HSTS 预加载列表，所有 .page 站点强制 HTTPS，浏览器直接拒绝不安全连接——这条硬性规定反而成了信任背书。语义上「page = 页面」几乎万能：个人主页与简历页（yourname.page）、产品落地页、文档与更新日志站（docs.page、changelog.page 式）、活动与发布页都名正言顺。注册约 $11（约 ¥78），续费同价——首年不打折但续费不涨价，长期持有成本可预期，这在新后缀里是难得的诚实定价。库存很好：常用词、人名、品牌词命中率高。注意两点：一是上线前必须配好 HTTPS 证书（托管平台基本自动搞定），裸 HTTP 直接打不开；二是 .page 语义是「一页」，做大型多功能平台显得错位，轻量、单一目的的站点才是它的主场。命名上「名字/用途 + .page」最顺（如 yourname.page、launch.page），读起来就是「某某的页面」。",
      bestFor: ["个人主页与简历页", "产品落地页", "文档与更新日志站", "活动与发布页"],
      namingTips: [
        "名字/用途 + .page 读起来就是「某某的页面」：yourname.page、launch.page",
        "全后缀强制 HTTPS：上线前配好证书，托管平台基本自动搞定",
        "首年续费同价、不搞低价钩子，长期成本可预期",
        "语义是「一页」：轻量单页站最贴，大型平台显得错位",
      ],
    },
    en: {
      title: ".page Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".page is Google's HTTPS-only \"page\" suffix — for personal pages, landing pages and docs sites. See live pricing and naming advice, then hunt available .page names with AI.",
      intro:
        ".page is run by Google Registry and belongs to the same family as .app and .dev: the entire TLD is on the HSTS preload list, so every .page site is HTTPS-only and browsers refuse insecure connections — a hard rule that doubles as a trust signal. Semantically \"page\" is near-universal: personal home and résumé pages (yourname.page), product landing pages, docs and changelog sites, event and launch pages all read naturally. It costs about $11 to register and the same to renew — no first-year teaser, no renewal jump — refreshingly honest pricing among new TLDs, with predictable long-term cost. Inventory is strong: common words, personal names and brand words hit often. Two cautions: you must have an HTTPS certificate before launch (hosting platforms handle this automatically), since plain HTTP simply won't load; and the semantics say \"a page\", so a sprawling multi-product platform feels mismatched — lightweight single-purpose sites are its home turf. Name/purpose + .page flows best (yourname.page, launch.page) — it literally reads as \"someone's page\".",
      bestFor: ["Personal home & résumé pages", "Product landing pages", "Docs & changelog sites", "Event & launch pages"],
      namingTips: [
        "Name/purpose + .page reads as \"someone's page\": yourname.page, launch.page",
        "HTTPS-only TLD: have a certificate ready — hosts usually automate it",
        "Same price to register and renew — predictable long-term cost",
        "Semantics say \"a page\": best for lightweight single-purpose sites",
      ],
    },
  },
  bio: {
    tld: "bio",
    zh: {
      title: ".bio 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".bio 一词双关「个人简介」与「生物/有机」，适合创作者主页、link-in-bio 与生物科技。查看 .bio 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .bio 域名。",
      intro:
        ".bio 是个一词双关的后缀：互联网语境里 bio 就是「个人简介」——社交平台人人都有一栏 bio，「link in bio」更是创作者经济的通用暗号，yourname.bio 天然就是你的个人主页与链接聚合页；另一层含义是「生物/有机」（biology/organic），生物科技公司、有机农产品品牌用它也名正言顺，欧盟不少有机食品品牌就在用 .bio。Identity Digital 运营，首年注册常有约 $6（约 ¥41）的低价，续费约 $58/年（约 ¥419）——典型的低价引流、续费回正定价，注册前把长期成本算进预算。库存极好：人名、品牌词、生物类词汇基本随便挑。注意：.bio 的两层语义最好只占一层，个人主页向就往「简介/链接页」做，生物向就往「科技/有机」做，混着用会让访客困惑。命名上人名直接上最自然（yourname.bio），生物科技则「词根 + .bio」（如 gene.bio、lab.bio 式）。",
      bestFor: ["创作者个人主页与 link-in-bio", "个人简历与名片页", "生物科技公司", "有机食品与农业品牌"],
      namingTips: [
        "人名直接上最自然：yourname.bio 就是你的简介页",
        "生物科技用「词根 + .bio」：gene.bio、lab.bio 式",
        "首年低价、续费回正（约 $58/年），长期成本先算清",
        "两层语义只占一层：简介向或生物向，别混用",
      ],
    },
    en: {
      title: ".bio Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".bio puns on \"personal bio\" and \"biology/organic\" — for creator pages, link-in-bio hubs and biotech. See live pricing and naming advice, then hunt available .bio names with AI.",
      intro:
        ".bio is a double-meaning suffix. In internet culture a bio is your profile blurb — every social platform has one, and \"link in bio\" is the creator economy's universal catchphrase — so yourname.bio is a born personal homepage and link hub. The second meaning is biology/organic: biotech startups and organic food brands wear it legitimately, and plenty of EU organic brands already do. Run by Identity Digital with a typical teaser price around $6 for year one, then about $58/yr to renew — classic cheap-in, full-price-later economics, so budget the long-term cost before committing. Inventory is superb: personal names, brand words and bio-science roots are wide open. One rule: pick a single meaning and commit — a profile-style site should lean \"bio = about me\", a science company should lean \"bio = biology\"; mixing the two confuses visitors. For naming, a bare personal name is most natural (yourname.bio); biotech works best as root + .bio (gene.bio, lab.bio-style).",
      bestFor: ["Creator pages & link-in-bio hubs", "Personal résumé / profile pages", "Biotech startups", "Organic food & farming brands"],
      namingTips: [
        "A bare personal name is most natural: yourname.bio is your profile page",
        "Biotech works as root + .bio: gene.bio, lab.bio-style",
        "Teaser first year, ~$58/yr renewal — budget the long-term cost",
        "Commit to one meaning — profile or biology, not both",
      ],
    },
  },
  ink: {
    tld: "ink",
    zh: {
      title: ".ink 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".ink 语义是「墨水」，适合纹身工作室、作家、插画师与出版内容站。查看 .ink 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .ink 域名。",
      intro:
        ".ink 的语义是「墨水」，指向所有「用墨」的行当：纹身圈把 ink 当行话（get inked = 去纹身），纹身工作室与刺青师用 name.ink 是最正统的用法；作家、书法家、插画师、漫画作者的作品集，以及杂志、出版与写作工具类产品也都贴切。Top Level Design 运营，首年注册常见约 $2（约 ¥15）的引流价，续费约 $26/年（约 ¥189）——首年几乎白送，长期成本中等偏低。还有个天然优势：ink 只有三个字母、一个音节，加在名字后面几乎不增加长度，name.ink 整体往往比对应的 .com 短一截。库存很好：纹身风格词、艺术词、人名基本可挑。注意两点：一是 .ink 语义强绑「墨/书写/纹身」，科技工具硬蹭会显得莫名其妙（除非产品本身叫 Ink）；二是与 .in（印度）仅差一个字母，口头传播时说清楚「i-n-k」。命名上「风格/主题词 + .ink」最出效果（如 black.ink、story.ink 式），刺青师直接用艺名也很飒。",
      bestFor: ["纹身工作室与刺青师", "作家与写作项目", "插画师与漫画作者", "杂志与出版内容站"],
      namingTips: [
        "纹身圈行话直接用：get inked 的语境里 name.ink 最正统",
        "三字母单音节后缀，整域名往往比 .com 更短",
        "首年约 $2 引流价、续费约 $26/年，长期成本中等",
        "口头传播说清 i-n-k，避免与 .in 混淆",
      ],
    },
    en: {
      title: ".ink Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".ink means ink — for tattoo studios, writers, illustrators and publishing sites. See live pricing and naming advice, then hunt available .ink names with AI.",
      intro:
        ".ink points at every trade that works in ink. Tattoo culture owns the word — \"get inked\" is the idiom — so studios and tattoo artists on name.ink wear the most authentic use of the suffix; writers, calligraphers, illustrators and comic artists' portfolios fit just as well, along with magazines, publishing projects and writing tools. Run by Top Level Design with a teaser price around $2 for year one and about $26/yr to renew — nearly free to try, moderate to hold. It has a structural bonus too: ink is three letters and one syllable, so name.ink often ends up shorter than the matching .com. Inventory is strong: tattoo-style words, art words and personal names are wide open. Two cautions: the semantics are hard-bound to ink/writing/tattoos, so a random tech tool borrowing it feels arbitrary (unless the product is literally called Ink); and it's one letter away from .in (India), so spell out \"i-n-k\" when saying it aloud. Style/theme word + .ink lands best (black.ink, story.ink-style); a tattoo artist's handle alone is effortlessly cool.",
      bestFor: ["Tattoo studios & artists", "Writers & writing projects", "Illustrators & comic artists", "Magazines & publishing sites"],
      namingTips: [
        "Tattoo culture owns the word — name.ink reads authentically \"inked\"",
        "Three letters, one syllable: often shorter than the matching .com",
        "~$2 teaser year, ~$26/yr renewal — cheap to try, moderate to hold",
        "Spell out i-n-k aloud to avoid confusion with .in",
      ],
    },
  },
  moe: {
    tld: "moe",
    zh: {
      title: ".moe 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".moe 源自日语「萌え」，是 ACG 圈的文化后缀，适合动漫站、同人项目与二次元社区。查看 .moe 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .moe 域名。",
      intro:
        ".moe 源自日语「萌え（moe）」——ACG 文化里形容对角色「萌」的那种喜爱，由日本注册局 Interlink 专门为二次元文化推出。它是少数「文化身份」型后缀：动漫资讯与评论站、同人社团与画师主页、VTuber 与虚拟偶像企划、二次元向工具与社区，用 name.moe 等于亮明圈内身份，目标用户一眼共鸣。圈内已有大量真实用例（动漫数据库、字幕组、图站长期在用 .moe），文化认同度在小众后缀里数一数二。注册约 $13（约 ¥94），续费同价——没有低价钩子也没有续费陷阱，定价诚实。库存极好：角色名、作品梗、日语罗马音词基本随便挑。注意两点：一是 .moe 的文化属性极强，圈外业务用它毫无意义，反而让人困惑；二是商用要注意作品版权，域名蹭知名 IP 名称有法律风险。命名上「日语罗马音/圈内梗 + .moe」最地道（如 sakura.moe、kawaii.moe 式），社团名直接上也顺。",
      bestFor: ["动漫资讯与评论站", "同人社团与画师主页", "VTuber 与虚拟偶像企划", "二次元社区与工具"],
      namingTips: [
        "日语罗马音/圈内梗 + .moe 最地道：sakura.moe、kawaii.moe 式",
        "亮明二次元身份：圈内共鸣强，圈外业务别用",
        "注册续费同价（约 $13），无低价钩子也无续费陷阱",
        "别蹭知名 IP 名称，同人商用注意版权边界",
      ],
    },
    en: {
      title: ".moe Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".moe comes from Japanese \"moe\" — the anime-culture suffix for fan sites, doujin projects and otaku communities. See live pricing and naming advice, then hunt available .moe names with AI.",
      intro:
        ".moe comes from the Japanese word 萌え (moe) — the anime-culture term for finding a character adorable — and was launched by Japanese registry Interlink specifically for otaku culture. It's one of the few genuinely cultural TLDs: anime news and review sites, doujin circles and illustrator pages, VTuber and virtual-idol projects, and anime-adjacent tools and communities all use name.moe as an identity badge that their audience recognizes instantly. Real-world adoption inside the scene is deep — anime databases, fansub groups and art boards have run on .moe for years — giving it top-tier cultural credibility among niche suffixes. It costs about $13 to register and the same to renew: no teaser, no renewal trap, honest pricing. Inventory is superb: character names, fandom in-jokes and romanized Japanese words are wide open. Two cautions: the cultural identity is so strong that non-anime businesses gain nothing and only confuse visitors; and commercial fan projects should mind IP rights — squatting famous franchise names invites legal trouble. Romanized Japanese or fandom slang + .moe is the most authentic pattern (sakura.moe, kawaii.moe-style); a circle's name alone works too.",
      bestFor: ["Anime news & review sites", "Doujin circles & illustrator pages", "VTuber & virtual idol projects", "Otaku communities & tools"],
      namingTips: [
        "Romanized Japanese / fandom slang + .moe is most authentic: sakura.moe, kawaii.moe",
        "An identity badge for the anime scene — pointless outside it",
        "Same ~$13 to register and renew — no teaser, no trap",
        "Mind IP rights: don't squat famous franchise names",
      ],
    },
  },
  lol: {
    tld: "lol",
    zh: {
      title: ".lol 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".lol 就是「laughing out loud」，自带幽默基因，适合梗图站、搞笑内容与游戏社区。查看 .lol 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .lol 域名。",
      intro:
        ".lol 就是网络用语 LOL（laughing out loud）——全世界最通用的「哈哈哈」，XYZ Registry 运营。它是幽默感最强的后缀：梗图与段子站、搞笑视频与整活企划、恶搞与愚人节页面、游戏社区（尤其 LOL 玩家圈的双关）用 name.lol 都自带笑点，域名本身就是内容的一部分。首年注册常见约 $2（约 ¥11）的引流价，续费约 $26/年（约 ¥189）——首年几乎白送，做个整活页面的成本忽略不计。库存极好：梗词、口头禅、游戏词基本随便挑。三字母单音节，读起来朗朗上口，name.lol 整体极短。注意两点：一是幽默定位是把双刃剑，严肃业务（金融、医疗、B2B）用它直接损伤可信度，别硬蹭；二是低价后缀难免有垃圾注册的历史包袱，重要项目建议同时持有一个主流后缀做正式入口。命名上「梗/口头禅 + .lol」效果拉满（如 bruh.lol、oops.lol 式），越短越好笑。",
      bestFor: ["梗图与段子站", "搞笑视频与整活企划", "游戏社区与战队页", "恶搞与愚人节页面"],
      namingTips: [
        "梗/口头禅 + .lol 自带笑点：bruh.lol、oops.lol 式",
        "首年约 $2、续费约 $26/年，整活成本忽略不计",
        "LOL 玩家圈可玩双关，游戏社区天然贴合",
        "严肃业务别碰：幽默后缀直接损伤可信度",
      ],
    },
    en: {
      title: ".lol Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".lol is literally \"laughing out loud\" — built-in humor for meme sites, comedy content and gaming communities. See live pricing and naming advice, then hunt available .lol names with AI.",
      intro:
        ".lol is the internet's universal laugh — laughing out loud — run by XYZ Registry, and it's the funniest suffix on the market. Meme and joke sites, comedy video projects, prank and April Fools' pages, and gaming communities (with a bonus pun for League of Legends circles) all get a built-in punchline from name.lol: the domain itself is part of the content. Year one typically costs about $2 with renewal around $26/yr — practically free to launch a gag page. Inventory is superb: meme words, catchphrases and gaming slang are wide open, and at three letters and one syllable, name.lol stays extremely short and speakable. Two cautions: humor cuts both ways — finance, healthcare or B2B on .lol actively damages credibility, so don't force it; and bargain suffixes carry some spam-registration baggage, so serious projects should hold a mainstream domain as the formal front door alongside the fun one. Meme/catchphrase + .lol maximizes the joke (bruh.lol, oops.lol-style) — the shorter, the funnier.",
      bestFor: ["Meme & joke sites", "Comedy video projects", "Gaming communities & team pages", "Prank & April Fools' pages"],
      namingTips: [
        "Meme/catchphrase + .lol is a built-in punchline: bruh.lol, oops.lol",
        "~$2 first year, ~$26/yr renewal — gag pages cost nothing",
        "Bonus pun for League of Legends communities",
        "Never for serious business — humor undercuts credibility",
      ],
    },
  },
  uk: {
    tld: "uk",
    zh: {
      title: ".uk 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".uk 是英国国家域名，本地信任度极高，适合面向英国市场的品牌与业务。查看 .uk 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .uk 域名。",
      intro:
        ".uk 是英国的国家域名，由非营利注册局 Nominet 运营超过 25 年，是全球注册量最大的 ccTLD 之一（上千万注册量）。对英国消费者而言 .uk/.co.uk 是「本地生意」的默认信号，信任度远超一般新后缀——面向英国市场的电商、本地服务、媒体与品牌用它几乎是标配；对英国用户搜索，Google 也会把 .uk 站点与英国地区相关联，本地 SEO 有天然加成。2014 年起开放直接注册二级 .uk（不必再挂 .co.uk），name.uk 比 name.co.uk 短一截也更现代。注册约 $6（约 ¥41），续费同价——ccTLD 里的良心价，无引流钩子。注意两点：一是 Nominet 要求注册人提供英国境内的送达地址（address for service），海外注册人通常由注册商代理提供，注册前确认注册商支持；二是对应的 .co.uk 若被他人持有，建议评估品牌混淆风险，最好两个一起拿。命名上英国业务品牌词直接上（brand.uk），本地服务可用「城市/行业 + .uk」。",
      bestFor: ["面向英国市场的电商", "英国本地服务与商铺", "英国媒体与内容站", "在英品牌与机构"],
      namingTips: [
        "品牌词直接上：name.uk 比 name.co.uk 短且现代",
        "英国本地 SEO 天然加成，本地业务几乎标配",
        "需英国送达地址，海外注册确认注册商代理支持",
        "对应 .co.uk 被他人持有时评估混淆风险，最好一起拿",
      ],
    },
    en: {
      title: ".uk Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".uk is the United Kingdom's country domain with unmatched local trust — for brands and businesses targeting the UK. See live pricing and naming advice, then hunt available .uk names with AI.",
      intro:
        ".uk is the United Kingdom's country-code domain, run by non-profit registry Nominet for over 25 years and one of the largest ccTLDs on earth with registrations in the tens of millions. To British consumers, .uk/.co.uk is the default signal of a local business — trust levels far beyond any new gTLD — so UK-facing e-commerce, local services, media and brands treat it as near-mandatory; Google also geo-associates .uk sites with the UK, a free boost for local SEO. Since 2014 you can register directly at the second level (name.uk, no .co.uk needed) — shorter and more modern than name.co.uk. It costs about $6 to register with the same renewal — honest ccTLD pricing, no teaser games. Two cautions: Nominet requires registrants to provide a UK address for service — overseas registrants usually rely on their registrar to proxy this, so confirm support before buying; and if someone else holds the matching .co.uk, weigh the brand-confusion risk — ideally secure both. For naming, a straight brand word works (brand.uk); local services can use city/trade + .uk.",
      bestFor: ["UK-facing e-commerce", "Local UK services & shops", "British media & content sites", "UK brands & institutions"],
      namingTips: [
        "Straight brand word: name.uk is shorter and more modern than name.co.uk",
        "Free local-SEO boost — near-mandatory for UK-local business",
        "UK address for service required — confirm your registrar proxies it",
        "If .co.uk is taken by someone else, weigh confusion risk; ideally get both",
      ],
    },
  },
  fm: {
    tld: "fm",
    zh: {
      title: ".fm 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".fm 自带电台与音频基因，是播客、音乐与音频产品的标志性后缀。查看 .fm 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .fm 域名。",
      intro:
        ".fm 本是密克罗尼西亚联邦的国别域名，却因为与调频广播（FM radio）同名被音频行业彻底认领：播客平台、音乐电台、音频社区大量使用 .fm，Anchor（anchor.fm）、Last.fm 这些标杆让它成了「声音产品」的身份标签。用户看到 name.fm 会本能地联想到「能听的东西」，行业契合度在 ccTLD 借义用法里数一数二。它只有两个字符，域名整体短而好念，很多在 .com 下无货的音乐词、节目名在 .fm 下仍可注册。代价是价格明显偏高——注册与续费都在 $88 上下（约 ¥632/年），没有低价钩子但长期成本不低，适合认真经营的音频品牌而非试水项目。如果你做播客、电台、音乐工具或语音社区，.fm 比任何解释都省事：后缀本身就在替你说「我是做声音的」。命名上节目名、频道名直接上最自然，还能玩 domain hack（如 relay.fm 式的短词组合）。",
      bestFor: ["播客节目与网络", "音乐电台与流媒体", "音频工具与语音社区", "声音内容创作者"],
      namingTips: [
        "节目名/频道名直接上：name.fm 一眼可听，无需解释",
        "短词 + .fm 是经典组合（relay、anchor、last 类词根）",
        "注册续费均约 $88/年，成本不低，适合长期经营的音频品牌",
        "非音频业务慎用：电台联想太强，气质错位",
      ],
    },
    en: {
      title: ".fm Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".fm carries built-in radio and audio DNA — the signature suffix for podcasts, music and voice products. See live pricing and naming advice, then hunt available .fm names with AI.",
      intro:
        ".fm is technically the country domain of the Federated States of Micronesia, but its FM-radio association let the audio industry claim it outright: podcast platforms, music stations and audio communities live on .fm, and landmarks like Anchor (anchor.fm) and Last.fm made it the identity badge of things you listen to. Visitors see name.fm and instinctively expect audio — among repurposed ccTLDs, few fit their industry this cleanly. At two characters it keeps domains short and speakable, and plenty of music words and show names long gone on .com are still open here. The trade-off is price: registration and renewal both run around $88/yr — no teaser games, but real long-term cost, which suits committed audio brands rather than throwaway experiments. If you're building a podcast, station, music tool or voice community, .fm says \"we make sound\" before you say a word. Show and channel names work verbatim, and short-word domain hacks (relay.fm-style) are a classic.",
      bestFor: ["Podcasts & podcast networks", "Music stations & streaming", "Audio tools & voice communities", "Sound-first creators"],
      namingTips: [
        "Use the show/channel name verbatim — name.fm reads as audio instantly",
        "Short word + .fm is the classic combo (relay, anchor, last)",
        "~$88/yr to register and renew — budget for a committed audio brand",
        "Avoid for non-audio businesses: the radio association is too strong",
      ],
    },
  },
  one: {
    tld: "one",
    zh: {
      title: ".one 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".one 寓意「第一、唯一、合而为一」，短而好记，适合个人品牌与一体化产品。查看 .one 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .one 域名。",
      intro:
        ".one 是一个真正的英文单词后缀：「第一」「唯一」「合而为一」的含义让它天然适合个人品牌、旗舰产品与一体化平台——name.one 读出来就是一句口号（the one）。它只有三个字符，整体域名短而干净，还能玩语义组合：number.one、all-in.one 式的读法自带记忆点。云服务商 One.com 推出的这个后缀在欧洲有不少真实用例，主流浏览器与邮件客户端识别无障碍。价格是亮点：首年约 $7（约 ¥48），续费约 $20/年（约 ¥145）——首年便宜、续费也不算陷阱，个人试水与长期持有都负担得起。库存极好：常见词、人名、品牌词大多可注册。注意两点：一是 .one 认知度仍不如 .com/.io，面向大众的正式业务建议同时持有主流后缀；二是语义强依赖英文语感，纯中文受众未必能立刻领会「one」的巧思。命名上「品牌词/人名 + .one」最顺（如 kai.one），强调唯一性、一体化的产品用它加分。",
      bestFor: ["个人品牌与个人主页", "一体化平台与旗舰产品", "会员与身份类服务", "短域名爱好者"],
      namingTips: [
        "品牌词/人名直接上：name.one 读出来就是「the one」",
        "可玩语义组合：number.one、all-in.one 式自带记忆点",
        "首年约 $7、续费约 $20/年，长期持有无压力",
        "面向大众的正式业务建议同时持有主流后缀",
      ],
    },
    en: {
      title: ".one Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".one means first, only, all-in-one — short and memorable for personal brands and unified products. See live pricing and naming advice, then hunt available .one names with AI.",
      intro:
        ".one is a real English word as a suffix, and the meanings — first, the only, all-in-one — make it a natural fit for personal brands, flagship products and unified platforms: name.one reads out loud as a slogan (\"the one\"). At three characters the full domain stays short and clean, and semantic plays like number.one or all-in.one carry built-in memorability. Launched by cloud provider One.com, it has solid real-world adoption in Europe and is recognized without issue by browsers and mail clients. Pricing is a genuine strength: about $7 for the first year and around $20/yr to renew — cheap to try, honest to keep. Inventory is excellent: common words, first names and brand words are largely open. Two cautions: recognition still trails .com/.io, so mainstream-facing businesses should hold a major TLD alongside; and the wordplay depends on English fluency — audiences who don't parse \"one\" miss the trick. Brand word or first name + .one is the smoothest pattern (kai.one), and products selling unity or singularity get a free boost.",
      bestFor: ["Personal brands & profile pages", "All-in-one platforms & flagship products", "Membership & identity services", "Short-domain lovers"],
      namingTips: [
        "Brand word or first name verbatim: name.one reads as \"the one\"",
        "Semantic plays work: number.one, all-in.one style",
        "~$7 first year, ~$20/yr renewal — cheap to try, honest to keep",
        "Mainstream businesses should hold a major TLD alongside",
      ],
    },
  },
  cool: {
    tld: "cool",
    zh: {
      title: ".cool 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".cool 自带态度与年轻感，适合潮流品牌、创意工作室与个性化项目。查看 .cool 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .cool 域名。",
      intro:
        ".cool 是把「酷」直接写进域名的后缀，由 Identity Digital 运营。它是态度最鲜明的通用词后缀之一：潮流品牌、创意工作室、设计师作品集、青年向社区用 name.cool，域名本身就在替你定调——「我们不走寻常路」。整域读出来是一句自我评价（something is cool），口头传播时自带笑点与记忆点。首年注册常见约 $6（约 ¥41）的引流价，续费约 $37/年（约 ¥263），是典型的「首年便宜、续费回归」定价，长期成本要算清楚。库存极好：品牌词、口头禅、形容词组合基本随便挑。注意两点：一是「酷」的定位是把双刃剑，金融、法律、医疗等需要严肃感的业务用它会损伤可信度；二是刻意扮酷容易翻车——名字本身要撑得起这个后缀，太平庸的词配 .cool 反而尴尬。命名上「短品牌词/态度词 + .cool」最出彩（如 stay.cool、very.cool 式），潮牌与创意项目直接上品牌名也顺。",
      bestFor: ["潮流品牌与街头文化", "创意工作室与作品集", "青年社区与活动企划", "个性化周边与副业项目"],
      namingTips: [
        "短品牌词/态度词 + .cool 最出彩：stay.cool、very.cool 式",
        "首年约 $6、续费约 $37/年，长期成本要算清",
        "名字要撑得起「酷」：平庸词配 .cool 反而尴尬",
        "严肃行业（金融/法律/医疗）别碰，气质冲突",
      ],
    },
    en: {
      title: ".cool Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".cool wears its attitude in the domain — for streetwear brands, creative studios and personality-first projects. See live pricing and naming advice, then hunt available .cool names with AI.",
      intro:
        ".cool puts the attitude straight into the address, run by Identity Digital. It's one of the most opinionated dictionary-word suffixes: streetwear brands, creative studios, designer portfolios and youth communities use name.cool to set the tone before the page even loads — \"we don't do ordinary.\" Read aloud, the whole domain is a self-review (something is cool), which makes word-of-mouth genuinely fun. Year one typically costs about $6 with renewal around $37/yr — the classic cheap-teaser-then-regular-price pattern, so budget the long game. Inventory is superb: brand words, catchphrases and adjective combos are wide open. Two cautions: coolness cuts both ways — finance, legal or healthcare on .cool undercuts credibility; and trying too hard backfires — the name itself has to earn the suffix, because a bland word + .cool reads as awkward, not edgy. Short brand or attitude words shine brightest (stay.cool, very.cool-style), and streetwear or creative projects can drop their brand name in verbatim.",
      bestFor: ["Streetwear & culture brands", "Creative studios & portfolios", "Youth communities & event projects", "Personality-first side projects"],
      namingTips: [
        "Short attitude words shine: stay.cool, very.cool style",
        "~$6 first year, ~$37/yr renewal — budget the long game",
        "The name must earn the suffix — bland word + .cool reads awkward",
        "Skip it for serious industries (finance, legal, healthcare)",
      ],
    },
  },
  red: {
    tld: "red",
    zh: {
      title: ".red 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".red 以颜色入名，红色寓意热情、喜庆与醒目，适合品牌色为红的产品与中文场景。查看 .red 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .red 域名。",
      intro:
        ".red 是把颜色写进域名的后缀（同系列还有 .blue/.pink），最早由 Afilias 推出、现归 Identity Digital 运营。红色的联想跨文化通吃：热情、能量、醒目，在中文语境里更叠加了喜庆、走红、网红的意味——「红」本身就是流量词，面向中文用户的品牌用 .red 有天然的解释空间。适合品牌主色是红色的产品、婚庆与节庆业务、美妆与潮流品牌，以及想玩「XX红了」梗的内容项目。注册约 $8（约 ¥59），续费约 $19/年（约 ¥137）——续费不到注册价的三倍，在新后缀里算定价温和的，长期持有无压力。库存极好：颜色词、品牌词、中文拼音大多可注册。注意两点：一是 .red 认知度一般，用户第一次见可能需要适应，重要业务建议搭配主流后缀；二是红色联想虽广，但与品牌无关时就只是装饰——后缀要服务品牌故事，不要为了颜色而颜色。命名上「品牌词 + .red」直接呼应品牌色最顺，中文项目可用拼音玩「走红」寓意（如 hong、huo 类词根）。",
      bestFor: ["品牌色为红的产品", "婚庆节庆与礼品业务", "美妆潮流与消费品牌", "中文「走红」概念项目"],
      namingTips: [
        "品牌主色是红时最顺：name.red 直接呼应视觉识别",
        "中文场景可玩「走红/喜庆」寓意，拼音词根加分",
        "注册约 $8、续费约 $19/年，新后缀里定价温和",
        "颜色与品牌无关时别硬凑，后缀要服务品牌故事",
      ],
    },
    en: {
      title: ".red Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".red puts a color in the address — passion, celebration and visibility, with extra meaning for Chinese audiences. See live pricing and naming advice, then hunt available .red names with AI.",
      intro:
        ".red writes a color into the domain (siblings: .blue and .pink), originally launched by Afilias and now run by Identity Digital. Red's associations travel across cultures — passion, energy, standing out — and in Chinese contexts they compound: 红 (red) also means festive, trending, going viral, so brands facing Chinese audiences get a built-in story. It suits products whose brand color is red, wedding and festival businesses, beauty and fashion labels, and content projects playing on the \"going viral\" idea. Registration runs about $8 with renewal around $19/yr — renewal less than three times the teaser, which counts as gentle pricing among new TLDs, so holding long-term is painless. Inventory is excellent: color words, brand words and pinyin are largely open. Two cautions: recognition is middling, so first-time visitors may need a beat — pair important businesses with a mainstream TLD; and if red has nothing to do with your brand, the color is mere decoration — the suffix should serve the brand story, not the other way around. Brand word + .red echoing your visual identity is the smoothest pattern; Chinese projects can lean on pinyin roots (hong, huo) for the viral connotation.",
      bestFor: ["Brands whose color is red", "Wedding, festival & gift businesses", "Beauty & fashion labels", "Chinese \"going viral\" concepts"],
      namingTips: [
        "Best when red is your brand color: name.red echoes the identity",
        "Chinese contexts add festive/viral meaning — pinyin roots work",
        "~$8 to register, ~$19/yr renewal — gentle pricing for a new TLD",
        "Don't force the color if it's unrelated to the brand",
      ],
    },
  },
  today: {
    tld: "today",
    zh: {
      title: ".today 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".today 自带时效感与行动力，适合资讯站、日更内容与「今天就开始」的产品。查看 .today 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .today 域名。",
      intro:
        ".today 是时效感最强的单词后缀，由 Identity Digital 运营，USA Today 的 usa.today 更给它做了顶级背书。它有两层好用的语义：一是「今日资讯」——新闻站、行业日报、天气与数据看板用 name.today 一眼可懂；二是「今天就行动」——健身、学习、习惯养成类产品用它自带号召力（start.today 式读法就是一句广告语）。首年注册常见约 $3（约 ¥19）的引流价，续费约 $23/年（约 ¥167），首年几乎白送、续费回归常价，试项目的成本可以忽略。库存极好：行业词、城市名、动词短语基本随便挑。注意两点：一是时效感是承诺——挂着 .today 的站点若内容长期不更新，落差会伤害信任，日更能力跟不上就别选它；二是认知度一般，正式业务建议搭配主流后缀。命名上「行业/城市 + .today」做资讯最顺（如 crypto.today 式），「动词 + .today」做行动号召最出彩，读出来就是口号。",
      bestFor: ["资讯站与行业日报", "数据看板与天气服务", "习惯养成与自我提升产品", "「今天就开始」型营销页"],
      namingTips: [
        "行业/城市 + .today 做资讯一眼可懂：crypto.today 式",
        "动词 + .today 自带号召力：start.today 读出来就是广告语",
        "首年约 $3、续费约 $23/年，试水成本忽略不计",
        "时效感是承诺：内容长期不更新会伤害信任",
      ],
    },
    en: {
      title: ".today Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".today carries urgency and freshness — for news sites, daily content and start-now products. See live pricing and naming advice, then hunt available .today names with AI.",
      intro:
        ".today is the most time-charged dictionary suffix, run by Identity Digital — and usa.today (USA Today) gave it a landmark endorsement at the highest level. It works on two frequencies: \"today's news\" — news sites, industry dailies, weather and data dashboards read instantly on name.today; and \"act today\" — fitness, learning and habit products get a built-in call to action (start.today reads out loud as ad copy). Year one typically costs about $3 with renewal around $23/yr — practically free to launch, regular price to keep, so experiments cost nothing. Inventory is superb: industry words, city names and verb phrases are wide open. Two cautions: freshness is a promise — a .today site that visibly stopped updating breaks trust harder than a neutral domain, so skip it if you can't sustain the cadence; and recognition is middling, so pair serious businesses with a mainstream TLD. Industry/city + .today is the natural news pattern (crypto.today-style), while verb + .today makes the sharpest call to action — the domain is the slogan.",
      bestFor: ["News sites & industry dailies", "Data dashboards & weather services", "Habit & self-improvement products", "Start-now marketing pages"],
      namingTips: [
        "Industry/city + .today reads as news instantly: crypto.today",
        "Verb + .today is a built-in call to action: start.today",
        "~$3 first year, ~$23/yr renewal — experiments cost nothing",
        "Freshness is a promise — don't pick it if you can't keep updating",
      ],
    },
  },
  best: {
    tld: "best",
    zh: {
      title: ".best 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".best 把「最佳」写进域名，适合评测榜单、精选推荐与主打品质的品牌。查看 .best 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .best 域名。",
      intro:
        ".best 把最高级形容词直接做成了后缀：「最好的」——评测与榜单站、精选推荐、比价导购用 name.best 一眼可懂，域名本身就是价值主张（the best X）。主打品质的品牌、作品集与个人主页用它也顺：读出来自带自信。首年注册常见约 $2（约 ¥12）的引流价，是全表最便宜的后缀之一，续费约 $19/年（约 ¥135）——首年几乎白送、长期成本也温和，试项目毫无压力。库存极好：品类词、行业词、品牌词基本随便挑，「XX.best」的好组合大量无主。注意三点：一是「最佳」是重承诺，内容撑不起排名与推荐的质量时反而显得浮夸；二是低价后缀有垃圾注册的历史包袱，部分邮件过滤器和用户会多一分戒心，重要业务建议搭配主流后缀；三是广告法语境下「最佳」类宣传在部分地区有合规讲究，商用文案注意边界。命名上「品类词 + .best」做榜单最顺（如 laptops.best 式），品牌词直接上也行——前提是你真敢称 best。",
      bestFor: ["评测与榜单站", "精选推荐与比价导购", "主打品质的品牌", "个人作品集与简历页"],
      namingTips: [
        "品类词 + .best 做榜单一眼可懂：laptops.best 式",
        "首年约 $2、续费约 $19/年，全表最便宜梯队",
        "「最佳」是重承诺：内容质量撑不起就显得浮夸",
        "重要业务搭配主流后缀，低价后缀有垃圾注册包袱",
      ],
    },
    en: {
      title: ".best Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".best puts a superlative in the address — for review sites, curated picks and quality-first brands. See live pricing and naming advice, then hunt available .best names with AI.",
      intro:
        ".best turns a superlative into a suffix: review and ranking sites, curated recommendation lists and price-comparison guides read instantly on name.best — the domain is the value proposition (the best X). Quality-first brands, portfolios and personal pages wear it well too: read aloud, it's pure confidence. Year one typically costs about $2 — among the cheapest anywhere — with renewal around $19/yr, so both launching and holding stay painless. Inventory is superb: category words, industry words and brand words are wide open, with plenty of strong \"X.best\" combos unclaimed. Three cautions: \"best\" is a heavy promise — thin content under a superlative domain reads as puffery, not authority; bargain suffixes carry spam-registration baggage, so some mail filters and users add a grain of caution — pair serious businesses with a mainstream TLD; and superlative claims in commercial copy face advertising-law limits in some jurisdictions, so mind the marketing side. Category word + .best is the natural ranking pattern (laptops.best-style); a straight brand word works too — if you genuinely dare to claim it.",
      bestFor: ["Review & ranking sites", "Curated picks & buying guides", "Quality-first brands", "Portfolios & personal pages"],
      namingTips: [
        "Category word + .best reads as a ranking instantly: laptops.best",
        "~$2 first year, ~$19/yr renewal — cheapest tier on the board",
        "\"Best\" is a heavy promise — thin content reads as puffery",
        "Pair serious businesses with a mainstream TLD; mind ad-law limits on superlatives",
      ],
    },
  },
  wtf: {
    tld: "wtf",
    zh: {
      title: ".wtf 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".wtf 自带惊叹与吐槽气质，适合梗文化项目、猎奇内容与敢玩的品牌营销。查看 .wtf 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .wtf 域名。",
      intro:
        ".wtf 把互联网最经典的惊叹语直接做成了后缀——它天生自带情绪：惊讶、吐槽、忍俊不禁。梗文化项目、猎奇合集、匿名吐槽墙、恶搞活动页用 name.wtf 一眼入戏；敢玩的品牌拿它做营销 campaign（比如「这价格.wtf」式的落地页）传播力极强。Identity Digital 运营，首年注册常见约 $3（约 ¥19）的引流价，续费约 $29/年（约 ¥211）——试个梗项目几乎零成本，长期持有也不贵。库存极好：短词、口号词、品牌词大量无主，好组合随便挑。代价要想清楚：wtf 是粗俗缩写，正式企业、金融、教育、政府相关场景绝对不合适，部分企业内网和家长过滤器可能直接拦截；它的价值恰恰在「不正经」，用对场景是记忆点，用错场景是事故。命名上「让人惊叹的事物 + .wtf」最出效果（如 prices.wtf、physics.wtf 式），短促、口语化、读出来像一句吐槽是第一原则。",
      bestFor: ["梗文化与恶搞项目", "猎奇内容与合集站", "敢玩的品牌营销活动", "匿名吐槽与趣味社区"],
      namingTips: [
        "「惊叹对象 + .wtf」读出来就是一句吐槽：prices.wtf 式",
        "首年约 $3、续费约 $29/年，试梗项目几乎零成本",
        "正式企业与金融教育场景绝对回避，粗俗缩写有拦截风险",
        "短促口语化第一，越像一句真实感叹越有传播力",
      ],
    },
    en: {
      title: ".wtf Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".wtf carries built-in shock value — for meme projects, curiosity content and brands bold enough to play. See live pricing and naming advice, then hunt available .wtf names with AI.",
      intro:
        ".wtf turns the internet's most famous exclamation into a suffix — it ships with emotion built in: surprise, snark, disbelief. Meme projects, curiosity collections, anonymous rant walls and parody campaign pages read instantly on name.wtf, and bold brands use it for marketing stunts (a \"these-prices.wtf\" landing page spreads itself). Operated by Identity Digital, first-year pricing is often around $3 with renewal near $29/yr — a meme experiment costs almost nothing and holding long-term stays cheap. Inventory is superb: short words, catchphrases and brand words are wide open. Know the trade-off: wtf is a profane abbreviation — corporate, finance, education and government contexts are out of the question, and some workplace networks and parental filters may block it outright. Its value lies precisely in being irreverent: the right context makes it unforgettable, the wrong one makes it an incident. The winning pattern is \"astonishing thing + .wtf\" (prices.wtf, physics.wtf-style); keep it short, spoken-language casual, and sounding like a genuine exclamation.",
      bestFor: ["Meme & parody projects", "Curiosity content & collections", "Bold brand marketing stunts", "Rant walls & playful communities"],
      namingTips: [
        "Astonishing thing + .wtf reads as a genuine exclamation: prices.wtf",
        "~$3 first year, ~$29/yr renewal — meme experiments cost nothing",
        "Never for corporate/finance/education — profanity gets filtered",
        "Short and conversational wins; the more it sounds spoken, the better it spreads",
      ],
    },
  },
  pizza: {
    tld: "pizza",
    zh: {
      title: ".pizza 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".pizza 是披萨店与美食品牌的行业专属后缀，域名即菜单。查看 .pizza 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .pizza 域名。",
      intro:
        ".pizza 是最直白的行业后缀之一：披萨店、连锁餐饮、外卖品牌用 name.pizza，域名读出来就是招牌——店名 + 卖什么，一个不落。独立披萨店抢不到 name.com 时，name.pizza 反而更短更好记；美食博主、评测榜单（best.pizza 式）、配方站用它也顺理成章。它还意外地适合科技圈玩梗：不少开发者拿 .pizza 做团队内部工具或趣味项目，「代码与披萨」的梗自带亲切感。Identity Digital 运营，注册约 $11（约 ¥78），续费约 $52/年（约 ¥374）——行业后缀的典型定价，对实体店一年一顿外卖的成本不算负担，但纯玩票项目要掂量续费。库存极好：城市名、口味词、店名组合基本随便注册。注意两点：一是行业绑定极强，业务扩展到披萨之外就不合身了；二是主域名之外建议同时持有 .com 做跳转，方便口头传播时兜底。命名上「店名/城市 + .pizza」最自然（如 tonys.pizza、brooklyn.pizza 式），短店名直接上，读出来就是完整招牌。",
      bestFor: ["披萨店与连锁餐饮", "外卖与本地美食品牌", "美食评测与榜单站", "开发者趣味项目"],
      namingTips: [
        "「店名/城市 + .pizza」读出来就是完整招牌：tonys.pizza 式",
        "注册约 $11、续费约 $52/年，实体店成本可忽略",
        "行业绑定极强：业务超出披萨范围就不合身",
        "建议同时持有 .com 做跳转，口头传播兜底",
      ],
    },
    en: {
      title: ".pizza Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".pizza is the industry TLD where the domain is the menu — for pizzerias, food brands and delivery. See live pricing and naming advice, then hunt available .pizza names with AI.",
      intro:
        ".pizza is one of the most literal industry suffixes: pizzerias, restaurant chains and delivery brands on name.pizza read as a complete storefront sign — the name and what you sell in one breath. When an independent pizzeria can't get name.com, name.pizza is often shorter and more memorable; food bloggers, ranking sites (best.pizza-style) and recipe hubs fit naturally too. It also has a surprising second life in tech: developers grab .pizza for internal tools and playful side projects, riding the timeless code-and-pizza connection. Operated by Identity Digital at typical industry-TLD pricing — about $11 to register, $52/yr to renew — trivial for a real restaurant, worth weighing for a pure joke project. Inventory is superb: city names, flavor words and shop-name combos are wide open. Two cautions: the industry binding is total — expand beyond pizza and the domain no longer fits; and keep a matching .com redirect as a spoken-word fallback. The natural pattern is shop or city + .pizza (tonys.pizza, brooklyn.pizza) — a short shop name alone reads as the full sign.",
      bestFor: ["Pizzerias & restaurant chains", "Delivery & local food brands", "Food review & ranking sites", "Playful developer projects"],
      namingTips: [
        "Shop/city + .pizza reads as a complete storefront sign: tonys.pizza",
        "About $11 to register, $52/yr to renew — trivial for a real restaurant",
        "Total industry binding: expand beyond pizza and it stops fitting",
        "Keep a matching .com redirect as a spoken-word fallback",
      ],
    },
  },
  bar: {
    tld: "bar",
    zh: {
      title: ".bar 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".bar 适合酒吧、餐饮夜生活品牌，也被开发者玩出工具站气质。查看 .bar 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .bar 域名。",
      intro:
        ".bar 一词两面：本义是酒吧——鸡尾酒吧、清吧、livehouse、夜生活品牌用 name.bar 招牌感十足，海报与霓虹灯上「XX.bar」就是完整店名；引申义是「条/栏」——开发者拿它做工具站也很顺（searchbar、statusbar 式的联想），甚至法律行业还有 bar（律师资格）的双关。Team Internet（原 CentralNic）系运营，首年注册常见约 $3（约 ¥19）的引流价，续费约 $52/年（约 ¥374）——首年便宜续费跳档明显，按续费价核算预算是必修课。库存很好：酒吧类好名、短词、城市词大量无主。注意三点：一是 .bar 注册局保留与溢价词较多，部分好词 RDAP 查询显示未注册但实际不可注册或要溢价，下单前以注册商实时报价为准；二是夜生活场景口头传播多，名字务必好读好拼；三是非餐饮/工具场景用 .bar 语义模糊，不如行业更贴的后缀。命名上「店名/情绪词 + .bar」最自然（如 luna.bar、mojito.bar 式），短促上口、霓虹灯上好看是第一原则。",
      bestFor: ["酒吧与夜生活品牌", "餐饮与烘焙店（能量棒/甜品吧）", "开发者工具站（bar 双关）", "城市生活指南"],
      namingTips: [
        "「店名/情绪词 + .bar」霓虹灯上就是招牌：luna.bar 式",
        "首年约 $3、续费约 $52/年，按续费价核算预算",
        "保留与溢价词多：下单前以注册商实时报价为准",
        "夜生活靠口头传播，名字务必好读好拼",
      ],
    },
    en: {
      title: ".bar Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".bar suits bars and nightlife brands, with a developer-tool double meaning on the side. See live pricing and naming advice, then hunt available .bar names with AI.",
      intro:
        ".bar cuts two ways. The literal sense is the venue: cocktail bars, lounges, live houses and nightlife brands on name.bar carry instant signboard energy — \"NAME.bar\" on a poster or in neon is the complete brand. The extended sense is the UI element: developers ride the searchbar/statusbar association for tool sites, and lawyers even get a bar-exam pun for free. Operated in the Team Internet (formerly CentralNic) family, first-year promos often run around $3 while renewal jumps to about $52/yr — budget on the renewal price, not the promo. Inventory is strong: bar-worthy names, short words and city words are wide open. Three cautions: the .bar registry holds back and premium-prices many good words — some names look unregistered in RDAP but aren't actually available at base price, so confirm with a registrar's live quote before committing; nightlife brands travel by word of mouth, so the name must be easy to say and spell; and outside venues or tools the semantics blur — a tighter industry TLD may serve better. The natural pattern is venue or mood word + .bar (luna.bar, mojito.bar) — short, punchy, and good-looking in neon.",
      bestFor: ["Bars & nightlife brands", "Cafés, dessert & snack bars", "Developer tool sites (the UI pun)", "City nightlife guides"],
      namingTips: [
        "Venue/mood word + .bar is the sign itself: luna.bar",
        "~$3 first year but ~$52/yr renewal — budget on the renewal",
        "Many reserved/premium words: confirm registrar's live quote first",
        "Nightlife travels by word of mouth — keep it easy to say and spell",
      ],
    },
  },
  cafe: {
    tld: "cafe",
    zh: {
      title: ".cafe 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".cafe 是咖啡馆与休闲空间的行业后缀，也适合社区型线上聚集地。查看 .cafe 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .cafe 域名。",
      intro:
        ".cafe 给咖啡馆量身定做：独立咖啡店、烘焙工作室、猫咖书咖用 name.cafe，域名和店招完全同构——菜单、预约页、外卖链接印上去毫无违和。它的气质还能外溢到线上：「cafe」在互联网语境里早就是「轻松聚集地」的代名词，读书会、语言角、开发者社区拿 name.cafe 做线上客厅，比 .com 更有温度。Identity Digital 运营，注册约 $5（约 ¥33），续费约 $42/年（约 ¥300）——首年友好，续费是行业后缀常规水平，对实体店成本可忽略。库存很好：店名、意象词、街区名组合命中率高。注意两点：一是与 .coffee 后缀分工——.cafe 指「场所与空间」，.coffee 指「咖啡本身」，卖豆子选 .coffee、开店选 .cafe 更贴；二是行业气质浓，严肃 B2B 或与「休闲聚集」无关的业务用它会显得错位。命名上「店名/意象词 + .cafe」最自然（如 corner.cafe、luna.cafe 式），读出来像一句「来我们店坐坐」的邀请是最好的效果。",
      bestFor: ["独立咖啡馆与烘焙店", "猫咖书咖等主题空间", "线上社区与读书会", "本地生活方式品牌"],
      namingTips: [
        "「店名/意象词 + .cafe」就是店招：corner.cafe 式",
        "注册约 $5、续费约 $42/年，实体店成本可忽略",
        "卖豆子选 .coffee、开店选 .cafe，两个后缀分工明确",
        "线上社区用它自带「轻松聚集地」气质，比 .com 更有温度",
      ],
    },
    en: {
      title: ".cafe Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".cafe is the industry TLD for coffee shops and cozy spaces — and for warm online gathering spots. See live pricing and naming advice, then hunt available .cafe names with AI.",
      intro:
        ".cafe is tailor-made for coffee shops: independent cafés, roastery studios, cat cafés and book bars on name.cafe make the domain and the shop sign one and the same — menus, booking pages and delivery links all read naturally. The vibe extends online too: in internet culture \"cafe\" has long meant a relaxed gathering place, so book clubs, language corners and developer communities use name.cafe as a virtual living room with more warmth than any .com. Operated by Identity Digital — about $5 to register, $42/yr to renew — friendly up front, standard industry-TLD renewal, negligible for a real shop. Inventory is strong: shop names, imagery words and neighborhood names hit at a high rate. Two things to note: the division of labor with .coffee — .cafe means the place, .coffee means the bean, so sell beans on .coffee and run a shop on .cafe; and the vibe is strongly casual — serious B2B or anything unrelated to relaxed gathering will feel misplaced. The natural pattern is shop or imagery word + .cafe (corner.cafe, luna.cafe) — the best names read like an invitation to come sit down.",
      bestFor: ["Independent cafés & roasteries", "Cat cafés & themed spaces", "Online communities & book clubs", "Local lifestyle brands"],
      namingTips: [
        "Shop/imagery word + .cafe is the shop sign: corner.cafe",
        "About $5 to register, $42/yr to renew — negligible for a real shop",
        "Sell beans on .coffee, run the place on .cafe — clear division",
        "Online communities get built-in warmth a .com can't offer",
      ],
    },
  },
  money: {
    tld: "money",
    zh: {
      title: ".money 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".money 直白宣示金钱主题，适合理财内容、个人财务工具与加密金融项目。查看 .money 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .money 域名。",
      intro:
        ".money 是最直白的金钱后缀：理财博客与新闻站、预算与记账工具、比价与返现服务、加密钱包与 DeFi 项目用 name.money，主题一秒传达——smart.money、save.money 这样的组合读出来就是口号。相比 .finance 的机构正式感，.money 更口语、更贴近个人：面向普通人的财务内容与工具用它比 .finance 亲切得多。Identity Digital 运营，注册约 $11（约 ¥78），续费约 $28/年（约 ¥204）——续费在行业后缀里算温和，长期持有压力小。库存很好：动词、形容词、人群词组合大量无主。注意三点：一是金钱主题是钓鱼与骗局重灾区，.money 站点要靠品牌与内容自证清白，正规业务务必配好 HTTPS、备案与真实主体信息；二是受监管的金融业务（券商、银行、支付）用 .money 显得不够正式，牌照类业务仍建议 .com；三是「money」6 字符不短，前缀务必短。命名上「动词/形容词 + .money」最出效果（如 smart.money、grow.money 式），读出来像一句理财建议是最好的状态。",
      bestFor: ["理财内容与新闻站", "预算记账与个人财务工具", "比价返现与省钱服务", "加密钱包与 DeFi 项目"],
      namingTips: [
        "「动词/形容词 + .money」读出来就是口号：smart.money 式",
        "注册约 $11、续费约 $28/年，续费在行业后缀里算温和",
        "金钱主题钓鱼多：HTTPS 与真实主体信息是信任底线",
        "持牌金融业务仍建议 .com，.money 适合内容与工具",
      ],
    },
    en: {
      title: ".money Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".money says the topic out loud — for personal finance content, budgeting tools and crypto projects. See live pricing and naming advice, then hunt available .money names with AI.",
      intro:
        ".money is the most literal finance suffix: money blogs and news sites, budgeting and expense tools, price-comparison and cashback services, crypto wallets and DeFi projects on name.money communicate the topic in one second — combos like smart.money and save.money read as slogans. Compared with .finance's institutional formality, .money is conversational and personal: consumer-facing financial content and tools feel far more approachable here. Operated by Identity Digital — about $11 to register, $28/yr to renew — one of the gentler renewals among industry TLDs, easy to hold long-term. Inventory is strong: verbs, adjectives and audience words are wide open. Three cautions: money is phishing's favorite topic, so a .money site must earn trust through brand and content — proper HTTPS and verifiable identity are table stakes; regulated financial businesses (brokerages, banks, payments) read under-dressed on .money — licensed operations still belong on .com; and \"money\" is six characters, so keep the prefix short. The winning pattern is verb or adjective + .money (smart.money, grow.money) — the best names sound like a piece of financial advice.",
      bestFor: ["Personal finance content & news", "Budgeting & money-management tools", "Cashback & money-saving services", "Crypto wallets & DeFi projects"],
      namingTips: [
        "Verb/adjective + .money reads as a slogan: smart.money",
        "About $11 to register, $28/yr to renew — gentle for an industry TLD",
        "Money attracts phishing — HTTPS and verifiable identity are table stakes",
        "Licensed financial businesses still belong on .com",
      ],
    },
  },
  gold: {
    tld: "gold",
    zh: {
      title: ".gold 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".gold 自带贵金属与「金牌品质」双重语义，适合珠宝、贵金属交易与高端品牌。查看 .gold 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .gold 域名。",
      intro:
        ".gold 一词双关：本义是黄金——金店、珠宝品牌、贵金属交易与回收、金价行情站用 name.gold，行业属性一秒传达；引申义是「金牌/顶级」——把 .gold 当品质徽章用，会员体系的最高档（member.gold 式）、精品推荐、高端服务都能借它抬升质感。Identity Digital 运营，注册约 $6（约 ¥41），续费约 $83/年（约 ¥598）——首年友好但续费是本批最高档，预算务必按续费核算，适合认真经营的业务而非批量囤域名。库存很好：品牌词、品类词、城市词命中率高。注意三点：一是贵金属交易与投资是强监管领域，行情与交易类站点注意合规与资质展示；二是「gold」的高端语义是承诺，产品与视觉撑不起「金」字招牌反而显得廉价；三是它和 .money 分工明确——.gold 偏实物与品质叙事，.money 偏理财与工具。命名上「品牌/品类 + .gold」最自然（如 aurum.gold、bridal.gold 式），配合金色系视觉，域名与品牌气质浑然一体。",
      bestFor: ["金店与珠宝品牌", "贵金属交易与回收", "金价行情与投资内容", "高端会员与精品服务"],
      namingTips: [
        "「品牌/品类 + .gold」自带金字招牌：aurum.gold 式",
        "注册约 $6、续费约 $83/年，按续费核算预算",
        "贵金属交易强监管：行情与交易站注意资质合规",
        "高端语义是承诺：产品与视觉要撑得起「金」字",
      ],
    },
    en: {
      title: ".gold Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".gold carries both the precious metal and the gold-standard meaning — for jewelry, bullion and premium brands. See live pricing and naming advice, then hunt available .gold names with AI.",
      intro:
        ".gold works as a double entendre. The literal sense is the metal: jewelers, bullion dealers, gold-recycling services and price-tracking sites on name.gold communicate the industry in one second. The figurative sense is the medal: .gold as a quality badge lifts top membership tiers (member.gold-style), curated picks and premium services. Operated by Identity Digital — about $6 to register but $83/yr to renew, the priciest tier in this batch — budget strictly on the renewal, which makes it a suffix for businesses you mean to run, not domains to hoard. Inventory is strong: brand words, category words and city words hit at a high rate. Three cautions: bullion trading and investment are heavily regulated — price and trading sites must mind compliance and display credentials; the premium semantics are a promise — if product and visuals can't live up to \"gold\", the name cheapens rather than elevates; and the division with .money is clean — .gold tells a physical-goods and quality story, .money a personal-finance and tools one. The natural pattern is brand or category + .gold (aurum.gold, bridal.gold); pair it with golden visuals and the domain and brand fuse into one.",
      bestFor: ["Jewelers & gold brands", "Bullion trading & recycling", "Gold price & investment content", "Premium memberships & services"],
      namingTips: [
        "Brand/category + .gold is a built-in gold seal: aurum.gold",
        "About $6 to register but $83/yr to renew — budget on the renewal",
        "Bullion is heavily regulated — show credentials on trading sites",
        "The premium promise cuts both ways: visuals must live up to \"gold\"",
      ],
    },
  },
  band: {
    tld: "band",
    zh: {
      title: ".band 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".band 是乐队与音乐团体的专属后缀，适合乐队官网、巡演信息与粉丝社群。查看 .band 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .band 域名。",
      intro:
        ".band 的指向性在所有新顶级域名里数一数二：看到 name.band，用户默认这是一支乐队——官网、巡演日程、新专辑、周边商店、粉丝社群都顺理成章。独立乐队尤其受益：乐队名在 .com 上常被同名者占走，而 yourname.band 几乎总有货，且比 yournameband.com 更干净。它也能延伸到更广的「团体」语义——合唱团、管乐团、播客组合、甚至取「一伙人」意象的社区品牌都用得顺。Identity Digital 运营，注册约 $16（约 ¥115），续费约 $25/年（约 ¥182），价差小、无「首年钓鱼」，长期持有安心。注意两点：一是 .band 语义太具体，非音乐类正式企业用它会显得错位；二是乐队名本身要避开在世艺人与厂牌商标，改名的代价远大于换域名。命名上直接用乐队名最好（the 前缀在 .band 下反而自然，如 the.band 早已被注册），或「城市/风格 + band」做地方性组合。",
      bestFor: ["乐队与音乐团体官网", "巡演日程与售票落地页", "粉丝社群与周边商店", "合唱团/管乐团等表演团体"],
      namingTips: [
        "直接用乐队名：yourname.band 几乎总有货且最干净",
        "「风格/城市 + band」适合地方性团体（jazz、brass 类词根）",
        "注册约 $16、续费约 $25/年，价差小可长期持有",
        "非音乐类正式企业慎用，语义错位",
      ],
    },
    en: {
      title: ".band Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".band is the purpose-built TLD for bands and music groups — sites, tours, merch and fan communities. See live pricing and naming advice, then hunt available .band names with AI.",
      intro:
        ".band is one of the most self-explanatory new TLDs: see name.band and you assume a band — official site, tour dates, new record, merch store, fan community all fit without explanation. Independent bands benefit most: band names are routinely squatted on .com by namesakes, while yourname.band is almost always available and reads cleaner than yournameband.com. The semantics stretch naturally to any performing group — choirs, brass ensembles, podcast duos, even community brands playing on the \"a band of...\" image. Operated by Identity Digital, about $16 to register and $25/yr to renew — a small gap with no first-year bait, comfortable to hold long term. Two cautions: the semantics are so specific that a non-music business on .band feels miscast; and clear the band name itself against active artists and label trademarks — renaming a band costs far more than a domain. Naming is simple: use the band name directly, or a style/city + band compound for local groups.",
      bestFor: ["Band & music group websites", "Tour dates & ticketing pages", "Fan communities & merch stores", "Choirs, ensembles & performing groups"],
      namingTips: [
        "Use the band name directly — yourname.band is almost always free",
        "Style/city + band works for local groups (jazz, brass roots)",
        "About $16 to register, $25/yr to renew — safe to hold long term",
        "Skip it for non-music businesses; the semantics are too specific",
      ],
    },
  },
  cash: {
    tld: "cash",
    zh: {
      title: ".cash 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".cash 直白传达「钱」的语义，适合支付工具、返现优惠与加密货币产品。查看 .cash 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .cash 域名。",
      intro:
        ".cash 是把「钱」写在脸上的后缀：支付与转账工具、返现与优惠平台、点数变现、加密货币产品（coin.cash 式）用它，价值主张一秒到位。它比 .money 更口语、更直接——.money 偏理财与规划叙事，.cash 就是「到手的钱」，适合强调即时、直给的产品：秒到账、立返现、当天结算。Identity Digital 运营，注册约 $10（约 ¥70），续费约 $31/年（约 ¥226），中规中矩。库存不错：动词与场景词命中率高。三点提醒：一是「cash」在垃圾邮件与诈骗页里出现频率高，新品牌要用真实主体信息、HTTPS 与清晰的资金流说明对冲怀疑；二是支付与借贷是强监管行业，合规资质比域名更早准备；三是它天然带「快钱」气质，主打稳健长期的理财品牌反而不合适。命名上「动词 + cash」是黄金结构（get、send、swap 类），或品牌词直接 + .cash 做支付子品牌。",
      bestFor: ["支付与转账工具", "返现与优惠平台", "加密货币与数字资产产品", "点数变现与结算服务"],
      namingTips: [
        "「动词 + cash」最直给：get/send/swap 类词根",
        "注册约 $10、续费约 $31/年，预算按续费核算",
        "「cash」易被联想诈骗：真实主体信息 + HTTPS 必备",
        "支付借贷强监管，资质合规先于域名",
      ],
    },
    en: {
      title: ".cash Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".cash says money out loud — for payment tools, cashback platforms and crypto products. See live pricing and naming advice, then hunt available .cash names with AI.",
      intro:
        ".cash wears money on its sleeve: payment and transfer tools, cashback and deals platforms, points-to-cash services and crypto products (coin.cash-style) land their value proposition in one second. It's blunter and more colloquial than .money — .money tells a planning and personal-finance story, .cash is money in hand, which suits products selling immediacy: instant payouts, same-day settlement, cash back now. Operated by Identity Digital, about $10 to register and $31/yr to renew. Inventory is decent, with verbs and scenario words hitting well. Three cautions: \"cash\" shows up disproportionately in spam and scam pages, so a new brand needs real entity information, HTTPS and a clear money-flow explanation to offset suspicion; payments and lending are heavily regulated — sort licensing before the domain; and the fast-money vibe cuts against brands selling prudent long-term wealth building. The golden pattern is verb + .cash (get, send, swap), or your brand word + .cash as a payments sub-brand.",
      bestFor: ["Payment & transfer tools", "Cashback & deals platforms", "Crypto & digital asset products", "Points redemption & settlement services"],
      namingTips: [
        "Verb + .cash is the golden pattern: get/send/swap roots",
        "About $10 to register, $31/yr to renew — budget on the renewal",
        "\"Cash\" attracts scam suspicion — real entity info + HTTPS are table stakes",
        "Payments and lending are regulated: licenses before domains",
      ],
    },
  },
  city: {
    tld: "city",
    zh: {
      title: ".city 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".city 适合城市指南、本地生活服务与「××之城」式主题社区。查看 .city 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .city 域名。",
      intro:
        ".city 有两条清晰的用法。第一条是地理：城市指南、本地新闻、活动日历、生活服务聚合，用「城市名 + .city」（smart.city 式的组合早被注册局与机构盯上），对本地用户的指向性无可替代。第二条是比喻：「××之城」——把某个主题做成一座城，游戏社区、垂直内容站、电商专区都能借这个意象（模式类似 vitamin.city 式的品类之城）。Identity Digital 运营，注册约 $5（约 ¥33）非常亲民，续费约 $23/年（约 ¥167），是本批里长期成本最低的选择之一。库存好：多数中文城市拼音、英文城市名与品类词都还有货。注意三点：一是城市名可能涉及地方政府与商标保护，官方口径的名称要先查清；二是地理型站点重在持续运营，内容停更的城市站衰减极快；三是比喻用法要在首屏把「城」的概念讲清楚，否则用户会误以为是地理站。命名上「城市拼音 + .city」或「品类词 + .city」都自然。",
      bestFor: ["城市指南与本地资讯", "本地生活与活动服务", "「××之城」主题社区", "智慧城市与市政科技项目"],
      namingTips: [
        "「城市名/拼音 + .city」指向性最强，先查政府与商标口径",
        "注册约 $5、续费约 $23/年，本批长期成本最低档",
        "品类词 + .city 的「之城」比喻要在首屏讲清楚",
        "本地站重在持续运营，停更衰减快",
      ],
    },
    en: {
      title: ".city Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".city fits city guides, local services and themed \"city of X\" communities. See live pricing and naming advice, then hunt available .city names with AI.",
      intro:
        ".city has two clean use cases. The literal one is geography: city guides, local news, event calendars and local-services aggregators on cityname.city speak to local users like nothing else (institutional players grabbed combos like smart.city early). The figurative one is the \"city of X\": build a theme into a metropolis — gaming communities, vertical content hubs, e-commerce districts all borrow the image. Operated by Identity Digital, registration is a friendly ~$5 with renewal around $23/yr — among the lowest long-term costs in this batch. Inventory is good: most city names, pinyin forms and category words are still available. Three cautions: city names can touch municipal-government and trademark protections, so check the official stance first; geographic sites live or die on sustained publishing — an abandoned city site decays fast; and the metaphorical use must explain the \"city\" concept above the fold or visitors will expect a map. Naming: city name + .city for the literal play, category word + .city for the metaphor.",
      bestFor: ["City guides & local news", "Local services & event calendars", "Themed \"city of X\" communities", "Smart-city & civic-tech projects"],
      namingTips: [
        "City name + .city is unbeatable locally — clear municipal/trademark issues first",
        "About $5 to register, $23/yr to renew — lowest long-term tier here",
        "Category + .city metaphors must explain themselves above the fold",
        "Local sites need sustained publishing; abandoned ones decay fast",
      ],
    },
  },
  estate: {
    tld: "estate",
    zh: {
      title: ".estate 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".estate 面向房地产经纪、豪宅项目与资产管理，real.estate 的组合自带行业招牌。查看 .estate 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .estate 域名。",
      intro:
        ".estate 是房地产行业的天然后缀：经纪人与中介品牌、豪宅与庄园项目、物业与资产管理公司用 name.estate，行业属性一目了然，real.estate 这样的组合更是被注册局当招牌展示。相比挤破头的 realty/realestate .com 组合，.estate 让品牌词保持干净：smith.estate 比 smithrealestate.com 短一半且更显高端。它还有一层「遗产/资产」语义——家族办公室、遗产规划、数字资产管理也用得顺。Identity Digital 运营，注册约 $8（约 ¥59），续费约 $31/年（约 ¥226），对客单价极高的房地产行业可忽略不计。库存好：姓氏、地名、楼盘词命中率高。注意三点：一是房产交易强监管且重信任，站点要挂牌照与真实办公信息；二是「estate」在英语里偏高端庄园气质，刚需平价盘用它有落差；三是面向国内用户时 .estate 认知度低，更适合海外或涉外业务。命名上「姓氏/品牌 + .estate」最自然，地名 + estate 适合区域深耕的中介。",
      bestFor: ["房产经纪与中介品牌", "豪宅与庄园项目", "物业与资产管理", "家族办公室与遗产规划"],
      namingTips: [
        "「姓氏/品牌 + .estate」干净高端：smith.estate 式",
        "注册约 $8、续费约 $31/年，对房产行业成本可忽略",
        "房产交易重信任：牌照与真实办公信息上首屏",
        "「estate」偏高端庄园气质，平价盘慎用",
      ],
    },
    en: {
      title: ".estate Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".estate is built for real-estate agents, luxury properties and asset management — real.estate is the registry's own showcase. See live pricing and naming advice, then hunt available .estate names with AI.",
      intro:
        ".estate is real estate's native suffix: agent and brokerage brands, luxury property projects, and property or asset management firms on name.estate declare the industry at a glance — the registry showcases real.estate itself as the flagship combo. Against the scrum for realty/realestate .com compounds, .estate keeps the brand word clean: smith.estate is half the length of smithrealestate.com and reads more upscale. There's a second meaning too — estates as legacy and assets — which suits family offices, estate planning and digital-asset custody. Operated by Identity Digital, about $8 to register and $31/yr to renew — a rounding error in an industry with real-estate ticket sizes. Inventory is strong: surnames, place names and development names hit well. Three cautions: property transactions are regulated and trust-driven, so put licenses and a real office address up front; \"estate\" carries a manor-house register in English that clashes with budget listings; and recognition among mainland-Chinese consumers is low, so it fits international-facing businesses best. Naming: surname or brand + .estate is the natural pattern; place + estate suits agencies focused on one area.",
      bestFor: ["Real-estate agents & brokerages", "Luxury property projects", "Property & asset management", "Family offices & estate planning"],
      namingTips: [
        "Surname/brand + .estate reads clean and upscale: smith.estate",
        "About $8 to register, $31/yr to renew — negligible for this industry",
        "Trust-driven industry: licenses and office address above the fold",
        "\"Estate\" sounds manor-house — a mismatch for budget listings",
      ],
    },
  },
  expert: {
    tld: "expert",
    zh: {
      title: ".expert 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".expert 把专业身份写进域名，适合顾问、咨询师与垂直领域权威站。查看 .expert 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .expert 域名。",
      intro:
        ".expert 是一句自我介绍：name.expert 直接告诉访客「这是某领域的专家」。独立顾问、律师与会计等专业人士、垂直咨询公司、深度评测与知识付费站用它，定位一秒立住——seo.expert、tax.expert 这样的「领域词 + .expert」组合就是一块数字招牌。相比 .pro 的泛专业感，.expert 更聚焦「权威个体/团队」，适合把个人 IP 或小团队的专业能力做成品牌。Identity Digital 运营，注册约 $7（约 ¥48）很低，但续费约 $50/年（约 ¥360）是本批最高——这是典型的「首年引流、续费收割」定价，预算必须按续费核算，认真经营的专业站才值得。库存极好：绝大多数领域词、姓氏组合都有货。注意两点：一是「expert」是承诺，内容深度与案例撑不起时反而招致反感——空壳站用这个后缀会放大质疑；二是监管行业（法律、医疗、金融）的「专家」表述可能触碰广告合规，谨慎措辞。命名上「领域词 + .expert」最强，姓氏或个人品牌 + .expert 适合个人 IP。",
      bestFor: ["独立顾问与咨询师", "律师/会计等专业服务", "垂直领域评测与知识站", "个人专业 IP 品牌"],
      namingTips: [
        "「领域词 + .expert」是数字招牌：seo.expert 式",
        "首年约 $7 但续费约 $50/年，本批最高，按续费核算",
        "「expert」是承诺：内容深度撑不起会放大质疑",
        "监管行业「专家」表述注意广告合规",
      ],
    },
    en: {
      title: ".expert Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".expert puts professional authority in the domain — for consultants, advisors and vertical authority sites. See live pricing and naming advice, then hunt available .expert names with AI.",
      intro:
        ".expert is an introduction in a domain: name.expert tells visitors exactly who you claim to be. Independent consultants, lawyers, accountants and other professionals, boutique advisory firms, deep-dive review and paid-knowledge sites all land their positioning instantly — field word + .expert combos like seo.expert or tax.expert are digital shingles. Where .pro signals generic professionalism, .expert points at an authoritative individual or team, ideal for turning a personal brand or small practice into a name. Operated by Identity Digital: registration is a low ~$7, but renewal at ~$50/yr is the highest in this batch — classic promo-then-harvest pricing, so budget strictly on the renewal; it only pays for a practice you'll actually run. Inventory is excellent: most field words and surname combos are open. Two cautions: \"expert\" is a promise — thin content under this suffix amplifies skepticism rather than authority; and in regulated fields (law, medicine, finance) the word \"expert\" itself can trip advertising rules, so phrase claims carefully. Naming: field word + .expert is the strongest play; surname or personal brand + .expert fits individual practitioners.",
      bestFor: ["Independent consultants & advisors", "Legal, accounting & professional services", "Vertical review & knowledge sites", "Personal professional brands"],
      namingTips: [
        "Field word + .expert is a digital shingle: seo.expert",
        "~$7 first year but ~$50/yr renewal — highest here, budget on renewal",
        "\"Expert\" is a promise: thin content amplifies skepticism",
        "Mind advertising rules around \"expert\" claims in regulated fields",
      ],
    },
  },
  farm: {
    tld: "farm",
    zh: {
      title: ".farm 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".farm 适合农场直销、农业科技与「农场直达餐桌」品牌，也被开发者用作服务器集群昵称。查看 .farm 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .farm 域名。",
      intro:
        ".farm 的第一层用法是字面：家庭农场与农产品直销、有机食品品牌、农家乐与休闲农业、农业科技公司用 name.farm，「从农场到餐桌」的故事从域名就开始讲。它对小生产者格外友好——本地农场的名字在 .com 上常被占，而 .farm 下几乎总有货，且比 .com 更强化「产地直供」的信任感。第二层是极客文化：「farm」在技术圈是集群的代名词（render farm、server farm），渲染农场、GPU 算力池、自动化流水线用 .farm 反而有梗。Identity Digital 运营，注册约 $8（约 ¥56），续费约 $31/年（约 ¥226）。库存很好：农产品品类词、地名、姓氏农场都命中率高。注意两点：一是食品与生鲜电商涉及许可证与冷链，域名之外先把资质备齐；二是「content farm」「click farm」是贬义词，内容类站点用 .farm 要避免负面联想。命名上「姓氏/地名 + .farm」最自然，品类词 + .farm（如 berry、dairy 类）适合单品牌。",
      bestFor: ["家庭农场与农产品直销", "有机食品与生鲜品牌", "休闲农业与农家乐", "农业科技与算力集群项目"],
      namingTips: [
        "「姓氏/地名 + .farm」最自然，本地信任感强",
        "注册约 $8、续费约 $31/年，小生产者可负担",
        "食品生鲜先备许可证，域名之外资质更重要",
        "内容站慎用：避免 content farm 负面联想",
      ],
    },
    en: {
      title: ".farm Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".farm suits farm-to-table brands, agtech and direct-selling growers — plus developer culture's server farms. See live pricing and naming advice, then hunt available .farm names with AI.",
      intro:
        ".farm works literally first: family farms selling direct, organic food brands, farm-stay tourism and agtech companies on name.farm start telling the farm-to-table story in the address bar. It's especially kind to small producers — local farm names are routinely taken on .com, while .farm almost always has stock and reinforces the direct-from-the-source trust signal better than .com would. The second layer is geek culture: \"farm\" means a cluster in tech (render farm, server farm), so rendering services, GPU pools and automation pipelines wear .farm with a wink. Operated by Identity Digital, about $8 to register and $31/yr to renew. Inventory is strong: produce categories, place names and surname-farms all hit well. Two cautions: food and grocery e-commerce involve licensing and cold chains — get credentials sorted beyond the domain; and \"content farm\" and \"click farm\" are pejoratives, so content sites should weigh the association. Naming: surname or place + .farm is the natural pattern; category + .farm (berry, dairy) fits single-product brands.",
      bestFor: ["Family farms & direct selling", "Organic & fresh food brands", "Farm stays & agritourism", "Agtech & compute-cluster projects"],
      namingTips: [
        "Surname/place + .farm feels native and builds local trust",
        "About $8 to register, $31/yr to renew — affordable for small producers",
        "Food e-commerce needs licenses and cold chain — credentials first",
        "Content sites beware the \"content farm\" connotation",
      ],
    },
  },
  blue: {
    tld: "blue",
    zh: {
      title: ".blue 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".blue 把品牌色写进域名，适合以蓝色为主视觉的品牌、海洋与航空主题项目。查看 .blue 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .blue 域名。",
      intro:
        ".blue 是「颜色系」后缀里最商务的一个：蓝色在视觉语言里代表专业、冷静与信任，金融、科技、医疗类品牌的主色十有八九是蓝。如果你的品牌视觉以蓝为主，name.blue 等于把 VI 写进了域名——jet.blue 式的组合就是教科书案例（JetBlue 真的把 jetblue.com 之外的品牌延伸做到了颜色域名上）。第二层是字面语义：海洋保护组织、潜水俱乐部、航空航天项目、爵士与布鲁斯音乐（blues）站点都能借「blue」的意象。Identity Digital 运营，注册约 $13（约 ¥94），续费约 $20/年（约 ¥145）——续费比注册没贵多少，是颜色系里定价最厚道的档位。库存极好：常用词、品牌词基本随便挑。注意两点：一是颜色后缀的指向性弱于行业后缀，用户看到 .blue 猜不出你做什么，品牌解释成本要靠首屏补齐；二是「feeling blue」在英语里有忧郁的意思，情感健康类项目用它反而可以借题发挥，但普通商务站要避免负面歧义。命名上「品牌词 + .blue」最自然，海洋/天空类项目用「意象词 + .blue」也顺。",
      bestFor: ["以蓝色为主视觉的品牌", "海洋保护与潜水项目", "航空航天与天空主题", "爵士/布鲁斯音乐站点"],
      namingTips: [
        "「品牌词 + .blue」把 VI 写进域名：jet.blue 式",
        "注册约 $13、续费约 $20/年，颜色系里定价最厚道",
        "颜色后缀不自带行业指向，首屏要讲清你做什么",
        "「feeling blue」有忧郁义，普通商务站注意语境",
      ],
    },
    en: {
      title: ".blue Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".blue writes your brand color into the domain — for blue-first brands, ocean and aviation projects. See live pricing and naming advice, then hunt available .blue names with AI.",
      intro:
        ".blue is the most businesslike of the color TLDs: blue signals professionalism, calm and trust, and it's the primary color of most finance, tech and healthcare brands. If your visual identity leads with blue, name.blue writes the brand book into the address bar — jet.blue is the textbook case (JetBlue really does extend its brand onto the color domain). The literal layer works too: ocean conservation groups, dive clubs, aviation and aerospace projects, and jazz or blues music sites all borrow the imagery. Operated by Identity Digital, about $13 to register and $20/yr to renew — renewal barely above registration, the fairest pricing in the color family. Inventory is excellent: common words and brand roots are largely wide open. Two cautions: color suffixes carry no industry signal, so visitors can't guess what you do from .blue alone — the homepage must close that gap fast; and \"feeling blue\" means melancholy in English, which mental-wellness projects can play on deliberately but ordinary business sites should mind. Naming: brand word + .blue is the natural pattern; imagery word + .blue suits ocean and sky projects.",
      bestFor: ["Blue-first brand identities", "Ocean conservation & diving", "Aviation & sky-themed projects", "Jazz & blues music sites"],
      namingTips: [
        "Brand word + .blue writes the VI into the domain: jet.blue",
        "About $13 to register, $20/yr to renew — fairest color-TLD pricing",
        "Color TLDs carry no industry signal — explain yourself above the fold",
        "\"Feeling blue\" means melancholy — mind the context",
      ],
    },
  },
  pink: {
    tld: "pink",
    zh: {
      title: ".pink 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".pink 适合美妆时尚、甜品烘焙与少女感品牌，也是公益粉红丝带项目的天然后缀。查看 .pink 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .pink 域名。",
      intro:
        ".pink 的气质极其鲜明：甜美、柔软、少女感。美妆与美甲品牌、时尚饰品与小众设计、甜品烘焙与下午茶、婚礼与花艺工作室用 name.pink，视觉调性从域名就开始统一——用户还没进站，脑海里已经有了粉色的画面。这份「一眼定调」是行业后缀给不了的。它还有一层公益语义：粉红丝带（乳腺癌防治）相关的公益项目与健康科普站用 .pink 名正言顺。Identity Digital 运营，注册约 $8（约 ¥59），续费约 $21/年（约 ¥152），入门与长期成本都很温和。库存极好：品牌词、昵称、叠词几乎都有货。注意三点：一是气质即限制——.pink 的甜美调性放在严肃行业（法律、金融）会显得轻佻，选它前先确认品牌真的要这个味道；二是颜色后缀不自带行业指向，首屏要快速讲清业务；三是面向男性为主的客群时要斟酌，别让后缀劝退一半用户。命名上「品牌词/昵称 + .pink」最自然，公益项目用「主题词 + .pink」也顺。",
      bestFor: ["美妆美甲与时尚品牌", "甜品烘焙与下午茶", "婚礼花艺与少女感设计", "粉红丝带公益项目"],
      namingTips: [
        "「品牌词/昵称 + .pink」一眼定调，视觉从域名开始统一",
        "注册约 $8、续费约 $21/年，长期成本温和",
        "甜美气质即限制：严肃行业慎用",
        "颜色后缀无行业指向，首屏快速讲清业务",
      ],
    },
    en: {
      title: ".pink Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".pink suits beauty, fashion, bakeries and sweet-toned brands — and pink-ribbon causes. See live pricing and naming advice, then hunt available .pink names with AI.",
      intro:
        ".pink has the most vivid personality of any color TLD: sweet, soft, playful. Beauty and nail brands, fashion accessories and indie designers, bakeries and afternoon-tea rooms, wedding and floral studios on name.pink set their visual tone before the visitor even arrives — the domain paints the picture. No industry suffix can do that. There's a cause layer too: pink-ribbon breast-cancer awareness projects and women's-health education sites wear .pink with full legitimacy. Operated by Identity Digital, about $8 to register and $21/yr to renew — gentle entry and long-term costs. Inventory is excellent: brand words, nicknames and doubled cute forms are nearly all open. Three cautions: the personality is also the constraint — .pink's sweetness reads flippant in serious industries like law or finance, so confirm the brand really wants this flavor; color suffixes carry no industry signal, so the homepage must state the business fast; and think twice if your audience skews male — don't let the suffix turn away half your users. Naming: brand word or nickname + .pink is the natural pattern; theme word + .pink fits cause projects.",
      bestFor: ["Beauty, nails & fashion brands", "Bakeries & afternoon tea", "Wedding, floral & cute-toned design", "Pink-ribbon awareness causes"],
      namingTips: [
        "Brand word/nickname + .pink sets the tone at a glance",
        "About $8 to register, $21/yr to renew — gentle long-term cost",
        "The sweetness is the constraint: skip it for serious industries",
        "No industry signal in a color — state your business above the fold",
      ],
    },
  },
  black: {
    tld: "black",
    zh: {
      title: ".black 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".black 自带高级感与神秘感，适合奢侈品牌、黑金会员体系与暗黑美学项目。查看 .black 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .black 域名。",
      intro:
        ".black 是颜色系里的「高定款」：黑色在品牌语言里代表高级、克制与神秘，奢侈品与设计师品牌、高端会员体系（黑卡、黑金）、威士忌与咖啡（深烘）、暗黑美学的游戏与潮牌都能用 name.black 把调性焊死在域名上。「Black Friday」促销专题站、black-tie 级别的活动品牌也顺手。相比 .blue/.pink 的活泼，.black 的溢价感更强，也因此定价更高：Identity Digital 运营，注册约 $16（约 ¥115），续费约 $52/年（约 ¥374）——续费是本批最高档，预算必须按续费核算，认真经营的品牌才值得。库存极好：高级词汇、品牌词大多可注册。注意三点：一是「black」在部分语境有负面联想（黑市、黑名单），金融与交易类项目要谨慎；二是高续费决定了它只适合品牌主域或核心营销域，不适合囤域名；三是颜色后缀无行业指向，首屏要讲清业务。命名上「品牌词 + .black」最自然，「品类词 + .black」适合黑金版/尊享版产品线。",
      bestFor: ["奢侈品与设计师品牌", "黑卡/黑金会员体系", "威士忌、深烘咖啡等品鉴品牌", "暗黑美学游戏与潮牌"],
      namingTips: [
        "「品牌词 + .black」把高级感焊死在域名上",
        "注册约 $16 但续费约 $52/年，本批最高，按续费核算",
        "「black」有黑市/黑名单联想，金融交易类慎用",
        "高续费只配品牌主域，不适合囤名",
      ],
    },
    en: {
      title: ".black Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".black carries built-in luxury and mystique — for premium brands, black-tier memberships and dark-aesthetic projects. See live pricing and naming advice, then hunt available .black names with AI.",
      intro:
        ".black is the couture piece of the color family: black means luxury, restraint and mystique in brand language, so designer labels, premium membership tiers (black cards), whisky and dark-roast coffee brands, and dark-aesthetic games or streetwear can weld their tone into name.black. Black Friday campaign sites and black-tie event brands fit naturally too. That premium feel comes with premium pricing: operated by Identity Digital, about $16 to register and $52/yr to renew — the highest renewal in this batch, so budget strictly on the renewal; it only pays for a brand you'll seriously run. Inventory is excellent: premium words and brand roots are mostly open. Three cautions: \"black\" carries negative senses in some contexts (black market, blacklist), so finance and trading projects should weigh it; the renewal price makes it a flagship-domain play, not a hoarding play; and color suffixes carry no industry signal — state your business above the fold. Naming: brand word + .black is the natural pattern; category + .black suits black-tier product lines.",
      bestFor: ["Luxury & designer brands", "Black-card membership tiers", "Whisky, dark-roast & connoisseur brands", "Dark-aesthetic games & streetwear"],
      namingTips: [
        "Brand word + .black welds luxury into the domain",
        "~$16 to register but ~$52/yr renewal — highest here, budget on renewal",
        "\"Black\" can read black-market — mind finance/trading contexts",
        "The renewal price fits flagship domains only, not hoarding",
      ],
    },
  },
  ninja: {
    tld: "ninja",
    zh: {
      title: ".ninja 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".ninja 是「某领域高手」的梗后缀，适合开发者工具、个人技术品牌与游戏电竞项目。查看 .ninja 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .ninja 域名。",
      intro:
        ".ninja 是互联网俚语进后缀的代表作：英语里「X ninja」就是「X 领域的高手」，code ninja、data ninja 早已是招聘启事里的熟词。开发者工具与 API 服务（api.ninja 式）、个人技术品牌与作品集、游戏电竞战队、效率工具都能借这个梗——它比 .expert 年轻、比 .pro 有趣，天然适合极客与游戏文化的受众。Identity Digital 运营，注册约 $6（约 ¥41）很低，续费约 $25/年（约 ¥182）也温和，试错成本几乎可以忽略。库存极好：技能词、工具词、昵称几乎随便挑。注意三点：一是梗后缀的调性偏轻，严肃 B2B 或面向传统企业的产品用它会打折扣；二是「ninja」的高手隐喻在英语圈最强，非英语市场的用户未必接得住梗；三是有声音认为用忍者比喻职场技能对日本文化不够严肃，大品牌营销要斟酌。命名上「技能/领域词 + .ninja」最强（api、css、seo 类），个人品牌用「昵称 + .ninja」也顺。",
      bestFor: ["开发者工具与 API 服务", "个人技术品牌与作品集", "游戏电竞战队与社区", "效率工具与自动化项目"],
      namingTips: [
        "「技能词 + .ninja」= 某领域高手：api.ninja 式",
        "注册约 $6、续费约 $25/年，试错成本极低",
        "梗后缀调性轻，严肃 B2B 慎用",
        "「ninja」的梗在英语圈最强，非英语市场要斟酌",
      ],
    },
    en: {
      title: ".ninja Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".ninja is the \"master of X\" meme suffix — for developer tools, personal tech brands and gaming projects. See live pricing and naming advice, then hunt available .ninja names with AI.",
      intro:
        ".ninja is internet slang graduated into a TLD: \"X ninja\" means a master of X, and code ninja or data ninja have been job-listing clichés for a decade. Developer tools and API services (the api.ninja pattern), personal tech brands and portfolios, esports teams and productivity tools all ride the meme — younger than .expert, more fun than .pro, and native to geek and gaming culture. Operated by Identity Digital, registration is a low ~$6 with renewal around $25/yr — trial cost is nearly negligible. Inventory is excellent: skill words, tool words and nicknames are wide open. Three cautions: meme suffixes read casual, so serious B2B products or traditional-enterprise audiences will discount it; the \"ninja = master\" metaphor is strongest in English-speaking markets and may not land elsewhere; and some argue the ninja-as-job-skill trope treats Japanese culture too lightly — big-brand marketing should weigh that. Naming: skill or field word + .ninja is the strongest play (api, css, seo); nickname + .ninja fits personal brands.",
      bestFor: ["Developer tools & API services", "Personal tech brands & portfolios", "Esports teams & gaming communities", "Productivity & automation tools"],
      namingTips: [
        "Skill word + .ninja = master of the field: api.ninja",
        "About $6 to register, $25/yr to renew — negligible trial cost",
        "Meme suffixes read casual — weigh it for serious B2B",
        "The ninja meme is strongest in English markets",
      ],
    },
  },
  rocks: {
    tld: "rocks",
    zh: {
      title: ".rocks 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".rocks 把「X 真棒」写进域名，适合粉丝站、乐队与社区项目，注册价极低。查看 .rocks 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .rocks 域名。",
      intro:
        ".rocks 是一句喝彩：英语里「X rocks!」就是「X 真棒！」，name.rocks 读出来自带感叹号。粉丝站与应援站（偶像、球队、开源项目）、乐队与音乐现场、社区与聚会组织用它，热情从域名就溢出来——vue 社区的 vuejs.rocks 式用法就是典型。它还有字面层：地质与矿石科普、攀岩馆、宝石与矿物收藏站用 .rocks 一语双关。Identity Digital 运营，注册约 $4（约 ¥26）是本批最低价，续费约 $18/年（约 ¥130）也在低位——几乎是零门槛的表达型后缀。库存极好：人名、项目名、城市名基本都有货。注意三点：一是「X rocks」是口语化表达，正式商务场景会显得随意，它更适合社区与副项目而非公司主域；二是表达型后缀的语义全靠主体名撑，「名字 + rocks」要读得通顺才有梗（球队名、偶像名最顺）；三是低价后缀历史上垃圾站占比偏高，认真项目要靠内容质量把信任拉回来。命名上「你喜爱的对象 + .rocks」最自然，攀岩/地质项目用字面义也顺。",
      bestFor: ["粉丝站与应援站", "乐队与音乐现场", "开源项目与社区站", "攀岩馆与地质科普"],
      namingTips: [
        "「对象 + .rocks」= 一句喝彩，读出来要顺口",
        "注册约 $4、续费约 $18/年，本批最低门槛",
        "口语化表达，适合社区与副项目而非公司主域",
        "低价后缀信任分靠内容质量拉回",
      ],
    },
    en: {
      title: ".rocks Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".rocks puts \"X rocks!\" in the domain — for fan sites, bands and communities, at rock-bottom prices. See live pricing and naming advice, then hunt available .rocks names with AI.",
      intro:
        ".rocks is a cheer in a domain: \"X rocks!\" is pure enthusiasm, and name.rocks reads with a built-in exclamation mark. Fan sites (idols, sports teams, open-source projects), bands and live-music venues, communities and meetup groups wear it naturally — the vuejs.rocks pattern is the canonical open-source example. The literal layer works too: geology education, climbing gyms, and gem or mineral collections get a pun for free. Operated by Identity Digital, registration around $4 is the lowest in this batch, and renewal at ~$18/yr stays low — an almost zero-barrier expressive suffix. Inventory is excellent: names, project names and city names are mostly open. Three cautions: \"X rocks\" is colloquial and reads casual in formal business contexts — it suits communities and side projects more than corporate flagships; expressive suffixes lean entirely on the subject word, so name + rocks must read smoothly to land the joke (team and idol names work best); and cheap TLDs historically attract spam, so serious projects must earn trust back with content quality. Naming: the thing you love + .rocks is the natural pattern; climbing and geology projects can play it literal.",
      bestFor: ["Fan sites & supporter hubs", "Bands & live-music venues", "Open-source projects & communities", "Climbing gyms & geology education"],
      namingTips: [
        "Subject + .rocks is a cheer — it must read smoothly aloud",
        "About $4 to register, $18/yr to renew — lowest barrier here",
        "Colloquial tone: for communities and side projects, not corporate flagships",
        "Cheap TLDs attract spam — earn trust back with content",
      ],
    },
  },
  pet: {
    tld: "pet",
    zh: {
      title: ".pet 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".pet 是宠物行业的专属后缀，适合宠物店、宠物医疗与宠物科技品牌。查看 .pet 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .pet 域名。",
      intro:
        ".pet 是行业指向最明确的后缀之一：三个字母写清「这是宠物生意」。宠物用品电商与线下门店、宠物医院与上门服务、宠物美容与寄养、宠物科技（智能喂食器、定位器）用 name.pet，行业属性一秒传达，且比 petsomething.com 的拼接短得多——mars.pet（玛氏宠物）这样的大公司品牌延伸就是背书。宠物经济是持续增长的赛道，「它经济」下新品牌层出不穷，而好记的 pet 组合在 .com 上早被占光，.pet 的库存优势非常实在。Identity Digital 运营，注册约 $11（约 ¥78），续费约 $21/年（约 ¥152），对客单价可观的宠物行业毫无压力。库存极好：动物名、昵称、服务词命中率高。注意三点：一是宠物医疗涉及执业资质，诊疗类站点要把资质挂上首屏；二是「pet」在英语里也有「爱称/抚摸」的义项，但语境极少歧义，可放心用；三是面向国内用户 .pet 认知度一般，建议配合中文品牌词强化记忆。命名上「品牌词/动物名 + .pet」最自然，服务类用「动词/服务词 + .pet」也顺。",
      bestFor: ["宠物用品电商与门店", "宠物医院与上门服务", "宠物美容寄养与训练", "宠物科技与智能硬件"],
      namingTips: [
        "「品牌词/动物名 + .pet」三个字母写清行业",
        "注册约 $11、续费约 $21/年，宠物行业毫无压力",
        "诊疗类站点把执业资质挂上首屏",
        "国内认知度一般，配合中文品牌词强化记忆",
      ],
    },
    en: {
      title: ".pet Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".pet is the pet industry's own suffix — for pet shops, vet services and pet-tech brands. See live pricing and naming advice, then hunt available .pet names with AI.",
      intro:
        ".pet is among the most industry-explicit suffixes anywhere: three letters that say \"this is a pet business\". Pet-supply e-commerce and physical stores, veterinary clinics and mobile services, grooming and boarding, and pet tech (smart feeders, GPS trackers) on name.pet communicate the industry instantly — and far shorter than any petsomething.com compound. Corporate brand extensions like mars.pet (Mars Petcare) endorse the suffix at the highest level. The pet economy keeps compounding, new brands launch constantly, and the memorable pet-word combos were strip-mined from .com long ago — .pet's inventory advantage is real. Operated by Identity Digital, about $11 to register and $21/yr to renew — trivial for an industry with healthy ticket sizes. Inventory is excellent: animal names, nicknames and service words hit well. Three cautions: veterinary services require licensing, so clinical sites should put credentials above the fold; \"pet\" has minor secondary senses in English (a term of endearment) but context makes ambiguity vanishingly rare; and recognition among mainland-Chinese consumers is moderate, so pair it with a strong Chinese brand name there. Naming: brand word or animal name + .pet is the natural pattern; verb or service word + .pet suits service businesses.",
      bestFor: ["Pet-supply e-commerce & stores", "Vet clinics & mobile services", "Grooming, boarding & training", "Pet tech & smart hardware"],
      namingTips: [
        "Brand/animal name + .pet says the industry in three letters",
        "About $11 to register, $21/yr to renew — trivial for this industry",
        "Clinical sites need licensing credentials above the fold",
        "Pair with a Chinese brand name for mainland recognition",
      ],
    },
  },
  academy: {
    tld: "academy",
    zh: {
      title: ".academy 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".academy 把「学院」写进域名，适合在线课程、培训机构与技能学习社区。查看 .academy 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .academy 域名。",
      intro:
        ".academy 把「学院」两个字直接写进域名：在线课程平台、编程训练营、企业培训、体育与艺术培训机构用 name.academy，「这里教东西」的定位一秒传达。它比 .school 更「进阶」——academy 一词在英语里自带体系化、专业化的意味，适合成建制的课程体系而非单节课；Khan Academy 把这个词在教育界的认知推到了顶点，很多品牌学院（brand academy）式的企业培训站也爱用它。Identity Digital 运营，注册约 $12（约 ¥85），续费约 $38/年（约 ¥271），对客单价高的教育产品完全无压力。库存很好：学科词、技能词、城市名基本都有货。注意三点：一是 academy 一共七个字母，配的主体名要短，否则域名整体过长；二是它不是学历教育的资质证明，正规院校资质要在页面上另行呈现；三是面向纯国内用户认知度一般，建议中文品牌词同步露出。命名上「学科/技能 + .academy」最自然（code、design、yoga 类），品牌学院用「品牌词 + .academy」也顺。",
      bestFor: ["在线课程与训练营", "企业培训与品牌学院", "体育艺术培训机构", "技能学习社区"],
      namingTips: [
        "「学科/技能词 + .academy」定位一秒传达",
        "academy 已有七个字母，主体名要短",
        "注册约 $12、续费约 $38/年，教育产品无压力",
        "不是办学资质，正规资质要页面另行呈现",
      ],
    },
    en: {
      title: ".academy Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".academy puts structured learning in the domain — for online courses, bootcamps and training programs. See live pricing and naming advice, then hunt available .academy names with AI.",
      intro:
        ".academy writes \"we teach this\" straight into the domain: online course platforms, coding bootcamps, corporate training programs, and sports or arts academies on name.academy communicate their purpose instantly. It reads a notch more advanced than .school — \"academy\" carries a sense of structured, professional curriculum rather than a single lesson, and Khan Academy pushed the word's education association to its peak; brand-academy style corporate training sites love it too. Operated by Identity Digital, registration runs about $12 with renewal around $38/yr — trivial for education products with real ticket sizes. Inventory is strong: subject words, skill words and city names are mostly open. Three cautions: at seven letters, .academy needs a short subject word or the whole domain gets long; it is not an accreditation — formal credentials belong on the page, not in the TLD; and recognition among non-English audiences is moderate. Naming: subject or skill + .academy is the natural pattern (code, design, yoga); brand word + .academy fits corporate academies.",
      bestFor: ["Online courses & bootcamps", "Corporate training & brand academies", "Sports & arts academies", "Skill-learning communities"],
      namingTips: [
        "Subject/skill + .academy says what you teach instantly",
        "Seven letters already — keep the subject word short",
        "About $12 to register, $38/yr to renew",
        "Not an accreditation — show credentials on the page",
      ],
    },
  },
  school: {
    tld: "school",
    zh: {
      title: ".school 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".school 是教育行业的直白后缀，适合学校官网、课外班与在线学习项目，注册价很低。查看 .school 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .school 域名。",
      intro:
        ".school 是教育后缀里最直白的一个：不管是实体学校、课外培训班、驾校舞校，还是在线学习项目，name.school 读出来就是「一所学校」。相比 .academy 的进阶感，.school 更亲切日常，适合面向孩子与家长的场景——幼儿园、K12 课外班、兴趣班的气质刚好；「学一门手艺」类的在线项目（如 sourdough.school 式的烘焙教学）用它也很出彩。Identity Digital 运营，注册约 $6（约 ¥41）是教育后缀里的低位，续费约 $29/年（约 ¥211）也温和，试错成本低。库存极好：学科、技能、城市与品牌词命中率都高。注意三点：一是它不代表办学资质，正规学历教育机构的资质信息要另行呈现，部分家长会先看资质再看域名；二是 school 六个字母不算短，主体名尽量短；三是国内公办学校体系有专属域名习惯（.edu.cn），.school 更适合民办与市场化教育品牌。命名上「学科/技能 + .school」最自然，实体学校用「校名/地名 + .school」也顺。",
      bestFor: ["课外班与兴趣班", "驾校舞校等技能学校", "在线学习项目", "民办学校与教育品牌"],
      namingTips: [
        "「学科/技能 + .school」读出来就是一所学校",
        "注册约 $6、续费约 $29/年，教育后缀低位",
        "不代表办学资质，正规资质另行呈现",
        "国内学历教育习惯 .edu.cn，.school 适合市场化品牌",
      ],
    },
    en: {
      title: ".school Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".school is education's most literal suffix — for schools, classes and online learning projects, at a low entry price. See live pricing and naming advice, then hunt available .school names with AI.",
      intro:
        ".school is the most literal education suffix there is: a physical school, an after-school program, a driving or dance school, or an online learning project on name.school reads exactly as what it is. Where .academy leans structured and advanced, .school feels warm and everyday — right for anything aimed at kids and parents, and charming for learn-a-craft projects (the sourdough.school pattern for baking instruction is a classic). Operated by Identity Digital, registration around $6 is the low end among education suffixes, with renewal near $29/yr — cheap to try. Inventory is excellent: subjects, skills, city and brand words all hit well. Three cautions: the TLD is not an accreditation — formal institutions should present credentials separately, since parents check those first; school is six letters, so keep the subject word short; and state education systems often have their own conventions (like .edu), making .school best for private and market-facing education brands. Naming: subject or skill + .school is the natural pattern; physical schools can use name or place + .school.",
      bestFor: ["After-school & hobby classes", "Driving, dance & trade schools", "Online learning projects", "Private schools & education brands"],
      namingTips: [
        "Subject/skill + .school reads as exactly what it is",
        "About $6 to register, $29/yr to renew — cheap to try",
        "Not an accreditation — present credentials separately",
        "Best for private, market-facing education brands",
      ],
    },
  },
  coach: {
    tld: "coach",
    zh: {
      title: ".coach 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".coach 是教练经济的专属后缀，适合私教、人生教练与体育教练的个人品牌。查看 .coach 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .coach 域名。",
      intro:
        ".coach 踩中了「教练经济」的爆发：健身私教、人生教练（life coach）、职业教练、体育教练、企业高管教练——凡是「一对一带你变强」的生意，name.coach 都是身份即域名。教练行业的获客核心是个人信任，域名里直接写明「我是教练」比任何 slogan 都高效；life.coach 这样的组合甚至本身就是品类词。Identity Digital 运营，注册约 $11（约 ¥78）不高，但续费约 $62/年（约 ¥449）在本站后缀里偏贵，适合把域名当获客资产而非囤货的从业者。库存很好：细分领域词、人名、动词组合命中率高。注意三点：一是续费价要提前算进年度预算，个人从业者别注册一堆闲置；二是「coach」在英语里也指长途大巴与奢侈品牌 Coach，但教练语境下歧义很小；三是教练资质认证（ICF 等）是信任的另一半，域名之外要把认证挂出来。命名上「细分领域 + .coach」最强（fitness、career、mindset 类），个人品牌用「人名 + .coach」最直接。",
      bestFor: ["健身私教与运动教练", "人生教练与职业教练", "高管教练与企业教练", "教练课程与社区"],
      namingTips: [
        "「细分领域 + .coach」身份即域名",
        "注册约 $11、续费约 $62/年，续费要算进预算",
        "「人名 + .coach」最适合个人品牌",
        "ICF 等资质认证与域名配合建立信任",
      ],
    },
    en: {
      title: ".coach Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".coach is the coaching economy's own suffix — for personal trainers, life coaches and sports coaches. See live pricing and naming advice, then hunt available .coach names with AI.",
      intro:
        ".coach rides the coaching-economy boom: personal trainers, life coaches, career coaches, sports coaches, executive coaches — any one-on-one \"I make you better\" business turns identity into a domain with name.coach. Client acquisition in coaching runs on personal trust, and stating \"I am a coach\" in the domain itself beats any slogan; combos like life.coach are practically category keywords. Operated by Identity Digital, registration is a reasonable ~$11, but renewal around $62/yr sits at the pricier end here — best for practitioners treating the domain as a client-acquisition asset rather than a collectible. Inventory is strong: niche words, personal names and verb combos hit well. Three cautions: budget the renewal up front and don't stockpile idle names; \"coach\" also means a bus and the luxury brand Coach in English, though coaching context leaves little ambiguity; and certifications (ICF and the like) are the other half of trust — display them alongside the domain. Naming: niche + .coach is the strongest play (fitness, career, mindset); your own name + .coach is the most direct personal brand.",
      bestFor: ["Personal trainers & sports coaches", "Life & career coaches", "Executive & business coaches", "Coaching courses & communities"],
      namingTips: [
        "Niche + .coach turns identity into the domain",
        "About $11 to register, $62/yr to renew — budget it",
        "Your name + .coach is the most direct personal brand",
        "Pair the domain with certifications (ICF etc.) for trust",
      ],
    },
  },
  care: {
    tld: "care",
    zh: {
      title: ".care 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".care 把「关怀」写进域名，适合医疗健康、养老护理与客户服务品牌。查看 .care 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .care 域名。",
      intro:
        ".care 是温度最高的后缀之一：医疗健康服务、养老与居家护理、心理健康、母婴护理、宠物护理，甚至企业的客户关怀入口（support/care 页），name.care 都把「我们在乎你」写进了域名。护理经济随老龄化持续扩张，home.care、senior care 类的组合本身就是搜索品类词；企业侧把 brand.care 用作客服与售后入口也是国际大牌的成熟玩法。Identity Digital 运营，注册约 $12（约 ¥85），续费约 $36/年（约 ¥256），对医疗与护理行业的客单价来说毫无压力。库存很好：人群词、场景词、品牌词命中率高。注意三点：一是医疗类站点涉及执业资质与合规（广告法对医疗宣传的限制），资质信息必须清晰呈现；二是「care」语义偏服务与情感，硬科技或工具类产品用它气质错位；三是面向国内用户认知度一般，配合中文品牌词更稳。命名上「人群/场景 + .care」最自然（senior、home、baby 类），品牌客服入口用「品牌词 + .care」。",
      bestFor: ["医疗健康与诊所", "养老护理与居家照护", "心理健康与母婴护理", "品牌客户关怀入口"],
      namingTips: [
        "「人群/场景 + .care」是天然品类词",
        "注册约 $12、续费约 $36/年，护理行业无压力",
        "医疗站点资质与合规信息必须清晰呈现",
        "「品牌词 + .care」可做客服售后入口",
      ],
    },
    en: {
      title: ".care Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".care puts compassion in the domain — for healthcare, senior care and customer-care brands. See live pricing and naming advice, then hunt available .care names with AI.",
      intro:
        ".care is one of the warmest suffixes on the market: healthcare services, senior and home care, mental health, mother-and-baby care, pet care — and even a brand's customer-care portal — all say \"we care about you\" right in the domain with name.care. The care economy keeps expanding with aging populations, and combos like home.care read as search-category keywords in themselves; global brands also use brand.care as a mature pattern for support and after-sales portals. Operated by Identity Digital, about $12 to register and $36/yr to renew — negligible against healthcare-grade ticket sizes. Inventory is strong: audience words, scenario words and brand words all hit well. Three cautions: medical sites carry licensing and advertising-compliance obligations, so credentials must be presented clearly; \"care\" reads service-oriented and emotional — a hard-tech or developer-tool product on .care feels mismatched; and recognition in non-English markets is moderate. Naming: audience or scenario + .care is the natural pattern (senior, home, baby); brand word + .care works for customer-care portals.",
      bestFor: ["Healthcare services & clinics", "Senior & home care", "Mental health & baby care", "Brand customer-care portals"],
      namingTips: [
        "Audience/scenario + .care reads as a category keyword",
        "About $12 to register, $36/yr to renew",
        "Medical sites must present licensing clearly",
        "Brand + .care works as a support portal",
      ],
    },
  },
  doctor: {
    tld: "doctor",
    zh: {
      title: ".doctor 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".doctor 把医生身份写进域名，适合诊所、医生个人品牌与在线问诊服务。查看 .doctor 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .doctor 域名。",
      intro:
        ".doctor 是身份感最强的后缀之一：医生个人品牌、私人诊所、在线问诊、口腔眼科等专科服务用 name.doctor，专业身份从域名开始建立。它的妙处还在引申义——「X 医生」在中英文里都是「解决 X 问题的专家」的通用比喻，bike doctor、plant doctor 式的维修与养护生意用它自带亲切感，family.doctor 这样的组合更是天然品类词。Identity Digital 运营，注册约 $8（约 ¥59）不高，但续费约 $93/年（约 ¥671）是本站最贵档之一——它适合把域名当门面资产的执业者，不适合囤货。库存很好：科室词、人名、维修类比喻词命中率高。注意三点：一是续费价必须提前算进预算，这是典型的「首年甜、续费贵」后缀；二是医疗语境下用 .doctor 有暗示执业资质之嫌，真实资质信息必须在页面清晰呈现，非医疗的比喻用法反而没这个包袱；三是国内在线问诊受严格监管，合规先行。命名上「科室/专长 + .doctor」最自然，维修养护生意用「对象 + .doctor」的比喻也讨喜。",
      bestFor: ["医生个人品牌与诊所", "在线问诊与专科服务", "口腔眼科等专科门诊", "维修养护类「X 医生」品牌"],
      namingTips: [
        "「科室/专长 + .doctor」身份从域名开始",
        "注册约 $8 但续费约 $93/年，必须算进预算",
        "医疗站点资质必须清晰呈现，避免资质暗示争议",
        "「对象 + .doctor」的维修比喻（bike doctor 式）很讨喜",
      ],
    },
    en: {
      title: ".doctor Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".doctor puts the white coat in the domain — for clinics, physician brands and telehealth, plus \"X doctor\" repair brands. See live pricing and naming advice, then hunt available .doctor names with AI.",
      intro:
        ".doctor carries more identity than almost any suffix: physician personal brands, private clinics, telehealth services and specialist practices on name.doctor start building authority from the address itself. The metaphorical layer is just as useful — \"X doctor\" universally means \"the expert who fixes X\", so bike doctor or plant doctor style repair and maintenance businesses get instant warmth, and combos like family.doctor are category keywords outright. Operated by Identity Digital, registration is a modest ~$8, but renewal around $93/yr is among the priciest here — for practitioners treating the domain as a storefront asset, not for stockpiling. Inventory is strong: specialty words, names and repair metaphors all hit. Three cautions: this is the classic cheap-first-year, expensive-renewal suffix — budget it; in medical contexts a .doctor domain can imply licensure, so real credentials must be displayed clearly (metaphorical uses carry no such burden); and telehealth is heavily regulated in many markets — compliance first. Naming: specialty + .doctor is the natural pattern; object + .doctor makes charming repair brands.",
      bestFor: ["Physician brands & clinics", "Telehealth & specialist services", "Dental, eye & specialty practices", "\"X doctor\" repair & care brands"],
      namingTips: [
        "Specialty + .doctor builds authority from the address",
        "About $8 to register but $93/yr to renew — budget it",
        "Medical sites must display real credentials clearly",
        "Object + .doctor makes charming repair brands (bike doctor)",
      ],
    },
  },
  restaurant: {
    tld: "restaurant",
    zh: {
      title: ".restaurant 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".restaurant 把餐厅身份写进域名，适合实体餐厅、连锁品牌与餐饮预订平台。查看 .restaurant 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .restaurant 域名。",
      intro:
        ".restaurant 是餐饮行业的全拼后缀：实体餐厅、连锁品牌、餐饮集团、预订与点评平台用 name.restaurant，行业身份一目了然。餐厅命名的痛点是店名往往是人名、地名或常见词——这些词的 .com 几乎必然被占，而「店名 + .restaurant」组合的库存极好，几乎随便挑；对多品牌餐饮集团来说，用统一的 .restaurant 后缀归拢旗下品牌官网也很优雅。Identity Digital 运营，注册约 $13（约 ¥94），续费约 $52/年（约 ¥374），对一家正经餐厅的经营成本来说可以忽略。注意三点：一是 restaurant 十个字母是本站最长后缀，店名必须短，否则域名难拼难念；二是食客更多从地图与点评平台进店，域名的角色是菜单、订座与品牌官网的稳定入口，配合 Google Maps/大众点评的主页链接使用；三是快餐、咖啡、酒吧等细分业态有更贴的后缀（.cafe、.bar、.pizza），全服务餐厅才最适合 .restaurant。命名上「店名 + .restaurant」最自然，本地生意用「地名/菜系 + .restaurant」也顺。",
      bestFor: ["实体餐厅与连锁品牌", "餐饮集团多品牌官网", "预订与点评平台", "菜系与主题餐厅"],
      namingTips: [
        "「店名 + .restaurant」行业身份一目了然",
        "restaurant 十个字母，店名必须短",
        "注册约 $13、续费约 $52/年，餐厅成本可忽略",
        "快餐咖啡酒吧有更贴的 .cafe/.bar/.pizza",
      ],
    },
    en: {
      title: ".restaurant Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".restaurant spells the business out in full — for restaurants, chains and dining platforms. See live pricing and naming advice, then hunt available .restaurant names with AI.",
      intro:
        ".restaurant spells the whole business into the domain: restaurants, chains, hospitality groups, and booking or review platforms on name.restaurant are unmistakable. It solves a real naming pain — restaurant names are typically personal names, places or common words whose .com vanished decades ago, while name + .restaurant inventory is wide open; hospitality groups can also elegantly unify multiple brand sites under one suffix. Operated by Identity Digital, about $13 to register and $52/yr to renew — a rounding error against real restaurant operating costs. Three cautions: at ten letters this is the longest suffix on this site, so the name in front must be short or the domain becomes unwieldy; diners mostly arrive via maps and review platforms, so the domain's job is a stable home for the menu, reservations and brand — link it from Google Maps and the like; and fast food, coffee and bars have tighter fits (.cafe, .bar, .pizza) — full-service restaurants benefit most. Naming: the restaurant's name + .restaurant is the natural pattern; place or cuisine + .restaurant works for local businesses.",
      bestFor: ["Restaurants & chains", "Hospitality group brand sites", "Booking & review platforms", "Cuisine & theme restaurants"],
      namingTips: [
        "Name + .restaurant makes the business unmistakable",
        "Ten letters — the name in front must be short",
        "About $13 to register, $52/yr to renew",
        "Coffee/bars/pizza have tighter fits: .cafe/.bar/.pizza",
      ],
    },
  },
  boutique: {
    tld: "boutique",
    zh: {
      title: ".boutique 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".boutique 自带精品小店气质，适合独立设计品牌、买手店与手作工作室，首年注册极便宜。查看 .boutique 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .boutique 域名。",
      intro:
        ".boutique 一词天生带着「小而美」的气质：独立设计师品牌、买手店、古着与首饰小店、手作工作室、精品民宿用 name.boutique，「精品小店」的定位从域名开始就立住了。它与 .shop/.store 的区别在气质——后两者是货架感，.boutique 是策展感，卖的是审美与稀缺，客单价越高越合适。Identity Digital 运营，注册约 $3（约 ¥19）是本站最便宜档之一，续费约 $26/年（约 ¥189）也温和，试错成本几乎为零。库存极好：风格词、人名、材质词命中率都高。注意三点：一是 boutique 八个字母且拼写对非母语者略有门槛（-que 结尾），主体名务必短；二是它的法语血统自带「贵」的暗示，平价走量的店用它气质错位；三是词义也覆盖精品酒店与精品咨询（boutique agency/hotel），不限于零售。命名上「风格/品类 + .boutique」最自然（vintage、silk 类），主理人品牌用「人名 + .boutique」也很直接。",
      bestFor: ["独立设计品牌与买手店", "古着首饰与手作工作室", "精品民宿与精品酒店", "精品咨询与小型工作室"],
      namingTips: [
        "「风格/品类 + .boutique」策展感直给",
        "注册约 $3、续费约 $26/年，试错成本极低",
        "-que 结尾拼写有门槛，主体名务必短",
        "平价走量的店气质错位，客单价越高越合适",
      ],
    },
    en: {
      title: ".boutique Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".boutique carries small-and-beautiful curation in the name — for indie labels, concept stores and artisan studios, with a very cheap first year. See live pricing and naming advice, then hunt available .boutique names with AI.",
      intro:
        ".boutique is born with a small-and-beautiful air: independent design labels, concept and curated stores, vintage and jewelry shops, artisan studios and boutique guesthouses on name.boutique establish the \"curated, not mass\" positioning from the address itself. The contrast with .shop/.store is all about register — those read like shelves, .boutique reads like curation, selling taste and scarcity; the higher the ticket size, the better the fit. Operated by Identity Digital, registration around $3 is among the cheapest here, with renewal near $26/yr — practically zero cost to try. Inventory is excellent: style words, names and material words all hit. Three cautions: boutique is eight letters and the -que ending trips up non-native spellers, so keep the front word short; its French pedigree whispers \"expensive\" — a discount volume store on .boutique feels mismatched; and the word also covers boutique hotels and boutique agencies, not just retail. Naming: style or category + .boutique is the natural pattern (vintage, silk); founder name + .boutique is the most direct personal label.",
      bestFor: ["Indie design labels & concept stores", "Vintage, jewelry & artisan studios", "Boutique guesthouses & hotels", "Boutique agencies & small studios"],
      namingTips: [
        "Style/category + .boutique reads as curation",
        "About $3 to register, $26/yr to renew — cheap to try",
        "The -que ending trips spellers — keep the name short",
        "Wrong fit for discount volume; right for high-ticket taste",
      ],
    },
  },
  clinic: {
    tld: "clinic",
    zh: {
      title: ".clinic 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".clinic 把诊所身份写进域名，适合口腔、医美、宠物等各类诊所与门诊品牌。查看 .clinic 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .clinic 域名。",
      intro:
        ".clinic 是诊所生意的全拼后缀：口腔、眼科、皮肤、医美、理疗、心理咨询、宠物诊所——凡是「门诊制」的健康服务，name.clinic 读出来就是一家诊所。与 .care 的温度感、.doctor 的个人身份感相比，.clinic 强调的是「机构与场所」，连锁门诊用它归拢多城市站点也很顺。它还有个讨喜的引申义：英语里 clinic 也指「诊断式服务」，SEO clinic、resume clinic 式的咨询生意用它自带专业感。Identity Digital 运营，注册约 $11（约 ¥78），续费约 $52/年（约 ¥374），对诊所客单价来说毫无压力。库存很好：科室词、地名、品牌词命中率高。注意三点：一是医疗机构涉及执业许可与广告合规，资质信息必须清晰呈现；二是 clinic 一词偏「治疗」，健康管理与养生类品牌可对比 .care 的气质；三是国内就医心智以平台与公众号为主，域名更多承担品牌官网与海外患者入口。命名上「科室/专长 + .clinic」最自然，连锁品牌用「品牌词 + .clinic」，咨询生意用「问题域 + .clinic」的比喻也出彩。",
      bestFor: ["口腔眼科皮肤等专科诊所", "医美与理疗门诊", "宠物诊所与心理咨询", "诊断式咨询（X clinic）品牌"],
      namingTips: [
        "「科室/专长 + .clinic」读出来就是一家诊所",
        "注册约 $11、续费约 $52/年，诊所客单价无压力",
        "医疗执业资质与广告合规信息必须清晰呈现",
        "「问题域 + .clinic」的咨询比喻（SEO clinic 式）很专业",
      ],
    },
    en: {
      title: ".clinic Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".clinic spells the practice out in full — for dental, medspa, physio and veterinary clinics, plus \"X clinic\" consulting brands. See live pricing and naming advice, then hunt available .clinic names with AI.",
      intro:
        ".clinic spells the whole business into the domain: dental, eye, skin, medspa, physio, mental-health and veterinary practices — any walk-in health service on name.clinic reads as exactly what it is. Where .care leans warm and .doctor leans personal, .clinic emphasizes the institution and the place, and chains can neatly unify multi-city sites under it. It also has a charming extended sense: in English a \"clinic\" is any diagnostic session, so SEO clinic or resume clinic style consulting brands get instant professionalism. Operated by Identity Digital, about $11 to register and $52/yr to renew — negligible against clinic-grade ticket sizes. Inventory is strong: specialty words, place names and brand words all hit. Three cautions: medical practices carry licensing and advertising-compliance duties, so credentials must be presented clearly; \"clinic\" reads treatment-oriented — wellness and lifestyle brands may prefer the warmth of .care; and in markets where patients book via platforms, the domain's job is the brand site and international front door. Naming: specialty + .clinic is the natural pattern; brand + .clinic for chains; problem-domain + .clinic makes sharp consulting brands.",
      bestFor: ["Dental, eye & skin clinics", "Medspa & physio practices", "Veterinary & mental-health clinics", "\"X clinic\" consulting brands"],
      namingTips: [
        "Specialty + .clinic reads as exactly what it is",
        "About $11 to register, $52/yr to renew",
        "Medical sites must present licensing clearly",
        "Problem + .clinic makes sharp consulting brands (SEO clinic)",
      ],
    },
  },
  dental: {
    tld: "dental",
    zh: {
      title: ".dental 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".dental 是口腔行业的专属后缀，适合牙科诊所、正畸种植品牌与口腔护理产品。查看 .dental 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .dental 域名。",
      intro:
        ".dental 是垂直到牙齿的行业后缀：牙科诊所、正畸与种植品牌、儿童齿科、口腔护理产品、牙科技工所与耗材供应商用 name.dental，行业身份从域名开始零解释成本。牙科是本地获客竞争最激烈的医疗细分之一，诊所名大多是「人名/地名 + Dental」——这些组合的 .com 早被占光，而「同样的名字 + .dental」库存极好，还比 xxxdental.com 少打一次 dental。Identity Digital 运营，注册与续费均约 $62/年（约 ¥449）——没有首年甜头，是「平进平出」的定价，对牙科客单价来说依然不痛，但不适合囤货。注意三点：一是价格恒定意味着预算好算，也意味着没有低价试错空间，想清楚再注册；二是医疗执业资质与广告合规必须清晰呈现，种植正畸类宣传尤其受监管；三是面向消费者的口腔护理产品（牙刷牙膏类）用它也顺，但快消品牌更依赖电商平台入口。命名上「人名/地名 + .dental」最自然（smile、bright 类气质词也常用），产品品牌用「品牌词 + .dental」。",
      bestFor: ["牙科诊所与连锁门诊", "正畸种植与儿童齿科", "口腔护理产品品牌", "技工所与牙科耗材商"],
      namingTips: [
        "「人名/地名 + .dental」比 xxxdental.com 更短更顺",
        "注册与续费均约 $62/年，平进平出好算预算",
        "种植正畸宣传监管严，资质合规必须清晰",
        "smile/bright 类气质词是牙科命名常青树",
      ],
    },
    en: {
      title: ".dental Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".dental is dentistry's own suffix — for dental practices, ortho and implant brands, and oral-care products. See live pricing and naming advice, then hunt available .dental names with AI.",
      intro:
        ".dental drills all the way down to one vertical: dental practices, orthodontic and implant brands, pediatric dentistry, oral-care products, labs and suppliers on name.dental carry zero explanation cost. Dentistry is among the most competitive local-acquisition niches in healthcare, and practice names are overwhelmingly \"name/place + Dental\" — those .coms vanished long ago, while the same name + .dental is wide open and even saves typing \"dental\" twice versus xxxdental.com. Operated by Identity Digital at about $62/yr for both registration and renewal — no first-year teaser, flat in and out; painless against dental ticket sizes but wrong for stockpiling. Three cautions: flat pricing means predictable budgets but no cheap trial — decide before you buy; licensing and advertising compliance must be presented clearly, with implant and ortho claims especially regulated; and consumer oral-care brands fit too, though FMCG lives mostly on marketplace storefronts. Naming: name or place + .dental is the natural pattern — with evergreen mood words like smile and bright — and product brands can go brand + .dental.",
      bestFor: ["Dental practices & chains", "Ortho, implant & pediatric brands", "Oral-care product brands", "Dental labs & suppliers"],
      namingTips: [
        "Name/place + .dental beats typing dental twice",
        "About $62/yr flat — predictable, but no cheap trial",
        "Implant/ortho claims are regulated — show credentials",
        "Smile/bright mood words are dentistry's evergreens",
      ],
    },
  },
  fitness: {
    tld: "fitness",
    zh: {
      title: ".fitness 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".fitness 把健身身份写进域名，适合健身房、私教工作室与线上健身课程，首年注册很便宜。查看 .fitness 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .fitness 域名。",
      intro:
        ".fitness 是健身行业的全拼后缀：健身房、私教工作室、瑜伽普拉提馆、CrossFit 场馆、线上健身课程与健身 App 用 name.fitness，行业身份从域名开始一目了然。健身生意的名字大多是气质词与人名——这些词的 .com 几乎必然被占，而「同样的名字 + .fitness」库存极好；与 .coach 相比，.fitness 强调的是「场馆与项目」而非「教练个人」，开店的用 .fitness、做个人品牌的用 .coach 是自然分工。Identity Digital 运营，注册约 $6（约 ¥41）很便宜，续费约 $33/年（约 ¥241）也温和，对健身房月卡收入来说可以忽略。库存极好：风格词、地名、动词组合命中率都高。注意三点：一是 fitness 七个字母不算短，主体名尽量短促有力，运动感的名字读起来要「带劲」；二是健身行业获客重度依赖短视频与本地平台，域名的角色是品牌官网与课程预约的稳定入口；三是补剂与健康食品类电商用它也顺，但保健声明的合规要留意。命名上「风格/流派 + .fitness」最自然（iron、flow 类），场馆用「店名/地名 + .fitness」最直接。",
      bestFor: ["健身房与私教工作室", "瑜伽普拉提与 CrossFit 馆", "线上健身课程与 App", "运动补剂与健康品牌"],
      namingTips: [
        "「风格/流派 + .fitness」行业身份一目了然",
        "注册约 $6、续费约 $33/年，月卡收入可忽略",
        "开店用 .fitness、个人品牌用 .coach 是自然分工",
        "主体名要短促有力，读起来「带劲」",
      ],
    },
    en: {
      title: ".fitness Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".fitness spells the business out in full — for gyms, training studios and online fitness programs, at a cheap entry price. See live pricing and naming advice, then hunt available .fitness names with AI.",
      intro:
        ".fitness spells the whole industry into the domain: gyms, personal-training studios, yoga and pilates spaces, CrossFit boxes, online programs and fitness apps on name.fitness are unmistakable. Fitness businesses name themselves with mood words and personal names — .coms that vanished long ago — while the same name + .fitness is wide open. Versus .coach, .fitness emphasizes the venue and the program over the individual: open a gym on .fitness, build a personal brand on .coach — a natural division of labor. Operated by Identity Digital, registration around $6 is cheap and renewal near $33/yr is mild — a rounding error against membership revenue. Inventory is excellent: style words, places and verb combos all hit. Three cautions: fitness is seven letters, so keep the front word short and punchy — a fitness name should sound energetic read aloud; client acquisition leans heavily on short video and local platforms, so the domain's job is the brand site and class-booking home; and supplement or health-food stores fit too, but mind health-claim compliance. Naming: style or discipline + .fitness is the natural pattern (iron, flow); venues go name or place + .fitness.",
      bestFor: ["Gyms & training studios", "Yoga, pilates & CrossFit spaces", "Online programs & fitness apps", "Supplement & health brands"],
      namingTips: [
        "Style/discipline + .fitness is unmistakable",
        "About $6 to register, $33/yr to renew",
        "Venues take .fitness; personal brands take .coach",
        "Keep the front word short and punchy — it should sound energetic",
      ],
    },
  },
  photos: {
    tld: "photos",
    zh: {
      title: ".photos 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".photos 把照片写进域名，适合摄影师作品集、婚礼摄影与图片交付站点，价格温和。查看 .photos 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .photos 域名。",
      intro:
        ".photos 是摄影行业最直白的后缀：摄影师作品集、婚礼与人像工作室、活动跟拍、图库与照片交付站点用 name.photos，「这里是照片」从域名开始就说清了。它有个独特的实用玩法——按项目/客户开子域或独立域做「照片交付页」（wedding.photos/客户名 式），链接发出去客户秒懂；对比 .photography（11 个字母）它短得多，对比 .gallery 它更偏「照片」而非「展览」。Identity Digital 运营，注册约 $8（约 ¥59），续费约 $24/年（约 ¥174）是创意后缀里的温和档，摄影师订单客单价完全无压力。库存极好：风格词、城市名、人名命中率都高。注意三点：一是 photos 是复数名词，读作「某某的照片」最顺，「人名/工作室名 + .photos」天然带所有格感；二是摄影师获客主阵地在 Instagram 与小红书，域名的角色是作品集与交付的稳定入口；三是纯商业图库要考虑与平台（Getty 类）的分工，独立站更适合品牌与直客。命名上「人名/城市 + .photos」最自然，婚礼与活动摄影用「场景词 + .photos」也顺。",
      bestFor: ["摄影师作品集", "婚礼与人像工作室", "活动跟拍与照片交付", "图库与照片社区"],
      namingTips: [
        "「人名/城市 + .photos」自带所有格感",
        "注册约 $8、续费约 $24/年，创意后缀温和档",
        "比 .photography 短得多，比 .gallery 更偏「照片」",
        "照片交付页玩法：链接发出去客户秒懂",
      ],
    },
    en: {
      title: ".photos Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".photos puts the pictures in the address — for photographer portfolios, wedding studios and client-delivery sites, at a mild price. See live pricing and naming advice, then hunt available .photos names with AI.",
      intro:
        ".photos is photography's most literal suffix: portfolios, wedding and portrait studios, event shooters, stock libraries and client-delivery sites on name.photos say \"pictures live here\" from the address itself. It enables a uniquely practical pattern — per-project or per-client delivery pages (the wedding.photos/client style) where the link explains itself the moment it's sent. Against .photography (eleven letters) it's far shorter; against .gallery it reads \"photos\" rather than \"exhibition\". Operated by Identity Digital, about $8 to register and $24/yr to renew — the mild tier among creative suffixes, trivial against photography ticket sizes. Inventory is excellent: style words, city names and personal names all hit. Three cautions: photos is a plural noun, so name + .photos naturally reads possessive — \"someone's photos\" — which is exactly the charm; photographers win clients on Instagram and social platforms, so the domain's job is the stable portfolio and delivery home; and pure stock businesses should weigh the split with platforms like Getty — independent sites suit brands and direct clients best. Naming: your name or city + .photos is the natural pattern; wedding and event shooters can use scenario + .photos.",
      bestFor: ["Photographer portfolios", "Wedding & portrait studios", "Event shooting & client delivery", "Stock libraries & photo communities"],
      namingTips: [
        "Name/city + .photos reads naturally possessive",
        "About $8 to register, $24/yr to renew",
        "Far shorter than .photography; more literal than .gallery",
        "Client-delivery links explain themselves when sent",
      ],
    },
  },
  gallery: {
    tld: "gallery",
    zh: {
      title: ".gallery 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".gallery 自带展览气质，适合画廊、艺术家作品集与 NFT/数字艺术展厅。查看 .gallery 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .gallery 域名。",
      intro:
        ".gallery 把「展厅」搬进了域名：实体画廊、艺术家作品集、摄影展、设计作品陈列、NFT 与数字艺术展厅用 name.gallery，「这里是策展过的作品」的暗示从域名开始。它与 .art 的区别在角色——.art 说「这是艺术」，.gallery 说「这里在展出」，后者更适合有「陈列/策展」动作的主体：画廊主、策展人、把作品集当展览做的创作者。Identity Digital 运营，注册与续费均约 $23/年（约 ¥167）——平进平出没有首年甜头，但绝对价格在创意后缀里不高，对画廊与艺术家来说负担很轻。库存极好：艺术家人名、风格词、城市名命中率都高。注意三点：一是 gallery 七个字母，主体名尽量短，艺术家全名偏长时用姓氏或艺名更顺；二是它的气质是「白墙射灯」的安静高级感，热闹的电商大促气质不合；三是数字艺术与 NFT 展厅用它很顺，但交易功能的合规与平台分工要想清楚。命名上「艺术家名 + .gallery」最自然，实体画廊用「馆名/地名 + .gallery」，主题展用「主题词 + .gallery」也出彩。",
      bestFor: ["实体画廊与策展机构", "艺术家与摄影师作品集", "NFT 与数字艺术展厅", "设计作品与主题展"],
      namingTips: [
        "「艺术家名 + .gallery」作品集即展览",
        "注册与续费均约 $23/年，平进平出负担轻",
        "气质是白墙射灯的安静高级感，大促气质不合",
        "全名偏长用姓氏或艺名，主体名尽量短",
      ],
    },
    en: {
      title: ".gallery Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".gallery brings the white-wall space into the domain — for art galleries, artist portfolios and digital-art showrooms. See live pricing and naming advice, then hunt available .gallery names with AI.",
      intro:
        ".gallery moves the exhibition space into the address: physical galleries, artist portfolios, photo exhibitions, design showcases and NFT or digital-art showrooms on name.gallery whisper \"curated work on display\" from the domain itself. The contrast with .art is about role — .art says \"this is art\", .gallery says \"this is being exhibited\", which suits anyone with a curatorial act: gallerists, curators, and creators who treat the portfolio as a show. Operated by Identity Digital at about $23/yr for both registration and renewal — flat pricing with no first-year teaser, but the absolute price sits low among creative suffixes, light for galleries and artists alike. Inventory is excellent: artist names, style words and city names all hit. Three cautions: gallery is seven letters, so keep the front word short — long full names read better as a surname or artist name; the register is quiet white-wall sophistication, mismatched with loud e-commerce energy; and digital-art or NFT showrooms fit naturally, but think through trading compliance and the split with marketplaces. Naming: artist name + .gallery is the natural pattern; physical spaces go venue or place + .gallery; themed shows shine as theme + .gallery.",
      bestFor: ["Art galleries & curators", "Artist & photographer portfolios", "NFT & digital-art showrooms", "Design showcases & themed shows"],
      namingTips: [
        "Artist name + .gallery turns a portfolio into a show",
        "About $23/yr flat — light for galleries and artists",
        "Quiet white-wall register — loud commerce doesn't fit",
        "Long full names read better as surname or artist name",
      ],
    },
  },
  salon: {
    tld: "salon",
    zh: {
      title: ".salon 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".salon 把美业身份写进域名，适合美发、美甲、美容、造型工作室与连锁品牌。查看 .salon 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .salon 域名。",
      intro:
        ".salon 是美业的全拼后缀：美发、美甲、美容、化妆造型、美睫美肤、宠物美容——凡是「进店做造型/护理」的生意，name.salon 读出来就是一家门店。它与 .boutique 的精品零售感不同，salon 一词自带「手艺与服务」的场景：椅子、镜子、预约表。词源上 salon 还有「文艺沙龙」的雅义，读书会、艺术沙龙、播客沙龙用它也很出彩。Identity Digital 运营，注册约 $11（约 ¥78），续费约 $46/年（约 ¥330），对美业客单价与复购频率来说负担很轻。库存极好：风格词、人名、地名命中率都高。注意三点：一是 salon 五个字母不长，但主体名仍建议短，读起来才像招牌；二是美业获客主要在本地平台与社交媒体，域名的角色是品牌官网与预约入口，配合线上预约系统食用最佳；三是「沙龙」的双关虽雅，页面视觉要明确行业，避免访客误会。命名上「人名/品牌 + .salon」最自然，连锁用「城市/街区 + .salon」归拢分店，文艺沙龙用「主题 + .salon」也很顺。",
      bestFor: ["美发美甲与美容工作室", "化妆造型与美睫美肤", "宠物美容门店", "读书会与文艺沙龙"],
      namingTips: [
        "「人名/品牌 + .salon」读出来就是一家店",
        "注册约 $11、续费约 $46/年，美业客单价无压力",
        "配合线上预约系统，域名做品牌官网与预约入口",
        "「主题 + .salon」的文艺沙龙用法也很出彩",
      ],
    },
    en: {
      title: ".salon Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".salon spells the beauty business into the address — for hair, nail, skin and styling studios, plus creative salons. See live pricing and naming advice, then hunt available .salon names with AI.",
      intro:
        ".salon spells the trade right into the domain: hair, nails, skin care, makeup and styling, lashes, even pet grooming — any \"come in for a treatment\" business on name.salon reads as a storefront. Unlike the curated-retail air of .boutique, salon carries the scene of craft and service: chairs, mirrors, an appointment book. The word also keeps its older, artsy sense — a literary or art salon — so reading circles, podcast salons and creative gatherings wear it elegantly too. Operated by Identity Digital, about $11 to register and $46/yr to renew — light against beauty-industry ticket sizes and repeat visits. Inventory is excellent: style words, personal names and place names all hit. Three cautions: salon is only five letters, but keep the front word short so it reads like a shop sign; beauty businesses win clients on local platforms and social media, so the domain's job is the brand site and booking front door — pair it with an online booking system; and the artsy double meaning is charming, but make the page visuals state the industry clearly. Naming: personal or brand name + .salon is the natural pattern; chains unify branches as city or neighborhood + .salon; creative salons shine as theme + .salon.",
      bestFor: ["Hair, nail & beauty studios", "Makeup, styling & lash artists", "Pet grooming shops", "Reading circles & creative salons"],
      namingTips: [
        "Name/brand + .salon reads like a shop sign",
        "About $11 to register, $46/yr to renew",
        "Pair with online booking — the domain is the front door",
        "Theme + .salon also works for creative salons",
      ],
    },
  },
  yoga: {
    tld: "yoga",
    zh: {
      title: ".yoga 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".yoga 把瑜伽写进域名，适合瑜伽馆、教培与线上课程品牌，注册续费同价无涨价陷阱。查看 .yoga 实时价格与命名建议，用 AI 猎取可注册的 .yoga 域名。",
      intro:
        ".yoga 是垂直到不能再垂直的后缀：瑜伽馆、瑜伽老师个人品牌、教培认证、线上课程、冥想与正念应用用 name.yoga，受众一眼知道你做什么。相比 .fitness 的力量感，.yoga 的气质是呼吸、拉伸与平静，普拉提、冥想、身心疗愈类品牌借它的气场也很顺。GoDaddy Registry 运营，注册与续费同价约 $26/年（约 ¥189）——平进平出没有首年甜头，但也没有续费陷阱，对课时费定价的瑜伽生意来说负担很轻。库存极好：风格词、体式词、人名、城市名命中率都高。注意三点：一是 yoga 全球通用无翻译成本，出海教培与英文内容品牌尤其合适；二是瑜伽获客重社交与口碑，域名的角色是品牌官网、课表与预约入口；三是行业里 studio/flow/om 类词已被大量注册，起名时先查再爱。命名上「人名/品牌 + .yoga」最自然，场馆用「城市/街区 + .yoga」，线上品牌用「风格词 + .yoga」（flow、calm 类）也很出彩。",
      bestFor: ["瑜伽馆与工作室", "瑜伽老师个人品牌与教培", "线上课程与冥想应用", "普拉提与身心疗愈品牌"],
      namingTips: [
        "「人名/品牌 + .yoga」受众一眼懂",
        "注册续费同价约 $26/年，无涨价陷阱",
        "全球通用词，出海教培与英文内容尤其合适",
        "flow/om 类热词已被大量注册，先查再爱",
      ],
    },
    en: {
      title: ".yoga Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".yoga puts the practice in the address — for studios, teachers, trainings and online course brands, with flat renewal pricing. See live pricing and naming advice, then hunt available .yoga names with AI.",
      intro:
        ".yoga is as vertical as a suffix gets: studios, teacher personal brands, trainings and certifications, online courses, meditation and mindfulness apps on name.yoga tell the audience exactly what you do. Where .fitness flexes strength, .yoga breathes — stretch, calm, presence — and pilates, meditation and mind-body healing brands borrow that register naturally. Operated by GoDaddy Registry at about $26/yr for both registration and renewal — no first-year teaser, but no renewal trap either, light against class-pack pricing. Inventory is excellent: style words, pose names, personal names and city names all hit. Three cautions: yoga is a global word with zero translation cost, ideal for international teacher-training and English content brands; the industry wins students through social and word of mouth, so the domain's job is the brand site, schedule and booking front door; and popular words like studio, flow and om are heavily registered — check before you fall in love. Naming: personal or brand name + .yoga is the natural pattern; studios go city or neighborhood + .yoga; online brands shine as mood word + .yoga (flow, calm).",
      bestFor: ["Yoga studios", "Teacher brands & trainings", "Online courses & meditation apps", "Pilates & mind-body brands"],
      namingTips: [
        "Name/brand + .yoga tells the audience instantly",
        "Flat ~$26/yr — no renewal trap",
        "Global word, zero translation cost for international brands",
        "flow/om-style words go fast — check before you commit",
      ],
    },
  },
  coffee: {
    tld: "coffee",
    zh: {
      title: ".coffee 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".coffee 把咖啡香写进域名，适合咖啡馆、烘焙工作室、咖啡豆电商与咖啡内容品牌。查看 .coffee 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .coffee 域名。",
      intro:
        ".coffee 是咖啡生意的原生后缀：独立咖啡馆、连锁品牌、烘焙工作室、咖啡豆与器具电商、咖啡订阅、咖啡测评与内容社区用 name.coffee，从域名开始就闻得到味道。它与 .cafe 的区别很微妙——.cafe 指「那家店」，.coffee 指「这件事」：卖豆子、做内容、开订阅的用 .coffee 更准，实体门店两者皆宜。英语里 \"let's grab coffee\" 还是社交邀约的通用语，约聊工具与社区产品借这层意思也很妙。Identity Digital 运营，注册约 $11（约 ¥78），续费约 $35/年（约 ¥248），在行业后缀里属温和档。库存极好：产地词、风味词、人名命中率都高。注意三点：一是 coffee 双写字母（ff、ee）拼写要留意，口播场景多提醒一次；二是咖啡电商竞争激烈，域名只是起点，供应链与内容才是护城河；三是本地门店获客靠地图与社交平台，域名做品牌官网与线上商城入口。命名上「品牌词 + .coffee」最自然，烘焙商用「产地/风味 + .coffee」，内容品牌用「动词短语 + .coffee」（brew、pour 类）也很顺。",
      bestFor: ["独立咖啡馆与连锁品牌", "烘焙工作室与咖啡豆电商", "咖啡订阅与器具商店", "咖啡测评与内容社区"],
      namingTips: [
        "「品牌词 + .coffee」从域名开始闻到味道",
        "注册约 $11、续费约 $35/年，行业后缀温和档",
        "ff/ee 双写字母口播时多提醒一次",
        "卖豆子做内容用 .coffee，指「那家店」用 .cafe",
      ],
    },
    en: {
      title: ".coffee Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".coffee brews the aroma into the address — for cafés, roasters, bean e-commerce and coffee content brands. See live pricing and naming advice, then hunt available .coffee names with AI.",
      intro:
        ".coffee is the native suffix of the coffee trade: independent cafés, chains, roasteries, bean and gear e-commerce, subscriptions, review sites and content communities on name.coffee smell right from the address. The split with .cafe is subtle — .cafe means \"the place\", .coffee means \"the thing\": if you sell beans, run a subscription or make content, .coffee is the sharper pick, while physical shops wear either well. English also keeps \"let's grab coffee\" as the universal social invite, a layer that chat and community products can borrow cleverly. Operated by Identity Digital, about $11 to register and $35/yr to renew — the mild tier among industry suffixes. Inventory is excellent: origin words, flavor words and personal names all hit. Three cautions: coffee doubles two letters (ff, ee), so spell it out once in spoken contexts; coffee e-commerce is fiercely competitive — the domain is a start, supply chain and content are the moat; and local shops win customers on maps and social, so the domain's job is the brand site and online store. Naming: brand word + .coffee is the natural pattern; roasters go origin or flavor + .coffee; content brands shine as verb phrase + .coffee (brew, pour).",
      bestFor: ["Indie cafés & chains", "Roasteries & bean e-commerce", "Coffee subscriptions & gear stores", "Coffee reviews & communities"],
      namingTips: [
        "Brand + .coffee smells right from the address",
        "About $11 to register, $35/yr to renew",
        "Double letters (ff, ee) — spell it out when spoken",
        "Selling beans/content? .coffee; \"the place\"? .cafe",
      ],
    },
  },
  wine: {
    tld: "wine",
    zh: {
      title: ".wine 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".wine 把酒香写进域名，适合酒庄、葡萄酒电商、侍酒师与酒评内容品牌。查看 .wine 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .wine 域名。",
      intro:
        ".wine 是葡萄酒世界的原生后缀：酒庄官网、葡萄酒电商与订阅、进口商与经销商、侍酒师个人品牌、酒评与品鉴内容、酒窖与酒具生意用 name.wine，风土从域名开始。相比 .bar 的门店感，.wine 覆盖的是整条产业链——种植、酿造、贸易、内容、体验。Identity Digital 运营，注册约 $6（约 ¥41）很便宜，续费约 $48/年（约 ¥346）是首年的数倍，下手前把续费算进预算。库存极好：产区词、品种词、庄园名命中率都高。注意三点：一是酒类电商与广告在多数市场有牌照与年龄门槛，合规是第一课；二是 wine 一词的联想是「佐餐与品味」，烈酒与精酿啤酒品牌另有更准的词；三是欧洲产区名（champagne、bordeaux 类）受地理标志保护，起名避开受保护词。命名上「庄园/品牌 + .wine」最自然，电商用「场景词 + .wine」（daily、house 类），内容品牌用「动词/形容词 + .wine」也很出彩。",
      bestFor: ["酒庄与葡萄园官网", "葡萄酒电商与订阅", "进口商与侍酒师品牌", "酒评与品鉴内容"],
      namingTips: [
        "「庄园/品牌 + .wine」风土从域名开始",
        "注册约 $6 但续费约 $48/年，预算算清再下手",
        "酒类电商牌照与年龄门槛是第一课",
        "champagne 类产区名受地理标志保护，起名避开",
      ],
    },
    en: {
      title: ".wine Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".wine pours the terroir into the address — for wineries, wine e-commerce, sommeliers and tasting content brands. See live pricing and naming advice, then hunt available .wine names with AI.",
      intro:
        ".wine is the native suffix of the wine world: winery sites, wine e-commerce and subscriptions, importers and distributors, sommelier personal brands, review and tasting content, cellar and glassware businesses on name.wine carry terroir from the address itself. Where .bar reads as a venue, .wine spans the whole chain — growing, making, trading, writing, tasting. Operated by Identity Digital, about $6 to register is genuinely cheap, but renewal near $48/yr runs several times the first year — budget the renewal before you commit. Inventory is excellent: region words, grape varieties and estate names all hit. Three cautions: alcohol e-commerce and advertising carry licensing and age-gate duties in most markets — compliance comes first; \"wine\" connotes table and taste, so spirits and craft-beer brands have sharper words elsewhere; and European appellations (champagne, bordeaux and kin) enjoy geographical-indication protection — steer clear of protected names. Naming: estate or brand + .wine is the natural pattern; e-commerce shines as occasion word + .wine (daily, house); content brands work as verb or adjective + .wine.",
      bestFor: ["Wineries & vineyards", "Wine e-commerce & subscriptions", "Importers & sommelier brands", "Wine reviews & tasting content"],
      namingTips: [
        "Estate/brand + .wine carries terroir in the address",
        "About $6 first year but $48/yr renewal — budget it",
        "Alcohol licensing and age gates come first",
        "Appellations like champagne are GI-protected — avoid",
      ],
    },
  },
  kitchen: {
    tld: "kitchen",
    zh: {
      title: ".kitchen 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".kitchen 把厨房搬进域名，适合私厨、云厨房、烹饪课程、食谱内容与厨房用品品牌。查看 .kitchen 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .kitchen 域名。",
      intro:
        ".kitchen 把「厨房」这个场景直接搬进域名：私厨与定制餐饮、云厨房与外卖品牌、烹饪课程与美食工作室、食谱与美食内容、厨房用品与橱柜定制用 name.kitchen，烟火气从域名开始。它与 .restaurant 的区别在场景——.restaurant 是「堂食的店」，.kitchen 是「做菜的地方」：不设堂食的云厨房、美食内容与课程用 .kitchen 更准。英语里 test kitchen（试菜厨房）还是美食媒体的经典栏目名，内容品牌借这层意思很顺。Identity Digital 运营，注册约 $8（约 ¥59），续费约 $52/年（约 ¥374）是首年的数倍，预算算清再下手。库存极好：菜系词、人名、风格词命中率都高。注意三点：一是 kitchen 七个字母，主体名务必短；二是餐饮获客靠外卖平台与社交内容，域名做品牌官网与菜单入口；三是家装橱柜生意也用这个词，页面视觉要快速表明你是「做菜」还是「装厨房」。命名上「人名/品牌 + .kitchen」最自然（mama、nonna 类亲切词尤佳），云厨房用「菜系 + .kitchen」，内容品牌用「test/home + .kitchen」式也很出彩。",
      bestFor: ["私厨与云厨房品牌", "烹饪课程与美食工作室", "食谱与美食内容", "厨房用品与橱柜定制"],
      namingTips: [
        "「人名/品牌 + .kitchen」烟火气直给",
        "注册约 $8 但续费约 $52/年，预算算清再下手",
        "kitchen 七个字母，主体名务必短",
        "不设堂食用 .kitchen，堂食的店用 .restaurant",
      ],
    },
    en: {
      title: ".kitchen Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".kitchen moves the cooking into the address — for private chefs, cloud kitchens, cooking classes, recipe content and kitchenware brands. See live pricing and naming advice, then hunt available .kitchen names with AI.",
      intro:
        ".kitchen moves the room where food happens into the address: private chefs and catering, cloud kitchens and delivery brands, cooking classes and food studios, recipe and food content, kitchenware and cabinetry businesses on name.kitchen feel warm from the domain itself. The split with .restaurant is the scene — .restaurant is \"the place you dine\", .kitchen is \"the place you cook\": delivery-only kitchens, food content and classes are sharper on .kitchen. English also keeps \"test kitchen\" as a classic food-media franchise, a layer content brands borrow naturally. Operated by Identity Digital, about $8 to register but renewal near $52/yr runs several times the first year — budget it before you commit. Inventory is excellent: cuisine words, personal names and style words all hit. Three cautions: kitchen is seven letters, so keep the front word short; food businesses win customers on delivery platforms and social content, so the domain's job is the brand site and menu front door; and cabinetry businesses use the same word — make your visuals say \"cooking\" or \"remodeling\" fast. Naming: personal or brand name + .kitchen is the natural pattern (warm words like mama, nonna shine); cloud kitchens go cuisine + .kitchen; content brands work the test/home + .kitchen angle.",
      bestFor: ["Private chefs & cloud kitchens", "Cooking classes & food studios", "Recipe & food content", "Kitchenware & cabinetry brands"],
      namingTips: [
        "Name/brand + .kitchen feels warm instantly",
        "About $8 first year but $52/yr renewal — budget it",
        "Seven letters — keep the front word short",
        "Delivery-only? .kitchen; dine-in? .restaurant",
      ],
    },
  },
  garden: {
    tld: "garden",
    zh: {
      title: ".garden 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".garden 把花园写进域名，适合园艺电商、景观设计、植物内容社区与数字花园，首年注册极便宜。查看 .garden 实时价格与命名建议，用 AI 猎取可注册的 .garden 域名。",
      intro:
        ".garden 把「花园」的意象带进域名：园艺电商与苗圃、景观设计与庭院施工、植物养护内容与社区、花店与植物生活方式品牌用 name.garden，绿意从域名开始。它还有一层数字世界的妙用——「digital garden」是知识管理圈的流行隐喻（笔记像植物一样生长），个人知识库与博客用 name.garden 在这个圈子里自带身份。GoDaddy Registry 运营，注册约 $2（约 ¥11）是本站最便宜档之一，续费约 $26/年（约 ¥189）也温和，试错成本几乎为零。库存极好：植物词、风格词、人名命中率都高。注意三点：一是 garden 六个字母，主体名短一点读起来才像门牌；二是园艺是季节性生意，内容与电商结合（养护指南带货）比纯货架更有粘性；三是数字花园的用法在中文圈认知度还在成长期，面向国内用户时页面要交代清楚。命名上「植物/风格 + .garden」最自然（secret、zen 类意境词尤佳），本地生意用「城市 + .garden」，知识库用「人名 + .garden」很有辨识度。",
      bestFor: ["园艺电商与苗圃", "景观设计与庭院施工", "植物内容与花店品牌", "数字花园与个人知识库"],
      namingTips: [
        "「植物/风格 + .garden」绿意直给，secret/zen 类意境词尤佳",
        "注册约 $2、续费约 $26/年，试错成本极低",
        "「人名 + .garden」做数字花园/知识库自带圈内身份",
        "园艺季节性强，内容带货比纯货架更有粘性",
      ],
    },
    en: {
      title: ".garden Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".garden grows greenery into the address — for garden e-commerce, landscaping, plant content and digital gardens, with a very cheap first year. See live pricing and naming advice, then hunt available .garden names with AI.",
      intro:
        ".garden grows the imagery right into the address: garden e-commerce and nurseries, landscaping and yard design, plant-care content and communities, florists and plant lifestyle brands on name.garden feel green from the domain itself. It also has a lovely digital-world use — the \"digital garden\" is a beloved metaphor in the personal-knowledge-management scene (notes that grow like plants), so a personal wiki or blog on name.garden carries instant identity there. Operated by GoDaddy Registry, about $2 to register is among the cheapest here, with renewal near $26/yr — practically zero cost to try. Inventory is excellent: plant words, mood words and personal names all hit. Three cautions: garden is six letters, so a short front word reads best, like a gate sign; gardening is seasonal — content plus commerce (care guides that sell) beats bare shelves for retention; and the digital-garden sense is niche outside the PKM crowd, so explain it if your audience is broader. Naming: plant or mood word + .garden is the natural pattern (secret, zen shine); local businesses go city + .garden; knowledge bases are unmistakable as personal name + .garden.",
      bestFor: ["Garden e-commerce & nurseries", "Landscaping & yard design", "Plant content & florist brands", "Digital gardens & personal wikis"],
      namingTips: [
        "Plant/mood + .garden — secret and zen shine",
        "About $2 to register, $26/yr to renew — cheap to try",
        "Name + .garden is instant identity for digital gardens",
        "Seasonal trade — content that sells beats bare shelves",
      ],
    },
  },
  photography: {
    tld: "photography",
    zh: {
      title: ".photography 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".photography 把快门声写进域名，适合摄影师作品集、摄影工作室、婚礼与商业摄影品牌。查看 .photography 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .photography 域名。",
      intro:
        ".photography 是摄影行业的全拼后缀：摄影师个人作品集、婚礼与人像工作室、商业与产品摄影、摄影课程与器材评测内容用 name.photography，专业身份从域名开始。它与 .photos 的分工微妙——.photos 短、偏「照片本身」（图库、相册、分享），.photography 长、偏「摄影这门手艺」：强调专业服务与个人品牌时它更准。Identity Digital 运营，注册约 $6（约 ¥41），续费约 $29/年（约 ¥211），在行业后缀里属温和档。库存极好：人名、城市名、风格词命中率都高。注意三点：一是 photography 十一个字母是本站最长后缀，主体名务必短，人名或单词最佳；二是长域名口播成本高，名片与作品集水印是它的主场，社交简介放短链接；三是摄影获客重平台与口碑，域名的角色是作品集官网与档期预约入口。命名上「人名 + .photography」最自然（摄影师个人品牌的标准写法），工作室用「品牌词 + .photography」，垂类用「风格/题材 + .photography」（film、street 类）也很出彩。",
      bestFor: ["摄影师个人作品集", "婚礼与人像工作室", "商业与产品摄影", "摄影课程与器材内容"],
      namingTips: [
        "「人名 + .photography」是摄影师个人品牌标准写法",
        "注册约 $6、续费约 $29/年，行业后缀温和档",
        "十一个字母是最长后缀，主体名务必短",
        "强调手艺与服务用 .photography，图库相册用 .photos",
      ],
    },
    en: {
      title: ".photography Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".photography writes the craft into the address — for photographer portfolios, wedding and commercial studios, and photo education brands. See live pricing and naming advice, then hunt available .photography names with AI.",
      intro:
        ".photography spells the craft in full: photographer portfolios, wedding and portrait studios, commercial and product shooters, photo courses and gear-review content on name.photography read as professionals from the address itself. The split with .photos is subtle — .photos is short and about \"the pictures\" (galleries, albums, sharing), while .photography is about \"the craft\": sharper when you sell professional service and personal brand. Operated by Identity Digital, about $6 to register and $29/yr to renew — the mild tier among industry suffixes. Inventory is excellent: personal names, city names and style words all hit. Three cautions: photography is eleven letters — the longest suffix here — so keep the front word short, a name or single word at best; long domains cost more when spoken, so business cards and portfolio watermarks are its home turf, with a short link for social bios; and photographers win clients on platforms and word of mouth, so the domain's job is the portfolio site and booking front door. Naming: personal name + .photography is the standard photographer pattern; studios go brand word + .photography; niches shine as style or subject + .photography (film, street).",
      bestFor: ["Photographer portfolios", "Wedding & portrait studios", "Commercial & product shooters", "Photo courses & gear content"],
      namingTips: [
        "Name + .photography is the photographer standard",
        "About $6 to register, $29/yr to renew",
        "Eleven letters — keep the front word short",
        "Craft & service? .photography; galleries? .photos",
      ],
    },
  },
  events: {
    tld: "events",
    zh: {
      title: ".events 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".events 把活动排期写进域名，适合活动策划、会展公司、演出售票与社群聚会品牌。查看 .events 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .events 域名。",
      intro:
        ".events 是活动行业的原生后缀：活动策划与执行公司、会展与峰会主办方、演出与售票平台、婚礼与派对策划、社群聚会与线下沙龙用 name.events，域名读出来就是一张活动日历。它天然带复数——「这里有很多场活动」，做系列活动、年度大会、城市活动指南尤其顺口。Identity Digital 运营，注册约 $10（约 ¥70），续费约 $37/年（约 ¥263），对活动行业客单价来说负担很轻。库存极好：城市名、品牌词、主题词命中率都高。注意三点：一是 events 天然复数，单场大会更适合「大会名 + 年份」的独立域名，.events 适合做长期活动品牌的总入口；二是活动获客重社交裂变与售票平台，域名的角色是品牌官网与报名入口，配合票务系统食用最佳；三是活动有强时效性，域名要选能跨活动复用的名字，别把日期写进主体。命名上「品牌/公司 + .events」最自然，城市指南用「城市 + .events」归拢本地活动，垂类用「主题 + .events」（tech、music 类）也很出彩。",
      bestFor: ["活动策划与执行公司", "会展与峰会主办方", "演出售票与活动日历", "婚礼派对与社群聚会"],
      namingTips: [
        "「品牌/公司 + .events」读出来就是活动日历",
        "注册约 $10、续费约 $37/年，活动行业无压力",
        "配合票务系统，域名做品牌官网与报名入口",
        "别把日期写进主体，选能跨活动复用的名字",
      ],
    },
    en: {
      title: ".events Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".events puts the calendar into the address — for event planners, conference organizers, ticketing and community meetup brands. See live pricing and naming advice, then hunt available .events names with AI.",
      intro:
        ".events is the native suffix of the events trade: planning and production agencies, conference and summit organizers, shows and ticketing platforms, wedding and party planners, community meetups and offline salons on name.events read like a calendar of things happening. The plural is built in — \"there are many events here\" — so series, annual conferences and city event guides roll off the tongue. Operated by Identity Digital, about $10 to register and $37/yr to renew — light against event-industry ticket sizes. Inventory is excellent: city names, brand words and theme words all hit. Three cautions: the plural suits an ongoing events brand as the umbrella front door, while a single conference often wants its own name-plus-year domain; events win attendees through social sharing and ticketing platforms, so the domain's job is the brand site and registration front door — pair it with a ticketing system; and events are time-bound, so pick a front word that outlives any one date — never bake the date in. Naming: brand or company + .events is the natural pattern; city guides unify local happenings as city + .events; verticals shine as theme + .events (tech, music).",
      bestFor: ["Event planning & production", "Conference & summit organizers", "Ticketing & event calendars", "Weddings, parties & meetups"],
      namingTips: [
        "Brand/company + .events reads like a calendar",
        "About $10 to register, $37/yr to renew",
        "Pair with ticketing — the domain is the front door",
        "Never bake a date in — pick a reusable name",
      ],
    },
  },
  solutions: {
    tld: "solutions",
    zh: {
      title: ".solutions 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".solutions 把「解决方案」写进域名，适合 IT 服务商、咨询公司、B2B 方案商与系统集成商，首年注册很便宜。查看 .solutions 实时价格与命名建议，用 AI 猎取可注册的 .solutions 域名。",
      intro:
        ".solutions 是 B2B 服务商的常用后缀：IT 服务与系统集成、软件定制开发、企业咨询、行业解决方案商用 name.solutions，域名直接回答客户的问题——「你们卖什么？卖解决方案」。它在企业官网语境里几乎是行话级别的存在，英文市场认知度高，招投标文件与企业邮箱里都不违和。Identity Digital 运营，注册约 $4（约 ¥26）是本站便宜档，续费约 $25/年（约 ¥182）也温和，B2B 客单价下几乎无感。库存极好：行业词、技术词、公司名命中率都高。注意三点：一是 solutions 一词在英文营销里被用得很泛，主体名要具体（行业或技术领域），「泛词 + solutions」会显得空洞；二是它是复数商务词，面向消费者的品牌气质不合，2C 产品另选后缀；三是企业采购决策链长，域名的角色是官网与企业邮箱，稳定与专业感比花哨重要。命名上「行业 + .solutions」最自然（fintech、logistics 类），公司用「品牌词 + .solutions」，技术商用「技术栈 + .solutions」也很顺。",
      bestFor: ["IT 服务与系统集成商", "软件定制与外包开发", "企业咨询与行业方案商", "B2B 技术服务品牌"],
      namingTips: [
        "「行业 + .solutions」直接回答「你们卖什么」",
        "注册约 $4、续费约 $25/年，B2B 成本无感",
        "主体名要具体，「泛词 + solutions」显得空洞",
        "商务气质浓，2C 消费品牌另选后缀",
      ],
    },
    en: {
      title: ".solutions Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".solutions says what you sell right in the address — for IT services, consultancies, B2B vendors and systems integrators, with a cheap first year. See live pricing and naming advice, then hunt available .solutions names with AI.",
      intro:
        ".solutions answers the client's first question in the address: IT services and systems integrators, custom software shops, consultancies and industry vendors on name.solutions say \"we sell solutions\" before the page loads. In corporate-site English it is practically trade vocabulary — at home in RFPs, tender documents and company email addresses. Operated by Identity Digital, about $4 to register — among the cheap tier here — and a mild $25/yr to renew, invisible against B2B deal sizes. Inventory is excellent: industry words, technology words and company names all hit. Three cautions: \"solutions\" is worn thin in marketing English, so make the front word concrete (an industry or technology) — vague word + solutions reads hollow; it is plural business-speak, wrong register for consumer brands — 2C products want another suffix; and enterprise buying cycles are long, so the domain's job is a stable, professional web and email presence, not flash. Naming: industry + .solutions is the natural pattern (fintech, logistics); firms go brand word + .solutions; tech vendors work stack + .solutions nicely.",
      bestFor: ["IT services & systems integrators", "Custom software & dev shops", "Consultancies & industry vendors", "B2B technology brands"],
      namingTips: [
        "Industry + .solutions answers \"what do you sell\"",
        "About $4 to register, $25/yr to renew",
        "Keep the front word concrete — vague reads hollow",
        "Business register — consumer brands look elsewhere",
      ],
    },
  },
  services: {
    tld: "services",
    zh: {
      title: ".services 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".services 把服务清单写进域名，适合专业服务公司、家政维修、企业外包与本地服务商。查看 .services 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .services 域名。",
      intro:
        ".services 是服务行业的直白后缀：专业服务公司（会计、法务、人力）、家政保洁与维修安装、企业外包与托管运维、本地生活服务商用 name.services，域名读出来就是一份服务清单。它比 .solutions 更朴素——solutions 说「我帮你解决问题」，services 说「我提供这些服务」，蓝领与本地服务用它反而更实在可信。Identity Digital 运营，注册约 $9（约 ¥63），续费约 $31/年（约 ¥226），服务业客单价下负担很轻。库存极好：行业词、动词、地名命中率都高。注意三点：一是 services 复数商务词，主体名要说清「什么服务」，行业词或动词最佳；二是本地服务获客重地图与平台评价，域名的角色是官网与报价入口，NAP 信息（名称地址电话）要与地图一致；三是英文里 services 也是政府与机构常用词，页面视觉要快速表明你是商业服务商。命名上「行业 + .services」最自然（cleaning、moving 类），公司用「品牌词 + .services」，本地生意用「城市 + 行业 + .services」精准命中搜索意图。",
      bestFor: ["会计法务等专业服务", "家政保洁与维修安装", "企业外包与托管运维", "本地生活服务商"],
      namingTips: [
        "「行业 + .services」读出来就是服务清单",
        "注册约 $9、续费约 $31/年，服务业无压力",
        "「城市 + 行业 + .services」精准命中本地搜索",
        "比 .solutions 朴素实在，蓝领服务更可信",
      ],
    },
    en: {
      title: ".services Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".services puts the offering into the address — for professional firms, home services, outsourcing and local providers. See live pricing and naming advice, then hunt available .services names with AI.",
      intro:
        ".services is the plainspoken suffix of the service economy: professional firms (accounting, legal, HR), cleaning, repair and installation trades, outsourcing and managed operations, local providers on name.services read like a straightforward menu of what you do. It is humbler than .solutions — solutions says \"we fix your problem\", services says \"here is what we offer\" — which makes it more credible for trades and local businesses. Operated by Identity Digital, about $9 to register and $31/yr to renew — light against service-industry ticket sizes. Inventory is excellent: trade words, verbs and place names all hit. Three cautions: it is a plural business word, so the front word must say which services — a trade word or verb works best; local providers win customers on maps and review platforms, so the domain's job is the brand site and quote front door, with NAP details matching your map listings; and \"services\" is also government-agency vocabulary in English, so make the visuals say commercial fast. Naming: trade + .services is the natural pattern (cleaning, moving); firms go brand word + .services; local businesses nail search intent as city + trade + .services.",
      bestFor: ["Accounting, legal & HR firms", "Cleaning, repair & installation", "Outsourcing & managed ops", "Local service providers"],
      namingTips: [
        "Trade + .services reads like a service menu",
        "About $9 to register, $31/yr to renew",
        "City + trade + .services nails local search intent",
        "Plainer than .solutions — credible for trades",
      ],
    },
  },
  consulting: {
    tld: "consulting",
    zh: {
      title: ".consulting 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".consulting 把咨询身份写进域名，适合独立顾问、精品咨询公司、战略与管理咨询品牌。查看 .consulting 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .consulting 域名。",
      intro:
        ".consulting 把「顾问」的身份直接写进域名：独立顾问个人品牌、精品咨询公司、战略/管理/IT/营销咨询、教练与专家服务用 name.consulting，名片递出去就是职业说明。它与 .expert 的差别在语气——expert 说「我很懂」，consulting 说「我以此为业」，后者在企业采购语境里更正式可信。Identity Digital 运营，注册约 $21（约 ¥152），续费约 $44/年（约 ¥315），对咨询业客单价来说九牛一毛。库存极好：人名、领域词、公司名命中率都高。注意三点：一是 consulting 十个字母偏长，主体名务必短，姓氏或领域词最佳；二是咨询获客靠人脉与内容（领英、行业文章），域名的角色是专业官网与企业邮箱——name@name.consulting 的邮箱签名本身就是广告；三是独立顾问慎用泛词，「姓氏 + .consulting」比「泛行业词」更有辨识度与信任感。命名上「姓氏/人名 + .consulting」最自然（麦肯锡式传统），公司用「品牌词 + .consulting」，垂类用「领域 + .consulting」（tech、hr 类）也很顺。",
      bestFor: ["独立顾问个人品牌", "精品咨询公司", "战略/IT/营销咨询", "教练与专家服务"],
      namingTips: [
        "「姓氏 + .consulting」是麦肯锡式传统写法",
        "注册约 $21、续费约 $44/年，咨询客单价无感",
        "name@name.consulting 的邮箱签名本身就是广告",
        "十个字母偏长，主体名用姓氏或领域词",
      ],
    },
    en: {
      title: ".consulting Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".consulting writes the profession into the address — for independent consultants, boutique firms, and strategy or management advisory brands. See live pricing and naming advice, then hunt available .consulting names with AI.",
      intro:
        ".consulting states the profession in the address: independent consultants, boutique firms, strategy, management, IT and marketing advisories, coaches and expert services on name.consulting hand over a business card that explains itself. The contrast with .expert is tone — expert says \"I know this well\", consulting says \"this is my profession\" — and the latter reads more formal and credible in enterprise procurement. Operated by Identity Digital, about $21 to register and $44/yr to renew — a rounding error against consulting fees. Inventory is excellent: surnames, domain words and firm names all hit. Three cautions: consulting is ten letters, so keep the front word short — a surname or field word works best; consultants win work through networks and content (LinkedIn, industry writing), so the domain's job is the professional site and company email — a name@name.consulting signature is an ad in itself; and independents should avoid generic words — surname + .consulting builds more recognition and trust than a vague industry term. Naming: surname or personal name + .consulting is the classic pattern (the McKinsey tradition); firms go brand word + .consulting; verticals work field + .consulting (tech, hr).",
      bestFor: ["Independent consultants", "Boutique consulting firms", "Strategy, IT & marketing advisory", "Coaches & expert services"],
      namingTips: [
        "Surname + .consulting — the McKinsey tradition",
        "About $21 to register, $44/yr to renew",
        "name@name.consulting email is an ad in itself",
        "Ten letters — keep the front word short",
      ],
    },
  },
  software: {
    tld: "software",
    zh: {
      title: ".software 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".software 把产品形态写进域名，适合软件公司、开发工具、桌面应用与软件外包团队。查看 .software 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .software 域名。",
      intro:
        ".software 把产品形态直接写进域名：软件公司官网、桌面与企业应用、开发工具与中间件、软件外包与定制团队用 name.software，访客不用猜你卖什么。它与 .app/.dev 的分工清晰——.app 偏移动与轻应用、.dev 偏开发者与技术品牌，.software 偏「正经软件产品与公司」：企业软件、桌面工具、行业系统用它气质最合。Identity Digital 运营，注册约 $16（约 ¥115），续费约 $33/年（约 ¥241），软件业成本结构下无感。库存极好：产品词、领域词、公司名命中率都高。注意三点：一是 software 八个字母偏长，主体名务必短，产品名或领域词最佳；二是它没有 .app 的 HTTPS 强制预载，但生产环境全站 HTTPS 本就是标配，别省；三是开源项目与个人开发者用 .dev/.io 更顺口，.software 的正式感更适合商业产品与公司主体。命名上「产品名 + .software」最自然，公司用「品牌词 + .software」，行业系统用「行业 + .software」（dental、logistics 类）精准命中采购搜索。",
      bestFor: ["软件公司与产品官网", "桌面与企业应用", "开发工具与中间件", "软件外包与定制团队"],
      namingTips: [
        "「产品名 + .software」访客不用猜你卖什么",
        "注册约 $16、续费约 $33/年，软件业成本无感",
        "「行业 + .software」精准命中企业采购搜索",
        "移动轻应用用 .app、开发者品牌用 .dev，正经软件用它",
      ],
    },
    en: {
      title: ".software Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".software says the product category in the address — for software companies, dev tools, desktop apps and custom development teams. See live pricing and naming advice, then hunt available .software names with AI.",
      intro:
        ".software states the product category in the address: software company sites, desktop and enterprise applications, developer tools and middleware, outsourcing and custom-dev teams on name.software leave no guessing about what you sell. The division of labor with .app and .dev is clean — .app leans mobile and lightweight, .dev leans developer and tech brands, .software leans \"serious software products and companies\": enterprise systems, desktop tools and industry software wear it best. Operated by Identity Digital, about $16 to register and $33/yr to renew — invisible in a software cost structure. Inventory is excellent: product words, domain words and company names all hit. Three cautions: software is eight letters, so keep the front word short — a product or field word works best; it lacks .app's enforced HTTPS preload, but production sites should be fully HTTPS anyway — don't skimp; and open-source projects and indie developers roll more naturally on .dev or .io — .software's formality suits commercial products and company entities. Naming: product name + .software is the natural pattern; companies go brand word + .software; industry systems nail procurement searches as industry + .software (dental, logistics).",
      bestFor: ["Software companies & products", "Desktop & enterprise apps", "Developer tools & middleware", "Outsourcing & custom dev teams"],
      namingTips: [
        "Product + .software — no guessing what you sell",
        "About $16 to register, $33/yr to renew",
        "Industry + .software nails procurement searches",
        "Mobile? .app; dev brand? .dev; serious software? here",
      ],
    },
  },
  marketing: {
    tld: "marketing",
    zh: {
      title: ".marketing 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".marketing 把营销专业写进域名，适合营销代理机构、增长团队、营销 SaaS 与自媒体营销人。查看 .marketing 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .marketing 域名。",
      intro:
        ".marketing 把行业身份直接写进域名：营销代理与广告公司、增长与投放团队、营销 SaaS 工具、营销博客与课程用 name.marketing，客户看一眼就知道你干什么。它与 .agency 的分工在焦点——agency 说「我们是一家机构」，marketing 说「我们做的是营销」：卖专业能力时后者更点题。Identity Digital 运营，注册约 $6（约 ¥41），续费约 $33/年（约 ¥241），对营销行业客单价来说很轻。库存极好：行业词、动词、品牌名命中率都高。注意三点：一是 marketing 九个字母偏长，主体名务必短，品牌词或垂类词最佳；二是营销人自己的域名就是作品——别选生僻拼写，客户拼错就是失单；三是获客渠道在内容与案例（领英、公众号、案例库），域名的角色是专业官网与线索表单入口。命名上「品牌词 + .marketing」最自然，垂类用「领域 + .marketing」（content、email 类）精准点题，个人营销顾问用「人名 + .marketing」也很顺。",
      bestFor: ["营销代理与广告公司", "增长与投放团队", "营销 SaaS 与工具", "营销博客与课程"],
      namingTips: [
        "「品牌词 + .marketing」客户一眼知道你干什么",
        "注册约 $6、续费约 $33/年，行业客单价无感",
        "「领域 + .marketing」精准点题（content、email 类）",
        "九个字母偏长，主体名务必短、拼写别生僻",
      ],
    },
    en: {
      title: ".marketing Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".marketing writes the profession into the address — for agencies, growth teams, martech SaaS and marketing creators. See live pricing and naming advice, then hunt available .marketing names with AI.",
      intro:
        ".marketing states the trade in the address: agencies and ad shops, growth and performance teams, martech SaaS, marketing blogs and courses on name.marketing tell clients what you do at a glance. The split with .agency is focus — agency says \"we are a firm\", marketing says \"marketing is what we do\": sharper when you sell the expertise itself. Operated by Identity Digital, about $6 to register and $33/yr to renew — light against marketing-industry ticket sizes. Inventory is excellent: trade words, verbs and brand names all hit. Three cautions: marketing is nine letters, so keep the front word short — a brand or vertical word works best; a marketer's own domain is a portfolio piece, so avoid clever misspellings that clients will fumble; and clients come through content and case studies (LinkedIn, newsletters), so the domain's job is the professional site and lead-form front door. Naming: brand word + .marketing is the natural pattern; verticals nail the pitch as field + .marketing (content, email); independent consultants roll well on personal name + .marketing.",
      bestFor: ["Agencies & ad shops", "Growth & performance teams", "Martech SaaS & tools", "Marketing blogs & courses"],
      namingTips: [
        "Brand + .marketing says what you do at a glance",
        "About $6 to register, $33/yr to renew",
        "Field + .marketing nails the pitch (content, email)",
        "Nine letters — keep the front word short",
      ],
    },
  },
  systems: {
    tld: "systems",
    zh: {
      title: ".systems 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".systems 把工程气质写进域名，适合基础设施与运维团队、企业系统集成商、IoT 与嵌入式公司。查看 .systems 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .systems 域名。",
      intro:
        ".systems 自带工程房间的嗡嗡声：基础设施与 DevOps 团队、企业系统集成商、IoT 与嵌入式公司、安全与监控平台用 name.systems，域名读出来就是「我们造的是正经系统」。它与 .software 的分野在层次——software 偏「一款产品」，systems 偏「一套底层/成体系的工程」：数据库、操作系统、分布式基建团队用它气质最合，业内不少基建初创直接选 .systems 做官网。Identity Digital 运营，注册约 $12（约 ¥85），续费约 $28/年（约 ¥204），温和档。库存极好：技术词、动物词、复合词命中率都高。注意三点：一是 systems 天然复数且偏冷硬，2C 产品别用，它是给工程品牌的；二是七个字母不算短，主体名选短词，单音节词 + .systems 的组合极有极客范；三是这类公司获客靠技术声誉（GitHub、技术博客、会议演讲），域名的角色是工程品牌门面与文档站。命名上「短词 + .systems」最自然（初创基建公司标准写法），垂类用「领域 + .systems」（trading、energy 类），个人技术品牌用「代号 + .systems」也很酷。",
      bestFor: ["基础设施与 DevOps 团队", "企业系统集成商", "IoT 与嵌入式公司", "安全与监控平台"],
      namingTips: [
        "「短词 + .systems」是基建初创的标准写法",
        "注册约 $12、续费约 $28/年，温和档",
        "单音节词 + .systems 组合极有极客范",
        "偏冷硬工程气质，2C 产品另选后缀",
      ],
    },
    en: {
      title: ".systems Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".systems hums like an engineering room — for infrastructure and DevOps teams, integrators, IoT companies and security platforms. See live pricing and naming advice, then hunt available .systems names with AI.",
      intro:
        ".systems hums like a server room: infrastructure and DevOps teams, enterprise integrators, IoT and embedded companies, security and monitoring platforms on name.systems read as \"we build serious systems\". The split with .software is the layer — software leans \"a product\", systems leans \"foundational, engineered plumbing\": database, OS and distributed-infra teams wear it best, and plenty of infra startups pick .systems for their homepage. Operated by Identity Digital, about $12 to register and $28/yr to renew — the mild tier. Inventory is excellent: technical words, animal words and compounds all hit. Three cautions: systems is plural and cold-blooded — wrong register for consumer products, this one belongs to engineering brands; seven letters isn't short, so pick a short front word — a single syllable + .systems is peak hacker chic; and these companies win business on technical reputation (GitHub, engineering blogs, conference talks), so the domain's job is the engineering brand front door and docs site. Naming: short word + .systems is the infra-startup standard; verticals work field + .systems (trading, energy); personal tech brands look sharp as codename + .systems.",
      bestFor: ["Infrastructure & DevOps teams", "Enterprise integrators", "IoT & embedded companies", "Security & monitoring platforms"],
      namingTips: [
        "Short word + .systems — the infra-startup standard",
        "About $12 to register, $28/yr to renew",
        "One syllable + .systems is peak hacker chic",
        "Cold engineering register — consumer brands look elsewhere",
      ],
    },
  },
  ventures: {
    tld: "ventures",
    zh: {
      title: ".ventures 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".ventures 把创业野心写进域名，适合风投基金、创业工作室、孵化器与连续创业者。查看 .ventures 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .ventures 域名。",
      intro:
        ".ventures 把「押注未来」写进域名：风投与天使基金、创业工作室（venture studio）、孵化器与加速器、连续创业者的控股主体用 name.ventures，域名本身就是一句投资宣言。英文里 ventures 是基金命名的标准后缀词（Sequoia、a16z 的全名都带 ventures），域名直接用 .ventures 反而省掉了主体里的重复。Identity Digital 运营，注册约 $6（约 ¥41），续费约 $48/年（约 ¥346），对基金管理费来说可以忽略。库存极好：姓氏、地名、意象词命中率都高。注意三点：一是它偏机构与资本语气，单一产品或 2C 品牌不合适；二是基金品牌重信任，主体名用姓氏、合伙人组合或稳重意象词，别用轻佻词；三是八个字母偏长，配短主体名读起来才利落。命名上「姓氏/合伙人 + .ventures」最自然（基金业传统），创业工作室用「品牌词 + .ventures」，主题基金用「领域 + .ventures」（climate、bio 类）一眼点明赛道。",
      bestFor: ["风投与天使基金", "创业工作室与孵化器", "连续创业者控股主体", "企业创新投资部门"],
      namingTips: [
        "「姓氏/合伙人 + .ventures」是基金业传统写法",
        "注册约 $6、续费约 $48/年，管理费下无感",
        "「领域 + .ventures」一眼点明赛道（climate、bio 类）",
        "机构与资本语气，单一 2C 产品别用",
      ],
    },
    en: {
      title: ".ventures Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".ventures writes the bet on the future into the address — for VC funds, venture studios, accelerators and serial founders. See live pricing and naming advice, then hunt available .ventures names with AI.",
      intro:
        ".ventures writes the bet into the address: VC and angel funds, venture studios, incubators and accelerators, serial founders' holding entities on name.ventures make the domain itself an investment thesis. In fund naming, \"ventures\" is already the standard trailing word — using the TLD saves repeating it in the name. Operated by Identity Digital, about $6 to register and $48/yr to renew — a rounding error against management fees. Inventory is excellent: surnames, place names and imagery words all hit. Three cautions: the register is institutional capital — wrong for a single product or consumer brand; fund brands trade on trust, so front words should be surnames, partner combinations or steady imagery, never flippant; and eight letters isn't short, so a short front word keeps it crisp. Naming: surname or partners + .ventures is the fund-industry classic; venture studios go brand word + .ventures; thesis funds say the lane instantly as field + .ventures (climate, bio).",
      bestFor: ["VC & angel funds", "Venture studios & incubators", "Serial founders' holdcos", "Corporate venture arms"],
      namingTips: [
        "Surname + .ventures — the fund-industry classic",
        "About $6 to register, $48/yr to renew",
        "Field + .ventures says the lane (climate, bio)",
        "Institutional register — consumer brands look elsewhere",
      ],
    },
  },
  capital: {
    tld: "capital",
    zh: {
      title: ".capital 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".capital 把资本身份写进域名，适合私募与风投基金、资产管理公司、家族办公室与投资机构。查看 .capital 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .capital 域名。",
      intro:
        ".capital 是资本行业的正装后缀：私募与风投基金、资产管理与量化机构、家族办公室、投行与并购顾问用 name.capital，域名念出来就是公司全名——英文基金名以 Capital 结尾是行业惯例（Benchmark Capital 类），.capital 让「品牌词 + 后缀」直接等于注册主体名。它与 .ventures 的语气差异在阶段——ventures 偏早期与冒险，capital 偏机构与规模：管理规模越大越适合后者。Identity Digital 运营，注册约 $6（约 ¥41），续费约 $57/年（约 ¥412），续费在本站偏高档，但对资管行业完全无感。库存极好：姓氏、地名、意象词命中率都高。注意三点：一是金融属性强，合规要求高的地区注意展示牌照信息，域名越正式越要经得起尽调；二是主体名务必稳重，姓氏、山川意象是基金命名主流，轻佻词会毁掉信任感；三是七个字母配短主体名读起来最有分量。命名上「姓氏/意象词 + .capital」最自然（基金业标准），量化机构用「策略词 + .capital」，区域基金用「城市 + .capital」一语双关（capital 也是「首府」）。",
      bestFor: ["私募与风投基金", "资产管理与量化机构", "家族办公室", "投行与并购顾问"],
      namingTips: [
        "「姓氏/意象词 + .capital」等于基金全名",
        "注册约 $6、续费约 $57/年，资管行业无感",
        "「城市 + .capital」一语双关（capital 也是首府）",
        "主体名务必稳重，轻佻词毁掉信任感",
      ],
    },
    en: {
      title: ".capital Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".capital is the suit-and-tie suffix — for PE and VC funds, asset managers, family offices and investment firms. See live pricing and naming advice, then hunt available .capital names with AI.",
      intro:
        ".capital is the suit-and-tie suffix of finance: PE and VC funds, asset managers and quant shops, family offices, M&A advisories on name.capital read out as the firm's full name — fund names ending in \"Capital\" are the industry convention (think Benchmark Capital), and the TLD makes brand word + suffix equal the registered entity. The tone gap with .ventures is stage — ventures leans early and adventurous, capital leans institutional and scaled: the bigger the AUM, the better it fits. Operated by Identity Digital, about $6 to register and $57/yr to renew — high-tier renewal here, invisible to an asset manager. Inventory is excellent: surnames, place names and imagery words all hit. Three cautions: the financial register invites scrutiny — display licensing information where regulation requires, because a formal domain must survive due diligence; front words must be steady — surnames and landscape imagery dominate fund naming, and flippant words destroy trust; and seven letters carries best with a short front word. Naming: surname or imagery + .capital is the fund standard; quant shops work strategy word + .capital; regional funds pun nicely as city + .capital (capital city included).",
      bestFor: ["PE & VC funds", "Asset managers & quant shops", "Family offices", "M&A & investment advisories"],
      namingTips: [
        "Surname + .capital reads as the firm's full name",
        "About $6 to register, $57/yr to renew",
        "City + .capital puns on the capital city",
        "Steady front words only — flippancy kills trust",
      ],
    },
  },
  guru: {
    tld: "guru",
    zh: {
      title: ".guru 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".guru 把专家人设写进域名，适合独立专家、教程与攻略站、咨询顾问与兴趣领域达人。查看 .guru 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .guru 域名。",
      intro:
        ".guru 自带一点幽默的专家人设：独立专家与顾问、教程与攻略站、修理与生活技能达人、兴趣领域 KOL 用 name.guru，域名读出来就是「这事问我」。它与 .expert 的差别在温度——expert 一本正经，guru 带自嘲式的亲切：面向大众的教程与攻略内容用 guru 反而更好记、更易传播（fitness.guru 比 fitness.expert 顺口）。Identity Digital 运营，注册约 $3（约 ¥19）是本站便宜档，续费约 $35/年（约 ¥248）注意差价。库存极好：领域词、动词、爱好词命中率都高。注意三点：一是 guru 的语气轻，正式 B2B 咨询与金融法务场景慎用，用 .consulting/.expert 更稳；二是首年超便宜续费翻十倍，做长期品牌先算清续费账；三是「领域 + .guru」的组合极其点题，但也意味着你得真的「guru」——内容质量撑不起人设时域名会反噬。命名上「领域 + .guru」最自然（excel、bbq 类一眼懂），个人品牌用「昵称 + .guru」，工具站用「动词 + .guru」也很顺。",
      bestFor: ["独立专家与顾问", "教程与攻略站", "修理与生活技能达人", "兴趣领域 KOL"],
      namingTips: [
        "「领域 + .guru」读出来就是「这事问我」",
        "注册约 $3 超便宜，续费约 $35/年注意差价",
        "语气轻松亲切，正式 B2B 场景用 .consulting",
        "人设要立得住——内容撑不起 guru 会反噬",
      ],
    },
    en: {
      title: ".guru Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".guru wears expertise with a wink — for independent experts, how-to sites, consultants and hobby authorities. See live pricing and naming advice, then hunt available .guru names with AI.",
      intro:
        ".guru wears expertise with a wink: independent experts and consultants, how-to and tutorial sites, repair and life-skill teachers, hobby authorities on name.guru say \"ask me about this\" right in the address. The temperature gap with .expert matters — expert is straight-faced, guru is self-aware and friendly: for mass-audience tutorials and guides, guru is more memorable and shareable (fitness.guru rolls better than fitness.expert). Operated by Identity Digital, about $3 to register — the cheap tier here — and about $35/yr to renew, so mind the gap. Inventory is excellent: field words, verbs and hobby words all hit. Three cautions: the tone is light — for formal B2B consulting, finance or legal, .consulting or .expert reads safer; the first year is ten times cheaper than renewal, so budget the long game; and field + .guru is deliciously on the nose, which means you must actually deliver — a guru domain with thin content backfires. Naming: field + .guru is the natural pattern (excel, bbq — instantly clear); personal brands go nickname + .guru; tool sites roll nicely as verb + .guru.",
      bestFor: ["Independent experts & consultants", "How-to & tutorial sites", "Repair & life-skill teachers", "Hobby authorities & creators"],
      namingTips: [
        "Field + .guru says \"ask me about this\"",
        "About $3 to register — but $35/yr to renew",
        "Light tone — formal B2B fits .consulting better",
        "Deliver real expertise or the name backfires",
      ],
    },
  },
  tips: {
    tld: "tips",
    zh: {
      title: ".tips 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".tips 把实用建议写进域名，适合攻略与技巧站、垂类内容博客、工具型 newsletter 与生活妙招品牌。查看 .tips 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .tips 域名。",
      intro:
        ".tips 把内容承诺写进域名：攻略与技巧站、垂类内容博客、工具型 newsletter、生活妙招与省钱指南用 name.tips，访客点开之前就知道能得到什么——「这里有实用建议」。它是内容站里最「言出必行」的后缀之一：travel.tips、tax.tips 这类组合读出来就是搜索框里的查询词，天然贴合搜索意图。Identity Digital 运营，注册约 $8（约 ¥59），续费约 $25/年（约 ¥182），温和档。库存极好：领域词、场景词、动词命中率都高。注意三点：一是 tips 设定了「实用、轻量」的预期，深度长文与严肃研究站用 .blog/.wiki 气质更合；二是它是复数轻内容词，电商与 SaaS 主站不合适，适合做内容资产或引流站；三是英文里 tips 也有「小费」义，餐饮场景可以玩双关但要想清楚歧义。命名上「领域 + .tips」最自然（读出来就是搜索词），个人博主用「昵称 + .tips」，场景站用「场景 + .tips」（interview、moving 类）精准命中长尾搜索。",
      bestFor: ["攻略与技巧站", "垂类内容博客", "工具型 newsletter", "生活妙招与省钱指南"],
      namingTips: [
        "「领域 + .tips」读出来就是搜索框里的查询词",
        "注册约 $8、续费约 $25/年，温和档",
        "「场景 + .tips」精准命中长尾搜索（interview 类）",
        "轻内容预期，深度研究站用 .blog/.wiki",
      ],
    },
    en: {
      title: ".tips Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".tips promises useful advice right in the address — for how-to sites, niche blogs, utility newsletters and life-hack brands. See live pricing and naming advice, then hunt available .tips names with AI.",
      intro:
        ".tips writes the content promise into the address: how-to and technique sites, niche blogs, utility newsletters, life hacks and money-saving guides on name.tips tell visitors exactly what they'll get before the click. It is one of the most self-fulfilling content suffixes — travel.tips or tax.tips reads like the search query itself, naturally aligned with search intent. Operated by Identity Digital, about $8 to register and $25/yr to renew — the mild tier. Inventory is excellent: field words, scenario words and verbs all hit. Three cautions: tips sets a \"useful and light\" expectation — long-form research sites wear .blog or .wiki better; it's a plural content word, wrong for an e-commerce or SaaS main site — think content asset or traffic property; and in English tips also means gratuities, a pun restaurants can play with as long as the ambiguity is deliberate. Naming: field + .tips is the natural pattern (it reads as the search query); personal writers go nickname + .tips; scenario sites nail long-tail search as scenario + .tips (interview, moving).",
      bestFor: ["How-to & technique sites", "Niche content blogs", "Utility newsletters", "Life hacks & savings guides"],
      namingTips: [
        "Field + .tips reads as the search query itself",
        "About $8 to register, $25/yr to renew",
        "Scenario + .tips nails long-tail search (interview)",
        "Light-content register — research sites fit .blog/.wiki",
      ],
    },
  },
  directory: {
    tld: "directory",
    zh: {
      title: ".directory 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".directory 把「名录」写进域名，适合行业名录站、本地商家黄页、资源导航与工具聚合站。查看 .directory 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .directory 域名。",
      intro:
        ".directory 把网站形态直接写进域名：行业名录、本地商家黄页、资源导航站、工具与服务聚合页用 name.directory，访客点开之前就知道「这是一份可以翻的清单」。独立开发者圈的 indie 名录、设计资源导航正是它的主场——名录站是最经典的可持续小生意之一，域名本身就完成了定位。Identity Digital 运营，注册约 $5（约 ¥33），续费约 $22/年（约 ¥159），是本站便宜档，做多个垂类名录矩阵也不心疼。库存极好：行业词、城市词、领域词命中率都高。注意三点：一是 directory 九个字母偏长，主体名务必短，「垂类词 + .directory」读起来才顺；二是名录的价值在数据新鲜度，域名越点题越要维护得勤，过期名录会砸口碑；三是它是形态词不是品牌词，主站品牌建议另备主域，把 .directory 当内容资产或引流站。命名上「行业 + .directory」最自然（saas、cafe 类一眼懂），本地站用「城市 + .directory」，资源站用「主题 + .directory」精准命中搜索意图。",
      bestFor: ["行业名录与黄页站", "本地商家名录", "资源导航与聚合站", "工具与服务清单"],
      namingTips: [
        "「行业 + .directory」读出来就是站点定位",
        "注册约 $5、续费约 $22/年，便宜档",
        "「城市 + .directory」做本地名录很点题",
        "九个字母偏长，主体名务必短",
      ],
    },
    en: {
      title: ".directory Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".directory writes the listing right into the address — for industry directories, local business listings, resource collections and tool roundups. See live pricing and naming advice, then hunt available .directory names with AI.",
      intro:
        ".directory writes the site format into the address: industry directories, local business listings, resource collections, tool and service roundups on name.directory tell visitors \"this is a browsable list\" before the click. Indie-maker directories and design-resource collections are its home turf — the directory site is one of the classic sustainable micro-businesses, and the domain does the positioning for you. Operated by Identity Digital, about $5 to register and $22/yr to renew — the cheap tier here, painless even for a portfolio of niche directories. Inventory is excellent: industry words, city names and field words all hit. Three cautions: directory is nine letters, so keep the front word short — vertical + .directory is what reads well; a directory's value is data freshness, and the more on-the-nose the domain, the more a stale list hurts; and it's a format word, not a brand word — keep a separate main domain for the brand and treat .directory as a content asset or traffic property. Naming: industry + .directory is the natural pattern (saas, cafe — instantly clear); local sites go city + .directory; resource sites nail search intent as topic + .directory.",
      bestFor: ["Industry directories & listings", "Local business directories", "Resource collections", "Tool & service roundups"],
      namingTips: [
        "Industry + .directory says what the site is",
        "About $5 to register, $22/yr to renew",
        "City + .directory nails local listings",
        "Nine letters — keep the front word short",
      ],
    },
  },
  exchange: {
    tld: "exchange",
    zh: {
      title: ".exchange 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".exchange 把交易与流通写进域名，适合交易平台与撮合市场、二手与置换社区、汇率与积分兑换工具。查看 .exchange 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .exchange 域名。",
      intro:
        ".exchange 把「交换」这个动作写进域名：交易与撮合平台、二手置换与以物易物社区、汇率与积分兑换工具、数据与 API 市场用 name.exchange，域名读出来就是平台的核心动词。它与 .market 的差异在方向——market 偏「陈列售卖」，exchange 偏「双向流通」：撮合两侧供需的平台用后者更准。Identity Digital 运营，注册约 $6（约 ¥44），续费约 $31/年（约 ¥226），温和档。库存极好：品类词、资产词、动词命中率都高。注意三点：一是英文里 exchange 与证券交易所强关联，金融属性强的项目注意当地牌照与合规展示，域名越像交易所越要经得起监管审视；二是八个字母偏长，主体名选短词，读起来才利落；三是撮合平台冷启动靠两侧供给，域名的角色是让「平台感」一步到位，别指望域名本身带流量。命名上「品类 + .exchange」最自然（art、gpu 类一眼懂），社区置换用「物品 + .exchange」，B2B 市场用「行业 + .exchange」显得专业对口。",
      bestFor: ["交易与撮合平台", "二手与置换社区", "汇率与积分兑换工具", "数据与 API 市场"],
      namingTips: [
        "「品类 + .exchange」读出来就是平台核心动词",
        "注册约 $6、续费约 $31/年，温和档",
        "金融属性强，牌照与合规展示要跟上",
        "八个字母偏长，主体名选短词",
      ],
    },
    en: {
      title: ".exchange Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".exchange writes the trade into the address — for marketplaces and matching platforms, swap communities, currency and points converters. See live pricing and naming advice, then hunt available .exchange names with AI.",
      intro:
        ".exchange writes the verb into the address: trading and matching platforms, second-hand swap and barter communities, currency and points converters, data and API marketplaces on name.exchange put the platform's core action right in the domain. The split with .market is direction — market leans \"display and sell\", exchange leans \"two-way flow\": platforms matching both sides of supply and demand wear it better. Operated by Identity Digital, about $6 to register and $31/yr to renew — the mild tier. Inventory is excellent: category words, asset words and verbs all hit. Three cautions: in English, exchange rings of stock exchanges — financial projects should mind licensing and compliance display, because the more exchange-like the domain, the more regulatory scrutiny it invites; eight letters isn't short, so pick a short front word to keep it crisp; and matching platforms cold-start on two-sided supply — the domain's job is instant platform credibility, not traffic. Naming: category + .exchange is the natural pattern (art, gpu — instantly clear); swap communities go item + .exchange; B2B marketplaces read professionally as industry + .exchange.",
      bestFor: ["Marketplaces & matching platforms", "Swap & barter communities", "Currency & points converters", "Data & API marketplaces"],
      namingTips: [
        "Category + .exchange puts the core verb in the address",
        "About $6 to register, $31/yr to renew",
        "Financial ring — keep licensing display in order",
        "Eight letters — keep the front word short",
      ],
    },
  },
  institute: {
    tld: "institute",
    zh: {
      title: ".institute 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".institute 把研究机构的庄重写进域名，适合研究院与智库、培训与认证机构、行业研究组织与非营利项目。查看 .institute 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .institute 域名。",
      intro:
        ".institute 自带研究机构的庄重：研究院与智库、培训与认证机构、行业研究组织、非营利研究项目用 name.institute，域名念出来就是机构全名——英文里机构名以 Institute 结尾是惯例（AI 安全、经济政策类研究所几乎都这么起名），.institute 让「主题词 + 后缀」直接等于机构名。它与 .academy 的分野在气质——academy 偏教学与课程，institute 偏研究与权威：产出报告与标准的组织用后者更合。Identity Digital 运营，注册约 $8（约 ¥56），续费约 $22/年（约 ¥159），温和档且续费友好。库存极好：领域词、主题词命中率都高。注意三点：一是 institute 语气庄重，个人博客与轻内容站压不住这个后缀，内容单薄会显得名不副实；二是九个字母偏长，主体名务必短，「领域 + .institute」读起来才像正经机构；三是部分地区对「研究院/学院」类名称有注册资质要求，对外宣传注意口径。命名上「领域 + .institute」最自然（ai、privacy 类一眼懂），智库用「议题 + .institute」，培训机构用「技能 + .institute」显得课程体系化。",
      bestFor: ["研究院与智库", "培训与认证机构", "行业研究组织", "非营利研究项目"],
      namingTips: [
        "「领域 + .institute」读出来就是机构全名",
        "注册约 $8、续费约 $22/年，续费友好",
        "语气庄重，内容单薄会名不副实",
        "九个字母偏长，主体名务必短",
      ],
    },
    en: {
      title: ".institute Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".institute carries research-grade gravitas — for think tanks, training and certification bodies, industry research groups and nonprofits. See live pricing and naming advice, then hunt available .institute names with AI.",
      intro:
        ".institute carries the gravitas of a research body: think tanks and research groups, training and certification bodies, industry research organizations, nonprofit research projects on name.institute read out as the organization's full name — institute is the conventional trailing word in English (AI-safety and economic-policy shops alike), and the TLD makes topic word + suffix equal the institution's name. The split with .academy is register — academy leans teaching and courses, institute leans research and authority: organizations that publish reports and standards wear it better. Operated by Identity Digital, about $8 to register and $22/yr to renew — mild tier with a friendly renewal. Inventory is excellent: field words and topic words all hit. Three cautions: the register is formal — personal blogs and light content can't carry it, and thin content under an institute domain reads as overreach; nine letters isn't short, so keep the front word short for it to sound like a real institution; and some jurisdictions regulate \"institute\" in registered names, so mind how you present yourself. Naming: field + .institute is the natural pattern (ai, privacy — instantly clear); think tanks go issue + .institute; training bodies read structured as skill + .institute.",
      bestFor: ["Think tanks & research groups", "Training & certification bodies", "Industry research organizations", "Nonprofit research projects"],
      namingTips: [
        "Field + .institute reads as the org's full name",
        "About $8 to register, $22/yr to renew",
        "Formal register — thin content reads as overreach",
        "Nine letters — keep the front word short",
      ],
    },
  },
  international: {
    tld: "international",
    zh: {
      title: ".international 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".international 把全球化身份写进域名，适合跨国业务与出海品牌、国际组织与 NGO、留学与跨境服务机构。查看 .international 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .international 域名。",
      intro:
        ".international 把「跨国」写进域名：跨国业务与出海品牌、国际组织与 NGO、留学与移民服务、跨境物流与贸易公司用 name.international，域名本身就是一句「我们做全球生意」。英文里公司名以 International 结尾是老牌跨国企业的经典写法，.international 让「品牌词 + 后缀」直接等于注册主体名，比塞进主体名里优雅得多。Identity Digital 运营，注册约 $8（约 ¥59），续费约 $25/年（约 ¥182），温和档。库存极好：品牌词、姓氏、行业词命中率都高。注意三点：一是它是全站最长的后缀之一（13 个字母），主体名必须极短，两三个音节封顶，否则名片和地址栏都装不下；二是气质偏正式与机构感，轻快的 2C 产品不合适；三是「international」的承诺要兑现——只有一种语言一个市场的站点用它会显得空。命名上「品牌词 + .international」最自然（跨国企业经典写法），NGO 用「使命词 + .international」，服务机构用「姓氏/城市 + .international」也很稳。",
      bestFor: ["跨国业务与出海品牌", "国际组织与 NGO", "留学与移民服务", "跨境物流与贸易"],
      namingTips: [
        "「品牌词 + .international」等于跨国公司全名",
        "注册约 $8、续费约 $25/年，温和档",
        "13 个字母超长，主体名两三个音节封顶",
        "全球承诺要兑现，单一市场站会显得空",
      ],
    },
    en: {
      title: ".international Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".international writes the global footprint into the address — for cross-border brands, NGOs and international organizations, study-abroad and trade services. See live pricing and naming advice, then hunt available .international names with AI.",
      intro:
        ".international writes the footprint into the address: cross-border businesses and global brands, international organizations and NGOs, study-abroad and immigration services, freight and trade companies on name.international state \"we operate worldwide\" in the domain itself. Company names ending in \"International\" are the classic multinational convention, and the TLD makes brand word + suffix equal the registered entity — far more elegant than cramming it into the name. Operated by Identity Digital, about $8 to register and $25/yr to renew — the mild tier. Inventory is excellent: brand words, surnames and industry words all hit. Three cautions: at thirteen letters it is among the longest TLDs anywhere, so the front word must be very short — two or three syllables at most, or it won't fit a business card or an address bar; the register is formal and institutional, wrong for playful consumer products; and the promise must be kept — a single-language, single-market site under .international rings hollow. Naming: brand word + .international is the multinational classic; NGOs go mission word + .international; service firms hold steady as surname or city + .international.",
      bestFor: ["Cross-border businesses & global brands", "International organizations & NGOs", "Study-abroad & immigration services", "Freight & trade companies"],
      namingTips: [
        "Brand + .international reads as the multinational's full name",
        "About $8 to register, $25/yr to renew",
        "Thirteen letters — two or three syllables up front, max",
        "Deliver the global promise or it rings hollow",
      ],
    },
  },
  partners: {
    tld: "partners",
    zh: {
      title: ".partners 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".partners 把合伙人身份写进域名，适合律所与咨询公司、基金与投资合伙、联盟与渠道合作计划。查看 .partners 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .partners 域名。",
      intro:
        ".partners 是专业服务业的合伙人门牌：律所与会计师事务所、咨询公司、基金与投资合伙（LP/GP 结构）、企业的渠道与联盟合作计划用 name.partners，域名念出来就是公司全名——英文里专业所以 Partners 结尾是行业惯例（律所、基金常见写法），.partners 让「姓氏 + 后缀」直接等于注册主体名。它与 .capital 的分工在行业——capital 偏资管，partners 覆盖所有合伙制专业服务：律师、咨询、设计事务所都顺。Identity Digital 运营，注册约 $8（约 ¥56），续费约 $57/年（约 ¥412），续费在本站偏高档，但对专业服务客单价完全无感。库存极好：姓氏、双姓组合、行业词命中率都高。注意三点：一是它天然复数且偏机构语气，个人独立顾问用单数气质的 .pro/.expert 更合；二是品牌重信任，主体名用姓氏或稳重词，轻佻词会毁掉专业感；三是大企业的「合作伙伴计划」页面用 brand.partners 做专属入口也是经典用法，值得保护性注册。命名上「姓氏/双姓 + .partners」最自然（专业所传统），基金用「意象词 + .partners」，渠道计划用「品牌词 + .partners」一眼点题。",
      bestFor: ["律所与会计师事务所", "咨询与专业服务公司", "基金与投资合伙", "渠道与联盟合作计划"],
      namingTips: [
        "「姓氏/双姓 + .partners」等于专业所全名",
        "注册约 $8、续费约 $57/年，注意续费档",
        "brand.partners 做合作伙伴计划入口很经典",
        "机构语气，个人顾问用 .pro/.expert 更合",
      ],
    },
    en: {
      title: ".partners Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".partners is the professional-partnership nameplate — for law and consulting firms, investment partnerships, and channel or alliance programs. See live pricing and naming advice, then hunt available .partners names with AI.",
      intro:
        ".partners is the brass nameplate of professional services: law and accounting firms, consultancies, investment partnerships (LP/GP structures), and corporate channel or alliance programs on name.partners read out as the firm's full name — \"Partners\" is the conventional trailing word for firms and funds, and the TLD makes surname + suffix equal the registered entity. The split with .capital is industry — capital leans asset management, partners covers every partnership-shaped profession: lawyers, consultants and design studios all roll. Operated by Identity Digital, about $8 to register and $57/yr to renew — high-tier renewal here, invisible against professional-services fees. Inventory is excellent: surnames, double-surname pairs and trade words all hit. Three cautions: it's plural and institutional — a solo consultant reads better on .pro or .expert; partnership brands trade on trust, so front words should be surnames or steady words, never flippant; and brand.partners as a company's partner-program front door is a classic use worth a defensive registration. Naming: surname or double surname + .partners is the firm tradition; funds go imagery word + .partners; channel programs say it instantly as brand + .partners.",
      bestFor: ["Law & accounting firms", "Consultancies & professional services", "Investment partnerships", "Channel & alliance programs"],
      namingTips: [
        "Surname + .partners reads as the firm's full name",
        "About $8 to register, $57/yr to renew — mind the renewal",
        "brand.partners is the classic partner-program door",
        "Institutional plural — solo consultants fit .pro/.expert",
      ],
    },
  },
  support: {
    tld: "support",
    zh: {
      title: ".support 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".support 把「来这里求助」写进域名，适合产品帮助中心、客服与售后团队、技术支持服务商与公益互助组织。查看 .support 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .support 域名。",
      intro:
        ".support 把求助入口写进域名：产品帮助中心与知识库、客服与售后团队、IT 与技术支持服务商、公益热线与互助社区用 name.support，用户遇到问题时下意识会试的地址就是 brand.support。它是最「功能自明」的后缀之一：主站放品牌域，帮助中心放 brand.support，路径清晰又好记，比 support.brand.com 的子域更短更顺口。Identity Digital 运营，注册约 $7（约 ¥48），续费约 $22/年（约 ¥159），是本站便宜档，给已有品牌做保护性注册毫无压力。库存极好：品牌词、品类词、设备词命中率都高。注意三点：一是它是功能词不是品牌词，新品牌主域另选，.support 做配套入口；二是既然域名承诺了支持，响应质量要跟上——挂着 .support 却无人应答比没有更伤；三是独立技术支持服务商用「品类 + .support」接单很顺（printer、mac 类），但注意与品牌方商标的边界。命名上「品牌 + .support」最自然（帮助中心标准写法），服务商用「品类/设备 + .support」，公益组织用「议题 + .support」传递陪伴感。",
      bestFor: ["产品帮助中心与知识库", "客服与售后团队", "IT 与技术支持服务商", "公益热线与互助社区"],
      namingTips: [
        "「品牌 + .support」是帮助中心标准写法",
        "注册约 $7、续费约 $22/年，便宜档",
        "「品类 + .support」接单顺，注意商标边界",
        "功能词非品牌词，主域另选、它做配套",
      ],
    },
    en: {
      title: ".support Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".support writes the help desk into the address — for product help centers, customer service teams, IT support providers and community helplines. See live pricing and naming advice, then hunt available .support names with AI.",
      intro:
        ".support writes the help entrance into the address: product help centers and knowledge bases, customer service and after-sales teams, IT and tech-support providers, helplines and mutual-aid communities on name.support give users the address they'd instinctively try — brand.support. It is one of the most self-explaining suffixes: main site on the brand domain, help center on brand.support — shorter and smoother than a support.brand.com subdomain. Operated by Identity Digital, about $7 to register and $22/yr to renew — the cheap tier here, an easy defensive registration for any existing brand. Inventory is excellent: brand words, category words and device words all hit. Three cautions: it's a function word, not a brand word — pick a separate main domain and let .support be the companion door; the domain promises help, so response quality must follow — an unanswered .support hurts more than none; and independent providers book work nicely as category + .support (printer, mac), but mind trademark boundaries with the brands involved. Naming: brand + .support is the help-center standard; providers go category or device + .support; nonprofits carry warmth as cause + .support.",
      bestFor: ["Product help centers & knowledge bases", "Customer service & after-sales teams", "IT & tech-support providers", "Helplines & mutual-aid communities"],
      namingTips: [
        "Brand + .support is the help-center standard",
        "About $7 to register, $22/yr to renew",
        "Category + .support books work — mind trademarks",
        "Function word, not a brand — keep a separate main domain",
      ],
    },
  },
  plus: {
    tld: "plus",
    zh: {
      title: ".plus 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".plus 把「增强版」写进域名，适合产品 Pro/会员版、增值服务、社区加强版与升级套餐页。查看 .plus 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .plus 域名。",
      intro:
        ".plus 把「更进一步」写进域名：产品的 Pro/会员版、增值服务与升级套餐、社区加强版、工具的扩展版用 name.plus，读出来就是「同一个东西，更好的那档」。流媒体时代 Plus 后缀早已深入人心（各大平台的 + 订阅版都是这个语感），brand.plus 天然让用户联想到付费升级入口。Identity Digital 运营，注册约 $10（约 ¥70），续费约 $44/年（约 ¥315），续费偏高档，适合真正承载付费业务的入口而非闲置注册。库存极好：品牌词、品类词命中率都高。注意三点：一是它是修饰词不是品牌词，主站放品牌主域，.plus 做会员/升级版专属入口最顺；二是既然域名喊了 plus，落地页要立刻讲清「比普通版多什么」，否则名不副实；三是四个字母短而顺口，但拼写时注意别与 + 号混淆，口头传播要说清「p-l-u-s」。命名上「品牌 + .plus」最自然（会员版标准写法），服务商用「品类 + .plus」表达增强定位，套餐页用「产品 + .plus」直接当升级跳转页。",
      bestFor: ["产品 Pro/会员版入口", "增值服务与升级套餐", "社区与内容加强版", "工具扩展与插件版"],
      namingTips: [
        "「品牌 + .plus」是会员/升级版标准写法",
        "注册约 $10、续费约 $44/年，注意续费档",
        "落地页要立刻讲清比普通版多什么",
        "口头传播说清 p-l-u-s，别与 + 号混淆",
      ],
    },
    en: {
      title: ".plus Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".plus writes the upgrade into the address — for Pro/member tiers, value-added services, enhanced community editions and upgrade pages. See live pricing and naming advice, then hunt available .plus names with AI.",
      intro:
        ".plus writes \"one step up\" into the address: a product's Pro or member tier, value-added services and upgrade bundles, enhanced community editions, extended tool versions on name.plus read as \"the same thing, but the better tier\". The streaming era made the Plus suffix a household pattern (every major platform's + subscription), so brand.plus instantly reads as the paid-upgrade door. Operated by Identity Digital, about $10 to register and $44/yr to renew — a higher renewal tier, best for a door that actually carries paid business rather than an idle registration. Inventory is excellent: brand words and category words all hit. Three cautions: it's a modifier, not a brand word — keep the main site on the brand domain and let .plus be the member/upgrade entrance; if the domain shouts plus, the landing page must immediately say what's extra over the standard tier; and while four letters are short and smooth, spell out p-l-u-s aloud so it isn't confused with the + sign. Naming: brand + .plus is the member-tier standard; providers position as category + .plus; bundle pages jump straight from product + .plus.",
      bestFor: ["Pro/member tier entrances", "Value-added services & upgrades", "Enhanced community editions", "Tool extensions & add-ons"],
      namingTips: [
        "Brand + .plus is the member-tier standard",
        "About $10 to register, $44/yr to renew — mind the renewal",
        "The landing page must say what's extra, fast",
        "Spell out p-l-u-s — don't get confused with +",
      ],
    },
  },
  house: {
    tld: "house",
    zh: {
      title: ".house 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".house 把「家宅」写进域名，适合房产经纪与租售平台、家居装修品牌、民宿与设计工作室（House 命名传统）。查看 .house 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .house 域名。",
      intro:
        ".house 把房子写进域名：房产经纪与租售信息平台、家装与家居品牌、民宿与短租、建筑与室内设计工作室用 name.house，域名一眼就是「跟住有关」。它还有一层妙用——英文里创意机构、唱片公司、出版社惯用 House 结尾（design house、publishing house），brand.house 让「品牌词 + 后缀」直接等于机构全名，比 .studio 更多一分「宅邸感」。与 .estate 的分工：estate 偏资产与地产投资，house 偏「一栋一栋的房子」与居住场景，2C 的租售和家装用它更亲切。Identity Digital 运营，注册约 $15（约 ¥107），续费约 $36/年（约 ¥256），中档价位。库存极好：城市词、风格词、姓氏命中率都高。注意三点：一是房产是强本地生意，「城市/街区 + .house」比泛词更能接住本地搜索；二是它是场景词不是资质词，房产中介的执照与备案信息照样要在页面讲清；三是拼写零门槛，但英文语境里 house 也可能被理解为机构名，定位要靠首屏文案钉死。命名上「城市 + .house」最自然（本地租售一眼懂），家装品牌用「风格词 + .house」，工作室用「品牌词 + .house」念出来就是全名。",
      bestFor: ["房产经纪与租售平台", "家装与家居品牌", "民宿与短租", "建筑与设计工作室"],
      namingTips: [
        "「城市 + .house」接住本地租售搜索",
        "注册约 $15、续费约 $36/年，中档",
        "「品牌词 + .house」念出来就是机构全名",
        "场景词非资质词，中介资质照样要展示",
      ],
    },
    en: {
      title: ".house Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".house writes home into the address — for real-estate agents and rental platforms, home & interior brands, guesthouses, and \"house\"-named studios. See live pricing and naming advice, then hunt available .house names with AI.",
      intro:
        ".house writes the home into the address: real-estate agents and rental platforms, home-improvement and furnishing brands, guesthouses and short-term rentals, architecture and interior studios on name.house are instantly \"about living\". There's a bonus register: creative agencies, record labels and publishers traditionally end in House (design house, publishing house), so brand.house makes brand word + suffix equal the organization's full name — one notch homier than .studio. The split with .estate: estate leans assets and property investment, house leans individual homes and living scenarios — consumer rentals and home brands read warmer here. Operated by Identity Digital, about $15 to register and $36/yr to renew — the mid tier. Inventory is excellent: city words, style words and surnames all hit. Three cautions: property is a fiercely local business, so city or neighborhood + .house catches local search better than generic words; it's a scenario word, not a credential — agents still need licenses and disclosures on the page; and while spelling is effortless, English readers may parse house as an institution name, so pin the positioning in the hero copy. Naming: city + .house is the natural local-rental pattern; home brands go style word + .house; studios read out their full name as brand + .house.",
      bestFor: ["Real-estate agents & rental platforms", "Home & furnishing brands", "Guesthouses & short-term rentals", "Architecture & design studios"],
      namingTips: [
        "City + .house catches local rental search",
        "About $15 to register, $36/yr to renew",
        "Brand + .house reads as the org's full name",
        "Scenario word, not a credential — show licenses",
      ],
    },
  },
  market: {
    tld: "market",
    zh: {
      title: ".market 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".market 把「市集」写进域名，适合垂类电商市场、二手与本地市集、数字资产商店与农夫市集。查看 .market 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .market 域名。",
      intro:
        ".market 把市集写进域名：垂类电商市场、二手与本地市集、数字资产与模板商店、农夫市集与周末集市用 name.market，访客点开之前就知道「这里能逛能买」。它与 .exchange 的分工在方向——exchange 偏双向撮合与流通，market 偏「陈列售卖」的多商家市集：聚合多个卖家的平台用它最点题。与 .store 的差异在规模感：store 是「一家店」，market 是「一片市集」，做 marketplace 模式选后者语义更准。Identity Digital 运营，注册约 $36（约 ¥256），续费约 $36/年（约 ¥256）——注册续费同价，没有首年甜头但也没有续费陷阱，长期持有成本透明。库存极好：品类词、城市词命中率都高。注意三点：一是六个字母不算长但读音靠后重音，主体名选短词更利落；二是市集的生命线是两侧供需，域名负责定位，冷启动还得靠运营；三是「品类 + .market」在英文里就是个通顺短语（art.market、nft.market 的语感），SEO 语义红利实打实。命名上「品类 + .market」最自然，本地市集用「城市/街区 + .market」，数字商店用「资产类型 + .market」一眼点题。",
      bestFor: ["垂类电商市场", "二手与本地市集", "数字资产与模板商店", "农夫市集与周末集市"],
      namingTips: [
        "「品类 + .market」读出来就是通顺短语",
        "注册续费同价约 $36/年，成本透明",
        "marketplace 模式用它比 .store 语义更准",
        "市集靠两侧供需，域名管定位不管流量",
      ],
    },
    en: {
      title: ".market Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".market writes the marketplace into the address — for vertical marketplaces, secondhand and local markets, digital-asset stores and farmers markets. See live pricing and naming advice, then hunt available .market names with AI.",
      intro:
        ".market writes the bazaar into the address: vertical e-commerce marketplaces, secondhand and local markets, digital-asset and template stores, farmers and weekend markets on name.market tell visitors \"browse and buy here\" before the click. The split with .exchange is direction — exchange leans two-way matching and flow, market leans multi-vendor display and sale: platforms aggregating many sellers read truest here. Against .store the difference is scale: store is one shop, market is a whole marketplace — marketplace businesses get the more accurate word. Operated by Identity Digital, about $36 to register and $36/yr to renew — same price both ways: no first-year sweetener, but no renewal trap either, so the long-term cost is transparent. Inventory is excellent: category words and city names all hit. Three cautions: six letters isn't long but keep the front word short for rhythm; a marketplace lives or dies by supply and demand on both sides — the domain does positioning, not cold-start; and category + .market is a natural English phrase (the art.market, nft.market cadence), a real semantic-SEO dividend. Naming: category + .market is the natural pattern; local markets go city or neighborhood + .market; digital stores say it instantly as asset type + .market.",
      bestFor: ["Vertical marketplaces", "Secondhand & local markets", "Digital-asset & template stores", "Farmers & weekend markets"],
      namingTips: [
        "Category + .market reads as a natural phrase",
        "Same ~$36 to register and renew — transparent cost",
        "Marketplace businesses fit it better than .store",
        "Two-sided supply is on you — the domain just positions",
      ],
    },
  },
  watch: {
    tld: "watch",
    zh: {
      title: ".watch 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".watch 一词双关「观看」与「腕表」，适合视频与直播站、监测与预警工具、腕表电商与钟表社区。查看 .watch 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .watch 域名。",
      intro:
        ".watch 一词双关：动词是「观看」，名词是「腕表」，还引申出「监测哨」——视频与直播聚合站、赛事与影视观看指南、价格与舆情监测工具（英文里 price watch、whale watch 的语感）、腕表电商与钟表爱好者社区用 name.watch 都点题。这种一后缀三场景的弹性在新 TLD 里少见。Identity Digital 运营，注册约 $3（约 ¥22），续费约 $36/年（约 ¥256）——首年是全站最便宜档之一，但续费翻十倍，验证想法便宜、长期持有要认续费账。库存极好：内容词、品牌词、监测对象词命中率都高。注意三点：一是双关是资产也是歧义，首屏要立刻讲清你是「看视频」「盯数据」还是「卖表」；二是影视聚合站注意版权边界，域名越点题越容易被盯上；三是监测工具用「对象 + .watch」是英文惯用语（storm.watch 语感），这类组合读起来最顺。命名上「内容/赛事 + .watch」做观看站，「监测对象 + .watch」做预警工具，「品牌/风格词 + .watch」做腕表生意，三条路都通。",
      bestFor: ["视频与直播聚合站", "监测与预警工具", "腕表电商与钟表社区", "赛事与影视观看指南"],
      namingTips: [
        "「监测对象 + .watch」是英文惯用语",
        "注册约 $3 超便宜，续费约 $36/年要认账",
        "双关有歧义，首屏立刻讲清哪个场景",
        "影视聚合注意版权，域名点题更易被盯",
      ],
    },
    en: {
      title: ".watch Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".watch puns on viewing and wristwatches — for video and streaming sites, monitoring and alert tools, watch retailers and horology communities. See live pricing and naming advice, then hunt available .watch names with AI.",
      intro:
        ".watch is a built-in pun: the verb is viewing, the noun is the wristwatch, and the idiom is the lookout — video and streaming aggregators, sports and show viewing guides, price and sentiment monitors (the price watch, whale watch cadence), watch retailers and horology communities all land on name.watch. Few new TLDs stretch across three scenes like this. Operated by Identity Digital, about $3 to register and $36/yr to renew — one of the cheapest first years on this site, but renewal is 10x, so it's cheap to validate an idea and a real line item to hold. Inventory is excellent: content words, brand words and monitoring targets all hit. Three cautions: the pun is an asset and an ambiguity — the hero section must instantly say whether you stream, monitor, or sell timepieces; streaming aggregators should mind copyright, and the more on-the-nose the domain, the more attention it draws; and target + .watch is native English idiom (the storm.watch cadence) — those combinations read smoothest. Naming: content or event + .watch for viewing sites, target + .watch for alert tools, brand or style word + .watch for the watch trade — all three roads run.",
      bestFor: ["Video & streaming aggregators", "Monitoring & alert tools", "Watch retailers & horology communities", "Sports & show viewing guides"],
      namingTips: [
        "Target + .watch is native English idiom",
        "About $3 to register, $36/yr to renew — 10x jump",
        "The pun is ambiguous — pin the scene in the hero",
        "Streaming sites: mind copyright exposure",
      ],
    },
  },
  style: {
    tld: "style",
    zh: {
      title: ".style 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".style 把「风格」写进域名，适合时尚穿搭博主、造型师与形象顾问、美妆美发品牌与生活方式媒体。查看 .style 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .style 域名。",
      intro:
        ".style 把风格写进域名：时尚穿搭博主、造型师与形象顾问、美妆美发与服饰品牌、生活方式媒体用 name.style，域名本身就带着「审美在线」的气场。它比 .fashion 更宽——fashion 锁死服装行业，style 覆盖穿搭、家居、文字、代码风格指南（brand style guide 也是它的地盘），个人品牌用「名字 + .style」念出来就是「某某的风格」，比 .com 上加 fashion/official 词缀优雅得多。Identity Digital 运营，注册约 $7（约 ¥52），续费约 $31/年（约 ¥226），温和档。库存极好：人名、风格词、城市词命中率都高。注意三点：一是它气质偏轻快时尚，严肃 B2B 与金融不合适；二是「风格」是主观承诺，站点视觉必须跟上——挂 .style 的网站设计粗糙比普通域名更减分；三是企业的品牌规范站用 brand.style 放 style guide 是设计圈的经典用法，值得保护性注册。命名上「人名 + .style」最自然（个人风格主页标准写法），品牌用「品牌词 + .style」，垂类媒体用「场景词 + .style」（street、home 类）一眼点题。",
      bestFor: ["时尚穿搭博主与造型师", "美妆美发与服饰品牌", "生活方式媒体", "品牌规范与设计系统站"],
      namingTips: [
        "「人名 + .style」念出来就是个人风格主页",
        "注册约 $7、续费约 $31/年，温和档",
        "brand.style 放品牌规范是设计圈经典用法",
        "挂 .style 视觉必须在线，粗糙更减分",
      ],
    },
    en: {
      title: ".style Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".style writes the aesthetic into the address — for fashion bloggers, stylists and image consultants, beauty brands and lifestyle media. See live pricing and naming advice, then hunt available .style names with AI.",
      intro:
        ".style writes the aesthetic into the address: fashion and outfit bloggers, stylists and image consultants, beauty and apparel brands, lifestyle media on name.style carry a \"taste included\" air in the domain itself. It's broader than .fashion — fashion locks you into apparel, style spans outfits, interiors, writing, even code conventions (the brand style guide is its turf too). A personal brand on yourname.style reads out as \"so-and-so's style\" — far more elegant than bolting fashion or official onto a .com. Operated by Identity Digital, about $7 to register and $31/yr to renew — the mild tier. Inventory is excellent: first names, style words and city names all hit. Three cautions: the register is light and fashionable — wrong for sober B2B and finance; style is a subjective promise, so the site's visuals must deliver — a rough-looking site hurts more under .style than under a plain domain; and brand.style hosting the company style guide is a design-community classic worth a defensive registration. Naming: first name + .style is the personal-style standard; brands go brand word + .style; niche media nail it as scene word + .style (street, home).",
      bestFor: ["Fashion bloggers & stylists", "Beauty & apparel brands", "Lifestyle media", "Brand style guides & design systems"],
      namingTips: [
        "First name + .style reads as a personal style page",
        "About $7 to register, $31/yr to renew",
        "brand.style for the style guide is a design classic",
        "Visuals must deliver — rough sites hurt more here",
      ],
    },
  },
  show: {
    tld: "show",
    zh: {
      title: ".show 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".show 把「节目」写进域名，适合播客与视频节目、演出与展览、直播秀与作品展示页。查看 .show 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .show 域名。",
      intro:
        ".show 把节目写进域名：播客与视频节目、脱口秀与综艺、演出与展览、直播秀与作品集展示页用 name.show，域名念出来就是节目全名——英文里节目名以 Show 结尾是百年传统（The Tonight Show 的语感），.show 让「节目名 + 后缀」直接等于完整名称，播客尤其受用。它与 .live 的分工在时态：live 强调「正在直播」，show 强调「这是一档节目」，有固定栏目感、可回放的内容用后者更准。Identity Digital 运营，注册约 $8（约 ¥59），续费约 $36/年（约 ¥256），中档。库存极好：节目词、人名、主题词命中率都高。注意三点：一是四个字母短而好记，但 show 也有「展示」义，作品集用它时首屏要立住「这是我的 show」的语气；二是节目是持续承诺，停更的 .show 域名比停更的博客更显眼；三是演出与展览的售票页用「活动名 + .show」做专属入口很顺，档期过后记得续期或归档。命名上「节目名/人名 + .show」最自然（The XX Show 传统），演出用「活动名 + .show」，作品展示用「品牌词 + .show」把「秀」的姿态摆足。",
      bestFor: ["播客与视频节目", "脱口秀与综艺", "演出与展览售票页", "直播秀与作品展示"],
      namingTips: [
        "「人名/节目名 + .show」等于节目全名",
        "注册约 $8、续费约 $36/年，中档",
        "有栏目感的内容用它比 .live 更准",
        "节目是持续承诺，停更比停博客更显眼",
      ],
    },
    en: {
      title: ".show Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".show writes the program into the address — for podcasts and video shows, performances and exhibitions, live shows and showcase pages. See live pricing and naming advice, then hunt available .show names with AI.",
      intro:
        ".show writes the program into the address: podcasts and video shows, talk shows and variety formats, performances and exhibitions, live shows and portfolio showcases on name.show read out as the show's full name — ending a program in \"Show\" is a century-old convention (The Tonight Show cadence), and the TLD makes show name + suffix equal the complete title. Podcasters benefit most. The split with .live is tense: live stresses \"streaming right now\", show stresses \"this is a program\" — recurring, replayable formats read truer here. Operated by Identity Digital, about $8 to register and $36/yr to renew — the mid tier. Inventory is excellent: show words, host names and topic words all hit. Three cautions: four letters are short and memorable, but show also means \"showcase\" — portfolios must own the \"this is my show\" tone in the hero; a show is an ongoing promise, and an abandoned .show reads worse than an abandoned blog; and event or exhibition ticket pages roll nicely as event name + .show — renew or archive once the run ends. Naming: host or show name + .show is the tradition (The XX Show); performances go event name + .show; showcases strike the pose as brand + .show.",
      bestFor: ["Podcasts & video shows", "Talk shows & variety formats", "Performance & exhibition pages", "Live shows & showcases"],
      namingTips: [
        "Host/show name + .show equals the full title",
        "About $8 to register, $36/yr to renew",
        "Recurring formats fit it better than .live",
        "A show is a promise — abandonment shows",
      ],
    },
  },
  website: {
    tld: "website",
    zh: {
      title: ".website 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".website 把「网站」两个字直接写进域名，适合个人主页与作品集、小微企业官网、落地页与临时活动站。查看 .website 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .website 域名。",
      intro:
        ".website 是最「说人话」的后缀：name.website 念出来就是「某某的网站」，个人主页与作品集、小微企业官网、产品落地页与临时活动站用它零解释成本。它与 .site 是同门兄弟（都由 Radix 运营），差别在语感——site 短但抽象，website 长两个音节却是完整单词，非技术人群一听就懂，面向大众的小生意用它更稳。注册约 $2（约 ¥14），续费约 $21/年（约 ¥152）——首年是全站最便宜档之一，验证想法几乎零成本，但续费是首年十倍，长期持有前先想清楚。库存极好：人名、店名、品类词命中率都高。注意三点：一是七个字母偏长，主体名务必选短词，否则整个域名冗长；二是「便宜后缀」历史上垃圾站多，新站要靠内容质量与 HTTPS、备案信息尽快建立信任；三是它是描述词不是行业词，不给你任何行业暗示，定位全靠主体名与首屏文案。命名上「人名/品牌 + .website」最自然（就是「我的网站」），本地小店用「店名 + .website」，活动站用「活动名 + .website」用完即弃也不心疼。",
      bestFor: ["个人主页与作品集", "小微企业官网", "产品落地页", "临时活动与专题站"],
      namingTips: [
        "「人名/品牌 + .website」念出来就是「某某的网站」",
        "注册约 $2 超便宜，续费约 $21/年是十倍",
        "七个字母偏长，主体名选短词",
        "便宜后缀要靠内容质量建立信任",
      ],
    },
    en: {
      title: ".website Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".website spells out exactly what it is — for personal pages and portfolios, small-business sites, landing pages and one-off event sites. See live pricing and naming advice, then hunt available .website names with AI.",
      intro:
        ".website is the most literal suffix there is: name.website reads out as \"so-and-so's website\" — personal pages and portfolios, small-business sites, product landing pages and one-off event sites get zero explanation cost. It's a sibling of .site (both run by Radix); the difference is register — site is shorter but abstract, website is two syllables longer yet a complete word that non-technical audiences parse instantly, so consumer-facing small businesses read safer here. About $2 to register (one of the cheapest first years on this site) and $21/yr to renew — a 10x jump, so it's nearly free to validate an idea but a real line item to hold. Inventory is excellent: first names, shop names and category words all hit. Three cautions: seven letters is on the long side, so keep the front word short or the whole domain drags; cheap suffixes historically attract spam, so a new site must earn trust fast with real content and HTTPS; and it's a descriptor, not an industry word — it gives no vertical signal, so positioning rides entirely on the name and hero copy. Naming: first name or brand + .website is the natural \"my website\" pattern; local shops go shop name + .website; event sites are cheap enough to use and retire as event name + .website.",
      bestFor: ["Personal pages & portfolios", "Small-business sites", "Product landing pages", "One-off event sites"],
      namingTips: [
        "Name + .website reads as \"so-and-so's website\"",
        "About $2 to register, $21/yr to renew — 10x jump",
        "Seven letters — keep the front word short",
        "Cheap suffixes must earn trust with real content",
      ],
    },
  },
  technology: {
    tld: "technology",
    zh: {
      title: ".technology 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".technology 把「技术」完整拼出来，适合科技公司官网、技术团队博客、深科技与硬科技品牌。查看 .technology 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .technology 域名。",
      intro:
        ".technology 把技术两个字完整拼出来：科技公司官网、技术团队博客、深科技与硬科技品牌、研究机构用 name.technology，域名本身就是一句正式的自我介绍。它与 .tech 的分工在语气——tech 短促、创业感强，technology 是完整单词，读起来更正式稳重，做企业官网、面向政企客户的技术公司用后者气质更合。英文里公司全名带 Technology 的（XX Technology Co.）用 brand.technology 等于把注册名直接搬上域名，比 .com 上加 tech 词缀更体面。Identity Digital 运营，注册约 $10（约 ¥70），续费约 $23/年（约 ¥167），温和档，比 .tech 的续费便宜不少。库存极好：品牌词、技术品类词命中率都高。注意三点：一是十个字母是全站最长档之一，主体名必须够短，两三个音节封顶；二是正式感是双刃剑，轻快的消费级产品用它反而显得笨重，那种场景 .tech/.app 更合适；三是长域名在名片与口头传播时成本高，配套短域名跳转是常见做法。命名上「品牌 + .technology」最自然（等于公司全名），深科技公司用「领域词 + .technology」（quantum、bio 类）一眼点题，研究团队用「实验室名 + .technology」正式得体。",
      bestFor: ["科技公司官网", "技术团队博客", "深科技与硬科技品牌", "研究机构与实验室"],
      namingTips: [
        "「品牌 + .technology」等于公司注册全名",
        "注册约 $10、续费约 $23/年，比 .tech 续费便宜",
        "十个字母超长，主体名两三个音节封顶",
        "正式稳重，轻快消费级产品选 .tech 更合",
      ],
    },
    en: {
      title: ".technology Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".technology spells the word out in full — for tech company sites, engineering blogs, deep-tech and hard-tech brands. See live pricing and naming advice, then hunt available .technology names with AI.",
      intro:
        ".technology spells the whole word out: tech company sites, engineering team blogs, deep-tech and hard-tech brands, research institutes on name.technology carry a formal self-introduction in the address itself. The split with .tech is tone — tech is clipped and startup-flavored, technology is the complete word and reads statelier, so corporate sites and firms selling to enterprise or government fit better here. Companies whose registered name ends in Technology (XX Technology Co.) can put the full name straight into brand.technology — more dignified than bolting tech onto a .com. Operated by Identity Digital, about $10 to register and $23/yr to renew — the mild tier, and notably cheaper to renew than .tech. Inventory is excellent: brand words and technical category words all hit. Three cautions: ten letters is one of the longest suffixes on this site, so the front word must stay short — two or three syllables at most; formality cuts both ways — a playful consumer product looks heavy here, where .tech or .app fits better; and long domains cost more on business cards and in conversation, so a short redirect domain is common practice. Naming: brand + .technology is the natural pattern (it equals the registered name); deep-tech firms nail it as field + .technology (quantum, bio); research groups stay proper as lab name + .technology.",
      bestFor: ["Tech company sites", "Engineering team blogs", "Deep-tech & hard-tech brands", "Research institutes & labs"],
      namingTips: [
        "Brand + .technology equals the registered name",
        "About $10 to register, $23/yr — cheaper renewal than .tech",
        "Ten letters — keep the front word to 2-3 syllables",
        "Formal register; playful products fit .tech better",
      ],
    },
  },
  community: {
    tld: "community",
    zh: {
      title: ".community 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".community 把「社区」写进域名，适合兴趣社群与论坛、开源项目社区、本地社区组织与会员制社群。查看 .community 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .community 域名。",
      intro:
        ".community 把社区写进域名：兴趣社群与论坛、开源项目的用户社区、本地社区组织、会员制社群用 name.community，访客点开之前就知道「这里是一群人的地方」。它的经典用法是给品牌或项目开专属社区站——主站放官网，brand.community 放论坛与用户讨论区，职责分明（不少开源项目与 SaaS 都是这个套路），比在主域名下挂 /forum 路径更有「独立家园」感。Identity Digital 运营，注册约 $8（约 ¥59），续费约 $37/年（约 ¥263），续费中偏上档。库存极好：兴趣词、城市词、项目名命中率都高。注意三点：一是九个字母偏长，主体名选短词，读起来才不拖沓；二是「社区」是承诺不是装饰，挂这个后缀就要有真实的成员互动，空壳社区比没有更伤品牌；三是本地组织用「地名 + .community」在英文里就是通顺短语（riverside.community 语感），本地搜索红利实打实。命名上「品牌/项目 + .community」最自然（官方社区标准写法），兴趣社群用「主题词 + .community」，本地组织用「地名 + .community」一眼点题。",
      bestFor: ["兴趣社群与论坛", "开源项目用户社区", "本地社区组织", "会员制社群"],
      namingTips: [
        "「品牌 + .community」是官方社区标准写法",
        "注册约 $8、续费约 $37/年，续费中偏上",
        "九个字母偏长，主体名选短词",
        "社区是承诺，空壳社区比没有更伤品牌",
      ],
    },
    en: {
      title: ".community Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".community writes belonging into the address — for interest groups and forums, open-source project communities, local organizations and membership clubs. See live pricing and naming advice, then hunt available .community names with AI.",
      intro:
        ".community writes belonging into the address: interest groups and forums, open-source user communities, local neighborhood organizations, membership clubs on name.community tell visitors \"this is a place for people\" before the click. The classic play is the dedicated community site: keep the main site on the brand domain and put the forum on brand.community — a clean division many open-source projects and SaaS companies use, and it feels more like a home of its own than a /forum path. Operated by Identity Digital, about $8 to register and $37/yr to renew — an upper-mid renewal tier. Inventory is excellent: hobby words, place names and project names all hit. Three cautions: nine letters is on the long side, so keep the front word short for rhythm; community is a promise, not decoration — the suffix demands real member activity, and a ghost-town community hurts the brand more than none at all; and place + .community is a natural English phrase (the riverside.community cadence), a real local-search dividend. Naming: brand or project + .community is the official-community standard; interest groups go topic + .community; local organizations nail it as place + .community.",
      bestFor: ["Interest groups & forums", "Open-source user communities", "Local neighborhood organizations", "Membership clubs"],
      namingTips: [
        "Brand + .community is the official-community standard",
        "About $8 to register, $37/yr to renew",
        "Nine letters — keep the front word short",
        "Community is a promise — ghost towns hurt the brand",
      ],
    },
  },
  education: {
    tld: "education",
    zh: {
      title: ".education 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".education 把「教育」写进域名，适合培训机构与在线课程、教育科技产品、学校项目与教育内容站。查看 .education 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .education 域名。",
      intro:
        ".education 把教育写进域名：培训机构与在线课程平台、教育科技（EdTech）产品、学校的对外项目、教育内容与家长资讯站用 name.education，域名一眼就是「做教育的」。它最大的价值是解决 .edu 的门槛——.edu 只对美国认证高等教育机构开放，普通机构拿不到，而 .education 任何人可注册，是「教育感」域名里最正式的平替。与 .academy/.school 的分工：academy 偏机构与品牌名，school 偏具体学校，education 是行业大词，做平台、做媒体、做 EdTech 用它格局更大。Identity Digital 运营，注册约 $21（约 ¥152），续费约 $28/年（约 ¥204）——注册续费接近同价，没有低价钩子也没有续费陷阱，成本透明。库存极好：品类词、地区词、理念词命中率都高。注意三点：一是九个字母偏长，主体名选短词；二是它不是资质，办学许可、课程认证照样要在页面讲清，别让后缀替你背书；三是教育是强信任行业，域名之外，师资展示与学员评价才是转化关键。命名上「品类 + .education」最自然（stem、music 类一眼懂），机构用「品牌 + .education」，地区服务用「城市 + .education」接住本地搜索。",
      bestFor: ["培训机构与在线课程", "教育科技（EdTech）产品", "学校对外项目", "教育内容与家长资讯站"],
      namingTips: [
        "「品类 + .education」一眼点题（stem、music 类）",
        "注册约 $21、续费约 $28/年，成本透明",
        "拿不到 .edu 时它是最正式的平替",
        "后缀不是资质，办学许可照样要展示",
      ],
    },
    en: {
      title: ".education Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".education writes learning into the address — for training providers and online courses, EdTech products, school programs and education media. See live pricing and naming advice, then hunt available .education names with AI.",
      intro:
        ".education writes learning into the address: training providers and online course platforms, EdTech products, schools' outreach programs, education media and parent resources on name.education are instantly \"in education\". Its biggest value is solving the .edu problem — .edu is restricted to accredited US higher-education institutions, while .education is open to everyone: the most formal substitute in the education-flavored family. The split with .academy and .school: academy leans institution and brand names, school leans actual schools, education is the industry word — platforms, media and EdTech carry more scale here. Operated by Identity Digital, about $21 to register and $28/yr to renew — nearly the same both ways: no cheap hook, no renewal trap, transparent cost. Inventory is excellent: subject words, place names and philosophy words all hit. Three cautions: nine letters is on the long side, so keep the front word short; the suffix is not a credential — licenses and accreditations still belong on the page, don't let the TLD vouch for you; and education is a high-trust business — beyond the domain, teacher credentials and student reviews drive conversion. Naming: subject + .education is the natural pattern (stem, music read instantly); institutions go brand + .education; local services catch nearby search as city + .education.",
      bestFor: ["Training providers & online courses", "EdTech products", "School outreach programs", "Education media & parent resources"],
      namingTips: [
        "Subject + .education reads instantly (stem, music)",
        "About $21 to register, $28/yr — transparent cost",
        "The most formal substitute when .edu is out of reach",
        "Not a credential — show licenses & accreditation",
      ],
    },
  },
  training: {
    tld: "training",
    zh: {
      title: ".training 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".training 把「培训」写进域名，适合职业技能培训、企业内训服务、健身与体能训练、认证课程站。查看 .training 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .training 域名。",
      intro:
        ".training 把培训写进域名：职业技能培训机构、企业内训与团队赋能服务、健身与体能训练、认证备考课程用 name.training，访客点开之前就知道「这里教真本事」。它与 .education 的分工在动手感——education 是行业大词、偏体系与理念，training 是动词性的「练」，强调实操、见效、拿证，职业培训与健身教练用它更点题。英文里「对象 + training」本来就是通顺短语（dog training、strength training），这类组合放进域名读起来零违和，语义 SEO 红利实打实。Identity Digital 运营，注册约 $12（约 ¥85），续费约 $33/年（约 ¥241），中档。库存极好：技能词、品类词、认证名命中率都高。注意三点：一是八个字母不算短，主体名选短词更利落；二是培训承诺效果，页面要有课程大纲、学员案例与结果数据，光喊口号转化不动；三是健身与职业培训都是本地强需求，「城市 + 技能 + .training」能同时接住两层搜索意图。命名上「技能/品类 + .training」最自然（读出来就是通顺短语），机构用「品牌 + .training」，企业服务用「领域 + .training」一眼点题。",
      bestFor: ["职业技能培训机构", "企业内训与团队赋能", "健身与体能训练", "认证备考课程"],
      namingTips: [
        "「技能 + .training」读出来就是通顺短语",
        "注册约 $12、续费约 $33/年，中档",
        "偏实操与拿证，体系化教育选 .education",
        "页面要有大纲与学员结果，光喊口号不行",
      ],
    },
    en: {
      title: ".training Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".training writes practice into the address — for vocational skills training, corporate training services, fitness coaching and certification prep. See live pricing and naming advice, then hunt available .training names with AI.",
      intro:
        ".training writes practice into the address: vocational skills providers, corporate training and team-enablement services, fitness and strength coaching, certification prep courses on name.training tell visitors \"real skills taught here\" before the click. The split with .education is hands-on-ness — education is the industry word, leaning systems and philosophy; training is the verb-flavored \"drill\", stressing practice, results and certificates, so vocational providers and fitness coaches read truer here. Target + training is already a natural English phrase (dog training, strength training), so those combinations read friction-free in a domain — a real semantic-SEO dividend. Operated by Identity Digital, about $12 to register and $33/yr to renew — the mid tier. Inventory is excellent: skill words, category words and certification names all hit. Three cautions: eight letters isn't short, so keep the front word tight; training promises outcomes — the page needs syllabi, student results and data, slogans alone won't convert; and both fitness and vocational training are strongly local, so city + skill + .training catches both layers of search intent. Naming: skill or category + .training is the natural phrase; institutions go brand + .training; corporate services nail it as field + .training.",
      bestFor: ["Vocational skills providers", "Corporate training & enablement", "Fitness & strength coaching", "Certification prep courses"],
      namingTips: [
        "Skill + .training reads as a natural phrase",
        "About $12 to register, $33/yr to renew",
        "Practice & certificates; systems fit .education",
        "Show syllabi and student results — slogans don't convert",
      ],
    },
  },
  love: {
    tld: "love",
    zh: {
      title: ".love 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".love 把「爱」写进域名，适合婚礼与求婚站、情侣纪念页、公益与粉丝应援、宠物与兴趣「热爱」品牌。查看 .love 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .love 域名。",
      intro:
        ".love 把爱写进域名：婚礼与求婚站、情侣纪念页、公益与慈善项目、粉丝应援站、宠物与兴趣向的「热爱」品牌用 name.love，域名自带情感温度——这是极少数「读出来就有情绪」的后缀。它的两个经典语法：一是「名字 + .love」（emma.love 的语感，婚礼站标准写法），二是「我爱的东西 + .love」（coffee.love、cats.love），后者让品类词直接变成情感宣言，情感营销的先天素材。注册约 $9（约 ¥63），续费约 $23/年（约 ¥167），温和档。库存极好：人名、品类词、城市词命中率都高。注意三点：一是情感浓度高是双刃剑，严肃 B2B、金融、法务用它明显违和，那是 .com/.pro 的地盘；二是婚礼与纪念站有「保质期」，档期过后记得续期或做成永久纪念页，别让 .love 域名过期落到别人手里；三是四个字母短而好记，但全球通用的是英文 love，纯中文受众场景要确认用户能拼对。命名上「两人名字 + .love」最自然（婚礼站经典），品牌用「品类 + .love」把热爱摆足，公益项目用「主题 + .love」传播零成本。",
      bestFor: ["婚礼与求婚站", "情侣与家庭纪念页", "公益与粉丝应援", "宠物与兴趣「热爱」品牌"],
      namingTips: [
        "「两人名字 + .love」是婚礼站经典写法",
        "注册约 $9、续费约 $23/年，温和档",
        "「品类 + .love」直接变成情感宣言",
        "严肃 B2B 与金融违和，别硬凑",
      ],
    },
    en: {
      title: ".love Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".love writes the feeling into the address — for wedding and proposal sites, couple pages, charities and fan projects, and passion brands. See live pricing and naming advice, then hunt available .love names with AI.",
      intro:
        ".love writes the feeling into the address: wedding and proposal sites, couple and family pages, charities and fan projects, pet and hobby \"passion\" brands on name.love carry warmth in the domain itself — one of the very few suffixes that lands an emotion on first read. Two classic grammars: name + .love (the emma.love cadence, the wedding-site standard), and thing-I-love + .love (coffee.love, cats.love), which turns a plain category word into a declaration — born material for emotional marketing. About $9 to register and $23/yr to renew — the mild tier. Inventory is excellent: first names, category words and city names all hit. Three cautions: high emotional voltage cuts both ways — sober B2B, finance and legal read plainly wrong here, that's .com and .pro turf; wedding and tribute sites have a shelf life — renew or convert to a permanent keepsake page after the big day, and never let a .love domain lapse into a stranger's hands; and while four letters are short and memorable, love is the English word — check your audience can spell it if they aren't English-first. Naming: couple's names + .love is the wedding classic; brands strike the pose as category + .love; charities spread at zero cost as cause + .love.",
      bestFor: ["Wedding & proposal sites", "Couple & family pages", "Charities & fan projects", "Pet & hobby passion brands"],
      namingTips: [
        "Couple's names + .love is the wedding classic",
        "About $9 to register, $23/yr to renew",
        "Category + .love reads as a declaration",
        "Wrong register for sober B2B and finance",
      ],
    },
  },
  beauty: {
    tld: "beauty",
    zh: {
      title: ".beauty 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".beauty 把「美」写进域名，适合美妆品牌与电商、美容院与皮肤管理、美妆博主与教程站、造型工作室。查看 .beauty 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .beauty 域名。",
      intro:
        ".beauty 把美写进域名：美妆品牌与电商、美容院与皮肤管理工作室、美妆博主与教程站、造型与美甲工作室用 name.beauty，行业定位一眼即明——这是「行业词后缀」里指向最清晰的一批。XYZ 注册局运营（旗下还有 .hair、.skin、.makeup 一整套美妆系后缀），大牌背书已有先例：欧莱雅集团就注册过多个 .beauty 域名做品牌活动站。注册约 $2（约 ¥11），续费约 $13/年（约 ¥94）——首年近乎白送，续费也只是温和档，美妆系后缀里性价比最高的一个。库存极好：品牌词、品类词、人名命中率都高。注意三点：一是六个字母不算短，主体名选短词，域名整体才轻盈；二是「beauty」指向美妆美容行业，跨界品牌（如美食、摄影里的「美」）用它需要首屏立刻讲清定位；三是美妆是视觉行业，域名只是入口，站内视觉质感与产品图才是转化关键。命名上「品牌 + .beauty」最自然（等于品牌宣言），本地店用「店名/城市 + .beauty」接住本地搜索，博主用「昵称 + .beauty」个人品牌感十足。",
      bestFor: ["美妆品牌与电商", "美容院与皮肤管理", "美妆博主与教程站", "造型与美甲工作室"],
      namingTips: [
        "「品牌 + .beauty」等于一句品牌宣言",
        "注册约 $2、续费约 $13/年，美妆系性价比最高",
        "六个字母不算短，主体名选短词",
        "跨界用法需要首屏立刻讲清定位",
      ],
    },
    en: {
      title: ".beauty Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".beauty writes the industry into the address — for beauty brands and e-commerce, salons and skincare studios, beauty creators and styling studios. See live pricing and naming advice, then hunt available .beauty names with AI.",
      intro:
        ".beauty writes the industry into the address: beauty brands and e-commerce, salons and skincare studios, beauty creators and tutorial sites, styling and nail studios on name.beauty declare their vertical at first glance — among the clearest industry-word suffixes there are. Operated by XYZ Registry (whose stable also holds .hair, .skin and .makeup — a full beauty family), it already has big-brand precedent: L'Oréal has registered multiple .beauty domains for brand campaigns. About $2 to register and $13/yr to renew — a nearly-free first year and a mild renewal, the best value in the beauty family. Inventory is excellent: brand words, category words and first names all hit. Three cautions: six letters isn't short, so keep the front word compact for a light overall domain; beauty points squarely at the cosmetics-and-care vertical, so crossover uses (beauty in food or photography) must clarify positioning in the hero; and beauty is a visual business — the domain is only the door, on-site imagery and product shots drive conversion. Naming: brand + .beauty is the natural manifesto; local shops catch nearby search as shop or city + .beauty; creators go handle + .beauty for instant personal branding.",
      bestFor: ["Beauty brands & e-commerce", "Salons & skincare studios", "Beauty creators & tutorial sites", "Styling & nail studios"],
      namingTips: [
        "Brand + .beauty reads as a manifesto",
        "About $2 to register, $13/yr — best value in the family",
        "Six letters — keep the front word compact",
        "Crossover uses must clarify positioning fast",
      ],
    },
  },
  fashion: {
    tld: "fashion",
    zh: {
      title: ".fashion 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".fashion 把「时尚」写进域名，适合服装品牌与买手店、独立设计师、时尚电商与穿搭博主。查看 .fashion 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .fashion 域名。",
      intro:
        ".fashion 把时尚写进域名：服装品牌与买手店、独立设计师工作室、时尚电商与租赁平台、穿搭博主与造型师用 name.fashion，后缀本身就是行业宣言。它与 .style 的分工在范围——style 泛指风格（家居、生活方式都能用），fashion 专指时装行业，做服装的用 fashion 指向更准。GoDaddy Registry 运营，注册约 $26（约 ¥189），续费约 $26/年（约 ¥189）——注册续费同价，没有低价钩子也没有续费陷阱，预算可以一眼算到底。库存极好：品牌词、风格词、人名命中率都高。注意三点：一是七个字母偏长，主体名务必短，走秀名牌式的简洁才配时尚气质；二是价格从第一年就是全价，试错成本比 $2 档后缀高，适合认真做的品牌而非随手占名；三是时尚行业视觉即正义，域名之外，首屏大图与品牌摄影才是气场来源。命名上「品牌 + .fashion」最自然（设计师品牌标准写法），买手店用「店名 + .fashion」，博主用「昵称 + .fashion」一眼点题。",
      bestFor: ["服装品牌与买手店", "独立设计师工作室", "时尚电商与租赁平台", "穿搭博主与造型师"],
      namingTips: [
        "「品牌 + .fashion」是设计师品牌标准写法",
        "注册续费同价约 $26/年，预算一眼算到底",
        "七个字母偏长，主体名务必短",
        "首年即全价，适合认真做的品牌",
      ],
    },
    en: {
      title: ".fashion Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".fashion writes the runway into the address — for clothing brands and boutiques, independent designers, fashion e-commerce and style creators. See live pricing and naming advice, then hunt available .fashion names with AI.",
      intro:
        ".fashion writes the runway into the address: clothing brands and boutiques, independent designer studios, fashion e-commerce and rental platforms, outfit creators and stylists on name.fashion carry the industry declaration in the suffix itself. The split with .style is scope — style is generic (interiors and lifestyle qualify), fashion means the apparel industry, so clothing businesses aim truer here. Operated by GoDaddy Registry, about $26 to register and $26/yr to renew — the same both ways: no cheap hook, no renewal trap, a budget you can read at a glance. Inventory is excellent: brand words, style words and first names all hit. Three cautions: seven letters is on the long side, so the front word must stay short — runway-label brevity suits the register; full price from year one means a higher cost of experimentation than the $2-tier suffixes, so it fits serious brands rather than casual name-grabs; and fashion is a looks-first business — beyond the domain, hero photography and brand imagery carry the presence. Naming: brand + .fashion is the designer-label standard; boutiques go shop name + .fashion; creators nail it as handle + .fashion.",
      bestFor: ["Clothing brands & boutiques", "Independent designer studios", "Fashion e-commerce & rental platforms", "Outfit creators & stylists"],
      namingTips: [
        "Brand + .fashion is the designer-label standard",
        "About $26 both ways — budget reads at a glance",
        "Seven letters — the front word must stay short",
        "Full price from year one — for serious brands",
      ],
    },
  },
  work: {
    tld: "work",
    zh: {
      title: ".work 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".work 把「工作」写进域名，适合招聘与求职站、自由职业者作品集、远程办公工具、职业服务与劳务平台。查看 .work 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .work 域名。",
      intro:
        ".work 把工作写进域名：招聘与求职站、自由职业者作品集、远程办公与协作工具、职业培训与劳务服务用 name.work，四个字母把「干活」两个字说得干脆利落。英文里「对象 + work」本来就是通顺组合（remote.work、find.work 的语感），动词名词两读，域名读出来就是行动号召。它与 .works 一字之差但分工不同：works 偏「作品集/工程」（studio works），work 偏「工作/职业」本身，招聘与职业服务用单数更点题。GoDaddy Registry 运营，注册约 $2（约 ¥15），续费约 $11/年（约 ¥78）——首年白菜价，续费也是全站最便宜档之一，长期持有毫无压力。库存极好：动词、职业词、平台名命中率都高。注意三点：一是超低价后缀历史上垃圾站比例高，新站要靠真实内容与 HTTPS 快速建立信任；二是「work」语义宽，招聘、工具、劳务都能用，定位要靠主体名收窄；三是四个字母虽短，认知度仍不如 .com，面向大众的正式业务建议同时持有主流后缀。命名上「动词 + .work」最自然（find.work 式行动号召），自由职业者用「人名 + .work」，工具类用「场景 + .work」一眼点题。",
      bestFor: ["招聘与求职站", "自由职业者作品集", "远程办公与协作工具", "职业培训与劳务服务"],
      namingTips: [
        "「动词 + .work」读出来就是行动号召",
        "注册约 $2、续费约 $11/年，全站最便宜档之一",
        "与 .works 分工：单数偏职业，复数偏作品",
        "超低价后缀要靠真实内容建立信任",
      ],
    },
    en: {
      title: ".work Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".work writes the job into the address — for hiring and job boards, freelancer portfolios, remote-work tools and professional services. See live pricing and naming advice, then hunt available .work names with AI.",
      intro:
        ".work writes the job into the address: hiring and job boards, freelancer portfolios, remote-work and collaboration tools, vocational training and staffing services on name.work say \"getting things done\" in four crisp letters. English already pairs it naturally (the remote.work, find.work cadence) — verb or noun, the domain reads out as a call to action. One letter from .works but a different job: works leans portfolio and engineering (studio works), work means employment itself, so hiring and career services aim truer with the singular. Operated by GoDaddy Registry, about $2 to register and $11/yr to renew — a bargain first year and one of the cheapest renewals on this site, painless to hold long-term. Inventory is excellent: verbs, occupation words and platform names all hit. Three cautions: ultra-cheap suffixes historically attract spam, so a new site must earn trust fast with real content and HTTPS; work is semantically broad — hiring, tools and staffing all qualify — so the front word must narrow the positioning; and four letters are short, but recognition still trails .com, so consumer-facing formal businesses should hold a mainstream suffix too. Naming: verb + .work is the natural call to action (the find.work pattern); freelancers go name + .work; tools nail it as scenario + .work.",
      bestFor: ["Hiring & job boards", "Freelancer portfolios", "Remote-work & collaboration tools", "Vocational training & staffing"],
      namingTips: [
        "Verb + .work reads as a call to action",
        "About $2 to register, $11/yr — among the cheapest",
        "Singular means employment; .works means portfolio",
        "Ultra-cheap suffixes must earn trust fast",
      ],
    },
  },
  sale: {
    tld: "sale",
    zh: {
      title: ".sale 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".sale 把「促销」写进域名，适合促销活动站、折扣电商与清仓频道、二手转卖平台、房产车辆出售页。查看 .sale 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .sale 域名。",
      intro:
        ".sale 把促销写进域名：品牌促销活动站、折扣电商与清仓频道、二手转卖平台、房产车辆出售页用 name.sale，域名本身就在喊「特价」。英文里「on sale」「for sale」是妇孺皆知的短语，brand.sale 读出来就是「某某在打折」，营销活动的先天素材——大促季给主站配一个 brand.sale 短域名做活动落地页，比长长的 /promotions 路径好记好投放。Identity Digital 运营，注册约 $4（约 ¥26），续费约 $31/年（约 ¥226）——首年便宜续费中偏上，短期活动用一季即弃毫无压力，长期持有要算清账。库存极好：品牌词、品类词、动词命中率都高。注意三点：一是「sale」自带紧迫感，常年挂着反而稀释促销力度，最适合有明确档期的活动；二是折扣语境与高端定位相冲，奢侈品牌慎用；三是二手与房产场景里「for sale」语义更顺（house.sale 式），面向英文用户零解释成本。命名上「品牌 + .sale」最自然（活动站标准写法），品类站用「品类 + .sale」，出售页用「资产 + .sale」一眼点题。",
      bestFor: ["品牌促销活动站", "折扣电商与清仓频道", "二手转卖平台", "房产车辆出售页"],
      namingTips: [
        "「品牌 + .sale」是大促活动站标准写法",
        "注册约 $4、续费约 $31/年，短期活动零压力",
        "自带紧迫感，最适合有明确档期的活动",
        "折扣语境与高端定位相冲，奢侈品牌慎用",
      ],
    },
    en: {
      title: ".sale Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".sale writes the discount into the address — for promo campaign sites, outlet e-commerce, resale platforms and for-sale listing pages. See live pricing and naming advice, then hunt available .sale names with AI.",
      intro:
        ".sale writes the discount into the address: brand promo campaign sites, outlet e-commerce and clearance channels, resale platforms, property and vehicle listing pages on name.sale shout \"deal\" in the domain itself. English knows on sale and for sale by heart, so brand.sale reads out as \"so-and-so is discounting\" — born campaign material: pairing the main site with a brand.sale landing page each promo season beats a long /promotions path for recall and ad copy. Operated by Identity Digital, about $4 to register and $31/yr to renew — cheap to start, upper-mid to keep, so a one-season campaign domain is painless while long-term holding needs the math. Inventory is excellent: brand words, category words and verbs all hit. Three cautions: sale carries built-in urgency, and flying it year-round dilutes the punch — it fits campaigns with real dates; discount framing clashes with premium positioning, so luxury brands should think twice; and in resale and property contexts the for-sale reading is seamless (the house.sale pattern) — zero explanation cost for English audiences. Naming: brand + .sale is the campaign-site standard; category stores go category + .sale; listings nail it as asset + .sale.",
      bestFor: ["Brand promo campaign sites", "Outlet e-commerce & clearance", "Resale platforms", "Property & vehicle listings"],
      namingTips: [
        "Brand + .sale is the campaign-site standard",
        "About $4 to register, $31/yr — painless for one season",
        "Built-in urgency — fits campaigns with real dates",
        "Discount framing clashes with luxury positioning",
      ],
    },
  },
  help: {
    tld: "help",
    zh: {
      title: ".help 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".help 把「帮助」写进域名，适合产品帮助中心与文档站、客服与支持入口、公益求助与互助平台、工具教程站。查看 .help 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .help 域名。",
      intro:
        ".help 把帮助写进域名：产品帮助中心与文档站、客服与支持入口、公益求助与互助平台、工具教程站用 name.help，用户还没点开就知道「这里能找到答案」。它的经典用法是给品牌配独立帮助域——主站放官网，brand.help 放帮助中心与工单入口，比 support.brand.com 三级域名更短更好记，紧急时用户凭直觉就能拼出来。Internet Naming Co.（原 UNR）运营，注册约 $2（约 ¥11），续费约 $26/年（约 ¥189）——首年近乎白送，续费中档，给现有产品加个帮助域的决策成本极低。库存极好：品牌词、动词、场景词命中率都高。注意三点：一是首年与续费差十倍以上，占名前想清楚是长期资产还是一次性试验；二是「help」承诺即时可用，挂这个域名的页面必须真能解决问题，空转的帮助中心比没有更伤信任；三是公益求助场景里它是天然短语（refugees.help 式），传播零成本但也要防滥用带来的信任折损。命名上「品牌 + .help」最自然（帮助中心标准写法），工具站用「场景 + .help」，公益项目用「对象 + .help」一眼点题。",
      bestFor: ["产品帮助中心与文档站", "客服与支持入口", "公益求助与互助平台", "工具教程站"],
      namingTips: [
        "「品牌 + .help」比三级域名更短更好记",
        "注册约 $2、续费约 $26/年，差价十倍要想清",
        "挂 .help 的页面必须真能解决问题",
        "公益场景是天然短语，传播零成本",
      ],
    },
    en: {
      title: ".help Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".help writes the answer into the address — for product help centers and docs, support entry points, mutual-aid platforms and tutorial sites. See live pricing and naming advice, then hunt available .help names with AI.",
      intro:
        ".help writes the answer into the address: product help centers and docs, customer support entry points, charity and mutual-aid platforms, tool tutorial sites on name.help promise \"answers live here\" before the click. The classic play is the dedicated help domain: keep the main site on the brand domain and put the help center and ticket entry on brand.help — shorter and more memorable than a support.brand.com subdomain, and users can guess it by instinct in a pinch. Operated by Internet Naming Co. (formerly UNR), about $2 to register and $26/yr to renew — a nearly-free first year and a mid-tier renewal, so adding a help domain to an existing product is a low-stakes call. Inventory is excellent: brand words, verbs and scenario words all hit. Three cautions: the 10x-plus gap between first year and renewal means deciding upfront whether this is a long-term asset or a one-off experiment; help promises immediate usefulness — a page on this suffix must actually solve problems, and a hollow help center hurts trust more than none; and in charity contexts it's a natural phrase (the refugees.help pattern) — zero-cost to spread, but watch for the trust erosion abuse brings. Naming: brand + .help is the help-center standard; tools go scenario + .help; charities nail it as cause + .help.",
      bestFor: ["Product help centers & docs", "Customer support entry points", "Charity & mutual-aid platforms", "Tool tutorial sites"],
      namingTips: [
        "Brand + .help beats a support.* subdomain",
        "About $2 to register, $26/yr — a 10x gap to plan for",
        "A .help page must actually solve problems",
        "Natural phrase for charity causes — zero-cost spread",
      ],
    },
  },
  wedding: {
    tld: "wedding",
    zh: {
      title: ".wedding 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".wedding 把「婚礼」写进域名，适合婚礼请柬与纪念站、婚庆策划与场地、婚纱摄影与礼服、婚礼跟拍团队。查看 .wedding 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .wedding 域名。",
      intro:
        ".wedding 把婚礼写进域名：新人的电子请柬与纪念站、婚庆策划公司与场地、婚纱摄影与礼服租售、婚礼跟拍与主持团队用 name.wedding，后缀一出场就自带喜气。它与 .love 的分工在场景——love 是情感大词（求婚、纪念、公益都能用），wedding 专指婚礼这件事，婚庆行业与新人请柬用它更点题：names.wedding 读出来就是「某某的婚礼」，请柬域名的天花板写法。GoDaddy Registry 运营，注册约 $26（约 ¥189），续费约 $26/年（约 ¥189）——注册续费同价，成本透明。库存极好：新人姓名组合、公司名、城市词命中率都高。注意三点：一是七个字母偏长，两人姓名组合要选短的拼法，域名整体才轻盈；二是新人纪念站有「档期」，婚礼过后要么续费做成永久纪念页，要么果断放手，别让带着两人名字的域名过期流入市场；三是婚庆是本地强需求行业，「城市 + .wedding」能接住本地搜索红利。命名上「两人名字 + .wedding」最自然（请柬标准写法），婚庆公司用「品牌 + .wedding」，场地与服务用「城市/场景 + .wedding」一眼点题。",
      bestFor: ["婚礼请柬与纪念站", "婚庆策划与场地", "婚纱摄影与礼服", "婚礼跟拍与主持团队"],
      namingTips: [
        "「两人名字 + .wedding」是请柬标准写法",
        "注册续费同价约 $26/年，成本透明",
        "七个字母偏长，姓名组合选短拼法",
        "婚礼过后要么做成纪念页要么果断放手",
      ],
    },
    en: {
      title: ".wedding Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".wedding writes the big day into the address — for invitation and keepsake sites, planners and venues, bridal photography and wedding crews. See live pricing and naming advice, then hunt available .wedding names with AI.",
      intro:
        ".wedding writes the big day into the address: couples' digital invitations and keepsake sites, wedding planners and venues, bridal photography and dress studios, videography and MC crews on name.wedding arrive with the celebration built in. The split with .love is scope — love is the broad emotion (proposals, tributes, charities all qualify), wedding means the event itself, so the wedding industry and couples' invitations aim truer here: names.wedding reads out as \"so-and-so's wedding\", the ceiling pattern for invitation domains. Operated by GoDaddy Registry, about $26 to register and $26/yr to renew — the same both ways, transparent cost. Inventory is excellent: couples' name pairs, company names and city words all hit. Three cautions: seven letters is on the long side, so pick the shorter spelling of a name pair to keep the domain light; keepsake sites have a date — after the day, either renew into a permanent keepsake page or let go deliberately, and never let a domain carrying two names lapse onto the open market; and weddings are a fiercely local business, so city + .wedding catches a real local-search dividend. Naming: couple's names + .wedding is the invitation standard; planners go brand + .wedding; venues and services nail it as city or scene + .wedding.",
      bestFor: ["Invitation & keepsake sites", "Wedding planners & venues", "Bridal photography & dress studios", "Videography & MC crews"],
      namingTips: [
        "Couple's names + .wedding is the invitation standard",
        "About $26 both ways — transparent cost",
        "Seven letters — pick the shorter name spelling",
        "After the day: keepsake page or deliberate letting go",
      ],
    },
  },
  law: {
    tld: "law",
    zh: {
      title: ".law 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".law 把「法律」写进域名，适合律师事务所、独立执业律师、法律科技产品、法律咨询与普法内容站。查看 .law 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .law 域名。",
      intro:
        ".law 把法律写进域名：律师事务所、独立执业律师、法律科技产品、法律咨询与普法内容站用 name.law，专业身份从后缀就开始建立——法律行业讲信任，而 smith.law 比一长串 .com 更像一块烫金门牌。它与 .legal 的分工在语感：law 三个字母更短更硬，指「法律」本身，事务所与律师个人品牌用它更利落。GoDaddy Registry 平台运营，注册约 $83（约 ¥598），续费约 $83/年（约 ¥598）——注册续费同价，是本站较贵的后缀之一，但对客单价以万计的法律行业，这个门槛反而筛掉了垃圾站，让 .law 整体域名环境更干净。库存极好：姓氏、城市、执业领域词命中率都高。注意三点：一是价格门槛高，适合已执业的律师与律所而非学生练手；二是法律是强属地行业，「城市 + .law」「领域 + .law」（injury.law 式）能精准接住本地与垂直搜索；三是各法域对律师广告与网站有执业合规要求，上线前按当地律协规范自查。命名上「姓氏 + .law」最自然（smith.law 即「史密斯律所」），律所用「品牌 + .law」，垂直站用「执业领域 + .law」一眼点题。",
      bestFor: ["律师事务所", "独立执业律师", "法律科技产品", "法律咨询与普法内容站"],
      namingTips: [
        "「姓氏 + .law」读出来就是一块门牌",
        "注册续费同价约 $83/年，门槛筛掉垃圾站",
        "「城市/领域 + .law」接住本地与垂直搜索",
        "上线前按当地律协广告规范自查",
      ],
    },
    en: {
      title: ".law Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".law writes the profession into the address — for law firms, solo attorneys, legal-tech products and legal-content sites. See live pricing and naming advice, then hunt available .law names with AI.",
      intro:
        ".law writes the profession into the address: law firms, solo attorneys, legal-tech products and legal-education sites on name.law start building professional trust from the suffix itself — in a business built on credibility, smith.law reads more like a brass nameplate than a long .com ever could. The split with .legal is register: law is three letters, shorter and harder, meaning the law itself, so firms and personal attorney brands land cleaner here. Operated on the GoDaddy Registry platform, about $83 to register and $83/yr to renew — the same both ways, one of the pricier suffixes on this site, but for an industry billing by the hour that threshold filters out spam and keeps the .law namespace clean. Inventory is excellent: surnames, cities and practice-area words all hit. Three cautions: the price fits practicing attorneys and firms, not student experiments; law is fiercely local, so city + .law and practice + .law (the injury.law pattern) catch local and vertical search precisely; and most jurisdictions regulate attorney advertising — check your bar's website rules before launch. Naming: surname + .law is the natural nameplate (smith.law reads as \"Smith Law\"); firms go brand + .law; vertical sites nail it as practice area + .law.",
      bestFor: ["Law firms", "Solo attorneys", "Legal-tech products", "Legal-content & education sites"],
      namingTips: [
        "Surname + .law reads as a nameplate",
        "About $83 both ways — the threshold filters spam",
        "City or practice + .law catches vertical search",
        "Check bar advertising rules before launch",
      ],
    },
  },
  tax: {
    tld: "tax",
    zh: {
      title: ".tax 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".tax 把「税」写进域名，适合税务师与会计事务所、报税软件、税务咨询与筹划、税法内容站。查看 .tax 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .tax 域名。",
      intro:
        ".tax 把税写进域名：税务师与会计事务所、报税软件与工具、税务咨询与筹划服务、税法解读内容站用 name.tax，三个字母把业务说得不能再直白——大牌先例现成：Intuit 的 turbo.tax 就是把 TurboTax 拆进后缀的教科书写法。Identity Digital 运营，注册约 $8（约 ¥59），续费约 $54/年（约 ¥389）——首年便宜续费跳档，预算按续费价算才稳。库存极好：品牌词、地区词、人群词命中率都高。注意三点：一是税务是强合规行业，网站需要执业资质与免责声明背书，域名越专业内容越要专业；二是报税是季节性流量（报税季爆发），「工具/人群 + .tax」的直白命名在旺季搜索里优势明显；三是 tax 在英语里也是动词（tax one's patience），品牌向命名注意歧义。命名上「品牌 + .tax」最自然（turbo.tax 式拆词），事务所用「姓氏/城市 + .tax」，工具用「场景 + .tax」（file.tax 式）读出来就是行动号召。",
      bestFor: ["税务师与会计事务所", "报税软件与工具", "税务咨询与筹划服务", "税法解读内容站"],
      namingTips: [
        "「品牌 + .tax」可复刻 turbo.tax 式拆词",
        "注册约 $8、续费约 $54/年，预算按续费算",
        "「场景 + .tax」读出来就是行动号召",
        "强合规行业，资质与免责声明要跟上",
      ],
    },
    en: {
      title: ".tax Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".tax writes the business into the address — for tax and accounting firms, filing software, tax advisory services and tax-law content sites. See live pricing and naming advice, then hunt available .tax names with AI.",
      intro:
        ".tax writes the business into the address: tax and accounting firms, filing software and tools, advisory and planning services, tax-law explainer sites on name.tax say the trade in three letters — with a marquee precedent ready-made: Intuit's turbo.tax is the textbook split of a brand across the dot. Operated by Identity Digital, about $8 to register and $54/yr to renew — a cheap first year with a renewal jump, so budget on the renewal price. Inventory is excellent: brand words, region words and audience words all hit. Three cautions: tax is a heavily regulated trade, so credentials and disclaimers must back the site — the more professional the domain, the more professional the content must be; filing traffic is seasonal (it spikes at deadline time), and blunt tool + .tax names win those high-intent searches; and tax is also an English verb (taxing one's patience), so brand-led names should watch the double reading. Naming: brand + .tax is the natural turbo.tax-style split; firms go surname or city + .tax; tools nail it as action + .tax — file.tax reads out as a call to action.",
      bestFor: ["Tax & accounting firms", "Filing software & tools", "Tax advisory & planning services", "Tax-law content sites"],
      namingTips: [
        "Brand + .tax can replay the turbo.tax split",
        "About $8 to register, $54/yr — budget on renewal",
        "Action + .tax reads as a call to action",
        "Regulated trade — credentials and disclaimers required",
      ],
    },
  },
  menu: {
    tld: "menu",
    zh: {
      title: ".menu 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".menu 把「菜单」写进域名，适合餐厅在线菜单、扫码点餐系统、外卖与订餐平台、餐饮品牌官网。查看 .menu 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .menu 域名。",
      intro:
        ".menu 把菜单写进域名：餐厅在线菜单页、扫码点餐系统、外卖与订餐平台、餐饮品牌官网用 name.menu，域名读出来就是「某某家的菜单」——餐饮数字化最顺手的入口。它有个独特的实用玩法：把 .menu 域名印进桌角二维码，顾客扫码直达菜单，比夹在 .com 官网深处的 PDF 体验好一个量级；对比 .cafe/.restaurant 它不绑定业态，正餐、酒吧、奶茶店都能用。Wedding TLD2 注册局运营（GoDaddy Registry 平台），注册约 $27（约 ¥194），续费约 $27/年（约 ¥194）——注册续费同价，成本透明。库存极好：店名、菜系、城市词命中率都高。注意三点：一是 menu 语义就是「菜单」，适合做菜单/点餐这件事本身，品牌主站还是建议搭配主流后缀；二是四个字母虽短，中文语境认知度一般，面向本地食客的店建议菜单页与大众点评等平台并行；三是菜单是高频更新内容，域名之外要选个改起来不心累的建站方式。命名上「店名 + .menu」最自然（读出来就是「本店菜单」），点餐系统用「品牌 + .menu」，城市美食指南用「城市 + .menu」一眼点题。",
      bestFor: ["餐厅在线菜单", "扫码点餐系统", "外卖与订餐平台", "餐饮品牌官网"],
      namingTips: [
        "「店名 + .menu」读出来就是「本店菜单」",
        "注册续费同价约 $27/年，成本透明",
        "印进桌角二维码，扫码直达菜单",
        "菜单页之外，品牌主站建议搭配主流后缀",
      ],
    },
    en: {
      title: ".menu Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".menu writes the card into the address — for restaurant online menus, QR ordering systems, delivery platforms and restaurant brand sites. See live pricing and naming advice, then hunt available .menu names with AI.",
      intro:
        ".menu writes the card into the address: restaurant menu pages, QR-code ordering systems, delivery and reservation platforms, restaurant brand sites on name.menu read out as \"so-and-so's menu\" — the smoothest doorway into restaurant digitization. It has a uniquely practical play: print the .menu domain into a table-corner QR code and guests scan straight to the menu — an order of magnitude better than a PDF buried in a .com site; and unlike .cafe or .restaurant it binds to no format — fine dining, bars and bubble-tea shops all qualify. Run by the Wedding TLD2 registry on the GoDaddy Registry platform, about $27 to register and $27/yr to renew — the same both ways, transparent cost. Inventory is excellent: shop names, cuisine words and city words all hit. Three cautions: menu means the menu itself, so it suits the menu-and-ordering job — pair a mainstream suffix for the main brand site; four letters are short but general recognition is modest, so local spots should run the menu page alongside Yelp-style platforms; and menus change weekly, so pick a site builder that makes edits painless. Naming: shop name + .menu is the natural read-aloud; ordering systems go brand + .menu; city food guides nail it as city + .menu.",
      bestFor: ["Restaurant online menus", "QR ordering systems", "Delivery & reservation platforms", "Restaurant brand sites"],
      namingTips: [
        "Shop name + .menu reads as \"our menu\"",
        "About $27 both ways — transparent cost",
        "Print it into the table QR code",
        "Pair a mainstream suffix for the main brand site",
      ],
    },
  },
  bike: {
    tld: "bike",
    zh: {
      title: ".bike 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".bike 把「自行车」写进域名，适合自行车品牌与车店、骑行俱乐部与赛事、租车与修车服务、骑行装备电商。查看 .bike 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .bike 域名。",
      intro:
        ".bike 把自行车写进域名：自行车品牌与车店、骑行俱乐部与赛事、共享与租赁服务、修车铺与装备电商用 name.bike，四个字母把行业说得干脆——它还是 2014 年新顶级域开闸的第一批后缀之一，资历老、先例多：Trek 就注册了 trek.bike 给品牌用。Identity Digital 运营，注册约 $8（约 ¥59），续费约 $31/年（约 ¥226）——首年便宜、续费温和，行业词后缀里的性价比档。库存极好：品牌词、城市词、车型词命中率都高。注意三点：一是 bike 也涵盖摩托车（英语里 bike 两义都有），电动车与摩托相关业务同样适用，但页面定位要讲清是哪种「bike」；二是骑行是强社区行业，俱乐部与赛事站用「城市/线路 + .bike」能精准聚拢本地骑友；三是低价后缀认知度有限，品牌向业务建议同时持有主流后缀。命名上「品牌 + .bike」最自然（trek.bike 式），车店用「店名/城市 + .bike」，俱乐部用「地名/线路 + .bike」一眼点题。",
      bestFor: ["自行车品牌与车店", "骑行俱乐部与赛事", "租赁与修车服务", "骑行装备电商"],
      namingTips: [
        "「品牌 + .bike」有 trek.bike 先例",
        "注册约 $8、续费约 $31/年，性价比档",
        "bike 两义（单车/摩托），定位要讲清",
        "「城市/线路 + .bike」聚拢本地骑友",
      ],
    },
    en: {
      title: ".bike Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".bike writes the ride into the address — for bike brands and shops, cycling clubs and races, rental and repair services, gear e-commerce. See live pricing and naming advice, then hunt available .bike names with AI.",
      intro:
        ".bike writes the ride into the address: bicycle brands and shops, cycling clubs and races, sharing and rental services, repair shops and gear e-commerce on name.bike say the trade in four crisp letters — and it was in the very first batch of new gTLDs to launch in 2014, with seniority and precedent to show: Trek registered trek.bike for the brand. Operated by Identity Digital, about $8 to register and $31/yr to renew — a cheap first year and a mild renewal, the value tier among industry-word suffixes. Inventory is excellent: brand words, city words and model words all hit. Three cautions: bike covers motorcycles too (English carries both senses), so e-bike and moto businesses qualify — but the hero must say which bike you mean; cycling is a community-first trade, so clubs and races gather local riders precisely with city or route + .bike; and cheap-suffix recognition is limited, so brand-led businesses should hold a mainstream suffix too. Naming: brand + .bike is the natural trek.bike pattern; shops go shop name or city + .bike; clubs nail it as place or route + .bike.",
      bestFor: ["Bike brands & shops", "Cycling clubs & races", "Rental & repair services", "Cycling gear e-commerce"],
      namingTips: [
        "Brand + .bike has the trek.bike precedent",
        "About $8 to register, $31/yr — the value tier",
        "Bike has two senses — say which one fast",
        "City or route + .bike gathers local riders",
      ],
    },
  },
  toys: {
    tld: "toys",
    zh: {
      title: ".toys 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".toys 把「玩具」写进域名，适合玩具品牌与电商、潮玩与手办店、桌游与积木社区、儿童教育玩具。查看 .toys 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .toys 域名。",
      intro:
        ".toys 把玩具写进域名：玩具品牌与电商、潮玩与手办店、桌游与积木社区、儿童教育玩具站用 name.toys，复数名词天然带「货架感」——读出来就是「某某家的玩具」，大牌先例现成：乐高注册了 lego.toys。它与 .games 的分工在实体感：games 偏游戏（电子游戏与桌游玩法），toys 偏实体玩具与收藏品，卖「摸得着的快乐」用 toys 更准。Identity Digital 运营，注册约 $11（约 ¥78），续费约 $52/年（约 ¥374）——首年便宜续费跳档，预算按续费价算才稳。库存极好：品牌词、品类词、IP 向词命中率都高。注意三点：一是面向儿童的电商与内容受合规约束（隐私与广告规范，如美国 COPPA），站点设计要跟上；二是潮玩与手办的主战场在社交平台与直播，域名的角色是品牌官网与发售日历的稳定入口；三是 toys 语义宽，成人向收藏与儿童玩具受众完全不同，主体名要把定位收窄。命名上「品牌 + .toys」最自然（lego.toys 式），潮玩店用「店名 + .toys」，垂直社区用「品类 + .toys」一眼点题。",
      bestFor: ["玩具品牌与电商", "潮玩与手办店", "桌游与积木社区", "儿童教育玩具站"],
      namingTips: [
        "「品牌 + .toys」有 lego.toys 先例",
        "注册约 $11、续费约 $52/年，预算按续费算",
        "与 .games 分工：toys 偏实体与收藏",
        "儿童向业务注意隐私与广告合规",
      ],
    },
    en: {
      title: ".toys Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".toys writes the shelf into the address — for toy brands and e-commerce, designer-toy and figure shops, board-game communities and educational toys. See live pricing and naming advice, then hunt available .toys names with AI.",
      intro:
        ".toys writes the shelf into the address: toy brands and e-commerce, designer-toy and figure shops, board-game and building-block communities, educational-toy sites on name.toys carry a built-in shelf feel — the plural reads out as \"so-and-so's toys\", with marquee precedent ready-made: LEGO registered lego.toys. The split with .games is physicality — games leans gameplay (video and board), toys means tangible playthings and collectibles, so sellers of touchable joy aim truer here. Operated by Identity Digital, about $11 to register and $52/yr to renew — a cheap first year with a renewal jump, so budget on the renewal price. Inventory is excellent: brand words, category words and IP-adjacent words all hit. Three cautions: child-facing commerce and content carry compliance duties (privacy and ad rules like COPPA), so the site must keep up; designer toys live on social platforms and livestreams, so the domain's role is the stable brand home and drop calendar; and toys is semantically broad — adult collectibles and children's toys are different audiences, so the front word must narrow the aim. Naming: brand + .toys is the natural lego.toys pattern; shops go shop name + .toys; vertical communities nail it as category + .toys.",
      bestFor: ["Toy brands & e-commerce", "Designer-toy & figure shops", "Board-game & block communities", "Educational-toy sites"],
      namingTips: [
        "Brand + .toys has the lego.toys precedent",
        "About $11 to register, $52/yr — budget on renewal",
        "Toys means tangible; .games means gameplay",
        "Child-facing sites carry compliance duties",
      ],
    },
  },
  shoes: {
    tld: "shoes",
    zh: {
      title: ".shoes 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".shoes 把「鞋」写进域名，适合鞋履品牌与电商、球鞋店与鞋圈社区、手工鞋定制、洗鞋修鞋服务。查看 .shoes 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .shoes 域名。",
      intro:
        ".shoes 把鞋写进域名：鞋履品牌与电商、球鞋店与鞋圈社区、手工与定制鞋工作室、洗鞋修鞋服务用 name.shoes，品类从后缀就说清了——大牌先例现成：耐克注册了 nike.shoes。它与 .fashion 的分工在颗粒度：fashion 泛指时装行业，shoes 专指鞋这个品类，垂直做鞋的用 shoes 指向更准，「品牌 + .shoes」读出来就是「某某家的鞋」。Identity Digital 运营，注册约 $21（约 ¥152），续费约 $52/年（约 ¥374）——首年中档、续费跳档，预算按续费价算才稳。库存极好：品牌词、品类词、风格词命中率都高。注意三点：一是球鞋转售与鉴定是强信任生意，域名专业只是第一步，鉴定背书与保障政策才是成交关键；二是鞋类电商的主战场在图片与尺码体验，域名之外落地页体验要跟上；三是五个字母认知度一般，面向大众的品牌主站建议同时持有主流后缀。命名上「品牌 + .shoes」最自然（nike.shoes 式），球鞋店用「店名 + .shoes」，垂直站用「品类/风格 + .shoes」（running.shoes 式）一眼点题。",
      bestFor: ["鞋履品牌与电商", "球鞋店与鞋圈社区", "手工与定制鞋工作室", "洗鞋修鞋服务"],
      namingTips: [
        "「品牌 + .shoes」有 nike.shoes 先例",
        "注册约 $21、续费约 $52/年，预算按续费算",
        "与 .fashion 分工：shoes 专指鞋类垂直",
        "「品类/风格 + .shoes」一眼点题",
      ],
    },
    en: {
      title: ".shoes Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".shoes writes the category into the address — for footwear brands and e-commerce, sneaker shops and communities, custom shoemakers and shoe-care services. See live pricing and naming advice, then hunt available .shoes names with AI.",
      intro:
        ".shoes writes the category into the address: footwear brands and e-commerce, sneaker shops and communities, handmade and custom shoemakers, cleaning and repair services on name.shoes declare the product from the suffix — with marquee precedent ready-made: Nike registered nike.shoes. The split with .fashion is granularity — fashion means the apparel industry at large, shoes means this one category, so footwear-first businesses aim truer here: brand.shoes reads out as \"so-and-so's shoes\". Operated by Identity Digital, about $21 to register and $52/yr to renew — a mid-tier first year with a renewal jump, so budget on the renewal price. Inventory is excellent: brand words, category words and style words all hit. Three cautions: sneaker resale and authentication is a trust-first trade — a professional domain is only step one, authentication backing and guarantees close the sale; footwear e-commerce lives or dies on imagery and sizing UX, so the landing page must keep up; and five letters carry modest recognition, so consumer-facing brand homes should hold a mainstream suffix too. Naming: brand + .shoes is the natural nike.shoes pattern; sneaker shops go shop name + .shoes; vertical sites nail it as category or style + .shoes — the running.shoes pattern.",
      bestFor: ["Footwear brands & e-commerce", "Sneaker shops & communities", "Custom & handmade shoemakers", "Shoe cleaning & repair services"],
      namingTips: [
        "Brand + .shoes has the nike.shoes precedent",
        "About $21 to register, $52/yr — budget on renewal",
        "Shoes is the vertical; .fashion is the industry",
        "Category or style + .shoes nails the aim",
      ],
    },
  },
  travel: {
    tld: "travel",
    zh: {
      title: ".travel 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".travel 是旅游行业的专属老牌后缀，适合旅行社与定制游、旅游攻略与目的地站、酒店民宿预订、签证与出行服务。查看 .travel 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .travel 域名。",
      intro:
        ".travel 是 2005 年就诞生的旅游行业专属后缀，比绝大多数新顶级域早了近十年，行业指向性无可挑剔：旅行社与定制游工作室、旅游攻略与目的地内容站、酒店民宿预订平台、签证与出行服务用 name.travel，用户从后缀就知道你是做旅游的。它的历史还带来一层筛选效应——早年 .travel 仅限旅游行业实名注册，沉淀了不少行业站点，整体信任感比多数新后缀好。现由 Identity Digital 运营，注册约 $16（约 ¥115），续费约 $119/年（约 ¥857）——续费明显偏贵，是六个字母换行业身份的溢价，预算务必按续费价算。库存很好：目的地词、玩法词、品牌词命中率都高。注意三点：一是六个字母偏长，口头传播不如短后缀顺，适合以线上获客为主的业务；二是旅游是强信任消费，域名专业只是起点，资质展示与真实评价才是转化关键；三是面向大众的品牌主站建议同时持有 .com 防流失。命名上「目的地 + .travel」最点题（japan.travel 式官方先例众多），「品牌 + .travel」适合旅行社，「玩法/主题 + .travel」（diving.travel 式）适合垂直内容站。",
      bestFor: ["旅行社与定制游工作室", "旅游攻略与目的地内容站", "酒店民宿预订平台", "签证与出行服务"],
      namingTips: [
        "「目的地 + .travel」有 japan.travel 式官方先例",
        "注册约 $16、续费约 $119/年，预算按续费算",
        "2005 年老牌行业后缀，信任底子好于多数新后缀",
        "「玩法/主题 + .travel」适合垂直内容站",
      ],
    },
    en: {
      title: ".travel Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".travel is the tourism industry's veteran dedicated TLD — for travel agencies and tour operators, destination guides, hotel booking and visa services. See live pricing and naming advice, then hunt available .travel names with AI.",
      intro:
        ".travel launched back in 2005 — nearly a decade before most new TLDs — and its industry signal is beyond dispute: travel agencies and bespoke tour studios, destination guides and travel content sites, hotel and lodging booking platforms, visa and transit services on name.travel tell users what business you're in from the suffix alone. Its history adds a filter effect too: early .travel registration was restricted to verified travel businesses, so the namespace accumulated genuine industry sites and carries more trust than most new suffixes. Now operated by Identity Digital, about $16 to register and $119/yr to renew — a clearly premium renewal that buys industry identity, so budget strictly on the renewal price. Inventory is deep: destination words, activity words and brand words all hit. Three cautions: six letters is on the long side and less fluent by word of mouth, so it suits online-first acquisition; travel is a high-trust purchase — a professional domain is only the start, credentials and real reviews close the sale; and consumer-facing brand homes should hold the .com defensively. Naming: destination + .travel is the on-target japan.travel pattern with official precedents everywhere; brand + .travel fits agencies; activity or theme + .travel — the diving.travel pattern — fits vertical content sites.",
      bestFor: ["Travel agencies & tour operators", "Destination guides & travel content", "Hotel & lodging booking platforms", "Visa & transit services"],
      namingTips: [
        "Destination + .travel echoes official japan.travel-style precedents",
        "About $16 to register, $119/yr — budget on renewal",
        "A 2005 veteran with better trust than most new TLDs",
        "Activity or theme + .travel fits vertical content sites",
      ],
    },
  },
  tours: {
    tld: "tours",
    zh: {
      title: ".tours 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".tours 把「跟团/路线」写进域名，适合一日游与包车路线、徒步登山向导、城市导览与美食团、景区体验项目。查看 .tours 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .tours 域名。",
      intro:
        ".tours 把产品形态直接写进域名：一日游与包车路线、徒步登山向导、城市导览与美食团、景区体验项目用 name.tours，卖的是「带你走一趟」这件事，后缀读出来就是服务本身。它与 .travel 的分工在颗粒度：travel 泛指旅游行业，tours 专指线路与导览这类具体产品，本地向导与体验运营商用 tours 指向更准——「目的地 + .tours」读出来就是「某地的团」。Identity Digital 运营，注册约 $6（约 ¥41），续费约 $50/年（约 ¥360）——首年很便宜、续费跳档明显，预算按续费价算才稳。库存极好：目的地词、玩法词、品牌词几乎随手可得。注意三点：一是复数形式暗示多条线路，单一体验项目用单数语义的名字更贴；二是导览生意吃平台流量（GetYourGuide、Viator 等），独立域名适合做品牌沉淀与直订转化，别指望域名本身带客；三是面向国际游客建议英文名，本地客群则拼音亦可。命名上「目的地 + .tours」最点题（paris.tours 式），「主题 + .tours」（food.tours、bike.tours 式）适合垂直玩法，「品牌 + .tours」适合向导个人品牌。",
      bestFor: ["一日游与包车路线", "徒步登山向导", "城市导览与美食团", "景区体验项目"],
      namingTips: [
        "「目的地 + .tours」读出来就是「某地的团」",
        "注册约 $6、续费约 $50/年，预算按续费算",
        "与 .travel 分工：tours 专指线路与导览产品",
        "「主题 + .tours」适合美食/骑行等垂直玩法",
      ],
    },
    en: {
      title: ".tours Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".tours writes the product into the address — for day trips and chartered routes, hiking guides, city walks and food tours, and attraction experiences. See live pricing and naming advice, then hunt available .tours names with AI.",
      intro:
        ".tours writes the product itself into the address: day trips and chartered routes, hiking and mountain guides, city walks and food tours, attraction experiences on name.tours sell exactly what the suffix says — taking you on a trip. The split with .travel is granularity: travel means the industry at large, tours means this specific product — routes and guided experiences — so local guides and experience operators aim truer here; destination + .tours reads out as \"tours of that place\". Operated by Identity Digital, about $6 to register and $50/yr to renew — a cheap first year with a clear renewal jump, so budget on the renewal price. Inventory is excellent: destination words, activity words and brand words are all within reach. Three cautions: the plural implies multiple routes, so a single signature experience may read better under a singular-flavored name; the tours business leans on marketplaces (GetYourGuide, Viator) for traffic — an independent domain is for brand equity and direct bookings, not free customers; and international audiences want an English name even if locals would accept otherwise. Naming: destination + .tours is the on-target paris.tours pattern; theme + .tours — food.tours, bike.tours — fits vertical experiences; brand + .tours fits personal guide brands.",
      bestFor: ["Day trips & chartered routes", "Hiking & mountain guides", "City walks & food tours", "Attraction experiences"],
      namingTips: [
        "Destination + .tours reads as \"tours of that place\"",
        "About $6 to register, $50/yr — budget on renewal",
        "Tours is the product; .travel is the industry",
        "Theme + .tours (food.tours, bike.tours) fits verticals",
      ],
    },
  },
  vacations: {
    tld: "vacations",
    zh: {
      title: ".vacations 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".vacations 把「度假」写进域名，适合度假套餐与海岛游、度假村与民宿集群、亲子与蜜月主题游、度假攻略内容站。查看 .vacations 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .vacations 域名。",
      intro:
        ".vacations 把度假心情写进域名：度假套餐与海岛游、度假村与民宿集群、亲子与蜜月主题游、度假攻略内容站用 name.vacations，后缀自带「放松、犒赏自己」的情绪价值——用户搜度假产品时的心理状态，正好被这个词接住。它与 .tours 的分工在场景：tours 是带你走线路，vacations 是住下来慢慢玩，度假村、包段民宿与套餐产品用 vacations 更贴。Identity Digital 运营，注册约 $6（约 ¥41），续费约 $31/年（约 ¥226）——首年便宜，续费在行业后缀里算温和，长期持有压力不大。库存极好：目的地词、主题词、品牌词命中率都高。注意三点：一是九个字母偏长，适合线上获客与广告落地页，口头传播弱；二是度假消费决策周期长、比价重，域名情绪对了还要靠内容与真实图片承接；三是拼写对非英语母语用户有门槛，面向国内客群记得同时备一个好记的中文品牌词。命名上「目的地 + .vacations」最点题（maldives.vacations 式），「主题 + .vacations」（family.vacations、ski.vacations 式）适合垂直产品线，「品牌 + .vacations」适合度假村集团。",
      bestFor: ["度假套餐与海岛游", "度假村与民宿集群", "亲子与蜜月主题游", "度假攻略内容站"],
      namingTips: [
        "「目的地 + .vacations」直接接住度假搜索意图",
        "注册约 $6、续费约 $31/年，长期持有压力小",
        "与 .tours 分工：vacations 是住下来度假的场景",
        "「主题 + .vacations」适合亲子/滑雪等产品线",
      ],
    },
    en: {
      title: ".vacations Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".vacations writes the getaway into the address — for vacation packages and island trips, resorts and lodging clusters, family and honeymoon themes, and vacation-planning content. See live pricing and naming advice, then hunt available .vacations names with AI.",
      intro:
        ".vacations writes the getaway mood into the address: vacation packages and island trips, resorts and lodging clusters, family and honeymoon themes, vacation-planning content sites on name.vacations carry built-in emotional value — relaxation, treating yourself — which is exactly the state of mind of someone shopping for a holiday. The split with .tours is the scenario: tours takes you along a route, vacations means settling in and unwinding, so resorts, buyout lodges and package products fit truer here. Operated by Identity Digital, about $6 to register and $31/yr to renew — a cheap first year and one of the gentler renewals among industry suffixes, easy to hold long term. Inventory is excellent: destination words, theme words and brand words all hit. Three cautions: nine letters is long — great for online acquisition and ad landing pages, weak by word of mouth; vacation purchases have long, comparison-heavy decision cycles, so the mood-right domain still needs content and real photography to convert; and the spelling is a hurdle for non-native English speakers, so keep a memorable local brand word for domestic audiences. Naming: destination + .vacations is the on-target maldives.vacations pattern; theme + .vacations — family.vacations, ski.vacations — fits vertical product lines; brand + .vacations fits resort groups.",
      bestFor: ["Vacation packages & island trips", "Resorts & lodging clusters", "Family & honeymoon themes", "Vacation-planning content"],
      namingTips: [
        "Destination + .vacations catches holiday search intent",
        "About $6 to register, $31/yr — easy to hold long term",
        "Vacations is settling in; .tours is the route",
        "Theme + .vacations (family, ski) fits product lines",
      ],
    },
  },
  holiday: {
    tld: "holiday",
    zh: {
      title: ".holiday 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".holiday 把「假日」写进域名，适合节日礼品与假日营销、假期出行产品、节庆活动策划、假日主题内容站。查看 .holiday 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .holiday 域名。",
      intro:
        ".holiday 一词两义，域名也吃到两个场景：英式语境里是「度假」，假期出行产品与假日民宿用得顺；更普适的语义是「节日」——圣诞、新年、万圣节等节庆礼品电商、假日营销活动页、节庆活动策划用 name.holiday，节日氛围从域名就开始了。与 .vacations 的分工在语感：vacations 专指度假旅行，holiday 还能覆盖节庆礼赠与假日营销这条零售线，做节日限定产品与活动页反而是 holiday 更贴。Identity Digital 运营，注册约 $6（约 ¥41），续费约 $52/年（约 ¥374）——首年便宜、续费跳档，预算按续费价算。库存极好：节日词、目的地词、品牌词都有货。注意三点：一是节庆业务强季节性，域名全年续费但流量集中在旺季，适合当活动页矩阵而非唯一主站；二是单数 holiday 与复数 holidays 是不同后缀，对外传播注意别拼混；三是美式语境里 holiday 首先指节日而非度假，面向北美用户按节庆语义命名更稳。命名上「节日 + .holiday」最点题（christmas.holiday 式），「品牌 + .holiday」适合假日限定企划，「目的地 + .holiday」适合英式度假产品。",
      bestFor: ["节日礼品与假日营销", "假期出行产品", "节庆活动策划", "假日主题内容站"],
      namingTips: [
        "「节日 + .holiday」自带节庆氛围",
        "注册约 $6、续费约 $52/年，预算按续费算",
        "与 .vacations 分工：holiday 还覆盖节庆礼赠零售线",
        "注意单数 holiday，别与 holidays 拼混",
      ],
    },
    en: {
      title: ".holiday Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".holiday writes the festive break into the address — for seasonal gifts and holiday marketing, getaway products, festive event planning and holiday-themed content. See live pricing and naming advice, then hunt available .holiday names with AI.",
      intro:
        ".holiday carries two meanings and the domain profits from both: in British usage it means a getaway, so holiday-trip products and vacation rentals read naturally; the more universal sense is the festive one — Christmas, New Year and Halloween gift shops, holiday marketing campaign pages, festive event planners on name.holiday start the celebration from the address itself. The split with .vacations is register: vacations strictly means leisure travel, while holiday also covers the retail line of seasonal gifting and holiday campaigns — for limited-edition festive products, holiday is the truer fit. Operated by Identity Digital, about $6 to register and $52/yr to renew — cheap first year, renewal jump, so budget on the renewal price. Inventory is excellent: festival words, destination words and brand words are all in stock. Three cautions: festive business is sharply seasonal — you renew all year but traffic spikes in peak weeks, so it works best as a campaign-page fleet rather than the sole brand home; singular .holiday and plural .holidays are different TLDs — don't let them blur in promotion; and in American usage holiday means the festival first, so name by the festive sense for North American audiences. Naming: festival + .holiday is the on-target christmas.holiday pattern; brand + .holiday fits limited-run festive campaigns; destination + .holiday fits British-style getaway products.",
      bestFor: ["Seasonal gifts & holiday marketing", "Getaway products", "Festive event planning", "Holiday-themed content"],
      namingTips: [
        "Festival + .holiday brings the festive mood built in",
        "About $6 to register, $52/yr — budget on renewal",
        "Holiday also covers seasonal gifting; .vacations is travel only",
        "Mind the singular — .holidays is a different TLD",
      ],
    },
  },
  flights: {
    tld: "flights",
    zh: {
      title: ".flights 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".flights 把「机票/航班」写进域名，适合机票比价与订票、航线攻略与里程玩法、包机与商务航空、低价机票订阅提醒。查看 .flights 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .flights 域名。",
      intro:
        ".flights 把生意写进域名：机票比价与订票、航线攻略与里程玩法社区、包机与商务航空服务、低价机票订阅提醒用 name.flights，用户搜「某地机票」时这个后缀直接接住搜索意图——「目的地 + .flights」读出来就是「飞某地的航班」。它在旅游后缀家族里定位最垂直：travel 是行业、tours 是线路、flights 只管天上这一段，做机票与航空周边的用它指向最准。Identity Digital 运营，注册约 $31（约 ¥226），续费约 $47/年（约 ¥337）——首年中档、续费小幅上浮，在行业后缀里定价算平缓。库存极好：目的地词、航线词、玩法词命中率都高。注意三点：一是机票分销资质门槛高（IATA/代理协议），无资质做订票站有合规风险，内容与比价导流是更稳的切入；二是机票比价巨头林立（Google Flights、Skyscanner），独立站要靠里程玩法、错峰攻略这类差异化内容立足；三是八个字母认知度一般，品牌主站建议同时持有主流后缀。命名上「目的地 + .flights」最点题（tokyo.flights 式），「cheap/deal + .flights」适合低价订阅产品，「品牌 + .flights」适合包机与商务航空。",
      bestFor: ["机票比价与订票", "航线攻略与里程玩法", "包机与商务航空", "低价机票订阅提醒"],
      namingTips: [
        "「目的地 + .flights」直接接住机票搜索意图",
        "注册约 $31、续费约 $47/年，定价相对平缓",
        "旅游家族里最垂直：只管「飞」这一段",
        "无分销资质先做内容与比价导流更稳",
      ],
    },
    en: {
      title: ".flights Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".flights writes air travel into the address — for fare comparison and booking, route guides and miles hacking, charter and business aviation, and cheap-fare alert services. See live pricing and naming advice, then hunt available .flights names with AI.",
      intro:
        ".flights writes the business into the address: fare comparison and booking, route guides and miles-hacking communities, charter and business aviation, cheap-fare alert subscriptions on name.flights catch search intent head-on — destination + .flights reads out as \"flights to that place\". Within the travel-suffix family it is the most vertical: travel is the industry, tours is the route, flights covers only the airborne leg, so airfare and aviation-adjacent products aim truest here. Operated by Identity Digital, about $31 to register and $47/yr to renew — a mid-tier first year with only a modest renewal step, gentle pricing among industry suffixes. Inventory is excellent: destination words, route words and hack words all hit. Three cautions: airfare distribution is licence-gated (IATA/agency agreements) — running a booking site without credentials is a compliance risk, so content and comparison referral is the safer entry; fare comparison is giant-dominated (Google Flights, Skyscanner), so independents win on differentiated content like miles hacking and off-peak guides; and eight letters carry modest recognition, so brand homes should hold a mainstream suffix too. Naming: destination + .flights is the on-target tokyo.flights pattern; cheap or deal + .flights fits fare-alert products; brand + .flights fits charter and business aviation.",
      bestFor: ["Fare comparison & booking", "Route guides & miles hacking", "Charter & business aviation", "Cheap-fare alert services"],
      namingTips: [
        "Destination + .flights catches airfare search intent",
        "About $31 to register, $47/yr — relatively gentle pricing",
        "The most vertical travel suffix: just the airborne leg",
        "Without distribution credentials, start with content/referral",
      ],
    },
  },
  taxi: {
    tld: "taxi",
    zh: {
      title: ".taxi 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".taxi 把「打车/接送」写进域名，适合本地出租车与网约车队、机场接送与包车、景区与酒店接驳、代驾与货运小车队。查看 .taxi 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .taxi 域名。",
      intro:
        ".taxi 把服务写进域名：本地出租车与网约车队、机场接送与包车、景区与酒店接驳、代驾与货运小车队用 name.taxi，四个字母全球通用——taxi 在几十种语言里拼法几乎一致，是少有的天然无语言门槛的行业词。它对本地生意尤其顺手：「城市 + .taxi」读出来就是「某城打车」，本地搜索意图直接被域名接住，比在 .com 里挤长名字体面得多。Identity Digital 运营，注册约 $6（约 ¥45），续费约 $50/年（约 ¥360）——首年便宜、续费跳档，预算按续费价算才稳。库存极好：城市词、区域词、品牌词几乎都有货。注意三点：一是打车主战场在超级 App（Uber、滴滴），独立域名适合做预约制接送、企业包车这类直客生意，别硬拼即时叫车；二是接送是强信任服务，域名之外车辆照片、司机资质与固定报价才是转化关键；三是四个字母虽短，但认知度仍在建立期，本地投放时配合电话与微信入口更稳。命名上「城市 + .taxi」最点题（berlin.taxi 式已有大量同行先例），「机场码 + .taxi」（jfk.taxi 式）适合接送专线，「品牌 + .taxi」适合车队品牌化。",
      bestFor: ["本地出租车与网约车队", "机场接送与包车", "景区与酒店接驳", "代驾与货运小车队"],
      namingTips: [
        "「城市 + .taxi」直接接住本地打车搜索",
        "注册约 $6、续费约 $50/年，预算按续费算",
        "taxi 全球拼法几乎一致，天然无语言门槛",
        "「机场码 + .taxi」适合接送专线",
      ],
    },
    en: {
      title: ".taxi Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".taxi writes the ride into the address — for local cab and ride-hail fleets, airport transfers and charters, resort and hotel shuttles, and designated-driver services. See live pricing and naming advice, then hunt available .taxi names with AI.",
      intro:
        ".taxi writes the service into the address: local cab and ride-hail fleets, airport transfers and charters, resort and hotel shuttles, designated-driver and small cargo fleets on name.taxi — four letters that work worldwide, since taxi is spelled nearly identically across dozens of languages, one of the rare industry words with no language barrier at all. It suits local business especially well: city + .taxi reads out as \"a cab in that city\", catching local search intent from the domain itself — far cleaner than squeezing a long name into .com. Operated by Identity Digital, about $6 to register and $50/yr to renew — cheap first year, renewal jump, so budget on the renewal price. Inventory is excellent: city words, district words and brand words are nearly all available. Three cautions: on-demand rides belong to the super-apps (Uber, Didi) — an independent domain wins at scheduled transfers and corporate charters, not instant hailing; rides are a trust-first service, so vehicle photos, driver credentials and fixed quotes convert more than the domain; and though four letters are short, recognition is still building — pair local campaigns with phone and chat entry points. Naming: city + .taxi is the on-target berlin.taxi pattern with plenty of industry precedent; airport code + .taxi — the jfk.taxi pattern — fits transfer routes; brand + .taxi fits fleet branding.",
      bestFor: ["Local cab & ride-hail fleets", "Airport transfers & charters", "Resort & hotel shuttles", "Designated-driver services"],
      namingTips: [
        "City + .taxi catches local ride searches",
        "About $6 to register, $50/yr — budget on renewal",
        "Taxi is spelled the same worldwide — no language barrier",
        "Airport code + .taxi fits transfer routes",
      ],
    },
  },
  properties: {
    tld: "properties",
    zh: {
      title: ".properties 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".properties 把「物业/房产」写进域名，适合房产中介与经纪团队、物业管理公司、房源展示与楼盘官网、房产投资组合。查看 .properties 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .properties 域名。",
      intro:
        ".properties 把行业写进域名：房产中介与经纪团队、物业管理公司、房源展示与楼盘官网、房产投资组合用 name.properties，一眼就是「房产」生意。它的长处是语义完整——properties 是英语里对「多套房产/物业资产」最正式的说法，比 .estate 更日常、比 .house 更专业，中介挂整个在售组合、开发商做楼盘列表页都顺理成章。Identity Digital 运营，注册约 $6（约 ¥44），续费约 $31/年（约 ¥226）——首年便宜、续费跳档，预算按续费价算才稳。库存极好：城市词、区域词、品牌词几乎都有货。注意三点：一是词偏长（10 个字母），手机输入不算友好，适合做展示与投放落地页而非口播传播；二是房产是强本地、强信任行业，域名之外持牌信息与真实房源照片才是转化关键；三是它天然指「多套物业」，单套房源销售页用「地址 + .properties」反而更贴切。命名上「城市/区域 + .properties」最点题（miami.properties 式），「品牌/姓氏 + .properties」适合经纪团队，「luxury/prime + .properties」适合高端组合定位。",
      bestFor: ["房产中介与经纪团队", "物业管理公司", "房源展示与楼盘官网", "房产投资组合"],
      namingTips: [
        "「城市/区域 + .properties」直接接住本地找房搜索",
        "注册约 $6、续费约 $31/年，预算按续费算",
        "词偏长，适合落地页与投放而非口播传播",
        "「品牌/姓氏 + .properties」适合经纪团队",
      ],
    },
    en: {
      title: ".properties Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".properties writes real estate into the address — for agencies and broker teams, property management firms, listing showcases and development sites, and investment portfolios. See live pricing and naming advice, then hunt available .properties names with AI.",
      intro:
        ".properties writes the trade into the address: real-estate agencies and broker teams, property management firms, listing showcases and development sites, investment portfolios on name.properties read as a property business at a glance. Its strength is semantic completeness — properties is the most natural English word for a portfolio of real estate, more everyday than .estate and more professional than .house, so an agent's full listing set or a developer's project page sits on it naturally. Operated by Identity Digital, about $6 to register and $31/yr to renew — a cheap first year with a renewal jump, so budget on the renewal price. Inventory is excellent: city words, district words and brand words are nearly all available. Three cautions: at ten letters the word is long, so it suits landing pages and campaigns better than word-of-mouth; real estate is a local, trust-first trade, so licensing info and real listing photos convert more than the domain; and the word implies multiple units — a single-listing sales page reads better as address + .properties. Naming: city or district + .properties is the on-target miami.properties pattern; brand or surname + .properties fits broker teams; luxury or prime + .properties fits high-end portfolios.",
      bestFor: ["Real-estate agencies & broker teams", "Property management firms", "Listing showcases & development sites", "Property investment portfolios"],
      namingTips: [
        "City/district + .properties catches local home searches",
        "About $6 to register, $31/yr — budget on renewal",
        "Ten letters — better for landing pages than word of mouth",
        "Brand/surname + .properties fits broker teams",
      ],
    },
  },
  rentals: {
    tld: "rentals",
    zh: {
      title: ".rentals 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".rentals 把「出租」写进域名，适合民宿与短租运营、长租公寓与租房平台、汽车与设备租赁、婚礼与活动物品出租。查看 .rentals 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .rentals 域名。",
      intro:
        ".rentals 把生意模式写进域名：民宿与短租运营、长租公寓与租房中介、汽车与设备租赁、婚礼与活动物品出租用 name.rentals，「租什么」在域名里就说清了。它的覆盖面比想象中宽——从房子到相机、从婚纱到脚手架，一切按天按月收费的生意都能用，是少有的横跨房产与实体租赁两个行业的后缀。Identity Digital 运营，注册约 $7（约 ¥48），续费约 $36/年（约 ¥256）——首年便宜、续费跳档，预算按续费价算才稳。库存极好：品类词、城市词、品牌词几乎都有货。注意三点：一是短租房源的主战场在 Airbnb 等平台，独立域名适合做直订官网沉淀回头客、省平台佣金；二是租赁是强信任生意，押金规则、真实照片与评价体系比域名更影响转化；三是词是复数形式，单一房源或单台设备的页面用「品类 + .rentals」反而比品牌名更接搜索。命名上「品类 + .rentals」最点题（kayak.rentals 式读出来就是生意本身），「城市 + 品类 + .rentals」适合本地租赁，「品牌 + .rentals」适合连锁品牌化。",
      bestFor: ["民宿与短租直订官网", "长租公寓与租房平台", "汽车与设备租赁", "婚礼与活动物品出租"],
      namingTips: [
        "「品类 + .rentals」读出来就是生意本身",
        "注册约 $7、续费约 $36/年，预算按续费算",
        "短租直订官网可沉淀回头客、省平台佣金",
        "「城市 + 品类 + .rentals」适合本地租赁",
      ],
    },
    en: {
      title: ".rentals Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".rentals writes the business model into the address — for vacation and short-term rentals, apartment and housing platforms, car and equipment hire, and event gear rental. See live pricing and naming advice, then hunt available .rentals names with AI.",
      intro:
        ".rentals writes the business model into the address: vacation and short-term rental hosts, apartment and housing platforms, car and equipment hire, wedding and event gear rental on name.rentals say what's for rent in the domain itself. Its range is wider than it looks — houses to cameras, dresses to scaffolding, anything charged by the day or month fits, making it one of the rare suffixes spanning both real estate and physical hire. Operated by Identity Digital, about $7 to register and $36/yr to renew — a cheap first year with a renewal jump, so budget on the renewal price. Inventory is excellent: category words, city words and brand words are nearly all available. Three cautions: short-stay bookings live on Airbnb-style platforms, so an independent domain wins as a direct-booking site that keeps repeat guests and saves platform fees; rentals are a trust-first trade, so deposit rules, real photos and reviews convert more than the domain; and the word is plural — a single listing or machine reads better as category + .rentals than as a brand name. Naming: category + .rentals is the on-target kayak.rentals pattern that reads out as the business itself; city + category + .rentals fits local hire; brand + .rentals fits chains going branded.",
      bestFor: ["Vacation & short-term rental direct booking", "Apartment & housing platforms", "Car & equipment hire", "Wedding & event gear rental"],
      namingTips: [
        "Category + .rentals reads out as the business itself",
        "About $7 to register, $36/yr — budget on renewal",
        "Direct-booking sites keep repeat guests, skip platform fees",
        "City + category + .rentals fits local hire",
      ],
    },
  },
  apartments: {
    tld: "apartments",
    zh: {
      title: ".apartments 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".apartments 把「公寓」写进域名，适合长租公寓品牌、服务式公寓与公寓式酒店、公寓楼盘招租官网、学生公寓运营。查看 .apartments 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .apartments 域名。",
      intro:
        ".apartments 把物业类型写进域名：长租公寓品牌、服务式公寓与公寓式酒店、公寓楼盘招租官网、学生公寓运营用 name.apartments，找房人一眼知道这里租公寓。它是新顶级域里语义最窄也最准的后缀之一——不像 .rentals 什么都能租、.properties 什么房都算，apartments 精确锁定公寓这一种物业，招租页的搜索意图匹配度极高。Identity Digital 运营，注册约 $11（约 ¥78），续费约 $46/年（约 ¥330）——首年便宜、续费跳档，预算按续费价算才稳。库存极好：楼盘名、街区名、城市词几乎都有货。注意三点：一是词很长（10 个字母），适合印在招租物料与投放落地页，不适合口播；二是租房决策重线下，域名之外户型图、真实实拍与价格透明才是转化关键；三是各国「公寓」叫法不一（英式常用 flats），面向英联邦租客时留意用词习惯。命名上「楼盘名 + .apartments」最点题（parkview.apartments 式），「街区/城市 + .apartments」适合区域招租平台，「品牌 + .apartments」适合连锁公寓运营商。",
      bestFor: ["长租公寓品牌", "服务式公寓与公寓式酒店", "公寓楼盘招租官网", "学生公寓运营"],
      namingTips: [
        "「楼盘名 + .apartments」招租意图一眼可读",
        "注册约 $11、续费约 $46/年，预算按续费算",
        "词长适合物料与落地页，不适合口播",
        "「街区/城市 + .apartments」适合区域招租平台",
      ],
    },
    en: {
      title: ".apartments Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".apartments writes the property type into the address — for long-term apartment brands, serviced apartments and aparthotels, leasing sites for developments, and student housing operators. See live pricing and naming advice, then hunt available .apartments names with AI.",
      intro:
        ".apartments writes the property type into the address: long-term apartment brands, serviced apartments and aparthotels, leasing sites for developments, student housing operators on name.apartments tell renters exactly what's on offer. It's one of the narrowest and most precise new gTLDs — where .rentals covers anything for hire and .properties covers any real estate, apartments locks onto one property type, so leasing pages match search intent almost perfectly. Operated by Identity Digital, about $11 to register and $46/yr to renew — a cheap first year with a renewal jump, so budget on the renewal price. Inventory is excellent: building names, neighborhood names and city words are nearly all available. Three cautions: at ten letters the word is long — good on leasing flyers and landing pages, poor for word of mouth; renting is decided offline, so floor plans, real photos and transparent pricing convert more than the domain; and the word varies by market (British English says flats), so mind the vocabulary when targeting Commonwealth renters. Naming: building name + .apartments is the on-target parkview.apartments pattern; neighborhood or city + .apartments fits area leasing platforms; brand + .apartments fits chain operators.",
      bestFor: ["Long-term apartment brands", "Serviced apartments & aparthotels", "Development leasing sites", "Student housing operators"],
      namingTips: [
        "Building name + .apartments reads as a leasing page at a glance",
        "About $11 to register, $46/yr — budget on renewal",
        "Ten letters — fine on flyers and landing pages, poor for word of mouth",
        "Neighborhood/city + .apartments fits area leasing platforms",
      ],
    },
  },
  builders: {
    tld: "builders",
    zh: {
      title: ".builders 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".builders 把「建造者」写进域名，适合建筑与施工承包商、自建房与装修团队、房屋定制与模块化建造、开发者社区与创客团队。查看 .builders 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .builders 域名。",
      intro:
        ".builders 把身份写进域名：建筑与施工承包商、自建房与装修团队、房屋定制与模块化建造商用 name.builders，一眼就是「干工程的」。它还有一层意外的科技红利——builder 在互联网语境里指「创造者/开发者」，indie hacker 社区、低代码工具、创客团队用 .builders 同样成立，一个后缀同时覆盖工地与键盘两种「建造」。Identity Digital 运营，注册约 $5（约 ¥33），续费约 $28/年（约 ¥204）——首年便宜、续费跳档，预算按续费价算才稳；这也是本批房产建筑后缀里续费最低的一个。库存极好：姓氏、城市词、品类词几乎都有货。注意三点：一是复数形式指团队，个人工匠展示页用 .works 或 .expert 可能更贴；二是建筑承包是强资质行业，域名之外执照编号、完工案例与保险信息才是转化关键；三是词义横跨实体与科技，定位要在首屏立刻讲清做哪种「建造」。命名上「姓氏 + .builders」最点题（smith.builders 式是海外承包商的常见签名），「城市 + .builders」适合本地施工队，「社区名 + .builders」适合开发者社群。",
      bestFor: ["建筑与施工承包商", "自建房与装修团队", "房屋定制与模块化建造", "开发者社区与创客团队"],
      namingTips: [
        "「姓氏 + .builders」是海外承包商的常见签名",
        "注册约 $5、续费约 $28/年，预算按续费算",
        "词义横跨工地与键盘，首屏讲清做哪种建造",
        "「城市 + .builders」适合本地施工队",
      ],
    },
    en: {
      title: ".builders Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".builders writes the identity into the address — for construction contractors, custom-home and renovation crews, modular builders, and maker/developer communities. See live pricing and naming advice, then hunt available .builders names with AI.",
      intro:
        ".builders writes the identity into the address: construction contractors, custom-home and renovation crews, modular home builders on name.builders read as trade professionals at a glance. It also carries an unexpected tech bonus — builder means creator/developer in internet parlance, so indie-hacker communities, low-code tools and maker teams wear .builders just as well: one suffix covering both the job site and the keyboard. Operated by Identity Digital, about $5 to register and $28/yr to renew — a cheap first year with a renewal jump, so budget on the renewal price; it's also the cheapest renewal in this property-and-construction batch. Inventory is excellent: surnames, city words and category words are nearly all available. Three cautions: the plural implies a team — a solo craftsman's portfolio may sit better on .works or .expert; contracting is a credentials-first trade, so license numbers, finished projects and insurance info convert more than the domain; and since the word spans physical and digital building, say which kind you do above the fold. Naming: surname + .builders is the classic smith.builders contractor signature; city + .builders fits local crews; community name + .builders fits developer collectives.",
      bestFor: ["Construction contractors", "Custom-home & renovation crews", "Modular & prefab builders", "Maker & developer communities"],
      namingTips: [
        "Surname + .builders is the classic contractor signature",
        "About $5 to register, $28/yr — budget on renewal",
        "Spans job site and keyboard — say which kind above the fold",
        "City + .builders fits local crews",
      ],
    },
  },
  construction: {
    tld: "construction",
    zh: {
      title: ".construction 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".construction 把「建筑工程」写进域名，适合建筑工程公司、总包与分包商、基建与市政工程、建材与工程设备供应商。查看 .construction 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .construction 域名。",
      intro:
        ".construction 把行业写进域名：建筑工程公司、总包与分包商、基建与市政工程、建材与工程设备供应商用 name.construction，行业属性再明确不过。它是新顶级域里最「正式」的建筑后缀——比 .builders 更机构化，适合以公司而非团队示人的场景：投标资料、工程官网、集团子品牌都压得住。Identity Digital 运营，注册约 $9（约 ¥63），续费约 $31/年（约 ¥226）——首年便宜、续费跳档，预算按续费价算才稳。库存极好：公司名、城市词、工程品类词几乎都有货。注意三点：一是词非常长（12 个字母，现役最长的行业后缀之一），适合印在投标书与官网，不适合口播与手机输入；二是工程行业获客靠投标与转介绍，域名的价值在专业形象与资料可信度，而非搜索流量；三是别与 .builders 纠结太久——公司官网用 .construction、团队与工匠用 .builders 是最顺的分工。命名上「公司名 + .construction」最点题（acme.construction 式），「城市 + .construction」适合本地工程公司，「品类 + .construction」（steel.construction 式）适合细分工种。",
      bestFor: ["建筑工程公司", "总包与分包商", "基建与市政工程", "建材与工程设备供应商"],
      namingTips: [
        "「公司名 + .construction」正式感压得住投标资料",
        "注册约 $9、续费约 $31/年，预算按续费算",
        "12 个字母很长，适合官网与投标书，不适合口播",
        "公司官网用 .construction，团队工匠用 .builders",
      ],
    },
    en: {
      title: ".construction Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".construction writes the industry into the address — for construction firms, general and sub-contractors, infrastructure and civil works, and building material suppliers. See live pricing and naming advice, then hunt available .construction names with AI.",
      intro:
        ".construction writes the industry into the address: construction firms, general and sub-contractors, infrastructure and civil works, building material and equipment suppliers on name.construction could not be clearer about the trade. It's the most formal construction suffix among new gTLDs — more institutional than .builders, built for showing up as a company rather than a crew: bid documents, corporate sites and group sub-brands all carry it well. Operated by Identity Digital, about $9 to register and $31/yr to renew — a cheap first year with a renewal jump, so budget on the renewal price. Inventory is excellent: company names, city words and trade categories are nearly all available. Three cautions: at twelve letters it's one of the longest industry suffixes in service — fine on bid documents and websites, poor for word of mouth and mobile typing; construction wins work through bids and referrals, so the domain's value is professional credibility, not search traffic; and don't agonize over .builders vs .construction — company site on .construction, crews and craftsmen on .builders is the natural split. Naming: company name + .construction is the on-target acme.construction pattern; city + .construction fits local firms; trade + .construction — the steel.construction pattern — fits specialist crafts.",
      bestFor: ["Construction firms", "General & sub-contractors", "Infrastructure & civil works", "Building material suppliers"],
      namingTips: [
        "Company name + .construction carries bid documents well",
        "About $9 to register, $31/yr — budget on renewal",
        "Twelve letters — fine on paper, poor for word of mouth",
        "Company site on .construction, crews on .builders",
      ],
    },
  },
  repair: {
    tld: "repair",
    zh: {
      title: ".repair 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".repair 把「维修」写进域名，适合手机与电脑维修店、家电与家庭维修服务、汽车维修与保养、维修教程与配件商城。查看 .repair 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .repair 域名。",
      intro:
        ".repair 把服务写进域名：手机与电脑维修店、家电与家庭维修服务、汽车维修与保养、维修教程与配件商城用 name.repair，「修什么」直接长在域名上。它接的是全网最高意图的一类搜索——东西坏了的人马上就要找人修，「品类 + repair」正是他们的搜索原文，iphone.repair 这样的域名等于把搜索词注册成了门牌。Identity Digital 运营，注册约 $8（约 ¥56），续费约 $29/年（约 ¥211）——首年便宜、续费跳档，预算按续费价算才稳。库存极好：品类词、品牌词、城市词几乎都有货。注意三点：一是维修是强本地生意，域名之外 Google 商家资料、评价与报价透明才是获客主力；二是品类词域名涉及第三方商标时（如 iphone.repair）注意页面别自称官方；三是右起可修的东西极多，定位要聚焦一两个品类打透，别做「什么都修」的杂铺。命名上「品类 + .repair」最点题（phone.repair 式读出来就是搜索词），「城市 + 品类 + .repair」适合本地门店，「fix/快修词 + .repair」适合连锁品牌化。",
      bestFor: ["手机与电脑维修店", "家电与家庭维修服务", "汽车维修与保养", "维修教程与配件商城"],
      namingTips: [
        "「品类 + .repair」等于把搜索词注册成门牌",
        "注册约 $8、续费约 $29/年，预算按续费算",
        "维修是本地生意，商家资料与评价才是获客主力",
        "「城市 + 品类 + .repair」适合本地门店",
      ],
    },
    en: {
      title: ".repair Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".repair writes the service into the address — for phone and computer repair shops, appliance and home repair services, auto repair and maintenance, and repair guides and parts stores. See live pricing and naming advice, then hunt available .repair names with AI.",
      intro:
        ".repair writes the service into the address: phone and computer repair shops, appliance and home repair services, auto repair and maintenance, repair guides and parts stores on name.repair say what gets fixed in the domain itself. It catches some of the highest-intent searches on the web — people with something broken need a fix now, and category + repair is literally what they type, so a name like iphone.repair registers the search phrase as your storefront. Operated by Identity Digital, about $8 to register and $29/yr to renew — a cheap first year with a renewal jump, so budget on the renewal price. Inventory is excellent: category words, brand words and city words are nearly all available. Three cautions: repair is a fiercely local trade, so Google Business profiles, reviews and transparent quotes win customers more than the domain; category names touching third-party trademarks (like iphone.repair) must avoid claiming official status on the page; and since almost anything can be repaired, focus on one or two categories instead of a fix-everything shop. Naming: category + .repair is the on-target phone.repair pattern that reads out as the search phrase; city + category + .repair fits local shops; fix-style words + .repair fit chains going branded.",
      bestFor: ["Phone & computer repair shops", "Appliance & home repair services", "Auto repair & maintenance", "Repair guides & parts stores"],
      namingTips: [
        "Category + .repair registers the search phrase as your storefront",
        "About $8 to register, $29/yr — budget on renewal",
        "Repair is local — business profiles and reviews win customers",
        "City + category + .repair fits local shops",
      ],
    },
  },
  energy: {
    tld: "energy",
    zh: {
      title: ".energy 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".energy 把「能源」写进域名，适合能源公司与电力服务商、光伏与储能企业、充电桩与新能源汽车配套、能源科技与碳管理 SaaS。查看 .energy 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .energy 域名。",
      intro:
        ".energy 把行业写进域名：能源公司与电力服务商、光伏与储能企业、充电桩与新能源汽车配套、能源科技与碳管理 SaaS 用 name.energy，一眼就是「做能源的」。它踩在全球能源转型的风口上——从售电公司到虚拟电厂、从户用光伏到工商业储能，新玩家爆发式增长，而 .com 里能源相关的好词早被传统巨头占完，.energy 上品牌词、技术词几乎都有货。Identity Digital 运营，注册约 $12（约 ¥85），续费约 $93/年（约 ¥671）——首年便宜、续费跳档明显，是本批里续费最贵的一个，预算一定按续费价算。注意三点：一是能源是强监管行业，售电、并网等资质信息比域名更影响客户信任；二是词覆盖面广，首屏要立刻讲清做电、做气还是做储能；三是续费贵，适合有真实业务的公司而非囤域名。命名上「品牌 + .energy」最点题（tesla.energy 式是行业标杆用法），「城市/区域 + .energy」适合本地售电与光伏安装商，「clean/smart + .energy」适合技术定位。",
      bestFor: ["能源公司与电力服务商", "光伏与储能企业", "充电桩与新能源汽车配套", "能源科技与碳管理 SaaS"],
      namingTips: [
        "「品牌 + .energy」是 tesla.energy 式的行业标杆用法",
        "注册约 $12、续费约 $93/年，预算一定按续费算",
        "词覆盖面广，首屏讲清做电、做气还是做储能",
        "「城市 + .energy」适合本地售电与光伏安装商",
      ],
    },
    en: {
      title: ".energy Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".energy writes the industry into the address — for power companies and utilities, solar and storage firms, EV charging providers, and energy-tech and carbon SaaS. See live pricing and naming advice, then hunt available .energy names with AI.",
      intro:
        ".energy writes the industry into the address: power companies and electricity retailers, solar and storage firms, EV charging providers, energy-tech and carbon-management SaaS on name.energy read as energy businesses at a glance. It rides the global energy transition — from retail power to virtual power plants, rooftop solar to commercial storage, new players are multiplying while the good energy words in .com were claimed by incumbents long ago, so brand and technology words in .energy are nearly all available. Operated by Identity Digital, about $12 to register and $93/yr to renew — a cheap first year with a steep renewal jump, the priciest renewal in this batch, so budget strictly on the renewal price. Three cautions: energy is a heavily regulated trade, so licenses and grid credentials build trust more than the domain; the word is broad, so say whether you do power, gas or storage above the fold; and the renewal cost suits operating companies, not domain hoarding. Naming: brand + .energy is the tesla.energy industry-standard pattern; city or region + .energy fits local retailers and solar installers; clean or smart + .energy fits technology positioning.",
      bestFor: ["Power companies & electricity retailers", "Solar & storage firms", "EV charging providers", "Energy-tech & carbon SaaS"],
      namingTips: [
        "Brand + .energy is the tesla.energy industry-standard pattern",
        "About $12 to register, $93/yr — budget strictly on renewal",
        "Broad word — say power, gas or storage above the fold",
        "City + .energy fits local retailers and solar installers",
      ],
    },
  },
  solar: {
    tld: "solar",
    zh: {
      title: ".solar 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".solar 把「光伏」写进域名，适合光伏安装商与经销商、户用与工商业光伏方案、太阳能组件与逆变器品牌、光伏电站运维监控。查看 .solar 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .solar 域名。",
      intro:
        ".solar 把产品写进域名：光伏安装商与经销商、户用与工商业光伏方案商、太阳能组件与逆变器品牌、电站运维监控平台用 name.solar，客户一眼知道你做太阳能。它是能源类后缀里语义最锐利的一个——不像 .energy 什么能源都算，solar 锁死太阳能一个赛道，「城市 + solar」正是屋顶光伏客户的搜索原文，本地安装商用它接搜索意图极准。Identity Digital 运营，注册约 $6（约 ¥41），续费约 $52/年（约 ¥374）——首年便宜、续费跳档，预算按续费价算才稳。库存极好：城市词、品牌词、技术词几乎都有货。注意三点：一是光伏安装是强本地生意，Google 商家资料、案例照片与补贴政策解读比域名更影响成单；二是词也指「太阳的」，非光伏的太阳能热水、太阳观测内容站也能用，但定位要讲清；三是行业价格战激烈，域名省下的钱不如投在客户评价运营上。命名上「城市 + .solar」最点题（austin.solar 式直接接住本地搜索），「品牌 + .solar」适合组件与逆变器厂商，「go/get + .solar」适合营销落地页。",
      bestFor: ["光伏安装商与经销商", "户用与工商业光伏方案", "太阳能组件与逆变器品牌", "光伏电站运维监控"],
      namingTips: [
        "「城市 + .solar」直接接住本地屋顶光伏搜索",
        "注册约 $6、续费约 $52/年，预算按续费算",
        "语义比 .energy 更锐利，锁死太阳能赛道",
        "「品牌 + .solar」适合组件与逆变器厂商",
      ],
    },
    en: {
      title: ".solar Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".solar writes the product into the address — for solar installers and dealers, residential and commercial PV providers, panel and inverter brands, and plant monitoring platforms. See live pricing and naming advice, then hunt available .solar names with AI.",
      intro:
        ".solar writes the product into the address: solar installers and dealers, residential and commercial PV providers, panel and inverter brands, plant monitoring platforms on name.solar tell customers instantly that you do solar. It's the sharpest of the energy suffixes — where .energy covers any energy, solar locks onto one lane, and city + solar is literally what rooftop customers type, so local installers catch search intent with precision. Operated by Identity Digital, about $6 to register and $52/yr to renew — a cheap first year with a renewal jump, so budget on the renewal price. Inventory is excellent: city words, brand words and technology words are nearly all available. Three cautions: solar installation is a fiercely local trade, so Google Business profiles, project photos and incentive guides close deals more than the domain; the word also means of the sun, so solar-thermal or astronomy sites can use it too if the positioning is clear; and the industry is price-competitive — money saved on the domain is better spent on review management. Naming: city + .solar is the on-target austin.solar pattern that catches local searches; brand + .solar fits panel and inverter makers; go or get + .solar fits marketing landing pages.",
      bestFor: ["Solar installers & dealers", "Residential & commercial PV providers", "Panel & inverter brands", "Plant monitoring platforms"],
      namingTips: [
        "City + .solar catches local rooftop searches directly",
        "About $6 to register, $52/yr — budget on renewal",
        "Sharper than .energy — locked onto the solar lane",
        "Brand + .solar fits panel and inverter makers",
      ],
    },
  },
  green: {
    tld: "green",
    zh: {
      title: ".green 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".green 把「绿色环保」写进域名，适合可持续品牌与环保产品、绿色金融与 ESG 服务、环保组织与公益项目、有机食品与低碳生活方式。查看 .green 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .green 域名。",
      intro:
        ".green 把价值观写进域名：可持续品牌与环保产品、绿色金融与 ESG 服务、环保组织与公益项目、有机食品与低碳生活方式站用 name.green，环保立场在域名里就表明了。它是少有的「形容词型」后缀——green 修饰一切，绿色出行、绿色建筑、绿色电力、绿色包装都成立，品牌把 .com 主站之外的可持续专题放在 .green 上也是常见玩法。Identity Digital 运营，注册约 $7（约 ¥48），续费约 $64/年（约 ¥463）——首年便宜、续费跳档，预算按续费价算才稳。库存极好：行业词、品牌词、生活方式词几乎都有货。注意三点：一是「洗绿」监管趋严，域名喊绿色、页面要有认证与数据支撑，否则适得其反；二是 green 也是姓氏与颜色，非环保用法（设计、人名站）同样成立；三是续费不便宜，适合真实运营的品牌而非批量注册。命名上「品牌 + .green」最点题（品牌可持续专题页的标准用法），「行业词 + .green」适合垂直环保服务（building.green 式），「go/live + .green」适合生活方式内容站。",
      bestFor: ["可持续品牌与环保产品", "绿色金融与 ESG 服务", "环保组织与公益项目", "有机食品与低碳生活方式"],
      namingTips: [
        "「品牌 + .green」是可持续专题页的标准用法",
        "注册约 $7、续费约 $64/年，预算按续费算",
        "页面要有认证与数据支撑，避免「洗绿」质疑",
        "「行业词 + .green」适合垂直环保服务",
      ],
    },
    en: {
      title: ".green Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".green writes the values into the address — for sustainable brands and eco products, green finance and ESG services, environmental nonprofits, and organic and low-carbon lifestyle sites. See live pricing and naming advice, then hunt available .green names with AI.",
      intro:
        ".green writes the values into the address: sustainable brands and eco products, green finance and ESG services, environmental nonprofits, organic and low-carbon lifestyle sites on name.green state their stance in the domain itself. It's a rare adjective suffix — green modifies everything, so green mobility, green building, green power and green packaging all work, and brands routinely park their sustainability microsite on .green beside the .com flagship. Operated by Identity Digital, about $7 to register and $64/yr to renew — a cheap first year with a renewal jump, so budget on the renewal price. Inventory is excellent: industry words, brand words and lifestyle words are nearly all available. Three cautions: greenwashing rules are tightening, so a green domain needs certifications and data on the page or it backfires; green is also a surname and a color, so non-eco uses (design, personal sites) work fine too; and the renewal isn't cheap — it suits operating brands, not bulk registration. Naming: brand + .green is the standard sustainability-microsite pattern; industry word + .green fits vertical eco services (the building.green pattern); go or live + .green fits lifestyle content sites.",
      bestFor: ["Sustainable brands & eco products", "Green finance & ESG services", "Environmental nonprofits", "Organic & low-carbon lifestyle sites"],
      namingTips: [
        "Brand + .green is the standard sustainability-microsite pattern",
        "About $7 to register, $64/yr — budget on renewal",
        "Back the green claim with certifications, or it backfires",
        "Industry word + .green fits vertical eco services",
      ],
    },
  },
  eco: {
    tld: "eco",
    zh: {
      title: ".eco 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".eco 把「生态环保」写进域名，适合环保组织与气候行动项目、可持续品牌官网、碳中和与循环经济服务、生态旅游与自然保护。查看 .eco 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .eco 域名。",
      intro:
        ".eco 把承诺写进域名：环保组织与气候行动项目、可持续品牌官网、碳中和与循环经济服务、生态旅游与自然保护项目用 name.eco，三个字母就是一份环保声明。它是新顶级域里独一份的「带门槛后缀」——由 Big Room 运营、WWF 等环保组织背书，注册时需在 profiles.eco 提交环保承诺档案，这道门槛反而成了信任背书：挂 .eco 等于公开可查的环保立场，比自说自话的绿色文案硬得多。注册约 $60（约 ¥430），续费同价——无首年低价陷阱，价格全程透明。库存很好：品牌词、行动词、地名几乎都有货。注意三点：一是注册后要完成环保档案，否则域名可能被暂停解析；二是价格偏高，适合认真做环保定位的组织而非试水；三是 eco 是全球通用词根，多语言市场无需翻译。命名上「品牌 + .eco」最点题（品牌环保主站的标准用法），「行动词 + .eco」适合倡议项目（act.eco 式），「地名 + .eco」适合区域生态旅游与保护项目。",
      bestFor: ["环保组织与气候行动项目", "可持续品牌官网", "碳中和与循环经济服务", "生态旅游与自然保护"],
      namingTips: [
        "「品牌 + .eco」是公开可查的环保立场声明",
        "注册约 $60、续费同价，全程无涨价陷阱",
        "注册后需完成 profiles.eco 环保档案",
        "「行动词 + .eco」适合气候倡议项目",
      ],
    },
    en: {
      title: ".eco Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".eco writes the commitment into the address — for environmental nonprofits and climate projects, sustainable brand sites, carbon-neutral and circular-economy services, and ecotourism. See live pricing and naming advice, then hunt available .eco names with AI.",
      intro:
        ".eco writes the commitment into the address: environmental nonprofits and climate-action projects, sustainable brand sites, carbon-neutral and circular-economy services, ecotourism and conservation projects on name.eco make three letters read as an environmental pledge. It's the rare gated suffix among new gTLDs — operated by Big Room and backed by groups like WWF, registration requires an eco profile at profiles.eco, and that gate becomes the trust signal: a .eco domain is a publicly verifiable stance, far harder currency than self-declared green copy. About $60 to register and the same to renew — no first-year teaser, fully transparent pricing. Inventory is strong: brand words, action words and place names are nearly all available. Three cautions: complete the eco profile after registering or the domain can be suspended; the price suits organizations serious about environmental positioning, not experiments; and eco is a global root that needs no translation across markets. Naming: brand + .eco is the standard eco-flagship pattern; action word + .eco fits campaigns (the act.eco pattern); place name + .eco fits regional ecotourism and conservation projects.",
      bestFor: ["Environmental nonprofits & climate projects", "Sustainable brand sites", "Carbon-neutral & circular-economy services", "Ecotourism & conservation"],
      namingTips: [
        "Brand + .eco is a publicly verifiable environmental pledge",
        "About $60 to register and renew — no teaser-price trap",
        "Complete the profiles.eco eco profile after registering",
        "Action word + .eco fits climate campaigns",
      ],
    },
  },
  earth: {
    tld: "earth",
    zh: {
      title: ".earth 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".earth 把「地球」写进域名，适合环境与气候内容站、地理与地图数据服务、户外与自然探索品牌、全球公益与可持续倡议。查看 .earth 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .earth 域名。",
      intro:
        ".earth 把格局写进域名：环境与气候内容站、地理与地图数据服务、户外与自然探索品牌、全球公益与可持续倡议用 name.earth，「面向全球、关乎地球」的定位一读即懂。它比 .eco 和 .green 更宽——不预设环保立场，google.earth 式的地理科技、纪录片式的自然内容、行星尺度的数据可视化都成立，是少有的自带宏大叙事感的后缀。Interlink 运营（日本注册局），注册约 $16（约 ¥115），续费同价——无首年低价陷阱，价格全程透明，在新顶级域里属于「便宜且稳」的一档。库存极好：品牌词、主题词、项目名几乎都有货。注意三点：一是词偏「叙事感」，电商转化类站点用行业词后缀更直接；二是环境类内容站竞争激烈，域名之外持续的内容质量才是护城河；三是注册局有公益属性倡议（支持地球友好项目），品牌调性契合会加分。命名上「品牌 + .earth」最点题（宏大叙事的品牌主站），「主题词 + .earth」适合内容站（climate.earth 式），「save/for + .earth」适合公益倡议项目。",
      bestFor: ["环境与气候内容站", "地理与地图数据服务", "户外与自然探索品牌", "全球公益与可持续倡议"],
      namingTips: [
        "「品牌 + .earth」自带全球视野的叙事感",
        "注册约 $16、续费同价，价格便宜且稳",
        "比 .eco/.green 更宽，不预设环保立场",
        "「主题词 + .earth」适合气候与自然内容站",
      ],
    },
    en: {
      title: ".earth Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".earth writes the planet into the address — for environment and climate content sites, geo and mapping services, outdoor and nature brands, and global sustainability initiatives. See live pricing and naming advice, then hunt available .earth names with AI.",
      intro:
        ".earth writes the scale into the address: environment and climate content sites, geo and mapping data services, outdoor and nature exploration brands, global sustainability initiatives on name.earth read as planet-scale at a glance. It's broader than .eco and .green — no environmental stance is presumed, so google.earth-style geo tech, documentary-grade nature content and planetary data visualization all fit; few suffixes carry this much narrative gravity. Operated by Interlink (a Japanese registry), about $16 to register and the same to renew — no first-year teaser, transparent pricing, one of the cheap-and-stable tiers among new gTLDs. Inventory is excellent: brand words, theme words and project names are nearly all available. Three cautions: the word leans narrative — conversion-focused shops do better on trade-word suffixes; environmental content is a crowded space, so sustained content quality is the moat, not the domain; and the registry runs earth-friendly initiatives, so a matching brand ethos earns goodwill. Naming: brand + .earth is the grand-narrative flagship pattern; theme word + .earth fits content sites (the climate.earth pattern); save or for + .earth fits advocacy campaigns.",
      bestFor: ["Environment & climate content sites", "Geo & mapping data services", "Outdoor & nature exploration brands", "Global sustainability initiatives"],
      namingTips: [
        "Brand + .earth carries planet-scale narrative gravity",
        "About $16 to register and renew — cheap and stable",
        "Broader than .eco/.green — no eco stance presumed",
        "Theme word + .earth fits climate and nature content sites",
      ],
    },
  },
  engineering: {
    tld: "engineering",
    zh: {
      title: ".engineering 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".engineering 把「工程」写进域名，适合工程设计与咨询公司、机械与电气工程服务、软件工程团队博客、工程教育与认证机构。查看 .engineering 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .engineering 域名。",
      intro:
        ".engineering 把专业写进域名：工程设计与咨询公司、机械与电气工程服务商、软件工程团队博客、工程教育与认证机构用 name.engineering，「工程师做的」四个字直接长在域名上。它有一层科技公司红利——海外大厂把技术博客挂在 brand.engineering 上已成惯例（Uber、Slack 都这么用），招聘页与技术品牌页用它比 .com 子目录更有辨识度。Identity Digital 运营，注册约 $7（约 ¥48），续费约 $52/年（约 ¥374）——首年便宜、续费跳档，预算按续费价算才稳。库存极好：品牌词、学科词、姓氏几乎都有货。注意三点：一是词很长（11 个字母），适合品牌页与技术博客而非口播传播；二是传统工程行业重资质，注册执业编号与项目案例比域名更影响信任；三是软件与土木两种「工程」都用它，首屏要讲清是写代码还是画图纸。命名上「品牌 + .engineering」最点题（uber.engineering 式技术博客标准用法），「学科词 + .engineering」适合垂直服务（civil.engineering 式），「姓氏 + .engineering」适合独立工程顾问。",
      bestFor: ["工程设计与咨询公司", "机械与电气工程服务", "软件工程团队博客", "工程教育与认证机构"],
      namingTips: [
        "「品牌 + .engineering」是大厂技术博客的标准用法",
        "注册约 $7、续费约 $52/年，预算按续费算",
        "词长适合品牌页与博客，不适合口播",
        "「学科词 + .engineering」适合垂直工程服务",
      ],
    },
    en: {
      title: ".engineering Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".engineering writes the profession into the address — for engineering design and consulting firms, mechanical and electrical services, software engineering blogs, and engineering education. See live pricing and naming advice, then hunt available .engineering names with AI.",
      intro:
        ".engineering writes the profession into the address: engineering design and consulting firms, mechanical and electrical service providers, software engineering team blogs, engineering schools and certification bodies on name.engineering wear the trade in the domain itself. It carries a tech-company bonus — big names hang their engineering blogs on brand.engineering as a convention (Uber and Slack both do), and for hiring pages and tech branding it beats a .com subdirectory on recognition. Operated by Identity Digital, about $7 to register and $52/yr to renew — a cheap first year with a renewal jump, so budget on the renewal price. Inventory is excellent: brand words, discipline words and surnames are nearly all available. Three cautions: at eleven letters the word is long — good for brand pages and blogs, poor for word of mouth; traditional engineering is credentials-first, so licence numbers and project portfolios build trust more than the domain; and both software and civil engineers use it, so say which kind above the fold. Naming: brand + .engineering is the uber.engineering blog convention; discipline + .engineering fits vertical services (the civil.engineering pattern); surname + .engineering fits independent consultants.",
      bestFor: ["Engineering design & consulting firms", "Mechanical & electrical services", "Software engineering team blogs", "Engineering education & certification"],
      namingTips: [
        "Brand + .engineering is the big-tech blog convention",
        "About $7 to register, $52/yr — budget on renewal",
        "Eleven letters — good for brand pages, poor for word of mouth",
        "Discipline + .engineering fits vertical services",
      ],
    },
  },
  family: {
    tld: "family",
    zh: {
      title: ".family 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".family 把「家庭」写进域名，适合家庭网站与家谱相册、亲子内容与育儿社区、家庭理财与保险服务、家族企业官网。查看 .family 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .family 域名。",
      intro:
        ".family 把归属写进域名：家庭网站与家谱相册、亲子内容与育儿社区、家庭理财与保险服务、家族企业官网用 name.family，「一家人」的温度从地址就传出来了。它最独特的用法是「姓氏 + .family」——smith.family 式的家庭主页天然成立，聚合相册、家谱、家庭动态，比社交平台更私密可控；对家族企业它也是加分项，「传承感」正是这类品牌想要的。Identity Digital 运营，注册约 $6（约 ¥41），续费约 $31/年（约 ¥226）——温和档，当家庭数字资产长期持有无压力。库存极好：常见姓氏、拼音姓氏命中率都很高。注意三点：一是家庭站涉及儿童照片与隐私，建议配合访问控制而非全公开；二是 family 也是「家族式」的商业隐喻，餐馆、诊所等「家庭经营」定位同样成立；三是亲子内容竞争激烈，域名点题之外内容质量才是留存关键。命名上「姓氏 + .family」最点题（家庭主页的标准用法），「品牌 + .family」适合家族企业与亲子品牌，「city/our + .family」适合社区型育儿站。",
      bestFor: ["家庭网站与家谱相册", "亲子内容与育儿社区", "家庭理财与保险服务", "家族企业官网"],
      namingTips: [
        "「姓氏 + .family」是家庭主页的标准用法",
        "注册约 $6、续费约 $31/年，长期持有无压力",
        "涉及儿童照片建议配访问控制，别全公开",
        "「品牌 + .family」适合家族企业与亲子品牌",
      ],
    },
    en: {
      title: ".family Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".family writes the bond into the address — for family sites and photo archives, parenting content and communities, family finance and insurance services, and family-business sites. See live pricing and naming advice, then hunt available .family names with AI.",
      intro:
        ".family writes the bond into the address: family homepages and photo archives, parenting content and communities, family finance and insurance services, family-business sites on name.family carry the warmth in the domain itself. Its signature pattern is surname + .family — a smith.family homepage just works, gathering albums, genealogy and family news with more privacy and control than any social platform; for family businesses it adds exactly the heritage note the brand wants. Operated by Identity Digital, about $6 to register and $31/yr to renew — the mild tier, painless to hold as a long-term family asset. Inventory is excellent: common surnames in English and pinyin alike still hit. Three cautions: family sites carry children's photos, so pair the domain with access control rather than going fully public; family also works as a business metaphor — family-run restaurants and clinics qualify too; and parenting content is a crowded field, so the domain opens the door but content quality keeps readers. Naming: surname + .family is the standard homepage pattern; brand + .family fits family businesses and parenting brands; our or city + .family fits community parenting sites.",
      bestFor: ["Family sites & photo archives", "Parenting content & communities", "Family finance & insurance", "Family-business sites"],
      namingTips: [
        "Surname + .family is the standard family-homepage pattern",
        "About $6 to register, $31/yr — easy to hold long-term",
        "Pair kids' photos with access control, not a public site",
        "Brand + .family fits family businesses and parenting brands",
      ],
    },
  },
  baby: {
    tld: "baby",
    zh: {
      title: ".baby 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".baby 把「婴幼儿」写进域名，适合母婴用品电商与品牌、月子中心与产后护理、婴幼儿早教与托育、育儿内容与新生儿记录站。查看 .baby 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .baby 域名。",
      intro:
        ".baby 把人群写进域名：母婴用品电商与品牌、月子中心与产后护理机构、婴幼儿早教与托育、育儿内容与新生儿记录站用 name.baby，目标客群一眼锁定。它的行业出身很正——最初由强生（Johnson & Johnson）发起、后转入 XYZ 注册局运营，母婴垂直的定位从注册局层面就写死了；对母婴品牌这是 .com 之外语义最贴的选择，「品牌 + .baby」读出来就是产品线。注册约 $2（约 ¥11），续费约 $52/年（约 ¥374）——首年极便宜、续费跳档明显，预算一定按续费价算。库存极好：品牌词、品类词、昵称词几乎都有货。注意三点：一是母婴行业信任成本高，资质、成分与安全认证展示比域名更影响转化；二是 baby 也是昵称与流行文化用词，音乐、宠物等非母婴用法同样成立；三是新生儿记录站热度随孩子长大会降，长期续费要想清楚。命名上「品牌 + .baby」最点题（母婴品牌的标准用法），「品类词 + .baby」适合垂直电商（organic.baby 式），「昵称 + .baby」适合个人记录站。",
      bestFor: ["母婴用品电商与品牌", "月子中心与产后护理", "婴幼儿早教与托育", "育儿内容与新生儿记录"],
      namingTips: [
        "「品牌 + .baby」是母婴品牌的标准用法",
        "注册约 $2、续费约 $52/年，预算一定按续费算",
        "母婴行业资质与安全认证比域名更影响转化",
        "「品类词 + .baby」适合垂直母婴电商",
      ],
    },
    en: {
      title: ".baby Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".baby writes the audience into the address — for baby-product stores and brands, maternity and postpartum care, early education and childcare, and parenting content and baby-book sites. See live pricing and naming advice, then hunt available .baby names with AI.",
      intro:
        ".baby writes the audience into the address: baby-product stores and brands, maternity and postpartum care centers, early education and childcare providers, parenting content and baby-book sites on name.baby lock onto their customers at a glance. Its pedigree is unusually on-topic — launched by Johnson & Johnson and now operated by XYZ Registry, the mother-and-baby vertical is baked in at the registry level, making it the most semantically exact choice outside .com for baby brands: brand + .baby reads as the product line itself. About $2 to register and $52/yr to renew — a very cheap first year with a steep renewal jump, so budget strictly on the renewal price. Inventory is excellent: brand words, category words and nickname words are nearly all available. Three cautions: trust costs are high in the baby industry, so certifications, ingredients and safety proof convert better than any domain; baby is also a term of endearment and pop-culture word, so music and pet uses work fine too; and a baby-book site cools as the child grows, so think through the long-term renewals. Naming: brand + .baby is the standard baby-brand pattern; category + .baby fits vertical stores (the organic.baby pattern); nickname + .baby fits personal baby books.",
      bestFor: ["Baby-product stores & brands", "Maternity & postpartum care", "Early education & childcare", "Parenting content & baby books"],
      namingTips: [
        "Brand + .baby is the standard baby-brand pattern",
        "About $2 to register, $52/yr — budget strictly on renewal",
        "Certifications and safety proof convert better than the domain",
        "Category + .baby fits vertical baby stores",
      ],
    },
  },
  mom: {
    tld: "mom",
    zh: {
      title: ".mom 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".mom 把「妈妈」写进域名，适合妈妈博客与育儿分享、母婴社区与妈妈群服务、送给妈妈的礼物电商、家庭生活方式内容站。查看 .mom 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .mom 域名。",
      intro:
        ".mom 把身份写进域名：妈妈博客与育儿分享、母婴社区与妈妈群服务、送给妈妈的礼物电商、家庭生活方式内容站用 name.mom，「妈妈视角」三个字母就说清了。它和 .baby 是一对好搭档——baby 指向孩子与产品，mom 指向妈妈本人与社群，妈妈博主、妈妈创业者（mompreneur）用它做个人品牌比通用后缀鲜活得多；英语里 ask mom、super mom 的固定搭配也让「词 + .mom」读起来自然成句。XYZ 注册局运营，注册约 $2（约 ¥11），续费约 $26/年（约 ¥189）——温和档，个人博客长期持有无压力。库存极好：昵称、名字、生活方式词几乎都有货。注意三点：一是 mom 是美式拼写，英式受众熟悉的是 mum，面向英联邦市场要留意；二是妈妈内容的主阵地在小红书、Instagram 等平台，域名的角色是个人品牌与合作洽谈的稳定入口；三是三个字母极短，配长一点的前词反而更好记。命名上「名字 + .mom」最点题（妈妈博主个人品牌的标准用法），「super/busy + .mom」适合人设化内容站，「品牌 + .mom」适合母婴社区产品。",
      bestFor: ["妈妈博客与育儿分享", "母婴社区与妈妈群服务", "送给妈妈的礼物电商", "家庭生活方式内容站"],
      namingTips: [
        "「名字 + .mom」是妈妈博主个人品牌的标准用法",
        "注册约 $2、续费约 $26/年，长期持有无压力",
        "美式拼写 mom，面向英联邦市场注意 mum 差异",
        "「super/busy + .mom」适合人设化内容站",
      ],
    },
    en: {
      title: ".mom Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".mom writes the identity into the address — for mom blogs and parenting diaries, mom communities and services, gifts-for-mom stores, and family lifestyle content sites. See live pricing and naming advice, then hunt available .mom names with AI.",
      intro:
        ".mom writes the identity into the address: mom blogs and parenting diaries, mom communities and group services, gifts-for-mom stores, family lifestyle content sites on name.mom state the point of view in three letters. It pairs naturally with .baby — baby points at the child and the products, mom points at the mother and her community, so mom bloggers and mompreneurs get a far livelier personal brand here than on a generic suffix, and fixed phrases like ask mom and super mom make word + .mom read as a sentence. Operated by XYZ Registry, about $2 to register and $26/yr to renew — the mild tier, painless for a personal blog held long-term. Inventory is excellent: nicknames, first names and lifestyle words nearly all hit. Three cautions: mom is the American spelling — Commonwealth audiences know mum, so mind the market; mom content lives on Instagram and similar platforms, so the domain's job is the stable front door for the personal brand and sponsorship inquiries; and three letters is ultra-short, so a slightly longer front word is actually easier to remember. Naming: first name + .mom is the standard mom-blogger pattern; super or busy + .mom fits persona-driven content; brand + .mom fits mom-community products.",
      bestFor: ["Mom blogs & parenting diaries", "Mom communities & services", "Gifts-for-mom stores", "Family lifestyle content"],
      namingTips: [
        "First name + .mom is the standard mom-blogger pattern",
        "About $2 to register, $26/yr — easy to hold long-term",
        "American spelling — Commonwealth markets expect mum",
        "Super or busy + .mom fits persona-driven content sites",
      ],
    },
  },
  dad: {
    tld: "dad",
    zh: {
      title: ".dad 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".dad 把「爸爸」写进域名，适合爸爸博客与育儿分享、父亲节礼物与男士好物电商、冷笑话与幽默内容站、家庭工具与 DIY 教程。查看 .dad 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .dad 域名。",
      intro:
        ".dad 把身份写进域名：爸爸博客与育儿分享、父亲节礼物与男士好物电商、冷笑话与幽默内容站、家庭工具与 DIY 教程站用 name.dad，「爸爸视角」从地址就开始了。它是 Google 注册局运营的后缀——与 .app、.dev 同门，全线强制 HTTPS，安全基线从注册局层面写死；英语文化里 dad joke（冷笑话）、dad bod 等梗自带流量，幽默内容站用 .dad 点题又讨喜。注册约 $11（约 ¥78），续费同价——无首年低价陷阱，价格全程透明。库存极好：名字、梗词、工具词几乎都有货。注意三点：一是 Google 后缀必须配好 HTTPS 证书（主流托管平台都自动搞定）；二是 dad 的幽默气质是双刃剑，严肃的父职咨询、法律服务用它会显得轻佻；三是与 .mom 成对注册做「爸妈视角」双站是内容矩阵的现成玩法。命名上「名字 + .dad」最点题（爸爸博主个人品牌的标准用法），「joke/tips + .dad」适合幽默与技巧内容站，「品牌 + .dad」适合男士与父亲节礼物电商。",
      bestFor: ["爸爸博客与育儿分享", "父亲节礼物与男士好物", "冷笑话与幽默内容站", "家庭工具与 DIY 教程"],
      namingTips: [
        "「名字 + .dad」是爸爸博主个人品牌的标准用法",
        "注册约 $11、续费同价，无涨价陷阱",
        "Google 后缀强制 HTTPS，托管平台自动搞定",
        "幽默气质明显，严肃父职服务慎用",
      ],
    },
    en: {
      title: ".dad Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".dad writes the identity into the address — for dad blogs and parenting diaries, Father's Day gift stores, dad-joke and humor sites, and home tool and DIY tutorial sites. See live pricing and naming advice, then hunt available .dad names with AI.",
      intro:
        ".dad writes the identity into the address: dad blogs and parenting diaries, Father's Day and men's gift stores, dad-joke and humor sites, home tool and DIY tutorial sites on name.dad start the dad's-eye view right in the domain. It's a Google Registry suffix — same family as .app and .dev, with HTTPS enforced across the zone, so the security baseline is set at the registry level; and English culture hands it free traffic through dad joke and dad bod memes, making humor sites both on-topic and likable here. About $11 to register and the same to renew — no first-year teaser, fully transparent pricing. Inventory is excellent: first names, meme words and tool words nearly all hit. Three cautions: a Google suffix needs a working HTTPS certificate (mainstream hosts handle it automatically); the humor register cuts both ways — serious fatherhood counseling or legal services would read flippant here; and registering the .mom pair for a two-site parents' matrix is a ready-made content play. Naming: first name + .dad is the standard dad-blogger pattern; joke or tips + .dad fits humor and how-to content; brand + .dad fits men's and Father's Day gift stores.",
      bestFor: ["Dad blogs & parenting diaries", "Father's Day & men's gifts", "Dad-joke & humor sites", "Home tools & DIY tutorials"],
      namingTips: [
        "First name + .dad is the standard dad-blogger pattern",
        "About $11 to register and renew — no teaser-price trap",
        "Google suffix — HTTPS is enforced, hosts handle it",
        "Humor register — serious services should look elsewhere",
      ],
    },
  },
  dog: {
    tld: "dog",
    zh: {
      title: ".dog 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".dog 把「狗狗」写进域名，适合宠物用品与狗粮电商、宠物美容与寄养服务、训犬与遛狗平台、犬种科普与狗狗内容站。查看 .dog 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .dog 域名。",
      intro:
        ".dog 把毛孩子写进域名：宠物用品与狗粮电商、宠物美容与寄养服务、训犬与遛狗平台、犬种科普与狗狗内容站用 name.dog，「跟狗有关」三个字母就说完了。它比 .pet 更锐利——pet 泛指宠物，dog 锁死犬类一个赛道，养狗人群的搜索与消费都极度垂直，狗粮订阅、犬种社区、遛狗 App 用它定位分毫不差；英语里 good dog、top dog 的固定搭配也让「词 + .dog」自然成句。Identity Digital 运营，注册约 $4（约 ¥26），续费约 $52/年（约 ¥374）——首年便宜、续费跳档，预算按续费价算才稳。库存极好：犬种名、昵称、品类词几乎都有货。注意三点：一是宠物行业信任靠实拍与口碑，域名点题之外用户评价与案例照片才是转化关键；二是 dog 在英语俚语里偶有贬义（dog day 式），品牌词要选正面搭配；三是与 .pet 的分工要想清，多宠物品类用 .pet、纯犬类用 .dog 更准。命名上「品牌 + .dog」最点题（宠物品牌的标准用法），「犬种 + .dog」适合垂直社区（corgi.dog 式），「good/walk + .dog」适合服务与内容站。",
      bestFor: ["宠物用品与狗粮电商", "宠物美容与寄养服务", "训犬与遛狗平台", "犬种科普与狗狗内容"],
      namingTips: [
        "「品牌 + .dog」是宠物品牌的标准用法",
        "注册约 $4、续费约 $52/年，预算按续费算",
        "比 .pet 更锐利，纯犬类赛道定位分毫不差",
        "「犬种 + .dog」适合垂直犬种社区",
      ],
    },
    en: {
      title: ".dog Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".dog writes the pup into the address — for pet supply and dog food stores, grooming and boarding services, dog training and walking platforms, and breed guides and dog content sites. See live pricing and naming advice, then hunt available .dog names with AI.",
      intro:
        ".dog writes the pup into the address: pet supply and dog food stores, grooming and boarding services, dog training and walking platforms, breed guides and dog content sites on name.dog say it all in three letters. It's sharper than .pet — pet covers any animal, dog locks onto one lane, and dog owners search and spend with extreme vertical focus, so food subscriptions, breed communities and walking apps aim true here; fixed phrases like good dog and top dog make word + .dog read as a sentence. Operated by Identity Digital, about $4 to register and $52/yr to renew — a cheap first year with a renewal jump, so budget on the renewal price. Inventory is excellent: breed names, nicknames and category words nearly all hit. Three cautions: trust in the pet trade is built on real photos and reviews, so the domain opens the door but testimonials convert; dog carries occasional negative slang in English (the dog-day sense), so pick positive brand pairings; and split the work with .pet deliberately — multi-species stores fit .pet, pure dog plays aim truer with .dog. Naming: brand + .dog is the standard pet-brand pattern; breed + .dog fits vertical communities (the corgi.dog pattern); good or walk + .dog fits services and content sites.",
      bestFor: ["Pet supply & dog food stores", "Grooming & boarding services", "Dog training & walking platforms", "Breed guides & dog content"],
      namingTips: [
        "Brand + .dog is the standard pet-brand pattern",
        "About $4 to register, $52/yr — budget on renewal",
        "Sharper than .pet — locked onto the dog lane",
        "Breed + .dog fits vertical breed communities",
      ],
    },
  },
  gifts: {
    tld: "gifts",
    zh: {
      title: ".gifts 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".gifts 把「礼物」写进域名，适合礼品电商与定制礼物、企业礼品与伴手礼服务、节日礼物清单与推荐站、礼品卡与心愿单工具。查看 .gifts 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .gifts 域名。",
      intro:
        ".gifts 把场景写进域名：礼品电商与定制礼物、企业礼品与伴手礼服务、节日礼物清单与推荐站、礼品卡与心愿单工具用 name.gifts，「来这儿挑礼物」的用途从地址就说清了。礼物是天然的「场景消费」——圣诞、情人节、母亲节、生日的搜索高峰周期性爆发，「场景词 + .gifts」正接住这类意图；对定制礼品与企业礼品这类高毛利生意，一个点题域名比长尾 .com 更好记也更好投放。Identity Digital 运营，注册约 $8（约 ¥59），续费约 $29/年（约 ¥211）——温和档，电商站长期持有无压力。库存极好：场景词、人群词、品类词几乎都有货。注意三点：一是礼品电商强季节性，域名之外物流履约的节前保障才是口碑关键；二是 gifts 是复数，读作「各种礼物」，单一定制品（如刻字钢笔）用「品类 + .gifts」反而更准；三是与 .shop/.store 的分工——泛电商用后者，礼物场景专营用 .gifts 语义更锐。命名上「人群 + .gifts」最点题（forhim.gifts 式直接接住送礼搜索），「品牌 + .gifts」适合礼品定制品牌，「节日词 + .gifts」适合季节性推荐站。",
      bestFor: ["礼品电商与定制礼物", "企业礼品与伴手礼服务", "节日礼物清单与推荐站", "礼品卡与心愿单工具"],
      namingTips: [
        "「人群 + .gifts」直接接住送礼场景搜索",
        "注册约 $8、续费约 $29/年，长期持有无压力",
        "强季节性生意，节前履约保障比域名更关键",
        "泛电商用 .shop，礼物专营用 .gifts 更锐",
      ],
    },
    en: {
      title: ".gifts Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".gifts writes the occasion into the address — for gift stores and custom gifts, corporate gifting services, holiday gift guides and lists, and gift card and wishlist tools. See live pricing and naming advice, then hunt available .gifts names with AI.",
      intro:
        ".gifts writes the occasion into the address: gift stores and custom-gift shops, corporate gifting and favor services, holiday gift guides and recommendation sites, gift card and wishlist tools on name.gifts announce come here to pick a present in the domain itself. Gifting is occasion commerce by nature — Christmas, Valentine's, Mother's Day and birthday searches spike on schedule, and occasion word + .gifts catches exactly that intent; for high-margin custom and corporate gifting, an on-topic domain beats a long-tail .com for recall and ad copy alike. Operated by Identity Digital, about $8 to register and $29/yr to renew — the mild tier, painless for a store held long-term. Inventory is excellent: occasion words, audience words and category words nearly all hit. Three cautions: gifting is fiercely seasonal, so pre-holiday fulfillment reliability builds the reputation more than the domain; gifts is plural and reads as an assortment — a single custom product (an engraved pen, say) aims truer as category + .gifts; and split the work with .shop or .store — general stores fit those, dedicated gifting plays read sharper on .gifts. Naming: audience + .gifts is the on-target forhim.gifts pattern that catches gifting searches; brand + .gifts fits custom-gift brands; holiday word + .gifts fits seasonal guides.",
      bestFor: ["Gift stores & custom gifts", "Corporate gifting services", "Holiday gift guides & lists", "Gift card & wishlist tools"],
      namingTips: [
        "Audience + .gifts catches gifting searches directly",
        "About $8 to register, $29/yr — easy to hold long-term",
        "Seasonal trade — fulfillment matters more than the domain",
        "General stores fit .shop; gifting plays read sharper here",
      ],
    },
  },
  photo: {
    tld: "photo",
    zh: {
      title: ".photo 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".photo 把「照片」写进域名，适合摄影师作品集与个人主页、婚礼跟拍与约拍工作室、图片分享与照片打印服务、修图与摄影教程站。查看 .photo 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .photo 域名。",
      intro:
        ".photo 把作品写进域名：摄影师作品集与个人主页、婚礼跟拍与约拍工作室、图片分享与照片打印服务、修图与摄影教程站用 name.photo，「这里看照片」的定位从地址就说清了。与已收录的 .photos/.photography 相比，.photo 是单数原型词——不带复数也不拖长音节，适合当「一张名片」用：客户在婚礼现场听到 lily.photo，回家就能拼对；而 .photos 更像相册合集、.photography 更像行业机构。注册局运营方为 Registry Services（原 Uniregistry 系），注册约 $26（约 ¥189），续费约 $26/年（约 ¥189）——注册续费同价，无「首年低价钓鱼」问题，报价即长期成本。库存极好：人名、城市、风格词几乎都有货。注意三点：一是 photo 对英文用户是「照片」而非「摄影服务」，主打约拍业务时页面要把服务说清；二是与 .photos 的分工——个人品牌用单数、相册库存类用复数更顺；三是照片作品的主阵地在 Instagram 等平台，域名的角色是接单与转化的稳定门面。命名上「人名 + .photo」是摄影师标准款，「城市 + 风格词 + .photo」适合本地约拍，「品牌 + .photo」适合打印与分享工具。",
      bestFor: ["摄影师作品集与个人主页", "婚礼跟拍与约拍工作室", "图片分享与照片打印服务", "修图与摄影教程站"],
      namingTips: [
        "「人名 + .photo」是摄影师个人品牌标准款",
        "注册续费同价约 $26/年，报价即长期成本",
        "个人品牌用单数 .photo，相册合集用 .photos",
        "平台接流量，域名做接单转化的稳定门面",
      ],
    },
    en: {
      title: ".photo Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".photo writes the work into the address — for photographer portfolios and personal pages, wedding and portrait studios, photo sharing and print services, and editing and tutorial sites. See live pricing and naming advice, then hunt available .photo names with AI.",
      intro:
        ".photo writes the work into the address: photographer portfolios and personal pages, wedding and portrait studios, photo sharing and print services, editing and tutorial sites on name.photo say come here for the pictures in the domain itself. Against its siblings .photos and .photography, .photo is the singular root — no plural, no extra syllables — which makes it the business-card play: a client who hears lily.photo at a wedding can spell it at home, while .photos reads like an album and .photography like an institution. Operated by Registry Services (the former Uniregistry stable), about $26 to register and $26/yr to renew — same price both ways, so there's no first-year teaser trap and the sticker is the long-term cost. Inventory is excellent: first names, cities and style words nearly all hit. Three cautions: photo means the picture, not the service, to English ears — a booking-led studio should spell out the offer on the page; split the work with .photos — singular fits a personal brand, plural fits archives and collections; and photography lives on Instagram and similar platforms, so the domain's job is the stable storefront for bookings and conversions. Naming: first name + .photo is the standard photographer pattern; city + style word + .photo fits local portrait work; brand + .photo fits print and sharing tools.",
      bestFor: ["Photographer portfolios & personal pages", "Wedding & portrait studios", "Photo sharing & print services", "Editing & tutorial sites"],
      namingTips: [
        "First name + .photo is the photographer standard",
        "Same $26 price to register and renew — no teaser trap",
        "Singular for a personal brand; .photos for archives",
        "Platforms bring traffic; the domain converts bookings",
      ],
    },
  },
  health: {
    tld: "health",
    zh: {
      title: ".health 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".health 把「健康」写进域名，适合数字健康与健康管理应用、诊所与健康服务机构、健康科普与营养内容站、企业员工健康福利平台。查看 .health 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .health 域名。",
      intro:
        ".health 把行业写进域名：数字健康与健康管理应用、诊所与健康服务机构、健康科普与营养内容站、企业员工健康福利平台用 name.health，「做健康这门生意」的定位从地址就说清了。健康是搜索量与信任要求双高的赛道——用户点进健康站点前会先掂量可信度，一个行业专属后缀比杂牌后缀更能传达「正经做健康」的信号；CVS、AXA 等大机构启用 .health 站点也在持续给后缀背书。注册局为 DotHealth，注册约 $11（约 ¥78），续费约 $62/年（约 ¥449）——首年低价引流、续费中高档，预算按续费价核算才稳妥。库存极好：病种词、人群词、服务词几乎都有货。注意三点：一是健康内容受平台与监管双重审视，医疗声明合规比域名本身更关键；二是与已收录 .care/.clinic/.doctor 的分工——机构实体用后三者，泛健康产品与内容平台用 .health 更大气；三是续费 ¥449/年 对个人博客偏贵，轻量内容站可先用温和档后缀起步。命名上「品牌 + .health」适合健康应用与平台，「人群/病种 + .health」直接接住垂直搜索，「企业名 + .health」适合员工健康门户。",
      bestFor: ["数字健康与健康管理应用", "诊所与健康服务机构", "健康科普与营养内容站", "企业员工健康福利平台"],
      namingTips: [
        "「品牌 + .health」适合健康应用与平台门户",
        "首年约 $11、续费约 $62/年，按续费价做预算",
        "医疗声明合规比域名更关键，先把资质做扎实",
        "机构实体用 .clinic/.doctor，平台产品用 .health",
      ],
    },
    en: {
      title: ".health Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".health writes the industry into the address — for digital health and wellness apps, clinics and health services, health education and nutrition content, and corporate wellness platforms. See live pricing and naming advice, then hunt available .health names with AI.",
      intro:
        ".health writes the industry into the address: digital health and wellness apps, clinics and health services, health education and nutrition content sites, corporate wellness platforms on name.health state we're in the health business in the domain itself. Health is a vertical where search volume and trust requirements both run high — users size up credibility before they click, and a category-specific suffix signals serious about health better than a generic one; adoption by CVS, AXA and other large institutions keeps endorsing the suffix. Operated by the DotHealth registry, about $11 to register and $62/yr to renew — a cheap first year with a mid-to-high renewal, so budget on the renewal price. Inventory is excellent: condition words, audience words and service words nearly all hit. Three cautions: health content faces platform and regulatory scrutiny alike, so medical-claim compliance matters more than the domain; split the work with .care, .clinic and .doctor — physical practices fit those, while broad health products and content platforms read bigger on .health; and $62/yr is steep for a personal blog — lightweight content sites can start on a milder suffix. Naming: brand + .health fits health apps and platforms; audience or condition + .health catches vertical searches directly; company name + .health fits employee wellness portals.",
      bestFor: ["Digital health & wellness apps", "Clinics & health services", "Health education & nutrition content", "Corporate wellness platforms"],
      namingTips: [
        "Brand + .health fits health apps and platforms",
        "About $11 year one, $62/yr renewal — budget on renewal",
        "Medical-claim compliance matters more than the domain",
        "Practices fit .clinic/.doctor; platforms read bigger here",
      ],
    },
  },
  fit: {
    tld: "fit",
    zh: {
      title: ".fit 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".fit 把「健身」写进域名，适合健身应用与训练计划工具、私教与线上课程、健身房与工作室、运动穿搭与健康生活内容站。查看 .fit 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .fit 域名。",
      intro:
        ".fit 把状态写进域名：健身应用与训练计划工具、私教与线上课程、健身房与工作室、运动穿搭与健康生活内容站用 name.fit，「变强变健康」的承诺从地址就说清了。fit 是英语里少见的「三字母正能量词」——既是「健康的」也是「合身的」，get fit、stay fit 这类固定搭配让「动词/品牌 + .fit」读起来像一句口号；相比已收录的 .fitness，.fit 短四个音节，App 名与口播场景明显更顺。注册局运营方为 GoDaddy Registry（原 Minds + Machines），注册约 $2（约 ¥15），续费约 $26/年（约 ¥189）——首年白菜价、续费温和档，长期持有无压力。库存极好：动词、人名、训练法词几乎都有货。注意三点：一是首年 $2 的低门槛也吸引过垃圾站，个别平台对 .fit 链接审查稍严，正经做站内容质量要跟上；二是 fit 也有「合身」义，服装电商用它反而一语双关；三是与 .fitness 的分工——工作室实体用全拼更正式，应用与个人品牌用 .fit 更利落。命名上「动词 + .fit」是口号式标准款（get.fit 式），「人名 + .fit」适合私教个人品牌，「品牌 + .fit」适合健身应用与穿搭电商。",
      bestFor: ["健身应用与训练计划工具", "私教与线上课程", "健身房与工作室", "运动穿搭与健康生活内容站"],
      namingTips: [
        "「动词 + .fit」读起来像口号，get.fit 式最顺口",
        "首年约 $2、续费约 $26/年，长期持有无压力",
        "低价后缀曾招垃圾站，内容质量要撑住信任",
        "实体工作室用 .fitness，应用与个人品牌用 .fit",
      ],
    },
    en: {
      title: ".fit Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".fit writes the goal into the address — for fitness apps and training tools, personal trainers and online courses, gyms and studios, and activewear and healthy-living content. See live pricing and naming advice, then hunt available .fit names with AI.",
      intro:
        ".fit writes the goal into the address: fitness apps and training-plan tools, personal trainers and online courses, gyms and studios, activewear and healthy-living content sites on name.fit make the get-stronger promise in the domain itself. fit is that rare three-letter positive word — healthy and well-fitting at once — and fixed phrases like get fit and stay fit make verb or brand + .fit read like a slogan; against the already-listed .fitness, .fit is four syllables shorter, which app names and spoken plugs feel immediately. Operated by GoDaddy Registry (the former Minds + Machines), about $2 to register and $26/yr to renew — a bargain first year with a mild renewal, painless to hold long-term. Inventory is excellent: verbs, first names and training-method words nearly all hit. Three cautions: the $2 door has attracted spam sites before, so some platforms eye .fit links a bit harder — serious sites need content quality to carry trust; fit also means well-fitting, which activewear stores can turn into a double meaning; and split the work with .fitness — physical studios read more formal on the full word, apps and personal brands read snappier on .fit. Naming: verb + .fit is the slogan pattern (think get.fit); first name + .fit fits trainer personal brands; brand + .fit fits fitness apps and activewear stores.",
      bestFor: ["Fitness apps & training tools", "Personal trainers & online courses", "Gyms & studios", "Activewear & healthy-living content"],
      namingTips: [
        "Verb + .fit reads like a slogan — think get.fit",
        "About $2 year one, $26/yr renewal — easy to hold",
        "Cheap door drew spam once; quality carries the trust",
        "Studios fit .fitness; apps and personal brands fit .fit",
      ],
    },
  },
  dance: {
    tld: "dance",
    zh: {
      title: ".dance 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".dance 把「舞蹈」写进域名，适合舞蹈工作室与培训机构、舞者个人主页与作品集、舞蹈赛事与演出团体、线上教程与编舞内容站。查看 .dance 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .dance 域名。",
      intro:
        ".dance 把热爱写进域名：舞蹈工作室与培训机构、舞者个人主页与作品集、舞蹈赛事与演出团体、线上教程与编舞内容站用 name.dance，「跳舞的地方」从地址就说清了。舞蹈是强线下、强社群的行业——学员搜「城市 + 舞种」找课，家长搜机构名核实资质，「机构名 + .dance」两件事一次做完；对街舞、拉丁、芭蕾等垂直舞种，后缀直接把行业身份戴在名字上，比杂牌后缀更有归属感。注册局为 Identity Digital，注册约 $10（约 ¥70），续费约 $22/年（约 ¥159）——温和档，工作室与个人长期持有无压力。库存极好：舞种词、城市词、人名几乎都有货。注意三点：一是舞蹈内容的传播主阵地在抖音/B 站/Instagram，域名的角色是招生报名与档期预订的稳定入口；二是 dance 是英文词，纯中文本地招生可在页面同步中文品牌名；三是与已收录 .studio 的分工——综合艺术空间用 .studio，舞蹈专营用 .dance 语义更锐。命名上「舞种 + 城市 + .dance」直接接住找课搜索，「人名 + .dance」适合舞者个人品牌，「团名 + .dance」适合演出团体与赛事。",
      bestFor: ["舞蹈工作室与培训机构", "舞者个人主页与作品集", "舞蹈赛事与演出团体", "线上教程与编舞内容站"],
      namingTips: [
        "「舞种 + 城市 + .dance」直接接住找课搜索",
        "注册约 $10、续费约 $22/年，长期持有无压力",
        "短视频平台接流量，域名做招生报名稳定入口",
        "综合空间用 .studio，舞蹈专营用 .dance 更锐",
      ],
    },
    en: {
      title: ".dance Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".dance writes the passion into the address — for dance studios and schools, dancer portfolios and personal pages, competitions and performance troupes, and online tutorials and choreography content. See live pricing and naming advice, then hunt available .dance names with AI.",
      intro:
        ".dance writes the passion into the address: dance studios and schools, dancer portfolios and personal pages, competitions and performance troupes, online tutorial and choreography sites on name.dance say this is where the dancing happens in the domain itself. Dance is a local, community-heavy trade — students search city + style for classes and parents search the studio name to vet it, and studio name + .dance answers both at once; for hip-hop, latin, ballet and other verticals, the suffix pins the identity right onto the name with a belonging a generic suffix can't match. Operated by Identity Digital, about $10 to register and $22/yr to renew — the mild tier, painless for studios and dancers to hold long-term. Inventory is excellent: style words, city words and first names nearly all hit. Three cautions: dance content spreads on TikTok, Instagram and similar platforms, so the domain's job is the stable front door for enrollment and bookings; dance is an English word — purely local Chinese enrollment should pair the page with the Chinese brand name; and split the work with the already-listed .studio — multi-art spaces fit .studio, dedicated dance brands read sharper on .dance. Naming: style + city + .dance catches class searches directly; first name + .dance fits dancer personal brands; troupe name + .dance fits companies and competitions.",
      bestFor: ["Dance studios & schools", "Dancer portfolios & personal pages", "Competitions & performance troupes", "Online tutorials & choreography content"],
      namingTips: [
        "Style + city + .dance catches class searches directly",
        "About $10 to register, $22/yr — easy to hold long-term",
        "Platforms bring reach; the domain books enrollments",
        "Multi-art spaces fit .studio; dance brands read sharper here",
      ],
    },
  },
  guide: {
    tld: "guide",
    zh: {
      title: ".guide 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".guide 把「攻略」写进域名，适合旅行攻略与城市指南、购物选品与工具评测指南、新手教程与入门指南站、导游与向导服务预订。查看 .guide 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .guide 域名。",
      intro:
        ".guide 把内容形态写进域名：旅行攻略与城市指南、购物选品与工具评测指南、新手教程与入门指南站、导游与向导服务预订用 name.guide，「这里有攻略」从地址就说清了。guide 是搜索里的高频意图词——「city guide」「buying guide」「beginner's guide」都是用户主动敲进搜索框的词，「主题词 + .guide」让域名本身长得像搜索结果；对 SEO 内容站与联盟营销站，这类语义精准的后缀天然贴合内容定位。注册局为 Identity Digital，注册约 $6（约 ¥44），续费约 $33/年（约 ¥241）——温和档偏上，内容站长期持有无压力。库存极好：城市词、品类词、主题词几乎都有货。注意三点：一是 guide 单数读作「一份指南/一位向导」，内容站用单数正好，聚合平台可斟酌语序；二是攻略内容竞争激烈，域名点题只是起点，内容深度与更新频率才是排名关键；三是与已收录 .tips/.wiki 的分工——零散技巧用 .tips、协作知识库用 .wiki、成体系攻略用 .guide 最正。命名上「城市 + .guide」是旅行站标准款，「品类 + .guide」适合选品评测，「人名 + .guide」适合导游与顾问个人品牌。",
      bestFor: ["旅行攻略与城市指南", "购物选品与工具评测指南", "新手教程与入门指南站", "导游与向导服务预订"],
      namingTips: [
        "「城市/品类 + .guide」让域名长得像搜索结果",
        "注册约 $6、续费约 $33/年，内容站持有无压力",
        "点题只是起点，内容深度才是攻略站排名关键",
        "技巧用 .tips、知识库用 .wiki、成体系用 .guide",
      ],
    },
    en: {
      title: ".guide Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".guide writes the format into the address — for travel and city guides, buying and review guides, beginner tutorials and how-to sites, and tour-guide booking services. See live pricing and naming advice, then hunt available .guide names with AI.",
      intro:
        ".guide writes the format into the address: travel and city guides, buying and review guides, beginner tutorials and how-to sites, tour-guide booking services on name.guide announce the guide is here in the domain itself. guide is a high-frequency intent word — city guide, buying guide and beginner's guide are phrases users type into the search box themselves, so topic + .guide makes the domain look like a search result; for SEO content sites and affiliate plays, few suffixes fit the format this precisely. Operated by Identity Digital, about $6 to register and $33/yr to renew — upper-mild tier, painless for a content site held long-term. Inventory is excellent: city words, category words and topic words nearly all hit. Three cautions: guide is singular and reads as one guide or one person — right for a content site, worth a thought for aggregator platforms; guide content is fiercely competitive, so the on-topic domain is the starting line and depth plus freshness win the rankings; and split the work with the already-listed .tips and .wiki — scattered tricks fit .tips, collaborative knowledge bases fit .wiki, and structured guides aim truest on .guide. Naming: city + .guide is the travel-site standard; category + .guide fits buying and review sites; first name + .guide fits tour guides and consultants.",
      bestFor: ["Travel & city guides", "Buying & review guides", "Beginner tutorials & how-to sites", "Tour-guide booking services"],
      namingTips: [
        "City or category + .guide looks like a search result",
        "About $6 to register, $33/yr — easy for content sites",
        "On-topic is the start; depth and freshness win rankings",
        "Tricks fit .tips, wikis fit .wiki, structured guides here",
      ],
    },
  },
  reviews: {
    tld: "reviews",
    zh: {
      title: ".reviews 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".reviews 把「评测」写进域名，适合产品评测与横向对比站、软件与服务点评平台、影视书籍乐评内容站、本地商家口碑与点评聚合。查看 .reviews 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .reviews 域名。",
      intro:
        ".reviews 把立场写进域名：产品评测与横向对比站、软件与服务点评平台、影视书籍乐评内容站、本地商家口碑与点评聚合用 name.reviews，「看真实评价来这儿」从地址就说清了。「产品名 + reviews」是购买决策前的黄金搜索词——用户掏钱前最后一步就是搜评测，「品类 + .reviews」让域名精准卡进这条搜索路径；对联盟营销与比价内容站，这是少数天生带商业意图的后缀。注册局为 Identity Digital，注册约 $5（约 ¥33），续费约 $50/年（约 ¥360）——首年低价、续费中档，按续费价做预算才稳妥。库存极好：品类词、行业词、场景词几乎都有货。注意三点：一是评测站的生命线是公信力，测评方法透明与利益披露比域名更决定长期口碑；二是 reviews 是复数，读作「一批评价」，聚合与对比站用复数正好，单品深评也不违和；三是与已收录 .guide/.tips 的分工——教你怎么选用 .guide，给你小技巧用 .tips，替你试过再评用 .reviews 立场最鲜明。命名上「品类 + .reviews」直接接住购买前搜索，「行业 + .reviews」适合垂直点评平台，「品牌 + .reviews」适合口碑聚合与用户证言页。",
      bestFor: ["产品评测与横向对比站", "软件与服务点评平台", "影视书籍乐评内容站", "本地商家口碑与点评聚合"],
      namingTips: [
        "「品类 + .reviews」精准卡进购买前搜索路径",
        "首年约 $5、续费约 $50/年，按续费价做预算",
        "公信力是评测站生命线，方法透明比域名重要",
        "选购攻略用 .guide，亲测点评用 .reviews 最鲜明",
      ],
    },
    en: {
      title: ".reviews Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".reviews writes the verdict into the address — for product review and comparison sites, software and service rating platforms, film, book and music criticism, and local business review aggregators. See live pricing and naming advice, then hunt available .reviews names with AI.",
      intro:
        ".reviews writes the verdict into the address: product review and comparison sites, software and service rating platforms, film, book and music criticism, local business review aggregators on name.reviews say honest takes live here in the domain itself. product name + reviews is the golden pre-purchase query — the last thing users search before paying — and category + .reviews parks the domain squarely on that path; for affiliate and comparison content, few suffixes carry commercial intent this natively. Operated by Identity Digital, about $5 to register and $50/yr to renew — a cheap first year with a mid-tier renewal, so budget on the renewal price. Inventory is excellent: category words, industry words and scenario words nearly all hit. Three cautions: a review site lives or dies on credibility, so transparent methodology and disclosed affiliations shape the reputation more than the domain; reviews is plural and reads as a body of verdicts — right for aggregators and comparisons, and fine for single-product deep dives too; and split the work with the already-listed .guide and .tips — how-to-choose fits .guide, quick tricks fit .tips, and we-tested-it verdicts stand sharpest on .reviews. Naming: category + .reviews catches pre-purchase searches directly; industry + .reviews fits vertical rating platforms; brand + .reviews fits testimonial and reputation pages.",
      bestFor: ["Product review & comparison sites", "Software & service rating platforms", "Film, book & music criticism", "Local business review aggregators"],
      namingTips: [
        "Category + .reviews catches pre-purchase searches",
        "About $5 year one, $50/yr renewal — budget on renewal",
        "Credibility is the lifeline; methodology beats the domain",
        "How-to-choose fits .guide; tested verdicts stand here",
      ],
    },
  },
  golf: {
    tld: "golf",
    zh: {
      title: ".golf 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".golf 把「高尔夫」写进域名，适合高尔夫球场与练习场、教练与青少年培训、球具装备电商、赛事与差点管理工具。查看 .golf 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .golf 域名。",
      intro:
        ".golf 把球场写进域名：高尔夫球场与练习场、教练与青少年培训、球具装备电商、赛事与差点管理工具用 name.golf，「打球来这儿」的定位从地址就说清了。高尔夫是客单价与搜索意图双高的行业——球友搜「城市 + golf」订场，家长搜教练名核实资质，「场地名 + .golf」比杂牌后缀更像正经球场官网；对球具电商与订场平台，后缀本身就是品类词，省掉域名里再塞一遍 golf 的冗余。注册局为 Identity Digital，注册约 $5（约 ¥33），续费约 $52/年（约 ¥374）——首年低价、续费中高档，按续费价核算预算才稳妥。库存极好：城市词、球场词、人名几乎都有货。注意三点：一是续费 ¥374/年 对个人球友博客偏贵，轻量内容站可先用温和档后缀起步；二是 golf 是全球通用词，面向国内学员的页面记得同步中文品牌名；三是与已收录 .club 的分工——会员制俱乐部社群用 .club，球场与教学业务用 .golf 品类更锐。命名上「城市 + .golf」直接接住订场搜索，「人名 + .golf」适合教练个人品牌，「品牌 + .golf」适合球具电商与赛事平台。",
      bestFor: ["高尔夫球场与练习场", "教练与青少年培训", "球具装备电商", "赛事与差点管理工具"],
      namingTips: [
        "「城市 + .golf」直接接住订场与找场搜索",
        "首年约 $5、续费约 $52/年，按续费价做预算",
        "面向国内学员的页面同步中文品牌名更稳",
        "会员社群用 .club，球场与教学用 .golf 更锐",
      ],
    },
    en: {
      title: ".golf Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".golf writes the course into the address — for golf courses and driving ranges, coaches and junior academies, club and gear stores, and tournament and handicap tools. See live pricing and naming advice, then hunt available .golf names with AI.",
      intro:
        ".golf writes the course into the address: golf courses and driving ranges, coaches and junior academies, club and gear stores, tournament and handicap tools on name.golf say this is where the golf happens in the domain itself. Golf is a vertical where ticket size and search intent both run high — players search city + golf to book tee times and parents search the coach's name to vet credentials, and course name + .golf reads like a proper club site where a generic suffix wouldn't; for gear stores and booking platforms the suffix is the category word, sparing the name from carrying golf twice. Operated by Identity Digital, about $5 to register and $52/yr to renew — a cheap first year with a mid-to-high renewal, so budget on the renewal price. Inventory is excellent: city words, course words and first names nearly all hit. Three cautions: $52/yr is steep for a personal golf blog — lightweight content sites can start on a milder suffix; golf is a global word, so pages aimed at local students should pair the local brand name; and split the work with the already-listed .club — membership communities fit .club, courses and coaching read sharper on .golf. Naming: city + .golf catches tee-time searches directly; first name + .golf fits coach personal brands; brand + .golf fits gear stores and tournament platforms.",
      bestFor: ["Golf courses & driving ranges", "Coaches & junior academies", "Club & gear stores", "Tournament & handicap tools"],
      namingTips: [
        "City + .golf catches tee-time and course searches",
        "About $5 year one, $52/yr renewal — budget on renewal",
        "Pair a local brand name for local-student pages",
        "Communities fit .club; courses read sharper on .golf",
      ],
    },
  },
  tennis: {
    tld: "tennis",
    zh: {
      title: ".tennis 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".tennis 把「网球」写进域名，适合网球俱乐部与场馆订场、教练与青少年培训、球拍球线装备电商、赛事组织与约球社区。查看 .tennis 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .tennis 域名。",
      intro:
        ".tennis 把球拍写进域名：网球俱乐部与场馆订场、教练与青少年培训、球拍球线装备电商、赛事组织与约球社区用 name.tennis，「打网球来这儿」从地址就说清了。网球是强本地、强教学的运动——学员搜「城市 + tennis」找课订场，「俱乐部名 + .tennis」一眼就是网球场馆官网；穿线师与装备店用品类后缀，域名主体留给品牌名，比在杂牌后缀里塞 tennis 更利落。注册局为 Identity Digital，注册约 $52（约 ¥374），续费约 $52/年（约 ¥374）——注册续费同价，无「首年低价钓鱼」问题，报价即长期成本，但绝对价位属中高档，适合正经经营的场馆与品牌而非试水项目。库存极好：城市词、俱乐部词、人名几乎都有货。注意三点：一是同价意味着第一年就按长期成本决策，预算敏感可先用 .club 起步；二是 tennis 是全球通用词，本地招生页面同步中文品牌名；三是与已收录 .coach 的分工——教练个人品牌用 .coach 更通用，场馆与俱乐部用 .tennis 品类更明确。命名上「城市 + .tennis」直接接住找课订场搜索，「俱乐部名 + .tennis」适合场馆官网，「品牌 + .tennis」适合装备电商与赛事平台。",
      bestFor: ["网球俱乐部与场馆订场", "教练与青少年培训", "球拍球线装备电商", "赛事组织与约球社区"],
      namingTips: [
        "「城市 + .tennis」直接接住找课与订场搜索",
        "注册续费同价约 $52/年，首年就按长期成本决策",
        "预算敏感可先用 .club 起步，正经场馆再上",
        "教练个人品牌用 .coach，场馆俱乐部用 .tennis",
      ],
    },
    en: {
      title: ".tennis Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".tennis writes the racquet into the address — for tennis clubs and court booking, coaches and junior programs, racquet and string stores, and leagues and hitting-partner communities. See live pricing and naming advice, then hunt available .tennis names with AI.",
      intro:
        ".tennis writes the racquet into the address: tennis clubs and court booking, coaches and junior programs, racquet and string stores, leagues and hitting-partner communities on name.tennis say this is where the tennis happens in the domain itself. Tennis is a local, lesson-heavy sport — students search city + tennis for classes and courts, and club name + .tennis reads instantly as a club's official site; stringers and gear stores get the category from the suffix and keep the name for the brand, cleaner than stuffing tennis into a generic domain. Operated by Identity Digital, about $52 to register and $52/yr to renew — same price both years, no first-year teaser, so the quote is the long-term cost; the absolute tier is mid-to-high, right for operating clubs and brands rather than trial projects. Inventory is excellent: city words, club words and first names nearly all hit. Three cautions: flat pricing means deciding on long-term cost from day one — budget-sensitive projects can start on .club; tennis is a global word, so local enrollment pages should pair the local brand name; and split the work with the already-listed .coach — coach personal brands read broader on .coach, clubs and venues read more specific on .tennis. Naming: city + .tennis catches class and court searches directly; club name + .tennis fits venue sites; brand + .tennis fits gear stores and league platforms.",
      bestFor: ["Tennis clubs & court booking", "Coaches & junior programs", "Racquet & string stores", "Leagues & hitting-partner communities"],
      namingTips: [
        "City + .tennis catches class and court searches",
        "Same $52 to register and renew — no teaser trap",
        "Budget-sensitive projects can start on .club first",
        "Coach brands fit .coach; clubs read sharper here",
      ],
    },
  },
  soccer: {
    tld: "soccer",
    zh: {
      title: ".soccer 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".soccer 把「足球」写进域名，适合青训机构与足球学校、业余球队与联赛组织、球迷内容与战术分析站、球衣装备电商。查看 .soccer 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .soccer 域名。",
      intro:
        ".soccer 把绿茵场写进域名：青训机构与足球学校、业余球队与联赛组织、球迷内容与战术分析站、球衣装备电商用 name.soccer，「踢球来这儿」从地址就说清了。足球是全球第一运动，青训是家长掏钱的刚需赛道——家长搜「城市 + 足球青训」找机构，「机构名 + .soccer」比杂牌后缀更像正经足球学校；美式语境里 soccer 专指足球不与橄榄球混淆，面向北美市场尤其顺。注册局为 Identity Digital，注册约 $11（约 ¥78），续费约 $21/年（约 ¥152）——温和档，球队与机构长期持有无压力。库存极好：城市词、队名词、青训词几乎都有货。注意三点：一是英式语境更习惯 football，主打欧洲市场可对比同价的 .football 选更顺口的那个；二是球迷内容的主阵地在短视频与社区平台，域名的角色是招生报名与赛程报名的稳定入口；三是与已收录 .team 的分工——泛团队协作用 .team，足球专营用 .soccer 品类更锐。命名上「城市 + .soccer」直接接住找青训搜索，「队名 + .soccer」适合球队与联赛官网，「品牌 + .soccer」适合装备电商与内容站。",
      bestFor: ["青训机构与足球学校", "业余球队与联赛组织", "球迷内容与战术分析站", "球衣装备电商"],
      namingTips: [
        "「城市 + .soccer」直接接住青训与找队搜索",
        "注册约 $11、续费约 $21/年，长期持有无压力",
        "北美市场用 soccer，欧洲市场可对比 .football",
        "泛团队用 .team，足球专营用 .soccer 更锐",
      ],
    },
    en: {
      title: ".soccer Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".soccer writes the pitch into the address — for youth academies and soccer schools, amateur clubs and leagues, fan content and tactics sites, and jersey and gear stores. See live pricing and naming advice, then hunt available .soccer names with AI.",
      intro:
        ".soccer writes the pitch into the address: youth academies and soccer schools, amateur clubs and leagues, fan content and tactics analysis sites, jersey and gear stores on name.soccer say this is where the game lives in the domain itself. Soccer is the world's biggest sport and youth training is a category parents pay for — they search city + youth soccer to find academies, and academy name + .soccer reads like a proper soccer school where a generic suffix wouldn't; in American English soccer is unambiguous, which makes the suffix especially smooth for North American audiences. Operated by Identity Digital, about $11 to register and $21/yr to renew — the mild tier, painless for clubs and academies to hold long-term. Inventory is excellent: city words, club names and training words nearly all hit. Three cautions: British English says football, so Europe-facing projects should compare the same-priced .football and pick whichever reads natural; fan content spreads on video and community platforms, so the domain's job is the stable front door for enrollment and fixtures; and split the work with the already-listed .team — general teamwork fits .team, dedicated soccer brands read sharper on .soccer. Naming: city + .soccer catches academy searches directly; club name + .soccer fits team and league sites; brand + .soccer fits gear stores and content sites.",
      bestFor: ["Youth academies & soccer schools", "Amateur clubs & leagues", "Fan content & tactics sites", "Jersey & gear stores"],
      namingTips: [
        "City + .soccer catches academy and team searches",
        "About $11 year one, $21/yr renewal — easy to hold",
        "US says soccer; Europe-facing projects compare .football",
        "Teamwork fits .team; soccer brands read sharper here",
      ],
    },
  },
  football: {
    tld: "football",
    zh: {
      title: ".football 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".football 把「足球」写进域名，适合足球俱乐部与球迷会、青训营与球员经纪、赛事资讯与数据分析站、球场预订与约球平台。查看 .football 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .football 域名。",
      intro:
        ".football 把主队写进域名：足球俱乐部与球迷会、青训营与球员经纪、赛事资讯与数据分析站、球场预订与约球平台用 name.football，「为足球而生」从地址就说清了。football 是英式与全球大多数市场对足球的称呼——欧洲、南美、亚非球迷搜索用的都是这个词，「俱乐部名 + .football」对国际球迷比 .soccer 更自然；对球迷会与自媒体，后缀本身就是身份宣言，比杂牌后缀更有归属感。注册局为 Identity Digital，注册约 $11（约 ¥78），续费约 $21/年（约 ¥152）——温和档，俱乐部与球迷会长期持有无压力。库存极好：队名词、城市词、联赛词几乎都有货。注意三点：一是美式语境里 football 指橄榄球，主打北美市场可对比同价的 .soccer 避免歧义；二是涉及俱乐部徽标与赛事名的商标授权要先厘清，球迷站标明非官方身份更稳；三是与已收录 .games 的分工——泛游戏娱乐用 .games，足球垂直用 .football 语义更准。命名上「队名/城市 + .football」适合俱乐部与球迷会，「联赛 + .football」适合赛事资讯站，「品牌 + .football」适合订场与数据平台。",
      bestFor: ["足球俱乐部与球迷会", "青训营与球员经纪", "赛事资讯与数据分析站", "球场预订与约球平台"],
      namingTips: [
        "「队名/城市 + .football」是俱乐部与球迷会标准款",
        "注册约 $11、续费约 $21/年，长期持有无压力",
        "北美语境 football 指橄榄球，可对比 .soccer",
        "球迷站标明非官方身份，商标授权先厘清",
      ],
    },
    en: {
      title: ".football Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".football writes the club into the address — for football clubs and supporter groups, youth camps and player agencies, fixtures and analytics sites, and pitch booking and pickup platforms. See live pricing and naming advice, then hunt available .football names with AI.",
      intro:
        ".football writes the club into the address: football clubs and supporter groups, youth camps and player agencies, fixtures and analytics sites, pitch booking and pickup platforms on name.football declare made for the game in the domain itself. football is what most of the world calls the sport — fans in Europe, South America, Asia and Africa all search with this word, so club name + .football reads more natural to an international audience than .soccer; for supporter groups and fan media the suffix is an identity statement with a belonging a generic suffix can't match. Operated by Identity Digital, about $11 to register and $21/yr to renew — the mild tier, painless for clubs and fan groups to hold long-term. Inventory is excellent: club names, city words and league words nearly all hit. Three cautions: in American English football means the gridiron game, so North America-facing projects should compare the same-priced .soccer to avoid ambiguity; club crests and competition names carry trademark weight, so fan sites should state their unofficial status and clear licensing first; and split the work with the already-listed .games — general gaming fits .games, football verticals read truer on .football. Naming: club or city + .football fits clubs and supporter groups; league + .football fits fixtures and news sites; brand + .football fits booking and analytics platforms.",
      bestFor: ["Football clubs & supporter groups", "Youth camps & player agencies", "Fixtures & analytics sites", "Pitch booking & pickup platforms"],
      namingTips: [
        "Club or city + .football is the supporter standard",
        "About $11 year one, $21/yr renewal — easy to hold",
        "US reads football as gridiron; compare .soccer there",
        "Fan sites: state unofficial status, clear trademarks",
      ],
    },
  },
  hockey: {
    tld: "hockey",
    zh: {
      title: ".hockey 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".hockey 把「冰球」写进域名，适合冰球俱乐部与青训营、冰场与训练设施、球杆护具装备电商、联赛资讯与球迷社区。查看 .hockey 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .hockey 域名。",
      intro:
        ".hockey 把冰场写进域名：冰球俱乐部与青训营、冰场与训练设施、球杆护具装备电商、联赛资讯与球迷社区用 name.hockey，「打冰球来这儿」从地址就说清了。冰球在北美、北欧与俄罗斯是国民运动，国内冰雪运动也在政策带动下快速升温——家长搜「城市 + 冰球培训」找俱乐部，「俱乐部名 + .hockey」比杂牌后缀更像正经冰球机构；装备电商用品类后缀，域名主体留给品牌名。注册局为 Identity Digital，注册约 $8（约 ¥59），续费约 $48/年（约 ¥345）——首年低价、续费中高档，按续费价核算预算才稳妥。库存极好：城市词、队名词、装备词几乎都有货。注意三点：一是 hockey 在英联邦部分地区默认指曲棍球（field hockey），面向这些市场时页面要说清冰球还是曲棍球；二是续费 ¥345/年 对个人球迷博客偏贵，轻量内容站可先用温和档后缀起步；三是与已收录 .club 的分工——综合体育社群用 .club，冰球专营用 .hockey 品类更锐。命名上「城市 + .hockey」直接接住找俱乐部搜索，「队名 + .hockey」适合球队与联赛官网，「品牌 + .hockey」适合装备电商与冰场平台。",
      bestFor: ["冰球俱乐部与青训营", "冰场与训练设施", "球杆护具装备电商", "联赛资讯与球迷社区"],
      namingTips: [
        "「城市 + .hockey」直接接住找俱乐部搜索",
        "首年约 $8、续费约 $48/年，按续费价做预算",
        "英联邦部分市场 hockey 默认曲棍球，页面说清",
        "综合社群用 .club，冰球专营用 .hockey 更锐",
      ],
    },
    en: {
      title: ".hockey Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".hockey writes the rink into the address — for hockey clubs and youth programs, rinks and training facilities, stick and gear stores, and league news and fan communities. See live pricing and naming advice, then hunt available .hockey names with AI.",
      intro:
        ".hockey writes the rink into the address: hockey clubs and youth programs, rinks and training facilities, stick and gear stores, league news and fan communities on name.hockey say this is where the hockey happens in the domain itself. Hockey is a national sport across North America, the Nordics and Russia — parents search city + youth hockey to find clubs, and club name + .hockey reads like a proper hockey organization where a generic suffix wouldn't; gear stores get the category from the suffix and keep the name for the brand. Operated by Identity Digital, about $8 to register and $48/yr to renew — a cheap first year with a mid-to-high renewal, so budget on the renewal price. Inventory is excellent: city words, team names and gear words nearly all hit. Three cautions: in parts of the Commonwealth hockey defaults to field hockey, so pages facing those markets should say which game; $48/yr is steep for a personal fan blog — lightweight content sites can start on a milder suffix; and split the work with the already-listed .club — general sports communities fit .club, dedicated hockey brands read sharper on .hockey. Naming: city + .hockey catches club searches directly; team name + .hockey fits club and league sites; brand + .hockey fits gear stores and rink platforms.",
      bestFor: ["Hockey clubs & youth programs", "Rinks & training facilities", "Stick & gear stores", "League news & fan communities"],
      namingTips: [
        "City + .hockey catches club and program searches",
        "About $8 year one, $48/yr renewal — budget on renewal",
        "Commonwealth markets may read field hockey — clarify",
        "Communities fit .club; hockey brands read sharper here",
      ],
    },
  },
  surf: {
    tld: "surf",
    zh: {
      title: ".surf 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".surf 把「冲浪」写进域名，适合冲浪学校与教练、冲浪营地与海边民宿、浪板装备电商、浪况预报与冲浪内容站。查看 .surf 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .surf 域名。",
      intro:
        ".surf 把海浪写进域名：冲浪学校与教练、冲浪营地与海边民宿、浪板装备电商、浪况预报与冲浪内容站用 name.surf，「下水来这儿」从地址就说清了。冲浪是强目的地、强生活方式的运动——浪人搜「海滩 + surf」找学校订营地，「地名 + .surf」比杂牌后缀更像本地浪店；surf 同时还有「上网冲浪」的双关义，浏览器工具与网页产品也能借它玩出彩。注册局运营方为 GoDaddy Registry（原 Minds + Machines），注册约 $2（约 ¥11），续费约 $26/年（约 ¥189）——首年白菜价、续费温和档，长期持有无压力。库存极好：海滩词、地名、品牌词几乎都有货。注意三点：一是首年超低价也吸引过垃圾站，个别平台对超低价后缀审查稍严，正经做站内容质量要跟上；二是国内冲浪聚集在万宁、后海等目的地，本地招生页面同步中文品牌名更稳；三是与已收录 .fun 的分工——泛娱乐用 .fun，冲浪垂直用 .surf 品类更锐。命名上「海滩/地名 + .surf」直接接住找学校搜索，「品牌 + .surf」适合装备电商与预报工具，「动词短语 + .surf」适合网页产品的双关玩法。",
      bestFor: ["冲浪学校与教练", "冲浪营地与海边民宿", "浪板装备电商", "浪况预报与冲浪内容站"],
      namingTips: [
        "「海滩/地名 + .surf」直接接住找学校搜索",
        "首年约 $2、续费约 $26/年，长期持有无压力",
        "超低价后缀曾招垃圾站，内容质量要撑住信任",
        "泛娱乐用 .fun，冲浪垂直用 .surf 更锐",
      ],
    },
    en: {
      title: ".surf Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".surf writes the wave into the address — for surf schools and instructors, surf camps and beach stays, board and gear stores, and surf forecasts and content sites. See live pricing and naming advice, then hunt available .surf names with AI.",
      intro:
        ".surf writes the wave into the address: surf schools and instructors, surf camps and beach stays, board and gear stores, surf forecast and content sites on name.surf say paddle out here in the domain itself. Surfing is a destination-driven lifestyle sport — surfers search beach + surf for schools and camps, and place name + .surf reads like the local surf shop where a generic suffix wouldn't; surf also carries the browse-the-web double meaning, which browser tools and web products can play to great effect. Operated by GoDaddy Registry (the former Minds + Machines), about $2 to register and $26/yr to renew — a bargain first year with a mild renewal, painless to hold long-term. Inventory is excellent: beach words, place names and brand words nearly all hit. Three cautions: the ultra-cheap first year has attracted spam sites before, so some platforms eye bargain suffixes a bit harder — serious sites need content quality to carry trust; surf scenes cluster around destinations, so local-enrollment pages should pair the local brand name; and split the work with the already-listed .fun — general entertainment fits .fun, surf verticals read sharper on .surf. Naming: beach or place + .surf catches school searches directly; brand + .surf fits gear stores and forecast tools; verb phrase + .surf fits web products playing the double meaning.",
      bestFor: ["Surf schools & instructors", "Surf camps & beach stays", "Board & gear stores", "Surf forecasts & content sites"],
      namingTips: [
        "Beach or place + .surf catches school searches",
        "About $2 year one, $26/yr renewal — easy to hold",
        "Cheap door drew spam once; quality carries the trust",
        "Fun fits .fun; surf verticals read sharper here",
      ],
    },
  },
  ltd: {
    tld: "ltd",
    zh: {
      title: ".ltd 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".ltd 把「有限公司」写进域名，适合中小企业与有限公司官网、创业公司品牌站、咨询与专业服务公司、集团子公司与新业务线。查看 .ltd 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .ltd 域名。",
      intro:
        ".ltd 把公司抬头写进域名：中小企业与有限公司官网、创业公司品牌站、咨询与专业服务公司、集团子公司与新业务线用 name.ltd，「我们是正经注册的公司」从地址就说清了。ltd 是 limited（有限公司）的全球通用缩写——英联邦与中国的公司名里天天见，「公司名 + .ltd」与营业执照上的抬头天然对齐，比杂牌后缀更像官网；对 .com 被占的公司名，.ltd 是语义最贴的替代之一。注册局为 Identity Digital，注册约 $6（约 ¥41），续费约 $25/年（约 ¥182）——首年低价、续费温和档，公司官网长期持有无压力。库存极好：公司名、行业词、拼音组合几乎都有货。注意三点：一是美国公司更习惯 .llc / .inc 抬头，主打美国市场可对比 .llc；二是 .ltd 语义就是「公司官网」，内容站与个人项目用它反而别扭；三是与已收录 .company 的分工——.company 更泛更长，.ltd 更短更像注册抬头。命名上「公司名 + .ltd」是标准款，「品牌 + .ltd」适合创业公司主站，「业务线 + .ltd」适合集团子公司与新业务独立站。",
      bestFor: ["中小企业与有限公司官网", "创业公司品牌站", "咨询与专业服务公司", "集团子公司与新业务线"],
      namingTips: [
        "「公司名 + .ltd」与营业执照抬头天然对齐",
        "首年约 $6、续费约 $25/年，长期持有无压力",
        "主打美国市场可对比 .llc / .inc 抬头",
        ".company 更泛更长，.ltd 更短更像注册抬头",
      ],
    },
    en: {
      title: ".ltd Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".ltd writes the company into the address — for SME and limited-company sites, startup brand homes, consulting and professional-services firms, and group subsidiaries and new business lines. See live pricing and naming advice, then hunt available .ltd names with AI.",
      intro:
        ".ltd writes the letterhead into the address: SME and limited-company sites, startup brand homes, consulting and professional-services firms, group subsidiaries and new business lines on name.ltd say we are a properly registered company in the domain itself. ltd is the global shorthand for limited company — it appears in company names across the Commonwealth and beyond, so company name + .ltd lines up naturally with the legal name on the certificate and reads like an official site where a generic suffix wouldn't; when the .com is taken, .ltd is one of the most on-brand fallbacks for a company name. Operated by Identity Digital, about $6 to register and $25/yr to renew — a cheap first year with a mild renewal, painless for a company site to hold long-term. Inventory is excellent: company names, trade words and name combinations nearly all hit. Three cautions: US companies lean .llc or .inc, so America-facing brands should compare .llc; .ltd means company site, so content projects and personal pages read awkward on it; and split the work with the already-listed .company — .company is broader and longer, .ltd is shorter and closer to the legal letterhead. Naming: company name + .ltd is the standard; brand + .ltd fits startup main sites; business line + .ltd fits group subsidiaries and spin-offs.",
      bestFor: ["SME & limited-company sites", "Startup brand homes", "Consulting & professional-services firms", "Group subsidiaries & new business lines"],
      namingTips: [
        "Company name + .ltd matches the legal letterhead",
        "About $6 year one, $25/yr renewal — easy to hold",
        "America-facing brands should compare .llc or .inc",
        ".company reads broader; .ltd reads like the certificate",
      ],
    },
  },
  biz: {
    tld: "biz",
    zh: {
      title: ".biz 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".biz 把「生意」写进域名，适合中小企业与本地商家官网、外贸与 B2B 业务站、副业与个体经营项目、企业信息与联系页。查看 .biz 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .biz 域名。",
      intro:
        ".biz 把生意写进域名：中小企业与本地商家官网、外贸与 B2B 业务站、副业与个体经营项目、企业信息与联系页用 name.biz，「这里做生意」从地址就说清了。.biz 是 2001 年就开放的老牌 gTLD——比一众新顶级域早十几年，全球注册商与邮箱系统支持度拉满，认知稳定不怕「这是什么后缀」的疑问；business 的缩写语义对外贸与 B2B 尤其直白，海外客户一眼读懂。注册局为 GoDaddy Registry（原 Neustar），注册约 $7（约 ¥48），续费约 $19/年（约 ¥137）——注册续费都在温和档，是本批公司类后缀里长期成本最低的。库存极好：.com 里早被占光的短公司名、行业词在 .biz 大量有货。注意三点：一是 .biz 早年被垃圾邮件站用得多，信任分低于 .com，正经官网内容与 HTTPS 要跟上；二是它气质偏「实用生意」而非「品牌调性」，融资导向的创业公司更适合 .co / .ltd；三是与已收录 .company 的分工——正式公司抬头用 .company / .ltd，个体生意与副业项目用 .biz 更轻。命名上「公司名 + .biz」是标准款，「行业词 + .biz」适合外贸与 B2B 获客站，「人名 + .biz」适合个体经营与副业项目。",
      bestFor: ["中小企业与本地商家官网", "外贸与 B2B 业务站", "副业与个体经营项目", "企业信息与联系页"],
      namingTips: [
        "「公司名/行业词 + .biz」直白接住生意语义",
        "注册约 $7、续费约 $19/年，长期成本极低",
        "早年垃圾站拉低信任分，内容与 HTTPS 要跟上",
        "品牌调性用 .co/.ltd，实用生意用 .biz 更轻",
      ],
    },
    en: {
      title: ".biz Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".biz writes the business into the address — for SME and local-business sites, trade and B2B ventures, side businesses and sole proprietors, and company info and contact pages. See live pricing and naming advice, then hunt available .biz names with AI.",
      intro:
        ".biz writes the business into the address: SME and local-business sites, trade and B2B ventures, side businesses and sole proprietors, company info and contact pages on name.biz say this is where business gets done in the domain itself. .biz is a 2001-vintage gTLD — live more than a decade before the new-TLD wave, with universal registrar and email support and none of the what suffix is that hesitation; the business shorthand reads instantly to overseas clients, which suits trade and B2B especially well. Operated by GoDaddy Registry (the former Neustar), about $7 to register and $19/yr to renew — mild tier both years, the cheapest long-term hold among company-style suffixes. Inventory is excellent: short company names and trade words long gone on .com are widely open on .biz. Three cautions: early spam abuse left .biz with less trust than .com, so serious sites need real content and HTTPS to carry it; its vibe is practical business rather than brand polish — funding-track startups read better on .co or .ltd; and split the work with the already-listed .company — formal letterheads fit .company or .ltd, solo ventures and side businesses travel lighter on .biz. Naming: company name + .biz is the standard; trade word + .biz fits B2B lead-gen sites; personal name + .biz fits sole proprietors and side projects.",
      bestFor: ["SME & local-business sites", "Trade & B2B ventures", "Side businesses & sole proprietors", "Company info & contact pages"],
      namingTips: [
        "Company or trade word + .biz reads business instantly",
        "About $7 year one, $19/yr renewal — cheapest to hold",
        "Early spam history: real content and HTTPS carry trust",
        "Brand polish fits .co/.ltd; practical business fits .biz",
      ],
    },
  },
  llc: {
    tld: "llc",
    zh: {
      title: ".llc 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".llc 把「美国 LLC」写进域名，适合美国注册的 LLC 公司官网、跨境电商美国主体站、创业公司与合伙企业、自由职业者公司化品牌。查看 .llc 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .llc 域名。",
      intro:
        ".llc 把公司实体写进域名：美国注册的 LLC 公司官网、跨境电商美国主体站、创业公司与合伙企业、自由职业者公司化品牌用 name.llc，「我们是正经注册的 LLC」从地址就说清了。LLC（有限责任公司）是美国最常见的公司形态——跨境卖家开美国主体、独立开发者接美元收款都绕不开它，「公司名 + .llc」与注册文件上的抬头一字不差，对美国客户与平台审核尤其有说服力；.com 被占时它是公司站语义最准的替代。注册局为 Identity Digital，注册约 $11（约 ¥78），续费约 $35/年（约 ¥248）——中档价位，正经经营的公司持有无压力。库存极好：公司名、创始人姓氏、行业词几乎都有货。注意三点：一是后缀语义强绑定美国 LLC 形态，没注册 LLC 的主体用它容易名实不符，先落地注册再上域名；二是同类的 .inc 注册续费超 $250/年 贵一个数量级，预算内 .llc 是更现实的抬头后缀；三是与本批 .ltd 的分工——英联邦/中国语境的有限公司用 .ltd，美国 LLC 用 .llc，按注册地选。命名上「公司名 + .llc」是标准款，「姓氏 + .llc」适合家族与合伙企业，「品牌 + .llc」适合跨境电商美国主体站。",
      bestFor: ["美国注册的 LLC 公司官网", "跨境电商美国主体站", "创业公司与合伙企业", "自由职业者公司化品牌"],
      namingTips: [
        "「公司名 + .llc」与注册文件抬头一字不差",
        "注册约 $11、续费约 $35/年，中档持有无压力",
        "先注册 LLC 再上域名，避免名实不符",
        "英联邦有限公司用 .ltd，美国 LLC 用 .llc",
      ],
    },
    en: {
      title: ".llc Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".llc writes the entity into the address — for registered LLC company sites, cross-border sellers with US entities, startups and partnerships, and freelancers going corporate. See live pricing and naming advice, then hunt available .llc names with AI.",
      intro:
        ".llc writes the entity into the address: registered LLC company sites, cross-border sellers with US entities, startups and partnerships, freelancers going corporate on name.llc say we are a properly formed LLC in the domain itself. The LLC is America's default company form — cross-border sellers opening US entities and indie developers billing in dollars all end up with one, and company name + .llc matches the formation papers letter for letter, which lands especially well with US clients and platform reviews; when the .com is taken it is the most on-point fallback for a company site. Operated by Identity Digital, about $11 to register and $35/yr to renew — mid tier, painless for an operating company to hold. Inventory is excellent: company names, founder surnames and trade words nearly all hit. Three cautions: the suffix is tightly bound to the US LLC form — using it without an actual LLC invites a mismatch, so form the entity first; the sibling .inc runs past $250/yr, an order of magnitude dearer, making .llc the realistic letterhead suffix on a budget; and split the work with this batch's .ltd — Commonwealth-style limited companies fit .ltd, US LLCs fit .llc, pick by where you're registered. Naming: company name + .llc is the standard; surname + .llc fits family firms and partnerships; brand + .llc fits cross-border sellers' US-entity sites.",
      bestFor: ["Registered LLC company sites", "Cross-border sellers with US entities", "Startups & partnerships", "Freelancers going corporate"],
      namingTips: [
        "Company name + .llc matches the formation papers",
        "About $11 year one, $35/yr renewal — mid-tier hold",
        "Form the LLC first; the suffix implies the entity",
        "Commonwealth firms fit .ltd; US LLCs fit .llc",
      ],
    },
  },
  fyi: {
    tld: "fyi",
    zh: {
      title: ".fyi 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".fyi 把「供你参考」写进域名，适合产品文档与帮助中心、行业资讯与科普站、更新日志与状态页、指南与速查手册站。查看 .fyi 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .fyi 域名。",
      intro:
        ".fyi 把「供你参考」写进域名：产品文档与帮助中心、行业资讯与科普站、更新日志与状态页、指南与速查手册站用 name.fyi，「进来看信息」从地址就说清了。fyi（for your information）是英文里最日常的信息前缀——docs.fyi、changelog.fyi 这类组合读起来就是一句话，比杂牌后缀更有「轻快信息站」的气质；对主站在 .com 的产品，用 .fyi 挂文档与状态页还能天然区分主站与信息站的定位。注册局为 Identity Digital，注册约 $6（约 ¥41），续费约 $6/年（约 ¥41）——注册续费同价且都是白菜档，无「首年低价钓鱼」问题，是本批里最省心的长期持有。库存极好：话题词、产品词、动词短语几乎都有货。注意三点：一是语义就是「轻量信息」，公司官网与电商主站用它撑不起正式感；二是 fyi 是英文缩写，纯中文受众站点要在页面说清定位；三是与已收录 .info / .wiki 的分工——正式信息站用 .info，协作知识库用 .wiki，轻快速查与文档用 .fyi 更俏。命名上「话题词 + .fyi」直接接住科普与速查搜索，「产品名 + .fyi」适合文档与更新日志站，「动词短语 + .fyi」适合工具化的信息查询站。",
      bestFor: ["产品文档与帮助中心", "行业资讯与科普站", "更新日志与状态页", "指南与速查手册站"],
      namingTips: [
        "「话题词/产品名 + .fyi」直接接住速查搜索",
        "注册续费同价约 $6/年，本批最省心的长期持有",
        "语义偏轻量信息，公司主站用 .ltd/.com 更正式",
        "正式信息用 .info，知识库用 .wiki，速查用 .fyi",
      ],
    },
    en: {
      title: ".fyi Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".fyi writes the heads-up into the address — for product docs and help centers, industry explainers and info sites, changelogs and status pages, and guides and cheat-sheet sites. See live pricing and naming advice, then hunt available .fyi names with AI.",
      intro:
        ".fyi writes the heads-up into the address: product docs and help centers, industry explainers and info sites, changelogs and status pages, guides and cheat-sheet sites on name.fyi say come here for the facts in the domain itself. fyi is everyday English for for your information — combinations like docs.fyi or changelog.fyi read as a sentence, with a light informational vibe a generic suffix can't match; products living on .com can hang docs and status pages on .fyi and get a natural split between the main site and the info site. Operated by Identity Digital, about $6 to register and $6/yr to renew — flat bargain pricing with no first-year teaser, the most carefree long-term hold in this batch. Inventory is excellent: topic words, product names and verb phrases nearly all hit. Three cautions: the semantics are light information, so company homepages and storefronts can't lean on it for formality; fyi is an English abbreviation, so purely non-English audiences may need the positioning spelled out on the page; and split the work with the already-listed .info and .wiki — formal reference fits .info, collaborative knowledge bases fit .wiki, quick lookups and docs read snappier on .fyi. Naming: topic + .fyi catches explainer and lookup searches directly; product name + .fyi fits docs and changelog sites; verb phrase + .fyi fits tool-style lookup sites.",
      bestFor: ["Product docs & help centers", "Industry explainers & info sites", "Changelogs & status pages", "Guides & cheat-sheet sites"],
      namingTips: [
        "Topic or product + .fyi catches lookup searches",
        "Flat $6 to register and renew — carefree to hold",
        "Light info vibe — main company sites fit .ltd/.com",
        "Reference fits .info, wikis fit .wiki, lookups fit .fyi",
      ],
    },
  },
  promo: {
    tld: "promo",
    zh: {
      title: ".promo 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".promo 把「促销」写进域名，适合促销活动落地页、优惠码与折扣聚合站、品牌 campaign 微站、达人带货与联盟推广页。查看 .promo 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .promo 域名。",
      intro:
        ".promo 把促销写进域名：促销活动落地页、优惠码与折扣聚合站、品牌 campaign 微站、达人带货与联盟推广页用 name.promo，「这里有优惠」从地址就说清了。促销页的转化第一眼就定生死——「品牌 + .promo」比一长串带参数的活动 URL 更好记好读，印在海报与短视频口播里都顺；优惠码聚合与联盟推广站用品类后缀，域名主体留给品牌或品类词，语义零浪费。注册局为 Identity Digital，注册约 $11（约 ¥78），续费约 $20/年（约 ¥145）——温和档，长期运营的优惠站持有无压力。库存极好：品牌词、品类词、动词短语几乎都有货。注意三点：一是促销语义强，公司主站与产品官网用它撑不起长期品牌，适合作为主站之外的活动阵地；二是营销类后缀在部分邮箱过滤器眼里更敏感，发促销邮件用主域名发、.promo 只做落地页更稳；三是与已收录 .sale 的分工——长期折扣频道用 .sale，短期 campaign 与优惠码阵地用 .promo 更准。命名上「品牌 + .promo」是 campaign 微站标准款，「品类 + .promo」适合优惠聚合站，「达人名 + .promo」适合带货与联盟推广页。",
      bestFor: ["促销活动落地页", "优惠码与折扣聚合站", "品牌 campaign 微站", "达人带货与联盟推广页"],
      namingTips: [
        "「品牌 + .promo」比带参数活动 URL 更好记",
        "注册约 $11、续费约 $20/年，长期持有无压力",
        "促销邮件用主域发，.promo 只做落地页更稳",
        "长期折扣频道用 .sale，短期 campaign 用 .promo",
      ],
    },
    en: {
      title: ".promo Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".promo writes the offer into the address — for promotion landing pages, coupon and discount aggregators, brand campaign microsites, and creator and affiliate promo pages. See live pricing and naming advice, then hunt available .promo names with AI.",
      intro:
        ".promo writes the offer into the address: promotion landing pages, coupon and discount aggregators, brand campaign microsites, creator and affiliate promo pages on name.promo say the deal lives here in the domain itself. Promo pages convert or die on the first glance — brand + .promo beats a long parameter-laden campaign URL for memorability, and reads clean on posters and in short-video call-outs; coupon aggregators and affiliate pages get the category from the suffix and keep the name for the brand or niche, zero semantic waste. Operated by Identity Digital, about $11 to register and $20/yr to renew — mild tier, painless for a long-running deals site to hold. Inventory is excellent: brand words, niche words and verb phrases nearly all hit. Three cautions: the promo semantics run hot — company homepages and product sites can't build a lasting brand on it, so treat it as the campaign outpost beside the main site; marketing suffixes get extra scrutiny from some mail filters, so send promo email from the main domain and keep .promo for landing pages; and split the work with the already-listed .sale — a permanent discount channel fits .sale, short campaigns and coupon hubs read truer on .promo. Naming: brand + .promo is the campaign-microsite standard; niche + .promo fits coupon aggregators; creator name + .promo fits affiliate and shoutout pages.",
      bestFor: ["Promotion landing pages", "Coupon & discount aggregators", "Brand campaign microsites", "Creator & affiliate promo pages"],
      namingTips: [
        "Brand + .promo beats parameter-laden campaign URLs",
        "About $11 year one, $20/yr renewal — easy to hold",
        "Send email from the main domain; land on .promo",
        "Permanent deals fit .sale; campaigns fit .promo",
      ],
    },
  },
  express: {
    tld: "express",
    zh: {
      title: ".express 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".express 把「快」写进域名，适合快递与同城配送、跨境物流与货代、上门快修快洗服务、主打速度的工具产品。查看 .express 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .express 域名。",
      intro:
        ".express 把速度写进域名：快递与同城配送、跨境物流与货代、上门快修快洗服务、主打速度的工具产品用 name.express，「快」的承诺从地址就说清了。express 在全球物流业是刻进行业名的词——顺丰速运、联邦快递的英文名里都有它，「城市/品牌 + .express」对快递与货代就是行业标准式命名；对强调「立等可取」的上门服务与「秒出结果」的工具产品，后缀本身就是卖点陈述。注册局为 Identity Digital，注册约 $9（约 ¥67），续费约 $31/年（约 ¥226）——首年低价、续费中档，正经经营的服务商持有无压力。库存极好：城市词、线路词、品牌词几乎都有货。注意三点：一是 express 一词多义（快递/特快/表达），页面首屏要说清做的是哪门生意；二是续费 ¥226/年 对纯玩票项目略有分量，按续费价核算预算；三是与已收录 .taxi / .tools 的分工——出行调度用 .taxi，通用工具用 .tools，主打「快」的配送与服务用 .express 更准。命名上「城市 + .express」直接接住同城配送搜索，「线路词 + .express」适合跨境物流与货代，「品牌 + .express」适合上门服务与速度型工具。",
      bestFor: ["快递与同城配送", "跨境物流与货代", "上门快修快洗服务", "主打速度的工具产品"],
      namingTips: [
        "「城市/线路 + .express」是物流行业标准式命名",
        "首年约 $9、续费约 $31/年，按续费价做预算",
        "express 一词多义，首屏说清做的是哪门生意",
        "出行用 .taxi，工具用 .tools，快服务用 .express",
      ],
    },
    en: {
      title: ".express Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".express writes the speed into the address — for courier and local delivery services, cross-border logistics and freight forwarders, on-demand repair and cleaning services, and speed-first tool products. See live pricing and naming advice, then hunt available .express names with AI.",
      intro:
        ".express writes the speed into the address: courier and local delivery services, cross-border logistics and freight forwarders, on-demand repair and cleaning services, speed-first tool products on name.express make the fast promise in the domain itself. express is baked into the logistics industry's own names — FedEx and half the world's couriers carry the word — so city or brand + .express is the standard naming pattern for delivery and freight; for while-you-wait services and instant-result tools the suffix is the pitch itself. Operated by Identity Digital, about $9 to register and $31/yr to renew — a cheap first year with a mid renewal, painless for an operating service to hold. Inventory is excellent: city words, route words and brand words nearly all hit. Three cautions: express carries several senses (courier, fast, expression), so the hero section should say which business this is; $31/yr has some weight for a hobby project — budget on the renewal price; and split the work with the already-listed .taxi and .tools — ride dispatch fits .taxi, general utilities fit .tools, speed-first delivery and services read truer on .express. Naming: city + .express catches local-delivery searches directly; route word + .express fits cross-border logistics and forwarders; brand + .express fits on-demand services and speed-first tools.",
      bestFor: ["Courier & local delivery services", "Cross-border logistics & freight forwarders", "On-demand repair & cleaning services", "Speed-first tool products"],
      namingTips: [
        "City or route + .express is the logistics standard",
        "About $9 year one, $31/yr renewal — budget on renewal",
        "Express has many senses — say which on the hero",
        "Rides fit .taxi, utilities fit .tools, speed fits here",
      ],
    },
  },
  press: {
    tld: "press",
    zh: {
      title: ".press 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".press 把「媒体」写进域名，适合独立媒体与新闻编辑部、行业垂直资讯站、企业新闻中心与 PR 页、独立出版与通讯简报。查看 .press 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .press 域名。",
      intro:
        ".press 把媒体身份写进域名：独立媒体与新闻编辑部、行业垂直资讯站、企业新闻中心与 PR 页、独立出版与通讯简报用 name.press，「这是个发新闻的地方」从地址就说清了。press 在英文里同时指「新闻界」与「出版社」，比 .news 更强调「机构在做报道」而不只是「这里有资讯」——独立编辑部、调查报道项目、大学校媒用它比 .news 更有身份感；企业官网的 press.brand.com 逻辑反过来做成 brand.press 也很顺。注册局为 Radix，注册约 $5（约 ¥33），续费约 $64/年（约 ¥463）——典型的首年低价、续费跳档，先确认项目会长期运营再上正式品牌。库存很好：刊名词、城市词、行业词大多有货。注意三点：一是续费 ¥463/年 对个人博客偏贵，纯个人写作 .blog 更划算；二是别拿它做与新闻无关的业务，读者预期落空反而伤信任；三是与已收录 .news / .media 的分工——泛资讯聚合用 .news，内容公司与 MCN 用 .media，编辑部与出版身份用 .press 更准。命名上「刊名 + .press」最正统，「城市/行业 + .press」适合垂直媒体，「机构名 + .press」适合企业新闻中心。",
      bestFor: ["独立媒体与新闻编辑部", "行业垂直资讯站", "企业新闻中心与 PR 页", "独立出版与通讯简报"],
      namingTips: [
        "「刊名 + .press」最正统，像一份真的刊物",
        "首年约 $5、续费约 $64/年，确认长期运营再用作主域",
        "个人写作 .blog 更省，编辑部身份才用 .press",
        "泛资讯用 .news，内容公司用 .media，出版身份用 .press",
      ],
    },
    en: {
      title: ".press Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".press writes the newsroom into the address — for independent media and editorial teams, vertical industry news sites, corporate press centers, and indie publishing and newsletters. See live pricing and naming advice, then hunt available .press names with AI.",
      intro:
        ".press writes the newsroom into the address: independent media and editorial teams, vertical industry news sites, corporate press centers and PR pages, indie publishers and newsletters on name.press declare \"journalism happens here\" from the URL itself. In English, press means both the news industry and the publishing house — a stronger institutional claim than .news, which merely promises information. Independent newsrooms, investigative projects and student papers carry more identity on .press; flipping a company's press.brand.com into brand.press also reads naturally. Operated by Radix, about $5 to register and $64/yr to renew — the classic cheap-first-year, steep-renewal pattern, so confirm the project will run for years before branding on it. Inventory is strong: masthead words, city words and industry words mostly hit. Three cautions: $64/yr is heavy for a personal blog — .blog is the cheaper fit; don't use it for non-news businesses, as the broken expectation costs trust; and split the work with the already-listed .news and .media — aggregators fit .news, content studios and MCNs fit .media, editorial and publishing identity reads truest on .press. Naming: masthead + .press feels like a real publication; city or industry + .press fits vertical media; org name + .press fits corporate press centers.",
      bestFor: ["Independent media & newsrooms", "Vertical industry news sites", "Corporate press centers & PR pages", "Indie publishing & newsletters"],
      namingTips: [
        "Masthead + .press reads like a real publication",
        "About $5 year one, $64/yr renewal — commit before branding",
        "Personal writing fits .blog; newsroom identity fits .press",
        "Aggregators fit .news, studios fit .media, publishing fits here",
      ],
    },
  },
  stream: {
    tld: "stream",
    zh: {
      title: ".stream 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".stream 把「直播/流媒体」写进域名，适合游戏与生活主播个人站、直播工具与推流服务、流媒体内容聚合、数据流与实时处理产品。查看 .stream 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .stream 域名。",
      intro:
        ".stream 把「流」写进域名：游戏与生活主播个人站、直播工具与推流服务、流媒体内容聚合、数据流与实时处理产品用 name.stream，动词即后缀，「点开就在播」的暗示从地址开始。stream 一词横跨两个热门语境——消费侧的直播/流媒体（Twitch 主播、播客、赛事直播），与工程侧的数据流（Kafka、实时管道、事件流处理），两边用它都自然。现由 GoDaddy Registry 运营，注册约 $5（约 ¥33），续费约 $6/年（约 ¥41）——注册续费都便宜，是本站收录后缀里少有的「无续费坑」新顶级域，主播和独立开发者可以放心长持。库存极好：ID 词、游戏词、技术词几乎随便挑。注意三点：一是 .stream 历史上曾被垃圾注册大量使用，个别邮件网关会对它更敏感，重要邮件建议放主域；二是主播个人站记得和平台主页互相链接，积累自己的搜索入口；三是与已收录 .live / .tv 的分工——强调「正在直播」用 .live，泛视频内容用 .tv，直播工具与数据流产品用 .stream 更准。命名上「ID + .stream」适合主播个人站，「功能词 + .stream」适合推流与实时处理工具，动词短语（如 watch.stream 风格）适合内容聚合。",
      bestFor: ["游戏与生活主播个人站", "直播工具与推流服务", "流媒体内容聚合", "数据流与实时处理产品"],
      namingTips: [
        "「主播 ID + .stream」即身份即地址",
        "注册约 $5、续费约 $6/年，罕见的无续费坑新顶级域",
        "历史垃圾注册多，重要邮件建议放主域收发",
        "在播用 .live，泛视频用 .tv，工具与数据流用 .stream",
      ],
    },
    en: {
      title: ".stream Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".stream writes the broadcast into the address — for streamer personal sites, live-streaming tools and ingest services, streaming content hubs, and data-streaming and real-time products. See live pricing and naming advice, then hunt available .stream names with AI.",
      intro:
        ".stream writes the broadcast into the address: streamer personal sites, live-streaming tools and ingest services, streaming content hubs, and data-streaming or real-time processing products on name.stream get a verb for a suffix — the \"click and it's playing\" hint starts at the URL. The word spans two hot contexts: consumer streaming (Twitch creators, podcasts, live events) and engineering data streams (Kafka, real-time pipelines, event processing), and it reads naturally on both. Now operated by GoDaddy Registry, about $5 to register and $6/yr to renew — cheap both years, one of the rare new gTLDs in our index with no renewal trap, so streamers and indie devs can hold it long-term worry-free. Inventory is excellent: handles, game words and tech words nearly all hit. Three cautions: .stream saw heavy spam registration historically, so a few mail gateways treat it warily — keep important email on your main domain; streamer sites should cross-link with platform profiles to build an owned search entry; and split the work with the already-listed .live and .tv — \"on air now\" energy fits .live, general video content fits .tv, streaming tools and data-stream products read truest on .stream. Naming: handle + .stream makes identity the address; function word + .stream fits ingest and real-time tools; verb phrases suit content hubs.",
      bestFor: ["Streamer personal sites", "Live-streaming tools & ingest services", "Streaming content hubs", "Data-streaming & real-time products"],
      namingTips: [
        "Handle + .stream turns identity into the address",
        "About $5 year one and $6/yr renewal — no renewal trap",
        "Legacy spam reputation — keep key email on your main domain",
        "On-air fits .live, video fits .tv, tools and pipelines fit here",
      ],
    },
  },
  movie: {
    tld: "movie",
    zh: {
      title: ".movie 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".movie 把「电影」写进域名，适合电影官方宣传站、制片公司与工作室、影迷社区与影评站、电影节与放映活动。查看 .movie 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .movie 域名。",
      intro:
        ".movie 把电影写进域名：电影官方宣传站、制片公司与工作室、影迷社区与影评站、电影节与放映活动用 title.movie，一部片子一个地址，比在官网深处埋一个 /movies/title 页面好记得多。好莱坞片方确实在用它做单片宣传站，观众看到 title.movie 不需要解释就知道这是什么。注册局为 Identity Digital，定价在其组合里属于最高一档：注册约 $37（约 ¥263），续费约 $279/年（约 ¥2006）——这是给「有宣发预算的项目」准备的后缀，片方一部片的域名成本相对宣发费用可以忽略，但个人影评博客拿它当主域就是负担。库存因高价反而极好：片名词、类型词、工作室名基本都有货。注意三点：一是按续费价核算持有成本，宣传站通常随影片生命周期持有两三年即可，不必永久续费；二是影迷站与影评博客用 .reviews / .blog 更符合预算；三是与已收录 .tv / .show 的分工——剧集与频道用 .tv，综艺演出用 .show，电影本体用 .movie 最准。命名上「片名 + .movie」是标准用法，「工作室名 + .movie」适合制片公司，「电影节名 + .movie」适合影展与放映活动。",
      bestFor: ["电影官方宣传站", "制片公司与工作室", "影迷社区与影评站", "电影节与放映活动"],
      namingTips: [
        "「片名 + .movie」是片方宣传站标准用法",
        "首年约 $37、续费约 $279/年，按影片生命周期持有",
        "个人影评博客用 .reviews / .blog 更省",
        "剧集用 .tv，演出用 .show，电影本体用 .movie",
      ],
    },
    en: {
      title: ".movie Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".movie writes the film into the address — for official film promo sites, production companies and studios, fan communities and review sites, and film festivals and screenings. See live pricing and naming advice, then hunt available .movie names with AI.",
      intro:
        ".movie writes the film into the address: official promo sites, production companies and studios, fan communities and review sites, and film festivals on title.movie give each picture its own address — far more memorable than a /movies/title page buried in a corporate site. Hollywood distributors genuinely use it for single-film campaign sites, and audiences parse title.movie with zero explanation. Operated by Identity Digital at the top of its price range: about $37 to register and $279/yr to renew — a suffix built for projects with a marketing budget, where domain cost is a rounding error against P&A spend, but a real burden as a personal blog's main domain. The upside of the high price is superb inventory: title words, genre words and studio names nearly all hit. Three cautions: budget on the renewal price, though campaign sites typically only need holding for a film's two-to-three-year life cycle; fan and review blogs fit .reviews or .blog far better on budget; and split the work with the already-listed .tv and .show — series and channels fit .tv, stage and variety fit .show, cinema itself reads truest on .movie. Naming: title + .movie is the standard campaign pattern; studio name + .movie fits production companies; festival name + .movie fits screenings and film events.",
      bestFor: ["Official film promo sites", "Production companies & studios", "Fan communities & review sites", "Film festivals & screenings"],
      namingTips: [
        "Title + .movie is the standard studio campaign pattern",
        "About $37 year one, $279/yr renewal — hold for the film's life cycle",
        "Fan blogs fit .reviews or .blog on budget",
        "Series fit .tv, stage fits .show, cinema fits here",
      ],
    },
  },
  pictures: {
    tld: "pictures",
    zh: {
      title: ".pictures 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".pictures 把「影像」写进域名，适合影视制作公司、摄影师与图片库、插画与视觉艺术作品集、婚礼与活动影像服务。查看 .pictures 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .pictures 域名。",
      intro:
        ".pictures 把影像写进域名：影视制作公司、摄影师与图片库、插画与视觉艺术作品集、婚礼与活动影像服务用 name.pictures，读起来就是「某某影业/某某影像」——Sony Pictures、Universal Pictures 让这个词自带制片厂气质，小型制作公司用 brand.pictures 立刻借上这份行业感。注册局为 Identity Digital，注册约 $8（约 ¥59），续费约 $13/年（约 ¥93）——注册续费都便宜，在影像类后缀里是性价比之选，比 .photography 的续费低不少。库存极好：姓氏、工作室名、城市词几乎都有货。注意三点：一是 pictures 偏「成片/作品」而非「拍摄过程」，服务型摄影工作室若主打约拍流程，.photography / .photo 语义更直接；二是词较长（8 字符），前缀务必短——短姓氏或双音节品牌词最搭；三是与已收录 .photos / .gallery 的分工——随手图集用 .photos，展陈用 .gallery，制作公司与影像品牌用 .pictures 更有「影业」的分量。命名上「姓氏 + .pictures」适合独立影像人，「品牌 + .pictures」适合制作公司，「城市 + .pictures」适合本地婚礼与活动影像服务。",
      bestFor: ["影视制作公司", "摄影师与图片库", "插画与视觉艺术作品集", "婚礼与活动影像服务"],
      namingTips: [
        "「品牌 + .pictures」自带制片厂气质",
        "注册约 $8、续费约 $13/年，影像类后缀里的性价比之选",
        "后缀较长，前缀选短姓氏或双音节品牌词",
        "图集用 .photos，展陈用 .gallery，影像品牌用 .pictures",
      ],
    },
    en: {
      title: ".pictures Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".pictures writes the studio into the address — for film and video production companies, photographers and stock libraries, illustration and visual-art portfolios, and wedding and event videography. See live pricing and naming advice, then hunt available .pictures names with AI.",
      intro:
        ".pictures writes the studio into the address: film and video production companies, photographers and stock libraries, illustration and visual-art portfolios, and wedding or event videography on name.pictures read instantly as \"So-and-so Pictures\" — Sony Pictures and Universal Pictures gave the word a studio pedigree that a small production shop borrows the moment it brands on brand.pictures. Operated by Identity Digital, about $8 to register and $13/yr to renew — cheap both years, the value pick among imaging suffixes and well below .photography's renewal. Inventory is excellent: surnames, studio names and city words nearly all hit. Three cautions: pictures connotes finished work rather than the shooting process, so a service studio selling booking flows may read more directly on .photography or .photo; the suffix is long (8 characters), so keep the prefix short — a surname or two-syllable brand word fits best; and split the work with the already-listed .photos and .gallery — casual albums fit .photos, exhibitions fit .gallery, production companies and imaging brands carry more weight on .pictures. Naming: surname + .pictures fits independent filmmakers; brand + .pictures fits production companies; city + .pictures fits local wedding and event videographers.",
      bestFor: ["Film & video production companies", "Photographers & stock libraries", "Illustration & visual-art portfolios", "Wedding & event videography"],
      namingTips: [
        "Brand + .pictures borrows real studio pedigree",
        "About $8 year one, $13/yr renewal — the imaging value pick",
        "Long suffix — keep the prefix to a short surname or brand",
        "Albums fit .photos, exhibits fit .gallery, studios fit here",
      ],
    },
  },
  productions: {
    tld: "productions",
    zh: {
      title: ".productions 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".productions 把「制作公司」写进域名，适合影视与广告制作公司、音乐与播客制作团队、活动策划与演出制作、独立创作者工作室。查看 .productions 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .productions 域名。",
      intro:
        ".productions 把制作公司写进域名：影视与广告制作公司、音乐与播客制作团队、活动策划与演出制作、独立创作者工作室用 name.productions，「XX Productions」是这个行业几十年的标准公司名格式，后缀直接把公司名补完整——brand.productions 读出来就是完整字号，名片和片尾字幕都顺理成章。注册局为 Identity Digital，注册约 $8（约 ¥59），续费约 $32/年（约 ¥234）——首年便宜、续费中档，正经经营的制作公司持有毫无压力。库存极好：人名、工作室名、风格词几乎都有货，比抢注严重的 .studio 好找得多。注意三点：一是后缀很长（11 字符），前缀务必短——单词或人名最佳，别再叠长词；二是它强调「接活的制作方」，面向消费者的内容品牌用 .tv / .media 气质更对；三是与已收录 .studio / .works 的分工——个人创意工作室用 .studio，泛作品集用 .works，有团队接项目的制作公司用 .productions 最正。命名上「主理人名 + .productions」是行业惯例，「品牌词 + .productions」适合广告与活动制作，「音乐厂牌名 + .productions」适合音乐与播客团队。",
      bestFor: ["影视与广告制作公司", "音乐与播客制作团队", "活动策划与演出制作", "独立创作者工作室"],
      namingTips: [
        "「名字 + .productions」就是完整公司字号",
        "首年约 $8、续费约 $32/年，经营性公司持有无压力",
        "后缀 11 字符很长，前缀用单个短词或人名",
        "个人工作室用 .studio，接项目的制作公司用 .productions",
      ],
    },
    en: {
      title: ".productions Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".productions writes the company into the address — for film and ad production companies, music and podcast production teams, event and show production, and independent creator studios. See live pricing and naming advice, then hunt available .productions names with AI.",
      intro:
        ".productions writes the company into the address: film and ad production companies, music and podcast teams, event and show production, and independent creator studios on name.productions complete the oldest company-name format in the business — \"So-and-so Productions\" — so brand.productions reads as the full legal-sounding name, at home on a business card or in end credits. Operated by Identity Digital, about $8 to register and $32/yr to renew — cheap first year, mid renewal, painless for an operating production company to hold. Inventory is excellent: personal names, studio names and style words nearly all hit, far easier hunting than the picked-over .studio. Three cautions: the suffix is long (11 characters), so the prefix must be short — one word or a name, never another long word; it signals a for-hire production shop, so consumer-facing content brands read better on .tv or .media; and split the work with the already-listed .studio and .works — a solo creative studio fits .studio, a general portfolio fits .works, a team that takes on client productions reads truest on .productions. Naming: founder name + .productions is the industry convention; brand word + .productions fits ad and event production; label name + .productions fits music and podcast teams.",
      bestFor: ["Film & ad production companies", "Music & podcast production teams", "Event & show production", "Independent creator studios"],
      namingTips: [
        "Name + .productions completes the classic company format",
        "About $8 year one, $32/yr renewal — easy to hold",
        "11-character suffix — keep the prefix to one short word",
        "Solo studios fit .studio; client-facing shops fit here",
      ],
    },
  },
  audio: {
    tld: "audio",
    zh: {
      title: ".audio 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".audio 把「声音」写进域名，适合音频设备与耳机品牌、播客网络与音频内容平台、录音棚与母带服务、音频技术与处理工具。查看 .audio 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .audio 域名。",
      intro:
        ".audio 把声音写进域名：音频设备与耳机品牌、播客网络与音频内容平台、录音棚与母带服务、音频技术与处理工具用 name.audio，行业身份一词说清——hi-fi 圈的公司名本来就大量以 Audio 结尾（如 Focal、iFi 的产品线命名），brand.audio 对发烧友是熟悉的读法。注册局为 XYZ（从 Uniregistry 收购），走精品高价路线：注册与续费同价，约 $104/年（约 ¥745）——没有首年低价钩子，也没有续费跳档，价格从第一年就把「玩票项目」筛掉了，留下的都是正经品牌，这反而是它的信任资产。库存极好：设备词、声学词、厂牌名基本都有货。注意三点：一是按 ¥745/年 的持有成本核算，个人播客单档节目用 .fm 或平台页更划算；二是它偏「音频行业与技术」，单一播客节目用 .fm 的电台气质更贴；三是与已收录 .fm / .band 的分工——电台与播客节目用 .fm，乐队用 .band，设备品牌、录音棚与音频技术公司用 .audio 最正。命名上「品牌 + .audio」适合设备与技术公司，「棚名 + .audio」适合录音与母带服务，「厂牌 + .audio」适合音频内容公司。",
      bestFor: ["音频设备与耳机品牌", "播客网络与音频内容平台", "录音棚与母带服务", "音频技术与处理工具"],
      namingTips: [
        "「品牌 + .audio」是 hi-fi 行业的熟悉读法",
        "注册续费同价约 $104/年，无钩子也无跳档，按年预算",
        "单档播客用 .fm 更省，行业品牌才用 .audio",
        "节目用 .fm，乐队用 .band，设备与技术公司用 .audio",
      ],
    },
    en: {
      title: ".audio Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".audio writes the sound into the address — for audio hardware and headphone brands, podcast networks and audio platforms, recording and mastering studios, and audio technology and processing tools. See live pricing and naming advice, then hunt available .audio names with AI.",
      intro:
        ".audio writes the sound into the address: audio hardware and headphone brands, podcast networks and audio platforms, recording and mastering studios, and audio technology tools on name.audio state the industry in one word — hi-fi companies have always ended their names in Audio, so brand.audio is a familiar read to audiophiles. Operated by XYZ Registry (acquired from Uniregistry) as a boutique premium: registration and renewal cost the same, about $104/yr — no first-year hook and no renewal jump. The flat price filters out hobby projects from day one, which quietly becomes a trust asset: an .audio site signals a business that means it. Inventory is excellent: gear words, acoustics terms and label names nearly all hit. Three cautions: budget the full $104/yr holding cost — a single personal podcast is better served by .fm or a platform page; the suffix leans industry-and-technology, so an individual show reads warmer on .fm's radio vibe; and split the work with the already-listed .fm and .band — shows and stations fit .fm, bands fit .band, gear brands, studios and audio-tech companies read truest on .audio. Naming: brand + .audio fits hardware and technology companies; studio name + .audio fits recording and mastering services; label + .audio fits audio content companies.",
      bestFor: ["Audio hardware & headphone brands", "Podcast networks & audio platforms", "Recording & mastering studios", "Audio technology & processing tools"],
      namingTips: [
        "Brand + .audio is the familiar hi-fi industry read",
        "Flat ~$104/yr for both years — no hook, no jump",
        "A single podcast fits .fm cheaper; brands fit .audio",
        "Shows fit .fm, bands fit .band, gear and tech fit here",
      ],
    },
  },
  credit: {
    tld: "credit",
    zh: {
      title: ".credit 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".credit 把「信用」写进域名，适合信用评分与征信服务、信用卡比价与返现平台、信用修复与咨询机构、面向企业的信用额度产品。查看 .credit 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .credit 域名。",
      intro:
        ".credit 把信用写进域名：信用评分与征信服务、信用卡比价与返现平台、信用修复与咨询机构、面向企业的信用额度产品用 name.credit，业务一词说清——check.credit、build.credit 这类「动词 + .credit」读出来就是一句产品口号。注册局为 Identity Digital，注册约 $7（约 ¥48），续费约 $83/年（约 ¥597）——首年低价钩子明显、续费跳档大，按 ¥600/年 的持有成本核算再下手。库存极好：动词、行为词、人群词基本都有货。注意三点：一是「credit」在金融语境敏感，涉及征信与放贷务必先核清本地金融牌照与广告合规，域名不能替代资质；二是续费近九倍于首年，短期活动页慎用长期主站；三是与已收录 .finance / .money / .cash 的分工——综合金融服务用 .finance，个人理财内容用 .money，支付收单用 .cash，信用与征信业务用 .credit 最正。命名上「动词 + .credit」适合信用工具（build、fix、check），「品牌 + .credit」适合信用卡与返现平台，「人群 + .credit」适合细分征信服务。",
      bestFor: ["信用评分与征信服务", "信用卡比价与返现平台", "信用修复与咨询机构", "企业信用额度产品"],
      namingTips: [
        "「动词 + .credit」读出来就是产品口号（build、check、fix）",
        "首年约 $7、续费约 $83/年，按 ¥600/年 持有成本核算",
        "征信与放贷语境敏感，先核清金融牌照与广告合规",
        "综合金融用 .finance，支付用 .cash，信用业务用 .credit",
      ],
    },
    en: {
      title: ".credit Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".credit writes creditworthiness into the address — for credit scoring and bureau services, card comparison and cashback platforms, credit repair and counseling, and business credit-line products. See live pricing and naming advice, then hunt available .credit names with AI.",
      intro:
        ".credit writes the business into the address: credit scoring and bureau services, card comparison and cashback platforms, credit repair and counseling, and business credit-line products on name.credit state it in one word — verb + .credit names like check.credit or build.credit read as a product slogan out loud. Operated by Identity Digital, about $7 to register and $83/yr to renew — a steep first-year hook with a big renewal jump, so budget the ~$83/yr holding cost before committing. Inventory is excellent: verbs, action words and audience words nearly all hit. Three cautions: \"credit\" is a regulated word in finance, so clear local lending and advertising compliance first — a domain never substitutes for a license; renewal is nearly nine times year one, so avoid it for short-lived campaign pages; and split the work with the already-listed .finance, .money and .cash — full-service finance fits .finance, personal-finance content fits .money, payments fit .cash, and credit and bureau businesses read truest on .credit. Naming: verb + .credit fits credit tools (build, fix, check); brand + .credit fits card and cashback platforms; audience + .credit fits niche bureau services.",
      bestFor: ["Credit scoring & bureau services", "Card comparison & cashback platforms", "Credit repair & counseling", "Business credit-line products"],
      namingTips: [
        "Verb + .credit reads as a product slogan (build, check, fix)",
        "About $7 year one, $83/yr renewal — budget the jump",
        "Credit is a regulated word; clear compliance first",
        "Finance fits .finance, payments .cash, credit fits here",
      ],
    },
  },
  loans: {
    tld: "loans",
    zh: {
      title: ".loans 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".loans 把「贷款」写进域名，适合贷款比价与撮合平台、抵押与消费信贷机构、小微企业融资服务、贷款计算器等工具站。查看 .loans 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .loans 域名。",
      intro:
        ".loans 把贷款写进域名：贷款比价与撮合平台、抵押与消费信贷机构、小微企业融资服务、贷款计算器等工具站用 name.loans，业务一词说清——复数形式天然带「多家产品任选」的比价语感，compare.loans、student.loans 读出来就是页面主题。注册局为 Identity Digital，注册约 $11（约 ¥78），续费约 $93/年（约 ¥671）——首年便宜、续费跳档大，按 ¥670/年 的持有成本核算。库存极好：品类词、人群词、地区词基本都有货。注意三点：一是放贷与助贷在各地都是强监管业务，上线前务必核清金融牌照、利率披露与广告合规；二是续费约八倍于首年，短期获客页慎重；三是与已收录 .finance / .money / .credit 的分工——综合金融用 .finance，理财内容用 .money，征信信用用 .credit，贷款产品与比价用 .loans 最正。命名上「品类 + .loans」适合垂直信贷（car、home、student），「compare/get + .loans」适合比价撮合，「地区 + .loans」适合本地信贷服务。",
      bestFor: ["贷款比价与撮合平台", "抵押与消费信贷机构", "小微企业融资服务", "贷款计算器与工具站"],
      namingTips: [
        "「品类 + .loans」直接命中搜索意图（car、home、student）",
        "首年约 $11、续费约 $93/年，按 ¥670/年 持有成本核算",
        "放贷助贷强监管，先核清牌照、利率披露与广告合规",
        "征信用 .credit，理财内容用 .money，贷款产品用 .loans",
      ],
    },
    en: {
      title: ".loans Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".loans writes lending into the address — for loan comparison and matching platforms, mortgage and consumer lenders, small-business financing services, and loan calculator tool sites. See live pricing and naming advice, then hunt available .loans names with AI.",
      intro:
        ".loans writes the business into the address: loan comparison and matching platforms, mortgage and consumer lenders, small-business financing, and loan calculator sites on name.loans state it in one word — the plural naturally carries a marketplace tone, so compare.loans or student.loans reads as the page topic itself. Operated by Identity Digital, about $11 to register and $93/yr to renew — cheap first year, steep renewal jump, so budget the ~$93/yr holding cost. Inventory is excellent: category words, audience words and geo words nearly all hit. Three cautions: lending and loan brokering are heavily regulated everywhere, so clear licensing, rate disclosure and advertising compliance before launch; renewal is roughly eight times year one, so think twice for short-lived acquisition pages; and split the work with the already-listed .finance, .money and .credit — full-service finance fits .finance, personal-finance content fits .money, credit and bureau services fit .credit, and loan products and comparison read truest on .loans. Naming: category + .loans fits vertical lending (car, home, student); compare/get + .loans fits marketplaces; region + .loans fits local lenders.",
      bestFor: ["Loan comparison & matching platforms", "Mortgage & consumer lenders", "Small-business financing services", "Loan calculators & tool sites"],
      namingTips: [
        "Category + .loans hits search intent (car, home, student)",
        "About $11 year one, $93/yr renewal — budget the jump",
        "Lending is heavily regulated; clear licensing first",
        "Credit fits .credit, content .money, loan products here",
      ],
    },
  },
  investments: {
    tld: "investments",
    zh: {
      title: ".investments 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".investments 把「投资业务」写进域名，适合资产管理与投资顾问、房产与另类投资平台、家族办公室与私人投资公司、投资研究与组合工具。查看 .investments 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .investments 域名。",
      intro:
        ".investments 把投资业务写进域名：资产管理与投资顾问、房产与另类投资平台、家族办公室与私人投资公司、投资研究与组合工具用 name.investments，「XX Investments」本就是投资公司几十年的标准字号格式，brand.investments 读出来就是完整公司名。注册局为 Identity Digital，注册约 $8（约 ¥59），续费约 $104/年（约 ¥745）——首年低、续费在新顶级域里属于高档，按 ¥745/年 的持有成本核算，对管理真金白银的机构不算负担，反而筛掉了玩票项目。库存极好：姓氏、地名、策略词基本都有货。注意三点：一是后缀很长（11 字符），前缀务必短——姓氏或单词最佳；二是投资建议与募资在各地强监管，务必核清牌照与合规披露；三是与已收录 .capital / .fund / .ventures 的分工——机构品牌用 .capital，基金产品用 .fund，风投用 .ventures，综合投资公司与平台用 .investments 最正。命名上「姓氏 + .investments」是家族办公室惯例，「地名 + .investments」适合区域资管，「策略词 + .investments」适合主题投资平台。",
      bestFor: ["资产管理与投资顾问", "房产与另类投资平台", "家族办公室与私人投资公司", "投资研究与组合工具"],
      namingTips: [
        "「姓氏 + .investments」就是完整公司字号",
        "首年约 $8、续费约 $104/年，机构持有无压力",
        "后缀 11 字符很长，前缀用姓氏或单个短词",
        "机构牌子用 .capital，基金用 .fund，综合投资用这里",
      ],
    },
    en: {
      title: ".investments Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".investments writes the firm into the address — for asset managers and investment advisors, real-estate and alternative investment platforms, family offices and private investment companies, and research and portfolio tools. See live pricing and naming advice, then hunt available .investments names with AI.",
      intro:
        ".investments writes the firm into the address: asset managers and advisors, real-estate and alternative platforms, family offices and private investment companies, and research and portfolio tools on name.investments complete the classic firm-name format — \"So-and-so Investments\" — so brand.investments reads as the full company name. Operated by Identity Digital, about $8 to register and $104/yr to renew — low first year, one of the pricier renewals among new gTLDs, so budget the ~$104/yr holding cost; for a firm managing real money that's trivial, and it quietly filters out hobby projects. Inventory is excellent: surnames, place names and strategy words nearly all hit. Three cautions: the suffix is long (11 characters), so keep the prefix to a surname or one short word; investment advice and fundraising are heavily regulated, so clear licensing and disclosure first; and split the work with the already-listed .capital, .fund and .ventures — institutional brands fit .capital, fund products fit .fund, VCs fit .ventures, and diversified investment firms and platforms read truest on .investments. Naming: surname + .investments is the family-office convention; place + .investments fits regional asset managers; strategy word + .investments fits thematic platforms.",
      bestFor: ["Asset managers & investment advisors", "Real-estate & alternative platforms", "Family offices & private investment firms", "Research & portfolio tools"],
      namingTips: [
        "Surname + .investments completes the classic firm name",
        "About $8 year one, $104/yr renewal — easy for firms",
        "11-character suffix — keep the prefix short",
        "Brands fit .capital, funds .fund, diversified firms here",
      ],
    },
  },
  holdings: {
    tld: "holdings",
    zh: {
      title: ".holdings 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".holdings 把「控股公司」写进域名，适合控股集团与母公司官网、家族企业与资产持有主体、多品牌集团的公司层门户、投资控股与并购主体。查看 .holdings 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .holdings 域名。",
      intro:
        ".holdings 把控股公司写进域名：控股集团与母公司官网、家族企业与资产持有主体、多品牌集团的公司层门户、投资控股与并购主体用 name.holdings，「XX Holdings」是全球公司注册处里最常见的字号格式之一，brand.holdings 读出来就是完整法人名——旗下品牌各用各的域名，公司层信息披露与投资者关系放 .holdings 上，层级一目了然。注册局为 Identity Digital，注册与续费同价，约 $52/年（约 ¥374）——无首年钩子也无续费跳档，价格从第一年就筛掉了玩票项目，对持有资产的主体不算负担。库存极好：姓氏、地名、行业词基本都有货。注意三点：一是它是「公司层」后缀，面向消费者的品牌站气质不对，应各自用品牌域名；二是按 ¥374/年 核算持有成本；三是与已收录 .group / .capital / .ltd 的分工——多品牌经营集团用 .group，投资机构牌子用 .capital，注册主体后缀用 .ltd，控股与资产持有主体用 .holdings 最正。命名上「姓氏 + .holdings」是家族控股惯例，「品牌 + .holdings」适合集团母公司，「地名 + .holdings」适合区域控股平台。",
      bestFor: ["控股集团与母公司官网", "家族企业与资产持有主体", "多品牌集团公司层门户", "投资控股与并购主体"],
      namingTips: [
        "「姓氏/品牌 + .holdings」就是完整法人字号",
        "注册续费同价约 $52/年，无钩子也无跳档",
        "公司层后缀：消费品牌站各用品牌域名，别混用",
        "经营集团用 .group，投资牌子用 .capital，控股主体用这里",
      ],
    },
    en: {
      title: ".holdings Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".holdings writes the parent company into the address — for holding groups and parent-company sites, family businesses and asset-holding entities, corporate portals of multi-brand groups, and investment holding and M&A vehicles. See live pricing and naming advice, then hunt available .holdings names with AI.",
      intro:
        ".holdings writes the parent company into the address: holding groups and parent-company sites, family businesses and asset-holding entities, corporate portals of multi-brand groups, and investment holding vehicles on name.holdings complete one of the most common legal-name formats in company registries worldwide — \"So-and-so Holdings\" — so brand.holdings reads as the full entity name. Each operating brand keeps its own domain while corporate disclosure and investor relations live on .holdings, making the hierarchy obvious. Operated by Identity Digital with flat pricing, about $52/yr for both registration and renewal — no first-year hook and no renewal jump, a price that filters out hobby projects from day one and is trivial for an asset-holding entity. Inventory is excellent: surnames, place names and industry words nearly all hit. Three cautions: it is a corporate-layer suffix, so consumer-facing brand sites belong on their own domains; budget the flat ~$52/yr; and split the work with the already-listed .group, .capital and .ltd — operating multi-brand groups fit .group, investment brands fit .capital, legal-entity suffixes fit .ltd, and holding and asset entities read truest on .holdings. Naming: surname + .holdings is the family-holding convention; brand + .holdings fits group parents; place + .holdings fits regional holding platforms.",
      bestFor: ["Holding groups & parent-company sites", "Family businesses & asset entities", "Corporate portals of multi-brand groups", "Investment holding & M&A vehicles"],
      namingTips: [
        "Surname/brand + .holdings completes the entity name",
        "Flat ~$52/yr for both years — no hook, no jump",
        "Corporate-layer suffix; brand sites keep own domains",
        "Groups fit .group, brands .capital, entities fit here",
      ],
    },
  },
  mortgage: {
    tld: "mortgage",
    zh: {
      title: ".mortgage 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".mortgage 把「房贷」写进域名，适合房贷经纪与直贷机构、房贷比价与再融资平台、房贷计算器等工具站、面向购房者的内容站。查看 .mortgage 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .mortgage 域名。",
      intro:
        ".mortgage 把房贷写进域名：房贷经纪与直贷机构、房贷比价与再融资平台、房贷计算器等工具站、面向购房者的内容站用 name.mortgage，业务一词说清——房贷是金额最大、决策最重的个人信贷品类，域名把品类写明白本身就是信任信号。注册局为 Identity Digital，注册约 $8（约 ¥59），续费约 $50/年（约 ¥360）——首年便宜、续费中档，在金融类新顶级域里属于好持有的一档。库存极好：地名、人名、动词基本都有货，本地经纪「城市名 + .mortgage」几乎随便挑。注意三点：一是房贷经纪与放贷在各地强监管（如美国 NMLS 牌照），上线前务必核清资质与披露要求；二是后缀 8 字符偏长，前缀用地名或姓氏等短词；三是与已收录 .loans / .estate / .credit 的分工——泛贷款比价用 .loans，房产经纪用 .estate，征信用 .credit，房贷垂直业务用 .mortgage 最正。命名上「城市 + .mortgage」适合本地经纪，「姓氏 + .mortgage」适合个人经纪人，「compare/refi + .mortgage」适合比价与再融资平台。",
      bestFor: ["房贷经纪与直贷机构", "房贷比价与再融资平台", "房贷计算器与工具站", "面向购房者的内容站"],
      namingTips: [
        "「城市 + .mortgage」是本地经纪的黄金格式",
        "首年约 $8、续费约 $50/年，金融类里好持有的一档",
        "房贷强监管（如 NMLS），先核清资质与披露要求",
        "泛贷款用 .loans，房产经纪用 .estate，房贷垂直用这里",
      ],
    },
    en: {
      title: ".mortgage Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".mortgage writes home lending into the address — for mortgage brokers and direct lenders, rate comparison and refinance platforms, mortgage calculator tool sites, and homebuyer content sites. See live pricing and naming advice, then hunt available .mortgage names with AI.",
      intro:
        ".mortgage writes the business into the address: mortgage brokers and direct lenders, rate comparison and refinance platforms, calculator tool sites, and homebuyer content on name.mortgage state it in one word — the mortgage is the largest, most considered consumer-credit decision, and naming the category outright is itself a trust signal. Operated by Identity Digital, about $8 to register and $50/yr to renew — cheap first year, mid renewal, one of the easier finance gTLDs to hold. Inventory is excellent: place names, personal names and verbs nearly all hit, so a local broker can practically pick any city + .mortgage. Three cautions: mortgage brokering and lending are heavily regulated (e.g. NMLS licensing in the US), so clear credentials and disclosure requirements before launch; the 8-character suffix leans long, so keep the prefix to a city or surname; and split the work with the already-listed .loans, .estate and .credit — general loan comparison fits .loans, real-estate brokerage fits .estate, credit services fit .credit, and mortgage-vertical businesses read truest on .mortgage. Naming: city + .mortgage fits local brokers; surname + .mortgage fits individual loan officers; compare/refi + .mortgage fits comparison and refinance platforms.",
      bestFor: ["Mortgage brokers & direct lenders", "Rate comparison & refinance platforms", "Mortgage calculators & tool sites", "Homebuyer content sites"],
      namingTips: [
        "City + .mortgage is the golden format for local brokers",
        "About $8 year one, $50/yr renewal — easy to hold",
        "Heavily regulated (e.g. NMLS); clear licensing first",
        "General loans fit .loans, real estate .estate, this is home lending",
      ],
    },
  },
  computer: {
    tld: "computer",
    zh: {
      title: ".computer 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".computer 把「电脑」写进域名，适合电脑维修与上门服务、装机与硬件定制工作室、二手电脑与配件电商、计算机培训与科普内容。查看 .computer 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .computer 域名。",
      intro:
        ".computer 把电脑写进域名：电脑维修与上门服务、装机与硬件定制工作室、二手电脑与配件电商、计算机培训与科普内容用 name.computer，行业一词说清——本地维修店「城市名 + .computer」读出来就是店招，硬件圈也不乏用它做品牌的（如知名的 NAS 社区项目）。注册局为 Identity Digital，注册约 $18（约 ¥130），续费约 $31/年（约 ¥226）——首年中档、续费温和，在行业词后缀里属于价格结构健康的一档，长期持有无压力。库存极好：地名、品牌词、硬件词基本都有货。注意三点：一是后缀 8 字符偏长且偏「硬件实体」，纯软件与云产品用 .dev / .software 气质更贴；二是单数形式是「一台电脑」的语感，适合店铺与品牌而非平台聚合；三是与已收录 .tech / .software / .systems 的分工——泛科技品牌用 .tech，软件产品用 .software，集成商用 .systems，电脑硬件与维修服务用 .computer 最正。命名上「城市 + .computer」适合本地维修店，「品牌 + .computer」适合装机与硬件工作室，「fix/repair + .computer」适合连锁维修品牌。",
      bestFor: ["电脑维修与上门服务", "装机与硬件定制工作室", "二手电脑与配件电商", "计算机培训与科普内容"],
      namingTips: [
        "「城市 + .computer」读出来就是本地店招",
        "首年约 $18、续费约 $31/年，价格结构健康好持有",
        "纯软件与云产品用 .dev / .software 更贴",
        "泛科技用 .tech，软件用 .software，硬件维修用这里",
      ],
    },
    en: {
      title: ".computer Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".computer writes the machine into the address — for computer repair and on-site services, custom PC building studios, refurbished computer and parts shops, and computer training and educational content. See live pricing and naming advice, then hunt available .computer names with AI.",
      intro:
        ".computer writes the trade into the address: computer repair and on-site services, custom PC building studios, refurbished computer and parts shops, and computer training content on name.computer state the industry in one word — city + .computer reads like a local shop sign, and hardware brands have used it too (a well-known NAS community project among them). Operated by Identity Digital, about $18 to register and $31/yr to renew — mid first year, gentle renewal, one of the healthier price structures among industry-word gTLDs, painless to hold long term. Inventory is excellent: place names, brand words and hardware terms nearly all hit. Three cautions: the 8-character suffix leans long and physical, so pure software and cloud products read better on .dev or .software; the singular form carries a one-machine, shop-front tone that suits stores and brands more than marketplaces; and split the work with the already-listed .tech, .software and .systems — broad tech brands fit .tech, software products fit .software, integrators fit .systems, and computer hardware and repair services read truest on .computer. Naming: city + .computer fits local repair shops; brand + .computer fits PC-building and hardware studios; fix/repair + .computer fits repair chains.",
      bestFor: ["Computer repair & on-site services", "Custom PC building studios", "Refurbished computer & parts shops", "Computer training & educational content"],
      namingTips: [
        "City + .computer reads like a local shop sign",
        "About $18 year one, $31/yr renewal — healthy structure",
        "Pure software fits .dev / .software better",
        "Broad tech fits .tech, software .software, hardware here",
      ],
    },
  },
  vet: {
    tld: "vet",
    zh: {
      title: ".vet 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".vet 是宠物医疗的行业后缀，适合宠物医院与诊所、上门兽医服务、宠物体检与疫苗中心、兽医科普与问诊平台。查看 .vet 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .vet 域名。",
      intro:
        ".vet 三个字母就是「兽医」：宠物医院与诊所、上门兽医服务、宠物体检与疫苗中心、兽医科普与线上问诊平台用 name.vet，专业身份一眼可辨——铲屎官搜「城市名 + vet」找的就是它，短后缀印在诊所招牌和名片上也干净利落。注册局为 Identity Digital，注册与续费均约 $33/年（约 ¥241），价格平进平出、无「首年便宜续费贵」的陷阱，行业后缀里属于好持有的一档。库存极好：城市名、诊所名、宠物词基本都有货。注意三点：一是 .vet 在英语里也指退伍军人（veteran），美国市场偶有退伍军人组织使用，但宠物医疗语境下歧义很小；二是面向的是「医疗专业」场景，宠物用品电商与宠物社区用已收录的 .pet / .dog 更贴；三是与 .clinic / .care 的分工——综合诊所用 .clinic，护理服务用 .care，明确「兽医」身份用 .vet 最短最正。命名上「城市 + .vet」适合本地诊所，「品牌 + .vet」适合连锁宠物医院，「mobile/home + .vet」适合上门服务。",
      bestFor: ["宠物医院与诊所", "上门兽医服务", "宠物体检与疫苗中心", "兽医科普与问诊平台"],
      namingTips: [
        "「城市 + .vet」就是铲屎官的搜索词，本地诊所首选",
        "注册续费均约 $33/年，平进平出好持有",
        "宠物用品与社区用 .pet / .dog 更贴，医疗专业用这里",
        "上门服务可用 mobile/home + .vet 直接说清模式",
      ],
    },
    en: {
      title: ".vet Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".vet is the veterinary industry suffix — for animal hospitals and clinics, mobile vet services, pet checkup and vaccination centers, and veterinary content and telehealth platforms. See live pricing and naming advice, then hunt available .vet names with AI.",
      intro:
        ".vet says veterinarian in three letters: animal hospitals and clinics, mobile vet services, pet checkup and vaccination centers, and veterinary content or telehealth platforms on name.vet declare the profession at a glance — pet owners searching city + vet are looking for exactly this, and the short suffix sits cleanly on clinic signs and business cards. Operated by Identity Digital, it runs about $33/yr for both registration and renewal — flat in, flat out, none of the cheap-first-year-then-triple trap, one of the easiest industry gTLDs to hold. Inventory is excellent: city names, clinic names and pet words nearly all hit. Three cautions: in English .vet can also mean veteran, and some US veteran organizations use it, though ambiguity is minimal in a pet-care context; it targets the medical-professional scene, so pet supply shops and pet communities read better on the already-listed .pet or .dog; and split the work with .clinic and .care — general clinics fit .clinic, care services fit .care, while the explicit veterinarian identity is shortest and truest on .vet. Naming: city + .vet fits local clinics; brand + .vet fits animal hospital chains; mobile/home + .vet states the house-call model outright.",
      bestFor: ["Animal hospitals & clinics", "Mobile vet services", "Pet checkup & vaccination centers", "Veterinary content & telehealth"],
      namingTips: [
        "City + .vet is exactly what pet owners search — local first choice",
        "About $33/yr flat for both registration and renewal",
        "Pet shops and communities fit .pet / .dog better",
        "mobile/home + .vet states the house-call model outright",
      ],
    },
  },
  lawyer: {
    tld: "lawyer",
    zh: {
      title: ".lawyer 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".lawyer 把「律师」写进域名，适合律师个人品牌与独立执业、律师事务所、专项法律服务（离婚/移民/刑辩）、法律咨询与获客落地页。查看 .lawyer 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .lawyer 域名。",
      intro:
        ".lawyer 把职业写进域名：律师个人品牌与独立执业、律师事务所、离婚/移民/刑辩等专项法律服务、法律咨询与获客落地页用 name.lawyer，「我是律师」不言自明——当事人搜「城市 + lawyer」或「领域 + lawyer」时，域名本身就是广告位。注册局为 Identity Digital，注册与续费均约 $50/年（约 ¥360），平进平出，对客单价高的法律行业而言年费几乎可忽略。库存极好：姓氏、城市、执业领域词基本都有货。注意三点：一是 .lawyer 指向「律师个人/团队」，机构感更强的律所官网与法务平台用已收录的 .law 更庄重，两者常见打法是 .law 做所、.lawyer 做人；二是各地律师广告合规规则不同，域名措辞（如 best/top 字样）注意执业规范；三是面向英语市场最有效，中文市场认知度有限，国内业务建议搭配 .com / .cn 使用。命名上「姓氏 + .lawyer」适合个人品牌，「城市 + 领域 + .lawyer」适合获客落地页（如 miamidivorce.lawyer），「firm 名 + .lawyer」适合小团队。",
      bestFor: ["律师个人品牌与独立执业", "律师事务所与小团队", "专项法律服务（离婚/移民/刑辩）", "法律咨询与获客落地页"],
      namingTips: [
        "「姓氏 + .lawyer」个人品牌一步到位",
        "「城市 + 领域 + .lawyer」是天然的获客落地页",
        "机构感更强的律所主站用 .law，个人与团队用这里",
        "注意律师广告合规，域名慎用 best/top 等措辞",
      ],
    },
    en: {
      title: ".lawyer Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".lawyer writes the profession into the address — for personal attorney brands and solo practices, law firms, focused legal services (divorce, immigration, defense), and legal-intake landing pages. See live pricing and naming advice, then hunt available .lawyer names with AI.",
      intro:
        ".lawyer writes the profession into the address: personal attorney brands and solo practices, law firms, focused services like divorce, immigration or criminal defense, and legal-intake landing pages on name.lawyer make \"I'm a lawyer\" self-evident — when clients search city + lawyer or practice-area + lawyer, the domain itself is ad copy. Operated by Identity Digital, about $50/yr flat for registration and renewal — trivial next to legal-industry client values. Inventory is excellent: surnames, cities and practice-area words nearly all hit. Three cautions: .lawyer points at the individual or team, so institution-leaning firm sites and legal platforms read more formal on the already-listed .law — a common split is .law for the firm, .lawyer for the person; attorney-advertising rules vary by jurisdiction, so mind wording like best/top in the name; and it works best for English-speaking markets — pair with .com locally elsewhere. Naming: surname + .lawyer nails a personal brand; city + practice + .lawyer (miamidivorce.lawyer) is a natural intake page; firm name + .lawyer fits small teams.",
      bestFor: ["Personal attorney brands & solo practices", "Law firms & small teams", "Focused legal services (divorce/immigration/defense)", "Legal-intake landing pages"],
      namingTips: [
        "Surname + .lawyer nails a personal brand in one step",
        "City + practice + .lawyer is a natural intake landing page",
        "Institution-leaning firm sites read better on .law",
        "Mind attorney-advertising rules — avoid best/top wording",
      ],
    },
  },
  legal: {
    tld: "legal",
    zh: {
      title: ".legal 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".legal 是法律服务的通用行业后缀，适合法律科技与合同工具、企业法务与合规服务、法律咨询平台、公证与文书服务。查看 .legal 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .legal 域名。",
      intro:
        ".legal 比 .lawyer 更宽一档：不止律师，法律科技与合同工具、企业法务与合规服务、法律咨询平台、公证与文书服务都装得下——legaltech 创业公司用 name.legal 既点明行业又不把自己框成「一位律师」。注册局为 Identity Digital，注册约 $6（约 ¥41），续费约 $57/年（约 ¥412）——首年低门槛、续费在行业词后缀里中等偏上，适合验证期低成本入场、跑通后长期持有。库存极好：功能词、品牌词、组合词基本都有货。注意三点：一是「首年便宜续费贵」结构明显，注册前把 10 倍续费价算进预算；二是与已收录 .law / .lawyer 的分工——律所主站用 .law、律师个人用 .lawyer、法律产品与平台用 .legal 最顺；三是 .legal 自带「合规、正式」气质，域名前缀反而可以轻松一点（如 get/use 动词前缀），避免整体过于严肃。命名上「产品词 + .legal」适合法律科技（如 sign.legal、contract.legal 风格），「品牌 + .legal」适合合规服务，「城市/行业 + .legal」适合咨询平台。",
      bestFor: ["法律科技与合同工具", "企业法务与合规服务", "法律咨询平台", "公证与文书服务"],
      namingTips: [
        "「产品词 + .legal」法律科技一眼说清（sign/contract 风格）",
        "首年约 $6 但续费约 $57/年，预算按续费价算",
        "律所用 .law、律师个人用 .lawyer、法律产品用这里",
        "后缀已够正式，前缀可用 get/use 等轻快动词",
      ],
    },
    en: {
      title: ".legal Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".legal is the broad legal-services suffix — for legaltech and contract tools, corporate legal and compliance services, legal-advice platforms, and notary and document services. See live pricing and naming advice, then hunt available .legal names with AI.",
      intro:
        ".legal is a notch broader than .lawyer: beyond attorneys, it fits legaltech and contract tools, corporate legal and compliance services, legal-advice platforms, and notary or document services — a legaltech startup on name.legal names the industry without boxing itself in as one lawyer. Operated by Identity Digital, about $6 to register but $57/yr to renew — a low first-year door with a mid-to-high renewal among industry gTLDs, good for cheap validation then committed holding. Inventory is excellent: function words, brand words and compounds nearly all hit. Three cautions: the cheap-first-year structure is stark, so budget on the ~10x renewal; split the work with the already-listed .law and .lawyer — firm sites on .law, individual attorneys on .lawyer, legal products and platforms flow best on .legal; and the suffix already radiates formality, so the prefix can afford to be light (get/use verb prefixes) without undermining trust. Naming: product word + .legal reads instantly for legaltech (sign.legal, contract.legal style); brand + .legal fits compliance services; city/industry + .legal fits advice platforms.",
      bestFor: ["Legaltech & contract tools", "Corporate legal & compliance services", "Legal-advice platforms", "Notary & document services"],
      namingTips: [
        "Product word + .legal reads instantly for legaltech",
        "About $6 year one but $57/yr renewal — budget on renewal",
        "Firms fit .law, attorneys .lawyer, legal products here",
        "The suffix is formal already — a light get/use prefix works",
      ],
    },
  },
  delivery: {
    tld: "delivery",
    zh: {
      title: ".delivery 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".delivery 把「配送」写进域名，适合外卖与生鲜配送、同城跑腿与即时达、鲜花蛋糕等垂直配送、物流末端服务。查看 .delivery 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .delivery 域名。",
      intro:
        ".delivery 把服务本身写进域名：外卖与生鲜配送、同城跑腿与即时达、鲜花蛋糕等垂直品类配送、物流末端服务用 name.delivery，「送什么」+「.delivery」连起来就是一句完整的服务承诺——flowers.delivery 这样的组合读出来即广告。注册局为 Identity Digital，注册约 $5（约 ¥37），续费约 $50/年（约 ¥360）——首年几乎零门槛，续费中档，适合先低成本上线单城试点、跑通再续。库存极好：品类词、城市词、品牌词基本都有货，这是 .com 里早已绝迹的红利。注意三点：一是「首年便宜续费贵」，多域名矩阵（每个品类一个域名）时续费成本会成倍放大，主站建议收敛到一个品牌域名；二是后缀 8 字符偏长，口播场景选短前缀平衡总长度；三是与已收录 .express 的分工——强调「快」用 .express，强调「送上门」用 .delivery 更具体。命名上「品类 + .delivery」适合垂直配送（flowers/cake 风格），「城市 + .delivery」适合同城服务，「品牌 + .delivery」适合平台型业务。",
      bestFor: ["外卖与生鲜配送", "同城跑腿与即时达", "鲜花蛋糕垂直配送", "物流末端服务"],
      namingTips: [
        "「品类 + .delivery」读出来就是服务承诺（flowers/cake 风格）",
        "首年约 $5、续费约 $50/年，试点便宜、矩阵慎重",
        "后缀 8 字符偏长，前缀选短词平衡总长度",
        "强调快用 .express，强调送上门用这里",
      ],
    },
    en: {
      title: ".delivery Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".delivery writes the service into the address — for food and grocery delivery, same-city courier and instant-delivery services, vertical delivery niches like flowers and cakes, and last-mile logistics. See live pricing and naming advice, then hunt available .delivery names with AI.",
      intro:
        ".delivery writes the service itself into the address: food and grocery delivery, same-city couriers and instant-delivery services, vertical niches like flowers and cakes, and last-mile logistics on name.delivery turn what-you-deliver + .delivery into a complete promise — flowers.delivery reads as ad copy out loud. Operated by Identity Digital, about $5 to register and $50/yr to renew — a near-zero first-year door with a mid renewal, ideal for launching a single-city pilot cheaply and renewing once it works. Inventory is excellent: category words, city names and brand words nearly all hit — a windfall long extinct on .com. Three cautions: the cheap-first-year structure means a multi-domain matrix (one per category) multiplies renewal costs, so consolidate the main site onto one brand domain; the 8-character suffix leans long, so pick a short prefix for spoken-word balance; and split the work with the already-listed .express — emphasize speed on .express, emphasize to-your-door on the more concrete .delivery. Naming: category + .delivery fits vertical services (flowers/cake style); city + .delivery fits same-city operations; brand + .delivery fits platform plays.",
      bestFor: ["Food & grocery delivery", "Same-city courier & instant delivery", "Vertical delivery niches (flowers/cakes)", "Last-mile logistics"],
      namingTips: [
        "Category + .delivery reads as a service promise out loud",
        "About $5 year one, $50/yr renewal — cheap pilot, careful matrix",
        "The 8-character suffix leans long — keep the prefix short",
        "Speed-first fits .express; to-your-door fits here",
      ],
    },
  },
  recipes: {
    tld: "recipes",
    zh: {
      title: ".recipes 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".recipes 是菜谱与美食内容的专属后缀，适合菜谱站与美食博客、烹饪课程与教学、饮食计划与营养搭配、食品品牌的内容营销。查看 .recipes 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .recipes 域名。",
      intro:
        ".recipes 一词点明内容形态：菜谱站与美食博客、烹饪课程与教学、饮食计划与营养搭配、食品品牌的内容营销用 name.recipes，读者点开前就知道「这里有做法」——grandma.recipes 这样的组合自带故事感，keto.recipes 这样的组合自带精准流量。注册局为 Identity Digital，注册约 $7（约 ¥48），续费约 $62/年（约 ¥449）——首年低门槛，续费在内容类后缀里偏高，适合认真做内容资产的站长而非囤域名。库存极好：菜系、食材、饮食流派词基本都有货。注意三点：一是「首年便宜续费贵」结构明显，做满一年再决定是否长期投入；二是复数形式暗示「一批菜谱」的集合感，适合内容库与合集站，单道招牌菜或餐厅官网用已收录的 .menu / .restaurant 更贴；三是与 .kitchen / .coffee 等的分工——厨房用品与装修用 .kitchen，咖啡垂直用 .coffee，「可跟着做的内容」用 .recipes 最准。命名上「饮食流派 + .recipes」适合垂直内容（keto/vegan 风格），「人名/品牌 + .recipes」适合个人 IP，「食材 + .recipes」适合 SEO 向合集站。",
      bestFor: ["菜谱站与美食博客", "烹饪课程与教学", "饮食计划与营养搭配", "食品品牌内容营销"],
      namingTips: [
        "「饮食流派 + .recipes」精准截流（keto/vegan 风格）",
        "首年约 $7 但续费约 $62/年，认真做内容再长持",
        "复数是「合集」语感，单店官网用 .menu / .restaurant",
        "「人名 + .recipes」个人 IP 自带故事感",
      ],
    },
    en: {
      title: ".recipes Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".recipes is the dedicated suffix for cooking content — for recipe sites and food blogs, cooking courses, meal planning and nutrition, and food-brand content marketing. See live pricing and naming advice, then hunt available .recipes names with AI.",
      intro:
        ".recipes names the content format outright: recipe sites and food blogs, cooking courses, meal planning and nutrition, and food-brand content marketing on name.recipes tell readers \"how-to lives here\" before the click — grandma.recipes carries a story, keto.recipes carries precise search intent. Operated by Identity Digital, about $7 to register and $62/yr to renew — a low first-year door with a renewal on the high side for content suffixes, suited to site owners building a real content asset rather than domain hoarders. Inventory is excellent: cuisines, ingredients and diet-movement words nearly all hit. Three cautions: the cheap-first-year structure is stark, so run a full year before committing long term; the plural form implies a collection, fitting content libraries and roundup sites, while a single signature dish or restaurant homepage reads better on the already-listed .menu or .restaurant; and split the work with .kitchen and .coffee — kitchenware and remodels fit .kitchen, coffee verticals fit .coffee, and follow-along content is most precise on .recipes. Naming: diet + .recipes fits vertical content (keto/vegan style); name/brand + .recipes fits personal IP; ingredient + .recipes fits SEO-driven collections.",
      bestFor: ["Recipe sites & food blogs", "Cooking courses & tutorials", "Meal planning & nutrition", "Food-brand content marketing"],
      namingTips: [
        "Diet + .recipes captures precise search intent (keto/vegan)",
        "About $7 year one but $62/yr renewal — commit for content",
        "Plural implies a collection — single venues fit .menu / .restaurant",
        "Name + .recipes gives personal IP a built-in story",
      ],
    },
  },
  rent: {
    tld: "rent",
    zh: {
      title: ".rent 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".rent 把「租」写进域名，适合房屋与公寓出租平台、设备与工具租赁、服装与奢侈品租赁、汽车与房车租赁。查看 .rent 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .rent 域名。",
      intro:
        ".rent 一个动词说清商业模式：房屋与公寓出租平台、设备与工具租赁、服装与奢侈品租赁、汽车与房车租赁用 name.rent，「租什么」一目了然——camera.rent 这样的「品类 + .rent」组合本身就是搜索词，4 字符后缀也足够短。注册局为 XYZ（.xyz 同门），注册约 $10（约 ¥74），续费约 $52/年（约 ¥374）——首年低门槛、续费中档，适合先验证品类再决定长持。库存极好：品类词、城市词、品牌词基本都有货。注意三点：一是「首年便宜续费贵」，多品类矩阵注册时按续费价算总账；二是与已收录 .rentals 的分工——.rent 是动词、短促有行动感，适合品牌主站与「租 X」场景，.rentals 是名词复数、集合感强，适合聚合列表站，同名双注册可互相导流；三是租赁交易涉及押金与信任，域名之外品牌资质展示要跟上。命名上「品类 + .rent」适合垂直租赁（camera/dress 风格），「城市 + .rent」适合本地房屋出租，「品牌 + .rent」适合平台型业务。",
      bestFor: ["房屋与公寓出租平台", "设备与工具租赁", "服装与奢侈品租赁", "汽车与房车租赁"],
      namingTips: [
        "「品类 + .rent」本身就是搜索词（camera/dress 风格）",
        "首年约 $10、续费约 $52/年，验证期友好",
        "动词短促适合主站，聚合列表站用 .rentals",
        "本地房屋出租用「城市 + .rent」直接截流",
      ],
    },
    en: {
      title: ".rent Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".rent puts the business model in one verb — for home and apartment rental platforms, equipment and tool rental, fashion and luxury rental, and car and RV rental. See live pricing and naming advice, then hunt available .rent names with AI.",
      intro:
        ".rent states the business model in one verb: home and apartment rental platforms, equipment and tool rental, fashion and luxury rental, and car or RV rental on name.rent make what's-for-rent obvious — category + .rent combos like camera.rent are the search query itself, and the 4-character suffix stays short. Operated by the XYZ registry (of .xyz fame), about $10 to register and $52/yr to renew — a low first-year door with a mid renewal, good for validating a category before committing. Inventory is excellent: category words, city names and brand words nearly all hit. Three cautions: with the cheap-first-year structure, price a multi-category matrix at renewal rates; split the work with the already-listed .rentals — .rent is a verb, punchy and action-first, fitting brand homepages and rent-an-X plays, while the plural noun .rentals reads like a listings aggregator, and registering both of a name channels traffic; and rental businesses run on deposits and trust, so back the domain with visible credentials. Naming: category + .rent fits vertical rental (camera/dress style); city + .rent fits local housing; brand + .rent fits platform plays.",
      bestFor: ["Home & apartment rental platforms", "Equipment & tool rental", "Fashion & luxury rental", "Car & RV rental"],
      namingTips: [
        "Category + .rent is the search query itself (camera/dress)",
        "About $10 year one, $52/yr renewal — validation-friendly",
        "The punchy verb fits homepages; listings fit .rentals",
        "City + .rent captures local housing searches outright",
      ],
    },
  },
  church: {
    tld: "church",
    zh: {
      title: ".church 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".church 是教会与信仰社区的专属后缀，适合地方教会与堂点、教会植堂与联合机构、线上敬拜与讲道平台、信仰内容与查经资源站。查看 .church 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .church 域名。",
      intro:
        ".church 把「教会」直接写进域名：地方教会与堂点、植堂与联合机构、线上敬拜与讲道直播平台、查经与信仰内容站用 name.church，会众和慕道友一眼认出这是教会官网——搜「地名 + church」找聚会点的人落到 grace.church 这样的域名毫无违和。注册局为 Identity Digital，首年约 $7（约 ¥48），续费约 $47/年（约 ¥337），首年低门槛适合新植堂验证；续费在行业后缀里属中档，对以奉献维持运营的教会而言仍是可承受的年度开销。库存极好：地名、堂会名、经文关键词基本都有货，而这些名字在 .org 上早被占光。注意三点：一是 .church 语义强绑定基督教会场景，跨宗教或综合公益组织用 .org 更中性；二是老牌教会已有 .org 的可将 .church 作为传播用短域名跳转主站，新堂会则可直接主用；三是续费约 ¥337/年，多堂点矩阵注册前按续费价算总账。命名上「地名 + .church」适合本地堂会，「品牌/异象词 + .church」适合植堂网络，「online/live + .church」适合线上敬拜平台。",
      bestFor: ["地方教会与堂点", "教会植堂与联合机构", "线上敬拜与讲道平台", "信仰内容与查经资源站"],
      namingTips: [
        "「地名 + .church」就是慕道友的搜索词，本地堂会首选",
        "首年约 $7 低门槛，续费约 $47/年按此算长期成本",
        "跨宗教或综合公益用 .org 更中性，教会身份用这里",
        "线上敬拜可用 online/live + .church 直接说清形态",
      ],
    },
    en: {
      title: ".church Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".church is the dedicated suffix for churches and faith communities — for local churches and campuses, church plants and networks, online worship and sermon platforms, and Bible study and faith content sites. See live pricing and naming advice, then hunt available .church names with AI.",
      intro:
        ".church writes the congregation into the domain: local churches and campuses, church plants and denominational networks, online worship and sermon streaming platforms, and Bible study or faith content sites on name.church are instantly recognizable as church websites — someone searching city + church lands on grace.church with zero friction. Operated by Identity Digital, about $7 for the first year (≈¥48) and $47/yr to renew (≈¥337) — a low first-year door that suits new church plants, with a mid-tier renewal that a donation-funded congregation can sustain. Inventory is excellent: place names, congregation names and scripture keywords nearly all hit, while the same names on .org were taken long ago. Three cautions: .church is semantically bound to Christian congregations, so interfaith or general nonprofits read more neutrally on .org; established churches already on .org can run .church as a short promotional redirect, while new plants can make it the primary; and at ≈$47/yr renewal, price a multi-campus portfolio at renewal rates before committing. Naming: city + .church fits local congregations; brand or vision word + .church fits planting networks; online/live + .church states the digital-worship format outright.",
      bestFor: ["Local churches & campuses", "Church plants & networks", "Online worship & sermon platforms", "Bible study & faith content sites"],
      namingTips: [
        "City + .church is exactly what seekers search — local first choice",
        "About $7 year one, $47/yr renewal — budget on the latter",
        "Interfaith or general nonprofits read better on .org",
        "online/live + .church states the digital format outright",
      ],
    },
  },
  jewelry: {
    tld: "jewelry",
    zh: {
      title: ".jewelry 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".jewelry 是珠宝行业的专属后缀，适合珠宝品牌与设计师工作室、金店银楼与钻石商、手作饰品电商、珠宝定制与鉴定服务。查看 .jewelry 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .jewelry 域名。",
      intro:
        ".jewelry 把整个品类写进后缀：珠宝品牌与设计师工作室、金店银楼与钻石商、手作饰品电商、定制与鉴定服务用 name.jewelry，品牌名 + 品类词一步到位——aurora.jewelry 比 aurorajewelry.com 更短更雅，也把被 .com 占光的珠宝好名重新放回货架。注册局为 Identity Digital，首年约 $11（约 ¥78），续费约 $52/年（约 ¥374），对客单价高的珠宝生意来说是可忽略的获客成本。库存极好：宝石词、设计师名、品牌词基本都有货。注意三点：一是后缀 7 个字母偏长，主打口播传播的品牌要读顺再定，印刷与包装上反而是加分项；二是与已收录的 .boutique / .shop 分工——.jewelry 说品类、气质高奢，综合买手店用 .boutique，大而全电商用 .shop；三是首年便宜续费中档，系列域名按续费价算总账。命名上「品牌 + .jewelry」适合珠宝品牌主站，「宝石/材质词 + .jewelry」适合垂类电商，「设计师名 + .jewelry」适合工作室与定制业务。",
      bestFor: ["珠宝品牌与设计师工作室", "金店银楼与钻石商", "手作饰品电商", "珠宝定制与鉴定服务"],
      namingTips: [
        "「品牌 + .jewelry」品牌名加品类词一步到位",
        "首年约 $11、续费约 $52/年，对高客单生意可忽略",
        "综合买手店用 .boutique、大而全电商用 .shop 更贴",
        "设计师名 + .jewelry 适合工作室与定制业务",
      ],
    },
    en: {
      title: ".jewelry Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".jewelry is the jewelry industry's dedicated suffix — for jewelry brands and designer studios, gold and diamond dealers, handmade accessory shops, and custom design and appraisal services. See live pricing and naming advice, then hunt available .jewelry names with AI.",
      intro:
        ".jewelry puts the whole category in the suffix: jewelry brands and designer studios, gold and diamond dealers, handmade accessory e-commerce, and custom design or appraisal services on name.jewelry get brand plus category in one stroke — aurora.jewelry is shorter and more elegant than aurorajewelry.com, and it puts jewelry names long gone on .com back on the shelf. Operated by Identity Digital, about $11 for the first year (≈¥78) and $52/yr to renew (≈¥374) — negligible customer-acquisition cost for a high-ticket trade. Inventory is excellent: gemstone words, designer names and brand words nearly all hit. Three cautions: at seven letters the suffix runs long, so say it aloud before committing if radio or word-of-mouth is your channel — on print and packaging it reads as a plus; split the work with the already-listed .boutique and .shop — .jewelry names the category with a luxury air, multi-brand boutiques fit .boutique, and general storefronts fit .shop; and with the cheap-first-year structure, price a domain series at renewal rates. Naming: brand + .jewelry fits flagship brand sites; gemstone or material word + .jewelry fits vertical e-commerce; designer name + .jewelry fits studios and custom work.",
      bestFor: ["Jewelry brands & designer studios", "Gold & diamond dealers", "Handmade accessory shops", "Custom design & appraisal services"],
      namingTips: [
        "Brand + .jewelry delivers brand plus category in one stroke",
        "About $11 year one, $52/yr renewal — trivial for high-ticket trade",
        "Multi-brand boutiques fit .boutique; general shops fit .shop",
        "Designer name + .jewelry fits studios and custom work",
      ],
    },
  },
  cleaning: {
    tld: "cleaning",
    zh: {
      title: ".cleaning 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".cleaning 是清洁服务行业的专属后缀，适合家政保洁与开荒公司、商业办公楼保洁、专项清洁（地毯/外墙/管道）、清洁设备与耗材品牌。查看 .cleaning 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .cleaning 域名。",
      intro:
        ".cleaning 把服务内容说得一字不差：家政保洁与开荒公司、写字楼与商业保洁、地毯/外墙/管道等专项清洁、清洁设备与耗材品牌用 name.cleaning，客户搜「城市名 + cleaning」找的就是它——sparkle.cleaning 这样的名字本身就是广告语。注册局为 Identity Digital，注册与续费均约 $60/年（约 ¥434），平进平出、无首年陷阱，在行业后缀里价格偏高但换来极好的库存：城市名、动词词组、品牌词基本都有货，而 XXcleaning.com 早被各地保洁公司占光。注意三点：一是约 ¥434/年的持有成本对单店家政是笔真实开销，适合已有稳定客源、把域名当门面的公司，起步期可先用已收录的 .services 过渡；二是与 .services 的分工——.cleaning 说品类精准获客，多业态家政平台用 .services 更宽；三是本地服务生意记得同步做好地图与本地 SEO，域名里的关键词是加分不是全部。命名上「城市 + .cleaning」适合本地获客，「品牌 + .cleaning」适合连锁保洁，「专项词（carpet/window）+ .cleaning」适合垂类服务。",
      bestFor: ["家政保洁与开荒公司", "商业办公楼保洁", "专项清洁（地毯/外墙/管道）", "清洁设备与耗材品牌"],
      namingTips: [
        "「城市 + .cleaning」就是客户的搜索词，本地获客首选",
        "注册续费均约 $60/年，平进平出但按年算好持有成本",
        "多业态家政平台用 .services 更宽，专注保洁用这里",
        "专项词 carpet/window + .cleaning 直接说清垂类",
      ],
    },
    en: {
      title: ".cleaning Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".cleaning is the cleaning industry's dedicated suffix — for residential and move-out cleaning companies, commercial and office janitorial services, specialty cleaning (carpet/window/duct), and cleaning equipment and supply brands. See live pricing and naming advice, then hunt available .cleaning names with AI.",
      intro:
        ".cleaning says the service word for word: residential and move-out cleaners, office and commercial janitorial firms, specialty carpet/window/duct crews, and cleaning equipment or supply brands on name.cleaning match exactly what customers type when they search city + cleaning — a name like sparkle.cleaning is its own slogan. Operated by Identity Digital, about $60/yr for both registration and renewal (≈¥434) — flat in, flat out, no first-year trap; pricier than most industry gTLDs, but the payoff is superb inventory: city names, verb phrases and brand words nearly all hit, while every XXcleaning.com was claimed by local firms long ago. Three cautions: at ≈$60/yr the holding cost is real for a one-crew operation — it suits established companies treating the domain as a storefront, while early-stage outfits can start on the already-listed .services; split the work with .services — .cleaning names the category for precise lead capture, multi-trade platforms read wider on .services; and local service businesses still live on maps and local SEO — the keyword in the domain is a boost, not the whole game. Naming: city + .cleaning fits local lead-gen; brand + .cleaning fits franchise chains; specialty word (carpet/window) + .cleaning states the vertical outright.",
      bestFor: ["Residential & move-out cleaning", "Commercial & office janitorial", "Specialty cleaning (carpet/window/duct)", "Cleaning equipment & supply brands"],
      namingTips: [
        "City + .cleaning is exactly what customers search",
        "About $60/yr flat both ways — budget the holding cost",
        "Multi-trade platforms read wider on .services",
        "carpet/window + .cleaning states the vertical outright",
      ],
    },
  },
  plumbing: {
    tld: "plumbing",
    zh: {
      title: ".plumbing 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".plumbing 是水暖管道行业的专属后缀，适合水管维修与疏通服务、水暖安装工程公司、卫浴与管件供应商、应急上门维修平台。查看 .plumbing 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .plumbing 域名。",
      intro:
        ".plumbing 是最早一批行业 gTLD 之一：水管维修与疏通、水暖安装工程、卫浴与管件供应、24 小时应急上门平台用 name.plumbing，爆管漏水的客户搜「城市名 + plumbing」时你的域名就是搜索词本身——对靠急单吃饭的行业，这种精准匹配直接变成电话量。注册局为 Identity Digital，首年约 $8（约 ¥59），续费约 $58/年（约 ¥419），首年低门槛适合试水，续费按获客价值算完全值回。库存极好：城市名、师傅姓氏、品牌词基本都有货，而 XXplumbing.com 在英语市场早被本地水暖公司抢光。注意三点：一是主要面向英语市场，中文语境「水暖/管道」认知需要品牌自己建立；二是首年便宜续费贵 7 倍，多城市矩阵按续费价算总账；三是与 .repair / .services 的分工——综合维修用 .repair，多业态家政用 .services，水暖专业身份用 .plumbing 最准。命名上「城市 + .plumbing」适合本地急单获客，「姓氏/品牌 + .plumbing」适合老牌水暖行，「emergency/24h + .plumbing」适合应急平台。",
      bestFor: ["水管维修与疏通服务", "水暖安装工程公司", "卫浴与管件供应商", "应急上门维修平台"],
      namingTips: [
        "「城市 + .plumbing」就是急单客户的搜索词",
        "首年约 $8、续费约 $58/年，矩阵注册按续费算总账",
        "综合维修用 .repair 更宽，水暖专业身份用这里",
        "emergency/24h + .plumbing 直接说清应急定位",
      ],
    },
    en: {
      title: ".plumbing Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".plumbing is the plumbing trade's dedicated suffix — for repair and drain services, plumbing installation contractors, bathroom and pipe fitting suppliers, and 24/7 emergency callout platforms. See live pricing and naming advice, then hunt available .plumbing names with AI.",
      intro:
        ".plumbing is one of the original trade gTLDs: repair and drain-clearing services, installation contractors, bathroom and pipe-fitting suppliers, and 24/7 emergency callout platforms on name.plumbing match the exact phrase a customer with a burst pipe types — city + plumbing — and in a trade that lives on urgent calls, that precision converts straight into phone calls. Operated by Identity Digital, about $8 for the first year (≈¥59) and $58/yr to renew (≈¥419) — a low first-year door for testing, with a renewal that pays for itself in lead value. Inventory is excellent: city names, family names and brand words nearly all hit, while every XXplumbing.com in English-speaking markets was claimed by local firms long ago. Three cautions: it targets English-speaking markets first, so plan brand-building if your audience thinks in another language; the first year is cheap but renewal runs 7× — price a multi-city matrix at renewal rates; and split the work with .repair and .services — general repair fits .repair, multi-trade home services fit .services, while the plumbing identity is truest here. Naming: city + .plumbing fits urgent local lead-gen; family name or brand + .plumbing fits established firms; emergency/24h + .plumbing states the callout positioning outright.",
      bestFor: ["Repair & drain services", "Plumbing installation contractors", "Bathroom & pipe fitting suppliers", "24/7 emergency callout platforms"],
      namingTips: [
        "City + .plumbing is the burst-pipe search phrase itself",
        "About $8 year one, $58/yr renewal — matrix at renewal rates",
        "General repair fits .repair; the trade identity lives here",
        "emergency/24h + .plumbing states the callout model outright",
      ],
    },
  },
  catering: {
    tld: "catering",
    zh: {
      title: ".catering 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".catering 是餐饮外烩行业的专属后缀，适合宴会与活动餐饮公司、企业团餐与工作餐配送、婚礼与派对外烩、私厨与上门宴席服务。查看 .catering 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .catering 域名。",
      intro:
        ".catering 把「外烩承办」写进域名：宴会与活动餐饮、企业团餐与工作餐配送、婚礼与派对外烩、私厨上门宴席用 name.catering，办活动找餐饮的客户搜「城市名/菜系 + catering」落到你的域名毫无损耗——feast.catering 这样的名字本身就说清了生意。注册局为 Identity Digital，注册与续费均约 $31/年（约 ¥226），平进平出、无首年陷阱，在行业后缀里属中档好持有的一档。库存极好：城市名、菜系词、品牌词基本都有货。注意三点：一是与已收录的 .restaurant / .kitchen 分工——堂食门店用 .restaurant，中央厨房与美食内容用 .kitchen，承办外烩用 .catering 最准；二是外烩生意重案例与口碑，域名之外把作品集和客户评价做足；三是主要面向英语市场，中文语境可作为品牌官网的国际版入口。命名上「城市 + .catering」适合本地承接，「菜系/风格词 + .catering」适合垂类外烩，「品牌 + .catering」适合连锁餐饮的外烩业务线。",
      bestFor: ["宴会与活动餐饮公司", "企业团餐与工作餐配送", "婚礼与派对外烩", "私厨与上门宴席服务"],
      namingTips: [
        "「城市 + .catering」就是办活动客户的搜索词",
        "注册续费均约 $31/年，平进平出好持有",
        "堂食用 .restaurant、中央厨房用 .kitchen，外烩用这里",
        "菜系/风格词 + .catering 直接说清垂类定位",
      ],
    },
    en: {
      title: ".catering Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".catering is the catering industry's dedicated suffix — for banquet and event caterers, corporate meal and office lunch delivery, wedding and party catering, and private chef and pop-up dinner services. See live pricing and naming advice, then hunt available .catering names with AI.",
      intro:
        ".catering writes the trade into the domain: banquet and event caterers, corporate meal and office-lunch programs, wedding and party specialists, and private chef or pop-up dinner services on name.catering catch event planners searching city or cuisine + catering with zero loss — a name like feast.catering explains the business by itself. Operated by Identity Digital, about $31/yr for both registration and renewal (≈¥226) — flat in, flat out, none of the first-year trap, sitting in the easy-to-hold middle tier of industry gTLDs. Inventory is excellent: city names, cuisine words and brand words nearly all hit. Three cautions: split the work with the already-listed .restaurant and .kitchen — dine-in venues fit .restaurant, commissary kitchens and food content fit .kitchen, while the catering trade is truest here; catering runs on portfolios and word of mouth, so back the domain with case photos and client reviews; and it targets English-speaking markets first — elsewhere it works well as the international front door of a food brand. Naming: city + .catering fits local booking; cuisine or style word + .catering fits vertical specialists; brand + .catering fits the catering arm of a restaurant group.",
      bestFor: ["Banquet & event caterers", "Corporate meal & lunch delivery", "Wedding & party catering", "Private chef & pop-up dinners"],
      namingTips: [
        "City + .catering is exactly what event planners search",
        "About $31/yr flat for both registration and renewal",
        "Dine-in fits .restaurant, commissaries fit .kitchen",
        "Cuisine or style word + .catering states the vertical",
      ],
    },
  },
  florist: {
    tld: "florist",
    zh: {
      title: ".florist 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".florist 是花店与花艺行业的专属后缀，适合本地花店与鲜花速递、花艺工作室与婚礼布置、订阅制鲜花电商、花艺课程与培训。查看 .florist 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .florist 域名。",
      intro:
        ".florist 三个音节就是「花艺师」：本地花店与鲜花速递、花艺工作室与婚礼布置、订阅制鲜花电商、花艺课程培训用 name.florist，买花的人搜「城市名 + florist」找的就是它——bloom.florist 这样的名字自带画面感，印在花束卡片上也雅致。注册局为 Identity Digital，首年约 $8（约 ¥59），续费约 $26/年（约 ¥189），首年低门槛、续费也便宜，在行业后缀里属于少见的「便宜进便宜养」。库存极好：城市名、花名、品牌词基本都有货，而 XXflowers.com / XXflorist.com 早被同行占光。注意三点：一是说的是「花艺师/花店」职业身份，卖种子园艺资材的用已收录的 .garden 更贴；二是与 .boutique 的分工——花店身份用 .florist 最准，主打精品调性的花艺买手店可用 .boutique；三是鲜花是强本地与强时效生意，域名之外把地图收录与同城配送时效讲清楚。命名上「城市 + .florist」适合本地花店，「花名/意象词 + .florist」适合花艺品牌，「品牌 + .florist」适合订阅制鲜花电商。",
      bestFor: ["本地花店与鲜花速递", "花艺工作室与婚礼布置", "订阅制鲜花电商", "花艺课程与培训"],
      namingTips: [
        "「城市 + .florist」就是买花人的搜索词，本地花店首选",
        "首年约 $8、续费约 $26/年，便宜进便宜养",
        "园艺资材用 .garden 更贴，花艺师身份用这里",
        "花名/意象词 + .florist 自带画面感适合品牌",
      ],
    },
    en: {
      title: ".florist Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".florist is the floristry trade's dedicated suffix — for local flower shops and same-day delivery, floral design studios and wedding decor, subscription flower e-commerce, and floristry courses and training. See live pricing and naming advice, then hunt available .florist names with AI.",
      intro:
        ".florist names the profession in three syllables: local flower shops and same-day delivery, floral design studios and wedding decorators, subscription flower e-commerce, and floristry schools on name.florist match exactly what flower buyers search — city + florist — and a name like bloom.florist carries its own imagery, sitting elegantly on a bouquet card. Operated by Identity Digital, about $8 for the first year (≈¥59) and just $26/yr to renew (≈¥189) — a rare cheap-in, cheap-to-hold profile among industry gTLDs. Inventory is excellent: city names, flower names and brand words nearly all hit, while every XXflowers.com and XXflorist.com was claimed by the trade long ago. Three cautions: it names the florist profession, so seed and garden-supply shops read better on the already-listed .garden; split the work with .boutique — the florist identity is truest here, while a curated floral concept store can lean .boutique; and flowers are a hyper-local, time-critical trade — beyond the domain, nail your map listing and same-day delivery promise. Naming: city + .florist fits local shops; flower or imagery word + .florist fits floral brands; brand + .florist fits subscription e-commerce.",
      bestFor: ["Local flower shops & same-day delivery", "Floral design studios & wedding decor", "Subscription flower e-commerce", "Floristry courses & training"],
      namingTips: [
        "City + .florist is exactly what flower buyers search",
        "About $8 year one, $26/yr renewal — cheap in, cheap to hold",
        "Seed and garden supply fit .garden; the trade lives here",
        "Flower or imagery word + .florist carries its own imagery",
      ],
    },
  },
  courses: {
    tld: "courses",
    zh: {
      title: ".courses 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".courses 是在线课程与教学内容的专属后缀，适合在线课程平台与独立讲师、职业技能与考证培训、企业内训与知识付费、兴趣与语言学习课程。查看 .courses 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .courses 域名。",
      intro:
        ".courses 把「课程」直接写进域名：在线课程平台与独立讲师、职业技能与考证培训、企业内训与知识付费、兴趣与语言学习项目用 name.courses，学员搜「主题 + courses」时域名就是搜索词本身——python.courses 这样的名字不用解释就知道卖什么。注册局为 Open Universities Australia（澳大利亚开放大学联盟），首年约 $2（约 ¥11），续费约 $31/年（约 ¥226），首年几乎零成本试水，续费在内容后缀里属中档。库存极好：学科词、技能词、品牌词基本都有货，而 XXcourses.com 在英语市场早被在线教育公司抢光。注意三点：一是复数形式暗示「课程目录」，单门课或个人品牌可斟酌是否用已收录的 .academy / .school；二是首年便宜续费贵 20 倍，批量注册按续费价算总账；三是与 .education / .training 的分工——机构官网用 .education，线下实训用 .training，在线课程目录用 .courses 最准。命名上「学科/技能 + .courses」适合垂类课程站，「品牌 + .courses」适合知识付费矩阵，「城市 + .courses」适合本地培训机构。",
      bestFor: ["在线课程平台与独立讲师", "职业技能与考证培训", "企业内训与知识付费", "兴趣与语言学习课程"],
      namingTips: [
        "「学科/技能 + .courses」就是学员的搜索词",
        "首年约 $2、续费约 $31/年，矩阵注册按续费算总账",
        "机构官网用 .education，在线课程目录用这里",
        "品牌 + .courses 适合知识付费的课程矩阵入口",
      ],
    },
    en: {
      title: ".courses Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".courses is the dedicated suffix for online courses and teaching content — for course platforms and independent instructors, vocational and certification training, corporate learning and paid knowledge products, and hobby or language courses. See live pricing and naming advice, then hunt available .courses names with AI.",
      intro:
        ".courses writes the product into the domain: online course platforms and independent instructors, vocational and certification training, corporate learning programs and paid knowledge products on name.courses match exactly what learners search — topic + courses — and a name like python.courses needs no explanation. Operated by Open Universities Australia, about $2 for the first year (≈¥11) and $31/yr to renew (≈¥226) — near-zero cost to test, mid-tier to hold among content suffixes. Inventory is excellent: subject words, skill words and brand words nearly all hit, while every XXcourses.com in English-speaking markets was claimed by ed-tech companies long ago. Three cautions: the plural implies a catalog of courses — a single course or personal brand may read better on the already-listed .academy or .school; the first year is cheap but renewal runs 20× — price a multi-topic matrix at renewal rates; and split the work with .education and .training — institution sites fit .education, hands-on programs fit .training, while an online course catalog is truest here. Naming: subject or skill + .courses fits vertical course sites; brand + .courses fits a paid-knowledge catalog; city + .courses fits local training providers.",
      bestFor: ["Course platforms & independent instructors", "Vocational & certification training", "Corporate learning & paid knowledge", "Hobby & language courses"],
      namingTips: [
        "Subject or skill + .courses is exactly what learners search",
        "About $2 year one, $31/yr renewal — matrix at renewal rates",
        "Institution sites fit .education; course catalogs live here",
        "Brand + .courses works as a paid-knowledge catalog front door",
      ],
    },
  },
  degree: {
    tld: "degree",
    zh: {
      title: ".degree 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".degree 是学位教育与升学服务的专属后缀，适合在线学位与继续教育项目、留学与升学咨询、学位课程比价与测评、高校招生与专业介绍站。查看 .degree 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .degree 域名。",
      intro:
        ".degree 说的就是「学位」：在线学位与继续教育项目、留学与升学咨询、学位课程比价测评、高校招生与专业介绍站用 name.degree，想读学位的人搜「专业 + degree」时域名与搜索意图严丝合缝——nursing.degree 这样的名字自带转化力。注册局为 Identity Digital，首年约 $8（约 ¥59），续费约 $42/年（约 ¥300），首年低门槛，续费在教育后缀里属中上。库存极好：专业词、学位类型词（online / masters / mba 相关组合）基本都有货。注意三点：一是「degree」在英语里强指学历学位，技能证书类项目用 .courses / .training 更贴；二是学位是高客单决策，域名之外把课程认证与就业数据做扎实才有转化；三是与已收录的 .education / .institute 分工——机构官网用 .education，研究机构用 .institute，学位项目与升学服务用 .degree 最准。命名上「专业 + .degree」适合垂类学位站，「online/fast + .degree」适合在线学位聚合，「品牌 + .degree」适合教育集团的学位业务线。",
      bestFor: ["在线学位与继续教育项目", "留学与升学咨询", "学位课程比价与测评", "高校招生与专业介绍站"],
      namingTips: [
        "「专业 + .degree」与升学搜索意图严丝合缝",
        "首年约 $8、续费约 $42/年，按续费价算长期成本",
        "技能证书用 .courses 更贴，学历学位用这里",
        "online + .degree 直接说清在线学位定位",
      ],
    },
    en: {
      title: ".degree Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".degree is the dedicated suffix for degree education and admissions services — for online degree and continuing-education programs, study-abroad and admissions consulting, degree comparison and review sites, and university recruitment pages. See live pricing and naming advice, then hunt available .degree names with AI.",
      intro:
        ".degree names the credential itself: online degree and continuing-education programs, study-abroad and admissions consultants, degree comparison and review sites, and university recruitment pages on name.degree match the exact intent of someone searching major + degree — a name like nursing.degree converts from the address bar. Operated by Identity Digital, about $8 for the first year (≈¥59) and $42/yr to renew (≈¥300) — a low first-year door with an upper-mid renewal among education suffixes. Inventory is excellent: majors, degree-type words and online/masters combos nearly all hit. Three cautions: \"degree\" strongly means academic credentials in English — skill certificates read better on .courses or .training; degrees are high-ticket decisions, so back the domain with accreditation and employment data or the traffic won't convert; and split the work with the already-listed .education and .institute — institution sites fit .education, research bodies fit .institute, while degree programs and admissions services are truest here. Naming: major + .degree fits vertical degree sites; online or fast + .degree fits online-degree aggregators; brand + .degree fits the degree arm of an education group.",
      bestFor: ["Online degree & continuing education", "Study-abroad & admissions consulting", "Degree comparison & review sites", "University recruitment pages"],
      namingTips: [
        "Major + .degree matches admissions search intent exactly",
        "About $8 year one, $42/yr renewal — budget at renewal rates",
        "Skill certificates fit .courses; academic degrees live here",
        "online + .degree states the online-program positioning outright",
      ],
    },
  },
  mba: {
    tld: "mba",
    zh: {
      title: ".mba 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".mba 是商学教育与管理培训的专属后缀，适合 MBA/EMBA 项目与商学院、管理培训与领导力课程、商科备考与申请咨询、商业案例与管理内容站。查看 .mba 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .mba 域名。",
      intro:
        ".mba 三个字母就是全球通行的商学教育符号：MBA/EMBA 项目与商学院、管理培训与领导力课程、商科备考与申请咨询、商业案例内容站用 name.mba，读商学院的人一眼就懂——apply.mba 这样的名字本身就是行动号召。注册局为 Identity Digital，首年约 $11（约 ¥78），续费约 $31/年（约 ¥226），进出都不贵，在垂直后缀里属好持有的一档。库存极好：城市名、商学方向词（finance / marketing / tech 组合）、品牌词基本都有货，而 XXmba.com 早被备考机构占光。注意三点：一是 MBA 是全球认知的缩写，无需教育市场，但也把定位锁死在商学教育——泛管理内容可斟酌 .guru / .expert；二是备考与申请咨询是强信任生意，域名之外把导师背景与录取案例做足；三是与 .degree 的分工——泛学位项目用 .degree，商学教育专属身份用 .mba 最准。命名上「城市/学校 + .mba」适合本地项目与校友站，「方向词 + .mba」适合垂类商学内容，「动词 + .mba」（apply/get）适合申请服务。",
      bestFor: ["MBA/EMBA 项目与商学院", "管理培训与领导力课程", "商科备考与申请咨询", "商业案例与管理内容站"],
      namingTips: [
        "「城市/学校 + .mba」适合项目官网与校友社区",
        "首年约 $11、续费约 $31/年，进出都不贵好持有",
        "泛学位用 .degree，商学教育专属身份用这里",
        "apply/get + .mba 本身就是行动号召",
      ],
    },
    en: {
      title: ".mba Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".mba is the dedicated suffix for business education and management training — for MBA/EMBA programs and business schools, management and leadership courses, admissions test prep and consulting, and business case content sites. See live pricing and naming advice, then hunt available .mba names with AI.",
      intro:
        ".mba is a globally understood credential in three letters: MBA/EMBA programs and business schools, management and leadership training, admissions prep and consulting, and business case content on name.mba need zero explanation to their audience — a name like apply.mba is a call to action by itself. Operated by Identity Digital, about $11 for the first year (≈¥78) and $31/yr to renew (≈¥226) — inexpensive both in and out, an easy-to-hold tier among vertical suffixes. Inventory is excellent: city names, business-track words (finance, marketing, tech combos) and brand words nearly all hit, while every XXmba.com was claimed by test-prep firms long ago. Three cautions: MBA is universally recognized but locks the positioning to business education — broader management content may lean .guru or .expert; admissions prep and consulting run on trust, so back the domain with mentor credentials and admit results; and split the work with .degree — general degree programs fit .degree, while the business-school identity is truest here. Naming: city or school + .mba fits program sites and alumni communities; track word + .mba fits vertical business content; verb + .mba (apply, get) fits admissions services.",
      bestFor: ["MBA/EMBA programs & business schools", "Management & leadership training", "Admissions prep & consulting", "Business case & management content"],
      namingTips: [
        "City or school + .mba fits program sites and alumni hubs",
        "About $11 year one, $31/yr renewal — cheap in, cheap to hold",
        "General degrees fit .degree; the b-school identity lives here",
        "apply/get + .mba is a call to action by itself",
      ],
    },
  },
  study: {
    tld: "study",
    zh: {
      title: ".study 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".study 是学习与备考场景的专属后缀，适合备考刷题与学习工具、留学与游学项目、学习方法与效率内容、研究小组与学习社区。查看 .study 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .study 域名。",
      intro:
        ".study 把「学习」这个动作写进域名：备考刷题与学习工具、留学与游学项目、学习方法与效率内容、研究小组与学习社区用 name.study，动词属性让域名自带号召——ielts.study 这样的名字就是一句「来学雅思」。注册局为 Open Universities Australia（澳大利亚开放大学联盟），首年约 $2（约 ¥11），续费约 $31/年（约 ¥226），首年几乎零成本，续费中档。库存极好：考试名、学科词、方法词基本都有货，而 XXstudy.com 早被教育公司抢光。注意三点：一是 .study 是「学习动作」而 .courses 是「课程目录」——工具与社区用 .study，卖课用 .courses 更准；二是首年便宜续费贵 20 倍，矩阵注册按续费价算总账；三是「study in + 国家」是留学行业的固定搜索词，germany.study 这类名字对留学机构是天然入口。命名上「考试/学科 + .study」适合备考垂类，「国家/城市 + .study」适合留学项目，「品牌 + .study」适合学习工具与社区。",
      bestFor: ["备考刷题与学习工具", "留学与游学项目", "学习方法与效率内容", "研究小组与学习社区"],
      namingTips: [
        "「考试/学科 + .study」就是备考人的搜索词",
        "首年约 $2、续费约 $31/年，矩阵注册按续费算总账",
        "卖课用 .courses，学习工具与社区用这里",
        "国家 + .study 是留学行业的天然入口",
      ],
    },
    en: {
      title: ".study Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".study is the dedicated suffix for learning and exam prep — for test-prep and study tools, study-abroad programs, learning methods and productivity content, and research groups and study communities. See live pricing and naming advice, then hunt available .study names with AI.",
      intro:
        ".study puts the verb in the domain: test-prep and study tools, study-abroad programs, learning-method and productivity content, and research groups or study communities on name.study carry a built-in call to action — a name like ielts.study literally says \"come study IELTS\". Operated by Open Universities Australia, about $2 for the first year (≈¥11) and $31/yr to renew (≈¥226) — near-zero cost to start, mid-tier to hold. Inventory is excellent: exam names, subjects and method words nearly all hit, while every XXstudy.com was claimed by education companies long ago. Three cautions: .study is the act of learning while .courses is a catalog — tools and communities fit .study, selling courses reads truer on .courses; the first year is cheap but renewal runs 20× — price a matrix at renewal rates; and \"study in + country\" is a fixed search phrase in the study-abroad industry, so a name like germany.study is a natural front door for agencies. Naming: exam or subject + .study fits prep verticals; country or city + .study fits study-abroad programs; brand + .study fits learning tools and communities.",
      bestFor: ["Test-prep & study tools", "Study-abroad programs", "Learning methods & productivity content", "Research groups & study communities"],
      namingTips: [
        "Exam or subject + .study is exactly what test-takers search",
        "About $2 year one, $31/yr renewal — matrix at renewal rates",
        "Selling courses fits .courses; tools and communities live here",
        "Country + .study is the study-abroad industry's front door",
      ],
    },
  },
  forum: {
    tld: "forum",
    zh: {
      title: ".forum 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".forum 是社区讨论场景的专属后缀，适合垂直兴趣社区与论坛、行业交流与问答平台、开源项目讨论区、品牌用户社区。查看 .forum 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .forum 域名。",
      intro:
        ".forum 就是「论坛」本身：垂直兴趣社区、行业交流与问答平台、开源项目讨论区、品牌用户社区用 name.forum，一眼就知道这是个能发帖讨论的地方——crypto.forum 这样的名字不用任何说明。注册局为 Fegistry，首年约 $2（约 ¥11），续费约 $31/年（约 ¥226）——这个后缀早年定价数百美元，如今降到平价后成了社区场景的捡漏机会。库存极好：兴趣词、行业词、品牌词基本都有货，而 XXforum.com 早被老论坛占光。注意三点：一是 .forum 强指「讨论区」，官网主站不适合，最佳用法是主站 + 社区分离（如 brand.com 主站、brand.forum 社区）；二是首年便宜续费贵 20 倍，按续费价算长期成本；三是与已收录的 .community / .chat 分工——泛社区身份用 .community，即时聊天用 .chat，经典发帖式论坛用 .forum 最准。命名上「兴趣/行业 + .forum」适合垂类社区，「品牌 + .forum」适合官方用户社区，「地名 + .forum」适合本地讨论区。",
      bestFor: ["垂直兴趣社区与论坛", "行业交流与问答平台", "开源项目讨论区", "品牌用户社区"],
      namingTips: [
        "「兴趣/行业 + .forum」一眼就知道是讨论区",
        "首年约 $2、续费约 $31/年，按续费价算长期成本",
        "泛社区用 .community，经典发帖式论坛用这里",
        "brand.forum 与主站分离是品牌社区的经典架构",
      ],
    },
    en: {
      title: ".forum Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".forum is the dedicated suffix for community discussion — for vertical interest communities and forums, industry Q&A platforms, open-source project discussion boards, and official brand user communities. See live pricing and naming advice, then hunt available .forum names with AI.",
      intro:
        ".forum is the word itself: vertical interest communities, industry Q&A platforms, open-source discussion boards, and official brand communities on name.forum are instantly recognizable as places to post and discuss — a name like crypto.forum needs no tagline. Operated by Fegistry, about $2 for the first year (≈¥11) and $31/yr to renew (≈¥226) — this suffix once carried a several-hundred-dollar price tag, and its drop to commodity pricing makes it a genuine bargain for community projects. Inventory is excellent: interest words, industry words and brand words nearly all hit, while every XXforum.com was claimed by legacy boards long ago. Three cautions: .forum strongly means a discussion board, so it suits a community satellite rather than a main site — the classic split is brand.com for the site, brand.forum for the community; the first year is cheap but renewal runs 20× — budget at renewal rates; and split the work with the already-listed .community and .chat — broad community identity fits .community, real-time chat fits .chat, while a classic threaded forum is truest here. Naming: interest or industry + .forum fits vertical communities; brand + .forum fits official user communities; place name + .forum fits local boards.",
      bestFor: ["Vertical interest communities & forums", "Industry Q&A platforms", "Open-source discussion boards", "Official brand user communities"],
      namingTips: [
        "Interest or industry + .forum instantly reads as a board",
        "About $2 year one, $31/yr renewal — budget at renewal rates",
        "Broad community fits .community; threaded boards live here",
        "brand.forum beside brand.com is the classic community split",
      ],
    },
  },
  review: {
    tld: "review",
    zh: {
      title: ".review 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".review 是评测与点评场景的专属后缀，适合产品评测与横评媒体、消费点评与口碑聚合、软件与服务测评站、书影音评论内容。查看 .review 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .review 域名。",
      intro:
        ".review 单数形式说的是「一篇评测/一次点评」：产品评测与横评媒体、消费点评与口碑聚合、软件与服务测评站、书影音评论内容用 name.review，找评测的人搜「品类 + review」时域名就是搜索词——laptop.review 这样的名字自带点击理由。注册局为 GRS Domains（原 Famous Four Media 系），注册与续费均约 $11/年（约 ¥78），平进平出、无首年陷阱，在内容后缀里属便宜好持有的一档。库存极好：品类词、品牌词基本都有货，而 XXreview.com / XXreviews.com 早被联盟营销站占光。注意三点：一是与已收录的复数 .reviews 分工——单数 .review 更贴「评测媒体」身份，复数 .reviews 更贴「点评聚合」，两者可择一或互相保护性注册；二是评测站的命脉是公信力，域名之外把测试方法与利益披露写清楚；三是历史上部分注册局曾对 .review 有溢价词表，注册前以注册商实时报价为准。命名上「品类 + .review」适合垂类评测站，「品牌 + .review」适合官方测评栏目，「地名 + .review」适合本地消费点评。",
      bestFor: ["产品评测与横评媒体", "消费点评与口碑聚合", "软件与服务测评站", "书影音评论内容"],
      namingTips: [
        "「品类 + .review」就是找评测的人的搜索词",
        "注册续费均约 $11/年，平进平出好持有",
        "复数 .reviews 贴点评聚合，评测媒体身份用这里",
        "评测站命脉是公信力，测试方法与披露要写清",
      ],
    },
    en: {
      title: ".review Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".review is the dedicated suffix for reviews and ratings — for product review and comparison media, consumer rating aggregators, software and service testing sites, and book, film and music criticism. See live pricing and naming advice, then hunt available .review names with AI.",
      intro:
        ".review in the singular names the artifact — a review: product review and comparison media, consumer rating aggregators, software and service testing sites, and book, film or music criticism on name.review match exactly what shoppers search — category + review — and a name like laptop.review carries its own reason to click. Operated by GRS Domains (the former Famous Four Media portfolio), about $11/yr for both registration and renewal (≈¥78) — flat in, flat out, none of the first-year trap, in the cheap-to-hold tier of content suffixes. Inventory is excellent: category words and brand words nearly all hit, while every XXreview.com and XXreviews.com was claimed by affiliate sites long ago. Three cautions: split the work with the already-listed plural .reviews — the singular fits a review-media identity while the plural fits rating aggregation, so pick one or register both defensively; a review site lives on credibility, so publish your testing methodology and disclosure policy alongside the domain; and some registries have historically kept premium word lists on .review — trust the registrar's live quote before buying. Naming: category + .review fits vertical review sites; brand + .review fits an official testing desk; place name + .review fits local consumer ratings.",
      bestFor: ["Product review & comparison media", "Consumer rating aggregators", "Software & service testing sites", "Book, film & music criticism"],
      namingTips: [
        "Category + .review is exactly what shoppers search",
        "About $11/yr flat for both registration and renewal",
        "Plural .reviews fits aggregation; review media lives here",
        "Publish methodology and disclosures — credibility is the moat",
      ],
    },
  },
  hair: {
    tld: "hair",
    zh: {
      title: ".hair 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".hair 是美发与头发护理行业的专属后缀，适合美发沙龙与理发店、发型师个人品牌、假发与接发电商、头皮护理与防脱产品。查看 .hair 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .hair 域名。",
      intro:
        ".hair 把「头发」直接写进域名：美发沙龙与理发店、发型师个人品牌、假发与接发电商、头皮护理与防脱产品用 name.hair，顾客搜「城市/风格 + hair」时域名就是搜索词本身——tokyo.hair 或 curly.hair 这样的名字不用解释就知道做什么。该后缀最初由欧莱雅发起，现由 XYZ 注册局运营，首年约 $2（约 ¥11），续费约 $13/年（约 ¥93），首年几乎零成本试水，续费在行业后缀里属便宜好持有的一档。库存极好：城市词、风格词、品牌词基本都有货，而 XXhair.com 早被美发连锁与电商占光。注意三点：一是 .hair 强指美发垂类，综合美容院可斟酌已收录的 .beauty / .salon；二是行业后缀认知度仍在建立期，名片与门头把完整域名印清楚；三是同为 XYZ 美妆系的 .skin / .makeup 可一起保护性注册。命名上「城市 + .hair」适合本地沙龙，「发型师名 + .hair」适合个人品牌，「风格/品类 + .hair」适合垂类电商与内容站。",
      bestFor: ["美发沙龙与理发店", "发型师个人品牌", "假发与接发电商", "头皮护理与防脱产品"],
      namingTips: [
        "「城市 + .hair」就是本地顾客的搜索词",
        "首年约 $2、续费约 $13/年，便宜好持有",
        "综合美容院可斟酌 .beauty / .salon，美发垂类用这里",
        "发型师名 + .hair 是个人品牌的天然作品集入口",
      ],
    },
    en: {
      title: ".hair Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".hair is the dedicated suffix for the hair industry — for salons and barbershops, stylist personal brands, wig and extension e-commerce, and scalp care or anti-hair-loss products. See live pricing and naming advice, then hunt available .hair names with AI.",
      intro:
        ".hair writes the trade into the domain: salons and barbershops, stylist personal brands, wig and extension shops, and scalp-care products on name.hair match exactly what clients search — city or style + hair — and a name like tokyo.hair or curly.hair needs no explanation. Originally launched by L'Oréal and now operated by XYZ Registry, about $2 for the first year (≈¥11) and $13/yr to renew (≈¥93) — near-zero cost to test and cheap to hold among industry suffixes. Inventory is excellent: city words, style words and brand words nearly all hit, while every XXhair.com was claimed by salon chains and e-commerce long ago. Three cautions: .hair reads strictly hair-vertical — a full-service beauty salon may fit the already-listed .beauty or .salon better; recognition of industry suffixes is still building, so print the full domain clearly on cards and storefronts; and the sibling XYZ beauty suffixes .skin and .makeup are worth registering defensively together. Naming: city + .hair fits local salons; stylist name + .hair fits personal brands; style or category + .hair fits vertical shops and content sites.",
      bestFor: ["Salons & barbershops", "Stylist personal brands", "Wig & extension e-commerce", "Scalp care & anti-hair-loss products"],
      namingTips: [
        "City + .hair is exactly what local clients search",
        "About $2 year one, $13/yr renewal — cheap to hold",
        "Full-service salons may fit .beauty or .salon; hair lives here",
        "Stylist name + .hair is a natural portfolio front door",
      ],
    },
  },
  skin: {
    tld: "skin",
    zh: {
      title: ".skin 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".skin 是护肤与皮肤健康的专属后缀，适合护肤品牌与美妆电商、皮肤科诊所与医美机构、护肤测评与成分党内容、美容仪与个护设备。查看 .skin 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .skin 域名。",
      intro:
        ".skin 说的就是「皮肤」：护肤品牌与美妆电商、皮肤科诊所与医美机构、护肤测评与成分党内容、美容仪与个护设备用 name.skin，用户搜「诉求 + skin」时域名与搜索意图严丝合缝——glow.skin 或 clear.skin 这样的名字自带品类联想。该后缀最初由欧莱雅发起，现由 XYZ 注册局运营，首年约 $2（约 ¥11），续费约 $13/年（约 ¥93），在美妆行业后缀里属便宜好持有的一档。库存极好：功效词、成分词、品牌词基本都有货，而 XXskin.com 早被护肤品牌与药妆电商抢光。注意三点：一是医疗属性内容（皮肤科诊疗）注意合规资质展示，域名之外把执业信息写清楚；二是综合美妆可斟酌已收录的 .beauty / .makeup，护肤垂类用 .skin 最准；三是行业后缀认知度仍在建立期，广告投放时完整域名要突出。命名上「功效/成分 + .skin」适合垂类品牌，「品牌 + .skin」适合护肤线独立站，「城市 + .skin」适合本地皮肤管理与医美机构。",
      bestFor: ["护肤品牌与美妆电商", "皮肤科诊所与医美机构", "护肤测评与成分党内容", "美容仪与个护设备"],
      namingTips: [
        "「功效/成分 + .skin」就是用户的搜索词",
        "首年约 $2、续费约 $13/年，便宜好持有",
        "综合美妆用 .beauty / .makeup，护肤垂类用这里",
        "医疗属性内容把资质与执业信息写清楚",
      ],
    },
    en: {
      title: ".skin Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".skin is the dedicated suffix for skincare and skin health — for skincare brands and beauty e-commerce, dermatology clinics and medical aesthetics, ingredient-focused review content, and beauty devices. See live pricing and naming advice, then hunt available .skin names with AI.",
      intro:
        ".skin names the category outright: skincare brands and beauty e-commerce, dermatology clinics and medical-aesthetics practices, ingredient-focused review content, and beauty devices on name.skin match exactly what users search — concern + skin — and a name like glow.skin or clear.skin carries instant category recall. Originally launched by L'Oréal and now operated by XYZ Registry, about $2 for the first year (≈¥11) and $13/yr to renew (≈¥93) — in the cheap-to-hold tier of beauty suffixes. Inventory is excellent: benefit words, ingredient words and brand words nearly all hit, while every XXskin.com was claimed by skincare brands and pharmacy e-commerce long ago. Three cautions: medical content (dermatology treatment) needs clear licensing and practitioner info alongside the domain; a general beauty play may fit the already-listed .beauty or .makeup, while skincare is truest here; and recognition of industry suffixes is still building, so feature the full domain prominently in ads. Naming: benefit or ingredient + .skin fits vertical brands; brand + .skin fits a skincare line's standalone site; city + .skin fits local skin clinics and medical aesthetics.",
      bestFor: ["Skincare brands & beauty e-commerce", "Dermatology & medical aesthetics", "Ingredient-focused review content", "Beauty devices & personal care tech"],
      namingTips: [
        "Benefit or ingredient + .skin is exactly what users search",
        "About $2 year one, $13/yr renewal — cheap to hold",
        "General beauty fits .beauty or .makeup; skincare lives here",
        "Medical content needs licensing info beside the domain",
      ],
    },
  },
  makeup: {
    tld: "makeup",
    zh: {
      title: ".makeup 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".makeup 是彩妆行业的专属后缀，适合彩妆品牌与美妆电商、化妆师个人品牌与工作室、美妆教程与测评内容、婚礼与影视化妆服务。查看 .makeup 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .makeup 域名。",
      intro:
        ".makeup 把「彩妆」直接写进域名：彩妆品牌与美妆电商、化妆师个人品牌与工作室、美妆教程与测评内容、婚礼与影视化妆服务用 name.makeup，用户搜「风格/场景 + makeup」时域名就是搜索词本身——bridal.makeup 这样的名字不用解释就知道做什么。该后缀最初由欧莱雅发起，现由 XYZ 注册局运营，首年约 $2（约 ¥11），续费约 $13/年（约 ¥93），在美妆行业后缀里属便宜好持有的一档。库存极好：风格词、场景词、品牌词基本都有货，而 XXmakeup.com 早被彩妆品牌与博主抢光。注意三点：一是 .makeup 强指彩妆垂类，护肤用 .skin、综合美妆用 .beauty 分工更清；二是化妆师接单重心在社交平台时，域名做作品集与预约入口最实用；三是行业后缀认知度仍在建立期，名片与主页链接把完整域名写清楚。命名上「场景 + .makeup」适合婚礼与影视化妆，「化妆师名 + .makeup」适合个人品牌，「风格/品类 + .makeup」适合垂类内容与电商。",
      bestFor: ["彩妆品牌与美妆电商", "化妆师个人品牌与工作室", "美妆教程与测评内容", "婚礼与影视化妆服务"],
      namingTips: [
        "「场景 + .makeup」就是用户的搜索词",
        "首年约 $2、续费约 $13/年，便宜好持有",
        "护肤用 .skin、综合美妆用 .beauty，彩妆垂类用这里",
        "化妆师名 + .makeup 做作品集与预约入口最实用",
      ],
    },
    en: {
      title: ".makeup Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".makeup is the dedicated suffix for cosmetics — for makeup brands and beauty e-commerce, makeup artist personal brands and studios, tutorial and review content, and bridal or film makeup services. See live pricing and naming advice, then hunt available .makeup names with AI.",
      intro:
        ".makeup writes the craft into the domain: makeup brands and beauty e-commerce, makeup artist personal brands and studios, tutorial and review content, and bridal or film makeup services on name.makeup match exactly what users search — style or occasion + makeup — and a name like bridal.makeup needs no explanation. Originally launched by L'Oréal and now operated by XYZ Registry, about $2 for the first year (≈¥11) and $13/yr to renew (≈¥93) — in the cheap-to-hold tier of beauty suffixes. Inventory is excellent: style words, occasion words and brand words nearly all hit, while every XXmakeup.com was claimed by cosmetics brands and creators long ago. Three cautions: .makeup reads strictly cosmetics-vertical — skincare fits .skin and a general beauty play fits .beauty, so split the work cleanly; if an artist's bookings live on social platforms, the domain works best as a portfolio and booking front door; and recognition of industry suffixes is still building, so spell out the full domain on cards and profile links. Naming: occasion + .makeup fits bridal and film services; artist name + .makeup fits personal brands; style or category + .makeup fits vertical content and shops.",
      bestFor: ["Makeup brands & beauty e-commerce", "Makeup artist brands & studios", "Tutorial & review content", "Bridal & film makeup services"],
      namingTips: [
        "Occasion + .makeup is exactly what users search",
        "About $2 year one, $13/yr renewal — cheap to hold",
        "Skincare fits .skin, general beauty .beauty; cosmetics live here",
        "Artist name + .makeup is a portfolio and booking front door",
      ],
    },
  },
  homes: {
    tld: "homes",
    zh: {
      title: ".homes 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".homes 是住宅房产的专属后缀，适合房产经纪与中介团队、住宅开发与楼盘项目、房源聚合与找房平台、家装与住宅改造服务。查看 .homes 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .homes 域名。",
      intro:
        ".homes 说的就是「住宅」：房产经纪与中介团队、住宅开发与楼盘项目、房源聚合与找房平台、家装与住宅改造服务用 name.homes，买家搜「城市/区域 + homes」时域名就是搜索词本身——austin.homes 这样的名字自带本地房产联想。该后缀原为 Dominion 注册局的受限后缀，2022 年由 XYZ 注册局接手并取消行业资质限制，现在任何人可注册；首年约 $2（约 ¥11），续费约 $13/年（约 ¥93），在房产后缀里属便宜好持有的一档。库存极好：城市词、区域词、团队词基本都有货，而 XXhomes.com 早被房产门户与开发商占光。注意三点：一是与已收录的 .estate / .properties / .rentals 分工——住宅买卖用 .homes 最贴，综合资产用 .estate，租赁用 .rentals；二是复数形式暗示「多套房源」，单盘项目页可用「楼盘名 + .homes」；三是老资料可能仍写着「需行业资质」，以注册商实时页面为准。命名上「城市/区域 + .homes」适合本地经纪，「团队/品牌 + .homes」适合中介与开发商，「风格 + .homes」适合垂类找房与家装内容。",
      bestFor: ["房产经纪与中介团队", "住宅开发与楼盘项目", "房源聚合与找房平台", "家装与住宅改造服务"],
      namingTips: [
        "「城市/区域 + .homes」就是买家的搜索词",
        "首年约 $2、续费约 $13/年，便宜好持有",
        "综合资产用 .estate、租赁用 .rentals，住宅买卖用这里",
        "2022 年起已取消行业资质限制，任何人可注册",
      ],
    },
    en: {
      title: ".homes Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".homes is the dedicated suffix for residential real estate — for agents and brokerage teams, residential developers and projects, listing aggregators and home-search platforms, and renovation services. See live pricing and naming advice, then hunt available .homes names with AI.",
      intro:
        ".homes names the market outright: real estate agents and brokerage teams, residential developers and projects, listing aggregators and home-search platforms, and renovation services on name.homes match exactly what buyers search — city or neighborhood + homes — and a name like austin.homes carries instant local-real-estate recall. Formerly a restricted suffix under Dominion Registries, it moved to XYZ Registry in 2022 and the industry-credential requirement was dropped — anyone can register now. About $2 for the first year (≈¥11) and $13/yr to renew (≈¥93) — in the cheap-to-hold tier of real estate suffixes. Inventory is excellent: city words, neighborhood words and team words nearly all hit, while every XXhomes.com was claimed by portals and developers long ago. Three cautions: split the work with the already-listed .estate, .properties and .rentals — residential sales fit .homes best, broad assets fit .estate, rentals fit .rentals; the plural implies multiple listings, so a single development may read better as project-name.homes; and older references may still claim credential requirements — trust the registrar's live page. Naming: city or neighborhood + .homes fits local agents; team or brand + .homes fits brokerages and developers; style + .homes fits niche home-search and renovation content.",
      bestFor: ["Agents & brokerage teams", "Residential developers & projects", "Listing aggregators & home search", "Renovation & remodeling services"],
      namingTips: [
        "City or neighborhood + .homes is exactly what buyers search",
        "About $2 year one, $13/yr renewal — cheap to hold",
        "Broad assets fit .estate, rentals .rentals; sales live here",
        "Credential restrictions were dropped in 2022 — open to all",
      ],
    },
  },
  boats: {
    tld: "boats",
    zh: {
      title: ".boats 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".boats 是船艇行业的专属后缀，适合游艇与船艇买卖经纪、租船与包船出海服务、码头与船艇维护保养、航海装备与水上运动。查看 .boats 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .boats 域名。",
      intro:
        ".boats 把「船」直接写进域名：游艇与船艇买卖经纪、租船与包船出海服务、码头与船艇维护保养、航海装备与水上运动用 name.boats，客户搜「地点/船型 + boats」时域名就是搜索词本身——miami.boats 这样的名字不用解释就知道做什么。该后缀原为 Dominion 注册局的受限后缀，2022 年由 XYZ 注册局接手并取消行业资质限制；首年约 $2（约 ¥11），续费约 $13/年（约 ¥93），在垂类行业后缀里属便宜好持有的一档。库存极好：港口词、船型词、品牌词基本都有货，而 XXboats.com 早被船艇经纪与租赁平台占光。注意三点：一是船艇买卖高客单、决策链长，域名之外把资质与成交记录展示清楚更能建立信任；二是豪华游艇定位可斟酌同系的 .yachts，大众船艇与出海服务用 .boats 更贴；三是老资料可能仍写着「需行业资质」，以注册商实时页面为准。命名上「港口/城市 + .boats」适合本地租船与经纪，「船型 + .boats」适合垂类买卖平台，「品牌 + .boats」适合船厂与装备商。",
      bestFor: ["游艇与船艇买卖经纪", "租船与包船出海服务", "码头与船艇维护保养", "航海装备与水上运动"],
      namingTips: [
        "「港口/城市 + .boats」就是客户的搜索词",
        "首年约 $2、续费约 $13/年，便宜好持有",
        "豪华游艇可斟酌 .yachts，大众船艇与出海用这里",
        "高客单生意把资质与成交记录展示在域名之外",
      ],
    },
    en: {
      title: ".boats Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".boats is the dedicated suffix for the boating industry — for boat and yacht brokers, charter and rental services, marinas and boat maintenance, and marine gear or water sports. See live pricing and naming advice, then hunt available .boats names with AI.",
      intro:
        ".boats writes the trade into the domain: boat and yacht brokers, charter and rental services, marinas and boat maintenance, and marine gear or water-sports businesses on name.boats match exactly what customers search — place or boat type + boats — and a name like miami.boats needs no explanation. Formerly a restricted suffix under Dominion Registries, it moved to XYZ Registry in 2022 and the industry-credential requirement was dropped. About $2 for the first year (≈¥11) and $13/yr to renew (≈¥93) — in the cheap-to-hold tier of vertical suffixes. Inventory is excellent: harbor words, boat-type words and brand words nearly all hit, while every XXboats.com was claimed by brokers and rental platforms long ago. Three cautions: boat sales are high-ticket with long decision cycles — display credentials and sale records prominently beyond the domain to build trust; a luxury-yacht positioning may fit the sibling .yachts better, while everyday boats and charters are truest here; and older references may still claim credential requirements — trust the registrar's live page. Naming: harbor or city + .boats fits local charters and brokers; boat type + .boats fits vertical marketplaces; brand + .boats fits builders and gear makers.",
      bestFor: ["Boat & yacht brokers", "Charter & rental services", "Marinas & boat maintenance", "Marine gear & water sports"],
      namingTips: [
        "Harbor or city + .boats is exactly what customers search",
        "About $2 year one, $13/yr renewal — cheap to hold",
        "Luxury yachts may fit .yachts; everyday boating lives here",
        "High-ticket sales need credentials shown beyond the domain",
      ],
    },
  },
  autos: {
    tld: "autos",
    zh: {
      title: ".autos 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".autos 是汽车行业的专属后缀，适合二手车买卖与车行、汽车租赁与订阅服务、汽修保养与改装门店、汽车资讯与选车内容。查看 .autos 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .autos 域名。",
      intro:
        ".autos 说的就是「汽车」：二手车买卖与车行、汽车租赁与订阅服务、汽修保养与改装门店、汽车资讯与选车内容用 name.autos，买家搜「城市/品类 + autos」时域名就是搜索词本身——dallas.autos 这样的名字自带本地车行联想。该后缀原为 Dominion 注册局的受限后缀，2022 年由 XYZ 注册局接手并取消行业资质限制；首年约 $2（约 ¥11），续费约 $13/年（约 ¥93），对比动辄数千美元的单数 .auto / .car / .cars（Cars 注册局高价后缀），.autos 是汽车垂类里唯一便宜好持有的选择。库存极好：城市词、品类词、品牌词基本都有货，而 XXautos.com 早被车行与二手车平台占光。注意三点：一是 .autos 与天价的 .auto 只差一个字母，对外沟通时把复数拼写强调清楚；二是二手车交易重信任，域名之外把车况报告与售后承诺写清楚；三是老资料可能仍写着「需行业资质」，以注册商实时页面为准。命名上「城市 + .autos」适合本地车行与租赁，「品类 + .autos」适合垂类平台（电车/老爷车/改装），「品牌 + .autos」适合连锁门店。",
      bestFor: ["二手车买卖与车行", "汽车租赁与订阅服务", "汽修保养与改装门店", "汽车资讯与选车内容"],
      namingTips: [
        "「城市 + .autos」就是买家的搜索词",
        "首年约 $2、续费约 $13/年，远比天价 .auto / .cars 好持有",
        "与 .auto 只差一个字母，对外强调复数拼写",
        "二手车重信任，车况报告与售后承诺写在站内",
      ],
    },
    en: {
      title: ".autos Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".autos is the dedicated suffix for the automotive industry — for used-car dealers, rental and subscription services, repair and tuning shops, and car news or buying guides. See live pricing and naming advice, then hunt available .autos names with AI.",
      intro:
        ".autos names the trade outright: used-car dealers, rental and subscription services, repair and tuning shops, and car news or buying-guide content on name.autos match exactly what buyers search — city or category + autos — and a name like dallas.autos carries instant local-dealer recall. Formerly a restricted suffix under Dominion Registries, it moved to XYZ Registry in 2022 and the industry-credential requirement was dropped. About $2 for the first year (≈¥11) and $13/yr to renew (≈¥93) — against the singular .auto, .car and .cars (Cars Registry premium suffixes priced in the thousands of dollars), .autos is the only cheap-to-hold choice in the automotive vertical. Inventory is excellent: city words, category words and brand words nearly all hit, while every XXautos.com was claimed by dealers and used-car platforms long ago. Three cautions: .autos is one letter from the sky-priced .auto — stress the plural spelling in all communications; used-car sales run on trust, so publish condition reports and after-sale terms beyond the domain; and older references may still claim credential requirements — trust the registrar's live page. Naming: city + .autos fits local dealers and rentals; category + .autos fits vertical platforms (EVs, classics, tuning); brand + .autos fits dealership chains.",
      bestFor: ["Used-car dealers & lots", "Car rental & subscription services", "Repair & tuning shops", "Car news & buying guides"],
      namingTips: [
        "City + .autos is exactly what buyers search",
        "About $2 year one, $13/yr renewal — far cheaper than .auto/.cars",
        "One letter from premium .auto — stress the plural spelling",
        "Used-car trust needs condition reports on the site itself",
      ],
    },
  },
  careers: {
    tld: "careers",
    zh: {
      title: ".careers 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".careers 是招聘与职业发展的专属后缀，适合企业招聘官网、猎头与人力资源机构、垂直行业招聘平台、职业规划与求职辅导内容。查看 .careers 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .careers 域名。",
      intro:
        ".careers 把「招聘」写进域名：企业招聘官网、猎头与人力资源机构、垂直行业招聘平台、职业规划与求职辅导内容用 name.careers，求职者搜「公司/行业 + careers」时域名与搜索意图严丝合缝——很多大公司招聘页本就叫 careers 子页，brand.careers 是更干净的独立入口。该后缀由 Identity Digital（原 Donuts）注册局运营，首年约 $16（约 ¥115），续费约 $57/年（约 ¥412），续费在行业后缀里偏贵，适合把招聘当长期品牌资产的企业而非临时项目。库存极好：公司名、行业词、城市词基本都有货，而 XXcareers.com 与 XXjobs.com 早被招聘平台占光。注意三点：一是受限的 .jobs 需要企业验证且认知一般，.careers 开放注册更省事；二是续费较贵，短期招聘活动可用主站子页而非独立域名；三是招聘站涉及个人信息，隐私政策与数据合规要同步做好。命名上「品牌 + .careers」适合企业招聘官网，「行业 + .careers」适合垂类招聘平台，「城市 + .careers」适合本地人力资源服务。",
      bestFor: ["企业招聘官网", "猎头与人力资源机构", "垂直行业招聘平台", "职业规划与求职辅导"],
      namingTips: [
        "「品牌 + .careers」是招聘页的天然独立入口",
        "首年约 $16、续费约 $57/年，适合长期持有而非临时活动",
        "受限的 .jobs 需企业验证，.careers 开放注册更省事",
        "行业/城市 + .careers 适合垂类与本地招聘平台",
      ],
    },
    en: {
      title: ".careers Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".careers is the dedicated suffix for hiring and career growth — for company hiring sites, recruiters and HR agencies, vertical job boards, and career coaching content. See live pricing and naming advice, then hunt available .careers names with AI.",
      intro:
        ".careers writes hiring into the domain: company hiring sites, recruiters and HR agencies, vertical job boards, and career-coaching content on name.careers match exactly what candidates search — company or industry + careers — and since big companies already call their hiring page \"careers\", brand.careers is the cleaner standalone front door. Operated by Identity Digital (formerly Donuts), it runs about $16 for the first year (≈¥115) and $57/yr to renew (≈¥412) — renewal sits at the pricier end of industry suffixes, so it suits employers treating hiring as a long-term brand asset rather than a one-off campaign. Inventory is excellent: company names, industry words and city words nearly all hit, while every XXcareers.com and XXjobs.com was claimed by job platforms long ago. Three cautions: the restricted .jobs requires employer verification with mediocre recognition — .careers registers openly with less friction; renewal is pricey, so short campaigns may fit a subpage of your main site better; and hiring sites handle personal data, so ship privacy policy and compliance alongside. Naming: brand + .careers fits company hiring sites; industry + .careers fits vertical job boards; city + .careers fits local HR services.",
      bestFor: ["Company hiring sites", "Recruiters & HR agencies", "Vertical job boards", "Career coaching & job-search content"],
      namingTips: [
        "Brand + .careers is the natural standalone hiring front door",
        "About $16 year one, $57/yr renewal — hold long-term, not for one-off campaigns",
        "Restricted .jobs needs employer verification; .careers registers openly",
        "Industry or city + .careers fits vertical and local job boards",
      ],
    },
  },
  management: {
    tld: "management",
    zh: {
      title: ".management 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".management 是管理服务的专属后缀，适合物业与资产管理公司、项目与工程管理服务、财富与投资管理机构、管理咨询与企业培训。查看 .management 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .management 域名。",
      intro:
        ".management 把「管理」写进域名：物业与资产管理公司、项目与工程管理服务、财富与投资管理机构、管理咨询与企业培训用 name.management，客户搜「品类 + management」时域名就是搜索词本身——property.management 或 wealth.management 这样的组合不用解释就知道做什么。该后缀由 Identity Digital（原 Donuts）注册局运营，首年约 $8（约 ¥59），续费约 $21/年（约 ¥152），在行业后缀里属中档好持有。库存极好：品类词、城市词、品牌词基本都有货，而 XXmanagement.com 早被物业与资管公司占光。注意三点：一是 management 拼写较长（10 个字母），口头传播时确认对方拼对；二是资管与财富管理涉及金融牌照，域名之外把资质展示清楚；三是泛咨询业务可斟酌已收录的 .consulting / .services，管理垂类用这里最准。命名上「品类 + .management」适合垂类服务商（物业/项目/财富），「城市 + .management」适合本地物业管理，「品牌 + .management」适合管理咨询公司官网。",
      bestFor: ["物业与资产管理公司", "项目与工程管理服务", "财富与投资管理机构", "管理咨询与企业培训"],
      namingTips: [
        "「品类 + .management」就是客户的搜索词",
        "首年约 $8、续费约 $21/年，中档好持有",
        "拼写较长，口头传播时确认对方拼对",
        "泛咨询可斟酌 .consulting / .services，管理垂类用这里",
      ],
    },
    en: {
      title: ".management Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".management is the dedicated suffix for management services — for property and asset managers, project management services, wealth management firms, and management consulting or training. See live pricing and naming advice, then hunt available .management names with AI.",
      intro:
        ".management writes the service into the domain: property and asset managers, project management services, wealth management firms, and management consultants on name.management match exactly what clients search — category + management — and a name like property.management or wealth.management needs no explanation. Operated by Identity Digital (formerly Donuts), about $8 for the first year (≈¥59) and $21/yr to renew (≈¥152) — mid-priced and easy to hold among industry suffixes. Inventory is excellent: category words, city words and brand words nearly all hit, while every XXmanagement.com was claimed by property and asset firms long ago. Three cautions: management is a long spelling (10 letters), so confirm it lands right when said aloud; wealth and asset management touch financial licensing — display credentials beyond the domain; and broad consulting practices may fit the already-listed .consulting or .services better — the management vertical lives here. Naming: category + .management fits vertical providers (property, project, wealth); city + .management fits local property managers; brand + .management fits consulting firm sites.",
      bestFor: ["Property & asset managers", "Project management services", "Wealth & investment management firms", "Management consulting & training"],
      namingTips: [
        "Category + .management is exactly what clients search",
        "About $8 year one, $21/yr renewal — mid-priced, easy to hold",
        "Ten letters — confirm the spelling lands when said aloud",
        "Broad consulting may fit .consulting/.services; management lives here",
      ],
    },
  },
  contractors: {
    tld: "contractors",
    zh: {
      title: ".contractors 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".contractors 是承包商行业的专属后缀，适合建筑与装修总包公司、电气水暖等专业分包、屋顶外墙等专项施工队、承包商目录与接单平台。查看 .contractors 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .contractors 域名。",
      intro:
        ".contractors 把「承包商」写进域名：建筑与装修总包公司、电气水暖等专业分包、屋顶外墙等专项施工队、承包商目录与接单平台用 name.contractors，业主搜「城市/工种 + contractors」时域名就是搜索词本身——roofing.contractors 或 dallas.contractors 这样的名字自带本地施工队联想。该后缀由 Identity Digital（原 Donuts）注册局运营，首年约 $6（约 ¥41），续费约 $28/年（约 ¥204），首年便宜、续费中档。库存极好：工种词、城市词、品牌词基本都有货，而 XXcontractors.com 早被建筑公司与接单平台占光。注意三点：一是 contractors 拼写长（11 个字母），车贴与广告把完整域名印清楚；二是施工行业重资质与保险，域名之外把执照编号与保险信息展示出来；三是单一工种可斟酌已收录的 .builders / .construction / .repair / .plumbing，多工种综合承包用这里最准。命名上「工种 + .contractors」适合专业分包，「城市 + .contractors」适合本地总包与目录站，「品牌 + .contractors」适合承包公司官网。",
      bestFor: ["建筑与装修总包公司", "电气水暖等专业分包", "屋顶外墙等专项施工队", "承包商目录与接单平台"],
      namingTips: [
        "「城市/工种 + .contractors」就是业主的搜索词",
        "首年约 $6、续费约 $28/年，首年便宜续费中档",
        "拼写 11 个字母，车贴与广告把域名印清楚",
        "单一工种可斟酌 .builders / .plumbing 等，综合承包用这里",
      ],
    },
    en: {
      title: ".contractors Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".contractors is the dedicated suffix for the contracting trades — for general contractors and remodelers, electrical and plumbing subcontractors, roofing and specialty crews, and contractor directories. See live pricing and naming advice, then hunt available .contractors names with AI.",
      intro:
        ".contractors writes the trade into the domain: general contractors and remodelers, electrical and plumbing subs, roofing and specialty crews, and contractor directories on name.contractors match exactly what homeowners search — city or trade + contractors — and a name like roofing.contractors or dallas.contractors carries instant local-crew recall. Operated by Identity Digital (formerly Donuts), about $6 for the first year (≈¥41) and $28/yr to renew (≈¥204) — cheap to start, mid-priced to hold. Inventory is excellent: trade words, city words and brand words nearly all hit, while every XXcontractors.com was claimed by construction firms and lead platforms long ago. Three cautions: contractors is a long spelling (11 letters) — print the full domain clearly on trucks and ads; the trades run on licensing and insurance, so display license numbers and coverage beyond the domain; and single-trade shops may fit the already-listed .builders, .construction, .repair or .plumbing better — multi-trade general contracting lives here. Naming: trade + .contractors fits specialty subs; city + .contractors fits local GCs and directories; brand + .contractors fits company sites.",
      bestFor: ["General contractors & remodelers", "Electrical & plumbing subcontractors", "Roofing & specialty crews", "Contractor directories & lead platforms"],
      namingTips: [
        "City or trade + .contractors is exactly what homeowners search",
        "About $6 year one, $28/yr renewal — cheap start, mid-priced hold",
        "Eleven letters — print the full domain clearly on trucks and ads",
        "Single trades may fit .builders/.plumbing; general contracting lives here",
      ],
    },
  },
  equipment: {
    tld: "equipment",
    zh: {
      title: ".equipment 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".equipment 是设备器材行业的专属后缀，适合工程与农用设备经销租赁、健身与运动器材电商、餐饮与商用设备供应商、二手设备交易与回收。查看 .equipment 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .equipment 域名。",
      intro:
        ".equipment 把「设备」写进域名：工程与农用设备经销租赁、健身与运动器材电商、餐饮与商用设备供应商、二手设备交易与回收用 name.equipment，买家搜「品类 + equipment」时域名就是搜索词本身——gym.equipment 或 farm.equipment 这样的组合不用解释就知道卖什么。该后缀由 Identity Digital（原 Donuts）注册局运营，首年约 $11（约 ¥78），续费约 $23/年（约 ¥167），在行业后缀里属中档好持有。库存极好：品类词、行业词、品牌词基本都有货，而 XXequipment.com 早被设备经销商占光。注意三点：一是 equipment 拼写较长（9 个字母）且易漏拼，广告物料把完整域名印清楚；二是大型设备交易重线下履约，域名之外把仓库地址与售后网点写清楚；三是泛工具类可斟酌已收录的 .tools / .supply 方向，成套设备用这里最准。命名上「品类 + .equipment」适合垂类经销商（健身/农用/餐饮），「租赁词 + .equipment」适合设备租赁平台，「品牌 + .equipment」适合厂商直销官网。",
      bestFor: ["工程与农用设备经销租赁", "健身与运动器材电商", "餐饮与商用设备供应商", "二手设备交易与回收"],
      namingTips: [
        "「品类 + .equipment」就是买家的搜索词",
        "首年约 $11、续费约 $23/年，中档好持有",
        "拼写较长易漏拼，物料把完整域名印清楚",
        "泛工具可斟酌 .tools，成套设备用这里",
      ],
    },
    en: {
      title: ".equipment Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".equipment is the dedicated suffix for the equipment trade — for heavy and farm equipment dealers, gym and sports gear e-commerce, restaurant and commercial suppliers, and used-equipment marketplaces. See live pricing and naming advice, then hunt available .equipment names with AI.",
      intro:
        ".equipment writes the inventory into the domain: heavy and farm equipment dealers and rentals, gym and sports gear shops, restaurant and commercial suppliers, and used-equipment marketplaces on name.equipment match exactly what buyers search — category + equipment — and a name like gym.equipment or farm.equipment needs no explanation. Operated by Identity Digital (formerly Donuts), about $11 for the first year (≈¥78) and $23/yr to renew (≈¥167) — mid-priced and easy to hold among industry suffixes. Inventory is excellent: category words, industry words and brand words nearly all hit, while every XXequipment.com was claimed by dealers long ago. Three cautions: equipment is a longer spelling (9 letters) that invites typos — print the full domain clearly on ads; big-ticket equipment sales run on offline fulfillment, so publish warehouse locations and service coverage beyond the domain; and general tool shops may fit the already-listed .tools better — full equipment lines live here. Naming: category + .equipment fits vertical dealers (gym, farm, restaurant); rental words + .equipment fits rental platforms; brand + .equipment fits manufacturer direct sites.",
      bestFor: ["Heavy & farm equipment dealers/rentals", "Gym & sports gear e-commerce", "Restaurant & commercial suppliers", "Used-equipment marketplaces"],
      namingTips: [
        "Category + .equipment is exactly what buyers search",
        "About $11 year one, $23/yr renewal — mid-priced, easy to hold",
        "Nine letters and typo-prone — print the full domain clearly",
        "General tools may fit .tools; full equipment lines live here",
      ],
    },
  },
  supply: {
    tld: "supply",
    zh: {
      title: ".supply 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".supply 是供应与耗材行业的专属后缀，适合建材五金与工业耗材商、餐饮美容等行业耗材供应、潮牌与设计师补给品牌、供应链与批发平台。查看 .supply 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .supply 域名。",
      intro:
        ".supply 把「供给」写进域名：建材五金与工业耗材商、餐饮美容等行业耗材供应、潮牌与设计师补给品牌、供应链与批发平台用 name.supply，客户搜「品类 + supply」时域名就是搜索词本身——coffee.supply 或 barber.supply 这样的组合自带「行业补给站」气质，欧美潮牌也爱用 supply 一词做品牌名。该后缀由 Identity Digital（原 Donuts）注册局运营，注册与续费均约 $21/年（约 ¥152），价格平进平出、没有首年低价陷阱。库存极好：品类词、行业词、品牌词基本都有货，而 XXsupply.com 早被批发商与潮牌占光。注意三点：一是单复数有别，.supplies 是另一个后缀，对外统一用单数拼写；二是无首年折扣，预算敏感的试水项目可先用已收录的 .store / .shop；三是批发生意重账期与物流，域名之外把起订量与配送范围写清楚。命名上「品类 + .supply」适合行业耗材商，「品牌 + .supply」适合潮牌与设计师品牌，「城市 + .supply」适合本地建材五金。",
      bestFor: ["建材五金与工业耗材商", "餐饮美容等行业耗材供应", "潮牌与设计师补给品牌", "供应链与批发平台"],
      namingTips: [
        "「品类 + .supply」就是行业客户的搜索词",
        "注册续费均约 $21/年，平进平出无陷阱",
        "与 .supplies 单复数有别，对外统一单数拼写",
        "潮牌爱用 supply 一词，品牌 + .supply 很衬气质",
      ],
    },
    en: {
      title: ".supply Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".supply is the dedicated suffix for supply businesses — for building material and industrial suppliers, trade consumables for restaurants and salons, streetwear supply brands, and wholesale platforms. See live pricing and naming advice, then hunt available .supply names with AI.",
      intro:
        ".supply writes the business into the domain: building material and industrial suppliers, trade consumables for restaurants and salons, streetwear and designer supply brands, and wholesale platforms on name.supply match exactly what trade customers search — category + supply — and a name like coffee.supply or barber.supply carries built-in \"trade depot\" character; streetwear brands love the word supply too. Operated by Identity Digital (formerly Donuts), both registration and renewal run about $21/yr (≈¥152) — flat pricing with no first-year bait. Inventory is excellent: category words, trade words and brand words nearly all hit, while every XXsupply.com was claimed by wholesalers and streetwear labels long ago. Three cautions: singular matters — .supplies is a different suffix, so standardize on the singular spelling everywhere; there's no first-year discount, so budget-sensitive experiments may start on the already-listed .store or .shop; and wholesale runs on terms and logistics — publish minimum orders and delivery coverage beyond the domain. Naming: category + .supply fits trade consumable shops; brand + .supply fits streetwear and designer labels; city + .supply fits local building suppliers.",
      bestFor: ["Building material & industrial suppliers", "Trade consumables for restaurants & salons", "Streetwear & designer supply brands", "Wholesale & supply chain platforms"],
      namingTips: [
        "Category + .supply is exactly what trade customers search",
        "About $21/yr flat for registration and renewal — no bait pricing",
        ".supplies is a different suffix — standardize on the singular",
        "Streetwear loves the word supply; brand + .supply fits the vibe",
      ],
    },
  },
  parts: {
    tld: "parts",
    zh: {
      title: ".parts 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".parts 是零配件行业的专属后缀，适合汽车摩托零配件电商、家电与手机维修配件、工业备件与机械零件商、二手拆车件与回收平台。查看 .parts 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .parts 域名。",
      intro:
        ".parts 把「配件」写进域名：汽车摩托零配件电商、家电与手机维修配件、工业备件与机械零件商、二手拆车件与回收平台用 name.parts，买家搜「品牌/品类 + parts」时域名就是搜索词本身——bmw.parts 这类组合在海外配件圈早有成交案例，jeep.parts、truck.parts 一看就知道卖什么。该后缀由 Identity Digital（原 Donuts）注册局运营，首年约 $9（约 ¥63），续费约 $33/年（约 ¥241），首年便宜、续费中档。库存很好：品类词、车型词、城市词大多有货，而 XXparts.com 早被配件电商占光。注意三点：一是用汽车品牌词注册（如 bmw.parts）有商标风险，独立配件商注意合理使用与免责声明；二是配件生意重适配查询，域名之外把车型/型号匹配工具做好；三是维修服务本身可斟酌已收录的 .repair，卖件用这里最准。命名上「品类 + .parts」适合垂类配件电商（汽车/家电/机械），「车型/系统 + .parts」适合细分配件站，「品牌 + .parts」适合配件连锁官网。",
      bestFor: ["汽车摩托零配件电商", "家电与手机维修配件", "工业备件与机械零件商", "二手拆车件与回收平台"],
      namingTips: [
        "「品类 + .parts」就是买家的搜索词",
        "首年约 $9、续费约 $33/年，首年便宜续费中档",
        "用汽车品牌词注册有商标风险，注意合理使用",
        "修理服务可斟酌 .repair，卖件用这里",
      ],
    },
    en: {
      title: ".parts Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".parts is the dedicated suffix for the parts trade — for auto and moto parts e-commerce, appliance and phone repair parts, industrial spares dealers, and salvage marketplaces. See live pricing and naming advice, then hunt available .parts names with AI.",
      intro:
        ".parts writes the inventory into the domain: auto and moto parts shops, appliance and phone repair parts, industrial spares dealers, and salvage marketplaces on name.parts match exactly what buyers search — brand or category + parts — names like bmw.parts have real aftermarket sales history abroad, and jeep.parts or truck.parts needs no explanation. Operated by Identity Digital (formerly Donuts), about $9 for the first year (≈¥63) and $33/yr to renew (≈¥241) — cheap to start, mid-priced to hold. Inventory is strong: category words, vehicle words and city words mostly hit, while every XXparts.com was claimed by parts e-commerce long ago. Three cautions: registering car-brand words (like bmw.parts) carries trademark risk — independent sellers should mind nominative fair use and disclaimers; the parts trade runs on fitment lookup, so build model-matching tools beyond the domain; and repair services themselves may fit the already-listed .repair better — selling parts lives here. Naming: category + .parts fits vertical parts shops (auto, appliance, machinery); model or system + .parts fits niche parts sites; brand + .parts fits parts chain sites.",
      bestFor: ["Auto & moto parts e-commerce", "Appliance & phone repair parts", "Industrial spares & machinery parts", "Salvage & used-parts marketplaces"],
      namingTips: [
        "Category + .parts is exactly what buyers search",
        "About $9 year one, $33/yr renewal — cheap start, mid-priced hold",
        "Car-brand words carry trademark risk — mind fair use",
        "Repair services may fit .repair; selling parts lives here",
      ],
    },
  },
  auction: {
    tld: "auction",
    zh: {
      title: ".auction 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".auction 是拍卖行业的专属后缀，适合线上拍卖平台、艺术品与收藏品拍卖行、法拍与资产处置机构、慈善义拍活动。查看 .auction 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .auction 域名。",
      intro:
        ".auction 把「拍卖」写进域名：线上拍卖平台、艺术品与收藏品拍卖行、法拍与资产处置机构、慈善义拍活动用 name.auction，买家一眼就知道「这里出价成交」——art.auction 或 car.auction 这样的组合自带槌声，域名本身就是业务说明。该后缀由 Identity Digital（原 Donuts）注册局运营，首年约 $11（约 ¥78），续费约 $28/年（约 ¥204），首年便宜、续费中档。库存极好：品类词、城市词、行业词基本都有货，而 XXauction.com 早被老牌拍卖行占光。注意三点：一是拍卖涉及资金与竞价规则，正规资质与担保机制要在站内讲清楚，域名只解决「是什么」；二是 auction 拼写较长（7 字母），线下物料印全称并核对拼写；三是普通电商促销不必用它，秒杀折扣类站点更适合后文的 .deals。命名上「品类 + .auction」适合垂类拍卖平台（艺术/汽车/域名），「城市/机构 + .auction」适合本地拍卖行，「慈善词 + .auction」适合义拍活动站。",
      bestFor: ["线上拍卖平台", "艺术品与收藏品拍卖行", "法拍与资产处置机构", "慈善义拍活动"],
      namingTips: [
        "「品类 + .auction」一眼就是竞价场",
        "首年约 $11、续费约 $28/年，首年便宜续费中档",
        "拍卖重资质与担保，站内把规则讲清楚",
        "促销折扣站不必用它，秒杀类更适合 .deals",
      ],
    },
    en: {
      title: ".auction Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".auction is the dedicated suffix for the auction trade — for online auction platforms, art and collectibles houses, foreclosure and asset disposal agencies, and charity auctions. See live pricing and naming advice, then hunt available .auction names with AI.",
      intro:
        ".auction writes the gavel into the domain: online auction platforms, art and collectibles houses, foreclosure and asset-disposal agencies, and charity auctions on name.auction tell buyers instantly that bidding happens here — names like art.auction or car.auction explain the business by themselves. Operated by Identity Digital (formerly Donuts), about $11 for the first year (≈¥78) and $28/yr to renew (≈¥204) — cheap to start, mid-priced to hold. Inventory is excellent: category words, city words and trade words nearly all hit, while every XXauction.com was claimed by established houses long ago. Three cautions: auctions involve money and bidding rules, so licensing and escrow must be explained on-site — the domain only says what you are; auction is a longer spelling (7 letters), so print the full name carefully on offline materials; and ordinary e-commerce promotions don't need it — flash-sale sites fit .deals better. Naming: category + .auction fits vertical platforms (art, cars, domains); city or house name + .auction fits local auction houses; charity words + .auction fits fundraising events.",
      bestFor: ["Online auction platforms", "Art & collectibles auction houses", "Foreclosure & asset disposal", "Charity auction events"],
      namingTips: [
        "Category + .auction reads as a bidding floor at a glance",
        "About $11 year one, $28/yr renewal — cheap start, mid-priced hold",
        "Auctions run on trust — explain licensing and escrow on-site",
        "Flash-sale and promo sites fit .deals better",
      ],
    },
  },
  deals: {
    tld: "deals",
    zh: {
      title: ".deals 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".deals 是促销与优惠信息的专属后缀，适合折扣聚合与比价网站、秒杀与限时特卖频道、本地优惠信息平台、品牌促销活动页。查看 .deals 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .deals 域名。",
      intro:
        ".deals 把「划算」写进域名：折扣聚合与比价网站、秒杀与限时特卖频道、本地优惠信息平台、品牌促销活动页用 name.deals，用户看到域名就知道「这里有便宜可捡」——tech.deals 或 travel.deals 这样的组合自带点击欲，英语里 deals 一词本身就是购物达人每天搜索的高频词。该后缀由 Identity Digital（原 Donuts）注册局运营，首年约 $9（约 ¥63），续费约 $28/年（约 ¥204），首年便宜、续费中档。库存极好：品类词、城市词、场景词基本都有货，而 XXdeals.com 早被返利与比价站占光。注意三点：一是促销信息时效性强，域名之外把更新频率与信息真实性做扎实，过期折扣最伤口碑；二是部分邮件网关对促销类域名的营销邮件更敏感，群发前做好域名预热与 SPF/DKIM；三是主品牌官网不建议用它，促销频道用 .deals、主站用 .com 分工更清晰。命名上「品类 + .deals」适合垂类折扣站（数码/旅行/母婴），「城市 + .deals」适合本地优惠平台，「品牌 + .deals」适合大促活动专页。",
      bestFor: ["折扣聚合与比价网站", "秒杀与限时特卖频道", "本地优惠信息平台", "品牌促销活动页"],
      namingTips: [
        "「品类 + .deals」就是折扣猎人的搜索词",
        "首年约 $9、续费约 $28/年，首年便宜续费中档",
        "促销重时效，过期折扣最伤口碑",
        "主站用 .com、促销频道用 .deals 分工清晰",
      ],
    },
    en: {
      title: ".deals Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".deals is the dedicated suffix for bargains and promotions — for deal aggregators and price-comparison sites, flash-sale channels, local offers platforms, and brand promo landers. See live pricing and naming advice, then hunt available .deals names with AI.",
      intro:
        ".deals writes the bargain into the domain: deal aggregators and price-comparison sites, flash-sale and limited-time channels, local offers platforms, and brand promo landers on name.deals promise savings at a glance — names like tech.deals or travel.deals practically click themselves, and \"deals\" is a word bargain hunters type into search every day. Operated by Identity Digital (formerly Donuts), about $9 for the first year (≈¥63) and $28/yr to renew (≈¥204) — cheap to start, mid-priced to hold. Inventory is excellent: category words, city words and occasion words nearly all hit, while every XXdeals.com was claimed by cashback and comparison sites long ago. Three cautions: deals expire fast, so freshness and accuracy matter more than the domain — stale offers kill trust; some mail gateways scrutinize marketing mail from promo-flavored domains, so warm up the domain and set up SPF/DKIM before campaigns; and a main brand site doesn't belong here — run the brand on .com and the promo channel on the matching .deals. Naming: category + .deals fits vertical deal sites (tech, travel, baby); city + .deals fits local offers platforms; brand + .deals fits big-sale landers.",
      bestFor: ["Deal aggregators & price comparison", "Flash-sale & limited-time channels", "Local offers platforms", "Brand promo landing pages"],
      namingTips: [
        "Category + .deals is exactly what bargain hunters search",
        "About $9 year one, $28/yr renewal — cheap start, mid-priced hold",
        "Deals expire fast — freshness beats everything",
        "Brand on .com, promo channel on the matching .deals",
      ],
    },
  },
  coupons: {
    tld: "coupons",
    zh: {
      title: ".coupons 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".coupons 是优惠券行业的专属后缀，适合优惠券聚合与验证站、品牌折扣码发放页、返利与导购平台、本地商家券包服务。查看 .coupons 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .coupons 域名。",
      intro:
        ".coupons 把「优惠券」写进域名：优惠券聚合与验证站、品牌折扣码发放页、返利与导购平台、本地商家券包服务用 name.coupons，用户搜「品牌/品类 + coupons」时域名就是搜索词本身——fashion.coupons 或 pizza.coupons 一看就知道来领码。该后缀由 Identity Digital（原 Donuts）注册局运营，首年约 $11（约 ¥78），续费约 $51/年（约 ¥366），首年便宜、续费偏高，适合当作长期经营的主域而非批量囤名。库存极好：品牌词、品类词、城市词基本都有货，而 XXcoupons.com 早被返利站占光。注意三点：一是优惠券站的生命线是「码能用」，失效码比没有码更伤口碑，验证机制要下功夫；二是与 .deals 分工——折扣信息流用 .deals，折扣码发放与验证用 .coupons 更精准；三是用大牌名注册（如 nike.coupons）有商标风险，聚合站注意合理使用与免责声明。命名上「品类 + .coupons」适合垂类券站（美妆/餐饮/旅行），「城市 + .coupons」适合本地券包平台，「品牌 + .coupons」适合品牌官方折扣码页。",
      bestFor: ["优惠券聚合与验证站", "品牌折扣码发放页", "返利与导购平台", "本地商家券包服务"],
      namingTips: [
        "「品类 + .coupons」就是找码用户的搜索词",
        "首年约 $11、续费约 $51/年，适合长期主域不宜囤名",
        "失效码最伤口碑，验证机制是生命线",
        "大牌词注册有商标风险，聚合站注意合理使用",
      ],
    },
    en: {
      title: ".coupons Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".coupons is the dedicated suffix for the coupon trade — for coupon aggregators and verifiers, brand discount-code pages, cashback and shopping-guide platforms, and local merchant coupon services. See live pricing and naming advice, then hunt available .coupons names with AI.",
      intro:
        ".coupons writes the discount code into the domain: coupon aggregators and verifiers, brand code pages, cashback and shopping-guide platforms, and local merchant coupon services on name.coupons match exactly what shoppers search — brand or category + coupons — and names like fashion.coupons or pizza.coupons need no explanation. Operated by Identity Digital (formerly Donuts), about $11 for the first year (≈¥78) and $51/yr to renew (≈¥366) — cheap to start but pricier to hold, so treat it as a long-term primary domain rather than a bulk-registration play. Inventory is excellent: brand words, category words and city words nearly all hit, while every XXcoupons.com was claimed by cashback sites long ago. Three cautions: a coupon site lives or dies on codes that work — dead codes hurt more than no codes, so invest in verification; split duties with .deals — deal feeds fit .deals, code distribution and validation fit .coupons; and registering big-brand words (like nike.coupons) carries trademark risk — aggregators should mind fair use and disclaimers. Naming: category + .coupons fits vertical coupon sites (beauty, dining, travel); city + .coupons fits local coupon platforms; brand + .coupons fits official brand code pages.",
      bestFor: ["Coupon aggregators & verifiers", "Brand discount-code pages", "Cashback & shopping-guide platforms", "Local merchant coupon services"],
      namingTips: [
        "Category + .coupons is exactly what code hunters search",
        "About $11 year one, $51/yr renewal — long-term domain, not a bulk play",
        "Dead codes hurt more than no codes — verify relentlessly",
        "Big-brand words carry trademark risk — mind fair use",
      ],
    },
  },
  discount: {
    tld: "discount",
    zh: {
      title: ".discount 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".discount 是折扣零售的专属后缀，适合折扣店与奥特莱斯电商、尾货与清仓特卖平台、学生与会员专属折扣服务、折扣信息聚合站。查看 .discount 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .discount 域名。",
      intro:
        ".discount 把「折扣」写进域名：折扣店与奥特莱斯电商、尾货与清仓特卖平台、学生与会员专属折扣服务、折扣信息聚合站用 name.discount，用户看到域名就默认「这里比别处便宜」——shoes.discount 或 student.discount 这样的组合自带价格锚点，后者在海外更是高频搜索词。该后缀由 Identity Digital（原 Donuts）注册局运营，首年约 $9（约 ¥63），续费约 $28/年（约 ¥204），首年便宜、续费中档。库存极好：品类词、人群词、城市词基本都有货，而 XXdiscount.com 早被折扣零售商占光。注意三点：一是「折扣」定位会拉低品牌溢价预期，走品质路线的品牌主站慎用，清仓副站更合适；二是与近义后缀分工——信息流聚合用 .deals、发码用 .coupons、折扣零售本身用 .discount 最准；三是 discount 拼写较长（8 字母），线下物料印全称并核对拼写。命名上「品类 + .discount」适合垂类折扣电商（鞋服/家电/图书），「人群 + .discount」适合学生/军人等专属折扣服务，「品牌 + .discount」适合品牌清仓副站。",
      bestFor: ["折扣店与奥特莱斯电商", "尾货与清仓特卖平台", "学生与会员专属折扣服务", "折扣信息聚合站"],
      namingTips: [
        "「品类 + .discount」自带「比别处便宜」的锚点",
        "首年约 $9、续费约 $28/年，首年便宜续费中档",
        "品质品牌主站慎用，清仓副站最合适",
        "信息流用 .deals、发码用 .coupons、折扣零售用这里",
      ],
    },
    en: {
      title: ".discount Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".discount is the dedicated suffix for discount retail — for outlet e-commerce, clearance and overstock platforms, student and member discount services, and discount aggregators. See live pricing and naming advice, then hunt available .discount names with AI.",
      intro:
        ".discount writes the price cut into the domain: outlet and discount-store e-commerce, clearance and overstock platforms, student and member discount services, and discount aggregators on name.discount are assumed cheaper than elsewhere at a glance — names like shoes.discount or student.discount carry a built-in price anchor, and \"student discount\" is a high-volume search phrase abroad. Operated by Identity Digital (formerly Donuts), about $9 for the first year (≈¥63) and $28/yr to renew (≈¥204) — cheap to start, mid-priced to hold. Inventory is excellent: category words, audience words and city words nearly all hit, while every XXdiscount.com was claimed by discount retailers long ago. Three cautions: the discount positioning lowers premium expectations, so quality-first brands should keep their main site elsewhere and use it for clearance channels; split duties with the near-synonyms — deal feeds fit .deals, code distribution fits .coupons, discount retail itself fits .discount; and discount is a longer spelling (8 letters), so print the full domain carefully offline. Naming: category + .discount fits vertical discount shops (apparel, appliances, books); audience + .discount fits student or military discount services; brand + .discount fits clearance side-sites.",
      bestFor: ["Outlet & discount-store e-commerce", "Clearance & overstock platforms", "Student & member discount services", "Discount aggregators"],
      namingTips: [
        "Category + .discount anchors 'cheaper than elsewhere' instantly",
        "About $9 year one, $28/yr renewal — cheap start, mid-priced hold",
        "Premium brands: keep the main site elsewhere, use this for clearance",
        "Feeds fit .deals, codes fit .coupons, discount retail lives here",
      ],
    },
  },
  furniture: {
    tld: "furniture",
    zh: {
      title: ".furniture 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".furniture 是家具行业的专属后缀，适合家具品牌与工厂直销站、定制与实木家具工作室、办公家具供应商、二手与中古家具平台。查看 .furniture 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .furniture 域名。",
      intro:
        ".furniture 把「家具」写进域名：家具品牌与工厂直销站、定制与实木家具工作室、办公家具供应商、二手与中古家具平台用 name.furniture，买家搜「风格/品类 + furniture」时域名就是搜索词本身——oak.furniture 这样的组合在海外家具电商圈早有成交案例，office.furniture 一看就知道卖什么。该后缀由 Identity Digital（原 Donuts）注册局运营，首年约 $12（约 ¥88），续费约 $97/年（约 ¥700），续费在行业后缀里偏贵，适合客单价高、长期经营的家具生意，不适合囤名。库存极好：风格词、材质词、品类词基本都有货，而 XXfurniture.com 早被家具商占光。注意三点：一是 furniture 拼写长（9 字母）且易拼错，线下物料印全称并配二维码；二是家具重视觉与场景，域名之外把实拍图与 3D 展示做扎实；三是预算敏感的杂货家居店可先用已收录的 .store / .shop，垂直家具生意用这里最准。命名上「材质/风格 + .furniture」适合定制工作室（oak/vintage），「品类 + .furniture」适合垂类电商（office/outdoor），「品牌 + .furniture」适合家具品牌官网。",
      bestFor: ["家具品牌与工厂直销站", "定制与实木家具工作室", "办公家具供应商", "二手与中古家具平台"],
      namingTips: [
        "「材质/品类 + .furniture」就是买家的搜索词",
        "首年约 $12、续费约 $97/年，适合高客单长期生意",
        "九字母易拼错，线下物料印全称配二维码",
        "杂货家居店可先用 .store，垂直家具用这里",
      ],
    },
    en: {
      title: ".furniture Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".furniture is the dedicated suffix for the furniture trade — for furniture brands and factory-direct stores, custom and solid-wood studios, office furniture suppliers, and vintage furniture marketplaces. See live pricing and naming advice, then hunt available .furniture names with AI.",
      intro:
        ".furniture writes the showroom into the domain: furniture brands and factory-direct stores, custom and solid-wood studios, office furniture suppliers, and vintage marketplaces on name.furniture match exactly what buyers search — style or category + furniture — names like oak.furniture have real sales history in the furniture e-commerce world, and office.furniture needs no explanation. Operated by Identity Digital (formerly Donuts), about $12 for the first year (≈¥88) and $97/yr to renew (≈¥700) — one of the pricier industry suffixes to hold, so it suits high-ticket, long-term furniture businesses rather than bulk registration. Inventory is excellent: style words, material words and category words nearly all hit, while every XXfurniture.com was claimed by furniture sellers long ago. Three cautions: furniture is long (9 letters) and typo-prone — print the full domain with a QR code offline; furniture sells on visuals, so invest in real photography and 3D views beyond the domain; and budget-sensitive general home stores may start on the already-listed .store or .shop — vertical furniture businesses live here. Naming: material or style + .furniture fits custom studios (oak, vintage); category + .furniture fits vertical shops (office, outdoor); brand + .furniture fits brand sites.",
      bestFor: ["Furniture brands & factory-direct stores", "Custom & solid-wood studios", "Office furniture suppliers", "Vintage & used furniture marketplaces"],
      namingTips: [
        "Material or category + .furniture is exactly what buyers search",
        "About $12 year one, $97/yr renewal — for high-ticket, long-term businesses",
        "Nine letters and typo-prone — print the full domain with a QR code",
        "General home stores may start on .store; vertical furniture lives here",
      ],
    },
  },
  lighting: {
    tld: "lighting",
    zh: {
      title: ".lighting 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".lighting 是照明行业的专属后缀，适合灯具品牌与照明电商、照明设计与工程公司、舞台与影视灯光服务、智能照明方案商。查看 .lighting 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .lighting 域名。",
      intro:
        ".lighting 把「照明」写进域名：灯具品牌与照明电商、照明设计与工程公司、舞台与影视灯光服务、智能照明方案商用 name.lighting，客户搜「场景/品类 + lighting」时域名就是搜索词本身——studio.lighting 或 garden.lighting 一看就知道做什么，海外照明设计事务所用这个后缀的不少。该后缀由 Identity Digital（原 Donuts）注册局运营，首年约 $6（约 ¥41），续费约 $20/年（约 ¥143），注册与持有都便宜，是行业后缀里少见的低价平款。库存极好：场景词、品类词、城市词基本都有货，而 XXlighting.com 早被灯具厂商占光。注意三点：一是 lighting 与 lightning（闪电）只差一个字母，线下物料与口播要防拼错；二是照明生意重案例与参数，域名之外把项目实拍与光效参数做扎实；三是泛家居杂货店可先用已收录的 .store，垂直照明生意用这里最准。命名上「场景 + .lighting」适合照明设计公司（stage/garden/office），「品类 + .lighting」适合垂类灯具电商（led/smart），「城市 + .lighting」适合本地照明工程商。",
      bestFor: ["灯具品牌与照明电商", "照明设计与工程公司", "舞台与影视灯光服务", "智能照明方案商"],
      namingTips: [
        "「场景 + .lighting」就是客户的搜索词",
        "首年约 $6、续费约 $20/年，行业后缀里少见的低价平款",
        "与 lightning 只差一字母，物料口播防拼错",
        "泛家居店可先用 .store，垂直照明用这里",
      ],
    },
    en: {
      title: ".lighting Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".lighting is the dedicated suffix for the lighting trade — for lamp brands and lighting e-commerce, lighting design and engineering firms, stage and film lighting services, and smart lighting providers. See live pricing and naming advice, then hunt available .lighting names with AI.",
      intro:
        ".lighting writes the glow into the domain: lamp brands and lighting e-commerce, lighting design and engineering firms, stage and film lighting services, and smart lighting providers on name.lighting match exactly what clients search — scene or category + lighting — names like studio.lighting or garden.lighting explain themselves, and plenty of lighting design firms abroad already use the suffix. Operated by Identity Digital (formerly Donuts), about $6 for the first year (≈¥41) and $20/yr to renew (≈¥143) — cheap to register and cheap to hold, a rare flat-priced bargain among industry suffixes. Inventory is excellent: scene words, category words and city words nearly all hit, while every XXlighting.com was claimed by lamp makers long ago. Three cautions: lighting is one letter away from lightning, so guard against typos in print and speech; lighting sells on portfolios and specs, so invest in project photos and photometric data beyond the domain; and general home stores may start on the already-listed .store — vertical lighting businesses live here. Naming: scene + .lighting fits design firms (stage, garden, office); category + .lighting fits vertical shops (led, smart); city + .lighting fits local lighting contractors.",
      bestFor: ["Lamp brands & lighting e-commerce", "Lighting design & engineering firms", "Stage & film lighting services", "Smart lighting solution providers"],
      namingTips: [
        "Scene + .lighting is exactly what clients search",
        "About $6 year one, $20/yr renewal — a rare flat-priced bargain",
        "One letter from 'lightning' — guard against typos",
        "General home stores may start on .store; vertical lighting lives here",
      ],
    },
  },
  business: {
    tld: "business",
    zh: {
      title: ".business 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".business 把「做生意」直接写进域名，适合中小企业官网、本地商家、创业公司的正式门面与企业信息页。查看 .business 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .business 域名。",
      intro:
        ".business 是语义最直白的企业后缀：中小企业官网、本地商家、初创公司的正式门面用 name.business，访客一眼就明白「这是家正经做生意的」。它和 .company 是近亲——.company 强调法人实体，.business 强调经营本身，餐馆、维修铺、咨询室这类「生意」气质的主体用 .business 更顺口。价格是它的大杀器：首年常见 $2–3（约 ¥19），续费约 $16/年（约 ¥115），续费甚至比 .com 还便宜，是长期持有成本最低的企业后缀之一。注册局为 Identity Digital，RDAP 支持完善。库存极好：公司名、姓氏、行业词几乎随便挑，XXbusiness.com 式的组合早被占光，而 XX.business 还大片空着。注意两点：一是 8 个字母的后缀偏长，前面的名字要短；二是大众认知度仍不如 .com，印在名片上最好配一句业务说明。命名上「姓氏/店名 + .business」适合本地商家，「行业词 + .business」适合垂直服务商，「品牌词 + .business」适合把主站留在 .com、企业信息页放这里的分层玩法。",
      bestFor: ["中小企业官网", "本地商家门面站", "创业公司正式主页", "品牌的企业信息页"],
      namingTips: [
        "「店名/姓氏 + .business」是本地商家最自然的写法",
        "首年约 $2–3、续费约 $16/年，比 .com 续费还便宜",
        "后缀 8 个字母偏长，名字本身控制在 6 字符内",
        "认知度不及 .com，线下物料配一句业务说明",
      ],
    },
    en: {
      title: ".business Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".business writes commerce straight into the domain — for SMB websites, local shops, and startup homepages that want a formal storefront. See live pricing and naming advice, then hunt available .business names with AI.",
      intro:
        ".business is the most literal company suffix there is: SMB websites, local shops and startup homepages on name.business tell visitors instantly that this is a real, operating business. It's a close cousin of .company — .company stresses the legal entity, .business stresses the trade itself, so restaurants, repair shops and consultancies read more naturally here. Price is the killer feature: typically $2–3 for the first year (≈¥19) and about $16/yr to renew (≈¥115) — cheaper to renew than a .com, making it one of the lowest-cost business suffixes to hold long term. The registry is Identity Digital with mature RDAP support. Inventory is superb: company names, surnames and trade words are nearly all open, while every XXbusiness.com combo was claimed ages ago. Two cautions: at 8 letters the suffix is long, so keep the root short; and mainstream recognition still trails .com, so pair it with a one-line descriptor on print materials. Naming: shop or family name + .business fits local merchants; trade word + .business fits vertical services; brand + .business works as a corporate-info page while the product lives on its own domain.",
      bestFor: ["SMB company websites", "Local shop storefronts", "Startup formal homepages", "Corporate-info pages for brands"],
      namingTips: [
        "Shop or family name + .business is the natural local-merchant shape",
        "About $2–3 year one, $16/yr renewal — cheaper than a .com renewal",
        "The 8-letter suffix is long — keep the root under 6 characters",
        "Recognition trails .com; add a one-line descriptor on print materials",
      ],
    },
  },
  limited: {
    tld: "limited",
    zh: {
      title: ".limited 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".limited 对应有限公司的 Limited 后缀，也自带「限量」语义，适合英联邦体系有限公司、限量发售品牌、会员制精品店。查看 .limited 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .limited 域名。",
      intro:
        ".limited 一词两义，是新后缀里少见的双面手。第一面是公司后缀：英联邦体系的有限公司（Limited/Ltd）把 brand.limited 当官网，等于把注册名写进域名，比 .ltd 更完整正式，香港、英国、澳新的公司尤其对味。第二面是「限量」语义：限量发售的潮牌、小批量手作、会员制精品店用 name.limited，稀缺感直接从域名溢出来——drop.limited 这种组合天然带饥饿营销气质。注册局为 Identity Digital。价格中规中矩：首年约 $8（约 ¥59），续费约 $29/年（约 ¥211）。库存很好：品牌词、姓氏、潮流词大多有货。注意两点：一是两个语义别混用，公司官网就正经做企业站，潮牌就做限量叙事，摇摆会让访客困惑；二是美国用户对 Limited 公司后缀不敏感，主打美国市场的正式企业站 .com/.inc 更稳。命名上「注册名 + .limited」适合有限公司官网，「品牌词 + .limited」适合限量品牌，词根本身短一点，7 字母后缀才不显冗长。",
      bestFor: ["英联邦体系有限公司官网", "限量发售潮牌", "小批量手作与精品店", "会员制商店"],
      namingTips: [
        "有限公司用「注册名 + .limited」，域名即公司名",
        "首年约 $8、续费约 $29/年，中规中矩",
        "限量品牌可用 drop/edition 等词根强化稀缺感",
        "主打美国市场的正式企业站更适合 .com/.inc",
      ],
    },
    en: {
      title: ".limited Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".limited doubles as the Limited company suffix and a scarcity signal — for Commonwealth limited companies, limited-edition brands, and members-only boutiques. See live pricing and naming advice, then hunt available .limited names with AI.",
      intro:
        ".limited carries two meanings at once — a rare double act among new TLDs. Face one is corporate: limited companies in Commonwealth jurisdictions put brand.limited on the door, writing the registered name into the domain itself — more complete and formal than .ltd, and especially natural for UK, Hong Kong, Australian and NZ companies. Face two is scarcity: limited-edition streetwear, small-batch crafts and members-only boutiques on name.limited leak exclusivity straight from the address — a combo like drop.limited practically markets itself. The registry is Identity Digital. Pricing is middle-of-the-road: about $8 first year (≈¥59) and $29/yr to renew (≈¥211). Inventory is strong: brand words, surnames and streetwear roots mostly hit. Two cautions: don't mix the two meanings — run a proper corporate site or a scarcity story, not both, or visitors get confused; and US audiences don't register \"Limited\" as a company suffix, so a formal US-market corporate site is safer on .com or .inc. Naming: registered name + .limited for limited companies; brand + .limited for edition-driven brands — and keep the root short, since the 7-letter suffix adds length.",
      bestFor: ["Commonwealth limited-company sites", "Limited-edition streetwear brands", "Small-batch craft & boutique shops", "Members-only stores"],
      namingTips: [
        "Limited companies: registered name + .limited — the domain is the company name",
        "About $8 year one, $29/yr renewal — middle-of-the-road pricing",
        "Edition brands: roots like drop or edition amplify the scarcity story",
        "Formal US-market corporate sites are safer on .com or .inc",
      ],
    },
  },
  associates: {
    tld: "associates",
    zh: {
      title: ".associates 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".associates 是律所、会计所、咨询所等专业合伙机构的经典后缀——「姓氏 + Associates」的命名传统直接搬进域名。查看 .associates 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .associates 域名。",
      intro:
        ".associates 把专业服务业最经典的命名传统写进域名：欧美的律所、会计师事务所、咨询公司、建筑设计所惯用「创始人姓氏 + & Associates」作为字号，smith.associates 就是 Smith & Associates 的完美数字化——比 smithassociates.com 短一截，还省掉了尴尬的 & 符号。它和已收录的 .partners 是近亲：.partners 强调合伙人之间的关系，.associates 更贴「字号」本身，凡是名片上印着 Associates 的机构用它都顺理成章。注册局为 Identity Digital。价格中档：首年约 $12（约 ¥85），续费约 $31/年（约 ¥226）。库存极好：姓氏类词根几乎随便注册，这在 .com 上不可想象。注意两点：一是 10 个字母的后缀相当长，前面必须是短姓氏或短词，否则整个域名难读；二是它气质非常「机构」，个人顾问或轻咨询品牌用 .expert/.consulting 更灵活。命名上「姓氏 + .associates」是绝对主流，「领域词 + .associates」（tax.associates）适合突出专业方向的所。",
      bestFor: ["律师事务所", "会计与税务师事务所", "咨询与设计事务所", "「姓氏 + Associates」字号机构"],
      namingTips: [
        "「姓氏 + .associates」直接对应 Smith & Associates 命名传统",
        "首年约 $12、续费约 $31/年，专业所预算内",
        "后缀 10 个字母很长，词根务必短",
        "个人顾问用 .expert/.consulting 更灵活，这里适合机构字号",
      ],
    },
    en: {
      title: ".associates Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".associates is the classic suffix for law, accounting, consulting and design partnerships — the \"Name & Associates\" tradition, digitized. See live pricing and naming advice, then hunt available .associates names with AI.",
      intro:
        ".associates digitizes the most classic naming tradition in professional services: law firms, accounting practices, consultancies and architecture studios have branded themselves \"Founder & Associates\" for a century, and smith.associates is the perfect domain form of Smith & Associates — shorter than smithassociates.com and rid of the awkward ampersand. It's a close cousin of the already-listed .partners: .partners stresses the relationship between partners, while .associates matches the firm name itself — any practice with \"Associates\" on the letterhead belongs here. The registry is Identity Digital. Pricing is mid-tier: about $12 first year (≈¥85) and $31/yr to renew (≈¥226). Inventory is superb — surname roots are nearly all open, unthinkable on .com. Two cautions: at 10 letters the suffix is genuinely long, so the root must be a short surname or word or the whole domain becomes unreadable; and its personality is firmly institutional — solo consultants and lightweight advisory brands read better on .expert or .consulting. Naming: surname + .associates is the dominant shape; field word + .associates (tax.associates) suits practices leading with their specialty.",
      bestFor: ["Law firms", "Accounting & tax practices", "Consulting & design studios", "\"Name & Associates\" branded firms"],
      namingTips: [
        "Surname + .associates maps straight onto the Smith & Associates tradition",
        "About $12 year one, $31/yr renewal — within a firm's budget",
        "The 10-letter suffix is long — keep the root short",
        "Solo consultants read better on .expert/.consulting; firms live here",
      ],
    },
  },
  cheap: {
    tld: "cheap",
    zh: {
      title: ".cheap 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".cheap 把「便宜」大大方方写进域名，适合比价与省钱攻略站、折扣电商、廉价机票酒店聚合等一切以低价为卖点的生意。查看 .cheap 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .cheap 域名。",
      intro:
        ".cheap 是最诚实的后缀：把「便宜」两个字大大方方挂在域名上。比价网站、省钱攻略博客、折扣电商、廉价机票酒店聚合——凡是以低价为核心卖点的生意，flights.cheap 或 hotels.cheap 这样的域名就是广告语本身，用户搜「cheap + 品类」时你的域名与搜索词逐字吻合。它和已收录的 .deals/.discount 是同一族：.deals 强调「有好交易」，.discount 强调「打折」，.cheap 最直给——就是便宜。注册局为 Identity Digital。价格贴合人设：首年约 $6（约 ¥41），续费约 $29/年（约 ¥211）。库存极好：品类词、场景词基本全有货。注意两点：一是 cheap 在英语里有「廉价=劣质」的潜台词，做品牌调性的产品别碰，它只适合旗帜鲜明的省钱生意；二是这类流量站竞争激烈，域名只是起点，内容与比价数据才是壁垒。命名上「品类 + .cheap」（flights/hotels/eats）是标准句式，「fly/stay/eat 等动词 + .cheap」更口语上头，注意别再在词根里塞 cheap 造成重复。",
      bestFor: ["比价与省钱攻略站", "折扣电商与清仓店", "廉价机票酒店聚合", "优惠信息聚合站"],
      namingTips: [
        "「品类 + .cheap」与用户搜索词逐字吻合",
        "首年约 $6、续费约 $29/年，和人设一样便宜",
        "cheap 有「廉价」潜台词，品牌调性产品别用",
        "词根别再含 cheap，避免 cheapflights.cheap 式重复",
      ],
    },
    en: {
      title: ".cheap Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".cheap puts low prices right in the address — for price-comparison sites, savings blogs, discount stores and budget travel aggregators. See live pricing and naming advice, then hunt available .cheap names with AI.",
      intro:
        ".cheap is the most honest suffix on the internet: it hangs \"low prices\" right on the door. Price-comparison sites, savings blogs, discount e-commerce, budget flight and hotel aggregators — for any business whose pitch is the price, a domain like flights.cheap or hotels.cheap is the ad copy itself, matching \"cheap + category\" searches word for word. It belongs to the same family as the already-listed .deals and .discount: .deals promises a good bargain, .discount promises a markdown, .cheap is the bluntest of the three. The registry is Identity Digital. Pricing matches the persona: about $6 first year (≈¥41) and $29/yr to renew (≈¥211). Inventory is excellent — category and scenario words nearly all hit. Two cautions: in English, cheap carries a \"low quality\" undertone, so brand-conscious products should stay away — this suffix is for proudly budget-first businesses only; and traffic plays in this niche are brutally competitive, so the domain is the start, not the moat — the comparison data is. Naming: category + .cheap (flights, hotels, eats) is the standard shape; verb + .cheap (fly, stay, eat) reads even catchier — and never repeat cheap in the root.",
      bestFor: ["Price-comparison & savings sites", "Discount e-commerce & outlets", "Budget flight & hotel aggregators", "Deal-hunting content sites"],
      namingTips: [
        "Category + .cheap matches user searches word for word",
        "About $6 year one, $29/yr renewal — as cheap as the persona",
        "The word carries a low-quality undertone — skip it for premium brands",
        "Never repeat cheap in the root — avoid cheapflights.cheap redundancy",
      ],
    },
  },
  bargains: {
    tld: "bargains",
    zh: {
      title: ".bargains 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".bargains 是「捡便宜」的复数狂欢，适合折扣信息聚合站、清仓特卖电商、二手捡漏社区与本地特卖情报号。查看 .bargains 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .bargains 域名。",
      intro:
        ".bargains 和 .cheap 一字之差，气质却软得多：cheap 说「我便宜」，bargain 说「你赚到了」——前者是价格标签，后者是淘到宝的快感。折扣信息聚合站、清仓特卖电商、二手捡漏社区、本地特卖情报号用 name.bargains，域名自带「进来捡漏」的邀请函。复数形式暗示「这里有一堆好货」，做聚合与清单类内容尤其贴：daily.bargains、tech.bargains 读起来就像栏目名。注册局为 Identity Digital。价格中低档：首年约 $12（约 ¥85），续费约 $24/年（约 ¥174），续费比 .cheap/.discount 都温和，长期持有更划算。库存极好：品类词、地名、频率词全线有货。注意两点：一是 8 个字母的后缀不短，词根要短；二是它和已收录的 .deals 语义高度重叠，选型时看语感——deals 偏交易促成，bargains 偏捡漏乐趣，社区型产品用 bargains 更有烟火气。命名上「品类/地名 + .bargains」是主流，「daily/weekly 等频率词 + .bargains」适合订阅制特卖情报。",
      bestFor: ["折扣信息聚合站", "清仓特卖电商", "二手捡漏社区", "本地特卖情报订阅"],
      namingTips: [
        "「品类/地名 + .bargains」自带「进来捡漏」的邀请感",
        "首年约 $12、续费约 $24/年，同族里续费最温和",
        "后缀 8 个字母，词根控制在 5–6 字符",
        "与 .deals 高度同义：deals 偏交易，bargains 偏捡漏乐趣",
      ],
    },
    en: {
      title: ".bargains Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".bargains celebrates the thrill of the find — for deal-aggregation sites, clearance stores, secondhand treasure-hunting communities and local sale alerts. See live pricing and naming advice, then hunt available .bargains names with AI.",
      intro:
        ".bargains sits one word from .cheap but feels much warmer: cheap says \"I'm inexpensive,\" bargain says \"you scored\" — one is a price tag, the other is the thrill of the find. Deal-aggregation sites, clearance e-commerce, secondhand treasure-hunting communities and local sale alerts on name.bargains carry a built-in invitation to come dig. The plural implies a whole pile of finds, which suits aggregation and list-style content especially well: daily.bargains or tech.bargains read like column names. The registry is Identity Digital. Pricing is low-to-mid: about $12 first year (≈¥85) and $24/yr to renew (≈¥174) — gentler renewals than .cheap or .discount, so long-term holds cost less. Inventory is excellent: category words, place names and frequency words all hit. Two cautions: the 8-letter suffix isn't short, so keep the root tight; and it overlaps heavily with the already-listed .deals — pick by tone: deals leans transactional, bargains leans hunt-and-delight, so community products feel homier here. Naming: category or place + .bargains is the dominant shape; frequency words like daily or weekly + .bargains suit subscription-style sale alerts.",
      bestFor: ["Deal-aggregation sites", "Clearance & outlet e-commerce", "Secondhand treasure-hunt communities", "Local sale alert subscriptions"],
      namingTips: [
        "Category or place + .bargains is a built-in invitation to come dig",
        "About $12 year one, $24/yr renewal — gentlest renewal in the family",
        "The 8-letter suffix needs a 5–6 character root",
        "Near-synonym of .deals: deals is transactional, bargains is the thrill",
      ],
    },
  },
  supplies: {
    tld: "supplies",
    zh: {
      title: ".supplies 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".supplies 是耗材与物资的专属后缀，适合办公与美术用品店、宠物与园艺耗材电商、行业物资 B2B 供应商。查看 .supplies 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .supplies 域名。",
      intro:
        ".supplies 把「耗材/物资」写进域名：办公用品店、美术画材铺、宠物与园艺耗材电商、实验室与医疗物资商、行业 B2B 供应商用 name.supplies，客户搜「品类 + supplies」时域名与搜索词逐字对齐——art.supplies、pet.supplies 一看就是卖什么的。它和已收录的单数 .supply 是一对：.supply 偏「供应链/供给」的抽象概念（水电、能源、供应链服务），复数 .supplies 具体指「一件件耗材」，卖实物耗材的店用复数更准。注册局为 Identity Digital。价格是少见的平价平款：注册与续费都约 $20/年（约 ¥145），没有首年低价续费跳涨的套路，长期持有成本可预期。库存极好：品类词几乎全有货，XXsupplies.com 早被文具与耗材商占光。注意两点：一是 8 个字母的后缀偏长，词根要短；二是复数后缀口播时容易漏掉尾音 s，线下传播多的生意要留意。命名上「品类 + .supplies」是绝对主流（office/art/pet/garden/lab），「场景 + .supplies」（studio/camp）适合垂直细分，词根别再含 supply 避免重复。",
      bestFor: ["办公与美术用品店", "宠物与园艺耗材电商", "实验室与医疗物资商", "行业物资 B2B 供应商"],
      namingTips: [
        "「品类 + .supplies」与客户搜索词逐字对齐",
        "注册续费均约 $20/年，无首年套路，成本可预期",
        "后缀 8 个字母偏长，词根控制在 5 字符左右",
        "口播易漏尾音 s，线下传播多的生意要留意",
      ],
    },
    en: {
      title: ".supplies Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".supplies is the dedicated suffix for consumables and materials — for office and art supply stores, pet and garden consumables, and B2B industrial suppliers. See live pricing and naming advice, then hunt available .supplies names with AI.",
      intro:
        ".supplies writes the goods into the address: office supply stores, art material shops, pet and garden consumable e-commerce, lab and medical suppliers and industrial B2B vendors on name.supplies align word for word with what customers search — art.supplies or pet.supplies explains the shop at a glance. It pairs with the already-listed singular .supply: .supply leans abstract — supply chains, energy, provisioning services — while the plural .supplies means the physical items themselves, so stores selling actual consumables are more precise here. The registry is Identity Digital. Pricing is a rare flat deal: roughly $20/yr for both registration and renewal (≈¥145) — no first-year teaser, no renewal jump, fully predictable holding costs. Inventory is excellent: category words nearly all hit, while every XXsupplies.com was claimed by stationers long ago. Two cautions: the 8-letter suffix is on the long side, so keep the root short; and the trailing s gets swallowed in speech, so businesses that spread by word of mouth should watch for it. Naming: category + .supplies is the dominant shape (office, art, pet, garden, lab); scene + .supplies (studio, camp) suits vertical niches — and never repeat supply in the root.",
      bestFor: ["Office & art supply stores", "Pet & garden consumables e-commerce", "Lab & medical suppliers", "B2B industrial supply vendors"],
      namingTips: [
        "Category + .supplies aligns word for word with customer searches",
        "About $20/yr to register and renew — flat, predictable pricing",
        "The 8-letter suffix needs a root of roughly 5 characters",
        "The trailing s gets swallowed in speech — mind word-of-mouth channels",
      ],
    },
  },
  camp: {
    tld: "camp",
    zh: {
      title: ".camp 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".camp 是露营与户外营地的专属后缀，适合营地与房车公园官网、夏令营与研学项目、户外装备品牌与训练营式课程。查看 .camp 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .camp 域名。",
      intro:
        ".camp 把「营地」直接挂在域名上：露营地与房车公园官网、亲子夏令营与研学项目、户外探险俱乐部用 name.camp，用户一眼就知道这是个「可以去住、去玩、去学」的地方。它还有一层引申义被科技圈玩得很转——训练营（bootcamp）：编程集训营、健身训练营、写作营用 code.camp、fit.camp 这样的名字，比 .courses 更有「沉浸式集训」的气氛。已收录的 .campsite/.campgear 行业指南对应的正是这个后缀的核心客群。注册局为 Identity Digital。价格是典型的首年促销结构：首年约 $12（约 ¥88），续费约 $55/年（约 ¥398），长期持有要按续费价做预算。库存极好：地名、自然词、活动词基本全有货。注意两点：一是 camp 在英语网络语境里另有「刻意夸张」的亚文化含义，做正式品牌时留意语境；二是营地生意季节性强，域名之外要把预订系统做好。命名上「地名/自然词 + .camp」（pine.camp、lakeside.camp）最直觉，「主题词 + .camp」（code.camp、art.camp）适合训练营类产品。",
      bestFor: ["露营地与房车公园", "夏令营与研学项目", "编程/健身等训练营", "户外俱乐部与装备品牌"],
      namingTips: [
        "「地名/自然词 + .camp」自带营地画面感",
        "首年约 $12、续费约 $55/年，按续费价做长期预算",
        "训练营类产品用「主题词 + .camp」比 .courses 更有集训氛围",
        "词根别再含 camp，避免 campsite.camp 式重复",
      ],
    },
    en: {
      title: ".camp Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".camp is the dedicated suffix for camping and outdoor sites — for campgrounds and RV parks, summer camps, bootcamp-style courses and outdoor gear brands. See live pricing and naming advice, then hunt available .camp names with AI.",
      intro:
        ".camp hangs the campsite right on the domain: campgrounds and RV parks, family summer camps, study-tour programs and outdoor clubs on name.camp read instantly as \"a place to stay, play and learn\". Tech circles gave it a second life via the bootcamp: coding bootcamps, fitness camps and writing retreats on code.camp or fit.camp carry an immersive-cohort vibe that .courses can't match. The already-listed campsite and campgear industry guides describe exactly this suffix's core audience. The registry is Identity Digital. Pricing follows the classic promo structure: about $12 first year (≈¥88) and $55/yr to renew (≈¥398), so budget on the renewal for long holds. Inventory is excellent — place names, nature words and activity words nearly all hit. Two cautions: in internet English, camp also means \"deliberately exaggerated\" as an aesthetic, so mind the context for formal brands; and campground businesses are seasonal — the domain is the door, the booking system is the business. Naming: place or nature word + .camp (pine.camp, lakeside.camp) is the intuitive shape; theme + .camp (code.camp, art.camp) suits bootcamp products.",
      bestFor: ["Campgrounds & RV parks", "Summer camps & study tours", "Coding & fitness bootcamps", "Outdoor clubs & gear brands"],
      namingTips: [
        "Place or nature word + .camp paints the campsite instantly",
        "About $12 year one, $55/yr renewal — budget on the renewal",
        "Bootcamp products read more immersive on .camp than .courses",
        "Never repeat camp in the root — avoid campsite.camp redundancy",
      ],
    },
  },
  camera: {
    tld: "camera",
    zh: {
      title: ".camera 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".camera 是影像器材与摄影行业的专属后缀，适合相机器材店与二手器材平台、摄影师作品集、影像技术产品与摄像头硬件品牌。查看 .camera 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .camera 域名。",
      intro:
        ".camera 把「相机」写进域名：相机与镜头器材店、二手器材交易平台、摄影师个人站、影像技术产品用 name.camera，卖什么、做什么一目了然。它和已收录的 .photography/.photos/.photo 是近亲，但分工不同：.photography 说「摄影这门手艺」，.photos 说「照片本身」，.camera 说的是「器材与设备」——器材店、租赁行、测评媒体用 .camera 比 .photography 更准。智能硬件是它的第二战场：行车记录仪、安防摄像头、网络摄像头品牌用 name.camera，域名即品类。注册局为 Identity Digital。价格中档偏上：首年约 $13（约 ¥94），续费约 $52/年（约 ¥374），续费是首年数倍，长期持有按续费价算账。库存极好：品牌词、器材词、场景词全线有货。注意：后缀 6 个字母不算短，词根宜短；且语义强绑定「器材」，纯摄影服务（婚纱、写真）用 .photography 系更贴。命名上「品牌词 + .camera」最主流，「场景/用途 + .camera」（dash.camera、door.camera）适合硬件单品。",
      bestFor: ["相机与镜头器材店", "二手器材交易平台", "摄像头与影像硬件品牌", "器材租赁与测评媒体"],
      namingTips: [
        "「品牌词 + .camera」域名即品类，器材生意零解释",
        "首年约 $13、续费约 $52/年，长期按续费价预算",
        "器材与设备类用 .camera，摄影服务类用 .photography 更贴",
        "后缀 6 个字母，词根控制在 4–6 字符",
      ],
    },
    en: {
      title: ".camera Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".camera is the dedicated suffix for imaging gear and the photo trade — for camera stores, used-gear marketplaces, photographer portfolios and camera hardware brands. See live pricing and naming advice, then hunt available .camera names with AI.",
      intro:
        ".camera writes the gear into the address: camera and lens stores, used-equipment marketplaces, photographer sites and imaging-tech products on name.camera explain themselves at a glance. It's kin to the already-listed .photography, .photos and .photo, but the division of labor differs: .photography is the craft, .photos is the pictures, .camera is the equipment — so gear shops, rental houses and review media are more precise here. Smart hardware is its second front: dashcam, security-camera and webcam brands on name.camera make the domain the category. The registry is Identity Digital. Pricing is upper-mid: about $13 first year (≈¥94) and $52/yr to renew (≈¥374) — several times the intro, so budget on the renewal. Inventory is excellent: brand words, gear words and scenario words all hit. Cautions: the 6-letter suffix isn't short, so keep the root tight; and the semantics bind hard to equipment — photo services (weddings, portraits) read better on the .photography family. Naming: brand + .camera is the mainstream shape; scenario + .camera (dash.camera, door.camera) suits single-product hardware.",
      bestFor: ["Camera & lens stores", "Used-gear marketplaces", "Camera hardware brands", "Gear rental & review media"],
      namingTips: [
        "Brand + .camera makes the domain the category — zero explanation",
        "About $13 year one, $52/yr renewal — budget on the renewal",
        "Gear and hardware take .camera; photo services fit .photography better",
        "The 6-letter suffix needs a root of 4–6 characters",
      ],
    },
  },
  diamonds: {
    tld: "diamonds",
    zh: {
      title: ".diamonds 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".diamonds 是钻石与高级珠宝的专属后缀，适合钻石零售与定制品牌、培育钻石电商、婚戒定制工作室与宝石批发商。查看 .diamonds 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .diamonds 域名。",
      intro:
        ".diamonds 把「钻石」直接镶进域名：钻石零售品牌、培育钻石电商、婚戒定制工作室、宝石批发商用 name.diamonds，客户搜「品牌 + diamonds」时域名与搜索词逐字吻合。它比已收录的 .jewelry 更聚焦——.jewelry 覆盖全品类首饰，.diamonds 只说钻石，主打钻石品类的品牌用它定位更锋利；近年培育钻石（lab-grown）赛道爆发，lab.diamonds、eco.diamonds 这样的名字自带品类故事。注册局为 Identity Digital。价格与品类身价相称：首年约 $50（约 ¥360），续费约 $52/年（约 ¥374），首年续费几乎平价，没有低价钩子，反而让持有成本可预期。库存极好：品牌词、产地词、工艺词全线有货。注意两点：一是 8 个字母的后缀偏长，词根务必短；二是高客单价品类信任门槛高，新品牌建议同时持有 .com 做主站、.diamonds 做品类站或活动页。命名上「品牌词 + .diamonds」最主流，「产地/工艺 + .diamonds」（antwerp.diamonds、lab.diamonds）适合垂直定位。",
      bestFor: ["钻石零售与定制品牌", "培育钻石电商", "婚戒定制工作室", "宝石批发与供应链商"],
      namingTips: [
        "「品牌词 + .diamonds」与客户搜索词逐字吻合",
        "首年约 $50、续费约 $52/年，几乎平价，成本可预期",
        "比 .jewelry 更聚焦：主打钻石品类定位更锋利",
        "后缀 8 个字母偏长，词根控制在 4–5 字符",
      ],
    },
    en: {
      title: ".diamonds Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".diamonds is the dedicated suffix for diamonds and fine jewelry — for diamond retailers, lab-grown diamond e-commerce, engagement-ring studios and gem wholesalers. See live pricing and naming advice, then hunt available .diamonds names with AI.",
      intro:
        ".diamonds sets the stone right in the address: diamond retail brands, lab-grown diamond e-commerce, engagement-ring studios and gem wholesalers on name.diamonds match \"brand + diamonds\" searches word for word. It's sharper than the already-listed .jewelry — .jewelry covers every ornament, .diamonds says only diamonds, so diamond-first brands position more precisely here; and with the lab-grown boom, names like lab.diamonds or eco.diamonds carry the category story built in. The registry is Identity Digital. Pricing matches the merchandise: about $50 first year (≈¥360) and $52/yr to renew (≈¥374) — nearly flat, no teaser hook, fully predictable holding costs. Inventory is excellent: brand words, origin words and craft words all hit. Two cautions: the 8-letter suffix runs long, so keep the root short; and high-ticket categories carry high trust bars — new brands should pair a .com main site with .diamonds as the category or campaign domain. Naming: brand + .diamonds is the mainstream shape; origin or craft + .diamonds (antwerp.diamonds, lab.diamonds) suits vertical positioning.",
      bestFor: ["Diamond retail & custom brands", "Lab-grown diamond e-commerce", "Engagement-ring studios", "Gem wholesalers & supply chains"],
      namingTips: [
        "Brand + .diamonds matches customer searches word for word",
        "About $50 year one, $52/yr renewal — nearly flat, predictable",
        "Sharper than .jewelry for diamond-first brand positioning",
        "The 8-letter suffix needs a root of 4–5 characters",
      ],
    },
  },
  theater: {
    tld: "theater",
    zh: {
      title: ".theater 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".theater 是剧场与演出行业的专属后缀，适合剧院与剧团官网、演出票务与剧目宣传页、戏剧教育机构与家庭影院方案商。查看 .theater 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .theater 域名。",
      intro:
        ".theater 把「剧场」搬进域名：剧院与剧团官网、演出季与剧目宣传页、戏剧教育机构用 name.theater，观众一眼读懂这是看戏的地方。它用的是美式拼写 theater（英式为 theatre），面向北美观众零违和，面向英联邦市场时要留意拼写习惯差异。除了舞台艺术，它还有一个务实的第二客群：家庭影院（home theater）——影音方案商、视听器材店用 home.theater 式命名，域名即品类。注册局为 Identity Digital。价格偏高且平进平出：首年约 $55（约 ¥396），续费约 $60/年（约 ¥430），没有首年钩子，成本可预期。库存极好：城市名、剧种词、品牌词全线有货，city.theater 式地名组合是剧院官网的黄金句式。注意两点：一是 7 个字母后缀不短，词根宜短；二是演出行业域名之外更依赖票务与会员系统，域名是门面不是全部。命名上「城市/街区 + .theater」（downtown.theater）最主流，「剧种/品牌 + .theater」（puppet.theater）适合垂直剧团。",
      bestFor: ["剧院与剧团官网", "演出票务与剧目宣传", "戏剧教育与青少年剧社", "家庭影院与视听方案商"],
      namingTips: [
        "「城市/街区 + .theater」是剧院官网的黄金句式",
        "首年约 $55、续费约 $60/年，平进平出成本可预期",
        "美式拼写 theater，面向英联邦市场留意 theatre 拼写差异",
        "家庭影院方案商用 home.theater 式命名域名即品类",
      ],
    },
    en: {
      title: ".theater Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".theater is the dedicated suffix for stage and performance — for theaters and troupes, show ticketing and season pages, drama schools and home-theater providers. See live pricing and naming advice, then hunt available .theater names with AI.",
      intro:
        ".theater moves the stage into the address: theater and troupe websites, season and show promo pages, and drama schools on name.theater tell audiences instantly where the show is. It uses the American spelling (theatre is the British form) — frictionless for North American audiences, worth noting for Commonwealth markets. Beyond the stage it has a pragmatic second audience: home theater — AV integrators and equipment stores naming like home.theater make the domain the category. The registry is Identity Digital. Pricing is upper-tier and flat: about $55 first year (≈¥396) and $60/yr to renew (≈¥430) — no teaser hook, predictable costs. Inventory is excellent: city names, genre words and brand words all hit, and city + .theater is the golden shape for venue websites. Two cautions: the 7-letter suffix isn't short, so keep the root tight; and performance businesses live on ticketing and membership systems — the domain is the marquee, not the box office. Naming: city or district + .theater (downtown.theater) is the mainstream shape; genre or brand + .theater (puppet.theater) suits specialist troupes.",
      bestFor: ["Theater & troupe websites", "Show ticketing & season pages", "Drama schools & youth theater", "Home-theater & AV providers"],
      namingTips: [
        "City or district + .theater is the golden shape for venues",
        "About $55 year one, $60/yr renewal — flat and predictable",
        "American spelling — mind theatre for Commonwealth markets",
        "AV integrators: home.theater-style names make the domain the category",
      ],
    },
  },
  accountants: {
    tld: "accountants",
    zh: {
      title: ".accountants 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".accountants 是会计师行业的专属后缀，适合会计师事务所、税务与审计服务、记账代理公司与注册会计师个人品牌。查看 .accountants 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .accountants 域名。",
      intro:
        ".accountants 把职业身份写进域名：会计师事务所、税务与审计服务、记账代理公司、注册会计师个人品牌用 name.accountants，客户搜「地名/姓氏 + accountants」时域名与搜索词逐字吻合——这正是英语市场找会计师的标准搜法。它和已收录的 .tax/.lawyer/.legal 同属专业服务族：.tax 说「税这件事」，.accountants 说「我们是会计师」，事务所官网用后者身份感更强。已收录的 accounting 行业指南对应的正是这个客群。注册局为 Identity Digital。价格是全族里的高位：首年约 $85（约 ¥612），续费约 $90/年（约 ¥648），平进平出无钩子——高价本身就是过滤器，注册者几乎全是真事务所，后缀信誉反而干净。库存极好：姓氏、地名、组合词全线有货。注意两点：一是 11 个字母是最长的后缀之一，词根务必短；二是高续费适合执业多年的事务所，个人新手可先用 .pro 过渡。命名上「姓氏/合伙人名 + .accountants」延续行业传统，「城市 + .accountants」（london.accountants）是本地获客利器。",
      bestFor: ["会计师事务所", "税务与审计服务", "记账代理公司", "注册会计师个人品牌"],
      namingTips: [
        "「姓氏/城市 + .accountants」与客户搜索词逐字吻合",
        "首年约 $85、续费约 $90/年，高价过滤让后缀信誉干净",
        "后缀 11 个字母，词根控制在 4–6 字符",
        "新执业个人可先用 .pro 过渡，成熟事务所再上 .accountants",
      ],
    },
    en: {
      title: ".accountants Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".accountants is the dedicated suffix for the accounting profession — for accounting firms, tax and audit services, bookkeeping agencies and CPA personal brands. See live pricing and naming advice, then hunt available .accountants names with AI.",
      intro:
        ".accountants writes the profession into the address: accounting firms, tax and audit practices, bookkeeping agencies and CPA personal brands on name.accountants match \"place/surname + accountants\" searches word for word — exactly how English-speaking clients look for one. It belongs to the professional-services family with the already-listed .tax, .lawyer and .legal: .tax names the subject, .accountants names the people, so firm websites carry more identity on the latter. The already-listed accounting industry guide describes exactly this audience. The registry is Identity Digital. Pricing sits at the top of the family: about $85 first year (≈¥612) and $90/yr to renew (≈¥648), flat with no hook — the price itself is a filter, so registrants are almost all real firms and the suffix's reputation stays clean. Inventory is excellent: surnames, city names and compounds all hit. Two cautions: at 11 letters it's among the longest suffixes, so keep the root short; and the renewal suits established practices — new solo CPAs can start on .pro and upgrade. Naming: surname or partners + .accountants continues the industry tradition; city + .accountants (london.accountants) is a local-lead magnet.",
      bestFor: ["Accounting firms", "Tax & audit services", "Bookkeeping agencies", "CPA personal brands"],
      namingTips: [
        "Surname or city + .accountants matches client searches word for word",
        "About $85 year one, $90/yr renewal — the price filter keeps it clean",
        "The 11-letter suffix needs a root of 4–6 characters",
        "New solo CPAs can start on .pro; established firms take .accountants",
      ],
    },
  },
  engineer: {
    tld: "engineer",
    zh: {
      title: ".engineer 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".engineer 是工程师的职业身份后缀，适合工程师个人品牌与作品集、独立咨询工程师、工程服务工作室与技术博客。查看 .engineer 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .engineer 域名。",
      intro:
        ".engineer 把职业写进域名：土木、机械、电气、软件工程师的个人站、作品集、独立咨询业务用 name.engineer，「姓名 + .engineer」就是一张数字名片——比 .com 上早已绝迹的姓名域名好拿得多。它和已收录的 .engineering 是单复数式的分工：.engineering 说「工程这门生意」，适合公司与团队；.engineer 说「我是工程师」，适合个人与小型工作室，个人品牌用单数身份感更强。注册局为 Identity Digital。价格中档平进平出：首年约 $28（约 ¥202），续费约 $30/年（约 ¥216），没有首年钩子，长期持有成本可预期。库存极好：姓名、专业方向、组合词全线有货。注意两点：一是部分国家「engineer」是受法律保护的职业头衔（如加拿大），执业相关站点要符合当地执业资质规定；二是 8 个字母后缀不短，词根宜短。命名上「姓名 + .engineer」是标准数字名片，「专业方向 + .engineer」（solar.engineer、audio.engineer）适合垂直咨询定位。",
      bestFor: ["工程师个人品牌与作品集", "独立咨询工程师", "工程服务工作室", "工程技术博客与教程站"],
      namingTips: [
        "「姓名 + .engineer」是工程师的标准数字名片",
        "首年约 $28、续费约 $30/年，平进平出成本可预期",
        "个人用单数 .engineer，公司团队用 .engineering 更贴",
        "部分国家 engineer 是受保护头衔，执业站点注意当地资质规定",
      ],
    },
    en: {
      title: ".engineer Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".engineer is the professional identity suffix for engineers — for personal brands and portfolios, independent consulting engineers, engineering studios and technical blogs. See live pricing and naming advice, then hunt available .engineer names with AI.",
      intro:
        ".engineer writes the profession into the address: civil, mechanical, electrical and software engineers running personal sites, portfolios or independent consultancies on name.engineer get a digital business card — and your name is far more likely to be available here than on .com. It splits duties with the already-listed .engineering like singular and plural: .engineering is the business of engineering, right for companies and teams; .engineer says \"I am one\", right for individuals and small studios — the singular carries more personal identity. The registry is Identity Digital. Pricing is mid-tier and flat: about $28 first year (≈¥202) and $30/yr to renew (≈¥216) — no teaser, predictable long-term costs. Inventory is excellent: names, specialties and compounds all hit. Two cautions: in some countries (Canada notably) \"engineer\" is a legally protected title, so practice-related sites must follow local licensing rules; and the 8-letter suffix isn't short, so keep the root tight. Naming: yourname.engineer is the standard digital business card; specialty + .engineer (solar.engineer, audio.engineer) suits vertical consulting positioning.",
      bestFor: ["Engineer personal brands & portfolios", "Independent consulting engineers", "Engineering studios", "Technical blogs & tutorials"],
      namingTips: [
        "yourname.engineer is the standard digital business card",
        "About $28 year one, $30/yr renewal — flat and predictable",
        "Individuals take the singular .engineer; companies fit .engineering",
        "Engineer is a protected title in some countries — mind licensing rules",
      ],
    },
  },
  villas: {
    tld: "villas",
    zh: {
      title: ".villas 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".villas 是高端度假别墅与民宿的专属后缀，适合别墅短租与度假租赁、精品民宿与庄园酒店、海外置业与别墅开发商。查看 .villas 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .villas 域名。",
      intro:
        ".villas 把「别墅」写进域名：度假别墅短租、精品民宿与庄园酒店、海外别墅置业与开发商用 name.villas，客人还没点进来就知道住的是独栋而非标间。它与已收录的 .rentals/.vacations/.holiday 分工清晰——.rentals 说「出租」这个动作，.vacations/.holiday 说「度假」这件事，.villas 直接说「别墅」这个产品，做高端独栋度假产品用它定位最准；巴厘岛、普吉、托斯卡纳等目的地的别墅品牌用 bali.villas 式地名组合，域名即卖点。注册局为 Identity Digital。价格是典型首年促销结构：首年约 $11（约 ¥78），续费约 $48/年（约 ¥345），长期持有按续费价预算。库存极好：目的地名、品牌词、风格词全线有货。注意两点：一是 villas 是复数，单栋别墅民宿也建议用复数后缀（语感更像品牌）；二是高端住宿决策链长，域名之外照片与预订体验才是转化关键。命名上「目的地 + .villas」（bali.villas）最主流，「品牌/风格词 + .villas」（azure.villas）适合连锁品牌。",
      bestFor: ["度假别墅短租与代管", "精品民宿与庄园酒店", "海外置业与别墅开发商", "目的地别墅集合平台"],
      namingTips: [
        "「目的地 + .villas」域名即卖点，客人一眼锁定住宿类型",
        "首年约 $11、续费约 $48/年，按续费价做长期预算",
        "高端独栋产品用 .villas 比 .rentals 定位更准",
        "词根别再含 villa，避免 myvilla.villas 式重复",
      ],
    },
    en: {
      title: ".villas Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".villas is the dedicated suffix for upscale vacation villas — for villa rentals and property management, boutique guesthouses and estate hotels, overseas villa developers. See live pricing and naming advice, then hunt available .villas names with AI.",
      intro:
        ".villas writes the property type into the address: vacation-villa rentals, boutique guesthouses, estate hotels and overseas villa developers on name.villas tell guests they're booking a standalone home, not a hotel room, before the page even loads. It divides labor cleanly with the already-listed .rentals, .vacations and .holiday — .rentals is the transaction, .vacations and .holiday are the occasion, .villas is the product itself, so upscale standalone stays position sharpest here; destination brands in Bali, Phuket or Tuscany make the domain the pitch with names like bali.villas. The registry is Identity Digital. Pricing follows the classic promo structure: about $11 first year (≈¥78) and $48/yr to renew (≈¥345), so budget on the renewal for long holds. Inventory is excellent — destinations, brand words and style words all hit. Two cautions: villas is plural, but even a single-villa property reads more brand-like on the plural suffix; and high-end stays have long decision funnels — photos and booking flow convert, the domain just opens the door. Naming: destination + .villas (bali.villas) is the mainstream shape; brand or style word + .villas (azure.villas) suits multi-property brands.",
      bestFor: ["Vacation villa rentals & management", "Boutique guesthouses & estate hotels", "Overseas villa developers", "Destination villa marketplaces"],
      namingTips: [
        "Destination + .villas makes the domain the pitch",
        "About $11 year one, $48/yr renewal — budget on the renewal",
        "Upscale standalone stays position sharper on .villas than .rentals",
        "Never repeat villa in the root — avoid myvilla.villas redundancy",
      ],
    },
  },
  cruises: {
    tld: "cruises",
    zh: {
      title: ".cruises 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".cruises 是邮轮与游船旅行的专属后缀，适合邮轮预订与比价平台、游船包船与内河游线路商、邮轮攻略媒体与旅行社邮轮频道。查看 .cruises 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .cruises 域名。",
      intro:
        ".cruises 把「邮轮」直接开进域名：邮轮预订与比价平台、游船包船与内河游线路商、邮轮攻略内容站用 name.cruises，用户搜「目的地 + cruises」时域名与搜索词逐字吻合——这正是邮轮行业的真实搜索习惯（alaska cruises、river cruises）。它比已收录的 .travel/.tours 更聚焦：.travel 覆盖全旅游业且有行业资质门槛，.tours 说「跟团游」，.cruises 只说邮轮，做邮轮垂直生意用它定位最锋利。注册局为 Identity Digital。价格是典型首年促销结构：首年约 $8（约 ¥59），续费约 $45/年（约 ¥323），入门便宜但长期按续费价算账。库存极好：航线名、目的地、品牌词全线有货。注意两点：一是 cruises 是复数且 8 个字母偏长，词根务必短；二是邮轮预订多数最终落在船公司或 OTA，独立站的价值在内容与线索，域名是获客入口不是交易终点。命名上「目的地/航线 + .cruises」（alaska.cruises、nile.cruises）最主流，「品牌词 + .cruises」适合包船与高端定制。",
      bestFor: ["邮轮预订与比价平台", "游船包船与内河游线路", "邮轮攻略与测评媒体", "旅行社邮轮频道"],
      namingTips: [
        "「目的地 + .cruises」与用户搜索词逐字吻合",
        "首年约 $8、续费约 $45/年，按续费价做长期预算",
        "邮轮垂直生意用 .cruises 比 .travel/.tours 定位更锋利",
        "后缀 8 个字母偏长，词根控制在 4–6 字符",
      ],
    },
    en: {
      title: ".cruises Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".cruises is the dedicated suffix for cruise travel — for cruise booking and comparison platforms, charter and river-cruise operators, cruise guide media and agency cruise desks. See live pricing and naming advice, then hunt available .cruises names with AI.",
      intro:
        ".cruises sails the category right into the address: cruise booking and comparison platforms, charter and river-cruise operators, and cruise-guide content sites on name.cruises match real search behavior word for word — travelers genuinely type \"alaska cruises\" and \"river cruises\". It's sharper than the already-listed .travel and .tours: .travel spans the whole industry and gates registration behind credentials, .tours says guided trips, .cruises says only cruises, so cruise-vertical businesses position most precisely here. The registry is Identity Digital. Pricing follows the classic promo structure: about $8 first year (≈¥59) and $45/yr to renew (≈¥323) — cheap to start, budget on the renewal. Inventory is excellent: routes, destinations and brand words all hit. Two cautions: cruises is plural and 8 letters, so keep the root short; and most cruise bookings close on the line's site or an OTA — an independent site wins on content and leads, the domain is the acquisition door, not the checkout. Naming: destination or route + .cruises (alaska.cruises, nile.cruises) is the mainstream shape; brand + .cruises suits charters and luxury custom trips.",
      bestFor: ["Cruise booking & comparison platforms", "Charter & river-cruise operators", "Cruise guide & review media", "Agency cruise desks"],
      namingTips: [
        "Destination + .cruises matches real search phrases word for word",
        "About $8 year one, $45/yr renewal — budget on the renewal",
        "Cruise verticals position sharper here than on .travel or .tours",
        "The 8-letter suffix needs a root of 4–6 characters",
      ],
    },
  },
  voyage: {
    tld: "voyage",
    zh: {
      title: ".voyage 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".voyage 是旅程与探索主题的品牌后缀，适合高端定制游与探险旅行品牌、旅行内容与游记媒体、帆船远航项目与品牌故事站。查看 .voyage 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .voyage 域名。",
      intro:
        ".voyage 卖的是「旅程」这个意象：高端定制游与探险旅行品牌、旅行内容与游记媒体、帆船远航与极地科考项目用 name.voyage，比直白的 .travel 多一层「启程与探索」的叙事感。voyage 一词英法双语通用（法语里就是「旅行」），面向欧洲与法语市场天然加分；它还是品牌叙事的好载体——产品发布、公司转型、用户成长旅程都能借「voyage」做主题站，科技公司拿它做品牌活动页并不违和。注册局为 Identity Digital。价格是典型首年促销结构：首年约 $6（约 ¥41），续费约 $47/年（约 ¥337），入门极低但续费是首年数倍，长期持有按续费价预算。库存极好：品牌词、目的地、抽象词全线有货。注意两点：一是 voyage 是单数抽象名词，适合品牌与叙事，预订平台类用 .travel/.tours 更直给；二是对纯中文受众 voyage 认知度一般，主打国内市场时要掂量。命名上「品牌词 + .voyage」（solaris.voyage）最主流，「主题词 + .voyage」（polar.voyage、wine.voyage）适合垂直线路品牌。",
      bestFor: ["高端定制游与探险品牌", "旅行内容与游记媒体", "帆船远航与科考项目", "品牌叙事与活动主题站"],
      namingTips: [
        "「品牌词 + .voyage」自带启程与探索的叙事感",
        "首年约 $6、续费约 $47/年，按续费价做长期预算",
        "英法双语通用，面向欧洲市场天然加分",
        "预订平台类直给用 .travel，品牌叙事才是 .voyage 的主场",
      ],
    },
    en: {
      title: ".voyage Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".voyage is the brand suffix for journeys and exploration — for luxury custom travel and expedition brands, travel storytelling media, sailing expeditions and brand narrative sites. See live pricing and naming advice, then hunt available .voyage names with AI.",
      intro:
        ".voyage sells the journey as an image: luxury custom travel and expedition brands, travel storytelling media, sailing and polar expedition projects on name.voyage carry a sense of departure and discovery that the plainer .travel can't match. The word works in both English and French (where voyage simply means travel), a natural bonus for European and francophone markets; it's also a strong narrative vehicle — product launches, company pivots and customer-journey campaigns all wear \"voyage\" well, so even tech brands use it for story-driven microsites without friction. The registry is Identity Digital. Pricing follows the classic promo structure: about $6 first year (≈¥41) and $47/yr to renew (≈¥337) — a very low door, several times that to stay, so budget on the renewal. Inventory is excellent: brand words, destinations and abstract words all hit. Two cautions: voyage is a singular abstract noun — great for brands and narrative, while booking platforms read more directly on .travel or .tours; and recognition among purely Chinese-speaking audiences is modest, worth weighing for domestic-first products. Naming: brand + .voyage (solaris.voyage) is the mainstream shape; theme + .voyage (polar.voyage, wine.voyage) suits vertical route brands.",
      bestFor: ["Luxury custom travel & expedition brands", "Travel storytelling media", "Sailing & research expeditions", "Brand narrative & campaign sites"],
      namingTips: [
        "Brand + .voyage carries departure-and-discovery narrative built in",
        "About $6 year one, $47/yr renewal — budget on the renewal",
        "Works in English and French alike — a bonus for European markets",
        "Booking platforms read more directly on .travel; .voyage is for story",
      ],
    },
  },
  limo: {
    tld: "limo",
    zh: {
      title: ".limo 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".limo 是豪华专车与礼宾用车的专属后缀，适合机场接送与商务专车、婚礼与活动豪车租赁、城市礼宾包车服务。查看 .limo 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .limo 域名。",
      intro:
        ".limo 把「豪华专车」停进域名：机场接送与商务专车、婚礼与红毯豪车租赁、城市礼宾包车公司用 name.limo，四个字母就把服务档次说清了。它与已收录的 .taxi 分工明确——.taxi 是即叫即走的出租车，.limo 是预约制的礼宾用车，客单价与服务预期完全不同，做高端接送用 .limo 定位不会被拉低；婚庆与活动市场是它的第二主场，wedding.limo 式命名让新人搜索时一眼命中。注册局为 Identity Digital。价格是典型首年促销结构：首年约 $11（约 ¥78），续费约 $44/年（约 ¥315），长期持有按续费价预算。库存极好：城市名、品牌词、场景词全线有货，city.limo 式地名组合是本地专车公司的黄金句式。注意两点：一是 limo 是美式口语（limousine 的缩写），北美市场零违和，其他英语市场认知度略低；二是本地用车生意依赖 Google 商家资料与口碑，域名要与商家名一致以强化本地 SEO。命名上「城市 + .limo」（vegas.limo）最主流，「场景词 + .limo」（wedding.limo、airport.limo）适合垂直服务线。",
      bestFor: ["机场接送与商务专车", "婚礼与活动豪车租赁", "城市礼宾包车公司", "豪车车队与调度平台"],
      namingTips: [
        "「城市 + .limo」是本地专车公司的黄金句式",
        "首年约 $11、续费约 $44/年，按续费价做长期预算",
        "高端预约用车用 .limo，即叫即走的定位交给 .taxi",
        "域名与 Google 商家名保持一致，强化本地 SEO",
      ],
    },
    en: {
      title: ".limo Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".limo is the dedicated suffix for luxury car service — for airport transfers and executive rides, wedding and event limo rentals, city chauffeur companies. See live pricing and naming advice, then hunt available .limo names with AI.",
      intro:
        ".limo parks the service class right in the address: airport transfer and executive car services, wedding and red-carpet limo rentals, city chauffeur companies on name.limo state the tier in four letters. It divides labor cleanly with the already-listed .taxi — .taxi is hail-and-go, .limo is booked chauffeur service with a different ticket size and expectation, so upscale transfer businesses position here without being dragged down-market; weddings and events are its second home, where wedding.limo-style names hit search intent dead on. The registry is Identity Digital. Pricing follows the classic promo structure: about $11 first year (≈¥78) and $44/yr to renew (≈¥315), so budget on the renewal for long holds. Inventory is excellent: city names, brand words and occasion words all hit — city + .limo is the golden pattern for local operators. Two cautions: limo is American colloquial shorthand for limousine — frictionless in North America, slightly less recognized elsewhere; and local transport businesses live on Google Business Profiles and reviews, so keep the domain aligned with the listing name for local SEO. Naming: city + .limo (vegas.limo) is the mainstream shape; occasion + .limo (wedding.limo, airport.limo) suits vertical service lines.",
      bestFor: ["Airport transfers & executive rides", "Wedding & event limo rentals", "City chauffeur companies", "Fleet & dispatch platforms"],
      namingTips: [
        "City + .limo is the golden pattern for local operators",
        "About $11 year one, $44/yr renewal — budget on the renewal",
        "Booked chauffeur service takes .limo; hail-and-go belongs to .taxi",
        "Match the domain to your Google Business name for local SEO",
      ],
    },
  },
  tickets: {
    tld: "tickets",
    zh: {
      title: ".tickets 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".tickets 是票务行业的专属后缀，适合演出与赛事官方票务、票务平台与二级市场、场馆与剧院直销渠道。查看 .tickets 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .tickets 域名。",
      intro:
        ".tickets 把「买票」写进域名：演唱会与体育赛事官方票务、票务平台与二级市场、场馆与剧院直销渠道用 name.tickets，粉丝搜「活动名 + tickets」时域名与搜索词逐字吻合——这是票务行业最真实的搜索句式。它的定价策略也在替你筛选邻居：注册约 $361（约 ¥2599）且续费同价，年费门槛把投机注册挡在门外，域名本身就是「官方直销」的信任信号，假票横行的行业里这一点尤其值钱。注册局为 XYZ（从 Accent Media 收购）。库存近乎全开：活动名、场馆名、球队名大多有货。注意三点：一是高年费只适合票务是主营收入的生意，内容站、粉丝站请绕行；二是已收录的 .events 说「活动本身」，.tickets 说「交易入口」，办活动用前者、卖票用后者；三是二级票务受各国法规约束（限价、转售牌照），合规先行。命名上「场馆/球队 + .tickets」（arena.tickets）最主流，「城市 + 品类 + .tickets」适合区域票务平台。",
      bestFor: ["演出与赛事官方票务", "票务平台与二级市场", "场馆与剧院直销渠道", "球队与俱乐部官方售票"],
      namingTips: [
        "「场馆/球队 + .tickets」与粉丝搜索句式逐字吻合",
        "注册约 $361、续费同价，只适合票务主营的生意",
        "办活动用 .events，卖票用 .tickets，分工别搞混",
        "二级票务先过当地法规（限价与转售牌照）再上线",
      ],
    },
    en: {
      title: ".tickets Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".tickets is the dedicated suffix for the ticketing trade — for official concert and sports ticketing, ticket platforms and resale markets, venue and theater box offices. See live pricing and naming advice, then hunt available .tickets names with AI.",
      intro:
        ".tickets writes the transaction into the address: official concert and sports ticketing, ticket platforms and resale marketplaces, venue and theater box offices on name.tickets match the industry's most literal search phrase — fans really do type \"event + tickets\". Its pricing doubles as neighborhood screening: about $361 to register (≈¥2599) and the same to renew, a yearly bar that keeps speculators out — so the suffix itself signals \"official box office\", which is worth real money in a fraud-prone industry. The registry is XYZ (acquired from Accent Media). Inventory is nearly wide open: event names, venues and team names mostly hit. Three cautions: the high annual fee only pencils out when ticketing is the core revenue — content and fan sites should pass; the already-listed .events names the occasion while .tickets names the checkout, so host on the former and sell on the latter; and secondary ticketing is regulated in many countries (price caps, resale licenses) — clear compliance first. Naming: venue or team + .tickets (arena.tickets) is the mainstream shape; city + category + .tickets suits regional platforms.",
      bestFor: ["Official concert & sports ticketing", "Ticket platforms & resale markets", "Venue & theater box offices", "Team & club official sales"],
      namingTips: [
        "Venue or team + .tickets matches fan search phrases word for word",
        "About $361 flat per year — only for ticketing-core businesses",
        "Host events on .events; sell seats on .tickets",
        "Clear resale regulations (price caps, licenses) before launch",
      ],
    },
  },
  flowers: {
    tld: "flowers",
    zh: {
      title: ".flowers 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".flowers 是鲜花行业的专属后缀，适合鲜花电商与订阅配送、花店与花艺工作室、婚礼花艺与批发供应链。查看 .flowers 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .flowers 域名。",
      intro:
        ".flowers 把「鲜花」开进域名：鲜花电商与订阅配送、本地花店与花艺工作室、婚礼花艺与鲜花批发商用 name.flowers，送花的人搜「品牌 + flowers」时域名与搜索词逐字吻合——美国最大花商之一就叫 1800flowers，这个句式在行业里根深蒂固。它比已收录的 .florist 行业指南所覆盖的通用后缀更直给：florist 说「花艺师」这个职业，flowers 说「花」这个商品，电商与配送生意用后者更贴。注册局为 XYZ（从 UNR 收购）。价格平进平出：注册约 $104（约 ¥745），续费同价——中高档年费替你过滤了域名投机者，好词库存近乎全开：花名、城市名、品牌词基本都有货。注意三点：一是年费适合有真实营收的鲜花生意，纯兴趣博客可以选更便宜的后缀；二是 7 个字母的复数后缀不短，词根务必短（send.flowers、bloom.flowers 是理想形态）；三是鲜花是强节日生意，域名要配合情人节、母亲节的投放节奏。命名上「动词/短词 + .flowers」（send.flowers）最主流，「城市 + .flowers」适合本地花店直销。",
      bestFor: ["鲜花电商与订阅配送", "本地花店与花艺工作室", "婚礼花艺与活动布置", "鲜花批发与供应链"],
      namingTips: [
        "「动词/短词 + .flowers」（send.flowers）是行业黄金句式",
        "注册约 $104、续费同价，适合有真实营收的鲜花生意",
        "电商卖花用 .flowers，花艺师个人品牌可考虑通用后缀",
        "后缀 7 个字母偏长，词根控制在 4–5 字符",
      ],
    },
    en: {
      title: ".flowers Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".flowers is the dedicated suffix for the floral trade — for flower e-commerce and subscription delivery, local florists and floral studios, wedding florals and wholesale supply. See live pricing and naming advice, then hunt available .flowers names with AI.",
      intro:
        ".flowers blooms right in the address: flower e-commerce and subscription delivery, local florists and floral studios, wedding florists and flower wholesalers on name.flowers match gift-buyer searches word for word — one of America's biggest florists is literally named 1800flowers, so the phrase is baked into the industry. It's more direct for commerce than the generic suffixes covered by the already-listed florist industry guide: florist names the profession, flowers names the product, and delivery businesses read better on the latter. The registry is XYZ (acquired from UNR). Pricing is flat: about $104 to register (≈¥745) and the same to renew — an upper-mid annual fee that filters out speculators, leaving inventory nearly wide open: flower names, cities and brand words mostly hit. Three cautions: the fee suits floral businesses with real revenue — hobby blogs should pick a cheaper suffix; the 7-letter plural suffix isn't short, so keep the root tight (send.flowers and bloom.flowers are the ideal shapes); and flowers are a holiday-spike business — time the domain's campaigns to Valentine's and Mother's Day. Naming: verb or short word + .flowers (send.flowers) is the mainstream shape; city + .flowers suits local florist direct sales.",
      bestFor: ["Flower e-commerce & subscriptions", "Local florists & floral studios", "Wedding & event florals", "Flower wholesale & supply"],
      namingTips: [
        "Verb + .flowers (send.flowers) is the industry's golden pattern",
        "About $104 flat per year — for floral businesses with real revenue",
        "Commerce reads best on .flowers; florist personal brands can go generic",
        "The 7-letter suffix needs a root of 4–5 characters",
      ],
    },
  },
  beer: {
    tld: "beer",
    zh: {
      title: ".beer 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".beer 是啤酒行业的专属后缀，适合精酿啤酒厂与自酿品牌、啤酒吧与酒馆、啤酒电商与订阅盒、啤酒评测与文化媒体。查看 .beer 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .beer 域名。",
      intro:
        ".beer 把「啤酒」倒进域名：精酿啤酒厂与自酿品牌、啤酒吧与精酿酒馆、啤酒电商与订阅盒、啤酒评测媒体用 name.beer，酒标上印的域名本身就是品牌故事的一部分——精酿圈最吃这一套。它与已收录的 .bar/.pub/.wine 分工清晰：.bar 说「场所」，.wine 说葡萄酒，.beer 只说啤酒这个品类，做精酿品牌用它定位最准。注册局为 GoDaddy Registry（原 Minds + Machines 组合）。价格是典型首年促销结构：首年约 $2（约 ¥11），续费约 $26/年（约 ¥189）——首年近乎白送，长期按续费价预算，仍属低门槛。库存极好：酒厂名、酒款名、风格词（ipa、stout、lager 词根组合）全线有货。注意两点：一是酒类经营在多数地区需要许可证，线上售酒还要过年龄验证与配送合规；二是 .beer 语感偏休闲与玩趣，正式的集团官网可以主用 .com、拿 .beer 做品牌活动页。命名上「酒厂/品牌词 + .beer」（hoppy.beer）最主流，「城市 + .beer」适合本地精酿地图与酒吧指南。",
      bestFor: ["精酿啤酒厂与自酿品牌", "啤酒吧与精酿酒馆", "啤酒电商与订阅盒", "啤酒评测与文化媒体"],
      namingTips: [
        "「品牌词 + .beer」印上酒标就是品牌故事的一部分",
        "首年约 $2、续费约 $26/年，按续费价做长期预算",
        "精酿品类用 .beer 比 .bar/.wine 定位更准",
        "线上售酒先过许可证、年龄验证与配送合规",
      ],
    },
    en: {
      title: ".beer Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".beer is the dedicated suffix for the beer trade — for craft breweries and homebrew brands, beer bars and taprooms, beer e-commerce and subscription boxes, beer review media. See live pricing and naming advice, then hunt available .beer names with AI.",
      intro:
        ".beer pours the category straight into the address: craft breweries and homebrew brands, beer bars and taprooms, beer e-commerce and subscription boxes, and beer review media on name.beer get a domain that doubles as label copy — and craft-beer culture loves exactly that kind of branding. It divides labor cleanly with the already-listed .bar, .pub and .wine: .bar names the venue, .wine names the grape, .beer names this one category, so craft brands position sharpest here. The registry is GoDaddy Registry (from the former Minds + Machines portfolio). Pricing follows the classic promo structure: about $2 first year (≈¥11) and $26/yr to renew (≈¥189) — nearly free to start, still cheap long-term on the renewal. Inventory is excellent: brewery names, beer names and style words (ipa, stout, lager roots) all hit. Two cautions: alcohol businesses need licenses in most regions, and online sales add age verification and shipping compliance; and .beer reads playful — corporate group sites may keep .com as primary and use .beer for brand campaigns. Naming: brewery or brand word + .beer (hoppy.beer) is the mainstream shape; city + .beer suits local craft maps and taproom guides.",
      bestFor: ["Craft breweries & homebrew brands", "Beer bars & taprooms", "Beer e-commerce & subscription boxes", "Beer review & culture media"],
      namingTips: [
        "Brand word + .beer doubles as label copy on the bottle",
        "About $2 year one, $26/yr renewal — budget on the renewal",
        "Beer brands position sharper on .beer than .bar or .wine",
        "Clear licenses, age gates and shipping rules before selling online",
      ],
    },
  },
  pub: {
    tld: "pub",
    zh: {
      title: ".pub 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".pub 是酒馆与出版双关的短后缀，适合酒吧与酒馆官网、精酿酒馆连锁、独立出版与 Newsletter、播客与内容发布平台。查看 .pub 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .pub 域名。",
      intro:
        ".pub 是少见的一词双关后缀：既是英式酒馆（pub），也是出版（publish/publication）的缩写——酒吧与酒馆官网、精酿酒馆连锁用它说「场所」，独立出版、Newsletter、播客与内容发布平台用它说「发布」，两条赛道都成立。它与已收录的 .bar 分工微妙：.bar 更泛（鸡尾酒吧、酒吧均可），.pub 自带英式酒馆的烟火气，做英式/爱尔兰式酒馆用 .pub 语感更足；内容赛道上它比 .press（偏新闻机构）更轻快，适合个人出版与小型内容品牌。注册局为 Identity Digital。价格平进平出：注册约 $32（约 ¥234），续费同价——中档年费，库存极好：酒馆名、地名、内容品牌词全线有货。注意两点：一是 3 个字母的短后缀是稀缺资产，短词根 + .pub 的整体长度优势明显（six.pub 仅 7 字符）；二是双关也意味着语义不聚焦，若品牌强依赖单一联想（只想说酒馆或只想说出版），落地页要第一屏把定位讲清。命名上「酒馆名/地名 + .pub」（kings.pub）最主流，「内容品牌 + .pub」适合 Newsletter 与独立出版。",
      bestFor: ["酒吧与酒馆官网", "精酿酒馆与连锁品牌", "独立出版与 Newsletter", "播客与内容发布平台"],
      namingTips: [
        "3 字母短后缀稀缺，短词根 + .pub 整体长度优势明显",
        "注册约 $32、续费同价，预算稳定无涨价陷阱",
        "英式/爱尔兰式酒馆用 .pub 比 .bar 语感更足",
        "双关后缀语义不聚焦，落地页第一屏讲清定位",
      ],
    },
    en: {
      title: ".pub Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".pub is the rare double-meaning short suffix — pubs and taverns on one track, publishing and newsletters on the other: bar websites, taproom chains, indie publications, podcasts and content platforms. See live pricing and naming advice, then hunt available .pub names with AI.",
      intro:
        ".pub is that rare suffix with two legitimate readings: the British pub, and publishing — bar and tavern websites and taproom chains take the venue track, while indie publications, newsletters, podcasts and content platforms take the publishing track, and both work. Against the already-listed .bar the split is subtle: .bar is broader (cocktail bars and beyond) while .pub carries the warmth of a British or Irish tavern, so those venues read better here; on the content track it's lighter than .press (which leans newsroom), fitting personal publishing and small content brands. The registry is Identity Digital. Pricing is flat: about $32 to register (≈¥234) and the same to renew — a mid-range fee with excellent inventory: tavern names, place names and content brand words all hit. Two cautions: a 3-letter suffix is scarce real estate, and short root + .pub wins on total length (six.pub is 7 characters); and the double meaning cuts both ways — if your brand depends on a single association, make the positioning explicit above the fold. Naming: tavern or place name + .pub (kings.pub) is the mainstream shape; content brand + .pub suits newsletters and indie publishing.",
      bestFor: ["Bar & tavern websites", "Taprooms & pub chains", "Indie publishing & newsletters", "Podcasts & content platforms"],
      namingTips: [
        "A 3-letter suffix is scarce — short root + .pub wins on length",
        "About $32 flat per year — stable budgeting, no renewal trap",
        "British or Irish taverns read warmer on .pub than .bar",
        "The double meaning needs explicit positioning above the fold",
      ],
    },
  },
  spa: {
    tld: "spa",
    zh: {
      title: ".spa 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".spa 是水疗与康养行业的专属后缀，适合日间水疗与按摩馆、美容护肤与美甲沙龙、温泉酒店与康养度假村、泳池与家用 SPA 设备商。查看 .spa 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .spa 域名。",
      intro:
        ".spa 把「水疗」泡进域名：日间水疗与按摩馆、美容护肤与美甲沙龙、温泉酒店与康养度假村、泳池与家用 SPA 设备商用 name.spa，客人搜「地名 + spa」时域名与搜索词逐字吻合——这是本地康养生意最真实的搜索句式。它与已收录的 .salon/.yoga/.care 分工清晰：.salon 说美发美甲，.yoga 说瑜伽，.spa 覆盖水疗按摩到温泉康养的完整链条，做放松与疗愈类业务用它定位最准。注册局为亚洲水疗及健康促进会（Asia Spa and Wellness Promotion Council），是少见的行业协会注册局。价格平进平出：注册约 $22（约 ¥156），续费同价——中档年费，库存极好：城市名、疗程词、品牌词全线有货。注意两点：一是 3 个字母的短后缀稀缺，短词根 + .spa 的整体长度优势明显（zen.spa 仅 7 字符）；二是本地生意别忘了把域名同步到 Google 商家资料与地图，域名与门店搜索联动才有 SEO 增益。命名上「城市/街区 + .spa」（soho.spa）最主流，「品牌词 + .spa」（zen.spa）适合连锁与高端品牌。",
      bestFor: ["日间水疗与按摩馆", "美容护肤与美甲沙龙", "温泉酒店与康养度假村", "泳池与家用 SPA 设备商"],
      namingTips: [
        "「城市 + .spa」与本地客人搜索句式逐字吻合",
        "注册约 $22、续费同价，预算稳定无涨价陷阱",
        "3 字母短后缀稀缺，zen.spa 式短组合值得抢",
        "域名同步到 Google 商家资料，本地搜索才有增益",
      ],
    },
    en: {
      title: ".spa Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".spa is the dedicated suffix for wellness — for day spas and massage studios, skincare and nail salons, hot-spring resorts and wellness retreats, pool and home-spa suppliers. See live pricing and naming advice, then hunt available .spa names with AI.",
      intro:
        ".spa soaks the service into the address: day spas and massage studios, skincare and nail salons, hot-spring hotels and wellness retreats, and pool or home-spa equipment suppliers on name.spa match the way local customers actually search — \"city + spa\" is the literal query. It divides labor cleanly with the already-listed .salon, .yoga and .care: .salon covers hair and nails, .yoga covers the mat, .spa spans the full relaxation chain from massage to hot-spring resorts, so healing-and-wellness businesses position sharpest here. The registry is the Asia Spa and Wellness Promotion Council — a rare industry-association registry. Pricing is flat: about $22 to register (≈¥156) and the same to renew — a mid-range fee with excellent inventory: city names, treatment words and brand words all hit. Two cautions: a 3-letter suffix is scarce, and short root + .spa wins on total length (zen.spa is 7 characters); and local businesses should sync the domain to their Google Business Profile — the SEO gain comes from pairing the domain with local search. Naming: city or neighborhood + .spa (soho.spa) is the mainstream shape; brand word + .spa (zen.spa) suits chains and premium brands.",
      bestFor: ["Day spas & massage studios", "Skincare & nail salons", "Hot-spring resorts & wellness retreats", "Pool & home-spa suppliers"],
      namingTips: [
        "City + .spa matches local search queries word for word",
        "About $22 flat per year — stable budgeting, no renewal trap",
        "A 3-letter suffix is scarce — grab zen.spa-style short combos",
        "Sync the domain to Google Business Profile for local SEO",
      ],
    },
  },
  food: {
    tld: "food",
    zh: {
      title: ".food 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".food 是食品与餐饮的品类大词后缀，适合食品品牌与电商、餐饮集团与美食广场、美食媒体与菜谱平台、食品供应链与批发商。查看 .food 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .food 域名。",
      intro:
        ".food 把「吃」这个最大品类装进域名：食品品牌与电商、餐饮集团与美食广场、美食媒体与菜谱平台、食品供应链与批发商用 name.food，一个词覆盖从田间到餐桌的整条链路。它与已收录的餐饮系后缀分工清晰：.restaurant/.cafe/.pizza 说「某一种店」，.menu 说「菜单」，.recipes 说「菜谱」，.food 是品类总词——做多品牌餐饮集团、食品电商平台或美食综合媒体，用它一个域名就能装下全部业务线。注册局为 Lifestyle Domain Holdings（.food 于 2023 年才开放注册，属最新一批品类大词）。价格是典型首年促销结构：首年约 $5（约 ¥33），续费约 $31/年（约 ¥226）——入门便宜，长期按续费价预算。库存极好：品类词、菜系词、品牌词全线有货，开放晚意味着好词远多于老后缀。注意两点：一是 .food 语义极宽，单一门店（只开一家披萨店）用 .pizza/.restaurant 更聚焦；二是食品电商涉及食品经营许可与冷链物流，域名之外先把资质备齐。命名上「品牌词 + .food」（fresh.food）最主流，「菜系/品类 + .food」（thai.food）适合垂直平台。",
      bestFor: ["食品品牌与电商", "餐饮集团与美食广场", "美食媒体与菜谱平台", "食品供应链与批发商"],
      namingTips: [
        "品类总词后缀，多业务线餐饮集团一个域名装下",
        "首年约 $5、续费约 $31/年，按续费价做长期预算",
        "2023 年才开放注册，好词库存远多于老后缀",
        "单一门店用 .pizza/.restaurant 更聚焦，别贪大词",
      ],
    },
    en: {
      title: ".food Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".food is the big category suffix for everything edible — for food brands and e-commerce, restaurant groups and food halls, food media and recipe platforms, food supply chains and wholesalers. See live pricing and naming advice, then hunt available .food names with AI.",
      intro:
        ".food packs the biggest category of all into the address: food brands and e-commerce, restaurant groups and food halls, food media and recipe platforms, and supply-chain wholesalers on name.food cover the whole farm-to-table chain in one word. It divides labor cleanly with the already-listed dining suffixes: .restaurant, .cafe and .pizza name one kind of venue, .menu names the card, .recipes names the how-to — .food is the umbrella, so multi-brand restaurant groups, food e-commerce platforms and general food media fit their whole portfolio under one domain. The registry is Lifestyle Domain Holdings, and .food only opened for registration in 2023 — one of the newest big category words. Pricing follows the classic promo structure: about $5 first year (≈¥33) and $31/yr to renew (≈¥226) — cheap to start, budget on the renewal. Inventory is excellent: category words, cuisine words and brand words all hit, and the late launch means far more good roots than older suffixes. Two cautions: .food is semantically huge — a single pizzeria positions sharper on .pizza or .restaurant; and food e-commerce needs operating licenses and cold-chain logistics, so line up compliance before the launch. Naming: brand word + .food (fresh.food) is the mainstream shape; cuisine or category + .food (thai.food) suits vertical platforms.",
      bestFor: ["Food brands & e-commerce", "Restaurant groups & food halls", "Food media & recipe platforms", "Food supply chains & wholesalers"],
      namingTips: [
        "The umbrella suffix — one domain fits a whole restaurant group",
        "About $5 year one, $31/yr renewal — budget on the renewal",
        "Opened in 2023, so good roots far outnumber older suffixes",
        "Single venues position sharper on .pizza or .restaurant",
      ],
    },
  },
  attorney: {
    tld: "attorney",
    zh: {
      title: ".attorney 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".attorney 是律师职业的专属后缀，适合律师个人品牌与执业官网、律师事务所、诉讼与辩护专项业务、法律咨询获客页。查看 .attorney 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .attorney 域名。",
      intro:
        ".attorney 把「律师」写进域名：律师个人品牌与执业官网、律师事务所、诉讼与辩护专项业务、法律咨询获客页用 name.attorney，美国客户搜「城市 + attorney」时域名与搜索词逐字吻合——在美式语境里 attorney 比 lawyer 更正式，出庭律师与执业文书都用这个词。它与已收录的 .lawyer/.law/.legal 分工微妙：.law 有律师资质验证门槛、.legal 泛指法律服务，.lawyer 与 .attorney 同为职业词，主做美国市场、走正式路线用 .attorney 语感更庄重。注册局为 Identity Digital。价格平进平出：注册约 $50（约 ¥360），续费同价——中高档年费替你过滤了投机注册，库存极好：姓氏、城市、专项领域词全线有货。注意两点：一是 8 个字母的后缀偏长，词根务必短（smith.attorney 已是极限）；二是律师广告在美国各州受律师协会规则约束（禁止误导性宣传），域名措辞别踩「最佳」「第一」这类红线。命名上「姓氏 + .attorney」（smith.attorney）最主流，「城市 + 专项 + .attorney」适合获客型专题站。",
      bestFor: ["律师个人品牌与执业官网", "律师事务所", "诉讼与辩护专项业务", "法律咨询获客页"],
      namingTips: [
        "「姓氏 + .attorney」是美式执业官网的标准形态",
        "注册约 $50、续费同价，预算稳定无涨价陷阱",
        "主做美国市场走正式路线，.attorney 比 .lawyer 更庄重",
        "后缀 8 个字母偏长，词根控制在 5–6 字符",
      ],
    },
    en: {
      title: ".attorney Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".attorney is the dedicated suffix for the legal profession — for attorney personal brands and practice sites, law firms, litigation and defense specialties, legal lead-generation pages. See live pricing and naming advice, then hunt available .attorney names with AI.",
      intro:
        ".attorney writes the profession into the address: attorney personal brands and practice sites, law firms, litigation and defense specialties, and legal lead-gen pages on name.attorney match how American clients actually search — \"city + attorney\" is the literal query, and in US usage attorney is the more formal term, the one used in court and on filings. Against the already-listed .lawyer, .law and .legal the split is subtle: .law requires credential verification, .legal covers the broader service industry, and between the two profession words, .attorney reads more formal — the pick for US-focused practices with a buttoned-up brand. The registry is Identity Digital. Pricing is flat: about $50 to register (≈¥360) and the same to renew — an upper-mid fee that filters out speculators, leaving excellent inventory: surnames, cities and specialty words all hit. Two cautions: the 8-letter suffix is long, so keep the root short (smith.attorney is about the limit); and US attorney advertising is governed by state bar rules — avoid \"best\" or \"#1\" claims in the domain itself. Naming: surname + .attorney (smith.attorney) is the mainstream shape; city + specialty + .attorney suits lead-generation sites.",
      bestFor: ["Attorney personal brands & practice sites", "Law firms", "Litigation & defense specialties", "Legal lead-generation pages"],
      namingTips: [
        "Surname + .attorney is the standard US practice-site shape",
        "About $50 flat per year — stable budgeting, no renewal trap",
        "US-focused, formal branding reads stronger on .attorney than .lawyer",
        "The 8-letter suffix needs a root of 5–6 characters",
      ],
    },
  },
  dentist: {
    tld: "dentist",
    zh: {
      title: ".dentist 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".dentist 是牙医职业的专属后缀，适合牙科诊所与口腔门诊、牙医个人品牌、正畸与种植专项业务、牙科连锁与获客页。查看 .dentist 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .dentist 域名。",
      intro:
        ".dentist 把「牙医」写进域名：牙科诊所与口腔门诊、牙医个人品牌、正畸与种植专项业务、牙科连锁与获客页用 name.dentist，患者搜「城市 + dentist」时域名与搜索词逐字吻合——找牙医是本地搜索里意图最强的品类之一，逐字吻合的域名在本地 SEO 里天然占优。它与已收录的 .dental/.clinic/.doctor 分工清晰：.dental 说「牙科」这个行业（器材商、耗材电商也用），.clinic 泛指诊所，.doctor 泛指医生，.dentist 直指牙医这个职业——诊所与个人品牌用它定位最准。注册局为 Identity Digital。价格平进平出：注册约 $52（约 ¥374），续费同价——中高档年费替你过滤了投机注册，库存极好：姓氏、城市、专项词全线有货。注意两点：一是 7 个字母的后缀不短，词根务必短（smile.dentist 是理想形态）；二是医疗广告各地监管严格（资质展示、疗效宣传红线），域名之外先把执业资质页备好。命名上「姓氏/品牌词 + .dentist」（chen.dentist）最主流，「城市 + .dentist」适合本地获客站。",
      bestFor: ["牙科诊所与口腔门诊", "牙医个人品牌", "正畸与种植专项业务", "牙科连锁与获客页"],
      namingTips: [
        "「城市 + .dentist」与患者搜索句式逐字吻合",
        "注册约 $52、续费同价，预算稳定无涨价陷阱",
        "诊所与个人品牌用 .dentist，器材电商用 .dental",
        "医疗广告监管严格，执业资质页与域名一起备好",
      ],
    },
    en: {
      title: ".dentist Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".dentist is the dedicated suffix for the dental profession — for dental clinics and practices, dentist personal brands, orthodontics and implant specialties, dental chains and patient acquisition pages. See live pricing and naming advice, then hunt available .dentist names with AI.",
      intro:
        ".dentist writes the profession into the address: dental clinics and practices, dentist personal brands, orthodontic and implant specialties, and dental chains on name.dentist match how patients actually search — \"city + dentist\" is one of the highest-intent local queries there is, and a word-for-word domain starts local SEO ahead. It divides labor cleanly with the already-listed .dental, .clinic and .doctor: .dental names the industry (equipment vendors and supply shops use it too), .clinic covers any practice, .doctor covers any physician — .dentist points at the profession itself, so clinics and personal brands position sharpest here. The registry is Identity Digital. Pricing is flat: about $52 to register (≈¥374) and the same to renew — an upper-mid fee that filters out speculators, leaving excellent inventory: surnames, cities and specialty words all hit. Two cautions: the 7-letter suffix isn't short, so keep the root tight (smile.dentist is the ideal shape); and healthcare advertising is tightly regulated — have the credentials page ready alongside the domain. Naming: surname or brand word + .dentist (chen.dentist) is the mainstream shape; city + .dentist suits local patient-acquisition sites.",
      bestFor: ["Dental clinics & practices", "Dentist personal brands", "Orthodontics & implant specialties", "Dental chains & acquisition pages"],
      namingTips: [
        "City + .dentist matches patient search queries word for word",
        "About $52 flat per year — stable budgeting, no renewal trap",
        "Clinics use .dentist; equipment e-commerce fits .dental better",
        "Healthcare ads are regulated — pair the domain with a credentials page",
      ],
    },
  },
  clothing: {
    tld: "clothing",
    zh: {
      title: ".clothing 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".clothing 是服装行业的专属后缀，适合服装品牌与 DTC 独立站、设计师与定制工作室、二手与古着买手店、服装批发与供应链。查看 .clothing 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .clothing 域名。",
      intro:
        ".clothing 把「服装」穿进域名：服装品牌与 DTC 独立站、设计师与定制工作室、二手与古着买手店、服装批发与供应链用 name.clothing，卖什么直接写在地址里——顾客搜「品牌 + clothing」时域名与搜索词逐字吻合。它与已收录的 .fashion/.style/.boutique 分工清晰：.fashion 说「时尚」这个概念（媒体、博主也用），.style 说风格与生活方式，.boutique 说精品小店，.clothing 直指「衣服」这个品类——做实打实卖衣服的生意用它定位最准。注册局为 Identity Digital（Binky Moon 组合，2014 年首批新后缀）。价格是典型首年促销结构：首年约 $11（约 ¥78），续费约 $26/年（约 ¥189）——入门便宜，长期按续费价预算。库存极好：品牌词、品类词（denim、vintage 词根组合）全线有货。注意两点：一是 8 个字母的后缀偏长，词根务必短（urban.clothing 已是舒适上限）；二是服装电商竞争激烈，域名之外把退换货政策与尺码表这类信任设施备好。命名上「品牌词 + .clothing」（bold.clothing）最主流，「风格/品类 + .clothing」（vintage.clothing）适合垂直买手店。",
      bestFor: ["服装品牌与 DTC 独立站", "设计师与定制工作室", "二手与古着买手店", "服装批发与供应链"],
      namingTips: [
        "「品牌词 + .clothing」卖什么直接写在地址里",
        "首年约 $11、续费约 $26/年，按续费价做长期预算",
        "实体服装生意用 .clothing 比 .fashion/.style 定位更准",
        "后缀 8 个字母偏长，词根控制在 5–6 字符",
      ],
    },
    en: {
      title: ".clothing Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".clothing is the dedicated suffix for the apparel trade — for clothing brands and DTC stores, designers and made-to-measure studios, secondhand and vintage shops, apparel wholesale and supply chains. See live pricing and naming advice, then hunt available .clothing names with AI.",
      intro:
        ".clothing wears the category right in the address: clothing brands and DTC stores, designers and made-to-measure studios, secondhand and vintage shops, and apparel wholesalers on name.clothing say exactly what they sell — and \"brand + clothing\" is the literal query shoppers type. It divides labor cleanly with the already-listed .fashion, .style and .boutique: .fashion names the concept (media and bloggers use it too), .style names a lifestyle, .boutique names a small shop — .clothing points at the garments themselves, so businesses that actually sell clothes position sharpest here. The registry is Identity Digital (Binky Moon portfolio, from the first 2014 wave). Pricing follows the classic promo structure: about $11 first year (≈¥78) and $26/yr to renew (≈¥189) — cheap to start, budget on the renewal. Inventory is excellent: brand words and category roots (denim, vintage combinations) all hit. Two cautions: the 8-letter suffix leans long, so keep the root short (urban.clothing is about the comfortable limit); and apparel e-commerce is competitive — pair the domain with the trust infrastructure of returns policies and size charts. Naming: brand word + .clothing (bold.clothing) is the mainstream shape; style or category + .clothing (vintage.clothing) suits vertical curators.",
      bestFor: ["Clothing brands & DTC stores", "Designers & made-to-measure studios", "Secondhand & vintage shops", "Apparel wholesale & supply chains"],
      namingTips: [
        "Brand word + .clothing says what you sell in the address",
        "About $11 year one, $26/yr renewal — budget on the renewal",
        "Real apparel sellers position sharper here than on .fashion",
        "The 8-letter suffix needs a root of 5–6 characters",
      ],
    },
  },
  cooking: {
    tld: "cooking",
    zh: {
      title: ".cooking 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".cooking 是烹饪与美食内容的专属后缀，适合菜谱博客与美食自媒体、烹饪课程与厨艺教室、私厨与烹饪工作室、厨具与食材内容电商。查看 .cooking 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .cooking 域名。",
      intro:
        ".cooking 把「下厨」端进域名：菜谱博客与美食自媒体、烹饪课程与厨艺教室、私厨与烹饪工作室、厨具与食材内容电商用 name.cooking，域名读出来就是一句「谁在做菜」——thai.cooking、home.cooking 这类组合天然像栏目名。它与已收录的餐饮系后缀分工清晰：.recipes 说「菜谱」这个交付物，.kitchen 说「厨房」这个场景，.food 说食品大品类，.cooking 说「烹饪」这个动作与技艺——做内容、教学与个人厨艺品牌用它定位最准。注册局为 GoDaddy Registry（原 Minds + Machines 组合）。价格平进平出：注册约 $26（约 ¥189），续费同价——中档年费预算稳定，库存极好：菜系词、人名、风格词全线有货。注意两点：一是 7 个字母的后缀不短，词根务必短（thai.cooking 是理想形态）；二是美食内容的商业化靠课程与带货，域名之外先把内容矩阵与转化路径想清。命名上「菜系/风格 + .cooking」（thai.cooking）最主流，「人名/品牌 + .cooking」适合厨师个人品牌与教学号。",
      bestFor: ["菜谱博客与美食自媒体", "烹饪课程与厨艺教室", "私厨与烹饪工作室", "厨具与食材内容电商"],
      namingTips: [
        "「菜系 + .cooking」读出来就是栏目名",
        "注册约 $26、续费同价，预算稳定无涨价陷阱",
        "内容与教学用 .cooking，菜谱交付物用 .recipes",
        "后缀 7 个字母不短，词根控制在 4–5 字符",
      ],
    },
    en: {
      title: ".cooking Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".cooking is the dedicated suffix for culinary content — for recipe blogs and food creators, cooking classes and culinary schools, private chefs and cooking studios, cookware and ingredient content commerce. See live pricing and naming advice, then hunt available .cooking names with AI.",
      intro:
        ".cooking serves the craft right in the address: recipe blogs and food creators, cooking classes and culinary schools, private chefs and cooking studios, and cookware content commerce on name.cooking get a domain that reads like a show title — thai.cooking and home.cooking sound like channels the moment you say them. It divides labor cleanly with the already-listed dining suffixes: .recipes names the deliverable, .kitchen names the room, .food names the giant category — .cooking names the act and the skill, so content, teaching and personal chef brands position sharpest here. The registry is GoDaddy Registry (from the former Minds + Machines portfolio). Pricing is flat: about $26 to register (≈¥189) and the same to renew — a stable mid-range fee with excellent inventory: cuisine words, personal names and style words all hit. Two cautions: the 7-letter suffix isn't short, so keep the root tight (thai.cooking is the ideal shape); and food content monetizes through courses and affiliate commerce, so plan the content-to-conversion path alongside the domain. Naming: cuisine or style + .cooking (thai.cooking) is the mainstream shape; personal name or brand + .cooking suits chef brands and teaching channels.",
      bestFor: ["Recipe blogs & food creators", "Cooking classes & culinary schools", "Private chefs & cooking studios", "Cookware & ingredient content commerce"],
      namingTips: [
        "Cuisine + .cooking reads like a show title out loud",
        "About $26 flat per year — stable budgeting, no renewal trap",
        "Content and teaching fit .cooking; deliverables fit .recipes",
        "The 7-letter suffix needs a root of 4–5 characters",
      ],
    },
  },
  gift: {
    tld: "gift",
    zh: {
      title: ".gift 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".gift 是送礼场景的专属后缀，适合礼品电商与礼盒品牌、礼品卡与企业礼赠服务、心愿单与送礼攻略平台、节日营销活动页。查看 .gift 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .gift 域名。",
      intro:
        ".gift 把「一份礼物」包进域名：礼品电商与礼盒品牌、礼品卡与企业礼赠服务、心愿单与送礼攻略平台、节日营销活动页用 name.gift，单数形态读出来就是「这是一份礼」——a.gift、perfect.gift 这类组合本身就是广告语。它与已收录的 .gifts 分工微妙：.gifts（复数）说「礼品」这个品类，适合货架式礼品店；.gift（单数）说「送出一份礼」这个动作与场景，做礼品卡、心愿单、活动落地页语感更准——送礼链路的两端各占一个后缀。注册局为 Uniregistry 组合（现归 GoDaddy Registry 运营）。价格平进平出：注册约 $17（约 ¥119），续费同价——低档年费预算轻松，库存极好：场景词、节日词、品牌词全线有货。注意两点：一是 .gift 语义强绑定送礼场景，主业不是礼品的电商别硬蹭；二是节日流量波峰明显，域名之外把常青内容（送礼攻略、礼品清单）做起来才能全年拿流量。命名上「形容词 + .gift」（perfect.gift）最主流，「节日/人群 + .gift」（mom.gift）适合垂直礼赠站。",
      bestFor: ["礼品电商与礼盒品牌", "礼品卡与企业礼赠服务", "心愿单与送礼攻略平台", "节日营销活动页"],
      namingTips: [
        "单数 .gift 读出来就是「这是一份礼」，天然广告语",
        "注册约 $17、续费同价，低档年费预算轻松",
        "礼品卡与心愿单用 .gift，货架式礼品店用 .gifts",
        "节日波峰之外，用常青送礼攻略内容拿全年流量",
      ],
    },
    en: {
      title: ".gift Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".gift is the dedicated suffix for gifting — for gift e-commerce and gift-box brands, gift cards and corporate gifting services, wishlists and gift-guide platforms, holiday campaign pages. See live pricing and naming advice, then hunt available .gift names with AI.",
      intro:
        ".gift wraps the gesture right into the address: gift e-commerce and gift-box brands, gift cards and corporate gifting services, wishlist and gift-guide platforms, and holiday campaign pages on name.gift get the singular form that reads as \"here's a gift\" — a.gift and perfect.gift are ad copy the moment you say them. Against the already-listed .gifts the split is subtle: .gifts (plural) names the merchandise category and suits shelf-style gift shops, while .gift (singular) names the act and the moment — gift cards, wishlists and campaign landing pages read truer here, so the two suffixes cover opposite ends of the gifting funnel. The registry is the Uniregistry portfolio (now operated by GoDaddy Registry). Pricing is flat: about $17 to register (≈¥119) and the same to renew — a light annual fee with excellent inventory: occasion words, holiday words and brand words all hit. Two cautions: .gift binds hard to the gifting moment, so stores whose core business isn't gifts shouldn't force it; and gifting traffic spikes around holidays — build evergreen gift-guide content to earn traffic year-round. Naming: adjective + .gift (perfect.gift) is the mainstream shape; holiday or audience + .gift (mom.gift) suits vertical gifting sites.",
      bestFor: ["Gift e-commerce & gift-box brands", "Gift cards & corporate gifting services", "Wishlists & gift-guide platforms", "Holiday campaign pages"],
      namingTips: [
        "The singular .gift reads as \"here's a gift\" — built-in ad copy",
        "About $17 flat per year — a light, stable annual fee",
        "Gift cards and wishlists fit .gift; shelf shops fit .gifts",
        "Pair holiday spikes with evergreen gift-guide content",
      ],
    },
  },
  party: {
    tld: "party",
    zh: {
      title: ".party 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".party 是派对与活动场景的专属后缀，适合派对策划与活动执行、生日与主题派对用品电商、夜店与音乐活动品牌、线上活动与邀请函页面。查看 .party 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .party 域名。",
      intro:
        ".party 把「开派对」写进域名：派对策划与活动执行、生日与主题派对用品电商、夜店与音乐活动品牌、线上活动与邀请函页面用 name.party，域名读出来就是一句邀请——join.party、summer.party 这类组合自带气氛。它与已收录的 .events/.fun/.club 分工清晰：.events 说「活动」这个正式大词（会议、发布会也用），.fun 说泛泛的好玩，.club 说会员与社群，.party 直指「派对」这个具体场景——做娱乐向活动生意用它气氛最足。注册局为 Blue Sky Registry（Gname 系，原 Famous Four Media 组合）。价格是全站少见的双低结构：注册约 $5（约 ¥33），续费约 $6/年（约 ¥41）——注册与续费都极便宜，做单场活动页、季节性营销页几乎零成本。库存极好：场景词、城市词、主题词全线有货。注意两点：一是 .party 早年低价曾被垃圾注册盯上，部分邮件网关对新后缀敏感，重要通知邮件建议配主流后缀发送；二是语感偏娱乐，婚礼策划这类正式业务可与 .wedding/.events 搭配使用。命名上「主题/季节 + .party」（summer.party）最主流，「城市 + .party」适合本地活动与场地站。",
      bestFor: ["派对策划与活动执行", "生日与主题派对用品电商", "夜店与音乐活动品牌", "线上活动与邀请函页面"],
      namingTips: [
        "「主题 + .party」读出来就是一句邀请",
        "注册约 $5、续费约 $6/年，双低价格几乎零成本",
        "娱乐向活动用 .party，正式会议活动用 .events",
        "重要通知邮件配主流后缀发送，避开网关误判",
      ],
    },
    en: {
      title: ".party Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".party is the dedicated suffix for celebrations — for party planners and event production, birthday and theme-party supply stores, nightlife and music event brands, online events and invitation pages. See live pricing and naming advice, then hunt available .party names with AI.",
      intro:
        ".party writes the celebration into the address: party planners and event production, birthday and theme-party supply stores, nightlife and music event brands, and online invitation pages on name.party get a domain that reads as an invitation — join.party and summer.party bring the mood before the page even loads. It divides labor cleanly with the already-listed .events, .fun and .club: .events is the formal umbrella (conferences and launches use it too), .fun is generic playfulness, .club is membership and community — .party names the specific occasion, so entertainment-first businesses get the most atmosphere here. The registry is Blue Sky Registry (Gname family, from the former Famous Four Media portfolio). Pricing is a rare double-low: about $5 to register (≈¥33) and $6/yr to renew (≈¥41) — cheap in and cheap to hold, so single-event pages and seasonal campaigns cost almost nothing. Inventory is excellent: occasion words, city words and theme words all hit. Two cautions: the early bargain years attracted spam registrations and some mail gateways stay wary of the suffix, so send critical email from a mainstream domain; and the vibe is playful — formal businesses like wedding planning pair it with .wedding or .events. Naming: theme or season + .party (summer.party) is the mainstream shape; city + .party suits local events and venue sites.",
      bestFor: ["Party planners & event production", "Birthday & theme-party supply stores", "Nightlife & music event brands", "Online events & invitation pages"],
      namingTips: [
        "Theme + .party reads as an invitation out loud",
        "About $5 in, $6/yr to hold — nearly free either way",
        "Playful events fit .party; formal ones fit .events",
        "Send critical email from a mainstream domain alongside it",
      ],
    },
  },
  fishing: {
    tld: "fishing",
    zh: {
      title: ".fishing 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".fishing 是钓鱼行业的专属后缀，适合渔具店与钓具电商、包船海钓与钓鱼向导、钓场与渔家乐、钓鱼内容与社区。查看 .fishing 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .fishing 域名。",
      intro:
        ".fishing 把「钓鱼」抛进域名：渔具店与钓具电商、包船海钓与钓鱼向导、钓场与渔家乐、钓鱼内容与社区用 name.fishing，钓友搜「地名 + fishing」时域名与搜索词逐字吻合——包船与向导生意几乎全靠这个搜索句式获客。它与已收录的 .surf/.camp/.guide 等户外系后缀分工清晰：.surf 说冲浪，.camp 说露营，.guide 泛指攻略与向导，.fishing 直指钓鱼这个垂直——全球数亿钓鱼爱好者的休闲大品类值得一个专属后缀。注册局为 GoDaddy Registry（原 Minds + Machines 组合）。价格平进平出：注册约 $26（约 ¥189），续费同价——中档年费预算稳定，库存极好：鱼种词（bass、carp）、水域词（lake、reef）、地名全线有货。注意两点：一是 7 个字母的后缀不短，词根务必短（bass.fishing 是理想形态）；二是包船与向导业务季节性强，域名之外把预订系统与旺季档期页备好。命名上「鱼种/水域 + .fishing」（bass.fishing）最主流，「地名 + .fishing」适合本地包船与钓场站。",
      bestFor: ["渔具店与钓具电商", "包船海钓与钓鱼向导", "钓场与渔家乐", "钓鱼内容与社区"],
      namingTips: [
        "「地名 + .fishing」与钓友搜索句式逐字吻合",
        "注册约 $26、续费同价，预算稳定无涨价陷阱",
        "鱼种词 + .fishing（bass.fishing）是理想短组合",
        "包船生意季节性强，预订系统与档期页一起备好",
      ],
    },
    en: {
      title: ".fishing Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".fishing is the dedicated suffix for the angling trade — for tackle shops and fishing-gear e-commerce, charter boats and fishing guides, fishing camps and lodges, fishing content and communities. See live pricing and naming advice, then hunt available .fishing names with AI.",
      intro:
        ".fishing casts the pastime right into the address: tackle shops and gear e-commerce, charter boats and fishing guides, fishing camps and lodges, and fishing content or communities on name.fishing match how anglers actually search — \"place + fishing\" is the literal query, and charter and guide businesses live on exactly that phrase. It divides labor cleanly with the already-listed outdoor suffixes: .surf names the wave, .camp names the tent, .guide covers how-tos of any kind — .fishing points at this one vertical, and a pastime with hundreds of millions of anglers worldwide earns its own suffix. The registry is GoDaddy Registry (from the former Minds + Machines portfolio). Pricing is flat: about $26 to register (≈¥189) and the same to renew — a stable mid-range fee with excellent inventory: species words (bass, carp), water words (lake, reef) and place names all hit. Two cautions: the 7-letter suffix isn't short, so keep the root tight (bass.fishing is the ideal shape); and charter and guide work is seasonal — have the booking system and season calendar ready alongside the domain. Naming: species or water + .fishing (bass.fishing) is the mainstream shape; place + .fishing suits local charters and fishing camps.",
      bestFor: ["Tackle shops & fishing-gear e-commerce", "Charter boats & fishing guides", "Fishing camps & lodges", "Fishing content & communities"],
      namingTips: [
        "Place + .fishing matches angler search queries word for word",
        "About $26 flat per year — stable budgeting, no renewal trap",
        "Species + .fishing (bass.fishing) is the ideal short combo",
        "Charters are seasonal — pair the domain with a booking system",
      ],
    },
  },
  horse: {
    tld: "horse",
    zh: {
      title: ".horse 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".horse 是马术与马业的专属后缀，适合马术俱乐部与骑术学校、马场与马匹寄养、马匹交易与育种、马具电商与马业媒体。查看 .horse 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .horse 域名。",
      intro:
        ".horse 把「马」牵进域名：马术俱乐部与骑术学校、马场与马匹寄养、马匹交易与育种、马具电商与马业媒体用 name.horse，一个词覆盖从骑乘教学到育种交易的整条马业链路——马术是客单价极高的小众行业，专属后缀的辨识度回报也高。它与已收录的 .pet/.dog/.club 分工清晰：.pet/.dog 说家庭宠物，.club 说泛泛的会员组织，.horse 直指马这个物种与产业——马术俱乐部用 name.horse 比 name.club 定位准得多。注册局为 GoDaddy Registry（原 Minds + Machines 组合）。价格平进平出：注册约 $26（约 ¥189），续费同价——中档年费预算稳定，库存极好：马名、马场名、品种词（arabian、pony 词根组合）全线有货。注意两点：一是英语语境里 .horse 也常被用作幽默梗域名，正式品牌落地页要第一屏把专业定位讲清；二是马匹交易与育种重信任，域名之外把血统证明与实拍视频这类信任设施备好。命名上「马场/俱乐部名 + .horse」（willow.horse）最主流，「品种/用途 + .horse」（dressage.horse）适合垂直交易与内容站。",
      bestFor: ["马术俱乐部与骑术学校", "马场与马匹寄养", "马匹交易与育种", "马具电商与马业媒体"],
      namingTips: [
        "「马场名 + .horse」比 .club 定位准得多",
        "注册约 $26、续费同价，预算稳定无涨价陷阱",
        "高客单价小众行业，专属后缀辨识度回报高",
        "交易与育种重信任，血统证明与实拍一起备好",
      ],
    },
    en: {
      title: ".horse Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".horse is the dedicated suffix for the equestrian world — for riding clubs and riding schools, stables and horse boarding, horse sales and breeding, tack shops and equestrian media. See live pricing and naming advice, then hunt available .horse names with AI.",
      intro:
        ".horse leads the animal right into the address: riding clubs and riding schools, stables and boarding barns, horse sales and breeding operations, and tack shops or equestrian media on name.horse cover the whole industry chain from lessons to bloodlines in one word — and in a niche with famously high ticket sizes, a dedicated suffix pays back its recognition fast. It divides labor cleanly with the already-listed .pet, .dog and .club: .pet and .dog name household companions, .club names any membership group — .horse names the species and the industry, so a riding club positions far sharper on name.horse than name.club. The registry is GoDaddy Registry (from the former Minds + Machines portfolio). Pricing is flat: about $26 to register (≈¥189) and the same to renew — a stable mid-range fee with excellent inventory: horse names, barn names and breed words (arabian, pony roots) all hit. Two cautions: in English internet culture .horse also carries a meme streak, so serious brands should state the professional positioning above the fold; and horse sales and breeding run on trust — have pedigree papers and real video ready alongside the domain. Naming: barn or club name + .horse (willow.horse) is the mainstream shape; breed or discipline + .horse (dressage.horse) suits vertical marketplaces and content sites.",
      bestFor: ["Riding clubs & riding schools", "Stables & horse boarding", "Horse sales & breeding", "Tack shops & equestrian media"],
      namingTips: [
        "Barn name + .horse positions far sharper than .club",
        "About $26 flat per year — stable budgeting, no renewal trap",
        "A high-ticket niche rewards a dedicated, memorable suffix",
        "Sales and breeding run on trust — pair pedigree proof with the domain",
      ],
    },
  },
  singles: {
    tld: "singles",
    zh: {
      title: ".singles 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".singles 是单身人群场景的专属后缀，适合同城交友与单身活动组织、婚恋相亲与红娘工作室、单身社群与兴趣俱乐部、脱单课程与情感咨询。查看 .singles 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .singles 域名。",
      intro:
        ".singles 把「单身」写进域名：同城交友与单身活动组织、婚恋相亲与红娘工作室、单身社群与兴趣俱乐部、脱单课程与情感咨询用 name.singles，目标人群一眼锁定——用户搜「城市 + singles」找同城活动时，域名与搜索词逐字吻合。它与已收录的 .love/.club/.social 分工清晰：.love 说「爱」这个抽象大词（品牌表白、婚礼站也用），.club 说泛泛的会员组织，.social 说社交产品，.singles 直指「单身人群」这个精确画像——做单身经济的生意用它人群定位最准。注册局为 Identity Digital（Binky Moon 组合，2014 年首批新后缀）。价格是典型首年促销结构：首年约 $7（约 ¥52），续费约 $27/年（约 ¥196）——入门便宜，长期按续费价预算。库存极好：城市词、兴趣词、活动词全线有货。注意两点：一是 7 个字母的后缀不短，词根务必短（nyc.singles 是理想形态）；二是交友婚恋行业重信任与合规，域名之外把实名审核与隐私政策这类信任设施备好。命名上「城市 + .singles」（tokyo.singles）最主流，「兴趣/场景 + .singles」（hiking.singles）适合垂直社群与主题活动。",
      bestFor: ["同城交友与单身活动组织", "婚恋相亲与红娘工作室", "单身社群与兴趣俱乐部", "脱单课程与情感咨询"],
      namingTips: [
        "「城市 + .singles」与同城交友搜索句式逐字吻合",
        "首年约 $7、续费约 $27/年，按续费价做长期预算",
        "精确人群用 .singles，泛社群用 .club/.social",
        "交友行业重信任，实名审核与隐私政策一起备好",
      ],
    },
    en: {
      title: ".singles Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".singles is the dedicated suffix for the unattached — for local singles events and meetup organizers, matchmaking services and dating agencies, singles communities and interest clubs, dating courses and relationship coaching. See live pricing and naming advice, then hunt available .singles names with AI.",
      intro:
        ".singles writes the audience right into the address: local singles events and meetup organizers, matchmaking services and dating agencies, singles communities and interest clubs, and dating courses on name.singles lock onto their target crowd at a glance — \"city + singles\" is the literal query people type when hunting local events. It divides labor cleanly with the already-listed .love, .club and .social: .love names the big abstract word (brands and wedding sites use it too), .club names any membership group, .social names social products — .singles names one precise demographic, so businesses in the singles economy position sharpest here. The registry is Identity Digital (Binky Moon portfolio, from the first 2014 wave). Pricing follows the classic promo structure: about $7 first year (≈¥52) and $27/yr to renew (≈¥196) — cheap to start, budget on the renewal. Inventory is excellent: city words, interest words and event words all hit. Two cautions: the 7-letter suffix isn't short, so keep the root tight (nyc.singles is the ideal shape); and the dating industry runs on trust and compliance — pair the domain with identity verification and a real privacy policy. Naming: city + .singles (tokyo.singles) is the mainstream shape; interest or scene + .singles (hiking.singles) suits vertical communities and themed events.",
      bestFor: ["Local singles events & meetup organizers", "Matchmaking services & dating agencies", "Singles communities & interest clubs", "Dating courses & relationship coaching"],
      namingTips: [
        "City + .singles matches local-event search queries word for word",
        "About $7 year one, $27/yr renewal — budget on the renewal",
        "A precise demographic fits .singles; generic groups fit .club",
        "Dating runs on trust — pair verification and privacy policies",
      ],
    },
  },
  dating: {
    tld: "dating",
    zh: {
      title: ".dating 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".dating 是婚恋交友行业的专属后缀，适合交友 App 与婚恋平台、相亲机构与高端红娘、约会攻略与情感内容站、垂直人群交友社区。查看 .dating 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .dating 域名。",
      intro:
        ".dating 把「约会」放进域名：交友 App 与婚恋平台、相亲机构与高端红娘、约会攻略与情感内容站、垂直人群交友社区用 name.dating，行业属性一词讲透——这是个全球数百亿美元的大行业，专属后缀的品牌回报也高。它与同批收录的 .singles 分工清晰：.singles 说「单身人群」这个画像（活动、社群向），.dating 说「约会交友」这个行业与产品——做平台与服务的生意用 .dating，做人群社群用 .singles。注册局为 Identity Digital（Binky Moon 组合，2014 年首批新后缀）。价格是典型首年促销结构：首年约 $13（约 ¥93），续费约 $52/年（约 ¥374）——续费在新后缀里偏高，正式产品才值得长期持有。库存极好：产品词、人群词、地域词全线有货。注意两点：一是交友行业各国监管与应用商店审核趋严，域名之外把年龄验证与内容审核机制备好；二是续费近 $52/年，域名矩阵别铺太宽，主站一个就够。命名上「品牌词 + .dating」（spark.dating）最主流，「人群/垂直 + .dating」（senior.dating）适合细分市场平台。",
      bestFor: ["交友 App 与婚恋平台", "相亲机构与高端红娘", "约会攻略与情感内容站", "垂直人群交友社区"],
      namingTips: [
        "「品牌词 + .dating」行业属性一词讲透",
        "首年约 $13、续费约 $52/年，正式产品才长期持有",
        "平台与服务用 .dating，人群活动用 .singles",
        "监管趋严，年龄验证与内容审核一起备好",
      ],
    },
    en: {
      title: ".dating Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".dating is the dedicated suffix for the dating industry — for dating apps and matchmaking platforms, matchmaking agencies and premium matchmakers, dating-advice and relationship content sites, niche dating communities. See live pricing and naming advice, then hunt available .dating names with AI.",
      intro:
        ".dating puts the industry right in the address: dating apps and matchmaking platforms, agencies and premium matchmakers, dating-advice content sites, and niche dating communities on name.dating say the whole business in one word — and in a global industry worth tens of billions, a dedicated suffix pays back its branding fast. It divides labor cleanly with the same-batch .singles: .singles names the demographic (events and community first), .dating names the industry and the product — platforms and services fit .dating, audience communities fit .singles. The registry is Identity Digital (Binky Moon portfolio, from the first 2014 wave). Pricing follows the classic promo structure: about $13 first year (≈¥93) and $52/yr to renew (≈¥374) — a renewal on the high side for new gTLDs, so hold it long-term only for a serious product. Inventory is excellent: product words, audience words and place names all hit. Two cautions: dating faces tightening regulation and app-store review worldwide, so pair the domain with age verification and content moderation; and at $52/yr, keep the domain portfolio narrow — one main site is enough. Naming: brand word + .dating (spark.dating) is the mainstream shape; audience or vertical + .dating (senior.dating) suits niche-market platforms.",
      bestFor: ["Dating apps & matchmaking platforms", "Matchmaking agencies & premium matchmakers", "Dating-advice & relationship content sites", "Niche dating communities"],
      namingTips: [
        "Brand word + .dating says the whole industry in one word",
        "About $13 year one, $52/yr renewal — for serious products only",
        "Platforms fit .dating; audience communities fit .singles",
        "Regulation is tightening — pair age checks and moderation",
      ],
    },
  },
  luxury: {
    tld: "luxury",
    zh: {
      title: ".luxury 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".luxury 是高端奢侈品定位的专属后缀，适合奢侈品牌与高端定制、高端腕表珠宝与买手店、豪华旅行与高端酒店、高净值服务与私人顾问。查看 .luxury 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .luxury 域名。",
      intro:
        ".luxury 把「奢侈」戴进域名：奢侈品牌与高端定制、高端腕表珠宝与买手店、豪华旅行与高端酒店、高净值服务与私人顾问用 name.luxury，定位声明直接写在地址里——客单价越高的生意，后缀传递的档次感越值钱。它与已收录的 .boutique/.gold/.diamonds 分工清晰：.boutique 说精品小店，.gold/.diamonds 说具体品类，.luxury 说「奢侈」这个定位本身——跨品类的高端生意用它覆盖面最广。注册局为 Luxury Partners LLC（专营该后缀的独立注册局）。价格平进平出：注册约 $26（约 ¥189），续费同价——曾经年费数百美元的贵族后缀已降到中档价位，现在入手正是时候。库存极好：品牌词、品类词、地名全线有货。注意两点：一是「luxury」是定位承诺，站点视觉与服务体验必须撑得起这个词，否则适得其反；二是 6 个字母的后缀读感高级但不短，词根务必短（yachts.luxury 已是舒适上限）。命名上「品牌词 + .luxury」（maison.luxury）最主流，「品类 + .luxury」（watches.luxury）适合垂直买手与内容站。",
      bestFor: ["奢侈品牌与高端定制", "高端腕表珠宝与买手店", "豪华旅行与高端酒店", "高净值服务与私人顾问"],
      namingTips: [
        "「品牌词 + .luxury」定位声明直接写在地址里",
        "注册约 $26、续费同价，贵族后缀已降到中档价",
        "视觉与服务必须撑得起 luxury 这个词",
        "词根控制在 6 字符内，读感才配得上档次",
      ],
    },
    en: {
      title: ".luxury Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".luxury is the dedicated suffix for high-end positioning — for luxury brands and haute couture, fine watches, jewelry and curated boutiques, luxury travel and five-star hotels, high-net-worth services and private advisors. See live pricing and naming advice, then hunt available .luxury names with AI.",
      intro:
        ".luxury wears the positioning right in the address: luxury brands and haute couture, fine watches and jewelry, luxury travel and five-star hotels, and high-net-worth services on name.luxury make the claim before the page loads — and the higher the ticket size, the more that signal is worth. It divides labor cleanly with the already-listed .boutique, .gold and .diamonds: .boutique names a small fine shop, .gold and .diamonds name specific categories — .luxury names the positioning itself, so high-end businesses across categories get the widest coverage here. The registry is Luxury Partners LLC, an independent registry dedicated to this suffix. Pricing is flat: about $26 to register (≈¥189) and the same to renew — a suffix that once cost hundreds of dollars a year has settled at a mid-range fee, which makes now a good entry point. Inventory is excellent: brand words, category words and place names all hit. Two cautions: \"luxury\" is a promise — the site's design and service must live up to the word or the suffix backfires; and the 6-letter ending reads premium but not short, so keep the root tight (yachts.luxury is about the comfortable limit). Naming: brand word + .luxury (maison.luxury) is the mainstream shape; category + .luxury (watches.luxury) suits vertical curators and content sites.",
      bestFor: ["Luxury brands & haute couture", "Fine watches, jewelry & curated boutiques", "Luxury travel & five-star hotels", "High-net-worth services & private advisors"],
      namingTips: [
        "Brand word + .luxury states the positioning in the address",
        "About $26 flat per year — a once-premium suffix now mid-range",
        "Design and service must live up to the word, or it backfires",
        "Keep the root within 6 characters to match the premium read",
      ],
    },
  },
  organic: {
    tld: "organic",
    zh: {
      title: ".organic 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".organic 是有机产业的专属后缀，适合有机食品品牌与电商、有机农场与生态种植、天然护肤与有机个护、有机认证与行业内容站。查看 .organic 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .organic 域名。",
      intro:
        ".organic 把「有机」种进域名：有机食品品牌与电商、有机农场与生态种植、天然护肤与有机个护、有机认证与行业内容站用 name.organic，核心卖点直接写在地址里——消费者为「有机」支付溢价，域名先一步完成信任暗示。它与已收录的 .eco/.green/.farm 分工清晰：.eco 说环保理念，.green 说绿色泛概念，.farm 说农场这个场所，.organic 直指「有机」这个有认证体系背书的品类标准——卖有机产品的生意用它定位最准。注册局为 Identity Digital（原 Afilias 组合）。该后缀曾有「须与有机行业相关」的注册倡导，现已开放注册，但生态仍以真有机从业者为主。价格是典型首年促销结构：首年约 $11（约 ¥78），续费约 $68/年（约 ¥493）——续费在全站属高位，真做有机生意再长期持有。库存极好：品类词、农场名、品牌词全线有货。注意两点：一是「organic」是受监管的营销用语，各国对有机宣称有认证要求，域名之外把认证证书亮出来；二是续费近 $68/年，别做域名矩阵，主品牌一个就够。命名上「品牌/农场名 + .organic」（sunrise.organic）最主流，「品类 + .organic」（tea.organic）适合垂直电商与内容站。",
      bestFor: ["有机食品品牌与电商", "有机农场与生态种植", "天然护肤与有机个护", "有机认证与行业内容站"],
      namingTips: [
        "「品牌 + .organic」核心卖点直接写在地址里",
        "首年约 $11、续费约 $68/年，真有机生意再长期持有",
        "有机宣称受监管，认证证书与域名一起亮出来",
        "品类标准用 .organic，泛环保理念用 .eco/.green",
      ],
    },
    en: {
      title: ".organic Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".organic is the dedicated suffix for the organic industry — for organic food brands and e-commerce, organic farms and ecological growers, natural skincare and organic personal care, organic certification and industry content sites. See live pricing and naming advice, then hunt available .organic names with AI.",
      intro:
        ".organic plants the selling point right in the address: organic food brands and e-commerce, organic farms and ecological growers, natural skincare lines, and certification or industry content sites on name.organic state the premium claim before the page loads — consumers pay extra for \"organic\", and the domain starts the trust signal early. It divides labor cleanly with the already-listed .eco, .green and .farm: .eco names an environmental ethos, .green names the broad concept, .farm names the place — .organic names a category standard backed by real certification schemes, so businesses that actually sell organic products position sharpest here. The registry is Identity Digital (from the former Afilias portfolio). The suffix once encouraged organic-industry-related registrations; it is open to all now, but the ecosystem still skews toward genuine organic businesses. Pricing follows the classic promo structure: about $11 first year (≈¥78) and $68/yr to renew (≈¥493) — one of the higher renewals on this site, so hold it long-term only for a real organic business. Inventory is excellent: category words, farm names and brand words all hit. Two cautions: \"organic\" is a regulated marketing term with certification requirements in most countries, so display the certificates alongside the domain; and at $68/yr, skip the domain portfolio — one main brand is enough. Naming: brand or farm name + .organic (sunrise.organic) is the mainstream shape; category + .organic (tea.organic) suits vertical commerce and content sites.",
      bestFor: ["Organic food brands & e-commerce", "Organic farms & ecological growers", "Natural skincare & organic personal care", "Organic certification & industry content sites"],
      namingTips: [
        "Brand + .organic states the premium claim in the address",
        "About $11 year one, $68/yr renewal — for real organic businesses",
        "\"Organic\" is regulated — show certification with the domain",
        "The category standard fits .organic; broad ethos fits .eco",
      ],
    },
  },
  tattoo: {
    tld: "tattoo",
    zh: {
      title: ".tattoo 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".tattoo 是纹身行业的专属后缀，适合纹身店与工作室、纹身师个人作品集、纹身器材与耗材电商、纹身设计与图案平台。查看 .tattoo 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .tattoo 域名。",
      intro:
        ".tattoo 把「纹身」刺进域名：纹身店与工作室、纹身师个人作品集、纹身器材与耗材电商、纹身设计与图案平台用 name.tattoo，行业属性一词讲透——纹身是重作品集、重口碑的手艺行业，客人搜「纹身师名 + tattoo」时域名与搜索词逐字吻合。它与已收录的 .ink/.studio/.art 分工清晰：.ink 说「墨水」这个意象（文创、写作也用），.studio 说工作室这个场所，.art 说泛艺术，.tattoo 直指纹身这个行业——做纹身生意用它定位最准。注册局为 GoDaddy Registry（原 Uniregistry 组合）。价格是典型首年促销结构：首年约 $2（约 ¥15），续费约 $31/年（约 ¥226）——首年近乎白送，长期按续费价预算。库存极好：风格词（blackwork、irezumi）、人名、店名全线有货。注意两点：一是 6 个字母的后缀读感直接但不短，词根务必短（ink.tattoo 是理想形态）；二是纹身获客靠作品集与社媒导流，域名之外把 Instagram 作品墙与预约系统接好。命名上「纹身师/店名 + .tattoo」（raven.tattoo）最主流，「风格 + .tattoo」（blackwork.tattoo）适合垂直风格工作室。",
      bestFor: ["纹身店与工作室", "纹身师个人作品集", "纹身器材与耗材电商", "纹身设计与图案平台"],
      namingTips: [
        "「纹身师名 + .tattoo」与客人搜索句式逐字吻合",
        "首年约 $2、续费约 $31/年，按续费价做长期预算",
        "纹身行业用 .tattoo，泛意象用 .ink，场所用 .studio",
        "作品集与预约系统和域名一起接好",
      ],
    },
    en: {
      title: ".tattoo Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".tattoo is the dedicated suffix for the tattoo trade — for tattoo shops and studios, tattoo artist portfolios, tattoo equipment and supply e-commerce, tattoo design and flash platforms. See live pricing and naming advice, then hunt available .tattoo names with AI.",
      intro:
        ".tattoo inks the trade right into the address: tattoo shops and studios, artist portfolios, equipment and supply e-commerce, and design or flash platforms on name.tattoo say the whole industry in one word — tattooing is a portfolio-and-reputation craft, and \"artist name + tattoo\" is the literal query clients type. It divides labor cleanly with the already-listed .ink, .studio and .art: .ink names the imagery (writers and stationery brands use it too), .studio names the room, .art names art at large — .tattoo names this one trade, so tattoo businesses position sharpest here. The registry is GoDaddy Registry (from the former Uniregistry portfolio). Pricing follows the classic promo structure: about $2 first year (≈¥15) and $31/yr to renew (≈¥226) — the first year is nearly free, so budget on the renewal. Inventory is excellent: style words (blackwork, irezumi), artist names and shop names all hit. Two cautions: the 6-letter suffix reads direct but isn't short, so keep the root tight (ink.tattoo is the ideal shape); and tattoo clients arrive via portfolios and social feeds — wire the Instagram wall and booking system to the domain from day one. Naming: artist or shop name + .tattoo (raven.tattoo) is the mainstream shape; style + .tattoo (blackwork.tattoo) suits style-focused studios.",
      bestFor: ["Tattoo shops & studios", "Tattoo artist portfolios", "Tattoo equipment & supply e-commerce", "Tattoo design & flash platforms"],
      namingTips: [
        "Artist name + .tattoo matches client search queries word for word",
        "About $2 year one, $31/yr renewal — budget on the renewal",
        "The trade fits .tattoo; imagery fits .ink; the room fits .studio",
        "Wire portfolio and booking to the domain from day one",
      ],
    },
  },
  casa: {
    tld: "casa",
    zh: {
      title: ".casa 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".casa 是西语「家」的生活方式后缀，适合西语市场房产与民宿、家居品牌与生活方式电商、餐厅民宿等「Casa」系品牌、室内设计与家装服务。查看 .casa 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .casa 域名。",
      intro:
        ".casa 把西语的「家」安进域名：西语市场房产与民宿、家居品牌与生活方式电商、餐厅民宿等「Casa」系品牌、室内设计与家装服务用 name.casa，一个词同时说了「房子」与「家的温度」——全球五亿西语人口外加意大利语市场，Casa 开头的品牌名本就遍地都是，name.casa 让品牌名与后缀读成一句话。它与已收录的 .homes/.house/.estate 分工清晰：.homes 是英语房产垂直（有行业注册要求），.house 说房子这个通用词，.estate 说资产与地产，.casa 直指西语与拉丁语系市场的「家」——面向西语用户或走地中海调性的品牌用它最出彩。注册局为 GoDaddy Registry（原 Minds + Machines 组合）。价格是全站少见的双低结构：首年约 $2（约 ¥11），续费约 $11/年（约 ¥78）——注册与续费都便宜，做品牌矩阵与落地页几乎零成本。库存极好：地名、品牌词、风格词全线有货。注意两点：一是英语市场对 casa 的认知有限，主打英语用户时配主流后缀做主站；二是 Casa 系品牌名泛滥，词根要挑有记忆点的（mi.casa、tu.casa 这类短组合早被抢注）。命名上「品牌词 + .casa」（bella.casa）最主流，「地名 + .casa」（tulum.casa）适合民宿与本地房产站。",
      bestFor: ["西语市场房产与民宿", "家居品牌与生活方式电商", "餐厅民宿等「Casa」系品牌", "室内设计与家装服务"],
      namingTips: [
        "「品牌词 + .casa」让品牌名与后缀读成一句话",
        "首年约 $2、续费约 $11/年，双低价格几乎零成本",
        "西语与地中海调性用 .casa，英语房产垂直用 .homes",
        "Casa 系品牌泛滥，词根要挑有记忆点的",
      ],
    },
    en: {
      title: ".casa Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".casa is the Spanish \"home\" as a lifestyle suffix — for Spanish-market real estate and vacation rentals, home and lifestyle brands, \"Casa\"-named restaurants and guesthouses, interior design and home services. See live pricing and naming advice, then hunt available .casa names with AI.",
      intro:
        ".casa moves the Spanish word for home right into the address: Spanish-market real estate and vacation rentals, home and lifestyle brands, \"Casa\"-named restaurants and guesthouses, and interior design services on name.casa say both \"house\" and \"the warmth of home\" in one word — with half a billion Spanish speakers plus the Italian market, Casa-branded names are everywhere, and name.casa makes brand and suffix read as one phrase. It divides labor cleanly with the already-listed .homes, .house and .estate: .homes is the English real-estate vertical (with industry registration requirements), .house names the generic building, .estate names the asset — .casa names home for the Spanish and Latin-language world, so brands targeting those markets or a Mediterranean vibe shine brightest here. The registry is GoDaddy Registry (from the former Minds + Machines portfolio). Pricing is a rare double-low: about $2 first year (≈¥11) and $11/yr to renew (≈¥78) — cheap in and cheap to hold, so brand portfolios and landing pages cost almost nothing. Inventory is excellent: place names, brand words and style words all hit. Two cautions: English-market recognition of casa is limited, so pair a mainstream suffix for English-first audiences; and Casa-branded names are crowded — pick a memorable root (short combos like mi.casa and tu.casa went long ago). Naming: brand word + .casa (bella.casa) is the mainstream shape; place + .casa (tulum.casa) suits vacation rentals and local property sites.",
      bestFor: ["Spanish-market real estate & vacation rentals", "Home & lifestyle brands", "\"Casa\"-named restaurants & guesthouses", "Interior design & home services"],
      namingTips: [
        "Brand word + .casa makes name and suffix read as one phrase",
        "About $2 year one, $11/yr renewal — nearly free either way",
        "Spanish and Mediterranean vibes fit .casa; English real estate fits .homes",
        "Casa branding is crowded — pick a memorable root",
      ],
    },
  },
  vodka: {
    tld: "vodka",
    zh: {
      title: ".vodka 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".vodka 是伏特加品类的专属后缀，适合伏特加品牌与精酿酒厂、鸡尾酒吧与调酒内容站、烈酒电商与进口商、酒类测评与品鉴社区。查看 .vodka 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .vodka 域名。",
      intro:
        ".vodka 把酒瓶上的品类直接倒进域名：伏特加品牌与精酿酒厂、鸡尾酒吧与调酒内容站、烈酒电商与进口商、酒类测评与品鉴社区用 name.vodka，品类属性一词讲透——烈酒是重品牌、重故事的行业，name.vodka 让品牌名与品类读成一句话。它与已收录的 .wine/.beer/.bar 分工清晰：.wine 说葡萄酒，.beer 说啤酒精酿，.bar 说酒吧这个场所，.vodka 直指伏特加这一个品类——做伏特加生意用它定位最准，五个字母也是酒类后缀里少见的短。注册局为 GoDaddy Registry（原 Minds + Machines 组合）。价格是少见的平价结构：注册与续费都约 $26/年（约 ¥189）——没有首年促销陷阱，预算恒定好算。库存极好：品牌词、产地词、鸡尾酒名全线有货。注意两点：一是酒类营销在各国受严格监管（年龄门槛、广告限制），域名之外把年龄验证与合规页备好；二是烈酒消费者也搜品牌大词，主品牌可配 .com 双持。命名上「品牌词 + .vodka」（frost.vodka）最主流，「产地/风格 + .vodka」（potato.vodka）适合精酿故事向品牌。",
      bestFor: ["伏特加品牌与精酿酒厂", "鸡尾酒吧与调酒内容站", "烈酒电商与进口商", "酒类测评与品鉴社区"],
      namingTips: [
        "「品牌词 + .vodka」让品牌名与品类读成一句话",
        "注册续费同价约 $26/年，预算恒定没有促销陷阱",
        "伏特加品类用 .vodka，葡萄酒用 .wine，场所用 .bar",
        "酒类营销受监管，年龄验证与合规页一起备好",
      ],
    },
    en: {
      title: ".vodka Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".vodka is the dedicated suffix for the vodka category — for vodka brands and craft distilleries, cocktail bars and mixology content sites, spirits e-commerce and importers, tasting and review communities. See live pricing and naming advice, then hunt available .vodka names with AI.",
      intro:
        ".vodka pours the label's category straight into the address: vodka brands and craft distilleries, cocktail bars and mixology content sites, spirits e-commerce and importers, and tasting communities on name.vodka say the whole category in one word — spirits is a brand-and-story business, and name.vodka makes brand and category read as one phrase. It divides labor cleanly with the already-listed .wine, .beer and .bar: .wine names wine, .beer names beer and craft brews, .bar names the venue — .vodka names this one spirit, so vodka businesses position sharpest here, and at five letters it's unusually short for a drinks suffix. The registry is GoDaddy Registry (from the former Minds + Machines portfolio). Pricing is refreshingly flat: about $26/yr to register and renew alike (≈¥189) — no first-year promo trap, so budgets stay constant. Inventory is excellent: brand words, origin words and cocktail names all hit. Two cautions: alcohol marketing is tightly regulated everywhere (age gates, ad restrictions), so pair the domain with age verification and compliance pages; and spirits shoppers still search big brand terms, so a flagship brand may hold a .com alongside. Naming: brand word + .vodka (frost.vodka) is the mainstream shape; origin or style + .vodka (potato.vodka) suits craft-story brands.",
      bestFor: ["Vodka brands & craft distilleries", "Cocktail bars & mixology content sites", "Spirits e-commerce & importers", "Tasting & review communities"],
      namingTips: [
        "Brand word + .vodka makes name and category read as one phrase",
        "About $26/yr flat to register and renew — no promo trap",
        "The spirit fits .vodka; wine fits .wine; the venue fits .bar",
        "Alcohol marketing is regulated — ship age gates with the domain",
      ],
    },
  },
  casino: {
    tld: "casino",
    zh: {
      title: ".casino 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".casino 是博彩娱乐场行业的专属后缀，适合持牌线上娱乐场平台、实体娱乐场与度假村、博彩评测与导航站、社交娱乐场游戏开发商。查看 .casino 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .casino 域名。",
      intro:
        ".casino 把「娱乐场」亮进域名：持牌线上娱乐场平台、实体娱乐场与度假村、博彩评测与导航站、社交娱乐场游戏开发商用 name.casino，行业属性一词讲透——博彩是全球千亿美元级的行业，玩家搜「品牌 + casino」时域名与搜索词逐字吻合。它与已收录的 .games/.game/.club 分工清晰：.games/.game 说泛游戏，.club 说会员组织，.casino 直指真金娱乐场这个受监管行业——持牌运营方用它定位最准。注册局为 Identity Digital（Binky Moon 组合）。价格是全站最陡的首年促销结构之一：首年约 $8（约 ¥56），续费约 $129/年（约 ¥931）——续费全站前列，务必按续费价做长期预算。库存极好：品牌词、玩法词、地名全线有货。注意两点：一是博彩在多数司法辖区须持牌运营，无牌照别碰真金业务，域名解决不了合规；二是续费近 $130/年且行业域名易被平台风控盯上，主体资质与域名信息务必一致。命名上「品牌词 + .casino」（lucky.casino）最主流，「地名 + .casino」（vegas.casino 类）适合实体娱乐场与本地导航站。",
      bestFor: ["持牌线上娱乐场平台", "实体娱乐场与度假村", "博彩评测与导航站", "社交娱乐场游戏开发商"],
      namingTips: [
        "「品牌 + .casino」与玩家搜索句式逐字吻合",
        "首年约 $8、续费约 $129/年，务必按续费价做预算",
        "真金业务须持牌，域名解决不了合规",
        "泛游戏用 .games，真金娱乐场才用 .casino",
      ],
    },
    en: {
      title: ".casino Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".casino is the dedicated suffix for the casino industry — for licensed online casino platforms, land-based casinos and resorts, casino review and affiliate sites, social casino game developers. See live pricing and naming advice, then hunt available .casino names with AI.",
      intro:
        ".casino puts the house right on the marquee: licensed online casino platforms, land-based casinos and resorts, review and affiliate sites, and social casino game developers on name.casino say the whole industry in one word — gambling is a hundred-billion-dollar global business, and \"brand + casino\" is the literal query players type. It divides labor cleanly with the already-listed .games, .game and .club: .games and .game name gaming at large, .club names a membership group — .casino names the regulated real-money trade, so licensed operators position sharpest here. The registry is Identity Digital (Binky Moon portfolio). Pricing is one of the steepest promo structures on this site: about $8 first year (≈¥56) but $129/yr to renew (≈¥931) — among the highest renewals we list, so budget strictly on the renewal. Inventory is excellent: brand words, game words and place names all hit. Two cautions: gambling requires licenses in most jurisdictions — without one, stay away from real-money play, because a domain fixes nothing about compliance; and at nearly $130/yr in a heavily-scrutinized industry, keep corporate credentials and WHOIS details consistent. Naming: brand word + .casino (lucky.casino) is the mainstream shape; place + .casino suits land-based venues and local guide sites.",
      bestFor: ["Licensed online casino platforms", "Land-based casinos & resorts", "Casino review & affiliate sites", "Social casino game developers"],
      namingTips: [
        "Brand + .casino matches player search queries word for word",
        "About $8 year one but $129/yr renewal — budget on the renewal",
        "Real-money play needs a license — the domain fixes nothing",
        "Gaming at large fits .games; the real-money trade fits .casino",
      ],
    },
  },
  bet: {
    tld: "bet",
    zh: {
      title: ".bet 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".bet 是投注行业的短后缀，适合持牌体育投注平台、赛事赔率与数据站、投注技巧与评测内容站、竞猜预测社区。查看 .bet 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .bet 域名。",
      intro:
        ".bet 用三个字母把「投注」说完：持牌体育投注平台、赛事赔率与数据站、投注技巧与评测内容站、竞猜预测社区用 name.bet，动词即行业——bet 本身就是玩家嘴里的高频词，域名短、好记、输入零负担。它与同批收录的 .casino 分工清晰：.casino 说娱乐场这个场所与业态（老虎机、桌游），.bet 说投注这个动作（体育博彩、赛事竞猜为主）——做体育投注与预测的生意用 .bet 更贴。注册局为 Identity Digital（原 Afilias 组合）。价格结构温和：首年约 $10（约 ¥69），续费约 $21/年（约 ¥151）——在博彩类后缀里续费最友好，做内容站与社区也扛得住。库存极好：球队词、赛事词、玩法词全线有货。注意两点：一是与 .casino 同理，真金投注在多数司法辖区须持牌，无牌照就做资讯与社区；二是三字母后缀太好记也易被滥用，品牌词要正经，别踩平台风控关键词。命名上「赛事/球类 + .bet」（soccer.bet 类）最主流，「品牌词 + .bet」（swift.bet）适合持牌平台主站。",
      bestFor: ["持牌体育投注平台", "赛事赔率与数据站", "投注技巧与评测内容站", "竞猜预测社区"],
      namingTips: [
        "三个字母动词即行业，输入零负担",
        "首年约 $10、续费约 $21/年，博彩类里最友好",
        "投注动作用 .bet，娱乐场业态用 .casino",
        "无牌照就做资讯与社区，真金业务须持牌",
      ],
    },
    en: {
      title: ".bet Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".bet is the three-letter suffix for the betting trade — for licensed sportsbooks, odds and data sites, betting tips and review content, prediction and tipster communities. See live pricing and naming advice, then hunt available .bet names with AI.",
      intro:
        ".bet says the whole trade in three letters: licensed sportsbooks, odds and data sites, betting tips and review content, and prediction communities on name.bet make the verb the industry — bet is the word players actually say, and the domain is short, memorable and effortless to type. It divides labor cleanly with the same-batch .casino: .casino names the venue and its games (slots, tables), .bet names the act of wagering — sports betting and match prediction first — so sportsbook and tipster businesses fit .bet best. The registry is Identity Digital (from the former Afilias portfolio). Pricing is gentle: about $10 first year (≈¥69) and $21/yr to renew (≈¥151) — the friendliest renewal among gambling suffixes, sustainable even for content sites and communities. Inventory is excellent: team words, event words and market words all hit. Two cautions: as with .casino, real-money wagering requires licenses in most jurisdictions — without one, stick to news and community; and a three-letter suffix this catchy attracts abuse, so keep branding clean and clear of payment-risk keywords. Naming: sport or event + .bet is the mainstream shape; brand word + .bet (swift.bet) suits a licensed platform's main site.",
      bestFor: ["Licensed sportsbooks", "Odds & data sites", "Betting tips & review content", "Prediction & tipster communities"],
      namingTips: [
        "Three letters make the verb the industry — effortless to type",
        "About $10 year one, $21/yr renewal — friendliest in gambling",
        "The act of wagering fits .bet; the venue fits .casino",
        "No license means news and community only — real money needs one",
      ],
    },
  },
  poker: {
    tld: "poker",
    zh: {
      title: ".poker 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".poker 是扑克垂直的专属后缀，适合线上扑克平台与俱乐部、扑克教学与策略内容站、赛事报道与直播频道、扑克工具与训练软件。查看 .poker 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .poker 域名。",
      intro:
        ".poker 把牌桌搬进域名：线上扑克平台与俱乐部、扑克教学与策略内容站、赛事报道与直播频道、扑克工具与训练软件用 name.poker，垂直属性一词讲透——扑克是博彩里最偏技巧与内容生态的分支，教学、直播、工具的受众都极精准。它与同批收录的 .casino/.bet 分工清晰：.casino 说娱乐场全场，.bet 说体育投注，.poker 直指扑克这一张牌桌——做德州扑克生态的生意用它定位最准。注册局为 Identity Digital（原 Afilias 组合）。价格是典型首年促销结构：首年约 $8（约 ¥59），续费约 $54/年（约 ¥389）——介于 .bet 与 .casino 之间，按续费价做长期预算。库存极好：术语词（allin、river、bluff 类）、俱乐部名、人名全线有货。注意两点：一是各司法辖区对真金扑克定性不一（技巧游戏 vs 博彩），跨境运营前把目标市场法规摸清；二是扑克内容生态靠社区与直播导流，域名之外把 Twitch/Discord 阵地一起建好。命名上「术语 + .poker」（allin.poker）最主流，「品牌/俱乐部 + .poker」（ace.poker）适合平台与俱乐部主站。",
      bestFor: ["线上扑克平台与俱乐部", "扑克教学与策略内容站", "赛事报道与直播频道", "扑克工具与训练软件"],
      namingTips: [
        "「术语 + .poker」对牌手一眼即懂",
        "首年约 $8、续费约 $54/年，按续费价做预算",
        "扑克垂直用 .poker，全场娱乐用 .casino，体育投注用 .bet",
        "各地对真金扑克定性不一，跨境前摸清法规",
      ],
    },
    en: {
      title: ".poker Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".poker is the dedicated suffix for the poker vertical — for online poker platforms and clubs, poker training and strategy content, tournament coverage and streaming channels, poker tools and trainers. See live pricing and naming advice, then hunt available .poker names with AI.",
      intro:
        ".poker deals the table straight into the address: online poker platforms and clubs, training and strategy content, tournament coverage and streaming channels, and poker tools on name.poker say the vertical in one word — poker is the most skill-and-content-driven branch of gambling, and its coaching, streaming and software audiences are laser-precise. It divides labor cleanly with the same-batch .casino and .bet: .casino names the whole gaming floor, .bet names sports wagering — .poker names this one table, so businesses in the hold'em ecosystem position sharpest here. The registry is Identity Digital (from the former Afilias portfolio). Pricing follows the classic promo structure: about $8 first year (≈¥59) and $54/yr to renew (≈¥389) — between .bet and .casino, so budget on the renewal. Inventory is excellent: term words (allin, river, bluff), club names and player names all hit. Two cautions: jurisdictions disagree on whether real-money poker is a skill game or gambling, so map the rules of every target market before going cross-border; and the poker content world runs on community and streams — build the Twitch and Discord presence alongside the domain. Naming: term + .poker (allin.poker) is the mainstream shape; brand or club + .poker (ace.poker) suits platform and club main sites.",
      bestFor: ["Online poker platforms & clubs", "Poker training & strategy content", "Tournament coverage & streaming channels", "Poker tools & trainers"],
      namingTips: [
        "Term + .poker reads instantly to card players",
        "About $8 year one, $54/yr renewal — budget on the renewal",
        "The vertical fits .poker; the floor fits .casino; sports fit .bet",
        "Real-money poker's legal status varies — map each market first",
      ],
    },
  },
  futbol: {
    tld: "futbol",
    zh: {
      title: ".futbol 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".futbol 是西语足球世界的专属后缀，适合西语市场球迷媒体与社区、拉美青训与足球学校、球队球迷会与地方联赛、足球装备与周边电商。查看 .futbol 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .futbol 域名。",
      intro:
        ".futbol 用西语把足球喊进域名：西语市场球迷媒体与社区、拉美青训与足球学校、球队球迷会与地方联赛、足球装备与周边电商用 name.futbol，一个词说清「足球」与「说西语」两件事——西语世界是足球最狂热的市场，futbol 是球迷嘴里的原生拼写，域名与受众语言完全同频。它与已收录的 .soccer/.football 分工清晰：.soccer 是美式英语叫法（北美市场），.football 是英式叫法（欧洲及全球），.futbol 直指西语与拉美市场——面向拉美、西班牙球迷的生意用它最出彩。注册局为 Identity Digital（原 Rightside/Donuts 组合）。价格在体育类后缀里数一数二便宜：首年约 $6（约 ¥41），续费约 $14/年（约 ¥100）——比 .soccer/.football 的续费低一截，做球迷站矩阵毫无压力。库存极好：球队词、城市词、术语词全线有货。注意两点：一是英语市场对 futbol 拼写认知有限，主打英语用户时选 .soccer/.football；二是俱乐部官方名多为注册商标，球迷站别蹭官方名，用城市或昵称更安全。命名上「城市/球队昵称 + .futbol」（barrio.futbol）最主流，「术语 + .futbol」（golazo.futbol）适合内容与短视频阵地。",
      bestFor: ["西语市场球迷媒体与社区", "拉美青训与足球学校", "球队球迷会与地方联赛", "足球装备与周边电商"],
      namingTips: [
        "西语原生拼写与拉美球迷语言完全同频",
        "首年约 $6、续费约 $14/年，体育类里数一数二便宜",
        "西语市场用 .futbol，北美用 .soccer，欧洲用 .football",
        "俱乐部官方名多为商标，用城市或昵称更安全",
      ],
    },
    en: {
      title: ".futbol Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".futbol is the dedicated suffix for Spanish-speaking football — for Spanish-market fan media and communities, Latin American academies and football schools, supporters' clubs and local leagues, football gear and merch e-commerce. See live pricing and naming advice, then hunt available .futbol names with AI.",
      intro:
        ".futbol shouts the beautiful game in Spanish: fan media and communities, Latin American academies and football schools, supporters' clubs and local leagues, and gear or merch shops on name.futbol say both \"football\" and \"in Spanish\" in one word — the Spanish-speaking world is the sport's most fervent market, and futbol is the spelling fans actually use, so the domain speaks the audience's native tongue. It divides labor cleanly with the already-listed .soccer and .football: .soccer is the North American term, .football the British and global one — .futbol names the Spanish and Latin American market, so businesses aimed at those fans shine brightest here. The registry is Identity Digital (from the former Rightside/Donuts portfolio). Pricing is among the cheapest in sports suffixes: about $6 first year (≈¥41) and $14/yr to renew (≈¥100) — a notch below .soccer and .football on renewal, so fan-site portfolios cost little. Inventory is excellent: team words, city words and term words all hit. Two cautions: English-market recognition of the futbol spelling is limited, so pick .soccer or .football for English-first audiences; and official club names are registered trademarks — fan sites should use cities or nicknames instead. Naming: city or nickname + .futbol (barrio.futbol) is the mainstream shape; term + .futbol (golazo.futbol) suits content and short-video brands.",
      bestFor: ["Spanish-market fan media & communities", "Latin American academies & football schools", "Supporters' clubs & local leagues", "Football gear & merch e-commerce"],
      namingTips: [
        "The native Spanish spelling speaks the fans' own language",
        "About $6 year one, $14/yr renewal — among the cheapest in sports",
        "Spanish markets fit .futbol; North America .soccer; Europe .football",
        "Official club names are trademarks — use cities or nicknames",
      ],
    },
  },
  moda: {
    tld: "moda",
    zh: {
      title: ".moda 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".moda 是西语/意语「时尚」的专属后缀，适合拉美与西语市场时尚品牌、意式调性设计师工作室、时尚电商与买手店、穿搭内容与时尚媒体。查看 .moda 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .moda 域名。",
      intro:
        ".moda 把西语与意语的「时尚」穿进域名：拉美与西语市场时尚品牌、意式调性设计师工作室、时尚电商与买手店、穿搭内容与时尚媒体用 name.moda，一个词同时说了「时尚」与「拉丁语系调性」——moda 在西语、意语、葡语里通用，四个字母比 fashion 短一半，米兰、圣保罗、墨西哥城的品牌用它读起来就是母语。它与已收录的 .fashion/.style/.boutique 分工清晰：.fashion 是英语大词（全球市场），.style 说个人风格与生活方式，.boutique 说精品小店业态，.moda 直指西语意语世界的时尚——面向拉美、南欧市场或走意式调性的品牌用它最出彩。注册局为 Identity Digital（原 Rightside/Donuts 组合）。价格是典型首年促销结构：首年约 $11（约 ¥78），续费约 $33/年（约 ¥241）——与 .fashion 续费相当，按续费价做长期预算。库存极好：品牌词、风格词、城市词全线有货。注意两点：一是英语市场对 moda 认知有限，主打英语用户时选 .fashion；二是时尚品牌重视觉，域名之外把 Instagram 与 lookbook 阵地一起建好。命名上「品牌词 + .moda」（bella.moda）最主流，「城市/风格 + .moda」（milano.moda）适合买手店与地区时尚媒体。",
      bestFor: ["拉美与西语市场时尚品牌", "意式调性设计师工作室", "时尚电商与买手店", "穿搭内容与时尚媒体"],
      namingTips: [
        "「品牌词 + .moda」四个字母比 fashion 短一半",
        "首年约 $11、续费约 $33/年，按续费价做预算",
        "西语意语市场用 .moda，英语大盘用 .fashion",
        "时尚重视觉，Instagram 与 lookbook 一起建好",
      ],
    },
    en: {
      title: ".moda Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".moda is fashion in Spanish and Italian — for Latin American and Spanish-market fashion brands, Italian-styled designer studios, fashion e-commerce and boutiques, style content and fashion media. See live pricing and naming advice, then hunt available .moda names with AI.",
      intro:
        ".moda wears the Latin word for fashion right in the address: Latin American and Spanish-market fashion brands, Italian-styled designer studios, fashion e-commerce and buyer shops, and style media on name.moda say both \"fashion\" and \"Latin flair\" in one word — moda works across Spanish, Italian and Portuguese, four letters where fashion needs seven, and brands in Milan, São Paulo or Mexico City read it as their mother tongue. It divides labor cleanly with the already-listed .fashion, .style and .boutique: .fashion is the big English word for the global market, .style names personal style and lifestyle, .boutique names the small-shop format — .moda names fashion for the Spanish- and Italian-speaking world, so brands targeting those markets or an Italian vibe shine brightest here. The registry is Identity Digital (from the former Rightside/Donuts portfolio). Pricing follows the classic promo structure: about $11 first year (≈¥78) and $33/yr to renew (≈¥241) — on par with .fashion's renewal, so budget on the renewal. Inventory is excellent: brand words, style words and city words all hit. Two cautions: English-market recognition of moda is limited, so pick .fashion for English-first audiences; and fashion is a visual trade — build the Instagram presence and lookbook alongside the domain. Naming: brand word + .moda (bella.moda) is the mainstream shape; city or style + .moda (milano.moda) suits buyer shops and regional fashion media.",
      bestFor: ["Latin American & Spanish-market fashion brands", "Italian-styled designer studios", "Fashion e-commerce & boutiques", "Style content & fashion media"],
      namingTips: [
        "Brand word + .moda — four letters where fashion needs seven",
        "About $11 year one, $33/yr renewal — budget on the renewal",
        "Spanish and Italian markets fit .moda; the global word is .fashion",
        "Fashion is visual — build Instagram and the lookbook alongside",
      ],
    },
  },
  basketball: {
    tld: "basketball",
    zh: {
      title: ".basketball 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".basketball 是国际篮联官方后缀，适合篮球俱乐部与青训机构、球迷媒体与数据统计站、街球赛事与联赛组织、篮球装备与训练电商。查看 .basketball 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .basketball 域名。",
      intro:
        ".basketball 把整项运动写进域名：篮球俱乐部与青训机构、球迷媒体与数据统计站、街球赛事与联赛组织、篮球装备与训练电商用 name.basketball，运动属性一词讲透——这是国际篮联（FIBA）背书的官方后缀，由 Roar Domains 运营，体育类后缀里少见的「单项运动官方域」。它与已收录的 .soccer/.football/.hockey 分工清晰：各说各的运动，.basketball 直指篮球这一项——做篮球生意用它定位最准，球迷看到后缀就知道你是谁。价格是少见的平价结构：首年约 $42（约 ¥302），续费约 $43/年（约 ¥309）——注册续费几乎同价，没有首年促销陷阱，预算恒定好算。库存极好：城市词、球队词、术语词（crossover、dunk 类）全线有货。注意两点：一是十个字母偏长，口头传播不如短后缀顺，主打线下传播的品牌配个短域名跳转；二是 NBA 球队名与球星名多为注册商标，球迷站用城市或昵称更安全。命名上「城市/俱乐部 + .basketball」（downtown.basketball）最主流，「术语 + .basketball」（crossover.basketball）适合内容与训练品牌。",
      bestFor: ["篮球俱乐部与青训机构", "球迷媒体与数据统计站", "街球赛事与联赛组织", "篮球装备与训练电商"],
      namingTips: [
        "「城市/俱乐部 + .basketball」球迷一眼即懂",
        "注册续费几乎同价约 $42/年，预算恒定没有促销陷阱",
        "篮球用 .basketball，足球用 .soccer/.football，冰球用 .hockey",
        "NBA 球队名与球星名多为商标，用城市或昵称更安全",
      ],
    },
    en: {
      title: ".basketball Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".basketball is the FIBA-backed official suffix for the sport — for basketball clubs and youth academies, fan media and stats sites, streetball events and league organizers, gear and training e-commerce. See live pricing and naming advice, then hunt available .basketball names with AI.",
      intro:
        ".basketball writes the whole sport into the address: basketball clubs and youth academies, fan media and stats sites, streetball events and league organizers, and gear or training shops on name.basketball say the game in one word — this is the official suffix backed by FIBA, the sport's world governing body, operated by Roar Domains, a rare single-sport official domain. It divides labor cleanly with the already-listed .soccer, .football and .hockey: each names its own game — .basketball names this one, so basketball businesses position sharpest here and fans know who you are from the suffix alone. Pricing is refreshingly flat: about $42 first year (≈¥302) and $43/yr to renew (≈¥309) — register and renew cost nearly the same, no promo trap, so budgets stay constant. Inventory is excellent: city words, club words and term words (crossover, dunk) all hit. Two cautions: ten letters is long, so word-of-mouth brands may pair it with a short redirect domain; and NBA team and player names are registered trademarks — fan sites should use cities or nicknames instead. Naming: city or club + .basketball (downtown.basketball) is the mainstream shape; term + .basketball (crossover.basketball) suits content and training brands.",
      bestFor: ["Basketball clubs & youth academies", "Fan media & stats sites", "Streetball events & league organizers", "Basketball gear & training e-commerce"],
      namingTips: [
        "City or club + .basketball reads instantly to fans",
        "About $42/yr nearly flat to register and renew — no promo trap",
        "Basketball fits .basketball; soccer .soccer/.football; ice hockey .hockey",
        "NBA team and player names are trademarks — use cities or nicknames",
      ],
    },
  },
  rugby: {
    tld: "rugby",
    zh: {
      title: ".rugby 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".rugby 是世界橄榄球联合会官方后缀，适合橄榄球俱乐部与青训学院、球迷媒体与赛事报道站、业余联赛与巡回赛组织、橄榄球装备与周边电商。查看 .rugby 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .rugby 域名。",
      intro:
        ".rugby 把橄榄球场划进域名：橄榄球俱乐部与青训学院、球迷媒体与赛事报道站、业余联赛与巡回赛组织、橄榄球装备与周边电商用 name.rugby，运动属性一词讲透——这是世界橄榄球联合会（World Rugby）背书的官方后缀，由 Roar Domains 运营，与 .basketball 同属「单项运动官方域」序列。它与已收录的 .soccer/.football 分工清晰：足球说足球，.rugby 直指橄榄球——英联邦市场（英国、澳新、南非）与法国、日本的橄榄球生意用它定位最准。价格是少见的平价结构：首年约 $42（约 ¥302），续费约 $43/年（约 ¥309）——注册续费几乎同价，没有首年促销陷阱。库存极好：俱乐部词、城市词、术语词（scrum、tryline 类）全线有货。注意两点：一是橄榄球分联盟式与联合式两种规则，跨市场品牌起名时避免把 league/union 混为一谈；二是国家队与职业俱乐部名多为注册商标，球迷站用城市或昵称更安全。命名上「俱乐部/城市 + .rugby」（harbour.rugby）最主流，「术语 + .rugby」（scrum.rugby）适合内容与训练品牌。",
      bestFor: ["橄榄球俱乐部与青训学院", "球迷媒体与赛事报道站", "业余联赛与巡回赛组织", "橄榄球装备与周边电商"],
      namingTips: [
        "「俱乐部/城市 + .rugby」球迷一眼即懂",
        "注册续费几乎同价约 $42/年，预算恒定没有促销陷阱",
        "橄榄球用 .rugby，足球用 .soccer/.football",
        "国家队与职业俱乐部名多为商标，用城市或昵称更安全",
      ],
    },
    en: {
      title: ".rugby Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".rugby is the World Rugby-backed official suffix — for rugby clubs and youth academies, fan media and match coverage, amateur leagues and touring sides, rugby gear and merch e-commerce. See live pricing and naming advice, then hunt available .rugby names with AI.",
      intro:
        ".rugby marks out the pitch in the address: rugby clubs and youth academies, fan media and match coverage, amateur leagues and touring sides, and gear or merch shops on name.rugby say the sport in one word — this is the official suffix backed by World Rugby, the sport's governing body, operated by Roar Domains, in the same single-sport official series as .basketball. It divides labor cleanly with the already-listed .soccer and .football: those name the round-ball game — .rugby names this one, so rugby businesses in Commonwealth markets (UK, Australia, New Zealand, South Africa) plus France and Japan position sharpest here. Pricing is refreshingly flat: about $42 first year (≈¥302) and $43/yr to renew (≈¥309) — register and renew cost nearly the same, no promo trap. Inventory is excellent: club words, city words and term words (scrum, tryline) all hit. Two cautions: the sport splits into union and league codes, so cross-market brands should avoid conflating the two in a name; and national team and pro club names are registered trademarks — fan sites should use cities or nicknames instead. Naming: club or city + .rugby (harbour.rugby) is the mainstream shape; term + .rugby (scrum.rugby) suits content and training brands.",
      bestFor: ["Rugby clubs & youth academies", "Fan media & match coverage", "Amateur leagues & touring sides", "Rugby gear & merch e-commerce"],
      namingTips: [
        "Club or city + .rugby reads instantly to fans",
        "About $42/yr nearly flat to register and renew — no promo trap",
        "Rugby fits .rugby; the round-ball game fits .soccer/.football",
        "National team and pro club names are trademarks — use cities or nicknames",
      ],
    },
  },
  cricket: {
    tld: "cricket",
    zh: {
      title: ".cricket 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".cricket 是板球运动的专属后缀，适合板球俱乐部与青训学院、球迷媒体与比分数据站、地方联赛与赛事组织、板球装备与训练电商。查看 .cricket 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .cricket 域名。",
      intro:
        ".cricket 把三柱门立进域名：板球俱乐部与青训学院、球迷媒体与比分数据站、地方联赛与赛事组织、板球装备与训练电商用 name.cricket，运动属性一词讲透——板球是全球第二大观赛运动，印度、巴基斯坦、英国、澳洲的球迷体量以十亿计，域名与受众搜索词逐字吻合。它与同批收录的 .basketball/.rugby 分工清晰：各说各的运动，.cricket 直指板球——面向南亚与英联邦市场的板球生意用它定位最准。注册局为 Team Internet（GRS Domains，原 Famous Four 组合）。价格是少见的平价结构：注册与续费都约 $21/年（约 ¥152）——没有首年促销陷阱，预算恒定好算。库存极好：城市词、俱乐部词、术语词（wicket、yorker 类）全线有货。注意两点：一是该后缀早年低价促销期招过垃圾注册，个别邮件网关对新域名较严格，上线前把 SPF/DKIM 配齐；二是 IPL 球队名与球星名多为注册商标，球迷站用城市或昵称更安全。命名上「城市/俱乐部 + .cricket」（mumbai.cricket）最主流，「术语 + .cricket」（yorker.cricket）适合内容与数据品牌。",
      bestFor: ["板球俱乐部与青训学院", "球迷媒体与比分数据站", "地方联赛与赛事组织", "板球装备与训练电商"],
      namingTips: [
        "「城市/俱乐部 + .cricket」球迷一眼即懂",
        "注册续费同价约 $21/年，预算恒定没有促销陷阱",
        "板球用 .cricket，篮球用 .basketball，橄榄球用 .rugby",
        "IPL 球队名与球星名多为商标，用城市或昵称更安全",
      ],
    },
    en: {
      title: ".cricket Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".cricket is the dedicated suffix for the sport — for cricket clubs and youth academies, fan media and live-score sites, local leagues and tournament organizers, cricket gear and training e-commerce. See live pricing and naming advice, then hunt available .cricket names with AI.",
      intro:
        ".cricket plants the stumps in the address: cricket clubs and youth academies, fan media and live-score sites, local leagues and tournament organizers, and gear or training shops on name.cricket say the sport in one word — cricket is the world's second-most-watched sport, with audiences in India, Pakistan, the UK and Australia counted in billions, and the domain matches the fans' search term letter for letter. It divides labor cleanly with the same-batch .basketball and .rugby: each names its own game — .cricket names this one, so cricket businesses aimed at South Asian and Commonwealth markets position sharpest here. The registry is Team Internet (GRS Domains, from the former Famous Four portfolio). Pricing is refreshingly flat: about $21/yr to register and renew alike (≈¥152) — no first-year promo trap, so budgets stay constant. Inventory is excellent: city words, club words and term words (wicket, yorker) all hit. Two cautions: the suffix drew spam registrations during early bargain promos, so some mail gateways treat new names strictly — configure SPF/DKIM before launch; and IPL team and player names are registered trademarks — fan sites should use cities or nicknames instead. Naming: city or club + .cricket (mumbai.cricket) is the mainstream shape; term + .cricket (yorker.cricket) suits content and stats brands.",
      bestFor: ["Cricket clubs & youth academies", "Fan media & live-score sites", "Local leagues & tournament organizers", "Cricket gear & training e-commerce"],
      namingTips: [
        "City or club + .cricket reads instantly to fans",
        "About $21/yr flat to register and renew — no promo trap",
        "Cricket fits .cricket; basketball .basketball; rugby .rugby",
        "IPL team and player names are trademarks — use cities or nicknames",
      ],
    },
  },
  fish: {
    tld: "fish",
    zh: {
      title: ".fish 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".fish 是渔业与水产的专属后缀，适合海鲜餐厅与鱼市电商、水族与观赏鱼社区、渔场与水产养殖企业、海洋保育与科普内容站。查看 .fish 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .fish 域名。",
      intro:
        ".fish 把渔获捞进域名：海鲜餐厅与鱼市电商、水族与观赏鱼社区、渔场与水产养殖企业、海洋保育与科普内容站用 name.fish，品类属性一词讲透——fish 同时覆盖「鱼、渔业、水产」三层含义，四个字母也是行业后缀里少见的短。它与已收录的 .fishing/.food/.restaurant 分工清晰：.fishing 说钓鱼这项活动，.food 说泛餐饮，.restaurant 说堂食业态，.fish 直指鱼与水产这个品类——卖鱼、养鱼、说鱼的生意用它定位最准。注册局为 Identity Digital（Binky Moon 组合）。价格是典型首年促销结构：首年约 $8（约 ¥59），续费约 $36/年（约 ¥256）——与 .fishing 平价续费不同，务必按续费价做长期预算。库存极好：鱼种词、港口词、品牌词全线有货。注意两点：一是生鲜电商重时效与冷链，域名之外把配送履约页备好；二是 fish 在英语俚语里另有含义，起名避免歧义组合。命名上「品类/鱼种 + .fish」（salmon.fish）最主流，「品牌词 + .fish」（fresh.fish）适合餐厅与电商主站。",
      bestFor: ["海鲜餐厅与鱼市电商", "水族与观赏鱼社区", "渔场与水产养殖企业", "海洋保育与科普内容站"],
      namingTips: [
        "「鱼种/品类 + .fish」四个字母把行业讲透",
        "首年约 $8、续费约 $36/年，按续费价做预算",
        "水产品类用 .fish，钓鱼活动用 .fishing，堂食用 .restaurant",
        "生鲜重时效，配送与冷链履约页一起备好",
      ],
    },
    en: {
      title: ".fish Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".fish is the dedicated suffix for seafood and aquatics — for seafood restaurants and fish-market e-commerce, aquarium and ornamental fish communities, fisheries and aquaculture companies, marine conservation and education sites. See live pricing and naming advice, then hunt available .fish names with AI.",
      intro:
        ".fish nets the whole category in the address: seafood restaurants and fish-market e-commerce, aquarium and ornamental fish communities, fisheries and aquaculture companies, and marine conservation sites on name.fish say the trade in one word — fish covers the animal, the industry and the food in a single term, and at four letters it's unusually short for an industry suffix. It divides labor cleanly with the already-listed .fishing, .food and .restaurant: .fishing names the pastime, .food names dining at large, .restaurant names the venue — .fish names the category itself, so businesses that sell, farm or study fish position sharpest here. The registry is Identity Digital (Binky Moon portfolio). Pricing follows the classic promo structure: about $8 first year (≈¥59) and $36/yr to renew (≈¥256) — unlike flat-priced .fishing, so budget on the renewal. Inventory is excellent: species words, port words and brand words all hit. Two cautions: fresh seafood commerce lives on speed and cold chain, so pair the domain with clear fulfillment pages; and fish carries slang meanings in English, so avoid ambiguous combos. Naming: species or category + .fish (salmon.fish) is the mainstream shape; brand word + .fish (fresh.fish) suits restaurant and shop main sites.",
      bestFor: ["Seafood restaurants & fish-market e-commerce", "Aquarium & ornamental fish communities", "Fisheries & aquaculture companies", "Marine conservation & education sites"],
      namingTips: [
        "Species or category + .fish says the trade in four letters",
        "About $8 year one, $36/yr renewal — budget on the renewal",
        "The category fits .fish; the pastime .fishing; the venue .restaurant",
        "Fresh seafood runs on cold chain — ship fulfillment pages alongside",
      ],
    },
  },
  fan: {
    tld: "fan",
    zh: {
      title: ".fan 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".fan 是粉丝身份的专属后缀，适合球迷与追星应援站、创作者粉丝社区与会员站、粉丝周边与应援物电商、影视游戏同好内容站。查看 .fan 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .fan 域名。",
      intro:
        ".fan 把「我是粉丝」写进域名：球迷与追星应援站、创作者粉丝社区与会员站、粉丝周边与应援物电商、影视游戏同好内容站用 name.fan，身份属性一词讲透——粉丝经济是内容产业最有付费力的圈层，name.fan 读起来就是「某某的粉丝」，主语加后缀天然成句。它与已收录的 .club/.social/.live 分工清晰：.club 说组织，.social 说社交产品，.live 说直播，.fan 直指粉丝这个身份——应援站与同好社区用它定位最准，三个字母也够短。注册局为 Identity Digital（原 Rightside/Donuts 组合）。价格是典型首年促销结构：首年约 $7（约 ¥48），续费约 $44/年（约 ¥315）——续费涨幅明显，按续费价做长期预算。库存极好：偶像名、球队词、圈层词全线有货。注意两点：一是明星与球队名多为注册商标，应援站标明非官方并避免商用侵权；二是 .fans 复数后缀同场竞争，主站选定一个、另一个做保护性注册更稳。命名上「偶像/球队 + .fan」（arsenal.fan）最主流，「圈层词 + .fan」（kpop.fan）适合社区与内容站。",
      bestFor: ["球迷与追星应援站", "创作者粉丝社区与会员站", "粉丝周边与应援物电商", "影视游戏同好内容站"],
      namingTips: [
        "「偶像/球队 + .fan」主语加后缀天然成句",
        "首年约 $7、续费约 $44/年，按续费价做预算",
        "粉丝身份用 .fan，组织用 .club，直播用 .live",
        "明星与球队名多为商标，应援站标明非官方",
      ],
    },
    en: {
      title: ".fan Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".fan is the dedicated suffix for fandom — for sports and celebrity fan sites, creator fan communities and membership sites, fan merch and supporter-gear e-commerce, film and gaming fandom content. See live pricing and naming advice, then hunt available .fan names with AI.",
      intro:
        ".fan writes \"I'm a fan\" into the address: sports and celebrity fan sites, creator fan communities and membership sites, fan merch shops, and film or gaming fandom content on name.fan say the identity in one word — fandom is the highest-paying tier of the content economy, and name.fan reads as a natural sentence: subject plus suffix equals \"fan of X\". It divides labor cleanly with the already-listed .club, .social and .live: .club names the organization, .social names the social product, .live names the stream — .fan names the identity itself, so supporter sites and fandom communities position sharpest here, and three letters keeps it short. The registry is Identity Digital (from the former Rightside/Donuts portfolio). Pricing follows the classic promo structure: about $7 first year (≈¥48) and $44/yr to renew (≈¥315) — a steep renewal step, so budget on the renewal. Inventory is excellent: idol names, team words and fandom words all hit. Two cautions: celebrity and team names are registered trademarks, so label fan sites unofficial and avoid commercial infringement; and the plural .fans competes in the same lane — pick one as the main site and defensively register the other. Naming: idol or team + .fan (arsenal.fan) is the mainstream shape; fandom word + .fan (kpop.fan) suits communities and content sites.",
      bestFor: ["Sports & celebrity fan sites", "Creator fan communities & membership sites", "Fan merch & supporter-gear e-commerce", "Film & gaming fandom content"],
      namingTips: [
        "Idol or team + .fan reads as a natural sentence",
        "About $7 year one, $44/yr renewal — budget on the renewal",
        "The identity fits .fan; the org fits .club; the stream fits .live",
        "Celebrity and team names are trademarks — label fan sites unofficial",
      ],
    },
  },
  win: {
    tld: "win",
    zh: {
      title: ".win 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".win 是「赢」的通用后缀，适合竞赛与抽奖活动页、电竞战队与赛事平台、增长营销与转化落地页、竞技预测与积分工具站。查看 .win 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .win 域名。",
      intro:
        ".win 把「赢」喊进域名：竞赛与抽奖活动页、电竞战队与赛事平台、增长营销与转化落地页、竞技预测与积分工具站用 name.win，动词属性一词讲透——win 是英语里最短的胜利动词，name.win 读起来就是一句口号，做活动页与转化页天然带情绪。它与已收录的 .bet/.games/.promo 分工清晰：.bet 说下注，.games 说游戏产品，.promo 说促销，.win 直指赢这个结果——竞赛、抽奖、电竞夺冠叙事用它定位最准。注册局为 Team Internet（GRS Domains，原 Famous Four 组合）。价格是全站便宜档：首年约 $5（约 ¥33），续费约 $6/年（约 ¥41）——注册续费都便宜，做活动页矩阵毫无压力。库存极好：动词短语、品牌词、赛事词全线有货。注意两点：一是低价后缀历史上招过垃圾注册，个别邮件网关与企业防火墙对 .win 较严格，重要业务配 SPF/DKIM 并测试送达；二是涉及有奖竞赛在多数辖区受抽奖法规约束，规则页与合规声明一起备好。命名上「动词短语 + .win」（spin2.win）最主流，「品牌/战队 + .win」（apex.win）适合电竞与赛事平台。",
      bestFor: ["竞赛与抽奖活动页", "电竞战队与赛事平台", "增长营销与转化落地页", "竞技预测与积分工具站"],
      namingTips: [
        "「品牌 + .win」整个域名读起来就是一句口号",
        "首年约 $5、续费约 $6/年，全站便宜档做矩阵无压力",
        "赢的结果用 .win，下注用 .bet，游戏产品用 .games",
        "有奖竞赛受抽奖法规约束，规则页与合规声明备好",
      ],
    },
    en: {
      title: ".win Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".win is the generic suffix for winning — for contests and giveaway campaign pages, esports teams and tournament platforms, growth marketing and conversion landing pages, prediction and leaderboard tools. See live pricing and naming advice, then hunt available .win names with AI.",
      intro:
        ".win shouts victory in the address: contests and giveaway campaign pages, esports teams and tournament platforms, growth marketing landing pages, and prediction or leaderboard tools on name.win say the outcome in one word — win is English's shortest victory verb, so name.win reads as a slogan, which makes campaign and conversion pages land with built-in emotion. It divides labor cleanly with the already-listed .bet, .games and .promo: .bet names the wager, .games names the product, .promo names the discount — .win names the result, so contests, giveaways and championship narratives position sharpest here. The registry is Team Internet (GRS Domains, from the former Famous Four portfolio). Pricing sits in the bargain tier: about $5 first year (≈¥33) and $6/yr to renew (≈¥41) — cheap both ways, so campaign-page portfolios cost almost nothing. Inventory is excellent: verb phrases, brand words and tournament words all hit. Two cautions: bargain suffixes drew spam registrations historically, so some mail gateways and corporate firewalls treat .win strictly — configure SPF/DKIM and test deliverability for serious use; and prize contests fall under sweepstakes law in most jurisdictions, so ship rules and compliance pages alongside. Naming: verb phrase + .win (spin2.win) is the mainstream shape; brand or team + .win (apex.win) suits esports and tournament platforms.",
      bestFor: ["Contests & giveaway campaign pages", "Esports teams & tournament platforms", "Growth marketing & conversion landing pages", "Prediction & leaderboard tools"],
      namingTips: [
        "Brand + .win makes the whole domain read as a slogan",
        "About $5 year one, $6/yr renewal — bargain tier for portfolios",
        "The result fits .win; the wager fits .bet; the product fits .games",
        "Prize contests fall under sweepstakes law — ship rules pages alongside",
      ],
    },
  },
  wang: {
    tld: "wang",
    zh: {
      title: ".wang 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".wang 是拼音「网/王」的中文市场后缀，适合面向中文用户的网站与工具站、国货品牌与淘系店铺独立站、个人姓氏王的品牌站、下沉市场推广落地页。查看 .wang 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .wang 域名。",
      intro:
        ".wang 把「网」念进域名：面向中文用户的网站与工具站、国货品牌与电商独立站、姓氏为王的个人品牌站、下沉市场推广落地页用 name.wang，中文语感一词讲透——wang 是「网」与「王」的拼音，中文用户听到域名就能拼出来，口头传播零成本，这是拉丁字母后缀里少见的「说中文」的域名。注册局为黄道科技（Zodiac Wang Limited），是最早一批面向中文市场的新顶级域，已通过工信部备案资质，可在境内合规建站。它与已收录的 .cn/.top 分工清晰：.cn 说国别，.top 说通用，.wang 直指「网站」这个词——想让中文用户一听就懂的项目用它定位最准。价格是全站便宜档：首年约 $4（约 ¥30），续费约 $6/年（约 ¥44）——注册续费都便宜，做站群与落地页矩阵毫无压力。库存极好：行业词、拼音词、姓氏组合全线有货。注意两点：一是境内解析建站需完成 ICP 备案与实名认证，面向海外用户则无此要求；二是英文语境里 wang 无含义且有俚语歧义，出海项目慎用。命名上「拼音/行业词 + .wang」（zhuangxiu.wang）最主流，「姓氏/品牌 + .wang」（laowang.wang）适合个人品牌与自媒体。",
      bestFor: ["面向中文用户的网站与工具站", "国货品牌与电商独立站", "姓氏为王的个人品牌站", "下沉市场推广落地页"],
      namingTips: [
        "「拼音/行业词 + .wang」中文用户一听就能拼出来",
        "首年约 $4、续费约 $6/年，站群矩阵无压力",
        "说中文的网站用 .wang，国别背书用 .cn，通用便宜用 .top",
        "境内解析需 ICP 备案与实名认证，海外解析无此要求",
      ],
    },
    en: {
      title: ".wang Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".wang is the Chinese-market suffix from the pinyin for “web/king” — for Chinese-language sites and tools, domestic brands and e-commerce stores, personal brands with the surname Wang, and campaign landing pages. See live pricing and naming advice, then hunt available .wang names with AI.",
      intro:
        ".wang speaks Chinese in the address: Chinese-language sites and tool stations, domestic brands and e-commerce stores, personal brands carrying the surname Wang, and mass-market campaign pages on name.wang say it in the audience's own sound — wang is the pinyin for both 网 (web) and 王 (king), so Chinese users can spell the domain the moment they hear it, making word-of-mouth free — a rare Latin-letter suffix that literally speaks Chinese. The registry is Zodiac Wang Limited, one of the earliest new gTLDs built for the Chinese market, with MIIT accreditation for compliant hosting in mainland China. It divides labor cleanly with the already-listed .cn and .top: .cn names the country, .top names the generic tier — .wang names the word for website itself, so projects that want instant recognition from Chinese speakers position sharpest here. Pricing sits in the bargain tier: about $4 first year (≈¥30) and $6/yr to renew (≈¥44) — cheap both ways, so site networks and landing-page portfolios cost almost nothing. Inventory is excellent: industry words, pinyin words and surname combos all hit. Two cautions: hosting inside mainland China requires ICP filing and real-name verification (overseas hosting doesn't); and wang means nothing in English and carries slang ambiguity, so export-facing projects should think twice. Naming: pinyin or industry word + .wang (zhuangxiu.wang) is the mainstream shape; surname or brand + .wang (laowang.wang) suits personal brands and creators.",
      bestFor: ["Chinese-language sites & tool stations", "Domestic brands & e-commerce stores", "Personal brands with the surname Wang", "Mass-market campaign landing pages"],
      namingTips: [
        "Pinyin or industry word + .wang spells itself to Chinese users",
        "About $4 year one, $6/yr renewal — bargain tier for portfolios",
        "Chinese-speaking sites fit .wang; country backing .cn; generic .top",
        "Mainland hosting needs ICP filing — overseas hosting doesn't",
      ],
    },
  },
  day: {
    tld: "day",
    zh: {
      title: ".day 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".day 是 Google 注册局的「日子」后缀，适合节日与纪念日活动站、婚礼与生日邀请页、每日打卡与习惯养成应用、日更内容与日历工具站。查看 .day 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .day 域名。",
      intro:
        ".day 把日子过进域名：节日与纪念日活动站、婚礼与生日邀请页、每日打卡与习惯养成应用、日更内容与日历工具站用 name.day，时间属性一词讲透——name.day 读起来就是「某某日」，做活动页与邀请页天然成句（wedding.day、demo.day），这是少见的「自带语法」的后缀。注册局为 Google（Charleston Road Registry），与 .app/.dev/.page 同门，整个后缀已列入 HSTS 预加载名单——浏览器强制 HTTPS，必须配证书才能访问，换来全站默认加密的安全背书。它与已收录的 .today/.events 分工清晰：.today 说「今天」的新闻感，.events 说活动业态，.day 直指「日子」这个词——纪念日、主题日、打卡日历用它定位最准。价格是少见的平价结构：首年约 $11（约 ¥78），续费约 $11/年（约 ¥78）——注册续费同价，没有首年促销陷阱，预算恒定好算。库存极好：节日词、动词短语、品牌词全线有货。注意两点：一是 HTTPS 强制意味着裸 HTTP 无法打开，托管平台需支持自动证书；二是三个字母够短但语义偏轻，严肃企业主站配 .com 更稳。命名上「场景词 + .day」（wedding.day）最主流，「品牌/动词 + .day」（plan.day）适合工具与应用。",
      bestFor: ["节日与纪念日活动站", "婚礼与生日邀请页", "每日打卡与习惯养成应用", "日更内容与日历工具站"],
      namingTips: [
        "「场景词 + .day」整个域名读起来就是「某某日」",
        "注册续费同价约 $11/年，预算恒定没有促销陷阱",
        "日子场景用 .day，今天新闻感用 .today，活动业态用 .events",
        "Google 后缀强制 HTTPS，托管需支持自动证书",
      ],
    },
    en: {
      title: ".day Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".day is Google Registry's suffix for days — for holiday and anniversary event sites, wedding and birthday invitation pages, daily habit and streak apps, daily content and calendar tools. See live pricing and naming advice, then hunt available .day names with AI.",
      intro:
        ".day writes the calendar into the address: holiday and anniversary event sites, wedding and birthday invitation pages, daily habit and streak apps, and daily content or calendar tools on name.day say the occasion in one word — name.day reads as \"X day\", so event and invitation pages form natural sentences (wedding.day, demo.day), a rare suffix with grammar built in. The registry is Google (Charleston Road Registry), sibling to .app, .dev and .page, and the whole TLD sits on the HSTS preload list — browsers force HTTPS, so a certificate is mandatory, in exchange for encrypted-by-default security backing. It divides labor cleanly with the already-listed .today and .events: .today carries the news-flash feel, .events names the business — .day names the day itself, so anniversaries, theme days and streak calendars position sharpest here. Pricing is refreshingly flat: about $11 first year (≈¥78) and $11/yr to renew (≈¥78) — register and renew cost the same, no promo trap, so budgets stay constant. Inventory is excellent: holiday words, verb phrases and brand words all hit. Two cautions: forced HTTPS means plain HTTP won't load, so hosting must support automatic certificates; and three letters is short but semantically light — serious corporate main sites should pair it with a .com. Naming: occasion word + .day (wedding.day) is the mainstream shape; brand or verb + .day (plan.day) suits tools and apps.",
      bestFor: ["Holiday & anniversary event sites", "Wedding & birthday invitation pages", "Daily habit & streak apps", "Daily content & calendar tools"],
      namingTips: [
        "Occasion word + .day makes the domain read as \"X day\"",
        "About $11/yr flat to register and renew — no promo trap",
        "Days fit .day; the news-flash feel .today; the business .events",
        "Google TLDs force HTTPS — hosting must support auto certificates",
      ],
    },
  },
  meme: {
    tld: "meme",
    zh: {
      title: ".meme 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".meme 是 Google 注册局的梗文化后缀，适合梗图与表情包社区、迷因币与加密社区项目、玩梗营销活动页、创作者搞笑内容站。查看 .meme 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .meme 域名。",
      intro:
        ".meme 把梗玩进域名：梗图与表情包社区、迷因币与加密社区项目、玩梗营销活动页、创作者搞笑内容站用 name.meme，文化属性一词讲透——meme 是互联网原生词汇，看到后缀就知道内容基调，自嘲与玩梗的姿态先立住，这是品牌「会玩」的信号。注册局为 Google（Charleston Road Registry），2023 年开放注册，与 .day 同样列入 HSTS 预加载名单——浏览器强制 HTTPS，必须配证书。它与已收录的 .lol/.wtf/.moe 分工清晰：.lol 说大笑，.wtf 说吐槽，.moe 说二次元萌系，.meme 直指梗本身——梗图站、迷因币、病毒营销用它定位最准。价格是少见的平价结构：首年约 $11（约 ¥78），续费约 $11/年（约 ¥78）——注册续费同价，没有促销陷阱。库存极好：梗词、动物词、加密圈词全线有货。注意两点：一是迷因币项目良莠不齐，个别安全网关对 .meme 链接较敏感，正经项目备好品牌与合规页自证；二是梗有生命周期，追热点梗的域名过气快，主站选长青词更稳。命名上「梗词 + .meme」（doge.meme）最主流，「品牌/社区 + .meme」（dank.meme）适合社区与内容站。",
      bestFor: ["梗图与表情包社区", "迷因币与加密社区项目", "玩梗营销活动页", "创作者搞笑内容站"],
      namingTips: [
        "「梗词 + .meme」后缀先把内容基调立住",
        "注册续费同价约 $11/年，预算恒定没有促销陷阱",
        "梗本身用 .meme，大笑用 .lol，吐槽用 .wtf，萌系用 .moe",
        "追热点的梗过气快，主站选长青词更稳",
      ],
    },
    en: {
      title: ".meme Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".meme is Google Registry's suffix for internet culture — for meme and reaction-image communities, memecoin and crypto community projects, meme-driven marketing campaigns, and creator comedy content sites. See live pricing and naming advice, then hunt available .meme names with AI.",
      intro:
        ".meme plays the joke in the address itself: meme and reaction-image communities, memecoin and crypto community projects, meme-driven marketing campaigns, and creator comedy sites on name.meme say the culture in one word — meme is internet-native vocabulary, so the suffix alone sets the tone and signals a brand that's in on the joke. The registry is Google (Charleston Road Registry), opened in 2023, and like .day it sits on the HSTS preload list — browsers force HTTPS, so a certificate is mandatory. It divides labor cleanly with the already-listed .lol, .wtf and .moe: .lol names the laugh, .wtf names the rant, .moe names anime cuteness — .meme names the meme itself, so meme sites, memecoins and viral campaigns position sharpest here. Pricing is refreshingly flat: about $11 first year (≈¥78) and $11/yr to renew (≈¥78) — same both ways, no promo trap. Inventory is excellent: meme words, animal words and crypto-circle words all hit. Two cautions: memecoin projects vary wildly in quality, so some security gateways treat .meme links warily — serious projects should ship brand and compliance pages to self-certify; and memes have life cycles — trend-chasing names age fast, so pick evergreen words for the main site. Naming: meme word + .meme (doge.meme) is the mainstream shape; brand or community + .meme (dank.meme) suits communities and content sites.",
      bestFor: ["Meme & reaction-image communities", "Memecoin & crypto community projects", "Meme-driven marketing campaigns", "Creator comedy content sites"],
      namingTips: [
        "Meme word + .meme sets the tone from the suffix alone",
        "About $11/yr flat to register and renew — no promo trap",
        "The meme fits .meme; the laugh .lol; the rant .wtf; cuteness .moe",
        "Trend memes age fast — pick evergreen words for the main site",
      ],
    },
  },
  quest: {
    tld: "quest",
    zh: {
      title: ".quest 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".quest 是「探索/任务」后缀，适合游戏任务与攻略社区、密室逃脱与解谜活动、学习闯关与技能挑战平台、探险旅行与寻宝项目。查看 .quest 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .quest 域名。",
      intro:
        ".quest 把冒险写进域名：游戏任务与攻略社区、密室逃脱与解谜活动、学习闯关与技能挑战平台、探险旅行与寻宝项目用 name.quest，叙事属性一词讲透——quest 是 RPG 游戏与奇幻文学的核心词汇，name.quest 读起来就是「某某的冒险」，做游戏化产品自带故事感。注册局为 XYZ（.xyz 同门），开放注册无资质限制。它与已收录的 .games/.fun/.run 分工清晰：.games 说游戏产品，.fun 说好玩，.run 说跑起来，.quest 直指任务与探索这个过程——闯关、挑战、寻宝叙事用它定位最准。价格是典型首年促销结构：首年约 $2（约 ¥11），续费约 $13/年（约 ¥93）——首年全站最便宜档之一，续费也不贵，试错成本极低。库存极好：动词短语、奇幻词、品牌词全线有货。注意两点：一是 Meta 的 VR 头显产品线同名 Quest，做 VR 相关内容避免用 meta、vr 等组合暗示官方关联；二是 quest 对非游戏用户偏陌生，大众消费品牌配个直白域名跳转更稳。命名上「主题词 + .quest」（dragon.quest 类）最主流，「品牌/动词 + .quest」（learn.quest）适合教育与挑战平台。",
      bestFor: ["游戏任务与攻略社区", "密室逃脱与解谜活动", "学习闯关与技能挑战平台", "探险旅行与寻宝项目"],
      namingTips: [
        "「主题词 + .quest」整个域名读起来就是一段冒险",
        "首年约 $2、续费约 $13/年，试错成本极低",
        "任务探索用 .quest，游戏产品用 .games，跑步用 .run",
        "Meta 头显同名 Quest，VR 内容避免暗示官方关联",
      ],
    },
    en: {
      title: ".quest Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".quest is the suffix for adventure and missions — for game quest and walkthrough communities, escape rooms and puzzle events, gamified learning and skill-challenge platforms, adventure travel and treasure hunts. See live pricing and naming advice, then hunt available .quest names with AI.",
      intro:
        ".quest writes the adventure into the address: game quest and walkthrough communities, escape rooms and puzzle events, gamified learning and skill-challenge platforms, and adventure travel or treasure-hunt projects on name.quest say the journey in one word — quest is core vocabulary of RPGs and fantasy fiction, so name.quest reads as \"the quest for X\", giving gamified products a built-in story. The registry is XYZ (of .xyz fame), with open registration and no eligibility rules. It divides labor cleanly with the already-listed .games, .fun and .run: .games names the product, .fun names the vibe, .run names the motion — .quest names the mission itself, so challenges, level-ups and treasure-hunt narratives position sharpest here. Pricing follows the classic promo structure: about $2 first year (≈¥11) and $13/yr to renew (≈¥93) — one of the cheapest first years on the site and renewal stays modest, so experiments cost almost nothing. Inventory is excellent: verb phrases, fantasy words and brand words all hit. Two cautions: Meta's VR headset line shares the Quest name, so VR-adjacent content should avoid combos like meta or vr that imply official ties; and quest reads niche to non-gamers, so mass-market brands may pair it with a plainer redirect domain. Naming: theme word + .quest (dragon.quest style) is the mainstream shape; brand or verb + .quest (learn.quest) suits education and challenge platforms.",
      bestFor: ["Game quest & walkthrough communities", "Escape rooms & puzzle events", "Gamified learning & skill-challenge platforms", "Adventure travel & treasure hunts"],
      namingTips: [
        "Theme word + .quest makes the domain read as an adventure",
        "About $2 year one, $13/yr renewal — experiments cost almost nothing",
        "The mission fits .quest; the product .games; the motion .run",
        "Meta's headset is named Quest — avoid implying official VR ties",
      ],
    },
  },
  kids: {
    tld: "kids",
    zh: {
      title: ".kids 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".kids 是儿童友好内容的专属后缀，适合儿童教育与启蒙内容站、童装玩具与母婴电商、少儿兴趣班与夏令营、亲子活动与家庭游乐项目。查看 .kids 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .kids 域名。",
      intro:
        ".kids 把儿童友好写进域名：儿童教育与启蒙内容站、童装玩具与母婴电商、少儿兴趣班与夏令营、亲子活动与家庭游乐项目用 name.kids，受众属性一词讲透——后缀本身就是「适合孩子」的承诺，家长看到 .kids 就知道内容面向儿童，信任感先建立。注册局为香港非营利机构 DotKids Foundation，是新顶级域里少见的「带内容公约」后缀：注册即承诺内容儿童友好，注册局可对有害内容投诉处置——这层治理正是它的信任来源。它与已收录的 .baby/.mom/.dad/.toys 分工清晰：.baby 说婴幼儿，.mom/.dad 说家长视角，.toys 说玩具品类，.kids 直指儿童受众整体——K12 内容、童装、少儿培训用它定位最准。价格是典型首年促销结构：首年约 $6（约 ¥41），续费约 $19/年（约 ¥137）——按续费价做长期预算。库存极好：教育词、活动词、品牌词全线有货。注意两点：一是内容公约意味着成人内容与打擦边球都可能被投诉下线，混合受众平台把儿童板块单独放 .kids 更稳；二是多数辖区对儿童数据有专门法规（如 COPPA），收集用户数据前把合规做足。命名上「品类词 + .kids」（coding.kids）最主流，「品牌词 + .kids」（happy.kids）适合机构与电商主站。",
      bestFor: ["儿童教育与启蒙内容站", "童装玩具与母婴电商", "少儿兴趣班与夏令营", "亲子活动与家庭游乐项目"],
      namingTips: [
        "「品类词 + .kids」家长一眼确认内容面向儿童",
        "首年约 $6、续费约 $19/年，按续费价做预算",
        "儿童受众用 .kids，婴幼儿用 .baby，玩具品类用 .toys",
        "儿童数据受 COPPA 类法规约束，合规先行",
      ],
    },
    en: {
      title: ".kids Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".kids is the dedicated suffix for child-friendly content — for children's education and early-learning sites, kidswear and toy e-commerce, kids' classes and summer camps, family activities and play venues. See live pricing and naming advice, then hunt available .kids names with AI.",
      intro:
        ".kids writes child-friendly into the address: children's education and early-learning sites, kidswear and toy e-commerce, kids' classes and summer camps, and family activity or play venues on name.kids say the audience in one word — the suffix itself is a promise that the content suits children, so parents trust the address before the page loads. The registry is DotKids Foundation, a Hong Kong nonprofit, and this is a rare new gTLD with a content pledge: registering means committing to child-friendly content, and the registry can act on complaints about harmful material — that governance is exactly where the trust comes from. It divides labor cleanly with the already-listed .baby, .mom, .dad and .toys: .baby names infancy, .mom and .dad name the parent's view, .toys names the product category — .kids names the child audience as a whole, so K-12 content, kidswear and children's training position sharpest here. Pricing follows the classic promo structure: about $6 first year (≈¥41) and $19/yr to renew (≈¥137) — budget on the renewal. Inventory is excellent: education words, activity words and brand words all hit. Two cautions: the content pledge means adult or borderline material can be taken down on complaint, so mixed-audience platforms should put only the children's section on .kids; and most jurisdictions regulate children's data specifically (COPPA and kin), so get compliance right before collecting anything. Naming: category word + .kids (coding.kids) is the mainstream shape; brand word + .kids (happy.kids) suits institutions and shop main sites.",
      bestFor: ["Children's education & early-learning sites", "Kidswear & toy e-commerce", "Kids' classes & summer camps", "Family activities & play venues"],
      namingTips: [
        "Category word + .kids tells parents the audience at a glance",
        "About $6 year one, $19/yr renewal — budget on the renewal",
        "The child audience fits .kids; infancy .baby; the products .toys",
        "Children's data falls under COPPA-style law — compliance first",
      ],
    },
  },
  foundation: {
    tld: "foundation",
    zh: {
      title: ".foundation 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".foundation 是基金会与公益组织的专属后缀，适合公益基金会与慈善组织、开源项目基金会、企业社会责任与捐赠页、社区互助与奖学金项目。查看 .foundation 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .foundation 域名。",
      intro:
        ".foundation 把使命写进域名：公益基金会与慈善组织、开源项目基金会、企业社会责任与捐赠页、社区互助与奖学金项目用 name.foundation，机构属性一词讲透——foundation 就是「基金会」的英文全称，name.foundation 读起来就是机构全名，捐赠人看到域名即确认对象，这是公益场景里最直白的信任信号。注册局为 Public Interest Registry（PIR）——运营 .org 三十年的非营利注册局，2023 年把 .foundation/.charity/.gives/.giving 收入同一公益序列，背书与 .org 同源。它与已收录的 .org/.fund/.community 分工清晰：.org 说泛非营利，.fund 说资金池，.community 说社群，.foundation 直指基金会这个机构形态——挂「XX 基金会」名号的组织用它定位最准。价格是典型首年促销结构：首年约 $6（约 ¥43），续费约 $23/年（约 ¥163）——按续费价做长期预算。库存极好：姓氏词、使命词、开源项目名全线有货。注意两点：一是十个字母偏长，宣传物料配短域名跳转更顺；二是「基金会」在部分辖区是受监管的法律实体名称，未注册实体前用 project 类措辞更稳。命名上「姓名/品牌 + .foundation」（gates.foundation 类）最主流，「使命词 + .foundation」（ocean.foundation）适合议题型组织。",
      bestFor: ["公益基金会与慈善组织", "开源项目基金会", "企业社会责任与捐赠页", "社区互助与奖学金项目"],
      namingTips: [
        "「姓名/品牌 + .foundation」域名读起来就是机构全名",
        "首年约 $6、续费约 $23/年，按续费价做预算",
        "基金会形态用 .foundation，泛非营利用 .org，资金池用 .fund",
        "「基金会」在部分辖区是受监管名称，注册实体后再启用",
      ],
    },
    en: {
      title: ".foundation Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".foundation is the dedicated suffix for foundations and philanthropy — for charitable foundations and nonprofits, open-source project foundations, corporate social responsibility and donation pages, community aid and scholarship programs. See live pricing and naming advice, then hunt available .foundation names with AI.",
      intro:
        ".foundation writes the mission into the address: charitable foundations and nonprofits, open-source project foundations, corporate social responsibility and donation pages, and community aid or scholarship programs on name.foundation say the institution in one word — foundation is the full institutional noun, so name.foundation reads as the organization's complete name and donors confirm who they're giving to from the address alone, the plainest trust signal in philanthropy. The registry is Public Interest Registry (PIR) — the nonprofit that has run .org for decades, which brought .foundation, .charity, .gives and .giving into the same public-interest family in 2023, so the backing shares .org's pedigree. It divides labor cleanly with the already-listed .org, .fund and .community: .org names nonprofits at large, .fund names the pool of money, .community names the group — .foundation names the institutional form itself, so organizations carrying \"Foundation\" in their name position sharpest here. Pricing follows the classic promo structure: about $6 first year (≈¥43) and $23/yr to renew (≈¥163) — budget on the renewal. Inventory is excellent: surname words, mission words and open-source project names all hit. Two cautions: ten letters is long, so print materials may pair it with a short redirect; and \"foundation\" is a regulated legal-entity name in some jurisdictions, so use project-style wording until the entity is registered. Naming: name or brand + .foundation (gates.foundation style) is the mainstream shape; mission word + .foundation (ocean.foundation) suits cause-driven organizations.",
      bestFor: ["Charitable foundations & nonprofits", "Open-source project foundations", "CSR & donation pages", "Community aid & scholarship programs"],
      namingTips: [
        "Name or brand + .foundation reads as the org's full name",
        "About $6 year one, $23/yr renewal — budget on the renewal",
        "The institution fits .foundation; nonprofits .org; the pool .fund",
        "A regulated entity name in some places — register the entity first",
      ],
    },
  },
  bond: {
    tld: "bond",
    zh: {
      title: ".bond 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".bond 是「纽带/债券」的双关后缀，适合信任型服务与客户关系品牌、债券与固定收益理财内容站、会员社群与校友联结站、婚恋与情感陪伴类产品。查看 .bond 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .bond 域名。",
      intro:
        ".bond 把关系写进域名：信任型服务与客户关系品牌、债券与固定收益理财内容站、会员社群与校友联结站、婚恋与情感陪伴类产品用 name.bond，一词双关讲透定位——bond 既是金融里的「债券」，也是人与人之间的「纽带」，同一个后缀能同时服务理财站与关系型品牌，是少见的「一词两吃」后缀。注册局为 ShortDot SA（卢森堡），与 .icu/.cyou/.sbs 同门，走的是低价走量路线，域名解析与注册商覆盖成熟。它与已收录的 .finance/.money/.community 分工清晰：.finance 说行业，.money 说钱本身，.community 说群体——.bond 说的是「连接」这件事，做信任叙事与关系型产品定位最准。价格是典型促销结构：首年约 $1（约 ¥10），续费约 $16/年（约 ¥115）——首年几乎白送，务必按续费价做多年预算。库存极好：关系词、金融词、品牌词全线有货。注意两点：一是首年与续费差十倍以上，批量注册前先算三年总成本；二是英文里 bail bond（保释金）语义邻近，法律相关项目起名时留意联想。命名上「品牌 + .bond」（acme.bond）最主流，「关系词 + .bond」（team.bond）适合社群与会员站。",
      bestFor: ["信任型服务与客户关系品牌", "债券与固定收益理财内容站", "会员社群与校友联结站", "婚恋与情感陪伴类产品"],
      namingTips: [
        "「品牌 + .bond」把「与用户建立连接」写进域名",
        "首年约 $1、续费约 $16/年，按续费价算三年总成本",
        "连接叙事用 .bond，金融行业用 .finance，群体用 .community",
        "英文里与 bail bond（保释金）语义邻近，法律项目留意联想",
      ],
    },
    en: {
      title: ".bond Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".bond is the double-meaning suffix for ties and bonds — for trust-driven services and customer-relationship brands, bond and fixed-income finance content, membership and alumni communities, and dating or companionship products. See live pricing and naming advice, then hunt available .bond names with AI.",
      intro:
        ".bond writes the relationship into the address: trust-driven services and customer-relationship brands, bond and fixed-income finance content, membership and alumni communities, and dating or companionship products on name.bond say the positioning in one pun — bond is both the financial instrument and the human tie, so a single suffix serves an investing site and a relationship brand equally well, a rare two-for-one word. The registry is ShortDot SA of Luxembourg, sibling to .icu, .cyou and .sbs, running a high-volume low-price playbook with mature registrar and DNS coverage. It divides labor cleanly with the already-listed .finance, .money and .community: .finance names the industry, .money names the cash, .community names the group — .bond names the act of connecting, so trust narratives and relationship products position sharpest here. Pricing is the classic promo shape: about $1 first year (≈¥10) and $16/yr to renew (≈¥115) — year one is nearly free, so budget multi-year on the renewal. Inventory is excellent: relationship words, finance words and brand words all hit. Two cautions: renewal is more than ten times year one, so price three years before bulk-registering; and \"bail bond\" sits close in English, worth noting for law-adjacent projects. Naming: brand + .bond (acme.bond) is the mainstream shape; relationship word + .bond (team.bond) suits communities and membership sites.",
      bestFor: ["Trust-driven services & CRM brands", "Bond & fixed-income finance content", "Membership & alumni communities", "Dating & companionship products"],
      namingTips: [
        "Brand + .bond writes \"we connect with users\" into the address",
        "About $1 year one, $16/yr renewal — price three years first",
        "Connection fits .bond; the industry .finance; the group .community",
        "\"Bail bond\" is semantically close in English — mind law projects",
      ],
    },
  },
  sbs: {
    tld: "sbs",
    zh: {
      title: ".sbs 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".sbs 是 side-by-side 的缩写后缀，适合三字母品牌缩写站、企业服务与咨询公司官网、活动与快闪推广落地页、低成本站群与测试项目。查看 .sbs 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .sbs 域名。",
      intro:
        ".sbs 用三个字母收尾：三字母品牌缩写站、企业服务与咨询公司官网、活动与快闪推广落地页、低成本站群与测试项目用 name.sbs，短而中性——sbs 官方解读为 side by side（并肩），本身不携带行业含义，正因为「空白」，任何缩写型品牌都能把自己的解释填进去，这是通用后缀里少见的自由度。注册局为 ShortDot SA（卢森堡），与 .icu/.bond/.cyou 同门，最初面向企业服务场景推广，如今以低价通用后缀定位。它与已收录的 .biz/.company/.pro 分工清晰：.biz 说商业属性，.company 说公司形态，.pro 说专业身份——.sbs 不预设含义，适合把语义留给品牌自己的项目。价格是典型促销结构：首年约 $2（约 ¥11），续费约 $16/年（约 ¥115）——首年成本极低，适合先占后验证的项目。库存极好：短词、缩写、行业词全线有货。注意两点：一是三字母后缀在中文语境认知度低，面向大众市场需配合品牌教育；二是低价后缀历史上滥用较多，务必配好 SPF/DKIM 并做好内容质量，避免被邮件与搜索侧牵连。命名上「品牌缩写 + .sbs」（acme.sbs）最主流，「动词/口号 + .sbs」（grow.sbs）适合活动页。",
      bestFor: ["三字母品牌缩写站", "企业服务与咨询公司官网", "活动与快闪推广落地页", "低成本站群与测试项目"],
      namingTips: [
        "「品牌缩写 + .sbs」语义留白，解释权归品牌自己",
        "首年约 $2、续费约 $16/年，适合先占后验证",
        "语义留白用 .sbs，商业属性用 .biz，公司形态用 .company",
        "低价后缀需配好 SPF/DKIM 与内容质量，避免声誉牵连",
      ],
    },
    en: {
      title: ".sbs Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".sbs is the three-letter suffix short for side-by-side — for three-letter brand acronyms, business-service and consulting sites, event and pop-up campaign pages, and low-cost site networks or test projects. See live pricing and naming advice, then hunt available .sbs names with AI.",
      intro:
        ".sbs ends a name in three letters: three-letter brand acronyms, business-service and consulting sites, event and pop-up campaign pages, and low-cost site networks or test projects on name.sbs stay short and neutral — the registry glosses sbs as \"side by side\", and because it carries no industry meaning of its own, any acronym brand can pour its own reading into the blank, a freedom rare among generic suffixes. The registry is ShortDot SA of Luxembourg, sibling to .icu, .bond and .cyou; it launched aimed at business services and now sits as a cheap generic. It divides labor cleanly with the already-listed .biz, .company and .pro: .biz says commerce, .company says corporate form, .pro says professional standing — .sbs presumes nothing, which suits projects that want to define the meaning themselves. Pricing is the classic promo shape: about $2 first year (≈¥11) and $16/yr to renew (≈¥115) — cheap enough to claim a name before validating it. Inventory is excellent: short words, acronyms and industry words all hit. Two cautions: three-letter suffixes have low recognition with Chinese-speaking audiences, so mass-market plays need brand education; and cheap TLDs have a history of abuse, so configure SPF/DKIM and keep content quality high to avoid reputation spillover in email and search. Naming: brand acronym + .sbs (acme.sbs) is the mainstream shape; verb or slogan + .sbs (grow.sbs) suits campaign pages.",
      bestFor: ["Three-letter brand acronyms", "Business-service & consulting sites", "Event & pop-up campaign pages", "Low-cost site networks & test projects"],
      namingTips: [
        "Brand acronym + .sbs leaves the meaning for you to define",
        "About $2 year one, $16/yr renewal — cheap to claim then validate",
        "A blank slate fits .sbs; commerce .biz; corporate form .company",
        "Cheap TLDs need SPF/DKIM and real content to avoid spillover",
      ],
    },
  },
  cyou: {
    tld: "cyou",
    zh: {
      title: ".cyou 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".cyou 是 see you 的谐音后缀，适合面向 Z 世代的内容与社群站、创作者个人主页与约见页、活动邀请与见面会落地页、游戏与二次元同好站。查看 .cyou 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .cyou 域名。",
      intro:
        ".cyou 把一句「回头见」放进域名：面向 Z 世代的内容与社群站、创作者个人主页与约见页、活动邀请与见面会落地页、游戏与二次元同好站用 name.cyou，语气一词讲透——cyou 读作 see you，域名本身就是一句告别与邀约，天生带社交口吻，这在以名词为主的后缀里非常少见。注册局为 ShortDot SA（卢森堡），与 .icu/.bond/.sbs 同门，主打年轻用户与低价走量。它与已收录的 .fun/.social/.chat 分工清晰：.fun 说气氛，.social 说社交属性，.chat 说聊天场景——.cyou 说的是「下次见」的邀约语气，做创作者主页与活动页最贴。价格是典型促销结构：首年约 $2（约 ¥11），续费约 $16/年（约 ¥115）——首年极低，长期按续费价算。库存极好：昵称、动词短语、社群词全线有货。注意两点：一是首年与续费差距大，长期项目别被促销价误导；二是低价后缀被滥用较多，部分企业邮件网关对陌生便宜后缀更敏感，正式业务信函建议另配成熟后缀。命名上「昵称/ID + .cyou」（mika.cyou）最主流，「动词 + .cyou」（meet.cyou）适合活动与邀约页。",
      bestFor: ["面向 Z 世代的内容与社群站", "创作者个人主页与约见页", "活动邀请与见面会落地页", "游戏与二次元同好站"],
      namingTips: [
        "「昵称/ID + .cyou」整个域名读起来就是一句「回头见」",
        "首年约 $2、续费约 $16/年，长期按续费价算",
        "邀约语气用 .cyou，气氛用 .fun，聊天场景用 .chat",
        "正式业务信函建议另配成熟后缀，避免邮件网关误判",
      ],
    },
    en: {
      title: ".cyou Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".cyou is the suffix that sounds like \"see you\" — for Gen-Z content and community sites, creator homepages and meet-up links, event invitation and fan-meet landing pages, and gaming or anime fandom sites. See live pricing and naming advice, then hunt available .cyou names with AI.",
      intro:
        ".cyou puts a goodbye in the address: Gen-Z content and community sites, creator homepages and meet-up links, event invitation and fan-meet landing pages, and gaming or anime fandom sites on name.cyou carry tone in one word — cyou reads as \"see you\", so the domain itself is a farewell and an invitation, a social voice that is rare among mostly-noun suffixes. The registry is ShortDot SA of Luxembourg, sibling to .icu, .bond and .sbs, aimed at younger audiences at volume pricing. It divides labor cleanly with the already-listed .fun, .social and .chat: .fun names the mood, .social names the category, .chat names the activity — .cyou names the \"see you next time\" invitation, which fits creator pages and event pages best. Pricing is the classic promo shape: about $2 first year (≈¥11) and $16/yr to renew (≈¥115) — very cheap up front, so plan on the renewal. Inventory is excellent: handles, verb phrases and community words all hit. Two cautions: the gap between year one and renewal is wide, so long-lived projects shouldn't anchor on the promo; and cheap TLDs see more abuse, with some corporate mail gateways treating unfamiliar bargain suffixes more suspiciously, so keep formal business mail on an established domain. Naming: handle or nickname + .cyou (mika.cyou) is the mainstream shape; verb + .cyou (meet.cyou) suits events and invitations.",
      bestFor: ["Gen-Z content & community sites", "Creator homepages & meet-up links", "Event invitation & fan-meet pages", "Gaming & anime fandom sites"],
      namingTips: [
        "Handle + .cyou makes the whole domain read as \"see you\"",
        "About $2 year one, $16/yr renewal — plan on the renewal",
        "The invitation fits .cyou; the mood .fun; the activity .chat",
        "Keep formal business mail on an established domain",
      ],
    },
  },
  monster: {
    tld: "monster",
    zh: {
      title: ".monster 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".monster 是「怪兽」气质的品牌后缀，适合游戏与怪物题材项目、健身增肌与力量训练品牌、能量饮料与潮流周边电商、恐怖与万圣节内容站。查看 .monster 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .monster 域名。",
      intro:
        ".monster 把张力写进域名：游戏与怪物题材项目、健身增肌与力量训练品牌、能量饮料与潮流周边电商、恐怖与万圣节内容站用 name.monster，气质一词讲透——monster 在英文里既是「怪兽」也是「猛的、极强的」，形容词用法让它天然适合强调力量、夸张与个性的品牌，比中性后缀更有记忆点。注册局为 XYZ.COM LLC（.xyz 的注册局），2019 年从 Monster Worldwide 手中接手后开放通用注册，注册商覆盖广泛。它与已收录的 .games/.fit/.ninja 分工清晰：.games 说品类，.fit 说健身结果，.ninja 说身手——.monster 说的是「猛」这个气质，做张扬型品牌与娱乐内容最合适。价格结构友好：首年约 $2（约 ¥11），续费约 $13/年（约 ¥93）——续费在新顶级域里属于中低档，长期持有成本可控。库存极好：形容词、角色名、品类词全线有货。注意两点：一是词义偏娱乐化，B2B 与金融、医疗等严肃行业慎用；二是七个字母略长，移动端展示与口播时建议配短前缀。命名上「品类/角色 + .monster」（pixel.monster）最主流，「品牌 + .monster」（acme.monster）适合做子品牌与活动站。",
      bestFor: ["游戏与怪物题材项目", "健身增肌与力量训练品牌", "能量饮料与潮流周边电商", "恐怖与万圣节内容站"],
      namingTips: [
        "「品类/角色 + .monster」一眼就有张力与记忆点",
        "首年约 $2、续费约 $13/年，长期持有成本可控",
        "张扬气质用 .monster，品类用 .games，结果用 .fit",
        "词义偏娱乐化，B2B 与严肃行业慎用",
      ],
    },
    en: {
      title: ".monster Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".monster is the suffix with attitude — for gaming and creature-themed projects, strength-training and bodybuilding brands, energy drinks and streetwear merch, and horror or Halloween content sites. See live pricing and naming advice, then hunt available .monster names with AI.",
      intro:
        ".monster writes attitude into the address: gaming and creature-themed projects, strength-training and bodybuilding brands, energy drinks and streetwear merch, and horror or Halloween content on name.monster say the vibe in one word — in English monster is both a creature and an adjective for \"huge, beastly\", and that adjectival reading makes it a natural fit for brands built on power, exaggeration and personality, far stickier than a neutral suffix. The registry is XYZ.COM LLC, the operator behind .xyz, which took the TLD over from Monster Worldwide in 2019 and opened it to general registration with broad registrar coverage. It divides labor cleanly with the already-listed .games, .fit and .ninja: .games names the category, .fit names the result, .ninja names the skill — .monster names sheer intensity, which suits loud brands and entertainment content. Pricing is friendly: about $2 first year (≈¥11) and $13/yr to renew (≈¥93) — a mid-low renewal by new-gTLD standards, so long-term holding stays affordable. Inventory is excellent: adjectives, character names and category words all hit. Two cautions: the word skews playful, so B2B, finance and healthcare should think twice; and seven letters run long, so pair it with a short prefix for mobile display and voice. Naming: category or character + .monster (pixel.monster) is the mainstream shape; brand + .monster (acme.monster) suits sub-brands and campaign sites.",
      bestFor: ["Gaming & creature-themed projects", "Strength-training & bodybuilding brands", "Energy drinks & streetwear merch", "Horror & Halloween content sites"],
      namingTips: [
        "Category or character + .monster lands with instant attitude",
        "About $2 year one, $13/yr renewal — affordable to hold long-term",
        "Intensity fits .monster; the category .games; the result .fit",
        "The word skews playful — B2B and serious industries beware",
      ],
    },
  },
  pics: {
    tld: "pics",
    zh: {
      title: ".pics 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".pics 是图片的口语化后缀，适合摄影作品集与图库站、活动照片分享与相册链接、表情包与素材下载站、图片处理与压缩工具。查看 .pics 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .pics 域名。",
      intro:
        ".pics 把图片说得更口语：摄影作品集与图库站、活动照片分享与相册链接、表情包与素材下载站、图片处理与压缩工具用 name.pics，用途一词讲透——pics 是 pictures 的日常缩写，比正式的 photography 短一半、比 photos 更随口，分享相册链接时读起来自然，这在图片类后缀里是最口语的一个。注册局为 XYZ.COM LLC（.xyz 的注册局），后端解析稳定、注册商覆盖广。它与已收录的 .photos/.photo/.gallery/.photography 分工清晰：.photography 说职业，.gallery 说展陈，.photos/.photo 偏中性名词——.pics 是最随手、最社交的说法，做分享链接与工具站最贴。价格是促销结构：首年约 $2（约 ¥11），续费约 $26/年（约 ¥189）——首年便宜、续费中等偏上，按续费价做预算。库存极好：品类词、活动词、品牌词全线有货。注意两点：一是口语气质偏轻，高端商业摄影主站用 .photography 更显专业；二是图片站带宽成本高，上线前先规划好 CDN 与图片压缩策略。命名上「品牌/活动 + .pics」（wedding.pics）最主流，「动词 + .pics」（share.pics）适合工具与分享服务。",
      bestFor: ["摄影作品集与图库站", "活动照片分享与相册链接", "表情包与素材下载站", "图片处理与压缩工具"],
      namingTips: [
        "「品牌/活动 + .pics」念出来就是「某某的照片」",
        "首年约 $2、续费约 $26/年，按续费价做预算",
        "随手分享用 .pics，职业摄影用 .photography，展陈用 .gallery",
        "图片站带宽成本高，上线前规划好 CDN 与压缩",
      ],
    },
    en: {
      title: ".pics Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".pics is the casual suffix for pictures — for photography portfolios and stock libraries, event photo sharing and album links, meme and asset download sites, and image processing or compression tools. See live pricing and naming advice, then hunt available .pics names with AI.",
      intro:
        ".pics says pictures the way people actually say it: photography portfolios and stock libraries, event photo sharing and album links, meme and asset download sites, and image processing or compression tools on name.pics state the purpose in one word — pics is the everyday shorthand for pictures, half the length of photography and looser than photos, so an album link reads naturally when spoken aloud, the most colloquial option among image suffixes. The registry is XYZ.COM LLC, operator of .xyz, with stable resolution and broad registrar coverage. It divides labor cleanly with the already-listed .photos, .photo, .gallery and .photography: .photography names the profession, .gallery names the exhibition, .photos and .photo stay neutral nouns — .pics is the offhand, social phrasing, best for share links and tools. Pricing follows the promo shape: about $2 first year (≈¥11) and $26/yr to renew (≈¥189) — cheap up front, mid-to-high renewal, so budget on the renewal. Inventory is excellent: category words, event words and brand words all hit. Two cautions: the casual tone reads light, so high-end commercial photography sites look more professional on .photography; and image sites burn bandwidth, so plan a CDN and compression strategy before launch. Naming: brand or event + .pics (wedding.pics) is the mainstream shape; verb + .pics (share.pics) suits tools and sharing services.",
      bestFor: ["Photography portfolios & stock libraries", "Event photo sharing & album links", "Meme & asset download sites", "Image processing & compression tools"],
      namingTips: [
        "Brand or event + .pics reads as \"X's pictures\" out loud",
        "About $2 year one, $26/yr renewal — budget on the renewal",
        "Casual sharing fits .pics; the profession .photography; shows .gallery",
        "Image sites burn bandwidth — plan CDN and compression first",
      ],
    },
  },
  mobi: {
    tld: "mobi",
    zh: {
      title: ".mobi 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".mobi 是移动端的老牌专属后缀，适合移动端专版站与 H5 落地页、App 官网与下载页、移动营销与短链活动页、车载与物联网终端服务。查看 .mobi 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .mobi 域名。",
      intro:
        ".mobi 把「移动」写进域名：移动端专版站与 H5 落地页、App 官网与下载页、移动营销与短链活动页、车载与物联网终端服务用 name.mobi，场景一词讲透——.mobi 是 2005 年由诺基亚、微软、沃达丰等联合发起的移动专用顶级域，也是少数「为一种设备而生」的后缀，二十年过去仍是移动语义最直白的选择。注册局为 Identity Digital（原 Afilias 体系），运营历史长、解析与注册商生态成熟稳定。它与已收录的 .app/.tech/.online 分工清晰：.app 说应用形态，.tech 说技术属性，.online 说在线——.mobi 直指「手机/移动端」这个使用场景，做移动专版与 App 落地页定位最准。价格偏高一档：首年约 $4（约 ¥30），续费约 $42/年（约 ¥300）——续费明显高于新顶级域均值，长期持有前先确认预算。库存尚可：早期抢注热潮留下不少已注册域名，但组合词与长尾词仍有大量空间。注意两点：一是早年注册局曾要求移动端适配，如今该限制已取消，但「.mobi 是老式 WAP 站」的刻板印象仍在，品牌主站慎用；二是响应式设计普及后，独立移动站的必要性下降，更适合做落地页与活动页而非主域。命名上「品牌 + .mobi」（acme.mobi）最主流，「动词/服务词 + .mobi」（book.mobi）适合工具与活动页。",
      bestFor: ["移动端专版站与 H5 落地页", "App 官网与下载页", "移动营销与短链活动页", "车载与物联网终端服务"],
      namingTips: [
        "「品牌 + .mobi」一眼说明这是手机端入口",
        "首年约 $4、续费约 $42/年，续费高于新顶级域均值",
        "移动场景用 .mobi，应用形态用 .app，技术属性用 .tech",
        "响应式已是主流，更适合落地页与活动页而非品牌主域",
      ],
    },
    en: {
      title: ".mobi Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".mobi is the veteran suffix built for mobile — for mobile-specific sites and H5 landing pages, app homepages and download pages, mobile marketing and short-link campaigns, and in-car or IoT terminal services. See live pricing and naming advice, then hunt available .mobi names with AI.",
      intro:
        ".mobi writes the device into the address: mobile-specific sites and H5 landing pages, app homepages and download pages, mobile marketing and short-link campaigns, and in-car or IoT terminal services on name.mobi name the context in one word — .mobi launched in 2005, backed by Nokia, Microsoft, Vodafone and others as a mobile-only top-level domain, one of the very few suffixes created for a single class of device, and twenty years on it is still the bluntest way to say \"phone\" in a domain. The registry is Identity Digital (the former Afilias stack), with a long operating history and a mature, stable registrar and DNS ecosystem. It divides labor cleanly with the already-listed .app, .tech and .online: .app names the software form, .tech names the field, .online names presence — .mobi names the mobile context itself, so device-specific sites and app landing pages position sharpest here. Pricing sits a tier high: about $4 first year (≈¥30) and $42/yr to renew (≈¥300) — clearly above the new-gTLD average, so confirm the budget before holding long-term. Inventory is decent: the mid-2000s land rush left many names taken, but compound and long-tail terms still have plenty of room. Two cautions: the registry's original mobile-formatting requirement was retired years ago, yet the \"old WAP site\" stereotype lingers, so flagship brand sites should think twice; and responsive design has reduced the need for separate mobile sites, making .mobi better suited to landing and campaign pages than to a primary domain. Naming: brand + .mobi (acme.mobi) is the mainstream shape; verb or service word + .mobi (book.mobi) suits tools and campaigns.",
      bestFor: ["Mobile-specific sites & H5 landing pages", "App homepages & download pages", "Mobile marketing & short-link campaigns", "In-car & IoT terminal services"],
      namingTips: [
        "Brand + .mobi says \"this is the phone entrance\" at a glance",
        "About $4 year one, $42/yr renewal — above the new-gTLD average",
        "The mobile context fits .mobi; the software .app; the field .tech",
        "Responsive design rules — better for landing pages than a main domain",
      ],
    },
  },
  asia: {
    tld: "asia",
    zh: {
      title: ".asia 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".asia 是亚洲区域的官方后缀，适合面向亚洲市场的跨境电商与品牌站、亚太区业务的企业官网、亚洲文化与旅行内容站、区域行业协会与展会活动。查看 .asia 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .asia 域名。",
      intro:
        ".asia 把市场范围写进域名：面向亚洲市场的跨境电商与品牌站、亚太区业务的企业官网、亚洲文化与旅行内容站、区域行业协会与展会活动用 name.asia，一眼锁定亚太——它是 2007 年由 DotAsia 机构（香港）发起的区域赞助类顶级域，得到亚太多个国家域名注册局背书，是少数「代表一个大洲」的官方后缀。后端由 Identity Digital 运营，解析与注册商生态成熟稳定。它与已收录的 .cn/.in/.global 分工清晰：.cn/.in 说单一国家，.global 说全球化——.asia 圈定「亚太区域」这个中间层，跨国但不泛全球的业务定位最准。价格是少见的平价平续结构：注册约 $12/年（约 ¥85），续费同价——没有首年促销陷阱，多年持有成本可预期。库存很好：行业词、城市词、品牌词大多有货。注意两点：一是注册政策要求至少一个联系人位于亚太地区（DotAsia 的 Charter 资格要求，多数注册商可自动满足）；二是面向欧美市场时区域标签反而收窄语义，全球业务用 .com/.global 更稳。命名上「品牌 + .asia」（acme.asia）最主流，「行业/品类 + .asia」（travel.asia）适合区域门户与内容站。",
      bestFor: ["面向亚洲市场的跨境电商与品牌站", "亚太区业务的企业官网", "亚洲文化与旅行内容站", "区域行业协会与展会活动"],
      namingTips: [
        "「品牌 + .asia」一眼说明主战场在亚太",
        "注册约 $12/年、续费同价，无首年促销陷阱",
        "亚太区域用 .asia，单一国家用 .cn/.in，全球化用 .global",
        "注册要求至少一个亚太联系人，多数注册商可自动满足",
      ],
    },
    en: {
      title: ".asia Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".asia is the official suffix for the Asia-Pacific region — for cross-border e-commerce and brands targeting Asian markets, corporate sites with APAC operations, Asian culture and travel content, and regional trade associations and events. See live pricing and naming advice, then hunt available .asia names with AI.",
      intro:
        ".asia writes the market into the address: cross-border e-commerce and brands targeting Asian markets, corporate sites with APAC operations, Asian culture and travel content, and regional trade associations and events on name.asia lock onto the region at a glance — launched in 2007 by the Hong Kong-based DotAsia Organisation as a sponsored regional top-level domain, endorsed by many Asia-Pacific country registries, it is one of the very few suffixes that officially names a continent. The backend runs on Identity Digital, with a mature, stable registrar and DNS ecosystem. It divides labor cleanly with the already-listed .cn, .in and .global: .cn and .in name a single country, .global claims the whole world — .asia marks the in-between layer, so multi-country-but-not-global positioning reads sharpest here. Pricing is the rare flat shape: about $12/yr to register (≈¥85) and the same to renew — no first-year promo trap, so multi-year costs stay predictable. Inventory is very good: industry words, city words and brand words mostly hit. Two cautions: the registry's Charter requires at least one contact based in the Asia-Pacific region (most registrars satisfy this automatically); and for audiences in Europe or the Americas the regional label narrows the story — global plays sit safer on .com or .global. Naming: brand + .asia (acme.asia) is the mainstream shape; industry or category + .asia (travel.asia) suits regional portals and content sites.",
      bestFor: ["Cross-border e-commerce & brands for Asian markets", "Corporate sites with APAC operations", "Asian culture & travel content", "Regional trade associations & events"],
      namingTips: [
        "Brand + .asia says the home market is APAC at a glance",
        "About $12/yr flat to register and renew — no promo trap",
        "The region fits .asia; one country .cn/.in; worldwide .global",
        "Charter needs one APAC contact — most registrars handle it",
      ],
    },
  },
  buzz: {
    tld: "buzz",
    zh: {
      title: ".buzz 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".buzz 是「热度/话题」气质的营销后缀，适合营销活动与新品发布落地页、社媒话题与病毒传播项目、娱乐八卦与热点资讯站、蜂业与蜂蜜品牌。查看 .buzz 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .buzz 域名。",
      intro:
        ".buzz 把热度写进域名：营销活动与新品发布落地页、社媒话题与病毒传播项目、娱乐八卦与热点资讯站、蜂业与蜂蜜品牌用 name.buzz，「制造话题」一词说透——buzz 在英文里既是嗡嗡声也是「热度/风头」，营销语境里 create a buzz（制造话题）人尽皆知，此外它还是养蜂与蜂蜜品牌的天然双关。注册局为 DotStrategy（美国），2014 年开放注册，是新顶级域里少数由独立小注册局长期稳定运营的后缀，解析与注册商覆盖成熟。它与已收录的 .promo/.click/.fun 分工清晰：.promo 说促销动作，.click 说点击行为，.fun 说趣味体验——.buzz 说的是「话题热度」本身，做传播导向的活动页定位最准。价格是典型促销结构：首年约 $2（约 ¥15），续费约 $26/年（约 ¥189）——首年极低，务必按续费价做多年预算。库存极好：话题词、品牌词、行业词全线有货。注意两点：一是首年与续费差十倍以上，批量注册前先算三年总成本；二是低价后缀历史上垃圾站较多，务必配好 SPF/DKIM 并做好内容质量，避免邮件与搜索侧受牵连。命名上「品牌 + .buzz」（acme.buzz）最主流，「话题词 + .buzz」（launch.buzz）适合活动与传播页。",
      bestFor: ["营销活动与新品发布落地页", "社媒话题与病毒传播项目", "娱乐八卦与热点资讯站", "蜂业与蜂蜜品牌"],
      namingTips: [
        "「品牌 + .buzz」把「正在制造话题」写进域名",
        "首年约 $2、续费约 $26/年，按续费价算三年总成本",
        "话题热度用 .buzz，促销动作用 .promo，趣味体验用 .fun",
        "低价后缀需配好 SPF/DKIM 与内容质量，避免声誉牵连",
      ],
    },
    en: {
      title: ".buzz Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".buzz is the marketing suffix with heat — for campaign and product-launch landing pages, social-media topics and viral projects, entertainment gossip and trending-news sites, and beekeeping or honey brands. See live pricing and naming advice, then hunt available .buzz names with AI.",
      intro:
        ".buzz writes the hype into the address: campaign and product-launch landing pages, social-media topics and viral projects, entertainment gossip and trending-news sites, and beekeeping or honey brands on name.buzz say \"we make noise\" in one word — buzz is both the hum and the hype, \"create a buzz\" is marketing's most worn phrase, and the beekeeping pun comes free. The registry is DotStrategy of the United States; open since 2014, it is one of the few new gTLDs run long-term by a small independent registry, with mature registrar and DNS coverage. It divides labor cleanly with the already-listed .promo, .click and .fun: .promo names the discount move, .click names the action, .fun names the vibe — .buzz names the attention itself, so spread-first campaign pages position sharpest here. Pricing is the classic promo shape: about $2 first year (≈¥15) and $26/yr to renew (≈¥189) — year one is nearly free, so budget multi-year on the renewal. Inventory is excellent: topic words, brand words and industry words all hit. Two cautions: renewal is more than ten times year one, so price three years before bulk-registering; and cheap TLDs carry spam history, so configure SPF/DKIM and keep content quality high to avoid reputation spillover in email and search. Naming: brand + .buzz (acme.buzz) is the mainstream shape; topic word + .buzz (launch.buzz) suits campaigns and viral pages.",
      bestFor: ["Campaign & product-launch landing pages", "Social-media topics & viral projects", "Entertainment gossip & trending news", "Beekeeping & honey brands"],
      namingTips: [
        "Brand + .buzz writes \"we're making noise\" into the address",
        "About $2 year one, $26/yr renewal — price three years first",
        "Attention fits .buzz; the discount .promo; the vibe .fun",
        "Cheap TLDs need SPF/DKIM and real content to avoid spillover",
      ],
    },
  },
  fans: {
    tld: "fans",
    zh: {
      title: ".fans 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".fans 是粉丝社群的专属后缀，适合明星与偶像官方粉丝站、球队与电竞战队应援站、创作者会员与粉丝订阅页、品牌粉丝社区与周边商城。查看 .fans 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .fans 域名。",
      intro:
        ".fans 把归属感写进域名：明星与偶像官方粉丝站、球队与电竞战队应援站、创作者会员与粉丝订阅页、品牌粉丝社区与周边商城用 name.fans，「谁的粉丝」一眼讲透——名字在前、fans 在后，天然构成「XX 的粉丝们」的完整短语，这种「读出来就是一句话」的后缀在社群场景几乎无可替代。注册局为 ZDNS International（香港），2015 年开放注册，解析与注册商覆盖成熟。它与已收录的 .fan/.club/.live 分工清晰：.fan 说单个粉丝身份，.club 说俱乐部组织，.live 说直播现场——.fans 说的是「粉丝群体」这个复数集体，做官方应援站与社群主页定位最准。价格亲民：首年约 $4（约 ¥26），续费约 $9/年（约 ¥63）——续费在新顶级域里属于最低一档，长期持有无压力。库存极好：偶像名、战队名、品牌词大多有货。注意两点：一是涉及明星与 IP 的名字注意商标与姓名权，官方授权站与同人站要划清边界；二是 .fan 与 .fans 单复数并存，品牌保护最好两个都注册。命名上「偶像/品牌 + .fans」（acme.fans）最主流，「圈名 + .fans」（kpop.fans）适合垂直社群。",
      bestFor: ["明星与偶像官方粉丝站", "球队与电竞战队应援站", "创作者会员与粉丝订阅页", "品牌粉丝社区与周边商城"],
      namingTips: [
        "「偶像/品牌 + .fans」读出来就是「XX 的粉丝们」",
        "首年约 $4、续费约 $9/年，续费属最低一档",
        "粉丝群体用 .fans，单个粉丝用 .fan，俱乐部用 .club",
        "涉及明星与 IP 注意商标姓名权，.fan/.fans 最好都注册",
      ],
    },
    en: {
      title: ".fans Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".fans is the dedicated suffix for fan communities — for official star and idol fan sites, sports and esports team supporter hubs, creator membership and fan subscription pages, and brand fan communities with merch stores. See live pricing and naming advice, then hunt available .fans names with AI.",
      intro:
        ".fans writes the belonging into the address: official star and idol fan sites, sports and esports team supporter hubs, creator membership and fan subscription pages, and brand fan communities with merch stores on name.fans say whose crowd this is at a glance — name first, fans second, the domain reads out loud as a complete phrase, \"the fans of X\", a read-it-as-a-sentence quality almost no other suffix offers community builders. The registry is ZDNS International of Hong Kong; open since 2015, with mature registrar and DNS coverage. It divides labor cleanly with the already-listed .fan, .club and .live: .fan names one supporter, .club names the organization, .live names the show — .fans names the plural crowd, so official supporter hubs and community homepages position sharpest here. Pricing is friendly: about $4 first year (≈¥26) and $9/yr to renew (≈¥63) — among the cheapest renewals of any new gTLD, painless to hold long-term. Inventory is excellent: idol names, team names and brand words mostly hit. Two cautions: names tied to celebrities and IP raise trademark and personality-rights questions, so keep official and fan-made sites clearly separated; and .fan and .fans coexist as singular and plural, so brand protection ideally registers both. Naming: idol or brand + .fans (acme.fans) is the mainstream shape; scene name + .fans (kpop.fans) suits vertical communities.",
      bestFor: ["Official star & idol fan sites", "Sports & esports supporter hubs", "Creator membership & fan subscriptions", "Brand fan communities & merch stores"],
      namingTips: [
        "Idol or brand + .fans reads out loud as \"the fans of X\"",
        "About $4 year one, $9/yr renewal — cheapest tier to hold",
        "The crowd fits .fans; one supporter .fan; the org .club",
        "Mind trademark rights on celebrity names — register .fan too",
      ],
    },
  },
  place: {
    tld: "place",
    zh: {
      title: ".place 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".place 是「地点/场所」语义的通用后缀，适合线下门店与场馆官网、共享空间与工作室预约页、本地生活与目的地指南站、虚拟社区与元宇宙空间。查看 .place 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .place 域名。",
      intro:
        ".place 把场所写进域名：线下门店与场馆官网、共享空间与工作室预约页、本地生活与目的地指南站、虚拟社区与元宇宙空间用 name.place，「这是一个地方」一词讲透——place 是英文里最通用的场所词，实体店面、活动场地、线上空间都能套用，且「品牌 + .place」读起来就是「XX 的地盘」，归属感天然。注册局为 Identity Digital（原 Donuts），2014 年开放注册，解析与注册商生态成熟稳定。它与已收录的 .space/.city/.land 分工清晰：.space 偏抽象空间与创意留白，.city 说城市尺度，.land 说地块与版图——.place 说的是「具体的一个场所」，做门店与场馆官网定位最准。价格是少见的平价平续结构：注册约 $18/年（约 ¥130），续费同价——无首年促销陷阱，多年持有成本可预期。库存极好：场所词、地名词、品牌词全线有货。注意两点：一是 place 语义宽泛，不自带行业信息，域名前半段要把业务说清楚；二是本地业务同时留意 .city 与城市域名，多注一手做品牌保护。命名上「品牌 + .place」（acme.place）最主流，「场所词 + .place」（studio.place）适合预约页与空间站。",
      bestFor: ["线下门店与场馆官网", "共享空间与工作室预约页", "本地生活与目的地指南站", "虚拟社区与元宇宙空间"],
      namingTips: [
        "「品牌 + .place」读起来就是「XX 的地盘」",
        "注册约 $18/年、续费同价，无首年促销陷阱",
        "具体场所用 .place，抽象空间用 .space，城市尺度用 .city",
        "place 语义宽泛，域名前半段要把业务说清楚",
      ],
    },
    en: {
      title: ".place Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".place is the generic suffix for locations and venues — for physical stores and venue sites, co-working and studio booking pages, local-living and destination guides, and virtual communities or metaverse spaces. See live pricing and naming advice, then hunt available .place names with AI.",
      intro:
        ".place writes the venue into the address: physical stores and venue sites, co-working and studio booking pages, local-living and destination guides, and virtual communities or metaverse spaces on name.place say \"this is somewhere\" in one word — place is English's most universal word for location, stretching from storefronts to event venues to online worlds, and brand + .place reads naturally as \"X's spot\", belonging built in. The registry is Identity Digital (formerly Donuts); open since 2014, with a mature, stable registrar and DNS ecosystem. It divides labor cleanly with the already-listed .space, .city and .land: .space leans abstract and creative, .city names the urban scale, .land names territory — .place names one concrete venue, so store and venue sites position sharpest here. Pricing is the rare flat shape: about $18/yr to register (≈¥130) and the same to renew — no first-year promo trap, so multi-year costs stay predictable. Inventory is excellent: venue words, location words and brand words all hit. Two cautions: place carries no industry meaning of its own, so the left half of the name must state the business; and local ventures should also watch .city and city-level domains, registering a spare for brand protection. Naming: brand + .place (acme.place) is the mainstream shape; venue word + .place (studio.place) suits booking pages and space sites.",
      bestFor: ["Physical stores & venue sites", "Co-working & studio booking pages", "Local-living & destination guides", "Virtual communities & metaverse spaces"],
      namingTips: [
        "Brand + .place reads naturally as \"X's spot\"",
        "About $18/yr flat to register and renew — no promo trap",
        "One venue fits .place; abstract space .space; the city .city",
        "place says no industry — the left half must state the business",
      ],
    },
  },
  report: {
    tld: "report",
    zh: {
      title: ".report 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".report 是「报告/报道」的专属后缀，适合行业研究与市场报告站、数据新闻与调查报道项目、企业年报与 ESG 披露页、测评与白皮书发布站。查看 .report 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .report 域名。",
      intro:
        ".report 把体裁写进域名：行业研究与市场报告站、数据新闻与调查报道项目、企业年报与 ESG 披露页、测评与白皮书发布站用 name.report，「这里出报告」一词讲透——report 同时覆盖「研究报告」与「新闻报道」两层含义，做内容的权威感与做数据的专业感一并到位，「领域 + .report」读起来就是一份刊物的名字。注册局为 Identity Digital（原 Donuts），2014 年开放注册，解析与注册商生态成熟稳定。它与已收录的 .news/.wiki/.review 分工清晰：.news 说时效资讯，.wiki 说协作知识库，.review 说评价打分——.report 说的是「成体系的深度输出」，做研究报告与调查内容定位最准。价格适中：首年约 $7（约 ¥48），续费约 $20/年（约 ¥145）——首年有促销、续费不算贵，长期做内容站可持续。库存极好：行业词、地区词、题材词全线有货。注意两点：一是首年与续费有差价，按续费价做多年预算；二是「报告」自带权威预期，内容质量与数据来源要撑得起这个后缀，否则反噬信任。命名上「领域 + .report」（energy.report）最主流，读起来就是刊物名，「品牌 + .report」（acme.report）适合企业披露页。",
      bestFor: ["行业研究与市场报告站", "数据新闻与调查报道项目", "企业年报与 ESG 披露页", "测评与白皮书发布站"],
      namingTips: [
        "「领域 + .report」读起来就是一份刊物的名字",
        "首年约 $7、续费约 $20/年，按续费价做多年预算",
        "深度报告用 .report，时效资讯用 .news，评价打分用 .review",
        "「报告」自带权威预期，内容与数据要撑得起后缀",
      ],
    },
    en: {
      title: ".report Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".report is the dedicated suffix for reports and reporting — for industry research and market-report sites, data journalism and investigative projects, annual-report and ESG disclosure pages, and testing or whitepaper publishing. See live pricing and naming advice, then hunt available .report names with AI.",
      intro:
        ".report writes the genre into the address: industry research and market-report sites, data journalism and investigative projects, annual-report and ESG disclosure pages, and testing or whitepaper publishing on name.report say \"reports live here\" in one word — report spans both the research document and the act of journalism, so analytical authority and newsroom credibility arrive together, and field + .report reads like the masthead of a publication. The registry is Identity Digital (formerly Donuts); open since 2014, with a mature, stable registrar and DNS ecosystem. It divides labor cleanly with the already-listed .news, .wiki and .review: .news names the fast feed, .wiki names the shared knowledge base, .review names the scoring — .report names the systematic deep dive, so research and investigative content positions sharpest here. Pricing is moderate: about $7 first year (≈¥48) and $20/yr to renew (≈¥145) — a first-year promo with a reasonable renewal, sustainable for a long-running content site. Inventory is excellent: industry words, region words and topic words all hit. Two cautions: the first-year gap means budgeting on the renewal; and \"report\" sets an expectation of authority, so content quality and data sourcing must carry the suffix or trust backfires. Naming: field + .report (energy.report) is the mainstream shape and reads like a publication; brand + .report (acme.report) suits corporate disclosure pages.",
      bestFor: ["Industry research & market-report sites", "Data journalism & investigative projects", "Annual-report & ESG disclosure pages", "Testing & whitepaper publishing"],
      namingTips: [
        "Field + .report reads like the masthead of a publication",
        "About $7 year one, $20/yr renewal — budget on the renewal",
        "The deep dive fits .report; the fast feed .news; scores .review",
        "\"Report\" promises authority — the data must carry the suffix",
      ],
    },
  },
  town: {
    tld: "town",
    zh: {
      title: ".town 域名注册指南：适合谁、多少钱、怎么起名",
      metaDescription: ".town 是「小镇/城镇」语义的社区后缀，适合小镇与街区门户站、本地商户与市集导览、文旅小镇与古镇项目、主题社区与游戏小镇。查看 .town 实时注册/续费价格与命名建议，用 AI 猎取可注册的 .town 域名。",
      intro:
        ".town 把烟火气写进域名：小镇与街区门户站、本地商户与市集导览、文旅小镇与古镇项目、主题社区与游戏小镇用 name.town，「一个镇子」一词讲透——town 比 city 小、比 village 大，自带熟人社区的亲切感，「地名 + .town」读起来就是小镇官网，「主题词 + .town」则能造出「某某小镇」的世界观，游戏与虚拟社区尤其好用。注册局为 Identity Digital（原 Donuts），2014 年开放注册，解析与注册商生态成熟稳定。它与已收录的 .city/.land/.casa 分工清晰：.city 说城市尺度，.land 说地块版图，.casa 说居所——.town 说的是「城镇尺度的社区」，做本地门户与文旅项目定位最准。价格是典型促销结构：首年约 $6（约 ¥41），续费约 $29/年（约 ¥211）——首年低、续费中档，按续费价做多年预算。库存极好：地名、主题词、品牌词全线有货。注意两点：一是首年与续费差价明显，批量注册前先算三年总成本；二是中文语境里「镇」的行政含义与英文 town 不完全对应，面向国内用户时配合中文品牌词更稳。命名上「地名 + .town」（dali.town）最主流，「主题词 + .town」（pixel.town）适合游戏与虚拟社区。",
      bestFor: ["小镇与街区门户站", "本地商户与市集导览", "文旅小镇与古镇项目", "主题社区与游戏小镇"],
      namingTips: [
        "「地名 + .town」读起来就是小镇官网",
        "首年约 $6、续费约 $29/年，按续费价算三年总成本",
        "城镇社区用 .town，城市尺度用 .city，地块版图用 .land",
        "「主题词 + .town」能造世界观，游戏与虚拟社区好用",
      ],
    },
    en: {
      title: ".town Domain Guide: Who It's For, Pricing & Naming Tips",
      metaDescription:
        ".town is the community suffix at town scale — for town and neighborhood portals, local merchant and market guides, cultural-tourism town projects, and themed communities or game towns. See live pricing and naming advice, then hunt available .town names with AI.",
      intro:
        ".town writes the neighborhood into the address: town and neighborhood portals, local merchant and market guides, cultural-tourism town projects, and themed communities or game towns on name.town say \"a town lives here\" in one word — town sits between city and village, carrying the warmth of a place where people know each other; placename + .town reads like the town's official site, while theme + .town builds a whole world, which games and virtual communities exploit beautifully. The registry is Identity Digital (formerly Donuts); open since 2014, with a mature, stable registrar and DNS ecosystem. It divides labor cleanly with the already-listed .city, .land and .casa: .city names the urban scale, .land names territory, .casa names the home — .town names the community at town scale, so local portals and cultural-tourism projects position sharpest here. Pricing is the classic promo shape: about $6 first year (≈¥41) and $29/yr to renew (≈¥211) — a low year one with a mid-tier renewal, so budget multi-year on the renewal. Inventory is excellent: placenames, theme words and brand words all hit. Two cautions: the first-year gap is large, so price three years before bulk-registering; and the Chinese administrative sense of 镇 doesn't map exactly onto the English town, so domestic-facing projects pair it with a Chinese brand word for clarity. Naming: placename + .town (dali.town) is the mainstream shape; theme + .town (pixel.town) suits games and virtual communities.",
      bestFor: ["Town & neighborhood portals", "Local merchant & market guides", "Cultural-tourism town projects", "Themed communities & game towns"],
      namingTips: [
        "Placename + .town reads like the town's official site",
        "About $6 year one, $29/yr renewal — price three years first",
        "Town scale fits .town; the city .city; territory .land",
        "Theme + .town builds a world — great for games and communities",
      ],
    },
  },
} satisfies Record<Tld, TldGuide>;

// 声明为 string 索引供路由 slug 查询；satisfies 保证与 TLD_LIST 键集编译期一致
export const TLD_GUIDES: Record<string, TldGuide> = GUIDES;
