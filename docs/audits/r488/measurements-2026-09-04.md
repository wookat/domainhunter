# R488 SEO 取样度量（自动生成 2026-09-04T20:20:47.874Z）

- 抓取时间 2026-09-04T20:19:00.373Z，seed=488，sitemap 1270 URL（tld 408 / guide 410 / vs 444），每组随机 15 页 + core 7 页，每页 zh（裸路径）与 en（?lang=en）各抓一次。

## 正文字数（去 header/nav/footer/script；prose = 再去掉所有 <a> 链接文本）

| 组 | 语言 | n | main 词数 中位 (min–max) | prose 词数 中位 (min–max) | prose 字符 中位 | 内链数 中位 | 内链带 ?lang 占比 |
|---|---|---|---|---|---|---|---|
| core | zh | 7 | 1332 (0–17523) | 108 (0–851) | 143 | 409 | 80.4% |
| core | en | 7 | 882 (0–9687) | 66 (0–813) | 348 | 409 | 80.4% |
| tld | zh | 15 | 2650 (2402–2823) | 970 (706–1146) | 1476 | 420 | 99.8% |
| tld | en | 15 | 2263 (2120–2373) | 593 (437–699) | 3335 | 420 | 99.8% |
| guide | zh | 15 | 3615 (3310–3938) | 1670 (1382–2011) | 1965 | 426 | 99.8% |
| guide | en | 15 | 2019 (1790–2150) | 1063 (841–1196) | 5601 | 426 | 99.8% |
| vs | zh | 15 | 2537 (2128–2831) | 1186 (753–1474) | 1589 | 455 | 99.8% |
| vs | en | 15 | 2061 (1833–2207) | 716 (469–860) | 4021 | 455 | 99.8% |

## 页间正文相似度（组内两两，prose 文本 5-字符 shingle Jaccard）

| 组.语言 | 对数 | 均值 | 中位 | 最大 (哪两页) | 最小 | 模板骨架占比* |
|---|---|---|---|---|---|---|
| tld.zh | 105 | 12.5% | 12.0% | 26.6% (/tld/boston ↔ /tld/london) | 10.3% | 20.7% |
| tld.en | 105 | 20.2% | 19.3% | 47.7% (/tld/boston ↔ /tld/london) | 16.0% | 29.4% |
| guide.zh | 105 | 4.4% | 4.4% | 6.1% (/guide/lapidary ↔ /guide/teaware) | 3.7% | 8.4% |
| guide.en | 105 | 11.2% | 11.0% | 16.6% (/guide/distillery ↔ /guide/lapidary) | 9.8% | 16.0% |
| vs.zh | 105 | 4.4% | 3.9% | 30.5% (/vs/gr-vs-tr ↔ /vs/tr-vs-ae) | 2.8% | 7.4% |
| vs.en | 105 | 11.5% | 11.0% | 41.2% (/vs/gr-vs-tr ↔ /vs/tr-vs-ae) | 8.7% | 17.1% |

\* 模板骨架占比 = 出现在组内 ≥50% 页面的 shingle 在本页 shingle 中的比例（组内均值），越高说明共享套话越多。

## title / description / H1 / canonical / hreflang

- **zh**（52 页）：title 重复 0 组，description 重复 0 组，H1 重复 0 组；title 长度 30/43/58（min/中位/max 字符），description 68/90/135；H1≠1 的页：/why(0)；canonical 不符预期：0；hreflang 三元组不完整/不一致：0；robots meta：(none)；Vary 响应头：(none)。
- **en**（52 页）：title 重复 0 组，description 重复 0 组，H1 重复 0 组；title 长度 58/74.5/108（min/中位/max 字符），description 152/219.5/404；H1≠1 的页：/why(0)；canonical 不符预期：0；hreflang 三元组不完整/不一致：0；robots meta：(none)；Vary 响应头：(none)。

## 逐页明细

| 页 | 语言 | title(len) | desc len | H1 | prose 词 | 内链 | JSON-LD | canonical✓ | hreflang✓ |
|---|---|---|---|---|---|---|---|---|---|
| / | zh | DomainHunter — 中文创业者的域名猎手 | 用中文说寓意，猎到真正可注册的 .cn / .com 好域名 (58) | 126 | 用中文说出寓意， 猎到真正可注册的 .cn / .com 好域名 | 93 | 0 | FAQPage+WebSite | ✓ | ✓ |
| / | en | DomainHunter — Domain hunter for Chinese founders | Bilingua (102) | 350 | Name it in Chinese or English, hunt .cn  | 56 | 0 | FAQPage+WebSite | ✓ | ✓ |
| /prices | zh | 域名后缀价格总览：408 个主流 TLD 注册与续费对比 | DomainHunter (43) | 78 | 域名后缀价格总览：408 个主流 TLD 注册与续费对比 | 108 | 816 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /prices | en | TLD Price Overview: Registration vs Renewal for 408 Popular  (83) | 152 | TLD Price Overview: Registration vs Rene | 66 | 816 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /why | zh | 为什么选 DomainHunter：中文创业者的域名猎手 | DomainHunter (43) | 135 |  | 0 | 0 | BreadcrumbList | ✓ | ✓ |
| /why | en | Why DomainHunter: a domain hunter for Chinese founders | Dom (69) | 404 |  | 0 | 0 | BreadcrumbList | ✓ | ✓ |
| /mcp | zh | 把域名核验接进你的 AI 助手 | DomainHunter (30) | 132 | 把域名核验接进你的 AI 助手 | 77 | 0 | BreadcrumbList | ✓ | ✓ |
| /mcp | en | Plug domain checking into your AI assistant | DomainHunter (58) | 236 | Plug domain checking into your AI assist | 46 | 0 | BreadcrumbList | ✓ | ✓ |
| /tld | zh | 全部 TLD 注册指南：408 个后缀怎么选 | DomainHunter (37) | 70 | 全部 TLD 注册指南：408 个后缀怎么选 | 153 | 409 | BreadcrumbList | ✓ | ✓ |
| /tld | en | All TLD Registration Guides: How to Choose Among 408 Suffixe (76) | 192 | All TLD Registration Guides: How to Choo | 91 | 409 | BreadcrumbList | ✓ | ✓ |
| /guide | zh | 全部行业命名指南：410 个行业怎么起名 | DomainHunter (35) | 70 | 全部行业命名指南：410 个行业怎么起名 | 174 | 410 | BreadcrumbList | ✓ | ✓ |
| /guide | en | All Industry Naming Guides: How to Name a Product in 410 Ind (82) | 219 | All Industry Naming Guides: How to Name  | 95 | 410 | BreadcrumbList | ✓ | ✓ |
| /vs | zh | 全部后缀对比：444 组 TLD 怎么选 | DomainHunter (35) | 73 | 全部后缀对比：444 组 TLD 怎么选 | 851 | 444 | BreadcrumbList | ✓ | ✓ |
| /vs | en | All TLD Comparisons: 444 Head-to-Head Matchups | DomainHunte (61) | 185 | All TLD Comparisons: 444 Head-to-Head Ma | 813 | 444 | BreadcrumbList | ✓ | ✓ |
| /tld/boston | zh | .boston 域名注册指南：适合谁、多少钱、怎么起名 | DomainHunter (42) | 117 | .boston 域名注册指南：适合谁、多少钱、怎么起名 | 1060 | 419 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /tld/boston | en | .boston Domain Guide: Who It's For, Pricing & Naming Tips |  (72) | 277 | .boston Domain Guide: Who It's For, Pric | 655 | 419 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /tld/boutique | zh | .boutique 域名注册指南：适合谁、多少钱、怎么起名 | DomainHunter (44) | 99 | .boutique 域名注册指南：适合谁、多少钱、怎么起名 | 900 | 425 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /tld/boutique | en | .boutique Domain Guide: Who It's For, Pricing & Naming Tips  (74) | 225 | .boutique Domain Guide: Who It's For, Pr | 551 | 425 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /tld/br | zh | .br 域名注册指南：适合谁、多少钱、怎么起名 | DomainHunter (38) | 99 | .br 域名注册指南：适合谁、多少钱、怎么起名 | 1146 | 420 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /tld/br | en | .br Domain Guide: Who It's For, Pricing & Naming Tips | Doma (68) | 254 | .br Domain Guide: Who It's For, Pricing  | 699 | 420 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /tld/ch | zh | .ch 域名注册指南：适合谁、多少钱、怎么起名 | DomainHunter (38) | 94 | .ch 域名注册指南：适合谁、多少钱、怎么起名 | 1108 | 419 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /tld/ch | en | .ch Domain Guide: Who It's For, Pricing & Naming Tips | Doma (68) | 246 | .ch Domain Guide: Who It's For, Pricing  | 653 | 419 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /tld/cooking | zh | .cooking 域名注册指南：适合谁、多少钱、怎么起名 | DomainHunter (43) | 116 | .cooking 域名注册指南：适合谁、多少钱、怎么起名 | 938 | 420 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /tld/cooking | en | .cooking Domain Guide: Who It's For, Pricing & Naming Tips | (73) | 286 | .cooking Domain Guide: Who It's For, Pri | 593 | 420 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /tld/courses | zh | .courses 域名注册指南：适合谁、多少钱、怎么起名 | DomainHunter (43) | 120 | .courses 域名注册指南：适合谁、多少钱、怎么起名 | 970 | 421 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /tld/courses | en | .courses Domain Guide: Who It's For, Pricing & Naming Tips | (73) | 322 | .courses Domain Guide: Who It's For, Pri | 579 | 421 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /tld/furniture | zh | .furniture 域名注册指南：适合谁、多少钱、怎么起名 | DomainHunter (45) | 119 | .furniture 域名注册指南：适合谁、多少钱、怎么起名 | 986 | 419 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /tld/furniture | en | .furniture Domain Guide: Who It's For, Pricing & Naming Tips (75) | 285 | .furniture Domain Guide: Who It's For, P | 599 | 419 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /tld/gg | zh | .gg 域名注册指南：适合谁、多少钱、怎么起名 | DomainHunter (38) | 87 | .gg 域名注册指南：适合谁、多少钱、怎么起名 | 706 | 425 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /tld/gg | en | .gg Domain Guide: Who It's For, Pricing & Naming Tips | Doma (68) | 192 | .gg Domain Guide: Who It's For, Pricing  | 437 | 425 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /tld/hair | zh | .hair 域名注册指南：适合谁、多少钱、怎么起名 | DomainHunter (40) | 104 | .hair 域名注册指南：适合谁、多少钱、怎么起名 | 936 | 420 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /tld/hair | en | .hair Domain Guide: Who It's For, Pricing & Naming Tips | Do (70) | 256 | .hair Domain Guide: Who It's For, Pricin | 563 | 420 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /tld/it | zh | .it 域名注册指南：适合谁、多少钱、怎么起名 | DomainHunter (38) | 102 | .it 域名注册指南：适合谁、多少钱、怎么起名 | 1046 | 419 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /tld/it | en | .it Domain Guide: Who It's For, Pricing & Naming Tips | Doma (68) | 230 | .it Domain Guide: Who It's For, Pricing  | 613 | 419 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /tld/london | zh | .london 域名注册指南：适合谁、多少钱、怎么起名 | DomainHunter (42) | 118 | .london 域名注册指南：适合谁、多少钱、怎么起名 | 1062 | 420 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /tld/london | en | .london Domain Guide: Who It's For, Pricing & Naming Tips |  (72) | 285 | .london Domain Guide: Who It's For, Pric | 669 | 420 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /tld/ng | zh | .ng 域名注册指南：适合谁、多少钱、怎么起名 | DomainHunter (38) | 100 | .ng 域名注册指南：适合谁、多少钱、怎么起名 | 1122 | 421 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /tld/ng | en | .ng Domain Guide: Who It's For, Pricing & Naming Tips | Doma (68) | 237 | .ng Domain Guide: Who It's For, Pricing  | 699 | 421 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /tld/studio | zh | .studio 域名注册指南：适合谁、多少钱、怎么起名 | DomainHunter (42) | 85 | .studio 域名注册指南：适合谁、多少钱、怎么起名 | 760 | 427 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /tld/studio | en | .studio Domain Guide: Who It's For, Pricing & Naming Tips |  (72) | 170 | .studio Domain Guide: Who It's For, Pric | 461 | 427 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /tld/tax | zh | .tax 域名注册指南：适合谁、多少钱、怎么起名 | DomainHunter (39) | 88 | .tax 域名注册指南：适合谁、多少钱、怎么起名 | 894 | 421 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /tld/tax | en | .tax Domain Guide: Who It's For, Pricing & Naming Tips | Dom (69) | 215 | .tax Domain Guide: Who It's For, Pricing | 563 | 421 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /tld/wtf | zh | .wtf 域名注册指南：适合谁、多少钱、怎么起名 | DomainHunter (39) | 79 | .wtf 域名注册指南：适合谁、多少钱、怎么起名 | 930 | 419 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /tld/wtf | en | .wtf Domain Guide: Who It's For, Pricing & Naming Tips | Dom (69) | 180 | .wtf Domain Guide: Who It's For, Pricing | 537 | 419 | BreadcrumbList+FAQPage | ✓ | ✓ |
| /guide/animation | zh | 动画工作室怎么起名：命名思路、好名字拆解与域名选择 | DomainHunter (40) | 84 | 动画工作室怎么起名：命名思路、好名字拆解与域名选择 | 1980 | 426 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /guide/animation | en | How to Name an Animation Studio: Strategies, Case Studies &  (82) | 218 | How to Name an Animation Studio: Strateg | 1182 | 426 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /guide/community | zh | 社区 / 会员俱乐部怎么起名：归属感、身份认同与域名选择 | DomainHunter (43) | 88 | 社区 / 会员俱乐部怎么起名：归属感、身份认同与域名选择 | 1382 | 426 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /guide/community | en | How to Name a Community or Members' Club: Belonging, Identit (86) | 259 | How to Name a Community or Members' Club | 850 | 426 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /guide/convenience | zh | 便利店与社区零售品牌怎么起名：命名思路、好名字拆解与域名选择 | DomainHunter (45) | 92 | 便利店与社区零售品牌怎么起名：命名思路、好名字拆解与域名选择 | 1967 | 426 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /guide/convenience | en | How to Name a Convenience Store or Community Retail Brand: S (108) | 220 | How to Name a Convenience Store or Commu | 1058 | 426 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /guide/distillery | zh | 精酿蒸馏厂怎么起名：命名思路、好名字拆解与域名选择 | DomainHunter (40) | 68 | 精酿蒸馏厂怎么起名：命名思路、好名字拆解与域名选择 | 1636 | 426 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /guide/distillery | en | How to Name a Craft Distillery: Strategies, Case Studies & D (81) | 199 | How to Name a Craft Distillery: Strategi | 1063 | 426 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /guide/esportsnews | zh | 棋牌电竞资讯站怎么起名：命名思路、好名字拆解与域名选择 | DomainHunter (42) | 81 | 棋牌电竞资讯站怎么起名：命名思路、好名字拆解与域名选择 | 1490 | 426 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /guide/esportsnews | en | How to Name an Esports & Card-Gaming News Site: Strategies,  (90) | 198 | How to Name an Esports & Card-Gaming New | 996 | 426 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /guide/events | zh | 活动策划公司怎么起名：命名思路、好名字拆解与域名选择 | DomainHunter (41) | 96 | 活动策划公司怎么起名：命名思路、好名字拆解与域名选择 | 1937 | 426 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /guide/events | en | How to Name an Event Planning Company: Strategies, Cases & D (81) | 233 | How to Name an Event Planning Company: S | 1095 | 426 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /guide/futsal | zh | 五人制足球场馆怎么起名：命名思路、好名字拆解与域名选择 | DomainHunter (42) | 85 | 五人制足球场馆怎么起名：命名思路、好名字拆解与域名选择 | 1547 | 426 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /guide/futsal | en | How to Name a Futsal or Five-a-Side Venue: Strategies, Cases (85) | 208 | How to Name a Futsal or Five-a-Side Venu | 925 | 426 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /guide/lapidary | zh | 宝石切磨工作室怎么起名：命名思路、好名字拆解与域名选择 | DomainHunter (42) | 69 | 宝石切磨工作室怎么起名：命名思路、好名字拆解与域名选择 | 1662 | 426 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /guide/lapidary | en | How to Name a Lapidary Studio: Strategies, Case Studies & Do (80) | 188 | How to Name a Lapidary Studio: Strategie | 1089 | 426 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /guide/noodle | zh | 面馆与粉面小吃品牌怎么起名：命名思路、好名字拆解与域名选择 | DomainHunter (44) | 88 | 面馆与粉面小吃品牌怎么起名：命名思路、好名字拆解与域名选择 | 2011 | 426 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /guide/noodle | en | How to Name a Noodle Shop or Street Food Brand: Strategies,  (97) | 213 | How to Name a Noodle Shop or Street Food | 1196 | 426 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /guide/outdoor | zh | 户外露营品牌怎么起名：命名思路、好名字拆解与域名选择 | DomainHunter (41) | 89 | 户外露营品牌怎么起名：命名思路、好名字拆解与域名选择 | 1670 | 426 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /guide/outdoor | en | How to Name an Outdoor or Camping Brand: Ideas, Cases & Doma (78) | 220 | How to Name an Outdoor or Camping Brand: | 1009 | 426 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /guide/petgrooming | zh | 宠物美容品牌怎么起名：命名思路、好名字拆解与域名选择 | DomainHunter (41) | 91 | 宠物美容品牌怎么起名：命名思路、好名字拆解与域名选择 | 1591 | 426 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /guide/petgrooming | en | How to Name a Pet Grooming Brand: Strategies, Case Studies & (83) | 215 | How to Name a Pet Grooming Brand: Strate | 983 | 426 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /guide/stationery | zh | 文创品牌与文具店怎么起名：命名思路、好名字拆解与域名选择 | DomainHunter (43) | 93 | 文创品牌与文具店怎么起名：命名思路、好名字拆解与域名选择 | 1984 | 426 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /guide/stationery | en | How to Name a Stationery or Paper Goods Brand: Strategies, C (96) | 214 | How to Name a Stationery or Paper Goods  | 1143 | 426 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /guide/sushi | zh | 日料餐厅与寿司品牌怎么起名：命名思路、好名字拆解与域名选择 | DomainHunter (44) | 80 | 日料餐厅与寿司品牌怎么起名：命名思路、好名字拆解与域名选择 | 1757 | 426 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /guide/sushi | en | How to Name a Sushi Restaurant or Japanese-Dining Brand: Str (106) | 221 | How to Name a Sushi Restaurant or Japane | 1092 | 426 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /guide/teaware | zh | 茶器工作室怎么起名：命名思路、好名字拆解与域名选择 | DomainHunter (40) | 72 | 茶器工作室怎么起名：命名思路、好名字拆解与域名选择 | 1678 | 426 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /guide/teaware | en | How to Name a Teaware Studio: Strategies, Case Studies & Dom (79) | 226 | How to Name a Teaware Studio: Strategies | 1149 | 426 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /guide/ticketing | zh | 票务平台与演出订票网站怎么起名：命名思路、好名字拆解与域名选择 | DomainHunter (46) | 82 | 票务平台与演出订票网站怎么起名：命名思路、好名字拆解与域名选择 | 1454 | 426 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /guide/ticketing | en | How to Name a Ticketing Platform or Box-Office Brand: Strate (96) | 191 | How to Name a Ticketing Platform or Box- | 841 | 426 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /vs/baby-vs-store | zh | .baby 和 .store 怎么选：母婴垂直与通用货架的分工 | DomainHunter (46) | 73 | .baby 和 .store 怎么选：母婴垂直与通用货架的分工 | 1113 | 460 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /vs/baby-vs-store | en | .baby vs .store: The Vertical Audience or The General Shelf  (74) | 164 | .baby vs .store: The Vertical Audience o | 680 | 460 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /vs/email-vs-net | zh | .email 和 .net 怎么选：品类精准与老牌通用的取舍 | DomainHunter (45) | 72 | .email 和 .net 怎么选：品类精准与老牌通用的取舍 | 956 | 455 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /vs/email-vs-net | en | .email vs .net: Category Precision or Veteran Generality | D (71) | 169 | .email vs .net: Category Precision or Ve | 551 | 455 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /vs/es-vs-eu | zh | .es 和 .eu 怎么选：西班牙单一市场与泛欧覆盖的对比 | DomainHunter (44) | 103 | .es 和 .eu 怎么选：西班牙单一市场与泛欧覆盖的对比 | 1340 | 453 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /vs/es-vs-eu | en | .es vs .eu: Spain's Home Market or Pan-European Coverage | D (71) | 302 | .es vs .eu: Spain's Home Market or Pan-E | 796 | 453 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /vs/events-vs-live | zh | .events 和 .live 怎么选：活动日历与正在直播的对比 | DomainHunter (47) | 79 | .events 和 .live 怎么选：活动日历与正在直播的对比 | 1105 | 460 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /vs/events-vs-live | en | .events vs .live: The Calendar or The Broadcast | DomainHunt (62) | 192 | .events vs .live: The Calendar or The Br | 649 | 460 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /vs/gr-vs-tr | zh | .gr 和 .tr 怎么选：希腊与土耳其两个地中海邻国 ccTLD 的对比 | DomainHunter (52) | 105 | .gr 和 .tr 怎么选：希腊与土耳其两个地中海邻国 ccTLD 的对比 | 1263 | 453 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /vs/gr-vs-tr | en | .gr vs .tr: Greece or Türkiye — Two Mediterranean Neighbors' (91) | 257 | .gr vs .tr: Greece or Türkiye — Two Medi | 812 | 453 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /vs/lawyer-vs-legal | zh | .lawyer 和 .legal 怎么选：律师个人牌与法律行业牌的分工 | DomainHunter (50) | 92 | .lawyer 和 .legal 怎么选：律师个人牌与法律行业牌的分工 | 1253 | 453 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /vs/lawyer-vs-legal | en | .lawyer vs .legal: The Attorney's Nameplate or The Industry' (84) | 218 | .lawyer vs .legal: The Attorney's Namepl | 762 | 453 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /vs/life-vs-me | zh | .life 和 .me 怎么选：生活方式品牌与个人身份的对比 | DomainHunter (45) | 80 | .life 和 .me 怎么选：生活方式品牌与个人身份的对比 | 908 | 460 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /vs/life-vs-me | en | .life vs .me: Lifestyle Brand or Personal Identity | DomainH (65) | 172 | .life vs .me: Lifestyle Brand or Persona | 574 | 460 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /vs/limited-vs-ltd | zh | .limited 和 .ltd 怎么选：全拼正式感与缩写实用感 | DomainHunter (46) | 93 | .limited 和 .ltd 怎么选：全拼正式感与缩写实用感 | 1325 | 455 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /vs/limited-vs-ltd | en | .limited vs .ltd: Full Spelling vs the Working Abbreviation  (74) | 217 | .limited vs .ltd: Full Spelling vs the W | 791 | 455 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /vs/lk-vs-my | zh | .lk 和 .my 怎么选：斯里兰卡与马来西亚国家域名的印度洋对比 | DomainHunter (48) | 101 | .lk 和 .my 怎么选：斯里兰卡与马来西亚国家域名的印度洋对比 | 1186 | 451 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /vs/lk-vs-my | en | .lk vs .my: Sri Lanka or Malaysia Country Domain Compared |  (72) | 247 | .lk vs .my: Sri Lanka or Malaysia Countr | 749 | 451 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /vs/organic-vs-bio | zh | .organic 和 .bio 怎么选：有机品类标准与一词双关 | DomainHunter (46) | 103 | .organic 和 .bio 怎么选：有机品类标准与一词双关 | 1474 | 452 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /vs/organic-vs-bio | en | .organic vs .bio: The Category Standard or the Continental S (83) | 262 | .organic vs .bio: The Category Standard  | 860 | 452 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /vs/pk-vs-in | zh | .pk 和 .in 怎么选：巴基斯坦与印度国家域名的南亚对比 | DomainHunter (45) | 113 | .pk 和 .in 怎么选：巴基斯坦与印度国家域名的南亚对比 | 1194 | 451 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /vs/pk-vs-in | en | .pk vs .in: Pakistan or India Country Domain Compared | Doma (68) | 261 | .pk vs .in: Pakistan or India Country Do | 716 | 451 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /vs/properties-vs-estate | zh | .properties 和 .estate 怎么选：资产清单与行业门牌的分工 | DomainHunter (53) | 80 | .properties 和 .estate 怎么选：资产清单与行业门牌的分工 | 1065 | 458 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /vs/properties-vs-estate | en | .properties vs .estate: The Portfolio Word or The Trade Plaq (77) | 185 | .properties vs .estate: The Portfolio Wo | 652 | 458 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /vs/so-vs-io | zh | .so 和 .io 怎么选：Notion 系新贵与技术圈老牌的取舍 | DomainHunter (48) | 78 | .so 和 .io 怎么选：Notion 系新贵与技术圈老牌的取舍 | 753 | 459 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /vs/so-vs-io | en | .so vs .io: The Notion-Era Upstart or the Dev-Scene Classic  (74) | 177 | .so vs .io: The Notion-Era Upstart or th | 469 | 459 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /vs/tr-vs-ae | zh | .tr 和 .ae 怎么选：土耳其与阿联酋两大欧亚门户 ccTLD 的对比 | DomainHunter (52) | 99 | .tr 和 .ae 怎么选：土耳其与阿联酋两大欧亚门户 ccTLD 的对比 | 1302 | 455 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /vs/tr-vs-ae | en | .tr vs .ae: Türkiye or the UAE — Two Eurasian Gateway ccTLDs (84) | 229 | .tr vs .ae: Türkiye or the UAE — Two Eur | 832 | 455 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /vs/world-vs-com | zh | .world 和 .com 怎么选：全球化叙事与万能默认的取舍 | DomainHunter (46) | 81 | .world 和 .com 怎么选：全球化叙事与万能默认的取舍 | 879 | 460 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |
| /vs/world-vs-com | en | .world vs .com: Global Storytelling or the Universal Default (75) | 190 | .world vs .com: Global Storytelling or t | 501 | 460 | BreadcrumbList+Article+FAQPage | ✓ | ✓ |

## 内链图 / BFS 孤岛（sitemap 全量 1270 URL，裸路径、无 JS 渲染）

- 抓取 2026-09-04T20:19:12.689Z；非 200：0
- 首页原始 HTML 内的 <a> 站内链接数：**0**
- 全站内链总数 551180，其中 href 带 ?lang= 的 549516（99.7%）
- BFS-A（严格：href 必须精确等于 sitemap 裸路径）从 / 出发可达：**1/1270**
- BFS-B（逻辑：去掉 ?lang 参数后落到裸路径）从 / 出发可达：**1/1270**；从 /+/tld+/guide+/vs 出发可达：**1267/1270**
- BFS-B 下不可达（孤岛）：/why, /mcp, /advanced；入链为 0 的页：/why, /mcp, /advanced
- 每页入链（逻辑图）min/中位/max：0/416/1263；每页出链 min/中位/max：0/426/816
