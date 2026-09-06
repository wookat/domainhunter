#!/usr/bin/env python3
"""R537 zero-AI headless browser audit of hunt.zalize.com.
Separate headless Chrome (does not touch the session Chrome / user storage).
Collects per route x lang: console, pageerror, requestfailed, responses>=400, securitypolicyviolation,
SSR-vs-hydrated price tokens + h1, 375px scrollWidth light/dark, touch targets <44px, form-control naming.
Also: hub filters + #hub-g-* anchor landing, home exact-check + advanced bulk (non-AI) request capture.
"""
import json, re, html, os, sys, time
from playwright.sync_api import sync_playwright

ORIGIN = "https://hunt.zalize.com"
CHROME = "/opt/.devin/chrome/chrome/linux-137.0.7118.2/chrome-linux64/chrome"
OUT = "/home/ubuntu/r537/browser"; SHOT = "/home/ubuntu/r537/shots"
os.makedirs(OUT, exist_ok=True); os.makedirs(SHOT, exist_ok=True)
REVOKED = open("/home/ubuntu/r537/http/share_id.txt").read().strip()

ROUTES = ["/", "/advanced", "/shortlist", "/monitors", "/prices", "/why", "/mcp", "/tld", "/guide", "/vs",
          "/tld/cn", "/tld/de", "/tld/jp", "/tld/uk", "/tld/ar", "/tld/cz",
          "/guide/saas", "/guide/nocode", "/guide/robotics", "/guide/lawfirm",
          "/vs/com-vs-cn", "/vs/io-vs-dev", "/vs/uk-vs-com", "/vs/pizza-vs-com", "/vs/ai-vs-tech", "/vs/me-vs-io",
          "/nope-r537-browser", f"/s/{REVOKED}", "/s/unknownr537"]
EXPECTED_404 = {"/nope-r537-browser": 404, f"/s/{REVOKED}": 410, "/s/unknownr537": 404}
PRICE_RE = re.compile(r"(?:[$¥€£]\s?\d[\d,]*(?:\.\d+)?|\d[\d,]*(?:\.\d+)?\s?(?:USD|CNY|元|美元))")

def text_of_html(h):
    m = re.search(r'<div id="root">(.*)</div>\s*<script', h, re.S)
    body = m.group(1) if m else h
    body = re.sub(r"<script.*?</script>|<style.*?</style>", " ", body, flags=re.S)
    body = re.sub(r"<[^>]+>", " ", body)
    return re.sub(r"\s+", " ", html.unescape(body)).strip()

INIT = """
window.__r537 = {csp: [], errors: []};
document.addEventListener('securitypolicyviolation', e => window.__r537.csp.push({
  directive: e.effectiveDirective, blocked: e.blockedURI, disposition: e.disposition, line: e.lineNumber, src: e.sourceFile, sample: (e.sample||'').slice(0,80)}));
"""

def url_for(path, lang):
    sep = "&" if "?" in path else "?"
    return f"{ORIGIN}{path}{sep}lang={lang}"

results = []; events_raw = []; touch = []; forms = []; layout = []; ssr_cmp = []

def visit(ctx, path, lang, theme):
    page = ctx.new_page()
    page.set_viewport_size({"width": 1280, "height": 900})
    page.add_init_script(INIT + f"try{{localStorage.setItem('domainhunter:theme','{theme}')}}catch(e){{}}")
    ev = {"console": [], "pageerror": [], "requestfailed": [], "responses4xx": []}
    page.on("console", lambda m: ev["console"].append({"type": m.type, "text": m.text[:300]}) if m.type in ("error", "warning") else None)
    page.on("pageerror", lambda e: ev["pageerror"].append(str(e)[:300]))
    page.on("requestfailed", lambda r: ev["requestfailed"].append({"url": r.url, "err": r.failure}))
    page.on("response", lambda r: ev["responses4xx"].append({"url": r.url, "status": r.status}) if r.status >= 400 else None)
    ai_calls = []
    page.on("request", lambda r: ai_calls.append(r.url) if "/api/ai-search" in r.url else None)
    url = url_for(path, lang)
    resp = page.goto(url, wait_until="networkidle", timeout=60000)
    page.wait_for_timeout(800)
    status = resp.status if resp else None
    ssr_html = ctx.request.get(url).text()
    ssr_text = text_of_html(ssr_html)
    dom_text = page.evaluate("() => document.getElementById('root').innerText.replace(/\\s+/g,' ').trim()")
    ssr_h1 = re.findall(r"<h1[^>]*>(.*?)</h1>", ssr_html, re.S)
    ssr_h1 = [re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", "", x))).strip() for x in ssr_h1]
    dom_h1 = page.locator("h1").all_inner_texts()
    ssr_prices = sorted(PRICE_RE.findall(ssr_text)); dom_prices = sorted(PRICE_RE.findall(dom_text))
    ssr_title = re.search(r"<title>(.*?)</title>", ssr_html, re.S); ssr_title = html.unescape(ssr_title.group(1)) if ssr_title else None
    # price equality: every SSR price must appear in DOM with the same multiplicity
    from collections import Counter
    cs, cd = Counter(ssr_prices), Counter(dom_prices)
    missing = list((cs - cd).elements()); extra = list((cd - cs).elements())
    ssr_cmp.append({"route": path, "lang": lang, "status": status, "ssr_title": ssr_title, "dom_title": page.title(),
                    "ssr_h1": ssr_h1, "dom_h1": dom_h1, "h1_equal": [x.strip() for x in ssr_h1] == [x.strip() for x in dom_h1],
                    "ssr_price_n": len(ssr_prices), "dom_price_n": len(dom_prices), "ssr_prices_missing_in_dom": missing, "dom_prices_not_in_ssr": extra[:40],
                    "ssr_root_words": len(ssr_text.split()), "dom_words": len(dom_text.split()), "html_bytes": len(ssr_html.encode())})
    csp = page.evaluate("() => window.__r537.csp")
    # form controls naming
    fc = page.evaluate("""() => [...document.querySelectorAll('input,textarea,select')].filter(e=>e.type!=='hidden').map(e=>{
        const id=e.id, name=e.name, lab = id && document.querySelector(`label[for="${id}"]`);
        const wrap = e.closest('label');
        return {tag:e.tagName.toLowerCase(), type:e.type, id, name, ariaLabel:e.getAttribute('aria-label'), ariaLabelledby:e.getAttribute('aria-labelledby'),
          placeholder:e.placeholder||null, hasLabel: !!(lab||wrap||e.getAttribute('aria-label')||e.getAttribute('aria-labelledby')), hasIdOrName: !!(id||name)} })""")
    for f in fc: f.update(route=path, lang=lang)
    forms.extend(fc)
    name = (path.strip("/").replace("/", "_") or "home") + "_" + lang
    page.screenshot(path=f"{SHOT}/{name}_1280_{theme}.png")
    # 375px both themes
    for th in ("light", "dark"):
        page.set_viewport_size({"width": 375, "height": 812})
        page.evaluate(f"() => {{ localStorage.setItem('domainhunter:theme','{th}'); document.documentElement.classList.toggle('light', '{th}'==='light'); scrollTo(0,0); }}")
        page.wait_for_timeout(300)
        geo = page.evaluate("() => ({scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, bodyBg: getComputedStyle(document.body).backgroundColor, htmlClass: document.documentElement.className})")
        page.screenshot(path=f"{SHOT}/{name}_375_{th}.png")
        layout.append({"route": path, "lang": lang, "theme": th, **geo, "overflow": geo["scrollWidth"] > geo["clientWidth"]})
        if th == "light":
            small = page.evaluate("""() => [...document.querySelectorAll('a,button,input,select,textarea,[role=button],[role=switch],[role=tab],summary')]
              .filter(e => { const r=e.getBoundingClientRect(); const s=getComputedStyle(e); return r.width>0 && r.height>0 && s.visibility!=='hidden'; })
              .map(e => { const r=e.getBoundingClientRect(); return {tag:e.tagName.toLowerCase(), w:Math.round(r.width), h:Math.round(r.height), text:(e.getAttribute('aria-label')||e.innerText||e.value||e.className||'').toString().slice(0,50), inline: getComputedStyle(e).display==='inline'} })
              .filter(x => x.h < 44 || x.w < 44)""")
            total = page.evaluate("() => document.querySelectorAll('a,button,input,select,textarea,[role=button],[role=switch],[role=tab],summary').length")
            touch.append({"route": path, "lang": lang, "total_interactive": total, "under44": len(small),
                          "under44_non_inline_text_links": [s for s in small if not (s["tag"] == "a" and s["inline"])][:60],
                          "under44_inline_links": sum(1 for s in small if s["tag"] == "a" and s["inline"])})
    # filter expected noise
    expected = EXPECTED_404.get(path)
    noise = [r for r in ev["responses4xx"] if expected and r["status"] == expected and (r["url"].split("?")[0].rstrip("/").endswith(path.split("?")[0].rstrip("/")) or f"/api/share/" in r["url"])]
    real4xx = [r for r in ev["responses4xx"] if r not in noise]
    console_noise = [c for c in ev["console"] if expected and "Failed to load resource" in c["text"]]
    console_real = [c for c in ev["console"] if c not in console_noise]
    results.append({"route": path, "lang": lang, "url": url, "status": status, "expected": expected or 200,
                    "console_real": console_real, "console_expected_noise": len(console_noise), "pageerror": ev["pageerror"],
                    "requestfailed": ev["requestfailed"], "responses4xx_real": real4xx, "responses4xx_expected_noise": len(noise),
                    "csp_violations": csp, "ai_search_requests": ai_calls})
    events_raw.append({"route": path, "lang": lang, **ev})
    page.close()
    print(f"{path:22s} {lang} status={status} console={len(console_real)} pageerror={len(ev['pageerror'])} reqfail={len(ev['requestfailed'])} 4xx={len(real4xx)} csp={len(csp)} prices ssr={len(ssr_prices)} dom={len(dom_prices)} missing={len(missing)} h1eq={ssr_h1==dom_h1}", flush=True)

def save():
    json.dump(results, open(f"{OUT}/visits.json", "w"), ensure_ascii=False, indent=1)
    json.dump(events_raw, open(f"{OUT}/events-raw.json", "w"), ensure_ascii=False, indent=1)
    json.dump(ssr_cmp, open(f"{OUT}/ssr-vs-dom.json", "w"), ensure_ascii=False, indent=1)
    json.dump(layout, open(f"{OUT}/layout-375.json", "w"), ensure_ascii=False, indent=1)
    json.dump(touch, open(f"{OUT}/touch-targets-375.json", "w"), ensure_ascii=False, indent=1)
    json.dump(forms, open(f"{OUT}/form-controls.json", "w"), ensure_ascii=False, indent=1)

def hubs(ctx):
    out = []
    for kind, query in (("tld", ".cn"), ("guide", "saas"), ("vs", "com vs cn")):
        for lang in ("zh", "en"):
            page = ctx.new_page(); page.set_viewport_size({"width": 1280, "height": 900})
            page.add_init_script(INIT)
            page.goto(url_for(f"/{kind}", lang), wait_until="networkidle")
            groups = page.evaluate("() => [...document.querySelectorAll('section[id^=\"hub-g-\"]')].map(s => ({id: s.id, links: s.querySelectorAll('a[href^=\"/'+location.pathname.split('/')[1]+'/\"]').length}))")
            total_before = page.evaluate(f"() => document.querySelectorAll('section[id^=\"hub-g-\"] a[href^=\"/{kind}/\"]').length")
            inp = page.locator("input[type=search]").first
            inp.fill(query); page.wait_for_timeout(400)
            filtered = page.evaluate(f"() => [...document.querySelectorAll('section[id^=\"hub-g-\"] a[href^=\"/{kind}/\"]')].map(a => a.getAttribute('href'))")
            counter = page.evaluate("() => { const i=document.querySelector('input[type=search]'); return i.parentElement.parentElement.innerText.replace(/\\s+/g,' ').slice(0,200) }")
            visible_nav = page.evaluate("() => [...document.querySelectorAll('nav[aria-label] a[href^=\"#hub-g-\"]')].map(a=>a.getAttribute('href'))")
            page.screenshot(path=f"{SHOT}/hub_filter_{kind}_{lang}.png")
            # anchor landing: pick 3rd group (or last)
            gid = groups[min(2, len(groups) - 1)]["id"] if groups else None
            landing = None
            if gid:
                page.goto(url_for(f"/{kind}", lang) + f"#{gid}", wait_until="networkidle"); page.wait_for_timeout(1500)
                landing = page.evaluate("() => { const e=document.querySelector(location.hash); const nav=document.querySelector('nav[aria-label=\"分组导航\"],nav[aria-label=\"Group navigation\"]'); const h=e&&e.querySelector('h2'); return {hash: location.hash, sectionTop: e&&e.getBoundingClientRect().top, h2Top: h&&h.getBoundingClientRect().top, navBottom: nav&&nav.getBoundingClientRect().bottom, scrollY: scrollY, h2Text: h&&h.innerText} }")
                page.screenshot(path=f"{SHOT}/hub_landing_{kind}_{lang}.png")
            out.append({"hub": kind, "lang": lang, "groups": groups, "total_links_before": total_before, "query": query, "filtered": filtered, "filtered_n": len(filtered), "counter_text": counter, "nav_chips_after_filter": visible_nav, "landing": landing})
            print(f"hub /{kind} {lang}: groups={len(groups)} links={total_before} filter '{query}' -> {len(filtered)} landing={landing}", flush=True)
            page.close()
    json.dump(out, open(f"{OUT}/hubs.json", "w"), ensure_ascii=False, indent=1)

def flows(ctx):
    """Non-AI flows: home 精确核验 tab -> /api/search; /advanced bulk -> which endpoint. Never touches AI CTA/example chips."""
    out = {}
    page = ctx.new_page(); page.set_viewport_size({"width": 1280, "height": 900}); page.add_init_script(INIT)
    reqs = []
    page.on("request", lambda r: reqs.append({"method": r.method, "url": r.url, "post": (r.post_data or "")[:200]}) if "/api/" in r.url else None)
    page.goto(url_for("/", "zh"), wait_until="networkidle")
    # locate exact-check tab
    tabs = page.locator("[role=tab], button").all_inner_texts()
    out["home_buttons"] = [t.strip() for t in tabs if t.strip()][:40]
    tab = page.get_by_role("tab", name=re.compile("精确核验|Exact")).first
    if tab.count() == 0:
        tab = page.get_by_role("button", name=re.compile("精确核验|Exact")).first
    tab.click(); page.wait_for_timeout(400)
    page.screenshot(path=f"{SHOT}/flow_home_exact_tab.png")
    box = page.locator("textarea, input[type=text], input:not([type])").filter(has_not=page.locator("[type=search]")).first
    box.fill("r537-audit-probe-xk3.com\ngoogle.com")
    page.get_by_role("button", name=re.compile("核验|Check|查询|开始")).first.click()
    page.wait_for_timeout(6000)
    page.screenshot(path=f"{SHOT}/flow_home_exact_result.png")
    out["home_exact_requests"] = reqs[:]; out["home_exact_result_text"] = page.evaluate("() => document.getElementById('root').innerText.slice(0,1500)")
    out["home_url_after"] = page.url
    page.close()
    reqs.clear()
    page = ctx.new_page(); page.set_viewport_size({"width": 1280, "height": 900}); page.add_init_script(INIT)
    page.on("request", lambda r: reqs.append({"method": r.method, "url": r.url, "post": (r.post_data or "")[:200]}) if "/api/" in r.url else None)
    page.goto(url_for("/advanced", "zh"), wait_until="networkidle")
    out["advanced_controls"] = page.evaluate("() => [...document.querySelectorAll('main input,main textarea,main select,main button')].map(e=>({tag:e.tagName, type:e.type, name:e.name, id:e.id, text:(e.innerText||e.placeholder||'').slice(0,40)}))")
    ta = page.locator("main textarea").first
    ta.fill("r537audit\nr537probe")
    page.screenshot(path=f"{SHOT}/flow_advanced_filled.png")
    page.get_by_role("button", name=re.compile("批量|核验|Check|查询|开始|生成")).first.click()
    page.wait_for_timeout(10000)
    page.screenshot(path=f"{SHOT}/flow_advanced_result.png")
    out["advanced_requests"] = reqs[:]; out["advanced_result_text"] = page.evaluate("() => document.getElementById('root').innerText.slice(0,2000)")
    out["advanced_url_after"] = page.url
    out["ai_search_calls_total"] = sum(1 for r in reqs if "ai-search" in r["url"]) + sum(1 for r in out["home_exact_requests"] if "ai-search" in r["url"])
    page.close()
    json.dump(out, open(f"{OUT}/flows.json", "w"), ensure_ascii=False, indent=1)
    print("flows: home reqs", [r["url"] for r in out["home_exact_requests"]], "advanced reqs", [r["url"] for r in out["advanced_requests"]], "AI calls:", out["ai_search_calls_total"], flush=True)

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME, headless=True, args=["--no-sandbox"])
    ctx = b.new_context(locale="zh-CN", user_agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 r537-audit-headless")
    what = sys.argv[1] if len(sys.argv) > 1 else "all"
    if what in ("all", "visits"):
        for path in ROUTES:
            for lang in ("zh", "en"):
                try:
                    visit(ctx, path, lang, "light")
                except Exception as e:
                    print("ERR", path, lang, e, flush=True); results.append({"route": path, "lang": lang, "error": str(e)[:300]})
                save()
    if what in ("all", "hubs"):
        hubs(ctx)
    if what in ("all", "flows"):
        flows(ctx)
    b.close()
print("DONE")
