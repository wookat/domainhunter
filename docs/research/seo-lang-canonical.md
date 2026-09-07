# R507 裸 URL 语言协商与 canonical 策略（裁决 R502 P2-1）

> 日期 2026-09-05（UTC）。基线 `deploy/r192-r195` @ 2e8dee6，生产 version 0eff3305。
> 问题：R492 起裸 URL 在 `Accept-Language: en*` 下渲染英文正文并把 canonical 改写为 `?lang=en`，Lighthouse SEO 6/6 从 100 降到 92（`canonical` 审计 *Points to another hreflang location*）。本文按 SOP-02 先取证 → 查官方原文 → 三方案打分 → 裁决。
> 每条结论标注 **验证过 / 未验证 / 推断**。官方文档只引 developers.google.com / developers.cloudflare.com / GoogleChrome/lighthouse 源码一手页面。

## 0. 结论速览

| 问题 | 结论 | 性质 |
|---|---|---|
| 现状（C）是否是实现 bug | 不是。R492 有意为之，27/27 语言矩阵与设计一致 | 验证过（§1） |
| 现状对 Googlebot 有无直接影响 | 无。Google 官方：Googlebot 不带 `Accept-Language`（§2.1）→ 抓到的裸 URL 永远是 zh 正文 + 自指 canonical | 验证过（文档）+ 推断（Googlebot 行为不可在本地复现） |
| 现状的真实风险 | 任何**带** `Accept-Language: en` 的抓取者（Lighthouse、Chrome 系工具、未知第三方爬虫、Google 的 geo-distributed crawl 若未来带头）看到的是「主 URL 把 canonical 让给 `?lang=en`」——主中文 URL 有被并入英文 URL 的方向性风险；反向（en 并入 zh）在现状下不存在 | 推断（无 GSC 数据；GSC 未验证归属，见 owner-actions） |
| 裁决 | **方案 B**：正文继续按 `?lang` > `Accept-Language` 协商（保留 R492 UX 与 `Vary`），但 **canonical 只看 URL**：裸 URL 恒自指裸 URL，`?lang=en` 恒自指 `?lang=en`；hreflang 三元组不变 | 设计（§3） |
| sitemap 是否列 `?lang=en` `<loc>` | **本轮不列**。HTML hreflang 已是完整、双向的一种方法；Google 明说三法等价、多用无益；列了会让 sitemap/IndexNow/百度推送清单翻倍（1,270→2,540），R504 刚把 IndexNow 拉回可控 | 裁决（§4） |
| 预期效果 | 裸 URL + `Accept-Language: en` 的 Lighthouse `canonical` 审计通过 → SEO 回 100；zh 页与 `?lang=en` 页字节级不变 | §5 本地验证 |

## 1. 现状取证（生产 curl，验证过）

脚本 `scripts/seo-audit/lang-matrix.sh <origin> <cb>`（本轮从 R492 的 3 模式扩为 4 模式，加 og:locale / Cache-Control 列），UA `SiteAuditBot`，每次带 `?cb=` 穿透缓存。6 路径 × 4 模式，2026-09-05T14:16:45Z：

| path | 模式 | `<html lang>` | canonical | hreflang | og:locale | Vary | Cache-Control | 正文 |
|---|---|---|---|---|---|---|---|---|
| `/` | (a) 无 A-L | zh-CN | `/` | zh=/ en=/?lang=en x-default=/ | zh_CN | Accept-Language | public, max-age=600 | zh |
| `/` | (b) `en-US,en` | en | **`/?lang=en`** | 同上 | en_US | Accept-Language | 同 | en |
| `/` | (c) `zh-CN` | zh-CN | `/` | 同上 | zh_CN | Accept-Language | 同 | zh |
| `/` | (d) `?lang=en` | en | `/?lang=en` | 同上 | en_US | Accept-Language | 同 | en |
| `/tld/cn` `/guide/saas` `/vs/com-vs-cn` `/prices` `/why` | (a)(c) | zh-CN | 自指裸路径 | 三元组 | zh_CN | Accept-Language | 同 | zh |
| 同上 5 路径 | (b) | en | **`…?lang=en`** | 三元组 | en_US | Accept-Language | 同 | en |
| 同上 5 路径 | (d) | en | `…?lang=en` | 三元组 | en_US | Accept-Language | 同 | en |

24/24 行完整原始表见 PR 描述。要点：
- 唯一「canonical ≠ 请求 URL」的格子是 **(b)**：裸 URL 在英文 `Accept-Language` 下 canonical 指向 `?lang=en`。这正是 Lighthouse 判 92 的格子（Chrome 默认 `Accept-Language: en-US`）。
- 生产 HTML 响应**没有 `cf-cache-status` 头**（连 `?cb=` 相同的两次请求也没有）→ Worker 直出的 HTML 不经 Cloudflare 边缘缓存，`Vary` 只影响浏览器缓存。
- sitemap：1,270 个 `<url>`，`<loc>` 全部是裸 URL（`grep -c '<loc>[^<]*lang=en'` = 0），每条带 zh/en/x-default 三条 `xhtml:link`。

## 2. 官方文档原文（验证过：2026-09-05 直接抓取）

### 2.1 Googlebot 与 Accept-Language / locale-adaptive 页面

来源：https://developers.google.com/search/docs/specialty/international/locale-adaptive-pages

> "If your site has locale-adaptive pages (that is, your site returns different content based on the perceived country or preferred language of the visitor), Google might not crawl, index, or rank all your content for different locales. This is because the default IP addresses of the Googlebot crawler appear to be based in the USA. In addition, **the crawler sends HTTP requests without setting Accept-Language in the request header**."

> "Googlebot crawls with IP addresses based outside the USA, in addition to the US-based IP addresses." （geo-distributed crawling 只讲 IP 地理，**没有**说会带 Accept-Language。）

来源：https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites

> "**Google recommends using different URLs for each language version of a page rather than using cookies or browser settings to adjust the content language on the page.**"

> "If you prefer to dynamically change content or reroute the user based on language settings, be aware that Google might not find and crawl all your variations. This is because the Googlebot crawler usually originates from the USA. In addition, the crawler sends HTTP requests without setting Accept-Language in the request header."

> "Avoid automatically redirecting users from one language version of a site to a different language version of a site."（本站不重定向，只是同 URL 变正文；不触犯此条。）

### 2.2 canonical 与 hreflang 的关系

来源：https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls

> "Do include a `rel="canonical"` link on the canonical page itself (also known as a self-referential canonical)."

> "**If you're using hreflang elements, make sure to specify a canonical page in the same language**, or the best possible substitute language if a canonical page doesn't exist for the same language."

> "To help with sites' localization efforts, for canonicalization purposes Google prefers URLs that are part of hreflang clusters."

> "`rel="canonical"` annotations that suggest alternate versions of a page are ignored; specifically, `rel="canonical"` annotations with `hreflang`, `lang`, `media`, and `type` attributes are not used for canonicalization."

### 2.3 hreflang 规则、x-default、sitemap 形式

来源：https://developers.google.com/search/docs/specialty/international/localized-versions

> "**Localized versions of a page are only considered duplicates if the main content of the page remains untranslated.**"（→ zh 与 en 正文是翻译版，不构成重复内容；`?lang=en` 不需要也不应该 canonical 到裸 URL。）

> "There are three ways to indicate multiple language/locale versions of a page to Google: HTML / HTTP Headers / Sitemap … The three methods are equivalent from Google's perspective … While you can use all three methods at the same time, **there's no benefit in Search** (in fact, it maybe be much harder to manage three implementations instead of just picking one)."

> "**Each language version must list itself as well as all other language versions.**"

> "If two pages don't both point to each other, the tags will be ignored."

> "Consider adding a fallback page for unmatched languages, especially on language/country selectors or auto-redirecting home pages. Use the x-default value."

> Sitemap 方法："add a `<loc>` element specifying a single URL, with child `<xhtml:link>` entries listing every language/locale variant of the page including itself. Therefore if you have 3 versions of a page, **your sitemap will have entries for the URLs of each version**, and each entry will have 3 identical child entries."

> "Google doesn't use hreflang or the HTML lang attribute to detect the language of a page; instead, we use algorithms to determine the language."

### 2.4 Lighthouse `canonical` 审计的判定规则（源码）

来源：https://github.com/GoogleChrome/lighthouse/blob/main/core/audits/seo/canonical.js `findCommonCanonicalURLMistakes`

```js
// cross-language or cross-country canonicals are a common issue
if (hreflangURLs.has(baseURL.href) && hreflangURLs.has(canonicalURL.href) && baseURL.href !== canonicalURL.href) {
  return { score: 0, explanation: str_(UIStrings.explanationPointsElsewhere, {url: baseURL.href}) };
}
```
即：**请求 URL 与 canonical 都在 hreflang 集合里且二者不等 → 0 分**。它是静态启发式，不理解「同 URL 按 Accept-Language 变正文」。

### 2.5 Cloudflare 对 `Vary` 的处理

来源：https://developers.cloudflare.com/cache/concepts/cache-control/

> "vary — **By default, Cloudflare does not consider vary values in caching decisions.** Vary values are respected when you configure the Cache Rules Vary setting, when Vary for images is configured, and when the vary header is `vary: accept-encoding`."

来源：https://developers.cloudflare.com/workers/reference/how-the-cache-works/

> "To cache responses from a Worker itself — so that Cloudflare returns the cached response without executing the Worker — refer to Cache [Rules]."（默认不缓存 Worker 直出响应；与 §1「无 `cf-cache-status`」实测一致。）

## 3. 三方案对比

本文对三方案的定义（父会话任务书中 A/B 都写了「canonical 固定为裸 URL」，此处按可区分的实质来界定）：

- **A**：裸 URL **固定 zh**——不再按 `Accept-Language` 变正文，canonical 自指裸 URL；en 只走 `?lang=en`（自指）；hreflang zh/en/x-default 互指。= Google「不同语言用不同 URL、不要靠浏览器设置改正文」的教科书形态。
- **B**：裸 URL **正文仍按 `?lang` > `Accept-Language` 协商**（保留 R492 UX、`Vary: Accept-Language`），但 **canonical 只看 URL**：裸 URL 恒自指裸 URL，`?lang=en` 恒自指 `?lang=en`；hreflang 不变。
- **C**：现状——canonical 跟正文语言走（裸 URL + en 协商 → canonical `?lang=en`）。

| 维度（权重） | A 裸 URL 固定 zh | B 协商正文 + canonical 只看 URL | C 现状 |
|---|---|---|---|
| ① 不重复内容 / 不误并 | 5：Googlebot 与任何客户端看到的裸 URL 都是 zh + 自指，语义完全一致 | 4：Googlebot（无 A-L）看到 zh + 自指；带 en A-L 的客户端看到 en 正文 + canonical 自指——canonical 不再「让位」，主 URL 永不被并入 `?lang=en`；代价是该客户端眼中「en 正文的 canonical 是 hreflang 标为 zh 的 URL」，与 §2.2「same language」在这一视角下不一致（Google 自述不会处于这一视角） | 3：Googlebot 视角同 B；但带 en A-L 的客户端看到主 URL canonical → `?lang=en`，是「主 URL 让位」的方向性风险；zh 与 en 正文本身不构成重复（§2.3） |
| ② 中文利基定位（主语言 zh、裸 URL = zh = x-default） | 5 | 5：裸 URL 的 canonical 永远是它自己，和 sitemap `<loc>`、hreflang zh/x-default 三处一致 | 3：裸 URL 在 en 视角把权重指向 `?lang=en`，与「zh 为主」相反 |
| ③ 英文页仍可被索引 | 4：`?lang=en` 自指 + hreflang en + 站内 `?lang=en` 内链（R491 footer）；en 用户到裸 URL 会先看到 zh（需点切换） | 5：`?lang=en` 自指 + hreflang en + 内链；en 用户到裸 URL 直接得 en 正文 | 5：同 B |
| ④ 实施与缓存复杂度 | 2：要同时改 worker `resolveLang` **和**客户端 `loadLang()`（`navigator.language` 也会切 en），否则 en 浏览器出现 zh SSR → React 翻成 en 的闪变（`site-links.ts` 注释记录的正是这个问题）；`SSR_CANONICAL_ZH_LINKS` 等 R491 遗留一起要动；产品层面是回退 R492 的 UX 决策 | 5：改 `ssr-lang.ts` 一处纯函数 + 10 个调用点签名；`Vary` 保留；Cloudflare 边缘本就不缓存 Worker HTML（§1）也默认忽略 `Vary`（§2.5），浏览器缓存按 `Vary` 正确分桶 | 5：不改 |
| 合计 | 16 | **19** | 16 |
| Lighthouse `canonical` 审计（裸 URL + en A-L） | 通过 | 通过 | 失败（92） |

打分说明：①②③④ 各 1–5，等权。A 与 C 同分但方向相反：A 输在实施成本与 UX 回退，C 输在主 URL 让位。

### 3.1 为何不是 A

- Google 的「不同 URL 不同语言」建议本站**已经满足**（`?lang=en` 是独立 URL，双向 hreflang，sitemap 列 alternate）；R492 的正文协商只是在此之上给 en 浏览器省一次点击，不是用它替代独立 URL。
- A 的真实成本在客户端：`lib/i18n.tsx` `loadLang()` 的第三优先级是 `navigator.language`，裸 URL 固定 zh 的 SSR 会被 React 在英文浏览器上翻成 en（语言闪变 + `<html lang>` 与 SSR 不一致）。要彻底一致必须把 `navigator.language` 从 `loadLang()` 去掉 → en 浏览器首访永远 zh，这是产品决策回退，不属于本轮修 Lighthouse 的范围。

### 3.2 为何 B 对 Google 是安全的（逐条对照 §2）

| Google 规则 | B 下 Googlebot（无 Accept-Language）看到的裸 URL | B 下 `?lang=en` |
|---|---|---|
| self-referential canonical | `/path` → `/path` ✓ | `/path?lang=en` → `/path?lang=en` ✓ |
| canonical 与正文同语言 | zh 正文，canonical `/path`（hreflang zh）✓ | en 正文，canonical `?lang=en`（hreflang en）✓ |
| hreflang 每页列全 + 双向 | zh/en/x-default 三元组 ✓ 两页完全相同 | 同 ✓ |
| 首选 hreflang 簇内 URL | 两个 URL 都在簇内 ✓ | ✓ |
| x-default | 裸 URL ✓ | ✓ |

唯一 B 与 §2.2「same language」不一致的视角是「带 en Accept-Language 的抓取者看裸 URL」。Google 官方两处（§2.1）明确其爬虫不设该头；此视角下 B 的后果是「该抓取者把裸 URL 当 en 页索引但 URL 不变」，C 的后果是「该抓取者把裸 URL 并入 `?lang=en`」——前者可逆、不丢主 URL，后者丢主 URL。这是 B 优于 C 的核心理由（**推断**：两种后果都没有 GSC 数据佐证，GSC 归属未完成见 `docs/owner-actions.md`）。

### 3.3 未验证 / 遗留观察项（不在本轮范围）

- **Google 渲染（WRS）下的 `navigator.language`**：`loadLang()` 第三优先级按 `navigator.language` 切 en。若 WRS 的 `navigator.language` 为 `en-US`（**未验证**，Google 未公开文档），Google 渲染后的裸 URL DOM 会是 en 正文而 hreflang 标 zh——这是 R492 之前就存在的客户端行为，与 canonical 无关，三方案均不改变；建议后续单独一轮用 GSC「网址检查 → 已渲染的 HTML」实测后再裁决（可能的处理：SSR 通过 `<meta name="dh:ssr-lang">` 把服务端决定传给客户端，客户端不再看 `navigator.language`）。
- `og:url` 在 `?lang=en` 页仍是裸 URL（所有方案均如此，R213 起的既有行为），不影响 Google，只影响社交分享回链。
- hreflang 语言码用 `zh`（R427 由 `zh-CN` 改来）；Google 接受 ISO 639-1 单语言码，不改。

## 4. sitemap 裁决

官方 sitemap 方法要求每个语言版本各有自己的 `<url><loc>`（§2.3 末条）；本站 sitemap 只有裸 URL `<loc>`，`?lang=en` 只出现在 `xhtml:link`。严格说这是「半个 sitemap 方法」——Google 会因「en 版没有 `<url>` 回指」在 **sitemap 层**忽略这组 alternate，但 **HTML 层**的三元组完整双向，会被处理（§2.3「Google will still process the ones that point to each other」）。

**本轮不把 `?lang=en` 列为 `<loc>`**，理由：
1. HTML hreflang 已是完整的一种方法；Google 明说三法等价、多用无益（§2.3）。
2. `sitemapPaths()` 同时是 IndexNow（R504 每 cron ≤300 条，1,270 条约 30h 消化）与百度推送的 URL 源，翻倍到 2,540 会把刚修好的 IndexNow 消化期拉到 ~60h，且百度对 en 页无价值。
3. 中文利基：sitemap 只列主语言 URL 与「zh 为主」一致；en 页靠 hreflang + 站内 `?lang=en` 内链发现（R502 BFS 1270/1270 可达）。

后续可选：若 GSC「国际定位」报告出现「缺少返回标记」类提示，再决定是「补 en `<url>`（并把 IndexNow/百度清单与 sitemap 解耦）」还是「删掉 sitemap 里的 `xhtml:link` 只留 HTML 方法」。

## 5. 实施与验证

- 代码：`apps/web/src/ssr-lang.ts` 新增 `canonicalLangOf(langQuery)` 与 `resolveSsrLang(langQuery, acceptLanguage) → { lang, canonicalLang }`；`injectHreflang(html, path, ctx)` 只按 `ctx.canonicalLang` 决定 canonical；worker 10 个 SSR 路由（`/ /mcp /advanced /tld/:tld /guide/:slug /vs/:slug` + hub `/tld /guide /vs` + `/prices /why`）统一改为 `const sl = resolveSsrLang(...)`，正文/`<html lang>`/og:locale/JSON-LD 继续用 `sl.lang`，canonical/hreflang 用 `sl`。`/s/:id` 分享页无 canonical，仍用 `resolveLang` 只定标题语言。`Vary: Accept-Language` 不变。
- 单测：`ssr-lang.test.ts` 新增 `R507 四种请求方式 × 页面类型`：4 模式 × 6 页（`/`、`/tld/cn`、`/guide/saas`、`/vs/com-vs-cn`、`/prices`、`/why`）断言 canonical == 请求 URL、三元组四模式字节一致且含自身。`pnpm --filter web test` 212/212（ssr-lang 22）；`pnpm -r typecheck`、`pnpm --filter web build` 绿。

### 5.1 本地 wrangler dev 矩阵（验证过，2026-09-05T14:27Z，9 路径 × 4 模式 = 36/36）

与 §1 生产表相比唯一变化是 (b) 列：canonical 从 `…?lang=en` 变为裸路径；`<html lang>`=en、og:locale=en_US、正文 en、hreflang 三元组、`Vary`、`Cache-Control` 全部不变。(a)(c)(d) 三列 24/24 与生产逐字一致。

| path | (a) 无 A-L | (b) en A-L：前 → 后 | (c) zh A-L | (d) ?lang=en |
|---|---|---|---|---|
| `/` | `/` | `/?lang=en` → **`/`** | `/` | `/?lang=en` |
| `/tld/cn` | `/tld/cn` | `/tld/cn?lang=en` → **`/tld/cn`** | `/tld/cn` | `/tld/cn?lang=en` |
| `/guide/saas` | `/guide/saas` | `…?lang=en` → **`/guide/saas`** | `/guide/saas` | `/guide/saas?lang=en` |
| `/vs/com-vs-cn` | `/vs/com-vs-cn` | `…?lang=en` → **`/vs/com-vs-cn`** | `/vs/com-vs-cn` | `/vs/com-vs-cn?lang=en` |
| `/prices` | `/prices` | `…?lang=en` → **`/prices`** | `/prices` | `/prices?lang=en` |
| `/why` | `/why` | `…?lang=en` → **`/why`** | `/why` | `/why?lang=en` |
| `/mcp` `/advanced` `/tld` | 自指 | `…?lang=en` → **自指裸路径** | 自指 | `…?lang=en` |

### 5.2 Lighthouse 13.4.1 `--only-categories=seo`（验证过）

方法：Lighthouse 的 `canonical` 审计只在【请求 URL 也在 hreflang 集合里】时才会触发“Points to another hreflang location”（§2.4），直接跑 `http://127.0.0.1:8787` 无法复现（基线与修后都是 100，不具鉴别力）。故本地 `wrangler dev --local-protocol https --port 8443` + `socat :443→:8443` + Chrome `--host-resolver-rules='MAP hunt.zalize.com 127.0.0.1' --ignore-certificate-errors`，让 Lighthouse 以 `https://hunt.zalize.com/…` 为请求 URL 打本地 Worker（wrangler 日志确认请求落在本地）。“前”列为同一 Lighthouse 版本直打生产 0eff3305。

| URL | Accept-Language | 前（生产）SEO / canonical | 后（本地）SEO / canonical |
|---|---|---|---|
| `/` | `en-US,en;q=0.9` | **92** / 0 “Points to another hreflang location” | **100** / 1 |
| `/tld/cn` | `en-US,en;q=0.9` | **92** / 0 同上 | **100** / 1 |
| `/` | `zh-CN,zh;q=0.9` | 100 / 1 | 100 / 1 |
| `/tld/cn` | `zh-CN,zh;q=0.9` | 100 / 1 | 100 / 1 |
| `/?lang=en` | `en-US,en;q=0.9` | 100 / 1 | 100 / 1 |
| `/tld/cn?lang=en` | `zh-CN,zh;q=0.9` | 100 / 1 | 100 / 1 |

页面加载期间 Worker 收到的 API 只有 `/api/prices` `/api/registrars` `/api/stats`，**0 次 AI 调用**（生产 6 次 Lighthouse 加载也只触发同一组非 AI 接口）。
