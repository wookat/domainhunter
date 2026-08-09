import json, re, sys, time
from playwright.sync_api import sync_playwright

RE_EXACT = re.compile("精确核验|Exact check")
RE_MORE = re.compile("查更多后缀|more TLDs")
DONE_JS = "() => { const e=[...document.querySelectorAll('main *')].find(x=>x.childElementCount===0&&/核验完成|Check complete/.test(x.textContent||'')); return e?e.textContent.trim():null; }"

BASE = "https://hunt.zalize.com"
SHOTS = "screenshots-r316"
findings = {}
console_errors = []


def attach_console(page):
    page.on("console", lambda m: console_errors.append({"type": m.type, "text": m.text[:200], "url": page.url}) if m.type == "error" else None)
    page.on("pageerror", lambda e: console_errors.append({"type": "pageerror", "text": str(e)[:200], "url": page.url}))


def shot(page, name):
    page.screenshot(path=f"{SHOTS}/{name}.png", full_page=False)


with sync_playwright() as p:
    b = p.chromium.connect_over_cdp("http://localhost:29229")
    ctx = b.contexts[0]
    page = ctx.new_page()
    attach_console(page)

    # A. home zh
    page.goto(BASE + "/", wait_until="networkidle")
    page.evaluate("localStorage.setItem('domainhunter:lang','zh')")
    page.reload(wait_until="networkidle")
    time.sleep(1)
    findings["home_more_chip"] = page.evaluate("""() => {
      const btns = [...document.querySelectorAll('button')];
      const more = btns.find(b => /\\+\\d+/.test(b.textContent||''));
      return more ? more.textContent.trim() : null;
    }""")
    shot(page, "A1-home-zh")

    # B. quick-check exact tab: single random
    page.get_by_role("button", name=RE_EXACT).first.click()
    time.sleep(0.3)
    inp = page.locator("main textarea, main input[type=text]").first
    inp.fill("qzxvkw9r316")
    time.sleep(0.3)
    inp.press("Enter")
    s = None
    for _ in range(60):
        s = page.evaluate(DONE_JS)
        if s: break
        time.sleep(1)
    findings["quick_single"] = s
    shot(page, "B1-quickcheck-single")

    # All (198 tld + com.cn = 199)
    more_btn = page.get_by_role("button", name=RE_MORE)
    if more_btn.count():
        more_btn.first.click()
        s2 = None
        for _ in range(300):
            s2 = page.evaluate(DONE_JS)
            if s2 and "199" in s2: break
            time.sleep(1)
        findings["quick_all"] = s2
        shot(page, "B3-quickcheck-all")
        unk = page.evaluate("""() => {
          const chips=[...document.querySelectorAll('main button,main span,main [class*=chip]')].filter(x=>x.childElementCount<=2&&/未知|unknown/i.test(x.textContent||''));
          return chips.map(x=>x.textContent.trim()).slice(0,20);
        }""")
        findings["quick_all_unknown"] = unk
        # single-chip recheck: click first 重新核验 button if any
        re_btn = page.get_by_role("button", name=re.compile("重新核验|Recheck")).first
        try:
            if re_btn.count():
                shot(page, "B4-before-recheck")
                re_btn.click()
                time.sleep(6)
                shot(page, "B4b-after-recheck")
                findings["quick_recheck_clicked"] = True
        except Exception as e:
            findings["quick_recheck_error"] = str(e)[:200]

    # baidu.com.cn
    page.goto(BASE + "/", wait_until="networkidle")
    page.get_by_role("button", name=RE_EXACT).first.click()
    inp = page.locator("main textarea, main input[type=text]").first
    inp.fill("baidu.com.cn")
    time.sleep(0.3)
    inp.press("Enter")
    s3 = None
    for _ in range(60):
        s3 = page.evaluate(DONE_JS)
        if s3: break
        time.sleep(1)
    findings["quick_baidu_com_cn"] = s3
    shot(page, "B2-quickcheck-baidu-com-cn")

    # C. /prices — rows, live/static, CNY口径, sort
    page.goto(BASE + "/prices", wait_until="networkidle"); time.sleep(2)
    pz = page.evaluate("""() => {
      const rows=[...document.querySelectorAll('main a[href^="/?tld="]')].map(a=>a.closest('div[class],li,tr')||a.parentElement);
      const links=document.querySelectorAll('main a[href^="/?tld="]').length;
      const texts=[...document.querySelectorAll('main a[href^="/?tld="]')].map(a=>{
        const row=a.closest('[class]');
        return null;
      });
      return {links};
    }""")
    findings["prices_rows_zh"] = pz["links"]
    # extract per-row reg USD + live flag + CNY
    rowdata = page.evaluate("""() => {
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
    live_rows = [r for r in rowdata if r["usd"] and not r["usd"][0]["approx"]]
    static_rows = [r for r in rowdata if r["usd"] and r["usd"][0]["approx"]]
    findings["prices_live_count"] = len(live_rows)
    findings["prices_static_count"] = len(static_rows)
    # CNY = round(USD*7.2) spot check on live rows with cny
    bad = []
    checked = 0
    for r in rowdata[:60]:
        if r["usd"] and r["cny"]:
            usd, cny = r["usd"][0]["v"], r["cny"][0]
            checked += 1
            if abs(round(usd * 7.2) - cny) > 1:
                bad.append(r)
    findings["prices_cny_checked"] = checked
    findings["prices_cny_mismatch"] = bad[:5]
    # default sort ascending by reg
    regs = [r["usd"][0]["v"] for r in rowdata if r["usd"]]
    findings["prices_default_sorted_asc"] = regs == sorted(regs)
    shot(page, "C1-prices-zh")
    # click TLD header to sort alphabetically
    try:
        page.get_by_role("button", name=re.compile("^(后缀|TLD)")).first.click()
        time.sleep(0.8)
        tlds = page.evaluate("() => [...document.querySelectorAll('main a[href^=\"/?tld=\"]')].map(a=>a.getAttribute('href').split('=')[1])")
        findings["prices_tld_sorted"] = tlds == sorted(tlds)
        shot(page, "C3-prices-sort-tld")
    except Exception as e:
        findings["prices_sort_error"] = str(e)[:200]
    page.goto(BASE + "/prices?lang=en", wait_until="networkidle"); time.sleep(2)
    findings["prices_rows_en"] = page.evaluate("() => document.querySelectorAll('main a[href^=\"/?tld=\"]').length")
    shot(page, "C2-prices-en")

    # D. hubs (browser-side dedup counts)
    for path, key, prefix in [("/tld", "tld_hub_links", "/tld/"), ("/guide", "guide_hub_links", "/guide/"), ("/vs", "vs_hub_links", "/vs/")]:
        page.goto(BASE + path, wait_until="networkidle"); time.sleep(1)
        findings[key] = page.evaluate(f"() => new Set([...document.querySelectorAll('main a[href^=\"{prefix}\"]')].map(a=>a.getAttribute('href').split('?')[0])).size")
        shot(page, "D-" + key)

    # E. new content pages (R311/R312/R313)
    for path, name in [
        ("/tld/ltd", "E1-tld-ltd-zh"), ("/tld/express?lang=en", "E2-tld-express-en"),
        ("/vs/tennis-vs-club", "E3-vs-tennis-club-zh"), ("/vs/health-vs-care?lang=en", "E4-vs-health-care-en"),
        ("/guide/companyreg", "E5-guide-companyreg-zh"), ("/guide/flashsale?lang=en", "E6-guide-flashsale-en"),
    ]:
        page.goto(BASE + path, wait_until="networkidle"); time.sleep(0.8)
        shot(page, name)

    # F. tool pages
    page.goto(BASE + "/shortlist", wait_until="networkidle"); time.sleep(0.5); shot(page, "F2-shortlist")
    page.goto(BASE + "/monitors", wait_until="networkidle"); time.sleep(0.5); shot(page, "F3-monitors")
    page.goto(BASE + "/advanced", wait_until="networkidle"); time.sleep(0.5)
    ta = page.locator("main textarea").first
    ta.fill("google.com\nqzxvkw9r316b.com")
    time.sleep(0.5)
    try:
        page.get_by_role("button", name=re.compile(r"核验 \d+ 个域名|Check \d+ domains")).first.click(timeout=15000)
    except Exception as e:
        findings["advanced_bulk_click_error"] = str(e)[:200]
    time.sleep(8)
    findings["advanced_bulk_text"] = page.evaluate("() => [...document.querySelectorAll('main *')].filter(x=>x.childElementCount===0&&/google\\.com|qzxvkw9r316b/.test(x.textContent||'')).map(x=>x.textContent.trim()).slice(0,6)")
    shot(page, "F5-advanced-bulk")

    # G. 404
    page.goto(BASE + "/nonexistent-r316", wait_until="networkidle"); shot(page, "G1-404-toplevel")
    page.goto(BASE + "/tld/notatld-r316", wait_until="networkidle"); shot(page, "G2-404-tld")

    # H. share: create -> live UI (created-ago) -> unknown-id CTA -> revoke -> 410 CTA
    created = page.evaluate("""async () => {
      const r = await fetch('/api/share', {method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({items:[{domain:'qzxvkw9r316a.com'},{domain:'google.com'}]})});
      return {status: r.status, body: await r.json()};
    }""")
    findings["share_create"] = {"status": created["status"], "id": created["body"].get("id")}
    sid = created["body"].get("id"); tok = created["body"].get("revokeToken")
    page.goto(f"{BASE}/s/{sid}", wait_until="networkidle"); time.sleep(1)
    findings["share_live_domains"] = page.evaluate("() => [...document.querySelectorAll('main *')].filter(x=>x.childElementCount===0&&/qzxvkw9r316a\\.com|google\\.com/.test(x.textContent||'')).length")
    findings["share_created_ago_zh"] = page.evaluate("() => { const e=[...document.querySelectorAll('main *')].find(x=>/创建于/.test(x.textContent||'')&&x.childElementCount<=3); return e? e.textContent.trim().slice(0,80) : null; }")
    shot(page, "H1-share-live")
    # unknown id -> 404 CTA (R314)
    page.goto(f"{BASE}/s/nonexistent316", wait_until="networkidle"); time.sleep(1)
    findings["share_404_cta"] = page.evaluate("() => ({cta: [...document.querySelectorAll('main a,main button')].map(x=>x.textContent.trim()).filter(t=>/去创建自己的候选清单|Create your own shortlist/.test(t)), desc: [...document.querySelectorAll('main *')].some(x=>/用 DomainHunter 创建并分享|create and share your own/i.test(x.textContent||''))})")
    findings["share_404_api"] = page.evaluate("async () => (await fetch('/api/share/nonexistent316')).status")
    shot(page, "H3-share-404-cta")
    # revoke
    status = page.evaluate("""async ([sid, tok]) => {
      const r = await fetch(`/api/share/${sid}`, {method:'DELETE', headers:{'Content-Type':'application/json'}, body: JSON.stringify({token: tok})});
      const j = await r.json().catch(()=>null);
      const g = await fetch(`/api/share/${sid}`);
      return {del: r.status, delBody: j, getAfter: g.status};
    }""", [sid, tok])
    findings["share_revoke"] = status
    page.goto(f"{BASE}/s/{sid}", wait_until="networkidle"); time.sleep(1)
    findings["share_revoked_ui"] = page.evaluate("() => [...document.querySelectorAll('main *')].some(x=>/已失效|no longer active|不再有效/.test(x.textContent||''))")
    findings["share_410_cta"] = page.evaluate("() => [...document.querySelectorAll('main a,main button')].map(x=>x.textContent.trim()).filter(t=>/去创建自己的候选清单|Create your own shortlist/.test(t))")
    shot(page, "H2-share-revoked")

    # I. light/dark
    page.goto(BASE + "/", wait_until="networkidle")
    bg0 = page.evaluate("() => getComputedStyle(document.body).backgroundColor")
    page.evaluate("""() => { const b=[...document.querySelectorAll('button')].find(x=>/toggle|主题|theme|light|dark/i.test(x.getAttribute('aria-label')||'')); if(b) b.click(); }""")
    time.sleep(0.5)
    bg1 = page.evaluate("() => getComputedStyle(document.body).backgroundColor")
    page.reload(wait_until="networkidle")
    bg2 = page.evaluate("() => getComputedStyle(document.body).backgroundColor")
    shot(page, "I1-theme-toggled")
    page.evaluate("""() => { const b=[...document.querySelectorAll('button')].find(x=>/toggle|主题|theme|light|dark/i.test(x.getAttribute('aria-label')||'')); if(b) b.click(); }""")
    time.sleep(0.5)
    bg3 = page.evaluate("() => getComputedStyle(document.body).backgroundColor")
    findings["theme"] = {"initial": bg0, "toggled": bg1, "persist_after_reload": bg2, "back": bg3}

    # K. 375px
    mob = {}
    cdp = ctx.new_cdp_session(page)
    cdp.send("Emulation.setDeviceMetricsOverride", {"width": 375, "height": 812, "deviceScaleFactor": 2, "mobile": True})
    for path, name in [("/", "K1-375-home"), ("/prices", "K2-375-prices"), ("/tld", "K3-375-tld"), ("/vs/tennis-vs-club", "K4-375-vs-tennis-club"), ("/guide/companyreg", "K5-375-guide-companyreg")]:
        page.goto(BASE + path, wait_until="networkidle"); time.sleep(1)
        mob[path] = page.evaluate("() => document.documentElement.scrollWidth")
        shot(page, name)
    cdp.send("Emulation.clearDeviceMetricsOverride")
    findings["mobile_375_scrollWidth"] = mob

    page.close()

findings["console_errors"] = console_errors
json.dump(findings, open(sys.argv[1], "w"), ensure_ascii=False, indent=2)
print(json.dumps(findings, ensure_ascii=False, indent=1)[:6000])
