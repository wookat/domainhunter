"""R443 复核：/guide/coffee 与 /vs/com-vs-cn 相关互链 SSR（原始 HTML）与水合后 DOM 集合一致性。
（audit_browser_r443.py 首测中该两页 domcontentloaded 时刻快照为 null，属采样竞态，此处用原始 SSR HTML 对照。）"""
import json, re, time, urllib.request
from playwright.sync_api import sync_playwright

BASE = "https://hunt.zalize.com"
UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/126 Safari/537.36"}
HEADINGS = {"guide": ["相关后缀对比", "相关行业指南"], "vs": ["相关行业命名指南", "相关对比"]}
SECTION_JS = """(headings) => {
  const out = {};
  for (const h of headings) {
    const h2 = [...document.querySelectorAll('main h2')].find(e => e.textContent.trim() === h);
    out[h] = h2 ? [...h2.parentElement.querySelectorAll('a')].map(a => a.getAttribute('href').split('?')[0]) : null;
  }
  return out;
}"""

def ssr_sections(path, headings):
    html = urllib.request.urlopen(urllib.request.Request(BASE + path, headers=UA), timeout=60).read().decode()
    out = {}
    for h in headings:
        m = re.search(r'<h2 class="text-sm font-semibold text-txt1">' + re.escape(h) + r'</h2><div[^>]*>(.*?)</div>', html, re.S)
        out[h] = [u.split("?")[0] for u in re.findall(r'<a href="([^"]+)"', m.group(1))] if m else None
    return out

res = {}
with sync_playwright() as p:
    b = p.chromium.connect_over_cdp("http://localhost:29229")
    page = b.contexts[0].new_page()
    for kind, path in (("guide", "/guide/coffee"), ("vs", "/vs/com-vs-cn")):
        ssr = ssr_sections(path, HEADINGS[kind])
        page.goto(BASE + path + f"?cb=re{int(time.time())}", wait_until="networkidle"); time.sleep(1.5)
        hyd = page.evaluate(SECTION_JS, HEADINGS[kind])
        res[path] = {h: {"ssr": ssr[h], "hydrated": hyd[h], "equal": ssr[h] == hyd[h]} for h in HEADINGS[kind]}
    page.close()
res["all_equal"] = all(v["equal"] for secs in (res["/guide/coffee"], res["/vs/com-vs-cn"]) for v in secs.values())
json.dump(res, open("findings-r443-related-recheck.json", "w"), ensure_ascii=False, indent=2)
print(json.dumps(res, ensure_ascii=False, indent=1))
