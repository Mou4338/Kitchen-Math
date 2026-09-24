import type {
  BreakEvenForm, FoodCostForm, HealthForm, MenuPricingForm, OnlinePayoutForm, PrimeCostForm, ProfitMarginForm, RoiForm, SnapshotForm,
} from "@/lib/validators/schemas";
import type { MenuItemInput } from "@/lib/calculations/menuEngineeringCalculator";

/** Example numbers every calculator opens with, so the first view is never empty. Clearly labelled as examples in the UI. */
export const HEALTH_DEFAULTS: HealthForm = {
  openingStock: 120000, purchases: 380000, closingStock: 95000, foodSales: 1250000,
  staffSalaries: 320000, monthlySales: 1400000, marketingSpend: 42000,
};

export const BREAK_EVEN_DEFAULTS: BreakEvenForm = {
  monthlyRevenue: 500000, variableCostPercent: 34, rent: 80000, salaries: 120000, utilities: 35000,
  otherFixed: 0, averageOrderValue: 350, daysOpen: 30, targetBufferPercent: 20,
};

export const ONLINE_PAYOUT_DEFAULTS: OnlinePayoutForm = {
  orderValue: 1000, commissionPercent: 27, gatewayPercent: 2, discountPercent: 10, adsPercent: 10, foodCostPercent: 30,
  ordersPerDay: 40, averageOrderValue: 450, daysPerMonth: 30,
};

export const MENU_PRICING_DEFAULTS: MenuPricingForm = {
  ingredientCost: 95, packagingCost: 15, prepLaborCost: 20, commissionPercent: 25, gatewayPercent: 2, gstPercent: 5,
  targetFoodCostPercent: 30, targetProfitMarginPercent: 25, discountPercent: 10, rounding: 1,
};

export const FOOD_COST_DEFAULTS: FoodCostForm = {
  openingInventory: 150000, purchases: 420000, closingInventory: 110000, foodSales: 1400000,
  waste: 12000, spoilage: 8000, staffMeals: 15000, complimentary: 5000,
};

export const PRIME_COST_DEFAULTS: PrimeCostForm = { foodCost: 460000, laborCost: 330000, revenue: 1400000 };

export const PROFIT_MARGIN_DEFAULTS: ProfitMarginForm = {
  revenue: 1400000, foodCost: 460000, labor: 330000, rent: 150000, utilities: 60000, marketing: 42000,
  deliveryFees: 90000, otherExpenses: 55000, taxes: 45000,
};

export const ROI_DEFAULTS: RoiForm = {
  initialInvestment: 3500000, monthlyRevenue: 1200000, monthlyProfit: 150000, monthlyGrowthPercent: 1.5, horizonMonths: 36,
};

export const SNAPSHOT_DEFAULTS: SnapshotForm = {
  monthlyRevenue: 1000000, foodCost: 320000, laborCost: 230000, marketing: 30000, rent: 120000, otherCosts: 90000,
};

export const MENU_ITEMS_DEFAULTS: MenuItemInput[] = [
  { id: "m1", name: "Paneer Butter Masala", sellingPrice: 349, foodCost: 105, unitsSold: 420 },
  { id: "m2", name: "Dal Makhani", sellingPrice: 289, foodCost: 62, unitsSold: 510 },
  { id: "m3", name: "Chicken Biryani", sellingPrice: 379, foodCost: 145, unitsSold: 640 },
  { id: "m4", name: "Veg Hakka Noodles", sellingPrice: 229, foodCost: 52, unitsSold: 150 },
  { id: "m5", name: "Mutton Rogan Josh", sellingPrice: 499, foodCost: 215, unitsSold: 120 },
  { id: "m6", name: "Masala Papad", sellingPrice: 99, foodCost: 14, unitsSold: 90 },
  { id: "m7", name: "Butter Naan", sellingPrice: 69, foodCost: 11, unitsSold: 980 },
  { id: "m8", name: "Tandoori Platter", sellingPrice: 649, foodCost: 250, unitsSold: 85 },
];
