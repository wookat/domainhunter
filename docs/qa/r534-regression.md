# R534 — R530–R533 零 AI 生产回归报告（hunt.zalize.com）

- 生产 Worker version：`d4f1336a`；仓库 `deploy/r192-r195 @ 57d119c`；生产 bundle `assets/index-3Rc-CwXE.js` == 本地 `apps/web/dist/assets/index-3Rc-CwXE.js`
- 执行方式：会话 Chrome（1600 桌面 + CDP 375×812 仿真，录屏）+ curl / Playwright(CDP) / Lighthouse CLI / MCP JSON-RPC
- 硬约束：**0 次 AI 调用**、不注册不付款、storage 字节级还原 —— 全部满足（见 §9）
- 录屏：`/home/ubuntu/screencasts/r534-prod-regression/r534-prod-regression-edited.mp4`
- 结论：**9 项全部通过；P0/P1/P2 = 0；P3 观察 3 条**（均非本批引入）。唯一"未按原计划执行"的是 Lighthouse 导航模式无法审计 404 文档（工具限制），改用 flow snapshot 模式补测（§8）。

## 0. 基线
| 项 | 值 |
|---|---|
| usage_before（2026-09-06） | searches 0 · fast 0 · refine 0 · aiErrors 缺失 · cspReports 缺失 · cspSamples `[]` |
| /api/prices | fetchedAt 1788674449621，351 TLD；com 11.08/11.08，io 28.12/51.8，dev 8.75/12.87，my 2.37/26.06；cn/uy/ar 无实时价（静态） |
| storage_before | local 7 键（favorites/lang/monitor/monitor-webhook/recent-searches/shortlist/theme），session 空；theme dark，lang zh，shortlist 3 行 |
| 首页响应头 | `strict-transport-security: max-age=31536000; includeSubDomains` · `x-content-type-options: nosniff` · `referrer-policy: strict-origin-when-cross-origin` · `x-frame-options: DENY` · `permissions-policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()` · `content-security-policy-report-only: … script-src 'self' 'nonce-…' … report-uri /api/csp-report`；HTML 内 3 个可执行内联 `<script>` 均带同一 nonce（JSON-LD 按设计不加） |

## 1. R531 选型卡 SSR == 水合 DOM ——【通过】
脚本 `ssr_vs_dom.py`（curl SSR + Playwright 水合后同选择器）：
```
/vs/io-vs-dev?lang=zh  picks equal   /vs/io-vs-dev?lang=en  picks equal
/vs/com-vs-cn?lang=en  picks equal   /vs/com-vs-cn?lang=zh  picks equal
/vs/uy-vs-ar?lang=zh   picks equal   /vs/uy-vs-ar?lang=en   picks equal
/tld/cn?lang=zh card equal  /tld/com?lang=zh card equal  /guide/saas?lang=en cards equal
FAILS: 0 | ai-search/csp-report requests: []
```
- `.io`：`Porkbun 实时价：首年 $28.12（≈¥202）· 续费 $51.8/年（汇率 7.2 估算）`；`.dev` `$8.75 … $12.87`；`.com` `$11.08` —— 与 `/api/prices` 一致（KV 快照，非旧静态文案）
- 静态 TLD：`.cn` `Static reference: ≈$5 (¥33) 1st yr · ¥38/yr renewal · not a live quote` / zh「静态参考价…非实时报价」；`.uy` `.ar` 同类措辞，两侧一致
- 浏览器（录屏）`/vs/io-vs-dev?lang=zh` 首屏即显示实时价，无闪变。截图 `00_vs_io_dev_top_zh_dark.png`、`01_vs_io_dev_pick_cards_zh_dark.png`、`01b_vs_io_dev_pick_cards_zoom.png`

## 2. R532 双语 404 ——【通过】
壳（`nf_shell.sh`，8 次加载 = 4 路由 × zh/en）：全部 HTTP 404；`<title>` 「页面不存在 | DomainHunter」/ “Page not found | DomainHunter”；`<html lang="zh-CN">`/`"en"`；`<meta name="robots" content="noindex" />`；无 canonical；`Accept: application/json` 访问 `/does-not-exist` 仍返回 4.9 KB 壳（404）；`/api/nope`、`/nope.png` 0 字节。
水合（`nf_titles.py`）：8/8 `document.title` == SSR title，`h1` == title 前半段，UI 含 `404`、「回到首页」、4 个入口 chip；pageerror 0（每页 1 条预期 `Failed to load resource … 404` 网络行，按 SKILL 剔除）。
浏览器（录屏）：`/does-not-exist` zh → 点 EN → 标题 “Page not found | DomainHunter”、h1/chips 英文 → 点 中 还原。截图 `02_404_zh_dark.png`、`03_404_en_dark.png`、`11_404_375_zh.png`

## 3. R533 CSP Report-Only 真实浏览零误报 ——【通过】
- 录屏内 DevTools Console：首页 → 精确核验 `r534kwz9` 结果页 → `/shortlist` 全程 **0 条消息**，无 `[Report Only]`。Issues 面板仅 1 条预存 a11y 提示「A form field element should have an id or name attribute」（非 CSP，P3）。截图 `04_home_quickcheck_devtools_console_empty.png`、`04b_home_devtools_issues_tab.png`、`05_shortlist_4_rows_console_empty.png`
- 自动化 `console_sweep.py`（13 页：/、/?lang=en、/vs/io-vs-dev、/vs/com-vs-cn?lang=en、/vs/uy-vs-ar、/tld/cn、/guide/saas?lang=en、/shortlist、/does-not-exist、/tld/does-not-exist?lang=en、/prices、/mcp、/s/nope-r534）：real_err 0、CSP 控制台消息 0、pageerror 0、requestfailed 0、`/api/ai-search` 0、浏览器发出的 `POST /api/csp-report` **0**（404/410 页各 1–2 条预期资源 404/410 行）。
- usage_after `cspSamples` 只有我 §4 合成的 2 条，无浏览器产生的样本。

## 4. R533 `POST /api/csp-report` ——【通过】
| 请求 | 结果 |
|---|---|
| 合法 `application/csp-report`（script-src, blocked `https://evil.example/x.js?token=1`, 含 document-uri/user-agent） | **204**，`cache-control: no-store` |
| 17,109 B（Content-Length） | **413** |
| 同体 `Transfer-Encoding: chunked` | **413** |
| 18,108 B 多字节 UTF-8 chunked | **413** |
| 16,378 B 合法 JSON（font-src, `https://edge.example/f.woff2`，低于上限） | **204** |
| 垃圾体 | 204（不计数） |
| `GET /api/csp-report` | 404 |

≥60 s 后 `/api/usage`：`days["2026-09-06"].cspReports` 缺失 → **2**（= 上面两次 204 的合法报告；三次 413 未计数）；`cspSamples`：
```
[{"directive":"script-src","blockedUri":"https://evil.example/x.js","count":1,"firstAt":1788693304250,"lastAt":1788693304250},
 {"directive":"font-src","blockedUri":"https://edge.example/f.woff2","count":1,"firstAt":1788693304754,"lastAt":1788693304754}]
```
无 document-uri、无 UA、无 IP，query `?token=1` 已剥离。**注意：此 +2 计数 / 2 条样本为本次测试有意写入，无法回滚。** 备注：原计划"恰好 16,384 B"边界体实际 16,378 B（低于上限 6 B），属"低于上限"而非精确边界测试。

## 5. 分享生命周期 ——【通过】（所有测试分享已撤销）
1. 首页「精确核验」`r534kwz9` Enter（仅 `POST /api/search`）→ 9 个后缀均可注册 → 星标 `.com` → 候选清单 4
2. `/shortlist` 「生成分享链接」→ `https://hunt.zalize.com/s/yqE6IceKuj`，行「分享链接（30 天有效）」+「我的分享链接」卡（4 个域名）；curl 壳 **200** `<title>4 个候选域名 | DomainHunter</title>`（petlovo.ai 无 status → 中性标题，符合 R509 语义），无 noindex；`/api/share/yqE6IceKuj` 200，items status = [None, available, available, available]；浏览器渲染 4 行、3 个「可注册」徽标、「复制 3 个可注册」
3. 卡「删除」→「确认删除？」（一批点击）→ 行 + 卡消失；`GET /api/share/yqE6IceKuj` **410**；壳 **410** + `<meta name="robots" content="noindex" />` + 「分享已撤销 | DomainHunter」；浏览器 SPA 显示「链接已失效：分享者已删除这份清单」；`/s/nope-r534` 壳 **404** + noindex + 「分享不存在或已过期 | DomainHunter」，SPA「分享链接不存在或已过期（快照保留 30 天）」
4. 「移除」`r534kwz9.com` → 3 行；storage 还原见 §9

截图 `06_shortlist_share_created.png`、`07_share_live_zh.png`、`08_shortlist_share_revoked_card_gone.png`、`09_share_revoked_spa.png`、`10_share_notfound_spa.png`、`15b_shortlist_restored_3_rows.png`

## 6. 375 px ——【通过】
| 页 | scrollWidth | 触达 |
|---|---|---|
| `/does-not-exist` | 375 | main 内 5 个 `<a>` 全部 ≥44 px（`linksUnder44: []`） |
| `/vs/io-vs-dev?lang=zh` | 375 | `.tap-target`（面包屑 首页/后缀对比、选型卡 .io/.dev）元素本体 20/28 px，但 `::before` 热区 44 px；`elementFromPoint` 在中心 ±21 px 均命中该链接 |
| `/` | 375 | — |
| `/prices` | 375 | 表内 TLD 链接同为 `.tap-target`，热区 44 px 命中验证通过（前 12 个） |
| `/shortlist` | 375 | — |
截图 `11_404_375_zh.png`、`12_vs_io_dev_375.png`、`13_home_375.png`、`14_prices_375.png`、`15_shortlist_375.png`

## 7. MCP ——【通过】
- `GET /mcp`（Mozilla UA）200 HTML；`tools/list` → `check_domains`, `tld_prices`, `suggest_variants`
- `tld_prices {"tlds":["io","dev"]}` ×1 → io 28.12/51.8、dev 8.75/12.87，`isError:false`
- `check_domains ["r534kwz9.com"]` ×1 → `status:"available"`，`isError:false`
- `/mcp` JSON 响应头：`x-content-type-options: nosniff`、`referrer-policy` 存在，**无** CSP 头（非 HTML 规则）

## 8. Lighthouse 桌面（seo, best-practices, accessibility）——【通过 / 404 以 snapshot 补测】
| 页 | a11y | BP | SEO | 备注 |
|---|---|---|---|---|
| `/` | 100 | 100 | 100 | 失败审计 0 |
| `/vs/io-vs-dev` | 100 | 100 | 100 | 失败审计 0 |
| `/does-not-exist`（导航模式） | — | — | — | `ERRORED_DOCUMENT_REQUEST (Status code: 404)`：Lighthouse 拒绝审计 404 文档，工具限制 |
| `/does-not-exist`（flow **snapshot** 模式，页面渲染后） | 100 | 100 | 100 | 失败审计 0（snapshot 审计集较小，仅作记录） |
`csp-xss` 审计（informative，不影响分数）原文：`No CSP found in enforcement mode` (High) —— 与预期一致：Report-Only 不算强制模式。其他 informative：`has-hsts` “No `preload` directive found” (Medium)；`origin-isolation` “No COOP header found” (High)；`trusted-types-xss` “No `Content-Security-Policy` header with Trusted Types directive found” (High)。R528 基线 SEO/a11y 100 → 本轮 100，无回归。文件 `lh_.json`、`lh_vs_io-vs-dev.json`、`lh_does-not-exist.json`、`lh_404_snapshot.json`

## 9. 收尾：usage 对照 / storage 还原 ——【通过】
最后一次操作后等待 65 s 取样（`usage_before.json` → `usage_after.json`，2026-09-06）：
| 字段 | 前 | 后 | Δ |
|---|---|---|---|
| searches | 0 | 0 | **0** |
| fast | 0 | 0 | **0** |
| refine | 0 | 0 | **0** |
| aiErrors | 缺失 | 缺失 | **0** |
| byTld | `{}` | `{}` | — |
| cspReports | 缺失 | 2 | +2（§4 有意写入） |
| cspSamples | `[]` | 2 条合成样本 | +2（§4） |
| pageviews | home 23 / results 3 / tld 137 / guide 41 / vs 112 / prices 12 / other 25 | 31 / 5 / 142 / 44 / 131 / 15 / 31 | 我的浏览 |
| bots | 11887 | 11895 | +8 |
IndexNow（原值，前后完全相同）：`cronLast=1788674438989`，`indexnowLastAttempt=1788674438989`，`indexnowLast=1788436834369`，`indexnowPending=1270`，`indexnowLastResult={"at":1788674438989,"ok":false,"status":429,"message":"Too many requests","submitted":0,"retries":2}`，`indexnowLastError` 同 429；`pricesLastOk=1788674449394`，`pricesLastFail=1786471293486`。
本轮非 AI 生产写入：1× `POST /api/search`、1× `POST /api/share`（已撤销 410）、2× 合法 `POST /api/csp-report`、3× 413 的 csp-report、1× MCP `tld_prices`、1× MCP `check_domains`。
Storage：还原时移除多出的 `dh:myShares:v1`，`local identical: True | session identical: True | byte-identical json: True`；theme dark，lang zh；首页 候选清单 3。截图 `16_home_restored_zh_dark_3rows.png`

## 10. 问题清单
- **P0 / P1 / P2：无**
- P3-1（预存，非本批）：首页 AI 文本框缺 `id/name`，DevTools Issues 提示「A form field element should have an id or name attribute」
- P3-2（观察，工具限制）：Lighthouse 导航模式无法给 404 文档打分；如需长期跟踪 404 页 a11y/SEO 需用 flow snapshot（脚本 `lh_snapshot_404.mjs`）
- P3-3（设计选择，供参考）：Lighthouse `csp-xss` 仍报 “No CSP found in enforcement mode”，因为策略为 Report-Only；`has-hsts` 缺 `preload`、无 COOP —— 均为 informative，不扣分

## 11. 产物
- 录屏：`/home/ubuntu/screencasts/r534-prod-regression/r534-prod-regression-edited.mp4`
- 截图目录 `/home/ubuntu/r534/`：`00_vs_io_dev_top_zh_dark.png` `01_vs_io_dev_pick_cards_zh_dark.png` `01b_vs_io_dev_pick_cards_zoom.png` `02_404_zh_dark.png` `03_404_en_dark.png` `04_home_quickcheck_devtools_console_empty.png` `04b_home_devtools_issues_tab.png` `05_shortlist_4_rows_console_empty.png` `06_shortlist_share_created.png` `07_share_live_zh.png` `08_shortlist_share_revoked_card_gone.png` `09_share_revoked_spa.png` `10_share_notfound_spa.png` `11_404_375_zh.png` `12_vs_io_dev_375.png` `13_home_375.png` `14_prices_375.png` `15_shortlist_375.png` `15b_shortlist_restored_3_rows.png` `16_home_restored_zh_dark_3rows.png`
- 数据：`usage_before.json` `usage_after.json` `api_prices_before.json` `storage_before.json` `storage_after.json` `headers_home.txt` `home.html` `ssr_vs_dom.json` `nf__*.html` `shell_live.html` `shell_revoked.html` `shell_nf.html` `api_share_live.json` `console_sweep.json` `csp_valid.json` `csp_16384.json` `csp_17k.json` `csp_mb.json` `mcp_tools.txt` `mcp_prices.txt` `mcp_check.txt` `mcp_hdr.txt` `lh_.json` `lh_vs_io-vs-dev.json` `lh_does-not-exist.json` `lh_404_snapshot.json`
- 脚本：`ssr_vs_dom.py` `nf_shell.sh` `nf_titles.py` `console_sweep.py` `m375.py` `tap_hit.py` `lh_snapshot_404.mjs` `test_plan.md`
