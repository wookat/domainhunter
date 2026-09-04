# R302 · 零 AI 全站生产审计（R297–R300 之后全站）

- 日期：2026-08-09（UTC 12:05–12:35）
- 对象：https://hunt.zalize.com（deploy/r192-r195 tip 5f2392c，Worker version 2a7c2dfe）
- 预算纪律：**0 次 AI/DeepSeek 调用**（DeepSeek 402 欠费中）——全程未触发 /api/ai-search、AI CTA、开始猎取/Start hunting、示例 prompt、refine/「再来一轮」任何入口；quick-check（精确核验 tab）/ bulk / MCP 全部走 RDAP/DNS 非 AI 通道
- 方法：真实 Chrome（CDP/Playwright）全站走查 + curl SSR 抽查 + Lighthouse CLI（桌面+移动，/tld 移动加测至 3 次）+ MCP JSON-RPC 直连三工具 + 375px 视口仿真
- console 全程 **0 JS/应用级 error**（仅两类故意场景的 resource 日志：验证 404 路由的 404、验证 share 撤销后的 410，均符合预期）
- 测试前备份 localStorage（3 个 key：lang/theme/shortlist），结束后逐键还原（唯一漂移为 ?lang=en 走查引起的 `domainhunter:lang` en→zh 已回写，re-dump 与备份 dict 相等 `STORAGE_IDENTICAL`）

## 结论总览

| 级别 | 数量 | 摘要 |
|---|---|---|
| P0 | 0 | — |
| P1 | 0 | — |
| P2 | 0 | — |
| P3 | 2 | quick-check All 181 中 8 个 unknown chip（RDAP/WHOIS 无解析类后缀，Recheck 单 chip 重查机制正常、重查后仍 unknown）；/tld hub 移动 Lighthouse best-practices 单次 96（CSP inspector-issue 噪声，复测 2 次均 100） |

## 硬约束核对：usage 零增量

- `usage-r302-pre.json`（12:05 UTC）与 `usage-r302-post.json`（12:33 UTC）经 JSON 解析后 days 全表 **dict 完全相等**（`DAYS_EQUAL: True`），其余字段亦无 diff。
- 两侧均为：`2026-08-09: searches 7, byTld {com:7,cn:7}, fast 6, refine 0, aiErrors {quota:4}`；08-06/07/08 三天无变化。
- 整场审计大量 quick-check（含 All 181 全量）/ bulk / MCP / share 调用下 usage 全表不动，即 **0 次 AI 调用的直接硬证明**。

## 1. 当前内容口径（全 pass，与任务书完全一致）

| 面 | 任务书预期 | 实测 |
|---|---|---|
| /tld hub | 180 | 180（SSR「180 个后缀」h1 + 去重 180 个 /tld/ 链接） `D1-tld-hub-en.png` |
| /guide hub | 182 | 182（SSR「182 个行业」h1 + 去重 182 个 /guide/ 链接） `D2-guide-hub-en.png` |
| /vs hub | 210 | 210（SSR「210 组」h1 + 去重 210 个 /vs/ 链接） `D3-vs-hub-en.png` |
| llms.txt | 180/182/210 | 180/182/210（curl 计数） |
| sitemap.xml | 580 | 580 = 8 非内容页 + 180 tld + 182 guide + 210 vs，内部自洽 |
| quick-check All | 181 | 9 基础 chips + 「查更多后缀 +172」→「共 181 个」（180 tld + com.cn） `B3-quickcheck-all.png` |
| 首页行业 chips | 10+「+172」 | 10 个行业 chips + 「+172」（10+172=182 与 guide 口径一致） `A1-home-zh.png` |
| /prices | 180 行 | 180 行（DOM 实测 `main a[href^="/?tld="]` = 180） `C1-prices-zh.png` |
| content-counts.json | 180/182/210 | 与线上完全一致 |

- /prices CNY 抽查：静态行 `.click ≈$2 / ¥11`（内容源直写 CNY，无 USD 往返伪差）；live 行 `.top $1.63→¥12`、`.online $1.96→¥14 / $28.84→¥208` 均等于 `Math.round(USD×7.2)`，USD 基准与 MCP `tld_prices`（tldCount=180）相符。

## 2. content guard（deploy tip 5f2392c 本地，全 pass）

- `node scripts/check-content-counts.mjs`：TLD 180 ✓ / 行业指南 182 ✓ / 对比页 210 ✓「全部通过」。
- `node scripts/gen-hub-index.mjs --check`：hub-index-*.ts 与内容源一致（tld 180 / guide 182 / vs 210）。

## 3. 全站路由 zh/en、light/dark、375px（全 pass）

- 主要路由 /、/prices、/tld、/guide、/vs、/why、/shortlist（空态）、/monitors（空态）、/advanced 及新内容页抽查（R298 相关 /tld/family、R299 /vs/dog-vs-pet、/vs/gifts-vs-shop、/vs/family-vs-com、/vs/baby-vs-store、/vs/mom-vs-me、/vs/dad-vs-blog、R300 /guide/petgrooming、/guide/babystore、/guide/giftcustom、/guide/housekeeping、/guide/kidsplayground、/guide/kidsphoto）zh/en 全部 200、h1 正常渲染（`ssr-r302.json` 全表）。
- light/dark：header「Toggle light/dark」切 light 后 body bg `rgb(250,250,249)`、刷新持久、切回 dark `rgb(11,12,14)`。`I1-light-en.png`
- 375px：/、/prices、/tld、/vs/gifts-vs-shop `scrollWidth = 360 ≤ 375` 无横向溢出。`K1–K4-375-*.png`
- SPA 404：未知顶层路径与未知 /tld、/guide、/vs slug 均 **HTTP 404 + 品牌 404 页**。`G1/G2-404-*.png`
- 分享链路：POST /api/share（items 2 域名）创建 → /s/:id 快照渲染（`H1-share-live.png`，含 Copy available/Export CSV）→ DELETE revokeToken 撤销 `{ok:true}` → `GET /api/share/:id` **410 revoked** + UI「This link is no longer active」（`H2-share-revoked.png`）→ 未知 id API 404。revoke token 未落任何仓库文件（用后即弃）。
- /advanced bulk（非 AI）：google.com 已注册（2028-09-14 到期）+ 随机名 qzxvkw9r302c.com 可注册，流式返回正常。`F5-advanced-bulk.png`

## 4. quick-check（精确核验 tab，全 pass）

- 单名随机串 qzxvkw9r302：「核验完成：共 9 个，9 个可注册」，9 chips 全可注册（.com/.cn/.io/.ai/.app/.dev/.co/.net/.me）。`B1-quickcheck-single.png`
- 两级后缀 `baidu.com.cn`：直接核验「共 10 个，0 个可注册」，baidu.com.cn 已注册 2029-02-15 到期（另带出 baidu.com 2028-10-11、baidu.cn 2029-03-17）。`B2-quickcheck-baidu-com-cn.png`
- All 全量：「查更多后缀 +172」→「共 181 个，173 个可注册」= tld-list 180 + com.cn，可注册 173 / unknown 8。`B3-quickcheck-all.png`
- unknown 单域重试：unknown chip 带重查按钮（8 个），点击仅该 chip 单独重查，重查后仍 unknown（RDAP 无解析类后缀，见 P3-1）。`B4-before/B4b-after-recheck.png`

## 5. MCP 三工具（JSON-RPC 直连，全 pass）

- `tools/list` 返回 check_domains / tld_prices / suggest_variants 三工具 schema。`mcp-r302-tools-list.json`
- `tld_prices`：**tldCount=180**，prices 全量 180 键。`mcp-r302-prices.json`
- `check_domains`：google.com taken（2028-09-14）、baidu.com.cn taken（2029-02-15）、随机名 available。`mcp-r302-check.json`
- `suggest_variants`：acme/com limit 8 → 恰 8 个 results（含实时可用性与首年价，如 getacmelabs.com $11.08）。`mcp-r302-variants.json`

## 6. SEO（全 pass）

- canonical：/、/prices、三 hub、/why、/advanced 及全部新内容页抽查自指正确；`?lang=en` 变体 canonical 带 lang 参数、`og:locale en_US`、`<html lang="en">`（zh 侧 zh_CN）；hreflang zh-CN/en/x-default 三元组齐全（`ssr-r302.json`）。
- JSON-LD：首页 2 段（WebSite+SearchAction / FAQPage）；guide/vs 内容页 3 段（BreadcrumbList+Article+FAQPage）；/tld/:slug 2 段；/prices 2 段，均可解析。
- sitemap.xml 580 条与站点结构一致；robots.txt Allow all + GPTBot/PerplexityBot/ClaudeBot 显式放行 + sitemap 指向正确；OG 各页正常。
- /shortlist、/monitors 为无 hreflang/JSON-LD 的工具页（与 R297 相同口径，非回归）。

## 7. Lighthouse（perf / a11y / best-practices / SEO）

| 页面 | 桌面 | 移动 |
|---|---|---|
| 首页 | 100 / 100 / 100 / 100 | **94** / 100 / 100 / 100 |
| /prices | 100 / 100 / 100 / 100 | **91** / 100 / 100 / 100 |
| /tld hub | 100 / 100 / 100 / 100 | **90** / 100 / 96* / 100（复测 ×2 均 100，见 P3-2） |
| /guide hub | 100 / 100 / 100 / 100 | **90** / 100 / 100 / 100 |
| /vs hub | 100 / 100 / 100 / 100 | **91** / 100 / 100 / 100 |
| /guide/kidsphoto（内容页） | 100 / 100 / 100 / 100 | **91** / 100 / 100 / 100 |

- 桌面 6 页全 100×4；移动 perf 90–94 与 R297（90–92）同区间，内容扩容至 180/182/210 后无回落。报告存档：`lighthouse-r302/`（14 份 report.json）。

## 问题清单

### P3-1 quick-check All 181 中 8 个 unknown chip，重查后仍 unknown
- RDAP/WHOIS 无解析或超时类后缀，与 R297 的 6 个同类目（本轮 180 后缀基数更大）；Recheck 机制本身正常（仅该 chip 单独重查），非本轮回归引入。

### P3-2 /tld hub 移动 best-practices 单次 96
- 首测 96 由 inspector-issues（CSP report 噪声）触发，随后复测 2 次均 100，属单次波动非稳定回归。

## 附：取证文件

- `usage-r302-pre.json` / `usage-r302-post.json`（days dict 相等 `DAYS_EQUAL: True`）
- `storage-r302-backup.json` / `storage-r302-final.json`（逐键还原后 dict 相等 `STORAGE_IDENTICAL`）
- `ssr-r302.json`（全站 SSR canonical/hreflang/og:locale/JSON-LD/h1 抽查全表）
- `mcp-r302-tools-list.json` / `mcp-r302-prices.json` / `mcp-r302-check.json` / `mcp-r302-variants.json`
- `screenshots-r302/`（33 份截图 + quick-check 文本取证 JSON）
- `lighthouse-r302/`（14 份 Lighthouse JSON）
- `dump_storage_r302.py` / `restore_storage_r302.py`（storage 备份/还原辅助脚本）
