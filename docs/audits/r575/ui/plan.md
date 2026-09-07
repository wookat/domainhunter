# R575 production UI zero-AI plan

Access ready: public production responds 200; session Chrome CDP 29229 available; receiver file exists mode 600. Storage backup/restore owned by lead, not this driver.

Source: home-page.tsx:333,741–865 exact landing/chips; advanced-page.tsx:83–240 batch/paste/progress/export; monitors-page.tsx:197–340 three notification states; prices-page.tsx:54–100 filter/sort; shortlist-page.tsx:565–609,864–1025 list-first responsive order and monitoring switches.

Persistent request/response observer before first navigation; redact webhook UUID in logs and visually hide input value during saved/edit screenshots/recording. Abort accidental AI or >4 check requests as safety, report attempts even if blocked. Do not click AI, registrar outbound, or bulk registration.

A/B/C. Navigate /?q=chaxiang; expect 1 POST /api/search and no AI/check, result chip top within viewport after automatic scrolling. Record zh/en and 375 widths. Collect reason enum, require allowed values. Inspect all taken chips for expiry/monitor/recheck/no-price/no-register. Click chaxiang.com recheck once; require exactly /api/check?refresh=1 with domains singleton and refresh true. Star 3 chips. Distinct Results page not reachable from this exact path: report not verified rather than fabricate.

D. /advanced: paste provided 20 domains into #advanced-bulk, click batch button once. Compare paste card above combination. Sample progress every 150ms; require monotonic aria values ending 20 and completed text. Require endpoint /api/search. Export via UI/download, require five specified price columns and plain numeric nonempty price cells. Capture mid-progress and complete zh/en at 1280/375. Collect reason enum and taken row controls/expiry.

E. /prices: filter cn then com.cn; click first-year and TLD sort controls both directions; require exact match first where present; record missing com.cn as unmet expectation. Capture both languages/mobile and measure document widths.

F. /shortlist: 3 real starred domains, measure sort/cards/monitor/share or sync panel order at 375; require cards first, photograph light/dark and desktop. Create one share via 生成分享链接 to populate history (source shortlist-page.tsx:642–686). Measure its position after cards. Immediately revoke via 删除 then 确认删除 within 5 seconds (source:275–288); require DELETE 200 and public GET 410. Redact both token/revokeToken names before creation.

G/H/I. /monitors: capture unconfigured, configured, editing for zh/en ×375/1280. Require mobile interactive heights ≥44 and record desktop/badge dimensions. Enter http://example.com/hook, click save and test, require inline https error and record whether network blocked. Save receiver. Send test once, expect 200 delivered JSON and receiver event=test/source=domainhunter. Immediately click second test, require 429 Retry-After and localized seconds feedback. Inspect receiver with server GET, redact artifacts. One dark notification screenshot.

J. /shortlist: enable google.com or chaxiang.com monitor using row switch. /monitors must show domain and configured webhook. Clear webhook via two UI clicks; /shortlist expanded monitoring panel input empty. Return /monitors, remove all entries added with two UI clicks.

K. Capture UI cleared state. Run requested Mozilla-UA GET /api/monitor/list and report actual status; if POST-only also verify POST list with empty domains via unauthenticated API (no cookies). Require entries=[] for actual supported endpoint. No shares created unless needed; revoke any created. Sum entire-run API logs: check ≤4, AI=0. Lead handles usage comparison and byte-for-byte storage restoration.
