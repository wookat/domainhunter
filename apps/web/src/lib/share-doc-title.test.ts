/**
 * R550：/s/:id 水合后 document.title 必须随 SPA 语言（?lang → 存储 → navigator.language）且与 SSR 壳同一份文案。
 * R546 T7：浏览器 Accept-Language=en 而存储语言 zh 时，壳 title 留在英文、正文中文——因 SharePage 从不改写 title。
 */
import { describe, expect, it } from "vitest";

import { shareGoneMeta, shareSsrTitle } from "../share-items";
import { shareDocTitle } from "./i18n";

const LANGS = ["zh", "en"] as const;

describe("shareDocTitle：三种分享状态 × zh/en 与 SSR 壳逐字一致", () => {
  for (const lang of LANGS) {
    it(`${lang}: revoked / notFound 与 shareGoneMeta 相同`, () => {
      expect(shareDocTitle("revoked", lang)).toBe(shareGoneMeta("revoked", lang).title);
      expect(shareDocTitle("notFound", lang)).toBe(shareGoneMeta("notFound", lang).title);
    });

    it(`${lang}: ready 与 shareSsrTitle 相同（全可注册 / 含无状态）`, () => {
      const avail = [{ status: "available" as const }, { status: "available" as const }];
      const mixed = [{ status: "available" as const }, {}];
      expect(shareDocTitle("ready", lang, avail)).toBe(shareSsrTitle(avail, lang));
      expect(shareDocTitle("ready", lang, mixed)).toBe(shareSsrTitle(mixed, lang));
    });
  }

  it("zh/en 文案互不相同（切语言必然改 title）", () => {
    for (const state of ["revoked", "notFound"] as const) expect(shareDocTitle(state, "zh")).not.toBe(shareDocTitle(state, "en"));
    const items = [{ status: "available" as const }];
    expect(shareDocTitle("ready", "zh", items)).not.toBe(shareDocTitle("ready", "en", items));
  });

  it("六组期望值（Playwright 本地对照表）", () => {
    expect(shareDocTitle("revoked", "zh")).toBe("分享已撤销 | DomainHunter");
    expect(shareDocTitle("revoked", "en")).toBe("This share has been revoked | DomainHunter");
    expect(shareDocTitle("notFound", "zh")).toBe("分享不存在或已过期 | DomainHunter");
    expect(shareDocTitle("notFound", "en")).toBe("Share not found or expired | DomainHunter");
    const two = [{ status: "available" as const }, { status: "available" as const }];
    expect(shareDocTitle("ready", "zh", two)).toBe("2 个可注册域名候选 | DomainHunter");
    expect(shareDocTitle("ready", "en", two)).toBe("2 available domain candidates | DomainHunter");
  });
});
