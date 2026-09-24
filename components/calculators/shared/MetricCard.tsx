import type { ReactNode } from "react";
import type { Tone } from "@/lib/calculations/utils";
import { StatusPill } from "@/components/ui/StatusPill";
import { cn } from "@/lib/utils/cn";
import { toneText } from "@/lib/utils/tone";

/**
 * A result explained, not just shown:
 * label → value → reference range → status → estimated impact.
 */
export function MetricCard({
  label, value, tone = "neutral", reference, status, impact, sub, children, className, emphasis,
}: {
  label: string;
  value: string;
  tone?: Tone;
  reference?: string;
  status?: string;
  impact?: ReactNode;
  sub?: ReactNode;
  children?: ReactNode;
  className?: string;
  emphasis?: boolean;
}) {
  return (
    <div className={cn("print-break flex min-w-0 flex-col gap-2 rounded-2xl border border-line bg-card p-4 shadow-card", className)}>
      <p className="eyebrow">{label}</p>
      <p className={cn("tabular font-bold leading-none tracking-tight", emphasis ? "text-3xl sm:text-4xl" : "text-2xl", tone === "neutral" ? "text-ink" : toneText[tone])}>{value}</p>
      {sub ? <div className="text-sm text-muted">{sub}</div> : null}
      {reference || status ? (
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
          {reference ? <span>Reference: <span className="font-semibold text-ink-soft">{reference}</span></span> : null}
          {status ? <StatusPill tone={tone}>{status}</StatusPill> : null}
        </div>
      ) : null}
      {impact ? <div className="mt-1 rounded-lg bg-wash px-3 py-2 text-xs leading-relaxed text-ink-soft">{impact}</div> : null}
      {children}
    </div>
  );
}

/** Compact label/value rows for a results "statement". */
export function StatementRow({ label, value, tone, strong, hint }: { label: ReactNode; value: string; tone?: Tone; strong?: boolean; hint?: string }) {
  return (
    <div className={cn("flex items-baseline justify-between gap-4 py-2", strong && "border-t border-dashed border-line-strong pt-3")}>
      <span className={cn("text-sm", strong ? "font-semibold text-ink" : "text-muted")}>
        {label}
        {hint ? <span className="block text-xs text-muted-light">{hint}</span> : null}
      </span>
      <span className={cn("tabular text-right text-sm font-semibold", strong && "text-base", tone ? toneText[tone] : "text-ink")}>{value}</span>
    </div>
  );
}
