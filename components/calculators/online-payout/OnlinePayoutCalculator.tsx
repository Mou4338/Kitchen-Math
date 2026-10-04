"use client";

import { ChefHat, Receipt, Store } from "lucide-react";
import { useMemo, useState } from "react";
import { CurrencyField, PercentField, ScenarioSlider } from "@/components/forms/fields";
import { Waterfall } from "@/components/charts/Waterfall";
import { BlockTitle, CalculatorLayout, FieldGrid, InputGroup } from "@/components/calculators/shared/CalculatorLayout";
import { InsightList, type Insight } from "@/components/calculators/shared/InsightList";
import { MetricCard, StatementRow } from "@/components/calculators/shared/MetricCard";
import { ResultActions } from "@/components/calculators/shared/ResultActions";
import { ScenarioPanel } from "@/components/calculators/shared/ScenarioPanel";
import { SourceBar } from "@/components/calculators/shared/SourceBar";
import { StatusPill } from "@/components/ui/StatusPill";
import { AnimatedNumber } from "@/components/ui/Motion";
import { calculateOnlinePayout, GST_ON_COMMISSION_PERCENT } from "@/lib/calculations/onlinePayoutCalculator";
import type { Tone } from "@/lib/calculations/utils";
import { ONLINE_PAYOUT_DEFAULTS } from "@/lib/content/defaults";
import { formatINR, formatPercent, formatPoints } from "@/lib/formatters/number";
import { useCalculatorForm } from "@/lib/hooks/useCalculatorForm";
import { cn } from "@/lib/utils/cn";
import { onlinePayoutSchema } from "@/lib/validators/schemas";
import type { ReportData } from "@/types/report";

const SLUG = "online-sale-payout-calculator";
const PATH = `/restaurant/${SLUG}`;

interface PayoutScenario {
  price: number;
  commission: number;
  discount: number;
  ads: number;
}
const NO_SC: PayoutScenario = { price: 0, commission: 0, discount: 0, ads: 0 };

const profitTone = (p: number | null): Tone => (p === null ? "neutral" : p < 0 ? "bad" : p < 10 ? "watch" : "good");

export default function OnlinePayoutCalculator() {
  const { control, values, source, loadValues, resetToExample, clearAll } = useCalculatorForm(SLUG, onlinePayoutSchema, ONLINE_PAYOUT_DEFAULTS, ["gstOnOrderPercent"]);
  const [sc, setSc] = useState<PayoutScenario>(NO_SC);

  const r = useMemo(() => calculateOnlinePayout(values), [values]);
  const s = useMemo(
    () =>
      calculateOnlinePayout({
        ...values,
        sellingPrice: Math.max(0, values.sellingPrice + sc.price),
        commissionPercent: Math.max(0, values.commissionPercent + sc.commission),
        discountPercent: Math.max(0, values.discountPercent + sc.discount),
        adsPercent: Math.max(0, values.adsPercent + sc.ads),
      }),
    [values, sc],
  );
  const active = Object.values(sc).some((v) => v !== 0);
  const tone = profitTone(r.profitPercent);

  const insights: Insight[] = [];
  if (r.sellingPrice > 0) {
    if (r.profit < 0) insights.push({ tone: "bad", title: "This order loses money", body: "The payout is less than your cost. Lower the discount, cut ad spend or raise the price. The Menu Pricing calculator shows the price you need." });
    if (values.discountPercent > 0) insights.push({ tone: "watch", title: "Save discounts for slow hours", body: `Your ${formatPercent(values.discountPercent)} discount costs ${formatINR(r.discount, 2)} on every order. Running it only at off-peak times protects peak-hour profit.` });
    if (values.commissionPercent > 0) insights.push({ tone: "neutral", title: "Commission + GST is your biggest deduction", body: `${formatINR(r.commission + r.gstOnCommission, 2)} per order. Each 1 point of commission costs ${formatINR(r.cv * 0.01 * (1 + GST_ON_COMMISSION_PERCENT / 100), 2)} per order including GST.` });
    if (values.adsPercent > 0) insights.push({ tone: "neutral", title: "Check ads against the orders they bring", body: `Ads take ${formatINR(r.ads, 2)} per order. Keep the ad types that bring profitable orders and cut the rest.` });
  }

  const report: ReportData = {
    calculator: SLUG,
    title: "Online Payout & Profit Report",
    headline: `On a ${formatINR(r.sellingPrice)} order: payout ${formatINR(r.payout, 2)}, profit ${formatINR(r.profit, 2)} (${formatPercent(r.profitPercent)})`,
    inputs: [
      { label: "Selling price", value: formatINR(values.sellingPrice, 2) },
      { label: "Packaging charge to customer", value: formatINR(values.packagingCharge, 2) },
      { label: "Discount", value: formatPercent(values.discountPercent) },
      { label: "Commission", value: formatPercent(values.commissionPercent) },
      { label: "GST on commission", value: `${GST_ON_COMMISSION_PERCENT}% (fixed)` },
      { label: "Ads (of net sales)", value: formatPercent(values.adsPercent) },
      { label: "GST on food", value: formatPercent(values.gstOnOrderPercent) },
      { label: "Dish cost", value: formatINR(values.dishCost, 2) },
      { label: "Labour", value: formatINR(values.labourCost, 2) },
      { label: "Packaging cost (yours)", value: formatINR(values.packagingCost, 2) },
    ],
    results: [
      ...r.waterfall.map((w) => ({ label: w.label, value: w.kind === "deduction" ? `−${formatINR(-w.amount, 2)}` : w.kind === "addition" ? `+${formatINR(w.amount, 2)}` : formatINR(w.amount, 2) })),
      { label: "Net sales (customer pays)", value: formatINR(r.netSales, 2) },
      { label: "Profit %", value: formatPercent(r.profitPercent) },
      { label: "Payout %", value: formatPercent(r.payoutPercent) },
    ],
    chart: {
      title: "Where the selling price goes",
      bars: r.waterfall.filter((w) => w.kind === "deduction" || w.kind === "result").map((w) => ({ label: w.label, value: Math.abs(w.amount), display: formatINR(w.amount, 2), tone: w.kind === "result" ? (w.amount >= 0 ? "good" : "bad") : "accent" })),
    },
    assumptions: [
      "Commissionable value (CV) = Selling price − Discount + Packaging charge.",
      "Commission = CV × Commission %; GST on commission = Commission × 18%.",
      "Customer GST = CV × GST on food %; Net sales = CV + Customer GST.",
      "Ads = Net sales × Ads %; Payout = Net sales − Commission − GST on commission − Ads.",
      "Profit = Payout − (Dish cost + Labour + Packaging cost).",
    ],
    benchmarks: [],
  };

  const inputs = (
    <>
      <SourceBar source={source} onExample={resetToExample} onClear={clearAll} />
      <InputGroup title="The order" icon={<Receipt className="h-5 w-5" />}>
        <FieldGrid>
          <CurrencyField control={control} name="sellingPrice" label="Selling price" tooltip="The item subtotal on the platform, before discount and GST." />
          <CurrencyField control={control} name="packagingCharge" label="Packaging charge to customer" tooltip="What the customer pays for packaging, if anything. Often ₹0." />
        </FieldGrid>
      </InputGroup>
      <InputGroup title="Platform terms" description={`GST on commission is fixed at ${GST_ON_COMMISSION_PERCENT}% and added automatically.`} icon={<Store className="h-5 w-5" />}>
        <FieldGrid>
          <PercentField control={control} name="discountPercent" label="Discount %" tooltip="Promo and other discounts you fund, combined." />
          <PercentField control={control} name="commissionPercent" label="Commission %" tooltip="Your platform commission rate. Restaurants pay anywhere from about 9% to 25%." />
          <PercentField control={control} name="adsPercent" label="Ads %" tooltip="Ad spend as a share of net sales (what the customer pays)." />
          <PercentField control={control} name="gstOnOrderPercent" label="GST on food %" tooltip="GST slab charged to the customer on the food. Usually 5%." />
        </FieldGrid>
      </InputGroup>
      <InputGroup title="Your cost per order" icon={<ChefHat className="h-5 w-5" />}>
        <FieldGrid cols={3}>
          <CurrencyField control={control} name="dishCost" label="Dish cost" tooltip="All ingredients in one portion." />
          <CurrencyField control={control} name="labourCost" label="Labour" tooltip="Labour cost per order." />
          <CurrencyField control={control} name="packagingCost" label="Packaging cost" tooltip="Your cost of the box, bag and cutlery. Not what you charge the customer." />
        </FieldGrid>
      </InputGroup>
    </>
  );

  const results = (
    <>
      <section className="print-break rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6" aria-label="Order waterfall">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="eyebrow">Profit per order</p>
            <p className={cn("tabular mt-1 text-4xl font-bold tracking-tight", tone === "bad" ? "text-danger" : "text-ink")}><AnimatedNumber value={r.profit} format={(v) => formatINR(v, 2)} /></p>
            <p className="tabular mt-1 text-sm text-muted">Payout {formatINR(r.payout, 2)} ({formatPercent(r.payoutPercent)} of the selling price)</p>
          </div>
          <StatusPill tone={tone}>{formatPercent(r.profitPercent)} profit</StatusPill>
        </div>
        <Waterfall steps={r.waterfall} decimals={2} base={r.sellingPrice} />
      </section>
      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard label="Payout" value={formatINR(r.payout, 2)} sub={`${formatPercent(r.payoutPercent)} of the selling price`} />
        <MetricCard label="Customer pays (net sales)" value={formatINR(r.netSales, 2)} sub="Commissionable value + customer GST" />
      </div>
      <section className="rounded-2xl border border-line bg-card p-5 shadow-card" aria-label="Line by line">
        <h2 className="text-sm font-semibold">Line by line</h2>
        <div className="mt-2 divide-y divide-line">
          <StatementRow label="Selling price" value={formatINR(r.sellingPrice, 2)} />
          <StatementRow label="Discount" hint="Selling price × Discount %" value={`−${formatINR(r.discount, 2)}`} />
          {r.packagingCharge > 0 ? <StatementRow label="Packaging charge" value={`+${formatINR(r.packagingCharge, 2)}`} /> : null}
          <StatementRow label="Commissionable value (CV)" hint="Selling price − Discount + Packaging charge" value={formatINR(r.cv, 2)} strong />
          <StatementRow label="Commission" hint="CV × Commission %" value={`−${formatINR(r.commission, 2)}`} />
          <StatementRow label="GST on commission" hint="Commission × 18%" value={`−${formatINR(r.gstOnCommission, 2)}`} />
          <StatementRow label="Customer GST" hint="CV × GST on food %" value={`+${formatINR(r.customerGst, 2)}`} />
          <StatementRow label="Net sales" hint="CV + Customer GST: what the customer pays" value={formatINR(r.netSales, 2)} />
          <StatementRow label="Ads" hint="Net sales × Ads %" value={`−${formatINR(r.ads, 2)}`} />
          <StatementRow label="Payout" hint="Net sales − Commission − GST on commission − Ads" value={formatINR(r.payout, 2)} strong />
          <StatementRow label="Dish cost" value={`−${formatINR(values.dishCost, 2)}`} />
          <StatementRow label="Labour" value={`−${formatINR(values.labourCost, 2)}`} />
          <StatementRow label="Packaging cost" value={`−${formatINR(values.packagingCost, 2)}`} />
          <StatementRow label="Profit" value={formatINR(r.profit, 2)} tone={r.profit >= 0 ? "good" : "bad"} strong />
          <StatementRow label="Profit %" hint="Profit ÷ Selling price" value={formatPercent(r.profitPercent)} />
          <StatementRow label="Payout %" hint="Payout ÷ Selling price" value={formatPercent(r.payoutPercent)} />
        </div>
      </section>
      <ResultActions slug={SLUG} calculatorTitle="Online Payout" path={PATH} values={values} report={report} onReset={resetToExample} onLoad={(v) => loadValues(v)} />
    </>
  );

  return (
    <>
      <CalculatorLayout inputs={inputs} results={results} summary={{ label: "Profit per order", value: `${formatINR(r.profit, 2)} · ${formatPercent(r.profitPercent)}`, tone }} />

      <section>
        <BlockTitle eyebrow="Scenario mode" title="What if your price or terms change?" />
        <ScenarioPanel
          active={active}
          onReset={() => setSc(NO_SC)}
          presets={[
            { label: "Price +₹20", onApply: () => setSc({ ...NO_SC, price: 20 }) },
            { label: "Commission −3 pts", onApply: () => setSc({ ...NO_SC, commission: -3 }) },
            { label: "No discount", onApply: () => setSc({ ...NO_SC, discount: -values.discountPercent }) },
            { label: "Ads −2 pts", onApply: () => setSc({ ...NO_SC, ads: -2 }) },
          ]}
          controls={
            <>
              <ScenarioSlider label="Selling price change" value={sc.price} min={-100} max={100} step={5} onChange={(v) => setSc({ ...sc, price: v })} format={(v) => `${v > 0 ? "+" : v < 0 ? "−" : ""}₹${Math.abs(v)}`} />
              <ScenarioSlider label="Commission change" value={sc.commission} min={-15} max={10} step={0.5} onChange={(v) => setSc({ ...sc, commission: v })} format={(v) => formatPoints(v)} />
              <ScenarioSlider label="Discount change" value={sc.discount} min={-30} max={20} step={0.5} onChange={(v) => setSc({ ...sc, discount: v })} format={(v) => formatPoints(v)} />
              <ScenarioSlider label="Ads change" value={sc.ads} min={-20} max={20} step={0.5} onChange={(v) => setSc({ ...sc, ads: v })} format={(v) => formatPoints(v)} />
            </>
          }
          metrics={[
            { label: "Payout", current: r.payout, scenario: s.payout, format: "inr", better: "up" },
            { label: "Profit per order", current: r.profit, scenario: s.profit, format: "inr", better: "up" },
            { label: "Profit %", current: r.profitPercent, scenario: s.profitPercent, format: "percent", better: "up" },
          ]}
        />
      </section>

      <InsightList insights={insights} />
    </>
  );
}
