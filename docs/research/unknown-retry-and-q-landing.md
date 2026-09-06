# R564 调研：`?q=` 落地精确核验 + unknown 行原因/单行重新核验 + taken 行 CTA 一致

> 对应 R559 体验走查 P2-2 / P2-3 与 R558 审计 P3-1 / P3-2（`docs/audits/ux-walkthrough-r559.md`、`docs/audits/audit-r558.md`）。
> 本文先取证再改码；「已验证」= 本轮生产/本地实测或代码逐行读到；「未验证」= 推断或无法在本轮取证，逐条标注。

## 0. 结论（TL;DR）

| # | 结论 | 证据等级 |
|---|------|---------|
| 1 | 生产批量核验 `.ai` 返回 `unknown/http-429`，是上游 RDAP（identity.digital）限流，不是本站故障；用户此前只看到「未知」无原因、无重试 | 已验证（生产 `POST /api/check?refresh=1` 两次 `.ai` 均 `detail:"http-429"`，§2.1） |
| 2 | `/?q=chaxiang` 落地：SSR 壳正常，但 SPA 落在「AI 猎名」tab，结果在两屏之下（R559 P2-2 原文）；`q` 形如现成域名/名字时应直接进精确核验并滚到结果 | 已验证（R559 截图 + 本轮 mock 走查修前/修后对照） |
| 3 | 后端 `detail` 是稳定短码（`http-429` / `retry-exhausted` / `no-rdap-server` / `reserved` / `unparsed` / 异常 message），**客户端映射**为 9 类可读原因即可，不新增后端字段 | 已验证（`verify.ts` 逐行，§3） |
| 4 | 单行重新核验统一 `POST /api/check?refresh=1`（穿透 KV 缓存直查注册局，0 AI）；此前首页 quick-check 用 `POST /api/search`（走缓存，重试等于重复读缓存） | 已验证（`worker.ts` §4） |
| 5 | **`/api/check` 与 AI 猎名共用同一个每 IP 20 次/小时 KV 桶**（`checkRateLimit` 同 key）；重新核验 20 次后 AI 猎名会被 429。本轮客户端把本站 429 单独归类 `recheck-limited` 提示用户，**分桶留 R565+** | 已验证代码；生产撞桶后果未实测（未验证） |
| 6 | 竞品（Instant Domain Search / Namecheap / Porkbun）对「查询失败」行的处理本轮未能取到一手截图（JS 渲染 + 人机验证），只作为方向参考 | 未验证 |

## 1. 三类 `?q=` 来源与期望行为

| 来源 | 示例 | 现状（R559 实测） | R564 行为 |
|------|------|------|-----------|
| A. 结果页「复制搜索链接」 / 用户手输名字 | `/?q=chaxiang`、`/?q=chaxiang.cn` | 落 AI 猎名 tab，主 CTA「开始猎取」，quick-check 面板在两屏下 | `q` 形如域名/单词名 → 选中「精确核验」tab、**自动核验**、首批结果到达后滚到 `[data-quick-check]` |
| B. `/tld/:tld`、`/guide/:slug` 页 CTA | `/?q=茶叶电商&tpl=...`、`/?q=想一个有寓意的茶品牌` | 落 AI 猎名（正确） | 不变：含中文/空格/多词的寓意描述仍走 AI 猎名，**0 自动请求**（避免自动消耗 AI 配额） |
| C. 显式模式 | `/?mode=exact`、`/?mode=exact&q=…` | 无此参数 | `mode=exact` 强制精确 tab；无 `q` 时不自动请求；`tpl=` 存在时保持 AI 入口除非显式 `mode=exact` |

判定函数 `landingSearchMode(search, looksExact)` / `isExactQueryLanding()`（`apps/web/src/lib/q-landing.ts`）：`mode=exact` > `tpl=`（AI）> `q` 是否「像现成名字」（既有 `looksExactName` 规则：字母数字连字符单词、或带已知 TLD/多级后缀如 `com.cn`）。显式 exact 覆盖本地保存的 tab 偏好。

自动请求只在 exact landing 触发，且只发 `POST /api/search`（不含 AI）——本轮 mock 走查 `?q=<寓意>` 0 次核验/AI 请求，`?mode=exact` 无 q 0 请求（§6）。

## 2. 生产观测（只读、0 AI，2026-09-06）

### 2.1 `POST /api/check?refresh=1` 真实返回（脚本 `docs/qa/prod_probe_r564.sh`）

```
chaxiang.ai          unknown   rdap   detail=http-429            8.9s
lingxicha.ai         unknown   rdap   detail=http-429            8.6s
nic.cn               taken     dns                               1.3s
google.com           taken     rdap   expiresAt=2028-09-14       1.7s
r564zz<ts>.cn        available whois                             1.3s
baidu.com.cn         taken     whois  expiresAt=2029-02-15       3.6s
```

- `.ai` 两次均 `http-429`：与 R559 走查「批量 `.ai` 全未知」一致，来源是上游 RDAP；8.6–8.9s 是 3 次 3s 超时/重试后放弃（`verify.ts` 重试逻辑）。**这类 unknown 是瞬态、值得重试的**。
- `.cn` / `.com.cn` 走 WHOIS 带到期日；`nic.cn` 走 DNS 兜底无到期日（→ taken 行到期日「有则显示」，无则只显示已注册）。
- 全程未调用 `/api/ai-search`。

### 2.2 `/?q=chaxiang` SSR

HTTP 200，`<title>DomainHunter — 中文创业者的域名猎手 | …`，壳无 `q` 相关差异（tab 选择在 SPA 水合后决定，见 §1）。

### 2.3 `/api/usage` 前后对照（间隔 ≥65s，KV 最终一致）

```
2026-09-06  searches 0→0  fast 0→0  refine 0→0  aiErrors —→—  fallbacks —→—  llmProvider —→—
pageviews.home 170→171（探针访问 /?q=chaxiang 的预期副作用）
```

AI/搜索相关计数零变化；`pageviews.home +1` 是本探针自己的页面访问，不是「全字段 byte-for-byte 不变」。

## 3. unknown 行：后端 `detail` 到底有哪些值（`apps/web/src/lib/verify.ts` 逐行）

| `method` | `detail` 实际取值 | 含义 | R564 客户端类别 → 文案 key |
|---|---|---|---|
| rdap | `http-429` | 注册局 RDAP 限流 | `rate-limited` → `unknown.reason.rate-limited`「注册局限流，稍后重试」 |
| rdap/whois | `http-5xx` / `http-4xx`（非 429） | 注册局接口异常 | `registry-error` |
| rdap | `retry-exhausted`、`TimeoutError…`、`…aborted…` | 3s×3 超时耗尽 | `timeout` |
| none | `no-rdap-server` | 该 TLD 无 RDAP/WHOIS 通道 | `no-rdap`（可重试但大概率仍未知） |
| whois | `reserved` | 注册局保留（如 `.ai` 部分短名、`.cn` 保留字） | `reserved` → **不显示重试**，状态字改「注册局保留」 |
| whois | `unparsed` | WHOIS 文本无法解析 | `unparsed` |
| * | `TypeError: fetch failed` / `ECONN…` / `socket…` | 网络错误 | `network` |
| * | 空 / 其它异常 message | — | `generic`「暂时无法确认」 |
| （客户端本地） | `recheck-429` | 本站 `/api/check` 返回 429（共用 20/h 桶，§4） | `recheck-limited`「重新核验太频繁，这一小时已达上限」 |

实现：`apps/web/src/lib/check-client.ts` `unknownReason(detail)` 纯函数 + `unknownReasonKey()`；DOM 上 `data-unknown-reason` 只放归一化类别（不放原始 detail，避免上游异常文本进入 DOM/日志）。`reserved` 与瞬态 unknown 严格分离：`isRetryableUnknown(detail) === detail !== "reserved"`。

不新增后端字段的理由：现有短码已足够分类；后端若返回上游 raw body 会有泄露风险（R470 已把 LLM 上游 body 只记日志不返回，同一原则）。

## 4. `/api/search` vs `/api/check?refresh=1`（`apps/web/src/worker.ts`）

| | `POST /api/search` | `POST /api/check?refresh=1` |
|---|---|---|
| 用途 | 首页精确核验批量（name × TLD） | shortlist/monitors 重新核验、advanced 批量粘贴 |
| 缓存 | 读 KV `d:{domain}`；只回写 available/taken（`CACHE_TTL_*`），**unknown 从不写缓存** | `refresh=1` 穿透缓存直查注册局（对已缓存的 taken/available 也重查） |
| 限流 | 无 | `checkRateLimit(kv, ip)`：**与 `/api/ai-search`、MCP 同一 `rl:${ip}:${hour}` 桶，20 次/小时** |
| 上限 | 由 name × TLD 组合决定 | `MAX_RECHECK_DOMAINS = 100` |
| AI | 否 | 否 |

R558 P3-2 指出首页 quick-check unknown「重试」走 `/api/search`。逐行读 `checkDomainsCached()` 后修正一个此前口径：unknown **从不**进 KV，所以旧重试对 unknown 行功能上也会重查注册局；两者真实差异是 (a) `/api/check?refresh=1` 对 taken 行也能刷新到期日/状态（shortlist/monitors 一直如此），(b) `/api/check` 受限流保护、`/api/search` 不受——一个端点两种语义会让「重新核验」的行为与文案随入口不同。R564 三处（首页 quick-check、`/advanced`、Results/shortlist）统一 `recheckDomains()`（`check-client.ts`）：恰 1 次 `POST /api/check?refresh=1`，body `{domains:[d],refresh:true}`，NDJSON 流式读取；HTTP 非 2xx 抛 `RecheckHttpError(status)`，调用方保留原行状态，429 时把行 `detail` 置 `recheck-429`。

**共用桶的产品风险（已验证代码，后果未在生产实测）**：用户对 20 个 unknown 行逐个重新核验后，同一小时 AI 猎名会被 429 且提示「AI 猎名每小时 20 次」，与用户行为不符。R564 只做客户端提示（`recheck-limited`），**建议 R565+ 为 `/api/check` 独立桶（如 `rlc:` 60/h）**，届时同步改文案。

## 5. taken 行 CTA 一致性（R558 P3-1）

R548 把「不显示注册价 / 不出去注册」落到三处，但「开监控 / 重新核验」CTA 只在 `shortlist-page.tsx`。R564 抽出 `WatchCta`（`always` + `expiresAt`）与 `RecheckButton`（原生 `<button>`、`aria-label`/`title`、移动端 ≥44px）到 `domain-row.tsx`，首页 quick-check / `/advanced` / Results 三处 taken 行统一：`已注册 · 到期 YYYY-MM-DD（有则显示）· ★ · 开监控 · 重新核验`，无「去注册」。

375px 回归时发现首页 taken chip 因新增第三个图标按钮把域名挤成 `chax…`（R166 曾修过同类问题），本轮把 chip 文本区改 `flex-wrap`，域名整行可见（截图 `screenshots/r564/landing-375.png`）。

## 6. 竞品参考（方向性，未取到一手截图 → 未验证）

- Instant Domain Search：既往横评（`docs/competitor-teardown-r101.md`、`docs/audits/ux-walkthrough-r545.md`）记录其把中文当 IDN 字面查；对查询失败行的呈现本轮未复测。
- Namecheap Beast Mode：人机验证拦截（`ux-walkthrough-r545.md` 已记），未验证。
- Porkbun 搜索：JS 渲染，未验证。

因此「未知行要给原因 + 单行重试」不是抄竞品，而是由 §2.1 生产事实（`.ai` 全 429、8.9s 后只剩一个「未知」）直接推出的最小修复。

## 7. 验证方式与结果

### 7.1 本地（全 API mock，0 真实上游，0 AI）

`docs/qa/audit_browser_r564.py`（连接已运行 Chrome CDP，`wrangler dev :8787`）**25/25 通过**：

- desktop/375：`/?q=chaxiang` 精确 tab 选中、结果区在首屏、无横向溢出、自动核验恰 1 次 `/api/search` 0 次 `/api/ai-search`；
- unknown 原因双语（`http-429`→限流、`reserved`→保留且无重试、其它→暂时无法确认）；重试触点 44×44；
- taken 行：开监控 + 到期 + 重新核验，无去注册；
- 重试恰 1 次 `POST /api/check?refresh=1`，重试后行更新为 taken + 2027 到期、原因消失；
- `?q=<寓意>` 仍 AI 猎名且 0 请求；`?mode=exact` 无 q 0 请求；
- `/advanced` 与 Results（需先点「全部」，Results 默认只显示可注册）同样断言通过。

截图：`docs/research/screenshots/r564/`（landing / after-retry ×2 视口、advanced、results）。

### 7.2 单元/门禁

`pnpm -r typecheck` ✓ · `pnpm --filter web test` 504/504 ✓（新增 `check-client.test.ts`、`q-landing.test.ts`、`domain-row-recheck.test.ts`）· `pnpm --filter web build` ✓ · `node scripts/check-content-counts.mjs` ✓。

### 7.3 生产（只读探针，§2）

已验证 `/api/check?refresh=1` 真实路径与 `.ai http-429` 事实；**R564 代码本身未部署**，生产 UI 行为待部署后按 `testing-domainhunter` SKILL 做零 AI 回归（storage 备份/还原、usage 前后对照）。

## 8. 未做 / 后续

- `/api/check` 独立限流桶（§4）→ R565+。
- unknown 不缓存意味着 `.ai` 全 429 时每次首页核验都会再撞上游一次 → 是否对 `http-429` 做短 TTL 负缓存 → 未评估。
- Results 折叠的「已注册摘要」是否需要独立 CTA → 本轮沿用 R548 摘要，不加。
- 竞品失败行呈现一手取证（§6）。
