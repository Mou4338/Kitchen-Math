"use client";

import dynamic from "next/dynamic";
import { FileDown, Plus, Smartphone, Trash2, Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { NumberInput } from "@/components/forms/inputs";
import { ChartSkeleton } from "@/components/charts/ChartSkeleton";
import { BlockTitle } from "@/components/calculators/shared/CalculatorLayout";
import { InsightList, type Insight } from "@/components/calculators/shared/InsightList";
import { MetricCard } from "@/components/calculators/shared/MetricCard";
import { ResultActions } from "@/components/calculators/shared/ResultActions";
import { SourceBar } from "@/components/calculators/shared/SourceBar";
import { StatusPill } from "@/components/ui/StatusPill";
import { useToast } from "@/components/ui/Toast";
import { analyzeMenu, CATEGORY_INFO, type MenuCategory, type MenuItemInput } from "@/lib/calculations/menuEngineeringCalculator";
import { GST_ON_COMMISSION_PERCENT, payoutFactor, type PlatformRates } from "@/lib/calculations/onlinePayoutCalculator";
import type { Tone } from "@/lib/calculations/utils";
import { MENU_ITEMS_DEFAULTS, PLATFORM_DEFAULTS } from "@/lib/content/defaults";
import { downloadText, slugFile } from "@/lib/export/csv";
import { menuItemsToCsv, parseMenuCsv } from "@/lib/export/menuCsv";
import { formatINR, formatINRCompact, formatNumber, formatPercent } from "@/lib/formatters/number";
import type { ValueSource } from "@/lib/hooks/useCalculatorForm";
import { decodeState } from "@/lib/share";
import { clearDraft, draftKey, saveDraft } from "@/lib/storage/drafts";
import { useStorageRaw } from "@/lib/hooks/useStorageRaw";
import { newId } from "@/lib/storage/scenarios";
import { cn } from "@/lib/utils/cn";
import { menuItemsSchema, platformRatesSchema } from "@/lib/validators/schemas";
import type { ReportData } from "@/types/report";

const MenuMatrixChart = dynamic(() => import("@/components/charts/MenuMatrixChart"), { ssr: false, loading: () => <ChartSkeleton height={340} /> });

const SLUG = "menu-engineering-calculator";
const PATH = `/restaurant/${SLUG}`;
const CATEGORY_TONE: Record<MenuCategory, Tone> = { star: "good", puzzle: "neutral", plowhorse: "watch", dog: "bad" };
const QUAD_STYLE: Record<MenuCategory, string> = { star: "bg-sage-soft", puzzle: "bg-chart-1/15", plowhorse: "bg-accent-soft", dog: "bg-danger-soft" };

function parseItems(raw: unknown): MenuItemInput[] | null {
  const items = Array.isArray(raw) ? raw : raw && typeof raw === "object" && Array.isArray((raw as { items?: unknown }).items) ? (raw as { items: unknown[] }).items : null;
  if (!items) return null;
  const parsed = menuItemsSchema.safeParse(items);
  return parsed.success ? parsed.data : null;
}

function parseRates(raw: unknown): PlatformRates {
  const r = raw && typeof raw === "object" ? (raw as { rates?: unknown }).rates : null;
  const parsed = platformRatesSchema.safeParse(r);
  return parsed.success ? parsed.data : PLATFORM_DEFAULTS;
}

const SOURCES: ValueSource[] = ["example", "yours", "shared", "saved"];

interface MenuState {
  items: MenuItemInput[];
  rates: PlatformRates;
  source: ValueSource;
}

/** Items, platform rates and where they came from, read from this device's draft. Falls back to the example menu. */
function readMenuDraft(raw: string | null | undefined): MenuState {
  const example: MenuState = { items: MENU_ITEMS_DEFAULTS, rates: PLATFORM_DEFAULTS, source: "example" };
  if (!raw) return example;
  try {
    const data = JSON.parse(raw) as { items?: unknown; rates?: unknown; source?: unknown };
    const items = parseItems(data);
    if (!items) return example;
    const source = SOURCES.includes(data.source as ValueSource) ? (data.source as ValueSource) : "yours";
    return { items, rates: parseRates(data), source };
  } catch {
    return example;
  }
}

const RATE_FIELDS: [keyof Required<PlatformRates>, string, string][] = [
  ["discountPercent", "Discount %", "%"],
  ["commissionPercent", "Commission %", "%"],
  ["adsPercent", "Ads % (of net sales)", "%"],
  ["gstOnOrderPercent", "GST on food %", "%"],
  ["packagingCharge", "Packaging charge (₹)", "₹"],
];

const blankItem = (): MenuItemInput => ({ id: newId(), name: "", sellingPrice: 0, dishCost: 0, labourCost: 0, packagingCost: 0, unitsSold: 0 });

export default function MenuEngineeringCalculator() {
  const { toast } = useToast();
  const draftRaw = useStorageRaw(draftKey(SLUG));
  const { items, rates, source } = useMemo(() => readMenuDraft(draftRaw), [draftRaw]);
  const [csvErrors, setCsvErrors] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  // A shared or saved link (?s=…) is copied into this device's draft once, then removed from the address bar.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get("s");
    const decoded = shared ? decodeState(shared) : null;
    const fromShare = decoded ? parseItems(decoded) : null;
    if (!fromShare) return;
    saveDraft(SLUG, { items: fromShare, rates: parseRates(decoded), source: params.get("from") === "saved" ? "saved" : "shared" });
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  const commit = (next: MenuItemInput[], nextSource: ValueSource = "yours", nextRates: PlatformRates = rates) => saveDraft(SLUG, { items: next, rates: nextRates, source: nextSource });
  const setRate = (k: keyof PlatformRates, v: number) => commit(items, "yours", { ...rates, [k]: Math.max(0, k === "packagingCharge" ? v : Math.min(k === "gstOnOrderPercent" ? 28 : 100, v)) });
  const resetToExample = () => clearDraft(SLUG);
  const update = (id: string, patch: Partial<MenuItemInput>) => commit(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const a = useMemo(() => analyzeMenu(items, rates), [items, rates]);

  const onImport = async (file: File) => {
    if (file.size > 1_000_000) {
      setCsvErrors(["That file is larger than 1 MB. Export a smaller CSV with just the four columns."]);
      return;
    }
    const text = await file.text();
    const res = parseMenuCsv(text, newId);
    setCsvErrors(res.errors);
    if (res.items.length) {
      commit(res.items);
      toast(`Imported ${res.items.length} item${res.items.length === 1 ? "" : "s"}`);
    }
  };

  const insights: Insight[] = [];
  const top = [...a.items].sort((x, y) => y.totalProfit - x.totalProfit)[0];
  if (top && top.totalProfit > 0) insights.push({ tone: "good", title: `${top.name} earns the most`, body: `${formatINR(top.totalProfit)} profit from ${formatNumber(top.unitsSold)} units sold. Keep it visible and consistent.` });
  const losing = a.items.filter((i) => i.unitsSold > 0 && i.profitPerUnit < 0);
  if (losing.length) insights.push({ tone: "bad", title: `${losing.map((p) => p.name).slice(0, 3).join(", ")} lose${losing.length === 1 ? "s" : ""} money on every order`, body: "After discount, commission, GST and ads, the payout is below the cost. Use the Menu Pricing calculator to find the right price." });
  const puzzles = a.items.filter((i) => i.category === "puzzle");
  if (puzzles.length) insights.push({ tone: "neutral", title: `Promote ${puzzles.map((p) => p.name).slice(0, 3).join(", ")}`, body: CATEGORY_INFO.puzzle.action });
  const plow = a.items.filter((i) => i.category === "plowhorse");
  if (plow.length) {
    const keep = (1 - rates.discountPercent / 100) * payoutFactor(rates);
    const lift = plow.reduce((s, i) => s + i.unitsSold * 10 * Math.max(0, keep), 0);
    insights.push({ tone: "watch", title: `Reprice ${plow.map((p) => p.name).slice(0, 3).join(", ")}`, body: CATEGORY_INFO.plowhorse.action, impact: lift > 0 ? `A ₹10 increase could add about ${formatINR(lift)} if units sold hold` : undefined });
  }
  const dogs = a.items.filter((i) => i.category === "dog");
  if (dogs.length) insights.push({ tone: "bad", title: `Review ${dogs.map((p) => p.name).slice(0, 3).join(", ")}`, body: CATEGORY_INFO.dog.action });

  const report: ReportData = {
    calculator: SLUG,
    title: "Menu Engineering Report",
    headline: `${a.items.length} dishes · Stars ${a.counts.star} · Puzzles ${a.counts.puzzle} · Plow Horses ${a.counts.plowhorse} · Dogs ${a.counts.dog} · Total profit ${formatINR(a.totalProfit)}`,
    inputs: [
      { label: "Dishes analysed", value: String(a.items.length) },
      { label: "Total units sold", value: formatNumber(a.totalUnits) },
      { label: "Discount", value: formatPercent(rates.discountPercent) },
      { label: "Commission", value: formatPercent(rates.commissionPercent) },
      { label: "GST on commission", value: `${GST_ON_COMMISSION_PERCENT}% (fixed)` },
      { label: "Ads (of net sales)", value: formatPercent(rates.adsPercent) },
      { label: "GST on food", value: formatPercent(rates.gstOnOrderPercent) },
      { label: "Packaging charge to customer", value: formatINR(rates.packagingCharge ?? 0, 2) },
    ],
    results: [
      { label: "Total profit", value: formatINR(a.totalProfit) },
      { label: "Average profit per unit", value: formatINR(a.averageProfit, 2) },
      { label: "Average units sold per dish", value: formatNumber(a.averagePopularity, 1) },
    ],
    chart: { title: "Total profit by dish", bars: [...a.items].sort((x, y) => y.totalProfit - x.totalProfit).slice(0, 12).map((i) => ({ label: i.name.slice(0, 26), value: i.totalProfit, display: formatINR(i.totalProfit), tone: CATEGORY_TONE[i.category] === "neutral" ? "accent" : CATEGORY_TONE[i.category] })) },
    tables: [{ title: "Dishes", columns: ["Dish", "Price", "Dish cost", "Labour", "Packaging", "Units sold", "Payout / unit", "Profit / unit", "Total profit", "Category"], rows: a.items.map((i) => [i.name, formatINR(i.sellingPrice), formatINR(i.dishCost), formatINR(i.labourCost), formatINR(i.packagingCost), formatNumber(i.unitsSold), formatINR(i.payoutPerUnit, 2), formatINR(i.profitPerUnit, 2), formatINR(i.totalProfit), CATEGORY_INFO[i.category].label]) }],
    assumptions: [
      "Profit per unit uses the Online Payout formula for each dish: payout − (dish cost + labour + packaging cost).",
      "Total profit = profit per unit × units sold.",
      "High profit: profit per unit ≥ the average profit per unit of all dishes.",
      "Popular: units sold ≥ the average units sold of all dishes.",
    ],
    benchmarks: [],
  };

  return (
    <div className="flex flex-col gap-10">
      <section aria-label="Menu items" className="flex flex-col gap-4">
        <SourceBar source={source} onExample={resetToExample} onClear={() => commit([blankItem()])} />
        <div className="rounded-2xl border border-line bg-card p-4 shadow-card sm:p-5">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent-soft text-accent-dark"><Smartphone className="h-5 w-5" aria-hidden /></span>
            <div>
              <h2 className="text-base font-semibold">Platform rates</h2>
              <p className="text-xs text-muted">Entered once, used for every dish. GST on commission is fixed at {GST_ON_COMMISSION_PERCENT}%.</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {RATE_FIELDS.map(([k, label, unit]) => (
              <label key={k} className="flex flex-col gap-1 text-xs font-medium text-muted">
                {label}
                <NumberInput value={rates[k] ?? 0} onValueChange={(v) => setRate(k, v)} {...(unit === "₹" ? { prefix: "₹" } : { suffix: "%" })} className="h-11" aria-label={label} />
              </label>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-card shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3 sm:px-5">
            <h2 className="text-base font-semibold">Dishes <span className="text-sm font-normal text-muted">({items.length})</span></h2>
            <div className="no-print flex flex-wrap gap-2">
              <input ref={fileRef} type="file" accept=".csv,text/csv" className="sr-only" aria-label="Import CSV file" onChange={(e) => { const f = e.target.files?.[0]; if (f) void onImport(f); e.target.value = ""; }} />
              <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-sm font-medium hover:bg-wash"><Upload className="h-4 w-4" aria-hidden /> Import CSV</button>
              <button type="button" onClick={() => { downloadText(slugFile("menu-dishes", "csv"), menuItemsToCsv(items)); toast("CSV downloaded"); }} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-sm font-medium hover:bg-wash"><FileDown className="h-4 w-4" aria-hidden /> Export CSV</button>
              <button type="button" onClick={() => commit([...items, blankItem()])} disabled={items.length >= 500} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-inverse px-3 text-sm font-medium text-on-inverse hover:opacity-90 disabled:opacity-50"><Plus className="h-4 w-4" aria-hidden /> Add dish</button>
            </div>
          </div>
          {csvErrors.length ? (
            <div role="alert" className="mx-4 mt-3 rounded-xl border border-caution/30 bg-caution-soft px-4 py-3 text-sm sm:mx-5">
              <p className="font-semibold">Some rows couldn&apos;t be imported</p>
              <ul className="mt-1 list-disc pl-5">{csvErrors.slice(0, 6).map((e) => <li key={e}>{e}</li>)}</ul>
            </div>
          ) : null}
          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted">
                <tr className="border-b border-line">
                  <th className="px-4 py-2.5 font-semibold">Dish name</th>
                  <th className="px-2 py-2.5 font-semibold">Selling price</th>
                  <th className="px-2 py-2.5 font-semibold">Dish cost</th>
                  <th className="px-2 py-2.5 font-semibold">Labour</th>
                  <th className="px-2 py-2.5 font-semibold">Packaging</th>
                  <th className="px-2 py-2.5 font-semibold">Units sold</th>
                  <th className="px-2 py-2.5 text-right font-semibold">Profit / unit</th>
                  <th className="px-2 py-2.5 text-right font-semibold">Total profit</th>
                  <th className="px-2 py-2.5 font-semibold">Category</th>
                  <th className="px-2 py-2.5"><span className="sr-only">Remove</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {a.items.map((i) => (
                  <tr key={i.id} className="align-middle">
                    <td className="px-4 py-2"><input value={items.find((x) => x.id === i.id)?.name ?? ""} onChange={(e) => update(i.id, { name: e.target.value })} placeholder="Dish name" maxLength={80} aria-label="Dish name" className="h-10 w-full min-w-[160px] rounded-lg border border-line bg-card px-3 outline-none focus:border-accent" /></td>
                    <td className="px-2 py-2"><NumberInput value={i.sellingPrice} onValueChange={(v) => update(i.id, { sellingPrice: v })} prefix="₹" className="h-10 w-24" aria-label={`${i.name} selling price`} /></td>
                    <td className="px-2 py-2"><NumberInput value={i.dishCost} onValueChange={(v) => update(i.id, { dishCost: v })} prefix="₹" className="h-10 w-24" aria-label={`${i.name} dish cost`} /></td>
                    <td className="px-2 py-2"><NumberInput value={i.labourCost} onValueChange={(v) => update(i.id, { labourCost: v })} prefix="₹" className="h-10 w-20" aria-label={`${i.name} labour`} /></td>
                    <td className="px-2 py-2"><NumberInput value={i.packagingCost} onValueChange={(v) => update(i.id, { packagingCost: v })} prefix="₹" className="h-10 w-20" aria-label={`${i.name} packaging cost`} /></td>
                    <td className="px-2 py-2"><NumberInput value={i.unitsSold} onValueChange={(v) => update(i.id, { unitsSold: v })} className="h-10 w-20" decimals={0} aria-label={`${i.name} units sold`} /></td>
                    <td className={cn("tabular px-2 py-2 text-right font-semibold", i.profitPerUnit < 0 && "text-danger")}>{formatINR(i.profitPerUnit, 2)}</td>
                    <td className="tabular px-2 py-2 text-right">{formatINR(i.totalProfit)}</td>
                    <td className="px-2 py-2"><StatusPill tone={CATEGORY_TONE[i.category]}>{CATEGORY_INFO[i.category].label}</StatusPill></td>
                    <td className="px-2 py-2"><button type="button" onClick={() => commit(items.filter((x) => x.id !== i.id))} className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-danger-soft hover:text-danger" aria-label={`Remove ${i.name || "item"}`}><Trash2 className="h-4 w-4" aria-hidden /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile cards */}
          <ul className="divide-y divide-line md:hidden">
            {a.items.map((i) => (
              <li key={i.id} className="flex flex-col gap-3 p-4">
                <div className="flex items-center gap-2">
                  <input value={items.find((x) => x.id === i.id)?.name ?? ""} onChange={(e) => update(i.id, { name: e.target.value })} placeholder="Dish name" maxLength={80} aria-label="Dish name" className="h-11 min-w-0 flex-1 rounded-lg border border-line bg-card px-3 font-medium outline-none focus:border-accent" />
                  <button type="button" onClick={() => commit(items.filter((x) => x.id !== i.id))} className="grid h-11 w-11 place-items-center rounded-lg text-muted hover:bg-danger-soft hover:text-danger" aria-label={`Remove ${i.name || "item"}`}><Trash2 className="h-4 w-4" aria-hidden /></button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <label className="text-xs text-muted">Price<NumberInput value={i.sellingPrice} onValueChange={(v) => update(i.id, { sellingPrice: v })} prefix="₹" className="mt-1 h-11" /></label>
                  <label className="text-xs text-muted">Dish cost<NumberInput value={i.dishCost} onValueChange={(v) => update(i.id, { dishCost: v })} prefix="₹" className="mt-1 h-11" /></label>
                  <label className="text-xs text-muted">Labour<NumberInput value={i.labourCost} onValueChange={(v) => update(i.id, { labourCost: v })} prefix="₹" className="mt-1 h-11" /></label>
                  <label className="text-xs text-muted">Packaging<NumberInput value={i.packagingCost} onValueChange={(v) => update(i.id, { packagingCost: v })} prefix="₹" className="mt-1 h-11" /></label>
                  <label className="text-xs text-muted">Units sold<NumberInput value={i.unitsSold} onValueChange={(v) => update(i.id, { unitsSold: v })} decimals={0} className="mt-1 h-11" /></label>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="tabular text-muted">Profit <b className={i.profitPerUnit < 0 ? "text-danger" : "text-ink"}>{formatINR(i.profitPerUnit, 2)}</b>/unit · total {formatINR(i.totalProfit)}</span>
                  <StatusPill tone={CATEGORY_TONE[i.category]}>{CATEGORY_INFO[i.category].label}</StatusPill>
                </div>
              </li>
            ))}
          </ul>
          <p className="border-t border-line px-4 py-3 text-xs text-muted sm:px-5">CSV columns: Dish Name, Selling Price, Dish Cost, Labour, Packaging Cost, Units Sold. Export first to get a ready template.</p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Menu summary">
        <MetricCard label="Total profit" value={formatINRCompact(a.totalProfit)} sub={formatINR(a.totalProfit)} />
        <MetricCard label="Total units sold" value={formatNumber(a.totalUnits)} />
        <MetricCard label="Average profit / unit" value={formatINR(a.averageProfit, 2)} sub="Simple average across dishes" />
        <MetricCard label="Average units sold" value={formatNumber(a.averagePopularity, 1)} sub="Simple average across dishes" />
      </section>

      <section className="print-break">
        <BlockTitle eyebrow="Visual analysis" title="Menu-engineering matrix" description="Each dot is a dish. Bigger dots earn more in total. Dashed lines mark the average profit per unit and the average units sold." />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="rounded-2xl border border-line bg-card p-4 shadow-card sm:p-5">
            <MenuMatrixChart items={a.items} averageProfit={a.averageProfit} averageUnits={a.averagePopularity} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(["puzzle", "star", "dog", "plowhorse"] as MenuCategory[]).map((k) => {
              const list = a.items.filter((i) => i.category === k);
              return (
                <div key={k} className={cn("flex flex-col gap-1.5 rounded-2xl p-4", QUAD_STYLE[k])}>
                  <p className="font-semibold">{CATEGORY_INFO[k].label}s <span className="font-normal text-muted">· {list.length}</span></p>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted">{CATEGORY_INFO[k].axis}</p>
                  <ul className="mt-1 grid gap-0.5 text-sm font-medium">
                    {list.length ? list.slice(0, 6).map((i) => <li key={i.id} className="truncate">{i.name}</li>) : <li className="font-normal text-muted">None</li>}
                    {list.length > 6 ? <li className="text-xs text-muted">+{list.length - 6} more</li> : null}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <InsightList insights={insights} title="What to do next" />
        <ResultActions slug={SLUG} calculatorTitle="Menu Engineering" path={PATH} values={{ items, rates }} report={report} onReset={resetToExample} onLoad={(v) => { const p = parseItems(v); if (p) commit(p, "saved", parseRates(v)); }} />
      </div>
    </div>
  );
}
