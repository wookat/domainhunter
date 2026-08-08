import { useEffect, useRef } from "react";

type Lang = "zh" | "en";

const STRINGS = {
  zh: { empty: "没有匹配的条目，换个关键词试试。", clear: "清除" },
  en: { empty: "No matching entries. Try another keyword.", clear: "Clear" },
} as const;

/** 归一化后做包含匹配：任一字段命中即保留 */
export const hubMatch = (query: string, fields: string[]): boolean => {
  const q = query.trim().toLowerCase();
  if (q === "") return true;
  return fields.some((f) => f.toLowerCase().includes(q));
};

/**
 * hub 索引页即时过滤输入框（纯前端本地过滤，无网络请求）。
 * 外层固定 h-11 与 SSR 骨架的占位 div 同高，避免水合后布局跳动。
 */
export function HubFilter({
  placeholder,
  value,
  onChange,
  shown,
  total,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  shown: number;
  total: number;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);
  return (
    <div className="relative mt-6 h-11">
      <input
        ref={ref}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") onChange("");
        }}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-11 w-full rounded-lg border border-line bg-bg2 pl-3.5 pr-24 text-sm text-txt1 outline-none transition-colors placeholder:text-txt2 focus:border-brand-line [&::-webkit-search-cancel-button]:hidden"
      />
      <span className="tnum pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-xs text-txt2">
        {shown} / {total}
      </span>
    </div>
  );
}

/** 过滤无结果时的双语空态提示 + 清除按钮 */
export function HubFilterEmpty({ lang, onClear }: { lang: Lang; onClear: () => void }) {
  const s = STRINGS[lang];
  return (
    <div className="mt-8 rounded-lg border border-line bg-bg1 px-4 py-8 text-center">
      <p className="text-sm text-txt1">{s.empty}</p>
      <button
        type="button"
        onClick={onClear}
        className="mt-4 inline-flex min-h-[44px] items-center rounded-lg border border-line px-4 text-sm text-txt1 transition-colors hover:border-brand-line hover:text-brand"
      >
        {s.clear}
      </button>
    </div>
  );
}
