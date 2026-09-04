import { describe, expect, it } from "vitest";
import { chunkUrls, INDEXNOW_BATCH_MAX, submitIndexNow, summarizeIndexNow } from "./indexnow";

const base = { host: "hunt.zalize.com", key: "k".repeat(32), keyLocation: "https://hunt.zalize.com/kkk.txt" };

function fakeFetch(statuses: number[]) {
  const bodies: unknown[] = [];
  let i = 0;
  const impl = (async (_url: RequestInfo | URL, init?: RequestInit) => {
    bodies.push(JSON.parse(String(init?.body)));
    const s = statuses[Math.min(i++, statuses.length - 1)];
    if (s < 0) throw new TypeError("fetch failed");
    return new Response("", { status: s });
  }) as typeof fetch;
  return { impl, bodies };
}

describe("chunkUrls", () => {
  it("≤10000 一批；超出按 10000 切分", () => {
    expect(chunkUrls(["a", "b"])).toEqual([["a", "b"]]);
    const many = Array.from({ length: INDEXNOW_BATCH_MAX + 1 }, (_, i) => `u${i}`);
    const chunks = chunkUrls(many);
    expect(chunks.length).toBe(2);
    expect(chunks[0].length).toBe(INDEXNOW_BATCH_MAX);
    expect(chunks[1]).toEqual([`u${INDEXNOW_BATCH_MAX}`]);
    expect(chunkUrls([])).toEqual([]);
  });
});

describe("submitIndexNow / summarizeIndexNow", () => {
  it("200/202 视为成功，请求体含 host/key/keyLocation/urlList", async () => {
    const f = fakeFetch([202]);
    const res = await submitIndexNow({ ...base, urls: ["https://hunt.zalize.com/", "https://hunt.zalize.com/tld/com"], fetchImpl: f.impl });
    expect(res).toEqual([{ status: 202, ok: true, submitted: 2 }]);
    expect(f.bodies[0]).toEqual({ ...base, urlList: ["https://hunt.zalize.com/", "https://hunt.zalize.com/tld/com"] });
    expect(summarizeIndexNow(res)).toEqual({ ok: true, status: 202, message: "Accepted (key validation pending)", submitted: 2 });
  });
  it("4xx/429 视为失败并给出可读原因；已成功批次仍计入 submitted", async () => {
    const urls = Array.from({ length: INDEXNOW_BATCH_MAX + 5 }, (_, i) => `https://hunt.zalize.com/p${i}`);
    const f = fakeFetch([200, 429]);
    const res = await submitIndexNow({ ...base, urls, fetchImpl: f.impl });
    expect(res.map((r) => r.status)).toEqual([200, 429]);
    expect(summarizeIndexNow(res)).toEqual({ ok: false, status: 429, message: "Too many requests", submitted: INDEXNOW_BATCH_MAX });
    expect(summarizeIndexNow([{ status: 403, ok: false, submitted: 1 }]).message).toMatch(/key/i);
    expect(summarizeIndexNow([{ status: 500, ok: false, submitted: 1 }]).message).toBe("HTTP 500");
  });
  it("网络异常不抛出，记为 status 0", async () => {
    const f = fakeFetch([-1]);
    const res = await submitIndexNow({ ...base, urls: ["https://hunt.zalize.com/"], fetchImpl: f.impl });
    expect(res).toEqual([{ status: 0, ok: false, submitted: 1 }]);
    expect(summarizeIndexNow(res)).toEqual({ ok: false, status: 0, message: "Network error", submitted: 0 });
  });
});
