# R580 生产零 AI 回归报告（PR #540 · Worker d1a09764）

- 生产：https://hunt.zalize.com ，Worker version `d1a09764-be46-4192-be59-6457badc82e4`
- 资产核对（`?cb=` 硬刷新 + `performance.getEntriesByType('resource')`）：`index-DgpS4AK6.js`、`domain-row-DKgIfEtw.js`（含 `data-unknown-meta`、`order-last flex basis-full gap-2 pl-10 sm:contents`、`h-11 w-11 sm:w-8`、`min-w-[44px] justify-center px-3`）、`advanced-page-CrJF2U2t.js`、`home-page-CIzU3LXV.js`、`results-page-UGy01XF8.js`；未加载 R574/R578 旧 chunk。
- 方法：会话 Chrome（CDP :29229 + Playwright 请求/console 采集），375×812 移动仿真与 1280 桌面，zh/en，深/浅；全程 test mode、录屏 + annotations。
- 硬约束：`/api/ai-search` 请求 **0 次**；`/api/check` 共 1 次（375 unknown 重新核验）；`/api/search` 3 次（/advanced ×2、`/?q=chaxiang` ×1）；未注册/购买域名；未点任何 AI CTA；未提交代码。
- 时间：2026-09-07 13:51 – 14:01 UTC（usage 基线 13:51:34 → 复核 14:00:4x，间隔 >60s）。

## 结论
**P0 / P1 / P2：0。** R580 的两项改动在生产全部验证通过：
1. 非 compact unknown 行 375px：原因文本 + 重新核验 换到第二行（`display:flex`、`padding-left:40px`，内容与域名左对齐），重新核验 44×44，收藏留在首行，行高 100（两行，无三行）；1280 不回归（48px 单行、`data-unknown-meta` display:contents、重新核验 32px 且 order-last 落行尾）。
2. <sm 44px 触点：首页 quick-check chip 收藏/开监控/重新核验 均 44×44（R575 P3-2 原 39–40）；header 批量核验入口 375 为 44×44 纯图标，1280 恢复图标+「批量核验」文字。

P3 观察 2 条（见下），均为本 PR 设计内/既有行为，不阻塞。

## 逐项验证

### T1 /advanced 375 unknown 行（live 样本）— 已验证
- live unknown 样本：`chaxiang.ai` 生产返回 **available**（首年 $82.7），不能作 unknown；改用动态 `.de` 域名 `r580zz89430.de`（.de 不在 IANA RDAP bootstrap，`/api/check` 返回 `status:"unknown", method:"none", detail:"no-rdap-server"`，可重试），原因文案 zh「该后缀暂无 RDAP/WHOIS 通道」/ en "No RDAP/WHOIS channel for this suffix yet"。粘贴 4 个域名 → 恰 1 次 `POST /api/search`。
- 375 zh 深 / zh 浅 / en 浅（数值一致处只列一次）：
  - `[data-unknown-reason]` w=217（zh 深）/202（zh 浅、en）>0、可见；`[data-unknown-meta]` `display:flex`、`padding-left:40px`，meta top 729 > 域名 bottom 707（第二行），meta 内容 left 73 == 域名 left 73。
  - `[data-recheck]` **44×44**，与原因同一行（cy 751）。
  - 收藏按钮 44×44，cy 707 == 域名 cy（首行）。
  - 行高 **100**（两行），未出现三行；`scrollWidth==clientWidth`（zh 深 375/375；zh 浅/en 360/360 = 竖滚动条，与 R578 相同）。
  - 域名首行截断实况：zh 深 w=153 完整；zh 浅 w=138 完整；**en 浅 w=111 截断为 `r580zz89430…`**（`Unknown` badge 比「未知」宽），`title` 为全名 — 符合 PR 描述「首行内截断（省略号，title 全名）」，不再是 R578 的 `c…`。
- 点击 `r580zz89430.de` 重新核验 → 恰 1 次 `POST /api/check?refresh=1 {"domains":["r580zz89430.de"],"refresh":true}`，0 `/api/search`。
- 截图：`screenshots/r580/t1-advanced-375-zh-dark.png`、`t1-advanced-375-zh-light.png`、`t1-advanced-375-en-light.png`、`t1-advanced-375-en-after-recheck.png`。

### T1 /advanced 375 taken 行（R578 守门）— 已验证
- google.com：域名 w=152/137/139 完整；`2028-09-14 到期` 86 / `expires 2028-09-14` 108；meta 第二行（top 628 > 域名 bottom）、内容 left 77 == 域名 left 77；重新核验 44×44、开监控 h44、收藏 44×44；行高 100。
- nic.cn：「到期日待查」50 / `expiry pending` 70；同上 44px 触点；行高 101。zh/en × 深/浅 一致。

### T2 /advanced 1280 zh — 已验证（重跑）
- 4 行（available chaxiang.ai / taken google.com、nic.cn / unknown r580zz89537.de）容器均 **48px**。
- unknown：`[data-unknown-meta]` `display:contents`；原因 w=168 与域名垂直中心同一行（cy 1113==1113）；重新核验 78×32、文字「重新核验」可见、`rect.right` 1264 为行内最右（order-last，收藏 right 1174）。
- taken：顺序 到期/待查 → 开监控 → 重新核验 → 收藏，垂直中心 Δ0，开监控/重新核验 h32，「重新核验」文字可见。available 行、unknown 行 0 个 `data-expiry=unknown` chip。`scrollWidth==clientWidth`。
- 截图：`t2-advanced-1280-zh.png`。
- 说明：首次 1280 测量因 CDP 仿真未复位（仍 375）而 FAIL，属测试工具问题，已用显式 `Emulation.clearDeviceMetricsOverride`（innerWidth 1600）重跑通过。

### T3 结果页 — 已验证
- 真实 `/?q=chaxiang&cb=` 375：恰 1 次 `POST /api/search`、0 `/api/ai-search`；「精确核验」tab 选中；quick-check 面板 chaxiang.com/.cn/.net 等 taken chip 的 收藏/开监控/重新核验 全部 **44×44**；本次 chaxiang.* 无 unknown 行（live unknown 断言由 /advanced 与合成结果页覆盖）；`scrollWidth==clientWidth` 375/375。截图 `t3-chaxiang-375-zh.png`。
- 合成结果页（`/` + sessionStorage `dh:lastSearch:v1`，含 chaxiang.ai unknown `http-429`）：
  - 375 zh 深 / en 浅：unknown 原因「注册局限流，稍后重试」217 / "Registry rate-limited — retry shortly" 202 可见、第二行 pl-40 对齐、重新核验 44×44、收藏首行、行高 100、域名 `chaxiang.ai` 完整（w 153/111）；taken 行与 /advanced 数值一致。
  - 1280 zh：4 行 48px；unknown meta contents、原因行内、重新核验 78×32 最右；taken 顺序/32px 不变。
  - 截图 `t3-results-375-zh-dark.png`、`t3-results-375-en-light.png`、`t3-results-1280-zh.png`。

### T4 首页 — 已验证
- `/?q=google` 375：taken chip 收藏 44×44、开监控 44×44、`[data-recheck=google.com]` 44×44；header `button[aria-label=批量核验]` **44×44**、文字 span 隐藏；`scrollWidth==clientWidth`。截图 `t4-home-375-google-chip.png`、`t4-home-375-header.png`。
- `/?q=r580zz89430` 375：available chip 收藏按钮全部 44×44（R575 P3-2 原 39–40）。截图 `t4-home-375-available-chip.png`。
- 1280：header 入口显示图标+「批量核验」，实测 **102×36**（`sm:h-9 sm:min-w-0`）。用户预期「约 144×44」与实现不符，但该 ≥sm 尺寸未被 #540 改动（仅新增 `h-11 min-w-11 … sm:h-9 sm:min-w-0` 的 <sm 分支），记为口径说明而非回归。截图 `t4-home-1280-header.png`。

### T5 守门 — 已验证
- `/api/ai-search`：0（所有段）。console error（排除 404/410）：0。
- usage `GET /api/usage?days=1`（no-cache）13:51:34 → 14:00:4x：`searches 0→0`、`fast 0→0`、`refine 0→0`、`cspReports 2→2`、`aiErrors/llmProvider` 不存在；`pageviews.home +7`、`other +6`、`bots +2`。
- 清理：`POST /api/monitor/list` → `{"entries":[],"monitored":2,"limit":500}`（== 测前）；localStorage 无 share 键；未创建监控/分享；日志/网络转储中无 webhook/token。
- storage：最后一次页面访问后还原，`storage-final.json` md5 `90ae6846b289259ce2e6d2f88b835097` == `storage-pre.json`，dict/JSON diff 空，sessionStorage `{}`；主题还原 dark、语言 zh。
- R577/R578 产物未改动。

## 未验证
- 键盘 Tab/Enter 顺序、compact 密度：本轮需求未列，未重测（R578 已验证，且 #540 未改 compact 分支与 tab 顺序）。
- reserved 类 unknown（不可重试）：生产无样本。
- `/api/check` 429 体：按要求未打满。

## P0–P3
| 级别 | 项 | 说明 |
|---|---|---|
| P0/P1/P2 | 无 | — |
| P3 | en 375 unknown 第二行原因文本截断 | "No RDAP/WHOIS channel for this suffix yet" 在 202px 内以省略号截断（zh 完整）；结果页 429 文案 "Registry rate-limited — retry shortly" 恰好放得下。可考虑 `title`/允许两行或缩短 en 文案。见 `t1-advanced-375-en-light.png`。 |
| P3 | en 375 unknown 域名首行截断 | 14 字符 `r580zz89430.de` 在 en 下截为 `r580zz89430…`（zh 完整），`title` 全名 — 属 PR 设计（首行截断优于收藏挤到第三行），仅记录实况。 |
| 口径说明 | 1280 header 批量核验 102×36 | 非 44 高，来自既有 `sm:h-9`，#540 未改。 |
| 工具误报 | 首页 375 "overflow 元素" | 溢出评估器捕获的是 TLD 条 `+`（自定义 TLD）按钮 right 380 > 375，其父容器为 `overflow-x-auto no-scrollbar` 横向滚动条（scrollWidth 354 / clientWidth 315，c26593f 既有），`document.scrollWidth==clientWidth`，非页面横向溢出。 |

## 产物
- 报告：`docs/qa/r580-regression.md`
- 截图（14）：`docs/qa/screenshots/r580/`
- 录屏：`/home/ubuntu/screencasts/r580/r580-edited.mp4`
- 原始数据：`/home/ubuntu/r580/prod/`（`results.log`、`t1-t4-net.json`、`t2b-t3-net.json`、`usage/before-135134.json`、`usage/after-*.json`、`storage-pre.json`、`storage-final.json`、`plan-r580.md`、脚本 `setup.py`/`t1_t4.py`/`t2b_t3.py`/`t4b_plus.py`/`t5_cleanup.py`）
