import { describe, expect, it } from "vitest";

import { looksExactQuery } from "@/components/home-page";
import { isExactQueryLanding, landingSearchMode } from "./q-landing";

describe("looksExactQuery（/?q= 是否像现成名字/域名）", () => {
  it("现成名字（≥3 字符）与已支持后缀的域名 → 精确核验", () => {
    expect(looksExactQuery("chaxiang")).toBe(true);
    expect(looksExactQuery("stackpilot.app")).toBe(true);
    expect(looksExactQuery("baidu.com.cn")).toBe(true);
    expect(looksExactQuery("  Lingxicha.AI ")).toBe(true);
  });

  it("寓意描述、过短名字、未知后缀 → 不是精确核验", () => {
    expect(looksExactQuery("新中式茶叶电商，寓意一杯好茶慢下来")).toBe(false);
    expect(looksExactQuery("Minimal meditation app for remote teams")).toBe(false);
    expect(looksExactQuery("ab")).toBe(false);
    expect(looksExactQuery("baidu.iox")).toBe(false);
    expect(looksExactQuery("")).toBe(false);
  });
});

describe("landingSearchMode（/?q= 落地选精确核验还是 AI 猎名）", () => {
  it("结果页「复制搜索链接」/ /tld /guide「去核验」/ 手输 ?q=<名字> → exact", () => {
    expect(landingSearchMode("?q=chaxiang", looksExactQuery)).toBe("exact");
    expect(landingSearchMode("?q=stackpilot.app&tld=app", looksExactQuery)).toBe("exact");
    expect(landingSearchMode("?q=baidu.com.cn", looksExactQuery)).toBe("exact");
  });

  it("?q=<寓意描述> 仍走 AI 猎名（分享搜索链接原语义不变）", () => {
    expect(landingSearchMode("?q=%E6%96%B0%E4%B8%AD%E5%BC%8F%E8%8C%B6%E5%8F%B6%E7%94%B5%E5%95%86", looksExactQuery)).toBe("ai");
    expect(landingSearchMode("?q=Minimal+meditation+app", looksExactQuery)).toBe("ai");
  });

  it("显式 ?mode=exact 无论 q 为何都 exact；?tpl= 模板入口无 q 走 AI", () => {
    expect(landingSearchMode("?mode=exact", looksExactQuery)).toBe("exact");
    expect(landingSearchMode("?mode=exact&q=%E8%8C%B6%E5%8F%B6", looksExactQuery)).toBe("exact");
    expect(landingSearchMode("?tpl=tea", looksExactQuery)).toBe("ai");
    expect(landingSearchMode("", looksExactQuery)).toBe("ai");
  });
});

describe("isExactQueryLanding（仅 q 本身像名字时才自动核验并滚到结果）", () => {
  it("q 像名字 → true；mode=exact 但无 q → false（没有可自动核验的对象）", () => {
    expect(isExactQueryLanding("?q=chaxiang", looksExactQuery)).toBe(true);
    expect(isExactQueryLanding("?mode=exact", looksExactQuery)).toBe(false);
    expect(isExactQueryLanding("?q=%E8%8C%B6%E5%8F%B6", looksExactQuery)).toBe(false);
  });
});
