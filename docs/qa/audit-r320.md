# R320 · 零 AI 全站生产审计（R315–R318 之后全站）

- 日期：2026-08-09（UTC 17:21–17:55）
- 对象：https://hunt.zalize.com（deploy/r192-r195 tip 7731ca6）
- 预算纪律：**0 次 AI/DeepSeek 调用**——全程未触发 /api/ai-search、AI CTA、开始猎取/Start hunting、示例 prompt、refine/「再来一轮」任何入口；quick-check（精确核验 tab）/ bulk / MCP / share 全部走 RDAP/DNS/KV 非 AI 通道
- 方法：真实 Chrome（CDP/Playwright，`audit_browser_r320.py` / `audit_browser_r320b.py`）全站走查 + curl SSR 抽查 + Lighthouse CLI（移动 8 页 + 桌面 4 页）+ MCP JSON-RPC 直连 + 375px 视口仿真
- console 全程 **0 JS/应用级 error**（仅故意场景的 resource 日志：404 路由验证的 404、share 未知 id 的 404、撤销后的 410，均符合预期，见 `findings-r320.json` console_errors）
- 测试前备份 localStorage（3 个 key：lang/theme/shortlist，`dump_storage_r320.py`），结束后逐键还原（`restore_storage_r320.py`），re-dump 与备份 dict 相等 `STORAGE_IDENTICAL`

## 结论总览

| 级别 | 数量 | 摘要 |
|---|---|---|
| P0 | 0 | — |
| P1 | 0 | — |
| P2 | 0 | — |
| P3 | 2 | quick-check All 205 中 9 个 unknown chip（.icu/.lol/.fm/.best/.beauty/.help/.baby/.mom + 新增 .audio，RDAP/WHOIS 无解析类后缀，单 chip「重新核验」机制正常、重查后仍 unknown，与 R297/R302/R310/R316 同类非回归；.audio 为 R317 新增同类后缀）；/vs hub 与 /vs 详情页移动 Lighthouse best-practices 96（inspector-issues CSP report 噪声，与 R302/R310/R316 同类单次波动，非回归） |

生产基线核对：未观察到任何并行部署覆盖迹象——线上计数与 deploy/r192-r195 tip（R318 后）完全一致（TLD 204 / 行业 206 / vs 234 / sitemap 652），R319 未上线（/vs 为 234 而非 240，符合任务书「若 R319 已上线则 240」的备择口径）。

## 硬约束核对：usage 零增量

- `usage-r320-pre.json`（17:21 UTC）与 `usage-r320-post.json`（17:52 UTC）经 JSON 解析后 **days 全表 dict 完全相等**（`DAYS_EQUAL: True`），全文件亦相等（`FULL_EQUAL: True`）。
- 两侧均为：`2026-08-09: searches 7, byTld {com:7,cn:7}, fast 6, refine 0, aiErrors {quota:4}`（与 R316 结束时完全一致，期间无任何会话消耗）。
- 整场审计大量 quick-check（含 All 205 全量）/ bulk / MCP / share 创建撤销 ×3 调用下 usage 全表不动，即 **0 次 AI 调用的直接硬证明**。

## 1. 当前内容口径（全 pass，与任务书 204/206/234、sitemap 652 完全一致）

| 面 | 任务书预期 | 实测 |
|---|---|---|
| /tld hub | 204 | 204（SSR「204 个后缀」h1 + 去重 204 个 /tld/ 链接；浏览器 DOM 同 204） `D-tld_hub_links.png` |
| /guide hub | 206 | 206（SSR「206 个行业」h1 + 去重 206 个 /guide/ 链接；DOM 同 206） `D-guide_hub_links.png` |
| /vs hub | 234 | 234（SSR「234 组」h1 + 去重 234 个 /vs/ 链接；DOM 同 234） `D-vs_hub_links.png` |
| llms.txt | 204/206/234 | 204/206/234（curl 计数），标题行亦为 204/206/234 |
| sitemap.xml | 652 | 652 = 8 非内容页 + 204 tld + 206 guide + 234 vs，内部自洽 |
| quick-check All | 205 | 「共 205 个，196 个可注册」= 204 tld + com.cn；未知 9 `B3-quickcheck-all.png` |
| 首页行业 chips | +196 | 10 个行业 chips + 「+196」（10+196=206 与 guide 口径一致） `A1-home-zh.png` |
| /prices | 204 行 | zh/en 均 204 行（DOM `main a[href^="/?tld="]`） `C1-prices-zh.png` / `C2-prices-en.png` |
| content-counts.json | 204/206/234 | 与线上完全一致 |

## 2. content guard（deploy tip 7731ca6 本地，全 pass）

- `node scripts/check-content-counts.mjs`：TLD 204 ✓ / 行业指南 206 ✓ / 对比页 234 ✓「全部通过」。
- `node scripts/gen-hub-index.mjs --check`：hub-index-*.ts 与内容源一致（tld 204 / guide 206 / vs 234）。

## 3. 重点复核近期变更（R315/R317/R318 全部 18 新页逐页 SSR 核验）

### R315 六新 /vs（ltd-vs-llc / ltd-vs-co / biz-vs-com / fyi-vs-info / promo-vs-shop / express-vs-store，全 pass）
- 六页 zh 全部 200、h1 正常、canonical 自指、hreflang×3、JSON-LD 3 段（BreadcrumbList+Article+FAQPage）、og 11 项；`?lang=en` 变体抽查（biz-vs-com、express-vs-store）200 + 英文 h1 + canonical 带 lang。截图 `E9-vs-biz-com-zh.png`、`E10-vs-express-store-en.png`。

### R317 六新 TLD（press/stream/movie/pictures/productions/audio，全 pass）
- 六页 zh 全部 200、h1「.X 域名注册指南」、canonical 自指、hreflang×3、JSON-LD 2 段（BreadcrumbList+FAQPage）、og 11 项；`?lang=en` 变体抽查（press、audio）200 + 英文 h1。截图 `E7-tld-press-zh.png`（截图时浏览器 lang 为 en，SSR zh h1 已由 curl 单独核验）、`E8-tld-audio-en.png`。
- quick-check All 已含 6 个新 TLD（共 205）；MCP `tld_prices` prices 204 键且 press/stream/movie/pictures/productions/audio 全在；/prices 204 行含新后缀。

### R318 六新 /guide（pestcontrol/roofing/towing/selfstorage/catering/signage，全 pass）
- 六页 zh 全部 200、h1「…怎么起名」、canonical 自指、hreflang×3、JSON-LD 3 段、og 11 项；`?lang=en` 变体抽查（roofing、signage）200 + 英文 h1。截图 `E11-guide-roofing-zh.png`、`E12-guide-signage-en.png`。

（R311–R313 既有新页回归抽查同样通过：`E1-tld-ltd-zh.png`…`E6-guide-flashsale-en.png`。）

## 4. quick-check（精确核验 tab，全 pass）

- 单名随机串：「核验完成：共 9 个，9 个可注册」。`B1-quickcheck-single.png`
- 两级后缀 `baidu.com.cn`：「共 10 个，0 个可注册」（baidu.com.cn 已注册）。`B2-quickcheck-baidu-com-cn.png`
- All 全量：「共 205 个，196 个可注册」= 204 tld + com.cn；未知 9。`B3-quickcheck-all.png`
- unknown 单域重试：unknown chip 带「重新核验」按钮，点击仅该 chip 单独重查，重查后仍 unknown（RDAP 无解析类后缀，见 P3-1）。`B4-before-recheck.png` / `B4b-after-recheck.png`

## 5. /prices（204 行、静态价口径、排序、live 态，全 pass）

- zh/en 均 204 行；live 行 58、静态行（≈ 标注）146。
- live 行 CNY 口径：58 行 × 注册/续费 116 组价格对，全部满足 `¥ = Math.round(USD×7.2)`，0 组不符（`findings-r320b.json` live_cny_mismatch=[]）。
- 静态行口径：内容源直写 CNY、USD 反推加 ≈（如 `.click ≈$2 / ¥11`、`.ink ≈$2 / ¥15`），与 R310/R316 口径一致。
- 排序：默认按注册价升序（全表验证 `prices_default_sorted_asc: true`）；点「后缀/TLD」表头切字典序（`prices_tld_sorted: true`）。`C3-prices-sort-tld.png`

## 6. MCP（JSON-RPC 直连 POST /mcp，全 pass）

- `initialize`：protocolVersion 2025-03-26，serverInfo domainhunter 1.0.0。
- `tools/list`：check_domains / tld_prices / suggest_variants 三工具。
- `tld_prices`：**tldCount=204**，prices 全量 204 键，R317 六新 TLD 全在。
- `check_domains`：google.com taken（expires 2028-09-14）、随机名 available。

## 7. share 链路（创建→展示→404 CTA→撤销→410，不留残留，全 pass）

- curl 侧：POST /api/share（items 2 域名）200 → GET /api/share/:id 200 → `/s/:id` 页面 200 → DELETE + revokeToken（JSON body）200 `{ok:true}` → GET **410**。（另验：DELETE 缺 token 返回 400 `token_required`，鉴权口径正确。）
- 浏览器侧（en）：share 快照页正常渲染域名行 + 「Copy 2 available」+「Export CSV」+ 首年价 + 「Created today」相对时间（`H1-share-live.png`）；zh 侧另建 1 份验证「**创建于今天**」+ 域名可见（`H4-share-live-zh.png`，`findings-r320b.json`）。
- 未知 id `/s/nonexistent316`：API 404，UI 错误态 + CTA「Create your own shortlist」+ 说明文案（`H3-share-404-cta.png`）。
- 撤销后 `/s/:id`：API 410 + UI「链接已失效」+ 同款 CTA（`H2-share-revoked.png`）。
- 本轮共创建 3 份测试 share（curl×1 + 浏览器×2），**全部已撤销，无残留**。

## 8. 404/410 路由（全 pass）

- 未知顶级路径 `/nope-r320`、未知 slug `/tld/nonexistent320`、`/tld/notatld-r320`：均真实 HTTP **404** + 品牌化 404 页（`G1-404-toplevel.png` / `G2-404-tld.png`）。
- `/api/share/nonexistent320`：404 `{"error":"not_found"}`；撤销后 share：410。

## 9. PWA / 静态资产（全 pass）

- `/site.webmanifest` 200：name/short_name/start_url/display standalone/theme_color 齐全；icon-192.png 200、logo.png 200。
- robots.txt 200；sitemap.xml/llms.txt 见第 1 节。

## 10. 主题与 375px（全 pass）

- light/dark 切换：dark `rgb(11,12,14)` → light `rgb(250,250,249)`，**刷新后保持**，再切回 dark 正常（`findings-r320b.json` theme；`I1-light-mode.png`）。
- 375px 视口（CDP Emulation）：/、/prices、/tld、/vs 详情、/guide 详情 `scrollWidth ≤ 375`，无横向溢出（`K1`–`K5` 截图）。

## 11. Lighthouse（perf/a11y/bp/seo）

| 页面 | 移动 | 桌面 |
|---|---|---|
| 首页 | 95 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| /tld | 89 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| /guide | 89 / 100 / 100 / 100 | — |
| /vs | 89 / 100 / **96*** / 100 | 100 / 100 / 100 / 100 |
| /prices | 88 / 100 / 100 / 100 | 99 / 100 / 100 / 100 |
| /tld/press | 91 / 100 / 100 / 100 | — |
| /guide/roofing | 92 / 100 / 100 / 100 | — |
| /vs/biz-vs-com | 90 / 100 / 96* / 100 | — |

- *best-practices 96 均由 inspector-issues（CSP report 噪声）触发，与 R302/R310/R316 同类单次波动（P3-2）。
- 移动 hub 页 LCP 3.2–3.3s、TBT ≤20ms、CLS 0，与 R316（/tld 89）持平，内容 634→652 扩容后无回退。

## 12. bulk（/advanced，全 pass）

- 粘贴 google.com + 随机名，点「核验 2 个域名」：google.com taken、随机名 available，流式返回正常。`F5-advanced-bulk.png`
- /shortlist、/monitors 页面渲染正常。`F2-shortlist.png` / `F3-monitors.png`

## P3 明细

1. **quick-check All 205 中 9 个 unknown**：.icu/.lol/.fm/.best/.beauty/.help/.baby/.mom（历史同类）+ .audio（R317 新增，RDAP/WHOIS 无解析类后缀）。单 chip「重新核验」机制正常，重查后仍 unknown，非回归；建议维持观察或对该类后缀标注「无法自动核验」。
2. **/vs 移动 best-practices 96**：inspector-issues 报 CSP report 噪声（assets/*.js），桌面复测 100，与历史轮次同类波动，观察项。
