import json, re, sys, time, urllib.request
from playwright.sync_api import sync_playwright

RE_EXACT = re.compile("精确核验|Exact check")
RE_MORE = re.compile("查更多后缀|more TLDs")
DONE_JS = "() => { const e=[...document.querySelectorAll('main *')].find(x=>x.childElementCount===0&&/核验完成|Check complete/.test(x.textContent||'')); return e?e.textContent.trim():null; }"

BASE = "https://hunt.zalize.com"
SHOTS = "screenshots-r399"
UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"}
findings = {}
console_errors = []

NEW_TLDS = ["asia", "buzz", "fans", "place", "report", "town"]  # R391
NEW_GUIDES = ["gymnastics", "cheerleading", "squash", "lacrosse", "judo", "bjj"]  # R392
NEW_VS = ["bond-vs-finance", "sbs-vs-xyz", "cyou-vs-fun", "monster-vs-games", "pics-vs-photos", "mobi-vs-app"]  # R393


def fetch(path):
    req = urllib.request.Request(BASE + path, headers=UA)
    try:
        with urllib.request.urlopen(req) as r:
            return r.status, r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "replace")


def seo_probe(html):
    return {
        "title": (re.search(r"<title>(.*?)</title>", html, re.S) or [None, None])[1],
        "canonical": (re.search(r'<link rel="canonical" href="([^"]+)"', html) or [None, None])[1],
        "html_lang": (re.search(r'<html[^>]*lang="([^"]+)"', html) or [None, None])[1],
        "og_count": len(re.findall(r'<meta property="og:', html)),
        "jsonld_types": re.findall(r'"@type"\s*:\s*"([A-Za-z]+)"', html),
        "has_faq_jsonld": '"FAQPage"' in html,
        "internal_links": {k: len(set(re.findall(rf'href="/{k}/([a-z0-9-]+)', html))) for k in ("tld", "guide", "vs")},
        "bytes": len(html.encode()),
    }


def attach_console(page):
    page.on("console", lambda m: console_errors.append({"type": m.type, "text": m.text[:200], "url": page.url}) if m.type == "error" else None)
    page.on("pageerror", lambda e: console_errors.append({"type": "pageerror", "text": str(e)[:200], "url": page.url}))


def shot(page, name):
    page.screenshot(path=f"{SHOTS}/{name}.png", full_page=False)


cb = int(time.time())

# ---- HTTP-side checks ----
counts_json = json.load(open("../../scripts/content-counts.json"))
expected = {k: set(counts_json[k]["slugs"]) for k in ("tld", "guide", "vs")}
sitemap_samples = []
for i in range(3):
    _, xml = fetch(f"/sitemap.xml?cb=r399{i}{cb}")
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

# ---- 3 sampled new pages (R391/R392/R393) SSR deep probe zh+en ----
seo_pages = ["/tld/buzz", "/tld/buzz?lang=en", "/guide/lacrosse", "/guide/lacrosse?lang=en", "/vs/pics-vs-photos", "/vs/pics-vs-photos?lang=en"]
seo = {}
for p in seo_pages:
    st, html = fetch(p)
    seo[p] = {"status": st, **seo_probe(html)}
findings["seo_sampled_new_pages"] = seo
# status probe for all 18 new pages zh+en
status_probe = {}
for p in [f"/tld/{s}" for s in NEW_TLDS] + [f"/guide/{s}" for s in NEW_GUIDES] + [f"/vs/{s}" for s in NEW_VS]:
    for q in ("", "?lang=en"):
        st, html = fetch(p + q)
        status_probe[p + q] = {"status": st, "bytes": len(html.encode()), "faq": '"FAQPage"' in html}
findings["new_pages_status"] = status_probe

with sync_playwright() as p:
    b = p.chromium.connect_over_cdp("http://localhost:29229")
    ctx = b.contexts[0]
    page = ctx.new_page()
    attach_console(page)

    page.goto(f"{BASE}/?cb={cb}", wait_until="networkidle")
    findings["usage_pre_browser"] = page.evaluate("async () => await (await fetch('/api/usage')).json()")
    findings["prices_api"] = page.evaluate("async () => { const j = await (await fetch('/api/prices')).json(); return {stale: j.stale, tldCount: j.tldCount, fetchedAt: j.fetchedAt, keys: Object.keys(j.prices||{}).length}; }")

    page.evaluate("localStorage.setItem('domainhunter:lang','zh')")
    page.reload(wait_until="networkidle")
    time.sleep(1)
    shot(page, "A1-home-zh")

    # quick-check exact: single, then All (expect 313), then repeat same input (dedup not stuck pending)
    page.get_by_role("button", name=RE_EXACT).first.click()
    time.sleep(0.3)
    inp = page.locator("main textarea, main input[type=text]").first
    inp.fill("qzxvkw9r399")
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
        findings["quick_more_label"] = more_btn.first.text_content().strip()
        more_btn.first.click()
        s2 = None
        for _ in range(360):
            s2 = page.evaluate(DONE_JS)
            if s2 and re.search(r"31[0-9]|/\s*313", s2): break
            time.sleep(1)
        findings["quick_all"] = s2
        # cn / com.cn rows state
        findings["quick_cn_rows"] = page.evaluate("""() => {
          const rows=[...document.querySelectorAll('main *')].filter(x=>x.childElementCount<=3 && /qzxvkw9r399\\.(cn|com\\.cn)\\b/.test(x.textContent||'') && (x.textContent||'').length<160);
          return rows.slice(0,4).map(r=>r.textContent.trim().slice(0,120));
        }""")
        findings["quick_pending_count"] = page.evaluate("() => [...document.querySelectorAll('main *')].filter(x=>x.childElementCount===0&&/查询中|pending|Checking/i.test(x.textContent||'')).length")
        shot(page, "B2-quickcheck-all")
    # repeat same input — dedup should not hang pending
    page.goto(f"{BASE}/?cb={cb}2", wait_until="networkidle"); time.sleep(1)
    page.get_by_role("button", name=RE_EXACT).first.click(); time.sleep(0.3)
    inp = page.locator("main textarea, main input[type=text]").first
    inp.fill("qzxvkw9r399")
    inp.press("Enter")
    s3 = None
    for _ in range(60):
        s3 = page.evaluate(DONE_JS)
        if s3: break
        time.sleep(1)
    findings["quick_repeat"] = s3
    shot(page, "B3-quickcheck-repeat")

    # /prices rows
    page.goto(BASE + "/prices", wait_until="networkidle"); time.sleep(2)
    findings["prices_rows_zh"] = page.evaluate("() => document.querySelectorAll('main a[href^=\"/?tld=\"]').length")
    shot(page, "C1-prices-zh")

    # hubs + footer
    for path, key, prefix in [("/tld", "tld_hub_links", "/tld/"), ("/guide", "guide_hub_links", "/guide/"), ("/vs", "vs_hub_links", "/vs/")]:
        page.goto(BASE + path, wait_until="networkidle"); time.sleep(1)
        findings[key] = page.evaluate(f"() => new Set([...document.querySelectorAll('main a[href^=\"{prefix}\"]')].map(a=>a.getAttribute('href').split('?')[0])).size")
        shot(page, "D-" + key)
    page.goto(BASE + "/", wait_until="networkidle"); time.sleep(1)
    findings["footer_link_counts"] = page.evaluate("""() => {
      const out={};
      for (const pre of ["/tld/","/guide/","/vs/"]) out[pre]=new Set([...document.querySelectorAll(`footer a[href^="${pre}"]`)].map(a=>a.getAttribute('href').split('?')[0])).size;
      return out;
    }""")
    shot(page, "D4-footer")

    # hydration consistency on sampled new pages (SSR title vs hydrated h1 present, no blank main)
    hydr = {}
    for path in ["/tld/buzz", "/guide/lacrosse", "/vs/pics-vs-photos"]:
        page.goto(BASE + path, wait_until="networkidle"); time.sleep(1)
        hydr[path] = page.evaluate("""() => ({
          h1: (document.querySelector('main h1')||{}).textContent||null,
          title: document.title,
          mainLen: (document.querySelector('main')||{innerText:''}).innerText.length,
          hasHuntCta: !!document.querySelector('main a[href^="/?tld="], main a[href="/"]')
        })""")
        shot(page, "E-hydration-" + path.strip("/").replace("/", "-"))
    findings["hydration_new_pages"] = hydr

    # tool pages
    for path, key, name in [("/why", "why_status", "G4-why"), ("/shortlist", "shortlist_status", "G5-shortlist"), ("/monitors", "monitors_status", "G7-monitors"), ("/advanced", "advanced_status", "G6-advanced")]:
        page.goto(BASE + path, wait_until="networkidle"); time.sleep(0.8)
        findings[key] = page.evaluate(f"async () => (await fetch('{path}')).status")
        shot(page, name)

    # /advanced bulk paste (non-AI)
    page.goto(BASE + "/advanced", wait_until="networkidle"); time.sleep(1)
    ta = page.locator("main textarea").first
    if ta.count():
        ta.fill("qzxvkw9r399bulk.com\nqzxvkw9r399bulk.io\ngoogle.com")
        btn = page.locator("main button", has_text=re.compile("核验|Check")).first
        if btn.count():
            btn.click()
            done = None
            for _ in range(60):
                done = page.evaluate(DONE_JS)
                if done: break
                time.sleep(1)
            findings["advanced_bulk"] = done
            shot(page, "G8-advanced-bulk")

    # 404 + /mcp
    page.goto(BASE + "/nonexistent-r399", wait_until="networkidle"); shot(page, "G1-404-toplevel")
    findings["404_status"] = page.evaluate("async () => (await fetch('/nonexistent-r399')).status")
    findings["404_tld_status"] = page.evaluate("async () => (await fetch('/tld/notatld-r399')).status")
    findings["404_guide_status"] = page.evaluate("async () => (await fetch('/guide/notaguide-r399')).status")
    findings["404_vs_status"] = page.evaluate("async () => (await fetch('/vs/nota-vs-page-r399')).status")
    page.goto(BASE + "/mcp", wait_until="networkidle"); time.sleep(0.5); shot(page, "G3-mcp-doc")
    findings["mcp_doc_status"] = page.evaluate("async () => (await fetch('/mcp')).status")

    # MCP three tools via JSON-RPC
    findings["mcp_tools_list"] = page.evaluate("""async () => {
      const r = await fetch('/mcp', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({jsonrpc:'2.0', id:1, method:'tools/list'})});
      const j = await r.json(); return (j.result.tools||[]).map(t=>t.name);
    }""")
    findings["mcp_check_domains"] = page.evaluate("""async () => {
      const r = await fetch('/mcp', {method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({jsonrpc:'2.0', id:2, method:'tools/call', params:{name:'check_domains', arguments:{domains:['qzxvkw9r399mcp.com','google.com']}}})});
      const j = await r.json();
      try { const c = JSON.parse(j.result.content[0].text); return c.results.map(x=>({domain:x.domain, available:x.available})); } catch(e){ return {err:String(e).slice(0,100)}; }
    }""")
    findings["mcp_tld_prices"] = page.evaluate("""async () => {
      const r = await fetch('/mcp', {method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({jsonrpc:'2.0', id:3, method:'tools/call', params:{name:'tld_prices', arguments:{}}})});
      const j = await r.json();
      try { const c = JSON.parse(j.result.content[0].text); return {tldCount: c.tldCount, priceKeys: Object.keys(c.prices).length}; } catch(e) { return {err: String(e).slice(0,100)}; }
    }""")
    findings["mcp_suggest_variants"] = page.evaluate("""async () => {
      const r = await fetch('/mcp', {method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({jsonrpc:'2.0', id:4, method:'tools/call', params:{name:'suggest_variants', arguments:{domain:'google.com'}}})});
      const j = await r.json();
      try { const c = JSON.parse(j.result.content[0].text); return {variants: (c.variants||c.results||[]).length}; } catch(e) { return {err: String(e).slice(0,100), raw: JSON.stringify(j).slice(0,200)}; }
    }""")

    # share: create -> live -> revoke -> 410
    created = page.evaluate("""async () => {
      const r = await fetch('/api/share', {method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({items:[{domain:'qzxvkw9r399a.com'},{domain:'google.com'}]})});
      return {status: r.status, body: await r.json()};
    }""")
    findings["share_create"] = {"status": created["status"], "id": created["body"].get("id"), "has_token": bool(created["body"].get("revokeToken"))}
    sid = created["body"].get("id"); tok = created["body"].get("revokeToken")
    page.goto(f"{BASE}/s/{sid}", wait_until="networkidle"); time.sleep(1)
    findings["share_live_domains"] = page.evaluate("() => { const t=document.querySelector('main') ? document.querySelector('main').innerText : ''; return {d1: t.includes('qzxvkw9r399a.com'), d2: t.includes('google.com')}; }")
    shot(page, "H1-share-live")
    status = page.evaluate("""async ([sid, tok]) => {
      const r = await fetch(`/api/share/${sid}`, {method:'DELETE', headers:{'Content-Type':'application/json'}, body: JSON.stringify({token: tok})});
      const g = await fetch(`/api/share/${sid}`);
      return {del: r.status, getAfter: g.status};
    }""", [sid, tok])
    findings["share_revoke"] = status

    # 375px checks
    mob = {}
    cdp = ctx.new_cdp_session(page)
    cdp.send("Emulation.setDeviceMetricsOverride", {"width": 375, "height": 812, "deviceScaleFactor": 2, "mobile": True})
    for path, name in [("/", "K1-375-home"), ("/prices", "K2-375-prices"), ("/tld/buzz", "K3-375-tld-buzz"), ("/vs/pics-vs-photos", "K4-375-vs-pics"), ("/guide/lacrosse", "K5-375-guide-lacrosse"), ("/shortlist", "K6-375-shortlist"), ("/advanced", "K7-375-advanced"), ("/why", "K8-375-why"), ("/mcp", "K9-375-mcp")]:
        page.goto(BASE + path, wait_until="networkidle"); time.sleep(1)
        mob[path] = page.evaluate("() => document.documentElement.scrollWidth")
        shot(page, name)
    cdp.send("Emulation.clearDeviceMetricsOverride")
    findings["mobile_375_scrollWidth"] = mob

    # usage post (pre-402 phase)
    page.goto(BASE + "/", wait_until="networkidle")
    findings["usage_post_phase1"] = page.evaluate("async () => await (await fetch('/api/usage')).json()")
    findings["usage_days_equal_phase1"] = findings["usage_pre_browser"]["days"] == findings["usage_post_phase1"]["days"]

    page.close()

findings["console_errors"] = console_errors
json.dump(findings, open(sys.argv[1], "w"), ensure_ascii=False, indent=2)
print(json.dumps(findings, ensure_ascii=False, indent=1)[:9000])
