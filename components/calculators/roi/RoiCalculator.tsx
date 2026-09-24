"use client";

import dynamic from "next/dynamic";
import { Landmark, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { CurrencyField, NumberField, ScenarioSlider } from "@/components/forms/fields";
import { ChartSkeleton } from "@/components/charts/ChartSkeleton";
import { BlockTitle, CalculatorLayout, FieldGrid, InputGroup } from "@/components/calculators/shared/CalculatorLayout";
import { InsightList, type Insight } from "@/components/calculators/shared/InsightList";
import { MetricCard, StatementRow } from "@/components/calculators/shared/MetricCard";
import { ResultActions } from "@/components/calculators/shared/ResultActions";
import { ScenarioPanel } from "@/components/calculators/shared/ScenarioPanel";
import { SourceBar } from "@/components/calculators/shared/SourceBar";
import { calculateRoi, roiScenarios } from "@/lib/calculations/roiCalculator";
import type { Tone } from "@/lib/calculations/utils";
import { ROI_DEFAULTS } from "@/lib/content/defaults";
import { formatINR, formatINRCompact, formatMonths, formatPercent } from "@/lib/formatters/number";
import { useCalculatorForm } from "@/lib/hooks/useCalculatorForm";
import { cn } from "@/lib/utils/cn";
import { roiSchema } from "@/lib/validators/schemas";
import type { ReportData } from "@/types/report";

const RoiChart = dynamic(() => import("@/components/charts/RoiChart"), { ssr: false, loading: () => <ChartSkeleton height={280} /> });

const SLUG = "restaurant-roi-calculator";
const PATH = `/restaurant/${SLUG}`;
const paybackTone = (m: number | null): Tone => (m === null ? "bad" : m <= 24 ? "good" : m <= 42 ? "watch" : "bad");

export default function RoiCalculator() {
  const { control, values, source, loadValues, resetToExample, clearAll } = useCalculatorForm(SLUG, roiSchema, ROI_DEFAULTS, ["horizonMonths"]);
  const [sc, setSc] = useState({ profit: 0, growth: 0, investment: 0 });
  const r = useMemo(() => calculateRoi(values), [values]);
  const scenarios = useMemo(() => roiScenarios(values), [values]);
  const s = useMemo(
    () => calculateRoi({ ...values, monthlyProfit: values.monthlyProfit * (1 + sc.profit / 100), monthlyGrowthPercent: values.monthlyGrowthPercent + sc.growth, initialInvestment: values.initialInvestment * (1 + sc.investment / 100) }),
    [values, sc],
  );
  const active = sc.profit !== 0 || sc.growth !== 0 || sc.investment !== 0;
  const tone = paybackTone(r.paybackMonths);

  const insights: Insight[] = [];
  if (r.message) insights.push({ tone: "bad", title: "Payback isn't reached", body: r.message });
  else if (r.paybackMonths !== null) {
    insights.push({ tone, title: `Payback in about ${formatMonths(r.paybackMonths)}`, body: r.paybackMonths <= 24 ? "That's a fast payback for a restaurant. Stress-test it with the conservative scenario." : "Plan cash flow for the payback period and look for ways to lift early-month profit." });
    const fast = calculateRoi({ ...values, monthlyProfit: values.monthlyProfit * 1.1 });
    if (fast.paybackMonths !== null) insights.push({ tone: "neutral", title: "10% more monthly profit", body: `would bring payback to ${formatMonths(fast.paybackMonths)}.` });
  }

  const report: ReportData = {
    calculator: SLUG,
    title: "Restaurant ROI Report",
    headline: `Payback ${formatMonths(r.paybackMonths)} · Annual ROI ${formatPercent(r.annualRoiPercent)} · Annualised return ${formatPercent(r.annualizedReturnPercent)}`,
    inputs: [
      { label: "Initial investment", value: formatINR(values.initialInvestment) },
      { label: "Monthly revenue", value: formatINR(values.monthlyRevenue) },
      { label: "Monthly profit", value: formatINR(values.monthlyProfit) },
      { label: "Monthly growth", value: formatPercent(values.monthlyGrowthPercent) },
      { label: "Projection period", value: `${values.horizonMonths} months` },
    ],
    results: [
      { label: "Monthly ROI", value: formatPercent(r.monthlyRoiPercent) },
      { label: "Annual ROI (year one)", value: formatPercent(r.annualRoiPercent) },
      { label: "Payback period", value: formatMonths(r.paybackMonths) },
      { label: "Annualised return", value: formatPercent(r.annualizedReturnPercent) },
      { label: "Net margin", value: formatPercent(r.netMarginPercent) },
      { label: `Total profit over ${r.horizonMonths} months`, value: formatINR(r.horizonProfit) },
    ],
    tables: [{ title: "Scenario analysis", columns: ["Scenario", "Payback", "Annual ROI", "Annualised return"], rows: scenarios.map((x) => [x.name, formatMonths(x.result.paybackMonths), formatPercent(x.result.annualRoiPercent), formatPercent(x.result.annualizedReturnPercent)]) }],
    assumptions: ["Profit grows at the monthly rate entered.", "Conservative: profit −20%, growth −1 pt. Optimistic: profit +20%, growth +1 pt.", "Taxes and depreciation are not modelled separately."],
    benchmarks: ["Many investors look for an 18–36 month payback on a new outlet (indicative)."],
  };

  const inputs = (
    <>
      <SourceBar source={source} onExample={resetToExample} onClear={clearAll} />
      <InputGroup title="Investment" icon={<Landmark className="h-5 w-5" />}>
        <CurrencyField control={control} name="initialInvestment" label="Initial investment" tooltip="Fit-out, equipment, deposits, licences, pre-opening salaries and launch marketing." />
      </InputGroup>
      <InputGroup title="Performance" icon={<TrendingUp className="h-5 w-5" />}>
        <FieldGrid>
          <CurrencyField control={control} name="monthlyRevenue" label="Monthly revenue" />
          <NumberField control={control} name="monthlyProfit" label="Monthly profit" prefix="₹" tooltip="Net profit after all costs. Can be negative." />
          <NumberField control={control} name="monthlyGrowthPercent" label="Monthly growth" suffix="%" tooltip="Expected month-on-month growth in profit. Use 0 for flat, negative for decline." />
          <NumberField control={control} name="horizonMonths" label="Projection period" suffix="months" tooltip="12 to 120 months." />
        </FieldGrid>
      </InputGroup>
    </>
  );

  const results = (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard emphasis label="Payback period" value={formatMonths(r.paybackMonths)} tone={tone} sub={r.message ?? "Time for profits to repay the investment"} />
        <MetricCard emphasis label="Annual ROI" value={formatPercent(r.annualRoiPercent)} sub="Year-one profit ÷ investment" />
        <MetricCard label="Monthly ROI" value={formatPercent(r.monthlyRoiPercent)} />
        <MetricCard label="Annualised return" value={formatPercent(r.annualizedReturnPercent)} sub={`Over ${r.horizonMonths} months`} />
      </div>
      <section className="rounded-2xl border border-line bg-card p-5 shadow-card">
        <div className="divide-y divide-line">
          <StatementRow label="Net margin" value={formatPercent(r.netMarginPercent)} />
          <StatementRow label="Year-one profit" value={formatINR(r.firstYearProfit)} />
          <StatementRow label={`Total profit over ${r.horizonMonths} months`} value={formatINR(r.horizonProfit)} strong tone={r.horizonProfit >= 0 ? "good" : "bad"} />
        </div>
      </section>
      <ResultActions slug={SLUG} calculatorTitle="Restaurant ROI" path={PATH} values={values} report={report} onReset={resetToExample} onLoad={(v) => loadValues(v)} />
    </>
  );

  return (
    <>
      <CalculatorLayout inputs={inputs} results={results} summary={{ label: "Payback", value: formatMonths(r.paybackMonths), tone }} />
      <section className="print-break">
        <BlockTitle eyebrow="Visual analysis" title="When does the outlet pay for itself?" description={`Cumulative profit against your ${formatINRCompact(values.initialInvestment)} investment.`} />
        <div className="rounded-2xl border border-line bg-card p-4 shadow-card sm:p-5">
          <RoiChart data={r.projection} investment={values.initialInvestment} />
        </div>
      </section>
      <section className="print-break">
        <BlockTitle eyebrow="Scenario analysis" title="Conservative, expected and optimistic" />
        <div className="grid gap-4 md:grid-cols-3">
          {scenarios.map((x) => (
            <div key={x.name} className={cn("rounded-2xl border bg-card p-5 shadow-card", x.name === "Expected" ? "border-accent" : "border-line")}>
              <p className="font-semibold">{x.name}</p>
              <p className="text-xs text-muted">Profit ×{x.profitFactor} · growth {x.growthDelta > 0 ? "+" : ""}{x.growthDelta} pt</p>
              <div className="mt-3 divide-y divide-line">
                <StatementRow label="Payback" value={formatMonths(x.result.paybackMonths)} tone={paybackTone(x.result.paybackMonths)} />
                <StatementRow label="Annual ROI" value={formatPercent(x.result.annualRoiPercent)} />
                <StatementRow label="Annualised return" value={formatPercent(x.result.annualizedReturnPercent)} />
              </div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <BlockTitle eyebrow="Scenario mode" title="Test your own assumptions" />
        <ScenarioPanel
          active={active}
          onReset={() => setSc({ profit: 0, growth: 0, investment: 0 })}
          controls={
            <>
              <ScenarioSlider label="Monthly profit change" value={sc.profit} min={-50} max={50} step={5} onChange={(v) => setSc({ ...sc, profit: v })} format={(v) => `${v > 0 ? "+" : ""}${v}%`} />
              <ScenarioSlider label="Growth change" value={sc.growth} min={-5} max={5} step={0.5} onChange={(v) => setSc({ ...sc, growth: v })} format={(v) => `${v > 0 ? "+" : ""}${v} pt`} />
              <ScenarioSlider label="Investment change" value={sc.investment} min={-30} max={50} step={5} onChange={(v) => setSc({ ...sc, investment: v })} format={(v) => `${v > 0 ? "+" : ""}${v}%`} />
            </>
          }
          metrics={[
            { label: "Payback", current: r.paybackMonths, scenario: s.paybackMonths, format: "months", better: "down" },
            { label: "Annual ROI", current: r.annualRoiPercent, scenario: s.annualRoiPercent, format: "percent", better: "up" },
            { label: "Annualised return", current: r.annualizedReturnPercent, scenario: s.annualizedReturnPercent, format: "percent", better: "up" },
            { label: "Total profit", current: r.horizonProfit, scenario: s.horizonProfit, format: "inr", better: "up" },
          ]}
        />
      </section>
      <InsightList insights={insights} />
    </>
  );
}
