// R264 AI 上游错误分类自检脚本（无测试框架，独立 node 脚本，0 生产 AI 调用）
// 用法：node scripts/verify-r264.mjs
// 覆盖：classifyAiError 对 llm-http-401/402/403/429/4xx/5xx、llm-bad-json/output、
// 网络失败（TypeError）与超时（TimeoutError）的分类，以及经 generateAiCandidates
// mock fetch 端到端抛错后分类结果的正确性（不泄漏响应体）。
// 通过 esbuild（vite 自带依赖，非新增）把 apps/web/src/ai.ts 打包后动态加载
import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const webRequire = createRequire(path.join(root, "apps/web/package.json"));
const viteRequire = createRequire(webRequire.resolve("vite/package.json"));
const { build } = viteRequire("esbuild");
const tmp = path.join(root, "scripts/.ai-r264-compiled.mjs");
await build({
  entryPoints: [path.join(root, "apps/web/src/ai.ts")],
  bundle: true,
  format: "esm",
  outfile: tmp,
});
const { classifyAiError, generateAiCandidates, newGuardStats } = await import(tmp);
rmSync(tmp);

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

// ---- 1. HTTP 状态码分类：quota / rate-limit / upstream ----
check("402 欠费 → quota", classifyAiError(new Error("llm-http-402")), "quota");
check("401 认证失败 → quota", classifyAiError(new Error("llm-http-401")), "quota");
check("403 → quota", classifyAiError(new Error("llm-http-403")), "quota");
check("429 限流 → rate-limit", classifyAiError(new Error("llm-http-429")), "rate-limit");
check("500 → upstream", classifyAiError(new Error("llm-http-500")), "upstream");
check("502 → upstream", classifyAiError(new Error("llm-http-502")), "upstream");
check("503 → upstream", classifyAiError(new Error("llm-http-503")), "upstream");
check("400 其他 4xx → upstream", classifyAiError(new Error("llm-http-400")), "upstream");

// ---- 2. 坏输出/坏 JSON：上游内容故障，可重试 → upstream ----
check("llm-bad-json → upstream", classifyAiError(new Error("llm-bad-json")), "upstream");
check("llm-bad-output → upstream", classifyAiError(new Error("llm-bad-output")), "upstream");

// ---- 3. 网络失败与超时 → network ----
check("fetch TypeError → network", classifyAiError(new TypeError("fetch failed")), "network");
const timeoutErr = new Error("The operation timed out");
timeoutErr.name = "TimeoutError";
check("AbortSignal.timeout → network", classifyAiError(timeoutErr), "network");
const abortErr = new Error("aborted");
abortErr.name = "AbortError";
check("AbortError → network", classifyAiError(abortErr), "network");

// ---- 4. 其他未知错误 → unknown ----
check("未知错误 → unknown", classifyAiError(new Error("something else")), "unknown");
check("非 Error 值 → unknown", classifyAiError("weird"), "unknown");

// ---- 5. String(e) 包装形态（worker catch 中 detail 用 String(e)）不影响分类 ----
check("字符串形态 'Error: llm-http-402' → quota", classifyAiError("Error: llm-http-402"), "quota");

// ---- 6. 端到端：mock fetch 返回 402/429，generateAiCandidates 重试后抛错的分类 ----
const g = globalThis;
const realFetch = g.fetch;
const mockStatus = (status) => async () =>
  new Response(JSON.stringify({ error: { message: "secret upstream detail should not leak" } }), { status });

g.fetch = mockStatus(402);
try {
  const guard = newGuardStats();
  let kind = null;
  let detail = "";
  try {
    await generateAiCandidates("测试需求", "invalid-key", { guard });
  } catch (e) {
    kind = classifyAiError(e);
    detail = String(e);
  }
  check("端到端 402：分类为 quota", kind, "quota");
  check("端到端 402：既有 retries 行为不变（重试 1 次）", guard.retries, 1);
  check("端到端 402：detail 不含上游响应体", detail.includes("secret upstream detail"), false);
  check("端到端 402：detail 不含 key", detail.includes("invalid-key"), false);
} finally {
  g.fetch = realFetch;
}

g.fetch = mockStatus(429);
try {
  let kind = null;
  try {
    await generateAiCandidates("测试需求", "invalid-key", { guard: newGuardStats() });
  } catch (e) {
    kind = classifyAiError(e);
  }
  check("端到端 429：分类为 rate-limit", kind, "rate-limit");
} finally {
  g.fetch = realFetch;
}

// ---- 6b. 网关用 429 承载密钥额度耗尽（如 apikey_quota_exhausted）→ quota，且 detail 不泄漏响应体 ----
g.fetch = async () =>
  new Response(JSON.stringify({ error: { message: "ApiKey已触发限额", type: "quota_error", code: "apikey_quota_exhausted" } }), { status: 429 });
try {
  let kind = null;
  let detail = "";
  try {
    await generateAiCandidates("测试需求", "invalid-key", { guard: newGuardStats() });
  } catch (e) {
    kind = classifyAiError(e);
    detail = String(e);
  }
  check("端到端 429+quota 体：分类为 quota", kind, "quota");
  check("端到端 429+quota 体：detail 不含上游响应体", detail.includes("apikey_quota_exhausted"), false);
  check("端到端 429+quota 体：detail 不含 key", detail.includes("invalid-key"), false);
} finally {
  g.fetch = realFetch;
}

// ---- 7. 端到端：正常成功路径不受影响 ----
g.fetch = async () =>
  new Response(
    JSON.stringify({
      choices: [
        {
          message: {
            content: JSON.stringify([
              { label: "muzhou", meaning: "「木舟」muzhou，双字全拼，寓意稳载远行，声调平缓，读一遍就能拼出来", theme: "pinyin", scores: { length: 90, readability: 88, relevance: 85, brandability: 80 } },
            ]),
          },
        },
      ],
    }),
    { status: 200 },
  );
try {
  const guard = newGuardStats();
  const out = await generateAiCandidates("测试需求", "invalid-key", { guard });
  check("端到端成功路径：正常返回候选", out.length, 1);
  check("端到端成功路径：无重试", guard.retries, 0);
} finally {
  g.fetch = realFetch;
}

if (failed > 0) {
  console.log(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log("\nAll checks passed");
