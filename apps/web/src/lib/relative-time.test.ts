import { describe, expect, it } from "vitest";
import { createdAgoLabel, daysBetween } from "./relative-time";

const DAY = 24 * 3600 * 1000;
// 固定基准：2026-08-09 12:00 本地时间
const NOW = new Date(2026, 7, 9, 12, 0, 0).getTime();

describe("daysBetween", () => {
  it("同一天为 0（含当天更早时刻）", () => {
    expect(daysBetween(NOW - 3600 * 1000, NOW)).toBe(0);
    expect(daysBetween(NOW, NOW)).toBe(0);
  });

  it("跨自然日按日历日差计（昨天 23:59 也算 1 天前）", () => {
    const lastNight = new Date(2026, 7, 8, 23, 59, 0).getTime();
    expect(daysBetween(lastNight, NOW)).toBe(1);
    expect(daysBetween(NOW - 3 * DAY, NOW)).toBe(3);
  });

  it("非法/未来时间戳记 0", () => {
    expect(daysBetween(0, NOW)).toBe(0);
    expect(daysBetween(NaN, NOW)).toBe(0);
    expect(daysBetween(NOW + DAY, NOW)).toBe(0);
  });
});

describe("createdAgoLabel", () => {
  it("中文：今天 / N 天前", () => {
    expect(createdAgoLabel(NOW, "zh", NOW)).toBe("创建于今天");
    expect(createdAgoLabel(NOW - 5 * DAY, "zh", NOW)).toBe("创建于 5 天前");
  });

  it("英文：today / 1 day ago / N days ago", () => {
    expect(createdAgoLabel(NOW, "en", NOW)).toBe("Created today");
    expect(createdAgoLabel(NOW - 1 * DAY, "en", NOW)).toBe("Created 1 day ago");
    expect(createdAgoLabel(NOW - 7 * DAY, "en", NOW)).toBe("Created 7 days ago");
  });
});
