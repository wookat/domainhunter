import { describe, expect, it } from "vitest";

import { isRetryableUnknown, parseCheckLine, recheckDomains, recheckFailureDetail, RecheckHttpError, unknownReason, unknownReasonKey } from "./check-client";

describe("unknownReason（后端 detail 短码 → 可读原因）", () => {
  it("生产实测 .ai RDAP http-429 → 限流；其它 http-xxx → 注册局接口异常", () => {
    expect(unknownReason("http-429")).toBe("rate-limited");
    expect(unknownReason("http-503")).toBe("registry-error");
    expect(unknownReason("http-500")).toBe("registry-error");
  });

  it("retry-exhausted / 超时类异常 → 超时；no-rdap-server → 无通道；unparsed → 无法解析", () => {
    expect(unknownReason("retry-exhausted")).toBe("timeout");
    expect(unknownReason("TimeoutError: The operation was aborted due to timeout")).toBe("timeout");
    expect(unknownReason("no-rdap-server")).toBe("no-rdap");
    expect(unknownReason("unparsed")).toBe("unparsed");
  });

  it("reserved 与瞬态 unknown 区分：reserved 不可重试", () => {
    expect(unknownReason("reserved")).toBe("reserved");
    expect(isRetryableUnknown("reserved")).toBe(false);
    expect(isRetryableUnknown("http-429")).toBe(true);
    expect(isRetryableUnknown(undefined)).toBe(true);
  });

  it("网络类异常 → network；空/未知 → generic；文案 key 只取自固定枚举，原始异常文本不会透出", () => {
    expect(unknownReason("TypeError: fetch failed")).toBe("network");
    expect(unknownReason(undefined)).toBe("generic");
    expect(unknownReason("")).toBe("generic");
    expect(unknownReason("Error: something odd 0x1f")).toBe("generic");
    expect(unknownReasonKey("http-429")).toBe("unknown.reason.rate-limited");
    expect(unknownReasonKey("Error: something odd 0x1f")).toBe("unknown.reason.generic");
  });
});

describe("parseCheckLine（NDJSON 单行解析）", () => {
  it("合法行保留 domain/status/expiresAt/detail；进度事件、坏 JSON、非法 status 丢弃", () => {
    expect(parseCheckLine('{"domain":"lingxicha.ai","status":"unknown","method":"rdap","detail":"http-429"}')).toEqual({
      domain: "lingxicha.ai",
      status: "unknown",
      detail: "http-429",
    });
    expect(parseCheckLine('{"domain":"google.com","status":"taken","expiresAt":"2028-09-14T04:00:00.000Z"}')).toEqual({
      domain: "google.com",
      status: "taken",
      expiresAt: "2028-09-14T04:00:00.000Z",
    });
    expect(parseCheckLine('{"type":"progress","checked":3}')).toBeNull();
    expect(parseCheckLine("{not json")).toBeNull();
    expect(parseCheckLine('{"domain":"x.com","status":"checking"}')).toBeNull();
    expect(parseCheckLine("")).toBeNull();
  });
});

function ndjsonResponse(lines: string[], status = 200): Response {
  return new Response(lines.join("\n") + "\n", { status, headers: { "content-type": "application/x-ndjson" } });
}

describe("recheckDomains（单行重新核验请求）", () => {
  it("恰发 1 次 POST /api/check?refresh=1，不碰 /api/search 与 /api/ai-search", async () => {
    const calls: { url: string; init?: RequestInit }[] = [];
    const fetchFn: typeof fetch = async (input, init) => {
      calls.push({ url: String(input), init });
      return ndjsonResponse(['{"domain":"lingxicha.ai","status":"taken","method":"rdap","expiresAt":"2027-01-01T00:00:00.000Z"}']);
    };
    const got: unknown[] = [];
    await recheckDomains(["Lingxicha.AI"], (r) => got.push(r), { fetchFn });

    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe("/api/check?refresh=1");
    expect(calls[0].init?.method).toBe("POST");
    expect(JSON.parse(String(calls[0].init?.body))).toEqual({ domains: ["lingxicha.ai"], refresh: true });
    expect(calls.some((c) => c.url.includes("/api/search") || c.url.includes("/api/ai-search"))).toBe(false);
    expect(got).toEqual([{ domain: "lingxicha.ai", status: "taken", expiresAt: "2027-01-01T00:00:00.000Z" }]);
  });

  it("流式多行 + 无换行尾行都能回调；空清单不发请求", async () => {
    let n = 0;
    const fetchFn: typeof fetch = async () => {
      n++;
      return new Response('{"domain":"a.com","status":"available"}\n{"domain":"b.com","status":"unknown","detail":"http-429"}', { status: 200 });
    };
    const got: string[] = [];
    await recheckDomains(["a.com", "b.com", "a.com"], (r) => got.push(`${r.domain}:${r.status}`), { fetchFn });
    expect(n).toBe(1);
    expect(got).toEqual(["a.com:available", "b.com:unknown"]);

    await recheckDomains([], () => got.push("x"), { fetchFn });
    expect(n).toBe(1);
  });

  it("HTTP 非 2xx 抛 RecheckHttpError（调用方保留原行状态），不重试", async () => {
    let n = 0;
    const fetchFn: typeof fetch = async () => {
      n++;
      return new Response("rate limited", { status: 429 });
    };
    await expect(recheckDomains(["a.com"], () => undefined, { fetchFn })).rejects.toBeInstanceOf(RecheckHttpError);
    expect(n).toBe(1);
  });

  it("本站 /api/check 429（与 AI 猎名共用 20 次/小时桶）→ 行 detail 写 recheck-429 → 可读原因 recheck-limited；其它失败保留原 detail", () => {
    expect(recheckFailureDetail(new RecheckHttpError(429), "http-429")).toBe("recheck-429");
    expect(unknownReason("recheck-429")).toBe("recheck-limited");
    expect(unknownReasonKey("recheck-429")).toBe("unknown.reason.recheck-limited");
    expect(isRetryableUnknown("recheck-429")).toBe(true);
    expect(recheckFailureDetail(new RecheckHttpError(500), "http-429")).toBe("http-429");
    expect(recheckFailureDetail(new TypeError("fetch failed"), "retry-exhausted")).toBe("retry-exhausted");
    expect(recheckFailureDetail(new TypeError("fetch failed"), undefined)).toBeUndefined();
  });
});
