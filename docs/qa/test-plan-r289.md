# R289 Test Plan — Zero-AI full-site production audit of https://hunt.zalize.com

Precedent/methodology: docs/qa/audit-r279.md. HARD CONSTRAINT: 0 AI calls — never click AI CTA/开始寻找/example prompts/refine/one-more-round; never hit /api/ai-search. Evidence dirs: docs/qa/screenshots-r289/, docs/qa/lighthouse-r289/. Record browser walkthrough.

## Phase 0 — Storage backup (before ANY site interaction)
- Via CDP/Playwright script: dump ALL localStorage + sessionStorage keys of hunt.zalize.com to docs/qa/storage-r289-backup.json. PASS: file written, key list logged.
- At very END: restore byte-for-byte, re-dump, `diff` empty → STORAGE_IDENTICAL. Also verify no leftover monitors/shortlist/shares.

## Phase A — R276 onboarding banner three states (recorded)
1. Fresh: clear dh:onboardDismissed:v1, dh:lastSearch:v1, domainhunter:recent-searches → reload → 3-step banner visible (screenshot A1). FAIL if hidden.
2. Dismissed: click close (aria-label 关闭引导) → banner hides, key dh:onboardDismissed:v1=1 written; reload → still hidden (A2).
3. Old-user suppression: remove dismissed key, set only domainhunter:recent-searches → reload → banner hidden (A3).

## Phase B — quick-check (non-AI)
1. Single random name (e.g. zx9qk7vhu3ab) → TLD chips render (B1).
2. baidu.com.cn → taken + expiry date shown (B2).
3. "All" expand → 全部 169 (168 tlds + com.cn) — verify actual number shown (B3). FAIL if ≠169 (note actual).
4. Unknown chips: any unknown chip has retry button; click one → single-domain re-check only (B4).

## Phase C — /prices (R280/283)
- Page renders 168 rows (C1). Static rows show CNY directly, no artifacts like ¥7.20-multiples of odd USD round trips (visual spot check).
- Spot-check 3 live rows: CNY == Math.round(USD×7.2) using USD from MCP tld_prices JSON (record row values in report).

## Phase D — hubs (R282/284) + counts
- /tld: SSR title 168 个后缀, 168 links; filter "ai" instant results (D1). /guide 164, filter "saas" (D2). /vs 192, filter "com" (D3).
- EN variants (?lang=en or toggle) render for each hub.
- Console: no hydration-mismatch errors.
- Network tab: each hub loads only its own index chunk (check chunk names, best-effort).

## Phase E — new content spot checks (R285–288)
- /tld/properties, /tld/construction, /vs/com-vs-travel, /vs/taxi-vs-city, /guide/realtor, /guide/apartment — each renders h1+body in zh AND en (E1–E6).
- R288 cardLine clamp: on hubs, card one-liners not overlong (zh first clause ≤42 chars, graceful truncation) — screenshot of representative cards (E7).

## Phase F — full-site pages & states
- /why, /shortlist (empty), /monitors (empty), /advanced bulk check (google.com + random name → streamed results, F1).
- SPA 404: /nonexistent-xyz AND /tld/nonexistent-slug → HTTP 404 + branded page (G1/G2, curl for status codes).
- Share: POST /api/share → open /s/:id renders snapshot (H1) → revoke → GET 410 (H2); unknown id → 404. Clean up.
- Language toggle zh↔en persists; light/dark theme toggle persists.
- 375px viewport: /, /prices, /tld, /vs/com-vs-travel — document.scrollWidth ≤ 375 (no horizontal overflow); spot-check 44px touch targets (K-*).

## Phase G — MCP (curl JSON-RPC, save JSONs)
- GET /mcp doc page renders (screenshot).
- tools/list → 3 tools. tld_prices → tldCount=168 (FAIL otherwise). check_domains: google.com taken, random name available, baidu.com.cn taken w/ expiresAt. suggest_variants acme/com limit 8 → 8 variants. Save mcp-*.json.

## Phase H — Lighthouse CLI (not recorded)
- Desktop+mobile for /, /prices, /tld, /guide, /vs = 10 runs min; plus 2 extra mobile runs each for the 3 hubs (total 3 per hub), take median. Save all JSONs to lighthouse-r289/. Report 4 category scores; flag perf <85 as P2, 85–89 as P3.

## Phase I — usage zero-increment proof + console + restore
- Dump /api/usage → usage-r289-post.json; parsed dict MUST equal usage-r289-pre.json (key-order-insensitive). FAIL = P0 (AI call leaked).
- Console log across walkthrough: 0 JS/application errors (expected 404/410 resource logs OK).
- Restore storage (Phase 0), verify diff empty; confirm monitors/shortlist/shares cleaned.

Grading: P0 breakage/AI-call leak; P1 functional bug; P2 significant degradation; P3 minor.
