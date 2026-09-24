import { nonNegative, percentOf } from "./utils";

export interface RoiInputs {
  initialInvestment: number;
  monthlyRevenue: number;
  monthlyProfit: number;
  /** Month-on-month growth in revenue and profit, %. May be negative. */
  monthlyGrowthPercent: number;
  horizonMonths?: number;
}

export interface RoiPoint {
  month: number;
  profit: number;
  cumulativeProfit: number;
  investment: number;
}

export interface RoiResult {
  monthlyRoiPercent: number | null;
  /** Year-one profit (with growth) ÷ investment. */
  annualRoiPercent: number | null;
  paybackMonths: number | null;
  /** Compound annual return over the horizon, counting the investment returned. */
  annualizedReturnPercent: number | null;
  netMarginPercent: number | null;
  firstYearProfit: number;
  horizonProfit: number;
  horizonMonths: number;
  projection: RoiPoint[];
  message: string | null;
}

const MAX_MONTHS = 120;

export function calculateRoi(input: RoiInputs): RoiResult {
  const investment = nonNegative(input.initialInvestment);
  const revenue = nonNegative(input.monthlyRevenue);
  const profit0 = Number.isFinite(input.monthlyProfit) ? input.monthlyProfit : 0;
  const g = Number.isFinite(input.monthlyGrowthPercent) ? Math.max(-50, Math.min(50, input.monthlyGrowthPercent)) / 100 : 0;
  const horizon = Math.min(MAX_MONTHS, Math.max(12, Math.round(nonNegative(input.horizonMonths) || 36)));

  const projection: RoiPoint[] = [];
  let cumulative = 0;
  let payback: number | null = null;
  const limit = Math.max(horizon, MAX_MONTHS);
  for (let m = 1; m <= limit; m++) {
    const p = profit0 * (1 + g) ** (m - 1);
    const before = cumulative;
    cumulative += p;
    if (payback === null && investment > 0 && cumulative >= investment && p > 0) {
      payback = m - 1 + (investment - before) / p;
    }
    if (m <= horizon) projection.push({ month: m, profit: p, cumulativeProfit: cumulative, investment });
  }

  const firstYearProfit = projection.slice(0, 12).reduce((s, x) => s + x.profit, 0);
  const horizonProfit = projection[projection.length - 1]?.cumulativeProfit ?? 0;
  const endValue = investment + horizonProfit;
  const annualized = investment > 0 && endValue > 0 ? ((endValue / investment) ** (12 / horizon) - 1) * 100 : null;

  let message: string | null = null;
  if (investment === 0) message = "Enter your initial investment to calculate ROI and payback.";
  else if (profit0 <= 0) message = "Monthly profit is zero or negative, so the investment is not paid back.";
  else if (payback === null) message = "At this profit and growth rate, payback takes longer than 10 years.";

  return {
    monthlyRoiPercent: percentOf(profit0, investment),
    annualRoiPercent: percentOf(firstYearProfit, investment),
    paybackMonths: payback,
    annualizedReturnPercent: annualized,
    netMarginPercent: percentOf(profit0, revenue),
    firstYearProfit,
    horizonProfit,
    horizonMonths: horizon,
    projection,
    message,
  };
}

export interface RoiScenario {
  name: string;
  profitFactor: number;
  growthDelta: number;
}

export const ROI_SCENARIOS: RoiScenario[] = [
  { name: "Conservative", profitFactor: 0.8, growthDelta: -1 },
  { name: "Expected", profitFactor: 1, growthDelta: 0 },
  { name: "Optimistic", profitFactor: 1.2, growthDelta: 1 },
];

export function roiScenarios(input: RoiInputs, scenarios: RoiScenario[] = ROI_SCENARIOS) {
  return scenarios.map((s) => ({
    ...s,
    result: calculateRoi({ ...input, monthlyProfit: input.monthlyProfit * s.profitFactor, monthlyGrowthPercent: input.monthlyGrowthPercent + s.growthDelta }),
  }));
}
