# R570 生产零 AI 回归报告 — hunt.zalize.com Worker 549c87de（deploy/r192-r195 @ 5599cc2）

日期 2026-09-07 11:44–12:06 UTC（会话 Chrome CDP :29229 + Playwright 请求/console 计数；curl/Lighthouse 走 shell）。
硬约束核对：`/api/ai-search` 请求数 **0**（全程 Playwright `page.on('request')` 计数）；未点「开始猎取」/示例 chip/再来一轮；所有路由带 `?cb=`；`/api/check` 共 **1** 次（T13）；storage 备份→字节级还原（md5 `90ae6846b289259ce2e6d2f88b835097` 前后一致，diff 空）；测试监控 0 条残留、测试分享已删且 API/页面均 410；webhook.site 接收端 uuid 与分享 revoke token 未出现在 `/home/ubuntu/r570/prod` 与 `/home/ubuntu/screencasts/r570` 任何文件（grep 0 命中；net.json 已脱敏为 `<WH>`/`<TOKEN>`/`<ID>`）。

## P0–P3 汇总

| 级别 | 项 | 说明 | 证据 |
|---|---|---|---|
| P0/P1 | — | 无 | |
| **P2** | T1/T4 375px webhook 输入框高度 34px（要求 ≥44） | `#monitor-webhook-input` 类含 `h-11 … flex-1 … sm:h-10`，样本表 `.h-11{height:2.75rem}` 存在，但 375 下父容器为 flex-column，计算高度 34px；同卡「保存/发送测试/修改/清除」按钮均 44px。R557 的「直接添加监控」输入在 375 为 44px，本卡不一致。 | `shots/t1-375-zh.png`、`shots/t4-375-configured-zh.png`、`t4c_inputh.py` 输出（results.log 11:50:14） |
| P3 | T9 进度序列末尾短暂出现「核验中 20/20」再变「已完成 20/20」 | MutationObserver 记到 `核验中 0/20 → 2/20 … 19/20 → 20/20 → 已完成 20/20`；x==N 的中间态约 1 帧。功能正确，仅口径备注。 | results.log 11:58:16 |
| P3 | T13 首页 taken 行「重新核验」为图标按钮（无可见文字，aria-label「重新核验 chaxiang.com（穿透缓存…）」），桌面尺寸 31×28px | R567 时该行有文字「重新核验」。可访问名称有、功能正常（1 次 `/api/check?refresh=1`）；375 触点在 R567 已验 44×44，本轮桌面未复测尺寸。若为有意改为图标，忽略。 | `shots/t13-chaxiang-landing.png`、`/home/ubuntu/screenshots/ss_zoom_1552fad9.png` |
| P3（观察） | `/advanced` 批量结果里 nic.cn（DNS-only taken）不显示「到期日待查」chip，只有首页 quick-check 有 | brief T5 只要求首页；记录以便决定是否统一。 | results.log 11:58:16 T9 rows；`shots/t9-batch-done.png` |
| P3（口径） | T3 UI 倒计时文案与 `Retry-After` 头差 2 秒 | 响应 429 `Retry-After: 26`，UI 读取时（2.5s 后）显示「24 秒后可再试」——倒计时在递减，非缺陷。 | `shots/t3-ratelimited-zh.png` |
| 信息 | Lighthouse SEO /monitors、/shortlist = 66 | 唯一失败审计 `is-crawlable`：两页 SSR 含 `<meta name="robots" content="noindex">`，为 worker.ts 注明的个人数据页策略，非回归。a11y 4 页均 100。 | `lh/*.json` |

## 逐项结果（T1–T16）

标注：✅ 验证通过 / ⚠️ 通过但有备注 / ❌ 未达预期 / ⏸ 未验证。脚本首轮标 FAIL 但经复核为选择器/断言口径问题的，在「备注」列说明。

| T | 结论 | 证据 | 备注 |
|---|---|---|---|
| T1 通知方式卡片位置/未配置态展开/375 单列首屏 zh+en | ⚠️ | `t1-desktop-zh.png` `t1-desktop-en.png` `t1-375-zh.png` `t1-375-en.png` | h2「通知方式」/"Notification method" 在顶部提示下、添加监控表单上；未配置态 input 直接展开；375 section bottom<812、scrollWidth 375、卡内纵向排列（input 一行，按钮组一行）。**输入框高 34px（P2）**。首轮「单列」谓词要求所有按钮 left==input.left 过严，属脚本口径。 |
| T2 校验 scheme/length/syntax zh+en | ✅ | `t2-scheme-zh.png` `t2-length-zh.png` `t2-syntax-zh.png` `t2-syntax-en.png` | `http://x`→scheme、600 字→length、`abc`→syntax；`aria-invalid=true` + `role=alert`，六条文案与 i18n 相符；无 `/api/monitor` 请求；Escape 清空输入与错误。 |
| T3 webhook-test 端点 + 30s 限流 | ✅ | `t3-delivered-zh.png` `t3-ratelimited-zh.png` `t3-receiver-payload.json` | 恰 1 条 `POST /api/monitor/webhook-test` → 200 delivered，UI「已发送，对方返回 HTTP 200…（event: test）」；webhook.site 收 1 条 JSON：keys `at,content,domain,event,from,msg_type,msgtype,source,text,to,url`，`event=test` `source=domainhunter` `domain=example.com` `msg_type=text`。30s 内再点 → 429 + `Retry-After: 26` → UI「发送测试太频繁，N 秒后可再试」。截图中输入框已遮蔽。 |
| T4 已配置态/掩码/修改-Escape/清除二步/shortlist 同步/44px | ⚠️ | `t4-configured-masked-zh.png` `t4-375-configured-zh.png` `t4-clear-confirm.png` `t4-shortlist-monitor-panel.png` `t4-restored-httpbin.png` | Enter 保存→「已配置」，掩码 `https://webhook.site/…xxxx`（仅末 4 位，正则通过）；修改→输入框→Escape 回只读；清除→「确认取消？」倒计时→确认→未配置态、localStorage 清空；`/shortlist` 监控动态面板（默认折叠，展开后）webhook value == 保存值；配置态按钮 44px；**输入框 34px（P2）**。UI 重新保存备份值 `https://httpbin.org/post`；monitor list 始终 `entries:[]`。首轮几条 FAIL 为 helper 读到「清除确认取消？0」等倒计时文案/状态切换时机，非产品问题。 |
| T5 taken 到期日 / 到期日待查 | ✅ | `t5-google-expiry.png` `t5-dns-only-pending-zh.png` `t5-dns-only-pending-en.png` | `google.com` 已注册 2028-09-14；`nic.cn` 「已注册 到期日待查」`data-expiry=unknown`，title 说明仅 DNS 占用/注册局未返回；en "Taken expiry pending"。 |
| T6 分享到期日 + 删除 410 | ✅ | `t6-google-starred.png` `t6-share-created.png` `t6-share-page.png` `t6-share-deleted.png` `t6-share.csv` | UI ★ 收藏 google.com + 随机 `r570zz781999.cn`；1 条 `POST /api/share` 200；`/s/<id>` 可见「google.com 已注册 2028-09-14 到期」（脚本首轮 FAIL 为行选择器只取到内层 span，截图证实）；`GET /api/share/<id>` google `expiresAt=2028-09-14T04:00:00.000Z`、无 `note`；分享页 CSV 含 `expires_at=2028-09-14`；页面无「备注：」文案（未填备注）；UI 删除→1 条 DELETE→API 410、`/s/<id>` 410。首轮 SSR 断言 FAIL 是分享页为 SPA 壳（raw HTML 不含域名），水合 DOM 与 API 已证。 |
| T7 /prices 精确 TLD 置顶 | ✅ | `t7-io-pinned.png` `t7-comcn-empty.png` `t7-cn-single.png` | 搜 `io` 14 行 `.io` 首行；后缀/注册首年/续费 三表头各点两次（升/降）6 次均 `.io` 首行，其余按方向排列；`com.cn` → 0/408 +「没有匹配的条目，换个关键词试试。」；`cn` → 恰 1 行 `.cn`。首轮 FAIL 为选择器（页面是 grid 而非 table，空态文案在 hub-filter.tsx）。 |
| T8 /advanced 改名 + 375 布局 | ✅ | `t8-desktop-zh.png` `t8-375-zh.png` `t8-375-en.png` `t13-chaxiang-landing.png`（header nav） | h1「批量核验」/"Bulk check"、副标题 zh/en、title「批量域名核验：…」；首页 header nav 含「批量核验」（/advanced 自身 header 显示「返回」，故首轮 nav 断言 FAIL 属口径）；375 textarea top 282 < 812 且在「组合生成（高级）」/"Combination generator (advanced)"（top 520/584）之上；scrollWidth 375。 |
| T9 批量 x/N 进度 | ⚠️ | `t9-batch-done.png` | 粘贴 20 域名 →「已识别 20 个域名」/「核验 20 个域名」；1 条 `POST /api/search` body 20 domains、0 ai-search；`role=status` 序列 `核验中 0/20 → 2 … 19/20 → 20/20 → 已完成 20/20`；`role=progressbar` now=20 max=20 min=0 aria-label「批量核验进度」，status `aria-live=polite`。P3：短暂 `核验中 20/20` 帧。 |
| T10 CSV 数值价格列（advanced + shortlist） | ✅ | `t10-advanced.csv` `t10-shortlist.csv` `t10-csv-exported.png` | 两份表头均含 `first_year_price` + `price_first_year_cny,price_renew_cny,price_first_year_usd,price_renew_usd,price_source`（+`expires_at`，shortlist 另有 `note`）；17 个 available .com 行 `80,80,11.08,11.08,porkbun_live` 无引号无 `$¥`；baidu/nic/google taken 行 5 列全空，google `expires_at=2028-09-14`；shortlist 里随机 .cn（static_reference）为 `33,38,,,static_reference`——USD 空是 csv.ts 对 static_reference 的既定行为（首轮脚本要求 USD 非空为口径错误）。 |
| T11 /shortlist 375 顺序 + desktop + Tab | ⚠️ | `t11-desktop-order.png` `t11-375-order-top.png` `t11-375-tab.png` | desktop 1280：监控动态 top174 / 跨设备同步 top250 < 排序条 351；375：排序条 287、卡片 < 监控动态 1228 < 同步 1304。Tab 从排序条起 18 次焦点全在排序按钮/卡片控件，未到面板；y 序列同卡内 437→425（同一行不同高按钮）12px 回退，非面板/卡片次序问题。 |
| T12 375 溢出 ×4 页 × dark/light + console | ✅ | `t12-{advanced,shortlist,monitors,prices}-{dark,light}-375.png` `t12-overflow.json` | 8 组 `documentElement/body.scrollWidth` 360–375 ≤ 375（360 为竖向滚动条），排除 overflow-x 容器后无元素 right>375；主题切换后恢复 dark；console 0 error。 |
| T13 R564 冒烟 | ⚠️ | `t13-chaxiang-landing.png` `t13-after-recheck.png` `t13-net.json` | `/?q=chaxiang`：精确核验 aria-pressed、恰 1 `POST /api/search`、0 ai-search、`[data-quick-check]` 在视口（scrollY 729）；taken 行「已注册 · 到期 · ★ · 开监控 · [图标]重新核验」无去注册；点 1 次 → 恰 1 `POST /api/check?refresh=1` body `{"domains":["chaxiang.com"],"refresh":true}`。P3 图标按钮见上。 |
| T14 console + Lighthouse | ✅ | `results.log` `lh/*.json` | 全部脚本段 console error（排除 404/410）0；Lighthouse 13.4.1：/advanced SEO 100 a11y 100；/prices 100/100；/monitors 66/100；/shortlist 66/100（仅 is-crawlable，noindex 设计）。 |
| T15 usage 对照 | ✅ | `usage/before-114440.json` `usage/after-120423.json` | 间隔 ~20 min：searches 0→0、fast 0→0、refine 0→0、aiErrors/llmProvider 无（0）。本轮精确核验 `/api/search` 共 6 次（T5 3 + T6 1 + T9 1 + T13 1，与 R567 一致不计入 `searches`）；pageviews home 5→12、other 5→30、results 0→2、prices 0→3、tld 5→5；bots 934→981（+47，含 Lighthouse 4 次 + curl）。 |
| T16 还原与清理 | ✅ | `storage-pre.json` `storage-pre-restore.json` `storage-final.json` | 最后一次页面访问后执行 restore：md5 前后 `90ae6846…` 一致、diff 空；还原前仅 `domainhunter:shortlist`、`dh:myShares:v1` 有差异（测试收藏/分享记录）；`POST /api/monitor/list` `{"entries":[],"monitored":2,"limit":500}`；分享 API/页面 410；uuid/token grep 0；`share-id.txt` 已删除。 |
| ⏸ 未验证 | — | | T4 修改态「取消」按钮尺寸未单独量；T13 桌面重新核验图标 44px 未要求；reserved unknown 行（生产未出现）。 |

## 产物
- 报告：`/home/ubuntu/r570/prod/report-r570.md`
- 录屏（带 setup/test/assertion 标注）：`/home/ubuntu/screencasts/r570/r570-edited.mp4`
- 截图：`/home/ubuntu/r570/prod/shots/`（44 张，见上表）；补充 `/home/ubuntu/screenshots/ss_zoom_279a994b.png`（T6 后 shortlist）、`/home/ubuntu/screenshots/ss_zoom_1552fad9.png`（T13 首页 taken 行）
- 原始数据：`/home/ubuntu/r570/prod/`：`results.log`、`t1-t4-net.json`、`t5-t6-net.json`、`t8-t10-net.json`、`t13-net.json`、`t3-receiver-payload.json`、`t6-share.csv`、`t10-advanced.csv`、`t10-shortlist.csv`、`t12-overflow.json`、`lh/`、`usage/`、`storage-*.json`、脚本 `t*_*.py`、`plan-r570.md`
- 接收端 uuid 仅在 `/home/ubuntu/r570/secret/wh_uuid`（chmod 700，产物目录外）。
