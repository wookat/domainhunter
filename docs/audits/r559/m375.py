import sys, json, base64, datetime, os, time
from playwright.sync_api import sync_playwright
OUT = "/home/ubuntu/repos/domainhunter/docs/audits/screenshots-r559"
pages = [("home-zh","https://hunt.zalize.com/?lang=zh"),
         ("home-q-chaxiang","https://hunt.zalize.com/?q=chaxiang"),
         ("shortlist","https://hunt.zalize.com/shortlist"),
         ("share","https://hunt.zalize.com/s/LYpSNRZ2gH"),
         ("monitors","https://hunt.zalize.com/monitors"),
         ("advanced","https://hunt.zalize.com/advanced"),
         ("prices","https://hunt.zalize.com/prices"),
         ("vs-com-vs-io","https://hunt.zalize.com/vs/com-vs-io"),
         ("tld-cn","https://hunt.zalize.com/tld/cn"),
         ("why","https://hunt.zalize.com/why")]
theme = sys.argv[1]  # dark|light
with sync_playwright() as p:
    b = p.chromium.connect_over_cdp("http://localhost:29229")
    ctx = b.contexts[0]
    pg = next(x for x in ctx.pages if "hunt.zalize.com" in x.url)
    sess = ctx.new_cdp_session(pg)
    sess.send("Emulation.setDeviceMetricsOverride", {"width":375,"height":812,"deviceScaleFactor":2,"mobile":True})
    sess.send("Emulation.setTouchEmulationEnabled", {"enabled":True})
    for name,url in pages:
        pg.goto(url, wait_until="networkidle"); time.sleep(1.2)
        pg.evaluate(f"() => {{ localStorage.setItem('domainhunter:theme','{theme}'); }}")
        cur = pg.evaluate("() => document.documentElement.classList.contains('light')?'light':'dark'")
        if cur != theme:
            pg.locator('header button[title*="浅色"], header button[title*="theme" i], header button[title*="Theme"]').first.click(); time.sleep(0.6)
        info = pg.evaluate("""() => ({url: location.href, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, bsw: document.body.scrollWidth, iw: innerWidth, light: document.documentElement.classList.contains('light'), h1: document.querySelector('h1')?.innerText?.slice(0,60)})""")
        if name=="home-q-chaxiang": time.sleep(6); info["sw2"]=pg.evaluate("()=>document.documentElement.scrollWidth")
        n = len([f for f in os.listdir(OUT) if f[:2].isdigit()])+1
        path=f"{OUT}/{n:02d}-375-{theme}-{name}.png"
        r = sess.send("Page.captureScreenshot", {"format":"png"})
        open(path,"wb").write(base64.b64decode(r["data"]))
        info.update(shot=os.path.basename(path), theme=theme, at=datetime.datetime.now(datetime.timezone.utc).isoformat())
        open("/home/ubuntu/r559/probes.jsonl","a").write(json.dumps(info, ensure_ascii=False)+"\n")
        print(json.dumps(info, ensure_ascii=False))
    if len(sys.argv)>2 and sys.argv[2]=="reset":
        sess.send("Emulation.clearDeviceMetricsOverride"); sess.send("Emulation.setTouchEmulationEnabled", {"enabled":False})
