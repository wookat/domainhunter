#!/usr/bin/env bash
# R492：对一组路径分别以 ①无头 ②Accept-Language: en ③?lang=en 三种方式抓 HTML，
# 打印 <html lang> / canonical / hreflang 数 / Vary / 正文语言（按 <title> 是否含 CJK 判定）的对照表。
# 用法：scripts/seo-audit/lang-matrix.sh [origin]   （默认 http://localhost:8787）
set -u
ORIGIN="${1:-http://localhost:8787}"
UA="Mozilla/5.0 (compatible; DomainHunterSeoAudit/1.0; +https://github.com/wookat/domainhunter) SiteAuditBot"
PATHS=(/ /tld/cn /guide/animation /vs/com-vs-cn /prices /why /mcp /advanced /tld)

probe() { # $1=path $2=mode
  local p="$1" mode="$2" url hdr body
  case "$mode" in
    bare) url="$ORIGIN$p"; hdr="X-Probe: bare" ;;
    al)   url="$ORIGIN$p"; hdr="Accept-Language: en-US,en;q=0.9" ;;
    q)    url="$ORIGIN$p?lang=en"; hdr="X-Probe: query" ;;
  esac
  local out; out="$(curl -sS -D - -A "$UA" -H "$hdr" -H 'Accept: text/html' "$url")"
  local status vary htmllang canon hl title body_lang
  status="$(printf '%s' "$out" | head -1 | awk '{print $2}')"
  vary="$(printf '%s' "$out" | grep -i '^vary:' | sed 's/^[Vv]ary: *//' | tr -d '\r' | paste -sd'|' -)"
  htmllang="$(printf '%s' "$out" | grep -o '<html lang="[^"]*"' | head -1 | sed 's/<html lang="//;s/"//')"
  canon="$(printf '%s' "$out" | grep -o '<link rel="canonical" href="[^"]*"' | head -1 | sed 's/.*href="//;s/"//')"
  hl="$(printf '%s' "$out" | grep -o 'hreflang="[^"]*" href="[^"]*"' | sed 's/hreflang="//;s/" href="/=/;s/"$//' | paste -sd' ' -)"
  title="$(printf '%s' "$out" | grep -o '<title>[^<]*</title>' | head -1 | sed 's/<title>//;s/<\/title>//')"
  if printf '%s' "$title" | grep -qP '[\x{4e00}-\x{9fff}]'; then body_lang=zh; else body_lang=en; fi
  printf '| %s | %s | %s | %s | %s | %s | %s | %s |\n' "$p" "$mode" "$status" "$htmllang" "${canon#"$ORIGIN"}" "$hl" "${vary:--}" "$body_lang"
}

echo "origin: $ORIGIN  ($(date -u +%FT%TZ))"
echo '| path | mode | status | html lang | canonical | hreflang | Vary | title lang |'
echo '|---|---|---|---|---|---|---|---|'
for p in "${PATHS[@]}"; do for m in bare al q; do probe "$p" "$m"; done; done
