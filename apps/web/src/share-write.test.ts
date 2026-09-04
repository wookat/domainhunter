import { describe, expect, it } from "vitest";
import { putShareVerified, SHARE_WRITE_ATTEMPTS_PER_ID, SHARE_WRITE_MAX_IDS, type ShareKv } from "./share-write";

/** 模拟「首写静默丢失」的 KV：前 dropFirst 次 put 成功返回但实际没写进去 */
function flakyKv(dropFirst: number, opts?: { throwInstead?: boolean }): ShareKv & { store: Map<string, string>; puts: number } {
  const store = new Map<string, string>();
  const kv = {
    store,
    puts: 0,
    async put(key: string, value: string) {
      kv.puts++;
      if (kv.puts <= dropFirst) {
        if (opts?.throwInstead) throw new Error("kv put failed");
        return; // 静默丢失：不写入
      }
      store.set(key, value);
    },
    async get(key: string) {
      return store.get(key) ?? null;
    },
  };
  return kv;
}

const noBackoff = async () => {};
let seq = 0;
const nextId = () => `id${++seq}`;

describe("putShareVerified", () => {
  it("首写成功：无重试、不换 id", async () => {
    const kv = flakyKv(0);
    const r = await putShareVerified(kv, nextId, (id) => `payload-${id}`, 60, noBackoff);
    expect(r.ok).toBe(true);
    expect(r.retries).toBe(0);
    expect(r.idRotated).toBe(false);
    expect(kv.store.get(`share:${r.id}`)).toBe(`payload-${r.id}`);
  });

  it("首写静默丢失：读回校验发现后重试同 id 成功", async () => {
    const kv = flakyKv(1);
    const r = await putShareVerified(kv, nextId, (id) => `payload-${id}`, 60, noBackoff);
    expect(r.ok).toBe(true);
    expect(r.retries).toBe(1);
    expect(r.idRotated).toBe(false);
    expect(kv.store.get(`share:${r.id}`)).toBe(`payload-${r.id}`);
  });

  it("同 id 连续 3 次写丢：换新 id 重写成功", async () => {
    const kv = flakyKv(SHARE_WRITE_ATTEMPTS_PER_ID);
    const firstId = `id${seq + 1}`;
    const r = await putShareVerified(kv, nextId, (id) => `payload-${id}`, 60, noBackoff);
    expect(r.ok).toBe(true);
    expect(r.idRotated).toBe(true);
    expect(r.id).not.toBe(firstId);
    expect(kv.store.get(`share:${r.id}`)).toBe(`payload-${r.id}`);
    expect(kv.store.has(`share:${firstId}`)).toBe(false);
  });

  it("put 抛错与静默丢失同样重试", async () => {
    const kv = flakyKv(2, { throwInstead: true });
    const r = await putShareVerified(kv, nextId, (id) => `payload-${id}`, 60, noBackoff);
    expect(r.ok).toBe(true);
    expect(r.retries).toBe(2);
  });

  it("全部尝试（2 个 id × 3 次）失败：返回 ok=false，不返回假成功", async () => {
    const kv = flakyKv(SHARE_WRITE_ATTEMPTS_PER_ID * SHARE_WRITE_MAX_IDS);
    const r = await putShareVerified(kv, nextId, (id) => `payload-${id}`, 60, noBackoff);
    expect(r.ok).toBe(false);
    expect(r.retries).toBe(SHARE_WRITE_ATTEMPTS_PER_ID * SHARE_WRITE_MAX_IDS);
    expect(kv.store.size).toBe(0);
  });

  it("put 抛错时收集消息摘要（去重），供失败日志排查", async () => {
    const kv = flakyKv(SHARE_WRITE_ATTEMPTS_PER_ID * SHARE_WRITE_MAX_IDS, { throwInstead: true });
    const r = await putShareVerified(kv, nextId, (id) => `payload-${id}`, 60, noBackoff);
    expect(r.ok).toBe(false);
    expect(r.errors).toEqual(["kv put failed"]);
  });

  it("静默丢失（不抛错）不产生错误消息；成功路径 errors 为空", async () => {
    const kv = flakyKv(1);
    const r = await putShareVerified(kv, nextId, (id) => `payload-${id}`, 60, noBackoff);
    expect(r.ok).toBe(true);
    expect(r.errors).toEqual([]);
  });
});
