import { describe, expect, it } from "vitest";

import {
  applyAffiliate,
  hasActiveAffiliate,
  isCnTld,
  parseAffiliateConfig,
  parseAffiliateJson,
  primaryRegistrar,
  REGISTRARS,
  registrarLink,
  registrarsFor,
  tldOf,
  type AffiliateConfig,
} from "./registrars";

const byId = (id: string) => REGISTRARS.find((r) => r.id === id)!;
const ids = (domain: string) => registrarsFor(domain).map((r) => r.id);

describe("registrars: 未配置返佣 = 原纯搜索链接", () => {
  const legacy: Record<string, (d: string) => string> = {
    porkbun: (d) => `https://porkbun.com/checkout/search?q=${encodeURIComponent(d)}`,
    aliyun: (d) => `https://wanwang.aliyun.com/domain/searchresult/#/?keyword=${encodeURIComponent(d)}`,
    tencent: (d) => `https://buy.cloud.tencent.com/domain?domain=${encodeURIComponent(d)}`,
    namecheap: (d) => `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(d)}`,
    dynadot: (d) => `https://www.dynadot.com/domain/search?domain=${encodeURIComponent(d)}`,
    cloudflare: (d) => `https://domains.cloudflare.com/?domain=${encodeURIComponent(d)}`,
  };

  it.each(["undefined", "empty", "other-registrar-only", "invalid-entry"] as const)("%s → href 与 R480 前逐字一致、rel 无 sponsored", (mode) => {
    const cfg: AffiliateConfig | undefined =
      mode === "undefined" ? undefined : mode === "empty" ? {} : mode === "other-registrar-only" ? { tencent: { query: { from: "x" } } } : { porkbun: {} };
    for (const r of REGISTRARS) {
      if (mode === "other-registrar-only" && r.id === "tencent") continue;
      for (const d of ["kuaixue.com", "xiao-mi.com.cn", "品牌.cn"]) {
        const link = registrarLink(r, d, cfg);
        expect(link.href).toBe(legacy[r.id](d));
        expect(link.href).toBe(r.url(d));
        expect(link.sponsored).toBe(false);
        expect(link.rel).toBe("noopener noreferrer");
      }
    }
  });

  it("空配置下不显示返佣声明", () => {
    expect(hasActiveAffiliate(undefined)).toBe(false);
    expect(hasActiveAffiliate({})).toBe(false);
    expect(hasActiveAffiliate({ cloudflare: { query: { ref: "x" } } })).toBe(false);
  });
});

describe("registrars: 配置返佣后 = 带参数链接", () => {
  it("query 参数追加在搜索链接上（hash 之前），rel 带 sponsored", () => {
    const cfg: AffiliateConfig = { aliyun: { query: { userCode: "abc123" } }, tencent: { query: { from: "20001", fromSource: "gwzcw" } } };
    const ali = registrarLink(byId("aliyun"), "kuaixue.cn", cfg);
    expect(ali.href).toBe("https://wanwang.aliyun.com/domain/searchresult/?userCode=abc123#/?keyword=kuaixue.cn");
    expect(ali.sponsored).toBe(true);
    expect(ali.rel).toBe("noopener noreferrer sponsored");
    const tc = registrarLink(byId("tencent"), "kuaixue.cn", cfg);
    expect(tc.href).toBe("https://buy.cloud.tencent.com/domain?domain=kuaixue.cn&from=20001&fromSource=gwzcw");
    expect(hasActiveAffiliate(cfg)).toBe(true);
  });

  it("redirect 模板（Impact/CJ 深链）：{url} 替换为编码后的搜索链接", () => {
    const cfg: AffiliateConfig = { namecheap: { redirect: "https://namecheap.pxf.io/c/111/222/5618?u={url}" } };
    const link = registrarLink(byId("namecheap"), "kuaixue.com", cfg);
    expect(link.href).toBe(
      `https://namecheap.pxf.io/c/111/222/5618?u=${encodeURIComponent("https://www.namecheap.com/domains/registration/results/?domain=kuaixue.com")}`,
    );
    expect(link.sponsored).toBe(true);
  });

  it("Dynadot（R503）：query 与 redirect 两种占位都能接，未配置时保持纯搜索链接", () => {
    const dyn = byId("dynadot");
    expect(registrarLink(dyn, "kuaixue.cn", undefined).href).toBe("https://www.dynadot.com/domain/search?domain=kuaixue.cn");
    const q = registrarLink(dyn, "kuaixue.cn", { dynadot: { query: { rc: "AMB123" } } });
    expect(q.href).toBe("https://www.dynadot.com/domain/search?domain=kuaixue.cn&rc=AMB123");
    expect(q.sponsored).toBe(true);
    const r = registrarLink(dyn, "kuaixue.com.cn", { dynadot: { redirect: "https://www.anrdoezrs.net/click-1-2?url={url}" } });
    expect(r.href).toBe(`https://www.anrdoezrs.net/click-1-2?url=${encodeURIComponent("https://www.dynadot.com/domain/search?domain=kuaixue.com.cn")}`);
    expect(r.sponsored).toBe(true);
  });

  it("query + redirect 同时给出：先拼 query 再套 redirect", () => {
    const out = applyAffiliate("https://example.com/search?q=a", { query: { aff: "9" }, redirect: "https://go.example/?u={url}" });
    expect(out).toBe(`https://go.example/?u=${encodeURIComponent("https://example.com/search?q=a&aff=9")}`);
  });

  it("Cloudflare 无联盟计划：配置被忽略，仍是纯链接", () => {
    const link = registrarLink(byId("cloudflare"), "kuaixue.com", { cloudflare: { query: { ref: "x" } } });
    expect(link.href).toBe("https://domains.cloudflare.com/?domain=kuaixue.com");
    expect(link.sponsored).toBe(false);
  });
});

describe("registrars: 排序规则", () => {
  it(".cn / .com.cn / .net.cn 优先阿里云、腾讯云，海外备选只剩 Dynadot；Porkbun/Namecheap/Cloudflare 不售 .cn 被隐藏", () => {
    expect(ids("kuaixue.cn")).toEqual(["aliyun", "tencent", "dynadot"]);
    expect(ids("kuaixue.com.cn")).toEqual(["aliyun", "tencent", "dynadot"]);
    expect(ids("kuaixue.net.cn")).toEqual(["aliyun", "tencent", "dynadot"]);
    expect(primaryRegistrar("kuaixue.cn").id).toBe("aliyun");
  });

  it("其他后缀优先 Porkbun、Namecheap（再 Dynadot、Cloudflare），阿里云/腾讯云跟随", () => {
    expect(ids("kuaixue.com")).toEqual(["porkbun", "namecheap", "dynadot", "cloudflare", "aliyun", "tencent"]);
    expect(ids("kuaixue.io")).toEqual(["porkbun", "namecheap", "dynadot", "cloudflare", "aliyun", "tencent"]);
    expect(ids("kuaixue.co.uk")).toEqual(["porkbun", "namecheap", "dynadot", "cloudflare", "aliyun", "tencent"]);
    expect(primaryRegistrar("kuaixue.com").id).toBe("porkbun");
  });

  it("排序确定性：多次调用结果相同，且大小写/前导点不影响", () => {
    expect(ids("KuaiXue.CN")).toEqual(ids("kuaixue.cn"));
    expect(registrarsFor("cn").map((r) => r.id)).toEqual(ids("kuaixue.cn"));
    expect(ids("kuaixue.com")).toEqual(ids("kuaixue.com"));
  });

  it("tldOf / isCnTld", () => {
    expect(tldOf("kuaixue.com.cn")).toBe("com.cn");
    expect(tldOf("kuaixue.com")).toBe("com");
    expect(tldOf("com")).toBe("com");
    expect(isCnTld("cn")).toBe(true);
    expect(isCnTld(".com.cn")).toBe(true);
    expect(isCnTld("com")).toBe(false);
    expect(isCnTld("cn.com")).toBe(false);
  });
});

describe("parseAffiliateConfig / parseAffiliateJson", () => {
  it("非法 JSON / 空串 / 非对象 → {}", () => {
    expect(parseAffiliateJson(undefined)).toEqual({});
    expect(parseAffiliateJson("")).toEqual({});
    expect(parseAffiliateJson("not json")).toEqual({});
    expect(parseAffiliateJson("[1,2]")).toEqual({});
    expect(parseAffiliateConfig(null)).toEqual({});
    expect(parseAffiliateConfig("x")).toEqual({});
  });

  it("只保留已知注册商与合法字段", () => {
    const cfg = parseAffiliateJson(
      JSON.stringify({
        aliyun: { query: { userCode: "abc", bad: 1, "": "x" } },
        namecheap: { redirect: "https://namecheap.pxf.io/c/1/2/3?u={url}", query: {} },
        dynadot: { query: { rc: "AMB123" } },
        porkbun: { redirect: "http://insecure.example/{url}" },
        tencent: { redirect: "https://no-placeholder.example/" },
        godaddy: { query: { isc: "x" } },
        cloudflare: "string",
      }),
    );
    expect(cfg).toEqual({
      aliyun: { query: { userCode: "abc" } },
      namecheap: { redirect: "https://namecheap.pxf.io/c/1/2/3?u={url}" },
      dynadot: { query: { rc: "AMB123" } },
    });
  });
});
