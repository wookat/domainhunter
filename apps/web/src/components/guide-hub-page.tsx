import { INDUSTRY_GUIDES } from "@/content/guides";
import { HUB_META, guideHubGroups, guideOneLiner } from "@/content/hubs";
import { useI18n } from "@/lib/i18n";
import { usePageTitle } from "@/lib/use-page-title";

/** /guide 索引 hub：全部行业命名指南，按大类分组。DOM 与 worker 的 guideHubBlocks 骨架逐字一致。 */
export function GuideHubPage() {
  const { lang } = useI18n();
  const meta = HUB_META.guide[lang];
  usePageTitle(meta.title);
  const groups = guideHubGroups();

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-16 pt-10 md:px-6">
      <p className="font-mono text-sm text-brand">{meta.kicker}</p>
      <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-[-0.02em] md:text-4xl">{meta.title}</h1>
      <p className="mt-6 text-[15px] leading-relaxed text-txt1">{meta.intro}</p>
      {groups.map((g) => (
        <section key={g.id} className="mt-8">
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
                <span className="text-sm font-semibold text-brand">{INDUSTRY_GUIDES[slug][lang].label}</span>
                <span className="mt-0.5 text-xs leading-relaxed text-txt1">{guideOneLiner(slug, lang)}</span>
              </a>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
