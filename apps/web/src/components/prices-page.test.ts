import { describe, expect, it } from "vitest";

import { rankExactTld } from "./prices-page";

const rows = (...tlds: string[]) => tlds.map((tld, i) => ({ tld, reg: i }));
const tlds = <T extends { tld: string }>(list: T[]) => list.map((r) => r.tld);

describe("rankExactTld（/prices 精确后缀置顶）", () => {
  it("io：精确项从价格序第 5 位提到首位，其余相对顺序不变", () => {
    const list = rows("auction", "solutions", "bio", "vacations", "io", "studio");
    expect(tlds(rankExactTld(list, "io"))).toEqual(["io", "auction", "solutions", "bio", "vacations", "studio"]);
  });

  it("com：精确项置顶，company/community/computer 仍按传入顺序", () => {
    const list = rows("company", "community", "com", "computer");
    expect(tlds(rankExactTld(list, "com"))).toEqual(["com", "company", "community", "computer"]);
  });

  it("降序反转后精确项依然在首位（不会被翻到末尾）", () => {
    const list = rows("io", "bio", "studio").reverse();
    expect(tlds(list)[0]).toBe("studio");
    expect(tlds(rankExactTld(list, "io"))).toEqual(["io", "studio", "bio"]);
  });

  it("唯一命中（cn）与无命中（zz）/空查询：原样返回", () => {
    const only = rows("cn");
    expect(tlds(rankExactTld(only, "cn"))).toEqual(["cn"]);
    const none = rows("bio", "studio");
    expect(rankExactTld(none, "zz")).toBe(none);
    expect(rankExactTld(none, "")).toBe(none);
  });

  it("子串命中但无精确项（com.cn 不在列表）：不改变顺序", () => {
    const list = rows("cn", "com");
    expect(rankExactTld(list, "com.cn")).toBe(list);
  });
});
