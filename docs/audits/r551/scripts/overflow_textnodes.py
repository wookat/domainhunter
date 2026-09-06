"""375px 溢出根因：用 Range 测文本节点实际渲染右边界（元素盒不含溢出的文字）。零 AI。"""
import json, sys
from playwright.sync_api import sync_playwright
CHROME = open("/home/ubuntu/r551/tools/chrome_path").read().strip()
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140 Safari/537.36 r551-audit"
BASE = "https://hunt.zalize.com"
paths = sys.argv[1:] or ["/tld/nz", "/tld/sa", "/vs/clinic-vs-care", "/vs/technology-vs-tech"]
JS = """() => {
  const vw = 375; const out = [];
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n; while ((n = w.nextNode())) {
    if (!n.nodeValue.trim()) continue;
    const r = document.createRange(); r.selectNodeContents(n);
    const rects = Array.from(r.getClientRects());
    const over = rects.filter(x => x.right > vw + 1);
    if (!over.length) continue;
    const el = n.parentElement; const cs = getComputedStyle(el);
    const scroller = el.closest('[class*="overflow-x-auto"], pre, code');
    out.push({ tag: el.tagName.toLowerCase(), cls: (el.className||'').toString().slice(0,80), maxRight: Math.round(Math.max(...over.map(x=>x.right))), inScroller: !!scroller, ws: cs.whiteSpace, ow: cs.overflowWrap, wb: cs.wordBreak, text: n.nodeValue.replace(/\\s+/g,' ').slice(0,160) });
  }
  out.sort((a,b)=>b.maxRight-a.maxRight); return out.slice(0, 8);
}"""
res = {}
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME, headless=True, args=["--no-sandbox"])
    for path in paths:
        ctx = b.new_context(user_agent=UA, viewport={"width": 375, "height": 812}, locale="zh-CN", device_scale_factor=2)
        pg = ctx.new_page(); pg.goto(BASE + path, wait_until="networkidle"); pg.wait_for_timeout(800)
        m = pg.evaluate("() => ({scrollWidth: document.documentElement.scrollWidth, bodyScrollWidth: document.body.scrollWidth})")
        d = pg.evaluate(JS); res[path] = {"metrics": m, "text_overflows": d}
        print("\n##", path, m)
        for r in d: print("  ", r["tag"], r["cls"][:50], "right", r["maxRight"], "scroller" if r["inScroller"] else "DOC", r["ws"], r["ow"], "|", r["text"][:130])
        # 截图证据（首个非 scroller 溢出文本）
        ctx.close()
    b.close()
json.dump(res, open("/home/ubuntu/r551/browser/overflow_textnodes_375.json", "w"), ensure_ascii=False, indent=1)
