/**
 * 首页行业模板的描述全文（与 home-template-labels.ts 的 slug 一一对应）。
 * 仅通过动态 import 加载（点击 chip / ?tpl= 预填），不进首屏主 bundle。
 */
export const TEMPLATE_TEXTS: Record<string, { zh: string; en: string }> = {
  "saas": {
    zh: "一款面向中小团队的协作 SaaS 工具，寓意「把繁琐的工作流理顺、让团队更快交付」；气质要专业、可靠、有效率感；场景是公司官网、产品登录页和邮件签名里都好记好读。",
    en: "A collaboration SaaS tool for small teams. The name should evoke smoothing out messy workflows and helping teams ship faster; the vibe is professional, reliable, and efficient; it needs to read well on a company homepage, a login page, and in email signatures.",
  },
  "ecommerce": {
    zh: "一个面向年轻人的生活方式电商品牌，寓意「把好物带进日常、让生活更有质感」；气质要温润、有品味、容易产生信任；场景是包装盒、购物袋和社交媒体主页上都上镜好记。",
    en: "A lifestyle e-commerce brand for young shoppers. The name should suggest bringing well-made things into everyday life; the vibe is warm, tasteful, and trustworthy; it has to look good on packaging, shopping bags, and a social media profile.",
  },
  "ai": {
    zh: "一款 AI 驱动的智能助手产品，寓意「像多了一个聪明同事，把重复劳动交给机器」；气质要聪明、前沿、有未来感但不冰冷；场景是 Product Hunt 发布、技术博客和投资人 PPT 里都站得住。",
    en: "An AI-powered assistant product. The name should feel like having a brilliant teammate who takes over the repetitive work; the vibe is smart, cutting-edge, futuristic but not cold; it should hold up on a Product Hunt launch, in tech blogs, and on an investor deck.",
  },
  "blog": {
    zh: "一个记录思考与创作的个人博客，寓意「把想法沉淀下来、慢慢长成自己的小花园」；气质要安静、真诚、有书卷气；场景是读者在深夜读完一篇文章后，能凭名字记住并再次找到你。",
    en: "A personal blog for essays and creative work. The name should feel like a quiet garden where ideas settle and grow over time; the vibe is calm, sincere, and bookish; a reader who finishes a late-night post should remember the name and find their way back.",
  },
  "pets": {
    zh: "一个宠物用品与服务品牌，寓意「把毛孩子当家人，认真对待它们的每一餐每一天」；气质要温暖、活泼、让人会心一笑；场景是实体店招牌、外卖包装和小红书笔记里都可爱好认。",
    en: "A pet supplies and services brand. The name should convey treating furry kids as family and caring about every meal and every day; the vibe is warm, playful, and smile-inducing; it should charm on a storefront sign, delivery packaging, and social posts.",
  },
  "fintech": {
    zh: "一款面向年轻用户的理财记账工具，寓意「把钱管明白、让财富稳稳生长」；气质要可信、清爽、专业但不古板；场景是应用商店榜单和银行合作发布会上都拿得出手。",
    en: "A personal finance and budgeting app for younger users. The name should suggest understanding your money and letting wealth grow steadily; the vibe is trustworthy, clean, professional yet friendly; it must look credible on app store charts and at a bank partnership launch.",
  },
  "game": {
    zh: "一款轻量多人在线小游戏，寓意「一局开黑、即点即玩的快乐」；气质要好玩、有能量、喊起来顺口；场景是主播在直播间反复喊出名字、玩家在商店列表里一眼记住。",
    en: "A lightweight multiplayer web game. The name should evoke instant, jump-in-and-play fun with friends; the vibe is playful, energetic, and satisfying to shout; it must be memorable when streamers yell it on stream and players scroll past it in a store list.",
  },
  "edu": {
    zh: "一款让学习不再痛苦的在线学习工具，寓意「每天进步一点点、把知识点亮」；气质要可靠又有趣、不说教；场景是家长在付费页觉得靠谱、学习者每天打开时觉得轻松。",
    en: "An online learning tool that makes studying painless. The name should suggest steady daily progress and knowledge lighting up; the vibe is reliable yet fun, never preachy; it must reassure parents on the checkout page and feel light when learners open it every day.",
  },
  "travel": {
    zh: "一个帮人发现小众目的地的旅行品牌，寓意「出发去看没见过的世界」；气质要自由、开阔、有远方感；场景是朋友间口头推荐时一听就记住，机场广告牌上一眼有画面。",
    en: "A travel brand that helps people discover offbeat destinations. The name should evoke setting off to see an unseen world; the vibe is free, open, full of wanderlust; it must stick after one spoken referral and paint a picture on an airport billboard.",
  },
  "food": {
    zh: "一个主打现做轻食的餐饮品牌，寓意「新鲜、认真做好每一餐」；气质要温暖、干净、有食欲感；场景是门头招牌三米外看得清、外卖列表里一眼被点开、朋友说「今天吃它」顺口。",
    en: "A fresh-made casual food brand. The name should convey freshness and care in every meal; the vibe is warm, clean, appetizing; it must read from three meters on a storefront, get tapped in a delivery list, and roll off the tongue in \"let's eat there\".",
  },
  "fitness": {
    zh: "一款帮人养成运动习惯的健身产品，寓意「每天坚持一点、成为更强的自己」；气质要有能量、正向、像一枚身份徽章；场景是印在运动服上不违和、喊在训练营里带感。",
    en: "A fitness product that builds workout habits. The name should suggest daily persistence and becoming a stronger self; the vibe is energetic, positive, badge-like; it should look right printed on apparel and sound great shouted in a boot camp.",
  },
  "devtools": {
    zh: "一款让开发者提效的命令行工具，寓意「把重复的构建部署活儿一键搞定」；气质要极客、干脆、有点冷幽默；场景是全小写敲进终端手感顺滑、在 GitHub README 里酷而不装。",
    en: "A CLI tool that saves developers time. The name should evoke one-command builds and deploys; the vibe is hacker-ish, crisp, with a dry sense of humor; it must feel smooth typed lowercase in a terminal and look cool-but-not-trying in a GitHub README.",
  },
  "web3": {
    zh: "一个链上数据基础设施项目，寓意「像水电一样可靠的链上服务」；气质要专业、中立、有协议感、绝不土狗；场景是出现在审计报告和交易所公告里都站得住。",
    en: "An on-chain data infrastructure project. The name should feel like utility-grade reliability for the chain; the vibe is professional, neutral, protocol-like, never memecoin-ish; it must hold up in audit reports and exchange announcements.",
  },
  "agency": {
    zh: "一家小而美的设计咨询工作室，寓意「用专业判断帮客户把事做对」；气质要克制、可信、有方法论感；场景是印在提案封面和合同抬头上显得体面有分量。",
    en: "A small, sharp design consultancy. The name should convey professional judgment that gets things right; the vibe is restrained, credible, methodology-driven; it must carry weight on a proposal cover and a contract header.",
  },
  "photography": {
    zh: "一家人像与婚礼摄影工作室，寓意「把最重要的瞬间拍得配得上回忆」；气质要温暖、有作者感、经得起印在水印和请柬上；场景是客户向闺蜜转介绍时一遍就能说清。",
    en: "A portrait and wedding photography studio. The name should say the most important moments deserve this craft; the vibe is warm, authorial, worthy of a watermark and a wedding invitation; it must land in one telling when a client refers a friend.",
  },
  "podcast": {
    zh: "一档聊科技与生活的双人对谈播客，寓意「认真但不正经的深夜聊天」；气质要松弛、有态度、口播念起来顺；场景是听众通勤听到节目名，晚上还能凭记忆搜到。",
    en: "A two-host talk show on tech and life. The name should feel like earnest but playful late-night conversation; the vibe is relaxed, opinionated, smooth in a spoken intro; a commuter who hears it once must find it by memory that night.",
  },
  "realestate": {
    zh: "一个帮年轻人找到理想住处的找房平台，寓意「安家这件事值得被认真对待」；气质要稳重、可信、带一点温度；场景是出现在中介门店招牌和 App 商店里都让人放心。",
    en: "A home-finding platform for young renters and buyers. The name should say settling down deserves real care; the vibe is steady, trustworthy, with a touch of warmth; it must reassure on a storefront sign and in an app store alike.",
  },
  "health": {
    zh: "一款帮用户管理睡眠与压力的健康应用，寓意「被科学而温柔地照顾」；气质要安心、专业、绝不冰冷；场景是用户愿意推荐给爸妈用，说出名字时对方不会犹豫。",
    en: "A health app for sleep and stress. The name should feel like being cared for with science and gentleness; the vibe is reassuring, credible, never clinical-cold; users should feel comfortable recommending it to their parents by name.",
  },
  "legal": {
    zh: "一个面向小微企业的在线法律服务平台，寓意「请律师不该让人紧张」；气质要专业、可靠、亲切不吓人；场景是印在合同模板页脚和官网首页都稳得住。",
    en: "An online legal service for small businesses. The name should say hiring a lawyer shouldn't be intimidating; the vibe is professional, dependable, approachable; it must hold steady in a contract footer and on a homepage.",
  },
  "newsletter": {
    zh: "一份每周精选科技与商业洞察的 newsletter，寓意「每周一杯高浓度的认知咖啡」；气质要聪明、有节奏感、在收件箱里一眼想点开；场景是读者向同事转发时名字自带推荐语。",
    en: "A weekly newsletter of tech and business insight. The name should feel like a weekly shot of concentrated thinking; the vibe is smart, rhythmic, instantly clickable in an inbox; when a reader forwards it, the name itself is the endorsement.",
  },
  "music": {
    zh: "一个独立音乐厂牌与音乐人主页，寓意「把耳朵里的世界做成据点」；气质要有态度、耐听、带一点地下感；场景是歌单封面、演出海报和乐迷口口相传里都一次记住。",
    en: "An indie music label and artist hub. The name should feel like turning the world in your ears into home turf; the vibe is opinionated, listenable, a little underground; it must stick on playlist covers, gig posters, and in word of mouth on the first hearing.",
  },
  "beauty": {
    zh: "一个主打温和护肤的美妆个护品牌，寓意「善待皮肤，也善待每一天的自己」；气质要干净、有质感、值得信赖；场景是印在瓶身和出现在小红书笔记标题里都好看好记。",
    en: "A gentle-skincare beauty brand. The name should say be kind to your skin and to yourself; the vibe is clean, textured, trustworthy; it has to look beautiful printed on a bottle and read well in a social caption.",
  },
  "nonprofit": {
    zh: "一个乡村儿童阅读公益项目，寓意「一本书就是一扇窗」；气质要真诚、透明、有行动感；场景是出现在捐赠页和媒体报道里，让人第一眼就相信钱会花在孩子身上。",
    en: "A nonprofit bringing books to rural children. The name should say every book is a window; the vibe is sincere, transparent, action-driven; on a donation page or in press coverage it must make people trust where the money goes at first glance.",
  },
  "parenting": {
    zh: "一个新生代母婴用品品牌，寓意「陪孩子慢慢长大，也让父母安心」；气质要柔软、安全、有一点点童趣；场景是印在包装盒上让家长放心，说出口让孩子觉得亲切。",
    en: "A modern baby and parenting brand. The name should feel like growing up slowly together while parents rest easy; the vibe is soft, safe, gently playful; it must reassure parents on a package and sound friendly to a child's ear.",
  },
  "hardware": {
    zh: "一款面向创造者的智能硬件产品，寓意「把想法握在手里」；气质要精密、克制、有工业美感；场景是刻在铝合金机身上、印在包装盒上和出现在众筹页标题里都成立。",
    en: "A smart hardware product for makers. The name should feel like holding an idea in your hand; the vibe is precise, restrained, industrially beautiful; it must work engraved on an aluminum body, printed on a box, and in a crowdfunding headline.",
  },
  "security": {
    zh: "一家面向中小企业的网络安全服务公司，寓意「有人替你守着门」；气质要可靠、专业、有威慑力但不吓人；场景是出现在企业采购文档和安全报告里都站得住。",
    en: "A cybersecurity service for small businesses. The name should feel like someone standing guard at your door; the vibe is dependable, professional, deterrent without fear-mongering; it must hold up in procurement documents and security reports.",
  },
  "creator": {
    zh: "一个视频创作者的频道品牌，寓意「把有意思的东西讲给更多人听」；气质要鲜活、有记忆点、一听就会拼写；场景是片头口播、跨平台账号名和商务合作介绍里都好念好记。",
    en: "A video creator's channel brand. The name should feel like telling fascinating things to a growing audience; the vibe is lively, hooky, and instantly spellable after one listen; it must work spoken in intros, as a cross-platform handle, and in sponsorship decks.",
  },
  "freelance": {
    zh: "一个自由职业者的个人工作室品牌，寓意「一个人也能交付专业水准」；气质要专业、可信、有手艺人感；场景是报价单、发票抬头和作品集网站上都站得住。",
    en: "A freelancer's one-person studio brand. The name should say a single craftsperson can deliver professional-grade work; the vibe is professional, trustworthy, artisan; it must hold up on quotes, invoice headers, and a portfolio site.",
  },
  "fashion": {
    zh: "一个面向年轻人的服饰潮牌，寓意「把态度穿在身上」；气质要有张力、克制的酷、经得起印在胸口；场景是吊牌、胸前印花和电商详情页里都好看好记。",
    en: "A streetwear label for young customers. The name should feel like wearing an attitude; the vibe is tense, coolly restrained, and worthy of a chest print; it has to look good on hang tags, prints, and a product page.",
  },
  "coffee": {
    zh: "一家社区咖啡馆兼线上豆单品牌，寓意「一杯好咖啡带来的片刻安顿」；气质要温暖、有场所感、值得拍照分享；场景是招牌、杯身和豆袋包装上都上镜好认。",
    en: "A neighborhood café that also sells beans online. The name should evoke the settled moment a good cup brings; the vibe is warm, place-like, photo-worthy; it must charm on a signboard, a cup, and a coffee-bag label.",
  },
  "automotive": {
    zh: "一个新能源出行品牌，寓意「把远方变近，把出发变简单」；气质要有速度感、可靠、面向未来但不浮夸；场景是车尾标、发布会大屏和 App 图标上都立得住。",
    en: "A new-energy mobility brand. The name should make distance feel closer and setting off feel effortless; the vibe is fast, dependable, future-facing without hype; it must hold up on a tailgate badge, a launch-event screen, and an app icon.",
  },
  "community": {
    zh: "一个付费会员制社区，寓意「同路人聚在一起互相点亮」；气质要有归属感、值得自称、圈内人一眼认亲；场景是成员自我介绍、社区首页和续费页里都自然得体。",
    en: "A paid membership community. The name should feel like fellow travelers gathering to light each other up; the vibe is belonging, worth self-identifying with, instantly recognizable to insiders; it must feel natural in member intros, on the community homepage, and on the renewal page.",
  },
  "wedding": {
    zh: "一个高端婚礼策划工作室，寓意「把一生一次的时刻办得郑重又动人」；气质要浪漫、有审美、值得托付；场景是婚礼展台、请柬落款和准新娘转发给闺蜜的链接里都优雅得体。",
    en: "A high-end wedding planning studio. The name should convey making a once-in-a-lifetime moment solemn and moving; the vibe is romantic, tasteful, and trustworthy; it must look elegant on an expo booth, an invitation footer, and in the link a bride forwards to her best friend.",
  },
  "bnb": {
    zh: "一个有主人温度的民宿品牌，寓意「推开门就是另一种生活」；气质要在地、温暖、有栖居感；场景是订房平台列表里一眼与连锁酒店区分开，客人退房后向朋友转述时顺口好记。",
    en: "A boutique BnB brand with a host's warmth. The name should feel like opening a door into another way of living; the vibe is local, warm, and homelike; it must stand apart from chain hotels in a booking list and roll off the tongue when guests retell it to friends.",
  },
  "courses": {
    zh: "一个在线课程与知识付费品牌，寓意「学完就能看见更好的自己」；气质要专业、有结果感、值得付费；场景是转发海报的大标题、付款页和学员说「我报了它的课」时都站得住。",
    en: "An online course and creator-education brand. The name should promise a better self on the other side of the course; the vibe is expert, outcome-driven, worth paying for; it must hold up as a launch-graphic headline, on the checkout page, and in \"I enrolled in X\".",
  },
  "boardgame": {
    zh: "一个原创桌游工作室，寓意「把朋友聚到一张桌子上创造回忆」；气质要有想象力、有出品感、喊起来顺口；场景是游戏盒封面、众筹页标题和「今晚玩它吧」的提议里都响亮好记。",
    en: "An indie tabletop game studio. The name should evoke gathering friends around one table to make memories; the vibe is imaginative, well-crafted, and satisfying to say; it must ring out on a game box cover, a crowdfunding headline, and in \"let's play it tonight\".",
  },
  "outdoor": {
    zh: "一个户外露营装备与生活方式品牌，寓意「离开城市，去更大的世界扎营」；气质要辽阔、可靠、有山野气；场景是绣在冲锋衣胸口、压印在钛杯上和营地口碑推荐里都经得起打量。",
    en: "An outdoor gear and camp-life brand. The name should evoke leaving the city to pitch camp in a wider world; the vibe is vast, dependable, mountain-worn; it must hold up embroidered on a jacket chest, stamped on a titanium mug, and in campsite word of mouth.",
  },
  "cleaning": {
    zh: "一个上门家政清洁服务品牌，寓意「推开家门那一刻焕然一新的如释重负」；气质要可靠、亲切、值得托付钥匙；场景是地图搜索卡片、客户通讯录备注和邻里转介绍里都专业好记。",
    en: "An on-demand home cleaning service brand. The name should capture the fresh relief of opening the door to a spotless home; the vibe is reliable, friendly, key-trustworthy; it must look professional in a map listing, survive being saved in contacts, and travel in neighbor referrals.",
  },
  "marketing": {
    zh: "一个数字营销机构/MCN 品牌，寓意「让品牌被看见、让增长有方法」；气质要专业、有创意锋芒、比稿会议上念出来有底气；场景是提案封面、邮件签名和「我们请了 X 来做投放」的转述里都立得住。",
    en: "A digital marketing agency or creator-network brand. The name should promise visibility and methodical growth; the vibe is sharp, creative, boardroom-credible; it must hold up on a proposal cover, in an email signature, and in \"we hired X for our campaigns\".",
  },
  "therapy": {
    zh: "一个心理咨询与心理健康服务品牌，寓意「一个不被评判的安全所在」；气质要温和、可信赖、零威胁感；场景是深夜搜索的结果页、朋友间的推荐和「我在用 X」的坦然表达里都让人安心。",
    en: "A therapy and mental wellness brand. The name should feel like a safe, unjudging place; the vibe is gentle, trustworthy, zero-threat; it must reassure on a late-night search results page, in a friend's recommendation, and in saying \"I've been using X\" out loud.",
  },
  "resale": {
    zh: "一个二手交易/循环经济平台品牌，寓意「让好东西再流转一次，淘到即是缘分」；气质要轻快、有寻宝感、不显旧；场景是闲置转让的对话、开箱分享和「我在 X 上淘到的」炫耀里都好玩好记。",
    en: "A resale and circular-economy marketplace brand. The name should evoke good things finding a second life and the thrill of the find; the vibe is playful, treasure-hunty, never shabby; it must sparkle in listing chats, unboxing posts, and \"I scored this on X\" brags.",
  },
  "recruiting": {
    zh: "一个招聘平台/HR 服务品牌，寓意「让人与机会彼此找到」；气质要专业、有机遇感、对求职者尊重对企业可靠；场景是「我在 X 上找到这份工作」的口碑、HR 采购清单和职场社交里都自然顺口。",
    en: "A recruiting platform or HR services brand. The name should evoke people and opportunities finding each other; the vibe is professional, opportunity-charged, respectful to candidates and credible to employers; it must flow in \"I found this job on X\", on procurement lists, and across professional networks.",
  },
  "eldercare": {
    zh: "一个养老服务与银发生活品牌，寓意「岁月向晚，生活继续体面而丰盛」；气质要有尊严、温暖、值得托付；场景是子女在家庭群里的推荐、长辈「我住在 X」的自豪表达和亲友转述里都安心得体。",
    en: "A senior care and later-life brand. The name should promise life continuing with dignity and abundance; the vibe is dignified, warm, worthy of a family's trust; it must reassure in a family group chat, sound proud in \"I live at X\", and travel gracefully in word of mouth.",
  },
  "logistics": {
    zh: "一个物流货运/跨境供应链品牌，寓意「使命必达，每一件货都被稳稳送到」；气质要可靠、高效、有网络感；场景是货车车身、快递面单和「发 X 的货，放心」的口碑里都清晰响亮。",
    en: "A logistics, freight or cross-border supply-chain brand. The name should promise every shipment arriving surely and on time; the vibe is dependable, efficient, network-strong; it must read clearly on a truck side, a shipping label, and in \"ship it with X, don't worry\".",
  },
  "agent": {
    zh: "一个 AI 智能体/Agent 产品品牌，寓意「一个可以放心把活交给它的 AI 同事」；气质要拟人、可托付、稳重不轻佻；场景是「让 X 帮我处理一下」的日常委托、企业安全审查清单和开发者社区讨论里都立得住。",
    en: "An AI agent product brand. The name should feel like an AI coworker you can hand work to; the vibe is human-like, delegation-worthy, steady not gimmicky; it must work in \"let X handle it\", on an enterprise security-review list, and in developer-community threads.",
  },
  "crossborder": {
    zh: "一个跨境电商/出海品牌，寓意「无国界的好货与信任」；气质要国际化、好读好拼、无文化歧义；场景是海外社交广告、亚马逊搜索框和不同母语客人的口口相传里都念得出、记得住。",
    en: "A cross-border e-commerce brand going global. The name should carry borderless quality and trust; the vibe is international, easy to read and spell, free of cultural landmines; it must survive social ads abroad, the Amazon search box, and word of mouth across native languages.",
  },
  "escaperoom": {
    zh: "一个剧本杀/密室逃脱/沉浸式娱乐品牌，寓意「推开门就进入另一个世界」；气质要有悬念、有戏剧感、让人好奇；场景是「周六去 X 玩不玩」的组局邀约、点评平台搜索和玩家探店笔记里都抓人好记。",
    en: "An escape room or immersive entertainment venue brand. The name should feel like a doorway into another world; the vibe is mysterious, theatrical, curiosity-sparking; it must hook in \"anyone up for X on Saturday?\", stand out in review-app search, and stick in players' visit notes.",
  },
  "bakery": {
    zh: "一个烘焙甜品/私房蛋糕品牌，寓意「出炉那一刻的香气与庆祝时刻的甜」；气质要温暖、手作、上镜好看；场景是礼盒丝带、生日贺卡和「我在 X 订的蛋糕」的晒图里都甜而不腻。",
    en: "A bakery or dessert brand. The name should carry the aroma of fresh-from-the-oven and the sweetness of celebration; the vibe is warm, handcrafted, camera-ready; it must look right on a gift-box ribbon, a birthday card, and in \"I ordered it from X\" posts.",
  },
  "bookstore": {
    zh: "一个书店/独立出版品牌，寓意「一个可以安放精神的地方」；气质要有书卷气、有立场、经得起读书人审视；场景是书脊、门头灯箱和读者「我常去 X」的归属感表达里都隽永耐看。",
    en: "A bookstore or independent press brand. The name should feel like a place for the mind to dwell; the vibe is literary, principled, able to survive well-read scrutiny; it must age well on a book spine, a storefront sign, and in a reader's \"I'm a regular at X\".",
  },
  "florist": {
    zh: "一个花店/花艺工作室品牌，寓意「把心意开成一束花」；气质要诗意、美好、配得上被当作礼物送出；场景是贺卡署名、节日订花搜索和客户晒花束的照片里都添一分心意。",
    en: "A florist or floral design studio brand. The name should read like sentiment arranged into a bouquet; the vibe is poetic, beautiful, worthy of being given; it must add grace to a gift-card signature, holiday flower searches, and customers' bouquet photos.",
  },
  "interior": {
    zh: "一个装修/室内设计品牌，寓意「把毛坯变成想回去的家」；气质要可靠、有审美、值得托付钥匙和预算；场景是作品集封面、业主群转介绍和「我家是 X 做的」的口碑里都专业立得住。",
    en: "An interior design or renovation brand. The name should evoke turning bare walls into a home worth coming back to; the vibe is dependable, tasteful, worthy of keys and budget; it must hold up on a portfolio cover, in homeowner group referrals, and in \"X did our place\".",
  },
  "studyabroad": {
    zh: "一个留学咨询/国际教育品牌，寓意「从此岸到彼岸的可靠引路人」；气质要专业、有出路感、家长信任学生不嫌土；场景是家长群推荐、申请邮件署名和院校合作名录里双语都立得住。",
    en: "A study-abroad consultancy or international education brand. The name should feel like a trusted guide across the crossing; the vibe is professional, opportunity-rich, credible to parents yet cool enough for students; it must work in parent group chats, application email signatures, and university partner lists in both languages.",
  },
  "usedcar": {
    zh: "一个二手车品牌/车行，寓意「每一辆车的过去都查得清、买得放心」；气质要透明、实在、无套路；场景是电话报价、本地车友群和「我在 X 看了一辆」的转述里都可信顺口。",
    en: "A used car marketplace or dealership brand. The name should promise every car's history is checkable and the deal is safe; the vibe is transparent, straight-dealing, no games; it must sound credible in a phone quote, a local car group, and in \"I saw one at X\".",
  },
  "insurance": {
    zh: "一个保险经纪/保险科技品牌，寓意「出事那天真的有人管」；气质要稳重、可信、又不冷冰冰；场景是家人群里的推荐、理赔时刻打开的 App 和「我买的是 X 家」的坦然表达里都安心。",
    en: "An insurance brokerage or insurtech brand. The name should promise someone's really got you on the bad day; the vibe is steady, trustworthy, yet human not cold; it must reassure in a family group recommendation, on the app opened at claim time, and in \"I'm covered by X\".",
  },
  "farm": {
    zh: "一个农场/生鲜品牌，寓意「离土地最近的新鲜与实在」；气质要自然、时令、有产地故事；场景是包装箱面、社区团购开团文案和「我家一直吃 X」的复购口碑里都可信好念。",
    en: "A farm or fresh food brand. The name should carry the freshness and honesty of being close to the land; the vibe is natural, seasonal, rich with provenance; it must read true on a produce box, in a group-buy announcement, and in \"we've always bought from X\".",
  },
  "barber": {
    zh: "一个理发店/美发工作室品牌，寓意「把接下来一个月的形象放心交给它」；气质要有手艺感、亲切、经得起十年熟客；场景是门头招牌、地图搜索和「我一直在 X 剪」的长期转述里都顺口耐听。",
    en: "A barbershop or hair salon brand. The name should feel worth trusting with next month's look; the vibe is craft-forward, friendly, built for ten-year regulars; it must wear well on a shopfront sign, in map search, and in \"I've been going to X for years\".",
  },
  "yoga": {
    zh: "一个瑜伽馆/普拉提工作室品牌，寓意「一小时属于自己的呼吸与平衡」；气质要安静、有灵性又专业不玄；场景是会员卡、小红书打卡照和「我每周去 X 上三次课」的长期转述里都顺口耐听。",
    en: "A yoga or Pilates studio brand. The name should evoke an hour of breath and balance that belongs to you; the vibe is calm, soulful yet professionally grounded; it must wear well on a membership card, in check-in photos, and in \"I take three classes a week at X\".",
  },
  "vet": {
    zh: "一家宠物医院/动物诊所品牌，寓意「毛孩子生病的那天，真的有专业的人管」；气质要专业安心、温暖不轻浮；场景是深夜急诊搜索、诊所门头和「快送 X 医院」的紧急呼喊里都可信好认。",
    en: "A veterinary clinic or animal hospital brand. The name should promise that on the day a furry kid gets sick, real professionals have it handled; the vibe is clinically credible, warm, never flippant; it must hold up in a midnight emergency search, on the clinic sign, and in \"get her to X, now!\".",
  },
  "esports": {
    zh: "一支电竞战队/电竞俱乐部品牌，寓意「为胜利而战、让粉丝喊得热血」；气质要有战意、够潮、缩写好看；场景是解说嘶吼、比分牌缩写和粉丝弹幕应援里都响亮带感。",
    en: "An esports team or gaming org brand. The name should burn with the will to win and give fans something to scream; the vibe is fierce, streetwear-cool, with a great-looking tag; it must ring out in a caster's shoutcall, on the scoreboard abbreviation, and in fan chat spam.",
  },
  "drone": {
    zh: "一个无人机航拍/飞行服务品牌，寓意「用从未见过的角度看世界」；气质要专业、开阔、有技术感不像玩具；场景是片尾署名、作品集网站和企业巡检投标书里都立得住。",
    en: "A drone services or aerial photography brand. The name should evoke seeing the world from an angle no one has seen; the vibe is professional, expansive, engineered rather than toy-like; it must hold up in video end credits, on a portfolio site, and in an enterprise inspection bid.",
  },
  "hanfu": {
    zh: "一个汉服/国潮品牌，寓意「把千年的美穿回日常」；气质要有古意、有出处、好念好打不生僻；场景是直播间口播、话题标签和出海独立站的拼音形态里都雅致好传播。",
    en: "A hanfu or China-chic (guochao) brand. The name should carry a millennium of beauty back into everyday wear; the vibe is classical, well-sourced, easy to say and type; it must stay graceful in livestream shout-outs, hashtags, and the romanized form on an overseas store.",
  },
  "dental": {
    zh: "一家口腔诊所/牙科品牌，寓意「看牙不再可怕，笑容值得被认真对待」；气质要安心、专业、有微笑感不冰冷；场景是家庭群推荐、诊所招牌和「明天去 X 看牙」的日常表达里都让人放松。",
    en: "A dental clinic or oral care brand. The name should make dental visits feel safe and smiles worth caring for; the vibe is reassuring, professional, smile-warm rather than clinical-cold; it must relax people in a family group recommendation, on the clinic sign, and in \"I'm going to X tomorrow\".",
  },
  "accounting": {
    zh: "一家会计事务所/财税服务品牌，寓意「账本交给它就不会出错」；气质要稳健、专业、值得托付不轻飘；场景是审计报告署名、企业客户尽调和「记账找 X」的老板圈转介绍里都立得住。",
    en: "An accounting firm or tax service brand. The name should promise that the books are in hands that don't make mistakes; the vibe is steady, professional, trustworthy rather than flashy; it must hold up as an audit report signature, in client due diligence, and in \"use X for your books\" referrals.",
  },
  "livestream": {
    zh: "一个直播电商/主播 IP 品牌，寓意「进直播间就像逛一个信得过的好店」；气质要响亮、有人设、口播喊得出；场景是主播口播、弹幕刷屏和「去 X 直播间蹲折扣」的日常转述里都好听好记。",
    en: "A livestream commerce or creator shop brand. The name should feel like walking into a trusted store that happens to be live; the vibe is loud-friendly, persona-driven, made to be shouted; it must ring out in host shout-outs, chat spam, and \"catch the drop at X tonight\".",
  },
  "translation": {
    zh: "一个翻译/本地化服务品牌，寓意「跨过语言的墙，意思一点不丢」；气质要专业、国际化、名字自己先经得起多语言念读；场景是跨国合同署名、开发者文档和「本地化交给 X」的采购推荐里都可信顺口。",
    en: "A translation or localization brand. The name should promise that meaning crosses the language wall intact; the vibe is professional, international, and the name itself must read cleanly in every major language; it must hold up on cross-border contracts, in developer docs, and in \"we use X for localization\".",
  },
  "gardening": {
    zh: "一个园艺绿植品牌，寓意「给生活留一平米会呼吸的绿」；气质要治愈、有生长感、好养活不娇气；场景是快递包裹、窗台打卡照和「我在 X 买的绿萝一直活着」的口碑转述里都温暖耐看。",
    en: "A gardening or plant brand. The name should evoke a square meter of breathing green in everyday life; the vibe is soothing, growth-minded, hardy rather than precious; it must wear well on a shipping box, in windowsill photos, and in \"my plant from X is still thriving\".",
  },
  "coworking": {
    zh: "一个联合办公/共享空间品牌，寓意「和一群同路人把事做成的地方」；气质要有归属感、专业不失活力；场景是楼宇招牌、地图搜索和「我在 X 上班」的日常介绍里都体面顺口。",
    en: "A coworking or shared space brand. The name should feel like the place where fellow travelers get things done; the vibe is belonging-first, professional yet energetic; it must look right on building signage, in map search, and sound good in \"I work out of X\".",
  },
  "solar": {
    zh: "一个光伏/新能源品牌，寓意「把阳光变成每个月省下的电费」；气质要可靠、有科技感、扛得住二十五年质保的托付；场景是屋顶工程合同、投标书和「装光伏找 X」的邻里转介绍里都有分量。",
    en: "A solar or clean energy brand. The name should turn sunlight into a lower bill every month; the vibe is dependable, engineered, solid enough for a 25-year warranty; it must carry weight on an installation contract, in a project bid, and in \"get your panels from X\" neighbor referrals.",
  },
  "coach": {
    zh: "一个健身私教/私教工作室品牌，寓意「把身体交给一个真正靠谱的人」；气质要专业、有能量、不吓人不推销；场景是学员转介绍口播、地图搜索和「你去找 X 练」的朋友推荐里都可信顺口。",
    en: "A personal trainer or PT studio brand. The name should feel like handing your body to someone truly reliable; the vibe is professional, energetic, never intimidating or salesy; it must hold up in client referrals, map search, and a friend's \"just train with X\".",
  },
  "codingschool": {
    zh: "一家编程培训/少儿编程机构品牌，寓意「让代码从黑魔法变成亲手做东西的乐趣」；气质要聪明、有趣、不像应试补习班；场景是家长群转发、学员简历和「我在 X 学的编程」的转介绍里都体面好记。",
    en: "A coding school or bootcamp brand. The name should turn code from dark art into the joy of making things; the vibe is smart, fun, nothing like a test-prep shop; it must look right forwarded in a parents' group, on a graduate's resume, and in \"I learned to code at X\".",
  },
  "jewelry": {
    zh: "一个珠宝首饰品牌，寓意「值得刻在戒圈内侧、写进故事里的名字」；气质要优雅、有故事感、十年不过时；场景是礼盒印字、求婚讲述和「她戴的是 X」的转述里都配得上价格。",
    en: "A jewelry brand. The name should deserve to be engraved inside a ring and written into a story; the vibe is elegant, storied, timeless for a decade; it must earn its price on a gift box, in a proposal retelling, and in \"she wears X\".",
  },
  "toys": {
    zh: "一个玩具/潮玩品牌，寓意「孩子念着开心、大人拆盒惊喜」；气质要欢乐、有弹跳感、留得住 IP 想象；场景是货架包装、拆盒视频和「给娃买 X」的家长转述里都好念好记。",
    en: "A toy or designer-toy brand. The name should be fun in a child's mouth and a thrill at unboxing for adults; the vibe is joyful, bouncy, with room for an IP universe; it must pop on shelf packaging, in unboxing videos, and in \"get the kids an X\".",
  },
  "brewery": {
    zh: "一个精酿啤酒/新酒饮品牌，寓意「杯子里装的是态度不是水啤」；气质要有梗、敢反叛、酒标画得出来；场景是酒吧口播点单、冰柜货架和「尝尝 X 的新款」的酒友安利里都响亮带感。",
    en: "A craft brewery or drinks brand. The name should put attitude in the glass, not watery lager; the vibe is witty, rebellious, drawable as label art; it must ring out when ordered at the bar, stand out on the fridge shelf, and carry \"try the new one from X\".",
  },
  "furniture": {
    zh: "一个家具/家居品牌，寓意「一件陪你住十年的东西，名字也要耐看十年」；气质要温润、有材质感、经得起岁月；场景是新家开箱、朋友问「这沙发哪买的」和二手转卖页里都体面耐看。",
    en: "A furniture or home brand. The name should wear as well as a piece that lives with you for a decade; the vibe is warm, material-honest, built to age gracefully; it must look right at a housewarming, in \"where's this sofa from?\", and even on a resale listing.",
  },
  "crossfit": {
    zh: "一个 CrossFit/综合体能馆品牌，寓意「一群人互相打气把自己练崩再练强」；气质要有汗味、有战意、有部落图腾感；场景是教练开场口号、队服背印和「周六来 X 玩一场」的会员邀约里都喊得响。",
    en: "A CrossFit box or functional fitness gym. The name should carry the tribe that cheers each other through brutal workouts; the vibe is sweaty, battle-ready, totem-like; it must roar in a coach's class opener, print well on team shirts, and carry \"come try a class at X on Saturday\".",
  },
  "language": {
    zh: "一个语言学习产品，寓意「每天五分钟，离另一种语言更近一点」；气质要轻盈、游戏感、跨语言都好念；场景是打卡分享、应用商店搜索和「我在用 X 学日语」的朋友转述里都轻松上口。",
    en: "A language learning product. The name should make \"five minutes a day\" feel believable; the vibe is light, playful, pronounceable in any native tongue; it must shine in streak shares, app-store search, and \"I'm learning Japanese on X\".",
  },
  "resume": {
    zh: "一个简历/求职工具，寓意「用了它，面试敲门更有底气」；气质要专业、给人信心、敢被 HR 看见；场景是简历页脚署名、深夜投递和「我靠 X 拿到 offer」的转述里都体面加分。",
    en: "A resume builder or job-search tool. The name should make users walk into interviews taller; the vibe is professional, confidence-giving, proud to be seen by recruiters; it must look right in a resume footer, at a midnight application, and in \"I landed the offer with X\".",
  },
  "events": {
    zh: "一个活动策划公司，寓意「不容有失的时刻，交给我准没错」；气质要专业稳当、又藏着创意火花；场景是比稿 PPT 封面、场地背板署名和「年会找 X 办准没错」的转介绍里都撑得住场。",
    en: "An event planning company. The name should promise a moment that cannot fail is in good hands; the vibe is dependable with a creative spark; it must hold up on a pitch-deck cover, a venue backdrop credit, and \"for the gala, just call X\".",
  },
  "moving": {
    zh: "一个搬家服务品牌，寓意「全部家当交给它，稳稳当当搬进新生活」；气质要可靠、利落、有人情味；场景是电话报价自报家门、货车车身和「搬家就找 X」的邻里推荐里都一听就放心。",
    en: "A moving services brand. The name should promise everything you own arrives safely in the new life; the vibe is reliable, brisk, human; it must land in one hearing on a quote call, read at a glance on the truck, and carry \"just use X\" between neighbors.",
  },
  "aquarium": {
    zh: "一个水族/爬宠品牌，寓意「一缸一世界的静观生态美学」；气质要静谧、通透、专业懂行；场景是开缸分享帖标题、器材包装和爬友圈的口碑安利里都显得内行。",
    en: "An aquarium or reptile brand. The name should hold a world in a glass box; the vibe is still, crystal-clear, quietly expert; it must read right titling a tank-journal post, on gear packaging, and in word of mouth among serious keepers.",
  },
  "indiehacker": {
    zh: "一款独立开发者做的效率小工具，寓意「一个人也能做出很多人爱用的产品」；气质要轻巧、真诚、有极客味；场景是 Product Hunt 发布页、X 帖子和「我做了 X」的自我介绍里都顺口好记。",
    en: "A productivity tool built by an indie hacker. The name should feel like one person shipping something many people love; the vibe is light, sincere, quietly geeky; it must roll off the tongue on a Product Hunt launch, in an X post, and in \"I built X\".",
  },
  "petsupplies": {
    zh: "一个宠物用品电商品牌，寓意「毛孩子的每一餐每一个玩具都值得认真挑」；气质要温暖、可信、让人愿意月月回购；场景是电商搜索结果、快递箱面单和铲屎官群里的安利都好认好念。",
    en: "A pet supplies e-commerce brand. The name should promise every meal and toy for the furry kid is carefully chosen; the vibe is warm, trustworthy, worth reordering monthly; it must stand out in marketplace search, on the shipping box, and in pet-owner group chats.",
  },
  "preschool": {
    zh: "一个儿童早教与启蒙品牌，寓意「像种子发芽一样，陪孩子一点点长大」；气质要温暖专业、让家长放心、让孩子喜欢；场景是妈妈群转介绍、报名页和孩子喊「我要玩 X」时都成立。",
    en: "An early childhood education brand. The name should feel like a seed sprouting — growing with the child day by day; the vibe is warm yet expert, reassuring to parents, delightful to kids; it must work in parent group referrals, on the enrollment page, and when a toddler shouts \"I want to play X\".",
  },
  "travelshoot": {
    zh: "一个旅拍摄影品牌，寓意「把此刻在此地的时光定格带走」；气质要浪漫、通透、有远方感又显专业；场景是照片水印、小红书定位标签和评论区「摄影师是谁求 @」里都好记好搜。",
    en: "A travel photography brand. The name should promise this moment, in this place, kept forever; the vibe is romantic, luminous, wanderlust-tinged yet professional; it must read well as a photo watermark, in a location tag, and in \"who's the photographer? tag them!\" comments.",
  },
  "forwarder": {
    zh: "一个跨境物流货代品牌，寓意「货一定安全准时到达世界任何角落」；气质要稳、专业、有全球网络感；场景是卖家询价微信、海外代理英文邮件和报价单抬头上都可信顺口。",
    en: "A cross-border freight forwarding brand. The name should promise cargo arrives safely and on time anywhere in the world; the vibe is steady, professional, globally networked; it must sound credible in a seller's quote request, an overseas agent's email, and on the rate card header.",
  },
  "mcn": {
    zh: "一家短视频 MCN 机构，寓意「一套能把达人做火的造星系统」；气质要有能量、正规、有内容宇宙感；场景是达人签约谈判、品牌方报价单和平台机构榜单里都拿得出手。",
    en: "A short-video MCN agency. The name should feel like a star-making system that turns creators into hits; the vibe is energetic, legitimate, universe-scale; it must impress in creator signing talks, on a brand's rate card, and on platform agency leaderboards.",
  },
  "opensource": {
    zh: "一个开源项目，寓意「一群人一起把一个好工具做到极致」；气质要简洁、有极客彩蛋感、全小写好敲；场景是 npm install 命令、README 标题和技术分享里的「我们用 X 替换了它」都顺手顺口。",
    en: "An open source project. The name should feel like a community polishing one great tool together; the vibe is minimal, quietly witty, all-lowercase and typeable; it must work as an npm install command, a README title, and in \"we replaced it with X\" conference talks.",
  },
  "indiegame": {
    zh: "一款独立游戏或游戏工作室，寓意「一段只有这里才有的独特体验」；气质要有情绪浓度、有世界观想象、一听就想搜；场景是 Steam 搜索框、主播口播「今天玩 X」和玩家安利帖里都好找好记。",
    en: "An indie game or studio. The name should promise an experience found nowhere else; the vibe is emotionally dense, world-evoking, instantly searchable; it must be findable in the Steam search box, in a streamer's \"today we're playing X\", and in fan recommendation posts.",
  },
  "gearrental": {
    zh: "一个摄影棚与摄影器材租赁品牌，寓意「设备准时到、灯全亮、棚准点开门」；气质要专业、靠谱、有圈内懂行感；场景是摄影师的「棚我订的 X」转介绍、报价单抬头和同城闪送面单上都可信顺口。",
    en: "A photo studio and camera gear rental brand. The name should promise the gear arrives, the lights fire, the studio opens on time; the vibe is professional, dependable, insider-fluent; it must sound right in a photographer's referral, on a quote header, and on a same-day delivery label.",
  },
  "sourcing": {
    zh: "一个电商选品与市场分析工具，寓意「比别人早一步看到爆款」；气质要敏锐、数据感、像一台选品雷达；场景是卖家教程口播「我用的是 X」、卖家社群安利和订阅付费页上都可信好记。",
    en: "An e-commerce product research tool. The name should feel like seeing the winning product one step before everyone else; the vibe is sharp, data-driven, radar-like; it must land in tutorial voice-overs (\"I use X\"), seller community referrals, and on the subscription pricing page.",
  },
  "fleamarket": {
    zh: "一个线下市集与快闪活动品牌，寓意「有趣的人在有趣地聚集」；气质要好玩、上镜、有在地文化感；场景是小红书封面海报、朋友圈「这周末去 X」和主理人招商函里都亮眼可信。",
    en: "A flea market and pop-up event brand. The name should feel like interesting people gathering interestingly; the vibe is playful, photogenic, rooted in local culture; it must pop on a poster, in \"let's hit X this weekend\" messages, and in vendor recruitment letters.",
  },
  "ski": {
    zh: "一个滑雪装备与雪友社群品牌，寓意「山就在那里，雪季永远值得」；气质要野、有速度感、又撑得起专业信任；场景是雪道上的呼喊、雪具吊牌和雪友群「去 X 家拿板」的安利里都一遍听清。",
    en: "A ski gear and snow community brand. The name should feel like the mountain is calling and the season is always worth it; the vibe is wild, fast, yet safety-grade trustworthy; it must carry through a shout across the slope, on a gear hangtag, and in \"grab your board at X\" crew chats.",
  },
  "aiart": {
    zh: "一款 AI 绘画与图像生成工具，寓意「把脑海里的画面念咒成像」；气质要有魔法感、想象力、又像一件可靠的创作工具；场景是作品水印、社区话题标签和「用 X 跑的」口播安利里都短小好搜。",
    en: "An AI image generation tool. The name should feel like conjuring the picture in your head into pixels; the vibe is magical, imaginative, yet dependable as a creative tool; it must stay short and searchable as a watermark, in hashtags, and in \"made with X\" mentions.",
  },
  "campsite": {
    zh: "一个露营地与营地运营品牌，寓意「离开城市，把日子搬到星空下」；气质要野而不糙、有画面感、让人想立刻出发；场景是小红书定位标签、导航目的地和「这周末去 X」的召唤里都好记好搜。",
    en: "A campground and camp operations brand. The name should feel like moving life under the stars, away from the city; the vibe is wild yet polished, scenic, instantly wanderlust-inducing; it must work as a location tag, a navigation destination, and in \"X this weekend?\" group chats.",
  },
  "tcm": {
    zh: "一个中医养生与草本理疗品牌，寓意「顺着节气把身体慢慢养回来」；气质要温润专业、有东方底蕴、又不老气说教；场景是预约小程序、门店招牌和年轻人「去 X 做个推拿」的安利里都可信顺口。",
    en: "A TCM wellness and herbal therapy brand. The name should feel like gently nursing the body back in rhythm with the seasons; the vibe is warm, professional, deeply Eastern yet never musty; it must sound credible on a booking page, a storefront sign, and in \"let's get a massage at X\" referrals.",
  },
  "deskcraft": {
    zh: "一个桌面文创与文具周边品牌，寓意「把 8 小时的案头过成自己喜欢的样子」；气质要有审美立场、治愈、值得收集；场景是桌搭笔记、开箱视频和市集摊位招牌上入镜都好看好记。",
    en: "A stationery and desk accessories brand. The name should feel like making your eight desk-bound hours your own; the vibe is aesthetically opinionated, soothing, collectible; it must look good on camera in desk-setup posts, unboxing videos, and on a market-stall sign.",
  },
  "petmemorial": {
    zh: "一个宠物殡葬与纪念服务品牌，寓意「温柔地送毛孩子走完最后一程」；气质要温暖、庄重而不冰冷、值得托付；场景是深夜含泪的搜索、宠物医院的转介绍和纪念品包装上都温柔可信。",
    en: "A pet aftercare and memorial service brand. The name should promise a gentle send-off for the furry family member; the vibe is warm, dignified without coldness, worthy of trust; it must feel tender in a tearful 2 a.m. search, a vet's referral, and on keepsake packaging.",
  },
  "postpartum": {
    zh: "一个月子中心与产后护理品牌，寓意「新手妈妈被温柔地接住」；气质要轻奢温暖、有医护级专业感、全家人都放心；场景是妈妈群转介绍、参观预约页和长辈口中念出来都顺口吉利。",
    en: "A postpartum retreat and maternal care brand. The name should feel like a new mother being gently caught; the vibe is softly luxurious, nurse-grade professional, reassuring to the whole family; it must work in mom-group referrals, on the tour booking page, and sound auspicious when grandparents say it aloud.",
  },
  "pettraining": {
    zh: "一个宠物训练与行为矫正品牌，寓意「让人和毛孩子学会互相理解」；气质要温柔专业、正向不打骂、像犬校一样可信；场景是遛狗时的转介绍、预约小程序和训犬师认证墙上都顺口可靠。",
    en: "A pet training and behavior brand. The name should feel like helping humans and their dogs learn to understand each other; the vibe is gentle, professional, positive-method, credible like a proper school; it must roll off the tongue in dog-park referrals, on the booking page, and beside the trainer certification wall.",
  },
  "nailsalon": {
    zh: "一个美甲美睫工作室品牌，寓意「把方寸指尖过成自己的审美」；气质要有风格立场、精致治愈、像闺蜜的工作室；场景是小红书主页、预约链接和「你指甲在哪做的」的口播转介绍里都好念好记。",
    en: "A nail and lash studio brand. The name should feel like making the two-centimeter canvas your own aesthetic; the vibe is stylistically opinionated, polished, soothing, like a best friend's atelier; it must look good on an Instagram bio, a booking link, and travel well in \"where did you get your nails done?\"",
  },
  "laundry": {
    zh: "一个洗衣与衣物护理品牌，寓意「让心爱的衣物穿回第一天的样子」；气质要干净利落、专业可托付、有焕新感；场景是小程序下单、取送短信和写字楼电梯广告里都清爽可信。",
    en: "A laundry and garment care brand. The name should promise beloved garments worn like day one; the vibe is crisp, professional, entrustable, with a sense of renewal; it must feel clean and credible in an ordering app, a pickup notification, and an office-tower elevator ad.",
  },
  "rvtravel": {
    zh: "一个房车租赁与房车旅行品牌，寓意「带着家去看世界」；气质要自由松弛、又靠谱安心、全家都喜欢；场景是亲子游攻略、租车比价页和营地招牌上都好记顺口。",
    en: "An RV rental and camper travel brand. The name should feel like taking your home to see the world; the vibe is free and easygoing yet reliable and reassuring, loved by the whole family; it must be memorable in family trip guides, on rental comparison pages, and on a campground sign.",
  },
  "knowledgepay": {
    zh: "一个知识付费与付费社群品牌，寓意「学了真的有收获，还遇见同路人」；气质要有获得感、体系专业、不割韭菜；场景是直播口播「搜 X 加入」、社群裂变海报和年费续订页上都清晰可信。",
    en: "A paid courses and membership community brand. The name should promise real takeaways and finding your people; the vibe is outcome-driven, structured, professional, never grifty; it must be unambiguous in a live-stream \"search X to join,\" on referral posters, and on the annual renewal page.",
  },
  "matchmaking": {
    zh: "一个婚恋相亲与高端匹配服务品牌，寓意「认真的人遇见认真的人」；气质要真诚郑重、有缘分感、父母听着也放心；场景是会员注册页、红娘回访电话和家庭饭桌上的提起都得体可信。",
    en: "A matchmaking and dating service brand. The name should feel like serious people meeting serious people; the vibe is sincere, respectful, touched with destiny, reassuring even to parents; it must sound proper on the membership page, in a matchmaker's follow-up call, and when mentioned at the family dinner table.",
  },
  "tattoo": {
    zh: "一个纹身工作室品牌，寓意「把值得纪念的故事郑重地留在身上」；气质要有风格立场、专业卫生、带一点永恒的仪式感；场景是作品集主页、预约私信和「你这是在哪纹的」的口播转介绍里都好记有型。",
    en: "A tattoo studio brand. The name should feel like stories worth keeping, marked with ceremony; the vibe is stylistically opinionated, professional, hygienic, with a touch of permanence; it must look sharp on a portfolio page, in booking DMs, and travel well in \"where did you get that done?\"",
  },
  "climbing": {
    zh: "一个攀岩馆与抱石馆品牌，寓意「每个人都能爬出自己的高度」；气质要有社群归属感、街头工业风、对新手友好；场景是「周末去哪爬」的岩友邀约、体验课预约页和馆内墙面招牌上都顺口带劲。",
    en: "A climbing and bouldering gym brand. The name should feel like everyone can climb to their own height; the vibe is community-driven, industrial-street, beginner-friendly; it must roll off the tongue in \"where are you climbing this weekend?\", on the intro-class booking page, and on the gym wall.",
  },
  "swimschool": {
    zh: "一个游泳培训与亲子水育品牌，寓意「让孩子像小鱼一样自在」；气质要安全专业、童趣欢快、家长放心；场景是妈妈群转介绍、课程包续费页和孩子喊出「我要去 XX 游泳」时都顺口好记。",
    en: "A swim school and baby-swimming brand. The name should promise kids swimming as freely as little fish; the vibe is safe, professional, playfully cheerful, reassuring to parents; it must work in mom-group referrals, on the class-pack renewal page, and when a child shouts \"I want to go swim at X!\"",
  },
  "3dprint": {
    zh: "一个 3D 打印与按需制造服务品牌，寓意「想得出就做得出」；气质要专业快速、有造物的科技感、工程师与个人客户都信任；场景是对公报价单、创客社区口碑和「打样明天就能拿」的承诺里都干脆可信。",
    en: "A 3D printing and on-demand manufacturing brand. The name should promise that anything imaginable can be made; the vibe is professional, fast, maker-tech, trusted by engineers and hobbyists alike; it must look solid on a B2B quote, in maker-community word of mouth, and behind a next-day prototype promise.",
  },
  "vending": {
    zh: "一个自动售货与无人零售品牌，寓意「你需要的时候它都在」；气质要便利可靠、聪明高效、带一点人情味；场景是写字楼机身贴纸、点位合作提案和扫码小程序上都清爽好认。",
    en: "A vending and unattended retail brand. The name should promise it's always there when you need it; the vibe is convenient, reliable, smartly efficient, with a touch of warmth; it must read cleanly on a machine wrap in an office lobby, in a site-partnership deck, and on the scan-to-pay mini app.",
  },
  "kidsart": {
    zh: "一个少儿美术与创意教育品牌，寓意「保护每个孩子敢想敢画的天性」；气质要色彩明快、童趣专业、家长觉得有体系；场景是家长群转介绍、试听课海报和孩子喊出「我要去 XX 画画」时都欢快好念。",
    en: "A children's art education brand. The name should feel like protecting every child's daring to imagine and paint; the vibe is colorful, playful yet professional, structured enough for parents; it must charm in parent-group referrals, on trial-class posters, and when a child shouts \"I want to paint at X!\"",
  },
  "danceschool": {
    zh: "一个舞蹈工作室与舞蹈培训品牌，寓意「在节拍里遇见更自信的自己」；气质要有律动感、有厂牌范儿、对新手友好；场景是短视频话题标签、课堂喊队名和「你在哪学跳舞」的口播里都带节拍好记。",
    en: "A dance studio brand. The name should feel like meeting a bolder you inside the beat; the vibe is rhythmic, label-cool, welcoming to beginners; it must carry a beat in short-video hashtags, in class chants, and in \"where do you take dance?\" word of mouth.",
  },
  "martialarts": {
    zh: "一个武术格斗馆品牌，寓意「练的是拳，修的是自己」；气质要专业血性但不戾气、师承有据、家长也放心；场景是体验课转介绍、少儿班招生页和「我在 XX 练拳」的口播里都立得住。",
    en: "A martial arts gym brand. The name should feel like training the fist to forge the self; the vibe is credible and gritty without malice, lineage-backed, reassuring to parents; it must stand up in trial-class referrals, on the kids' program page, and in \"I train at X.\"",
  },
  "bikeshop": {
    zh: "一个骑行品牌与单车店，寓意「用自己的力量抵达」；气质要有风的速度感、圈内格调、对通勤家庭客也友好；场景是周末约骑的车队名、装备电商详情页和「去 XX 保养车」的口播里都顺口有型。",
    en: "A cycling brand or bike shop. The name should feel like arriving under your own power; the vibe is wind-fast, insider-stylish, yet friendly to commuters and families; it must sound sharp as a weekend ride crew name, on a gear product page, and in \"take it to X for a tune-up.\"",
  },
  "fishing": {
    zh: "一个垂钓渔具品牌，寓意「静得下心，也钓得上鱼」；气质要硬核可靠、有水边的宁静感、对新手钓客也友好；场景是钓友圈装备推荐、直播间口播和「用的 XX 的竿」的爆护分享里都立得住。",
    en: "A fishing and tackle brand. The name should feel like stillness that lands the fish; the vibe is hardcore-reliable, waterside-calm, welcoming to new anglers; it must hold up in tackle recommendations among fishing buddies, in livestream shoutouts, and in \"caught it on an X rod.\"",
  },
  "foodtruck": {
    zh: "一个餐车与街头小吃品牌，寓意「烟火气开到哪，香到哪」；气质要香辣诱人、有人情味、一瞥就知道卖什么；场景是夜市招牌远看、排队拍照发圈和「今天车停哪」的社媒追踪里都好认好传。",
    en: "A food truck and street food brand. The name should smell delicious wherever the wheels stop; the vibe is sizzling, warm-hearted, instantly clear about what's cooking; it must read from across a night market, look great in queue photos, and travel in \"where's the truck today?\" posts.",
  },
  "repair": {
    zh: "一个家电维修与上门服务品牌，寓意「一次修好，明码实价」；气质要诚信靠谱、师傅专业、快而不敲竹杠；场景是邻里群转介绍、上门工单和「我认识个 XX，靠谱」这句话里都让人放心开门。",
    en: "An appliance repair and handyman brand. The name should promise fixed right the first time, priced honestly; the vibe is trustworthy, craftsman-professional, fast without gouging; it must reassure in neighborhood referrals, on a service work order, and in \"I know a guy at X — reliable.\"",
  },
  "pottery": {
    zh: "一个陶艺工作室与手作器物品牌，寓意「把一下午的专注烧成一件器物」；气质要温润安静、有手作的不完美温度、发得出朋友圈；场景是体验课转介绍、器物电商详情页和「我在 XX 做了个碗」的分享里都好念好记。",
    en: "A pottery studio and handmade ceramics brand. The name should feel like an afternoon of focus fired into an object; the vibe is warm, quiet, alive with handmade imperfection, postable; it must carry in class referrals, on a ceramics shop page, and in \"I threw a bowl at X.\"",
  },
  "billiards": {
    zh: "一个台球馆与桌球俱乐部品牌，寓意「一杆进袋的干脆利落」；气质要有会所格调也不失松弛、懂球的人会心、朋友聚会想得起；场景是「附近台球」地图搜索、球友约局口播和店招远看里都一眼认出是打球的地方。",
    en: "A billiards hall and pool club brand. The name should feel like the clean snap of a perfect pot; the vibe is club-polished yet easygoing, knowing to insiders, first to mind for a night out; it must read as a place to play in map searches, in \"rack 'em at X\" invites, and on the sign from across the street.",
  },
  "drivingschool": {
    zh: "一个驾校与驾培品牌，寓意「一次学好，一路顺遂」；气质要正规靠谱、教练耐心不吼人、家长与上班族都放心；场景是「城市+驾校」搜索、老学员转介绍和「我在 XX 学的车，教练不错」这句口播里都立得住。",
    en: "A driving school brand. The name should promise learned right once, smooth roads after; the vibe is legitimate, patient, no-yelling, reassuring to parents and commuters alike; it must hold up in \"driving school near me\" searches, in alumni referrals, and in \"I learned at X — great instructor.\"",
  },
  "optician": {
    zh: "一个眼镜店与视光中心品牌，寓意「把世界重新调回高清」；气质要专业可信、验光有体系、镜框又有设计感；场景是商场招牌、儿童近视防控咨询和「我在 XX 配的镜，验光很细」的转介绍里都让人放心。",
    en: "An optical shop and eyewear brand. The name should feel like the world tuned back to high definition; the vibe is clinically credible with designer frames on top; it must reassure on a mall storefront, in a kids' myopia-control consult, and in \"I got fitted at X — thorough exam.\"",
  },
  "massage": {
    zh: "一个按摩推拿与身体调理品牌，寓意「把绷了一周的肩颈松回来」；气质要正规清爽、手法专业、白领敢把店名发进家庭群；场景是「附近按摩」搜索、下班顺路进店和「XX 家手法真不错」的回头客转述里都好念好记。",
    en: "A massage and bodywork brand. The name should feel like a week of shoulder tension finally released; the vibe is clean, legitimate, professionally skilled — a name you'd post in the family group chat; it must work in \"massage near me\" searches, after-work walk-ins, and regulars' word of mouth.",
  },
  "mealprep": {
    zh: "一个轻食与健康餐品牌，寓意「好好吃饭，轻装上阵」；气质要清爽有食欲、健康不苦行、自律而松弛；场景是外卖列表小图旁、健身房联名海报和「中午吃 XX，下午不困」的同事安利里都清爽好记。",
    en: "A healthy meal and salad brand. The name should feel like eating well and traveling light; the vibe is fresh but appetizing, disciplined without the diet gloom; it must pop beside a delivery-app thumbnail, on a gym partnership poster, and in \"X for lunch — no afternoon slump\" coworker recs.",
  },
  "petphoto": {
    zh: "一个宠物摄影工作室品牌，寓意「把毛孩子的每个瞬间定格成家庭纪念」；气质要温暖专业、拟人视角、拍的是家人不是动物；场景是小红书作品流标签、预约咨询和「我家孩子在 XX 拍的写真」的家长转述里都好念好记。",
    en: "A pet photography studio brand. The name should feel like freezing a fur kid's every moment into a family keepsake; the vibe is warm and professional, shooting family members rather than animals; it must work as an Instagram hashtag, in booking chats, and in \"we got our baby's portraits at X\" pet-parent word of mouth.",
  },
  "campgear": {
    zh: "一个露营装备品牌，寓意「可靠的装备是通往山野的门票」；气质要结实可信又带荒野浪漫、雪峰篝火感；场景是装备评测视频、海淘清单和「我这顶帐篷是 XX 的，暴雨没漏」的圈内口碑里都好认好记。",
    en: "A camping gear brand. The name should feel like reliable gear as the ticket to the wild; the vibe is rugged and trustworthy with a streak of wilderness romance — snow peaks and campfires; it must hold up in gear review videos, cross-border shopping lists, and \"my X tent survived the storm\" campfire word of mouth.",
  },
  "careercoach": {
    zh: "一个职业规划与生涯咨询品牌，寓意「帮人在职业迷雾里找到北极星」；气质要专业可信、有方向感、卖终点不卖焦虑；场景是公众号标题、播客片头和「我找 XX 做了职业咨询，思路清晰多了」的转介绍里都顺口可信。",
    en: "A career planning and coaching brand. The name should feel like finding your north star in a career fog; the vibe is credible and directional, selling destinations rather than anxiety; it must sit naturally in a post headline, a podcast intro, and \"I did a session with X — so much clearer now\" referrals.",
  },
  "fragrance": {
    zh: "一个香氛蜡烛与家居香品牌，寓意「点燃一支蜡烛，回到某个想念的时刻」；气质要有通感画面、轻奢克制、好念但有距离感；场景是礼盒烫金、朋友圈晒单和「这支雪松香是 XX 家的」的种草转述里都得体好记。",
    en: "A candle and home fragrance brand. The name should feel like lighting a candle and returning to a moment you miss; the vibe is synesthetic, quietly luxurious, pronounceable but slightly distant; it must emboss well on a gift box, share easily in a caption, and carry in \"that cedar candle is from X\" recommendations.",
  },
  "diving": {
    zh: "一个潜水俱乐部与潜店品牌，寓意「潜入深蓝，像飞一样自由」；气质要向往感与专业感并存、深蓝浪漫但安全可信；场景是考证攻略搜索、出行社群召集和「我在 XX 考的证，教练特别细」的老带新转述里都好读好记。",
    en: "A dive shop and scuba club brand. The name should feel like sinking into deep blue and flying free; the vibe balances longing with professionalism — ocean romance backed by safety credibility; it must read well in certification-guide searches, trip group invites, and \"I got certified at X — great instructors\" buddy referrals.",
  },
  "carwash": {
    zh: "一个洗车与汽车美容品牌，寓意「开走时像提新车」；气质要干净利落、效率与仪式感兼顾、连锁招牌统一得起来；场景是「附近洗车」地图搜索、路过招牌和「我在 XX 办的月卡，顺路就洗」的车主安利里都好认好记。",
    en: "A car wash and detailing brand. The name should feel like driving away in a brand-new car; the vibe is clean and efficient with room for ritual, ready to unify across chain storefronts; it must stand out in \"car wash near me\" maps, read from a drive-by sign, and carry in \"I got the monthly pass at X\" owner recs.",
  },
  "studytour": {
    zh: "一个研学旅行与营地教育品牌，寓意「行走的课堂，孩子回来不一样了」；气质要稳重可信有书卷气、又让孩子觉得好玩有冒险感；场景是家长群「XX 研学怎么样」的讨论、学校合作洽谈和公众号转介绍里都好念可信。",
    en: "A study camp and educational travel brand. The name should feel like a walking classroom your kid comes back changed from; the vibe balances scholarly credibility for parents with adventure for kids; it must sound trustworthy in parent group chats, school partnership pitches, and \"has anyone tried X?\" referrals.",
  },
  "petboarding": {
    zh: "一个宠物寄养与宠物酒店品牌，寓意「主人不在的日子，它在过自己的假期」；气质要有家的温度、看得见的安心、不像仓库像乐园；场景是「附近宠物寄养」地图搜索、小区宠物群「十一寄哪家」的讨论和每日视频分享里都好认好传。",
    en: "A pet boarding and pet hotel brand. The name should feel like the furry kid is on her own holiday while you're away; the vibe is homey and reassuring — a playground, never a warehouse; it must stand out in \"pet boarding near me\" maps, neighborhood pet-group threads, and daily-video captions.",
  },
  "upcycling": {
    zh: "一个旧物改造与升级再造品牌，寓意「本来要被扔掉的东西，成了独一无二的那件」；气质要酷而有故事感、设计感压过二手感、克制不说教；场景是市集摊位、小红书图文和「这个包居然是篷布做的」的种草转述里都好念好记。",
    en: "An upcycling and rework brand. The name should feel like something headed for landfill becoming the most special piece in the room; the vibe is cool and storied, design-first over secondhand, never preachy; it must carry at market stalls, in visual posts, and in \"this bag is made of WHAT?\" retellings.",
  },
  "zine": {
    zh: "一本独立杂志，寓意「一种可以想象的生活提案」；气质要有品味有立场、克制留白、印在封面和帆布包上都好看；场景是独立书店平摊、同好「你看过 XX 吗」的接头转述和周边咖啡杯上都有辨识度。",
    en: "An indie magazine. The name should propose an imaginable way of living; the vibe is tasteful and opinionated, restrained with room to interpret, beautiful on a cover and a tote; it must stand out on bookstore tables, in \"have you read X?\" exchanges, and on merch coffee cups.",
  },
  "locksmith": {
    zh: "一个开锁换锁与安防升级服务品牌，寓意「深夜救急也敢放心开门的正规军」；气质要快、专业、规范可信、不江湖气；场景是「附近开锁」地图搜索、物业公告栏推荐和「我家换锁芯找的 XX」的邻里转介绍里都好认可信。",
    en: "A locksmith and lock-security brand. The name should feel like the licensed pro you'd trust to open your door at 2 a.m.; the vibe is fast, professional and by-the-book, never shady; it must stand out in \"locksmith near me\" maps, on property notice boards, and in neighborly \"I used X for my rekey\" referrals.",
  },
  "skateshop": {
    zh: "一个滑板店与滑板品牌，寓意「真实不装的态度，街头自己人的接头点」；气质要横得真诚、永远年轻但不装嫩、经得起印在板底和卫衣上；场景是滑手圈「去 XX 买板」的口碑、视频片尾鸣谢和 IG 标签里都好认好拼。",
    en: "A skate shop and skate brand. The name should feel like an authentic, unapologetic meeting point for the local scene; the vibe is earned swagger, forever young without faking it, print-ready for deck bottoms and hoodies; it must read cleanly in \"get your deck at X\" word of mouth, video credits, and IG tags.",
  },
  "surf": {
    zh: "一个冲浪俱乐部与冲浪学校品牌，寓意「把生活调成海边频率，逐浪而居」；气质要自由松弛、闻得到海的味道、老手觉得地道新手不害怕；场景是浪点攻略搜索、OTA 预订页和「在 XX 学的下浪，教练会推板」的浪人口碑里都好念好拼。",
    en: "A surf club and surf school brand. The name should feel like retuning life to an ocean frequency and living by the swell; the vibe is free and loose, smelling of salt, authentic to veterans yet unthreatening to first-timers; it must read well in surf-spot guide searches, OTA booking pages, and \"I learned to pop up at X\" surfer word of mouth.",
  },
  "golf": {
    zh: "一个高尔夫俱乐部与球技培训品牌，寓意「果岭上的体面与精准」；气质要庄园矜贵而不土豪、经得起会籍卡烫金与合同抬头；场景是会籍顾问名片、企业团建洽谈和球友「周末去 XX 打一场」的转述里都体面可信。",
    en: "A golf club and golf academy brand. The name should feel like propriety and precision on the green; the vibe is estate reserve without gaudiness, worthy of gold-foil membership cards and contract letterheads; it must carry on membership consultants' cards, corporate-event pitches, and \"let's play X this weekend\" golfer retellings.",
  },
  "vr": {
    zh: "一个 VR 体验馆与沉浸式娱乐品牌，寓意「推开一扇门，踏进另一个世界」；气质要科技奇观感与好玩直给并存、不用生僻科技词；场景是商场中庭招牌三米外可读、团购列表一眼记住和「上次去的那家 XX 超好玩」的朋友转述里都好念好记。",
    en: "A VR arcade and immersive entertainment brand. The name should feel like pushing open a door into another world; the vibe pairs tech spectacle with plain fun, no obscure jargon; it must read from three meters off mall signage, stick at a glance in deals lists, and carry in \"that place X was insane\" friend retellings.",
  },
  "bar": {
    zh: "一个鸡尾酒吧与清吧品牌，寓意「名字就是第一杯酒，定下今晚的基调」；气质要有故事感有梗、微醺不烂醉、做成霓虹灯牌好看；场景是「今晚去哪喝」的朋友转述、小红书探店和大众点评榜单里都好念好记。",
    en: "A cocktail bar and lounge brand. The name should feel like the first drink, setting the register of the night; the vibe is storied and witty, tipsy but never wrecked, beautiful as a neon sign; it must carry in \"where are we drinking tonight\" retellings, discovery posts, and ranked review lists.",
  },
  "musicschool": {
    zh: "一个音乐培训机构与琴行品牌，寓意「从第一个音阶到第一次登台」；气质要专业可信又有音乐美感、家长听到坚持孩子感到向往；场景是家长群转介绍、商场招牌和汇报演出节目单里都念着可信印着体面。",
    en: "A music school and instrument store brand. The name should feel like the journey from the first scale to the first recital; the vibe is credible expertise with musical beauty — parents hear rigor, kids feel longing; it must sound trustworthy in parent-group referrals, mall signage, and recital programs.",
  },
  "chess": {
    zh: "一个围棋与棋类培训品牌，寓意「落子有声，学棋即修心」；气质要有棋语文化厚度、智慧与修养并存、奖状上印得住体面；场景是家长群「XX 家孩子定段了」的转述、赛事成绩公示和商场招牌里都可信好记。",
    en: "A Go and chess academy brand. The name should land like a stone on the board — learning the game disciplines the mind; the vibe carries board-game cultural depth, wisdom with cultivation, dignified on certificates; it must sound credible in \"their kid just made dan\" parent retellings, tournament postings, and mall signage.",
  },
  "hotpot": {
    zh: "一个火锅与烧烤品牌，寓意「一桌人围炉的热闹烟火气」；气质要市井有梗、两三个字喊得响、灯箱上远远认得出；场景是「今晚吃什么」的群聊提议、大众点评榜单和「走，去吃 XX」的朋友转述里都第一个被喊出来。",
    en: "A hotpot and BBQ brand. The name should feel like the bustle of friends around a boiling pot; the vibe is street-fire wit, shoutable in two or three syllables, legible across a night market; it must be the first name shouted in \"what's for dinner\" group chats, ranked review lists, and \"let's go eat at X\" retellings.",
  },
  "dessert": {
    zh: "一个甜品店与冰淇淋品牌，寓意「今天值得奖励自己一下」；气质要甜而不腻、有口感画面又有情绪价值、印在杯子和招牌上好看上镜；场景是下午茶提议、小红书探店笔记和外卖列表里都第一个浮现。",
    en: "A dessert shop and ice cream brand. The name should feel like today deserves a treat; the vibe is sweet without cloying, textured and emotionally rewarding, photogenic on cups and signage; it must surface first in afternoon-tea proposals, discovery posts, and delivery lists.",
  },
  "convenience": {
    zh: "一个社区便利店与即时零售品牌，寓意「楼下永远亮着的那盏灯」；气质要亲切正规、两三个字笔画简单、灯箱上一眼认出；场景是「楼下买瓶水」的肌肉记忆、外卖即时零售列表和加盟招商手册里都可信好记。",
    en: "A convenience store and instant retail brand. The name should feel like the light downstairs that never goes out; the vibe is neighborly yet legitimate, two or three simple syllables, instantly recognized on a lightbox; it must carry in \"grab a bottle downstairs\" muscle memory, instant-delivery listings, and franchise brochures.",
  },
  "stationery": {
    zh: "一个文创与文具品牌，寓意「认真生活的仪式感」；气质要克制有书房气、字形好看可做印章、经得起印在产品角落被反复端详；场景是小红书晒本子、文具店铺货和「送人拿得出手」的礼物场景里都体面耐看。",
    en: "A stationery and paper goods brand. The name should feel like the ritual of living deliberately; the vibe is restrained with study-room air, beautiful as a mark or seal, worthy of repeated gaze on a product corner; it must look dignified in journal-spread posts, shop shelves, and \"presentable as a gift\" scenes.",
  },
  "cybercafe": {
    zh: "一个电竞馆与网咖品牌，寓意「五个人坐一排的开黑圣地」；气质要热血有梗但不中二、两三个字喊得顺口、储值卡上印得体面；场景是「今晚去哪开黑」的语音集结、大众点评比价和朋友拉群里都好喊好记。",
    en: "An esports venue and cyber café brand. The name should feel like the squad's holy ground — five friends in a row; the vibe is competitive fire with wit but no cringe, rolling off the tongue in two or three syllables, decent on a membership card; it must rally well in \"where are we queuing tonight\" voice chats, review-app comparisons, and group invites.",
  },
  "carrental": {
    zh: "一个租车与共享出行品牌，寓意「说走就走的自由与稳稳的可靠」；气质要正规可信又轻快有效率、好念好搜不与巨头谐音撞车；场景是行程规划的搜索、机场到达厅灯箱和「上次在 XX 租的车不错」的口碑里都立得住。",
    en: "A car rental and mobility brand. The name should feel like leave-whenever freedom on a bedrock of reliability; the vibe is legitimate yet light and efficient, easy to say and search without sound-alike collisions with giants; it must stand in trip-planning searches, arrival-hall lightboxes, and \"the car I got at X was solid\" word of mouth.",
  },
  "noodle": {
    zh: "一个面馆与粉面小吃品牌，寓意「一碗端上来就冒热气的踏实」；气质要市井有烟火气、两三个字喊得顺口、外卖列表与楼层导视里一眼认出；场景是「中午吃什么」的快决策、外卖缩略图和「楼下那家 XX」的日常口碑里都第一个被想起。",
    en: "A noodle shop and street food brand. The name should feel like a steaming bowl set down in front of you; the vibe is street-fire warmth, two or three syllables that roll off the tongue, instantly legible in delivery lists and floor directories; it must surface first in \"what's for lunch\" split-second decisions, delivery thumbnails, and \"that place downstairs\" word of mouth.",
  },
  "grocery": {
    zh: "一个社区生鲜店品牌，寓意「今天的菜是今天的」；气质要新鲜亲切、笔画简单、门头灯箱隔街可认；场景是阿姨的日常口碑、社区团购群和即时零售 App 的搜索里都念得顺口、记得牢靠。",
    en: "A neighborhood fresh grocery brand. The name should feel like today's produce is from today; the vibe is fresh and neighborly with simple strokes, legible on a fascia lightbox from across the street; it must roll off an auntie's tongue in daily word of mouth, community group-buy chats, and instant-delivery app searches.",
  },
  "tutoring": {
    zh: "一个课外辅导与家教品牌，寓意「跟对人，每天进步一点点」；气质要正规可信有文化底座、让家长安心也让孩子不抗拒；场景是家长群「XX 家孩子在哪补的」的转介绍、校门口招牌和机构名录里都立得住体面。",
    en: "A tutoring and test prep brand. The name should feel like following the right teacher toward a little progress every day; the vibe is legitimate with a cultural foundation, reassuring to parents without triggering kids' resistance; it must stand dignified in \"where does their kid go\" parent-group referrals, schoolgate signage, and institution directories.",
  },
  "printshop": {
    zh: "一个图文快印品牌，寓意「再急的活也快而准地交付」；气质要专业严谨有效率、好念好搜、电话里报得清楚；场景是「附近的打印店」的加急搜索、写字楼电梯广告和行政「上次那家印得不错」的口碑里都一眼认出。",
    en: "A print shop and copy center brand. The name should feel like even the tightest deadline delivered fast and exact; the vibe is professional rigor with efficiency, easy to say and search, spellable over the phone; it must stand out in urgent \"print shop near me\" searches, office elevator ads, and the admin's \"that place did it right\" word of mouth.",
  },
  "errand": {
    zh: "一个同城跑腿与代办品牌，寓意「一小时内使命必达的确定性」；气质要有速度感又靠谱、两三个字好念好搜、印在骑手马甲上满街跑都是广告；场景是「帮我送一下」的应急下单、应用商店搜索和「半小时就送到了」的口碑里都第一个被想起。",
    en: "An errand running and same-city courier brand. The name should feel like within-the-hour certainty on a mission; the vibe is speed with dependability, two or three syllables easy to say and search, a billboard on every runner's vest; it must be the first name recalled in \"run this over\" emergencies, app-store searches, and \"they made it in thirty minutes\" word of mouth.",
  },
  "plumber": {
    zh: "一个管道疏通与水电维修品牌，寓意「马上能来、明码标价、药到病除」；气质要正规专业不像游击队、电话里报得清楚、印在工服上体面可信；场景是「附近疏通下水道」的应急搜索、物业推荐名录和业主群转介绍里都立得住。",
    en: "A plumbing and home repair brand. The name should feel like we can come now, price upfront, cured on the first visit; the vibe is licensed professionalism far from fly-by-night, spellable over the phone, decent printed on a work uniform; it must stand in emergency \"plumber near me\" searches, property-manager referral lists, and homeowner group recommendations.",
  },
  "travelagency": {
    zh: "一个旅行社与定制游品牌，寓意「把假期放心托付给懂行的人」；气质要既装得下远方的辽阔又给出履约的踏实、好念好搜、电话里报得清楚；场景是「目的地几日游」的搜索、OTA 店铺列表和「上次找 XX 安排得特别好」的转介绍里都立得住，印在领队旗子上也体面。",
    en: "A travel agency and custom tour brand. The name should feel like a vacation entrusted to someone who knows the way; the vibe holds both the width of the faraway and the weight of the promise, easy to say and search, spellable over the phone; it must stand in destination-plus-days searches, OTA storefront lists, and \"they arranged everything perfectly\" referrals — and look decent on the tour leader's flag.",
  },
  "teahouse": {
    zh: "一个茶馆与茶品牌，寓意「进来把节奏调慢的一盏茶」；气质要经得起老茶客盘问又卸下年轻人的门槛感、有底蕴不堆禅意、好念好记；场景是「附近适合谈事的茶馆」的搜索、伴手礼礼盒和「他家岩茶很正」的圈层口碑里都立得住，印在茶饼棉纸上压得住岁月。",
    en: "A tea house and tea brand. The name should feel like a cup that grants permission to slow down; the vibe survives a connoisseur's cross-examination yet lowers the threshold for younger drinkers, deep without zen-word pileups, easy to say and remember; it must stand in \"quiet tea house for a meeting\" searches, on gift-box lids, and in circle-of-trust word of mouth — and press with dignity onto a tea-cake wrapper.",
  },
  "petcafe": {
    zh: "一个宠物咖啡馆品牌，寓意「被毛茸茸包围的三十分钟治愈」；气质要萌得干净不油腻、念出来嘴角就上扬、两三个字好念好转述；场景是「附近猫咖」的搜索、探店视频标题和「那家店的猫超亲人」的口碑里都第一个被想起，印在拍立得相框角上也不抢戏。",
    en: "A pet café brand. The name should feel like thirty minutes wrapped in fur; the vibe is clean cuteness without greasy puns, lifting the corners of the mouth on pronunciation, two or three syllables that retell at zero cost; it must surface first in \"cat café near me\" searches, visit-vlog titles, and \"their cats actually like people\" word of mouth — and sit politely in the corner of an instant-photo frame.",
  },
  "weddingphoto": {
    zh: "一个婚纱摄影与婚礼跟拍品牌，寓意「把人生最重要的一天封存成永远」；气质要审美在线又郑重其事、有签名感不落俗套；场景是「城市+婚纱照」的搜索、婚博会展位和新娘闺蜜群的转介绍里都立得住，印在相册烫金封面上要经得起几十年的翻看。",
    en: "A wedding photography brand. The name should feel like the most important day sealed into permanence; the vibe is impeccable taste with appropriate gravity, a signature feel free of romance clichés; it must stand in city-plus-wedding-photos searches, expo booths, and the bridesmaids' group chat — and carry weight foil-stamped on an album cover opened for decades.",
  },
  "footspa": {
    zh: "一个足疗采耳与养生馆品牌，寓意「进来就能卸下一天疲惫的松弛」；气质要干净敞亮有手艺传承感、雅而不贵、家庭客群看着放心；场景是「附近足疗」的搜索、商场导视牌和「那家手法很专业」的口碑里都立得住，印在储值会员卡上拿得出手。",
    en: "A foot spa and wellness lounge brand. The name should feel like a whole day's fatigue set down at the door; the vibe is clean and open with craft-lineage depth, refined without pricing out the value crowd, reassuring to families; it must stand in \"foot massage near me\" searches, mall directories, and \"their technique is genuinely professional\" word of mouth — and look respectable on a stored-value membership card.",
  },
  "parcel": {
    zh: "一个快递驿站与社区代收品牌，寓意「东西放这儿，放心」；气质要像老邻居打招呼般亲切、两三个字隔着马路可认、写进取件短信落款不占字数；场景是小区门口的灯箱、业主群的日常提问和「去 XX 取个件」的口头禅里都第一个被想起。",
    en: "A parcel station and community pickup brand. The name should feel like leave it here, rest easy; the vibe is a neighbor's greeting, two or three syllables legible across the street and free inside an SMS signature; it must be the first name recalled at the gate lightbox, in homeowners' group chats, and in the daily \"I'll grab it from X\" refrain.",
  },
  "realtor": {
    zh: "一个房产中介与经纪品牌，寓意「把一生最大的一笔交易放心托付」；气质要有家的温度又立得住专业可信、两三个字好念好记、印在工牌与门店招牌上体面；场景是「城市+买房中介」的搜索、业主群的「XX 家靠谱吗」和签约室的合同抬头里都立得住。",
    en: "A real estate agency brand. The name should feel like life's biggest transaction safely entrusted; the vibe carries home's warmth while standing firmly professional, two or three syllables easy to say and remember, respectable on a name badge and storefront sign; it must stand in city-plus-agent searches, \"is X reliable\" group chats, and on the contract header in the signing room.",
  },
  "propertymgmt": {
    zh: "一个物业管理公司品牌，寓意「有人在，家园就有秩序与安心」；气质要正规有集团感又不失服务温度、印在工服岗亭与标书封面上都立得住；场景是业委会续约投票的转述、开发商招标的资审表和「城市+物业公司」的搜索里都拿得出手。",
    en: "A property management brand. The name should feel like someone is there — order and ease for the whole compound; the vibe is group-level legitimacy warmed by service, standing firm on uniforms, guardhouses and bid covers; it must hold up in owners' committee renewal votes, developer tender prequalification sheets, and city-plus-management searches.",
  },
  "apartment": {
    zh: "一个长租公寓与租赁品牌，寓意「在出租屋里也能过上像家一样的生活」；气质要年轻自在有社群温度、机构感与亲和力平衡、两三个字好念好搜；场景是租房 App 的筛选列表、「城市+长租公寓」的搜索和「我住在 XX」的自我介绍里说出口不掉价。",
    en: "An apartment rental brand. The name should feel like a rented room that lives like home; the vibe is young ease with communal warmth, balancing institution and approachability, two or three syllables easy to say and search; it must stand in rental-app filter lists, city-plus-apartments searches, and the self-introduction \"I live at X\" without embarrassment.",
  },
  "construction": {
    zh: "一个建筑施工与工程承包品牌，寓意「基础打得牢、工期守得住、一言九鼎」；气质要正规有分量像国家队、印在围挡与安全帽上隔着马路可认；场景是招标资审表的三秒扫视、「城市+施工总包」的搜索和竣工铭牌上几十年的注视里都立得住。",
    en: "A construction and contracting brand. The name should feel like foundations laid solid, schedules kept, a promise weighing nine tripods; the vibe is credentialed gravity, legible across the street on hoardings and hard hats; it must survive the three-second tender prequalification scan, city-plus-general-contractor searches, and decades of gazes at the completion plaque.",
  },
  "appliancerepair": {
    zh: "一个家电维修与家庭维修品牌，寓意「师傅一到、药到病除、明码标价」；气质要正规专业与游击队彻底切割、电话里报得清楚、印在工牌上让业主敢开门；场景是「附近家电维修」的应急搜索、电梯广告二维码和物业推荐名录里都立得住。",
    en: "An appliance and home repair brand. The name should feel like the master arrives, the fix lands, the price is posted; the vibe is licensed professionalism cut clean from the fly-by-night crowd, spellable over the phone, trustworthy enough on a badge that the door opens; it must stand in emergency \"appliance repair near me\" searches, elevator-ad QR codes, and property-manager referral lists.",
  },
  "equipmentrental": {
    zh: "一个设备租赁与机械租赁品牌，寓意「用的时候一定有、调得动、结算清」；气质要有钢铁力量感又结算正规、喷在挖机侧面隔着工地可认、电话里报得清楚；场景是「城市+设备租赁」的搜索、总包供应商名录和成本经理的比价表里都立得住。",
    en: "An equipment and machinery rental brand. The name should feel like it's there when you need it, dispatched fast, billed clean; the vibe carries steel's power with corporate billing legitimacy, legible across the site when spray-painted on an excavator flank, spellable over the phone; it must stand in city-plus-equipment-rental searches, GC supplier registries, and the cost manager's comparison sheet.",
  },
  "hotel": {
    zh: "一个酒店与旅宿品牌，寓意「一晚有人情味的栖居」；气质要松弛体面、贵气与房价段位匹配、两三个字好念好搜；场景是 OTA 搜索列表的三秒扫视、「城市+酒店」的搜索和客人「我住在 XX」的转述里都立得住，夜里灯箱亮起隔着马路可认。",
    en: "A hotel and lodging brand. The name should feel like one night of humane dwelling; the vibe is composed ease with luxury calibrated to the room rate, two or three syllables easy to say and search; it must stand in the three-second OTA scan, city-plus-hotel searches, and the guest's retelling of \"I'm staying at X\", legible across the street when the lightbox glows at night.",
  },
  "karaoke": {
    zh: "一个量贩 KTV 与唱歌品牌，寓意「今晚的情绪出口就在这里」；气质要明亮干净无暧昧、两个字喊得响、群聊打字不纠错；场景是「今晚去哪唱」的群聊投票、商场中庭的巨型招牌和团购平台的套餐列表里都第一个被想起。",
    en: "A family karaoke brand. The name should feel like tonight's emotional outlet is right here; the vibe is bright, clean and unambiguous, two syllables that shout well and type without typos; it must be first nominated in the where-are-we-singing group vote, on the mall-atrium mega sign, and in group-buy package lists.",
  },
  "bubbletea": {
    zh: "一个奶茶与新茶饮品牌，寓意「三分钟的好心情」；气质要甜而不腻有记忆钩子、口播不拗口、杯身 logo 隔着奶盖可认；场景是点单屏的三秒扫视、外卖 App 的搜索框和举杯自拍的种草笔记里都立得住，拼音出海也好念。",
    en: "A bubble tea brand. The name should feel like three minutes of good mood; the vibe is sweet with a memory hook, smooth to call out at the counter, the cup logo legible over the foam; it must stand in the menu-screen scan, the delivery search box, and raised-cup seeding posts — with a romanization that travels overseas.",
  },
  "bbq": {
    zh: "一个烧烤与夜宵品牌，寓意「深夜的炭火与聚集地」；气质要有烟火气与江湖气、两三个字喊得响、霓虹灯牌在炭烟里认得出；场景是「走，撸串去」的召集令、外卖 App 的深夜搜索和「城市+烧烤」的点评夜宵榜里都立得住。",
    en: "A BBQ and late-night grill brand. The name should feel like midnight charcoal and the gathering place; the vibe carries hearth-smoke and street swagger, two or three syllables that shout well, the neon board legible through charcoal haze; it must stand in the let's-get-skewers rally cry, late-night delivery searches, and city-plus-BBQ rankings.",
  },
  "pharmacy": {
    zh: "一个连锁药店与药房品牌，寓意「深夜亮灯的安心」；气质要正规亲民有祝愿感、长辈念得顺、绿十字旁一眼可认、不暗示疗效；场景是「附近药店」的地图搜索、医保定点名录和外卖送药的搜索框里都立得住。",
    en: "A pharmacy chain brand. The name should feel like a light on at midnight, reassurance at hand; the vibe is legitimate and approachable with a blessing register, pronounceable by elders, recognizable beside the green cross, never implying efficacy; it must stand in nearby-pharmacy map searches, insurance-network directories, and medicine-delivery search boxes.",
  },
  "clinic": {
    zh: "一个诊所与门诊品牌，寓意「专业且安心的邻居医生」；气质要专业正规又有家庭医生温度、两三个字念得顺、不蹭名院不暗示疗效；场景是妈妈群的「哪家儿科靠谱」转述、「城市+科室」的搜索和医保定点铭牌上都立得住。",
    en: "A clinic and outpatient brand. The name should feel like the neighborhood doctor — professional and reassuring; the vibe balances credentialed legitimacy with family-doctor warmth, two or three syllables smooth to say, never borrowing famous hospital names or implying efficacy; it must stand in which-pediatrics-is-reliable retellings, city-plus-specialty searches, and on the insurance-network plaque.",
  },
  "evcharging": {
    zh: "一个充电桩运营品牌，寓意「随处有桩、插上就走的确定感」；气质要快、稳、有电力感，撑得起物业与车企的合同抬头；场景是地图 App 的「附近充电」列表、充电站灯箱和车主群的推荐里都一眼被记住。",
    en: "An EV charging network brand. The name should promise chargers everywhere and plug-in-and-go certainty; the vibe is fast, steady, and electric, weighty enough for contracts with properties and automakers; it must stand out in the map app's chargers-nearby list, on station lightboxes, and in EV owner group recommendations.",
  },
  "energystorage": {
    zh: "一个储能系统品牌，寓意「把电存住、把峰谷抹平的可靠资产」；气质要沉稳、工程感强、经得起招投标与银行尽调；场景是电网招标文件、工商业园区方案书和户用储能的产品包装上都立得住。",
    en: "An energy storage brand. The name should evoke a reliable asset that banks electricity and smooths the peaks; the vibe is sober, engineering-grade, able to survive tenders and bank due diligence; it must hold up in grid procurement documents, C&I proposals, and on a home battery's packaging.",
  },
  "recycling": {
    zh: "一个再生资源回收品牌，寓意「万物皆可再来一次、垃圾是放错位置的资源」；气质要干净、有科技感、彻底摆脱废品站的脏乱差印象；场景是居民区回收柜、政府招标文件和品牌方的 ESG 报告里都不违和。",
    en: "A recycling and resource-recovery brand. The name should suggest everything deserves a second life and waste is a resource in the wrong place; the vibe is clean and tech-forward, fully shedding the scrapyard stigma; it must sit comfortably on neighborhood collection kiosks, in government tenders, and in a client's ESG report.",
  },
  "retrofit": {
    zh: "一个节能改造服务品牌，寓意「省下来的电费看得见、改造效果说到做到」；气质要工程可靠、稳重专业、接得住双碳语境；场景是政府园区的立项文件、国企的招标书和能源账单对比图里都站得住。",
    en: "An energy retrofit services brand. The name should promise visible savings and deliver-what-you-promise engineering; the vibe is reliable, professional, at home in the decarbonization era; it must stand in public-sector project approvals, state-enterprise tenders, and before-and-after energy bill charts.",
  },
  "hvac": {
    zh: "一个暖通空调品牌，寓意「一年四季的体感舒适都交给我」；气质要专业可靠、有厂牌感又不失服务温度；场景是三伏天「空调维修」的搜索结果、装修群的邻居推荐和工程图纸的设备清单里都有分量。",
    en: "An HVAC brand. The name should promise year-round indoor comfort in trusted hands; the vibe balances factory-grade reliability with service warmth; it needs weight in mid-heatwave AC-repair searches, renovation group-chat referrals, and the equipment schedule on construction drawings.",
  },
  "watertreatment": {
    zh: "一个水处理环保品牌，寓意「把浑浊变清澈、把每一滴水管到放心」；气质要清净、专业、有干得了二十年运营的工程信任感；场景是政府投标文件、工业客户的采购清单和治理后的河道展示牌上都立得住。",
    en: "A water treatment brand. The name should evoke turning murky into clear and every drop safely managed; the vibe is clean, professional, with the engineering trust of a twenty-year operator; it must hold up in government bids, industrial procurement lists, and on the plaque beside a restored river.",
  },
  "babystore": {
    zh: "一个母婴用品品牌，寓意「每一件都替妈妈把过关」；气质要柔软安心又有护理级的专业感、两三个字念得顺、没有任何歧义联想；场景是妈妈群的「哪家纸尿裤好用」转述、待产包清单和母婴店招牌上都立得住。",
    en: "A baby and maternity brand. The name should promise every item pre-vetted on mom's behalf; the vibe is soft and reassuring yet care-grade professional, two or three syllables smooth to say, with zero ambiguous associations; it must stand in moms'-group diaper recommendations, hospital-bag checklists, and on the storefront sign.",
  },
  "kidsphoto": {
    zh: "一个儿童摄影品牌，寓意「把孩子这一年留下来」；气质要童趣梦幻又值得家长托付、孩子听到想去、家长听到放心；场景是妈妈群的百天照推荐、点评平台的搜索列表和相册烫金封面上都立得住。",
    en: "A kids' photography brand. The name should promise keeping this year of childhood forever; the vibe is playful and dreamlike yet trustworthy to parents — fun to the child's ear, reassuring to the parent's; it must stand in moms'-group hundred-day-shoot referrals, review-platform search lists, and embossed on the album cover.",
  },
  "giftcustom": {
    zh: "一个礼品定制品牌，寓意「心意被认真对待」；气质要有仪式感、精致郑重、在浪漫与正规之间平衡；场景是礼盒烫印、贺卡落款和企业采购的供应商名录里都立得住。",
    en: "A custom gifts brand. The name should promise sentiment taken seriously; the vibe is ceremonial and refined, balanced between romantic and businesslike; it must hold up foil-stamped on the gift box, signed on the card, and listed in a corporate procurement vendor directory.",
  },
  "petgrooming": {
    zh: "一个宠物美容品牌，寓意「毛孩子交给我，还你一只蓬松开心的它」；气质要萌而专业、让铲屎官一眼会心又敢放心托付；场景是地图 App 的「附近宠物美容」列表、朋友圈的洗护九宫格和社区宠物群的推荐里都被记住。",
    en: "A pet grooming brand. The name should promise hand over your fur kid, get back a fluffy happy one; the vibe is cute yet professional — an instant knowing smile for pet parents, plus the trust to hand over a family member; it must be remembered in map-app grooming-nearby lists, fresh-groom photo posts, and neighborhood pet-group referrals.",
  },
  "housekeeping": {
    zh: "一个家政服务品牌，寓意「值得请进家门的那双手」；气质要可靠正规、给客户安心也给阿姨体面；场景是小区业主群的阿姨推荐、上门服务的工牌和企业保洁的投标书里都立得住。",
    en: "A housekeeping services brand. The name should feel like hands worth inviting through your front door; the vibe is reliable and accountable, reassuring to clients and dignifying to workers; it must stand in neighborhood-group nanny referrals, on the worker's door-side badge, and in a corporate cleaning tender.",
  },
  "kidsplayground": {
    zh: "一个亲子乐园品牌，寓意「进门就是孩子的另一个世界」；气质要梦幻快乐又让家长联想到安全垫与消毒记录、孩子听到眼睛发亮；场景是商场导视牌、妈妈群的遛娃攻略和年卡续费提醒里都被记住。",
    en: "A kids' playground brand. The name should promise another world for children just inside the door; the vibe is dreamy and joyful yet padded-floor reassuring to parents — a child's eyes should light up on hearing it; it must be remembered on mall directory boards, in moms'-group weekend guides, and on the annual-pass renewal notice.",
  },
  "productphoto": {
    zh: "一个电商产品摄影品牌，寓意「这套图能让转化率涨」；气质要高效专业、有规格感和流程感、让运营按采购思维一眼信任；场景是淘宝服务市场列表、商家群转介绍和报价单抬头上都立得住。",
    en: "A product photography brand. The name should promise images that lift conversion rates; the vibe is efficient and professional, with spec-and-process credibility that wins an operator's procurement-minded trust at a glance; it must hold up in marketplace service listings, merchant-group referrals, and on the quote-sheet header.",
  },
  "portrait": {
    zh: "一个个人写真照相馆品牌，寓意「记录更好版本的自己」；气质要干净透亮、有标准化连锁的信任感、不堆美颜字眼；场景是闺蜜群的证件照推荐、点评平台的搜索列表和商场店招上都立得住。",
    en: "A portrait studio brand. The name should promise capturing a better version of yourself; the vibe is clean and luminous, with chain-grade consistency and zero beauty-filter clichés; it must stand in group-chat ID-photo referrals, review-platform search lists, and on the mall storefront sign.",
  },
  "foodreview": {
    zh: "一个探店测评品牌，寓意「一条信得过的舌头」；气质要公正敢说又不失亲切、有人格化的记忆点、不带恰饭联想；场景是视频标题、粉丝转发和商家挂在门口的推荐贴纸上都立得住。",
    en: "A food review brand. The name should feel like a tongue you can trust; the vibe is candid and fair yet warm, with a persona-level memory hook and zero sponsored-content associations; it must hold up in video titles, follower shares, and on the recommendation sticker by the restaurant door.",
  },
  "nutrition": {
    zh: "一个营养师咨询品牌，寓意「吃得对是一种生活方式」；气质要科学可信又温柔轻盈、没有节食和速效暗示；场景是体检报告后的搜索、宝妈群的营养师推荐和企业健康讲座的海报上都立得住。",
    en: "A nutrition coaching brand. The name should frame eating right as a lifestyle, not a diet; the vibe is science-credible yet gentle and light, free of quick-fix or restriction hints; it must stand in post-checkup searches, moms'-group dietitian referrals, and on the corporate wellness-talk poster.",
  },
  "physio": {
    zh: "一个康复理疗品牌，寓意「帮你回到原来的样子」；气质要有医疗级的循证信任感又不失温度、绝不像养生馆；场景是骨科医生的转诊建议、术后患者的搜索列表和诊所门头上都立得住。",
    en: "A physiotherapy and rehab brand. The name should promise getting you back to who you were; the vibe is evidence-based and medical-grade yet warm, never spa-adjacent; it must hold up in an orthopedist's referral advice, a post-surgical patient's search list, and on the clinic's front sign.",
  },
  "runclub": {
    zh: "一个跑步俱乐部品牌，寓意「一起跑，谁都能加入」；气质要有归属感和城市徽章感、欢迎六分半配速的新人、印在队服上十年不尴尬；场景是马拉松赛道边的加油声、完赛照片的社交分享和招新海报上都立得住。",
    en: "A run club brand. The name should say run together — anyone can join; the vibe is belonging-first with a city-badge feel, welcoming to the 6:30-pace beginner, and still cool printed on a jersey ten years on; it must hold up in course-side cheers, finish-line photo shares, and on the recruitment poster.",
  },
  "tennis": {
    zh: "一个网球俱乐部与青训品牌，寓意「优雅的运动，人人可入场」；气质要有会员制的质感又不端着、欢迎零基础成人和小朋友；场景是家长搜青训班的搜索框、会员说「我在 XX 打球」的日常对话和球场围网广告牌上都立得住。",
    en: "A tennis club and academy brand. The name should say an elegant sport, open to everyone; the vibe carries membership polish without stuffiness, welcoming beginner adults and kids; it must hold up in a parent's junior-program search, a member's \"I play at XX\", and on the court-fence banner.",
  },
  "soccer": {
    zh: "一个足球青训与业余俱乐部品牌，寓意「代表这片街区去踢球」；气质要有俱乐部的正规军气场又让家长放心、能印上队徽和队服；场景是家长搜青训机构的对比列表、球员穿队服的合影和城市联赛的秩序册上都立得住。",
    en: "A soccer academy and amateur club brand. The name should say we represent this neighborhood on the pitch; the vibe is proper-club gravitas that still reassures parents, ready for a crest and a kit; it must hold up in a parent's academy shortlist, team photos in full kit, and the city league's program.",
  },
  "football": {
    zh: "一个腰旗橄榄球俱乐部品牌，寓意「橄榄球的热血，没有冲撞的门槛」；气质要有战队图腾感又让家长看到安全和快乐、头盔队徽顺着名字长出来；场景是家长确认「无冲撞」的咨询、成人联赛的对阵表和招新海报上都立得住。",
    en: "A flag football club brand. The name should promise gridiron thrill without the collision barrier; the vibe is franchise-totem cool that still shows parents safety and fun, with helmet and crest growing out of the name; it must hold up in a parent's \"is it non-contact?\" inquiry, adult-league fixtures, and the recruiting poster.",
  },
  "hockey": {
    zh: "一个冰球俱乐部与冰上运动品牌，寓意「冰面上最快的团队运动」；气质要有冰雪的清冽和速度感、配得上精英教育的段位又不炫耀价格；场景是家长对比青训俱乐部的搜索、孩子穿队服上冰的骄傲和冰场门头上都立得住。",
    en: "A hockey club and ice sports brand. The name should carry the fastest team game on ice; the vibe is crisp winter imagery with speed, worthy of the elite-education tier without flaunting price; it must hold up in a parent's club comparison, a kid's pride in the jersey, and on the rink's front sign.",
  },
  "pickleball": {
    zh: "一个匹克球俱乐部品牌，寓意「五分钟上手，一场球交到朋友」；气质要轻快好玩带点无厘头、绝不端着、三代同堂都觉得被欢迎；场景是新手第一次约球的群公告、球场边的笑声合影和城市球局的报名页上都立得住。",
    en: "A pickleball club brand. The name should say learn in five minutes, leave with friends; the vibe is breezy and playful with a dash of absurdity, never posh, welcoming to all three generations on court; it must hold up in a first-timer's group invite, courtside laughter photos, and the city meetup's signup page.",
  },
  "pilates": {
    zh: "一个普拉提工作室品牌，寓意「身体的精修，不止是流汗」；气质要克制贵气、有精准与控制感、绝不像撸铁健身房；场景是白领搜「核心床普拉提」的对比列表、会员的体态对比照分享和精品工作室门头上都立得住。",
    en: "A Pilates studio brand. The name should frame the body, refined — not just sweat; the vibe is restrained and expensive-feeling, precise and controlled, never gym-adjacent; it must hold up in a professional's reformer-studio shortlist, members' posture-progress shares, and on the boutique storefront.",
  },
  "companyreg": {
    zh: "一个公司注册代办与企业服务品牌，寓意「创业第一步，交给我就简单了」；气质要正规可靠又不官僚、让第一次开公司的人放心；场景是创业者深夜搜「注册公司多少钱」的搜索页、代账会计的转介绍和写字楼电梯广告上都立得住。",
    en: "A company formation and business services brand. The name should say your first step, made simple; the vibe is legitimate and reliable without bureaucracy, reassuring to first-time founders; it must hold up in a founder's midnight cost search, an accountant's referral, and the office-tower elevator ad.",
  },
  "consulting": {
    zh: "一个管理咨询与顾问公司品牌，寓意「帮客户看清方向、绕过障碍」；气质要贵在克制、有判断力和方法论感、配得上提案封面和董事会纪要；场景是客户 CFO 的预算审批单、提案 PPT 的右下角和 LinkedIn 公司页上都立得住。",
    en: "A management consulting brand. The name should promise clarity and a path around obstacles; the vibe is expensive through restraint, carrying judgment and methodology, worthy of the proposal cover and board minutes; it must hold up on the CFO's budget line, the pitch deck's corner, and the firm's LinkedIn page.",
  },
  "wholesale": {
    zh: "一个 B2B 批发平台品牌，寓意「货全、量大、拿货价实在」；气质要有市场的烟火气又有数字化的效率感、让档口老板和品牌方都愿意来；场景是采购经理的供应商列表、档口老板的名片和展会易拉宝上都立得住。",
    en: "A B2B wholesale platform brand. The name should say full stock, real quantity, honest trade prices; the vibe blends marketplace bustle with digital efficiency, welcoming both stall owners and brands; it must hold up in a purchasing manager's supplier list, a stall owner's business card, and the trade-show banner.",
  },
  "trading": {
    zh: "一个外贸公司与进出口贸易品牌，寓意「把货可靠地送到大洋彼岸」；气质要稳健可信、中英文都好念好拼、经得起海关银行的单据流转；场景是广交会的摊位楣板、形式发票的抬头和海外买家的供应商档案里都立得住。",
    en: "An import-export trading brand. The name should promise goods delivered reliably across the ocean; the vibe is steady and credible, pronounceable and spellable in both languages, surviving customs and bank paperwork; it must hold up on the Canton Fair fascia, the invoice header, and the overseas buyer's supplier file.",
  },
  "coupon": {
    zh: "一个优惠券与折扣导购平台品牌，寓意「会买的人先来这儿查一下」；气质要精明不寒酸、像掌握情报的行家而不是抠门的省钱工具；场景是结算页前的搜索框、比价群的链接分享和浏览器插件的图标上都立得住。",
    en: "A coupon and deals platform brand. The name should say smart buyers check here first; the vibe is savvy without shabbiness — an insider with intel, not a stingy penny-pincher tool; it must hold up in the pre-checkout search box, the deal-group link share, and the browser extension icon.",
  },
  "flashsale": {
    zh: "一个限时特卖与闪购电商品牌，寓意「好货有限时，错过就没了」；气质要快而体面、有会员特权感和正品底气、绝不像清仓甩卖；场景是 App 推送的弹窗、限时开抢的倒计时页和快递箱的胶带上都立得住。",
    en: "A flash sale e-commerce brand. The name should carry good finds, limited time — gone if you blink; the vibe is fast yet dignified, with members-only privilege and authenticity confidence, never a clearance bin; it must hold up in the push-notification banner, the countdown page, and the tape on the shipping box.",
  },
  "pestcontrol": {
    zh: "一个害虫防治与消杀服务品牌，寓意「虫害到我为止、这家有科学防线」；气质要专业干净、有终结感又让人安心、绝不像打游击的野队；场景是地图搜索的结果页、商户年检报告的抬头和师傅工服的胸前都立得住。",
    en: "A pest control service brand. The name should say the infestation ends here, backed by a scientific defense; the vibe is professional and clean, final yet reassuring, never a fly-by-night crew; it must hold up in map search results, on the commercial inspection report header, and on the technician's uniform.",
  },
  "roofing": {
    zh: "一个屋顶施工与防水工程品牌，寓意「头顶的大事交给靠得住的人」；气质要庇护可靠、有工匠手艺感和质保底气、经得起大额工程的审视；场景是草坪上的施工告示牌、保险理赔的推荐名录和报价单的抬头都立得住。",
    en: "A roofing and waterproofing brand. The name should promise what's overhead is in dependable hands; the vibe is sheltering and reliable, with craftsman skill and warranty confidence, standing up to big-ticket scrutiny; it must hold up on the yard sign, the insurance adjuster's referral list, and the quote header.",
  },
  "towing": {
    zh: "一个道路救援与拖车服务品牌，寓意「深夜抛锚也马上有人来、明码计价不宰客」；气质要极速可靠、像随行的守护而不是趁火打劫的野拖车；场景是深夜的地图搜索、保险 App 的合作商列表和救援车的车身喷绘都立得住。",
    en: "A towing and roadside assistance brand. The name should promise help arrives fast even at midnight, at upfront honest rates; the vibe is rapid and dependable — a guardian alongside, never a predatory tow; it must hold up in a midnight map search, the insurance app's partner list, and the truck-door decal.",
  },
  "selfstorage": {
    zh: "一个自助仓储与迷你仓品牌，寓意「给生活多腾一个房间、家当存得稳妥」；气质要安全灵活、像家当的银行而不是冷冰冰的铁皮柜；场景是路边仓库的巨幅招牌、搬家公司的推荐话术和线上订仓页的标题都立得住。",
    en: "A self-storage brand. The name should evoke one more room for life, belongings kept safe and sound; the vibe is secure yet flexible — a bank for your belongings, not a cold tin shed; it must hold up on the roadside facility sign, in the mover's referral, and on the online booking page.",
  },
  "catering": {
    zh: "一个宴会外烩与企业团餐品牌，寓意「几百人的饭也办得体面、履约从不掉链」；气质要有盛宴的仪式感又有招标桌上的正规感、绝不像凑合的大锅饭；场景是婚宴餐台的桌牌、招标书的资质页和婚庆公司的推荐名录里都立得住。",
    en: "A catering and food service brand. The name should promise dignity for a meal of hundreds, delivered without a slip; the vibe carries banquet ceremony plus tender-table rigor, never a settle-for mess hall; it must hold up on the buffet placard, the tender's vendor page, and the wedding planner's referral list.",
  },
  "signage": {
    zh: "一个广告招牌与标识制作品牌，寓意「让每个生意都被看见、开业日期前准时点亮」；气质要醒目利落、有设计感和工程正规感、绝不像街边图文快印；场景是自家门头的活广告、连锁品牌的投标书和装修公司的转包名录里都立得住。",
    en: "A sign-making and signage brand. The name should promise every business gets seen, lit on time before opening day; the vibe is conspicuous and crisp, with design taste and engineering rigor, never a corner print shop; it must hold up on your own storefront, in the chain-brand tender, and on the contractor's sub list.",
  },
  "shortvideo": {
    zh: "一个短视频制作与内容厂牌品牌，寓意「懂节奏、能出爆款、条条片子有网感」；气质要快而利落、有创作者人格又有履约正规感、绝不像老派文化传媒公司；场景是比稿 PPT 封面、竖屏片头角标和「这条片子谁做的」的圈内转述里都立得住。",
    en: "A short-video production studio brand. The name should promise feed fluency, viral instincts, and rhythm in every cut; the vibe is fast and crisp, creator-flavored yet delivery-reliable, never a stale media company; it must hold up on a pitch-deck cover, in a vertical-video watermark, and in \"who made that one?\" industry word of mouth.",
  },
  "audiobook": {
    zh: "一个有声书制作与配音工作室品牌，寓意「声音有温度、听一遍就记住」；气质要专业有戏感又温暖陪伴、绝不像冷冰冰的录音棚编号；场景是片头口播、出版社供应商名录和听众「你在哪听的」的转述里都立得住。",
    en: "An audiobook and voiceover studio brand. The name should carry warmth in the voice and stick after one hearing; the vibe is professional with dramatic range yet companionably warm, never a numbered recording booth; it must hold up in an episode intro read, on a publisher's vendor list, and in a listener's \"where did you hear it?\" referral.",
  },
  "postproduction": {
    zh: "一个影视后期与特效制作品牌，寓意「逐帧打磨、把不可能拍出来」；气质要硬核精工、有魔法感又有工业产能的可靠、绝不像街边快剪小店；场景是片尾滚动字幕、行业奖项名单和制片主任的供应商名录里都立得住。",
    en: "A film post-production and VFX brand. The name should promise frame-by-frame craft and filming the impossible; the vibe is hardcore precision with a touch of magic and industrial-capacity reliability, never a strip-mall quick-cut shop; it must hold up in the end-credits roll, on awards lists, and in the line producer's vendor roster.",
  },
  "animation": {
    zh: "一个动画工作室与内容厂牌品牌，寓意「造一个世界、片头五秒就是品质承诺」；气质要有想象力与厂标分量、既柔软动人又立得住出品方三个字；场景是片头 logo 动画、电影节片单和衍生品包装上都立得住。",
    en: "An animation studio brand. The name should promise a world of its own, with the five-second opening logo as a quality vow; the vibe is imaginative with marque-level weight — tender yet sturdy enough for \"presented by\"; it must hold up in the opening logo animation, on festival slates, and on merchandise packaging.",
  },
  "documentary": {
    zh: "一个纪录片工作室与纪实厂牌品牌，寓意「替观众看见真实、十年跟拍也守得住」；气质要真诚厚重有立场、绝不轻浮猎奇；场景是电影节片单、平台委托的基金申请书和「这是哪家拍的」的口碑转述里都立得住。",
    en: "A documentary studio brand. The name should promise seeing the real world on the audience's behalf, patient enough for a ten-year follow shoot; the vibe is sincere, weighty and principled, never flippant or sensational; it must hold up on festival slates, in commissioning grant applications, and in \"who made this?\" word of mouth.",
  },
  "newsmedia": {
    zh: "一个独立新闻媒体与资讯订阅品牌，寓意「替读者核实过了、配得上你的时间」；气质要独立锐利又稳重可信、绝不像流量营销号；场景是「据 XX 报道」的转引、订阅邮件发件人栏和读者「你看的哪家」的转述里都立得住。",
    en: "An independent news outlet brand. The name should promise verified-for-you journalism worth your time; the vibe is independent and sharp yet steady and credible, never a traffic-chasing content farm; it must hold up in \"according to X\" citations, the newsletter sender line, and readers' \"which one do you read?\" referrals.",
  },
  "fruitshop": {
    zh: "一个水果店与生鲜果切品牌，寓意「从枝头到舌尖、每天都新鲜」；气质要甜而清爽、有产地故事又亲切日常、绝不像批发档口；场景是社区门头招牌、外卖平台列表和团购接龙里的「今天去 XX 买点水果」都立得住。",
    en: "A fruit shop and fresh-cut brand. The name should promise branch-to-tongue freshness every day; the vibe is sweet and crisp, orchard-storied yet neighborly, never a wholesale stall; it must hold up on a storefront sign, in delivery-app lists, and in the group-buy thread's \"grabbing fruit at X today\".",
  },
  "seafood": {
    zh: "一个海鲜餐厅与水产品牌，寓意「今日到港、鲜活有人负责」；气质要鲜活体面、有渔港烟火气又托得住宴请、绝不像美食广场档口；场景是门头灯箱、大众点评榜单和「今晚 XX 请客」的转述里都立得住。",
    en: "A seafood restaurant brand. The name should promise today's catch with someone answering for freshness; the vibe is lively yet dignified, fish-market warm yet banquet-worthy, never a food-court stall; it must hold up on the lightbox sign, in review rankings, and in \"I'm hosting at X tonight\".",
  },
  "tailor": {
    zh: "一个服装定制与裁缝工作室品牌，寓意「为你一人而作、人生重要时刻都合身」；气质要手艺精工、有绅装传统又不老派疏远、绝不像商场改衣铺；场景是试衣间铜牌、婚博会展位和「我这套是在 XX 做的」的炫耀式转述里都立得住。",
    en: "A made-to-measure tailoring studio brand. The name should promise garments made for you alone, fitting life's biggest moments; the vibe is precise craft with sartorial heritage yet never stuffy, never a mall alteration counter; it must hold up on the fitting-room plaque, at wedding expos, and in the proud \"mine was made at X\".",
  },
  "equestrian": {
    zh: "一个马术俱乐部与马房品牌，寓意「真马场真教练、把骑士精神教给孩子」；气质要专业有传统分量、贵气而不虚浮、绝不像游乐场骑马项目；场景是马术服胸口刺绣、赛事秩序册和家长圈转介绍里都立得住。",
    en: "An equestrian club and stable brand. The name should promise real grounds, real coaches, and horsemanship taught to the next generation; the vibe is professional with heritage weight, refined without empty poshness, never a pony-ride attraction; it must hold up embroidered on a show jacket, in event programs, and in parent-circle referrals.",
  },
  "archery": {
    zh: "一个射箭馆与弓箭运动品牌，寓意「正中靶心、一箭入魂的专注」；气质要利落有命中感、既接得住团建热闹又有箭道的安静、绝不像游戏厅；场景是商场门头、团建平台列表和「周五去 XX 射箭」的约局消息里都立得住。",
    en: "An archery range brand. The name should promise the bullseye thrill and single-arrow focus; the vibe is crisp with hit-energy, holding both team-outing buzz and shooting-line quiet, never an arcade; it must hold up on the mall storefront, in team-building listings, and in the \"archery at X this Friday?\" group chat.",
  },
  "immigration": {
    zh: "一个移民咨询与身份规划品牌，寓意「专业的人替你走通此岸到彼岸」；气质要稳重专业有国际格局、绝不像街边中介柜台、更不暗示保过特批；场景是官网署名、方案书封面和家庭饭桌上「我找的是 XX」的反复讨论里都立得住。",
    en: "An immigration consulting and identity-planning brand. The name should promise professionals walking you from this shore to the other; the vibe is steady, credentialed and globally minded, never a street-agent counter and never hinting at guaranteed approval; it must hold up on official filings, proposal covers, and the family dinner-table's repeated \"I went with X\".",
  },
  "deli": {
    zh: "一个卤味熟食品牌，寓意「一锅老卤的滋味，下班路上顺手的那份好味」；气质要有食欲有烟火气、又接得住礼盒与电商的体面、绝不像临时摊位；场景是档口招牌、外卖平台缩略图和「下班带一份 XX」的口头指令里都立得住。",
    en: "A deli and braised-food brand. The name should evoke a master broth's depth and the easy pick-up on the way home; the vibe is appetizing and warmly street-smart, yet dignified enough for gift boxes and e-commerce, never a pop-up stall; it must hold up on the stall signboard, in delivery-app thumbnails, and in the daily \"grab some X on the way home\".",
  },
  "winery": {
    zh: "一个精品酒庄与葡萄酒品牌，寓意「一方风土酿进一瓶酒」；气质要有庄园分量与家族质感、经得起酒标与拍卖图录、绝不山寨欧陆城堡；场景是酒标、酒单和「上次那瓶 XX 不错」的餐桌复述里都立得住。",
    en: "A boutique winery and wine brand. The name should evoke one terroir aged into one bottle; the vibe carries estate weight and family texture, worthy of the label and the auction catalogue, never a knockoff château; it must hold up on wine labels, wine lists, and the dinner-table's \"that bottle of X was good\".",
  },
  "sushi": {
    zh: "一家日料餐厅与寿司品牌，寓意「板前的安静与食材的新鲜」；气质要有匠气与留白、克制而不堆砌和风符号、绝不像游客店；场景是商场门头、点评榜单和「今晚吃日料去 XX」的提名里都立得住。",
    en: "A sushi restaurant and Japanese-dining brand. The name should evoke the hush of the counter and the freshness of the catch; the vibe is artisanal with quiet restraint, never a pile of tourist-trap symbols; it must hold up on the mall facade, in review rankings, and in tonight's \"let's do Japanese at X\".",
  },
  "icecream": {
    zh: "一个冰淇淋与甜品站品牌，寓意「一口化开的快乐」；气质要轻快上镜有甜感、经得起橱窗与九宫格照片、绝不甜腻廉价；场景是橱窗招牌、便利店冰柜贴纸和社交软件晒图里都立得住。",
    en: "An ice cream and dessert brand. The name should evoke joy that melts on the tongue; the vibe is light, photogenic and sweet without being saccharine or cheap; it must hold up on the shop window, on freezer-door stickers, and in social-media photo grids.",
  },
  "hostel": {
    zh: "一个青年旅舍与背包客栈品牌，寓意「一张床位之外的相遇」；气质要轻盈有故事、酷而不端着、绝不像挂牌大酒店；场景是预订平台列表、攻略帖和大堂酒吧里「你也住这家？」的搭话里都立得住。",
    en: "A hostel and backpacker-lodge brand. The name should promise encounters beyond the bunk; the vibe is light, storied and cool without posing, never a plaque-heavy grand hotel; it must hold up in booking-platform listings, travel threads, and the lobby-bar's \"you're staying here too?\".",
  },
  "bowling": {
    zh: "一个保龄球馆与聚会娱乐品牌，寓意「全中一刻的脆响与满堂欢呼」；气质要有命中感与复古潮流味、托得住生日会团建与约会、绝不像过时电玩城；场景是商场导览屏、团建平台列表和「周五去 XX 打一局」的群消息里都立得住。",
    en: "A bowling alley and social-entertainment brand. The name should evoke the crack of a strike and the cheer that follows; the vibe is hit-energized and retro-cool, holding birthdays, team outings and dates, never a dated arcade; it must hold up on mall directories, team-outing platforms, and the \"bowling at X this Friday?\" group chat.",
  },
  "tea": {
    zh: "一个茶叶品牌，寓意「一方山场的滋味落进一盏日常」；气质要有山水感与人文分量、拿得住礼盒也接得住办公室的一杯日饮、绝不像景区纪念品；场景是礼盒柜台、电商详情页和茶桌上「上次喝的 XX 不错」的复述里都立得住。",
    en: "A tea brand. The name should evoke one terroir settling into an everyday cup; the vibe carries landscape and humanist weight, worthy of the gift box yet at home on an office desk, never a souvenir stall; it must hold up on gift counters, product detail pages, and the tea-table's \"that X we drank was good\".",
  },
  "hotspring": {
    zh: "一个温泉度假与汤泉品牌，寓意「一池热汤卸下一周疲惫」；气质要有疗愈感与在地风物、经得起预订平台图墙、绝不像洗浴中心；场景是预订列表、周末攻略和「周末去 XX 泡一天」的犒赏计划里都立得住。",
    en: "A hot spring resort and bathhouse brand. The name should evoke a week's fatigue dissolving in one hot pool; the vibe is healing and rooted in local terroir, worthy of booking-platform photo walls, never a bathhouse; it must hold up in booking listings, weekend guides, and the \"a day soaking at X\" reward plan.",
  },
  "trampoline": {
    zh: "一个蹦床公园与运动乐园品牌，寓意「离地一瞬的失重快乐」；气质要能量满格又让家长安心、托得住生日会团建与亲子、绝不像过时电玩城；场景是点评榜单、亲子平台和「周末带娃去 XX」的家庭计划里都立得住。",
    en: "A trampoline park and adventure venue brand. The name should evoke the weightless joy of leaving the ground; the vibe is fully charged yet parent-reassuring, holding birthdays, team outings and family visits, never a dated arcade; it must hold up on review rankings, family platforms, and the \"taking the kids to X\" weekend plan.",
  },
  "funeral": {
    zh: "一个殡葬服务与生命礼仪品牌，寓意「让告别体面，让思念有处安放」；气质要庄重有温度、可托付而不冰冷、绝不轻佻；场景是深夜搜索框、医院社工的转介绍和陵园门楣的石刻上都立得住。",
    en: "A funeral and memorial services brand. The name should promise a dignified farewell and a resting place for remembrance; the vibe is solemn yet warm, trustworthy and never cold or flippant; it must hold up in a late-night search box, in hospital referrals, and carved on the memorial-park gate.",
  },
  "securityguard": {
    zh: "一个安保服务公司品牌，寓意「出事之前的放心」；气质要可靠有纪律、威慑收进专业感、绝不像街头武馆；场景是投标文件封面、物业合同公章和岗亭制服臂章上都立得住。",
    en: "A security services company brand. The name should promise peace of mind before anything happens; the vibe is reliable and disciplined, deterrence folded into professionalism, never a street dojo; it must hold up on tender covers, contract seals, and the uniform patch at the gatehouse.",
  },
  "ipagency": {
    zh: "一个知识产权代理与专利商标服务品牌，寓意「把创新守成资产」；气质要精密专业有传承感、经得起公文抬头与英文官网、绝不堆砌大词；场景是投标名单、代理人名录和「我们的专利是 XX 代理的」的行业口碑里都立得住。",
    en: "An IP and patent services brand. The name should promise innovation guarded into assets; the vibe is precise, professional and heritage-minded, worthy of formal letterheads and the English site, never stacked with grand words; it must hold up on tender shortlists, practitioner directories, and the \"our patents are with X\" word of mouth.",
  },
  "wig": {
    zh: "一个面向海外市场的假发与接发品牌，寓意「戴上就是更自信的自己」；气质要好念好拼有变美的情感浓度、经得起 TikTok 测评口播、绝不显廉价；场景是英文独立站域名、网红联盟链接和 #标签里都立得住。",
    en: "A wig and hair extension brand for overseas markets. The name should promise a more confident self the moment it's worn; the vibe is easy to say and spell with real beauty-emotion, ready for TikTok review voiceovers, never cheap-looking; it must hold up as an English storefront domain, in affiliate links, and as a hashtag.",
  },
  "skincare": {
    zh: "一个护肤品牌，寓意「温和有效，把皮肤交给可信的人」；气质要在科学感与温度之间站稳一边、压得住素色瓶身的极简排版、绝不夸大功效；场景是成分测评、皮肤科医生推荐和免税店货架上都立得住。",
    en: "A skincare brand. The name should promise gentle efficacy — skin entrusted to someone credible; the vibe picks a clear side between lab science and warmth, holds minimalist type on a plain bottle, and never overclaims; it must hold up in ingredient reviews, dermatologist recommendations, and on duty-free shelves.",
  },
  "makeupartist": {
    zh: "一个化妆师与化妆造型工作室品牌，寓意「把最重要的那张脸交给你」；气质要有署名感与妆面的画面感、接得住新娘跟妆与商拍、绝不堆砌头衔；场景是小红书客片、婚礼请柬供应商名单和「找 XX 化妆」的转介绍里都立得住。",
    en: "A makeup artist and styling studio brand. The name should carry the trust of \"the most important face of the day\"; the vibe is signature-like with the imagery of a beautiful finish, holding bridal and commercial work, never stacked with titles; it must hold up in portfolio posts, on wedding vendor lists, and in \"book X for makeup\" referrals.",
  },
  "homestaging": {
    zh: "一个房屋整备与软装布置品牌，寓意「让房子看起来值这个价」；气质要专业有审美、带「挂牌即登场」的焕新感、绝不像搬家公司或家居博主；场景是中介供应商名单、带看照和 Before/After 对比帖里都立得住。",
    en: "A home staging and styling brand. The name should promise a house that looks worth its price; the vibe is professional with taste and a curtain-up freshness, never a moving company or a decor blog; it must hold up on agents' vendor lists, in listing photos, and in before/after comparison posts.",
  },
  "yachtcharter": {
    zh: "一个游艇租赁与游艇俱乐部品牌，寓意「一段海上的高光时刻」；气质要贵而不炫、有香槟色海面的画面感、可靠得让替全家做决定的人放心、绝不像渔家乐；场景是夕阳甲板打卡照、OTA 体验列表和酒店礼宾推荐里都立得住。",
    en: "A yacht charter and boat club brand. The name should promise a highlight moment on the water; the vibe is expensive but not loud, with champagne-sea imagery, reliable enough for whoever books for the whole family, never a fishing wharf; it must hold up in sunset-deck photos, OTA listings, and hotel concierge recommendations.",
  },
  "autoparts": {
    zh: "一个汽配与汽车用品品牌，寓意「装得放心，跑得带劲」；气质要有金属感与性能气质、像靠得住的零件、绝不山寨大牌拼写；场景是英文电商 listing、修理厂采购群和改装论坛的口碑里都立得住。",
    en: "An auto parts and accessories brand. The name should promise safe to install and strong on the road; the vibe is metallic with performance energy, reading like a dependable component, never a look-alike of big brands; it must hold up in English marketplace listings, repair-shop procurement chats, and modder-forum word of mouth.",
  },
  "robotics": {
    zh: "一个机器人与具身智能公司品牌，寓意「可靠的机器，不吓人的伙伴」；气质要工程可信又有人格温度、经得起从机械臂到通用机器人的叙事扩张、绝不带科幻反派的冷酷感；场景是英文论文引用、政府采购文件和融资 BP 封面上都立得住。",
    en: "A robotics and embodied-AI company brand. The name should promise reliable machines that aren't scary companions; the vibe balances engineering credibility with human warmth, with headroom from robot arms to general-purpose machines, never sci-fi-villain cold; it must hold up in academic citations, procurement files, and on a pitch-deck cover.",
  },
  "nocode": {
    zh: "一个无代码/低代码搭建工具品牌，寓意「不懂技术也能立刻做出来」；气质要轻盈顺滑有速度感、让运营和设计师产生「我也行」的直觉、绝不堆 code/dev 类技术黑话；场景是同事转述推荐、YouTube 教程标题和模板市场里都立得住。",
    en: "A no-code / low-code builder brand. The name should promise you can build it right now without being technical; the vibe is light, frictionless and fast, giving marketers and designers the instinct of \"I could do this,\" never stacked with code/dev jargon; it must hold up in colleague referrals, YouTube tutorial titles, and template marketplaces.",
  },
  "badminton": {
    zh: "一个羽毛球馆与羽球俱乐部品牌，寓意「快、准、有归属感的主场」；气质要有扣杀的速度感与飞行的轻盈、家长读出专业安全、球友读出热血归属、绝不像万金油体育中心；场景是地图搜索列表、微信约球接龙和马路对面的招牌上都立得住。",
    en: "A badminton club and academy brand. The name should promise a fast, precise home court with belonging; the vibe carries the pace of a smash and the lightness of flight, reading professional and safe to parents and spirited to players, never a generic sports center; it must hold up in map-search lists, group-chat roll calls, and on the street sign.",
  },
  "gokart": {
    zh: "一个卡丁车馆与卡丁车俱乐部品牌，寓意「两秒点燃的肾上腺素」；气质要有引擎轰鸣的速度感与正规赛道的专业气场、让家庭客觉得好玩不吓人、绝不与汽修改装店混淆；场景是短视频话题标签、团购页面和赛道圈速榜上都立得住。",
    en: "A go-kart venue and karting club brand. The name should promise adrenaline ignited in two seconds; the vibe roars with engine speed and real-circuit legitimacy while staying fun-not-scary for families, never mistaken for a repair or tuning shop; it must hold up as a short-video hashtag, on group-buy pages, and atop the lap-time board.",
  },
  "sauna": {
    zh: "一个汗蒸桑拿与新式养生馆品牌，寓意「进去一个人，出来另一个人」；气质要有热浪与冷杉的体感、仪式感与私密感并存、绝不像旧式洗浴中心也不玄学；场景是预订平台列表、会员周常口播和点评推荐里都立得住。",
    en: "A sauna and new-wave wellness house brand. The name should promise walking out a different person than walked in; the vibe carries heat waves and cedar with ritual and privacy, never an old-school bath center and never mystical; it must hold up in booking-platform lists, weekly member mentions, and review recommendations.",
  },
  "pizza": {
    zh: "一个披萨店与披萨品牌，寓意「窑火现烤的碳水快乐」；气质要有明火与饼皮的画面感、带一点意式正宗又保证好念好拼、绝不与万千 Pizza House 撞名；场景是电话点单口播、外卖 App 搜索和保温袋印刷上都立得住。",
    en: "A pizza shop and pizza brand. The name should promise oven-fired carb happiness; the vibe carries open flame and fresh crust with a touch of Italian authenticity while staying easy to say and spell, never colliding with ten thousand Pizza Houses; it must hold up in phone orders, delivery-app search, and printed on the thermal bag.",
  },
  "electrician": {
    zh: "一家电工与电气服务公司，寓意「持证专业、随叫随到」；气质要安全可靠、有执照与规范作业的专业感、绝不轻佻；场景是地图搜索结果、车身广告和报价单抬头上都立得住。",
    en: "An electrician and electrical services company. The name should promise licensed expertise and rapid response; the vibe is safe, dependable, and code-compliant professional, never flippant; it must hold up in map search results, on a van wrap, and atop a written quote.",
  },
  "landscaping": {
    zh: "一家园林景观设计与养护公司，寓意「四季常青、把院子变成风景」；气质要有生机与设计感、可靠得起全年养护合约；场景是工程车侧身、庭院施工牌和地图搜索里都清晰好认。",
    en: "A landscaping design and maintenance company. The name should evoke year-round green and turning yards into scenery; the vibe is alive and design-minded yet dependable enough for annual care contracts; it must read clearly on a truck door, a yard sign, and in map search.",
  },
  "painting": {
    zh: "一家油漆粉刷公司，寓意「焕然一新、说到做到」；气质要整洁专业、有确定性与品质感、不玩过火的双关；场景是工服胸口、报价单抬头和社区口碑转述里都体面可信。",
    en: "A painting contractor. The name should promise a fresh new look delivered on schedule; the vibe is tidy, professional, and certain, with no overcooked puns; it must look credible stitched on a shirt, printed atop a quote, and passed along in neighborhood referrals.",
  },
  "jobboard": {
    zh: "一个招聘求职平台，寓意「机会真实、人岗相遇」；气质要中性偏正向、对求职者有希望感、对雇主够正规可信；场景是每天输入的域名、招聘预算审批单和「我在这找到工作」的口碑里都成立。",
    en: "A job board and hiring platform. The name should suggest real openings where people and roles meet; the vibe is neutral-hopeful — encouraging to candidates yet formal enough for employers; it must work as a daily-typed domain, on a hiring-budget form, and in \"I found my job there\" word of mouth.",
  },
  "restaurantsupply": {
    zh: "一家餐饮设备与用品供应商，寓意「货全价优、商用等级、当天发货」；气质要像撑得起五万个 SKU 的正经公司、直白高效不绕弯；场景是补货清单、电话报单和批发目录里都好记好念。",
    en: "A restaurant equipment and supplies dealer. The name should promise everything in stock at commercial grade with fast shipping; the vibe is a serious company that can carry fifty thousand SKUs — literal and efficient, no riddles; it must stay memorable on a restock list, over the phone, and in a wholesale catalog.",
  },
  "motorcycleparts": {
    zh: "一个摩托车配件与骑行装备品牌，寓意「轰油门的快感与硬核可靠」；气质要够快够硬、有骑士圈层认同、又配得上严谨的车型适配数据；场景是头盔贴纸、油箱 logo 和电商搜索里都够酷够准。",
    en: "A motorcycle parts and riding gear brand. The name should carry throttle-twisting thrill and forged-metal reliability; the vibe is fast, hard, and tribal enough for rider culture while credible next to precise fitment data; it must look sharp on a helmet sticker, a tank logo, and in marketplace search.",
  },
  "auction": {
    zh: "一家拍卖行或在线拍卖平台，寓意「槌起槌落、价高者得」；气质要权威可信、担得起高价拍品、流程感正规；场景是拍卖师口播、图录封面和「我在这拍到的」口碑转述里都一次听清。",
    en: "An auction house or online bidding platform. The name should carry the gavel's authority and highest-bidder-wins fairness; the vibe is institutional and trustworthy enough for high-value lots; it must land in one hearing when the auctioneer calls it, on a catalog cover, and in \"I won it there\" word of mouth.",
  },
  "antiques": {
    zh: "一家古董古玩店，寓意「有年头、有来历、值得收藏」；气质要有书卷气与出处感、风雅但好记、不显地摊气；场景是藏家转述、店招牌匾和搜索核实里都立得住。",
    en: "An antique and vintage shop. The name should evoke age, provenance, and pieces worth collecting; the vibe is storied and refined yet memorable, never flea-market cheap; it must hold up in collector word of mouth, on a shop sign, and in a verification search.",
  },
  "lightingbrand": {
    zh: "一个灯具与照明品牌，寓意「光定气质、亮得可靠」；气质要有设计感与光的意象、又配得上工程投标的正规感；场景是灯具吊牌、展厅门头和安装师傅的口头推荐里都好念好认。",
    en: "A lighting and lamp brand. The name should carry the imagery of light setting a room's mood with dependable engineering; the vibe is design-minded yet formal enough for a project tender; it must read well on a fixture hang tag, a showroom front, and in an electrician's spoken referral.",
  },
  "outlet": {
    zh: "一家折扣店或奥特莱斯特卖平台，寓意「捡到便宜的快感、超值不寒酸」；气质要响亮直给、有寻宝惊喜感、不显廉价；场景是「今天去逛逛」的日常对话、门头大字和限时特卖页里都好念好拼。",
    en: "An outlet or discount store. The name should carry the thrill of scoring a bargain — great value without shabbiness; the vibe is loud, literal, and treasure-hunt fun, never cheap-feeling; it must roll off the tongue in \"let's swing by\" small talk, on big storefront letters, and on a flash-sale page.",
  },
  "watches": {
    zh: "一个腕表品牌或钟表店，寓意「机芯里的年头与手艺」；气质要庄重有传承感、配得上高价签、全球好念；场景是表盘印字、鉴定证书和买家下单前的搜索核实里都立得住。",
    en: "A watch brand or dealer. The name should carry the years and handwork inside the movement; the vibe is solemn and heritage-rich, worthy of the price tag, pronounceable worldwide; it must hold up printed on a dial, on an authentication certificate, and in a buyer's pre-purchase search.",
  },
  "sneakers": {
    zh: "一家球鞋买手店或潮鞋交易平台，寓意「圈内认证、街头血统」；气质要短而独特、有鞋圈黑话的会心一笑、适合做话题标签；场景是社媒标签、店铺门头和鞋盒贴纸里都够酷够认。",
    en: "A sneaker boutique or resale platform. The name should carry tribal certification and street pedigree; the vibe is short, distinct, and knowing enough to make sneakerheads smile — built for hashtags; it must look sharp as a social tag, on a storefront, and on a shoebox sticker.",
  },
  "dollarstore": {
    zh: "一家一元店或折扣百货，寓意「便宜到惊喜、逛店像寻宝」；气质要响亮直给、有捡到便宜的快乐、超值但不寒酸；场景是门头大字招牌、促销海报和「那家店真便宜」的街坊口碑里都一眼认出。",
    en: "A dollar store or discount variety shop. The name should promise surprising cheapness and treasure-hunt browsing; the vibe is loud, literal and joyful about the deal, great value without shabbiness; it must read instantly on big sign letters, sale posters, and in \"that store is so cheap\" neighborhood word of mouth.",
  },
  "thriftstore": {
    zh: "一家二手店或古着循环商店，寓意「旧物有故事、循环有价值」；气质要温暖有趣、有淘宝的惊喜感、环保而不说教；场景是店招、寄卖小票和「我在那淘到宝了」的转述里都让人想逛。",
    en: "A thrift or vintage resale shop. The name should turn pre-loved goods into treasures with stories; the vibe is warm and playful with treasure-hunt surprise, sustainable without preaching; it must invite browsing on the shop sign, a consignment slip, and in \"I found a gem there\" retellings.",
  },
  "officesupplies": {
    zh: "一家办公用品与耗材供应商，寓意「一次买全、次次不误事」；气质要可靠齐全、高效省心、经得起发票抬头的正式感；场景是采购系统、对账单和行政的「就在他家订」口碑里都稳稳立住。",
    en: "An office supplies and consumables vendor. The name should promise one-stop ordering that never misses; the vibe is dependable, complete and efficient, formal enough for an invoice header; it must hold steady in procurement systems, monthly statements, and the admin's \"we always order there\" endorsement.",
  },
  "medicalsupplies": {
    zh: "一家医疗器械与医用耗材商，寓意「专业守护生命、精准可靠」；气质要专业有资质感、又有健康的温度、绝不轻浮；场景是医院采购目录、产品资质文件和家庭护理者的搜索核实里都令人放心。",
    en: "A medical equipment and supplies business. The name should carry professional guardianship of life with precision and reliability; the vibe is clinical and credentialed yet humanly warm, never flippant; it must reassure in hospital procurement catalogs, compliance documents, and a home caregiver's verification search.",
  },
  "buildingmaterials": {
    zh: "一家建材店或装修材料商，寓意「材料齐全、房子立得住」；气质要坚固可靠、大而齐全、经得起投标文件的正式感；场景是包工头的电话转介绍、工地送货单和业主群的「他家材料靠谱」里都一遍听清。",
    en: "A building materials and hardware dealer. The name should promise complete stock and structures that stand; the vibe is solid, abundant and dependable, formal enough for a tender document; it must land in one hearing on a contractor's referral call, a jobsite delivery slip, and the homeowner group's \"their materials hold up\".",
  },
  "franchise": {
    zh: "一个连锁加盟品牌，寓意「生意可复制、招牌全国通」；气质要大气正规、县城与一线都成立、能长出 IP 形象；场景是加盟商尽调、门店招牌和招商说明会里都让人觉得总部有实力。",
    en: "A franchise chain brand. The name should promise a replicable business and a sign that travels; the vibe is credible and big-league, working equally in metro flagships and county towns, with room for a mascot; it must impress in franchisee due diligence, on storefront signage, and at the recruitment pitch.",
  },
  "villarental": {
    zh: "一个度假别墅与高端民宿短租品牌，寓意「整栋私享、假期从名字开始」；气质要高级克制、有山海度假的画面感、经得起大额定金前的反复搜索；场景是房源列表、管家欢迎卡和「我们订了 XX 的别墅」的转述里都体面动人。",
    en: "A villa rental and luxury vacation stay brand. The name should promise a whole home to yourselves with the holiday starting at the name; the vibe is quietly premium with sea-and-mountain imagery, solid enough to survive pre-deposit searches; it must feel gracious on listing pages, the butler's welcome card, and in \"we booked a villa with X\" retellings.",
  },
  "cruise": {
    zh: "一家邮轮旅行社或订票平台，寓意「海上宫殿、启航即度假」；气质要稳重可信又有航海浪漫、念给长辈听不起疑；场景是航线手册、提前半年的定金合同和全家出游的商量饭桌上都稳稳立住。",
    en: "A cruise agency or booking platform. The name should carry floating-palace grandeur where the vacation starts at boarding; the vibe is trustworthy and steady with nautical romance, safe when read aloud to grandparents; it must hold steady in itinerary brochures, six-months-ahead deposit contracts, and the family dinner-table debate.",
  },
  "customtour": {
    zh: "一家定制旅行工作室，寓意「只为你设计的旅程」；气质要有品味有态度、个性但可信、说出口有面子；场景是熟人转介绍、行程设计书封面和「我们这次找 XX 定制的」的饭桌炫耀里都恰到好处。",
    en: "A bespoke travel design studio. The name should promise a journey designed for one client only; the vibe is tasteful and opinionated, distinctive yet credible, prestigious to say aloud; it must land perfectly in word-of-mouth referrals, on the itinerary book cover, and in the dinner-table brag \"we had it designed by X\".",
  },
  "limoservice": {
    zh: "一家豪车接送与礼宾专车公司，寓意「体面准点、贵宾专属」；气质要黑西装般克制尊贵、正规到能进企业差旅系统；场景是机场接机牌、婚礼头车和年会贵宾调度单里都拿得出手。",
    en: "A limo and chauffeur service. The name should promise polish, punctuality and VIP exclusivity; the vibe is black-suit restraint and prestige, official enough for a corporate travel system; it must look right on an airport name board, the wedding lead car, and the gala VIP dispatch sheet.",
  },
  "ticketing": {
    zh: "一个演出票务与订票平台，寓意「官方靠谱、开票必达」；气质要快而稳、有开场前的心跳感、两秒说得清；场景是抢票倒计时、入场二维码和「在哪买的票」的一句话口碑里都即刻反应。",
    en: "A live-event ticketing platform. The name should promise official reliability where every on-sale delivers; the vibe is fast and steady with pre-showtime heartbeat, sayable in two seconds; it must fire instantly in on-sale countdowns, on entry QR codes, and in the one-line \"where did you get tickets\" word of mouth.",
  },
  "flowerdelivery": {
    zh: "一个鲜花电商与订阅订花品牌，寓意「新鲜绽放、准时的心意」；气质要浪漫又可靠、上镜适合晒图、说出口带花香；场景是快递花盒、贺卡署名和每周收花的朋友圈晒图里都体面动人。",
    en: "A flower delivery and bouquet subscription brand. The name should promise fresh blooms and sentiment arriving on time; the vibe is romantic yet dependable, photogenic and fragrant when spoken; it must charm on the delivery box, the gift-card signature, and the weekly unboxing photos shared online.",
  },
  "taproom": {
    zh: "一家精酿酒馆或打酒站，寓意「现打新鲜、街区据点」；气质要有烟火气与态度、像街角老友不像货架商标；场景是微信群约酒、酒杯印字和半醉熟客的口头转述里都一说就懂。",
    en: "A taproom or craft beer bar. The name should promise fresh pours and a neighborhood hangout; the vibe is warm with an edge of craft rebellion, a street-corner friend rather than a shelf label; it must land in group-chat invites, on the glassware, and in a happily buzzed regular's retelling.",
  },
  "izakaya": {
    zh: "一家居酒屋或日式酒场，寓意「暖帘一掀、烟火扑面」；气质要松弛有温度、有炭炉与灯笼的画面感、一次说得清；场景是下班约酒、门口暖帘和「今晚去哪喝」的一句话邀约里都亲切自然。",
    en: "An izakaya or Japanese gastropub. The name should promise lifted curtains and charcoal warmth; the vibe is loose and warm with lantern-and-grill imagery, clear in one hearing; it must feel natural in after-work invites, on the entrance curtain, and in the one-line \"where are we drinking tonight\".",
  },
  "dayspa": {
    zh: "一家水疗 SPA 会所，寓意「城市里的避世角落」；气质要静谧克制、念出口就让肩膀松下来、配得上客单价；场景是闺蜜推荐、预约短信和香薰灯下的会员卡上都轻盈体面。",
    en: "A day spa and wellness retreat. The name should promise a sanctuary inside the city; the vibe is hushed and restrained, dropping shoulders the moment it is spoken, worthy of the price list; it must glow in friend referrals, booking confirmations, and on the membership card under aromatherapy light.",
  },
  "snacks": {
    zh: "一个零食与休闲食品品牌，寓意「一口上瘾、分享快乐」；气质要馋感十足又有品质托底、货架三秒能让人伸手；场景是货架包装、直播口播和办公室分享的「这是什么牌子」里都立刻记住。",
    en: "A snack and treats brand. The name should promise one-bite addiction and shareable joy; the vibe is crave-loaded with a quality anchor, triggering a reach within three shelf seconds; it must stick instantly on packaging, in livestream reads, and in the office \"what brand is this\".",
  },
  "lawfirm": {
    zh: "一家律师事务所，寓意「稳重可信、君子合力」；气质要端正庄重、有典籍底蕴、经得起委托前的反复查证；场景是委托合同抬头、法院文书和企业法务的推荐名单里都不怒自威。",
    en: "A law firm. The name should promise steadiness, trust and partners joined in purpose; the vibe is upright and grave with classical depth, solid under pre-engagement scrutiny; it must command quiet authority atop engagement letters, in court filings, and on the general counsel's shortlist.",
  },
  "orthodontics": {
    zh: "一个正畸齿科与隐形矫正品牌，寓意「隐形舒适、笑容可期」；气质要美而专业、去医疗恐惧又不失资质感；场景是咨询室话术、矫治器包装和两年后晒出的笑容对比图里都值得信赖。",
    en: "An orthodontics and clear aligner brand. The name should promise invisible comfort and a smile worth the journey; the vibe is beautiful yet clinical enough to trust, dissolving dental dread without losing credentials; it must reassure in the consult script, on aligner packaging, and in the two-year before-and-after smile reveal.",
  },
  "kidswear": {
    zh: "一个童装品牌与儿童服饰独立站，寓意「陪孩子长大的衣橱」；气质要童趣有品质、家长念着安心、孩子念着好玩；场景是吊牌绣标、家长群推荐和孩子指名要穿的那句「我要穿 XX」里都亲切好记。",
    en: "A kidswear brand and children's clothing store. The name should promise a wardrobe that grows with the child; the vibe is playful yet quality-anchored, reassuring to the parent and delightful to the child; it must charm on the woven label, in parent-group referrals, and in the child's own \"I want to wear X\".",
  },
  "cookingclass": {
    zh: "一家烹饪教室与菜谱教学品牌，寓意「人人端得出那盘菜」；气质要有锅气与治愈感、零基础不怯场；场景是周末约课、学员晒出第一盘菜的朋友圈和「跟他家学的」口碑推荐里都温暖可信。",
    en: "A cooking class and recipe brand. The name should promise that anyone can plate the dish; the vibe is sizzling yet soothing, welcoming to complete beginners; it must glow in weekend bookings, in the student's first-dish photo, and in the word-of-mouth \"I learned it from them\".",
  },
  "souvenir": {
    zh: "一个伴手礼与特产礼盒品牌，寓意「把一座城的心意带回家」；气质要有风土故事、拿得出手也自己想吃；场景是机场货架、礼盒缎带和收礼人问「这是什么」时的那句转述里都体面动人。",
    en: "A souvenir and local gift-box brand. The name should promise a city's sentiment carried home; the vibe is terroir-rich and giftable yet craveable for oneself; it must shine on the airport shelf, on the gift-box ribbon, and in the giver's one-line answer to \"what is this?\".",
  },
  "partyplanner": {
    zh: "一家派对策划与气球布置工作室，寓意「把每个纪念日变成一声哇」；气质要轻快上镜、自带彩带与糖果色；场景是家长群转发的九宫格、现场合照水印和「下次也找他家」的口碑里都好记好念。",
    en: "A party planning and balloon styling studio. The name should promise every milestone turned into a collective wow; the vibe is light, photogenic and candy-colored with confetti built in; it must pop in forwarded photo grids, in the party-photo watermark, and in the \"let's book them again\".",
  },
  "seafishing": {
    zh: "一家海钓包船与船钓俱乐部，寓意「懂海的船长带你上大物」；气质要野性专业、压得住风浪也接得住空军自嘲；场景是凌晨码头集合的群通知、渔获合照和钓友圈的船长名号里都硬核可信。",
    en: "A sea fishing charter and boat fishing club. The name should promise a captain who reads the water and puts you on the big one; the vibe is wild yet seamanlike, solid in a gale and good-humored on a skunked day; it must ring true in the 4 a.m. dock roll call, the trophy photo, and the angling circle's word of mouth.",
  },
  "horseranch": {
    zh: "一家马场骑乘与度假牧场，寓意「草原、蹄声与风的远方」；气质要旷野松弛、又稳得住第一次牵马的家长；场景是朋友圈定位、草原合照水印和亲子体验课的推荐里都上镜安心。",
    en: "A horse ranch and riding retreat. The name should promise prairie, hoofbeats and wind — the faraway within reach; the vibe is open-range and unhurried yet steady enough for a first-time rider's parent; it must look good in the geotag, the grassland photo watermark, and the family-lesson referral.",
  },
  "datingapp": {
    zh: "一款交友App与婚恋社交产品，寓意「心动那一刻被认真对待」；气质要轻快体面、有火花不轻浮；场景是应用商店图标、开屏 slogan 和用户向朋友说「我在用 XX」时都自然不尴尬。",
    en: "A dating app and social matching product. The name should promise that the moment of a spark is taken seriously; the vibe is light and dignified, flirtatious without being sleazy; it must work on the app-store icon, the splash-screen slogan, and in the user's unembarrassed \"I'm on X\".",
  },
  "singlesevents": {
    zh: "一个单身社交活动与脱单局品牌，寓意「去玩，顺便遇见对的人」；气质要热闹松弛、给报名者体面台阶；场景是活动海报、合照水印和朋友圈「我参加了 XX」的转发里都好玩不尴尬。",
    en: "A singles events and social mixer brand. The name should promise a night out where meeting someone is the bonus; the vibe is lively yet relaxed, handing every guest a dignified off-ramp; it must read playful in the poster, the group-photo watermark, and the forwarded \"I went to X\".",
  },
  "luxuryresale": {
    zh: "一家中古奢侈品与奢品寄卖店，寓意「好东西值得第二次被珍惜」；气质要体面可信、鉴定专业感十足；场景是门店招牌、鉴定证书和卖家说「我的包托付给他家」时都稳重不跌份。",
    en: "A luxury resale and consignment store. The name should promise that fine things deserve a second devotion; the vibe is dignified and trustworthy with authentication rigor built in; it must hold up on the storefront, on the authentication certificate, and in the consignor's \"I trusted them with my bag\".",
  },
  "organicfood": {
    zh: "一个有机食品电商与绿色食材品牌，寓意「从农场到餐桌都看得见」；气质要有泥土气与生命力、经得起溯源追问；场景是菜箱包装、认证标签旁和妈妈群「他家菜放心」的推荐里都可信温暖。",
    en: "An organic food store and green grocery brand. The name should promise a farm-to-table journey you can see; the vibe is earthy and full of vitality, standing up to every traceability question; it must feel trustworthy on the produce box, beside the certification label, and in the parents-group \"their food is safe\".",
  },
  "permanentmakeup": {
    zh: "一家半永久纹绣与纹眉工作室，寓意「一次做好，三年素颜」；气质要专业审美兼备、稳得住做在脸上的决定；场景是预约主页、案例对比图和顾客说「眉毛是在 XX 做的」时都专业体面。",
    en: "A permanent makeup and microblading studio. The name should promise done once, bare-faced for three years; the vibe is equal parts professional and tasteful, steady enough for a decision worn on the face; it must reassure on the booking page, in healed-result photos, and in the client's \"I got my brows done at X\".",
  },
  "homedecor": {
    zh: "一个家居饰品与软装品牌，寓意「把理想生活摆上柜子」；气质要松弛有品、立意能从花瓶延伸到床品；场景是新家九宫格、礼盒卡片和「这是我在 XX 买的」的推荐里都有生活品味。",
    en: "A home decor and soft-furnishing brand. The name should promise the good life placed on the shelf; the vibe is relaxed and tasteful, with a concept that stretches from vase to bedding; it must add taste points in the new-home photo grid, on the gift card, and in the \"I got it at X\".",
  },
  "craftvodka": {
    zh: "一个精酿伏特加与小批量蒸馏品牌，寓意「冰点之上的干净想象」；气质要冷冽克制、工艺感能撑起三倍溢价；场景是酒标、冻杯特写和调酒师说「试试 XX」的推荐里都体面好念。",
    en: "A craft vodka and small-batch distilling brand. The name should promise a clean imagination above the freezing point; the vibe is cool and restrained, with craft enough to carry a triple premium; it must read well on the label, in the frosted-glass close-up, and in the bartender's \"try X\".",
  },
  "esportsnews": {
    zh: "一个棋牌电竞赛事资讯与数据媒体，寓意「解说席而不是牌桌」；气质要专业热血、数据感十足且离下注越远越好；场景是赛事快讯标题、数据榜单页眉和主播口播里都权威顺口。",
    en: "An esports and card-gaming news and data outlet. The name should promise the commentary desk, never the table; the vibe is professional and spirited, data-forward and as far from the wager as possible; it must carry authority in the match headline, the rankings header, and the caster's shoutout.",
  },
  "sportsodds": {
    zh: "一个体育赛事数据与赛前分析资讯站，寓意「帮你看懂数字，不替你下注」；气质要冷静专业、快人一步；场景是比分推送、赛前拆解标题和球迷群转发「XX 的分析」里都可信好念。",
    en: "A sports data and pre-match analysis site. The name should promise help reading the numbers, never placing the bet; the vibe is calm, professional and a beat ahead; it must feel credible in the score push, the preview headline, and the fan-group forward of \"X's breakdown\".",
  },
  "tabletopclub": {
    zh: "一家桌游俱乐部与桌游吧，寓意「一群人围着一张桌子的晚上」；气质要热闹松弛、新客敢推门；场景是「今晚去哪」的组局群名、店门灯箱和会员卡上都好念有归属感。",
    en: "A tabletop club and board game cafe. The name should promise an evening of people around one table; the vibe is lively yet easy, unintimidating to first-timers; it must work as the game-night chat title, on the lightbox sign, and on the membership card with belonging built in.",
  },
  "futsal": {
    zh: "一家五人制足球与笼式球场场馆，寓意「城市里也能踢球的热血」；气质要街头利落、灯光感十足；场景是球队群名、队服背后和朋友圈定位「今晚 XX 见」里都好念带感。",
    en: "A futsal and caged-pitch venue. The name should promise city football under the floodlights; the vibe is street-sharp with night-game energy; it must roll off in the team chat title, print on the jersey back, and land in the geotagged \"see you at X tonight\".",
  },
  "fashionbuyer": {
    zh: "一家快时尚买手店与潮流集合店，寓意「替你先挑过一遍的眼光」；气质要有杂志感、品味立得住每周上新；场景是店头招牌、购物袋和「XX 家又上新了」的朋友圈里都有辨识度。",
    en: "A fast-fashion buyer store and select shop. The name should promise an eye that chose first; the vibe is magazine-grade, with taste that holds up to weekly drops; it must stay distinctive on the storefront, the shopping bag, and in the \"X just dropped new arrivals\" post.",
  },
  "basketball": {
    zh: "一家篮球培训与青训机构，寓意「凌晨球馆里变强的过程」；气质要热血靠谱、孩子听了想练家长听了放心；场景是训练服背后、球馆点名和家长群晒课表里都喊得响、说得出口。",
    en: "A basketball training academy for youth players. The name should promise the getting-better that happens in early-morning gyms; the vibe is fired-up yet credible, thrilling the kid and reassuring the parent; it must shout well at roll call, print proudly on the practice jersey, and read well in the parents' group chat.",
  },
  "rugby": {
    zh: "一家业余橄榄球俱乐部，寓意「一件传了三代的球衣」；气质要有图腾感、传统与热血并存；场景是队歌合唱、酒馆第三半场和队徽刺绣上都立得住、喊得响。",
    en: "An amateur rugby club. The name should feel like a jersey handed down three generations; the vibe is totemic, tradition and ferocity in one; it must hold up embroidered on the crest, roar well in the club anthem, and carry through the pub's third half.",
  },
  "cricket": {
    zh: "一个板球爱好者社区与球迷资讯站，寓意「看台上一坐就有人递茶的老位置」；气质要懂行亲切、经得起五天测试赛的慢聊；场景是比分讨论群、播客口播和看台闲谈里都好念耐用。",
    en: "A cricket fan community and info site. The name should promise the regular's seat where someone passes the tea; the vibe is knowledgeable and warm, built for five days of slow talk; it must wear well in the score chat, the podcast shoutout, and the chatter of the stands.",
  },
  "aquascaping": {
    zh: "一家观赏鱼与水族造景工作室，寓意「桌面上一片会呼吸的风景」；气质要安静有手艺感、读出来像水面不起波澜；场景是定制缸署名、展厅门头和造景直播口播里都体面好念。",
    en: "An ornamental fish and aquascaping studio. The name should promise a breathing landscape on a desktop; the vibe is quiet and crafted, reading like an unrippled surface; it must sign a custom tank with dignity, sit well on the showroom front, and say cleanly in the scaping livestream.",
  },
  "fanclub": {
    zh: "一个粉丝应援站与粉丝社区，寓意「举起来同担一眼认亲的旗」；气质要体面有归属感、圈内认亲圈外好奇；场景是灯牌横幅、话题标签和超话搜索框里都读得快、拼得对。",
    en: "A fan club and fandom community. The name should be a banner fellow fans recognize in a glance; the vibe is dignified with belonging built in, kin to insiders and intriguing to outsiders; it must read in a three-second lightstick wave, tag cleanly, and spell right in the trending search box.",
  },
  "giveaway": {
    zh: "一个抽奖活动与营销工具平台，寓意「像公证处一样可信的开奖台」；气质要喜气克制、工具感与公信力并存；场景是商家落地页、开奖倒数口播和活动海报上都体面好念不带赌气。",
    en: "A giveaway and campaign tool platform. The name should promise a drawing stage as trustworthy as a notary's office; the vibe is festive yet restrained, utility and credibility in one; it must hang on a merchant's landing page with dignity, read fast in the countdown, and carry no whiff of the wager.",
  },
  "volleyball": {
    zh: "一家排球俱乐部与排球培训机构，寓意「网上三米一锤定音的滞空」；气质要热血利落、离地有劲；场景是球馆点名、联赛秩序册和家长群晒暑期招生里都喊得响、立得住。",
    en: "A volleyball club and training academy. The name should carry the hang-time of the kill a metre above the net; the vibe is fired-up and clean, with lift built in; it must shout well at gym roll call, hold its own in the league handbook, and read proudly in the summer-camp flyer.",
  },
  "tabletennis": {
    zh: "一家乒乓球俱乐部与培训馆，寓意「一板弧圈拉出的旋转」；气质要专业亲切、国球的底气配得上日常的烟火；场景是考级证书、约球群和球馆门头上都念得顺、认得出。",
    en: "A table tennis club and training hall. The name should carry the spin of a well-drawn loop; the vibe is expert yet warm, the national game's confidence at everyday scale; it must read smoothly on the grading certificate, in the match-up chat, and over the hall's front door.",
  },
  "baseball": {
    zh: "一家棒球培训与青训基地，寓意「九局下半仍相信下一棒」；气质要美式热血配聪明人的沉稳、孩子想挥棒家长觉得值；场景是球衣背后、开球仪式和家长群转发招生海报里都体面好念。",
    en: "A baseball training academy. The name should carry the bottom-of-the-ninth faith in the next at-bat; the vibe is American-heat with a thinking player's calm, thrilling the kid and convincing the parent; it must print proudly on the jersey, ring at the first pitch, and read well in the enrolment flyer.",
  },
  "boxing": {
    zh: "一家拳击馆与搏击健身房，寓意「铃响之后只剩呼吸与脚步」；气质要有力量感不带戾气、小白敢推门行家肯点头；场景是拳台围绳、团课约课页和会员打卡照里都立得住、喊得响。",
    en: "A boxing gym and fitness boxing studio. The name should promise the ring after the bell, all breath and footwork; the vibe is powerful without menace, easy for beginners to walk into and credible to insiders; it must hold up on the ring apron, the class-booking page, and the member's gym-selfie caption.",
  },
  "taekwondo": {
    zh: "一家少儿跆拳道馆，寓意「向教练鞠躬时学会的第一课」；气质要有「道」的分量配「拳」的热血、孩子念得响家长读得懂；场景是道服刺绣、考级证书和幼儿园门口的招生易拉宝上都体面立得住。",
    en: "A kids' taekwondo dojang. The name should carry the first lesson learned in the bow to the instructor; the vibe weighs the way before the fist, easy for a child to shout and a parent to trust; it must embroider well on the dobok, sit with dignity on the grading certificate, and hold up on the enrolment banner.",
  },
  "fencing": {
    zh: "一家击剑俱乐部与青少年击剑培训，寓意「白衣敬礼之后的一剑封喉」；气质要优雅有锋、贵而不势利；场景是剑道旁点名、赛事秩序册和家长群晒等级证书里都念得顺、立得住。",
    en: "A fencing club and youth academy. The name should promise the one clean touch after the salute in whites; the vibe is elegant with an edge, refined without snobbery; it must call well at the piste, hold its own in the tournament programme, and read proudly beside the level certificate.",
  },
  "gymnastics": {
    zh: "一家体操培训与少儿体操馆，寓意「腾空翻转之后稳稳落地」；气质要稳中带飞、孩子觉得酷家长觉得靠谱；场景是馆内点名、考级证书和幼儿园门口的招生易拉宝上都念得顺、立得住。",
    en: "A gymnastics academy and kids' gym. The name should carry the flight of the tumble and the landing stuck without a wobble; the vibe is controlled flight, cool to the kid and credible to the parent; it must call well at roll call, sit with dignity on the level certificate, and hold up on the enrolment banner.",
  },
  "cheerleading": {
    zh: "一家啦啦操俱乐部与啦啦队培训机构，寓意「把能量喊给全场的那一声」；气质要热血闪耀、凶得漂亮不失集体的暖；场景是赛场边齐喊、队服背后和招新海报上都响亮好念、立得住。",
    en: "A cheerleading gym and all-star program. The name should carry the shout that hands the whole arena its energy; the vibe is fierce and radiant with the warmth of belonging; it must chant well at the sideline, print proudly on the uniform, and pop on the tryout poster.",
  },
  "squash": {
    zh: "一家壁球馆与壁球俱乐部，寓意「四面墙之内的极速拉锯」；气质要利落聪明、精英感与开放感平衡得体；场景是订场小程序、会籍卡和写字楼午间约球群里都好念好搜、立得住。",
    en: "A squash club and training venue. The name should carry the high-speed rally inside four walls; the vibe is sharp and smart, balancing prestige with an open door; it must search well in the booking app, sit cleanly on the membership card, and read fast in the lunchtime match-up chat.",
  },
  "lacrosse": {
    zh: "一家长曲棍球俱乐部与青训机构，寓意「网兜甩出的那道弧线」；气质要传统与新潮并存、圈内认亲圈外好懂；场景是青训选拔、联赛秩序册和家长群转发招生海报里都体面好念、立得住。",
    en: "A lacrosse club and youth program. The name should carry the arc the ball draws out of the pocket; the vibe holds heritage and momentum at once, kin to insiders and clear to newcomers; it must read proudly at tryouts, hold its own in the league handbook, and travel well in the parents' group chat.",
  },
  "judo": {
    zh: "一家柔道馆与少儿柔道培训，寓意「先学鞠躬再学摔法的以柔克刚」；气质要有「道」的分量配巧劲的智慧、孩子念得响家长读得懂；场景是道服刺绣、段位证书和道馆门头上都体面立得住。",
    en: "A judo dojo and kids' program. The name should carry the gentle way that teaches the bow before the throw; the vibe weighs the way with the wisdom of yielding, easy for a child to say and a parent to trust; it must embroider well on the gi, sit with dignity on the rank certificate, and hold up over the dojo door.",
  },
  "bjj": {
    zh: "一家巴西柔术馆与柔术学院，寓意「地面上的下棋、以巧胜力」；气质要谱系可信、狠而有门、白领敢来小白敢试；场景是道服臂章、赛队报名表和会员打卡照里都立得住、认得出。",
    en: "A Brazilian jiu-jitsu academy. The name should promise chess played on the floor, technique beating strength; the vibe is lineage-credible with an open door, fierce enough for the comp team and welcoming to the first-timer; it must patch well on the gi sleeve, hold up on the tournament roster, and read proudly in the member's mat-selfie caption.",
  },
  "wrestling": {
    zh: "一家摔跤馆与青少年摔跤俱乐部，寓意「垫子上一千次起身的贴地硬磨」；气质要硬而不凶、纪律感让家长放心；场景是垫上点名、赛事对阵表和体育单招简历里都念得顺、立得住。",
    en: "A wrestling club and youth program. The name should carry the grind of a thousand shots and stand-ups on the mat; the vibe is hard without menace, disciplined enough to reassure the parent; it must call well at mat-side, hold up on the tournament bracket, and read proudly on the recruiting résumé.",
  },
  "muaythai": {
    zh: "一家泰拳馆与泰拳培训，寓意「八肢的艺术、拜师舞之后的肘膝锋芒」；气质要狠得正宗又不吓走减脂小白；场景是拳靶课点名、赛队围巾和会员打卡照里都响亮好念、立得住。",
    en: "A Muay Thai gym and training camp. The name should carry the art of eight limbs, the elbow's edge after the wai kru's bow; the vibe is authentically fierce yet welcoming to the fat-burn first-timer; it must call well at pad class, print proudly on the fight-team banner, and read well in the member's check-in photo.",
  },
  "handball": {
    zh: "一家手球俱乐部与校园手球队，寓意「七人快攻里那记腾空跳射」；气质要快而齐、有城市荣誉感；场景是场边齐喊、联赛秩序册和校队招新海报上都响亮好念、立得住。",
    en: "A handball club and school program. The name should carry the jump shot rising out of a seven-player fast break; the vibe is fast and united with civic pride; it must chant well at courtside, hold its own in the league programme, and pop on the school recruitment poster.",
  },
  "curling": {
    zh: "一家冰壶俱乐部与冰壶体验馆，寓意「冰上棋局里那记压哨好壶」；气质要聪明有礼、好玩不高冷；场景是团建预订页、会员徽章和赛后互敬的致辞里都体面好念、立得住。",
    en: "A curling club and experience rink. The name should carry the perfect draw settling into the house like a chess move; the vibe is clever and courteous, fun without frost; it must book well on the corporate-social page, sit cleanly on the member's pin, and read graciously in the post-game toast.",
  },
  "rowing": {
    zh: "一家赛艇俱乐部与青少年赛艇营，寓意「晨光水面上八桨同频的那道破浪」；气质要体面向上、精英而不排外；场景是艇库点名、赛艇服胸前和升学文书里都念得顺、立得住。",
    en: "A rowing club and junior crew. The name should carry the wake cut by eight blades in perfect time on first-light water; the vibe is aspirational and dignified, elite without exclusion; it must call well at the boathouse, sit proudly on the racing kit, and read well in the college application essay.",
  },
  "skating": {
    zh: "一家轮滑俱乐部与少儿滑冰培训，寓意「像风一样滑出去、稳稳收住」；气质要飞得酷落得稳、孩子觉得帅家长觉得安全；场景是场边点名、考级证书和商场冰场的招生展架上都念得顺、立得住。",
    en: "A skating club and kids' programme. The name should carry the glide that flies like wind and lands in control; the vibe is cool in flight and safe on landing, thrilling to the kid and reassuring to the parent; it must call well rink-side, sit with dignity on the grading certificate, and hold up on the mall-rink enrolment stand.",
  },
  "candle": {
    zh: "一个香薰蜡烛与香氛品牌，寓意「点燃之后那一小时被照亮的情绪」；气质要体面有留白、送礼拿得出手；场景是礼盒烫金、杯身标签和小红书开箱笔记里都好看好念、立得住。",
    en: "A scented candle and home fragrance brand. The name should carry the hour of lit-up mood that follows the match; the vibe is dignified with room to breathe, worthy of a gift box; it must foil-stamp well on the lid, fit the vessel's slim label, and read beautifully in the unboxing post.",
  },
  "juicebar": {
    zh: "一家鲜榨果汁与轻食吧，寓意「一口下去的新鲜与被按下的活力开关」；气质要干净明亮、健康不说教；场景是外卖首图、杯贴和写字楼午休排队闲聊里都响亮好念、立得住。",
    en: "A fresh-pressed juice and light-bites bar. The name should carry the first-sip freshness and the energy switch it flips; the vibe is clean and bright, healthy without preaching; it must pop on the delivery-app thumbnail, sit neatly on the cup sleeve, and say easily in the office lunch-line chat.",
  },
  "leathercraft": {
    zh: "一家手工皮具工作室与皮革定制品牌，寓意「一双手在植鞣革上花掉的八个小时」；气质要匠气可信、慢而不旧；场景是烫印皮标、定制订单页和体验课招募帖里都体面好念、立得住。",
    en: "A leathercraft workshop and bespoke leather brand. The name should carry the eight hours a pair of hands spends on veg-tanned hide; the vibe is maker-credible, slow without being dusty; it must hot-stamp well on the leather patch, hold up on the commission page, and read warmly in the craft-class post.",
  },
  "calligraphy": {
    zh: "一家书法工作室与书法培训，寓意「笔锋落纸时那一刻的静与定」；气质要有文气不掉书袋、家长读出坐得住孩子；场景是斋号牌匾、考级证书和作品落款里都体面好念、立得住。",
    en: "A calligraphy studio and training programme. The name should carry the stillness of the instant the brush meets paper; the vibe is scholarly without pedantry, telling a parent this is where focus is learned; it must sit well on the studio plaque, hold dignity on the grading certificate, and sign gracefully at the corner of the work.",
  },
  "instrumentstore": {
    zh: "一家乐器行，寓意「推门进来就听见的那一声好音色」；气质要懂行不高冷、家长信得过老乐手聊得来；场景是门头招牌、老师推荐口碑和直播间评测标题里都响亮好念、立得住。",
    en: "A music instrument store. The name should carry the good tone you hear the moment the door opens; the vibe is gear-savvy without snobbery, trusted by the parent and talkable for the veteran; it must read well on the shopfront, travel in the teacher's recommendation, and pop in the live-stream review title.",
  },
  "meditation": {
    zh: "一家冥想馆与正念工作室，寓意「城市里留给呼吸的那一隅安静」；气质要安静有科学感、不玄学不烧香；场景是午休课预约页、企业团建方案和睡前音频片头里都念得顺、立得住。",
    en: "A meditation and mindfulness studio. The name should carry the quiet corner a city leaves for breathing; the vibe is calm and evidence-minded, no mysticism, no incense; it must book well on the lunch-break class page, sit credibly in the corporate-wellness deck, and open the sleep audio gently.",
  },
  "woodworking": {
    zh: "一家木工工作室与原木家具定制，寓意「一双手在木头上花掉的那三十天」；气质要匠气可信、慢而不旧；场景是作品底部的激光刻印、定制合同和木作体验课招募帖里都体面好念、立得住。",
    en: "A woodworking studio and custom furniture maker. The name should carry the thirty days a pair of hands spends inside the wood; the vibe is maker-credible, slow without being dusty; it must laser-brand well on the underside of the piece, hold up on the commission contract, and read warmly in the craft-class post.",
  },
  "soapmaking": {
    zh: "一个手工冷制皂品牌，寓意「一块皂里晾了四十五天的植物油香」；气质要天然干净、体面不土气；场景是市集摊位招牌、礼盒烫金和小红书开箱笔记里都好看好念、立得住。",
    en: "A handmade cold-process soap brand. The name should carry the plant-oil scent cured into the bar over forty-five days; the vibe is natural and clean, dignified without being rustic; it must read well on the market-stall banner, foil-stamp nicely on the gift box, and look lovely in the unboxing post.",
  },
  "modelkit": {
    zh: "一家模型手办店，寓意「放学后想去坐坐的玩家据点」；气质要懂行有暗号感、圈内人一眼认亲；场景是门头招牌、微信群名片和直播间标题里都好打好念、立得住。",
    en: "A model kit and figure store. The name should carry the clubhouse where the builders drop in after work; the vibe is gear-savvy with an insider handshake, instantly recognised by the tribe; it must read well on the shopfront, type easily in the chat group, and pop in the stream title.",
  },
  "framing": {
    zh: "一家装裱画框店，寓意「让画成为主角、让框恰到好处地消失」；气质要克制体面、懂分寸；场景是美术馆边的门头、画廊老板的口碑转述和装裱标签上都顺口、立得住。",
    en: "A custom framing shop. The name should carry the craft of letting the art be the star while the frame disappears just enough; the vibe is restrained and dignified, sure of its place; it must sit well on the shopfront by the museum, travel smoothly in the gallery owner's referral, and sign the backing label with quiet authority.",
  },
  "recordingstudio": {
    zh: "一家录音棚与录音工作室，寓意「按下录音键那一刻整个房间的安静」；气质要专业有音色、念出来自带混响；场景是专辑内页 credits、厂牌报价单和音乐人朋友圈转发里都短而有分量、立得住。",
    en: "A recording studio. The name should carry the hush that falls over the room when the red light goes on; the vibe is professional with a timbre of its own, a little reverb when spoken aloud; it must print short and weighty in the album credits, sit steady on the label's quote, and travel proudly in the artist's repost.",
  },
  "hearingaid": {
    zh: "一家助听器验配中心与听力中心，寓意「把孙辈的笑声重新带回饭桌」；气质要专业温和、不说「聋」不丢面子；场景是社区门头、医院转介绍和家庭群转发链接里都可信亲切、立得住。",
    en: "A hearing aid fitting and audiology center. The name should carry the grandchild's laugh brought back to the dinner table; the vibe is clinically credentialed yet gentle, never saying deaf, never costing dignity; it must read trustworthy on the neighbourhood shopfront, pass well in the hospital referral, and share credibly in the family group chat.",
  },
  "watchrepair": {
    zh: "一家钟表维修与名表保养工作室，寓意「把一块传了两代人的表重新调准」；气质要专业沉稳、值得托付；场景是商场柜台招牌、保修卡和家庭群「哪里修表靠谱」的转发里都可信、立得住。",
    en: "A watch repair and luxury servicing atelier. The name should carry the heirloom watch set right again after two generations; the vibe is credentialed and unhurried, worthy of the trust; it must read reliable on the mall counter, sign the warranty card with authority, and pass credibly in the family group chat asking who can fix a watch.",
  },
  "beekeeping": {
    zh: "一个蜂场直供的蜂蜜品牌，寓意「等一季花开酿成的一罐甜」；气质要天然可溯源、体面不土气；场景是电商详情页、礼盒烫金和妈妈群转发里都可信好念、立得住。",
    en: "A farm-direct honey brand. The name should carry the jar of sweetness cured from one season's bloom; the vibe is natural and traceable, dignified without being rustic; it must read trustworthy on the product page, foil-stamp nicely on the gift box, and share credibly in the parenting group chat.",
  },
  "glassblowing": {
    zh: "一家玻璃工作室与吹玻璃体验坊，寓意「从一千多度的火里拉出透明的光」；气质要有手作温度、又有艺术分量；场景是工作室门头、体验课海报和刻在作品底部的署名里都好认、立得住。",
    en: "A glassblowing studio and taster workshop. The name should carry transparent light pulled out of a two-thousand-degree fire; the vibe is warm with craft yet weighty with art; it must read well on the studio door, pop on the class poster, and engrave cleanly on the foot of every piece.",
  },
  "bonsai": {
    zh: "一家盆景园与盆栽工作室，寓意「把一座山养进一只掌心大的盆里」；气质要有文人气、经得起时间；场景是展会铭牌、老藏家的茶桌口碑和年轻人的小红书笔记里都立得住。",
    en: "A bonsai garden and studio. The name should carry a mountain raised inside a palm-sized pot; the vibe is literati and patient, seasoned by time; it must hold up on the exhibition placard, in the old collector's tea-table word of mouth, and in the younger customer's lifestyle post.",
  },
  "recordstore": {
    zh: "一家黑胶唱片店，寓意「翻箱淘碟的下午和跟老板聊半小时的据点」；气质要懂行有暗号感、不装；场景是门头招牌、到店打卡照和直播间标题里都好认好念、立得住。",
    en: "A vinyl record store. The name should carry the crate-digging afternoon and the half-hour chat at the counter; the vibe is scene-savvy with an insider handshake, never posturing; it must read well on the shopfront, look right in the check-in photo, and pop in the livestream title.",
  },
  "embroidery": {
    zh: "一家刺绣工作室与手工刺绣定制坊，寓意「针尖上一寸一寸绣出来的时间」；气质要精工文气、接得住高定；场景是作品落款、高定合作邮件和美术馆展签上都体面、立得住。",
    en: "An embroidery studio and hand-stitching atelier. The name should carry the hours stitched inch by inch at the needle's tip; the vibe is fine-worked and literate, equal to couture; it must sign the finished piece with grace, read formal in the commissioning email, and hold its own on the museum wall label.",
  },
  "sealcarving": {
    zh: "一家篆刻工作室与印章定制坊，寓意「方寸石面上一刀一刀刻出的名字」；气质要金石文气、郑重可托付；场景是书画落款、藏家询价邮件和展览图录里都立得住。",
    en: "A seal carving studio and custom chop atelier. The name should carry a name carved stroke by stroke into a square inch of stone; the vibe is literati with the weight of metal and stone, grave enough to be trusted; it must hold up in the painting colophon, the collector's enquiry email, and the exhibition catalogue.",
  },
  "incense": {
    zh: "一家香道工作室与手工线香品牌，寓意「一炉香点起来满室的安静」；气质要有东方文气、不堆禅字；场景是电商详情页、品香会海报和礼盒烫金上都好念、立得住。",
    en: "An incense studio and artisan incense brand. The name should carry the hush that fills the room when one stick is lit; the vibe is quietly Eastern without piling on zen words; it must read easily on the product page, carry an air on the tasting-session poster, and foil-stamp nicely on the gift box.",
  },
  "papercut": {
    zh: "一家剪纸工作室与剪纸文创品牌，寓意「一把剪刀在红纸上剪出的年味与纹样」；气质要民俗有根、又接得住当代联名；场景是文创吊牌、美术馆展签和节庆礼盒上都好认、立得住。",
    en: "A papercut studio and paper-cutting craft brand. The name should carry the festive patterns one pair of scissors cuts from red paper; the vibe is rooted in folklore yet ready for contemporary collabs; it must read well on the co-branded hang tag, the museum wall label, and the festival gift box.",
  },
  "lantern": {
    zh: "一家灯笼工坊与花灯定制工作室，寓意「亮灯那一刻整条街的抬头」；气质要有光影画面、民俗与美陈都接得住；场景是灯会投标书、门头夜景照片和文旅项目合同里都立得住。",
    en: "A lantern workshop and festival lantern studio. The name should carry the whole street looking up the moment the lanterns come on; the vibe is pictured in light and shadow, at home in both folk festivals and mall installations; it must hold up in the festival tender, the night shopfront photo, and the tourism project contract.",
  },
  "quilting": {
    zh: "一家拼布工作室与手工被服坊，寓意「把碎布头一格一格缝成一床有记忆的被子」；气质要温暖有手感、不显家政气；场景是材料包详情页、拼布课海报和定制纪念被的故事里都亲切、立得住。",
    en: "A quilting studio and patchwork atelier. The name should carry scraps sewn square by square into a blanket full of memory; the vibe is warm and hand-felt, never mending-shop plain; it must read friendly on the kit product page, the class poster, and the story of a commissioned memory quilt.",
  },
  "teaware": {
    zh: "一家茶器工作室与手作茶具坊，寓意「一只素杯在茶席上被摩挲出的温润」；气质要文气拙朴、经得起落款；场景是电商详情页、茶席口碑和拍卖图录里都有分量、立得住。",
    en: "A teaware studio and artisan tea ceramics atelier. The name should carry the mellow warmth a plain cup earns from years of hands at the tea table; the vibe is literati and unpolished, worthy of the base mark; it must carry weight on the product page, in tea-table word of mouth, and in the auction catalogue.",
  },
  "kite": {
    zh: "一家风筝工坊与手作风筝品牌，寓意「一根线牵着天空的轻盈」；气质要有民俗根底、又接得住亲子与文创；场景是电商详情页、体验课海报和风筝节投标书里都好念、立得住。",
    en: "A kite workshop and artisan kite brand. The name should carry the lightness of one string holding the sky; the vibe is rooted in folk craft yet ready for family classes and gift lines; it must read well on the product page, the class poster, and the kite festival tender.",
  },
  "succulent": {
    zh: "一家多肉植物店与多肉大棚，寓意「桌上一只小胖子的治愈」；气质要呆萌温暖、又接得住贵货直播间；场景是拼单群、电商详情页和组盆课海报里都好念、亲切。",
    en: "A succulent shop and greenhouse nursery. The name should carry the comfort of a little chubby plant on the desk; the vibe is cute and warm yet dignified enough for the rare-plant livestream; it must read easily in the group-buy chat, on the product page, and on the potting class poster.",
  },
  "chocolate": {
    zh: "一家手工巧克力与 bean to bar 品牌，寓意「掰开一块巧克力时的那声脆响」；气质要浪漫有格调、经得起礼盒烫金；场景是情人节礼盒、风味卡和电商详情页里都体面、立得住。",
    en: "A craft chocolate and bean-to-bar brand. The name should carry the snap of a bar breaking clean; the vibe is romantic with real polish, worthy of gold foil; it must look dignified on the Valentine gift box, the origin card, and the product page.",
  },
  "weaving": {
    zh: "一家织造工作室与手工织布品牌，寓意「一梭一梭把时间织成物」；气质要有质感文气、经得起展签；场景是电商详情页、画廊展签和面料报价单里都立得住。",
    en: "A weaving studio and handwoven textile brand. The name should carry time woven into cloth shuttle by shuttle; the vibe is textured and literate, worthy of the gallery label; it must stand on the product page, the exhibition label, and the fabric quotation.",
  },
  "puppet": {
    zh: "一家木偶皮影工作室与偶戏剧团，寓意「一双手让死物开口讲千年的故事」；气质要有戏味民俗根底、又接得住亲子剧场；场景是演出海报、研学手册和文创吊牌上都好认、立得住。",
    en: "A puppetry and shadow-play studio. The name should carry hands that make dead things speak stories a thousand years old; the vibe is rooted in stage folklore yet ready for family theatre; it must read well on the show poster, the study-trip booklet, and the craft hang tag.",
  },
  "birding": {
    zh: "一家观鸟俱乐部与自然导赏品牌，寓意「举起望远镜那一刻的心跳」；气质要轻盈有野趣、不显器材党沉重；场景是行程海报、学校合作方案和鸟友群里都专业、亲切。",
    en: "A birding club and nature-guiding brand. The name should carry the heartbeat of raising the binoculars; the vibe is light and wild without gear-head weight; it must read professional on the trip poster, credible in the school proposal, and warm in the birders' chat.",
  },
};
