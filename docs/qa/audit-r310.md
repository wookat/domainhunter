# R310 · 零 AI 全站生产审计（R303–R308 之后全站）

- 日期：2026-08-09（UTC 14:20–15:10）
- 对象：https://hunt.zalize.com（deploy/r192-r195 tip 6b2ed60，Worker fdce465c）
- 预算纪律：**0 次 AI/DeepSeek 调用**——全程未触发 /api/ai-search、AI CTA、开始猎取/Start hunting、示例 prompt、refine/「再来一轮」任何入口；quick-check（精确核验 tab）/ bulk / MCP 全部走 RDAP/DNS 非 AI 通道
- 方法：真实 Chrome（CDP/Playwright）全站走查 + curl SSR 抽查 + Lighthouse CLI（移动，/tld、/prices best-practices 加测复测）+ MCP JSON-RPC 直连 + 375px 视口仿真
- console 全程 **0 JS/应用级 error**（仅故意场景的 resource 日志：404 路由验证的 404、share 撤销后的 410，均符合预期）
- 测试前备份 localStorage（3 个 key：lang/theme/shortlist），结束后逐键还原，re-dump 与备份 dict 相等 `STORAGE_IDENTICAL`

## 结论总览

| 级别 | 数量 | 摘要 |
|---|---|---|
| P0 | 0 | — |
| P1 | 0 | — |
| P2 | 0 | — |
| P3 | 2 | quick-check All 193 中 8 个 unknown chip（.icu/.lol/.fm/.best/.beauty/.help/.baby/.mom，RDAP/WHOIS 无解析类后缀，单 chip 重查机制正常、重查后仍 unknown，与 R297/R302 同类目非回归）；/tld 与 /prices 移动 Lighthouse best-practices 首测 96（inspector-issues CSP 噪声，复测均 100） |

## 硬约束核对：usage 零增量

- `usage-r310-pre.json`（14:21 UTC）与 `usage-r310-post.json`（15:05 UTC）经 JSON 解析后 **days 全表 dict 完全相等**（`DAYS_EQUAL: True`），全文件亦相等（`FULL_EQUAL: True`）。
- 两侧均为：`2026-08-09: searches 7, byTld {com:7,cn:7}, fast 6, refine 0, aiErrors {quota:4}`。
- 整场审计大量 quick-check（含 All 193 全量 ×2）/ bulk / MCP / share 调用下 usage 全表不动，即 **0 次 AI 调用的直接硬证明**。

## 1. 当前内容口径（全 pass，与任务书 192/188/222、sitemap 610 完全一致）

| 面 | 任务书预期 | 实测 |
|---|---|---|
| /tld hub | 192 | 192（SSR「192 个后缀」h1 + 去重 192 个 /tld/ 链接） `D-tld_hub_links.png` |
| /guide hub | 188 | 188（SSR「188 个行业」h1 + 去重 188 个 /guide/ 链接） `D-guide_hub_links.png` |
| /vs hub | 222 | 222（SSR「222 组」h1 + 去重 222 个 /vs/ 链接） `D-vs_hub_links.png` |
| llms.txt | 192/188/222 | 192/188/222（curl 计数） |
| sitemap.xml | 610 | 610 = 8 非内容页 + 192 tld + 188 guide + 222 vs，内部自洽 |
| quick-check All | 193 | 「查更多后缀 +…」→「共 193 个」= 192 tld + com.cn `B3-quickcheck-all.png` |
| 首页行业 chips | 10+「+178」 | 10 个行业 chips + 「+178」（10+178=188 与 guide 口径一致） `A1-home-zh.png` |
| /prices | 192 行 | zh/en 均 192 行（DOM `main a[href^="/?tld="]`） `C1-prices-zh.png` / `C2-prices-en.png` |
| content-counts.json | 192/188/222 | 与线上完全一致 |

- /prices CNY 抽查：live 行 `.top $1.63→¥12`、`.online $1.96→¥14 / $28.84→¥208`、`.site` 同口径，均等于 `Math.round(USD×7.2)`；静态行 `.click ≈$2 / ¥11`（内容源直写 CNY）。USD 基准与 MCP `tld_prices`（tldCount=192）相符。

## 2. content guard（deploy tip 6b2ed60 本地，全 pass）

- `node scripts/check-content-counts.mjs`：TLD 192 ✓ / 行业指南 188 ✓ / 对比页 222 ✓「全部通过」。
- `node scripts/gen-hub-index.mjs --check`：hub-index-*.ts 与内容源一致（tld 192 / guide 188 / vs 222）。

## 3. 重点复核近期变更

### R305 share 加固正常链路（全 pass）
- POST /api/share（2 域名）创建 → `/s/:id` 快照正常渲染（域名行 + 「复制 2 个可注册」+「导出 CSV」+ 首年价，`H1-share-live.png`）→ DELETE + revokeToken 撤销 200 `{ok:true}` → `GET /api/share/:id` **410** + UI「链接已失效」（`H2-share-revoked.png`）→ 未知 id API **404**。revoke token 用后即弃未落库。

### R306/R307 新 TLD 与 /vs 内容（全 pass）
- 六个新 TLD 页 /tld/golf|tennis|soccer|football|hockey|surf zh/en 全部 200、h1 正常、JSON-LD（BreadcrumbList+FAQPage）齐全（`ssr-r310.json`）。
- 六个新 /vs 页 golf-vs-club / tennis-vs-coach / soccer-vs-football / hockey-vs-team / surf-vs-fun / golf-vs-travel zh/en 全部 200、h1 正常、JSON-LD 3 段（BreadcrumbList+Article+FAQPage）。截图 `E1-tld-golf-zh.png`、`E2-vs-soccer-football-en.png`、`E4-vs-golf-travel-zh.png`。
- quick-check All 已含 6 个新 TLD（共 193），MCP `tld_prices` prices 全量 192 键。

### R308 onboarding 30d TTL 与 /guide zh 卡片 ≤42（全 pass）
- 引导 TTL 全状态机验证（`findings-r310b.json` onboarding_ttl_v2）：无 key → 显示；点「关闭引导」→ 写入毫秒时间戳、刷新后隐藏；时间戳改为 31 天前 → 再次显示且过期 key 被清除；旧格式 `"1"` → 隐藏并升级写入为时间戳。`M1-onboard-visible.png` / `M2-onboard-after-31d.png`
- /guide zh hub 卡片一行文案（含句号总可见长度）：188/188 张卡全测，**max=42、超限 0**。`D2b-guide-hub-zh.png`

## 4. quick-check（精确核验 tab，全 pass）

- 单名随机串：「核验完成：共 9 个，9 个可注册」。`B1-quickcheck-single.png`
- 两级后缀 `baidu.com.cn`：「共 10 个，0 个可注册」（baidu.com.cn 已注册）。`B2-quickcheck-baidu-com-cn.png`
- All 全量：「共 193 个，185 个可注册」= 192 tld + com.cn；未知 8（图例过滤「未知 8」可筛）。`B3-quickcheck-all.png`
- unknown 单域重试：8 个 unknown chip 各带「重新核验」按钮，点击仅该 chip 单独重查，重查后仍 unknown（RDAP 无解析类后缀，见 P3-1）。`B4-before/B4b-after-recheck.png`

## 5. MCP（JSON-RPC 直连，全 pass）

- `initialize`：protocolVersion 2025-03-26，serverInfo domainhunter 1.0.0。`mcp-r310-initialize.json`
- `tools/list`：check_domains / tld_prices / suggest_variants 三工具。`mcp-r310-tools-list.json`
- `tld_prices`：**tldCount=192**，prices 全量 192 键。`mcp-r310-prices.json`
- `check_domains`：google.com taken（2028-09-14）、baidu.com.cn taken（2029-02-15）、随机名 available。`mcp-r310-check.json`

## 6. 全站路由 zh/en、light/dark、375px、404、bulk（全 pass）

- 主要路由 /、/prices、/tld、/guide、/vs、/why、/shortlist（空态）、/monitors（空态）、/advanced 及新内容页 zh/en 全部 200、h1 正常（`ssr-r310.json` 全表）。
- light/dark：header 切 light 后 body bg `rgb(250,250,249)`、刷新持久、切回 dark `rgb(11,12,14)`。`I1-light-mode.png`
- 375px：/ `scrollWidth=375`、/prices、/tld、/vs/golf-vs-club 均 `360 ≤ 375` 无横向溢出。`K1–K4-375-*.png`
- SPA 404：未知顶层路径与未知 /tld、/guide、/vs slug 均 **HTTP 404 + 品牌 404 页**。`G1/G2-404-*.png`
- /advanced bulk（非 AI）：google.com Taken（2028-09-14 到期）+ 随机名可注册（1st yr $11.08），流式返回正常。`F5-advanced-bulk.png`
- PWA：`/site.webmanifest` 200（name/short_name/theme_color 齐全）；robots.txt Allow all + GPTBot/PerplexityBot/ClaudeBot 显式放行 + sitemap 指向正确。

## 7. SEO（全 pass）

- canonical：/、/prices、三 hub、/why 及全部新内容页自指正确；`?lang=en` 变体 canonical 带 lang 参数、`og:locale en_US`、`<html lang="en">`（zh 侧 zh_CN）；hreflang zh-CN/en/x-default 三元组齐全（`ssr-r310.json`）。
- JSON-LD：首页 2 段（WebSite+FAQPage）；guide/vs 内容页 3 段（BreadcrumbList+Article+FAQPage）；/tld/:slug 2 段；/prices 2 段，均可解析。

## 8. Lighthouse（移动，perf / a11y / best-practices / SEO）

| 页面 | 移动 |
|---|---|
| 首页 | **92** / 100 / 100 / 100 |
| /tld hub | **90** / 100 / 96* / 100（复测 100，见 P3-2） |
| /guide hub | **90** / 100 / 100 / 100 |
| /vs hub | **90** / 100 / 100 / 100 |
| /prices | **91** / 100 / 96* / 100（复测 100，见 P3-2） |

- 移动 perf 90–92 与 R302（90–94）同区间，内容扩容至 192/188/222 后无回落。报告存档：`lighthouse-r310/`。

## 问题清单

### P3-1 quick-check All 193 中 8 个 unknown chip，重查后仍 unknown
- .icu/.lol/.fm/.best/.beauty/.help/.baby/.mom，RDAP/WHOIS 无解析或超时类后缀，与 R297（6 个）/R302（8 个）同类目；Recheck 机制本身正常（仅该 chip 单独重查），非本轮回归引入。

### P3-2 /tld、/prices 移动 best-practices 首测 96
- 均由 inspector-issues（CSP report 噪声）触发，复测均 100，属单次波动非稳定回归（与 R302 P3-2 同类）。

## 附：取证文件

- `usage-r310-pre.json` / `usage-r310-post.json`（days dict 相等 `DAYS_EQUAL: True`、`FULL_EQUAL: True`）
- `storage-r310-backup.json` / `storage-r310-final.json`（逐键还原后 dict 相等 `STORAGE_IDENTICAL`）
- `ssr-r310.json`（全站 SSR canonical/hreflang/og:locale/JSON-LD/h1 抽查全表 + 404 状态）
- `mcp-r310-initialize.json` / `mcp-r310-tools-list.json` / `mcp-r310-prices.json` / `mcp-r310-check.json`
- `findings-r310.json` / `findings-r310b.json` / `findings-r310c.json`（浏览器走查断言全表）
- `screenshots-r310/`（33 份截图）
- `lighthouse-r310/`（7 份 Lighthouse JSON）
- `ssr_check_r310.py` / `audit_browser_r310*.py` / `dump_storage_r310.py` / `restore_storage_r310.py`（审计辅助脚本）
