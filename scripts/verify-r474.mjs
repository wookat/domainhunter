// R474 LLM 备用供应商 failover 自检脚本（无测试框架，独立 node 脚本，0 生产 AI 调用，全程 mock fetch）
// 用法：node scripts/verify-r474.mjs
// 覆盖：
//   A. shouldFailover 判定矩阵（401/402/403/429+quota/5xx → 切；429 瞬时/400/404 → 不切）；
//   B. llmChatFetch 层：主 429+quota → 备用成功（provider=fallback，备用只调 1 次、请求体同 messages/stream、Authorization 换成备用 key）；
//      主 500 → 备用成功；主 429 瞬时 → 不调备用、抛 rate-limit；主网络失败 → 备用成功；
//      未配置备用 → 主失败直接抛、不发第二次请求；主备都失败 → 分类以备用为准、detail 不含任何 key、warn 同时记主/备 status 且不含 key；
//      备用网络失败 → network；
//   C. generateAiCandidates 端到端：主 429+quota → 备用成功 provider=fallback、guard.retries=0；主 429 瞬时 → 既有重试 1 次、0 次备用调用；
//      未配置备用 → 与 verify-r264 quota 用例等价（quota、detail 无泄漏、retries=1）；主备都失败 → 上层重试 1 次后抛错、分类正确；
//      流式主轮走备用（stream:true 透传）；补发轮不改写 guard.provider；
//   D. generateUnderstanding：主 401 → 备用成功返回结果；未配置备用 → null（现状）；
//   E. worker /api/ai-search 端到端（Hono + mock fetch + 假 KV）：汇总 proposed 事件带 provider=fallback、单候选 proposed 结构不变、
//      usage.llmProvider={fallback:1}；未配置备用时 provider=primary、llmProvider={primary:1}；无 error 事件。
import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const webRequire = createRequire(path.join(root, "apps/web/package.json"));
const viteRequire = createRequire(webRequire.resolve("vite/package.json"));
const { build } = viteRequire("esbuild");
const tmpAi = path.join(root, "scripts/.ai-r474-compiled.mjs");
const tmpWorker = path.join(root, "scripts/.worker-r474-compiled.mjs");
const stubSockets = {
  name: "stub-cloudflare-sockets",
  setup(b) {
    b.onResolve({ filter: /^cloudflare:sockets$/ }, () => ({ path: "cloudflare:sockets", namespace: "stub" }));
    b.onLoad({ filter: /.*/, namespace: "stub" }, () => ({ contents: 'export const connect = () => { throw new Error("no-sockets-in-test"); };' }));
  },
};
await build({ entryPoints: [path.join(root, "apps/web/src/ai.ts")], bundle: true, format: "esm", outfile: tmpAi });
await build({
  entryPoints: [path.join(root, "apps/web/src/worker.ts")],
  bundle: true,
  format: "esm",
  platform: "node",
  outfile: tmpWorker,
  plugins: [stubSockets],
  logLevel: "silent",
});
const ai = await import(tmpAi);
const worker = (await import(tmpWorker)).default;
rmSync(tmpAi);
rmSync(tmpWorker);
const { generateAiCandidates, generateUnderstanding, newGuardStats, classifyAiError } = ai;
// ai-transport 经 ai.ts re-export 的部分；llmChatFetch/shouldFailover 单独打包
const tmpTransport = path.join(root, "scripts/.ai-transport-r474-compiled.mjs");
await build({ entryPoints: [path.join(root, "apps/web/src/ai-transport.ts")], bundle: true, format: "esm", outfile: tmpTransport });
const { llmChatFetch, shouldFailover, resolveFallbackUpstream, DEFAULT_LLM_API_BASE, DEFAULT_LLM_MODEL } = await import(tmpTransport);
rmSync(tmpTransport);

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

const PRIMARY_KEY = "sk-primary-SECRET-0001";
const FALLBACK_KEY = "sk-fallback-SECRET-0002";
const PRIMARY_BASE = "https://primary.test/v1";
const FALLBACK_BASE = "https://fallback.test/v1";
const primary = { apiKey: PRIMARY_KEY, baseUrl: PRIMARY_BASE, model: "primary-model", thinking: "disabled" };
const fallback = { apiKey: FALLBACK_KEY, baseUrl: FALLBACK_BASE, model: "fallback-model" };

const QUOTA_BODY = JSON.stringify({ error: { message: "ApiKey已触发限额", type: "quota_error", code: "apikey_quota_exhausted" } });
const TRANSIENT_429_BODY = JSON.stringify({ error: { message: "Too many requests, slow down", type: "rate_limit_error" } });
const SERVER_ERR_BODY = JSON.stringify({ error: { message: "internal gateway error secret-detail" } });
const cand = {
  label: "muzhou",
  meaning: "「木舟」muzhou，双字全拼，寓意稳载远行，声调平缓，读一遍就能拼出来",
  theme: "pinyin",
  scores: { length: 90, readability: 88, relevance: 85, brandability: 80 },
};
const okJson = (content) => new Response(JSON.stringify({ choices: [{ message: { content } }] }), { status: 200, headers: { "content-type": "application/json" } });
const okCandidates = () => okJson(JSON.stringify([cand]));
// worker 端到端：target 下限为 3，一轮给 3 个可注册候选即收敛
const workerCands = [
  cand,
  { ...cand, label: "haoming", meaning: "「好名」haoming，双字全拼，寓意名字好记，声调上扬，读一遍就能拼出来" },
  { ...cand, label: "yunqi", meaning: "「云起」yunqi，双字全拼，寓意云端起步，声调轻快，读一遍就能拼出来" },
];
const enc = new TextEncoder();
const sseResponse = (content) => {
  const frames = `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\ndata: [DONE]\n\n`;
  return new Response(new ReadableStream({ start(c) { c.enqueue(enc.encode(frames)); c.close(); } }), {
    status: 200,
    headers: { "content-type": "text/event-stream" },
  });
};

/** 记录每次 fetch 的 host/Authorization/body，并按 host 返回预设应答（应答可以是 Response 或抛错的函数） */
const installMock = (handlers) => {
  const calls = [];
  globalThis.fetch = async (url, init) => {
    const u = new URL(String(url));
    const who = u.host.startsWith("primary") ? "primary" : u.host.startsWith("fallback") ? "fallback" : "other";
    calls.push({ who, url: String(url), auth: init?.headers?.authorization ?? "", body: JSON.parse(init?.body ?? "{}"), signal: init?.signal });
    const h = handlers[who];
    if (!h) throw new Error(`unexpected fetch ${u}`);
    return typeof h === "function" ? h(calls.filter((c) => c.who === who).length) : h();
  };
  return calls;
};
const realFetch = globalThis.fetch;
const realWarn = console.warn;
const captureWarn = () => {
  const lines = [];
  console.warn = (...a) => lines.push(a.map(String).join(" "));
  return lines;
};
const restore = () => {
  globalThis.fetch = realFetch;
  console.warn = realWarn;
};
const netErr = (name) => {
  const e = new Error(`${name} simulated`);
  e.name = name;
  return e;
};
const req = () => ({ stage: "candidates", messages: [{ role: "system", content: "sys" }, { role: "user", content: "usr" }], temperature: 1.2, maxTokens: 4000, stream: true, timeoutMs: 60_000 });

// ---------- A. shouldFailover 判定矩阵 ----------
check("A1 401 → 切", shouldFailover(401, ""), true);
check("A2 402 → 切", shouldFailover(402, ""), true);
check("A3 403 → 切", shouldFailover(403, ""), true);
check("A4 429 + quota body → 切", shouldFailover(429, QUOTA_BODY), true);
check("A5 429 瞬时（非 quota body）→ 不切", shouldFailover(429, TRANSIENT_429_BODY), false);
check("A6 500/502/503 → 切", [500, 502, 503].map((s) => shouldFailover(s, "")), [true, true, true]);
check("A7 400/404 → 不切", [400, 404].map((s) => shouldFailover(s, "")), [false, false]);
check("A8 resolveFallbackUpstream：key 为空/缺省 → undefined", [resolveFallbackUpstream({}), resolveFallbackUpstream({ apiKey: "" , baseUrl: "x" })], [undefined, undefined]);
check("A9 resolveFallbackUpstream：空串 base/model 归一为 undefined（走默认值）", resolveFallbackUpstream({ apiKey: "k", baseUrl: "", model: "", thinking: "" }), { apiKey: "k", baseUrl: undefined, model: undefined, thinking: undefined });

// ---------- B. llmChatFetch 请求层 ----------
{
  const warns = captureWarn();
  const calls = installMock({ primary: () => new Response(QUOTA_BODY, { status: 429 }), fallback: okCandidates });
  try {
    const { res, provider } = await llmChatFetch(primary, fallback, req());
    check("B1 主 429+quota → provider=fallback，res.ok", [provider, res.ok], ["fallback", true]);
    check("B1b 主/备各调用 1 次，顺序 primary→fallback", calls.map((c) => c.who), ["primary", "fallback"]);
    check("B1c 备用请求打到备用 base，Authorization 用备用 key", [calls[1].url, calls[1].auth], [`${FALLBACK_BASE}/chat/completions`, `Bearer ${FALLBACK_KEY}`]);
    check("B1d 备用请求 messages/temperature/stream 与主请求一致", [
      JSON.stringify(calls[1].body.messages) === JSON.stringify(calls[0].body.messages),
      calls[1].body.temperature === calls[0].body.temperature,
      calls[1].body.stream === true && calls[0].body.stream === true,
    ], [true, true, true]);
    check("B1e 备用请求用备用 model，且不带主上游 thinking 设置", [calls[1].body.model, "thinking" in calls[1].body, calls[0].body.model, calls[0].body.thinking], ["fallback-model", false, "primary-model", { type: "disabled" }]);
    check("B1f 主/备各自有独立超时 signal", calls.every((c) => c.signal instanceof AbortSignal), true);
    check("B1g warn 同时记录主/备 status", warns.some((l) => l.includes("llm-failover candidates primary=429 fallback=ok:200")), true);
    check("B1h warn 不含任何 key / Authorization", warns.some((l) => l.includes(PRIMARY_KEY) || l.includes(FALLBACK_KEY) || /authorization/i.test(l)), false);
  } finally {
    restore();
  }
}
{
  captureWarn();
  const calls = installMock({ primary: () => new Response(SERVER_ERR_BODY, { status: 500 }), fallback: okCandidates });
  try {
    const { provider } = await llmChatFetch(primary, fallback, req());
    check("B2 主 500 → 备用成功 provider=fallback", [provider, calls.map((c) => c.who)], ["fallback", ["primary", "fallback"]]);
  } finally {
    restore();
  }
}
{
  captureWarn();
  const calls = installMock({ primary: () => new Response(TRANSIENT_429_BODY, { status: 429 }), fallback: okCandidates });
  try {
    let err = null;
    try {
      await llmChatFetch(primary, fallback, req());
    } catch (e) {
      err = e;
    }
    check("B3 主 429 瞬时 → 不调备用、抛 llm-http-429（rate-limit）", [calls.map((c) => c.who), String(err), classifyAiError(err)], [["primary"], "Error: llm-http-429", "rate-limit"]);
  } finally {
    restore();
  }
}
{
  const warns = captureWarn();
  const calls = installMock({ primary: () => { throw netErr("TimeoutError"); }, fallback: okCandidates });
  try {
    const { provider } = await llmChatFetch(primary, fallback, req());
    check("B4 主网络超时 → 备用成功 provider=fallback", [provider, calls.map((c) => c.who)], ["fallback", ["primary", "fallback"]]);
    check("B4b warn 记录主 net:TimeoutError", warns.some((l) => l.includes("primary=net:TimeoutError fallback=ok:200")), true);
  } finally {
    restore();
  }
}
{
  captureWarn();
  const calls = installMock({ primary: () => new Response(QUOTA_BODY, { status: 429 }), fallback: okCandidates });
  try {
    let err = null;
    try {
      await llmChatFetch(primary, undefined, req());
    } catch (e) {
      err = e;
    }
    check("B5 未配置备用：主 429+quota 直接抛 quota，只有 1 次请求", [calls.map((c) => c.who), String(err), classifyAiError(err)], [["primary"], "Error: llm-http-429 quota-exhausted", "quota"]);
  } finally {
    restore();
  }
}
{
  const warns = captureWarn();
  const calls = installMock({ primary: () => new Response(QUOTA_BODY, { status: 429 }), fallback: () => new Response(SERVER_ERR_BODY, { status: 503 }) });
  try {
    let err = null;
    try {
      await llmChatFetch(primary, fallback, req());
    } catch (e) {
      err = e;
    }
    const detail = String(err);
    check("B6 主备都失败：分类以最后一次（备用 503 → upstream）为准", [detail, classifyAiError(err)], ["Error: llm-http-503", "upstream"]);
    check("B6b 主/备各 1 次", calls.map((c) => c.who), ["primary", "fallback"]);
    check("B6c detail 不含任何 key / 上游响应体", [detail.includes(PRIMARY_KEY), detail.includes(FALLBACK_KEY), detail.includes("secret-detail"), detail.includes("apikey_quota_exhausted")], [false, false, false, false]);
    check("B6d warn 同时记录主/备 status", warns.some((l) => l.includes("llm-failover candidates primary=429 fallback=503")), true);
    check("B6e 每次非 2xx 都有脱敏 llm-upstream 日志且 body ≤300 字、不含 key", warns.filter((l) => l.startsWith("llm-upstream")).length === 2 && warns.every((l) => !l.includes(PRIMARY_KEY) && !l.includes(FALLBACK_KEY) && l.length < 600), true);
  } finally {
    restore();
  }
}
{
  captureWarn();
  installMock({ primary: () => new Response("", { status: 502 }), fallback: () => { throw netErr("TypeError"); } });
  try {
    let err = null;
    try {
      await llmChatFetch(primary, fallback, req());
    } catch (e) {
      err = e;
    }
    check("B7 主 502 + 备用网络失败 → 抛备用的网络错误（network）", [err?.name, classifyAiError(err)], ["TypeError", "network"]);
  } finally {
    restore();
  }
}
{
  captureWarn();
  // 主上游不传 base → 打 DeepSeek 默认 host（mock 里归为 other）
  const calls = installMock({ other: okCandidates, fallback: okCandidates });
  try {
    const { provider } = await llmChatFetch({ apiKey: PRIMARY_KEY }, fallback, { ...req(), stream: false, timeoutMs: undefined });
    check("B8 主成功 → provider=primary，备用 0 次", [provider, calls.map((c) => c.who)], ["primary", ["other"]]);
    check("B8b 缺省 base/model 回落 DeepSeek 默认；非流式无 stream 字段；无 timeout 则无 signal", [calls[0].url, calls[0].body.model, "stream" in calls[0].body, calls[0].signal === undefined], [`${DEFAULT_LLM_API_BASE}/chat/completions`, DEFAULT_LLM_MODEL, false, true]);
  } finally {
    restore();
  }
}

// ---------- C. generateAiCandidates 端到端 ----------
{
  captureWarn();
  const calls = installMock({ primary: () => new Response(QUOTA_BODY, { status: 429 }), fallback: okCandidates });
  try {
    const guard = newGuardStats();
    const out = await generateAiCandidates("测试需求", PRIMARY_KEY, { guard, baseUrl: PRIMARY_BASE, model: "primary-model", fallback });
    check("C1 主 429+quota → 备用成功：返回候选、guard.provider=fallback、无上层重试", [out.length, guard.provider, guard.retries], [1, "fallback", 0]);
    check("C1b 备用只调 1 次", calls.filter((c) => c.who === "fallback").length, 1);
  } finally {
    restore();
  }
}
{
  captureWarn();
  const calls = installMock({ primary: (n) => (n === 1 ? new Response(TRANSIENT_429_BODY, { status: 429 }) : okCandidates()), fallback: okCandidates });
  try {
    const guard = newGuardStats();
    const out = await generateAiCandidates("测试需求", PRIMARY_KEY, { guard, baseUrl: PRIMARY_BASE, fallback });
    check("C2 主 429 瞬时 → 沿用既有重试（主 2 次、备用 0 次），第二次主成功 provider=primary", [calls.map((c) => c.who), out.length, guard.provider, guard.retries], [["primary", "primary"], 1, "primary", 1]);
  } finally {
    restore();
  }
}
{
  captureWarn();
  const calls = installMock({ primary: () => new Response(QUOTA_BODY, { status: 429 }), fallback: okCandidates });
  try {
    const guard = newGuardStats();
    let kind = null;
    let detail = "";
    try {
      await generateAiCandidates("测试需求", PRIMARY_KEY, { guard, baseUrl: PRIMARY_BASE });
    } catch (e) {
      kind = classifyAiError(e);
      detail = String(e);
    }
    check("C3 未配置备用：等同现状（quota、重试 1 次、备用 0 次、无 provider）", [kind, guard.retries, calls.filter((c) => c.who === "fallback").length, guard.provider], ["quota", 1, 0, undefined]);
    check("C3b detail 不含上游响应体与 key", [detail.includes("apikey_quota_exhausted"), detail.includes(PRIMARY_KEY)], [false, false]);
  } finally {
    restore();
  }
}
{
  captureWarn();
  const calls = installMock({ primary: () => new Response(QUOTA_BODY, { status: 429 }), fallback: () => new Response(JSON.stringify({ error: { message: "insufficient balance" } }), { status: 402 }) });
  try {
    const guard = newGuardStats();
    let kind = null;
    let detail = "";
    try {
      await generateAiCandidates("测试需求", PRIMARY_KEY, { guard, baseUrl: PRIMARY_BASE, fallback });
    } catch (e) {
      kind = classifyAiError(e);
      detail = String(e);
    }
    check("C4 主备都失败：上层重试 1 次（主 2 + 备 2），分类以备用 402 → quota", [calls.map((c) => c.who), guard.retries, kind, detail], [["primary", "fallback", "primary", "fallback"], 1, "quota", "Error: llm-http-402"]);
    check("C4b detail 不含任何 key", [detail.includes(PRIMARY_KEY), detail.includes(FALLBACK_KEY)], [false, false]);
  } finally {
    restore();
  }
}
{
  captureWarn();
  const calls = installMock({ primary: () => new Response(QUOTA_BODY, { status: 429 }), fallback: () => sseResponse(JSON.stringify([cand])) });
  try {
    const guard = newGuardStats();
    const got = [];
    const out = await generateAiCandidates("测试需求", PRIMARY_KEY, { guard, baseUrl: PRIMARY_BASE, fallback, onCandidate: (c) => got.push(c.label) });
    check("C5 流式主轮 failover：备用请求 stream:true，候选经 SSE 回调下发", [calls[1].body.stream, got, out.length, guard.provider], [true, ["muzhou"], 1, "fallback"]);
  } finally {
    restore();
  }
}
{
  // EN 主轮 word=0 触发补发：主轮成功（primary），补发轮主 500 → 备用；guard.provider 只反映主轮
  captureWarn();
  const enCands = Array.from({ length: 8 }, (_, i) => ({
    label: `lumora${"abcdefgh"[i]}`,
    meaning: `Latin "lumen" meaning light plus a soft ending, evokes clarity for a journaling app; two open syllables, reads instantly`,
    theme: "coined",
    scores: { length: 88, readability: 90, relevance: 84, brandability: 89 },
  }));
  const calls = installMock({
    primary: (n) => (n === 1 ? okJson(JSON.stringify(enCands)) : new Response(SERVER_ERR_BODY, { status: 500 })),
    fallback: () => okJson(JSON.stringify([])),
  });
  try {
    const guard = newGuardStats();
    await generateAiCandidates("a journaling app for writers", PRIMARY_KEY, { guard, baseUrl: PRIMARY_BASE, fallback, lang: "en" });
    check("C6 补发轮走备用不改写主轮 provider（仍 primary），补发确实触发", [guard.provider, guard.wordSupplement, calls.filter((c) => c.who === "fallback").length > 0], ["primary", true, true]);
  } finally {
    restore();
  }
}

// ---------- D. generateUnderstanding ----------
{
  captureWarn();
  const calls = installMock({ primary: () => new Response("unauthorized", { status: 401 }), fallback: () => okJson(JSON.stringify({ core: "稳载远行", style: "简洁", scene: "记账工具" })) });
  try {
    const u = await generateUnderstanding("面向中小商家的云端记账工具", PRIMARY_KEY, "zh", PRIMARY_BASE, "primary-model", undefined, fallback);
    check("D1 understanding 主 401 → 备用成功返回结果", [u?.core, calls.map((c) => c.who)], ["稳载远行", ["primary", "fallback"]]);
    check("D1b understanding 请求体 max_tokens/temperature 与现状一致", [calls[0].body.max_tokens, calls[0].body.temperature, "stream" in calls[0].body], [200, 0.3, false]);
  } finally {
    restore();
  }
}
{
  captureWarn();
  const calls = installMock({ primary: () => new Response("unauthorized", { status: 401 }), fallback: okCandidates });
  try {
    const u = await generateUnderstanding("面向中小商家的云端记账工具", PRIMARY_KEY, "zh", PRIMARY_BASE);
    check("D2 未配置备用：understanding 失败返回 null（现状），备用 0 次", [u, calls.map((c) => c.who)], [null, ["primary"]]);
  } finally {
    restore();
  }
}

// ---------- E. worker /api/ai-search 端到端 ----------
// R487：usage 按 isolate 分片写 usage:{day}:<shard>，读侧深合并旧键 + 分片（mock KV 无 list，这里直接扫 Map）
const mergeCounts = (into, from) => {
  for (const [k, v] of Object.entries(from ?? {})) {
    if (typeof v === "number") into[k] = (into[k] ?? 0) + v;
    else if (v && typeof v === "object" && !Array.isArray(v)) into[k] = mergeCounts(into[k] ?? {}, v);
  }
  return into;
};
const readUsage = (kv, day) => {
  const keys = [...kv.keys()].filter((k) => k === `usage:${day}` || k.startsWith(`usage:${day}:`));
  return keys.length ? keys.reduce((acc, k) => mergeCounts(acc, JSON.parse(kv.get(k))), {}) : null;
};
const makeKv = () => {
  const kv = new Map();
  return {
    kv,
    fake: {
      async get(key, type) {
        const v = kv.get(key);
        if (v === undefined) return null;
        return type === "json" ? JSON.parse(v) : v;
      },
      async put(key, value) {
        kv.set(key, String(value));
      },
      async delete(key) {
        kv.delete(key);
      },
    },
  };
};
const runAiSearch = async (env, llm) => {
  const calls = [];
  globalThis.fetch = async (url, init) => {
    const u = String(url);
    if (u.endsWith("/chat/completions")) {
      const who = u.startsWith(PRIMARY_BASE) ? "primary" : u.startsWith(FALLBACK_BASE) ? "fallback" : "other";
      const body = JSON.parse(init.body);
      calls.push({ who, stream: body.stream === true, auth: init.headers.authorization });
      return llm(who, body);
    }
    if (u.startsWith("https://data.iana.org/rdap/dns.json")) {
      return new Response(JSON.stringify({ services: [[["com"], ["https://rdap.test/"]]] }), { status: 200 });
    }
    if (u.startsWith("https://cloudflare-dns.com/dns-query")) return new Response(JSON.stringify({ Status: 3 }), { status: 200 });
    if (u.startsWith("https://rdap.test/domain/")) return new Response("", { status: 404 });
    throw new Error(`unexpected fetch ${u}`);
  };
  const pending = [];
  const ctx = { waitUntil: (p) => pending.push(p), passThroughOnException() {} };
  const req = new Request("https://hunt.test/api/ai-search", {
    method: "POST",
    headers: { "content-type": "application/json", "cf-connecting-ip": "203.0.113.9" },
    body: JSON.stringify({ description: "面向中小商家的云端记账工具", tlds: ["com"], target: 1, lang: "zh", fast: true }),
  });
  const res = await worker.fetch(req, { ASSETS: { fetch: async () => new Response("", { status: 404 }) }, ...env }, ctx);
  const events = (await res.text()).trim().split("\n").map((l) => JSON.parse(l));
  await Promise.all(pending);
  return { status: res.status, events, calls };
};
{
  const warns = captureWarn();
  const { kv, fake } = makeKv();
  try {
    const { status, events, calls } = await runAiSearch(
      {
        DEEPSEEK_API_KEY: PRIMARY_KEY,
        LLM_API_BASE: PRIMARY_BASE,
        LLM_MODEL: "primary-model",
        CACHE: fake,
        LLM_FALLBACK_API_KEY: FALLBACK_KEY,
        LLM_FALLBACK_API_BASE: FALLBACK_BASE,
        LLM_FALLBACK_MODEL: "fallback-model",
      },
      (who, body) => {
        if (who === "primary") return new Response(QUOTA_BODY, { status: 429 });
        return body.stream ? sseResponse(JSON.stringify(workerCands)) : okJson(JSON.stringify({ core: "稳载远行", style: "简洁", scene: "记账" }));
      },
    );
    check("E1 /api/ai-search 200，无 error 事件，末事件 done，单轮收敛", [status, events.some((e) => e.type === "error"), events.at(-1).type, events.filter((e) => e.type === "round").length], [200, false, "done", 1]);
    const proposed = events.filter((e) => e.type === "proposed");
    check("E2 单候选 proposed 事件结构与旧前端一致（不加字段）", Object.keys(proposed[0]).sort(), ["items", "round", "tlds", "type"]);
    const summary = proposed.find((e) => e.items.length === 0);
    check("E3 汇总 proposed 事件带 provider=fallback（顶层 + guard.provider），既有字段与顺序不变", [Object.keys(summary), summary.provider, summary.guard.provider], [["type", "round", "items", "tlds", "guard", "provider"], "fallback", "fallback"]);
    check("E4 主轮与 understanding 都经备用：备用 Authorization 用备用 key", calls.filter((c) => c.who === "fallback").every((c) => c.auth === `Bearer ${FALLBACK_KEY}`) && calls.filter((c) => c.who === "fallback").length === 2, true);
    check("E4b 主轮流式（stream:true）经备用重发时仍为流式", calls.filter((c) => c.who === "fallback" && c.stream).length, 1);
    const day = new Date().toISOString().slice(0, 10);
    const usage = readUsage(kv, day);
    check("E5 usage.llmProvider={fallback:1}，searches 仍为 1", [usage?.llmProvider, usage?.searches], [{ fallback: 1 }, 1]);
    check("E6 warn 含 failover 记录且不含任何 key", warns.some((l) => l.startsWith("llm-failover")) && warns.every((l) => !l.includes(PRIMARY_KEY) && !l.includes(FALLBACK_KEY)), true);
    check("E6b 事件流中不含任何 key", JSON.stringify(events).includes("SECRET"), false);
  } finally {
    restore();
  }
}
{
  captureWarn();
  const { kv, fake } = makeKv();
  try {
    const { events, calls } = await runAiSearch(
      { DEEPSEEK_API_KEY: PRIMARY_KEY, LLM_API_BASE: PRIMARY_BASE, CACHE: fake },
      (who, body) => (body.stream ? sseResponse(JSON.stringify(workerCands)) : okJson(JSON.stringify({ core: "稳载远行", style: "简洁", scene: "记账" }))),
    );
    const summary = events.find((e) => e.type === "proposed" && e.items.length === 0);
    const day = new Date().toISOString().slice(0, 10);
    const usage = readUsage(kv, day);
    check("E7 未配置备用：provider=primary、llmProvider={primary:1}、0 次备用请求、无 error", [summary.provider, usage?.llmProvider, calls.filter((c) => c.who === "fallback").length, events.some((e) => e.type === "error")], ["primary", { primary: 1 }, 0, false]);
  } finally {
    restore();
  }
}
{
  captureWarn();
  const { kv, fake } = makeKv();
  try {
    const { events } = await runAiSearch(
      { DEEPSEEK_API_KEY: PRIMARY_KEY, LLM_API_BASE: PRIMARY_BASE, CACHE: fake },
      () => new Response(QUOTA_BODY, { status: 429 }),
    );
    // R471 集成后：首轮 quota 不再发 error 事件，改为 fallback 事件 + 规则候选；llmProvider 仍不计数，aiErrors.quota 仍 +1
    const err = events.find((e) => e.type === "error");
    const fb = events.find((e) => e.type === "fallback");
    const day = new Date().toISOString().slice(0, 10);
    const usage = readUsage(kv, day);
    check("E8 未配置备用 + 主 quota：无 error 事件、fallback.reason=quota（R471），llmProvider 不计数，aiErrors.quota=1", [err, fb?.reason, usage?.llmProvider, usage?.aiErrors], [undefined, "quota", undefined, { quota: 1 }]);
    check("E8b 事件流不含 key / 响应体", [JSON.stringify(events).includes(PRIMARY_KEY), JSON.stringify(events).includes("apikey_quota_exhausted")], [false, false]);
  } finally {
    restore();
  }
}

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
