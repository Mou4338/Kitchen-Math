import { nonNegative, percentOf } from "./utils";

export interface FoodCostInputs {
  openingInventory: number;
  purchases: number;
  closingInventory: number;
  foodSales: number;
  /** Optional non-revenue usage (all in ₹). */
  waste?: number;
  spoilage?: number;
  staffMeals?: number;
  complimentary?: number;
}

export interface FoodCostResult {
  /** Cost of goods sold = opening + purchases − closing. */
  cogs: number;
  foodCostPercent: number | null;
  grossProfit: number;
  grossMarginPercent: number | null;
  /** Waste + spoilage + staff meals + complimentary. */
  nonRevenueUsage: number;
  /** COGS that actually produced paying sales. */
  adjustedCogs: number;
  adjustedFoodCostPercent: number | null;
  /** Share of COGS lost to non-revenue usage. */
  nonRevenueSharePercent: number | null;
  errors: string[];
}

/** Food cost % = ((Opening + Purchases − Closing) ÷ Food sales) × 100 */
export function calculateFoodCostPercent(opening: number, purchases: number, closing: number, sales: number): number | null {
  const cogs = nonNegative(opening) + nonNegative(purchases) - nonNegative(closing);
  if (cogs < 0) return null;
  return percentOf(cogs, nonNegative(sales));
}

export function calculateFoodCost(input: FoodCostInputs): FoodCostResult {
  const opening = nonNegative(input.openingInventory);
  const purchases = nonNegative(input.purchases);
  const closing = nonNegative(input.closingInventory);
  const sales = nonNegative(input.foodSales);
  const errors: string[] = [];

  const rawCogs = opening + purchases - closing;
  if (rawCogs < 0) errors.push("Closing stock is higher than opening stock plus purchases. Check your stock counts.");
  const cogs = Math.max(0, rawCogs);
  if (sales === 0 && cogs > 0) errors.push("Enter food sales to calculate food cost %.");

  const nonRevenueUsage =
    nonNegative(input.waste) + nonNegative(input.spoilage) + nonNegative(input.staffMeals) + nonNegative(input.complimentary);
  if (nonRevenueUsage > cogs && cogs > 0) errors.push("Waste, spoilage, staff meals and complimentary food add up to more than the food used.");
  const adjustedCogs = Math.max(0, cogs - nonRevenueUsage);

  return {
    cogs,
    foodCostPercent: rawCogs < 0 ? null : percentOf(cogs, sales),
    grossProfit: sales - cogs,
    grossMarginPercent: percentOf(sales - cogs, sales),
    nonRevenueUsage,
    adjustedCogs,
    adjustedFoodCostPercent: rawCogs < 0 ? null : percentOf(adjustedCogs, sales),
    nonRevenueSharePercent: percentOf(nonRevenueUsage, cogs),
    errors,
  };
}
