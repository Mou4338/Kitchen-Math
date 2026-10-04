import type { WaterfallStep } from "@/lib/calculations/onlinePayoutCalculator";
import { formatINR, formatPercent } from "@/lib/formatters/number";
import { cn } from "@/lib/utils/cn";

/**
 * Vertical waterfall: each deduction or addition is a floating bar between the running total before and after it,
 * with the exact ₹ amount beside it. Works on any screen width without a chart library.
 */
export function Waterfall({ steps, decimals = 0, base }: { steps: WaterfallStep[]; decimals?: number; base: number }) {
  const scaleMax = Math.max(base, ...steps.map((s) => Math.abs(s.running)), 1);
  const pct = (v: number) => (Math.abs(v) / scaleMax) * 100;
  return (
    <ol className="flex flex-col" aria-label="Waterfall breakdown">
      {steps.map((s, i) => {
        const moves = s.kind === "deduction" || s.kind === "addition";
        const before = moves && i > 0 ? steps[i - 1].running : 0;
        const after = s.running;
        const isTotal = !moves;
        const negative = isTotal && s.amount < 0;
        const left = isTotal ? 0 : pct(Math.max(0, Math.min(before, after)));
        const width = isTotal ? pct(s.amount) : pct(Math.abs(before - after));
        return (
          <li key={s.key} className={cn("grid grid-cols-[minmax(0,9.5rem)_minmax(0,1fr)_auto] items-center gap-3 py-1.5 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)_auto]", isTotal && i > 0 && "mt-1 border-t border-dashed border-line-strong pt-2.5")}>
            <span className={cn("truncate text-sm", isTotal ? "font-semibold text-ink" : "text-muted")}>{s.label}</span>
            <span className="relative h-6 rounded-md bg-wash/60">
              <span
                className={cn(
                  "absolute inset-y-0 rounded-md transition-all duration-300",
                  s.kind === "start" && "bg-ink",
                  s.kind === "subtotal" && "bg-chart-1",
                  s.kind === "deduction" && "bg-accent/80",
                  s.kind === "addition" && "bg-sage/70",
                  s.kind === "result" && (negative ? "bg-danger" : "bg-sage"),
                )}
                style={{ left: `${left}%`, width: `${Math.max(width, s.amount === 0 ? 0 : 0.8)}%` }}
              />
            </span>
            <span className={cn("tabular min-w-[6.5rem] text-right text-sm font-semibold", s.kind === "deduction" ? "text-danger" : s.kind === "addition" ? "text-sage-dark" : negative ? "text-danger" : s.kind === "result" ? "text-sage-dark" : "text-ink")}>
              {s.kind === "deduction" ? `−${formatINR(Math.abs(s.amount), decimals)}` : s.kind === "addition" ? `+${formatINR(Math.abs(s.amount), decimals)}` : formatINR(s.amount, decimals)}
              <span className="block text-[11px] font-normal text-muted-light">{formatPercent(base > 0 ? (s.amount / base) * 100 : null)}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
