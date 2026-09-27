import { calculateOnlinePayout, totalCostOf, totalDeductionsRate, type OnlinePayoutResult, type OrderCosts, type PlatformRates } from "./onlinePayoutCalculator";
import { nonNegative } from "./utils";

export interface MenuPricingInputs extends PlatformRates, OrderCosts {
  marginPercent: number;
}

export interface MenuPricingResult {
  /** Dish cost + Labour + PC. */
  totalCost: number;
  /** Total deductions %, e.g. 45.4. */
  totalDeductionsPercent: number;
  /** Price with zero profit. Null when deductions are 100% or more. */
  breakEvenPrice: number | null;
  /** Exact price that hits the margin, before rounding. */
  exactPrice: number | null;
  /** Exact price rounded up to end in 9. */
  menuPrice: number | null;
  /** What the rounded menu price actually earns, using the payout formula. */
  check: OnlinePayoutResult | null;
  errors: string[];
}

export const REDUCE_MESSAGE = "Reduce discount or margin.";

/** Round a price up so it ends in 9 (e.g. 375.7 → 379, 380 → 389, 379 → 379). */
export function roundUpToNine(price: number): number {
  if (!Number.isFinite(price) || price <= 0) return 0;
  // Tiny tolerance so float noise (379.0000000001) doesn't push a price up a whole step.
  const p = price - 1e-7;
  const candidate = Math.ceil((p + 1) / 10) * 10 - 1;
  return candidate >= p ? candidate : candidate + 10;
}

/**
 * Total cost = Dish cost + Labour + PC
 * Total deductions % = Commission% × (1 + Tax%) + Discount% + Ads% × (1 + Tax%)
 * Break-even price = Total cost ÷ (1 − Total deductions %)
 * Menu price = Total cost ÷ (1 − Total deductions % − Margin %), rounded up to end in 9
 */
export function calculateMenuPrice(input: MenuPricingInputs): MenuPricingResult {
  const totalCost = totalCostOf(input);
  const ded = totalDeductionsRate(input);
  const margin = nonNegative(input.marginPercent) / 100;
  const errors: string[] = [];

  const breakEvenPrice = ded < 1 ? totalCost / (1 - ded) : null;

  let exactPrice: number | null = null;
  let menuPrice: number | null = null;
  if (ded + margin >= 1 - 1e-12) {
    errors.push(REDUCE_MESSAGE);
  } else if (totalCost > 0) {
    exactPrice = totalCost / (1 - ded - margin);
    menuPrice = roundUpToNine(exactPrice);
  }

  const check = menuPrice ? calculateOnlinePayout({ ...input, sellingPrice: menuPrice }) : null;

  return { totalCost, totalDeductionsPercent: ded * 100, breakEvenPrice, exactPrice, menuPrice, check, errors };
}
