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

### Worker secret（AI 猎名）

secret 一律用 `wrangler secret put` 写入（在 `apps/web` 下执行），**不要写进 `wrangler.jsonc`**：

```bash
wrangler secret put DEEPSEEK_API_KEY        # 主 LLM 上游（必需）
# 可选：LLM_API_BASE / LLM_MODEL / LLM_THINKING（主上游 base / model / thinking=disabled）

# R474 备用 LLM 上游（全部可选；未配置 LLM_FALLBACK_API_KEY 时 failover 休眠，行为与单上游完全一致）
wrangler secret put LLM_FALLBACK_API_KEY    # 任一 OpenAI 兼容端点的 key（DeepSeek 官方 / 硅基流动 / OpenRouter 等）
wrangler secret put LLM_FALLBACK_API_BASE   # 如 https://api.deepseek.com、https://api.siliconflow.cn/v1、https://openrouter.ai/api/v1
wrangler secret put LLM_FALLBACK_MODEL      # 如 deepseek-chat、deepseek-ai/DeepSeek-V3、deepseek/deepseek-chat
wrangler secret put LLM_FALLBACK_THINKING   # 备用模型需关思考时填 disabled，否则不设
```

主上游返回 401/402/403、429（额度耗尽 body）、5xx 或网络超时时，用备用配置重发同一请求（同 prompt、同 stream）；429 瞬时限流不切换。`/api/ai-search` 每轮汇总 `proposed` 事件带 `provider: "primary" | "fallback"`，`/api/usage` 按日计 `llmProvider: { primary, fallback }`。

## API

`POST /api/ai-search` `{ description, tlds? }` → AI 根据自然语言描述生成候选并核验，NDJSON 流（含 `meaning` 寓意说明）。

`POST /api/search` `{ roots, prefixes?, suffixes?, tlds }` → NDJSON 流，每行 `{ domain, status, method }`，`status ∈ available | taken | unknown`。
