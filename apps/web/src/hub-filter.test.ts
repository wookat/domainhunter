import { describe, expect, it } from "vitest";
import { hubMatch } from "./components/hub-filter";

// /vs 卡片实际传入的字段形态（compare-hub-page.tsx）
const VS_FIELDS = ["com-vs-cn", ".com vs .cn", "com", "cn", ".com vs .cn：选哪个？", ".com vs .cn: which to pick?"];
// /tld 分组实际传入的字段形态（tld-hub-page.tsx）
const TLD_FIELDS = ["com", ".com", "全球通用，商用首选", "Universal default for business"];
// /guide 实际传入的字段形态（guide-hub-page.tsx）
const GUIDE_FIELDS = ["saas", "SaaS 域名", "SaaS domains", "软件订阅产品起名", "Naming a subscription software product", "b2b", "software"];

describe("hubMatch 去点归一（R510）", () => {
  it("/vs：不带点的 `com vs cn` 也命中 `.com vs .cn`", () => {
    expect(hubMatch("com vs cn", VS_FIELDS)).toBe(true);
    expect(hubMatch("COM VS CN", VS_FIELDS)).toBe(true);
    expect(hubMatch("com-vs-cn", VS_FIELDS)).toBe(true);
  });

  it("/vs：带点形式与单个 TLD 仍按原样命中", () => {
    expect(hubMatch(".com vs .cn", VS_FIELDS)).toBe(true);
    expect(hubMatch(".cn", VS_FIELDS)).toBe(true);
    expect(hubMatch("cn", VS_FIELDS)).toBe(true);
    expect(hubMatch("选哪个", VS_FIELDS)).toBe(true);
  });

  it("/vs：不相关关键词不命中；去点比对只在词边界处命中，`io vs ai` 不误中 `.studio vs .ai`", () => {
    expect(hubMatch("io vs ai", VS_FIELDS)).toBe(false);
    expect(hubMatch("xyz", VS_FIELDS)).toBe(false);
    const studio = ["studio-vs-ai", ".studio vs .ai", "studio", "ai", ".studio vs .ai：选哪个？"];
    expect(hubMatch("io vs ai", studio)).toBe(false);
    expect(hubMatch("studio vs ai", studio)).toBe(true);
    expect(hubMatch("ai", studio)).toBe(true);
  });

  it("/tld 与 /guide：带点 / 不带点 / 文案关键词行为一致；带点查询不因去点而扩大到 com.cn", () => {
    expect(hubMatch("com", TLD_FIELDS)).toBe(true);
    expect(hubMatch(".com", TLD_FIELDS)).toBe(true);
    expect(hubMatch("商用", TLD_FIELDS)).toBe(true);
    expect(hubMatch("net", TLD_FIELDS)).toBe(false);
    expect(hubMatch(".com", ["com.cn", "国内企业常用"])).toBe(false);
    expect(hubMatch("com", ["com.cn", "国内企业常用"])).toBe(true);
    expect(hubMatch("comcn", ["com.cn", ".com.cn"])).toBe(true);
    expect(hubMatch("saas", GUIDE_FIELDS)).toBe(true);
    expect(hubMatch("软件订阅", GUIDE_FIELDS)).toBe(true);
    expect(hubMatch("B2B", GUIDE_FIELDS)).toBe(true);
    expect(hubMatch("shop", GUIDE_FIELDS)).toBe(false);
  });

  it("空查询 / 仅空白 全部保留；纯 `.` 查询仍按原文匹配而不是匹配一切", () => {
    expect(hubMatch("", VS_FIELDS)).toBe(true);
    expect(hubMatch("   ", GUIDE_FIELDS)).toBe(true);
    expect(hubMatch(".", VS_FIELDS)).toBe(true);
    expect(hubMatch(".", GUIDE_FIELDS)).toBe(false);
    expect(hubMatch("..", GUIDE_FIELDS)).toBe(false);
  });
});
