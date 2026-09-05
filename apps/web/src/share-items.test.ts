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
