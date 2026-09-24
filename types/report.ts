/** A calculator's result, in a shape that PDF, CSV, copy-to-clipboard and history can all use. */
export interface ReportRow {
  label: string;
  value: string;
}

export interface ReportChartBar {
  label: string;
  value: number;
  /** Display text for the value. */
  display: string;
  tone?: "good" | "watch" | "bad" | "neutral" | "accent";
}

export interface ReportData {
  calculator: string;
  title: string;
  /** One-line headline, used in history and copy text. */
  headline: string;
  inputs: ReportRow[];
  results: ReportRow[];
  chart?: { title: string; bars: ReportChartBar[] };
  assumptions: string[];
  benchmarks: string[];
  /** Extra tables (e.g. scenarios, menu items). */
  tables?: { title: string; columns: string[]; rows: string[][] }[];
}
