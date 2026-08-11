"""R455 复核：SSR/水合一致性与相关互链，语言口径对齐后重比。

首测 audit_browser_r455.py 出现两类「不等」，均为采样方法问题而非站点缺陷：
1. 浏览器 Accept-Language=en → SSR 出英文骨架；localStorage lang=zh → 水合后中文。
   属 R447 设计内行为（use-page-title.ts 注释明确）。本脚本以 zh Accept-Language
   直接抓 SSR HTML，与浏览器水合后（lang=zh）DOM 重比。
2. domcontentloaded 时刻快照过早（h1/相关 section 偶发 null）——改用原始 SSR HTML 对照。

用法：python3 recheck_ssr_r455.py findings-r455-ssr-recheck.json
"""
import json
import re
import sys
import time
import urllib.request

from playwright.sync_api import sync_playwright

BASE = "https://hunt.zalize.com"
UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36",
      "Accept-Language": "zh-CN,zh;q=0.9"}
PAGES = ["/tld/com", "/tld/ee", "/guide/saas", "/guide/jadecarving", "/vs/com-vs-cn", "/vs/kz-vs-tr"]
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


def fetch(path):
    req = urllib.request.Request(BASE + path, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode("utf-8", "replace")


def ssr_extract(html, kind):
    h1 = (re.search(r"<h1[^>]*>(.*?)</h1>", html, re.S) or [None, ""])[1]
    h1 = re.sub(r"<[^>]+>", "", h1 or "").strip() or None
    secs = {}
    for h in REL_HEADINGS[kind]:
        m = re.search(r'<h2 class="text-sm font-semibold text-txt1">' + re.escape(h) + r"</h2><div[^>]*>(.*?)</div>", html, re.S)
        secs[h] = [x.split("?")[0] for x in re.findall(r'<a href="([^"]+)"', m.group(1))] if m else None
    return h1, secs


def main(out):
    cb = int(time.time())
    findings = {}
    with sync_playwright() as p:
        b = p.chromium.connect_over_cdp("http://localhost:29229")
        ctx = b.contexts[0]
        page = ctx.new_page()
        page.evaluate_handle("() => localStorage.setItem('domainhunter:lang','zh')") if False else None
        for path in PAGES:
            kind = path.split("/")[1]
            html = fetch(f"{path}?cb={cb}rc")
            ssr_h1, ssr_secs = ssr_extract(html, kind)
            page.goto(f"{BASE}{path}?cb={cb}rc2", wait_until="networkidle")
            page.evaluate("localStorage.setItem('domainhunter:lang','zh')")
            page.reload(wait_until="networkidle")
            time.sleep(1.5)
            hyd_h1 = page.evaluate("() => document.querySelector('main h1')?.textContent.trim() || null")
            hyd_secs = page.evaluate(SECTION_JS, REL_HEADINGS[kind])
            findings[path] = {
                "ssr_h1": ssr_h1, "hyd_h1": hyd_h1, "h1_equal": ssr_h1 == hyd_h1,
                "sections_equal": ssr_secs == hyd_secs,
                "ssr_secs_counts": {k: v and len(v) for k, v in ssr_secs.items()},
                "hyd_secs_counts": {k: v and len(v) for k, v in hyd_secs.items()},
            }
        page.close()
    findings["all_equal"] = all(v["h1_equal"] and v["sections_equal"] for k, v in findings.items() if k.startswith("/"))
    json.dump(findings, open(out, "w"), ensure_ascii=False, indent=2)
    print(json.dumps(findings, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main(sys.argv[1])
