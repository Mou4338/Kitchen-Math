import { nonNegative, percentOf } from "./utils";
import type { WaterfallStep } from "./onlinePayoutCalculator";

export interface ProfitMarginInputs {
  revenue: number;
  foodCost: number;
  labor: number;
  rent: number;
  utilities: number;
  marketing: number;
  deliveryFees: number;
  otherExpenses: number;
  taxes: number;
}

export interface ProfitMarginResult {
  revenue: number;
  grossProfit: number;
  operatingExpenses: number;
  operatingProfit: number;
  netProfit: number;
  grossMarginPercent: number | null;
  operatingMarginPercent: number | null;
  netMarginPercent: number | null;
  /** Each cost as a % of revenue. */
  costShares: { key: keyof ProfitMarginInputs; label: string; amount: number; percent: number | null }[];
  waterfall: WaterfallStep[];
  errors: string[];
}

const LABELS: Record<Exclude<keyof ProfitMarginInputs, "revenue">, string> = {
  foodCost: "Food cost",
  labor: "Labor",
  rent: "Rent",
  utilities: "Utilities",
  marketing: "Marketing",
  deliveryFees: "Delivery & platform fees",
  otherExpenses: "Other expenses",
  taxes: "Taxes",
};

/**
 * Gross profit = Revenue − Food cost
 * Operating profit = Gross profit − (Labor + Rent + Utilities + Marketing + Delivery fees + Other)
 * Net profit = Operating profit − Taxes
 */
export function calculateProfitMargin(input: ProfitMarginInputs): ProfitMarginResult {
  const v = Object.fromEntries(Object.entries(input).map(([k, x]) => [k, nonNegative(x)])) as unknown as ProfitMarginInputs;
  const grossProfit = v.revenue - v.foodCost;
  const operatingExpenses = v.labor + v.rent + v.utilities + v.marketing + v.deliveryFees + v.otherExpenses;
  const operatingProfit = grossProfit - operatingExpenses;
  const netProfit = operatingProfit - v.taxes;
  const errors: string[] = [];
  if (v.revenue === 0) errors.push("Enter revenue to calculate margins.");

  let running = v.revenue;
  const ded = (key: string, label: string, amount: number): WaterfallStep => {
    running -= amount;
    return { key, label, amount: -amount, running, kind: "deduction" };
  };
  const waterfall: WaterfallStep[] = [
    { key: "revenue", label: "Revenue", amount: v.revenue, running: v.revenue, kind: "start" },
    ded("foodCost", LABELS.foodCost, v.foodCost),
    { key: "gross", label: "Gross profit", amount: grossProfit, running: grossProfit, kind: "subtotal" },
    ded("labor", LABELS.labor, v.labor),
    ded("rent", LABELS.rent, v.rent),
    ded("utilities", LABELS.utilities, v.utilities),
    ded("marketing", LABELS.marketing, v.marketing),
    ded("deliveryFees", LABELS.deliveryFees, v.deliveryFees),
    ded("otherExpenses", LABELS.otherExpenses, v.otherExpenses),
    { key: "operating", label: "Operating profit", amount: operatingProfit, running: operatingProfit, kind: "subtotal" },
    ded("taxes", LABELS.taxes, v.taxes),
    { key: "net", label: "Net profit", amount: netProfit, running: netProfit, kind: "result" },
  ];

  return {
    revenue: v.revenue,
    grossProfit,
    operatingExpenses,
    operatingProfit,
    netProfit,
    grossMarginPercent: percentOf(grossProfit, v.revenue),
    operatingMarginPercent: percentOf(operatingProfit, v.revenue),
    netMarginPercent: percentOf(netProfit, v.revenue),
    costShares: (Object.keys(LABELS) as (keyof typeof LABELS)[]).map((k) => ({ key: k, label: LABELS[k], amount: v[k], percent: percentOf(v[k], v.revenue) })),
    waterfall,
    errors,
  };
}
