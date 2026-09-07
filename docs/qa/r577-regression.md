# R577 生产零 AI 回归 — hunt.zalize.com（Worker 3bc9c841；R573 #534 + R574 #535/#536）

- 日期：2026-09-07 12:58–13:10 UTC
- 环境：生产 https://hunt.zalize.com，会话 Chrome（CDP + Playwright 请求/console 监听），`?cb=` 硬刷新；375×812（DPR2, mobile）与 1280 桌面；zh/en；深/浅色
- 约束执行：`/api/ai-search` 请求 **0 次**；未点任何 AI CTA/示例 chip/开始猎取/再来一轮；`/api/check` 共 4 次 UI 重新核验 + 1 次 curl + 1 次 MCP（≪ 200/h）；storage 字节级备份/还原；未创建监控/分享；无任何 token
- 结论：**P0/P1：0**；**P2：1**（375 下 /advanced 与结果页 DomainRow 到期信息不可见 + 重新核验触点宽 30px）；P3：2 条备注。R573/R574 桌面与 /monitors 全部验证通过。

## 版本证据（不是旧 04ae07fe / b58acfbb 缓存）

| 证据 | 值 |
|---|---|
| `curl -sI https://hunt.zalize.com/` | 无 version 头；改用 chunk hash |
| `?cb=` HTML 主 bundle | `/assets/index-FGNuJFLR.js`（R571 04ae07fe 为 `index-BCbqmQ_d.js`） |
| 运行时 `performance.getEntriesByType('resource')` | `domain-row-DNLN-WBF.js`（含 4× `hidden sm:inline` 重新核验文字）、`advanced-page-DtdW151A.js`（含 `finished` 进度单一状态源）、`monitors-page-DNQoBewd.js`（NotifyCard `sm:h-10`）、`home-page-BxZK5lsE.js`、`results-page-CxHm3dNV.js` |
| 本地 checkout | `5a0033d Merge PR #536 (r574 integ)` |

## 逐项验证

| # | 项 | 结果 | 证据 |
|---|---|---|---|
| A | R573 `POST /api/check {"domains":["example.com"]}` | ✅ 200 `application/x-ndjson`，`{"domain":"example.com","status":"taken","method":"rdap","expiresAt":"2027-08-13…","cached":true}` | `t6/check.h`, `t6/check.ndjson` |
| A | R573 MCP `tools/call check_domains {domains:[example.com]}` | ✅ 200 JSON-RPC result，`structuredContent.results[0].domain=example.com status=taken`，`isError:false` | `t6/mcp.h`, `t6/mcp.json` |
| A | 429 体 `{error:"rate_limited",scope:"check",limit:200,retryAfter,message}` + `Retry-After` | ⚪ 未打满（按要求），仅代码核对 `worker.ts checkRateLimited` | — |
| B1 | 首页 quick-check `/?q=google` 1280 zh/en：taken 行按钮 图标+「重新核验」/"Re-check" | ✅ 宽 79/85px（R570 图标态 31px），span display inline，aria-label/title=「重新核验 google.com（穿透缓存直查注册局，不调用 AI）」 | `t1-home-1280-zh-dark.png`, `t1-home-1280-en.png` |
| B1 | 首页 375 zh/en 深/浅：纯图标 44×44，aria-label/title 保留，scrollWidth==clientWidth | ✅ 44×44，375/375（浅色出现滚动条 360/360） | `t1-home-375-zh-dark.png`, `t1-home-375-zh-light.png` |
| B1 | `/?q=chaxiang` 1280：chaxiang.com/.cn/.net 行文字「重新核验」 | ✅ 3 行 w=79 | `t5-chaxiang-landing.png` |
| B1 | `/advanced` 粘贴 google.com/nic.cn/r577zz*.cn 1280 zh/en | ✅ google.com/nic.cn 按钮 78/84×32 文字可见；available 行无 data-recheck | `t2-advanced-1280-zh.png`, `t2-advanced-1280-en.png` |
| B1 | 结果页（合成 `dh:lastSearch:v1` 于 `/` 恢复 → 全部 4）1280 zh/en | ✅ taken google.com/nic.cn + unknown chaxiang.ai 均 78×32「重新核验」/"Re-check"；恢复 0 次 search/check | `t1-results-1280-zh.png`, `t1-results-1280-en.png` |
| B1 | `/advanced` 与结果页 375：纯图标 + aria/title + **≥44px 触点** | ❌ **30×44**（高 44、宽 30），span 已隐藏、aria/title 保留、无溢出 → 见 P2 | `t2-advanced-375-zh-rows.png`, `t1-results-375-zh.png` |
| B2 | `/advanced` 1280 zh/en：nic.cn（DNS-only）「到期日待查」/"expiry pending" chip | ✅ `i[data-expiry=unknown]` w=50/70，title「本次只拿到 DNS 占用结果，注册局 RDAP 未返回到期日；点右侧「重新核验」」；google.com 显示 `2028-09-14 到期` 且无 chip；available 行无 chip | 同上 |
| B2 | 结果页 1280 zh/en：同上 + unknown chaxiang.ai 行无 chip | ✅ | 同上 |
| B2 | `/advanced` 与结果页 375：chip 可见 | ❌ chip 宽 **0px**（`shrink truncate min-w-0` 被压没），google.com 的到期日同样 0px，域名截断为 `google…` → 见 P2 | 同上 |
| B3 | `/advanced` 20 域名（17 随机 .com + baidu/nic/google）zh | ✅ MutationObserver 19 帧：`核验中 0/20 → 3 → 4 … → 19/20`（spin=1）→ `已完成 20/20|valuenow 20/20|spin=0`；`核验中 20/20` **0 帧**；恰 1 `POST /api/search`；按钮「核验 20 个域名」 | `t3-progress-seq.json`, `t3-advanced-batch-done.png` |
| B3 | 同上 en | ✅ `Checking 0/20 → Done 20/20`（缓存命中，单 chunk 返回），0 帧 `Checking 20/20` | `t3-progress-seq-en.json` |
| B4 | `/monitors` 1280 zh/en 已配置只读：修改/清除/发送测试 | ✅ **40px**（R571 为 36） | `t4-1280-zh-configured.png` |
| B4 | 1280 修改态 input/保存/发送测试/取消；清除后未配置态 input/保存/发送测试 | ✅ 全部 40px；清除二步 → 未配置、key 删除；重新保存 → 已配置 | `t4-1280-zh-edit.png` |
| B4 | 375 zh（深+浅）/ en 三态（只读 修改/清除/发送测试；修改态 input/保存/发送测试/取消；未配置 input/保存/发送测试） | ✅ 全部 44px，无溢出（R571 守门未回归） | `t4-375-zh-dark-*.png`, `t4-375-zh-light-configured.png`, `t4-375-en-configured.png` |
| 矩阵 | 键盘：Tab 到首页/结果页重新核验、/monitors 修改，focus ring；Enter | ✅ `outline: auto 1px`；结果页 Enter → 1 次 `/api/check?refresh=1`；/monitors Enter → 修改态 | `t5-home-focus-ring.png`, `t5-results-focus-ring.png`, `t5-monitors-focus-edit.png` |
| 矩阵 | 375 深/浅 `/?q=google` `/advanced` `/monitors` 无横向溢出 | ✅ scrollWidth==clientWidth（375 或出现竖滚动条时 360） | 上述截图 |
| 矩阵 | 每次重新核验恰 1 次 `POST /api/check?refresh=1 {"domains":[d],"refresh":true}` | ✅ 4/4（google.com 首页点击、nic.cn /advanced 375 点击、nic.cn 结果页 Enter、chaxiang.com 首页点击），0 `/api/search` | `t1-t3-net.json`, `t1b-t3-net.json`, `t5-net.json` |
| 矩阵 | `/?q=chaxiang` 落地：精确核验 tab、恰 1 `POST /api/search`、0 ai、结果区滚入视口 | ✅ scrollY 729 | `t5-chaxiang-landing.png` |
| 矩阵 | console error（排除 404/410） | ✅ 0（全部脚本段） | `results.log` |
| C | usage `searches/fast/refine/aiErrors/llmProvider` 0 增量 | ✅ 见下 | `usage/` |
| 收尾 | monitor list / 分享残留 / storage | ✅ `{"entries":[],"monitored":2,"limit":500}` 同测前；无 share key；storage md5 一致 | `storage-final.json`, `t7-shortlist-final.png` |

## 问题分级

### P2-1 — 375px 下 /advanced 与结果页 DomainRow 已注册行：到期信息不可见、重新核验触点宽仅 30px（R574 B1/B2 在移动端未达）
- 现象（生产实测，zh/en 一致）：`[data-expiry=unknown]`「到期日待查」chip 和 google.com 的 `2028-09-14 到期` 在 375 宽下 `getBoundingClientRect().width === 0`；域名文本被截断为 `google…`（scrollWidth>clientWidth）；重新核验按钮 rect 30×44（高度 44 合规，宽 30 <44）。
- 位置：`apps/web/src/components/domain-row.tsx` DomainRow compact 行：`ExpiryNote`/`ExpiryUnknownChip` 带 `shrink truncate min-w-0`，行内空间被 状态 chip + 开监控 + 重新核验 + ★ 挤占后压至 0；`RecheckButton` compact 变体在 375 仅 `min-h-11`，无 `min-w-11`。
- 影响：R574 B2「到期日待查」在移动端 /advanced 与结果页对用户不可见（桌面正常）；B1「≥44px 触点」在这两处仅高度达标。首页 quick-check chip 不受影响（44×44）。
- 备注：`ExpiryNote` 的 `shrink truncate` 来自 `1a86cc5 fix(r166): keep taken domain name visible at 375px when expiry note + watch CTA present`，即 375 下牺牲到期日保域名是 r166 的有意取舍；R574 新增 chip（`min-w-0 shrink truncate`）继承同一压缩，而现在行内多了重新核验按钮后域名也被截断成 `google…`（r166 的初衷已不成立）。
- 建议：375 下让到期/chip 换行到第二行（`flex-wrap` / `basis-full`）或给 chip `shrink-0`，并为 RecheckButton compact 加 `min-w-11`。
- 证据：`docs/qa/screenshots/r577/t2-advanced-375-zh-rows.png`、`t1-results-375-zh.png`；`results.log` 13:05:10/13:05:15。

### P3-1 — usage `cspReports` 0 → 2（回归期间）
- 本轮 console 0 error，页面脚本均由 CDP `Runtime.evaluate` 注入（不受页面 CSP 约束），同期 bots 1006→1009，无法归因为本产品回归；建议看 Worker 日志里 2 条 CSP report 的 `blocked-uri`。

### P3-2 — en 批量进度序列仅 2 帧
- 第二次 20 域名（en）因结果全部命中缓存，进度直接 `Checking 0/20 → Done 20/20`，无中间帧；不是缺陷，但说明「不出现 20/20 核验中帧」的取证以 zh 首跑（19 帧）为准。

### 脚本口径误报（非产品问题，已复核）
- 首跑 `T2 /advanced 1280` FAIL：行选择器 `closest('li')` 爬到容器，把 nic.cn 的 chip 算到 google.com；改为按钮直接父级后 PASS（`t1b_results_t3.py`）。
- 首跑结果页用了 `/results` 路由（404）；结果页实际是 `/` + sessionStorage 恢复，修正后全部 PASS。
- 「theme restored dark」FAIL：dark 主题为 `documentElement.className==''` + `domainhunter:theme=dark`，断言找 `dark` 类名错误；实际已还原（最终 storage md5 一致）。

## usage 前后（`GET /api/usage?days=1`，no-cache，间隔 11 min）

| 字段 | before 12:58:38 | after 13:09:48 |
|---|---|---|
| searches / fast / refine | 0 / 0 / 0 | 0 / 0 / 0 |
| aiErrors / llmProvider / fallbacks | 无(0) | 无(0) |
| pageviews.home / other | 41 / 84 | 49 / 94（本轮流量） |
| bots / botsBy.ai | 1006 / 312 | 1009 / 315 |
| cspReports | 0 | 2（P3-1） |

## storage

| | md5 | 说明 |
|---|---|---|
| pre `storage-pre.json` | `90ae6846b289259ce2e6d2f88b835097` | 7 local keys（含 `domainhunter:monitor-webhook=https://httpbin.org/post`、theme=dark、lang=zh），0 session |
| final `storage-final.json`（最后一次页面访问 `/shortlist` 之后还原） | `90ae6846b289259ce2e6d2f88b835097` | `diff` 空；session {} |

## 产物
- 报告：`docs/qa/r577-regression.md`
- 截图：`docs/qa/screenshots/r577/`（23 张；全集 `/home/ubuntu/r577/prod/shots/` 33 张）
- 录屏：`/home/ubuntu/screencasts/r577/r577-edited.mp4`
- 原始数据：`/home/ubuntu/r577/prod/`（`results.log`、`t*-net.json`、`t3-progress-seq*.json`、`t6/`、`usage/`、`storage-*.json`、脚本 `t1_t3_rows.py` `t1b_results_t3.py` `t4_monitors.py` `t5_chaxiang.py` `t7_cleanup.py`）
- 未提交任何文件；未注册/购买域名；未触发 AI。
