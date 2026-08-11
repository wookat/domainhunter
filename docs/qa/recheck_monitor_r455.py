"""R455 复核：monitor（监控释放）流程 —— 需已注册域名行才出现 watch CTA。

用法：python3 recheck_monitor_r455.py findings-r455-monitor.json
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
    findings = {}
    with sync_playwright() as p:
        b = p.chromium.connect_over_cdp("http://localhost:29229")
        ctx = b.contexts[0]
        page = ctx.new_page()
        page.goto(f"{BASE}/?cb={cb}", wait_until="networkidle")
        page.get_by_role("button", name=RE_EXACT).first.click(); time.sleep(0.3)
        inp = page.locator("main textarea, main input[type=text]").first
        inp.fill("google"); inp.press("Enter")
        for _ in range(90):
            if page.evaluate(DONE_JS):
                break
            time.sleep(1)
        findings["done"] = page.evaluate(DONE_JS)
        # 找 watch CTA（监控释放）
        findings["watch_click"] = page.evaluate("""() => {
          const b = [...document.querySelectorAll('main button')].find(x =>
            /监控释放|Watch drop|一键加入清单并开启监控/.test((x.getAttribute('aria-label')||'')+(x.getAttribute('title')||'')+(x.textContent||'')));
          if (!b) return {found:false};
          const r = b.getBoundingClientRect();
          if (r.width < 4 || r.height < 4) return {found:true, visible:false};
          b.click();
          return {found:true, visible:true, label:(b.getAttribute('aria-label')||'').slice(0,60)};
        }""")
        time.sleep(3)
        findings["ls_monitor"] = page.evaluate("() => localStorage.getItem('domainhunter:monitor')")
        findings["watching_visible"] = page.evaluate(
            "() => [...document.querySelectorAll('main button')].some(x => /监控中|Watching/.test(x.textContent||''))")
        page.screenshot(path="screenshots-r455/S6-monitor-watch.png")
        # /monitors 页应显示该域名
        page.goto(f"{BASE}/monitors?cb={cb}m", wait_until="networkidle"); time.sleep(1.5)
        findings["monitors_page_text"] = page.evaluate("() => document.querySelector('main')?.innerText.slice(0,500)")
        page.screenshot(path="screenshots-r455/S7-monitors-page.png")
        # 取消监控（双击确认流程）
        findings["stop"] = page.evaluate("""() => {
          const b = [...document.querySelectorAll('main button')].find(x => /监控中|Watching|取消/.test(x.textContent||''));
          if (!b) return {found:false};
          b.click();
          return {found:true};
        }""")
        time.sleep(1)
        page.evaluate("""() => {
          const b = [...document.querySelectorAll('main button')].find(x => /确认|Confirm|取消监控/.test((x.textContent||'')+(x.getAttribute('aria-label')||'')));
          if (b) b.click();
        }""")
        time.sleep(2)
        findings["ls_monitor_after_stop"] = page.evaluate("() => localStorage.getItem('domainhunter:monitor')")
        page.close()
    json.dump(findings, open(out, "w"), ensure_ascii=False, indent=2)
    print(json.dumps(findings, ensure_ascii=False, indent=1)[:5000])


if __name__ == "__main__":
    main(sys.argv[1])
