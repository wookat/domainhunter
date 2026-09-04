/**
 * 品牌卡墙布局层纯逻辑（R473，零 React 依赖，供 verify 脚本直接打包）：
 * 1. 按 label 分组：同一名字跨 TLD 只占一张卡，TLD 以胶囊列在卡下；
 * 2. Top Picks 选席：沿用现有评分顺序，跳过已用 label，3 席 = 3 个不同名字；
 * 3. 相邻撞色重排：布局顺序确定后一次确定性遍历，相邻同 palette 时给后一张换 variant（0/1/2）。
 *    variant 以 label **首次出现位置**决定并全页复用（Top Picks 段先于 Grid 段处理），
 *    故同一名字在 Top Picks / Grid / 行视图色点里永远同一外观。
 */
import { BRAND_VARIANTS, paletteIndexOf, type BrandVariant } from "@/lib/brand-look";

export interface LabelGroup<R extends { label: string; tld: string }> {
  label: string;
  /** 组内域名，保持传入顺序（评分序），首个为默认操作对象 */
  rows: R[];
}

/** 按 label（大小写不敏感）分组，组顺序 = label 首次出现顺序 */
export function groupByLabel<R extends { label: string; tld: string }>(rows: readonly R[]): LabelGroup<R>[] {
  const m = new Map<string, LabelGroup<R>>();
  for (const r of rows) {
    const key = r.label.toLowerCase();
    const g = m.get(key);
    if (g) g.rows.push(r);
    else m.set(key, { label: r.label, rows: [r] });
  }
  return [...m.values()];
}

/** Top Picks 选席：按传入（已排序）顺序取前 n 个不同 label 的组 */
export function pickTopGroups<R extends { label: string; tld: string }>(sortedRows: readonly R[], n = 3): LabelGroup<R>[] {
  return groupByLabel(sortedRows).slice(0, n);
}

export type VariantMap = ReadonlyMap<string, BrandVariant>;

/**
 * 回看位撞色代价（软约束）：下标 k = 与前第 k 张同色的代价。k=2 是 sm 2 列的上一行，k=3 是 lg 3 列的
 * 上一行（桌面主视图，权重最高）；k=1 是硬约束不在此列。
 */
const LOOKBACK_COST = [0, 0, 1, 2] as const;

/**
 * 相邻撞色重排。`sections` 为各卡墙段（Top Picks、Grid）的 label 序列，段内相邻才算相邻。
 * 规则：逐段逐张遍历；label 已分配则沿用（不改先到者）；否则在 0/1/2 中选与前一张、以及下一张
 * （若其已分配）都不同色、且与前 LOOKBACK 张撞色最少的最小 variant。前后不同色是硬约束
 * （3 个变体两两不同色，至多排除 2 个，必有解）；两张均已分配又恰好相邻同色时无法再改
 * （仅 Top Picks 的 label 在 Grid 中乱序相邻才会发生，verify-r473 D2 量化为 <1%）。
 */
export function assignBrandVariants(sections: readonly (readonly string[])[]): Map<string, BrandVariant> {
  const out = new Map<string, BrandVariant>();
  for (const labels of sections) {
    const palettes: number[] = [];
    for (let i = 0; i < labels.length; i++) {
      const label = labels[i].toLowerCase();
      let v = out.get(label);
      if (v === undefined) {
        const prev = palettes[palettes.length - 1];
        const nextLabel = i + 1 < labels.length ? labels[i + 1].toLowerCase() : undefined;
        const nextV = nextLabel === undefined ? undefined : out.get(nextLabel);
        const next = nextLabel !== undefined && nextV !== undefined ? paletteIndexOf(nextLabel, nextV) : undefined;
        let best: BrandVariant = 0;
        let bestCost = Number.POSITIVE_INFINITY;
        for (const cand of BRAND_VARIANTS) {
          const idx = paletteIndexOf(label, cand);
          if (idx === prev || idx === next) continue;
          let cost = 0;
          for (let k = 2; k < LOOKBACK_COST.length; k++) {
            if (palettes[palettes.length - k] === idx) cost += LOOKBACK_COST[k];
          }
          if (cost < bestCost) {
            bestCost = cost;
            best = cand;
          }
        }
        v = best;
        out.set(label, v);
      }
      palettes.push(paletteIndexOf(label, v));
    }
  }
  return out;
}

export function variantOf(map: VariantMap, label: string): BrandVariant {
  return map.get(label.toLowerCase()) ?? 0;
}
