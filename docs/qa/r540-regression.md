# R540 零 AI 生产回归 — hunt.zalize.com（Worker 0358b278，deploy/r192-r195 @ 5078d73，bundle `index-ovpruqaK.js` == 本地 dist）

- 日期：2026-09-06 12:47Z–13:13Z（UTC）
- 范围：R535/R536（83 个 /vs 英文判断段 + pickA/pickB）、R538（静态资源安全头、19 个静态参考价刷新、首页 / /advanced textarea id/name/aria-label）、R539（/tld 英文导语空格、.de DENICdirect 79/79 EUR、15 个中文 guide FAQ 去「品牌品牌」）+ 常规矩阵
- 硬约束：0 次 `/api/ai-search`；不注册不付款；storage 备份→还原字节一致；usage 前后 AI 计数 delta 0
- 录屏：`/home/ubuntu/screencasts/r540-prod-regression/r540-prod-regression-edited.mp4`

## 结论

**P0：无 · P1：无 · P2：无 · P3：2（见末节）。** 全部必测项已执行；两处测试流程与计划文字不完全一致的地方（首页精确核验触发 2 次而非 1 次 `/api/search`；`suggest_variants` 第一次调用因我传错参数名返回 isError:true）已如实记录，均非生产缺陷。

## 零 AI / 副作用证明

| 计数（2026-09-06） | before | after | delta |
|---|---|---|---|
| searches | 0 | 0 | 0 |
| fast | 0 | 0 | 0 |
| refine | 0 | 0 | 0 |
| aiErrors | 缺失 | 缺失 | 0 |
| byTld | {} | {} | — |
| cspReports | 2 | 2 | 0（R534 合成值不变） |
| cspSamples（顶层） | 2 | 2 | 逐字相同 |
| pageviews 合计 | 669 | 744 | +75（home+7 results+2 tld+14 guide+18 vs+24 prices+3 other+7 = 本人浏览） |
| bots | 17530 | 18425 | +895（444×2 thin-fetch + curl + Lighthouse 7 次） |

- 浏览器 request hook（14 页 console sweep + 首页/advanced 网络监听）：`/api/ai-search` 0 次；浏览器发出的 `POST /api/csp-report` 0 次。
- 非 AI 生产写操作：`POST /api/search` 3 次（首页精确核验 2 次、/advanced 批量 1 次）；`POST /api/share` 1 次（`ruag1KOWf3`，已撤销 → 410）；MCP `tld_prices` 1、`check_domains` 1、`suggest_variants` 2（1 次参数名错误被拒 isError:true，1 次成功）。
- IndexNow 只读字段前后逐字相同：`cronLast=indexnowLastAttempt=1788696014544`，`indexnowLastResult={"at":1788696014544,"ok":true,"status":200,"message":"OK","submitted":300,"retries":0,"fallbackHosts":["yandex.com"]}`（按 SKILL 解读：主端点限流、Yandex 接受），`indexnowPending=970`（不变），`indexnowLast=1788436834369`。
- Storage：`local identical: True | session identical: True | byte-identical json: True`；还原时移除测试产生的 `dh:myShares:v1`，`domainhunter:lang` 由 `?lang=en` 访问漂移为 en → 经页头「中」按钮还原为 zh，theme 始终 dark；首页复核 zh/dark/候选清单 3。

## 需求矩阵

| # | 需求 | 结果 | 证据 |
|---|---|---|---|
| T1 | 5 个静态资源均带 `x-content-type-options: nosniff` + `referrer-policy: strict-origin-when-cross-origin`，不带 CSP/HSTS/XFO | PASS | `headers_matrix.txt`：favicon.svg / site.webmanifest / index-ovpruqaK.js / inter-latin-var.woff2 / robots.txt 5/5；`/` `/mcp` HTML 有 HSTS + CSP-RO(nonce) + permissions-policy + referrer-policy + nosniff + XFO DENY；`/api/prices`、`POST /mcp` JSON 有 nosniff+referrer-policy、无 `content-security-policy*` |
| T2.1 | vs/en linkShare >25% == 0，≥23% == 0；prose 中位 ≥573 | PASS | 444 页（1270 sitemap）全部 200；en linkShare 中位 **19.84%**，>25% **0**，≥23% **0**（max 22.98% golf-vs-travel）；prose 中位 **628**（min 462 fund-vs-finance）；zh 中位 16.8% / >25% 0 / prose 1013.5。`vs_linkshare_summary.json`, `thin-out/pages.csv` |
| T2.2 | 6 个抽样页 SSR == 水合（verdict / pickA,pickB / 价格表）；含双 TLD；无 undefined/null/U+FFFD；首 120 字两两不同；价格 == /api/prices；静态 TLD 有 reference 徽标 | PASS（附 P3） | `ssr_vs_dom.json` + `ssr_vs_dom_verdict_norm.json`：verdict 6/6（去空白后相等，SSR 抽取需在价格表前截断）、picks 6/6（每侧 5 条）、table 6/6（16 格）；双 TLD 6/6；bad tokens 0；首 120 字两两不同；`.app $8.75/$14.93/5yr $68.47`, `.io $28.12/$51.8/$235.32` == `/api/prices`×7.2；shop-vs-store / cloud-vs-tech 含 reference 徽标（static TLD）。P3：de-vs-com / au-vs-com / uk-vs-com / fr-vs-com 共享 75 字开头句 |
| T2.3 | 浏览器 `/vs/app-vs-io?lang=en`、`/vs/shop-vs-store?lang=en` 判断段 + 选型卡 | PASS | `05_…`, `06_…`, `07_…`(dark), `08_…`(light) |
| T3.1 | `check-static-prices.mjs --live` exit 0，首年 >30% == 0 | PASS | `check_static_prices.txt`：首年 >50% 0、>30% 0、续费 >50% 0；58 个 TLD 无实时价回退静态 |
| T3.2 | 部署 bundle 含 19 个新值、旧值不在 | PASS | `bundle_prices.js`（`prices-CRYK5mwK.js`，价格 lazy chunk）：org 57/85 cc 24/62 dev 63/93 co 113/225 site 14/208 vip 30/37 club 30/115 sh 225/336 us 32/50 network 33/204 works 33/226 uk 31/41 furniture 152/597 glass 419/419 eu 42/42 ca 64/66 nz 108/108 ph 305/324 la 197/201 全部存在；旧值 co 65 / sh 320 / glass 270 / furniture 88 / ph 400 0 命中（同名短键 `cash:{first:70…}`、`eco:{first:430…}` 属其他 TLD，非旧值） |
| T3.3 | `/tld/site` `/tld/co` 价格卡 SSR==DOM 且为 live；`/prices` 筛 co → `.co $15.76 ¥113`；MCP tld_prices site/co live、cn approx | PASS | card equal 2/2，`$1.96`/`$15.76`；`03_prices_filter_co_row.png`（`.co $15.76 ¥113 / $31.2 ¥225`）、`04_tld_co_live_price_card.png`；`mcp_prices.json`：isError false, tldCount 408 liveCount 351 staticCount 57, site 1.96/28.84, co 15.76/31.2, cn 4.58/5.28 approx:true |
| T4.1 | 首页 textarea `id=home-description name=description`，aria-label zh/en × AI/精确 4 组 | PASS | DOM 探测 4/4：描述你的品牌或项目 / 输入要核验的名字或域名 / Describe your brand or project / Name or domain to check |
| T4.2 | Tab ≤15 次到达 textarea；输入 `r540zk7q` 精确核验 → `/api/search`；chips 出现；星标 .com → 候选 4 | PASS（备注） | 可达（<15 Tab）；**观察到 2 次 `POST /api/search`**（输入 800 ms 后自动 quick-check 1 次 + 回车显式核验 1 次，均非 AI；计划写「恰好 1 次」，此为计划假设与实现差异）；chips .com/.cn/.co…；`01_home_quickcheck_results.png`；候选清单 3→4 |
| T4.3 | `/advanced` `#advanced-bulk name=bulk` aria-label zh/en；粘贴 2 行 → 1× `/api/search`；渲染 | PASS | `net_advanced.log` 1 次；`02_advanced_bulk_results.png` |
| T5.1 | `/tld?lang=en` 「Start with the price overview」恰 1 空格 | PASS | SSR `Start with the <a …>price overview</a>`；`09_tld_hub_en_filter_de.png` |
| T5.2 | `/tld/de` zh 首年 79/每年 79 欧元且无 116；en 79/79 且无 116 | PASS | zh 命中 2 / 116 欧元 0；en 命中 2 / 116 euros 0；`10_tld_de_zh_79eur.png` |
| T5.3 | 15 个 zh guide：Q1 == JSON-LD name、3 答 == JSON-LD text、无「品牌品牌」 | PASS | `guide_faq.py` FAILS 0；tea「茶叶品牌怎么起名？」、lightingbrand「灯具照明品牌怎么起名？」；15 个 html grep 品牌品牌 = 0；`11_guide_tea_faq_visible.png`, `11b_…zoom.png` |
| T6.1 | 分享创建/渲染/撤销/410/404；移除测试行 | PASS | `ruag1KOWf3` shell 200「4 个候选域名」，浏览器 4 行/3 可注册；删除→确认删除 → 卡片消失；API 410；shell 410 + noindex +「分享已撤销」；`/s/nope-r540` 404 + noindex；移除 `r540zk7q.com` → 3 行；`12_`, `13_`, `14_` |
| T6.2 | hub 筛选 + `/vs#hub-g-com` 落位 | PASS | `/tld` 筛 de → 220（`09_`）；`/vs` 筛 shop → 20/444（`17_`）；`#hub-g-com` 段顶 128.75 px（`16_`）；`/guide` 筛 tea 在 T5 浏览器路径中已覆盖 hub→详情 |
| T6.3 | `/r540-nope` 404 shell + UI | PASS | 404 +「页面不存在 \| DomainHunter」+ noindex；UI 404/回到首页/4 个 hub chip（`15_`） |
| T6.4 | 375 px 6 路由 scrollWidth 375；light/dark | PASS | 6/6 = 375；`18_advanced_375.png`, `19_vs_app_io_375.png`；light `08_` 后已回 dark |
| T6.5 | console sweep | PASS | 14 页：real_err 0，csp_msgs 0，pageerror 0，requestfailed 0，ai 0，csp_post 0（仅 `/r540-nope` 1 条、`/s/nope-r540` 2 条预期 404 资源行）；`console_sweep.json` |
| T6.6 | MCP tools/list、check_domains、suggest_variants isError:false | PASS（备注） | tools = check_domains/tld_prices/suggest_variants；`check_domains r540zk7q.com → available`；`suggest_variants {name, tlds:[com], limit:3}` 3 条 isError:false。备注：首次用 `label` 传参被校验拒绝（isError:true「invalid name…」），属正确校验 |
| T6.7 | IndexNow 只读 | PASS | 见上表，逐字不变 |
| T7 | Lighthouse a11y/SEO 100 | PASS | `/` `/advanced` `/vs/app-vs-io?lang=en` `/tld/co` `/tld` `/guide/tea` 桌面 + `/` mobile：a11y 100 / SEO 100 / BP 100，failing audits 0（7/7）；`lh_*.json` |
| T8 | 还原 + usage | PASS | 见上 |

## P3 清单

1. **R535/R536 英文判断段共享开头句**：`/vs/de-vs-com`、`au-vs-com`、`uk-vs-com`、`fr-vs-com` 的 verdict 前 75 字相同（「As with every ccTLD-versus-.com call, it comes down to where your users are…」），其后内容组合专属。满足计划「首 120 字两两不同」，但严格意义上是 4 页共用模板开头，建议下一轮改写。
2. **首页精确核验会触发 2 次 `POST /api/search`**（自动 800 ms quick-check + 回车显式核验，见 `home-page.tsx` `useEffect([description])` 与 `runQuickCheck`），非 AI，无用户可见问题；仅为计划假设差异，供产品侧知悉是否需去重。

## 备注

- `/prices` 有实时价的 TLD 的 ¥ 列 = live USD×7.2，因此 R538 刷新的静态值仅在无实时价路径（SSR 回退文本 / MCP `approx:true`）可观察；本轮通过 `check-static-prices --live` + 部署 bundle 文本核对 19 个值。
- Lighthouse 使用 `/opt/hostedtoolcache/node/22.23.2/x64/bin/lighthouse --preset=desktop`（mobile 用默认 `--form-factor=mobile`）。

## 原始 usage

before（12:47Z）：

```json
{"days":{"2026-09-06":{"searches":0,"byTld":{},"fast":0,"refine":0,"cspReports":2,"pageviews":{"home":57,"results":8,"tld":204,"guide":88,"vs":191,"prices":27,"other":94},"bots":17530,"botsBy":{"other":17283,"ai":247}}},"cronLast":1788696014544,"indexnowLast":1788436834369,"indexnowLastAttempt":1788696014544,"indexnowLastResult":{"at":1788696014544,"ok":true,"status":200,"message":"OK","submitted":300,"retries":0,"fallbackHosts":["yandex.com"]},"indexnowPending":970,"cspSamples":[…2 R534 synthetic…]}
```

after（13:13Z，末次活动后 ≥65 s）：

```json
{"days":{"2026-09-06":{"searches":0,"byTld":{},"fast":0,"refine":0,"cspReports":2,"pageviews":{"home":64,"results":10,"tld":218,"guide":106,"vs":215,"prices":30,"other":101},"bots":18425,"botsBy":{"other":18173,"ai":252}}},"cronLast":1788696014544,"indexnowLast":1788436834369,"indexnowLastAttempt":1788696014544,"indexnowLastResult":{"at":1788696014544,"ok":true,"status":200,"message":"OK","submitted":300,"retries":0,"fallbackHosts":["yandex.com"]},"indexnowPending":970,"cspSamples":[…identical…]}
```

完整文件：`/home/ubuntu/r540/usage_before.json`、`/home/ubuntu/r540/usage_after.json`。
