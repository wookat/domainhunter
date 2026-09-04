# 老板待办清单（owner-actions）— 单一事实源

> R490 归一。R478–R486 各轮散落在 `docs/research/*.md` 与 `docs/launch/launch-checklist.md` 的「需老板操作」全部收口到这一张表；以后**只改这里**，各研究文档保留调研证据并回链本文件。
> 当前状态一律由 **生产公开行为** 判定（curl 首页 `<head>`、`/api/usage`、`/api/registrars`、DNS、GitHub 公开信息），不读任何 secret；核对时间与命令见 §2「证据」。
> 公司规则：资源缺口不阻塞——每一项未到位时站点行为与现状完全一致（缺口处已有降级/休眠实现）。

状态取值：`未开始-待老板`（公开侧确认未配置）· `待老板确认`（公开侧有部分证据，但只有老板后台能定论）· `无法公开核实`（只有登录后台才能看到）。

## 1. 总表

| # | 项目 | 为什么需要 | 具体操作步骤与官方链接 | 填到哪个 var / secret 与命令 | 当前状态（2026-09-04 生产实查） | 完成后我们如何验证 |
|---|---|---|---|---|---|---|
| 1 | **LLM 主上游 key 额度（DeepSeek / 网关）** — P0 | `/api/ai-search` 唯一 AI 路径；额度耗尽 → 网关 429 `apikey_quota_exhausted`，首页 AI 猎名走规则降级 + 5 分钟 KV 熔断，产品核心卖点不可用（`docs/handoff-context.md` §5） | 在网关控制台充值 / 提额；或换新 key。DeepSeek 官方平台：<https://platform.deepseek.com/>（R490 从海外节点自动化访问返回 403，未能核实页面内容；请直接在浏览器打开） | 换 key 时：`cd apps/web && npx wrangler secret put DEEPSEEK_API_KEY`（粘贴新 key；不进仓库）。只充值不换 key 则无需部署 | **未开始-待老板**（`/api/usage` 2026-09-04 `aiErrors.quota=3`、`fallbacks.quota=2 / quota-breaker=2`，无 `llmProvider` 字段 = 当日无一次成功主轮） | `GET /api/usage?days=1&cb=<随机>` 当日 `aiErrors.quota` 不再增长、出现 `llmProvider.primary>0`；`wrangler tail` 不再出现 `llm-upstream … status=429`。恢复后补做 R466 首结果时延实测（zh/en 各 ≥1 次） |
| 2 | **LLM 备用上游（可选，R474 failover）** | 主上游 401/402/403/429-额度/5xx/网络失败时自动用备用重发一次；不配则休眠。是「AI 不可用整站 0 产出」的第二道保险 | 任一 OpenAI 兼容端点开一个 key：DeepSeek 官方 `https://api.deepseek.com`（`deepseek-chat`）/ 硅基流动 `https://api.siliconflow.cn/v1`（`deepseek-ai/DeepSeek-V3`）/ OpenRouter `https://openrouter.ai/api/v1`（`deepseek/deepseek-chat`）（以上是 API base，不是网页；控制台分别为 <https://platform.deepseek.com/> / <https://cloud.siliconflow.cn/> / <https://openrouter.ai/>） | `cd apps/web && npx wrangler secret put LLM_FALLBACK_API_KEY`，再 `… secret put LLM_FALLBACK_API_BASE` / `LLM_FALLBACK_MODEL`（可选 `LLM_FALLBACK_THINKING=disabled`）。全部走 secret，`wrangler.jsonc` 不写 | **无法公开核实**（`/api/usage` 无 `llmProvider.fallback` 计数；结合第 1 项现象推断未配置或备用也失败） | `/api/usage` 当日项出现 `llmProvider.fallback>0`；`wrangler tail` 看到 `llm-failover <stage> primary=429 fallback=200` |
| 3 | **Google Search Console** | 看 Google 收录/查询词、提交 sitemap（1,270 URL） | <https://search.google.com/search-console> ：① 若 `zalize.com` **网域资产**已存在 → 直接看 `hunt.zalize.com` 数据，无需验证；② 否则「添加资产 → 网域 → zalize.com」把 TXT 加到 Cloudflare DNS；③ 备选「网址前缀 → https://hunt.zalize.com → HTML 标记」；④ 验证后提交 `https://hunt.zalize.com/sitemap.xml`。细节见 `docs/research/growth-analytics.md` §7 | 只有走 ③ 才需要：`apps/web/wrangler.jsonc` `vars.GSC_VERIFICATION="<content 值>"` → 父会话 `pnpm deploy`（公开值，可提交） | **待老板确认**：`dig TXT zalize.com` 有 **3 条** `google-site-verification` 记录（网域资产很可能已验证），但首页无 `<meta name="google-site-verification">`；是否已在 GSC 添加资产/提交 sitemap 只能后台看 | 走 ③ 时 `curl -s -A Mozilla https://hunt.zalize.com/?cb=1 \| grep -c google-site-verification` = 1；任一路径：GSC 后台「站点地图」显示已发现 1,270 条 |
| 4 | **Bing Webmaster Tools** | Bing/Copilot 收录与 IndexNow 提交记录核对（Worker 已每日向 IndexNow 推 sitemap；2026-09-04 18:00 推送遇 429） | <https://www.bing.com/webmasters> ：优先「Import from Google Search Console」；否则添加 `https://hunt.zalize.com`，选 meta tag。见 `growth-analytics.md` §7 | 走 meta 时：`wrangler.jsonc` `vars.BING_VERIFICATION="<msvalidate.01 content>"` → `pnpm deploy`（或 DNS CNAME 方式，无需部署） | **未开始-待老板**（首页无 `<meta name="msvalidate.01">`；GSC 导入与否公开侧看不到） | `curl … \| grep -c msvalidate.01` = 1（meta 路径）；Bing Webmaster「IndexNow」页出现提交记录，与 `/api/usage` 的 `indexnowLast` 时间对得上 |
| 5 | **Cloudflare Web Analytics token** | 无 cookie 的真实浏览器 PV/来源/国家分析；现在只有 Worker 侧 `pageviews` 粗计数 | Cloudflare Dashboard → Analytics & Logs → Web Analytics → Add a site → `hunt.zalize.com` → 选**手动安装 JS snippet**（**不要**开自动注入，避免双重上报）→ 复制 `"token":"…"`（32 位 hex）。文档：<https://developers.cloudflare.com/web-analytics/> | `wrangler.jsonc` `vars.ANALYTICS_PROVIDER="cloudflare"`、`vars.ANALYTICS_TOKEN="<token>"` → `pnpm deploy`（token 本就公开在 HTML 中，非 secret） | **未开始-待老板**（首页无 `script[data-cf-beacon]`） | `curl … \| grep -c data-cf-beacon` = 1；首页/结果页页脚出现双语隐私一句话；Dashboard 24h 内出现访问数据 |
| 6 | **注册商联盟 — Namecheap（全球域名 20%）** | 注册外链变现；未配置时纯链接、0 收入 | <https://www.namecheap.com/affiliates/> 选 Impact 或 CJ 注册 → 通过后在 Impact 为 `https://www.namecheap.com/domains/registration/results/` 生成 Deep Link（形如 `https://namecheap.pxf.io/c/XXXX/YYYY/ZZZZ?u=`）。见 `docs/research/registrar-affiliate.md` §3 | `wrangler.jsonc` `vars.REGISTRAR_AFFILIATE_JSON`（字符串，公开参数）加 `"namecheap":{"redirect":"https://namecheap.pxf.io/c/XXXX/YYYY/ZZZZ?u={url}"}` → `pnpm deploy`。**不要**在 Dashboard 单独改，会被 deploy 覆盖 | **未开始-待老板**（`GET /api/registrars` = `{"affiliate":{}}`） | `curl -s https://hunt.zalize.com/api/registrars?cb=1` 回显 namecheap 配置；页面注册链接 `rel` 含 `sponsored`、页脚出现返佣声明；`/api/usage.outbound.namecheap` 与 Impact 后台点击数对得上 |
| 7 | **注册商联盟 — 阿里云云大使（.cn 主力）** | .cn/.com.cn 注册入口首选阿里云；返佣可覆盖成本 | <https://promotion.aliyun.com/ntms/yunparter/index> 登录加入 → **先确认「域名注册」在返佣商品目录**（调研未查到）→ 复制专属推广链接，记下参数名/值（如 `userCode=abc123`） | `REGISTRAR_AFFILIATE_JSON` 加 `"aliyun":{"query":{"userCode":"abc123"}}` → `pnpm deploy` | **未开始-待老板**（同上 `/api/registrars` 为空） | 同第 6 项；`/api/usage.outbound.aliyun` 与云大使后台对账 |
| 8 | **注册商联盟 — 腾讯云云推官（.cn 主力）** | 同上，.cn 第二入口 | <https://cloud.tencent.com/act/partner/cps> 登录加入 → 同样先确认域名是否返佣 → 拿专属参数 | `REGISTRAR_AFFILIATE_JSON` 加 `"tencent":{"query":{"fromSource":"…"}}` → `pnpm deploy` | **未开始-待老板** | 同第 6 项；`outbound.tencent` 对账 |
| 9 | （可选）**Dynadot 30% / Spaceship 25%** | 下一轮新增注册商时才有意义（当前代码合法 id 只有 porkbun/namecheap/aliyun/tencent） | <https://www.dynadot.com/affiliate> ；<https://www.spaceship.com/affiliate-program/> | 需先在 `lib/registrars.ts` 新增注册商（开发任务），再填 JSON | **未开始-待老板**（且依赖开发） | 同第 6 项 |
| 10 | **GitHub 仓库 About + 网站 + Topics** | 开源发布/被搜索发现；About 现在仍是旧定位 | 仓库页 → About 齿轮 → Description 填 `docs/launch/launch-checklist.md` §3 的英文一句话；Website `https://hunt.zalize.com`；Topics 按 §3 列表（≤20） | 无 var；纯 GitHub 设置 | **未开始-待老板**（GitHub API 返回 description = 「批量域名猎手：词根组合生成 + RDAP/DNS 批量核验（open-core） — hunt.zalize.com」，与 R478「中文创业者的域名猎手」定位不符；Topics 未鉴权无法读取） | `git_list_repos` / `https://api.github.com/repos/wookat/domainhunter` 的 `description`、`homepage`、`topics` 与 §3 一致 |
| 11 | **GitHub Private vulnerability reporting（SECURITY.md 依赖）+ Discussions（可选）** | `SECURITY.md` 引导私密报告漏洞，需仓库开启该功能；Discussions 承接社区问答 | Settings → Code security → Private vulnerability reporting → Enable（<https://docs.github.com/en/code-security/security-advisories/working-with-repository-security-advisories/configuring-private-vulnerability-reporting-for-a-repository>）；Settings → General → Features → Discussions | 无 var | **无法公开核实**（需仓库管理员权限；未鉴权 API 限流） | `https://github.com/wookat/domainhunter/security/advisories/new` 对非成员可打开；仓库首页出现 Discussions 标签 |
| 12 | **GitHub Social preview 图** | 分享仓库链接时的卡片图 | Settings → General → Social preview → Upload `docs/assets/home-zh.png`（或 `https://hunt.zalize.com/api/og/home` 转 PNG） | 无 var | **无法公开核实**（仓库页 og:image 现为 GitHub 自动生成图 `opengraph.githubassets.com/...`，即**未上传**自定义图——这是公开可见的） | 仓库页 `<meta property="og:image">` 变为 `repository-images.githubusercontent.com/...` |
| 13 | **百度站长平台：添加站点 + HTML 标签验证** | 百度收录为 0 且从未被发现；验证是提交 sitemap / API 推送的前提（`docs/research/baidu-seo.md` §5） | <https://ziyuan.baidu.com/> → 用户中心 → 站点管理 → 添加 `https://hunt.zalize.com` → 选「HTML 标签验证」→ 复制 `content="codeva-…"` | `wrangler.jsonc` `vars.BAIDU_VERIFICATION="codeva-XXXX"` → `pnpm deploy` → 回站长平台点「完成验证」 | **未开始-待老板**（首页无 `<meta name="baidu-site-verification">`）。注：2026-09-04 `botsBy.baidu=6`，Baiduspider 已开始自发来访 | `curl … \| grep -c baidu-site-verification` = 1；站长平台显示「已验证」 |
| 14 | **百度：提交 sitemap** | 让百度拿到 1,270 条 URL | 站长平台 → 普通收录 → sitemap → 填 `https://hunt.zalize.com/sitemap.xml` | 无 var | **未开始-待老板**（依赖第 13 项） | 站长平台 sitemap 状态「正常」；数天–数周后 `site:hunt.zalize.com` 出结果 |
| 15 | **百度：普通收录 API 推送 token** | Worker cron 每 24h 主动推送未收录 URL（已实现，配置即生效） | 站长平台 → 普通收录 → API 提交 → 复制接口地址里的 `site=` 与 `token=` | `wrangler.jsonc` `vars.BAIDU_PUSH_SITE="https://hunt.zalize.com"`；`cd apps/web && npx wrangler secret put BAIDU_PUSH_TOKEN`（**token 只进 secret**）；配额 <2000 时可加 `vars.BAIDU_PUSH_DAILY_MAX="<配额>"` → `pnpm deploy` | **未开始-待老板**（`/api/usage` `baiduLast=null`、`baiduLastError=null` = cron 未运行推送分支） | 下一次 cron（≤6h）后 `/api/usage` `baiduLast` 出现时间戳、`baiduLastError=null`；站长平台「API 提交」页当日推送条数 >0 |
| 16 | **微信认证公众号（服务号优先）appId/appSecret + JS 接口安全域名** | 让微信内分享卡片可自定义标题/摘要/缩略图（JS-SDK `updateAppMessageShareData`）；当前只能靠 `<title>`/description + `/wx-share.png` 兜底（`docs/research/wechat-share.md` §6） | 公众号后台 <https://mp.weixin.qq.com/> → 设置与开发 → 基本配置 拿 AppID/AppSecret；→ 公众号设置 → 功能设置 → JS 接口安全域名 填 `hunt.zalize.com`（需上传校验文件，届时由开发放到 `apps/web/public/`） | 到位后才开发：`npx wrangler secret put WECHAT_APP_ID` / `WECHAT_APP_SECRET`（变量名以届时实现为准，现在代码**尚无** JS-SDK 集成） | **未开始-待老板**（代码无 JS-SDK，无可公开核实项） | 真机微信内打开 `/s/:id` 分享出的卡片显示自定义摘要「… 共 N 个可注册」与 PNG 缩略图 |
| 17 | **开源发布/发帖时机决策（Show HN 等）** | `docs/launch/launch-checklist.md` §0 全勾完才发；当前第 1 项未解决时首屏 CTA 会失败，**不要发帖** | 按 `launch-checklist.md` §0 逐项勾选；发帖素材见同文件 §1–§2 | 无 | **未开始-待老板**（被第 1 项阻塞） | 发帖当天 `wrangler tail` 值守；`/api/usage` 当日 `searches` 与 `aiErrors` 比值可解释 |

**不是老板项、由团队自己做**：准备 1–2 个 good first issue（`launch-checklist.md` §0，当前 label 搜索为 0 条）；README 与线上一致性核对（R490 已做）；R487 usage 原子计数修复。

## 2. 证据（2026-09-04 20:14–20:20 UTC，全程 0 AI）

所有命令均带 Mozilla UA 与 `?cb=` 穿透缓存；`/api/usage` 核对前后 `searches=9 / aiErrors={rate-limit:4, quota:3}` 无变化，证明本轮核对未触发 AI。

| 判定项 | 命令 | 结果 |
|---|---|---|
| 首页 `<head>` 验证/分析标记 | `curl -s -A Mozilla https://hunt.zalize.com/?cb=… \| grep -o 'google-site-verification\|msvalidate.01\|baidu-site-verification\|data-cf-beacon\|wx-share.png' \| sort \| uniq -c` | 仅 `wx-share.png ×1`；四个验证/分析标记 **均为 0** → 第 3(meta 路径)/4/5/13 项未配置 |
| Google 网域级验证 | `dig +short TXT zalize.com` | 3 条 `google-site-verification=…` + 1 条 SPF → 第 3 项「待老板确认」 |
| 注册商返佣 | `curl -s https://hunt.zalize.com/api/registrars?cb=…` | `{"affiliate":{}}`（`cache-control: public, max-age=300`）→ 第 6–9 项未配置 |
| AI 额度 / 备用上游 / 百度推送 / IndexNow | `curl -s 'https://hunt.zalize.com/api/usage?days=3&cb=…'` | 2026-09-04：`aiErrors:{rate-limit:4,quota:3}`、`fallbacks:{quota:2,quota-breaker:2}`、无 `llmProvider`；`baiduLast:null`、`baiduLastError:null`；`cronLast=2026-09-04T18:00:11Z`（心跳正常）；`indexnowLast=2026-09-03T12:00:34Z`、`indexnowLastError={status:429,"Too many requests",submitted:0}`（18:00 那次推送被 IndexNow 限流，6h 后自动重试）；`botsBy.baidu=6` |
| GitHub About | 内置 `git_list_repos`（GitHub API `description` 字段） | 「批量域名猎手：词根组合生成 + RDAP/DNS 批量核验（open-core） — hunt.zalize.com」→ 第 10 项未更新；Topics/Discussions/漏洞报告因未鉴权 API 限流（HTTP 403 rate limit）无法读取 |
| GitHub Social preview | `curl -s -A Mozilla https://github.com/wookat/domainhunter \| grep og:image` | `https://opengraph.githubassets.com/<hash>/wookat/domainhunter` = 自动图，未上传自定义图 |
| good first issue | `https://api.github.com/search/issues?q=repo:wookat/domainhunter+label:"good first issue"` | `total_count: 0` |
| 本文链接可达性 | 脚本逐条 GET（Mozilla UA）+ Playwright 浏览器复核 | 22/24 为 2xx；`namecheap.com/affiliates/` 与 `spaceship.com/affiliate-program/` 返回 Cloudflare 人机挑战（403「Just a moment」），自动化无法穿透，需人工在浏览器打开 |

## 3. 填 var / secret 的统一约定

- **公开 var**（验证串、analytics token、返佣参数、`BAIDU_PUSH_SITE`）：写进 `apps/web/wrangler.jsonc` 的 `vars` 并提交仓库 → 走 `deploy/r192-r195` 集成分支由父会话 `cd apps/web && pnpm deploy`。**不要**在 Cloudflare Dashboard 单独改：`wrangler deploy` 会用 `wrangler.jsonc` 的 vars 覆盖控制台值（<https://developers.cloudflare.com/workers/configuration/environment-variables/>）。
- **secret**（`DEEPSEEK_API_KEY`、`LLM_FALLBACK_*`、`BAIDU_PUSH_TOKEN`、未来的微信 secret）：只用 `cd apps/web && npx wrangler secret put <NAME>`，不进 `wrangler.jsonc`/代码/PR/聊天记录。
- 部署后统一自查：`curl -s -A Mozilla 'https://hunt.zalize.com/?cb=<随机>' | grep -c 'google-site-verification\|msvalidate.01\|baidu-site-verification\|data-cf-beacon'` 与 `curl -s 'https://hunt.zalize.com/api/usage?days=1&cb=<随机>'`。

## 4. 来源文档（调研证据保留在原处）

- 第 1–2 项：`docs/handoff-context.md` §「已知坑」LLM 额度、`docs/launch/launch-checklist.md` §0
- 第 3–5 项：`docs/research/growth-analytics.md` §7
- 第 6–9 项：`docs/research/registrar-affiliate.md` §3
- 第 10–12、17 项：`docs/launch/launch-checklist.md` §0、§3
- 第 13–15 项：`docs/research/baidu-seo.md` §5
- 第 16 项：`docs/research/wechat-share.md` §6
