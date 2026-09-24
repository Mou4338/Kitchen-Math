import { nonNegative, percentOf } from "./utils";

export const GST_ON_COMMISSION_PERCENT = 18;

export interface OnlinePayoutInputs {
  orderValue: number;
  commissionPercent: number;
  gatewayPercent: number;
  discountPercent: number;
  adsPercent: number;
  foodCostPercent: number;
  /** Statutory; kept as an input for testing and future changes. */
  gstOnCommissionPercent?: number;
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
  orderValue: number;
  discount: number;
  commission: number;
  gstOnCommission: number;
  gateway: number;
  /** Money the platform settles into your bank. */
  payout: number;
  ads: number;
  foodCost: number;
  profit: number;
  profitPercent: number | null;
  payoutPercent: number | null;
  /** Commission + GST + gateway. */
  platformFees: number;
  /** Everything taken out before profit. */
  totalDeductions: number;
  waterfall: WaterfallStep[];
  errors: string[];
}

/**
 * Payout = Order − Discount − Commission − GST on commission − Gateway
 * Profit = Payout − Ads − Food cost
 * All percentages apply to the order value; GST applies to the commission amount.
 */
export function calculateOnlinePayout(input: OnlinePayoutInputs): OnlinePayoutResult {
  const orderValue = nonNegative(input.orderValue);
  const gstRate = input.gstOnCommissionPercent === undefined ? GST_ON_COMMISSION_PERCENT : nonNegative(input.gstOnCommissionPercent);
  const errors: string[] = [];
  const pcts = [input.commissionPercent, input.gatewayPercent, input.discountPercent, input.adsPercent, input.foodCostPercent];
  if (pcts.some((p) => nonNegative(p) > 100)) errors.push("Percentages cannot be more than 100%.");

  const pct = (p: number) => Math.min(100, nonNegative(p)) / 100;
  const discount = orderValue * pct(input.discountPercent);
  const commission = orderValue * pct(input.commissionPercent);
  const gstOnCommission = commission * (gstRate / 100);
  const gateway = orderValue * pct(input.gatewayPercent);
  const payout = orderValue - discount - commission - gstOnCommission - gateway;
  const ads = orderValue * pct(input.adsPercent);
  const foodCost = orderValue * pct(input.foodCostPercent);
  const profit = payout - ads - foodCost;
  const platformFees = commission + gstOnCommission + gateway;

  let running = orderValue;
  const step = (key: string, label: string, amount: number, kind: WaterfallStep["kind"]): WaterfallStep => {
    if (kind === "deduction") running -= amount;
    return { key, label, amount: kind === "deduction" ? -amount : amount, running, kind };
  };
  const waterfall: WaterfallStep[] = [
    step("order", "Customer order", orderValue, "start"),
    step("discount", "Discount you fund", discount, "deduction"),
    step("commission", "Platform commission", commission, "deduction"),
    step("gst", "GST on commission (18%)", gstOnCommission, "deduction"),
    step("gateway", "Payment gateway", gateway, "deduction"),
    step("payout", "Restaurant payout", payout, "subtotal"),
    step("ads", "Advertising", ads, "deduction"),
    step("food", "Food cost", foodCost, "deduction"),
    step("profit", "True profit", profit, "result"),
  ];

  if (orderValue > 0 && profit < 0) errors.push("This order loses money after all deductions.");

  return {
    orderValue,
    discount,
    commission,
    gstOnCommission,
    gateway,
    payout,
    ads,
    foodCost,
    profit,
    profitPercent: percentOf(profit, orderValue),
    payoutPercent: percentOf(payout, orderValue),
    platformFees,
    totalDeductions: orderValue - profit,
    waterfall,
    errors,
  };
}

/* ---------- Monthly simulation ---------- */

export interface MonthlyInputs {
  ordersPerDay: number;
  averageOrderValue: number;
  daysPerMonth: number;
}

export interface MonthlyResult {
  orders: number;
  gmv: number;
  commissions: number;
  gstOnCommission: number;
  gateway: number;
  discounts: number;
  adSpend: number;
  foodCost: number;
  payout: number;
  profit: number;
  platformFees: number;
  profitPercent: number | null;
}

export function simulateMonthly(rates: Omit<OnlinePayoutInputs, "orderValue">, m: MonthlyInputs): MonthlyResult {
  const orders = nonNegative(m.ordersPerDay) * nonNegative(m.daysPerMonth);
  const gmv = orders * nonNegative(m.averageOrderValue);
  const r = calculateOnlinePayout({ ...rates, orderValue: gmv });
  return {
    orders,
    gmv,
    commissions: r.commission,
    gstOnCommission: r.gstOnCommission,
    gateway: r.gateway,
    discounts: r.discount,
    adSpend: r.ads,
    foodCost: r.foodCost,
    payout: r.payout,
    profit: r.profit,
    platformFees: r.platformFees,
    profitPercent: r.profitPercent,
  };
}

/* ---------- Platform comparison ---------- */

export interface ChannelConfig {
  id: string;
  name: string;
  commissionPercent: number;
  gatewayPercent: number;
  discountPercent: number;
  adsPercent: number;
}

export interface ChannelResult extends ChannelConfig {
  result: OnlinePayoutResult;
}

export function compareChannels(orderValue: number, foodCostPercent: number, channels: ChannelConfig[]): ChannelResult[] {
  return channels.map((c) => ({
    ...c,
    result: calculateOnlinePayout({
      orderValue,
      foodCostPercent,
      commissionPercent: c.commissionPercent,
      gatewayPercent: c.gatewayPercent,
      discountPercent: c.discountPercent,
      adsPercent: c.adsPercent,
    }),
  }));
}

export const DEFAULT_CHANNELS: ChannelConfig[] = [
  { id: "a", name: "Platform A", commissionPercent: 27, gatewayPercent: 2, discountPercent: 10, adsPercent: 10 },
  { id: "b", name: "Platform B", commissionPercent: 25, gatewayPercent: 2, discountPercent: 10, adsPercent: 8 },
  { id: "direct", name: "Direct order", commissionPercent: 0, gatewayPercent: 2, discountPercent: 5, adsPercent: 3 },
];
