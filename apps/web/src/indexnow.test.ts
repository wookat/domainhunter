import { describe, expect, it } from "vitest";
import { chunkUrls, INDEXNOW_BATCH_MAX, indexNowDelta, submitIndexNow, summarizeIndexNow } from "./indexnow";

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

describe("indexNowDelta", () => {
  const urls = ["https://hunt.zalize.com/", "https://hunt.zalize.com/tld/com", "https://hunt.zalize.com/tld/cn"];
  it("无快照（首次）或 lastmod 变化 → 全量", () => {
    expect(indexNowDelta(null, urls, "2026-08-10")).toEqual(urls);
    expect(indexNowDelta({ lastmod: "2026-08-01", urls }, urls, "2026-08-10")).toEqual(urls);
  });
  it("lastmod 不变 → 只推快照中没有的新 URL；全部已推则为空", () => {
    expect(indexNowDelta({ lastmod: "2026-08-10", urls: urls.slice(0, 2) }, urls, "2026-08-10")).toEqual([urls[2]]);
    expect(indexNowDelta({ lastmod: "2026-08-10", urls }, urls, "2026-08-10")).toEqual([]);
  });
  it("已从 sitemap 移除的 URL 不会被重推，也不影响新增判定", () => {
    expect(indexNowDelta({ lastmod: "2026-08-10", urls: [...urls, "https://hunt.zalize.com/gone"] }, urls, "2026-08-10")).toEqual([]);
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
