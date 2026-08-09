# Test Plan — PR #262 (r298: TLD guides 174→180)

Env: local build served by `wrangler dev` at http://localhost:8787 (already running; dist built from PR branch). No production, no deploy, 0 AI calls.

Zero-AI guard: `GET /api/usage` snapshot before & after; JSON must be identical. Never click AI CTA / example prompts.

## T1: /tld hub shows 180 TLDs and new ones in correct groups (UI, zh)
- Open http://localhost:8787/tld (zh). Filter bar shows shown/total; **total must be 180** (was 174).
- Group 商业与电商 must list `.gifts`; group 生活与行业 must list `.family .baby .mom .dad .dog`.
- Type "dog" in filter → `.dog` chip shown.
Fail if total ≠ 180 or any new TLD missing/in wrong group.

## T2: /tld/family and /tld/dog detail pages, zh + en, prices
- /tld/family (zh): title ".family 域名注册指南…", price 首年 ¥41 / 续费 ¥226.
- Toggle language to EN: English title ".family Domain Guide…" and same prices.
- /tld/dog: price ¥26 first / ¥374 renew, renders zh & en.
Fail if 404, missing sections, or price mismatch.

## T3: /prices table has 180 rows incl. new TLDs
- Open /prices, count rows = 180 (via DOM count read + visual check of new rows by filtering/searching if available; otherwise scroll to show family/dog rows).
- Rows for family (41/226) and dog (26/374) present.

## T4: worker routes sitemap.xml & /llms.txt (shell)
- `curl sitemap.xml`: exactly 180 `/tld/` locs; contains /tld/family, /tld/gifts etc.
- `curl /llms.txt`: contains lines for all 6 new slugs.
(Pre-verified in setup: 180 and 6 lines present — re-capture as evidence.)

## T5: zero-AI proof
- /api/usage before == after (`{"days":{},...}` unchanged).
