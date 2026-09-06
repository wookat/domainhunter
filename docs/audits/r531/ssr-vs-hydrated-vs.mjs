// R531: compare /vs pick-card price text: SSR (curl-equivalent fetch) vs hydrated DOM (Chrome via CDP) vs /api/prices
// usage: node ssr_vs_dom.mjs <base> <path?lang=..> ...
const base = process.argv[2];
const paths = process.argv.slice(3);
const CDP = "http://localhost:29229";
const PICK_RE = /<p class="tnum mt-1 text-xs text-txt2">([^<]*)<\/p>/g;
const unescape = (s) => s.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const toCny = (usd) => Math.round(usd * 7.2);

const api = await (await fetch(`${base}/api/prices`, { headers: { "user-agent": "Mozilla/5.0" } })).json();

function expected(tld, lang) {
  const p = api.prices[tld];
  if (!p) return null; // static fallback expected
  return lang === "en"
    ? `Porkbun live: $${p.registration} 1st yr (≈¥${toCny(p.registration)}) · renews $${p.renewal}/yr (¥ est. at 7.2)`
    : `Porkbun 实时价：首年 $${p.registration}（≈¥${toCny(p.registration)}）· 续费 $${p.renewal}/年（汇率 7.2 估算）`;
}

async function cdp(url, fn) {
  const target = await (await fetch(`${CDP}/json/new?about:blank`, { method: "PUT" })).json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0;
  const pending = new Map();
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) {
      pending.get(m.id)(m);
      pending.delete(m.id);
    }
  };
  const send = (method, params = {}) =>
    new Promise((res) => {
      const i = ++id;
      pending.set(i, res);
      ws.send(JSON.stringify({ id: i, method, params }));
    });
  const evaluate = async (expr) => (await send("Runtime.evaluate", { expression: expr, returnByValue: true })).result?.result?.value;
  try {
    await send("Page.enable");
    await send("Page.navigate", { url });
    const t0 = Date.now();
    // wait for React mount (root has data-hydrated children beyond the SSR skeleton): poll until the price <p> exists and settle 2.5s for any late /api/prices re-render
    while (Date.now() - t0 < 15000) {
      const n = await evaluate(`document.querySelectorAll('p.tnum.mt-1.text-xs.text-txt2').length`);
      const ready = await evaluate(`!!document.querySelector('#root [data-dh-hydrated], #root main') && document.readyState === 'complete'`);
      if (n >= 2 && ready) break;
      await new Promise((r) => setTimeout(r, 200));
    }
    await new Promise((r) => setTimeout(r, 2500));
    return await fn(evaluate);
  } finally {
    ws.close();
    await fetch(`${CDP}/json/close/${target.id}`);
  }
}

let fail = 0;
const out = [];
for (const p of paths) {
  const lang = /lang=en/.test(p) ? "en" : "zh";
  const slug = p.match(/\/vs\/([^?]+)/)[1];
  const [a, b] = slug.split("-vs-");
  const html = await (await fetch(`${base}${p}&cb=${Date.now()}`, { headers: { "user-agent": "Mozilla/5.0", accept: "text/html" } })).text();
  const ssr = [...html.matchAll(PICK_RE)].map((m) => unescape(m[1]));
  const dom = await cdp(`${base}${p}`, async (evaluate) => {
    const isHydrated = await evaluate(`document.querySelector('#root main') !== null && !!document.querySelector('#root h1')`);
    const texts = await evaluate(`[...document.querySelectorAll('p.tnum.mt-1.text-xs.text-txt2')].map(e => e.textContent)`);
    const reactMounted = await evaluate(`Object.keys(document.querySelector('#root').firstElementChild || {}).some(k => k.startsWith('__react'))`);
    return { texts, isHydrated, reactMounted };
  });
  const exp = [expected(a, lang), expected(b, lang)];
  const same = JSON.stringify(ssr) === JSON.stringify(dom.texts);
  const matchesApi = exp.every((e, i) => (e === null ? /静态参考价|Static reference/.test(ssr[i] ?? "") : ssr[i] === e));
  const ok = same && matchesApi && dom.reactMounted && ssr.length === 2;
  if (!ok) fail++;
  out.push({ path: p, ok, reactMounted: dom.reactMounted, ssr, dom: dom.texts, expectedFromApi: exp });
  console.log(`${ok ? "PASS" : "FAIL"} ${p}  ssr==dom:${same} ==api:${matchesApi} reactMounted:${dom.reactMounted}`);
  for (let i = 0; i < 2; i++) console.log(`   [${i === 0 ? a : b}] SSR: ${ssr[i]}\n        DOM: ${dom.texts[i]}\n        API: ${exp[i] ?? "(no live price → static fallback expected)"}`);
}
await import("node:fs").then((fs) => fs.writeFileSync("/home/ubuntu/r531/ssr_vs_dom.json", JSON.stringify({ base, apiFetchedAt: api.fetchedAt, results: out }, null, 2)));
console.log(`\n${paths.length - fail}/${paths.length} passed`);
process.exit(fail ? 1 : 0);
