import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AdvancedPage, bulkProgressLabel } from "./advanced-page";
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
