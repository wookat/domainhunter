#!/usr/bin/env python3
"""R558 §2 (R549 专项): independent verification of /vs prose price placeholders against the SAME page's SSR price table.

For every fetched SSR page (r549/html/<slug>.<lang>.html):
  1. visible root text (scripts/SVG stripped) must contain 0 '{{'
  2. parse the R521 price table rows (.a / .b: first/renew usd+cny, ≈ flag) from the SSR HTML
  3. take the raw compare copy (verdict / pickA / pickB) from window.__DH_CONTENT__.cmp and re-render every
     placeholder with an INDEPENDENT Python implementation of the documented R549 conventions
     (USD integer, CNY integer, ratio 1 decimal / int >= 10, costN = first + (N-1)*renew, |diff|, pair lo–hi, ≈ when a side is static)
  4. every rendered sentence must appear verbatim in the visible SSR text (whitespace-normalised)
  5. the embedded snapshot (__DH_CONTENT__.prices.live) must equal the table cells (round2) and fetchedAt must be identical on all pages
  6. subject heuristic: for each price/cost/jump placeholder, the last '.tld' mentioned in the preceding 90 chars of the same clause
     is recorded; a mismatch with the placeholder TLD is flagged for MANUAL reading (R553 P1 class), not auto-failed.
Output: r549/verify_summary.json, r549/verify_failures.json, r549/subject_flags.tsv, r549/rendered_sentences/<slug>.<lang>.txt
"""
import glob, html, json, math, os, re
from collections import Counter

HTML_DIR = "/home/ubuntu/r558/r549/html"
OUT = "/home/ubuntu/r558/r549"
os.makedirs(f"{OUT}/rendered_sentences", exist_ok=True)
PH_RE = re.compile(r"\{\{(price|diff|ratio|jump|sum|pair|cost\d+|costdiff\d+):([a-z0-9.:-]+)\}\}")


def jround(x):  # JS Math.round (half up), Python round is banker's
    return math.floor(x + 0.5)


def round2(x):
    return jround(x * 100) / 100


def norm(s):
    return re.sub(r"\s+", " ", html.unescape(s)).strip()


def root_html(h):
    m = re.search(r'<div id="root">(.*)</div>\s*<script', h, re.S)
    return m.group(1) if m else h


def visible_text(root):
    body = re.sub(r"<script.*?</script>|<style.*?</style>|<svg.*?</svg>", " ", root, flags=re.S)
    body = re.sub(r"<[^>]+>", " ", body)
    return norm(body)


CELL_RE = re.compile(r"(≈)?\$(\d+(?:\.\d+)?)\s*¥(\d+)")


def parse_table(root, a, b):
    """returns {tld: {approx, first_usd, first_cny, renew_usd, renew_cny, five_usd, five_cny}} for the two sides, or {}"""
    rows = {}
    for tbl in re.findall(r"<table.*?</table>", root, re.S):
        for tr in re.findall(r"<tr.*?</tr>", tbl, re.S):
            cells = [norm(re.sub(r"<[^>]+>", " ", c)) for c in re.findall(r"<t[dh][^>]*>(.*?)</t[dh]>", tr, re.S)]
            if len(cells) != 4:
                continue
            m = re.match(r"\.([a-z0-9.-]+)", cells[0])
            if not m or m.group(1) not in (a, b):
                continue
            vals = []
            ok = True
            for c in cells[1:]:
                cm = CELL_RE.search(c.replace("\u2009", "").replace(" ", ""))
                if not cm:
                    ok = False
                    break
                vals.append((cm.group(1) == "≈", float(cm.group(2)), int(cm.group(3))))
            if not ok:
                continue
            rows[m.group(1)] = {"approx": any(v[0] for v in vals), "first_usd": vals[0][1], "first_cny": vals[0][2],
                                "renew_usd": vals[1][1], "renew_cny": vals[1][2], "five_usd": vals[2][1], "five_cny": vals[2][2]}
    return rows


def amount(v, cur, lang, approx):
    mark = "≈" if approx else ""
    if cur == "usd":
        return f"{mark}${jround(v)}"
    return f"{mark}{jround(v)} 元" if lang == "zh" else f"{mark}¥{jround(v)}"


def ratio_txt(r, lang):
    if r >= 10:
        n = str(jround(r))
    else:
        v = jround(r * 10) / 10
        n = str(int(v)) if v == int(v) else str(v)
    return f"{n} 倍" if lang == "zh" else f"{n}×"


def render(kind, args, lang, table):
    """independent implementation; returns (text, tlds_used) or (None, reason)"""
    def get(tld):
        return table.get(tld)
    def val(row, field, cur):
        return row[f"{field}_{cur}"]
    if kind == "price":
        tld, field, cur = args
        r = get(tld)
        if not r: return "—", [tld]
        return amount(val(r, field, cur), cur, lang, r["approx"]), [tld]
    if kind in ("diff", "sum", "pair"):
        a, b, field, cur = args
        ra, rb = get(a), get(b)
        if not ra or not rb: return "—", [a, b]
        ap = ra["approx"] or rb["approx"]
        x, y = val(ra, field, cur), val(rb, field, cur)
        if kind == "diff": return amount(abs(x - y), cur, lang, ap), [a, b]
        if kind == "sum": return amount(x + y, cur, lang, ap), [a, b]
        rx, ry = jround(x), jround(y)
        if rx == ry: return amount(rx, cur, lang, ap), [a, b]
        lo = amount(min(rx, ry), cur, lang, ap); hi = max(rx, ry)
        if cur == "usd" or lang == "en": return f"{lo}–{hi}", [a, b]
        return f"{lo[:-2]}–{hi} 元", [a, b]
    if kind == "ratio":
        a, b, field = args
        ra, rb = get(a), get(b)
        if not ra or not rb: return "—", [a, b]
        den = val(rb, field, "usd")
        if den <= 0: return "—", [a, b]
        return ("≈" if ra["approx"] or rb["approx"] else "") + ratio_txt(val(ra, field, "usd") / den, lang), [a, b]
    if kind == "jump":
        (tld,) = args
        r = get(tld)
        if not r: return "—", [tld]
        if r["first_usd"] <= 0: return "—", [tld]
        return ("≈" if r["approx"] else "") + ratio_txt(r["renew_usd"] / r["first_usd"], lang), [tld]
    m = re.match(r"cost(\d+)$", kind)
    if m:
        years = int(m.group(1)); tld, cur = args
        r = get(tld)
        if not r: return "—", [tld]
        return amount(val(r, "first", cur) + (years - 1) * val(r, "renew", cur), cur, lang, r["approx"]), [tld]
    m = re.match(r"costdiff(\d+)$", kind)
    if m:
        years = int(m.group(1)); a, b, cur = args
        ra, rb = get(a), get(b)
        if not ra or not rb: return "—", [a, b]
        ca = val(ra, "first", cur) + (years - 1) * val(ra, "renew", cur)
        cb = val(rb, "first", cur) + (years - 1) * val(rb, "renew", cur)
        return amount(abs(ca - cb), cur, lang, ra["approx"] or rb["approx"]), [a, b]
    return None, f"unknown kind {kind}"


summary = Counter(); failures = []; subject_flags = []; fetched_ats = Counter(); stale_flags = Counter()
kind_hits = Counter(); pages_by_kind = {}
files = sorted(glob.glob(f"{HTML_DIR}/*.html"))
for f in files:
    slug, lang = os.path.basename(f)[:-5].rsplit(".", 1)
    h = open(f).read()
    root = root_html(h)
    text = visible_text(root)
    summary["pages"] += 1
    if "{{" in text:
        failures.append({"slug": slug, "lang": lang, "type": "brace_in_visible_text", "n": text.count("{{")})
    m = re.search(r"window\.__DH_CONTENT__=(\{.*?\});?\s*</script>", h, re.S)
    if not m:
        failures.append({"slug": slug, "lang": lang, "type": "no_dh_content"}); continue
    dh = json.loads(m.group(1))
    cmp_ = dh["cmp"]; a, b = cmp_["a"], cmp_["b"]
    snap = dh.get("prices") or {}
    fetched_ats[snap.get("fetchedAt")] += 1; stale_flags[snap.get("stale")] += 1
    table = parse_table(root, a, b)
    # 5. snapshot vs table
    for tld, p in (snap.get("live") or {}).items():
        row = table.get(tld)
        if not row:
            failures.append({"slug": slug, "lang": lang, "type": "snapshot_tld_missing_in_table", "tld": tld}); continue
        if round2(p["registration"]) != row["first_usd"] or round2(p["renewal"]) != row["renew_usd"]:
            failures.append({"slug": slug, "lang": lang, "type": "snapshot_vs_table_mismatch", "tld": tld, "snap": p, "table": row})
        if row["approx"]:
            failures.append({"slug": slug, "lang": lang, "type": "live_row_marked_approx", "tld": tld})
        if round2(row["first_usd"] + 4 * row["renew_usd"]) != row["five_usd"]:
            failures.append({"slug": slug, "lang": lang, "type": "table_five_year_arith", "tld": tld, "row": row})
    for tld in (a, b):
        if tld not in table:
            summary["side_without_table_row"] += 1
    loc = cmp_[lang]
    pieces = [("verdict", loc["verdict"])] + [(f"pickA{i}", s) for i, s in enumerate(loc["pickA"])] + [(f"pickB{i}", s) for i, s in enumerate(loc["pickB"])]
    for k in ("title", "metaDescription"):
        if "{{" in loc.get(k, ""):
            failures.append({"slug": slug, "lang": lang, "type": f"placeholder_in_{k}"})
    rendered_out = []
    for name, raw in pieces:
        if "{{" not in raw:
            continue
        def sub(mo):
            kind, argstr = mo.group(1), mo.group(2)
            args = argstr.split(":")
            out, tlds = render(kind, args, lang, table)
            k = re.sub(r"\d+", "N", kind)
            kind_hits[k] += 1; pages_by_kind.setdefault(k, set()).add(slug)
            if out is None:
                failures.append({"slug": slug, "lang": lang, "type": "unparseable_placeholder", "token": mo.group(0)}); return mo.group(0)
            if out == "—":
                summary["rendered_dash"] += 1
            # subject heuristic for single-TLD placeholders
            if kind == "price" or kind.startswith("cost") and not kind.startswith("costdiff") or kind == "jump":
                pre = raw[max(0, mo.start() - 90):mo.start()]
                clause = re.split(r"[。；;！？!?]|(?<=[a-z\)）])\. (?=[A-Z])", pre)[-1]
                mentions = re.findall(r"\.(" + re.escape(a) + "|" + re.escape(b) + r")(?![a-z0-9])", clause)
                last = mentions[-1] if mentions else None
                if last and last != tlds[0]:
                    subject_flags.append((slug, lang, name, mo.group(0), last, norm(clause[-70:]) + " ▶" + out))
            return out
        rendered = PH_RE.sub(sub, raw)
        if "{{" in rendered:
            failures.append({"slug": slug, "lang": lang, "type": "unrendered_after_sub", "piece": name})
        if norm(rendered) not in text:
            # locate first differing region for the report
            failures.append({"slug": slug, "lang": lang, "type": "rendered_text_not_in_ssr", "piece": name, "rendered": norm(rendered)[:400]})
            summary["pieces_mismatch"] += 1
        else:
            summary["pieces_ok"] += 1
        rendered_out.append(f"[{name}] {norm(rendered)}")
    tbl_txt = json.dumps(table, ensure_ascii=False)
    open(f"{OUT}/rendered_sentences/{slug}.{lang}.txt", "w").write(f"TABLE {tbl_txt}\n" + "\n".join(rendered_out) + "\n")

summary = dict(summary); summary.update({"placeholders_total": sum(kind_hits.values()), "fetchedAt_values": dict(fetched_ats), "stale_values": {str(k): v for k, v in stale_flags.items()},
                "kinds": dict(kind_hits), "pages_per_kind": {k: len(v) for k, v in pages_by_kind.items()}, "failures": len(failures), "subject_flags": len(subject_flags)})
json.dump(dict(summary), open(f"{OUT}/verify_summary.json", "w"), ensure_ascii=False, indent=1)
json.dump(failures, open(f"{OUT}/verify_failures.json", "w"), ensure_ascii=False, indent=1)
with open(f"{OUT}/subject_flags.tsv", "w") as fh:
    fh.write("slug\tlang\tpiece\ttoken\tlast_mentioned_tld\tcontext\n")
    for r in subject_flags:
        fh.write("\t".join(r) + "\n")
print(json.dumps(dict(summary), ensure_ascii=False, indent=1))
print("failure types:", Counter(x["type"] for x in failures))
for x in failures[:15]:
    print(x)
