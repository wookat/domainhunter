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
};

/** 8 个行业指南 slug 列表（顺序即导航展示顺序） */
export const GUIDE_LIST = Object.keys(INDUSTRY_GUIDES);

/** tld → 推荐该 TLD 的行业 guide slugs（用于 /tld 页底部互链，最多 3 个） */
export function guidesForTld(tld: string): string[] {
  return GUIDE_LIST.filter((slug) => INDUSTRY_GUIDES[slug].tlds.some((t) => t.tld === tld)).slice(0, 3);
}
