import { calculateOnlinePayout, totalCostOf, type PlatformRates } from "./onlinePayoutCalculator";
import { nonNegative } from "./utils";

export interface MenuItemInput {
  id: string;
  name: string;
  sellingPrice: number;
  dishCost: number;
  labourCost: number;
  packagingCost: number;
  /** Units sold in the period (usually a month). */
  unitsSold: number;
  /** Optional per-dish overrides of the shared platform rates (e.g. a dish running its own promo). */
  overrides?: Partial<PlatformRates>;
}

export type MenuCategory = "star" | "plowhorse" | "puzzle" | "dog";

export interface MenuItemResult extends MenuItemInput {
  totalCost: number;
  payoutPerUnit: number;
  profitPerUnit: number;
  totalProfit: number;
  /** Units sold ÷ total units × 100 (shown for reference). */
  menuMixPercent: number;
  highProfit: boolean;
  popular: boolean;
  category: MenuCategory;
}

export interface MenuEngineeringResult {
  items: MenuItemResult[];
  totalUnits: number;
  totalProfit: number;
  /** Simple average of profit per unit across dishes. */
  averageProfit: number;
  /** Simple average of units sold across dishes. */
  averagePopularity: number;
  counts: Record<MenuCategory, number>;
}

export const CATEGORY_INFO: Record<MenuCategory, { label: string; axis: string; action: string }> = {
  star: { label: "Star", axis: "High profit · Popular", action: "Keep it visible and consistent. Protect the recipe and portion." },
  puzzle: { label: "Puzzle", axis: "High profit · Less popular", action: "Promote it: better photo, clearer description, top-of-menu placement or a combo." },
  plowhorse: { label: "Plow Horse", axis: "Low profit · Popular", action: "Raise the price slightly or cut cost without changing what customers love." },
  dog: { label: "Dog", axis: "Low profit · Less popular", action: "Rework it, bundle it, or remove it to simplify the kitchen." },
};

const average = (arr: number[]) => (arr.length ? arr.reduce((s, x) => s + x, 0) / arr.length : 0);

/** Star / Plow Horse / Puzzle / Dog from profit per unit and units sold against the menu averages. */
export function classify(profit: number, popularity: number, avgProfit: number, avgPopularity: number): MenuCategory {
  const eps = 1e-9;
  const highProfit = profit >= avgProfit - eps;
  const popular = popularity >= avgPopularity - eps;
  if (highProfit && popular) return "star";
  if (!highProfit && popular) return "plowhorse";
  if (highProfit && !popular) return "puzzle";
  return "dog";
}

/**
 * Every dish runs through the same payout calculation as the Online Payout calculator.
 * Profit per unit = payout − (dish cost + labour + packaging cost); Total profit = profit per unit × units sold.
 * Averages are simple averages across dishes.
 */
export function analyzeMenu(items: MenuItemInput[], shared: PlatformRates): MenuEngineeringResult {
  const rows = items.map((i) => {
    const clean = {
      ...i,
      name: i.name.trim() || "Untitled dish",
      sellingPrice: nonNegative(i.sellingPrice),
      dishCost: nonNegative(i.dishCost),
      labourCost: nonNegative(i.labourCost),
      packagingCost: nonNegative(i.packagingCost),
      unitsSold: nonNegative(i.unitsSold),
    };
    const calc = calculateOnlinePayout({ ...shared, ...(i.overrides ?? {}), ...clean });
    return { ...clean, totalCost: totalCostOf(clean), payoutPerUnit: calc.payout, profitPerUnit: calc.profit, totalProfit: calc.profit * clean.unitsSold };
  });

  const totalUnits = rows.reduce((s, r) => s + r.unitsSold, 0);
  const totalProfit = rows.reduce((s, r) => s + r.totalProfit, 0);
  const averageProfit = average(rows.map((r) => r.profitPerUnit));
  const averagePopularity = average(rows.map((r) => r.unitsSold));

  const counts: Record<MenuCategory, number> = { star: 0, plowhorse: 0, puzzle: 0, dog: 0 };
  const results: MenuItemResult[] = rows.map((r) => {
    const category = classify(r.profitPerUnit, r.unitsSold, averageProfit, averagePopularity);
    counts[category] += 1;
    return {
      ...r,
      menuMixPercent: totalUnits > 0 ? (r.unitsSold / totalUnits) * 100 : 0,
      highProfit: category === "star" || category === "puzzle",
      popular: category === "star" || category === "plowhorse",
      category,
    };
  });

  return { items: results, totalUnits, totalProfit, averageProfit, averagePopularity, counts };
}
