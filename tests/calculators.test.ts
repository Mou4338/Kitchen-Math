import { describe, expect, it } from "vitest";
import { calculateMenuPrice, NO_PRICE_MESSAGE, roundUpToNine } from "@/lib/calculations/menuPricingCalculator";
import { calculateOnlinePayout, GST_ON_COMMISSION_PERCENT, payoutFactor } from "@/lib/calculations/onlinePayoutCalculator";
import { analyzeMenu, classify, type MenuItemInput } from "@/lib/calculations/menuEngineeringCalculator";
import { menuItemsToCsv, parseMenuCsv } from "@/lib/export/menuCsv";

const RATES = { discountPercent: 10, commissionPercent: 25, adsPercent: 5, gstOnOrderPercent: 5 };
const COSTS = { dishCost: 100, labourCost: 15, packagingCost: 15 };

describe("shared payout calculation", () => {
  it("follows the waterfall: ₹309 worked example", () => {
    const r = calculateOnlinePayout({ sellingPrice: 309, ...COSTS, ...RATES });
    expect(r.discount).toBeCloseTo(30.9, 10);
    expect(r.cv).toBeCloseTo(278.1, 10);
    expect(r.commission).toBeCloseTo(69.525, 10);
    expect(r.gstOnCommission).toBeCloseTo(12.5145, 10);
    expect(r.customerGst).toBeCloseTo(13.905, 10);
    expect(r.netSales).toBeCloseTo(292.005, 10);
    expect(r.ads).toBeCloseTo(14.60025, 10);
    expect(r.payout).toBeCloseTo(195.36525, 10);
    expect(r.totalCost).toBe(130);
    expect(r.profit).toBeCloseTo(65.36525, 10);
    expect(r.profitPercent).toBeCloseTo((65.36525 / 309) * 100, 10);
    expect(r.payoutPercent).toBeCloseTo((195.36525 / 309) * 100, 10);
  });

  it("GST on commission is fixed at 18%", () => {
    expect(GST_ON_COMMISSION_PERCENT).toBe(18);
    const r = calculateOnlinePayout({ sellingPrice: 500, ...COSTS, ...RATES, discountPercent: 0, commissionPercent: 20 });
    expect(r.gstOnCommission).toBeCloseTo(100 * 0.18, 10);
  });

  it("adds the packaging charge to the commissionable value", () => {
    const r = calculateOnlinePayout({ sellingPrice: 200, ...COSTS, ...RATES, packagingCharge: 20 });
    expect(r.cv).toBeCloseTo(200 - 20 + 20, 10);
    expect(r.commission).toBeCloseTo(200 * 0.25, 10);
  });

  it("waterfall running total lands on payout and profit", () => {
    const r = calculateOnlinePayout({ sellingPrice: 309, ...COSTS, ...RATES });
    expect(r.waterfall.find((w) => w.key === "cv")?.running).toBeCloseTo(r.cv, 10);
    const payoutStep = r.waterfall.findIndex((w) => w.key === "payout");
    expect(r.waterfall[payoutStep - 1].running).toBeCloseTo(r.payout, 10);
    expect(r.waterfall.at(-2)?.running).toBeCloseTo(r.profit, 10);
    expect(r.waterfall.at(-1)?.amount).toBeCloseTo(r.profit, 10);
  });

  it("flags loss-making orders and handles a zero price", () => {
    expect(calculateOnlinePayout({ sellingPrice: 150, ...COSTS, ...RATES }).errors).toContain("This order loses money after all deductions.");
    const zero = calculateOnlinePayout({ sellingPrice: 0, ...COSTS, ...RATES });
    expect(zero.profitPercent).toBeNull();
    expect(zero.payoutPercent).toBeNull();
  });
});

describe("menu pricing calculator", () => {
  it("solves the payout formula backwards", () => {
    const r = calculateMenuPrice({ ...COSTS, ...RATES, marginPercent: 20 });
    const factor0 = 0.9 * (1.05 * 0.95 - 1.18 * 0.25);
    expect(r.breakEvenFactor).toBeCloseTo(factor0, 12);
    expect(r.breakEvenPrice).toBeCloseTo(130 / factor0, 8);
    expect(r.breakEvenPrice).toBeCloseTo(205.6149, 3);
    expect(r.exactPrice).toBeCloseTo(130 / (factor0 - 0.2), 8);
    expect(r.recommendedPrice).toBe(309);
    expect(r.errors).toEqual([]);
  });

  it("break-even price really earns ₹0, and the exact price really earns the margin", () => {
    const r = calculateMenuPrice({ ...COSTS, ...RATES, marginPercent: 20 });
    expect(r.breakEvenCheck?.profit).toBeCloseTo(0, 8);
    const atExact = calculateOnlinePayout({ ...COSTS, ...RATES, sellingPrice: r.exactPrice! });
    expect(atExact.profitPercent).toBeCloseTo(20, 8);
    expect(r.check?.profitPercent).toBeGreaterThanOrEqual(20);
  });

  it("handles a packaging charge to the customer", () => {
    const r = calculateMenuPrice({ ...COSTS, ...RATES, packagingCharge: 20, marginPercent: 20 });
    const atExact = calculateOnlinePayout({ ...COSTS, ...RATES, packagingCharge: 20, sellingPrice: r.exactPrice! });
    expect(atExact.profitPercent).toBeCloseTo(20, 8);
  });

  it("returns the no-price message when the factor is zero or less", () => {
    const r = calculateMenuPrice({ ...COSTS, ...RATES, marginPercent: 70 });
    expect(r.errors).toContain(NO_PRICE_MESSAGE);
    expect(r.recommendedPrice).toBeNull();
    expect(payoutFactor({ ...RATES, commissionPercent: 90 })).toBeLessThan(0);
  });

  it("rounds up to end in 9 and never below the price", () => {
    expect(roundUpToNine(300.75)).toBe(309);
    expect(roundUpToNine(309)).toBe(309);
    expect(roundUpToNine(380)).toBe(389);
    expect(roundUpToNine(379.5)).toBe(389);
    expect(roundUpToNine(3)).toBe(9);
    expect(roundUpToNine(0)).toBe(0);
  });
});

describe("menu engineering calculator", () => {
  it("uses the shared payout calculation for every dish", () => {
    const r = analyzeMenu([{ id: "a", name: "Biryani", sellingPrice: 309, ...COSTS, unitsSold: 10 }], RATES);
    expect(r.items[0].payoutPerUnit).toBeCloseTo(195.36525, 10);
    expect(r.items[0].profitPerUnit).toBeCloseTo(65.36525, 10);
    expect(r.items[0].totalProfit).toBeCloseTo(653.6525, 8);
  });

  it("uses simple averages and the four categories", () => {
    const items: MenuItemInput[] = [
      { id: "s", name: "Star", sellingPrice: 500, dishCost: 100, labourCost: 0, packagingCost: 0, unitsSold: 100 },
      { id: "p", name: "Puzzle", sellingPrice: 500, dishCost: 100, labourCost: 0, packagingCost: 0, unitsSold: 5 },
      { id: "h", name: "Plow Horse", sellingPrice: 200, dishCost: 100, labourCost: 0, packagingCost: 0, unitsSold: 100 },
      { id: "d", name: "Dog", sellingPrice: 200, dishCost: 100, labourCost: 0, packagingCost: 0, unitsSold: 5 },
    ];
    const r = analyzeMenu(items, RATES);
    expect(r.averagePopularity).toBeCloseTo(52.5, 10);
    expect(r.averageProfit).toBeCloseTo(r.items.reduce((s, i) => s + i.profitPerUnit, 0) / 4, 10);
    expect(r.items.map((i) => i.category)).toEqual(["star", "puzzle", "plowhorse", "dog"]);
  });

  it("classify() matches the rules", () => {
    expect(classify(10, 10, 5, 5)).toBe("star");
    expect(classify(1, 10, 5, 5)).toBe("plowhorse");
    expect(classify(10, 1, 5, 5)).toBe("puzzle");
    expect(classify(1, 1, 5, 5)).toBe("dog");
  });

  it("lets a dish override the shared rates", () => {
    const base = { id: "x", name: "X", sellingPrice: 300, ...COSTS, unitsSold: 10 };
    const r = analyzeMenu([base, { ...base, id: "y", overrides: { discountPercent: 0 } }], RATES);
    expect(r.items[1].profitPerUnit).toBeGreaterThan(r.items[0].profitPerUnit);
  });

  it("handles an empty menu", () => {
    const r = analyzeMenu([], RATES);
    expect(r.totalUnits).toBe(0);
    expect(r.averageProfit).toBe(0);
    expect(r.averagePopularity).toBe(0);
  });

  it("round-trips the menu CSV and reads older single-cost files", () => {
    const csv = menuItemsToCsv([{ id: "x", name: "Paneer, Tikka", sellingPrice: 299, dishCost: 90, labourCost: 12, packagingCost: 13, unitsSold: 42 }]);
    const back = parseMenuCsv(csv, () => "id1");
    expect(back.errors).toEqual([]);
    expect(back.items).toEqual([{ id: "id1", name: "Paneer, Tikka", sellingPrice: 299, dishCost: 90, labourCost: 12, packagingCost: 13, unitsSold: 42 }]);
    const old = parseMenuCsv("Dish Name,Selling Price,Total Cost,Orders\nDal,289,80,510", () => "id2");
    expect(old.items).toEqual([{ id: "id2", name: "Dal", sellingPrice: 289, dishCost: 80, labourCost: 0, packagingCost: 0, unitsSold: 510 }]);
    expect(parseMenuCsv("Dish,Price\nA,1").errors[0]).toMatch(/Missing column/);
  });
});
