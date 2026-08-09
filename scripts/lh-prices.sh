#!/bin/bash
# usage: lh-prices.sh <label> [runs]
label=${1:-run}; runs=${2:-5}
mkdir -p /tmp/lh
for i in $(seq 1 $runs); do
  lighthouse http://localhost:8787/prices --only-categories=performance --form-factor=mobile --screenEmulation.mobile --throttling-method=simulate \
    --chrome-flags="--headless=new --no-sandbox" --output=json --output-path=/tmp/lh/$label-$i.json --quiet > /dev/null 2>&1
  node -e "const r=require('/tmp/lh/$label-$i.json');console.log('$label run $i: perf', Math.round(r.categories.performance.score*100), 'LCP', r.audits['largest-contentful-paint'].displayValue, 'TBT', r.audits['total-blocking-time'].displayValue, 'CLS', r.audits['cumulative-layout-shift'].displayValue, 'FCP', r.audits['first-contentful-paint'].displayValue, 'SI', r.audits['speed-index'].displayValue)"
done
