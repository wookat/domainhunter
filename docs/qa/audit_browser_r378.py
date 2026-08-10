import json, re, sys, time, urllib.request
from playwright.sync_api import sync_playwright

RE_EXACT = re.compile("精确核验|Exact check")
RE_MORE = re.compile("查更多后缀|more TLDs")
DONE_JS = "() => { const e=[...document.querySelectorAll('main *')].find(x=>x.childElementCount===0&&/核验完成|Check complete/.test(x.textContent||'')); return e?e.textContent.trim():null; }"

BASE = "https://hunt.zalize.com"
SHOTS = "screenshots-r378"
UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"}
findings = {}
console_errors = []

NEW_TLDS = ["vodka", "casino", "bet", "poker", "futbol", "moda"]
NEW_GUIDES = ["datingapp", "singlesevents", "luxuryresale", "organicfood", "permanentmakeup", "homedecor"]
NEW_VS = ["singles-vs-dating", "dating-vs-love", "luxury-vs-vip", "organic-vs-bio", "tattoo-vs-ink", "casa-vs-house"]


def fetch(path):
    req = urllib.request.Request(BASE + path, headers=UA)
    with urllib.request.urlopen(req) as r:
        return r.status, r.read().decode("utf-8", "replace")


def seo_probe(html):
    return {
        "title": (re.search(r"<title>(.*?)</title>", html, re.S) or [None, None])[1],
        "canonical": (re.search(r'<link rel="canonical" href="([^"]+)"', html) or [None, None])[1],
        "html_lang": (re.search(r'<html[^>]*lang="([^"]+)"', html) or [None, None])[1],
        "og_count": len(re.findall(r'<meta property="og:', html)),
        "jsonld_types": re.findall(r'"@type"\s*:\s*"([A-Za-z]+)"', html),
        "has_faq_jsonld": '"FAQPage"' in html,
        "bytes": len(html.encode()),
    }


def attach_console(page):
    page.on("console", lambda m: console_errors.append({"type": m.type, "text": m.text[:200], "url": page.url}) if m.type == "error" else None)
    page.on("pageerror", lambda e: console_errors.append({"type": "pageerror", "text": str(e)[:200], "url": page.url}))


def shot(page, name):
    page.screenshot(path=f"{SHOTS}/{name}.png", full_page=False)


# ---- HTTP-side checks: sitemap x3 cache-busting, llms.txt, robots ----
counts_json = json.load(open("../../scripts/content-counts.json"))
expected = {k: set(counts_json[k]["slugs"]) for k in ("tld", "guide", "vs")}
sitemap_samples = []
for i in range(3):
    _, xml = fetch(f"/sitemap.xml?cb=r378{i}{int(time.time())}")
    locs = re.findall(r"<loc>(.*?)</loc>", xml)
    sitemap_samples.append(len(locs))
    time.sleep(1)
findings["sitemap_loc_samples"] = sitemap_samples
findings["sitemap_dup_locs"] = len(locs) - len(set(locs))
cat = {"tld": set(), "guide": set(), "vs": set(), "core": set()}
for u in set(locs):
    m = re.match(r"https://hunt\.zalize\.com/(tld|guide|vs)/([^/?]+)$", u)
    if m:
        cat[m.group(1)].add(m.group(2))
    else:
        cat["core"].add(u)
findings["sitemap_cat_counts"] = {k: len(v) for k, v in cat.items()}
findings["sitemap_vs_counts_json"] = {k: cat[k] == expected[k] for k in ("tld", "guide", "vs")}
_, llms = fetch("/llms.txt")
lt = {k: set(re.findall(rf"/{k}/([a-z0-9-]+)", llms)) for k in ("tld", "guide", "vs")}
findings["llms_counts"] = {k: len(v) for k, v in lt.items()}
findings["llms_vs_sitemap_equal"] = {k: lt[k] == cat[k] for k in ("tld", "guide", "vs")}
rs, robots = fetch("/robots.txt")
findings["robots"] = {"status": rs, "has_sitemap": "sitemap.xml" in robots, "gptbot": "GPTBot" in robots}

# ---- new content SEO deep probe (zh + en) ----
seo_pages = [
    "/guide/datingapp", "/guide/datingapp?lang=en",
    "/guide/homedecor", "/guide/homedecor?lang=en",
    "/tld/vodka", "/tld/vodka?lang=en",
    "/tld/moda", "/tld/moda?lang=en",
    "/vs/singles-vs-dating", "/vs/singles-vs-dating?lang=en",
    "/vs/casa-vs-house", "/vs/casa-vs-house?lang=en",
]
seo = {}
for p in seo_pages:
    st, html = fetch(p)
    seo[p] = {"status": st, **seo_probe(html)}
findings["seo_new_pages"] = seo
# all new pages status probe (zh + en)
status_probe = {}
for p in [f"/guide/{s}" for s in NEW_GUIDES] + [f"/tld/{s}" for s in NEW_TLDS] + [f"/vs/{s}" for s in NEW_VS]:
    for q in ("", "?lang=en"):
        st, html = fetch(p + q)
        status_probe[p + q] = {"status": st, "bytes": len(html.encode()), "faq": '"FAQPage"' in html}
findings["new_pages_status"] = status_probe

with sync_playwright() as p:
    b = p.chromium.connect_over_cdp("http://localhost:29229")
    ctx = b.contexts[0]
    page = ctx.new_page()
    attach_console(page)

    # usage pre
    page.goto(BASE + "/", wait_until="networkidle")
    findings["usage_pre"] = page.evaluate("async () => await (await fetch('/api/usage')).json()")
    findings["usage_keys_present"] = {k: (k in findings["usage_pre"]) for k in ["pricesLastOk", "pricesLastFail", "cronLast", "indexnowLast"]}
    findings["prices_api"] = page.evaluate("async () => { const j = await (await fetch('/api/prices')).json(); return {stale: j.stale, tldCount: j.tldCount, fetchedAt: j.fetchedAt, keys: Object.keys(j.prices||{}).length}; }")

    page.evaluate("localStorage.setItem('domainhunter:lang','zh')")
    page.reload(wait_until="networkidle")
    time.sleep(1)
    shot(page, "A1-home-zh")

    # quick-check exact: single random then All
    page.get_by_role("button", name=RE_EXACT).first.click()
    time.sleep(0.3)
    inp = page.locator("main textarea, main input[type=text]").first
    inp.fill("qzxvkw9r378")
    time.sleep(0.3)
    inp.press("Enter")
    s = None
    for _ in range(60):
        s = page.evaluate(DONE_JS)
        if s: break
        time.sleep(1)
    findings["quick_single"] = s
    shot(page, "B1-quickcheck-single")
    more_btn = page.get_by_role("button", name=RE_MORE)
    if more_btn.count():
        more_btn.first.click()
        s2 = None
        for _ in range(300):
            s2 = page.evaluate(DONE_JS)
            if s2 and "289" in s2: break
            time.sleep(1)
        findings["quick_all"] = s2
        shot(page, "B3-quickcheck-all")

    # template button prefill (allowed, no submit)
    page.goto(BASE + "/", wait_until="networkidle"); time.sleep(0.8)
    findings["template_prefill"] = page.evaluate("""() => {
      const chips=[...document.querySelectorAll('main button')].filter(x=>x.textContent.trim().length>1 && !/^\\+\\d+/.test(x.textContent.trim()));
      const c = chips.find(x=>/咖啡|coffee|科技|电商/i.test(x.textContent));
      if(!c) return null;
      const label=c.textContent.trim(); c.click();
      const ta=document.querySelector('main textarea');
      return {chip: label, filled: ta ? ta.value.slice(0,80) : null};
    }""")
    shot(page, "B4-template-prefill")

    # /prices rows + R367 new TLD static values + inline hrefs
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
    findings["prices_static_slugs"] = sorted(r["tld"] for r in static_rows)
    expect = {"vodka": [189, 189], "casino": [56, 931], "bet": [69, 151], "poker": [59, 389], "futbol": [41, 100], "moda": [78, 241]}
    got = {r["tld"]: r["cny"][:2] for r in rowdata if r["tld"] in expect}
    findings["prices_new_tld_rows"] = {"expected_static_fallback": expect, "got": got}
    findings["prices_row_tld_hrefs"] = page.evaluate("""() => {
      const slugs=["vodka","casino","bet","poker","futbol","moda"];
      const out={};
      for (const s of slugs) out[s] = !!document.querySelector(`main a[href^="/tld/${s}?"] , main a[href="/tld/${s}"]`);
      return out;
    }""")
    shot(page, "C1-prices-zh")

    # tld pages: price card (live or static fallback) + inline /prices href
    tldcards = {}
    for slug in expect:
        page.goto(BASE + f"/tld/{slug}", wait_until="networkidle"); time.sleep(0.8)
        tldcards[slug] = page.evaluate("""() => {
          const t=document.querySelector('main') ? document.querySelector('main').innerText : '';
          const m=t.match(/静态参考价：首年 ¥(\\d+) · 续费 ¥(\\d+)\\/年/);
          const link=!!document.querySelector('main a[href^="/prices"]');
          const live=t.match(/Porkbun[^\\n]{0,120}/);
          const usd=[...t.matchAll(/\\$([0-9.]+)/g)].map(m=>parseFloat(m[1]));
          return {first: m?+m[1]:null, renew: m?+m[2]:null, live_label: live?live[0]:null, usd: usd.slice(0,2), prices_href: link};
        }""")
    findings["tld_pricecards"] = tldcards
    shot(page, "C2-tld-moda-pricecard")
    # live price sanity on established TLDs
    page.goto(BASE + "/tld/com", wait_until="networkidle"); time.sleep(0.8)
    findings["tld_com_live"] = page.evaluate("() => { const t=document.querySelector('main')?document.querySelector('main').innerText:''; const m=t.match(/Porkbun[^\\n]{0,120}/); return m?m[0]:null; }")
    shot(page, "C3-tld-com-liveprice")

    # hubs + footer
    for path, key, prefix in [("/tld", "tld_hub_links", "/tld/"), ("/guide", "guide_hub_links", "/guide/"), ("/vs", "vs_hub_links", "/vs/")]:
        page.goto(BASE + path, wait_until="networkidle"); time.sleep(1)
        findings[key] = page.evaluate(f"() => new Set([...document.querySelectorAll('main a[href^=\"{prefix}\"]')].map(a=>a.getAttribute('href').split('?')[0])).size")
        shot(page, "D-" + key)
    page.goto(BASE + "/", wait_until="networkidle"); time.sleep(1)
    findings["footer_counts"] = page.evaluate("() => [...document.querySelectorAll('footer a')].map(a=>a.textContent.trim()).filter(t=>/\\d{3}/.test(t))")
    findings["footer_link_counts"] = page.evaluate("""() => {
      const out={};
      for (const pre of ["/tld/","/guide/","/vs/"]) out[pre]=new Set([...document.querySelectorAll(`footer a[href^="${pre}"]`)].map(a=>a.getAttribute('href').split('?')[0])).size;
      return out;
    }""")
    shot(page, "D4-footer")

    # new content page screenshots
    for path, name in [
        ("/guide/datingapp", "E1-guide-datingapp-zh"), ("/guide/homedecor?lang=en", "E2-guide-homedecor-en"),
        ("/tld/vodka", "E3-tld-vodka-zh"), ("/tld/moda?lang=en", "E4-tld-moda-en"),
        ("/vs/singles-vs-dating", "E5-vs-singles-vs-dating-zh"), ("/vs/casa-vs-house?lang=en", "E6-vs-casa-vs-house-en"),
    ]:
        page.goto(BASE + path, wait_until="networkidle"); time.sleep(0.8)
        shot(page, name)

    # home more chip (+262)
    page.goto(BASE + "/", wait_until="networkidle"); time.sleep(0.8)
    findings["templates_more_chip"] = page.evaluate("() => { const b=[...document.querySelectorAll('main button')].find(x=>/^\\+\\d+/.test(x.textContent.trim())); return b ? b.textContent.trim() : null; }")
    shot(page, "F1-home-templates")

    # tool pages: /why /shortlist /advanced
    for path, key, name in [("/why", "why_status", "G4-why"), ("/shortlist", "shortlist_status", "G5-shortlist"), ("/advanced", "advanced_status", "G6-advanced")]:
        page.goto(BASE + path, wait_until="networkidle"); time.sleep(0.8)
        findings[key] = page.evaluate(f"async () => (await fetch('{path}')).status")
        shot(page, name)

    # 404 + /mcp
    page.goto(BASE + "/nonexistent-r378", wait_until="networkidle"); shot(page, "G1-404-toplevel")
    findings["404_status"] = page.evaluate("async () => (await fetch('/nonexistent-r378')).status")
    findings["404_tld_status"] = page.evaluate("async () => (await fetch('/tld/notatld-r378')).status")
    findings["404_guide_status"] = page.evaluate("async () => (await fetch('/guide/notaguide-r378')).status")
    findings["404_vs_status"] = page.evaluate("async () => (await fetch('/vs/nota-vs-page-r378')).status")
    page.goto(BASE + "/mcp", wait_until="networkidle"); time.sleep(0.5); shot(page, "G3-mcp-doc")
    findings["mcp_doc_status"] = page.evaluate("async () => (await fetch('/mcp')).status")
    findings["mcp_doc_tldcount"] = page.evaluate("() => { const t=document.querySelector('main') ? document.querySelector('main').innerText : ''; const m=t.match(/(\\d{3})/); return m ? m[1] : null; }")
    findings["mcp_tld_prices"] = page.evaluate("""async () => {
      const r = await fetch('/mcp', {method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({jsonrpc:'2.0', id:1, method:'tools/call', params:{name:'tld_prices', arguments:{}}})});
      const j = await r.json();
      try { const c = JSON.parse(j.result.content[0].text); return {tldCount: c.tldCount, priceKeys: Object.keys(c.prices).length}; } catch(e) { return {err: String(e).slice(0,100)}; }
    }""")

    # share: create -> live -> revoke -> 410
    created = page.evaluate("""async () => {
      const r = await fetch('/api/share', {method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({items:[{domain:'qzxvkw9r378a.com'},{domain:'google.com'}]})});
      return {status: r.status, body: await r.json()};
    }""")
    findings["share_create"] = {"status": created["status"], "id": created["body"].get("id"), "has_token": bool(created["body"].get("revokeToken"))}
    sid = created["body"].get("id"); tok = created["body"].get("revokeToken")
    page.goto(f"{BASE}/s/{sid}", wait_until="networkidle"); time.sleep(1)
    findings["share_live_domains"] = page.evaluate("() => { const t=document.querySelector('main') ? document.querySelector('main').innerText : ''; return {d1: t.includes('qzxvkw9r378a.com'), d2: t.includes('google.com')}; }")
    shot(page, "H1-share-live")
    status = page.evaluate("""async ([sid, tok]) => {
      const r = await fetch(`/api/share/${sid}`, {method:'DELETE', headers:{'Content-Type':'application/json'}, body: JSON.stringify({token: tok})});
      const g = await fetch(`/api/share/${sid}`);
      const g2 = await fetch(`/api/share/${sid}`);
      const body = await g2.text();
      return {del: r.status, getAfter: g.status, revokedBodyHasItems: body.includes('qzxvkw9r378a')};
    }""", [sid, tok])
    findings["share_revoke"] = status
    page.goto(f"{BASE}/s/{sid}", wait_until="networkidle"); time.sleep(1)
    findings["share_revoked_ui"] = page.evaluate("() => [...document.querySelectorAll('main *')].some(x=>/已失效|no longer active|不再有效/.test(x.textContent||''))")
    shot(page, "H2-share-revoked")

    # light/dark
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

    # 375px
    mob = {}
    cdp = ctx.new_cdp_session(page)
    cdp.send("Emulation.setDeviceMetricsOverride", {"width": 375, "height": 812, "deviceScaleFactor": 2, "mobile": True})
    for path, name in [("/", "K1-375-home"), ("/prices", "K2-375-prices"), ("/tld/vodka", "K3-375-tld-vodka"), ("/vs/singles-vs-dating", "K4-375-vs-singles-vs-dating"), ("/guide/datingapp", "K5-375-guide-datingapp")]:
        page.goto(BASE + path, wait_until="networkidle"); time.sleep(1)
        mob[path] = page.evaluate("() => document.documentElement.scrollWidth")
        shot(page, name)
    cdp.send("Emulation.clearDeviceMetricsOverride")
    findings["mobile_375_scrollWidth"] = mob

    # usage post
    page.goto(BASE + "/", wait_until="networkidle")
    findings["usage_post"] = page.evaluate("async () => await (await fetch('/api/usage')).json()")
    findings["usage_days_equal"] = findings["usage_pre"]["days"] == findings["usage_post"]["days"]

    page.close()

findings["console_errors"] = console_errors
json.dump(findings, open(sys.argv[1], "w"), ensure_ascii=False, indent=2)
json.dump(findings["usage_pre"], open("usage-r378-pre.json", "w"), ensure_ascii=False, indent=2)
json.dump(findings["usage_post"], open("usage-r378-post.json", "w"), ensure_ascii=False, indent=2)
print(json.dumps(findings, ensure_ascii=False, indent=1)[:9000])
