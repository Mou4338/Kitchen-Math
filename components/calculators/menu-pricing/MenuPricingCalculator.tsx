"use client";

import { ChefHat, Smartphone, Target } from "lucide-react";
import { useMemo, useState } from "react";
import { CurrencyField, PercentField, ScenarioSlider, SliderField } from "@/components/forms/fields";
import { BlockTitle, CalculatorLayout, FieldGrid, InputGroup } from "@/components/calculators/shared/CalculatorLayout";
import { InsightList, type Insight } from "@/components/calculators/shared/InsightList";
import { StatementRow } from "@/components/calculators/shared/MetricCard";
import { ResultActions } from "@/components/calculators/shared/ResultActions";
import { ScenarioPanel } from "@/components/calculators/shared/ScenarioPanel";
import { SourceBar } from "@/components/calculators/shared/SourceBar";
import { StatusPill } from "@/components/ui/StatusPill";
import { AnimatedNumber } from "@/components/ui/Motion";
import { calculateMenuPrice, REDUCE_MESSAGE } from "@/lib/calculations/menuPricingCalculator";
import type { Tone } from "@/lib/calculations/utils";
import { MENU_PRICING_DEFAULTS } from "@/lib/content/defaults";
import { formatINR, formatPercent, formatPoints } from "@/lib/formatters/number";
import { useCalculatorForm } from "@/lib/hooks/useCalculatorForm";
import { menuPricingSchema } from "@/lib/validators/schemas";
import type { ReportData } from "@/types/report";

const SLUG = "menu-pricing-calculator";
const PATH = `/restaurant/${SLUG}`;

const marginTone = (m: number | null, target: number): Tone => (m === null ? "neutral" : m < 0 ? "bad" : m + 0.01 < target ? "watch" : "good");

export default function MenuPricingCalculator() {
  const { control, values, source, loadValues, resetToExample, clearAll } = useCalculatorForm(SLUG, menuPricingSchema, MENU_PRICING_DEFAULTS, ["taxPercent"]);
  const [sc, setSc] = useState({ cost: 0, commission: 0, discount: 0 });
  const r = useMemo(() => calculateMenuPrice(values), [values]);
  const scenario = useMemo(
    () =>
      calculateMenuPrice({
        ...values,
        dishCost: values.dishCost * (1 + sc.cost / 100),
        commissionPercent: Math.max(0, values.commissionPercent + sc.commission),
        discountPercent: Math.max(0, values.discountPercent + sc.discount),
      }),
    [values, sc],
  );
  const active = sc.cost !== 0 || sc.commission !== 0 || sc.discount !== 0;
  const blocked = r.errors.includes(REDUCE_MESSAGE);
  const tone = blocked ? "bad" : marginTone(r.check?.profitPercent ?? null, values.marginPercent);

  const insights: Insight[] = [];
  if (blocked) {
    insights.push({ tone: "bad", title: "No price can reach this margin", body: `Deductions (${formatPercent(r.totalDeductionsPercent)}) plus your ${formatPercent(values.marginPercent)} margin add up to 100% or more. Reduce the discount or the margin.` });
  } else if (r.menuPrice && r.check) {
    if (values.discountPercent > 0) {
      const noDisc = calculateMenuPrice({ ...values, discountPercent: 0 });
      if (noDisc.menuPrice && noDisc.menuPrice < r.menuPrice) insights.push({ tone: "watch", title: "The discount raises your menu price", body: `Without the ${formatPercent(values.discountPercent)} discount, the same margin needs only ${formatINR(noDisc.menuPrice)} instead of ${formatINR(r.menuPrice)}. Keep discounts for slow hours or first orders.` });
    }
    if (r.totalDeductionsPercent > 40) insights.push({ tone: "neutral", title: `${formatPercent(r.totalDeductionsPercent)} of the price goes to the platform`, body: "Commission, discount, ads and GST on them come out of every order. Negotiate commission and review ad spend against orders they bring." });
    insights.push({ tone: "good", title: "Never list below break-even", body: `At ${formatINR(r.breakEvenPrice, 2)} this dish earns ₹0 after deductions. Anything below loses money on every order.` });
  }

  const report: ReportData = {
    calculator: SLUG,
    title: "Menu Pricing Report",
    headline: blocked ? REDUCE_MESSAGE : `Menu price ${formatINR(r.menuPrice)} · Break-even ${formatINR(r.breakEvenPrice, 2)} · Total cost ${formatINR(r.totalCost, 2)}`,
    inputs: [
      { label: "Dish cost", value: formatINR(values.dishCost, 2) },
      { label: "Labour", value: formatINR(values.labourCost, 2) },
      { label: "PC (packaging)", value: formatINR(values.packagingCost, 2) },
      { label: "Commission", value: formatPercent(values.commissionPercent) },
      { label: "Tax", value: formatPercent(values.taxPercent) },
      { label: "Discount", value: formatPercent(values.discountPercent) },
      { label: "Ads", value: formatPercent(values.adsPercent) },
      { label: "Margin", value: formatPercent(values.marginPercent) },
    ],
    results: [
      { label: "Total cost", value: formatINR(r.totalCost, 2) },
      { label: "Total deductions %", value: formatPercent(r.totalDeductionsPercent, 2) },
      { label: "Break-even price", value: formatINR(r.breakEvenPrice, 2) },
      { label: "Exact price for margin", value: formatINR(r.exactPrice, 2) },
      { label: "Menu price (ends in 9)", value: blocked ? REDUCE_MESSAGE : formatINR(r.menuPrice) },
      { label: "Payout at menu price", value: formatINR(r.check?.payout ?? null, 2) },
      { label: "Profit per order", value: `${formatINR(r.check?.profit ?? null, 2)} (${formatPercent(r.check?.profitPercent ?? null)})` },
    ],
    chart: {
      title: "Price build-up",
      bars: [
        { label: "Total cost", value: r.totalCost, display: formatINR(r.totalCost, 2), tone: "neutral" },
        { label: "Break-even price", value: r.breakEvenPrice ?? 0, display: formatINR(r.breakEvenPrice, 2), tone: "accent" },
        { label: "Menu price", value: r.menuPrice ?? 0, display: formatINR(r.menuPrice), tone: "good" },
      ],
    },
    assumptions: [
      "Total cost = Dish cost + Labour + PC.",
      "Total deductions % = Commission% × (1 + Tax%) + Discount% + Ads% × (1 + Tax%).",
      "Break-even price = Total cost ÷ (1 − Total deductions %).",
      "Menu price = Total cost ÷ (1 − Total deductions % − Margin %), rounded up to end in 9.",
    ],
    benchmarks: [],
  };

  const inputs = (
    <>
      <SourceBar source={source} onExample={resetToExample} onClear={clearAll} />
      <InputGroup title="Cost per order" description="What it costs you to make and pack one order." icon={<ChefHat className="h-5 w-5" />}>
        <FieldGrid cols={3}>
          <CurrencyField control={control} name="dishCost" label="Dish cost" tooltip="All ingredients in one portion, including oil, garnish and gravy base." />
          <CurrencyField control={control} name="labourCost" label="Labour" tooltip="Labour cost you want each order to carry." />
          <CurrencyField control={control} name="packagingCost" label="PC (packaging)" tooltip="Box, bag, cutlery and seal for one order." />
        </FieldGrid>
      </InputGroup>
      <InputGroup title="Platform deductions" description="Tax (GST) is charged on commission and ads." icon={<Smartphone className="h-5 w-5" />}>
        <FieldGrid>
          <PercentField control={control} name="commissionPercent" label="Commission %" tooltip="Platform commission on the selling price." />
          <PercentField control={control} name="taxPercent" label="Tax %" tooltip="GST on commission and ads. Usually 18%." />
          <PercentField control={control} name="discountPercent" label="Discount %" tooltip="Average discount you fund, as a share of the selling price." />
          <PercentField control={control} name="adsPercent" label="Ads %" tooltip="Ad spend as a share of the selling price." />
        </FieldGrid>
      </InputGroup>
      <InputGroup title="Your margin" icon={<Target className="h-5 w-5" />}>
        <SliderField control={control} name="marginPercent" label="Margin %" tooltip="Profit you want to keep from each order, as a share of the menu price." min={0} max={60} step={0.5} />
      </InputGroup>
      {blocked ? <div role="alert" className="rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm font-medium text-danger">Total deductions ({formatPercent(r.totalDeductionsPercent)}) + margin ({formatPercent(values.marginPercent)}) is 100% or more. {REDUCE_MESSAGE}</div> : null}
    </>
  );

  const results = (
    <>
      <section className="flex flex-col rounded-2xl border border-accent/40 bg-inverse p-5 text-on-inverse shadow-card sm:p-6" aria-label="Menu price">
        <p className="eyebrow" style={{ color: "rgb(var(--on-inverse) / 0.6)" }}>Menu price</p>
        {blocked ? (
          <p className="mt-2 text-2xl font-bold text-danger">{REDUCE_MESSAGE}</p>
        ) : (
          <>
            <p className="tabular mt-1 text-5xl font-bold tracking-tight"><AnimatedNumber value={r.menuPrice} format={(v) => formatINR(v)} /></p>
            <p className="tabular mt-1 text-sm text-on-inverse/70">Exact {formatINR(r.exactPrice, 2)}, rounded up to end in 9</p>
          </>
        )}
        <div className="mt-4 divide-y divide-on-inverse/15 [&_span]:!text-on-inverse">
          <StatementRow label="Total cost (Dish + Labour + PC)" value={formatINR(r.totalCost, 2)} />
          <StatementRow label="Total deductions %" value={formatPercent(r.totalDeductionsPercent, 2)} />
          <StatementRow label="Break-even price" value={r.breakEvenPrice === null ? "—" : formatINR(r.breakEvenPrice, 2)} strong />
        </div>
        {!blocked && r.check ? <div className="mt-3"><StatusPill tone={tone}>{formatPercent(r.check.profitPercent)} profit at {formatINR(r.menuPrice)}</StatusPill></div> : null}
      </section>
      {r.check ? (
        <section className="rounded-2xl border border-line bg-card p-5 shadow-card" aria-label="Check at menu price">
          <h2 className="text-sm font-semibold">What {formatINR(r.menuPrice)} earns per order</h2>
          <div className="mt-2 divide-y divide-line">
            <StatementRow label="Discount" value={`−${formatINR(r.check.discount, 2)}`} />
            <StatementRow label="Commission" value={`−${formatINR(r.check.commission, 2)}`} />
            <StatementRow label="GST on commission" value={`−${formatINR(r.check.gstOnCommission, 2)}`} />
            <StatementRow label="Ads" value={`−${formatINR(r.check.ads, 2)}`} />
            <StatementRow label="GST on ads" value={`−${formatINR(r.check.gstOnAds, 2)}`} />
            <StatementRow label="Payout" value={formatINR(r.check.payout, 2)} />
            <StatementRow label="Total cost" value={`−${formatINR(r.check.totalCost, 2)}`} />
            <StatementRow label="Profit per order" value={`${formatINR(r.check.profit, 2)} · ${formatPercent(r.check.profitPercent)}`} tone={r.check.profit >= 0 ? "good" : "bad"} strong />
          </div>
        </section>
      ) : null}
      <ResultActions slug={SLUG} calculatorTitle="Menu Pricing" path={PATH} values={values} report={report} onReset={resetToExample} onLoad={(v) => loadValues(v)} />
    </>
  );

  return (
    <>
      <CalculatorLayout inputs={inputs} results={results} summary={{ label: "Menu price · Break-even", value: blocked ? REDUCE_MESSAGE : `${formatINR(r.menuPrice)} · ${formatINR(r.breakEvenPrice, 2)}`, tone: blocked ? "bad" : undefined }} />
      <section>
        <BlockTitle eyebrow="Scenario mode" title="What if costs or terms change?" />
        <ScenarioPanel
          active={active}
          onReset={() => setSc({ cost: 0, commission: 0, discount: 0 })}
          presets={[
            { label: "Dish cost +10%", onApply: () => setSc({ cost: 10, commission: 0, discount: 0 }) },
            { label: "Commission −3 pts", onApply: () => setSc({ cost: 0, commission: -3, discount: 0 }) },
            { label: "No discount", onApply: () => setSc({ cost: 0, commission: 0, discount: -values.discountPercent }) },
          ]}
          controls={
            <>
              <ScenarioSlider label="Dish cost change" value={sc.cost} min={-30} max={50} step={1} onChange={(v) => setSc({ ...sc, cost: v })} format={(v) => `${v > 0 ? "+" : ""}${v}%`} />
              <ScenarioSlider label="Commission change" value={sc.commission} min={-15} max={10} step={0.5} onChange={(v) => setSc({ ...sc, commission: v })} format={(v) => formatPoints(v)} />
              <ScenarioSlider label="Discount change" value={sc.discount} min={-30} max={20} step={0.5} onChange={(v) => setSc({ ...sc, discount: v })} format={(v) => formatPoints(v)} />
            </>
          }
          metrics={[
            { label: "Total cost", current: r.totalCost, scenario: scenario.totalCost, format: "inr", better: "down" },
            { label: "Break-even price", current: r.breakEvenPrice, scenario: scenario.breakEvenPrice, format: "inr", better: "down" },
            { label: "Menu price", current: r.menuPrice, scenario: scenario.menuPrice, format: "inr", better: "neutral" },
            { label: "Profit per order", current: r.check?.profit ?? null, scenario: scenario.check?.profit ?? null, format: "inr", better: "up" },
          ]}
        />
      </section>
      <InsightList insights={insights} title="Pricing insights" />
    </>
  );
}
