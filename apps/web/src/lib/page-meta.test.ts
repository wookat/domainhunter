/**
 * R556（R553 P3-1）：SPA 水合后 `<html lang>` 与 `<meta property="og:locale">` 必须一起随解析语言切换。
 * 现状证据（生产 2026-09-06，英文浏览器 + 存储语言 zh，/s/X2fS7m5wSI 410 与 /s/nope-r553 404）：
 * SSR 壳 en/en_US → 水合后 `<html lang>`=zh-CN、title 已 zh，og:locale 仍 en_US；反向（zh 浏览器 + 存储 en）亦漂移为 en/zh_CN。
 * 根因：i18n.tsx 的语言 effect 只写 documentElement.lang，从未碰 og:locale。
 */
import { describe, expect, it } from "vitest";

import { HTML_LANG, OG_LOCALE, OG_LOCALE_SELECTOR, applyLangMeta, type LangMetaDocument } from "./page-meta";
import { shareDocTitle } from "./i18n";

/** 模拟 SSR 壳：`<html lang>` 与 og:locale 由 worker 按 Accept-Language 写成某一语言 */
function shell(lang: "zh" | "en") {
  const meta: Record<string, string> = { content: OG_LOCALE[lang] };
  const doc: LangMetaDocument = {
    documentElement: { lang: HTML_LANG[lang] },
    querySelector: (sel) => (sel === OG_LOCALE_SELECTOR ? { setAttribute: (k, v) => void (meta[k] = v) } : null),
  };
  return { doc, meta };
}

describe("applyLangMeta：<html lang> / og:locale 同一来源", () => {
  it("取值表与 worker SSR 壳一致（share-shell.test.ts 断言的 zh-CN/zh_CN、en/en_US）", () => {
    expect(HTML_LANG).toEqual({ zh: "zh-CN", en: "en" });
    expect(OG_LOCALE).toEqual({ zh: "zh_CN", en: "en_US" });
  });

  it("SSR 壳语言 ≠ SPA 语言时两项一起切（en 壳 → zh；zh 壳 → en）", () => {
    const a = shell("en");
    applyLangMeta(a.doc, "zh");
    expect(a.doc.documentElement.lang).toBe("zh-CN");
    expect(a.meta.content).toBe("zh_CN");

    const b = shell("zh");
    applyLangMeta(b.doc, "en");
    expect(b.doc.documentElement.lang).toBe("en");
    expect(b.meta.content).toBe("en_US");
  });

  it("壳语言 == SPA 语言时幂等", () => {
    for (const lang of ["zh", "en"] as const) {
      const s = shell(lang);
      applyLangMeta(s.doc, lang);
      expect(s.doc.documentElement.lang).toBe(HTML_LANG[lang]);
      expect(s.meta.content).toBe(OG_LOCALE[lang]);
    }
  });

  it("壳里没有 og:locale 标签时只改 <html lang>，不抛错", () => {
    const doc: LangMetaDocument = { documentElement: { lang: "en" }, querySelector: () => null };
    expect(() => applyLangMeta(doc, "zh")).not.toThrow();
    expect(doc.documentElement.lang).toBe("zh-CN");
  });

  it("/s/:id 三态 × zh/en：og:locale、<html lang>、title 三者语言一致（同一 lang 输入）", () => {
    const expectTitleLang = { zh: /分享|可注册|域名/, en: /share|domain/i } as const;
    for (const state of ["ready", "revoked", "notFound"] as const) {
      for (const lang of ["zh", "en"] as const) {
        const s = shell(lang === "zh" ? "en" : "zh");
        applyLangMeta(s.doc, lang);
        const title = shareDocTitle(state, lang, [{ status: "available" }]);
        expect(s.doc.documentElement.lang).toBe(HTML_LANG[lang]);
        expect(s.meta.content).toBe(OG_LOCALE[lang]);
        expect(title).toMatch(expectTitleLang[lang]);
      }
    }
  });
});
