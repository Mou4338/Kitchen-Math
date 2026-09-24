import { DEFAULT_BENCHMARKS, type Benchmarks } from "./benchmarks";
import { nonNegative, percentOf, safeDivide, type Tone } from "./utils";

export interface BreakEvenInputs {
  monthlyRevenue: number;
  /** Raw material / variable cost as % of revenue. */
  variableCostPercent: number;
  rent: number;
  salaries: number;
  utilities: number;
  otherFixed?: number;
  averageOrderValue?: number;
  daysOpen?: number;
  /** Safety buffer above break-even for the sales target (default 20%). */
  targetBufferPercent?: number;
}

export type BreakEvenStatus = "loss" | "danger" | "moderate" | "strong" | "incomplete" | "impossible";

export interface BreakEvenResult {
  revenue: number;
  fixedCosts: number;
  variableCosts: number;
  contributionMarginPercent: number;
  breakEvenRevenue: number | null;
  marginOfSafety: number | null;
  marginOfSafetyPercent: number | null;
  netProfit: number;
  netMarginPercent: number | null;
  dailyBreakEven: number | null;
  ordersPerDayToBreakEven: number | null;
  currentOrdersPerDay: number | null;
  targetRevenue: number | null;
  status: BreakEvenStatus;
  tone: Tone;
  verdict: string;
  error: string | null;
}

export const BREAK_EVEN_IMPOSSIBLE =
  "Break-even cannot be calculated because your variable cost is 100% or higher. Every sale loses money before fixed costs.";

/** Break-even sales = Fixed costs ÷ Contribution margin ratio. Returns null when CM ≤ 0. */
export function breakEvenRevenue(fixedCosts: number, variableCostPercent: number): number | null {
  const cmRatio = 1 - variableCostPercent / 100;
  if (cmRatio <= 0) return null;
  return safeDivide(nonNegative(fixedCosts), cmRatio);
}

export function calculateBreakEven(input: BreakEvenInputs, b: Benchmarks = DEFAULT_BENCHMARKS): BreakEvenResult {
  const revenue = nonNegative(input.monthlyRevenue);
  const variablePct = nonNegative(input.variableCostPercent);
  const fixedCosts = nonNegative(input.rent) + nonNegative(input.salaries) + nonNegative(input.utilities) + nonNegative(input.otherFixed);
  const daysOpen = nonNegative(input.daysOpen) || 30;
  const aov = nonNegative(input.averageOrderValue);
  const buffer = input.targetBufferPercent === undefined ? 20 : nonNegative(input.targetBufferPercent);

  const contributionMarginPercent = 100 - variablePct;
  const variableCosts = revenue * (variablePct / 100);
  const netProfit = revenue - variableCosts - fixedCosts;
  const be = breakEvenRevenue(fixedCosts, variablePct);

  const marginOfSafety = be === null || revenue === 0 ? null : revenue - be;
  const marginOfSafetyPercent = marginOfSafety === null ? null : percentOf(marginOfSafety, revenue);
  const dailyBreakEven = be === null ? null : be / daysOpen;

  let status: BreakEvenStatus;
  let verdict: string;
  let tone: Tone;
  let error: string | null = null;

  if (variablePct >= 100) {
    status = "impossible"; tone = "bad"; verdict = "No break-even possible"; error = BREAK_EVEN_IMPOSSIBLE;
  } else if (revenue === 0 || fixedCosts === 0) {
    status = "incomplete"; tone = "neutral"; verdict = "Add revenue and fixed costs";
  } else if ((marginOfSafetyPercent ?? 0) < 0) {
    status = "loss"; tone = "bad"; verdict = "Below break-even: operating at a loss";
  } else if ((marginOfSafetyPercent ?? 0) < 10) {
    status = "danger"; tone = "bad"; verdict = "Just above break-even: very little cushion";
  } else if ((marginOfSafetyPercent ?? 0) < b.marginOfSafetyStrong) {
    status = "moderate"; tone = "watch"; verdict = "Profitable with a moderate cushion";
  } else {
    status = "strong"; tone = "good"; verdict = "Comfortably above break-even";
  }

  return {
    revenue,
    fixedCosts,
    variableCosts,
    contributionMarginPercent,
    breakEvenRevenue: be,
    marginOfSafety,
    marginOfSafetyPercent,
    netProfit,
    netMarginPercent: percentOf(netProfit, revenue),
    dailyBreakEven,
    ordersPerDayToBreakEven: dailyBreakEven !== null && aov > 0 ? dailyBreakEven / aov : null,
    currentOrdersPerDay: aov > 0 && revenue > 0 ? revenue / daysOpen / aov : null,
    targetRevenue: be === null ? null : be * (1 + buffer / 100),
    status,
    tone,
    verdict,
    error,
  };
}

export interface BreakEvenScenario {
  revenueChangePercent: number;
  variableCostChangePts: number;
  rentChangePercent: number;
  salaryChangePercent: number;
}

export const NO_BREAK_EVEN_SCENARIO: BreakEvenScenario = { revenueChangePercent: 0, variableCostChangePts: 0, rentChangePercent: 0, salaryChangePercent: 0 };

export function applyBreakEvenScenario(input: BreakEvenInputs, s: BreakEvenScenario): BreakEvenInputs {
  return {
    ...input,
    monthlyRevenue: nonNegative(input.monthlyRevenue) * (1 + s.revenueChangePercent / 100),
    variableCostPercent: Math.max(0, nonNegative(input.variableCostPercent) + s.variableCostChangePts),
    rent: nonNegative(input.rent) * (1 + s.rentChangePercent / 100),
    salaries: nonNegative(input.salaries) * (1 + s.salaryChangePercent / 100),
  };
}

export interface BreakEvenChartPoint {
  sales: number;
  revenue: number;
  totalCost: number;
  fixedCost: number;
}

/** Points for a cost-volume-profit chart from 0 to ~1.4× the larger of revenue and break-even. */
export function breakEvenChartData(input: BreakEvenInputs, steps = 14): BreakEvenChartPoint[] {
  const r = calculateBreakEven(input);
  const top = Math.max(r.revenue, r.breakEvenRevenue ?? 0) * 1.4;
  if (!(top > 0)) return [];
  const vr = nonNegative(input.variableCostPercent) / 100;
  return Array.from({ length: steps + 1 }, (_, i) => {
    const sales = (top * i) / steps;
    return { sales, revenue: sales, totalCost: r.fixedCosts + sales * vr, fixedCost: r.fixedCosts };
  });
}
