"""补测 shortlist 备注（加备注 → 输入 → Enter → 持久化 → 刷新仍在；分享快照不含 note）。独立无痕上下文，零 AI。"""
import json, re, time
from playwright.sync_api import sync_playwright
CHROME = open("/home/ubuntu/r551/tools/chrome_path").read().strip()
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140 Safari/537.36 r551-audit"
BASE = "https://hunt.zalize.com"; R = {"ai_calls": [], "api": []}
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME, headless=True, args=["--no-sandbox"])
    ctx = b.new_context(user_agent=UA, viewport={"width": 1280, "height": 900}, locale="zh-CN")
    ctx.on("request", lambda r: (R["ai_calls"].append(r.url) if "/api/ai-search" in r.url else None, R["api"].append(r.method + " " + r.url.replace(BASE, "") + " " + (r.post_data or "")[:200]) if "/api/" in r.url else None))
    pg = ctx.new_page(); pg.goto(BASE + "/", wait_until="networkidle")
    pg.get_by_role("button", name="精确核验").first.click(); pg.locator("#home-description").fill("r551zeroaiaudit"); pg.wait_for_timeout(6000)
    pg.get_by_role("button", name="收藏到候选清单").first.click(); pg.wait_for_timeout(300)
    pg.goto(BASE + "/shortlist", wait_until="networkidle")
    add = pg.get_by_role("button", name="加备注").first; add.click()
    inp = pg.get_by_placeholder("备注（仅存本机，不随分享外发）").first; inp.fill("r551 note 备注"); inp.press("Enter"); pg.wait_for_timeout(300)
    R["visible_after_enter"] = pg.get_by_title("编辑备注").count()
    R["storage"] = pg.evaluate("() => { const v = JSON.parse(localStorage.getItem('domainhunter:shortlist')||'[]'); return v.map(i => ({domain: i.domain, note: i.note})); }")
    pg.reload(wait_until="networkidle"); R["visible_after_reload"] = pg.get_by_title("编辑备注").first.inner_text() if pg.get_by_title("编辑备注").count() else None
    # 分享快照不含 note（创建后立即撤销）
    pg.get_by_role("button", name="生成分享链接").click(); pg.wait_for_timeout(3000)
    sid = pg.evaluate("() => { for (const k of Object.keys(localStorage)) { if (/share/i.test(k)) { try { const v = JSON.parse(localStorage[k]); if (Array.isArray(v) && v[0]) return v[0].id; } catch {} } } return null; }")
    snap = ctx.request.get(f"{BASE}/api/share/{sid}").json() if sid else None
    R["share_snapshot_has_note"] = ("note" in json.dumps(snap, ensure_ascii=False)) if snap else None
    R["share_snapshot_keys"] = sorted(snap["items"][0].keys()) if snap and snap.get("items") else None
    d = pg.get_by_role("button", name=re.compile("^删除")); d.first.click(); pg.wait_for_timeout(200); pg.get_by_role("button", name=re.compile("确认删除")).first.click(); pg.wait_for_timeout(2500)
    R["share_after_revoke"] = ctx.request.get(f"{BASE}/s/{sid}").status if sid else None
    pg.screenshot(path="/home/ubuntu/r551/functional/06_shortlist_note.png", full_page=True)
    b.close()
json.dump(R, open("/home/ubuntu/r551/functional/functional_note.json", "w"), ensure_ascii=False, indent=1)
print(json.dumps({k: v for k, v in R.items() if k != "api"}, ensure_ascii=False))
