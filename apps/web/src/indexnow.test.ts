import { describe, expect, it } from "vitest";
import { acceptedUrls, chunkUrls, countRetries, fallbackHosts, INDEXNOW_429_BACKOFF_MS, INDEXNOW_429_MAX_RETRIES, INDEXNOW_BATCH_MAX, INDEXNOW_BATCH_SIZE, INDEXNOW_ENDPOINT, INDEXNOW_FALLBACK_ENDPOINTS, INDEXNOW_RUN_MAX_BATCHES, indexNowDelta, mergePushed, submitIndexNow, summarizeIndexNow } from "./indexnow";

const base = { host: "hunt.zalize.com", key: "k".repeat(32), keyLocation: "https://hunt.zalize.com/kkk.txt" };

function fakeFetch(statuses: number[]) {
  const bodies: unknown[] = [];
  const urls: string[] = [];
  let i = 0;
  const impl = (async (url: RequestInfo | URL, init?: RequestInit) => {
    urls.push(String(url));
    bodies.push(JSON.parse(String(init?.body)));
    const s = statuses[Math.min(i++, statuses.length - 1)];
    if (s < 0) throw new TypeError("fetch failed");
    return new Response("", { status: s });
  }) as typeof fetch;
  return { impl, bodies, urls };
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
  // R515：生产 00:00:58Z 首批 100 URL → 429 而同分钟本机直连 200，429 视为瞬态，同批等待后重试
  describe("429 同批重试", () => {
    const opts = { ...base, urls: all, batchSize: 100, maxBatches: 3, stopOnFail: true };
    function spySleep() {
      const waits: number[] = [];
      return { waits, sleep: async (ms: number) => { waits.push(ms); } };
    }
    it("默认常量：60s 退避、最多重试 2 次", () => {
      expect(INDEXNOW_429_BACKOFF_MS).toBe(60_000);
      expect(INDEXNOW_429_MAX_RETRIES).toBe(2);
    });
    it("首批 429 → 等待 → 重试 200：本批计成功、retries=1，后续批照常", async () => {
      const f = fakeFetch([429, 200, 200, 200]);
      const s = spySleep();
      const res = await submitIndexNow({ ...opts, fetchImpl: f.impl, retry429: { backoffMs: 60_000, maxRetries: 2, sleep: s.sleep } });
      expect(res.map((r) => [r.status, r.ok, r.retries ?? 0])).toEqual([[200, true, 1], [200, true, 0], [200, true, 0]]);
      expect(f.bodies.length).toBe(4);
      expect(f.bodies[0]).toEqual(f.bodies[1]);
      expect(s.waits).toEqual([60_000]);
      expect(countRetries(res)).toBe(1);
      expect(acceptedUrls(all, res, 100)).toEqual(all.slice(0, 300));
      expect(summarizeIndexNow(res).ok).toBe(true);
    });
    it("连续 429 达上限（首发 + 2 次重试）才判失败并停止", async () => {
      const f = fakeFetch([429]);
      const s = spySleep();
      const res = await submitIndexNow({ ...opts, fetchImpl: f.impl, retry429: { backoffMs: 60_000, maxRetries: 2, sleep: s.sleep } });
      expect(res).toEqual([{ status: 429, ok: false, submitted: 100, retries: 2 }]);
      expect(f.bodies.length).toBe(3);
      expect(s.waits).toEqual([60_000, 60_000]);
      expect(countRetries(res)).toBe(2);
      expect(summarizeIndexNow(res)).toEqual({ ok: false, status: 429, message: "Too many requests", submitted: 0 });
      expect(acceptedUrls(all, res, 100)).toEqual([]);
    });
    it("非 429 失败（403/网络）不重试；未配置 retry429 时 429 也不重试（旧行为）", async () => {
      const s = spySleep();
      const f403 = fakeFetch([403]);
      expect((await submitIndexNow({ ...opts, fetchImpl: f403.impl, retry429: { backoffMs: 1, maxRetries: 2, sleep: s.sleep } }))[0].retries).toBeUndefined();
      const fNet = fakeFetch([-1]);
      expect((await submitIndexNow({ ...opts, fetchImpl: fNet.impl, retry429: { backoffMs: 1, maxRetries: 2, sleep: s.sleep } }))[0]).toEqual({ status: 0, ok: false, submitted: 100 });
      expect(s.waits).toEqual([]);
      const fOld = fakeFetch([429]);
      expect(await submitIndexNow({ ...opts, fetchImpl: fOld.impl })).toEqual([{ status: 429, ok: false, submitted: 100 }]);
      expect(fOld.bodies.length).toBe(1);
    });
  });

  // R517：06:00Z 首发+2 次重试仍 429；探针实测 Workers 出口对 api.indexnow.org/bing 恒 429，对 yandex/seznam/naver/yep 正常
  describe("429 换端点重发", () => {
    const fb = ["https://a.example/indexnow", "https://b.example/indexnow"];
    const opts = { ...base, urls: all, batchSize: 100, maxBatches: 3, stopOnFail: true, fallbackEndpoints: fb };
    function spySleep() {
      const waits: number[] = [];
      return { waits, sleep: async (ms: number) => { waits.push(ms); } };
    }
    it("默认备用端点：4 个参与引擎、不含主端点，全是 https", () => {
      expect(INDEXNOW_FALLBACK_ENDPOINTS.length).toBe(4);
      expect(INDEXNOW_FALLBACK_ENDPOINTS).not.toContain(INDEXNOW_ENDPOINT);
      expect(new Set(INDEXNOW_FALLBACK_ENDPOINTS.map((e) => new URL(e).host))).toEqual(new Set(["yandex.com", "search.seznam.cz", "searchadvisor.naver.com", "indexnow.yep.com"]));
    });
    it("主端点 429 → 立刻改发备用端点 202：不等待、同批同体、记 endpoint；下一批仍从主端点起发", async () => {
      const f = fakeFetch([429, 202, 429, 202, 429, 202]);
      const s = spySleep();
      const res = await submitIndexNow({ ...opts, fetchImpl: f.impl, retry429: { backoffMs: 60_000, maxRetries: 2, sleep: s.sleep } });
      expect(res).toEqual([
        { status: 202, ok: true, submitted: 100, endpoint: fb[0] },
        { status: 202, ok: true, submitted: 100, endpoint: fb[0] },
        { status: 202, ok: true, submitted: 100, endpoint: fb[0] },
      ]);
      expect(s.waits).toEqual([]);
      expect(f.urls).toEqual([INDEXNOW_ENDPOINT, fb[0], INDEXNOW_ENDPOINT, fb[0], INDEXNOW_ENDPOINT, fb[0]]);
      expect(f.bodies[0]).toEqual(f.bodies[1]);
      expect(f.bodies[0]).not.toEqual(f.bodies[2]);
      expect(countRetries(res)).toBe(0);
      expect(fallbackHosts(res)).toEqual(["a.example"]);
      expect(acceptedUrls(all, res, 100)).toEqual(all.slice(0, 300));
      expect(summarizeIndexNow(res)).toEqual({ ok: true, status: 202, message: "Accepted (key validation pending)", submitted: 300 });
    });
    it("主端点成功时不碰备用端点，结果不带 endpoint（旧形状）", async () => {
      const f = fakeFetch([200]);
      const res = await submitIndexNow({ ...opts, fetchImpl: f.impl });
      expect(res).toEqual([{ status: 200, ok: true, submitted: 100 }, { status: 200, ok: true, submitted: 100 }, { status: 200, ok: true, submitted: 100 }]);
      expect(f.urls.every((u) => u === INDEXNOW_ENDPOINT)).toBe(true);
      expect(fallbackHosts(res)).toEqual([]);
    });
    it("备用端点非 429 失败（403/网络）就地定案：不再换下一个、不重试、不计入快照", async () => {
      const s = spySleep();
      const f = fakeFetch([429, 403]);
      const res = await submitIndexNow({ ...opts, fetchImpl: f.impl, retry429: { backoffMs: 1, maxRetries: 2, sleep: s.sleep } });
      expect(res).toEqual([{ status: 403, ok: false, submitted: 100, endpoint: fb[0] }]);
      expect(f.urls).toEqual([INDEXNOW_ENDPOINT, fb[0]]);
      expect(s.waits).toEqual([]);
      expect(fallbackHosts(res)).toEqual([]);
      expect(acceptedUrls(all, res, 100)).toEqual([]);
      const fNet = fakeFetch([429, -1]);
      expect(await submitIndexNow({ ...opts, fetchImpl: fNet.impl, retry429: { backoffMs: 1, maxRetries: 2, sleep: s.sleep } })).toEqual([{ status: 0, ok: false, submitted: 100, endpoint: fb[0] }]);
    });
    it("全部端点 429 才退避；重试从主端点重新走一遍链；达上限判失败", async () => {
      const s = spySleep();
      const f = fakeFetch([429]);
      const res = await submitIndexNow({ ...opts, fetchImpl: f.impl, retry429: { backoffMs: 60_000, maxRetries: 2, sleep: s.sleep } });
      expect(res).toEqual([{ status: 429, ok: false, submitted: 100, retries: 2, endpoint: fb[1] }]);
      expect(f.urls.length).toBe(9);
      expect(f.urls.slice(0, 3)).toEqual([INDEXNOW_ENDPOINT, fb[0], fb[1]]);
      expect(s.waits).toEqual([60_000, 60_000]);
      const f2 = fakeFetch([429, 429, 429, 429, 200]);
      const s2 = spySleep();
      const res2 = await submitIndexNow({ ...opts, fetchImpl: f2.impl, retry429: { backoffMs: 60_000, maxRetries: 2, sleep: s2.sleep } });
      expect(res2[0]).toEqual({ status: 200, ok: true, submitted: 100, retries: 1, endpoint: fb[0] });
      expect(s2.waits).toEqual([60_000]);
      expect(fallbackHosts(res2)).toEqual(["a.example"]);
    });
    it("未配置 fallbackEndpoints 时行为与 R515 完全一致", async () => {
      const f = fakeFetch([429]);
      const s = spySleep();
      const res = await submitIndexNow({ ...opts, fallbackEndpoints: undefined, fetchImpl: f.impl, retry429: { backoffMs: 60_000, maxRetries: 2, sleep: s.sleep } });
      expect(res).toEqual([{ status: 429, ok: false, submitted: 100, retries: 2 }]);
      expect(f.urls.every((u) => u === INDEXNOW_ENDPOINT)).toBe(true);
      expect(f.urls.length).toBe(3);
    });
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
