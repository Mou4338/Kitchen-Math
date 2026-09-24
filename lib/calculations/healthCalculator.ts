import { DEFAULT_BENCHMARKS, type Benchmarks } from "./benchmarks";
import { clamp, lerp, nonNegative, percentOf, round, type Tone } from "./utils";

export interface HealthInputs {
  openingStock: number;
  purchases: number;
  closingStock: number;
  foodSales: number;
  staffSalaries: number;
  monthlySales: number;
  marketingSpend: number;
}

export type HealthMetricKey = "food" | "labor" | "marketing";

export interface HealthMetric {
  key: HealthMetricKey;
  label: string;
  percent: number | null;
  score: number | null;
  weight: number;
  tone: Tone;
  status: string;
  reference: string;
}

export interface HealthResult {
  cogs: number;
  foodCostPercent: number | null;
  laborCostPercent: number | null;
  marketingPercent: number | null;
  /** (COGS + salaries) ÷ monthly sales. Falls back to food sales if monthly sales is empty. */
  primeCostPercent: number | null;
  metrics: HealthMetric[];
  /** 0–100 weighted score over the metrics that were entered, or null. */
  healthScore: number | null;
  grade: HealthGrade | null;
  errors: string[];
}

export interface HealthGrade {
  letter: "A" | "B" | "C" | "D" | "E";
  label: string;
  tone: Tone;
}

export const HEALTH_WEIGHTS: Record<HealthMetricKey, number> = { food: 0.45, labor: 0.35, marketing: 0.2 };

/* ---------- Scoring (transparent, piecewise linear) ---------- */

/** Food: full marks up to (max − 5); 85 at max; 50 at max + 5; falls 4 pts per point after. */
export function scoreFoodCost(p: number, b: Benchmarks = DEFAULT_BENCHMARKS): number {
  const max = b.foodCostMax;
  if (p <= max - 5) return 100;
  if (p <= max) return lerp(p, max - 5, max, 100, 85);
  if (p <= max + 5) return lerp(p, max, max + 5, 85, 50);
  return clamp(50 - (p - (max + 5)) * 4, 5, 50);
}

/** Labor: full marks inside [min, max]; lean staffing scores 70–100; above max falls away. */
export function scoreLaborCost(p: number, b: Benchmarks = DEFAULT_BENCHMARKS): number {
  if (p >= b.laborMin && p <= b.laborMax) return 100;
  if (p < b.laborMin) return clamp(lerp(p, 0, b.laborMin, 55, 100), 55, 100);
  if (p <= b.laborMax + 10) return lerp(p, b.laborMax, b.laborMax + 10, 100, 45);
  return clamp(45 - (p - (b.laborMax + 10)) * 4, 5, 45);
}

/** Marketing: full marks inside [min, max]; under-spending and over-spending both lose points. */
export function scoreMarketing(p: number, b: Benchmarks = DEFAULT_BENCHMARKS): number {
  if (p >= b.marketingMin && p <= b.marketingMax) return 100;
  if (p < b.marketingMin) return clamp(lerp(p, 0, b.marketingMin, 40, 100), 40, 100);
  if (p <= b.marketingMax + 2) return lerp(p, b.marketingMax, b.marketingMax + 2, 100, 70);
  return clamp(70 - (p - (b.marketingMax + 2)) * 8, 10, 70);
}

export function foodStatus(p: number | null, b: Benchmarks = DEFAULT_BENCHMARKS): { tone: Tone; status: string } {
  if (p === null) return { tone: "neutral", status: "Not entered" };
  if (p <= b.foodCostMax) return { tone: "good", status: "Within reference range" };
  if (p <= b.foodCostMax + 5) return { tone: "watch", status: "Above reference range" };
  return { tone: "bad", status: "Well above reference range" };
}

export function laborStatus(p: number | null, b: Benchmarks = DEFAULT_BENCHMARKS): { tone: Tone; status: string } {
  if (p === null) return { tone: "neutral", status: "Not entered" };
  if (p < b.laborMin) return { tone: "watch", status: "Below range, check service levels" };
  if (p <= b.laborMax) return { tone: "good", status: "Within reference range" };
  if (p <= b.laborMax + 10) return { tone: "watch", status: "Above reference range" };
  return { tone: "bad", status: "Well above reference range" };
}

export function marketingStatus(p: number | null, b: Benchmarks = DEFAULT_BENCHMARKS): { tone: Tone; status: string } {
  if (p === null) return { tone: "neutral", status: "Not entered" };
  if (p < b.marketingMin) return { tone: "watch", status: "Below range, growth may be limited" };
  if (p <= b.marketingMax) return { tone: "good", status: "Within reference range" };
  if (p <= b.marketingMax + 2) return { tone: "watch", status: "Above range, check returns" };
  return { tone: "bad", status: "Well above reference range" };
}

export function healthGrade(score: number): HealthGrade {
  if (score >= 85) return { letter: "A", label: "Healthy", tone: "good" };
  if (score >= 70) return { letter: "B", label: "Mostly healthy", tone: "good" };
  if (score >= 55) return { letter: "C", label: "Needs attention", tone: "watch" };
  if (score >= 40) return { letter: "D", label: "At risk", tone: "bad" };
  return { letter: "E", label: "Critical", tone: "bad" };
}

/* ---------- Main calculation ---------- */

export function calculateHealth(input: HealthInputs, b: Benchmarks = DEFAULT_BENCHMARKS): HealthResult {
  const opening = nonNegative(input.openingStock);
  const purchases = nonNegative(input.purchases);
  const closing = nonNegative(input.closingStock);
  const foodSales = nonNegative(input.foodSales);
  const salaries = nonNegative(input.staffSalaries);
  const monthlySales = nonNegative(input.monthlySales);
  const marketing = nonNegative(input.marketingSpend);
  const errors: string[] = [];

  const rawCogs = opening + purchases - closing;
  if (rawCogs < 0) errors.push("Closing stock is higher than opening stock plus purchases. Check your stock values.");
  const cogs = Math.max(0, rawCogs);

  const foodCostPercent = rawCogs > 0 ? percentOf(cogs, foodSales) : null;
  const laborCostPercent = salaries > 0 ? percentOf(salaries, monthlySales) : null;
  const marketingPercent = marketing > 0 ? percentOf(marketing, monthlySales) : null;
  if ((salaries > 0 || marketing > 0) && monthlySales === 0) errors.push("Enter total monthly sales to calculate labor and marketing %.");
  if (rawCogs > 0 && foodSales === 0) errors.push("Enter total food sales to calculate food cost %.");

  const primeBase = monthlySales > 0 ? monthlySales : foodSales;
  const primeCostPercent = foodCostPercent !== null && laborCostPercent !== null ? percentOf(cogs + salaries, primeBase) : null;

  const f = foodStatus(foodCostPercent, b);
  const l = laborStatus(laborCostPercent, b);
  const m = marketingStatus(marketingPercent, b);

  const metrics: HealthMetric[] = [
    { key: "food", label: "Food cost", percent: foodCostPercent, score: foodCostPercent === null ? null : round(scoreFoodCost(foodCostPercent, b), 0), weight: HEALTH_WEIGHTS.food, tone: f.tone, status: f.status, reference: `≤ ${b.foodCostMax}%` },
    { key: "labor", label: "Labor cost", percent: laborCostPercent, score: laborCostPercent === null ? null : round(scoreLaborCost(laborCostPercent, b), 0), weight: HEALTH_WEIGHTS.labor, tone: l.tone, status: l.status, reference: `${b.laborMin}–${b.laborMax}%` },
    { key: "marketing", label: "Marketing", percent: marketingPercent, score: marketingPercent === null ? null : round(scoreMarketing(marketingPercent, b), 0), weight: HEALTH_WEIGHTS.marketing, tone: m.tone, status: m.status, reference: `${b.marketingMin}–${b.marketingMax}%` },
  ];

  const scored = metrics.filter((x) => x.score !== null);
  const totalWeight = scored.reduce((s, x) => s + x.weight, 0);
  const healthScore = totalWeight > 0 ? Math.round(scored.reduce((s, x) => s + (x.score as number) * x.weight, 0) / totalWeight) : null;

  return {
    cogs,
    foodCostPercent,
    laborCostPercent,
    marketingPercent,
    primeCostPercent,
    metrics,
    healthScore,
    grade: healthScore === null ? null : healthGrade(healthScore),
    errors,
  };
}

/* ---------- "What happens if…" simulator ---------- */

export interface HealthSimulation {
  foodCostChangePts: number; // e.g. −2 means food cost drops by 2 points
  salesChangePercent: number; // e.g. +10
  laborChangePercent: number; // change in salary bill
  marketingChangePercent: number; // change in marketing spend
}

export interface HealthSimulationResult {
  /** Monthly saving from the food cost change (positive = saving). */
  foodCostSaving: number;
  /** Extra contribution from extra sales after food cost. */
  salesContribution: number;
  laborSaving: number;
  marketingSaving: number;
  totalMonthlyImpact: number;
  scenario: HealthResult;
}

export function simulateHealth(input: HealthInputs, sim: HealthSimulation, b: Benchmarks = DEFAULT_BENCHMARKS): HealthSimulationResult {
  const base = calculateHealth(input, b);
  const salesFactor = 1 + sim.salesChangePercent / 100;
  const foodSales = nonNegative(input.foodSales);
  const monthlySales = nonNegative(input.monthlySales);
  const foodPct = base.foodCostPercent ?? 0;

  const newFoodPct = Math.max(0, foodPct + sim.foodCostChangePts);
  const newFoodSales = foodSales * salesFactor;
  const newCogs = (newFoodPct / 100) * newFoodSales;

  const foodCostSaving = foodSales * (-sim.foodCostChangePts / 100);
  const salesBase = monthlySales > 0 ? monthlySales : foodSales;
  const salesContribution = salesBase * (sim.salesChangePercent / 100) * (1 - newFoodPct / 100);
  const laborSaving = -nonNegative(input.staffSalaries) * (sim.laborChangePercent / 100);
  const marketingSaving = -nonNegative(input.marketingSpend) * (sim.marketingChangePercent / 100);

  const scenarioInputs: HealthInputs = {
    openingStock: 0,
    purchases: base.foodCostPercent === null ? 0 : newCogs,
    closingStock: 0,
    foodSales: newFoodSales,
    staffSalaries: nonNegative(input.staffSalaries) * (1 + sim.laborChangePercent / 100),
    monthlySales: monthlySales * salesFactor,
    marketingSpend: nonNegative(input.marketingSpend) * (1 + sim.marketingChangePercent / 100),
  };

  return {
    foodCostSaving,
    salesContribution,
    laborSaving,
    marketingSaving,
    totalMonthlyImpact: foodCostSaving + salesContribution + laborSaving + marketingSaving,
    scenario: calculateHealth(scenarioInputs, b),
  };
}

/** Rupee value of one percentage point of a metric (for "estimated impact" lines). */
export function valueOfOnePoint(base: number): number {
  return nonNegative(base) / 100;
}
