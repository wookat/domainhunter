import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// 审计/回归留档（docs/audits, docs/qa）里的请求体、localStorage 转储会带上分享撤销 token
// （`{"token":"..."}` / `dh:myShares:v1`）。token 一旦入库任何人都能撤销该分享，且会触发
// GitGuardian 高熵告警。留档前必须替换为 <redacted-share-token>。
const DOCS_ROOT = path.join(__dirname, "../../../docs");
const SCAN_DIRS = ["audits", "qa"];
const TEXT_EXT = new Set([".json", ".md", ".txt", ".log", ".csv", ".html"]);
const TOKEN_RE = /\\?"(?:token|revokeToken)\\?":\\?"[A-Za-z0-9_-]{16,}\\?"/g;

function walk(dir: string, out: string[]): string[] {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (TEXT_EXT.has(path.extname(name))) out.push(p);
  }
  return out;
}

describe("docs artifacts carry no share revoke tokens", () => {
  it("scans docs/audits and docs/qa", () => {
    const files = SCAN_DIRS.flatMap((d) => walk(path.join(DOCS_ROOT, d), []));
    expect(files.length).toBeGreaterThan(0);
    const hits: string[] = [];
    for (const f of files) {
      const text = readFileSync(f, "utf8");
      for (const m of text.matchAll(TOKEN_RE)) hits.push(`${path.relative(DOCS_ROOT, f)}: ${m[0].slice(0, 40)}…`);
    }
    expect(hits).toEqual([]);
  });
});
