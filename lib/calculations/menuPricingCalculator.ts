import { GST_ON_COMMISSION_PERCENT } from "./onlinePayoutCalculator";
import { nonNegative, percentOf } from "./utils";

export type RoundingMode = "none" | "5" | "9" | "10";

export interface MenuPricingInputs {
  ingredientCost: number;
  packagingCost: number;
  prepLaborCost: number;
  commissionPercent: number;
  gatewayPercent: number;
  gstPercent: number;
  targetFoodCostPercent: number;
  targetProfitMarginPercent: number;
  discountPercent: number;
  rounding?: RoundingMode;
}

export interface ChannelPrice {
  /** Menu price before GST (what your P&L sees). */
  price: number | null;
  /** Price the customer pays including GST. */
  priceWithGst: number | null;
  /** Lowest price with zero profit on this channel. */
  minimumPrice: number | null;
  expectedProfit: number | null;
  profitMarginPercent: number | null;
  foodCostPercent: number | null;
  /** Fees and discount deducted on this channel. */
  deductions: number | null;
}

export interface MenuPricingResult {
  plateCost: number;
  priceFromFoodCost: number | null;
  priceFromMargin: number | null;
  dineIn: ChannelPrice;
  online: ChannelPrice;
  onlineMarkupPercent: number | null;
  errors: string[];
}

/** Round a price up to a menu-style ending. */
export function roundMenuPrice(price: number, mode: RoundingMode = "9"): number {
  if (!Number.isFinite(price) || price <= 0) return 0;
  // Tiny tolerance so float noise (e.g. 300.0000000001) does not push a price up a whole step,
  // while a genuinely higher price (e.g. 317.001) still rounds up and never below the target.
  const p = price - 1e-7;
  switch (mode) {
    case "9": {
      const candidate = Math.ceil((p + 1) / 10) * 10 - 1;
      return candidate >= p ? candidate : candidate + 10;
    }
    case "5":
      return Math.ceil(p / 5) * 5;
    case "10":
      return Math.ceil(p / 10) * 10;
    default:
      return Math.ceil(p);
  }
}

/**
 * Dine-in price = max(Ingredient ÷ Target food cost %, Plate cost ÷ (1 − Target margin %)), rounded up.
 * Online price = (Plate cost + Packaging) ÷ (1 − Commission × 1.18 − Gateway − Discount − Target margin), rounded up.
 */
export function calculateMenuPrice(input: MenuPricingInputs): MenuPricingResult {
  const ingredient = nonNegative(input.ingredientCost);
  const packaging = nonNegative(input.packagingCost);
  const prep = nonNegative(input.prepLaborCost);
  const plateCost = ingredient + prep;
  const gst = nonNegative(input.gstPercent) / 100;
  const targetFood = nonNegative(input.targetFoodCostPercent) / 100;
  const margin = nonNegative(input.targetProfitMarginPercent) / 100;
  const mode = input.rounding ?? "9";
  const errors: string[] = [];

  const onlineFeeRate =
    (nonNegative(input.commissionPercent) * (1 + GST_ON_COMMISSION_PERCENT / 100) + nonNegative(input.gatewayPercent) + nonNegative(input.discountPercent)) / 100;

  const priceFromFoodCost = targetFood > 0 && ingredient > 0 ? ingredient / targetFood : null;
  const priceFromMargin = margin < 1 && plateCost > 0 ? plateCost / (1 - margin) : null;
  if (margin >= 1) errors.push("Target profit margin must be below 100%.");

  const candidates = [priceFromFoodCost, priceFromMargin].filter((x): x is number => x !== null);
  const rawDineIn = candidates.length ? Math.max(...candidates) : null;
  const dineInPrice = rawDineIn === null ? null : roundMenuPrice(rawDineIn, mode);

  const channel = (price: number | null, cost: number, feeRate: number): ChannelPrice => {
    if (price === null || price <= 0) {
      return { price: null, priceWithGst: null, minimumPrice: null, expectedProfit: null, profitMarginPercent: null, foodCostPercent: null, deductions: null };
    }
    const deductions = price * feeRate;
    const profit = price - deductions - cost;
    const minimum = feeRate < 1 ? cost / (1 - feeRate) : null;
    return {
      price,
      priceWithGst: price * (1 + gst),
      minimumPrice: minimum,
      expectedProfit: profit,
      profitMarginPercent: percentOf(profit, price),
      foodCostPercent: percentOf(ingredient, price),
      deductions,
    };
  };

  const onlineDenominator = 1 - onlineFeeRate - margin;
  let onlinePrice: number | null = null;
  if (plateCost > 0) {
    if (onlineDenominator <= 0) errors.push("Platform fees, discount and target margin add up to 100% or more, so no online price can reach the target.");
    else onlinePrice = roundMenuPrice((plateCost + packaging) / onlineDenominator, mode);
  }

  const dineIn = channel(dineInPrice, plateCost, 0);
  const online = channel(onlinePrice, plateCost + packaging, onlineFeeRate);

  return {
    plateCost,
    priceFromFoodCost,
    priceFromMargin,
    dineIn,
    online,
    onlineMarkupPercent: dineInPrice && onlinePrice ? (onlinePrice / dineInPrice - 1) * 100 : null,
    errors,
  };
}
