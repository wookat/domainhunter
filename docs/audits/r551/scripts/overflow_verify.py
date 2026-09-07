import json, sys
from playwright.sync_api import sync_playwright
CHROME = open("/home/ubuntu/r551/tools/chrome_path").read().strip()
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140 Safari/537.36 r551-audit"
BASE = "https://hunt.zalize.com"
items = [l.split("|") for l in sys.argv[1:]]
res = {}
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME, headless=True, args=["--no-sandbox"])
    for path, lang in items:
        ctx = b.new_context(user_agent=UA, viewport={"width": 375, "height": 812}, locale="zh-CN", device_scale_factor=2)
        pg = ctx.new_page(); pg.goto(BASE + path + "?lang=" + lang, wait_until="networkidle"); pg.wait_for_timeout(800)
        m = pg.evaluate("() => ({innerWidth: innerWidth, scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, bodyScrollWidth: document.body.scrollWidth})")
        res[path + "|" + lang] = m; print(path, lang, m, "OVERFLOW" if m["scrollWidth"] > 375 else "ok"); ctx.close()
    b.close()
json.dump(res, open("/home/ubuntu/r551/browser/overflow_verify_static_candidates.json", "w"), indent=1)
