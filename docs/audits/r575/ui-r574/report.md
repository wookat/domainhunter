# R574 production UI follow-up — 3bc9c841

Completed the four-item runtime procedure against **https://hunt.zalize.com** in the session Chrome. This is a separate follow-up to the earlier 04ae07fe audit.

- **Version reference:** 3bc9c841, supplied by lead (after R573 b58acfbb and merged R574 #536 plus home integration 5d9bfda). No independent Cloudflare control-plane version lookup was performed.
- **UTC window:** 2026-09-07 **13:01:47.908Z–13:06:11.447Z** for navigation through final UI cleanup; instrumentation/Chrome released at **13:07:02.790Z**.
- Fresh navigations had cache disabled. Observed loaded assets include `index-FGNuJFLR.js`, `domain-row-DNLN-WBF.js`, `monitors-page-DNQoBewd.js`, and `index-Enl61yQp.css`. Actual new behavior was verified, not inferred solely from deployment claims.
- **Safety totals:** POST `/api/ai-search` **0**, `/api/check` **0**, `/api/search` **4**, `/api/monitor/webhook-test` **0**, `/api/share` **0**, `/api/monitor/add` **0**. Blocked attempts **0**. No recheck, Send test, AI, registrar, favorite, share, or monitor-add control was clicked.
- **Storage:** lead owns restoration and byte comparison. Audit-only Results snapshot was removed; webhook cleared. Chrome is released. No raw webhook.site UUID was read or saved by this follow-up.

## Exceptions and coverage limits

1. **Item② FAIL for mobile visibility:** pending-expiry chips are present with correct text/title but have **0px width at375**, so users cannot see them or hover their tooltip. Reproduced in both advanced and replayed Results, zh/en. This is the known compact-row shrink limitation described in R574 research, not evidence of a newly introduced regression. Desktop behavior passes.
2. **Item③ observed terminal-state assertion passes, but intermediate19 was not exercised:** genuine responses coalesced from0 directly to20 despite network throttling. Neither run exposed separate18/19 frames or a controlled gap between the final row and stream closure. The four-search cap was respected; no mock or extra request was used to manufacture that scenario.
3. **Retryable-unknown button branch not verified:** no unknown rows appeared in home or either20-domain run. `.ai` fixtures were available this time. Taken rows cover all three requested surfaces.

## ① Recheck icon/text responsiveness — PASS (taken rows)

**URLs:** `https://hunt.zalize.com/?q=chaxiang&lang=zh&cb=r574-followup` (header switch rewrote lang to en); `https://hunt.zalize.com/advanced?lang=zh&cb=r574-followup`; Results `https://hunt.zalize.com/?lang=zh&cb=r574-replayed` (also en).

**Steps:** navigate exact landing once; measure without clicking recheck; toggle header language and viewport. On advanced paste four domains and click “核验4个域名”. On Results restore an explicitly authorized **replayed snapshot of real rows**, then click “全部4/All4”. No AI request produced these Results rows.

All12 surface/language/viewport combinations passed:

| Surface | zh1280 rect | en1280 rect | zh/en375 rect |
|---|---:|---:|---:|
| Home chip | 79×28 | 85.453125×28 | 44×44 |
| Advanced taken DomainRow | 78×32 | 84.453125×32 | 30×44 |
| Replayed Results taken DomainRow | 78×32 | 84.453125×32 | 30×44 |

- All buttons have an SVG icon, nonempty localized domain-specific `aria-label`, and title.
- `<span class="hidden sm:inline">` exists everywhere tested: computed **block at1280**, **none at375**; text “重新核验” / **“Re-check”**.
- Pixels show icon+text desktop and icon-only mobile. Native375 document width was375.
- Home measurements UTC13:01:50.196–13:01:51.765; advanced13:02:22.430–13:02:23.643; Results13:05:13.020–13:05:14.370.
- Unknown branch: **not verified**, none present; no statuses were fabricated.

**Evidence:** `/home/ubuntu/r575/ui-r574/assertion-matrix.json`; `1-home-{zh,en}-{1280,375}.json`, `12-advanced-{zh,en}-{1280,375}.json`, `12-results-replayed-{zh,en}-{1280,375}.json` under that same root. Each contains exact rect coordinates, label display/text/class, aria/title, URL and UTC.

| Home desktop — zh1280 | Home mobile — en375 |
|---|---|
| ![Home desktop labels](https://app.devin.ai/attachments/ad24d58c-8f63-4438-8823-0e1ed214d7ca/1-home-zh-1280.png) | ![Home mobile icons](https://app.devin.ai/attachments/19a80c37-2225-458c-84e9-e556c7d72fb7/1-home-en-375.png) |

## ② Missing-expiry chip — desktop PASS, mobile visibility FAIL

**URL/steps:** advanced URL above; paste exactly `chaxiang.com nic.cn google.de google.com`, submit once. Reuse this actual response in Results through `dh:lastSearch:v1` and select All. Capture both languages/widths, plus dark375.

Actual response:
- `nic.cn` and `google.de`: **taken, method=dns, cached=true, no expiresAt**.
- `google.com`: taken, method=rdap, `expiresAt=2028-09-14T04:00:00.000Z`.
- `chaxiang.com`: taken, method=rdap, `expiresAt=2027-05-13T18:26:54.000Z`.

Both DNS-only rows have `[data-expiry="unknown"]`, localized text **到期日待查 / expiry pending**, and nonempty localized title describing missing registry expiry and recheck. Neither dated row has this chip.

| Viewport | zh chip rect | en chip rect | Visual result |
|---|---:|---:|---|
|1280|50×15|70.421875×15|Visible in advanced and Results; PASS|
|375|0×15|0×15|Invisible in advanced and Results; FAIL visible-chip expectation|

The mobile chip has computed display:block but is shrunk to0 width; DOM text alone was **not** treated as visibility proof. Existing actual-date text is also hidden by the same layout.

**P3 candidate / known limitation:** responsive taken-row layout still hides expiry information below sm. If acceptance only requires desktop visibility plus mobile DOM presence, the implementation condition is met; a mobile-visible-chip claim is not.

**Evidence:** `/home/ubuntu/r575/ui-r574/2-real-four-response.json`, `/home/ubuntu/r575/ui-r574/12-results-replayed-snapshot.json`, and item① matrices. Snapshot rows preserve real status/method/expiry; only Results metadata and description identify the replay.

| Advanced pending chip — zh1280 | Advanced invisible expiry — en375 |
|---|---|
| ![Advanced desktop pending](https://app.devin.ai/attachments/5efcafb2-fe26-4b9b-9d83-e238baefa5ef/12-advanced-zh-1280.png) | ![Advanced mobile no visible expiry](https://app.devin.ai/attachments/a0f7fed5-1169-4570-8d29-6e27d54443d4/12-advanced-en-375.png) |

| Replayed real rows — en1280 | Replayed real rows — zh375 |
|---|---|
| ![Results desktop pending](https://app.devin.ai/attachments/98c4efe4-2578-4be8-8caa-a73f55757a28/12-results-replayed-en-1280.png) | ![Results mobile missing visible chip](https://app.devin.ai/attachments/e3dae6b8-22a6-4d22-ab3e-695e05155c6c/12-results-replayed-zh-375.png) |

## ③ Completion frame — PASS observed forbidden-frame check; streaming boundary incomplete

**URL:** `https://hunt.zalize.com/advanced?lang=zh&cb=r574-followup`, header switched to en without reloading.

**Steps:** paste the exact earlier20-domain fixture (recorded in network request body), install MutationObserver before clicking the batch button, observe `[role=status]` and progressbar `aria-valuenow`, also sample via requestAnimationFrame. Run twice: initially zh and initially en. Genuine network throttled to180B/s with120/500ms latency; no response mocking. Second in-flight run temporarily switched to zh to capture both widths/languages in the running state, then back to en before completion.

| Run | Start UTC | First20 UTC | Observed terminal transition |
|---|---|---|---|
|zh|13:02:51.130Z|13:03:07.785Z|核验中0/20 → 已完成20/20|
|en|13:04:16.713Z|13:04:33.349Z|Checking0/20 → Done20/20|

- Both first-now20 states were **completed, spinner=false**, with monotonic0→20.
- Matches for `/核验中 20\/20|Checking 20\/20/`: **0**, including captured mutation text.
- Full changed-frame sequence and mutation records with UTC and performance timestamps are saved. Identical animation frames are deduplicated. The initial prior-run completed precondition remains in raw files and is excluded from each run's monotonic calculation.
- Running0/20 and completed20/20 screenshots exist for zh/en×1280/375; one dark375 completion screenshot.
- **Limit:** responses coalesced to one20-row UI update. This does not prove behavior under separately delivered19→20 chunks or a delayed stream close. No extra search was authorized within the budget.

**Evidence:** `/home/ubuntu/r575/ui-r574/3-progress-zh-frames.json`, `/home/ubuntu/r575/ui-r574/3-progress-en-frames.json`, `/home/ubuntu/r575/ui-r574/3-real-twenty-response.json`, `/home/ubuntu/r575/ui-r574/assertion-matrix.json`.

| Running — en375 | Completed — en375 |
|---|---|
| ![Progress running](https://app.devin.ai/attachments/32db57b2-5155-46cc-9eb7-36dae48647ab/3-progress-en-375-running.png) | ![Progress completed](https://app.devin.ai/attachments/d195f58b-c418-43f1-8082-390d2d5c8668/3-progress-en-375-completed.png) |

## ④ Notification control heights — PASS

**URL:** `https://hunt.zalize.com/monitors?lang=zh&cb=r574-followup` (also en via header).

**Steps:** save `https://example.invalid/r575` via UI to enter configured read-only mode. Measure three buttons; click Edit and measure four controls; Cancel. Repeat zh/en×1280/375. Capture one dark375 configured/editing pair. **Never click Send test.** Finish with Remove/Confirm then inspect empty input.

| Language / viewport | Read-only test / edit / clear | Editing input / save / test / cancel |
|---|---|---|
|zh1280|40 /40 /40|40 /40 /40 /40|
|en1280|40 /40 /40|40 /40 /40 /40|
|zh375|44 /44 /44|44 /44 /44 /44|
|en375|44 /44 /44|44 /44 /44 /44|

Computed CSS height equals rect height for every control. Read-only English clear is labeled **Remove**. All8 state/language/viewport matrices pass; dark mobile also44.

**Evidence:** `/home/ubuntu/r575/ui-r574/4-{configured,editing}-{zh,en}-{1280,375}.json`; consolidated `/home/ubuntu/r575/ui-r574/assertion-matrix.json`. Exact per-state UTC is recorded in each file.

| Configured — zh1280 | Editing — en375 |
|---|---|
| ![Notification read-only](https://app.devin.ai/attachments/c1af7396-a425-41f3-a4a2-73ec4d5baa5e/4-configured-zh-1280.png) | ![Notification editing](https://app.devin.ai/attachments/eac22df2-d225-4ec5-9d85-48feb64880f6/4-editing-en-375.png) |

## Cleanup and exact request accounting

- UI notification badge **未配置**, input empty; no webhook storage key; shortlist `[]`; Results snapshot absent.
- Supported Mozilla-UA `POST https://hunt.zalize.com/api/monitor/list` with the four fixture domains returned **`{"entries":[],"monitored":2,"limit":500}`**. Global2 is pre-existing, not an audit-created monitor.
- Search requests, all `POST https://hunt.zalize.com/api/search`:
  1. Exact home `chaxiang` landing.
  2. Four-domain advanced list.
  3. Twenty-domain zh run.
  4. Twenty-domain initially-en run.
- **No `/api/check` URLs to list: count0. AI0. No blocked attempts.** No shares or monitors created. No webhook delivery attempted.
- No independent usage before/after snapshot was collected for this follow-up; zero-AI evidence is the persistent request listener. Broader usage reconciliation and storage restore remain lead-owned.
- Temporary route guards, cache override, mobile metrics, and driver were removed/stopped. Browser left on cleared monitors page in zh/light.

Evidence: `/home/ubuntu/r575/ui-r574/summary.json`, `network.json`, `responses.json`, `cleanup.json`, `cleanup-monitor-list.json`, `cleanup-monitor-headers.txt`; screenshot `/home/ubuntu/r575/ui-r574/shots/cleanup-cleared.png`.

## Artifacts and setup handoff

- Full continuous annotated recording: `/home/ubuntu/r575/ui-r574/r574-full-annotated.mp4`.
- Condensed annotated recording: `/home/ubuntu/screencasts/r575-r574-followup/r575-r574-followup-edited.mp4`.
- Screenshot directory: `/home/ubuntu/r575/ui-r574/shots/` (**35 images**).
- Structured assertion matrix: `/home/ubuntu/r575/ui-r574/assertion-matrix.json`.
- This report: `/home/ubuntu/r575/ui-r574/report.md`.
- Artifact manifest: `/home/ubuntu/r575/ui-r574/artifact-index.json`.
- SKILL proposal: `/home/ubuntu/r575/ui-r574/skill-suggestion/SKILL.md` (update existing testing-domainhunter; exec_dir `/home/ubuntu/repos/domainhunter`).
- Blueprint lookup found **none**. No dependencies, app servers or accounts were installed/configured. Suggested reference-only setup note: use existing Chrome/CDP29229, Python Playwright, wmctrl maximize, and Mozilla-UA curl for production audits; temporary driver29376 is not a permanent service. Existing ffmpeg was used to assemble the full recording.
- Suggested PR comment: **none**; this was a production audit following an already-merged PR, not testing an open PR.
- Still needed from user: **none**. Lead should restore/byte-verify storage and retain the mobile-visibility and streaming-boundary qualifications.
