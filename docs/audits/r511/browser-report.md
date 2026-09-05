# R511 — visible Chrome production audit

Completed the browser procedure against https://hunt.zalize.com using existing Chrome over CDP, at 1280×900 and 375×900, with light/dark themes and Chinese/English coverage. This was a live audit, not a code-change test. No repository files were changed by the browser agent.

## Exceptions and observations

- **Verified, pre-existing P3 per R509 handoff — dotless VS search still fails the intuitive matching expectation.** `/vs?lang=zh`: `.com vs .cn` returns **1** card; `com vs cn` returns **0**. This is not established as a new regression. Evidence: `D-vs-filter-1280.png`, `D-vs-dotless-1280.png`, `D_vs` in findings JSON.
- **Verified, pre-existing P3 per R509 handoff — mobile renewal trap badge still wraps.** At 375px, filter `/prices` by `.xyz`: $2.04 registration, $14.21 renewal, and the badge displays its characters vertically as **续 / 费 / ↑**. The badge is 23.27px wide × 64px high, while the price is 20px high. This is wrapping *inside the badge*, not the entire badge moving below the price. `.cn` has no trap badge because ¥38 renewal is less than 3×¥33 registration. Evidence: `C-prices-xyz-badge-light-375.png`, `C_xyz_mobile`.
- **Verified, pre-existing P3 per R509 handoff — revoked-share HTML metadata remains generic.** Both revoked share APIs return **410** and both browser pages show “链接已失效：分享者已删除这份清单”, but the `/s/:id` HTML shell still returns **HTTP 200** and the home title, “DomainHunter — 中文创业者的域名猎手 | 用中文说寓意，猎到真正可注册的 .cn / .com 好域名”. Confirmed using browser navigation response and shell HEAD/GET. Evidence: `revoked-shell-http.json`, revoked-share screenshots.
- **Verified absence / task expectation not verified, not a regression — no Dynadot on `/prices` or `/tld/cn`.** Actual `/prices` sortable headers are **后缀 / 注册/首年 / 续费/年**, followed by an unlabeled action column whose row button says **猎名**. There are zero Dynadot links or text matches. The lead confirmed this matches deployed code. Dynadot is correctly present in shortlist and share registrar menus, verified for `.cn`, `.com.cn`, and `.com`; home exact chips intentionally use a single Aliyun anchor, not a dropdown.
- **Verified intentional mobile behavior — CNY sub-prices are hidden below 640px.** At 1280px the `.cn` row visibly shows **≈$5 ¥33 / ≈$5 ¥38**. At 375px it shows **≈$5 / ≈$5**. The lead confirmed `hidden sm:inline` is intentional; this is not reported as a pricing regression.
- **Literal console-zero after excluding only 404: FAIL.** Four intentional 404 resource errors and two expected 410 resource errors were captured. JavaScript `pageerror` count is **0**, and unexpected console errors after excluding both categories are **0**.
- **Coverage limits:** Chinese home SSR and hydrated H1 were checked; English home H1 was checked hydrated only. Mobile coverage is a 24-case document-width/first-screen matrix, not every interaction in every language/theme/viewport combination. AI features and registrar destinations were deliberately not exercised.

## Per-page/check results

Screenshot filenames below are relative to `/home/ubuntu/r511/shots/`. Detailed state, H1 strings, hrefs, measurements, API events and console errors are in `/home/ubuntu/r511/findings-browser.json`.

| Page/check | Result | Evidence / actual result |
|---|---|---|
| Home Chinese SSR/hydrated H1 and English hydrated H1 | PASS | Chinese “用中文说出寓意，猎到真正可注册的.cn / .com 好域名”; English “Name it in Chinese or English, hunt .cn / .com domains you can actually register”. `A-home-zh-light-1280.png`, `A-home-en-dark-1280.png`. |
| Home exact check | PASS | Filled `qwzx7k3r511` in 精确核验; exactly **1 automatic POST /api/search** before expanding suffixes. `.com` and `.cn` available. `A-exact-com-cn-price-1280.png`, `A-exact-status-grid-1280.png`. |
| Home `.cn` and `.com.cn` static prices | PASS | Both available chips show **≈$5**. Expanding more suffixes issued one additional non-AI POST search; this is not a duplicate initial request. `A-more-comcn-1280.png`. |
| Home Aliyun anchor and shortlist stars | PASS | `.cn` single href `https://wanwang.aliyun.com/domain/searchresult/#/?keyword=qwzx7k3r511.cn`; no home dropdown. Starred `.cn`, `.com.cn`, `.com`; three rows appeared in shortlist. |
| Industry template | PASS | 茶叶品牌 fills the tea-brand brief; **0 new API requests**. Example-prompt chips and AI submission untouched. `A-template-filled-1280.png`, `A_template`. |
| Home footer | PASS | **408** `/tld/`, **410** `/guide/`, **444** `/vs/` links; **3** 浏览全部 links; /why /mcp /advanced /prices present. `A-footer-end-1280.png`, `A_footer`. |
| `/advanced` bulk | PASS | One POST search for `zalizeqa1r511.com`, `zalizeqa2r511.cn`, `zalize.com`; two available, `zalize.com` taken with expiry **2027-07-06**. CSV control present, not downloaded. `B-advanced-statuses-1280.png`. |
| `/prices` count/filter/prices | PASS | **408** Hunt links; `.cn` → **1** row, **≈$5 ¥33 / ≈$5 ¥38** at 1280px. `C-prices-cn-1280.png`. |
| `/prices` sorting | PASS | Ascending suffix order begins abogado/academy/accountants/actor/ae; descending zone/za/yoga/xyz/wtf. `C-prices-sort-asc-1280.png`, `C-prices-sort-desc-1280.png`. |
| `/prices` requested Dynadot presence | FAIL (presence expectation only) | Zero links/text; deployed code has none per lead. Observation, not new regression. `C-prices-1280.png`, `C_registrar_headers`. |
| `/prices` mobile `.cn` | PASS | Only USD displayed by design; document width **375**. `C-prices-cn-light-375.png`. |
| `/prices` mobile trap badge | FAIL (layout quality) | `.xyz` renewal badge wraps vertically; price cell grows to 64px. `C-prices-xyz-badge-light-375.png`. |
| `/tld` hub | PASS | **408** cards; creative anchor section top=128.25, sticky nav bottom=124; `.cn` → **1**, `cn` → **2**; back-to-top scrollY=0. `D-tld-anchor-1280.png`, `D-tld-filter-1280.png`. |
| `/guide` hub | PASS | **410** cards; food anchor top=127.75, nav bottom=124; `实名` → **2**; back-to-top=0. `D-guide-anchor-1280.png`, `D-guide-filter-1280.png`. |
| `/vs` hub | PASS | **444** cards; accountants anchor top=127.75, nav bottom=124; `.com vs .cn` → **1**; back-to-top=0. `D-vs-anchor-1280.png`, `D-vs-filter-1280.png`. |
| `/vs` dotless matching | FAIL (known P3) | `com vs cn` → **0**, matching previously reported behavior. `D-vs-dotless-1280.png`. |
| `/tld/cn` zh/en | PASS | H1, breadcrumb parent navigation to `/tld?lang=zh|en`, **2 JSON-LD scripts**, related links and /why /mcp /advanced present. `E-tld-cn-zh-1280.png`, `E-tld-cn-en-1280.png`, corresponding site-links screenshots. |
| `/tld/cn` price | PASS | Chinese SSR/UI: **静态参考价：首年 ¥33 · 续费 ¥38/年 · 非实时报价**. English: **Static reference: ≈$5 (¥33) 1st yr · ¥38/yr renewal · not a live quote**. Same screenshots, `E_tld/cn_zh`, `E_tld/cn_en`. |
| `/tld/cn` requested Dynadot presence | FAIL (presence expectation only) | No Dynadot link on content page; menu coverage below verifies correct location. Not a new regression. |
| `/guide/cn-realname` zh/en | PASS | H1 “.cn 域名实名认证全流程：材料、时限与审核” / “.cn Real-Name Verification, End to End: Documents, Timelines and Review”; **3 JSON-LD scripts**, related/site links, breadcrumb to correct language hub. `E-guide-cn-realname-zh-1280.png`, `E-guide-cn-realname-en-1280.png`, site-links pairs. |
| `/vs/com-vs-cn` zh/en | PASS | H1 “.com 和 .cn 怎么选：面向人群、备案与品牌保护对比” / “.com vs .cn: Audience, Compliance & Brand Protection Compared”; **3 JSON-LD scripts**, related/site links, breadcrumb to correct language hub. `E-vs-com-vs-cn-zh-1280.png`, `E-vs-com-vs-cn-en-1280.png`, site-links pairs. |
| `/why` and language toggle | PASS | Chinese content renders; header Switch to English sets `/why?lang=en`; reload retains English H1 and URL. `F-why-1280.png`, `J-why-language-reload-en-1280.png`. |
| `/mcp` page keyboard and copy | PASS | Tab focuses both PREs; visible ring. ArrowRight increases second PRE scrollLeft **0→120**. Copy output exactly matches code via clipboard read. `F-mcp-pre-first-focus-1280.png`, `F-mcp-pre-focus-before-1280.png`, `F-mcp-pre-scroll-after-1280.png`, `F-mcp-copied-1280.png`. MCP tools themselves owned by lead. |
| `/monitors` | PASS | Empty state; global occupancy **2/500**. No monitor created/cancelled. `F-monitors-1280.png`. |
| `/shortlist` | PASS | Three starred rows visible. `F-shortlist-1280.png`. |
| `/no-such-page-r511` | PASS | Browser navigation HTTP **404**, branded page. `G-no-such-page-r511-1280.png`. |
| `/tld/zzznotatld` | PASS | HTTP **404**, branded page. `G-tld-zzznotatld-1280.png`. |
| `/guide/zzz-none` | PASS | HTTP **404**, branded page. `G-guide-zzz-none-1280.png`. |
| `/vs/zzz-vs-yyy` | PASS | HTTP **404**, branded page. `G-vs-zzz-vs-yyy-1280.png`. |
| Shortlist registrar menus | PASS | `.cn`/`.com.cn`: 阿里云, 腾讯云, Dynadot only. `.com`: Porkbun, Namecheap, Dynadot, Cloudflare, 阿里云, 腾讯云. Esc closes; no link followed. `H-shortlist-cn-menu-1280.png`, `H-shortlist-com-menu-1280.png`, `H-shortlist-comcn-menu-1280.png`, `H-shortlist-cn-menu-dark-1280.png`. |
| Share creation includes status | PASS | UI POST items have domains and `status:"available"` for all three. Share **rhWlK999Ge**; now revoked. `H-shortlist-created-1280.png`, `H_create`. |
| Status-aware share | PASS | Three 可注册 badges; copy label **复制 3 个可注册**; SSR title **3 个可注册域名候选 \| DomainHunter**. `H-share-active-light-1280.png`. |
| Share registrar menus | PASS | Same exact `.cn`/`.com.cn`/`.com` registrar sets as shortlist; no links followed. `H-share-cn-menu-1280.png`, `H-share-com-menu-1280.png`, `H-share-comcn-menu-1280.png`, `H-share-cn-menu-dark-1280.png`. |
| Legacy no-status share | PASS | Shell POST omitted status; share **n15sBAuOSW** shows amber “此快照未记录核验状态，注册前请重新查询”, **复制 2 个域名**, no status badges; SSR title **2 个候选域名 \| DomainHunter**. `H-share-legacy-light-1280.png`. |
| Both share revocations | PASS | First via UI 删除→确认删除; second via shell DELETE. Both API GETs **410**, both show expired UI with rows removed. Tokens and `revoked:true` persisted in `shares.json`. `H-share-revoked-rhWlK999Ge-1280.png`, `H-share-revoked-n15sBAuOSW-1280.png`. |
| Revoked share shell status/title | FAIL (known P3 metadata) | Both HTML shells **200** with home title despite API **410**. `revoked-shell-http.json`. |
| Per-row shortlist cleanup | PASS | Clicked 移除 separately on all three rows, never 清空; storage shortlist `[]`, empty UI. `H-shortlist-empty-cleanup-1280.png`. |
| Home keyboard | PASS | Tab sequence from logo through advanced/shortlist/GitHub/language/theme/onboarding/mode controls reaches textarea. Header/mode outlines and textarea focused enclosing border/caret inspected; no Enter/Space. `J-home-header-tab-focus-1280.png`, `J-home-exact-tab-focus-1280.png`, `J-home-textarea-focus-1280.png`. |
| Zero AI / no registrar navigation | PASS | **0 `/api/ai-search`**, **0 `/api/click`**. No AI examples/refinement/round actions, registration, payment or registrar navigation in this browser half. |
| Console | FAIL (literal 404-only exclusion); PASS (unexpected errors) | **0 pageerrors**, **4 intentional404 + 2 expected410** resource errors; **0 unexpected errors**. |
| Storage cleanup | PASS | Exact original three local keys restored, all other keys removed, session empty. Supplied dump helper ran; `diff -u` output empty, exit **0**, files byte-equal. `storage-r511-pre.json`, `storage-r511-post.json`, `K-clean-home-restored.png`. Device metrics cleared; desktop restored to width1600. |

### Registrar hrefs

Shortlist and active-share menus each returned these exact Dynadot URLs:

- `.cn`: `https://www.dynadot.com/domain/search?domain=qwzx7k3r511.cn`
- `.com.cn`: `https://www.dynadot.com/domain/search?domain=qwzx7k3r511.com.cn`
- `.com`: `https://www.dynadot.com/domain/search?domain=qwzx7k3r511.com`

No outbound link was clicked. Menu screenshots cover light/dark `.cn`; other menu sets were inspected in light.

### 375px matrix

CDP375×900, deviceScaleFactor1, scrollbars hidden for measurements. **All 24/24 cases measured innerWidth=375 and documentElement.scrollWidth=375**. Screenshots inspect the initial viewport, not every off-screen paragraph.

| Route | Result / screenshot pair |
|---|---|
| `/` | PASS — `I-home-zh-light-375.png` / `I-home-zh-dark-375.png` |
| `/tld/cn` | PASS — `I-tld-cn-zh-light-375.png` / `I-tld-cn-zh-dark-375.png` |
| `/guide/cn-realname` | PASS — `I-guide-cn-realname-zh-light-375.png` / `I-guide-cn-realname-zh-dark-375.png` |
| `/vs/com-vs-cn` | PASS — `I-vs-com-vs-cn-zh-light-375.png` / `I-vs-com-vs-cn-zh-dark-375.png` |
| `/prices` | PASS (width only; badge exception above) — `I-prices-zh-light-375.png` / `I-prices-zh-dark-375.png` |
| `/why` | PASS — `I-why-zh-light-375.png` / `I-why-zh-dark-375.png` |
| `/mcp` | PASS — `I-mcp-zh-light-375.png` / `I-mcp-zh-dark-375.png` |
| `/advanced` | PASS — `I-advanced-zh-light-375.png` / `I-advanced-zh-dark-375.png` |
| `/monitors` | PASS — `I-monitors-zh-light-375.png` / `I-monitors-zh-dark-375.png` |
| `/shortlist` | PASS — `I-shortlist-zh-light-375.png` / `I-shortlist-zh-dark-375.png` |
| `/tld` | PASS — `I-tld-zh-light-375.png` / `I-tld-zh-dark-375.png` |
| Active `/s/rhWlK999Ge` | PASS — `I-share-active-zh-light-375.png` / `I-share-active-zh-dark-375.png` |

### API request ledger

All captured browser requests are individually recorded in findings JSON `requests`, with methods, URLs, times and bodies. Shell share requests are in `shell_requests` and `shell-share-requests.json`. These counts exclude the lead's separate HTTP/MCP/usage work.

| Method / path | Browser | Shell | Total |
|---|---:|---:|---:|
| GET `/api/stats` | 5 | 0 | 5 |
| GET `/api/prices` | 36 | 0 | 36 |
| GET `/api/registrars` | 57 | 0 | 57 |
| POST `/api/search` | 3 | 0 | 3 |
| POST `/api/monitor/list` | 2 | 0 | 2 |
| POST `/api/share` | 1 | 1 | 2 |
| GET `/api/share/rhWlK999Ge` | 4 | 1 | 5 |
| GET `/api/share/n15sBAuOSW` | 2 | 1 | 3 |
| DELETE `/api/share/rhWlK999Ge` | 1 | 0 | 1 |
| DELETE `/api/share/n15sBAuOSW` | 0 | 1 | 1 |
| Any `/api/ai-search` | 0 | 0 | 0 |
| Any `/api/click` | 0 | 0 | 0 |
| **All API requests** | **111** | **4** | **115** |

The three search POSTs are **initial exact**, **expand more suffixes**, and **advanced bulk**, one each. No `/api/usage` requests were made by the browser half.

### Console text

- `/no-such-page-r511?lang=zh`, `/tld/zzznotatld?lang=zh`, `/guide/zzz-none?lang=zh`, `/vs/zzz-vs-yyy?lang=zh`: `Failed to load resource: the server responded with a status of 404 ()` — four intentional errors.
- `/api/share/rhWlK999Ge`, `/api/share/n15sBAuOSW` after revocation: `Failed to load resource: the server responded with a status of 410 ()` — two expected errors.
- JavaScript `pageerror`: none. Other captured console errors: none. Warnings were not collected by this run's error-only listener.

## Key visual evidence

| Shortlist `.cn` registrar menu — light | Shortlist `.cn` registrar menu — dark |
|---|---|
| ![Shortlist cn menu light](https://app.devin.ai/attachments/6f548216-b337-4b7d-affd-a61c83b5b6a1/H-shortlist-cn-menu-1280.png) | ![Shortlist cn menu dark](https://app.devin.ai/attachments/2a6f92d5-f5bb-422a-8acb-9eeb706198f2/H-shortlist-cn-menu-dark-1280.png) |

| 🔴 Before revocation — status-aware share | 🟢 After revocation — expired state |
|---|---|
| ![Share active](https://app.devin.ai/attachments/133fc03a-1085-47f2-a050-402f38233aa2/H-share-active-light-1280.png) | ![Share revoked](https://app.devin.ai/attachments/8dfb6758-a774-4d37-a540-978cc4fb13aa/H-share-revoked-rhWlK999Ge-1280.png) |

| Observed P3 — renewal badge at375 | Observed P3 — dotless VS filter |
|---|---|
| ![Mobile badge wrapping](https://app.devin.ai/attachments/84b780f3-67c9-42f1-8e3a-e567d929a426/C-prices-xyz-badge-light-375.png) | ![Dotless VS empty result](https://app.devin.ai/attachments/ad0785e5-200f-43bb-8d87-be01d8de8c4e/D-vs-dotless-1280.png) |

## Incomplete coverage

- UNTESTED intentionally: AI generation/fallback/quota/refinement, examples, additional rounds, domain registration/payments and outbound registrar destination behavior.
- UNTESTED in this browser half: MCP JSON-RPC tools, HTTP metadata matrix/Lighthouse/global usage counter reconciliation; owned by lead.
- UNTESTED: monitor creation/webhooks, shortlist cross-device sync/import, CSV download/content, every content link, mixed available/taken status-aware share (this UI share contains three available items; legacy contains an unchecked taken item).
- English home SSR not separately asserted; bare-path language toggle not repeated. English coverage is home hydrated H1, three content pages, and /why toggle/reload; mobile matrix is Chinese only.
- Test-harness retries: hub back-to-top locator required a larger scroll; breadcrumb locator required supporting English `Breadcrumb`; clipboard read required allowing the visible Chrome permission prompt. These were resolved and the actual interactions completed. Clipboard-read permission was returned to prompt afterward. No code fixes or deployments were made by this browser agent.
- No claim that the entire codebase is correct; this was a bounded live production audit. No new P0/P1/P2 browser defect established.

## Artifacts and handoff

- Recording: `/home/ubuntu/screencasts/r511-browser/r511-browser-edited.mp4`
- Screenshots: `/home/ubuntu/r511/shots/` (absolute path = directory + filename above).
- Findings: `/home/ubuntu/r511/findings-browser.json`
- Report: `/home/ubuntu/r511/browser-report.md`
- Shares: `/home/ubuntu/r511/shares.json` (both `revoked:true`; contains requested cleanup tokens, do not paste tokens into public comments).
- Shell evidence: `/home/ubuntu/r511/shell-share-requests.json`, `/home/ubuntu/r511/revoked-shell-http.json`
- Storage: `/home/ubuntu/r511/storage-r511-pre.json`, `/home/ubuntu/r511/storage-r511-post.json`; `diff` empty, exit0 and byte equality true.
- Suggested PR comment: **none** — production audit, not an open-PR test.
- SKILL.md suggestions: **none** — existing testing skill used; repository edits prohibited.
- Blueprint: `read_environment_config` confirmed **no blueprint**. No installs/build/dev services were needed by this browser agent. Suggested blueprint knowledge: production browser audits use existing CDP `http://localhost:29229`, existing Python Playwright, `wmctrl` maximization, CDP1280/375 metrics/screenshots, and `docs/qa/dump_storage_r455.py` for storage equality. No blueprint was changed.
- Still needed from user: **none**. Lead should combine its own HTTP/MCP/usage results and track the known P3 observations separately from presence expectations corrected during this run.
