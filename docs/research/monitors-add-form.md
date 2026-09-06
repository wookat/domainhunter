# R557 /monitors「直接添加监控」表单：现状调查 → 竞品实测 → 设计论证 → 验收对照

> 角色：前端工程师。背景：R553 P3-4 与 R545 体验走查均指出监控只能从「已注册结果行」的开关进入，用户无法直接输入一个已被占用的域名来捡漏。本轮 0 AI 调用。
> 所有结论按「验证过 / 未验证 / 推断」标注；证据为本地脚本实测、生产 API 实查或截图。

## 1. 现状调查（一手证据，读代码 + 本地 wrangler 实测）

### 1.1 现有 /api/monitor* 契约（`apps/web/src/worker.ts`，基线 a1f0851）

| 路由 | 作用 | 关键行为（验证过：读代码 + 本地 curl） |
| --- | --- | --- |
| `POST /api/monitor` `{domain, enabled, status?, webhook?}` | 结果行开关 | `domain` 去空白小写、`DOMAIN_RE` 校验；`enabled=true` 时写入 KV `monitor:domains`（`Record<domain, MonitorEntry>`），已存在则保留原条目只更新 status/webhook；新域名且已到 `MAX_MONITOR_DOMAINS=500` → 429 `monitor_full`；`webhook` 只接受 https、长度受限（`sanitizeWebhook`） |
| `POST /api/monitor/list` `{domains[]}` | 监控页初次加载 | 按本地清单回传服务端条目 + `monitored/limit`，**不核验** |
| `POST /api/monitor/recheck` `{domains[]}` | 「立即刷新状态」 | 每 IP 限频；对清单里的域走 `checkDomainsCached(kv, domains, cb, refresh=true)`（RDAP→WHOIS 兜底，非 AI），写回 status/expiresAt/lastChecked，状态变化写 `monitor:changes` 并推 webhook |
| `GET /api/monitor/changes` | 监控动态 | 只读 `monitor:changes` |
| cron（每 6h） | 自动复查 | 同 recheck 逻辑 |

- **没有独立的 add / remove 路由**（任务描述里的 `add|remove` 在基线中不存在——验证过：`grep 'api/monitor' worker.ts`）；「删除」= `POST /api/monitor {enabled:false}`。
- 去重：KV 是以域名为键的对象，天然去重；**前端本地清单 `localStorage["domainhunter:monitor"]` 是数组**（`mutate()` 用 Set 合并），页面列表按本地清单渲染，所以「重复」要在前端按本地清单判。
- 上限是**全局** 500（所有用户共用一个 KV 键），不是每用户；已在集合内的域名不占新名额。
- 开监控时**不做核验**：`/api/monitor` 只把调用方传来的 `status` 存进去，到期日要等 cron/recheck 才会出现 → 这是「直接添加」必须补的：提交即核验一次，否则新条目会是「状态未知 / 尚未检查」。
- 非 AI 核验能力：`checkDomainsCached(kv, [domain], cb, true)` 直接可用，返回 `status ∈ available|taken|unknown` 与 `expiresAt`；`/api/check` 只是它的 NDJSON 包装。复用内部函数而不是让前端二次调 `/api/check`，可以把「核验 → 写 KV」做成一次原子请求。

### 1.2 现有页面（`apps/web/src/components/monitors-page.tsx`）

- 结构：标题 + 名额 → hint → [刷新行] → 列表 / 空态（空态 CTA 只有「去候选清单」）。`main` 为 `max-w-3xl px-4`，375 下内容宽 343px。
- 行内操作：两步确认「取消监控」（6s 倒计时）、「查可用性」外链、`ExpiryNote` 到期日。
- 结果行开监控路径在 `domain-row.tsx` 的 `WatchToggle` → `useMonitor().toggle()`，本轮**不改**。

### 1.3 生产基线（验证过：`curl -A Mozilla https://hunt.zalize.com/api/usage?days=1`，2026-09-06 18:02Z，本地测试完成后）

`days["2026-09-06"] = { searches: 0, fast: 0, refine: 0 }`。本轮所有实测都在本地 `wrangler dev`，没有对生产发起任何 `/api/ai-search`；生产 AI 计数为 0 即证明 0 增量。

## 2. 竞品入口形态实测（headless Chromium，Mozilla UA，2026-09-06；脚本 `~/tools/pw/competitors*.js`）

| 站点 | URL | 免登录可见的入口 | 结论 | 截图 |
| --- | --- | --- | --- | --- |
| DropCatch | https://www.dropcatch.com/ | 顶栏单输入框 `#menu-search-input`（placeholder "Search for domains"，400×40）+ 类型/TLD 复选筛选 | **验证过**：输入 `google.com` 回车 → 跳到 `/auctions` 列出含关键词的 pending-delete 域名（golden-google.com 等，每行「Backorder Now $59」）；输入随机串 `zqxwv7k3test.com` → "No Results"。即：**搜索框做的是关键词匹配，不是「对这个精确域名下单」**；精确 backorder 需登录 | `screenshots/r557-dropcatch-home.png`、`r557-dropcatch-search-google.png`、`r557-dropcatch-search-random.png` |
| ExpiredDomains.net | https://www.expireddomains.net/ | 顶栏单输入框 `#navsearchinput`（"Search for Domain Names"，350×34）+ Search 按钮 | **验证过**：提交 `google.com` 重定向到 `/login/?signup=1`，"Login to see all Domains and Filters" → 结果页需登录，**入口形态可见、结果不可见** | `r557-expireddomains-home.png`、`r557-expireddomains-search-google.png` |
| Dynadot Backorder | https://www.dynadot.com/domain/backorder | 302 到 `/domain/prices`，页面只有 "Find Your Domain Name" 通用搜索 + 邮件订阅 | **未验证**：backorder 专用表单在该 URL 下不可达（可能已下线或改路径），不作为设计依据 | `r557-dynadot-backorder.png` |
| GoDaddy Backorder | https://www.godaddy.com/domains/domain-backorder | 落到博客 "GoDaddy phases out domain backorders"（2024-08-08） | **验证过**：GoDaddy 已停止新 backorder，无入口可参照 | `r557-godaddy-backorder-blog.png` |
| DomainTools Monitor | `/products/monitors/` 等 | 404 / 跳技术文档 | **未验证**（产品页不可达） | — |
| SnapNames / NameJet | 首页 | Cloudflare 403 challenge | **未验证**（反爬拦截） | — |
| Park.io | https://park.io/ | 首页只有邮件订阅 + 「dropping soon」列表，无域名输入框 | **验证过**：入口需登录 | — |

**从可见证据得到的形态共识（DropCatch + ExpiredDomains）**：单行输入框 + 一个主按钮，放在页面顶部第一屏；无多级表单；提交后立即给出「这个域名现在是什么状态」。**竞品缺失、我们可以做得更好的点**：两家都不在提交时告诉用户「这个域名其实现在就能注册」（DropCatch 随机串只返回 No Results），也不做客户端语法校验（回车直接跳页）。

## 3. 设计论证（如无异议按此执行 — 已执行）

### 3.1 表单位置：hint 之下、刷新行之上，独立卡片

- 理由：这是页面**唯一的新增入口**，要在 375×812 首屏可见（截图量测：表单卡片 top≈158px，提交按钮 bottom≈337px，见 `r557-375-light-empty.png`；推断值，按 2× DPR 截图换算）；放在列表之下会在有条目时被推到首屏外。
- 空态文案同步改为「在上方直接输入一个已注册域名，或在搜索结果 / 候选清单里打开监控开关」，两条路径并列，不废弃旧路径。

### 3.2 校验（`apps/web/src/lib/monitor-add.ts`，前后端共用同一函数）

```
normalizeMonitorInput(raw)  = trim → lowercase → 剥 scheme:// → 剥 /path?query#hash → 剥前置 www. → 剥末尾 .
parseMonitorDomain(raw, monitored)
  ""                      → empty
  无点 / 首尾点 / label 不合 ^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$ / 总长>253 → syntax
  tld ∉ TLD_LIST（408 个）  → tld（回传后缀，含 com.cn 这类多级后缀）
  已在 monitored           → duplicate
  否则                     → { domain, label, tld }
```

- 只接受 `label.tld`：`foo.bar.com` 会因为 `bar.com ∉ TLD_LIST` 被按 `tld` 拒绝，文案指明「暂不支持 .bar.com 后缀」。
- 归一只做无损处理（粘贴 URL 很常见），**不猜意图**（`google` 不自动补 `.com`，按 syntax 拒绝并给出 example.com 示例）。
- 服务端 `POST /api/monitor/add` 用同一 `parseMonitorDomain` 二次校验（不传 monitored：重复由前端按本地清单判；服务端对已有键做「保留条目 + 更新本次核验结果」，与 `/api/monitor` 一致，因此不同浏览器各自添加同一域名不会互相报错，也不会重复占名额）。
- **记录的限制（未改）**：`TLD_LIST` 不含 `com.cn`，而 `outboundTldBucket` 注释称站内核验支持 com.cn；本轮按任务要求「TLD 须在 TLD_LIST」实现，如需支持多级后缀应在 TLD_LIST 层解决，不在表单层特判。

### 3.3 提交即核验：新增 `POST /api/monitor/add`（仅 `/api/monitor/*` 范围）

```
req  { domain, webhook? }
校验失败                         → 400 { ok:false, error:"invalid_domain" | "unsupported_tld", tld? }
新域名且 monitored ≥ 500          → 429 { ok:false, error:"monitor_full", monitored, limit }
checkDomainsCached(kv,[d],cb,true) 抛错/无结果 → 502 { ok:false, error:"check_failed" }
status=available                  → 200 { ok:true, added:false, entry:{domain,status,lastChecked}, monitored, limit }   // 不写 KV
status=taken|unknown              → 写 KV（保留已有条目；taken 且有 expiresAt 才覆盖到期日；webhook 同 sanitizeWebhook）
                                  → 200 { ok:true, added:true, entry:{domain,status,lastChecked,expiresAt?}, monitored, limit }
KV 未绑定                         → 503 { ok:false, error:"monitor_unavailable" }
```

- 为什么不让前端先调 `/api/check` 再调 `/api/monitor`：两次往返 + 中间态（核验成功但写入失败）难处理；且 `/api/monitor` 不会写 expiresAt，列表仍显示不出到期日。一次请求「核验 → 判定 → 写入」最简单。
- `refresh=true` 穿透 `d:{domain}` 缓存：用户就是要「现在」的状态；代价是每次提交一次 RDAP（本地实测 google.com ≈1s）。
- `unknown`（注册局暂不可达）**仍加入监控**而不是拒绝：用户意图明确，下一轮 cron 会补状态；文案明确说「本次未能确认状态」。
- `available` **不入监控**：监控的语义是「等它掉落」，可注册域名监控没有意义且白占全局名额；返回 `added:false`，前端给「现在就可以注册 → 去注册 · Porkbun」（复用 `primaryRegistrar` / `RegistrarAnchor`，与结果行同一套注册商链路）。

### 3.4 前端（`useMonitor().add()` + `monitors-page.tsx`）

- `requestMonitorAdd(raw, monitored, webhook, fetch)` 为纯函数（可 vitest），hook 只负责成功后 `mutate(domain, true)` 写本地清单并广播 `SYNC_EVENT`。
- 结果存**结构**不存文案（`MonitorAddResult` union），渲染时翻译 → 切语言后提示同步（沿用 R5xx 既有做法）。
- 成功：`entries[domain] = entry`、名额更新、输入清空、焦点留在输入框、新行 4s 左侧品牌色高亮；提示 `role=status`。
- 错误：`role=alert` + `aria-invalid` + `aria-describedby` 指向 hint 与反馈；输入变化即清除旧提示。
- 提交中：按钮 disabled + spinner + 「核验中…」；输入框 `readOnly` 而非 `disabled`（disabled 会丢焦点，实测第一版就是因此 FAIL）。
- 名额已满（`quotaFull`）：提交按钮 disabled，页面顶部既有的 quotaFull 横幅说明原因；服务端 429 也映射到同一文案兜底。

### 3.5 文案（zh/en 各 17 条，`monitors.add.*`，均在 `apps/web/src/lib/i18n.tsx`）

| key | zh | en |
| --- | --- | --- |
| label | 直接添加监控 | Add a domain to monitor |
| err.syntax | 域名格式不对：请输入形如 example.com 的完整域名（字母、数字、连字符） | That doesn't look like a domain — enter a full name like example.com (letters, digits, hyphens) |
| err.tld | 暂不支持 .{tld} 后缀，目前只能监控本站追踪的 {count} 个后缀 | .{tld} isn't supported yet — monitoring covers the {count} TLDs tracked on this site |
| err.duplicate | {domain} 已在你的监控清单里 | {domain} is already on your monitor list |
| available | {domain} 现在就可以注册，不需要监控——直接去注册吧 | {domain} is available right now — no need to monitor it, just register it |
| addedExpiry | 已加入监控：{domain}（已注册，{date} 到期） | Now monitoring {domain} (taken, expires {date}) |

（其余 empty / check / network / full / added / addedUnknown / hint / placeholder / submit / submitting / clear 见 i18n.tsx。）worker 侧 SSR 没有 /monitors 文案，无需改。

### 3.6 375px 与键盘

- 布局：输入框与按钮 `flex-col sm:flex-row`，375 下各占满 343px；反馈块 `flex-wrap break-words`，长域名不撑宽。
- 键盘：原生 `<form>` → Enter 提交；Tab 顺序 header → 输入框 → 提交按钮（→ 清空 × 仅在有输入时出现）；Esc 在输入框内清空输入与提示（输入框已空且无提示时不拦截）。触控目标 44px（`h-11`），桌面 40px。

## 4. 验收对照

### 4.1 本地四条命令（验证过，2026-09-06 17:5xZ）

`pnpm -r typecheck` ✓ · `pnpm --filter web test` ✓ 42 files / 472 tests（新增 `lib/monitor-add.test.ts` 14 项、`monitor-add-route.test.ts` 8 项）· `pnpm --filter web build` ✓ · `node scripts/check-content-counts.mjs` ✓（TLD 408 / 指南 410 / 对比 444）。

### 4.2 本地 Playwright（`~/tools/pw/r557-monitors.js`，headless Chromium 独立 profile，`wrangler dev --port 8787`，30/30 通过）

| 要求 | 结果 | 证据 |
| --- | --- | --- |
| 添加 google.com → taken + 到期日 | ✓「已加入监控：google.com（已注册，2028-09-14 到期）」，列表就地出现同一行，localStorage 写入 | `r557-375-light-added.png` |
| 随机可注册串 → 提示去注册、不入监控 | ✓ 提示 + `去注册 · Porkbun` 外链（href 含该域名），列表/localStorage 均无 | `r557-375-light-available.png`、`r557-375-dark-available.png` |
| 非法输入 / 不支持后缀 / 空 | ✓ syntax / tld(.com.cn) / empty 三种文案，`role=alert` + `aria-invalid` | `r557-375-dark-error.png` |
| 重复 | ✓ `GOOGLE.COM` 归一后判重，列表仍 1 行 | 脚本日志 |
| 删除 | ✓ 两步确认后行移除、localStorage 为 `[]`、回到空态 | 脚本日志 |
| 375 浅/深色无横向溢出 | ✓ 空态 / 有条目 / 可注册提示 / 错误提示 4 种状态 `scrollWidth==375`，无元素越界 | 上列截图 + `r557-375-light-empty.png` |
| Tab / Enter / Esc | ✓ 第 6 次 Tab 到输入框 → 提交按钮；Enter 提交；Esc 清空 | 脚本日志 |
| 英文 | ✓ `?lang=en` 错误/重复文案 | `r557-375-en.png` |
| storage 备份还原 | ✓ 测前 dump localStorage+sessionStorage，测后还原并字节级比对相等（独立 profile，未触碰生产/会话浏览器） | 脚本日志 |
| 0 AI | ✓ 页面级监听 0 次 `/api/ai-search`；生产未触碰 | 脚本日志 + §1.3 |

### 4.3 未验证 / 推断

- **未验证**：生产环境 `/api/monitor/add`（未部署）；RDAP 对 `unknown` 分支的真实触发（vitest 用桩覆盖）。
- **未验证**：Dynadot / DomainTools / SnapNames / NameJet 的登录后 backorder 表单形态（§2 注明）。
- **推断**：全局 500 名额下「available 不占名额」能减少无效占用——基于语义判断，无生产数据。

## 5. 发现但未改（超出本轮范围，仅记录）

1. `TLD_LIST` 不含 `com.cn` 而站内其他位置认为核验支持它（§3.2）；如要支持二级后缀应改 TLD_LIST 层并配 `parseMonitorDomain` 的最长后缀匹配。
2. 基线 `POST /api/monitor` 开监控不核验、不写 expiresAt，结果行开的监控在下一次 cron 前无到期日；可考虑让 `toggle()` 也走 `/api/monitor/add`（本轮按要求不动结果行路径）。
3. 监控上限是全局共享 500 而非每用户，多人使用时任何一个用户都可能撞到；产品层面需决定是否分用户配额。
