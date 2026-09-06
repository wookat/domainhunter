"""R551 follow-ups: (1) /tld/de price-count artifact check innerText vs textContent; (2) /vs/clinic-vs-care zh 375 overflow detail + screenshot;
(3) 375 screenshots of /prices & /vs hub chips (touch target evidence). Headless, fresh context, zero AI."""
import json, re, sys
from playwright.sync_api import sync_playwright
CHROME = open("/home/ubuntu/r551/tools/chrome_path").read().strip() if __import__("os").path.exists("/home/ubuntu/r551/tools/chrome_path") else None
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140 Safari/537.36 r551-audit"
BASE = "https://hunt.zalize.com"
out = {}
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME, headless=True, args=["--no-sandbox"]) if CHROME else p.chromium.launch(headless=True, args=["--no-sandbox"])
    ai = []
    ctx = b.new_context(user_agent=UA, viewport={"width": 1280, "height": 900}, locale="zh-CN")
    ctx.on("request", lambda r: ai.append(r.url) if "/api/ai-search" in r.url else None)
    pg = ctx.new_page(); pg.goto(f"{BASE}/tld/de", wait_until="networkidle")
    out["tld_de_price_counts"] = pg.evaluate("""() => {
      const c = (s, re) => (s.match(re) || []).length;
      const it = document.body.innerText, tc = document.body.textContent;
      const open = [...document.querySelectorAll('details')].map(d => d.open);
      return {innerText_290: c(it, /\\$2\\.90/g), textContent_290: c(tc, /\\$2\\.90/g), innerText_407: c(it, /\\$4\\.07/g), textContent_407: c(tc, /\\$4\\.07/g), details_open: open};
    }""")
    pg.close()
    m = b.new_context(user_agent=UA, viewport={"width": 375, "height": 812}, device_scale_factor=2, is_mobile=True, has_touch=True, locale="zh-CN")
    m.on("request", lambda r: ai.append(r.url) if "/api/ai-search" in r.url else None)
    pg = m.new_page()
    for path, name in [("/vs/clinic-vs-care", "vs_clinic-vs-care_zh"), ("/vs/clinic-vs-care?lang=en", "vs_clinic-vs-care_en"), ("/vs/clinic-vs-care?lang=en", None)]:
        if name is None: continue
        pg.goto(f"{BASE}{path}", wait_until="networkidle")
        info = pg.evaluate("""() => {
          const de = document.documentElement;
          const t = document.querySelector('table.w-full');
          const wide = [...document.querySelectorAll('td, th')].map(e => ({tag: e.tagName, w: Math.round(e.getBoundingClientRect().width), text: e.innerText.trim().slice(0, 60), cls: e.className})).filter(e => e.w > 80);
          return {innerWidth: innerWidth, scrollWidth: de.scrollWidth, clientWidth: de.clientWidth, bodyScrollWidth: document.body.scrollWidth,
                  table: t ? {w: Math.round(t.getBoundingClientRect().width), right: Math.round(t.getBoundingClientRect().right), cls: t.className, parentCls: t.parentElement.className, parentW: Math.round(t.parentElement.getBoundingClientRect().width), parentOverflowX: getComputedStyle(t.parentElement).overflowX, caption: (t.querySelector('caption')||{}).innerText} : null,
                  cells: wide.slice(0, 20)};
        }""")
        out[f"overflow_{name}"] = info
        pg.screenshot(path=f"/home/ubuntu/r551/shots/followup_375_{name}_light.png", full_page=False)
        if "zh" in name:
            # scroll table into view for the shot
            pg.evaluate("() => { const t = document.querySelector('table.w-full'); if (t) t.scrollIntoView({block: 'center'}); }")
            pg.screenshot(path=f"/home/ubuntu/r551/shots/followup_375_{name}_table.png", full_page=False)
    for path, name, sel in [("/prices", "prices_related_vs_40px", "a[href^='/vs/']"), ("/vs", "vs_hub_chips_36px", "a[href^='#'], a[href^='/vs#'], nav a"), ("/tld", "tld_hub_chips_36px", "a[href^='#']"), ("/shortlist", "shortlist_empty_cta_40px", "button")]:
        pg.goto(f"{BASE}{path}", wait_until="networkidle")
        if path == "/prices":
            pg.evaluate("() => { const a = document.querySelector(\"a[href^='/vs/']\"); if (a) a.scrollIntoView({block: 'center'}); }")
        elif path in ("/vs", "/tld"):
            pg.evaluate("() => { const a = [...document.querySelectorAll('a')].find(a => /\\s\\d+$/.test(a.innerText.trim()) && a.getBoundingClientRect().height < 44 && a.getBoundingClientRect().height > 0); if (a) a.scrollIntoView({block: 'center'}); }")
        out[f"sample_{name}"] = pg.evaluate("""(sel) => [...document.querySelectorAll('a, button')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 44 && r.top >= 0 && r.top < 812; }).slice(0, 6).map(e => ({tag: e.tagName, h: Math.round(e.getBoundingClientRect().height), w: Math.round(e.getBoundingClientRect().width), text: e.innerText.trim().slice(0, 30), href: e.getAttribute('href'), cls: e.className.slice(0, 120)}))""", sel)
        pg.screenshot(path=f"/home/ubuntu/r551/shots/followup_375_{name}.png", full_page=False)
    out["ai_calls"] = ai
    b.close()
json.dump(out, open("/home/ubuntu/r551/browser/followup1.json", "w"), ensure_ascii=False, indent=1)
print(json.dumps(out, ensure_ascii=False, indent=1)[:6000])
