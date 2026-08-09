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
        ".gold 一词双关：本义是黄金——金店、珠宝品牌、贵金属交易与回收、金价行情站用 name.gold，行业属性一秒传达；引申义是「金牌/顶级」——把 .gold 当品质徽章用，会员体系的最高档（member.gold 式）、精品推荐、高端服务都能借它抬升质感。Identity Digital 运营，注册约 $6（约 ¥41），续费约 $83/年（约 ¥597）——首年友好但续费是本批最高档，预算务必按续费核算，适合认真经营的业务而非批量囤域名。库存很好：品牌词、品类词、城市词命中率高。注意三点：一是贵金属交易与投资是强监管领域，行情与交易类站点注意合规与资质展示；二是「gold」的高端语义是承诺，产品与视觉撑不起「金」字招牌反而显得廉价；三是它和 .money 分工明确——.gold 偏实物与品质叙事，.money 偏理财与工具。命名上「品牌/品类 + .gold」最自然（如 aurum.gold、bridal.gold 式），配合金色系视觉，域名与品牌气质浑然一体。",
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
        ".blue 是「颜色系」后缀里最商务的一个：蓝色在视觉语言里代表专业、冷静与信任，金融、科技、医疗类品牌的主色十有八九是蓝。如果你的品牌视觉以蓝为主，name.blue 等于把 VI 写进了域名——jet.blue 式的组合就是教科书案例（JetBlue 真的把 jetblue.com 之外的品牌延伸做到了颜色域名上）。第二层是字面语义：海洋保护组织、潜水俱乐部、航空航天项目、爵士与布鲁斯音乐（blues）站点都能借「blue」的意象。Identity Digital 运营，注册约 $13（约 ¥93），续费约 $20/年（约 ¥145）——续费比注册没贵多少，是颜色系里定价最厚道的档位。库存极好：常用词、品牌词基本随便挑。注意两点：一是颜色后缀的指向性弱于行业后缀，用户看到 .blue 猜不出你做什么，品牌解释成本要靠首屏补齐；二是「feeling blue」在英语里有忧郁的意思，情感健康类项目用它反而可以借题发挥，但普通商务站要避免负面歧义。命名上「品牌词 + .blue」最自然，海洋/天空类项目用「意象词 + .blue」也顺。",
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
        ".restaurant 是餐饮行业的全拼后缀：实体餐厅、连锁品牌、餐饮集团、预订与点评平台用 name.restaurant，行业身份一目了然。餐厅命名的痛点是店名往往是人名、地名或常见词——这些词的 .com 几乎必然被占，而「店名 + .restaurant」组合的库存极好，几乎随便挑；对多品牌餐饮集团来说，用统一的 .restaurant 后缀归拢旗下品牌官网也很优雅。Identity Digital 运营，注册约 $13（约 ¥93），续费约 $52/年（约 ¥374），对一家正经餐厅的经营成本来说可以忽略。注意三点：一是 restaurant 十个字母是本站最长后缀，店名必须短，否则域名难拼难念；二是食客更多从地图与点评平台进店，域名的角色是菜单、订座与品牌官网的稳定入口，配合 Google Maps/大众点评的主页链接使用；三是快餐、咖啡、酒吧等细分业态有更贴的后缀（.cafe、.bar、.pizza），全服务餐厅才最适合 .restaurant。命名上「店名 + .restaurant」最自然，本地生意用「地名/菜系 + .restaurant」也顺。",
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
        ".wine 是葡萄酒世界的原生后缀：酒庄官网、葡萄酒电商与订阅、进口商与经销商、侍酒师个人品牌、酒评与品鉴内容、酒窖与酒具生意用 name.wine，风土从域名开始。相比 .bar 的门店感，.wine 覆盖的是整条产业链——种植、酿造、贸易、内容、体验。Identity Digital 运营，注册约 $6（约 ¥41）很便宜，续费约 $48/年（约 ¥345）是首年的数倍，下手前把续费算进预算。库存极好：产区词、品种词、庄园名命中率都高。注意三点：一是酒类电商与广告在多数市场有牌照与年龄门槛，合规是第一课；二是 wine 一词的联想是「佐餐与品味」，烈酒与精酿啤酒品牌另有更准的词；三是欧洲产区名（champagne、bordeaux 类）受地理标志保护，起名避开受保护词。命名上「庄园/品牌 + .wine」最自然，电商用「场景词 + .wine」（daily、house 类），内容品牌用「动词/形容词 + .wine」也很出彩。",
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
        ".ventures 把「押注未来」写进域名：风投与天使基金、创业工作室（venture studio）、孵化器与加速器、连续创业者的控股主体用 name.ventures，域名本身就是一句投资宣言。英文里 ventures 是基金命名的标准后缀词（Sequoia、a16z 的全名都带 ventures），域名直接用 .ventures 反而省掉了主体里的重复。Identity Digital 运营，注册约 $6（约 ¥41），续费约 $48/年（约 ¥345），对基金管理费来说可以忽略。库存极好：姓氏、地名、意象词命中率都高。注意三点：一是它偏机构与资本语气，单一产品或 2C 品牌不合适；二是基金品牌重信任，主体名用姓氏、合伙人组合或稳重意象词，别用轻佻词；三是八个字母偏长，配短主体名读起来才利落。命名上「姓氏/合伙人 + .ventures」最自然（基金业传统），创业工作室用「品牌词 + .ventures」，主题基金用「领域 + .ventures」（climate、bio 类）一眼点明赛道。",
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
        ".beauty 把美写进域名：美妆品牌与电商、美容院与皮肤管理工作室、美妆博主与教程站、造型与美甲工作室用 name.beauty，行业定位一眼即明——这是「行业词后缀」里指向最清晰的一批。XYZ 注册局运营（旗下还有 .hair、.skin、.makeup 一整套美妆系后缀），大牌背书已有先例：欧莱雅集团就注册过多个 .beauty 域名做品牌活动站。注册约 $2（约 ¥11），续费约 $13/年（约 ¥93）——首年近乎白送，续费也只是温和档，美妆系后缀里性价比最高的一个。库存极好：品牌词、品类词、人名命中率都高。注意三点：一是六个字母不算短，主体名选短词，域名整体才轻盈；二是「beauty」指向美妆美容行业，跨界品牌（如美食、摄影里的「美」）用它需要首屏立刻讲清定位；三是美妆是视觉行业，域名只是入口，站内视觉质感与产品图才是转化关键。命名上「品牌 + .beauty」最自然（等于品牌宣言），本地店用「店名/城市 + .beauty」接住本地搜索，博主用「昵称 + .beauty」个人品牌感十足。",
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
} satisfies Record<Tld, TldGuide>;

// 声明为 string 索引供路由 slug 查询；satisfies 保证与 TLD_LIST 键集编译期一致
export const TLD_GUIDES: Record<string, TldGuide> = GUIDES;
