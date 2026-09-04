# 贡献指南 / Contributing

感谢你愿意为 DomainHunter 贡献。本文档描述开发环境、分支/PR 约定、本地验收标准，以及几条**硬指标**（双语、375px、双主题对比度、键盘可达、零 AI 调用测试）。English summary at the bottom.

## 1. 开发环境

- Node.js ≥ 20，pnpm ≥ 9（仓库用 pnpm workspace：`packages/core` + `apps/web`）。
- Cloudflare Wrangler（随 `apps/web` devDependencies 安装，`npx wrangler`）。

```bash
git clone https://github.com/wookat/domainhunter.git
cd domainhunter
pnpm install --frozen-lockfile
pnpm dev          # wrangler dev：本地 Worker + Vite 构建产物
```

- 本地 AI 猎名需要 `apps/web/.dev.vars`（已 gitignore）里的 `DEEPSEEK_API_KEY`。**绝大多数改动不需要它**：精确核验、批量、MCP、监控、内容页全部零 AI。
- 不要把任何 key 写进 `wrangler.jsonc` 或提交到仓库（见 §6）。

目录速览：

| 路径 | 内容 |
|---|---|
| `packages/core/src` | 纯 TS 引擎：`generateCandidates`、`checkDomains`（DoH → RDAP，WHOIS 兜底以回调注入） |
| `apps/web/src/worker.ts` | Hono Worker：全部 `/api/*`、`/mcp`、SSR meta、Cron |
| `apps/web/src/whois.ts` | WHOIS 43 端口兜底（`cloudflare:sockets`，服务器清单 `WHOIS_SERVERS`） |
| `apps/web/src/components/` | React 页面与组件（`home-page` / `advanced-page` / `monitors-page` / …） |
| `apps/web/src/lib/i18n.tsx` | zh/en 词典，所有用户可见文案必须走这里 |
| `apps/web/src/content/` | TLD 指南 / 行业指南 / 对比页数据（内容页数量受 `scripts/content-counts.json` 守卫） |
| `docs/handoff-context.md` | 项目交接文档：路由、KV key、踩坑、进行中任务（**改代码前先读**） |
| `docs/qa/` | 历次审计报告与脚本 |
| `.agents/skills/testing-domainhunter/` | 零 AI 生产审计 SOP |

## 2. 分支与 PR 约定

- **base 分支**：请针对当前生产集成分支开 PR（当前为 `deploy/r192-r195`，以 `docs/handoff-context.md` 顶部说明为准）；`main` 由维护者在部署后回合。
- **分支命名**：`<type>/<short-slug>`，如 `fix/monitor-webhook-timeout`、`docs/readme-en`、`feat/cn-registrar-prices`。
- **提交信息**：`type(scope): 摘要`，type ∈ `feat | fix | docs | refactor | test | chore`，摘要中英文皆可，一行说清楚**为什么**。
- **一个 PR 只做一件事**。涉及 UI 的 PR 请附截图（浅色 + 深色，桌面 + 375px）。
- PR 描述按 `.github/PULL_REQUEST_TEMPLATE.md` 填写，尤其是「本地验收」与「零 AI」两项勾选。
- 不要新增或修改 `.github/workflows/`：本仓库**不依赖 GitHub Actions**，验收以本地命令为准（§3）。

## 3. 本地验收（合并门槛）

PR 提交前，三条命令必须**全绿**：

```bash
pnpm -r typecheck
pnpm --filter web test
pnpm --filter web build
```

改动内容页（`apps/web/src/content/*`）时另跑：

```bash
node scripts/check-content-counts.mjs
```

## 4. 硬指标（UI / 文案改动必须满足）

1. **双语**：所有用户可见文案必须同时提供 zh 与 en（`apps/web/src/lib/i18n.tsx`），禁止硬编码单语字符串；worker 侧 SSR 文案（如 `HOME_FAQ`）zh/en 两份都要改。
2. **375px 移动端**：在 375×667 视口下无横向溢出、首屏关键按钮可见且不换行破版、触控目标 ≥ 40px。
3. **双主题对比度**：浅色与深色主题下正文/按钮/状态色对比度 ≥ 4.5:1（大字 ≥ 3:1）。
4. **键盘可达**：所有可点击元素可 Tab 到达、有可见 focus 态、Enter/Space 可触发；弹层可 Esc 关闭。
5. **不写未实现的功能**：README / 内容页 / FAQ 声明必须与 `worker.ts` 路由和实际行为一致。

## 5. 零 AI 测试约定（重要）

`/api/ai-search` 每次调用都消耗 LLM 额度。**开发与测试默认全程 0 AI 调用**：

- 不要点击首页 AI CTA（「开始猎取」/ "Start hunting"）、示例提示词、「再猎一轮」、refine 按钮。
- 回归验证走零 AI 路径：首页「精确核验」、`/advanced` 批量、`POST /api/check`、`POST /api/search`、`POST /mcp` `check_domains`、全部内容页。
- 需要在生产做 AI 相关验证时，先与维护者确认额度，测试前后各拉一次 `GET /api/usage?days=1` 确认消耗可解释。
- 在生产浏览器做审计时，先备份 `localStorage` / `sessionStorage`，结束后逐字节还原并复核（完整 SOP：`.agents/skills/testing-domainhunter/SKILL.md`）。
- 生产 URL 带 CDN 缓存（`sitemap.xml` / `llms.txt` 24h），验证时加 `?cb=<随机数>` 穿透。

## 6. 安全与红线

- 不提交 secrets：所有 key 只走 `wrangler secret put` 或本地 `.dev.vars`。
- 不在测试中注册域名、不触发任何付款流程。
- 不修改 `docs/handoff-context.md` 的历史记录段落（维护者在部署后统一更新）。
- 漏洞请走 [SECURITY.md](./SECURITY.md)，不要开公开 Issue。

## 7. 提 Issue

请使用 Issue 模板（[Bug 报告](https://github.com/wookat/domainhunter/issues/new?template=bug_report.yml) / [功能建议](https://github.com/wookat/domainhunter/issues/new?template=feature_request.yml)），Bug 请附：复现步骤、期望/实际、浏览器与视口宽度、语言与主题、是否涉及 AI 路径。

---

## English summary

- **Setup**: Node ≥ 20, pnpm ≥ 9 → `pnpm install --frozen-lockfile && pnpm dev`. `DEEPSEEK_API_KEY` in `apps/web/.dev.vars` is only needed for AI hunting.
- **Branches / PRs**: target the current production integration branch (see top of `docs/handoff-context.md`, currently `deploy/r192-r195`); branch as `<type>/<slug>`; commits `type(scope): summary`; one concern per PR; UI PRs include light + dark + 375 px screenshots. Do not add or edit GitHub Actions workflows — acceptance is local.
- **Acceptance gate**: `pnpm -r typecheck`, `pnpm --filter web test`, `pnpm --filter web build` must all pass locally.
- **Hard requirements**: every user-facing string in both zh and en via `apps/web/src/lib/i18n.tsx`; no overflow at 375 px; ≥ 4.5:1 contrast in light and dark; full keyboard reachability; never document unimplemented features.
- **Zero-AI testing**: never trigger `/api/ai-search` (AI CTA, example prompts, refine, "one more round") during development or audits; use exact check, `/advanced`, `/api/check`, `/api/search`, MCP `check_domains` and content pages instead. Back up and byte-for-byte restore browser storage when auditing production (`.agents/skills/testing-domainhunter/SKILL.md`).
- **Red lines**: no secrets in the repo, no domain registration or payments in tests, report vulnerabilities via [SECURITY.md](./SECURITY.md).
