#!/bin/bash
# R551 Lighthouse batch: desktop a11y/SEO/BP on 10 pages + mobile perf(CLS) on /prices. Zero AI (no /api/ai-search).
LH=/home/ubuntu/r551/tools/node_modules/.bin/lighthouse
OUT=/home/ubuntu/r551/lighthouse
export CHROME_PATH=/opt/.devin/chrome/chrome/linux-137.0.7118.2/chrome-linux64/chrome
pages="/ /advanced /prices /why /mcp /tld /guide /vs /tld/de /vs/uk-vs-com"
for p in $pages; do
  n=$(echo "$p" | sed 's#^/$#home#; s#^/##; s#/#_#g')
  $LH "https://hunt.zalize.com$p" --preset=desktop --only-categories=seo,accessibility,best-practices --chrome-flags="--headless=new --no-sandbox" --output=json --output-path="$OUT/desktop_$n.json" --quiet
  echo "done desktop $p"
done
$LH "https://hunt.zalize.com/prices" --only-categories=performance,seo,accessibility,best-practices --chrome-flags="--headless=new --no-sandbox" --output=json --output-path="$OUT/mobile_prices.json" --quiet
$LH "https://hunt.zalize.com/prices?lang=en" --only-categories=performance --chrome-flags="--headless=new --no-sandbox" --output=json --output-path="$OUT/mobile_prices_en.json" --quiet
echo ALLDONE
