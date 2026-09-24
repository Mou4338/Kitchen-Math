"use client";

import { Receipt, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { CurrencyField, ScenarioSlider } from "@/components/forms/fields";
import { Waterfall } from "@/components/charts/Waterfall";
import { BlockTitle, CalculatorLayout, FieldGrid, InputGroup } from "@/components/calculators/shared/CalculatorLayout";
import { InsightList, type Insight } from "@/components/calculators/shared/InsightList";
import { MetricCard } from "@/components/calculators/shared/MetricCard";
import { ResultActions } from "@/components/calculators/shared/ResultActions";
import { ScenarioPanel } from "@/components/calculators/shared/ScenarioPanel";
import { SourceBar } from "@/components/calculators/shared/SourceBar";
import { DEFAULT_BENCHMARKS } from "@/lib/calculations/benchmarks";
import { calculateProfitMargin, type ProfitMarginInputs } from "@/lib/calculations/profitMarginCalculator";
import type { Tone } from "@/lib/calculations/utils";
import { PROFIT_MARGIN_DEFAULTS } from "@/lib/content/defaults";
import { formatINR, formatPercent, formatPoints } from "@/lib/formatters/number";
import { useCalculatorForm } from "@/lib/hooks/useCalculatorForm";
import { profitMarginSchema } from "@/lib/validators/schemas";
import type { ReportData } from "@/types/report";

const SLUG = "profit-margin-calculator";
const PATH = `/restaurant/${SLUG}`;
const pc = (v: number) => `${v > 0 ? "+" : ""}${v}%`;
const netTone = (m: number | null): Tone => (m === null ? "neutral" : m < 0 ? "bad" : m < DEFAULT_BENCHMARKS.netMarginMin ? "watch" : "good");

export default function ProfitMarginCalculator() {
  const { control, values, source, loadValues, resetToExample, clearAll } = useCalculatorForm(SLUG, profitMarginSchema, PROFIT_MARGIN_DEFAULTS);
  const [sc, setSc] = useState({ revenue: 0, foodPts: 0, labor: 0 });
  const r = useMemo(() => calculateProfitMargin(values), [values]);
  const scenarioInputs: ProfitMarginInputs = useMemo(() => {
    const revenue = values.revenue * (1 + sc.revenue / 100);
    const foodPct = values.revenue > 0 ? values.foodCost / values.revenue : 0;
    return { ...values, revenue, foodCost: Math.max(0, revenue * (foodPct + sc.foodPts / 100)), labor: values.labor * (1 + sc.labor / 100) };
  }, [values, sc]);
  const s = useMemo(() => calculateProfitMargin(scenarioInputs), [scenarioInputs]);
  const active = sc.revenue !== 0 || sc.foodPts !== 0 || sc.labor !== 0;
  const tone = netTone(r.netMarginPercent);

  const biggest = [...r.costShares].filter((c) => c.key !== "taxes").sort((a, b) => b.amount - a.amount)[0];
  const insights: Insight[] = [];
  if (r.revenue > 0) {
    if (biggest && biggest.amount > 0) insights.push({ tone: "neutral", title: `${biggest.label} is your largest cost`, body: `It takes ${formatPercent(biggest.percent)} of revenue. A 5% cut here is worth ${formatINR(biggest.amount * 0.05)} a month.` });
    if (r.netProfit < 0) insights.push({ tone: "bad", title: "You are losing money this month", body: "Check prime cost first (food + labor), then rent and delivery fees." });
    else if ((r.netMarginPercent ?? 0) < DEFAULT_BENCHMARKS.netMarginMin) insights.push({ tone: "watch", title: "Net margin is thin", body: `Many well-run restaurants earn ${DEFAULT_BENCHMARKS.netMarginMin}–${DEFAULT_BENCHMARKS.netMarginMax}% net. Small cuts across two or three lines add up.` });
    else insights.push({ tone: "good", title: "Healthy net margin", body: "Keep reviewing the P&L monthly so it stays that way." });
  }

  const report: ReportData = {
    calculator: SLUG,
    title: "Profit & Loss Report",
    headline: `Net profit ${formatINR(r.netProfit)} · Net margin ${formatPercent(r.netMarginPercent)} · Operating margin ${formatPercent(r.operatingMarginPercent)}`,
    inputs: [{ label: "Revenue", value: formatINR(values.revenue) }, ...r.costShares.map((c) => ({ label: c.label, value: formatINR(c.amount) }))],
    results: [
      { label: "Gross profit", value: `${formatINR(r.grossProfit)} (${formatPercent(r.grossMarginPercent)})` },
      { label: "Operating expenses", value: formatINR(r.operatingExpenses) },
      { label: "Operating profit", value: `${formatINR(r.operatingProfit)} (${formatPercent(r.operatingMarginPercent)})` },
      { label: "Net profit", value: `${formatINR(r.netProfit)} (${formatPercent(r.netMarginPercent)})` },
    ],
    chart: { title: "Costs as % of revenue", bars: r.costShares.map((c) => ({ label: c.label, value: c.percent ?? 0, display: formatPercent(c.percent), tone: "accent" as const })) },
    assumptions: ["Gross profit = revenue − food cost.", "Operating expenses = labor, rent, utilities, marketing, delivery fees and other.", "Net profit = operating profit − taxes."],
    benchmarks: [`Net margin ${DEFAULT_BENCHMARKS.netMarginMin}–${DEFAULT_BENCHMARKS.netMarginMax}% (indicative)`],
  };

  const inputs = (
    <>
      <SourceBar source={source} onExample={resetToExample} onClear={clearAll} />
      <InputGroup title="Revenue & food" icon={<Wallet className="h-5 w-5" />}>
        <FieldGrid>
          <CurrencyField control={control} name="revenue" label="Revenue" tooltip="Total monthly sales." />
          <CurrencyField control={control} name="foodCost" label="Food cost" tooltip="COGS for the month." />
        </FieldGrid>
      </InputGroup>
      <InputGroup title="Operating expenses & taxes" icon={<Receipt className="h-5 w-5" />}>
        <FieldGrid>
          <CurrencyField control={control} name="labor" label="Labor" />
          <CurrencyField control={control} name="rent" label="Rent" />
          <CurrencyField control={control} name="utilities" label="Utilities" tooltip="Electricity, gas, water, internet." />
          <CurrencyField control={control} name="marketing" label="Marketing" />
          <CurrencyField control={control} name="deliveryFees" label="Delivery & platform fees" tooltip="Commissions, GST on commission and delivery charges." />
          <CurrencyField control={control} name="otherExpenses" label="Other expenses" tooltip="Repairs, software, licences, accounting, EMIs." />
          <CurrencyField control={control} name="taxes" label="Taxes" tooltip="Income tax or other taxes on profit, set aside monthly." />
        </FieldGrid>
      </InputGroup>
    </>
  );

  const results = (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Gross margin" value={formatPercent(r.grossMarginPercent)} sub={formatINR(r.grossProfit)} />
        <MetricCard label="Operating margin" value={formatPercent(r.operatingMarginPercent)} sub={formatINR(r.operatingProfit)} />
        <MetricCard label="Net margin" value={formatPercent(r.netMarginPercent)} sub={formatINR(r.netProfit)} tone={tone} reference={`${DEFAULT_BENCHMARKS.netMarginMin}–${DEFAULT_BENCHMARKS.netMarginMax}%`} />
      </div>
      <section className="print-break rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6" aria-label="Profit and loss waterfall">
        <h2 className="mb-3 text-base font-semibold">P&amp;L waterfall</h2>
        <Waterfall steps={r.waterfall} base={r.revenue} />
      </section>
      <ResultActions slug={SLUG} calculatorTitle="Profit Margin" path={PATH} values={values} report={report} onReset={resetToExample} onLoad={(v) => loadValues(v)} />
    </>
  );

  return (
    <>
      <CalculatorLayout inputs={inputs} results={results} summary={{ label: "Net profit", value: `${formatINR(r.netProfit)} · ${formatPercent(r.netMarginPercent)}`, tone }} />
      <section>
        <BlockTitle eyebrow="Scenario mode" title="Current vs scenario" />
        <ScenarioPanel
          active={active}
          onReset={() => setSc({ revenue: 0, foodPts: 0, labor: 0 })}
          presets={[
            { label: "Revenue +15%", onApply: () => setSc({ ...sc, revenue: 15 }) },
            { label: "Food cost −2 pts", onApply: () => setSc({ ...sc, foodPts: -2 }) },
            { label: "Labor +5%", onApply: () => setSc({ ...sc, labor: 5 }) },
          ]}
          controls={
            <>
              <ScenarioSlider label="Revenue change" value={sc.revenue} min={-30} max={30} step={1} onChange={(v) => setSc({ ...sc, revenue: v })} format={pc} />
              <ScenarioSlider label="Food cost change" value={sc.foodPts} min={-10} max={10} step={0.5} onChange={(v) => setSc({ ...sc, foodPts: v })} format={(v) => formatPoints(v)} />
              <ScenarioSlider label="Labor change" value={sc.labor} min={-30} max={30} step={1} onChange={(v) => setSc({ ...sc, labor: v })} format={pc} />
            </>
          }
          metrics={[
            { label: "Revenue", current: r.revenue, scenario: s.revenue, format: "inr", better: "up" },
            { label: "Total costs", current: r.revenue - r.netProfit, scenario: s.revenue - s.netProfit, format: "inr", better: "down" },
            { label: "Net profit", current: r.netProfit, scenario: s.netProfit, format: "inr", better: "up" },
            { label: "Net margin", current: r.netMarginPercent, scenario: s.netMarginPercent, format: "percent", better: "up" },
          ]}
        />
      </section>
      <InsightList insights={insights} />
    </>
  );
}
