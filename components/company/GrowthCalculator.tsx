"use client";

import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import { useState } from "react";
import { NumberInput, RangeSlider } from "@/components/forms/inputs";
import { AnimatedNumber } from "@/components/ui/Motion";
import { calculateGrowth, type GrowthInputs, type GrowthUplift } from "@/lib/calculations/growthCalculator";
import { formatINR, formatINRCompact, formatNumber, formatPercent } from "@/lib/formatters/number";

const START: GrowthInputs = { monthlyVisitors: 20000, conversionPercent: 12, averageOrderValue: 400, ordersPerCustomer: 1.25 };
const UPLIFT: GrowthUplift = { trafficPercent: 10, conversionPercent: 10, aovPercent: 10, repeatPercent: 10 };

const LEVERS: { key: keyof GrowthUplift; label: string; hint: string }[] = [
  { key: "trafficPercent", label: "Traffic", hint: "Visibility, ads, listing quality" },
  { key: "conversionPercent", label: "Conversion", hint: "Menu, photos, funnel fixes" },
  { key: "aovPercent", label: "AOV", hint: "Combos, add-ons, pricing" },
  { key: "repeatPercent", label: "Repeat orders", hint: "Ratings, quality, loyalty" },
];

/** Live "growth equation" simulator for the company home page. */
export function GrowthCalculator() {
  const [inputs, setInputs] = useState<GrowthInputs>(START);
  const [uplift, setUplift] = useState<GrowthUplift>(UPLIFT);
  const r = calculateGrowth(inputs, uplift);
  const maxGain = Math.max(1, ...r.singleLeverGain.map((x) => Math.abs(x.gain)), Math.abs(r.compoundingBonus));

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="rounded-3xl border border-line bg-card p-6 shadow-card sm:p-8">
        <h3 className="text-lg font-bold">Your restaurant today</h3>
        <p className="mt-1 text-sm text-muted">Use rough monthly numbers from your delivery dashboard.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-medium">Menu visitors / month
            <NumberInput value={inputs.monthlyVisitors} onValueChange={(v) => setInputs({ ...inputs, monthlyVisitors: Math.max(0, v) })} aria-label="Menu visitors per month" decimals={0} />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">Conversion (M2O)
            <NumberInput value={inputs.conversionPercent} onValueChange={(v) => setInputs({ ...inputs, conversionPercent: Math.min(100, Math.max(0, v)) })} suffix="%" aria-label="Conversion percent" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">Average order value
            <NumberInput value={inputs.averageOrderValue} onValueChange={(v) => setInputs({ ...inputs, averageOrderValue: Math.max(0, v) })} prefix="₹" aria-label="Average order value" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">Orders per customer / month
            <NumberInput value={inputs.ordersPerCustomer} onValueChange={(v) => setInputs({ ...inputs, ordersPerCustomer: Math.max(0, v) })} aria-label="Orders per customer per month" />
          </label>
        </div>

        <div className="mt-7 flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold">Improve each lever by…</h3>
          <button type="button" onClick={() => { setInputs(START); setUplift(UPLIFT); }} className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-muted hover:bg-wash hover:text-ink">
            <RotateCcw className="h-4 w-4" aria-hidden /> Reset
          </button>
        </div>
        <div className="mt-3 grid gap-4">
          {LEVERS.map((l) => (
            <div key={l.key}>
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span><b className="font-semibold">{l.label}</b> <span className="text-xs text-muted">· {l.hint}</span></span>
                <span className="tabular rounded-md bg-accent-soft px-2 py-0.5 text-xs font-bold text-accent-dark">+{uplift[l.key]}%</span>
              </div>
              <RangeSlider value={uplift[l.key]} min={0} max={50} step={1} onValueChange={(v) => setUplift({ ...uplift, [l.key]: v })} format={(v) => `+${v}%`} label={`${l.label} improvement`} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-3xl bg-inverse p-6 text-on-inverse shadow-lift sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-bright">Estimated monthly revenue</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-on-inverse/70">Today</p>
            <p className="tabular text-2xl font-bold sm:text-3xl">{formatINRCompact(r.revenue)}</p>
            <p className="tabular text-xs text-on-inverse/60">{formatNumber(r.orders)} orders</p>
          </div>
          <div>
            <p className="text-sm text-on-inverse/70">With improvements</p>
            <p className="tabular text-2xl font-bold text-accent-bright sm:text-3xl"><AnimatedNumber value={r.newRevenue} format={(v) => formatINRCompact(v)} /></p>
            <p className="tabular text-xs text-on-inverse/60">{formatNumber(r.newOrders)} orders</p>
          </div>
        </div>
        <div className="rounded-2xl bg-accent p-5 text-accent-ink">
          <p className="text-sm font-medium opacity-85">Extra revenue each month</p>
          <p className="tabular text-4xl font-bold"><AnimatedNumber value={r.revenueGain} format={(v) => formatINR(v)} /></p>
          <p className="tabular mt-1 text-sm font-semibold">{r.revenueGainPercent === null ? "—" : `+${formatPercent(r.revenueGainPercent)} growth`}</p>
        </div>
        <div>
          <p className="text-sm font-semibold">Where the growth comes from</p>
          <ul className="mt-3 grid gap-2.5">
            {[...r.singleLeverGain.map((x) => ({ label: x.label, gain: x.gain })), { label: "Compounding bonus", gain: r.compoundingBonus }].map((x) => (
              <li key={x.label} className="grid grid-cols-[7.5rem_minmax(0,1fr)_5.5rem] items-center gap-3 text-sm">
                <span className="text-on-inverse/80">{x.label}</span>
                <span className="h-2.5 overflow-hidden rounded-full bg-on-inverse/10">
                  <span className={`block h-full rounded-full transition-all duration-500 ${x.label === "Compounding bonus" ? "bg-accent-bright" : "bg-accent"}`} style={{ width: `${(Math.max(0, x.gain) / maxGain) * 100}%` }} />
                </span>
                <span className="tabular text-right font-semibold">{formatINRCompact(x.gain)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-on-inverse/65">The levers multiply, so improving all four together adds more than the sum of each on its own. That extra is the compounding bonus. Illustrative estimate, not a guarantee.</p>
        </div>
        <Link href="#contact" className="mt-auto inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-on-inverse px-5 font-semibold text-inverse transition hover:opacity-90">
          Find my biggest lever <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
