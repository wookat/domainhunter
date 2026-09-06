# 安全响应头（R533，关闭 R484 审计 P3-3）

实现：`apps/web/src/security-headers.ts`（纯函数）+ `apps/web/src/worker.ts` HTML 后处理中间件 + `POST /api/csp-report`；测试 `apps/web/src/security-headers.test.ts`。
本轮 CSP **只 Report-Only**，不 enforce；违规计数在 `/api/usage` 的 `days[日].cspReports` 与 `cspSamples`（前 20 条去重 `directive + blockedUri`，不存 UA/IP/页面 URL）。

## 1. worker 产出的响应类型与加头矩阵（本地 wrangler dev `curl -I` 实测，2026-09-06）

| 响应类型 | 例 | content-type | 加头 |
|---|---|---|---|
| HTML 内容页 / 首页 | `/`、`/tld/cn`、`/vs/com-vs-cn`、`/guide/*`、`/shortlist`、`/mcp`（GET 文档页） | text/html | 全套（下表 6 个头 + CSP-RO）+ 全部可执行 `<script>` 加 per-request nonce |
| HTML 壳（404 / 分享 404 / 分享 410） | `/this/does/not/exist`、`/s/nope404`、撤销后的 `/s/:id` | text/html | 全套 |
| `/api/*` JSON | `/api/usage`、`/api/stats`、`/api/prices`… | application/json | 仅 `X-Content-Type-Options: nosniff` + `Referrer-Policy` |
| `POST /mcp` JSON-RPC | tools/list、tools/call | application/json | 仅 nosniff + Referrer-Policy |
| OG 图 | `/api/og/tld/cn` | image/svg+xml | 仅 nosniff + Referrer-Policy |
| sitemap / robots / llms.txt | `/sitemap.xml`、`/robots.txt`、`/llms.txt` | xml / text/plain | 仅 nosniff + Referrer-Policy |
| 静态资源 | `/assets/*.js`、`/assets/*.css`、`/favicon.svg`、`/fonts/*` | 各自 MIME | **不经过 worker，无新增头**（见 §6 发现 1） |

其余原有头（`Cache-Control`、`Vary: Accept-Language`、`ETag`…）原样保留；中间件不设置也不删除任何 CORS 头。

## 2. 各头取值与依据

| 头 | 取值 | 依据 |
|---|---|---|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | [MDN HSTS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Strict-Transport-Security)：`max-age` 建议 ≥ 1 年（31536000）。[OWASP Secure Headers](https://owasp.org/www-project-secure-headers/) 推荐值为 `max-age=63072000; includeSubDomains`（2 年），本轮按任务取 1 年。**不加 `preload`**：[hstspreload.org](https://hstspreload.org/) 要求在 eTLD+1（`zalize.com`）根域名响应、对全部子域生效且撤销需数月才从浏览器列表移除——超出 hunt.zalize.com 这个子域的职权范围，属于整个 zalize.com 的决策。 |
| `X-Content-Type-Options` | `nosniff` | [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Content-Type-Options)、OWASP 同值。对所有 worker 响应（含 JSON/SVG/文本）都加，无副作用。 |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Referrer-Policy)：现代浏览器默认值；跨域只发 origin、降级 HTTPS→HTTP 不发。OWASP 推荐更严的 `no-referrer`，但本站有注册商联盟外链（namecheap.pxf.io 等）需要 origin 级 referrer 归因，故取 MDN 默认值。 |
| `X-Frame-Options` | `DENY` | [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Frame-Options)、OWASP `deny`。与 CSP `frame-ancestors 'none'` 同时下发（MDN：CSP 支持时优先 frame-ancestors，XFO 兼容旧浏览器）。**/s/:id 分享页也 DENY**：grep 全仓无 `<iframe>/<embed>/<object>`，分享页只通过链接打开（`shortlist-page.tsx` 复制链接 / `share-shell` 落地），无嵌入需求。 |
| `Permissions-Policy` | `accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()` | [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Permissions-Policy)。grep `apps/web/src` 无 `getUserMedia / geolocation / PaymentRequest / navigator.usb / DeviceMotion`，全部关闭无影响。取 OWASP 列表中与本站相关的子集（不含 `fullscreen`/`autoplay` 等无害能力，避免误伤）。 |
| `Content-Security-Policy-Report-Only` | 见 §3 | [MDN CSP-Report-Only](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy-Report-Only)：先观察不阻断，用 report 决定是否 enforce。 |

## 3. CSP 白名单证据表

策略（nonce 每请求随机 16 字节 base64）：

```
default-src 'self'; script-src 'self' 'nonce-…' [https://static.cloudflareinsights.com]; style-src 'self' 'unsafe-inline';
img-src 'self' data:; font-src 'self'; connect-src 'self' [https://cloudflareinsights.com]; object-src 'none';
frame-ancestors 'none'; base-uri 'self'; form-action 'self'; report-uri /api/csp-report
```

方括号内仅在 `ANALYTICS_PROVIDER=cloudflare` 配置时追加。

| 指令 | 取值 | 证据（grep `apps/web`，不含 content/ 数据文件） |
|---|---|---|
| `script-src` | `'self' 'nonce-…'` | 可执行脚本 4 处，全部由 `addScriptNonce()` 统一打 nonce：① `index.html:33` 主题初始化 `<script>`；② `index.html:40` 资源重载恢复 `<script>`；③ `index.html:63` → 构建后 `<script type="module" crossorigin src="/assets/index-*.js">`（'self'）；④ `worker.ts:1478` `<script>window.__DH_CONTENT__=…</script>`（内容动态 → 必须 nonce 而非 hash）。JSON-LD `<script type="application/ld+json">`（`worker.ts:1113/1712` 等）是数据块，不受 script-src 约束，不加 nonce。客户端无 `eval` / `new Function` / 内联事件处理器 / `dangerouslySetInnerHTML`（rg 均 0 命中）。 |
| `script-src` 追加 | `https://static.cloudflareinsights.com` | `growth-inject.ts:36` beacon `<script type="module" src="https://static.cloudflareinsights.com/beacon.min.js">`，仅 `ANALYTICS_PROVIDER=cloudflare` 时注入（生产当前未配置，见 handoff）。 |
| `style-src` | `'self' 'unsafe-inline'` | 内联样式 3 类：① `index.html:32` `<style>@font-face…</style>`；② `worker.ts:1535` `inlineStylesheet()` 把整份构建 CSS 内联为 `<style>`；③ React/Radix 运行时 `style={{…}}` 属性 20 处（`rg "style=\{" src --glob '*.tsx'`）。style **属性**无法用 nonce 覆盖（CSP3 只有 `'unsafe-hashes'` + 逐条 hash），且给 style-src 加 nonce 会让 CSP3 浏览器忽略 `'unsafe-inline'` 反而拦掉运行时样式——故本轮保留 `'unsafe-inline'`，不加 nonce。 |
| `img-src` | `'self' data:` | 所有 `<img src>` 均为站内路径（rg 无外链 img）；`data:` 供 SVG/OG 预览与 shadcn 图标内联。 |
| `font-src` | `'self'` | R133 字体自托管 `/fonts/*.woff2`（`index.html:31-32`）。 |
| `connect-src` | `'self'` | 客户端全部 `fetch()` 目标均为 `/api/*`（search/check/prices/registrars/share/sync/monitor/stats/click/ai-search）。**Porkbun / RDAP / DoH 全部是 worker 侧请求**：`prices-fetch.ts:29` `api.porkbun.com`、`packages/core/src/check.ts:14-15` IANA RDAP bootstrap 与 `cloudflare-dns.com`、`whois.ts:31` DoH——浏览器不直连。 |
| `connect-src` 追加 | `https://cloudflareinsights.com` | beacon 向 `cloudflareinsights.com/cdn-cgi/rum` POST，仅分析开启时。 |
| `object-src` | `'none'` | 无 `<object>/<embed>`。 |
| `frame-ancestors` | `'none'` | 同 XFO DENY 论证。 |
| `base-uri` | `'self'` | 无 `<base>`。 |
| `form-action` | `'self'` | 无 `<form>`（搜索框为受控 input + fetch）。 |
| `report-uri` | `/api/csp-report` | 见 §4。**不加 `report-to`**：Chrome 同时存在时会忽略 `report-uri` 改走 Reporting API 延迟批量投递（[MDN report-to](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/report-to)），本地实测 Chrome 137 制造违规后等 130s（默认与非默认 context 各一次）未见任何投递；改为仅 `report-uri`（[MDN report-uri](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/report-uri)，Chrome/Firefox/Safari 均支持）后 2 条违规在 <1s 内 POST 到达并计数。解析器同时兼容 `application/csp-report` 与 `application/reports+json` 两种格式，下轮若切 report-to 无需改解析。 |

注册商外链（porkbun.com / namecheap.pxf.io / dynadot / aliyun / tencent / domains.cloudflare.com / github.com）只是 `<a href>` 导航，不受任何 CSP 指令约束，无需白名单。

## 4. `POST /api/csp-report`

- 只接受 ≤ 16KB 正文（`Content-Length` 或实际长度超限 → 413，不解析）；非 JSON 当作无记录，返回 204 `cache-control: no-store`。
- 每条可解析违规：`usage.cspReports` 日计数 +1（`UsageCounter.cspReport`，与其他计数共用 sharded KV）；样本 `csp:samples:v1` 只留 `{directive, blockedUri（去 query/hash，≤200 字）, count, firstAt, lastAt}`，同键去重累加，上限 20 条，满后新键丢弃。
- 不落 UA、IP、document-uri、source-file、original-policy。
- `/api/usage` 返回 `days[日].cspReports` 与顶层 `cspSamples`。

## 5. 复验记录（2026-09-06，本地 wrangler dev，0 次 AI 调用）

- 四条验收：`pnpm -r typecheck` / `pnpm --filter web test`（33 文件 374 用例）/ `pnpm --filter web build` / `node scripts/check-content-counts.mjs` 全绿。
- `curl -I` 15 条路径（§1 矩阵）：6 类 HTML 全套头齐；`/api/usage`、`/api/stats`、`POST /mcp`、OG SVG、sitemap、robots、llms.txt 仅 nosniff + Referrer-Policy 且 `Cache-Control` 等原样；静态 JS / favicon 无头（§6 发现 1）。
- Playwright（本机 Chrome 137 via CDP）：首页、`/tld/cn`、`/vs/com-vs-cn`、404 壳、`/shortlist` 生成分享 → `/s/:id` 200 → 删除（撤销）→ `/s/:id` 410、`/mcp`：console CSP（Report-Only）违规 **0 条**、`securitypolicyviolation` 事件 0、`/api/csp-report` 请求 0；console 仅 404/410 页的 "Failed to load resource" 属预期。
- 故意违规（追加无 nonce 内联 `<script>` + `https://example.com` 图片）：浏览器 POST 2 条 `application/csp-report` → 204，`/api/usage` `cspReports=2`，`cspSamples` 2 条（`script-src-elem/inline`、`img-src/https://example.com/r533-uri-only.png`，query 已去除）。
- Lighthouse 12.6 best-practices：`/` 与 `/tld/cn` 桌面 + 移动 **4 × 100**；`has-hsts` 仅提示无 `preload`（有意不加，§2）；`csp-xss` 提示 "No CSP found in enforcement mode"（有意 Report-Only）。
- MCP `check_domains` / `tld_prices` / `suggest_variants` 三工具 `isError:false`。

## 6. 发现（只记录，不在本轮范围）

1. **静态资源不经过 worker**：`wrangler.jsonc` `assets.run_worker_first: ["/"]`，按 [Cloudflare 文档](https://developers.cloudflare.com/workers/static-assets/routing/worker-script/) 其余命中静态文件的路径由 Assets 层直出，worker 中间件对 `/assets/*`、`/favicon.svg`、`/fonts/*` 无感（本地 curl 验证）。要给静态资源加 `X-Content-Type-Options: nosniff`，官方途径是 `apps/web/public/_headers` 文件（[Cloudflare 文档](https://developers.cloudflare.com/workers/static-assets/headers/)），不在本轮文件范围。影响评估：HSTS 是按 host 记忆的，浏览器从任一 HTML 响应学到即对整站生效；JS/CSS/SVG 由 Assets 层带正确 `Content-Type`，nosniff 缺失风险低。
2. **`/api/*` 与 `/mcp` 目前没有任何 CORS 头**（生产 `curl -H origin:` `/api/stats`、`/api/registrars`、`POST /mcp` 均无 `Access-Control-Allow-Origin`；`OPTIONS /mcp` 404），worker 也无 `cors()` 中间件。本轮"不影响现有 CORS 头"等价于没有新增/删除任何 CORS 头；若第三方浏览器端 MCP 客户端需要跨域，需另开一轮加 CORS。
3. 客户端 React 无 `dangerouslySetInnerHTML` / 内联事件 / `eval`，若下轮 enforce CSP，唯一需保留的宽松项是 `style-src 'unsafe-inline'`（§3）。
4. Reporting API（`report-to` + `Reporting-Endpoints`）在本地 Chrome 137 未观测到投递（§3），生产 HTTPS 环境是否不同**未验证**；下轮若要用，需在生产观察 `/api/usage` 是否有计数再决定。

## 7. 下一步（enforce 判据）

生产观察 ≥ 7 天 `/api/usage` 的 `cspReports` 与 `cspSamples`：若样本只含浏览器扩展注入（`blockedUri` 为 `chrome-extension:`/`moz-extension:`/`inline` 且 directive 为 `script-src-elem` 但无对应站内脚本）→ 可切 `Content-Security-Policy` enforce；若出现站内资源被拦 → 先补白名单再 enforce。
