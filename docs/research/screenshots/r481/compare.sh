#!/usr/bin/env bash
# R481 本地字节级对比：base(8a03a35) vs 新代码（无 vars）vs 新代码（有 vars）
# 用法：BASE=http://127.0.0.1:8791 NEW=http://127.0.0.1:8792 CFG=http://127.0.0.1:8793 bash compare.sh
set -u
BASE=${BASE:-http://127.0.0.1:8791}; NEW=${NEW:-http://127.0.0.1:8792}; CFG=${CFG:-http://127.0.0.1:8793}
OUT=${OUT:-/tmp/r481-cmp}; mkdir -p "$OUT"
PATHS="/ /tld/com /tld /guide/ai-startup /vs/com-vs-cn /prices /why /mcp /advanced /shortlist /s/abc123 /no-such-page"
# base 与新代码的构建产物 hash / 内联 tailwind CSS 必然不同（App.tsx 新增页脚类名），归一化后比较其余全部字节
norm() { perl -0777 -pe 's#/assets/[A-Za-z0-9_.-]+-[A-Za-z0-9_-]{8}\.(js|css)#/assets/X.$1#g; s#<style>.*?</style>#<style>X</style>#gs'; }
UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
printf "%-16s %-6s %-14s %-14s %-10s %s\n" path status "base==new(norm)" "new==cfg-inj" injected notes
for p in $PATHS; do
  f=$(echo "$p" | tr '/' '_'); [ "$f" = "_" ] && f=_root
  curl -s -A "$UA" -H "accept: text/html" -o "$OUT/base$f.html" -w "%{http_code}" "$BASE$p" > "$OUT/base$f.code"
  curl -s -A "$UA" -H "accept: text/html" -o "$OUT/new$f.html" -w "%{http_code}" "$NEW$p" > "$OUT/new$f.code"
  curl -s -A "$UA" -H "accept: text/html" -o "$OUT/cfg$f.html" "$CFG$p"
  code=$(cat "$OUT/new$f.code")
  if diff <(norm < "$OUT/base$f.html") <(norm < "$OUT/new$f.html") > /dev/null; then bn=SAME; else bn=DIFF; fi
  # cfg 去掉注入片段后应与 new 逐字节相同
  stripped=$(sed -E 's#<meta name="google-site-verification" content="[^"]*" /><meta name="msvalidate.01" content="[^"]*" /><script type="module" src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon=.\{"token":"[a-f0-9]{32}"\}.></script>##' "$OUT/cfg$f.html")
  if [ "$stripped" = "$(cat "$OUT/new$f.html")" ]; then nc=SAME; else nc=DIFF; fi
  inj=$(grep -c "data-cf-beacon" "$OUT/cfg$f.html"); ninj=$(grep -c "data-cf-beacon\|site-verification\|msvalidate" "$OUT/new$f.html")
  printf "%-16s %-6s %-14s %-14s %-10s new-has-inject=%s\n" "$p" "$code" "$bn" "$nc" "$inj" "$ninj"
done
echo "--- non-HTML must be untouched (cfg vs new):"
for p in /api/usage?days=1 /sitemap.xml /robots.txt /llms.txt /024aa6c6f88245bbacdac2f60a94e333.txt /manifest.webmanifest; do
  a=$(curl -s "$NEW$p" | sed -E 's/"pageviews":\{[^}]*\}|"bots(By)?":[^,}]*|"cronLast":[0-9]+//g' | md5sum | cut -c1-8)
  b=$(curl -s "$CFG$p" | sed -E 's/"pageviews":\{[^}]*\}|"bots(By)?":[^,}]*|"cronLast":[0-9]+//g' | md5sum | cut -c1-8)
  ct=$(curl -s -o /dev/null -w "%{content_type}" "$CFG$p")
  g=$(curl -s "$CFG$p" | grep -c "cloudflareinsights\|site-verification" )
  printf "%-45s %-30s md5 new=%s cfg=%s inject-hits=%s\n" "$p" "$ct" "$a" "$b" "$g"
done
