# R542 取证：/vs 判断段共用开场句扫描与改写前后对比

基线 `deploy/r192-r195` @ `eb406a1`，444 个 `/vs` 条目（`apps/web/src/content/compares.ts`）。
脚本：`node scripts/verify-r542.mjs scan|lcp|pairs [--git eb406a1]`（规范化 = 小写并去除空白/标点/符号；掩码 5-gram Jaccard 与 `scripts/seo-audit/thin-analyze.mjs` 同口径）。

## 1. 全量扫描结论（改前，见 scan-before.md / lcp-before.md）

| 维度 | 结果 |
|---|---|
| en.verdict 前 60/80/100 规范化字符共用簇 | 60：1 簇 ×3（uk/de/fr-vs-com；au-vs-com 因破折号插入语在第 59 字分叉未入簇）· 80：0 · 100：0 |
| zh.verdict 前 60/80/100 | 0 · 0 · 0 |
| en.verdict 两两 LCP（规范化） | 63：uk↔de、uk↔fr、de↔fr；59：au↔uk/de/fr；其余最高 55（kaufen-vs-shop ↔ tienda-vs-shop「Both live in the e-commerce lane; the split is market radius: one says…」），再往下 39 |
| en 首句完全相同簇 | 1 簇 ×3（uk/de/fr-vs-com） |
| zh 首句完全相同簇 | 1 簇 ×3（uk/de/fr-vs-com「和所有「ccTLD vs .com」的选择一样，看用户在哪里。」；au 为破折号变体，LCP 24）—— **本轮不改 zh，仅记录** |
| en/zh pickA/pickB 完全相同列表项跨页 ≥4 次 | en 20 项 / zh 26 项（明细见 scan-before.md）—— 超出本轮范围，仅记录 |

结论：需要改写的开场句簇只有 ccTLD-vs-.com 四页（en）。kaufen/tienda 共享 55 字属两页级近似开头，低于任务定义的 N=60，未改、仅记录。

## 2. 四页新开场句与一手来源（抓取日期 2026-09-06，均为注册局自有页面）

| 页 | 新第一句依据的事实 | 来源 URL |
|---|---|---|
| uk-vs-com | Nominet 注册局字段定义列出 16 种 registrant type，其中 3 种为 Non-UK（Individual / Corporation / Entity） | https://registrars.nominet.uk/uk-namespace/registration-and-domain-management/field-definitions-and-registrant-types/ （HTTP 200）；注：`www.nominet.uk` 对脚本/无头浏览器返回 403，故未引用注册量统计页 |
| de-vs-com | DENIC「International comparison 2024」：境外持有人 .de 域名 >210 万，占 11.8%，美国 27%、荷兰 14% | https://www.denic.de/en/products/statistics-about-de/annual-domain-statistics-de/international-statistics-current-year/ （HTTP 200） |
| au-vs-com | auDA 自有调研：七成澳洲消费者网购时选择 .au 网站以支持本地企业，一半只从有 .au 网站的企业购买；.au 注册量 >420 万 | https://www.auda.org.au/au-domain-names/learn-about-au-domain-names/benefits-of-au-domain-names/ （HTTP 200） |
| fr-vs-com | AFNIC 2026-09-03 公告：.fr 突破 450 万；法国 VSE/SME 有域名者 62% 首选 .fr（.com 33%） | https://www.afnic.fr/en/observatory-and-resources/news/fr-passes-the-4-5-million-domain-names-mark/ （HTTP 200） |

新句与 `apps/web/src/content/*.ts`（含 /tld 文案）及 `docs/audits/r512/template-sentences.json` 做 6-gram 交叉：0 命中。价格数字、其余段落、zh、pickA/pickB 未改。

## 3. 改前 / 改后（`verify-r542.mjs pairs`）

### 改前（eb406a1）
| slug | en.verdict words | en 开头（前 90 字） |
|---|---|---|
| uk-vs-com | 440 | As with every ccTLD-versus-.com call, it comes down to where your users are. For a UK-focu… |
| de-vs-com | 453 | As with every ccTLD-versus-.com call, it comes down to where your users are. For a Germany… |
| au-vs-com | 420 | As with every ccTLD-versus-.com call, it comes down to where your users are — but .au hold… |
| fr-vs-com | 408 | As with every ccTLD-versus-.com call, it comes down to where your users are. For a France-… |

| pair | Jaccard masked 5-gram | Jaccard raw 5-gram |
|---|---|---|
| uk-vs-com ↔ de-vs-com | 0.0649 | 0.0716 |
| uk-vs-com ↔ au-vs-com | 0.0395 | 0.0411 |
| uk-vs-com ↔ fr-vs-com | 0.0663 | 0.0663 |
| de-vs-com ↔ au-vs-com | 0.0375 | 0.0431 |
| de-vs-com ↔ fr-vs-com | 0.0724 | 0.0760 |
| au-vs-com ↔ fr-vs-com | 0.0371 | 0.0467 |

max masked Jaccard = 0.0724

### 改后
| slug | en.verdict words | en 开头（前 90 字） |
|---|---|---|
| uk-vs-com | 472 | Nominet's registry field definitions list sixteen registrant types for .uk, and three of t… |
| de-vs-com | 492 | DENIC's international comparison for 2024 counts more than 2.1 million .de domains held fr… |
| au-vs-com | 442 | auDA's own consumer research, cited on its benefits page, finds seven in ten Australian sh… |
| fr-vs-com | 435 | AFNIC's September 2026 milestone note puts .fr at 4.5 million names and reports that 62% o… |

| pair | Jaccard masked 5-gram | Jaccard raw 5-gram |
|---|---|---|
| uk-vs-com ↔ de-vs-com | 0.0456 | 0.0514 |
| uk-vs-com ↔ au-vs-com | 0.0245 | 0.0263 |
| uk-vs-com ↔ fr-vs-com | 0.0464 | 0.0464 |
| de-vs-com ↔ au-vs-com | 0.0233 | 0.0281 |
| de-vs-com ↔ fr-vs-com | 0.0528 | 0.0550 |
| au-vs-com ↔ fr-vs-com | 0.0225 | 0.0311 |

max masked Jaccard = 0.0528

四页 proseWords 分别 +32 / +39 / +22 / +27；六对掩码 Jaccard 全部下降，最大值 0.0724 → 0.0528。

## 4. 守门阈值说明（apps/web/src/content/compare-verdict-opening.test.ts）

计划值 80：基线上四页规范化 LCP 仅 59–63，80 抓不住（scan-before 80 字 0 簇）。
语料中最近的非模板对 LCP=55，故取 **59** = 能抓住本簇（含 au 变体）且不误伤的最大值；zh 同阈值（zh 最大 LCP 26，目前不会触发；下一轮改写 zh 开场句后可为 zh 单独下调到 ~24）。
基线 eb406a1 上运行该测试：en 用例失败并列出 `uk-vs-com, de-vs-com, au-vs-com, fr-vs-com`；本分支通过。
