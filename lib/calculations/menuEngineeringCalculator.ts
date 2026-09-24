import { nonNegative, percentOf } from "./utils";

export interface MenuItemInput {
  id: string;
  name: string;
  sellingPrice: number;
  foodCost: number;
  unitsSold: number;
}

export type MenuCategory = "star" | "plowhorse" | "puzzle" | "dog";

export interface MenuItemResult extends MenuItemInput {
  contributionMargin: number;
  foodCostPercent: number | null;
  /** Share of all units sold (menu mix), %. */
  popularityPercent: number;
  profitContribution: number;
  highPopularity: boolean;
  highContribution: boolean;
  category: MenuCategory;
}

export interface MenuEngineeringResult {
  items: MenuItemResult[];
  totalUnits: number;
  totalRevenue: number;
  totalFoodCost: number;
  totalContribution: number;
  averageContribution: number;
  /** Menu-mix threshold (70% of an equal share), %. */
  popularityThresholdPercent: number;
  overallFoodCostPercent: number | null;
  counts: Record<MenuCategory, number>;
}

export const CATEGORY_INFO: Record<MenuCategory, { label: string; axis: string; action: string }> = {
  star: { label: "Star", axis: "High contribution · High popularity", action: "Keep it visible and consistent. Protect the recipe and portion." },
  puzzle: { label: "Puzzle", axis: "High contribution · Low popularity", action: "Promote it: better menu placement, a clearer description, staff recommendations." },
  plowhorse: { label: "Plowhorse", axis: "Low contribution · High popularity", action: "Raise the price slightly or cut plate cost without changing what guests love." },
  dog: { label: "Dog", axis: "Low contribution · Low popularity", action: "Rework it, bundle it, or remove it to simplify the kitchen." },
};

/**
 * Kasavana–Smith menu engineering:
 * - Contribution margin (CM) = Selling price − Food cost
 * - High contribution: CM ≥ weighted average CM
 * - High popularity: menu mix ≥ 70% × (100% ÷ number of items)
 */
export function analyzeMenu(items: MenuItemInput[]): MenuEngineeringResult {
  const clean = items.map((i) => ({
    ...i,
    name: i.name.trim() || "Untitled item",
    sellingPrice: nonNegative(i.sellingPrice),
    foodCost: nonNegative(i.foodCost),
    unitsSold: nonNegative(i.unitsSold),
  }));
  const totalUnits = clean.reduce((s, i) => s + i.unitsSold, 0);
  const totalRevenue = clean.reduce((s, i) => s + i.sellingPrice * i.unitsSold, 0);
  const totalFoodCost = clean.reduce((s, i) => s + i.foodCost * i.unitsSold, 0);
  const totalContribution = totalRevenue - totalFoodCost;
  const averageContribution = totalUnits > 0 ? totalContribution / totalUnits : 0;
  const popularityThresholdPercent = clean.length > 0 ? (100 / clean.length) * 0.7 : 0;

  const counts: Record<MenuCategory, number> = { star: 0, plowhorse: 0, puzzle: 0, dog: 0 };
  const results: MenuItemResult[] = clean.map((i) => {
    const cm = i.sellingPrice - i.foodCost;
    const popularityPercent = totalUnits > 0 ? (i.unitsSold / totalUnits) * 100 : 0;
    const highPopularity = totalUnits > 0 && popularityPercent >= popularityThresholdPercent;
    const highContribution = cm >= averageContribution && cm > 0;
    const category: MenuCategory = highContribution ? (highPopularity ? "star" : "puzzle") : highPopularity ? "plowhorse" : "dog";
    counts[category] += 1;
    return {
      ...i,
      contributionMargin: cm,
      foodCostPercent: percentOf(i.foodCost, i.sellingPrice),
      popularityPercent,
      profitContribution: cm * i.unitsSold,
      highPopularity,
      highContribution,
      category,
    };
  });

  return {
    items: results,
    totalUnits,
    totalRevenue,
    totalFoodCost,
    totalContribution,
    averageContribution,
    popularityThresholdPercent,
    overallFoodCostPercent: percentOf(totalFoodCost, totalRevenue),
    counts,
  };
}
