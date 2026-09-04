import { describe, expect, it } from "vitest";
import {
  acceptedUrls,
  BAIDU_PUSH_BATCH_MAX,
  BAIDU_PUSH_ENDPOINT,
  buildBaiduPushUrl,
  chunkBaiduUrls,
  pickPending,
  resolveBaiduPush,
  submitBaidu,
  summarizeBaidu,
} from "./baidu-push";

const cfg = { site: "https://hunt.zalize.com", token: "fakeTOKEN0test00", dailyMax: BAIDU_PUSH_BATCH_MAX, endpoint: BAIDU_PUSH_ENDPOINT };

function fakeFetch(responses: Array<{ status: number; body?: unknown } | "throw">) {
  const calls: Array<{ url: string; method: string | undefined; contentType: string | null; body: string }> = [];
  let i = 0;
  const impl = (async (url: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(url), method: init?.method, contentType: new Headers(init?.headers).get("content-type"), body: String(init?.body) });
    const r = responses[Math.min(i++, responses.length - 1)];
    if (r === "throw") throw new TypeError("fetch failed");
    return new Response(r.body === undefined ? "" : JSON.stringify(r.body), { status: r.status, headers: { "content-type": "application/json" } });
  }) as typeof fetch;
  return { impl, calls };
}

describe("resolveBaiduPush", () => {
  it("site/token 任一缺失、空白或非法 → null（cron 完全不执行）", () => {
    expect(resolveBaiduPush({})).toBeNull();
    expect(resolveBaiduPush({ BAIDU_PUSH_SITE: "https://hunt.zalize.com" })).toBeNull();
    expect(resolveBaiduPush({ BAIDU_PUSH_TOKEN: "fakeTOKEN0test00" })).toBeNull();
    expect(resolveBaiduPush({ BAIDU_PUSH_SITE: "  ", BAIDU_PUSH_TOKEN: "fakeTOKEN0test00" })).toBeNull();
    expect(resolveBaiduPush({ BAIDU_PUSH_SITE: "https://hunt.zalize.com/path", BAIDU_PUSH_TOKEN: "fakeTOKEN0test00" })).toBeNull();
    expect(resolveBaiduPush({ BAIDU_PUSH_SITE: "hunt.zalize.com&x=1", BAIDU_PUSH_TOKEN: "fakeTOKEN0test00" })).toBeNull();
    expect(resolveBaiduPush({ BAIDU_PUSH_SITE: "hunt.zalize.com", BAIDU_PUSH_TOKEN: "short" })).toBeNull();
  });
  it("合法配置：裸域或 https 前缀均可；dailyMax 默认 2000、可收紧、不可超过接口单次上限", () => {
    expect(resolveBaiduPush({ BAIDU_PUSH_SITE: " www.example.com ", BAIDU_PUSH_TOKEN: " fakeTOKEN0test00 " })).toEqual({
      site: "www.example.com",
      token: "fakeTOKEN0test00",
      dailyMax: 2000,
      endpoint: "http://data.zz.baidu.com/urls",
    });
    expect(resolveBaiduPush({ BAIDU_PUSH_SITE: "https://hunt.zalize.com", BAIDU_PUSH_TOKEN: "fakeTOKEN0test00", BAIDU_PUSH_DAILY_MAX: "10" })?.dailyMax).toBe(10);
    expect(resolveBaiduPush({ BAIDU_PUSH_SITE: "hunt.zalize.com", BAIDU_PUSH_TOKEN: "fakeTOKEN0test00", BAIDU_PUSH_DAILY_MAX: "99999" })?.dailyMax).toBe(2000);
    expect(resolveBaiduPush({ BAIDU_PUSH_SITE: "hunt.zalize.com", BAIDU_PUSH_TOKEN: "fakeTOKEN0test00", BAIDU_PUSH_DAILY_MAX: "abc" })?.dailyMax).toBe(2000);
    expect(resolveBaiduPush({ BAIDU_PUSH_SITE: "hunt.zalize.com", BAIDU_PUSH_TOKEN: "fakeTOKEN0test00", BAIDU_PUSH_DAILY_MAX: "0" })?.dailyMax).toBe(2000);
  });
  it("BAIDU_PUSH_ENDPOINT 仅接受 http(s) URL（本地 mock 上游），否则回落官方地址", () => {
    const base = { BAIDU_PUSH_SITE: "hunt.zalize.com", BAIDU_PUSH_TOKEN: "fakeTOKEN0test00" };
    expect(resolveBaiduPush({ ...base, BAIDU_PUSH_ENDPOINT: "http://127.0.0.1:9999/urls" })?.endpoint).toBe("http://127.0.0.1:9999/urls");
    expect(resolveBaiduPush({ ...base, BAIDU_PUSH_ENDPOINT: "data.zz.baidu.com/urls" })?.endpoint).toBe(BAIDU_PUSH_ENDPOINT);
    expect(resolveBaiduPush({ ...base, BAIDU_PUSH_ENDPOINT: "http://x/urls?site=evil" })?.endpoint).toBe(BAIDU_PUSH_ENDPOINT);
  });
});

describe("buildBaiduPushUrl / chunkBaiduUrls / pickPending", () => {
  it("接口地址与官方一致：http + site + token 查询参数", () => {
    expect(BAIDU_PUSH_ENDPOINT).toBe("http://data.zz.baidu.com/urls");
    expect(buildBaiduPushUrl(cfg)).toBe("http://data.zz.baidu.com/urls?site=https%3A%2F%2Fhunt.zalize.com&token=fakeTOKEN0test00");
    expect(buildBaiduPushUrl({ site: "www.example.com", token: "fakeTOKEN0test00" })).toBe("http://data.zz.baidu.com/urls?site=www.example.com&token=fakeTOKEN0test00");
    expect(buildBaiduPushUrl(cfg, "http://127.0.0.1:9999/urls")).toBe("http://127.0.0.1:9999/urls?site=https%3A%2F%2Fhunt.zalize.com&token=fakeTOKEN0test00");
    expect(buildBaiduPushUrl({ site: "www.example.com", token: "fakeTOKEN0test00" })).not.toContain("https://");
  });
  it("≤2000 一批；超出按 2000 切分", () => {
    expect(chunkBaiduUrls(["a", "b"])).toEqual([["a", "b"]]);
    const many = Array.from({ length: BAIDU_PUSH_BATCH_MAX + 1 }, (_, i) => `u${i}`);
    const chunks = chunkBaiduUrls(many);
    expect(chunks.length).toBe(2);
    expect(chunks[0].length).toBe(BAIDU_PUSH_BATCH_MAX);
    expect(chunks[1]).toEqual([`u${BAIDU_PUSH_BATCH_MAX}`]);
    expect(chunkBaiduUrls([])).toEqual([]);
  });
  it("配额策略：剔除已推送的、保持原顺序、最多 max 条", () => {
    const all = ["/", "/prices", "/tld/com", "/tld/cn", "/guide/a"];
    expect(pickPending(all, new Set(["/", "/tld/com"]), 2)).toEqual(["/prices", "/tld/cn"]);
    expect(pickPending(all, new Set(all), 10)).toEqual([]);
    expect(pickPending(all, new Set(), 0)).toEqual([]);
    expect(pickPending(all, new Set(), 10)).toEqual(all);
  });
});

describe("acceptedUrls", () => {
  it("扣除 not_same_site/not_valid，再按 success 截取", () => {
    const batch = ["https://hunt.zalize.com/", "https://other.com/x", "https://hunt.zalize.com/tld/com", "bad"];
    expect(acceptedUrls(batch, { success: 2, remain: 8, not_same_site: ["https://other.com/x"], not_valid: ["bad"] })).toEqual([
      "https://hunt.zalize.com/",
      "https://hunt.zalize.com/tld/com",
    ]);
    // success 少于剩余条数（配额被部分扣完）：只按顺序认前 success 条
    expect(acceptedUrls(batch, { success: 1, remain: 0, not_same_site: ["https://other.com/x"], not_valid: ["bad"] })).toEqual(["https://hunt.zalize.com/"]);
    // 无 success 字段：视为全部接受
    expect(acceptedUrls(["a", "b"], {})).toEqual(["a", "b"]);
  });
});

describe("submitBaidu / summarizeBaidu", () => {
  const urls = ["https://hunt.zalize.com/", "https://hunt.zalize.com/tld/com"];
  it("请求格式符合官方文档：POST、text/plain、每行一个 URL、site/token 在 query", async () => {
    const f = fakeFetch([{ status: 200, body: { remain: 8, success: 2, not_same_site: [], not_valid: [] } }]);
    const res = await submitBaidu({ cfg, urls, fetchImpl: f.impl });
    expect(f.calls).toEqual([
      {
        url: "http://data.zz.baidu.com/urls?site=https%3A%2F%2Fhunt.zalize.com&token=fakeTOKEN0test00",
        method: "POST",
        contentType: "text/plain",
        body: "https://hunt.zalize.com/\nhttps://hunt.zalize.com/tld/com",
      },
    ]);
    expect(res).toEqual([{ status: 200, ok: true, submitted: 2, accepted: urls, remain: 8, message: "OK" }]);
    expect(summarizeBaidu(res)).toEqual({ ok: true, status: 200, message: "OK", submitted: 2, accepted: urls, remain: 8 });
  });
  it("仅 200 成功：400 over quota / 401 token 错 均为失败并带官方 message", async () => {
    const f400 = fakeFetch([{ status: 400, body: { error: 400, message: "over quota" } }]);
    const r400 = await submitBaidu({ cfg, urls, fetchImpl: f400.impl });
    expect(r400).toEqual([{ status: 400, ok: false, submitted: 2, accepted: [], remain: null, message: "Bad request (site error / empty content / over quota / >2000 urls): over quota" }]);
    expect(summarizeBaidu(r400)).toEqual({ ok: false, status: 400, message: r400[0].message, submitted: 0, accepted: [], remain: null });

    const f401 = fakeFetch([{ status: 401, body: { error: 401, message: "token is not valid" } }]);
    expect(summarizeBaidu(await submitBaidu({ cfg, urls, fetchImpl: f401.impl })).message).toBe("token is not valid: token is not valid");

    const f500 = fakeFetch([{ status: 500 }]);
    expect(summarizeBaidu(await submitBaidu({ cfg, urls, fetchImpl: f500.impl })).message).toBe("internal error, please try later");
    expect(summarizeBaidu(await submitBaidu({ cfg, urls, fetchImpl: fakeFetch([{ status: 502 }]).impl })).message).toBe("HTTP 502");
  });
  it("多批：首批成功、次批失败 → 已接受 URL 仍记入 accepted；remain=0 时不再发后续批", async () => {
    const many = Array.from({ length: BAIDU_PUSH_BATCH_MAX + 5 }, (_, i) => `https://hunt.zalize.com/p${i}`);
    const f = fakeFetch([{ status: 200, body: { remain: 3, success: BAIDU_PUSH_BATCH_MAX } }, { status: 400, body: { error: 400, message: "over quota" } }]);
    const res = await submitBaidu({ cfg, urls: many, fetchImpl: f.impl });
    expect(res.map((r) => r.status)).toEqual([200, 400]);
    const s = summarizeBaidu(res);
    expect(s.ok).toBe(false);
    expect(s.accepted.length).toBe(BAIDU_PUSH_BATCH_MAX);
    expect(s.submitted).toBe(BAIDU_PUSH_BATCH_MAX);

    const f0 = fakeFetch([{ status: 200, body: { remain: 0, success: BAIDU_PUSH_BATCH_MAX } }]);
    const res0 = await submitBaidu({ cfg, urls: many, fetchImpl: f0.impl });
    expect(f0.calls.length).toBe(1);
    expect(summarizeBaidu(res0)).toMatchObject({ ok: true, remain: 0, submitted: BAIDU_PUSH_BATCH_MAX });
  });
  it("网络异常不抛出，记为 status 0", async () => {
    const f = fakeFetch(["throw"]);
    const res = await submitBaidu({ cfg, urls, fetchImpl: f.impl });
    expect(res).toEqual([{ status: 0, ok: false, submitted: 2, accepted: [], remain: null, message: "Network error" }]);
    expect(summarizeBaidu(res)).toEqual({ ok: false, status: 0, message: "Network error", submitted: 0, accepted: [], remain: null });
  });
  it("非 JSON 响应体不抛出", async () => {
    const impl = (async () => new Response("<html>", { status: 200 })) as typeof fetch;
    const res = await submitBaidu({ cfg, urls, fetchImpl: impl });
    expect(res[0]).toMatchObject({ status: 200, ok: true, accepted: urls, remain: null });
  });
});
