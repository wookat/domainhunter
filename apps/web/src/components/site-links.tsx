import { SITE_LINKS, SITE_LINKS_HEADING, langHref } from "@/content/site-links";
import { useI18n } from "@/lib/i18n";

/** 内容详情页末尾「站内导航」：首页 / hub / 价格 / why / mcp / advanced，与 SSR（ssr-html.ts siteLinksHtml）DOM 逐字一致 */
export function SiteLinks() {
  const { lang } = useI18n();
  return (
    <nav aria-label={SITE_LINKS_HEADING[lang]} className="mt-10">
      <h2 className="text-sm font-semibold text-txt1">{SITE_LINKS_HEADING[lang]}</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {SITE_LINKS.map((l) => (
          <a
            key={l.path}
            href={langHref(l.path, lang)}
            className="flex min-h-[44px] items-center rounded-lg border border-line px-3 text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand"
          >
            {l[lang]}
          </a>
        ))}
      </div>
    </nav>
  );
}
