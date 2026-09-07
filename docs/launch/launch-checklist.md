# 开源发布清单（草稿，R479）

> **状态：草稿，未发布。** 本文件只是发帖素材与检查项，不代表已发帖；实际发布由维护者决定时机并手动执行。所有事实性表述均以 `apps/web/src/worker.ts` 与 `docs/handoff-context.md` 为准，发帖前请再核对一次生产（零 AI 路径）。

## 0. 发帖前检查（全部勾完才发）

> 其中需老板操作的项（AI 额度、GitHub About/Topics/漏洞报告/Social preview、发帖时机）**单一事实源：[`docs/owner-actions.md`](../owner-actions.md)**（R490 起状态只在那里维护）。

- [ ] 生产 `https://hunt.zalize.com/?cb=<随机>` 首页 / `/advanced` / `/mcp` / `/prices` 200 且渲染正常（zh + en、浅 + 深、375px）
- [ ] `GET /api/usage?days=1` 确认 AI 额度状态；若 DeepSeek 主上游额度耗尽且未配置备用上游，**不要发帖**（首屏 CTA 会失败）
- [ ] AI 限流 20 次/小时/IP 是否足够承接 HN 流量峰值？评估是否临时放宽或在首页说明
- [ ] README 中的截图与功能表与线上一致；`README.en.md` 链接可达
- [ ] GitHub 仓库：About 填一句话定位 + 网站 `https://hunt.zalize.com` + Topics（见 §3）；开启 Discussions（可选）；开启 *Private vulnerability reporting*（SECURITY.md 依赖）
- [ ] 社交预览图（Settings → Social preview）上传 `docs/assets/home-zh.png` 或 `/api/og/home` 输出
- [ ] `LICENSE` / `CONTRIBUTING.md` / `SECURITY.md` / `CODE_OF_CONDUCT.md` / Issue 模板在仓库首页可见
- [ ] 准备 1–2 个 "good first issue"（例：新增一个 WHOIS 服务器、补一个 TLD 指南）
- [ ] 发帖当天有人值守 4–6 小时回评论；准备好 `wrangler tail` 看错误

## 1. Hacker News — Show HN

**标题候选（≤80 字符，选一）**

1. `Show HN: DomainHunter – AI agent that only returns domains you can actually register`
2. `Show HN: DomainHunter – Describe your idea in Chinese, get registrable .cn/.com domains`
3. `Show HN: Open-source domain hunter with RDAP/WHOIS live checks, MCP endpoint (Cloudflare Workers)`

推荐 1（面向 HN 通用受众，用"only returns registrable"这个可验证卖点），评论区第一条自述中再讲中文利基。

**链接**：`https://github.com/wookat/domainhunter`（HN 更接受源码链接；正文里再放 live demo）

**首段 / 首条评论草稿（英文）**

> Hi HN, I built DomainHunter because every AI name generator I tried returned names that were already taken. DomainHunter is an agent loop: it proposes candidates, verifies each one live (DNS-over-HTTPS → RDAP → WHOIS:43 fallback), then reflects on what was taken and hunts again — up to 5 rounds — and only shows you domains that are registrable *right now*, with expiry dates and first-year prices.
>
> It's tuned for Chinese founders (pinyin / coined / pinyin+English blends, `.cn` and `.com.cn` via CNNIC WHOIS), which is a gap the English-first tools don't cover — but bulk checking, drop monitoring with webhooks, CSV export and the MCP endpoint (`POST /mcp`: `check_domains`, `tld_prices`, `suggest_variants`) work for any language.
>
> Stack: Cloudflare Workers + Hono + Workers KV, React 18 / Vite / Tailwind, pure-TS core (`packages/core`). MIT, free, no login. Live: https://hunt.zalize.com — the exact/bulk check and MCP paths use zero AI, so please hammer those; the AI path is rate-limited to 20/h per IP because DeepSeek is metered.
>
> Happy to answer questions about RDAP bootstrap quirks (`.sh/.gg/.so/.us` aren't in IANA's bootstrap, WHOIS is the only channel) or running WHOIS over `cloudflare:sockets`.

**HN 注意事项**
- 不要在标题里放 emoji / 感叹号；不要求点赞。
- 首条评论用个人口吻讲"为什么做"，技术细节放后面。
- 预期问题：① 与 tldx / instant domain search 的区别（答：agent 反思循环 + 中文候选 + 只给可注册）② 缓存会不会误报可注册（答：available 只缓存 1h，taken 24h；可 `refresh:true` 穿透）③ WHOIS 限速（答：DoH 预筛 + RDAP 优先，WHOIS 兜底）④ 为什么 DeepSeek（答：OpenAI 兼容任意上游，`LLM_API_BASE` 可换）。

## 2. V2EX 帖子草稿

**节点**：分享创造（/go/create）；备选：程序员 / 域名（/go/dns）

**标题候选**

1. `开源了一个给中文创业者用的域名猎手：说出寓意，只给你真正能注册的 .cn/.com`
2. `做了个 AI 域名猎手，多轮构思+实时 RDAP/WHOIS 核验，只返回此刻可注册的域名（开源 MIT）`

**正文草稿**

> 起因很简单：用 AI 起名工具生成的名字，十个里九个域名早被注册了，还得一个个去查。
>
> 所以做了 DomainHunter：你用一句中文描述想做的事（比如「面向独立开发者的 AI 周报工具，名字要短、极客感」），它会分四条路线出候选（拼音 / 英文单词 / 英文造词 / 拼音+英文混搭），**每一个都实时核验**（DoH 预筛 → RDAP → WHOIS 兜底，.cn/.com.cn 走 CNNIC），把被占的反馈给下一轮再猎，最多 5 轮，最后只给你此刻真的能注册的，附到期日和首年价格。
>
> 除了 AI 猎名，这些功能**不消耗 AI**、随便用：
> - 精确核验 / 批量粘贴核验（≤200 个）+ 导出 CSV：https://hunt.zalize.com/advanced
> - 已注册域名的到期日 + 「监控释放」，每 6 小时复查，有变化推 Webhook
> - TLD 价格总览：https://hunt.zalize.com/prices
> - MCP 端点 `POST /mcp`（check_domains / tld_prices / suggest_variants），Claude / Cursor 里直接查域名：https://hunt.zalize.com/mcp
> - 400+ 双语内容页（TLD 指南 / 行业命名指南 / TLD 对比）
>
> 技术栈：Cloudflare Workers + Hono + KV，前端 React 18 / Vite / Tailwind，核心引擎是零依赖的纯 TS 包。免费、免登录、MIT 开源，可以一键自部署到自己的 Cloudflare 账号（README 有 wrangler 步骤）。
>
> 在线：https://hunt.zalize.com
> 源码：https://github.com/wookat/domainhunter
>
> AI 路径每 IP 每小时 20 次（DeepSeek 按量计费），其余路径没限制。欢迎拍砖，尤其是拼音候选质量和 .cn 核验准确度——这是我最想做好的两件事。

**V2EX 注意事项**
- 分享创造节点要求是自己做的、有实际可用产物，正文别像广告。
- 回复里主动问"你们起名时最痛的点是什么"，收集需求进 Issue。
- 预期问题：.cn 实名认证与备案（答：我们只查可注册与价格，不代注册）、价格来源（Porkbun 实时，.cn 为静态参考价）、隐私（无账号、监控清单在本地 localStorage）。

## 3. GitHub Topics 建议（≤20，按优先级）

```
domain-search  domain-name  domain-availability  domain-generator  domain-monitoring
rdap  whois  ai-agent  mcp  model-context-protocol
cloudflare-workers  hono  react  typescript  pnpm-monorepo
chinese  pinyin  startup-naming  brand-name  open-source
```

**About 一句话（英文，GitHub About 栏）**
`AI domain hunter for Chinese founders — describe the meaning, get .cn/.com names you can actually register. Live RDAP/WHOIS checks, bulk CSV, expiry, prices, drop monitoring, MCP endpoint. Cloudflare Workers + Hono + React.`

## 4. 发布后 48 小时

- [ ] 每 2 小时看一次 `GET /api/usage?days=1`（`searches` / `aiErrors` / `llmProvider`）与 `wrangler tail`
- [ ] 把 HN / V2EX 评论里的需求整理成 Issue（打 `from-hn` / `from-v2ex` 标签）
- [ ] README 顶部加 HN / V2EX 讨论链接（可选）
- [ ] 复盘：star 增量、访问量、AI 调用量、错误率，写进 `docs/launch/launch-retro-<date>.md`

## 5. 竞品 README 参考（R479 实测，用于自查）

| 项目 | Stars（2026-09-04 GitHub API） | README 结构要点 |
|---|---|---|
| brandonyoungdev/tldx | 1,919 | logo + 徽章 + demo GIF；TOC；Features；Usage/Examples（大量 CLI 示例）；MCP 段；Installation 多渠道 |
| vasilytrofimchuk/domainsearcher-app | 635 | Live site / stars / license / AI 徽章；首屏截图；面向 startup 的定位；评分表；可用性判定细节；本地启动 |
| xuemian168/domain-scanner | 607 | 多语言 README 链接；徽章；star-history 图；Features；Installation/Usage；Security/Performance；Contributing；License |

我们对齐的做法：徽章 + 首屏真实截图 + 功能表（含入口路由）+ Mermaid 架构图 + 快速开始 + 自部署 + API 示例 + 路线图 + 贡献/安全/行为准则入口；差异点是**以中文 README 为主、英文精简版分离**，以及明确写出"零 AI 路径"以降低试用门槛。
