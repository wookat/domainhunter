"""One-shot probe on the recorded tab: perf timings + geometry + storage. Usage: probe.py <label>"""
import json, sys, datetime
from playwright.sync_api import sync_playwright

label = sys.argv[1] if len(sys.argv) > 1 else "probe"
with sync_playwright() as p:
    b = p.chromium.connect_over_cdp("http://localhost:29229")
    ctx = b.contexts[0]
    page = [pg for pg in ctx.pages if "hunt.zalize.com" in pg.url][-1]
    data = page.evaluate("""() => {
      const nav = performance.getEntriesByType('navigation')[0] || {};
      const paints = {}; performance.getEntriesByType('paint').forEach(e => paints[e.name] = Math.round(e.startTime));
      let lcp = null; try { const l = performance.getEntriesByType('largest-contentful-paint'); if (l.length) lcp = Math.round(l[l.length-1].startTime); } catch(e) {}
      const l = {}; for (let i=0;i<localStorage.length;i++){const k=localStorage.key(i);l[k]=localStorage.getItem(k);}
      const s = {}; for (let i=0;i<sessionStorage.length;i++){const k=sessionStorage.key(i);s[k]=sessionStorage.getItem(k);}
      return {
        url: location.href, title: document.title, lang: document.documentElement.lang,
        innerWidth: innerWidth, innerHeight: innerHeight, scrollWidth: document.documentElement.scrollWidth,
        touch: navigator.maxTouchPoints, ua: navigator.userAgent.slice(0,60),
        ttfb: Math.round(nav.responseStart||0), domContentLoaded: Math.round(nav.domContentLoadedEventEnd||0), load: Math.round(nav.loadEventEnd||0),
        paints, lcp, h1: [...document.querySelectorAll('h1')].map(h=>h.textContent.trim().slice(0,80)),
        local: l, session: Object.keys(s)
      };
    }""")
    data["at"] = datetime.datetime.utcnow().isoformat(timespec="seconds") + "Z"
    data["label"] = label
    with open("/home/ubuntu/r545/probes.jsonl", "a") as f:
        f.write(json.dumps(data, ensure_ascii=False) + "\n")
    print(json.dumps(data, ensure_ascii=False, indent=1))
