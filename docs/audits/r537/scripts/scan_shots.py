import time, sys, re
from playwright.sync_api import sync_playwright
OUT = "/home/ubuntu/r537/shots"
import os; os.makedirs(OUT, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.connect_over_cdp("http://localhost:29229")
    ctx = b.contexts[0]
    page = ctx.new_page()
    page.set_viewport_size({"width": 1366, "height": 900})
    page.goto("https://developer.mozilla.org/en-US/observatory/analyze?host=hunt.zalize.com", wait_until="domcontentloaded")
    time.sleep(6)
    page.screenshot(path=f"{OUT}/observatory.png", full_page=False)
    txt = page.inner_text("body")
    m = re.search(r"(Score:?\s*\d+.*?|\d+\s*/\s*100)", txt)
    print("observatory text snippet:", re.sub(r"\s+", " ", txt[:900]))
    page.goto("https://securityheaders.com/?q=hunt.zalize.com&followRedirects=on", wait_until="domcontentloaded")
    time.sleep(6)
    page.screenshot(path=f"{OUT}/securityheaders.png", full_page=False)
    txt = page.inner_text("body")
    print("securityheaders text snippet:", re.sub(r"\s+", " ", txt[:1500]))
    page.screenshot(path=f"{OUT}/securityheaders_full.png", full_page=True)
    page.close()
