import { describe, expect, it } from "vitest";

import { COMPARE_SLUGS } from "./compare-slugs";
import { GUIDE_LABELS } from "./guide-labels";
import { guideHubGroups } from "./guide-groups";
import { GROUP_CHIP_MAX, VIEW_ALL_LABEL, compareGroupChips, guideGroupChips, tldGroupChips, viewAllHref } from "./group-chips";
import { tldHubGroups } from "./tld-groups";
import { TLD_LIST } from "./tld-list";

const tldGroupOf = (tld: string) => tldHubGroups().find((g) => g.tlds.includes(tld))!;
const guideGroupOf = (slug: string) => guideHubGroups().find((g) => g.slugs.includes(slug))!;

describe("tldGroupChips", () => {
  it("组 <30：返回同组全部（排除自身、TLD_LIST 顺序、不截断）", () => {
    const small = tldHubGroups().find((g) => g.tlds.length - 1 < GROUP_CHIP_MAX)!;
    const self = small.tlds[Math.floor(small.tlds.length / 2)];
    const r = tldGroupChips(self);
    expect(r.chips).toEqual(small.tlds.filter((t) => t !== self));
    expect(r.chips).not.toContain(self);
    expect(r.total).toBe(small.tlds.length - 1);
    expect(r.chips.length).toBe(r.total);
    expect(r.anchor).toBe(small.id);
  });

  it("组 >30：按组内现有顺序截断为前 30（排除自身），total 记录截断前数量", () => {
    const big = tldHubGroups().find((g) => g.tlds.length - 1 > GROUP_CHIP_MAX)!;
    const self = big.tlds[big.tlds.length - 1];
    const r = tldGroupChips(self);
    expect(r.chips).toHaveLength(GROUP_CHIP_MAX);
    expect(r.chips).toEqual(big.tlds.filter((t) => t !== self).slice(0, GROUP_CHIP_MAX));
    expect(r.total).toBe(big.tlds.length - 1);
    expect(r.total).toBeGreaterThan(r.chips.length);
    /* 自身在前 30 内时也被排除，仍补足到 30 */
    const first = big.tlds[0];
    const r2 = tldGroupChips(first);
    expect(r2.chips).toHaveLength(GROUP_CHIP_MAX);
    expect(r2.chips).not.toContain(first);
    expect(r2.chips[0]).toBe(big.tlds[1]);
  });

  it("每个 TLD 都有组归属、≤30 且不含自身；未知 TLD 兜底为空", () => {
    for (const tld of TLD_LIST) {
      const r = tldGroupChips(tld);
      expect(r.anchor, tld).toBe(tldGroupOf(tld).id);
      expect(r.chips.length, tld).toBeLessThanOrEqual(GROUP_CHIP_MAX);
      expect(r.chips.length, tld).toBeGreaterThan(0);
      expect(r.chips, tld).not.toContain(tld);
      expect(new Set(r.chips).size).toBe(r.chips.length);
    }
    expect(tldGroupChips("not-a-tld")).toEqual({ chips: [], anchor: null, total: 0 });
  });

  it("/tld/com：通用主流组 21 个（<30，不截断）", () => {
    const r = tldGroupChips("com");
    expect(r.anchor).toBe("general");
    expect(r.chips.length).toBe(tldGroupOf("com").tlds.length - 1);
    expect(r.chips.length).toBeLessThan(GROUP_CHIP_MAX);
  });
});

describe("guideGroupChips", () => {
  it("组 <30：返回同组全部（排除自身、GUIDE_LIST 顺序）", () => {
    const r = guideGroupChips("saas");
    const g = guideGroupOf("saas");
    expect(r.anchor).toBe(g.id);
    expect(r.chips).toEqual(g.slugs.filter((s) => s !== "saas"));
    expect(r.chips.length).toBeLessThan(GROUP_CHIP_MAX);
  });

  it("组 >30：截断为前 30", () => {
    const big = guideHubGroups().find((g) => g.slugs.length - 1 > GROUP_CHIP_MAX)!;
    const self = big.slugs[big.slugs.length - 1];
    const r = guideGroupChips(self);
    expect(r.chips).toEqual(big.slugs.filter((s) => s !== self).slice(0, GROUP_CHIP_MAX));
    expect(r.total).toBe(big.slugs.length - 1);
  });

  it("每个指南都有组归属、≤30、不含自身且 slug 都在 GUIDE_LABELS；未知 slug 兜底为空", () => {
    const known = new Set(GUIDE_LABELS.map((g) => g.slug));
    for (const { slug } of GUIDE_LABELS) {
      const r = guideGroupChips(slug);
      expect(r.anchor, slug).toBe(guideGroupOf(slug).id);
      expect(r.chips.length, slug).toBeLessThanOrEqual(GROUP_CHIP_MAX);
      expect(r.chips.length, slug).toBeGreaterThan(0);
      expect(r.chips, slug).not.toContain(slug);
      for (const c of r.chips) expect(known.has(c), c).toBe(true);
    }
    expect(guideGroupChips("nope")).toEqual({ chips: [], anchor: null, total: 0 });
  });
});

describe("compareGroupChips", () => {
  const sidesIn = (slug: string, set: Set<string>) => slug.split("-vs-").every((t) => set.has(t));

  it("两侧同组（com vs net，通用主流）：候选 = 该组内两两对比，COMPARE_SLUGS 顺序、排除自身、≤30", () => {
    const r = compareGroupChips("com-vs-net");
    const u = new Set(tldGroupOf("com").tlds);
    expect(tldGroupOf("net").id).toBe(tldGroupOf("com").id);
    const expected = COMPARE_SLUGS.filter((s) => s !== "com-vs-net" && sidesIn(s, u));
    expect(r.chips).toEqual(expected.slice(0, GROUP_CHIP_MAX));
    expect(r.total).toBe(expected.length);
    expect(r.anchor).toBe("com");
    expect(r.chips).not.toContain("com-vs-net");
  });

  it("两侧不同组（com vs cn，通用 + 地域）：候选 = 两组并集内的对比，含跨组（us-vs-com）与组内（com-vs-net、wang-vs-cn）", () => {
    const r = compareGroupChips("com-vs-cn");
    expect(tldGroupOf("com").id).not.toBe(tldGroupOf("cn").id);
    const u = new Set([...tldGroupOf("com").tlds, ...tldGroupOf("cn").tlds]);
    const expected = COMPARE_SLUGS.filter((s) => s !== "com-vs-cn" && sidesIn(s, u));
    expect(r.chips).toEqual(expected.slice(0, GROUP_CHIP_MAX));
    expect(r.chips).toHaveLength(GROUP_CHIP_MAX);
    expect(r.total).toBeGreaterThan(GROUP_CHIP_MAX);
    expect(r.chips).toContain("com-vs-net");
    expect(r.chips).toContain("us-vs-com");
    expect(r.chips).toContain("wang-vs-cn");
    expect(r.chips).not.toContain("io-vs-ai");
    expect(new Set(r.chips).size).toBe(r.chips.length);
  });

  it("无组归属兜底：两侧 TLD 都不在任何组时，以自身为单元素组 → 只保留共享两侧 TLD 的对比；完全没有则为空、只剩 hub 链接", () => {
    const slugs = ["zz-vs-yy", "zz-vs-xx", "yy-vs-zz", "qq-vs-yy", "com-vs-zz", "zz-vs-yy"];
    const r = compareGroupChips("zz-vs-yy", GROUP_CHIP_MAX, slugs);
    expect(r.chips).toEqual(["yy-vs-zz"]);
    expect(r.total).toBe(1);
    expect(r.anchor).toBe("zz");
    expect(compareGroupChips("zz-vs-yy", GROUP_CHIP_MAX, ["zz-vs-yy", "com-vs-net"])).toEqual({ chips: [], anchor: "zz", total: 0 });
    expect(compareGroupChips("broken")).toEqual({ chips: [], anchor: null, total: 0 });
  });

  it("一侧有组一侧无组：并集 = 有组侧全组 + 无组侧自身", () => {
    const slugs = ["com-vs-zz", "com-vs-net", "net-vs-zz", "zz-vs-io", "io-vs-ai"];
    const r = compareGroupChips("com-vs-zz", GROUP_CHIP_MAX, slugs);
    expect(r.chips).toEqual(["com-vs-net", "net-vs-zz"]);
  });

  it("全部 444 个对比：每页 ≥1 个 chip、≤30、不含自身、锚点为 a 侧 TLD", () => {
    for (const slug of COMPARE_SLUGS) {
      const r = compareGroupChips(slug);
      expect(r.chips.length, slug).toBeGreaterThan(0);
      expect(r.chips.length, slug).toBeLessThanOrEqual(GROUP_CHIP_MAX);
      expect(r.chips, slug).not.toContain(slug);
      expect(r.anchor).toBe(slug.split("-vs-")[0]);
    }
  });
});

describe("VIEW_ALL_LABEL / viewAllHref", () => {
  it("N 由计数源派生（TLD_LIST / GUIDE_LABELS / COMPARE_SLUGS 长度），不写死", () => {
    expect(VIEW_ALL_LABEL.tld.zh).toBe(`查看全部 ${TLD_LIST.length} 个 TLD 指南 →`);
    expect(VIEW_ALL_LABEL.guide.en).toBe(`View all ${GUIDE_LABELS.length} industry naming guides →`);
    expect(VIEW_ALL_LABEL.vs.zh).toContain(String(COMPARE_SLUGS.length));
  });

  it("hub 链接带 lang 与分组锚点；无组归属时不带锚点", () => {
    expect(viewAllHref("tld", "general", "zh")).toBe("/tld?lang=zh#hub-g-general");
    expect(viewAllHref("vs", "com", "en")).toBe("/vs?lang=en#hub-g-com");
    expect(viewAllHref("guide", null, "en")).toBe("/guide?lang=en");
  });
});
