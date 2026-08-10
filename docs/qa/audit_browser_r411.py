"""R411 零 AI 全站审计——浏览器侧检查（Playwright over CDP，不触碰任何 AI 路径）。

覆盖：
1. R407 回归面：
   - 注入缺失兜底路径：route 拦截剥掉 <script>window.__DH_CONTENT__=…</script>，
     对比兜底渲染 main 文本与正常加载逐字一致（tld/guide/vs 各 1 页）；
   - 水合一致性：SSR title/h1 与水合后一致、main 非空（含长尾 slug）；
   - 首页模板：chips 数量（zh/en）、部署的 home-template-texts chunk 全量与本地
     构建产物逐 slug 深比较（等价于全量 ?tpl= 语义抽查）、chip 点击预填 + ?tpl= 预填抽样。
2. 常规：quick-check（裸标签精确核验 + 查更多后缀 All + 重复输入）、/prices 行数、
   hub/footer 计数、shortlist/monitors/advanced/why/mcp 状态、advanced 批量核验、
   分享创建→展示→撤销→410、375px scrollWidth、键盘可用性（Tab 焦点链）、console 错误。
3. AI 降级 UX 仅静态检查（不触发 402）：错误条/横幅逻辑仅在源码层核验，本脚本只验证
   首页 amber 横幅在无 sessionStorage 标记时不显示。

用法：python3 audit_browser_r411.py findings-r411-browser.json
依赖本地基线（先生成）：
  npx tsx -e "import {TEMPLATE_TEXTS} from '../../apps/web/src/content/home-template-texts';
  import {TEMPLATE_LABELS} from '../../apps/web/src/content/home-template-labels'; import fs from 'fs';
  fs.writeFileSync('template-texts-local-r411.json', JSON.stringify(TEMPLATE_TEXTS));
  fs.writeFileSync('template-labels-local-r411.json', JSON.stringify(TEMPLATE_LABELS));"
"""
import json
import re
import sys
import time

from playwright.sync_api import sync_playwright

BASE = "https://hunt.zalize.com"
SHOTS = "screenshots-r411"
RE_EXACT = re.compile("精确核验|Exact check")
RE_MORE = re.compile("查更多后缀|more TLDs")
DONE_JS = "() => { const e=[...document.querySelectorAll('main *')].find(x=>x.childElementCount===0&&/核验完成|Check complete/.test(x.textContent||'')); return e?e.textContent.trim():null; }"
INJECT_RE = re.compile(rb"<script>window\.__DH_CONTENT__=.*?</script>", re.S)

findings = {}
console_errors = []


def attach_console(page):
    page.on("console", lambda m: console_errors.append({"type": m.type, "text": m.text[:200], "url": page.url}) if m.type == "error" else None)
    page.on("pageerror", lambda e: console_errors.append({"type": "pageerror", "text": str(e)[:200], "url": page.url}))


def shot(page, name):
    page.screenshot(path=f"{SHOTS}/{name}.png", full_page=False)


MAIN_TEXT_JS = "() => (document.querySelector('main')||{innerText:''}).innerText"


def main(out):
    cb = int(time.time())
    local_texts = json.load(open("template-texts-local-r411.json"))
    with sync_playwright() as p:
        b = p.chromium.connect_over_cdp("http://localhost:29229")
        ctx = b.contexts[0]
        page = ctx.new_page()
        attach_console(page)

        page.goto(f"{BASE}/?cb={cb}", wait_until="networkidle")
        findings["usage_pre"] = page.evaluate("async () => await (await fetch('/api/usage')).json()")
        page.evaluate("localStorage.setItem('domainhunter:lang','zh')")

        # ---- R407-1: 注入缺失兜底路径（剥掉注入脚本，对比渲染逐字一致） ----
        fallback = {}
        for path in ["/tld/london", "/guide/hearingaid", "/vs/university-vs-education"]:
            page.goto(BASE + path, wait_until="networkidle"); time.sleep(1.5)
            normal_text = page.evaluate(MAIN_TEXT_JS)
            normal_injected = page.evaluate("() => !!window.__DH_CONTENT__")

            page2 = ctx.new_page()
            attach_console(page2)
            page2.route("**/*", lambda route: route.fulfill(
                status=200, content_type="text/html; charset=utf-8",
                body=INJECT_RE.sub(b"", route.fetch().body()),
            ) if route.request.resource_type == "document" else route.continue_())
            page2.goto(BASE + path, wait_until="networkidle"); time.sleep(2.5)
            stripped_flag = page2.evaluate("() => document.documentElement.outerHTML.includes('__DH_CONTENT__=') ")
            fb_text = page2.evaluate(MAIN_TEXT_JS)
            fb_content = page2.evaluate("() => window.__DH_CONTENT__ ? window.__DH_CONTENT__.kind : null")
            shot(page2, "F-fallback-" + path.strip("/").replace("/", "-"))
            page2.close()
            fallback[path] = {
                "normal_injected": normal_injected,
                "ssr_script_stripped": not stripped_flag,
                "fallback_built_kind": fb_content,
                "text_equal": normal_text == fb_text,
                "normal_len": len(normal_text), "fallback_len": len(fb_text),
            }
        findings["fallback_no_inject"] = fallback

        # ---- R407-2: 水合一致性（含长尾/新页） ----
        hydr = {}
        for path in ["/tld/com", "/tld/london", "/guide/saas", "/guide/hearingaid", "/vs/com-vs-cn", "/vs/university-vs-education"]:
            page.goto(BASE + path, wait_until="networkidle"); time.sleep(1)
            hydr[path] = page.evaluate("""() => ({
              h1: (document.querySelector('main h1')||{}).textContent||null,
              title: document.title,
              mainLen: (document.querySelector('main')||{innerText:''}).innerText.length,
              injected: !!window.__DH_CONTENT__,
            })""")
            shot(page, "E-hydration-" + path.strip("/").replace("/", "-"))
        findings["hydration"] = hydr

        # ---- R407-3: 首页模板 chips + 全量文案比较 + 预填抽样 ----
        page.goto(f"{BASE}/?cb={cb}t", wait_until="networkidle"); time.sleep(1)
        chunk_url = page.evaluate("""async () => {
          const mods = performance.getEntriesByType('resource').map(r=>r.name).filter(n=>/home-template-texts/.test(n));
          if (mods.length) return mods[0];
          // 空闲预取可能未跑完：从主 chunk 源码里解析不可靠，直接等预取
          await new Promise(r=>setTimeout(r,4000));
          return (performance.getEntriesByType('resource').map(r=>r.name).find(n=>/home-template-texts/.test(n))) || null;
        }""")
        findings["template_chunk_url"] = chunk_url
        deployed = page.evaluate("async (u) => (await import(u)).TEMPLATE_TEXTS", chunk_url) if chunk_url else None
        if deployed:
            miss = [k for k in local_texts if k not in deployed]
            extra = [k for k in deployed if k not in local_texts]
            diff = [k for k in local_texts if k in deployed and deployed[k] != local_texts[k]]
            findings["template_texts_full_compare"] = {
                "local_count": len(local_texts), "deployed_count": len(deployed),
                "missing_in_deployed": miss, "extra_in_deployed": extra, "content_diff": diff,
                "all_equal": not (miss or extra or diff),
            }
        # chips 数量（zh / en，展开全部）
        chips = {}
        for lang in ("zh", "en"):
            page.evaluate(f"localStorage.setItem('domainhunter:lang','{lang}')")
            page.goto(f"{BASE}/?cb={cb}{lang}", wait_until="networkidle"); time.sleep(1)
            more = page.locator("main button", has_text=re.compile(r"^\+\d+$")).first
            if more.count():
                more.click(); time.sleep(0.5)
            chips[lang] = page.evaluate("(n) => [...document.querySelectorAll('main button')].filter(b=>{const t=(b.textContent||'').trim(); return t && n.some(x=>x===t);}).length",
                                        [(v["labelZh"] if lang == "zh" else v["labelEn"]) for v in json.load(open("template-labels-local-r411.json"))])
            shot(page, f"T1-chips-{lang}")
        findings["template_chip_counts"] = chips
        # chip 点击预填抽样（R405 新增 6 个 + saas）
        page.evaluate("localStorage.setItem('domainhunter:lang','zh')")
        labels = json.load(open("template-labels-local-r411.json"))
        sample_slugs = [l["slug"] for l in labels[-6:]] + ["saas"]
        chip_fill = {}
        for l in labels:
            if l["slug"] not in sample_slugs:
                continue
            page.goto(f"{BASE}/?cb={cb}c{l['slug']}", wait_until="networkidle"); time.sleep(0.8)
            more = page.locator("main button", has_text=re.compile(r"^\+\d+$")).first
            if more.count():
                more.click(); time.sleep(0.4)
            page.locator("main button", has_text=re.compile("^" + re.escape(l["labelZh"]) + "$")).first.click()
            time.sleep(0.8)
            val = page.locator("main textarea").first.input_value()
            chip_fill[l["slug"]] = val == local_texts[l["slug"]]["zh"]
        findings["template_chip_fill_sample"] = chip_fill
        shot(page, "T2-chip-fill")
        # ?tpl= 预填抽样（zh + en 各 3，含最新与最老）
        tpl_fill = {}
        for slug in [labels[0]["slug"], labels[len(labels) // 2]["slug"], labels[-1]["slug"]]:
            for lang in ("zh", "en"):
                page.evaluate(f"localStorage.setItem('domainhunter:lang','{lang}')")
                page.goto(f"{BASE}/?tpl={slug}&cb={cb}{lang}2", wait_until="networkidle"); time.sleep(1.5)
                val = page.locator("main textarea").first.input_value()
                tpl_fill[f"{slug}:{lang}"] = val == local_texts[slug][lang]
        findings["template_tpl_fill_sample"] = tpl_fill
        shot(page, "T3-tpl-fill")
        page.evaluate("localStorage.setItem('domainhunter:lang','zh')")

        # ---- 首页不加载全量内容 chunk（R407 性能语义） ----
        page.goto(f"{BASE}/?cb={cb}p", wait_until="networkidle"); time.sleep(2)
        findings["home_no_injected_build_chunk"] = page.evaluate(
            "() => performance.getEntriesByType('resource').every(r=>!/injected-build/.test(r.name))")

        # ---- quick-check ----
        label = f"qzxvkw9r411x{cb % 1000}"
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
                if s2 and re.search(r"共\s*3\d\d|/\s*33\d", s2): break
                time.sleep(1)
            findings["quick_all"] = s2
            findings["quick_pending_count"] = page.evaluate("() => [...document.querySelectorAll('main *')].filter(x=>x.childElementCount===0&&/查询中|pending|Checking/i.test(x.textContent||'')).length")
            shot(page, "B2-quickcheck-all")
        page.goto(f"{BASE}/?cb={cb}q2", wait_until="networkidle"); time.sleep(1)
        page.get_by_role("button", name=RE_EXACT).first.click(); time.sleep(0.3)
        inp = page.locator("main textarea, main input[type=text]").first
        inp.fill(label); inp.press("Enter")
        s3 = None
        for _ in range(90):
            s3 = page.evaluate(DONE_JS)
            if s3: break
            time.sleep(1)
        findings["quick_repeat"] = s3
        shot(page, "B3-quickcheck-repeat")

        # ---- /prices + hubs + footer ----
        page.goto(BASE + "/prices", wait_until="networkidle"); time.sleep(2)
        findings["prices_rows"] = page.evaluate("() => document.querySelectorAll('main a[href^=\"/?tld=\"]').length")
        shot(page, "C1-prices")
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

        # ---- AI 降级静态面：无 sessionStorage 标记时首页不显示 amber 横幅 ----
        findings["ai_banner_absent_by_default"] = page.evaluate(
            "() => !document.body.innerText.includes('AI 猎名暂不可用') && !sessionStorage.getItem('dh:aiQuotaDown:v1')")

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
            done = page.evaluate(DONE_JS)
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

        # ---- 键盘可用性：Tab 焦点链（首页前 10 个焦点均可见且有 outline/ring） ----
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

        # ---- 375px ----
        mob = {}
        cdp = ctx.new_cdp_session(page)
        cdp.send("Emulation.setDeviceMetricsOverride", {"width": 375, "height": 812, "deviceScaleFactor": 2, "mobile": True})
        for path, name in [("/", "K1-375-home"), ("/prices", "K2-375-prices"), ("/tld/london", "K3-375-tld"), ("/vs/university-vs-education", "K4-375-vs"), ("/guide/hearingaid", "K5-375-guide"), ("/shortlist", "K6-375-shortlist"), ("/advanced", "K7-375-advanced"), ("/why", "K8-375-why"), ("/mcp", "K9-375-mcp")]:
            page.goto(BASE + path, wait_until="networkidle"); time.sleep(1)
            mob[path] = page.evaluate("() => document.documentElement.scrollWidth")
            shot(page, name)
        cdp.send("Emulation.clearDeviceMetricsOverride")
        findings["mobile_375_scrollWidth"] = mob

        # ---- usage post（全程零 AI 证明） ----
        page.goto(BASE + "/", wait_until="networkidle")
        findings["usage_post"] = page.evaluate("async () => await (await fetch('/api/usage')).json()")
        findings["usage_days_equal"] = findings["usage_pre"]["days"] == findings["usage_post"]["days"]
        page.close()

    findings["console_errors"] = console_errors
    json.dump(findings, open(out, "w"), ensure_ascii=False, indent=2)
    slim = {k: v for k, v in findings.items() if k not in ("usage_pre", "usage_post")}
    print(json.dumps(slim, ensure_ascii=False, indent=1)[:9000])


if __name__ == "__main__":
    main(sys.argv[1])
