import re, json, sys, urllib.request, html
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36 R559-audit"
pages = ["de-vs-com", "com-vs-io", "win-vs-vip", "com-vs-cn", "io-vs-ai", "com-vs-ai"]
out = []
def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.status, r.read().decode("utf-8", "replace")
for slug in pages:
    for lang in ["zh", "en"]:
        url = f"https://hunt.zalize.com/vs/{slug}?lang={lang}"
        st, body = fetch(url)
        open(f"/home/ubuntu/r559/vs-{slug}-{lang}.html", "w").write(body)
        text = re.sub(r"<script[\s\S]*?</script>|<style[\s\S]*?</style>", " ", body)
        # table rows
        tbl = re.search(r"<table[\s\S]*?</table>", text)
        rows = []
        if tbl:
            for tr in re.findall(r"<tr>([\s\S]*?)</tr>", tbl.group(0)):
                cells = [html.unescape(re.sub(r"<[^>]+>", "", c)).strip() for c in re.findall(r"<t[hd][^>]*>([\s\S]*?)</t[hd]>", tr)]
                if cells: rows.append(cells)
        # verdict prose (first paragraph after h1)
        h1 = re.search(r"<h1[^>]*>([\s\S]*?)</h1>", text)
        h1t = html.unescape(re.sub(r"<[^>]+>", "", h1.group(1))).strip() if h1 else ""
        m = re.search(r"</h2>\s*([\s\S]*?)<section", text)
        prose = html.unescape(re.sub(r"<[^>]+>", " ", m.group(1))).strip() if m else ""
        prose = re.sub(r"\s+", " ", prose)
        prose_prices = re.findall(r"[¥$]\s?\d[\d,.]*", prose)
        opening = prose[:160]
        # dedicated placeholder check for de-vs-com en: '.de' must be present near prices
        out.append({"slug": slug, "lang": lang, "status": st, "h1": h1t, "table": rows,
                    "prose_prices": prose_prices, "prose": prose, "opening": opening,
                    "has_ai_search_link": "/api/ai-search" in body})
        print(f"== {slug} {lang} HTTP {st} | {h1t}")
        for r in rows: print("   TBL", " | ".join(r))
        print("   PROSE$", prose_prices)
        print("   PROSE:", prose[:600])
json.dump(out, open("/home/ubuntu/r559/vs-check.json", "w"), ensure_ascii=False, indent=1)
