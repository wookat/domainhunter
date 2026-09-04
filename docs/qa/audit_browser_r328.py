import json, re, sys, time
from playwright.sync_api import sync_playwright

RE_EXACT = re.compile("精确核验|Exact check")
RE_MORE = re.compile("查更多后缀|more TLDs")
DONE_JS = "() => { const e=[...document.querySelectorAll('main *')].find(x=>x.childElementCount===0&&/核验完成|Check complete/.test(x.textContent||'')); return e?e.textContent.trim():null; }"

BASE = "https://hunt.zalize.com"
SHOTS = "screenshots-r328"
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
    inp.fill("qzxvkw9r328")
    time.sleep(0.3)
    inp.press("Enter")
    s = None
    for _ in range(60):
        s = page.evaluate(DONE_JS)
        if s: break
        time.sleep(1)
    findings["quick_single"] = s
    shot(page, "B1-quickcheck-single")

    # All (216 tld + com.cn = 217)
    more_btn = page.get_by_role("button", name=RE_MORE)
    if more_btn.count():
        more_btn.first.click()
        s2 = None
        for _ in range(300):
            s2 = page.evaluate(DONE_JS)
            if s2 and "217" in s2: break
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
    expect = {"vet": [241, 241], "lawyer": [360, 360], "legal": [41, 412], "delivery": [37, 360], "recipes": [48, 449], "rent": [74, 374]}
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

    # E. new content pages (R325/R326/R323) screenshots
    for path, name in [
        ("/tld/vet", "E1-tld-vet-zh"), ("/tld/legal?lang=en", "E2-tld-legal-en"),
        ("/guide/fruitshop", "E3-guide-fruitshop-zh"), ("/guide/immigration?lang=en", "E4-guide-immigration-en"),
        ("/vs/credit-vs-finance", "E5-vs-credit-vs-finance-zh"),
    ]:
        page.goto(BASE + path, wait_until="networkidle"); time.sleep(0.8)
        shot(page, name)

    # F. home new TEMPLATES (R326): buttons render + prefill via ?q=slug (never submit)
    tpl_res = {}
    for slug in ["fruitshop", "seafood", "tailor", "equestrian", "archery", "immigration"]:
        page.goto(BASE + "/?tpl=" + slug, wait_until="networkidle"); time.sleep(0.8)
        tpl_res[slug] = page.evaluate("() => { const ta=document.querySelector('main textarea'); return ta ? ta.value.slice(0,40) : null; }")
    findings["templates_prefill"] = tpl_res
    page.goto(BASE + "/", wait_until="networkidle"); time.sleep(0.8)
    page.evaluate("() => { const b=[...document.querySelectorAll('main button')].find(x=>/^\\+\\d+/.test(x.textContent.trim())); if(b) b.click(); }")
    time.sleep(0.5)
    findings["templates_total_buttons"] = page.evaluate("() => [...document.querySelectorAll('main button')].filter(b=>/水果店|海鲜|服装定制|马术|射箭|移民/.test(b.textContent)).map(b=>b.textContent.trim())")
    shot(page, "F1-home-templates")

    # G. 404 + /mcp doc page
    page.goto(BASE + "/nonexistent-r328", wait_until="networkidle"); shot(page, "G1-404-toplevel")
    findings["404_status"] = page.evaluate("async () => (await fetch('/nonexistent-r328')).status")
    findings["404_tld_status"] = page.evaluate("async () => (await fetch('/tld/notatld-r328')).status")
    page.goto(BASE + "/mcp", wait_until="networkidle"); time.sleep(0.5); shot(page, "G3-mcp-doc")
    findings["mcp_doc_status"] = page.evaluate("async () => (await fetch('/mcp')).status")
    findings["mcp_tld_prices"] = page.evaluate("""async () => {
      const r = await fetch('/mcp', {method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({jsonrpc:'2.0', id:1, method:'tools/call', params:{name:'tld_prices', arguments:{}}})});
      const j = await r.json();
      try { const c = JSON.parse(j.result.content[0].text); return {tldCount: c.tldCount, priceKeys: Object.keys(c.prices).length}; } catch(e) { return {err: String(e).slice(0,100)}; }
    }""")

    # H. share: create -> live UI -> revoke -> 410
    created = page.evaluate("""async () => {
      const r = await fetch('/api/share', {method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({items:[{domain:'qzxvkw9r328a.com'},{domain:'google.com'}]})});
      return {status: r.status, body: await r.json()};
    }""")
    findings["share_create"] = {"status": created["status"], "id": created["body"].get("id"), "has_token": bool(created["body"].get("revokeToken"))}
    sid = created["body"].get("id"); tok = created["body"].get("revokeToken")
    page.goto(f"{BASE}/s/{sid}", wait_until="networkidle"); time.sleep(1)
    findings["share_live_domains"] = page.evaluate("() => [...document.querySelectorAll('main *')].filter(x=>x.childElementCount===0&&/qzxvkw9r328a\\.com|google\\.com/.test(x.textContent||'')).length")
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
    for path, name in [("/", "K1-375-home"), ("/prices", "K2-375-prices"), ("/tld/vet", "K3-375-tld-vet"), ("/vs", "K4-375-vs"), ("/guide/fruitshop", "K5-375-guide-fruitshop")]:
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
