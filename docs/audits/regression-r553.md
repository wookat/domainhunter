# R553 零 AI 生产回归 — R548 / R550 / R552（+ R549 增量）

- 生产：https://hunt.zalize.com
- 目标版本：**8102cf2d**（集成 tip `4861109`，PR #517 = R549 /vs 正文价格同源）。生产 bundle `assets/index-qqyGjyog.js` md5 `bde4099488997e0fafc078a68d53fcbe` == `/tmp/r549wt`（@4861109）本地 `vite build` 产物。
- 版本说明：本轮前半段（A–D，§1–§16）在 version `27672324`（deploy/r192-r195 @ `75a07ca`，bundle `index-CSjylmsm.js` == 本地 dist）上执行；执行过程中生产升级到 `8102cf2d`，之后按 lead 要求**只补增量**（§17 R549），未重跑前半段。§1–§16 的证据标注为 27672324 版本证据；§17 与最终 usage/storage 对照为 8102cf2d 版本证据。
- 日期：2026-09-06（UTC）。执行者：测试子会话（Devin）。
- 硬约束结果：`/api/ai-search` **0 次**（所有浏览器请求钩子 + curl）；`/api/usage?days=1` 09-06 `searches/fast/refine` **0→0**，`aiErrors` 前后均不存在，`cspReports` 2→2，`cspSamples` 逐字相同；未注册、未付款（注册商标签仅观察 URL 后关闭）；localStorage/sessionStorage 字节级还原（`byte-identical json: True`）。
- 录屏：`/home/ubuntu/screencasts/r553-prod-regression/r553-prod-regression-edited.mp4`。
- 截图目录：`docs/audits/screenshots-r553/`。
- 原始数据：`/home/ubuntu/r553/`（`usage_before_lead.json` = `/home/ubuntu/r552_usage_before.json`、`usage_after.json`、`storage_before.json`、`storage_after.json`、`net_*.json`、`console_sweep.json`、`sweep375.json`、`ssr_vs_dom.json`、`lh_*.json`、`mcp_*.json`、`r549/`）。

## 结论

| 级别 | 数量 | 条目 |
|---|---|---|
| P0 | 0 | — |
| P1 | 1 | **P1-1（新，R549）** `/vs/de-vs-com?lang=en` 正文「Pricing doubles the case: about **$11/yr (¥80)** with the same renewal — honest pricing for a major ccTLD」描述的是 .de，但模板占位符用的是 `{{price:com:renew:usd}}`/`{{price:com:renew:cny}}`；同页价格表 .de = **$2.9 / $4.07**（¥21 / ¥29），首年≠续费，「same renewal」也不成立。正文与表格价格矛盾，性质同 R545 P1-2（R549 本意就是消灭这类矛盾）。修复点：`apps/web/src/content/compares.ts` de-vs-com en verdict 改为 `{{price:de:first:usd}}` / `{{price:de:renew:usd}}`（并调整「same renewal」措辞）。 |
| P2 | 0 | — |
| P3 | 4 | P3-1 撤销分享 zh SPA 水合后 `og:locale` 为 `en_US`（`<html lang>`=zh-CN、title 已是 zh「分享已撤销」，SSR 壳为 zh_CN）；页面 noindex，仅元数据不一致。P3-2 uk/de/au/fr en 四页在 n=8 词粒度仍有 3 个 8–10 词共享片段（如 “get trust far beyond any new gtld google also geo-associates”），按仓库守门阈值 n=12 为 0（源测试 `compare-verdict-shared.test.ts` EN_N=12），brief 写的「≥8 词 == 0」与仓库阈值不一致。P3-3 控制台预加载告警 `A preload for '/fonts/jetbrains-mono-latin-var.woff2' is found, but is not used because the request credentials mode does not match`（12/12 路由，非错误）。P3-4 `/monitors` 页面无「添加」表单（只能从已注册行开监控），brief §14 的 `r553mon.com` 直接添加流程不可执行，监控增删改用 google.com 走通。 |

已知基线：R546 P1-1（已注册行显示价格/去注册）与 P1-2（`/vs/com-vs-io` zh 引言静态价 69/85 元）本轮 **均已修复**（见 §2、§17.1）。

## A. R548 已注册 / 未知行价格与 CTA（version 27672324）

1. **首页精确核验** `google` → 1× `POST /api/search`（tlds 9 个），结果 google.* 全部已注册，可收藏；`zqx7hunt` → 1× `/api/search`，`.com` 可注册收藏。未知状态行：无价格文字、无「去注册」（`01_home_quickcheck_unknown_row_no_price_no_register.png`、`21_…png`）。✅
2. **/shortlist 桌面表**：`google.com` 价格格 `—`（title「已注册域名不显示注册价：转让 / 二级市场价以注册商为准」），CTA「开监控」（title「开启监控：每 6 小时自动复查，释放可注册时通知你」），行内无「去注册」；`zqx7hunt.com` 「首年 $11.08 ≈¥80」+「去注册」；`petlovo.ai`（无状态）`—` +「重新核验」（title「只重新核验 petlovo.ai」）（`02_…batch3.png`、`03_…recheck.png`）。✅ R546 P1-1 已修复。
3. **批量去注册（3）** = 可注册数（getzalize/wexlorbit/zqx7hunt），title「只打开可注册域名的注册商页面；已注册 / 未知状态不计入」；点击 → 3 个 popup 均为 `porkbun.com/checkout/search`，无 google.com（`net_a1.json`），全部关闭未购买。✅
4. **重新核验 petlovo.ai** → 恰 1× `POST /api/check?refresh=1` body `{"domains":["petlovo.ai"],"refresh":true}`；**开监控 google.com** → `POST /api/monitor {"domain":"google.com","enabled":true,"status":"taken",…}`，CTA 变「监控中 ✓」链接 → `/monitors` 列出 google.com → 删除（`enabled:false`）→ CTA 回「开监控」（`04_shortlist_google_monitoring_link.png`、`net_a2.json`）。✅
5. **375 px /shortlist** zh/en dark 卡片：google.com `—` + 「开监控/Monitor」44 px，zqx7hunt「去注册/Register」（`08_shortlist_375_zh_dark_cards.png`、`08_shortlist_375_en_dark_cards.png`）。✅
6. **分享 `X2fS7m5wSI`**（5 项：1 unknown + 3 available + 1 taken）：浏览器 google.com `—` 无 Register，可注册行价格+Register，「复制 3 个可注册」剪贴板 3 行无 google.com（`share_copy_clipboard.txt`）；SSR zh 「5 个候选域名 | DomainHunter」`lang=zh-CN`/`zh_CN`，en “5 domain candidates | DomainHunter” `lang=en`/`en_US`，水合 title 相同（`05_…png`、`07_…png`）。✅（brief 预期 4 项，实际候选清单基线 3 + 2 新增 = 5，为测试数据差异非缺陷）
7. **结果页键盘**：选中 google.com 行 Enter → 0 popup；可注册行 Enter → 1 popup（需真实用户激活，合成键盘事件 `window.open` 返回 null 属浏览器策略）（`09_results_enter_on_taken_no_popup.png`、`net_keyboard*.json`）。✅

## B. R550 分享标题 + 四篇 ccTLD verdict（version 27672324）

8. 撤销分享：UI 删除→确认 → 卡片消失（`10_…png`）；`/s/X2fS7m5wSI` zh curl 410 + noindex + 「分享已撤销 | DomainHunter」+ `zh-CN`/`zh_CN`，水合 title 同 zh（R546 P3 已修复，`11_…png`）；`?lang=en` 410 “This share has been revoked | DomainHunter” `en`/`en_US`（`12_…png`）；`/s/nope-r553` zh 404「分享不存在或已过期 | DomainHunter」、en “Share not found or expired | DomainHunter”，SSR==水合，noindex（`06_…png`、`13_…png`）。✅ **P3-1**：撤销 zh 水合后 `og:locale=en_US`。
9. `/vs/{uk,de,au,fr}-vs-com?lang=en`：verdict SSR（截至价格表）== DOM 4/4（去空白）；“recognition is irreplaceable” 0/4；首句 Nominet/DENIC/auDA/AFNIC 4/4；0 undefined/null/U+FFFD；共享片段 n=12 → 0（n=8 → 3，**P3-2**）（`14_vs_uk_com_en_nominet_verdict.png`、`ssr_vs_dom.json`、`vs_ngrams_4.json`）。✅

## C. R552 溢出 + 标题 + a11y（version 27672324）

10. 375×812 zh 16 个 R551 页 + `/tld/ke` `/vs/com-vs-org` `/vs/clinic-vs-care?lang=en`：19/19 `body.scrollWidth == documentElement.clientWidth == 375`，`main overflow-wrap=break-word`；/vs 价格表在 `overflow-x:auto` 容器内横滚，不撑宽页面（`sweep375.json`；`15–17_*_375_*.png` dark+light；1280 `18_*_1280_zh_dark.png` 段落正常）。✅
11. `/advanced` `/why` zh+en：curl `<title>` == 水合 `document.title` 4/4（「批量域名核验：粘贴名单一键实时查可注册 | DomainHunter」/ “Bulk domain check: paste a list, verify availability live | DomainHunter” / 「为什么选 DomainHunter：中文创业者的域名猎手 | DomainHunter」/ “Why DomainHunter: a domain hunter for Chinese founders | DomainHunter”）（`titles_advanced_why.json`）。✅
12. `/why` 表：`thead th[scope=col]` 5，首个 `.sr-only`「对比项」/“Capability”，tbody 8/8 行首格 `<th scope="row">`；Lighthouse desktop `/why` a11y 100，`td-has-header` score 1（`19_…png`、`20_…png`）。✅

## D. 常规零 AI 矩阵（version 27672324）

13. 控制台扫描 12 路由（`/ /advanced /shortlist /monitors /prices /mcp /why /tld /guide /vs /tld/nz /vs/clinic-vs-care`）：HTTP 200，0 真实错误 / pageerror / requestfailed / ai / csp-report POST；仅字体 preload 告警（**P3-3**）（`console_sweep.json`）。✅
14. 首页精确核验 `r553kwz`：`.cn` 关闭 → +1 `/api/search`（tlds 无 cn），「查更多后缀」+1（扩展 tlds）（`net_d14.json`、`22_home_more_tlds_expanded.png`）；`/advanced` 粘贴 3 个 → 1× `/api/search` `{"domains":[…]}`，「导出 CSV」→ 11 列表头 + 3 行（`advanced_export.csv`、`23_…png`）；MCP `tools/list` 3 工具、`check_domains`/`tld_prices`/`suggest_variants` 均 `isError:false`（`mcp_*.json`）；SSR/DOM `/tld/ke`（静态参考价 ¥360/¥360）与 `/vs/com-vs-org`（$11.08 / $7.98→$11.84）H1+价格卡一致（`ssr_dom_ke_comorg.json`）。✅ 监控 `r553mon.com`：**未执行**（P3-4，无添加入口），监控生命周期以 §4 google.com 覆盖。
15. Lighthouse：mobile `/` 100/100/100 perf 92 CLS 0；`/why` 100/100/100 perf 100；`/prices` 100/100/100 perf 92 CLS 0；`/tld/nz` 100/100/100 perf 90 CLS 0.00003；`/vs/clinic-vs-care` 100/100/100 perf 97 CLS 0；desktop `/why` 100/100/100 perf 100（a11y/seo/bp）。安全头 `/` HTML：HSTS `max-age=31536000; includeSubDomains`、nosniff、Referrer-Policy、XFO DENY、Permissions-Policy、CSP Report-Only（`headers_home.txt`）。✅
16. 清理：google.com / zqx7hunt.com 经 UI 移除，候选清单回 3；storage 还原字节一致（`dh:myShares:v1`、`shortlist:checkedAt` 删除，shortlist 恢复）；监控空（`24_home_restored_zh_dark_3rows.png`）。✅

## 17. R549 增量（version 8102cf2d，lead 中途追加）

17.1 `/vs/com-vs-io` `/vs/io-vs-ai` `/vs/com-vs-cn` zh+en（6 页，`r549/hydrated.json`、`r549_money.py` 输出）：
- SSR 可见正文（去 `<script>`）`{{` = **0**/6；水合 `main.innerText` `{{` = **0**/6；JSON-LD 3 段/页，`{{` = 0/18。
- 正文价格 == 同页表格（SSR == DOM，去表格后 main 文本逐字一致 6/6）：
  - com-vs-io zh「.io 首年 202 元、续费 373 元，.com 首年 80 元、续费 80 元」== 表 ¥202/¥373、¥80/¥80（**R546 P1-2 已修复**）；en “.io at ¥202 first year / ¥373 renewal versus .com at ¥80 / ¥80”。
  - io-vs-ai zh「.io 首年 202 元、续费 373 元，.ai 首年 595 元、续费 595 元」== 表；en 同。
  - com-vs-cn zh「首年 ≈33 元、续费 ≈38 元，明显低于 .com（首年 80 元、续费 80 元）」== 表 `.cn 参考价 ≈$5 ¥33 / ≈$5 ¥38`；en “≈¥33 first year / ≈¥38 renewal, well below .com's ¥80 / ¥80”。**.cn 无实时价侧带 `≈` 前缀，无 `—`** ✅。
  - 差额行 −$17.04/−$40.72/−$179.92（io−com）、≈+$6.08（com−cn）与表格数值自洽。
  - 截图 `r549_com-vs-io_{zh,en}_{verdict,table}.png`、`r549_com-vs-cn_{zh,en}_{verdict,table}.png`。
17.2 `/vs/{uk,de,au,fr}-vs-com?lang=en`：R550 改写段保留；“For a global audience, .com's recognition is irreplaceable” **0/4**；`{{` 0/4；价格已渲染为数字：uk “about $4 to register and $6/yr to renew”（表 $4.32/$5.66，四舍五入）、au “about $8/yr (¥57) flat”（表 $7.91）、fr “about ≈$9 to register (≈¥65) and ≈$10/yr to renew (≈¥72)”（静态参考价带 ≈ ✅）、**de “about $11/yr (¥80) with the same renewal” ≠ 表 $2.9/$4.07 → P1-1**；375 px 4/4 `body.scrollWidth = docSW = clientWidth = 375`（`r549_*_vs_com_en_375_price_sentence.png`、`r549_de_vs_com_en_prose_11usd_wrong_tld.png`、`r549_de_vs_com_en_table_de_2.90_4.07.png`、`r549_fr_vs_com_en_approx_prices.png`）。
17.3 全站补充扫描：sitemap 444 个 `/vs` × zh/en = 888 页 SSR，`{{` 0、undefined/NaN/null 0、U+FFFD 0（`r549/scan_all.json`；该扫描 UA 未被计为 bot，使 usage `pageviews.vs` +956，非 AI）。compares.ts 引用的 386 个占位 TLD 均有实时价或 types.ts 静态价 → 渲染函数的「—」兜底路径不会触发。
17.4 增量后清理：`?lang=en` 访问使 `domainhunter:lang` 漂移为 en，经页头「中」按钮还原；storage 再次 `byte-identical json: True`，zh/dark，候选清单 3，监控 `[]`（`25_home_restored_zh_dark_after_r549.png`）。

## 最终 usage 对照（≥60 s 静默后 17:16:01Z，8102cf2d）

| 字段 | 前（r552_usage_before） | 后 |
|---|---|---|
| searches / fast / refine | 0 / 0 / 0 | 0 / 0 / 0 |
| aiErrors | 不存在 | 不存在 |
| cspReports / cspSamples | 2 / 2 条 | 2 / 逐字相同 |
| bots | 21963 | 21999 |
| pageviews | home 120 · vs 353 · other 194 | home 136 · vs 1309 · other 225（均为本轮浏览/扫描） |
| cronLast / indexnowLast / indexnowLastAttempt / indexnowPending / lastResult | 1788696014544 / 1788436834369 / 1788696014544 / 970 / ok 200 submitted 300 (yandex fallback) | 逐字相同 |

非 AI 生产写入（浏览器钩子记录，`net_*.json`）：`POST /api/search` ×6（google、zqx7hunt、r553kwz ×3、advanced bulk ×1；键盘测试复用已有结果，0 次）、`POST /api/check?refresh=1` ×1、`POST /api/share` ×1（已撤销 410）、`POST /api/monitor` ×2（google.com 开/关）+ `/api/monitor/list` ×1、`POST /api/click` ×7（批量去注册 3 + 分享页/结果页注册商点击 4）、MCP 4 次。`/api/ai-search` 0 次。

## 附录：R554 修复复验（2026-09-06 17:32Z，version `7b7c18d1`，零 AI）

P1-1 已由 PR #518（R554）修复并部署。生产 SSR 可见文本（curl，非浏览器）：

- `/vs/de-vs-com?lang=en`：「Pricing doubles the case: about **$3 to register (¥21) and $4/yr to renew (¥29)** — honest pricing for a major ccTLD …」；同页价格表 .de **$2.9 / ¥21**（正文 USD 按 R549 约定取整）；「same renewal」已删；`{{` 0 处。
- `/vs/de-vs-com`（zh）：「注册约 $3（21 元）、续费约 $4/年（29 元）——大型 ccTLD 里的良心价」；`{{` 0 处。
- 顺带修复 `/vs/win-vs-vip` zh 「{{price:win}} vs {{price:win}}」→ 「$5 vs $6/年」（vip vs win）。
- 新增守门：`compare-price-placeholders.test.ts` +2（X vs Y 两侧不得同 TLD；de-vs-com 良心价句必须引用 .de、不得引用 .com），450 tests 全绿。

复验后结论：**P0 0 / P1 0 / P2 0 / P3 4**（P3-1～P3-4 不变，留下轮）。
