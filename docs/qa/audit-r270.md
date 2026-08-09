# R270 · 零 AI 全站生产审计（R259 之后 R260–R267 全部新功能 + 全站回归）

- 日期：2026-08-09（UTC 03:30–05:00）
- 对象：https://hunt.zalize.com（deploy/r192-r195，Worker version ed51590d，基线 commit 04875ea）
- 预算纪律：**0 次 AI/DeepSeek 调用**——全程未触发 /api/ai-search、AI CTA、refine、one-more-round 中任何入口；quick-check / 变体 / Bulk check / MCP 均为 RDAP/DNS/WHOIS 非 AI 通道
- 生产 DeepSeek 当前为 402 quota 态：AI 错误分级 UX（R264/R267）按任务书**只做代码/SSR/静态层面核对**，未触发任何线上 AI 请求
- 方法：真实浏览器全站带注解录屏走查 + curl SSR 抽查 + CDP 设备仿真（375px）+ Lighthouse CLI（桌面+移动）+ MCP JSON-RPC 冒烟 + R262/R264/R267 diff 级代码复核
- console 全程 **0 JS/应用级 error**（各检查点均确认）
- 测试前备份 localStorage/sessionStorage，结束后**逐字节还原**（re-dump 与备份 diff 为空，见 `screenshots-r270/` 同目录取证文件说明）

## 结论总览

| 级别 | 数量 | 摘要 |
|---|---|---|
| P0 | 0 | — |
| P1 | 0 | — |
| P2 | 0 | — |
| P3 | 3 | /tld hub 移动 Lighthouse perf 73；`tld_prices` 元数据 `stale:true`/`tldCount:58` 与返回 150 条价格的语义歧义；shortlist 清空两步确认 ~3s 窗口偏短（可测性/体验记录） |

## 硬约束核对：usage 零增量（字节级证明）

- 审计前快照 `usage-r270-pre.json`（03:30 UTC）与审计后快照 `usage-r270-post.json` **md5 完全一致**（`ab214e89a14e485950b79f9f89f7d648`），`diff` 为空——字节级零增量。
- 两侧均为：`2026-08-09: searches 7, byTld {com:7,cn:7}, fast 6, refine 0, aiErrors {quota:4}`；2026-08-06/07/08 三天数据、`cronLast`、`indexnowLast` 均无变化。
- 代码核对（worker.ts:215）：`bumpUsage` 仅挂在 `/api/ai-search` 处理器内；`/api/search`（quick-check/变体/bulk/单域重试通道）**不计数**。因此整场审计大量 quick-check/bulk/MCP 调用下 usage 全表纹丝不动，本身即是 **0 次 AI 调用的直接硬证明**（比 R258 的「恰无噪声」更强）。

## 1. R262 新功能：unknown chip tooltip / 注册局保留 / 单域重试（passed）

- acme.com quick-check 正常出 chips。截图：`screenshots-r270/A1-quickcheck-acme.png`
- unknown chip 悬停 tooltip（title 属性）双语文案正确（zh「暂时无法确认：可能是注册局保留域、查询超时或 WHOIS 无响应…」/ en 对应）。代码路径：`home-page.tsx` `home.quickUnknownTip`。
- **注册局保留检测**：nic.com.cn → chip 显示「注册局保留」/Reserved，tooltip 为 reserved 专属文案，**无重试按钮**（符合设计：reserved 不可重试）。截图：`A3-reserved-nic-com-cn.png`、`A3-reserved-chip-zoom.png`。注：nic.cn 实测返回 taken（非 reserved），非缺陷。
- **单域重试**：unknown 非 reserved chip 右侧 RotateCw 重试按钮，点击仅该 chip 进入 checking 并单独重查（复用 `/api/search` 显式域名清单通道，不影响其余 chips）。375px 下触控目标 **44×44px**。截图：`A4-unknown-chips-retry-buttons.png`、`A4-after-retry-unknown2.png`、`C10-375px-unknown-retry-44px.png`
- com.cn 两级域直输：acme.com.cn 直接核验正常。截图：`A5-comcn-two-level.png`

## 2. R264/R267 AI 错误分级 UX（代码/静态层核对，0 AI 触发，passed）

- `ai.ts classifyAiError`：401/402/403→quota、429→rate-limit、5xx/坏 JSON→upstream、Timeout/Abort/TypeError→network；仅透出类别短码，不含 key/上游响应体。
- `App.tsx`：error 事件按 errorKind 映射五档双语文案（`error.ai.quota/rateLimit/upstream/network` + 兜底 `error.ai`）；**quota 态不渲染「重试本轮」按钮**（`errorKind !== "quota"` 门禁）。
- R267：`quotaExhausted` 下抑制全部 AI 入口——results 页 one-more-round（按钮 + 空格快捷键同步经 `moreBlocked` 门禁）、home quick-check 的 AI CTA（disabled + title 提示）、understanding-bar refine。i18n 键 `results.moreQuota` 存在于 zh/en。
- `/api/usage` `aiErrors` 分类计数已在生产生效（当日 `aiErrors.quota: 4`，与 402 事故一致）。
- 生产行为已由 R264/R267 各自验收另行验证，本轮不重复触发。

## 3. 内容计数（passed，全部与任务书一致）

| 面 | 预期 | 实测 |
|---|---|---|
| /tld hub | 150 | 150（SSR title「150 个后缀」+ hub 渲染 150 条）`B1-tld-hub-150.png` |
| /guide hub | 140 | 140 `B2-guide-hub-140.png` |
| /vs hub | 168 | 168 `B3-vs-hub-168.png` |
| /prices | 150 行 | 150（150 个 /tld/ 链接）`B4-prices-150.png` |
| llms.txt | 150/140/168 | /tld/ 150、/guide/ 140、/vs/ 168 条（curl 计数） |
| sitemap.xml | 466 | 466 `<url>`（curl 计数） |
| quick-check「All」更多后缀 | 151 | 151 个 TLD（tld-list.ts 151 项，与渲染一致） |

## 4. 常规全站回归（passed）

- **/advanced**：批量核验 + CSV 导出含 expires_at 列且 taken 行有值。截图：`C1-advanced-bulk.png`、`C1-csv-downloaded.png`
- **/shortlist**：加入、备注保存回显、排序（降序）、CSV 含 note/expiry；刷新后持久；测后清空（badge 2→0）。截图：`C2-shortlist-note.png`、`C2-shortlist-sort-desc.png`、`C2-shortlist-csv.png`、`C2-shortlist-cleared.png`
- **/monitors**：经 shortlist 开关加入监控、「立即刷新」更新最后检查时间、两步确认停止（配额 3/500→2/500→空态）。截图：`monitors-added.png`、`monitors-refreshed.png`、`monitors-confirm-step.png`、`monitors-stopped.png`、`monitors-empty.png`
- **分享链路**：创建 /s/:id → 快照渲染 → 撤销 → `GET /api/share/:id` **410**、未知 id **404**；测后已清理。截图：`C4-share-created.png`、`C4-share-snapshot.png`、`C4-share-revoked-410.png`
- **MCP**：GET /mcp 文档页 200；三工具 JSON-RPC 均通过——`check_domains`（taken 含 expiresAt/expiringSoon）、`tld_prices` 返回 **150 条价格**、`suggest_variants`（8 变体含状态与价格）。截图：`C5-mcp-docs.png`
- **404**：未知顶层路径与未知 /tld、/guide、/vs slug 均 **HTTP 404 + 品牌 404 页**。截图：`C6-404-branded.png`
- **SEO**：/tld/ai、/vs/com-vs-cn 的 canonical/OG/JSON-LD 在 zh（og:locale zh_CN）与 en（?lang=en，en_US，en canonical）均正确。
- **双语/主题**：zh↔en 切换刷新持久；light/dark 主题刷新持久。截图：`C8-zh-persist-reload.png`、`C8-theme-dark-persist.png`、`C8-theme-light-persist.png`
- **键盘可达**：Tab 焦点环可见、Enter 激活（主题切换实测）。截图：`C9-tab-focus-ring.png`、`C9-enter-activates-theme.png`
- **375px**：scrollWidth=375 无横向溢出；重试按钮 44×44。截图：`C10-375px-no-overflow.png`

## 5. Lighthouse（perf / a11y / best-practices / SEO）

| 页面 | 桌面 | 移动 |
|---|---|---|
| 首页 | 100 / 100 / 100 / 100 | 92 / 100 / 100 / 100 |
| /tld hub | 96 / 100 / 100 / 100 | **73** / 100 / 100 / 100 |
| /prices | 100 / 100 / 100 / 100 | 89 / 100 / 100 / 100 |

报告存档：`lighthouse-r270/`（6 份 report.json）。

## 问题清单

### P3-1 /tld hub 移动 perf 73
- 150 条目全量渲染后移动端性能为全站最低（R258 时 /tld/directory 移动 90，当时 132 条）。建议：hub 列表虚拟化或分类分段懒渲染；下轮扩容前处理。

### P3-2 `tld_prices` 元数据语义歧义
- MCP `tld_prices` 返回 150 条价格，但响应元数据 `stale: true`、`tldCount: 58`——stale 兜底 key（worker.ts PRICES_STALE_KEY）保存的是上次成功拉取的 live 集（58 个），其余走静态参考价补齐到 150。功能正确，但 `tldCount` 与实际条数不一致易误读，建议改名 livePriceCount 或补文档。

### P3-3 shortlist 清空两步确认窗口 ~3s
- 单次点击间隔 >3s 会静默复位，看起来像按钮无响应（monitors 的 6s 窗口体验更好）。建议统一为 6s + 倒计时提示。

## 观察（不计缺陷）

- 内容面自 R258 扩容：TLD 132→150、guide 128→140、vs 156→168、sitemap 424→466、quick-check All 集 151，全部与任务书预期一致。
- usage 计数澄清：`bumpUsage` 仅挂 `/api/ai-search`，非 AI 通道不计数——R258 报告中「共享计数器噪声」担忧对纯零 AI 审计不适用，前后全表字节一致即为 0 AI 硬证明。
- nic.cn 实测 taken 而非 reserved（CNNIC WHOIS 对 nic.cn 返回注册记录）；reserved 检测以 nic.com.cn 为有效 fixture。
- 状态还原：shortlist 清空、monitor 停止、分享撤销（410）、localStorage/sessionStorage 逐字节还原通过。
