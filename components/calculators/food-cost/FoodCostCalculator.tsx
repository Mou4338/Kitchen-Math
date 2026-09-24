"use client";

import dynamic from "next/dynamic";
import { Boxes, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { CurrencyField, ScenarioSlider } from "@/components/forms/fields";
import { BenchmarkBar } from "@/components/charts/BenchmarkBar";
import { ChartSkeleton } from "@/components/charts/ChartSkeleton";
import { BlockTitle, CalculatorLayout, FieldGrid, InputGroup } from "@/components/calculators/shared/CalculatorLayout";
import { InsightList, type Insight } from "@/components/calculators/shared/InsightList";
import { MetricCard, StatementRow } from "@/components/calculators/shared/MetricCard";
import { ResultActions } from "@/components/calculators/shared/ResultActions";
import { ScenarioPanel } from "@/components/calculators/shared/ScenarioPanel";
import { SourceBar } from "@/components/calculators/shared/SourceBar";
import { DEFAULT_BENCHMARKS } from "@/lib/calculations/benchmarks";
import { calculateFoodCost } from "@/lib/calculations/foodCostCalculator";
import { foodStatus } from "@/lib/calculations/healthCalculator";
import { FOOD_COST_DEFAULTS } from "@/lib/content/defaults";
import { formatINR, formatINRSigned, formatPercent } from "@/lib/formatters/number";
import { useCalculatorForm } from "@/lib/hooks/useCalculatorForm";
import { foodCostSchema } from "@/lib/validators/schemas";
import type { ReportData } from "@/types/report";
import { CHART } from "@/lib/utils/colors";

const CostDonut = dynamic(() => import("@/components/charts/CostDonut"), { ssr: false, loading: () => <ChartSkeleton height={200} /> });

const SLUG = "food-cost-calculator";
const PATH = `/restaurant/${SLUG}`;

export default function FoodCostCalculator() {
  const { control, values, source, loadValues, resetToExample, clearAll } = useCalculatorForm(SLUG, foodCostSchema, FOOD_COST_DEFAULTS);
  const [sc, setSc] = useState({ wasteCut: 0, purchaseChange: 0 });
  const r = useMemo(() => calculateFoodCost(values), [values]);
  const scenarioValues = useMemo(() => {
    const waste = values.waste * (1 - sc.wasteCut / 100);
    const spoilage = values.spoilage * (1 - sc.wasteCut / 100);
    const saved = values.waste - waste + (values.spoilage - spoilage);
    return { ...values, waste, spoilage, purchases: Math.max(0, values.purchases * (1 + sc.purchaseChange / 100) - saved) };
  }, [values, sc]);
  const s = useMemo(() => calculateFoodCost(scenarioValues), [scenarioValues]);
  const st = foodStatus(r.foodCostPercent);
  const adjSt = foodStatus(r.adjustedFoodCostPercent);
  const active = sc.wasteCut !== 0 || sc.purchaseChange !== 0;

  const insights: Insight[] = [];
  if (r.nonRevenueUsage > 0 && r.nonRevenueSharePercent !== null) {
    insights.push({ tone: r.nonRevenueSharePercent > 8 ? "watch" : "neutral", title: `${formatPercent(r.nonRevenueSharePercent)} of food used earned nothing`, body: "Waste, spoilage, staff meals and complimentary food. Log waste daily at the pass and prep from sales forecasts.", impact: `Halving waste and spoilage saves about ${formatINR((values.waste + values.spoilage) / 2)}/month` });
  }
  if (r.foodCostPercent !== null && r.foodCostPercent > DEFAULT_BENCHMARKS.foodCostMax) {
    insights.push({ tone: st.tone, title: "Food cost is above the reference range", body: "Re-cost your top-selling dishes, check portions and compare supplier quotes.", impact: `${formatINR(((r.foodCostPercent - DEFAULT_BENCHMARKS.foodCostMax) / 100) * values.foodSales)}/month above ${DEFAULT_BENCHMARKS.foodCostMax}%` });
  }
  if (r.foodCostPercent !== null && r.foodCostPercent <= DEFAULT_BENCHMARKS.foodCostMax) insights.push({ tone: "good", title: "Food cost is within the reference range", body: "Keep weekly stock counts on high-value items to hold it there." });

  const report: ReportData = {
    calculator: SLUG,
    title: "Food Cost Report",
    headline: `Food cost ${formatPercent(r.foodCostPercent)} · Adjusted ${formatPercent(r.adjustedFoodCostPercent)} · COGS ${formatINR(r.cogs)}`,
    inputs: [
      { label: "Opening inventory", value: formatINR(values.openingInventory) },
      { label: "Purchases", value: formatINR(values.purchases) },
      { label: "Closing inventory", value: formatINR(values.closingInventory) },
      { label: "Food sales", value: formatINR(values.foodSales) },
      { label: "Waste", value: formatINR(values.waste) },
      { label: "Spoilage", value: formatINR(values.spoilage) },
      { label: "Staff meals", value: formatINR(values.staffMeals) },
      { label: "Complimentary food", value: formatINR(values.complimentary) },
    ],
    results: [
      { label: "COGS", value: formatINR(r.cogs) },
      { label: "Food cost %", value: formatPercent(r.foodCostPercent) },
      { label: "Gross profit", value: formatINR(r.grossProfit) },
      { label: "Gross margin", value: formatPercent(r.grossMarginPercent) },
      { label: "Non-revenue usage", value: `${formatINR(r.nonRevenueUsage)} (${formatPercent(r.nonRevenueSharePercent)} of COGS)` },
      { label: "Adjusted food cost %", value: formatPercent(r.adjustedFoodCostPercent) },
    ],
    chart: {
      title: "Where the food went",
      bars: [
        { label: "Sold to guests", value: r.adjustedCogs, display: formatINR(r.adjustedCogs), tone: "good" },
        { label: "Waste", value: values.waste, display: formatINR(values.waste), tone: "bad" },
        { label: "Spoilage", value: values.spoilage, display: formatINR(values.spoilage), tone: "bad" },
        { label: "Staff meals", value: values.staffMeals, display: formatINR(values.staffMeals), tone: "neutral" },
        { label: "Complimentary", value: values.complimentary, display: formatINR(values.complimentary), tone: "watch" },
      ],
    },
    assumptions: ["COGS = opening inventory + purchases − closing inventory.", "Adjusted food cost removes waste, spoilage, staff meals and complimentary food from COGS."],
    benchmarks: [`Food cost ≤ ${DEFAULT_BENCHMARKS.foodCostMax}% (indicative)`],
  };

  const inputs = (
    <>
      <SourceBar source={source} onExample={resetToExample} onClear={clearAll} />
      <InputGroup title="Stock and sales" description="Use the same period for all four numbers." icon={<Boxes className="h-5 w-5" />}>
        <FieldGrid>
          <CurrencyField control={control} name="openingInventory" label="Opening inventory" tooltip="Value of all food stock at the start of the period." />
          <CurrencyField control={control} name="purchases" label="Purchases" tooltip="All food bought during the period." />
          <CurrencyField control={control} name="closingInventory" label="Closing inventory" tooltip="Value of food stock counted at the end of the period." />
          <CurrencyField control={control} name="foodSales" label="Food sales" tooltip="Food revenue for the same period (exclude beverages if you track them separately)." />
        </FieldGrid>
      </InputGroup>
      <InputGroup title="Non-revenue usage (optional)" description="Food that left the kitchen without being paid for." icon={<Trash2 className="h-5 w-5" />}>
        <FieldGrid>
          <CurrencyField control={control} name="waste" label="Waste" tooltip="Plate waste, prep trimmings you couldn't reuse, mistakes and returns." />
          <CurrencyField control={control} name="spoilage" label="Spoilage" tooltip="Stock that expired or went bad." />
          <CurrencyField control={control} name="staffMeals" label="Staff meals" tooltip="Food served to staff." />
          <CurrencyField control={control} name="complimentary" label="Complimentary food" tooltip="Free items for guests, tastings and influencer visits." />
        </FieldGrid>
      </InputGroup>
      {r.errors.length ? <div role="alert" className="rounded-xl border border-caution/30 bg-caution-soft px-4 py-3 text-sm">{r.errors.join(" ")}</div> : null}
    </>
  );

  const results = (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard emphasis label="Food cost" value={formatPercent(r.foodCostPercent)} tone={st.tone} reference={`≤ ${DEFAULT_BENCHMARKS.foodCostMax}%`} status={st.status} />
        <MetricCard emphasis label="Adjusted food cost" value={formatPercent(r.adjustedFoodCostPercent)} tone={adjSt.tone} sub="Excluding waste, spoilage, staff meals and complimentary food" />
      </div>
      <section className="rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6" aria-label="Food cost statement">
        <div className="divide-y divide-line">
          <StatementRow label="Opening inventory + purchases" value={formatINR(values.openingInventory + values.purchases)} />
          <StatementRow label="Less closing inventory" value={`−${formatINR(values.closingInventory)}`} />
          <StatementRow label="Cost of goods sold (COGS)" value={formatINR(r.cogs)} strong />
          <StatementRow label="Food sales" value={formatINR(values.foodSales)} />
          <StatementRow label="Estimated gross profit" value={`${formatINR(r.grossProfit)} · ${formatPercent(r.grossMarginPercent)}`} tone={r.grossProfit >= 0 ? "good" : "bad"} strong />
        </div>
      </section>
      <ResultActions slug={SLUG} calculatorTitle="Food Cost" path={PATH} values={values} report={report} onReset={resetToExample} onLoad={(v) => loadValues(v)} />
    </>
  );

  return (
    <>
      <CalculatorLayout inputs={inputs} results={results} summary={{ label: "Food cost", value: formatPercent(r.foodCostPercent), tone: st.tone }} />
      <section className="print-break">
        <BlockTitle eyebrow="Visual analysis" title="Where the food went" />
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6">
            <CostDonut
              total={r.cogs}
              centerLabel="Food used"
              centerValue={formatINR(r.cogs)}
              slices={[
                { name: "Sold to guests", value: r.adjustedCogs, color: CHART.good },
                { name: "Waste", value: values.waste, color: CHART.bad },
                { name: "Spoilage", value: values.spoilage, color: CHART.accent },
                { name: "Staff meals", value: values.staffMeals, color: CHART.c1 },
                { name: "Complimentary", value: values.complimentary, color: CHART.c4 },
              ]}
            />
          </div>
          <div className="flex flex-col justify-center gap-6 rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6">
            <BenchmarkBar label="Food cost" value={r.foodCostPercent} max={60} reference="≤ 35%" zones={[{ from: 0, to: 35, tone: "good" }, { from: 35, to: 40, tone: "watch" }, { from: 40, to: 60, tone: "bad" }]} />
            <BenchmarkBar label="Adjusted food cost" value={r.adjustedFoodCostPercent} max={60} reference="≤ 35%" zones={[{ from: 0, to: 35, tone: "good" }, { from: 35, to: 40, tone: "watch" }, { from: 40, to: 60, tone: "bad" }]} />
          </div>
        </div>
      </section>
      <section>
        <BlockTitle eyebrow="Scenario mode" title="What if you cut waste?" />
        <ScenarioPanel
          active={active}
          onReset={() => setSc({ wasteCut: 0, purchaseChange: 0 })}
          presets={[
            { label: "Cut waste 50%", onApply: () => setSc({ wasteCut: 50, purchaseChange: 0 }) },
            { label: "Supplier prices +5%", onApply: () => setSc({ wasteCut: 0, purchaseChange: 5 }) },
          ]}
          controls={
            <>
              <ScenarioSlider label="Reduce waste & spoilage by" value={sc.wasteCut} min={0} max={100} step={5} onChange={(v) => setSc({ ...sc, wasteCut: v })} format={(v) => `${v}%`} />
              <ScenarioSlider label="Supplier price change" value={sc.purchaseChange} min={-15} max={15} step={1} onChange={(v) => setSc({ ...sc, purchaseChange: v })} format={(v) => `${v > 0 ? "+" : ""}${v}%`} />
              <p className="rounded-xl bg-wash p-3 text-sm">Estimated monthly impact: <span className="tabular font-semibold">{formatINRSigned(r.cogs - s.cogs)}</span></p>
            </>
          }
          metrics={[
            { label: "COGS", current: r.cogs, scenario: s.cogs, format: "inr", better: "down" },
            { label: "Food cost %", current: r.foodCostPercent, scenario: s.foodCostPercent, format: "percent", better: "down" },
            { label: "Gross profit", current: r.grossProfit, scenario: s.grossProfit, format: "inr", better: "up" },
            { label: "Gross margin", current: r.grossMarginPercent, scenario: s.grossMarginPercent, format: "percent", better: "up" },
          ]}
        />
      </section>
      <InsightList insights={insights} />
    </>
  );
}
