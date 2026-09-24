"use client";

import { ArrowDownRight, ArrowUpRight, Minus, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import { compareScenario, type MetricFormat, type ScenarioMetric } from "@/lib/calculations/scenario";
import { formatINR, formatINRSigned, formatMonths, formatNumber, formatPercent, formatPoints } from "@/lib/formatters/number";
import { cn } from "@/lib/utils/cn";

export function formatMetric(v: number | null, f: MetricFormat) {
  if (f === "inr") return formatINR(v);
  if (f === "percent") return formatPercent(v);
  if (f === "months") return formatMonths(v);
  return formatNumber(v, 1);
}

function formatChange(v: number | null, f: MetricFormat) {
  if (v === null) return "—";
  if (f === "inr") return formatINRSigned(v);
  if (f === "percent") return formatPoints(v);
  if (f === "months") return `${v > 0 ? "+" : v < 0 ? "−" : ""}${formatNumber(Math.abs(v), 1)} mo`;
  return `${v > 0 ? "+" : ""}${formatNumber(v, 1)}`;
}

export interface ScenarioPreset {
  label: string;
  onApply: () => void;
}

/**
 * Scenario Mode: controls on the left, "Current vs Scenario" comparison on the right.
 */
export function ScenarioPanel({ controls, metrics, presets, onReset, active, title = "Scenario mode", description }: { controls: ReactNode; metrics: ScenarioMetric[]; presets?: ScenarioPreset[]; onReset: () => void; active: boolean; title?: string; description?: string }) {
  const rows = compareScenario(metrics);
  return (
    <section className="print-break rounded-2xl border border-line bg-card shadow-card" aria-label={title}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-base font-semibold sm:text-lg">{title}</h2>
          <p className="mt-0.5 text-sm text-muted">{description ?? "Move the sliders to test a change. Your inputs stay as they are."}</p>
        </div>
        <button type="button" onClick={onReset} disabled={!active} className="no-print inline-flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-sm font-medium text-ink hover:bg-wash disabled:opacity-40">
          <RotateCcw className="h-4 w-4" aria-hidden /> Reset scenario
        </button>
      </div>
      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="flex flex-col gap-5">
          {presets?.length ? (
            <div className="no-print flex flex-wrap gap-2" role="group" aria-label="Quick scenarios">
              {presets.map((p) => (
                <button key={p.label} type="button" onClick={p.onApply} className="h-9 rounded-full border border-line-strong px-3 text-sm font-medium hover:border-accent hover:bg-wash">
                  {p.label}
                </button>
              ))}
            </div>
          ) : null}
          {controls}
        </div>
        <div className="min-w-0">
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[420px] text-sm">
              <caption className="sr-only">Current values compared with the scenario</caption>
              <thead className="bg-wash text-left text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th scope="col" className="px-3 py-2.5 font-semibold">Metric</th>
                  <th scope="col" className="px-3 py-2.5 text-right font-semibold">Current</th>
                  <th scope="col" className="px-3 py-2.5 text-right font-semibold">Scenario</th>
                  <th scope="col" className="px-3 py-2.5 text-right font-semibold">Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((r) => {
                  const Icon = r.tone === "good" ? ArrowUpRight : r.tone === "bad" ? ArrowDownRight : Minus;
                  return (
                    <tr key={r.label}>
                      <th scope="row" className="px-3 py-2.5 text-left font-medium">{r.label}</th>
                      <td className="tabular px-3 py-2.5 text-right text-muted">{formatMetric(r.current, r.format)}</td>
                      <td className="tabular px-3 py-2.5 text-right font-semibold">{formatMetric(r.scenario, r.format)}</td>
                      <td className={cn("tabular px-3 py-2.5 text-right font-semibold", r.tone === "good" && "text-sage-dark", r.tone === "bad" && "text-danger", r.tone === "neutral" && "text-muted")}>
                        <span className="inline-flex items-center gap-1">
                          <Icon className="h-3.5 w-3.5" aria-hidden />
                          {formatChange(r.change, r.format)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-muted-light">Green means better for your restaurant, red means worse. Estimates only.</p>
        </div>
      </div>
    </section>
  );
}
