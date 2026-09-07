#!/bin/bash
# R507 canonical matrix: 5 paths x {zh-CN,en-US} x {bare, ?lang=en}
OUT=/home/ubuntu/r511/canonical
mkdir -p $OUT
BASE=https://hunt.zalize.com
printf "%-22s %-6s %-9s %-4s %-6s %-60s %-40s %s\n" path al qs http lang canonical vary hreflang
for p in / /tld/cn /guide/cn-realname /vs/com-vs-cn /prices; do
  for al in zh-CN en-US; do
    for qs in "" "?lang=en"; do
      url="$BASE$p$qs"
      f="$OUT/$(echo "${p}_${al}_${qs:-bare}" | tr '/?=' '___').html"
      code=$(curl -s -A "Mozilla/5.0 r511-audit" -H "Accept-Language: $al" -D "$f.hdr" -o "$f" -w '%{http_code}' "$url")
      lang=$(grep -o '<html[^>]*lang="[^"]*"' "$f" | head -1 | sed 's/.*lang="//;s/"//')
      canon=$(grep -o '<link rel="canonical" href="[^"]*"' "$f" | head -1 | sed 's/.*href="//;s/"//')
      vary=$(grep -i '^vary:' "$f.hdr" | tr -d '\r' | sed 's/^[Vv]ary: //')
      hl=$(grep -o '<link rel="alternate" hreflang="[^"]*" href="[^"]*"' "$f" | sed 's/<link rel="alternate" hreflang="//;s/" href="/=/;s/"//' | tr '\n' ' ')
      printf "%-22s %-6s %-9s %-4s %-6s %-60s %-40s %s\n" "$p" "$al" "${qs:-bare}" "$code" "$lang" "$canon" "$vary" "$hl"
    done
  done
done
