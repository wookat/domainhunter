#!/usr/bin/env bash
# R564 production zero-AI read-only probes. Only GET /api/usage and POST /api/check (non-AI, no usage counters).
set -u
B=https://hunt.zalize.com
UA="Mozilla/5.0 (X11; Linux x86_64) r564-probe"
OUT=/home/ubuntu/r564/prod
mkdir -p "$OUT"
echo "== usage before $(date -u +%FT%TZ)"
curl -s -A "$UA" "$B/api/usage?cb=$(date +%s)" > "$OUT/usage-before.json"
python3 - "$OUT/usage-before.json" <<'PY'
import json,sys,datetime
u=json.load(open(sys.argv[1])); d=datetime.datetime.utcnow().strftime("%Y-%m-%d")
day=u.get("days",{}).get(d,{})
print("today", d, {k:day.get(k) for k in ("searches","fast","refine","aiErrors","fallbacks")})
PY
echo "== POST /api/check?refresh=1 (.ai / .cn reserved / taken .com / random .cn)"
for d in chaxiang.ai lingxicha.ai nic.cn google.com "r564zz$(date +%s).cn" baidu.com.cn; do
  echo "--- $d"
  curl -s -A "$UA" -X POST "$B/api/check?refresh=1" -H 'content-type: application/json' \
    -d "{\"domains\":[\"$d\"],\"refresh\":true}" -w '\nHTTP %{http_code} %{time_total}s\n' | tee -a "$OUT/check.ndjson"
done
echo "== /?q=chaxiang SSR (production, pre-R564) — SSR shell only, SPA decides mode client-side"
curl -s -A "$UA" "$B/?q=chaxiang" -o "$OUT/q-chaxiang.html" -w 'HTTP %{http_code} bytes %{size_download}\n'
grep -o '<title>[^<]*</title>' "$OUT/q-chaxiang.html"
echo "== sleeping 65s for KV shard visibility"
sleep 65
curl -s -A "$UA" "$B/api/usage?cb=$(date +%s)" > "$OUT/usage-after.json"
python3 - "$OUT/usage-before.json" "$OUT/usage-after.json" <<'PY'
import json,sys,datetime
a=json.load(open(sys.argv[1])); b=json.load(open(sys.argv[2])); d=datetime.datetime.utcnow().strftime("%Y-%m-%d")
da=a.get("days",{}).get(d,{}); db=b.get("days",{}).get(d,{})
for k in ("searches","fast","refine","aiErrors","fallbacks","llmProvider"):
    print(k, "before", da.get(k), "after", db.get(k), "SAME" if da.get(k)==db.get(k) else "DIFF")
pv_a=da.get("pageviews",{}); pv_b=db.get("pageviews",{})
print("pageviews delta", {k: (pv_b.get(k,0)-pv_a.get(k,0)) for k in set(pv_a)|set(pv_b) if pv_b.get(k,0)!=pv_a.get(k,0)})
PY
