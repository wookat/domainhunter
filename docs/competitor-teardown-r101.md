# 竞品深度拆解与升级方案（R101 研究轮）

日期：2026-08-05 · 方法：真实抓取渲染后 HTML/JS/资源清单 + 浏览器逐站体验 + 截图存档（`/home/ubuntu/competitor-research/`，含 desktop/mobile 截图、rendered DOM、XHR 资源清单）

## 0. 竞品健康度普查（重要市场信号）

| 竞品 | 状态 | 技术栈 | 备注 |
|---|---|---|---|
| instantdomainsearch.com (IDS) | 活跃，品类标杆 | Next.js (RSC) + Clerk 登录 | 五模式搜索、800+ TLD、暗色设计 |
| namelix.com | 活跃 | Vue 2 | AI 起名+logo 卡片网格，品类流量王 |
| oneword.domains | 活跃 | Next.js + Stripe | 138 万单词域名库 + DomainsGPT |
| domainr.com | 活跃 | Nuxt + hCaptcha | domain-hack 匹配（gree.nl/eaf），Fastly API |
| leandomainsearch.com | 活跃（老旧） | WordPress+自研 | 一次搜出 9360 个含词可注册 .com |
| query.domains | 活跃 | Nuxt | 免费批量 WHOIS 核验 |
| porkbun.com | 活跃 | PHP _app | 结账式搜索，价格透明 |
| **dotfind.com** | **已死亡（域名停放）** | — | 曾是「描述→AI→核验」最直接对手 |
| **smartynames.com** | **已死亡（DNS 无解析）** | — | AI 起名先行者，已关停 |
| **namy.ai** | **已死亡（DNS 无解析）** | — | 同上 |
| namecheap/tld-list | Cloudflare 盾，未抓取 | — | 用浏览器体验替代 |

**信号**：纯「一句话→AI 名字」轻工具已死一片（dotfind/smartynames/namy.ai），活下来的都有**深工具护城河**（IDS 的 800 TLD 数据、oneword 的百万词库、namelix 的 logo 视觉钩子）。验证了我们「Agent 闭环 + 全工具链 + 中文市场」的路线，也警示不能只靠 AI 生成一个钩子。

## 1. 十个值得学习的前端设计/交互/布局模式

1. **IDS 首页即输入**（instantdomainsearch）：落地即聚焦，无需点击，直接打字就出结果；顶部吸附的超大搜索框 + `Esc` 快捷键徽标。我们已有即输即查，但落地未自动聚焦。
2. **IDS 五模式搜索分段器**：Search / Extensions / Generator / Aftermarket / Research 五个带彩色图标的 mode tab 内嵌在搜索框下沿，一个输入框复用五种工具，认知负担极低。
3. **IDS 结果三列瀑布 + 行内 Continue 按钮**：每行「绿点状态 + 域名 + Continue▾（注册商下拉）」，密度极高，一屏 27+ 结果；下拉可选不同注册商比价。
4. **IDS 彩色 TLD 状态块**（Extensions 页）：每个 TLD 一个满色块（绿=可注册、红=已注册、黄=premium、蓝=aftermarket），展开箭头看价格趋势，视觉扫描效率极高 + Available/Premium/Aftermarket/Taken 图例筛选器。
5. **Namelix 三步向导**（Name Style → Randomness → Brand Info）：把生成参数拆成三屏单选卡片（每项带一句人话解释），比一次性表单的完成率高；步骤 tab 顶部可回跳。
6. **Namelix 结果卡片网格**：每个名字渲染成一张**品牌 logo 卡**（真实字体排版+配色），右上角绿勾=可注册徽章，hover 出「more info / domains / 👍👎 / ❤」操作条 —— 把抽象名字变成「可视化品牌预览」，是它留存的核心钩子。
7. **Namelix 语义主题 chips**：结果顶部自动生成主题聚类横滑条（如 "Medicinal Flowers" "Ancient Herbalists"），点击按主题过滤 —— AI 聚类让百个结果可导航。
8. **Lean Domain Search 的「9,360 available domains in 0.554s」**：结果数+耗时的自信陈述做成社会证明；精确名不可注册时置顶灰色划线块，然后立即接海量替代。
9. **Domainr 的 domain-hack 匹配**：输入 greenleaf 出 `gree.nl/eaf`、`g.re/enleaf`，把后缀嵌进词里，惊喜感强、分享率高。
10. **oneword.domains 的数据库定位**：标题直接写「Database of 1,381,826 available one-word domains」+ 侧栏多维过滤（TLD/词性/长度/价格），把工具做成资产库；DomainsGPT 独立成子品牌。

## 2. 100 个优点清单（按竞品分组）

### instantdomainsearch（1–25）
1. 落地即可打字，搜索框自动聚焦
2. 逐字符即时结果（<100ms 感知）
3. 五模式复用同一输入框（Search/Extensions/Generator/Aftermarket/Research）
4. Esc 清空快捷键 + 键盘徽标可视化
5. 结果三列高密度布局，一屏 27+
6. 每行 Continue▾ 注册商下拉比价（多注册商，不绑定单一家）
7. Extensions 页 800+ TLD 满色块矩阵
8. Available/Premium/Aftermarket/Taken 四态图例 + 过滤
9. TLD 块可展开看价格/趋势
10. Generator 页前后缀展开可视化（get-/‑hub/my-/-app 加粗差异部分）
11. 命名风格教育区（Brandable/Descriptive/Abstract/Compound/Portmanteau 各配名企实例 figma/vercel/shopify）
12. 暗色/亮色主题切换在 header 常驻
13. 收藏（书签图标）在 header 常驻
14. Sign in 云同步收藏
15. 移动端布局完整降级为单列
16. footer 巨型 sitemap（Domain tools/Resources 分区，几十个内链）
17. 有 Domain search MCP（AI 生态入口，抢 LLM 流量）
18. Reverse dictionary、WHOIS lookup、Expired domains 等长尾工具群
19. 内容营销 Blog + FAQs + Security 信任页
20. 域名行 hover 高亮 + 绿点状态语义色
21. 未知/pending 状态有 shimmer 占位动画
22. 搜索词持久化在 URL（可分享）
23. RSC 流式渲染，首屏无白屏
24. Clerk 无密码登录（低摩擦）
25. 遥测采样做产品决策（telemetry/config 采样开关）

### Namelix（26–45）
26. 三步向导拆解参数，每步单选卡片+一句话解释
27. 步骤间可回跳修改（顶部 tab）
28. 结果渲染成品牌 logo 卡（字体+配色+排版真实预览）
29. 绿勾「.com 可注册」徽章直接标在卡上
30. hover 才出现操作条，静态时视觉干净
31. 👍👎 反馈按钮喂个性化（点踩即换类似风格）
32. ❤ 收藏 + 顶部 Saved 入口
33. 「Browse Names」浏览历史生成库
34. AI 语义主题聚类 chips 过滤结果
35. 无限滚动加载更多生成结果
36. 生成不消耗登录/额度（免费无门槛）
37. 名字点开 more info：含义解释+发音+品牌感分析
38. domains 按钮直接跳注册商联盟链（变现闭环）
39. 与 Brandmark logo 工具交叉导流（生态位互补）
40. 渐变紫品牌底色贯穿向导，气质统一
41. Randomness 低/中/高对应「直白↔创意」用户语言
42. Brand Info 步骤可选填（description 提升相关性但不强制）
43. 结果网格瀑布流响应式（5→2→1 列）
44. 卡片配色多样化，避免视觉疲劳
45. SEO：landing 即工具，无营销壳层

### oneword.domains（46–55）
46. 138 万词库数字放进 title 做信任锚
47. 侧栏多维过滤：TLD/长度/词性/首字母/价格区间
48. DomainsGPT 独立子品牌（AI 描述→名字，GPT-4 徽标信任）
49. 每个域名标注词性+词义（linguistic 数据增值）
50. 价格区间滑块（aftermarket 域名比价）
51. 收藏夹 + CSV 导出
52. Stripe 付费解锁高级过滤（变现验证）
53. 「trending TLDs」榜单内容页
54. next/font 优化字体加载
55. API session 化，登录后跨设备同步

### Domainr（56–62）
56. domain-hack 匹配（gree.nl/eaf）制造惊喜与传播
57. 输入即拆词联想（green/leaf 分色显示）
58. 结果单列极简，无广告干扰
59. Fastly 提供公开 API（开发者生态）
60. API Docs 放 header 一级入口（B2B 双轨）
61. TLD 百科（Top-Level Domains 页）沉淀 SEO
62. 状态实时流式返回（逐条出现）

### Lean Domain Search（63–70）
63. 「Found 9,360 available domains in 0.554 seconds」结果量+速度双炫技
64. 全部结果保证可注册（先过滤后展示，杜绝失望）
65. 精确名不可用时置顶灰色划线告知，随后立刻给出海量替代
66. 前缀/后缀组合穷举透明（Web-/Tech-/-Search 加粗组合部位）
67. Popularity/Alphabetical/Length 三种排序
68. Search Term Filter：只看「词在前/词在后」
69. 点击结果直接进注册流程（单击转化）
70. 零学习成本：一个框+一个按钮

### query.domains（71–76）
71. 免费批量 WHOIS，一次贴几百行
72. 粘贴自动清洗（URL/大小写/去重）
73. 结果表格可按状态排序+一键复制可注册子集
74. 匿名可用，登录仅为保存历史
75. 自建轻量遥测（pageview.app）不引 GA 重件
76. Nuxt SSR，首屏快

### Porkbun（77–84）
77. 搜索结果直接是购物车（查→买零跳转）
78. 首年价+续费价并排展示（防坑透明）
79. 促销价划线对比（锚定效应）
80. whimsical 品牌人格（猪突形象+文案）贯穿
81. checkout 内联 upsell（隐私保护/邮箱/SSL 默认勾选透明）
82. API 公开（我们价格数据就来自它）
83. 单页完成搜索→加购→结账
84. 移动端购物车粘性底栏

### BrandBucket / Namecheap Beast / tld-list（85–92）
85. BrandBucket：人工审核的精品名字市场（质量背书定位）
86. BrandBucket：每个名字配 logo+故事+发音，卖「品牌」不是卖「域名」
87. Namecheap Beast Mode：批量生成参数面板（前后缀/行业词库/TLD 组合矩阵）
88. Namecheap：价格日历（TLD 促销时间表）
89. tld-list：845 个 TLD × 几十家注册商全网比价矩阵
90. tld-list：每 TLD 价格历史曲线
91. tld-list：注册/续费/转入三列价格分开排序
92. Namecheap：搜索结果 A/B 布局成熟（列表/卡片切换）

### 跨竞品共性（93–100）
93. 都在抢 AI 流量入口（IDS 做 MCP、oneword 做 DomainsGPT、namelix 全 AI）
94. 都把「结果即可注册」当第一承诺（先核验后展示）
95. 都有排序/过滤器，从不让用户面对不可控的长列表
96. 都把注册商链接做成显眼主 CTA（联盟变现主线）
97. 键盘可达性普遍好（tab 顺序、快捷键）
98. URL 反映应用状态（搜索词/模式可分享可回退）
99. 高密度信息布局（桌面多列），拒绝大留白浪费
100. 免登录即用是行业底线，登录只解锁同步/收藏增值

## 3. 技术反推与可搬迁功能

| # | 竞品功能 | 反推实现 | 迁移到 DomainHunter |
|---|---|---|---|
| T1 | Namelix 品牌 logo 卡片 | 客户端 Canvas/SVG + 字体池 + 配色池随机渲染名字 | 结果页给每个候选名生成轻量「品牌卡预览」（纯 CSS 字体/配色，零成本） |
| T2 | Namelix 主题聚类 chips | 生成时让 LLM 顺带输出 theme 标签，前端按标签分组 | Agent 已产出 style/寓意，可让 DeepSeek 每轮附带主题标签，结果页出聚类过滤 chips |
| T3 | IDS 五模式分段器 | 单输入框 + mode state 切换查询管线 | 首页搜索框下加模式 chips：智能猎名 / 精确核验 / 批量核验 / 后缀矩阵（映射现有四个能力，入口统一） |
| T4 | IDS TLD 色块矩阵 | 每 TLD 一个满色状态块 + 图例过滤 | quick-check 的 31 chips 可升级为色块矩阵视图 + Available/Taken/Unknown 图例过滤 |
| T5 | Lean 的「N 个可注册 · X 秒」 | 结果头部统计条 | 结果页顶部加「本次猎到 N 个可注册 · 共核验 M 个 · 用时 Xs」自信陈述（数据都有） |
| T6 | Lean 的排序/词位过滤 | 客户端排序 | 结果页加 排序（评分/长度/价格）与过滤（仅可注册/仅 .com）工具条 |
| T7 | Namelix 👍👎 反馈闭环 | 点踩→下轮 prompt 排除该风格 | Agent 结果行加 👎「不喜欢这类」，喂给下一轮 refine prompt（我们有多轮闭环，落地成本低） |
| T8 | Domainr domain-hack | TLD 表反查名字后缀 | 低优先：中文用户价值低，暂不做 |
| T9 | oneword 词性/词义标注 | LLM 生成时附带 meaning | 我们已有寓意解释，可提权显示（当前藏在展开里） |
| T10 | IDS 的 MCP 入口 | MCP server 暴露搜索 API | 开源仓库加 MCP server（AI 生态获客，差异化传播点） |
| T11 | Porkbun 双价并排 | 已有续费价数据 | 结果行价格 hover 已有，可在结果页直接并排「首年/续费」 |
| T12 | 免登录底线 | — | 已达标（本地存储+同步码） |

## 4. 我们的差距与升级排期（本轮开始实施）

**P1（本轮 R101-R10x 实施）**
- U1 结果页统计条（T5）：猎到 N 个可注册 · 核验 M 个 · 用时 Xs
- U2 结果页排序/过滤工具条（T6）：按评分/长度/价格排序，仅看可注册
- U3 👎 反馈进 Agent 闭环（T7）：不喜欢→下轮排除同风格
- U4 首页搜索模式分段器（T3）：智能猎名/精确核验/批量核验 统一入口
- U5 品牌卡预览（T1）：候选名 hover/详情出字体+配色品牌卡

**P2（后续轮）**
- U6 主题聚类 chips（T2）
- U7 quick-check 色块矩阵视图 + 图例过滤（T4）
- U8 MCP server（T10）
- U9 寓意解释提权展示（T9）

**不做**：domain-hack（T8，中文价值低）、aftermarket 市场（重运营）、自建注册（老板明令禁止）。
