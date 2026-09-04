# R484 零 AI 全站审计（覆盖 R478–R482）

- 对象：生产 https://hunt.zalize.com ，前端资产 `assets/index-B6NMgZ63.js` / `assets/index-BeVZb2kj.css`（对应 `deploy/r192-r195` @ `a5af9eb`）
- 日期：2026-09-04（UTC）
- 方法：严格按 `.agents/skills/testing-domainhunter/SKILL.md`；全程 **0 次 AI 调用**（未点 AI 猎名 / 示例 prompt / refine；网络面板与 headless 请求钩子均未捕获任何 `/api/ai-search`）
- 矩阵：桌面 1280 + 375px（CDP `Emulation.setDeviceMetricsOverride`）× 浅色 + 深色 × zh + en
- 工具：Playwright（CDP 接管可见 Chrome + 独立干净 headless Chromium）、curl、Lighthouse 12（desktop / mobile preset）、axe-core 4.10.3
- 证据原件（审计机）：`~/r484/findings-r484-{http,browser,followup,headless,axe,axe-local-fix}.json`、`~/r484/lighthouse/*.report.{html,json}`、`~/r484/screenshots-r484/`；本仓库仅收录关键截图于 `docs/audits/screenshots-r484/`

## 0. 结论

| 项 | 结果 |
|---|---|
| 零 AI | `/api/usage?days=1` 测前/测后 `searches 9 → 9`、`fast 9 → 9`、`refine 0 → 0`、`aiErrors`/`fallbacks` 无变化；浏览器侧 0 个 `/api/ai-search` 请求 |
| R478 首页 zh/en hero | PASS（SSR `<h1>`/`<title>`/description 与水合后一致） |
| R480 注册商菜单 | PASS（5 个表面、排序、纯搜索链接、`rel="noopener noreferrer"` 无 `sponsored`、无披露、`POST /api/click` 204）；**P2：outbound 计数丢写**（4 次点击计 3 次） |
| R481 HTML 后处理 | PASS（vars 未配置时 9 条路由生产 vs 本地字节级一致，无 GSC/Bing meta、无 CF beacon） |
| R481 `/api/usage` 字段 | PASS（`pageviews/bots/botsBy/outbound/outboundByTld` + `cronLast/indexnowLast/indexnowLastError/pricesLastOk/pricesLastFail`） |
| R482 pageview 分片 | PASS（3 次首页 + 1 次 /tld 加载，66s 后 `home 138→145`、`tld 34→36`，含他人流量噪声） |
| R479 文档一致性 | 1 条不符：README「浅色/深色（对比度 ≥4.5:1 为硬指标）」在生产浅色主题**不成立**（见 P1-1） |
| Lighthouse ×8 | 全部 ≥0.94，a11y/SEO 全 1（深色默认主题） |
| axe ×20 | 深色 0 违规；**浅色 5 页全部有 `color-contrast`**（P1-1）；/shortlist 菜单打开时 4 条为 Radix modal 的 axe 伪阳性（P3-2）；关闭菜单后 1 条 `empty-table-header`（P3-1） |
| 375px | 12 条路由 `scrollWidth = innerWidth = 375`，无横向溢出；触控目标 ≥44px（quick-check chip 44、去注册按钮 44、菜单项 36—菜单项按 shadcn 默认） |
| 键盘 | Tab 顺序合理、全部可见 focus 环（outline）；菜单 Enter 打开→焦点落首项→Enter 触发→Esc 关闭并回焦触发器 |
| console | 0 error（全程） |
| 状态还原 | 浏览器 local/sessionStorage 还原后与备份 `storage-r484-pre.json` 逐字节相等；测试分享 `WNXrptU_a8` 已撤销（DELETE 200 → GET 410） |

## 1. 问题清单

### P1-1 浅色主题品牌绿 `#059669` 全站对比度 3.2–3.8:1，不达 ≥4.5:1 硬指标（README 亦如此承诺）

- 现象（生产，axe-core 4.10.3，`wcag2aa` 规则，浅色，1280 与 375 一致）：
  - 首页（精确核验模式）：hero 徽章文字 `#059669` on `#e6f5f0` = **3.35**；模式切换选中态 3.35；quick-check「可注册」chip 域名文字 3.35；「立即核验」白字 on `#059669` = **3.76**；chip 内价格 `<i class="opacity-75">` 更低
  - `/tld/cn`：面包屑/语言 pill 3.21、标题下 brand 文本 3.6、CTA 白字 3.76
  - `/guide/saas`：TLD 链接 `text-brand` on white 3.76、pill 3.21
  - `/prices`：`text-brand` 3.6 / 3.76；「续费陷阱」角标 `text-amber-500 #f59e0b` on `#f9ecd5` = **1.83**（10px 字）
  - `/shortlist`：sort 选中态 3.21、去注册白字 3.76、触发器 3.35
  - 独立复核（`audit_followup_r484.py` 分层 alpha 合成实测）：浅色 hero 徽章 3.21、选中模式 3.34、可注册 chip 3.34、价格 ↑ 1.90；**深色主题同元素 9.2 / 8.33 / 8.33 / 6.76，全部通过**
- 复现：`localStorage.setItem('domainhunter:theme','light')` → 打开 `/?mode=exact&lang=zh` 输入 `acme.cn` 回车 → 对 hero 徽章 / 模式按钮 / chip 运行 axe 或 DevTools 对比度检查
- 截图：`screenshots-r484/H-contrast-prod-light-1280.png`、`H-contrast-prod-prices-light.png`（修复前）；`H-contrast-local-fix-light-1280.png`、`H-contrast-local-fix-prices-light.png`（修复后本地）
- 根因文件（源码已核对，非推测）：`apps/web/src/index.css` `.light` 块 `--brand: #059669`（emerald-600，白底仅 3.77）与 `--amber: #b45309`（在 amber 淡底上 4.3）；`apps/web/src/components/home-page.tsx:178-180` 价格 `<i>` 的 `opacity-75` 与硬编码 `text-amber-500`；`apps/web/src/components/prices-page.tsx:127` 硬编码 `text-amber-500` / `bg-amber-500/15`（绕过主题变量，深浅色同一色）
- 为何 Lighthouse a11y = 1 仍漏掉：Lighthouse 以默认深色主题跑，深色对比度全部达标
- **已顺手修复（独立 PR `fix(theme): light-theme brand/amber ≥4.5:1`，9 行变更，≤50 行；链接见文末）**，设计论证：
  - 现状证据：见上，浅色 5/5 页面 axe 均报 `color-contrast`，深色 0 报
  - 方案：仅改 `.light` 变量——`--brand #059669 → #046d4f`（介于 emerald-700/800，白底 6.35、`#fafaf9` 6.08、10% 淡底 ≥4.6、白字 on brand 6.35）、`--brand-strong → #065f46`、`--brand-dim/--brand-line/--glow` 同步换 rgb(4,109,79)；`--amber #b45309 → #92400e`（amber 淡底 6.07）；两处 `text-amber-500` 改为主题色 `text-amber2` / `bg-amber2-dim`（深色仍取 `#fbbf24`，视觉不变）；去掉 chip 价格的 `opacity-75`（否则 10px 字合成后仍 3.38）。深色变量未动
  - 验证：本地 `pnpm --filter web build` → `wrangler dev :8788` → 同一 axe 脚本浅色 ×2 视口 ×5 页 **0 条 `color-contrast`**（`findings-r484-axe-local-fix.json`）；`pnpm -r typecheck` / `pnpm --filter web test`（67 通过）/ `pnpm --filter web build` 全绿；截图对比视觉仍为 emerald 系
  - 未覆盖：`/why`、`/vs/*`、`/monitors`、`/advanced` 浅色未跑 axe（使用同一组变量，预期同修；建议父会话部署后用 `~/r484/audit_axe_r484.py` 回归）

### P2-1 `/api/click` outbound 计数非原子，短时间内多次点击会丢写

- 现象：干净 headless 在约 30s 内依次触发 4 次注册商点击（aliyun/cn、namecheap/com、aliyun/cn、porkbun/com），4 个 `POST /api/click` 均发出（sendBeacon，请求体正确）；等待 20s 与 20 分钟后 `/api/usage` 均为 `outbound: aliyun 2→4, porkbun 2→3, namecheap 1→1`、`outboundByTld: com 3→4, cn 1→3`——namecheap/com 这一笔永久丢失（4 计 3）
- 复现：任意页面连续点击两个不同注册商链接（间隔 <2s）→ 60s 后读 `/api/usage?days=1` 的 `outbound`
- 根因文件（源码核对）：`apps/web/src/worker.ts` `bumpOutbound()`（约 L152）对 `usage:YYYY-MM-DD` 整条 JSON 做 read-modify-write，`waitUntil` 并发 + KV 最终一致 → 后写覆盖前写；代码注释已自述「KV 非原子，允许少量误差」。R482 已为 pageviews 做 per-isolate 分片，outbound 仍走旧路径
- 建议：与 pageviews 相同的分片 key（`usage:pv:*` 模式）或 Durable Object/Analytics Engine 计数；返佣未上线前误差可接受，故只报告不修

### P3-1 `/shortlist` 操作列 `<th>` 为空（axe `empty-table-header`，minor）

- 现象：菜单关闭状态下 axe 唯一违规：`th:nth-child(9)` `<th class="px-4 py-3"></th>`
- 根因文件：`apps/web/src/components/shortlist-page.tsx:761` `<th className="px-4 py-3" />`
- 建议：加 `<span class="sr-only">{t("shortlist.actions")}</span>`（需 zh/en 各加一条词典）

### P3-2 Radix DropdownMenu 打开时 axe 报 `aria-hidden-focus / landmark-one-main / page-has-heading-one / region`（伪阳性，记录备查）

- 现象：/shortlist 菜单展开时 `#root[aria-hidden=true]`（Radix modal 行为，已实测 `document.body.children` 上 `aria-hidden` 标记），axe 因此认为页面无 main/h1；关闭菜单后 4 条全部消失。深浅色一致。不构成用户可感知问题

### P3-3 生产 HTML 响应无安全响应头

- 现象：`curl -I https://hunt.zalize.com/` 无 `Content-Security-Policy`、`X-Content-Type-Options`、`Referrer-Policy`、`X-Frame-Options`、`Strict-Transport-Security`；Lighthouse best-practices 首跑 `/tld/cn` mobile 0.96（`inspector-issues` CSP 项），cache-bust 重跑为 1
- 根因文件：`apps/web/src/worker.ts` 无统一头中间件
- 建议：Hono `secureHeaders()` 中间件（注意与现有 inline JSON-LD / 主题脚本兼容，需 nonce 或 `'unsafe-inline'` 评估），非本轮范围

## 2. 逐项证据

### 2.1 R478 首页中文利基文案

| 项 | zh | en (`?lang=en`) |
|---|---|---|
| `<title>` | DomainHunter — 中文创业者的域名猎手 \| 用中文说寓意，猎到真正可注册的 .cn / .com 好域名 | DomainHunter — Domain hunter for Chinese founders \| Bilingual naming, verified .cn / .com availability |
| SSR `<h1>` | 用中文说出寓意，猎到真正可注册的.cn / .com 好域名 | Name it in Chinese or English, hunt .cn / .com domains you can actually register |
| 徽章 | 中文创业者的域名猎手 · RDAP + WHOIS 实时核验 | For Chinese founders · Live RDAP + WHOIS checks |
| 水合后 | 与 SSR 一致（`A_hero` 四组合 h1/badge/sub 全 ok） | 同 |
| hreflang | zh→`/`、en→`/?lang=en`、x-default→`/` | 同 |

截图：`A-home-zh-light-desktop.png`、`A-home-en-dark-desktop.png`、`A-home-zh-dark-375.png`。深色 h1 对比度 16.99、副标 7.51。

### 2.2 R480 注册商链接

- `GET /api/registrars` → `{"affiliate":{}}`，`cache-control: public, max-age=300`
- 表面覆盖（生产实测 href / target / rel / title）：
  - quick-check chip（`B_quick`，9 个 TLD）：`.cn` → 阿里云 `wanwang.aliyun.com/domain/searchresult/#/?keyword=…`；`.com/.io/.ai/.app/.dev/.co/.net/.me` → Porkbun `porkbun.com/checkout/search?q=…`；全部 `target=_blank rel="noopener noreferrer"` title「去 阿里云 注册 x.cn」
  - 结果行 RegisterMenu（`E_results`，.com）：Porkbun（含实时价 $11.08）→ Namecheap → Cloudflare → 阿里云 → 腾讯云
  - shortlist RegisterMenu（`C_shortlist`）：`.cn`：阿里云 → 腾讯云 `buy.cloud.tencent.com/domain?domain=…` → Namecheap；`.com`：Porkbun → Namecheap → Cloudflare `domains.cloudflare.com/?domain=…` → 阿里云 → 腾讯云；title「在 阿里云 注册 x.cn（新窗口打开）」
  - 分享页 `/s/:id`（`D_share`）：同 shortlist 排序
  - 批量去注册按钮：存在（未点击，避免多窗口；单项 `openRegistrar` 路径由 headless `results_row` Enter 验证）
- 纯搜索链接：所有 href 无 `ref/aff/coupon/utm` 参数；`rel` 不含 `sponsored`；页面无任何返佣披露文字
- 点击计数（干净 headless，注册商域名全部路由到桩，未访问真实注册商）：4 次点击 → 4 个 `POST /api/click` 请求体如 `{"registrar":"aliyun","tld":"cn"}`，弹窗 URL 与 href 一致；直连 `POST /api/click` 有效 → 204 `cache-control: no-store`，非法注册商 / 非法 TLD / 非法 JSON → 400
- 键盘（`menu_cn_kbd`）：触发器 Enter → 焦点落「阿里云」menuitem → Enter 打开正确 URL → Esc 关闭且焦点回到触发器
- 375px：菜单完全在视口内（left 182 / right 342），菜单项 36px 高、去注册按钮 44px 高；截图 `C-shortlist-menu-light-375.png`

### 2.3 R481 HTML 后处理 / usage 字段

- 生产首页 HTML：无 `google-site-verification`、无 `msvalidate.01`、无 `static.cloudflareinsights.com/beacon`
- 字节级对比（生产 vs 本地 `wrangler dev` 未配置任何 GROWTH/ANALYTICS 变量）：`/`、`/?lang=en`、`/tld/cn`、`/guide/saas`、`/vs/com-vs-cn`、`/prices`、`/advanced`、`/mcp`、`/why` 9/9 `identical: true`
- 非 HTML 响应未被触碰：`/api/registrars`、`/sitemap.xml`、`/llms.txt`、`/robots.txt`、`/api/usage` content-type 正确且无 `<head>/<meta>`
- `/api/usage?days=1` 顶层：`cronLast, days, indexnowLast, indexnowLastError, pricesLastFail, pricesLastOk`；日级：`aiErrors, bots, botsBy, byTld, fallbacks, fast, outbound, outboundByTld, pageviews, refine, searches`；测后快照 `bots 31`、`botsBy {bing 1, baidu 3, other 27}`

### 2.4 R482 pageview 分片

- 前：`home 138, tld 34`；动作：3 次 cache-bust 首页 + 1 次 `/tld/cn`；等待 66s；后：`home 145, tld 36`（≥ 本会话增量 3 / 1，多出部分为同期他人流量，`other 49→51` 未由本会话触发）
- 结论：分片写入在 ≤60s 内可见，符合 SKILL 记录的最终一致延迟

### 2.5 MCP / 发现面

- `POST /mcp initialize` → `protocolVersion 2025-03-26`，server `domainhunter 1.0.0`；`tools/list` 恰为 `check_domains / tld_prices / suggest_variants`（无 AI 工具）
- `check_domains`：`zalize.com taken expiresAt 2027-07-06T17:17:23Z expiringSoon false`，`zalize.cn taken 2027-08-03`，随机 `.com/.cn` available
- `tld_prices`：408 TLD、`.cn` 为 `approx:true` 参考价（57 条 approx）；结果在 `result.content[0].text`
- `suggest_variants {name:"zalize", tlds:["com","cn"], limit:6}` → 6 个 available（zalizeapp.com/.cn、zalizelabs.cn/.com、zalizehq.cn/.com）；传带 TLD 的名字 → 明确报错 `invalid name: pass a bare label…`
- `/sitemap.xml`：1264 URL（tld 408 / guide 404 / vs 444 / core 8，与 `scripts/content-counts.json` 一致，0 重复）；随机抽样 20 URL 全部 200、canonical 自指、hreflang zh/en/x-default、JSON-LD 2–3 段、无注入
- `/llms.txt`：200，`text/plain`，133 KB，三类计数与 sitemap 一致；`/robots.txt` 引 sitemap 并放行 GPTBot/PerplexityBot/ClaudeBot
- 404：`/no-such-page-r484`、`/tld/zzznotatld`、`/guide/zzz-none`、`/vs/zzz-vs-yyy` 均 HTTP 404 + noindex + 品牌 404 页
- hub 页 `/tld` `/guide` `/vs` SSR 分别含 408 / 404 / 444 个 `href="/tld/x?lang=zh"` 链接（审计脚本初版正则漏了 `?lang=`，已人工复核，非缺陷）

### 2.6 R479 README / README.en / CONTRIBUTING / SECURITY 逐条

| README 功能表 | 生产实况 | 结论 |
|---|---|---|
| AI Agent 多轮猎名 `POST /api/ai-search` 每 IP 20/h | 未调用（硬约束）；源码 `RATE_LIMIT_PER_HOUR = 20` | 未验证（按规则跳过） |
| 实时核验 RDAP/WHOIS 带 `expiresAt` | `/api/check` 与 MCP 均返回 ISO `expiresAt` | 一致 |
| 精确核验不消耗 AI | quick-check 全流程 `searches` 无增量 | 一致 |
| 批量 ≤200 + CSV `POST /api/search` | README 示例 `/api/search` 返回 NDJSON（yunqilab.cn taken / muxinhub.com available） | 一致 |
| 到期日 + 首年价 `/prices` `/api/prices` | `/api/prices` 351 实时价 + 静态参考价补齐至 408；`/prices` h1「408 个主流 TLD」 | 一致 |
| 监控 + Webhook Cron 6h | `/monitors` 渲染正常、`cronLast` 有心跳；Webhook 推送未端到端验证 | 部分验证 |
| 候选清单 + 分享 30 天可撤销 + 同步码 | 分享创建/渲染/撤销 → 410 已验；同步码 UI 存在未走通 | 部分验证 |
| MCP 三工具 | 见 2.5 | 一致 |
| 400+ 内容页 408/404/444 + sitemap + llms.txt | 见 2.5 | 一致 |
| **双主题对比度 ≥4.5:1 为硬指标** | **浅色不成立**（P1-1） | **不一致 → 修复 PR 合入后一致** |
| README.en | 同表英文版，同一条不一致 | 同上 |
| CONTRIBUTING 硬要求（双语/375/双主题/键盘/本地验收/零 AI） | 本轮全部按此执行；本地验收命令与实际一致 | 一致 |
| SECURITY 私密报告 + 不做破坏性测试 | 本轮遵守；未见与线上矛盾的声明 | 一致 |

### 2.7 Lighthouse（生产，`?lh=r484` cache-bust，默认深色）

| 页面 | 桌面 P/A/BP/SEO | 移动 P/A/BP/SEO | 移动 LCP / TBT / CLS |
|---|---|---|---|
| `/` | 0.99 / 1 / 1 / 1 | 0.94 / 1 / 1 / 1 | 2.6s / 50ms / 0 |
| `/tld/cn` | 1 / 1 / 1 / 1 | 0.98 / 1 / 0.96→1（重跑） / 1 | 2.0s / 0 / 0 |
| `/guide/saas` | 1 / 1 / 1 / 1 | 0.98 / 1 / 1 / 1 | 2.2s / 0 / 0 |
| `/prices` | 1 / 1 / 1 / 1 | 0.94 / 1 / 1 / 1 | 3.0s / 30ms / 0 |

### 2.8 键盘 / console / 溢出

- 首页 Tab 顺序：Logo → 高级模式 → 候选清单 → GitHub → 语言 → 主题 → 关闭引导 → AI 猎名 / 精确核验 / 批量核验 → textarea → TLD chips …，每个焦点均有可见 outline（`F-home-kbd-focus-light-desktop.png`）
- console：可见 Chrome 全程 + headless 全程 0 error
- 375px：`/`、`/tld/cn`、`/guide/saas`、`/vs/com-vs-cn`、`/prices`、`/why`、`/mcp`、`/advanced`、`/monitors`、`/shortlist`、`/s/:id`、结果页 `scrollWidth 375 = innerWidth 375`

## 3. 未覆盖 / 需注意

- AI 主链路（`/api/ai-search`）按硬约束零调用，本轮不评价
- Webhook 实际推送、同步码跨设备、批量去注册多窗口未端到端执行
- 浅色 axe 仅跑 5 类页面；修复后其余页面待部署回归
- 生产 `outbound` 计数因 P2-1 与本轮点击（含 HTTP 直连 2 次 + headless 4 次 + 可见浏览器数次）已被污染，属计数噪声，不影响用户
- 测试分享已撤销；shortlist/theme/lang 等本地状态已还原并核对相等

## 4. 本地验收（修复分支，PR 链接：见父会话集成记录）

```
pnpm -r typecheck            # 通过
pnpm --filter web test       # 8 files / 67 tests 通过
pnpm --filter web build      # 通过
```
