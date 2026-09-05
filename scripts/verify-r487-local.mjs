// R487 本地并发入账自检：对一个或多个共享同一 KV 的 wrangler dev 实例并发打 N 次 /api/click，
// 等分片落盘后从 /api/usage 读回，要求 outbound.aliyun / outboundByTld.cn 精确 +N。
// 多实例 = 多 isolate（各自分片键），共享 KV 用 --persist-to 同一目录：
//   cd apps/web
//   npx wrangler dev --port 8791 --persist-to /tmp/dh-kv &
//   npx wrangler dev --port 8792 --inspector-port 9230 --persist-to /tmp/dh-kv &
//   node scripts/verify-r487-local.mjs http://127.0.0.1:8791 http://127.0.0.1:8792
// 生产直证（父会话部署后）：把 base 换成 https://hunt.zalize.com，N=12；生产 KV 最终一致，读回前等 ≥60s（脚本自动等待）。
// 0 AI 调用：只打 /api/click 与 /api/usage。
const bases = process.argv.slice(2);
if (bases.length === 0) {
  console.error("usage: node scripts/verify-r487-local.mjs <base-url> [<base-url> ...]  (env N=12 SETTLE_MS=2500)");
  process.exit(2);
}
const N = Number(process.env.N ?? 12);
const settleMs = Number(process.env.SETTLE_MS ?? (bases.some((b) => !/127\.0\.0\.1|localhost/.test(b)) ? 65_000 : 2500));
const day = new Date().toISOString().slice(0, 10);

const readUsage = async (base) => {
  const res = await fetch(`${base}/api/usage?days=1`);
  if (!res.ok) throw new Error(`${base}/api/usage ${res.status}`);
  const body = await res.json();
  const d = body.days?.[day] ?? null;
  return { aliyun: d?.outbound?.aliyun ?? 0, cn: d?.outboundByTld?.cn ?? 0 };
};

const before = await readUsage(bases[0]);
console.log(`before  ${JSON.stringify(before)}  (${bases.length} instance(s), N=${N})`);

const t0 = Date.now();
const statuses = await Promise.all(
  Array.from({ length: N }, (_, i) =>
    fetch(`${bases[i % bases.length]}/api/click`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ registrar: "aliyun", tld: "cn" }),
    }).then((r) => r.status),
  ),
);
console.log(`fired ${N} clicks in ${Date.now() - t0}ms, statuses=${[...new Set(statuses)].join(",")}`);
if (statuses.some((s) => s !== 204)) {
  console.log("FAIL: non-204 click response");
  process.exit(1);
}

await new Promise((r) => setTimeout(r, settleMs));
let failed = 0;
for (const b of bases) {
  const after = await readUsage(b);
  const ok = after.aliyun - before.aliyun === N && after.cn - before.cn === N;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"} ${b}: after ${JSON.stringify(after)} delta aliyun=${after.aliyun - before.aliyun} cn=${after.cn - before.cn} (want ${N})`);
}
console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
