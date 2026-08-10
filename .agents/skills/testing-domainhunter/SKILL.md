---
name: testing-domainhunter
description: How to run zero-AI production audits of DomainHunter (hunt.zalize.com) without consuming AI quota, with storage backup/restore and MCP/API verification.
---

# Testing DomainHunter (hunt.zalize.com)

## Zero-AI constraint
- `/api/ai-search` consumes DeepSeek quota. Never click the AI CTA ("Start hunting"/开始寻找), example prompts, refine, or one-more-round buttons.
- Safe non-AI paths: quick-check (Exact check tab), bulk paste on `/advanced`, MCP JSON-RPC at `POST /mcp`, all static/hub/content pages.
- Prove zero AI calls by diffing `GET /api/usage` before/after (parsed JSON equality). Quick-check/bulk/MCP do not increment usage.

## Storage backup/restore
- User prefs live in localStorage: `domainhunter:lang`, `domainhunter:theme`, `domainhunter:shortlist`, `dh:onboardDismissed:v1`, `dh:lastSearch:v1`, `domainhunter:recent-searches`.
- Back up ALL keys before touching the site; restore byte-for-byte at the end and verify via re-dump diff. Helper scripts: `docs/qa/dump_storage.py` / `docs/qa/restore_storage.py` (Playwright over CDP, `connect_over_cdp("http://localhost:29229")` or whatever the session CDP port is).

## Gotchas
- Direct `curl`/urllib without a browser User-Agent may get 403 from Cloudflare on HTML pages; add a Mozilla UA.
- Raw `websocket-client` CDP connections need `suppress_origin=True` (Chrome rejects the localhost Origin otherwise).
- `/s/:id` share pages always return HTTP 200 (SPA shell); the 410 (revoked) / 404 (unknown) semantics are on `GET /api/share/:id`. Revoke via `DELETE /api/share/:id` with `{"token": revokeToken}` from the create response.
- SPA 404 status: unknown top-level paths and unknown `/tld|/guide|/vs` slugs DO return real HTTP 404 with a branded page.
- MCP `tld_prices` returns `prices` as a dict keyed by TLD (not an array); expected tldCount = current /tld count (186 as of R301).
- Hub counts (as of R303): /tld 186, /guide 182, /vs 216; quick-check "All" = /tld count + 1 (com.cn). Authoritative counts live in `scripts/content-counts.json`.
- On /vs pages, en language is served via `?lang=en` query param (a `/en/...` path prefix 404s); the hub filter input (`input[type=search]`) is the fastest way to locate a specific compare card.
- Local testing without deploying: `pnpm install`, then in `apps/web` run `pnpm build` (vite) followed by `npx wrangler dev --port 8787` — it serves the built `dist` plus the worker routes (sitemap.xml, /llms.txt, /api/*) on localhost. `/prices` shows static reference prices when live Porkbun quotes are unavailable locally. Start it with `setsid nohup npx wrangler dev --port 8787 &` from `apps/web`: if launched from a shell that gets timeout-reaped, the dead instance's port can briefly keep returning 200 with an empty body.
- To count /prices table rows objectively, count `main a[href^="/?tld="]` (Hunt links) — the table is not a `<table>` element.
- 375px viewport checks: use CDP `Emulation.setDeviceMetricsOverride` in a separate tab; assert `document.documentElement.scrollWidth <= 375`.
- Lighthouse CLI with `--chrome-flags="--headless=new --no-sandbox"` works fine against production.
- Hub pages (/tld, /guide, /vs) have a sticky group-chips anchor nav (R415): chips are `nav[aria-label="分组导航"/"Group navigation"] a[href^="#hub-g-"]`, sections are `id="hub-g-<group>"` with `scroll-mt-28`; the back-to-top button (`button[aria-label="回到顶部"/"Back to top"]`, 44×44) appears once `scrollY > innerHeight`. Note the chips row can show a horizontal OS scrollbar that makes nav bottom (~124px) exceed scroll-mt-28 (112px), slightly clipping headings after anchor jumps — measure with getBoundingClientRect if verifying anchor offsets.
- Before browser-testing a freshly checked-out branch locally, confirm `apps/web/dist/assets` mtimes are newer than the checkout (wrangler dev serves the prebuilt dist; rerun `pnpm build` in apps/web if stale).
- When taking 375px CDP-emulated screenshots of a background tab, `page.screenshot()` can return an all-black image for the dark theme; use `Page.captureScreenshot` via the CDP session (and `bring_to_front`) instead.
- The /tld hub has an `input[type=search]` filter (aria-label "Filter TLDs…/筛选后缀…") — fastest way to locate a single TLD and its category.
- Local `wrangler dev` CAN fetch live Porkbun quotes, so TLD detail pages show live prices rather than static reference prices; to verify `TLD_PRICES`, grep the SSR HTML for「静态参考价：首年 ¥X · 续费 ¥Y/年」.
