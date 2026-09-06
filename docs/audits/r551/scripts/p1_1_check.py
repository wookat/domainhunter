"""R545 P1-1 状态核对：已注册域名入候选清单后是否仍显示首年价 + 去注册。零 AI。结束移除。"""
import json, re
from playwright.sync_api import sync_playwright
CHROME = open("/home/ubuntu/r551/tools/chrome_path").read().strip()
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140 Safari/537.36 r551-audit"
BASE = "https://hunt.zalize.com"; R = {"ai_calls": []}
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME, headless=True, args=["--no-sandbox"])
    ctx = b.new_context(user_agent=UA, viewport={"width": 1280, "height": 900}, locale="zh-CN")
    ctx.on("request", lambda r: R["ai_calls"].append(r.url) if "/api/ai-search" in r.url else None)
    pg = ctx.new_page(); pg.goto(BASE + "/?lang=zh", wait_until="networkidle")
    pg.get_by_role("button", name="精确核验").click(); pg.locator("#home-description").fill("google"); pg.keyboard.press("Enter")
    pg.wait_for_timeout(9000)
    row = pg.locator("main :text-matches('^google\\\\.com$')").first
    card = row.locator("xpath=ancestor::*[self::li or self::article or self::div][.//button][1]")
    R["row_text"] = card.inner_text()[:200]
    fav = card.get_by_role("button").filter(has=pg.locator("svg")).first
    btns = card.get_by_role("button"); R["row_buttons"] = [btns.nth(i).get_attribute("aria-label") or btns.nth(i).inner_text() for i in range(btns.count())]
    star = card.locator("button[aria-label*='候选'], button[aria-label*='星'], button[aria-label*='收藏'], button[aria-label*='hortlist']").first
    if star.count(): star.click(); R["starred_via"] = star.get_attribute("aria-label")
    else: fav.click(); R["starred_via"] = "first svg button"
    pg.wait_for_timeout(800)
    pg.goto(BASE + "/shortlist?lang=zh", wait_until="networkidle"); pg.wait_for_timeout(1500)
    txt = pg.evaluate("() => document.querySelector('main').innerText")
    R["shortlist_text"] = txt[:1200]
    R["google_row_has_price"] = bool(re.search(r"google\.com[\s\S]{0,200}?(首年|\$\d)", txt))
    R["google_row_has_register"] = bool(re.search(r"google\.com[\s\S]{0,300}?去注册", txt))
    R["bulk_register_label"] = re.findall(r"批量去注册[^\n]*", txt)
    pg.screenshot(path="/home/ubuntu/r551/functional/11_p1-1_shortlist_google.png", full_page=True)
    # 清理：移除 google.com
    rm = pg.locator("button[aria-label*='移除'], button[aria-label*='删除'], button:has-text('移除')").first
    if rm.count(): rm.click(); pg.wait_for_timeout(500)
    R["shortlist_storage_after"] = pg.evaluate("() => localStorage.getItem('domainhunter:shortlist')")
    ctx.close(); b.close()
json.dump(R, open("/home/ubuntu/r551/functional/p1_1_check.json", "w"), ensure_ascii=False, indent=1)
print(json.dumps(R, ensure_ascii=False, indent=1)[:3000])
