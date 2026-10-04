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
import { calculateMenuPrice, NO_PRICE_MESSAGE } from "@/lib/calculations/menuPricingCalculator";
import { GST_ON_COMMISSION_PERCENT } from "@/lib/calculations/onlinePayoutCalculator";
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
  const { control, values, source, loadValues, resetToExample, clearAll } = useCalculatorForm(SLUG, menuPricingSchema, MENU_PRICING_DEFAULTS);
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
  const blocked = r.errors.includes(NO_PRICE_MESSAGE);
  const c = r.check;
  const tone = blocked ? "bad" : marginTone(c?.profitPercent ?? null, values.marginPercent);

  const insights: Insight[] = [];
  if (blocked) {
    insights.push({ tone: "bad", title: "No price can reach this margin", body: "After discount, commission with 18% GST, and ads, each rupee of price keeps too little to cover your cost and this margin. Lower the discount, ads or margin." });
  } else if (r.recommendedPrice && c) {
    if (values.discountPercent > 0) {
      const noDisc = calculateMenuPrice({ ...values, discountPercent: 0 });
      if (noDisc.recommendedPrice && noDisc.recommendedPrice < r.recommendedPrice) insights.push({ tone: "watch", title: "The discount raises your menu price", body: `Without the ${formatPercent(values.discountPercent)} discount, the same margin needs only ${formatINR(noDisc.recommendedPrice, 2)} instead of ${formatINR(r.recommendedPrice, 2)}. Keep discounts for slow hours or first orders.` });
    }
    insights.push({ tone: "neutral", title: `You keep ${formatPercent(r.breakEvenFactor * 100)} of each rupee of price`, body: "That's what's left of the selling price after discount, commission + 18% GST, and ads. It's the number every price is divided by." });
    insights.push({ tone: "good", title: "Never list below break-even", body: `At ${formatINR(r.breakEvenPrice, 2)} this dish earns ₹0 after deductions and costs. Any lower and every order loses money.` });
  }

  const report: ReportData = {
    calculator: SLUG,
    title: "Menu Pricing Report",
    headline: blocked ? NO_PRICE_MESSAGE : `Recommended price ${formatINR(r.recommendedPrice, 2)} · Break-even ${formatINR(r.breakEvenPrice, 2)} · Total cost ${formatINR(r.totalCost, 2)}`,
    inputs: [
      { label: "Dish cost", value: formatINR(values.dishCost, 2) },
      { label: "Labour", value: formatINR(values.labourCost, 2) },
      { label: "Packaging cost (yours)", value: formatINR(values.packagingCost, 2) },
      { label: "Packaging charge to customer", value: formatINR(values.packagingCharge, 2) },
      { label: "Discount", value: formatPercent(values.discountPercent) },
      { label: "Commission", value: formatPercent(values.commissionPercent) },
      { label: "GST on commission", value: `${GST_ON_COMMISSION_PERCENT}% (fixed)` },
      { label: "Ads", value: formatPercent(values.adsPercent) },
      { label: "Target margin", value: formatPercent(values.marginPercent) },
    ],
    results: [
      { label: "Total cost", value: formatINR(r.totalCost, 2) },
      { label: "Break-even price (0% margin)", value: formatINR(r.breakEvenPrice, 2) },
      { label: "Recommended price (target margin)", value: blocked ? NO_PRICE_MESSAGE : formatINR(r.recommendedPrice, 2) },
      { label: "Expected payout", value: formatINR(c?.payout ?? null, 2) },
      { label: "Expected profit", value: `${formatINR(c?.profit ?? null, 2)} (${formatPercent(c?.profitPercent ?? null)})` },
    ],
    chart: {
      title: "Price build-up",
      bars: [
        { label: "Total cost", value: r.totalCost, display: formatINR(r.totalCost, 2), tone: "neutral" },
        { label: "Break-even price", value: r.breakEvenPrice ?? 0, display: formatINR(r.breakEvenPrice, 2), tone: "accent" },
        { label: "Recommended price", value: r.recommendedPrice ?? 0, display: formatINR(r.recommendedPrice, 2), tone: "good" },
      ],
    },
    assumptions: [
      "Total cost = Dish cost + Labour + Packaging cost.",
      "factor = (1 − Discount) × (1 − Ads − 1.18 × Commission) − Margin.",
      "Price = Total cost ÷ factor (break-even uses Margin = 0). Prices are exact, not rounded.",
      "GST paid by the customer on food is not counted: the platform collects and pays it, so the restaurant never receives it.",
      "Payout and profit at that price use the Online Payout formula.",
    ],
    benchmarks: [],
  };

  const inputs = (
    <>
      <SourceBar source={source} onExample={resetToExample} onClear={clearAll} />
      <InputGroup title="Your cost per order" description="What it costs you to make and pack one order." icon={<ChefHat className="h-5 w-5" />}>
        <FieldGrid cols={3}>
          <CurrencyField control={control} name="dishCost" label="Dish cost" tooltip="All ingredients in one portion, including oil, garnish and gravy base." />
          <CurrencyField control={control} name="labourCost" label="Labour" tooltip="Labour cost you want each order to carry." />
          <CurrencyField control={control} name="packagingCost" label="Packaging cost" tooltip="Your cost of the box, bag and cutlery. Not what you charge the customer." />
        </FieldGrid>
      </InputGroup>
      <InputGroup title="Platform terms" description={`GST on commission is fixed at ${GST_ON_COMMISSION_PERCENT}% and added automatically.`} icon={<Smartphone className="h-5 w-5" />}>
        <FieldGrid>
          <PercentField control={control} name="discountPercent" label="Discount %" tooltip="Promo and other discounts you fund, combined, as a share of the selling price." />
          <PercentField control={control} name="commissionPercent" label="Commission %" tooltip="Your platform commission rate. Restaurants pay anywhere from about 9% to 25%." />
          <PercentField control={control} name="adsPercent" label="Ads %" tooltip="Ad spend as a share of the commissionable value." />
          <CurrencyField control={control} name="packagingCharge" label="Packaging charge to customer" tooltip="What the customer pays for packaging, if anything. Often ₹0." />
        </FieldGrid>
      </InputGroup>
      <InputGroup title="Your margin" icon={<Target className="h-5 w-5" />}>
        <SliderField control={control} name="marginPercent" label="Target margin %" tooltip="Profit you want to keep from each order, as a share of the selling price." min={0} max={60} step={0.5} />
      </InputGroup>
      {blocked ? <div role="alert" className="rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm font-medium text-danger">{NO_PRICE_MESSAGE}</div> : null}
    </>
  );

  const results = (
    <>
      <section className="flex flex-col rounded-2xl border border-accent/40 bg-inverse p-5 text-on-inverse shadow-card sm:p-6" aria-label="Recommended price">
        <p className="eyebrow" style={{ color: "rgb(var(--on-inverse) / 0.6)" }}>Recommended price</p>
        {blocked ? (
          <p className="mt-2 text-xl font-bold text-danger">{NO_PRICE_MESSAGE}</p>
        ) : (
          <>
            <p className="tabular mt-1 text-5xl font-bold tracking-tight"><AnimatedNumber value={r.recommendedPrice} format={(v) => formatINR(v, 2)} /></p>
            <p className="tabular mt-1 text-sm text-on-inverse/70">The price that keeps exactly a {formatPercent(values.marginPercent)} margin</p>
          </>
        )}
        <div className="mt-4 divide-y divide-on-inverse/15 [&_span]:!text-on-inverse">
          <StatementRow label="Total cost (Dish + Labour + Packaging)" value={formatINR(r.totalCost, 2)} />
          <StatementRow label="Break-even price (0% margin)" value={r.breakEvenPrice === null ? "—" : formatINR(r.breakEvenPrice, 2)} strong />
        </div>
        {!blocked && c ? <div className="mt-3"><StatusPill tone={tone}>{formatPercent(c.profitPercent)} profit at {formatINR(r.recommendedPrice, 2)}</StatusPill></div> : null}
      </section>
      {c ? (
        <section className="rounded-2xl border border-line bg-card p-5 shadow-card" aria-label="Check at recommended price">
          <h2 className="text-sm font-semibold">What {formatINR(r.recommendedPrice, 2)} earns per order</h2>
          <div className="mt-2 divide-y divide-line">
            <StatementRow label="Discount" value={`−${formatINR(c.discount, 2)}`} />
            {c.packagingCharge > 0 ? <StatementRow label="Packaging charge" value={`+${formatINR(c.packagingCharge, 2)}`} /> : null}
            <StatementRow label="Commissionable value" value={formatINR(c.cv, 2)} />
            <StatementRow label="Commission" value={`−${formatINR(c.commission, 2)}`} />
            <StatementRow label={`GST on commission (${GST_ON_COMMISSION_PERCENT}%)`} value={`−${formatINR(c.gstOnCommission, 2)}`} />
            <StatementRow label="Ads" value={`−${formatINR(c.ads, 2)}`} />
            <StatementRow label="Expected payout" value={formatINR(c.payout, 2)} strong />
            <StatementRow label="Total cost" value={`−${formatINR(c.totalCost, 2)}`} />
            <StatementRow label="Expected profit" value={`${formatINR(c.profit, 2)} · ${formatPercent(c.profitPercent)}`} tone={c.profit >= 0 ? "good" : "bad"} strong />
          </div>
        </section>
      ) : null}
      <ResultActions slug={SLUG} calculatorTitle="Menu Pricing" path={PATH} values={values} report={report} onReset={resetToExample} onLoad={(v) => loadValues(v)} />
    </>
  );

  return (
    <>
      <CalculatorLayout inputs={inputs} results={results} summary={{ label: "Recommended · Break-even", value: blocked ? "No price works" : `${formatINR(r.recommendedPrice, 2)} · ${formatINR(r.breakEvenPrice, 2)}`, tone: blocked ? "bad" : undefined }} />
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
            { label: "Recommended price", current: r.recommendedPrice, scenario: scenario.recommendedPrice, format: "inr", better: "neutral" },
            { label: "Expected profit", current: c?.profit ?? null, scenario: scenario.check?.profit ?? null, format: "inr", better: "up" },
          ]}
        />
      </section>
      <InsightList insights={insights} title="Pricing insights" />
    </>
  );
}
