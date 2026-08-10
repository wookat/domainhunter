import { useMemo, useState } from "react";
import { GUIDE_HUB_META, guideHubGroups, guideHubLabel, guideKeywords, guideOneLiner } from "@/content/hubs-guide";
import { useI18n } from "@/lib/i18n";
import { usePageTitle } from "@/lib/use-page-title";
import { HubFilter, HubFilterEmpty, hubMatch } from "./hub-filter";
import { BackToTop, HubAnchorNav, hubAnchorId } from "./hub-nav";

/** /guide 索引 hub：全部行业命名指南，按大类分组。DOM 与 worker 的 guideHubBlocks 骨架逐字一致。 */
export function GuideHubPage() {
  const { lang } = useI18n();
  const meta = GUIDE_HUB_META[lang];
  usePageTitle(meta.title);
  const [query, setQuery] = useState("");
  const groups = useMemo(() => guideHubGroups(), []);
  const total = useMemo(() => groups.reduce((n, g) => n + g.slugs.length, 0), [groups]);
  const filtered = useMemo(
    () =>
      groups
        .map((g) => ({
          ...g,
          slugs: g.slugs.filter((slug) =>
            hubMatch(query, [slug, guideHubLabel(slug, "zh"), guideHubLabel(slug, "en"), guideOneLiner(slug, "zh"), guideOneLiner(slug, "en"), ...guideKeywords(slug)]),
          ),
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
      <HubFilter placeholder={lang === "zh" ? "筛选行业…" : "Filter industries…"} value={query} onChange={setQuery} shown={shown} total={total} />
      <HubAnchorNav lang={lang} items={filtered.map((g) => ({ id: g.id, label: g[lang], count: g.slugs.length }))} />
      {filtered.length === 0 && <HubFilterEmpty lang={lang} onClear={() => setQuery("")} />}
      {filtered.map((g) => (
        <section key={g.id} id={hubAnchorId(g.id)} className="mt-8 scroll-mt-28">
          <h2 className="text-base font-bold">
            {g[lang]}
            <span className="tnum ml-2 font-mono text-xs font-normal text-txt2">{g.slugs.length}</span>
          </h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {g.slugs.map((slug) => (
              <a
                key={slug}
                href={`/guide/${slug}?lang=${lang}`}
                className="flex min-h-[44px] flex-col justify-center rounded-lg border border-line bg-bg1 px-3.5 py-2.5 transition-colors hover:border-brand-line"
              >
                <span className="text-sm font-semibold text-brand">{guideHubLabel(slug, lang)}</span>
                <span className="mt-0.5 text-xs leading-relaxed text-txt1">{guideOneLiner(slug, lang)}</span>
              </a>
            ))}
          </div>
        </section>
      ))}
      <BackToTop lang={lang} />
    </main>
  );
}
