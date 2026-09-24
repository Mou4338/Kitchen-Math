import type { Tone } from "@/lib/calculations/utils";
import { formatPercent } from "@/lib/formatters/number";
import { cn } from "@/lib/utils/cn";

export interface Zone {
  from: number;
  to: number;
  tone: Tone;
}

const ZONE: Record<Tone, string> = { good: "bg-sage/45", watch: "bg-caution/35", bad: "bg-danger/35", neutral: "bg-line" };

/** Horizontal bar with reference zones and a marker for the user's value. */
export function BenchmarkBar({ label, value, max, zones, reference }: { label: string; value: number | null; max: number; zones: Zone[]; reference: string }) {
  const pos = value === null ? null : Math.max(0, Math.min(100, (value / max) * 100));
  const ticks = Array.from(new Set([0, ...zones.map((z) => z.to)])).filter((t) => t <= max);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="font-medium">{label}</span>
        <span className="tabular font-semibold">{formatPercent(value)}</span>
      </div>
      <div className="relative pt-1" role="img" aria-label={`${label} ${formatPercent(value)} against reference ${reference}`}>
        <div className="flex h-2.5 overflow-hidden rounded-full bg-wash">
          {zones.map((z) => (
            <div key={`${z.from}-${z.to}`} className={cn("h-full", ZONE[z.tone])} style={{ width: `${((Math.min(z.to, max) - z.from) / max) * 100}%` }} />
          ))}
        </div>
        {pos !== null ? (
          <div className="absolute top-0 h-[18px] w-1 -translate-x-1/2 rounded-full bg-ink ring-2 ring-card transition-[left] duration-300" style={{ left: `${pos}%` }} />
        ) : null}
      </div>
      <div className="tabular relative h-4 text-[10px] text-muted-light" aria-hidden>
        {ticks.map((t) => (
          <span key={t} className="absolute -translate-x-1/2 first:translate-x-0 last:-translate-x-full" style={{ left: `${(t / max) * 100}%` }}>
            {t}%{t === max ? "+" : ""}
          </span>
        ))}
      </div>
    </div>
  );
}
