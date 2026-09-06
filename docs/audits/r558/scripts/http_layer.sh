#!/usr/bin/env bash
# R551 HTTP-layer audit (0 AI): sitemap, 404/410 shells, HTML sizes, share lifecycle, MCP 3 tools, /api/check
set -u
O=https://hunt.zalize.com
UA="Mozilla/5.0 (X11; Linux x86_64) r558-audit"
cd /home/ubuntu/r558; mkdir -p http
CB=$RANDOM$RANDOM
echo "== sitemap ($(date -u +%FT%TZ))"
curl -s -A "$UA" "$O/sitemap.xml?cb=$CB" -o http/sitemap.xml
python3 - <<'EOF'
import re
x=open('/home/ubuntu/r558/http/sitemap.xml').read()
locs=re.findall(r'<loc>([^<]+)</loc>',x)
from collections import Counter
c=Counter()
for l in locs:
    p=l.replace('https://hunt.zalize.com','')
    seg=p.split('/')[1] if p.count('/')>=1 else ''
    if p.startswith('/tld/'): c['tld']+=1
    elif p.startswith('/guide/'): c['guide']+=1
    elif p.startswith('/vs/'): c['vs']+=1
    else: c['static:'+p]+=1
print('total',len(locs),'unique',len(set(locs)))
print(dict(c))
print('alt links', x.count('xhtml:link'), 'hreflang en', x.count('hreflang="en"'), 'lang=en in loc', sum('lang=en' in l for l in locs))
EOF
echo "== content-counts.json"; python3 -c "import json;d=json.load(open('/home/ubuntu/repos/domainhunter/scripts/content-counts.json'));print({k:v['count'] for k,v in d.items()})"

echo "== 404 shell with different Accept"
for acc in 'text/html' 'application/json' '*/*' 'image/png'; do
  st=$(curl -s -A "$UA" -H "Accept: $acc" -o http/nf_$(echo $acc|tr -c 'a-z' _).html -w '%{http_code} %{content_type} %{size_download}' "$O/nope-r558-$CB?cb=$CB"); echo "  Accept:$acc -> $st"; done
grep -o '<title>[^<]*</title>\|<meta name="robots"[^>]*>\|<h1[^>]*>[^<]*' http/nf_text_html.html | head -3
st=$(curl -s -A "$UA" -H 'Accept: text/html' -o http/nf_en.html -w '%{http_code}' "$O/nope-r558-$CB?lang=en&cb=$CB"); echo "  en 404 -> $st"; grep -o '<title>[^<]*</title>\|<html lang="[^"]*"' http/nf_en.html | head -2
echo "  /api/nope:"; curl -s -A "$UA" -o /dev/null -w '  %{http_code} ct=%{content_type} size=%{size_download}\n' "$O/api/nope-$CB"
echo "  /x.js:"; curl -s -A "$UA" -o /dev/null -w '  %{http_code} ct=%{content_type} size=%{size_download}\n' "$O/nope-$CB.js"
echo "  /s/invalid!!:"; curl -s -A "$UA" -o http/s_invalid.html -w '  %{http_code}\n' "$O/s/inv@lid-$CB"; grep -o '<title>[^<]*</title>\|<link rel="canonical" href="[^"]*"' http/s_invalid.html | head -2
echo "  /s/unknown:"; curl -s -A "$UA" -o http/s_unknown.html -w '  %{http_code}\n' "$O/s/unknownr558"; grep -o '<title>[^<]*</title>\|<meta name="robots"[^>]*>' http/s_unknown.html | head -2

echo "== share lifecycle"
curl -s -A "$UA" -H 'content-type: application/json' -X POST "$O/api/share" \
  --data '{"items":[{"domain":"r558-audit-probe-xk3.com","status":"available"},{"domain":"google.com","status":"taken"}],"query":"r558 audit"}' -o http/share_create.json -w 'create %{http_code}\n'
cat http/share_create.json; echo
ID=$(python3 -c "import json;print(json.load(open('/home/ubuntu/r558/http/share_create.json'))['id'])")
TOKEN=$(python3 -c "import json;print(json.load(open('/home/ubuntu/r558/http/share_create.json')).get('revokeToken') or json.load(open('/home/ubuntu/r558/http/share_create.json')).get('token'))")
echo "id=$ID"
curl -s -A "$UA" "$O/api/share/$ID" -o http/share_get.json -w 'api GET %{http_code}\n'; head -c 400 http/share_get.json; echo
curl -s -A "$UA" -H 'Accept: text/html' "$O/s/$ID" -o http/share_shell_live.html -w 'shell GET %{http_code} %{size_download}B\n'; grep -o '<title>[^<]*</title>\|<meta name="robots"[^>]*>' http/share_shell_live.html | head -2
curl -s -A "$UA" -H 'Accept: text/html' "$O/s/$ID?lang=en" -o http/share_shell_live_en.html -w 'shell GET en %{http_code}\n'; grep -o '<title>[^<]*</title>' http/share_shell_live_en.html
curl -s -A "$UA" -H 'content-type: application/json' -X DELETE "$O/api/share/$ID" --data "{\"token\":\"$TOKEN\"}" -o http/share_delete.json -w 'DELETE %{http_code}\n'; cat http/share_delete.json; echo
curl -s -A "$UA" "$O/api/share/$ID" -o http/share_get_after.json -w 'api GET after %{http_code}\n'; cat http/share_get_after.json; echo
curl -s -A "$UA" -H 'Accept: text/html' "$O/s/$ID" -o http/share_shell_410.html -w 'shell GET after %{http_code}\n'; grep -o '<title>[^<]*</title>\|<meta name="robots"[^>]*>' http/share_shell_410.html | head -2
curl -s -A "$UA" -H 'Accept: text/html' "$O/s/$ID?lang=en" -o http/share_shell_410_en.html -w 'shell GET after en %{http_code}\n'; grep -o '<title>[^<]*</title>' http/share_shell_410_en.html
curl -s -A "$UA" -H 'content-type: application/json' -X DELETE "$O/api/share/$ID" --data '{"token":"wrong"}' -o /dev/null -w 'DELETE wrong-token again %{http_code}\n'
echo "$ID" > http/share_id.txt

echo "== MCP"
mcp(){ curl -s -A "$UA" -H 'content-type: application/json' -H 'accept: application/json' -X POST "$O/mcp" --data "$1" -o "http/$2.json" -w "$2 %{http_code} %{time_total}s\n"; }
mcp '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"r558","version":"1"}}}' mcp_initialize
mcp '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' mcp_tools_list
mcp '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"check_domains","arguments":{"domains":["google.com","r558-audit-probe-xk3.com","baidu.cn"]}}}' mcp_check_domains
mcp '{"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"tld_prices","arguments":{}}}' mcp_tld_prices
mcp '{"jsonrpc":"2.0","id":5,"method":"tools/call","params":{"name":"suggest_variants","arguments":{"name":"r558audit","tlds":["com","io"],"limit":6}}}' mcp_suggest_variants
mcp '{"jsonrpc":"2.0","id":6,"method":"tools/call","params":{"name":"nope","arguments":{}}}' mcp_bad_tool
python3 - <<'EOF'
import json
d=lambda n: json.load(open(f'/home/ubuntu/r558/http/{n}.json'))
i=d('mcp_initialize'); print('initialize:', i.get('result',{}).get('serverInfo'), i.get('result',{}).get('protocolVersion'))
print('tools:', [t['name'] for t in d('mcp_tools_list')['result']['tools']])
c=d('mcp_check_domains'); sc=c['result'].get('structuredContent') or json.loads(c['result']['content'][0]['text']); print('check_domains:', sc)
p=d('mcp_tld_prices'); sp=p['result'].get('structuredContent') or json.loads(p['result']['content'][0]['text']); pr=sp.get('prices'); print('tld_prices: type', type(pr).__name__, 'n=',len(pr), 'tldCount=',sp.get('tldCount'), 'com=',pr.get('com'), 'cn=',pr.get('cn'))
v=d('mcp_suggest_variants'); sv=v['result'].get('structuredContent') or json.loads(v['result']['content'][0]['text']); print('suggest_variants keys', list(sv.keys()), 'n=', len(sv.get('results',sv.get('variants',[]))), str(sv)[:300])
print('bad tool:', d('mcp_bad_tool'))
EOF
echo "== /api/check NDJSON"
curl -s -A "$UA" -H 'content-type: application/json' -X POST "$O/api/check" --data '{"domains":["google.com","r558-audit-probe-xk3.com"]}' -o http/api_check.ndjson -w 'api/check %{http_code}\n'; cat http/api_check.ndjson
echo "== /api/search exact (non-AI)"
curl -s -A "$UA" -H 'content-type: application/json' -X POST "$O/api/search" --data '{"mode":"exact","domains":["r558probe.com"]}' -o http/api_search_exact.txt -w 'api/search %{http_code} ct=%{content_type}\n'; head -c 600 http/api_search_exact.txt; echo
echo "== HTML sizes (bytes, uncompressed) sample"
for p in / '/?lang=en' /advanced /shortlist /monitors /prices /why /mcp /tld /guide /vs /tld/cn /tld/de /tld/ar /tld/uk /tld/jp '/tld/de?lang=en' /guide/saas /guide/b2b '/guide/saas?lang=en' /vs/com-vs-cn '/vs/com-vs-cn?lang=en' /vs/io-vs-dev /nope-r558; do
  printf '%-28s %s\n' "$p" "$(curl -s -A "$UA" -o /dev/null -w '%{http_code} %{size_download}' "$O$p$( [[ $p == *\?* ]] && echo '&' || echo '?')cb=$CB")"; done | tee http/html_sizes.txt
echo "== /api/search 3 domains (non-AI)"
curl -s -A "$UA" -H 'content-type: application/json' -X POST "$O/api/search" --data '{"domains":["google.com","r558-audit-probe-xk3.com","baidu.cn"]}' -o http/api_search_3.ndjson -w 'api/search 3 %{http_code} ct=%{content_type} %{time_total}s\n'; cat http/api_search_3.ndjson
echo "== /api/check refresh=1"
curl -s -A "$UA" -H 'content-type: application/json' -X POST "$O/api/check?refresh=1" --data '{"domains":["r558-audit-probe-xk3.com"],"refresh":true}' -o http/api_check_refresh.ndjson -w 'api/check refresh %{http_code} %{time_total}s\n'; cat http/api_check_refresh.ndjson
echo "== /api/monitor/list + changes"
curl -s -A "$UA" -H 'content-type: application/json' -X POST "$O/api/monitor/list" --data '{"domains":["google.com"]}' -o http/monitor_list.json -w 'monitor/list %{http_code}\n'; head -c 300 http/monitor_list.json; echo
curl -s -A "$UA" "$O/api/monitor/changes?cb=$CB" -o http/monitor_changes.json -w 'monitor/changes %{http_code}\n'; head -c 300 http/monitor_changes.json; echo
echo "== /api/stats /api/registrars"
curl -s -A "$UA" "$O/api/stats?cb=$CB" -w ' stats %{http_code}\n'; curl -s -A "$UA" "$O/api/registrars?cb=$CB" -w ' registrars %{http_code}\n'
echo "== robots / llms / indexnow key"
curl -s -A "$UA" "$O/robots.txt?cb=$CB" -o http/robots.txt -w 'robots %{http_code}\n'; cat http/robots.txt
curl -s -A "$UA" "$O/llms.txt?cb=$CB" -o http/llms.txt -w 'llms %{http_code} %{size_download}B\n'; head -5 http/llms.txt
