"""375px 真溢出根因定位：找出 right>375 且父元素未溢出的「最外层溢出元素」，输出标签/class/文本片段/宽度。零 AI。"""
import json, sys
from playwright.sync_api import sync_playwright
CHROME = open("/home/ubuntu/r551/tools/chrome_path").read().strip()
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140 Safari/537.36 r551-audit"
BASE = "https://hunt.zalize.com"
paths = sys.argv[1:] or ["/vs/clinic-vs-care", "/tld/nz", "/tld/sa", "/vs/technology-vs-tech", "/vs/info-vs-net"]
JS = """() => {
  const vw = 375; const out = [];
  const all = Array.from(document.querySelectorAll('body *'));
  for (const e of all) {
    const r = e.getBoundingClientRect();
    if (r.right <= vw + 1 || r.width === 0) continue;
    const pr = e.parentElement ? e.parentElement.getBoundingClientRect() : null;
    const parentOver = pr && pr.right > vw + 1;
    const cs = getComputedStyle(e);
    out.push({ tag: e.tagName.toLowerCase(), cls: (e.className||'').toString().slice(0,90), right: Math.round(r.right), width: Math.round(r.width), parentOver, ws: cs.whiteSpace, ow: cs.overflowWrap, wb: cs.wordBreak, text: (e.innerText||'').replace(/\\s+/g,' ').slice(0,140), depth: (function(n){let d=0;while(n.parentElement){n=n.parentElement;d++;}return d;})(e) });
  }
  out.sort((a,b)=>a.depth-b.depth);
  const roots = out.filter(o => !o.parentOver);
  return { total_over: out.length, roots: roots.slice(0, 8), deepest_text: out.filter(o => o.tag !== 'div' && o.tag !== 'section' && o.tag !== 'main').slice(-6) };
}"""
res = {}
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME, headless=True, args=["--no-sandbox"])
    for path in paths:
        ctx = b.new_context(user_agent=UA, viewport={"width": 375, "height": 812}, locale="zh-CN", device_scale_factor=2)
        pg = ctx.new_page(); pg.goto(BASE + path, wait_until="networkidle"); pg.wait_for_timeout(1000)
        m = pg.evaluate("() => ({innerWidth: innerWidth, scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, bodyScrollWidth: document.body.scrollWidth})")
        d = pg.evaluate(JS); d["metrics"] = m; res[path] = d
        print("\n##", path, m, "over-elements:", d["total_over"])
        for r in d["roots"]: print("  ROOT", r["tag"], r["cls"][:60], "right", r["right"], "w", r["width"], r["ws"], r["ow"], r["wb"], "|", r["text"][:100])
        for r in d["deepest_text"][-3:]: print("  LEAF", r["tag"], r["cls"][:50], "right", r["right"], "|", r["text"][:120])
        ctx.close()
    b.close()
json.dump(res, open("/home/ubuntu/r551/browser/overflow_rootcause_375.json", "w"), ensure_ascii=False, indent=1)
