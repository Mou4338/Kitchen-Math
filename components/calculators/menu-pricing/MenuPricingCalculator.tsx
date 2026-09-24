"use client";

import { ChefHat, Smartphone, Target } from "lucide-react";
import { useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import { CurrencyField, PercentField, ScenarioSlider, SliderField } from "@/components/forms/fields";
import { BlockTitle, CalculatorLayout, FieldGrid, InputGroup } from "@/components/calculators/shared/CalculatorLayout";
import { InsightList, type Insight } from "@/components/calculators/shared/InsightList";
import { StatementRow } from "@/components/calculators/shared/MetricCard";
import { ResultActions } from "@/components/calculators/shared/ResultActions";
import { ScenarioPanel } from "@/components/calculators/shared/ScenarioPanel";
import { SourceBar } from "@/components/calculators/shared/SourceBar";
import { StatusPill } from "@/components/ui/StatusPill";
import { calculateMenuPrice, type ChannelPrice, type MenuPricingInputs, type RoundingMode } from "@/lib/calculations/menuPricingCalculator";
import type { Tone } from "@/lib/calculations/utils";
import { MENU_PRICING_DEFAULTS } from "@/lib/content/defaults";
import { formatINR, formatPercent, formatPoints } from "@/lib/formatters/number";
import { useCalculatorForm } from "@/lib/hooks/useCalculatorForm";
import { cn } from "@/lib/utils/cn";
import { menuPricingSchema, type MenuPricingForm } from "@/lib/validators/schemas";
import type { ReportData } from "@/types/report";
import { AnimatedNumber } from "@/components/ui/Motion";

const SLUG = "menu-pricing-calculator";
const PATH = `/restaurant/${SLUG}`;
export const ROUNDING_MODES: { mode: RoundingMode; label: string }[] = [
  { mode: "none", label: "Exact" },
  { mode: "9", label: "Ends in 9" },
  { mode: "5", label: "Nearest 5" },
  { mode: "10", label: "Nearest 10" },
];

function toInputs(v: MenuPricingForm): MenuPricingInputs {
  return { ...v, rounding: ROUNDING_MODES[Math.max(0, Math.min(3, Math.round(v.rounding)))].mode };
}

const marginTone = (m: number | null, target: number): Tone => (m === null ? "neutral" : m < 0 ? "bad" : m + 0.01 < target ? "watch" : "good");

function ChannelCard({ title, icon, c, target, gst, highlight }: { title: string; icon: React.ReactNode; c: ChannelPrice; target: number; gst: number; highlight?: boolean }) {
  const tone = marginTone(c.profitMarginPercent, target);
  return (
    <div className={cn("flex flex-col rounded-2xl border p-5 shadow-card", highlight ? "border-accent/40 bg-inverse text-on-inverse" : "border-line bg-card")}>
      <div className="flex items-center gap-2 text-sm font-medium opacity-80">{icon}{title}</div>
      <p className="eyebrow mt-3" style={highlight ? { color: "rgb(var(--on-inverse) / 0.6)" } : undefined}>Recommended price</p>
      <p className="tabular mt-1 text-4xl font-bold tracking-tight"><AnimatedNumber value={c.price} format={(v) => formatINR(v)} /></p>
      <p className={cn("tabular mt-1 text-sm", highlight ? "text-on-inverse/70" : "text-muted")}>{c.priceWithGst !== null ? `${formatINR(c.priceWithGst, 2)} with ${gst}% GST` : "Add costs to calculate"}</p>
      <div className={cn("mt-4 divide-y", highlight ? "divide-on-inverse/15 [&_span]:!text-on-inverse" : "divide-line")}>
        <StatementRow label="Minimum price (zero profit)" value={formatINR(c.minimumPrice, 2)} />
        <StatementRow label="Fees & discount" value={formatINR(c.deductions, 2)} />
        <StatementRow label="Food cost %" value={formatPercent(c.foodCostPercent)} />
        <StatementRow label="Expected profit / plate" value={formatINR(c.expectedProfit, 2)} strong />
      </div>
      <div className="mt-3"><StatusPill tone={tone}>{formatPercent(c.profitMarginPercent)} margin</StatusPill></div>
    </div>
  );
}

export default function MenuPricingCalculator() {
  const { control, values, source, loadValues, resetToExample, clearAll } = useCalculatorForm(SLUG, menuPricingSchema, MENU_PRICING_DEFAULTS, ["gstPercent", "rounding", "targetFoodCostPercent"]);
  const [sc, setSc] = useState({ ingredient: 0, commission: 0 });
  const r = useMemo(() => calculateMenuPrice(toInputs(values)), [values]);
  const scenario = useMemo(
    () => calculateMenuPrice(toInputs({ ...values, ingredientCost: values.ingredientCost * (1 + sc.ingredient / 100), commissionPercent: Math.max(0, values.commissionPercent + sc.commission) })),
    [values, sc],
  );
  const active = sc.ingredient !== 0 || sc.commission !== 0;

  const insights: Insight[] = [];
  if (r.online.price && r.dineIn.price) {
    insights.push({ tone: "neutral", title: "Keep a separate online menu", body: `To keep a ${formatPercent(values.targetProfitMarginPercent)} margin after platform fees, list this item ${formatPercent(r.onlineMarkupPercent, 0)} higher online.` });
  }
  if (r.priceFromMargin !== null && r.priceFromFoodCost !== null && r.priceFromMargin > r.priceFromFoodCost) {
    insights.push({ tone: "watch", title: "Prep cost is driving the price", body: "Your margin target, not food cost, sets this price. Batch prep or simplify the recipe to bring it down." });
  }
  if (r.dineIn.foodCostPercent !== null && r.dineIn.foodCostPercent < values.targetFoodCostPercent - 5) {
    insights.push({ tone: "good", title: "Room to compete on price", body: "Your food cost is well below target at this price. You could test a lower price or a larger portion." });
  }

  const report: ReportData = {
    calculator: SLUG,
    title: "Menu Pricing Report",
    headline: `Dine-in ${formatINR(r.dineIn.price)} · Online ${formatINR(r.online.price)} · Plate cost ${formatINR(r.plateCost, 2)}`,
    inputs: [
      { label: "Ingredient cost", value: formatINR(values.ingredientCost, 2) },
      { label: "Prep / labor cost", value: formatINR(values.prepLaborCost, 2) },
      { label: "Packaging cost (online)", value: formatINR(values.packagingCost, 2) },
      { label: "Target food cost", value: formatPercent(values.targetFoodCostPercent) },
      { label: "Target profit margin", value: formatPercent(values.targetProfitMarginPercent) },
      { label: "Platform commission", value: formatPercent(values.commissionPercent) },
      { label: "Payment gateway", value: formatPercent(values.gatewayPercent) },
      { label: "Discount", value: formatPercent(values.discountPercent) },
      { label: "GST", value: formatPercent(values.gstPercent) },
      { label: "Rounding", value: ROUNDING_MODES[values.rounding]?.label ?? "Ends in 9" },
    ],
    results: [
      { label: "Recommended dine-in price", value: formatINR(r.dineIn.price) },
      { label: "Dine-in price with GST", value: formatINR(r.dineIn.priceWithGst, 2) },
      { label: "Dine-in profit / plate", value: `${formatINR(r.dineIn.expectedProfit, 2)} (${formatPercent(r.dineIn.profitMarginPercent)})` },
      { label: "Recommended online price", value: formatINR(r.online.price) },
      { label: "Online minimum price", value: formatINR(r.online.minimumPrice, 2) },
      { label: "Online profit / order", value: `${formatINR(r.online.expectedProfit, 2)} (${formatPercent(r.online.profitMarginPercent)})` },
      { label: "Online markup vs dine-in", value: formatPercent(r.onlineMarkupPercent, 0) },
    ],
    chart: {
      title: "Dine-in vs online",
      bars: [
        { label: "Dine-in price", value: r.dineIn.price ?? 0, display: formatINR(r.dineIn.price), tone: "neutral" },
        { label: "Online price", value: r.online.price ?? 0, display: formatINR(r.online.price), tone: "accent" },
        { label: "Dine-in profit", value: r.dineIn.expectedProfit ?? 0, display: formatINR(r.dineIn.expectedProfit, 2), tone: "good" },
        { label: "Online profit", value: r.online.expectedProfit ?? 0, display: formatINR(r.online.expectedProfit, 2), tone: "good" },
      ],
    },
    assumptions: ["Prices are before GST.", "Online fees = commission × 1.18 (GST) + gateway + discount, all on the listed price.", "Packaging applies to online orders only."],
    benchmarks: ["Many restaurants target 28–35% food cost (indicative)."],
  };

  const inputs = (
    <>
      <SourceBar source={source} onExample={resetToExample} onClear={clearAll} />
      <InputGroup title="Plate cost" description="Cost to make one portion." icon={<ChefHat className="h-5 w-5" />}>
        <FieldGrid cols={3}>
          <CurrencyField control={control} name="ingredientCost" label="Ingredient cost" tooltip="Every ingredient in one portion, including oil, garnish and gravy base." />
          <CurrencyField control={control} name="prepLaborCost" label="Prep / labor cost" tooltip="Optional. Labor or fuel cost you want each plate to carry." />
          <CurrencyField control={control} name="packagingCost" label="Packaging cost" tooltip="Box, bag, cutlery and seal for one delivery order." />
        </FieldGrid>
      </InputGroup>
      <InputGroup title="Targets" icon={<Target className="h-5 w-5" />}>
        <div className="flex flex-col gap-5">
          <SliderField control={control} name="targetFoodCostPercent" label="Target food cost" tooltip="Share of the price that ingredients should cost. 28–35% is common." min={10} max={60} step={0.5} />
          <SliderField control={control} name="targetProfitMarginPercent" label="Target profit margin" tooltip="Profit you want left after plate cost (and fees, online), as a share of price." min={0} max={70} step={0.5} />
          <Controller
            control={control}
            name="rounding"
            render={({ field }) => (
              <fieldset>
                <legend className="text-sm font-medium">Price ending</legend>
                <div className="mt-2 grid grid-cols-2 gap-1 rounded-xl bg-wash p-1 sm:grid-cols-4">
                  {ROUNDING_MODES.map((m, i) => (
                    <button key={m.mode} type="button" aria-pressed={field.value === i} onClick={() => field.onChange(i)} className={cn("h-10 rounded-lg text-sm font-medium", field.value === i ? "bg-card text-ink shadow-card" : "text-muted hover:text-ink")}>
                      {m.label}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
          />
        </div>
      </InputGroup>
      <InputGroup title="Online fees & tax" icon={<Smartphone className="h-5 w-5" />}>
        <FieldGrid>
          <PercentField control={control} name="commissionPercent" label="Platform commission" tooltip="18% GST on commission is added automatically." />
          <PercentField control={control} name="gatewayPercent" label="Payment gateway" />
          <PercentField control={control} name="discountPercent" label="Discount %" tooltip="Average discount you fund on online orders." />
          <PercentField control={control} name="gstPercent" label="GST / tax on bill" tooltip="GST charged to the customer. 5% for most restaurants." />
        </FieldGrid>
      </InputGroup>
      {r.errors.length ? <div role="alert" className="rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm font-medium text-danger">{r.errors.join(" ")}</div> : null}
    </>
  );

  const results = (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <ChannelCard title="Dine-in" icon={<ChefHat className="h-4 w-4" aria-hidden />} c={r.dineIn} target={values.targetProfitMarginPercent} gst={values.gstPercent} highlight />
        <ChannelCard title="Online" icon={<Smartphone className="h-4 w-4" aria-hidden />} c={r.online} target={values.targetProfitMarginPercent} gst={values.gstPercent} />
      </div>
      <section className="rounded-2xl border border-line bg-card p-5 shadow-card" aria-label="How the price was set">
        <h2 className="text-sm font-semibold">How the dine-in price was set</h2>
        <div className="mt-2 divide-y divide-line">
          <StatementRow label="Plate cost (ingredients + prep)" value={formatINR(r.plateCost, 2)} />
          <StatementRow label={`Price for ${formatPercent(values.targetFoodCostPercent)} food cost`} value={formatINR(r.priceFromFoodCost, 2)} />
          <StatementRow label={`Price for ${formatPercent(values.targetProfitMarginPercent)} margin`} value={formatINR(r.priceFromMargin, 2)} />
          <StatementRow label="Higher of the two, rounded up" value={formatINR(r.dineIn.price)} strong />
        </div>
      </section>
      <ResultActions slug={SLUG} calculatorTitle="Menu Pricing" path={PATH} values={values} report={report} onReset={resetToExample} onLoad={(v) => loadValues(v)} />
    </>
  );

  return (
    <>
      <CalculatorLayout inputs={inputs} results={results} summary={{ label: "Dine-in · Online", value: `${formatINR(r.dineIn.price)} · ${formatINR(r.online.price)}` }} />
      <section>
        <BlockTitle eyebrow="Scenario mode" title="What if costs or commission change?" />
        <ScenarioPanel
          active={active}
          onReset={() => setSc({ ingredient: 0, commission: 0 })}
          presets={[
            { label: "Ingredients +10%", onApply: () => setSc({ ingredient: 10, commission: 0 }) },
            { label: "Commission −3 pts", onApply: () => setSc({ ingredient: 0, commission: -3 }) },
          ]}
          controls={
            <>
              <ScenarioSlider label="Ingredient cost change" value={sc.ingredient} min={-30} max={50} step={1} onChange={(v) => setSc({ ...sc, ingredient: v })} format={(v) => `${v > 0 ? "+" : ""}${v}%`} />
              <ScenarioSlider label="Commission change" value={sc.commission} min={-15} max={10} step={0.5} onChange={(v) => setSc({ ...sc, commission: v })} format={(v) => formatPoints(v)} />
            </>
          }
          metrics={[
            { label: "Plate cost", current: r.plateCost, scenario: scenario.plateCost, format: "inr", better: "down" },
            { label: "Dine-in price", current: r.dineIn.price, scenario: scenario.dineIn.price, format: "inr", better: "neutral" },
            { label: "Online price", current: r.online.price, scenario: scenario.online.price, format: "inr", better: "neutral" },
            { label: "Dine-in profit / plate", current: r.dineIn.expectedProfit, scenario: scenario.dineIn.expectedProfit, format: "inr", better: "up" },
            { label: "Online profit / order", current: r.online.expectedProfit, scenario: scenario.online.expectedProfit, format: "inr", better: "up" },
          ]}
        />
      </section>
      <InsightList insights={insights} title="Pricing insights" />
    </>
  );
}
