"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useMemo } from "react";
import { CurrencyField } from "@/components/forms/fields";
import { SourceBar } from "@/components/calculators/shared/SourceBar";
import { StatusPill } from "@/components/ui/StatusPill";
import { DEFAULT_BENCHMARKS as B } from "@/lib/calculations/benchmarks";
import { calculateSnapshot } from "@/lib/calculations/snapshotCalculator";
import type { Tone } from "@/lib/calculations/utils";
import { SNAPSHOT_DEFAULTS } from "@/lib/content/defaults";
import { formatINR, formatINRCompact, formatPercent } from "@/lib/formatters/number";
import { useCalculatorForm } from "@/lib/hooks/useCalculatorForm";
import { cn } from "@/lib/utils/cn";
import { toneText } from "@/lib/utils/tone";
import { snapshotSchema } from "@/lib/validators/schemas";
import { AnimatedNumber } from "@/components/ui/Motion";

function Tile({ label, value, sub, tone = "neutral", href, big }: { label: string; value: string; sub?: string; tone?: Tone; href?: string; big?: boolean }) {
  const body = (
    <>
      <p className="eyebrow">{label}</p>
      <p className={cn("tabular mt-1.5 font-bold tracking-tight", big ? "text-3xl" : "text-2xl", tone === "neutral" ? "text-ink" : toneText[tone])}>{value}</p>
      {sub ? <p className="tabular mt-1 text-xs text-muted">{sub}</p> : null}
    </>
  );
  return href ? (
    <Link href={href} className="group rounded-2xl border border-line bg-card p-4 shadow-card transition hover:border-line-strong hover:shadow-lift">
      {body}
      <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-accent-dark opacity-80 group-hover:opacity-100">Details <ArrowRight className="h-3 w-3" aria-hidden /></span>
    </Link>
  ) : (
    <div className="rounded-2xl border border-line bg-card p-4 shadow-card">{body}</div>
  );
}

/** "Restaurant Snapshot": six numbers in, a full overview out. */
export function SnapshotDashboard() {
  const { control, values, source, resetToExample, clearAll } = useCalculatorForm("restaurant-snapshot", snapshotSchema, SNAPSHOT_DEFAULTS);
  const r = useMemo(() => calculateSnapshot(values), [values]);
  const foodTone: Tone = r.foodCostPercent === null ? "neutral" : r.foodCostPercent <= B.foodCostMax ? "good" : "watch";
  const laborTone: Tone = r.laborCostPercent === null ? "neutral" : r.laborCostPercent <= B.laborMax ? "good" : "watch";
  const primeTone: Tone = r.primeCostPercent === null ? "neutral" : r.primeCostPercent <= B.primeMax ? "good" : "watch";
  const profitTone: Tone = r.netMarginPercent === null ? "neutral" : r.netMarginPercent < 0 ? "bad" : r.netMarginPercent < B.netMarginMin ? "watch" : "good";
  const mosTone: Tone = r.marginOfSafetyPercent === null ? "neutral" : r.marginOfSafetyPercent < 10 ? "bad" : r.marginOfSafetyPercent < 25 ? "watch" : "good";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6">
        <SourceBar source={source} onExample={resetToExample} onClear={clearAll} />
        <div className="grid gap-4 sm:grid-cols-2">
          <CurrencyField control={control} name="monthlyRevenue" label="Monthly revenue" tooltip="Total sales for the month from all channels." />
          <CurrencyField control={control} name="foodCost" label="Food cost" tooltip="Food used in the month (COGS)." />
          <CurrencyField control={control} name="laborCost" label="Labor cost" tooltip="Salaries, wages and benefits." />
          <CurrencyField control={control} name="marketing" label="Marketing" />
          <CurrencyField control={control} name="rent" label="Rent" />
          <CurrencyField control={control} name="otherCosts" label="Other costs" tooltip="Utilities, delivery fees, repairs, software, EMIs." />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-inverse p-5 text-on-inverse sm:p-6">
          <div>
            <p className="eyebrow text-on-inverse/60">Estimated monthly profit</p>
            <p className="tabular mt-1 text-4xl font-bold tracking-tight"><AnimatedNumber value={r.estimatedProfit} format={(v) => formatINR(v)} /></p>
            <p className="tabular mt-1 text-sm text-on-inverse/70">Net margin {formatPercent(r.netMarginPercent)} on {formatINRCompact(r.revenue)} revenue</p>
          </div>
          <StatusPill tone={profitTone} className="bg-on-inverse/10 text-on-inverse">{profitTone === "good" ? "Healthy margin" : profitTone === "watch" ? "Thin margin" : profitTone === "bad" ? "Loss-making" : "Add numbers"}</StatusPill>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <Tile label="Revenue" value={formatINRCompact(r.revenue)} sub={formatINR(r.revenue)} />
          <Tile label="Food cost" value={formatPercent(r.foodCostPercent)} sub={formatINR(r.foodCost)} tone={foodTone} href="/restaurant/food-cost-calculator" />
          <Tile label="Labor" value={formatPercent(r.laborCostPercent)} sub={formatINR(r.laborCost)} tone={laborTone} href="/restaurant/restaurant-health-calculator" />
          <Tile label="Prime cost" value={formatPercent(r.primeCostPercent)} sub={formatINR(r.primeCost)} tone={primeTone} href="/restaurant/prime-cost-calculator" />
          <Tile label="Operating expenses" value={formatINRCompact(r.operatingExpenses)} sub="Marketing + rent + other" href="/restaurant/profit-margin-calculator" />
          <Tile label="Net margin" value={formatPercent(r.netMarginPercent)} tone={profitTone} sub={`Reference ${B.netMarginMin}–${B.netMarginMax}%`} />
          <Tile label="Break-even" value={formatINRCompact(r.breakEvenRevenue)} sub="Monthly sales needed" href="/restaurant/break-even-calculator" />
          <Tile label="Margin of safety" value={formatPercent(r.marginOfSafetyPercent)} sub={formatINR(r.marginOfSafety)} tone={mosTone} href="/restaurant/break-even-calculator" />
          <Tile label="Food + labor" value={formatINRCompact(r.primeCost)} sub="Your biggest controllable costs" />
        </div>
        <p className="text-xs text-muted">Snapshot treats food cost as variable and everything else as fixed. Estimates only; reference ranges are indicative.</p>
      </div>
    </div>
  );
}
