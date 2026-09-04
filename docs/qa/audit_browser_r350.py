import json, re, sys, time
from playwright.sync_api import sync_playwright

RE_EXACT = re.compile("精确核验|Exact check")
RE_MORE = re.compile("查更多后缀|more TLDs")
DONE_JS = "() => { const e=[...document.querySelectorAll('main *')].find(x=>x.childElementCount===0&&/核验完成|Check complete/.test(x.textContent||'')); return e?e.textContent.trim():null; }"

BASE = "https://hunt.zalize.com"
SHOTS = "screenshots-r350"
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

    # usage pre (R339 observability keys)
    page.goto(BASE + "/", wait_until="networkidle")
    findings["usage_pre"] = page.evaluate("async () => await (await fetch('/api/usage')).json()")
    findings["usage_keys_present"] = {k: (k in findings["usage_pre"]) for k in ["pricesLastOk", "pricesLastFail", "cronLast", "indexnowLast"]}
    findings["prices_api"] = page.evaluate("async () => { const j = await (await fetch('/api/prices')).json(); return {stale: j.stale, tldCount: j.tldCount, fetchedAt: j.fetchedAt, keys: Object.keys(j.prices||{}).length}; }")

    page.evaluate("localStorage.setItem('domainhunter:lang','zh')")
    page.reload(wait_until="networkidle")
    time.sleep(1)
    shot(page, "A1-home-zh")

    # B. quick-check exact tab: single random
    page.get_by_role("button", name=RE_EXACT).first.click()
    time.sleep(0.3)
    inp = page.locator("main textarea, main input[type=text]").first
    inp.fill("qzxvkw9r350")
    time.sleep(0.3)
    inp.press("Enter")
    s = None
    for _ in range(60):
        s = page.evaluate(DONE_JS)
        if s: break
        time.sleep(1)
    findings["quick_single"] = s
    shot(page, "B1-quickcheck-single")

    # All (234 tld + com.cn = 235)
    more_btn = page.get_by_role("button", name=RE_MORE)
    if more_btn.count():
        more_btn.first.click()
        s2 = None
        for _ in range(300):
            s2 = page.evaluate(DONE_JS)
            if s2 and "247" in s2: break
            time.sleep(1)
        findings["quick_all"] = s2
        shot(page, "B3-quickcheck-all")

    # C. /prices — rows, live/static, CNY口径, new R337 TLD static values
    page.goto(BASE + "/prices", wait_until="networkidle"); time.sleep(2)
    findings["prices_rows_zh"] = page.evaluate("() => document.querySelectorAll('main a[href^=\"/?tld=\"]').length")
    rowdata = page.evaluate("""() => {
      const anchors=[...document.querySelectorAll('main a[href^="/?tld="]')];
      const out=[];
      for (const a of anchors){
        let row=a; for(let i=0;i<6&&row&&!( /[¥$]\\d/.test(row.textContent||''));i++) row=row.parentElement;
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
    # R337 new TLD static rows vs types.ts values (first/renew CNY)
    expect = {"auction": [78, 204], "deals": [63, 204], "coupons": [78, 366], "discount": [63, 204], "furniture": [88, 700], "lighting": [41, 143]}
    got = {r["tld"]: r["cny"][:2] for r in rowdata if r["tld"] in expect}
    findings["prices_new_tld_static"] = {"expected": expect, "got": got, "match": all(got.get(k) == v for k, v in expect.items())}
    findings["prices_row_tld_hrefs"] = page.evaluate("""() => {
      const slugs=["auction","deals","coupons","discount","furniture","lighting"];
      const out={};
      for (const s of slugs) out[s] = !!document.querySelector(`main a[href^="/tld/${s}?"] , main a[href="/tld/${s}"]`);
      return out;
    }""")
    shot(page, "C1-prices-zh")

    # D. hubs (browser-side dedup counts) + footer counts
    for path, key, prefix in [("/tld", "tld_hub_links", "/tld/"), ("/guide", "guide_hub_links", "/guide/"), ("/vs", "vs_hub_links", "/vs/")]:
        page.goto(BASE + path, wait_until="networkidle"); time.sleep(1)
        findings[key] = page.evaluate(f"() => new Set([...document.querySelectorAll('main a[href^=\"{prefix}\"]')].map(a=>a.getAttribute('href').split('?')[0])).size")
        shot(page, "D-" + key)
    page.goto(BASE + "/", wait_until="networkidle"); time.sleep(1)
    findings["footer_counts"] = page.evaluate("() => [...document.querySelectorAll('footer a')].map(a=>a.textContent.trim()).filter(t=>/\\d{3}/.test(t))")
    shot(page, "D4-footer")

    # E. new content pages screenshots (R337 TLD + R340 guides)
    for path, name in [
        ("/tld/auction", "E1-tld-auction-zh"), ("/tld/lighting?lang=en", "E2-tld-lighting-en"),
        ("/guide/electrician", "E3-guide-electrician-zh"), ("/guide/motorcycleparts?lang=en", "E4-guide-motorcycleparts-en"),
        ("/vs/careers-vs-work", "E5-vs-careers-vs-work-zh"), ("/vs/parts-vs-repair?lang=en", "E6-vs-parts-vs-repair-en"),
    ]:
        page.goto(BASE + path, wait_until="networkidle"); time.sleep(0.8)
        shot(page, name)

    # F. home templates: chips +N button + prefill via ?tpl=slug (never submit)
    tpl_res = {}
    for slug in ["electrician", "landscaping", "painting", "jobboard", "restaurantsupply", "motorcycleparts"]:
        page.goto(BASE + "/?tpl=" + slug, wait_until="networkidle"); time.sleep(0.8)
        tpl_res[slug] = page.evaluate("() => { const ta=document.querySelector('main textarea'); return ta ? ta.value.slice(0,40) : null; }")
    findings["templates_prefill"] = tpl_res
    page.goto(BASE + "/", wait_until="networkidle"); time.sleep(0.8)
    findings["templates_more_chip"] = page.evaluate("() => { const b=[...document.querySelectorAll('main button')].find(x=>/^\\+\\d+/.test(x.textContent.trim())); return b ? b.textContent.trim() : null; }")
    shot(page, "F1-home-templates")

    # G. 404 + /mcp doc page
    page.goto(BASE + "/nonexistent-r350", wait_until="networkidle"); shot(page, "G1-404-toplevel")
    findings["404_status"] = page.evaluate("async () => (await fetch('/nonexistent-r350')).status")
    findings["404_tld_status"] = page.evaluate("async () => (await fetch('/tld/notatld-r350')).status")
    findings["404_guide_status"] = page.evaluate("async () => (await fetch('/guide/notaguide-r350')).status")
    findings["404_vs_status"] = page.evaluate("async () => (await fetch('/vs/nota-vs-page-r350')).status")
    page.goto(BASE + "/mcp", wait_until="networkidle"); time.sleep(0.5); shot(page, "G3-mcp-doc")
    findings["mcp_doc_status"] = page.evaluate("async () => (await fetch('/mcp')).status")
    findings["mcp_doc_tldcount"] = page.evaluate("() => { const t=document.querySelector('main') ? document.querySelector('main').innerText : ''; const m=t.match(/(\\d{3})/); return m ? m[1] : null; }")
    findings["mcp_tld_prices"] = page.evaluate("""async () => {
      const r = await fetch('/mcp', {method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({jsonrpc:'2.0', id:1, method:'tools/call', params:{name:'tld_prices', arguments:{}}})});
      const j = await r.json();
      try { const c = JSON.parse(j.result.content[0].text); return {tldCount: c.tldCount, priceKeys: Object.keys(c.prices).length}; } catch(e) { return {err: String(e).slice(0,100)}; }
    }""")

    # H. share: create -> live UI -> revoke -> 410
    created = page.evaluate("""async () => {
      const r = await fetch('/api/share', {method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({items:[{domain:'qzxvkw9r350a.com'},{domain:'google.com'}]})});
      return {status: r.status, body: await r.json()};
    }""")
    findings["share_create"] = {"status": created["status"], "id": created["body"].get("id"), "has_token": bool(created["body"].get("revokeToken"))}
    sid = created["body"].get("id"); tok = created["body"].get("revokeToken")
    page.goto(f"{BASE}/s/{sid}", wait_until="networkidle"); time.sleep(1)
    findings["share_live_domains"] = page.evaluate("() => { const t=document.querySelector('main') ? document.querySelector('main').innerText : ''; return {d1: t.includes('qzxvkw9r350a.com'), d2: t.includes('google.com')}; }")
    shot(page, "H1-share-live")
    status = page.evaluate("""async ([sid, tok]) => {
      const r = await fetch(`/api/share/${sid}`, {method:'DELETE', headers:{'Content-Type':'application/json'}, body: JSON.stringify({token: tok})});
      const g = await fetch(`/api/share/${sid}`);
      const g2 = await fetch(`/api/share/${sid}`);
      const body = await g2.text();
      return {del: r.status, getAfter: g.status, revokedBodyHasItems: body.includes('qzxvkw9r350a')};
    }""", [sid, tok])
    findings["share_revoke"] = status
    page.goto(f"{BASE}/s/{sid}", wait_until="networkidle"); time.sleep(1)
    findings["share_revoked_ui"] = page.evaluate("() => [...document.querySelectorAll('main *')].some(x=>/已失效|no longer active|不再有效/.test(x.textContent||''))")
    shot(page, "H2-share-revoked")

    # I. light/dark
    page.goto(BASE + "/", wait_until="networkidle")
    bg0 = page.evaluate("() => getComputedStyle(document.body).backgroundColor")
    page.evaluate("""() => { const b=[...document.querySelectorAll('button')].find(x=>/toggle|主题|theme|light|dark/i.test(x.getAttribute('aria-label')||x.getAttribute('title')||'')); if(b) b.click(); }""")
    time.sleep(0.5)
    bg1 = page.evaluate("() => getComputedStyle(document.body).backgroundColor")
    page.reload(wait_until="networkidle")
    bg2 = page.evaluate("() => getComputedStyle(document.body).backgroundColor")
    shot(page, "I1-theme-toggled")
    page.evaluate("""() => { const b=[...document.querySelectorAll('button')].find(x=>/toggle|主题|theme|light|dark/i.test(x.getAttribute('aria-label')||x.getAttribute('title')||'')); if(b) b.click(); }""")
    time.sleep(0.5)
    bg3 = page.evaluate("() => getComputedStyle(document.body).backgroundColor")
    findings["theme"] = {"initial": bg0, "toggled": bg1, "persist_after_reload": bg2, "back": bg3}

    # J. 375px
    mob = {}
    cdp = ctx.new_cdp_session(page)
    cdp.send("Emulation.setDeviceMetricsOverride", {"width": 375, "height": 812, "deviceScaleFactor": 2, "mobile": True})
    for path, name in [("/", "K1-375-home"), ("/prices", "K2-375-prices"), ("/tld/auction", "K3-375-tld-auction"), ("/vs/careers-vs-work", "K4-375-vs-careers"), ("/guide/electrician", "K5-375-guide-electrician")]:
        page.goto(BASE + path, wait_until="networkidle"); time.sleep(1)
        mob[path] = page.evaluate("() => document.documentElement.scrollWidth")
        shot(page, name)
    cdp.send("Emulation.clearDeviceMetricsOverride")
    findings["mobile_375_scrollWidth"] = mob

    # tld page vs /prices same-source check (browser-rendered): compare hair inline price on tld page
    page.goto(BASE + "/tld/auction", wait_until="networkidle"); time.sleep(1)
    findings["tld_auction_pricecard"] = page.evaluate("() => { const t=document.querySelector('main') ? document.querySelector('main').innerText : ''; const m=t.match(/静态参考价：首年 ¥\\d+ · 续费 ¥\\d+\\/年[^\\n]*/); return m ? m[0] : null; }")

    # usage post
    page.goto(BASE + "/", wait_until="networkidle")
    findings["usage_post"] = page.evaluate("async () => await (await fetch('/api/usage')).json()")
    findings["usage_days_equal"] = findings["usage_pre"]["days"] == findings["usage_post"]["days"]

    page.close()

findings["console_errors"] = console_errors
json.dump(findings, open(sys.argv[1], "w"), ensure_ascii=False, indent=2)
print(json.dumps(findings, ensure_ascii=False, indent=1)[:9000])
