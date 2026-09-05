# R502 — visible Chrome production audit

Completed the browser procedure against https://hunt.zalize.com using existing Chrome over CDP, at 1280×900 and 375×900, with light/dark themes and Chinese/English coverage. This was a live audit, not a code-change test. No repository files were changed.

## Exceptions and observations

- **FAIL against the requested presence assertion / P3 configuration observation — footer privacy notice absent.** On hydrated home `/?lang=zh`, `footer` contains no `Cloudflare Web Analytics` sentence; `script[data-cf-beacon]` count is **0**. Reproduce: open home, inspect footer/end of page. Evidence: `A-footer-end-no-analytics-1280.png`, `footer_privacy_final` in findings JSON. Source has a conditional `hasAnalytics` gate (`App.tsx:1067`); lack of configured analytics is an **inference**, not a verified deployment configuration. This is not established as a new regression or as tracking without notice.
- **P3 — share copy implies availability for a taken domain.** Before revocation, `/s/2v_F9ouT_X?lang=zh` displayed **“复制 3 个可注册”** and a register button for every row, including `zalize.com`. The bulk check in this same walkthrough returned `zalize.com` **已注册**, expiry **2027-07-06**. The share header does say **“状态以实时核验为准”**; it does not explicitly say “注册前请重新核验.” Verified mismatch is the copy label/assumption, not a claim that sharing rechecks availability. Reproduce with a share containing an already-taken domain, then inspect the copy count and register controls. The lead confirmed ShareItem has no status field and creation used no status field. No base comparison was performed; do not call this a new regression. Evidence: `H-share-light-1280.png`, `H-share-dark-375.png`, `B-advanced-all-three-statuses-1280.png`. The test share is now revoked.
- **Literal console-zero check: FAIL after excluding only the two intentional 404 messages.** One additional expected browser resource error occurred when the revoked share API returned **410**. All **JavaScript page errors: 0**. Normal successful pages had no captured console errors or warnings. If expected 410 resource noise is also excluded, unexpected console errors are **0**.
- Exact lookup returned `.ai` **未知**, not available: final grid was 9 domains, 8 available, 1 unknown. This is an exposed uncertainty state, not an unhandled error. No retry was attempted; definitive `.ai` registry availability remains unverified.

## Per-page/check results

Screenshot filenames below are relative to `/home/ubuntu/r502/screenshots/`. Measurements and request events are in `/home/ubuntu/r502/findings-browser.json`.

| Page/check | Result | Evidence / actual result |
|---|---|---|
| Home Chinese/English hero | PASS | Chinese h1 “用中文说出寓意，猎到真正可注册的.cn / .com 好域名”; English h1 “Name it in Chinese or English, hunt .cn / .com domains you can actually register”. `A-home-zh-light-1280.png`, `A-home-en-dark-1280.png`. Deterministic Chinese navigation used `?lang=zh`. |
| Home exact tab | PASS | Click 精确核验, fill `zalizetest123`, wait for automatic check: **exactly 1 POST /api/search**, roots plus nine TLDs; nine status chips render, 8 available/1 unknown. No AI submit or Enter pressed. `A-exact-status-grid-1280.png`. |
| Industry template | PASS | Clear exact input, switch to AI mode, click **茶叶品牌** industry template; textarea fills the full tea-brand brief. No AI submit. `A-template-filled-1280.png`; exact captured text in JSON. Example-prompt chips were not clicked. |
| Home R491 footer navigation | PASS | `/tld/` **408**, `/guide/` **410**, `/vs/` **444** links; **3** 浏览全部 links; /why, /mcp, /advanced, /prices destinations present with `?lang=zh`. Actual locator click on `/mcp?lang=zh` navigated there. |
| Home privacy sentence | FAIL (presence expectation) | Absent; no beacon tag. See P3 observation above. |
| `/advanced` bulk | PASS | Pasted `zalizeqa1.com`, `zalizeqa2.cn`, `zalize.com`; clicked 核验 3 个域名. **1 POST /api/search per run**, two available rows plus one taken row/expiry, CSV export control. Repeated once solely to capture all rows within viewport: **2 bulk POSTs total**. `B-advanced-all-three-statuses-1280.png`. CSV not downloaded. |
| `/prices` | PASS | **408** `main a[href^="/?tld="]`. Initial first suffix .bond; ascending suffix sort begins abogado/academy/accountants/actor/ae; descending zone/za/yoga/xyz/wtf. `.cn` filter gives **1** matching Hunt link. `C-prices-sort-asc-1280.png`, `C-prices-sort-desc-1280.png`, `C-prices-filter-cn-1280.png`. General static-reference explanation present; temporary-unavailable/stale warning absent. |
| `/tld` hub | PASS | **408** cards; creative anchor scrolls to section y=128.25, sticky nav bottom=124; `.cn` filter shows **1** card; back-to-top returns scrollY=0. `D-tld-anchor-1280.png`, `D-tld-filter-1280.png`. |
| `/guide` hub | PASS | **410** cards; food anchor section y=127.75/nav bottom=124; `.cn` filter shows **4** matching guides; back-to-top returns 0. `D-guide-filter-1280.png`. |
| `/vs` hub | PASS | **444** cards; accountants anchor section y=127.75/nav bottom=124; `.com vs .cn` filter shows **1** card; back-to-top returns 0. `D-vs-filter-1280.png`. |
| `/tld/cn` | PASS | H1, breadcrumb 首页 → TLD 指南 → .cn, **2 JSON-LD scripts**, related links, /why /mcp /advanced site links. Breadcrumb parent click navigates `/tld?lang=zh`. English h1 and content render. `E-tld-cn-zh-1280.png`, `E-tld-cn-en-1280.png`, `E-tld-cn-site-links-1280.png`. |
| `/guide/cn-realname` | PASS | R483 guide h1 “.cn 域名实名认证全流程：材料、时限与审核”; breadcrumb 首页 → 行业指南 → .cn 实名认证; **3 JSON-LD scripts**; related/site links. Parent click reaches `/guide?lang=zh`; English version renders. `E-guide-cn-realname-zh-1280.png`, `E-guide-cn-realname-en-1280.png`, `E-guide-cn-realname-site-links-1280.png`. |
| `/vs/com-vs-cn` | PASS | Comparison h1, breadcrumb 首页 → 后缀对比 → .com vs .cn; **3 JSON-LD scripts**; related/site links. Parent click reaches `/vs?lang=zh`; English version renders. `E-vs-com-vs-cn-zh-1280.png`, `E-vs-com-vs-cn-en-1280.png`, `E-vs-com-vs-cn-site-links-1280.png`. |
| Content “footer” semantics | PASS for requested destinations | All three pages have /why /mcp /advanced in bottom site-navigation areas, but **0 semantic `<footer>` elements**, as documented in skill. Not a missing-navigation defect. |
| `/why` | PASS | Chinese informational content renders. `F-why-1280.png`; English also checked in language test. |
| `/mcp` | PASS (page only) | Endpoint and three tool descriptions render. `F-mcp-1280.png`, `J-mcp-zh-dark-375.png`. Actual MCP tool calls belong to lead’s HTTP audit, not this browser result. |
| `/monitors` | PASS (empty state) | “还没有监控任何域名” visible; global occupancy **2/500** is not this user's local list. No monitor created or cancelled. `F-monitors-1280.png`. |
| `/shortlist` | PASS (empty state) | “还没有候选” and import/sync area visible. No shortlist/share mutation buttons used. `F-shortlist-1280.png`. |
| `/no-such-page-r502` | PASS | `page.goto` HTTP **404**, branded Chinese 404 page. `G-no-such-page-r502-1280.png`. |
| `/tld/zzznotatld` | PASS | `page.goto` HTTP **404**, branded Chinese 404 page. `G-tld-zzznotatld-1280.png`. |
| `/s/2v_F9ouT_X` active | PASS with P3 observation | Exactly three named items: zalizepetwan.com, zalizepetwan.cn, zalize.com. Register menu opens Porkbun/$11.08, Namecheap, Cloudflare, 阿里云, 腾讯云. Esc closes after exit animation. No registrar link clicked. Mobile menu x=175, width=167.17 (right=342.17<375). `H-share-menu-light-1280.png`, `H-share-menu-dark-375.png`. |
| Share revocation | PASS | Lead revoked through shell; browser navigation shell HTTP **200**, its GET `/api/share/2v_F9ouT_X` HTTP **410**, UI “链接已失效：分享者已删除这份清单”; no old domain rows displayed. `H-share-revoked-1280.png`. |
| R495 explicit-language toggle | PASS | `/why?lang=zh` click header English toggle → URL immediately `/why?lang=en`, English h1; F5 remains same URL/English. `I-why-toggle-en-1280.png`, `I-why-reload-en-1280.png`. |
| Bare-path language toggle | PASS | `/tld/cn` starts English from preference; toggle Chinese leaves URL bare; F5 remains Chinese with `domainhunter:lang=zh`. Bare URL not rewriting is intentional, not the old explicit-query revert bug. `I-bare-tld-reload-zh-1280.png`. |
| Keyboard | PASS | Shift-Tab back to logo then Tab: advanced → shortlist → GitHub → language → theme → close onboarding → AI mode → exact mode → bulk mode → textarea. Header/mode outlines visible; textarea uses focused enclosing border/caret. No Space/Enter pressed. `K-header-advanced-focus-1280.png`, `K-mode-exact-focus-1280.png`, `K-home-textarea-focus-1280.png`. |
| Zero AI / no outbound | PASS | Captured **0 `/api/ai-search`**, **0 `/api/click`**. Three non-AI search POSTs total (one exact, two bulk). No registrar navigation, domain registration, payment, AI example, refine or round action. |
| Storage cleanup | PASS | Created `domainhunter:lang`, `domainhunter:theme`, `domainhunter:shortlist` (`[]`); sessionStorage stayed empty. Cleared ALL local/session storage on production tab(s), ran supplied dump helper. `diff` empty and parsed equality **true**, both `{"local":{},"session":{}}`. |

### 375px matrix

CDP width=375, height=900, deviceScaleFactor=1; injected `::-webkit-scrollbar{display:none}` before measurements. Every row below measured **innerWidth=375 and documentElement.scrollWidth=375 in both light and dark** (24/24 measurements). These are viewport/first-screen inspections and document-width measurements, not exhaustive visual review of every off-screen paragraph.

| Route | Result / screenshot pair |
|---|---|
| `/` | PASS — `J-home-zh-light-375.png` / `J-home-zh-dark-375.png` |
| `/tld/cn` | PASS — `J-tld-cn-zh-light-375.png` / `J-tld-cn-zh-dark-375.png` |
| `/guide/cn-realname` | PASS — `J-guide-cn-realname-zh-light-375.png` / `J-guide-cn-realname-zh-dark-375.png` |
| `/vs/com-vs-cn` | PASS — `J-vs-com-vs-cn-zh-light-375.png` / `J-vs-com-vs-cn-zh-dark-375.png` |
| `/prices` | PASS — `J-prices-zh-light-375.png` / `J-prices-zh-dark-375.png` |
| `/why` | PASS — `J-why-zh-light-375.png` / `J-why-zh-dark-375.png` |
| `/mcp` | PASS — `J-mcp-zh-light-375.png` / `J-mcp-zh-dark-375.png` |
| `/advanced` | PASS — `J-advanced-zh-light-375.png` / `J-advanced-zh-dark-375.png` |
| `/monitors` | PASS — `J-monitors-zh-light-375.png` / `J-monitors-zh-dark-375.png` |
| `/shortlist` | PASS — `J-shortlist-zh-light-375.png` / `J-shortlist-zh-dark-375.png` |
| Active share | PASS — `H-share-light-375.png` / `H-share-dark-375.png` (captured before revocation) |
| `/tld` hub | PASS — `J-tld-zh-light-375.png` / `J-tld-zh-dark-375.png` |

### Console text

- `/no-such-page-r502`: `Failed to load resource: the server responded with a status of 404 ()` — intentional 404 noise.
- `/tld/zzznotatld`: same 404 message — intentional 404 noise.
- Revoked share: `Failed to load resource: the server responded with a status of 410 ()` — expected API outcome, retained rather than silently counted as zero.
- `pageerror`: none. Other captured console errors/warnings: none.

## Key visual evidence

| Home — light, 375px | Home — dark, 375px |
|---|---|
| ![Home light 375](https://app.devin.ai/attachments/968d119d-edaa-478e-8542-07f7bf75570e/J-home-zh-light-375.png) | ![Home dark 375](https://app.devin.ai/attachments/cec369de-086b-4743-acef-6774ad8f4d2f/J-home-zh-dark-375.png) |

| 🔴 Before revocation — active snapshot | 🟢 After revocation — rows removed |
|---|---|
| ![Share before revocation](https://app.devin.ai/attachments/5219f9b1-1f89-4de9-b7fb-b4241c3d4cd3/H-share-light-1280.png) | ![Share after revocation](https://app.devin.ai/attachments/78f6628c-9927-46ad-87cf-3a1ec68125eb/H-share-revoked-1280.png) |

## Incomplete coverage

- UNTESTED intentionally: AI generation/fallback/quota/refinement, example prompts, domain registration/payments, registrar outbound links.
- UNTESTED in this browser subtask: MCP JSON-RPC execution, HTTP metadata/language matrix/Lighthouse (owned by lead); global usage counter reconciliation.
- UNTESTED: monitor creation/webhook delivery, shortlist mutation/clear/sync, CSV file content/download, every one of the 1262 content links. Only specified representative content pages and one footer destination were navigated.
- No claim that the entire codebase is correct; no code changes were under test. No new P0/P1/P2 browser defect established.

## Artifacts and handoff

- Recording: `/home/ubuntu/screencasts/r502-browser/r502-browser-edited.mp4`
- Screenshots: `/home/ubuntu/r502/screenshots/` (specific absolute path = directory + filename above).
- Findings/request/console JSON: `/home/ubuntu/r502/findings-browser.json`
- Report: `/home/ubuntu/r502/browser-report.md`
- Storage: `/home/ubuntu/r502/storage-r502-pre.json`, `/home/ubuntu/r502/storage-r502-post.json` (equal).
- Suggested PR-comment content: **none** — this was a production audit, not an open-PR test.
- SKILL.md file suggestions: **none** — existing skill used; no repository modifications permitted.
- Blueprint: `read_environment_config` found **no blueprint**. No installs/build/dev services were needed. Suggested knowledge entry: production audits use existing Chrome CDP `http://localhost:29229`, existing Python Playwright, `wmctrl` maximize, device metrics 1280/375, CDP screenshots, and supplied storage dump helper. These were used successfully but are not covered by a blueprint.
- Still needed from user: **none**. Lead should reconcile the analytics-notice expectation with deployment configuration, decide whether the P3 share wording warrants follow-up, and merge its own HTTP/MCP findings into the full R502 report.
