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
} satisfies Record<Tld, TldGuide>;

// 声明为 string 索引供路由 slug 查询；satisfies 保证与 TLD_LIST 键集编译期一致
export const TLD_GUIDES: Record<string, TldGuide> = GUIDES;
