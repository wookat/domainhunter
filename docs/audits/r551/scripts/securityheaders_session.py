"""Load securityheaders.com report for hunt.zalize.com in the session Chrome (real browser passes CF challenge); read grade + missing headers."""
import asyncio, json
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        b = await p.chromium.connect_over_cdp("http://localhost:29229")
        page = await b.contexts[0].new_page()
        await page.goto("https://securityheaders.com/?q=hunt.zalize.com&followRedirects=on", wait_until="domcontentloaded", timeout=60000)
        for _ in range(20):
            await page.wait_for_timeout(1500)
            t = await page.evaluate("() => document.body.innerText")
            if "Security Report Summary" in t or "Grade" in t and "Missing Headers" in t: break
        txt = await page.evaluate("() => document.body.innerText")
        grade = await page.evaluate("() => (document.querySelector('.score span, .score_lightgreen, .score_green, .score_orange, .score_red')||{}).innerText || null")
        await page.screenshot(path="/home/ubuntu/r551/security/securityheaders_com.png", full_page=True)
        open("/home/ubuntu/r551/security/securityheaders_com.txt", "w").write(txt)
        print("grade:", grade); print(txt[:1500])
        await page.close()
asyncio.run(main())
