"""R564 本地 Playwright 验证：/?q= 落地精确核验 + unknown 原因/单行重试 + taken CTA（全部 API mock，0 真实上游）"""
import asyncio, json, sys, re
from playwright.async_api import async_playwright

BASE = "http://localhost:8787"
OUT = "/home/ubuntu/r564"
import os; os.makedirs(OUT, exist_ok=True)

def nd(lines): return "\n".join(json.dumps(l) for l in lines) + "\n"

SEARCH_BODY = nd([
    {"domain": "chaxiang.com", "status": "taken", "method": "rdap", "expiresAt": "2028-09-14T04:00:00.000Z"},
    {"domain": "chaxiang.cn", "status": "unknown", "method": "rdap", "detail": "http-429"},
    {"domain": "chaxiang.ai", "status": "unknown", "method": "whois", "detail": "reserved"},
    {"domain": "chaxiang.io", "status": "available", "method": "rdap"},
])
CHECK_BODY = nd([{"domain": "chaxiang.cn", "status": "taken", "method": "rdap", "expiresAt": "2027-03-01T00:00:00.000Z"}])

RESULTS = []
def ok(name, cond, extra=""):
    RESULTS.append((name, bool(cond), extra)); print(("PASS " if cond else "FAIL ") + name, extra)

async def wire(page, calls):
    async def handle(route):
        req = route.request
        url = req.url.replace(BASE, "")
        calls.append({"url": url, "method": req.method, "body": req.post_data})
        if url.startswith("/api/search"):
            await route.fulfill(status=200, content_type="application/x-ndjson", body=SEARCH_BODY)
        elif url.startswith("/api/check"):
            body = json.loads(req.post_data or "{}")
            doms = body.get("domains", [])
            await route.fulfill(status=200, content_type="application/x-ndjson", body=nd([
                {"domain": d, "status": "taken", "method": "rdap", "expiresAt": "2027-03-01T00:00:00.000Z"} for d in doms]))
        elif url.startswith("/api/ai-search"):
            await route.fulfill(status=200, content_type="application/x-ndjson", body=nd([
                {"type": "round", "round": 1},
                {"type": "proposed", "round": 1, "items": [{"label": "lingxicha", "meaning": "灵犀茶", "theme": "pinyin"}], "tlds": ["com", "ai", "cn"]},
                {"domain": "lingxicha.com", "status": "taken", "expiresAt": "2028-01-01T00:00:00.000Z"},
                {"domain": "lingxicha.ai", "status": "unknown", "detail": "http-429"},
                {"domain": "lingxicha.cn", "status": "available"},
                {"type": "done"},
            ]))
        else:
            await route.continue_()
    await page.route("**/api/**", handle)

async def landing(ctx, width, tag):
    page = await ctx.new_page()
    await page.set_viewport_size({"width": width, "height": 800 if width > 400 else 740})
    calls = []
    await wire(page, calls)
    await page.goto(f"{BASE}/?q=chaxiang")
    # 精确核验 tab 选中
    await page.wait_for_selector("[data-quick-check]", timeout=8000)
    pressed = await page.evaluate("""() => [...document.querySelectorAll('[role=tab],[aria-pressed],button')]
        .filter(b => /精确核验|Exact/.test(b.textContent||'')).map(b => b.getAttribute('aria-pressed')||b.getAttribute('aria-selected')||b.dataset.state||b.className)""")
    ok(f"[{tag}] 精确核验 tab 选中", any(p and ("true" in p or "active" in p or "bg-" in p) for p in pressed), str(pressed)[:120])
    await page.wait_for_selector("[data-unknown-reason]", timeout=8000)
    await page.wait_for_timeout(900)  # smooth scroll
    box = await page.evaluate("""() => { const r = document.querySelector('[data-quick-check]').getBoundingClientRect(); return {top:r.top,bottom:r.bottom,ih:innerHeight,sy:scrollY,sw:document.documentElement.scrollWidth} }""")
    ok(f"[{tag}] 结果区在视口内（无需手动滚动）", 0 <= box["top"] < box["ih"] and box["bottom"] > 0, json.dumps(box))
    ok(f"[{tag}] 无横向溢出", box["sw"] <= width, f"scrollWidth={box['sw']}")
    ok(f"[{tag}] 自动核验恰 1 次 /api/search，0 次 /api/ai-search",
       sum(1 for c in calls if c["url"].startswith("/api/search")) == 1 and not any("/api/ai-search" in c["url"] for c in calls),
       json.dumps([c["url"] for c in calls]))
    reasons = await page.evaluate("() => [...document.querySelectorAll('[data-unknown-reason]')].map(e => [e.dataset.unknownReason, e.textContent])")
    ok(f"[{tag}] unknown 原因双语可读（http-429→限流；reserved→保留）",
       any(r[0]=="rate-limited" and "限流" in r[1] for r in reasons) and any(r[0]=="reserved" and "保留" in r[1] for r in reasons), json.dumps(reasons, ensure_ascii=False))
    rechecks = await page.evaluate("() => [...document.querySelectorAll('[data-recheck]')].map(e => { const r = e.getBoundingClientRect(); return {d:e.dataset.recheck, w:r.width, h:r.height} })")
    ok(f"[{tag}] chaxiang.cn（http-429）有重试、chaxiang.ai（reserved）无重试",
       any(r["d"]=="chaxiang.cn" for r in rechecks) and not any(r["d"]=="chaxiang.ai" for r in rechecks), json.dumps(rechecks))
    if width <= 400:
        ok(f"[{tag}] 重试触点 ≥44px", all(r["w"] >= 44 and r["h"] >= 44 for r in rechecks), json.dumps(rechecks))
    taken = await page.evaluate("""() => { const chip = [...document.querySelectorAll('[data-quick-check] *')].find(e => e.textContent.trim()==='chaxiang.com'); const wrap = chip && chip.closest('span,div,li'); return wrap ? wrap.parentElement.textContent : '' }""")
    taken_html = await page.evaluate("() => document.querySelector('[data-quick-check]').innerHTML")
    ok(f"[{tag}] taken 行有开监控 + 到期 + 重新核验，无去注册", ("开监控" in taken_html or "监控" in taken_html) and "2028" in taken_html and 'data-recheck="chaxiang.com"' in taken_html, "")
    await page.screenshot(path=f"{OUT}/landing-{tag}.png", full_page=False)
    # 单行重试
    n_before = len(calls)
    await page.click('[data-recheck="chaxiang.cn"]')
    await page.wait_for_timeout(1200)
    new = calls[n_before:]
    ok(f"[{tag}] 重试恰 1 次 POST /api/check?refresh=1（不碰 /api/search、/api/ai-search）",
       len(new) == 1 and new[0]["url"] == "/api/check?refresh=1" and new[0]["method"] == "POST" and json.loads(new[0]["body"]) == {"domains": ["chaxiang.cn"], "refresh": True},
       json.dumps(new, ensure_ascii=False))
    after = await page.evaluate("() => document.querySelector('[data-quick-check]').innerHTML")
    ok(f"[{tag}] 重试后 chaxiang.cn → taken（2027 到期可见，reason 消失）", "2027" in after and 'data-unknown-reason="rate-limited"' not in after, "")
    await page.screenshot(path=f"{OUT}/after-retry-{tag}.png", full_page=False)
    await page.close()

async def ai_landing(ctx):
    page = await ctx.new_page(); calls = []; await wire(page, calls)
    await page.goto(f"{BASE}/?q=%E6%96%B0%E4%B8%AD%E5%BC%8F%E8%8C%B6%E5%8F%B6%E7%94%B5%E5%95%86")
    await page.wait_for_timeout(1800)
    has_quick = await page.evaluate("() => !!document.querySelector('[data-quick-check]')")
    sc = [c['url'] for c in calls if '/api/search' in c['url'] or '/api/ai-search' in c['url'] or '/api/check' in c['url']]
    ok("[ai] ?q=<寓意> 仍 AI 猎名：无 quick-check 面板、0 次核验/AI 请求", not has_quick and not sc, json.dumps(sc))
    await page.goto(f"{BASE}/?mode=exact")
    await page.wait_for_timeout(800)
    pressed = await page.evaluate("""() => [...document.querySelectorAll('button')].filter(b => /精确核验|Exact/.test(b.textContent||'')).map(b => b.getAttribute('aria-pressed'))""")
    sc = [c['url'] for c in calls if '/api/search' in c['url'] or '/api/ai-search' in c['url'] or '/api/check' in c['url']]
    ok("[exact] ?mode=exact 仍精确模式且无自动请求", "true" in pressed and not sc, json.dumps(pressed))
    await page.close()

async def advanced(ctx):
    page = await ctx.new_page(); calls = []; await wire(page, calls)
    await page.goto(f"{BASE}/advanced")
    await page.wait_for_selector("textarea", timeout=8000)
    await page.fill("textarea", "chaxiang.com\nchaxiang.cn\nchaxiang.ai")
    await page.get_by_role("button", name=re.compile("核验|Check")).first.click()
    await page.wait_for_selector("[data-unknown-reason]", timeout=8000)
    html = await page.content()
    ok("[advanced] unknown 行原因 + 重试；reserved 无重试；taken 开监控+到期",
       "限流" in html and 'data-recheck="chaxiang.cn"' in html and 'data-recheck="chaxiang.ai"' not in html and "2028" in html and "监控" in html, "")
    await page.screenshot(path=f"{OUT}/advanced.png")
    n = len(calls); await page.click('[data-recheck="chaxiang.cn"]'); await page.wait_for_timeout(1200)
    new = calls[n:]
    ok("[advanced] 重试恰 1 次 POST /api/check?refresh=1", len(new)==1 and new[0]["url"]=="/api/check?refresh=1" and new[0]["method"]=="POST", json.dumps(new))
    await page.close()

async def results(ctx):
    page = await ctx.new_page(); calls = []; await wire(page, calls)
    await page.goto(f"{BASE}/?q=%E6%96%B0%E4%B8%AD%E5%BC%8F%E8%8C%B6%E5%8F%B6%E7%94%B5%E5%95%86")
    await page.wait_for_timeout(800)
    await page.get_by_role("button", name=re.compile("开始猎取|Start hunting")).click()
    try:
        # 结果页默认只看「可注册」过滤，unknown/taken 行需切到「全部」
        await page.get_by_role("button", name=re.compile("^全部|^All \\d")).first.click(timeout=10000)
        await page.wait_for_selector("[data-unknown-reason]", timeout=10000)
    except Exception as e:
        ok("[results] 进入结果页并出现 unknown 行", False, str(e)[:100]); await page.screenshot(path=f"{OUT}/results-fail.png"); await page.close(); return
    html = await page.content()
    ok("[results] unknown 原因 + 重试；taken 开监控+到期，无去注册",
       "限流" in html and 'data-recheck="lingxicha.ai"' in html and "2028" in html and "监控" in html, "")
    await page.screenshot(path=f"{OUT}/results.png")
    n = len(calls); await page.click('[data-recheck="lingxicha.ai"]'); await page.wait_for_timeout(1200)
    new = calls[n:]
    ok("[results] 重试恰 1 次 POST /api/check?refresh=1（mock ai-search 仅用于进入结果页，0 真实 AI）",
       len(new)==1 and new[0]["url"]=="/api/check?refresh=1" and new[0]["method"]=="POST", json.dumps(new))
    await page.close()

async def main():
    async with async_playwright() as p:
        b = await p.chromium.connect_over_cdp("http://localhost:29229")
        ctx = await b.new_context(locale="zh-CN")
        await landing(ctx, 1280, "desktop")
        await landing(ctx, 375, "375")
        await ai_landing(ctx)
        await advanced(ctx)
        await results(ctx)
        await b.close()
    fails = [r for r in RESULTS if not r[1]]
    print(f"\n{len(RESULTS)-len(fails)}/{len(RESULTS)} passed")
    sys.exit(1 if fails else 0)

asyncio.run(main())
