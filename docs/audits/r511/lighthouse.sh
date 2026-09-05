#!/usr/bin/env bash
# R511 Lighthouse: desktop + mobile × 4 URLs, headless chrome (separate from CDP Chrome)
set -u
OUT=/home/ubuntu/r511/lighthouse
mkdir -p "$OUT"
URLS=("https://hunt.zalize.com/" "https://hunt.zalize.com/tld/cn" "https://hunt.zalize.com/tld/cn?lang=en" "https://hunt.zalize.com/prices")
for u in "${URLS[@]}"; do
  slug=$(echo "$u" | sed 's#https://hunt.zalize.com/##; s#[/?=]#_#g'); [ -z "$slug" ] && slug=home
  for form in desktop mobile; do
    extra=""; [ "$form" = desktop ] && extra="--preset=desktop"
    npx --yes lighthouse "$u" $extra --only-categories=performance,accessibility,best-practices,seo \
      --output=json --output-path="$OUT/$slug-$form.json" --quiet \
      --chrome-flags="--headless=new --no-sandbox --disable-gpu" >/dev/null 2>"$OUT/$slug-$form.err"
    node -e '
      const r=require(process.argv[1]); const c=r.categories;
      const s=k=>Math.round((c[k]?.score??0)*100);
      const fails=Object.values(r.audits).filter(a=>a.score!==null&&a.score<1&&(c.seo.auditRefs.some(x=>x.id===a.id)||c.accessibility.auditRefs.some(x=>x.id===a.id))).map(a=>a.id);
      console.log(process.argv[2],process.argv[3],`perf=${s("performance")} a11y=${s("accessibility")} bp=${s("best-practices")} seo=${s("seo")}`, fails.length?"FAILS(seo/a11y)="+fails.join(","):"");
    ' "$OUT/$slug-$form.json" "$slug" "$form" 2>&1
  done
done
