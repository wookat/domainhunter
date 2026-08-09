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
- MCP `tld_prices` returns `prices` as a dict keyed by TLD (not an array); expected tldCount=168.
- Hub counts (as of R287): /tld 168, /guide 164, /vs 192; quick-check "All" = 169 (168 + com.cn).
- 375px viewport checks: use CDP `Emulation.setDeviceMetricsOverride` in a separate tab; assert `document.documentElement.scrollWidth <= 375`.
- Lighthouse CLI with `--chrome-flags="--headless=new --no-sandbox"` works fine against production.
