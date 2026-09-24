"use client";

import dynamic from "next/dynamic";
import { Megaphone, SlidersHorizontal, Users, UtensilsCrossed } from "lucide-react";
import { useMemo, useState } from "react";
import { CurrencyField } from "@/components/forms/fields";
import { ScenarioSlider } from "@/components/forms/fields";
import { NumberInput } from "@/components/forms/inputs";
import { BenchmarkBar } from "@/components/charts/BenchmarkBar";
import { ChartSkeleton } from "@/components/charts/ChartSkeleton";
import { CircularScore } from "@/components/charts/CircularScore";
import { BlockTitle, CalculatorLayout, FieldGrid, InputGroup } from "@/components/calculators/shared/CalculatorLayout";
import { InsightList, type Insight } from "@/components/calculators/shared/InsightList";
import { MetricCard } from "@/components/calculators/shared/MetricCard";
import { ResultActions } from "@/components/calculators/shared/ResultActions";
import { ScenarioPanel } from "@/components/calculators/shared/ScenarioPanel";
import { SourceBar } from "@/components/calculators/shared/SourceBar";
import { StatusPill } from "@/components/ui/StatusPill";
import { Tabs } from "@/components/ui/Tabs";
import { BENCHMARK_NOTE, type Benchmarks } from "@/lib/calculations/benchmarks";
import { calculateHealth, simulateHealth, type HealthSimulation } from "@/lib/calculations/healthCalculator";
import { primeCostStatus } from "@/lib/calculations/primeCostCalculator";
import { HEALTH_DEFAULTS } from "@/lib/content/defaults";
import { formatINR, formatINRSigned, formatPercent, formatPoints } from "@/lib/formatters/number";
import { useCalculatorForm } from "@/lib/hooks/useCalculatorForm";
import { BENCH_KEY, parseBenchmarks, resetBenchmarks, saveBenchmarks } from "@/lib/storage/drafts";
import { useStorageRaw } from "@/lib/hooks/useStorageRaw";
import { healthSchema } from "@/lib/validators/schemas";
import type { ReportData } from "@/types/report";
import { CHART } from "@/lib/utils/colors";

const CostDonut = dynamic(() => import("@/components/charts/CostDonut"), { ssr: false, loading: () => <ChartSkeleton height={200} /> });

const SLUG = "restaurant-health-calculator";
const PATH = `/restaurant/${SLUG}`;
const NO_SIM: HealthSimulation = { foodCostChangePts: 0, salesChangePercent: 0, laborChangePercent: 0, marketingChangePercent: 0 };

export default function HealthCalculator() {
  const { control, values, source, loadValues, resetToExample, clearAll } = useCalculatorForm(SLUG, healthSchema, HEALTH_DEFAULTS);
  const [tab, setTab] = useState("food");
  const [sim, setSim] = useState<HealthSimulation>(NO_SIM);

  const benchRaw = useStorageRaw(BENCH_KEY);
  const bench = useMemo(() => parseBenchmarks(benchRaw), [benchRaw]);

  const r = useMemo(() => calculateHealth(values, bench), [values, bench]);
  const s = useMemo(() => simulateHealth(values, sim, bench), [values, sim, bench]);
  const prime = primeCostStatus(r.primeCostPercent, bench);
  const [food, labor, marketing] = r.metrics;
  const simActive = Object.values(sim).some((v) => v !== 0);

  const updateBench = (patch: Partial<Benchmarks>) => {
    saveBenchmarks({ ...bench, ...patch });
  };

  /* ----- explained impacts ----- */
  const foodExcess = r.foodCostPercent !== null ? r.foodCostPercent - bench.foodCostMax : null;
  const foodImpact =
    foodExcess !== null && foodExcess > 0
      ? `Estimated impact: ${formatINR((foodExcess / 100) * values.foodSales)}/month above the reference range. Reducing food cost by ${Math.ceil(foodExcess)} points could save about ${formatINR((Math.ceil(foodExcess) / 100) * values.foodSales)}/month.`
      : r.foodCostPercent !== null
        ? `Each 1-point change in food cost is worth about ${formatINR(values.foodSales / 100)}/month.`
        : undefined;
  const laborExcess = r.laborCostPercent !== null ? r.laborCostPercent - bench.laborMax : null;
  const laborImpact =
    laborExcess !== null && laborExcess > 0
      ? `About ${formatINR((laborExcess / 100) * values.monthlySales)}/month above the top of the reference range.`
      : r.laborCostPercent !== null
        ? `Each 1-point change in labor cost is worth about ${formatINR(values.monthlySales / 100)}/month.`
        : undefined;

  const insights: Insight[] = [];
  if (food.percent !== null) {
    if (food.tone !== "good") insights.push({ tone: food.tone, title: "Bring food cost back into range", body: "Check portion sizes on your top 10 dishes, compare three supplier quotes for your biggest items and start a daily waste log.", impact: foodExcess && foodExcess > 0 ? `Up to ${formatINR((foodExcess / 100) * values.foodSales)}/month` : undefined });
    else insights.push({ tone: "good", title: "Food cost is within the reference range", body: "Keep weekly stock counts so any rise shows up early." });
  }
  if (labor.percent !== null) {
    if (labor.percent > bench.laborMax) insights.push({ tone: labor.tone, title: "Match staffing to sales hours", body: "Compare hourly sales with your roster. Cut overlap in slow hours and cross-train staff to cover more than one role.", impact: laborExcess ? `About ${formatINR((laborExcess / 100) * values.monthlySales)}/month` : undefined });
    else if (labor.percent < bench.laborMin) insights.push({ tone: "watch", title: "Labor looks lean", body: "Low labor cost is good only if service holds up. Watch table turn times, reviews and staff turnover." });
  }
  if (marketing.percent !== null) {
    if (marketing.percent < bench.marketingMin) insights.push({ tone: "watch", title: "Marketing spend is light", body: "A steady, tracked budget keeps new guests coming. Start with your Google Business Profile, WhatsApp lists and repeat-customer offers." });
    else if (marketing.percent > bench.marketingMax) insights.push({ tone: marketing.tone, title: "Check marketing returns", body: "Work out cost per new customer for each channel and move budget to the ones that bring repeat guests." });
  }
  if (r.primeCostPercent !== null && r.primeCostPercent > bench.primeMax) insights.push({ tone: prime.tone, title: "Prime cost is above range", body: "Food and labor together leave too little for rent, utilities and profit. Work on the larger of the two first." });

  /* ----- report ----- */
  const report: ReportData = {
    calculator: SLUG,
    title: "Restaurant Health Report",
    headline: r.healthScore !== null ? `Health score ${r.healthScore}/100 (${r.grade?.label}) · Food ${formatPercent(r.foodCostPercent)} · Labor ${formatPercent(r.laborCostPercent)}` : "Health score not available yet",
    inputs: [
      { label: "Opening stock value", value: formatINR(values.openingStock) },
      { label: "Raw material purchases", value: formatINR(values.purchases) },
      { label: "Closing stock value", value: formatINR(values.closingStock) },
      { label: "Total food sales", value: formatINR(values.foodSales) },
      { label: "Total staff salaries", value: formatINR(values.staffSalaries) },
      { label: "Total monthly sales", value: formatINR(values.monthlySales) },
      { label: "Total marketing spend", value: formatINR(values.marketingSpend) },
    ],
    results: [
      { label: "Food consumed (COGS)", value: formatINR(r.cogs) },
      ...r.metrics.map((m) => ({ label: `${m.label} %`, value: `${formatPercent(m.percent)} (${m.status})` })),
      { label: "Prime cost %", value: formatPercent(r.primeCostPercent) },
      { label: "Health score", value: r.healthScore === null ? "—" : `${r.healthScore}/100 · ${r.grade?.label}` },
    ],
    chart: {
      title: "Cost as % of sales",
      bars: [
        { label: "Food cost", value: r.foodCostPercent ?? 0, display: formatPercent(r.foodCostPercent), tone: food.tone },
        { label: "Labor cost", value: r.laborCostPercent ?? 0, display: formatPercent(r.laborCostPercent), tone: labor.tone },
        { label: "Marketing", value: r.marketingPercent ?? 0, display: formatPercent(r.marketingPercent), tone: marketing.tone },
        { label: "Prime cost", value: r.primeCostPercent ?? 0, display: formatPercent(r.primeCostPercent), tone: prime.tone },
      ],
    },
    tables: [
      { title: "Health score breakdown", columns: ["Metric", "Value", "Score", "Weight"], rows: r.metrics.map((m) => [m.label, formatPercent(m.percent), m.score === null ? "—" : String(m.score), `${Math.round(m.weight * 100)}%`]) },
    ],
    assumptions: [
      "Food cost uses stock movement (opening + purchases − closing) divided by food sales.",
      "Labor and marketing are divided by total monthly sales.",
      "The health score weights food 45%, labor 35% and marketing 20%, using only the metrics entered.",
    ],
    benchmarks: [
      `Food cost ≤ ${bench.foodCostMax}%`,
      `Labor cost ${bench.laborMin}–${bench.laborMax}%`,
      `Marketing ${bench.marketingMin}–${bench.marketingMax}%`,
      `Prime cost ${bench.primeMin}–${bench.primeMax}%`,
      BENCHMARK_NOTE,
    ],
  };

  const remaining = Math.max(0, values.monthlySales - r.cogs - values.staffSalaries - values.marketingSpend);

  const inputs = (
    <>
      <SourceBar source={source} onExample={resetToExample} onClear={clearAll} />
      <Tabs
        idPrefix="health"
        value={tab}
        onChange={setTab}
        items={[
          { id: "food", label: "Food cost", meta: formatPercent(r.foodCostPercent) },
          { id: "labor", label: "Labor cost", meta: formatPercent(r.laborCostPercent) },
          { id: "marketing", label: "Marketing", meta: formatPercent(r.marketingPercent) },
        ]}
      />
      <div role="tabpanel" id="health-panel-food" aria-labelledby="health-tab-food" hidden={tab !== "food"}>
        <InputGroup title="Food cost" description="Use the same period for all four numbers, usually one month." icon={<UtensilsCrossed className="h-5 w-5" />}>
          <FieldGrid>
            <CurrencyField control={control} name="openingStock" label="Opening stock value" tooltip="Value of food inventory at the start of the period." />
            <CurrencyField control={control} name="purchases" label="Raw material purchases" tooltip="Total value of raw materials bought during the period." />
            <CurrencyField control={control} name="closingStock" label="Closing stock value" tooltip="Value of food inventory left at the end of the period." />
            <CurrencyField control={control} name="foodSales" label="Total food sales" tooltip="Revenue from food sales during the same period." />
          </FieldGrid>
        </InputGroup>
      </div>
      <div role="tabpanel" id="health-panel-labor" aria-labelledby="health-tab-labor" hidden={tab !== "labor"}>
        <InputGroup title="Labor cost" description="Monthly sales is shared with the Marketing tab." icon={<Users className="h-5 w-5" />}>
          <FieldGrid>
            <CurrencyField control={control} name="staffSalaries" label="Total staff salaries" tooltip="All salaries for the month, including overtime, bonuses, PF/ESI and other benefits." />
            <CurrencyField control={control} name="monthlySales" label="Total monthly sales" tooltip="Total restaurant revenue for the month, from all channels." />
          </FieldGrid>
        </InputGroup>
      </div>
      <div role="tabpanel" id="health-panel-marketing" aria-labelledby="health-tab-marketing" hidden={tab !== "marketing"}>
        <InputGroup title="Marketing cost" description="Monthly sales is shared with the Labor tab." icon={<Megaphone className="h-5 w-5" />}>
          <FieldGrid>
            <CurrencyField control={control} name="marketingSpend" label="Total marketing spend" tooltip="Ads, social media, influencer visits, promotions and printed material for the month." />
            <CurrencyField control={control} name="monthlySales" label="Total monthly sales" tooltip="Total restaurant revenue for the month, from all channels." />
          </FieldGrid>
        </InputGroup>
      </div>
      {r.errors.length ? (
        <div role="alert" className="rounded-xl border border-caution/30 bg-caution-soft px-4 py-3 text-sm text-ink">{r.errors.join(" ")}</div>
      ) : null}
      <details className="group rounded-2xl border border-line bg-card p-5 shadow-card [&_summary::-webkit-details-marker]:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium">
          <span className="flex items-center gap-2"><SlidersHorizontal className="h-4 w-4 text-muted" aria-hidden /> Reference benchmarks</span>
          <span className="text-xs text-muted group-open:hidden">Customise</span>
        </summary>
        <p className="mt-3 text-sm text-muted">{BENCHMARK_NOTE} Change them to fit your format. Your settings stay on this device.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {([
            ["foodCostMax", "Food cost max"],
            ["laborMin", "Labor min"],
            ["laborMax", "Labor max"],
            ["marketingMin", "Marketing min"],
            ["marketingMax", "Marketing max"],
            ["primeMax", "Prime cost max"],
          ] as [keyof Benchmarks, string][]).map(([k, label]) => (
            <label key={k} className="flex flex-col gap-1 text-xs font-medium text-muted">
              {label}
              <NumberInput value={bench[k]} onValueChange={(v) => updateBench({ [k]: Math.max(0, Math.min(100, v)) })} suffix="%" className="h-10" aria-label={label} />
            </label>
          ))}
        </div>
        <button type="button" className="mt-3 text-sm font-medium text-accent-dark hover:underline" onClick={() => resetBenchmarks()}>
          Restore defaults
        </button>
      </details>
    </>
  );

  const results = (
    <>
      <section className="print-break rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6" aria-label="Health score">
        <div className="flex items-center gap-5">
          <CircularScore value={r.healthScore} tone={r.grade?.tone ?? "neutral"} label="Health score" size={112} />
          <div className="min-w-0">
            <p className="eyebrow">Estimated health score</p>
            {r.grade ? (
              <>
                <p className="mt-1 text-2xl font-bold">{r.grade.label}</p>
                <StatusPill tone={r.grade.tone} className="mt-2">Grade {r.grade.letter}</StatusPill>
              </>
            ) : (
              <p className="mt-1 text-sm text-muted">Fill in at least one calculator to see your score.</p>
            )}
          </div>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">How the health score is calculated</caption>
            <thead className="text-left text-xs uppercase tracking-wider text-muted">
              <tr><th className="pb-2 font-semibold">Metric</th><th className="pb-2 text-right font-semibold">Value</th><th className="pb-2 text-right font-semibold">Score</th><th className="pb-2 text-right font-semibold">Weight</th></tr>
            </thead>
            <tbody className="divide-y divide-line">
              {r.metrics.map((m) => (
                <tr key={m.key}>
                  <th scope="row" className="py-2 text-left font-medium">{m.label}</th>
                  <td className="tabular py-2 text-right">{formatPercent(m.percent)}</td>
                  <td className="tabular py-2 text-right font-semibold">{m.score ?? "—"}</td>
                  <td className="tabular py-2 text-right text-muted">{Math.round(m.weight * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard label="Food cost" value={formatPercent(r.foodCostPercent)} tone={food.tone} reference={food.reference} status={food.status} impact={foodImpact} />
        <MetricCard label="Labor cost" value={formatPercent(r.laborCostPercent)} tone={labor.tone} reference={labor.reference} status={labor.status} impact={laborImpact} />
        <MetricCard label="Marketing" value={formatPercent(r.marketingPercent)} tone={marketing.tone} reference={marketing.reference} status={marketing.status} />
        <MetricCard label="Prime cost" value={formatPercent(r.primeCostPercent)} tone={prime.tone} reference={`${bench.primeMin}–${bench.primeMax}%`} status={r.primeCostPercent === null ? undefined : prime.status} sub="Food consumed + salaries, as % of sales" />
      </div>
      <ResultActions slug={SLUG} calculatorTitle="Restaurant Health" path={PATH} values={values} report={report} onReset={resetToExample} onLoad={(v) => loadValues(v)} />
    </>
  );

  return (
    <>
      <CalculatorLayout inputs={inputs} results={results} summary={{ label: "Health score", value: r.healthScore === null ? "—" : `${r.healthScore}/100 · ${r.grade?.label}`, tone: r.grade?.tone }} />

      <section className="print-break">
        <BlockTitle eyebrow="Visual analysis" title="Your current cost structure" description="Where each rupee of monthly sales goes, and how each cost compares with its reference range." />
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6">
            <CostDonut
              total={values.monthlySales}
              centerLabel="Monthly sales"
              centerValue={formatINR(values.monthlySales)}
              slices={[
                { name: "Food consumed", value: r.cogs, color: CHART.accent },
                { name: "Staff salaries", value: values.staffSalaries, color: CHART.c1 },
                { name: "Marketing", value: values.marketingSpend, color: CHART.c4 },
                { name: "Left for rent, bills & profit", value: remaining, color: CHART.good },
              ]}
            />
          </div>
          <div className="flex flex-col gap-5 rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6">
            <BenchmarkBar label={`Food cost · reference ≤ ${bench.foodCostMax}%`} value={r.foodCostPercent} max={60} reference={`≤ ${bench.foodCostMax}%`} zones={[{ from: 0, to: bench.foodCostMax, tone: "good" }, { from: bench.foodCostMax, to: bench.foodCostMax + 5, tone: "watch" }, { from: bench.foodCostMax + 5, to: 60, tone: "bad" }]} />
            <BenchmarkBar label={`Labor cost · reference ${bench.laborMin}–${bench.laborMax}%`} value={r.laborCostPercent} max={50} reference={`${bench.laborMin}–${bench.laborMax}%`} zones={[{ from: 0, to: bench.laborMin, tone: "watch" }, { from: bench.laborMin, to: bench.laborMax, tone: "good" }, { from: bench.laborMax, to: bench.laborMax + 10, tone: "watch" }, { from: bench.laborMax + 10, to: 50, tone: "bad" }]} />
            <BenchmarkBar label={`Marketing · reference ${bench.marketingMin}–${bench.marketingMax}%`} value={r.marketingPercent} max={10} reference={`${bench.marketingMin}–${bench.marketingMax}%`} zones={[{ from: 0, to: bench.marketingMin, tone: "watch" }, { from: bench.marketingMin, to: bench.marketingMax, tone: "good" }, { from: bench.marketingMax, to: bench.marketingMax + 2, tone: "watch" }, { from: bench.marketingMax + 2, to: 10, tone: "bad" }]} />
            <BenchmarkBar label={`Prime cost · reference ${bench.primeMin}–${bench.primeMax}%`} value={r.primeCostPercent} max={100} reference={`${bench.primeMin}–${bench.primeMax}%`} zones={[{ from: 0, to: bench.primeMax, tone: "good" }, { from: bench.primeMax, to: bench.primeMax + 5, tone: "watch" }, { from: bench.primeMax + 5, to: 100, tone: "bad" }]} />
          </div>
        </div>
      </section>

      <section>
        <BlockTitle eyebrow="Scenario simulator" title="What happens if…" description="Test a change before you make it. The numbers below are monthly estimates." />
        <ScenarioPanel
          active={simActive}
          onReset={() => setSim(NO_SIM)}
          presets={[
            { label: "Food cost −2 pts", onApply: () => setSim({ ...NO_SIM, foodCostChangePts: -2 }) },
            { label: "Sales +10%", onApply: () => setSim({ ...NO_SIM, salesChangePercent: 10 }) },
            { label: "Labor −5%", onApply: () => setSim({ ...NO_SIM, laborChangePercent: -5 }) },
            { label: "All three", onApply: () => setSim({ foodCostChangePts: -2, salesChangePercent: 10, laborChangePercent: -5, marketingChangePercent: 0 }) },
          ]}
          controls={
            <>
              <ScenarioSlider label="Food cost change" value={sim.foodCostChangePts} min={-10} max={10} step={0.5} onChange={(v) => setSim({ ...sim, foodCostChangePts: v })} format={(v) => formatPoints(v)} />
              <ScenarioSlider label="Sales change" value={sim.salesChangePercent} min={-30} max={30} step={1} onChange={(v) => setSim({ ...sim, salesChangePercent: v })} format={(v) => `${v > 0 ? "+" : ""}${v}%`} />
              <ScenarioSlider label="Salary bill change" value={sim.laborChangePercent} min={-30} max={30} step={1} onChange={(v) => setSim({ ...sim, laborChangePercent: v })} format={(v) => `${v > 0 ? "+" : ""}${v}%`} />
              <ScenarioSlider label="Marketing spend change" value={sim.marketingChangePercent} min={-50} max={100} step={5} onChange={(v) => setSim({ ...sim, marketingChangePercent: v })} format={(v) => `${v > 0 ? "+" : ""}${v}%`} />
              <div className="grid gap-2 rounded-xl bg-wash p-4 text-sm">
                <p className="flex justify-between gap-3"><span className="text-muted">Food cost saving</span><span className="tabular font-semibold">{formatINRSigned(s.foodCostSaving)}</span></p>
                <p className="flex justify-between gap-3"><span className="text-muted">Extra contribution from sales</span><span className="tabular font-semibold">{formatINRSigned(s.salesContribution)}</span></p>
                <p className="flex justify-between gap-3"><span className="text-muted">Salary saving</span><span className="tabular font-semibold">{formatINRSigned(s.laborSaving)}</span></p>
                <p className="flex justify-between gap-3"><span className="text-muted">Marketing saving</span><span className="tabular font-semibold">{formatINRSigned(s.marketingSaving)}</span></p>
                <p className="flex justify-between gap-3 border-t border-line-strong pt-2 font-semibold"><span>Estimated monthly impact</span><span className={s.totalMonthlyImpact >= 0 ? "tabular text-sage-dark" : "tabular text-danger"}>{formatINRSigned(s.totalMonthlyImpact)}</span></p>
              </div>
            </>
          }
          metrics={[
            { label: "Food cost %", current: r.foodCostPercent, scenario: s.scenario.foodCostPercent, format: "percent", better: "down" },
            { label: "Labor cost %", current: r.laborCostPercent, scenario: s.scenario.laborCostPercent, format: "percent", better: "down" },
            { label: "Marketing %", current: r.marketingPercent, scenario: s.scenario.marketingPercent, format: "percent", better: "neutral" },
            { label: "Prime cost %", current: r.primeCostPercent, scenario: s.scenario.primeCostPercent, format: "percent", better: "down" },
            { label: "Health score", current: r.healthScore, scenario: s.scenario.healthScore, format: "number", better: "up" },
            { label: "Monthly sales", current: values.monthlySales, scenario: values.monthlySales * (1 + sim.salesChangePercent / 100), format: "inr", better: "up" },
          ]}
        />
      </section>

      <InsightList insights={insights} />
    </>
  );
}
