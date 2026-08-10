"""R431 零 AI 全站审计——HTTP 侧检查（纯只读 GET/POST /mcp，不触碰 AI 路径）。

覆盖：
1. R427 回归面：各类 SSR 页（首页 /tld /guide /vs /prices /why 三 hub + 各类型内容页抽样）
   zh/en 两版的三链 alternate（zh=裸路径、en=?lang=en、x-default=裸路径）与 canonical 一致性；
   sitemap xhtml:link 抽样核对；
2. 全量内容页（tld 360 + guide 356 + vs 396，zh）__DH_CONTENT__ 注入完整性，en 抽样；
3. sitemap/llms.txt 计数自洽（口径 1120）、robots；
4. 404 行为、/api/prices、MCP 三工具（JSON-RPC）。

用法：python3 audit_http_r431.py findings-r431-http.json
"""
import json
import random
import re
import sys
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor

BASE = "https://hunt.zalize.com"
UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"}
findings = {}

RE_INJECT = re.compile(r"<script>window\.__DH_CONTENT__=(.*?)</script>", re.S)


def fetch(path, data=None, headers=None):
    req = urllib.request.Request(BASE + path, headers={**UA, **(headers or {})}, data=data)
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return r.status, r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "replace")


def hreflang_probe(path):
    """R427：zh/en 双版三链 alternate + canonical 一致性。"""
    bare = BASE + path
    en = bare + ("&lang=en" if "?" in path else "?lang=en")
    out = {}
    for label, url_path, want_canonical in (("zh", path, bare), ("en", path + ("&lang=en" if "?" in path else "?lang=en"), en)):
        st, html = fetch(url_path)
        alts = dict(re.findall(r'<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"', html))
        canonical = (re.search(r'<link rel="canonical" href="([^"]+)"', html) or [None, None])[1]
        out[label] = {
            "status": st,
            "canonical": canonical,
            "canonical_ok": canonical == want_canonical,
            "alt_zh_ok": alts.get("zh") == bare,
            "alt_en_ok": alts.get("en") == en,
            "alt_xdefault_ok": alts.get("x-default") == bare,
            "alt_count": len(alts),
        }
    out["pass"] = all(all(v for k, v in out[l].items() if k.endswith("_ok")) and out[l]["alt_count"] == 3 and out[l]["status"] == 200 for l in ("zh", "en"))
    return out


def seo_probe(html):
    return {
        "title": (re.search(r"<title>(.*?)</title>", html, re.S) or [None, None])[1],
        "canonical": (re.search(r'<link rel="canonical" href="([^"]+)"', html) or [None, None])[1],
        "html_lang": (re.search(r'<html[^>]*lang="([^"]+)"', html) or [None, None])[1],
        "og_count": len(re.findall(r'<meta property="og:', html)),
        "has_faq_jsonld": '"FAQPage"' in html,
        "has_breadcrumb_jsonld": '"BreadcrumbList"' in html,
        "hreflang_count": len(re.findall(r'hreflang="', html)),
    }


def parse_injected(html):
    m = RE_INJECT.search(html)
    if not m:
        return None, "missing"
    try:
        return json.loads(m.group(1).replace("\\u003c", "<")), None
    except Exception as e:
        return None, f"json_error: {e}"


def check_content_page(kind, slug):
    st, html = fetch(f"/{kind}/{slug}")
    row = {"status": st}
    data, err = parse_injected(html)
    if err:
        row["inject"] = err
        return slug, row
    key = data.get("tld") if kind == "tld" else data.get("slug")
    ok = data.get("kind") == kind and key == slug
    row["inject"] = "ok" if ok else "shape_mismatch"
    row["ssr_skeleton"] = 'id="root"' in html and len(html) > 20000
    return slug, row


def main(out):
    counts = json.load(open("../../scripts/content-counts.json"))
    expected = {k: list(counts[k]["slugs"]) for k in ("tld", "guide", "vs")}
    cb = int(time.time())
    rnd = random.Random(431)

    # ---- R427：hreflang 三链抽样（核心页 + 各类型内容页 first/mid/last） ----
    pages = ["/", "/tld", "/guide", "/vs", "/prices", "/why", "/advanced", "/mcp"]
    for kind, slugs in expected.items():
        for s in (slugs[0], slugs[len(slugs) // 2], slugs[-1], rnd.choice(slugs)):
            pages.append(f"/{kind}/{s}")
    findings["hreflang_r427"] = {p: hreflang_probe(p) for p in dict.fromkeys(pages)}
    findings["hreflang_r427_all_pass"] = all(v["pass"] for v in findings["hreflang_r427"].values())

    # ---- sitemap x3 / xhtml:link 抽样 / llms / robots ----
    sitemap_samples, cat = [], {"tld": set(), "guide": set(), "vs": set(), "core": set()}
    for i in range(3):
        _, xml = fetch(f"/sitemap.xml?cb=r431{i}{cb}")
        locs = re.findall(r"<loc>(.*?)</loc>", xml)
        sitemap_samples.append(len(locs))
        time.sleep(1)
    findings["sitemap_loc_samples"] = sitemap_samples
    findings["sitemap_dup_locs"] = len(locs) - len(set(locs))
    for u in set(locs):
        m = re.match(r"https://hunt\.zalize\.com/(tld|guide|vs)/([^/?]+)$", u)
        (cat[m.group(1)].add(m.group(2)) if m else cat["core"].add(u))
    findings["sitemap_cat_counts"] = {k: len(v) for k, v in cat.items()}
    findings["sitemap_vs_counts_json"] = {k: cat[k] == set(expected[k]) for k in ("tld", "guide", "vs")}
    # xhtml:link：每个 <url> 应带 zh+en 两条 alternate，且 href 规则与页面一致
    url_blocks = re.findall(r"<url>(.*?)</url>", xml, re.S)
    xhtml_bad = []
    for blk in url_blocks:
        loc = re.search(r"<loc>(.*?)</loc>", blk).group(1)
        alts = dict(re.findall(r'<xhtml:link rel="alternate" hreflang="([^"]+)" href="([^"]+)"', blk))
        if not (alts.get("zh") == loc and alts.get("en") == loc + ("&lang=en" if "?" in loc else "?lang=en")):
            xhtml_bad.append({"loc": loc, "alts": alts})
    findings["sitemap_xhtml"] = {"urls": len(url_blocks), "xhtml_total": len(re.findall(r"<xhtml:link", xml)), "bad": xhtml_bad[:10], "bad_count": len(xhtml_bad)}
    _, llms = fetch("/llms.txt")
    lt = {k: set(re.findall(rf"/{k}/([a-z0-9-]+)", llms)) for k in ("tld", "guide", "vs")}
    findings["llms_counts"] = {k: len(v) for k, v in lt.items()}
    findings["llms_vs_sitemap_equal"] = {k: lt[k] == cat[k] for k in ("tld", "guide", "vs")}
    rs, robots = fetch("/robots.txt")
    findings["robots"] = {"status": rs, "has_sitemap": "sitemap.xml" in robots, "gptbot": "GPTBot" in robots}

    # ---- 全量注入完整性扫描（1112 页，zh） ----
    inject_bad = {}
    inject_ok = 0
    with ThreadPoolExecutor(max_workers=12) as ex:
        for kind in ("tld", "guide", "vs"):
            for slug, row in ex.map(lambda s, k=kind: check_content_page(k, s), expected[kind]):
                if row["status"] == 200 and row["inject"] == "ok" and row["ssr_skeleton"]:
                    inject_ok += 1
                else:
                    inject_bad[f"/{kind}/{slug}"] = row
    findings["inject_sweep"] = {"total": sum(len(v) for v in expected.values()), "ok": inject_ok, "bad": inject_bad}

    # ---- en 注入抽样 ----
    en_sample = {}
    for kind, slugs in expected.items():
        for slug in {slugs[0], slugs[-1], slugs[len(slugs) // 2]}:
            st, html = fetch(f"/{kind}/{slug}?lang=en")
            data, err = parse_injected(html)
            key = (data or {}).get("tld") if kind == "tld" else (data or {}).get("slug")
            en_sample[f"/{kind}/{slug}?lang=en"] = {"status": st, "inject": err or ("ok" if key == slug else "key_mismatch")}
    findings["inject_en_sample"] = en_sample

    # ---- SSR meta 深抽 ----
    deep_pages = []
    for kind, slugs in expected.items():
        deep_pages += [f"/{kind}/{slugs[0]}", f"/{kind}/{slugs[-1]}"]
    deep_pages += ["/", "/prices", "/tld", "/guide", "/vs", "/why"]
    seo = {}
    for p in dict.fromkeys(deep_pages):
        for q in ("", "?lang=en"):
            st, html = fetch(p + q)
            seo[p + q] = {"status": st, **seo_probe(html)}
    findings["seo_deep"] = seo

    # ---- 404 ----
    findings["notfound"] = {p: fetch(p)[0] for p in ("/nonexistent-r431", "/tld/notatld-r431", "/guide/notaguide-r431", "/vs/nota-vs-r431")}

    # ---- /api/prices ----
    st, body = fetch("/api/prices")
    j = json.loads(body)
    findings["prices_api"] = {"status": st, "stale": j.get("stale"), "tldCount": j.get("tldCount"), "priceKeys": len(j.get("prices") or {})}

    # ---- MCP 三工具 ----
    def mcp(payload):
        st, body = fetch("/mcp", data=json.dumps(payload).encode(), headers={"Content-Type": "application/json"})
        return st, json.loads(body)

    _, tl = mcp({"jsonrpc": "2.0", "id": 1, "method": "tools/list"})
    findings["mcp_tools"] = [t["name"] for t in tl["result"]["tools"]]
    _, cd = mcp({"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": "check_domains", "arguments": {"domains": [f"qzxvkw9r431mcp{cb}.com", "google.com"]}}})
    c = json.loads(cd["result"]["content"][0]["text"])
    findings["mcp_check_domains"] = [{"domain": x["domain"], "status": x["status"], "expiresAt": x.get("expiresAt")} for x in c["results"]]
    _, tp = mcp({"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "tld_prices", "arguments": {}}})
    c = json.loads(tp["result"]["content"][0]["text"])
    findings["mcp_tld_prices"] = {"tldCount": c.get("tldCount"), "priceKeys": len(c.get("prices") or {})}
    _, sv = mcp({"jsonrpc": "2.0", "id": 4, "method": "tools/call", "params": {"name": "suggest_variants", "arguments": {"name": "qzxvkw9r431"}}})
    c = json.loads(sv["result"]["content"][0]["text"])
    findings["mcp_suggest_variants"] = {"variants": len(c.get("variants") or c.get("results") or [])}

    json.dump(findings, open(out, "w"), ensure_ascii=False, indent=2)
    slim = {k: v for k, v in findings.items() if k not in ("seo_deep", "hreflang_r427")}
    slim["hreflang_fail"] = {p: v for p, v in findings["hreflang_r427"].items() if not v["pass"]}
    print(json.dumps(slim, ensure_ascii=False, indent=1)[:9000])


if __name__ == "__main__":
    main(sys.argv[1])
