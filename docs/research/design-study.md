# DomainHunter 下一版 UI 重设计 · 竞品与标杆设计调研

> 角色：ux-researcher ｜ 日期：2026-08-05 ｜ 方法：真实浏览器逐站体验（实际操作核心流程 + 桌面/移动双端截图），非只看首页。
> 截图目录：`docs/research/screenshots/`。共覆盖 14 个样本（A 类域名/命名 8 个 + B 类 AI 生成体验 6 个）+ DomainHunter 现状基线。
>
> 受访问限制说明：perplexity.ai、namecheap、atom.com 搜索页、vercel.com/domains 搜索结果页被 Cloudflare/风控拦截（数据中心 IP + CDP 自动化被识别），其中 vercel 结果页通过 DOM 读取完成分析、atom 完成首页与 AI Naming 入口分析；perplexity 未能进入，其「搜索进行中」模式基于 dotfind/bolt/v0 的同类实现与公开资料交叉补充。

---

## 0. DomainHunter 现状基线（hunt.zalize.com）

截图：`domainhunter-current.png` / `domainhunter-current-loading.png` / `domainhunter-current-results.png` / `domainhunter-current-mobile.png`

- 首屏：徽章（AI Agent·实时核验可注册）→ 大标题「说出寓意，猎到真正可注册的好域名」→ 副标题 → 表单卡片（textarea + 示例 chips + TLD chips + 风格/长度下拉 + 主按钮）→ 三个特性卡。
- 加载中：AI 需求理解卡（可修改）+ 轮次进度条（第 1 轮构思中/第 2 轮待定）+ 底部 sticky「查看结果」。已有分轮过程可视化的雏形，但过程中**看不到任何候选名字流入**，60 秒等待是黑盒。
- 结果页：双列卡片；每卡=综合分环形 + 域名（TLD 弱化）+ 一句寓意 + 读音 + 4 维分数格 + 大绿「去注册」+ 复制/收藏。筛选仅状态 tab + 「只看可注册」开关 + 按评分排序；有导出。
- 主要问题（详见 §3 建议）：全浅色无暗色模式；绿色单色调视觉平；卡片信息密度低导致一屏只看到 4-6 个结果；过程无流式结果；收藏无落点（无对比/清单页）；无按 TLD/长度二次筛选。

---

## 1. 逐站体验记录

### A 类 · 域名 / 命名

#### A1. instantdomainsearch.com ｜截图：`ids-home.png` `ids-results.png` `ids-results-full.png` `ids-mobile.png`
1. **首屏**：极简——logo + 一个巨大的搜索框（自动聚焦）+ 一句副标题；零营销噪音，进站即可打字。
2. **输入区**：单输入框即全部 UI；无参数；右侧 AI 开关（AI 生成模式）；键入即搜（keystroke 级）。
3. **过程反馈**：无 loading 概念——每敲一个字母结果**实时刷新**（<100ms），可用性用颜色即时标注。
4. **结果排列**：分区列表：精确匹配置顶（大字号、绿/红即时可用性），下方「For sale」「Extensions」「Generator」「AI suggestions」分区；单行=域名+价格+心形收藏+跳注册商。
5. **筛选/收藏**：左侧竖栏切换分区；心形收藏；无导出。
6. **设计语言**：白底、系统字重对比、几乎无阴影、可用性=绿色/已注册=红色的强色彩语义；无暗色模式。
7. **移动端**：布局完整降级为单列，搜索框仍第一视觉焦点。
8. **值得抄**：① 键入即搜的「零等待」心智——哪怕后端慢也先渲染乐观 UI；② 绿=可注册的强色彩语义一致性；③ 精确匹配大卡置顶+其余分区的层级。

#### A2. dotfind.ai ｜截图：`dotfind-home.png` `dotfind-app.png` `dotfind-loading.png` `dotfind-results.png` `dotfind-results-full.png` `dotfind-mobile.png`
1. **首屏**（营销页）：暗色渐变 hero，「Find a domain name that means business」+ 单 CTA「Find available names free」；直接进 app。
2. **输入区**（app）：左侧面板 = 大 textarea「Describe your business」+ 语气/长度/关键词参数 + 大按钮「Generate 100 Domain Names」；引导文案清楚说明会生成什么。
3. **过程反馈**：点击后按钮变 spinner + 骨架卡片逐步被真实结果替换，结果**流式滚入**，先到先显示。
4. **结果排列**：右侧结果区网格卡片：域名大字 + 可用性徽章 + 价格 + 收藏心形；生成完成后顶部显示计数。
5. **筛选/收藏**：TLD chips 过滤、收藏栏、re-generate；免费额度后引导注册。
6. **设计语言**：深色为主 + 高饱和渐变强调色、大圆角、玻璃拟态卡片；天生暗色模式。
7. **移动端**：面板折叠为顶部抽屉，结果单列，可用。
8. **值得抄**：① 左参数/右结果的双栏 app 布局（描述与结果同屏，改描述即重跑）；② 流式骨架→真实卡片的过程感；③ 「Generate 100 Domain Names」把产出量写进 CTA，预期明确。

#### A3. namelix.com ｜截图：`namelix-home.png` `namelix-step2.png` `namelix-step3.png` `namelix-loading.png` `namelix-results.png` `namelix-results-full.png` `namelix-mobile.png`
1. **首屏**：居中单输入「Enter keywords」+ 一句定位；进入后是**分步向导**（风格→随机度→品牌信息）。
2. **输入区**：向导每步一个决策（名字风格 9 选 1 卡片、随机度 3 档、可选品牌描述），选项皆有示例名预览，极低认知负担。
3. **过程反馈**：全屏 loading 动画（logo 脉冲）数秒，一次性出全量结果。
4. **结果排列**：**瀑布流网格**，每卡=名字渲染成 logo 风格的视觉卡（不同字体/配色模拟品牌感）+ 域名可用性；hover 出现收藏/隐藏。
5. **筛选/收藏**：左侧栏实时改参数（风格/随机度/长度/关键词）结果即时重排；心形收藏集中在 saved 页；点击卡进详情（域名各 TLD 可用性+logo 变体）。
6. **设计语言**：白底+彩色卡片瀑布流，视觉冲击靠内容本身；圆角大、阴影轻；无暗色模式。
7. **移动端**：瀑布流降为两列，向导保持全屏步进，体验完整。
8. **值得抄**：① 把「名字」渲染成品牌视觉卡——寓意/品牌感不用读文字就能感受；② 向导式参数采集（每步一个问题+示例预览）远优于一次性表单；③ 左侧参数栏改动即时重刷结果。

#### A4. leandomainsearch.com ｜截图：`lds-home.png` `lds-results.png` `lds-results-full.png` `lds-mobile.png`
1. **首屏**：一行标题+单输入框+「Search Domains」，无任何装饰。
2. **输入区**：单关键词；示例 placeholder。
3. **过程反馈**：整页刷新式，秒回（纯组合词+缓存的 .com 可用性）。
4. **结果排列**：超高密度**多列纯文本网格**（一屏 ~100 个），全部是「关键词+词缀.com」；绿色小字即全部样式。
5. **筛选/排序**：顶部 tab：Popularity/A-Z/Length + 前缀/后缀过滤；点击进 GoDaddy。
6. **设计语言**：功能主义、几乎零视觉设计；无暗色模式。
7. **移动端**：两列文本，依然高密度可扫。
8. **值得抄**：① 「密度即价值」——找域名场景用户想一眼扫几十个候选，我们当前 4-6 个/屏太少；② 按长度/字母排序这类零成本但高频的排序维度。

#### A5. brandbucket.com ｜截图：`brandbucket-home.png` `brandbucket-results.png` `brandbucket-results-full.png` `brandbucket-mobile.png`
1. **首屏**：电商式 hero + 分类入口（行业/风格）+ 精选域名卡。
2. **输入区**：关键词搜索 + 丰富 facet。
3. **过程反馈**：传统分页加载。
4. **结果排列**：三列商品卡：名字 + **一句寓意描述** + 配套 logo 视觉 + 价格；信息密度与美感平衡好。
5. **筛选**：左侧 facet：长度、风格、行业、价格区间；收藏夹（shortlist）贯穿全站。
6. **设计语言**：米白底+衬线/无衬线混排、插画 logo，「品牌精品店」调性；无暗色模式。
7. **移动端**：单列卡片+筛选抽屉，成熟电商范式。
8. **值得抄**：① 每个域名配一句寓意文案（我们已有 meaning，可升级为卡片主角）；② shortlist（候选清单）作为一等公民，跨 session 保留；③ 左侧 facet 筛选范式。

#### A6. atom.com（原 Squadhelp）｜截图：`atom-home.png` `atom-mobile.png`（搜索结果页被 Cloudflare 拦截）
1. **首屏**：信任驱动——「Trusted by 100,000+ Founders」+ 大搜索框 + Popular 行业 chips + 精选收藏集（Flagship/.ai domains 卡片轮播）。
2. **输入区**：placeholder 是「Type your startup idea or keyword」——直接引导自然语言输入；行业 chips 一键示例。
3. **AI Naming 入口**：免费 AI 起名工具作为漏斗（名字建议+可用性+商标检查+受众测试打包卖点）。
4. **结果排列**（据首页收藏集卡片）：图片化域名卡（配视觉图）+ For Sale 徽章 + 价格。
5. **筛选**：行业/长度/首字母等 facet（footer 暴露完整分类体系：3/4/5 字母、One Word、Short AI…——SEO+浏览双赢）。
6. **设计语言**：白底蓝紫强调、大图卡片、Trustpilot/奖项信任条。
7. **移动端**：首页完整响应式。
8. **值得抄**：① 行业 chips 作为输入引导；② 信任元素（数量、评分）放首屏；③ 按长度/类型的「收藏集」浏览入口（不搜索也能逛）。

#### A7. porkbun.com ｜截图：`porkbun-home.png` `porkbun-results.png` `porkbun-results-full.png`
1. **首屏**：搞怪猪 IP + 大搜索框 + TLD 促销价横幅；个性鲜明。
2. **输入区**：单框，支持直接敲全域名或关键词。
3. **过程反馈**：结果页顶部即时出精确匹配大卡，下方 TLD 列表异步逐行填充价格（行级 spinner）。
4. **结果排列**：精确匹配大卡（绿色 available + 原价划线/现价 + Add to cart）→ 下方全 TLD 长列表：TLD、首年价、续费价、加购按钮；**价格透明（含续费价）是核心差异点**。
5. **筛选**：TLD 分类 tab（popular/all/新出）；购物车模式批量注册。
6. **设计语言**：白底 + 品红/深蓝、卡通插画、圆角按钮；亲和不廉价；无暗色模式。
7. **移动端**：（未截，结果页表格在窄屏折叠为卡片，官方响应式良好。）
8. **值得抄**：① 首年价+续费价双价透明展示（域名用户最大信任痛点）；② 行级异步加载：先出行骨架再填价格，列表不闪跳。

#### A8. oneword.domains ｜截图：`owd-home.png` `owd-results-full.png`
1. **首屏**：数据宣言式标题「Acquire your one-word domain」+ 即时搜索框 + 全量列表直接可浏览。
2. **输入区**：单框前缀过滤，键入即过滤。
3. **过程反馈**：无等待，本地/边缘索引即时过滤。
4. **结果排列**：极简表格：域名、TLD、价格/状态、跳转注册商；一屏几十行。
5. **筛选**：TLD chips + 价格排序；niche 工具做到极致克制。
6. **设计语言**：黑白灰 + 单强调色，等宽字体展示域名，开发者审美；支持暗色。
7. **移动端**：（首页响应式，表格转单列。）
8. **值得抄**：① 等宽字体渲染域名（辨识 l/1/o/0，且更「技术可信」）；② 表格视图作为网格之外的第二视图。

#### A9. vercel.com/domains ｜截图：`vercel-home.png` `vercel-mobile.png`（搜索结果被风控弹窗遮挡，结构经 DOM 分析）
1. **首屏**：整页只有三行字 + 一个输入框：「Find a domain for your new identity. / Fast. At-cost. Private.」——文案层级教科书级。
2. **输入区**：placeholder「Search a domain or describe your idea」——同一个框同时接**精确查询与自然语言描述**（AI 意图识别），Esc 快捷键提示。
3. **过程反馈**：结果流式分批渲染（Top Results 先出，All Results 逐段填充）。
4. **结果排列**（DOM）：Top Results（com/dev/app/io 精选 4 个）+ All Results 纯文字多列网格，每项 hover 出「Domain options」菜单；无图无卡片装饰，纯排版。
5. **筛选**：All TLDs / Show All(available) / Sort by Relevance 三个下拉，极简但够用。
6. **设计语言**：Geist 字体、黑白极简、1px 边框、微妙 hover；官网整体支持暗色模式。
7. **移动端**：`vercel-mobile.png` 单列，输入框全宽置顶。
8. **值得抄**：① 一个输入框吃两种意图（域名精确查 + 想法描述），placeholder 直接教育用户；② Top Results 精选区+全量区的两级结果层级；③ 纯排版结果列表的「安静」美学。

### B 类 · 「输入 → AI 生成 → 结果列表」标杆

#### B1. linear.app ｜截图：`linear-home.png` `linear-home-full.png` `linear-mobile.png`
- 暗色默认；黑底 + 低饱和灰阶层次 + 单一强调点；巨大 display 字体（tracking 收紧）+ 短文案；产品 UI 实截图作为 hero（自证品质）。
- 滚动分区叙事，每屏一个论点；动效克制（fade/parallax 微量）。
- **值得抄**：① 暗色模式的灰阶层次方法论（背景 #0a0a0b 级、卡片 +4% 亮度、边框 1px rgba 白 8%）；② 标题字距收紧的大字排版；③ 用真实产品界面当 hero 素材。

#### B2. raycast.com ｜截图：`raycast-home.png` `raycast-scroll.png`
- 暗色 + 红橙渐变光晕背景；键盘快捷键作为视觉元素（kbd 样式）；卡片玻璃拟态 + 内发光边框。
- 滚动到功能区：左文右图交替、图为产品实拍带圆角大阴影。
- **值得抄**：① kbd/快捷键元素传达「效率工具」气质（DomainHunter 可给复制/收藏配快捷键并展示）；② 暗底上的彩色光晕（glow）点缀层次。

#### B3. stripe.com ｜截图：`stripe-home.png` `stripe-home-full.png` `stripe-mobile.png`
- 标志性动态渐变斜切 hero + 严格 8px 网格排版；正文灰 #425466 层级清晰；组件（按钮/输入框）圆角小(6-8px)而克制。
- 「Global GDP running on Stripe: 1.69%」——用一个实时数据做信任锚点。
- **值得抄**：① 数据锚点文案（我们可展示「已核验 N 万个域名」）；② 渐变仅用于 hero 一处、其余全站极素——强调色纪律。

#### B4. v0.dev ｜截图：`v0-home.png` `v0-mobile.png`
- 进站即产品：居中一个大 prompt 输入框（多行、附件/模型选择内嵌在框底部工具条）+ 模板 chips；无营销 hero。
- 输入框是复合组件：textarea + 底部工具条（参数）+ 右下发送按钮——参数不离开输入上下文。
- **值得抄**：① 复合输入框范式（把 TLD/风格/长度收进输入框底部工具条，替代散落的表单区）；② 示例即模板 chips，点击直接填充并运行。

#### B5. bolt.new ｜截图：`bolt-home.png` `bolt-home-full.png` `bolt-mobile.png`
- 同为 prompt-first：暗色、居中输入框、下方框架图标 chips；生成时进入双栏（左对话流/右实时预览），流式 token 输出 + 步骤清单（installing deps → …）实时打勾。
- **值得抄**：① 生成过程=可视步骤清单逐项打勾（映射我们的「构思→核验→评分」轮次）；② 暗色 + 单列聚焦输入的着陆结构。

#### B6. coolors.co ｜截图：`coolors-home.png` `coolors-generate.png` `coolors-generate2.png` `coolors-trending.png` `coolors-mobile.png`
- 生成器：**空格键=下一批**，全屏即结果，零表单；单个色块可锁定（锁定后其余重生成）；顶部工具条：撤销/重做、视图、导出、保存。
- 结果浏览（trending）：卡片网格 + 心形计数 + hover 快捷操作；导出支持多格式。
- **值得抄**：① 「锁定喜欢的，重生成其余」交互——完美映射域名场景（锁定 2 个候选，让 AI 围绕它们再出一轮）；② 一键重生成快捷键（空格/R）；③ 撤销/重做栈——重跑不怕丢上一批结果。

---

## 2. 横向对比表

| 站点 | 输入形态 | 过程反馈 | 结果形态 | 密度/屏 | 筛选排序 | 收藏 | 导出 | 暗色 | 移动端 | 综合可抄性 |
|---|---|---|---|---|---|---|---|---|---|---|
| instantdomainsearch | 单框键入即搜 | 无等待/实时 | 分区列表 | 高(~20) | 分区切换 | ♥ | ✗ | ✗ | 好 | ★★★★ |
| dotfind.ai | 描述+参数面板 | 流式骨架卡 | 网格卡片 | 中(~9) | TLD chips | ♥ | ✗ | ✓ | 中 | ★★★★★ |
| namelix | 分步向导 | 全屏动画 | 视觉瀑布流 | 中(~12) | 左栏实时参数 | ♥+隐藏 | ✗ | ✗ | 好 | ★★★★★ |
| leandomainsearch | 单关键词 | 秒回 | 纯文本网格 | 极高(~100) | tab 排序 | ✗ | ✗ | ✗ | 中 | ★★★ |
| brandbucket | 关键词+facet | 分页 | 商品卡三列 | 中(~9) | 左侧 facet | shortlist | ✗ | ✗ | 好 | ★★★★ |
| atom.com | 想法/关键词+行业chips | （未达） | 图片域名卡 | 中 | facet+收藏集 | ♥ | ✗ | ✗ | 好 | ★★★ |
| porkbun | 单框 | 行级异步 | 精确大卡+TLD表 | 高 | TLD tab | 购物车 | ✗ | ✗ | 好 | ★★★★ |
| oneword.domains | 前缀过滤 | 即时 | 等宽表格 | 极高 | TLD+价格 | ✗ | ✗ | ✓ | 中 | ★★★ |
| vercel/domains | 双意图单框 | 流式分批 | 排版化列表 | 高(~24) | 3 下拉 | 购物车 | ✗ | ✓ | 好 | ★★★★★ |
| linear | — | — | — | — | — | — | — | ✓默认 | 好 | 视觉★★★★★ |
| raycast | — | — | — | — | — | — | — | ✓默认 | 好 | 视觉★★★★ |
| stripe | — | — | — | — | — | — | — | ✗ | 好 | 视觉★★★★ |
| v0.dev | 复合输入框 | 流式+步骤 | 对话+预览 | — | 模板chips | 项目 | ✗ | ✓默认 | 好 | ★★★★★ |
| bolt.new | prompt-first | 步骤清单打勾 | 双栏 | — | chips | 项目 | ✗ | ✓默认 | 中 | ★★★★ |
| coolors | 快捷键生成 | 即时 | 全屏色板/网格 | 高 | 锁定重生成 | ♥+账户 | ✓多格式 | ✓ | App化 | 交互★★★★★ |
| **DomainHunter 现状** | 表单式（textarea+散落参数） | 轮次进度（无流式结果） | 双列大卡 | 低(4-6) | 状态tab+评分排序 | ♥（无落点） | ✓ | ✗ | 未审 | 基线 |

---

## 3. DomainHunter 下一版 UI 设计建议清单

（按 影响/成本 排序；每条附来源依据与预期收益）

### 3.1 信息架构

1. **【高影响/中成本】着陆页改为 prompt-first 单焦点结构**（v0/bolt/vercel）：去掉三个特性卡与散落表单区，整屏只留：一句标题 + 复合输入框 + 示例 chips。特性卖点收进输入框下方一行小字或结果页空态。收益：首屏决策点从 7+ 降到 1，转化提升。
2. **【高影响/低成本】复合输入框**（v0）：TLD 选择、命名风格、长度偏好收进输入框底部工具条（chips/迷你下拉），发送按钮在框内右下。参数不再把表单撑成一大块。
3. **【中影响/低成本】示例 chips 即模板**（atom/v0）：点击示例直接填充并自动开跑，而非只填充文本。
4. **【中影响/中成本】收藏要有落点**（brandbucket shortlist）：顶部常驻「候选清单(N)」入口 → 清单页支持对比（并排看四维分）、导出、批量跳注册商；localStorage 持久化跨 session。
5. **【中影响/低成本】信任锚点**（stripe/atom）：header 或结果页顶部展示累计数据「已实时核验 N 个域名 · 本次核验 48 个」。

### 3.2 布局与结果呈现

6. **【高影响/中成本】生成页采用左参数/右结果双栏**（dotfind/namelix）：左栏=需求理解卡+参数（可改，改动即重跑）；右栏=结果流。桌面端不再是「表单页→过程页→结果页」三段跳转，一屏闭环。
7. **【高影响/低成本】提高结果密度，提供双视图**（leandomainsearch/oneword/vercel）：默认紧凑行视图（一行=分数徽章+等宽域名+状态点+价格+寓意截断+快捷操作，一屏 12-16 行），可切换到现有丰富卡片视图。
8. **【中影响/低成本】精选区+全量区两级结果**（vercel/ids）：Top Picks（评分前 3-4 的大卡，含完整寓意）置顶，其余进入紧凑列表。
9. **【中影响/低成本】等宽字体渲染域名**（oneword/vercel）：JetBrains Mono/Geist Mono，提高辨识度与技术可信感。

### 3.3 生成过程反馈（我们最大的差异化机会）

10. **【高影响/中成本】流式结果：先到先显示**（dotfind/bolt/perplexity 范式）：核验通过一个就立刻插入结果流（骨架卡→真实卡），不要等整轮结束。60 秒黑盒是当前最大流失点。
11. **【高影响/低成本】过程=步骤清单逐项打勾**（bolt）：把「第 N 轮：构思 → RDAP 核验 → DNS 核验 → 评分」渲染为带实时状态的步骤列表，附带滚动的「正在核验 huntd.cn…」微日志。
12. **【中影响/低成本】被占用的候选也短暂展示**（划线+「已注册」灰卡后淡出或收进折叠区）：让用户看到 AI 真的在筛，核验数字（共核验 48 个）才有体感。

### 3.4 交互模式

13. **【高影响/中成本】锁定+重生成**（coolors）：每卡可「锁定」，点「再来一轮」时 AI 围绕锁定项风格继续找；配快捷键（Space=再来一轮）。
14. **【中影响/低成本】撤销/轮次历史**（coolors）：保留每一轮结果的 tab/时间线，重跑不覆盖上一批。
15. **【中影响/低成本】行内快捷操作 + 键盘导航**（raycast 气质）：↑↓ 选中、C 复制、S 收藏、Enter 去注册；操作按钮 hover 才完整显示，默认安静。
16. **【中影响/中成本】注册商价格透明**（porkbun）：「去注册」下拉展示 2-3 家注册商首年/续费价对比（可用公开价格表静态数据起步）。
17. **【低影响/低成本】TLD/长度二次筛选**（vercel/lds）：结果页补 TLD chips 与长度/字母排序。

### 3.5 视觉规范方向（含暗色模式）

18. **【高影响/中成本】暗色模式为默认，浅色可切**（linear/raycast/v0/bolt——AI 工具品类的事实标准）：
    - 背景层级：`#0B0C0E`（页面）→ `#131519`（卡片）→ `#1A1D23`（悬浮层）；边框 `rgba(255,255,255,0.08)`。
    - 主强调色保留猎手绿但提亮为 `#3DDC84~#4ADE80` 系，仅用于「可注册」状态、主 CTA 与进度；辅以一处渐变光晕（raycast）做 hero 氛围。
    - 状态语义：可注册=绿、已注册=灰(非红，避免页面血腥)、未知=琥珀。
    - 浅色主题沿用同一 token 体系反转。
19. **【中影响/低成本】排版**：display 标题用大字号+收紧字距（linear）；中文标题配 `font-feature` 优化；域名一律等宽字体；数据（分数/价格）用 tabular-nums。
20. **【中影响/低成本】组件纪律**（stripe）：圆角统一 8px（卡片 12px）；阴影只留一档极轻；渐变全站仅 hero 一处；间距 8px 网格。
21. **【中影响/中成本】评分可视化升级**：四维分从四个数字格改为紧凑条形/雷达微图 + 综合分徽章色阶（90+ 金/80+ 绿/70+ 灰），扫读成本更低。
22. **【低影响/低成本】动效**：结果卡入场 60ms 级 stagger fade-up；核验状态点用呼吸动画；遵守 `prefers-reduced-motion`。

### 3.6 移动端

23. **【高影响/中成本】移动端一屏一事**：输入页=全屏输入框+底部工具条参数（抽屉展开）；过程页=步骤清单；结果=单列紧凑行+底部 sticky「候选清单/导出」栏（参考 brandbucket 抽屉筛选 + v0 移动布局）。
24. **【中影响/低成本】触控目标 ≥44px**，复制/收藏改为整行左滑或长按菜单，避免小图标。

### 优先级摘要（建议下一版实施顺序）

- **P0（本次重设计核心）**：#1 #2 #6 #7 #10 #11 #18（prompt-first + 双栏 + 流式 + 暗色默认）
- **P1**：#4 #8 #13 #21 #23
- **P2**：其余。

---

## 附：截图索引

| 站点 | 文件 |
|---|---|
| DomainHunter 现状 | domainhunter-current\*.png（首页/加载/结果/移动端） |
| instantdomainsearch | ids-\*.png |
| dotfind.ai | dotfind-\*.png |
| namelix | namelix-\*.png |
| leandomainsearch | lds-\*.png |
| brandbucket | brandbucket-\*.png |
| atom.com | atom-home.png / atom-mobile.png |
| porkbun | porkbun-\*.png |
| oneword.domains | owd-\*.png |
| vercel/domains | vercel-\*.png |
| linear | linear-\*.png |
| raycast | raycast-\*.png |
| stripe | stripe-\*.png |
| v0.dev | v0-\*.png |
| bolt.new | bolt-\*.png |
| coolors | coolors-\*.png |
