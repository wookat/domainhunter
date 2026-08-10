"""R419 零 AI 全站审计——HTTP 侧检查（纯只读 GET/POST /mcp，不触碰 AI 路径）。

覆盖：
1. R415 回归面（SSR 侧）：三 hub 页（zh+en）SSR 骨架的分组锚点导航——
   nav[aria-label] 存在、chips href 集合与 section id 集合一一对应、
   chips 计数与各组卡片数一致、scroll-mt-32 偏移类存在；
2. 全量内容页（tld 342 + guide 338 + vs 378，zh）__DH_CONTENT__ 注入完整性，en 抽样；
3. sitemap/llms.txt 计数自洽（口径 1066）、robots；
4. SSR meta/canonical/JSON-LD/OG 深抽（各类型 first/last + R412/413/414 新页，zh+en）；
5. 404 行为、/api/prices、MCP 三工具（JSON-RPC）。

用法：python3 audit_http_r419.py findings-r419-http.json
"""
import json
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


def seo_probe(html):
    return {
        "title": (re.search(r"<title>(.*?)</title>", html, re.S) or [None, None])[1],
        "canonical": (re.search(r'<link rel="canonical" href="([^"]+)"', html) or [None, None])[1],
        "html_lang": (re.search(r'<html[^>]*lang="([^"]+)"', html) or [None, None])[1],
        "og_count": len(re.findall(r'<meta property="og:', html)),
        "has_faq_jsonld": '"FAQPage"' in html,
        "has_breadcrumb_jsonld": '"BreadcrumbList"' in html,
        "has_article_jsonld": '"Article"' in html,
        "hreflang_count": len(re.findall(r'hreflang="', html)),
        "bytes": len(html.encode()),
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
    if kind == "tld":
        ok = ok and isinstance(data.get("guide"), dict) and "zh" in data["guide"] and "en" in data["guide"] \
            and isinstance(data.get("relatedGuides"), list) and isinstance(data.get("relatedCompares"), list)
    elif kind == "guide":
        ok = ok and isinstance(data.get("guide"), dict) and "zh" in data["guide"] and "en" in data["guide"] \
            and isinstance(data.get("guideLinks"), list) and len(data["guideLinks"]) > 300
    else:
        ok = ok and isinstance(data.get("cmp"), dict) and isinstance(data.get("sideGuides"), list) \
            and len(data["sideGuides"]) == 2 and isinstance(data.get("compareLinks"), list) and len(data["compareLinks"]) > 300
    row["inject"] = "ok" if ok else "shape_mismatch"
    row["ssr_skeleton"] = 'id="root"' in html and len(html) > 20000
    return slug, row


NAV_LABEL = {"zh": "分组导航", "en": "Group navigation"}


def hub_nav_probe(hub, lang):
    q = "" if lang == "zh" else "?lang=en"
    st, html = fetch(f"/{hub}{q}")
    nav_m = re.search(rf'<nav aria-label="{NAV_LABEL[lang]}"[^>]*>(.*?)</nav>', html, re.S)
    out = {"status": st, "nav_present": bool(nav_m)}
    if not nav_m:
        return out
    nav = nav_m.group(1)
    chip_ids = re.findall(r'href="#hub-g-([^"]+)"', nav)
    chip_counts = [int(c) for c in re.findall(r'<span class="tnum[^>]*>(\d+)</span>', nav)]
    section_ids = re.findall(r'<section id="hub-g-([^"]+)" class="[^"]*scroll-mt-32', html)
    # 各 section 的 h2 计数
    sec_counts = {}
    for sid in section_ids:
        m = re.search(rf'<section id="hub-g-{re.escape(sid)}".*?<span class="tnum[^>]*>(\d+)</span>', html, re.S)
        sec_counts[sid] = int(m.group(1)) if m else None
    out.update({
        "chip_count": len(chip_ids),
        "chips_eq_sections": chip_ids == section_ids,
        "chip_counts_eq_section_counts": chip_counts == [sec_counts[s] for s in section_ids],
        "counts_sum": sum(chip_counts),
        "sticky_class": 'sticky top-14' in nav_m.group(0),
        "scroll_mt_32_all": len(section_ids) == len(re.findall(r'<section id="hub-g-', html)),
    })
    return out


def main(out):
    counts = json.load(open("../../scripts/content-counts.json"))
    expected = {k: list(counts[k]["slugs"]) for k in ("tld", "guide", "vs")}
    cb = int(time.time())

    # ---- R415 SSR 侧：三 hub × 双语 锚点导航一致性 ----
    findings["hub_nav_ssr"] = {f"/{h}:{l}": hub_nav_probe(h, l) for h in ("tld", "guide", "vs") for l in ("zh", "en")}

    # ---- sitemap x3 / llms / robots ----
    sitemap_samples, cat = [], {"tld": set(), "guide": set(), "vs": set(), "core": set()}
    for i in range(3):
        _, xml = fetch(f"/sitemap.xml?cb=r419{i}{cb}")
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
    _, llms = fetch("/llms.txt")
    lt = {k: set(re.findall(rf"/{k}/([a-z0-9-]+)", llms)) for k in ("tld", "guide", "vs")}
    findings["llms_counts"] = {k: len(v) for k, v in lt.items()}
    findings["llms_vs_sitemap_equal"] = {k: lt[k] == cat[k] for k in ("tld", "guide", "vs")}
    rs, robots = fetch("/robots.txt")
    findings["robots"] = {"status": rs, "has_sitemap": "sitemap.xml" in robots, "gptbot": "GPTBot" in robots}

    # ---- 全量注入完整性扫描（1058 页，zh） ----
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

    # ---- SSR 深抽（各类型 first/last + R412/413/414 新页，zh+en） ----
    deep_pages = []
    for kind, slugs in expected.items():
        deep_pages += [f"/{kind}/{slugs[0]}", f"/{kind}/{slugs[-1]}"]
    deep_pages += ["/tld/tienda", "/guide/teaware", "/vs/abogado-vs-lawyer", "/", "/prices", "/tld", "/guide", "/vs"]
    seo = {}
    for p in dict.fromkeys(deep_pages):
        for q in ("", "?lang=en"):
            st, html = fetch(p + q)
            seo[p + q] = {"status": st, **seo_probe(html)}
    findings["seo_deep"] = seo

    # ---- 404 ----
    findings["notfound"] = {p: fetch(p)[0] for p in ("/nonexistent-r419", "/tld/notatld-r419", "/guide/notaguide-r419", "/vs/nota-vs-r419")}

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
    _, cd = mcp({"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": "check_domains", "arguments": {"domains": [f"qzxvkw9r419mcp{cb}.com", "google.com"]}}})
    c = json.loads(cd["result"]["content"][0]["text"])
    findings["mcp_check_domains"] = [{"domain": x["domain"], "status": x["status"], "expiresAt": x.get("expiresAt")} for x in c["results"]]
    _, tp = mcp({"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "tld_prices", "arguments": {}}})
    c = json.loads(tp["result"]["content"][0]["text"])
    findings["mcp_tld_prices"] = {"tldCount": c.get("tldCount"), "priceKeys": len(c.get("prices") or {})}
    _, sv = mcp({"jsonrpc": "2.0", "id": 4, "method": "tools/call", "params": {"name": "suggest_variants", "arguments": {"name": "qzxvkw9r419"}}})
    c = json.loads(sv["result"]["content"][0]["text"])
    findings["mcp_suggest_variants"] = {"variants": len(c.get("variants") or c.get("results") or [])}

    json.dump(findings, open(out, "w"), ensure_ascii=False, indent=2)
    print(json.dumps({k: v for k, v in findings.items() if k not in ("seo_deep",)}, ensure_ascii=False, indent=1)[:8000])


if __name__ == "__main__":
    main(sys.argv[1])
