/** Shared math helpers. Pure functions only. */

/** a ÷ b, or null when the result would be NaN/Infinity. */
export function safeDivide(a: number, b: number): number | null {
  if (!Number.isFinite(a) || !Number.isFinite(b) || b === 0) return null;
  const r = a / b;
  return Number.isFinite(r) ? r : null;
}

/** (part ÷ whole) × 100, or null. */
export function percentOf(part: number, whole: number): number | null {
  const r = safeDivide(part, whole);
  return r === null ? null : r * 100;
}

/** Converts any input to a finite, non-negative number (invalid → 0). */
export function nonNegative(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/** Clamp a percentage to 0–100 (invalid → 0). */
export function clampPercent(value: unknown, max = 100): number {
  return Math.min(max, nonNegative(value));
}

export function round(value: number, decimals = 2): number {
  const f = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * f) / f;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Linear interpolation of a score between two points. */
export function lerp(x: number, x0: number, x1: number, y0: number, y1: number): number {
  if (x1 === x0) return y0;
  return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
}

export type Tone = "good" | "watch" | "bad" | "neutral";
