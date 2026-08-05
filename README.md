# DomainHunter

批量域名猎手：把一个想法变成一份可注册域名清单。

- 词根 × 前后缀 × TLD 批量组合生成
- RDAP + DNS(DoH) 双通道可用性核验，流式返回
- 在线版：https://hunt.zalize.com
- open-core：核心引擎与 Web UI 开源（MIT）

## Monorepo

- `packages/core` — 生成 + 核验引擎（纯 TS，Node/Workers 通用）
- `apps/web` — Hono on Cloudflare Workers + React/Tailwind 前端

## 开发

```bash
pnpm install
pnpm dev        # 本地开发（wrangler dev）
pnpm build      # 构建前端
pnpm deploy     # 部署 Cloudflare Workers
```

## API

`POST /api/search` `{ roots, prefixes?, suffixes?, tlds }` → NDJSON 流，每行 `{ domain, status, method }`，`status ∈ available | taken | unknown`。
