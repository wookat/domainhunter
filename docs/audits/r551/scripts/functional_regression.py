"""R551 范围5 非 AI 功能回归（生产 hunt.zalize.com，独立无痕 Chromium，零 /api/ai-search）。
覆盖：精确核验去重（改名 +1 / .cn 切换 +1 / .io 切换 0 / 重复点击 0）、查更多后缀 +1、单域重试 +1（若有 unknown）、
高级批量核验 + CSV(expires_at)、shortlist 星标/备注/排序/同步码推送+导入/分享创建→撤销→410、monitors 添加→取消、清理核对。"""
import json, re, time, sys
from playwright.sync_api import sync_playwright, expect

CHROME = open("/home/ubuntu/r551/tools/chrome_path").read().strip()
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140 Safari/537.36 r551-audit"
BASE = "https://hunt.zalize.com"
OUT = "/home/ubuntu/r551/functional"
import os; os.makedirs(OUT, exist_ok=True)
LABEL = "r551zeroaiaudit"
R = {"steps": [], "api_calls": [], "ai_calls": [], "console_errors": []}

def step(name, **kw):
    kw["name"] = name; R["steps"].append(kw); print("STEP", json.dumps(kw, ensure_ascii=False)[:400], flush=True)

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME, headless=True, args=["--no-sandbox"])
    ctx = b.new_context(user_agent=UA, viewport={"width": 1280, "height": 900}, locale="zh-CN", accept_downloads=True)
    def on_req(r):
        if "/api/ai-search" in r.url: R["ai_calls"].append(r.url)
        if "/api/" in r.url: R["api_calls"].append({"t": time.time(), "m": r.method, "url": r.url.replace(BASE, ""), "body": (r.post_data or "")[:4000]})
    ctx.on("request", on_req)
    pg = ctx.new_page()
    pg.on("console", lambda m: R["console_errors"].append({"page": pg.url, "text": m.text[:300]}) if m.type == "error" else None)
    pg.on("pageerror", lambda e: R["console_errors"].append({"page": pg.url, "text": "pageerror: " + str(e)[:300]}))

    def searches(): return [c for c in R["api_calls"] if c["url"].startswith("/api/search") and c["m"] == "POST"]

    # ---------- 5.1 精确核验去重 ----------
    pg.goto(BASE + "/", wait_until="networkidle")
    pg.get_by_role("button", name="精确核验").first.click()
    ta = pg.locator("#home-description")
    n0 = len(searches())
    ta.fill(LABEL); pg.wait_for_timeout(1500)
    n1 = len(searches()); step("quick auto-check after 800ms", delta=n1 - n0, expected=1, body=searches()[-1]["body"] if n1 > n0 else None)
    pg.wait_for_timeout(4000)
    # 重复显式核验（无变化）→ 0
    btn = pg.get_by_role("button", name=re.compile(r"^核验 ")).first
    if btn.count(): btn.click()
    else: pg.get_by_role("button", name="立即核验").click()
    pg.wait_for_timeout(1500); n2 = len(searches()); step("explicit recheck without change", delta=n2 - n1, expected=0)
    # 改名 +1
    ta.fill(LABEL + "x"); pg.wait_for_timeout(1500); n3 = len(searches()); step("rename", delta=n3 - n2, expected=1)
    pg.wait_for_timeout(4000)
    # .cn 切换 +1（.cn 在默认 chip 集但不在 QUICK_EXTRA）
    cn = pg.locator("button[aria-pressed]", has_text=re.compile(r"^\.cn$")).first
    cn_before = cn.get_attribute("aria-pressed"); cn.click(); pg.wait_for_timeout(300)
    (pg.get_by_role("button", name=re.compile(r"^核验 ")).first if pg.get_by_role("button", name=re.compile(r"^核验 ")).count() else pg.get_by_role("button", name="立即核验")).click()
    pg.wait_for_timeout(1500); n4 = len(searches()); step(".cn toggle + explicit check", cn_pressed_before=cn_before, delta=n4 - n3, expected=1, body=searches()[-1]["body"] if n4 > n3 else None)
    pg.wait_for_timeout(4000)
    # .io 切换 0（.io 属 QUICK_EXTRA 有效集）
    io = pg.locator("button[aria-pressed]", has_text=re.compile(r"^\.io$")).first
    io_before = io.get_attribute("aria-pressed"); io.click(); pg.wait_for_timeout(300)
    (pg.get_by_role("button", name=re.compile(r"^核验 ")).first if pg.get_by_role("button", name=re.compile(r"^核验 ")).count() else pg.get_by_role("button", name="立即核验")).click()
    pg.wait_for_timeout(1500); n5 = len(searches()); step(".io toggle + explicit check", io_pressed_before=io_before, delta=n5 - n4, expected=0)
    # 查更多后缀 +1
    more = pg.get_by_role("button", name=re.compile(r"查更多后缀"))
    more.first.wait_for(timeout=15000); more_text = more.first.inner_text(); more.first.click(); pg.wait_for_timeout(2500)
    n6 = len(searches()); step("more suffixes", label=more_text, delta=n6 - n5, expected=1, tlds_in_body=len(json.loads(searches()[-1]["body"]).get("tlds", [])) if n6 > n5 else None)
    # 等待批次结束
    for _ in range(40):
        if pg.locator("svg.animate-spin").count() == 0: break
        pg.wait_for_timeout(500)
    rows = pg.locator("span[title], span.truncate").all_inner_texts()
    retry = pg.get_by_role("button", name=re.compile(r"^重新核验 "))
    if retry.count():
        rn = retry.first.get_attribute("aria-label"); retry.first.click(); pg.wait_for_timeout(2500)
        n7 = len(searches()); step("single-domain retry (unknown row)", button=rn, delta=n7 - n6, expected=1, body=searches()[-1]["body"] if n7 > n6 else None)
    else:
        step("single-domain retry (unknown row)", status="untested: no unknown row present", delta=None)
    pg.screenshot(path=f"{OUT}/01_home_quickcheck.png", full_page=True)
    # 星标 → shortlist
    fav = pg.get_by_role("button", name="收藏到候选清单")
    fav_n = fav.count()
    if fav_n:
        fav.first.click(); pg.wait_for_timeout(300)
    step("star from quick-check", fav_buttons=fav_n, after_remove_buttons=pg.get_by_role("button", name="移出候选清单").count(), expected=">=1")

    # ---------- 5.2 高级批量 + CSV ----------
    pg.goto(BASE + "/advanced", wait_until="networkidle")
    pg.locator("#advanced-bulk").fill(f"{LABEL}\n{LABEL}.io\ngoogle.com")
    nb = len(searches())
    pg.get_by_role("button", name=re.compile(r"^核验 \d+ 个域名")).click()
    for _ in range(60):
        if pg.locator("svg.animate-spin").count() == 0 and pg.get_by_role("button", name=re.compile("CSV")).count(): break
        pg.wait_for_timeout(500)
    step("advanced bulk check", search_posts=len(searches()) - nb, bodies=[c["body"] for c in searches()[nb:]][:3])
    with pg.expect_download() as dl:
        pg.get_by_role("button", name=re.compile("CSV")).click()
    path = f"{OUT}/domainhunter-bulk.csv"; dl.value.save_as(path)
    csv = open(path, encoding="utf-8-sig").read()
    step("csv export", filename=dl.value.suggested_filename, header=csv.splitlines()[0], has_expires_at="expires_at" in csv.splitlines()[0], rows=len(csv.splitlines()) - 1)
    pg.screenshot(path=f"{OUT}/02_advanced_bulk.png", full_page=True)
    # advanced 结果也星标一个（保证 shortlist 有 ≥2 项用于排序）
    fa = pg.get_by_role("button", name="收藏到候选清单")
    if fa.count() >= 2: fa.nth(1).click(); pg.wait_for_timeout(200)
    if fa.count() >= 1: fa.first.click(); pg.wait_for_timeout(200)

    # ---------- 5.3 shortlist ----------
    pg.goto(BASE + "/shortlist", wait_until="networkidle")
    items = pg.evaluate("() => JSON.parse(localStorage.getItem('domainhunter:shortlist') || '[]')")
    step("shortlist items", count=len(items) if isinstance(items, list) else items, domains=[i.get("domain") for i in items][:6] if isinstance(items, list) else None)
    # 备注
    ne = pg.get_by_title("编辑备注")
    if ne.count():
        ne.first.click(); ta2 = pg.get_by_placeholder("备注（仅存本机，不随分享外发）").first; ta2.fill("r551 note"); ta2.press("Enter"); pg.wait_for_timeout(300)
    notes = pg.evaluate("() => Object.entries(localStorage).filter(([k]) => /note/i.test(k)).map(([k, v]) => [k, v.slice(0, 120)])")
    step("shortlist note", edit_buttons=ne.count(), note_storage=notes, visible=pg.get_by_text("r551 note").count())
    # 排序
    order = {}
    for lab in ["首年价", "到期日", "域名", "添加时间"]:
        sb = pg.get_by_role("button", name=lab).first
        if sb.count():
            sb.click(); pg.wait_for_timeout(200)
            order[lab] = pg.locator("table tbody tr td:first-child").all_inner_texts()[:5]
    step("shortlist sort", order=order)
    # 同步码推送 + 导入回读
    ns = len(R["api_calls"])
    pg.get_by_role("button", name="同步到其他设备").click(); pg.wait_for_timeout(2500)
    code_txt = pg.locator("text=/^[A-Z0-9]{8}$/").first
    code = code_txt.inner_text() if code_txt.count() else None
    sync_calls = [c for c in R["api_calls"][ns:] if "/api/sync" in c["url"]]
    imp = None
    if code:
        r = ctx.request.get(f"{BASE}/api/sync/{code}"); imp = {"status": r.status, "items": len(r.json().get("items", [])) if r.ok else None}
        pg.get_by_label("要导入的同步码").fill(code); pg.get_by_role("button", name="导入").click(); pg.wait_for_timeout(2000)
        imp["ui_msg"] = pg.get_by_text(re.compile("已导入|同步码")).first.inner_text() if pg.get_by_text(re.compile("已导入|同步码不存在")).count() else None
    step("sync push + import", code_masked=(code[:2] + "******") if code else None, sync_calls=[c["m"] + " " + c["url"] for c in sync_calls], readback=imp, note="sync:<code> KV 记录无删除端点（TTL 90 天），无法清理")
    # 分享创建 → 撤销 → 410
    nsh = len(R["api_calls"])
    pg.get_by_role("button", name="生成分享链接").click(); pg.wait_for_timeout(3000)
    shares = pg.evaluate("() => JSON.parse(localStorage.getItem('domainhunter:my-shares') || localStorage.getItem('domainhunter:myShares') || '[]')")
    if not shares:
        shares = pg.evaluate("() => { for (const k of Object.keys(localStorage)) { if (/share/i.test(k)) { try { const v = JSON.parse(localStorage[k]); if (Array.isArray(v)) return v; } catch {} } } return []; }")
    sid = shares[0]["id"] if shares else None
    live = ctx.request.get(f"{BASE}/s/{sid}") if sid else None
    live_api = ctx.request.get(f"{BASE}/api/share/{sid}") if sid else None
    step("share create", id=sid, share_calls=[c["m"] + " " + c["url"] for c in R["api_calls"][nsh:] if "/api/share" in c["url"]], page_status=live.status if live else None, api_status=live_api.status if live_api else None, ssr_title=re.search(r"<title>(.*?)</title>", live.text()).group(1) if live else None)
    pg.screenshot(path=f"{OUT}/03_shortlist_share_sync.png", full_page=True)
    # 撤销：我的分享链接 → 删除 → 确认删除
    dele = pg.get_by_role("button", name=re.compile("^删除"))
    if dele.count():
        dele.first.click(); pg.wait_for_timeout(200); pg.get_by_role("button", name=re.compile("确认删除")).first.click(); pg.wait_for_timeout(2500)
    gone = ctx.request.get(f"{BASE}/s/{sid}") if sid else None
    gone_api = ctx.request.get(f"{BASE}/api/share/{sid}") if sid else None
    step("share revoke", delete_calls=[c["m"] + " " + c["url"] for c in R["api_calls"] if c["m"] == "DELETE"], page_status=gone.status if gone else None, api_status=gone_api.status if gone_api else None, ssr_title=re.search(r"<title>(.*?)</title>", gone.text()).group(1) if gone else None, robots_noindex=('name="robots" content="noindex"' in gone.text()) if gone else None)
    # 监控开启（shortlist 表格 Switch）
    nm = len(R["api_calls"])
    sw = pg.get_by_role("switch").first
    sw.click(); pg.wait_for_timeout(2500)
    mon_calls = [c for c in R["api_calls"][nm:] if "/api/monitor" in c["url"]]
    mon_domain = None
    for c in mon_calls:
        try: mon_domain = json.loads(c["body"]).get("domain") or mon_domain
        except Exception: pass
    lst = ctx.request.post(f"{BASE}/api/monitor/list", data=json.dumps({"domains": [mon_domain] if mon_domain else []}), headers={"content-type": "application/json"})
    step("monitor add", switch_checked=sw.get_attribute("aria-checked"), calls=[c["m"] + " " + c["url"] + " " + c["body"] for c in mon_calls], list_status=lst.status, list_body=lst.text()[:300])
    # ---------- 5.4 monitors 页取消 ----------
    pg.goto(BASE + "/monitors", wait_until="networkidle"); pg.wait_for_timeout(1500)
    pg.screenshot(path=f"{OUT}/04_monitors_before_cancel.png", full_page=True)
    nc = len(R["api_calls"])
    cb = pg.get_by_role("button", name=re.compile("取消监控"))
    cnt = cb.count()
    if cnt:
        cb.first.click(); pg.wait_for_timeout(300); pg.get_by_role("button", name=re.compile("确认取消")).first.click(); pg.wait_for_timeout(2500)
    lst2 = ctx.request.post(f"{BASE}/api/monitor/list", data=json.dumps({"domains": [mon_domain] if mon_domain else []}), headers={"content-type": "application/json"})
    step("monitor cancel", cancel_buttons=cnt, calls=[c["m"] + " " + c["url"] + " " + c["body"] for c in R["api_calls"][nc:] if "/api/monitor" in c["url"]], list_after=lst2.text()[:300], remaining_cancel_buttons=pg.get_by_role("button", name=re.compile("取消监控")).count())
    pg.screenshot(path=f"{OUT}/05_monitors_after_cancel.png", full_page=True)
    # ---------- 清理核对 ----------
    R["cleanup"] = {"share_status": gone.status if gone else None, "monitor_list_after": lst2.text()[:300], "sync_code_left": bool(code)}
    R["storage_final_keys"] = pg.evaluate("() => Object.keys(localStorage)")
    b.close()
json.dump(R, open(f"{OUT}/functional_regression.json", "w"), ensure_ascii=False, indent=1)
print("AI calls:", R["ai_calls"]); print("console errors:", R["console_errors"][:5])
