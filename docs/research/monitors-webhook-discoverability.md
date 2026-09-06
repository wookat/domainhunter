# R565 /monitors「通知方式」卡片：现状调查 → 竞品对照 → 设计论证 → 验收对照

> 角色：前端工程师（R565 子会话）。背景：R559 体验走查 P2-1「persona 找不到在哪填 webhook、也不知道监控变化会怎样通知」；顺带补 P3-5 分享页缺备注/到期日、P3-8 `stackpilot.dev` chip 无到期日。本轮 **0 次生产 AI 调用**。
> 所有结论按「验证过 / 未验证 / 推断」标注；证据为读代码（基线 `deploy/r192-r195` tip 6352970）、本地 vitest 实测、生产只读 API/截图。

## 1. 现状调查（一手证据）

### 1.1 R36 webhook 实现链路（`apps/web/src/worker.ts`，验证过：读代码 + 本地 vitest）

| 环节 | 位置 / 值 | 说明 |
| --- | --- | --- |
| 定时任务 | `apps/web/wrangler.jsonc` → `"triggers": { "crons": ["0 */6 * * *"] }` | **每 6 小时**整点触发 `scheduled()` → `recheckMonitorDomains()`；这是文案「每 6 小时」的唯一依据，本轮所有文案与此对齐 |
| 监控集合 | KV `monitor:domains`（`Record<domain, MonitorEntry{domain,status,lastChecked,expiresAt?,webhook?}>`，全局上限 `MAX_MONITOR_DOMAINS=500`） | webhook **按域名条目存**，不是按用户；前端 `useMonitor().setWebhook()` 把同一 URL 逐条 `POST /api/monitor {domain, enabled:true, webhook}` 同步到本机监控的每个域名 |
| 变化记录 | KV `monitor:changes`（最多 `MAX_MONITOR_CHANGES=100` 条，`{domain, from, to, at}`） | `/monitors` 与 shortlist「监控动态」读 `GET /api/monitor/changes` |
| 变化判定 | `recheckMonitorDomains()`：`checkDomainsCached(kv, domains, cb, refresh=true)` → `r.status !== entry.status` 才算变化 | **只有 status 变化才推送**；`expiresAt` 变化只静默写回条目，不产生 change 也不推 webhook（验证过：读代码）。因此任务里「到期日变化时推送」的说法**与实现不符**，本轮文案只写「释放或被注册时推送」，未编造到期日推送 |
| 推送 | `sendWebhookNotification()`：`fetch(webhook, {POST, json, AbortSignal.timeout(5000)})`，每轮最多 50 条 `Promise.allSettled`，失败静默 | payload 字段：`source:"domainhunter"`, `event:"dropped"|"regained"`, `domain`, `from`, `to`, `at`, `text`（中英双语一句话）, `msg_type:"text"`+`content.text`（飞书）, `msgtype:"text"`（钉钉）, `url` |
| 服务端校验 | `sanitizeWebhook()`：`https:` 且 ≤500 字符，否则丢弃 | 前端 `isValidWebhook()` 同规则 |
| 手动刷新 | `POST /api/monitor/recheck`（每 IP 60s 限频，KV `rl:recheck:{ip}`） | 同一条 recheck 逻辑，也会推 webhook |
| **测试发送** | 基线**不存在**（验证过：`grep -n "webhook" worker.ts` 只有上述两处 + sanitize） | 用户配置后无法验证地址是否通 |

### 1.2 基线 UI 里 webhook 在哪设置（验证过：读代码 + 生产实查）

- 唯一入口：`/shortlist` 页 `MonitorChanges` 折叠面板（默认收起，标题「监控动态」）里的一个输入框 + 「保存」，文案 `monitor.webhookPlaceholder`/`monitor.webhookHint`。
- `/monitors` 页**没有任何 webhook 输入**；页面 hint（`monitors.hint`）却写着「…推送 webhook 通知」——用户被告知会推送，却找不到在哪填。这正是 R559 P2-1 的直接原因。
- 生产实查（2026-09-06 ~20:47Z，CDP + Playwright，storage 备份并字节级还原 `restore identical: true`，脚本 `~/r565/prod-monitors.js`）：
  - 空态：可见按钮只有「Check & monitor / Refresh status now / Go to shortlist」，`inputs=1`（只有域名输入框），通知相关文案仅一句 hint，**无 webhook 输入、无链接**。截图 `screenshots/r565-prod-monitors-empty-desktop.png`、`r565-prod-monitors-empty-375.png`。
  - 有条目态（用 `example.com` 做探针 `POST /api/monitor/add` → 200 `added:true, expiresAt:"2027-08-13T04:00:00.000Z"`，随后 `enabled:false` 删除，`probe after entries=[]`）：同样只有表格 + 「取消监控」，无通知配置。截图 `r565-prod-monitors-entries-desktop.png`、`r565-prod-monitors-entries-375.png`。
  - 生产 AI 计数：`GET /api/usage?days=1` → `{"searches":0,"fast":0,"refine":0}`（实查前后一致，0 增量）。

### 1.3 分享页 / taken chip 的到期日与备注（验证过：读代码 + 生产 API）

- `/api/share` POST：`sanitizeShareItem()` 只保留 `domain/label/tld/meaning/scores/status`，**丢弃 `expiresAt`/`note`**；GET `/api/share/:id` 原样回放 `snapshot.items`。→ 分享页拿不到到期日是**快照写入时就没有**，不是渲染问题。
- `shortlist-page.tsx` 分享请求体只带 `{domain, meaning, scores, status}`。
- `/api/check`（`checkDomainsCached`）：`CachedCheck` 已含 `expiresAt`，`packages/core/check.ts` `extractRdapDates()` 解析 RDAP `events[eventAction=expiration]`。
- **P3-8 根因**（验证过现象 + 读代码定位）：`checkDomain()` 先 DNS 判占用，再查 RDAP 拿日期；RDAP 429/5xx/超时则返回 `{status:"taken", method:"dns"}` **无 expiresAt**，worker 把它按 `CACHE_TTL_TAKEN=24h` 缓存 `d:{domain}`。生产实查 `stackpilot.dev`：首次 `{"status":"taken","method":"dns","cached":true}`（无日期）→ `POST /api/check?refresh=1` → `{"method":"rdap","registeredAt":"2025-04-06T10:59:44.720Z","expiresAt":"2027-04-06T10:59:44.720Z"}`；直连 Google Registry RDAP 同值。即 **`.dev` 解析没问题，是「DNS 兜底结果被缓存 24h」**。缓存策略在 `checkDomainsCached`（本轮不允许改），本轮只做展示侧修补 + 记录。
- 备注：`shortlist.ts` 与文案 `shortlist.notePlaceholder`「备注（仅存本机，不随分享外发）」是 R545 记录的**隐私承诺**；R559 P3-5 原文也写明「备注不外发是 R545 记录的隐私设计，但到期日是公开事实」。

## 2. 竞品对照（2–3 个产品的 webhook/通知设置形态）

| 产品 | 一手证据 | 可借鉴点 | 截图 |
| --- | --- | --- | --- |
| GitHub Webhooks | 官方文档 <https://docs.github.com/en/webhooks/using-webhooks/creating-webhooks>：「Under "Payload URL", type the URL where you'd like to receive payloads」；同一文档树有「Test webhooks / View deliveries / Redeliver webhooks」章节（验证过：curl 抓取正文） | 配置页 = URL 输入 + 内容类型 + secret；**配置后立刻能看到投递记录与响应码**，可重发 | `screenshots/r565-ref-github-webhooks.png` |
| Healthchecks.io | 文档 <https://healthchecks.io/docs/configuring_notifications/>；源码 `hc/front/urls.py` 有 `path("<uuid:code>/test/", views.send_test_notification)`，模板 `channels.html` 含「test notification using this integration」（验证过：curl raw.githubusercontent） | 每个 integration 行内一个 **Send Test Notification**；通知方式与检查项解耦，一处配置全局生效 | `screenshots/r565-ref-healthchecks.png` |
| Uptime Kuma | 源码 `src/lang/en.json` 有 `"Test"`, `"Default enabled"`, `"Apply on all existing monitors"`, `"notificationDescription": "Notifications must be assigned to a monitor to function."`（验证过：curl raw）；wiki <https://github.com/louislam/uptime-kuma/wiki/Notification-Methods> 只列支持渠道 | 通知设置弹窗里就有 **Test** 按钮；保存时可「应用到全部现有监控」——与我们「webhook 按域名条目存、保存即同步到全部已监控域名」的模型一致 | `screenshots/r565-ref-uptime-kuma.png`（wiki 页；demo 站需登录，未截设置弹窗——**未验证** UI 样式，只验证了字符串） |

共性：① 通知配置有独立、显眼的入口；② 配置处就能**测试发送**并看到对方响应码；③ 一处配置作用于全部监控项。基线 DomainHunter 三条都缺。

## 3. 设计论证

### 3.1 方案：`/monitors` 顶部「通知方式」卡片（hint 之下、添加表单之上）

- **位置**：紧跟 `monitors.hint`（hint 里新增指向「下方『通知方式』」），在「直接添加监控」表单之前——用户读完「会推送 webhook」下一眼就是在哪填；375px 单列不需要滚动即可见（见截图）。
- **两态**：未配置 → 直接展开输入框（不再多一步「展开」）；已配置 → 状态徽标「已配置」+ **脱敏 URL**（`maskWebhook()`：只露 origin 与末 4 位，如 `https://open.feishu.cn/…6789`，因飞书/钉钉/Slack 的 webhook 路径本身就是凭证）+ 「发送测试 / 修改 / 清除（二次确认）」。
- **校验**（前后端同规则）：`webhookInvalidReason()` 分 `scheme`（非 https）/`length`（>500）/`syntax`（不是 URL）三种文案；`aria-invalid` + `role=alert`；空串保存 = 清除（与 `saveWebhook("")` 语义一致）。
- **发送测试**：新增 `POST /api/monitor/webhook-test {webhook}` → worker 复用 `webhookPayload("test", …)` 真实 POST 到用户地址（与掉落通知**同字段集**，`event:"test"`），回传 `{ok, delivered: res.ok, status}`；**不回传对方响应体**（避免把 worker 当任意 https 读取代理）；每 IP 30s 限频（KV `rl:webhook-test:{ip}`，时间戳自判，因 KV TTL 最小 60s）；5s 超时 → 502 `unreachable`。前端 `sendWebhookTest()` 映射为 delivered / rejected(带对方状态码) / unreachable / invalid / rateLimited(Retry-After) / failed 六种双语反馈。
- **文案与 cron 对齐**：`monitors.notify.desc` 明写「每 6 小时核验一次（服务端定时任务 0 */6 * * *），监控域名释放或被注册时向这个地址 POST 一条 JSON」；**不写「到期日变化时推送」**（实现不推，见 §1.1）。
- **保存即同步**：沿用 `useMonitor().setWebhook()`（逐域名 POST `/api/monitor`），`useMonitor` 新增 `webhook` 状态并监听同步事件，shortlist 折叠面板里的旧输入与本卡片双向一致。
- **键盘**：Enter 提交、Esc 退出编辑（已配置）/清空输入（未配置）、全部控件 `h-11`（≥44px 触控）且可 Tab 到达。

### 3.2 分享页备注/到期日 与 taken chip 到期日

- `sanitizeShareItem()` 新增：`status==="taken"` 且可解析的 `expiresAt` → 归一 ISO；`note` trim 截 120 字符。GET 原样回放，旧快照无字段行为不变（vitest 覆盖）。
- `shortlist-page.tsx` 分享请求体新增 `expiresAt`（仅 taken）。**备注不外发**：遵守 `shortlist.notePlaceholder` 的隐私承诺与 R559 P3-5 原文；分享页与 `/api/share` 已能渲染/接收 `note`，若产品决定改口径（如分享前勾选「附带备注」），只需改 shortlist 一处 + 文案——这是**待产品决策项**，本轮不擅自打破承诺。
- 分享页：桌面表格与移动卡片对 taken 行渲染 `ExpiryNote`（与结果页同组件、同双语 `expiry.on`），有 note 时渲染 `SharedNote`；CSV 导出按是否存在追加 expiresAt/note 列（`results-export.ts` 已支持）。
- taken chip（`home-page.tsx` 快速核验，仅到期日展示）：有 `expiresAt` 照旧 `ExpiryNote`；**没有**时显示「到期日待查」（title 说明是 DNS 兜底结果、点右侧「重新核验」穿透缓存）——R564 已给 taken chip 加了 `RecheckButton`（`/api/check?refresh=1`），本轮把「为什么没日期、怎么拿到」说清楚。**缓存 24h DNS 兜底结果**这一根因需改 `checkDomainsCached`（不在本轮范围），记录为待办。

## 4. 验证方式与结果

| 项 | 方式 | 结果 |
| --- | --- | --- |
| 四条本地验收 | `pnpm -r typecheck` / `pnpm --filter web test` / `pnpm --filter web build` / `node scripts/check-content-counts.mjs` | 全绿：50 文件 531 tests（含新增 `lib/monitor-webhook.test.ts` 12、`monitor-webhook-test-route.test.ts` 6、`share-items.test.ts` +3）；既有守门 `faq/compare-verdict-opening/compare-price-placeholders/docs-no-share-tokens` 通过 |
| vitest 覆盖 | URL 校验三原因、`maskWebhook` 脱敏不含路径中段、`sendWebhookTest` 六种映射、worker 端点 payload 字段集/非 2xx 不透传响应体/超时 502/400 不出网/30s 限频与 Retry-After/503、share expiresAt/note 归一与旧快照不变、`formatExpiry` + `expiry.on` zh/en、通知文案含「6 小时」与 `0 */6 * * *` | 通过 |
| 本地 UI（Playwright/CDP） | 见 PR 描述「本地 UI 验证」与 `docs/research/screenshots/r565-local-*.png` | 见 PR |
| 生产 | 只读观察（§1.2），`/api/usage?days=1` 前后 `searches/fast/refine` 0 增量，探针监控已清理 `entries=[]` | 通过 |

## 5. 记录但不在本轮范围的问题

1. `checkDomainsCached` 把 `method:"dns"` 无 `expiresAt` 的 taken 结果缓存 24h → 建议：无日期的 DNS 兜底结果用短 TTL（如 1h）或下次命中时后台补查 RDAP。
2. `recheckMonitorDomains()` 不把 `expiresAt` 变化写入 `monitor:changes`/推送 → 若产品确需「到期日变化通知」，需新增 event 类型并改 change 结构。
3. webhook 按域名条目存：换 webhook 时需逐条同步（`setWebhook` 已做），无本地监控域名时保存只落 localStorage，新开监控时由 `toggle/add` 带上——行为正确但服务端没有「用户级」webhook 概念。
4. 备注是否随分享外发的产品口径（§3.2）。
5. shortlist 折叠面板里的旧 webhook 输入仍在（本轮未动 shortlist 面板），两处入口读写同一 `localStorage["domainhunter:monitor-webhook"]`，无冲突；后续可收敛为只在 `/monitors` 配置 + shortlist 处放链接。
