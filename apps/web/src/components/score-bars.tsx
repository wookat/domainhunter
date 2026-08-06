import type { Scores } from "@/types";
import { useI18n, type I18nKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const DIMENSIONS: { key: keyof Scores; labelKey: I18nKey }[] = [
  { key: "length", labelKey: "score.length" },
  { key: "readability", labelKey: "score.readability" },
  { key: "relevance", labelKey: "score.relevance" },
  { key: "brandability", labelKey: "score.brandability" },
];

export function ScoreBars({ scores, columns = 2, className }: { scores: Scores; columns?: 2 | 4; className?: string }) {
  const { t, lang } = useI18n();
  return (
    <div
      className={cn(
        "grid gap-x-4 gap-y-2 text-[11px] text-txt2",
        columns === 2 ? "grid-cols-2" : "grid-cols-4 gap-x-2",
        className,
      )}
    >
      {DIMENSIONS.map((d) => {
        const label = t(d.labelKey);
        return (
        <div key={d.key}>
          {columns === 2 || lang === "en" ? label : label.slice(0, 2)}
          <span className="tnum float-right font-mono text-txt1">{scores[d.key]}</span>
          <div className="bar mt-1">
            <i style={{ width: `${scores[d.key]}%` }} />
          </div>
        </div>
        );
      })}
    </div>
  );
}
