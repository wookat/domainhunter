import json, sys, time
from playwright.sync_api import sync_playwright

BASE = "https://hunt.zalize.com"
SHOTS = "screenshots-r320"
findings = {}

with sync_playwright() as p:
    b = p.chromium.connect_over_cdp("http://localhost:29229")
    ctx = b.contexts[0]
    page = ctx.new_page()

    # 1. live-row CNY = round(USD*7.2) check (live rows only, all 198 rows)
    page.goto(BASE + "/prices", wait_until="networkidle"); time.sleep(2)
    rows = page.evaluate("""() => {
      const anchors=[...document.querySelectorAll('main a[href^="/?tld="]')];
      const out=[];
      for (const a of anchors){
        let row=a; for(let i=0;i<6&&row&&!( /\\$\\d/.test(row.textContent||''));i++) row=row.parentElement;
        if(!row) continue;
        const t=row.textContent||'';
        const usd=[...t.matchAll(/(≈?)\\$([0-9.]+)/g)].map(m=>({approx:m[1]==='≈',v:parseFloat(m[2])}));
        const cny=[...t.matchAll(/¥\\s?([0-9.]+)/g)].map(m=>parseFloat(m[1]));
        out.push({tld:a.getAttribute('href').split('=')[1], usd, cny});
      }
      return out;
    }""")
    live = [r for r in rows if r["usd"] and not r["usd"][0]["approx"]]
    mism = []
    for r in live:
        for u, c in zip([x["v"] for x in r["usd"]], r["cny"]):
            if abs(round(u * 7.2) - c) > 1:
                mism.append({"tld": r["tld"], "usd": u, "cny": c})
    findings["live_rows"] = len(live)
    findings["live_pairs_checked"] = sum(min(len(r["usd"]), len(r["cny"])) for r in live)
    findings["live_cny_mismatch"] = mism[:10]
    # static-row sample (CNY direct from content, USD derived ≈)
    findings["static_sample"] = [r for r in rows if r["usd"] and r["usd"][0]["approx"]][:3]

    # 2. theme toggle via header last button group
    page.goto(BASE + "/", wait_until="networkidle"); time.sleep(1)
    labels = page.evaluate("() => [...document.querySelectorAll('header button')].map(b=>({aria:b.getAttribute('aria-label'), title:b.getAttribute('title'), text:(b.textContent||'').trim().slice(0,20)}))")
    findings["header_buttons"] = labels
    bg0 = page.evaluate("() => getComputedStyle(document.body).backgroundColor")
    page.evaluate("""() => { const bs=[...document.querySelectorAll('header button')]; const b=bs.find(x=>/主题|theme|light|dark/i.test((x.getAttribute('aria-label')||'')+(x.getAttribute('title')||''))) || bs[bs.length-1]; b.click(); }""")
    time.sleep(0.8)
    bg1 = page.evaluate("() => getComputedStyle(document.body).backgroundColor")
    page.reload(wait_until="networkidle"); time.sleep(0.5)
    bg2 = page.evaluate("() => getComputedStyle(document.body).backgroundColor")
    page.screenshot(path=f"{SHOTS}/I1-light-mode.png")
    page.evaluate("""() => { const bs=[...document.querySelectorAll('header button')]; const b=bs.find(x=>/主题|theme|light|dark/i.test((x.getAttribute('aria-label')||'')+(x.getAttribute('title')||''))) || bs[bs.length-1]; b.click(); }""")
    time.sleep(0.8)
    bg3 = page.evaluate("() => getComputedStyle(document.body).backgroundColor")
    findings["theme"] = {"initial": bg0, "toggled": bg1, "persist_after_reload": bg2, "back": bg3}

    # 3. zh created-ago on a fresh share
    page.evaluate("localStorage.setItem('domainhunter:lang','zh')")
    created = page.evaluate("""async () => {
      const r = await fetch('/api/share', {method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({items:[{domain:'qzxvkw9r320c.com'}]})});
      return {status: r.status, body: await r.json()};
    }""")
    sid = created["body"].get("id"); tok = created["body"].get("revokeToken")
    findings["share2_create_status"] = created["status"]
    page.goto(f"{BASE}/s/{sid}", wait_until="networkidle"); time.sleep(1)
    findings["share2_created_ago_zh"] = page.evaluate("() => { const m=document.body.innerText.match(/创建于[^\\n·]*/); return m? m[0].trim(): null; }")
    findings["share2_domain_visible"] = page.evaluate("() => document.body.innerText.includes('qzxvkw9r320c')")
    page.screenshot(path=f"{SHOTS}/H4-share-live-zh.png")
    # cleanup: revoke share2
    findings["share2_revoke"] = page.evaluate("""async ([sid, tok]) => {
      const r = await fetch(`/api/share/${sid}`, {method:'DELETE', headers:{'Content-Type':'application/json'}, body: JSON.stringify({token: tok})});
      return r.status;
    }""", [sid, tok])

    page.close()

json.dump(findings, open(sys.argv[1], "w"), ensure_ascii=False, indent=2)
print(json.dumps(findings, ensure_ascii=False, indent=1)[:4000])
