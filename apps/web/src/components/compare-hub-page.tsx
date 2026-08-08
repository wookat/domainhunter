import { useMemo, useState } from "react";
import { TLD_COMPARES } from "@/content/compares";
import { HUB_META, compareHubGroups } from "@/content/hubs";
import { useI18n } from "@/lib/i18n";
import { usePageTitle } from "@/lib/use-page-title";
import { HubFilter, HubFilterEmpty, hubMatch } from "./hub-filter";

/** /vs 索引 hub：全部 TLD 对比页，按左侧后缀分组。DOM 与 worker 的 compareHubBlocks 骨架逐字一致。 */
export function CompareHubPage() {
  const { lang } = useI18n();
  const meta = HUB_META.vs[lang];
  usePageTitle(meta.title);
  const [query, setQuery] = useState("");
  const groups = useMemo(() => compareHubGroups(), []);
  const total = useMemo(() => groups.reduce((n, g) => n + g.slugs.length, 0), [groups]);
  const filtered = useMemo(
    () =>
      groups
        .map((g) => ({
          ...g,
          slugs: g.slugs.filter((slug) => {
            const c = TLD_COMPARES[slug];
            return hubMatch(query, [slug, `.${c.a} vs .${c.b}`, c.a, c.b, c.zh.title, c.en.title]);
          }),
        }))
        .filter((g) => g.slugs.length > 0),
    [groups, query],
  );
  const shown = filtered.reduce((n, g) => n + g.slugs.length, 0);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-16 pt-10 md:px-6">
      <p className="font-mono text-sm text-brand">{meta.kicker}</p>
      <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-[-0.02em] md:text-4xl">{meta.title}</h1>
      <p className="mt-6 text-[15px] leading-relaxed text-txt1">{meta.intro}</p>
      <HubFilter placeholder={lang === "zh" ? "筛选对比…" : "Filter comparisons…"} value={query} onChange={setQuery} shown={shown} total={total} />
      {filtered.length === 0 && <HubFilterEmpty lang={lang} onClear={() => setQuery("")} />}
      {filtered.map((g) => (
        <section key={g.tld} className="mt-8">
          <h2 className="font-mono text-base font-bold">
            .{g.tld}
            <span className="tnum ml-2 text-xs font-normal text-txt2">{g.slugs.length}</span>
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {g.slugs.map((slug) => (
              <a
                key={slug}
                href={`/vs/${slug}?lang=${lang}`}
                className="flex min-h-[44px] items-center rounded-lg border border-line bg-bg1 px-3 font-mono text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand"
              >
                .{TLD_COMPARES[slug].a} vs .{TLD_COMPARES[slug].b}
              </a>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
