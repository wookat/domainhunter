# ROUND-575 — production UI zero-AI audit

Completed the requested UI procedure in the maximized session Chrome using persistent CDP request/response observation and one continuous annotated recording. Core runtime flows worked, but the requested `.com.cn` price row and GET monitor-list expectation did not; coverage qualifications are listed explicitly below.

- Production: **https://hunt.zalize.com**. Worker version **04ae07fe** supplied by the audit owner; independently observed assets: `index-BCbqmQ_d.js`, `index-Enl61yQp.css`, `monitors-page-uL86bf_5.js` (same as R571).
- API observation window: 2026-09-07 **12:40:24–12:50:20 UTC**.
- Recording: `/home/ubuntu/screencasts/r575-ui/r575-ui-edited.mp4`.
- Screenshot directory: `/home/ubuntu/r575/ui/shots/`.
- Structured measurements and redacted network evidence: `/home/ubuntu/r575/ui/`.
- **POST /api/ai-search = 0; POST /api/check = 1; blocked attempts = 0.**
- No AI button/example/refine CTA, registrar outbound link, registration, or payment was clicked.
- Owner-provided receiver secret file was read, not copied into evidence. Full UUID scan found zero occurrences outside that protected file. Revoke tokens were masked before logging. Saved/editing webhook input text was privacy-obscured in the recording with CSS; configuration correctness was tested by equality in memory, without printing the value.

## Exceptions and coverage qualifications

1. **E — unmet expectation / existing coverage gap:** `com.cn` produces the empty state in both languages; it is not in the tracked 408 TLD price list. Its exact-match pinning and displayed price cannot be verified. This is consistent with the R570–R571 skill, not evidence of a new regression. If displaying it is a required acceptance criterion, treat as a **P2 candidate**.
2. **K — requested method unsupported:** literal Mozilla-UA `GET /api/monitor/list` returns **404**, not `entries:[]`. The supported **POST**, with `{"domains":["chaxiang.com"]}`, returned **200 `{"entries":[],"monitored":2,"limit":500}`**. The two remaining global monitors were baseline entries, not ours. This is a test-contract mismatch, not a demonstrated cleanup failure.
3. **D — known P3 transient:** primary unthrottled batch showed `核验中 20/20`, then `已完成 20/20` at the next sample, about **169 ms** later. Monotonic count and completion passed.
4. **C — responsive observation:** desktop advanced taken rows show expiry dates, but the compact 375px advanced rows do not visibly show those dates, despite their presence in the DOM/data. If expiry must remain visible on mobile, this is a **P3 candidate**; no claim is made that mobile expiry display passed. Screenshot `D-taken-375-zh.png` shows this. This was not a DNS-only case: all five taken domains had dates on desktop.
5. **Not verified:** a distinct restored AI Results page was not entered. The real home exact-check **quick panel** and real `/advanced` results were tested; no synthetic saved result or AI request was used. Reserved/other unknown-reason branches and DNS-only taken-without-expiry were not encountered.
6. Storage restoration is **owned by the lead**, per explicit instruction. I did not run the restore helper. Lead was notified when Chrome was released. Byte-level restored equality must be supplied by the lead; this report does not claim it.

## A — exact landing and auto-scroll — verified

**URLs:** `https://hunt.zalize.com/?q=chaxiang`; supplementary mobile landing `https://hunt.zalize.com/?q=chaxiang&lang=zh`, switched to `https://hunt.zalize.com/?q=chaxiang&lang=en`.

**Steps:** navigate directly with the listener already active; wait for real checks to settle; inspect chips; toggle language; inspect mobile layout. Each of the two landing navigations made exactly one `POST /api/search`.

- First landing API traffic: GET `/api/stats`, `/api/prices`, `/api/registrars`; exactly one POST `/api/search`; zero AI/check.
- Search body: `{"roots":["chaxiang"],"tlds":["com","cn","io","ai","app","dev","co","net","me"]}`.
- Desktop: `scrollY=796`, first recheck chip top **113.703px**, quick panel top **15.703px**, viewport height 900. Real result chips visible; 9 TLD results, 3 taken and 6 available.
- Native mobile final: `innerWidth=clientWidth=scrollWidth=375`; EN first chip top **178.438px**, `scrollY=1074`; chips visible.
- Early desktop-style 375 emulation had a 15px classic scrollbar (`innerWidth375/clientWidth360/scrollWidth360`), not overflow. Supplementary native CDP captures establish exact 375 equality. `Emulation.setScrollbarsHidden` was also applied in that supplementary pass. No application CSS width was changed.
- `chaxiang.ai` happened to be available this run; do not assume it always provides an unknown fixture.

**Evidence:** `A-landing.json`, `A-native-mobile-landing.json`, `A-true375.json`; screenshots `/home/ubuntu/r575/ui/shots/A-1280-{zh-light,en}.png`, `A-true375-{zh,en}.png`.

| Desktop zh — exact results | Desktop en — exact results |
|---|---|
| ![A desktop zh](https://app.devin.ai/attachments/b0d8332f-8f30-4474-90c9-5422cc1dd045/A-1280-zh-light.png) | ![A desktop en](https://app.devin.ai/attachments/739fcd60-c977-4457-9c7d-3fa882ff187b/A-1280-en.png) |
| **Native 375 zh** | **Native 375 en** |
| ![A mobile zh](https://app.devin.ai/attachments/7ae8abc6-7882-4bd4-b95a-d6130482bd1a/A-true375-zh.png) | ![A mobile en](https://app.devin.ai/attachments/b2358c00-2f3b-411d-976f-a56d2acd3c4d/A-true375-en.png) |

## B — unknown enum — verified for encountered rows

**URLs:** same home URL as A; `https://hunt.zalize.com/advanced?lang=zh` and `?lang=en`.

**Steps:** collect `[data-unknown-reason]` after landing and after the primary real bulk batch.

- Home distinct set: **empty**, because no unknown rows occurred.
- Advanced distinct set: **`{"rate-limited"}`**, on `r575-zz-probe-a8.ai` and `r575-zz-probe-b4.info`.
- Outside allowed enum: **none**. Raw `http-429` was not exposed in the attribute.
- Other enum branches: **not verified**, not inferred to work.

**Evidence:** `B-home.json`, `B-advanced.json`, `C-advanced-rows.json`; screenshot `/home/ubuntu/r575/ui/shots/D-taken-375-zh.png` (unknown rows below the five taken rows).

## C — taken-row CTA consistency and one recheck — verified on home/quick and desktop advanced

**URLs:** `https://hunt.zalize.com/?q=chaxiang`; `https://hunt.zalize.com/advanced?lang=zh` and `?lang=en`.

**Steps:** inspect each real taken row, its controls/links and visible screenshot; click only `chaxiang.com`'s recheck once; star `.com/.cn/.net` for later shortlist tests.

| Surface | Taken domain and expiry | Monitor / recheck | Price / registration |
|---|---|---|---|
| Home exact quick panel | chaxiang.com — 2027-05-13 | Both; recheck icon has full aria-label | Neither present |
| Home exact quick panel | chaxiang.cn — 2026-12-11 | Both | Neither present |
| Home exact quick panel | chaxiang.net — 2027-09-04 | Both | Neither present |
| Advanced desktop | google.com — 2028-09-14 | Both | Neither present |
| Advanced desktop | baidu.cn — 2029-03-17 | Both | Neither present |
| Advanced desktop | example.org — 2027-08-30 | Both | Neither present |
| Advanced desktop | github.com — 2028-10-09 | Both | Neither present |
| Advanced desktop | wikipedia.org — 2027-01-13 | Both | Neither present |

**The only `/api/check` request in the entire run:**

```text
2026-09-07 12:41:43.785 UTC
POST https://hunt.zalize.com/api/check?refresh=1
{"domains":["chaxiang.com"],"refresh":true}
200, application/x-ndjson
```

Exactly one request resulted, with no `/api/search` accompanying that click. Remaining check budget: 3. Separate AI Results screen not tested; mobile advanced expiry visibility qualification is above.

**Evidence:** `C-home-taken.json`, `C-recheck.json`, `C-advanced-rows.json`, `responses.json`; screenshots `/home/ubuntu/r575/ui/shots/C-recheck-zh.png`, `D-taken-1280-{zh,en}.png`, `D-taken-375-zh.png`.

## D — bulk order, streaming progress, CSV and responsive states — verified, with known transient

**URLs:** `https://hunt.zalize.com/advanced?lang=zh`, `https://hunt.zalize.com/advanced?lang=en`.

**Steps:** paste the exact requested 20 domains in `#advanced-bulk`, click “核验 20 个域名” once, sample progress approximately every 150ms, export through the UI using `expect_download`, toggle language and viewport for completed results.

- Home entry navigation label is **“批量核验” / “Bulk check”**. On `/advanced` itself the header shows **“返回” / “Back”**, not the entry label.
- Paste card top **165px**, generator top **552px**: correct order.
- Primary batch: exactly one **POST `/api/search`**, no `/api/check` or AI.
- Progress distinct values: **0,4,5,6,9,10,12,14,15,16,17,18,19,20**; non-decreasing; final **已完成 20/20**. Full timestamped samples saved. Brief running-20 state noted above.
- Completed results: **13 available, 5 taken, 2 unknown**. Five taken rows have desktop expiry chips; DNS-only taken-without-expiry branch not encountered.
- Download: `/home/ubuntu/r575/ui/advanced.csv`, **20 data rows**.
- Header includes `price_first_year_cny`, `price_renew_cny`, `price_first_year_usd`, `price_renew_usd`, `price_source`.
- Legacy **`first_year_price` is still present**.
- **48** nonempty numeric `price_*` cells, all match `^\d+(\.\d+)?$`; zero currency symbols/approximation markers in those cells. `price_source` excluded from numeric validation.
- Supplementary real batch, same 20 domains, used another `/api/search` with temporary **200 bytes/s CDP download throttling** to capture running states in zh/en ×375/1280. Those four images show running **0/20**, not intermediate counts. The original unthrottled zh desktop image shows **4/20**. Throttling was removed; supplemental final state **Done 20/20**. No primary timing claim uses the throttled pass.

**Evidence:** `D-order.json`, `D-network.json`, `D-progress.json`, `D-csv-validation.json`, `D-responsive-progress.json`; screenshots `/home/ubuntu/r575/ui/shots/D-progress-1280-zh.png`, `D-completed-{1280,375}-{zh,en}.png`, `D-progress-{1280,375}-{zh,en}-slow-network.png`.

| Primary intermediate progress zh | Completed batch en |
|---|---|
| ![D primary progress](https://app.devin.ai/attachments/b97a31ff-05b1-4590-9a01-fd727b539137/D-progress-1280-zh.png) | ![D complete en](https://app.devin.ai/attachments/20fb6886-2036-46f1-a149-ce6634008838/D-completed-1280-en.png) |

## E — price filtering and exact pin — mixed result

**URLs:** `https://hunt.zalize.com/prices?lang=zh`, `https://hunt.zalize.com/prices?lang=en`. Filter text is UI state, not a query parameter.

**Steps:** type `cn`, click TLD and first-year sort headings twice each; repeat for `com.cn` and each language; measure mobile widths. Additionally use `com` to provide several matching rows.

- **Verified:** `.cn` is the first/only matching row under each tested sort. Desktop shows **≈$5 ¥33 first year; ≈$5 ¥38 renewal**. Mobile hides CNY and keeps **≈$5 / ≈$5**.
- **Inferred from cn alone:** pin priority, because one row cannot distinguish a broken comparator.
- **Verified with adversarial multi-match:** `.com` stays first before `.company/.community/.computer` when name and first-year sort directions reverse.
- **Not verified / unmet acceptance:** `.com.cn` row does not exist; empty result in zh/en, therefore no sort direction can pin it and no price can be recorded.
- Native mobile document/client/inner widths **375** in both languages and filters.

**Evidence:** `E-prices.json`, `E-multi-match.json`, `E-true375.json`; screenshots `/home/ubuntu/r575/ui/shots/E-{1280,375}-{zh,en}-{cn,com.cn}.png`, `E-true375-{zh,en}-{cn,com.cn}.png`, `E-com-multi-match.png`.

| `.cn` static approximate row — zh | `com.cn` empty state — en |
|---|---|
| ![E cn](https://app.devin.ai/attachments/d4feaea1-3ad9-46d4-8b25-1ea5e6cae772/E-true375-zh-cn.png) | ![E com.cn empty](https://app.devin.ai/attachments/91fa64f6-af3a-4240-b91c-f498916e20b2/E-true375-en-com.cn.png) |

## F — shortlist mobile order, themes, share history — verified

**URL:** `https://hunt.zalize.com/shortlist?lang=zh`.

**Steps:** open the shortlist containing the three actually starred taken domains, inspect light/dark at 375 and desktop 1280. Create one real share to expose the history panel, measure DOM order, then immediately revoke through two UI delete clicks.

- Initial mobile viewport-relative tops: sort **273**; cards **325 / 516.5 / 708**; monitoring **912.5**; sync **973.5**. DOM order agrees with visual order.
- With share created and page scrolled: sort index **43**, cards **211/240/269**, monitoring **300**, share panel **306**. Document-relative tops: sort **375**; cards **427/618.5/810**; monitoring **1014.5**; share **1075.5**. Cards precede both panels.
- Light/dark and desktop reference captured. Native375 light/dark recaptures also available.
- Share URL: `https://hunt.zalize.com/s/EZFiuxnOaK`. Created via UI, DELETE returned **200**, subsequent public GET `/api/share/EZFiuxnOaK` returned **410**. No live test shares remain.

**Evidence:** `F-375-order.json`, `F-share-order.json`, `F-share-revoked-headers.txt`, `F-share-revoked.json`; screenshots `/home/ubuntu/r575/ui/shots/F-375-{light,dark,share-light,share-dark}.png`, `F-1280-{light,dark,share-dark}.png`, `F-true375-{light,dark}.png`.

| Mobile share-history order — light | Same layout — dark |
|---|---|
| ![F light](https://app.devin.ai/attachments/4db36b9f-e121-4cf8-b2b3-032becca04a2/F-375-share-light.png) | ![F dark](https://app.devin.ai/attachments/47a6d4f3-114e-4479-b8c6-bfdf86e76e13/F-375-share-dark.png) |

## G — notification three-state size matrix — verified

**URLs:** `https://hunt.zalize.com/monitors?lang=zh`, `https://hunt.zalize.com/monitors?lang=en`.

**Steps:** inspect unconfigured form; save the real HTTPS receiver; inspect masked read-only state; click Edit, verify the prefilled value matches in memory, inspect controls, then Cancel. Execute each state in both languages at 1280 and 375; also capture dark configured example.

All **12 required combinations** were measured; native375 six-state recaptures exclude desktop scrollbar effects. Literal English badge is **“Not configured”**, not “Not set”; configured is **“Configured”**. Chinese badges are **未配置 / 已配置**.

| State | Native375 heights | 1280 heights |
|---|---|---|
| Unconfigured | input/save/test **44** | input/save/test **40** |
| Configured | test/edit/clear **44** | test/edit/clear **36** |
| Editing | input/save/test/cancel **44** | input/save/test/cancel **40** |
| Noninteractive state badge | **20.5** | **20.5** |

Native375 input width **309px**; unconfigured desktop input zh **484**, en **472.328**; editing desktop input zh **422**, en **392.406**. Full width/height for every existing control and badge is in **`G-size-table.json`**. Every mobile interactive box met ≥44px. Read-only display was masked by the app; input masking in screenshots is audit privacy protection, not a product claim.

**Evidence:** `/home/ubuntu/r575/ui/G-size-table.json`; individual `G-{1280,375,true375}-{zh,en}-{unconfigured,configured,editing}.json`; matching screenshot names under `/home/ubuntu/r575/ui/shots/`; dark example `G-true375-en-configured-dark.png`.

| Native375 zh | Native375 en |
|---|---|
| **Unconfigured** ![G zh unconfigured](https://app.devin.ai/attachments/305bd6df-0ccf-46ab-a09e-a2cd6614f392/G-true375-zh-unconfigured.png) | **Unconfigured** ![G en unconfigured](https://app.devin.ai/attachments/015d8976-d7c9-4f2f-8fbd-cfef60c22a74/G-true375-en-unconfigured.png) |
| **Configured** ![G zh configured](https://app.devin.ai/attachments/04a4b084-f1d8-4e27-83b3-1c90129e6e54/G-true375-zh-configured.png) | **Configured** ![G en configured](https://app.devin.ai/attachments/82bfdcd6-d197-4d07-86af-d353cda5f199/G-true375-en-configured.png) |
| **Editing** ![G zh editing](https://app.devin.ai/attachments/0b6f411c-30b9-4e4d-a12c-90c0a9b8e4ef/G-true375-zh-editing.png) | **Editing** ![G en editing](https://app.devin.ai/attachments/37b96c52-950c-4e59-b0b7-be995dc98cc2/G-true375-en-editing.png) |

## H — HTTPS validation — verified client-side

**URLs:** monitors URLs above.

**Steps:** fill `http://example.com/hook`, click Save, inspect alert and Send test disabled state; switch language.

- Alerts: **地址必须以 https:// 开头** / **URL must start with https://**.
- Requests generated: **0**. Send test disabled for this value, so a test click was not forced.
- Server `400 invalid_webhook`: **not verified in this UI case**, because validation blocked the network. This is not reported as an observed server response.

**Evidence:** `H-validation.json`; screenshots `/home/ubuntu/r575/ui/shots/H-invalid-375-{zh,en}.png`.

## I — real webhook delivery and rate limit — verified

**URLs:** monitors URLs above; POST `https://hunt.zalize.com/api/monitor/webhook-test`; receiver API `https://webhook.site/token/<masked-receiver-id>/requests` (exact private ID intentionally omitted).

**Steps:** save receiver, click Send test once, capture feedback, immediately click again, capture response/header and switch language during countdown; read receiver requests via its API.

- First: **200 `{"ok":true,"delivered":true,"status":200}`**.
- Success UI: **已发送，对方返回 HTTP 200——去你的群/接收端看一下测试消息（event: test）**.
- Receiver: **exactly one request**, body includes **`"event":"test"`**, **`"source":"domainhunter"`**. Sanitized body saved.
- Second: **429 `{"ok":false,"error":"rate_limited","retryAfter":29}`**, header **`Retry-After: 29`**.
- zh feedback: **发送测试太频繁，29 秒后可再试**.
- en feedback: **Too many test sends — try again in 29s**.
- Total webhook test clicks: **2**; total actual deliveries: **1**.

**Evidence:** `I-webhook-test.json`, `webhook_received.json`; screenshots `/home/ubuntu/r575/ui/shots/I-first-success-zh.png`, `I-second-rate-limited-{zh,en}.png`.

| First delivered test — zh | Immediate second rate-limited — en |
|---|---|
| ![I delivered](https://app.devin.ai/attachments/a596bfed-3896-4206-9af1-b0c081aab7cd/I-first-success-zh.png) | ![I rate limited](https://app.devin.ai/attachments/bf052d9c-ec8b-4f16-bf28-21d01342a238/I-second-rate-limited-en.png) |

## J — shortlist / monitors sync — verified

**URLs:** `https://hunt.zalize.com/shortlist?lang=zh`, `https://hunt.zalize.com/monitors?lang=zh`.

**Steps:** toggle the shortlisted `chaxiang.com` monitoring switch; expand Monitoring updates; verify stored receiver matches; navigate to monitors; clear webhook through two UI clicks; return to shortlist and inspect input; remove monitor via two UI clicks.

- `/monitors` showed `chaxiang.com`, one personal entry, configured receiver; global capacity changed **2→3/500**.
- Shortlist receiver input matched saved receiver in memory.
- Clearing on monitors made shortlist input **empty**. Panel showed 保存 and the generic “填入飞书/Slack/自建服务…” setup hint, not a stale configured value.
- Removing the monitor returned personal list empty and global capacity **2/500**.

**Evidence:** `J-sync-configured.json`, `J-sync-cleared.json`; screenshots `/home/ubuntu/r575/ui/shots/J-shortlist-monitor-enabled.png`, `J-shortlist-webhook-configured.png`, `J-monitors-added.png`, `J-monitors-cleared.png`, `J-shortlist-webhook-cleared.png`.

## K — cleanup, zero-AI counts, usage — verified with GET-method exception

**URL:** `https://hunt.zalize.com/api/monitor/list`.

- Literal requested command was executed with Mozilla UA: **GET returned 404**. Evidence: `K-monitor-list-get-headers.txt`, `K-monitor-list-get.txt`.
- Supported POST with our added domain returned **`{"entries":[],"monitored":2,"limit":500}`**, both immediately after cleanup and at the final check.
- UI: **未配置**, empty webhook input, no monitored domains. Local monitor list **`[]`**; share history **`[]`**.
- Created share list: **EZFiuxnOaK only; revoked, GET410**.
- Browser observer final counts: **AI0, check1, search4**, no blocked attempts. Search4 = desktop landing1 + original bulk1 + supplemental slowed bulk1 + mobile landing1. GET and monitor/share traffic recorded in `summary.json`.
- Check1 full URL/body is listed under C. No other `/api/check` call, including from shell tools.
- Own Mozilla-UA usage snapshots: `usage-before.json`, `usage-after.json`, `usage-diff.json`. **searches0→0, fast0→0, refine0→0, byTld{}→{}**. No AI-related counter change in the parsed diff. Pageview/bot changes include concurrent audit traffic and are not attributed entirely to this browser. Snapshot interval and time since share creation exceed 60s.
- The API did not expose/increment a share-write counter in these snapshots; real create/delete responses are the proof of that lifecycle. Do not infer “no share write” from the usage diff.
- Storage restoration and byte-level final equality: **not performed here**, explicitly delegated to the lead.
- Final driver stopped; no background UI listener remains.

**Evidence:** `K-final-counts.json`, `K-final-cleanup.json`, `K-monitor-list-final.json`, `summary.json`, `network.json`, `responses.json`; screenshot `/home/ubuntu/r575/ui/shots/K-final-cleared-desktop.png`.

| Final cleared notification and personal monitor state | Cleanup responses |
|---|---|
| ![K cleared](https://app.devin.ai/attachments/aee65053-6f02-4d06-af94-6ce346a89162/K-final-cleared-desktop.png) | POST monitor list **200, entries=[]**; revoked share GET **410**; literal GET monitor list **404**. |

## Setup notes and suggestions

- No dependency install, application build, local dev server, or account login was needed. Used existing Python Playwright, session Chrome CDP29229, `wmctrl`, Python stdlib and curl.
- Blueprint read result: **no repository blueprint exists**. Suggested knowledge-only addition: production zero-AI audits use existing session Chrome/CDP, maximize with `wmctrl`, and use Mozilla UA for curl; no local app service is required. The temporary audit driver (port29375) has been stopped and should not become a permanent blueprint service.
- Suggested update to existing testing-domainhunter skill: `/home/ubuntu/r575/ui/skill-suggestion/SKILL.md` (full proposed replacement with R575 instrumentation notes; not applied to checkout). Exec dir: `/home/ubuntu/repos/domainhunter`. Rationale: avoid recording receiver secrets, distinguish singleton filter checks from real pinning tests, and preserve mobile metrics during screenshots.
- Still needed from user: **none** for completed runtime work. Lead action: perform the already-planned byte-for-byte storage restoration, reconcile broader usage, and decide whether absent `.com.cn`/mobile expiry visibility are acceptance gaps.

## Artifact index

- Full continuous recording, with original-time annotations burned in (10m48s): `/home/ubuntu/screencasts/r575-ui/r575-ui-full-annotated.mp4`
- Condensed annotated recording (51s): `/home/ubuntu/screencasts/r575-ui/r575-ui-edited.mp4`
- Report: `/home/ubuntu/r575/ui/report.md`
- Screenshots: `/home/ubuntu/r575/ui/shots/` (86 images)
- CSV: `/home/ubuntu/r575/ui/advanced.csv`
- Main measurements: `/home/ubuntu/r575/ui/summary.json`, `G-size-table.json`, `D-progress.json`, `D-csv-validation.json`, `E-prices.json`, `F-share-order.json`, `I-webhook-test.json`, `webhook_received.json`, `network.json`, `responses.json`, `usage-diff.json`
- Complete file listing: `/home/ubuntu/r575/ui/artifact-index.json`
- **Never attach** `/home/ubuntu/r575/ui/webhook_site_token.json`; it is the owner-provided secret, not an audit artifact.
