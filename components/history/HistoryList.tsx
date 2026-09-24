"use client";

import Link from "next/link";
import { CopyPlus, Eye, History, Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { buttonClass } from "@/components/ui/Button";
import { CALCULATORS } from "@/lib/content/calculators";
import { encodeState } from "@/lib/share";
import { deleteScenario, duplicateScenario, renameScenario } from "@/lib/storage/scenarios";
import { useSavedScenarios } from "@/lib/hooks/useSavedScenarios";
import { downloadText, slugFile, toCsv } from "@/lib/export/csv";

export function HistoryList() {
  const { toast } = useToast();
  const { scenarios: items, ready } = useSavedScenarios();
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);


  const shown = useMemo(() => (filter === "all" ? items : items.filter((i) => i.calculator === filter)), [items, filter]);
  const usedCalcs = Array.from(new Set(items.map((i) => i.calculator)));

  if (!ready) return <div className="h-40 animate-pulse rounded-2xl bg-wash" aria-hidden />;

  if (!items.length) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-line-strong bg-card px-6 py-14 text-center">
        <History className="h-10 w-10 text-muted-light" aria-hidden />
        <h2 className="mt-4 text-xl font-semibold">No saved scenarios yet</h2>
        <p className="mt-2 max-w-md text-sm text-muted">Open any calculator, enter your numbers and press <b>Save</b>. Your scenarios are kept in this browser only. Nothing is uploaded.</p>
        <Link href="/restaurant#tools" className={buttonClass("accent", "md", "mt-6")}>Open a calculator</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted">Show</span>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="h-10 rounded-lg border border-line bg-card px-2 text-sm">
            <option value="all">All calculators ({items.length})</option>
            {usedCalcs.map((c) => (
              <option key={c} value={c}>{CALCULATORS.find((x) => x.slug === c)?.shortTitle ?? c}</option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className={buttonClass("outline", "sm")}
          onClick={() => {
            downloadText(slugFile("saved-scenarios", "csv"), toCsv([["Calculator", "Scenario", "Key result", "Saved on"], ...items.map((i) => [i.calculatorTitle, i.name, i.keyResult, new Date(i.updatedAt).toLocaleString("en-IN")])]));
            toast("CSV downloaded");
          }}
        >
          Export all as CSV
        </button>
      </div>

      <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card shadow-card">
        {shown.map((s) => {
          const viewHref = `/restaurant/${s.calculator}?s=${encodeState(s.values)}&from=saved`;
          return (
            <li key={s.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="min-w-0">
                <p className="eyebrow">{s.calculatorTitle} · {new Date(s.updatedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
                {editing === s.id ? (
                  <form
                    className="mt-1 flex gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      renameScenario(s.id, draftName);
                      setEditing(null);
                      toast("Renamed");
                    }}
                  >
                    <input autoFocus value={draftName} onChange={(e) => setDraftName(e.target.value)} maxLength={60} aria-label="New name" className="h-10 min-w-0 flex-1 rounded-lg border border-line-strong px-3 text-sm outline-none focus:border-accent" />
                    <button type="submit" className={buttonClass("primary", "sm")}>Save</button>
                    <button type="button" className={buttonClass("ghost", "sm")} onClick={() => setEditing(null)}>Cancel</button>
                  </form>
                ) : (
                  <p className="mt-0.5 truncate text-base font-semibold">{s.name}</p>
                )}
                <p className="tabular mt-1 text-sm text-muted">{s.keyResult}</p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-1.5">
                <Link href={viewHref} className={buttonClass("primary", "sm")}><Eye className="h-4 w-4" aria-hidden /> View</Link>
                <button type="button" className={buttonClass("outline", "sm")} onClick={() => { setEditing(s.id); setDraftName(s.name); }}><Pencil className="h-4 w-4" aria-hidden /> Rename</button>
                <button type="button" className={buttonClass("outline", "sm")} onClick={() => { duplicateScenario(s.id); toast("Duplicated"); }}><CopyPlus className="h-4 w-4" aria-hidden /> Duplicate</button>
                {confirmId === s.id ? (
                  <span className="flex items-center gap-1.5">
                    <button type="button" className="inline-flex h-9 items-center rounded-xl bg-danger px-3 text-sm font-medium text-paper" onClick={() => { deleteScenario(s.id); setConfirmId(null); toast("Deleted"); }}>Confirm delete</button>
                    <button type="button" className={buttonClass("ghost", "sm")} onClick={() => setConfirmId(null)}>Keep</button>
                  </span>
                ) : (
                  <button type="button" className={buttonClass("outline", "sm", "text-danger")} onClick={() => setConfirmId(s.id)}><Trash2 className="h-4 w-4" aria-hidden /> Delete</button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-muted">Saved in this browser only. Clearing your browser data removes them. Use Export to keep a copy.</p>
    </div>
  );
}
