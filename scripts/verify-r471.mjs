// R471 AI 上游不可用时的规则降级 + 服务端熔断自检脚本（无测试框架，独立 node 脚本，0 真实 AI 调用，全部 mock fetch）
// 用法：node scripts/verify-r471.mjs
// 覆盖：
//   A. rule-fallback 纯函数：zh 描述取 2 字词拼音（多音/表外字放弃）+ ASCII 词、en 描述去停用词；候选 theme=rule、
//      meaning 含「规则生成」/「Rule-based」、去重、上限 24、排除集生效、复用 VARIANT_PREFIXES/SUFFIXES；LLM 输出 theme:"rule" 不被接受
//   B. worker /api/ai-search quota（429 quota-exhausted 体）→ fallback 事件 {type,round,reason:"quota",count≥1}，规则候选走同一
//      proposed→result→proposed(guard)→done 流水，KV 写入熔断键（TTL 300s），usage.aiErrors.quota=1、usage.fallbacks.quota=1
//   C. 熔断命中：/chat/completions 0 次调用（候选与 understanding 两路都不打），reason="quota-breaker"，无 understanding 事件
//   D. rate-limit（普通 429）→ 降级 reason="rate-limit" 但不写熔断；upstream(500)/network(TypeError) 同样降级；401 → quota 写熔断
//   E. 熔断键过期值不生效；成功路径无 fallback 事件、事件结构不变；/api/usage 透出 fallbacks
import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const webRequire = createRequire(path.join(root, "apps/web/package.json"));
const viteRequire = createRequire(webRequire.resolve("vite/package.json"));
const { build } = viteRequire("esbuild");
const tmpRule = path.join(root, "scripts/.rule-r471-compiled.mjs");
const tmpWorker = path.join(root, "scripts/.worker-r471-compiled.mjs");
const stubSockets = {
  name: "stub-cloudflare-sockets",
  setup(b) {
    b.onResolve({ filter: /^cloudflare:sockets$/ }, () => ({ path: "cloudflare:sockets", namespace: "stub" }));
    b.onLoad({ filter: /.*/, namespace: "stub" }, () => ({ contents: 'export const connect = () => { throw new Error("no-sockets-in-test"); };' }));
  },
};
await build({
  stdin: {
    contents: 'export * from "./apps/web/src/rule-fallback"; export { newGuardStats, generateAiCandidates, AI_THEMES } from "./apps/web/src/ai"; export { VARIANT_PREFIXES, VARIANT_SUFFIXES } from "./apps/web/src/lib/variants";',
    resolveDir: root,
    loader: "ts",
  },
  bundle: true,
  format: "esm",
  outfile: tmpRule,
  logLevel: "silent",
});
await build({
  entryPoints: [path.join(root, "apps/web/src/worker.ts")],
  bundle: true,
  format: "esm",
  platform: "node",
  outfile: tmpWorker,
  plugins: [stubSockets],
  logLevel: "silent",
});
const rule = await import(tmpRule);
const workerMod = await import(tmpWorker);
const worker = workerMod.default;
const { LLM_BREAKER_KEY, LLM_BREAKER_TTL_S } = workerMod;
rmSync(tmpRule);
rmSync(tmpWorker);

let failed = 0;
const check = (name, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) {
    failed++;
    console.log(`FAIL ${name}: got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)}`);
  } else {
    console.log(`PASS ${name}`);
  }
};

const ZH_MARK = /规则生成/;
const EN_MARK = /rule-based/i;
const LABEL_RE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

// ---------- A. 规则生成纯函数 ----------
{
  check("A0 worker 导出熔断常量", [LLM_BREAKER_KEY, LLM_BREAKER_TTL_S], ["dh:llm-breaker:v1", 300]);
  check("A0b 'rule' 不在 LLM 可声明的 theme 白名单内", rule.AI_THEMES.has("rule"), false);

  // zh：2 字词拼音（云端/记账 唯一读音）；「中小商家」为泛词被停用；多音字（长/行/重）放弃
  const zhRoots = rule.extractRuleRoots("面向中小商家的云端记账工具");
  check("A1 zh 根词取 2 字词拼音", zhRoots.map((r) => r.text), ["yunduan", "jizhang"]);
  check("A1b zh 根词带汉字来源", zhRoots.map((r) => r.hanzi), ["云端", "记账"]);
  check("A1c 多音字 2 字词放弃（长行）", rule.extractPinyinRoots("长行").length, 0);
  check("A1d 表外字放弃（龘靐）", rule.extractPinyinRoots("龘靐工具").length, 0);
  // zh 描述里已有的 ASCII 词也纳入
  const mixRoots = rule.extractRuleRoots("给设计师用的 mockup 工具，云端协作");
  check("A2 zh 描述含 ASCII 词：拼音 + ASCII 交错", mixRoots.map((r) => [r.kind, r.text]), [["pinyin", "sheji"], ["ascii", "mockup"], ["pinyin", "yunduan"], ["pinyin", "xiezuo"]]);

  // en：去停用词 + 泛词，取核心词
  const enRoots = rule.extractRuleRoots("a note taking app for developers");
  check("A3 en 根词去停用词/泛词", enRoots.map((r) => r.text), ["note", "taking", "developers"]);
  check("A3b en 全停用词 → 0 根词", rule.extractRuleRoots("the and for with").length, 0);

  const g = rule.newGuardStats();
  const zh = rule.generateRuleCandidates("面向中小商家的云端记账工具", "zh", g);
  check("A4 zh 降级候选 ≥ 1 且 ≤ 24", [zh.length >= 1, zh.length <= rule.RULE_FALLBACK_MAX_LABELS], [true, true]);
  check("A4b 全部 theme=rule", zh.every((c) => c.theme === "rule"), true);
  check("A4c 全部 meaning 含「规则生成」", zh.every((c) => ZH_MARK.test(c.meaning)), true);
  check("A4d label 去重且合法字符", [new Set(zh.map((c) => c.label)).size === zh.length, zh.every((c) => LABEL_RE.test(c.label))], [true, true]);
  check("A4e 根词本身优先（yunduan/jizhang 在前两位）", zh.slice(0, 2).map((c) => c.label), ["yunduan", "jizhang"]);
  const labels = new Set(zh.map((c) => c.label));
  check("A4f 含两词拼接", labels.has("yunduanjizhang") || labels.has("jizhangyunduan"), true);
  check("A4g 含 VARIANT_SUFFIXES 组合", rule.VARIANT_SUFFIXES.some((s) => labels.has(`yunduan${s}`)), true);
  check("A4h 含 VARIANT_PREFIXES 组合", rule.VARIANT_PREFIXES.some((p) => labels.has(`${p}yunduan`)), true);
  check("A4i 组合类 meaning 说明由 X + Y 组成", zh.find((c) => c.label === `yunduan${rule.VARIANT_SUFFIXES[0]}`)?.meaning.includes(" + "), true);
  check("A4j 防线未丢弃任何规则候选（模板不撞既有 admit 规则）", Object.values(g.dropped).reduce((a, b) => a + b, 0), 0);
  check("A4k 全部带 scores 四维", zh.every((c) => ["length", "readability", "relevance", "brandability"].every((k) => Number.isFinite(c.scores?.[k]))), true);

  const en = rule.generateRuleCandidates("a note taking app for developers", "en", rule.newGuardStats());
  check("A5 en 降级候选 ≥ 1、theme=rule、meaning 含 Rule-based", [en.length >= 1, en.every((c) => c.theme === "rule"), en.every((c) => EN_MARK.test(c.meaning))], [true, true, true]);
  check("A5b en 含两词拼接 notetaking", en.some((c) => c.label === "notetaking"), true);

  // 拼音 + 英文混搭
  const mix = rule.generateRuleCandidates("给设计师用的 mockup 工具，云端协作", "zh", rule.newGuardStats());
  const mixLabels = new Set(mix.map((c) => c.label));
  const py = mixRoots.filter((r) => r.kind === "pinyin").map((r) => r.text);
  check("A6 拼音+英文混搭候选（拼音词 × mockup 拼接）", py.some((p) => mixLabels.has(`${p}mockup`) || mixLabels.has(`mockup${p}`)), true);
  check("A6b 混搭 meaning 注明拼音与英文来源", mix.find((c) => c.label === "shejimockup")?.meaning, "规则生成：由 「设计」拼音 sheji + 英文 mockup 组成，非 AI 寓意");

  // 排除集（跨轮 tried）生效
  const ex = rule.generateRuleCandidates("面向中小商家的云端记账工具", "zh", rule.newGuardStats(), new Set(["yunduan", "jizhang"]));
  check("A7 排除集生效", ex.some((c) => c.label === "yunduan" || c.label === "jizhang"), false);

  // 无根词 → 0 候选（不抛错）
  check("A8 无可用根词 → 空数组", rule.generateRuleCandidates("的 了 和", "zh", rule.newGuardStats()).length, 0);

  // LLM 声明 theme:"rule" 走普通 admit → 归 coined（不能伪装规则生成）
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({ choices: [{ message: { content: JSON.stringify([{ label: "haoming", meaning: "寓意稳载远行，声调平缓，读一遍就能拼出来", theme: "rule", scores: { length: 80, readability: 80, relevance: 80, brandability: 80 } }]) } }] }),
      { status: 200, headers: { "content-type": "application/json" } },
    );
  const spoof = await rule.generateAiCandidates("desc", "k", { lang: "zh", guard: rule.newGuardStats() });
  check("A9 LLM 输出 theme:'rule' 不接受 → coined", spoof.map((c) => c.theme), ["coined"]);
}

// ---------- 通用 worker mock ----------
const enc = new TextEncoder();
const sseResponse = (content) => {
  const frames = `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\ndata: [DONE]\n\n`;
  return new Response(new Blob([enc.encode(frames)]).stream(), { status: 200, headers: { "content-type": "text/event-stream" } });
};
const jsonResponse = (content, status = 200) =>
  new Response(JSON.stringify({ choices: [{ message: { content } }] }), { status, headers: { "content-type": "application/json" } });

const makeKv = (init = {}) => {
  const kv = new Map(Object.entries(init));
  const puts = [];
  return {
    kv,
    puts,
    ns: {
      async get(key, type) {
        const v = kv.get(key);
        if (v === undefined) return null;
        return type === "json" ? JSON.parse(v) : v;
      },
      async put(key, value, opts) {
        puts.push({ key, opts });
        kv.set(key, String(value));
      },
      async delete(key) {
        kv.delete(key);
      },
    },
  };
};

/**
 * llm: (body) => Response | throws；记录 /chat/completions 调用次数与请求体
 * taken: 已注册域名集合（DNS/RDAP mock）
 */
const runSearch = async ({ llm, kvInit = {}, description = "面向中小商家的云端记账工具", lang = "zh", tlds = ["com", "cn"], taken = new Set() }) => {
  const { kv, puts, ns } = makeKv(kvInit);
  let llmCalls = 0;
  const llmBodies = [];
  globalThis.fetch = async (url, init) => {
    const u = String(url);
    if (u.endsWith("/chat/completions")) {
      llmCalls++;
      const body = JSON.parse(init.body);
      llmBodies.push(body);
      return llm(body);
    }
    if (u.startsWith("https://data.iana.org/rdap/dns.json")) {
      return new Response(JSON.stringify({ services: [[["com", "cn"], ["https://rdap.test/"]]] }), { status: 200 });
    }
    if (u.startsWith("https://cloudflare-dns.com/dns-query")) {
      const name = new URL(u).searchParams.get("name");
      return new Response(JSON.stringify(taken.has(name) ? { Status: 0, Answer: [{ data: "ns1.test." }] } : { Status: 3 }), { status: 200 });
    }
    if (u.startsWith("https://rdap.test/domain/")) {
      const d = decodeURIComponent(u.slice("https://rdap.test/domain/".length));
      return taken.has(d)
        ? new Response(JSON.stringify({ events: [{ eventAction: "expiration", eventDate: "2030-01-01T00:00:00Z" }] }), { status: 200 })
        : new Response("", { status: 404 });
    }
    throw new Error(`unexpected fetch ${u}`);
  };
  const pending = [];
  const ctx = { waitUntil: (p) => pending.push(p), passThroughOnException() {} };
  const req = new Request("https://hunt.test/api/ai-search", {
    method: "POST",
    headers: { "content-type": "application/json", "cf-connecting-ip": "203.0.113.9" },
    body: JSON.stringify({ description, tlds, target: 3, lang, fast: true }),
  });
  const res = await worker.fetch(req, { DEEPSEEK_API_KEY: "k", CACHE: ns, ASSETS: { fetch: async () => new Response("", { status: 404 }) } }, ctx);
  const text = await res.text();
  await Promise.all(pending);
  const events = text.trim().split("\n").filter(Boolean).map((l) => JSON.parse(l));
  const day = new Date().toISOString().slice(0, 10);
  const usage = JSON.parse(kv.get(`usage:${day}`) ?? "null");
  return { status: res.status, events, kv, puts, llmCalls, llmBodies, usage };
};

const quotaLlm = (body) => (body.stream === true ? new Response(JSON.stringify({ code: "apikey_quota_exhausted", message: "quota exhausted" }), { status: 429 }) : jsonResponse(JSON.stringify({ core: "测试", style: "简洁", scene: "自检" })));
const types = (events) => events.map((e) => e.type ?? (e.domain ? "result" : "?"));

// ---------- B. quota → 规则降级 ----------
{
  const r = await runSearch({ llm: quotaLlm });
  check("B1 /api/ai-search 200", r.status, 200);
  const fb = r.events.filter((e) => e.type === "fallback");
  check("B2 恰一条 fallback 事件", fb.length, 1);
  check("B2b fallback 字段 {type,round,reason,count}", Object.keys(fb[0]).sort(), ["count", "reason", "round", "type"]);
  check("B2c reason=quota、round=1、count≥1", [fb[0].reason, fb[0].round, fb[0].count >= 1], ["quota", 1, true]);
  const proposed = r.events.filter((e) => e.type === "proposed");
  const items = proposed.flatMap((e) => e.items);
  check("B3 规则候选逐条 proposed，条数 == fallback.count", items.length, fb[0].count);
  check("B3b 全部 theme=rule 且 meaning 含「规则生成」", items.every((i) => i.theme === "rule" && ZH_MARK.test(i.meaning)), true);
  check("B3c proposed 事件结构与旧前端一致（type/round/items/tlds）", Object.keys(proposed[0]).sort(), ["items", "round", "tlds", "type"]);
  check("B3d 末尾空 items 带 guard 汇总", [proposed.at(-1).items.length, "guard" in proposed.at(-1)], [0, true]);
  const results = r.events.filter((e) => e.domain);
  check("B4 每候选 × 每 TLD 一条 result（走既有 RDAP/DNS 核验）", results.length, items.length * 2);
  check("B4b result 携带 theme=rule / meaning / round=1", results.every((e) => e.theme === "rule" && ZH_MARK.test(e.meaning) && e.round === 1), true);
  const t = types(r.events);
  check("B5 首事件 round，fallback 早于首个 proposed，末事件 done，无 error", [t[0], t.indexOf("fallback") < t.indexOf("proposed"), t.at(-1), t.includes("error")], ["round", true, "done", false]);
  const idxProposed = new Map();
  r.events.forEach((e, i) => e.type === "proposed" && e.items.forEach((it) => idxProposed.set(it.label, i)));
  check("B5b 每个 result 在其候选 proposed 之后", r.events.every((e, i) => !e.domain || i > idxProposed.get(e.domain.split(".")[0])), true);
  check("B5c 降级后只跑 1 轮（不再打第二轮 LLM）", r.events.filter((e) => e.type === "round").length, 1);
  // 候选路线沿用既有「HTTP 错误重试 1 次」语义（2 次），understanding 1 次；降级本身 0 次上游
  check("B6 LLM 调用：候选 2 次（既有重试 1 次）+ understanding 1 次，降级路线不打上游", [r.llmCalls, r.llmBodies.map((b) => b.stream === true).sort()], [3, [false, true, true]]);
  check("B7 熔断键已写入且值为未来时间戳", [r.kv.has(LLM_BREAKER_KEY), Number(r.kv.get(LLM_BREAKER_KEY)) > Date.now()], [true, true]);
  check("B7b 熔断键 put 带 expirationTtl=300", r.puts.find((p) => p.key === LLM_BREAKER_KEY)?.opts?.expirationTtl, LLM_BREAKER_TTL_S);
  check("B8 usage.aiErrors.quota=1 且 usage.fallbacks.quota=1，searches=1", [r.usage?.aiErrors?.quota, r.usage?.fallbacks?.quota, r.usage?.searches], [1, 1, 1]);
  check("B8b stats:checked = 核验域名数", r.kv.get("stats:checked"), String(results.length));
  check("B9 done 事件形状不变（availableCount/target/reachedTarget）", ["availableCount", "target", "reachedTarget"].every((k) => k in r.events.at(-1)), true);

  // en 描述同样降级，meaning 用 Rule-based
  const en = await runSearch({ llm: quotaLlm, description: "a note taking app for developers", lang: "en" });
  const enItems = en.events.filter((e) => e.type === "proposed").flatMap((e) => e.items);
  check("B10 en 降级：≥1 候选、theme=rule、meaning 含 Rule-based", [enItems.length >= 1, enItems.every((i) => i.theme === "rule" && EN_MARK.test(i.meaning))], [true, true]);
}

// ---------- C. 熔断命中：0 次上游 ----------
{
  const r = await runSearch({
    llm: () => {
      throw new Error("must-not-call-upstream");
    },
    kvInit: { [LLM_BREAKER_KEY]: String(Date.now() + 200_000) },
  });
  check("C1 熔断期内 /chat/completions 0 次调用（候选 + understanding）", r.llmCalls, 0);
  const fb = r.events.filter((e) => e.type === "fallback");
  check("C2 fallback reason=quota-breaker、count≥1", [fb.length, fb[0]?.reason, fb[0]?.count >= 1], [1, "quota-breaker", true]);
  check("C3 无 understanding 事件、无 error 事件", [r.events.some((e) => e.type === "understanding"), r.events.some((e) => e.type === "error")], [false, false]);
  const items = r.events.filter((e) => e.type === "proposed").flatMap((e) => e.items);
  check("C4 规则候选照常下发并核验", [items.length, r.events.filter((e) => e.domain).length], [fb[0].count, items.length * 2]);
  check("C5 usage.fallbacks['quota-breaker']=1，aiErrors 不计（未打上游）", [r.usage?.fallbacks?.["quota-breaker"], r.usage?.aiErrors], [1, undefined]);
  check("C6 熔断期内不重写熔断键", r.puts.some((p) => p.key === LLM_BREAKER_KEY), false);
  check("C7 末事件 done", r.events.at(-1).type, "done");
}

// ---------- D. 其他错误类别 ----------
{
  // rate-limit：普通 429（无 quota 标记）→ 降级但不熔断
  const rl = await runSearch({ llm: (b) => (b.stream === true ? new Response("Too Many Requests", { status: 429 }) : jsonResponse("{}")) });
  check("D1 rate-limit → fallback reason=rate-limit", rl.events.find((e) => e.type === "fallback")?.reason, "rate-limit");
  check("D1b rate-limit 不写熔断键", rl.kv.has(LLM_BREAKER_KEY), false);
  check("D1c usage.aiErrors['rate-limit']=1、fallbacks['rate-limit']=1", [rl.usage?.aiErrors?.["rate-limit"], rl.usage?.fallbacks?.["rate-limit"]], [1, 1]);

  // upstream：500
  const up = await runSearch({ llm: (b) => (b.stream === true ? new Response("bad gateway", { status: 502 }) : jsonResponse("{}")) });
  check("D2 upstream(502) → fallback reason=upstream，不写熔断", [up.events.find((e) => e.type === "fallback")?.reason, up.kv.has(LLM_BREAKER_KEY)], ["upstream", false]);

  // network：fetch 抛 TypeError
  const net = await runSearch({
    llm: (b) => {
      if (b.stream === true) throw new TypeError("fetch failed");
      return jsonResponse("{}");
    },
  });
  check("D3 network(TypeError) → fallback reason=network，不写熔断", [net.events.find((e) => e.type === "fallback")?.reason, net.kv.has(LLM_BREAKER_KEY)], ["network", false]);

  // 401 → quota → 写熔断
  const k401 = await runSearch({ llm: (b) => (b.stream === true ? new Response("unauthorized", { status: 401 }) : jsonResponse("{}")) });
  check("D4 401 → reason=quota 且写熔断", [k401.events.find((e) => e.type === "fallback")?.reason, k401.kv.has(LLM_BREAKER_KEY)], ["quota", true]);

  // 降级 0 候选（描述无可用根词）→ fallback count=0，仍正常 done、无 error
  const empty = await runSearch({ llm: quotaLlm, description: "的 了 和" });
  const fb0 = empty.events.find((e) => e.type === "fallback");
  check("D5 无根词：fallback count=0、无 result、末事件 done", [fb0?.count, empty.events.some((e) => e.domain), empty.events.at(-1).type], [0, false, "done"]);
}

// ---------- E. 过期熔断值 / 成功路径不变 / usage 透出 ----------
{
  // 过期熔断值 → 视为未熔断，正常打上游（此处上游成功）
  const cands = [
    { label: "haoming", meaning: "寓意稳载远行，声调平缓，读一遍就能拼出来", theme: "pinyin", scores: { length: 80, readability: 80, relevance: 80, brandability: 80 } },
    { label: "yunqi", meaning: "「云起」yunqi，云卷云舒之起，声调顺口", theme: "pinyin", scores: { length: 80, readability: 80, relevance: 80, brandability: 80 } },
    { label: "lanhai", meaning: "「蓝海」lanhai，寓意开阔市场，双字全拼", theme: "pinyin", scores: { length: 80, readability: 80, relevance: 80, brandability: 80 } },
  ];
  const okLlm = (b) => (b.stream === true ? sseResponse(JSON.stringify(cands)) : jsonResponse(JSON.stringify({ core: "测试", style: "简洁", scene: "自检" })));
  const stale = await runSearch({ llm: okLlm, kvInit: { [LLM_BREAKER_KEY]: String(Date.now() - 1000) } });
  check("E1 过期熔断值不生效：正常打上游、无 fallback 事件", [stale.llmCalls, stale.events.some((e) => e.type === "fallback")], [2, false]);

  const ok = await runSearch({ llm: okLlm, taken: new Set(["haoming.com"]) });
  const t = types(ok.events);
  check("E2 成功路径事件顺序不变（round…proposed/result…proposed(guard)…done，无 fallback/error）", [t[0], t.at(-1), t.includes("fallback"), t.includes("error")], ["round", "done", false, false]);
  check("E2b 成功路径候选 theme 仍为 LLM 声明值", ok.events.filter((e) => e.type === "proposed").flatMap((e) => e.items).map((i) => i.theme), ["pinyin", "pinyin", "pinyin"]);
  check("E2c 成功路径 usage 无 fallbacks 字段", ok.usage?.fallbacks, undefined);

  // /api/usage 透出 fallbacks
  const { ns, kv } = makeKv();
  const day = new Date().toISOString().slice(0, 10);
  kv.set(`usage:${day}`, JSON.stringify({ searches: 3, byTld: { com: 3 }, fast: 3, refine: 0, aiErrors: { quota: 2 }, fallbacks: { quota: 1, "quota-breaker": 1 } }));
  const res = await worker.fetch(new Request("https://hunt.test/api/usage?days=1"), { CACHE: ns, ASSETS: { fetch: async () => new Response("", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
  const body = await res.json();
  const dayEntry = body.days?.[day] ?? body[day];
  check("E3 /api/usage 返回 fallbacks（按 reason）", [res.status, dayEntry?.fallbacks], [200, { quota: 1, "quota-breaker": 1 }]);
}

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
