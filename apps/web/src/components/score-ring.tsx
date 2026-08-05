import { scoreColor } from "@/types";
import { cn } from "@/lib/utils";

const CIRCUMFERENCE = 2 * Math.PI * 17;

export function ScoreRing({ score, muted = false }: { score: number; muted?: boolean }) {
  const color = muted ? { text: "text-zinc-500", stroke: "#a1a1aa" } : scoreColor(score);
  return (
    <div className="relative h-12 w-12 shrink-0">
      <svg viewBox="0 0 40 40" className="h-12 w-12 -rotate-90">
        <circle cx="20" cy="20" r="17" fill="none" stroke="#f4f4f5" strokeWidth="4" />
        <circle
          cx="20"
          cy="20"
          r="17"
          fill="none"
          stroke={color.stroke}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - score / 100)}
        />
      </svg>
      <span className={cn("absolute inset-0 flex items-center justify-center text-sm font-bold", color.text)}>
        {score}
      </span>
    </div>
  );
}
