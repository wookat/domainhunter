import json, sys, time
from playwright.sync_api import sync_playwright

BASE = "https://hunt.zalize.com"
SHOTS = "screenshots-r324"
findings = {}

with sync_playwright() as p:
    b = p.chromium.connect_over_cdp("http://localhost:29229")
    ctx = b.contexts[0]
    page = ctx.new_page()

    # 1. share live render recheck
    created = page_ = None
    page.goto(BASE + "/", wait_until="networkidle")
    created = page.evaluate("""async () => {
      const r = await fetch('/api/share', {method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({items:[{domain:'qzxvkw9r324b.com'},{domain:'google.com'}]})});
      return {status: r.status, body: await r.json()};
    }""")
    sid = created["body"].get("id"); tok = created["body"].get("revokeToken")
    page.goto(f"{BASE}/s/{sid}", wait_until="networkidle"); time.sleep(3)
    findings["share_body_text"] = page.evaluate("() => document.querySelector('main') ? document.querySelector('main').innerText.slice(0,500) : document.body.innerText.slice(0,500)")
    findings["share_live_domains"] = page.evaluate("() => [...document.querySelectorAll('body *')].filter(x=>x.childElementCount===0&&/qzxvkw9r324b\\.com|google\\.com/.test(x.textContent||'')).length")
    page.screenshot(path=f"{SHOTS}/H1b-share-live.png")
    cleanup = page.evaluate("""async ([sid, tok]) => {
      const r = await fetch(`/api/share/${sid}`, {method:'DELETE', headers:{'Content-Type':'application/json'}, body: JSON.stringify({token: tok})});
      const g = await fetch(`/api/share/${sid}`);
      return {del: r.status, getAfter: g.status};
    }""", [sid, tok])
    findings["share_cleanup"] = cleanup

    # 2. theme toggle: list header buttons + toggle
    page.goto(BASE + "/", wait_until="networkidle"); time.sleep(0.5)
    findings["header_buttons"] = page.evaluate("() => [...document.querySelectorAll('header button')].map(b=>({aria:b.getAttribute('aria-label'), title:b.getAttribute('title'), text:(b.textContent||'').trim().slice(0,20)}))")
    findings["html_class_before"] = page.evaluate("() => document.documentElement.className")
    r = page.evaluate("""() => {
      const b=[...document.querySelectorAll('button')].find(x=>/主题|theme|dark|light/i.test((x.getAttribute('aria-label')||'')+(x.getAttribute('title')||'')));
      if(b){b.click(); return 'clicked:'+(b.getAttribute('aria-label')||b.getAttribute('title'));}
      return 'not-found';
    }""")
    findings["theme_click"] = r
    time.sleep(0.7)
    findings["html_class_after"] = page.evaluate("() => document.documentElement.className")
    findings["theme_ls_after"] = page.evaluate("() => localStorage.getItem('domainhunter:theme')")
    page.screenshot(path=f"{SHOTS}/I2-theme-after-toggle.png")
    # toggle back
    page.evaluate("""() => {
      const b=[...document.querySelectorAll('button')].find(x=>/主题|theme|dark|light/i.test((x.getAttribute('aria-label')||'')+(x.getAttribute('title')||'')));
      if(b) b.click();
    }""")
    time.sleep(0.5)
    findings["html_class_back"] = page.evaluate("() => document.documentElement.className")

    # 3. footer counts
    findings["footer_exists"] = page.evaluate("() => !!document.querySelector('footer')")
    findings["footer_links_counts"] = page.evaluate("() => [...document.querySelectorAll('footer a, [class*=footer] a')].map(a=>a.textContent.trim()).filter(t=>/\\d/.test(t)).slice(0,20)")
    findings["bottom_text"] = page.evaluate("() => { const f=document.querySelector('footer')||document.body; return f.innerText.slice(-800); }")
    page.evaluate("() => window.scrollTo(0, document.body.scrollHeight)")
    time.sleep(0.5)
    page.screenshot(path=f"{SHOTS}/D5-footer-scrolled.png")

    page.close()

json.dump(findings, open(sys.argv[1], "w"), ensure_ascii=False, indent=2)
print(json.dumps(findings, ensure_ascii=False, indent=1)[:6000])
