# R480 注册商联盟计划（affiliate）一手调研 + 返佣可配置化设计

> 调研日期 2026-09-04。全部结论只依据各家**官方公开页面**（下方均为可点击链接，均于当日实际打开/抓取核对）；官方页面没写清或页面被反爬拦截的地方一律标 **未查到**，不做推测。佣金比例为官方页面当日文字，随时可能变化，申请前以官方页面为准。

## 0. 一句话结论

| 注册商 | 有联盟计划？ | 佣金（官方口径） | 链接形态 | .cn/.com.cn | 建议 |
|---|---|---|---|---|---|
| Porkbun | **已停止**（官方页原文 "The affiliate program has been discontinued."） | — | — | 不售 .cn（定价 API 无 cn） | 保留为默认非 .cn 入口（价格便宜、已有实时价），**不填返佣** |
| Namecheap | 有（Impact / CJ） | 域名注册/转入 **20%** | 联盟平台生成跳转链（Impact），非固定 query | 页面被 Cloudflare 拦截，**未查到** | **首选申请**（全球通用） |
| Cloudflare Registrar | **未查到任何 Registrar 联盟计划**；官方称按成本价 "at-cost" 售卖 | — | — | TLD 政策数据无 .cn/.com.cn | 保留纯链接，不定义 affiliate（代码里明确不支持） |
| 阿里云（云大使 / 云推官） | 有推广计划，但**域名是否返佣未查到** | 官方材料 10%–35%（按规则 25%–45%），针对云产品 | 专属推广链接（`userCode` 类参数） | 支持 .cn（主力） | 申请后**先在后台确认"域名"是否在返佣商品表**，再填参数 |
| 腾讯云（云推官 CPS） | 有推广计划，但**域名是否返佣未查到** | 官方 20%–35%（首购云产品） | 专属推广链接 | 支持 .cn（主力） | 同上 |
| GoDaddy | 有（CJ Affiliate） | 官方页未写具体比例，**未查到** | CJ 生成跳转链 | 页面被拦截，**未查到** | 暂不新增（利益一般、UX 复杂） |
| Dynadot | 有（Ambassador 30% / CJ 25%，二选一） | 域名注册/转入 30%（Ambassador） | 专属推广链接 | **售 .cn / .com.cn**（R503 官方 TLD 页 + 中文站 + 人民币/支付宝，见 §4） | **R503 已新增**（id `dynadot`，待老板申请 Ambassador） |
| Spaceship | 有（Impact） | 域名注册/转入 25%，主机/邮箱 50%（入门档） | Impact 跳转链 | **不售**（官方搜索页原文 ".cn is currently unavailable at Spaceship"，见 §4） | **R503 决定不加**（无 .cn、无中文站、与 Porkbun/Namecheap 同质） |
| NameSilo | 有（自营） | 新客首单 **10%** | 站内推广链接 | .cn 页 HTTP 200，联盟是否覆盖 .cn **未查到** | 暂不新增（比例低） |

## 1. 逐家证据

### 1.1 Porkbun
- 官方联盟页：<https://porkbun.com/affiliate> —— 页面顶部原文 **"The affiliate program has been discontinued."**；页面下方残留旧 "Ambassador" 文案与条款（历史内容，不代表可申请）。
- 旧协议：<https://porkbun.com/legal/agreement/affiliate_agreement>
- .cn 支持：Porkbun 公开定价接口 `https://api.porkbun.com/api/json/v3/pricing/get` 返回的 TLD 表含 com/net 等，**不含 cn / com.cn** → Porkbun 不售 .cn，代码里 `supportsTld` 对 .cn 系列返回 false。
- 结论：**当前无可申请计划**。保留为非 .cn 域名默认入口（站内已有 Porkbun 实时价），不配置返佣。

### 1.2 Namecheap
- 官方联盟页：<https://www.namecheap.com/affiliates/> —— 通过 **Impact** 与 **CJ (Commission Junction)** 两个联盟平台运作。
- 佣金（官方知识库）：<https://www.namecheap.com/support/knowledgebase/article.aspx/9933/55/what-are-the-namecheap-commission-rates/> —— 域名注册/转入 **20%**，主机/SSL 35%，Private Email / PremiumDNS 20%。
- 联盟 ID 位置：<https://www.namecheap.com/support/knowledgebase/article.aspx/10010/55/how-to-find-your-affiliate-id/>
- 链接形态：由 Impact/CJ 后台生成**跳转链**（Impact 跳转链通常是联盟专用域 + 编码后的目标 URL 参数；**具体 host/参数名本轮未从官方页面查到**，下文示例 `namecheap.pxf.io/...?u=` 仅为占位示意）。因此本仓库实现了 `redirect` 模板 + `{url}` 占位，把站内搜索页 URL 编码后填进目标参数。**精确链接以后台生成为准**，不要手写。
- .cn：域名搜索页对无头抓取返回 Cloudflare 拦截页，**未查到**（Namecheap 售 .cn 属常识但本轮未拿到官方页面证据，标未查到）。→ **R503 用真实浏览器查到：搜索页对 `*.cn` / `*.com.cn` 显示 "Unsupported TLD"，且 `/domains/registration/cctld/cn/` 404 —— Namecheap 不售 .cn，代码已对 .cn 系列 `supportsTld=false`（见 §4.3）。**
- 结论：**首选申请**。

### 1.3 Cloudflare Registrar
- 产品页：<https://www.cloudflare.com/products/registrar/> —— 官方定位 "at-cost"（按注册局批发价 + ICANN 费售卖，不加价）。
- 文档：<https://developers.cloudflare.com/registrar/> ；支持 TLD：<https://developers.cloudflare.com/registrar/top-level-domains/>（页面数据 `https://www.cloudflare.com/page-data/tld-policies/page-data.json` 中**无 cn / com.cn**）。
- 联盟：翻查产品页/文档/`cloudflare.com/partners` 均**未查到**任何 Registrar 联盟或返佣计划（成本价模式下无佣金空间，与父会话预判一致，但这是"未查到"而非官方否认）。
- 结论：代码里 Cloudflare **不定义 `affiliate`**，即使配置里误填 cloudflare 参数也保持纯链接；`supportsTld` 对 .cn 系列返回 false。

### 1.4 阿里云（云大使 / 云推官）
- 推广入口：<https://promotion.aliyun.com/ntms/yunparter/index>
- 帮助文档：<https://help.aliyun.com/zh/document_detail/180706.html>
- 规则/商品材料：<https://developer.aliyun.com/article/1376285> 、<https://developer.aliyun.com/article/1526310> —— 云产品首购/复购返佣区间官方材料写 10%–35%（部分规则档 25%–45%）。
- 链接形态：云大使后台生成**带个人推广码的专属链接**（材料中为 `userCode` / `usedcode` 一类 query 参数，附着在阿里云商品页 URL 上）。本仓库以 `query` 形式支持：`{"aliyun": {"query": {"userCode": "xxxx"}}}` → 追加到万网搜索页 URL。**注意万网搜索页 URL 含 `#/?keyword=` hash 路由**，实现会把参数插到 `#` 之前（单测覆盖）；阿里云后台是否认可该位置**未查到**，拿到码后需用真实链接点一次在后台看是否记录。
- 域名是否返佣：翻到的官方商品表以 ECS/OSS/RDS 等云产品为主，**"域名注册"是否在返佣商品目录未查到**。
- .cn：万网是 .cn 主力注册商（支持）。

### 1.5 腾讯云（云推官 CPS）
- 官方页：<https://cloud.tencent.com/act/partner/cps> —— 首购返佣官方口径 20%–35%。
- 返佣商品列表（官方社区文章）：<https://cloud.tencent.com/developer/article/1825991> —— 列表含 CVM/COS/DNS/SSL/轻量等，**未看到"域名注册"**，标未查到。
- 链接形态：云推官后台生成专属推广链接（带推广参数）；本仓库以 `query` 或 `redirect` 均可承载。
- .cn：腾讯云是 .cn 主力注册商（支持）。

### 1.6 GoDaddy
- 官方联盟页：<https://www.godaddy.com/affiliate-programs> —— 通过 **CJ Affiliate**，覆盖域名/主机/建站/SSL。
- 佣金：官方页**未写具体比例**（搜索结果里的 "10%" 为第三方转述，不采信），标未查到。
- .cn：域名搜索页被 Cloudflare 拦截，**未查到**。
- 结论：暂不新增。

### 1.7 Dynadot
- 官方联盟页：<https://www.dynadot.com/affiliate> —— 两种方案**二选一**：Ambassador（站内）域名注册/转入 **30%**（拍卖/预订类 15%）；CJ 域名注册/转入 **25%**。
- 链接形态：Ambassador 后台生成专属推广链接。
- .cn：<https://www.dynadot.com/domain/cn> HTTP 200（有售）；联盟是否对 .cn 订单返佣**未查到**。
- 结论：**下一轮值得新增**为 global 备选（本轮不改注册商列表，避免 UI 菜单过长；新增只需在 `REGISTRARS` 加一项 + 单测）。→ **R503 已落实，详见 §4。**

### 1.8 Spaceship
- 官方联盟页：<https://www.spaceship.com/affiliate-program/> —— 通过 **Impact**；入门档域名注册/转入 **25%**、主机/邮箱 50%；月结，最低起付等值 US$10。
- 链接形态：Impact 跳转链（同 Namecheap）。
- .cn：域名页被拦截，**未查到**。→ **R503 用真实浏览器查到：不售 .cn / .com.cn，详见 §4。**
- 结论：可选新增。→ **R503 决定不加。**

### 1.9 NameSilo
- 官方联盟说明：<https://www.namesilo.com/support/v2/articles/account-options/affiliate-program-manager> —— 新客户首单 **10%**（注册/转入），推荐有效期 1 年，账户余额/PayPal 结算。
- .cn：<https://www.namesilo.com/domain/cn> HTTP 200（有售；R490 复查该 URL 已 404，页面可能已迁移）；联盟覆盖**未查到**。
- 结论：比例低，暂不新增。

## 2. 设计论证（现状 → 方案 → 验证）

**现状证据**（基线 `deploy/r192-r195` @ 8a03a35）：
- `apps/web/src/lib/registrars.ts` 只有 `{name, key?, url}` 五家纯搜索链接；
- `results-page.tsx` 键盘 Enter 硬编码 Namecheap URL；`home-page.tsx` / `monitors-page.tsx` 用 `REGISTRARS[0]`（Porkbun）、`shortlist-page.tsx` 批量注册用 `REGISTRARS[3]`（Namecheap）——按数组下标取注册商，顺序一改就错；
- 所有外链 `rel="noreferrer"`，无 `sponsored`，无点击计数；.cn 域名也把不售 .cn 的 Porkbun 排第一。

**方案**（本 PR）：
1. `Registrar = { id, name, region: "cn"|"global", url(d), affiliate?(d, params), supportsTld?(tld) }`，`REGISTRARS` 为唯一数据源。
2. 返佣参数是**公开配置、非 secret**：`wrangler.jsonc` → `vars.REGISTRAR_AFFILIATE_JSON`（默认 `"{}"`）→ Worker `GET /api/registrars` 返回 `{affiliate}`（`cache-control: public, max-age=300`，改配置重新部署后最多滞后 5 分钟生效）→ 前端 `lib/affiliate.ts` 启动后拉一次（`useSyncExternalStore`），拉取前/失败/为空都等价于 `{}`。**未配置时所有 href 与基线字节级一致**（单测断言）。
3. 参数两种形态，覆盖调研到的两类联盟：
   - `query`：追加到搜索 URL（阿里云/腾讯云类"个人推广码"），hash 路由的 URL 会插在 `#` 前；
   - `redirect`：联盟平台跳转链模板，`{url}` 占位替换为 `encodeURIComponent(搜索 URL)`（Namecheap/Spaceship/GoDaddy/Dynadot 的 Impact/CJ 类）。两者可叠加（先 query 再 redirect）。
   - 校验：未知 id、非对象、非 https 的 redirect、缺 `{url}`、坏 JSON → 全部忽略回落 `{}`；Cloudflare 无 `affiliate` 函数，配置也不生效。
4. 排序 `registrarsFor(domain)`：`isCnTld`（`cn`、`com.cn`、`*.cn`）→ 先 region=cn（阿里云、腾讯云）再 global；否则先 global（Porkbun、Namecheap、Cloudflare）再 cn；再过滤 `supportsTld` 为 false 的（Porkbun/Cloudflare 对 .cn）。`primaryRegistrar(domain)` = 首项，供 Enter 键、首页速注 chip、监控页"注册"链、批量注册使用——**四处入口与注册菜单首项永远一致**。
5. 全部外链走 `components/registrar-link.tsx`：`RegistrarAnchor`（`target=_blank`、`rel` 有返佣时 `noopener noreferrer sponsored` 否则 `noopener noreferrer`、双语 `title`、onClick 计数）与 `openRegistrar`（非 `<a>` 场景）。
6. 计数：`POST /api/click {registrar, tld}` → 现有 `usage:YYYY-MM-DD` 日聚合 KV 增 `outbound: {porkbun: n, …}` 与 `outboundByTld`（非 TLD_LIST 内 TLD 归 `other`）；`/api/usage` 原样透出。**不含域名、不含 IP/UA/任何个人信息**；`sendBeacon` 优先，失败退 `fetch keepalive`，任何失败不影响跳转。
7. 页脚（home/results）「返佣声明」双语一行，**仅当配置里至少有一家能生效**（`hasActiveAffiliate`）时渲染。

**验证方式**：`pnpm -r typecheck` / `pnpm --filter web test`（新增 `lib/registrars.test.ts` 15 例：未配置=原链接、query/redirect/叠加、Cloudflare 忽略、.cn 与非 .cn 排序、确定性、大小写、坏配置回落）/ `pnpm --filter web build`；本地 `wrangler dev` 用 curl 验 `/api/registrars`、`/api/click`（含 400 分支）与 `/api/usage.outbound`；UI 截图 results/home/monitors 三处入口（zh、375px + 桌面）。

## 3. 需老板操作（Owner checklist）

> **单一事实源：[`docs/owner-actions.md`](../owner-actions.md)**（R490 起所有老板待办及其当前状态只在那里维护；本节保留为调研证据，不再更新）。

> 全部是**公开推广参数**，不是 API key，可以直接写进 `apps/web/wrangler.jsonc` 提交（仓库不写任何 secret 的规则不受影响）。没拿到之前什么都不用填，站点行为与现在完全一致。

### 3.1 申请（按优先级）
1. **Namecheap**（全球域名 20%）→ <https://www.namecheap.com/affiliates/> 选 Impact 或 CJ 注册；通过后在 Impact 后台为 `https://www.namecheap.com/domains/registration/results/` 生成 **Deep Link**，拿到形如 `https://namecheap.pxf.io/c/XXXX/YYYY/ZZZZ?u=` 的跳转链。
2. **阿里云云大使**（.cn 主力）→ <https://promotion.aliyun.com/ntms/yunparter/index> 登录阿里云账号加入；在后台**先确认"域名注册"是否在返佣商品目录**（本轮未查到），再复制专属推广链接，记下其中的推广码参数名与值（如 `userCode=abc123`）。
3. **腾讯云云推官**（.cn 主力）→ <https://cloud.tencent.com/act/partner/cps> 登录腾讯云账号加入；同样先确认域名是否返佣，再拿专属推广链接/参数。
4. **Dynadot Ambassador 30%**（R503 已新增注册商）→ <https://www.dynadot.com/affiliate> ；填 `REGISTRAR_AFFILIATE_JSON` 的 `dynadot` 键（见 §4.6）。Spaceship 不加，无需申请。
5. 不用申请：Porkbun（计划已停止）、Cloudflare（未查到计划）。

### 3.2 拿到 ID 后如何填（两种形态，任选/可叠加）
编辑 `apps/web/wrangler.jsonc` 的 `vars.REGISTRAR_AFFILIATE_JSON`（值是**字符串**，内层 JSON 引号要转义），例如：

```jsonc
"vars": {
  "REGISTRAR_AFFILIATE_JSON": "{\"namecheap\":{\"redirect\":\"https://namecheap.pxf.io/c/XXXX/YYYY/ZZZZ?u={url}\"},\"aliyun\":{\"query\":{\"userCode\":\"abc123\"}},\"tencent\":{\"query\":{\"fromSource\":\"gwzcw.xxxx\"}}}"
}
```

- `redirect`：联盟平台给的跳转链，把里面"目标 URL"的位置写成 `{url}`（必须 https，必须含 `{url}`）；
- `query`：直接追加到注册商搜索页的参数，`{"参数名":"值"}`；
- 合法 id 只有 `porkbun` / `namecheap` / `dynadot`（R503）/ `aliyun` / `tencent`（`cloudflare` 写了也无效）；写错的项会被自动忽略，不会弄坏链接。
- 本地验证：`pnpm --filter web build && cd apps/web && npx wrangler dev --port 8787`，`curl -s localhost:8787/api/registrars` 应回显解析后的配置；页面里任一"注册"链接 `rel` 应含 `sponsored`，页脚出现返佣声明。
- 上线：提交该文件 → 走现有 `deploy/r192-r195` 集成部署（`pnpm deploy`）。**不要**在 Cloudflare 控制台单独改变量：`wrangler deploy` 默认会用 `wrangler.jsonc` 的 vars 覆盖控制台值（官方文档：<https://developers.cloudflare.com/workers/configuration/environment-variables/>）。
- 观察：`GET /api/usage?days=7` 每日项新增 `outbound: {namecheap: n, …}` 与 `outboundByTld`，对照各联盟后台的点击数即可判断参数是否被承认。

### 3.3 合规提示
- 配置任一家后，首页/结果页页脚会自动出现双语「返佣声明」（Impact/CJ 与国内推广联盟条款一般都要求披露），链接 `rel` 自动加 `sponsored`（Google 对付费/推广链接的要求）。
- 本站只跳转，不代注册、不代付款；注册商价格由注册商页面为准。

## 4. R503：Dynadot / Spaceship 是否新增（一手复核，2026-09-04 23:30–23:50 UTC）

> 取证方式：Dynadot 页面用 `curl` 直接抓取官方 HTML（HTTP 200）；Spaceship / Namecheap 对 `curl` 一律 403/挑战页，改用本机真实 Chrome（Playwright over CDP）打开官方页面读取渲染后文本并截图。本机不在中国大陆，**大陆可达性无法从本机判断**（§4.5）。逐项标注 **[验证]**（当日官方页面原文/数据）、**[未验证]**（未拿到官方证据）、**[推断]**。

### 4.1 .cn / .com.cn 支持与实名材料

| 项 | Dynadot | Spaceship |
|---|---|---|
| 售 .cn | **[验证] 有售**：<https://www.dynadot.com/domain/cn>（注册/续费/转入均 $5.36）；中文页 <https://www.dynadot.com/zh/domain/cn>（`<title>` ".CN 域名 \| 注册您的 .CN 域名"） | **[验证] 不售**：搜索页 <https://www.spaceship.com/domain-search/?query=r503probe-zz.cn> 原文 **".cn is currently unavailable at Spaceship. Check other options below."**；TLD 页 `/domains/cctld/cn/` 404 |
| 售 .com.cn | **[验证] 有售**：<https://www.dynadot.com/domain/com.cn>（$5.36；页面 `<title>` 误写 ".COM.IN"，正文 68 处均为 .COM.CN，含 CNNIC 限制说明） | **[验证] 不售**：搜索页原文 ".com.cn is currently unavailable at Spaceship." |
| 实名材料 | **[验证]** 官方 .cn 页 "Restrictions"：CNNIC 审核，个人需身份证/护照照片，企业需身份证 + 营业执照/注册文件；中文帮助页 <https://www.dynadot.com/zh/help/question/cn-domain-requirements> | 不适用（不售） |

### 4.2 中文界面 / 人民币 / 支付宝 / 微信

| 项 | Dynadot | Spaceship |
|---|---|---|
| 中文界面 | **[验证]** `https://www.dynadot.com/zh/...` 整站中文（域名页、帮助中心均有 zh 版本） | **[验证] 无**：真实 Chrome 打开 <https://www.spaceship.com/zh/domains/> 被 302 回 `/domains/`，`<html lang="en-US">`；加 `Accept-Language: zh-CN` 亦同 |
| 人民币计价 | **[验证]** 帮助页 <https://www.dynadot.com/zh/help/question/payment-methods>（更新 2026/07/21）："我们接受以下货币的支付：美元 … **人民币 (CNY)** …"；英文页 <https://www.dynadot.com/help/question/currencies-accepted> 同 | **[未验证]** 页面只显示 US$，未找到币种切换/CNY 说明 |
| 支付宝 | **[验证]** 同上帮助页支付方式列表含 **支付宝**、**银联**；专题页 <https://www.dynadot.com/zh/domain/alipay> | **[验证]** 官网页脚 "Display of available payment options" 图标 alt 含 **Alipay**、**UnionPay**（但计价仍为 USD） |
| 微信支付 | **[验证] 无**：帮助页支付方式列表（信用卡/贝宝/支付宝/派安盈/银联/Apple Pay/Google Pay/加密货币/UPI/Pix…）**不含微信** | **[验证] 无**：页脚支付图标不含 WeChat Pay |

### 4.3 价格对比（USD，官方页面当日文字，抓取 2026-09-04 23:35–23:45 UTC；首年 / 续费）

| TLD | Dynadot | Spaceship | Porkbun（定价 API） | Namecheap |
|---|---|---|---|---|
| .com | 10.88 / 10.88 <https://www.dynadot.com/domain/com> | **8.88** / 9.98 <https://www.spaceship.com/domains/gtld/com/> | 11.08 / 11.08 | 10.98（新客码 6.79）/ **18.48** <https://www.namecheap.com/domains/registration/gtld/com/> |
| .cn | **5.36 / 5.36** <https://www.dynadot.com/domain/cn> | 不售 | 不售（API 无 cn） | **不售**（搜索页 "Unsupported TLD"；`/cctld/cn/` 404） |
| .com.cn | **5.36 / 5.36** <https://www.dynadot.com/domain/com.cn> | 不售 | 不售 | 不售（"Unsupported TLD"） |
| .io | 28.89（促）/ 53.50 <https://www.dynadot.com/domain/io> | 31.98 / 51.75 <https://www.spaceship.com/domains/cctld/io/> | **28.12** / **51.80** | 34.98 / 75.98 <https://www.namecheap.com/domains/registration/cctld/io/> |
| .ai | 85.60 / 85.60（转入 171.20） <https://www.dynadot.com/domain/ai> | **79.98** / 79.98（最少 2 年） <https://www.spaceship.com/domains/cctld/ai/> | 82.70 / 82.70 | 89.98 / 92.98（页面 2 年档 179.96 / 229.96） <https://www.namecheap.com/domains/registration/cctld/ai/> |

- Porkbun 数据来源：`POST https://api.porkbun.com/api/json/v3/pricing/get`（23:39 UTC，HTTP 200）。**[验证]**
- 全部为页面当日文字/接口返回，促销价随时变化；本站只做跳转，价格以注册商页面为准。
- 结论 **[推断]**：Spaceship 只在 .com/.ai 便宜 1–3 美元，与 Porkbun/Namecheap 同质；Dynadot 是四家里**唯一**同时有 .cn/.com.cn 且价格与阿里云/腾讯云同量级（≈¥39）的海外商。

### 4.4 联盟计划

| 项 | Dynadot | Spaceship |
|---|---|---|
| 平台 | **[验证]** Ambassador（站内）或 CJ，**二选一** <https://www.dynadot.com/affiliate> ；<https://www.dynadot.com/help/question/affiliate-get-started> | **[验证]** Impact <https://www.spaceship.com/affiliate-program/> |
| 佣金 | **[验证]** 域名注册/转入 **30%**（Ambassador）/ 25%（CJ） <https://www.dynadot.com/help/question/commission-structure-Ambassador> | **[验证]** 域名注册/转入 **从 25% 起**，主机/邮箱从 50% 起；一般只计新客首购；Premium/Marketplace 域名等除外 |
| Cookie | **[验证]** 30 天（自首次点击） | **[验证]** 30 天 |
| 加入门槛 | **[验证]** 免费申请、需审核；官方未列硬性门槛 | **[验证]** 任何人可申请、需审核，期望有相关活跃平台；最低起付等值 US$10，月结 |
| 追踪参数格式 | **[未验证]** 官方帮助页 <https://www.dynadot.com/help/question/generate-ambassador-referral-link> 只说 "Once approved, you'll be given the instructions for creating your affiliate link via email"，**未公开 `ref=`/`aff=` 之类参数名**。代码同时预留 `query`（若邮件给的是站内参数）与 `redirect`（若走 CJ 深链）两种形态 | **[未验证]** Impact 跳转链，官方页未公开格式（同 Namecheap） |
| 联盟是否覆盖 .cn 订单 | **[未验证]**（帮助页未按 TLD 区分） | 不适用 |

### 4.5 大陆可达性

本机（非大陆 vantage）各 3 次 DNS + HTTPS（23:44 UTC）：
- `www.dynadot.com` → A 104.16.239.120 / 104.16.240.120（Cloudflare），HTTP 200 ×3，0.09–0.12 s。
- `www.spaceship.com` → CNAME `www.spaceship.com.cdn.cloudflare.net`（Cloudflare），HTTP 403 ×3（对 curl 的机器人挑战，真实浏览器可开）。
- **结论 [未验证]：两家均托管在 Cloudflare 全球 anycast，从本机无法判断大陆访问质量**；阿里云/腾讯云仍是大陆用户首选，Dynadot 只作为"海外但支持 .cn + 人民币"的备选排在第三位。

### 4.6 决策：**只加 Dynadot，不加 Spaceship**（对中文创业者的价值 > 返佣率）

- **加 Dynadot** 的理由（均 [验证]）：售 .cn/.com.cn（$5.36）、整站中文、人民币计价、支付宝/银联；.cn 菜单里此前的"海外备选" Namecheap 实际上 **不售 .cn**（"Unsupported TLD"），中文用户点进去是死路 —— Dynadot 顶上这个位置是真实可用性提升，返佣 30% 只是附带。
- **不加 Spaceship** 的理由：不售 .cn/.com.cn [验证]、无中文界面 [验证]、只显示 USD [未验证 CNY]；在 .com/.io/.ai 上与已有 Porkbun/Namecheap 同质（差价 1–3 美元），多一项只会让 375px 菜单变长而无新增用户价值；25% Impact 佣金不足以推翻上述。
- **顺带修正**：Namecheap `supportsTld` 对 .cn 系列改为 false（依据 §4.3 官方搜索页原文，行为论证成立，故同步改了 R480 排序用例的期望）。

### 4.7 代码落点（本 PR）

- `apps/web/src/lib/registrars.ts`：`RegistrarId` / `REGISTRAR_IDS` 加 `dynadot`；搜索 URL 模板 `https://www.dynadot.com/domain/search?domain={d}`（来源：官方页面 JSON-LD `SearchAction.urlTemplate`，[验证]）；`REGISTRARS` 在 Namecheap 之后、Cloudflare 之前新增 `{ id: "dynadot", name: "Dynadot", region: "global", affiliate: withAffiliate("dynadot") }`（不设 `supportsTld`，.cn 系列可见）；Namecheap 加 `supportsTld: notCn`。
- 排序结果：`.cn/.com.cn` → 阿里云、腾讯云、**Dynadot**；其他 → Porkbun、Namecheap、**Dynadot**、Cloudflare、阿里云、腾讯云。`primaryRegistrar` 不变（.cn 仍阿里云，其他仍 Porkbun）。
- `components/domain-row.tsx` `RegisterMenu`：Dynadot 一行加 11px 灰字提示 `registrar.hint.dynadot`（zh "中文 · 支付宝" / en "CNY · Alipay"），告诉中文用户为什么这家海外商可选。
- `/api/registrars`、`/api/click`、`RegistrarAnchor`、`REGISTRAR_AFFILIATE_JSON` 校验均通过 `REGISTRAR_IDS` 自动生效，无需改 worker。
- 老板待办：`docs/owner-actions.md` 第 9 项改为 Dynadot Ambassador 申请 + 填 `REGISTRAR_AFFILIATE_JSON.dynadot`。
