#!/bin/bash
# R558 Lighthouse: mobile + desktop, a11y/SEO/BP/perf on 4 pages (home, /vs/de-vs-com, /tld/de, /prices). Zero AI.
LH=/home/ubuntu/r558/tools/node_modules/.bin/lighthouse
OUT=/home/ubuntu/r558/lighthouse
export CHROME_PATH=/opt/.devin/chrome/chrome/linux-137.0.7118.2/chrome-linux64/chrome
pages="/ /vs/de-vs-com /tld/de /prices"
for p in $pages; do
  n=$(echo "$p" | sed 's#^/$#home#; s#^/##; s#/#_#g')
  $LH "https://hunt.zalize.com$p" --preset=desktop --only-categories=performance,seo,accessibility,best-practices --chrome-flags="--headless=new --no-sandbox" --output=json --output-path="$OUT/desktop_$n.json" --quiet
  echo "done desktop $p"
  $LH "https://hunt.zalize.com$p" --only-categories=performance,seo,accessibility,best-practices --chrome-flags="--headless=new --no-sandbox" --output=json --output-path="$OUT/mobile_$n.json" --quiet
  echo "done mobile $p"
done
echo ALLDONE
