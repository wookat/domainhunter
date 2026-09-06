"""Attach to the recorded hunt.zalize.com tab over CDP; log every /api request; apply
viewport / Accept-Language from ctl.json (polled every 0.5s). Keep running."""
import json, os, time, datetime
from playwright.sync_api import sync_playwright

CTL = "/home/ubuntu/r545/ctl.json"
LOG = "/home/ubuntu/r545/net.log"

def now():
    return datetime.datetime.utcnow().isoformat(timespec="milliseconds") + "Z"

def read_ctl():
    try:
        return json.load(open(CTL))
    except Exception:
        return {}

with sync_playwright() as p:
    b = p.chromium.connect_over_cdp("http://localhost:29229")
    ctx = b.contexts[0]
    page = None
    for pg in ctx.pages:
        if "hunt.zalize.com" in pg.url:
            page = pg
    if page is None:
        page = ctx.new_page()
        page.goto("https://hunt.zalize.com/404-r545-keeper", wait_until="domcontentloaded")
    log = open(LOG, "a")

    def on_req(req):
        u = req.url
        if "hunt.zalize.com/api/" in u or "/mcp" in u or "ai-search" in u:
            body = ""
            try:
                body = (req.post_data or "")[:300]
            except Exception:
                pass
            log.write(f"{now()} {req.method} {u} {body}\n"); log.flush()
            if "ai-search" in u:
                log.write(f"{now()} !!!!! AI-SEARCH REQUEST !!!!!\n"); log.flush()

    def on_nav(frame):
        if frame == page.main_frame:
            log.write(f"{now()} NAV {frame.url}\n"); log.flush()

    page.on("request", on_req)
    page.on("framenavigated", on_nav)
    cdp = ctx.new_cdp_session(page)
    applied = {}
    log.write(f"{now()} keeper attached to {page.url}\n"); log.flush()
    tick = 0
    while True:
        c = read_ctl()
        tick += 1
        if c == applied and c.get("viewport") == "375" and tick % 3 == 0:
            try:
                cdp.send("Emulation.setTouchEmulationEnabled", {"enabled": True, "maxTouchPoints": 5})
                cdp.send("Emulation.setEmitTouchEventsForMouse", {"enabled": True, "configuration": "mobile"})
            except Exception as e:
                log.write(f"{now()} reapply touch failed {e}\n"); log.flush()
        if c != applied:
            lang = c.get("lang")
            if lang:
                al = "zh-CN,zh;q=0.9,en;q=0.5" if lang == "zh" else "en-US,en;q=0.9"
                cdp.send("Network.enable")
                cdp.send("Network.setExtraHTTPHeaders", {"headers": {"Accept-Language": al}})
                cdp.send("Emulation.setLocaleOverride", {"locale": "zh-CN" if lang == "zh" else "en-US"})
            vp = c.get("viewport")
            if vp == "375":
                cdp.send("Emulation.setDeviceMetricsOverride", {"width": 375, "height": 812, "deviceScaleFactor": 2, "mobile": True, "screenWidth": 375, "screenHeight": 812})
                cdp.send("Emulation.setTouchEmulationEnabled", {"enabled": True, "maxTouchPoints": 5})
                cdp.send("Emulation.setEmitTouchEventsForMouse", {"enabled": True, "configuration": "mobile"})
                cdp.send("Emulation.setUserAgentOverride", {"userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1", "acceptLanguage": "zh-CN,zh;q=0.9" if lang == "zh" else "en-US,en;q=0.9", "platform": "iPhone"})
            elif vp == "desktop":
                cdp.send("Emulation.setDeviceMetricsOverride", {"width": 0, "height": 0, "deviceScaleFactor": 0, "mobile": False})
                cdp.send("Emulation.clearDeviceMetricsOverride")
                cdp.send("Emulation.setTouchEmulationEnabled", {"enabled": False})
                cdp.send("Emulation.setEmitTouchEventsForMouse", {"enabled": False})
                cdp.send("Emulation.setUserAgentOverride", {"userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36", "acceptLanguage": "zh-CN,zh;q=0.9" if lang == "zh" else "en-US,en;q=0.9"})
            log.write(f"{now()} CTL applied {json.dumps(c)}\n"); log.flush()
            applied = c
        page.wait_for_timeout(500)
