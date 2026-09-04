import json, re, sys, time
from playwright.sync_api import sync_playwright

BASE = "https://hunt.zalize.com"
SHOTS = "screenshots-r310"
findings = {}
DONE_JS = "() => { const e=[...document.querySelectorAll('main *')].find(x=>x.childElementCount===0&&/核验完成|Check complete/.test(x.textContent||'')); return e?e.textContent.trim():null; }"

with sync_playwright() as p:
    b = p.chromium.connect_over_cdp("http://localhost:29229")
    ctx = b.contexts[0]
    page = ctx.new_page()
    page.goto(BASE + "/", wait_until="networkidle")
    page.evaluate("localStorage.setItem('domainhunter:lang','zh')")
    page.reload(wait_until="networkidle")
    page.get_by_role("button", name=re.compile("精确核验|Exact check")).first.click()
    inp = page.locator("main textarea, main input[type=text]").first
    inp.fill("qzxvkw9r310e")
    inp.press("Enter")
    for _ in range(60):
        if page.evaluate(DONE_JS): break
        time.sleep(1)
    page.get_by_role("button", name=re.compile("查更多后缀|more TLDs")).first.click()
    for _ in range(240):
        s2 = page.evaluate(DONE_JS)
        if s2 and "193" in s2: break
        time.sleep(1)
    findings["quick_all"] = s2
    # click unknown filter
    page.get_by_role("button", name=re.compile("未知|Unknown")).first.click()
    time.sleep(0.5)
    chips = page.evaluate("() => [...document.querySelectorAll('main a[href], main [class*=rounded]')].filter(x=>/未知|unknown/i.test(x.textContent||'')).length")
    page.screenshot(path=f"{SHOTS}/B4-before-recheck.png")
    info = page.evaluate("""() => {
      const btns=[...document.querySelectorAll('main button')];
      const rc = btns.filter(b=>/重查|重新核验|recheck|retry/i.test((b.getAttribute('title')||'')+(b.getAttribute('aria-label')||'')+(b.textContent||'')));
      return {recheckBtns: rc.length, titles: rc.slice(0,3).map(b=>b.getAttribute('title')||b.getAttribute('aria-label')||b.textContent.trim())};
    }""")
    findings["unknown_filter_recheck"] = info
    unknown_domains = page.evaluate("() => [...document.querySelectorAll('main *')].filter(x=>x.childElementCount===0&&/qzxvkw9r310e\\./.test(x.textContent||'')).map(x=>x.textContent.trim()).slice(0,12)")
    findings["unknown_domains_visible"] = unknown_domains
    if info["recheckBtns"]:
        page.evaluate("""() => { const btns=[...document.querySelectorAll('main button')].filter(b=>/重查|重新核验|recheck|retry/i.test((b.getAttribute('title')||'')+(b.getAttribute('aria-label')||'')+(b.textContent||''))); btns[0].click(); }""")
        time.sleep(10)
        after = page.evaluate("""() => { const btns=[...document.querySelectorAll('main button')].filter(b=>/重查|重新核验|recheck|retry/i.test((b.getAttribute('title')||'')+(b.getAttribute('aria-label')||'')+(b.textContent||''))); return btns.length; }""")
        findings["recheck_btns_after"] = after
        page.screenshot(path=f"{SHOTS}/B4b-after-recheck.png")
    page.close()

json.dump(findings, open(sys.argv[1], "w"), ensure_ascii=False, indent=2)
print(json.dumps(findings, ensure_ascii=False, indent=1))
