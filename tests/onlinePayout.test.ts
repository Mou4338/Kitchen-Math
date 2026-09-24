import { describe, expect, it } from "vitest";
import { calculateOnlinePayout, compareChannels, simulateMonthly, DEFAULT_CHANNELS } from "@/lib/calculations/onlinePayoutCalculator";

const rates = { commissionPercent: 27, gatewayPercent: 2, discountPercent: 10, adsPercent: 10, foodCostPercent: 30 };

describe("online payout calculator", () => {
  it("matches the ₹1,000 reference example exactly", () => {
    const r = calculateOnlinePayout({ ...rates, orderValue: 1000 });
    expect(r.commission).toBeCloseTo(270, 6);
    expect(r.gstOnCommission).toBeCloseTo(48.6, 6);
    expect(r.gateway).toBeCloseTo(20, 6);
    expect(r.discount).toBeCloseTo(100, 6);
    expect(r.payout).toBeCloseTo(561.4, 6);
    expect(r.ads).toBeCloseTo(100, 6);
    expect(r.foodCost).toBeCloseTo(300, 6);
    expect(r.profit).toBeCloseTo(161.4, 6);
    expect(r.profitPercent).toBeCloseTo(16.14, 6);
  });

  it("applies GST only to the commission", () => {
    const r = calculateOnlinePayout({ ...rates, orderValue: 500, commissionPercent: 20 });
    expect(r.gstOnCommission).toBeCloseTo(100 * 0.18, 6);
  });

  it("builds a waterfall whose running total ends at profit", () => {
    const r = calculateOnlinePayout({ ...rates, orderValue: 1000 });
    const last = r.waterfall[r.waterfall.length - 1];
    expect(last.key).toBe("profit");
    expect(last.amount).toBeCloseTo(161.4, 6);
    const payout = r.waterfall.find((s) => s.key === "payout");
    expect(payout?.running).toBeCloseTo(561.4, 6);
  });

  it("flags loss-making orders", () => {
    const r = calculateOnlinePayout({ ...rates, orderValue: 1000, discountPercent: 40 });
    expect(r.profit).toBeLessThan(0);
    expect(r.errors.join(" ")).toMatch(/loses money/);
  });

  it("handles zero order value", () => {
    const r = calculateOnlinePayout({ ...rates, orderValue: 0 });
    expect(r.profit).toBe(0);
    expect(r.profitPercent).toBeNull();
  });

  it("caps impossible percentages at 100 and reports an error", () => {
    const r = calculateOnlinePayout({ ...rates, orderValue: 100, commissionPercent: 150 });
    expect(r.commission).toBeCloseTo(100, 6);
    expect(r.errors[0]).toMatch(/100%/);
  });

  it("simulates a month", () => {
    const m = simulateMonthly(rates, { ordersPerDay: 40, averageOrderValue: 450, daysPerMonth: 30 });
    expect(m.orders).toBe(1200);
    expect(m.gmv).toBe(540000);
    expect(m.commissions).toBeCloseTo(145800, 6);
    expect(m.profit).toBeCloseTo(540000 * 0.1614, 4);
  });

  it("compares channels and direct orders keep the most", () => {
    const res = compareChannels(1000, 30, DEFAULT_CHANNELS);
    const direct = res.find((c) => c.id === "direct");
    const a = res.find((c) => c.id === "a");
    expect(direct!.result.profit).toBeGreaterThan(a!.result.profit);
    expect(direct!.result.commission).toBe(0);
  });
});
