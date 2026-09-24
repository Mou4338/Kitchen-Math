"use client";

import { BadgePercent, CalendarDays, Receipt, Store } from "lucide-react";
import { useMemo, useState } from "react";
import { CurrencyField, NumberField, ScenarioSlider, SliderField } from "@/components/forms/fields";
import { NumberInput } from "@/components/forms/inputs";
import { Waterfall } from "@/components/charts/Waterfall";
import { BlockTitle, CalculatorLayout, FieldGrid, InputGroup } from "@/components/calculators/shared/CalculatorLayout";
import { InsightList, type Insight } from "@/components/calculators/shared/InsightList";
import { MetricCard, StatementRow } from "@/components/calculators/shared/MetricCard";
import { ResultActions } from "@/components/calculators/shared/ResultActions";
import { ScenarioPanel } from "@/components/calculators/shared/ScenarioPanel";
import { SourceBar } from "@/components/calculators/shared/SourceBar";
import { StatusPill } from "@/components/ui/StatusPill";
import { calculateOnlinePayout, compareChannels, DEFAULT_CHANNELS, simulateMonthly, type ChannelConfig } from "@/lib/calculations/onlinePayoutCalculator";
import type { Tone } from "@/lib/calculations/utils";
import { ONLINE_PAYOUT_DEFAULTS } from "@/lib/content/defaults";
import { formatINR, formatINRCompact, formatPercent, formatPoints } from "@/lib/formatters/number";
import { useCalculatorForm } from "@/lib/hooks/useCalculatorForm";
import { cn } from "@/lib/utils/cn";
import { onlinePayoutSchema } from "@/lib/validators/schemas";
import type { ReportData } from "@/types/report";
import { AnimatedNumber } from "@/components/ui/Motion";

const SLUG = "online-sale-payout-calculator";
const PATH = `/restaurant/${SLUG}`;

interface PayoutScenario {
  commission: number;
  discount: number;
  ads: number;
  food: number;
}
const NO_SC: PayoutScenario = { commission: 0, discount: 0, ads: 0, food: 0 };

const profitTone = (p: number | null): Tone => (p === null ? "neutral" : p < 0 ? "bad" : p < 10 ? "watch" : "good");

export default function OnlinePayoutCalculator() {
  const { control, values, source, loadValues, resetToExample, clearAll } = useCalculatorForm(SLUG, onlinePayoutSchema, ONLINE_PAYOUT_DEFAULTS, ["daysPerMonth"]);
  const [channels, setChannels] = useState<ChannelConfig[]>(DEFAULT_CHANNELS);
  const [sc, setSc] = useState<PayoutScenario>(NO_SC);

  const rates = {
    commissionPercent: values.commissionPercent,
    gatewayPercent: values.gatewayPercent,
    discountPercent: values.discountPercent,
    adsPercent: values.adsPercent,
    foodCostPercent: values.foodCostPercent,
  };
  const r = calculateOnlinePayout({ ...rates, orderValue: values.orderValue });
  const monthly = simulateMonthly(rates, { ordersPerDay: values.ordersPerDay, averageOrderValue: values.averageOrderValue, daysPerMonth: values.daysPerMonth });
  const comparison = useMemo(() => compareChannels(values.orderValue, values.foodCostPercent, channels), [values.orderValue, values.foodCostPercent, channels]);

  const scRates = {
    commissionPercent: Math.max(0, values.commissionPercent + sc.commission),
    gatewayPercent: values.gatewayPercent,
    discountPercent: Math.max(0, values.discountPercent + sc.discount),
    adsPercent: Math.max(0, values.adsPercent + sc.ads),
    foodCostPercent: Math.max(0, values.foodCostPercent + sc.food),
  };
  const s = calculateOnlinePayout({ ...scRates, orderValue: values.orderValue });
  const sMonthly = simulateMonthly(scRates, { ordersPerDay: values.ordersPerDay, averageOrderValue: values.averageOrderValue, daysPerMonth: values.daysPerMonth });
  const active = Object.values(sc).some((v) => v !== 0);

  const tone = profitTone(r.profitPercent);
  const direct = comparison.find((c) => c.id === "direct");
  const directGap = direct ? direct.result.profit - r.profit : null;

  const insights: Insight[] = [];
  if (r.orderValue > 0) {
    if (r.profit < 0) insights.push({ tone: "bad", title: "This order loses money", body: "Deductions are larger than the sale. Lower the discount, cut ad spend or raise the online price." });
    if (values.discountPercent > 0) insights.push({ tone: "watch", title: "Save discounts for slow hours", body: `Your ${formatPercent(values.discountPercent)} discount costs ${formatINR(r.discount, 2)} on this order. Running it only in off-peak hours protects peak-hour profit.`, impact: monthly.gmv > 0 ? `${formatINR(monthly.discounts / 2)}/month if half your orders skip the discount` : undefined });
    if (values.commissionPercent > 0) insights.push({ tone: "neutral", title: "Negotiate your commission", body: `Each 1 point of commission (plus 18% GST) costs ${formatINR(monthly.gmv * 0.0118)} a month at your volume.` });
    if (directGap !== null && directGap > 0) insights.push({ tone: "good", title: "Grow direct orders", body: `A direct order of the same value keeps about ${formatINR(directGap, 2)} more. A card in every bag and a WhatsApp ordering number help regulars switch.` });
  }

  const report: ReportData = {
    calculator: SLUG,
    title: "Online Order Payout Report",
    headline: `On a ${formatINR(r.orderValue)} order: payout ${formatINR(r.payout, 2)}, true profit ${formatINR(r.profit, 2)} (${formatPercent(r.profitPercent)})`,
    inputs: [
      { label: "Order value", value: formatINR(values.orderValue, 2) },
      { label: "Commission", value: formatPercent(values.commissionPercent) },
      { label: "GST on commission", value: "18%" },
      { label: "Payment gateway", value: formatPercent(values.gatewayPercent) },
      { label: "Discount", value: formatPercent(values.discountPercent) },
      { label: "Ads / marketing", value: formatPercent(values.adsPercent) },
      { label: "Food making cost", value: formatPercent(values.foodCostPercent) },
      { label: "Orders per day", value: String(values.ordersPerDay) },
      { label: "Average order value", value: formatINR(values.averageOrderValue) },
      { label: "Days per month", value: String(values.daysPerMonth) },
    ],
    results: [
      ...r.waterfall.map((w) => ({ label: w.label, value: w.kind === "deduction" ? `−${formatINR(-w.amount, 2)}` : formatINR(w.amount, 2) })),
      { label: "Profit %", value: formatPercent(r.profitPercent) },
      { label: "Monthly GMV", value: formatINR(monthly.gmv) },
      { label: "Monthly payout", value: formatINR(monthly.payout) },
      { label: "Monthly estimated profit", value: formatINR(monthly.profit) },
      { label: "Monthly platform fees (commission + GST + gateway)", value: formatINR(monthly.platformFees) },
    ],
    chart: {
      title: "Where the order value goes",
      bars: r.waterfall.filter((w) => w.kind === "deduction" || w.kind === "result").map((w) => ({ label: w.label, value: Math.abs(w.amount), display: formatINR(w.amount, 2), tone: w.kind === "result" ? (w.amount >= 0 ? "good" : "bad") : "accent" })),
    },
    tables: [{ title: "Channel comparison", columns: ["Channel", "Commission", "Payout", "Profit", "Profit %"], rows: comparison.map((c) => [c.name, formatPercent(c.commissionPercent), formatINR(c.result.payout, 2), formatINR(c.result.profit, 2), formatPercent(c.result.profitPercent)]) }],
    assumptions: ["All percentages apply to the order value.", "GST at 18% applies to the commission amount only.", "Monthly figures use orders per day × average order value × days."],
    benchmarks: ["Many operators aim for 10–15% true profit per delivery order (indicative)."],
  };

  const inputs = (
    <>
      <SourceBar source={source} onExample={resetToExample} onClear={clearAll} />
      <InputGroup title="Expected sale" icon={<Receipt className="h-5 w-5" />}>
        <CurrencyField control={control} name="orderValue" label="Expected sale amount" tooltip="The order value or bill amount shown on the platform, before any deductions." />
      </InputGroup>
      <InputGroup title="Platform deductions" description="GST on commission is fixed at 18% by law and applied automatically." icon={<Store className="h-5 w-5" />}>
        <div className="flex flex-col gap-5">
          <SliderField control={control} name="commissionPercent" label="Commission" tooltip="Platform commission on the order value. Typical range 20–30%." min={0} max={40} step={0.5} />
          <SliderField control={control} name="gatewayPercent" label="Payment gateway charges" tooltip="Payment processing fee on the order value." min={0} max={5} step={0.1} />
        </div>
      </InputGroup>
      <InputGroup title="Discount, marketing & food" icon={<BadgePercent className="h-5 w-5" />}>
        <div className="flex flex-col gap-5">
          <SliderField control={control} name="discountPercent" label="Discount offered" tooltip="Discount you fund, such as a 'flat 10% off' promo." min={0} max={50} step={0.5} />
          <SliderField control={control} name="adsPercent" label="Ads / marketing spend" tooltip="Sponsored listing or ad spend as a share of order value." min={0} max={30} step={0.5} />
          <SliderField control={control} name="foodCostPercent" label="Food making cost (raw material + prep)" tooltip="Cost of ingredients and preparation as a share of order value." min={0} max={70} step={0.5} />
        </div>
      </InputGroup>
      <InputGroup title="Monthly simulation" description="Estimate a full month of online orders." icon={<CalendarDays className="h-5 w-5" />}>
        <FieldGrid cols={3}>
          <NumberField control={control} name="ordersPerDay" label="Orders / day" suffix="orders" />
          <CurrencyField control={control} name="averageOrderValue" label="Average order value" />
          <NumberField control={control} name="daysPerMonth" label="Days / month" suffix="days" />
        </FieldGrid>
      </InputGroup>
    </>
  );

  const results = (
    <>
      <section className="print-break rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6" aria-label="Order waterfall">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="eyebrow">You actually keep</p>
            <p className={cn("tabular mt-1 text-4xl font-bold tracking-tight", tone === "bad" ? "text-danger" : "text-ink")}><AnimatedNumber value={r.profit} format={(v) => formatINR(v, 2)} /></p>
            <p className="tabular mt-1 text-sm text-muted">Payout to your bank {formatINR(r.payout, 2)} ({formatPercent(r.payoutPercent)})</p>
          </div>
          <StatusPill tone={tone}>{formatPercent(r.profitPercent)} profit</StatusPill>
        </div>
        <Waterfall steps={r.waterfall} decimals={2} base={r.orderValue} />
      </section>
      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard label="Platform fees per order" value={formatINR(r.platformFees, 2)} sub="Commission + GST + gateway" />
        <MetricCard label="Total deductions" value={formatINR(r.totalDeductions, 2)} sub={`${formatPercent(r.orderValue > 0 ? (r.totalDeductions / r.orderValue) * 100 : null)} of the order`} />
      </div>
      <ResultActions slug={SLUG} calculatorTitle="Online Payout" path={PATH} values={values} report={report} onReset={resetToExample} onLoad={(v) => loadValues(v)} />
    </>
  );

  return (
    <>
      <CalculatorLayout inputs={inputs} results={results} summary={{ label: "True profit per order", value: `${formatINR(r.profit, 2)} · ${formatPercent(r.profitPercent)}`, tone }} />

      <section className="print-break">
        <BlockTitle eyebrow="Monthly simulation" title="Your month of online orders" description={`${monthly.orders.toLocaleString("en-IN")} orders × ${formatINR(values.averageOrderValue)} average order value`} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Monthly GMV" value={formatINRCompact(monthly.gmv)} sub={formatINR(monthly.gmv)} />
          <MetricCard label="Monthly payout" value={formatINRCompact(monthly.payout)} sub={formatINR(monthly.payout)} />
          <MetricCard label="Monthly estimated profit" value={formatINRCompact(monthly.profit)} tone={profitTone(monthly.profitPercent)} sub={`${formatPercent(monthly.profitPercent)} of GMV`} />
          <MetricCard label="Lost to platform fees" value={formatINRCompact(monthly.platformFees)} tone="watch" sub="How much you pay the platform each month" />
        </div>
        <div className="mt-4 rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6">
          <div className="grid gap-x-8 sm:grid-cols-2">
            <div className="divide-y divide-line">
              <StatementRow label="Commissions" value={formatINR(monthly.commissions)} />
              <StatementRow label="GST on commission" value={formatINR(monthly.gstOnCommission)} />
              <StatementRow label="Payment gateway" value={formatINR(monthly.gateway)} />
              <StatementRow label="Discounts" value={formatINR(monthly.discounts)} />
            </div>
            <div className="divide-y divide-line">
              <StatementRow label="Ad spend" value={formatINR(monthly.adSpend)} />
              <StatementRow label="Food cost" value={formatINR(monthly.foodCost)} />
              <StatementRow label="Payout" value={formatINR(monthly.payout)} />
              <StatementRow label="Estimated profit" value={formatINR(monthly.profit)} tone={monthly.profit >= 0 ? "good" : "bad"} strong />
            </div>
          </div>
        </div>
      </section>

      <section className="print-break">
        <BlockTitle eyebrow="Platform comparison" title="How much are you losing to platform fees?" description="Edit each channel's terms. Profit is per order at the current order value and food cost." />
        <div className="grid gap-4 md:grid-cols-3">
          {comparison.map((c, i) => {
            const best = Math.max(...comparison.map((x) => x.result.profit));
            const isBest = c.result.profit === best;
            return (
              <div key={c.id} className={cn("flex flex-col gap-3 rounded-2xl border bg-card p-5 shadow-card", isBest ? "border-sage" : "border-line")}>
                <div className="flex items-center justify-between gap-2">
                  <input
                    aria-label={`Name of channel ${i + 1}`}
                    value={c.name}
                    maxLength={24}
                    onChange={(e) => setChannels(channels.map((x) => (x.id === c.id ? { ...x, name: e.target.value } : x)))}
                    className="min-w-0 flex-1 rounded-md bg-transparent px-1 py-0.5 text-base font-semibold outline-none hover:bg-wash focus:bg-wash"
                  />
                  {isBest ? <StatusPill tone="good">Keeps most</StatusPill> : null}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    ["commissionPercent", "Commission"],
                    ["gatewayPercent", "Gateway"],
                    ["discountPercent", "Discount"],
                    ["adsPercent", "Ads"],
                  ] as [keyof ChannelConfig, string][]).map(([k, label]) => (
                    <label key={k} className="flex flex-col gap-1 text-xs font-medium text-muted">
                      {label}
                      <NumberInput
                        value={c[k] as number}
                        onValueChange={(v) => setChannels(channels.map((x) => (x.id === c.id ? { ...x, [k]: Math.max(0, Math.min(100, v)) } : x)))}
                        suffix="%"
                        className="h-10"
                        aria-label={`${c.name} ${label}`}
                      />
                    </label>
                  ))}
                </div>
                <div className="divide-y divide-line">
                  <StatementRow label="Payout" value={formatINR(c.result.payout, 2)} />
                  <StatementRow label="Total deductions" value={formatINR(c.result.totalDeductions, 2)} />
                  <StatementRow label="Profit" value={`${formatINR(c.result.profit, 2)} · ${formatPercent(c.result.profitPercent)}`} tone={profitTone(c.result.profitPercent)} strong />
                </div>
              </div>
            );
          })}
        </div>
        <button type="button" onClick={() => setChannels(DEFAULT_CHANNELS)} className="no-print mt-3 text-sm font-medium text-accent-dark hover:underline">Reset channels</button>
      </section>

      <section>
        <BlockTitle eyebrow="Scenario mode" title="What if your terms change?" />
        <ScenarioPanel
          active={active}
          onReset={() => setSc(NO_SC)}
          presets={[
            { label: "Commission −3 pts", onApply: () => setSc({ ...NO_SC, commission: -3 }) },
            { label: "No discount", onApply: () => setSc({ ...NO_SC, discount: -values.discountPercent }) },
            { label: "Ads −5 pts", onApply: () => setSc({ ...NO_SC, ads: -5 }) },
            { label: "Food cost −2 pts", onApply: () => setSc({ ...NO_SC, food: -2 }) },
          ]}
          controls={
            <>
              <ScenarioSlider label="Commission change" value={sc.commission} min={-15} max={10} step={0.5} onChange={(v) => setSc({ ...sc, commission: v })} format={(v) => formatPoints(v)} />
              <ScenarioSlider label="Discount change" value={sc.discount} min={-30} max={20} step={0.5} onChange={(v) => setSc({ ...sc, discount: v })} format={(v) => formatPoints(v)} />
              <ScenarioSlider label="Ads change" value={sc.ads} min={-20} max={20} step={0.5} onChange={(v) => setSc({ ...sc, ads: v })} format={(v) => formatPoints(v)} />
              <ScenarioSlider label="Food cost change" value={sc.food} min={-15} max={15} step={0.5} onChange={(v) => setSc({ ...sc, food: v })} format={(v) => formatPoints(v)} />
            </>
          }
          metrics={[
            { label: "Payout per order", current: r.payout, scenario: s.payout, format: "inr", better: "up" },
            { label: "Profit per order", current: r.profit, scenario: s.profit, format: "inr", better: "up" },
            { label: "Profit %", current: r.profitPercent, scenario: s.profitPercent, format: "percent", better: "up" },
            { label: "Monthly deductions", current: monthly.gmv - monthly.profit, scenario: sMonthly.gmv - sMonthly.profit, format: "inr", better: "down" },
            { label: "Monthly profit", current: monthly.profit, scenario: sMonthly.profit, format: "inr", better: "up" },
          ]}
        />
      </section>

      <InsightList insights={insights} />
    </>
  );
}
