import { describe, expect, it } from "vitest";
import { buildAvailableText } from "./results-export";
import type { TFunc } from "./i18n";

const tZh: TFunc = (key) => (key === "status.available" ? "可注册" : key);
const tEn: TFunc = (key) => (key === "status.available" ? "Available" : key);

describe("buildAvailableText", () => {
  it("每行一个域名，含 zh 状态与 ¥ 首年价（静态参考价）", () => {
    const out = buildAvailableText(
      [
        { domain: "chaxiangji.cn", tld: "cn" },
        { domain: "teabloom.com", tld: "com" },
      ],
      "zh",
      null,
      tZh,
    );
    const lines = out.split("\n");
    expect(lines).toHaveLength(2);
    expect(lines[0]).toMatch(/^chaxiangji\.cn · 可注册 · 首年 ¥\d+/);
    expect(lines[1]).toMatch(/^teabloom\.com · 可注册 · 首年 ¥\d+/);
  });

  it("英文输出用 $ 价格；tld 缺失时从域名推导", () => {
    const out = buildAvailableText([{ domain: "mingxiang.com" }], "en", null, tEn);
    expect(out).toMatch(/^mingxiang\.com · Available · 1st yr ≈\$\d+/);
  });

  it("实时价优先于静态参考价", () => {
    const prices = { com: { registration: 10.5, renewal: 12 } };
    const out = buildAvailableText([{ domain: "a.com", tld: "com" }], "zh", prices, tZh);
    expect(out).toBe("a.com · 可注册 · 首年 $10.5 ≈¥76");
  });

  it("无价格的后缀只输出域名与状态", () => {
    const out = buildAvailableText([{ domain: "x.zzz-unknown", tld: "zzz-unknown" }], "zh", null, tZh);
    expect(out).toBe("x.zzz-unknown · 可注册");
  });
});
