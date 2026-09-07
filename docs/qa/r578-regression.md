# R578 生产零 AI 回归报告（PR #537 — taken DomainRow 375px 到期/开监控/重新核验 换第二行）

- 生产：https://hunt.zalize.com ，Worker version `ffc80794-fb94-4be2-99f7-def57db75801`
- 代码：PR #537 `3ac36dc`（merge `47901c9`），本地 checkout 已同步
- 执行时间：2026-09-07 13:21–13:27 UTC；执行方式：会话 Chrome（CDP :29229 + Playwright 请求/console 侦听，375×812 / 1280 emulation，`?cb=` 硬刷新）
- 结论：**P0/P1：0；P2：0** — R577 报告的 P2（375 下 /advanced 与结果页 taken 行到期日/「到期日待查」0px、域名截成 `google…`、重新核验 30×44）已在生产验证修复。P3 观察 1 项（非本 PR 范围）。
- 零 AI / 收尾：`/api/ai-search` 0 次；`/api/check` 3 次（nic.cn 375 点击、google.com Enter、chaxiang.com 点击，各恰 1 次）；`/api/search` 4 次（/advanced 批量 1、`/?q=google` 1、`/?q=chaxiang` 1、结果页恢复 0 + T3）；usage searches/fast/refine 0→0；storage 字节级还原 md5 一致；无监控/分享残留；产物中无 token。

## 1. 版本确认（verified）

| 项 | 结果 |
|---|---|
| `?cb=` HTML 引用主包 | `/assets/index-CagSZ6RN.js`（R574 为 `index-FGNuJFLR.js`，未命中旧缓存） |
| 运行时 `performance.getEntriesByType('resource')` | `domain-row-CoU3EI_k.js`（R574 为 `domain-row-DNLN-WBF.js`）、`advanced-page-cLz3qmkR.js`、`results-page-B-zv4Apu.js`、`home-page-DHyWe2bT.js` |
| chunk 内容 | 含 `data-taken-meta`、`order-last basis-full gap-3 pl-11 sm:contents`、`h-11 min-w-11 sm:h-8 sm:min-w-0` |

## 2. T1 — 375px /advanced 与结果页 taken 行（R577 P2 复验）

数据源：/advanced 粘贴 `google.com nic.cn r578zz<ts>.cn` 核验（恰 1 次 `POST /api/search`）；结果页 = `/` + sessionStorage `dh:lastSearch:v1` 合成（google.com taken+expiresAt、nic.cn taken 无 expiresAt、chaxiang.ai unknown、可注册行），恢复时 0 次 search/check/ai 请求。

矩阵：/advanced × {zh 深, zh 浅, en 浅}，结果页 × {zh 深, zh 浅, en 浅}。所有组合 getBoundingClientRect 数值一致（下表为 zh 深 /advanced；en 见括注）：

| 行 | 域名 span | 到期文本 / chip | 重新核验 | 开监控 h | 收藏 | meta 第二行 | 行高 | scrollWidth/clientWidth |
|---|---|---|---|---|---|---|---|---|
| google.com | w=90，`scrollWidth<=clientWidth`（不截断，完整 `google.com`） | 「2028-09-14 到期」w=86（en「expires 2028-09-14」w=108），不截断 | **44×44** | 44 | 44×44 | meta top 628 > 域名 bottom（top 595+22）；meta 内容 left 77 == 域名 left 77（`padding-left:44px`，`display:flex`） | 100 | 375/375（en 360/360，竖滚动条 15px，非溢出） |
| nic.cn | w=64，完整 `nic.cn` | `i[data-expiry=unknown]`「到期日待查」w=50（en「expiry pending」w=70），不截断 | **44×44** | 44 | 44×44 | meta top 729 > 域名 bottom；内容 left 77 == 域名 left 77 | 101 | 375/375 |

对比 R577（同页同宽）：到期文本/chip 0px → 86/50px；`google…` → `google.com`；重新核验 30×44 → 44×44。

- 375 zh 深 点击 nic.cn 重新核验 → 恰 1 次 `POST /api/check?refresh=1 {"domains":["nic.cn"],"refresh":true}`，0 `/api/search`；核验后行尺寸不变（re-measure 相同）。
- 主题切换后恢复 dark（`domainhunter:theme=dark`）。
- **verified**。截图：`screenshots/r578/t1-advanced-375-zh-dark.png`、`t1-advanced-375-zh-light.png`、`t1-advanced-375-en-light.png`、`t1-results-375-zh-dark.png`、`t1-results-375-zh-light.png`、`t1-results-375-en-light.png`。

## 3. T2 — 1280px /advanced 与结果页 不回归

| 项 | /advanced | 结果页 |
|---|---|---|
| taken 行容器高 | 48 | 48 |
| `[data-taken-meta]` computed display | `contents` | `contents` |
| DOM 顺序 | google：exp → watch → recheck → fav；nic：chip → watch → recheck → fav | 同 |
| 单行（到期/开监控/重新核验/收藏 垂直中心） | 全部 922（google）/971（nic），Δ=0 | 全部 964 / 1012，Δ=0 |
| 重新核验文字 | 「重新核验」可见 78×32 | 78×32 |
| available / unknown 行 `[data-expiry=unknown]` | r578zz…cn 0 | chaxiang.ai 0、r577zz…cn 0 |

备注：到期文本 rect.top 比按钮 top 低 8–9px 是文字行框 vs 32px 按钮的正常差异（中心对齐一致），首轮脚本按 top 比较产生的 FAIL 为口径误报，已用中心重测确认。**verified**。截图：`t2-advanced-1280-zh.png`、`t2-results-1280-zh.png`。

## 4. T3 — 首页 quick-check chip 抽查

- `/?q=google` 恰 1 次 `POST /api/search`；1280：`[data-recheck=google.com]` 文字「重新核验」可见，79×28；375：文字隐藏、**44×44**，scrollWidth/clientWidth 375/375。与 R577 一致。**verified**。截图：`t3-home-375-zh.png`。
- `/?q=chaxiang` 1280：chaxiang.com/.cn/.net 重新核验 文字可见 w=79。

## 5. T4 — 结果页 compact 密度（1280）

点 `[data-density-option=compact]` → `[data-density=compact]`；google.com / nic.cn 行高 **26**，meta 与域名 top 差 2（单行，meta display flex），重新核验 h=**24**（h-6），顺序 exp/chip → watch → recheck → fav 不变。**verified**。截图：`t4-results-1280-compact.png`。密度 key 由最终 storage 还原。

## 6. T5 — 键盘（结果页 1280 zh）

- Tab 序列（google.com 行内）：开监控（aria「开启监控：每 6 小时…」）→ 重新核验（aria「重新核验 google.com」）→ 收藏（aria「收藏到候选清单」）→ 下一行 开监控；每个 `outline` 非 none（focus ring）。域名/到期为不可聚焦文本（设计如此）。
- 在 重新核验 上 Enter → 恰 1 次 `POST /api/check?refresh=1 {"domains":["google.com"],"refresh":true}`，0 `/api/search`。**verified**。截图：`t5-results-focus-recheck.png`。

## 7. T6 — 常规守门

| 项 | 结果 |
|---|---|
| `/?q=chaxiang&cb=` | 恰 1 次 `POST /api/search`，0 `/api/ai-search`；精确核验 tab 选中，结果在视口（scrollY 729）；重新核验 chaxiang.com → 恰 1 次 `/api/check?refresh=1` |
| `/api/ai-search` 全程 | 0 |
| console error（排除 404/410） | 0（所有脚本段） |
| usage `GET /api/usage?days=1` 13:21:01 → 13:26:40（339s） | searches 0→0、fast 0→0、refine 0→0、cspReports 2→2、aiErrors/llmProvider 无；pageviews home 49→56、other 94→98；bots 1013→1021 |
| 监控/分享 | `POST /api/monitor/list` → `{"entries":[],"monitored":2,"limit":500}`（与测前相同）；localStorage 无 share key；未创建监控/分享 |
| storage 还原（最后一次页面访问 /shortlist 后） | `storage-pre.json` md5 `90ae6846b289259ce2e6d2f88b835097` == `storage-final.json` md5 `90ae6846b289259ce2e6d2f88b835097`；json diff 空；7 local / 0 session |
| token 泄露 | `/home/ubuntu/r578/prod` grep webhook/uuid 0 命中 |

## 8. 问题分级

- **P0 / P1 / P2：无。** R577 P2 已修复。
- **P3（观察，非本 PR 范围）**：结果页 375 en 下 unknown 行（chaxiang.ai）域名截成 `c…`、原因文本 `Reg…`（zh 为 `cha…`），与 R577 时相同（unknown 行不在 R578 taken 行改动范围内，未改）。若要一并处理，可让 unknown 行沿用同样的 `data-taken-meta` 换行策略。见 `t1-results-375-en-light.png` 第三行。
- 口径误报（非产品缺陷，已重测确认）：首轮脚本 (a) 1280 以 rect.top 比较到期文本与按钮（应比中心）；(b) 375 以 meta 包装 padding-box left（33）比域名 left（77），应比 `pl-11` 后的内容 left（77）。

## 9. 未验证 / 未覆盖

- 未刻意触发 `/api/check` 429。
- reserved 行（生产无样本）。
- Results 页 compact 密度仅抽查 1280（<768 无该开关，设计如此）。

## 10. 产物

- 截图：`docs/qa/screenshots/r578/`（14 张，见上文各节）
- 录屏：`/home/ubuntu/screencasts/r578/r578-edited.mp4`
- 原始数据：`/home/ubuntu/r578/prod/`（`results.log`、`t1-t5-net.json`、`t6-net.json`、`usage/before-132101.json`、`usage/after-132640.json`、`storage-pre.json`、`storage-final.json`、`plan-r578.md`、脚本 `t1_t5.py` / `t1b_remeasure.py` / `t6_chaxiang.py` / `t7_cleanup.py`）
- R577 产物（`docs/qa/r577-regression.md`、`docs/qa/screenshots/r577/`）未改动。仅写文件，未提交。
