#!/usr/bin/env bash
# R492/R507：对一组路径分别以 ①无头 ②Accept-Language: en ③Accept-Language: zh ④?lang=en 四种方式抓 HTML，
# 打印 <html lang> / canonical / hreflang / og:locale / Vary / Cache-Control / 正文语言（按 <title> 是否含 CJK 判定）的对照表。
# 用法：scripts/seo-audit/lang-matrix.sh [origin] [cache-buster]   （默认 http://localhost:8787；打生产时传 cb 穿透 max-age=600）
set -u
ORIGIN="${1:-http://localhost:8787}"
CB="${2:-}"
SITE="https://hunt.zalize.com"
UA="Mozilla/5.0 (compatible; DomainHunterSeoAudit/1.0; +https://github.com/wookat/domainhunter) SiteAuditBot"
PATHS=(/ /tld/cn /guide/saas /vs/com-vs-cn /prices /why /mcp /advanced /tld)

probe() { # $1=path $2=mode
  local p="$1" mode="$2" url hdr q=""
  [[ -n "$CB" ]] && q="cb=$CB"
  case "$mode" in
    bare)  url="$ORIGIN$p"; hdr="X-Probe: bare" ;;
    al-en) url="$ORIGIN$p"; hdr="Accept-Language: en-US,en;q=0.9" ;;
    al-zh) url="$ORIGIN$p"; hdr="Accept-Language: zh-CN,zh;q=0.9" ;;
    q-en)  url="$ORIGIN$p"; hdr="X-Probe: query"; q="lang=en${q:+&$q}" ;;
  esac
  [[ -n "$q" ]] && url="$url?$q"
  local out; out="$(curl -sS -D - -A "$UA" -H "$hdr" -H 'Accept: text/html' "$url")"
  local status vary cc htmllang canon hl oglocale title body_lang
  status="$(printf '%s' "$out" | head -1 | awk '{print $2}')"
  vary="$(printf '%s' "$out" | grep -i '^vary:' | sed 's/^[Vv]ary: *//' | tr -d '\r' | paste -sd'|' -)"
  cc="$(printf '%s' "$out" | grep -i '^cache-control:' | sed 's/^[Cc]ache-[Cc]ontrol: *//' | tr -d '\r' | head -1)"
  htmllang="$(printf '%s' "$out" | grep -o '<html lang="[^"]*"' | head -1 | sed 's/<html lang="//;s/"//')"
  canon="$(printf '%s' "$out" | grep -o '<link rel="canonical" href="[^"]*"' | head -1 | sed 's/.*href="//;s/"//')"
  hl="$(printf '%s' "$out" | grep -o 'hreflang="[^"]*" href="[^"]*"' | sed 's/hreflang="//;s/" href="/=/;s/"$//' | sed "s#$SITE##g" | paste -sd' ' -)"
  oglocale="$(printf '%s' "$out" | grep -o '<meta property="og:locale" content="[^"]*"' | head -1 | sed 's/.*content="//;s/"//')"
  title="$(printf '%s' "$out" | grep -o '<title>[^<]*</title>' | head -1 | sed 's/<title>//;s/<\/title>//')"
  if printf '%s' "$title" | grep -qP '[\x{4e00}-\x{9fff}]'; then body_lang=zh; else body_lang=en; fi
  printf '| `%s` | %s | %s | %s | `%s` | %s | %s | %s | `%s` | %s |\n' "$p" "$mode" "$status" "$htmllang" "${canon#"$SITE"}" "$hl" "$oglocale" "${vary:--}" "${cc:--}" "$body_lang"
}

echo "origin: $ORIGIN  ($(date -u +%FT%TZ))"
echo '| path | mode | status | html lang | canonical | hreflang | og:locale | Vary | Cache-Control | title lang |'
echo '|---|---|---|---|---|---|---|---|---|---|'
for p in "${PATHS[@]}"; do for m in bare al-en al-zh q-en; do probe "$p" "$m"; done; done
