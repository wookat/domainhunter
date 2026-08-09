import json, sys, time
from playwright.sync_api import sync_playwright

BASE = "https://hunt.zalize.com"
SHOTS = "screenshots-r328"
findings = {}
console_errors = []

with sync_playwright() as p:
    b = p.chromium.connect_over_cdp("http://localhost:29229")
    ctx = b.contexts[0]
    page = ctx.new_page()
    page.on("console", lambda m: console_errors.append({"type": m.type, "text": m.text[:200], "url": page.url}) if m.type == "error" else None)
    page.on("pageerror", lambda e: console_errors.append({"type": "pageerror", "text": str(e)[:200], "url": page.url}))

    # zh mode: footer counts + templates zh labels + prefill zh
    page.goto(BASE + "/", wait_until="networkidle")
    page.evaluate("localStorage.setItem('domainhunter:lang','zh')")
    page.reload(wait_until="networkidle"); time.sleep(1)
    findings["footer_counts_zh"] = page.evaluate("() => [...document.querySelectorAll('footer *')].map(e=>e.textContent.trim()).filter(t=>t.length<40&&/\\d{3}/.test(t)).slice(0,12)")
    page.evaluate("() => { const b=[...document.querySelectorAll('main button')].find(x=>/^\\+\\d+/.test(x.textContent.trim())); if(b) b.click(); }")
    time.sleep(0.5)
    findings["templates_zh_buttons"] = page.evaluate("() => [...document.querySelectorAll('main button')].filter(b=>/水果店|海鲜|服装定制|马术|射箭|移民/.test(b.textContent)).map(b=>b.textContent.trim())")
    page.screenshot(path=f"{SHOTS}/F2-home-templates-zh.png")
    # click one new template chip -> textarea prefilled (no submit)
    page.evaluate("() => { const b=[...document.querySelectorAll('main button')].find(x=>/水果店/.test(x.textContent)); if(b) b.click(); }")
    time.sleep(0.3)
    findings["template_click_prefill_zh"] = page.evaluate("() => { const ta=document.querySelector('main textarea'); return ta ? ta.value.slice(0,30) : null; }")
    # /?tpl= zh prefill
    page.goto(BASE + "/?tpl=seafood", wait_until="networkidle"); time.sleep(0.8)
    findings["tpl_seafood_zh"] = page.evaluate("() => { const ta=document.querySelector('main textarea'); return ta ? ta.value.slice(0,30) : null; }")

    # theme toggle via title attribute
    page.goto(BASE + "/", wait_until="networkidle"); time.sleep(0.5)
    bg0 = page.evaluate("() => getComputedStyle(document.body).backgroundColor")
    page.evaluate("() => { const b=[...document.querySelectorAll('header button')].find(x=>/light\\/dark|浅色\\/暗色/i.test(x.getAttribute('title')||'')); if(b) b.click(); }")
    time.sleep(0.5)
    bg1 = page.evaluate("() => getComputedStyle(document.body).backgroundColor")
    cls1 = page.evaluate("() => document.documentElement.className")
    ls1 = page.evaluate("() => localStorage.getItem('domainhunter:theme')")
    page.reload(wait_until="networkidle"); time.sleep(0.5)
    bg2 = page.evaluate("() => getComputedStyle(document.body).backgroundColor")
    page.screenshot(path=f"{SHOTS}/I2-theme-light.png")
    page.evaluate("() => { const b=[...document.querySelectorAll('header button')].find(x=>/light\\/dark|浅色\\/暗色/i.test(x.getAttribute('title')||'')); if(b) b.click(); }")
    time.sleep(0.5)
    bg3 = page.evaluate("() => getComputedStyle(document.body).backgroundColor")
    findings["theme"] = {"initial": bg0, "toggled": bg1, "html_class": cls1, "ls": ls1, "persist_after_reload": bg2, "back": bg3}

    # share live UI innerText check (create -> verify -> revoke -> 410)
    created = page.evaluate("""async () => {
      const r = await fetch('/api/share', {method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({items:[{domain:'qzxvkw9r328b.com'},{domain:'google.com'}]})});
      return {status: r.status, body: await r.json()};
    }""")
    sid = created["body"].get("id"); tok = created["body"].get("revokeToken")
    findings["share_create_b"] = {"status": created["status"], "id": sid, "has_token": bool(tok)}
    page.goto(f"{BASE}/s/{sid}", wait_until="networkidle"); time.sleep(1.5)
    txt = page.evaluate("() => document.querySelector('main') ? document.querySelector('main').innerText : ''")
    findings["share_live_innertext"] = {"has_domain1": "qzxvkw9r328b.com" in txt, "has_domain2": "google.com" in txt, "has_copy_or_export": ("Copy" in txt or "复制" in txt or "CSV" in txt)}
    page.screenshot(path=f"{SHOTS}/H3-share-live-b.png")
    findings["share_revoke_b"] = page.evaluate("""async ([sid, tok]) => {
      const r = await fetch(`/api/share/${sid}`, {method:'DELETE', headers:{'Content-Type':'application/json'}, body: JSON.stringify({token: tok})});
      const g = await fetch(`/api/share/${sid}`);
      return {del: r.status, getAfter: g.status};
    }""", [sid, tok])

    # usage post-b
    findings["usage_post_b"] = page.evaluate("async () => await (await fetch('/api/usage')).json()")
    page.close()

findings["console_errors"] = console_errors
json.dump(findings, open(sys.argv[1], "w"), ensure_ascii=False, indent=2)
print(json.dumps(findings, ensure_ascii=False, indent=1)[:6000])
