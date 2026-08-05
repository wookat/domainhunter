export interface GenerateOptions {
  roots: string[];
  prefixes?: string[];
  suffixes?: string[];
  tlds: string[];
  maxCandidates?: number;
}

const LABEL_RE = /^(?!-)[a-z0-9-]{1,63}(?<!-)$/;

export function normalizeLabel(s: string): string {
  return s.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
}

export function generateCandidates(opts: GenerateOptions): string[] {
  const roots = opts.roots.map(normalizeLabel).filter(Boolean);
  const prefixes = ["", ...(opts.prefixes ?? []).map(normalizeLabel).filter(Boolean)];
  const suffixes = ["", ...(opts.suffixes ?? []).map(normalizeLabel).filter(Boolean)];
  const tlds = opts.tlds.map((t) => t.trim().toLowerCase().replace(/^\./, "")).filter(Boolean);
  const max = opts.maxCandidates ?? 5000;

  const out: string[] = [];
  const seen = new Set<string>();
  for (const root of roots) {
    for (const pre of prefixes) {
      for (const suf of suffixes) {
        const label = `${pre}${root}${suf}`;
        if (!LABEL_RE.test(label)) continue;
        for (const tld of tlds) {
          const domain = `${label}.${tld}`;
          if (seen.has(domain)) continue;
          seen.add(domain);
          out.push(domain);
          if (out.length >= max) return out;
        }
      }
    }
  }
  return out;
}
