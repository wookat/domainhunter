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
    # R306 new TLD pages
    "/tld/golf", "/tld/tennis", "/tld/soccer", "/tld/football", "/tld/hockey", "/tld/surf",
    "/tld/golf?lang=en", "/tld/surf?lang=en",
    # R307 new vs pages
    "/vs/golf-vs-club", "/vs/tennis-vs-coach", "/vs/soccer-vs-football",
    "/vs/hockey-vs-team", "/vs/surf-vs-fun", "/vs/golf-vs-travel",
    "/vs/golf-vs-club?lang=en", "/vs/soccer-vs-football?lang=en",
    # recent guides sample
    "/guide/runclub", "/guide/nutrition", "/guide/physio", "/guide/runclub?lang=en",
]

def fetch(p):
    req = urllib.request.Request(BASE + p, headers={"User-Agent": UA})
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

# 404 checks
for p in ["/nonexistent-r310", "/tld/notatld-r310", "/guide/nope-r310", "/vs/none-vs-none"]:
    code, html = fetch(p)
    out[p] = {"status": code, "branded404": ("404" in html and ("DomainHunter" in html or "找不到" in html or "not found" in html.lower()))}
    print(p, code, out[p]["branded404"])

json.dump(out, open(sys.argv[1], "w"), ensure_ascii=False, indent=2)
