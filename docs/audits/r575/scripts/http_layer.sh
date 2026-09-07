#!/usr/bin/env bash
# R575 HTTP-layer audit (0 AI): sitemap, 404/410 shells, share lifecycle (+403/400 token checks on live share), MCP 4 tools,
# /api/search 3 domains, /api/prices, 1x /api/check?refresh=1, monitor list/changes, webhook HTTPS validation (400), robots/llms.
# Budget note: /api/check + MCP check_domains + MCP suggest_variants share the 20/h IP bucket with /api/ai-search (worker.ts checkRateLimit).
set -u
O=https://hunt.zalize.com
UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0 Safari/537.36 r575-audit"
cd /home/ubuntu/r575; mkdir -p http
CB=$RANDOM$RANDOM
J='content-type: application/json'
echo "== start $(date -u +%FT%TZ)"
echo "== sitemap"
curl -s -A "$UA" "$O/sitemap.xml?cb=$CB" -o http/sitemap.xml
python3 - <<'EOF'
import re
from collections import Counter
x=open('/home/ubuntu/r575/http/sitemap.xml').read()
locs=re.findall(r'<loc>([^<]+)</loc>',x)
c=Counter()
for l in locs:
    p=l.replace('https://hunt.zalize.com','')
    if p.startswith('/tld/'): c['tld']+=1
    elif p.startswith('/guide/'): c['guide']+=1
    elif p.startswith('/vs/'): c['vs']+=1
    else: c['static:'+p]+=1
print('total',len(locs),'unique',len(set(locs)))
print(dict(c))
print('alt links', x.count('xhtml:link'), 'hreflang en', x.count('hreflang="en"'), 'lang=en in loc', sum('lang=en' in l for l in locs))
EOF
echo "== content-counts.json"; python3 -c "import json;d=json.load(open('/home/ubuntu/repos/domainhunter/scripts/content-counts.json'));print({k:v['count'] for k,v in d.items()})"

echo "== 404 shell"
for acc in 'text/html' 'application/json' 'image/png'; do
  st=$(curl -s -A "$UA" -H "Accept: $acc" -o http/nf_$(echo $acc|tr -c 'a-z' _).html -w '%{http_code} %{content_type} %{size_download}' "$O/nope-r575-$CB?cb=$CB"); echo "  Accept:$acc -> $st"; done
grep -o '<title>[^<]*</title>\|<meta name="robots"[^>]*>\|<html lang="[^"]*"' http/nf_text_html.html | head -3
st=$(curl -s -A "$UA" -H 'Accept: text/html' -o http/nf_en.html -w '%{http_code}' "$O/nope-r575-$CB?lang=en&cb=$CB"); echo "  en 404 -> $st"; grep -o '<title>[^<]*</title>\|<html lang="[^"]*"\|<meta name="robots"[^>]*>' http/nf_en.html | head -3
echo "  /api/nope:"; curl -s -A "$UA" -o /dev/null -w '  %{http_code} ct=%{content_type} size=%{size_download}\n' "$O/api/nope-$CB"
echo "  /s/invalid:"; curl -s -A "$UA" -o http/s_invalid.html -w '  %{http_code}\n' "$O/s/inv@lid-$CB"; grep -o '<title>[^<]*</title>\|<meta name="robots"[^>]*>' http/s_invalid.html | head -2
echo "  /s/unknown:"; curl -s -A "$UA" -o http/s_unknown.html -w '  %{http_code}\n' "$O/s/unknownr575"; grep -o '<title>[^<]*</title>\|<meta name="robots"[^>]*>' http/s_unknown.html | head -2

echo "== share lifecycle"
curl -s -A "$UA" -H "$J" -X POST "$O/api/share" \
  --data '{"items":[{"domain":"r575-audit-probe-qz7.com","status":"available"},{"domain":"google.com","status":"taken"},{"domain":"r575-audit-probe-qz7.ai","status":"unknown"}],"query":"r575 audit"}' -o http/share_create.json -w 'create %{http_code}\n'
ID=$(python3 -c "import json;print(json.load(open('/home/ubuntu/r575/http/share_create.json'))['id'])")
TOKEN=$(python3 -c "import json;print(json.load(open('/home/ubuntu/r575/http/share_create.json'))['revokeToken'])")
echo "id=$ID token_len=${#TOKEN}"
curl -s -A "$UA" "$O/api/share/$ID" -o http/share_get.json -w 'api GET %{http_code}\n'; head -c 400 http/share_get.json; echo
curl -s -A "$UA" -H 'Accept: text/html' "$O/s/$ID" -o http/share_shell_live.html -w 'shell GET %{http_code} %{size_download}B\n'; grep -o '<title>[^<]*</title>\|<meta name="robots"[^>]*>\|<html lang="[^"]*"\|<meta property="og:locale" content="[^"]*"' http/share_shell_live.html | head -4
curl -s -A "$UA" -H 'Accept: text/html' "$O/s/$ID?lang=en" -o http/share_shell_live_en.html -w 'shell GET en %{http_code}\n'; grep -o '<title>[^<]*</title>\|<html lang="[^"]*"\|<meta property="og:locale" content="[^"]*"' http/share_shell_live_en.html | head -3
curl -s -A "$UA" -H "$J" -X DELETE "$O/api/share/$ID" --data '{"token":"wrong"}' -o http/share_delete_wrong.json -w 'DELETE wrong-token (live) %{http_code}\n'; cat http/share_delete_wrong.json; echo
curl -s -A "$UA" -H "$J" -X DELETE "$O/api/share/$ID" --data '{}' -o http/share_delete_notoken.json -w 'DELETE no-token (live) %{http_code}\n'; cat http/share_delete_notoken.json; echo
curl -s -A "$UA" "$O/api/share/$ID" -o /dev/null -w 'api GET still live %{http_code}\n'
curl -s -A "$UA" -H "$J" -X DELETE "$O/api/share/$ID" --data "{\"token\":\"$TOKEN\"}" -o http/share_delete.json -w 'DELETE %{http_code}\n'; cat http/share_delete.json; echo
curl -s -A "$UA" "$O/api/share/$ID" -o http/share_get_after.json -w 'api GET after %{http_code}\n'; cat http/share_get_after.json; echo
curl -s -A "$UA" -H 'Accept: text/html' "$O/s/$ID" -o http/share_shell_410.html -w 'shell GET after %{http_code}\n'; grep -o '<title>[^<]*</title>\|<meta name="robots"[^>]*>' http/share_shell_410.html | head -2
curl -s -A "$UA" -H 'Accept: text/html' "$O/s/$ID?lang=en" -o http/share_shell_410_en.html -w 'shell GET after en %{http_code}\n'; grep -o '<title>[^<]*</title>\|<meta name="robots"[^>]*>' http/share_shell_410_en.html | head -2
echo "$ID" > http/share_id.txt
python3 - <<'EOF'
import json,re
p='/home/ubuntu/r575/http/share_create.json'; d=json.load(open(p)); d['revokeToken']='REDACTED'; json.dump(d,open(p,'w'))
EOF

echo "== MCP"
mcp(){ curl -s -A "$UA" -H "$J" -H 'accept: application/json' -X POST "$O/mcp" --data "$1" -o "http/$2.json" -w "$2 %{http_code} %{time_total}s\n"; }
mcp '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"r575","version":"1"}}}' mcp_initialize
mcp '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' mcp_tools_list
mcp '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"check_domains","arguments":{"domains":["google.com","r575-audit-probe-qz7.com","baidu.cn"]}}}' mcp_check_domains
mcp '{"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"tld_prices","arguments":{}}}' mcp_tld_prices
mcp '{"jsonrpc":"2.0","id":5,"method":"tools/call","params":{"name":"suggest_variants","arguments":{"name":"r575audit","tlds":["com","io"],"limit":6}}}' mcp_suggest_variants
python3 - <<'EOF'
import json
d=lambda n: json.load(open(f'/home/ubuntu/r575/http/{n}.json'))
i=d('mcp_initialize'); print('initialize:', i.get('result',{}).get('serverInfo'), i.get('result',{}).get('protocolVersion'))
print('tools:', [t['name'] for t in d('mcp_tools_list')['result']['tools']])
c=d('mcp_check_domains'); sc=c['result'].get('structuredContent') or json.loads(c['result']['content'][0]['text']); print('check_domains:', sc)
p=d('mcp_tld_prices'); sp=p['result'].get('structuredContent') or json.loads(p['result']['content'][0]['text']); pr=sp.get('prices'); print('tld_prices: n=',len(pr), 'tldCount=',sp.get('tldCount'), 'com=',pr.get('com'), 'cn=',pr.get('cn'), 'keys', [k for k in sp if k!='prices'])
v=d('mcp_suggest_variants'); sv=v['result'].get('structuredContent') or json.loads(v['result']['content'][0]['text']); print('suggest_variants keys', list(sv.keys()), str(sv)[:400])
EOF
echo "== /api/search 3 domains (non-AI)"
curl -s -A "$UA" -H "$J" -X POST "$O/api/search" --data '{"domains":["google.com","r575-audit-probe-qz7.com","baidu.cn"]}' -o http/api_search_3.ndjson -w 'api/search 3 %{http_code} ct=%{content_type} %{time_total}s\n'; cat http/api_search_3.ndjson
echo "== /api/check refresh=1 (1 of budget 10)"
curl -s -A "$UA" -H "$J" -X POST "$O/api/check?refresh=1" --data '{"domains":["r575-audit-probe-qz7.com"],"refresh":true}' -o http/api_check_refresh.ndjson -w 'api/check refresh %{http_code} %{time_total}s\n'; cat http/api_check_refresh.ndjson
echo "== /api/prices"
curl -s -A "$UA" -D http/api_prices.h "$O/api/prices?cb=$CB" -o http/api_prices.json -w 'prices %{http_code}\n'; python3 -c "import json;d=json.load(open('/home/ubuntu/r575/http/api_prices.json'));print({k:(v if not isinstance(v,(dict,list)) else len(v)) for k,v in d.items()}); print('cn',d['prices'].get('cn'),'com.cn',d['prices'].get('com.cn'),'com',d['prices'].get('com'))"
echo "== /api/monitor/list + changes"
curl -s -A "$UA" -H "$J" -X POST "$O/api/monitor/list" --data '{"domains":["google.com","r575-audit-probe-qz7.com"]}' -o http/monitor_list.json -w 'monitor/list %{http_code}\n'; cat http/monitor_list.json; echo
curl -s -A "$UA" "$O/api/monitor/changes?cb=$CB" -o http/monitor_changes.json -w 'monitor/changes %{http_code}\n'; head -c 300 http/monitor_changes.json; echo
echo "== webhook-test validation (no delivery: invalid scheme / host)"
curl -s -A "$UA" -H "$J" -X POST "$O/api/monitor/webhook-test" --data '{"webhook":"http://example.com/hook"}' -o http/webhook_http_scheme.json -D http/webhook_http_scheme.h -w 'webhook-test http:// %{http_code}\n'; cat http/webhook_http_scheme.json; echo
curl -s -A "$UA" -H "$J" -X POST "$O/api/monitor/webhook-test" --data '{"webhook":"ftp://example.com/hook"}' -o http/webhook_ftp_scheme.json -w 'webhook-test ftp:// %{http_code}\n'; cat http/webhook_ftp_scheme.json; echo
curl -s -A "$UA" -H "$J" -X POST "$O/api/monitor/webhook-test" --data '{"webhook":"not a url"}' -o http/webhook_garbage.json -w 'webhook-test garbage %{http_code}\n'; cat http/webhook_garbage.json; echo
curl -s -A "$UA" -H "$J" -X POST "$O/api/monitor/webhook-test" --data '{}' -o http/webhook_missing.json -w 'webhook-test missing %{http_code}\n'; cat http/webhook_missing.json; echo
echo "== /api/stats /api/registrars"
curl -s -A "$UA" "$O/api/stats?cb=$CB" -w ' stats %{http_code}\n'; curl -s -A "$UA" "$O/api/registrars?cb=$CB" -w ' registrars %{http_code}\n'
echo "== robots / llms"
curl -s -A "$UA" "$O/robots.txt?cb=$CB" -o http/robots.txt -w 'robots %{http_code}\n'; cat http/robots.txt
curl -s -A "$UA" "$O/llms.txt?cb=$CB" -o http/llms.txt -w 'llms %{http_code} %{size_download}B\n'; head -3 http/llms.txt
echo "== end $(date -u +%FT%TZ)"
