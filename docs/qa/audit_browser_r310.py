import json, re, sys, time
from playwright.sync_api import sync_playwright

RE_EXACT = re.compile("精确核验|Exact check")
RE_CHECK = re.compile(r"直接核验|\.\* now")
RE_MORE = re.compile("查更多后缀|more TLDs")
DONE_JS = "() => { const e=[...document.querySelectorAll('main *')].find(x=>x.childElementCount===0&&/核验完成|Check complete/.test(x.textContent||'')); return e?e.textContent.trim():null; }"

BASE = "https://hunt.zalize.com"
SHOTS = "screenshots-r310"
findings = {}
console_errors = []


def attach_console(page):
    page.on("console", lambda m: console_errors.append({"type": m.type, "text": m.text[:200], "url": page.url}) if m.type == "error" else None)
    page.on("pageerror", lambda e: console_errors.append({"type": "pageerror", "text": str(e)[:200], "url": page.url}))


def shot(page, name):
    page.screenshot(path=f"{SHOTS}/{name}.png", full_page=False)


with sync_playwright() as p:
    b = p.chromium.connect_over_cdp("http://localhost:29229")
    ctx = b.contexts[0]
    page = ctx.new_page()
    attach_console(page)

    # A. home zh (force zh for zh-side checks; storage restored at end)
    page.goto(BASE + "/", wait_until="networkidle")
    page.evaluate("localStorage.setItem('domainhunter:lang','zh')")
    page.reload(wait_until="networkidle")
    time.sleep(1)
    chips = page.locator("main button", has_text="+").count()
    industry = page.evaluate("""() => {
      const btns = [...document.querySelectorAll('button')];
      const more = btns.find(b => /\\+\\d+/.test(b.textContent||''));
      return more ? more.textContent.trim() : null;
    }""")
    findings["home_more_chip"] = industry
    shot(page, "A1-home-zh")

    # R308 onboarding TTL tests
    ob = {}
    def banner_visible():
        return page.evaluate("""() => {
          const els=[...document.querySelectorAll('main *')];
          return !!els.find(e=>e.childElementCount===0 && /三步|3 steps|怎么用|How it works|新手|引导/.test(e.textContent||''));
        }""")
    page.evaluate("localStorage.removeItem('dh:onboardDismissed:v1')")
    page.reload(wait_until="networkidle"); time.sleep(0.5)
    ob["no_key_visible"] = banner_visible()
    shot(page, "M1-onboard-visible")
    # find close button of onboarding
    closed = page.evaluate("""() => {
      const btns=[...document.querySelectorAll('button[aria-label], button')];
      const c = btns.find(b => /关闭引导|Dismiss|close/i.test(b.getAttribute('aria-label')||'') );
      if (c) { c.click(); return c.getAttribute('aria-label'); }
      return null;
    }""")
    time.sleep(0.5)
    ob["close_btn"] = closed
    val = page.evaluate("localStorage.getItem('dh:onboardDismissed:v1')")
    ob["value_after_dismiss"] = val
    ob["value_is_ms_ts"] = bool(val and val.isdigit() and int(val) > 1e12)
    page.reload(wait_until="networkidle"); time.sleep(0.5)
    ob["hidden_after_dismiss"] = not banner_visible()
    # expired (31d ago)
    page.evaluate("localStorage.setItem('dh:onboardDismissed:v1', String(Date.now() - 31*24*3600*1000))")
    page.reload(wait_until="networkidle"); time.sleep(0.5)
    ob["visible_after_31d"] = banner_visible()
    ob["key_removed_after_expiry"] = page.evaluate("localStorage.getItem('dh:onboardDismissed:v1')") is None
    shot(page, "M2-onboard-after-31d")
    # legacy format "1"
    page.evaluate("localStorage.setItem('dh:onboardDismissed:v1','1')")
    page.reload(wait_until="networkidle"); time.sleep(0.5)
    ob["legacy_hidden"] = not banner_visible()
    lv = page.evaluate("localStorage.getItem('dh:onboardDismissed:v1')")
    ob["legacy_upgraded_to_ts"] = bool(lv and lv.isdigit() and int(lv) > 1e12)
    findings["onboarding_ttl"] = ob

    # B. quick-check exact tab
    page.goto(BASE + "/", wait_until="networkidle")
    page.get_by_role("button", name=RE_EXACT).first.click()
    time.sleep(0.3)
    shot(page, "B0-exact-tab")
    inp = page.locator("main textarea, main input[type=text]").first
    inp.fill("qzxvkw9r310")
    time.sleep(0.3)
    inp.press("Enter")
    s = None
    for _ in range(60):
        s = page.evaluate(DONE_JS)
        if s: break
        time.sleep(1)
    findings["quick_single"] = s
    shot(page, "B1-quickcheck-single")

    # more tlds (All)
    more_btn = page.get_by_role("button", name=RE_MORE)
    if more_btn.count():
        more_btn.first.click()
        s2 = None
        for _ in range(240):
            s2 = page.evaluate(DONE_JS)
            if s2 and "193" in s2: break
            time.sleep(1)
        findings["quick_all"] = s2
        shot(page, "B3-quickcheck-all")
        unknown = page.evaluate("() => [...document.querySelectorAll('main button[title], main [class*=chip], main span')].filter(x=>/unknown|未知/.test(x.textContent||'')).length")
        findings["quick_all_unknown_elems"] = unknown

    # baidu.com.cn
    page.goto(BASE + "/", wait_until="networkidle")
    page.get_by_role("button", name=RE_EXACT).first.click()
    inp = page.locator("main textarea, main input[type=text]").first
    inp.fill("baidu.com.cn")
    time.sleep(0.3)
    inp.press("Enter")
    s3 = None
    for _ in range(60):
        s3 = page.evaluate(DONE_JS)
        if s3: break
        time.sleep(1)
    findings["quick_baidu_com_cn"] = s3
    shot(page, "B2-quickcheck-baidu-com-cn")

    # C. /prices
    page.goto(BASE + "/prices", wait_until="networkidle"); time.sleep(1)
    findings["prices_rows_zh"] = page.evaluate("() => document.querySelectorAll('main a[href^=\"/?tld=\"]').length")
    shot(page, "C1-prices-zh")
    page.goto(BASE + "/prices?lang=en", wait_until="networkidle"); time.sleep(1)
    findings["prices_rows_en"] = page.evaluate("() => document.querySelectorAll('main a[href^=\"/?tld=\"]').length")
    shot(page, "C2-prices-en")

    # D. hubs counts
    for path, key, prefix in [("/tld", "tld_hub_links", "/tld/"), ("/guide", "guide_hub_links", "/guide/"), ("/vs", "vs_hub_links", "/vs/")]:
        page.goto(BASE + path + "?lang=en", wait_until="networkidle"); time.sleep(1)
        findings[key] = page.evaluate(f"() => new Set([...document.querySelectorAll('main a[href^=\"{prefix}\"]')].map(a=>a.getAttribute('href').split('?')[0])).size")
        shot(page, "D-" + key)

    # R308: guide zh hub cardLine <= 42 (incl. trailing period)
    page.goto(BASE + "/guide", wait_until="networkidle"); time.sleep(1)
    card = page.evaluate("""() => {
      const links=[...document.querySelectorAll('main a[href^="/guide/"]')];
      const res=[];
      for (const a of links){
        const ps=[...a.querySelectorAll('p,span,div')].filter(e=>e.childElementCount===0);
        let line=null;
        for (const e of ps){const t=(e.textContent||'').trim(); if(/[。…]$/.test(t)) line=t;}
        if (line) res.push({slug:a.getAttribute('href'), len:[...line].length, line});
      }
      const over=res.filter(r=>r.len>42);
      return {total:res.length, over:over.slice(0,10), max:Math.max(...res.map(r=>r.len))};
    }""")
    findings["guide_zh_cardline"] = card
    shot(page, "D2b-guide-hub-zh")

    # E. content pages
    for path, name in [("/tld/golf", "E1-tld-golf-zh"), ("/vs/soccer-vs-football?lang=en", "E2-vs-soccer-football-en"), ("/guide/runclub", "E3-guide-runclub-zh"), ("/vs/golf-vs-travel", "E4-vs-golf-travel-zh")]:
        page.goto(BASE + path, wait_until="networkidle"); time.sleep(0.8)
        shot(page, name)

    # F. tool pages
    page.goto(BASE + "/why", wait_until="networkidle"); shot(page, "F1-why")
    page.goto(BASE + "/shortlist", wait_until="networkidle"); time.sleep(0.5); shot(page, "F2-shortlist")
    page.goto(BASE + "/monitors", wait_until="networkidle"); time.sleep(0.5); shot(page, "F3-monitors")
    # advanced bulk (non-AI /api/search)
    page.goto(BASE + "/advanced", wait_until="networkidle"); time.sleep(0.5)
    ta = page.locator("main textarea").first
    ta.fill("google.com\nqzxvkw9r310b.com")
    time.sleep(0.5)
    try:
        page.get_by_role("button", name=re.compile(r"核验 \d+ 个域名|Check \d+ domains")).first.click(timeout=15000)
    except Exception as e:
        findings["advanced_bulk_click_error"] = str(e)[:200]
    time.sleep(8)
    findings["advanced_bulk_text"] = page.evaluate("() => [...document.querySelectorAll('main *')].filter(x=>x.childElementCount===0&&/google\\.com|qzxvkw9r310b/.test(x.textContent||'')).map(x=>x.textContent.trim()).slice(0,6)")
    shot(page, "F5-advanced-bulk")

    # G. 404
    page.goto(BASE + "/nonexistent-r310", wait_until="networkidle"); shot(page, "G1-404-toplevel")
    page.goto(BASE + "/tld/notatld-r310", wait_until="networkidle"); shot(page, "G2-404-tld")

    # H. share live + revoke
    sid, tok = open("/tmp/share_r310.txt").read().split()
    page.goto(f"{BASE}/s/{sid}", wait_until="networkidle"); time.sleep(1)
    findings["share_live_domains"] = page.evaluate("() => [...document.querySelectorAll('main *')].filter(x=>x.childElementCount===0&&/qzxvkw9r310a\\.com|google\\.com/.test(x.textContent||'')).length")
    shot(page, "H1-share-live")
    status = page.evaluate("""async ([sid, tok]) => {
      const r = await fetch(`/api/share/${sid}`, {method:'DELETE', headers:{'Content-Type':'application/json'}, body: JSON.stringify({token: tok})});
      const j = await r.json().catch(()=>null);
      const g = await fetch(`/api/share/${sid}`);
      return {del: r.status, delBody: j, getAfter: g.status};
    }""", [sid, tok])
    findings["share_revoke"] = status
    page.reload(wait_until="networkidle"); time.sleep(1)
    findings["share_revoked_ui"] = page.evaluate("() => [...document.querySelectorAll('main *')].some(x=>/no longer active|已失效|不再有效/.test(x.textContent||''))")
    shot(page, "H2-share-revoked")

    # I. light/dark
    page.goto(BASE + "/", wait_until="networkidle")
    bg0 = page.evaluate("() => getComputedStyle(document.body).backgroundColor")
    page.evaluate("""() => { const b=[...document.querySelectorAll('button')].find(x=>/toggle/i.test(x.getAttribute('aria-label')||'')||/主题|theme/i.test(x.getAttribute('aria-label')||'')||/light|dark/i.test(x.getAttribute('aria-label')||'')); if(b) b.click(); }""")
    time.sleep(0.5)
    bg1 = page.evaluate("() => getComputedStyle(document.body).backgroundColor")
    page.reload(wait_until="networkidle")
    bg2 = page.evaluate("() => getComputedStyle(document.body).backgroundColor")
    shot(page, "I1-theme-toggled")
    page.evaluate("""() => { const b=[...document.querySelectorAll('button')].find(x=>/toggle/i.test(x.getAttribute('aria-label')||'')||/主题|theme/i.test(x.getAttribute('aria-label')||'')||/light|dark/i.test(x.getAttribute('aria-label')||'')); if(b) b.click(); }""")
    time.sleep(0.5)
    bg3 = page.evaluate("() => getComputedStyle(document.body).backgroundColor")
    findings["theme"] = {"initial": bg0, "toggled": bg1, "persist_after_reload": bg2, "back": bg3}

    # K. 375px
    mob = {}
    cdp = ctx.new_cdp_session(page)
    cdp.send("Emulation.setDeviceMetricsOverride", {"width": 375, "height": 812, "deviceScaleFactor": 2, "mobile": True})
    for path, name in [("/", "K1-375-home"), ("/prices", "K2-375-prices"), ("/tld", "K3-375-tld"), ("/vs/golf-vs-club", "K4-375-vs-golf-club")]:
        page.goto(BASE + path, wait_until="networkidle"); time.sleep(1)
        mob[path] = page.evaluate("() => document.documentElement.scrollWidth")
        shot(page, name)
    cdp.send("Emulation.clearDeviceMetricsOverride")
    findings["mobile_375_scrollWidth"] = mob

    page.close()

findings["console_errors"] = console_errors
json.dump(findings, open(sys.argv[1], "w"), ensure_ascii=False, indent=2)
print(json.dumps(findings, ensure_ascii=False, indent=1)[:6000])
