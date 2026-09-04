// R473 品牌卡墙去重与撞色重排自检脚本（无测试框架，独立 node 脚本，0 AI 调用）
// 用法：node scripts/verify-r473.mjs
// 覆盖：
//   A. brandLook variant：variant 0 与 R468 完全一致（配色下标 = fnv1a & 15）；三个变体两两不同色；
//      版式/字形/图形/大小写/切分位不随 variant 变化（「同名同外观」只换色）。
//   B. 分组与选席（R469 复现数据：daysync ×3 TLD、pulseplan ×2 TLD）：Grid 一名一卡、组内保持评分序；
//      Top Picks 3 席 = 3 个不同 label，同名多 TLD 只占一席，跳过已用 label 后顺延。
//   C. 撞色重排：R469 zh 场景（petwan / chongsi 同为 #FFD200）在 variant 0 下确实撞色，重排后相邻不同色；
//      Top Picks 段先分配、Grid 段复用同一 variant → 同名在两段 brandLook 序列化 byte-equal；确定性（两次运行同结果）。
//   D. 随机模糊：1000 组随机 label 序列，段内首次出现的 label 与前一张永不撞色；
//      仅当两张均为「已分配」且被迫相邻时才可能撞色，统计其占比作为已知限制的量化。
//   E. 配色对比度：16 组 fg/bg ≥ 4.5:1（variant 只在这 16 组内轮换，故任意 variant 都满足）。
import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const webRequire = createRequire(path.join(root, "apps/web/package.json"));
const viteRequire = createRequire(webRequire.resolve("vite/package.json"));
const { build } = viteRequire("esbuild");
const tmp = path.join(root, "scripts/.brand-wall-r473-compiled.mjs");
await build({
  stdin: {
    contents: 'export * from "@/lib/brand-look"; export * from "@/lib/brand-wall";',
    resolveDir: path.join(root, "scripts"),
    loader: "ts",
  },
  bundle: true,
  format: "esm",
  outfile: tmp,
  alias: { "@": path.join(root, "apps/web/src") },
  logLevel: "silent",
});
const mod = await import(`file://${tmp}?t=${Date.now()}`);
rmSync(tmp, { force: true });
const { PALETTES, BRAND_VARIANTS, brandLook, paletteIndexOf, groupByLabel, pickTopGroups, assignBrandVariants, variantOf } = mod;

let failed = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` ${detail}` : ""}`);
  if (!ok) failed++;
}

function fnv1a(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

// ---------- A. variant 语义 ----------
const SAMPLE = ["daysync", "pulseplan", "petwan", "chongsi", "castloom", "lumora", "zap", "penfold", "Nimbly", "kaiwen"];
check(
  "A1 variant 0 配色下标 = fnv1a(lower) & 15（与 R468 完全一致）",
  SAMPLE.every((l) => brandLook(l).paletteIndex === (fnv1a(l.toLowerCase()) & 15) && brandLook(l, 0).paletteIndex === brandLook(l).paletteIndex),
);
check(
  "A2 三个变体两两不同色",
  SAMPLE.every((l) => new Set(BRAND_VARIANTS.map((v) => paletteIndexOf(l, v))).size === 3),
);
const stripPalette = ({ palette: _p, paletteIndex: _i, ...rest }) => JSON.stringify(rest);
check(
  "A3 variant 只换色：layout/type/shape/case/split 不变",
  SAMPLE.every((l) => new Set(BRAND_VARIANTS.map((v) => stripPalette(brandLook(l, v)))).size === 1),
);
check("A4 大小写不敏感", brandLook("DaySync", 2).paletteIndex === brandLook("daysync", 2).paletteIndex);

// ---------- B. 分组与选席（R469 复现） ----------
const mk = (label, tld, score, status = "available") => ({
  domain: `${label}.${tld}`,
  label,
  tld,
  status,
  scores: { s: score },
});
// 评分序（高→低）：pulseplan.com 92, pulseplan.dev 90, daysync.com 88, daysync.io 87, daysync.dev 86, petwan.com 85, chongsi.com 84, castloom.com 80
const sorted = [
  mk("pulseplan", "com", 92),
  mk("pulseplan", "dev", 90),
  mk("daysync", "com", 88),
  mk("daysync", "io", 87),
  mk("daysync", "dev", 86),
  mk("petwan", "com", 85),
  mk("chongsi", "com", 84),
  mk("castloom", "com", 80),
];
const groups = groupByLabel(sorted);
check("B1 Grid 一名一卡：8 行 → 5 组", groups.length === 5, `(${groups.map((g) => g.label).join(",")})`);
check("B2 组顺序 = 首次出现（评分）序", groups.map((g) => g.label).join() === "pulseplan,daysync,petwan,chongsi,castloom");
check(
  "B3 组内 TLD 保持评分序，首个为默认操作对象",
  groups[1].rows.map((r) => r.tld).join() === "com,io,dev" && groups[1].rows[0].domain === "daysync.com",
);
const top = pickTopGroups(sorted, 3);
check("B4 Top Picks 3 席 = 3 个不同 label", top.length === 3 && new Set(top.map((g) => g.label)).size === 3, `(${top.map((g) => g.label).join(",")})`);
check("B5 同名多 TLD 只占一席（pulseplan ×2 → 1 席）且第三席顺延到 petwan", top.map((g) => g.label).join() === "pulseplan,daysync,petwan");
check("B6 Top Picks 卡下 TLD 胶囊 = 该组全部可注册 TLD", top[1].rows.length === 3 && top[0].rows.length === 2);
check("B7 不足 3 个不同 label 时不补位", pickTopGroups(sorted.slice(0, 5), 3).length === 2);
check("B8 分组大小写不敏感（DaySync / daysync 同组）", groupByLabel([mk("DaySync", "com", 1), mk("daysync", "io", 1)]).length === 1);

// ---------- C. 撞色重排 ----------
check(
  "C1 R469 场景复现：petwan 与 chongsi 在 variant 0 下同色（#FFD200 黄）",
  paletteIndexOf("petwan") === paletteIndexOf("chongsi") && PALETTES[paletteIndexOf("petwan")].bg === "#FFD200",
  `(idx ${paletteIndexOf("petwan")}/${paletteIndexOf("chongsi")})`,
);
const zhTop = ["petwan", "chongsi", "kaiwen"];
const zhGrid = ["petwan", "chongsi", "kaiwen", "daysync", "pulseplan", "castloom", "lumora", "penfold"];
const vm = assignBrandVariants([zhTop, zhGrid]);
const paletteSeq = (labels) => labels.map((l) => paletteIndexOf(l, variantOf(vm, l)));
const noAdjacent = (seq) => seq.every((p, i) => i === 0 || p !== seq[i - 1]);
check("C2 Top Picks 重排后相邻不同色", noAdjacent(paletteSeq(zhTop)), `(${paletteSeq(zhTop).join(",")})`);
check("C3 Grid 重排后相邻不同色", noAdjacent(paletteSeq(zhGrid)), `(${paletteSeq(zhGrid).join(",")})`);
check("C4 先到者不改：petwan 仍为 variant 0（R468 原色）", variantOf(vm, "petwan") === 0);
check(
  "C5 同名在 Top Picks 与 Grid 外观 byte-equal（同一 variant → brandLook JSON 相同）",
  zhTop.every((l) => JSON.stringify(brandLook(l, variantOf(vm, l))) === JSON.stringify(brandLook(l, variantOf(assignBrandVariants([zhTop, zhGrid]), l)))) &&
    zhTop.every((l) => vm.get(l) === assignBrandVariants([zhTop]).get(l)),
);
check("C6 确定性：两次分配结果逐项相同", JSON.stringify([...vm]) === JSON.stringify([...assignBrandVariants([zhTop, zhGrid])]));
check("C7 未分配 label 的 variantOf 回退 0", variantOf(vm, "never-seen") === 0);

// ---------- D. 随机模糊 ----------
let seed = 473;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
const randLabel = () => {
  const n = 4 + Math.floor(rnd() * 6);
  let s = "";
  for (let i = 0; i < n; i++) s += String.fromCharCode(97 + Math.floor(rnd() * 26));
  return s;
};
let firstSeenCollision = 0;
let forcedCollision = 0;
let adjacentPairs = 0;
for (let t = 0; t < 1000; t++) {
  const pool = Array.from({ length: 6 + Math.floor(rnd() * 20) }, randLabel);
  const topL = pool.slice(0, 3);
  const gridL = [...pool].sort(() => rnd() - 0.5);
  const m = assignBrandVariants([topL, gridL]);
  for (const labels of [topL, gridL]) {
    for (let i = 1; i < labels.length; i++) {
      adjacentPairs++;
      const a = labels[i - 1];
      const b = labels[i];
      const collide = paletteIndexOf(a, variantOf(m, a)) === paletteIndexOf(b, variantOf(m, b));
      const bothFixed = labels === gridL && topL.includes(a) && topL.includes(b);
      if (collide) {
        if (bothFixed) forcedCollision++;
        else firstSeenCollision++;
      }
    }
  }
}
check("D1 相邻两张至少一张为本段首次分配时永不撞色（1000 组随机）", firstSeenCollision === 0, `(${firstSeenCollision})`);
console.log(`INFO D2 两张均已在 Top Picks 定色又乱序相邻的撞色 ${forcedCollision}/${adjacentPairs} 相邻对（${((forcedCollision / adjacentPairs) * 100).toFixed(2)}%，已知限制）`);

// ---------- E. 对比度 ----------
function lum(hex) {
  const c = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};
const worst = Math.min(...PALETTES.map((p) => Math.min(ratio(p.fg, p.bg), p.bg2 ? ratio(p.fg, p.bg2) : Infinity)));
check("E1 16 组配色 fg/bg（含渐变两端）≥ 4.5:1", worst >= 4.5, `(min ${worst.toFixed(2)})`);
check("E2 PALETTES 恰 16 组（& 15 与步长 5 互质假设成立）", PALETTES.length === 16);

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
