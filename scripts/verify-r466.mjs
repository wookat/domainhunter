// R466 主轮 LLM 流式读取 + 增量候选解析自检脚本（无测试框架，独立 node 脚本，0 生产 AI 调用）
// 用法：node scripts/verify-r466.mjs
// 覆盖：
//   A. CandidateArrayStreamParser 任意分片边界（逐字符/随机分片/字符串内括号与转义跨片）与整包解析结果一致；
//      坏对象抢救语义、"[]" 与无数组的错误码与 parseCandidateArray 一致；
//   B. sseDeltaContent 行解析（data/[DONE]/心跳/坏行）；
//   C. generateAiCandidates 流式（SSE mock，含 UTF-8 多字节跨字节块）vs 非流式：候选顺序/完整性/guard 计数逐项一致，
//      onCandidate 回调序列 == 返回值；请求体 stream:true 只出现在主轮；
//   D. 坏 JSON：中途坏对象只保留其前候选且不重试；整包不可恢复 → llm-bad-json/llm-bad-output → 一次重试；
//      读流中断（已有候选 → 保留不重试；0 候选 → 重试）；非 SSE 网关退化为整包；
//   E. 点踩形态过滤（回填延后）与 EN word 补发（非流式）在流式路径下与非流式逐项一致；
//   F. worker /api/ai-search 端到端（Hono + mock fetch + 假 KV）：事件顺序（候选 proposed 先于其域名 result、
//      guard 汇总在流末）、usage 只计 1 次、stats:checked = 域名数、事件结构与旧前端兼容。
import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const webRequire = createRequire(path.join(root, "apps/web/package.json"));
const viteRequire = createRequire(webRequire.resolve("vite/package.json"));
const { build } = viteRequire("esbuild");
const tmpAi = path.join(root, "scripts/.ai-r466-compiled.mjs");
const tmpWorker = path.join(root, "scripts/.worker-r466-compiled.mjs");
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
const { generateAiCandidates, newGuardStats, CandidateArrayStreamParser, parseCandidateArray, sseDeltaContent, classifyAiError } = await import(tmpAi);
const worker = (await import(tmpWorker)).default;
rmSync(tmpAi);
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

// 固定种子伪随机，分片方案可复现
const rng = (seed) => () => {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
};
const splitRandom = (s, seed, maxLen = 9) => {
  const r = rng(seed);
  const parts = [];
  let i = 0;
  while (i < s.length) {
    const n = 1 + Math.floor(r() * maxLen);
    parts.push(s.slice(i, i + n));
    i += n;
  }
  return parts;
};
const splitEvery = (s, n) => {
  const parts = [];
  for (let i = 0; i < s.length; i += n) parts.push(s.slice(i, i + n));
  return parts;
};

const feedAll = (parts) => {
  const p = new CandidateArrayStreamParser();
  const out = [];
  for (const c of parts) out.push(...p.push(c));
  let err = null;
  try {
    p.finish();
  } catch (e) {
    err = e.message;
  }
  return { out, err };
};
const wholeParse = (text) => {
  try {
    return { out: parseCandidateArray(text), err: null };
  } catch (e) {
    return { out: [], err: e.message };
  }
};

// ---------- A. 增量解析器 vs 整包解析 ----------
{
  const tricky = [
    { label: "brace", meaning: '含括号 {"x":[1,2]} 与 ] } 的字符串', theme: "coined", scores: { length: 80, readability: 80, relevance: 80, brandability: 80 }, tags: ["a", { b: [1, [2]] }] },
    { label: "escape", meaning: '转义引号 \\" 与反斜杠 \\\\ 再来一个 \\"}]', theme: "word", scores: { length: 70, readability: 70, relevance: 70, brandability: 70 } },
    { label: "uni", meaning: "「星辰」xingchen，寓意远大 ✨ 𝄞", theme: "pinyin", scores: { length: 90, readability: 90, relevance: 90, brandability: 90 } },
  ];
  const text = "```json\n" + JSON.stringify(tricky, null, 2) + "\n```";
  const whole = wholeParse(text);
  check("A1 整包解析基线 3 对象", whole.out.length, 3);
  check("A2 逐字符分片 == 整包", feedAll(splitEvery(text, 1)), whole);
  check("A3 每 7 字符分片 == 整包", feedAll(splitEvery(text, 7)), whole);
  for (const seed of [1, 7, 42, 2024]) check(`A4 随机分片(seed=${seed}) == 整包`, feedAll(splitRandom(text, seed)), whole);
  check("A5 一次性整段 == 整包", feedAll([text]), whole);
  check("A6 对象按原始顺序交出", feedAll(splitRandom(text, 3)).out.map((c) => c.label), ["brace", "escape", "uni"]);

  // 截断：最后一个对象未闭合 → 保留其前完整对象（与 parseCandidateArray 截断修复一致）
  const cut = text.slice(0, text.lastIndexOf('"label": "uni"') + 12);
  check("A7 截断流：保留前 2 个完整对象", feedAll(splitEvery(cut, 5)).out.map((c) => c.label), ["brace", "escape"]);
  // 整包路径的 /\[[\s\S]*\]/ 会被字符串内的 "]" 截住只抢救到 1 个，流式按字符串感知扫描 ≥ 整包（不弱于既有语义）
  const wholeCut = wholeParse(cut);
  check("A7b 截断流抢救数 ≥ 整包修复且前缀一致", [wholeCut.err, feedAll(splitEvery(cut, 5)).out.slice(0, wholeCut.out.length)], [null, wholeCut.out]);
  // 首对象即被截断 → 0 对象 → llm-bad-json，与整包一致
  const cut1 = text.slice(0, text.indexOf("brace") + 3);
  check("A8 首对象截断 → llm-bad-json", feedAll(splitEvery(cut1, 3)), wholeParse(cut1));
  // 中间坏对象（缺逗号）：坏点之后全部丢弃，与整包抢救语义一致
  const badMid = '[{"label":"aa","meaning":"m"},{"label":"bb" "meaning":"broken"},{"label":"cc","meaning":"m"}]';
  check("A9 中间坏对象：只保留坏点之前", feedAll(splitEvery(badMid, 4)).out.map((c) => c.label), ["aa"]);
  check("A9b 中间坏对象 == 整包抢救", feedAll(splitEvery(badMid, 4)), wholeParse(badMid));
  // 数组闭合后的尾随文本被忽略
  const trailing = '[{"label":"aa","meaning":"m"}]\n以上是候选。[{"label":"zz"}]';
  check("A10 数组闭合后忽略尾随文本", feedAll(splitEvery(trailing, 3)).out.map((c) => c.label), ["aa"]);
  // 错误码
  check("A11 无数组 → llm-bad-output", feedAll(["抱歉，我无法", "生成。"]).err, "llm-bad-output");
  check("A11b 无数组 == 整包错误码", feedAll(["抱歉"]).err, wholeParse("抱歉").err);
  check("A12 空数组 [] → 0 对象无错误", feedAll(["[", "]"]), { out: [], err: null });
  check("A12b 空数组 == 整包", feedAll(["[]"]), wholeParse("[]"));
  check("A13 只有 [ → llm-bad-json", feedAll(["["]).err, "llm-bad-json");
  check("A13b 只有 [ == 整包错误码", feedAll(["["]).err, wholeParse("[").err);
  check("A14 前导杂散 [注] 后仍能解出数组", feedAll(splitEvery('说明[见下]：[{"label":"aa","meaning":"m"}]', 2)).out.map((c) => c.label), ["aa"]);
  const p = new CandidateArrayStreamParser();
  p.push('[{"label":"aa"}]');
  check("A15 闭合后 done=true 且 parsed=1", [p.done, p.parsed], [true, 1]);
  check("A16 闭合后继续 push 不再产出", p.push('[{"label":"bb"}]').length, 0);
}

// ---------- B. SSE 行解析 ----------
{
  check("B1 data 行 → delta.content", sseDeltaContent('data: {"choices":[{"delta":{"content":"[{"}}]}'), "[{");
  check("B2 [DONE] → false", sseDeltaContent("data: [DONE]"), false);
  check("B3 非 data 行（心跳/event）→ null", [sseDeltaContent(": keep-alive"), sseDeltaContent("event: ping"), sseDeltaContent("")], [null, null, null]);
  check("B4 坏 JSON data 行 → null（忽略不中断）", sseDeltaContent("data: {oops"), null);
  check("B5 无 content（role/reasoning 块）→ null", sseDeltaContent('data: {"choices":[{"delta":{"role":"assistant","reasoning_content":"x"}}]}'), null);
  check("B6 空 content 串 → 空串（非 null）", sseDeltaContent('data: {"choices":[{"delta":{"content":""}}]}'), "");
}

// ---------- 通用 mock ----------
const enc = new TextEncoder();
/** 把模型文本切成 delta 分片后包成 SSE 帧，再按字节任意切块（含多字节字符中间），返回 text/event-stream Response */
const sseResponse = (content, { deltaSeed = 11, byteSeed = 5, abortAfterBytes = null, noDone = false } = {}) => {
  const deltas = splitRandom(content, deltaSeed, 6);
  let frames = deltas.map((d) => `data: ${JSON.stringify({ choices: [{ delta: { content: d } }] })}\n\n`).join("");
  frames = ": keep-alive\n\n" + frames + (noDone ? "" : "data: [DONE]\n\n");
  const bytes = enc.encode(frames);
  const r = rng(byteSeed);
  const chunks = [];
  let i = 0;
  while (i < bytes.length) {
    const n = 1 + Math.floor(r() * 23);
    chunks.push(bytes.slice(i, i + n));
    i += n;
  }
  let sent = 0;
  const body = new ReadableStream({
    pull(ctrl) {
      if (chunks.length === 0) return ctrl.close();
      const c = chunks.shift();
      if (abortAfterBytes !== null && sent + c.length > abortAfterBytes) return ctrl.error(new Error("socket-reset"));
      sent += c.length;
      ctrl.enqueue(c);
    },
  });
  return new Response(body, { status: 200, headers: { "content-type": "text/event-stream" } });
};
const jsonResponse = (content, status = 200) =>
  new Response(JSON.stringify({ choices: [{ message: { content } }] }), { status, headers: { "content-type": "application/json" } });

const zhCand = (label, theme, meaning) => ({
  label,
  meaning: meaning ?? `寓意稳载远行，声调平缓，读一遍就能拼出来`,
  theme,
  scores: { length: 80, readability: 80, relevance: 80, brandability: 80 },
});
const enCand = (label, theme, meaning) => ({
  label,
  meaning: meaning ?? `${label} evokes a real word meaning for the product; reads instantly`,
  theme,
  scores: { length: 80, readability: 80, relevance: 80, brandability: 80 },
});
// 各防线逐条命中（沿用 verify-r238 场景 1）+ 多个正常候选保证顺序可观测
const ZH_ALL_GUARDS = [
  zhCand("haoming", "pinyin"),
  zhCand("BAD NAME!", "pinyin"), // invalidLabel
  zhCand("google", "coined"), // brandCollision
  zhCand("yunqi", "pinyin", "「云起」yunqi，云卷云舒之起，声调顺口"),
  zhCand("kongbai", "pinyin", "   "), // emptyMeaning
  zhCand("hanguk", "coined", "코더 스타일的名字，很有极客感"), // charsetViolation
  zhCand("plangrow", "coined", "play 与 grow 结合，寓意边计划边成长"), // phantomEtymology
  zhCand("hunhe", "coined", "这是一个混搭造词，融合了两种风格"), // metaLanguage
  zhCand("yiwen", "coined", "也许取自某个人名？寓意存疑"), // questionMark
  zhCand("xqzvk", "pinyin", "「星球」xqzvk，双字全拼，好读好记"), // pinyinInvalid
  zhCand("tangfang", "pinyin", "「探方」tangfang，双字全拼，声调顺口"), // pinyinMismatch
  zhCand("haoming", "pinyin"), // 同轮重复（不计防线）
  zhCand("lanhai", "pinyin", "「蓝海」lanhai，寓意开阔市场，双字全拼"),
];

const runBoth = async (content, opts, { deltaSeed = 11, byteSeed = 5 } = {}) => {
  const bodies = [];
  const mk = (streaming) => async (_url, init) => {
    bodies.push(JSON.parse(init.body));
    return streaming ? sseResponse(content, { deltaSeed, byteSeed }) : jsonResponse(content);
  };
  globalThis.fetch = mk(false);
  const gPlain = newGuardStats();
  const plain = await generateAiCandidates("desc", "k", { ...opts, guard: gPlain });
  const plainBodies = bodies.splice(0);
  globalThis.fetch = mk(true);
  const gStream = newGuardStats();
  const delivered = [];
  const stream = await generateAiCandidates("desc", "k", { ...opts, guard: gStream, onCandidate: async (c) => void delivered.push(c) });
  return { plain, gPlain, plainBodies, stream, gStream, delivered, streamBodies: bodies.splice(0) };
};

// ---------- C. 流式 vs 非流式等价（zh 全防线） ----------
{
  const content = JSON.stringify(ZH_ALL_GUARDS);
  for (const [deltaSeed, byteSeed] of [[11, 5], [3, 99], [77, 1]]) {
    const r = await runBoth(content, { lang: "zh" }, { deltaSeed, byteSeed });
    check(`C1 (seeds ${deltaSeed}/${byteSeed}) 候选顺序与完整性 == 非流式`, r.stream, r.plain);
    check(`C2 (seeds ${deltaSeed}/${byteSeed}) guard 计数逐项 == 非流式`, r.gStream, r.gPlain);
    check(`C3 (seeds ${deltaSeed}/${byteSeed}) onCandidate 序列 == 返回值`, r.delivered, r.stream);
  }
  const r = await runBoth(content, { lang: "zh" });
  check("C4 保留候选为 haoming/yunqi/lanhai", r.stream.map((c) => c.label), ["haoming", "yunqi", "lanhai"]);
  check("C5 防线丢弃合计 9（重复不计）", Object.values(r.gStream.dropped).reduce((a, b) => a + b, 0), 9);
  check("C6 主轮请求体 stream:true", r.streamBodies.map((b) => b.stream), [true]);
  check("C7 非流式请求体无 stream 字段", r.plainBodies.map((b) => "stream" in b), [false]);
  check("C8 流式一次调用只发 1 个 LLM 请求（usage 计 1 次）", r.streamBodies.length, 1);
}

// ---------- D. 坏 JSON / 中断 / 退化 ----------
{
  // D1：中途坏对象 → 只交出坏点之前，且不重试、不报错
  const good = [zhCand("haoming", "pinyin"), zhCand("yunqi", "pinyin", "「云起」yunqi，云卷云舒之起，声调顺口")];
  const badMid = JSON.stringify(good).slice(0, -1) + ',{"label":"bb" "meaning":"broken"},' + JSON.stringify(zhCand("lanhai", "pinyin", "「蓝海」lanhai，双字全拼")) + "]";
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    return sseResponse(badMid);
  };
  let guard = newGuardStats();
  let delivered = [];
  let out = await generateAiCandidates("desc", "k", { lang: "zh", guard, onCandidate: async (c) => void delivered.push(c.label) });
  check("D1 中途坏对象：保留坏点之前候选", out.map((c) => c.label), ["haoming", "yunqi"]);
  check("D1b 回调序列一致", delivered, ["haoming", "yunqi"]);
  check("D1c 不重试（fetch 1 次，retries 0）", [calls, guard.retries], [1, 0]);
  globalThis.fetch = async () => jsonResponse(badMid);
  const gp = newGuardStats();
  const plain = await generateAiCandidates("desc", "k", { lang: "zh", guard: gp });
  check("D1d 与非流式抢救结果一致", [plain.map((c) => c.label), gp], [out.map((c) => c.label), guard]);

  // D2：整包不可恢复（首对象截断）→ llm-bad-json → 重试一次成功
  calls = 0;
  globalThis.fetch = async () => {
    calls++;
    return calls === 1 ? sseResponse('[{"label":"hao') : sseResponse(JSON.stringify(good));
  };
  guard = newGuardStats();
  delivered = [];
  out = await generateAiCandidates("desc", "k", { lang: "zh", guard, onCandidate: async (c) => void delivered.push(c.label) });
  check("D2 首包 llm-bad-json → 重试成功", [out.map((c) => c.label), calls, guard.retries], [["haoming", "yunqi"], 2, 1]);
  check("D2b 失败首包未向下游交出任何候选", delivered, ["haoming", "yunqi"]);

  // D3：两次都坏 → 抛出 llm-bad-json，分类 upstream；无数组 → llm-bad-output
  for (const [content, code] of [['[{"label":"hao', "llm-bad-json"], ["抱歉，无法生成", "llm-bad-output"]]) {
    calls = 0;
    globalThis.fetch = async () => {
      calls++;
      return sseResponse(content);
    };
    guard = newGuardStats();
    let err = null;
    try {
      await generateAiCandidates("desc", "k", { lang: "zh", guard, onCandidate: async () => undefined });
    } catch (e) {
      err = e;
    }
    check(`D3 ${code}：重试后仍失败原样抛出`, [err?.message, calls, guard.retries, classifyAiError(err)], [code, 2, 1, "upstream"]);
  }

  // D4：HTTP 错误码语义不变（流式请求同样先看 status）
  globalThis.fetch = async () => jsonResponse("", 429);
  let err = null;
  try {
    await generateAiCandidates("desc", "k", { lang: "zh", onCandidate: async () => undefined });
  } catch (e) {
    err = e;
  }
  check("D4 http 429 → llm-http-429 / rate-limit", [err?.message, classifyAiError(err)], ["llm-http-429", "rate-limit"]);

  // D5：读流中断——已有 ≥1 候选 → 按截断保留、不重试；0 候选 → 重试
  const content = JSON.stringify(ZH_ALL_GUARDS);
  const full = sseResponse(content);
  const total = (await full.arrayBuffer()).byteLength;
  calls = 0;
  globalThis.fetch = async () => {
    calls++;
    return sseResponse(content, { abortAfterBytes: Math.floor(total * 0.6) });
  };
  guard = newGuardStats();
  delivered = [];
  out = await generateAiCandidates("desc", "k", { lang: "zh", guard, onCandidate: async (c) => void delivered.push(c.label) });
  check("D5 中断前已有候选 → 保留且不重试", [out.length > 0, out.length < 3, calls, guard.retries, delivered.length === out.length], [true, true, 1, 0, true]);
  calls = 0;
  globalThis.fetch = async () => {
    calls++;
    return calls === 1 ? sseResponse(content, { abortAfterBytes: 40 }) : sseResponse(content);
  };
  guard = newGuardStats();
  out = await generateAiCandidates("desc", "k", { lang: "zh", guard, onCandidate: async () => undefined });
  check("D5b 中断前 0 候选 → 重试一次成功", [out.map((c) => c.label), calls, guard.retries], [["haoming", "yunqi", "lanhai"], 2, 1]);

  // D6：流无 [DONE] 直接 EOF（部分网关）→ 正常收尾
  globalThis.fetch = async () => sseResponse(content, { noDone: true });
  out = await generateAiCandidates("desc", "k", { lang: "zh", onCandidate: async () => undefined });
  check("D6 无 [DONE] 的 EOF 正常收尾", out.map((c) => c.label), ["haoming", "yunqi", "lanhai"]);

  // D7：网关忽略 stream:true 返回整包 JSON → 退化整包解析，结果一致
  globalThis.fetch = async () => jsonResponse(content);
  delivered = [];
  out = await generateAiCandidates("desc", "k", { lang: "zh", onCandidate: async (c) => void delivered.push(c.label) });
  check("D7 非 SSE 响应退化整包解析", [out.map((c) => c.label), delivered], [["haoming", "yunqi", "lanhai"], ["haoming", "yunqi", "lanhai"]]);

  // D8：回调方异常（已交出 1 个后）→ 原样抛出、不重试（避免重复下发）
  calls = 0;
  globalThis.fetch = async () => {
    calls++;
    return sseResponse(content);
  };
  guard = newGuardStats();
  err = null;
  try {
    await generateAiCandidates("desc", "k", {
      lang: "zh",
      guard,
      onCandidate: async () => {
        throw new Error("client-gone");
      },
    });
  } catch (e) {
    err = e;
  }
  check("D8 下游回调异常：不重试原样抛出", [err?.message, calls, guard.retries], ["client-gone", 1, 0]);
}

// ---------- E. 点踩形态过滤 + EN word 补发 ----------
{
  const many = ["haven", "delta", "cider", "eagle", "maple", "penta", "quill", "raven"].map((l) => enCand(l, "coined"));
  const refine = [
    enCand("moyu", "coined", "moyu evokes a calm word meaning for the product; reads instantly"), // 词根冲突 → 丢弃
    enCand("gleanix", "coined"), // 后缀 -x 冲突 → 仅后缀，保留数 ≥6 时不回填
    ...many,
  ];
  const opts = { lang: "zh", round: 2, feedback: { tried: ["moji", "forgex"], taken: [], takenThemes: {}, disliked: [{ label: "moji" }, { label: "forgex" }] } };
  let r = await runBoth(JSON.stringify(refine), opts);
  check("E1 点踩过滤：流式 == 非流式（顺序/完整性）", r.stream.map((c) => c.label), r.plain.map((c) => c.label));
  check("E1b 点踩过滤：dislikedMorphology 计数一致 = 2", [r.gStream.dropped.dislikedMorphology, r.gPlain.dropped.dislikedMorphology], [2, 2]);
  check("E1c 点踩过滤：回调序列 == 返回值", r.delivered, r.stream);
  // 保留不足 6 → 回填仅后缀冲突项（延后到流末，顺序与非流式一致）
  const few = [enCand("gleanix", "coined"), enCand("haven", "coined"), enCand("moyu", "coined", "moyu evokes a calm word meaning for the product; reads instantly"), enCand("delta", "coined"), enCand("penta", "coined")];
  r = await runBoth(JSON.stringify(few), opts);
  check("E2 回填：流式 == 非流式", r.stream.map((c) => c.label), r.plain.map((c) => c.label));
  check("E2b 回填顺序：无冲突项先交出，后缀项流末回填", r.delivered.map((c) => c.label), ["haven", "delta", "penta", "gleanix"]);
  check("E2c 回填后 dislikedMorphology 计数一致 = 1", [r.gStream.dropped.dislikedMorphology, r.gPlain.dropped.dislikedMorphology], [1, 1]);

  // EN word 配额失守 → 主轮流式 + 补发轮非流式；补发候选在主轮之后按序回调
  const noWord = ["alpha", "bravo", "cider", "delta", "eagle", "maple", "gale", "haven"].map((l, i) => enCand(l, i % 2 === 0 ? "coined" : "blend"));
  const supplement = [enCand("anvil", "word", "A real English word: the blacksmith's anvil, metaphor for a solid build tool; reads instantly"), enCand("google", "word")];
  const bodies = [];
  let calls = 0;
  globalThis.fetch = async (_u, init) => {
    calls++;
    bodies.push(JSON.parse(init.body));
    return calls === 1 ? sseResponse(JSON.stringify(noWord)) : jsonResponse(JSON.stringify(supplement));
  };
  const guard = newGuardStats();
  const delivered = [];
  const out = await generateAiCandidates("a note-taking app", "k", { lang: "en", guard, onCandidate: async (c) => void delivered.push(c.label) });
  check("E3 补发触发且合并到主结果之后", [guard.wordSupplement, out.at(-1).label], [true, "anvil"]);
  check("E3b 补发候选在主轮全部候选之后回调", delivered, out.map((c) => c.label));
  check("E3c 补发轮请求非流式（无 stream 字段）", bodies.map((b) => b.stream === true), [true, false]);
  check("E3d 补发轮丢弃计入 supplementDropped，主轮 dropped 不受影响", [guard.supplementDropped.brandCollision, guard.dropped.brandCollision], [1, 0]);
}

// ---------- F. worker /api/ai-search 端到端 ----------
{
  const kv = new Map();
  const fakeKv = {
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
  };
  const cands = [zhCand("haoming", "pinyin"), zhCand("yunqi", "pinyin", "「云起」yunqi，云卷云舒之起，声调顺口"), zhCand("lanhai", "pinyin", "「蓝海」lanhai，寓意开阔市场，双字全拼")];
  const taken = new Set(["haoming.com", "lanhai.cn"]);
  let llmCalls = 0;
  const llmBodies = [];
  globalThis.fetch = async (url, init) => {
    const u = String(url);
    if (u.endsWith("/chat/completions")) {
      const body = JSON.parse(init.body);
      llmBodies.push(body);
      if (body.stream === true) {
        llmCalls++;
        return sseResponse(JSON.stringify(cands));
      }
      // understanding 调用（非流式，与本轮无关）
      return jsonResponse(JSON.stringify({ core: "测试", style: "简洁", scene: "自检" }));
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
    body: JSON.stringify({ description: "面向中小商家的云端记账工具", tlds: ["com", "cn"], target: 3, lang: "zh", fast: true }),
  });
  const res = await worker.fetch(req, { DEEPSEEK_API_KEY: "k", CACHE: fakeKv, ASSETS: { fetch: async () => new Response("", { status: 404 }) } }, ctx);
  check("F1 /api/ai-search 200", res.status, 200);
  const events = (await res.text()).trim().split("\n").map((l) => JSON.parse(l));
  await Promise.all(pending);
  const types = events.map((e) => e.type ?? (e.domain ? "result" : "?"));
  check("F2 首事件 round，末事件 done", [types[0], types.at(-1)], ["round", "done"]);
  const proposed = events.filter((e) => e.type === "proposed");
  check("F3 每候选一条 proposed（items 单项、无 guard）+ 末尾一条空 items 带 guard 汇总", proposed.map((e) => [e.items.length, "guard" in e]), [[1, false], [1, false], [1, false], [0, true]]);
  check("F3b 汇总 guard 形状完整（dropped/supplementDropped/retries）", ["dropped", "supplementDropped", "retries"].every((k) => k in proposed.at(-1).guard), true);
  check("F3c proposed 候选顺序 == LLM 输出顺序", proposed.flatMap((e) => e.items.map((i) => i.label)), ["haoming", "yunqi", "lanhai"]);
  check("F3d proposed 事件结构字段与旧前端一致（type/round/items/tlds）", Object.keys(proposed[0]).sort(), ["items", "round", "tlds", "type"]);
  const results = events.filter((e) => e.domain);
  check("F4 result 事件覆盖全部 6 个域名", results.map((e) => e.domain).sort(), ["haoming.cn", "haoming.com", "lanhai.cn", "lanhai.com", "yunqi.cn", "yunqi.com"]);
  check("F4b result 状态与 mock 一致", results.filter((e) => e.status === "taken").map((e) => e.domain).sort(), ["haoming.com", "lanhai.cn"]);
  check("F4c result 携带 meaning/theme/round", results.every((e) => typeof e.meaning === "string" && e.theme === "pinyin" && e.round === 1), true);
  // 顺序约束：每个域名的 result 必须在其 label 的 proposed 之后；guard 汇总必须在所有 result 之后（本轮）
  const idxProposed = new Map();
  events.forEach((e, i) => e.type === "proposed" && e.items.forEach((it) => idxProposed.set(it.label, i)));
  check("F5 每个 result 在其候选 proposed 之后", events.every((e, i) => !e.domain || i > idxProposed.get(e.domain.split(".")[0])), true);
  const summaryIdx = events.findIndex((e) => e.type === "proposed" && e.items.length === 0);
  const firstResultIdx = events.findIndex((e) => e.domain);
  check("F5b 首个 result 早于 guard 汇总（不等整包）", firstResultIdx < summaryIdx, true);
  check("F5c 首候选 proposed 早于第 3 个候选 proposed 之前的 result 下发（增量流水）", idxProposed.get("haoming") < idxProposed.get("lanhai"), true);
  check("F6 LLM 主轮调用 1 次（round 1 即达标 target=3 → 无第二轮）", llmCalls, 1);
  check("F6b 主轮请求 stream:true，understanding 请求非流式", llmBodies.map((b) => b.stream === true).sort(), [false, true]);
  const day = new Date().toISOString().slice(0, 10);
  const usage = JSON.parse(kv.get(`usage:${day}`) ?? "null");
  check("F7 usage 只计 1 次搜索", [usage?.searches, usage?.fast], [1, 1]);
  check("F7b stats:checked = 核验域名数 6", kv.get("stats:checked"), "6");
  check("F8 无 error 事件", events.some((e) => e.type === "error"), false);
}

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
