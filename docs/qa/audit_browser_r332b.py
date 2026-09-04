import json, re, sys, time
from playwright.sync_api import sync_playwright

BASE = "https://hunt.zalize.com"
SHOTS = "screenshots-r332"
findings = {}

with sync_playwright() as p:
    b = p.chromium.connect_over_cdp("http://localhost:29229")
    ctx = b.contexts[0]
    page = ctx.new_page()

    # footer counts (zh)
    page.goto(BASE + "/?lang=zh", wait_until="networkidle"); time.sleep(1)
    findings["footer_hub_dedup"] = page.evaluate("""() => {
      const f=document.querySelector('footer');
      const c={};
      for (const pre of ['/tld/','/guide/','/vs/']) c[pre]=new Set([...(f?f.querySelectorAll(`a[href^="${pre}"]`):[])].map(a=>a.getAttribute('href').split('?')[0])).size;
      return c;
    }""")
    findings["footer_count_text"] = page.evaluate("() => { const f=document.querySelector('footer'); return f ? (f.innerText.match(/\\d{3}[^\\n]{0,12}/g)||[]).slice(0,12) : null; }")

    # home templates zh: expand +N, find 6 new R330 chips
    page.evaluate("localStorage.setItem('domainhunter:lang','zh')")
    page.goto(BASE + "/", wait_until="networkidle"); time.sleep(1)
    page.evaluate("() => { const b=[...document.querySelectorAll('main button')].find(x=>/^\\+\\d+/.test(x.textContent.trim())); if(b) b.click(); }")
    time.sleep(0.5)
    findings["templates_zh_buttons"] = page.evaluate("() => [...document.querySelectorAll('main button')].filter(b=>/卤味熟食|精品酒庄|日料餐厅|冰淇淋|青年旅舍|保龄球馆/.test(b.textContent)).map(b=>b.textContent.trim())")
    page.screenshot(path=f"{SHOTS}/F2-home-templates-zh.png")
    # click one chip -> prefill only (no submit)
    page.evaluate("() => { const b=[...document.querySelectorAll('main button')].find(x=>/卤味熟食/.test(x.textContent)); if(b) b.click(); }")
    time.sleep(0.5)
    findings["template_chip_prefill_deli_zh"] = page.evaluate("() => { const ta=document.querySelector('main textarea'); return ta ? ta.value.slice(0,40) : null; }")
    # zh ?tpl prefill
    tpl = {}
    for slug in ["deli", "winery", "sushi", "icecream", "hostel", "bowling"]:
        page.goto(BASE + "/?tpl=" + slug + "&lang=zh", wait_until="networkidle"); time.sleep(0.6)
        tpl[slug] = page.evaluate("() => { const ta=document.querySelector('main textarea'); return ta ? ta.value.slice(0,40) : null; }")
    findings["templates_prefill_zh"] = tpl
    # 375px home templates area no overflow
    cdp = ctx.new_cdp_session(page)
    cdp.send("Emulation.setDeviceMetricsOverride", {"width": 375, "height": 812, "deviceScaleFactor": 2, "mobile": True})
    page.goto(BASE + "/?lang=zh", wait_until="networkidle"); time.sleep(1)
    page.evaluate("() => { const b=[...document.querySelectorAll('main button')].find(x=>/^\\+\\d+/.test(x.textContent.trim())); if(b) b.click(); }")
    time.sleep(0.5)
    findings["home_375_templates_scrollWidth"] = page.evaluate("() => document.documentElement.scrollWidth")
    page.screenshot(path=f"{SHOTS}/F3-home-templates-375.png")
    cdp.send("Emulation.clearDeviceMetricsOverride")

    # SEO spot-check 6 pages
    seo = {}
    for path in ["/tld/church", "/tld/plumbing", "/guide/winery", "/guide/hostel", "/vs/lawyer-vs-legal", "/vs/rent-vs-rentals"]:
        page.goto(BASE + path, wait_until="networkidle"); time.sleep(0.5)
        seo[path] = page.evaluate("""() => ({
          title: document.title.slice(0,80),
          canonical: (document.querySelector('link[rel=canonical]')||{}).href||null,
          og_title: (document.querySelector('meta[property="og:title"]')||{content:null}).content,
          lang: document.documentElement.lang,
          jsonld: [...document.querySelectorAll('script[type="application/ld+json"]')].map(s=>{try{const j=JSON.parse(s.textContent);return j['@type']||(j['@graph']||[]).map(g=>g['@type']).join(',');}catch(e){return 'parse-error';}}),
          hreflang: [...document.querySelectorAll('link[rel=alternate][hreflang]')].map(l=>l.getAttribute('hreflang')),
        })""")
    findings["seo"] = seo

    page.close()

json.dump(findings, open(sys.argv[1], "w"), ensure_ascii=False, indent=2)
print(json.dumps(findings, ensure_ascii=False, indent=1)[:6000])
