/**
 * R557：/monitors「直接添加监控」表单的输入校验与提交流程。
 * 校验只接受合法 label.tld、TLD 须在 TLD_LIST、拒绝与本地清单重复；
 * requestMonitorAdd 把 /api/monitor/add 的响应映射为 UI 可直接渲染的结果。
 */
import { describe, expect, it } from "vitest";

import { TLD_LIST } from "../content/tld-list";
import { normalizeMonitorInput, parseMonitorDomain } from "./monitor-add";
import { requestMonitorAdd } from "./monitor";

describe("normalizeMonitorInput", () => {
  it("去空白 / 小写 / 剥 scheme、www.、路径、末尾点", () => {
    expect(normalizeMonitorInput("  Google.COM  ")).toBe("google.com");
    expect(normalizeMonitorInput("https://www.google.com/search?q=1")).toBe("google.com");
    expect(normalizeMonitorInput("HTTP://Example.io#frag")).toBe("example.io");
    expect(normalizeMonitorInput("example.com.")).toBe("example.com");
    expect(normalizeMonitorInput("www.example.dev")).toBe("example.dev");
  });

  it("不猜测意图：纯 label 不自动补后缀", () => {
    expect(normalizeMonitorInput("google")).toBe("google");
  });
});

describe("parseMonitorDomain", () => {
  it("合法 label.tld 且 TLD 在 TLD_LIST → ok", () => {
    expect(parseMonitorDomain("google.com")).toEqual({ ok: true, domain: "google.com", label: "google", tld: "com" });
    expect(parseMonitorDomain("a-b1.io")).toMatchObject({ ok: true, domain: "a-b1.io" });
    for (const tld of TLD_LIST) expect(parseMonitorDomain(`example.${tld}`).ok).toBe(true);
  });

  it("空输入 → empty", () => {
    expect(parseMonitorDomain("")).toMatchObject({ ok: false, reason: "empty" });
    expect(parseMonitorDomain("   ")).toMatchObject({ ok: false, reason: "empty" });
    expect(parseMonitorDomain("https://")).toMatchObject({ ok: false, reason: "empty" });
  });

  it("语法非法 → syntax：无点、空 label、连字符首尾、非法字符、下划线、空格、超长 label", () => {
    for (const raw of ["google", ".com", "google.", "-abc.com", "abc-.com", "ab c.com", "a_b.com", "a!b.com", "中文.com", `${"a".repeat(64)}.com`, "a..com"]) {
      expect(parseMonitorDomain(raw), raw).toMatchObject({ ok: false, reason: "syntax" });
    }
  });

  it("TLD 不在 TLD_LIST → tld 并回传后缀（含多级后缀）", () => {
    expect(TLD_LIST.includes("zzz" as never)).toBe(false);
    expect(parseMonitorDomain("example.zzz")).toMatchObject({ ok: false, reason: "tld", tld: "zzz" });
    expect(parseMonitorDomain("foo.com.cn")).toMatchObject({ ok: false, reason: "tld", tld: "com.cn" });
    expect(parseMonitorDomain("a.b.google.com")).toMatchObject({ ok: false, reason: "tld", tld: "b.google.com" });
  });

  it("已在监控清单 → duplicate（归一后比较，大小写 / www / scheme 不影响）", () => {
    expect(parseMonitorDomain("google.com", ["google.com"])).toMatchObject({ ok: false, reason: "duplicate", domain: "google.com" });
    expect(parseMonitorDomain("https://WWW.Google.com/", new Set(["google.com"]))).toMatchObject({ ok: false, reason: "duplicate" });
    expect(parseMonitorDomain("google.com", ["google.net"]).ok).toBe(true);
  });

  it("校验顺序：语法 → TLD → 重复（非法输入不会被误报为重复）", () => {
    expect(parseMonitorDomain("-x.com", ["-x.com"])).toMatchObject({ reason: "syntax" });
    expect(parseMonitorDomain("x.zzz", ["x.zzz"])).toMatchObject({ reason: "tld" });
  });
});

function fetchReturning(status: number, body: unknown, calls: { url: string; body: unknown }[] = []): typeof fetch {
  return (async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), body: init?.body ? JSON.parse(String(init.body)) : null });
    return new Response(body === undefined ? "" : JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
  }) as typeof fetch;
}

describe("requestMonitorAdd", () => {
  it("本地校验不通过：不发请求，直接 rejected", async () => {
    const calls: { url: string; body: unknown }[] = [];
    const f = fetchReturning(200, {}, calls);
    expect(await requestMonitorAdd("not a domain", [], "", f)).toMatchObject({ kind: "rejected", reason: "syntax" });
    expect(await requestMonitorAdd("x.zzz", [], "", f)).toMatchObject({ kind: "rejected", reason: "tld", tld: "zzz" });
    expect(await requestMonitorAdd("google.com", ["google.com"], "", f)).toMatchObject({ kind: "rejected", reason: "duplicate" });
    expect(calls).toEqual([]);
  });

  it("taken → added，携带服务端条目（含到期日）与名额；请求体带归一后的域名与 webhook", async () => {
    const calls: { url: string; body: unknown }[] = [];
    const entry = { domain: "google.com", status: "taken", lastChecked: 1, expiresAt: "2028-09-14T04:00:00Z" };
    const r = await requestMonitorAdd("  Google.com ", [], "https://hook.example/x", fetchReturning(200, { ok: true, added: true, entry, monitored: 12, limit: 500 }, calls));
    expect(r).toEqual({ kind: "added", entry, monitored: 12, limit: 500 });
    expect(calls).toEqual([{ url: "/api/monitor/add", body: { domain: "google.com", webhook: "https://hook.example/x" } }]);
  });

  it("available → available（不加入监控，UI 走去注册）", async () => {
    const entry = { domain: "zqxwv7k3test.com", status: "available", lastChecked: 1 };
    const r = await requestMonitorAdd("zqxwv7k3test.com", [], "", fetchReturning(200, { ok: true, added: false, entry, monitored: 12, limit: 500 }));
    expect(r).toEqual({ kind: "available", entry, monitored: 12, limit: 500 });
  });

  it("429 → full（带名额）；502 check_failed → failed/check；503 → failed/network", async () => {
    expect(await requestMonitorAdd("a.com", [], "", fetchReturning(429, { ok: false, error: "monitor_full", monitored: 500, limit: 500 }))).toEqual({ kind: "full", monitored: 500, limit: 500 });
    expect(await requestMonitorAdd("a.com", [], "", fetchReturning(502, { ok: false, error: "check_failed" }))).toEqual({ kind: "failed", error: "check" });
    expect(await requestMonitorAdd("a.com", [], "", fetchReturning(503, { ok: false, error: "monitor_unavailable" }))).toEqual({ kind: "failed", error: "network" });
  });

  it("服务端二次校验拒绝 → rejected（与本地文案同一套）", async () => {
    expect(await requestMonitorAdd("a.com", [], "", fetchReturning(400, { ok: false, error: "unsupported_tld", tld: "com" }))).toMatchObject({ kind: "rejected", reason: "tld", tld: "com" });
    expect(await requestMonitorAdd("a.com", [], "", fetchReturning(400, { ok: false, error: "invalid_domain" }))).toMatchObject({ kind: "rejected", reason: "syntax" });
  });

  it("网络异常 / 非 JSON 响应 → failed/network", async () => {
    const throwing = (async () => {
      throw new TypeError("Failed to fetch");
    }) as typeof fetch;
    expect(await requestMonitorAdd("a.com", [], "", throwing)).toEqual({ kind: "failed", error: "network" });
    const html = (async () => new Response("<html>", { status: 500 })) as typeof fetch;
    expect(await requestMonitorAdd("a.com", [], "", html)).toEqual({ kind: "failed", error: "network" });
  });
});
