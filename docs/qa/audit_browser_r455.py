"""R455 零 AI 全站审计——浏览器侧检查（Playwright over CDP，不触碰任何 AI 路径）。

覆盖（重点 R444–R451 回归面）：
1. R447/R451 chunk 负载：内容页 onload + 空闲 6s 后实际加载的 JS 资源清单中
   0 个 home-page/domain-row/agent/search chunk（R451：SEO 页不再预取搜索 chunk）；
   首页 full 预载（home-page chunk 实际加载）；
2. SSR/水合一致性抽样：内容页 domcontentloaded 时 h1/首段 与水合后一致；
3. 首页硬导航 / 内容页 SPA 返回首页无白屏；
4. R423/R415 常规回归：/prices 396 行过滤+排序+回顶、三 hub 锚点导航/过滤；
5. 快查 All=397、chips 预填（/?tld=）、shortlist/monitor 流程（非 AI）；
6. 双主题、375px scrollWidth、键盘可达、console 错误；
7. 零 AI 佐证：/api/usage 前后 days 深比较。

用法：python3 audit_browser_r455.py findings-r455-browser.json
"""
import json
import re
import sys
import time

from playwright.sync_api import sync_playwright

BASE = "https://hunt.zalize.com"
SHOTS = "screenshots-r455"
RE_EXACT = re.compile("精确核验|Exact check")
RE_MORE = re.compile("查更多后缀|more TLDs")
DONE_JS = "() => { const e=[...document.querySelectorAll('main *')].find(x=>x.childElementCount===0&&/核验完成|Check complete/.test(x.textContent||'')); return e?e.textContent.trim():null; }"
FORBIDDEN = ["home-page-", "domain-row-", "agent-", "search-", "results-export-"]

findings = {}
console_errors = []


def attach_console(page):
    page.on("console", lambda m: console_errors.append({"type": m.type, "text": m.text[:200], "url": page.url}) if m.type == "error" else None)
    page.on("pageerror", lambda e: console_errors.append({"type": "pageerror", "text": str(e)[:200], "url": page.url}))


def shot(page, name):
    page.screenshot(path=f"{SHOTS}/{name}.png", full_page=False)


NAV_SEL = 'nav[aria-label="分组导航"], nav[aria-label="Group navigation"]'
TOP_SEL = 'button[aria-label="回到顶部"], button[aria-label="Back to top"]'

JS_RESOURCES = """() => [...performance.getEntriesByType('resource')]
  .map(e => e.name).filter(n => n.endsWith('.js') && n.includes('/assets/'))
  .map(n => n.split('/assets/')[1])"""


def chunk_audit(page, path, cb):
    """R447/R451：onload + 空闲 6s 后实际加载 JS 资源，断言 0 禁用 chunk。"""
    page.goto(f"{BASE}{path}?cb={cb}chunk", wait_until="load")
    time.sleep(6)  # 空闲期：捕捉 onload 后的延迟预取
    js = page.evaluate(JS_RESOURCES)
    bad = sorted({f for f in js for p in FORBIDDEN if f.startswith(p)})
    return {"js_count": len(js), "js": js, "forbidden_loaded": bad, "pass": not bad}


def ssr_hydration_probe(page, path, cb):
    """SSR（domcontentloaded 时）与水合后 h1/首段一致性。"""
    page.goto(f"{BASE}{path}?cb={cb}ssr", wait_until="domcontentloaded")
    snap = "() => ({h1: document.querySelector('main h1')?.textContent.trim() || null, p: document.querySelector('main p')?.textContent.trim().slice(0,120) || null})"
    ssr = page.evaluate(snap)
    page.wait_for_load_state("networkidle")
    time.sleep(2)
    hyd = page.evaluate(snap)
    return {"ssr": ssr, "hydrated": hyd, "equal": ssr == hyd and bool(ssr["h1"])}


def hub_regress(page, path, filter_query, cb):
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
      return {{ target: id, hash_ok: location.hash === '#'+id,
        nav_bottom: Math.round(navRect.bottom), h2_top: Math.round(h2Rect.top),
        not_clipped: h2Rect.top >= navRect.bottom - 1, scrolled: window.scrollY > 100 }};
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
    inp.fill("zzzqqq-no-match-r455"); time.sleep(1)
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

        # ---- R447/R451：chunk 负载审计（内容页 3 + hub 1 + prices） ----
        ch = {}
        for path in ("/tld/com", "/guide/saas", "/vs/com-vs-cn", "/tld", "/prices"):
            ch[path] = chunk_audit(page, path, cb)
        findings["chunk_audit"] = {k: {kk: vv for kk, vv in v.items() if kk != "js"} for k, v in ch.items()}
        findings["chunk_audit_js_lists"] = {k: v["js"] for k, v in ch.items()}
        findings["chunk_audit_all_pass"] = all(v["pass"] for v in ch.values())
        shot(page, "C1-chunk-audit")
        # 首页 full 预载：home-page chunk 实际加载
        page.goto(f"{BASE}/?cb={cb}home", wait_until="load"); time.sleep(3)
        homejs = page.evaluate(JS_RESOURCES)
        findings["home_full_preload"] = {"home_page_loaded": any(f.startswith("home-page-") for f in homejs),
                                          "domain_row_loaded": any(f.startswith("domain-row-") for f in homejs)}
        shot(page, "C2-home-loaded")

        # ---- SSR/水合一致性抽样 ----
        sh = {}
        for path in ("/tld/com", "/tld/ee", "/guide/saas", "/guide/jadecarving", "/vs/com-vs-cn", "/vs/kz-vs-tr"):
            sh[path] = ssr_hydration_probe(page, path, cb)
        findings["ssr_hydration"] = sh
        findings["ssr_hydration_all_equal"] = all(v["equal"] for v in sh.values())

        # ---- 首页硬导航 / SPA 返回无白屏 ----
        page.goto(f"{BASE}/?cb={cb}hard", wait_until="domcontentloaded")
        findings["home_hard_nav"] = page.evaluate("""() => ({
          main_text_len: (document.querySelector('main')?.innerText || '').length,
          has_h1: !!document.querySelector('main h1'),
        })""")
        page.wait_for_load_state("networkidle")
        page.goto(f"{BASE}/tld/com?cb={cb}back", wait_until="networkidle"); time.sleep(1)
        page.go_back(); time.sleep(2)
        findings["spa_back_home"] = page.evaluate("""() => ({
          url: location.pathname,
          main_text_len: (document.querySelector('main')?.innerText || '').length,
          has_h1: !!document.querySelector('main h1'),
        })""")
        shot(page, "C3-spa-back-home")

        # ---- 相关互链 SSR/水合一致（抽样） ----
        rel = {}
        for kind, slugs in [("tld", ["com", "ee"]), ("guide", ["saas", "jadecarving"]), ("vs", ["com-vs-cn", "kz-vs-tr"])]:
            for s in slugs:
                url = f"{BASE}/{kind}/{s}?cb={cb}rel"
                page.goto(url, wait_until="domcontentloaded")
                ssr = page.evaluate(SECTION_JS, REL_HEADINGS[kind])
                page.wait_for_load_state("networkidle"); time.sleep(1.5)
                hyd = page.evaluate(SECTION_JS, REL_HEADINGS[kind])
                rel[f"/{kind}/{s}"] = {"equal": ssr == hyd, "ssr": {k: v and len(v) for k, v in ssr.items()}}
        findings["related_hydration"] = rel
        findings["related_hydration_all_equal"] = all(v["equal"] for v in rel.values())

        # ---- R423：/prices 396 行过滤 + 排序 + 回顶 ----
        page.goto(f"{BASE}/prices?cb={cb}p", wait_until="networkidle"); time.sleep(2)
        pr = {}
        pr["rows_all"] = page.evaluate("() => document.querySelectorAll('main a[href^=\"/?tld=\"]').length")
        shot(page, "P1-prices-all")
        pinp = page.locator("main input[type=search]").first
        pinp.fill("shop"); time.sleep(0.8)
        pr["rows_shop"] = page.evaluate("() => document.querySelectorAll('main a[href^=\"/?tld=\"]').length")
        shot(page, "P2-prices-filter-shop")
        pinp.fill("zzzqqq-none-r455"); time.sleep(0.8)
        pr["rows_none"] = page.evaluate("() => document.querySelectorAll('main a[href^=\"/?tld=\"]').length")
        pr["empty_state_text"] = page.evaluate("() => (document.querySelector('main')||{innerText:''}).innerText.match(/没有匹配|No match[^\\n]*|无结果|not found/i)?.[0] || null")
        pinp.fill(""); time.sleep(0.8)
        pr["rows_restored"] = page.evaluate("() => document.querySelectorAll('main a[href^=\"/?tld=\"]').length")
        # 排序控件（如有）
        pr["sort"] = page.evaluate("""() => {
          const btns = [...document.querySelectorAll('main button, main [role=button], main th')]
            .filter(e => /价格|首年|续费|排序|Price|Renew|Sort/i.test(e.textContent||''));
          if (!btns.length) return {present: false};
          const rows = () => [...document.querySelectorAll('main a[href^="/?tld="]')].slice(0,5).map(a=>a.getAttribute('href'));
          const before = rows();
          btns[0].click();
          return {present: true, label: btns[0].textContent.trim().slice(0,30), before};
        }""")
        if pr["sort"].get("present"):
            time.sleep(1)
            pr["sort"]["after"] = page.evaluate("() => [...document.querySelectorAll('main a[href^=\"/?tld=\"]')].slice(0,5).map(a=>a.getAttribute('href'))")
            pr["sort"]["order_changed"] = pr["sort"]["after"] != pr["sort"]["before"]
            shot(page, "P5-prices-sort")
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

        # ---- R415：三 hub ----
        findings["hub_r415"] = {
            "/tld": hub_regress(page, "/tld", "berlin", cb),
            "/guide": hub_regress(page, "/guide", "茶", cb),
            "/vs": hub_regress(page, "/vs", "kaufen", cb),
        }

        # ---- chips 预填：/?tld=shop ----
        page.goto(f"{BASE}/?tld=shop&cb={cb}chip", wait_until="networkidle"); time.sleep(1.5)
        findings["chips_prefill"] = page.evaluate("""() => {
          const sel = [...document.querySelectorAll('main button, main [role=checkbox], main label, main [aria-pressed]')]
            .filter(e => /(^|\\.)shop$/i.test((e.textContent||'').trim()) || /shop/i.test(e.getAttribute('aria-label')||''));
          const pressed = sel.filter(e => e.getAttribute('aria-pressed')==='true' || e.getAttribute('aria-checked')==='true' || /selected|active|bg-acc/i.test(e.className||''));
          const t = (document.querySelector('main')||{innerText:''}).innerText;
          return {candidates: sel.length, pressed: pressed.length, mentions_shop: /\\.shop/.test(t)};
        }""")
        shot(page, "B3-chips-prefill")

        # ---- 快查 All=397 ----
        label = f"qzxvkw9r455x{cb % 1000}"
        page.goto(f"{BASE}/?cb={cb}q", wait_until="networkidle"); time.sleep(1)
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
                if s2 and re.search(r"共\s*39\d|/\s*39\d", s2): break
                time.sleep(1)
            findings["quick_all"] = s2
            shot(page, "B2-quickcheck-all")

        # ---- shortlist 流程（非 AI）----
        sl = {}
        sl["star_click"] = page.evaluate("""() => {
          const btns = [...document.querySelectorAll('main button')].filter(b => /清单|收藏|Shortlist|star/i.test((b.getAttribute('aria-label')||'') + b.textContent));
          if (!btns.length) return {present:false};
          btns[0].click();
          return {present:true, label:(btns[0].getAttribute('aria-label')||btns[0].textContent).trim().slice(0,40)};
        }""")
        time.sleep(1)
        sl["ls_after_add"] = page.evaluate("() => localStorage.getItem('domainhunter:shortlist')")
        page.goto(f"{BASE}/shortlist?cb={cb}sl", wait_until="networkidle"); time.sleep(1.5)
        sl["page_shows_domain"] = page.evaluate(f"() => (document.querySelector('main')||{{innerText:''}}).innerText.includes('{label}')")
        shot(page, "S1-shortlist")
        findings["shortlist_flow"] = sl

        # ---- monitors 页面（非 AI，只读） ----
        page.goto(f"{BASE}/monitors?cb={cb}m", wait_until="networkidle"); time.sleep(1.5)
        findings["monitors_page"] = page.evaluate("""() => ({
          main_text_len: (document.querySelector('main')?.innerText||'').length,
          has_h1: !!document.querySelector('main h1'),
          has_input: !!document.querySelector('main input, main textarea'),
        })""")
        shot(page, "S2-monitors")

        # ---- 双主题 ----
        theme0 = page.evaluate("() => localStorage.getItem('domainhunter:theme')")
        themes = {}
        for tval in ("light", "dark"):
            page.evaluate(f"localStorage.setItem('domainhunter:theme','{tval}')")
            page.goto(f"{BASE}/prices?cb={cb}{tval}", wait_until="networkidle"); time.sleep(1)
            themes[tval] = page.evaluate("() => ({cls: document.documentElement.className, bg: getComputedStyle(document.body).backgroundColor})")
            shot(page, f"J-theme-{tval}")
            page.goto(f"{BASE}/tld/com?cb={cb}{tval}2", wait_until="networkidle"); time.sleep(1)
            shot(page, f"J-theme-{tval}-tld")
        findings["themes"] = themes
        findings["themes_distinct"] = themes["light"]["bg"] != themes["dark"]["bg"]
        if theme0:
            page.evaluate(f"localStorage.setItem('domainhunter:theme', {json.dumps(theme0)})")
        else:
            page.evaluate("localStorage.removeItem('domainhunter:theme')")

        # ---- 键盘可达 ----
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

        # ---- 375px ----
        mob = {}
        cdp = ctx.new_cdp_session(page)
        cdp.send("Emulation.setDeviceMetricsOverride", {"width": 375, "height": 812, "deviceScaleFactor": 2, "mobile": True})
        for path, name in [("/", "K1-375-home"), ("/prices", "K2-375-prices"), ("/tld", "K3-375-tldhub"), ("/guide", "K4-375-guidehub"), ("/vs", "K5-375-vshub"), ("/tld/com", "K6-375-tld"), ("/vs/com-vs-cn", "K7-375-vs"), ("/guide/saas", "K8-375-guide")]:
            page.goto(BASE + path, wait_until="networkidle"); time.sleep(1)
            mob[path] = page.evaluate("() => document.documentElement.scrollWidth")
            shot(page, name)
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
    slim = {k: v for k, v in findings.items() if k not in ("usage_pre", "usage_post", "chunk_audit_js_lists")}
    print(json.dumps(slim, ensure_ascii=False, indent=1)[:14000])


if __name__ == "__main__":
    main(sys.argv[1])
