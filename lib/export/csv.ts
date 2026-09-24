import type { ReportData } from "@/types/report";

/** Escape one CSV cell (RFC 4180). */
export function csvCell(value: unknown): string {
  const s = value === null || value === undefined ? "" : String(value);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(rows: unknown[][]): string {
  return rows.map((r) => r.map(csvCell).join(",")).join("\r\n");
}

/** Parse CSV text into rows. Handles quoted cells, escaped quotes and CRLF. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  const src = text.replace(/^﻿/, "");
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') { cell += '"'; i++; } else inQuotes = false;
      } else cell += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += ch;
  }
  if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

export function reportToCsv(report: ReportData): string {
  const rows: unknown[][] = [[report.title], ["Generated", new Date().toLocaleString("en-IN")], [], ["Section", "Item", "Value"]];
  report.inputs.forEach((r) => rows.push(["Input", r.label, r.value]));
  report.results.forEach((r) => rows.push(["Result", r.label, r.value]));
  report.tables?.forEach((t) => {
    rows.push([], [t.title], t.columns);
    t.rows.forEach((r) => rows.push(r));
  });
  report.assumptions.forEach((a) => rows.push(["Assumption", a, ""]));
  return toCsv(rows);
}

/** Trigger a browser download of text content. */
export function downloadText(filename: string, content: string, mime = "text/csv;charset=utf-8") {
  const blob = new Blob(["﻿" + content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function slugFile(name: string, ext: string) {
  const date = new Date().toISOString().slice(0, 10);
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${date}.${ext}`;
}
