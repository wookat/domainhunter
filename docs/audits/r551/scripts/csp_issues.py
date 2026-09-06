"""复现 Lighthouse inspector-issues 中的 CSP issue：CDP Audits.issueAdded 捕获全量细节 + /api/csp-report POST 监听。零 AI。"""
import json
from playwright.sync_api import sync_playwright
CHROME = open("/home/ubuntu/r551/tools/chrome_path").read().strip()
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140 Safari/537.36 r551-audit"
BASE = "https://hunt.zalize.com"
out = {}
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME, headless=True, args=["--no-sandbox"])
    for path in ["/mcp", "/prices", "/", "/vs/uk-vs-com", "/shortlist"]:
        ctx = b.new_context(user_agent=UA, viewport={"width": 1280, "height": 900}, locale="zh-CN")
        issues, reports, spv = [], [], []
        ctx.on("request", lambda r: reports.append({"url": r.url, "body": (r.post_data or "")[:500]}) if "/api/csp-report" in r.url else None)
        pg = ctx.new_page()
        pg.add_init_script("window.__spv=[];document.addEventListener('securitypolicyviolation',e=>window.__spv.push({d:e.violatedDirective,b:e.blockedURI,disp:e.disposition,src:e.sourceFile,line:e.lineNumber,sample:e.sample}));")
        cdp = ctx.new_cdp_session(pg)
        cdp.on("Audits.issueAdded", lambda ev: issues.append(ev["issue"]))
        cdp.send("Audits.enable")
        pg.goto(BASE + path, wait_until="networkidle"); pg.wait_for_timeout(2500)
        spv = pg.evaluate("() => window.__spv")
        csp = [i for i in issues if i["code"] == "ContentSecurityPolicyIssue"]
        out[path] = {"issues_total": len(issues), "issue_codes": sorted({i["code"] for i in issues}),
                     "csp_issues": [i["details"]["contentSecurityPolicyIssueDetails"] for i in csp][:12],
                     "csp_report_posts": reports, "securitypolicyviolation_events": spv}
        print(path, "issues:", len(issues), out[path]["issue_codes"], "csp:", len(csp), "reports:", len(reports), "spv:", len(spv))
        for i in out[path]["csp_issues"][:4]: print("   ", json.dumps(i, ensure_ascii=False)[:400])
        ctx.close()
    b.close()
json.dump(out, open("/home/ubuntu/r551/security/csp_issues_cdp.json", "w"), ensure_ascii=False, indent=1)
