"""补测：P2-1 等待「查更多后缀」出现；P2-6 内容页 Shortlist 控件细节；advanced 结果行价格口径。零 AI。"""
import json, re
from playwright.sync_api import sync_playwright
CHROME = open("/home/ubuntu/r551/tools/chrome_path").read().strip()
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140 Safari/537.36 r551-audit"
BASE = "https://hunt.zalize.com"
R = {"ai_calls": [], "api": []}
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME, headless=True, args=["--no-sandbox"])
    ctx = b.new_context(user_agent=UA, viewport={"width": 375, "height": 812}, locale="zh-CN", device_scale_factor=2)
    ctx.on("request", lambda r: (R["ai_calls"].append(r.url) if "/api/ai-search" in r.url else None, R["api"].append(r.method + " " + r.url.replace(BASE, "")) if "/api/" in r.url else None))
    pg = ctx.new_page()
    pg.goto(BASE + "/?lang=zh", wait_until="networkidle")
    pg.get_by_role("button", name="精确核验").click()
    pg.locator("#home-description").fill("chaxiang")
    more = pg.get_by_role("button", name=re.compile(r"查更多后缀"))
    try:
        more.first.wait_for(state="visible", timeout=45000); R["more_label"] = more.first.inner_text()
    except Exception as e:
        R["more_error"] = str(e)[:200]
        R["main_text"] = pg.evaluate("() => document.querySelector('main').innerText")[:1500]
    if "more_label" in R:
        more.first.click()
        pg.wait_for_timeout(25000)
        rows = pg.evaluate("""() => Array.from(document.querySelectorAll('main *')).filter(e => typeof e.innerText === 'string' && e.children.length <= 6 && /^chaxiang\\.[a-z.]+/.test(e.innerText.trim()) && e.innerText.length < 60).map(e => { const r = e.getBoundingClientRect(); const c = e.closest('[class*=rounded]') || e; const cr = c.getBoundingClientRect(); return { text: e.innerText.replace(/\\n/g,' | '), elW: Math.round(r.width), elRight: Math.round(r.right), scrollW: e.scrollWidth, clientW: e.clientWidth, clipped: e.scrollWidth > e.clientWidth + 1, chipW: Math.round(cr.width), chipH: Math.round(cr.height) }; })""")
        dedup = {}
        for r in rows:
            k = r["text"].split(" | ")[0]
            if k not in dedup or r["clipped"]: dedup[k] = r
        rows = list(dedup.values())
        R["rows_total"] = len(rows)
        R["rows_clipped"] = [r for r in rows if r["clipped"]][:15]
        R["rows_comcn_cc"] = [r for r in rows if re.match(r"chaxiang\.(com\.cn|cc|net\.cn|org\.cn|co\.uk)\b", r["text"])]
        R["ellipsis_texts"] = [r["text"] for r in rows if "…" in r["text"]][:10]
        R["layout"] = pg.evaluate("() => ({innerWidth: innerWidth, scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, bodyScrollWidth: document.body.scrollWidth})")
        # 滚到 .com.cn 截图
        el = pg.locator("main :text-matches('^chaxiang\\\\.com\\\\.cn')").first
        if el.count():
            el.scroll_into_view_if_needed(); pg.wait_for_timeout(500)
            pg.screenshot(path="/home/ubuntu/r551/functional/09_known_home_375_comcn_chip.png")
        pg.screenshot(path="/home/ubuntu/r551/functional/10_known_home_375_more_full.png", full_page=True)
    # advanced 结果行价格口径
    pg.goto(BASE + "/advanced?lang=zh", wait_until="networkidle")
    pg.locator("main textarea").first.fill("r551known1.com\nr551known2.io\ngoogle.com")
    pg.get_by_role("button", name=re.compile(r"核验 \d+ 个域名")).first.click()
    pg.wait_for_timeout(12000)
    txt = pg.evaluate("() => document.querySelector('main').innerText")
    R["advanced_result_lines"] = [l for l in txt.split("\n") if re.search(r"r551known|google\.com|\$|¥", l)][:12]
    ctx.close()
    # P2-6 桌面内容页 Shortlist 控件
    ctx2 = b.new_context(user_agent=UA, viewport={"width": 1280, "height": 900}, locale="zh-CN")
    ctx2.on("request", lambda r: R["ai_calls"].append(r.url) if "/api/ai-search" in r.url else None)
    p2 = ctx2.new_page(); p2.goto(BASE + "/tld/ai", wait_until="networkidle")
    info = p2.evaluate("""() => Array.from(document.querySelectorAll('header a, header button, nav a, nav button')).map(e => ({tag: e.tagName, text: e.innerText.trim().slice(0,30), href: e.getAttribute('href'), aria: e.getAttribute('aria-label')}))""")
    R["p2_6_header_controls"] = info
    ctl = p2.locator("header a, header button").filter(has_text=re.compile(r"候选清单|Shortlist")).first
    if ctl.count():
        R["p2_6_ctl"] = {"tag": ctl.evaluate("e => e.tagName"), "href": ctl.get_attribute("href"), "text": ctl.inner_text()}
        ctl.click(); p2.wait_for_timeout(800); u1 = p2.url; p2.wait_for_timeout(3000); u2 = p2.url
        R["p2_6_ctl"].update({"url_0.8s": u1, "url_3.8s": u2, "title": p2.title()})
        if "/shortlist" not in u2:
            ctl2 = p2.locator("header a, header button").filter(has_text=re.compile(r"候选清单|Shortlist")).first
            if ctl2.count():
                ctl2.click(); p2.wait_for_timeout(1500); R["p2_6_ctl"]["url_after_second_click"] = p2.url
    # 同一控件在 SSR HTML 里是什么
    import urllib.request
    req = urllib.request.Request(BASE + "/tld/ai", headers={"User-Agent": UA}); h = urllib.request.urlopen(req).read().decode()
    m = re.search(r'<header.*?</header>', h, re.S)
    R["p2_6_ssr_header_links"] = re.findall(r'<a[^>]*href="([^"]*)"[^>]*>(.*?)</a>', m.group(0), re.S)[:12] if m else None
    ctx2.close(); b.close()
json.dump(R, open("/home/ubuntu/r551/functional/known_items2.json", "w"), ensure_ascii=False, indent=1)
print(json.dumps({k: v for k, v in R.items() if k != "api"}, ensure_ascii=False, indent=1)[:7000])
print("api calls:", len(R["api"]), "ai:", R["ai_calls"])
