# R571 聚焦零 AI 生产复验报告 — hunt.zalize.com Worker 04ae07fe（PR #532 fbbad79 / 751f2c4）

**范围**：R570 P2（375px `/monitors` 通知方式 webhook 输入框高 34px）修复复验 + R564 精确核验冒烟 + 清理/还原核对。
**方法**：会话 Chrome CDP :29229 + Playwright（`page.on('request')` 全程计数）、CDP 375×812 / 1280 视口模拟、`?cb=` 硬刷新；storage 备份→字节级还原；usage 前后对照；未点任何 AI CTA / 示例 chip / 开始猎取；未注册/购买域名；未发送 webhook 测试（配置值使用备份中已有的 `https://httpbin.org/post`，不涉及任何 token）。

## 版本确认
- 生产 `/monitors?cb=` HTML → `/assets/index-BCbqmQ_d.js`，页面 chunk `monitors-page-uL86bf_5.js`（浏览器 performance 资源列表实测）。
- 该 chunk 含 `h-11 min-h-11 w-full min-w-0 font-mono text-xs sm:h-10 sm:min-h-0 sm:flex-1`；CSS `index-Enl61yQp.css` 含 `.min-h-11{min-height:2.75rem}` `.sm\:flex-1` `.sm\:min-h-0`。
- 本地 `git show 751f2c4` diff：仅 `monitors-page.tsx` 一行 className + 守门测试，与线上一致。

## 结果（P0–P3：**0 项**）

| T | 项目 | 结论 | 证据 |
|---|---|---|---|
| T1a | 375 zh 未配置态：`#monitor-webhook-input` 高 **44**（R570: 34）、保存 44、发送测试 44、docW 375/375 | 验证过 PASS | `shots/t1-375-zh-unconfigured.png`, `results.log` |
| T1b | 375 zh 配置态：Enter 保存 → 「已配置」、展示 `https://httpbin.org/post`（rest ≤8 字符按 maskWebhook 规则不遮蔽）、修改 44、清除 44、localStorage 已写 | 验证过 PASS | `shots/t1-375-zh-configured.png` |
| T1c | 375 zh 修改态：input 44、保存 44、发送测试 44、**取消 44（R570 未测）**、docW ≤375 | 验证过 PASS | `shots/t1-375-zh-edit.png` |
| T1d | Escape 退出修改回只读；「清除」二步确认 → 未配置、key 删除 | 验证过 PASS | `shots/t1-375-zh-clear-confirm.png` |
| T1e | 375 en 三态同上：input 44；Save/Send test/Cancel/Edit/Remove 均 44；Not configured/Configured 文案 | 验证过 PASS | `shots/t1-375-en-{unconfigured,configured,edit}.png` |
| T2 | 1280 修改态：input **40**、保存/发送测试/取消 **40**（与 R570 桌面一致） | 验证过 PASS | `shots/t2-1280-zh-edit.png` |
| T2' | 1280 已配置只读态：修改/清除/发送测试 36px | 观察（非回归） | 代码 `sm:h-9` 既有设计，R571 diff 未触及；我的断言口径写成 40 故脚本记 FAIL |
| T3 | `/?q=chaxiang`：精确核验 tab `aria-pressed=true`、恰 1 `POST /api/search`、0 `/api/ai-search`、`[data-quick-check]` 在视口 | 验证过 PASS | `shots/t3-chaxiang-landing.png`, `t3-net.json` |
| T3b | taken 行 chaxiang.com/.cn/.net：已注册 · 到期日 · ★ · 开监控 · 重新核验(图标) · 无去注册 | 验证过 PASS（截图） | `shots/t3-after-recheck.png`；脚本按文字找「重新核验」记 FAIL，原因是按钮为纯图标（R570 P3 已知），非回归 |
| T3c | 点 chaxiang.com 重新核验 → 恰 1 `POST /api/check?refresh=1` body `{"domains":["chaxiang.com"],"refresh":true}`，0 `/api/search` | 验证过 PASS | `t3-net.json` |
| T4 | `/shortlist`：无 `dh:myShares*` key、UI 无 `/s/` 链接；`/monitors`：`domainhunter:monitor=[]`、webhook 未配置；`POST /api/monitor/list` → `{"entries":[],"monitored":2,"limit":500}`（与测前相同） | 验证过 PASS | `shots/t4-shortlist.png`, `shots/t4-monitors-cleared.png` |
| T5 | console error（排除 404/410）：T1/T3/T4 全部页面 0；`/api/ai-search` 0 次 | 验证过 PASS | `results.log` |
| T6 | usage 12:16:30 → 12:2x（>60s，no-cache）：searches/fast/refine/aiErrors/llmProvider/fallbacks 0→0；pageviews home +1、other +4；bots +1（本轮 curl） | 验证过 PASS | `usage/before-121630.json`, `usage/after-*.json` |
| T7 | storage restore（最后一次页面访问之后）：`storage-final.json` md5 `90ae6846b289259ce2e6d2f88b835097` == pre，diff 空；webhook.site uuid 在 `/home/ubuntu/r571/prod` 出现 0 次 | 验证过 PASS | `storage-pre.json`, `storage-final.json` |

## 备注
- 375 修改态/en 态 `documentElement.scrollWidth`=360 是竖向滚动条占 15px（innerWidth 375），非溢出（与 R560/R570 口径一致）。
- 未做：webhook「发送测试」端点（R570 已验证，R571 未改动）；Lighthouse（本轮聚焦项未要求）。

## 产物
- 报告：`/home/ubuntu/r571/prod/report-r571.md`
- 录屏：`/home/ubuntu/screencasts/r571/r571-edited.mp4`
- 截图：`/home/ubuntu/r571/prod/shots/`（t1-375-zh-unconfigured / configured / edit / clear-confirm、t1-375-en-*、t2-1280-zh-edit、t3-chaxiang-landing、t3-after-recheck、t4-shortlist、t4-monitors-cleared）
- 原始：`results.log`、`t1-net.json`、`t3-net.json`、`usage/`、`storage-pre.json`、`storage-final.json`、脚本 `t1_heights.py`、`t3_smoke.py`、计划 `plan-r571.md`
