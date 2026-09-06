"""Find the element(s) that widen the 375px layout viewport on /vs/clinic-vs-care (zh); compare with a few other zh /vs pages and non-mobile emulation."""
import json
from playwright.sync_api import sync_playwright
CHROME = open("/home/ubuntu/r551/tools/chrome_path").read().strip()
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140 Safari/537.36 r551-audit"
BASE = "https://hunt.zalize.com"
JS = """() => {
  const de = document.documentElement;
  const els = [...document.querySelectorAll('body *')].map(e => { const r = e.getBoundingClientRect(); return {tag: e.tagName, cls: (e.className||'').toString().slice(0,90), w: Math.round(r.width), right: Math.round(r.right), sw: e.scrollWidth, text: (e.innerText||'').trim().slice(0,50)}; }).filter(e => e.right > 376 || e.sw > 376);
  els.sort((a,b) => b.right - a.right);
  return {innerWidth, scrollWidth: de.scrollWidth, clientWidth: de.clientWidth, bodyScrollWidth: document.body.scrollWidth, vv: visualViewport.width, wide: els.slice(0, 12)};
}"""
out = {}
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME, headless=True, args=["--no-sandbox"])
    for mobile in (True, False):
        ctx = b.new_context(user_agent=UA, viewport={"width": 375, "height": 812}, device_scale_factor=2, is_mobile=mobile, has_touch=mobile, locale="zh-CN")
        pg = ctx.new_page()
        for path in ["/vs/clinic-vs-care", "/vs/clinic-vs-care?lang=en", "/vs/golf-vs-travel", "/vs/uk-vs-com", "/vs/page-vs-com", "/vs/shoes-vs-store", "/vs/one-vs-me"]:
            pg.goto(f"{BASE}{path}", wait_until="networkidle")
            out[f"mobile={mobile} {path}"] = pg.evaluate(JS)
        ctx.close()
    b.close()
json.dump(out, open("/home/ubuntu/r551/browser/followup2.json", "w"), ensure_ascii=False, indent=1)
for k, v in out.items():
    print(k, {x: v[x] for x in v if x != 'wide'})
    for w in v['wide'][:5]: print("   ", w)
