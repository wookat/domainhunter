"""R455 零 AI 全站审计——HTTP 侧检查（纯只读 GET/POST /mcp，不触碰 AI 路径）。

覆盖（重点 R444–R451 回归面）：
1. R451 modulepreload 收敛：内容页（/tld /guide /vs /prices）SSR 恰好 1 条 modulepreload
   且为路由入口 chunk；首页 / 与 /advanced 为 full 预载（>1 条，含 home/advanced 入口）；
   内容页 HTML 中 0 home-page/domain-row/agent chunk 引用；
2. R447 内容页 SSR 注入（__DH_CONTENT__）全量扫描（tld 396 + guide 392 + vs 432 = 1220，zh），en 抽样；
3. hreflang 三链 + canonical 抽样（核心页 + 各类型内容页 first/mid/last/随机 × zh/en）+ JSON-LD 抽样；
4. sitemap 1228 全量 + xhtml:link 全量核对 + llms.txt 与 sitemap 一致 + robots；
5. 404 行为、/api/prices（Porkbun 缺失面统计）、/api/usage 结构、MCP 三工具。

用法：python3 audit_http_r455.py findings-r455-http.json
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
RE_PRELOAD = re.compile(r'<link rel="modulepreload" href="([^"]+)"')
ENTRY_CHUNK = {"tld": "tld-page-", "guide": "guide-page-", "vs": "compare-page-"}
FORBIDDEN_CHUNKS = ("home-page-", "domain-row-", "agent-")


def fetch(path, data=None, headers=None):
    req = urllib.request.Request(BASE + path, headers={**UA, **(headers or {})}, data=data)
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return r.status, r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "replace")


def hreflang_probe(path):
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
            "has_breadcrumb_jsonld": '"BreadcrumbList"' in html,
            "has_faq_jsonld": '"FAQPage"' in html,
        }
    out["pass"] = all(all(v for k, v in out[l].items() if k.endswith("_ok")) and out[l]["alt_count"] == 3 and out[l]["status"] == 200 for l in ("zh", "en"))
    return out


def check_content_page(kind, slug):
    """R447 注入 + R451 modulepreload 收敛 + 禁用 chunk 引用，单页全量扫描。"""
    st, html = fetch(f"/{kind}/{slug}")
    row = {"status": st}
    data, err = (None, "missing")
    m = RE_INJECT.search(html)
    if m:
        try:
            data, err = json.loads(m.group(1).replace("\\u003c", "<")), None
        except Exception as e:
            err = f"json_error: {e}"
    if err:
        row["inject"] = err
    else:
        key = data.get("tld") if kind == "tld" else data.get("slug")
        row["inject"] = "ok" if (data.get("kind") == kind and key == slug) else "shape_mismatch"
    row["ssr_skeleton"] = 'id="root"' in html and len(html) > 20000
    preloads = RE_PRELOAD.findall(html)
    row["preload_count"] = len(preloads)
    row["preload_entry_ok"] = len(preloads) == 1 and ENTRY_CHUNK[kind] in preloads[0]
    row["forbidden_chunks"] = sorted({c for c in FORBIDDEN_CHUNKS for hit in re.findall(r"/assets/([a-zA-Z0-9._-]+\.js)", html) if hit.startswith(c)})
    row["ok"] = (row["status"] == 200 and row["inject"] == "ok" and row["ssr_skeleton"]
                 and row["preload_entry_ok"] and not row["forbidden_chunks"])
    return slug, row


def main(out):
    counts = json.load(open("../../scripts/content-counts.json"))
    expected = {k: list(counts[k]["slugs"]) for k in ("tld", "guide", "vs")}
    findings["expected_counts"] = {k: len(v) for k, v in expected.items()}
    cb = int(time.time())
    rnd = random.Random(455)

    # ---- R451：首页/advanced full 预载、/prices entry ----
    mp = {}
    for p, kind in (("/", "home"), ("/advanced", "advanced"), ("/prices", "prices")):
        st, html = fetch(p)
        pre = RE_PRELOAD.findall(html)
        mp[p] = {"status": st, "preloads": pre, "count": len(pre)}
    mp["/"]["full_ok"] = mp["/"]["count"] > 1 and any("home-page-" in x for x in mp["/"]["preloads"])
    mp["/advanced"]["full_ok"] = mp["/advanced"]["count"] > 1 and any("advanced-page-" in x for x in mp["/advanced"]["preloads"])
    mp["/prices"]["entry_ok"] = mp["/prices"]["count"] == 1 and "prices-page-" in mp["/prices"]["preloads"][0]
    findings["modulepreload_r451"] = mp

    # ---- hreflang 三链 + JSON-LD 抽样 ----
    pages = ["/", "/tld", "/guide", "/vs", "/prices", "/why", "/advanced", "/mcp"]
    for kind, slugs in expected.items():
        for s in (slugs[0], slugs[len(slugs) // 2], slugs[-1], rnd.choice(slugs)):
            pages.append(f"/{kind}/{s}")
    findings["hreflang"] = {p: hreflang_probe(p) for p in dict.fromkeys(pages)}
    findings["hreflang_all_pass"] = all(v["pass"] for v in findings["hreflang"].values())

    # ---- sitemap x3 / xhtml:link 全量 / llms / robots ----
    sitemap_samples, cat = [], {"tld": set(), "guide": set(), "vs": set(), "core": set()}
    for i in range(3):
        _, xml = fetch(f"/sitemap.xml?cb=r455{i}{cb}")
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

    # ---- 全量内容页扫描（1220 页，zh）：R447 注入 + R451 收敛 ----
    sweep_bad = {}
    sweep_ok = 0
    with ThreadPoolExecutor(max_workers=12) as ex:
        for kind in ("tld", "guide", "vs"):
            for slug, row in ex.map(lambda s, k=kind: check_content_page(k, s), expected[kind]):
                if row["ok"]:
                    sweep_ok += 1
                else:
                    sweep_bad[f"/{kind}/{slug}"] = row
    findings["content_sweep"] = {"total": sum(len(v) for v in expected.values()), "ok": sweep_ok, "bad": sweep_bad}

    # ---- en 注入抽样 ----
    en_sample = {}
    for kind, slugs in expected.items():
        for slug in {slugs[0], slugs[-1], slugs[len(slugs) // 2]}:
            _, row = check_content_page(kind, slug)  # zh full check reused above; here en:
            st, html = fetch(f"/{kind}/{slug}?lang=en")
            m = RE_INJECT.search(html)
            ok = False
            if m:
                try:
                    d = json.loads(m.group(1).replace("\\u003c", "<"))
                    key = d.get("tld") if kind == "tld" else d.get("slug")
                    ok = key == slug
                except Exception:
                    ok = False
            pre = RE_PRELOAD.findall(html)
            en_sample[f"/{kind}/{slug}?lang=en"] = {"status": st, "inject_ok": ok, "preload_entry_ok": len(pre) == 1 and ENTRY_CHUNK[kind] in pre[0]}
    findings["en_sample"] = en_sample

    # ---- 404 ----
    findings["notfound"] = {p: fetch(p)[0] for p in ("/nonexistent-r455", "/tld/notatld-r455", "/guide/notaguide-r455", "/vs/nota-vs-r455")}

    # ---- /api/prices：Porkbun 缺失面 ----
    st, body = fetch("/api/prices")
    j = json.loads(body)
    live = j.get("prices") or {}
    missing = sorted(set(expected["tld"]) - set(live.keys()))
    findings["prices_api"] = {"status": st, "stale": j.get("stale"), "tldCount": j.get("tldCount"),
                              "priceKeys": len(live), "missing_live_count": len(missing), "missing_live": missing}

    # ---- /api/usage 结构 + cron 心跳 ----
    st, body = fetch("/api/usage")
    u = json.loads(body)
    now_ms = int(time.time() * 1000)
    findings["usage_api"] = {
        "status": st,
        "days_is_dict": isinstance(u.get("days"), dict),
        "day_keys_shape_ok": all(re.match(r"^\d{4}-\d{2}-\d{2}$", k) for k in (u.get("days") or {})),
        "cronLast_age_min": round((now_ms - u["cronLast"]) / 60000, 1) if u.get("cronLast") else None,
        "pricesLastOk_age_min": round((now_ms - u["pricesLastOk"]) / 60000, 1) if u.get("pricesLastOk") else None,
        "indexnowLast_age_h": round((now_ms - u["indexnowLast"]) / 3600000, 1) if u.get("indexnowLast") else None,
    }

    # ---- MCP 三工具 ----
    def mcp(payload):
        st, body = fetch("/mcp", data=json.dumps(payload).encode(), headers={"Content-Type": "application/json"})
        return st, json.loads(body)

    _, tl = mcp({"jsonrpc": "2.0", "id": 1, "method": "tools/list"})
    findings["mcp_tools"] = [t["name"] for t in tl["result"]["tools"]]
    _, cd = mcp({"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": "check_domains", "arguments": {"domains": [f"qzxvkw9r455mcp{cb}.com", "google.com"]}}})
    c = json.loads(cd["result"]["content"][0]["text"])
    findings["mcp_check_domains"] = [{"domain": x["domain"], "status": x["status"]} for x in c["results"]]
    _, tp = mcp({"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "tld_prices", "arguments": {}}})
    c = json.loads(tp["result"]["content"][0]["text"])
    findings["mcp_tld_prices"] = {"tldCount": c.get("tldCount"), "priceKeys": len(c.get("prices") or {})}

    json.dump(findings, open(out, "w"), ensure_ascii=False, indent=2)
    slim = {k: v for k, v in findings.items() if k not in ("hreflang", "prices_api")}
    slim["hreflang_fail"] = {p: v for p, v in findings["hreflang"].items() if not v["pass"]}
    slim["prices_api"] = {k: v for k, v in findings["prices_api"].items() if k != "missing_live"}
    slim["prices_missing_live"] = findings["prices_api"]["missing_live"]
    print(json.dumps(slim, ensure_ascii=False, indent=1)[:9000])


if __name__ == "__main__":
    main(sys.argv[1])
