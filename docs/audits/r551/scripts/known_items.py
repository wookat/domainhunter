"""R545 P2 已知项复核（零 AI）：P2-1 375 chip 截断、P2-2 .ai 两年起注、P2-3 价格来源/时间、P2-4 advanced 命名、P2-5 批量进度、P2-6 内容页 Shortlist 一跳、P3-7 首页 chip 无 ¥。"""
import json, re
from playwright.sync_api import sync_playwright
CHROME = open("/home/ubuntu/r551/tools/chrome_path").read().strip()
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140 Safari/537.36 r551-audit"
BASE = "https://hunt.zalize.com"
R = {"ai_calls": []}
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME, headless=True, args=["--no-sandbox"])
    ctx = b.new_context(user_agent=UA, viewport={"width": 375, "height": 812}, locale="zh-CN", device_scale_factor=2)
    ctx.on("request", lambda r: R["ai_calls"].append(r.url) if "/api/ai-search" in r.url else None)
    pg = ctx.new_page()
    # P2-2 /tld/ai
    pg.goto(BASE + "/tld/ai", wait_until="networkidle")
    txt = pg.evaluate("() => document.body.innerText")
    R["p2_2_tld_ai"] = {"has_two_year_zh": bool(re.search(r"两年|2 ?年起|最低.*年限", txt)), "price_line": [l for l in txt.split("\n") if "$82" in l or "注册" in l and "$" in l][:4]}
    pg.goto(BASE + "/tld/ai?lang=en", wait_until="networkidle")
    txt = pg.evaluate("() => document.body.innerText")
    R["p2_2_tld_ai"]["has_two_year_en"] = bool(re.search(r"two[- ]year|2[- ]year|minimum term", txt, re.I))
    # P2-3 /prices 来源与时间
    pg.goto(BASE + "/prices", wait_until="networkidle")
    txt = pg.evaluate("() => document.body.innerText")
    R["p2_3_prices_source"] = [l for l in txt.split("\n") if re.search(r"Porkbun|实时|更新|拉取|UTC|汇率", l)][:6]
    # 首页 375：精确核验 → 查更多后缀 → chip 截断 / 价格 ¥ / 来源
    pg.goto(BASE + "/?lang=zh", wait_until="networkidle")
    pg.get_by_role("button", name="精确核验").click()
    ta = pg.locator("#home-description"); ta.fill("chaxiang"); pg.wait_for_timeout(1200)
    pg.wait_for_function("() => !document.body.innerText.includes('核验中') || true"); pg.wait_for_timeout(6000)
    more = pg.get_by_role("button", name=re.compile(r"查更多后缀"))
    R["p2_1_more_btn"] = more.count()
    if more.count():
        more.first.click(); pg.wait_for_timeout(15000)
    rows = pg.evaluate("""() => Array.from(document.querySelectorAll('main [class*="rounded"]')).filter(e => /chaxiang\\./.test(e.innerText) && e.innerText.length < 120).slice(0, 400).map(e => { const r = e.getBoundingClientRect(); const dom = e.querySelector('span,code,strong'); return { text: e.innerText.replace(/\\n/g,' | ').slice(0,80), w: Math.round(r.width), h: Math.round(r.height), right: Math.round(r.right), clipped: dom ? dom.scrollWidth > dom.clientWidth + 1 : null, ellipsis: /…|\\.\\.\\./.test(e.innerText) }; })""")
    R["p2_1_rows_sample"] = [r for r in rows if r["clipped"] or r["ellipsis"] or ".com.cn" in r["text"] or ".cc" in r["text"]][:12]
    R["p2_1_rows_total"] = len(rows)
    R["layout"] = pg.evaluate("() => ({innerWidth: innerWidth, scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, bodyScrollWidth: document.body.scrollWidth})")
    body = pg.evaluate("() => document.querySelector('main').innerText")
    R["p3_7_home_chip_price_samples"] = [l for l in body.split("\n") if "$" in l][:6]
    R["p3_7_home_has_yen"] = "¥" in body or "￥" in body
    R["p2_3_home_source_line"] = [l for l in body.split("\n") if re.search(r"Porkbun|实时价|汇率|拉取", l)][:4]
    pg.screenshot(path="/home/ubuntu/r551/functional/07_known_home_375_more.png", full_page=True)
    # P2-4 /advanced 命名 + P2-5 进度
    pg.goto(BASE + "/advanced?lang=zh", wait_until="networkidle")
    body = pg.evaluate("() => document.querySelector('main').innerText")
    R["p2_4_advanced"] = {"title": pg.title(), "h1": pg.evaluate("() => Array.from(document.querySelectorAll('h1,h2')).map(e=>e.innerText).slice(0,6)"), "paste_box_top": pg.evaluate("() => { const t = document.querySelector('main textarea'); return t ? Math.round(t.getBoundingClientRect().top + scrollY) : null; }"), "viewport_h": 812}
    ta = pg.locator("main textarea").first
    ta.fill("\n".join(f"r551known{i}.com" for i in range(12)))
    pg.wait_for_timeout(500)
    btn = pg.get_by_role("button", name=re.compile(r"核验 \d+ 个域名|核验"))
    labels_before = pg.evaluate("() => Array.from(document.querySelectorAll('main button')).map(b=>b.innerText).filter(Boolean)")
    btn.first.click(); pg.wait_for_timeout(1500)
    mid = pg.evaluate("() => document.querySelector('main').innerText")
    R["p2_5_progress_mid"] = [l for l in mid.split("\n") if re.search(r"\d+\s*/\s*\d+|已核验|进度|用时|核验中|已识别", l)][:6]
    pg.wait_for_timeout(12000)
    end = pg.evaluate("() => document.querySelector('main').innerText")
    R["p2_5_progress_end"] = [l for l in end.split("\n") if re.search(r"\d+\s*/\s*\d+|已核验|进度|用时|核验中|已识别|可注册 \d+|已注册 \d+", l)][:8]
    R["p2_5_yen_in_advanced"] = "¥" in end
    pg.screenshot(path="/home/ubuntu/r551/functional/08_known_advanced_375.png", full_page=True)
    # P2-6 内容页 Shortlist 一跳（桌面）
    ctx2 = b.new_context(user_agent=UA, viewport={"width": 1280, "height": 900}, locale="zh-CN")
    ctx2.on("request", lambda r: R["ai_calls"].append(r.url) if "/api/ai-search" in r.url else None)
    p2 = ctx2.new_page(); p2.goto(BASE + "/tld/ai", wait_until="networkidle")
    sl = p2.get_by_role("link", name=re.compile(r"候选清单|Shortlist")).or_(p2.get_by_role("button", name=re.compile(r"候选清单|Shortlist")))
    R["p2_6"] = {"controls": sl.count()}
    if sl.count():
        sl.first.click(); p2.wait_for_timeout(1500)
        R["p2_6"]["url_after_one_click"] = p2.url
    ctx.close(); ctx2.close(); b.close()
json.dump(R, open("/home/ubuntu/r551/functional/known_items.json", "w"), ensure_ascii=False, indent=1)
print(json.dumps(R, ensure_ascii=False, indent=1)[:6000])
