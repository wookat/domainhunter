# R488 SEO 技术审计：1270 URL 内容矩阵的收录质量（薄内容 / 近重复 / 内链 / 索引可行性）

- 对象：生产 https://hunt.zalize.com （`deploy/r192-r195` @ `8351a69`），sitemap 1270 URL（`/tld` 408、`/guide` 410、`/vs` 444、核心页 8）
- 日期：2026-09-04（UTC，抓取 20:19，见 `docs/audits/r488/measurements-2026-09-04.md` 头部时间戳）
- 方法：**0 AI 调用**（只 GET 生产 HTML / sitemap / `/api/usage`，未触发 `/api/ai-search`；UA `Mozilla/5.0 (compatible; DomainHunterSeoAudit/1.0; +https://github.com/wookat/domainhunter) SiteAuditBot`，被 `pageviews.ts` 归为 `other` 类 bot——见 §2.3 的计数污染说明）；未写入 localStorage / 分享 / 监控，无需 backup/restore
- 脚本（不依赖 AI，可复现）：`scripts/seo-audit/`（`fetch.mjs sample --seed 488` → 52 页 zh+en 各一次；`fetch.mjs graph` → 全量 1270 裸路径；`analyze.mjs` → `out/report.{json,md}`）。原始 HTML/graph（33 MB）已 gitignore，本仓库只收录 `docs/audits/r488/measurements-2026-09-04.md`（度量表）与 `sample-seed488.json`（抽样清单）
- 每条结论标注来源：**[生产实查]** / **[代码事实]** / **[官方文档]** / **[推断]**

## 0. 结论

| 项 | 结论 | 风险 |
|---|---|---|
| 薄内容 | 内容页去链接后正文中位：tld zh 970 字 / guide zh 1670 字 / vs zh 1186 字（en 593/1063/716 词），不是元数据壳；Google 官方明确"没有字数目标"。**按官方定义不构成薄内容**，但 tld 组共享模板骨架占比 20–29%（见 §1.2） | 低 |
| 近重复 | 组内两两 5-gram Jaccard 中位 4–20%，最高 47.7%（`/tld/boston` ↔ `/tld/london`，en）；zh/en 互为翻译，官方说"主内容已翻译则不算重复" | 低–中（城市类 TLD 对） |
| title / description / H1 | 52 页 ×2 语言：title / description / H1 **零重复**；`/why` SSR 无 H1、无正文（纯客户端渲染） | 低；`/why` 为 P2 |
| canonical / hreflang | 104 份 HTML 全部符合 zh=裸路径、en=`?lang=en`、x-default=裸路径，互列完整。**但裸路径按 `Accept-Language: en` 返回英文正文时 canonical 仍指裸路径（即 hreflang 标为 zh 的 URL），且响应无 `Vary: Accept-Language`**——同一 URL 两份不同语言正文、语言与 canonical 矛盾（§1.4） | **P1** |
| 内链 / 孤岛 | 首页 SSR HTML 内站内 `<a>` 数 = **0**（导航/入口全部由 React 渲染）；从 hub 出发逻辑 BFS 可达 1267/1270，`/why` `/mcp` `/advanced` 入链 0；99.7% 内链带 `?lang=zh`（非 canonical 形式） | **P1**（首页 SSR 无链接 + 3 孤岛） |
| 结构化数据 | schema.org Validator 3 页 0 错误 0 警告（BreadcrumbList / Article / FAQPage）；但 Google 自 2023-08 起 FAQ 富媒体只对政府与健康类权威站点展示 | 低（FAQPage 无收益也无害） |
| 可抓取性 | robots.txt 允许全部；curl / Googlebot / bingbot / Baiduspider UA 全部 200；Cloudflare `security_level=medium`、`browser_check=off`（Bot Management / WAF 规则无权限读取） | 未发现拦截证据 |
| 收录现状 | Google `site:hunt.zalize.com` **0 结果**；Bing `site:` 计数被无关域污染不可信；`/api/usage` 14 天内 google bot 累计 1 次、bing 2 次 | **P1（现状，非缺陷）** |
| IndexNow | 最近一次 2026-09-04 18:00 UTC 返回 **429**（submitted 0），上次成功 2026-09-03 12:00；实现为每 24h 全量重推 1270 URL，失败后每 6h 再全量重试；官方 FAQ 明示"避免一天内多次提交同一 URL（除非有实质变更）" | **P1 → 本 PR 已改为增量推送** |

**本 PR 代码改动**（≤50 行，单测覆盖）：IndexNow 改为"仅推送快照之外的新 URL；`CONTENT_LASTMOD` 变化时才全量"（§4 P1-3）。其余仅出建议，交父会话排期。

## 1. 现状取样（生产实查）

完整表见 `docs/audits/r488/measurements-2026-09-04.md`（逐页 title/desc/H1/字数/内链/JSON-LD/canonical/hreflang）。

### 1.1 抽样与度量方法

- **[代码事实]** 抽样：`scripts/seo-audit/lib.mjs` mulberry32(seed=488) 对 sitemap 各组洗牌取前 15；核心页固定 `/`、`/prices`、`/why`、`/mcp`、`/tld`、`/guide`、`/vs`；每页抓 zh（裸路径，不带 Accept-Language）与 en（`?lang=en`）。
- **[代码事实]** 正文提取：优先 `<main>`，否则 `<body>`；剔除 `header/nav/footer/aside/script/style/svg/noscript/template/注释`；`main` = 剩余可见文本；`prose` = 再去掉全部 `<a>…</a>`（相关链接 chip 区不计入正文）。计数：CJK 逐字、拉丁/数字按词。
- **[代码事实]** 相似度：prose 文本去空白与标点后取 5 字符 shingle 集合，两页 Jaccard = |A∩B| / |A∪B|；"模板骨架占比" = 组内 ≥50% 页面都出现的 shingle 在本页 shingle 中的比例。
- **[代码事实]** 内链图：全量 1270 裸路径抓取，解析 `<a href>` 站内链接；BFS-A 严格匹配（href 必须精确等于 sitemap 裸路径），BFS-B 逻辑匹配（去掉 `?lang=` 后落到裸路径）。

### 1.2 正文字数与相似度 **[生产实查]**

| 组 | 语言 | n | main 中位 (min–max) | prose 中位 (min–max) | 内链中位 | 带 `?lang` 占比 |
|---|---|---|---|---|---|---|
| tld | zh | 15 | 2650 (2402–2823) | 970 (706–1146) | 420 | 99.8% |
| tld | en | 15 | 2263 (2120–2373) | 593 (437–699) | 420 | 99.8% |
| guide | zh | 15 | 3615 (3310–3938) | 1670 (1382–2011) | 426 | 99.8% |
| guide | en | 15 | 2019 (1790–2150) | 1063 (841–1196) | 426 | 99.8% |
| vs | zh | 15 | 2537 (2128–2831) | 1186 (753–1474) | 455 | 99.8% |
| vs | en | 15 | 2061 (1833–2207) | 716 (469–860) | 455 | 99.8% |

| 组.语言 | 对数 | Jaccard 均值 | 中位 | 最大（哪两页） | 模板骨架占比 |
|---|---|---|---|---|---|
| tld.zh | 105 | 12.5% | 12.0% | 26.6% (`/tld/boston` ↔ `/tld/london`) | 20.7% |
| tld.en | 105 | 20.2% | 19.3% | 47.7% (`/tld/boston` ↔ `/tld/london`) | 29.4% |
| guide.zh | 105 | 4.4% | 4.4% | 6.1% | 8.4% |
| guide.en | 105 | 11.2% | 11.0% | 16.6% | 16.0% |
| vs.zh | 105 | 4.4% | 3.9% | 30.5% (`/vs/gr-vs-tr` ↔ `/vs/tr-vs-ae`) | 7.4% |
| vs.en | 105 | 11.5% | 11.0% | 41.2% (`/vs/gr-vs-tr` ↔ `/vs/tr-vs-ae`) | 17.1% |

解读：
- **[推断]** guide / vs 组相似度低（中位 <12%），是各写各的。tld 组共享"适合谁 / 多少钱 / 怎么起名 / FAQ"同一骨架，en 版骨架占比近 30%，同类城市 TLD（boston/london）文案接近一半重合——这是 tld 组内近重复风险最高的子集，不是整站问题。
- 注意每页 400+ 个内链（全站 TLD/guide/vs 列表都在页脚 SSR 输出）使 `main` 词数虚高，评估正文请看 `prose` 列。

### 1.3 title / description / H1 **[生产实查]**

- zh 52 页：title 重复 0 组、description 重复 0 组、H1 重复 0 组；title 长度 30/43/58 字符（min/中位/max），description 68/90/135 字符。
- en 52 页：同样 0 重复；title 58/74.5/108 字符，description 152/219.5/404 字符（en 的 description 上限 404 字符明显过长，仅影响 SERP 截断，不影响收录——无官方长度上限依据）。
- H1≠1 的页：`/why`（zh/en 均 0 个 H1，SSR 正文 0 字，`/why` 路由未调用 `injectSsrSkeleton`——**[代码事实]** `apps/web/src/worker.ts` `/why` handler）。
- robots meta：无 noindex；`X-Robots-Tag`：无。

### 1.4 canonical / hreflang 与 `?lang=en` 参数化多语言

- **[生产实查]** 104 份 HTML：canonical 与 hreflang 三元组全部符合预期（zh=裸路径、en=`?lang=en`、x-default=裸路径），en 版 canonical 自指 `?lang=en`；sitemap 每个 `<loc>` 带 zh/en/x-default 三条 `xhtml:link`。
- **[官方文档]** Google《本地化版本》："Each language version must list itself as well as all other language versions"；"Localized versions of a page are only considered duplicates if the main content of the page remains untranslated"（https://developers.google.com/search/docs/specialty/international/localized-versions ）。→ zh/en 正文均为翻译版（§1.2 两语言字数独立、非机翻壳），**不构成重复内容**。参数化 URL（`?lang=en`）是官方列出的合法 URL 结构之一（"URL parameters" 列于 `managing-multi-regional-sites` 的 URL 结构表，标注"不推荐"但可用：https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites ）。
- **[官方文档]** 《规范化》："If you're using hreflang elements, make sure to specify a canonical page in the same language"（https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls ）。
- **[生产实查] 问题**：裸路径按浏览器 `Accept-Language` 切语言——`curl -H 'Accept-Language: en-US' https://hunt.zalize.com/tld/net` 返回 `<html lang="en">` 英文正文，但 canonical 仍为 `https://hunt.zalize.com/tld/net`（hreflang 声明为 zh 版）；同一请求无 `Vary` 响应头，`cache-control: public, max-age=600`（两次重复请求结果一致，无 `cf-cache-status`，即 Cloudflare 边缘未缓存 HTML，语言串号目前只在共享代理缓存场景下才会发生）。**[代码事实]** `worker.ts` `injectHreflang(html, path, explicitEn)` 只在 `?lang=en` 时改写 canonical（注释"仅认 query，不认 Accept-Language"），而 `lang` 判定包含 Accept-Language。
- **[官方文档]** 《区域自适应页面》："the crawler sends HTTP requests without setting Accept-Language in the request header"；"We recommend using separate locale URL configurations and annotating them with rel="alternate" hreflang annotations"（https://developers.google.com/search/docs/specialty/international/locale-adaptive-pages ）。→ **[推断]** Googlebot 默认抓到的是 zh 版，与 canonical 一致，对 Google 当前无害；但任何带 `Accept-Language: en` 的抓取方（Bing/其他，官方未说明其行为——**无官方依据**）会在 zh URL 上拿到与 `?lang=en` 逐字相同的英文正文且 canonical 互相矛盾。修法见 §4 P1-2。

### 1.5 内链与孤岛 **[生产实查]**

- 首页 `/` 原始 SSR HTML 内站内 `<a>` 链接 **0 个**（导航、hub 入口、页脚全部由 React 客户端渲染；`apps/web/src/App.tsx` 页脚含 TLD/guide/vs 全量链接——**[代码事实]**）。
- 全站内链 551,180 条，其中 549,516（99.7%）href 带 `?lang=zh|en`，即绝大多数内链指向的是非 canonical 形式（`/tld/com?lang=zh`），而 canonical/sitemap 是裸路径。生产对 `?lang=zh` 返回 200 且 canonical 指向裸路径（合并信号正确），只是"链接形式 ≠ canonical 形式"，Google 官方建议内链使用 canonical URL（《规范化》"When linking within your site, link to the canonical URL rather than a duplicate URL"——同上链接）。
- BFS-A（严格）从 `/` 可达 1/1270；BFS-B（逻辑）从 `/` 可达 1/1270；BFS-B 从 `/` + `/tld` + `/guide` + `/vs` 出发可达 **1267/1270**。
- 入链为 0（任何 SSR 页面都不链到）的页：`/why`、`/mcp`、`/advanced`（三者都在 sitemap 内）。
- 每页入链 min/中位/max = 0/416/1263；出链 0/426/816。
- **[官方文档]** 《让链接可抓取》："Generally, Google can only crawl your link if it's an `<a>` HTML element with an href attribute"（https://developers.google.com/search/docs/crawling-indexing/links-crawlable ）；《JavaScript SEO 基础》：Google 分抓取 / 渲染 / 索引三阶段处理 JS（https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics ）。→ **[推断]** Google 渲染后能看到首页链接，但渲染队列延迟与非 Google 爬虫（Bing/百度是否执行 JS：**无官方依据**）使首页在 SSR 层面是一座"无出口"的入口页；1267 页的可达性目前完全依赖 sitemap 与 hub 页。

### 1.6 结构化数据 **[生产实查，schema.org Validator]**

| 页 | 结果 | 类型 | 截图 |
|---|---|---|---|
| `/tld/com` | 0 错误 0 警告 | BreadcrumbList、FAQPage | `docs/audits/r488/schema-validator-tld-com.png` |
| `/guide/animation` | 0 错误 0 警告 | BreadcrumbList、Article、FAQPage | `docs/audits/r488/schema-validator-guide-animation.png` |
| `/vs/baby-vs-store` | 0 错误 0 警告 | BreadcrumbList、Article、FAQPage | `docs/audits/r488/schema-validator-vs-baby-vs-store.png` |

- **[官方文档]** Google 文档更新日志（2023-08-08，原 FAQPage 文档已 301 到此）："Updated the FAQ structured data documentation to state that the feature is only shown for well-known, authoritative government and health websites"（https://developers.google.com/search/updates#removing-faq-rich-result ）。→ FAQPage 对本站不会产生富媒体结果，保留无害，不必投入。

### 1.7 可抓取性 **[生产实查]**

- `robots.txt`：`User-agent: *` Allow 全部，声明 sitemap；GPTBot / PerplexityBot / ClaudeBot 显式允许。
- `/tld/com`：默认 curl、Googlebot、bingbot、Baiduspider UA 全部 HTTP 200（未复现父会话此前关注的 403）；响应 ~185 KB，含 canonical、3 条 hreflang、2 段 JSON-LD、~433 个站内 href。
- Cloudflare（zone `zalize.com`）：API 只读到 `security_level=medium`、`browser_check=off`；Bot Management / 自定义 WAF 规则 / 爬虫分析（GraphQL 缺 `zone.analytics.read`）**均无权限读取**。→ 不能断言 Cloudflare 是否拦过爬虫，只能说本次直接请求未被拦。

## 2. 外部事实

### 2.1 搜索引擎收录 **[生产实查，截图]**

| 查询 | 结果 | 截图 |
|---|---|---|
| Google `site:hunt.zalize.com` | **无匹配结果** | `docs/audits/r488/google-site-2026-09-04.png` |
| Google `site:zalize.com` | 有 zalize.com 其他子站结果，无 hunt.* | `docs/audits/r488/google-site-zalize-root-2026-09-04.png` |
| Bing `site:hunt.zalize.com` | 显示"约 817 条"，但可见结果全部是 LinkedIn 等无关域名 → **计数不可信** | `docs/audits/r488/bing-site-2026-09-04.png` |
| Bing `url:https://hunt.zalize.com/` | 显示"约 60 条"，可见结果为 MSN 等无关域名 → **计数不可信** | `docs/audits/r488/bing-url-home-2026-09-04.png` |

- 结论：**Google 收录 0 是一手可见事实**；Bing 无法通过公开 SERP 得到可信收录数（需 Bing Webmaster Tools）。R485 已实证百度 site: 0。
- 站外链接：`https://zalize.com/products/` 与 `/zh/products/` 各有一条到 `https://hunt.zalize.com` 的 `<a target="_blank" rel="noopener noreferrer">`（zalize.com sitemap 30 URL 中仅此两页提及）；这是唯一已知的官方外链，不是收录证据。

### 2.2 `/api/usage?days=14` **[生产实查，2026-09-04 20:3x UTC]**

- `cronLast` = 2026-09-04 18:00:11 UTC；`indexnowLast`（最近成功）= 2026-09-03 12:00:34 UTC；`indexnowLastError` = `{status: 429, message: "Too many requests", submitted: 0, at: 2026-09-04 18:00:11}`。
- `days` 只有 `2026-09-04` 有 bots 数据（pageview 分片为 R482 新上线）：`bots 1536 = {other 1468, ai 58, baidu 7, bing 2, google 1}`。
- **计数污染说明**：本审计 graph 抓取 1270 页 + 抽样 104 页 ≈ 1370 次 HTML GET，UA 含 `SiteAuditBot` 被归为 `other`（**[代码事实]** `pageviews.ts` 分类顺序 google→bing→baidu→ai→other）。审计前同日样本为 `bots 156 = {other 92, ai 57, baidu 6, bing 1}`，即**当日真实第三方 bot ≈ 156 + (1536−156−~1370) 量级，Google 1 次、Bing 2 次**。趋势判断（14 天）因只有 1 天数据而**无法给出**。

### 2.3 IndexNow 429 分析

- **[生产实查]** 429 发生在 2026-09-04 18:00 的 cron；上次成功 09-03 12:00；key 文件 `https://hunt.zalize.com/024aa6c6f88245bbacdac2f60a94e333.txt` 返回 200 `text/plain`（排除 403/422 类 key 问题）。
- **[代码事实]** `worker.ts` `pingIndexNow`：每 24h 把 `sitemapPaths()` 全部 1270 URL 一次 POST（单批，<10000）；失败后 6h 冷却再**全量**重试；无任何"URL 是否变更"判断（`CONTENT_LASTMOD` 固定 `2026-08-10`）。
- **[官方文档]** IndexNow 协议（https://www.indexnow.org/documentation ）：`429 Too Many Requests — Too Many Requests (potential Spam)`；"You can submit up to 10,000 URLs per post"；"url-changed is a URL of your website which has been added, updated, or deleted"；"The recommended way is to automate submission of URLs as soon as the content is added, updated, or deleted"。IndexNow FAQ（https://www.indexnow.org/faq ）："Can I submit the same URL multiple times a day? Avoid submitting the same URL many times a day unless there are meaningful content changes"；"Automation helps ensure timely URL notifications without overwhelming search engines or exceeding rate limits"。官方**未公布**具体的每日/每小时数值配额（**无官方依据**）。
- **[推断]** 我们每天把同一批 1270 个自 08-10 起未变化的 URL 全量重推，恰好是 FAQ 所指"无实质变更却反复提交同一 URL"的模式；429 的官方语义又是"potential Spam"，所以全量重推是 429 的合理首要嫌疑；但由于官方无数值限额、且我们看不到 IndexNow 侧日志，**不能断言**它是唯一原因（Bing 侧对新站/低信任 host 的限流也可能——无官方依据）。
- 论证"仅推变更 URL"：① 官方协议语义就是"变更通知"，不是 sitemap 同步；② 现网 1270 URL 自 08-10 无变更，改增量后日常应为 0 次请求，天然消除重复提交；③ 新增内容页会自然进入增量队列，`CONTENT_LASTMOD` 变化（全站改版）时仍全量一次；④ 与 R485 百度推送已采用的 `baidu:pushed` 模式一致，实现 <50 行、纯函数可单测。→ **本 PR 已实现**（§4 P1-3）。

## 3. 与 Google Search Central 官方定义逐项对照

| 官方概念 | 官方定义（摘录） | 对照我们的模板页 | 判定 |
|---|---|---|---|
| 有用内容（helpful content） | 自检问题："Does the content provide original information, reporting, research, or analysis?" "Does the content provide a substantial, complete, or comprehensive description of the topic?" "Are you writing to a particular word count because you've heard or read that Google has a preferred word count? (No, we don't.)"（https://developers.google.com/search/docs/fundamentals/creating-helpful-content ）；SEO 入门指南："there's no magical word count target, minimum or maximum"（https://developers.google.com/search/docs/fundamentals/seo-starter-guide ） | 每页有独立价格（`staticPriceFull`）、独立适用场景/FAQ 文案，prose 700–2000 字，guide/vs 相似度 <12%；tld 组骨架占比 20–29% | 低风险。tld 组"原创信息"主要是价格与一句定位，其余为模板套话——**这是主观质量判断，官方无量化阈值** |
| 规模化内容滥用（scaled content abuse） | "generating many pages for the primary purpose of manipulating Search rankings and not helping users… regardless of whether automation, humans, or a combination"（https://developers.google.com/search/docs/essentials/spam-policies#scaled-content-abuse ） | 1262 页模板化生成；页面有真实功能价值（价格对比、可注册核验入口 `/?tld=`），非纯拼凑。0 AI：内容为人工/脚本模板，非 LLM 批量生成 | 中低风险。判定关键在"是否以操纵排名为主要目的"，官方无客观指标；1262 页/仅 1 个外链的比例是我们最像该定义的地方（**[推断]**） |
| 门页（doorway abuse） | "sites or pages are created to rank for specific, similar search queries… lead users to intermediate pages that are not as useful as the final destination"（同上 #doorway-abuse ） | `/vs/*` 444 页每页针对"A vs B 怎么选"；页面自身即目的地（有对比正文与 FAQ），不是跳转中间页 | 低风险；tld 城市类对（boston/london）文案 47.7% 重合最接近"针对相似查询的相似页面"，建议差异化（P2） |
| 薄附属（thin affiliation） | "publishing content with product affiliate links where the product descriptions and reviews are copied directly from the original merchant without any original content or added value"（同上 #thin-affiliation ） | 注册商链接为搜索链接（R484 实证无 `sponsored` 与返佣参数，`REGISTRAR_AFFILIATE_JSON` 默认 `{}`）；文案非注册商复制 | 无风险 |
| "薄内容" | Google 官方**没有**独立的"thin content"政策条目；相关概念散见于上述 helpful content 与 scaled content abuse | — | **无官方依据**，不单列 |
| 多语言/重复 | 见 §1.4 | zh/en 均为翻译版 | 不构成重复；但 Accept-Language 返回英文的裸 URL 存在 canonical 矛盾（P1-2） |

## 4. 结论与建议（P1 必须 / P2 应该 / P3 可选）

### P1-1 Google 0 收录、首页 SSR 0 内链 + 3 个孤岛页（发现，非本 PR 修）

- 证据：§2.1 截图；§1.5 BFS。
- 建议：在 SSR 首页注入一段可抓取的 `<a href>` 导航（hub `/tld` `/guide` `/vs` `/prices` `/why` `/mcp` `/advanced` + 少量精选页），并在内容页 SSR 页脚加 `/why` `/mcp` `/advanced` 链接。范围：`worker.ts` 首页 handler + `content/ssr-html.ts` 页脚，约 30–60 行，需 zh/en 两份文案；验收：`node scripts/seo-audit/fetch.mjs graph && node scripts/seo-audit/analyze.mjs` 的 BFS-B 从 `/` 可达 = 1270/1270。
- 需注意：内链应使用 canonical 形式（裸路径），见 P2-1。
- 另：Google 0 收录的根因**无法仅凭本审计确定**（GSC 未验证，无覆盖率报告）；R481 已接 GSC 验证 meta，老板填入 `GSC_VERIFICATION` 后才能看到"已发现-未编入索引"的官方原因。这是资源缺口，已在 R481 申请。

### P1-2 裸 URL 按 Accept-Language 返回英文时 canonical 与 hreflang 矛盾（建议，非本 PR 修）

- 证据：§1.4 curl 实查 + 官方"canonical 与页面同语言"。
- 方案 A（最小，9 处一词改动）：`injectHreflang(html, path, c.req.query("lang") === "en")` → `injectHreflang(html, path, lang === "en")`，使任何英文正文的 canonical 都指向 `?lang=en`。方案 B（更彻底）：裸路径不再按 Accept-Language 切语言，固定 zh（官方推荐"separate locale URL"），语言切换交给客户端 UI；需产品决策，因为会改变英文浏览器用户首屏语言。两案均建议同时给 HTML 响应加 `Vary: Accept-Language`（防共享缓存串号）。
- 未在本 PR 实现的原因：`injectHreflang` 未导出、无 worker 级单测，且现有注释表明"仅认 query"是有意设计，属需要父会话确认的行为变更，不满足"零风险"门槛。

### P1-3 IndexNow 全量重推 → 改增量（**本 PR 已实现**）

- 改动（`apps/web/src/indexnow.ts` +12 行、`apps/web/src/worker.ts` +28/−6 行含注释、`indexnow.test.ts` +17/−1 行；源码净增 <50 行）：
  - 新增纯函数 `indexNowDelta(prev, urls, lastmod)`：无快照或 `lastmod` 变化 → 全量；否则只返回快照中没有的 URL。
  - `pingIndexNow`：读 KV `indexnow:pushed`（`{lastmod, urls}`），增量为空则只刷新 `indexnow:last` 不发请求；成功后写快照。24h 间隔 / 6h 失败冷却 / 错误记录逻辑不变。
- 预期效果：部署后首次 cron 仍会全量推一次 1270（KV 无快照），成功后每日 0 请求，直到新增内容页或改 `CONTENT_LASTMOD`。若首次仍 429，则 6h 后重试，不再放大。
- 验证：`pnpm -r typecheck` ✓、`pnpm --filter web test` 87/87 ✓（新增 3 用例）、`pnpm --filter web build` ✓。生产效果需部署后观察 `/api/usage` 的 `indexnowLastError` 是否清除（**尚未验证**）。

### P2-1 内链使用 `?lang=zh` 非 canonical 形式（99.7%）

- 建议：SSR 模板中 zh 链接省略 `?lang=zh`（`ssr-html.ts` 22 处 `?lang=${lang}` 收敛为一个 `langHref(path, lang)` 助手），en 保留 `?lang=en`。范围约 30 行，无文案改动。需注意与 P1-2 方案 B 联动（若裸路径固定 zh，则省略参数完全安全；若保留 Accept-Language 切换，英文浏览器用户点 zh 链接会切成英文——此即目前加 `?lang=zh` 的原因，**[推断]**）。

### P2-2 `/why` SSR 无 H1、无正文

- 证据：§1.3。建议：`/why` handler 调用 `injectSsrSkeleton`（与 `/mcp` `/advanced` 一致），约 5–10 行 + zh/en 首段文案。

### P2-3 tld 组城市/同类 TLD 文案近重复

- 证据：`/tld/boston` ↔ `/tld/london` en 47.7%、zh 26.6%；tld.en 骨架占比 29.4%。建议对 geo/城市类 TLD 补一段城市专属信息（注册资格、本地场景）；范围：内容数据（`packages/core` 或 `apps/web/src/content`）逐条人工撰写，非代码改动，需 `node scripts/check-content-counts.mjs`。

### P3-1 en description 过长（最长 404 字符）

- 无官方长度限制，仅 SERP 截断；可在 en 文案侧收敛到 ~160 字符。

### P3-2 FAQPage 结构化数据对本站无富媒体收益

- 官方 2023-08 起仅政府/健康站展示；保留无害，不再投入。

### P3-3 Bing Webmaster Tools / GSC 数据缺口

- Bing 收录数只能在 BWT 内看到；两者都需要老板提供验证串（R481 已申请 GSC，`BING_VERIFICATION` var 同已支持）。这是唯一能把"0 收录"从现象变成原因的途径。

## 5. 未验证 / 需注意

- 未验证 IndexNow 改增量后 429 是否消失（需部署 + 下一次 cron）。
- 未验证 Bing / 百度是否执行 JS、是否发送 Accept-Language（官方无说明，故 P1-1/P1-2 对非 Google 引擎的影响是推断）。
- Cloudflare Bot Management / WAF / 爬虫分析无权限读取，"未被拦截"仅基于本次直接请求 200。
- `/api/usage` bots 计数当日被本审计 ~1370 次请求污染（已在 §2.2 说明）。
- 抽样为每组 15 页（seed 488），相似度极值可能未覆盖全部 408/410/444 页；`fetch.mjs sample --per N` 可扩大样本复跑。

## 6. 复现

```bash
node scripts/seo-audit/fetch.mjs sample --seed 488 --per 15      # 52 页 × zh/en → scripts/seo-audit/out/html
node scripts/seo-audit/fetch.mjs graph --concurrency 6           # 1270 裸路径 → out/graph.json
node scripts/seo-audit/analyze.mjs                               # → out/report.md / out/report.json
curl -sH 'Accept-Language: en-US' https://hunt.zalize.com/tld/net | grep -o '<html lang="[^"]*"\|<link rel="canonical" href="[^"]*"'
curl -s 'https://hunt.zalize.com/api/usage?days=14'
```
