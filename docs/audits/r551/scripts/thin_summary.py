#!/usr/bin/env python3
"""R551: linkShare (=1-proseWords/bodyWords) / prose / nnMasked distribution from thin-analyze pages.csv,
seeded random sample (40 vs/en + 20 tld/en, seed 551), R540/R546 baseline comparison, R542 opener guard (59-char) spot check."""
import csv, json, random, re, html, statistics as st
from pathlib import Path
IN = Path("/home/ubuntu/r551/thin"); rows = list(csv.DictReader(open(IN / "analysis/pages.csv")))
for r in rows:
    r["linkShare"] = 1 - int(r["proseWords"]) / int(r["bodyWords"]) if int(r["bodyWords"]) else 0
def dist(xs):
    xs = sorted(xs); q = lambda p: xs[min(len(xs) - 1, int(round(p * (len(xs) - 1))))]
    return {"n": len(xs), "median": round(st.median(xs), 4), "p90": round(q(0.9), 4), "max": round(xs[-1], 4), "min": round(xs[0], 4)}
out = {"baseline": {"R540/R546 vs/en": {"linkShare_median": 0.1984, "gt25": 0, "ge23": 0, "max": 0.2298, "prose_median": 628},
                    "R540/R546 vs/zh": {"linkShare_median": 0.168, "gt25": 0, "prose_median": 1013.5},
                    "R537 tld": {"nnMasked_median_zh": 0.266, "nnMasked_median_en": None, "prose_median_zh": 665}}, "full": {}, "sample": {}}
for g in ("tld", "guide", "vs"):
    for l in ("zh", "en"):
        sub = [r for r in rows if r["group"] == g and r["lang"] == l]
        ls = [r["linkShare"] for r in sub]
        out["full"][f"{g}/{l}"] = {"linkShare": dist(ls), "gt25": sum(1 for x in ls if x > 0.25), "ge23": sum(1 for x in ls if x >= 0.23),
                                  "prose": dist([int(r["proseWords"]) for r in sub]), "nnMasked": dist([float(r["nnMasked"]) for r in sub]),
                                  "faqLdMismatch": sum(1 for r in sub if r["faqDetails"] != r["faqLd"]), "dupSentenceRatio_max": max(float(r["dupSentenceRatio"]) for r in sub),
                                  "top_linkShare": [(r["path"], round(r["linkShare"], 4)) for r in sorted(sub, key=lambda r: -r["linkShare"])[:5]]}
rng = random.Random(551)
for g, n in (("vs", 40), ("tld", 20)):
    sub = sorted([r for r in rows if r["group"] == g and r["lang"] == "en"], key=lambda r: r["path"])
    smp = rng.sample(sub, n)
    out["sample"][f"{g}/en"] = {"seed": 551, "n": n, "linkShare": dist([r["linkShare"] for r in smp]), "gt25": sum(1 for r in smp if r["linkShare"] > 0.25),
                               "ge23": sum(1 for r in smp if r["linkShare"] >= 0.23), "prose": dist([int(r["proseWords"]) for r in smp]), "nnMasked": dist([float(r["nnMasked"]) for r in smp]),
                               "pages": [{"path": r["path"], "linkShare": round(r["linkShare"], 4), "prose": int(r["proseWords"]), "nnMasked": float(r["nnMasked"]), "nnPath": r["nnPath"], "faq": f"{r['faqDetails']}/{r['faqLd']}"} for r in smp]}
# R542 opener guard: en verdict paragraph first 59 normalized chars pairwise distinct among ccTLD-vs-com pages
def strip(h): return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", h))).strip()
def norm59(s): return re.sub(r"[^a-z0-9]", "", s.lower())[:59]
def verdict_paras(path):
    h = open(IN / f"out/html/vs/{path}.en.html").read()
    main = re.search(r"<main\b.*?</main>", h, re.S).group(0)
    return [strip(p) for p in re.findall(r"<p\b[^>]*>(.*?)</p>", main, re.S) if len(strip(p)) > 120]
r542 = {"pages": {}, "opener59_pairwise_distinct": None, "shared_sentence_r546": {}}
pages = ["uk-vs-com", "de-vs-com", "au-vs-com", "fr-vs-com"]
reg = {"uk-vs-com": "Nominet", "de-vs-com": "DENIC", "au-vs-com": "auDA", "fr-vs-com": "AFNIC"}
openers = {}
for p in pages:
    paras = verdict_paras(p)
    reg_par = next((x for x in paras if reg[p] in x), None)
    openers[p] = norm59(reg_par or "")
    r542["pages"][p] = {"registrar_in_verdict": reg_par is not None, "opener_first120": (reg_par or "")[:120], "opener59": openers[p],
                        "old_opener_present": "As with every ccTLD-versus-.com call" in " ".join(paras),
                        "shared_later_sentence": "recognition is irreplaceable" in " ".join(paras)}
r542["opener59_pairwise_distinct"] = len(set(openers.values())) == len(openers)
# whole ccTLD-vs-com / ccTLD group: any two en vs pages sharing the same first-59 of any long paragraph?
allp = {}
for f in sorted((IN / "out/html/vs").glob("*.en.html")):
    slug = f.name[:-8]
    for para in verdict_paras(slug):
        allp.setdefault(norm59(para), []).append(slug)
dups = {k: v for k, v in allp.items() if len(set(v)) > 1}
r542["site_wide_en_long_paragraph_first59_shared"] = {"groups": len(dups), "examples": [(k[:59], sorted(set(v))[:6]) for k, v in list(dups.items())[:15]]}
# production replica of compare-verdict-opening.test.ts: verdict <p> (mt-2.5 text-[15px] leading-relaxed text-txt1) first 59 normalized chars, zh+en, all 444
VERD = re.compile(r'<p class="mt-2\.5 text-\[15px\] leading-relaxed text-txt1">(.*?)</p>', re.S)
def norm_guard(s): return re.sub(r"[\s\W_]", "", s.lower(), flags=re.U)[:59]
guard = {}
for lang in ("zh", "en"):
    by = {}; missing = []
    for f in sorted((IN / "out/html/vs").glob(f"*.{lang}.html")):
        m = VERD.search(f.read_text())
        if not m: missing.append(f.name); continue
        by.setdefault(norm_guard(strip(m.group(1))), []).append(f.name.split(".")[0])
    shared = {k: v for k, v in by.items() if len(v) >= 2}
    guard[lang] = {"pages": len(by) + len(missing), "verdict_missing": missing, "shared_prefix_groups": shared}
r542["production_verdict_opener59_guard"] = guard
out["r542"] = r542
json.dump(out, open(IN / "r551-thin-summary.json", "w"), ensure_ascii=False, indent=1)
print(json.dumps({k: out[k] for k in ("full",)}, ensure_ascii=False, indent=1))
for k, v in out["sample"].items(): print(k, {x: v[x] for x in v if x != "pages"})
print(json.dumps(r542, ensure_ascii=False, indent=1)[:3000])
