import { useEffect, useState } from "react";

type Lang = "zh" | "en";

const STRINGS = {
  zh: { nav: "分组导航", top: "回到顶部" },
  en: { nav: "Group navigation", top: "Back to top" },
} as const;

/** 分组锚点 id（与 SSR 骨架 ssr-html.ts 的 hubSection 逐字一致） */
export const hubAnchorId = (id: string) => `hub-g-${id}`;

export type HubNavItem = { id: string; label: string; count: number };

/**
 * hub 索引页分组锚点导航：sticky chips 横向滚动条。
 * 调用方传入过滤后的分组列表，空组随过滤自动隐藏；锚点为原生 <a>，可 Tab 聚焦。
 */
export function HubAnchorNav({ lang, items }: { lang: Lang; items: HubNavItem[] }) {
  if (items.length === 0) return null;
  return (
    <nav aria-label={STRINGS[lang].nav} className="sticky top-14 z-10 -mx-4 mt-4 overflow-x-auto border-b border-line bg-bg0/95 px-4 py-2 backdrop-blur md:-mx-6 md:px-6">
      <div className="flex w-max gap-2">
        {items.map((it) => (
          <a
            key={it.id}
            href={`#${hubAnchorId(it.id)}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(hubAnchorId(it.id))?.scrollIntoView({ behavior: "smooth" });
              history.replaceState(null, "", `#${hubAnchorId(it.id)}`);
            }}
            className="flex min-h-[36px] shrink-0 items-center whitespace-nowrap rounded-full border border-line bg-bg1 px-3 text-xs text-txt1 transition-colors hover:border-brand-line hover:text-brand focus-visible:border-brand-line"
          >
            {it.label}
            <span className="tnum ml-1.5 font-mono text-[10px] text-txt2">{it.count}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

/** 回到顶部按钮：滚动超过一屏后出现，44px 触点，固定右下角 */
export function BackToTop({ lang }: { lang: Lang }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!visible) return null;
  return (
    <button
      type="button"
      aria-label={STRINGS[lang].top}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-5 right-4 z-20 grid h-11 w-11 place-items-center rounded-full border border-line bg-bg1/95 text-txt1 shadow-lg backdrop-blur transition-colors hover:border-brand-line hover:text-brand md:right-6"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 13V3M8 3L3.5 7.5M8 3l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
