import { nonNegative, percentOf } from "./utils";

/** Platform terms, all in % of the selling price. Tax (GST) applies to commission and ads. */
export interface PlatformRates {
  commissionPercent: number;
  taxPercent: number;
  discountPercent: number;
  adsPercent: number;
}

/** Cost to make and pack one order. */
export interface OrderCosts {
  dishCost: number;
  labourCost: number;
  packagingCost: number;
}

export interface OnlinePayoutInputs extends PlatformRates, OrderCosts {
  sellingPrice: number;
}

export interface WaterfallStep {
  key: string;
  label: string;
  /** Signed amount: negative for deductions. */
  amount: number;
  /** Running total after this step. */
  running: number;
  kind: "start" | "deduction" | "subtotal" | "result";
}

export interface OnlinePayoutResult {
  sellingPrice: number;
  discount: number;
  commission: number;
  gstOnCommission: number;
  ads: number;
  gstOnAds: number;
  /** Money the platform settles into your bank. */
  payout: number;
  /** Dish cost + Labour + PC. */
  totalCost: number;
  profit: number;
  profitPercent: number | null;
  payoutPercent: number | null;
  /** Everything the platform keeps: discount + commission + ads + GST on both. */
  platformDeductions: number;
  waterfall: WaterfallStep[];
  errors: string[];
}

export const totalCostOf = (c: OrderCosts) => nonNegative(c.dishCost) + nonNegative(c.labourCost) + nonNegative(c.packagingCost);

/**
 * Total deductions % = Commission% × (1 + Tax%) + Discount% + Ads% × (1 + Tax%)
 * Returned as a fraction (0.454 for 45.4%).
 */
export function totalDeductionsRate(r: PlatformRates): number {
  const tax = nonNegative(r.taxPercent) / 100;
  return (nonNegative(r.commissionPercent) / 100) * (1 + tax) + nonNegative(r.discountPercent) / 100 + (nonNegative(r.adsPercent) / 100) * (1 + tax);
}

/**
 * Discount = SP × Discount%          Commission = SP × Commission%     GST on commission = Commission × Tax%
 * Ads = SP × Ads%                    GST on ads = Ads × Tax%
 * Payout = SP − Discount − Commission − GST on commission − Ads − GST on ads
 * Profit per order = Payout − (Dish cost + Labour + PC)
 * Profit % = Profit ÷ SP × 100       Payout % = Payout ÷ SP × 100
 */
export function calculateOnlinePayout(input: OnlinePayoutInputs): OnlinePayoutResult {
  const sp = nonNegative(input.sellingPrice);
  const pct = (p: number) => nonNegative(p) / 100;
  const errors: string[] = [];
  if ([input.commissionPercent, input.discountPercent, input.adsPercent].some((p) => nonNegative(p) > 100)) errors.push("Percentages cannot be more than 100%.");

  const discount = sp * pct(input.discountPercent);
  const commission = sp * pct(input.commissionPercent);
  const gstOnCommission = commission * pct(input.taxPercent);
  const ads = sp * pct(input.adsPercent);
  const gstOnAds = ads * pct(input.taxPercent);
  const payout = sp - discount - commission - gstOnCommission - ads - gstOnAds;
  const totalCost = totalCostOf(input);
  const profit = payout - totalCost;

  let running = sp;
  const step = (key: string, label: string, amount: number, kind: WaterfallStep["kind"]): WaterfallStep => {
    if (kind === "deduction") running -= amount;
    return { key, label, amount: kind === "deduction" ? -amount : amount, running, kind };
  };
  const tax = nonNegative(input.taxPercent);
  const waterfall: WaterfallStep[] = [
    step("price", "Selling price", sp, "start"),
    step("discount", "Discount", discount, "deduction"),
    step("commission", "Commission", commission, "deduction"),
    step("gstCommission", `GST on commission (${tax}%)`, gstOnCommission, "deduction"),
    step("ads", "Ads", ads, "deduction"),
    step("gstAds", `GST on ads (${tax}%)`, gstOnAds, "deduction"),
    step("payout", "Payout", payout, "subtotal"),
    step("cost", "Dish + Labour + PC", totalCost, "deduction"),
    step("profit", "Profit per order", profit, "result"),
  ];

  if (sp > 0 && profit < 0) errors.push("This order loses money after all deductions.");

  return {
    sellingPrice: sp,
    discount,
    commission,
    gstOnCommission,
    ads,
    gstOnAds,
    payout,
    totalCost,
    profit,
    profitPercent: percentOf(profit, sp),
    payoutPercent: percentOf(payout, sp),
    platformDeductions: sp - payout,
    waterfall,
    errors,
  };
}
