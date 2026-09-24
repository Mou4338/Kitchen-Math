"use client";

import { Percent } from "lucide-react";
import { useMemo, useState } from "react";
import { CurrencyField, ScenarioSlider } from "@/components/forms/fields";
import { SemiGauge } from "@/components/charts/SemiGauge";
import { BlockTitle, CalculatorLayout, FieldGrid, InputGroup } from "@/components/calculators/shared/CalculatorLayout";
import { InsightList, type Insight } from "@/components/calculators/shared/InsightList";
import { MetricCard, StatementRow } from "@/components/calculators/shared/MetricCard";
import { ResultActions } from "@/components/calculators/shared/ResultActions";
import { ScenarioPanel } from "@/components/calculators/shared/ScenarioPanel";
import { SourceBar } from "@/components/calculators/shared/SourceBar";
import { StatusPill } from "@/components/ui/StatusPill";
import { DEFAULT_BENCHMARKS } from "@/lib/calculations/benchmarks";
import { calculatePrimeCost } from "@/lib/calculations/primeCostCalculator";
import { PRIME_COST_DEFAULTS } from "@/lib/content/defaults";
import { formatINR, formatPercent } from "@/lib/formatters/number";
import { useCalculatorForm } from "@/lib/hooks/useCalculatorForm";
import { primeCostSchema } from "@/lib/validators/schemas";
import type { ReportData } from "@/types/report";

const SLUG = "prime-cost-calculator";
const PATH = `/restaurant/${SLUG}`;
const B = DEFAULT_BENCHMARKS;
const pc = (v: number) => `${v > 0 ? "+" : ""}${v}%`;

export default function PrimeCostCalculator() {
  const { control, values, source, loadValues, resetToExample, clearAll } = useCalculatorForm(SLUG, primeCostSchema, PRIME_COST_DEFAULTS);
  const [sc, setSc] = useState({ food: 0, labor: 0, revenue: 0 });
  const r = useMemo(() => calculatePrimeCost(values), [values]);
  const s = useMemo(
    () => calculatePrimeCost({ foodCost: values.foodCost * (1 + sc.food / 100), laborCost: values.laborCost * (1 + sc.labor / 100), revenue: values.revenue * (1 + sc.revenue / 100) }),
    [values, sc],
  );
  const active = sc.food !== 0 || sc.labor !== 0 || sc.revenue !== 0;

  const insights: Insight[] = [];
  if (r.primeCostPercent !== null) {
    if (r.primeCostPercent > B.primeMax) {
      const bigger = values.foodCost >= values.laborCost ? "food" : "labor";
      insights.push({ tone: r.tone, title: `Start with ${bigger} cost`, body: bigger === "food" ? "Food is the larger share of prime cost. Check portions, waste and supplier prices first." : "Labor is the larger share of prime cost. Match rosters to hourly sales first.", impact: `${formatINR(((r.primeCostPercent - B.primeMax) / 100) * values.revenue)}/month above ${B.primeMax}%` });
    } else insights.push({ tone: "good", title: "Prime cost is in a workable range", body: `${formatINR(r.remainingMargin)} is left each month for rent, utilities, marketing and profit.` });
  }

  const report: ReportData = {
    calculator: SLUG,
    title: "Prime Cost Report",
    headline: `Prime cost ${formatPercent(r.primeCostPercent)} (${formatINR(r.primeCost)}) · Remaining ${formatINR(r.remainingMargin)}`,
    inputs: [
      { label: "Food cost", value: formatINR(values.foodCost) },
      { label: "Labor cost", value: formatINR(values.laborCost) },
      { label: "Revenue", value: formatINR(values.revenue) },
    ],
    results: [
      { label: "Prime cost", value: formatINR(r.primeCost) },
      { label: "Prime cost %", value: formatPercent(r.primeCostPercent) },
      { label: "Food %", value: formatPercent(r.foodPercent) },
      { label: "Labor %", value: formatPercent(r.laborPercent) },
      { label: "Remaining operating margin", value: `${formatINR(r.remainingMargin)} (${formatPercent(r.remainingMarginPercent)})` },
      { label: "Status", value: r.status },
    ],
    chart: {
      title: "Share of revenue",
      bars: [
        { label: "Food", value: r.foodPercent ?? 0, display: formatPercent(r.foodPercent), tone: "accent" },
        { label: "Labor", value: r.laborPercent ?? 0, display: formatPercent(r.laborPercent), tone: "neutral" },
        { label: "Remaining", value: Math.max(0, r.remainingMarginPercent ?? 0), display: formatPercent(r.remainingMarginPercent), tone: "good" },
      ],
    },
    assumptions: ["Food cost should be COGS (stock movement), not purchases.", "Labor includes all salaries and benefits."],
    benchmarks: [`Prime cost ${B.primeMin}–${B.primeMax}% of revenue (indicative)`],
  };

  const inputs = (
    <>
      <SourceBar source={source} onExample={resetToExample} onClear={clearAll} />
      <InputGroup title="Monthly figures" icon={<Percent className="h-5 w-5" />}>
        <FieldGrid cols={1}>
          <CurrencyField control={control} name="foodCost" label="Food cost (COGS)" tooltip="Opening stock + purchases − closing stock for the month." />
          <CurrencyField control={control} name="laborCost" label="Labor cost" tooltip="All salaries, wages, overtime and benefits for the month." />
          <CurrencyField control={control} name="revenue" label="Revenue" tooltip="Total sales for the month." />
        </FieldGrid>
      </InputGroup>
      {r.errors.length ? <div role="alert" className="rounded-xl border border-caution/30 bg-caution-soft px-4 py-3 text-sm">{r.errors.join(" ")}</div> : null}
    </>
  );

  const results = (
    <>
      <section className="print-break flex flex-col items-center rounded-2xl border border-line bg-card p-5 text-center shadow-card sm:p-6" aria-label="Prime cost gauge">
        <p className="eyebrow">Prime cost</p>
        <SemiGauge value={r.primeCostPercent} max={100} bandFrom={B.primeMin} bandTo={B.primeMax} tone={r.tone} label="Prime cost" display={formatPercent(r.primeCostPercent)} />
        <p className="tabular -mt-6 text-4xl font-bold">{formatPercent(r.primeCostPercent)}</p>
        <p className="tabular mt-1 text-sm text-muted">{formatINR(r.primeCost)} of {formatINR(values.revenue)}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs text-muted">
          <span>Reference: <b className="text-ink-soft">{B.primeMin}–{B.primeMax}%</b></span>
          <StatusPill tone={r.tone}>{r.status}</StatusPill>
        </div>
      </section>
      <div className="grid grid-cols-2 gap-4">
        <MetricCard label="Food" value={formatPercent(r.foodPercent)} sub={formatINR(values.foodCost)} />
        <MetricCard label="Labor" value={formatPercent(r.laborPercent)} sub={formatINR(values.laborCost)} />
      </div>
      <section className="rounded-2xl border border-line bg-card p-5 shadow-card">
        <div className="divide-y divide-line">
          <StatementRow label="Revenue" value={formatINR(values.revenue)} />
          <StatementRow label="Prime cost" value={`−${formatINR(r.primeCost)}`} />
          <StatementRow label="Remaining operating margin" value={`${formatINR(r.remainingMargin)} · ${formatPercent(r.remainingMarginPercent)}`} tone={r.remainingMargin >= 0 ? "good" : "bad"} strong hint="For rent, utilities, marketing and profit" />
        </div>
      </section>
      <ResultActions slug={SLUG} calculatorTitle="Prime Cost" path={PATH} values={values} report={report} onReset={resetToExample} onLoad={(v) => loadValues(v)} />
    </>
  );

  return (
    <>
      <CalculatorLayout inputs={inputs} results={results} summary={{ label: "Prime cost", value: formatPercent(r.primeCostPercent), tone: r.tone }} />
      <section>
        <BlockTitle eyebrow="Scenario mode" title="Balance food and labor" />
        <ScenarioPanel
          active={active}
          onReset={() => setSc({ food: 0, labor: 0, revenue: 0 })}
          presets={[
            { label: "Food −5%", onApply: () => setSc({ food: -5, labor: 0, revenue: 0 }) },
            { label: "Labor −5%", onApply: () => setSc({ food: 0, labor: -5, revenue: 0 }) },
            { label: "Revenue +10%", onApply: () => setSc({ food: 10, labor: 0, revenue: 10 }) },
          ]}
          controls={
            <>
              <ScenarioSlider label="Food cost change" value={sc.food} min={-30} max={30} step={1} onChange={(v) => setSc({ ...sc, food: v })} format={pc} />
              <ScenarioSlider label="Labor cost change" value={sc.labor} min={-30} max={30} step={1} onChange={(v) => setSc({ ...sc, labor: v })} format={pc} />
              <ScenarioSlider label="Revenue change" value={sc.revenue} min={-30} max={30} step={1} onChange={(v) => setSc({ ...sc, revenue: v })} format={pc} />
            </>
          }
          metrics={[
            { label: "Revenue", current: values.revenue, scenario: values.revenue * (1 + sc.revenue / 100), format: "inr", better: "up" },
            { label: "Prime cost", current: r.primeCost, scenario: s.primeCost, format: "inr", better: "down" },
            { label: "Prime cost %", current: r.primeCostPercent, scenario: s.primeCostPercent, format: "percent", better: "down" },
            { label: "Remaining margin", current: r.remainingMargin, scenario: s.remainingMargin, format: "inr", better: "up" },
          ]}
        />
      </section>
      <InsightList insights={insights} />
    </>
  );
}
