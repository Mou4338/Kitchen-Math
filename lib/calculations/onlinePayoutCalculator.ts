import { nonNegative, percentOf } from "./utils";

/** GST the platform charges on its commission. Fixed by law, so it is not an input. */
export const GST_ON_COMMISSION_PERCENT = 18;

/** Platform terms shared by every dish. */
export interface PlatformRates {
  /** Promo + other discounts you fund, % of the selling price. */
  discountPercent: number;
  /** Platform commission, % of the commissionable value. */
  commissionPercent: number;
  /** Ad spend, % of the commissionable value. */
  adsPercent: number;
  /** What you charge the customer for packaging (often ₹0). */
  packagingCharge?: number;
}

/** Your cost to make and pack one order. */
export interface OrderCosts {
  dishCost: number;
  labourCost: number;
  /** Your cost of the box/container (not the charge to the customer). */
  packagingCost: number;
}

export interface OnlinePayoutInputs extends PlatformRates, OrderCosts {
  sellingPrice: number;
}

export interface WaterfallStep {
  key: string;
  label: string;
  /** Signed amount: negative for deductions, positive for additions. */
  amount: number;
  /** Running total after this step. */
  running: number;
  kind: "start" | "deduction" | "addition" | "subtotal" | "result";
}

export interface OnlinePayoutResult {
  sellingPrice: number;
  discount: number;
  packagingCharge: number;
  /** Commissionable value = Selling price − Discount + Packaging charge. */
  cv: number;
  commission: number;
  gstOnCommission: number;
  ads: number;
  /** Money the platform settles into your bank. */
  payout: number;
  /** Dish cost + Labour + Packaging cost. */
  totalCost: number;
  profit: number;
  profitPercent: number | null;
  payoutPercent: number | null;
  waterfall: WaterfallStep[];
  errors: string[];
}

export const totalCostOf = (c: OrderCosts) => nonNegative(c.dishCost) + nonNegative(c.labourCost) + nonNegative(c.packagingCost);

/**
 * Discount         = Selling price × Discount %
 * CV               = Selling price − Discount + Packaging charge   (commissionable value)
 * Commission       = CV × Commission %
 * GST on commission= Commission × 18%
 * Ads              = CV × Ads %
 * Payout           = CV − Commission − GST on commission − Ads
 * GST the customer pays on food is not included: the platform collects and pays it, so the restaurant never receives it.
 * Profit           = Payout − (Dish cost + Labour + Packaging cost)
 * Profit %         = Profit ÷ Selling price × 100;  Payout % = Payout ÷ Selling price × 100
 */
export function calculateOnlinePayout(input: OnlinePayoutInputs): OnlinePayoutResult {
  const sp = nonNegative(input.sellingPrice);
  const pct = (p: number) => nonNegative(p) / 100;
  const errors: string[] = [];
  if ([input.commissionPercent, input.discountPercent, input.adsPercent].some((p) => nonNegative(p) > 100)) errors.push("Percentages cannot be more than 100%.");

  const packagingCharge = nonNegative(input.packagingCharge ?? 0);
  const discount = sp * pct(input.discountPercent);
  const cv = sp - discount + packagingCharge;
  const commission = cv * pct(input.commissionPercent);
  const gstOnCommission = commission * (GST_ON_COMMISSION_PERCENT / 100);
  const ads = cv * pct(input.adsPercent);
  const payout = cv - commission - gstOnCommission - ads;
  const totalCost = totalCostOf(input);
  const profit = payout - totalCost;

  let running = sp;
  const steps: WaterfallStep[] = [];
  const push = (key: string, label: string, amount: number, kind: WaterfallStep["kind"]) => {
    if (kind === "deduction") running -= amount;
    if (kind === "addition") running += amount;
    if (kind === "subtotal" || kind === "result" || kind === "start") running = amount;
    steps.push({ key, label, amount: kind === "deduction" ? -amount : amount, running, kind });
  };
  push("price", "Selling price", sp, "start");
  push("discount", "Discount", discount, "deduction");
  if (packagingCharge > 0) push("packCharge", "Packaging charge", packagingCharge, "addition");
  push("cv", "Commissionable value", cv, "subtotal");
  push("commission", "Commission", commission, "deduction");
  push("gstCommission", `GST on commission (${GST_ON_COMMISSION_PERCENT}%)`, gstOnCommission, "deduction");
  push("ads", "Ads", ads, "deduction");
  push("payout", "Payout", payout, "subtotal");
  push("dish", "Dish cost", nonNegative(input.dishCost), "deduction");
  push("labour", "Labour", nonNegative(input.labourCost), "deduction");
  push("packCost", "Packaging cost", nonNegative(input.packagingCost), "deduction");
  push("profit", "Profit", profit, "result");

  if (sp > 0 && profit < 0) errors.push("This order loses money after all deductions.");

  return {
    sellingPrice: sp,
    discount,
    packagingCharge,
    cv,
    commission,
    gstOnCommission,
    ads,
    payout,
    totalCost,
    profit,
    profitPercent: percentOf(profit, sp),
    payoutPercent: percentOf(payout, sp),
    waterfall: steps,
    errors,
  };
}

/**
 * Share of the commissionable value you keep as payout:
 * k = 1 − Ads − 1.18 × Commission
 */
export function payoutFactor(r: PlatformRates): number {
  const a = nonNegative(r.adsPercent) / 100;
  const c = nonNegative(r.commissionPercent) / 100;
  return 1 - a - (1 + GST_ON_COMMISSION_PERCENT / 100) * c;
}
