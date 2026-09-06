import json
from playwright.sync_api import sync_playwright
CHROME = open("/home/ubuntu/r551/tools/chrome_path").read().strip()
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140 Safari/537.36 r551-audit"
cands = json.load(open("/home/ubuntu/r551/browser/zh_unbreakable_runs.json"))
paths = []
for w, p, s in cands:
    if p not in paths: paths.append(p)
JS = """() => { const de = document.documentElement; return {innerWidth, scrollWidth: de.scrollWidth, clientWidth: de.clientWidth, bodyScrollWidth: document.body.scrollWidth}; }"""
res = []
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME, headless=True, args=["--no-sandbox"])
    ctx = b.new_context(user_agent=UA, viewport={"width": 375, "height": 812}, device_scale_factor=2, is_mobile=True, has_touch=True, locale="zh-CN")
    ai = []; ctx.on("request", lambda r: ai.append(r.url) if "/api/ai-search" in r.url else None)
    pg = ctx.new_page()
    for path in paths:
        pg.goto("https://hunt.zalize.com/" + path, wait_until="networkidle")
        r = pg.evaluate(JS); r["path"] = "/" + path; r["overflow"] = r["bodyScrollWidth"] > 375 or r["innerWidth"] > 375
        res.append(r); print(r, flush=True)
    b.close()
json.dump({"results": res, "ai_calls": ai}, open("/home/ubuntu/r551/browser/zh_overflow_verify_375.json", "w"), ensure_ascii=False, indent=1)
print("overflowing:", [r["path"] for r in res if r["overflow"]])
