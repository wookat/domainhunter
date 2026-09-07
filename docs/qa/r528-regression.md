# R528 production regression — R524 / R525 / R526 / R528 (Worker f648963f, deploy/r192-r195 @ 83f1e4e)

- Target: https://hunt.zalize.com · bundle `index-CZ5sF4CH.js` (== local `apps/web/dist/assets/index-CZ5sF4CH.js`)
- Date: 2026-09-06 09:39Z – 10:00Z · zero-AI (no `/api/ai-search`, no 「开始猎取」/AI examples/refine)
- Recording: `/home/ubuntu/screencasts/r528-prod-regression/r528-prod-regression-edited.mp4`
- Plan: `/tmp/r528/test_plan.md` · user plan `/home/ubuntu/test-plan-r524-528.md`

## 0. Zero-AI / storage / IndexNow proof

| item | before (`/tmp/r528/usage_before.json`) | after (`/tmp/r528/usage_after.json`, 65 s after last action) | delta |
|---|---|---|---|
| 2026-09-06 `searches` | 0 | 0 | **0** |
| `fast` | 0 | 0 | **0** |
| `refine` | 0 | 0 | **0** |
| `aiErrors` | absent | absent | **0** |
| `pageviews` | home15 results2 tld68 guide31 vs89 prices10 other16 | home21 results3 tld137 guide41 vs111 prices12 other25 | my browsing + thin-fetch |
| `bots` | 7531 | 9244 | thin-fetch (1704 curl requests) |

IndexNow (read-only, all unchanged): `cronLast=1788674438989`, `indexnowLastAttempt=1788674438989`, `indexnowLastResult={"at":1788674438989,"ok":false,"status":429,"message":"Too many requests","submitted":0,"retries":2}`, `indexnowPending=1270`, `indexnowLast=1788436834369`.

Playwright request hooks on 17 browser pages + the 8-page SSR/DOM parity run: **0** requests to `/api/ai-search`. Non-AI production writes made by this run: 2× `POST /api/search` (quick-check `r528qzx7`, `baidu`), 2× `POST /api/share` (`ONoDrm5nAF`, `KUGjFIoZ2Z`, both revoked → 410), 1× MCP `tld_prices`, 1× MCP `check_domains`.

Storage: `/tmp/r528/storage_before.json` vs `storage_after.json` → `local identical: True | session identical: True | byte-identical json: True` (7 keys; `dh:myShares:v1` extra key removed, `domainhunter:shortlist` restored to the original 3 rows; theme dark / lang zh re-set via the header UI). `/shortlist` reload shows petlovo.ai / getzalize.com / wexlorbit.com, no share row (`16_shortlist_restored_3_rows.png`).

## 1. Results

P0: none · P1: none · P2: none · P3: 3 (all pre-existing / by design, listed at the end).

### T1 — R528(a) SSR price == hydrated price (`/tmp/r528/ssr_vs_dom.py`, `ssr_vs_dom.json`)
- passed — `/tld/com?lang=zh`, `/tld/com?lang=en`, `/tld/my?lang=en`, `/tld/cn?lang=zh`, `/tld/at?lang=zh`, `/tld/ar?lang=en`, `/guide/saas?lang=zh`, `/guide/saas?lang=en` (+ `/tld/de`, `/tld/uz`): first-screen price card text and 「相关 TLD / Related TLDs」 chip labels identical between curl SSR (`?cb=`) and hydrated DOM (whitespace-normalized) — 0 drift (R527 drift `首年 ¥79`→`首年 $12.52 ≈¥90` is gone).
- passed — live TLDs match `/api/prices` (`fetchedAt 1788674449621`, unchanged before/after): `.com` 注册 `$11.08 ≈ ¥80` · 续费 `$11.08 ≈ ¥80` · 「Porkbun 实时价 · 人民币按汇率 7.2 估算」; `.my` en `Register $2.37 ≈ ¥17 · Renew $26.06 ≈ ¥188 · Live Porkbun pricing`.
- passed — static TLDs (cn/at/ar) show 「静态参考价：首年 ¥… · 续费 ¥…/年 · 非实时报价」 / “Static reference … not a live quote” in both SSR and DOM.
- passed — browser `/tld/com?lang=zh`: card renders live values immediately, no flash to static (`01_tld_com_price_card_hydrated.png`).

### T2 — R528(b) 「更多 TLD 指南」 chips price-free
- passed — `/tld/com` zh: 21 ordinary chips, 0 contain `¥`/`$`/`首年`/`1st yr`, every label `.x` == href `/tld/x?lang=zh`; SSR list == DOM list; view-all 「查看全部 408 个 TLD 指南 →」 → `/tld?lang=zh#hub-g-general` (`02_tld_com_more_chips_no_price.png`). `/tld/my` en: 30 price-free chips → `#hub-g-more`. 「相关 TLD」 (6 chips) keeps `priceShort` as designed.
- passed — click view-all → hub `/tld?lang=zh#hub-g-general`, counter `408 / 408`, `#hub-g-general` top 128.75 px (`03_tld_hub_landed_hub_g_general.png`).
- passed — hub counters 408 / 410 / 444 (`/tld`, `/guide`, `/vs`), `/prices` 408 / 408.

### T3 — R525/R526 ccTLD rewrite (`/tmp/r528/content_check.py`, 12 SSR fetches)
- passed — `/tld/de`, `/tld/jp`, `/tld/at`, `/tld/ar`, `/tld/my`, `/tld/uz` zh+en: HTTP 200, intro prose substantive (zh ≥200 chars / en ≥120 words), no `undefined`/`null`/empty `<p>`/U+FFFD; 3 FAQ `<details>` answers == FAQPage JSON-LD; canonical `https://hunt.zalize.com/tld/<x>` (zh) / `…?lang=en` (en); hreflang `zh` / `en` / `x-default` present (production emits `zh`, not `zh-CN` — checker adjusted).
- passed — `/tld/de` contains neither 「全球最大」 nor “German admin contact”; `/tld/ar?lang=en` + `/vs/uy-vs-ar` zh/en contain the corrected .ar wording (zh 「经公证/认证的身份文件」+「NIC 人工验证」; en “notarized/certified identity documents” + “verifies manually”).
- passed — screenshots `/tld/de` zh dark desktop (`04_…`), `/tld/my?lang=en` light desktop (`05_…`); 375 px `/tld/de`, `/tld/ar?lang=en`, `/tld/com`, `/vs/uy-vs-ar`, `/tld/my?lang=en`: `documentElement.scrollWidth === 375` every time (`06_`–`09_`, `17_`, `18_`).
- passed — full-site thin audit (`node scripts/seo-audit/thin-fetch.mjs --groups tld,vs` → 1704 requests, all 200, `/tmp/r528/thin`; `thin-analyze.mjs` → `/tmp/r528/thin-out`; guide group not re-fetched, empty dir supplied so the analyzer runs):

| group | n | linkShare median (R527) | P90 | max | >25 % (R527) | prose words median | nnMasked >0.8 | tplSent median |
|---|---|---|---|---|---|---|---|---|
| tld/zh | 408 | **12.3 %** (20.8 %) | 14.7 % | 18.0 % `/tld/fun` | **0** (12) | 665 | 0 | 0.471 |
| tld/en | 408 | **15.3 %** (28.2 %) | 18.6 % | 22.7 % `/tld/vip` | **0** (370) | 412 | 0 | 0.421 |
| vs/zh | 444 | 18.3 % (18.7 %) | 21.6 % | 24.5 % | 0 (3) | 914 | 0 | 0.409 |
| vs/en | 444 | 21.4 % (21.8 %) | 25.6 % | 29.1 % `/vs/studio-vs-co` | 52 (66) | 573 | 0 | 0.409 |

  `/tld/com` en 20.0 % (R527 30.3 %). R527's simulation predicted “median ≈14.5 %, >25 % → 0” for removing chip prices — observed 15.3 % / 0. (`/tmp/r528/link_share_r528.txt`, `thin-out/pages.csv`, `template-sentences.json`.)

### T4 — R524 /vs short pages
- passed — `/vs/io-vs-dev`, `/vs/com-vs-co`, `/vs/pro-vs-vip` zh+en: `#verdict` prose long, combination-specific, pairwise distinct, names both TLDs; price table present, 5-yr == first + 4×renewal for every row (`.io` $28.12/$51.80, `.dev` $8.75/$12.87 live). Browser screenshot `10_vs_io_dev_verdict_table_zh_dark.png`.
- passed — `/vs/uy-vs-ar` zh/en .ar correction (see T3).

### T5 — R528(c) shortlist share URL cleanup (recorded, UI only)
- passed — home 「精确核验」 `r528qzx7` → star `.com`; `baidu` → star `baidu.com` (已注册 2028-10-11); `/shortlist` 5 rows (2× `POST /api/search`, no AI).
- passed — 「生成分享链接」 → `https://hunt.zalize.com/s/ONoDrm5nAF`; 「分享链接（30 天有效）」 row + 「我的分享链接」 card (5 个域名) shown; shell 200, `<title>5 个候选域名 | DomainHunter</title>`, no noindex (`11_shortlist_share1_created.png`).
- passed — 「删除」→「确认删除？」 (both clicks within the 5 s `CONFIRM_WINDOW_MS`): the 「分享链接（30 天有效）」 row **disappears** together with the card (pre-fix the dead URL stayed); `main.innerText` contains no `/s/`; `dh:myShares:v1 = []`; `GET /api/share/ONoDrm5nAF` 410; shell HTTP 410 + `<meta name="robots" content="noindex" />` + 「分享已撤销 | DomainHunter」 (`12_shortlist_share1_revoked_row_gone.png`).
- passed — second share `KUGjFIoZ2Z` created; removing all 5 rows via 「移除」 → 「分享链接」 row hidden, empty state 「还没有候选…」 shown, the 「我的分享链接」 history card stays (live record, its own 删除) (`13_shortlist_empty_share_row_hidden.png`); card 删除→确认 → card gone, API 410, shell 410 + noindex (`14_shortlist_share2_revoked_empty.png`).
- passed — browser `/s/ONoDrm5nAF` after revoke: SPA renders 「链接已失效：分享者已删除这份清单」 + 「去创建自己的候选清单」 (not blank / not home) (`15_share_revoked_spa.png`).
- passed — storage restored byte-identical; `/shortlist` shows the original 3 rows (`16_…`).

### T6 — General regression
- passed — route status (curl `-A Mozilla`): `/` 200 `lang="zh-CN"`; `/?lang=en` 200 `lang="en"` canonical `/?lang=en`; `/prices`, `/why`, `/mcp`, `/tld`, `/guide`, `/vs` 200; `/no-such-r528` 404 (branded shell 4904 B + noindex when `Accept: text/html`, empty body otherwise — by design, worker.ts L2057); `/s/nope-r528` 404 + noindex + 「分享不存在或已过期」; both test shares 410 + noindex + 「分享已撤销」.
- passed — sitemap `<loc>` = 1270 (= 408 + 410 + 444 + 8).
- passed — MCP `tools/call tld_prices` (1×) → 408 TLDs, `my` 2.37/26.06, `isError:false`; `check_domains r528qzx7.com` (1×) → `available`, `isError:false`.
- passed — console sweep (Playwright page in the recorded browser, 17 pages incl. `/`, `/?lang=en`, `/prices`, `/why`, `/mcp`, hubs, `/tld/com`, `/tld/my?lang=en`, `/tld/de`, `/tld/ar?lang=en`, `/guide/saas`, `/vs/io-vs-dev`, `/vs/uy-vs-ar?lang=en`, `/shortlist`, `/monitors`): 0 console error/warning, 0 pageerror, 0 requestfailed, 0 `/api/ai-search` (`/tmp/r528/console_sweep.json`).
- passed — Lighthouse (`--only-categories=seo,accessibility,performance`):

| page | preset | SEO | a11y | perf | CLS | LCP |
|---|---|---|---|---|---|---|
| `/tld/com` | desktop | 100 | 100 | 100 | 0.0003 | 463 ms |
| `/tld/com` | mobile | 100 | 100 | 97 | 0.000 | 2435 ms |
| `/tld/my?lang=en` | desktop | 100 | 100 | 100 | 0.000 | 652 ms |
| `/tld/my?lang=en` | mobile | 100 | 100 | 91 | 0.000 | 3395 ms |

  CLS ≤ 0.005 everywhere (R527 baseline desktop 0.000 / mobile ≤0.005). (`/tmp/r528/lh_*.json`)
- passed — 375 px dark `/tld/com` (`17_tld_com_375_dark.png`) and light `/tld/my?lang=en` (`18_tld_my_en_375_light.png`, theme toggled via header), `scrollWidth` 375; theme/lang restored to dark/zh via header buttons.

## 2. P3 notes (pre-existing, not from this deploy)
- Branded 404 shell still carries the home `<title>` (with noindex) — same as R505/R509.
- Unknown paths return an empty 404 body unless `Accept: text/html` — intended (worker.ts L2057), just don't grep the body with a bare curl.
- vs/en linkShare >25 % still 52 pages (R527: 66); `/vs` chips were not in R528 scope.

## 3. Checker corrections made during the run (test-side, not production issues)
- `ssr_vs_dom.py` first compared SSR zh vs hydrated en on `/tld/cn`, `/tld/at`, `/guide/saas` because earlier `?lang=en` visits had rewritten `domainhunter:lang`; fixed by using explicit `?lang=` on every route.
- `content_check.py` stripped `<summary>` without attributes → false FAQ mismatches; fixed with `<summary[^>]*>`.
- hreflang expectation `zh-CN` → production uses `zh`.
- Share 「删除→确认删除？」 needs both clicks inside 5 s; my first attempt (screenshot between clicks) only re-armed the confirm.

## 4. Artifacts
- Video: `/home/ubuntu/screencasts/r528-prod-regression/r528-prod-regression-edited.mp4`
- Screenshots (`/tmp/r528/`): `01_tld_com_price_card_hydrated.png`, `02_tld_com_more_chips_no_price.png`, `03_tld_hub_landed_hub_g_general.png`, `04_tld_de_zh_dark_desktop.png`, `05_tld_my_en_light_desktop.png`, `06_tld_de_375_light.png`, `07_tld_ar_en_375_light.png`, `08_tld_com_375_light.png`, `09_vs_uy_ar_375_light.png`, `10_vs_io_dev_verdict_table_zh_dark.png`, `11_shortlist_share1_created.png`, `12_shortlist_share1_revoked_row_gone.png`, `13_shortlist_empty_share_row_hidden.png`, `14_shortlist_share2_revoked_empty.png`, `15_share_revoked_spa.png`, `16_shortlist_restored_3_rows.png`, `17_tld_com_375_dark.png`, `18_tld_my_en_375_light.png`
- Data: `usage_before.json`, `usage_after.json`, `api_prices_before.json`, `storage_before.json`, `storage_after.json`, `ssr_vs_dom.json`, `console_sweep.json`, `lh_tld_com_{desktop,mobile}.json`, `lh_tld_my_en_{desktop,mobile}.json`, `link_share_r528.txt`, `thin/fetch.json`, `thin-fetch.log`, `thin-out/*`, `shell_live1.html`, `shell_revoked1.html`, `shell_revoked2.html`, `mcp_prices.txt`, `mcp_check.txt`, `test_plan.md`
