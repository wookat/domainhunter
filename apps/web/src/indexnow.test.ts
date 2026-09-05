import { describe, expect, it } from "vitest";
import { acceptedUrls, chunkUrls, INDEXNOW_BATCH_MAX, INDEXNOW_BATCH_SIZE, INDEXNOW_RUN_MAX_BATCHES, indexNowDelta, mergePushed, submitIndexNow, summarizeIndexNow } from "./indexnow";

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

// R504：生产实测 1270 URL 单批 → 429、100 URL 单批 → 200；改为 100/批、每次 cron ≤3 批、失败即停、成功批逐批入快照
describe("R504 小批推送 + 逐批快照", () => {
  const all = Array.from({ length: 1270 }, (_, i) => `https://hunt.zalize.com/p${i}`);
  it("默认参数：100/批、每次最多 3 批", () => {
    expect(INDEXNOW_BATCH_SIZE).toBe(100);
    expect(INDEXNOW_RUN_MAX_BATCHES).toBe(3);
  });
  it("1270 URL 一次只发 3 批 ×100，其余留作积压", async () => {
    const f = fakeFetch([200]);
    const res = await submitIndexNow({ ...base, urls: all, fetchImpl: f.impl, batchSize: 100, maxBatches: 3, stopOnFail: true });
    expect(res.map((r) => r.submitted)).toEqual([100, 100, 100]);
    expect(f.bodies.length).toBe(3);
    const accepted = acceptedUrls(all, res, 100);
    expect(accepted).toEqual(all.slice(0, 300));
    const snap = mergePushed(null, accepted, all, "2026-08-10");
    expect(snap.urls.length).toBe(300);
    expect(indexNowDelta(snap, all, "2026-08-10")).toEqual(all.slice(300));
  });
  it("第 2 批 429 时立即停止；已成功的第 1 批仍并入快照，失败批不计", async () => {
    const f = fakeFetch([200, 429]);
    const res = await submitIndexNow({ ...base, urls: all, fetchImpl: f.impl, batchSize: 100, maxBatches: 3, stopOnFail: true });
    expect(res.map((r) => r.status)).toEqual([200, 429]);
    expect(f.bodies.length).toBe(2);
    expect(summarizeIndexNow(res)).toEqual({ ok: false, status: 429, message: "Too many requests", submitted: 100 });
    const accepted = acceptedUrls(all, res, 100);
    expect(accepted).toEqual(all.slice(0, 100));
    const prev = { lastmod: "2026-08-10", urls: all.slice(0, 50) };
    const snap = mergePushed(prev, accepted, all, "2026-08-10");
    expect(snap.urls.length).toBe(100);
    expect(indexNowDelta(snap, all, "2026-08-10").length).toBe(1170);
  });
  it("首批即失败 → 只发 1 批、快照不变", async () => {
    const f = fakeFetch([0 - 1]);
    const res = await submitIndexNow({ ...base, urls: all, fetchImpl: f.impl, batchSize: 100, maxBatches: 3, stopOnFail: true });
    expect(res).toEqual([{ status: 0, ok: false, submitted: 100 }]);
    expect(acceptedUrls(all, res, 100)).toEqual([]);
  });
  it("mergePushed：lastmod 变化丢弃旧快照；已下线 URL 剔除；去重", () => {
    const old = { lastmod: "2026-08-01", urls: all.slice(0, 500) };
    const snap = mergePushed(old, all.slice(0, 100), all, "2026-08-10");
    expect(snap).toEqual({ lastmod: "2026-08-10", urls: all.slice(0, 100) });
    const gone = mergePushed({ lastmod: "2026-08-10", urls: ["https://hunt.zalize.com/gone", all[0]] }, [all[0], all[1]], all, "2026-08-10");
    expect(gone.urls).toEqual([all[0], all[1]]);
  });
  it("积压推完（快照覆盖全站）后 delta 为空，等价于旧「全量成功」状态", async () => {
    let snap: { lastmod: string; urls: string[] } | null = null;
    let runs = 0;
    for (;;) {
      const urls = indexNowDelta(snap, all, "2026-08-10");
      if (urls.length === 0) break;
      const f = fakeFetch([200]);
      const res = await submitIndexNow({ ...base, urls, fetchImpl: f.impl, batchSize: 100, maxBatches: 3, stopOnFail: true });
      snap = mergePushed(snap, acceptedUrls(urls, res, 100), all, "2026-08-10");
      runs++;
    }
    expect(runs).toBe(5);
    expect(snap?.urls.length).toBe(1270);
  });
});
