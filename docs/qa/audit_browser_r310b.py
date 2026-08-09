import json, re, sys, time, urllib.request
from playwright.sync_api import sync_playwright

BASE = "https://hunt.zalize.com"
SHOTS = "screenshots-r310"
findings = {}
console_errors = []

DONE_JS = "() => { const e=[...document.querySelectorAll('main *')].find(x=>x.childElementCount===0&&/核验完成|Check complete/.test(x.textContent||'')); return e?e.textContent.trim():null; }"
ONBOARD_JS = "() => !!document.querySelector('button[aria-label=\"关闭引导\"], button[aria-label=\"Dismiss onboarding\"], button[title=\"关闭引导\"]')"

with sync_playwright() as p:
    b = p.chromium.connect_over_cdp("http://localhost:29229")
    ctx = b.contexts[0]
    page = ctx.new_page()
    page.on("console", lambda m: console_errors.append({"type": m.type, "text": m.text[:200], "url": page.url}) if m.type == "error" else None)
    page.on("pageerror", lambda e: console_errors.append({"type": "pageerror", "text": str(e)[:200], "url": page.url}))

    # force zh
    page.goto(BASE + "/", wait_until="networkidle")
    page.evaluate("localStorage.setItem('domainhunter:lang','zh')")

    # --- Onboarding TTL re-verify with precise detector (close button presence)
    ob = {}
    page.evaluate("localStorage.removeItem('dh:onboardDismissed:v1')")
    page.reload(wait_until="networkidle"); time.sleep(0.5)
    ob["no_key_visible"] = page.evaluate(ONBOARD_JS)
    page.evaluate("document.querySelector('button[aria-label=\"关闭引导\"]').click()")
    time.sleep(0.5)
    v = page.evaluate("localStorage.getItem('dh:onboardDismissed:v1')")
    ob["value_after_dismiss_is_ms_ts"] = bool(v and v.isdigit() and int(v) > 1e12)
    page.reload(wait_until="networkidle"); time.sleep(0.5)
    ob["hidden_after_dismiss"] = not page.evaluate(ONBOARD_JS)
    page.evaluate("localStorage.setItem('dh:onboardDismissed:v1', String(Date.now() - 31*24*3600*1000))")
    page.reload(wait_until="networkidle"); time.sleep(0.5)
    ob["visible_after_31d"] = page.evaluate(ONBOARD_JS)
    ob["key_removed_after_expiry"] = page.evaluate("localStorage.getItem('dh:onboardDismissed:v1')") is None
    page.evaluate("localStorage.setItem('dh:onboardDismissed:v1','1')")
    page.reload(wait_until="networkidle"); time.sleep(0.5)
    ob["legacy_hidden"] = not page.evaluate(ONBOARD_JS)
    lv = page.evaluate("localStorage.getItem('dh:onboardDismissed:v1')")
    ob["legacy_upgraded_to_ts"] = bool(lv and lv.isdigit() and int(lv) > 1e12)
    findings["onboarding_ttl_v2"] = ob

    # --- guide zh hub cardline <=42 (force zh explicitly)
    page.evaluate("localStorage.setItem('domainhunter:lang','zh')")
    page.goto(BASE + "/guide", wait_until="networkidle"); time.sleep(1)
    findings["guide_hub_lang"] = page.evaluate("() => document.documentElement.lang || localStorage.getItem('domainhunter:lang')")
    card = page.evaluate("""() => {
      const links=[...document.querySelectorAll('main a[href^="/guide/"]')];
      const res=[];
      for (const a of links){
        const spans=[...a.querySelectorAll('span')];
        if (spans.length>=2){
          const t=(spans[spans.length-1].textContent||'').trim();
          res.push({slug:a.getAttribute('href').split('?')[0], len:[...t].length, line:t});
        }
      }
      const over=res.filter(r=>r.len>42);
      return {total:res.length, overCount:over.length, over:over.slice(0,10), max:Math.max(...res.map(r=>r.len))};
    }""")
    findings["guide_zh_cardline"] = card
    page.screenshot(path=f"{SHOTS}/D2b-guide-hub-zh.png")

    # --- theme toggle via title button
    page.goto(BASE + "/", wait_until="networkidle")
    bg0 = page.evaluate("() => getComputedStyle(document.body).backgroundColor")
    page.evaluate("""() => { const b=[...document.querySelectorAll('header button')].find(x=>/切换浅色|Toggle light/i.test(x.getAttribute('title')||'')); b && b.click(); }""")
    time.sleep(0.6)
    bg1 = page.evaluate("() => getComputedStyle(document.body).backgroundColor")
    page.reload(wait_until="networkidle")
    bg2 = page.evaluate("() => getComputedStyle(document.body).backgroundColor")
    page.screenshot(path=f"{SHOTS}/I1-light-mode.png")
    page.evaluate("""() => { const b=[...document.querySelectorAll('header button')].find(x=>/切换浅色|Toggle light/i.test(x.getAttribute('title')||'')); b && b.click(); }""")
    time.sleep(0.6)
    bg3 = page.evaluate("() => getComputedStyle(document.body).backgroundColor")
    findings["theme_v2"] = {"initial": bg0, "toggled": bg1, "persist_after_reload": bg2, "back": bg3}

    # --- new share for live render evidence
    req = urllib.request.Request(BASE + "/api/share", data=json.dumps({"items": [{"domain": "qzxvkw9r310c.com", "status": "available"}, {"domain": "google.com", "status": "taken"}]}).encode(), headers={"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"})
    share = json.loads(urllib.request.urlopen(req).read())
    sid, tok = share["id"], share["revokeToken"]
    page.goto(f"{BASE}/s/{sid}", wait_until="networkidle"); time.sleep(1.2)
    findings["share_live_text"] = page.evaluate("() => [...document.querySelectorAll('main *')].filter(x=>x.childElementCount===0&&/qzxvkw9r310c|google/.test(x.textContent||'')).map(x=>x.textContent.trim()).slice(0,6)")
    findings["share_live_ui"] = page.evaluate("() => ({copy: [...document.querySelectorAll('main button')].some(b=>/Copy|复制/.test(b.textContent||'')), csv: [...document.querySelectorAll('main button, main a')].some(b=>/CSV/i.test(b.textContent||''))})")
    page.screenshot(path=f"{SHOTS}/H1-share-live.png")
    st = page.evaluate("""async ([sid, tok]) => {
      const r = await fetch(`/api/share/${sid}`, {method:'DELETE', headers:{'Content-Type':'application/json'}, body: JSON.stringify({token: tok})});
      const g = await fetch(`/api/share/${sid}`);
      const u = await fetch(`/api/share/nonexistent-r310x`);
      return {del: r.status, getAfter: g.status, unknown: u.status};
    }""", [sid, tok])
    findings["share_revoke_v2"] = st
    page.reload(wait_until="networkidle"); time.sleep(1)
    findings["share_revoked_ui_v2"] = page.evaluate("() => [...document.querySelectorAll('main *')].some(x=>/no longer active|已失效|不再有效/.test(x.textContent||''))")
    page.screenshot(path=f"{SHOTS}/H2-share-revoked.png")

    # --- quick-check All + unknown recheck
    page.goto(BASE + "/", wait_until="networkidle")
    page.get_by_role("button", name=re.compile("精确核验|Exact check")).first.click()
    inp = page.locator("main textarea, main input[type=text]").first
    inp.fill("qzxvkw9r310d")
    inp.press("Enter")
    for _ in range(60):
        s = page.evaluate(DONE_JS)
        if s: break
        time.sleep(1)
    page.get_by_role("button", name=re.compile("查更多后缀|more TLDs")).first.click()
    s2 = None
    for _ in range(240):
        s2 = page.evaluate(DONE_JS)
        if s2 and "193" in s2: break
        time.sleep(1)
    findings["quick_all_v2"] = s2
    page.screenshot(path=f"{SHOTS}/B3-quickcheck-all.png")
    # unknown chips & recheck one
    unk = page.evaluate("""() => {
      const btns=[...document.querySelectorAll('main button')].filter(b=>/重查|Recheck/i.test(b.getAttribute('title')||b.getAttribute('aria-label')||b.textContent||''));
      return btns.length;
    }""")
    findings["unknown_recheck_buttons"] = unk
    if unk:
        page.screenshot(path=f"{SHOTS}/B4-before-recheck.png")
        page.evaluate("""() => { const b=[...document.querySelectorAll('main button')].filter(b=>/重查|Recheck/i.test(b.getAttribute('title')||b.getAttribute('aria-label')||b.textContent||'')); b[0].click(); }""")
        time.sleep(8)
        unk2 = page.evaluate("""() => [...document.querySelectorAll('main button')].filter(b=>/重查|Recheck/i.test(b.getAttribute('title')||b.getAttribute('aria-label')||b.textContent||'')).length""")
        findings["unknown_after_recheck"] = unk2
        page.screenshot(path=f"{SHOTS}/B4b-after-recheck.png")

    page.close()

findings["console_errors_b"] = console_errors
json.dump(findings, open(sys.argv[1], "w"), ensure_ascii=False, indent=2)
print(json.dumps(findings, ensure_ascii=False, indent=1)[:6000])
