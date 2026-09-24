import { breakEvenRevenue } from "./breakEvenCalculator";
import { nonNegative, percentOf } from "./utils";

export interface SnapshotInputs {
  monthlyRevenue: number;
  foodCost: number;
  laborCost: number;
  marketing: number;
  rent: number;
  otherCosts: number;
}

export interface SnapshotResult {
  revenue: number;
  foodCost: number;
  laborCost: number;
  primeCost: number;
  operatingExpenses: number;
  estimatedProfit: number;
  foodCostPercent: number | null;
  laborCostPercent: number | null;
  primeCostPercent: number | null;
  netMarginPercent: number | null;
  breakEvenRevenue: number | null;
  marginOfSafety: number | null;
  marginOfSafetyPercent: number | null;
}

/**
 * Whole-restaurant snapshot. Food cost is treated as variable; labor, marketing, rent and other costs as fixed.
 */
export function calculateSnapshot(input: SnapshotInputs): SnapshotResult {
  const revenue = nonNegative(input.monthlyRevenue);
  const food = nonNegative(input.foodCost);
  const labor = nonNegative(input.laborCost);
  const opex = nonNegative(input.marketing) + nonNegative(input.rent) + nonNegative(input.otherCosts);
  const fixed = labor + opex;
  const profit = revenue - food - labor - opex;
  const variablePct = percentOf(food, revenue);
  const be = variablePct === null ? null : breakEvenRevenue(fixed, variablePct);
  const mos = be === null || revenue === 0 ? null : revenue - be;
  return {
    revenue,
    foodCost: food,
    laborCost: labor,
    primeCost: food + labor,
    operatingExpenses: opex,
    estimatedProfit: profit,
    foodCostPercent: variablePct,
    laborCostPercent: percentOf(labor, revenue),
    primeCostPercent: percentOf(food + labor, revenue),
    netMarginPercent: percentOf(profit, revenue),
    breakEvenRevenue: be,
    marginOfSafety: mos,
    marginOfSafetyPercent: mos === null ? null : percentOf(mos, revenue),
  };
}
