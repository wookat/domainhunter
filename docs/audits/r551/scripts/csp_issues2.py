"""CSP-RO 违规间歇复现：每路径多次加载，记录文档响应头（cf-cache-status/CSP-RO/nonce）与 SPV 事件、是否发出 csp-report。零 AI。"""
import json, re, sys
from playwright.sync_api import sync_playwright
CHROME = open("/home/ubuntu/r551/tools/chrome_path").read().strip()
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140 Safari/537.36 r551-audit"
BASE = "https://hunt.zalize.com"
paths = sys.argv[1:] or ["/vs/uk-vs-com", "/shortlist", "/mcp", "/", "/tld/de"]
rows = []
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME, headless=True, args=["--no-sandbox"])
    for path in paths:
        for i in range(3):
            ctx = b.new_context(user_agent=UA, viewport={"width": 1280, "height": 900}, locale="zh-CN")
            reports = []
            ctx.on("request", lambda r: reports.append(r.url) if "csp-report" in r.url else None)
            pg = ctx.new_page()
            pg.add_init_script("window.__spv=[];document.addEventListener('securitypolicyviolation',e=>window.__spv.push({d:e.violatedDirective,b:e.blockedURI,disp:e.disposition,policy:e.originalPolicy}));")
            resp = pg.goto(BASE + path, wait_until="networkidle"); pg.wait_for_timeout(2000)
            h = resp.headers
            spv = pg.evaluate("() => window.__spv")
            html_nonce = pg.evaluate("() => Array.from(document.scripts).map(s => s.nonce || s.getAttribute('nonce') || '')")
            hdr = h.get("content-security-policy-report-only", "")
            hn = re.search(r"nonce-([^']+)'", hdr)
            row = {"path": path, "try": i, "status": resp.status, "cf-cache-status": h.get("cf-cache-status"), "cf-ray": h.get("cf-ray"), "age": h.get("age"),
                   "csp_ro_present": bool(hdr), "csp_ro_nonce": hn.group(1)[:8] if hn else None, "csp_ro_header": hdr,
                   "script_nonces": html_nonce, "spv_count": len(spv), "spv_policy_sample": spv[0]["policy"] if spv else None,
                   "spv_blocked": sorted({s["b"] for s in spv})[:6], "csp_report_requests": reports}
            rows.append(row)
            print(json.dumps({k: row[k] for k in ("path", "try", "cf-cache-status", "csp_ro_present", "csp_ro_nonce", "script_nonces", "spv_count")}, ensure_ascii=False))
            if spv: print("   spv policy:", spv[0]["policy"][:200], "| doc policy:", hdr[:200])
            ctx.close()
    b.close()
json.dump(rows, open("/home/ubuntu/r551/security/csp_issues_repeat.json", "w"), ensure_ascii=False, indent=1)
