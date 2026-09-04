# 安全政策 / Security Policy

## 报送漏洞（请勿开公开 Issue）

请通过 **GitHub Security Advisories** 私密报送：

👉 https://github.com/wookat/domainhunter/security/advisories/new

报告中请尽量包含：

- 受影响的路由 / 组件（如 `POST /api/monitor`、`/mcp`、`apps/web/src/worker.ts` 某函数）
- 复现步骤或 PoC（curl 命令、请求体）
- 影响评估（信息泄露 / 越权 / 资源耗尽 / 注入等）
- 你认为可行的修复方向（可选）

我们会在 **7 天内**确认收到，并在评估后与你同步修复计划与披露时间。修复发布后会在 Advisory 中致谢（如你愿意）。

## 范围

| 在范围内 | 不在范围内 |
|---|---|
| `hunt.zalize.com` 生产 Worker（`apps/web/src/worker.ts` 全部路由、`/mcp`、Cron） | 第三方上游本身的漏洞（DeepSeek / Porkbun / IANA RDAP / 各注册局 WHOIS） |
| `packages/core` 引擎 | 需要物理接触或社会工程的攻击 |
| KV 数据访问控制（分享 `revokeToken`、同步码、监控集合） | 域名注册商页面（「去注册」跳转后的第三方站点） |
| 限流绕过导致 LLM 额度 / WHOIS 通道被滥用 | 仅在过期浏览器上成立的问题 |
| 注入 / XSS / SSRF（如监控 Webhook URL、分享快照渲染、SSR meta 注入） | 自动化扫描器的无上下文告警 |

## 测试约束

- **不要触发 `/api/ai-search` 做压力或模糊测试**——它消耗按量计费的 LLM 额度；限流相关验证请以低频请求配合代码阅读说明。
- 不要在测试中注册域名或触发付款。
- 不要对生产 KV 做破坏性操作（如批量占满全局 500 个监控名额）；请在自部署实例上复现。

## 支持版本

只有当前生产集成分支（见 `docs/handoff-context.md` 顶部）与 `main` 接受安全修复。

---

## English

Please report vulnerabilities privately via **GitHub Security Advisories**: https://github.com/wookat/domainhunter/security/advisories/new — do **not** open a public issue.

Include the affected route/component, reproduction steps or PoC, impact, and (optionally) a suggested fix. We acknowledge within 7 days and coordinate a fix and disclosure timeline with you.

**In scope**: the production Worker (`apps/web/src/worker.ts` routes, `/mcp`, cron), `packages/core`, KV access control (share revoke tokens, sync codes, monitor set), rate-limit bypass, injection/XSS/SSRF (webhook URLs, share snapshots, SSR meta).
**Out of scope**: vulnerabilities in third-party upstreams (LLM provider, Porkbun, RDAP/WHOIS registries), registrar sites we link to, social engineering, unauthenticated scanner noise.

**Testing constraints**: do not fuzz or load-test `/api/ai-search` (metered LLM quota); do not register domains or trigger payments; do not perform destructive tests against production KV — reproduce on a self-hosted instance instead.
