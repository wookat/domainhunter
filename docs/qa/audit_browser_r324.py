import json, re, sys, time
from playwright.sync_api import sync_playwright

RE_EXACT = re.compile("精确核验|Exact check")
RE_MORE = re.compile("查更多后缀|more TLDs")
DONE_JS = "() => { const e=[...document.querySelectorAll('main *')].find(x=>x.childElementCount===0&&/核验完成|Check complete/.test(x.textContent||'')); return e?e.textContent.trim():null; }"

BASE = "https://hunt.zalize.com"
SHOTS = "screenshots-r324"
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

    # usage pre
    page.goto(BASE + "/", wait_until="networkidle")
    findings["usage_pre"] = page.evaluate("async () => await (await fetch('/api/usage')).json()")

    page.evaluate("localStorage.setItem('domainhunter:lang','zh')")
    page.reload(wait_until="networkidle")
    time.sleep(1)
    shot(page, "A1-home-zh")

    # B. quick-check exact tab: single random
    page.get_by_role("button", name=RE_EXACT).first.click()
    time.sleep(0.3)
    inp = page.locator("main textarea, main input[type=text]").first
    inp.fill("qzxvkw9r324")
    time.sleep(0.3)
    inp.press("Enter")
    s = None
    for _ in range(60):
        s = page.evaluate(DONE_JS)
        if s: break
        time.sleep(1)
    findings["quick_single"] = s
    shot(page, "B1-quickcheck-single")

    # All (210 tld + com.cn = 211)
    more_btn = page.get_by_role("button", name=RE_MORE)
    if more_btn.count():
        more_btn.first.click()
        s2 = None
        for _ in range(300):
            s2 = page.evaluate(DONE_JS)
            if s2 and "211" in s2: break
            time.sleep(1)
        findings["quick_all"] = s2
        shot(page, "B3-quickcheck-all")

    # C. /prices — rows, live/static, CNY口径, sort
    page.goto(BASE + "/prices", wait_until="networkidle"); time.sleep(2)
    findings["prices_rows_zh"] = page.evaluate("() => document.querySelectorAll('main a[href^=\"/?tld=\"]').length")
    rowdata = page.evaluate("""() => {
      const anchors=[...document.querySelectorAll('main a[href^="/?tld="]')];
      const out=[];
      for (const a of anchors){
        let row=a; for(let i=0;i<6&&row&&!( /\\$\\d/.test(row.textContent||''));i++) row=row.parentElement;
        if(!row) continue;
        const t=row.textContent||'';
        const usd=[...t.matchAll(/(≈?)\\$([0-9.]+)/g)].map(m=>({approx:m[1]==='≈',v:parseFloat(m[2])}));
        const cny=[...t.matchAll(/¥\\s?([0-9.]+)/g)].map(m=>parseFloat(m[1]));
        out.push({tld:a.getAttribute('href').split('=')[1], usd, cny});
      }
      return out;
    }""")
    live_rows = [r for r in rowdata if r["usd"] and not r["usd"][0]["approx"]]
    static_rows = [r for r in rowdata if r["usd"] and r["usd"][0]["approx"]]
    findings["prices_live_count"] = len(live_rows)
    findings["prices_static_count"] = len(static_rows)
    mism = []
    for r in live_rows:
        for u, c in zip([x["v"] for x in r["usd"]], r["cny"]):
            if abs(round(u * 7.2) - c) > 1:
                mism.append({"tld": r["tld"], "usd": u, "cny": c})
    findings["prices_live_cny_mismatch"] = mism[:10]
    regs = [r["usd"][0]["v"] for r in rowdata if r["usd"]]
    findings["prices_default_sorted_asc"] = regs == sorted(regs)
    # new R321 TLD static rows vs types.ts values
    expect = {"credit": [48, 597], "loans": [78, 671], "investments": [59, 745], "holdings": [374, 374], "mortgage": [59, 360], "computer": [130, 226]}
    got = {r["tld"]: r["cny"][:2] for r in rowdata if r["tld"] in expect}
    findings["prices_new_tld_static"] = {"expected": expect, "got": got, "match": all(got.get(k) == v for k, v in expect.items())}
    shot(page, "C1-prices-zh")
    try:
        page.get_by_role("button", name=re.compile("^(后缀|TLD)")).first.click()
        time.sleep(0.8)
        tlds = page.evaluate("() => [...document.querySelectorAll('main a[href^=\"/?tld=\"]')].map(a=>a.getAttribute('href').split('=')[1])")
        findings["prices_tld_sorted"] = tlds == sorted(tlds)
        shot(page, "C3-prices-sort-tld")
    except Exception as e:
        findings["prices_sort_error"] = str(e)[:200]
    page.goto(BASE + "/prices?lang=en", wait_until="networkidle"); time.sleep(2)
    findings["prices_rows_en"] = page.evaluate("() => document.querySelectorAll('main a[href^=\"/?tld=\"]').length")
    shot(page, "C2-prices-en")

    # D. hubs (browser-side dedup counts) + footer counts
    for path, key, prefix in [("/tld", "tld_hub_links", "/tld/"), ("/guide", "guide_hub_links", "/guide/"), ("/vs", "vs_hub_links", "/vs/")]:
        page.goto(BASE + path, wait_until="networkidle"); time.sleep(1)
        findings[key] = page.evaluate(f"() => new Set([...document.querySelectorAll('main a[href^=\"{prefix}\"]')].map(a=>a.getAttribute('href').split('?')[0])).size")
        shot(page, "D-" + key)
    page.goto(BASE + "/", wait_until="networkidle"); time.sleep(1)
    findings["footer_counts"] = page.evaluate("() => [...document.querySelectorAll('footer a')].map(a=>a.textContent.trim()).filter(t=>/\\d{3}/.test(t))")
    shot(page, "D4-footer")

    # E. new content pages (R321/R322) screenshots
    for path, name in [
        ("/tld/credit", "E1-tld-credit-zh"), ("/tld/mortgage?lang=en", "E2-tld-mortgage-en"),
        ("/guide/shortvideo", "E3-guide-shortvideo-zh"), ("/guide/newsmedia?lang=en", "E4-guide-newsmedia-en"),
    ]:
        page.goto(BASE + path, wait_until="networkidle"); time.sleep(0.8)
        shot(page, name)

    # G. 404 + /mcp doc page
    page.goto(BASE + "/nonexistent-r324", wait_until="networkidle"); shot(page, "G1-404-toplevel")
    findings["404_status"] = page.evaluate("async () => (await fetch('/nonexistent-r324')).status")
    findings["404_tld_status"] = page.evaluate("async () => (await fetch('/tld/notatld-r324')).status")
    page.goto(BASE + "/mcp", wait_until="networkidle"); time.sleep(0.5); shot(page, "G3-mcp-doc")
    findings["mcp_doc_status"] = page.evaluate("async () => (await fetch('/mcp')).status")

    # H. share: create -> live UI -> revoke -> 410
    created = page.evaluate("""async () => {
      const r = await fetch('/api/share', {method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({items:[{domain:'qzxvkw9r324a.com'},{domain:'google.com'}]})});
      return {status: r.status, body: await r.json()};
    }""")
    findings["share_create"] = {"status": created["status"], "id": created["body"].get("id"), "has_token": bool(created["body"].get("revokeToken"))}
    sid = created["body"].get("id"); tok = created["body"].get("revokeToken")
    page.goto(f"{BASE}/s/{sid}", wait_until="networkidle"); time.sleep(1)
    findings["share_live_domains"] = page.evaluate("() => [...document.querySelectorAll('main *')].filter(x=>x.childElementCount===0&&/qzxvkw9r324a\\.com|google\\.com/.test(x.textContent||'')).length")
    shot(page, "H1-share-live")
    status = page.evaluate("""async ([sid, tok]) => {
      const r = await fetch(`/api/share/${sid}`, {method:'DELETE', headers:{'Content-Type':'application/json'}, body: JSON.stringify({token: tok})});
      const g = await fetch(`/api/share/${sid}`);
      return {del: r.status, getAfter: g.status};
    }""", [sid, tok])
    findings["share_revoke"] = status
    page.goto(f"{BASE}/s/{sid}", wait_until="networkidle"); time.sleep(1)
    findings["share_revoked_ui"] = page.evaluate("() => [...document.querySelectorAll('main *')].some(x=>/已失效|no longer active|不再有效/.test(x.textContent||''))")
    shot(page, "H2-share-revoked")

    # I. light/dark
    page.goto(BASE + "/", wait_until="networkidle")
    bg0 = page.evaluate("() => getComputedStyle(document.body).backgroundColor")
    page.evaluate("""() => { const b=[...document.querySelectorAll('button')].find(x=>/toggle|主题|theme|light|dark/i.test(x.getAttribute('aria-label')||'')); if(b) b.click(); }""")
    time.sleep(0.5)
    bg1 = page.evaluate("() => getComputedStyle(document.body).backgroundColor")
    page.reload(wait_until="networkidle")
    bg2 = page.evaluate("() => getComputedStyle(document.body).backgroundColor")
    shot(page, "I1-theme-toggled")
    page.evaluate("""() => { const b=[...document.querySelectorAll('button')].find(x=>/toggle|主题|theme|light|dark/i.test(x.getAttribute('aria-label')||'')); if(b) b.click(); }""")
    time.sleep(0.5)
    bg3 = page.evaluate("() => getComputedStyle(document.body).backgroundColor")
    findings["theme"] = {"initial": bg0, "toggled": bg1, "persist_after_reload": bg2, "back": bg3}

    # J. keyboard accessibility spot-check: Tab through header, skip link / focus visible
    page.goto(BASE + "/", wait_until="networkidle"); time.sleep(0.5)
    seq = []
    for _ in range(8):
        page.keyboard.press("Tab")
        time.sleep(0.1)
        seq.append(page.evaluate("() => { const e=document.activeElement; return e ? (e.tagName + ':' + (e.getAttribute('aria-label')||e.textContent||'').trim().slice(0,30)) : null; }"))
    findings["keyboard_tab_seq"] = seq
    findings["keyboard_focus_visible"] = page.evaluate("() => { const e=document.activeElement; const s=getComputedStyle(e); return {outline: s.outlineStyle !== 'none' || s.boxShadow !== 'none'}; }")
    shot(page, "J1-keyboard-focus")

    # K. 375px
    mob = {}
    cdp = ctx.new_cdp_session(page)
    cdp.send("Emulation.setDeviceMetricsOverride", {"width": 375, "height": 812, "deviceScaleFactor": 2, "mobile": True})
    for path, name in [("/", "K1-375-home"), ("/prices", "K2-375-prices"), ("/tld/credit", "K3-375-tld-credit"), ("/vs", "K4-375-vs"), ("/guide/shortvideo", "K5-375-guide-shortvideo")]:
        page.goto(BASE + path, wait_until="networkidle"); time.sleep(1)
        mob[path] = page.evaluate("() => document.documentElement.scrollWidth")
        shot(page, name)
    cdp.send("Emulation.clearDeviceMetricsOverride")
    findings["mobile_375_scrollWidth"] = mob

    # usage post
    page.goto(BASE + "/", wait_until="networkidle")
    findings["usage_post"] = page.evaluate("async () => await (await fetch('/api/usage')).json()")
    findings["usage_equal"] = findings["usage_pre"] == findings["usage_post"]

    page.close()

findings["console_errors"] = console_errors
json.dump(findings, open(sys.argv[1], "w"), ensure_ascii=False, indent=2)
print(json.dumps(findings, ensure_ascii=False, indent=1)[:8000])
