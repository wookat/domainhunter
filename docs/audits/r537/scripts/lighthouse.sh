#!/usr/bin/env bash
# R537 Lighthouse: desktop + mobile on >=8 pages, 404 via snapshot mode.
set -u
export CHROME_PATH=/opt/.devin/chrome/chrome/linux-137.0.7118.2/chrome-linux64/chrome
OUT=/home/ubuntu/r537/lh; mkdir -p "$OUT"
BASE=https://hunt.zalize.com
PAGES="/ /advanced /prices /why /mcp /tld /guide /vs /tld/de /tld/uk /guide/saas /vs/com-vs-cn /vs/pizza-vs-com"
FLAGS='--chrome-flags=--headless=new --no-sandbox --disable-gpu'
for p in $PAGES; do
  slug=$(echo "$p" | sed 's#^/$#home#; s#^/##; s#/#_#g')
  for lang in zh en; do
    for form in desktop mobile; do
      preset=""; [ "$form" = desktop ] && preset="--preset=desktop"
      lighthouse "$BASE$p?lang=$lang" $preset --quiet --output=json --output-path="$OUT/${slug}_${lang}_${form}.json" \
        --only-categories=performance,accessibility,best-practices,seo "$FLAGS" >/dev/null 2>"$OUT/${slug}_${lang}_${form}.err"
      echo "done $p $lang $form rc=$?"
    done
  done
done
# 404 shell: snapshot mode (navigation mode cannot score a 404)
export NPM_GLOBAL_ROOT=$(npm root -g)
for lang in zh en; do
  for form in desktop mobile; do
    node /home/ubuntu/r537/lh_snapshot_404.mjs "$BASE/nope-r537-lh?lang=$lang" "$OUT/404_${lang}_${form}.snapshot.json" $form 2>"$OUT/404_${lang}_${form}.err"
    echo "done 404 $lang $form rc=$?"
  done
done
echo LH-DONE
