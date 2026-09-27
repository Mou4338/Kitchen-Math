import { calculateOnlinePayout, type PlatformRates } from "./onlinePayoutCalculator";
import { nonNegative } from "./utils";

export interface MenuItemInput {
  id: string;
  name: string;
  sellingPrice: number;
  /** Dish + Labour + PC for one order. */
  totalCost: number;
  /** Orders in the month. */
  orders: number;
}

export type MenuCategory = "star" | "plowhorse" | "puzzle" | "dog";

export interface MenuItemResult extends MenuItemInput {
  /** Payout per order after discount, commission, ads and GST. */
  payout: number;
  /** Payout − Total cost. */
  profitPerOrder: number;
  /** Profit per order × Orders. */
  totalProfit: number;
  /** Dish orders ÷ Total orders × 100. */
  menuMixPercent: number;
  popular: boolean;
  profitable: boolean;
  category: MenuCategory;
}

export interface MenuEngineeringResult {
  items: MenuItemResult[];
  totalOrders: number;
  totalProfit: number;
  /** Total profit ÷ Total orders. */
  averageProfitPerOrder: number;
  /** (100% ÷ Number of dishes) × 0.7 */
  popularityLinePercent: number;
  counts: Record<MenuCategory, number>;
}

export const CATEGORY_INFO: Record<MenuCategory, { label: string; axis: string; action: string }> = {
  star: { label: "Star", axis: "High profit · Popular", action: "Keep it visible and consistent. Protect the recipe and portion." },
  puzzle: { label: "Puzzle", axis: "High profit · Less popular", action: "Promote it: better photo, clearer description, top-of-menu placement or a combo." },
  plowhorse: { label: "Plowhorse", axis: "Low profit · Popular", action: "Raise the price slightly or cut cost without changing what customers love." },
  dog: { label: "Dog", axis: "Low profit · Less popular", action: "Rework it, bundle it, or remove it to simplify the kitchen." },
};

/**
 * Per dish: Profit per order (payout formula), Total profit = Profit per order × Orders,
 * Menu mix % = Dish orders ÷ Total orders × 100.
 * Benchmarks: Popularity line = (100% ÷ Number of dishes) × 0.7;
 * Average profit per order = Total profit of all dishes ÷ Total orders of all dishes.
 * Popular: menu mix ≥ popularity line. High profit: profit per order ≥ average (and above ₹0).
 */
export function analyzeMenu(items: MenuItemInput[], rates: PlatformRates): MenuEngineeringResult {
  const clean = items.map((i) => ({
    ...i,
    name: i.name.trim() || "Untitled dish",
    sellingPrice: nonNegative(i.sellingPrice),
    totalCost: nonNegative(i.totalCost),
    orders: nonNegative(i.orders),
  }));

  const withProfit = clean.map((i) => {
    const r = calculateOnlinePayout({ ...rates, sellingPrice: i.sellingPrice, dishCost: i.totalCost, labourCost: 0, packagingCost: 0 });
    return { ...i, payout: r.payout, profitPerOrder: r.profit, totalProfit: r.profit * i.orders };
  });

  const totalOrders = withProfit.reduce((s, i) => s + i.orders, 0);
  const totalProfit = withProfit.reduce((s, i) => s + i.totalProfit, 0);
  const averageProfitPerOrder = totalOrders > 0 ? totalProfit / totalOrders : 0;
  const popularityLinePercent = clean.length > 0 ? (100 / clean.length) * 0.7 : 0;

  const counts: Record<MenuCategory, number> = { star: 0, plowhorse: 0, puzzle: 0, dog: 0 };
  const results: MenuItemResult[] = withProfit.map((i) => {
    const menuMixPercent = totalOrders > 0 ? (i.orders / totalOrders) * 100 : 0;
    const popular = totalOrders > 0 && menuMixPercent >= popularityLinePercent - 1e-9;
    const profitable = i.profitPerOrder > 0 && i.profitPerOrder >= averageProfitPerOrder - 1e-9;
    const category: MenuCategory = profitable ? (popular ? "star" : "puzzle") : popular ? "plowhorse" : "dog";
    counts[category] += 1;
    return { ...i, menuMixPercent, popular, profitable, category };
  });

  return { items: results, totalOrders, totalProfit, averageProfitPerOrder, popularityLinePercent, counts };
}
