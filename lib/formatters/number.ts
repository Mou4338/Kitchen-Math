/**
 * Number formatting helpers for Indian Rupee values.
 * Every formatter returns "—" for null, undefined, NaN or Infinity so the UI never shows NaN/Infinity.
 */

export const EMPTY = "—";

export function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/** ₹1,50,000 style. `decimals` controls fraction digits (default 0). */
export function formatINR(value: number | null | undefined, decimals = 0): string {
  if (!isFiniteNumber(value)) return EMPTY;
  const abs = Math.abs(value);
  const text = abs.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  const isZero = Number(abs.toFixed(decimals)) === 0;
  return `${value < 0 && !isZero ? "−" : ""}₹${text}`;
}

/** Signed rupee value, e.g. +₹10,000 / −₹5,000. */
export function formatINRSigned(value: number | null | undefined, decimals = 0): string {
  if (!isFiniteNumber(value)) return EMPTY;
  if (Number(Math.abs(value).toFixed(decimals)) === 0) return formatINR(0, decimals);
  return `${value > 0 ? "+" : "−"}${formatINR(Math.abs(value), decimals)}`;
}

/** Compact Indian units: ₹950, ₹12.5K, ₹4.25L, ₹1.2Cr. */
export function formatINRCompact(value: number | null | undefined): string {
  if (!isFiniteNumber(value)) return EMPTY;
  const abs = Math.abs(value);
  const sign = value < 0 ? "−" : "";
  const trim = (n: number, d: number) => n.toFixed(d).replace(/\.?0+$/, "");
  if (abs >= 1e7) return `${sign}₹${trim(abs / 1e7, 2)}Cr`;
  if (abs >= 1e5) return `${sign}₹${trim(abs / 1e5, 2)}L`;
  if (abs >= 1e3) return `${sign}₹${trim(abs / 1e3, 1)}K`;
  return `${sign}₹${Math.round(abs)}`;
}

/** 32.4% — trailing ".0" is removed. */
export function formatPercent(value: number | null | undefined, decimals = 1): string {
  if (!isFiniteNumber(value)) return EMPTY;
  const fixed = value.toFixed(decimals);
  const clean = decimals > 0 ? fixed.replace(/\.0+$/, "") : fixed;
  return `${clean === "-0" ? "0" : clean.replace("-", "−")}%`;
}

/** Signed percentage points, e.g. +2.5 pts. */
export function formatPoints(value: number | null | undefined, decimals = 1): string {
  if (!isFiniteNumber(value)) return EMPTY;
  const abs = Math.abs(value).toFixed(decimals).replace(/\.0+$/, "");
  if (Number(abs) === 0) return "0 pts";
  return `${value > 0 ? "+" : "−"}${abs} pts`;
}

export function formatNumber(value: number | null | undefined, decimals = 0): string {
  if (!isFiniteNumber(value)) return EMPTY;
  return value.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: decimals });
}

/** Months as "1 yr 4 mo" / "8 mo". */
export function formatMonths(months: number | null | undefined): string {
  if (!isFiniteNumber(months)) return EMPTY;
  const m = Math.ceil(months);
  const years = Math.floor(m / 12);
  const rest = m % 12;
  if (years === 0) return `${rest} mo`;
  return rest === 0 ? `${years} yr` : `${years} yr ${rest} mo`;
}

/** Group digits Indian style for an input string, keeping decimals the user typed. */
export function formatIndianInput(value: number | null | undefined): string {
  if (!isFiniteNumber(value)) return "";
  return value.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

/**
 * Parse user input like "1,50,000", "₹ 2500.50", "-300".
 * Returns null for empty or unparseable input.
 */
export function parseNumberInput(raw: string): number | null {
  const cleaned = raw.replace(/[₹,\s]/g, "").replace(/[^0-9.\-]/g, "");
  if (cleaned === "" || cleaned === "-" || cleaned === "." || cleaned === "-.") return null;
  const negative = cleaned.startsWith("-");
  const unsigned = cleaned.replace(/-/g, "");
  const [intPart, ...rest] = unsigned.split(".");
  const normalized = rest.length ? `${intPart}.${rest.join("")}` : intPart;
  const n = Number(normalized);
  if (!Number.isFinite(n)) return null;
  return negative ? -n : n;
}
