#!/usr/bin/env bash
# R551 security header matrix against production (0 AI). Output: headers/<name>.h + matrix.tsv
set -u
O=https://hunt.zalize.com
UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0 Safari/537.36 r551-audit"
mkdir -p /home/ubuntu/r551/headers
cd /home/ubuntu/r551
CB=$RANDOM$RANDOM
ASSET=$(curl -s -A "$UA" "$O/?cb=$CB" | grep -o 'assets/index-[^"]*\.js' | head -1)
CSS=$(curl -s -A "$UA" "$O/?cb=$CB" | grep -o 'assets/[^"]*\.css' | head -1)
FONT=$(curl -s -A "$UA" "$O/?cb=$CB" | grep -o '/fonts/[^")]*\.woff2' | head -1)
echo "asset=$ASSET css=$CSS font=$FONT" > headers/_discovered.txt
declare -a NAMES PATHS METHODS
add(){ NAMES+=("$1"); PATHS+=("$2"); METHODS+=("$3"); }
add home "/?cb=$CB" GET
add home_en "/?lang=en&cb=$CB" GET
add tld_cn "/tld/cn?cb=$CB" GET
add vs_com_cn "/vs/com-vs-cn?lang=en&cb=$CB" GET
add guide_saas "/guide/saas?cb=$CB" GET
add shortlist "/shortlist?cb=$CB" GET
add mcp_doc "/mcp?cb=$CB" GET
add nf_shell "/does-not-exist-r551?cb=$CB" GET
add s_nf "/s/nope-r551?cb=$CB" GET
add api_usage "/api/usage?days=1&cb=$CB" GET
add api_prices "/api/prices?cb=$CB" GET
add api_stats "/api/stats?cb=$CB" GET
add api_registrars "/api/registrars?cb=$CB" GET
add api_nf "/api/nope-r551?cb=$CB" GET
add mcp_post "/mcp" POST
add sitemap "/sitemap.xml?cb=$CB" GET
add robots "/robots.txt?cb=$CB" GET
add llms "/llms.txt?cb=$CB" GET
add og_tld "/api/og/tld/cn?cb=$CB" GET
add asset_js "/$ASSET" GET
add asset_css "/$CSS" GET
add favicon "/favicon.svg" GET
add font "$FONT" GET
add wx_share "/wx-share.png" GET
add nope_png "/nope-r551.png" GET
HDRS=(strict-transport-security x-content-type-options referrer-policy x-frame-options permissions-policy content-security-policy-report-only content-security-policy content-type cache-control vary access-control-allow-origin cross-origin-opener-policy)
{
printf 'name\tpath\tstatus'; for h in "${HDRS[@]}"; do printf '\t%s' "$h"; done; printf '\n'
for i in "${!NAMES[@]}"; do
  n=${NAMES[$i]}; p=${PATHS[$i]}; m=${METHODS[$i]}
  if [ "$m" = POST ]; then
    curl -s -D headers/$n.h -o headers/$n.body -A "$UA" -H 'content-type: application/json' -H 'accept: application/json' --data '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' "$O$p"
  else
    curl -s -D headers/$n.h -o headers/$n.body -A "$UA" "$O$p"
  fi
  st=$(head -1 headers/$n.h | awk '{print $2}')
  printf '%s\t%s\t%s' "$n" "$p" "$st"
  for h in "${HDRS[@]}"; do
    v=$(grep -i "^$h:" headers/$n.h | head -1 | cut -d' ' -f2- | tr -d '\r')
    if [ -z "$v" ]; then v='-'; fi
    if [ "$h" = content-security-policy-report-only ] && [ "$v" != '-' ]; then v="present(nonce=$(echo "$v" | grep -o "'nonce-[^']*'" | wc -l),report-uri=$(echo "$v" | grep -o 'report-uri [^;]*'))"; fi
    if [ "$h" = permissions-policy ] && [ "$v" != '-' ]; then v="present($(echo "$v" | tr -cd '=' | wc -c) features)"; fi
    printf '\t%s' "$v"
  done
  printf '\n'
done
} > matrix.tsv
column -t -s $'\t' matrix.tsv
