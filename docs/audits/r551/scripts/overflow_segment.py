"""定位溢出行的确切文字：对 right>375 的行片段做字符级 Range 定位。零 AI。"""
import json, sys
from playwright.sync_api import sync_playwright
CHROME = open("/home/ubuntu/r551/tools/chrome_path").read().strip()
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140 Safari/537.36 r551-audit"
BASE = "https://hunt.zalize.com"
paths = sys.argv[1:] or ["/tld/sa", "/vs/clinic-vs-care", "/tld/nz", "/vs/technology-vs-tech"]
JS = """() => {
  const vw = 375; const out = [];
  const w = document.createTreeWalker(document.querySelector('main'), NodeFilter.SHOW_TEXT);
  let n; while ((n = w.nextNode())) {
    const s = n.nodeValue; if (!s.trim()) continue;
    if (n.parentElement.closest('[class*="overflow-x-auto"]')) continue;
    const full = document.createRange(); full.selectNodeContents(n);
    if (!Array.from(full.getClientRects()).some(x => x.right > vw + 1)) continue;
    // 逐字符找出右边界 > vw 的字符
    let chars = [];
    for (let i = 0; i < s.length; i++) {
      const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + 1);
      const rc = r.getBoundingClientRect(); if (rc.right > vw + 1 && rc.width > 0) chars.push({i, ch: s[i], right: Math.round(rc.right), top: Math.round(rc.top)});
    }
    if (!chars.length) continue;
    const lines = {}; for (const c of chars) { (lines[c.top] ||= []).push(c); }
    const segs = Object.values(lines).map(cs => { const a = cs[0].i, b = cs[cs.length-1].i; return { beyond: s.slice(a, b + 1), context: s.slice(Math.max(0, a - 40), b + 1), maxRight: Math.max(...cs.map(c=>c.right)) }; });
    out.push({ tag: n.parentElement.tagName.toLowerCase(), cls: n.parentElement.className.toString().slice(0,60), segs });
  }
  return out;
}"""
res = {}
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME, headless=True, args=["--no-sandbox"])
    for path in paths:
        ctx = b.new_context(user_agent=UA, viewport={"width": 375, "height": 812}, locale="zh-CN", device_scale_factor=2)
        pg = ctx.new_page(); pg.goto(BASE + path, wait_until="networkidle"); pg.wait_for_timeout(800)
        d = pg.evaluate(JS); res[path] = d
        print("\n##", path)
        for r in d:
            for s in r["segs"]: print("  ", r["tag"], "right", s["maxRight"], "| beyond:", repr(s["beyond"][:80]), "| ctx:", s["context"][-70:])
        ctx.close()
    b.close()
json.dump(res, open("/home/ubuntu/r551/browser/overflow_segments_375.json", "w"), ensure_ascii=False, indent=1)
