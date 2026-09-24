import { DEFAULT_BENCHMARKS, type Benchmarks } from "./benchmarks";
import { nonNegative, percentOf, type Tone } from "./utils";

export interface PrimeCostInputs {
  foodCost: number;
  laborCost: number;
  revenue: number;
}

export interface PrimeCostResult {
  primeCost: number;
  primeCostPercent: number | null;
  foodPercent: number | null;
  laborPercent: number | null;
  /** Revenue left after prime cost to pay rent, utilities, marketing and profit. */
  remainingMargin: number;
  remainingMarginPercent: number | null;
  tone: Tone;
  status: string;
  errors: string[];
}

export function primeCostStatus(percent: number | null, b: Benchmarks = DEFAULT_BENCHMARKS): { tone: Tone; status: string } {
  if (percent === null) return { tone: "neutral", status: "Not calculated" };
  if (percent < b.primeMin) return { tone: "good", status: "Below reference range" };
  if (percent <= b.primeMax) return { tone: "good", status: "Within reference range" };
  if (percent <= b.primeMax + 5) return { tone: "watch", status: "Slightly above reference range" };
  return { tone: "bad", status: "Well above reference range" };
}

/** Prime cost = Food cost + Labor cost. Prime cost % = Prime cost ÷ Revenue × 100 */
export function calculatePrimeCost(input: PrimeCostInputs, benchmarks: Benchmarks = DEFAULT_BENCHMARKS): PrimeCostResult {
  const food = nonNegative(input.foodCost);
  const labor = nonNegative(input.laborCost);
  const revenue = nonNegative(input.revenue);
  const primeCost = food + labor;
  const primeCostPercent = percentOf(primeCost, revenue);
  const errors: string[] = [];
  if (revenue === 0 && primeCost > 0) errors.push("Enter revenue to calculate prime cost %.");
  if (primeCostPercent !== null && primeCostPercent > 100) errors.push("Prime cost is higher than revenue. Every sale is losing money before rent and other costs.");
  const { tone, status } = primeCostStatus(primeCostPercent, benchmarks);
  return {
    primeCost,
    primeCostPercent,
    foodPercent: percentOf(food, revenue),
    laborPercent: percentOf(labor, revenue),
    remainingMargin: revenue - primeCost,
    remainingMarginPercent: percentOf(revenue - primeCost, revenue),
    tone,
    status,
    errors,
  };
}
