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
- MCP `tld_prices` returns `prices` as a dict keyed by TLD (not an array); expected tldCount = current /tld count (186 as of R301).
- Hub counts (as of R303): /tld 186, /guide 182, /vs 216; quick-check "All" = /tld count + 1 (com.cn). Authoritative counts live in `scripts/content-counts.json`.
- On /vs pages, en language is served via `?lang=en` query param (a `/en/...` path prefix 404s); the hub filter input (`input[type=search]`) is the fastest way to locate a specific compare card.
- Local testing without deploying: `pnpm install`, then in `apps/web` run `pnpm build` (vite) followed by `npx wrangler dev --port 8787` — it serves the built `dist` plus the worker routes (sitemap.xml, /llms.txt, /api/*) on localhost. `/prices` shows static reference prices when live Porkbun quotes are unavailable locally. Start it with `setsid nohup npx wrangler dev --port 8787 &` from `apps/web`: if launched from a shell that gets timeout-reaped, the dead instance's port can briefly keep returning 200 with an empty body.
- To count /prices table rows objectively, count `main a[href^="/?tld="]` (Hunt links) — the table is not a `<table>` element.
- 375px viewport checks: use CDP `Emulation.setDeviceMetricsOverride` in a separate tab; assert `document.documentElement.scrollWidth <= 375`.
- Lighthouse CLI with `--chrome-flags="--headless=new --no-sandbox"` works fine against production.
- Hub pages (/tld, /guide, /vs) have a sticky group-chips anchor nav (R415): chips are `nav[aria-label="分组导航"/"Group navigation"] a[href^="#hub-g-"]`, sections are `id="hub-g-<group>"` with `scroll-mt-28`; the back-to-top button (`button[aria-label="回到顶部"/"Back to top"]`, 44×44) appears once `scrollY > innerHeight`. Note the chips row can show a horizontal OS scrollbar that makes nav bottom (~124px) exceed scroll-mt-28 (112px), slightly clipping headings after anchor jumps — measure with getBoundingClientRect if verifying anchor offsets.
- Before browser-testing a freshly checked-out branch locally, confirm `apps/web/dist/assets` mtimes are newer than the checkout (wrangler dev serves the prebuilt dist; rerun `pnpm build` in apps/web if stale).
- When taking 375px CDP-emulated screenshots of a background tab, `page.screenshot()` can return an all-black image for the dark theme; use `Page.captureScreenshot` via the CDP session (and `bring_to_front`) instead.
- The /tld hub has an `input[type=search]` filter (aria-label "Filter TLDs…/筛选后缀…") — fastest way to locate a single TLD and its category.
- Results page without AI: the page restores from **sessionStorage** (not localStorage) key `dh:lastSearch:v1` (apps/web/src/lib/persist.ts). Seed it in the same tab (`values.description` non-empty, `values.style`/`lengthPref` = "", rows with label/domain/tld/status/score/scores/meaning) then navigate to `/`. Taken rows render a compact early-return row (no swatch/card) and are filtered out of grid view — use a `status: "unknown"` row to exercise the not-available (no green check) BrandCard path.
- Stale `wrangler dev` can hold port 8787 with an empty-body 200 (index bundle 404s). Check with `curl -s localhost:8787/ | grep -o 'assets/index-[^"]*'`; if empty, kill the workerd/wrangler pids shown by `ss -ltnp | grep 8787` and restart in a persistent tty shell (`exec tty=true, shell_id=...`) — `setsid nohup … &` from a one-shot exec gets reaped.
- To prove a layout issue is pre-existing, build the base commit in a worktree: `git worktree add /tmp/dh-base <sha>`, symlink `node_modules` (root and apps/web) from the main checkout, `npx vite build`, `npx wrangler dev --port 8788`, then run the same fixture against both ports.
- CDP `Emulation.setDeviceMetricsOverride` from a Playwright `new_cdp_session` persists after the session detaches; to return to desktop send `Emulation.clearDeviceMetricsOverride` from a NEW session and reload. Emulated 375 viewport in the visible Chrome shows a classic 15px scrollbar (clientWidth 360) — inject `::-webkit-scrollbar{display:none}` before measuring `scrollWidth` if you need true 375 numbers.
- 375px overflow triage: `main` is a column-flex item with `mx-auto`, so any child's min-content (e.g. the non-wrapping TLD chip strip) widens it unless `main` has `w-full` (fixed in R468). To find the culprit, force `main.style.width='300px'` and list descendants whose right edge exceeds it.
- Local `wrangler dev` CAN fetch live Porkbun quotes, so TLD detail pages show live prices rather than static reference prices; to verify `TLD_PRICES`, grep the SSR HTML for「静态参考价：首年 ¥X · 续费 ¥Y/年」.
- R463 起结果页 Space 是两步确认：焦点离开输入框首按只出提示「再按一次空格确认再来一轮」（3s 超时还原），3s 内第二次 Space 才发起下一轮并消耗 AI。测试误触风险已缓解；验证 Space 行为时注意在 3 秒窗口内截图。
- 结果页 theme chips 只统计「可注册」行（results-page.tsx 只遍历 availableRows）：验证 word/pinyin 配额补发时，若该路线候选全被注册则 chip 不显示，勿据此误判补发失败/未触发。
- 导航到 hunt 首页前先对该标签页执行 `sessionStorage.clear()`：`dh:lastSearch:v1` 会把上次结果页恢复出来，按首页坐标的盲点击可能命中「再来一轮」并真实消耗 AI 配额（实测踩坑）。
- R465 起恢复态（从 `dh:lastSearch:v1` 还原的结果页）「再来一轮」按钮也是两步确认：首点只变「再点一次确认」（3s 超时还原），3s 内二次点击才发起；本会话真实发起过一轮后护栏解除，单击直接发起。
- Before spending any real-AI budget, GET `/api/usage` and look at today's `aiErrors`: if `rate-limit`/`quota` is already climbing (or a prior hunt returned the 429 banner within ~3s with 0 candidates), the upstream API key is probably exhausted (`apikey_quota_exhausted` shows up as HTTP 429) and every further hunt will burn budget for nothing. Ask the lead to check `wrangler tail` instead of retrying; fall back to the synthetic `dh:lastSearch:v1` restore state for UI regression and mark timing as untested.
- Record the exact UTC click time of every real hunt (e.g. `new Date().toISOString()` in a click hook). `/api/usage` counts are global — parent-session curl probes or other users inflate `searches`, so reconcile "my N hunts" against the delta and label the rest explicitly.
- If `Emulation.clearDeviceMetricsOverride` alone leaves the tab stuck at 375, send from a fresh CDP session: `setDeviceMetricsOverride {width:0,height:0,deviceScaleFactor:0,mobile:false}` → `clearDeviceMetricsOverride` → `setTouchEmulationEnabled {enabled:false}` → `page.reload()`; verify with `innerWidth`.
- Row/Grid view choice is not persisted across reload (only density `dh:density:v1` is); re-click Grid after every `?cb=` reload before comparing brand cards.
- 构造合成 `dh:lastSearch:v1` 恢复态时，`values.style/lengthPref` 必须用空字符串（UI 默认）：worker 会把任何非空值拼成中文后缀「命名风格偏好：…」进 description，可能改变 `descriptionLooksEnglish()` 语言判定路径（实测踩坑：填 "auto" 导致英文描述照出拼音）。
- Typing Chinese via the computer-use `type` action (xdotool) silently drops characters into React textareas; put the text on the clipboard (`printf '…' | xclip -selection clipboard`) and press ctrl+v instead.
- R471 rule-based fallback: run wrangler dev with `.dev.vars` `LLM_API_BASE` pointed at a mock that returns 429 `apikey_quota_exhausted` (0 real AI calls). First search shows banner reason 「配额已满」/"quota exhausted" and trips a 5-min KV breaker (`dh:llm-breaker:v1`, delete with `npx wrangler kv key delete --binding CACHE --local "dh:llm-breaker:v1"`); later searches show 「配额已满，熔断中」/"quota exhausted, circuit open". The banner is `[role=status]` (amber) in App.tsx; 再来一轮/One more round buttons are `disabled` for quota reasons. Theme chips (`results.theme.*`) only render when >1 theme exists, so a pure-rule result set shows NO 「规则生成」/"Rule-based" chip — check meanings starting 「规则生成：」/"Rule-based:" instead. Banner `{count}` = number of rule labels, not label×TLD rows.
- Agent progress panel (round notes such as `agent.note.fallback`) is only mounted while `running`; the mock upstream finishes in ~1s. To observe it, throttle the tab via CDP `Network.emulateNetworkConditions` (downloadThroughput≈800 B/s, keep the CDP websocket open for the duration) so the SSE stream trickles for ~25s.
- To leave a CDP 375px emulation without reloading (in-memory state like the fallback banner is not persisted to `dh:lastSearch:v1`): send `Emulation.setDeviceMetricsOverride {width:0,height:0,deviceScaleFactor:0,mobile:false}` then `Emulation.clearDeviceMetricsOverride` and dispatch a `resize` event.
- Raw-CDP alternative when Playwright is not installed: python `websockets` (`websockets.connect(url, origin=None)`) against `http://localhost:29229/json` works for Emulation/Page.captureScreenshot.
