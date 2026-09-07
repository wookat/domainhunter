# R545 生产 UX 观察（执行结束，含未验证项及操作偏差）

日期 2026-09-06 UTC。生产 https://hunt.zalize.com；现有单标签；不调用 AI、不付款、不改仓库、不恢复 storage。截图目录 `shots/`；原文辅助存档 `texts.txt`；性能原始值 `probes.jsonl`；API时间 `net.log`。以下时间是浏览器证据，不把工具调用间隔伪装成用户操作速度。导航 probe 在 SPA 跳转时仍为原始 document 的 timing，不能当作路由自身加载时长；LCP 探针全为 null 时即未验证。截图和录像才作为可见状态证据，DOM文字仅辅助逐字引用。

## A — desktop zh

|步骤|期望|实际|耗时/证据|困惑点|信任点|
|---|---|---|---|---|---|
|1 首页|10秒看懂定位并找到非AI入口|首屏直接看到「精确核验」，0屏滚动。hero「用中文说出寓意，猎到真正可注册的.cn / .com 好域名」；说明「一句中文说寓意，AI 沿拼音、英文、拼音英文混搭多路构思，逐个实时核验 .cn / .com.cn / .com 的注册状态——只给你能立刻注册的，附到期日与人民币参考价。」|01；A-desktop-home TTFB69/DCL172/load194/FCP196ms|用户称首页底部输入框，实际是首屏tab共用输入；10秒认知为观察者判断非独立计时|「输入现成名字可即时核验、不消耗 AI 次数；描述寓意则交给 AI 帮你猎名。」|
|2 chaxiang|非AI结果与首可注册|点「精确核验」后按钮为「立即核验」。9结果6可注册；com/cn/net已注册；io/ai/app/dev/co/me可注册|02；net 13:33:20.727 与21.311各1个/api/search；截图约13:33:26，首可注册可见上界约6秒（含截图延迟），非精确渲染时间|回车前已自动核验，2次请求；价格没单位/注册商并列|明确完成计数、颜色、到期日|
|3 更多后缀|展开相关后缀|「查更多后缀 +400」展开400项，先已完成、后「检测中」；页面极长|03；text A-desktop-more|400项非渐进分页，远多于只找cn/com需要|可边查边看|
|4 收藏cn/com|两行可保存|两星后计数0→2；后续额外保存mingqiancha.cn，计数3|03、06；probe shortlist存储3项|星按钮小，灰色已注册行的星不醒目|顶部计数即时|
|5 长拼音|有长度/寓意建议|mingqiancha（11字符）9个中7可注册；yeyecha 9中7可注册；无长度或语义提示，只有11/500、7/500|04、05；原文在texts|精确核验只回答可注册，不回答好不好；这不是AI质量结论|mingqiancha.cn 可注册≈$5，为国内方向提供出路|
|6 已注册及注册商|详情和去购买透明|点击mingqiancha.com已注册chip无详情/菜单变化；到期在chip内。首页可注册chip是直达外链而非菜单，改在清单mingqiancha.cn「去注册」打开菜单：阿里云→腾讯云→Dynadot「中文 · 支付宝」；无菜单报价|04、07|已注册行在shortlist仍有「去注册」，并被计入「批量去注册（3）」；可能让人以为可按普通价买到|明确外链图标、域名对应title（title仅DOM辅助，未截图悬浮）|
|7 shortlist|保存、备注、排序入口|chaxiang.com/.cn与mingqiancha.cn均在；「加备注」、排序「添加时间」「域名」「首年价」「到期日」可见，本组未编辑备注/排序，C执行|06、07；A-desktop-shortlist为SPA沿用首页timing|可注册行无绿色状态badge而taken有badge；综合/长度/读感/寓意/品牌感全部—|「本地保存（localStorage，跨会话保留）· 注册前建议重新核验可用性」|
|8 tld/cn、guide|中文命名帮助|.cn页标题「.cn 域名注册指南：适合谁、多少钱、怎么起名」。guide搜「茶」得6/410，进「茶叶品牌怎么起名：命名思路、好名字拆解与域名选择」|08–11；A-desktop-tld-cn FCP236ms；guide388ms；guide-tea188ms|内容入口不在顶栏，需要知道URL或走很长页底；茶叶指南推荐com/shop/vip没cn（DOM，推荐区未滚到，未验证可见性）|「双拼是王道：好读的双拼 + .cn 是国内最熟悉的品牌形态」；「价格带自检：把名字分别放进礼盒柜台与便利店冰柜想一遍——名字声明的价格带要与主渠道一致」|

a) 入口：精确核验首屏可见，完整注册商菜单要去清单；歧义：「去注册」也出现在已注册行；状态：实时价无并列来源，长列表检测中多；误触：未发生AI误触。  
b) 价格/到期原文：chaxiang.io「$28.12」、.ai「$82.7」、.app/.dev「$8.75」、.co「$15.76」、.me「$2.73↑」；chaxiang.com「2027-05-13 到期」、.cn「2026-12-11 到期」、.net「2027-09-04 到期」；mingqiancha.com「2027-06-25 到期」、yeyecha.com「2030-09-15 到期」、yeyecha.cn「2027-03-05 到期」。已注册chip没有价格/注册商；shortlist却显示普通首年参考价。/tld/cn可见「静态参考价：首年 ¥33 · 续费 ¥38/年 · 非实时报价」，无具名注册商或更新时间。外链落地本组未验证。  
c) 亮点：双拼实名/备案建议贴合中文创业者；茶叶指南具体讲山场、器物、价格带，不只是泛泛品牌口号。

## A — 375 zh

仿真限制：首次probe touch=5，computer交互后变0，innerWidth仍375、iPhone UA保留；这不是应用bug，触屏真实性需与布局结论分开。lead修复keeper持续重放，13:38:16 probe确认touch=5。keeper在13:36:43Z–13:37:44Z重启有约1分钟net空窗；此段更多后缀请求可能未完整记录，不能仅靠grep证明空窗零AI；所做动作仅更多后缀/滚动/尝试改输入，没有点击AI入口。

|步骤|期望|实际|耗时/证据|困惑点|信任点|
|---|---|---|---|---|---|
|1 首页|精确输入可发现|hero同桌面（手机换行），精确tab首屏下部，输入框部分露出；0屏可发现，约0.5屏滚动后完整操作|12；A-375-home FCP116ms、width375|顶部导航只剩图标；原生computer首次点击/键入未生效，不能归因应用|「精确核验」文字仍保留|
|2 chaxiang|首个可注册与完整chip|6/9可注册，状态/价格同桌面；13:36:07.27记录输入前，复制粘贴才真正填入；13:36:29截图有可注册，上界约22秒含交互/滚动，不是后端耗时|13；net可查该次search，精确首渲染秒数未验证|9个chip单列超过一屏；首结果区要再滚动|已注册到期日仍有|
|3 更多|不截断|点击「查更多后缀 +400」，更多结果单列；chaxiang.com.cn、带监控按钮的chaxiang.cc域名截断，已注册文案有换行|14；A-375-home-more scrollWidth360<=375|复现：首页精确chaxiang→查更多→滚到com.cn/cc，完整名字看不到|没有整页横向溢出|
|4 两星|触控保存反馈|点击cn/com星，计数仍3，存储仍桌面3项；没有可证明的手机新增/撤销转变，标未验证|13、17；A-375-shortlist|既有收藏、触控重置导致本项不能声称通过|桌面三项跨导航保留|
|5 长拼音|长度/寓意提示|精确定位UI填mingqiancha、yeyecha，分别7/9可注册；无拼音长度/意义提示，状态/价格/到期同桌面|15、16；填入UTC1788701892.33、1788701899.85|需看到输入焦点才可粘贴，错误工具焦点曾全选页面，未触发AI|即时核验不需按钮|
|6 注册菜单|可用且不遮挡|shortlist mingqiancha.cn菜单显示阿里云/腾讯云/Dynadot「中文 · 支付宝」，无价格；完整框在屏内|18；touch tap已生效|菜单遮住部分卡片但不超屏，商家价格需离站找；本组未点外链|注册商名明确|
|7 shortlist|找到清单、操作可达|点顶部书签图标成功进入；卡片化，无表格横滚；备注/排序存在，本组未编辑|17、18；scrollWidth360|没有「候选清单」顶栏文字，需猜书签含义；已注册卡片仍绿色「去注册」和普通价|日期另起行可读|
|8 内容|可读中文建议|/tld/cn及/guide搜茶→/guide/tea均打开；手机茶叶首段较长|19–21；FCP120/216/220ms，均scrollWidth360|首段几乎占满屏，命名思路在下方；内容导航需知道入口|.cn「静态参考价：首年 ¥33 · 续费 ¥38/年 · 非实时报价」完整换行|

a) 入口：清单变图标；歧义：已注册「去注册」；状态：小灰星/截断域名；误触：工具焦点未落输入，全选了页面，改用明确UI locator，未点击AI。  
b) 价格/到期原文同桌面已核验三组；手机首页无注册商并列、.cn指南有「非实时报价」，商家菜单没有更新时间/报价。外链落地未验证。  
c) 亮点：清单响应式卡片、菜单不越界，guide搜索「茶」可直接定位6个相关内容。触控目标：截图中星图标很小但chip/星按钮块有高度，未做命中区域测量，不能仅以图标大小判定<44px。

## B — desktop en

|步骤|期望|实际|耗时/证据|困惑点|信任点|
|---|---|---|---|---|---|
|1 首页|英文定位、语言控件易找|hero「Name it in Chinese or English, hunt .cn / .com domains you can actually register」；右上「中」切中文，精确tab「Exact check」首屏可见|22；B-desktop-home，原始ms见probes|英文SaaS用户仍以.cn/.com与Chinese founders为主，.io/.ai不是主诉求|「Exact names are checked instantly with no AI quota; describe an idea and AI hunts for you.」|
|2 stackpilot|com/io/ai状态价格|三项都是Taken；com expires 2028-10-05，io 2029-02-02，ai 2027-07-31；仅cn Available ≈$5；已注册chip不显示价格，9项无需展开找到io/ai；保存io和ai，计数3→5|23；net 13:39:53.624/54.210；首Available截图上界约5秒含工具延迟|被占用域名不能验证“可注册io/ai购买”路径；价格不并列注册商|到期日在chip内|
|3 prices|首年续费、来源、过滤|.com $11.08/$11.08；.io $28.12/$51.8；.ai $82.7/$82.7；来源Porkbun，筛选com→4条，io→14条，ai→7条，非精确过滤；表头可点击排序|24–27；B-desktop-prices；文字原文见下|筛选io还匹配auction，想比较3项需反复过滤；该页未见更新时刻|把首年/续费并列，renews↑警示促销续费跳涨|
|4 vs/io/ai|决策信息一致|/vs过滤io→进「.io vs .ai: Developer Badge vs AI Narrative」，第一段静态¥259/419与¥499/620，与同页实时表¥202/373和¥595/595冲突。/tld/io及ai与实时表一致|28–33；B-desktop-vs、tld-io/tld-ai；截图30冲突|同页不同数字：不知预算应信哪个；长首段信息密度高|内容区分技术身份与AI叙事、风险、续费与两年起购|
|5 注册商及落地|域名预填、可比价|在taken stackpilot.io清单行仍可开Register菜单：Porkbun $28.12→Namecheap→Dynadot「CNY · Alipay」→Cloudflare→阿里云→腾讯云；Porkbun新标签预填stackpilot.io，结果「Aftermarket」「$4,500」「+ transfer fee」；未加购物车，截图后关外链标签|35、36；/api/click 13:42:20.750|把taken域名配普通首年价+Register容易误导为该域名售价；不是实时价API错误，而是价格语义与可购买动作不匹配|外链传递正确域名，菜单明确只有Porkbun报价|
|6 shortlist英文控件|排序/导出/分享可辨认|Added/Domain/1st-yr price/Expiry；Share link；Export→Export CSV/Export TXT；五项保存。尚未排序或分享，留C。由/tld/ai右上Shortlist一次点击落首页，再点才入清单（录像观察，未独立复测，候选导航问题）|34、37；B-desktop-shortlist|尚未核验却有普通价，「Not checked yet」与保存的Taken混合；内容页清单导航需二次点击|「Saved locally in your browser · re-check availability before registering」|

a) 入口：英文Exact check清楚；内容页Shortlist疑似先回首页；歧义：Taken仍Register all (5)；状态：stackpilot.app曾保持Checking；误触：无AI，外链未购买。  
b) 原文：prices说明「Live prices from Porkbun; CNY estimated at 7.2. ≈ marks static reference prices. Registrar prices vary — confirm on the registrar page.」；对比表来源「Live prices from Porkbun (fetched 2026-09-06 06:00 UTC); CNY estimated at 7.2. ≈ marks static reference prices, not live quotes. Registrar prices vary — confirm on the registrar page.」。io指南「Register $28.12≈ ¥202」「Renew $51.8≈ ¥373」「Live Porkbun pricing · CNY estimated at 7.2 per USD」；ai「Register $82.7≈ ¥595」「Renew $82.7≈ ¥595」。io「Renewals cost more than registration — budget for it」；ai「Watch the renewal cost — it stays high every year」。限制相关：对比页「most registrars require a two-year minimum on .ai, so the first bill is at least ¥1,000」；io/ai指南中未见独立注册限制小节，未全面展开所有FAQ，不能断言不存在。  
对比第一段前75词（逐字）：「Both are small-territory country codes that the tech world repurposed, and both now ride the Identity Digital platform: .io belongs to the British Indian Ocean Territory, delegated in 1997 to Internet Computer Bureau; .ai belongs to Anguilla and migrated wholesale to Identity Digital in January 2025 with more than 600,000 names. .ai sits one price tier higher: the site's reference table lists .io at ¥259 first year / ¥419 renewal」。整段存texts.txt，可供引用；不把文章事实当作本次已外部验证的事实。  
c) 亮点：价格来源具名，续费有预算警示，注册商真正预填域名；对比内容解释品牌定位不是只罗列价格。

## B — 375 en

|步骤|期望|实际|耗时/证据|困惑点|信任点|
|---|---|---|---|---|---|
|1 首页|375可读、非AI入口|hero同桌面，换5行；首屏刚露出tab，要约半屏才操作输入；右上「中」仍在|38；B-375-home FCP156ms，width375/touch5|标题+说明+三步卡占满首屏；清单只图标|Exact check仍是文字|
|2 exact stackpilot|三TLD状态、可注册秒数|com/io/ai同桌面Taken日期；cn Available ≈$5；stackpilot.app 13:43:12与13:43:24两次仍Checking；没有给出完整完成计数|39、40；填UTC1788702187.537；net 13:43:08.339；39截图13:43:12（首Available可见上界约5秒）|文件名40含complete仅是抓图时命名，不代表全部查询完成；三主要TLD可判定，app完成未验证|单列chip足够显示主要三项|
|3 prices|手机三价格行与筛选|com/io/ai价格同桌面；表格换行不整页溢出；过滤ai时目标在7条末尾，要向下滚动|41–45；B-375-prices FCP152ms，scrollWidth360|默认宽泛子串匹配，.ai不是首条；截图44首屏未含ai，45才含|首年与续费列保留，手机不显示CNY次级值而保留USD|
|4 vs、tld io/ai|内容表格不溢出|从prices的.io vs .ai链接进详情，再进两个指南；375未重做/vs列表过滤；文章首段长，价格表在下方；实时数字同桌面|46–49；三个probe scrollWidth360，FCP144/156/184ms|同页静态/实时矛盾仍在；长文需多屏|表格/价格卡可读|
|5 menu和外链|菜单不裁切，域名预填|在清单stackpilot.io打开菜单顺序/价格同桌面；菜单完全在375屏内。Porkbun再次预填stackpilot.io、Aftermarket $4,500；外链未继承375仿真，在桌面宽新标签打开，截后关闭|52、53|手机注册商落地响应式未验证（keeper仅约束hunt）；所要求可注册io/ai路径未验证（均Taken）|菜单位置自动向内，最底腾讯云仍可见|
|6 shortlist|英文控件可达|Share link、Export→Export CSV/TXT可见；排序Added/Domain/1st-yr price/Expiry换两行；io/ai沿用桌面收藏，本组未新增两项|50、51；B-375-shortlist FCP180ms、scrollWidth360、touch5|不重复星标避免撤销既有状态，但不能声称手机新增收藏已验证；顶部清单只图标|响应式卡片，按钮文本保留|

a) 入口：hero下输入要滚动，清单图标化；歧义：同桌面taken普通价；状态：app Checking至少约16秒后尚未完成；误触：未触发AI。  
b) 价格/到期原文与桌面一致；菜单Porkbun $28.12，外链Aftermarket $4,500；仅核验预填并观察差异，没有购买。375本次新文档probe有时touch0，稍后shortlist恢复5；因此布局375有效，真实移动设备/所有触控状态未验证。  
c) 亮点：375 prices保留首年续费比较，菜单不越界，清单卡片上到期日另行展示。

## C — desktop zh

|步骤|期望|实际|耗时/证据|困惑点|信任点|
|---|---|---|---|---|---|
|1 首页到批量|明显的非AI入口|顶栏「高级模式」，首页输入上方另有「批量核验」；进入页标题「高级模式」，上半是词根组合、下半「批量粘贴核验」|54、55；C-desktop-home与advanced probe FCP188ms（SPA同document）|首页叫批量核验，页面叫高级模式；真正粘贴区排在另一个组合工具下面|明确“不消耗 AI 次数”|
|2 五名×五TLD|25项完成有进度|TLD是文本输入而非多选chips，填com,cn,net,io,ai；五行lingxicha/yunqiji/shanhetea/mochamo/qingfengke；按钮「核验 25 个域名」，旁「已识别 25 个域名」；结果流式增长，18→20可注册，最终20可注册+5已注册。结果是无表头列表（分组「可注册（20）」「其余候选（5）」），不是传统表格|56–59；net唯一批量POST /api/search 13:47:30.393Z；57在32.170Z，58在38.306Z；完整25行CSV45.619Z，全部结果可见截图59在53.061Z|无明确25/25完成进度条；不能把“已识别25”误读为已完成；裸名单评分全为—|边查边展示、最终复制数20与CSV一致|
|3 导出CSV|真实下载与25项数据|原生点击「导出 CSV」下载domainhunter-bulk-20260906.csv到~/Downloads；CSV parser读到25数据行+表头，20 available/5 taken；wc -l=25是末行无换行，不是只有24数据项|59；文件mtime13:47:45.619Z；本节后附前5行|空评分列多，普通创业者未必理解；行顺序按返回顺序，不同运行不一致|真实域名/状态/首年价/到期字段可带走|
|4 收藏备注排序|3新增、备注保存、价格排序|星标lingxicha.ai/io/net，计数5→8；io备注「给合伙人看」；排序选项「添加时间」「域名」「首年价」「到期日」，显式点首年价后.cn ¥33在前|59–63；C-desktop-shortlist probe；表头原文「域名 综合 长度 读感 寓意 品牌感 参考价 监控」|备注失焦时第一次排序点击未看到重排，第二次明确点击成功；非AI数据五项评分全—|备注不挤占域名行，价格升序明确|
|4a 分享|链接、有效期、同标签快照|「分享链接（30 天有效）」；https://hunt.zalize.com/s/gSISSiQ0Df；8域名快照，4可注册，只有可注册行有「去注册」；备注未外发；同标签打开后返回|62、64；C-desktop-share FCP200ms|清单“批量去注册8”包含已注册，但分享页正确过滤4可注册；状态不保证实时|「由 DomainHunter 用户分享 · 快照生成于 2026年9月6日 · 状态以实时核验为准 · 创建于今天」|
|4b 同步码|免登录说明及生成反馈|「跨设备同步（免登录）」「同步到其他设备」；生成XXXXXXXX，显示「已推送最新清单」|65；C-desktop-sync-code原文|这是页内展开块不是弹窗；未测试另一设备导入，码可理解为清单合并钥匙|「我的同步码（90 天有效，可反复推送更新）：」「在其他设备的清单页输入这个码，即可把清单合并过去」|
|5 监控生命周期|已注册项加入后可确认取消|初始为空；mochamo.com已注册，2027-08-24到期；在清单开监控后进/monitors，显示该域名；点取消出现「确认取消?」倒计时，再点后空列表；未要求邮箱|66–70；C-desktop-monitors-empty FCP208ms；最后probe monitor=[]|全局名额包含别人，不等于我的监控；添加后“尚未检查”，不能理解为已执行复查|显式二次确认、结束列表清空；可见说明“每 6 小时自动复查”|
|6 why/mcp/404|中文定位、技术能力说明、恢复入口|why标题「中文创业者的域名猎手：用中文说寓意，猎到真正可注册的 .cn / .com」；MCP标题「把域名核验接进你的 AI 助手」；404「页面不存在」「你访问的链接不存在或已被移除，请检查网址是否正确。」「回到首页」+四内容入口|71–73；FCP why476/mcp192/404228ms|MCP虽有用途解释，但JSON-RPC/POST/.mcp.json对非技术创业者门槛高；没有实际接入MCP|404品牌样式与内容入口齐全；MCP写明无需API key、不自动注册或产生费用|

桌面CSV前5行（真实下载，BOM未显示）：

```csv
domain,status,meaning,theme,score,length,readability,relevance,brandability,first_year_price,expires_at
lingxicha.ai,available,"",,,,,,,"首年 $82.7 ≈¥595",""
lingxicha.io,available,"",,,,,,,"首年 $28.12 ≈¥202",""
lingxicha.net,available,"",,,,,,,"首年 $12.52 ≈¥90",""
yunqiji.com,available,"",,,,,,,"首年 $11.08 ≈¥80",""
```

a) 入口：“高级模式”比“批量核验”技术化；文案歧义：输入识别计数不是进度；状态不明：流式有结果但无完成25/25；误触：备注失焦后的首个排序点击未见重排，二次成功，无AI误触。  
b) 原文：列表「首年 $11.08 ≈¥80」「首年 ¥33」「首年 $12.52 ≈¥90」「首年 $28.12 ≈¥202」「首年 $82.7 ≈¥595」未并列注册商/更新时间；已注册五项日期yunqiji.cn 2026-12-12、mochamo.com 2027-08-24、qingfengke.com 2027-07-07、qingfengke.cn 2027-07-08、qingfengke.net 2032-09-23。MCP原文：「DomainHunter 提供免费、无需鉴权的 MCP（Model Context Protocol）server。把它加进 Claude、Cursor 等支持 MCP 的 AI 工具后，AI 就能在对话里直接批量核验域名是否可注册、查询各后缀的实时注册/续费价。」其价格工具写「美元，Porkbun 实时价」。本组注册商外链未重复验证；同步导入、30/90天过期、6小时后监控/webhook未验证。  
c) 亮点：批量零AI及200上限明确；真实CSV；备注本地不外发；分享页只为可注册项给CTA；监控可撤销而非陷阱。  
计时边界：net.log记录请求开始不记录SSE结束，无法精确给全部完成秒数。25行CSV在首次请求后15.23秒已落盘（含人机点击/下载开销）；59完整可见状态上界22.67秒，不能称实际计算耗时22.67秒。

## C — 375 zh

|步骤|期望|实际|耗时/证据|困惑点|信任点|
|---|---|---|---|---|---|
|1 首页入口|375批量可发现|首屏hero占主要高度，批量tab需向下滚；点「批量核验」到「高级模式」；输入控件纵向堆叠|74、75；C-375-home FCP188ms width375/touch5；advanced scrollWidth360/touch5，SPA同document timing|上面4个组合输入占一屏多，真正五行粘贴要更向下；高级模式顶栏文字在手机隐藏|批量tab明确非AI路径|
|2 输入/结果|5行可编辑、25项、无整页横溢|五行文本一次粘贴、TLD手填com,cn,net,io,ai，已识别25；20可注册+5其余；手机行隐藏普通价格，只保留域名/按钮等；无表头，不需整页横滚|76–78、82；net13:51:04.828Z，77截图06.877Z已经完整20/5（约2.05秒上界，缓存复查而非冷启动）；C-375-bulk-result scrollWidth360|本组先前已核验同名单，不能拿速度与桌面冷查比较；手机看不到结果行价格|整批输入易粘贴，长名单可垂直浏览|
|3 CSV|按钮可达且下载25行|「导出 CSV」在结果前可达；第一次自动化tap的文件被Playwright导向/tmp GUID名（工具干扰）；随后原生computer点击下载domainhunter-bulk-20260906 (1).csv到~/Downloads，25数据行，20/5一致|78–81；正常文件mtime13:51:34.135Z；80是工具GUID名不要报产品缺陷|不能只凭按钮存在宣称下载成功；已用原生重试排除工具重定向|文件与桌面字段一致，中文价格未乱码|
|4 收藏/备注/排序|手机新增3且持久化|收藏lingxicha.com/.cn、yunqiji.com，计数9→12；清单对lingxicha.com保存「给合伙人看（手机）」；回页仍保留；首年价升序后.cn ¥33在前|83、84、87、102、103；C-375-shortlist-final scrollWidth360/touch5；FCP268ms|最初自动化选择器没点中备注，误把文字填进同步导入框，未提交、立即清空后正确重做；85不是备注证据|103证明重进后备注保持，102排序选项高亮|
|4a 分享/同步|控件/结果不越屏|生成12项分享https://hunt.zalize.com/s/TeQM0fv62Q，30天有效；375快照「复制 7 个可注册」，已注册5项无CTA；已有XXXXXXXX可推送更新并显示「已推送最新清单」；均为页内区块非弹窗|88、90–92、102；C-375-share-correct FCP236ms/scrollWidth360/touch5|分享+历史两链接+同步区很长，把候选列表向下推约一屏多；单行链接此长度仍可读|备注不随分享，快照与实时边界提示、同步码90天有效|
|5 监控取消|触控按钮可用且清空|清单mochamo.com开关加监控，/monitors显示1项；点「取消监控」出现红色「确认取消? 5」，再点成功空列表；按钮在卡片内未遮挡|93–96；C-375-monitors FCP252ms/scrollWidth375/touch5；最终monitor=[]|清单的细小开关视觉约36×20px，比旁边44px删除/去注册按钮小；这是截图视觉判断不是可点击区域测量|监控页取消按钮约44px高，倒计时明显|
|6 why/mcp/404|文章可读、不横溢、404能回首页|why长标题换行；MCP首段用途同桌面，代码框内部横向滚动（不是整页横溢）；404有「回到首页」，实际点击回到首页|97–101；why FCP228ms scrollWidth360；mcp224ms/360；404252ms/375，均touch5|长技术代码手机阅读需要框内横滚；普通创业者理解门槛仍在|404恢复CTA居中可点击，4内容入口换2行不遮挡|

手机CSV前5行：

```csv
domain,status,meaning,theme,score,length,readability,relevance,brandability,first_year_price,expires_at
lingxicha.com,available,"",,,,,,,"首年 $11.08 ≈¥80",""
lingxicha.cn,available,"",,,,,,,"首年 ¥33",""
lingxicha.net,available,"",,,,,,,"首年 $12.52 ≈¥90",""
lingxicha.io,available,"",,,,,,,"首年 $28.12 ≈¥202",""
```

a) 入口：批量输入在组合表单下，清单在历史分享/同步大块下；歧义：已注册清单仍有普通价/去注册，与分享过滤不一致；状态：没有总完成进度；误触/偏差：13:53:38误点分享URL触发target=_blank，短暂存在第二个hunt标签，立即关掉后用原标签地址栏打开同URL。违反“始终单hunt标签”的要求，已向lead报告；不是AI调用。89实际是桌面截图不能作为375证据，90已正确重拍。  
b) 清单价格与到期原文同桌面；分享原文「由 DomainHunter 用户分享 · 快照生成于 2026年9月6日 · 状态以实时核验为准 · 创建于今天」；监控原文「开了监控的域名每 6 小时自动复查，掉落/被注册会记录在监控动态并推送 webhook 通知」。本轮无注册商外链，未验证另一设备同步导入、真实手机软键盘/触控手感、6小时后监控及通知。  
c) 亮点：375没有整页横溢，清单响应式卡片可保存备注；分享/同步非弹窗避免模态裁切；监控取消确认清晰。  
环境边界：bulk-result及shortlist首次probe曾touch0；随后share/monitors/content/final-shortlist为touch5。几何结论有效，不宣称等价真机。85、86记录自动化中间误操作，89记录误开标签；最终依据87/90/92/102/103而非这些中间截图。

## 收尾、候选优先级与未验证清单

- 六个persona×viewport观察章节已写完，但各节明确的未验证项不算通过。
- P0产品候选：无已验证的付款/数据丢失类P0。**流程合规偏差**：C375分享误开第二hunt标签已关闭；不能宣称完全符合所有硬性禁令。
- P1候选1：已注册项仍有「去注册」并计入批量注册，旁边普通首年价容易被误认为可购买总价。复现：精确查stackpilot→收藏taken io→清单去注册→Porkbun。站内$28.12 vs 外站Aftermarket $4,500 + transfer fee；不是同一种商品价，不应要求数值相等，而应显式说明已注册/二级市场普通注册价不可用。证据07、35、36、52、53、103。
- P1候选2：/vs/io-vs-ai同一页静态说明与实时表格价格不一致（详B桌面原文）。证据30、46、47。应标清各数据时点/来源并避免同页互相矛盾。
- P1候选3：375更多后缀已注册chip长域名/状态截断，见A375步骤、截图14；不影响整页宽度但妨碍读状态。
- P1/P2待定：首页实时价无并列注册商/更新时间；需要点prices/清单才能理解价格来源。证据02、39；这是信任信息缺失，不是已验证的报价错误。
- 未验证总表：B可注册stackpilot.io/ai分支（两者taken）；A375独立新增收藏是否成功；A注册商外链；B375/vs列表过滤独立重复；B375注册商真移动布局（外站为桌面宽）；stackpilot.app后续完成；两设备同步导入；分享/同步到期；6小时监控/真实状态变化/webhook；MCP客户端接入；精确FCP以外LCP（null）、精确首结果渲染及SSE结束耗时；独立真人10秒理解测试；真机软键盘与手感。
- 最终 `/home/ubuntu/r545/ctl.json` 为 `{"lang":"zh","viewport":"desktop"}`，原hunt标签留在 `https://hunt.zalize.com/?lang=zh`；最终probe `final-zh-desktop` innerWidth1600/lang zh-CN，monitor=[]，清单12项。未清理/还原storage，未修改storage_before.json，未改仓库。
- `grep -c ai-search /home/ubuntu/r545/net.log` = **0**（13:56:31Z检查）。只可断言已记录流量没有AI请求；keeper在13:36:43Z–13:37:44Z重启空窗约1分钟，无法据此日志证明空窗全部流量。记录中无主动AI操作。
- `find /home/ubuntu/r545/shots -maxdepth 1 -type f -name '*.png' | wc -l` = **104**。截图编号与文件名在目录；包含上文已标注的工具偏差中间状态，不能全部算通过证据。
- 连续录屏已停止并成功生成：`/home/ubuntu/screencasts/r545-ux/r545-ux-edited.mp4`（18,005,130 bytes）。最后画面截图104为中文桌面首页。工具切换造成的等待也在录屏中，未冒充连续真人快速操作。
- 原始证据：`/home/ubuntu/r545/texts.txt`、`/home/ubuntu/r545/probes.jsonl`、`/home/ubuntu/r545/net.log`；CSV `/home/ubuntu/Downloads/domainhunter-bulk-20260906.csv` 与 `/home/ubuntu/Downloads/domainhunter-bulk-20260906 (1).csv`。probe包含同步/本地分享管理数据，请不要将未经筛选的全部存储内容公开贴PR。
