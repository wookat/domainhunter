import json
from playwright.sync_api import sync_playwright
CHROME = open("/home/ubuntu/r551/tools/chrome_path").read().strip()
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140 Safari/537.36 r551-audit"
JS = """() => {
  const de = document.documentElement;
  const all = [...document.querySelectorAll('html, body, body *')].map(e => { const r = e.getBoundingClientRect(); return {tag: e.tagName, id: e.id, cls: (e.className||'').toString().slice(0,100), l: Math.round(r.left), w: Math.round(r.width), right: Math.round(r.right), sw: e.scrollWidth, ws: getComputedStyle(e).whiteSpace, text: (e.innerText||'').trim().slice(0,60)}; });
  const wide = all.filter(e => e.w > 376 || e.sw > 376 || e.right > 376).sort((a,b) => (b.w - a.w));
  return {innerWidth, scrollWidth: de.scrollWidth, clientWidth: de.clientWidth, bodyW: Math.round(document.body.getBoundingClientRect().width), bodySW: document.body.scrollWidth, wide: wide.slice(0, 15)};
}"""
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME, headless=True, args=["--no-sandbox"])
    for path in ["/vs/clinic-vs-care", "/vs/care-vs-clinic", "/vs/clinic-vs-care?theme=x"]:
        ctx = b.new_context(user_agent=UA, viewport={"width": 375, "height": 812}, device_scale_factor=2, is_mobile=True, has_touch=True, locale="zh-CN")
        pg = ctx.new_page(); pg.goto("https://hunt.zalize.com" + path, wait_until="networkidle")
        r = pg.evaluate(JS); print(path, {k: r[k] for k in r if k != 'wide'})
        for w in r['wide']: print("   ", w)
        # SSR-only (JS disabled) comparison
        ctx2 = b.new_context(user_agent=UA, viewport={"width": 375, "height": 812}, device_scale_factor=2, is_mobile=True, has_touch=True, locale="zh-CN", java_script_enabled=False)
        pg2 = ctx2.new_page(); pg2.goto("https://hunt.zalize.com" + path, wait_until="load")
        r2 = pg2.evaluate(JS); print("  SSR-only:", {k: r2[k] for k in r2 if k != 'wide'}, [ (w['tag'], w['w'], w['text'][:30]) for w in r2['wide'][:3]])
        ctx.close(); ctx2.close()
        break
    b.close()
