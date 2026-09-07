# R527 browser production audit plan

Access confirmed: public production, existing Chrome CDP at :29229, Python Playwright installed.
Storage backup completed before interaction, via permitted initial /why navigation.
No login, secrets, product changes, AI requests, registrar visits, usage requests or Lighthouse.
Open questions resolved: all flow controls traced below; no new-vs-old assumptions beyond R511/R519–522 expectations.

## Safe stateful flow
1. Open home zh at 1280; Tab through header and main controls without activation, capture focus ring. Click EN and theme buttons; require translated hero and dark class. Count footer links: 408 tld, 410 guide, 444 vs.
2. Click 精确核验; fill `zalize-r527-test.com`; allow automatic /api/search and click exact check only if needed. Require result statuses, never /api/ai-search. Click result star, then shortlist nav: require selected domain.
3. On shortlist click 生成分享链接, open returned /s/:id link: require HTTP 200 and actual domain snapshot. Return to shortlist and click 删除 then 确认删除 within 3s. Reload share: require 410 plus noindex and revoked UI. Unknown /s/doesnotexist-r527 must be 404/noindex.
4. Expand monitoring changes panel; enter invalid `http://invalid.example` webhook and save: require invalid HTTPS feedback, no real monitor creation. /monitors must render zh/en. Remove created shortlist item: require empty state (baseline empty).
5. /advanced: paste 6 domains across com/cn/io including google.com; click bulk action; require 6 result rows and google.com taken. CSV control exists. At 375, require document scrollWidth 375 and results wrapper internally scrollable.

## Route/content matrix
6. Visit /, /advanced, /prices, /tld, /guide, /vs, /why, /mcp, /shortlist, /monitors plus tld com/cn/at/de, guide saas plus 3 sitemap slugs, vs com-vs-cn/de-vs-com/at-vs-de/io-vs-ai. Every route zh/en desktop; each language capture light/dark and 375 light/dark for key routes. No duplicate reload loops.
7. For each hub require 408/410/444 cards respectively; type `.cn`, `saas`, `com vs cn`; require narrowed results including expected target (vs exactly 1).
8. Each sampled content page: click all 3 FAQ summaries; require 3 open. Click link in third answer; after 1s require heading top 60–120px. Group chip counts <=30 tld/guide, <=24 vs and same-group destinations. Every vs price table must have 4 col headers +3 row headers. At 375 require internal table overflow with document width 375.
9. Click content View all links for /tld/com, /tld/at, /guide/saas, /vs/com-vs-cn (zh/en): require matching #hub-g-* hash and target top 60–120px after >=1s; /tld/at must use more.
10. /prices filter xyz at 375: renewal badge must be a single non-stacked box (width > height), document width 375. /why and /mcp zh/en desktop/375/light/dark render. /nonexistent-r527: HTTP 404 branded shell.
11. Per visited page capture console warning/error, pageerror, requestfailed; expected intentional 404/410 resource messages separated, third-party failures separate; target 0 unexpected errors. AI request count must equal 0.
12. Cleanup share and shortlist; restore both storage objects exactly and redump; key names and string values must equal backup with empty diff.

## Source anchors
- home-page.tsx:249–332, 540–650: tab selection, automatic non-AI exact search and textarea action.
- advanced-page.tsx:40–89, 115–170: bulk textarea, /api/search, CSV.
- shortlist-page.tsx:230–325, 523–591: two-click share delete, creation, monitor validation.
- lib/monitor.ts:55–100: HTTPS validation before storage/network; monitor toggle is server-side so not used.
- tld-page.tsx:90–138; guide-page.tsx:155–168,210–230; compare-page.tsx:90–101: FAQ/chips.
- content/group-chips.ts:1–77: same-group rules, fallback more, caps, view-all hashes.
- SKILL.md R519–R522: price headers col×4,row×3; 60–120px anchor bounds; desktop emulation and screenshots.

## Runtime clarification
- /advanced renders responsive result rows/cards, not an HTML table. Check six statuses and document width 375; table-specific internal scrolling is not applicable.
- /guide/cn-realname is an additional compliance sample: four explicit FAQs with no anchors (guide-faq.ts:23 preserves loc.faq). Record this exception; use /guide/saas, /guide/ecommerce, /guide/coffee and /guide/pets for the required four industry-template FAQ/anchor tests.
- Theme is `html.light` for light and absence for dark (lib/theme.ts:19), not `html.dark`. Initial desktop matrix captured both modes but filenames were inverted; corrected from screenshot pixels without extra production pageviews.
