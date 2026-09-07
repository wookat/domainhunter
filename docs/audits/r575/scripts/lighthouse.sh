#!/usr/bin/env bash
# R575 Lighthouse 13 mobile/desktop × 4 pages (headless Chromium; only page loads, no AI/check endpoints)
set -u
LH=/home/ubuntu/r575/tools/node_modules/.bin/lighthouse
OUT=/home/ubuntu/r575/lighthouse
CHROME_PATH=${CHROME_PATH:-$(python3 -c "import re;print(re.search(r'CHROME = \"([^\"]+)\"',open('/home/ubuntu/r575/scripts/browser_matrix.py').read()).group(1))")}
export CHROME_PATH
for entry in "home|https://hunt.zalize.com/" "monitors|https://hunt.zalize.com/monitors" "vs-de-vs-com|https://hunt.zalize.com/vs/de-vs-com" "prices|https://hunt.zalize.com/prices"; do
  name=${entry%%|*}; url=${entry#*|}
  for form in mobile desktop; do
    extra=""; [ "$form" = desktop ] && extra="--preset=desktop"
    $LH "$url" --output=json --output-path="$OUT/${name}_${form}.json" --only-categories=performance,accessibility,best-practices,seo \
      --chrome-flags="--headless=new --no-sandbox --disable-gpu" --quiet $extra > "$OUT/${name}_${form}.log" 2>&1
    echo "$name $form exit=$?"
  done
done
python3 - <<'PY'
import json,glob,os
rows=[]
for f in sorted(glob.glob('/home/ubuntu/r575/lighthouse/*.json')):
    d=json.load(open(f)); c=d['categories']
    row={'page':os.path.basename(f)[:-5],'url':d['finalDisplayedUrl'],'lhVersion':d['lighthouseVersion'],'fetchTime':d['fetchTime'],
         'performance':round(c['performance']['score']*100),'accessibility':round(c['accessibility']['score']*100),'best-practices':round(c['best-practices']['score']*100),'seo':round(c['seo']['score']*100),
         'failed_a11y':[a['id'] for a in d['audits'].values() if a.get('score')==0 and a['id'] in [r['id'] for r in c['accessibility']['auditRefs']]],
         'failed_seo':[a['id'] for a in d['audits'].values() if a.get('score')==0 and a['id'] in [r['id'] for r in c['seo']['auditRefs']]],
         'failed_bp':[a['id'] for a in d['audits'].values() if a.get('score')==0 and a['id'] in [r['id'] for r in c['best-practices']['auditRefs']]],
         'runWarnings':d.get('runWarnings',[])}
    rows.append(row); print(json.dumps(row,ensure_ascii=False))
json.dump(rows,open('/home/ubuntu/r575/lighthouse/summary.json','w'),ensure_ascii=False,indent=1)
PY
