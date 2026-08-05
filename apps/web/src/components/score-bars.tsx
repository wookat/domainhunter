import type { Scores } from "@/types";
import { cn } from "@/lib/utils";

const DIMENSIONS: { key: keyof Scores; label: string }[] = [
  { key: "length", label: "长度" },
  { key: "readability", label: "读感" },
  { key: "relevance", label: "寓意" },
  { key: "brandability", label: "品牌感" },
];

export function ScoreBars({ scores, columns = 2, className }: { scores: Scores; columns?: 2 | 4; className?: string }) {
  return (
    <div
      className={cn(
        "grid gap-x-4 gap-y-2 text-[11px] text-txt2",
        columns === 2 ? "grid-cols-2" : "grid-cols-4 gap-x-2",
        className,
      )}
    >
      {DIMENSIONS.map((d) => (
        <div key={d.key}>
          {columns === 2 ? d.label : d.label.slice(0, 2)}
          <span className="tnum float-right font-mono text-txt1">{scores[d.key]}</span>
          <div className="bar mt-1">
            <i style={{ width: `${scores[d.key]}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
