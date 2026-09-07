import { describe, expect, it } from "vitest";

import { parseVariantName } from "./mcp-args";

describe("parseVariantName（MCP suggest_variants name 校验）", () => {
  it("含「.」的输入明确报错（zh/en），不再静默去点成 zalizecom", () => {
    for (const raw of ["zalize.com", " Zalize.COM ", "a.b.c", "zalize.", ".cn"]) {
      const r = parseVariantName(raw);
      expect(r.ok, raw).toBe(false);
      if (r.ok) continue;
      expect(r.error).toContain("without TLD");
      expect(r.error).toContain("check_domains");
      expect(r.error).toContain("不含后缀");
      expect(r.error).not.toContain("zalizecom");
    }
    const r = parseVariantName("zalize.com");
    if (!r.ok) expect(r.error).toContain('e.g. "zalize"');
  });

  it("裸名字正常归一化（大小写/空白/非法字符）", () => {
    expect(parseVariantName(" Zalize ")).toEqual({ ok: true, name: "zalize" });
    expect(parseVariantName("my_brand!")).toEqual({ ok: true, name: "mybrand" });
    expect(parseVariantName("acme-hq")).toEqual({ ok: true, name: "acme-hq" });
  });

  it("空 / 过短 / 非字符串仍报错", () => {
    for (const raw of ["", "a", "!", undefined, null, 7]) {
      const r = parseVariantName(raw);
      expect(r.ok, String(raw)).toBe(false);
      if (!r.ok) expect(r.error).toContain("2+ chars");
    }
  });
});
