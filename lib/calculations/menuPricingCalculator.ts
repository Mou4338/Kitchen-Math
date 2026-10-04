import { calculateOnlinePayout, payoutFactor, totalCostOf, type OnlinePayoutResult, type OrderCosts, type PlatformRates } from "./onlinePayoutCalculator";
import { nonNegative } from "./utils";

export interface MenuPricingInputs extends PlatformRates, OrderCosts {
  /** Target margin: profit as a share of the selling price. */
  marginPercent: number;
}

export interface MenuPricingResult {
  /** Dish cost + Labour + Packaging cost. */
  totalCost: number;
  /** factor at 0% margin = (1 − Discount) × (1 − Ads − 1.18 × Commission). */
  breakEvenFactor: number;
  /** factor at the target margin = breakEvenFactor − Margin. */
  marginFactor: number;
  /** Price with ₹0 profit. Null when no price can cover costs. */
  breakEvenPrice: number | null;
  /** Price that hits the target margin exactly (no rounding). */
  recommendedPrice: number | null;
  /** Payout and profit at the recommended price. */
  check: OnlinePayoutResult | null;
  /** Payout and profit at the break-even price (profit ≈ ₹0). */
  breakEvenCheck: OnlinePayoutResult | null;
  errors: string[];
}

export const NO_PRICE_MESSAGE = "Your discount, commission and ads add up to more than 100% — no price can cover costs at this margin.";

/**
 * Solves the payout formula backwards for the selling price (no rounding):
 * factor = (1 − d) × (1 − a − 1.18 × c) − m
 * price  = (Total cost − Packaging charge × k) ÷ factor,  k = 1 − a − 1.18 × c
 * (with no packaging charge to the customer this is simply Total cost ÷ factor)
 */
export function calculateMenuPrice(input: MenuPricingInputs): MenuPricingResult {
  const totalCost = totalCostOf(input);
  const d = Math.min(1, nonNegative(input.discountPercent) / 100);
  const m = nonNegative(input.marginPercent) / 100;
  const k = payoutFactor(input);
  const packagingCharge = nonNegative(input.packagingCharge ?? 0);
  const breakEvenFactor = (1 - d) * k;
  const marginFactor = breakEvenFactor - m;
  const numerator = Math.max(0, totalCost - packagingCharge * k);
  const errors: string[] = [];

  const solve = (factor: number) => (factor > 1e-12 && totalCost > 0 ? numerator / factor : null);
  const breakEvenPrice = solve(breakEvenFactor);
  const recommendedPrice = solve(marginFactor);
  if (marginFactor <= 1e-12) errors.push(NO_PRICE_MESSAGE);

  const check = recommendedPrice !== null ? calculateOnlinePayout({ ...input, sellingPrice: recommendedPrice }) : null;
  const breakEvenCheck = breakEvenPrice !== null ? calculateOnlinePayout({ ...input, sellingPrice: breakEvenPrice }) : null;

  return { totalCost, breakEvenFactor, marginFactor, breakEvenPrice, recommendedPrice, check, breakEvenCheck, errors };
}
