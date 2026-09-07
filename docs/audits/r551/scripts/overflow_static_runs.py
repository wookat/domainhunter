"""静态扫描 thin-fetch 抓下的全站 HTML（<main> 内正文，去 <script>/<style>），找「、」相连且中间无空格的 TLD 序列
（UAX#14：'.' 为 IS 类，「、」(CL) 后接 IS 不允许断行 → 整段不可换行）。宽度估算：ASCII 8px / CJK 15px（15px 字号近似），
只用于挑候选，真实溢出以 overflow_verify.py 的浏览器 bodyScrollWidth 为准。"""
import re, json, glob, os, html
ROOT = "/home/ubuntu/r551/thin/out/html"
RUN = re.compile(r"(?:\.[a-z0-9.-]+、){2,}\.[a-z0-9.-]+")
def est(s): return sum(15 if ord(ch) > 0x2E7F else 8 for ch in s)
out = {"zh": [], "en": []}
for f in sorted(glob.glob(ROOT + "/*/*.html")):
    name = os.path.relpath(f, ROOT)[:-5]
    lang = "en" if name.endswith(".en") else "zh"
    h = open(f, encoding="utf-8", errors="ignore").read()
    m = re.search(r"<main[\s\S]*?</main>", h); h = m.group(0) if m else h
    h = re.sub(r"<(script|style)[\s\S]*?</\1>", "", h)
    t = html.unescape(re.sub(r"<[^>]+>", " ", h))
    runs = [r for r in RUN.findall(t)]
    if runs:
        best = max(runs, key=est)
        out[lang].append({"page": name, "runs": len(runs), "longest": best, "est_px": est(best)})
for k in out: out[k].sort(key=lambda x: -x["est_px"])
tot = len(glob.glob(ROOT + "/*/*.html"))
summary = {"html_files": tot, "zh_pages_with_runs": len(out["zh"]), "en_pages_with_runs": len(out["en"]),
           "zh_est_ge_375": sum(1 for x in out["zh"] if x["est_px"] >= 375), **out}
json.dump(summary, open("/home/ubuntu/r551/browser/overflow_static_runs.json", "w"), ensure_ascii=False, indent=1)
print({k: v for k, v in summary.items() if k not in ("zh", "en")}); print([(x["page"], x["est_px"]) for x in out["zh"][:30]])
