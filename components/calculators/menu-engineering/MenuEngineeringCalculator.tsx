"use client";

import dynamic from "next/dynamic";
import { FileDown, Plus, Trash2, Upload } from "lucide-react";
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
import type { Tone } from "@/lib/calculations/utils";
import { MENU_ITEMS_DEFAULTS } from "@/lib/content/defaults";
import { downloadText, slugFile } from "@/lib/export/csv";
import { menuItemsToCsv, parseMenuCsv } from "@/lib/export/menuCsv";
import { formatINR, formatINRCompact, formatNumber, formatPercent } from "@/lib/formatters/number";
import type { ValueSource } from "@/lib/hooks/useCalculatorForm";
import { decodeState } from "@/lib/share";
import { clearDraft, draftKey, saveDraft } from "@/lib/storage/drafts";
import { useStorageRaw } from "@/lib/hooks/useStorageRaw";
import { newId } from "@/lib/storage/scenarios";
import { cn } from "@/lib/utils/cn";
import { menuItemsSchema } from "@/lib/validators/schemas";
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

const SOURCES: ValueSource[] = ["example", "yours", "shared", "saved"];

/** Items and where they came from, read from this device's draft. Falls back to the example menu. */
function readMenuDraft(raw: string | null | undefined): { items: MenuItemInput[]; source: ValueSource } {
  if (!raw) return { items: MENU_ITEMS_DEFAULTS, source: "example" };
  try {
    const data = JSON.parse(raw) as { items?: unknown; source?: unknown };
    const items = parseItems(data);
    if (!items) return { items: MENU_ITEMS_DEFAULTS, source: "example" };
    const source = SOURCES.includes(data.source as ValueSource) ? (data.source as ValueSource) : "yours";
    return { items, source };
  } catch {
    return { items: MENU_ITEMS_DEFAULTS, source: "example" };
  }
}

export default function MenuEngineeringCalculator() {
  const { toast } = useToast();
  const draftRaw = useStorageRaw(draftKey(SLUG));
  const { items, source } = useMemo(() => readMenuDraft(draftRaw), [draftRaw]);
  const [csvErrors, setCsvErrors] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  // A shared or saved link (?s=…) is copied into this device's draft once, then removed from the address bar.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get("s");
    const fromShare = shared ? parseItems(decodeState(shared)) : null;
    if (!fromShare) return;
    saveDraft(SLUG, { items: fromShare, source: params.get("from") === "saved" ? "saved" : "shared" });
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  const commit = (next: MenuItemInput[], nextSource: ValueSource = "yours") => saveDraft(SLUG, { items: next, source: nextSource });
  const resetToExample = () => clearDraft(SLUG);
  const update = (id: string, patch: Partial<MenuItemInput>) => commit(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const a = useMemo(() => analyzeMenu(items), [items]);

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
  const top = [...a.items].sort((x, y) => y.profitContribution - x.profitContribution)[0];
  if (top) insights.push({ tone: "good", title: `${top.name} earns the most`, body: `It brings in ${formatINR(top.profitContribution)} of contribution. Keep it visible and consistent.` });
  const puzzles = a.items.filter((i) => i.category === "puzzle");
  if (puzzles.length) insights.push({ tone: "neutral", title: `Promote ${puzzles.map((p) => p.name).slice(0, 3).join(", ")}`, body: CATEGORY_INFO.puzzle.action });
  const plow = a.items.filter((i) => i.category === "plowhorse");
  if (plow.length) {
    const lift = plow.reduce((s, i) => s + i.unitsSold * 10, 0);
    insights.push({ tone: "watch", title: `Reprice ${plow.map((p) => p.name).slice(0, 3).join(", ")}`, body: CATEGORY_INFO.plowhorse.action, impact: `A ₹10 increase could add about ${formatINR(lift)} a month if volume holds` });
  }
  const dogs = a.items.filter((i) => i.category === "dog");
  if (dogs.length) insights.push({ tone: "bad", title: `Review ${dogs.map((p) => p.name).slice(0, 3).join(", ")}`, body: CATEGORY_INFO.dog.action });

  const report: ReportData = {
    calculator: SLUG,
    title: "Menu Engineering Report",
    headline: `${a.items.length} items · Stars ${a.counts.star} · Puzzles ${a.counts.puzzle} · Plowhorses ${a.counts.plowhorse} · Dogs ${a.counts.dog} · Contribution ${formatINR(a.totalContribution)}`,
    inputs: [{ label: "Items analysed", value: String(a.items.length) }, { label: "Total units sold", value: formatNumber(a.totalUnits) }],
    results: [
      { label: "Total revenue", value: formatINR(a.totalRevenue) },
      { label: "Total food cost", value: formatINR(a.totalFoodCost) },
      { label: "Total contribution", value: formatINR(a.totalContribution) },
      { label: "Average contribution per item sold", value: formatINR(a.averageContribution, 2) },
      { label: "Popularity threshold", value: formatPercent(a.popularityThresholdPercent) },
      { label: "Overall food cost", value: formatPercent(a.overallFoodCostPercent) },
    ],
    chart: { title: "Profit contribution by item", bars: [...a.items].sort((x, y) => y.profitContribution - x.profitContribution).slice(0, 12).map((i) => ({ label: i.name.slice(0, 26), value: i.profitContribution, display: formatINR(i.profitContribution), tone: CATEGORY_TONE[i.category] === "neutral" ? "accent" : CATEGORY_TONE[i.category] })) },
    tables: [{ title: "Items", columns: ["Item", "Price", "Food cost", "Units", "Contribution", "Food cost %", "Popularity", "Category"], rows: a.items.map((i) => [i.name, formatINR(i.sellingPrice), formatINR(i.foodCost), formatNumber(i.unitsSold), formatINR(i.contributionMargin), formatPercent(i.foodCostPercent), formatPercent(i.popularityPercent), CATEGORY_INFO[i.category].label]) }],
    assumptions: ["High popularity: menu mix ≥ 70% of an equal share.", "High contribution: contribution ≥ weighted average contribution."],
    benchmarks: ["Kasavana–Smith menu engineering method."],
  };

  return (
    <div className="flex flex-col gap-10">
      <section aria-label="Menu items" className="flex flex-col gap-4">
        <SourceBar source={source} onExample={resetToExample} onClear={() => commit([{ id: newId(), name: "", sellingPrice: 0, foodCost: 0, unitsSold: 0 }])} />
        <div className="rounded-2xl border border-line bg-card shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3 sm:px-5">
            <h2 className="text-base font-semibold">Menu items <span className="text-sm font-normal text-muted">({items.length})</span></h2>
            <div className="no-print flex flex-wrap gap-2">
              <input ref={fileRef} type="file" accept=".csv,text/csv" className="sr-only" aria-label="Import CSV file" onChange={(e) => { const f = e.target.files?.[0]; if (f) void onImport(f); e.target.value = ""; }} />
              <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-sm font-medium hover:bg-wash"><Upload className="h-4 w-4" aria-hidden /> Import CSV</button>
              <button type="button" onClick={() => { downloadText(slugFile("menu-items", "csv"), menuItemsToCsv(items)); toast("CSV downloaded"); }} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-sm font-medium hover:bg-wash"><FileDown className="h-4 w-4" aria-hidden /> Export CSV</button>
              <button type="button" onClick={() => commit([...items, { id: newId(), name: "", sellingPrice: 0, foodCost: 0, unitsSold: 0 }])} disabled={items.length >= 500} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-inverse px-3 text-sm font-medium text-on-inverse hover:opacity-90 disabled:opacity-50"><Plus className="h-4 w-4" aria-hidden /> Add item</button>
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
                  <th className="px-4 py-2.5 font-semibold">Item name</th>
                  <th className="px-2 py-2.5 font-semibold">Selling price</th>
                  <th className="px-2 py-2.5 font-semibold">Food cost</th>
                  <th className="px-2 py-2.5 font-semibold">Units sold</th>
                  <th className="px-2 py-2.5 text-right font-semibold">Contribution</th>
                  <th className="px-2 py-2.5 text-right font-semibold">Food cost %</th>
                  <th className="px-2 py-2.5 text-right font-semibold">Popularity</th>
                  <th className="px-2 py-2.5 font-semibold">Category</th>
                  <th className="px-2 py-2.5"><span className="sr-only">Remove</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {a.items.map((i) => (
                  <tr key={i.id} className="align-middle">
                    <td className="px-4 py-2"><input value={items.find((x) => x.id === i.id)?.name ?? ""} onChange={(e) => update(i.id, { name: e.target.value })} placeholder="Dish name" maxLength={80} aria-label="Item name" className="h-10 w-full min-w-[160px] rounded-lg border border-line bg-card px-3 outline-none focus:border-accent" /></td>
                    <td className="px-2 py-2"><NumberInput value={i.sellingPrice} onValueChange={(v) => update(i.id, { sellingPrice: v })} prefix="₹" className="h-10 w-28" aria-label={`${i.name} selling price`} /></td>
                    <td className="px-2 py-2"><NumberInput value={i.foodCost} onValueChange={(v) => update(i.id, { foodCost: v })} prefix="₹" className="h-10 w-28" aria-label={`${i.name} food cost`} /></td>
                    <td className="px-2 py-2"><NumberInput value={i.unitsSold} onValueChange={(v) => update(i.id, { unitsSold: v })} className="h-10 w-24" decimals={0} aria-label={`${i.name} units sold`} /></td>
                    <td className="tabular px-2 py-2 text-right font-semibold">{formatINR(i.contributionMargin)}</td>
                    <td className="tabular px-2 py-2 text-right">{formatPercent(i.foodCostPercent)}</td>
                    <td className="tabular px-2 py-2 text-right">{formatPercent(i.popularityPercent)}</td>
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
                  <input value={items.find((x) => x.id === i.id)?.name ?? ""} onChange={(e) => update(i.id, { name: e.target.value })} placeholder="Dish name" maxLength={80} aria-label="Item name" className="h-11 min-w-0 flex-1 rounded-lg border border-line bg-card px-3 font-medium outline-none focus:border-accent" />
                  <button type="button" onClick={() => commit(items.filter((x) => x.id !== i.id))} className="grid h-11 w-11 place-items-center rounded-lg text-muted hover:bg-danger-soft hover:text-danger" aria-label={`Remove ${i.name || "item"}`}><Trash2 className="h-4 w-4" aria-hidden /></button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <label className="text-xs text-muted">Price<NumberInput value={i.sellingPrice} onValueChange={(v) => update(i.id, { sellingPrice: v })} prefix="₹" className="mt-1 h-11" /></label>
                  <label className="text-xs text-muted">Food cost<NumberInput value={i.foodCost} onValueChange={(v) => update(i.id, { foodCost: v })} prefix="₹" className="mt-1 h-11" /></label>
                  <label className="text-xs text-muted">Units<NumberInput value={i.unitsSold} onValueChange={(v) => update(i.id, { unitsSold: v })} decimals={0} className="mt-1 h-11" /></label>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="tabular text-muted">CM <b className="text-ink">{formatINR(i.contributionMargin)}</b> · {formatPercent(i.popularityPercent)} of sales</span>
                  <StatusPill tone={CATEGORY_TONE[i.category]}>{CATEGORY_INFO[i.category].label}</StatusPill>
                </div>
              </li>
            ))}
          </ul>
          <p className="border-t border-line px-4 py-3 text-xs text-muted sm:px-5">CSV columns: Item Name, Selling Price, Food Cost, Units Sold. Export first to get a ready template.</p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Menu summary">
        <MetricCard label="Total contribution" value={formatINRCompact(a.totalContribution)} sub={formatINR(a.totalContribution)} />
        <MetricCard label="Avg contribution / plate" value={formatINR(a.averageContribution)} />
        <MetricCard label="Overall food cost" value={formatPercent(a.overallFoodCostPercent)} />
        <MetricCard label="Popularity threshold" value={formatPercent(a.popularityThresholdPercent)} sub="70% of an equal share" />
      </section>

      <section className="print-break">
        <BlockTitle eyebrow="Visual analysis" title="Menu-engineering matrix" description="Each dot is a dish. Bigger dots earn more in total. Dashed lines mark the average contribution and the popularity threshold." />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="rounded-2xl border border-line bg-card p-4 shadow-card sm:p-5">
            <MenuMatrixChart items={a.items} avgContribution={a.averageContribution} popularityThreshold={a.popularityThresholdPercent} />
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
        <ResultActions slug={SLUG} calculatorTitle="Menu Engineering" path={PATH} values={{ items }} report={report} onReset={resetToExample} onLoad={(v) => { const p = parseItems(v); if (p) commit(p, "saved"); }} />
      </div>
    </div>
  );
}
