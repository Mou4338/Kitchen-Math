"use client";

import { Copy, Download, FileSpreadsheet, FolderOpen, Printer, RotateCcw, Save, Share2 } from "lucide-react";
import { useId, useState } from "react";
import type { ReportData } from "@/types/report";
import { useToast } from "@/components/ui/Toast";
import { buildShareUrl } from "@/lib/share";
import { downloadText, reportToCsv, slugFile } from "@/lib/export/csv";
import { saveScenario } from "@/lib/storage/scenarios";
import { useSavedScenarios } from "@/lib/hooks/useSavedScenarios";
import { cn } from "@/lib/utils/cn";

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

export function reportToText(r: ReportData): string {
  return [
    r.title,
    r.headline,
    "",
    "Inputs",
    ...r.inputs.map((x) => `• ${x.label}: ${x.value}`),
    "",
    "Results",
    ...r.results.map((x) => `• ${x.label}: ${x.value}`),
    "",
    "Estimates only. Benchmarks are indicative.",
  ].join("\n");
}

const actionBtn =
  "inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-line bg-card px-3 text-sm font-medium text-ink transition-colors hover:bg-wash disabled:opacity-50";

/**
 * Save on device, share link, copy, PDF, CSV, print and reset — one row for every calculator.
 */
export function ResultActions({ slug, calculatorTitle, path, values, report, onReset, onLoad }: { slug: string; calculatorTitle: string; path: string; values: unknown; report: ReportData; onReset: () => void; onLoad?: (values: unknown) => void }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [pdfBusy, setPdfBusy] = useState(false);
  const { scenarios: saved } = useSavedScenarios(slug);
  const inputId = useId();
  const selectId = useId();


  const doSave = () => {
    const item = saveScenario({ calculator: slug, calculatorTitle, name: name || `${calculatorTitle} – ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}`, values, keyResult: report.headline });
    setSaving(false);
    setName("");
    toast(item ? "Saved on this device" : "Couldn't save. Your browser may be blocking storage.");
  };

  const doShare = async () => {
    const url = buildShareUrl(path, values);
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: report.title, text: report.headline, url });
        return;
      } catch {
        /* user cancelled or not allowed: fall back to copy */
      }
    }
    toast((await copyToClipboard(url)) ? "Share link copied" : "Couldn't copy the link");
  };

  const doPdf = async () => {
    setPdfBusy(true);
    try {
      const { downloadPdfReport } = await import("@/lib/pdf/generateReport");
      await downloadPdfReport(report);
      toast("PDF downloaded");
    } catch {
      toast("Couldn't create the PDF. Please try again.");
    } finally {
      setPdfBusy(false);
    }
  };

  return (
    <div className="no-print flex flex-col gap-3 rounded-2xl border border-line bg-card p-4 shadow-card">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <button type="button" className={cn(actionBtn, "bg-inverse text-on-inverse hover:opacity-90")} onClick={() => setSaving((s) => !s)} aria-expanded={saving}>
          <Save className="h-4 w-4" aria-hidden /> Save
        </button>
        <button type="button" className={actionBtn} onClick={doShare}>
          <Share2 className="h-4 w-4" aria-hidden /> Share
        </button>
        <button type="button" className={actionBtn} onClick={async () => toast((await copyToClipboard(reportToText(report))) ? "Results copied" : "Couldn't copy")}>
          <Copy className="h-4 w-4" aria-hidden /> Copy
        </button>
        <button type="button" className={actionBtn} onClick={doPdf} disabled={pdfBusy}>
          <Download className="h-4 w-4" aria-hidden /> {pdfBusy ? "Preparing…" : "PDF"}
        </button>
        <button type="button" className={actionBtn} onClick={() => { downloadText(slugFile(report.title, "csv"), reportToCsv(report)); toast("CSV downloaded"); }}>
          <FileSpreadsheet className="h-4 w-4" aria-hidden /> CSV
        </button>
        <button type="button" className={actionBtn} onClick={() => window.print()}>
          <Printer className="h-4 w-4" aria-hidden /> Print
        </button>
        <button type="button" className={cn(actionBtn, "col-span-2")} onClick={() => { onReset(); toast("Reset to example numbers"); }}>
          <RotateCcw className="h-4 w-4" aria-hidden /> Reset
        </button>
      </div>

      {saving ? (
        <form
          className="flex animate-fade-in flex-col gap-2 rounded-xl bg-wash p-3 sm:flex-row sm:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            doSave();
          }}
        >
          <div className="flex-1">
            <label htmlFor={inputId} className="text-xs font-semibold text-muted">Scenario name</label>
            <input id={inputId} autoFocus value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder="e.g. My restaurant – September" className="mt-1 h-11 w-full rounded-lg border border-line-strong bg-card px-3 text-sm outline-none focus:border-accent" />
          </div>
          <button type="submit" className="h-11 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-ink hover:brightness-110">Save on this device</button>
        </form>
      ) : null}

      {saved.length > 0 && onLoad ? (
        <div className="flex items-center gap-2">
          <FolderOpen className="h-4 w-4 shrink-0 text-muted" aria-hidden />
          <label htmlFor={selectId} className="sr-only">Open a saved scenario</label>
          <select
            id={selectId}
            className="h-10 w-full min-w-0 rounded-lg border border-line bg-card px-2 text-sm"
            defaultValue=""
            onChange={(e) => {
              const s = saved.find((x) => x.id === e.target.value);
              if (s) {
                onLoad(s.values);
                toast(`Loaded “${s.name}”`);
              }
              e.target.value = "";
            }}
          >
            <option value="" disabled>Open a saved scenario ({saved.length})</option>
            {saved.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      ) : null}
    </div>
  );
}
