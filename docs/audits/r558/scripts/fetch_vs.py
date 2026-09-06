#!/usr/bin/env python3
"""R558 §2: fetch all /vs pages (zh + en) SSR HTML with a Mozilla UA (0 AI). Output: r549/html/<slug>.<lang>.html + fetch_log.tsv"""
import json, os, re, sys, time, urllib.request
from concurrent.futures import ThreadPoolExecutor

ORIGIN = "https://hunt.zalize.com"
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0 Safari/537.36 r558-audit"
OUT = "/home/ubuntu/r558/r549/html"
os.makedirs(OUT, exist_ok=True)

sitemap = open("/home/ubuntu/r558/http/sitemap.xml").read()
slugs = sorted(set(re.findall(r"<loc>https://hunt\.zalize\.com/vs/([a-z0-9-]+)</loc>", sitemap)))
print("slugs", len(slugs))

def fetch(job):
    slug, lang = job
    url = f"{ORIGIN}/vs/{slug}" + ("?lang=en" if lang == "en" else "")
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "text/html"})
            t0 = time.time()
            with urllib.request.urlopen(req, timeout=30) as r:
                body = r.read().decode("utf-8")
                status = r.status
            dt = time.time() - t0
            open(f"{OUT}/{slug}.{lang}.html", "w").write(body)
            return (slug, lang, status, len(body), round(dt, 3), body.count("{{"))
        except Exception as e:  # noqa
            err = repr(e)
            time.sleep(1.5)
    return (slug, lang, "ERR", 0, 0, -1, err)

jobs = [(s, l) for s in slugs for l in ("zh", "en")]
t0 = time.time()
with ThreadPoolExecutor(max_workers=6) as ex:
    rows = list(ex.map(fetch, jobs))
with open("/home/ubuntu/r558/r549/fetch_log.tsv", "w") as f:
    f.write("slug\tlang\tstatus\tbytes\tseconds\tbrace_count\n")
    for r in rows:
        f.write("\t".join(str(x) for x in r) + "\n")
ok = sum(1 for r in rows if r[2] == 200)
braces = sum(r[5] for r in rows if r[2] == 200)
print(f"fetched {len(rows)} pages in {time.time()-t0:.0f}s, 200={ok}, total '{{{{' occurrences={braces}")
bad = [r for r in rows if r[2] != 200 or r[5] != 0]
print("non-200 or with {{:", bad[:20])
