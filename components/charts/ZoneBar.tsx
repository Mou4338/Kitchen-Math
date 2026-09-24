import { formatINRCompact } from "@/lib/formatters/number";

/**
 * LOSS ZONE | BREAK-EVEN | PROFIT ZONE, with a marker for current sales.
 */
export function ZoneBar({ breakEven, current }: { breakEven: number | null; current: number }) {
  if (breakEven === null || !(breakEven > 0)) {
    return <p className="rounded-xl bg-wash p-4 text-sm text-muted">Add revenue, raw material cost and fixed costs to see your zones.</p>;
  }
  const max = Math.max(breakEven, current) * 1.3;
  const bePos = (breakEven / max) * 100;
  const curPos = Math.min(100, (current / max) * 100);
  const inProfit = current >= breakEven;
  return (
    <div className="pt-8" role="img" aria-label={`Break-even at ${formatINRCompact(breakEven)}; current sales ${formatINRCompact(current)} are in the ${inProfit ? "profit" : "loss"} zone`}>
      <div className="relative">
        <div className="flex h-12 overflow-hidden rounded-xl text-[11px] font-bold uppercase tracking-wider">
          <div className="flex items-center justify-center bg-danger-soft text-danger" style={{ width: `${bePos}%` }}>
            <span className="truncate px-2">Loss zone</span>
          </div>
          <div className="flex flex-1 items-center justify-center bg-sage-soft text-sage-dark">
            <span className="truncate px-2">Profit zone</span>
          </div>
        </div>
        <div className="absolute -top-1 bottom-[-4px] w-[3px] -translate-x-1/2 rounded bg-ink" style={{ left: `${bePos}%` }} />
        <div className="tabular absolute -top-7 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-0.5 text-[11px] font-semibold text-paper" style={{ left: `${Math.min(88, Math.max(12, bePos))}%` }}>
          Break-even {formatINRCompact(breakEven)}
        </div>
        <div className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-card bg-accent shadow-md transition-[left] duration-300" style={{ left: `${curPos}%` }} />
      </div>
      <div className="tabular mt-2 flex justify-between text-xs text-muted">
        <span>₹0</span>
        <span className="font-semibold text-ink">You: {formatINRCompact(current)}</span>
        <span>{formatINRCompact(max)}</span>
      </div>
    </div>
  );
}
