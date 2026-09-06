/**
 * R528：撤销分享（DELETE /api/share/:id 成功或 404）后，本地分享记录移除，
 * 清单页顶部「分享链接已生成」行不再展示该 URL；候选清空时同样不展示。
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { addMyShare, loadMyShares, removeMyShare, visibleShareUrl, type MyShare } from "./my-shares";

const g = globalThis as unknown as { localStorage?: unknown };
const saved = g.localStorage;
beforeEach(() => {
  const store = new Map<string, string>();
  g.localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
  };
});
afterEach(() => {
  g.localStorage = saved;
});

const rec = (id: string, token?: string): MyShare => ({ id, url: `https://hunt.zalize.com/s/${id}`, createdAt: 1, count: 3, token });

describe("visibleShareUrl", () => {
  it("刚生成的分享：记录在本地列表且候选非空 → 展示", () => {
    const list = addMyShare(rec("abc", "tok"));
    expect(visibleShareUrl(rec("abc").url, list, 3)).toBe(rec("abc").url);
  });

  it("撤销成功后（removeMyShare）→ 不再展示已失效 URL", () => {
    addMyShare(rec("abc", "tok"));
    const after = removeMyShare("abc");
    expect(after).toEqual([]);
    expect(loadMyShares()).toEqual([]);
    expect(visibleShareUrl(rec("abc").url, after, 3)).toBe("");
  });

  it("撤销的是另一条记录 → 当前链接仍展示", () => {
    addMyShare(rec("old", "t1"));
    const list = addMyShare(rec("new", "t2"));
    expect(visibleShareUrl(rec("new").url, removeMyShare("old"), 3)).toBe(rec("new").url);
    expect(list.map((s) => s.id)).toEqual(["new", "old"]);
  });

  it("候选清空 → 不展示（即便记录未撤销）", () => {
    const list = addMyShare(rec("abc", "tok"));
    expect(visibleShareUrl(rec("abc").url, list, 0)).toBe("");
  });

  it("尚未生成分享（空串）→ 不展示", () => {
    expect(visibleShareUrl("", [rec("abc")], 3)).toBe("");
  });
});
