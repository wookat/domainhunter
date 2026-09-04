"""R443 零 AI 全站审计——浏览器侧检查（Playwright over CDP，不触碰任何 AI 路径）。

覆盖：
1. R423 回归面：/prices 即时过滤（输入即筛、行数收敛、清空恢复）+ 回到顶部按钮；
2. R415 回归面：三 hub 锚点导航（chips=sections、锚点跳转不遮挡、回顶、过滤空组隐藏）；
3. R435/R439 相关互链模块：SSR 与水合后 DOM 逐 section 链接集合一致（tld/guide/vs 各抽 2 页）；
4. 口径：快查 All=379、首页 chips +364、footer 三栏 378/374/414、hub 去重链接数；
5. 常规：quick-check、advanced 批量、分享链路、键盘可达、双主题、375px scrollWidth、console 错误；
6. 零 AI 佐证：/api/usage 前后 days 深比较。

用法：python3 audit_browser_r443.py findings-r443-browser.json
"""
import json
import re
import sys
import time

from playwright.sync_api import sync_playwright

BASE = "https://hunt.zalize.com"
SHOTS = "screenshots-r443"
RE_EXACT = re.compile("精确核验|Exact check")
RE_MORE = re.compile("查更多后缀|more TLDs")
DONE_JS = "() => { const e=[...document.querySelectorAll('main *')].find(x=>x.childElementCount===0&&/核验完成|Check complete/.test(x.textContent||'')); return e?e.textContent.trim():null; }"

findings = {}
console_errors = []


def attach_console(page):
    page.on("console", lambda m: console_errors.append({"type": m.type, "text": m.text[:200], "url": page.url}) if m.type == "error" else None)
    page.on("pageerror", lambda e: console_errors.append({"type": "pageerror", "text": str(e)[:200], "url": page.url}))


def shot(page, name):
    page.screenshot(path=f"{SHOTS}/{name}.png", full_page=False)


NAV_SEL = 'nav[aria-label="分组导航"], nav[aria-label="Group navigation"]'
TOP_SEL = 'button[aria-label="回到顶部"], button[aria-label="Back to top"]'


def hub_regress(page, path, filter_query, cb):
    """R415 三 hub 回归：锚点/回顶/过滤空组隐藏。"""
    out = {}
    page.goto(f"{BASE}{path}?cb={cb}", wait_until="networkidle"); time.sleep(1.5)
    out["hydrated"] = page.evaluate(f"""() => {{
      const nav = document.querySelector('{NAV_SEL}');
      const chips = nav ? [...nav.querySelectorAll('a[href^="#hub-g-"]')] : [];
      const secs = [...document.querySelectorAll('section[id^="hub-g-"]')];
      return {{
        nav_present: !!nav,
        chip_count: chips.length,
        section_count: secs.length,
        ids_equal: JSON.stringify(chips.map(a=>a.getAttribute('href').slice(1))) === JSON.stringify(secs.map(s=>s.id)),
        chips_focusable: chips.length ? chips[0].tabIndex >= 0 || chips[0].tagName==='A' : null,
      }};
    }}""")
    shot(page, f"A1-hubnav{path.replace('/','-')}")
    out["anchor_jump"] = page.evaluate(f"""async () => {{
      const nav = document.querySelector('{NAV_SEL}');
      const chips = [...nav.querySelectorAll('a[href^="#hub-g-"]')];
      const chip = chips[Math.floor(chips.length/2)];
      const id = chip.getAttribute('href').slice(1);
      chip.click();
      await new Promise(r=>setTimeout(r,1200));
      const sec = document.getElementById(id);
      const h2 = sec.querySelector('h2');
      const navRect = nav.getBoundingClientRect();
      const h2Rect = h2.getBoundingClientRect();
      return {{
        target: id, hash: location.hash,
        hash_ok: location.hash === '#'+id,
        nav_bottom: Math.round(navRect.bottom), h2_top: Math.round(h2Rect.top),
        not_clipped: h2Rect.top >= navRect.bottom - 1,
        scrolled: window.scrollY > 100,
      }};
    }}""")
    shot(page, f"A2-anchor{path.replace('/','-')}")
    out["back_to_top"] = page.evaluate(f"""async () => {{
      const btnSel = () => document.querySelector('{TOP_SEL}');
      window.scrollTo(0, document.body.scrollHeight/2);
      await new Promise(r=>setTimeout(r,600));
      const b = btnSel();
      if (!b) return {{visible_after_scroll:false}};
      const r = b.getBoundingClientRect();
      b.click();
      await new Promise(r2=>setTimeout(r2,1500));
      return {{visible_after_scroll:true, size:[Math.round(r.width),Math.round(r.height)],
              at_top: window.scrollY < 5, hidden_after_top: !btnSel()}};
    }}""")
    shot(page, f"A3-toptop{path.replace('/','-')}")
    page.evaluate("window.scrollTo(0,0)"); time.sleep(0.5)
    inp = page.locator("main input[type=search]").first
    inp.fill(filter_query); time.sleep(1)
    out["filtered"] = page.evaluate(f"""() => {{
      const nav = document.querySelector('{NAV_SEL}');
      const chips = nav ? nav.querySelectorAll('a[href^="#hub-g-"]').length : 0;
      const secs = document.querySelectorAll('section[id^="hub-g-"]').length;
      return {{chips, sections: secs, equal: chips === secs}};
    }}""")
    shot(page, f"A4-filter{path.replace('/','-')}")
    inp.fill(""); time.sleep(1)
    out["restored"] = page.evaluate(f"""() => {{
      const nav = document.querySelector('{NAV_SEL}');
      return {{chips: nav ? nav.querySelectorAll('a').length : 0,
               sections: document.querySelectorAll('section[id^="hub-g-"]').length}};
    }}""")
    inp.fill("zzzqqq-no-match-r443"); time.sleep(1)
    out["no_match"] = page.evaluate(f"""() => ({{
      nav_gone: !document.querySelector('{NAV_SEL}'),
      sections: document.querySelectorAll('section[id^="hub-g-"]').length,
    }})""")
    inp.fill("")
    return out


REL_HEADINGS = {
    "tld": ["相关后缀对比", "相关 TLD", "相关行业命名指南"],
    "guide": ["相关后缀对比", "相关行业指南"],
    "vs": ["相关行业命名指南", "相关对比"],
}

SECTION_JS = """(headings) => {
  const out = {};
  for (const h of headings) {
    const h2 = [...document.querySelectorAll('main h2')].find(e => e.textContent.trim() === h);
    if (!h2) { out[h] = null; continue; }
    out[h] = [...h2.parentElement.querySelectorAll('a')].map(a => a.getAttribute('href').split('?')[0]);
  }
  return out;
}"""


def related_hydration(page, kind, slug, cb):
    """R435/R439：SSR 与水合后相关互链 section 链接集合一致。"""
    url = f"{BASE}/{kind}/{slug}?cb={cb}rel"
    page.goto(url, wait_until="domcontentloaded")
    ssr = page.evaluate(SECTION_JS, REL_HEADINGS[kind])
    page.wait_for_load_state("networkidle"); time.sleep(1.5)
    hyd = page.evaluate(SECTION_JS, REL_HEADINGS[kind])
    capped = {"相关 TLD", "相关行业指南", "相关对比"}  # R435/R439 口径 ≤6 的三个模块
    per = {h: {"ssr": ssr.get(h) and len(ssr[h]), "hydrated": hyd.get(h) and len(hyd[h]),
               "equal": ssr.get(h) == hyd.get(h),
               "cap6_ok": hyd.get(h) is None or (0 < len(hyd[h]) and (h not in capped or len(hyd[h]) <= 6))}
           for h in REL_HEADINGS[kind]}
    return {"sections": per, "pass": all(v["equal"] and v["cap6_ok"] for v in per.values())}


def main(out):
    cb = int(time.time())
    with sync_playwright() as p:
        b = p.chromium.connect_over_cdp("http://localhost:29229")
        ctx = b.contexts[0]
        page = ctx.new_page()
        attach_console(page)

        page.goto(f"{BASE}/?cb={cb}", wait_until="networkidle")
        findings["usage_pre"] = page.evaluate("async () => await (await fetch('/api/usage')).json()")
        page.evaluate("localStorage.setItem('domainhunter:lang','zh')")

        # ---- R423 回归：/prices 即时过滤 + 回顶 ----
        page.goto(f"{BASE}/prices?cb={cb}p", wait_until="networkidle"); time.sleep(2)
        pr = {}
        pr["rows_all"] = page.evaluate("() => document.querySelectorAll('main a[href^=\"/?tld=\"]').length")
        shot(page, "P1-prices-all")
        pinp = page.locator("main input[type=search]").first
        pinp.fill("shop"); time.sleep(0.8)
        pr["rows_shop"] = page.evaluate("() => document.querySelectorAll('main a[href^=\"/?tld=\"]').length")
        pr["shop_rows_visible_match"] = page.evaluate("""() => {
          const rows=[...document.querySelectorAll('main a[href^="/?tld="]')];
          return rows.length>0 && rows.every(a=>a.getAttribute('href').includes('shop') || (a.closest('[class]')?.textContent||'').includes('shop'));
        }""")
        shot(page, "P2-prices-filter-shop")
        pinp.fill("zzzqqq-none-r443"); time.sleep(0.8)
        pr["rows_none"] = page.evaluate("() => document.querySelectorAll('main a[href^=\"/?tld=\"]').length")
        pr["empty_state_text"] = page.evaluate("() => (document.querySelector('main')||{innerText:''}).innerText.match(/没有匹配|No match[^\\n]*|无结果|not found/i)?.[0] || null")
        shot(page, "P3-prices-filter-none")
        pinp.fill(""); time.sleep(0.8)
        pr["rows_restored"] = page.evaluate("() => document.querySelectorAll('main a[href^=\"/?tld=\"]').length")
        pr["back_to_top"] = page.evaluate(f"""async () => {{
          const btnSel = () => document.querySelector('{TOP_SEL}');
          window.scrollTo(0, document.body.scrollHeight/2);
          await new Promise(r=>setTimeout(r,600));
          const b = btnSel();
          if (!b) return {{visible_after_scroll:false}};
          const r = b.getBoundingClientRect();
          b.click();
          await new Promise(r2=>setTimeout(r2,1500));
          return {{visible_after_scroll:true, size:[Math.round(r.width),Math.round(r.height)],
                  at_top: window.scrollY < 5, hidden_after_top: !btnSel()}};
        }}""")
        shot(page, "P4-prices-backtotop")
        findings["prices_r423"] = pr

        # ---- R435/R439：相关互链 SSR/水合一致 ----
        rel = {}
        for kind, slugs in [("tld", ["com", "ai"]), ("guide", ["saas", "coffee"]), ("vs", ["com-vs-cn", "io-vs-ai"])]:
            for s in slugs:
                rel[f"/{kind}/{s}"] = related_hydration(page, kind, s, cb)
        findings["related_hydration"] = rel
        findings["related_hydration_all_pass"] = all(v["pass"] for v in rel.values())
        shot(page, "R1-related-links")

        # ---- R415 回归：三 hub ----
        findings["hub_r415"] = {
            "/tld": hub_regress(page, "/tld", "berlin", cb),
            "/guide": hub_regress(page, "/guide", "茶", cb),
            "/vs": hub_regress(page, "/vs", "kaufen", cb),
        }

        # ---- en 抽 1 个 hub ----
        page.evaluate("localStorage.setItem('domainhunter:lang','en')")
        page.goto(f"{BASE}/tld?lang=en&cb={cb}e", wait_until="networkidle"); time.sleep(1.5)
        findings["hub_r415_en_tld"] = page.evaluate("""() => {
          const nav = document.querySelector('nav[aria-label="Group navigation"]');
          return {nav_present: !!nav, chips: nav?nav.querySelectorAll('a').length:0,
                   sections: document.querySelectorAll('section[id^="hub-g-"]').length};
        }""")
        page.evaluate("localStorage.setItem('domainhunter:lang','zh')")

        # ---- 首页 chips +346 ----
        page.goto(f"{BASE}/?cb={cb}c", wait_until="networkidle"); time.sleep(1.5)
        findings["home_chips_more"] = page.evaluate("""() => {
          const t=(document.querySelector('main')||{innerText:''}).innerText;
          const m=t.match(/\\+\\s?364/);
          return m ? m[0] : (t.match(/\\+\\s?\\d{3}/)||[null])[0];
        }""")
        shot(page, "B0-home-chips")

        # ---- quick-check（All=361） ----
        label = f"qzxvkw9r443x{cb % 1000}"
        page.get_by_role("button", name=RE_EXACT).first.click(); time.sleep(0.3)
        inp = page.locator("main textarea, main input[type=text]").first
        inp.fill(label); time.sleep(0.3); inp.press("Enter")
        s = None
        for _ in range(90):
            s = page.evaluate(DONE_JS)
            if s: break
            time.sleep(1)
        findings["quick_single"] = s
        shot(page, "B1-quickcheck-single")
        more_btn = page.get_by_role("button", name=RE_MORE)
        if more_btn.count():
            findings["quick_more_label"] = more_btn.first.text_content().strip()
            more_btn.first.click()
            s2 = None
            for _ in range(420):
                s2 = page.evaluate(DONE_JS)
                if s2 and re.search(r"共\s*37\d|/\s*37\d", s2): break
                time.sleep(1)
            findings["quick_all"] = s2
            findings["quick_pending_count"] = page.evaluate("() => [...document.querySelectorAll('main *')].filter(x=>x.childElementCount===0&&/查询中|pending|Checking/i.test(x.textContent||'')).length")
            shot(page, "B2-quickcheck-all")

        # ---- hubs 去重链接 + footer ----
        for path, key, prefix in [("/tld", "tld_hub_links", "/tld/"), ("/guide", "guide_hub_links", "/guide/"), ("/vs", "vs_hub_links", "/vs/")]:
            page.goto(BASE + path, wait_until="networkidle"); time.sleep(1)
            findings[key] = page.evaluate(f"() => new Set([...document.querySelectorAll('main a[href^=\"{prefix}\"]')].map(a=>a.getAttribute('href').split('?')[0])).size")
            shot(page, "D-" + key)
        page.goto(BASE + "/", wait_until="networkidle"); time.sleep(1)
        findings["footer_link_counts"] = page.evaluate("""() => {
          const out={};
          for (const pre of ["/tld/","/guide/","/vs/"]) out[pre]=new Set([...document.querySelectorAll(`footer a[href^="${pre}"]`)].map(a=>a.getAttribute('href').split('?')[0])).size;
          return out;
        }""")

        # ---- 工具页 + advanced 批量 ----
        for path, key, name in [("/why", "why_status", "G4-why"), ("/shortlist", "shortlist_status", "G5-shortlist"), ("/monitors", "monitors_status", "G7-monitors"), ("/advanced", "advanced_status", "G6-advanced"), ("/mcp", "mcp_doc_status", "G3-mcp")]:
            page.goto(BASE + path, wait_until="networkidle"); time.sleep(0.8)
            findings[key] = page.evaluate(f"async () => (await fetch('{path}')).status")
            shot(page, name)
        page.goto(BASE + "/advanced", wait_until="networkidle"); time.sleep(1)
        ta = page.locator("main textarea").first
        ta.fill(f"{label}bulk.com\n{label}bulk.io\ngoogle.com")
        page.locator("main button", has_text=re.compile("核验|Check")).first.click()
        done = None
        for _ in range(90):
            done = page.evaluate("""() => {
              const t=(document.querySelector('main')||{innerText:''}).innerText;
              const m=t.match(/识别\\s*\\d+[^\\n]*|\\d+\\s*identified[^\\n]*/);
              const pending=/查询中|Checking/i.test(t);
              return (m && !pending) ? m[0] : null;
            }""")
            if done: break
            time.sleep(1)
        findings["advanced_bulk"] = done
        shot(page, "G8-advanced-bulk")

        # ---- 分享链路 ----
        created = page.evaluate(f"""async () => {{
          const r = await fetch('/api/share', {{method:'POST', headers:{{'Content-Type':'application/json'}},
            body: JSON.stringify({{items:[{{domain:'{label}a.com'}},{{domain:'google.com'}}]}})}});
          return {{status: r.status, body: await r.json()}};
        }}""")
        findings["share_create"] = {"status": created["status"], "id": created["body"].get("id"), "has_token": bool(created["body"].get("revokeToken"))}
        sid, tok = created["body"].get("id"), created["body"].get("revokeToken")
        page.goto(f"{BASE}/s/{sid}", wait_until="networkidle"); time.sleep(1)
        findings["share_live"] = page.evaluate(f"() => {{ const t=(document.querySelector('main')||{{innerText:''}}).innerText; return {{d1: t.includes('{label}a.com'), d2: t.includes('google.com')}}; }}")
        shot(page, "H1-share-live")
        findings["share_revoke"] = page.evaluate("""async ([sid, tok]) => {
          const r = await fetch(`/api/share/${sid}`, {method:'DELETE', headers:{'Content-Type':'application/json'}, body: JSON.stringify({token: tok})});
          const g = await fetch(`/api/share/${sid}`);
          return {del: r.status, getAfter: g.status};
        }""", [sid, tok])

        # ---- 键盘可用性 ----
        page.goto(f"{BASE}/?cb={cb}k", wait_until="networkidle"); time.sleep(1)
        kb = []
        for _ in range(10):
            page.keyboard.press("Tab"); time.sleep(0.15)
            kb.append(page.evaluate("""() => {
              const e=document.activeElement; if(!e||e===document.body) return null;
              const r=e.getBoundingClientRect();
              return {tag:e.tagName, text:(e.textContent||e.getAttribute('aria-label')||'').trim().slice(0,30), visible:r.width>0&&r.height>0};
            }"""))
        findings["keyboard_tab_chain"] = kb
        shot(page, "K0-keyboard-focus")
        page.goto(f"{BASE}/prices?cb={cb}k2", wait_until="networkidle"); time.sleep(1.5)
        findings["keyboard_prices_filter_focus"] = page.evaluate("""() => {
          const i = document.querySelector('main input[type=search]');
          if (i) i.focus();
          return {focused: document.activeElement === i};
        }""")

        # ---- 双主题 ----
        theme0 = page.evaluate("() => localStorage.getItem('domainhunter:theme')")
        themes = {}
        for tval in ("light", "dark"):
            page.evaluate(f"localStorage.setItem('domainhunter:theme','{tval}')")
            page.goto(f"{BASE}/prices?cb={cb}{tval}", wait_until="networkidle"); time.sleep(1)
            themes[tval] = page.evaluate("""() => ({
              cls: document.documentElement.className,
              bg: getComputedStyle(document.body).backgroundColor,
            })""")
            shot(page, f"J-theme-{tval}")
        findings["themes"] = themes
        findings["themes_distinct"] = themes["light"]["bg"] != themes["dark"]["bg"]
        if theme0:
            page.evaluate(f"localStorage.setItem('domainhunter:theme', {json.dumps(theme0)})")
        else:
            page.evaluate("localStorage.removeItem('domainhunter:theme')")

        # ---- 375px ----
        mob = {}
        cdp = ctx.new_cdp_session(page)
        cdp.send("Emulation.setDeviceMetricsOverride", {"width": 375, "height": 812, "deviceScaleFactor": 2, "mobile": True})
        for path, name in [("/", "K1-375-home"), ("/prices", "K2-375-prices"), ("/tld", "K3-375-tldhub"), ("/guide", "K4-375-guidehub"), ("/vs", "K5-375-vshub"), ("/tld/com", "K6-375-tld"), ("/vs/com-vs-cn", "K7-375-vs"), ("/guide/saas", "K8-375-guide"), ("/advanced", "K9-375-advanced")]:
            page.goto(BASE + path, wait_until="networkidle"); time.sleep(1)
            mob[path] = page.evaluate("() => document.documentElement.scrollWidth")
            shot(page, name)
        # 375px /prices 过滤回归
        page.goto(BASE + "/prices", wait_until="networkidle"); time.sleep(1.5)
        pinp = page.locator("main input[type=search]").first
        pinp.fill("com"); time.sleep(0.8)
        findings["mobile_prices_filter"] = page.evaluate("() => document.querySelectorAll('main a[href^=\"/?tld=\"]').length")
        shot(page, "K10-375-prices-filter")
        pinp.fill("")
        cdp.send("Emulation.clearDeviceMetricsOverride")
        findings["mobile_375_scrollWidth"] = mob

        # ---- usage post ----
        page.goto(BASE + "/", wait_until="networkidle")
        findings["usage_post"] = page.evaluate("async () => await (await fetch('/api/usage')).json()")
        findings["usage_days_equal"] = findings["usage_pre"]["days"] == findings["usage_post"]["days"]
        page.close()

    findings["console_errors"] = console_errors
    json.dump(findings, open(out, "w"), ensure_ascii=False, indent=2)
    slim = {k: v for k, v in findings.items() if k not in ("usage_pre", "usage_post")}
    print(json.dumps(slim, ensure_ascii=False, indent=1)[:12000])


if __name__ == "__main__":
    main(sys.argv[1])
