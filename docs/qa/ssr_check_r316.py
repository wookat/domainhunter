import json, re, sys, urllib.request

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/126 Safari/537.36"
BASE = "https://hunt.zalize.com"

paths = [
    "/", "/?lang=en",
    "/prices", "/prices?lang=en",
    "/tld", "/tld?lang=en",
    "/guide", "/guide?lang=en",
    "/vs", "/vs?lang=en",
    "/why", "/advanced",
    # R311 new TLD pages
    "/tld/ltd", "/tld/biz", "/tld/llc", "/tld/fyi", "/tld/promo", "/tld/express",
    "/tld/ltd?lang=en", "/tld/express?lang=en",
    # R312 new vs pages
    "/vs/tennis-vs-club", "/vs/soccer-vs-club", "/vs/football-vs-team",
    "/vs/health-vs-care", "/vs/family-vs-life", "/vs/surf-vs-travel",
    "/vs/tennis-vs-club?lang=en", "/vs/health-vs-care?lang=en",
    # R313 new guides
    "/guide/companyreg", "/guide/consulting", "/guide/wholesale",
    "/guide/trading", "/guide/coupon", "/guide/flashsale",
    "/guide/companyreg?lang=en", "/guide/flashsale?lang=en",
    # older sample
    "/tld/com", "/guide/saas", "/vs/com-vs-io",
]

def fetch(p):
    req = urllib.request.Request(BASE + p, headers={"User-Agent": UA, "Accept": "text/html,application/xhtml+xml"})
    try:
        with urllib.request.urlopen(req) as r:
            return r.status, r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "replace")

out = {}
for p in paths:
    code, html = fetch(p)
    can = re.search(r'<link rel="canonical" href="([^"]+)"', html)
    hre = re.findall(r'<link rel="alternate" hreflang="([^"]+)"', html)
    ogl = re.search(r'<meta property="og:locale" content="([^"]+)"', html)
    ogt = re.search(r'<meta property="og:title" content="([^"]+)"', html)
    lang = re.search(r'<html lang="([^"]+)"', html)
    h1 = re.search(r'<h1[^>]*>(.*?)</h1>', html, re.S)
    lds = re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.S)
    ldt = []
    for x in lds:
        try:
            d = json.loads(x)
            ldt.append(d.get("@type") if isinstance(d, dict) else [i.get("@type") for i in d])
        except Exception:
            ldt.append("PARSE_ERROR")
    out[p] = {
        "status": code,
        "canonical": can.group(1) if can else None,
        "hreflang": hre,
        "og_locale": ogl.group(1) if ogl else None,
        "og_title": (ogt.group(1)[:80] if ogt else None),
        "html_lang": lang.group(1) if lang else None,
        "h1": re.sub(r"<[^>]+>", "", h1.group(1)).strip()[:100] if h1 else None,
        "jsonld_types": ldt,
    }
    print(p, code, out[p]["canonical"], out[p]["h1"], ldt)

# hub link counts
for hub, pref in [("/tld", "/tld/"), ("/guide", "/guide/"), ("/vs", "/vs/")]:
    code, html = fetch(hub)
    links = set(re.findall(r'href="(%s[a-z0-9.-]+)(?:\?[^"]*)?"' % re.escape(pref), html))
    out[hub + "#links"] = {"count": len(links)}
    print(hub, "unique detail links:", len(links))

# 404 checks
for p in ["/nonexistent-r316", "/tld/notatld-r316", "/guide/nope-r316", "/vs/none-vs-none"]:
    code, html = fetch(p)
    out[p] = {"status": code, "branded404": ("404" in html and ("DomainHunter" in html or "找不到" in html or "not found" in html.lower()))}
    print(p, code, out[p]["branded404"])

json.dump(out, open(sys.argv[1], "w"), ensure_ascii=False, indent=2)
