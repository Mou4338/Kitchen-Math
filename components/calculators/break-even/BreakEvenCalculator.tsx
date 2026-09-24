"use client";

import dynamic from "next/dynamic";
import { Building2, Target, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { CurrencyField, NumberField, PercentField, ScenarioSlider, SliderField } from "@/components/forms/fields";
import { ChartSkeleton } from "@/components/charts/ChartSkeleton";
import { ZoneBar } from "@/components/charts/ZoneBar";
import { BlockTitle, CalculatorLayout, FieldGrid, InputGroup } from "@/components/calculators/shared/CalculatorLayout";
import { InsightList, type Insight } from "@/components/calculators/shared/InsightList";
import { MetricCard, StatementRow } from "@/components/calculators/shared/MetricCard";
import { ResultActions } from "@/components/calculators/shared/ResultActions";
import { ScenarioPanel } from "@/components/calculators/shared/ScenarioPanel";
import { SourceBar } from "@/components/calculators/shared/SourceBar";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  applyBreakEvenScenario, breakEvenChartData, calculateBreakEven, NO_BREAK_EVEN_SCENARIO, type BreakEvenScenario,
} from "@/lib/calculations/breakEvenCalculator";
import { BREAK_EVEN_DEFAULTS } from "@/lib/content/defaults";
import { formatINR, formatINRCompact, formatNumber, formatPercent, formatPoints } from "@/lib/formatters/number";
import { useCalculatorForm } from "@/lib/hooks/useCalculatorForm";
import { breakEvenSchema } from "@/lib/validators/schemas";
import type { ReportData } from "@/types/report";
import { AnimatedNumber } from "@/components/ui/Motion";

const BreakEvenChart = dynamic(() => import("@/components/charts/BreakEvenChart"), { ssr: false, loading: () => <ChartSkeleton height={300} /> });

const SLUG = "break-even-calculator";
const PATH = `/restaurant/${SLUG}`;
const signed = (v: number) => `${v > 0 ? "+" : ""}${v}%`;

export default function BreakEvenCalculator() {
  const { control, values, source, loadValues, resetToExample, clearAll } = useCalculatorForm(SLUG, breakEvenSchema, BREAK_EVEN_DEFAULTS, ["daysOpen", "targetBufferPercent"]);
  const [sc, setSc] = useState<BreakEvenScenario>(NO_BREAK_EVEN_SCENARIO);

  const r = useMemo(() => calculateBreakEven(values), [values]);
  const scenarioInputs = useMemo(() => applyBreakEvenScenario(values, sc), [values, sc]);
  const s = useMemo(() => calculateBreakEven(scenarioInputs), [scenarioInputs]);
  const chart = useMemo(() => breakEvenChartData(values), [values]);
  const active = Object.values(sc).some((v) => v !== 0);
  const ok = r.breakEvenRevenue !== null && r.fixedCosts > 0;

  const insights: Insight[] = [];
  if (ok) {
    const cm = r.contributionMarginPercent / 100;
    const oneLess = r.fixedCosts / (cm + 0.01);
    insights.push({ tone: "neutral", title: "Cut raw material cost by 1 point", body: `Break-even would fall to ${formatINR(oneLess)}.`, impact: `${formatINR(r.breakEvenRevenue! - oneLess)} less to sell each month` });
    insights.push({ tone: "neutral", title: "Every ₹10,000 saved in fixed costs", body: `lowers your break-even by ${formatINR(10000 / cm)} a month.` });
    if (r.status === "loss" || r.status === "danger") insights.unshift({ tone: "bad", title: "Increase your cushion urgently", body: "Review rent, the salary bill and supplier prices this month, and push higher-margin dishes. Small changes on both sides add up." });
    if (r.status === "strong") insights.unshift({ tone: "good", title: "Healthy margin of safety", body: `Sales can fall ${formatPercent(r.marginOfSafetyPercent)} before you make a loss. Use this room to invest in marketing or a price test.` });
  }

  const report: ReportData = {
    calculator: SLUG,
    title: "Break-Even Report",
    headline: ok ? `Break-even ${formatINR(r.breakEvenRevenue)}/month · Margin of safety ${formatPercent(r.marginOfSafetyPercent)} · Net profit ${formatINR(r.netProfit)}` : r.error ?? "Break-even not calculated yet",
    inputs: [
      { label: "Monthly revenue", value: formatINR(values.monthlyRevenue) },
      { label: "Raw material (variable) cost", value: formatPercent(values.variableCostPercent) },
      { label: "Monthly rent", value: formatINR(values.rent) },
      { label: "Staff salaries", value: formatINR(values.salaries) },
      { label: "Electricity + misc fixed", value: formatINR(values.utilities) },
      { label: "Loan EMI & other fixed", value: formatINR(values.otherFixed) },
      { label: "Average order value", value: formatINR(values.averageOrderValue) },
      { label: "Days open per month", value: formatNumber(values.daysOpen) },
    ],
    results: [
      { label: "Fixed costs", value: formatINR(r.fixedCosts) },
      { label: "Contribution margin", value: formatPercent(r.contributionMarginPercent) },
      { label: "Break-even sales (monthly)", value: formatINR(r.breakEvenRevenue) },
      { label: "Break-even sales (daily)", value: formatINR(r.dailyBreakEven) },
      { label: "Orders per day to break even", value: r.ordersPerDayToBreakEven === null ? "—" : formatNumber(Math.ceil(r.ordersPerDayToBreakEven)) },
      { label: "Margin of safety", value: `${formatINR(r.marginOfSafety)} (${formatPercent(r.marginOfSafetyPercent)})` },
      { label: `Sales target (${values.targetBufferPercent}% above break-even)`, value: formatINR(r.targetRevenue) },
      { label: "Net profit", value: formatINR(r.netProfit) },
      { label: "Verdict", value: r.verdict },
    ],
    chart: {
      title: "Where you stand",
      bars: [
        { label: "Current revenue", value: r.revenue, display: formatINR(r.revenue), tone: "accent" },
        { label: "Break-even", value: r.breakEvenRevenue ?? 0, display: formatINR(r.breakEvenRevenue), tone: "neutral" },
        { label: "Fixed costs", value: r.fixedCosts, display: formatINR(r.fixedCosts), tone: "watch" },
        { label: "Net profit", value: Math.abs(r.netProfit), display: formatINR(r.netProfit), tone: r.netProfit >= 0 ? "good" : "bad" },
      ],
    },
    tables: active
      ? [{ title: "Scenario comparison", columns: ["Metric", "Current", "Scenario"], rows: [["Revenue", formatINR(r.revenue), formatINR(s.revenue)], ["Break-even", formatINR(r.breakEvenRevenue), formatINR(s.breakEvenRevenue)], ["Net profit", formatINR(r.netProfit), formatINR(s.netProfit)], ["Margin of safety", formatPercent(r.marginOfSafetyPercent), formatPercent(s.marginOfSafetyPercent)]] }]
      : undefined,
    assumptions: ["Raw material cost is treated as fully variable with sales.", "Rent, salaries, utilities and EMIs are treated as fixed each month.", `Daily figures use ${values.daysOpen} trading days.`],
    benchmarks: ["Margin of safety of 25% or more is often considered comfortable; under 10% is risky (indicative)."],
  };

  const inputs = (
    <>
      <SourceBar source={source} onExample={resetToExample} onClear={clearAll} />
      <InputGroup title="Revenue" description="Your average month, from all channels." icon={<Wallet className="h-5 w-5" />}>
        <FieldGrid cols={1}>
          <CurrencyField control={control} name="monthlyRevenue" label="Monthly revenue (total sales)" tooltip="All money coming in each month: dine-in, delivery and takeaway." />
          <SliderField control={control} name="variableCostPercent" label="Raw material cost (% of revenue)" tooltip="Costs that rise with every sale: food, packaging and delivery commissions. Typical range 28–40%." min={0} max={100} step={0.5} />
        </FieldGrid>
      </InputGroup>
      <InputGroup title="Fixed costs" description="Bills you pay every month, however busy you are." icon={<Building2 className="h-5 w-5" />}>
        <FieldGrid>
          <CurrencyField control={control} name="rent" label="Monthly rent" tooltip="Shop rent including maintenance charges." />
          <CurrencyField control={control} name="salaries" label="Staff salaries" tooltip="All monthly salaries: kitchen, service and cleaning." />
          <CurrencyField control={control} name="utilities" label="Electricity + misc fixed costs" tooltip="Electricity, gas, water, internet, POS software and other fixed bills." />
          <CurrencyField control={control} name="otherFixed" label="Loan EMI & other fixed costs" tooltip="Loan EMIs, insurance, licences. Leave at 0 if none." />
        </FieldGrid>
      </InputGroup>
      <InputGroup title="Targets" description="Turn break-even into daily and order targets." icon={<Target className="h-5 w-5" />}>
        <FieldGrid cols={3}>
          <CurrencyField control={control} name="averageOrderValue" label="Average order value" tooltip="Average bill per order." />
          <NumberField control={control} name="daysOpen" label="Days open / month" suffix="days" tooltip="Trading days in a month." />
          <PercentField control={control} name="targetBufferPercent" label="Safety buffer" tooltip="How far above break-even you want to stay. 20% is a common starting point." />
        </FieldGrid>
      </InputGroup>
      {r.error ? <div role="alert" className="rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm font-medium text-danger">{r.error}</div> : null}
    </>
  );

  const results = (
    <>
      <section className="print-break rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6" aria-label="Break-even result">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="eyebrow">Break-even sales</p>
            <p className="tabular mt-1 text-4xl font-bold tracking-tight"><AnimatedNumber value={r.breakEvenRevenue} format={(v) => formatINR(v)} /><span className="text-base font-medium text-muted"> /month</span></p>
            {ok ? (
              <p className="tabular mt-1.5 text-sm text-muted">
                {formatINR(r.dailyBreakEven)} a day{r.ordersPerDayToBreakEven !== null ? ` · about ${Math.ceil(r.ordersPerDayToBreakEven)} orders a day` : ""}
              </p>
            ) : null}
          </div>
          <StatusPill tone={r.tone}>{r.verdict}</StatusPill>
        </div>
        <div className="mt-4 divide-y divide-line">
          <StatementRow label="Current revenue" value={formatINR(r.revenue)} />
          <StatementRow label={`Variable costs (${formatPercent(values.variableCostPercent)})`} value={`−${formatINR(r.variableCosts)}`} />
          <StatementRow label="Fixed costs" value={`−${formatINR(r.fixedCosts)}`} />
          <StatementRow label="Contribution margin" value={formatPercent(r.contributionMarginPercent)} />
          <StatementRow label="Estimated net profit" value={formatINR(r.netProfit)} tone={r.netProfit >= 0 ? "good" : "bad"} strong />
        </div>
      </section>
      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard label="Margin of safety" value={formatINR(r.marginOfSafety)} tone={r.tone} sub={r.marginOfSafetyPercent === null ? "Add revenue to calculate" : `${formatPercent(r.marginOfSafetyPercent)} of current sales`} reference="≥ 25%" />
        <MetricCard label={`Target (${values.targetBufferPercent}% above break-even)`} value={formatINR(r.targetRevenue)} sub={r.targetRevenue !== null && values.daysOpen > 0 ? `${formatINR(r.targetRevenue / values.daysOpen)} a day` : undefined} />
      </div>
      <ResultActions slug={SLUG} calculatorTitle="Break-Even" path={PATH} values={values} report={report} onReset={resetToExample} onLoad={(v) => loadValues(v)} />
    </>
  );

  return (
    <>
      <CalculatorLayout inputs={inputs} results={results} summary={{ label: "Break-even / month", value: formatINR(r.breakEvenRevenue), tone: r.tone }} />

      <section className="print-break">
        <BlockTitle eyebrow="Visual analysis" title="How far are you from break-even?" description={ok ? `Current sales ${formatINR(r.revenue)} · Break-even ${formatINR(r.breakEvenRevenue)} · Margin of safety ${formatINR(r.marginOfSafety)} (${formatPercent(r.marginOfSafetyPercent)})` : undefined} />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6">
            <ZoneBar breakEven={r.breakEvenRevenue} current={r.revenue} />
            {ok ? (
              <p className="mt-5 text-sm leading-relaxed text-ink-soft">
                {r.marginOfSafety! >= 0
                  ? `Your sales can drop by ${formatINRCompact(r.marginOfSafety)} (${formatPercent(r.marginOfSafetyPercent)}) before you start losing money.`
                  : `You need ${formatINRCompact(-r.marginOfSafety!)} more sales each month just to break even.`}
              </p>
            ) : null}
          </div>
          <div className="rounded-2xl border border-line bg-card p-4 shadow-card sm:p-5">
            <BreakEvenChart data={chart} breakEven={r.breakEvenRevenue} current={r.revenue} />
          </div>
        </div>
      </section>

      <section>
        <BlockTitle eyebrow="Scenario mode" title="Test a change before you make it" />
        <ScenarioPanel
          active={active}
          onReset={() => setSc(NO_BREAK_EVEN_SCENARIO)}
          presets={[
            { label: "Revenue +10%", onApply: () => setSc({ ...NO_BREAK_EVEN_SCENARIO, revenueChangePercent: 10 }) },
            { label: "Revenue −10%", onApply: () => setSc({ ...NO_BREAK_EVEN_SCENARIO, revenueChangePercent: -10 }) },
            { label: "Food cost −2 pts", onApply: () => setSc({ ...NO_BREAK_EVEN_SCENARIO, variableCostChangePts: -2 }) },
            { label: "Rent +10%", onApply: () => setSc({ ...NO_BREAK_EVEN_SCENARIO, rentChangePercent: 10 }) },
            { label: "Salary +10%", onApply: () => setSc({ ...NO_BREAK_EVEN_SCENARIO, salaryChangePercent: 10 }) },
          ]}
          controls={
            <>
              <ScenarioSlider label="Revenue change" value={sc.revenueChangePercent} min={-50} max={50} step={1} onChange={(v) => setSc({ ...sc, revenueChangePercent: v })} format={signed} />
              <ScenarioSlider label="Raw material cost change" value={sc.variableCostChangePts} min={-10} max={10} step={0.5} onChange={(v) => setSc({ ...sc, variableCostChangePts: v })} format={(v) => formatPoints(v)} />
              <ScenarioSlider label="Rent change" value={sc.rentChangePercent} min={-30} max={30} step={1} onChange={(v) => setSc({ ...sc, rentChangePercent: v })} format={signed} />
              <ScenarioSlider label="Salary change" value={sc.salaryChangePercent} min={-30} max={30} step={1} onChange={(v) => setSc({ ...sc, salaryChangePercent: v })} format={signed} />
            </>
          }
          metrics={[
            { label: "Revenue", current: r.revenue, scenario: s.revenue, format: "inr", better: "up" },
            { label: "Total costs", current: r.variableCosts + r.fixedCosts, scenario: s.variableCosts + s.fixedCosts, format: "inr", better: "down" },
            { label: "Break-even sales", current: r.breakEvenRevenue, scenario: s.breakEvenRevenue, format: "inr", better: "down" },
            { label: "Net profit", current: r.netProfit, scenario: s.netProfit, format: "inr", better: "up" },
            { label: "Net margin", current: r.netMarginPercent, scenario: s.netMarginPercent, format: "percent", better: "up" },
            { label: "Margin of safety", current: r.marginOfSafetyPercent, scenario: s.marginOfSafetyPercent, format: "percent", better: "up" },
          ]}
        />
      </section>

      <InsightList insights={insights} title="Actionable insights" />
    </>
  );
}
