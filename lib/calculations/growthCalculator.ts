import { nonNegative, percentOf } from "./utils";

/**
 * The Growth Equation: Traffic × Conversion × AOV × Repeat orders = Revenue.
 * Because the levers multiply, small improvements in each compound into a large total uplift.
 */
export interface GrowthInputs {
  /** Unique customers who open your menu each month. */
  monthlyVisitors: number;
  /** % of those visitors who place an order (menu-to-order conversion, M2O). */
  conversionPercent: number;
  /** Average order value, ₹. */
  averageOrderValue: number;
  /** Average orders per ordering customer per month (1 = no repeat). */
  ordersPerCustomer: number;
}

export interface GrowthUplift {
  trafficPercent: number;
  conversionPercent: number;
  aovPercent: number;
  repeatPercent: number;
}

export interface GrowthResult {
  customers: number;
  orders: number;
  revenue: number;
  newCustomers: number;
  newOrders: number;
  newRevenue: number;
  revenueGain: number;
  revenueGainPercent: number | null;
  /** ₹ gain if only that one lever improved. */
  singleLeverGain: { lever: keyof GrowthUplift; label: string; gain: number }[];
  /** Extra gain created by the levers multiplying together. */
  compoundingBonus: number;
}

export function monthlyRevenue(i: GrowthInputs): number {
  return nonNegative(i.monthlyVisitors) * (Math.min(100, nonNegative(i.conversionPercent)) / 100) * nonNegative(i.averageOrderValue) * nonNegative(i.ordersPerCustomer);
}

export function applyUplift(i: GrowthInputs, u: GrowthUplift): GrowthInputs {
  const f = (p: number) => 1 + (Number.isFinite(p) ? p : 0) / 100;
  return {
    monthlyVisitors: nonNegative(i.monthlyVisitors) * f(u.trafficPercent),
    conversionPercent: Math.min(100, nonNegative(i.conversionPercent) * f(u.conversionPercent)),
    averageOrderValue: nonNegative(i.averageOrderValue) * f(u.aovPercent),
    ordersPerCustomer: nonNegative(i.ordersPerCustomer) * f(u.repeatPercent),
  };
}

const LABELS: Record<keyof GrowthUplift, string> = {
  trafficPercent: "Traffic",
  conversionPercent: "Conversion",
  aovPercent: "AOV",
  repeatPercent: "Repeat orders",
};

export function calculateGrowth(i: GrowthInputs, u: GrowthUplift): GrowthResult {
  const n = applyUplift(i, u);
  const revenue = monthlyRevenue(i);
  const newRevenue = monthlyRevenue(n);
  const zero: GrowthUplift = { trafficPercent: 0, conversionPercent: 0, aovPercent: 0, repeatPercent: 0 };
  const singleLeverGain = (Object.keys(LABELS) as (keyof GrowthUplift)[]).map((lever) => ({
    lever,
    label: LABELS[lever],
    gain: monthlyRevenue(applyUplift(i, { ...zero, [lever]: u[lever] })) - revenue,
  }));
  const sumSingles = singleLeverGain.reduce((s, x) => s + x.gain, 0);
  const customers = nonNegative(i.monthlyVisitors) * (Math.min(100, nonNegative(i.conversionPercent)) / 100);
  const newCustomers = n.monthlyVisitors * (n.conversionPercent / 100);
  return {
    customers,
    orders: customers * nonNegative(i.ordersPerCustomer),
    revenue,
    newCustomers,
    newOrders: newCustomers * n.ordersPerCustomer,
    newRevenue,
    revenueGain: newRevenue - revenue,
    revenueGainPercent: percentOf(newRevenue - revenue, revenue),
    singleLeverGain,
    compoundingBonus: newRevenue - revenue - sumSingles,
  };
}
