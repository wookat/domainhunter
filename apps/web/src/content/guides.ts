/**
 * 行业命名指南页内容（/guide/:slug）。纯数据常量：前端页面与 worker（SSR meta / sitemap）共用。
 * slug 与首页 TEMPLATES 的 tpl 值一一对应（CTA /?tpl=<slug> 预填行业模板）。
 */

/** 好名字案例：品牌名 + 拆解要点 */
export interface GuideCase {
  name: string;
  takeaway: string;
}

export interface IndustryGuideLocale {
  /** 短标签（页脚/互链 chips 用） */
  label: string;
  /** 页面标题（不含站点名） */
  title: string;
  /** SEO meta description */
  metaDescription: string;
  /** 正文引言：该行业命名的整体思路 */
  intro: string;
  /** 命名思路（4–6 条，具体可操作） */
  namingIdeas: string[];
  /** 好名字案例分析（3–5 个知名品牌拆解） */
  cases: GuideCase[];
  /** 常见误区 */
  pitfalls: string[];
}

export interface IndustryGuide {
  slug: string;
  /** 推荐 TLD（链接到 /tld/:tld），reason 按语言 */
  tlds: { tld: string; zh: string; en: string }[];
  zh: IndustryGuideLocale;
  en: IndustryGuideLocale;
}

export const INDUSTRY_GUIDES: Record<string, IndustryGuide> = {
  saas: {
    slug: "saas",
    tlds: [
      { tld: "com", zh: "面向企业客户的默认选择，采购与 IT 部门最信任", en: "The default for B2B buyers — procurement and IT trust it most" },
      { tld: "io", zh: "技术型 SaaS 的圈内标配，开发者受众零违和", en: "The insider standard for technical SaaS aimed at developers" },
      { tld: "app", zh: "产品即应用时零解释成本，且全后缀强制 HTTPS", en: "Zero explanation when the product is an app; HTTPS enforced zone-wide" },
    ],
    zh: {
      label: "SaaS 工具",
      title: "SaaS 产品怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "SaaS 产品命名完整指南：动词化命名、合成词、隐喻词等 5 种思路，Slack/Notion/Figma 等好名字拆解，推荐 TLD 与常见误区，并用 AI 立刻猎取可注册的 SaaS 域名。",
      intro:
        "SaaS 的名字要在两个场景里同时成立：一是老板在预算会议上说出来不掉价，二是用户在日常对话里能把它当动词用——「你 Slack 我一下」是 SaaS 命名的最高境界。这决定了 SaaS 命名的核心取舍：宁要好读好拼的造词，不要准确但拗口的功能描述。功能会迭代，名字描述得越具体，三年后被自己的路线图打脸的概率越大（想象 Slack 若叫 TeamChatTool 会怎样）。同时 SaaS 获客高度依赖口碑与搜索，名字必须「听一遍就能拼出来」，否则每一次口头推荐都在漏水。预算上，SaaS 客单价高、生命周期长，域名是最便宜的品牌投资，值得为一个干净的 .com 或 .io 多花预算。",
      namingIdeas: [
        "动词化命名：选一个能当动词用的短词或造词（Slack、Zoom），用户说「你 X 我一下」时品牌就赢了；测试方法是造句念三遍，别扭就换",
        "隐喻借词：不描述功能，借一个意象表达价值——Notion（概念）、Asana（瑜伽体式，稳定）、Monday（每周的开始）；隐喻词库存远比功能词充裕",
        "合成词嫁接：两个短词根各取一半拼接（Salesforce = sales + force、Mailchimp = mail + chimp），既保留联想又拿得到域名",
        "尾缀造词：在词根后加 -ly、-io、-base、-stack、-kit 等 SaaS 惯用尾缀（Grammarly、Airtable），圈内人一眼识别品类",
        "拼写变形要克制：删元音（Flickr 式）在 2025 年已显过时，且口头传播必须逐字母拼写；若变形，只动一个字母且保持读音不变",
      ],
      cases: [
        { name: "Slack", takeaway: "本义「松弛」，反直觉地给「工作沟通」注入轻松感；单音节、能当动词、5 个字母，几乎是 SaaS 命名的满分卷" },
        { name: "Notion", takeaway: "抽象名词「概念/想法」，完美匹配「万物皆可组织」的产品哲学；不锁定任何功能，给了产品十年扩张空间" },
        { name: "Figma", takeaway: "从 figure（图形）造词，保留视觉联想又完全独占；两音节以 -a 结尾，全球用户发音几乎不会出错" },
        { name: "Airtable", takeaway: "air（轻盈）+ table（表格）：一秒说清「更轻快的表格」，合成词里教科书级的「气质词+品类词」结构" },
        { name: "Linear", takeaway: "直接用常见词「线性的」，赌的是品牌感压过通用性；配合 linear.app 域名反而强化了「工程审美」人设——常见词+精准 TLD 的经典打法" },
      ],
      pitfalls: [
        "用功能描述当名字（TaskManagerPro 类）：功能一变名字就过期，且毫无商标性可言",
        "堆砌 tech/hub/soft 等万金油后缀：和几千个同行撞车，搜索结果里永远挤不进第一屏",
        "只查了 .com 没查商标与社交账号：SaaS 出海必查 USPTO/EUIPO 与 X、GitHub 同名账号",
        "名字超过 3 个音节：口碑传播衰减明显，输入 URL 时的错拼率也随长度上升",
      ],
    },
    en: {
      label: "SaaS tools",
      title: "How to Name a SaaS Product: Strategies, Case Studies & Domains",
      metaDescription:
        "A complete SaaS naming guide: verb-able names, blends and metaphors, breakdowns of Slack/Notion/Figma, recommended TLDs and common mistakes — then hunt an available SaaS domain with AI.",
      intro:
        "A SaaS name has to work in two rooms at once: it can't sound cheap when a VP says it in a budget meeting, and it should slip into everyday speech as a verb — \"just Slack me\" is the endgame of SaaS naming. That defines the core trade-off: a clean, pronounceable coined word beats an accurate but clunky feature description every time. Features change; the more literally a name describes today's product, the more your own roadmap will contradict it in three years (imagine Slack launching as TeamChatTool). SaaS growth also leans on word of mouth and search, so the name must survive the \"hear it once, spell it right\" test — every failed spelling is a leaked referral. And since SaaS has high contract values and long customer lifetimes, the domain is the cheapest brand asset you'll ever buy: paying up for a clean .com or .io is rational, not vain.",
      namingIdeas: [
        "Make it verb-able: pick a short word or coinage that works as a verb (Slack, Zoom). Say \"just X me\" out loud three times — if it stumbles, move on",
        "Borrow a metaphor: don't describe the feature, evoke the value — Notion (an idea), Asana (a stable yoga pose), Monday (where work starts). Metaphor inventory is far richer than feature-word inventory",
        "Graft a blend: fuse halves of two short roots (Salesforce, Mailchimp) — you keep the association and can actually register the domain",
        "Use category suffixes deliberately: -ly, -base, -stack, -kit and friends (Grammarly, Airtable) signal the SaaS category instantly to your buyers",
        "Ration the misspellings: dropped vowels (the Flickr trick) read dated now and force letter-by-letter spelling in every referral. If you must mutate, change one letter and keep the pronunciation intact",
      ],
      cases: [
        { name: "Slack", takeaway: "Literally \"looseness\" — counterintuitively injecting calm into work chat; one syllable, verb-able, five letters: close to a perfect score in SaaS naming" },
        { name: "Notion", takeaway: "An abstract noun that matches the \"organize anything\" philosophy; by locking onto no feature, it bought a decade of product expansion" },
        { name: "Figma", takeaway: "Coined from \"figure\": keeps the visual association while being fully ownable; two syllables ending in -a, nearly impossible to mispronounce globally" },
        { name: "Airtable", takeaway: "air (light) + table (the category): explains \"a lighter spreadsheet\" in one second — the textbook quality-word + category-word blend" },
        { name: "Linear", takeaway: "A common dictionary word, betting brand feel over ownability — and linear.app turns the constraint into an engineering-taste statement. Classic common-word + precise-TLD play" },
      ],
      pitfalls: [
        "Naming by feature description (TaskManagerPro et al.): the name expires with the first pivot and has zero trademark strength",
        "Leaning on filler suffixes like tech/hub/soft — you'll collide with thousands of peers and never own page one of search",
        "Checking only the .com: for global SaaS, also clear the trademark (USPTO/EUIPO) and the matching X and GitHub handles",
        "Going past three syllables: word-of-mouth decays fast and typo rates climb with every extra character",
      ],
    },
  },
  ecommerce: {
    slug: "ecommerce",
    tlds: [
      { tld: "com", zh: "电商信任是第一货币，.com 仍是转化率最稳的选择", en: "Trust is currency in commerce — .com still converts most reliably" },
      { tld: "co", zh: "品牌感强的新消费品牌常用替身，短一个字母更利落", en: "A stylish stand-in for brand-first consumer labels, one letter sleeker" },
      { tld: "cn", zh: "面向国内市场的电商需要备案，.cn 合规最顺", en: "For China-facing stores that need ICP filing, .cn is smoothest" },
    ],
    zh: {
      label: "电商品牌",
      title: "电商品牌怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "电商品牌命名指南：情绪词、创始人故事、品类词升维等 5 种思路，Shein/Etsy/Shopify 等案例拆解，推荐 TLD 与避坑清单，并用 AI 猎取可注册的电商域名。",
      intro:
        "电商名字的战场不在地址栏，而在包装盒、购物袋、直播间口播和顾客的转述里。用户很少「输入」电商域名——他们从广告、社交内容和搜索点进来，但名字决定了他们是否敢把信用卡号交给你，以及收到包裹后是否愿意向朋友复述。所以电商命名第一优先级是「信任感 + 上镜」：印在包装上要好看，念出来要顺口，听一遍能记住。第二优先级是搜索独占性——名字太通用（如 BestShop），花再多广告费也在给同行导流；名字独特，每一次品牌搜索都精准回到你这里。价格敏感是电商的常态，但域名恰恰不该省：主域名被别人拿着相似拼写截流，损失远大于差价。",
      namingIdeas: [
        "情绪词优先：电商卖的是感觉，选能唤起情绪的词根——温暖（Glossier 源自 glossy 的光泽感）、惊喜、治愈；先列 10 个你想让顾客产生的形容词，再从中造词",
        "创始人/故事命名：人名或有出处的词自带叙事（Burberry、鹿角巷），品牌故事页和直播间都有话可讲；配「关于我们」页效果翻倍",
        "品类词升维：不用品类词本身，用品类的「结果」——卖床垫的 Casper（睡个好觉的幽灵形象）而不是 SleepMattress；顾客买的是结果不是产品",
        "音感设计：爆破音（b/p/k）开头的名字在口播和短视频里更抓耳（Bombas、Peloton）；测试方法是把名字放进一句直播话术里念",
        "全球化预检：出海品牌要查名字在目标市场语言里的歧义（经典反例：Nova 在西语区谐音「不走」），并确认拼写在当地键盘上无障碍",
      ],
      cases: [
        { name: "Shein", takeaway: "she + in 的合成：两个最简单的英文词拼出「她很时髦」，4 个音素全球都能读；证明快时尚不需要复杂名字，需要好读的名字" },
        { name: "Etsy", takeaway: "刻意选的无意义短词：创始人要一个「空白画布」让卖家的商品定义品牌；两音节、辨识度极高，反而成了手作的代名词" },
        { name: "Shopify", takeaway: "shop + -ify（使动后缀）：「让你能开店」一词说清平台使命；-ify 尾缀把动作感注入名字，B 端工具感十足" },
        { name: "Glossier", takeaway: "glossy（有光泽的）的比较级变形：一个词同时携带品类联想（美妆光泽）与「更好一点」的暗示，法语尾音还添了轻奢感" },
      ],
      pitfalls: [
        "名字里塞 shop/store/mall：和平台型巨头的心智重叠，且显得像杂货铺而非品牌",
        "使用连字符或数字：包装印刷没问题，口播必翻车——「中间有个横线」是转化率杀手",
        "忽略社交账号统一性：电商获客主阵地在社交平台，Instagram/TikTok/小红书同名拿不到就换名",
        "只顾中文好听不查拼音域名：国内品牌常见教训——中文名定了，拼音域名与商标早被抢注",
      ],
    },
    en: {
      label: "E-commerce",
      title: "How to Name an E-commerce Brand: Strategies, Cases & Domains",
      metaDescription:
        "E-commerce naming guide: emotion-first words, founder stories, category elevation, breakdowns of Shein/Etsy/Shopify, recommended TLDs and pitfalls — then hunt an available brand domain with AI.",
      intro:
        "An e-commerce name doesn't live in the address bar — it lives on packaging, shopping bags, live-stream shout-outs and customers retelling it to friends. Shoppers rarely type your domain; they arrive from ads, social content and search. But the name decides whether they trust you with a credit card number, and whether the unboxing moment turns into a referral. So priority one is trust plus camera-readiness: it must look good printed, roll off the tongue, and stick after one hearing. Priority two is search ownership — a generic name (BestShop) means every ad dollar also advertises your competitors, while a distinctive name makes every branded search land exactly on you. Commerce margins reward frugality everywhere except here: losing type-in traffic to a lookalike spelling costs far more than a premium domain ever will.",
      namingIdeas: [
        "Lead with emotion: commerce sells feelings — list ten adjectives you want customers to feel (warm, delighted, calm), then coin from those roots; Glossier is literally bottled \"glossy\"",
        "Name from the founder or a story: personal names and words with provenance carry narrative for your About page and live streams (Burberry); a story-backed name doubles as content",
        "Elevate the category: name the outcome, not the product — Casper sells good sleep, not SleepMattress; customers buy results",
        "Design for sound: plosive openings (b/p/k) cut through spoken ads and short video (Bombas, Peloton); test by reading the name inside an actual ad script",
        "Pre-clear for global: check the name for unfortunate meanings in target-market languages (the classic Nova-in-Spanish trap) and confirm it types easily on local keyboards",
      ],
      cases: [
        { name: "Shein", takeaway: "she + in: two of the simplest English words fused into \"she's in fashion\"; four phonemes readable worldwide — fast fashion needs a fast name, not a clever one" },
        { name: "Etsy", takeaway: "A deliberately meaningless short word: the founders wanted a blank canvas so sellers' goods would define the brand; two distinctive syllables became synonymous with handmade" },
        { name: "Shopify", takeaway: "shop + -ify: \"we make you able to shop-ify\" — the causative suffix packs the platform's mission into one word with strong tool energy" },
        { name: "Glossier", takeaway: "A comparative twist on \"glossy\": one word carrying both the beauty-category cue and a whisper of \"a bit better\", with a French-sounding ending for accessible luxury" },
      ],
      pitfalls: [
        "Stuffing shop/store/mall into the name: you'll blur into marketplace giants and read as a stall, not a brand",
        "Hyphens or digits: fine in print, fatal in spoken ads — \"with a dash in the middle\" kills conversion",
        "Ignoring handle consistency: social platforms are your storefront; if the Instagram/TikTok handle is taken, change the name",
        "Choosing a name before clearing its domain and trademark together — the lookalike squatter always moves faster than you",
      ],
    },
  },
  ai: {
    slug: "ai",
    tlds: [
      { tld: "ai", zh: "AI 产品的身份标签，一个后缀完成定位表达", en: "The identity badge — the suffix alone states your positioning" },
      { tld: "com", zh: "当 AI 只是能力而非全部叙事时，.com 更保品牌纵深", en: "When AI is a capability, not the whole story, .com preserves brand depth" },
      { tld: "dev", zh: "面向开发者的 AI 工具链，.dev 圈内认同度高", en: "For developer-facing AI tooling, .dev earns instant peer credibility" },
    ],
    zh: {
      label: "AI 产品",
      title: "AI 产品怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "AI 产品命名指南：人格化、神话借词、去 AI 化命名等 5 种思路，Claude/Midjourney/Cursor 等案例拆解，.ai 域名的取舍与常见误区，并用 AI 猎取可注册域名。",
      intro:
        "AI 产品命名正处在一个窗口期的尾声：2023 年在名字里塞 AI 是加分项，现在已经开始通货膨胀——当每个产品都叫 XxxAI，AI 二字就失去了信息量。下一阶段的赢家会像当年互联网公司去掉 dot-com 一样「去 AI 化」：名字表达产品的人格与能力，AI 是默认前提而非卖点。AI 命名还有一个独特维度——人格感。用户会和你的产品对话，名字决定了这场对话的心理预设：Claude 像一位同事，Jarvis 像一个管家。最后是速度：.ai 域名与好名字的消耗速度是所有品类里最快的，命名决策要快，且要在候选阶段就实时核验可注册性，否则讨论一周的名字大概率已经没了。",
      namingIdeas: [
        "人格化命名：给 AI 起「人名感」的名字（Claude、Poe），暗示对话性与可信赖；选发音跨语言无障碍的人名变体，避免真实名人",
        "神话与文学借词：Midjourney（旅途之中）、Anthropic（与人相关的）——从神话、哲学、文学里借有深度的词，比 Smart/Brain 类直白词更耐用",
        "工具人格二选一：先定产品是「工具」（Cursor、Copilot，名字指向使用场景）还是「助手」（人格名），两者混搭会稀释定位",
        "去 AI 化前瞻：能不带 AI 就不带——名字里的 AI 五年后会像名字里的「网络」一样多余；用能力词（reason、sense、mind 词根）代替品类词",
        "domain hack 巧用：品牌词以 ai 结尾可断词（bons.ai 式），名字与后缀融为一体，省一个词的长度还多一分巧思",
      ],
      cases: [
        { name: "Claude", takeaway: "经典人名 + 致敬信息论之父 Claude Shannon：一层是亲和的对话人格，一层是给懂行者的彩蛋；两个音节读感极稳" },
        { name: "Midjourney", takeaway: "「旅途中途」的诗意合成词：不提 AI 不提图像，却精准隐喻了人机共创的过程感；证明 AI 产品名可以完全靠意境成立" },
        { name: "Cursor", takeaway: "直接用编辑器里最日常的对象「光标」命名 AI 编辑器：场景词的极致用法——你每天盯着的东西就是品牌本身" },
        { name: "Perplexity", takeaway: "「困惑」一词反向命名答案引擎，同时是语言模型的专业术语（困惑度）：大众读到好奇，从业者读到内行" },
        { name: "Hugging Face", takeaway: "用一个拥抱表情 🤗 做名字：在一片冷冰冰的技术名里用温度差建立辨识度，开源社区的气质与名字互相成就" },
      ],
      pitfalls: [
        "XxxAI 万能公式：辨识度趋零，商标弱，且把品牌绑死在技术叙事上——技术会过时，人格不会",
        "碰瓷式命名：名字刻意贴近 GPT/Gemini 等大厂词根，短期蹭到搜索，长期吃商标函",
        "用「智能/Smart/Genius」自夸：AI 能力应该由产品证明，名字里的聪明反而显得不聪明",
        "定名不核验 .ai 与商标：.ai 消耗速度全品类最快，候选阶段就要实时查，否则白讨论",
      ],
    },
    en: {
      label: "AI products",
      title: "How to Name an AI Product: Strategies, Case Studies & Domains",
      metaDescription:
        "AI product naming guide: persona names, mythic borrowings, the post-AI naming shift, breakdowns of Claude/Midjourney/Cursor, the .ai trade-off and pitfalls — then hunt an available name with AI.",
      intro:
        "AI naming is at the tail end of a window: in 2023, putting \"AI\" in your name added signal; today it's inflating away — when every product is SomethingAI, the letters carry no information. The next winners will drop the AI the way dot-com companies eventually dropped the dot-com: the name expresses the product's persona and capability, with AI as the assumed substrate, not the pitch. AI naming also has a dimension no other category has: persona. Users will talk to your product, and the name sets the psychological frame for that conversation — Claude feels like a colleague, Jarvis like a butler. Finally, speed matters more here than anywhere: .ai domains and good names are being consumed faster than in any other category, so shortlist and verify availability in real time — a name debated for a week is usually gone.",
      namingIdeas: [
        "Name the persona: person-like names (Claude, Poe) signal conversation and trustworthiness; pick name-shaped coinages that pronounce cleanly across languages, and avoid real celebrities",
        "Borrow from myth and literature: Midjourney, Anthropic — words with depth outlast literal Smart/Brain-type labels by years",
        "Choose tool or assistant, not both: tools name the workflow object (Cursor, Copilot); assistants take persona names. Mixing the two dilutes positioning",
        "Skip \"AI\" if you can: in five years it will read like \"cyber\" in a 1998 name; use capability roots (reason, sense, mind) instead of the category label",
        "Exploit the domain hack: if the brand ends in \"ai\", split it (bons.ai) — name and suffix fuse, saving length and adding wit",
      ],
      cases: [
        { name: "Claude", takeaway: "A classic first name doubling as a nod to Claude Shannon: an approachable conversational persona on the surface, an insider Easter egg underneath; two rock-solid syllables" },
        { name: "Midjourney", takeaway: "A poetic compound — no AI, no image, yet it precisely evokes the in-progress feeling of human-machine co-creation; proof an AI name can stand on atmosphere alone" },
        { name: "Cursor", takeaway: "Naming an AI editor after the most-stared-at object in an editor: the scene-word strategy at its purest — the thing you look at all day is the brand" },
        { name: "Perplexity", takeaway: "Naming an answer engine after confusion — which is also the term of art (perplexity) in language modeling: curiosity for the public, a wink for practitioners" },
        { name: "Hugging Face", takeaway: "An emoji as a name: warmth as differentiation in a sea of cold technical names, perfectly matched to its open-source community character" },
      ],
      pitfalls: [
        "The SomethingAI formula: near-zero distinctiveness, weak trademark, and the brand welded to a technology narrative that will age",
        "Adjacency squatting: names engineered to sit near GPT/Gemini roots win short-term search and long-term cease-and-desist letters",
        "Self-praise words (Smart, Genius): intelligence should be demonstrated by the product; claiming it in the name reads as the opposite",
        "Committing before checking .ai and trademarks: this category burns names fastest — verify live at the shortlist stage or the debate is moot",
      ],
    },
  },
  fintech: {
    slug: "fintech",
    tlds: [
      { tld: "com", zh: "金融的信任门槛最高，.com 几乎是硬性要求", en: "Finance has the highest trust bar — .com is close to mandatory" },
      { tld: "co", zh: "品牌词独特时的体面替身，众多新锐金融品牌验证过", en: "A respectable stand-in for distinctive brand words, proven by fintech upstarts" },
      { tld: "io", zh: "面向开发者的金融 API/基础设施可用 .io", en: "Viable for developer-facing financial APIs and infrastructure" },
    ],
    zh: {
      label: "金融科技",
      title: "金融科技产品怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "金融科技命名指南：信任词根、去金融化、单音节力量词等 5 种思路，Stripe/Revolut/Chime 等案例拆解，推荐 TLD 与合规避坑，并用 AI 猎取可注册的金融域名。",
      intro:
        "金融产品的名字先要过「妈妈测试」：你妈敢把工资卡绑在一个叫这个名字的 App 上吗？信任是金融命名的唯一硬通货，其他一切——酷、极客、幽默——都要为它让路。但信任不等于无聊：传统银行用命名传递「厚重」（大量使用 Trust、National、First），金融科技的机会恰恰是用命名传递「轻盈但可靠」——Chime（清脆的铃声）、Stripe（一道条纹）都在用具体、干净的日常意象替代抽象的宏大词。另一条金融特有的红线是合规：多数司法辖区对 Bank、保险、证券类词汇有使用限制，没拿到牌照就叫 XxxBank 可能直接吃监管函。最后，金融决策低频高焦虑，用户会反复搜索比对，名字的搜索独占性直接影响获客成本。",
      namingIdeas: [
        "日常意象替代金融词：用具体、无威胁感的日常物件做词根（Chime 铃声、Stripe 条纹、Acorn 橡果），比 Cash/Pay/Coin 拥挤词根更易独占",
        "单音节力量词：金融名越短越显确定性（Plaid、Brex、Ramp），单音节词自带「说一不二」的气质；从动作词里找（ramp 上坡 = 增长）",
        "增长与安全的双关词根：理财类产品选同时含「生长」与「稳」的意象——Acorn（橡果长成橡树）、Sprout；焦虑感词根（Risk、Bet）留给交易类",
        "去金融化命名：面向年轻用户的产品刻意避开金融词，像消费品一样命名（Venmo、Zelle），降低「谈钱」的心理门槛",
        "合规预检前置：定名前查目标市场的受限词清单（Bank/Insurance/Capital 等在多数辖区受监管），以及商标数据库——金融是商标诉讼最密集的行业之一",
      ],
      cases: [
        { name: "Stripe", takeaway: "一道条纹：把「支付基础设施」这么重的东西命名得像一件白 T 恤——干净、日常、零威胁感；5 个字母的常见词能拿下 .com 是早期决断力的体现" },
        { name: "Revolut", takeaway: "revolution 砍尾造词：保留「革命」的锐气又获得独占性，尾音 -ut 让它在支付语境里像个专有动词" },
        { name: "Chime", takeaway: "到账提醒的那一声「叮」：用产品体验里最愉悦的瞬间命名整个银行，把「收到钱」的多巴胺焊进品牌" },
        { name: "Plaid", takeaway: "格纹面料命名金融数据网络：格纹的「交织」正是账户互联的隐喻，且完全避开了拥挤的金融词根赛道" },
        { name: "蚂蚁（Ant）", takeaway: "以「微小但勤恳」的昆虫命名巨型金融平台：自谦式命名反向建立亲民信任，中文语境「蚂蚁搬家」还自带积少成多的理财隐喻" },
      ],
      pitfalls: [
        "无牌照用 Bank/保险类受限词：不是营销问题是合规问题，多数辖区可直接处罚",
        "Coin/Pay/Cash 词根扎堆：辨识度低且已与加密货币的灰色联想绑定，信任减分",
        "过度极客化：面向大众的钱包叫 0xVault 只会吓跑用户；极客名留给开发者工具",
        "忽略多语言音译：金融品牌出海必查名字在目标市场的谐音（尤其中文语境里的不吉利谐音）",
      ],
    },
    en: {
      label: "Fintech",
      title: "How to Name a Fintech Product: Strategies, Cases & Domains",
      metaDescription:
        "Fintech naming guide: trust-first roots, definancialized names, one-syllable power words, breakdowns of Stripe/Revolut/Chime, TLD picks and compliance traps — then hunt an available name with AI.",
      intro:
        "A fintech name must first pass the mom test: would your mother link her salary account to an app with this name? Trust is the only hard currency in financial naming — cool, geeky and funny all yield to it. But trust doesn't mean boring. Legacy banks encode heaviness (Trust, National, First); fintech's opening is to encode \"light but reliable\" instead — Chime and Stripe both swap grand abstractions for clean, concrete everyday objects. Finance also has a red line other industries don't: regulation. Most jurisdictions restrict words like Bank, insurance and securities terms — calling yourself SomethingBank without a license invites a regulator's letter, not just a rebrand. Finally, financial decisions are low-frequency and high-anxiety; users search and compare repeatedly, so owning your branded search results directly lowers acquisition cost.",
      namingIdeas: [
        "Swap financial words for everyday objects: unthreatening concrete roots (Chime, Stripe, Acorn) are easier to own than the crowded Cash/Pay/Coin lane",
        "Reach for one-syllable power words: short reads decisive (Plaid, Brex, Ramp); mine action words — Ramp literally names growth",
        "Pick dual-meaning roots for wealth products: images that hold both growth and stability (Acorn — the oak inside; Sprout); leave adrenaline roots (Risk, Bet) to trading apps",
        "Definancialize for younger users: name like a consumer product (Venmo, Zelle) to lower the psychological toll of \"talking about money\"",
        "Front-load compliance checks: screen restricted terms (Bank/Insurance/Capital are regulated in most jurisdictions) and the trademark register before falling in love — finance is among the most litigious naming arenas",
      ],
      cases: [
        { name: "Stripe", takeaway: "A stripe: naming something as heavy as payments infrastructure like a plain white tee — clean, everyday, zero menace. Securing a five-letter dictionary .com early was strategy, not luck" },
        { name: "Revolut", takeaway: "Revolution with the tail cut off: keeps the insurgent energy, gains ownability, and the -ut ending makes it behave like a proprietary verb in payment contexts" },
        { name: "Chime", takeaway: "The \"ding\" of money arriving: naming an entire bank after the single most pleasurable moment in its UX, welding the payday dopamine hit to the brand" },
        { name: "Plaid", takeaway: "A woven fabric naming a financial-data network: the interlacing pattern is the metaphor for account connectivity — and it sidesteps the crowded fintech root lane entirely" },
        { name: "Monzo", takeaway: "A coined word chosen partly because it meant nothing and cleared trademarks worldwide — a reminder that in finance, legal clearance is a naming feature, not an afterthought" },
      ],
      pitfalls: [
        "Using restricted words (Bank, insurance terms) without a license: a compliance violation, not a branding choice — regulators can act on it",
        "Piling into Coin/Pay/Cash roots: low distinctiveness, now entangled with crypto's grey associations — a net trust deduction",
        "Over-geeking a consumer product: a mainstream wallet named 0xVault scares the mainstream; save geek names for developer tools",
        "Skipping cross-language sound checks: expanding fintech brands must screen for unlucky homophones in target markets, especially Chinese",
      ],
    },
  },
  pets: {
    slug: "pets",
    tlds: [
      { tld: "com", zh: "宠物电商与订阅服务的主战场，信任与复购都靠它", en: "Where pet commerce and subscriptions live — trust and repeat orders" },
      { tld: "co", zh: "新锐宠物 DTC 品牌的轻快替身", en: "A lighter stand-in favored by new pet DTC brands" },
      { tld: "cn", zh: "面向国内宠物市场，双拼 + .cn 命中率高", en: "For China's pet market, pinyin + .cn has great availability" },
    ],
    zh: {
      label: "宠物品牌",
      title: "宠物品牌怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "宠物品牌命名指南：拟声词、人宠双关、萌感音节等 5 种思路，Chewy/BarkBox/Whiskas 等案例拆解，推荐 TLD 与常见误区，并用 AI 猎取可注册的宠物域名。",
      intro:
        "宠物行业命名有个独特的错位：付钱的是人，被服务的是动物，而名字要同时取悦两者的「情感代理人」——把宠物当家人的主人。所以好的宠物名字几乎都在做一件事：把主人对毛孩子的爱具象化成一个可以说出口的词。它可以是宠物的行为（Chewy 啃咬、Bark 吠叫）、宠物的特征（Whiskas 胡须）、或人宠之间的动作（Fetch 捡球）。音感上，宠物品牌享有其他行业没有的「萌感豁免权」——叠音、拟声、儿化的名字在这里不显幼稚反而加分，这大幅扩展了可用词库。宠物消费高频高复购，名字会被主人在社交内容里反复提及，「晒单友好度」（名字出现在小红书标题里是否可爱）是实打实的增长因素。",
      namingIdeas: [
        "拟声词直取：动物的声音与动作是天然词库（Bark、Chewy、Purr、Woof），一个词就能让人会心一笑，且天然带品类识别",
        "身体特征借代：胡须、爪子、尾巴、肉垫（Whiskas、Paw 词根）——从宠物身上最萌的部位取词，主人秒懂",
        "人宠互动动词：Fetch（捡球）、Cuddle（依偎）、Treat（奖励零食）——命名「关系」而非「产品」，情感浓度更高",
        "叠音与萌系音节：宠物行业可以放心用叠音（旺旺、Bobo 式结构）与 -oo、-y 结尾的软音节，其他行业嫌幼稚的在这里是资产",
        "细分物种预留空间：只做猫的品牌用犬类词根会自缚手脚；若计划全品类，选物种中性的情感词（Chewy 猫狗通用），别用 Paws-for-Dogs 式窄名",
      ],
      cases: [
        { name: "Chewy", takeaway: "「爱啃的」：一个词同时是狗嘴里的玩具和猫抓板的命运，形容词+y 的结构萌感十足；物种中性帮它从狗粮扩到全品类" },
        { name: "BarkBox", takeaway: "bark（吠）+ box（订阅盒）：品类与物种一词各半，头韵 B-B 读起来像狗叫的节奏——订阅制宠物盒的命名天花板", },
        { name: "Whiskas", takeaway: "whiskers（胡须）的变形：猫最标志性的特征做词根，改一个字母获得商标独占；证明「身体部位借代」在宠物界的持久生命力" },
        { name: "Rover", takeaway: "英语世界最经典的狗名直接做遛狗平台名：等于中文里叫「旺财」——零教育成本，听到就知道跟狗有关" },
      ],
      pitfalls: [
        "Pet/Paw 词根扎堆：Paw 系名字在欧美宠物赛道已严重拥挤，搜索与商标双重内卷",
        "锁死单一物种：以犬类词命名后想扩猫线，等于重做品牌；先想清业务边界再定词根",
        "萌过头丢掉专业感：宠物医疗、处方粮类目需要「可爱但可信」，纯卖萌名字撑不起健康类决策",
        "忽略中英文双市场：国内宠物品牌出海常见问题——中文萌名（如叠音）直译后在英文里无感甚至拗口",
      ],
    },
    en: {
      label: "Pet brands",
      title: "How to Name a Pet Brand: Strategies, Case Studies & Domains",
      metaDescription:
        "Pet brand naming guide: onomatopoeia, body-part borrowing, cuteness-licensed syllables, breakdowns of Chewy/BarkBox/Whiskas, TLD picks and pitfalls — then hunt an available pet domain with AI.",
      intro:
        "Pet naming has a built-in displacement: the payer is human, the user is an animal, and the name must charm the emotional proxy between them — an owner who treats the pet as family. So great pet names all do one thing: they compress the owner's affection into a single sayable word. It can be the pet's behavior (Chewy, Bark), a feature (Whiskas — whiskers), or a shared ritual (Fetch). Phonetically, this industry enjoys a cuteness license no other category gets: reduplication, onomatopoeia and soft -oo/-y endings that would read childish elsewhere are assets here, which massively widens the usable word pool. Pet spending is high-frequency and high-repeat; owners name-drop brands constantly in social posts, so \"caption-friendliness\" — whether the name looks adorable in a social media title — is a real growth lever, not a nicety.",
      namingIdeas: [
        "Take the sound directly: animal sounds and behaviors are a free lexicon (Bark, Chewy, Purr, Woof) — one word earns a smile and states the category",
        "Borrow a body part: whiskers, paws, tails, toe beans — the cutest anatomy makes instantly-decoded roots (Whiskas)",
        "Name the ritual, not the product: Fetch, Cuddle, Treat — verbs of the human-pet relationship carry more emotion than any product word",
        "Use the cuteness license: reduplication and soft syllables (-oo, -y endings) are penalized in fintech and rewarded here — exploit the asymmetry",
        "Leave room for species expansion: a dog-rooted name traps a future cat line; if you plan multi-species, pick species-neutral emotional words (Chewy works for both)",
      ],
      cases: [
        { name: "Chewy", takeaway: "\"Loves to chew\": one adjective covering both the dog toy's fate and the cat scratcher's; the -y ending maxes cuteness, and species neutrality let it grow from dog food to everything" },
        { name: "BarkBox", takeaway: "bark + box: species and business model in one compound, with B-B alliteration that reads like a dog's rhythm — the ceiling of subscription-box pet naming" },
        { name: "Whiskas", takeaway: "A one-letter twist on \"whiskers\": the cat's most iconic feature as root, mutated just enough to own the trademark — body-part borrowing at its most durable" },
        { name: "Rover", takeaway: "The most classic dog name in English, used straight as a dog-walking platform: zero education cost — hearing it, you already know it's about dogs" },
      ],
      pitfalls: [
        "Crowding into Pet/Paw roots: the Paw-something lane is saturated in Western markets — a search and trademark double squeeze",
        "Locking into one species: rebranding is the price of expanding a dog-named brand into cat products; settle the business boundary before the root word",
        "Overdosing on cute: pet health, vet care and prescription food need \"adorable but credible\" — pure cuteness can't carry a medical decision",
        "Ignoring the bilingual market: Chinese reduplicated cute names often flatten or stumble when transliterated to English — test both directions early",
      ],
    },
  },
  blog: {
    slug: "blog",
    tlds: [
      { tld: "com", zh: "内容要经营十年以上，.com 的稳定与迁移友好最重要", en: "Content compounds over decades — .com's stability matters most" },
      { tld: "dev", zh: "技术博客的圈内标配，yourname.dev 干净专业", en: "The standard for engineering blogs — yourname.dev is clean and professional" },
      { tld: "org", zh: "知识库与非商业写作，.org 的公信力气质契合", en: "For knowledge bases and non-commercial writing, .org's credibility fits" },
    ],
    zh: {
      label: "个人博客",
      title: "个人博客怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "个人博客与内容站命名指南：真名策略、意象命名、栏目化命名等 5 种思路，Wait But Why/阮一峰周刊等案例拆解，推荐 TLD 与误区，并用 AI 猎取可注册的博客域名。",
      intro:
        "博客命名和商业品牌命名的最大区别是时间尺度：产品可以改名重来，但博客是你思想的地址，读者靠这个名字在多年后找回你。所以第一决策不是「叫什么」而是「以谁的身份写」——用真名（yourname.dev/com）积累的是个人声誉，跟着你换工作、换领域；用笔名或站名（Wait But Why）积累的是一个「刊物」，可以大于你本人也可以被转手。第二个特点是博客名允许「慢热」：它不需要在广告位一秒抓人，但要经得起在文末署名、被人引用、印在读者记忆里十年。文艺、克制、有余味的名字在这里比在任何商业场景都更值钱。最后别忘了 RSS 与搜索时代的遗产仍在：名字的独特性决定了读者能否在搜索框里用两个词准确召回你。",
      namingIdeas: [
        "真名优先原则：如果写作服务于职业声誉（技术、学术、行业观察），直接 yourname + .dev/.com，每篇文章都在给同一个名字复利",
        "意象命名：选一个承载写作气质的具体意象——园地、灯塔、书房、路上（数字花园 Digital Garden 已成博客亚文化词根），读者记住的是画面",
        "栏目化命名：「XX周刊」「XX手记」式结构（阮一峰的科技爱好者周刊）——名字自带更新节奏承诺，适合以坚持为卖点的写作",
        "一句话截取：从你最想写的那句话里截两三个词做名（Wait But Why 就是一句口头禅），天然有语感且几乎不会撞名",
        "双语预检：中文博客若可能被英文世界引用，确认名字有一个体面的拉丁字母形态（拼音或意译），别让引用者无从下手",
      ],
      cases: [
        { name: "Wait But Why", takeaway: "口头禅直接做站名：三个最简单的英文词组成一个「勾子」，名字本身就是文章的开头——你忍不住想知道 why 什么" },
        { name: "阮一峰的网络日志", takeaway: "真名 + 最朴素的品类词：二十年不换名，让「阮一峰」三个字本身成为技术写作的质量背书——真名策略的中文最佳示范" },
        { name: "Stratechery", takeaway: "strategy + tech 的合成词：一个词说清「科技战略分析」的定位，生造词的独特性让它在搜索里绝对独占" },
        { name: "Astral Codex Ten", takeaway: "刻意的神秘主义命名（前身 Slate Star Codex 是作者真名的变位词）：名字本身是谜题，与其理性主义社区的气质互为暗号" },
      ],
      pitfalls: [
        "名字绑定平台或技术：叫「XX 的 Hexo 小站」，换框架就尴尬；名字只绑内容与人格，不绑工具",
        "过度谦虚的通用名：「随笔」「杂记」「小站」无法被搜索召回，等于放弃了积累辨识度",
        "域名跟着博客名走而非人走：热情消退改站名是常态，真名域名永远不过期——不确定时选真名",
        "忽略 RSS 与引用场景：名字太长或含特殊字符，在订阅器列表与他人引用里都会被截断变形",
      ],
    },
    en: {
      label: "Blogs",
      title: "How to Name a Personal Blog: Strategies, Cases & Domains",
      metaDescription:
        "Blog and content-site naming guide: real-name strategy, imagery names, publication-style names, breakdowns of Wait But Why/Stratechery, TLD picks and pitfalls — then hunt an available blog domain with AI.",
      intro:
        "Blog naming differs from brand naming in one dimension above all: time. A product can rebrand; a blog is the address of your thinking, the name readers use to find their way back years later. So the first decision isn't \"what to call it\" but \"who is writing\": a real name (yourname.dev/.com) compounds personal reputation that follows you across jobs and fields; a pen name or masthead (Wait But Why) builds a publication that can outgrow you or be handed over. Second, blog names are allowed to be slow burners — they don't need to grab in an ad slot, but they must age well in bylines, citations and readers' memories over a decade. Restraint and resonance are worth more here than anywhere in commerce. And the search-and-RSS legacy still applies: distinctiveness decides whether two words typed into a search box can reliably summon you.",
      namingIdeas: [
        "Default to your real name: if writing serves professional reputation (engineering, research, industry analysis), yourname + .dev/.com lets every post compound into one identity",
        "Name an image: pick a concrete object that carries your writing's temperament — a garden, lighthouse, workshop, road (the \"digital garden\" is already a blog subculture); readers remember pictures",
        "Name like a publication: Weekly/Notes/Letters structures promise a cadence (Stratechery's Daily Update) — good when consistency is the product",
        "Clip a phrase: take two or three words from the sentence you most want to write (Wait But Why is a verbal tic turned masthead) — natural cadence, near-zero collision",
        "Pre-check both scripts: if your non-English blog might be cited in English, make sure the name has a dignified Latin-alphabet form before someone else improvises one",
      ],
      cases: [
        { name: "Wait But Why", takeaway: "A verbal tic as a masthead: three of the simplest words forming a hook — the name itself is the start of an article; you need to know why what" },
        { name: "Stratechery", takeaway: "strategy + tech fused into one coinage: the positioning stated in a single invented word, with absolute search ownership as the bonus" },
        { name: "Astral Codex Ten", takeaway: "Deliberate mysticism (its predecessor Slate Star Codex anagrammed the author's name): the name is itself a puzzle — a handshake with its rationalist readership" },
        { name: "Daring Fireball", takeaway: "An evocative two-word image with no literal link to Apple commentary: proof that a strong, consistent voice can pour meaning into any sufficiently distinctive vessel" },
      ],
      pitfalls: [
        "Binding the name to a platform or tool (\"My Hexo Site\"): names should bind to content and voice, never to migratable infrastructure",
        "Over-humble generic names (Notes, Musings, My Little Corner): unsummonable by search — you're forfeiting the compounding of recognition",
        "Letting the domain follow the blog name instead of the person: enthusiasm fades and rebrands happen; a real-name domain never expires with a phase — when unsure, choose your own name",
        "Ignoring RSS and citation contexts: long names or special characters get truncated and mangled in feed readers and reference lists",
      ],
    },
  },
  game: {
    slug: "game",
    tlds: [
      { tld: "com", zh: "游戏官网与品牌主站的默认选择", en: "The default for game sites and brand homes" },
      { tld: "io", zh: ".io 游戏已成品类名——轻量网页游戏的天然后缀", en: "\".io games\" became a genre — the native suffix of lightweight web games" },
      { tld: "tv", zh: "游戏直播与赛事内容用 .tv 自解释", en: "Game streaming and esports content self-explains on .tv" },
    ],
    zh: {
      label: "游戏",
      title: "游戏与游戏工作室怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "游戏命名指南：世界观词、动词感、.io 品类现象等 5 种思路，Minecraft/Hades/Among Us 等案例拆解，推荐 TLD 与常见误区，并用 AI 猎取可注册的游戏域名。",
      intro:
        "游戏命名要区分两个对象：游戏作品名和工作室名，策略几乎相反。作品名是「一次性烟花」——它要在商店列表的 0.5 秒滑动里钩住眼球，要能被主播顺口喊出来，要在搜索里躲开同名电影和歌曲；工作室名则是「持久火种」——它要能装下你未来十年风格迥异的作品（Supercell 与它的每个游戏名都毫无关系）。网页游戏还有一个独特现象：.io 后缀因 Agar.io、Slither.io 而从域名后缀升格为品类名，「io 游戏」本身成了玩家搜索词——这是域名后缀反向定义游戏类型的唯一案例。命名时还要考虑「可喊性」：游戏靠直播与短视频传播，名字会被成千上万次喊出来，音节的爽感直接影响传播效率。",
      namingIdeas: [
        "世界观词打底：从游戏世界的核心名词取名（Minecraft = mine + craft，两个核心动作），玩家读到名字就在预习玩法",
        "神话与专名借力：Hades、Valheim（北欧词根造词）——神话词自带史诗感与文化厚度，且公版无版权；注意查同名作品避免搜索混战",
        "动词感与喊感：会被主播反复喊的名字要有爆发音与节奏（Fortnite、Splatoon），测试方法是模拟一句「今晚来打 X」是否顺口",
        "作品名与工作室名分离：工作室名选与任何题材都兼容的抽象词（Supercell、miHoYo），别让第一款游戏的题材锁死公司名",
        "网页小游戏拥抱 .io：轻量多人网页游戏用 name.io 等于自带品类标签，玩家搜「io games」时你天然在场",
      ],
      cases: [
        { name: "Minecraft", takeaway: "mine（挖）+ craft（造）：游戏的两个核心循环直接拼成名字，玩家没进游戏就懂了玩法——「玩法即名字」的巅峰" },
        { name: "Hades", takeaway: "直接用冥王本名：单词自带整个希腊神话世界观，两音节喊感极佳；公版神话词的教科书用法" },
        { name: "Among Us", takeaway: "「在我们之中」：一个介词短语精准命中「内鬼就在身边」的核心恐惧，日常短语做名反而在商店列表里最扎眼" },
        { name: "Slither.io", takeaway: "slither（蛇行）+ .io：动词选得精准，后缀直接宣告品类——它和 Agar.io 一起把一个域名后缀变成了游戏类型名" },
        { name: "Supercell", takeaway: "「超级单体雷暴」：与任何游戏题材无关的自然现象词，隐喻「小团队爆发大能量」的组织哲学——工作室名与作品名分离策略的标杆" },
      ],
      pitfalls: [
        "作品名与大 IP 撞车：与热门电影/动漫同名会在搜索与商店里被淹没，上架前先搜三遍",
        "工作室名绑死题材：叫「像素骑士工作室」就很难再发科幻游戏，公司名要装得下十年野心",
        "生造词无法发音：玩家喊不出来的名字不会被直播传播——Xyzzryth 式名字再酷也是自闭品牌",
        "忽略商标分类：游戏名商标要覆盖第 9/41 类，且 Steam/App Store 的名称冲突政策各有一套，都要提前查",
      ],
    },
    en: {
      label: "Games",
      title: "How to Name a Game or Game Studio: Strategies, Cases & Domains",
      metaDescription:
        "Game naming guide: worldbuilding roots, shoutability, the .io genre phenomenon, breakdowns of Minecraft/Hades/Among Us, TLD picks and pitfalls — then hunt an available game domain with AI.",
      intro:
        "Game naming splits into two problems with nearly opposite strategies: the game's name and the studio's name. A game title is a firework — it must hook the eye in the half-second of a store-list scroll, be shoutable by streamers, and dodge same-named movies and songs in search. A studio name is a hearth — it must hold ten years of stylistically unrelated titles (Supercell shares nothing with any of its games' names). Web games add a phenomenon unique in all of naming: the .io suffix, propelled by Agar.io and Slither.io, was promoted from domain ending to genre name — players literally search \"io games\". It remains the only case of a TLD defining a game category. Above all, weigh shoutability: games spread through streams and short video, where the name gets yelled thousands of times — the phonetic punch of those syllables is distribution efficiency.",
      namingIdeas: [
        "Build from the world's core nouns: Minecraft is mine + craft, the two core loops fused — reading the name is previewing the gameplay",
        "Borrow myth and public-domain names: Hades, Valheim (Norse-rooted coinage) — epic weight and cultural depth, copyright-free; just check for same-named works to avoid a search brawl",
        "Optimize for the shout: names streamers will yell need plosives and rhythm (Fortnite, Splatoon); test with \"wanna play X tonight?\" out loud",
        "Separate studio from title: studios should take theme-agnostic abstract words (Supercell, miHoYo) so the first game's genre never cages the company",
        "Embrace .io for web games: a lightweight multiplayer game on name.io carries its own genre tag — when players search \"io games\", you're already there",
      ],
      cases: [
        { name: "Minecraft", takeaway: "mine + craft: the two core loops welded into one word — players understand the gameplay before installing. The peak of \"the mechanic is the name\"" },
        { name: "Hades", takeaway: "The god's own name: one word imports the entire Greek mythos; two shoutable syllables — the textbook use of public-domain myth" },
        { name: "Among Us", takeaway: "A plain prepositional phrase nailing the core dread — the impostor is among us; everyday words turn out to be the most conspicuous thing in a store list" },
        { name: "Slither.io", takeaway: "A precisely-chosen verb plus the suffix that declares the genre — together with Agar.io it turned a TLD into a category of games" },
        { name: "Supercell", takeaway: "A storm-cell term unrelated to any game theme, metaphorizing \"small teams, massive energy\" — the benchmark of studio-title separation" },
      ],
      pitfalls: [
        "Colliding with big IP: sharing a name with a hit movie or anime buries you in search and store results — search three times before shipping",
        "Welding the studio to a genre: \"Pixel Knight Studio\" can't credibly ship sci-fi; the company name must hold a decade of ambition",
        "Unpronounceable coinages: a name players can't say won't be streamed — Xyzzryth is a cool logo and a dead brand",
        "Skipping trademark classes: game marks need class 9/41 coverage, and Steam and the App Store each run their own name-collision policies — clear all of them early",
      ],
    },
  },
  edu: {
    slug: "edu",
    tlds: [
      { tld: "com", zh: "面向家长与成人学习者付费的产品，.com 信任度最稳", en: "For products parents and adult learners pay for, .com trust is steadiest" },
      { tld: "org", zh: "公益属性或开放课程项目，.org 的非商业气质加分", en: "For open-education and mission-driven projects, .org's non-commercial aura helps" },
      { tld: "app", zh: "学习工具类 App 用 .app 零解释成本", en: "Learning-tool apps explain themselves on .app" },
    ],
    zh: {
      label: "教育产品",
      title: "教育产品怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "教育科技命名指南：双重受众、成长隐喻、去说教化等 5 种思路，Duolingo/Khan Academy/Coursera 等案例拆解，推荐 TLD 与误区，并用 AI 猎取可注册的教育域名。",
      intro:
        "教育产品的名字要同时通过两道审查：付钱的人（家长、HR、成人学习者的「自律人格」）要读出可靠与效果，用的人（孩子、员工、成人学习者的「懒惰人格」）要读出有趣与无压力。这两种气质天然打架——太严肃劝退使用者，太活泼吓退付费者——好的教育命名都在这条钢丝上找平衡点：Duolingo 用一只猫头鹰的滑稽感包住「每天打卡」的纪律。第二个关键是「成长感」：教育卖的是从 A 到 B 的变化，名字里含有生长、路径、点亮类意象的词根天然契合。还有一条与信任相关的红线：Academy、University 类词在部分辖区有资质要求，机构感的词也会抬高用户对「体系化」的预期——名字承诺的严谨度，产品必须接得住。",
      namingIdeas: [
        "双人格平衡：先明确付费者与使用者是否同一人；分离时（K12）名字向付费者的「可靠」倾斜、吉祥物向使用者的「有趣」倾斜（Duolingo + 猫头鹰的分工）",
        "成长隐喻词根：sprout（发芽）、path（路径）、summit（登顶）、spark（点亮）——教育卖变化，名字里预埋「从 A 到 B」的方向感",
        "去说教化：成人学习产品避开 Learn/Study/Master 等作业感词根，用结果词（Fluent 流利）或体验词（Brilliant 聪明）替代——用户想变好，不想被教育",
        "知识意象库：灯、火、钥匙、桥、树是教育命名的公版意象（Blackboard 反其道用黑板），选一个再变形，比抽象词更易记",
        "资质词慎用：Academy/Institute/University 在部分辖区受监管，且抬高体系化预期；轻量工具用轻名字，别用机构名压垮小产品",
      ],
      cases: [
        { name: "Duolingo", takeaway: "duo（双）+ lingo（语言的俚语说法）：「两种语言」的直白拼接，lingo 一词自带不正经的轻松感，精准中和了语言学习的苦役感" },
        { name: "Khan Academy", takeaway: "创始人姓氏 + Academy：个人授课起家的真诚感与机构词的可靠感结合——「一个人的学院”反而成了非营利教育的信任标志" },
        { name: "Coursera", takeaway: "course + -era（时代）：一词双关「课程」与「新纪元」，天然携带「在线课程时代来了」的宏大叙事，适合平台级野心" },
        { name: "Brilliant", takeaway: "直接用「聪明的/闪耀的」做名：把学习结果（变聪明）当名字，用户每次打开 App 都在被暗示自己的目标——结果词命名的极致" },
      ],
      pitfalls: [
        "作业感词根堆砌：Learn/Study/Tutor 类名字让成人用户想起被支配的恐惧，转化率隐性受损",
        "无资质用 University/学院类词：部分辖区有监管要求，且名不副实会反噬信任",
        "只讨好孩子不讨好家长：K12 产品名过度卡通化，家长在支付页会犹豫——付费者的审查永远在场",
        "忽略发音的课堂场景：名字会被老师在课堂反复念出，拗口或歧义的读音会在真实教室里被放大",
      ],
    },
    en: {
      label: "Education",
      title: "How to Name an Education Product: Strategies, Cases & Domains",
      metaDescription:
        "EdTech naming guide: the dual-audience balance, growth metaphors, de-schooled naming, breakdowns of Duolingo/Khan Academy/Coursera, TLD picks and pitfalls — then hunt an available edu domain with AI.",
      intro:
        "An education name must clear two reviews at once: the payer (a parent, an HR manager, or the adult learner's disciplined self) needs to read reliability and results, while the user (a child, an employee, or that same adult's lazy self) needs to read fun and low pressure. These pull in opposite directions — too solemn repels the user, too playful spooks the payer — and every great EdTech name is a balancing act on that wire: Duolingo wraps daily-streak discipline inside the silliness of an owl. The second key is a sense of growth: education sells the change from A to B, so roots carrying sprouting, paths, summits and sparks fit natively. And there's a trust-related red line: words like Academy and University face accreditation rules in some jurisdictions, and institutional words raise expectations of rigor — the name's promise is a bar your curriculum must actually clear.",
      namingIdeas: [
        "Balance the two personas: decide whether payer and user are the same person; when they split (K-12), tilt the name toward the payer's \"reliable\" and the mascot toward the user's \"fun\" — the Duolingo-plus-owl division of labor",
        "Mine growth metaphors: sprout, path, summit, spark — education sells A-to-B change, so bake directionality into the root",
        "De-school the vocabulary: for adult learners, avoid homework words (Learn/Study/Master) in favor of outcome words (Fluent) or identity words (Brilliant) — people want to improve, not to be schooled",
        "Draw from the knowledge-imagery commons: lamps, flames, keys, bridges and trees are education's public-domain images (Blackboard inverted the trope); pick one and twist it — concrete beats abstract for recall",
        "Handle credential words with care: Academy/Institute/University are regulated in some jurisdictions and inflate expectations of structure; light tools deserve light names",
      ],
      cases: [
        { name: "Duolingo", takeaway: "duo + lingo: \"two languages\" in plain parts, with lingo's slangy looseness neutralizing the drudgery of language study — the dual-persona balance in a single word" },
        { name: "Khan Academy", takeaway: "A founder's surname plus Academy: one-tutor sincerity fused with institutional reliability — \"one man's academy\" became the trust mark of non-profit education" },
        { name: "Coursera", takeaway: "course + -era: a pun holding both \"courses\" and \"a new age\", carrying the grand narrative of the online-course era — sized for platform ambition" },
        { name: "Brilliant", takeaway: "The learning outcome as the name: every app open re-suggests the user's own goal of becoming brilliant — outcome-word naming at its purest" },
      ],
      pitfalls: [
        "Piling on homework roots: Learn/Study/Tutor names trigger memories of being schooled and quietly tax adult conversion",
        "Using University/Academy words without accreditation: regulated in some jurisdictions, and over-promising rigor backfires on trust",
        "Charming only the child: over-cartooned K-12 names make parents hesitate at checkout — the payer's review never leaves the room",
        "Forgetting the classroom read-aloud: teachers will say the name out loud daily; awkward or ambiguous pronunciations get amplified in a real classroom",
      ],
    },
  },
  travel: {
    slug: "travel",
    tlds: [
      { tld: "com", zh: "预订涉及付款与行程，.com 的信任感直接影响转化", en: "Bookings involve money and itineraries — .com trust converts" },
      { tld: "co", zh: "新锐旅行品牌的利落替身，社媒露出更轻盈", en: "A sleek stand-in for young travel brands, lighter on social" },
      { tld: "me", zh: "个人旅行博主与行程定制师的天然人称后缀", en: "A natural personal suffix for travel bloggers and trip planners" },
    ],
    zh: {
      label: "旅行",
      title: "旅行品牌怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "旅行品牌命名指南：目的地联想、动词化出发感、避开 travel 词根堆砌等思路，Airbnb/Klook/Booking 案例拆解，推荐 TLD 与避坑清单，并用 AI 猎取可注册的旅行域名。",
      intro:
        "旅行名字卖的是「出发前的想象」：用户在下单前已经在脑中预演了那趟旅程，名字要能接住这种期待感。好的旅行品牌名自带画面——远方、风、清晨的陌生街道——而不是复述「订票订房」这个动作。同时旅行决策链路长、比价频繁，用户会在多个 tab 之间跳来跳去，名字必须在一堆比价标签页里一眼被认出来。旅行还是强口碑品类：朋友一句「我用 X 订的」抵得过十次广告，所以名字要经得起口头转述，听一遍就能拼出来。最后注意场景跨度：同一个名字要在机场广告牌、App 图标和客服电话里都成立。",
      namingIdeas: [
        "卖想象不卖流程：从「远方感」词库取材——wander、nomad、horizon、departure；先写下你想让用户想起的那个瞬间，再为瞬间造词",
        "动词化出发感：能放进「走，X 一下」句式的名字自带行动号召；测试方法是把名字放进朋友约行程的对话里念",
        "在地词升维：目的地文化词（如日语的「旅」、西语的 vamos）能瞬间定调，但要先查目标客群的认知度与发音门槛",
        "避开 travel/trip/tour 词根堆砌：这些词根已被上万旅行社占满，搜索结果里挤不进第一屏，商标也几乎注不下来",
        "音节控制在三个以内：机场信号差时口头报名字给同伴搜索是真实场景，长名字的错拼率随音节数陡增",
      ],
      cases: [
        { name: "Airbnb", takeaway: "air bed and breakfast 的缩合：把「气垫床借宿」的寒酸出身压缩成一个完全独占的新词，随业务升级反而越来越像品牌而非描述" },
        { name: "Klook", takeaway: "keep looking 的缩合，两个爆破音干脆利落；在中英双语市场都好念好记，是面向亚洲旅行者的音感优等生" },
        { name: "Booking.com", takeaway: "品类词直接当品牌，赌的是规模碾压——普通品牌学不来，但它反证了「品类词打法需要垄断级预算」这条规则" },
        { name: "Expedia", takeaway: "从 expedition（远征）造词，保留探险联想又完全可注册；-ia 结尾自带「一片新大陆」的地名感，与旅行品类天然契合" },
      ],
      pitfalls: [
        "堆砌 travel/trip/tour：与上万同行撞车，SEO 与商标双输",
        "名字锁死单一目的地或品类：业务从民宿扩到跟团游时，「XX海岛游」类名字会变成天花板",
        "忽略多语言发音：全球旅行者会用各种口音念你的名字，含 th/r-l 混淆音的名字在亚洲市场折损明显",
        "只查域名不查社交与商标：旅行品牌高度依赖 Instagram/小红书，同名账号被占等于名字残缺",
      ],
    },
    en: {
      label: "Travel",
      title: "How to Name a Travel Brand: Strategies, Cases & Domains",
      metaDescription:
        "Travel naming guide: sell the imagination not the booking flow, verb-able departure energy, breakdowns of Airbnb/Klook/Expedia, TLD picks and pitfalls — then hunt an available travel domain with AI.",
      intro:
        "A travel name sells the imagination before the trip: customers have already rehearsed the journey in their heads before they pay, and the name has to catch that anticipation. Great travel names carry a picture — distance, wind, an unfamiliar street at dawn — instead of restating the booking transaction. Travel decisions are also long and comparison-heavy: users bounce between a dozen tabs, so the name must be recognizable at a glance in a row of price-comparison tabs. It's a word-of-mouth category too — one friend saying \"I booked it on X\" beats ten ads — so the name must survive spoken relay: hear it once, spell it right. Finally, mind the range of surfaces: the same name has to work on an airport billboard, an app icon, and a customer-service call.",
      namingIdeas: [
        "Sell the imagination, not the process: mine the far-away lexicon — wander, nomad, horizon, departure; write down the moment you want users to picture, then coin for that moment",
        "Make it verb-able: a name that fits \"let's X it\" carries its own call to action; test it inside a real trip-planning conversation between friends",
        "Elevate a local word: cultural words (tabi, vamos) set the tone instantly — but check recognition and pronunciation friction with your actual audience first",
        "Avoid travel/trip/tour pile-ups: tens of thousands of agencies already squat on those roots; you'll never own search page one or the trademark",
        "Keep it under three syllables: shouting a name to a friend over bad airport Wi-Fi is a real scenario, and typo rates climb with every syllable",
      ],
      cases: [
        { name: "Airbnb", takeaway: "A contraction of \"air bed and breakfast\": the scrappy origin compressed into a fully ownable coinage that grew more brand-like as the business outgrew the description" },
        { name: "Klook", takeaway: "From \"keep looking\", two crisp plosives; equally easy in English and Chinese-speaking markets — a phonetic straight-A for Asia-facing travel" },
        { name: "Booking.com", takeaway: "The category word as the brand — a bet only monopoly-scale budgets can make; it proves the rule rather than offering a playbook" },
        { name: "Expedia", takeaway: "Coined from \"expedition\": keeps the adventure association while being registrable; the -ia ending adds a new-continent, place-name feel native to travel" },
      ],
      pitfalls: [
        "Stacking travel/trip/tour roots: you collide with thousands of peers and lose both SEO and trademark",
        "Locking the name to one destination or format: \"IslandToursXX\" becomes a ceiling the day you add city trips",
        "Ignoring multilingual pronunciation: global travelers will say your name in every accent; th-sounds and r/l ambiguity tax Asian markets",
        "Checking the domain but not the socials: travel brands live on Instagram; a squatted matching handle leaves the name incomplete",
      ],
    },
  },
  food: {
    slug: "food",
    tlds: [
      { tld: "com", zh: "外卖与到店都认的默认后缀，长辈客群尤其信任", en: "The default both delivery and dine-in customers trust" },
      { tld: "co", zh: "新消费餐饮品牌的轻巧替身，菜单上更利落", en: "A neat stand-in for new F&B brands, cleaner on menus" },
      { tld: "cn", zh: "国内连锁与小程序生态的合规首选", en: "The compliance-first pick for China chains and mini-programs" },
    ],
    zh: {
      label: "餐饮美食",
      title: "餐饮品牌怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "餐饮品牌命名指南：味觉通感、场景锚定、方言人情味等思路，喜茶/Shake Shack/奈雪案例拆解，推荐 TLD 与避坑清单，并用 AI 猎取可注册的餐饮域名。",
      intro:
        "餐饮名字要在三个地方同时打赢：门头（三米外一眼看清）、外卖列表（一屏几十家里被点开）、朋友的嘴（「今天吃 X 吧」说得顺口）。它是所有品类里「口头使用频率」最高的名字——用户每周都会说出它，所以顺口是硬指标，拗口的名字每天都在流失推荐。餐饮名字还要能唤起味觉与温度：好名字念出来就有画面、甚至有口水（想想「喜茶」的喜与「Shake Shack」的摇晃感）。最后别忘了扩张预留：从一家店到连锁、从单品到全品类，名字锁得太死会变成天花板。",
      namingIdeas: [
        "味觉通感：把口感、温度、声音写进名字——脆、烫、冒、摇（Shake）；先列出你家招牌菜入口那三秒的感受词，再从中造名",
        "场景锚定：把「什么时候来吃」写进名字（深夜食堂式），让名字自带消费提示；适合定位鲜明的单场景品牌",
        "情绪好彩头：中文餐饮里「喜、乐、旺、福」是经久不衰的流量密码，关键是配一个反差的现代词避免土味（喜茶 = 喜 + 茶的极简组合）",
        "人名与方言的人情味：老板名字或方言词自带故事与地域认同（如「阿婆家」），连锁化时故事就是培训教材",
        "念三遍测试：把名字放进「今天吃 X 吧」「帮我带一份 X」两个句式各念三遍，任何一次卡壳就换",
      ],
      cases: [
        { name: "喜茶", takeaway: "「喜」的情绪价值 + 「茶」的品类词，两字组合极简到无法再减；从皇茶改名的历史反而证明：独占性是餐饮名字的生死线" },
        { name: "Shake Shack", takeaway: "shake（奶昔/摇晃）+ shack（小棚屋）：头韵 + 双爆破音，念出来就有节奏感；小棚屋的谦逊感恰好中和了排队名店的距离感" },
        { name: "奈雪的茶", takeaway: "创始人昵称「奈雪」+ 品类后缀：人名自带温度与故事，「的茶」把品类说清——人名 + 品类的教科书结构" },
        { name: "Chipotle", takeaway: "直接用一种烟熏辣椒的名字：具体的食材词比抽象的「美味」可信一百倍，还顺带完成了风味教育" },
      ],
      pitfalls: [
        "生僻字与多音字：门头认不出、外卖搜不到、朋友不敢念——三输",
        "名字锁死单品：「XX烤鱼」在你上新火锅时就是天花板，除非战略上就做单品之王",
        "谐音梗过度：第一次听会笑，第十次听会腻，连锁化后更是包袱；谐音要服务于好记，不是段子",
        "忽略外卖平台搜索：名字里完全没有品类线索时，新客在平台里搜不到你；纯造词品牌要靠副标题补位",
      ],
    },
    en: {
      label: "Food & dining",
      title: "How to Name a Food Brand: Strategies, Cases & Domains",
      metaDescription:
        "F&B naming guide: taste synesthesia, scene anchoring, founder warmth, breakdowns of HEYTEA/Shake Shack/Chipotle, TLD picks and pitfalls — then hunt an available food domain with AI.",
      intro:
        "A food name has to win in three places at once: the storefront (legible from three meters), the delivery-app list (tapped among dozens on one screen), and your customers' mouths (\"let's get X today\" must roll off the tongue). No other category gets spoken this often — customers say the name weekly, so speakability is a hard requirement; a clunky name leaks referrals daily. Great food names also trigger taste and temperature: said aloud, they conjure a picture, even an appetite (feel the motion in \"Shake Shack\"). And leave room to grow: from one shop to a chain, from a single dish to a full menu, a name locked too tight becomes a ceiling.",
      namingIdeas: [
        "Taste synesthesia: write texture, heat and sound into the name — crisp, sizzle, shake; list the three-second sensation of your signature dish, then coin from it",
        "Anchor a scene: bake \"when to come\" into the name (the late-night-diner move); powerful for sharply positioned single-occasion brands",
        "Lucky-emotion words: joy, treat, golden — evergreen in food; the trick is pairing them with a modern counterweight so they read fresh, not folksy",
        "Founder names and dialect warmth: a person's name or a local word carries story and belonging; when you franchise, the story becomes the training manual",
        "The say-it-three-times test: put the name into \"let's get X\" and \"grab me an X\" and say each three times — one stumble and it's out",
      ],
      cases: [
        { name: "HEYTEA", takeaway: "An emotion word plus the category word, reduced to the minimum; its forced rename from a squatted mark proves ownability is life-or-death in F&B" },
        { name: "Shake Shack", takeaway: "shake + shack: alliteration and double plosives give it rhythm out loud; the humble \"shack\" neutralizes the distance of a line-out-the-door hotspot" },
        { name: "Chipotle", takeaway: "Literally a smoked chili: a concrete ingredient word is a hundred times more credible than abstract \"delicious\" — and it teaches the flavor as it brands" },
        { name: "Pret A Manger", takeaway: "French for \"ready to eat\": borrowed language adds café polish while the meaning stays honest — imported words work when they decode effortlessly" },
      ],
      pitfalls: [
        "Obscure spellings: illegible on the storefront, unsearchable in delivery apps, unsayable by friends — a triple loss",
        "Locking onto one dish: \"XX Grilled Fish\" caps you the day hotpot joins the menu — unless single-dish dominance is the strategy",
        "Over-punning: funny the first time, tiring the tenth, a liability at chain scale; puns should serve memory, not comedy",
        "Ignoring delivery-platform search: a pure coinage with zero category cue is invisible to new customers searching the platform; back it with a descriptive tagline",
      ],
    },
  },
  fitness: {
    slug: "fitness",
    tlds: [
      { tld: "com", zh: "会员付费与私教预约的信任基线", en: "The trust baseline for memberships and coaching payments" },
      { tld: "io", zh: "健身科技与数据向产品的圈内后缀", en: "The insider suffix for fitness-tech and data-driven products" },
      { tld: "app", zh: "健身 App 的天然后缀，强制 HTTPS 加分", en: "Natural for fitness apps, with zone-wide HTTPS as a bonus" },
    ],
    zh: {
      label: "健身健康",
      title: "健身健康品牌怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "健身健康品牌命名指南：身份感命名、能量音节、避开说教词根等思路，Peloton/Keep/Strava 案例拆解，推荐 TLD 与避坑清单，并用 AI 猎取可注册的健身域名。",
      intro:
        "健身名字卖的不是器械和课程，是「用户想成为的那个自己」。人们买的是身份——更自律、更强、更轻盈的那个版本，所以好的健身名字是一枚身份徽章：说「我在用 X」时要有一点小骄傲。第二个关键是能量感：健身名字会被印在运动服上、喊在训练营里、晒在打卡贴里，音节要短促有力，念出来自带心率。同时要避开说教感——「督促、监督、燃烧脂肪」这类词让人想起被支配的恐惧，负罪感营销正在退潮，陪伴感与成就感才是主流叙事。",
      namingIdeas: [
        "身份徽章命名：先写下用户想成为的形容词（强、轻盈、自律），再造一个能骄傲地印在T恤上的词；测试是想象它出现在健身房自拍的标签里",
        "能量音节：爆破音开头（p/b/k）+ 两音节以内，念出来像口号（Peloton 的节奏感）；避免绵软的鼻音收尾",
        "动作与坚持的意象：跑、举、climb、rep、streak——把「重复与坚持」这个健身本质写进词根，Keep 是教科书",
        "避开说教与负罪词根：burn/fat/sweat 直白但廉价，且把产品钉死在减肥叙事里；身份词的天花板远高于焦虑词",
        "社群喊得响：健身品牌终点是社群，名字要能变成口号和 hashtag（#KeepUp）；造词前先想好它的口号形态",
      ],
      cases: [
        { name: "Keep", takeaway: "一个最简单的英文词，把「坚持」这个健身的全部本质据为己有；口号 Keep Moving 与品牌名无缝一体——常见词打法的中国最佳实践" },
        { name: "Peloton", takeaway: "自行车术语「主车群」：圈内人会心、圈外人觉得高级；三音节自带踏频节奏，把孤独的家庭健身包装成集体骑行" },
        { name: "Strava", takeaway: "瑞典语「奋斗」：借小语种词拿到干净商标与域名，含义还精准命中运动员心理——小语种词库是健身命名的富矿" },
        { name: "lululemon", takeaway: "无意义但音感极佳的造词，三个 l 的头韵念起来像瑜伽呼吸；证明健身名字可以完全脱离功能，只靠气质取胜" },
      ],
      pitfalls: [
        "焦虑营销词根：burn/fat/skinny 类名字在品牌升级时会变成负资产，身体积极叙事已是主流",
        "堆砌 fit/gym/muscle：与上万健身房撞名，且把想象空间锁死在器械房里",
        "忽略口号形态：名字无法延展成 hashtag 和课程口号时，社群运营会一直别扭",
        "医疗健康类夸大暗示：cure/therapy 类词根可能触发监管审查，健康品类命名要留合规余量",
      ],
    },
    en: {
      label: "Fitness & health",
      title: "How to Name a Fitness Brand: Strategies, Cases & Domains",
      metaDescription:
        "Fitness naming guide: identity-badge names, energetic phonetics, ditching guilt words, breakdowns of Peloton/Keep/Strava, TLD picks and pitfalls — then hunt an available fitness domain with AI.",
      intro:
        "A fitness name doesn't sell equipment or classes — it sells the self the customer wants to become. People buy identity: the stronger, lighter, more disciplined version of themselves, so a great fitness name works like a badge — saying \"I train with X\" should carry a flicker of pride. The second key is kinetic energy: the name gets printed on apparel, shouted in boot camps and posted with workout selfies, so the syllables need punch — said aloud, it should raise the pulse. And steer clear of the lecture: burn-the-fat vocabulary evokes being policed; guilt marketing is receding while companionship and achievement carry the narrative now.",
      namingIdeas: [
        "Name the badge: write down the adjective your user wants to embody (strong, light, disciplined), then coin something they'd proudly wear on a shirt; the test is imagining it in a gym-selfie hashtag",
        "Engineer the energy: open with a plosive (p/b/k), stay within two syllables, and make it chant-able; avoid soft nasal endings that dissipate",
        "Mine motion and streaks: run, lift, climb, rep, streak — write repetition-and-persistence, the essence of training, into the root; Keep is the textbook case",
        "Drop the guilt roots: burn/fat/sweat read cheap and nail you to a weight-loss narrative; identity words have a far higher ceiling than anxiety words",
        "Make it shoutable: fitness brands end up as communities, so the name must extend into a slogan and hashtag (#KeepUp); design the chant before you commit",
      ],
      cases: [
        { name: "Keep", takeaway: "One plain English word that claims the entire essence of training — persistence; the slogan Keep Moving fuses seamlessly with the name" },
        { name: "Peloton", takeaway: "The cycling term for the main pack: insiders nod, outsiders hear premium; three syllables with built-in cadence, turning solo home workouts into a group ride" },
        { name: "Strava", takeaway: "Swedish for \"strive\": a small-language borrow that secured a clean trademark and domain while nailing athlete psychology — minor languages are a rich vein for fitness names" },
        { name: "lululemon", takeaway: "A meaningless coinage with superb mouthfeel — the triple-l alliteration flows like a yoga breath; proof a fitness name can win on vibe alone" },
      ],
      pitfalls: [
        "Anxiety-marketing roots: burn/fat/skinny names turn into liabilities at rebrand time as body-positive narratives take over",
        "Stacking fit/gym/muscle: you collide with thousands of gyms and lock the imagination inside the weight room",
        "Forgetting the chant: if the name can't stretch into a hashtag and a class slogan, community operations will fight it forever",
        "Implied medical claims: cure/therapy roots can trigger regulatory review — leave compliance headroom in health naming",
      ],
    },
  },
  devtools: {
    slug: "devtools",
    tlds: [
      { tld: "dev", zh: "开发者工具的品类后缀，全后缀强制 HTTPS", en: "The category TLD for developer tools, HTTPS enforced zone-wide" },
      { tld: "io", zh: "开发者生态十年惯例，圈内认知零成本", en: "A decade-long developer convention with zero explanation cost" },
      { tld: "com", zh: "面向企业采购时仍是最稳妥的信任锚", en: "Still the safest trust anchor when selling to enterprises" },
    ],
    zh: {
      label: "开发者工具",
      title: "开发者工具怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "开发者工具命名指南：CLI 友好、极客梗与神话词、避开 dev/code 堆砌等思路，GitHub/Vercel/Rust 案例拆解，推荐 TLD 与避坑清单，并用 AI 猎取可注册的开发者工具域名。",
      intro:
        "开发者工具的名字每天要被敲进终端几十次——它首先是一个命令，其次才是一个品牌。所以第一铁律是 CLI 友好：全小写不别扭、够短、无歧义字符，`npx x` 敲出来手感顺滑。第二个特殊之处是受众的反营销免疫：开发者对营销腔过敏，名字越「像大厂市场部起的」越减分；极客梗、神话典故、冷幽默反而是圈内通行证（Rust 自嘲锈蚀、Homebrew 自比家酿）。第三是生态占位：包名、GitHub org、crate/npm 名要一起拿下，工具火了之后再补注册就晚了。",
      namingIdeas: [
        "CLI 手感优先：全小写、4–7 字符、无连字符，想象它作为命令被敲一万次的样子；`npx 名字` 念一遍就是最好的测试",
        "神话与典故词库：北欧神话、希腊神话、天文学词至今仍是宝库（Kubernetes 的舵手、Prometheus 的盗火者），典故与工具职责呼应时效果翻倍",
        "自嘲与冷幽默：Rust（锈）、Homebrew（家酿）证明反差萌在开发者圈是资产；营销腔的「智能高效」反而是负资产",
        "动词短词占位：build/ship/deploy 这类动作的同义短词（如 turbo、vite 的「快」）能把工具价值压进一个音节",
        "生态同名预检：GitHub org、npm/crates/PyPI 包名、X handle 一起查，任何一个被占都会让文档和教程写起来别扭",
      ],
      cases: [
        { name: "GitHub", takeaway: "git（工具）+ hub（枢纽）：把「代码的聚集地」说得一清二楚，又完全独占；工具名 + 场所词是开发者平台的黄金结构" },
        { name: "Vercel", takeaway: "从 versatile/vertex 造词，两音节干净利落；从 ZEIT 改名反而证明：好念、可搜索、无歧义比酷更重要" },
        { name: "Vite", takeaway: "法语「快」：一个音节把核心卖点说完，借小语种拿到独占性；官方文档标注发音 /vit/，主动管理读音是造词的配套动作" },
        { name: "Rust", takeaway: "「锈」的自嘲反差：越不像营销词越像圈内人起的名字；单音节 CLI 手感满分，社区昵称 Rustacean 证明名字的延展性" },
      ],
      pitfalls: [
        "堆砌 dev/code/hub 万金油：搜索撞车严重，且一眼「像域名投资人起的」",
        "含连字符或大小写敏感拼写：在终端、URL、口头传播三个场景都是摩擦",
        "与知名包重名或近音：用户 `npm install` 装错包不只是尴尬，还是供应链安全隐患",
        "过度生僻的典故：梗太深需要解释时就失效了，冷知识要配一行「为什么叫这个」的 README 说明",
      ],
    },
    en: {
      label: "Dev tools",
      title: "How to Name a Developer Tool: Strategies, Cases & Domains",
      metaDescription:
        "Dev-tool naming guide: CLI-friendly names, mythology and in-jokes, skipping dev/code pile-ups, breakdowns of GitHub/Vercel/Rust, TLD picks and pitfalls — then hunt an available dev-tool domain with AI.",
      intro:
        "A developer tool's name gets typed into a terminal dozens of times a day — it is a command first and a brand second. Rule one, therefore, is CLI ergonomics: comfortable in lowercase, short, no ambiguous characters; `npx x` should feel smooth under the fingers. The second peculiarity is the audience's marketing immunity: developers are allergic to marketing-speak, and the more a name smells like a corporate brand department, the more it costs you. In-jokes, mythology and dry humor are the insider passport instead (Rust self-deprecates, Homebrew winks). Third is ecosystem squatting: claim the package name, the GitHub org and the registry entries together — retrofitting them after the tool takes off is too late.",
      namingIdeas: [
        "CLI feel first: lowercase, 4–7 characters, no hyphens; imagine it typed ten thousand times as a command — saying `npx yourname` aloud is the best test",
        "Mine mythology and lore: Norse, Greek and astronomy words remain a goldmine (Kubernetes the helmsman, Prometheus the fire-thief); the payoff doubles when the allusion mirrors the tool's job",
        "Dry humor and self-deprecation: Rust and Homebrew prove that anti-marketing charm is an asset with developers, while \"smart & efficient\" copy is a liability",
        "Claim a short action word: compressed synonyms of build/ship/fast (turbo, vite) pack the tool's value into one syllable",
        "Pre-check the ecosystem: GitHub org, npm/crates/PyPI names and the X handle together — any one squatted makes every tutorial awkward forever",
      ],
      cases: [
        { name: "GitHub", takeaway: "git (the tool) + hub (the place): says \"where code gathers\" with total clarity yet full ownability — tool-word + place-word is the golden structure for dev platforms" },
        { name: "Vercel", takeaway: "Coined from versatile/vertex, two clean syllables; the rename from ZEIT proves searchable-and-unambiguous beats cool" },
        { name: "Vite", takeaway: "French for \"fast\": one syllable carries the entire pitch, and the borrow secured ownability; the docs specify /vit/ — actively managing pronunciation is part of coining" },
        { name: "Rust", takeaway: "The self-deprecating \"rust\": the less it sounds like marketing, the more it sounds like one of us; single-syllable CLI perfection, and \"Rustacean\" shows the name's community stretch" },
      ],
      pitfalls: [
        "Filler roots like dev/code/hub: heavy search collision, and it reads like a domainer named it",
        "Hyphens or case-sensitive spellings: friction in the terminal, the URL and every spoken referral at once",
        "Colliding with a known package: users running `npm install` on the wrong name isn't just awkward — it's a supply-chain hazard",
        "Over-obscure lore: a joke that needs explaining has already failed; pair deep cuts with a one-line \"why the name\" in the README",
      ],
    },
  },
  web3: {
    slug: "web3",
    tlds: [
      { tld: "xyz", zh: "以太坊生态事实标配（ens.domains 亦大量采用）", en: "The de-facto pick across the Ethereum ecosystem" },
      { tld: "io", zh: "交易所与基础设施的传统选择，技术信誉背书", en: "The legacy pick for exchanges and infra, with tech credibility" },
      { tld: "com", zh: "面向出圈用户与监管沟通时的信任锚", en: "The trust anchor for mainstream users and regulator-facing comms" },
    ],
    zh: {
      label: "Web3 加密",
      title: "Web3 项目怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "Web3/加密项目命名指南：协议感造词、去土狗化、跨文化预检等思路，Uniswap/Solana/OpenSea 案例拆解，推荐 TLD 与避坑清单，并用 AI 猎取可注册的 Web3 域名。",
      intro:
        "Web3 名字活在两个极端之间：一端是协议的严肃感——它要出现在审计报告、治理提案和交易所上币公告里；另一端是社区的梗文化——它要能做成表情包、喊进 Discord。好项目的名字往往「协议名严肃、社区昵称放飞」双轨并行。第二个现实是行业信任稀缺：土狗盘起烂了 moon/inu/pepe 类词根，正经项目要主动与之切割，名字越像基础设施越容易被认真对待。第三是全球性：加密社区天然跨时区跨语言，名字必须在英文、中文与主要小语种里都无歧义、可发音。",
      namingIdeas: [
        "协议感造词：uni-/meta-/proto- 类前缀 + 功能词根（Uniswap = universal + swap），读起来像白皮书里的术语，天然自带基础设施气质",
        "物理与数学词库：链上世界爱借「确定性」意象——Solana（海滩反例，实为地名）、Polygon（多边形）、Prism、Vector；科学词自带中立与精确感",
        "去土狗化自检：名字若与 moon/inu/safe/baby 等词根沾边，机构与交易所的第一印象直接扣分；想做正经协议就离梗币词库远一点",
        "双轨命名：协议名严肃（Uniswap），社区吉祥物与梗放在昵称层（独角兽）；让审计报告和表情包各得其所",
        "跨语言预检：名字在中文里的音译是否顺口、在日韩语里是否有歧义，直接影响亚洲社区的传播效率",
      ],
      cases: [
        { name: "Uniswap", takeaway: "universal + swap：把「任意代币互换」压进三个音节，术语感十足；粉色独角兽把梗留给社区层——双轨命名的教科书" },
        { name: "OpenSea", takeaway: "open（开放）+ sea（海量）：把 NFT 市场的「什么都有」说成一片公海，意象开阔又零解释成本；两个常见词的组合反而拿到了品类第一心智" },
        { name: "Solana", takeaway: "取自创始团队常去的加州海滩 Solana Beach：地名自带阳光轻快感，与「高速公链」的技术叙事形成记忆反差——个人史词库是独占性的捷径" },
        { name: "Chainlink", takeaway: "chain + link：预言机「连接链上链下」的职责直译成名字，功能描述式命名在基础设施层反而成立——因为它要的就是「像管道一样可靠」" },
      ],
      pitfalls: [
        "梗币词根沾身：moon/inu/pepe/safe 类词根让正经项目在机构尽调时先输一步",
        "与已有代币重名或近音：交易所里的相似 ticker 是真金白银的误买风险，也是钓鱼盘的伪装素材",
        "过度依赖 crypto/chain/dao 品类词：牛市里同类名字批量出现，熊市后一起变成时代眼泪",
        "忽略 ENS 与社交同名：project.eth、X handle、Discord 服务器名要与域名一起拿下，Web3 用户在链上先搜你",
      ],
    },
    en: {
      label: "Web3 & crypto",
      title: "How to Name a Web3 Project: Strategies, Cases & Domains",
      metaDescription:
        "Web3 naming guide: protocol-grade coinage, de-memeing your name, cross-language checks, breakdowns of Uniswap/OpenSea/Solana, TLD picks and pitfalls — then hunt an available Web3 domain with AI.",
      intro:
        "A Web3 name lives between two extremes: on one end, protocol gravitas — it must hold up in audit reports, governance proposals and exchange listing announcements; on the other, meme culture — it should turn into stickers and get shouted across Discord. Strong projects usually run a dual track: a serious protocol name with an unhinged community mascot. The second reality is scarce trust: rug-pulls burned out the moon/inu/pepe lexicon, so serious projects should actively distance themselves — the more your name sounds like infrastructure, the more seriously you're taken. Third, crypto is natively global: the name must be unambiguous and pronounceable in English, Chinese and the major community languages at once.",
      namingIdeas: [
        "Coin protocol-grade terms: uni-/meta-/proto- prefixes plus a functional root (Uniswap = universal + swap) read like whitepaper vocabulary and carry infrastructure gravitas for free",
        "Mine physics and math: on-chain culture loves determinism imagery — Polygon, Prism, Vector; scientific words bring built-in neutrality and precision",
        "Run the de-meme check: any brush with moon/inu/safe/baby roots costs you points in institutional due diligence; serious protocols should keep distance from the memecoin lexicon",
        "Name on two tracks: keep the protocol name sober (Uniswap) and park the mascot and memes at the community layer (the unicorn) — audit reports and sticker packs each get their register",
        "Pre-check across languages: how the name transliterates into Chinese and whether it collides in Japanese or Korean directly shapes Asian community reach",
      ],
      cases: [
        { name: "Uniswap", takeaway: "universal + swap: \"exchange anything\" compressed into three syllables with full terminology feel; the pink unicorn keeps the memes at the community layer — the dual-track textbook" },
        { name: "OpenSea", takeaway: "open + sea: an NFT market's \"everything is here\" rendered as open water — expansive imagery at zero explanation cost; two common words that still captured category mindshare" },
        { name: "Solana", takeaway: "Named after Solana Beach, the founders' California haunt: a place name radiating sunny lightness against the high-speed-chain narrative — personal history is a shortcut to ownability" },
        { name: "Chainlink", takeaway: "chain + link: the oracle's job — connecting on-chain and off-chain — translated literally; descriptive naming works at the infrastructure layer, because \"reliable as plumbing\" is the whole point" },
      ],
      pitfalls: [
        "Touching memecoin roots: moon/inu/pepe/safe vocabulary puts you a step behind in every institutional review",
        "Colliding with an existing token: a similar ticker is a real mis-buy risk on exchanges and ready camouflage for phishing clones",
        "Leaning on crypto/chain/dao category words: bull markets mint these names in batches, and bear markets retire them together",
        "Forgetting ENS and socials: claim project.eth, the X handle and the Discord alongside the domain — Web3 users look you up on-chain first",
      ],
    },
  },
  agency: {
    slug: "agency",
    tlds: [
      { tld: "com", zh: "客户提案与合同抬头的默认信任后缀", en: "The default trust suffix on proposals and contracts" },
      { tld: "co", zh: "创意工作室的利落之选，名片上更轻", en: "The sleek pick for creative studios, lighter on a business card" },
      { tld: "me", zh: "个人顾问与独立创作者的人称后缀", en: "The personal suffix for solo consultants and independents" },
    ],
    zh: {
      label: "咨询工作室",
      title: "咨询与设计工作室怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "咨询/设计工作室命名指南：人名信誉、概念词、避开 studio 堆砌等思路，IDEO/Pentagram/麦肯锡案例拆解，推荐 TLD 与避坑清单，并用 AI 猎取可注册的工作室域名。",
      intro:
        "工作室与咨询公司卖的是「人的判断力」，名字因此有两条经典路线：一是人名路线——用创始人名字担保（麦肯锡、Ogilvy），把个人信誉直接抵押给品牌，适合靠口碑与关系网获客的生意；二是概念路线——用一个抽象概念宣示方法论（IDEO 之于设计思维、Pentagram 之于五人合伙），适合想让机构大于个人的团队。选择哪条路线本质是回答：客户签合同时，信的是你这个人，还是你们这套方法？此外工作室名字出现的场景高度正式——提案封面、合同抬头、邮件签名——花哨的谐音在这些场景里会显轻浮，克制是默认审美。",
      namingIdeas: [
        "人名担保路线：创始人姓氏（或组合）自带信誉抵押，客户知道「出了问题找谁」；适合个人IP强、靠转介绍获客的顾问",
        "概念词宣言：选一个能代表方法论的抽象词（原型、五边形、第一性），名字本身就是一次立场表达；配一段「为什么叫这个」的官网文案效果翻倍",
        "拉丁词与古典词根：veritas、apex、modus 类词自带庄重感与时间感，适合法律、财务、战略类咨询；注意查同行占用密度",
        "数字与几何意象：Pentagram（五角）、37signals 证明抽象符号可以承载合伙人叙事与团队故事",
        "克制审美自检：把候选名放进「合同抬头」和「提案封面」两个场景预览，任何显得轻浮的候选直接淘汰",
      ],
      cases: [
        { name: "IDEO", takeaway: "从 ideology/idea 截取的四字母词：把「以概念为业」写进名字，大写排版在提案封面上像一枚印章——概念路线的标杆" },
        { name: "Pentagram", takeaway: "五角星对应五位创始合伙人：几何词把「平等合伙」的组织叙事固化成符号，五十年不过时" },
        { name: "McKinsey", takeaway: "创始人姓氏一百年不改：人名路线的终极形态——名字本身成为行业信任的度量衡，「麦肯锡出品」即是背书" },
        { name: "Ogilvy", takeaway: "广告教父的姓氏 + 个人方法论著作的加持：人名与思想体系互相成就，证明人名路线的天花板取决于创始人思想的传播力" },
      ],
      pitfalls: [
        "堆砌 studio/lab/works 万金油：与全城设计工作室撞名，搜索里永远差一口气",
        "过度俏皮的谐音：在合同抬头和投标文件里显轻浮，B2B 决策链里总有一个保守的审批人",
        "人名路线不留退路：完全绑定个人的名字在出售、合伙人变动时是硬约束，可提前设计「姓氏 + 概念词」的混合结构",
        "首字母缩写起手：三字母缩写没有故事与检索性，除非你已经像 BCG 一样有名",
      ],
    },
    en: {
      label: "Agencies & studios",
      title: "How to Name an Agency or Studio: Strategies, Cases & Domains",
      metaDescription:
        "Agency naming guide: surname equity vs concept manifestos, classical roots, skipping studio/lab pile-ups, breakdowns of IDEO/Pentagram/McKinsey, TLD picks and pitfalls — then hunt an available studio domain with AI.",
      intro:
        "Agencies and consultancies sell human judgment, which gives their names two classic routes. The surname route pledges the founder's personal credibility to the brand (McKinsey, Ogilvy) — right for businesses won through reputation and referrals. The concept route declares a methodology through an abstract idea (IDEO for design thinking, Pentagram for a five-way partnership) — right for teams that want the institution to outgrow the individuals. Choosing between them answers one question: when the client signs, are they trusting you, or your method? Note also that agency names live on formal surfaces — proposal covers, contract headers, email signatures — where cute puns read flippant; restraint is the default aesthetic.",
      namingIdeas: [
        "Pledge a surname: the founder's name (or a pairing) collateralizes personal credibility — clients know exactly who answers for the work; ideal for referral-driven consultants with strong personal brands",
        "Declare a concept: pick an abstract word that stands for your methodology (prototype, pentagon, first-principles) — the name becomes a position statement; a \"why the name\" page doubles the effect",
        "Reach for classical roots: veritas, apex, modus carry gravity and permanence, fitting legal, financial and strategy work; check how densely peers already mine the same vein",
        "Use numbers and geometry: Pentagram and 37signals show abstract symbols can carry a partnership's story for decades",
        "Run the restraint check: preview every candidate on a contract header and a proposal cover; anything that reads playful there gets cut",
      ],
      cases: [
        { name: "IDEO", takeaway: "Four letters cut from ideology/idea: \"concepts as the trade\" written into the name itself; set in caps on a proposal cover it stamps like a seal — the concept route's benchmark" },
        { name: "Pentagram", takeaway: "The five-pointed star mapping five founding partners: geometry freezing an equal-partnership story into a symbol that hasn't aged in fifty years" },
        { name: "McKinsey", takeaway: "A founder's surname unchanged for a century: the surname route's endgame — the name itself became the industry's unit of trust" },
        { name: "Ogilvy", takeaway: "The ad legend's surname amplified by his published thinking: name and ideology reinforcing each other — the surname route's ceiling is set by how far the founder's ideas travel" },
      ],
      pitfalls: [
        "Filler words like studio/lab/works: you collide with every design shop in town and never quite win search",
        "Over-clever puns: flippant on contract headers and tender documents — there's always one conservative approver in a B2B chain",
        "A surname with no exit: names fully bound to one person constrain sales and partner changes; consider a surname + concept hybrid from the start",
        "Leading with initials: three-letter acronyms carry no story and no searchability — unless you're already BCG",
      ],
    },
  },
  photography: {
    slug: "photography",
    tlds: [
      { tld: "com", zh: "商业客户预订与转介绍的默认信任入口", en: "The default trust entry for commercial bookings and referrals" },
      { tld: "me", zh: "个人摄影师品牌与作品集的自然选择", en: "The natural pick for a personal photographer brand and portfolio" },
      { tld: "site", zh: "作品集单页站的轻量选择，首年价极低", en: "A light pick for a one-page portfolio, with a very low first-year price" },
    ],
    zh: {
      label: "摄影工作室",
      title: "摄影工作室怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "摄影工作室与摄影师个人品牌命名指南：光影意象、人名+工艺词、情绪词等思路，Magnum/VSCO 等案例拆解，推荐 TLD 与避坑清单，并用 AI 猎取可注册的摄影域名。",
      intro:
        "摄影名字的第一使命是「配得上作品」：客户看到名字的场景，几乎总是和你的照片放在一起——水印、Instagram 主页、婚礼请柬上的署名。名字气质与作品气质错位，专业感会立刻打折。第二使命是可转介绍：摄影行业的客源大头来自口碑，新人妈妈向闺蜜推荐你时，名字必须一遍说清、一遍记住。相比其他行业，摄影命名可以更「作者性」——人名入名不但不土，反而是最高级的信任背书；但要想清楚未来是个人品牌还是团队工作室，名字绑定人名后再扩张会有摩擦。",
      namingIdeas: [
        "光影词库：light、lumen、halo、golden（hour）、shade、grain 这些摄影母题词自带画面感，组合或变形后仍能读出行业",
        "人名 + 工艺词：「姓氏 + Studio/Lens/Photo」是最稳的结构（Annie Leibovitz 模式），信任感直接从人身上继承",
        "情绪定位词：拍婚礼选温暖词根（ember、dear），拍商业选精准词根（frame、focal）——名字先替客户筛选风格",
        "地名限定：城市/街区入名（Brooklyn 模式）能吃到本地搜索红利，适合以本地客源为主的工作室",
        "避开 4K/HD/Pro 类参数词：设备参数会过时，且把品牌拉向器材党而非创作者",
      ],
      cases: [
        { name: "Magnum Photos", takeaway: "「大酒瓶/大口径」的双关：庆祝的香槟与武器的力量感同时在场，配上纪实摄影的重量恰到好处；证明摄影品牌可以只靠一个词的气场" },
        { name: "VSCO", takeaway: "Visual Supply Company 的缩写：全称交代「视觉供给」的使命，缩写发音顺滑到成为动词（VSCO girl）；缩写要能读出来才有传播力" },
        { name: "Unsplash", takeaway: "un + splash：反着用「泼溅」，暗示「不加修饰的真实影像」；一个否定前缀就把定位（真实、免费、开放）讲完了" },
        { name: "500px", takeaway: "参数词入名的少数成功案例：500 像素是早期缩略图尺寸，圈内梗带来社区认同——但也把品牌锁死在「摄影社区」无法外扩" },
      ],
      pitfalls: [
        "「XX视觉」「XX影像」满街跑：通用行业词无法注册商标也无法被搜索记住",
        "花体字思维：名字里塞生僻字或复杂拼写，水印好看但客户拼不出、搜不到",
        "绑定当前品类：叫 WeddingLens 的工作室很难接商业拍摄单",
        "忽略 Instagram 同名：摄影获客主阵地在视觉社交平台，handle 拿不到等于白起",
      ],
    },
    en: {
      label: "Photography",
      title: "How to Name a Photography Studio: Strategies, Cases & Domains",
      metaDescription:
        "Photography naming guide: light-and-shadow roots, name-plus-craft structures, emotional positioning, breakdowns of Magnum/VSCO/Unsplash, recommended TLDs and pitfalls — then hunt an available domain with AI.",
      intro:
        "A photography name's first duty is to deserve the work: clients almost always see your name next to your photos — in watermarks, on an Instagram grid, signed on a wedding invitation. If the name's vibe mismatches the work's vibe, perceived craft drops instantly. Its second duty is referability: photography lives on word of mouth, and when a new mother recommends you to her best friend, the name must land in one telling. Unlike most industries, photography rewards authorial names — a personal name isn't amateurish here, it's the strongest trust signal. Just decide early whether you're building a personal brand or a studio that outgrows one person; unbinding a name from a person later is friction.",
      namingIdeas: [
        "Mine the light lexicon: light, lumen, halo, golden (hour), shade, grain — photography's mother-words carry imagery even when combined or bent",
        "Name + craft word: \"surname + Studio/Lens/Photo\" is the steadiest structure (the Annie Leibovitz pattern); trust inherits directly from the person",
        "Position with emotion: wedding work suits warm roots (ember, dear); commercial work suits precise roots (frame, focal) — let the name pre-filter your style",
        "Anchor with place: a city or neighborhood in the name (the Brooklyn pattern) captures local search — ideal when your clients are local",
        "Skip spec words (4K/HD/Pro): equipment specs age fast and pull the brand toward gearhead, away from artist",
      ],
      cases: [
        { name: "Magnum Photos", takeaway: "A double entendre — celebration champagne and raw power at once, a perfect weight for documentary photography; proof one charged word can carry a whole brand" },
        { name: "VSCO", takeaway: "Short for Visual Supply Company: the full name states the mission, and the abbreviation reads aloud so smoothly it became a noun (VSCO girl); initials only spread when pronounceable" },
        { name: "Unsplash", takeaway: "un + splash: negating \"splash\" to suggest unretouched, honest imagery — a single prefix carrying the whole positioning of real, free, open" },
        { name: "500px", takeaway: "A rare spec-word success: 500 pixels was the early thumbnail size, an insider joke that built community — and also locked the brand inside 'photo community' forever" },
      ],
      pitfalls: [
        "\"XX Visuals / XX Imagery\" everywhere: generic industry words can't be trademarked or remembered in search",
        "Calligraphy thinking: obscure spellings look great in a watermark but clients can't spell or search them",
        "Binding to today's niche: a studio called WeddingLens struggles to win commercial shoots",
        "Ignoring the Instagram handle: visual social platforms are where photography clients come from — no handle, no name",
      ],
    },
  },
  podcast: {
    slug: "podcast",
    tlds: [
      { tld: "com", zh: "节目做成品牌后的长期主站", en: "The long-term home once the show becomes a brand" },
      { tld: "link", zh: "节目主页聚合与单集分发入口", en: "A hub for show links and episode distribution" },
      { tld: "me", zh: "强主播人格节目的个人品牌选择", en: "The personal-brand pick for host-driven shows" },
    ],
    zh: {
      label: "播客节目",
      title: "播客节目怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "播客与音频节目命名指南：口播测试、悬念式命名、双关梗等思路，「日谈公园」/Serial 等案例拆解，推荐 TLD 与避坑清单，并用 AI 猎取可注册的播客域名。",
      intro:
        "播客名字的特殊性在于：它几乎只通过「耳朵」传播。听众在通勤路上听到主播口播「欢迎收听 XX」，回家后凭记忆去搜索——名字必须经得起「只听一遍、隔八小时再搜」的考验。这决定了播客命名的铁律：读音优先于拼写，节奏感优先于信息量。好的播客名往往自带「节目感」——像一档节目的名字而不是一家公司的名字，有一点悬念、一点态度或一点幽默。同时要为节目单元留出空间：名字太窄，节目转型或加副线时会被自己框住。",
      namingIdeas: [
        "口播测试第一：把名字放进「欢迎收听 XX，我是 XX」念十遍，任何卡顿、歧义、需要解释拼写的名字直接淘汰",
        "悬念式命名：用一个让人想问「为什么叫这个」的词或短语（Serial、「随机波动」），名字本身就是第一集的话题",
        "对谈感短语：口语化短语入名（「日谈公园」「Call Her Daddy」）自带栏目气质，比正经名词更像一档节目",
        "主播人格绑定：以主播昵称/口头禅入名适合强人格节目，但要接受「节目=人」的绑定后果",
        "留出副线空间：加「电台/FM/Show」类后缀词而非具体题材词，转型加新栏目时不用改名",
      ],
      cases: [
        { name: "Serial", takeaway: "一词双关：既是「连载」的节目形态，又暗合「连环（案件）」的题材；形式与内容压进同一个词，是播客命名的教科书" },
        { name: "日谈公园", takeaway: "「日谈」谐音「日坛」+ 公园的松弛场景：北京地名梗 + 每日闲谈的内容承诺，中文播客命名里少见的音、义、场景三合一" },
        { name: "The Daily", takeaway: "极简到只剩更新频率：背靠纽约时报的品牌，名字只需要说「每天来」；无靠山的新节目慎学，有靠山时这是最大气的取法" },
        { name: "Radiolab", takeaway: "radio + lab：把「电台」与「实验室」嫁接，一词说清「用声音做实验」的节目气质；嫁接词是播客命名的高产结构" },
      ],
      pitfalls: [
        "名字需要看字才懂：双关建立在拼写上而非读音上，口播传播全损耗",
        "题材词锁死：叫「XX 财经观察」的节目做不了闲聊副线",
        "过长的完整句：超过 5 个字/3 个单词的名字在播客客户端列表里会被截断",
        "忽略平台搜索：各播客平台搜索是主要发现渠道，名字与已有大节目撞车等于隐身",
      ],
    },
    en: {
      label: "Podcasts",
      title: "How to Name a Podcast: Strategies, Cases & Domains",
      metaDescription:
        "Podcast naming guide: the spoken-intro test, intrigue-first names, format puns, breakdowns of Serial/The Daily/Radiolab, recommended TLDs and pitfalls — then hunt an available domain with AI.",
      intro:
        "A podcast name travels almost exclusively by ear. Listeners hear the host say \"welcome to X\" on a commute, then search from memory hours later — the name must survive the \"heard once, searched at night\" test. That sets podcasting's iron rule: pronunciation beats spelling, rhythm beats information. Great podcast names carry show energy — they sound like a program, not a company, with a hint of intrigue, attitude or humor. And leave room to grow: a name locked to one topic boxes you in the moment the show evolves or adds a second segment.",
      namingIdeas: [
        "Run the spoken-intro test first: say \"welcome to X, I'm Y\" ten times — any stumble, ambiguity or need to spell it out disqualifies the name",
        "Lead with intrigue: pick a word or phrase that makes people ask \"why is it called that?\" (Serial) — the name becomes episode one's first topic",
        "Use conversational phrases: spoken-language names (Call Her Daddy) carry segment energy and sound more like a show than a proper noun does",
        "Bind to host persona deliberately: naming after the host's nickname or catchphrase suits personality-driven shows — if you accept that the show equals the person",
        "Reserve room for spin-offs: suffix with radio/FM/show rather than a topic word, so new segments never force a rename",
      ],
      cases: [
        { name: "Serial", takeaway: "One word, two readings: the serialized format and the serial (crime) subject — form and content compressed into a single word; the textbook podcast name" },
        { name: "The Daily", takeaway: "Minimal to the point of only stating cadence: with the New York Times behind it, the name only needs to say \"come back every day\" — the boldest move, only when you have the backing" },
        { name: "Radiolab", takeaway: "radio + lab: grafting broadcast onto laboratory says \"experiments in sound\" in one word; the graft structure is podcasting's most productive pattern" },
        { name: "99% Invisible", takeaway: "A number plus a paradox: instantly intriguing, impossible to confuse in search, and a thesis statement for the show — design you don't notice" },
      ],
      pitfalls: [
        "Names that only work in writing: puns built on spelling rather than sound lose everything in spoken sharing",
        "Topic lock-in: a show called \"X Finance Watch\" can't grow a casual second segment",
        "Full sentences as names: anything past three words gets truncated in podcast-app lists",
        "Ignoring in-app search: podcast platforms are the discovery channel — colliding with an established show's name means invisibility",
      ],
    },
  },
  realestate: {
    slug: "realestate",
    tlds: [
      { tld: "com", zh: "大额交易行业，默认信任后缀无可替代", en: "In a big-ticket industry, the default-trust suffix is irreplaceable" },
      { tld: "vip", zh: "高端置业顾问与会员制服务的尊享感", en: "Premium advisory and members-only service energy" },
      { tld: "site", zh: "楼盘单页与项目落地页的轻量选择", en: "A light choice for property landers and project pages" },
    ],
    zh: {
      label: "房产家居",
      title: "房产家居品牌怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "房产与家居品牌命名指南：安家意象、专业信任词、本地深耕等思路，Zillow/贝壳 等案例拆解，推荐 TLD 与避坑清单，并用 AI 猎取可注册的房产域名。",
      intro:
        "房产家居是典型的「低频高额 + 信任决定一切」行业：客户一生只交易几次，每次金额巨大，选择服务方时极度依赖「这家靠不靠谱」的直觉。名字是这个直觉的第一个输入——它要在陌生人心里瞬间建立「专业、稳、不会坑我」的印象。同时行业高度本地化，客户搜索往往带着地名，名字要么吃到本地词的搜索红利，要么用品牌词建立跨区域的辨识度，两条路线要先想清楚。家居方向则多一层「生活方式」属性：名字可以更温暖、更有审美主张。",
      namingIdeas: [
        "安家意象词：home、nest、haven、壳/巢/居 这类「栖息」母题词自带温度，是房产命名的核心词库",
        "专业信任词：compass、anchor、keystone 类「稳定/方向」意象适合经纪与顾问品牌，传递「我带你走对路」",
        "本地深耕命名：城市/片区名 + 品类词适合区域型中介，直接承接「地名 + 买房」的搜索流量",
        "生活方式升维：家居品牌不卖家具卖「家的样子」——用形容词与场景词（cozy、宅寂）而非品类词命名",
        "读音要「稳」：房产名字避免俏皮变形拼写，大额决策场景里「不正经」的名字会被潜意识扣分",
      ],
      cases: [
        { name: "Zillow", takeaway: "zillions（无数）+ pillow（枕头）的合成：海量房源数据 + 家的柔软感，一硬一软两个母题压进一个好读的造词；房产科技命名的标杆" },
        { name: "贝壳", takeaway: "「壳」是最原始的栖息隐喻：动物的家 = 人的房子，一个字完成品类联想；配合「找房」动作词使用，品牌词干净且可延展" },
        { name: "Compass", takeaway: "「指南针」直译专业价值：在最复杂的交易里给你方向；现成英文词 + 品类零重叠，靠资本与设计把通用词做成了品牌" },
        { name: "Opendoor", takeaway: "open + door：开门即成交的字面意象 + 「敞开、透明」的价值观暗示；两个最简单的词组合出行业革新者的姿态" },
      ],
      pitfalls: [
        "「XX 地产」「XX 置业」同质化：行业通用词无法差异化，也几乎注册不到干净域名",
        "俏皮谐音梗：大额交易场景里幽默感是信任减分项，稳重比有趣重要",
        "绑定单一城市后跨区扩张：区域名入名吃本地流量，但开第二个城市时品牌要重来",
        "忽略中介平台已占的心智：名字与头部平台近似，会被当作山寨而非蹭到流量",
      ],
    },
    en: {
      label: "Real estate",
      title: "How to Name a Real Estate or Home Brand: Strategies, Cases & Domains",
      metaDescription:
        "Real estate and home-brand naming guide: dwelling imagery, trust words, local anchoring, breakdowns of Zillow/Compass/Opendoor, recommended TLDs and pitfalls — then hunt an available domain with AI.",
      intro:
        "Real estate is the archetypal low-frequency, high-ticket, trust-decides-everything industry: clients transact a handful of times in a lifetime, each time with enormous sums, choosing services largely on the gut feeling of \"can I trust these people\". The name is that gut feeling's first input — it must instantly read professional, steady, and safe to a stranger. The industry is also deeply local: searches carry place names, so decide early between harvesting local-keyword traffic and building a brand word that travels across regions. Home and interior brands add a lifestyle layer — their names can afford more warmth and aesthetic point of view.",
      namingIdeas: [
        "Mine dwelling imagery: home, nest, haven, shell — the shelter mother-words carry warmth and are real estate's core lexicon",
        "Use trust-and-direction words: compass, anchor, keystone suit brokerage and advisory brands, signaling \"I'll guide you right\"",
        "Anchor locally when local: city or district plus a category word suits regional agencies and captures \"place + buy home\" searches directly",
        "Elevate to lifestyle for home brands: sell what home feels like, not furniture — name from adjectives and scenes (cozy, calm), not categories",
        "Keep pronunciation steady: avoid playful spelling twists; in big-ticket decisions, a \"cute\" name subconsciously costs trust points",
      ],
      cases: [
        { name: "Zillow", takeaway: "zillions + pillow: massive listing data fused with the softness of home — one hard theme, one soft theme, pressed into a readable coinage; the benchmark of proptech naming" },
        { name: "Compass", takeaway: "Professional value translated literally: direction through the most complex transaction of your life; a common word built into a brand through capital and design" },
        { name: "Opendoor", takeaway: "open + door: the literal image of a door opening on a deal plus an implied value of transparency; two of the simplest words composing a disruptor's posture" },
        { name: "Airbnb", takeaway: "From \"air bed and breakfast\": a founding-story name that outgrew its literal origin — proof a name can scale past its first meaning once the brand fills it" },
      ],
      pitfalls: [
        "\"X Realty / X Properties\" sameness: generic industry words neither differentiate nor leave clean domains available",
        "Witty puns: in big-ticket contexts humor subtracts trust — steady beats clever",
        "Binding to one city then expanding: a place name harvests local traffic but forces a brand restart in city two",
        "Shadowing a major platform's name: near-miss names read as knockoffs, not as borrowed traffic",
      ],
    },
  },
  health: {
    slug: "health",
    tlds: [
      { tld: "com", zh: "健康决策高度信任敏感，.com 是基本盘", en: "Health decisions are trust-critical — .com is table stakes" },
      { tld: "pro", zh: "医生/治疗师等专业人士个人品牌的认证感", en: "Certified-professional energy for doctors and therapists" },
      { tld: "app", zh: "健康管理应用的品类即后缀", en: "Category-in-the-suffix for health management apps" },
    ],
    zh: {
      label: "医疗健康",
      title: "医疗健康品牌怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "医疗健康品牌命名指南：安心词根、科学感与温度的平衡、合规红线等思路，Calm/丁香医生 等案例拆解，推荐 TLD 与避坑清单，并用 AI 猎取可注册的健康域名。",
      intro:
        "健康命名要同时安抚两种焦虑：用户怕「不专业」（伤害我），也怕「太冰冷」（不在乎我）。好的健康品牌名恰好落在科学感与温度感的交叠区——太学术像论文，太可爱像玩具，都会流失信任。另一条独有的约束是合规红线：多数国家对医疗宣传用词有硬性限制，「治愈」「根治」「第一」类词不但审核过不了，还可能招来处罚，命名阶段就要避开。健康行业的口碑传播往往发生在「推荐给家人」的场景里，名字要让人愿意、也放心说给最在乎的人听。",
      namingIdeas: [
        "安心词根：calm、care、well、安/康/舒 这类词直接传递「你会被照顾好」，是健康命名的基本盘",
        "科学感锚点：词根里嵌入 vita（生命）、bio、-ology 等学术信号建立专业感，再用柔和读音中和冰冷",
        "身体部位/机能的诗意化：不直说器官，用其功能或意象（Oura 取自「光环」戴在手指上）——既暗示品类又不显医械感",
        "普通人读得懂：医学术语入名要做「地铁测试」——地铁上随机一位乘客能否读对并大致猜到你是做什么的",
        "合规预检：命名清单先过一遍广告法禁用词（治愈/根治/最高级），中英文市场都要查",
      ],
      cases: [
        { name: "Calm", takeaway: "一个词就是产品承诺：打开 App 想要的状态直接做名字；读音本身舒缓（长元音收尾），名字的声音设计与产品体验同频" },
        { name: "丁香医生", takeaway: "「丁香」的清苦药香 + 「医生」的专业身份：植物意象软化医疗的冰冷，后缀词直接锚定信任来源；中文健康命名的标杆结构" },
        { name: "Oura", takeaway: "源自芬兰语与「aura/光环」的联想：戴在手指上的健康光环，完全不提「监测/健康」却让品类不言自明；北欧极简命名的代表" },
        { name: "Hims", takeaway: "人称代词直接做品牌：把「难以启齿的男性健康」变成「这就是给他的」，去羞耻化的命名策略本身就是产品定位" },
      ],
      pitfalls: [
        "疗效承诺入名：「治愈」「根治」类词踩广告法红线，全球主要市场都过不了审",
        "拉丁术语堆砌：学术到普通用户读不出、记不住，专业感变成距离感",
        "可爱过头：健康决策场景里，玩具感名字让用户不敢托付身体",
        "忽略药械品类的命名法规：处方药、医疗器械有单独的命名审批规则，商业品牌名与注册名要分开规划",
      ],
    },
    en: {
      label: "Health",
      title: "How to Name a Health Brand: Strategies, Cases & Domains",
      metaDescription:
        "Health brand naming guide: reassurance roots, balancing science and warmth, compliance red lines, breakdowns of Calm/Oura/Hims, recommended TLDs and pitfalls — then hunt an available domain with AI.",
      intro:
        "Health naming must soothe two anxieties at once: users fear \"unprofessional\" (it might harm me) and \"too cold\" (it doesn't care about me). Great health names land exactly in the overlap of scientific credibility and human warmth — too academic reads like a paper, too cute reads like a toy, and both leak trust. Health also carries a constraint no other category has: regulatory red lines. Most countries hard-limit medical marketing language — \"cure\", \"guaranteed\", superlatives — and the wrong word in a name invites rejection or penalties. And remember health referrals happen in \"I told my mom about this\" moments: the name must be one people are comfortable saying to those they love most.",
      namingIdeas: [
        "Build on reassurance roots: calm, care, well — words that directly say \"you'll be looked after\" are health naming's foundation",
        "Anchor with science signals: vita, bio, -ology roots establish credibility; soften them with gentle pronunciation so precision doesn't turn cold",
        "Poeticize the body: don't name the organ, name its function or image (Oura — an aura worn on a finger); category implied, clinical coldness avoided",
        "Pass the subway test: any medical term in the name should be readable — and roughly decodable — by a random stranger on a train",
        "Pre-clear compliance: run every candidate against advertising-law banned words (cure, guaranteed, #1) in every target market before falling in love with it",
      ],
      cases: [
        { name: "Calm", takeaway: "The product promise as the name: the state you open the app to reach; even the sound is soothing (a long open vowel) — sonic design matching product experience" },
        { name: "Oura", takeaway: "Finnish roots with an aura association: a halo of health worn on the finger — never says monitoring or health, yet the category explains itself; Nordic minimal naming at its best" },
        { name: "Hims", takeaway: "A pronoun as the brand: turning unspeakable men's health into simply \"for him\" — the de-shaming strategy is the positioning, executed in four letters" },
        { name: "23andMe", takeaway: "23 chromosome pairs + \"and me\": hard science plus personal ownership in one compact phrase; a number carrying the entire scientific story" },
      ],
      pitfalls: [
        "Efficacy claims in the name: cure/heal/guaranteed cross advertising-law red lines in every major market",
        "Latin pileups: names so academic that users can't pronounce or recall them turn credibility into distance",
        "Overdosing on cute: in health decisions, a toy-like name makes users hesitate to trust you with their body",
        "Ignoring drug/device naming rules: prescription products have separate regulated naming tracks — plan the commercial brand and the registered name apart",
      ],
    },
  },
  legal: {
    slug: "legal",
    tlds: [
      { tld: "com", zh: "法律服务的信任基本盘，别无二选", en: "The trust baseline for legal services — no substitute" },
      { tld: "pro", zh: "独立执业律师个人品牌的专业认证感", en: "Certified-expert energy for independent practitioners" },
      { tld: "co", zh: "法律科技与新型法务服务的现代感", en: "A modern edge for legaltech and new-model services" },
    ],
    zh: {
      label: "法律服务",
      title: "法律服务品牌怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "律所与法律科技命名指南：权威词根、姓氏传统的现代化、法科技去精英化等思路，LegalZoom 等案例拆解，推荐 TLD 与避坑清单，并用 AI 猎取可注册的法律域名。",
      intro:
        "法律命名活在两种传统的张力里：一边是姓氏合伙人制的百年惯例——「张王律师事务所」式命名传递「有真人为结果负责」，至今仍是大额法律业务的信任密码；另一边是法律科技的去精英化浪潮——把法律服务做成产品的公司，名字要亲切、好读、不吓人，与律所的威严刻意反着来。起名前先回答定位问题：你卖的是「顶级专家的判断」还是「标准化的法律产品」？前者往姓氏与权威词走，后者往科技与日常词走，中间地带最危险——既不够权威也不够亲切。",
      namingIdeas: [
        "权威意象词：lex（法）、justice、counsel、衡/正/律 这类词根建立庄重感，适合传统所与高端业务",
        "姓氏现代化：保留姓氏但去掉冗长的「XX、XX 与 XX」串联，单姓 + 简短品类词（「金杜」模式）更利传播",
        "法科技去精英化：做法律产品就用日常词（Zoom 进 LegalZoom），把「请律师」的心理门槛在名字层面就降下来",
        "垂直领域词根：只做一个领域就把领域装进名字（劳动法、知产），垂直词带来精准搜索与「专科医生」式信任",
        "多语言合规：跨境业务要查名字在各法域的律师执业宣传规则——部分地区禁止暗示性词汇（best、win）",
      ],
      cases: [
        { name: "LegalZoom", takeaway: "legal + zoom：把「快」嫁接到最慢的行业，一词完成「法律服务可以像网购一样简单」的宣言；法科技去精英化命名的开山之作" },
        { name: "Clio", takeaway: "希腊神话中掌管历史的缪斯：律所软件用「记录者」的典故暗合案卷管理的产品本质，古典典故还向法律人的人文传统致意" },
        { name: "金杜", takeaway: "两位创始人姓氏「金」与「杜」的极简组合：保留姓氏传统的信任内核，压缩到两个字的现代传播效率；中文律所命名现代化的样板" },
        { name: "DoNotPay", takeaway: "祈使句直接做名字：「别付（罚单）」把产品价值写成一句反抗口号；争议性极强但记忆度拉满，适合消费者侧的法律工具" },
      ],
      pitfalls: [
        "承诺结果的词：win/胜/包赢 类词在多数法域违反律师宣传规则，且透支信任",
        "三姓氏以上串联：「A、B、C 与 D 事务所」没人记得住，对外传播要有短称",
        "过度可爱：法律决策与健康同属高焦虑场景，玩笑感名字让客户不敢托付案件",
        "忽略法域宣传规则差异：同一个名字在 A 地合规、在 B 地可能构成违规执业宣传",
      ],
    },
    en: {
      label: "Legal",
      title: "How to Name a Legal Brand: Strategies, Cases & Domains",
      metaDescription:
        "Law firm and legaltech naming guide: authority roots, modernizing the surname tradition, de-elitizing legal products, breakdowns of LegalZoom/Clio/DoNotPay, recommended TLDs and pitfalls — then hunt an available domain with AI.",
      intro:
        "Legal naming lives in the tension between two traditions. On one side, the century-old surname partnership — \"Smith & Jones LLP\" — signals that real, accountable humans stand behind outcomes, still the trust code for high-stakes work. On the other, legaltech's de-elitization wave: companies productizing legal services need names that are friendly, readable and unintimidating — deliberately the opposite of law-firm gravitas. Answer the positioning question first: are you selling a top expert's judgment, or a standardized legal product? The former points to surnames and authority roots; the latter to tech and everyday words. The middle is the danger zone — neither authoritative enough nor approachable enough.",
      namingIdeas: [
        "Use authority roots: lex, justice, counsel — gravitas-bearing roots suit traditional firms and high-stakes practices",
        "Modernize the surname: keep one name, drop the \"A, B & C\" chain — a single surname plus a short category word travels far better",
        "De-elitize for legaltech: productized legal services should borrow everyday words (Zoom into LegalZoom), lowering the \"hiring a lawyer\" anxiety at the name layer",
        "Own a vertical: if you practice one field, put it in the name — vertical words earn precise search traffic and specialist-doctor trust",
        "Check advertising rules per jurisdiction: many bars ban suggestive words (best, win) in attorney marketing — clear the name everywhere you practice",
      ],
      cases: [
        { name: "LegalZoom", takeaway: "legal + zoom: grafting speed onto the slowest industry — one word declaring that legal services can feel like online shopping; the founding act of de-elitized legal naming" },
        { name: "Clio", takeaway: "The Greek muse of history: practice-management software invoking the recorder of records — a classical allusion that both fits the product and nods to law's humanist tradition" },
        { name: "DoNotPay", takeaway: "An imperative sentence as a name: \"don't pay (that ticket)\" writes the product's value as a slogan of defiance — controversial, unforgettable, right for consumer-side legal tools" },
        { name: "Atrium", takeaway: "An architectural word for openness and light in a famously opaque industry; also a cautionary tale — a beautiful name couldn't save a flawed model" },
      ],
      pitfalls: [
        "Outcome-promising words: win/guaranteed violate attorney advertising rules in most jurisdictions and overdraw trust",
        "Chaining three-plus surnames: nobody remembers \"A, B, C & D LLP\" — establish a short form for the outside world",
        "Overdoing approachable: legal decisions rank with health in anxiety — a jokey name makes clients hesitate to hand over their case",
        "Assuming one clearance fits all: a name compliant in one jurisdiction can constitute improper solicitation in another",
      ],
    },
  },
  newsletter: {
    slug: "newsletter",
    tlds: [
      { tld: "com", zh: "newsletter 长成媒体品牌后的正统主站", en: "The proper home once the newsletter becomes a media brand" },
      { tld: "me", zh: "个人作者品牌与订阅页的自然选择", en: "Natural for personal author brands and subscribe pages" },
      { tld: "link", zh: "订阅页与往期内容聚合的轻量入口", en: "A light hub for the subscribe page and archive links" },
    ],
    zh: {
      label: "Newsletter",
      title: "Newsletter 怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "Newsletter 与订阅制内容命名指南：收件箱场景、承诺式命名、栏目感等思路，Morning Brew 等案例拆解，推荐 TLD 与避坑清单，并用 AI 猎取可注册的 newsletter 域名。",
      intro:
        "Newsletter 名字的主战场是收件箱列表：它和几十封邮件挤在同一屏里，发件人名称就是你的门面——名字要在一行灰色小字里让人产生「点开」的冲动，并在第三十次出现时仍不让人烦。这决定了 newsletter 命名的两个特质：一是「承诺感」，名字最好直接说清「你每期能得到什么」（Morning Brew = 早晨那杯提神的）；二是「人格感」，订阅制内容卖的是与作者的长期关系，名字带一点态度或幽默，关系就从第一眼开始。与产品命名不同，newsletter 名可以更长、更像一个栏目名——收件箱里反而是完整短语更醒目。",
      namingIdeas: [
        "承诺式命名：名字=每期交付物（The Daily Digest 结构），读者订阅前就知道自己会得到什么、多久一次",
        "时间锚点：Morning/Weekly/Sunday 类词把阅读仪式感写进名字，帮读者把你安排进生活节奏",
        "饮品/食物隐喻：Brew、Espresso、快餐类词把「内容消费」类比成「日常饮食」，轻量感恰好匹配邮件场景",
        "作者人格入名：个人 newsletter 用「作者名 + 栏目词」或口头禅，把「关注一个人」的订阅动机做进名字",
        "收件箱 A/B 测试：把候选名字放进真实收件箱截图里对比，哪一个在一屏邮件里最想点开就选哪个",
      ],
      cases: [
        { name: "Morning Brew", takeaway: "早晨 + 冲泡：把商业新闻做成「早上那杯咖啡」，时间锚点 + 饮品隐喻双结构；名字直接设计了阅读仪式，是 newsletter 命名的教科书" },
        { name: "The Hustle", takeaway: "一个态度词做名字：hustle 的「拼劲」精准圈定创业者读者群；名字先完成读者筛选，内容再完成留存" },
        { name: "Lenny's Newsletter", takeaway: "人名 + 最朴素的品类词：反命名的命名——赌的是作者本人就是品牌；适合已有个人影响力的作者，冷启动作者慎学" },
        { name: "Dense Discovery", takeaway: "头韵 + 承诺：两个 D 的节奏感 + 「高密度发现」的内容承诺；小众审美类内容靠名字的质感先筛选同类" },
      ],
      pitfalls: [
        "名字与发件人名不一致：读者记住了名字却在收件箱找不到你，订阅关系直接断链",
        "过度玩梗：梗会过时，第三十期时名字的幽默感变成尴尬",
        "通用词如 Insights/Digest 单独使用：搜索找不到、收件箱认不出，等于没有名字",
        "先起名后定位：newsletter 名即选题承诺，内容方向没定就起名，转型时读者会觉得「货不对板」",
      ],
    },
    en: {
      label: "Newsletters",
      title: "How to Name a Newsletter: Strategies, Cases & Domains",
      metaDescription:
        "Newsletter naming guide: inbox-first thinking, promise-based names, reading rituals, breakdowns of Morning Brew/The Hustle, recommended TLDs and pitfalls — then hunt an available domain with AI.",
      intro:
        "A newsletter name's battlefield is the inbox list: crammed into one screen with dozens of emails, the sender name is your storefront. It must trigger \"open me\" from one line of small gray text — and still not annoy on its thirtieth appearance. That shapes two traits. First, promise: the best names state what each issue delivers (Morning Brew — the morning pick-me-up). Second, personality: subscriptions sell a long-term relationship with a writer, and a name with attitude or humor starts that relationship at first sight. Unlike product names, newsletter names can run longer and read like a column title — in an inbox, a full phrase actually stands out more.",
      namingIdeas: [
        "Name the promise: name = what each issue delivers (The Daily Digest structure), so readers know the what and the cadence before subscribing",
        "Anchor in time: Morning/Weekly/Sunday words write the reading ritual into the name, helping readers slot you into their routine",
        "Borrow food and drink: Brew, Espresso, Snacks — framing content consumption as daily sustenance matches email's lightweight moment",
        "Put the author in: personal newsletters thrive on \"name + column word\" or a catchphrase — the follow-a-person motive built into the name",
        "A/B test in a real inbox: mock candidate names into an actual inbox screenshot; pick whichever you'd most want to open on a crowded screen",
      ],
      cases: [
        { name: "Morning Brew", takeaway: "Time anchor + drink metaphor: business news as your morning coffee — the name designs the reading ritual itself; the textbook newsletter name" },
        { name: "The Hustle", takeaway: "One attitude word: hustle precisely selects the founder-minded reader; the name does the audience filtering, the content does the retaining" },
        { name: "Lenny's Newsletter", takeaway: "A first name plus the plainest category word: anti-naming as naming — betting the author is the brand; right for writers with existing followings, risky for cold starts" },
        { name: "Dense Discovery", takeaway: "Alliteration plus a promise: the double-D rhythm and \"high-density discovery\" in one phrase; for taste-driven content, the name's texture pre-selects kindred readers" },
      ],
      pitfalls: [
        "Sender name mismatching the newsletter name: readers remember one and can't find the other — the subscription silently dies",
        "Overloading on memes: jokes expire; by issue thirty the name's humor reads as cringe",
        "Bare generics like Insights or Digest: unsearchable and unrecognizable in an inbox — effectively nameless",
        "Naming before positioning: a newsletter name is an editorial promise; pivot later and readers feel the bait-and-switch",
      ],
    },
  },
  music: {
    slug: "music",
    tlds: [
      { tld: "live", zh: "语义即「现场」，演出、直播与 livehouse 天然匹配", en: "Literally means live — a natural fit for shows, streams, and venues" },
      { tld: "tv", zh: "视频与频道语义，MV、现场录像与音乐内容主页都贴切", en: "Video and channel semantics — fits MVs, live footage, and music content hubs" },
      { tld: "studio", zh: "录音室、厂牌与制作团队的身份后缀", en: "An identity suffix for recording studios, labels, and production teams" },
    ],
    zh: {
      label: "音乐人",
      title: "音乐人与厂牌怎么起名：艺名、厂牌名与域名选择",
      metaDescription: "音乐人/厂牌命名指南：艺名造词、情绪词借用、声音意象等思路，Spotify/Bandcamp 时代的好名字拆解，推荐 TLD 与常见误区，用 AI 猎取可注册的音乐域名。",
      intro:
        "音乐名字的第一战场不是搜索引擎，而是口口相传和歌单封面：朋友说「你去听一下 X」，对方必须一次听清、一次拼对，才能在流媒体搜到你。这决定了音乐命名比其他行业更依赖「读音的独占性」——名字可以怪，但读出来必须唯一；撞名是灾难，流媒体搜索里你会永远排在同名者后面。同时名字要能承载气质：厂牌名是审美声明，艺名是人设外壳，最好能从名字里听出你是做氛围电子还是做地下说唱。域名层面，音乐人主页承担的是链接聚合与巡演信息，短、好拼、和艺名完全一致是硬指标。",
      namingIdeas: [
        "声音意象词：从听感借词——echo、drift、velvet、static 这类自带质感的词，比直接用 music/sound 的组合更有辨识度",
        "造词艺名：把真名或母语词变形成流媒体搜索唯一的拼写（Beyoncé→Bey 无效，Grimes、Ye 有效），发布前先在 Spotify/网易云搜一遍确认无撞名",
        "情绪+名词嫁接：厂牌名常用「情绪词+实体词」结构（Sad Club、Ghostly、Warp），两个常见词的陌生组合既好记又可注册",
        "数字与符号克制用：MGMT、M83 类缩写/代号有神秘感，但口头传播要多解释一句，适合乐迷文化强的风格",
        "域名与艺名严格一致：艺名叫 X 就注册 x.fm / x.live，不要 xmusic-official 这类补丁式域名——每个补丁词都在稀释品牌",
      ],
      cases: [
        { name: "Bandcamp", takeaway: "band + camp：把「乐队」和「营地/据点」嫁接，一秒说清「音乐人的自留地」，平台气质与独立音乐社区完全同频" },
        { name: "Warp Records", takeaway: "单音节动词「扭曲/跃迁」，既是声音处理术语又有科幻感——电子厂牌用一个词完成风格声明" },
        { name: "Grimes", takeaway: "真词 grime（污垢）加 s 变形成唯一拼写：保留质感联想又拿下搜索独占，艺名造词的标准打法" },
        { name: "88rising", takeaway: "数字 88（亚洲文化里的吉利数）+ rising：亚裔音乐厂牌的身份宣言写进名字里，受众一看便知为谁而做" },
        { name: "Boiler Room", takeaway: "借「锅炉房」意象命名现场直播品牌：地下、拥挤、滚烫的听感与产品体验完全一致，意象词命名的教科书" },
      ],
      pitfalls: [
        "撞名不查流媒体：域名可注册不等于 Spotify/Apple Music 无同名艺人，音乐圈撞名的代价是搜索永远输给对方",
        "名字锁死曲风：叫 XX 电音、XX 说唱的名字在转型时全部作废，气质词比品类词寿命长得多",
        "拼写读音分离：写出来酷但读不出来（或读出来拼不回去）的名字，每次口头推荐都在流失听众",
        "官方域名后缀混乱：主页 .com、周边店 .shop、巡演页 .live 各自为政，乐迷记不住哪个是真的",
      ],
    },
    en: {
      label: "Music & labels",
      title: "How to Name a Musician, Band, or Label: Stage Names & Domains",
      metaDescription: "Music naming guide: coined stage names, sonic imagery, mood-word grafts, name breakdowns from the streaming era, recommended TLDs and pitfalls — then hunt registrable music domains with AI.",
      intro:
        "A music name's first battlefield isn't search engines — it's word of mouth and playlist covers. When a friend says \"go listen to X\", the listener must catch it in one hearing and spell it right on the first try, or they'll never find you on streaming. That makes phonetic uniqueness matter more in music than in any other field: a name can be strange, but spoken aloud it must be unmistakable, because a name collision means ranking behind your namesake forever. The name also carries aesthetic weight — a label name is a taste statement, a stage name is a persona shell. For domains, an artist page mostly serves link aggregation and tour dates: short, spellable, and exactly matching the stage name are hard requirements.",
      namingIdeas: [
        "Sonic imagery: borrow words with inherent texture — echo, drift, velvet, static — far more distinctive than any music/sound compound",
        "Coined stage names: warp a real name or native-language word into a streaming-unique spelling (Grimes, Ye); search Spotify before committing to confirm zero collisions",
        "Mood + noun grafts: labels thrive on \"feeling word + concrete word\" structures (Sad Club, Ghostly, Warp) — unfamiliar pairings of familiar words are memorable and registrable",
        "Numbers and codes sparingly: MGMT- or M83-style handles feel mysterious but cost an extra sentence in conversation; best for scenes with strong fan culture",
        "Domain must equal stage name exactly: if you're X, register x.fm / x.live — never xmusic-official; every patch word dilutes the brand",
      ],
      cases: [
        { name: "Bandcamp", takeaway: "band + camp: grafting \"band\" onto \"basecamp\" says artist-owned home turf in one beat — platform vibe perfectly tuned to indie music culture" },
        { name: "Warp Records", takeaway: "One monosyllabic verb that's both an audio-processing term and sci-fi shorthand — an electronic label completing its style statement in a single word" },
        { name: "Grimes", takeaway: "Real word grime plus an s: keeps the texture, wins unique search — the standard playbook for coined stage names" },
        { name: "88rising", takeaway: "88 (auspicious in Asian culture) + rising: an Asian music collective writing its identity into the name — the audience knows instantly who it's for" },
        { name: "Boiler Room", takeaway: "Naming a live-stream brand after an actual boiler room: underground, packed, sweltering — imagery and product experience in perfect sync" },
      ],
      pitfalls: [
        "Checking the domain but not streaming: an available .com doesn't mean no namesake on Spotify — in music, collisions cost you search forever",
        "Locking the name to a genre: X-tronica or X-rap names die the moment you evolve; vibe words outlive category words",
        "Spelling-sound mismatch: names that look cool but can't be spoken (or spoken but not spelled back) leak listeners on every recommendation",
        "Scattered suffixes: homepage on .com, merch on .shop, tour page on .live with different names — fans can't tell which is real",
      ],
    },
  },
  beauty: {
    slug: "beauty",
    tlds: [
      { tld: "com", zh: "美妆消费品牌的信任底线，上架电商平台前先拿下", en: "The trust baseline for beauty consumer brands — secure it before marketplace launch" },
      { tld: "co", zh: "简洁现代，DTC 美妆新品牌的主流替代选择", en: "Clean and modern — the mainstream fallback for DTC beauty startups" },
      { tld: "shop", zh: "语义即店铺，品牌官方商城的天然后缀", en: "Literally shop — the natural suffix for an official brand store" },
    ],
    zh: {
      label: "美妆个护",
      title: "美妆个护品牌怎么起名：质感词、成分叙事与域名选择",
      metaDescription: "美妆个护品牌命名指南：质感词借用、成分/功效叙事、人名品牌等思路，Glossier/The Ordinary 等好名字拆解，推荐 TLD 与常见误区，用 AI 猎取可注册的美妆域名。",
      intro:
        "美妆名字要在货架和信息流里同时性感：印在瓶身上要有质感，出现在小红书标题里要有点击欲。这个行业的命名有一条独特的分界线——走「情绪美学」还是走「成分理性」：前者用质感词营造氛围（丝绒、晨雾、裸色），后者用直白到近乎冷酷的科学叙事建立信任（The Ordinary 直接叫「平平无奇」）。两条路都通，但混着走会人格分裂。美妆是复购与口碑驱动的品类，名字必须经得起闺蜜之间的口头转述；同时出海几乎是必选项，中文名之外最好同步锁定一个全球读得顺的英文名和 .com 域名。",
      namingIdeas: [
        "质感词借用：从触感与光影借词——velvet、glow、dew、bare，这类词自带皮肤联想，比 beauty 字眼高级得多",
        "成分理性流：直接把成分或方法论写进名字（The Ordinary、Inkey List），赌的是成分党用户对「无营销感」的信任",
        "人名/身份品牌：创始人名或虚构人设（Fenty、Glossier 的 -ier 法语尾缀），适合有内容能力、以人带货的品牌",
        "中文品牌找「字感」：单字或双字+质感偏旁（玑、绒、汽、雾），比音译洋名更容易在国货语境里立住",
        "反差命名：在精致品类里用朴素词制造记忆点（Ordinary、CeraVe 的药感），高端感不一定来自华丽词",
      ],
      cases: [
        { name: "Glossier", takeaway: "gloss（光泽）+ 法语尾缀 -ier：把「光泽感」变成一个像姓氏的品牌词，读音柔和自带滤镜感，DTC 美妆命名的分水岭之作" },
        { name: "The Ordinary", takeaway: "反向命名的极致：在人人自称「奇迹配方」的行业里自称「平平无奇」，用谦逊修辞完成了最傲慢的自信声明" },
        { name: "Fenty Beauty", takeaway: "蕾哈娜姓氏 + 品类词：人名品牌的标准结构，名字本身就是信任背书与流量入口" },
        { name: "Drunk Elephant", takeaway: "「喝醉的大象」：完全无关美妆的荒诞意象反而在货架上最跳，配上马鲁拉油的品牌故事就有了逻辑闭环" },
        { name: "花西子", takeaway: "「花」+「西子」（西湖/西施）：把东方美学典故压进三个字，国风定位从名字开始成立，英文 Florasis 同步锁定出海读音" },
      ],
      pitfalls: [
        "堆砌 beauty/cosmetics 等品类词：货架上全是同类词，等于没有名字",
        "质感词与产品定位错位：叫「晨雾」却卖强功效酸类，用户预期错位直接反映在退货率上",
        "只注册中文商标不锁英文域名：出海或被抢注时再补救，成本翻十倍",
        "读音在目标市场有歧义：出海品牌名必须用当地母语者读一遍，Kolor 类拼写变形在部分语言里会读成完全不同的词",
      ],
    },
    en: {
      label: "Beauty & care",
      title: "How to Name a Beauty or Skincare Brand: Texture Words, Ingredient Stories & Domains",
      metaDescription: "Beauty brand naming guide: texture-word borrowing, ingredient-forward naming, founder brands, breakdowns of Glossier/The Ordinary and more, recommended TLDs and pitfalls — then hunt registrable beauty domains with AI.",
      intro:
        "A beauty name has to be seductive on the shelf and clickable in the feed at the same time: it must feel expensive printed on a bottle and irresistible in a social caption. This industry has a unique fork in the road — emotional aesthetics versus ingredient rationality. One path builds atmosphere with texture words (velvet, morning mist, bare); the other builds trust with almost cold scientific plainness (The Ordinary literally calls itself ordinary). Both work; mixing them splits the brand's personality. Beauty is a repurchase and word-of-mouth category, so the name must survive being passed between friends aloud — and since going global is nearly mandatory, lock a globally pronounceable English name and the .com early.",
      namingIdeas: [
        "Texture-word borrowing: pull from touch and light — velvet, glow, dew, bare; these carry skin associations and outclass any name containing beauty",
        "Ingredient-forward rationality: put the ingredient or methodology in the name (The Ordinary, The Inkey List), betting on ingredient-literate customers trusting the absence of marketing",
        "Founder and persona brands: a surname or invented persona (Fenty; Glossier's French -ier tail) — right for brands built on a person's content and following",
        "Contrast naming: plain words in a polished category create shelf memorability (Ordinary, CeraVe's clinical feel) — premium doesn't require ornate",
        "Say it in the target market's language: a beauty name must be road-tested by native speakers; clever spellings can turn into entirely different words abroad",
      ],
      cases: [
        { name: "Glossier", takeaway: "gloss + French -ier: turns \"glossiness\" into a surname-like brand word with a soft, filtered pronunciation — the watershed of DTC beauty naming" },
        { name: "The Ordinary", takeaway: "Reverse naming at its purest: calling yourself ordinary in an industry of self-proclaimed miracles — the humblest phrasing making the most arrogant confidence claim" },
        { name: "Fenty Beauty", takeaway: "Rihanna's surname + category word: the standard founder-brand structure, where the name itself is both trust endorsement and traffic source" },
        { name: "Drunk Elephant", takeaway: "An absurd image with zero beauty semantics — which is exactly why it pops on a shelf; the marula-oil origin story closes the logical loop" },
        { name: "CeraVe", takeaway: "Ceramides + MVE delivery tech compressed into a pharmacy-sounding coinage: clinical texture as a trust signal, the rational path's flagship" },
      ],
      pitfalls: [
        "Stacking beauty/cosmetics category words: on a shelf full of the same words, that's the same as having no name",
        "Texture word contradicting the product: a name like Morning Mist on a strong-acid line misaligns expectations and shows up in your return rate",
        "Trademarking locally but skipping the global domain: fixing it after expansion or squatting costs ten times more",
        "One brand, many suffixes: official store, campaign site, and regional pages under different names and TLDs erode the trust the name built",
      ],
    },
  },
  nonprofit: {
    slug: "nonprofit",
    tlds: [
      { tld: "org", zh: "公益与非营利的全球默认后缀，本身就是信任状", en: "The global default for nonprofits — the suffix itself is a trust credential" },
      { tld: "com", zh: "防混淆与防抢注，建议与 .org 同时拿下并跳转", en: "Anti-confusion and anti-squatting — grab it alongside .org and redirect" },
      { tld: "info", zh: "信息公开与透明叙事，适合倡议与知识普及类项目", en: "Transparency and information semantics — fits advocacy and public-education projects" },
    ],
    zh: {
      label: "公益组织",
      title: "公益组织与非营利项目怎么起名：使命感、信任与域名选择",
      metaDescription: "公益/非营利命名指南：使命动词、受益人视角、去机构化等思路，charity: water 等好名字拆解，为什么 .org 是信任状，常见误区与 AI 猎名。",
      intro:
        "公益名字的核心资产是信任：捐赠人把钱交给一个名字之前，会先判断它是否透明、专业、可持续。这让公益命名和商业命名的评判标准几乎相反——商业名字可以炫技，公益名字必须诚恳；一个太聪明的名字反而让人怀疑钱花在了营销上。好的公益名字通常把「使命」或「受益人」放进名字里，让人第一眼就知道你为谁做什么事；同时要避免沉重的机构腔（XX 促进会、XX 联合会），年轻捐赠人对机构化命名的信任反而更低。域名上 .org 是行业信任状，几乎没有替代品；.com 建议同时注册用于跳转防混淆。",
      namingIdeas: [
        "使命动词化：把要做的事直接写进名字（Feeding America、code.org），动词开头的名字自带行动感",
        "受益人视角：从受助者而非机构视角命名（Save the Children、Room to Read），捐赠人共情的是人不是组织",
        "具体物象代替抽象概念：用 water、meal、book、tree 这类看得见摸得着的词，比 hope/future/love 更可信——具体即诚恳",
        "去机构化：舍弃「协会/基金会/中心」等后缀词，charity: water 用一个冒号就完成了品类声明，比「净水基金会」轻十倍",
        "中英一致的短名：跨境公益项目最好中英文语义对齐（如「一公斤盒子」），翻译后使命不打折",
      ],
      cases: [
        { name: "charity: water", takeaway: "品类词 + 冒号 + 具体物象：三个元素把「我们是公益、我们做水」说得不能再清楚，去机构化命名的开山之作" },
        { name: "Save the Children", takeaway: "动词 + 受益人：一句完整的行动号召直接当名字，一百年后依然没人误解它做什么" },
        { name: "Room to Read", takeaway: "双关的克制用法：既是「读书的房间」又是「成长的空间」，头韵让它像口号一样好记" },
        { name: "code.org", takeaway: "域名即品牌名：一个词加一个 .org 后缀完成全部定位——教编程、非营利，域名选择本身就是命名决策" },
        { name: "Wikimedia Foundation", takeaway: "wiki + media 的伞形命名：为维基百科等多个项目提供统一母品牌，机构名与项目名分层的范本" },
      ],
      pitfalls: [
        "抽象大词堆砌：希望、未来、爱心、阳光——每个词都正确，组合起来谁也记不住、谁也不敢信",
        "机构腔过重：促进会/联合会/工作委员会式命名在年轻捐赠人眼里是官僚信号而非专业信号",
        "只注册 .org 不防 .com：山寨站用 .com 收捐款的案例屡见不鲜，防御性注册是公益的必修课",
        "名字与实际项目范围错位：叫「乡村儿童阅读」却扩展到城市职业教育，改名的信任成本远高于当初多想一步",
      ],
    },
    en: {
      label: "Nonprofit",
      title: "How to Name a Nonprofit or Cause: Mission, Trust & the .org Question",
      metaDescription: "Nonprofit naming guide: mission verbs, beneficiary-first naming, de-institutionalizing, breakdowns of charity: water and more, why .org is a trust credential, pitfalls — then hunt registrable names with AI.",
      intro:
        "A nonprofit name's core asset is trust: before donors hand money to a name, they judge whether it sounds transparent, professional, and sustainable. That makes nonprofit naming almost the inverse of commercial naming — a business name can show off; a cause name must be sincere. A too-clever name makes people suspect the money goes to marketing. The best nonprofit names put the mission or the beneficiary right in the name so anyone knows at a glance who you serve and what you do — while avoiding heavy institutional phrasing (Federation of…, Council for…), which younger donors read as bureaucracy, not credibility. On domains, .org is the sector's trust credential with essentially no substitute; register the .com too and redirect it to prevent impersonation.",
      namingIdeas: [
        "Verb the mission: write the action into the name (Feeding America, code.org) — verb-led names carry momentum",
        "Beneficiary-first: name from the perspective of who you serve, not the institution (Save the Children, Room to Read) — donors empathize with people, not org charts",
        "Concrete objects over abstractions: water, meal, book, tree beat hope/future/love — specificity reads as honesty",
        "De-institutionalize: drop Foundation/Association/Center; charity: water declared its category with a colon — ten times lighter than \"Clean Water Foundation\"",
        "Keep it translatable: cross-border causes need the mission to survive translation intact; short concrete names travel best",
      ],
      cases: [
        { name: "charity: water", takeaway: "Category word + colon + concrete object: three elements that say \"we're a charity, we do water\" with zero ambiguity — the founding work of de-institutionalized naming" },
        { name: "Save the Children", takeaway: "Verb + beneficiary: a complete call to action used as a name; a century later nobody misreads what it does" },
        { name: "Room to Read", takeaway: "Restrained double meaning — a room for reading and room to grow — with alliteration that makes it chant like a slogan" },
        { name: "code.org", takeaway: "The domain is the brand: one word plus .org completes the entire positioning — teaches coding, nonprofit; TLD choice as a naming decision" },
        { name: "Wikimedia Foundation", takeaway: "wiki + media as an umbrella: one parent brand serving Wikipedia and sibling projects — the template for layering institution and project names" },
      ],
      pitfalls: [
        "Stacking grand abstractions: hope, future, love, light — each word is correct, and the combination is unmemorable and untrustworthy",
        "Institutional phrasing overload: Federation/Council/Committee naming signals bureaucracy to younger donors, not professionalism",
        "Registering .org but ignoring .com: copycat .com sites collecting donations is a recurring scandal — defensive registration is mandatory hygiene",
        "Name narrower than the mission's future: \"Rural Children's Reading\" expanding into urban vocational training pays a trust tax far larger than thinking one step ahead",
      ],
    },
  },
  parenting: {
    slug: "parenting",
    tlds: [
      { tld: "com", zh: "母婴消费决策重信任，.com 是家长的默认预期", en: "Parenting purchases run on trust — .com is what parents expect by default" },
      { tld: "co", zh: "新母婴 DTC 品牌的简洁替代，年轻父母接受度高", en: "The clean alternative for new parenting DTC brands — high acceptance among young parents" },
      { tld: "shop", zh: "语义即店铺，母婴品牌官方商城的天然后缀", en: "Literally shop — the natural suffix for an official baby-brand store" },
    ],
    zh: {
      label: "母婴亲子",
      title: "母婴亲子品牌怎么起名：安全感、叠音与域名选择",
      metaDescription: "母婴亲子品牌命名指南：叠音词、安全感词根、成长意象等思路，好名字拆解与推荐 TLD，避开焦虑营销式命名误区，用 AI 猎取可注册的母婴域名。",
      intro:
        "母婴名字的目标用户其实是两代人：付钱的家长要从名字里读出「安全、专业、被理解」，被使用的孩子要觉得名字亲切好玩。这个品类的信任门槛是所有消费品里最高的——入口的、贴身的、陪睡的，名字轻佻一分,信任就掉一档。中文母婴命名有天然优势工具：叠音（贝贝、萌萌）自带婴语感，但也最容易同质化；更高级的做法是从「成长」「陪伴」「守护」的意象里造词，让名字既柔软又有品牌骨架。警惕焦虑营销式命名（赢在起点类），监管与舆论风向都在惩罚它。",
      namingIdeas: [
        "叠音要有变化：纯叠音（贝贝/宝宝）已经拥挤，试试「半叠音+实词」结构（bala 摇篮、momo 星球），保留婴语感又留出品牌差异",
        "安全感词根：从守护/怀抱/巢/棉这类意象取词，家长对材质与照护的焦虑直接被名字安抚",
        "成长意象：豆芽、小树、星星、种子——把「慢慢长大」写进名字，比「聪明/领先」类词更符合当代育儿观",
        "家长自称视角：用「我们家」「亲爱的」这类家庭内部语气命名（Honest、Hello Bello），像家人而不是商家在说话",
        "英文名同步锁定：母婴品牌跨境电商比例高，中文名定稿时同步验证英文名与 .com 可注册性",
      ],
      cases: [
        { name: "The Honest Company", takeaway: "把「诚实」直接当名字：在成分焦虑最重的品类里，一个形容词完成了全部品牌承诺——反华丽命名的胜利" },
        { name: "Babycare", takeaway: "品类词直给（baby + care）：牺牲独特性换取零解释成本，靠视觉与产品力补品牌辨识——大众母婴的务实路线" },
        { name: "Hello Bello", takeaway: "打招呼 + 押韵造词：读起来像哄孩子的语气词，把「亲切」写进了音节里，名人品牌也选择了去精英化的名字" },
        { name: "好孩子", takeaway: "三个字说尽品类与愿望：家长买的不是推车是「好孩子」，朴素直白反而成就了三十年国民品牌" },
        { name: "Lovevery", takeaway: "love + every：把「每一步都被爱着」压进一个造词，蒙氏教具品牌用名字先完成了教育理念声明" },
      ],
      pitfalls: [
        "焦虑营销式命名：赢、领先、天才类词根正在被监管与舆论双重反噬，短期转化换长期风险不划算",
        "纯叠音同质化：贝贝/萌萌/乖乖类名字在商标库里密度极高，注册与维权都难",
        "只考虑婴儿期：品牌随用户成长（婴儿→儿童→青少年），名字锁死「婴」字扩展就要改名",
        "中文可爱英文难读：拼音直转的英文名（如 Guaiguai）海外读不出可爱只读出困惑，跨境前先做读音测试",
      ],
    },
    en: {
      label: "Parenting & baby",
      title: "How to Name a Parenting or Baby Brand: Trust, Softness & Domains",
      metaDescription: "Parenting brand naming guide: reduplication with a twist, safety-word roots, growth imagery, name breakdowns and recommended TLDs, avoiding anxiety-marketing names — then hunt registrable baby-brand domains with AI.",
      intro:
        "A parenting brand's name speaks to two generations at once: the paying parent must read safety, expertise, and being understood in it, while the child who lives with the product should find it warm and playful. No consumer category has a higher trust bar — these products go in mouths, on skin, into cribs; one degree of flippancy in the name costs a full grade of trust. The strongest names draw from imagery of growth, care, and shelter, staying soft while keeping a brand backbone. And beware anxiety-marketing names (win-at-the-starting-line types): both regulators and public sentiment now punish them.",
      namingIdeas: [
        "Reduplication with a twist: pure baby-babble names are saturated; try half-reduplication plus a real word to keep the infant warmth while carving out difference",
        "Safety-word roots: draw from guard, embrace, nest, cotton — the name itself soothes parents' anxiety about materials and care",
        "Growth imagery: sprout, sapling, star, seed — writing \"growing up slowly\" into the name fits modern parenting far better than smart/ahead words",
        "Family-voice naming: name in the household's own register (Honest, Hello Bello) — sounding like family rather than a vendor",
        "Lock the English name early: parenting brands cross borders fast; validate global pronunciation and the .com the day the local name is chosen",
      ],
      cases: [
        { name: "The Honest Company", takeaway: "Using \"honest\" as the name itself: in the most ingredient-anxious category, one adjective delivers the entire brand promise — a victory for anti-ornate naming" },
        { name: "Hello Bello", takeaway: "A greeting plus a rhyming coinage: it reads like the tone you use to soothe a child — warmth written directly into the syllables" },
        { name: "Lovevery", takeaway: "love + every compressed into one coinage — \"loved at every step\"; a Montessori toy brand declaring its educational philosophy in the name" },
        { name: "Babylist", takeaway: "baby + list: naming the job-to-be-done (the registry) rather than the vibe — utility naming that made the brand synonymous with its category" },
        { name: "Bonpoint", takeaway: "French for \"good point/stitch\": craft heritage and gentleness folded into two syllables — how premium childrenswear signals quality without saying luxury" },
      ],
      pitfalls: [
        "Anxiety-marketing names: win/ahead/genius roots are being punished by regulators and parents alike — short-term conversion, long-term liability",
        "Pure baby-babble saturation: doubled-syllable cutesy names are the densest zone in trademark registries — hard to register, harder to defend",
        "Naming only for infancy: brands grow with their users (baby → kid → teen); a name locked to \"baby\" forces a rename at the first extension",
        "Cute locally, confusing globally: romanized pet names often read as gibberish abroad — run pronunciation tests before crossing borders",
      ],
    },
  },
  hardware: {
    slug: "hardware",
    tlds: [
      { tld: "com", zh: "硬件品牌的默认选择，包装盒与说明书上的信任标配", en: "The default for hardware brands — the trust standard on packaging and manuals" },
      { tld: "io", zh: "IoT/开发者硬件的圈内后缀，极客受众零违和", en: "The insider suffix for IoT/developer hardware — zero friction with a geek audience" },
      { tld: "tech", zh: "语义直给的科技后缀，适合技术驱动的硬件新品牌", en: "The literal tech suffix — fits technology-led hardware startups" },
    ],
    zh: {
      label: "智能硬件",
      title: "智能硬件与消费电子怎么起名：产品线思维与域名选择",
      metaDescription: "智能硬件命名指南：母品牌+产品线结构、材质/物理词根、短音节原则，DJI/Anker 等好名字拆解，推荐 TLD 与常见误区，用 AI 猎取可注册的硬件域名。",
      intro:
        "硬件命名和软件命名最大的不同是「产品线思维」：软件一个名字打天下，硬件从第一天就要想好母品牌与产品线怎么分层——大疆（品牌）之下有 Mavic/Mini（产品线）加数字代际，这套结构不提前设计，第三代产品发布时命名体系就会崩。硬件名字还要经受物理世界的考验：刻在金属上要好看，印在包装盒上要显眼，海关文件和 FCC 认证里要唯一。音节越短越好——硬件是全球生意，Anker/DJI/Bose 这类两音节以内的名字在任何语言里都不打折。域名与商标要全球同步锁定，硬件的抢注成本比软件高一个量级（渠道商、山寨厂都在盯着）。",
      namingIdeas: [
        "母品牌抽象化+产品线具体化：母品牌用造词或意象词（不锁品类），产品线用功能/场景词加数字代际，两层各司其职",
        "材质与物理词根：从 core、bolt、frame、flux 这类物理世界的词取材,硬件感自带，比抽象互联网词更贴身",
        "两音节铁律：全球渠道口头传播 + 包装视觉空间都偏爱短名，超过三音节先自砍一刀",
        "可刻性测试：名字定稿前用无衬线字体排在产品渲染图上看一眼——logo 刻在铝壳上不好看的名字要慎选",
        "查全球商标与认证库：硬件出海必过 FCC/CE，名字在目标市场被注册会直接卡住整条供应链",
      ],
      cases: [
        { name: "DJI（大疆）", takeaway: "三字母缩写 + 中文「大疆无垠」：英文短到极致方便全球流通，中文保留「疆域辽阔」的野心叙事，双语分工的典范" },
        { name: "Anker", takeaway: "德语「锚」：充电品牌用「稳定可靠」的物理意象命名，两音节全球通读，从亚马逊店铺长成全球品牌名字零改动" },
        { name: "Raspberry Pi", takeaway: "水果传统（致敬 Apple/Acorn）+ Pi（数学梗）：极客文化的双重致敬让开发板自带社区亲和力" },
        { name: "Nest", takeaway: "「巢」：智能家居用一个字完成「家的温度」声明，被 Google 收购后名字本身成了品类代名词" },
        { name: "Teenage Engineering", takeaway: "「青少年工程」：把玩心与工程严肃感并置的反差命名，小众硬件品牌靠名字先赢得审美认同" },
      ],
      pitfalls: [
        "母品牌锁死品类：叫 XX 充电/XX 音频的品牌扩品类时名字先造反，母品牌必须比第一款产品更抽象",
        "产品线命名无体系：第一代随口起名，第三代发现 Pro/Max/Ultra/Plus 全用完了还分不清高低",
        "忽视全球商标检索：硬件铺货周期长、渠道深，名字在某市场被抢注的补救成本远高于软件",
        "字母数字乱炖：X3S-Pro-II 式命名只有工程师自己记得住，零售货架上等于匿名",
      ],
    },
    en: {
      label: "Hardware & IoT",
      title: "How to Name a Hardware or Consumer Electronics Brand: Product-Line Thinking & Domains",
      metaDescription: "Hardware naming guide: parent-brand + product-line architecture, physical-world roots, the two-syllable rule, breakdowns of DJI/Anker/Nest, recommended TLDs and pitfalls — then hunt registrable hardware domains with AI.",
      intro:
        "The biggest difference between hardware and software naming is product-line thinking: software can conquer with one name, but hardware must architect parent brand versus product lines from day one — DJI (brand) over Mavic/Mini (lines) with numeric generations. Skip that design and the naming system collapses by generation three. Hardware names also face physical-world trials: they must look good engraved in metal, pop on a retail box, and be unique in customs filings and FCC certifications. Shorter is stronger — hardware is a global business, and sub-two-syllable names like Anker, DJI, and Bose lose nothing in any language. Lock domains and trademarks globally and early: squatting costs an order of magnitude more in hardware, with distributors and clone factories watching.",
      namingIdeas: [
        "Abstract parent + concrete lines: coin or borrow imagery for the parent brand (never category-locked), then use function/scenario words plus numeric generations for lines",
        "Physical-world roots: mine core, bolt, frame, flux — words with mass and texture wear better on hardware than abstract internet words",
        "The two-syllable rule: global spoken channels and packaging real estate both favor short names; anything over three syllables gets cut first",
        "The engraving test: before finalizing, set the name in a sans-serif on a product render — a name that looks wrong milled into aluminum is the wrong name",
        "Search trademarks and certification databases globally: hardware must clear FCC/CE; a name registered by someone else in a target market can stall the entire supply chain",
      ],
      cases: [
        { name: "DJI", takeaway: "A three-letter abbreviation backed by a Chinese name meaning \"boundless frontier\": maximal global portability in English, ambition narrative preserved at home — the template for bilingual division of labor" },
        { name: "Anker", takeaway: "German for anchor: a charging brand named for the physical image of stability — two syllables readable worldwide, scaled from an Amazon store to a global brand without touching the name" },
        { name: "Raspberry Pi", takeaway: "The fruit tradition (a nod to Apple and Acorn) plus a math pun: a double homage to geek culture that gave a bare circuit board built-in community warmth" },
        { name: "Nest", takeaway: "One word declaring \"the warmth of home\" for smart-home hardware — a name so right it became shorthand for the category after the Google acquisition" },
        { name: "Teenage Engineering", takeaway: "Playfulness and engineering seriousness in deliberate contrast: a niche hardware brand winning aesthetic allegiance through the name before the product" },
      ],
      pitfalls: [
        "Category-locked parent brand: an XX-Charging or XX-Audio brand mutinies against its own name at the first category extension — the parent must be more abstract than the first product",
        "No product-line system: name generation one casually, and by generation three Pro/Max/Ultra/Plus are all spent while the lineup is still unreadable",
        "Skipping global trademark search: hardware's long stocking cycles and deep channels make a squatted name far costlier to fix than in software",
        "Alphanumeric stew: X3S-Pro-II naming is memorable only to its own engineers — on a retail shelf it's anonymity",
      ],
    },
  },
  security: {
    slug: "security",
    tlds: [
      { tld: "com", zh: "安全厂商卖的就是信任，.com 是企业采购的默认预期", en: "Security vendors sell trust — .com is what enterprise buyers expect" },
      { tld: "io", zh: "开发者安全工具的圈内标配，技术受众零违和", en: "The insider standard for developer security tools" },
      { tld: "dev", zh: "面向开发者的安全产品可选，全后缀强制 HTTPS 自带安全叙事", en: "An option for developer-facing security products — zone-wide enforced HTTPS is its own security story" },
    ],
    zh: {
      label: "网络安全",
      title: "网络安全公司怎么起名：威慑感、守护感与域名选择",
      metaDescription: "网络安全命名指南：守护/威慑双路线、神话与军事词根、避免恐吓式命名，CrowdStrike/1Password 等好名字拆解，推荐 TLD 与常见误区，用 AI 猎取可注册的安全域名。",
      intro:
        "安全公司的名字要同时对两群人说话：对客户传递「可靠的守护者」，对攻击者暗示「别碰我的客户」。这形成了安全命名的两条经典路线——守护系（盾、哨兵、堡垒）与威慑系（鹰、打击、猎杀）,前者卖安心，后者卖实力。第三条更现代的路线是把安全藏进产品语言里（1Password 直接说清产品形态），适合面向开发者与个人用户的工具。安全是采购决策链最长、信任要求最高的 B2B 品类，名字必须在 RFP 文档、Gartner 报告和 CISO 的邮件里都显得专业；太俏皮的名字第一轮供应商筛选就会被划掉。",
      namingIdeas: [
        "守护系词根：shield、sentinel、guard、vault、fort——传递「有人替你守着」的安心感，适合面向企业的防御型产品",
        "威慑系词根：strike、hunter、falcon、recon——军事与猛禽意象传递主动出击能力，适合威胁情报与红队产品",
        "神话与典故借力：Palo Alto 的 Cortex、Okta（斯堪的纳维亚云量单位）——冷门典故既独特又给销售一个开场故事",
        "产品直陈式：1Password、LastPass 把产品形态写进名字，个人与开发者工具靠零解释成本赢得下载",
        "避免 cyber 堆砌：cyber+secure+shield 的排列组合在安全展会上密度极高，等于把名字淹进背景音",
      ],
      cases: [
        { name: "CrowdStrike", takeaway: "crowd（众源情报）+ strike（打击）：把「集体情报驱动的主动防御」压进两个音节，威慑系命名的旗舰" },
        { name: "1Password", takeaway: "数字开头 + 产品直陈：「你只需要记一个密码」——名字就是产品说明书，消费级安全工具的命名天花板" },
        { name: "Cloudflare", takeaway: "cloud + flare（照明弹）：既是「云上的防护照明」又暗合 flare 的警示语义，基础设施公司少见的意象命名" },
        { name: "SentinelOne", takeaway: "哨兵 + One：守护系词根加统一平台叙事，名字直接对齐「一个 agent 守住全部端点」的产品主张" },
        { name: "Have I Been Pwned", takeaway: "把黑客俚语问句直接当名字：反商业命名反而成就了全球最知名的泄露查询服务——社区工具可以打破所有规则" },
      ],
      pitfalls: [
        "恐吓式命名：名字里堆 threat/attack/danger 制造恐慌，CISO 反感被恐吓营销，信任是安全品类唯一的货币",
        "cyber 前缀依赖：CyberXX 在展会名录里一页能数出二十个，独特性为零",
        "太俏皮进不了 RFP：面向企业的安全产品名字要经得起采购文档与董事会汇报，梗名在第一轮筛选就出局",
        "缩写无叙事：三字母缩写没有故事支撑时，销售每次开场都要多花三分钟解释自己是谁",
      ],
    },
    en: {
      label: "Cybersecurity",
      title: "How to Name a Cybersecurity Company: Guardian vs. Hunter & Domains",
      metaDescription: "Cybersecurity naming guide: guardian vs. deterrence roots, myth and military borrowing, avoiding fear-mongering names, breakdowns of CrowdStrike/1Password and more, recommended TLDs and pitfalls — then hunt registrable security domains with AI.",
      intro:
        "A security company's name speaks to two audiences at once: it tells customers \"a reliable guardian stands here\" and tells attackers \"don't touch my clients.\" That splits security naming into two classic schools — the guardian school (shield, sentinel, fortress) selling peace of mind, and the deterrence school (falcon, strike, hunt) selling capability. A third, more modern path hides security inside plain product language (1Password states exactly what it is), which wins for developer and consumer tools. Security is the B2B category with the longest procurement chains and the highest trust bar: the name must look professional in an RFP, a Gartner report, and a CISO's inbox — anything too cute gets struck in the first vendor screen.",
      namingIdeas: [
        "Guardian roots: shield, sentinel, guard, vault, fort — someone is standing watch for you; right for enterprise defensive products",
        "Deterrence roots: strike, hunter, falcon, recon — military and raptor imagery signals offensive capability; right for threat intel and red-team products",
        "Myth and lore borrowing: Cortex, Okta (a Scandinavian cloud-cover unit) — obscure references are both ownable and a built-in sales opening story",
        "Plain product statement: 1Password and LastPass write the product into the name — zero explanation cost wins downloads for personal and developer tools",
        "Skip the cyber pileup: cyber+secure+shield permutations are the densest zone on any security-conference floor — that name disappears into background noise",
      ],
      cases: [
        { name: "CrowdStrike", takeaway: "crowd (sourced intelligence) + strike: \"collective-intelligence-driven active defense\" compressed into two syllables — the flagship of deterrence naming" },
        { name: "1Password", takeaway: "A digit-led plain product statement: \"you only need to remember one password\" — the name is the manual; the ceiling of consumer security naming" },
        { name: "Cloudflare", takeaway: "cloud + flare: both \"illumination over the cloud\" and the warning-signal sense of a flare — rare imagery naming for an infrastructure company" },
        { name: "SentinelOne", takeaway: "Guardian root plus a unified-platform narrative: the name aligns exactly with \"one agent guards every endpoint\"" },
        { name: "Have I Been Pwned", takeaway: "A hacker-slang question used verbatim as a name: anti-commercial naming that became the world's best-known breach checker — community tools may break every rule" },
      ],
      pitfalls: [
        "Fear-mongering names: stacking threat/attack/danger to manufacture panic — CISOs resent being scared into buying; trust is this category's only currency",
        "Cyber-prefix dependence: twenty CyberSomethings per page of any conference directory — uniqueness zero",
        "Too cute for the RFP: enterprise security names must survive procurement documents and board decks; meme names die in the first screen",
        "Storyless acronyms: a three-letter abbreviation with no narrative costs sales three extra minutes of \"who we are\" in every opening call",
      ],
    },
  },
  creator: {
    slug: "creator",
    tlds: [
      { tld: "com", zh: "创作者要长期经营的个人品牌资产，.com 最稳", en: "A creator brand is a long-term asset — .com is the safest home for it" },
      { tld: "tv", zh: "视频内容天然后缀，「频道感」一眼即懂", en: "The natural suffix for video — instant channel vibes" },
      { tld: "me", zh: "个人 IP 的第一人称后缀，姓名类域名常有货", en: "The first-person suffix for personal brands; name-style domains are often still available" },
    ],
    zh: {
      label: "视频创作者",
      title: "视频创作者 / 自媒体怎么起名：频道名、个人 IP 与域名选择",
      metaDescription: "视频创作者与自媒体命名指南：频道名 vs 真名、栏目化命名、跨平台一致性，MrBeast/李子柒等案例拆解，推荐 TLD 与常见误区，用 AI 猎取可注册的创作者域名。",
      intro:
        "创作者的名字是被念出来的：出现在片头口播、直播间弹幕和「记得搜索 XX」的引导里，所以它必须一听就会写、一写就搜得到。创作者命名先做一个根本选择：用真名（把人本身变成品牌，转型自由但难以出售）还是造一个频道名（内容资产可交易，但要额外养品牌）。第二个决策是宽窄：名字锁得越窄（「XX 评测」），起量越快但转型越痛——大量创作者在第三年被自己的名字困住。跨平台一致性是硬约束：B 站、YouTube、抖音、X 与域名必须同名，起名前先把所有平台的可用性一起查掉。",
      namingIdeas: [
        "真名+领域词：真名可信、领域词给算法与新观众定位（「老王聊车」结构），转型时换掉领域词即可",
        "栏目化命名：把名字起成一档节目而非一个人（「日谈公园」式），天团化与商业化空间更大",
        "口播测试：名字在片头念三遍，拗口、易错写、有多音字的直接淘汰——创作者的名字九成场景靠听",
        "反差与记忆钩：一个意外的词组合（MrBeast 的「野兽先生」）比准确描述更能被记住，测试标准是「听完还能复述」",
        "跨平台抢注前置：定名前一次性查 YouTube/B 站/抖音/X handle 与 .com/.tv 域名，全部拿下再官宣",
      ],
      cases: [
        { name: "MrBeast", takeaway: "Mr + beast 的反差组合：既像人名又有野性张力，一听就能拼写；从游戏解说转型慈善挑战毫无违和——宽命名的胜利" },
        { name: "李子柒", takeaway: "真名式艺名自带东方叙事，人即品牌；停更三年热度不减，证明个人 IP 命名的复利远超栏目名" },
        { name: "Kurzgesagt", takeaway: "德语「简而言之」：外语词自带辨识度与「知识感」，副标题 In a Nutshell 解决发音门槛——难名字要配好助记" },
        { name: "影视飓风", takeaway: "领域词（影视）+ 气势词（飓风）：定位与能量感兼得，从测评转型制作公司名字依然成立" },
      ],
      pitfalls: [
        "名字锁死品类：「XX 手机评测」做到十万粉后想聊汽车，名字成了天花板——领域词要可替换或干脆不带",
        "平台后缀入名：名字里带 TV/Tube/Tok 等平台词，跨平台分发时自相矛盾，还可能碰商标",
        "生僻字与多音字：观众听得懂却搜不到，等于把搜索流量白白漏掉",
        "只抢了账号没买域名：商务合作、导流落地页都需要独立域名，被抢注后赎回成本远超首年注册费",
      ],
    },
    en: {
      label: "Creators",
      title: "How to Name a YouTube Channel or Creator Brand: Names, IP & Domains",
      metaDescription: "Creator naming guide: real name vs. channel name, show-style naming, cross-platform consistency, breakdowns of MrBeast/Kurzgesagt and more, recommended TLDs and pitfalls — then hunt a registrable creator domain with AI.",
      intro:
        "A creator's name lives out loud: it's spoken in intros, typed into search bars from memory, and shouted in \"go search for X\" calls to action — so it must pass the hear-it-once, spell-it-right test above all. The first fork in creator naming is fundamental: your real name (you become the brand — free to pivot, hard to sell) or a coined channel name (a sellable content asset that needs separate brand-building). The second call is width: the narrower the name (\"X Phone Reviews\"), the faster it grows and the more it hurts to pivot — many creators hit a ceiling built from their own name by year three. Cross-platform consistency is non-negotiable: YouTube, TikTok, X, Twitch and the domain must all match, so check every handle before you announce anything.",
      namingIdeas: [
        "Real name + niche word: the name builds trust, the niche word positions you for algorithms and new viewers — swap the niche word when you pivot",
        "Name it like a show, not a person: show-style names (a title, not a handle) scale to teams and are far easier to sponsor and sell",
        "The spoken-intro test: say the name three times as a video intro — anything clumsy, ambiguous, or easily misspelled is out; creator names are heard, not read",
        "Contrast hooks beat descriptions: an unexpected word pair (MrBeast) is more memorable than an accurate label; the test is whether a viewer can repeat it an hour later",
        "Lock handles before you announce: check YouTube/TikTok/X/Twitch handles and the .com/.tv domain in one pass, secure everything, then go public",
      ],
      cases: [
        { name: "MrBeast", takeaway: "Mr + beast: half honorific, half feral energy — instantly spellable, and wide enough to carry a pivot from gaming commentary to philanthropy stunts" },
        { name: "Kurzgesagt", takeaway: "German for \"in a nutshell\": a foreign word is ownable and smart-sounding; the In a Nutshell subtitle solves the pronunciation barrier — hard names need a built-in mnemonic" },
        { name: "MKBHD", takeaway: "Initials + HD: technically an acronym, but a decade of consistency made four consonants a premium tech brand — proof that ruthless repetition can beat naming theory" },
        { name: "Good Mythical Morning", takeaway: "A show name, not a person: the format survives host absences, spin-offs, and a merch empire — the strongest case for naming the show over the human" },
      ],
      pitfalls: [
        "A name that locks the niche: \"X Phone Reviews\" at 100k subs becomes a cage when you want to cover cars — keep the niche word swappable or skip it",
        "Platform words in the name: Tube/Tok/TV in a handle contradicts itself off-platform and can trip trademark wires",
        "Clever spellings viewers can't type: if hearing the name doesn't tell people how to search it, you're leaking discovery traffic",
        "Grabbing handles but not the domain: sponsorship decks and landing pages need a real domain — buying it back from a squatter costs far more than year-one registration",
      ],
    },
  },
  freelance: {
    slug: "freelance",
    tlds: [
      { tld: "com", zh: "客户拿到报价单时最信任的后缀，接单门面首选", en: "The suffix clients trust most on a quote — the default for a client-facing storefront" },
      { tld: "me", zh: "个人作品集的第一人称后缀，姓名域名常有货", en: "The first-person suffix for portfolios; name domains are often available" },
      { tld: "studio", zh: "一人也可以是工作室：给自由职业加一层专业外壳", en: "Even a team of one can be a studio — instant professional shell" },
    ],
    zh: {
      label: "自由职业",
      title: "自由职业者 / 独立开发者怎么起名：真名、工作室壳与域名选择",
      metaDescription: "自由职业与独立开发者命名指南：真名 vs 工作室名、报价单信任感、一人公司命名，DHH/levelsio 等案例拆解，推荐 TLD 与常见误区，用 AI 猎取可注册的个人品牌域名。",
      intro:
        "自由职业者的名字出现在最敏感的场景里：报价单、发票和合同抬头。它的核心任务只有一个——让客户放心把钱打过来。这里的根本选择是「真名」还是「工作室壳」：真名亲切、信任成本低，适合靠口碑接单的顾问与设计师；工作室名（哪怕只有你一个人）显得规模更大、报价空间更高，也方便日后扩张成真团队。独立开发者是特殊分支：产品名与个人名要分开经营，个人号做流量，产品域名做资产。无论哪条路，名字必须在 LinkedIn 简介、邮件签名和付款页三处都成立。",
      namingIdeas: [
        "真名直营：姓名.me 或姓名.com 做作品集，把「人」本身当品牌——口碑型接单的最短路径",
        "工作室壳命名：「名词 + Studio/Lab/Works」结构（一个人也能叫 Studio），报价单立刻多一层专业感",
        "领域限定词：在名字里放一个手艺词（design/code/write），客户三秒定位你是干什么的",
        "独立开发者双轨制：个人真名做社交流量，每个产品独立域名——产品可出售，个人 IP 永远留在自己手里",
        "发票测试：把候选名放进发票抬头念一遍，如果客户财务可能皱眉，就换掉",
      ],
      cases: [
        { name: "DHH", takeaway: "真名缩写 + 长期一致输出：三个字母因为 Rails 与 37signals 的复利变成技术圈硬通货——个人 IP 是时间的函数" },
        { name: "levelsio", takeaway: "真名 Pieter Levels 压缩成 handle 并直接当域名（levels.io）：名字、账号、域名三位一体，独立开发者命名的教科书" },
        { name: "Studio Ghibli", takeaway: "Studio + 造词（撒哈拉热风）：工作室壳 + 有故事的词根，从两个人起步撑起四十年品牌——壳命名的天花板" },
        { name: "Basecamp", takeaway: "从 37signals 的咨询壳孵化出产品名 Basecamp 再反客为主：咨询与产品分开命名，产品成功后自然切换重心" },
      ],
      pitfalls: [
        "用平台账号当门面：接单全挂在第三方平台 ID 上，平台一改规则客户就找不到你——独立域名是自由职业的「自由」本身",
        "壳名夸张过头：Global/International/Group 配一人团队，客户见面后的心理落差直接扣信任分",
        "真名难拼写却不做别名：姓名拼音复杂时要注册一个易拼别名域名 301 过去，否则口头介绍全在漏客",
        "产品与个人绑死：产品域名挂在个人名下叙事里，出售产品时买家要的干净品牌你给不了",
      ],
    },
    en: {
      label: "Freelancers",
      title: "How to Name a Freelance Business or Indie Studio: Real Name vs. Studio Shell",
      metaDescription: "Freelancer and indie-hacker naming guide: real name vs. studio shell, invoice-grade trust, one-person company naming, breakdowns of DHH/levelsio/Basecamp, recommended TLDs and pitfalls — then hunt a registrable personal-brand domain with AI.",
      intro:
        "A freelancer's name shows up in the most sensitive places: quotes, invoices, and contract headers. Its single job is to make a client comfortable wiring money. The fundamental fork is real name versus studio shell: your real name is warm and low-friction — right for consultants and designers who live on referrals; a studio name (even for a team of one) reads bigger, supports higher rates, and scales into a real team later. Indie hackers are a special branch: run the personal name and the product names on separate tracks — the personal account builds audience, each product domain is a sellable asset. Whichever path, the name must work in three places at once: a LinkedIn headline, an email signature, and a payment page.",
      namingIdeas: [
        "Real-name direct: yourname.me or yourname.com as the portfolio — the shortest path when referrals are your pipeline",
        "Studio shell: noun + Studio/Lab/Works (one person can absolutely be a studio) — an instant layer of professionalism on every quote",
        "A craft word in the name: design/code/write tells a client in three seconds what you sell",
        "Indie-hacker dual track: personal name for the audience, a standalone domain per product — products get sold, the personal brand never leaves you",
        "The invoice test: read the candidate name aloud as an invoice header — if the client's finance team might raise an eyebrow, drop it",
      ],
      cases: [
        { name: "DHH", takeaway: "Real-name initials compounded by decades of Rails and 37signals output: three letters became hard currency — personal brands are a function of time" },
        { name: "levelsio", takeaway: "Pieter Levels compressed into a handle that doubles as the domain (levels.io): name, account and domain unified — the indie-hacker naming textbook" },
        { name: "Studio Ghibli", takeaway: "Studio + a storied coinage (a Saharan wind): a shell name with narrative roots carried a two-person start for forty years — the ceiling of shell naming" },
        { name: "Basecamp", takeaway: "The product name hatched inside the 37signals consulting shell, then took over: naming consulting and products separately lets the winner claim the spotlight" },
      ],
      pitfalls: [
        "Living on a marketplace handle: if clients can only find you through a platform ID, one algorithm change erases you — an independent domain is the \"free\" in freelance",
        "An oversized shell: Global/International/Group over a team of one costs trust the moment you meet the client",
        "A hard-to-spell real name with no alias: register an easy-spelling alias domain and 301 it — every verbal introduction is otherwise a leak",
        "Welding products to your person: when a product's domain and story hang off your name, you can't hand a buyer the clean brand they're paying for",
      ],
    },
  },
  fashion: {
    slug: "fashion",
    tlds: [
      { tld: "com", zh: "时尚品牌的国际化门面，吊牌与包装上的默认预期", en: "The global storefront for fashion — what customers expect on a hang tag" },
      { tld: "co", zh: "简短现代，新消费与 DTC 品牌的常见替代", en: "Short and modern — a common alternative for DTC labels" },
      { tld: "store", zh: "直营电商语义直白，主品牌域名之外的导购入口", en: "Literal storefront semantics — a clean secondary shopping entry" },
    ],
    zh: {
      label: "服饰潮牌",
      title: "服饰品牌 / 潮牌怎么起名：审美张力、可穿戴性与域名选择",
      metaDescription: "服饰与潮牌命名指南：创始人名、意象词、反叛词三条路线，Supreme/UNIQLO 等好名字拆解，吊牌与刺绣的「可穿戴性」测试，推荐 TLD 与常见误区，用 AI 猎取可注册的时尚域名。",
      intro:
        "服饰品牌的名字最终会被印在胸口、绣在袖口、挂在吊牌上——它不只是名字，它本身就是设计元素。这决定了时尚命名独有的测试标准：「可穿戴性」——这个词印在 T 恤上，消费者愿不愿意穿出门？时尚命名有三条经典路线：创始人名（Chanel、山本耀司）卖的是人的审美信用；意象词（Supreme、Off-White）卖的是态度与圈层暗号；地名与外语词（UNIQLO 的日式基因）卖的是产地叙事。潮牌尤其依赖「圈内暗号感」：名字要让圈内人会心、圈外人好奇，太直白反而掉价。",
      namingIdeas: [
        "创始人名路线：人名即品牌，审美信用直接背书——适合设计师主理、有个人叙事的品牌",
        "态度词路线：一个有立场的词（Supreme 的「至高」、Obey 的「服从」反讽）——潮牌的名字就是第一句宣言",
        "外语与产地借力：日语、法语、意大利语词根自带风格产地联想，但要确认发音门槛与真实含义",
        "可穿戴性测试：把候选名做成胸前印花 mockup，如果自己都不愿意穿出门，立刻淘汰",
        "大小写与字标预设计：定名时就想好全大写（SUPREME）还是小写（acne studios）——时尚品牌的名字和字体是一体的",
      ],
      cases: [
        { name: "Supreme", takeaway: "一个词的宣言：「至高无上」配 Futura 斜体红底白字，名字、字体、色块三位一体——潮牌命名与视觉同体的极致" },
        { name: "UNIQLO", takeaway: "Unique + Clothing 的合成词（注册时拼错反而成就独特拼写）：日式基因 + 全球好念，快时尚命名的国际化范本" },
        { name: "Off-White", takeaway: "一个颜色概念当品牌：「黑白之间的灰色地带」既是设计哲学又是圈层暗号——概念命名让品牌自带策展感" },
        { name: "Patagonia", takeaway: "远方地名承载「荒野与探索」叙事，与产品的户外基因严丝合缝——地名命名的关键是名实一致" },
      ],
      pitfalls: [
        "直白描述品类：「XX 服饰」「XX 潮流」在吊牌上毫无张力，时尚消费者买的是态度不是品类说明",
        "外语词不查含义：借来的词在原语言里有负面或滑稽含义，出海时变成笑话",
        "字标不可穿戴：名字太长或字形笨重，印花与刺绣都难看——先做 mockup 再定名",
        "忽略商标与海外查重：时尚是商标纠纷高发区，Supreme 的全球抢注大战就是前车之鉴",
      ],
    },
    en: {
      label: "Fashion labels",
      title: "How to Name a Fashion Brand or Streetwear Label: Wearability & Domains",
      metaDescription: "Fashion and streetwear naming guide: founder names, attitude words and borrowed-language routes, breakdowns of Supreme/UNIQLO/Off-White, the wearability test, recommended TLDs and pitfalls — then hunt a registrable fashion domain with AI.",
      intro:
        "A fashion brand's name ends up printed across chests, embroidered on cuffs, and hung from tags — it isn't just a name, it's a design element. That gives fashion naming its own unique test: wearability — would a customer actually walk outside with this word on their shirt? Three classic routes: founder names (Chanel, Yohji Yamamoto) sell a person's aesthetic credit; attitude words (Supreme, Obey) sell a stance and an in-group signal; borrowed languages and places (UNIQLO's Japanese DNA, Patagonia) sell an origin story. Streetwear especially runs on insider code: the name should make insiders nod and outsiders curious — too literal and it loses its edge.",
      namingIdeas: [
        "Founder-name route: the person is the brand and their aesthetic credit is the endorsement — right for designer-led labels with a personal narrative",
        "Attitude-word route: one word with a stance (Supreme's dominance, Obey's irony) — a streetwear name is the brand's first manifesto",
        "Borrowed language and place: Japanese, French, Italian roots carry style-origin associations for free — but verify the real meaning and the pronunciation barrier",
        "The wearability test: mock the candidate name up as a chest print; if you wouldn't wear it out the door, kill it immediately",
        "Design the wordmark with the name: decide all-caps (SUPREME) or lowercase (acne studios) at naming time — in fashion the name and the type are one object",
      ],
      cases: [
        { name: "Supreme", takeaway: "A one-word manifesto: \"supreme\" in italic Futura on a red box — name, typeface and color block fused into one asset; the extreme of naming-as-visual" },
        { name: "UNIQLO", takeaway: "A unique + clothing blend (a registration typo became the ownable spelling): Japanese DNA plus global pronounceability — the internationalization template for fast fashion" },
        { name: "Off-White", takeaway: "A color concept as a brand: \"the gray area between black and white\" is both design philosophy and in-group signal — concept naming makes the label feel curated" },
        { name: "Patagonia", takeaway: "A far-away place name carrying wilderness and exploration, perfectly aligned with the product's outdoor DNA — place naming works when the story is true" },
      ],
      pitfalls: [
        "Literal category names: \"X Apparel\" has zero tension on a hang tag — fashion customers buy attitude, not category labels",
        "Borrowing words without checking: a loanword that's negative or comical in its source language becomes a joke the day you go global",
        "An unwearable wordmark: names too long or heavy set badly in prints and embroidery — mock it up before you commit",
        "Skipping trademark sweeps: fashion is a trademark-litigation hot zone; Supreme's global squatting wars are the cautionary tale",
      ],
    },
  },
  coffee: {
    slug: "coffee",
    tlds: [
      { tld: "com", zh: "连锁化与电商化的门面，豆袋包装上的默认后缀", en: "The default for chains and online bean sales — what belongs on a coffee-bag label" },
      { tld: "co", zh: "与 coffee/company 双关，咖啡品牌的天然缩写", en: "A natural pun on coffee/company — the insider suffix for cafés" },
      { tld: "shop", zh: "小店与线上豆单的直白入口，首年成本低", en: "A literal storefront for small cafés and bean lists, with a cheap first year" },
    ],
    zh: {
      label: "咖啡茶饮",
      title: "咖啡馆 / 茶饮品牌怎么起名：场所感、风味联想与域名选择",
      metaDescription: "咖啡与茶饮品牌命名指南：场所感命名、风味词、地名与故事词根，星巴克/蓝瓶/喜茶等案例拆解，招牌与杯身的上镜测试，推荐 TLD 与常见误区，用 AI 猎取可注册的咖啡域名。",
      intro:
        "咖啡馆的名字是「第三空间」的门牌：它要在招牌上让路人愿意推门，在杯身上让顾客愿意拍照，在豆袋上让风味显得可信。咖啡命名的核心是场所感与风味联想的平衡——太像饮品说明（「香浓咖啡屋」）没有灵魂，太抽象（纯造词）又撑不起社区小店的温度。经典路线有三条：故事词根（星巴克取自《白鲸记》大副之名）、感官意象（蓝瓶的极简蓝）、在地叙事（以街区、山名、方言词入名）。茶饮品牌另有一层：名字要能长出产品名体系（喜茶的「多肉葡萄」们），主品牌名要留出这个语义空间。",
      namingIdeas: [
        "故事词根：从文学、航海、产地传说里借一个有出处的词，店员讲得出来历，名字就有了第二杯的话题",
        "感官锚点：一个颜色、一种器物、一声拟声（蓝瓶、快乐柠檬）——顾客凭感官记忆找回你",
        "在地入名：街区名、山名、方言词让社区店自带归属感，连锁化时用「地名+主词」结构复制",
        "杯身上镜测试：名字与 logo 印在杯子上拍一张照，社交媒体里好不好看直接决定自传播效率",
        "留出产品命名空间：主品牌管气质，产品名管风味——主名太具体（带「拿铁」「柠檬」）会锁死菜单",
      ],
      cases: [
        { name: "星巴克 Starbucks", takeaway: "《白鲸记》大副 Starbuck 之名：与咖啡毫无字面关系，却带来航海、远方与烘焙师傅的想象——故事词根的全球范本" },
        { name: "Blue Bottle", takeaway: "颜色+器物的感官锚点：一只蓝瓶子从名字长成 logo、杯身与整个极简美学——名字即视觉资产" },
        { name: "喜茶 HEYTEA", takeaway: "一个「喜」字管住所有情绪场景（喜悦、喜事、欢喜），英文名 HEYTEA 音意兼得——中文茶饮出海命名的标杆" },
        { name: "%Arabica", takeaway: "用符号 % 当名字主体：极致减法带来极致辨识，代价是口头传播要多一句解释——符号命名只适合视觉驱动的品牌" },
      ],
      pitfalls: [
        "品类词堆砌：「香浓」「醇品」「咖啡屋」的组合在地图 App 里一搜一屏，毫无辨识度",
        "拟声与谐音过度：网感谐音梗开业三个月很热闹，三年后显得尴尬——社区店的名字要经得住岁月",
        "只有中文名没有域名与英文名：豆子电商化、品牌出海时补名字，成本远高于开业前想好",
        "名字与定位错配：走精品路线却起了连锁感的名字（或反之），装修与名字打架最伤品牌",
      ],
    },
    en: {
      label: "Coffee & tea",
      title: "How to Name a Café or Tea Brand: Place, Flavor & Domains",
      metaDescription: "Coffee and tea naming guide: place-feel naming, sensory anchors, story roots, breakdowns of Starbucks/Blue Bottle/HEYTEA, the cup-photo test, recommended TLDs and pitfalls — then hunt a registrable coffee domain with AI.",
      intro:
        "A café's name is the doorplate of a third place: it has to pull passers-by through the door from a signboard, look good on a cup in a photo, and make the flavor notes on a bean bag feel credible. The craft is balancing place-feel against flavor association — too literal (\"Rich Aroma Coffee House\") has no soul; too abstract and a neighborhood shop loses its warmth. Three classic routes: story roots (Starbucks borrowed a first mate from Moby-Dick), sensory anchors (Blue Bottle's minimalist blue), and local narrative (blocks, mountains, dialect words). Tea brands add one more layer: the master name must leave semantic room for a product-name system to grow underneath it.",
      namingIdeas: [
        "Story roots: borrow a word with provenance — literature, seafaring, origin legends. If baristas can tell the story, the name earns a second-cup conversation",
        "Sensory anchors: a color, an object, a sound (Blue Bottle, Happy Lemon) — customers find their way back by sensory memory",
        "Local words: block names, mountains and dialect give a neighborhood shop belonging; replicate with a \"place + master word\" structure when you chain up",
        "The cup-photo test: print the name and logo on a cup and photograph it — how it looks on social feeds decides your organic reach",
        "Leave product-name room: the master brand carries mood, product names carry flavor — a master name containing \"latte\" or \"lemon\" locks the menu",
      ],
      cases: [
        { name: "Starbucks", takeaway: "The first mate Starbuck from Moby-Dick: zero literal coffee meaning, yet it imports seafaring, distance and roaster craft — the global template for story roots" },
        { name: "Blue Bottle", takeaway: "Color + object as a sensory anchor: one blue bottle grew from name into logo, cup and an entire minimalist aesthetic — the name is the visual asset" },
        { name: "HEYTEA", takeaway: "From 喜茶 (\"joy tea\"): one character carries every celebratory scene, and the English name lands both sound and greeting — the benchmark for Chinese tea brands going global" },
        { name: "%Arabica", takeaway: "A percent sign as the brand's core: extreme subtraction buys extreme recognition, at the cost of a spoken explanation every time — symbol naming only works for visually-driven brands" },
      ],
      pitfalls: [
        "Category-word pileups: \"Aroma\" + \"Brew\" + \"House\" combos fill a full screen of any map app — recognition zero",
        "Overdone puns: a meme pun is fun for the first three months and awkward by year three — a neighborhood shop's name has to age well",
        "No domain or English name from day one: retrofitting a name when you start selling beans online or expanding abroad costs far more than deciding before opening",
        "Name–positioning mismatch: a specialty shop with a chain-sounding name (or the reverse) — when the interior and the name argue, the brand loses",
      ],
    },
  },
  automotive: {
    slug: "automotive",
    tlds: [
      { tld: "com", zh: "整车与出行平台的默认门面，大宗消费信任底线", en: "The default for vehicles and mobility platforms — big-ticket purchases demand it" },
      { tld: "ai", zh: "自动驾驶与智能座舱公司的技术信号", en: "The tech signal for autonomous-driving and smart-cabin companies" },
      { tld: "cn", zh: "面向中国市场的整车与后市场品牌首选", en: "First choice for China-market vehicle and aftermarket brands" },
    ],
    zh: {
      label: "汽车出行",
      title: "汽车 / 出行品牌怎么起名：速度感、信任感与域名选择",
      metaDescription: "汽车与出行品牌命名指南：致敬式人名、自然力意象、字母数字车型体系，特斯拉/蔚来/Uber 等案例拆解，推荐 TLD 与常见误区，用 AI 猎取可注册的出行域名。",
      intro:
        "汽车是普通人一生中最贵的消费品之一，出行命名因此要同时解决两件事：让人心跳加速（速度、自由、远方），又让人放心把身家性命交给你（安全、可靠、有实力）。经典路线有四条：致敬式人名（特斯拉致敬发明家）、自然力意象（野马、极星）、愿景词（蔚来 = Blue Sky Coming）、以及动词化平台名（Uber 直接成为「打车」的动词）。命名时还要预留车型命名体系：主品牌定气质，车型名（字母数字或子系列）承担产品线扩张——Model S/3/X/Y 的字母游戏就是最好的示范。",
      namingIdeas: [
        "致敬式命名：借一位科学家、探险家之名，把人物精神注入品牌——自带故事与格调",
        "自然力意象：风、马、星、极地（Mustang、Polestar）——速度与力量不用解释",
        "愿景词直陈：把品牌使命写进名字（蔚来「蓝天将至」），新能源品牌的主流打法",
        "平台动词化：出行服务名要短促可动词化（「Uber 过去」）——高频服务的名字要能进入日常口语",
        "车型体系前置：定主品牌时同步设计车型命名规则（字母、数字、星座、山脉），避免产品线长出来后命名打架",
      ],
      cases: [
        { name: "Tesla", takeaway: "致敬发明家尼古拉·特斯拉：两个音节、全球好念，且把「被低估的天才终将改变世界」的叙事免费送给了品牌" },
        { name: "蔚来 NIO", takeaway: "「蔚蓝天空即将到来」：中文名写愿景，英文 NIO（New Day 谐音）三个字母好读好记——中英双名协同的教科书" },
        { name: "Uber", takeaway: "德语「超越/之上」：四个字母全球零发音障碍，并完成了服务名的终极进化——变成动词" },
        { name: "Mustang", takeaway: "北美野马：自然力意象与「自由驰骋」的美式叙事完美咬合，六十年不过时——好意象比技术参数长寿" },
      ],
      pitfalls: [
        "速度词堆砌：Speed/Fast/Turbo 的组合像改装店而非品牌，速度要用意象暗示而非直陈",
        "技术缩写当品牌：EV/AI/AUTO 拼接的名字在发布会第二年就显得过时，技术会迭代，名字不能跟着贬值",
        "忽略全球发音与含义检查：车企必然出海，名字在主要市场语言里的发音与含义要提前排雷（经典反例：Lacrosse 在魁北克俚语中的尴尬）",
        "主品牌与车型混命名：车型名抢了主品牌气质（或反之），产品线一多体系即乱——先定规则再造名",
      ],
    },
    en: {
      label: "Automotive",
      title: "How to Name an Automotive or Mobility Brand: Speed, Trust & Domains",
      metaDescription: "Automotive and mobility naming guide: tribute names, force-of-nature imagery, vision words and verb-able platform names, breakdowns of Tesla/NIO/Uber/Mustang, recommended TLDs and pitfalls — then hunt a registrable mobility domain with AI.",
      intro:
        "A car is one of the most expensive things most people ever buy, so mobility naming must do two jobs at once: quicken the pulse (speed, freedom, distance) and earn the trust of someone handing you their family's safety. Four classic routes: tribute names (Tesla honors the inventor), force-of-nature imagery (Mustang, Polestar), vision statements (NIO's \"Blue Sky Coming\"), and verb-able platform names (Uber became the verb for ride-hailing). Plan the model-naming system at the same time as the master brand: the brand carries character while model names (letters, numbers, sub-lines) carry the product roadmap — the Model S/3/X/Y alphabet game is the best demonstration.",
      namingIdeas: [
        "Tribute naming: borrow a scientist or explorer and inherit their spirit — a built-in story with built-in class",
        "Force-of-nature imagery: wind, horses, stars, polar latitudes (Mustang, Polestar) — speed and power that need no explanation",
        "Vision statements: write the mission into the name (NIO's blue-sky promise) — the mainstream play for EV brands",
        "Verb-able platform names: a mobility service name should be short enough to conjugate (\"let's Uber there\") — high-frequency services live in everyday speech",
        "Design the model system upfront: letters, numbers, constellations or mountains — decide the rule before the lineup grows, or the naming fights itself later",
      ],
      cases: [
        { name: "Tesla", takeaway: "A tribute to Nikola Tesla: two syllables, globally pronounceable, and the \"underrated genius changes the world\" narrative came free with the name" },
        { name: "NIO", takeaway: "蔚来 (\"blue sky coming\") for vision at home, NIO (echoing \"new day\") for three readable letters abroad — the textbook for bilingual name pairs" },
        { name: "Uber", takeaway: "German for \"above/beyond\": four letters with zero pronunciation barrier anywhere, completing the final evolution of a service name — becoming a verb" },
        { name: "Mustang", takeaway: "The wild horse of the American plains: nature imagery locked onto a freedom narrative that hasn't aged in sixty years — a good image outlives any spec sheet" },
      ],
      pitfalls: [
        "Speed-word pileups: Speed/Fast/Turbo combinations read like a tuning shop, not a brand — imply velocity with imagery, don't declare it",
        "Tech acronyms as brands: EV/AI/AUTO mashups look dated by the second product cycle — technology iterates and the name depreciates with it",
        "Skipping global pronunciation checks: carmakers inevitably go global; sweep major-market languages early (the classic cautionary tale: what LaCrosse means in Quebec slang)",
        "Blurring brand and model naming: when model names steal the master brand's character (or vice versa), the system collapses as the lineup grows — set the rule before coining names",
      ],
    },
  },
  community: {
    slug: "community",
    tlds: [
      { tld: "com", zh: "会员收费与长期运营的门面，续费页需要的信任感", en: "The storefront for paid memberships — renewal pages need this trust" },
      { tld: "gg", zh: "游戏与 Discord 社区的圈内后缀，gg 即「好局」", en: "The insider suffix for gaming and Discord communities — gg means good game" },
      { tld: "club", zh: "语义即身份：「加入俱乐部」的归属感写进域名", en: "Semantics as identity — \"join the club\" belonging written into the domain" },
    ],
    zh: {
      label: "社区俱乐部",
      title: "社区 / 会员俱乐部怎么起名：归属感、身份认同与域名选择",
      metaDescription: "社区与会员俱乐部命名指南：身份标签命名、内部黑话、地名+Club 结构，Reddit/小红书等案例拆解，成员自称测试，推荐 TLD 与常见误区，用 AI 猎取可注册的社区域名。",
      intro:
        "社区的名字和产品名有一个根本区别：它最终会变成成员的自我介绍——「我是 XX 的人」。所以社区命名的第一测试不是好不好听，而是成员愿不愿意用它自称。好的社区名自带身份标签（Reddit 用户自称 Redditor），甚至能长出内部黑话体系。命名路线有三条：身份词（直接描述「我们是谁」）、聚集地隐喻（营地、客厅、公园、码头）、以及暗号词（圈外人看不懂、圈内人一眼认亲）。付费社区还要多过一关：名字要让「续费」显得理所当然——归属感是会员制唯一的护城河，而名字是归属感的第一块砖。",
      namingIdeas: [
        "成员自称测试：把名字变成成员称谓念一遍（「我是 X 人/X er」），拗口或尴尬的直接淘汰——这是社区命名的黄金标准",
        "聚集地隐喻：营地、公园、灯塔、码头——场所词自带「来这里聚」的邀请感，比抽象词更温暖",
        "圈内暗号：用只有目标人群秒懂的行话、梗、缩写命名，天然完成人群筛选——精准小社区的最短路径",
        "地名/领域 + Club 结构：语义直白且自带会员感，「加入」这个动作被名字预设好了",
        "留出黑话空间：好社区名能派生出成员称谓、动词、周边梗（Reddit → Redditor → subreddit），造词时预演这个派生链",
      ],
      cases: [
        { name: "Reddit", takeaway: "read it 的谐音造词：名字即行为（「我在 Reddit 上读到」），并派生出 Redditor/subreddit 完整黑话体系——社区命名的满分卷" },
        { name: "小红书", takeaway: "「红宝书」式的亲切国民记忆 + 「种草笔记」的载体感，用户自称「薯友」、官方自称「薯队长」——名字长出了完整的身份体系" },
        { name: "Discord", takeaway: "反直觉选词：「不和谐」本是负面词，却精准命中玩家「开黑吵闹」的真实氛围——社区名可以描述真实而非理想" },
        { name: "Soho House", takeaway: "地名 + House：从伦敦 Soho 一栋房子长成全球会员俱乐部，「House」的私宅感让会员身份显得稀缺——场所隐喻的天花板" },
      ],
      pitfalls: [
        "名字没有身份感：抽象科技词当社区名，成员无法自称，归属感失去语言载体",
        "Hub/Space/Zone 万金油：这些词描述的是容器而非人群，几千个「XXHub」里没人记得你是谁",
        "暗号选得太窄：梗名的生命周期短于社区生命周期，梗凉了名字就成了考古现场",
        "忽略变现场景：名字在收费页与发票上要站得住——太戏谑的名字会让「付 365 元/年」显得可疑",
      ],
    },
    en: {
      label: "Communities",
      title: "How to Name a Community or Members' Club: Belonging, Identity & Domains",
      metaDescription: "Community and members-club naming guide: identity labels, gathering-place metaphors, insider code words, breakdowns of Reddit/Discord/Soho House, the member self-reference test, recommended TLDs and pitfalls — then hunt a registrable community domain with AI.",
      intro:
        "A community's name differs from a product name in one fundamental way: it ends up inside members' self-introductions — \"I'm an X person.\" So the first test isn't whether it sounds good, but whether members will happily call themselves by it. Great community names carry a built-in identity label (Reddit users are Redditors) and can grow an entire internal slang system. Three routes: identity words (describing who we are), gathering-place metaphors (camps, living rooms, parks, harbors), and code words (opaque to outsiders, instant kinship to insiders). Paid communities face one more bar: the name must make renewal feel natural — belonging is a membership's only moat, and the name is its first brick.",
      namingIdeas: [
        "The self-reference test: turn the name into a member label and say it aloud (\"I'm an X-er\") — anything clumsy or embarrassing is out; this is the golden rule of community naming",
        "Gathering-place metaphors: camp, park, lighthouse, harbor — place words carry a standing invitation to gather, warmer than any abstraction",
        "Insider code: name with jargon, memes or abbreviations only your target crowd instantly parses — natural audience filtering, the shortest path for a precise niche",
        "Place/field + Club: literal semantics with built-in membership — the verb \"join\" is pre-installed in the name",
        "Leave slang room: a great community name spawns member labels, verbs, and derivative memes (Reddit → Redditor → subreddit) — rehearse that derivation chain before you commit",
      ],
      cases: [
        { name: "Reddit", takeaway: "A read-it pun coinage: the name is the behavior (\"I read it on Reddit\") and it spawned the full Redditor/subreddit slang system — a perfect score in community naming" },
        { name: "Discord", takeaway: "A counterintuitive pick: a negative word that precisely captures the rowdy, chaotic energy of gaming voice chat — community names may describe the real, not the ideal" },
        { name: "Soho House", takeaway: "Place + House: one building in London's Soho grew into a global members' club; the private-home feel of \"House\" makes membership scarce — the ceiling of place metaphors" },
        { name: "Indie Hackers", takeaway: "A pure identity label: the name literally is the member description, so joining equals self-identification — the most direct identity-word play there is" },
      ],
      pitfalls: [
        "No identity in the name: an abstract tech word gives members nothing to call themselves — belonging loses its language",
        "Hub/Space/Zone filler: these words describe containers, not people; nobody remembers which of a thousand SomethingHubs you are",
        "Code words cut too narrow: a meme's lifespan is shorter than a community's — when the meme dies the name becomes an archaeology site",
        "Ignoring the checkout page: the name must hold up on a payment form and an invoice — too jokey and a $49/year renewal starts to feel suspicious",
      ],
    },
  },
};

/** 行业指南 slug 列表（顺序即导航展示顺序） */
export const GUIDE_LIST = Object.keys(INDUSTRY_GUIDES);

/** tld → 推荐该 TLD 的行业 guide slugs（用于 /tld 页底部互链，最多 3 个） */
export function guidesForTld(tld: string): string[] {
  return GUIDE_LIST.filter((slug) => INDUSTRY_GUIDES[slug].tlds.some((t) => t.tld === tld)).slice(0, 3);
}
