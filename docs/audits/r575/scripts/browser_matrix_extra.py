#!/usr/bin/env python3
"""R575 zero-AI headless browser matrix of hunt.zalize.com (separate headless Chrome; never touches the session Chrome storage).
Per route x lang: console/pageerror/requestfailed/4xx/CSP-violation events, SSR-vs-hydrated text (SSR root text must be a
whitespace-normalized prefix/subset of hydrated text; h1 + price tokens), <html lang>/title/canonical/hreflang/robots,
JSON-LD FAQPage vs visible FAQ text, 1280 light+dark screenshots, 375px light/dark overflow (innerWidth/clientWidth/scrollWidth/body),
touch targets <44px (R544 全站复核), keyboard Tab reachability (25 presses). Never requests /api/ai-search.
"""
import json, re, html, os, sys
from collections import Counter
from playwright.sync_api import sync_playwright

ORIGIN = "https://hunt.zalize.com"
CHROME = "/opt/.devin/chrome/chrome/linux-137.0.7118.2/chrome-linux64/chrome"
OUT = "/home/ubuntu/r575/browser_extra"; SHOT = "/home/ubuntu/r575/shots"
os.makedirs(OUT, exist_ok=True); os.makedirs(SHOT, exist_ok=True)
REVOKED = open("/home/ubuntu/r575/http/share_id.txt").read().strip()

ROUTES = ["/vs/fr-vs-com", "/vs/au-vs-com"]
EXPECTED = {"/nope-r575-browser": 404, f"/s/{REVOKED}": 410, "/s/unknownr575": 404}
PRICE_RE = re.compile(r"(?:[$¥€£]\s?\d[\d,]*(?:\.\d+)?|\d[\d,]*(?:\.\d+)?\s?(?:USD|CNY|元|美元))")

def norm(s):
    return re.sub(r"\s+", " ", html.unescape(s)).strip()

def text_of_html(h):
    m = re.search(r'<div id="root">(.*)</div>\s*<script', h, re.S)
    body = m.group(1) if m else h
    body = re.sub(r"<script.*?</script>|<style.*?</style>|<svg.*?</svg>", " ", body, flags=re.S)
    body = re.sub(r"<[^>]+>", " ", body)
    return norm(body)

def head_meta(h):
    g = lambda rx: (re.search(rx, h, re.S) or [None, None])[1]
    return {"html_lang": g(r'<html lang="([^"]*)"'), "title": html.unescape(g(r"<title>(.*?)</title>") or ""),
            "canonical": g(r'<link rel="canonical" href="([^"]*)"'),
            "hreflang": re.findall(r'hreflang="([^"]*)" href="([^"]*)"', h),
            "robots": g(r'<meta name="robots" content="([^"]*)"'), "og_locale": g(r'<meta property="og:locale" content="([^"]*)"'),
            "ld_types": re.findall(r'"@type":\s*"([A-Za-z]+)"', h)[:12]}

def faq_ld(h):
    out = []
    for blk in re.findall(r'<script type="application/ld\+json"[^>]*>(.*?)</script>', h, re.S):
        try:
            d = json.loads(html.unescape(blk)) if "&" in blk and "&quot;" in blk else json.loads(blk)
        except Exception:
            try: d = json.loads(html.unescape(blk))
            except Exception: continue
        ds = d if isinstance(d, list) else [d]
        for x in ds:
            if isinstance(x, dict) and x.get("@type") == "FAQPage":
                for q in x.get("mainEntity", []):
                    out.append({"q": norm(q.get("name", "")), "a": norm(re.sub(r"<[^>]+>", " ", (q.get("acceptedAnswer") or {}).get("text", "")))})
    return out

INIT = """
window.__r575 = {csp: []};
document.addEventListener('securitypolicyviolation', e => window.__r575.csp.push({
  directive: e.effectiveDirective, blocked: e.blockedURI, disposition: e.disposition, src: e.sourceFile, sample: (e.sample||'').slice(0,80)}));
"""

def url_for(path, lang):
    return f"{ORIGIN}{path}{'&' if '?' in path else '?'}lang={lang}"

results = []; ssr_cmp = []; layout = []; touch = []; faq = []; keyboard = []; meta_rows = []

def visit(ctx, path, lang):
    page = ctx.new_page(); page.set_viewport_size({"width": 1280, "height": 900})
    page.add_init_script(INIT + "try{localStorage.setItem('domainhunter:theme','light')}catch(e){}")
    ev = {"console": [], "pageerror": [], "requestfailed": [], "responses4xx": []}
    page.on("console", lambda m: ev["console"].append({"type": m.type, "text": m.text[:300]}) if m.type in ("error", "warning") else None)
    page.on("pageerror", lambda e: ev["pageerror"].append(str(e)[:300]))
    page.on("requestfailed", lambda r: ev["requestfailed"].append({"url": r.url, "err": r.failure}))
    page.on("response", lambda r: ev["responses4xx"].append({"url": r.url, "status": r.status}) if r.status >= 400 else None)
    ai_calls = []; api_calls = []
    page.on("request", lambda r: (ai_calls.append(r.url) if "/api/ai-search" in r.url else None, api_calls.append(r.method + " " + r.url.replace(ORIGIN, "")) if "/api/" in r.url else None))
    url = url_for(path, lang)
    resp = page.goto(url, wait_until="networkidle", timeout=60000)
    page.wait_for_timeout(2500 if "?q=" in path else 800)
    status = resp.status if resp else None
    scroll_y0 = page.evaluate("() => ({scrollY: scrollY, quickPanelTop: (document.querySelector('[data-unknown-reason]')||document.querySelector('[data-recheck]')||{}).getBoundingClientRect?.().top ?? null, chips: document.querySelectorAll('[data-recheck],[data-unknown-reason]').length})")
    ssr_html = ctx.request.get(url).text()
    ssr_text = text_of_html(ssr_html)
    dom_text = page.evaluate("() => document.getElementById('root').innerText.replace(/\\s+/g,' ').trim()")
    dom_tc = page.evaluate("() => document.getElementById('root').textContent.replace(/\\s+/g,' ').trim()")
    ssr_h1 = [norm(re.sub(r"<[^>]+>", "", x)) for x in re.findall(r"<h1[^>]*>(.*?)</h1>", ssr_html, re.S)]
    dom_h1 = [norm(x) for x in page.locator("h1").all_inner_texts()]
    sp, dp = sorted(PRICE_RE.findall(ssr_text)), sorted(PRICE_RE.findall(dom_text))
    cs, cd = Counter(sp), Counter(dp)
    # SSR text words vs hydrated textContent words (SSR may truncate before the price table)
    s_ns = re.sub(r"\s+", "", ssr_text); d_ns = re.sub(r"\s+", "", dom_tc)
    sw = [s_ns[i:i + 40] for i in range(0, len(s_ns), 40)]; dw = d_ns
    common = sum(1 for c in sw if c in d_ns)
    m = head_meta(ssr_html)
    dom_meta = page.evaluate("() => ({lang: document.documentElement.lang, title: document.title, canonical: document.querySelector('link[rel=canonical]')?.href, robots: document.querySelector('meta[name=robots]')?.content, og_locale: document.querySelector('meta[property=\"og:locale\"]')?.content, hreflang_n: document.querySelectorAll('link[rel=alternate][hreflang]').length, ld_n: document.querySelectorAll('script[type=\"application/ld+json\"]').length})")
    braces = {"ssr_html": ssr_html.count("{{"), "dom_text": dom_tc.count("{{"), "dom_html": page.content().count("{{")}
    ssr_cmp.append({"route": path, "lang": lang, "status": status, "ssr_title": m["title"], "dom_title": dom_meta["title"], "title_equal": m["title"] == dom_meta["title"],
                    "ssr_h1": ssr_h1, "dom_h1": dom_h1, "h1_equal": ssr_h1 == dom_h1,
                    "ssr_chunks40": len(sw), "dom_chars": len(dw), "ssr_chunks_found_in_dom": common, "ssr_chunk_coverage": round(common / len(sw), 4) if sw else None,
                    "ssr_price_n": len(sp), "dom_price_n": len(dp), "ssr_prices_missing_in_dom": list((cs - cd).elements()), "dom_prices_not_in_ssr": list((cd - cs).elements())[:40],
                    "html_bytes": len(ssr_html.encode()), "braces": braces})
    meta_rows.append({"route": path, "lang": lang, "status": status, **m, "dom_lang": dom_meta["lang"], "dom_title": dom_meta["title"], "dom_canonical": dom_meta["canonical"], "dom_robots": dom_meta["robots"], "dom_og_locale": dom_meta["og_locale"], "dom_hreflang_n": dom_meta["hreflang_n"], "dom_ld_n": dom_meta["ld_n"]})
    # FAQ JSON-LD vs visible
    ld = faq_ld(ssr_html)
    if ld:
        vis_q = [norm(x) for x in page.locator("main details summary, main summary").all_inner_texts()]
        miss_q = [x["q"] for x in ld if x["q"] not in dom_tc]
        miss_a = [x["a"][:80] for x in ld if x["a"] and x["a"] not in dom_tc]
        faq.append({"route": path, "lang": lang, "ld_n": len(ld), "visible_summary_n": len(vis_q), "ld_q_missing_in_dom": miss_q, "ld_a_missing_in_dom": miss_a,
                    "summary_not_in_ld": [q for q in vis_q if q not in [x["q"] for x in ld]]})
    csp = page.evaluate("() => window.__r575.csp")
    name = (path.strip("/").replace("/", "_").replace("?q=", "q_") or "home") + "_" + lang
    page.screenshot(path=f"{SHOT}/{name}_1280_light.png")
    # keyboard reachability (desktop light)
    seq = []
    page.evaluate("() => { document.activeElement && document.activeElement.blur(); scrollTo(0,0); }")
    for _ in range(25):
        page.keyboard.press("Tab")
        seq.append(page.evaluate("() => { const e=document.activeElement; if(!e||e===document.body) return 'BODY'; const r=e.getBoundingClientRect(); const fv = e.matches(':focus-visible'); return e.tagName.toLowerCase()+'|'+(e.getAttribute('aria-label')||e.innerText||e.value||e.placeholder||'').replace(/\\s+/g,' ').trim().slice(0,30)+'|'+(r.width>0&&r.height>0?'vis':'0x0')+'|'+(fv?'fv':'nofv'); }"))
    uniq = len(set(seq)); body_hits = seq.count("BODY")
    keyboard.append({"route": path, "lang": lang, "tab_seq": seq, "unique_focused": uniq, "body_hits": body_hits, "no_focus_visible": sum(1 for s in seq if s.endswith("nofv") and s != "BODY"), "zero_size_focused": sum(1 for s in seq if "|0x0|" in s)})
    # dark desktop
    page.evaluate("() => { localStorage.setItem('domainhunter:theme','dark'); document.documentElement.classList.remove('light'); document.documentElement.classList.add('dark'); scrollTo(0,0); }")
    page.wait_for_timeout(300)
    page.screenshot(path=f"{SHOT}/{name}_1280_dark.png")
    # 375px both themes
    for th in ("light", "dark"):
        page.set_viewport_size({"width": 375, "height": 812})
        page.evaluate(f"() => {{ localStorage.setItem('domainhunter:theme','{th}'); document.documentElement.classList.toggle('light', '{th}'==='light'); document.documentElement.classList.toggle('dark', '{th}'==='dark'); scrollTo(0,0); }}")
        page.wait_for_timeout(400)
        geo = page.evaluate("() => ({innerWidth: innerWidth, scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, bodyScrollWidth: document.body.scrollWidth, scrollX_max: Math.max(0, document.documentElement.scrollWidth - innerWidth), bodyBg: getComputedStyle(document.body).backgroundColor, htmlClass: document.documentElement.className})")
        wide = page.evaluate("() => [...document.querySelectorAll('body *')].filter(e => { const r=e.getBoundingClientRect(); return r.right > innerWidth + 1 && r.width > 0 && getComputedStyle(e).position !== 'fixed'; }).slice(0,8).map(e => ({tag: e.tagName.toLowerCase(), cls: (e.className||'').toString().slice(0,60), right: Math.round(e.getBoundingClientRect().right), w: Math.round(e.getBoundingClientRect().width)}))")
        page.screenshot(path=f"{SHOT}/{name}_375_{th}.png")
        layout.append({"route": path, "lang": lang, "theme": th, **geo, "overflow": geo["scrollWidth"] > geo["innerWidth"] or geo["bodyScrollWidth"] > geo["innerWidth"], "elements_beyond_viewport": wide})
        if th == "light":
            small = page.evaluate("""() => [...document.querySelectorAll('a,button,input,select,textarea,[role=button],[role=switch],[role=tab],summary')]
              .filter(e => { const r=e.getBoundingClientRect(); const s=getComputedStyle(e); return r.width>0 && r.height>0 && s.visibility!=='hidden'; })
              .map(e => { const r=e.getBoundingClientRect(); const s=getComputedStyle(e); const b=getComputedStyle(e,'::before');
                 const bh = s.position!=='static' && b.content!=='none' && b.position==='absolute' ? 44 : 0;
                 return {tag:e.tagName.toLowerCase(), w:Math.round(r.width), h:Math.round(r.height), hitH: Math.max(Math.round(r.height), bh), text:(e.getAttribute('aria-label')||e.innerText||e.value||e.placeholder||e.className||'').toString().replace(/\\s+/g,' ').slice(0,40), inline: s.display==='inline', tap: e.classList.contains('tap-target')} })
              .filter(x => x.hitH < 44 || x.w < 44)""")
            total = page.evaluate("() => [...document.querySelectorAll('a,button,input,select,textarea,[role=button],[role=switch],[role=tab],summary')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0}).length")
            non_inline = [s for s in small if not (s["tag"] == "a" and s["inline"])]
            touch.append({"route": path, "lang": lang, "visible_interactive": total, "under44_any": len(small),
                          "under44_inline_text_links": len(small) - len(non_inline),
                          "under44_controls_h": sorted([s for s in non_inline if s["hitH"] < 44], key=lambda s: s["hitH"])[:40],
                          "under44_controls_w_only": [s for s in non_inline if s["hitH"] >= 44 and s["w"] < 44][:20]})
    expected = EXPECTED.get(path)
    noise = [r for r in ev["responses4xx"] if expected and r["status"] == expected]
    real4xx = [r for r in ev["responses4xx"] if r not in noise]
    console_noise = [c for c in ev["console"] if expected and "Failed to load resource" in c["text"]]
    console_real = [c for c in ev["console"] if c not in console_noise]
    results.append({"route": path, "lang": lang, "url": url, "status": status, "expected": expected or 200,
                    "console_real": console_real, "console_expected_noise": len(console_noise), "pageerror": ev["pageerror"],
                    "requestfailed": ev["requestfailed"], "responses4xx_real": real4xx, "responses4xx_expected_noise": len(noise),
                    "csp_violations": csp, "ai_search_requests": ai_calls, "api_requests": api_calls, "unknown_reasons": page.evaluate("() => [...document.querySelectorAll('[data-unknown-reason]')].map(e => e.getAttribute('data-unknown-reason'))"), "landing": scroll_y0})
    page.close()
    print(f"{path:22s} {lang} st={status} console={len(console_real)} perr={len(ev['pageerror'])} rf={len(ev['requestfailed'])} 4xx={len(real4xx)} csp={len(csp)} h1eq={ssr_h1==dom_h1} cov={ssr_cmp[-1]['ssr_chunk_coverage']} br={braces} pmiss={len(cs-cd)} tab_uniq={uniq} body={body_hits} ovf={[l['overflow'] for l in layout[-2:]]} u44={touch[-1]['under44_any']}", flush=True)

def save():
    json.dump(results, open(f"{OUT}/visits.json", "w"), ensure_ascii=False, indent=1)
    json.dump(ssr_cmp, open(f"{OUT}/ssr-vs-dom.json", "w"), ensure_ascii=False, indent=1)
    json.dump(meta_rows, open(f"{OUT}/head-meta.json", "w"), ensure_ascii=False, indent=1)
    json.dump(layout, open(f"{OUT}/layout-375.json", "w"), ensure_ascii=False, indent=1)
    json.dump(touch, open(f"{OUT}/touch-targets-375.json", "w"), ensure_ascii=False, indent=1)
    json.dump(faq, open(f"{OUT}/faq-ld-vs-visible.json", "w"), ensure_ascii=False, indent=1)
    json.dump(keyboard, open(f"{OUT}/keyboard-tab.json", "w"), ensure_ascii=False, indent=1)

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME, headless=True, args=["--no-sandbox"])
    ctx = b.new_context(locale="zh-CN", user_agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 r575-audit-headless")
    live = {"id": "none", "revokeToken": ""}  # no share in extra run
    _unused = lambda: ctx.request.post(f"{ORIGIN}/api/share", data=json.dumps({"items": [{"domain": "r575-live-probe.com", "status": "available"}], "query": "r575 live"}), headers={"content-type": "application/json"}).json()
    json.dump(live, open(f"{OUT}/live_share.json", "w"))
    ROUTES = [f"/s/{live['id']}" if r == "/s/LIVE" else r for r in ROUTES]
    only = sys.argv[1:]  # optional subset
    for path in ROUTES:
        if only and path not in only: continue
        for lang in ("zh", "en"):
            try: visit(ctx, path, lang)
            except Exception as e:
                print("ERR", path, lang, e, flush=True); results.append({"route": path, "lang": lang, "error": str(e)[:300]})
            save()
    b.close()
print("DONE")
