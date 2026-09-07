import { describe, expect, it } from "vitest";

import { sanitizeShareItem, shareSsrTitle } from "./share-items";

describe("sanitizeShareItem：status 可选，且兼容旧快照", () => {
  it("合法 status 原样保留（available/taken/unknown）", () => {
    for (const status of ["available", "taken", "unknown"] as const) {
      expect(sanitizeShareItem({ domain: "zalize.com", status })?.status).toBe(status);
    }
  });

  it("旧快照 / 非法 status 不落字段（不能被当成可注册）", () => {
    expect(sanitizeShareItem({ domain: "zalize.com" })).toEqual({ domain: "zalize.com", label: "zalize", tld: "com" });
    expect(sanitizeShareItem({ domain: "zalize.com", status: "checking" })?.status).toBeUndefined();
    expect(sanitizeShareItem({ domain: "zalize.com", status: 1 })?.status).toBeUndefined();
  });

  it("其他字段行为不变：meaning 截断、scores 需四项齐全", () => {
    const it1 = sanitizeShareItem({ domain: "Zalize.COM ", meaning: "x".repeat(400), scores: { length: 90, readability: 80, relevance: 70, brandability: 60.4 } });
    expect(it1?.domain).toBe("zalize.com");
    expect(it1?.meaning?.length).toBe(300);
    expect(it1?.scores).toEqual({ length: 90, readability: 80, relevance: 70, brandability: 60 });
    expect(sanitizeShareItem({ domain: "zalize.com", scores: { length: 90 } })?.scores).toBeUndefined();
    expect(sanitizeShareItem({ domain: "not a domain" })).toBeNull();
  });
});

describe("sanitizeShareItem：R565 expiresAt / note 透传", () => {
  it("taken + 可解析日期 → 归一为 ISO；非 taken 或不可解析 → 不落字段", () => {
    expect(sanitizeShareItem({ domain: "stackpilot.dev", status: "taken", expiresAt: "2027-04-06T10:59:44.720Z" })?.expiresAt).toBe("2027-04-06T10:59:44.720Z");
    expect(sanitizeShareItem({ domain: "stackpilot.dev", status: "taken", expiresAt: "2027-04-06" })?.expiresAt).toBe("2027-04-06T00:00:00.000Z");
    expect(sanitizeShareItem({ domain: "zalize.com", status: "available", expiresAt: "2027-04-06T00:00:00Z" })?.expiresAt).toBeUndefined();
    expect(sanitizeShareItem({ domain: "zalize.com", expiresAt: "2027-04-06T00:00:00Z" })?.expiresAt).toBeUndefined();
    expect(sanitizeShareItem({ domain: "zalize.com", status: "taken", expiresAt: "soon" })?.expiresAt).toBeUndefined();
    expect(sanitizeShareItem({ domain: "zalize.com", status: "taken", expiresAt: 123 })?.expiresAt).toBeUndefined();
  });

  it("note：trim 并截到 120 字符；空白/非字符串不落字段", () => {
    expect(sanitizeShareItem({ domain: "zalize.com", note: "  首选，老板拍板  " })?.note).toBe("首选，老板拍板");
    expect(sanitizeShareItem({ domain: "zalize.com", note: "x".repeat(200) })?.note?.length).toBe(120);
    expect(sanitizeShareItem({ domain: "zalize.com", note: "   " })?.note).toBeUndefined();
    expect(sanitizeShareItem({ domain: "zalize.com", note: 42 })?.note).toBeUndefined();
  });

  it("旧快照（无新字段）序列化结果不变", () => {
    expect(sanitizeShareItem({ domain: "zalize.com", status: "taken" })).toEqual({ domain: "zalize.com", label: "zalize", tld: "com", status: "taken" });
  });
});

describe("shareSsrTitle：只有全部 available 才说「可注册」", () => {
  it("新快照全 available → 可注册文案", () => {
    const items = [{ status: "available" as const }, { status: "available" as const }];
    expect(shareSsrTitle(items, "zh")).toBe("2 个可注册域名候选 | DomainHunter");
    expect(shareSsrTitle(items, "en")).toBe("2 available domain candidates | DomainHunter");
  });

  it("含 taken/unknown 或旧快照无 status → 中性「候选域名」", () => {
    expect(shareSsrTitle([{ status: "available" }, { status: "taken" }], "zh")).toBe("2 个候选域名 | DomainHunter");
    expect(shareSsrTitle([{}, {}], "zh")).toBe("2 个候选域名 | DomainHunter");
    expect(shareSsrTitle([{}, {}, {}], "en")).toBe("3 domain candidates | DomainHunter");
  });
});
