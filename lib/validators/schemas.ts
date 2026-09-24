import { z } from "zod";

const MAX_AMOUNT = 1e12; // ₹1 lakh crore

/** Rupee amount: non-negative, finite, sensible size. */
export const amount = (label = "This amount") =>
  z
    .number({ invalid_type_error: `${label} must be a number` })
    .finite(`${label} must be a number`)
    .min(0, `${label} can't be negative`)
    .max(MAX_AMOUNT, `${label} is too large`);

/** Percentage between 0 and `max` (default 100). */
export const percent = (label = "This percentage", max = 100) =>
  z
    .number({ invalid_type_error: `${label} must be a number` })
    .finite(`${label} must be a number`)
    .min(0, `${label} can't be negative`)
    .max(max, `${label} can't be more than ${max}%`);

export const count = (label = "This value", max = 1e7) =>
  z.number({ invalid_type_error: `${label} must be a number` }).finite().min(0, `${label} can't be negative`).max(max, `${label} is too large`);

export const healthSchema = z.object({
  openingStock: amount("Opening stock"),
  purchases: amount("Purchases"),
  closingStock: amount("Closing stock"),
  foodSales: amount("Food sales"),
  staffSalaries: amount("Staff salaries"),
  monthlySales: amount("Monthly sales"),
  marketingSpend: amount("Marketing spend"),
});
export type HealthForm = z.infer<typeof healthSchema>;

export const breakEvenSchema = z.object({
  monthlyRevenue: amount("Monthly revenue"),
  variableCostPercent: percent("Raw material cost", 150),
  rent: amount("Rent"),
  salaries: amount("Salaries"),
  utilities: amount("Electricity and misc costs"),
  otherFixed: amount("Other fixed costs"),
  averageOrderValue: amount("Average order value"),
  daysOpen: count("Days open", 31).min(1, "Days open must be at least 1"),
  targetBufferPercent: percent("Safety buffer", 200),
});
export type BreakEvenForm = z.infer<typeof breakEvenSchema>;

export const onlinePayoutSchema = z.object({
  orderValue: amount("Order value"),
  commissionPercent: percent("Commission"),
  gatewayPercent: percent("Gateway charges"),
  discountPercent: percent("Discount"),
  adsPercent: percent("Ads spend"),
  foodCostPercent: percent("Food cost"),
  ordersPerDay: count("Orders per day", 100000),
  averageOrderValue: amount("Average order value"),
  daysPerMonth: count("Days per month", 31),
});
export type OnlinePayoutForm = z.infer<typeof onlinePayoutSchema>;

export const menuPricingSchema = z.object({
  ingredientCost: amount("Ingredient cost"),
  packagingCost: amount("Packaging cost"),
  prepLaborCost: amount("Prep/labor cost"),
  commissionPercent: percent("Commission"),
  gatewayPercent: percent("Gateway"),
  gstPercent: percent("GST", 40),
  targetFoodCostPercent: percent("Target food cost").min(1, "Target food cost must be at least 1%"),
  targetProfitMarginPercent: percent("Target margin", 99),
  discountPercent: percent("Discount"),
  rounding: z.number().int().min(0).max(3),
});
export type MenuPricingForm = z.infer<typeof menuPricingSchema>;

export const foodCostSchema = z.object({
  openingInventory: amount("Opening inventory"),
  purchases: amount("Purchases"),
  closingInventory: amount("Closing inventory"),
  foodSales: amount("Food sales"),
  waste: amount("Waste"),
  spoilage: amount("Spoilage"),
  staffMeals: amount("Staff meals"),
  complimentary: amount("Complimentary food"),
});
export type FoodCostForm = z.infer<typeof foodCostSchema>;

export const primeCostSchema = z.object({
  foodCost: amount("Food cost"),
  laborCost: amount("Labor cost"),
  revenue: amount("Revenue"),
});
export type PrimeCostForm = z.infer<typeof primeCostSchema>;

export const profitMarginSchema = z.object({
  revenue: amount("Revenue"),
  foodCost: amount("Food cost"),
  labor: amount("Labor"),
  rent: amount("Rent"),
  utilities: amount("Utilities"),
  marketing: amount("Marketing"),
  deliveryFees: amount("Delivery fees"),
  otherExpenses: amount("Other expenses"),
  taxes: amount("Taxes"),
});
export type ProfitMarginForm = z.infer<typeof profitMarginSchema>;

export const roiSchema = z.object({
  initialInvestment: amount("Initial investment"),
  monthlyRevenue: amount("Monthly revenue"),
  monthlyProfit: z.number().finite().min(-MAX_AMOUNT).max(MAX_AMOUNT, "Monthly profit is too large"),
  monthlyGrowthPercent: z.number().finite().min(-20, "Growth can't be below −20% a month").max(20, "Growth can't be above 20% a month"),
  horizonMonths: count("Horizon", 120).min(12, "Use at least 12 months"),
});
export type RoiForm = z.infer<typeof roiSchema>;

export const snapshotSchema = z.object({
  monthlyRevenue: amount("Revenue"),
  foodCost: amount("Food cost"),
  laborCost: amount("Labor cost"),
  marketing: amount("Marketing"),
  rent: amount("Rent"),
  otherCosts: amount("Other costs"),
});
export type SnapshotForm = z.infer<typeof snapshotSchema>;

export const menuItemSchema = z.object({
  id: z.string(),
  name: z.string().max(80),
  sellingPrice: amount("Price"),
  foodCost: amount("Food cost"),
  unitsSold: count("Units sold"),
});
export const menuItemsSchema = z.array(menuItemSchema).max(500);
