// R267 quota 态抑制「再来一轮」等 AI 入口的自检脚本（无测试框架，独立 node 脚本，0 真实 AI 调用）
// 用法：node scripts/verify-r267.mjs
// 覆盖：
// 1. SSR 渲染断言：quotaExhausted=true 时结果区「再来一轮」（顶部 + 底部 sticky）disabled 并显示
//    双语提示（results.moreQuota），UnderstandingBar refine chips 全部 disabled；
//    quotaExhausted=false 时无 disabled、无提示，行为不变。
// 2. 端到端：本地 mock 上游返回 402 + wrangler dev，POST /api/ai-search 断言流内 error 事件
//    errorKind === "quota"，且请求只打到本地 mock（0 次真实 AI 调用）。
import { mkdirSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const webRequire = createRequire(path.join(root, "apps/web/package.json"));
const viteRequire = createRequire(webRequire.resolve("vite/package.json"));
const { build } = viteRequire("esbuild");

let failed = 0;
const check = (name, ok, extra = "") => {
  if (ok) console.log(`PASS ${name}`);
  else {
    failed++;
    console.log(`FAIL ${name}${extra ? `: ${extra}` : ""}`);
  }
};

// ---- 1. SSR 渲染断言 ----
// entry 放在 apps/web 下，确保 react/react-dom 按 pnpm 工作区依赖解析
const entry = path.join(root, "apps/web/.r267-entry.tsx");
const tmp = path.join(root, "scripts/.r267-compiled.mjs");
writeFileSync(
  entry,
  `
import { renderToStaticMarkup } from "react-dom/server";
import { I18nProvider } from "@/lib/i18n";
import { ResultsPage } from "@/components/results-page";
import { UnderstandingBar } from "@/components/understanding-bar";

export function render(quotaExhausted: boolean): string {
  return renderToStaticMarkup(
    <I18nProvider>
      <UnderstandingBar understanding={null} fallback="fallback" onRefine={() => undefined} running={false} quotaExhausted={quotaExhausted} />
      <ResultsPage
        rows={[]}
        description="测试需求"
        tlds={["com"]}
        style=""
        lengthPref=""
        roundCount={1}
        locked={new Set<string>()}
        onToggleLock={() => undefined}
        shortlistHas={() => false}
        onToggleFavorite={() => undefined}
        onAddFavorites={() => undefined}
        onMore={() => undefined}
        onMoreAroundLocked={() => undefined}
        running={false}
        quotaExhausted={quotaExhausted}
        dislikedHas={() => false}
        onToggleDislike={() => undefined}
      />
    </I18nProvider>,
  );
}
`,
);
await build({
  entryPoints: [entry],
  bundle: true,
  format: "esm",
  outfile: tmp,
  jsx: "automatic",
  alias: { "@": path.join(root, "apps/web/src") },
  platform: "browser",
  define: { "process.env.NODE_ENV": '"production"' },
});
const { render } = await import(tmp);
rmSync(entry);
rmSync(tmp);

const htmlQuota = render(true);
const htmlNormal = render(false);
const countDisabled = (html) => (html.match(/disabled=""/g) ?? []).length;

// Node 的 navigator.language 可能是 en，loadLang 会选 en 文案，两种语言都接受
const quotaHint = /AI 配额受限|AI quota limited/;
check("quota 态：显示双语提示 results.moreQuota", quotaHint.test(htmlQuota));
// 顶部再来一轮 + 底部 sticky 再来一轮 + 4 个 refine chips ≥ 6 个 disabled
check("quota 态：再来一轮与 refine chips 全部 disabled（≥6）", countDisabled(htmlQuota) >= 6, `got ${countDisabled(htmlQuota)}`);
check("quota 态：按钮带 title 提示", /title="AI (配额受限|quota limited)/.test(htmlQuota));
check("正常态：无 disabled", countDisabled(htmlNormal) === 0, `got ${countDisabled(htmlNormal)}`);
check("正常态：不显示 quota 提示", !quotaHint.test(htmlNormal));

// ---- 2. 端到端：mock 上游 402 + wrangler dev ----
const MOCK_PORT = 8402;
const DEV_PORT = 8790;
let mockHits = 0;
const mock = createServer((req, res) => {
  mockHits++;
  res.writeHead(402, { "content-type": "application/json" });
  res.end(JSON.stringify({ error: { message: "Insufficient Balance" } }));
});
await new Promise((r) => mock.listen(MOCK_PORT, "127.0.0.1", r));

// wrangler dev 的 ASSETS 需要 dist 目录存在；本脚本只测 /api，占位 index.html 即可
const dist = path.join(root, "apps/web/dist");
if (!existsSync(dist)) {
  mkdirSync(dist, { recursive: true });
  writeFileSync(path.join(dist, "index.html"), "<!doctype html><title>placeholder</title>");
}

const dev = spawn(
  "pnpm",
  [
    "exec", "wrangler", "dev",
    "--port", String(DEV_PORT),
    "--var", "DEEPSEEK_API_KEY:test-key-not-real",
    "--var", `LLM_API_BASE:http://127.0.0.1:${MOCK_PORT}`,
  ],
  { cwd: path.join(root, "apps/web"), stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, CI: "1" } },
);
let devLog = "";
dev.stdout.on("data", (d) => (devLog += d));
dev.stderr.on("data", (d) => (devLog += d));

const deadline = Date.now() + 60_000;
let ready = false;
while (Date.now() < deadline && !ready) {
  await new Promise((r) => setTimeout(r, 1000));
  try {
    const res = await fetch(`http://127.0.0.1:${DEV_PORT}/`, { signal: AbortSignal.timeout(2000) });
    if (res.ok || res.status === 404) ready = true;
  } catch { /* not ready yet */ }
}
check("wrangler dev 启动", ready, devLog.slice(-500));

if (ready) {
  const res = await fetch(`http://127.0.0.1:${DEV_PORT}/api/ai-search`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ description: "R267 quota 验证", tlds: ["com"], lang: "zh", target: 10 }),
    signal: AbortSignal.timeout(30_000),
  });
  check("/api/ai-search 返回 200 流", res.ok, `status ${res.status}`);
  const text = await res.text();
  const events = text.split("\n").filter(Boolean).map((l) => JSON.parse(l));
  const errEv = events.find((e) => e.type === "error");
  check("流内 error 事件 errorKind === quota", errEv?.errorKind === "quota", JSON.stringify(errEv));
  check("mock 上游被调用（0 次真实 AI 调用）", mockHits >= 1, `hits ${mockHits}`);
  check("error detail 不泄漏上游响应体", !text.includes("Insufficient Balance"));
}

dev.kill("SIGTERM");
mock.close();

if (failed > 0) {
  console.log(`\n${failed} check(s) FAILED`);
  process.exit(1);
}
console.log("\nAll R267 checks passed");
process.exit(0);
