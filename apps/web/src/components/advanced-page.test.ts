import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AdvancedPage, advanceBulkProgress, bulkProgressLabel, finishBulkProgress, startBulkProgress, type BulkProgress } from "./advanced-page";
import { I18nProvider, interpolate, type TFunc } from "@/lib/i18n";

const noop = () => undefined;

// Node 22 自带 navigator.language=en-US；用 localStorage 桩固定语言（SSR 不跑 effect，不会写回）
function setLang(lang: "zh" | "en") {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: { getItem: (k: string) => (k === "domainhunter:lang" ? lang : null), setItem: noop, removeItem: noop },
  });
}

function render(lang: "zh" | "en"): string {
  setLang(lang);
  return renderToStaticMarkup(createElement(I18nProvider, null, createElement(AdvancedPage, { shortlist: { has: () => false, toggle: noop } })));
}

const text = (html: string, re: RegExp) => html.match(re)?.[1] ?? null;

/** worker.ts 里 /advanced SSR 骨架的两份文案（不 import worker：它依赖 Workers 专有模块） */
function ssrCopy(lang: "zh" | "en"): { title: string; subtitle: string } {
  const src = readFileSync(new URL("../worker.ts", import.meta.url), "utf8");
  const m = src.match(new RegExp(`${lang}: \\{ title: "([^"]+)", subtitle: "([^"]+)" \\}`));
  if (!m) throw new Error(`ADVANCED_SSR.${lang} not found in worker.ts`);
  return { title: m[1], subtitle: m[2] };
}

describe("AdvancedPage 命名与布局（P3-2）", () => {
  for (const lang of ["zh", "en"] as const) {
    it(`${lang}：h1/副标题与 worker SSR 骨架逐字同源，且不再叫「高级模式」`, () => {
      const html = render(lang);
      const h1 = text(html, /<h1[^>]*>([^<]*)<\/h1>/);
      const sub = text(html, /<p class="mt-1 text-sm text-txt1">([^<]*)<\/p>/);
      expect(h1).toBe(ssrCopy(lang).title);
      expect(sub?.replace(/&#x27;|&quot;/g, "")).toBe(ssrCopy(lang).subtitle.replace(/'/g, ""));
      expect(h1).not.toMatch(/高级模式|Advanced mode/);
    });
  }

  it("批量粘贴框在 DOM 中先于组合器 roots 输入（375 首屏先看到粘贴框，Tab 顺序同步）", () => {
    const html = render("zh");
    const bulk = html.indexOf('id="advanced-bulk"');
    const roots = html.indexOf('id="advanced-roots"');
    expect(bulk).toBeGreaterThan(-1);
    expect(roots).toBeGreaterThan(-1);
    expect(bulk).toBeLessThan(roots);
  });

  it("粘贴提示写明当前 TLD（默认 com, cn），不再指向「上方」", () => {
    const html = render("zh");
    expect(html).toContain("按 TLD（当前 com, cn）展开");
    expect(html).not.toContain("按上方 TLD");
  });

  it("未开始核验时不渲染进度区", () => {
    expect(render("zh")).not.toContain('data-testid="bulk-progress"');
  });
});

describe("bulkProgressLabel（P3-3）", () => {
  const dict: Record<string, string> = {
    "adv.progress": "核验中 {done}/{total}",
    "adv.progressOpen": "已核验 {done} 个",
    "adv.progressDone": "已完成 {done}/{total}",
    "adv.progressDoneOpen": "已完成，共核验 {done} 个",
  };
  const t: TFunc = (key, vars) => interpolate(dict[key] ?? key, vars);

  it("已知 total：运行中 x/N，结束后「已完成 N/N」", () => {
    expect(bulkProgressLabel({ done: 12, total: 28 }, true, t)).toBe("核验中 12/28");
    expect(bulkProgressLabel({ done: 0, total: 28 }, true, t)).toBe("核验中 0/28");
    expect(bulkProgressLabel({ done: 28, total: 28 }, false, t)).toBe("已完成 28/28");
  });

  it("未知 total（组合器路径）：只报已核验数，不伪造分母", () => {
    expect(bulkProgressLabel({ done: 7 }, true, t)).toBe("已核验 7 个");
    expect(bulkProgressLabel({ done: 7 }, false, t)).toBe("已完成，共核验 7 个");
  });
});

describe("批量进度末帧单一状态源（R570 P3-3：不再出现「核验中 N/N」再变「已完成 N/N」）", () => {
  const dict: Record<string, string> = {
    "adv.progress": "核验中 {done}/{total}",
    "adv.progressOpen": "已核验 {done} 个",
    "adv.progressDone": "已完成 {done}/{total}",
    "adv.progressDoneOpen": "已完成，共核验 {done} 个",
  };
  const t: TFunc = (key, vars) => interpolate(dict[key] ?? key, vars);
  const label = (p: BulkProgress) => bulkProgressLabel(p, !p.finished, t);

  it("已知 total：逐 chunk 推进，凑齐 total 的那次更新即 finished，文案直接「已完成 20/20」", () => {
    let p: BulkProgress | null = startBulkProgress(20);
    expect(p).toEqual({ done: 0, total: 20, finished: false });
    const seen: string[] = [label(p)];
    for (const chunk of [3, 1, 1, 1, 5, 4, 3, 2]) {
      p = advanceBulkProgress(p, chunk);
      seen.push(label(p));
    }
    expect(p).toEqual({ done: 20, total: 20, finished: true });
    expect(seen.at(-1)).toBe("已完成 20/20");
    expect(seen).not.toContain("核验中 20/20");
    expect(seen.filter((s) => s.startsWith("已完成"))).toHaveLength(1);
  });

  it("流结束时 finishBulkProgress 对已完成进度返回同一引用（不触发多余 render），未完成的补置 finished", () => {
    const done = advanceBulkProgress(startBulkProgress(2), 2);
    expect(finishBulkProgress(done)).toBe(done);
    const partial = advanceBulkProgress(startBulkProgress(5), 3);
    expect(finishBulkProgress(partial)).toEqual({ done: 3, total: 5, finished: true });
    expect(label(finishBulkProgress(partial)!)).toBe("已完成 3/5");
    expect(finishBulkProgress(null)).toBeNull();
  });

  it("未知 total（组合器路径）：chunk 到达不置 finished，只在流结束时置位", () => {
    let p = startBulkProgress(undefined);
    p = advanceBulkProgress(p, 4);
    p = advanceBulkProgress(p, 3);
    expect(p.finished).toBe(false);
    expect(label(p)).toBe("已核验 7 个");
    const end = finishBulkProgress(p)!;
    expect(end.finished).toBe(true);
    expect(label(end)).toBe("已完成，共核验 7 个");
  });

  it("组件进度区只读 progress.finished：源码里 spinner/文案不再由 running 分叉", () => {
    const src = readFileSync(new URL("./advanced-page.tsx", import.meta.url), "utf8");
    const block = src.slice(src.indexOf('data-testid="bulk-progress"'), src.indexOf("role=\"progressbar\""));
    expect(block).toContain("progress.finished");
    expect(block).toContain("bulkProgressLabel(progress, !progress.finished, t)");
    expect(block).not.toMatch(/\{running \?/);
  });
});
