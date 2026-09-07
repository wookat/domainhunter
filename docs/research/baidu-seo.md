# R485 百度搜索收录与百度站长平台接入（中文创业者的主入口）

> 日期 2026-09-04（UTC）。基线 `deploy/r192-r195` @ a5af9eb。目的：回答「百度到底看不看得见 hunt.zalize.com」，并落地最小改动的百度站长平台接入。
> 所有结论标注证据来源；未能测得的按未能测得记录，不以推断代替。官方文档只引 ziyuan.baidu.com / zhanzhang.baidu.com / developers.cloudflare.com 一手页面。

## 0. 结论速览

| 问题 | 结论 | 证据 |
|---|---|---|
| 百度是否收录本站 | **0 条可见**（「抱歉，未找到相关结果」） | §1.1 截图 |
| 同主域其他子站是否被百度收录 | 是，`site:zalize.com` 约 10 条（career/pdfsuite/mock/jobs/zhenti… 等子域） → 主域没被百度屏蔽，本站只是**没被发现/没提交** | §1.1 截图 |
| Baiduspider 是否来爬过 | 14 天 `botsBy` 无 `baidu` 条目 → **从未来爬** | §1.3 |
| robots.txt 是否放行 | `User-agent: * / Allow: /`，无任何 Baiduspider Disallow | §1.2 |
| 页面对百度是否友好 | Baiduspider UA 拿到 SSR 直出正文；canonical 指向中文无参 URL；无 JS 依赖 | §1.4 |
| 海外服务器有无官方说法 | **有**：百度官方 2017 公告「服务器在国外的中文网站，将在百度搜索中出现展示问题」 | §2.5 |
| 大陆可达性 | 公开测速无大陆节点，**未能测得**；港/日/新/洛均可达（0.34–1.56s） | §3.1 |
| Cloudflare China Network | 需 Enterprise + 单独订阅 + ICP 备案 + 内容审核；无公开定价 | §3.2 |
| 下一步 | 老板在站长平台验证站点、拿 API token → 填 var/secret，cron 自动推送 | §5 |

## 1. 生产实查（一手证据）

### 1.1 `site:` 收录信号（截图 `screenshots/r485/`）

| 引擎 | 查询 | 结果 | 截图 |
|---|---|---|---|
| 百度 | `https://www.baidu.com/s?wd=site%3Ahunt.zalize.com` | **「抱歉，未找到相关结果。」** 并提示「如网页未收录或者新站未收录，请提交网址给我们」 | `r485-baidu-site-hunt.png` |
| 百度（对照） | `https://www.baidu.com/s?wd=site%3Azalize.com` | 「找到相关结果数约 10 个」，全部是 zalize.com 其他子域（career / pdfsuite / mock / jobs / zhenti / hansonmg / meesur2） | `r485-baidu-site-zalize.png` |
| Bing（对照） | `https://www.bing.com/search?q=site%3Ahunt.zalize.com` | 「About 2 results」，两条均为 `https://hunt.zalize.com` 首页（R481 的 IndexNow/Bing 验证已见效果） | `r485-bing-site-hunt.png` |

结论：百度对 hunt.zalize.com 收录为 0；同主域其他子站有收录，说明**不是主域被百度屏蔽**，而是本站从未被百度发现（§1.3 佐证）。百度页面自己写的「数字为估算值，网站管理员如需了解更准确的索引量，请使用百度站长平台」——精确索引量只能在站长平台看（§5 老板操作）。

### 1.2 robots.txt（`curl https://hunt.zalize.com/robots.txt`）

```
User-agent: *
Allow: /
# 另有 GPTBot / PerplexityBot / ClaudeBot 显式 Allow
Sitemap: https://hunt.zalize.com/sitemap.xml
```

无针对 Baiduspider 的任何规则，wildcard 允许全部抓取。代码：`apps/web/src/worker.ts` `/robots.txt` 路由。

### 1.3 `/api/usage?days=14` 的 `botsBy`

R481 起 Worker 对成功返回的 HTML 文档按 UA 计 `botsBy:{google,bing,baidu,ai,other}`（`apps/web/src/pageviews.ts` 已识别 `Baiduspider`）。生产 14 天窗口内 **`botsBy` 无 `baidu` 键** → Baiduspider 一次都没来。本地 wrangler dev 用 Baiduspider UA curl 5 次后 `botsBy.baidu=5`，证明计数器本身工作正常，缺失不是统计遗漏。

### 1.4 Baiduspider UA 直出正文与 HTML 因素

```
curl -A "Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)" https://hunt.zalize.com/
curl -A "…Baiduspider/2.0…" https://hunt.zalize.com/tld/cn
```

- 两页均 HTTP 200 `text/html; charset=utf-8`，响应体里直接包含 `<h1>`/标题/正文段落（Worker SSR，`worker.ts` 的 `/`、`/tld/:tld` 路由），不依赖前端 JS 渲染。这正对应百度官方要求（§2.4）。
- `<link rel="canonical">` 指向**中文、无查询参数**的 URL（如 `https://hunt.zalize.com/tld/cn`），`?lang=en` 仅出现在 `hreflang="en"` alternate 与 sitemap 的 `xhtml:link` 里，不会把权重导到英文变体。
- `<html lang="zh-CN">`、`<meta charset="utf-8">`、`<title>`/`<meta name="description">` 均为中文，无 `noindex`。
- 本地对比（§4.2）：基线与本 PR 在无 vars 时 `/`、`/tld/cn`、`/prices`、`/vs`、`/?lang=en`、`/robots.txt`、`/sitemap.xml` 响应 **sha256 完全一致**。

## 2. 百度站长平台官方文档（ziyuan.baidu.com）

### 2.1 站点验证方式

- 官方课程页 <https://ziyuan.baidu.com/college/courseinfo?id=267&page=1>：验证方式为 **文件验证**（下载验证文件放到站点根目录）与 **HTML 标签验证**（把 `<meta name="baidu-site-verification" content="codeva-xxxxxxxx" />` 放进首页 `<head>`）。
- **CNAME 验证已暂停**：官方公告 <https://ziyuan.baidu.com/wiki/3462>（2023）——CNAME 验证方式暂停，未验证/验证过期的站点改用文件或 HTML 标签验证。
- 本 PR 选 HTML 标签验证：与 R481 的 GSC/Bing 完全同一注入路径（`growth-inject.ts`），一个 var 搞定，不需要新增静态文件路由。

### 2.2 普通收录 API 推送（官方接口文档，站长平台「普通收录 → API 提交」）

| 项 | 官方规定 |
|---|---|
| 接口 | `POST http://data.zz.baidu.com/urls?site=<站点>&token=<准入密钥>` |
| 请求头 | `Content-Type: text/plain` |
| 请求体 | 每行一个 URL（`\n` 分隔） |
| 单次上限 | **2,000 条**（超过返回 400 `over 2000 urls`） |
| 成功 | **仅 HTTP 200**；返回 `{"remain":N,"success":M,"not_same_site":[…],"not_valid":[…]}` |
| 400 | `site error` / `empty content` / `over quota`（当日配额用完） / `over 2000 urls` |
| 401 | `token is not valid` |
| 404 | 接口地址错 |
| 500 | 服务器偶发错误，重试可能成功 |
| 配额 | **按站点动态分配**，依据站点内容质量与价值；`remain` 为当日剩余 |
| 官方警告 | 重复提交旧 URL、提交无价值 URL 会浪费配额并可能**降低配额或撤销 API 权限**；提交 ≠ 保证抓取/收录 |

传输层实测：`https://data.zz.baidu.com/urls` 的证书 SAN 不含 `data.zz.baidu.com`（curl 校验失败）；官方文档给的就是 `http://`。未带 token 请求 `http://data.zz.baidu.com/urls` 返回 `{"error":400,"message":"token is need"}`，确认接口在线。**注意 token 走明文 HTTP**，属百度接口自身限制，不是我们可改的；token 只能以 Worker secret 存放。

### 2.3 快速收录 / 快速抓取

- 官方公告 <https://ziyuan.baidu.com/wiki/3546>（2024）：**「快速收录」工具下线**，由「快速抓取」替代——配额更多、抓取调度更及时，但**不保证收录与展示**。
- 官方「快速抓取」页说明支持手动与 API 两种提交，需要具备相应权限（新站/普通站点默认不一定开通；具体资格在登录后页面才可见，本会话无账号，**未能确认本站是否可开**）。
- 结论：先走普通收录 API；快速抓取待老板登录后查看是否有权限。

### 2.4 Sitemap 与 JS 渲染

- Sitemap：站长平台「普通收录 → sitemap」手动提交 sitemap 地址；官方限制单文件 **≤50,000 条 URL、≤10MB**，站点级文件配额按站点分配。本站 sitemap 1,264 条 / 约 500KB（§4.2 本地 `sitemap.xml` 508,221 字节），远低于上限，一个文件即可。
- JS 渲染：官方 <http://zhanzhang.baidu.com/wiki/1021>「有价值的 PC 内容不要用 JS 加载……渲染覆盖尚不完整」；百度搜索官方收录说明亦指出使用 JS/AJAX 等百度无法解析技术的页面可能在建库前被过滤。本站 SSR 直出（§1.4）已满足。

### 2.5 海外服务器的官方说法 —— **有**

- 百度官方公告 <https://ziyuan.baidu.com/wiki/1586>（2017）：**「经查，服务器在国外的中文网站，将在百度搜索中出现展示问题」**，建议把面向中国用户的中文站点服务器放在国内。
- 这是唯一找到的官方直接表述；未见官方给出「量化降权多少」的说法。**不能宣称「海外服务器对百度无影响」**。
- 反证价值有限但值得记录：同主域 `*.zalize.com` 子站在百度有收录（§1.1），说明海外 Cloudflare 站点并非「不可能收录」，只是可能遭遇公告所述的「展示问题」。

## 3. 与 Cloudflare 的关系

### 3.1 中国大陆可达性与延迟

- DNS：`hunt.zalize.com` 解析到 Cloudflare 任播 IPv4/IPv6（`dig`），非中国大陆 IP。
- 公开测速（Check-Host 多节点 HTTP）：香港 ≈1.56s、日本 ≈0.34s、新加坡 ≈0.82s、洛杉矶 ≈0.36s，全部 200。**该工具无中国大陆节点**，其他常用大陆测速站（站长工具/17ce 等）需要验证码/登录，本会话未能获得有效大陆测量 → **大陆可达性与延迟：未能测得**。
- 官方说法：Cloudflare 文档 <https://developers.cloudflare.com/china-network/> 明确：从中国大陆访问境外 Cloudflare 节点会因中国网络边界产生延迟与可靠性问题。

### 3.2 可选方案与成本（只引官方）

| 方案 | 官方要求 | 出处 |
|---|---|---|
| Cloudflare China Network（京东云运营的大陆节点） | **Enterprise 计划** + 单独的 China Network 订阅 + 每个顶级域有效 **ICP 备案/许可证** + 合作方内容审核 | <https://developers.cloudflare.com/china-network/> |
| Enterprise 定价 | 官方定价页无公开数字，「Contact sales」 | <https://www.cloudflare.com/plans/enterprise/> |

结论：China Network 现阶段不可行（无 ICP、无 Enterprise）。**可做的**：① 本 PR 的站长平台验证 + API 推送（让百度先知道本站存在）；② 观察 `/api/usage` 的 `botsBy.baidu` 是否由 0 变正；③ 若 3–4 周后仍 0 收录，再评估 ICP 备案 + 国内镜像等路径（成本另议，不在本轮）。

## 4. 实现与验证（本 PR）

### 4.1 改动

| 文件 | 内容 |
|---|---|
| `apps/web/src/growth-inject.ts` | `GrowthVars.BAIDU_VERIFICATION` → `<meta name="baidu-site-verification" content="…" />`，同 GSC/Bing 正则 `^[A-Za-z0-9_-]{8,128}$`（百度 `codeva-xxxxxxxx` 含连字符已覆盖），顺序 Google → Bing → 百度 → 分析 beacon；为空/非法不注入 |
| `apps/web/src/baidu-push.ts`（新） | 接口 URL 构造、2,000/批切分、`text/plain` 每行一 URL、仅 200 成功、解析 `success/remain/not_same_site/not_valid`、`pickPending` 配额策略 |
| `apps/web/src/worker.ts` | cron 新增 `pushBaidu`；`/api/usage` 新增 `baiduLast` / `baiduLastError`；Bindings 加 `BAIDU_PUSH_SITE` / `BAIDU_PUSH_TOKEN` / `BAIDU_PUSH_DAILY_MAX` / `BAIDU_PUSH_ENDPOINT` |
| 单测 | `growth-inject.test.ts`（百度 meta、非法值、字节级无 vars 对比）、`baidu-push.test.ts`（11 例：配置解析、URL/请求体格式、状态码分支、多批、网络异常、非 JSON） |

**配额策略**（对应任务「超配额只推最近变更的 URL」）：官方配额按站点动态分配且**重推旧 URL 会被降配额**，所以不采用「每天全量重推」。KV `baidu:pushed` 记录已被百度计为成功（按 `success` 与 `not_valid` 扣减）的 URL；每 ≥24h 一轮，只从 `sitemapPaths()`（已按首页 → 一级页 → /tld → /guide → /vs 重要性排序）里取**尚未成功推送**的前 `BAIDU_PUSH_DAILY_MAX` 条（默认 2,000 = 接口单次上限；老板可按站长平台显示的当日配额收紧）。新增内容页部署后自然进入「未推送」集合下一轮推出；`remain=0` 立即停止后续批。失败（非 200/网络错）写 `baidu:lastError` 并 6h 冷却重试，与 IndexNow 一致。当前 sitemap 1,264 条，默认配置下一轮即可全部提交（如配额允许）。

未配置 `BAIDU_PUSH_SITE`/`BAIDU_PUSH_TOKEN` 任一 → `resolveBaiduPush` 返回 null → `pushBaidu` 直接 return，**不读写任何 KV**。

### 4.2 验收记录（本地）

- `pnpm -r typecheck` / `pnpm --filter web test`（9 文件 80 例）/ `pnpm --filter web build` 全绿。
- **无 vars 字节一致**：基线 a5af9eb worktree 构建跑 `wrangler dev --port 8788`，本分支跑 `:8787`，Baiduspider UA 拉 `/`、`/tld/cn`、`/prices`、`/vs`、`/?lang=en`、`/robots.txt`、`/sitemap.xml`，7/7 sha256 一致；HTML 中 `baidu-site-verification` 出现 0 次。`/api/usage` 仅多出 `baiduLast:null, baiduLastError:null` 两个字段。
- **无 vars cron**：触发 `/__scheduled` 后本地 KV 只有 `cron:last`、`indexnow:last`、`prices:lastOk`、`pv:*`，**无任何 `baidu:*` 键**。
- **假 token + 本地 mock 上游**（`--var BAIDU_PUSH_ENDPOINT:http://127.0.0.1:9999/urls`，未触碰真实百度接口）：
  - 请求：`POST /urls?site=https%3A%2F%2Fhunt.zalize.com&token=<假token>`，`content-type: text/plain`，请求体 5 行（`DAILY_MAX=5`）：`https://hunt.zalize.com/` `…/prices` `…/why` `…/mcp` `…/advanced` —— 与 §2.2 官方格式一致。
  - mock 返回 200 `{remain:0,success:3}` → `baiduLast` 写入、`baiduLastError` 清空、`baidu:pushed` 仅记前 3 条；同轮再触发 cron **不再请求**（24h 间隔）。
  - mock 返回 400 `over quota` → `baiduLastError={status:400,message:"Bad request (…over quota…): over quota",submitted:0}`，请求体为下一批未推送 URL（`/mcp` 起，已推的 3 条不重推）；6h 内再触发不请求；清冷却后 mock 恢复 200 → 错误清空、`pushed` 增长到 6 条。
  - `BAIDU_VERIFICATION=codeva-TestOnly123` 时 `/` 与 `/tld/cn` 的 `<head>` 出现且仅出现一次 `<meta name="baidu-site-verification" content="codeva-TestOnly123" />`；`/api/usage`（JSON）不被注入。

## 5. 需老板操作（按顺序）

> **单一事实源：[`docs/owner-actions.md`](../owner-actions.md)**（R490 起所有老板待办及其当前状态只在那里维护；本节保留为调研证据，不再更新）。

1. **站长平台添加站点**：登录 <https://ziyuan.baidu.com/> → 用户中心 → 站点管理 → 添加网站 `https://hunt.zalize.com`（协议头选 https；站点属性按实际填）。
2. **HTML 标签验证**：选「HTML 标签验证」，复制 `<meta name="baidu-site-verification" content="codeva-XXXXXXXX" />` 里的 `content` 值 →
   `wrangler.jsonc` `vars` 加 `"BAIDU_VERIFICATION": "codeva-XXXXXXXX"`（或 Dashboard → Settings → Variables），部署后回站长平台点「完成验证」。
   验证前可 `curl -s https://hunt.zalize.com/ | grep baidu-site-verification` 自查。
3. **提交 sitemap**：站长平台 → 普通收录 → sitemap → 填 `https://hunt.zalize.com/sitemap.xml`。
4. **开通 API 推送拿 token**：普通收录 → API 提交 → 复制接口地址中的 `site=` 值与 `token=` 值 →
   - `wrangler.jsonc` `vars` 加 `"BAIDU_PUSH_SITE": "https://hunt.zalize.com"`（与站长平台显示的 site 一致）；
   - `cd apps/web && npx wrangler secret put BAIDU_PUSH_TOKEN`（粘贴 token，**不要**写进 wrangler.jsonc / 代码 / PR）；
   - 可选：若站长平台显示的当日配额 < 2,000，加 `"BAIDU_PUSH_DAILY_MAX": "<配额>"`。
5. **部署后观察**：`/api/usage?days=7&cb=<随机>` 的 `baiduLast` 应在下一次 cron（≤6h）后出现时间戳、`baiduLastError` 为 null；站长平台「普通收录 → API 提交」页可见当日已推送条数；`botsBy.baidu` 开始 >0 说明 Baiduspider 来了；`site:hunt.zalize.com` 收录一般需数天到数周。
6. **可选**：登录后看「快速抓取」是否对本站开放（§2.3）；查看「站点属性 → 服务器」是否有海外服务器提示（§2.5）。

## 6. 未能测得 / 需注意

- 中国大陆真实可达性与延迟（无可用大陆测速节点）。
- 百度站长平台登录后才可见的：精确索引量、当日 API 配额数值、快速抓取资格。
- 百度 API 只提供 `http://`（token 明文传输），是百度接口限制；token 仅存 Worker secret。
- 官方明确「服务器在国外的中文网站会出现展示问题」——本轮改动能让百度**知道并抓取**本站，不承诺排名。
