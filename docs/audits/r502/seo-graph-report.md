# R488 SEO 取样度量（自动生成 2026-09-04T23:40:23.694Z）

- 抓取时间 2026-09-04T23:40:17.809Z，seed=502，sitemap 1270 URL（tld 408 / guide 410 / vs 444），每组随机 3 页 + core 7 页，每页 zh（裸路径）与 en（?lang=en）各抓一次。

## 正文字数（去 header/nav/footer/script；prose = 再去掉所有 <a> 链接文本）

| 组 | 语言 | n | main 词数 中位 (min–max) | prose 词数 中位 (min–max) | prose 字符 中位 | 内链数 中位 | 内链带 ?lang 占比 |
|---|---|---|---|---|---|---|---|
| core | zh | 7 | 1332 (77–17523) | 137 (77–851) | 188 | 409 | 80.6% |
| core | en | 7 | 882 (46–9687) | 85 (46–813) | 454 | 409 | 80.6% |
| tld | zh | 3 | 2684 (2569–2714) | 1000 (886–1036) | 1455 | 429 | 99.8% |
| tld | en | 3 | 2270 (2224–2313) | 597 (551–643) | 3134 | 429 | 99.8% |
| guide | zh | 3 | 3761 (3388–3885) | 1829 (1459–1963) | 2176 | 434 | 99.8% |
| guide | en | 3 | 1953 (1796–2168) | 1002 (846–1219) | 5370 | 434 | 99.8% |
| vs | zh | 3 | 2513 (2128–2539) | 1144 (753–1165) | 1510 | 465 | 99.8% |
| vs | en | 3 | 2041 (1833–2056) | 683 (469–697) | 3708 | 465 | 99.8% |

## 页间正文相似度（组内两两，prose 文本 5-字符 shingle Jaccard）

| 组.语言 | 对数 | 均值 | 中位 | 最大 (哪两页) | 最小 | 模板骨架占比* |
|---|---|---|---|---|---|---|
| tld.zh | 3 | 12.6% | 12.8% | 13.3% (/tld/pub ↔ /tld/run) | 11.6% | 24.0% |
| tld.en | 3 | 21.6% | 21.2% | 23.5% (/tld/pub ↔ /tld/run) | 20.1% | 41.4% |
| guide.zh | 3 | 4.2% | 4.2% | 4.4% (/guide/florist ↔ /guide/instrumentstore) | 4.0% | 8.3% |
| guide.en | 3 | 11.3% | 11.6% | 11.7% (/guide/foodtruck ↔ /guide/instrumentstore) | 10.4% | 25.9% |
| vs.zh | 3 | 5.4% | 5.3% | 6.0% (/vs/fit-vs-fitness ↔ /vs/fyi-vs-info) | 4.7% | 11.9% |
| vs.en | 3 | 12.4% | 13.1% | 13.5% (/vs/fit-vs-fitness ↔ /vs/fyi-vs-info) | 10.5% | 27.7% |

\* 模板骨架占比 = 出现在组内 ≥50% 页面的 shingle 在本页 shingle 中的比例（组内均值），越高说明共享套话越多。

## title / description / H1 / canonical / hreflang

- **zh**（16 页）：title 重复 0 组，description 重复 0 组，H1 重复 0 组；title 长度 30/41.5/58（min/中位/max 字符），description 70/84/135；H1≠1 的页：无；canonical 不符预期：0；hreflang 三元组不完整/不一致：0；robots meta：(none)；Vary 响应头：Accept-Language。
- **en**（16 页）：title 重复 0 组，description 重复 0 组，H1 重复 0 组；title 长度 58/72.5/102（min/中位/max 字符），description 138/216.5/404；H1≠1 的页：无；canonical 不符预期：0；hreflang 三元组不完整/不一致：0；robots meta：(none)；Vary 响应头：Accept-Language。

## 逐页明细

| 页 | 语言 | title(len) | desc len | H1 | prose 词 | 内链 | JSON-LD | canonical✓ | hreflang✓ |
|---|---|---|---|---|---|---|---|---|---|
| / | zh | DomainHunter — 中文创业者的域名猎手 | 用中文说寓意，猎到真正可注册的 .cn / .com 好域名 (58) | 126 | 用中文说出寓意， 猎到真正可注册的 .cn / .com 好域名 | 93 | 25 | FAQPage+WebSite | ✓ | ✓ |
| / | en | DomainHunter — Domain hunter for Chinese founders | Bilingua (102) | 350 | Name it in Chinese or English, hunt .cn  | 56 | 25 | FAQPage+WebSite | ✓ | ✓ |
| /prices | zh | 域名后缀价格总览：408 个主流 TLD 注册与续费对比 | DomainHunter (43) | 78 | 域名后缀价格总览：408 个主流 TLD 注册与续费对比 | 108 | 816 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /prices | en | TLD Price Overview: Registration vs Renewal for 408 Popular  (83) | 152 | TLD Price Overview: Registration vs Rene | 66 | 816 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /why | zh | 为什么选 DomainHunter：中文创业者的域名猎手 | DomainHunter (43) | 135 | 中文创业者的域名猎手：用中文说寓意，猎到真正可注册的 .cn / .com | 137 | 0 | BreadcrumbList | ✓ | ✓ |
| /why | en | Why DomainHunter: a domain hunter for Chinese founders | Dom (69) | 404 | A domain hunter for Chinese founders: na | 85 | 0 | BreadcrumbList | ✓ | ✓ |
| /mcp | zh | 把域名核验接进你的 AI 助手 | DomainHunter (30) | 132 | 把域名核验接进你的 AI 助手 | 77 | 0 | BreadcrumbList | ✓ | ✓ |
| /mcp | en | Plug domain checking into your AI assistant | DomainHunter (58) | 236 | Plug domain checking into your AI assist | 46 | 0 | BreadcrumbList | ✓ | ✓ |
| /tld | zh | 全部 TLD 注册指南：408 个后缀怎么选 | DomainHunter (37) | 70 | 全部 TLD 注册指南：408 个后缀怎么选 | 153 | 409 | BreadcrumbList | ✓ | ✓ |
| /tld | en | All TLD Registration Guides: How to Choose Among 408 Suffixe (76) | 192 | All TLD Registration Guides: How to Choo | 91 | 409 | BreadcrumbList | ✓ | ✓ |
| /guide | zh | 全部行业命名指南：410 个行业怎么起名 | DomainHunter (35) | 70 | 全部行业命名指南：410 个行业怎么起名 | 174 | 410 | BreadcrumbList | ✓ | ✓ |
| /guide | en | All Industry Naming Guides: How to Name a Product in 410 Ind (82) | 219 | All Industry Naming Guides: How to Name  | 95 | 410 | BreadcrumbList | ✓ | ✓ |
| /vs | zh | 全部后缀对比：444 组 TLD 怎么选 | DomainHunter (35) | 73 | 全部后缀对比：444 组 TLD 怎么选 | 851 | 444 | BreadcrumbList | ✓ | ✓ |
| /vs | en | All TLD Comparisons: 444 Head-to-Head Matchups | DomainHunte (61) | 185 | All TLD Comparisons: 444 Head-to-Head Ma | 813 | 444 | BreadcrumbList | ✓ | ✓ |
| /tld/party | zh | .party 域名注册指南：适合谁、多少钱、怎么起名 | DomainHunter (41) | 113 | .party 域名注册指南：适合谁、多少钱、怎么起名 | 1036 | 428 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /tld/party | en | .party Domain Guide: Who It's For, Pricing & Naming Tips | D (71) | 278 | .party Domain Guide: Who It's For, Prici | 643 | 428 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /tld/pub | zh | .pub 域名注册指南：适合谁、多少钱、怎么起名 | DomainHunter (39) | 105 | .pub 域名注册指南：适合谁、多少钱、怎么起名 | 1000 | 430 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /tld/pub | en | .pub Domain Guide: Who It's For, Pricing & Naming Tips | Dom (69) | 276 | .pub Domain Guide: Who It's For, Pricing | 597 | 430 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /tld/run | zh | .run 域名注册指南：适合谁、多少钱、怎么起名 | DomainHunter (39) | 83 | .run 域名注册指南：适合谁、多少钱、怎么起名 | 886 | 429 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /tld/run | en | .run Domain Guide: Who It's For, Pricing & Naming Tips | Dom (69) | 181 | .run Domain Guide: Who It's For, Pricing | 551 | 429 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /guide/florist | zh | 花店/花艺工作室怎么起名：命名思路、好名字拆解与域名选择 | DomainHunter (43) | 100 | 花店/花艺工作室怎么起名：命名思路、好名字拆解与域名选择 | 1829 | 434 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /guide/florist | en | How to Name a Florist or Floral Studio: Strategies, Cases &  (82) | 235 | How to Name a Florist or Floral Studio:  | 1002 | 434 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /guide/foodtruck | zh | 餐车与小吃品牌怎么起名：命名思路、好名字拆解与域名选择 | DomainHunter (42) | 97 | 餐车与小吃品牌怎么起名：命名思路、好名字拆解与域名选择 | 1963 | 434 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /guide/foodtruck | en | How to Name a Food Truck or Street Food Brand: Strategies, C (96) | 242 | How to Name a Food Truck or Street Food  | 1219 | 434 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /guide/instrumentstore | zh | 乐器行怎么起名：命名思路、好名字拆解与域名选择 | DomainHunter (38) | 85 | 乐器行怎么起名：命名思路、好名字拆解与域名选择 | 1459 | 434 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /guide/instrumentstore | en | How to Name an Instrument Store: Strategies, Case Studies &  (82) | 214 | How to Name an Instrument Store: Strateg | 846 | 434 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /vs/fit-vs-fitness | zh | .fit 和 .fitness 怎么选：口号短词与全拼场馆的分工 | DomainHunter (47) | 72 | .fit 和 .fitness 怎么选：口号短词与全拼场馆的分工 | 1165 | 465 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /vs/fit-vs-fitness | en | .fit vs .fitness: The Slogan or The Gym in Full | DomainHunt (62) | 138 | .fit vs .fitness: The Slogan or The Gym  | 697 | 465 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /vs/fyi-vs-info | zh | .fyi 和 .info 怎么选：轻快速查与正式资料的分工 | DomainHunter (44) | 72 | .fyi 和 .info 怎么选：轻快速查与正式资料的分工 | 1144 | 464 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /vs/fyi-vs-info | en | .fyi vs .info: The Quick Lookup or The Formal Reference | Do (70) | 150 | .fyi vs .info: The Quick Lookup or The F | 683 | 464 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /vs/so-vs-io | zh | .so 和 .io 怎么选：Notion 系新贵与技术圈老牌的取舍 | DomainHunter (48) | 78 | .so 和 .io 怎么选：Notion 系新贵与技术圈老牌的取舍 | 753 | 467 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /vs/so-vs-io | en | .so vs .io: The Notion-Era Upstart or the Dev-Scene Classic  (74) | 177 | .so vs .io: The Notion-Era Upstart or th | 469 | 467 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |

## 内链图 / BFS 孤岛（sitemap 全量 1270 URL，裸路径、无 JS 渲染）

- 抓取 2026-09-04T23:40:23.003Z；非 200：0
- 首页原始 HTML 内的 <a> 站内链接数：**25**
- 全站内链总数 561301，其中 href 带 ?lang= 的 559637（99.7%）
- BFS-A（严格：href 必须精确等于 sitemap 裸路径）从 / 出发可达：**1/1270**
- BFS-B（逻辑：去掉 ?lang 参数后落到裸路径）从 / 出发可达：**1270/1270**；从 /+/tld+/guide+/vs 出发可达：**1270/1270**
- BFS-B 下不可达（孤岛）：无；入链为 0 的页：无
- 每页入链（逻辑图）min/中位/max：410/416/1264；每页出链 min/中位/max：0/434/816
