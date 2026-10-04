import { calculateOnlinePayout, payoutFactor, totalCostOf, type OnlinePayoutResult, type OrderCosts, type PlatformRates } from "./onlinePayoutCalculator";
import { nonNegative } from "./utils";

export interface MenuPricingInputs extends PlatformRates, OrderCosts {
  /** Target margin: profit as a share of the selling price. */
  marginPercent: number;
}

export interface MenuPricingResult {
  /** Dish cost + Labour + Packaging cost. */
  totalCost: number;
  /** factor at 0% margin = (1 − Discount) × ((1 + GST) × (1 − Ads) − 1.18 × Commission). */
  breakEvenFactor: number;
  /** factor at the target margin = breakEvenFactor − Margin. */
  marginFactor: number;
  /** Exact price with ₹0 profit. Null when no price can cover costs. */
  breakEvenPrice: number | null;
  /** Exact price that hits the target margin, before rounding. */
  exactPrice: number | null;
  /** Exact price rounded up to end in 9. */
  recommendedPrice: number | null;
  /** Payout and profit at the recommended price. */
  check: OnlinePayoutResult | null;
  /** Payout and profit at the break-even price (profit ≈ ₹0). */
  breakEvenCheck: OnlinePayoutResult | null;
  errors: string[];
}

export const NO_PRICE_MESSAGE = "Your discount, commission and ads add up to more than 100% — no price can cover costs at this margin.";

/**
 * Round a price up so it ends in 9 and is never below the price it was given
 * (375.72 → 379, 379 → 379, 380 → 389).
 */
export function roundUpToNine(price: number): number {
  if (!Number.isFinite(price) || price <= 0) return 0;
  // Tiny tolerance so float noise (379.0000000001) doesn't push a price up a whole step.
  const p = price - 1e-7;
  const candidate = Math.ceil((p + 1) / 10) * 10 - 1;
  return candidate >= p ? candidate : candidate + 10;
}

/**
 * Solves the payout formula backwards for the selling price:
 * factor = (1 − d) × ((1 + g) × (1 − a) − 1.18 × c) − m
 * price  = (Total cost − Packaging charge × k) ÷ factor,  k = (1 + g) × (1 − a) − 1.18 × c
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

  const solve = (factor: number) => (factor > 1e-12 ? numerator / factor : null);
  const breakEvenPrice = solve(breakEvenFactor);
  const exactPrice = solve(marginFactor);
  if (exactPrice === null) errors.push(NO_PRICE_MESSAGE);

  const recommendedPrice = exactPrice !== null && totalCost > 0 ? roundUpToNine(exactPrice) : null;
  const check = recommendedPrice ? calculateOnlinePayout({ ...input, sellingPrice: recommendedPrice }) : null;
  const breakEvenCheck = breakEvenPrice !== null && totalCost > 0 ? calculateOnlinePayout({ ...input, sellingPrice: breakEvenPrice }) : null;

  return { totalCost, breakEvenFactor, marginFactor, breakEvenPrice, exactPrice, recommendedPrice, check, breakEvenCheck, errors };
}
