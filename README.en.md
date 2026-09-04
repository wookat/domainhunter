<div align="center">

# DomainHunter

**The domain hunter for Chinese founders: describe the meaning, get `.cn` / `.com` names that are actually registrable — right now.**

[Live: hunt.zalize.com](https://hunt.zalize.com?lang=en) · [中文 README](./README.md) · [MCP](https://hunt.zalize.com/mcp?lang=en) · [TLD prices](https://hunt.zalize.com/prices?lang=en)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Hono](https://img.shields.io/badge/Hono-4-E36002?logo=hono&logoColor=white)](https://hono.dev/)
[![React 18](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-Streamable_HTTP-000000)](https://hunt.zalize.com/mcp?lang=en)
[![GitHub stars](https://img.shields.io/github/stars/wookat/domainhunter?style=social)](https://github.com/wookat/domainhunter/stargazers)

<img src="./docs/assets/home-en-dark.png" alt="DomainHunter home (English, dark theme)" width="880" />

</div>

---

## What it is

Describe what you're building in one sentence — in Chinese or English — and an AI agent **proposes → verifies in real time → reflects and hunts again**, up to 5 rounds, returning only domains that are **actually registrable at this moment**, with expiry dates, first-year prices and registrar links.

It is tuned for Chinese founders and indie developers: candidates span **pinyin (full / abbreviated), fitting English words, coined words, and pinyin + English blends**, and verification covers `.cn` / `.com.cn` (CNNIC WHOIS) alongside `.com` and other mainstream TLDs. For generic English naming there are already great tools; we don't claim to beat them. **Chinese meaning → registrable domain** is the one thing this project focuses on.

Free, no login, open-core (MIT).

## Features

Everything below is live in production (routes: `apps/web/src/worker.ts`):

| Feature | Details | Where |
|---|---|---|
| **Multi-round AI agent** | Meaning → candidates (pinyin / word / coined / blend) → live check → cross-round dedup & reflection, up to 5 rounds, NDJSON stream; 20 req/h per IP | Home · `POST /api/ai-search` |
| **Real-time verification** | DoH prefilter → RDAP (IANA bootstrap) → WHOIS:43 fallback (`com/net/cn/com.cn/io/cc/tv/co/me/xyz/sh/gg/so/us`); results include `expiresAt` | all check paths |
| **Exact check / type-to-check** | Check a full domain instantly, no AI used | Home → "Exact check" |
| **Bulk paste + CSV export** | Up to 200 domains per run (newline/comma/space separated); bare names expand by TLD; copy available / export CSV | [/advanced](https://hunt.zalize.com/advanced?lang=en) · `POST /api/search` |
| **Expiry date + first-year price** | Taken domains show expiry; available ones show live Porkbun first-year price (static reference price `≈` for TLDs without a quote) | results · [/prices](https://hunt.zalize.com/prices?lang=en) · `GET /api/prices` |
| **Drop monitoring + webhook** | Watch a taken domain; cron rechecks every 6 h and POSTs status changes to your https webhook; manual recheck (60 s per IP) | [/monitors](https://hunt.zalize.com/monitors?lang=en) · `/api/monitor*` |
| **Shortlist + share / sync** | Local shortlist; read-only share page `/s/:id` (30 days, revocable); 8-char sync code for cross-device sync without login (90 days) | [/shortlist](https://hunt.zalize.com/shortlist?lang=en) · `/api/share` · `/api/sync` |
| **MCP endpoint** | `POST /mcp` (JSON-RPC 2.0, Streamable HTTP, protocol `2025-03-26`); tools: `check_domains` (≤50), `tld_prices`, `suggest_variants` | [/mcp](https://hunt.zalize.com/mcp?lang=en) |
| **400+ content pages** | TLD guides `/tld/:tld` (408), industry naming guides `/guide/:slug` (404), TLD comparisons `/vs/:slug` (444); bilingual, SSR meta / JSON-LD / hreflang, `sitemap.xml`, `llms.txt` | e.g. [/tld/cn](https://hunt.zalize.com/tld/cn?lang=en) |
| **Bilingual · dual theme · mobile** | zh/en dictionary (`apps/web/src/lib/i18n.tsx`), light/dark (≥4.5:1 contrast), responsive from 375 px, keyboard accessible | top-right toggles |

<details>
<summary><b>More screenshots</b> (real production, zero AI calls)</summary>

| Bulk check + CSV + expiry + monitor | TLD prices |
|---|---|
| <img src="./docs/assets/advanced-bulk.png" alt="/advanced bulk check" /> | <img src="./docs/assets/prices.png" alt="/prices" /> |

| MCP docs | Monitors |
|---|---|
| <img src="./docs/assets/mcp.png" alt="/mcp" /> | <img src="./docs/assets/monitors.png" alt="/monitors" /> |

| Chinese / light | 375 px mobile |
|---|---|
| <img src="./docs/assets/home-zh.png" alt="home zh light" /> | <img src="./docs/assets/home-mobile-375.png" alt="home 375px" width="375" /> |

</details>

## Architecture

```mermaid
flowchart LR
  subgraph Client["Browser / MCP client"]
    SPA["React 18 SPA<br/>Vite · Tailwind · zh/en · light/dark · 375px+"]
    MCPC["MCP client (Claude / Cursor …)"]
  end

  subgraph Worker["Cloudflare Worker · Hono (apps/web/src/worker.ts)"]
    API["/api/ai-search · /api/search · /api/check<br/>/api/monitor* · /api/share · /api/sync<br/>/api/prices · /api/stats · /api/usage"]
    MCP["POST /mcp (JSON-RPC 2.0)<br/>check_domains · tld_prices · suggest_variants"]
    SSR["SSR meta / JSON-LD / hreflang<br/>/tld /guide /vs · sitemap.xml · llms.txt"]
    CRON["Cron 0 */6 * * *<br/>monitor sweep + webhook · IndexNow"]
  end

  subgraph Core["@domainhunter/core (packages/core)"]
    GEN["generateCandidates"]
    CHK["checkDomains<br/>DoH → RDAP (WHOIS fallback injected from apps/web/whois.ts)"]
  end

  KV[("Workers KV · CACHE")]
  LLM["LLM upstream (OpenAI-compatible)<br/>DEEPSEEK_API_KEY · optional fallback"]
  NET["DoH · IANA RDAP · WHOIS:43 · Porkbun pricing"]

  SPA --> API
  SPA --> SSR
  MCPC --> MCP
  API --> Core
  MCP --> Core
  API -. only /api/ai-search .-> LLM
  Core --> NET
  API <--> KV
  MCP <--> KV
  CRON <--> KV
  CRON --> Core
```

- **`packages/core`** — pure TypeScript engine (zero runtime deps): candidate generation + verification (DoH prefilter → IANA RDAP bootstrap); the WHOIS:43 fallback lives in `apps/web/src/whois.ts` (`cloudflare:sockets`) and is passed in as a callback.
- **`apps/web`** — Hono Worker (API, MCP, SSR, cron) + React 18 SPA served from the same Worker via the `ASSETS` binding.
- **KV `CACHE`** — check cache (taken 24 h / available 1 h), rate limits, monitor set, price cache, share/sync snapshots.
- **AI is used on exactly one path**: `/api/ai-search`. Exact check, bulk, MCP, monitoring and content pages make **zero AI calls**.

## Quick start

```bash
git clone https://github.com/wookat/domainhunter.git
cd domainhunter
pnpm install

pnpm dev                # wrangler dev (local Worker + SPA)
pnpm -r typecheck
pnpm --filter web test  # vitest
pnpm build              # vite build
```

Local AI hunting needs an LLM key: put `DEEPSEEK_API_KEY=...` in `apps/web/.dev.vars` (gitignored). Without it, everything except AI hunting still works.

## Self-host on Cloudflare

1. Log in and create the KV namespace:
   ```bash
   cd apps/web
   npx wrangler login
   npx wrangler kv namespace create CACHE
   ```
   Put the returned `id` into `kv_namespaces[0].id` in `apps/web/wrangler.jsonc` (and change `name` if you like).
2. Set secrets — **only via `wrangler secret put`, never in `wrangler.jsonc`**:

   | Secret / var | Required | Notes |
   |---|---|---|
   | `DEEPSEEK_API_KEY` | for AI hunting | LLM key (DeepSeek or any OpenAI-compatible gateway). Without it only AI hunting is disabled |
   | `LLM_API_BASE` | optional | OpenAI-compatible base URL, defaults to DeepSeek |
   | `LLM_MODEL` | optional | model name, defaults to `deepseek-chat` |
   | `LLM_THINKING` | optional | `disabled` turns off gateway-side reasoning (avoids 60 s timeouts) |
   | `LLM_FALLBACK_API_KEY` | optional | fallback upstream; on primary 401/402/403/5xx/quota-exhausted the request is retried once there |
   | `LLM_FALLBACK_API_BASE` / `LLM_FALLBACK_MODEL` / `LLM_FALLBACK_THINKING` | optional | fallback base / model / reasoning switch |

   ```bash
   npx wrangler secret put DEEPSEEK_API_KEY
   ```
3. Build and deploy:
   ```bash
   pnpm deploy             # = vite build && wrangler deploy
   ```
   The cron trigger (`0 */6 * * *`) and `ASSETS` binding are declared in `wrangler.jsonc`.
4. Optionally attach a custom domain in the Cloudflare dashboard.

## API at a glance

```bash
# bulk check (NDJSON stream)
curl -sN https://hunt.zalize.com/api/search \
  -H 'content-type: application/json' \
  -d '{"domains":["yunqilab.cn","muxinhub.com"]}'

# MCP: list tools
curl -s https://hunt.zalize.com/mcp \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

Full route list, KV key conventions and operational notes: [`docs/handoff-context.md`](./docs/handoff-context.md) (Chinese).

## Roadmap

Short iteration cycles (days, not quarters). Near-term:

- [ ] Keep tuning Chinese-meaning understanding and pinyin candidate quality against real founder prompts
- [ ] More Chinese registrar live pricing (`.cn` etc. currently use static reference prices; live prices come from Porkbun)
- [ ] More webhook/notification shapes for drop monitoring
- [ ] Publish `@domainhunter/core` to npm
- [ ] Keep the competitor comparison current ([`docs/research/`](./docs/research), [`docs/competitor-report.md`](./docs/competitor-report.md))

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) (dev setup, branch/PR conventions, local acceptance commands, bilingual i18n + 375 px requirements, **zero-AI testing rule**), [SECURITY.md](./SECURITY.md) and [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## License

[MIT](./LICENSE) © wookat
