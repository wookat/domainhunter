import { useMemo, useState } from "react";
import { HUB_META, tldHubGroups, tldOneLiner } from "@/content/hubs";
import { useI18n } from "@/lib/i18n";
import { usePageTitle } from "@/lib/use-page-title";
import { HubFilter, HubFilterEmpty, hubMatch } from "./hub-filter";

/** /tld 索引 hub：全部 TLD 注册指南，按用途分组。DOM 与 worker 的 tldHubBlocks 骨架逐字一致。 */
export function TldHubPage() {
  const { lang } = useI18n();
  const meta = HUB_META.tld[lang];
  usePageTitle(meta.title);
  const [query, setQuery] = useState("");
  const groups = useMemo(() => tldHubGroups(), []);
  const total = useMemo(() => groups.reduce((n, g) => n + g.tlds.length, 0), [groups]);
  const filtered = useMemo(
    () =>
      groups
        .map((g) => ({ ...g, tlds: g.tlds.filter((tld) => hubMatch(query, [tld, `.${tld}`, tldOneLiner(tld, "zh"), tldOneLiner(tld, "en")])) }))
        .filter((g) => g.tlds.length > 0),
    [groups, query],
  );
  const shown = filtered.reduce((n, g) => n + g.tlds.length, 0);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-16 pt-10 md:px-6">
      <p className="font-mono text-sm text-brand">{meta.kicker}</p>
      <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-[-0.02em] md:text-4xl">{meta.title}</h1>
      <p className="mt-6 text-[15px] leading-relaxed text-txt1">
        {meta.intro}
        <a href={`/prices?lang=${lang}`} className="text-brand hover:underline">
          {meta.pricesLink}
        </a>
        {lang === "zh" ? "。" : "."}
      </p>
      <HubFilter placeholder={lang === "zh" ? "筛选后缀…" : "Filter TLDs…"} value={query} onChange={setQuery} shown={shown} total={total} />
      {filtered.length === 0 && <HubFilterEmpty lang={lang} onClear={() => setQuery("")} />}
      {filtered.map((g) => (
        <section key={g.id} className="mt-8">
          <h2 className="text-base font-bold">
            {g[lang]}
            <span className="tnum ml-2 font-mono text-xs font-normal text-txt2">{g.tlds.length}</span>
          </h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {g.tlds.map((tld) => (
              <a
                key={tld}
                href={`/tld/${tld}?lang=${lang}`}
                className="flex min-h-[44px] flex-col justify-center rounded-lg border border-line bg-bg1 px-3.5 py-2.5 transition-colors hover:border-brand-line"
              >
                <span className="font-mono text-sm font-semibold text-brand">.{tld}</span>
                <span className="mt-0.5 text-xs leading-relaxed text-txt1">{tldOneLiner(tld, lang)}</span>
              </a>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
