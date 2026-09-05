# R511 零 AI 全站生产审计（覆盖 R503–R509 上线后）

- 生产：https://hunt.zalize.com （Worker version `0ab38935`，2026-09-05 14:52Z 部署；代码 `deploy/r192-r195` @ `8ae92d2` = `326803e`（R509 价格提交）+ 一个 docs-only 合并 #472，源码无差异）
- 审计时间：2026-09-05 15:23Z – 15:50Z（`/api/usage` before 15:23:58Z、after 15:50:15Z）
- 上一次全站审计：[audit-r502.md](./audit-r502.md)（2026-09-04/05，R485–R499 上线后）；R509 零 AI 回归记录见 [#471 评论](https://github.com/wookat/domainhunter/pull/471#issuecomment-5552746476)
- 方法：CDP 接管可见 Chrome（Playwright，`http://localhost:29229`）真实走查 1280×900 与 375×900、浅色 + 深色、zh + en（浏览器半场由测试子代理执行并录屏，报告 [`r511/browser-report.md`](./r511/browser-report.md)）；curl 直打 HTTP（canonical 矩阵脚本 [`r511/canonical.sh`](./r511/canonical.sh)、MCP JSON-RPC、分享 API、注册商 HEAD）；Lighthouse 13.4.1 desktop/mobile ×4 页（[`r511/lighthouse.sh`](./r511/lighthouse.sh)，独立 headless Chrome，不动 CDP Chrome）
- **生产 AI 调用 0 次**：浏览器侧捕获 **0 个 `/api/ai-search`**、**0 个 `/api/click`**；shell 侧未请求 `/api/ai-search`；`/api/usage` 09-05 前后 `searches 0→0`、`fast 0→0`、`refine 0→0`、`aiErrors null→null`、`fallbacks null→null`、`llmProvider null→null`（§2.10）
- 证据：本目录 `screenshots-r511/`（29 张关键截图）、`r511/`（canonical 矩阵、sitemap 计数、MCP 响应、Lighthouse 汇总、usage 三次快照、storage 前后、分享 API 记录、注册商 HEAD、浏览器报告与 `findings-browser.json` 全量请求账本）；审计机原件 `~/r511/`（89 张截图、Lighthouse 8 份 json、canonical 40 份 header/html）与录屏 `~/screencasts/r511-browser/r511-browser-edited.mp4`（随汇报附件交付）
- **不修代码**：本轮只报不修。**无 P0，无 P1，无 P2。** 3 条 P3 全部为 R509 已记录的既有问题（R510 并行修复中，本轮只核对状态）

## 0. 结论

| 项 | 结果 |
|---|---|
| P0 / P1 / P2 | **无** |
| P3 | 3 条，全部既有（R509 记录、R510 在修）：① `/prices` 375px 「续费↑」徽标仍在徽标内竖排成 `续/费/↑`（23×64px）；② 已撤销分享 `/s/:id` HTML 壳仍 HTTP 200 + 首页 title（`/api/share/:id` 410 正确）；③ `/vs` hub 过滤 `com vs cn` 0 匹配、`.com vs .cn` 1 匹配（§1） |
| R502 遗留 | P2-1 canonical **关闭**（R507：4 页 ×2 Lighthouse SEO 8/8 = 100，20 组矩阵裸 URL 全部自指）；P2-2 IndexNow 429 **未关闭、待 18:00Z 观察**（R504 新代码首个 cron 在审计结束后，本轮读到的仍是 12:00Z 旧代码结果）；P3-1 `/mcp` pre 焦点 **关闭**；P3-2 分享全标可注册 **关闭**（status 语义上线）；P3-3 sitemap lastmod **关闭**（6 条 09-04）；P3-4 `suggest_variants` 带点 **关闭**（`isError:true`）（§3） |
| R484 遗留 | P3-3 安全响应头 **保留**（`/` 仍无 HSTS/CSP/X-Frame-Options/X-Content-Type-Options/Referrer-Policy/Permissions-Policy）；其余未复测（本轮未跑 axe） |
| 零 AI | 见上；浏览器共 111 个 API 请求 + 测试代理 shell 4 个：`/api/search` 3（精确 1 + 展开后缀 1 + 批量 1）、`/api/share` POST 2、其余为 `/api/prices`/`/api/registrars`/`/api/stats`/`/api/monitor/list` 只读；本会话 shell 另创建 4 个分享（含 token 校验用）；6 个测试分享**全部撤销**（§2.6） |
| 首页 | zh/en hero；精确核验 `qwzx7k3r511` 1 次 `/api/search`，`.com`/`.cn` 可注册，`.cn` 与「查看更多」`.com.cn` chip 均 **≈$5**（chip 只显示 USD，33/38 CNY 在 `/prices`、`/tld/cn` 呈现）；行业模板 chip 只填不发（0 请求）；footer 408/410/444 + 3 个「浏览全部」+ /why /mcp /advanced /prices 全 PASS |
| `/advanced` | 3 域名批量 1 次 `/api/search`：2 可注册 + `zalize.com` 已注册（到期 2027-07-06）；CSV 控件在、未下载 |
| `/prices` | 408 条 Hunt 链接；后缀升/降序；`.cn` 1 行 **≈$5 ¥33 / ≈$5 ¥38**（1280）；375px 只显 USD（`hidden sm:inline` 设计）；**页面无 Dynadot 列/链接**——源码 `prices-page.tsx` 只有 后缀/注册首年/续费/猎名 四列，R503 的 Dynadot 加在注册商菜单而非价格表，任务预期与实现不一致但**非回归**（§1 观察项） |
| 三 hub | `/tld` 408 / `/guide` 410 / `/vs` 444 卡片；锚点滚到 sticky nav 下（section top≈128 / nav bottom 124）、筛选（`.cn`→1、`cn`→2、`实名`→2、`.com vs .cn`→1）、回到顶部全 PASS |
| 三内容页 | `/tld/cn`（zh「静态参考价：首年 ¥33 · 续费 ¥38/年 · 非实时报价」/ en「Static reference: ≈$5 (¥33) 1st yr · ¥38/yr renewal」）、`/guide/cn-realname`、`/vs/com-vs-cn`：zh/en 均渲染，面包屑父级回对应语言 hub，JSON-LD 2/3/3，相关链接 + /why /mcp /advanced 站内导航全 PASS |
| /why /mcp /monitors /shortlist | PASS：`/why` 切 en → `?lang=en`，F5 仍 en；`/mcp` 两个 `<pre>` Tab 可聚焦 + 可见 focus ring + → 键 scrollLeft 0→120 + 复制按钮剪贴板与代码逐字一致（R506 关闭）；monitors 空态 2/500；shortlist 3 行星标后逐行移除 |
| 404 | `/no-such-page-r511`、`/tld/zzznotatld`、`/guide/zzz-none`、`/vs/zzz-vs-yyy` 全部真实 HTTP 404 + 品牌页；`/api/share/zzzznotexist` 404 |
| 分享 | 带 status（全 available）→ SSR title「2 个可注册域名候选」/ "2 available domain candidates"（测试代理 UI 创建的 3 条分享：可注册徽章 + 「复制 3 个可注册」+ title「3 个可注册域名候选」）；不带 status → 「2 个候选域名」/ "2 domain candidates" + 琥珀「此快照未记录核验状态」；混合 available+taken → 中性「2 个候选域名」；DELETE 正确 token 200 → GET **410**，UI「链接已失效」；错 token **403**、无 token **400**、已撤销再 DELETE 幂等 200（源码 786 行设计） |
| MCP | `tools/list` 恰 3 工具；`check_domains` 2 域名：`zalizeqa3r511.cn` available、`zalize.com` taken（到期 2027-07-06）；`tld_prices` 408 条（57 approx，`cn` 4.58/5.28 = 33/38 ÷ 7.2）；`suggest_variants("zalizeqa",[com,cn],4)` 4 条 available；**`suggest_variants("zalize.com")` → `isError:true` 双语提示**（R506 关闭） |
| R507 canonical 矩阵 | 5 路径 × {zh-CN, en-US} × {裸, `?lang=en`} = 20/20：HTTP 200、`Vary: Accept-Language` 全有、**裸 URL canonical 恒 = 裸 URL（en-US 协商下正文为 en、`<html lang="en">`，canonical 仍自指裸 URL）**、`?lang=en` canonical = 自身、hreflang zh→裸 / en→`?lang=en` / x-default→裸（§2.8） |
| Lighthouse ×8 | **SEO 8/8 = 100、a11y 8/8 = 100**、best-practices 8/8 = 100；性能 desktop 100/100/100/100，mobile 93（`/`）/ 97（`/tld/cn`）/ 97（`/tld/cn?lang=en`）/ 90（`/prices`）（§2.11） |
| sitemap | `<loc>` **1270**；lastmod **1264 × 2026-08-10 + 6 × 2026-09-04**（六篇 .cn 合规指南）；随机 5 条全部 200 |
| `/api/usage` 观察 | `cronLast` 12:00:17Z（旧代码）、`indexnowLast` 09-03 12:00:34Z、`indexnowLastError` {12:00:17Z, 429, submitted 0}、`indexnowPending` **1270**（R504 首个 cron 18:00Z 在审计后，**未观察**）；`indexnowLastAttempt` 不在 `/api/usage` 输出中（KV 内部键）；pv 分片求和 69→187 单调递增无回退；`outbound {dynadot:1}` / `outboundByTld {cn:1}`（09-05 已含 dynadot，非本轮产生）；`botsBy.other` 15:24→15:33Z 突增 +2543（非本审计所致，见 §4） |
| 注册商菜单 | shortlist / 分享页 `.cn` 与 `.com.cn` 菜单 = 阿里云、腾讯云、**Dynadot**；`.com` = Porkbun、Namecheap、Dynadot、Cloudflare、阿里云、腾讯云；Dynadot href `https://www.dynadot.com/domain/search?domain=<d>`；首页精确核验 chip 为单入口 `primaryRegistrar`（阿里云）无下拉（源码注释设计）；HEAD：Dynadot search URL 对 curl 返回 **403 `cf-mitigated: challenge`**（Namecheap/Cloudflare 同样 403 反爬，Porkbun/阿里云/腾讯云 200），`dynadot.com/domain/cn` 与 `/domain/com.cn` 200 → 主机可达，搜索页可达性**只能在真实浏览器验证，本轮未点击**（纪律） |
| 375px | 12 条路由 × 浅/深 **24/24** `innerWidth = scrollWidth = 375` |
| 键盘 | 首页 Logo → 高级模式 → 候选清单 → GitHub → 语言 → 主题 → 关闭引导 → AI/精确/批量 → textarea 全部可见焦点 |
| console | JS pageerror **0**；资源错误 6 条 = 4 条故意 404 + 2 条撤销分享 410（均预期噪音）；其他 console error **0** |
| 状态还原 | local/sessionStorage 还原后与 `storage-r511-pre.json` **字节级相等**（`cmp` 无输出、`diff` 空）；6 个测试分享 GET 均 410 |
| 本地验收 | `pnpm -r typecheck` ✓（仅 apps/web 有 typecheck 脚本）/ `pnpm --filter web test` 24 files 246 tests ✓ / `pnpm --filter web build` ✓（本分支仅新增文档与截图） |

## 1. 问题清单

### P3-1 `/prices` 375px 「续费↑」徽标在徽标内竖排换行（既有，R509 已记录，R510 在修）

- 现象（验证过）：375×900 浅色，`/prices` 筛选 `.xyz`（$2.04 / $14.21，满足 `renew ≥ 3×reg`），徽标文字竖排为 `续 / 费 / ↑`，徽标 23.27×64px，价格文本高 20px → 续费单元格被撑到 64px。`.cn`（33/38）不触发徽标，不能用 `.cn` 复现
- 复现：375px 打开 `/prices` → 筛选 `xyz`
- 证据：`screenshots-r511/C-prices-xyz-badge-light-375.png`；`r511/findings-browser.json` `C_xyz_mobile`
- 分级：P3 既有；与 R509 记录一致，非本轮新增

### P3-2 已撤销分享 `/s/:id` HTML 壳仍 HTTP 200 + 首页 title（既有，R509 已记录，R510 在修）

- 现象（验证过）：6 个撤销分享 `GET /api/share/:id` 全部 **410** `{"error":"revoked"}`，浏览器 UI 正确显示「链接已失效：分享者已删除这份清单」；但 `GET /s/:id`（curl 与浏览器导航响应）均 **200**，`<title>` 为首页标题「DomainHunter — 中文创业者的域名猎手 | …」
- 复现：`curl -sI https://hunt.zalize.com/s/rFzsKspQGT` → 200
- 证据：`r511/share-revoke.txt`（3 个 id 的 delete/api-after/ssr-after 三联）、`r511/revoked-shell-http.json`、`screenshots-r511/H-share-revoked-rhWlK999Ge-1280.png`
- 分级：P3 既有；SKILL 已说明 `/s/:id` 语义 410 在 API 层，本条是 SEO/元数据质量项

### P3-3 `/vs` hub 过滤需带点（既有，R509 已记录，R510 在修）

- 现象（验证过）：`/vs?lang=zh` 输入 `.com vs .cn` → 1 张卡（`/vs/com-vs-cn`）；输入 `com vs cn` → 0 张
- 证据：`screenshots-r511/D-vs-filter-1280.png`、`D-vs-dotless-1280.png`
- 分级：P3 既有；`/tld` 过滤 `cn` 不带点可匹配 2 张（cn、com.cn），行为不一致

### 观察项（不列级）

- **`/prices` 无 Dynadot 列**（验证过）：任务描述预期「/prices Dynadot 列 R503」，生产与源码 `apps/web/src/components/prices-page.tsx` 均只有 后缀/注册首年/续费/猎名；R503 的 Dynadot 落在 `lib/registrars.ts` 注册商菜单（shortlist、分享页、结果页），已验证存在。判定为**预期描述与实现不一致，非回归**；是否需要在 `/prices` 增加注册商维度由产品决定
- **`/tld/cn` 无注册商链接**（验证过）：内容页只有起名 CTA，无 Dynadot；同上非回归
- **MCP `tld_prices` 不含 `com.cn`**（验证过 + 源码核对）：返回 408 条 = `TLD_LIST` 408 项，`com.cn` 不在 `TLD_LIST`（多级 TLD 单独在核验与价格面支持），MCP 侧拿不到 `.com.cn` 33/38 参考价。设计边界，非缺陷；可作 MCP 增强项
- **Dynadot 搜索 URL 对非浏览器 UA 403**（验证过）：`cf-mitigated: challenge`，与 Namecheap、Cloudflare Registrar 相同（反爬）；真实用户浏览器可达性未验证（纪律不点外链）
- **`/api/usage` 无 `indexnowLastAttempt` 字段**（验证过）：任务要求观察该项，但 `worker.ts:1192` 返回体只有 `cronLast/indexnowLast/indexnowLastError/indexnowPending/pricesLast*/baidu*`；`indexnow:lastAttempt` 仅是 KV 键，外部不可观测——若父会话需要，建议后续把它加进 `/api/usage`
- **`botsBy.other` 15:24Z→15:33Z +2543**（验证过数值，来源为推断）：`other` 320→2863，之后到 15:50Z 仅 +2。本会话 shell 用 UA `Mozilla/5.0 r511-audit`（不匹配 bot 正则，计入 pageviews：guide/vs/prices 各 +14~15 与 canonical 矩阵 4 次 + sitemap 抽样吻合），测试代理用真实 Chrome；Lighthouse 8 次在 15:36–15:45Z 之间、只对应后段 +2~+4。**推断**为外部爬虫突发，非审计流量；建议父会话用 `wrangler tail` 或 CF Analytics 复核
- 安全响应头（验证过）：`/` 仍无 HSTS/CSP/X-Frame-Options/X-Content-Type-Options/Referrer-Policy/Permissions-Policy（R484 P3-3 保留）

## 2. 逐项证据

### 2.1 零 AI 与状态纪律

- storage pre-dump `r511/storage-r511-pre.json`（`domainhunter:lang=en`、`domainhunter:theme=dark`、`domainhunter:shortlist=[]`，session 空）；结束后 `storage-r511-post.json` 与之 `cmp` 字节相等
- 浏览器 API 账本（`r511/findings-browser.json` `requests`，111 条）：0 `/api/ai-search`、0 `/api/click`、0 `/api/usage`；`/api/search` 3 次均为非 AI（精确核验、展开后缀、批量）
- 示例 prompt chips / 再来一轮 / 开始猎取 未点击；行业模板「茶叶品牌」只填 textarea，0 请求（`A-template-filled-1280.png`）
- 测试分享 6 个（本会话 4 + 测试代理 2）全部 DELETE 并 GET 410：`r511/shares-revoked.json`（已去除 token）、`r511/shares-final-410.txt`

### 2.2 首页（1280 浅色 zh / 深色 en）

- `A-home-zh-light-1280.png`、`A-home-en-dark-1280.png`：H1 zh「用中文说出寓意，猎到真正可注册的.cn / .com 好域名」/ en "Name it in Chinese or English, hunt .cn / .com domains you can actually register"
- 精确核验 `qwzx7k3r511`：`A-exact-com-cn-price-1280.png`（`.com`/`.cn` 可注册 ≈$5）、`A-more-comcn-1280.png`（查看更多 → `.com.cn` 可注册 ≈$5）
- footer `A-footer-end-1280.png`：`/tld/` 408、`/guide/` 410、`/vs/` 444 链接 + 3 个「浏览全部」

### 2.3 `/advanced`、`/prices`

- `B-advanced-statuses-1280.png`：`zalizeqa1r511.com`、`zalizeqa2r511.cn` 可注册，`zalize.com` 已注册 2027-07-06
- `C-prices-cn-1280.png`：`.cn` ≈$5 ¥33 / ≈$5 ¥38；`C-prices-cn-light-375.png`：375px 仅 USD；`C-prices-xyz-badge-light-375.png`：P3-1

### 2.4 三 hub

- `D-tld-filter-1280.png`（`.cn` → 1）、`D-vs-filter-1280.png`（`.com vs .cn` → 1）、`D-vs-dotless-1280.png`（`com vs cn` → 0，P3-3）；锚点/回到顶部数值见 `findings-browser.json` `D_*`

### 2.5 三内容页

- `E-tld-cn-zh-1280.png`（静态参考价 ¥33/¥38 卡）、`E-guide-cn-realname-zh-1280.png`、`E-vs-com-vs-cn-en-1280.png`；JSON-LD 2/3/3、面包屑父级 `/tld?lang=zh|en` 见 `findings-browser.json` `E_*`

### 2.6 /why /mcp /monitors /shortlist / 404 / 分享

- `F-mcp-pre-first-focus-1280.png`（Tab 聚焦 + ring）、`F-mcp-copied-1280.png`（已复制）；`F-monitors-1280.png`；`G-no-such-page-r511-1280.png`
- 分享：`H-share-active-light-1280.png`（带 status，3 可注册徽章 + 「复制 3 个可注册」）、`H-share-legacy-light-1280.png`（无 status 琥珀提示）、`H-share-revoked-rhWlK999Ge-1280.png`
- 分享 API（本会话 shell，`r511/share-revoke.txt`）：

| 分享 | items | SSR title zh / en | DELETE | GET after | `/s/:id` after |
|---|---|---|---|---|---|
| `rFzsKspQGT` | 2 × available | 2 个可注册域名候选 / 2 available domain candidates | 200 | **410** | 200 首页 title（P3-2） |
| `ObIdBmpGGJ` | 2 × 无 status | 2 个候选域名 / 2 domain candidates | 200 | **410** | 200 首页 title |
| `UYttuUJzhu` | available + taken | 2 个候选域名 / 2 domain candidates | 200 | **410** | 200 首页 title |
| `DaowdfzrI1` | 1 × available | — | 错 token **403**、无 token **400**、正确 200 | **410** | — |

### 2.7 MCP 三工具（`r511/mcp-*.json`）

- `tools/list`：`check_domains`、`tld_prices`、`suggest_variants`
- `check_domains`：available/taken 状态与到期日正确（`mcp-check.json`）
- `tld_prices`：408 条、57 approx、`cn {4.58, 5.28, approx}`（= 33/7.2、38/7.2）；无 `com.cn`（观察项）
- `suggest_variants {name:"zalizeqa", tlds:[com,cn], limit:4}` → 4 条 available（`mcp-variants-ok.json`）；`{name:"zalize.com"}` → `isError:true`「invalid name: … contains a dot / 名字里不能带「.」…」双语（`mcp-variants-dotted.json`，R502 P3-4 关闭）

### 2.8 R507 canonical 矩阵（`r511/canonical-matrix.txt`）

5 路径（`/`、`/tld/cn`、`/guide/cn-realname`、`/vs/com-vs-cn`、`/prices`）× `Accept-Language: zh-CN|en-US` × 裸/`?lang=en`：

| 组合 | `<html lang>` | canonical | hreflang | Vary |
|---|---|---|---|---|
| zh-CN + 裸 | zh-CN | = 裸 URL | zh→裸、en→`?lang=en`、x-default→裸 | Accept-Language |
| en-US + 裸 | en | **= 裸 URL**（正文 en） | 同上 | Accept-Language |
| zh-CN + `?lang=en` | en | = `?lang=en` | 同上 | Accept-Language |
| en-US + `?lang=en` | en | = `?lang=en` | 同上 | Accept-Language |

20/20 符合 R507 设计（内容协商与 URL 规范化分离），R502 P2-1「裸 URL 在 en 客户端指向 `?lang=en`」关闭。

### 2.9 sitemap（`r511/sitemap-counts.txt`、`sitemap-sample-result.txt`）

- `<loc>` 1270；lastmod 1264 × 2026-08-10、6 × 2026-09-04（`/guide/cn-realname`、`cn-serverhold`、`cn-icp-beian`、`cn-dns-inland-vs-overseas`、`cn-vs-comcn-registrar`、`cn-expiry-redemption`）
- 随机 5 条（`/guide/fleamarket`、`/vs/vin-vs-wine`、`/vs/photo-vs-photography`、`/guide/karaoke`、`/vs/paris-vs-london`）全部 200

### 2.10 `/api/usage` 前后对照（`r511/usage-r511-{pre,mid,post}.json`，`?cb=` 绕缓存）

| 09-05 字段 | pre 15:23:58Z | post 15:50:15Z | Δ |
|---|---|---|---|
| searches / fast / refine | 0 / 0 / 0 | 0 / 0 / 0 | **0** |
| aiErrors / fallbacks / llmProvider | null | null | **0** |
| outbound / outboundByTld | {dynadot:1} / {cn:1} | 同 | 0（本轮 0 `/api/click`） |
| pageviews 合计 | 69 | 187 | +118（审计 HTML 请求，各类目单调递增） |
| bots / botsBy | 880 / {other 320, ai 560} | 3425 / {other 2863, ai 562} | +2545（15:24–15:33Z 突增，观察项） |
| cronLast / indexnowLast | 12:00:17Z / 09-03 12:00:34Z | 同 | — |
| indexnowLastError | {12:00:17Z, 429, submitted 0} | 同 | — |
| indexnowPending | 1270 | 1270 | R504 首个 cron 18:00Z **未观察** |
| pricesLastOk | 09-05 00:01:39Z | 同 | 不 stale |
| baiduLast / baiduLastError | null / null | 同 | — |

### 2.11 Lighthouse 13.4.1（`r511/lighthouse-summary.txt`，headless Chrome，preset desktop / 默认 mobile）

| URL | desktop perf/a11y/bp/seo | mobile perf/a11y/bp/seo | mobile LCP / TBT |
|---|---|---|---|
| `/` | 100/100/100/100 | 93/100/100/100 | 2.6s / 60ms |
| `/tld/cn` | 100/100/100/100 | 97/100/100/100 | 2.3s / 20ms |
| `/tld/cn?lang=en` | 100/100/100/100 | 97/100/100/100 | 2.4s / 0ms |
| `/prices` | 100/100/100/100 | 90/100/100/100 | 3.3s / 110ms |

SEO 与 a11y 8/8 = 100（R502 为 SEO 92），CLS 8/8 = 0。

### 2.12 注册商菜单与链接（`r511/registrar-head.txt`）

- 菜单集合与 href 见 §0；截图 `H-shortlist-cn-menu-1280.png` / `H-shortlist-cn-menu-dark-1280.png`
- HEAD（curl，Chrome UA）：Porkbun 200、阿里云 200、腾讯云 200；Dynadot search 403 `cf-mitigated: challenge`、Namecheap 403、Cloudflare Registrar 403（均为反爬，非链接错误）；`dynadot.com/domain/cn`、`/domain/com.cn` 200

### 2.13 375px / 键盘 / console

- 24/24 `innerWidth = scrollWidth = 375`：`I-home-zh-light-375.png`、`I-home-zh-dark-375.png`、`I-prices-zh-dark-375.png`、`I-mcp-zh-light-375.png` 等；全表见 `browser-report.md` §375px matrix
- console：pageerror 0；6 条预期资源错误（4×404 + 2×410）；无其他 error

## 3. R502 遗留项与 R509 回归项逐条对照

| 项 | R502 状态 | R511 状态 | 证据 |
|---|---|---|---|
| R502 P2-1 en 客户端裸 URL canonical → `?lang=en`（SEO 92） | 新增 | **关闭**（R507） | §2.8 20/20、§2.11 SEO 8/8 = 100 |
| R502 P2-2 IndexNow 429 `submitted 0` | 未解决 | **未关闭、待观察**：12:00Z（旧代码）仍 429；R504 新代码首个 cron 18:00Z 在审计后 | §2.10；复核命令 `curl -s 'https://hunt.zalize.com/api/usage?cb=1' \| jq '.cronLast,.indexnowLast,.indexnowLastError,.indexnowPending'`（期望 lastError 清空、pending 1270→~970） |
| R502 P3-1 `/mcp` pre 不可键盘聚焦 | 既有 | **关闭**（R506：tabIndex + ring + 方向键滚动） | `F-mcp-pre-first-focus-1280.png`、scrollLeft 0→120 |
| R502 P3-2 分享全标「可注册」 | 既有 | **关闭**（R506 status 语义：三种快照 title/徽章/提示正确） | §2.6 表 |
| R502 P3-3 sitemap lastmod 全 08-10 | 既有 | **关闭**（6 条 09-04） | §2.9 |
| R502 P3-4 `suggest_variants` 带点静默去点 | 既有 | **关闭**（`isError:true`） | `mcp-variants-dotted.json` |
| R484 P3-3 无安全响应头 | 保留 | **保留** | §1 观察项 |
| R484 P1-1 浅色对比度 / P2-1 outbound 丢写 / P3-1 shortlist 空表头 / P3-2 Radix 伪阳性 | 关闭/未验证/未验证/备查 | **本轮未复测**（未跑 axe、未做并发点击） | — |
| R509 P3 ① `/prices` 375px 续费徽标换行 | 既有 | **仍存在**（P3-1） | `C-prices-xyz-badge-light-375.png` |
| R509 P3 ② 撤销分享 `/s/:id` SSR 200 | 既有 | **仍存在**（P3-2） | `share-revoke.txt` |
| R509 P3 ③ `/vs` 过滤需带点 | 既有 | **仍存在**（P3-3） | `D-vs-dotless-1280.png` |

## 4. 未覆盖 / 需注意

- **未验证**：R504 IndexNow 18:00Z 首个新代码 cron 的实际效果（`pending` 是否降到 ~970、`lastError` 是否清空）——审计 15:50Z 结束，请父会话 18:02Z 后按 §3 命令复核
- **未验证**：Dynadot 搜索页在真实浏览器中的可达性（curl 403 challenge；纪律不点外链）；`outboundByTld` 含 dynadot 是既有数据（09-05 pre 已为 1），本轮 0 点击不能证明 R503 计数链路
- **未验证**：axe（本轮任务未要求）；英文首页 SSR H1（仅 hydrated 校验）；375px 矩阵仅 zh；监控创建/webhook、清单同步、CSV 内容、`/api/usage` 之外的 pv 分片内部结构（只能看到聚合结果）
- **推断**：`botsBy.other` 突增为外部爬虫（依据：时间窗与审计流量特征不符）；`/prices` 无 Dynadot 列为任务描述与实现不一致而非回归（依据：源码与 R506/R509 描述均无该列）
- **不在 `/api/usage` 的字段**：`indexnowLastAttempt` 外部不可观测
- 本会话 shell 分享 `DaowdfzrI1` 专用于 token 校验（错 token 403 / 无 token 400），非任务要求项，附带证明撤销接口鉴权正确
- 测试代理创建的 2 个分享（`rhWlK999Ge` UI 创建、`n15sBAuOSW` shell 创建）与本会话 4 个分享共 6 个，全部已撤销；`r511/shares-revoked.json` 已剔除 token

## 5. 本地验收（本分支仅新增文档与截图，无源码改动）

- `pnpm -r typecheck` ✓（Scope 2/3：仅 `apps/web` 定义了 typecheck）
- `pnpm --filter web test` ✓ 24 files / 246 tests
- `pnpm --filter web build` ✓
