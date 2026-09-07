import json
from playwright.sync_api import sync_playwright
CHROME = open("/home/ubuntu/r551/tools/chrome_path").read().strip()
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140 Safari/537.36 r551-audit"
JS = """() => {
  const p = document.querySelector('#verdict p');
  const out = {pw: Math.round(p.getBoundingClientRect().width), psw: p.scrollWidth, overflowChars: []};
  const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
  let node; const r = document.createRange();
  while ((node = walker.nextNode())) {
    for (let i = 0; i < node.length; i++) {
      r.setStart(node, i); r.setEnd(node, i + 1);
      const b = r.getBoundingClientRect();
      if (b.right > 360) out.overflowChars.push({ch: node.data[i], right: Math.round(b.right), top: Math.round(b.top)});
    }
  }
  const lines = {}; for (const c of out.overflowChars) { lines[c.top] = (lines[c.top] || '') + c.ch; }
  out.lines = lines;
  // also find the whole line text for these tops
  return out;
}"""
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME, headless=True, args=["--no-sandbox"])
    ctx = b.new_context(user_agent=UA, viewport={"width": 375, "height": 812}, device_scale_factor=2, is_mobile=True, has_touch=True, locale="zh-CN")
    pg = ctx.new_page(); pg.goto("https://hunt.zalize.com/vs/clinic-vs-care", wait_until="networkidle")
    r = pg.evaluate(JS); print(json.dumps({k: r[k] for k in r if k != 'overflowChars'}, ensure_ascii=False))
    pg.evaluate("() => document.querySelector('#verdict').scrollIntoView()")
    pg.screenshot(path="/home/ubuntu/r551/shots/followup_375_vs_clinic-vs-care_zh_verdict_overflow.png")
    pg.emulate_media(color_scheme="dark"); pg.evaluate("() => document.documentElement.classList.add('dark')")
    pg.screenshot(path="/home/ubuntu/r551/shots/followup_375_vs_clinic-vs-care_zh_verdict_overflow_dark.png")
    b.close()
