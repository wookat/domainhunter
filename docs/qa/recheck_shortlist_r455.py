"""R455 复核：shortlist / monitor 流程（非 AI：快查结果行操作）。

用法：python3 recheck_shortlist_r455.py findings-r455-shortlist.json
"""
import json
import re
import sys
import time

from playwright.sync_api import sync_playwright

BASE = "https://hunt.zalize.com"
RE_EXACT = re.compile("精确核验|Exact check")
DONE_JS = "() => { const e=[...document.querySelectorAll('main *')].find(x=>x.childElementCount===0&&/核验完成|Check complete/.test(x.textContent||'')); return e?e.textContent.trim():null; }"


def main(out):
    cb = int(time.time())
    label = f"qzxvkw9r455sl{cb % 1000}"
    findings = {}
    with sync_playwright() as p:
        b = p.chromium.connect_over_cdp("http://localhost:29229")
        ctx = b.contexts[0]
        page = ctx.new_page()
        page.goto(f"{BASE}/?cb={cb}", wait_until="networkidle")
        page.evaluate("localStorage.setItem('domainhunter:lang','zh')")
        page.reload(wait_until="networkidle"); time.sleep(1)
        page.get_by_role("button", name=RE_EXACT).first.click(); time.sleep(0.3)
        inp = page.locator("main textarea, main input[type=text]").first
        inp.fill(label); inp.press("Enter")
        for _ in range(90):
            if page.evaluate(DONE_JS):
                break
            time.sleep(1)
        # 列出结果行内全部按钮 aria-label/text
        findings["row_buttons"] = page.evaluate("""() => {
          const rows = [...document.querySelectorAll('main li, main [class*=row], main tr')];
          const btns = [...document.querySelectorAll('main button')].map(b => ({
            aria: b.getAttribute('aria-label'), text: (b.textContent||'').trim().slice(0,20), title: b.getAttribute('title')
          }));
          return btns.filter(b => b.aria || b.text || b.title).slice(0, 60);
        }""")
        # 点击第一个「加入清单/候选/星标/收藏」类按钮
        findings["add"] = page.evaluate("""() => {
          const btns = [...document.querySelectorAll('main button')];
          const cand = btns.filter(b => /候选|清单|收藏|加入|star|shortlist|save/i.test((b.getAttribute('aria-label')||'')+(b.getAttribute('title')||'')+(b.textContent||'')));
          if (!cand.length) return {found:false};
          cand[0].click();
          return {found:true, label:(cand[0].getAttribute('aria-label')||cand[0].textContent||'').trim().slice(0,40)};
        }""")
        time.sleep(1)
        findings["ls_shortlist"] = page.evaluate("() => localStorage.getItem('domainhunter:shortlist')")
        page.screenshot(path="screenshots-r455/S3-shortlist-add.png")
        # 打开候选清单面板（header 按钮）
        page.evaluate("""() => {
          const b = [...document.querySelectorAll('button')].find(x => /候选清单|Shortlist/i.test(x.textContent||''));
          if (b) b.click();
        }""")
        time.sleep(1.2)
        findings["panel_shows"] = page.evaluate(f"() => document.body.innerText.includes('{label}')")
        page.screenshot(path="screenshots-r455/S4-shortlist-panel.png")
        # 监控按钮（如面板/行内有）
        findings["monitor"] = page.evaluate("""() => {
          const cand = [...document.querySelectorAll('button')].filter(b => /监控|Monitor/i.test((b.getAttribute('aria-label')||'')+(b.textContent||'')));
          if (!cand.length) return {found:false};
          cand[0].click();
          return {found:true, label:(cand[0].getAttribute('aria-label')||cand[0].textContent||'').trim().slice(0,40)};
        }""")
        time.sleep(1.2)
        findings["ls_monitors"] = page.evaluate("() => localStorage.getItem('domainhunter:monitors')")
        findings["ls_keys"] = page.evaluate("() => Object.keys(localStorage)")
        page.screenshot(path="screenshots-r455/S5-monitor.png")
        # 清理：移除本次加入的 shortlist/monitor 项（还原由 restore_storage 兜底）
        page.close()
    json.dump(findings, open(out, "w"), ensure_ascii=False, indent=2)
    print(json.dumps(findings, ensure_ascii=False, indent=1)[:6000])


if __name__ == "__main__":
    main(sys.argv[1])
