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
  wedding: {
    slug: "wedding",
    tlds: [
      { tld: "com", zh: "婚庆客单价高、决策链长，.com 在父母辈与酒店渠道里信任度最高", en: "High ticket, long decision chain — .com earns the most trust with parents and venue partners" },
      { tld: "studio", zh: "策划/摄影/花艺工作室的气质后缀，名字瞬间有作品感", en: "The suffix of planners, florists and photo studios — instant portfolio energy" },
      { tld: "art", zh: "主打美学与定制的高端婚礼品牌，用 .art 把审美写进域名", en: "For aesthetics-led, bespoke wedding brands, .art writes taste into the address itself" },
    ],
    zh: {
      label: "婚庆策划",
      title: "婚庆策划公司怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "婚庆策划命名指南：仪式感词根、时刻命名、双姓组合等 5 种思路，The Knot/Zola 等案例拆解，推荐 TLD 与常见误区，并用 AI 立刻猎取可注册的婚庆域名。",
      intro:
        "婚庆是典型的「一生一次 + 高客单」生意：客户没有复购来修正第一印象，名字必须在婚礼展台、小红书笔记和准新娘转发给闺蜜的那条链接里一次成立。它要同时打动两代人——新人要浪漫、有审美，付钱的父母要正规、靠谱。所以婚庆命名的核心是「仪式感 + 可托付感」的平衡：太甜腻（真爱永恒久）显得像影楼老套餐，太商务（XX婚庆服务）又杀死了憧憬。还有一个常被忽略的场景：你的名字会被印在请柬角落、签到墙和婚礼视频片尾——它本质上是要出现在别人人生纪念品上的名字，值得按「作品署名」的标准来起。",
      namingIdeas: [
        "时刻命名：从婚礼里最有情感浓度的瞬间取词——誓言（vow）、交换戒指、掀头纱、第一支舞；「时刻词」比「爱情词」具体十倍，也更少被同行用滥",
        "仪式感词根：借助 fete、gala、bloom、aisle（红毯通道）等自带典礼画面的词根造词，一听就在婚礼语境里，又避开「婚庆/wedding」的直白",
        "双姓/合名结构预留：很多新人喜欢「我们的名字」式定制，若品牌名本身是两个词根的优雅结合（如 Rose & Rye 式），等于示范了你的策划审美",
        "质感形容词 + 品类隐喻：细节控（Detail-obsessed）是婚庆的核心卖点——用 fine、velvet、gilt 等材质词 + atelier、studio 等工坊词，传递「手工定制」而非「流水线套餐」",
        "念给准新娘听：最终候选放进真实句子测试——「我们婚礼找的是 X」，在闺蜜群里说出来不尬、有一点点炫耀感，才算过关",
      ],
      cases: [
        { name: "The Knot", takeaway: "「打结」= tie the knot（结婚）的英语习语：三个字母的日常词借习语获得了专属语义，行业词库里的顶级捡漏" },
        { name: "Zola", takeaway: "两音节人名感造词，不含任何婚礼词汇却优雅上口：证明婚礼品牌可以靠「气质对了」成立，给了从婚礼登记扩张到家居的空间" },
        { name: "Jose Villa", takeaway: "顶级婚礼摄影师直接用本名：婚庆是「人跟人」的生意，个人品牌名 + 作品集就是最强信任状——工作室起步期人名可用" },
        { name: "花嫁丽舍", takeaway: "「花嫁」（日语「新娘」）+「丽舍」（美丽宅邸）：借词带来陌生化的高级感，四字结构在中文婚庆市场兼顾了正式与画面" },
      ],
      pitfalls: [
        "堆砌「爱/缘/永恒/浪漫」：情感通货膨胀最严重的词区，十家婚庆九家在用，剩下一家叫「真爱永恒」",
        "名字锁死单一服务：叫「XX婚礼跟拍」就很难接策划全案——婚庆利润在全案与增购，名字要给业务留门",
        "只考虑新人不考虑渠道：酒店、婚礼堂引荐是重要客源，名字在渠道报价单上要显得专业，过于少女感会被渠道过滤",
        "忽略视觉落地：婚庆名字必然要做 logo 烫金、请柬排版——定名前先把名字用衬线体排一遍，不好看的名字直接淘汰",
      ],
    },
    en: {
      label: "Wedding planners",
      title: "How to Name a Wedding Planning Business: Ideas, Cases & Domains",
      metaDescription:
        "Wedding business naming guide: moment-based names, ceremony-word roots, atelier structures, breakdowns of The Knot/Zola, recommended TLDs and pitfalls — then hunt an available wedding domain with AI.",
      intro:
        "Weddings are the classic once-in-a-lifetime, high-ticket business: there is no repeat purchase to fix a weak first impression, so the name must land on the first encounter — at a bridal expo booth, in a Pinterest board, in the link a bride forwards to her best friend. It also has to win two generations at once: couples want romance and taste, while the parents paying the deposit want professionalism and reliability. That makes wedding naming a balance of ceremony and trustworthiness — too saccharine and you sound like a package-deal photo mill; too corporate and you kill the dream. One underrated fact: your name ends up printed on invitation corners, welcome signs and the closing frame of wedding films. It's a name that lives on other people's keepsakes — write it like a signature on your work, not a listing in a directory.",
      namingIdeas: [
        "Name the moment: draw from the highest-emotion beats of a wedding — the vow, the ring exchange, the first dance, the aisle. Moment-words are ten times more concrete than love-words, and far less worn out",
        "Use ceremony roots: fete, gala, bloom, aisle — words that carry the picture of an occasion put you in wedding context without spelling out \"wedding\"",
        "Show the two-name structure: couples adore \"our names entwined\" branding; if your own brand is an elegant pairing of two roots (the Rose & Rye pattern), it doubles as a demo of your taste",
        "Texture word + atelier word: detail obsession is the product — pair material words (fine, velvet, gilt) with maker words (atelier, studio) to signal bespoke craft, not conveyor-belt packages",
        "Read it to a bride: put finalists into the real sentence — \"we booked X for our wedding.\" If it sounds natural in a group chat and carries a hint of pride, it passes",
      ],
      cases: [
        { name: "The Knot", takeaway: "\"Tie the knot\" — a three-letter everyday word that borrows an idiom to own the entire category; the best bargain in the wedding lexicon" },
        { name: "Zola", takeaway: "A two-syllable, name-like coinage with zero wedding vocabulary, yet elegant and effortless: proof a wedding brand can win on vibe alone — and it left room to expand from registry into home goods" },
        { name: "Jose Villa", takeaway: "A top wedding photographer trading under his own name: weddings are a person-to-person trust business, and a personal name plus a portfolio is the strongest credential a studio can start with" },
        { name: "Loverly", takeaway: "lovely with a smuggled-in \"lover\": one letter of wordplay adds the romance layer while staying instantly readable — misspelling done with restraint" },
      ],
      pitfalls: [
        "Stacking love/forever/eternal/romance: the most inflation-hit corner of the dictionary — nine of ten competitors are already there",
        "Locking the name to one service: \"X Wedding Films\" struggles to sell full planning — margins live in full-service and upsells, so leave the door open",
        "Designing only for the couple: venue and planner referrals are a major channel, and a name that reads too girlish gets filtered out of a hotel's vendor sheet",
        "Skipping the print test: this name will be foil-stamped and set in serif on invitations — typeset every finalist first, and cut the ones that look wrong",
      ],
    },
  },
  bnb: {
    slug: "bnb",
    tlds: [
      { tld: "com", zh: "OTA 之外的直订官网是民宿利润关键，.com 让客人敢直接付款", en: "Direct bookings are where the margin lives — .com makes guests comfortable paying you directly" },
      { tld: "life", zh: "卖的是「另一种生活」的民宿品牌，.life 把主张放进后缀", en: "For stays selling \"another way to live\", .life puts the promise in the suffix" },
      { tld: "world", zh: "多城市/多物业的短租品牌，.world 自带目的地集合感", en: "For multi-city, multi-property brands, .world signals a collection of destinations" },
    ],
    zh: {
      label: "民宿短租",
      title: "民宿短租品牌怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "民宿短租命名指南：在地词根、栖居隐喻、房东人格等 5 种思路，Airbnb/既下山等案例拆解，推荐 TLD 与避坑清单，并用 AI 猎取可注册的民宿域名。",
      intro:
        "民宿的名字在两个完全不同的货架上被挑选：一个是 Airbnb/携程列表页——名字挤在照片和价格中间，几个字就要传递「这里跟连锁酒店不一样」；另一个是客人退房后的转述——「我们住的那家叫 X，老板人特别好」。这决定了民宿命名的独特逻辑：它更像给一个「有主人的地方」起名，而不是给公司起名。最好的民宿名都带着在地性（这座山、这条巷、这片海）和栖居感（居、宿、舍、院），让客人订房时就开始想象住进去的样子。连锁化的短租品牌则相反——要压制单店的随机感，名字要能装下几十个城市的物业。先想清楚你是「一家店」还是「一个品牌」，再动笔。",
      namingIdeas: [
        "在地词根：把民宿所在的山名、村名、老街名、方言词嵌进名字——在地词自带故事和搜索独占性，客人搜目的地时顺路撞见你",
        "栖居字库：中文的居/宿/舍/院/里/山房，英文的 nest、den、hearth（炉边）、lodge——这类词一个字就完成「可以住」的品类说明，剩下的字负责气质",
        "房东人格命名：以主人身份起名（某某的院子、Auntie 系），适合单店：民宿卖的一半是房子一半是主人，人格名把「有人照应」写进了品牌",
        "反酒店命名：刻意避开酒店词汇（豪庭、国际、公馆），用小、慢、野等「去标准化」的词——客人选民宿就是在逃离标准化，名字要站在他们这边",
        "多物业预检：若计划扩张，名字必须能加地名后缀不别扭——「X·大理店」「X Kyoto」念一遍；装不下第二家店的名字趁早换",
      ],
      cases: [
        { name: "Airbnb", takeaway: "air bed and breakfast 的缩合：从「气垫床 + 早餐」的寒酸起点提炼出轻盈的品牌词，证明品类词缩合后可以完全脱离原义生长" },
        { name: "既下山", takeaway: "取自「既见君子，云胡不喜」的古典语感 +「下山」的动作画面：三个字同时交付了目的地（山）、旅程（下山歇脚）与文人气质——中文民宿命名的天花板" },
        { name: "Sonder", takeaway: "一个小众英文词：「意识到每个路人都有完整人生」——精准命中旅居者的情绪，把标准化公寓讲出了人文感；生僻词的风险被两音节的好读抵消" },
        { name: "松赞", takeaway: "创始人家乡的藏语词（松赞林寺）：在地词做品牌统领多家山居酒店，每开一店都在加深「滇藏在地」的叙事——在地词根规模化的范本" },
      ],
      pitfalls: [
        "堆「山水云谷」通用意象：平台搜索里几百家「云舍」「山语」，在地性为零的风景词等于没起名",
        "名字与房源气质错位：小院平房叫「XX 豪庭」，客人到店的心理落差直接写进差评——名字是承诺，兑现不了就是负资产",
        "只在平台起名不注册域名：直订省下的佣金是民宿的核心利润，没有官网域名等于永远给 OTA 打工",
        "生僻字与多音字：客人打车报店名、导航搜索都会卡住——「念得出、打得出」是民宿名的硬门槛",
      ],
    },
    en: {
      label: "BnBs & stays",
      title: "How to Name a BnB or Vacation Rental Brand: Ideas, Cases & Domains",
      metaDescription:
        "BnB and short-term rental naming guide: place-rooted words, dwelling metaphors, host-persona names, breakdowns of Airbnb/Sonder, recommended TLDs and pitfalls — then hunt an available domain with AI.",
      intro:
        "A stay brand gets chosen on two very different shelves. The first is the Airbnb or Booking listing page, where your name sits squeezed between photos and a price and has a few words to say \"this is not a chain hotel.\" The second is the retelling after checkout — \"we stayed at this place called X, the host was wonderful.\" That's why naming a stay is less like naming a company and more like naming a place with a person in it. The best BnB names carry place (this mountain, this lane, this coastline) and dwelling warmth (nest, hearth, lodge), so guests start imagining the stay at the moment of booking. Multi-property brands run the opposite play: they need a name roomy enough to hold dozens of cities. Decide whether you're naming one beloved house or a portfolio before you write a single candidate.",
      namingIdeas: [
        "Root it in place: fold the hill, village, old street or a dialect word into the name — place-words carry built-in story and search exclusivity, and destination searches will stumble onto you",
        "Draw from the dwelling lexicon: nest, den, hearth, lodge, porch — one such word settles the \"you can sleep here\" question, freeing the rest of the name to carry mood",
        "Name as the host: host-persona names (\"Marta's Courtyard\") fit single properties — a stay is half the house and half the human, and a persona name writes \"someone will look after you\" into the brand",
        "Anti-hotel naming: deliberately avoid hotel vocabulary (grand, plaza, international) and reach for small, slow, wild — guests book a BnB to escape standardization; the name should take their side",
        "Pre-check for portfolio: if you plan to expand, the name must take a city suffix gracefully — say \"X Kyoto\" and \"X Lisbon\" aloud; a name that can't hold a second property should be replaced now",
      ],
      cases: [
        { name: "Airbnb", takeaway: "A contraction of \"air bed and breakfast\": a scrappy origin distilled into a light, ownable brand word — proof a category phrase can outgrow its literal meaning entirely" },
        { name: "Sonder", takeaway: "An obscure coined word — \"the realization that every passerby has a life as vivid as your own\" — landing exactly on the traveler's emotion; the risk of obscurity offset by two clean syllables" },
        { name: "Selina", takeaway: "A warm personal name for a global hostel-hotel brand: persona naming scaled up — every property feels hosted, not managed, and the name stretched across 20+ countries" },
        { name: "The Hoxton", takeaway: "Named after its first neighborhood in London: the place-root became the brand and travelled to Paris and Brooklyn intact — the definitive case for local words scaling globally" },
      ],
      pitfalls: [
        "Generic scenery words (cloud, valley, haven stacked together): platform search shows hundreds of them — a landscape word with zero place attachment is a non-name",
        "A name your property can't live up to: calling a two-room cottage \"X Grand Estate\" writes the disappointment straight into your reviews — the name is a promise",
        "Existing only on platforms: direct bookings are where a stay's margin lives; without your own domain you're renting your brand from the OTA forever",
        "Hard-to-say, hard-to-type names: guests read your name to taxi drivers and type it into maps — \"sayable and typeable\" is the minimum bar",
      ],
    },
  },
  courses: {
    slug: "courses",
    tlds: [
      { tld: "com", zh: "知识付费的付款页信任至关重要，.com 在成人学员里转化最稳", en: "Checkout trust is everything in paid education — .com converts adult learners most reliably" },
      { tld: "online", zh: "在线课程用 .online 零解释成本，「品牌.online」读起来就是一句话", en: "Zero explanation for online courses — \"brand.online\" reads as a sentence" },
      { tld: "club", zh: "社群型知识产品（训练营/会员制），.club 自带归属感与续费语境", en: "For cohort and membership products, .club bakes belonging and renewal into the address" },
    ],
    zh: {
      label: "在线课程",
      title: "在线课程与知识付费品牌怎么起名：命名思路、案例与域名选择",
      metaDescription: "在线课程与知识付费命名指南：结果承诺、方法论命名、师徒人格等 5 种思路，MasterClass/得到等案例拆解，推荐 TLD 与常见误区，并用 AI 猎取可注册的课程域名。",
      intro:
        "知识付费的名字要跨过一道其他行业没有的心理关卡：学员付钱买的是「未来的自己」，而课程质量在付款前完全不可见。名字是第一份信任凭证——它要暗示结果（学完你会变成什么样）、暗示方法（凭什么是你教）、还要在朋友圈转发海报上撑住门面。这个行业的命名分两条路线：平台路线（装得下无数门课，如 MasterClass）与 IP 路线（绑定一个老师或一套方法论，如「XX 训练营」）。路线不同名字逻辑完全不同：平台名要中性、有容量；IP 名要锋利、有立场。最常见的失败是两头摇摆——名字既没有平台的规模感，也没有 IP 的锐度，学员记不住你到底教什么。",
      namingIdeas: [
        "结果承诺命名：不说「教什么」，说「学完变成什么」——写作课不叫「写作训练营」叫「下笔有神」；把课程大纲最后一页的承诺提炼成名字",
        "方法论命名：给你的教学体系起个专有名（费曼学习法式的「XX 法」），课程名 = 方法名，学员转述时自动帮你传播体系而非泛泛的品类",
        "师徒人格：用「教练/师父/领路人」的角色词（mentor、guide、coach 词根）传递「有人带」——知识付费买的一半是监督与陪伴，名字要把人味放出来",
        "刻度词与阶梯感：Level、阶、营、Bootcamp——带「进度感」的词暗示了从 A 到 B 的路径，比静态的「学院/课堂」多一层动起来的承诺",
        "海报压力测试：知识付费的获客主场景是转发海报与直播间口播——把候选名放进「我报了 X 的课」这句话，以及 9:16 海报的大标题位，两个场景都成立才定稿",
      ],
      cases: [
        { name: "MasterClass", takeaway: "master（大师/精通）+ class：两个词同时说清「谁来教」（大师）与「教到什么程度」（精通）——平台名的容量与承诺感兼得，教科书级组合" },
        { name: "得到", takeaway: "一个动词补语做名字：把「知识服务」的抽象品类压缩成用户视角的结果——「我得到了」；两个字、口语化、天然带获得感，中文知识付费命名的标杆" },
        { name: "Duolingo", takeaway: "duo（二/双语）+ lingo（语言的俚语说法）：既说品类又带俏皮感，绿色猫头鹰的人格与名字的轻快互相成就——工具型学习产品「去说教化」的典范" },
        { name: "Skillshare", takeaway: "skill + share 的直白组合：用「分享」替代「教授」，一个词降低了 UGC 老师的门槛也软化了商业感——平台定位由名字直接完成" },
      ],
      pitfalls: [
        "「学院/大学/Academy」自我加冕：无资质却叫大学有合规风险，且 00 后学员对权威词免疫——权威要靠结果证明而非自封",
        "品类词裸奔（XX写作课/XX理财课）：搜索里和几百个同行混在一起，涨价时毫无品牌溢价支撑",
        "名字绑死单一课程：叫「7 天短视频剪辑营」就做不了第二门课——按「课程矩阵」的容量起名，用副标题锁定单品",
        "忽略拼音/英文双轨：中文课程名定了才发现拼音域名超长或被注册——中文名与域名要同步候选、同步核验",
      ],
    },
    en: {
      label: "Online courses",
      title: "How to Name an Online Course or Education Brand: Ideas, Cases & Domains",
      metaDescription:
        "Online course and creator-education naming guide: outcome promises, named methodologies, mentor personas, breakdowns of MasterClass/Duolingo, recommended TLDs and pitfalls — then hunt an available domain with AI.",
      intro:
        "A course name has to clear a psychological bar most industries never face: students pay for a future version of themselves, and the product is invisible until after checkout. The name is the first proof of trust — it should hint at the outcome (what you become), the method (why this teacher), and still hold up as the headline of a shared launch graphic. Education naming splits into two routes: the platform route (roomy and neutral, built to hold endless courses — MasterClass) and the IP route (bound to one teacher or one named methodology — sharp and opinionated). The logic is opposite: platform names need capacity, IP names need edge. The classic failure is hovering in between — a name with neither the scale of a platform nor the bite of an expert, so learners can't recall what you actually teach.",
      namingIdeas: [
        "Promise the outcome: don't name what you teach, name what students become — distill the last page of your syllabus (the transformation) into the brand instead of the category",
        "Name the methodology: give your teaching system a proper noun (the \"X Method\" pattern) — when the course name is the method name, every student retelling markets your system, not a generic category",
        "Cast a mentor persona: roots like coach, guide, mentor put a human in the name — half of what people buy in paid education is accountability and company, and the name should show someone's there",
        "Use ladder words: bootcamp, sprint, level, track — progress-flavored words imply a path from A to B, one promise richer than static words like academy or classroom",
        "Run the launch-graphic test: paid courses are sold through shared graphics and live-stream mentions — set each finalist in \"I enrolled in X\" and in the headline slot of a story-format poster; it must work in both",
      ],
      cases: [
        { name: "MasterClass", takeaway: "master + class: two words answering both \"who teaches\" (masters) and \"to what level\" (mastery) — platform capacity and outcome promise in one, a textbook pairing" },
        { name: "Duolingo", takeaway: "duo + lingo: category and playfulness in one coinage, and the cheeky green owl persona grows straight out of the name — the model for de-lecturing an education product" },
        { name: "Skillshare", takeaway: "skill + share: swapping \"teach\" for \"share\" lowers the bar for creator-teachers and softens the commercial edge — the platform's positioning done entirely by the name" },
        { name: "Maven", takeaway: "A single Yiddish-rooted word for \"expert\": the cohort-course platform borrowed instant expert credibility in five letters — proof one precise word beats a descriptive phrase" },
      ],
      pitfalls: [
        "Self-crowning with academy/university/institute: regulatory risk without accreditation, and younger learners are immune to authority words — authority must come from outcomes, not the name",
        "Naked category names (\"The Writing Course\"): you'll blur into hundreds of peers in search and have zero brand equity when you raise prices",
        "Binding the name to one course: \"7-Day Video Editing Bootcamp\" can't launch course number two — name for the catalog, and let subtitles carry the single product",
        "Checking the name but not the handles: course sales run on social distribution — if the matching YouTube/Instagram handles are gone, keep hunting",
      ],
    },
  },
  boardgame: {
    slug: "boardgame",
    tlds: [
      { tld: "com", zh: "桌游出版与众筹的主阵地在欧美，.com 是 Kickstarter 页面的标配", en: "Board game publishing lives on Kickstarter — .com is table stakes on a campaign page" },
      { tld: "games", zh: "工作室与作品集官网用 .games，一个后缀交代整个品类", en: "Studio and portfolio sites on .games — the whole category explained by the suffix" },
      { tld: "fun", zh: "面向家庭与派对桌游的轻快选择，域名先把气氛拉满", en: "A lighthearted pick for family and party games — the domain sets the mood first" },
    ],
    zh: {
      label: "桌游工作室",
      title: "桌游与游戏工作室怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "桌游与游戏工作室命名指南：盒面法则、机制词根、世界观命名等 5 种思路，Wingspan/Stonemaier 等案例拆解，推荐 TLD 与常见误区，并用 AI 猎取可注册的桌游域名。",
      intro:
        "桌游行业有一个独特结构：玩家记住的往往是「作品名」（Wingspan、卡坦岛），而出版社/工作室名（Stonemaier）活在盒子侧面和众筹页上。所以起名前先分清你在给哪一层命名：工作室名要像出版社——沉稳、有出品感、能装下风格迥异的作品线；作品名则要遵守「盒面法则」——桌游是实体货架 + 众筹封面的生意，名字和封面图必须在三秒内共同说清「这是个关于什么的游戏」。桌游名还有一个隐藏考场：游戏之夜的口头提议——「今晚玩 X 吧」，名字要顺口到能在这句话里反复出现。众筹时代还要加一条：名字在 Kickstarter 搜索和 BGG（BoardGameGeek）词条里要能被准确拼出并唯一命中。",
      namingIdeas: [
        "盒面法则：作品名 + 封面图 = 三秒内讲清题材——名字负责意象（翼展、大镰刀），封面负责画面；两者重复浪费，两者脱节致命",
        "机制词根：从核心机制取词——引擎构筑、轮抽、放置——机制词对核心玩家是精准信号（Splendor 的「璀璨」暗示收集宝石引擎），比题材词更能筛选目标受众",
        "世界观命名：给架空世界起地名/纪元名再让作品继承（洛桑尼亚、第九世界），工作室的多部作品共享词根，粉丝自动把新作归入你的宇宙",
        "出版社式工作室名：创始人姓氏 + 品类词（Stonemaier Games 式）或矿物/材质词——「石头感」的词让工作室显得会长期出品，而非一锤子众筹",
        "游戏之夜测试：把候选名放进「今晚玩 X 吧」「X 再来一局」两句话大声念——桌游靠聚会口碑传播，念不顺的名字传不远",
      ],
      cases: [
        { name: "Wingspan", takeaway: "「翼展」一词三层功效：题材（鸟类）、画面（展开的翅膀）、机制暗示（引擎展开）——一个具体名词完成盒面法则的满分示范" },
        { name: "Stonemaier Games", takeaway: "两位创始人姓氏（Stone + Maier）拼合 + Games：既是「石头工匠」的误读彩蛋又是真实出处，出版社名的沉稳感与故事性兼得" },
        { name: "卡坦岛", takeaway: "架空地名直接做名字：Catan 四个字母无实义却自成世界，扩展包全部继承（卡坦航海家）——世界观命名规模化的开山案例" },
        { name: "Exploding Kittens", takeaway: "「爆炸猫」荒诞组合词：违和感即记忆点，精准锁定派对轻桌游受众，也证明众筹时代「名字即梗图」的传播打法成立" },
      ],
      pitfalls: [
        "工作室名与作品名抢戏：工作室叫「巨龙远征」再出一款种田游戏就精神分裂——工作室名要中性容器化，锋利留给作品",
        "题材词裸拼（Dragon/Quest/Empire 排列组合）：BGG 上几千个撞词条，搜索时你的游戏永远排在同名后面",
        "忽略多语言发行：桌游出海是常态，名字要预检主要市场发音与含义——德语区是桌游第一市场，德语读感别忽略",
        "名字超过盒面容量：五个词的名字在货架上只能缩小字号——名字越短，盒面字号越大，三米外的辨识度越高",
      ],
    },
    en: {
      label: "Board games",
      title: "How to Name a Board Game or Game Studio: Ideas, Cases & Domains",
      metaDescription:
        "Board game and tabletop studio naming guide: the box-cover rule, mechanism roots, world-first naming, breakdowns of Wingspan/Stonemaier, recommended TLDs and pitfalls — then hunt an available domain with AI.",
      intro:
        "Tabletop has a peculiar structure: players remember the game's name (Wingspan, Catan) while the studio name (Stonemaier) lives on the side of the box and the Kickstarter page. So first decide which layer you're naming. A studio name should behave like a publisher's — steady, curatorial, roomy enough for wildly different product lines. A game title obeys the box-cover rule: tabletop is a retail-shelf and crowdfunding-cover business, and the title plus the cover art must jointly explain \"what this game is about\" in three seconds. There's also a hidden exam room: game night — \"let's play X tonight\" — where the title must roll off the tongue on repeat. And in the crowdfunding era, add one more check: the name must be spellable and uniquely findable in Kickstarter search and on BoardGameGeek.",
      namingIdeas: [
        "Apply the box-cover rule: title carries the image (a wingspan, a scythe), cover art carries the scene — if they repeat each other you've wasted one; if they disagree you've lost the shelf",
        "Mine the mechanism: engine-building, drafting, worker placement — mechanism-flavored words are precise signals to core gamers (Splendor whispers \"collect shiny things\") and filter your audience better than theme words",
        "Build the world first: coin a place or era name for your setting and let titles inherit it — a studio's games sharing roots means fans file every new release into your universe automatically",
        "Name the studio like a publisher: founder surnames plus a category word (the Stonemaier Games pattern) or mineral/material words — stone-flavored names read as \"here for decades\", not one Kickstarter and gone",
        "Run the game-night test: say \"let's play X tonight\" and \"one more round of X\" out loud — tabletop spreads through spoken invitations, and a clumsy title travels nowhere",
      ],
      cases: [
        { name: "Wingspan", takeaway: "One concrete noun doing three jobs: theme (birds), image (spread wings), and a mechanism hint (an engine unfolding) — a perfect score on the box-cover rule" },
        { name: "Stonemaier Games", takeaway: "Two founders' surnames fused (Stone + Maier): reads as \"stone maker\" by happy accident while being genuinely personal — publisher gravitas with a built-in origin story" },
        { name: "Catan", takeaway: "An invented place name of four letters and no dictionary meaning, yet a whole world — every expansion inherits it (Catan: Seafarers), the founding case of world-first naming at scale" },
        { name: "Exploding Kittens", takeaway: "An absurd collision of words where the wrongness is the memorability: it locked onto the party-game crowd and proved the name-as-meme playbook works in crowdfunding" },
      ],
      pitfalls: [
        "A studio name that upstages the games: call the studio \"Dragon Crusade\" and your farming game looks lost — keep the studio neutral and containered; save the edge for titles",
        "Raw fantasy-word permutations (Dragon/Quest/Empire): thousands of BGG entries collide there, and your game ranks behind every same-named predecessor forever",
        "Ignoring localization: tabletop goes global by default — pre-check pronunciation and meaning in key markets, and don't skip German, the world's biggest board game market",
        "A title longer than the box can afford: five words means a smaller typeface — the shorter the name, the bigger the print, the farther the shelf visibility",
      ],
    },
  },
  outdoor: {
    slug: "outdoor",
    tlds: [
      { tld: "com", zh: "户外装备电商与品牌官网的默认选择，海外渠道合作也认它", en: "The default for outdoor gear stores and brand sites — overseas retail partners expect it" },
      { tld: "world", zh: "「去更大的世界」是户外的母题，.world 与品牌叙事同频", en: "\"Out into the wider world\" is the genre's core story — .world hums the same tune" },
      { tld: "life", zh: "露营/山系生活方式品牌用 .life，卖的不是装备是生活提案", en: "Camp-life and mountain-lifestyle brands sell a way of living, not gear — .life says so" },
    ],
    zh: {
      label: "户外露营",
      title: "户外露营品牌怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "户外露营品牌命名指南：地貌词根、天气与火、装备人格等 5 种思路，Patagonia/Snow Peak 等案例拆解，推荐 TLD 与常见误区，并用 AI 猎取可注册的户外域名。",
      intro:
        "户外品牌的名字要能经受两种极端环境：一种是物理的——绣在冲锋衣胸口、压印在钛杯底部、缝在帐篷门帘上，名字本身就是装备的一部分；另一种是精神的——户外消费买的是「另一种人生的入场券」，名字要装得下山野、火塘和「逃离城市」的向往。这个品类命名有个可靠的富矿：自然专有名词。Patagonia（巴塔哥尼亚高原）、Snow Peak（雪峰）证明了地貌与山名自带辽阔感和真实性，比抽象的「野/风/行」组合词高一个量级。另一个关键取舍是硬核与生活方式的光谱定位：攀岩绳品牌与精致露营品牌的名字气质完全不同——先定你在光谱哪一端，再选词根。",
      namingIdeas: [
        "地貌专名：山峰、高原、峡谷、河流的真实地名是户外命名第一富矿——自带画面、辽阔感与「我们真的去过」的可信度；优先选目标用户心中有向往的地名",
        "天气与火：风、雪、暮光、篝火、余烬（ember）——户外记忆最深的时刻都和天气与火有关，这类词唤起的是体验而非装备",
        "装备人格化：从核心装备取魂——锚、桨、斧、结绳——器物词让品牌显得可靠耐用，适合硬核装备线",
        "山系生活方式词：面向精致露营人群用「慢、栖、野餐、营地」等柔性词根，配 .life/.world 后缀——这半边市场买氛围，名字先把氛围给足",
        "刺绣测试：户外名字必然出现在织物刺绣和金属压印上——候选名全大写排一遍，超过 8 个字母的词绣在胸标上就挤了；短词在这个品类是硬通货",
      ],
      cases: [
        { name: "Patagonia", takeaway: "直接借用南美高原地名：五音节却全球通读，地名的辽阔与真实感撑起了品牌的环保叙事——地貌专名命名的天花板" },
        { name: "Snow Peak", takeaway: "创始人常年攀登的「雪峰」（谷川岳）直译：两个最简单的英文词组合出画面与出处，日本品牌用英文名打开全球市场的教科书" },
        { name: "The North Face", takeaway: "「山的北壁」——登山者都知道北壁最冷最难爬：一个行话级的方位词完成了硬核定位，圈内人秒懂，圈外人觉得酷" },
        { name: "挪客 Naturehike", takeaway: "nature + hike 直拼 + 中文「挪客」音译带「挪动的旅客」联想：双语命名工整对应，大众露营市场「一听就懂」路线的成功样本" },
      ],
      pitfalls: [
        "野/风/行/山排列组合：国产户外新品牌重灾区，两字组合词几乎穷尽——没有具体意象的自然词等于没起名",
        "名字锁死单一场景：叫「XX 露营」就做不了徒步线和城市机能线——户外品牌的增长都靠品类扩张，名字要留出海拔跨度",
        "忽略国际读感：户外品牌天然要出海（装备供应链与户外文化都是全球的），拼音名在海外渠道会成为发音障碍",
        "过度硬核吓退新手：极限词（extreme、summit 堆砌）会把最大的增量人群——刚入坑的轻度玩家——挡在门外",
      ],
    },
    en: {
      label: "Outdoor & camping",
      title: "How to Name an Outdoor or Camping Brand: Ideas, Cases & Domains",
      metaDescription:
        "Outdoor and camping brand naming guide: landform proper nouns, weather-and-fire words, gear personas, breakdowns of Patagonia/The North Face, recommended TLDs and pitfalls — then hunt an available outdoor domain with AI.",
      intro:
        "An outdoor brand's name must survive two kinds of extreme environments. The physical one: embroidered on a jacket chest, stamped into a titanium mug, sewn onto a tent flap — the name literally becomes part of the gear. And the spiritual one: outdoor spending buys a ticket to another kind of life, so the name has to hold mountains, campfires and the ache to leave the city. This category has one reliably rich vein: natural proper nouns. Patagonia and Snow Peak proved that real landforms and summits carry vastness and authenticity a synthetic \"wild/trek/peak\" mashup never will. The other decisive call is where you sit on the hardcore-to-lifestyle spectrum — a climbing-rope brand and a glamping brand need entirely different name energy, so fix your position on that spectrum before choosing roots.",
      namingIdeas: [
        "Mine landform proper nouns: real peaks, plateaus, canyons and rivers are the genre's first vein — built-in imagery, scale, and \"we've actually been there\" credibility; pick places your audience already dreams about",
        "Reach for weather and fire: wind, snow, dusk, ember, campfire — the deepest outdoor memories are weather-and-fire moments, and these words summon the experience rather than the equipment",
        "Personify the gear: anchor, axe, paddle, knot — object words read as dependable and over-built, the right register for hardcore equipment lines",
        "Go soft for camp-life: for the glamping crowd, gentle roots (slow, nest, meadow, basecamp) with a .life or .world suffix — this half of the market buys atmosphere, so the name should pour it",
        "Run the embroidery test: this name will live in thread and stamped metal — set every finalist in all caps; past eight letters a chest patch gets crowded. Short words are hard currency here",
      ],
      cases: [
        { name: "Patagonia", takeaway: "A borrowed South American plateau: five syllables yet readable worldwide — the landform's vastness and authenticity carry the brand's environmental story. The ceiling of proper-noun naming" },
        { name: "Snow Peak", takeaway: "A literal translation of the snowy peak its founder climbed (Mt. Tanigawa): two of the simplest English words yielding image plus provenance — the textbook for a Japanese brand naming itself into the global market" },
        { name: "The North Face", takeaway: "Climbers know the north face is the coldest, hardest route up: one piece of insider vocabulary does the entire hardcore positioning — instant recognition inside the sport, instant cool outside it" },
        { name: "Fjällräven", takeaway: "Swedish for \"arctic fox\": a native-language animal word that exports its origin (and the fox logo) in one move — proof a local word plus an icon travels better than invented English" },
      ],
      pitfalls: [
        "Wild/trek/peak permutations: the most crowded corner of outdoor naming — a nature word with no specific image attached is a non-name",
        "Locking into one activity: \"X Camping\" can't launch a hiking line or urban-technical apparel — outdoor brands grow by category expansion, so leave altitude range in the name",
        "Ignoring international readability: outdoor brands go global by default (the supply chain and the culture both are) — a name that stumbles overseas becomes a distribution tax",
        "Scaring off beginners with extremity: stacking summit/extreme words gates out the biggest growth segment — the newcomers who just bought their first tent",
      ],
    },
  },
  cleaning: {
    slug: "cleaning",
    tlds: [
      { tld: "com", zh: "家政是「让陌生人进家门」的生意，.com 的正规感直接影响下单", en: "You're asking to be let into someone's home — .com's legitimacy directly moves bookings" },
      { tld: "pro", zh: "强调持证与专业流程的服务商，.pro 一个后缀完成资质暗示", en: "For licensed, process-driven operators, .pro implies the credential in the suffix" },
      { tld: "life", zh: "定位「生活方式服务」的家政品牌，.life 把清洁升维成生活质感", en: "For brands framing housekeeping as lifestyle care, .life elevates cleaning into quality of life" },
    ],
    zh: {
      label: "家政清洁",
      title: "家政清洁品牌怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "家政清洁服务命名指南：焕新词根、信任人格、效率承诺等 5 种思路，Molly Maid/Handy 等案例拆解，推荐 TLD 与常见误区，并用 AI 猎取可注册的家政域名。",
      intro:
        "家政清洁的名字要解决一个根本问题：说服客户把家门钥匙交给陌生人。所以这个品类命名的第一关键词不是「干净」而是「可托付」——名字要像一个靠谱邻居的名字，而不是一个冰冷的平台代号。第二个特点是本地搜索主导：绝大多数订单来自「城市名 + 保洁」的搜索与地图结果，名字要在 Google 地图卡片和大众点评列表里，与五星评分并排出现时显得专业。第三是低频高信任的复购结构——客户一旦满意就长期锁定，名字承担着「被存进通讯录备注」的使命：「保洁-小王阿姨」还是你的品牌名，取决于名字够不够好记。",
      namingIdeas: [
        "焕新词根：fresh、sparkle、光、净、焕——描述「清洁之后的状态」而非清洁动作本身；客户买的是推门那一刻的如释重负，不是拖地过程",
        "信任人格：人名/阿姨/管家式命名（Molly Maid 路线）——把服务拟人成一个具体的可靠角色，「让 X 来搞定」比「预约 XX 平台」的心理门槛低得多",
        "效率承诺词：handy、swift、闪、快——上门服务的核心焦虑是等待与拖延，名字里的速度感是对痛点的直接回应；适合按次计费的即时服务",
        "本地化前缀预留：连锁化要靠「品牌名 + 城区」扩张——候选名后面加「·朝阳站」「West Side」念一遍，装不下分站的名字要慎选",
        "通讯录测试：家政的复购靠客户手机通讯录——把名字想象成微信备注：能被完整记住并转介绍（「你加一下 X 家政」），才算过了最重要的一关",
      ],
      cases: [
        { name: "Molly Maid", takeaway: "人名 Molly + 职业词 Maid 的头韵组合：一个具体的「莫莉阿姨」形象让全球特许经营网络保持了「熟人上门」的亲切感——信任人格命名的鼻祖" },
        { name: "Handy", takeaway: "一词双关：「顺手/方便」+「手工活（handyman）」——五个字母同时交付品类与效率承诺，平台型上门服务命名的极简答案" },
        { name: "天鹅到家", takeaway: "「天鹅」的洁白优雅 +「到家」的服务场景：意象词负责品质联想，场景词负责说清业务——中文家政命名「气质+直白」双层结构的范本" },
        { name: "The Maids", takeaway: "定冠词 The + 复数职业词：像球队名一样把保洁员集体品牌化，暗示「一支训练有素的队伍」而非零散钟点工——团队感即专业感" },
      ],
      pitfalls: [
        "洁/净/洁士随机组合：本地生活服务重名率最高的区域，工商注册都难通过，更别说搜索独占",
        "名字过度平台化：冷冰冰的科技感代号（XX到家云）在「让人进家门」的生意里适得其反——距离感就是流失率",
        "只做中文名不占域名与地图主页：本地服务的官网可以简单，但「搜品牌名第一位是自己」是底线，否则评价与比价入口都在别人手里",
        "承诺过满的极限词：「一尘不染」「零死角」写进名字等于把差评的标尺交给客户——名字可以传递焕新感，但别立军令状",
      ],
    },
    en: {
      label: "Cleaning services",
      title: "How to Name a Cleaning or Home Services Brand: Ideas, Cases & Domains",
      metaDescription:
        "Cleaning and home services naming guide: after-state words, trust personas, speed promises, breakdowns of Molly Maid/Handy, recommended TLDs and pitfalls — then hunt an available domain with AI.",
      intro:
        "A cleaning brand's name has one fundamental job: convincing someone to hand their house keys to a stranger. So the first keyword of this category isn't \"clean\" — it's \"trustable.\" The name should sound like a dependable neighbor, not a cold platform codename. Second, this is a local-search business: most bookings come from \"cleaner near me\" queries and map results, so the name must look professional sitting inside a Google Maps card next to a star rating. Third, the purchase pattern is low-frequency, high-trust: a satisfied customer locks in for years, and the name's real mission is to survive being saved into a phone's contacts. Whether that contact reads \"cleaner - Maria\" or your brand name depends entirely on how memorable the name is.",
      namingIdeas: [
        "Name the after-state: fresh, sparkle, gleam, renew — describe how the home feels when the door opens, not the mopping itself; customers buy the exhale, not the process",
        "Build a trust persona: personal-name or housekeeper-style names (the Molly Maid route) turn the service into a specific reliable character — \"have X handle it\" clears a far lower bar than \"book a platform\"",
        "Promise speed: handy, swift, snap — the core anxiety of home services is waiting and no-shows, so tempo in the name answers the pain point directly; best for on-demand, per-job services",
        "Reserve a locality slot: chains grow as \"brand + neighborhood\" — say each finalist with \"West Side\" or \"Brooklyn\" appended; a name that can't take a branch suffix will fight your expansion",
        "Run the contacts test: repeat business lives in the customer's phone — imagine the name as a saved contact and a referral sentence (\"just call X\"); if it survives both, it passes the most important gate",
      ],
      cases: [
        { name: "Molly Maid", takeaway: "First name + occupation in alliteration: a concrete \"Molly\" figure kept a global franchise network feeling like a trusted neighbor at the door — the founding case of trust-persona naming" },
        { name: "Handy", takeaway: "One word, two readings: \"convenient\" plus \"handyman\" — five letters delivering both the category and the speed promise; the minimalist answer for on-demand home services" },
        { name: "The Maids", takeaway: "Definite article + plural occupation: branding the cleaners collectively like a sports team — implying a trained crew rather than scattered gig workers; team feel is professional feel" },
        { name: "Merry Maids", takeaway: "An emotion word bolted to the occupation: \"merry\" sells the mood of a cleaned home and the demeanor at your door — one adjective doing the differentiation in a commodity category" },
      ],
      pitfalls: [
        "Sparkle/shine/clean permutations: the most collision-prone corner of local services — you'll struggle to register the business name, let alone own the search results",
        "Over-platforming the name: a chilly tech codename backfires in a let-them-into-your-home business — distance in the name becomes churn in the funnel",
        "Skipping the domain and map profile: a local service site can be simple, but ranking first for your own brand name is the floor — otherwise reviews and price comparisons happen on someone else's turf",
        "Absolute promises in the name: \"Spotless\" or \"Zero Dust\" hands every customer a ruler to measure you against — convey freshness, don't sign a guarantee",
      ],
    },
  },
  marketing: {
    slug: "marketing",
    tlds: [
      { tld: "agency", zh: "后缀即业态：营销服务商用 .agency 一眼说清「我们是代理机构」", en: "The suffix is the business model — .agency tells clients instantly you're the shop they hire" },
      { tld: "media", zh: "MCN 与内容营销公司天然匹配 .media，品牌名+媒体属性一步到位", en: "A natural fit for MCNs and content studios — brand plus media identity in one stroke" },
      { tld: "com", zh: "接大客户比稿时 .com 仍是提案封面上最稳的一行字", en: "When pitching enterprise accounts, .com is still the safest line on the proposal cover" },
    ],
    zh: {
      label: "数字营销",
      title: "数字营销机构与 MCN 怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "数字营销机构/MCN 命名指南：增长动词、结果承诺、反行话命名等 5 种思路，Ogilvy/Wpromote 等案例拆解，推荐 TLD 与常见误区，并用 AI 猎取可注册的营销机构域名。",
      intro:
        "营销机构的名字有一个天然悖论：你的本行就是给别人起名做品牌，所以自己的名字就是能力证明——客户会默认「连自己名字都起不好的机构，凭什么给我做增长」。这决定了营销公司命名的第一原则：名字本身要展示你信奉的方法论。信增长黑客就叫出增长感，信内容为王就叫出编辑部气质，信品牌溢价就起一个有品牌感的造词。第二个特点是比稿场景主导：名字会出现在提案封面、邮件签名和客户内部转述里（「我们请了 XX 来做投放」），要在甲方会议室里念出来不尴尬。第三是人才市场同样看名字——机构靠人，名字太土会直接影响招聘。MCN 还要多考虑一层：名字要能罩住旗下达人矩阵，像厂牌而不是像某个人的工作室。",
      namingIdeas: [
        "增长动词化：grow、boost、lift、scale、冲、涨——营销客户买的是结果，动词名字把结果写在门脸上；适合效果导向的投放型机构",
        "反行话命名：行业黑话（synergy、omni、matrix）已被用烂，反着来用大白话或生活词（Wieden+Kennedy 直接用人名）反而在一排「XX 互动」里跳出来",
        "厂牌式造词：MCN 学唱片公司命名——短、酷、抽象（Motown 路线），名字是给达人背书的厂牌 logo，不锁定任何内容品类，签约什么类型的达人都装得下",
        "创始人姓名制：广告业百年传统（Ogilvy、BBDO 是四个姓的缩写）——个人 IP 就是获客渠道时，姓名制让「找 XX 做营销」和「找 XX 公司」合二为一",
        "数据词+人文词混搭：一半理性一半创意是营销机构的自我定位——把 signal、metric 类词与 story、craft 类词各列一排交叉组合，撞出「既懂数据又懂内容」的名字",
      ],
      cases: [
        { name: "Ogilvy", takeaway: "创始人大卫·奥格威的姓：个人方法论（《一个广告人的自白》）成了行业圣经，姓氏随之成为「品牌广告」的代名词——姓名制命名的天花板" },
        { name: "Wpromote", takeaway: "W + promote（推广）：把最直白的行业动词收进名字，前缀 W 制造独占性——「我们是干推广的」一秒说清，效果型机构命名的务实样本" },
        { name: "无忧传媒", takeaway: "「无忧」说给两端听：达人签我无忧、品牌投我无忧——一个情绪承诺同时覆盖 MCN 的双边市场，中文机构命名「情绪词+传媒」结构的头部案例" },
        { name: "VaynerMedia", takeaway: "Gary Vaynerchuk 的姓 + Media：创始人本人就是全网顶流，名字直接把个人 IP 的流量导给机构——个人品牌时代姓名制的现代升级版" },
      ],
      pitfalls: [
        "堆砌 digital/interactive/360：上一个十年的机构命名遗产，今天读起来像老旧的官网轮播图——时代感错位比土更致命",
        "承诺极限效果的词（爆量、必火）：甲方第一次复盘不达标时，名字就成了会议室里的靶子",
        "MCN 用当家达人的名字命名机构：达人解约即品牌塌方——厂牌名必须独立于任何单一签约者",
        "只查中文名不查英文与域名：接国际品牌比稿时，没有像样的英文名和官网域名，第一轮就出局",
      ],
    },
    en: {
      label: "Digital marketing",
      title: "How to Name a Marketing Agency or MCN: Strategies, Cases & Domains",
      metaDescription:
        "Marketing agency and creator-network naming guide: growth verbs, anti-jargon names, label-style coinages, breakdowns of Ogilvy/VaynerMedia, recommended TLDs and pitfalls — then hunt an available agency domain with AI.",
      intro:
        "A marketing agency's name carries a built-in paradox: naming and branding is literally your product, so your own name is the portfolio piece every prospect judges first — \"if they can't name themselves well, why would they grow my brand?\" That sets the first rule: the name must demonstrate the methodology you sell. Growth shops should sound like growth, content studios should sound editorial, brand consultancies should carry a coined name with obvious brand craft. Second, the name lives in pitch rooms: it sits on proposal covers, email signatures and the client's internal retelling (\"we hired X for paid media\"), so it has to sound credible spoken aloud in a boardroom. Third, agencies are talent businesses — a cringeworthy name quietly taxes recruiting too. MCNs add one more layer: the name must umbrella a roster of creators, reading like a record label rather than one person's studio.",
      namingIdeas: [
        "Verb the growth: grow, boost, lift, scale — performance clients buy outcomes, and a verb name puts the outcome on the storefront; best for paid-media and growth shops",
        "Go anti-jargon: synergy, omni and matrix are landfill by now — plain words or human names (the Wieden+Kennedy route) pop precisely because every competitor sounds like a martech deck",
        "Coin a label name: MCNs should name like record labels — short, cool, abstract (the Motown route); the name is a logo that endorses creators, and locking onto no content genre keeps every future signing inside the tent",
        "Use founder surnames: advertising's century-old convention (Ogilvy; BBDO is four surnames) — when the founder's personal brand is the sales channel, a surname merges \"hire this person\" and \"hire this firm\" into one",
        "Cross data words with craft words: agencies sell left brain plus right brain — list signal/metric-type words against story/craft-type words and combine until a pairing says \"we do both\" in one breath",
      ],
      cases: [
        { name: "Ogilvy", takeaway: "The founder's surname: David Ogilvy's methodology became the industry's scripture, and the surname became shorthand for brand advertising itself — the ceiling of surname naming" },
        { name: "Wpromote", takeaway: "W + promote: the bluntest industry verb, made ownable by one prefix letter — \"we promote things\" lands in a second; a pragmatic template for performance agencies" },
        { name: "VaynerMedia", takeaway: "Gary Vaynerchuk's surname + Media: the founder is the traffic engine and the name pipes his personal audience straight into the firm — the surname convention upgraded for the creator era" },
        { name: "Dentsu", takeaway: "Literally \"telegraph agency\" in Japanese, fossilized from a 1901 wire service into a two-syllable global brand — proof that a dated literal name can outgrow its meaning once the work speaks" },
      ],
      pitfalls: [
        "Stacking digital/interactive/360: the naming residue of a previous decade — reading dated is deadlier than reading plain",
        "Promising extremes in the name (Viral, Guaranteed): the first missed KPI review turns your own name into the exhibit against you",
        "Naming the MCN after its top creator: one contract dispute and the brand collapses — the label must stand independent of any single roster member",
        "Skipping the English name and domain: for international pitches, no credible English name and matching domain means elimination before the first meeting",
      ],
    },
  },
  therapy: {
    slug: "therapy",
    tlds: [
      { tld: "com", zh: "求助者处于脆弱时刻，.com 的熟悉感就是第一层安全感", en: "Help-seekers arrive vulnerable — .com's familiarity is the first layer of safety" },
      { tld: "life", zh: "把咨询定位成「生活的一部分」而非治病，.life 温和去病耻", en: "Frames therapy as part of life rather than treatment — gently destigmatizing" },
      { tld: "me", zh: "个人执业咨询师的第一人称后缀，「关于我、为了你」的亲密感", en: "For solo practitioners, a first-person suffix with \"about me, for you\" intimacy" },
    ],
    zh: {
      label: "心理咨询",
      title: "心理咨询品牌怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "心理咨询与心理健康服务命名指南：庇护意象、成长隐喻、去病耻化等 5 种思路，BetterHelp/Calm/简单心理 等案例拆解，推荐 TLD 与常见误区，并用 AI 猎取可注册的心理健康域名。",
      intro:
        "心理咨询的名字是在一个人最脆弱的时刻被读到的：深夜搜索「总是失眠焦虑怎么办」的人，点开你的页面之前，先读到的就是名字。所以这个品类的命名底线是「零威胁感」——任何居高临下（治疗、矫正）、贩卖焦虑（抑郁自查）或过度医疗化的字眼都会让求助者在门口转身。好的心理品牌名字更像一个安全的所在：一片林间空地、一间亮着灯的房间、一句「没关系」。第二个关键是去病耻化：让「我在用 X」可以被自然说出口，名字越像生活方式产品，用户越敢向朋友提起。第三是信任的资质感——名字可以温柔，但官网和域名必须专业，因为用户下一步就会核实你是否靠谱。",
      namingIdeas: [
        "庇护意象：港湾、林地、屋檐、灯——空间安全感的词根让「点进来」这个动作本身就像走进一个不被评判的地方；适合咨询室与平台型品牌",
        "成长隐喻：sprout、bloom、抽芽、向阳——把心理工作从「修复问题」重述为「继续生长」，回避病理化叙事的同时给了用户一个愿意认同的自我形象",
        "陪伴人格：名字像一个温和的朋友（「简单心理」的「简单」、Woebot 的 bot 伙伴感）——求助的本质是找人说话，名字拟人化能显著降低第一次预约的门槛",
        "状态词直给：calm、rest、安、静——用户搜索的就是他们想要的状态，名字直接等于结果；适合冥想、睡眠等工具型心理产品",
        "「更好」句式：BetterHelp 路线——比较级承诺改善但不承诺治愈，既给了希望又守住了专业边界；比较级词根在心理品类里是被验证过的安全区",
      ],
      cases: [
        { name: "BetterHelp", takeaway: "better + help：不说 therapy 说 help，用日常词消解就医感；比较级 better 承诺方向而非结果——全球最大在线咨询平台的名字里没有一个医疗词" },
        { name: "Calm", takeaway: "一个词直给目标状态：用户想要什么名字就是什么，搜索意图与品牌名完全重合；配合 calm.com 域名成为「冥想」的品类默认词" },
        { name: "简单心理", takeaway: "「简单」二字对冲了心理咨询在中文语境里的沉重与病耻——「把心理问题变简单」的承诺让预约咨询像订一节课一样自然" },
        { name: "Headspace", takeaway: "head + space：「给头脑一点空间」的具象隐喻，说清冥想价值又完全不医疗化；两个最常用的英文词组合出完全独占的品牌资产" },
      ],
      pitfalls: [
        "医疗化重词（诊疗、康复中心）：未持牌机构用会有合规风险，持牌机构用会吓退轻症与预防型用户——两头不讨好",
        "贩卖焦虑的名字（抑郁测试网）：靠病耻词引流违背行业伦理，平台与应用商店的审核也越来越严",
        "过度诗化导致说不出口：名字太抽象（「彼岸花开心灵驿站」类），用户无法向朋友转述，口碑链路直接断裂",
        "忽略隐私感的域名细节：心理品类用户对「被看到」极度敏感——域名过长、带连字符或杂牌后缀都会放大「这个网站安全吗」的疑虑",
      ],
    },
    en: {
      label: "Therapy & mental health",
      title: "How to Name a Therapy or Mental Health Brand: Ideas, Cases & Domains",
      metaDescription:
        "Therapy and mental-health naming guide: shelter imagery, growth metaphors, destigmatized language, breakdowns of BetterHelp/Calm/Headspace, recommended TLDs and pitfalls — then hunt an available domain with AI.",
      intro:
        "A mental-health name gets read at someone's most vulnerable moment: the person searching \"why can't I stop feeling anxious\" at 2 a.m. reads your name before anything else on the page. That sets the category's hard floor: zero threat. Anything clinical-condescending (treatment, correction), fear-selling (depression self-test) or over-medicalized makes help-seekers turn around at the door. A good mental-health name feels like a safe place — a clearing in the woods, a lit room, a voice saying \"it's okay.\" The second key is destigmatization: the name should make \"I've been using X\" sayable out loud; the more it reads like a lifestyle product, the more users dare mention it to friends. Third, trust still needs credentials: the name can be soft, but the domain and site must look professional, because verifying your legitimacy is the user's very next click.",
      namingIdeas: [
        "Use shelter imagery: haven, grove, harbor, lantern — spatial-safety roots make clicking through feel like stepping somewhere unjudged; suits practices and platforms alike",
        "Reframe with growth metaphors: sprout, bloom, tend — recasting the work from \"fixing what's broken\" to \"continuing to grow\" avoids pathologizing while offering users a self-image they want to claim",
        "Build a companion persona: names that feel like a gentle friend (Woebot's bot-buddy framing) — help-seeking is at heart finding someone to talk to, and a personable name lowers the bar to the first session",
        "Name the desired state: calm, rest, ease — users search for the state they want, so the name equals the outcome; strongest for meditation, sleep and other tool-type products",
        "Use the comparative: the BetterHelp pattern — a comparative promises improvement without promising cure, offering hope while respecting clinical boundaries; a proven safe zone in this category",
      ],
      cases: [
        { name: "BetterHelp", takeaway: "better + help: \"help\" instead of \"therapy\" strips the clinical weight; the comparative promises direction, not outcome — the world's largest therapy platform has zero medical words in its name" },
        { name: "Calm", takeaway: "One word, the exact goal state: search intent and brand name fully overlap; with calm.com it became the category default for meditation itself" },
        { name: "Headspace", takeaway: "head + space: a concrete metaphor — \"give your mind some room\" — that explains meditation's value with no medical framing; two of the commonest English words combined into a fully ownable asset" },
        { name: "Talkspace", takeaway: "talk + space: names the mechanism (talking) and the safety (a space for it) in two syllables — therapy described by what you do, not what's wrong with you" },
      ],
      pitfalls: [
        "Heavy clinical words (treatment center, disorder clinic): risky compliance-wise without licenses, and they scare off the preventive, mild-symptom majority even with them",
        "Fear-selling names (DepressionTest style): stigma-bait traffic violates professional ethics, and platform review policies are tightening against it every year",
        "Over-poeticizing into unsayability: a name too abstract to retell (\"Lotus Beyond Soul Sanctuary\") breaks the referral chain — word of mouth requires words people can actually say",
        "Ignoring privacy cues in the domain: this audience is acutely sensitive to being seen — long domains, hyphens or obscure suffixes all amplify the \"is this site safe?\" doubt",
      ],
    },
  },
  resale: {
    slug: "resale",
    tlds: [
      { tld: "com", zh: "二手交易的核心是陌生人信任，.com 的正规感直接影响成交", en: "Peer-to-peer trade runs on stranger trust — .com's legitimacy moves transactions" },
      { tld: "shop", zh: "循环时尚与中古店的天然后缀，一眼说清「这里能买」", en: "A natural fit for circular fashion and vintage stores — instantly says \"you can buy here\"" },
      { tld: "club", zh: "强调会员制与社群氛围的循环平台，.club 自带圈子感", en: "For membership-driven circular platforms, .club carries the community feel built in" },
    ],
    zh: {
      label: "二手循环",
      title: "二手交易与循环经济品牌怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "二手交易/循环经济品牌命名指南：再生词根、寻宝感、价值观词等 5 种思路，Vinted/ThredUp/多抓鱼 等案例拆解，推荐 TLD 与常见误区，并用 AI 猎取可注册的循环经济域名。",
      intro:
        "二手品牌的名字要完成一次心智翻转：把「旧的、别人不要的」翻译成「有故事的、聪明的、更酷的」。这个品类最大的敌人不是竞品而是心理门槛——买家怕「捡别人剩的」没面子，卖家怕麻烦。好名字要同时给两端递台阶：让买二手听起来像淘到宝（寻宝感），让卖闲置听起来像聪明的生活方式（断舍离、可持续）。第二个特点是双边平台属性：名字要同时对买家和卖家成立，偏向任何一端都会伤害另一端的参与感。第三是价值观红利：循环经济自带环保叙事，名字里恰当的「再生/循环」暗示能吸引价值观驱动的年轻用户，但要克制——说教感一重，购物的乐趣就没了。",
      namingIdeas: [
        "再生词根：re- 前缀家族（renew、reloop、再、循环）——一个前缀就把商业模式说清；注意 re- 开头的域名消耗快，配合创意词根才拿得到",
        "寻宝感命名：treasure、finds、淘、觅——把二手购物重述为「发现的乐趣」，直接对冲「捡剩」的心理负担；适合中古、古着与收藏向平台",
        "轻快动词：swap、flip、转、闪——交易动作本身当名字，暗示「卖闲置很简单」；解决的是卖家端「怕麻烦」这个二手平台最大的供给瓶颈",
        "价值观词轻量植入：green、loop、地球——环保暗示放在词根或尾缀即可（ThredUp 的 up 有升级循环 upcycle 的影子），整句口号式的名字会显得说教",
        "品类昵称化：把品类词变亲昵（多抓鱼谐音 déjà vu、「鱼」自带水循环意象）——昵称感让平台像朋友而不是市场，社区型二手平台的独门打法",
      ],
      cases: [
        { name: "Vinted", takeaway: "vintage 的过去分词式造词：一个词根携带「中古、有年头的好东西”联想，-ed 结尾像一个完成的动作——「被淘到了」；欧洲最大二手时尚平台的名字只有 6 个字母" },
        { name: "多抓鱼", takeaway: "法语 déjà vu（似曾相识）的中文谐音：二手书「与旧物重逢」的诗意被藏进一个好玩的名字里，抓鱼的动作感又让「淘」变得具体——中文二手命名的天花板" },
        { name: "ThredUp", takeaway: "thread（衣线）变形 + up（向上）：拼写变形拿到独占性，up 同时暗示 upcycle（升级再造）与「变好」——循环时尚的价值主张被压缩进 7 个字母" },
        { name: "闲鱼", takeaway: "「闲置」+「咸鱼翻身」的双关：把卖二手说成让闲置资产翻身，自嘲又励志；语出粤语俗语，天然自带传播梗——本土化双关命名的教科书" },
      ],
      pitfalls: [
        "强调「旧」的字眼（旧货、废品）：一字之差，用户从「淘宝藏」变成「捡破烂」——二手品类的措辞敏感度是所有电商里最高的",
        "环保说教式命名（拯救地球二手店）：价值观是加分项不是卖点，说教感会赶走只想省钱和淘货的主流用户",
        "只对一端说话：名字全是卖家视角（快卖、闪出）会让买家觉得这里是清仓场——双边平台的名字要两端念着都舒服",
        "忽略品类扩张：从二手书起家最终会卖万物（多抓鱼从书到百货）——名字锁死单一品类，扩张时就要付出改名的代价",
      ],
    },
    en: {
      label: "Resale & recommerce",
      title: "How to Name a Resale or Circular Economy Brand: Ideas, Cases & Domains",
      metaDescription:
        "Resale and circular-economy naming guide: re- roots, treasure-hunt framing, values-light words, breakdowns of Vinted/ThredUp/Depop, recommended TLDs and pitfalls — then hunt an available recommerce domain with AI.",
      intro:
        "A resale brand's name has to perform a mental flip: translating \"old, someone's castoffs\" into \"storied, smart, cooler than new.\" The category's biggest enemy isn't competitors — it's psychological friction: buyers fear the stigma of secondhand, sellers fear the hassle. A good name hands both sides a ladder: it makes buying used sound like scoring a find (treasure-hunt framing) and selling clutter sound like a smart lifestyle (decluttering, sustainability). Second, this is a two-sided marketplace: the name must work for buyers and sellers simultaneously — tilt toward either side and the other's participation drops. Third, there's a values dividend: circularity carries a built-in sustainability story, and a light \"re-\" hint in the name attracts values-driven younger users — but restraint matters, because the moment a name preaches, the fun of shopping dies.",
      namingIdeas: [
        "Mine the re- family: renew, reloop, revive — one prefix explains the entire business model; note that re- domains burn fast, so pair the prefix with an inventive root to find one you can register",
        "Frame the treasure hunt: treasure, finds, thrift, trove — recast secondhand shopping as the joy of discovery, directly neutralizing the castoff stigma; strongest for vintage and collector-leaning platforms",
        "Pick a light verb: swap, flip, spin — naming the transaction itself signals \"selling your stuff is easy,\" which attacks the supply side's hassle fear — the biggest bottleneck of every resale marketplace",
        "Plant values lightly: loop, green, planet — keep the eco hint inside a root or suffix (ThredUp's \"up\" echoes upcycle); slogan-length virtue names read as lecturing, not shopping",
        "Nickname the category: make the category word affectionate (Depop reads like a pop of discovery) — a nickname makes the platform feel like a friend rather than a flea market; the signature move of community-driven resale apps",
      ],
      cases: [
        { name: "Vinted", takeaway: "A coined past participle of \"vintage\": one root carries the aged-goodness association, and the -ed ending reads like a completed action — \"it got found\"; Europe's biggest secondhand fashion platform in six letters" },
        { name: "ThredUp", takeaway: "thread bent into thred + up: the misspelling buys ownability while \"up\" whispers upcycle and improvement — circular fashion's entire value proposition compressed into seven letters" },
        { name: "Depop", takeaway: "Short, bouncy, meaning nothing in particular — which let a resale app feel like a social network; the name's pop-culture energy recruited Gen Z sellers who'd never say they \"deal in used clothes\"" },
        { name: "Back Market", takeaway: "back + market: \"back\" carries the whole model (goods coming back, devices brought back to life) while \"market\" sets the expectation of choice and price — refurbished electronics explained in two plain words" },
      ],
      pitfalls: [
        "Words that emphasize \"old\" (junk, used-goods): one word shifts the user from treasure hunter to rag picker — wording sensitivity in resale is the highest of any commerce category",
        "Eco-preaching names (SaveThePlanetShop style): values are a bonus, not the pitch — moralizing drives away the mainstream who came to save money and score finds",
        "Speaking to only one side: an all-seller name (QuickSell, FlashOfferz) makes buyers read the place as a liquidation bin — a marketplace name must sit comfortably in both mouths",
        "Locking the category: resale platforms expand (books to everything, phones to appliances) — a name welded to one category charges a renaming tax exactly when growth arrives",
      ],
    },
  },
  recruiting: {
    slug: "recruiting",
    tlds: [
      { tld: "com", zh: "企业 HR 与候选人两端都要信任你，.com 是双边信任的最大公约数", en: "Both employers and candidates must trust you — .com is the common denominator of two-sided trust" },
      { tld: "io", zh: "招聘 SaaS 与 HR Tech 工具的圈内标配，技术买家零违和", en: "The insider standard for recruiting SaaS and HR-tech tools — zero friction with technical buyers" },
      { tld: "works", zh: "「工作」语义直给的后缀，人才平台用它一眼说清品类", en: "A suffix that literally says work — talent platforms use it to declare the category at a glance" },
    ],
    zh: {
      label: "招聘人力",
      title: "招聘与人力资源品牌怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "招聘平台/HR SaaS 命名指南：机遇词根、连接隐喻、效率承诺等 5 种思路，LinkedIn/Indeed/BOSS直聘 等案例拆解，推荐 TLD 与常见误区，并用 AI 猎取可注册的招聘域名。",
      intro:
        "招聘品牌的名字要同时说服天平的两端：候选人这端，找工作是人生高压时刻，名字要传递机遇与尊重，不能有一丝「把人当货」的中介味；企业这端，HR 采购看重的是专业与效率，名字要经得起出现在采购合同和 HR 系统集成清单里。这个双重人格是招聘命名的核心难题——太活泼显得不专业，太企业化又让求职者觉得冰冷。第二个特点是场景的口语化：「我在 X 上找到这份工作的」是招聘品牌最有力的传播句式，名字必须在这句话里念得自然。第三是品类演进的押注：从职位板到社交招聘到 AI 匹配，名字最好绑定「人与机会的连接」这个不变的本质，而不是某一代产品形态。",
      namingIdeas: [
        "机遇词根：机会、跃迁、hire、offer——把找工作重述为「向上的一步」，候选人端的情绪价值直接写进名字；适合面向求职者的平台品牌",
        "连接隐喻：link、bridge、桥、聘——招聘的本质是双边匹配，连接类词根同时对两端成立（LinkedIn 的 linked 就是招聘业务的全部隐喻）",
        "结果直给：indeed（确实找到了）、录取、直聘——跳过过程承诺结果，「上来就是谈 offer」的直给感是对招聘链路冗长这个行业痛点的回应",
        "对话人格化：BOSS直聘的「BOSS」把「和老板直接聊」的产品机制放进名字——机制即卖点时，名字就是最短的产品说明书",
        "HR SaaS 走工具系命名：面向企业的招聘管理工具按 SaaS 惯例起名（-ly、-hub、greenhouse 的培育隐喻）——买家是 HR 与工程团队，名字要像开发者工具一样干净",
      ],
      cases: [
        { name: "LinkedIn", takeaway: "linked（被连接的）+ in（进入圈子）：两个词说清「职业关系网」的全部价值；in 还暗合「找到门路」的俚语——B2B 与 C 端双边通吃的命名范本" },
        { name: "Indeed", takeaway: "副词「确实/的确」：在一排职位板名字里唯一不描述功能的——它承诺的是确定性（确实有工作）；常见词+品类第一的执行力=名字变成品类入口" },
        { name: "BOSS直聘", takeaway: "「BOSS」+「直聘」四个字压缩了完整产品机制（跳过 HR 和老板直接谈）：机制命名法的极致——广告语都省了，名字就是差异化本身" },
        { name: "Greenhouse", takeaway: "温室隐喻：把招聘从「填坑」重述为「培育人才生长的环境」——HR SaaS 里罕见的价值观命名，一个词让产品在采购清单里有了温度" },
      ],
      pitfalls: [
        "中介感词汇（人力派遣、劳务）：合规品类另当别论，但面向白领市场的品牌沾上派遣感，候选人质量立刻分层",
        "job/hr/talent 的直白堆砌：JobHubPro 式名字在 SEO 上撞满同行，在候选人心里毫无品牌记忆点——双输",
        "只考虑求职者忘了企业端：名字太网感（「躺平找活」类），HR 无法在采购会上说出口——B 端付费的生意，名字要过采购关",
        "锁定单一岗位品类：从程序员招聘扩展到全行业是常见路径——名字里焊死「码农」「蓝领」，扩张即改名",
      ],
    },
    en: {
      label: "Recruiting & HR",
      title: "How to Name a Recruiting or HR Brand: Strategies, Cases & Domains",
      metaDescription:
        "Recruiting platform and HR SaaS naming guide: opportunity roots, connection metaphors, outcome-first words, breakdowns of LinkedIn/Indeed/Greenhouse, recommended TLDs and pitfalls — then hunt an available recruiting domain with AI.",
      intro:
        "A recruiting brand must persuade both pans of the scale at once. For candidates, job hunting is a high-stress life moment — the name must radiate opportunity and respect, with zero whiff of \"people as inventory\" staffing-agency energy. For employers, HR buyers judge professionalism and efficiency — the name must survive procurement contracts and an HRIS integration list. This split personality is the category's core naming problem: too playful reads unprofessional, too corporate reads cold to job seekers. Second, the category's strongest marketing sentence is spoken: \"I found this job on X\" — the name must sit naturally inside it. Third, bet on the invariant: job boards became social recruiting became AI matching, so anchor the name to \"connecting people with opportunity\" — the essence that survives every product-form shift — rather than to this generation's mechanics.",
      namingIdeas: [
        "Mine opportunity roots: hire, offer, leap, rise — recast job hunting as a step upward, writing the candidate-side emotional payoff into the name; strongest for seeker-facing platforms",
        "Use connection metaphors: link, bridge, match — recruiting is two-sided matching at heart, and connection roots work for both sides at once (LinkedIn's \"linked\" is the entire business in one participle)",
        "Promise the outcome: indeed, hired, direct — skip the process and name the result; \"straight to the offer\" energy answers the industry's defining pain of drawn-out pipelines",
        "Name the mechanism: when the product mechanic is the differentiator (chat directly with the hiring manager), put it in the name — the name becomes the shortest possible product explainer",
        "Name HR SaaS like dev tools: employer-side tooling follows SaaS conventions (-ly, -hub, Greenhouse's cultivation metaphor) — the buyers are HR and engineering teams, so keep the name as clean as a developer tool's",
      ],
      cases: [
        { name: "LinkedIn", takeaway: "linked + in: two words covering the whole value of a professional graph, with \"in\" echoing the idiom of having an in somewhere — a naming template that works B2B and consumer simultaneously" },
        { name: "Indeed", takeaway: "An adverb of certainty — the only major job board whose name describes no feature; it promises sureness (there are indeed jobs). Common word + category-winning execution = the name becomes the category's front door" },
        { name: "Greenhouse", takeaway: "The cultivation metaphor: reframing hiring from \"filling seats\" to \"an environment where talent grows\" — rare values-led naming in HR SaaS that gives a procurement line item actual warmth" },
        { name: "Lever", takeaway: "A simple machine as a hiring metaphor — leverage, moving something heavy with less force; one crisp syllable that flatters both the recruiter's craft and the engineer-buyer's taste" },
      ],
      pitfalls: [
        "Staffing-agency vocabulary (labor dispatch, manpower): fine for compliance-heavy niches, but a whiff of temp-agency in a white-collar brand instantly tiers down candidate quality",
        "Literal job/hr/talent pileups: JobHubPro-style names collide with thousands of peers in search and leave zero memory trace with candidates — losing on both fronts",
        "Optimizing only for seekers: a name too meme-flavored for an HR director to say in a procurement meeting will cap your B2B revenue — the employer side signs the checks",
        "Welding the name to one vertical: expanding from developer hiring to all industries is the standard path — a name with \"coder\" or \"blue-collar\" baked in schedules its own rebrand",
      ],
    },
  },
  eldercare: {
    slug: "eldercare",
    tlds: [
      { tld: "com", zh: "决策者是子女，付款前会反复核实——.com 的正规感是第一道信任关", en: "Adult children are the decision makers and they verify before paying — .com's legitimacy is the first trust gate" },
      { tld: "life", zh: "把养老定位成「生活的延续」而非照护机构，.life 温和有尊严", en: "Frames senior care as life continuing, not institutional care — gentle and dignified" },
      { tld: "org", zh: "非营利养老机构与行业协会的标准后缀，公益感自带公信力", en: "The standard for nonprofit senior-care organizations — the civic feel carries credibility" },
    ],
    zh: {
      label: "养老服务",
      title: "养老服务品牌怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "养老服务与银发经济命名指南：尊严词根、家园意象、双代际沟通等 5 种思路，Honor/Papa/泰康之家 等案例拆解，推荐 TLD 与常见误区，并用 AI 猎取可注册的养老品牌域名。",
      intro:
        "养老品牌的名字要同时打动两代人：付钱的子女和接受服务的父母。子女在愧疚与焦虑中搜索「靠谱的养老服务」，名字要让他们放心（专业、正规、孝心的代理人）；父母则抗拒「被养老」——任何暗示衰老、失能、被照顾的字眼都会触发抵触。这决定了养老命名的第一原则：写尊严，不写衰老。好名字把服务重述为「继续好好生活」而不是「被人照顾」。第二个特点是信任密度要求极高：这是把父母交给陌生人的决定，名字必须经得起子女的反复审视与亲友转述。第三是文化敏感：中文语境里「孝」与「家」的分量、忌讳词的雷区（谐音不吉利的字），都比其他行业敏感一个数量级。",
      namingIdeas: [
        "尊严词根：honor、尊、颐、康——把「被照顾」重述为「被尊重」；Honor 直接用「敬意」命名居家养老，一个词完成整个品类的叙事翻转",
        "家园意象：home、之家、院、里——机构养老最大的心理障碍是「离开家」，名字里的家园感是对这个恐惧的直接安抚；适合社区与机构型品牌",
        "活力叙事：金色、夕阳红之外找新词——silver、prime、颐年——把老年重述为「黄金阶段」；面向活力老人的旅居、教育、社交产品尤其适用",
        "代际连接词：陪、伴、Papa 的亲昵称谓——服务本质是「替子女陪伴」，亲属称谓类名字让品牌像家庭成员而不是服务商",
        "双语双检：中文名过「子女转述测试」（在家庭群里发出来自然吗），同时查谐音忌讳（音近「死、病、终」的字一票否决）——养老品类的文化雷区密度全行业最高",
      ],
      cases: [
        { name: "Honor", takeaway: "一个词「敬意」：把居家照护从「雇人看护」升维成「向长辈致敬」——服务没变，叙事全变；美国最大居家养老网络的名字里没有 care 也没有 senior" },
        { name: "Papa", takeaway: "亲昵称谓当品牌名：「陪伴孙辈式的年轻人」服务被一个称呼说清——像家人一样的陪伴；亲属称谓命名在信任密集品类里的降维打击" },
        { name: "泰康之家", takeaway: "「泰康」（安泰健康）+「之家」：保险母品牌的信任资产 + 家园意象的心理安抚——中文养老命名「大品牌背书+家」结构的标准答案" },
        { name: "A Place for Mom", takeaway: "一句话命名：「给妈妈找个地方」直接说出子女搜索时心里的那句话——搜索意图即品牌名，转介绍时一字不用改" },
      ],
      pitfalls: [
        "衰老暗示词（夕阳、暮年、护老）：父母端直接抵触——「我还没到要被『护』的地步」；写尊严与生活，别写衰老与照护",
        "谐音忌讳失检：中文养老品牌的死穴——候选名必须逐字过谐音关，音近不吉利字眼的名字在家庭决策链里一票否决",
        "过度机构化（XX 老年公寓管理中心）：名字像文件标题，子女在朋友圈都不好意思转发——信任要专业感，不要衙门感",
        "只对子女说话忽略老人意愿：入住决策日益由老人本人参与——名字让老人自己念着舒服（「我住在 X」说出口有面子），成交率完全不同",
      ],
    },
    en: {
      label: "Senior care",
      title: "How to Name a Senior Care or Aging-Economy Brand: Ideas, Cases & Domains",
      metaDescription:
        "Senior care and aging-economy naming guide: dignity roots, home imagery, two-generation messaging, breakdowns of Honor/Papa/A Place for Mom, recommended TLDs and pitfalls — then hunt an available senior-care domain with AI.",
      intro:
        "A senior-care name must move two generations at once: the adult children who pay and the parents who receive. The children search \"trustworthy senior care\" through guilt and anxiety — the name must reassure them (professional, legitimate, a worthy proxy for their devotion). The parents resist \"being aged\" — any word implying decline, frailty or being managed triggers refusal. That sets the category's first rule: write dignity, never decline. A good name recasts the service as \"continuing to live well,\" not \"being looked after.\" Second, the trust bar is the highest in consumer services: this is the decision to hand a parent to strangers, and the name must survive the children's repeated scrutiny and family-group retelling. Third, cultural sensitivity runs an order of magnitude hotter here — taboo homophones and the weight of words like home and honor matter more than in any other category.",
      namingIdeas: [
        "Lead with dignity roots: honor, grace, esteem — recast \"being cared for\" as \"being respected\"; Honor named an entire home-care network with one word and flipped the category's story",
        "Use home imagery: home, house, place, village — the deepest fear of institutional care is leaving home, and hearth-words in the name answer that fear directly; strongest for communities and residences",
        "Tell a vitality story: silver, prime, golden — reframe later life as a peak stage rather than a decline; best for travel, learning and social products aimed at active seniors",
        "Borrow kinship words: names like Papa make the brand feel like family rather than a vendor — the service is companionship by proxy, and a kinship name says so in one word",
        "Run the two-generation test: the name must sound natural retold in a family group chat by the children AND feel dignified spoken by the parent (\"I live at X\") — plus a strict homophone-taboo check; this category's cultural minefield is the densest anywhere",
      ],
      cases: [
        { name: "Honor", takeaway: "One word — respect: elevating home care from \"hiring a caregiver\" to \"honoring your elders.\" The service didn't change; the story did. America's largest home-care network has neither \"care\" nor \"senior\" in its name" },
        { name: "Papa", takeaway: "A kinship nickname as the brand: \"grandkids on demand\" companionship explained by a single term of endearment — kinship naming as a category-killer in trust-dense services" },
        { name: "A Place for Mom", takeaway: "A whole sentence as a name: it repeats verbatim what the adult child is thinking while searching — when search intent equals the brand name, referrals need zero translation" },
        { name: "Brookdale", takeaway: "brook + dale: two pastoral landscape words composing a serene address — the community sounds like a place you'd retire to by choice, not a facility you're placed in; the standard template for residence naming" },
      ],
      pitfalls: [
        "Decline vocabulary (sunset, twilight, nursing): the parent generation rejects it outright — \"I'm not there yet\"; write living and dignity, not aging and care",
        "Skipping the homophone-taboo check: in many cultures a candidate name that sounds like death or illness words is a one-vote veto in the family decision chain — screen every syllable",
        "Over-institutionalizing (Senior Housing Management Center): a name that reads like a file header embarrasses the children who must share it — trust needs professionalism, not bureaucracy",
        "Speaking only to the children: residents increasingly co-decide — a name the parent enjoys saying (\"I live at X\" with pride) converts at a completely different rate",
      ],
    },
  },
  logistics: {
    slug: "logistics",
    tlds: [
      { tld: "com", zh: "货主与货代的采购决策保守，.com 是物流 B2B 的默认信任线", en: "Shippers and forwarders buy conservatively — .com is the default trust line in logistics B2B" },
      { tld: "network", zh: "干线、仓配、专线的本质是网络，.network 把资产属性写进域名", en: "Linehaul, warehousing and lanes are a network at heart — .network writes the asset into the domain" },
      { tld: "io", zh: "物流 SaaS 与货运数字化平台的技术感后缀，融资叙事更顺", en: "The tech-flavored suffix for logistics SaaS and digital freight — smoother for the venture story" },
    ],
    zh: {
      label: "物流货运",
      title: "物流货运品牌怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "物流/货运/跨境供应链命名指南：速度词根、可靠承诺、网络隐喻等 5 种思路，FedEx/Flexport/顺丰 等案例拆解，推荐 TLD 与常见误区，并用 AI 猎取可注册的物流域名。",
      intro:
        "物流品牌的名字要回答客户唯一关心的问题：「我的货交给你，放心吗？」这个行业卖的不是运输而是确定性——货能不能按时、完好、可追踪地到达。所以物流命名的两大主词根永远是速度与可靠：快是表层卖点，稳是深层承诺，好名字往往两者兼备（顺丰=顺利+丰盛，FedEx=联邦级的快递）。第二个特点是 B2B 决策链的保守性：货代、电商卖家、供应链经理选服务商时极度风险厌恶，名字要经得起出现在报关单、提单和保险合同上。第三是场景的高频出镜：物流名字印在面单、货车车身和跟踪页面上，是曝光量最大的品牌资产之一——名字要短、清晰、在车身上隔 50 米能认出来。",
      namingIdeas: [
        "速度词根：ex（express 家族）、flash、迅、达——快递类品牌的默认武器库；ex 尾缀（FedEx、SF Express）已成品类识别符，用它等于自带「快递」标签",
        "可靠承诺词：顺、安、诚、sure——货主的核心焦虑是丢货与延误，稳定感词根是对焦虑的直接回应；中文物流命名「顺/达/通」的高频不是巧合而是需求",
        "网络隐喻：port、link、bridge、通——物流的竞争力本质是网络密度，港口/桥梁/通道类意象把基础设施感写进名字；适合货代、专线与供应链平台",
        "数字化前后缀：flex、smart、cargo+tech 组合——货运数字化品牌用「传统品类词+科技词」的嫁接结构（Flexport=灵活+港口），一个名字同时说清「做什么」和「哪里不同」",
        "车身测试：把候选名想象成印在货车侧面与快递面单上——50 米外能否认出、司机口中能否顺口说出（「叫个 X 的车」）；物流名字的第一媒介是车身不是官网",
      ],
      cases: [
        { name: "FedEx", takeaway: "Federal Express 的缩写再造：Fed 的「联邦级可靠」+ Ex 的「快」，缩写后反而更强——箭头 logo 藏在字母间隙里，名字与视觉一体化的教科书" },
        { name: "顺丰", takeaway: "「顺」（顺利，可靠承诺）+「丰」（丰盛，生意兴隆的祝福）：两个字同时安抚货主并讨彩头——中文物流命名「稳+吉」双词根结构的标杆" },
        { name: "Flexport", takeaway: "flex（灵活）+ port（港口）：传统基建词嫁接科技气质词，「数字化货代」的定位一词说清——货运科技命名的模板级答案" },
        { name: "Maersk", takeaway: "创始家族姓氏：150 年家族信誉直接作为品牌资产，七个字母印在全球最大的集装箱船队上——B2B 重资产行业里，姓氏=承诺人格化的终极形式" },
      ],
      pitfalls: [
        "通/达/捷的随机排列：中文物流重名重灾区——「XX 通达」类名字在工商与商标库里几乎穷尽，独占性为零",
        "只有速度没有可靠：极限速度词（闪电、秒达）在延误发生时反噬品牌——承诺快之前先确保名字里有稳的成分",
        "国际化拼写障碍：跨境物流的名字要被海外仓、海关与外国客户拼写——拼音声调丢失后歧义大的名字（如 Xieda）会在国际单据上制造事故",
        "锁定单一运输方式：从快递到仓配到供应链是标准扩张路径——名字里焊死「卡车」「空运」，业务扩张时名不副实",
      ],
    },
    en: {
      label: "Logistics & freight",
      title: "How to Name a Logistics or Freight Brand: Strategies, Cases & Domains",
      metaDescription:
        "Logistics, freight and supply-chain naming guide: speed roots, reliability promises, network metaphors, breakdowns of FedEx/Flexport/Maersk, recommended TLDs and pitfalls — then hunt an available logistics domain with AI.",
      intro:
        "A logistics name must answer the only question customers actually have: \"if I hand you my cargo, can I stop worrying?\" This industry doesn't sell transportation — it sells certainty: on time, intact, trackable. So the two master roots of logistics naming are speed and reliability: fast is the surface pitch, steady is the deeper promise, and the best names carry both (FedEx — federal-grade express). Second, the B2B decision chain is deeply conservative: forwarders, e-commerce sellers and supply-chain managers are risk-averse buyers, and the name must hold up on customs declarations, bills of lading and insurance contracts. Third, the name is the industry's highest-exposure asset: printed on shipping labels, truck sides and tracking pages — it must be short, legible, and recognizable on a trailer from fifty meters.",
      namingIdeas: [
        "Mine speed roots: the ex- family (express), flash, dash, swift — the default arsenal of parcel brands; the -ex suffix (FedEx, SF Express) has become a category identifier that labels you \"express\" for free",
        "Promise reliability: sure, true, anchor, steady — the shipper's core anxiety is loss and delay, and stability roots answer it head-on; speed gets attention, steadiness signs the annual contract",
        "Use network metaphors: port, link, bridge, lane — logistics competes on network density, and infrastructure imagery writes that asset into the name; strongest for forwarders, lanes and supply-chain platforms",
        "Graft tech onto freight: flex, smart, cargo + a tech-flavored word — digital-freight brands use the traditional-category-word + tech-word structure (Flexport = flexible + port) to say what you do and why you're different in one name",
        "Run the truck test: picture each finalist painted on a trailer side and printed on a waybill — recognizable at fifty meters, sayable by a driver (\"book an X truck\"); a logistics name's first medium is the truck, not the website",
      ],
      cases: [
        { name: "FedEx", takeaway: "Federal Express recompressed: Fed's federal-grade reliability plus Ex's speed, stronger as an abbreviation — with the arrow hidden between the letters, the textbook of name-and-mark integration" },
        { name: "Flexport", takeaway: "flex + port: a tech-temperament word grafted onto an infrastructure word — \"digital freight forwarder\" explained in one coinage; the template answer for freight-tech naming" },
        { name: "Maersk", takeaway: "The founding family's surname: 150 years of family reputation deployed as brand equity, seven letters painted on the world's largest container fleet — in asset-heavy B2B, a surname is a promise made personal" },
        { name: "DHL", takeaway: "Three founders' initials (Dalsey, Hillblom, Lynn): meaningless letters made valuable purely by decades of delivery — proof that in logistics, the name is a vessel the service fills; initials work only if you can wait that long" },
      ],
      pitfalls: [
        "Random express/trans/link permutations: the most collision-saturated corner of B2B naming — TransLinkExpress-style names have zero ownability in registries or search",
        "All speed, no steadiness: extreme velocity words (Lightning, InstantShip) turn against you at the first delay — before promising fast, make sure the name carries something solid",
        "Ignoring cross-border spellability: your name will be spelled by overseas warehouses, customs officers and foreign clients — a romanization that collapses without tones creates real incidents on international documents",
        "Welding the name to one mode: parcel to warehousing to supply chain is the standard expansion path — a name with \"truck\" or \"air\" baked in expires exactly when the business grows",
      ],
    },
  },
  agent: {
    slug: "agent",
    tlds: [
      { tld: "ai", zh: "智能体产品的身份后缀，域名本身就是定位声明", en: "The identity suffix for agent products — the domain itself states the positioning" },
      { tld: "com", zh: "当智能体要卖给企业客户时，.com 让采购与安全审查少一道疑问", en: "When agents sell to enterprises, .com removes one question from procurement and security review" },
      { tld: "dev", zh: "面向开发者的 agent 框架与工具链，.dev 圈内认同度最高", en: "For developer-facing agent frameworks and tooling, .dev earns instant peer credibility" },
    ],
    zh: {
      label: "AI 智能体",
      title: "AI 智能体产品怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "AI 智能体/Agent 应用命名指南：拟人化命名、能力动词、协作隐喻等 5 种思路，Devin/Manus/Cursor 等案例拆解，推荐 TLD 与常见误区，并用 AI 猎取可注册的智能体域名。",
      intro:
        "智能体命名和上一代 AI 工具命名有个本质区别：工具是「被使用的东西」，智能体是「被委托的同事」。用户对工具说「我用 X 处理了」，对智能体说「我让 X 去做了」——名字要撑得起这个「让」字。所以拟人化是智能体命名的第一主线：一个像人名的名字（Devin、Claude）天然携带「它会自己干活」的暗示，而 TaskAutoBot 式的机器名反而在削弱产品最核心的卖点。第二条线是信任：你要把邮箱、代码库、日程的权限交给它，名字不能轻佻——「委托感」来自稳重的音节而非炫技的缩写。第三，这个赛道正在以周为单位涌入新玩家，agent/copilot/pilot 词根的碰撞率已经饱和，起名时先搜一遍同类产品列表再动手，比任何技巧都省钱。",
      namingIdeas: [
        "拟人名路线：直接用或造一个像人名的词（Devin、Claude、Jarvis 式）——「雇一个 X」的句式立刻成立；测试方法是造句「让 X 帮我处理一下」，自然就对了",
        "能力动词化：选一个描述委托动作的短动词或其变形（dispatch、delegate、run）——智能体的核心交互是「派活」，名字里带动作感能强化「它会执行」的预期",
        "协作隐喻：借用同事/副手/管家类意象——copilot、mate、butler、幕僚；注意 copilot 已被微软大规模占用，直接用等于给别人做品牌联想",
        "词根+agent 变体要克制：-agent、-gpt、-ai 后缀堆砌已是重灾区，2025 年后注册的同类名字在搜索结果里几乎无法出头；若用 .ai 后缀，主体词就不要再含 ai",
        "留出能力扩张空间：今天的客服 agent 明天可能接管整个工作流——名字锁死单一任务（EmailReplyBot）等于给自己的路线图上枷锁",
      ],
      cases: [
        { name: "Devin", takeaway: "一个普通的英文人名做「AI 软件工程师」：拟人名让「雇佣一个 AI 同事」的叙事零成本成立——智能体命名拟人化路线的标杆案例" },
        { name: "Manus", takeaway: "拉丁语「手」：不像人名却有「替你动手」的隐喻，学术气质的词根在一片 -GPT 命名里辨识度极高——冷僻语源是差异化的捷径" },
        { name: "Cursor", takeaway: "光标是「你正在工作的位置」：把 AI 编辑器命名为工作现场本身，产品与名字在同一个画面里——比任何 AI 前缀都更有代入感" },
        { name: "Claude", takeaway: "复古人名自带温和可信的性格设定：Anthropic 用一个名字完成了「安全、克制、像人」的品牌定调——名字即人设的教科书" },
      ],
      pitfalls: [
        "堆砌 AI/GPT/bot 词根：同质化最严重的命名区，且 GPT 是 OpenAI 的商标，含 GPT 的名字有直接法律风险",
        "机器味太重（AutoTaskBot 类）：智能体卖的是「像人一样可托付」，机器名在自我拆台",
        "轻佻或玩笑名接管严肃权限：要访问用户邮箱与代码库的产品，名字必须经得起企业安全审查会议",
        "不查竞品就定名：agent 赛道每周都有新品牌，pilot/copilot/agent 变体几乎穷尽——定名前先搜 Product Hunt 与 GitHub",
      ],
    },
    en: {
      label: "AI agents",
      title: "How to Name an AI Agent Product: Strategies, Cases & Domains",
      metaDescription:
        "AI agent naming guide: human-like names, delegation verbs, coworker metaphors, breakdowns of Devin/Manus/Cursor/Claude, recommended TLDs and pitfalls — then hunt an available agent domain with AI.",
      intro:
        "Naming an agent is fundamentally different from naming last-generation AI tools: a tool is something you use, an agent is someone you delegate to. Users say \"I processed it with X\" about tools, but \"I had X do it\" about agents — and the name has to carry that \"had\". So personification is the master line of agent naming: a human-sounding name (Devin, Claude) implies \"it works on its own\" for free, while a machine-sounding TaskAutoBot actively undermines the product's core promise. The second line is trust: you're asking users to hand over email, codebase and calendar permissions — the name can't be flippant; delegation-worthiness comes from steady syllables, not clever abbreviations. Third, this market adds new entrants weekly and the agent/copilot/pilot root space is saturated: searching existing product lists before naming saves more money than any technique.",
      namingIdeas: [
        "Go human-name: use or coin a name that sounds like a person (Devin, Claude, Jarvis-style) — \"hire an X\" instantly works; test with \"let X handle it\" out loud, natural means right",
        "Verb the delegation: pick a short verb of assignment (dispatch, delegate, run) or a coined variant — the core interaction is handing off work, and an action-charged name reinforces \"it will execute\"",
        "Borrow coworker metaphors: mate, butler, chief-of-staff imagery — but note copilot is now massively owned by Microsoft; using it donates your brand associations to someone else",
        "Ration the -agent/-gpt/-ai suffixes: the most collision-saturated corner of naming since 2023, and near-invisible in search results; if you take a .ai domain, keep \"ai\" out of the name itself",
        "Leave room to grow: today's support agent may run the whole workflow tomorrow — a task-locked name (EmailReplyBot) handcuffs your own roadmap",
      ],
      cases: [
        { name: "Devin", takeaway: "An ordinary human first name for an \"AI software engineer\": the personification makes the hire-an-AI-coworker narrative land at zero cost — the benchmark case of the human-name route" },
        { name: "Manus", takeaway: "Latin for \"hand\": not a person's name, yet carries the does-it-for-you metaphor; a scholarly root that stands out sharply in a sea of -GPT names — obscure etymology is a shortcut to distinctiveness" },
        { name: "Cursor", takeaway: "The cursor is where you're working right now: naming the AI editor after the workplace itself puts product and name in the same picture — more immersive than any AI prefix" },
        { name: "Claude", takeaway: "A vintage human name with a built-in gentle, trustworthy persona: Anthropic set the whole \"safe, restrained, human\" brand tone with one name — the textbook of name-as-character" },
      ],
      pitfalls: [
        "Stacking AI/GPT/bot roots: the most homogenized naming zone — and GPT is OpenAI's trademark, so names containing it carry direct legal risk",
        "Sounding too mechanical (AutoTaskBot et al.): agents sell human-like delegability, and a machine name argues against your own pitch",
        "A jokey name holding serious permissions: a product that reads your email and codebase must survive an enterprise security-review meeting",
        "Naming without a competitor sweep: new agent brands ship weekly and pilot/copilot/agent variants are nearly exhausted — search Product Hunt and GitHub before committing",
      ],
    },
  },
  crossborder: {
    slug: "crossborder",
    tlds: [
      { tld: "com", zh: "跨境卖全球，.com 是唯一在所有市场都不用解释的后缀", en: "Selling everywhere means .com — the only suffix that needs no explanation in any market" },
      { tld: "shop", zh: "独立站语义直给，主名被占时的体面替补", en: "Says storefront outright — a dignified fallback when the .com is taken" },
      { tld: "co", zh: "品牌感强的 DTC 出海品牌常用，短一个字母更利落", en: "A favorite of brand-first DTC labels going global — one letter sleeker" },
    ],
    zh: {
      label: "跨境电商",
      title: "跨境电商品牌怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "跨境电商/出海品牌命名指南：无国界造词、多语言避雷、发音全球化等 5 种思路，Anker/Shein/Temu 等案例拆解，推荐 TLD 与常见误区，并用 AI 猎取可注册的出海域名。",
      intro:
        "跨境品牌的名字要在你从未去过的国家、被你从未听过的口音念出来——这是它和国内品牌命名最大的不同。第一原则是发音全球化：名字必须在英语、西语、德语、阿拉伯语使用者嘴里都念得出且大致一致，元音结尾的双音节词（Anker、Temu）是全球通行的安全结构。第二是文化排雷：一个词在目标市场语言里的俚语含义、宗教联想、历史包袱都可能引爆——出海命名的尽调清单比国内长一倍。第三是去来源地化的选择题：是隐藏原产地做「全球品牌」（Anker 路线），还是把原产地做成卖点？多数品类里前者转化更好，这意味着名字里不要出现明显的拼音痕迹。最后，跨境获客重度依赖品牌搜索与社交广告，名字的搜索独占性直接等于广告费的回收率。",
      namingIdeas: [
        "无国界造词：造一个不属于任何语言的短词（Temu、Shein 式）——没有母语就没有文化包袱，全球商标注册的通过率也更高；结构上首选辅音+元音交替的双音节",
        "元音结尾安全结构：以 a/o/u 结尾的词在罗曼语系、日语、西语里都自然（Anker 是例外中的经典，k+er 在主要市场都清晰）——列出候选后请 5 个不同母语的人念一遍",
        "多语言排雷清单：西语、法语、德语、阿拉伯语、日语五种语言的俚语含义必查——经典反例 Nova 在西语区谐音「不走」；用母语者社区（Reddit 语言版块）比翻译软件可靠",
        "商标先行于域名：跨境品牌被商标流氓抢注的损失远大于域名——名字候选出来先查 USPTO/EUIPO/WIPO，亚马逊品牌备案要求注册商标，这一步没法跳",
        "平台搜索测试：把候选名放进亚马逊/TikTok 搜索框——若结果被既有品牌或通用词淹没，你的广告费将持续为别人打工",
      ],
      cases: [
        { name: "Anker", takeaway: "德语「锚」：在充电品类里暗示「稳定可靠」，而德语词源自带工程精密的联想——中国品牌借欧洲语源完成全球化人设的标杆" },
        { name: "Shein", takeaway: "she + in 的无国界合成词：4 个音素全球可读，没有任何文化包袱——快时尚出海「名字即物流」的证明：越轻越快" },
        { name: "Temu", takeaway: "刻意造的无意义双音节：t-e-m-u 在任何语言里都能读且无歧义，全球商标一路绿灯——低成本大规模投放时代，「零解释成本」就是最大的名字资产" },
        { name: "Aliexpress", takeaway: "母品牌 Ali + 品类词 express：借集团信任背书又说清「快速直邮」——平台型出海的复合命名结构，代价是名字永远长了一截" },
      ],
      pitfalls: [
        "拼音直出做全球名：声调丢失后的拼音（如 Xingfu）在海外既难读又难记，还暴露来源地——除非原产地就是卖点，否则重造一个词",
        "只查英语含义：西语、法语、阿拉伯语市场的俚语雷区各不相同——五大语言排雷是出海命名的最低尽调标准",
        "先做品牌后注商标：亚马逊品牌备案、TikTok Shop 入驻都要求注册商标——商标被抢注后赎回的价格以十万计",
        "名字含地域或品类限定词：AsiaBags 式名字在扩品类、扩市场时立刻过期——出海品牌的名字要为「下一个市场」留白",
      ],
    },
    en: {
      label: "Cross-border e-commerce",
      title: "How to Name a Cross-border E-commerce Brand: Strategies, Cases & Domains",
      metaDescription:
        "Cross-border and global DTC naming guide: borderless coinages, multilingual clearance, global pronunciation, breakdowns of Anker/Shein/Temu, recommended TLDs and pitfalls — then hunt an available global domain with AI.",
      intro:
        "A cross-border brand name will be pronounced in countries you've never visited, by accents you've never heard — that's what separates it from domestic naming. Principle one is global pronunciation: the name must come out roughly the same in English, Spanish, German and Arabic mouths; vowel-ending two-syllable words (Temu) are the universally safe structure. Principle two is cultural clearance: a word's slang meaning, religious connotation or historical baggage in any target market can detonate — the due-diligence checklist for global names is twice as long as a domestic one. Third comes the origin question: hide the country of origin and play global brand (the Anker route), or make origin the selling point? In most categories the former converts better, which means no visible romanization traces in the name. Finally, cross-border acquisition runs on branded search and social ads: the name's search ownability is literally your ad-spend recovery rate.",
      namingIdeas: [
        "Coin a borderless word: invent a short word belonging to no language (Temu, Shein style) — no mother tongue means no cultural baggage, and global trademark filings clear more easily; consonant-vowel alternating two-syllable structures travel best",
        "End in a vowel: words ending in a/o/u sit naturally in Romance languages, Japanese and Spanish — shortlist your candidates, then have five native speakers of different languages read them aloud",
        "Run the five-language sweep: check slang meanings in Spanish, French, German, Arabic and Japanese — the classic Nova-doesn't-go trap in Spanish; native-speaker communities beat translation software for this",
        "File trademarks before buying domains: brand-registry programs (Amazon) require a registered mark, and buying your name back from a trademark squatter costs six figures — clear USPTO/EUIPO/WIPO first",
        "Test in the platform search box: type each candidate into Amazon and TikTok search — if existing brands or generic results drown you out, your ad budget will keep working for someone else",
      ],
      cases: [
        { name: "Anker", takeaway: "German for \"anchor\": implies stability in the charging category, and the Germanic root carries engineering-precision associations — the benchmark of a Chinese brand borrowing European etymology for a global persona" },
        { name: "Shein", takeaway: "she + in, a borderless blend: four phonemes readable worldwide with zero cultural baggage — proof that in fast-fashion exports, the name is logistics: the lighter, the faster" },
        { name: "Temu", takeaway: "A deliberately meaningless two-syllable coinage: t-e-m-u reads unambiguously in any language and cleared trademarks globally — in the era of mass ad spend, zero explanation cost is the biggest naming asset" },
        { name: "AliExpress", takeaway: "Parent brand Ali + category word express: borrows group-level trust while stating fast direct shipping — the compound structure of platform-scale exports, at the permanent cost of extra length" },
      ],
      pitfalls: [
        "Raw romanization as a global name: pinyin stripped of tones (Xingfu) is hard to read, hard to recall, and broadcasts origin — unless origin is the pitch, coin something new",
        "Clearing English only: Spanish, French and Arabic markets each have different slang minefields — the five-language sweep is the minimum due diligence for going global",
        "Building the brand before filing the mark: Amazon Brand Registry and TikTok Shop onboarding require a registered trademark — squatters move faster than you and charge accordingly",
        "Locking region or category into the name: AsiaBags-style names expire the moment you expand categories or markets — a global name must leave room for the next market",
      ],
    },
  },
  escaperoom: {
    slug: "escaperoom",
    tlds: [
      { tld: "fun", zh: "娱乐属性直给，本地娱乐业态里辨识度高又便宜", en: "Says entertainment outright — distinctive and affordable for local venues" },
      { tld: "com", zh: "美团/大众点评之外的官网入口，连锁化后必备", en: "Your owned front door beyond listing platforms — essential once you franchise" },
      { tld: "club", zh: "会员制剧本杀社群与玩家俱乐部的气质后缀", en: "The natural suffix for member-based murder-mystery communities and player clubs" },
    ],
    zh: {
      label: "剧本杀密室",
      title: "剧本杀/密室逃脱怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "剧本杀/密室逃脱/沉浸式娱乐命名指南：悬念词根、世界观命名、组局口播测试等 5 种思路，NAZA/惊人院 等案例拆解，推荐 TLD 与常见误区，并用 AI 猎取可注册的娱乐域名。",
      intro:
        "剧本杀和密室的名字有个独特的传播场景：组局。「周六去 X 玩不玩？」——名字要在微信群的一句邀约里就传递出「好玩、刺激、值得专门跑一趟」的预期。这决定了第一原则：名字本身要有戏。悬念感（谜、雾、局）、世界观感（馆、境、屋）、肾上腺素感（逃、惊、暗）都是合法武器，平铺直叙的「XX 密室体验馆」等于放弃了免费的想象力广告位。第二个特点是场景消费的地域性：客人搜的是「城市+剧本杀」，名字的独特性决定你在点评平台搜索结果和玩家口碑里能否被准确找到。第三，这个行业连锁化是主流出路——名字要预留多店、多主题、多城市的扩展空间，锁死单一主题（如「民国公馆」）会在换主题时连招牌一起换。",
      namingIdeas: [
        "悬念词根：谜、雾、影、局、匣——名字先埋一个钩子，让人问「什么意思？」就赢了第一步；英文同理：cipher、veil、riddle",
        "世界观容器词：馆、院、境、屋、Studio——把店名做成一个「可以进入的世界」的入口，多主题店尤其适用：容器不变，里面的世界随主题更换",
        "肾上腺素词根：逃、惊、暗、夜——恐怖/刺激主题的直接信号，客群自筛选：胆小的不来，来的都是对的人；全年龄店慎用",
        "组局口播测试：把候选名放进真实邀约句式「周六去 X 啊？」念三遍——绕口、歧义、念不出氛围的直接淘汰；剧本杀名字的第一媒介是微信群不是招牌",
        "预留连锁与换主题空间：名字定位在「体验容器」而非「单一剧本」——主题会换、城市会扩，名字要跟得上（「惊人院」可以装任何惊悚主题，「1943 谍影」只能演谍战）",
      ],
      cases: [
        { name: "NAZA密室", takeaway: "无意义音节造词：四个字母在点评搜索里零撞车，读音干脆有电子感——本地娱乐品牌用无意义短词换取搜索独占的教科书" },
        { name: "惊人院", takeaway: "「惊」（惊吓）+「人院」（谐「精神病院」）：一语双关，名字本身就是恐怖主题的预告片——中文谐音梗在娱乐命名里的天花板级用法" },
        { name: "谜之屋", takeaway: "谜（悬念钩子）+屋（世界容器）：三个字完成「有谜可解、有屋可进」的完整预期——悬念词根+容器词的标准结构，任何主题都装得下" },
        { name: "Sleep No More", takeaway: "借《麦克白》台词做沉浸式戏剧品牌：文学出处自带世界观纵深，「不眠之夜」的字面义又直接许诺体验强度——引用式命名的全球标杆" },
      ],
      pitfalls: [
        "直接叫「XX 密室体验馆」：品类词当名字，在点评平台搜索里和几百家同行混在一起，口碑传播时无法被准确转述",
        "锁死单一主题：剧本杀主题半年一换——名字焊死具体剧本或年代，换主题时等于重开一家店",
        "恐怖过头吓跑全客群：名字太重口（血、尸、咒）会把团建、亲子、约会客群全部筛掉——除非定位纯恐怖，留一点想象空间更聪明",
        "忽略线上入口：客人从美团/点评/小红书找店——名字里有生僻字或无法输入的符号，等于在搜索框里消失",
      ],
    },
    en: {
      label: "Escape rooms",
      title: "How to Name an Escape Room or Immersive Venue: Strategies, Cases & Domains",
      metaDescription:
        "Escape room and immersive entertainment naming guide: mystery roots, world-container names, the group-chat invite test, breakdowns of Sleep No More and more, recommended TLDs and pitfalls — then hunt an available venue domain with AI.",
      intro:
        "Escape room names have a unique distribution channel: the group invite. \"Anyone up for X on Saturday?\" — the name must convey fun, thrill and worth-the-trip inside a single group-chat message. That sets principle one: the name itself must have drama. Mystery roots (cipher, veil, enigma), world-building containers (house, chamber, realm) and adrenaline words (escape, dark, panic) are all legal weapons; a flat \"City Escape Room Experience\" surrenders the free imagination billboard. Second, this is location-based entertainment: customers search \"escape room + city\", so name distinctiveness decides whether reviews and word of mouth route people accurately to you. Third, chains are the industry's growth path — the name needs room for more rooms, themes and cities; welding it to one theme (\"1943 Spy House\") means changing the sign every time you change the script.",
      namingIdeas: [
        "Plant a mystery root: cipher, veil, riddle, enigma — a name that makes people ask \"what does that mean?\" has already won the first move",
        "Use a world-container word: house, chamber, society, studio — frame the venue as a doorway into a world; ideal for multi-theme venues, where the container stays and the world inside rotates",
        "Deploy adrenaline roots: escape, dark, panic, midnight — direct signals for horror and thrill themes that self-select the audience; use sparingly if you also want team-building and family bookings",
        "Run the invite test: put each candidate into a real sentence — \"anyone up for X on Saturday?\" — and say it three times; tongue-twisters, ambiguity, or zero atmosphere means cut it. The name's first medium is the group chat, not the storefront sign",
        "Name the container, not the script: themes rotate every season and cities multiply — Sleep No More can host any dark story; a name locked to one plot expires with it",
      ],
      cases: [
        { name: "Sleep No More", takeaway: "A Macbeth line as an immersive-theatre brand: the literary source lends world-depth while the literal meaning promises intensity — the global benchmark of quotation naming" },
        { name: "The Crystal Maze", takeaway: "crystal (a concrete, glittering image) + maze (the category promise): a physical picture and a challenge in three syllables — a TV-born name that works because you can see it" },
        { name: "Punchdrunk", takeaway: "A single English word meaning dazed-from-blows: names the exact state their immersive shows induce — naming the audience's feeling instead of the product is the cleverest shortcut" },
        { name: "Secret Cinema", takeaway: "secret (the hook) + cinema (the category): two common words, one irresistible question — \"what's the secret?\"; proof that mystery + category beats invented words when both slots are chosen well" },
      ],
      pitfalls: [
        "Naming by category (\"City Escape Experience\"): you'll blur into hundreds of rivals on review platforms and be impossible to retell accurately in word of mouth",
        "Welding the name to one theme: scripts rotate seasonally — a name baked into a specific plot or era means reopening under a new sign at every rotation",
        "Overdosing on horror: blood-and-corpse names filter out team-building, family and date-night bookings — unless you're a pure horror venue, leave room for imagination",
        "Forgetting the search box: customers find venues through maps and review apps — obscure characters or untypeable symbols make you vanish from search",
      ],
    },
  },
  bakery: {
    slug: "bakery",
    tlds: [
      { tld: "com", zh: "线上订单与本地搜索的默认入口，烘焙电商化后更重要", en: "The default door for online orders and local search — vital once you ship" },
      { tld: "shop", zh: "甜品电商语义直给，主名被占时的甜美替补", en: "Says storefront sweetly — a graceful fallback when the .com is taken" },
      { tld: "studio", zh: "手作工作室与私房烘焙的气质后缀，小而美定位加分", en: "The artisan suffix for home bakeries and dessert studios — small-and-beautiful energy" },
    ],
    zh: {
      label: "烘焙甜品",
      title: "烘焙甜品品牌怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "烘焙/甜品/私房蛋糕命名指南：通感词根、手作叙事、包装上镜测试等 5 种思路，好利来/Lady M/Paris Baguette 等案例拆解，推荐 TLD 与常见误区，并用 AI 猎取可注册的烘焙域名。",
      intro:
        "烘焙品牌的名字要在客人看到实物之前就先「闻」到——这是甜品命名的核心命题：通感。黄油的香、出炉的暖、糖霜的甜，好名字用声音唤起味觉与嗅觉（想想「好利来」的喜庆与「原麦山丘」的麦香画面）。第二个特点是场景的仪式感：蛋糕出现在生日、婚礼、纪念日——名字要配得上被写在贺卡旁边、被印在礼盒上、出现在「我在 X 订的蛋糕」的炫耀里。第三是私房与连锁的分野：私房烘焙靠主理人人设与朋友圈传播，名字可以更个人化更有故事；连锁品牌要考虑门头识别、商标注册与跨城市复制。共同的底线是上镜——甜品是社交媒体食物链顶端的品类，名字与包装的合影会出现在小红书与 Instagram 的每一次开箱里。",
      namingIdeas: [
        "通感词根：软、暖、酥、麦、奶、糖——用字音直接触发味觉记忆；英文同理：butter、crumb、whisk、oven 都自带香气",
        "手作与出处叙事：主理人名字、街道名、家传配方的出处（「外婆的方子」式）——私房烘焙的信任来自「谁做的」，名字里带人带故事，朋友圈传播时自带内容",
        "仪式感升维：不叫「蛋糕店」，叫值得庆祝的时刻——甜品消费一半是买给情绪的；想想 Lady M 的优雅感如何撑起千层蛋糕的溢价",
        "法语/日语借词要节制：Pâtisserie、抹茶系日文词自带工艺联想，但生僻拼写会杀死口碑传播——借气质可以，确保中文语境里念得顺",
        "包装上镜测试：把候选名想象成印在礼盒丝带与蛋糕插牌上——好看吗？开箱视频里读出来顺口吗？甜品名字的第一媒介是包装与短视频，不是门头",
      ],
      cases: [
        { name: "好利来", takeaway: "「好运、吉利、到来」三字全是喜庆词根：把蛋糕的庆祝场景直接写进名字，婚寿宴订单的心智默认项——中文喜庆命名的长青标杆" },
        { name: "原麦山丘", takeaway: "「原麦」（原料叙事）+「山丘」（面包出炉的形状画面）：四个字同时说清「真材实料」与「松软饱满」——通感命名的教科书级构图" },
        { name: "Lady M", takeaway: "贵妇人设 + 单字母悬念：优雅气质撑起千层蛋糕的高溢价，M 的留白让人好奇——甜品高端化「名字即定价权」的证明" },
        { name: "Paris Baguette", takeaway: "产地借势（巴黎）+ 品类词（法棍）：韩国品牌借法式烘焙圣地完成气质背书——原产地联想是烘焙业最硬的通货，用别人的也行" },
      ],
      pitfalls: [
        "「XX 烘焙坊」式品类命名：和每条街的同行撞名，外卖平台搜索里永远排在连锁品牌后面",
        "生僻法语词直接做主名：Pâtisserie 类拼写客人读不出也搜不到——口碑传播链在第一次转述时就断了",
        "私房烘焙不留连锁余地：以自己小名命名很温暖，但开第二家店、上电商时要想清楚这个名字能否跟着走",
        "忽略商标与外卖平台重名：烘焙是商标抢注重灾区——美团/饿了么上重名的店会直接分流你的订单",
      ],
    },
    en: {
      label: "Bakeries & desserts",
      title: "How to Name a Bakery or Dessert Brand: Strategies, Cases & Domains",
      metaDescription:
        "Bakery and dessert naming guide: synesthetic roots, maker stories, the gift-box test, breakdowns of Lady M/Paris Baguette/Milk Bar, recommended TLDs and pitfalls — then hunt an available bakery domain with AI.",
      intro:
        "A bakery name should be smelled before the pastry is seen — that's the core brief: synesthesia. Butter, warm ovens, sugar dust: the best names trigger taste and smell through sound alone (crumb, whisk and butter all carry aroma before meaning). Second, dessert is ritual: cakes appear at birthdays, weddings and anniversaries — the name must deserve its place next to a greeting card, printed on a ribbon, and in the brag \"I ordered it from X\". Third, home bakers and chains diverge: a home bakery runs on the maker's persona and friend-circle referrals, so the name can be personal and story-rich; a chain needs sign-legibility, trademark clearance and cross-city repeatability. The shared bottom line is camera-readiness — dessert sits atop the social-media food chain, and your name will co-star in every unboxing on Instagram.",
      namingIdeas: [
        "Mine synesthetic roots: butter, crumb, whisk, oven, honey — words whose sound alone releases aroma; the name should make people hungry before they see a photo",
        "Tell the maker's story: the baker's name, the street, the family recipe's provenance — home-bakery trust comes from who made it, and a story-bearing name is self-propelling content in referrals",
        "Elevate to the occasion: don't name the shop, name the moment worth celebrating — half of dessert spending is emotional; note how Lady M's elegance underwrites a premium for what is, technically, crepe cake",
        "Borrow French or Japanese sparingly: pâtisserie and matcha-adjacent words carry craft associations, but obscure spellings kill word of mouth — borrow the air, keep it pronounceable",
        "Run the gift-box test: picture the name on a ribbon and a cake topper — does it look right? Does it read smoothly in an unboxing video? A dessert name's first media are packaging and short video, not the storefront",
      ],
      cases: [
        { name: "Lady M", takeaway: "An aristocratic persona plus a single-letter mystery: elegance that supports luxury pricing for crepe cake, with the M's blank space inviting curiosity — proof that in dessert, the name is pricing power" },
        { name: "Paris Baguette", takeaway: "Borrowed provenance (Paris) + category word (baguette): a Korean brand endorsing itself with the holy land of French baking — origin association is the hardest currency in baking, and you can borrow someone else's" },
        { name: "Milk Bar", takeaway: "Two plain words made mischievous: milk (childhood comfort) + bar (adult nightlife) — the collision names their playful cereal-milk aesthetic exactly; common words, uncommon pairing" },
        { name: "Dominique Ansel", takeaway: "The pastry chef's full name as the brand: when the product is craft, the maker is the guarantee — the Cronut inventor's name-as-signature is the endgame of maker-story naming" },
      ],
      pitfalls: [
        "Category naming (\"Sweet Treats Bakery\"): you'll collide with every street's rivals and rank behind chains in delivery-app search forever",
        "Leading with an unspellable French word: customers who can't say pâtisserie can't search it either — the referral chain breaks at the first retelling",
        "Boxing in a home bakery: naming after your own nickname is warm, but check the name can travel before the second location or the online store arrives",
        "Skipping trademark and delivery-platform checks: bakery names are squatter magnets — a same-name shop on the delivery app siphons your orders directly",
      ],
    },
  },
  bookstore: {
    slug: "bookstore",
    tlds: [
      { tld: "com", zh: "线上书店与出版品牌的默认门牌，发行渠道都认", en: "The default address for online bookstores and presses — every channel recognizes it" },
      { tld: "store", zh: "独立书店的线上店语义直给，实体与电商一名两用", en: "Says shop outright for indie bookstores — one name serving both the counter and the cart" },
      { tld: "club", zh: "读书会与会员制书店的社群后缀，归属感直给", en: "The community suffix for book clubs and member bookstores — belonging built in" },
    ],
    zh: {
      label: "书店出版",
      title: "书店/独立出版怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "书店/独立出版/读书社群命名指南：文学出处、空间意象、书脊测试等 5 种思路，诚品/单向街/Shakespeare and Company 等案例拆解，推荐 TLD 与常见误区，并用 AI 猎取可注册的书店域名。",
      intro:
        "书店和出版品牌的名字有一个别的行业没有的资源库：全部人类文学。一句诗、一个典故、一位作家的致敬（Shakespeare and Company）都可以成为名字的出处——而出处本身就是品牌故事的第一页。这决定了书业命名的独特标准：名字要经得起「有文化的人」的审视，一个用典精准的名字是暗号，能瞬间筛选出同类。第二个特点是空间与精神的双重性：书店卖的从来不只是书，是「一个可以待着的地方」——名字要同时是地理坐标（单向街）和精神坐标（诚品的「诚」）。对独立出版而言还有书脊测试：社名会印在每一本书的书脊上，在书架上被一眼认出的名字才是好名字。这个行业利润薄、情怀重，名字是最便宜也最重要的资产——它决定了你在读者心里是一家店，还是一种立场。",
      namingIdeas: [
        "文学出处命名：从诗句、典故、致敬对象里取名（Shakespeare and Company 致敬原版巴黎书店）——出处即故事，开业那天品牌叙事已经写好；注意查原文版权与译名通行度",
        "空间意象词：街、岛、灯塔、屋、角落——书店首先是「一个地方」，名字里的空间感邀请人进入并停留；独立书店的「岛」系命名（岛上书店们）正是此理",
        "立场与主张命名：单向街（本雅明《单向街》，也是一种人生态度）——独立书业卖的是选书品味与价值立场，名字直接亮明主张能吸引同类、劝退错的人",
        "书脊测试：把候选社名想象成印在书脊侧面的 2 厘米宽度里——够短吗？字形好认吗？出版社的名字每天在书架上被扫视，书脊是它最高频的广告位",
        "留出业态延展空间：今天的书店明天可能是出版品牌、播客、文创与咖啡——名字定位在「精神坐标」而非「卖书的店」，业态长出来时名字不必换",
      ],
      cases: [
        { name: "诚品", takeaway: "「诚」（诚恳的价值观）+「品」（品味与品物双关）：两个字同时立起道德感与审美感——中文书业命名「一字千金」的天花板，支撑起从书店到百货的业态扩张" },
        { name: "单向街", takeaway: "本雅明《单向街》的直接借用：文学出处+「只此一个方向」的人生态度双重编码——读过的人会心一笑，没读过的人记住了独特意象；用典命名的标杆" },
        { name: "Shakespeare and Company", takeaway: "致敬巴黎原版书店的再命名：名字本身就是一部书业传奇的续写——出处的厚度直接变成品牌的厚度，全球游客专程打卡的原因一半在名字" },
        { name: "Penguin", takeaway: "一只和书毫无关系的企鹅：亲切、好记、图形化——1935 年用它宣告「好书可以平价」，动物图腾让严肃出版有了平易近人的脸；反差命名的世纪案例" },
      ],
      pitfalls: [
        "直接叫「XX 书店/书屋」：品类词命名在地图搜索里和所有同行混排——书业的名字要能被单独记住与转述",
        "用典太深无人能解：出处生僻到需要三段解释的名字，故事讲不出去——好的用典是「查得到」而非「猜不着」",
        "书脊与门头不兼容：名字太长在书脊上印不下、在门头上远看不清——先做视觉测试再定名",
        "锁死「卖书」业态：书店的生存之道是复合业态（咖啡、文创、活动）——名字里焊死「书」字未必错，但要确认它撑得起未来的空间",
      ],
    },
    en: {
      label: "Bookstores & publishing",
      title: "How to Name a Bookstore or Indie Press: Strategies, Cases & Domains",
      metaDescription:
        "Bookstore and independent publishing naming guide: literary provenance, place imagery, the spine test, breakdowns of Shakespeare and Company/Penguin/Verso, recommended TLDs and pitfalls — then hunt an available bookstore domain with AI.",
      intro:
        "Bookstores and presses can draw on a naming resource no other industry has: the whole of literature. A line of verse, an allusion, an homage (Shakespeare and Company) can be the name's provenance — and provenance is page one of the brand story. That sets the trade's peculiar standard: the name must survive scrutiny by well-read people; a precisely chosen allusion works as a password that instantly finds your tribe. Second, a bookstore is both a place and a position: it never sold only books but somewhere to be — the name should work as a geographic coordinate and a spiritual one at once. For indie presses there's also the spine test: the imprint's name is printed on every spine, and only a name recognizable in a two-centimeter strip on a shelf earns its keep. This is a thin-margin, thick-conviction business — the name is its cheapest and most important asset: it decides whether readers see a shop or a stance.",
      namingIdeas: [
        "Name from literature: a verse, an allusion, an homage — provenance is a ready-made brand story on opening day; verify the source's copyright status and how well the reference travels",
        "Use place imagery: street, island, lighthouse, corner, attic — a bookstore is first of all somewhere, and spatial words invite people in to stay",
        "Name the stance: indie bookselling and publishing sell taste and conviction — a name that states the position (Verso: the left-hand page, and the left) attracts your readers and politely repels the wrong ones",
        "Run the spine test: picture the imprint in a two-centimeter strip on a book spine — short enough? Recognizable at a glance? The spine is a publisher's highest-frequency ad slot",
        "Leave room beyond books: today's bookstore becomes tomorrow's press, podcast, café and events brand — anchor the name to a spiritual coordinate, not to \"a shop that sells books\", so the name survives the expansion",
      ],
      cases: [
        { name: "Shakespeare and Company", takeaway: "A renaming in homage to the original Paris shop: the name itself continues a legend of bookselling — the provenance's depth becomes the brand's depth; half the pilgrimage traffic is for the name" },
        { name: "Penguin", takeaway: "A bird with nothing to do with books: friendly, memorable, instantly graphic — in 1935 it announced that good books could be cheap, giving serious publishing an approachable face; the century's best contrast naming" },
        { name: "Verso", takeaway: "The technical term for a book's left-hand page, doubling as \"the left\": one word encoding both bookmaking craft and political stance — the sharpest pun in publishing" },
        { name: "City Lights", takeaway: "Borrowed from Chaplin's film: urban glow, a beacon for wanderers, and Beat-generation rebellion in two common words — a bookstore name that became a literary movement's address" },
      ],
      pitfalls: [
        "Category naming (\"The Book Nook\" et al.): blends into every map search — a bookstore's name must be individually memorable and retellable",
        "Allusions too obscure to land: a reference needing three paragraphs of explanation tells no story — good allusions are lookable-up, not unguessable",
        "Failing the spine and the signboard: a name too long for a book spine or illegible on a storefront from across the street — run the visual test before committing",
        "Welding the name to bookselling alone: survival runs through cafés, events and publishing — a \"books\"-locked name isn't wrong, but confirm it can hold the future you're planning",
      ],
    },
  },
  florist: {
    slug: "florist",
    tlds: [
      { tld: "com", zh: "节日订花的搜索高峰全在线上，.com 接住品牌搜索", en: "Holiday flower searches peak online — .com catches your branded traffic" },
      { tld: "studio", zh: "花艺工作室的气质后缀，手作与设计感直给", en: "The natural suffix for floral design studios — craft and taste built in" },
      { tld: "art", zh: "把花艺当作品的定位宣言，高端定制工作室加分", en: "A statement that floristry is art — extra credit for high-end bespoke studios" },
    ],
    zh: {
      label: "花店花艺",
      title: "花店/花艺工作室怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "花店/花艺工作室/订阅鲜花命名指南：花语词根、诗意意象、贺卡署名测试等 5 种思路，野兽派/花点时间/Bloom & Wild 等案例拆解，推荐 TLD 与常见误区，并用 AI 猎取可注册的花艺域名。",
      intro:
        "花店的名字有个隐蔽而关键的出镜场景：贺卡。「XX 出品」印在卡片角落，随花束抵达收花人手里——名字是礼物的一部分，它要配得上被送出去。这决定了花艺命名的第一原则：名字本身要美，直白的「XX 鲜花店」在贺卡上等于没有署名。第二个特点是情绪价值的浓度：买花的人买的是心意的载体——爱意、歉意、纪念、自我取悦——名字带诗意与花语感，等于给每一束花预装了一句情话。第三是业态的分层：街边花店靠地图搜索与节日流量，订阅制鲜花靠品牌与复购，高端花艺工作室靠作品集与转介绍——名字的气质要匹配你要的那一层。共同点是这个行业的社交媒体依赖度极高：花是天生的镜头宠儿，名字会和作品一起出现在每一次客户晒图里。",
      namingIdeas: [
        "花语与植物词根：bloom、petal、flora、野、朵、栖——自带画面与香气的词根是花艺命名的母语；中文里「野」字近年尤其出彩（野兽派的「野」）",
        "诗意意象借用：从诗句、节气、自然现象里取词（暮色、初雪、南风）——花是情绪的载体，名字先给情绪定调；确认意象与你的花艺风格一致",
        "反差感命名：野兽派用粗犷艺术流派命名精致花艺——反差制造记忆点与话题性；温柔品类配一个有力量的名字，往往比温柔配温柔更出挑",
        "贺卡署名测试：把候选名印在贺卡角落想象一下——收花的人看到这个名字，对花束的心意加分还是减分？花店名字的第一媒介是贺卡与晒图，不是门头",
        "订阅制要好念好续：订阅鲜花品牌的名字出现在每月扣款单与续订提醒里——要短、正面、无歧义（「花点时间」一语双关还自带行动号召，是订阅命名的范本）",
      ],
      cases: [
        { name: "野兽派", takeaway: "借马蒂斯的艺术流派命名花店：粗犷词配精致花艺的反差制造话题，艺术出处又抬高审美预期——从微博卖花到生活方式品牌，名字的容量决定了扩张的容量" },
        { name: "花点时间", takeaway: "「花」字双关（花朵/花费）+「点时间」的生活主张：品牌名同时是订阅制的使用说明与情绪广告——中文双关命名在订阅电商里的教科书" },
        { name: "Bloom & Wild", takeaway: "bloom（绽放）+ wild（野性）：两个词定调「自然而不匠气」的英式花艺审美，& 结构自带精品店气质——英文花艺命名「气质词对仗」的标准结构" },
        { name: "FlowerPlus", takeaway: "品类词+Plus 的直给结构：牺牲诗意换取「鲜花，更多一点」的秒懂——订阅制大众市场的务实选择，证明命名策略要匹配客单价与规模野心" },
      ],
      pitfalls: [
        "「XX 鲜花店」式品类命名：地图搜索里和每个街角的同行混排，贺卡上毫无心意加成",
        "意象与风格错位：名字走「野」系，作品却是标准韩式包装——名与实的落差会在第一次开箱时透支信任",
        "生僻字与拗口拼写：花店订单一半靠口头与微信转述——念不出、打不出的名字在转介绍链条上必然折损",
        "忽略节日流量入口：情人节、母亲节的搜索高峰决定全年营收——名字在地图与外卖平台上的可搜索性要提前验证",
      ],
    },
    en: {
      label: "Florists",
      title: "How to Name a Florist or Floral Studio: Strategies, Cases & Domains",
      metaDescription:
        "Florist and floral design naming guide: botanical roots, poetic imagery, the gift-card signature test, breakdowns of Bloom & Wild/The Beast Shop/Interflora, recommended TLDs and pitfalls — then hunt an available florist domain with AI.",
      intro:
        "A florist's name has a hidden but decisive stage: the gift card. Printed in the corner of a card, it travels with the bouquet into the recipient's hands — the name is part of the gift, and it must deserve to be given. That sets principle one: the name itself must be beautiful; a flat \"City Flower Shop\" on a gift card is no signature at all. Second, flowers carry the highest emotional concentration in retail — love, apology, remembrance, self-care — so a name with poetry pre-installs a sentiment into every bouquet. Third, the trade is layered: corner shops live on map search and holiday spikes, subscription brands on retention, high-end studios on portfolios and referrals — the name's temperament must match the layer you're aiming at. All layers share one dependency: flowers are born camera darlings, and your name will co-star in every customer's post.",
      namingIdeas: [
        "Mine botanical roots: bloom, petal, flora, stem, wild — words that carry scent and image before meaning; the mother tongue of floral naming",
        "Borrow poetic imagery: dusk, first snow, south wind — flowers are emotional vessels, and the name sets the feeling first; make sure the image matches your actual arranging style",
        "Try contrast naming: a fierce name on delicate work creates memorability and talkability (naming a floral house after Fauvism is the classic move) — soft category + strong name often beats soft + soft",
        "Run the gift-card test: picture the name printed in a card's corner — does it add to the sentiment of the bouquet or subtract? A florist's first media are gift cards and customers' posts, not the shopfront",
        "Keep subscriptions short and sweet: a subscription flower brand's name appears on every monthly charge and renewal notice — short, positive, unambiguous (Bloom & Wild reads like a promise, not a transaction)",
      ],
      cases: [
        { name: "Bloom & Wild", takeaway: "bloom + wild: two words setting the natural-not-fussy tone of British floristry, with the ampersand lending boutique polish — the standard structure of paired temperament words" },
        { name: "The Beast Shop", takeaway: "Fauvism (the \"wild beasts\" of art) naming refined floristry: contrast creates talkability while the art provenance raises aesthetic expectations — the name's capacity enabled expansion from bouquets to a lifestyle brand" },
        { name: "Interflora", takeaway: "inter (between) + flora: a name that is literally the business model — flowers delivered across distances through a florist network; infrastructure naming from 1923 that still reads modern" },
        { name: "FlowerPlus", takeaway: "Category word + Plus: trading poetry for instant comprehension — \"flowers, and a bit more\"; the pragmatic choice for mass-market subscriptions, proof that naming strategy must match price point and scale ambition" },
      ],
      pitfalls: [
        "Category naming (\"City Flower Shop\"): blends into every corner rival on the map and adds nothing on a gift card",
        "Image-style mismatch: a wild, untamed name over standard-issue wrapped bouquets — the gap between name and work spends trust at the very first unboxing",
        "Obscure spellings and tongue-twisters: half of florist orders travel by voice and chat referral — a name that can't be said or typed decays at every hop",
        "Ignoring the holiday search spike: Valentine's and Mother's Day decide the year's revenue — verify the name's searchability on maps and delivery platforms before committing",
      ],
    },
  },
  interior: {
    slug: "interior",
    tlds: [
      { tld: "com", zh: "装修是十万元级决策，.com 的信任感直接影响到店率", en: "Renovation is a five-figure decision — .com trust directly moves consult bookings" },
      { tld: "design", zh: "设计工作室的定位后缀，域名本身就是一句自我介绍", en: "The positioning suffix for design studios — the domain is its own introduction" },
      { tld: "studio", zh: "小而美的独立设计室气质，作品集站点的天然选择", en: "Boutique independent-studio energy — a natural home for portfolio sites" },
    ],
    zh: {
      label: "装修设计",
      title: "装修/室内设计公司怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "装修公司/室内设计工作室命名指南：空间意象、材质词根、业主转述测试等 5 种思路，尚层/Studio McGee/土巴兔等案例拆解，推荐 TLD 与常见误区，并用 AI 猎取可注册的装修设计域名。",
      intro:
        "装修行业的名字要跨过一道特殊的信任门槛：客户要把家的钥匙和几十万预算交给你，工期还长达数月。这决定了装修命名的第一原则是「像一家能负责到底的公司」——过于俏皮或网感的名字，在签合同那一刻会被业主的家人质疑。第二个特点是获客链路的分裂：设计工作室靠作品集与转介绍，名字要有审美暗示；施工队与整装公司靠本地搜索与平台流量，名字要好搜好记。第三是「业主转述场景」的高频：装修决策几乎必然经过邻居、亲戚、业主群的多轮转述——「我家是 X 做的」这句话就是你最大的广告位，名字必须在方言和微信语音里都不走样。最后，行业口碑两极分化严重，一个中性偏正面的名字是口碑资产的容器，别让名字先替你许下兑现不了的承诺。",
      namingIdeas: [
        "空间与光线意象：宅、舍、居、间、light、space、nest——装修卖的是「未来的家」，名字先给客户一个画面；测试方法是问自己「这个词让我想住进去吗」",
        "材质与工艺词根：木、砼、素、原、oak、stone、craft——材质词自带质感与工艺暗示，适合主打自然风或极简风的设计工作室",
        "「负责感」命名：整装与施工公司优先传递可靠——层、匠、诚、方圆这类有分量的字眼，比创意造词更能过业主家人那一关",
        "业主群转述测试：把名字放进「我家是 X 做的，你要不要也找他们看看」念一遍——拗口、歧义、记不住的名字在转介绍链条上每传一次折损一次",
        "设计室用人名要配作品：以主案设计师命名（如 Studio McGee 模式）能积累个人 IP，但域名与社交账号必须全套拿下，且要接受「公司卖不掉」的代价",
      ],
      cases: [
        { name: "尚层", takeaway: "「尚」（崇尚/高尚）+「层」（空间的层次/阶层）：两个字同时说出审美追求与高端定位，别墅装饰的目标客群一听就知道是为自己开的——中文装修命名里定位精准的范本" },
        { name: "Studio McGee", takeaway: "studio + 创始人姓氏：作品与人绑定，Instagram 上的每一张美图都在为名字积累信任，最终反向输出电视节目与家居产品线——设计工作室「个人 IP 命名」的天花板" },
        { name: "土巴兔", takeaway: "土巴（泥土的方言感）+ 兔（亲和吉祥物）：把「装修」这个又土又累的品类变得憨厚可亲，三个字在下沉市场的记忆度远超英文名——平台型获客的名字要的是国民度不是格调" },
        { name: "Houzz", takeaway: "house + buzz 的变形拼写：一个词说清「围绕房子的热闹社区」，双 z 结尾自带互联网产品感——品类词轻变形在家居平台命名里的经典执行" },
      ],
      pitfalls: [
        "堆砌「豪」「皇」「至尊」类字眼：高端感不是喊出来的，这类名字反而暗示审美不可信",
        "用「XX 装饰工程有限公司」全称当品牌：注册名与品牌名要分开，品牌名超过 4 个字就很难进业主群的日常转述",
        "设计工作室起施工队的名：名字气质与目标客单价错位，作品集再好也约不来对的客户",
        "忽略本地搜索与地图入口：装修获客高度本地化，名字在地图、点评与本地平台上的可搜索性要提前验证，别与本地同行撞名",
      ],
    },
    en: {
      label: "Interior & renovation",
      title: "How to Name an Interior Design or Renovation Firm: Strategies, Cases & Domains",
      metaDescription:
        "Interior design and renovation naming guide: spatial imagery, material roots, the homeowner-referral test, breakdowns of Studio McGee/Houzz/Havenly, recommended TLDs and pitfalls — then hunt an available design domain with AI.",
      intro:
        "A renovation firm's name must clear an unusual trust bar: clients hand you their house keys and a five-figure budget, then live with your work for months of construction and years after. That sets principle one — sound like a company that finishes what it starts; a too-cute, too-clever name gets second-guessed by the client's whole family at contract time. Second, the industry's funnels are split: design studios win on portfolios and referrals, so the name should whisper taste; contractors and full-service firms win on local search, so the name must be findable and instantly memorable. Third, renovation decisions travel through neighbors, relatives and homeowner group chats — \"X did our place\" is your biggest ad placement, and the name must survive being said aloud across accents and voice messages. Finally, this is a reputation-polarized trade: a calm, quietly positive name is a container for accumulated word of mouth — don't let the name make promises your crews have to live down.",
      namingIdeas: [
        "Draw on space and light: haven, nest, dwell, atelier, light, room — you're selling the client's future home, so the name should paint a picture first; ask yourself \"does this word make me want to live in it?\"",
        "Mine material and craft roots: oak, stone, timber, plaster, craft — material words carry texture and workmanship, ideal for studios with a natural or minimalist signature",
        "Name for accountability: contractors and design-build firms should lead with reliability — solid, weighty words (True, Foundry, Beam) pass the client's-family test better than clever coinages",
        "Run the group-chat referral test: say \"X did our place — want their number?\" out loud; a name that stumbles, puns awkwardly, or fades from memory decays at every hop of the referral chain",
        "Use founder names only with a portfolio engine: the Studio McGee model compounds personal brand into the firm, but you must own the domain and every social handle — and accept that the company becomes harder to sell",
      ],
      cases: [
        { name: "Studio McGee", takeaway: "studio + the founders' surname: work and person fused, every Instagram photo compounding trust into the name — eventually spinning out a Netflix show and product lines; the ceiling of personal-brand naming for design studios" },
        { name: "Houzz", takeaway: "house + buzz in one mutated spelling: an entire \"community buzzing around homes\" in five letters, with the double-z lending product energy — the classic light-twist-on-category-word play for home platforms" },
        { name: "Havenly", takeaway: "haven + -ly: the outcome (a home that feels like a refuge) packaged with a soft adverbial ending — outcome-first naming that positions online design services as comfort, not construction" },
        { name: "Block Renovation", takeaway: "A blunt construction word + the category: deliberately unpoetic, signaling process and predictability in an industry famous for chaos — proof that in renovation, sounding boring can be a trust strategy" },
      ],
      pitfalls: [
        "Piling on \"luxury/royal/elite\": prestige is shown in the portfolio, not shouted in the name — these words read as a taste warning, not a promise",
        "Trading as the full legal name (\"XYZ Decoration Engineering Co.\"): keep the registered entity and the brand separate; anything over three words dies in homeowner group chats",
        "A contractor-sounding name on a design studio (or vice versa): temperament–price mismatch means even a great portfolio attracts the wrong briefs",
        "Skipping the local search check: renovation demand is fiercely local — verify the name on maps and review platforms first, and make sure a nearby rival isn't already one letter away",
      ],
    },
  },
  studyabroad: {
    slug: "studyabroad",
    tlds: [
      { tld: "com", zh: "家长掏几十万学费前会反复核实，.com 是尽调的第一关", en: "Parents vet you hard before wiring tuition — .com is the first credibility check" },
      { tld: "co", zh: "面向学生端的年轻化品牌替身，短而利落不失专业", en: "A younger-feeling stand-in for student-facing brands — short, sharp, still professional" },
      { tld: "online", zh: "语培与网课业务直给定位，服务形态一目了然", en: "Says the delivery model outright for test-prep and online programs" },
    ],
    zh: {
      label: "留学教育",
      title: "留学机构/国际教育品牌怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "留学中介/国际教育/语培机构命名指南：桥梁意象、目的地词根、双客户测试等 5 种思路，新东方/启德/IDP 等案例拆解，推荐 TLD 与常见误区，并用 AI 猎取可注册的留学教育域名。",
      intro:
        "留学服务的名字要同时说服两代人：付钱的家长要看到「靠谱、专业、有出路」，实际使用服务的学生要觉得「不土、懂我」。两代人的审美几乎是对立的——这是留学命名最独特的约束。第二个特点是决策周期长、客单价高：从初次咨询到签约往往数月，家长会反复搜索你的名字查口碑，一个搜索结果干净、无歧义的名字是尽调环节的隐形加分项。第三是天然的跨语言场景：名字会出现在中文的家长群、英文的申请文书邮件署名和目的地院校的合作名录里，双语都要立得住。最后注意行业的信任敏感性：留学中介的负面口碑传播极快，名字要中性稳健，切忌「保录」「直通」这类把承诺写进名字的做法——监管与舆情迟早找上门。",
      namingIdeas: [
        "桥梁与航程意象：bridge、pathway、compass、启、途、帆——留学的本质是「从此岸到彼岸」，方位与航程词根既有画面又不锁定具体国家",
        "目的地词根慎用：名字里带 UK/US/藤（Ivy）能精准获客，但业务扩到其他国家线时名字就成了天花板——除非战略上就做单一目的地",
        "两代人测试：把候选名分别念给一位家长和一位高中生听——家长觉得可信、学生不觉得尴尬才算过关；只过一边的名字会在签约桌上被另一边否决",
        "教育感词根嫁接：academy、scholar、mentor、德、思、博——嫁接一个教育词根让专业性直给，再配一个气质词避免呆板（如「启德」的启 + 德）",
        "查目的地语言歧义：名字会出现在英文邮件与院校合作场景——确认拼音或英文名在目的地语言里无歧义、好发音，最好让母语者念一遍",
      ],
      cases: [
        { name: "新东方", takeaway: "「新」+「东方」：在出国潮起点喊出「东方学生的新出路」，地理词自带身份认同，两个常用字组合出全国性的记忆度——时代情绪注入名字的经典案例" },
        { name: "启德", takeaway: "「启」（开启/启程）+「德」（品德/德才）：一个字给行动一个字给信任，家长听到的是「靠谱」，学生听到的是「出发」——两代人测试双通过的中文范本" },
        { name: "IDP", takeaway: "International Development Program 的缩写：机构背景（澳洲高校联合创办）让三个字母自带官方信任，还持有雅思合股方身份——缩写命名只在「有硬背书」时才成立" },
        { name: "Crimson Education", takeaway: "crimson 是哈佛校色：一个颜色词把「藤校」写进名字却不落俗套，比直接叫 Ivy 高一个段位——用文化暗号替代直白承诺的高级做法" },
      ],
      pitfalls: [
        "把承诺写进名字（保录、直通、100%）：监管红线加舆情火药桶，一单纠纷就全网反噬",
        "堆砌「国际」「环球」「海外」：三个词加起来等于没说，搜索结果里和几百家同行糊成一片",
        "只顾中文响亮不查英文观感：名字要出现在申请邮件与院校合作名录里，拼音在英文语境里拗口或有歧义都是隐形减分",
        "用创始人头衔命名（X 老师留学）：个人 IP 获客快，但机构化扩张与转让时名字就是枷锁，且头衔真实性会被反复审视",
      ],
    },
    en: {
      label: "Study abroad",
      title: "How to Name a Study Abroad or International Education Brand: Strategies, Cases & Domains",
      metaDescription:
        "Study abroad and international education naming guide: journey imagery, destination roots, the two-generation test, breakdowns of IDP/Crimson Education/Kaplan, recommended TLDs and pitfalls — then hunt an available education domain with AI.",
      intro:
        "A study-abroad brand must persuade two generations at once: the parents paying tuition need to hear \"credible, professional, well-connected\", while the students actually using the service need it to feel current and on their side. Those two tastes are nearly opposites — the defining constraint of this category. Second, the sales cycle is long and the ticket is high: families research you for months, searching the name repeatedly to check reviews, so a clean, unambiguous search footprint is an invisible advantage in their due diligence. Third, the name lives natively in two languages — in parents' group chats, in application email signatures, and in partner universities' agent directories — and must stand up in both. Finally, respect the trust sensitivity of the trade: bad news travels fastest in education, so keep the name steady and neutral, and never write a promise into it — \"guaranteed admission\" naming is a regulatory and reputational time bomb.",
      namingIdeas: [
        "Use bridge and voyage imagery: bridge, pathway, compass, horizon, sail — studying abroad is a crossing, and journey roots paint the picture without locking you to one destination",
        "Handle destination roots with care: UK/US/Ivy in the name targets precisely but caps expansion the moment you add country lines — only commit if single-destination is the strategy",
        "Run the two-generation test: read the shortlist to a parent and a teenager separately — it passes only if the parent finds it trustworthy and the student isn't embarrassed to say it; a name that wins one side gets vetoed by the other at signing",
        "Graft an education root: academy, scholar, mentor, prep — one root for authority, paired with a temperament word so it doesn't read institutional and stiff",
        "Clear the destination language: the name will appear in English emails and university partner lists — confirm it's easy to pronounce and free of odd meanings for native speakers before committing",
      ],
      cases: [
        { name: "IDP", takeaway: "An acronym of International Development Program: co-founded by Australian universities and a co-owner of IELTS — three letters that work only because hard institutional backing stands behind them; acronym naming needs collateral" },
        { name: "Crimson Education", takeaway: "Crimson is Harvard's color: one word writes \"Ivy League\" into the name as a cultural password rather than a blunt claim — a class above naming yourself Ivy-anything" },
        { name: "Kaplan", takeaway: "The founder's surname scaled into a global education group: decades of test-prep results turned a family name into category shorthand — surname naming works when the product compounds reputation for years" },
        { name: "Flywire", takeaway: "fly + wire: cross-border tuition payments compressed into two syllables of speed and connection — adjacent-category proof that international education names win by evoking the crossing, not the paperwork" },
      ],
      pitfalls: [
        "Writing the promise into the name (Guaranteed, Direct-Admit, 100%): a regulatory red line and a PR powder keg — one dispute detonates it",
        "Stacking \"international/global/overseas\": three fillers that say nothing and blur you into hundreds of rivals on the results page",
        "Clearing only the Chinese name: the brand appears in application emails and partner directories — a romanization that's clumsy or ambiguous in English quietly costs credibility",
        "Naming after the founder's title (\"Teacher X Abroad\"): fast for personal-brand acquisition, but a shackle for institutional growth — and the title itself will be scrutinized forever",
      ],
    },
  },
  usedcar: {
    slug: "usedcar",
    tlds: [
      { tld: "com", zh: "二手车最缺的就是信任，.com 是打消疑虑的第一步", en: "Trust is the scarcest asset in used cars — .com is step one of dispelling doubt" },
      { tld: "cn", zh: "国内车源与线下门店业务，备案合规 .cn 最顺", en: "For China-based inventory and showrooms, .cn clears ICP filing smoothest" },
      { tld: "net", zh: "车源网络与交易平台的气质后缀，行业沉淀已久", en: "A long-established fit for inventory networks and trading platforms" },
    ],
    zh: {
      label: "二手车",
      title: "二手车品牌怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "二手车电商/车行/检测服务命名指南：信任词根、透明意象、砍价场景测试等 5 种思路，瓜子/Carvana/CarMax 等案例拆解，推荐 TLD 与常见误区，并用 AI 猎取可注册的二手车域名。",
      intro:
        "二手车是经济学教科书里「柠檬市场」的原型：信息不对称让买家默认卖家在隐瞒什么。所以二手车命名的第一使命不是好听，而是对冲怀疑——名字要传递透明、检测、有据可查的信号。第二个特点是客单价与决策焦虑齐高：几万到几十万的支出，买家会把你的名字连同「靠谱吗」「坑不坑」一起搜索，名字的口碑联想会被放大检视。第三是场景的烟火气：二手车交易发生在车贩子的口头报价、本地车友群和短视频探店里，名字要经得起方言念、经得起砍价场景的反复提及。最后注意业务分层：C2C 平台要国民度与好念，精品车行要格调与专业，检测评估服务要中立与权威——名字的气质选错层，广告费就白花。",
      namingIdeas: [
        "信任与透明词根：真、诚、透、check、true、fair——直接对冲柠檬市场的默认怀疑；配合「没有中间商」类的透明主张，名字与卖点互相加固",
        "生活化比喻降低戒备：瓜子、豆瓣式的日常词汇让交易显得轻松无套路——大宗焦虑型消费反而适合举重若轻的名字，但要配得上真实的服务水准",
        "车轮与旅程意象：drive、wheel、途、程、road——绕开「旧车」的贬值感，把叙事引向「下一段旅程」；适合精品车行与出口贸易商",
        "砍价场景测试：想象买家在电话里说「我在 X 看了一辆」——名字要在方言、语音消息和车友群转述里不走样；三个字以内的中文名在这个行业有明显优势",
        "检测服务要中立感：第三方检测评估的名字避免站买卖任何一边——用「数据、标准、实验室」类词根（如 carfax 的 fax 档案感）建立裁判形象",
      ],
      cases: [
        { name: "瓜子二手车", takeaway: "「瓜子」：用嗑瓜子的日常轻松感消解大宗交易的紧张，两个字国民度拉满，配合「没有中间商赚差价」的口号名实互锁——C2C 平台命名的中文教科书" },
        { name: "Carvana", takeaway: "car + nirvana 的合成：「买车的极乐体验」写进名字，配合玻璃塔提车的仪式感落地——名字先许诺体验，再用产品兑现，体验型电商命名的完整示范" },
        { name: "CarMax", takeaway: "car + max 的直给结构：最大选择、最大确定性，一口价政策与名字互相印证——在充满套路的行业里，「简单直接」本身就是差异化定位" },
        { name: "Carfax", takeaway: "car + fax（传真/档案）：一辆车的历史像档案一样可调取，名字即产品说明——第三方数据服务命名的黄金标准，中立感与权威感兼得" },
      ],
      pitfalls: [
        "名字里带「豪」「尊」「皇家」：二手车买家最警惕被包装，浮夸字眼等于自我举报",
        "用「旧车」「淘车」等贬值词根定调：把叙事锁死在「便宜旧货」，精品车源与售后服务的溢价空间被名字提前放弃",
        "平台名与车行名错位：三个字国民风的名字开精品车行显得廉价，英文格调名做下沉市场没人记得住——先想清楚做哪一层",
        "忽略搜索联想词：买家必然搜「X 靠谱吗」——起名前先搜一遍候选名的联想词，避开已有负面沉淀的相似名",
      ],
    },
    en: {
      label: "Used cars",
      title: "How to Name a Used Car Brand: Strategies, Cases & Domains",
      metaDescription:
        "Used car marketplace, dealership and inspection naming guide: trust roots, transparency imagery, the haggling-call test, breakdowns of Carvana/CarMax/Carfax, recommended TLDs and pitfalls — then hunt an available auto domain with AI.",
      intro:
        "Used cars are the textbook \"market for lemons\": information asymmetry makes every buyer assume the seller is hiding something. So the first job of a used-car name isn't beauty — it's counteracting suspicion, signaling transparency, inspection, and verifiable history. Second, ticket size and anxiety rise together: on a five-figure purchase, buyers will google your name next to \"scam\" and \"reviews\", so the name's reputation associations get examined under a microscope. Third, the trade lives in gritty, spoken contexts — phone haggling, local car groups, walk-around videos — and the name must survive accents, voice notes and being repeated mid-negotiation. Finally, pick your layer before you pick your name: C2C marketplaces need household memorability, boutique dealers need polish, inspection services need referee-grade neutrality — a name pitched at the wrong layer wastes every ad dollar.",
      namingIdeas: [
        "Lead with trust and transparency roots: true, fair, clear, check, vault — directly offsetting the lemon-market default of doubt; pair with a transparency promise so name and pitch reinforce each other",
        "Disarm with everyday words: casual, snackable names make a tense transaction feel routine — big-ticket anxiety purchases reward lightness, provided the service actually delivers",
        "Steer to the journey, not the age: drive, wheel, road, miles — sidestep the depreciation frame of \"old car\" and point the story at the next chapter; ideal for boutique dealers and exporters",
        "Run the haggling-call test: picture a buyer saying \"I saw one at X\" over a bad phone line — the name must survive accents, voice messages and group-chat retelling; short beats clever in this trade",
        "Keep inspection brands neutral: third-party inspectors must not sound like they work for either side — data, record and lab roots (the fax in Carfax) build the referee persona",
      ],
      cases: [
        { name: "Carvana", takeaway: "car + nirvana: \"the blissful way to buy a car\" written into the name, then made literal with glass vending towers — promise the experience in the name, deliver it in the product; the full playbook of experience-first commerce naming" },
        { name: "CarMax", takeaway: "car + max, maximally blunt: biggest selection, most certainty, with no-haggle pricing echoing the name's directness — in a trade famous for games, plain-dealing itself is the differentiator" },
        { name: "Carfax", takeaway: "car + fax: a vehicle's history retrievable like a filed document — the name is the product spec; the gold standard for third-party data services, neutral and authoritative at once" },
        { name: "Cazoo", takeaway: "car + zoo(m) energy in a coined two-syllable word: playful, ownable, made for TV ads — proof that even lemons-market brands can win attention with lightness, though the name must be backed by real guarantees" },
      ],
      pitfalls: [
        "Royal/luxury/elite in the name: used-car buyers are hyper-alert to dressing-up — grandiose words read as a confession",
        "Anchoring on depreciation roots (\"old\", \"cheap\", \"bargain\"): the name pre-surrenders any premium for certified inventory and after-sale service",
        "Layer mismatch: a folksy marketplace name on a boutique dealership reads cheap; a polished English name in a mass local market gets forgotten — choose your layer first",
        "Ignoring search association: buyers will search \"is X legit\" — google every shortlisted name first and steer clear of lookalikes with existing baggage",
      ],
    },
  },
  insurance: {
    slug: "insurance",
    tlds: [
      { tld: "com", zh: "保险卖的是几十年的承诺，.com 的稳重感无可替代", en: "Insurance sells decades-long promises — nothing substitutes for .com gravitas" },
      { tld: "life", zh: "寿险与健康险业务定位直给，后缀即品类声明", en: "States the life & health category outright — the suffix is the positioning" },
      { tld: "pro", zh: "经纪人个人品牌与专业顾问站点的利落选择", en: "A clean fit for broker personal brands and advisory practices" },
    ],
    zh: {
      label: "保险经纪",
      title: "保险经纪/保险科技品牌怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "保险经纪/保险科技/代理人团队命名指南：庇护意象、确定性词根、理赔场景测试等 5 种思路，Lemonade/蚂蚁保/Oscar 等案例拆解，推荐 TLD 与常见误区，并用 AI 猎取可注册的保险域名。",
      intro:
        "保险是「先付钱、后兑现、希望永远用不上」的反直觉商品，名字承担的是整个交易里最稀缺的东西：对遥远承诺的信任。传统保险命名走「庞大机构」路线（人寿、平安、太平），用体量感背书兑付能力；保险科技新品牌则反其道而行——用轻松、人性的名字（Lemonade、Oscar）对冲行业「冷漠、拖赔」的刻板印象。两条路线都成立，关键是与商业模式匹配：靠资产负债表吃饭的要稳重，靠体验与效率吃饭的要新鲜。第二个特点是场景的严肃性不对称：投保时可以轻松，理赔时刻名字会被焦虑的客户反复念叨——名字要经得起「人生最糟的一天」的检视。第三是监管与合规敏感：名字不能暗示收益承诺或官方背景，展业物料上名字旁边永远跟着牌照编号，起名前先查监管的命名负面清单。",
      namingIdeas: [
        "庇护与守护意象：伞、盾、港、shield、cover、haven——保险的原型意象最直觉也最耐用；测试标准是「出险那天看到这个名字，是安心还是讽刺」",
        "确定性词根：安、稳、诚、sure、trust、solid——把「一定赔」的承诺感写进音节里；sure 词根在英文保险命名里几乎是行业暗号（Insure/Assurance）",
        "反差人性化：用日常温暖的词（柠檬水、人名）对冲行业冷漠感——适合主打体验与快赔的科技品牌，但要有真实的体验支撑，否则反差变反讽",
        "理赔场景测试：想象客户在医院走廊或事故现场打开你的 App——名字与图标在那个时刻要传递「有人管」的确定感，俏皮过头的名字此刻会显得轻浮",
        "经纪人个人品牌配结构词：独立经纪人与团队用「人名/地名 + 保险经纪/顾问」的结构最稳——获客靠人的信任，名字只需专业不添乱",
      ],
      cases: [
        { name: "Lemonade", takeaway: "「柠檬水」：把最坏的遭遇酿成清爽的补偿（when life gives you lemons），一个词完成「反保险刻板印象」的定位，配合秒级理赔的产品兑现——行业颠覆者命名的标杆" },
        { name: "蚂蚁保", takeaway: "「蚂蚁」（微小但众多）+「保」：品类字直给，蚂蚁的渺小反而暗合「普惠、人人买得起」的定位，背靠支付宝的分发生态——平台型保险入口命名的范本" },
        { name: "Oscar", takeaway: "用一个亲切的人名做健康险：像朋友而不像机构，官网与理赔信都以第一人称写作——名字定调了整个品牌的说话方式，人格化命名的完整执行" },
        { name: "众安", takeaway: "「众」（众人/互联网的连接）+「安」（平安/安心）：两个字同时说出互联网基因与保险本质，读音干脆利落——中文保险科技命名里新旧平衡的典型" },
      ],
      pitfalls: [
        "暗示收益或官方背景（国字头、XX 联合）：监管命名负面清单直接卡死，备案都过不了",
        "俏皮过头没有兑现：轻松的名字必须配得上真实的理赔体验，否则出险客户的每一条差评都会引用你的名字反讽",
        "用缩写堆专业感（XX 保经、XX 保代）：合规全称留给牌照，品牌名要让家人群里转发时念得出、记得住",
        "忽略谐音与歧义排查：保险名字最怕不吉利联想——候选名用各主要方言念一遍，「赔」「损」「险」的谐音雷区要逐个排掉",
      ],
    },
    en: {
      label: "Insurance",
      title: "How to Name an Insurance or Insurtech Brand: Strategies, Cases & Domains",
      metaDescription:
        "Insurance brokerage and insurtech naming guide: shelter imagery, certainty roots, the claim-day test, breakdowns of Lemonade/Oscar/Root, recommended TLDs and pitfalls — then hunt an available insurance domain with AI.",
      intro:
        "Insurance is the counterintuitive product you pay for first, redeem later, and hope never to use — so the name carries the scarcest asset in the deal: trust in a distant promise. Legacy naming goes institutional (Prudential, Allianz) — sheer mass vouching for the balance sheet. Insurtech challengers run the opposite play: warm, human names (Lemonade, Oscar) to offset the industry's cold, claim-denying stereotype. Both work; what matters is matching the model — balance-sheet businesses should sound like granite, experience businesses like fresh air. Second, the emotional stakes are asymmetric: buying can be lighthearted, but on claim day an anxious customer will repeat your name in a hospital corridor — it must hold up on the worst day of someone's life. Third, this is a regulated namespace: no implied returns, no official-sounding prefixes, and your trading name will sit next to a license number on every document — check the regulator's naming blacklist before falling in love with anything.",
      namingIdeas: [
        "Reach for shelter imagery: shield, cover, haven, umbrella, harbor — insurance's archetypal images are the most intuitive and most durable; test: on claim day, does the name feel reassuring or ironic?",
        "Build on certainty roots: sure, true, solid, root, anchor — write the \"we will pay\" promise into the syllables; the sure root is practically the industry's password (Insure, Assurance)",
        "Humanize by contrast: an everyday warm word or a first name offsets institutional coldness — right for experience-led insurtechs, but only if claims actually feel that friendly; unearned contrast curdles into sarcasm",
        "Run the claim-day test: picture a customer opening your app at a crash site or a hospital corridor — name and icon must radiate \"someone's got you\"; a too-jokey name reads flippant in that moment",
        "Keep broker brands structural: independent brokers and agencies do best with name/place + insurance advisors — the trust lives in the person; the name just needs to stay professional and out of the way",
      ],
      cases: [
        { name: "Lemonade", takeaway: "When life gives you lemons: the worst event brewed into fresh compensation — one word repositions the entire category, backed by seconds-fast claims; the benchmark for disruptor naming in insurance" },
        { name: "Oscar", takeaway: "A friendly first name on health insurance: a company that talks like a person, with claims letters written in first person — the name set the voice for the whole brand; personification executed end to end" },
        { name: "Root", takeaway: "A grounding one-syllable noun for usage-based car insurance: fairness from first principles (priced from how you actually drive) — certainty-root naming with a tech-native accent" },
        { name: "Policygenius", takeaway: "policy + genius: the smart friend who reads the fine print for you — comparison marketplaces win by naming the buyer's wish (expertise on their side), not the product" },
      ],
      pitfalls: [
        "Implying returns or official status (State-, National-, Guaranteed-): regulators' naming blacklists will stop the registration before the market ever judges it",
        "Whimsy without delivery: a playful name writes a check the claims department must cash — every denied claim becomes an ironic screenshot of your brand",
        "Acronym armor (XYZ B&A Ltd.): leave the compliance name to the license; the brand must survive being said aloud in a family group chat",
        "Skipping the bad-association sweep: insurance names live and die on connotation — read every candidate aloud for unlucky homophones and \"loss/risk\" echoes across your customers' languages",
      ],
    },
  },
  farm: {
    slug: "farm",
    tlds: [
      { tld: "com", zh: "生鲜复购靠信任沉淀，.com 承接品牌搜索最稳", en: "Fresh-food repeat orders run on trust — .com anchors branded search best" },
      { tld: "life", zh: "把「生活方式」写进后缀，农场品牌的气质延伸", en: "Writes the lifestyle into the suffix — a natural extension for farm brands" },
      { tld: "shop", zh: "农场直供电商与周期购业务的直给入口", en: "A straight-shot storefront for farm-direct e-commerce and subscriptions" },
    ],
    zh: {
      label: "农场生鲜",
      title: "农场/生鲜品牌怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "农场/生鲜电商/农产品品牌命名指南：土地意象、时令词根、产地故事等 5 种思路，褚橙/盒马/Oatly 等案例拆解，推荐 TLD 与常见误区，并用 AI 猎取可注册的农场生鲜域名。",
      intro:
        "农产品是典型的「信任品」：好不好吃、安不安全，买之前看不出来，吃过之后才知道。名字的第一使命就是提前发放信任——产地、时令、种植者的脸，都是名字可以携带的信任信号。第二个特点是「同质化突围」：白菜就是白菜，鸡蛋就是鸡蛋，农产品本身难以差异化，名字与品牌几乎是唯一的溢价来源——褚橙与普通冰糖橙的价差，大半是名字里那个人背的书。第三是渠道决定名字气质：地头批发靠产地名，社区团购靠亲切好念，精品商超与出口靠品牌感，同一颗草莓在三个渠道需要三种名字策略。最后是天然的内容红利：农场有四季、有生长、有收获，名字若自带叙事感，短视频与直播的内容素材取之不尽。",
      namingIdeas: [
        "土地与时令词根：田、垄、鲜、集、farm、harvest、dawn——泥土与清晨的画面感是农产品命名的母语，城市消费者买的正是这份「离土地近」的想象",
        "人名背书命名：用种植者/创始人的真名（褚橙模式）——「一个具体的人为品质负责」是农产品最强的信任结构，但人设与品质必须真实经得起追溯",
        "产地地名要有授权意识：五常大米、赣南脐橙式的地理标志自带信任，但区域公共品牌人人可用——地名之上还要叠加自有品牌名，否则永远在为产地打工",
        "时令与新鲜感直给：晨摘、daily、季节词——生鲜的核心卖点就是「新鲜」，名字里预装时间感，让「今早刚摘」的叙事顺理成章",
        "社区团购要好念好转发：团长在群里发「今天开团 X」——名字超过三个字、有生僻字、不好打字，转发链条上每一环都在流失",
      ],
      cases: [
        { name: "褚橙", takeaway: "创始人姓氏 + 品类字：一个「褚」字背后是人生起落的故事，把普通冰糖橙卖出人格溢价——农产品「人名背书」命名的天花板，证明信任品的名字要有人的温度" },
        { name: "盒马", takeaway: "「盒」（到家的载体）+「马」（速度与吉祥物）：两个具体名词拼出「快速到家的生鲜」，河马形象让冷链生意有了亲和入口——渠道品牌用具象词降低理解成本的范本" },
        { name: "Oatly", takeaway: "oat + -ly：品类词加一个轻快尾缀，把燕麦奶从原料变成生活方式宣言，包装文案与名字一体化人格输出——农产品深加工品牌「品类即品牌」的经典执行" },
        { name: "十月稻田", takeaway: "「十月」（收获时令）+「稻田」（土地画面）：四个字自带丰收画面与时间戳，在电商货架上比产地名更有品牌独占性——时令 + 土地意象组合的教科书" },
      ],
      pitfalls: [
        "堆砌「绿色」「有机」「天然」：认证词不是品牌名，没有证书支撑还会引来监管与打假",
        "只用地理标志不建自有品牌：区域公共品牌人人可用，你的复购与口碑最终沉淀不到自己身上",
        "名字画面与实际品控脱节：「晨摘」「现捞」写进名字，冷链却做不到——生鲜差评的杀伤力会让名字变成呈堂证供",
        "忽略平台搜索习惯：消费者在电商与团购平台搜品类词（草莓、大米）——名字要能与品类词自然组合出现，生僻字与纯英文名在货架搜索里天然吃亏",
      ],
    },
    en: {
      label: "Farms & fresh food",
      title: "How to Name a Farm or Fresh Food Brand: Strategies, Cases & Domains",
      metaDescription:
        "Farm, fresh produce and CSA naming guide: land imagery, harvest roots, grower-story naming, breakdowns of Oatly/Misfits Market/Bowery, recommended TLDs and pitfalls — then hunt an available farm domain with AI.",
      intro:
        "Fresh food is the archetypal trust good: you can't tell how it tastes or how safely it was grown until after you've bought it. A farm brand's name must therefore issue trust in advance — origin, season, and the grower's face are all signals a name can carry. Second, produce is brutally commoditized: a tomato is a tomato, so the name and brand are nearly the only sources of premium — the price gap between a branded orange and a generic one is mostly the story the name carries. Third, channel dictates temperament: wholesale runs on origin names, community group-buys on short friendly ones, premium grocers and export on polished brands — the same strawberry needs three naming strategies in three channels. Finally, farms hold a content dividend: seasons, growth, and harvest give a narrative-rich name endless material for short video and live streams.",
      namingIdeas: [
        "Root in land and season: field, acre, harvest, dawn, grove — soil-and-morning imagery is the native tongue of food naming; urban customers are buying exactly that closeness to the land",
        "Name after the grower: a real founder's name on the produce (the branded-orange play) is the strongest trust structure in food — one identifiable person answering for quality; but the story must survive scrutiny",
        "Treat origin names as a floor, not a brand: protected origins carry built-in trust but belong to everyone in the region — stack your own brand on top or you'll forever be marketing the place, not the farm",
        "Pre-install freshness: dawn-picked, daily, season words — freshness is the entire pitch, so put the timestamp in the name and let \"harvested this morning\" tell itself",
        "Keep group-buy names forwardable: the organizer types \"today's deal: X\" into a group chat — long names, hard spellings and foreign words leak customers at every forward",
      ],
      cases: [
        { name: "Oatly", takeaway: "oat + -ly: a category word with a breezy suffix that turned an ingredient into a lifestyle statement, with packaging copy extending the name's voice — the classic category-as-brand execution for processed farm goods" },
        { name: "Misfits Market", takeaway: "Naming the product's flaw: \"misfit\" ugly produce reframed as charming rescue — the name does the entire positioning of fighting food waste at a discount; flaw-first naming at its bravest" },
        { name: "Bowery", takeaway: "A New York street name on vertical farming: urban provenance made literal — locally grown indoors, blocks from the buyer; place-borrowing that signals the model, not just the mood" },
        { name: "Vital Farms", takeaway: "vital + farms: ethics (pasture-raised vitality) fused with the category word, certification claims echoing the name on every carton — value-word + category structure for premium commodity goods" },
      ],
      pitfalls: [
        "Stacking green/organic/natural: certification words aren't brand names — without the certificates they attract regulators, not customers",
        "Riding an origin name without building your own: the regional brand belongs to every neighbor; your repeat customers end up loyal to the place instead of you",
        "A name that outruns the cold chain: dawn-picked in the brand, wilted on arrival — in fresh food, bad reviews quote your name back as evidence",
        "Ignoring how shoppers search: buyers type category words (strawberries, eggs) into marketplace search — pick a name that pairs naturally with them; obscure spellings lose the shelf before the taste test",
      ],
    },
  },
  barber: {
    slug: "barber",
    tlds: [
      { tld: "com", zh: "本地搜索与地图入口的信任基线，连锁扩张不换名", en: "The trust baseline for local search and maps — no rename needed when you scale" },
      { tld: "studio", zh: "发型工作室的气质后缀，预约制高客单价定位直给", en: "Salon-studio energy — states the appointment-only, premium positioning outright" },
      { tld: "club", zh: "理发店的会员制与社群感，男士理容品牌尤其贴切", en: "Membership and clubhouse feel — especially apt for men's grooming brands" },
    ],
    zh: {
      label: "美发理容",
      title: "理发店/美发工作室怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "理发店/美发沙龙/男士理容品牌命名指南：手艺词根、场所感命名、熟客转述测试等 5 种思路，Toni&Guy/星客多/Rudy's 等案例拆解，推荐 TLD 与常见误区，并用 AI 猎取可注册的美发域名。",
      intro:
        "理发是半径五百米的生意，也是信任浓度极高的生意——客人把「接下来一个月的形象」交到你手里。名字的第一战场是地图与门头：本地搜索里能不能被找到、路过时能不能被记住，决定了新店的生死。第二个特点是「熟客经济」的命名逻辑：美发的复购靠发型师与客人的关系，名字要经得起「我一直在 X 剪」的长期转述——太潮的名字三年就过时，而客人与你的关系可能十年。第三是业态的光谱：快剪店要效率感与低决策成本，设计师沙龙要审美与格调，男士理容馆（barbershop）要复古与仪式感——三种业态的命名语言几乎不通用。最后别忘了发型师个人 IP 的时代背景：客人越来越多是先在短视频里认识发型师、再找到店，店名与发型师个人品牌要能互相成就而不是互相打架。",
      namingIdeas: [
        "手艺与工具词根：剪、修、theory、razor、fade、blade——工具与手法词自带专业暗示，男士理容尤其吃这一套（fade 渐变、razor 剃刀都是圈内暗号）",
        "场所感命名：Club、Parlor、工作室、小馆——把店命名成「一个想待着的地方」而不是「一次服务」，预约制与会员制的溢价从名字开始",
        "复古绅士路线：男士理容馆借用老式理发店的黄金时代意象（1920s、barber pole、老板名字 + Sons）——复古感即仪式感，支撑高客单价",
        "熟客转述测试：把名字放进「我一直在 X 剪头」念一遍——十年后这句话还自然吗？追热词的名字（如带当年流行语）会先于你的手艺过时",
        "发型师 IP 联动：店名要给发型师个人品牌留位置——「X 老师 @ 店名」的结构要顺口；若主打单一创始人，直接用人名 + 场所词（Rudy's 模式）最经得起时间",
      ],
      cases: [
        { name: "Toni&Guy", takeaway: "两位创始人兄弟的名字 + &：人名直给「手艺有人负责」，& 符号自带工坊传承感，从伦敦一家店走到全球连锁没换过名——人名命名在手艺行业的持久力证明" },
        { name: "星客多", takeaway: "「星客」（把顾客当明星）+「多」（快剪的高流转）：三个字同时说出体验承诺与商业模式，配合「不办卡」的定位反行业套路——快剪业态命名与模式互锁的范本" },
        { name: "Rudy's Barbershop", takeaway: "创始人名 + 品类词：Rudy's 的所有格结构像邻居家的店，barbershop 直给业态——从西雅图一家店到跨城连锁，「人名 + 品类」是社区生意最抗过时的公式" },
        { name: "Chatters", takeaway: "「闲聊」：把理发椅上的社交属性写进名字——剪发半小时的闲聊正是熟客关系的粘合剂；一个词说出行业里最真实的用户体验，亲切且无地域限制" },
      ],
      pitfalls: [
        "生造「高级感」英文名却拼不出：门头是本地生意的第一入口，路人念不出的名字连口碑转述的资格都没有",
        "追热词命名（当年流行语、网红梗）：美发是十年熟客生意，梗过时的速度远快于客人换发型师的速度",
        "「XX 造型」「XX 形象设计」的模糊定位：既不像快剪也不像沙龙，价格预期混乱，客人进门前就开始防备被推销",
        "忽略地图与点评平台的重名排查：同城同名的理发店会互相污染评分与口碑——开店前先在地图与点评平台搜一遍候选名",
      ],
    },
    en: {
      label: "Barbershops & salons",
      title: "How to Name a Barbershop or Hair Salon: Strategies, Cases & Domains",
      metaDescription:
        "Barbershop and hair salon naming guide: craft roots, place-based naming, the loyal-client test, breakdowns of Toni&Guy/Rudy's/Chatters, recommended TLDs and pitfalls — then hunt an available salon domain with AI.",
      intro:
        "A haircut is a 500-meter-radius business with an outsized trust transaction: the client hands you their appearance for the next month. The name's first battlefield is the map and the shopfront — being findable in local search and memorable to foot traffic decides whether a new shop survives. Second, this is a regulars economy: retention lives in the stylist–client relationship, so the name must survive years of \"I've been going to X forever\" — a too-trendy name expires in three years while the relationship can last ten. Third, the trade spans a spectrum: express cuts need efficiency and zero decision cost, designer salons need taste, barbershops need ritual and vintage gravity — the three naming languages barely overlap. Finally, the stylist-as-creator era changes the equation: clients increasingly discover the barber on short video before the shop — the shop name and the stylist's personal brand must lift each other, not compete.",
      namingIdeas: [
        "Cut with craft and tool roots: fade, blade, razor, shears, theory — technique words carry instant professional cred, and in men's grooming they double as insider passwords",
        "Name the place, not the service: Club, Parlor, Room, Studio — frame the shop as somewhere to be rather than something done to you; appointment-book and membership premiums start in the name",
        "Go heritage for barbershops: golden-age imagery — the barber pole era, \"& Sons\", a founder's name over the door — vintage is ritual, and ritual justifies the premium cut",
        "Run the loyal-client test: say \"I've been going to X for years\" — does it still sound natural a decade out? Names built on this year's slang expire faster than clients switch barbers",
        "Design for stylist personal brands: leave room for \"Alex @ X\" to roll off the tongue; if one founder is the draw, name + place word (the Rudy's pattern) is the most time-proof formula in the trade",
      ],
      cases: [
        { name: "Toni&Guy", takeaway: "Two founding brothers' first names joined by &: craftsmanship with people answering for it, the ampersand adding workshop heritage — one London shop to a global chain without ever renaming; proof of personal names' durability in craft trades" },
        { name: "Rudy's Barbershop", takeaway: "Founder's name + category word: the possessive reads like a neighbor's shop while barbershop states the trade — from one Seattle shop to a multi-city chain; name + category is the most obsolescence-proof formula for neighborhood businesses" },
        { name: "Chatters", takeaway: "Naming the chair-side chat: the half-hour of small talk is the real glue of the regulars economy — one word capturing the truest moment of the customer experience, warm and geography-free" },
        { name: "Great Clips", takeaway: "Plain adjective + the product: no mystery, no waitlist energy — pure efficiency signaling for walk-in express cuts; at the value end of the spectrum, instant comprehension is the whole brand" },
      ],
      pitfalls: [
        "An unpronounceable \"premium\" coinage over the door: the shopfront is a local business's first funnel — a name passers-by can't say forfeits word of mouth entirely",
        "Meme and slang naming: hair is a ten-year regulars trade; the joke expires long before your clients would have left",
        "Vague \"styling & image design\" positioning: neither express nor salon, so price expectations blur and clients walk in braced for the upsell",
        "Skipping the same-city duplicate check: identically named shops cross-contaminate each other's map ratings and reviews — search maps and review apps before signing the lease",
      ],
    },
  },
  yoga: {
    slug: "yoga",
    tlds: [
      { tld: "com", zh: "会员长期续费的信任基线，馆名印在会员卡上十年不换", en: "The trust baseline for long-term memberships — the name on the card for a decade" },
      { tld: "studio", zh: "「工作室」直给业态，小而美的精品馆定位一步到位", en: "States the studio format outright — instant boutique positioning" },
      { tld: "life", zh: "瑜伽卖的是生活方式，.life 把定位写进后缀", en: "Yoga sells a lifestyle — .life writes the positioning into the suffix" },
    ],
    zh: {
      label: "瑜伽普拉提",
      title: "瑜伽馆/普拉提工作室怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "瑜伽馆/普拉提工作室命名指南：身心词根、空间感命名、会员转述测试等 5 种思路，lululemon/Alo/梵音等案例拆解，推荐 TLD 与常见误区，并用 AI 猎取可注册的瑜伽域名。",
      intro:
        "瑜伽和普拉提卖的不是课程，是「一小时属于自己的状态」。名字的第一使命是把这份状态感提前发放：会员还没进馆，名字就该让人呼吸慢半拍。这个行业的命名有个独特的张力——既要有灵性（贴合瑜伽的身心传统），又不能玄到让普拉提器械课的用户觉得不专业；精品馆越来越强调「训练感」而非「疗愈感」，名字的气质定位直接筛选客群。第二个特点是会员制经济：瑜伽馆的收入靠年卡与续费，名字要经得起「我在 X 练了五年」的长期转述，追风潮的名字会先于会员关系过期。第三是私教与团课的口碑场景：小红书笔记、朋友圈打卡照、闺蜜间的口头推荐是获客主渠道，名字要在照片水印和口播里都好看好念。最后注意梵语词的使用边界：Namaste、Asana、Prana 这类词自带行业识别度，但也高度同质化——用梵语词根造新词，比直接用梵语词更容易独占。",
      namingIdeas: [
        "身心状态词根：息、流、栖、静、balance、flow、breathe——把练完瑜伽的身体感受写进名字；测试方法是深呼吸后念一遍，名字应该和呼气的节奏合拍",
        "空间感命名：小馆、Studio、Room、舍——瑜伽馆卖的是「一个想回去的空间」，场所词让年卡的归属感从名字开始",
        "梵语词根造词而非直用：从 prana（气息）、asana（体式）、om 等词根变形造词（如 Alo 源自 air/land/ocean 首字母），既保留行业识别又拿得到域名与商标",
        "训练感与疗愈感二选一：普拉提器械馆用 core、form、align 等精准词传递专业训练；疗愈系用软音节与自然意象——两种气质混搭会让客群定位模糊",
        "会员转述测试：把名字放进「我每周去 X 上三次课」念一遍——五年后这句话还自然吗？瑜伽是十年会员生意，名字要比风潮活得久",
      ],
      cases: [
        { name: "lululemon", takeaway: "刻意造的无意义词：创始人想要一个日本市场难以发音的名字制造「西方进口感」，三个 l 的视觉韵律意外成就了辨识度——证明瑜伽服饰命名可以完全脱离梵语套路" },
        { name: "Alo Yoga", takeaway: "air/land/ocean 三词首字母合成：三个字母装下整个自然意象，读音轻盈像一次呼气；配 Yoga 品类词直给行业——短造词 + 品类词的教科书结构" },
        { name: "梵音", takeaway: "「梵」（瑜伽的印度源流）+「音」（唱诵与静心）：两个字同时完成行业识别与意境营造，中文瑜伽馆命名里雅而不玄的平衡范本" },
        { name: "CorePower Yoga", takeaway: "core（核心力量）+ power：旗帜鲜明地把瑜伽往「训练」而非「疗愈」定位，健身人群零门槛理解——气质定位筛选客群的典型执行" },
      ],
      pitfalls: [
        "直接用 Namaste/Zen/Chakra 当名字：行业最高频词汇，同城重名率极高，地图搜索和商标注册都会撞车",
        "玄学浓度过高：「能量」「疗愈」「宇宙」堆叠会劝退只想练核心的普拉提用户，客群越练越窄",
        "中英文气质割裂：中文名走禅意、英文名走健身房风，会员卡和小红书笔记里同时出现时人设分裂",
        "忽略同城地图重名排查：瑜伽馆是三公里生意，同名馆互相污染点评评分——签约前先搜大众点评与地图",
      ],
    },
    en: {
      label: "Yoga & Pilates",
      title: "How to Name a Yoga or Pilates Studio: Strategies, Cases & Domains",
      metaDescription:
        "Yoga and Pilates studio naming guide: breath-and-balance roots, space-first naming, the member-retell test, breakdowns of lululemon/Alo/CorePower, recommended TLDs and pitfalls — then hunt an available yoga domain with AI.",
      intro:
        "A yoga or Pilates studio doesn't sell classes — it sells an hour of belonging to yourself. The name's first job is to issue that state in advance: before a member ever steps on a mat, the name should slow their breathing by half a beat. The trade has a peculiar naming tension: it needs enough spirit to honor yoga's tradition, but not so much mysticism that a reformer-Pilates client doubts your professionalism — boutique studios increasingly sell training, not healing, and the name's temperament filters the clientele. Second, this is a membership economy: revenue lives in annual passes and renewals, so the name must survive years of \"I've practiced at X since 2020\" — trend-surfing names expire faster than member relationships. Third, acquisition runs on Instagram posts, check-in photos and friend referrals: the name must look good in a photo watermark and sound good spoken between friends. Finally, mind the Sanskrit boundary: Namaste, Asana and Prana carry instant category recognition but are hopelessly crowded — coining from Sanskrit roots beats borrowing Sanskrit words whole.",
      namingIdeas: [
        "Root in body states: flow, breathe, balance, still, align — write the post-practice feeling into the name; test it by saying the name on an exhale — it should match the rhythm",
        "Name the space, not the service: Studio, Room, House, Nest — a studio sells a place worth returning to; place words start the annual-pass sense of belonging at the name",
        "Coin from Sanskrit, don't borrow it: mutate roots like prana, asana, om into ownable coinages (Alo compresses air/land/ocean) — you keep the category signal and can actually register the mark",
        "Pick training or healing, not both: reformer studios win with precision words (core, form, align); healing brands win with soft syllables and nature imagery — mixing the two blurs who the studio is for",
        "Run the member-retell test: say \"I take three classes a week at X\" — does it still sound natural in year five? Yoga is a ten-year membership trade; the name must outlive the trend cycle",
      ],
      cases: [
        { name: "lululemon", takeaway: "A deliberately meaningless coinage — the founder wanted a name hard to pronounce in Japanese to signal Western import; the triple-l visual rhythm became accidental brand equity. Proof yoga naming can skip Sanskrit entirely" },
        { name: "Alo Yoga", takeaway: "air/land/ocean compressed into three letters: an entire nature palette in one exhale-light syllable, with Yoga as the category word — the textbook short-coinage + category structure" },
        { name: "CorePower Yoga", takeaway: "core + power: plants the flag on training over healing, instantly legible to gym-goers — temperament-as-filter naming executed without apology" },
        { name: "Barry's", takeaway: "A founder's first name with a possessive: boutique fitness as a person's house style, not a franchise format — the pattern transfers directly to instructor-led Pilates studios" },
      ],
      pitfalls: [
        "Naming the studio Namaste/Zen/Chakra: the category's most-used words collide in map search and trademark registers in every city",
        "Overdosing on mysticism: stacking energy/healing/cosmic repels the reformer crowd who just want a stronger core — the clientele narrows with every incense word",
        "Splitting temperament across languages: a zen name in one language and a gym name in another reads as two brands on the same membership card",
        "Skipping the same-city duplicate check: studios are a 3-km-radius trade; identically named studios cross-contaminate reviews — search maps before signing the lease",
      ],
    },
  },
  vet: {
    slug: "vet",
    tlds: [
      { tld: "com", zh: "急诊时刻的搜索入口，宠物主慌乱中只信最熟的后缀", en: "The emergency-search default — panicked owners trust the most familiar suffix" },
      { tld: "center", zh: "「中心」的机构感承接转诊与重症，VCA 式体系命名的后缀版", en: "Institutional center energy built to receive referrals and critical cases — the VCA pattern as a suffix" },
      { tld: "pro", zh: "「持证专业」直写进后缀，中和宠物行业的玩具感", en: "Writes the licensed professional into the suffix — offsetting the pet industry's toy register" },
    ],
    zh: {
      label: "宠物医院",
      title: "宠物医院/动物诊所怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "宠物医院/动物诊所命名指南：安心词根、医者人名、深夜急诊测试等 5 种思路，Banfield/瑞鹏/VCA 等案例拆解，推荐 TLD 与常见误区，并用 AI 猎取可注册的宠物医疗域名。",
      intro:
        "宠物医院的名字要在两个极端场景里同时成立：日常疫苗时它是「楼下那家靠谱的医院」，深夜急诊时它是慌乱的主人在搜索框里打出的救命词。这决定了宠物医疗命名与宠物用品命名（详见宠物品牌指南）的根本分野——用品可以可爱俏皮，医院必须先专业后温暖：名字里的萌感一旦压过医疗感，主人在大病时会本能地换「更正规」的医院。第二个特点是「医生即品牌」：宠物医疗的信任最终落在具体的医生身上，人名 + 动物医院的结构（张医生动物医院）在社区口碑里最抗过时，连锁化时才需要品牌名接棒。第三是本地搜索的生死线：「附近的宠物医院」「24 小时宠物急诊」是行业最大流量入口，名字与招牌要让地图搜索和路过的主人都能瞬间归类。最后是情感的不对称：主人在这里经历过最揪心的夜晚，也经历过痊愈的喜悦——名字承载的情感浓度远超一般本地生意，轻浮的谐音梗在这里格外危险。",
      namingIdeas: [
        "安心词根优先：安、康、护、爱心、care、trust、haven——主人挂号时的心理状态是焦虑，名字先做情绪稳定剂；测试方法是想象凌晨两点在搜索框里打出这个名字",
        "医者人名结构：创始医生姓氏 + 动物医院（张医生宠物医院、Dr. X Vet）——「有具体的人为医术负责」是医疗信任的最强结构，社区口碑十年不衰",
        "专业词根建立医疗感：仁、济、维特（vet 音译）、pet hospital 而非 pet shop 系词汇——名字要先回答「这里是医院」，再谈温度",
        "萌感克制使用：爪、尾巴、毛孩子等元素可以出现在副标语与视觉里，主名保持医疗专业——大病托付的信任来自专业感而非可爱感",
        "急诊场景测试：把名字放进「快送 X 医院！」念一遍——紧急时刻喊得出、打得快、不会拼错的名字才配得上 24 小时急诊灯箱",
      ],
      cases: [
        { name: "Banfield", takeaway: "创始人 Warren J. Banfield 的姓氏：人名背书起家，随连锁化沉淀为品牌资产，如今是全美最大宠物医院网络——「医者人名 → 连锁品牌」路径的完整样本" },
        { name: "瑞鹏", takeaway: "「瑞」（吉祥安心）+「鹏」（规模与格局）：两个字既给主人吉利的心理暗示，又撑得起全国连锁的体量——中文宠物医疗命名里安心词根的规模化执行" },
        { name: "VCA", takeaway: "Veterinary Centers of America 缩写：机构感命名路线，用「中心」而非「小店」的姿态承接转诊与重症——缩写名冷但专业，适合以医疗深度为卖点的体系" },
        { name: "BluePearl", takeaway: "blue（冷静专业的医疗蓝）+ pearl（珍贵之物）：专做急诊与转诊重症，名字用色彩与珍宝意象说出「你最珍贵的家人在专业的手里」——情感与专业平衡的高分卷" },
      ],
      pitfalls: [
        "萌系谐音梗当主名（汪喵天堂类）：日常没问题，重症托付时刻主人会本能怀疑专业度——「天堂」在医院语境里更是致命歧义",
        "用 pet shop 系词汇命名医院：店与院一字之差，客单价与信任度天差地别，名字自降医疗等级",
        "忽略 24 小时急诊的搜索适配：招牌与线上名不一致（大众点评叫 A 门头叫 B），急诊主人找错门的代价是生命",
        "连锁前不查商标与域名：宠物医疗正处并购整合期，名字做大后发现被抢注，改名成本是所有行业里最伤口碑的",
      ],
    },
    en: {
      label: "Vet clinics",
      title: "How to Name a Veterinary Clinic or Animal Hospital: Strategies, Cases & Domains",
      metaDescription:
        "Veterinary clinic and animal hospital naming guide: reassurance roots, doctor-name structures, the midnight-emergency test, breakdowns of Banfield/VCA/BluePearl, recommended TLDs and pitfalls — then hunt an available vet domain with AI.",
      intro:
        "A vet clinic's name must work at two emotional extremes: at vaccine time it's \"the good clinic downstairs\", and at 2 a.m. it's the word a panicked owner types into a search box. That splits veterinary naming decisively from pet-brand naming (see the pet brands guide) — supplies can be adorable, but a hospital must be professional first, warm second: the moment cuteness outweighs clinical credibility, owners will instinctively switch to somewhere \"more serious\" when the diagnosis is bad. Second, the doctor is the brand: trust in veterinary care ultimately attaches to a specific clinician, so founder-name structures (Dr. Chen Animal Hospital) age best in neighborhood word of mouth, with a brand name taking over only at chain scale. Third, local search is the survival line: \"vet near me\" and \"24-hour pet emergency\" are the category's biggest funnels — the name and signage must classify you instantly for both the map algorithm and the owner rushing past. Finally, the emotional stakes are asymmetric: owners live their worst nights and best recoveries in your waiting room; a flippant pun carries more risk here than in almost any other local trade.",
      namingIdeas: [
        "Lead with reassurance roots: care, trust, haven, mercy, guardian — the owner's state at booking is anxiety, and the name is the first sedative; test each candidate by imagining typing it at 2 a.m.",
        "Use the doctor's name: founder surname + animal hospital (the Dr. X pattern) — a named human answering for the medicine is the strongest trust structure in healthcare, and it compounds for a decade in neighborhood referrals",
        "Establish the hospital register: hospital, clinic, veterinary — the name must first answer \"this is medicine, not retail\"; warmth comes after credibility",
        "Ration the cuteness: paws, tails and whiskers belong in the tagline and visuals, not the primary name — major-illness trust is built on competence signals, not charm",
        "Run the emergency test: say \"get her to X, now!\" out loud — a name that can be shouted, typed fast and never misspelled is the one that deserves the 24-hour lightbox",
      ],
      cases: [
        { name: "Banfield", takeaway: "Founder Warren J. Banfield's surname: personal accountability at the start, compounding into brand equity as it scaled into America's largest vet network — the complete doctor-name-to-chain-brand arc" },
        { name: "VCA", takeaway: "Veterinary Centers of America, abbreviated: institutional naming that positions centers over shops, built to receive referrals and critical cases — cold but credible; right for depth-of-medicine systems" },
        { name: "BluePearl", takeaway: "blue (calm clinical authority) + pearl (a treasured thing): emergency and specialty care whose name promises \"your most precious family member is in expert hands\" — the emotion-competence balance at its best" },
        { name: "Bond Vet", takeaway: "bond (the human-animal relationship) + the category word: names the reason owners come — the relationship, not the procedure — in one warm syllable; modern urban clinic naming done cleanly" },
      ],
      pitfalls: [
        "A cutesy pun as the primary name: fine at vaccine time, credibility poison at diagnosis time — and anything echoing \"heaven\" is a fatal ambiguity on a hospital sign",
        "Retail-register words (pet shop, pet store) on a medical business: one word's difference collapses the trust and price positioning the clinic depends on",
        "Mismatched names across map, reviews and signage: an emergency owner who finds the wrong door pays the highest price imaginable — audit every listing",
        "Skipping trademark and domain clearance before scaling: veterinary care is consolidating fast; renaming a beloved clinic mid-growth burns more goodwill than in any other trade",
      ],
    },
  },
  esports: {
    slug: "esports",
    tlds: [
      { tld: "gg", zh: "电竞的原生问候语（good game），圈内识别度即品牌资产", en: "The native salute of gaming (good game) — insider recognition as brand equity" },
      { tld: "com", zh: "商务合作与赞助商尽调的信任门面，俱乐部化必备", en: "The trust front for sponsors and business development — essential at club scale" },
      { tld: "team", zh: "「战队」直写进后缀，招募页与粉丝站零解释", en: "Writes the squad into the suffix — zero explanation on recruiting and fan pages" },
    ],
    zh: {
      label: "电竞战队",
      title: "电竞战队/电竞俱乐部怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "电竞战队/电竞俱乐部命名指南：战意词根、缩写设计、解说喊名测试等 5 种思路，T1/EDG/Fnatic 等案例拆解，推荐 TLD 与常见误区，并用 AI 猎取可注册的电竞域名。",
      intro:
        "电竞战队的名字生存在三个高压场景里：解说在决胜团战时的嘶吼、比分牌上的 2–4 个字母缩写、以及粉丝弹幕里的刷屏应援。这决定了电竞命名的第一铁律——名字与缩写必须同时设计：EDG、T1、G2 这些缩写本身就是品牌，全称反而少有人念全。第二个特点是「战意与人格」的平衡：名字要有攻击性与胜负欲（粉丝要能喊得热血），但纯凶狠词已经通货膨胀，顶级俱乐部越来越像潮牌——Fnatic 卖卫衣、T1 做内容，名字要撑得起队服印花与联名周边。第三是全球赛场的适配：国际赛事解说来自各个语种，名字要在英语解说嘴里不变形、在中文弹幕里有昵称空间（「厂长」「阿水」式的人物昵称文化同样作用于队名）。最后是资本视角：电竞俱乐部的终局是体育经纪与内容公司，名字要经得起从「网吧五连坐」到「上市公司财报」的十年跨度，梗名与游戏版本词会最先过时。",
      namingIdeas: [
        "战意词根：锋、刃、焰、Fury、Strike、Titan——胜负欲是电竞的母语，但要在凶狠词之上叠加独特性（Fnatic = fanatic 变形），纯 Killer/Dragon 类已严重同质化",
        "缩写先行设计：先定 2–3 个字母的缩写（比分牌与弹幕的实际载体），再反推全称——EDG（Edward Gaming）、RNG（Royal Never Give Up）都是缩写比全称更有名的正面案例",
        "喊名测试：把名字放进解说词「X 拿下这一局！」和粉丝应援「X 加油！」里喊三遍——爆破音开头、两音节以内的名字在嘶吼场景里最响亮",
        "潮牌气质预留：名字要能印在队服、卫衣与外设联名上好看——字母组合的视觉对称性（G2、T1 的字母+数字结构）本身就是设计资产",
        "跨语种适配：国际赛场解说来自多语种，避开 th、r/l 混淆等发音陷阱；同时给中文粉丝留昵称空间——能被亲切化的名字才有弹幕生命力",
      ],
      cases: [
        { name: "T1", takeaway: "SK Telecom T1 简化而来：一个字母一个数字，比分牌上的极简暴力美学，Faker 王朝让 T1 两个字符承载了整个电竞史的重量——「缩写即品牌」的终极形态" },
        { name: "EDG", takeaway: "Edward Gaming 缩写：创始人英文名 + Gaming 的朴素结构，但 EDG 三个字母经 S11 夺冠一夜封神——证明缩写的品牌价值由战绩注入，名字只需好喊不出错" },
        { name: "Fnatic", takeaway: "fanatic（狂热者）删一个字母：把粉丝的狂热写进队名又完全独占，橙黑视觉 + 潮牌化运营让它成为欧洲电竞的文化符号——变形造词在电竞的教科书执行" },
        { name: "Royal Never Give Up", takeaway: "皇族（Royal）血统 + Never Give Up 的叙事重生：全称是一句战斗宣言，缩写 RNG 又暗合游戏术语（随机数）自带话题——全称讲故事、缩写造梗的双层设计" },
      ],
      pitfalls: [
        "梗名与版本词命名：当年的热梗three年后就是「时代的眼泪」，俱乐部化、招商时更显儿戏",
        "缩写撞车不排查：电竞缩写空间极挤（三字母组合有限），撞上已有强队等于永远活在别人阴影里——定名前先查各大赛事数据库",
        "只顾凶狠不留潮牌空间：Killer/Blood 系名字印在联名卫衣上像盗版货，错失电竞俱乐部最大的衍生收入",
        "忽略 .gg 与社交账号统一：电竞粉丝的入口是 Twitter/Twitch/B 站，@ 名与域名拿不齐会被假号截流——官宣前一次性锁齐",
      ],
    },
    en: {
      label: "Esports teams",
      title: "How to Name an Esports Team or Gaming Org: Strategies, Cases & Domains",
      metaDescription:
        "Esports team and gaming org naming guide: battle roots, abbreviation-first design, the caster-scream test, breakdowns of T1/Fnatic/G2, recommended TLDs and pitfalls — then hunt an available esports domain with AI.",
      intro:
        "An esports team name lives in three high-pressure venues: a caster's scream during the deciding teamfight, a 2–4 letter tag on the scoreboard, and fan spam scrolling up the chat. That dictates the first iron law of esports naming: design the name and the tag together — EDG, T1 and G2 are brands as abbreviations; almost nobody says the full name. Second, balance aggression with personality: the name needs fight (fans must be able to scream it), but pure menace is inflated currency — top orgs now behave like streetwear labels, and Fnatic sells more hoodies than tickets, so the name must look right on a jersey print and a collab drop. Third, the stage is global: casters speak every language, so the name must survive non-native pronunciation and leave room for fan nicknames — chat culture affectionately mutates names, and a name that can't be nicknamed has no chat life. Finally, think like the cap table: the endgame of an esports org is a sports-and-content company, and the name must stretch from five friends in a LAN café to an earnings report — meme names and game-patch vocabulary expire first.",
      namingIdeas: [
        "Draw from battle roots: blade, fury, titan, strike, ember — competitive hunger is the category's native tongue, but stack distinctiveness on top (Fnatic mutates fanatic); plain Killer/Dragon combos are exhausted",
        "Design the tag first: lock the 2–3 letter abbreviation (the scoreboard's and chat's actual payload), then reverse-engineer the full name — EDG and RNG are both more famous as tags than as full names",
        "Run the caster-scream test: shout \"X takes the series!\" three times — plosive openings and two syllables or fewer carry best at full volume",
        "Reserve streetwear headroom: the name must look good foil-printed on a jersey and a collab hoodie — letter-number symmetry (G2, T1) is a design asset in itself",
        "Clear it across languages: avoid th-sounds and r/l ambiguity for international casters, and leave nickname room for fan communities — affectionate mutations are free marketing",
      ],
      cases: [
        { name: "T1", takeaway: "Distilled from SK Telecom T1: one letter, one digit — scoreboard minimalism at its most brutal, and the Faker dynasty loaded two characters with the weight of esports history. The terminal form of tag-as-brand" },
        { name: "Fnatic", takeaway: "fanatic minus one letter: fan devotion written into the team name yet fully ownable, with orange-black visuals and streetwear operations making it a European esports icon — mutation coinage executed to textbook standard" },
        { name: "G2 Esports", takeaway: "Gamers2 compressed to G2: letter-plus-digit symmetry that prints beautifully, plus an owner whose personal brand fuels the org's content engine — proof the tag and the personality are the product" },
        { name: "Royal Never Give Up", takeaway: "A dynasty word (Royal) reborn through a battle vow (Never Give Up): the full name is a narrative, while the tag RNG doubles as gaming slang for randomness — story in the long form, meme energy in the short" },
      ],
      pitfalls: [
        "Meme and patch-note naming: this season's joke is next era's cringe — and it reads amateur in every sponsorship deck",
        "Skipping the tag-collision sweep: three-letter space is brutally crowded; colliding with an established org means living in their shadow forever — search league databases before announcing",
        "All menace, no merch: Blood/Killer-tier names look like bootlegs on a collab hoodie, forfeiting the org's biggest revenue line",
        "Fragmented handles: fans arrive via Twitter, Twitch and YouTube — announce only after locking the matching @handles and the .gg, or impostor accounts will farm your hype",
      ],
    },
  },
  drone: {
    slug: "drone",
    tlds: [
      { tld: "com", zh: "商业航拍接单与企业客户尽调的信任基线", en: "The trust baseline for commercial gigs and enterprise client vetting" },
      { tld: "studio", zh: "航拍工作室的作品集气质，创意服务定位直给", en: "Portfolio energy for aerial studios — states the creative-service positioning" },
      { tld: "pro", zh: "「专业飞手」一词入后缀，资质与保险齐备的暗示", en: "Writes the professional pilot into the suffix — implies licenses and insurance in order" },
    ],
    zh: {
      label: "无人机航拍",
      title: "无人机航拍/飞行服务怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "无人机航拍工作室/飞行服务命名指南：视角词根、飞行意象、片尾署名测试等 5 种思路，DJI/Skydio/星图等案例拆解，推荐 TLD 与常见误区，并用 AI 猎取可注册的航拍域名。",
      intro:
        "无人机行业的名字横跨两种生意：一头是航拍工作室与飞行服务（婚礼跟拍、地产航拍、影视航拍、巡检测绘），另一头是飞行硬件与软件品牌。两者的共同命名资产是「上帝视角」——人类对俯瞰视角的本能迷恋是这个行业最大的意象库：天空、云端、鹰眼、掠过、之上，名字只要唤起「从未见过的角度」，就赢了第一步。服务型工作室的名字要通过「片尾署名测试」：航拍作品的传播场景是视频片尾字幕、婚礼成片角标和甲方 PPT 的素材来源栏，名字要在这些地方专业且好认。第二个行业特性是资质与信任：低空经济监管趋严，商业飞行需要执照、空域报备与保险，名字带出「持证专业」的暗示（而非玩具感）直接影响企业客户的询价意愿。第三是技术演进的赌注：无人机正在从「会飞的相机」变成「低空机器人」，巡检、物流、测绘的想象空间比婚礼航拍大得多——名字锁死「拍摄」一个场景，转型时就会打脸自己。",
      namingIdeas: [
        "视角词根：瞰、临、之上、aerial、above、vista——「从没见过的角度看世界」是行业的情感内核，视角词让客户瞬间脑补出画面",
        "飞行动词与意象：掠、翔、悬停、soar、glide、hover——动词自带运动画面，配合作品集网站的开屏航拍视频，名字与内容互相成就",
        "片尾署名测试：把名字放进「航拍：X 工作室」的片尾字幕与成片角标里看三秒——在小字号里依然清晰专业的名字才配得上传播场景",
        "专业感压过玩具感：企业巡检、测绘、影视订单的决策人要看到「持证、保险、流程」的暗示——避开 toy、fun 系词汇，用 aero、flight、systems 等词根建立工程感",
        "给「低空机器人」留门：名字别锁死「拍摄」——用飞行与空间词而非相机词命名，巡检/物流/测绘的转型空间就都在（DJI 的「大疆创新」从未提拍摄）",
      ],
      cases: [
        { name: "DJI 大疆", takeaway: "「大疆」取自「大疆无垠」：中文名格局辽阔且不锁定任何品类，英文 DJI 三字母工程感十足——双语各司其职，从航模配件走到全球无人机霸主没改过名，命名留白的最佳证明" },
        { name: "Skydio", takeaway: "sky + studio 的融合造词：天空即工作室，一个词说清「自主飞行的影像工具」；-io 尾缀带科技感，AI 自主飞行的定位与名字的合成感互相印证" },
        { name: "Zipline", takeaway: "「滑索」：借一个既有的高速运输意象命名无人机物流——不提无人机、不提飞行，只说「东西嗖地送到」；用结果而非技术命名的典范" },
        { name: "Parrot", takeaway: "「鹦鹉」：会飞、聪明、亲人的鸟类意象，把无人机从军工语境拉进消费客厅——动物隐喻降低品类的技术门槛，消费级定位从名字开始" },
      ],
      pitfalls: [
        "名字里塞 drone 加通用词（DronePro、BestDrone 类）：全球几万家同行同一个套路，搜索与商标都挤不进去",
        "玩具感词汇接商业订单：fun/toy 系名字让巡检与测绘的企业采购直接跳过——低空经济的钱在 B 端，名字先要过尽调那关",
        "锁死「拍摄」场景：aerial photo 系名字在转向巡检物流时自我设限，行业正处品类扩张期，名字要比当前业务大一号",
        "忽略资质暗示与重名排查：商业飞行要执照报备，名字与持证主体不一致会在投标时添麻烦；同城航拍工作室重名也会互抢作品署名",
      ],
    },
    en: {
      label: "Drone & aerial",
      title: "How to Name a Drone or Aerial Services Brand: Strategies, Cases & Domains",
      metaDescription:
        "Drone services and aerial photography naming guide: vantage-point roots, flight imagery, the end-credits test, breakdowns of DJI/Skydio/Zipline, recommended TLDs and pitfalls — then hunt an available drone domain with AI.",
      intro:
        "Drone-industry names straddle two businesses: aerial service studios (weddings, real estate, film work, inspection and mapping) on one side, and flight hardware or software brands on the other. Their shared naming asset is the god's-eye view — humanity's instinctive love of looking down from above is the category's richest image bank: sky, summit, hawk, sweep, above. A name that evokes \"an angle you've never seen\" wins the first frame. Service studios must pass the end-credits test: aerial work travels as a caption in video credits, a corner watermark on wedding films, and a source line in a client's deck — the name must stay crisp and professional at small font sizes. Second, this is a licensed trade: low-altitude regulation is tightening, and commercial flight means certificates, airspace filings and insurance — a name that implies \"licensed professional\" rather than \"expensive toy\" directly moves enterprise inquiry rates. Third, place your bet on where the category is going: drones are evolving from flying cameras into low-altitude robots, and inspection, logistics and mapping dwarf wedding shoots — a name locked to \"photo\" will contradict your own pivot.",
      namingIdeas: [
        "Root in the vantage point: aerial, above, vista, summit, overlook — the emotional core of the trade is seeing the world from an impossible angle; vantage words make clients picture the shot instantly",
        "Fly with verbs and flight imagery: soar, glide, hover, sweep — motion verbs carry the showreel's energy into the name; the portfolio's opening drone shot and the name reinforce each other",
        "Run the end-credits test: set the name in \"Aerial: X Studio\" at credits size for three seconds — if it stays legible and professional in small type, it earns the distribution the work gets",
        "Let competence outweigh cuteness: inspection, mapping and film buyers scan for licenses, insurance and process — skip toy/fun vocabulary and build engineering register with roots like aero, flight, systems",
        "Leave the robot door open: name with flight and space words, not camera words — inspection, delivery and mapping stay reachable (DJI's name never mentions photography at all)",
      ],
      cases: [
        { name: "DJI", takeaway: "From the Chinese for \"boundless frontiers\": vast in scope, locked to no category, with the three-letter DJI adding engineering crispness — from hobby parts to global dominance without a rename; the definitive proof of naming headroom" },
        { name: "Skydio", takeaway: "sky + studio fused into one coinage: the sky as your studio, autonomy as the product; the -io ending adds tech register that matches the AI-pilot positioning — blend naming with the story built in" },
        { name: "Zipline", takeaway: "An existing fast-transit image borrowed for drone logistics: no drone, no flight, just \"things arrive in a whoosh\" — naming the outcome instead of the technology at its very best" },
        { name: "Parrot", takeaway: "A bird that flies, thinks and lives with people: the animal metaphor pulled drones out of military register and into the living room — consumer positioning that starts at the name" },
      ],
      pitfalls: [
        "drone + generic word (DronePro, BestDrone): tens of thousands of peers run the same formula — unwinnable in search and unregistrable as a mark",
        "Toy-register names chasing enterprise work: inspection and mapping procurement filters out anything that sounds like a gadget — B2B money requires a name that survives vendor due diligence",
        "Locking onto photography: aerial-photo names self-limit exactly as the category expands into inspection and delivery — name one size bigger than today's business",
        "Skipping license alignment and duplicate checks: commercial flight runs on certificates filed under a legal name — mismatches complicate bids, and same-city studio name clashes contaminate portfolio credits",
      ],
    },
  },
  hanfu: {
    slug: "hanfu",
    tlds: [
      { tld: "com", zh: "从淘宝店走向独立品牌站的必经门面，出海汉服尤其需要", en: "The storefront for graduating from marketplace shop to standalone brand — essential for hanfu going global" },
      { tld: "shop", zh: "国潮电商直给的店铺入口，年轻客群零违和", en: "A straight-shot store entrance for guochao e-commerce — native to young shoppers" },
      { tld: "art", zh: "把「东方美学」写进后缀，高定与文化品牌的气质延伸", en: "Writes the aesthetic into the suffix — a natural extension for couture and culture brands" },
    ],
    zh: {
      label: "汉服国潮",
      title: "汉服/国潮品牌怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "汉服/国潮品牌命名指南：古典词重组、诗词化用、出圈度平衡等 5 种思路，花西子/织造司/十三余等案例拆解，推荐 TLD 与常见误区，并用 AI 猎取可注册的国潮域名。",
      intro:
        "汉服与国潮的命名是一场「古今平衡术」：名字太白话就丢了文化纵深（客人买的正是那份古意），太古奥又出不了圈（生僻字连输入法都打不出来，怎么在直播间刷弹幕？）。这个行业最独特的命名资产是五千年的公版词库——诗词、典籍、织造术语、地名官署都可化用，但也正因人人都在翻《诗经》，「云想」「锦绣」「山河」系词汇已高度拥挤，好名字要在古典词库里找到还没被用滥的角落。第二个特点是圈层与出圈的双重身份：核心同袍（汉服爱好者）看重形制考据与文化诚意，泛国潮消费者要的是「上身好看、拍照好发」——名字要让圈内人觉得懂行、圈外人觉得好念。第三是内容平台的传播介质：汉服品牌的主战场在抖音、小红书与直播间，名字要经得起主播口播、话题标签与评论区@，四字以内、无生僻字是硬约束。最后是出海的新变量：汉服正在成为文化出口品类，名字的拼音形态是否好读、是否有对应英文表达，决定了海外站与 TikTok 的传播上限。",
      namingIdeas: [
        "古典词重组：从织造、色彩、节气词库里取词重新组合（织造司 = 织造 + 官署名）——比直接用「锦绣」「霓裳」等高频词更独占，古意反而更足",
        "诗词化用而非照搬：取诗句中的两三字重组（十三余出自「娉娉袅袅十三余」）——既有出处可讲，又不会和照搬全词的同行撞车；品牌故事页自带内容",
        "传统色与织物词根：月白、黛、缃、罗、绮、缂——传统色谱与织物名是审美浓度最高且相对未被用滥的词库，天然适配产品视觉体系",
        "出圈度测试：名字让完全不懂汉服的朋友念一遍、打一遍字——念不顺、打不出的名字在直播间和话题标签里传播断链；生僻字的文化感抵不过传播损耗",
        "拼音形态预检：出海与注册域名都靠拼音——四声连读是否顺口、拼音是否与不雅英文词撞车、TikTok 主播能否读对，定名前逐项过一遍",
      ],
      cases: [
        { name: "花西子", takeaway: "「花」（东方美学意象）+「西子」（西湖与美人典故）：三个字有出处、有画面、好念好打，英文 Florasis（flora + oasis）同样雅致——国潮命名双语齐备的天花板" },
        { name: "织造司", takeaway: "明清官营织造机构名的挪用：「司」字自带皇家工坊的品质暗示，行业词 + 官署词的结构既考据又独占——古典公版词库里找冷门角落的教科书案例" },
        { name: "十三余", takeaway: "化用杜牧「娉娉袅袅十三余」：三个字装下少女感与诗词出处，品牌故事从定名那天就写好了——诗词化用而非照搬的范本" },
        { name: "重回汉唐", takeaway: "四个字直陈品牌使命：汉唐盛世的服章之美值得重回——宣言式命名在同袍社群里情感动员力极强，证明圈层品牌可以用价值观直接命名" },
      ],
      pitfalls: [
        "堆砌高频古风词（云想、锦绣、山河系）：古风词库的头部词汇已严重同质化，混在同行里像白牌",
        "生僻字当卖点：「䌽」「黼」类字文化浓度再高，输入法打不出就等于放弃了话题标签、弹幕与口碑转述的全部传播链",
        "只有中文名没有拼音/英文预案：出海站、域名与商标都需要拉丁形态，事后补救常发现拼音域名早被抢注",
        "形制考据与名字气质错位：名字号称「正统形制」产品却是汉元素改良——同袍社群的考据审判会让名字成为反噬的靶子",
      ],
    },
    en: {
      label: "Hanfu & guochao",
      title: "How to Name a Hanfu or Guochao Brand: Strategies, Cases & Domains",
      metaDescription:
        "Hanfu and China-chic (guochao) brand naming guide: classical-word remixing, poetry-drawn names, the crossover test, breakdowns of Florasis/Shisanyu, recommended TLDs and pitfalls — then hunt an available brand domain with AI.",
      intro:
        "Naming a hanfu or guochao brand is a balancing act across centuries: too plain and the name loses the cultural depth customers are actually buying; too archaic and it can't cross over — a character nobody can type kills the hashtag before it starts. The category's singular naming asset is a five-thousand-year public-domain lexicon: poetry, classics, weaving terminology, imperial place and office names are all fair game. But precisely because everyone is mining the same anthologies, the front-page words (clouds, brocade, mountains-and-rivers) are exhausted — great names come from the unmined corners of the classical corpus. Second, the brand lives a double life: core hanfu devotees judge historical fidelity and cultural sincerity, while mainstream guochao shoppers want \"looks great, posts well\" — the name must read as erudite to insiders and effortless to outsiders. Third, the medium is short video and livestream: the name must survive a host's rapid-fire pronunciation, a hashtag, and comment-section mentions — four characters max, no rare characters, non-negotiable. Finally, hanfu is becoming a cultural export: whether the romanized form reads smoothly and an English rendering exists sets the ceiling for the overseas site and TikTok reach.",
      namingIdeas: [
        "Remix the classical lexicon: recombine words from weaving, color and solar-term vocabularies rather than borrowing whole famous phrases — a workshop-and-office compound reads more authentic and is far more ownable than another \"Brocade\" brand",
        "Draw from poetry, don't transcribe it: lift two or three characters from a verse and recombine (Shisanyu compresses a Du Mu line) — you keep the literary provenance for the brand-story page without colliding with everyone quoting the same couplet",
        "Mine traditional colors and textiles: moon-white, indigo-black, gauze, damask — the traditional color spectrum and fabric names are the highest-aesthetic, least-exhausted corner of the corpus, and they map straight onto product visuals",
        "Run the crossover test: have a friend who knows nothing about hanfu say and type the name — if it stumbles on the tongue or the keyboard, the livestream chat and hashtag chain break; rare-character erudition never outweighs transmission loss",
        "Pre-clear the romanized form: the overseas site, domain and trademark all ride on pinyin — check the tonal flow, screen for unfortunate English collisions, and confirm a TikTok host can say it right before committing",
      ],
      cases: [
        { name: "Florasis (花西子)", takeaway: "Three characters carrying flora imagery and a West Lake allusion, paired with Florasis (flora + oasis) in English — provenance, picture and pronounceability in both languages; the ceiling of bilingual guochao naming" },
        { name: "织造司 (Weaving Bureau)", takeaway: "An imperial weaving-office title repurposed as a brand: the bureaucratic suffix implies royal-workshop quality, trade word + office word reading both scholarly and ownable — the textbook find in the classical corpus's cold corners" },
        { name: "十三余 (Shisanyu)", takeaway: "Compressed from a Du Mu verse about a girl of thirteen: girlhood and literary provenance in three characters, the brand story written on naming day — adaptation over transcription, done right" },
        { name: "重回汉唐 (Return to Han & Tang)", takeaway: "A four-character mission statement: the sartorial glory of the Han and Tang deserves a return — manifesto naming with enormous emotional pull inside the devotee community; proof a community brand can name its values outright" },
      ],
      pitfalls: [
        "Stacking front-page archaic words (clouds/brocade/rivers): the classical lexicon's greatest hits are saturated — the name disappears into the marketplace like an unbranded listing",
        "Rare characters as a badge of depth: a glyph the input method can't produce forfeits hashtags, chat and word of mouth in one stroke — the entire distribution chain snaps at the keyboard",
        "No romanized plan: the overseas site, domain and mark all need a Latin form — brands that defer it routinely find the pinyin domain already squatted",
        "Fidelity mismatch: a name claiming orthodox authenticity on modernized hanfu-element clothing invites the devotee community's citation tribunal — the name becomes the target of the backlash",
      ],
    },
  },
  dental: {
    slug: "dental",
    tlds: [
      { tld: "com", zh: "高客单医疗决策的信任基线，家庭牙医十年不换名", en: "The trust baseline for high-ticket medical decisions — a family dentist's name for a decade" },
      { tld: "studio", zh: "美学牙科与 tend 式生活方式诊所的气质后缀", en: "The temperament suffix for aesthetic dentistry and tend-style lifestyle clinics" },
      { tld: "pro", zh: "「专业执业」写进后缀，数万元种植决策的信任加分", en: "Writes professional practice into the suffix — a trust bonus for five-figure implant decisions" },
    ],
    zh: {
      label: "口腔诊所",
      title: "口腔诊所/牙科品牌怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "口腔诊所/牙科品牌命名指南：安心词根、微笑意象、恐惧中和测试等 5 种思路，瑞尔/通策/tend 等案例拆解，推荐 TLD 与常见误区，并用 AI 猎取可注册的口腔域名。",
      intro:
        "牙科命名的头号对手不是同行，是恐惧——多数人对牙科的默认情绪是「怕」，名字是患者接触诊所的第一针麻药。这决定了口腔命名的核心策略：用安心与微笑意象中和钻头与疼痛的联想，「让人想笑」比「让人敬畏」更值钱。第二个特点是客单价的双轨制：基础诊疗靠医保与社区信任，种植正畸动辄数万靠专业权威——名字要同时接住「楼下洗牙」的亲切与「十万种植」的郑重，这也是家庭牙科与专科机构命名分野的根源。第三是「医生即品牌」的行业底色：牙科的复购与转介绍高度绑定具体医生，人名 + 口腔的结构在社区里最稳；连锁化后品牌名接棒，但要给医生个人 IP 留位置。最后是正畸与美学牙科的消费化趋势：隐形矫正把牙科从「治病」拉进「变美」，这一侧的命名语言更靠近消费品牌——smile 系词汇的走红正是牙科命名消费化的信号。",
      namingIdeas: [
        "微笑与安心词根：笑、悦、皓、smile、bright、gentle——把治疗结果（自信的笑容）而非治疗过程写进名字，恐惧中和从第一印象开始",
        "恐惧中和测试：把名字放进「明天要去 X 看牙」念一遍——如果这句话听起来让人放松而非紧张，名字就完成了第一疗程；钻、切、锐利系字眼一票否决",
        "医生人名结构：创始医生姓氏 + 口腔（李医生口腔）——牙科转介绍的信任落点是具体的人，人名结构在社区口碑里复利最高；连锁预期强再上品牌名",
        "双轨气质选边：家庭全科用亲切词（家、邻、悦），种植正畸专科用权威词（雅、瑞、专研感）——数万元的种植决策需要名字先立住专业人设",
        "美学侧消费化命名：隐形矫正与美白业务可以用消费品牌逻辑起名（tend、Candid 式的日常词）——把「看牙」重构成「变美的例行仪式」，名字先改变叙事",
      ],
      cases: [
        { name: "瑞尔齿科", takeaway: "「瑞」（安心吉祥）+「尔」（亲切的你）：两个字把高端定位说得温和不倨傲，Arrail 的英文形态同步立住涉外客群——中文牙科连锁命名安心词根的标杆" },
        { name: "tend", takeaway: "「照料」一词小写呈现：把牙科从医疗语境拉进生活方式语境，配合水疗风门店设计重构「看牙体验」——动词命名 + 视觉一体化的牙科消费化范本" },
        { name: "SmileDirectClub", takeaway: "smile + direct + club 三词直陈模式：结果（微笑）+ 渠道（直达）+ 归属（俱乐部），DTC 正畸的商业模式全写在名字里——功能命名在消费医疗的极致执行" },
        { name: "美奥口腔", takeaway: "「美」（美学牙科定位）+「奥」（深奥专业）：两个字同时按下变美与权威两个按钮，匹配种植正畸的高客单决策——双轨气质在一个名字里的平衡样本" },
      ],
      pitfalls: [
        "器械与疼痛联想入名（钻、快、锐系）：牙科命名的头号大忌，名字先把患者吓跑一半",
        "过度承诺疗效（「无痛」「立得」入名）：医疗广告法的雷区，监管处罚之外，一次疼痛体验就让名字变成差评证词",
        "家庭全科用奢侈品腔调命名：社区牙科的信任来自亲切与医保友好，名字太贵气会让洗牙客人担心被推销种植",
        "忽略医生 IP 与诊所名的关系：主诊医生离开后名字还成立吗？人名结构要配股权与合约设计，否则口碑资产随人流失",
      ],
    },
    en: {
      label: "Dental clinics",
      title: "How to Name a Dental Clinic or Oral Care Brand: Strategies, Cases & Domains",
      metaDescription:
        "Dental clinic and orthodontics naming guide: smile-and-calm roots, fear-neutralizing tests, doctor-name structures, breakdowns of tend/SmileDirectClub, recommended TLDs and pitfalls — then hunt an available dental domain with AI.",
      intro:
        "Dental naming's chief opponent isn't the competition — it's fear. Most people's default emotion toward dentistry is dread, and the name is the first anesthetic a patient encounters. That sets the core strategy: neutralize the drill-and-pain association with smile and calm imagery — a name that makes people want to smile beats one that commands respect. Second, the economics run on two tracks: routine care rides on neighborhood trust and insurance, while implants and orthodontics are five-figure decisions that ride on authority — the name must hold both the warmth of a downstairs cleaning and the gravity of a $10,000 implant, which is exactly where family-practice and specialist naming diverge. Third, the dentist is the brand: repeat visits and referrals attach to a specific clinician, so doctor-name structures compound best in a community, with a brand name taking over at chain scale — but always leaving room for the doctor's personal reputation. Finally, aligners and aesthetic dentistry are consumerizing the category: invisible orthodontics reframed dental care from treatment to self-improvement, and that side of the business names like a consumer brand — the boom in smile-words is the clearest signal.",
      namingIdeas: [
        "Root in smiles and calm: smile, bright, gentle, glow — name the outcome (a confident smile), never the procedure; fear neutralization starts at first impression",
        "Run the fear test: say \"I'm going to X tomorrow for my tooth\" — if the sentence relaxes rather than tightens, the name has done its first treatment; anything echoing drills, cutting or sharpness is an automatic veto",
        "Use the doctor's name: founder surname + dental (the Dr. X pattern) — referral trust in dentistry lands on a person, and name structures compound for years in local word of mouth; layer a brand name only when chain ambitions are real",
        "Pick your track: family practices win with warm, neighborly words; implant and orthodontic specialists need authority register — a five-figure implant decision requires the name to establish expertise before the consult",
        "Consumerize the aesthetic side: aligner and whitening lines can name like consumer brands (tend, Candid — everyday lowercase words) — reframing the visit as a self-care ritual starts with the name changing the narrative",
      ],
      cases: [
        { name: "tend", takeaway: "The verb \"to tend\", set in lowercase: dentistry pulled from medical register into lifestyle register, with spa-like studios completing the reframe — verb naming plus visual identity as one system; the benchmark of consumerized dental" },
        { name: "SmileDirectClub", takeaway: "smile + direct + club: outcome, channel and belonging — the entire DTC aligner business model written into one name; functional naming at its most literal, and it worked at category-creation scale" },
        { name: "Candid", takeaway: "\"Honest\" and \"a candid smile\" in one word: the double meaning covers both the transparent-pricing pitch and the product's result — a dictionary word whose ambiguity is the strategy" },
        { name: "Aspen Dental", takeaway: "A calm nature word + the category: aspen carries clean mountain-air associations with zero dental fear baggage, scaling across hundreds of locations without localization problems — nature-word + category as the chain-safe formula" },
      ],
      pitfalls: [
        "Instrument and pain echoes (drill/sharp/fast roots): the cardinal sin of dental naming — the name scares off half the patients before the first call",
        "Promising outcomes in the name (painless, instant): a regulatory minefield in medical advertising — and one painful visit turns the name into review-section evidence",
        "Luxury register on a family practice: neighborhood dentistry trusts warm and insurance-friendly; a name that sounds expensive makes cleaning patients brace for an implant upsell",
        "Ignoring the doctor-name dependency: does the name survive the lead dentist leaving? Personal-name structures need matching equity and contract design, or the goodwill walks out the door",
      ],
    },
  },
  accounting: {
    slug: "accounting",
    tlds: [
      { tld: "com", zh: "财税服务的信任基线，企业客户与银行尽调都默认查它", en: "The trust baseline for financial services — corporate clients and bank due diligence check it by default" },
      { tld: "tax", zh: "行业词直接写进后缀，税务专项服务零解释成本", en: "The industry word in the suffix itself — zero explanation for tax-focused practices" },
      { tld: "pro", zh: "「持证执业」的气质后缀，注册会计师与税务师的专业背书", en: "The licensed-professional suffix — a credential signal for CPAs and tax advisors" },
    ],
    zh: {
      label: "会计财税",
      title: "会计事务所/财税服务品牌怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "会计财税品牌命名指南：稳健词根、数字联想、合伙人姓氏结构等 5 种思路，德勤/用友/Bench 等案例拆解，推荐 TLD 与常见误区，并用 AI 猎取可注册的财税域名。",
      intro:
        "财税命名卖的是一个字：稳。客户把公司的账本、税务合规甚至现金流命脉交给你，名字必须先于任何资质证书传递「这家不会出错」的信号——花哨、俏皮、互联网腔在这个行业是减分项而非加分项。第二个特点是双客群分野：服务中小微企业的代理记账走亲切效率路线（快、省、帮），服务中大型企业的审计税务筹划走权威庄重路线（信、诚、正）——两条路线的命名语言几乎不重叠，选边比创意更重要。第三是「合伙人即品牌」的行业传统：四大与老牌所全是姓氏连缀（Deloitte、普华永道），姓氏结构自带「有人对结果负责」的担保感；新一代云财税 SaaS 则反其道用轻快词（Bench、Pilot）把记账重构成订阅服务。最后注意监管红线：「会计师事务所」等字样有准入门槛，名字里的承诺性词汇（避税、包过）更是执业纪律的雷区。",
      namingIdeas: [
        "稳健信任词根：信、诚、正、衡、准、solid、true、ledger——把「不会出错」写进名字，财税客户对稳的敏感远高于对新的兴奋",
        "合伙人姓氏结构：创始合伙人姓氏 + 财税/会计（张氏财税）——审计与筹划业务的信任落点是具体的人，姓氏连缀是全球会计业百年验证的结构",
        "数字与账本意象：账、算、balance、count、book、digit——行业符号一眼识别，配合轻快词根可以做出「不像传统事务所」的云财税气质",
        "双客群选边测试：把名字放进「审计报告署名」和「小老板微信转介绍」两个场景各念一遍——庄重场景不掉价、日常场景不拗口，只能占一头时按主力客群选",
        "云财税走 SaaS 命名：面向中小微的代理记账/报税工具可用 Bench、Pilot 式的单词命名——把「找会计」重构成「开个账户」，名字先完成服务产品化的叙事",
      ],
      cases: [
        { name: "德勤", takeaway: "Deloitte 音译成「德 + 勤」：两个字恰好是中文商业伦理的核心美德，音译同时完成了本土化的价值观翻译——外来姓氏品牌中文化的教科书" },
        { name: "用友", takeaway: "「用户之友」缩合成两个字：把企业软件的服务姿态写进名字，亲切不失专业，三十年从财务软件长成 ERP 巨头名字始终兼容——功能中性命名的长期红利" },
        { name: "Bench", takeaway: "「工作台」一词命名云记账：把会计从「穿西装的事务所」拉到「你身边的工作台」，单音节好读好拼——传统行业 SaaS 化命名的标杆" },
        { name: "Pilot", takeaway: "「领航员」隐喻财务掌舵：不提账、税、算任何行业词，却精准传达「有人替你盯着财务航向」——隐喻命名在财税行业的高级执行" },
        { name: "普华永道", takeaway: "PwC 三姓氏中文化成「普华 + 永道」：普遍繁华、永恒正道，四个字把审计行业的公信力愿景说满——姓氏结构本土化再创作的范本" },
      ],
      pitfalls: [
        "承诺性词汇入名（避税、包过、零风险）：执业纪律与广告法双重雷区，一次稽查风波就让名字变成呈堂证供",
        "互联网俏皮腔用在审计筹划业务：给上市公司出审计报告的名字不能像奶茶店，庄重场景掉价直接损失高客单客户",
        "「会计师事务所」字样未取得资质先占用：事务所名称有严格准入与核名要求，品牌名与执业主体名要提前分层设计",
        "只注册中文忽略拼音/英文形态：企业客户的银行流水、发票抬头、跨境业务都需要稳定的拉丁字母形态，出海更是必查同名商标",
      ],
    },
    en: {
      label: "Accounting & tax",
      title: "How to Name an Accounting Firm or Tax Service: Strategies, Cases & Domains",
      metaDescription:
        "Accounting and tax brand naming guide: trust-and-rigor roots, partner-surname structures, ledger imagery, breakdowns of Deloitte/Bench/Pilot, recommended TLDs and pitfalls — then hunt an available accounting domain with AI.",
      intro:
        "Accounting naming sells one word: steadiness. Clients hand you their books, their tax compliance, sometimes their cash-flow lifeline — the name must signal \"this firm does not make mistakes\" before any credential can. Clever, quirky or startup-cute registers subtract trust here rather than add personality. Second, the market splits in two: bookkeeping for small businesses names warm and efficient (help, save, easy), while audit and tax planning for larger clients names grave and authoritative (true, trust, rigor) — the two vocabularies barely overlap, and picking a side matters more than being creative. Third, the partner is the brand: the Big Four and every legacy firm are chains of surnames (Deloitte, PwC), a structure that carries a built-in guarantee — a named human answers for the result. The new generation of cloud accounting flips it entirely, using light everyday words (Bench, Pilot) to reframe bookkeeping as a subscription product. Finally, mind the regulatory line: \"CPA firm\" designations have licensing requirements, and promise-words in a name (tax-free, guaranteed) are professional-conduct landmines.",
      namingIdeas: [
        "Root in steadiness and trust: true, solid, ledger, balance, anchor — write \"we don't make mistakes\" into the name; accounting clients respond to steady far more than to novel",
        "Use partner surnames: founding partner's name + accounting/tax (the Smith & Co pattern) — audit trust lands on a person, and surname chains are the century-tested structure of the global profession",
        "Borrow ledger imagery: book, count, digit, balance, figure — instantly category-legible, and paired with a light root it produces the \"not your father's firm\" cloud-accounting register",
        "Run the two-room test: say the name as an audit report signature, then in a small-business owner's referral text — it must hold gravity in one and roll easily in the other; if it only works in one room, choose by your core clientele",
        "Name cloud accounting like SaaS: bookkeeping and tax tools for small businesses can take single-word names (Bench, Pilot) — reframing \"hiring an accountant\" as \"opening an account\" starts with the name productizing the service",
      ],
      cases: [
        { name: "Deloitte", takeaway: "A founder's surname carried for 180 years: the name means nothing and therefore everything — proof that in professional services, consistency itself becomes the brand asset; the surname structure at maximum compounding" },
        { name: "Bench", takeaway: "A workbench, one syllable: bookkeeping pulled from suit-and-tie offices to the desk beside you; easy to say, spell and trust — the benchmark for SaaS-ifying a legacy profession's naming" },
        { name: "Pilot", takeaway: "A navigation metaphor with zero industry words: no book, no tax, no count — yet it lands precisely on \"someone is watching your financial course\"; metaphor naming executed at the premium end of fintech" },
        { name: "Xero", takeaway: "\"Zero\" respelled with an X: zero errors, zero paperwork, inbox-zero for your books — one letter swap creates trademark ownership while keeping instant pronunciation; disciplined spelling variation done right" },
        { name: "FreshBooks", takeaway: "fresh + books: the category word anchored by a feeling word — invoicing for freelancers that sounds like relief rather than bureaucracy; the classic mood-plus-category blend applied to accounting" },
      ],
      pitfalls: [
        "Promise-words in the name (tax-free, guaranteed, zero-risk): a dual minefield of professional conduct rules and advertising law — one audit controversy turns the name into evidence",
        "Startup-cute register on audit work: a name signing public-company audit opinions cannot sound like a bubble-tea shop; lost gravity is lost high-ticket clients",
        "Using protected designations without the license: \"CPA firm\" and equivalents carry registration requirements — design the brand name and the licensed entity name as separate layers from day one",
        "Ignoring the Latin-alphabet form: bank records, invoices and cross-border work all need a stable romanized identity, and overseas expansion demands a trademark check on it first",
      ],
    },
  },
  livestream: {
    slug: "livestream",
    tlds: [
      { tld: "com", zh: "直播电商供应链与品牌方合作的信任门面，商务对接必查", en: "The trust front for supply-chain and brand partnerships — business development checks it first" },
      { tld: "live", zh: "「直播」写进后缀，行业属性零解释成本", en: "Live in the suffix itself — zero explanation for what you do" },
      { tld: "shop", zh: "带货属性直给，直播间跳转链路里天然顺手", en: "Commerce-forward and natural in the livestream-to-checkout link path" },
    ],
    zh: {
      label: "直播电商",
      title: "直播电商/主播品牌怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "直播电商与主播 IP 命名指南：口播友好测试、人设词根、场景词嫁接等 5 种思路，东方甄选/交个朋友等案例拆解，推荐 TLD 与常见误区，并用 AI 猎取可注册的直播域名。",
      intro:
        "直播电商的名字是用「喊」的不是用「看」的：主播每场要口播品牌名几十次，观众在嘈杂的信息流里靠听觉记住你——名字必须两秒内喊得响、听得清、记得住，任何需要解释拼写的名字都在浪费口播成本。第二个特点是「人设即品牌」：直播间的信任先落在主播人设上再迁移到供应链，名字要么直接承载人设（交个朋友的坦诚人设），要么给人设留出叙事空间（东方甄选的文化人设）——名字和人设错位，观众会本能觉得违和。第三是平台依附与出走的张力：抖音、快手的流量是租来的，名字是少数真正属于你的资产，起名时就要考虑跨平台迁移甚至独立站形态——纯平台梗命名会把品牌锁死在单一生态。最后是信任修复的行业课题：直播带货的翻车史让观众对「甄选」「严选」类词汇既依赖又警惕，名字承诺的品控标准必须真的兜得住。",
      namingIdeas: [
        "口播友好测试：让三个人各喊十遍品牌名——喊不响、容易听岔、超过四个字的名字直接淘汰；直播间里名字的第一职责是被听清",
        "人设词根命名：把主播人设写进名字（朋友、甄选、老铁、掌柜）——直播信任先认人再认货，名字与人设同构能让每次口播都在强化人设",
        "场景词嫁接：货、仓、工厂、源头、直供——把「没有中间商」的供应链叙事直接写进名字，价格敏感型观众一听就懂卖点",
        "留出品类扩张空间：今天播美妆明天可能播食品，名字锁死单一品类会限制选品——用气质词而非品类词命名，让供应链跟着流量走",
        "全平台可用性预检：抖音、快手、视频号、小红书同名账号 + 商标 35 类/38 类 + 域名一次查齐——直播 IP 的名字资产分散在多平台，任何一处被抢注都是长期隐患",
      ],
      cases: [
        { name: "东方甄选", takeaway: "「东方」（文化底色）+「甄选」（品控承诺）：双语带货的文化人设与供应链信任一次说满，从直播间长成独立电商品牌名字无需更换——人设命名给转型留足空间的范本" },
        { name: "交个朋友", takeaway: "四个字的口语短句当品牌名：把「不赚差价的坦诚感」写进名字，口播时自带社交姿态——句子式命名在直播场景的独特优势，喊出来就是一次人设宣言" },
        { name: "辛选", takeaway: "主播姓氏「辛」+「选」：一个字绑定个人 IP，一个字承诺选品，两个字完成「人 + 货」的最短表达——极简人名结构在直播电商的高效执行" },
        { name: "遥望科技", takeaway: "「遥望」的开阔意象配「科技」的基建定位：不绑定任何主播个人，给多主播矩阵与供应链中台留足叙事空间——MCN 机构命名与主播 IP 命名分层的清晰示范" },
      ],
      pitfalls: [
        "名字依赖平台梗或热词：热词半衰期以月计，平台梗出圈即失效——名字过气比人设过气更难挽回",
        "口播拗口或谐音歧义：直播间每场口播几十次，任何发音磕绊都在指数级放大；谐音负面联想在弹幕文化里会被无限玩梗",
        "「甄选/严选」类承诺词滥用：名字写了品控承诺就要真的兜底，一次翻车名字本身就成了嘲讽素材",
        "只注册账号不注册商标与域名：直播 IP 火起来的速度远快于维权速度，35 类商标与主域名必须在起号当天锁定",
      ],
    },
    en: {
      label: "Livestream commerce",
      title: "How to Name a Livestream Commerce or Creator Shop Brand: Strategies, Cases & Domains",
      metaDescription:
        "Livestream commerce naming guide: shout-out friendly tests, persona roots, supply-chain words, breakdowns of Whatnot/NTWRK and creator shops, recommended TLDs and pitfalls — then hunt an available livestream domain with AI.",
      intro:
        "A livestream commerce name is shouted, not read: hosts say the brand name dozens of times per show, and viewers remember it by ear inside a noisy feed — it must ring clear in two seconds, and any name that needs its spelling explained is leaking airtime. Second, the persona is the brand: livestream trust lands on the host first and transfers to the merchandise second, so the name either carries the persona directly or leaves room for its story — a name that clashes with the on-camera character feels instantly off to viewers. Third, there's the platform-tenancy tension: traffic on TikTok or Twitch is rented, and the name is one of the few assets you actually own — name for cross-platform migration and an eventual standalone store, because platform-meme names lock the brand inside a single ecosystem. Finally, the category has a trust deficit to repair: after years of livestream-shopping scandals, viewers both crave and distrust curation words like \"select\" and \"verified\" — whatever quality promise the name makes, the sourcing must actually keep.",
      namingIdeas: [
        "Run the shout test: have three people yell the name ten times — anything that doesn't carry, gets misheard, or runs past three syllables is out; a livestream name's first job is being heard correctly",
        "Root the name in the persona: friend, picks, vault, den — livestream trust attaches to a character before a catalog, and a name built from the persona reinforces it with every shout-out",
        "Graft supply-chain words: source, direct, factory, depot — writing \"no middlemen\" into the name lets price-driven viewers hear the pitch before the pitch",
        "Leave room to switch categories: today's beauty stream is next year's food stream — name with temperament words rather than category words so sourcing can follow the audience",
        "Pre-check every platform at once: matching handles on TikTok/Instagram/YouTube, the trademark classes, and the domain in one sweep — a livestream brand's name assets scatter across platforms, and any squatted corner becomes a permanent leak",
      ],
      cases: [
        { name: "Whatnot", takeaway: "A casual everyday phrase — \"cards, collectibles and whatnot\": the name performs the flea-market browsing feeling that is the product; conversational naming that sounds like the experience it sells" },
        { name: "NTWRK", takeaway: "\"Network\" with the vowels stripped: streetwear-coded compression that signals drop culture to exactly its audience — spelling variation as a tribal password, accepting the spell-out cost for the aesthetic" },
        { name: "TalkShopLive", takeaway: "talk + shop + live: the entire format in three words — conversation, commerce, real time; functional naming at maximum literalness, trading brandability for instant comprehension in a young category" },
        { name: "Poshmark", takeaway: "posh + mark(et): an upscale feeling word fused with the marketplace category — social selling that sounds aspirational rather than thrift; the mood-plus-category blend tuned for seller pride" },
      ],
      pitfalls: [
        "Naming off platform memes or trending slang: meme half-lives are measured in months — a dated name is harder to recover from than a dated persona",
        "Tongue-twisters and unfortunate homophones: a name said fifty times per show amplifies every stumble exponentially, and chat culture will meme any awkward sound-alike forever",
        "Overusing curation promises (select, verified, vetted): a quality promise in the name must be backed by sourcing — one scandal turns the name itself into the punchline",
        "Registering handles but not trademarks and domains: livestream brands blow up faster than enforcement works; lock the trademark and primary domain the day the account is created",
      ],
    },
  },
  translation: {
    slug: "translation",
    tlds: [
      { tld: "com", zh: "跨国企业客户采购本地化服务的默认信任后缀", en: "The default trust suffix when global enterprises procure localization" },
      { tld: "io", zh: "本地化平台与开发者工具（i18n SDK/API）的圈内标配", en: "The insider standard for localization platforms and i18n developer tools" },
      { tld: "ai", zh: "机器翻译与 AI 本地化时代的技术定位后缀", en: "The technology-positioning suffix in the machine-translation and AI localization era" },
    ],
    zh: {
      label: "翻译本地化",
      title: "翻译公司/本地化服务怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "翻译与本地化品牌命名指南：跨语言可读测试、桥梁意象、词根国际化等 5 种思路，DeepL/Smartling/传神等案例拆解，推荐 TLD 与常见误区，并用 AI 猎取可注册的本地化域名。",
      intro:
        "翻译行业的名字有个天然的自反性考验：一个声称精通多语言的品牌，名字必须自己先通过多语言测试——在英语、中文、西语、日语里都好读不歧义，否则名字本身就是反面案例。这决定了本地化命名的第一原则：选全球音系友好的词根（开音节、避免辅音丛），名字要像产品承诺的那样「无国界」。第二个特点是行业的双层结构：人工翻译服务卖「信达雅」的专业信任，名字偏庄重（传神、精艺达）；本地化技术平台卖「规模与自动化」，名字走 SaaS 路线（Smartling、Lokalise）——AI 翻译浪潮正把重心从前者推向后者，命名语言也随之从「译」转向「智能」。第三是隐形行业的可见性难题：翻译做得越好越隐形，客户记住的是内容不是译者——名字需要主动争取存在感，桥、链、通等连接意象是这个行业最诚实也最拥挤的隐喻，用它们时必须叠加差异化词根。",
      namingIdeas: [
        "跨语言可读测试：把名字放进英西中日四种语言念一遍——有辅音丛、闭音节堆叠或负面谐音的直接淘汰；翻译品牌的名字自己必须先「翻译得过去」",
        "桥梁连接意象差异化使用：bridge、link、通、传——行业最诚实的隐喻但也最拥挤，必须叠加独特词根（如 DeepL 的 deep）才有商标性",
        "技术平台走 i18n 命名：面向开发者的本地化工具用 -ise/-ly/Loka- 等 SaaS 词根（Lokalise、Smartling）——名字先声明「我是平台不是翻译社」",
        "语言符号巧用：字母 L、双语双关、Unicode 意象——行业符号一眼识别（DeepL 的 L 即 Language），且对语言从业者有会心一击的传播力",
        "人工服务立专业人设：翻译公司用信、达、雅、精、传等质量词根——高客单的法律医学翻译客户买的是「不会错」，名字先立准确性人设",
      ],
      cases: [
        { name: "DeepL", takeaway: "deep（deep learning）+ L（Language）：五个字母同时声明技术路线与行业属性，全球音系零障碍——技术命名压缩到极致的教科书，机器翻译时代的命名标杆" },
        { name: "Smartling", takeaway: "smart + -ling（语言学词缀，如 linguist）：聪明与语言两个词根无缝焊接，SaaS 气质拉满——词缀嫁接让行业属性藏在词形里的高级做法" },
        { name: "传神语联", takeaway: "「传神」直接取自翻译最高标准（传神达意）：行业黑话变品牌名，客户与译者双向会心——中文翻译业命名借力千年译论的独有资产" },
        { name: "Lokalise", takeaway: "localise 的 k 化变形：一个字母的改动同时完成商标独占与「更技术更北欧」的气质暗示，开发者受众零违和——克制拼写变形的标准执行" },
        { name: "Duolingo", takeaway: "duo（双）+ lingo（语言俚语词）：拉丁词根全球通读，绿色猫头鹰把名字人格化——语言品牌命名兼顾学术感与亲和力的平衡样本" },
      ],
      pitfalls: [
        "名字自己过不了多语言测试：辅音丛、闭音节、某语言里的负面谐音——翻译品牌的名字读不顺，等于餐厅门口的苍蝇",
        "桥/通/联意象裸用不加差异化：行业里几百家「X 桥翻译」「Y 通传译」，商标近似驳回率极高，搜索结果永远挤不进第一屏",
        "锁死「翻译」品类词：AI 时代业务必然扩到本地化、多语内容生成、语音克隆——名字里写死 translate 会限制叙事升级",
        "忽略目标语市场的商标检索：本地化公司的客户遍布多法域，名字在主要目标市场（美欧日）的商标近似必须提前查",
      ],
    },
    en: {
      label: "Translation & localization",
      title: "How to Name a Translation or Localization Company: Strategies, Cases & Domains",
      metaDescription:
        "Translation and localization naming guide: cross-language readability tests, bridge imagery done right, i18n platform roots, breakdowns of DeepL/Smartling/Lokalise, recommended TLDs and pitfalls — then hunt an available localization domain with AI.",
      intro:
        "Translation naming carries a built-in reflexive test: a brand claiming to master languages must have a name that passes the multilingual exam itself — readable and clean in English, Spanish, Chinese and Japanese alike, or the name becomes its own counterexample. That sets the first principle: choose globally phonology-friendly roots (open syllables, no consonant clusters) so the name is as borderless as the service promises. Second, the industry runs on two layers: human translation services sell professional fidelity and name gravely (precision, fidelity roots), while localization platforms sell scale and automation and name like SaaS (Smartling, Lokalise) — and the AI wave is shifting the center of gravity from the former to the latter, pulling naming language from \"translate\" toward \"intelligence\". Third, there's the invisibility problem: the better translation gets, the more invisible the translator — clients remember the content, not the conduit. The name has to fight for presence, and connection imagery (bridge, link, tongue) is the industry's most honest but most crowded metaphor: usable only when fused with a differentiating root.",
      namingIdeas: [
        "Run the cross-language exam: read the name aloud in English, Spanish, Chinese and Japanese — consonant clusters, stacked closed syllables or a bad homophone in any target market is an automatic veto; a translation brand's name must translate first",
        "Differentiate the bridge metaphor: bridge, link, lingua — the category's most honest imagery is also its most crowded; it only earns trademark strength fused with a distinctive root (DeepL's deep)",
        "Name platforms like i18n tools: developer-facing localization products take SaaS morphology (-ise, -ly, Loka-) — the name should declare \"platform, not agency\" before the pitch does",
        "Play with language symbols: the letter L, bilingual puns, script imagery — instantly legible to the industry (DeepL's L is Language), with insider resonance that makes linguists your best amplifiers",
        "Give human services a fidelity persona: agencies serving legal and medical clients need accuracy-register roots (true, verbatim, fidelity) — five-figure translation buyers are buying \"never wrong\", and the name makes that claim first",
      ],
      cases: [
        { name: "DeepL", takeaway: "deep (learning) + L (Language): five letters declaring both the technology and the category, frictionless in every phonology — technical naming compressed to its limit; the naming benchmark of the machine-translation era" },
        { name: "Smartling", takeaway: "smart + -ling (the linguistics suffix, as in linguist): intelligence and language welded at the morpheme level with full SaaS energy — hiding the category inside word-shape, the sophisticated version of category naming" },
        { name: "Lokalise", takeaway: "\"localise\" with a k: one letter earns trademark ownership plus a technical, vaguely Nordic accent that developers read as native — disciplined spelling variation executed by the book" },
        { name: "Duolingo", takeaway: "duo + lingo: Latin roots readable worldwide, then a green owl to personify them — the balance of academic credibility and mass-market warmth that language brands chase" },
        { name: "Phrase", takeaway: "A bare dictionary word for a localization platform: maximum category clarity at the cost of searchability — the common-word gamble, workable only with a clean .com and enterprise sales motion" },
      ],
      pitfalls: [
        "A name that fails its own multilingual test: consonant clusters or a slur-adjacent homophone in a target language — for a translation brand, an unpronounceable name is the cracked window of the storefront",
        "Bare bridge/link/global naming: hundreds of \"X-Bridge Translations\" already exist — trademark refusal risk is high and page one of search is permanently out of reach",
        "Locking \"translate\" into the name: the AI era pushes every player toward localization, multilingual content generation and voice — a name welded to translation caps the story you can tell",
        "Skipping trademark checks in target-language markets: localization clients span jurisdictions — clear the name in the US, EU and Japan before the first enterprise deal, not after",
      ],
    },
  },
  gardening: {
    slug: "gardening",
    tlds: [
      { tld: "com", zh: "园艺电商与订阅服务的信任基线，复购品牌的长期门面", en: "The trust baseline for garden e-commerce and subscriptions — the long-term face of a repeat-purchase brand" },
      { tld: "garden", zh: "行业词直接做后缀，花园品牌的完整表达", en: "The category word as the suffix itself — a complete expression for garden brands" },
      { tld: "green", zh: "「绿色」写进后缀，植物与可持续定位一步到位", en: "Green in the suffix — plants and sustainability positioning in one step" },
    ],
    zh: {
      label: "园艺绿植",
      title: "园艺绿植品牌怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "园艺绿植品牌命名指南：生长意象、治愈系词根、节气花时等 5 种思路，The Sill/Patch 等案例拆解，推荐 TLD 与常见误区，并用 AI 猎取可注册的园艺域名。",
      intro:
        "园艺品牌卖的从来不是植物，是「照料生活的感觉」：都市人买绿植买的是治愈、陪伴与一平米的自然，名字必须先传递这份情绪价值——生长、呼吸、光合、时节等意象是这个行业的母语。第二个特点是「怕养死」的核心焦虑：新手对园艺的最大障碍是「我会把它养死」，名字若能暗示「好养活、有人教、养死包赔」（Patch 的陪伴感、Easyplant 的直白），就直接拆掉了下单的心理门槛。第三是客群的代际分野：传统园艺客群（花友、庭院族）认专业与品种权威，新一代室内绿植客群（租房青年、办公室人群）认颜值与生活方式——两代人刷的平台、说的黑话、付的价钱完全不同，名字选边决定品牌坐标。最后是复购生意的本质：植物会死、会长大、会需要新盆新土，园艺是天然的订阅制品类，名字要经得起包裹上、推送里、月复一月的反复出现。",
      namingIdeas: [
        "生长与光的意象：生长、萌、芽、光、sprout、bloom、sunny——把植物的生命动词写进名字，情绪价值先于产品到货",
        "治愈陪伴词根：伴、栖、居、patch、nest——都市绿植买的是陪伴感，名字像室友的昵称而非园艺公司的招牌",
        "拆「养死焦虑」：easy、hardy、无忧、好养——新手最大心理门槛是怕养死，名字直接承诺好养活等于替客服回答了最高频问题",
        "节气与花时词库：立春、花信、时令、季——中文园艺独有的时间美学词库，既有文化厚度又自带内容日历（节气营销）",
        "选边代际客群：面向花友庭院族用品种与专业词（月季、蔷薇、园圃），面向租房青年用生活方式词（角落、窗台、一平米）——两代客群的语言体系不通用",
      ],
      cases: [
        { name: "The Sill", takeaway: "「窗台」一词命名室内绿植电商：植物在都市家庭的真实位置，一秒唤起「窗边有绿」的画面——场景词命名让产品自动进入用户的生活空间" },
        { name: "Patch", takeaway: "「一小块地」的谦逊表达：不承诺花园只承诺一小块绿意，精准匹配都市阳台的现实，单音节好读好记——低承诺高共鸣的命名心法" },
        { name: "Bloomscape", takeaway: "bloom（绽放）+ scape（景观）：从一盆花到一片景的想象升级，词形自带 landscape 的空间感——合成词把客单价天花板悄悄抬高的示范" },
        { name: "花点时间", takeaway: "「花点时间」一语双关：花（植物）+ 花时间（生活态度），把每周一花的订阅制写成生活提案——中文双关命名与商业模式同构的经典案例" },
      ],
      pitfalls: [
        "堆砌绿/植/花的通用组合（绿植家、花花世界类）：行业同质化重灾区，商标近似驳回率高，搜索里永远淹没",
        "名字过度承诺「永远鲜活」：植物会死是行业事实，名字把话说满后每一次养死体验都在反噬品牌",
        "只面向线下花店思维起名：园艺电商的名字要在快递箱、App 推送、订阅邮件里反复出现——门头思维的名字往往在数字触点上失灵",
        "忽略拉丁学名与品种名的商标雷区：品种名（如特定月季品种）可能有植物新品种权，直接拿品种名当品牌名有侵权风险",
      ],
    },
    en: {
      label: "Gardening & plants",
      title: "How to Name a Gardening or Plant Brand: Strategies, Cases & Domains",
      metaDescription:
        "Gardening and plant brand naming guide: growth imagery, kill-proof reassurance roots, scene words, breakdowns of The Sill/Patch/Bloomscape, recommended TLDs and pitfalls — then hunt an available garden domain with AI.",
      intro:
        "A plant brand never really sells plants — it sells the feeling of tending to a life: urban buyers purchase calm, companionship and a square meter of nature, so the name must deliver that emotional payload first, in the industry's native imagery of growth, light, breath and seasons. Second, the category's core anxiety is \"I'll kill it\": the biggest barrier for beginners isn't price but fear of failure, and a name that whispers hardy, guided or guaranteed (Patch's companionship, Easyplant's bluntness) dismantles the purchase hesitation before the FAQ page does. Third, the audience splits by generation: traditional gardeners trust variety expertise and horticultural authority, while the new houseplant crowd — renters, desk workers — buys aesthetics and lifestyle; they scroll different platforms, speak different slang and pay different prices, and the name picks which world the brand lives in. Finally, this is a repeat-purchase business at heart: plants die, outgrow pots, need soil and seasonal swaps — gardening is a natural subscription category, and the name must wear well on a shipping box, in a push notification, month after month.",
      namingIdeas: [
        "Reach for growth and light: sprout, bloom, sunny, flourish — write the plant's life-verbs into the name so the emotional value arrives before the parcel does",
        "Root in companionship: patch, nest, sill, corner — urban plant buyers want a housemate, not a horticulture supplier; the name should sound like a nickname, not a nursery",
        "Defuse the kill-anxiety: easy, hardy, fool-proof roots — beginners' biggest barrier is fear of failure, and a name that promises survivability answers the top support question preemptively",
        "Name the scene, not the product: windowsill, balcony, corner — placing the name inside the buyer's actual living space makes the product self-locate in their home",
        "Pick your generation: variety and expertise words (rose, grove, heirloom) for serious gardeners; lifestyle and space words for the renter houseplant crowd — the two audiences don't share a vocabulary",
      ],
      cases: [
        { name: "The Sill", takeaway: "The windowsill — exactly where urban plants actually live: one scene word conjures the image of green by the window; scene naming that installs the product into the customer's home before checkout" },
        { name: "Patch", takeaway: "A humble \"small patch of ground\": promising a corner of green rather than a garden, perfectly calibrated to balcony reality; one syllable, high resonance — the under-promise, over-connect school of naming" },
        { name: "Bloomscape", takeaway: "bloom + scape: upgrading the imagination from a single pot to a whole scene, with landscape's spatial feel built into the word-shape — a blend that quietly raises the price ceiling" },
        { name: "Fast Growing Trees", takeaway: "The entire value proposition as the name: maximum SEO capture and instant comprehension, traded against zero brand mystique — the functional-naming extreme, viable in high-intent search categories" },
      ],
      pitfalls: [
        "Generic green/plant/flower mashups (PlantWorld, GreenLife): the category's worst homogeneity zone — high trademark-refusal risk and permanent burial in search results",
        "Over-promising immortality in the name: plants die — that's the business; a name that promises forever turns every dead fern into brand damage",
        "Naming with shopfront thinking only: a plant e-commerce name lives on shipping boxes, app pushes and subscription emails — names designed for a storefront sign often fail at digital touchpoints",
        "Ignoring plant-variety rights: specific cultivar names can be protected by plant breeders' rights — lifting a variety name as your brand name is an infringement risk, not a shortcut",
      ],
    },
  },
  coworking: {
    slug: "coworking",
    tlds: [
      { tld: "com", zh: "企业客户签年约工位的信任基线，行政采购必查", en: "The trust baseline when companies sign annual desk contracts — corporate procurement checks it" },
      { tld: "space", zh: "「空间」写进后缀，联合办公的完整语义闭环", en: "Space in the suffix — the complete semantic loop for coworking" },
      { tld: "work", zh: "行业词直给，工位预订链路里零解释成本", en: "The category word itself — zero explanation in the desk-booking flow" },
    ],
    zh: {
      label: "联合办公",
      title: "联合办公/共享空间品牌怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "联合办公与共享空间命名指南：社群归属词根、空间意象、专业与活力平衡等 5 种思路，WeWork/优客工场等案例拆解，推荐 TLD 与常见误区，并用 AI 猎取可注册的空间域名。",
      intro:
        "联合办公卖的不是工位是归属感：自由职业者与初创团队租的是「一群同路人」的氛围，名字必须先传递社群感——We、Hub、Club 系词根统治这个行业不是巧合。但 WeWork 的暴雷给全行业上了一课：名字画的饼越大，兑现不了时摔得越重——「改变世界的工作方式」的叙事崩塌后，行业命名明显转向务实（空间、场所、效率词根）。第二个特点是双客群张力：自由职业者要活力与社交（咖啡香、活动墙），企业分部要专业与安静（会议室、隐私）——名字的气质选边直接筛选入驻者构成，进而决定空间的真实氛围。第三是空间即媒介的本地属性：联合办公是重线下的生意，名字要在楼宇招牌、地图搜索、「我在 X 上班」的日常表达里都顺口——员工向朋友说出空间名字时的微妙自豪感，是这个行业最便宜的获客渠道。",
      namingIdeas: [
        "社群归属词根：we、club、house、hub、社、聚——联合办公的核心卖点是同路人氛围，名字先发出「加入我们」的邀请",
        "空间场所意象：场、所、间、space、studio、campus——务实系命名的主词库，WeWork 之后行业叙事回归空间本身的价值",
        "专业活力平衡测试：把名字放进「跟投资人约在 X 见」和「周五在 X 有个酒会」两个场景各念一遍——都不违和的名字才能同时接住企业客户与自由职业者",
        "在地化词根嫁接：城市地标、街区名、方言词 + 空间词——联合办公是本地生意，在地词根让名字自带「这是我们街区的空间」的亲近感",
        "「我在 X 上班」测试：员工向朋友介绍工作地点时说出名字——有微妙自豪感的名字是最便宜的获客渠道，尴尬拗口的名字每天都在流失转介绍",
      ],
      cases: [
        { name: "WeWork", takeaway: "we + work 两个最简单的词：归属感与场景一次说满，全球扩张零翻译成本——命名本身近乎满分，品牌的崩塌恰恰证明名字画的饼必须由运营兑现" },
        { name: "优客工场", takeaway: "「优客」（优质创客）+「工场」（生产感的空间词）：四个字同时锚定人群与场所，比直译 coworking 更接中国创业语境——本土化命名不照搬外来概念的示范" },
        { name: "Industrious", takeaway: "「勤奋的」一词直接当名：把入驻者最想要的自我标签写进品牌，企业客户听到的是「专业高效」——形容词命名让用户自我投射的高级做法" },
        { name: "Soho House", takeaway: "街区名 Soho + house：在地词根与私宅意象叠加出「会员制俱乐部」的稀缺感——联合办公向社交俱乐部升维时，命名同步升维的参照系" },
      ],
      pitfalls: [
        "宏大叙事词透支信任（革命、改变世界系）：WeWork 之后投资人与客户对大词免疫甚至警惕，名字承诺的必须是空间能兑现的",
        "创意词堆砌牺牲可搜索性：过度抽象的造词在「城市 + 联合办公」的搜索场景里毫无捕获力，本地生意输掉地图搜索等于输掉一半客源",
        "气质错位筛错客群：名字太派对感会吓退企业客户，太写字楼感会失去自由职业者——先想清楚主力营收来自谁再选词",
        "忽略多城扩张的名字兼容性：带单一城市/街区词根的名字扩张到第二城就尴尬，连锁预期强的品牌要用可复制的词根结构",
      ],
    },
    en: {
      label: "Coworking spaces",
      title: "How to Name a Coworking or Shared Space Brand: Strategies, Cases & Domains",
      metaDescription:
        "Coworking and shared space naming guide: belonging roots, place imagery, the professional-vs-social balance test, breakdowns of WeWork/Industrious/Soho House, recommended TLDs and pitfalls — then hunt an available space domain with AI.",
      intro:
        "Coworking doesn't sell desks — it sells belonging: freelancers and startup teams rent the company of fellow travelers, so the name must radiate community first; the dominance of We, Hub and Club roots in this industry is no accident. But WeWork's implosion taught the category a lesson: the bigger the story a name tells, the harder the fall when operations can't cash it — since the \"transform how we work\" narrative collapsed, naming has visibly turned pragmatic, back to space, place and productivity roots. Second, there's the two-audience tension: freelancers want energy and social texture (espresso, events), while corporate satellite teams want professionalism and quiet (meeting rooms, privacy) — the name's register filters who moves in, which then becomes the space's actual atmosphere. Third, this is a deeply local, physical business: the name must work on building signage, in map search, and in the everyday sentence \"I work out of X\" — the flicker of pride when a member tells a friend where they work is the cheapest acquisition channel the industry has.",
      namingIdeas: [
        "Root in belonging: we, club, house, hub, commons — the core product is the company of peers, and the name should extend the invitation before the tour does",
        "Anchor in place: space, studio, works, campus, yard — the pragmatic school's vocabulary; post-WeWork, the industry narrative returned to the value of the room itself",
        "Run the two-scene test: say \"meeting an investor at X\" and \"Friday drinks at X\" — only a name that fits both sentences can hold corporate clients and freelancers under one roof",
        "Graft local roots: neighborhood names, landmarks, city shorthand + a place word — coworking is local business, and a name from the block carries built-in \"this is our neighborhood's spot\" warmth",
        "Apply the \"I work out of X\" test: a name that gives members a flicker of pride when they say it is free marketing every day; an awkward one leaks referrals just as constantly",
      ],
      cases: [
        { name: "WeWork", takeaway: "we + work, the two simplest possible words: belonging and use-case in one breath, zero translation cost worldwide — near-perfect naming whose brand collapse proves the name's promise must be cashed by operations, not vision decks" },
        { name: "Industrious", takeaway: "A plain adjective as the brand: the self-image members most want, and what corporate buyers hear is \"professional and productive\" — adjective naming that lets users project themselves into the word" },
        { name: "Soho House", takeaway: "A neighborhood name + house: local root and private-residence imagery compound into members-club scarcity — the naming reference point when a space brand moves upmarket into social club territory" },
        { name: "The Wing", takeaway: "A wing — of a building, and of taking flight: architectural fact and aspiration in one word, with the definite article adding club-like singularity; double-meaning naming tuned precisely to its community" },
      ],
      pitfalls: [
        "Grand-narrative words (revolution, transform, future-of-work): post-WeWork, investors and tenants are immune or allergic — promise only what the space itself can deliver",
        "Abstract coinages that lose map search: an over-clever name captures nothing in \"coworking near me\" queries, and losing local search means losing half the funnel of a local business",
        "Register mismatch filtering the wrong crowd: too party and corporate clients flee; too corporate and freelancers never arrive — decide who pays the rent before choosing the vibe",
        "Single-city roots that break at expansion: a name welded to one neighborhood gets awkward in the second city — chains need replicable root structures from day one",
      ],
    },
  },
  solar: {
    slug: "solar",
    tlds: [
      { tld: "com", zh: "动辄数十万的光伏工程决策，业主与银行融资都认它", en: "Five-figure installation decisions — homeowners and financing banks both default to it" },
      { tld: "energy", zh: "「能源」写进后缀，光伏与储能业务的完整表达", en: "Energy in the suffix — the complete expression for solar and storage" },
      { tld: "green", zh: "可持续定位直给，环保导向客群的第一眼共鸣", en: "Sustainability positioning at a glance — instant resonance with eco-driven buyers" },
    ],
    zh: {
      label: "光伏新能源",
      title: "光伏/新能源品牌怎么起名：命名思路、好名字拆解与域名选择",
      metaDescription: "光伏与新能源品牌命名指南：光与太阳意象、可靠承诺词根、科技与环保平衡等 5 种思路，隆基/阳光电源/Sunrun 等案例拆解，推荐 TLD 与常见误区，并用 AI 猎取可注册的新能源域名。",
      intro:
        "光伏命名的核心资产是「光」：太阳、光、晒、sun、solar、ray——这个行业拥有全人类最正面的意象库，但也因此最拥挤，差异化必须来自光意象之外的第二词根。第二个特点是超长决策周期与信任门槛：户用光伏动辄十几万、质保二十五年，业主签约签的是「这家公司二十五年后还在」的判断——名字必须传递可靠、长期、有实力的信号，轻飘的互联网腔在这个行业直接损失签约率。第三是双市场的命名分野：To B 的组件制造与电站开发商走工业与技术权威路线（隆基、晶科），To C 的户用安装与储能走亲和与省钱叙事（Sunrun 的「跑起来」、阳光家庭）——同一条产业链上下游的命名语言几乎是两个行业。最后是政策与出海的双重语境：中国光伏企业天然面向全球市场，名字的拼音形态与英文形态要同步设计，且要避开各国对「绿色宣称」的监管雷区——greenwashing 的指控往往从名字开始。",
      namingIdeas: [
        "光意象 + 第二词根差异化：太阳/光/晒是行业母语但已拥挤，必须叠加差异化词根——隆基（人名致敬）、Sunrun（动词）、阳光电源（品类词）各有第二支点",
        "可靠长期词根：基、恒、久、稳、run、last——二十五年质保的生意，名字先回答「你们公司能活那么久吗」",
        "科技与环保平衡：纯环保腔（绿、生态）易被质疑虚，纯科技腔（芯、能效比）难亲近——户用市场的最优解是「科技让省钱可信」的混合气质",
        "省钱叙事入名：省、赚、零电费、run——户用光伏的真实购买动机是电费账单而非环保理想，名字直面钱的品牌转化率更诚实",
        "拼音/英文形态同步设计：中国光伏天然出海，中文名定稿前先验证拼音形态的可读性与英文近似商标——LONGi 的大小写设计就是全球化形态的示范",
      ],
      cases: [
        { name: "隆基绿能", takeaway: "「隆基」取自老校长江隆基之名：人名致敬赋予名字厚重的精神叙事，配「绿能」品类词完成行业定位——中国光伏龙头用一个名字同时承载传承与赛道" },
        { name: "阳光电源", takeaway: "「阳光」（行业意象）+「电源」（品类直给）：四个字把「太阳变电」的商业本质说尽，B 端客户零理解成本——工业品牌功能命名的标准执行" },
        { name: "Sunrun", takeaway: "sun + run：太阳「跑起来」的动感让光伏从工程品变成生活方式，两个单音节词全球好读——户用光伏消费化命名的标杆，动词给行业注入轻快感" },
        { name: "Tesla Energy", takeaway: "特斯拉之名（科学家致敬）延伸到能源业务：主品牌的科技光环直接为储能背书——品牌延伸命名的势能样本，也解释了为何光伏新品牌难与之正面竞争" },
        { name: "晶科能源", takeaway: "「晶」（硅晶体的材料词根）+「科」（科技）：把光伏制造的技术本体写进名字，供应链客户一眼识别专业身份——To B 命名用材料词根立信的示范" },
      ],
      pitfalls: [
        "裸用光/阳/晒不加差异化：行业同名重灾区，「XX 阳光」「阳光 XX」商标近似驳回率极高，搜索与投标场景都被淹没",
        "绿色宣称过度（零碳、100% 清洁入名）：各国 greenwashing 监管趋严，名字里的环保承诺若与实际不符，监管与舆论双重反噬",
        "轻飘互联网腔损失信任：二十五年质保的生意用「太阳酱」式命名，业主签约时的犹豫都写在脸上——重决策行业名字必须有分量",
        "忽略英文/拼音形态的全球验证：光伏必然出海，中文名的拼音在英语里的可读性、目标市场的商标近似必须在定名前查清",
      ],
    },
    en: {
      label: "Solar & clean energy",
      title: "How to Name a Solar or Clean Energy Brand: Strategies, Cases & Domains",
      metaDescription:
        "Solar and clean energy naming guide: sun imagery with a second root, reliability signals for 25-year warranties, savings-forward names, breakdowns of Sunrun/LONGi/Tesla Energy, recommended TLDs and pitfalls — then hunt an available energy domain with AI.",
      intro:
        "Solar naming's core asset is light: sun, ray, bright, solar — this industry owns humanity's most positive image bank, which also makes it the most crowded; differentiation must come from a second root beyond the sun. Second, the decision cycle is long and the trust bar is high: a residential system costs five figures and carries a 25-year warranty, so what the homeowner really signs is a bet that \"this company still exists in 2050\" — the name must signal solid, long-lived and well-capitalized, and a flimsy startup register directly costs signatures. Third, the value chain names in two languages: B2B module makers and utility-scale developers use industrial-technical authority (materials roots, engineering gravity), while residential installers and storage brands use warmth and savings narratives (Sunrun's motion, sunshine-home warmth) — upstream and downstream barely share a vocabulary. Finally, there's the regulatory backdrop: green-claim rules are tightening worldwide, and greenwashing accusations often start with the name — an eco-promise in the brand name must be one the products can prove.",
      namingIdeas: [
        "Sun imagery plus a second root: sun/light/ray is the category's mother tongue but fully crowded — differentiation needs a second anchor (Sunrun's verb, a founder's name, a materials root); the sun alone is no longer a name",
        "Signal decades of reliability: run, last, anchor, granite roots — in a 25-year-warranty business, the name's first job is answering \"will you still exist when my panels age?\"",
        "Balance tech and green: pure eco register invites skepticism, pure tech register feels cold — the residential sweet spot is \"technology that makes the savings believable\"",
        "Put the savings in the name: the honest purchase driver for home solar is the utility bill, not the planet — names that face the money (save, run, zero) convert on the real motivation",
        "Design the global form early: solar is a born-global industry — validate the romanized form's readability and target-market trademarks before locking the name; LONGi's casing is a masterclass in global word-shape",
      ],
      cases: [
        { name: "Sunrun", takeaway: "sun + run: the sun set in motion — solar pulled from engineering project to lifestyle subscription; two single syllables readable worldwide, the benchmark of consumerized residential solar naming" },
        { name: "LONGi", takeaway: "Named in tribute to a revered educator, cased as LONGi: a heritage story inside a globally distinctive word-shape — proof that a Chinese manufacturer can carry founder-honoring depth into a worldwide B2B brand" },
        { name: "Tesla Energy", takeaway: "A scientist's surname extended into energy: the parent brand's technology halo underwrites batteries and roofs directly — brand-extension naming at maximum leverage, and why standalone solar brands avoid competing head-on" },
        { name: "First Solar", takeaway: "first + the category word: a leadership claim fused to maximum clarity, ideal for utility-scale procurement where clarity beats charm — functional naming with a built-in superlative" },
        { name: "Enphase", takeaway: "energy + phase: the electrical-engineering term doubles as the brand root, instantly credible to installers and engineers — hiding technical authority inside the morphology, the B2B counterpart to consumer sun-names" },
      ],
      pitfalls: [
        "Bare sun/solar/bright naming: the industry's worst collision zone — \"X Solar\" trademark refusals are routine, and search plus bid shortlists bury the undifferentiated",
        "Over-claiming green (zero-carbon, 100% clean in the name): greenwashing enforcement is tightening in every major market — an eco-promise the products can't prove invites regulators and headlines together",
        "Flimsy startup register on a 25-year promise: a cutesy name on a five-figure, decades-long contract makes homeowners hesitate at the signature line — heavy decisions need names with weight",
        "Skipping global-form validation: solar exports by default — check the romanized form's pronunciation in English and trademark conflicts in target markets before the name ships on a panel",
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
