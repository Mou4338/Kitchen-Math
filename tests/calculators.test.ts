import { describe, expect, it } from "vitest";
import { calculateMenuPrice, REDUCE_MESSAGE, roundUpToNine } from "@/lib/calculations/menuPricingCalculator";
import { calculateOnlinePayout, totalDeductionsRate } from "@/lib/calculations/onlinePayoutCalculator";
import { analyzeMenu, type MenuItemInput } from "@/lib/calculations/menuEngineeringCalculator";
import { menuItemsToCsv, parseMenuCsv } from "@/lib/export/menuCsv";

const RATES = { commissionPercent: 25, taxPercent: 18, discountPercent: 10, adsPercent: 5 };
const COSTS = { dishCost: 100, labourCost: 15, packagingCost: 15 };

describe("total deductions %", () => {
  it("= Commission × (1 + Tax) + Discount + Ads × (1 + Tax)", () => {
    expect(totalDeductionsRate(RATES)).toBeCloseTo(0.25 * 1.18 + 0.1 + 0.05 * 1.18, 12);
    expect(totalDeductionsRate(RATES) * 100).toBeCloseTo(45.4, 10);
  });
});

describe("menu pricing calculator", () => {
  it("matches the worked example: ₹130 cost, 20% margin → ₹379", () => {
    const r = calculateMenuPrice({ ...COSTS, ...RATES, marginPercent: 20 });
    expect(r.totalCost).toBe(130);
    expect(r.breakEvenPrice).toBeCloseTo(130 / (1 - 0.454), 8);
    expect(r.breakEvenPrice).toBeCloseTo(238.0952, 3);
    expect(r.exactPrice).toBeCloseTo(130 / (1 - 0.454 - 0.2), 8);
    expect(r.exactPrice).toBeCloseTo(375.7225, 3);
    expect(r.menuPrice).toBe(379);
    expect(r.errors).toEqual([]);
  });

  it("the rounded price earns at least the target margin", () => {
    const r = calculateMenuPrice({ ...COSTS, ...RATES, marginPercent: 20 });
    expect(r.check?.profitPercent).toBeGreaterThanOrEqual(20);
    expect(r.check?.profitPercent).toBeCloseTo(20.2992, 3);
  });

  it("says 'reduce discount or margin' when deductions + margin ≥ 100%", () => {
    const r = calculateMenuPrice({ ...COSTS, ...RATES, marginPercent: 54.6 });
    expect(r.errors).toContain(REDUCE_MESSAGE);
    expect(r.menuPrice).toBeNull();
    const over = calculateMenuPrice({ ...COSTS, commissionPercent: 30, taxPercent: 18, discountPercent: 60, adsPercent: 10, marginPercent: 20 });
    expect(over.errors).toContain(REDUCE_MESSAGE);
    expect(over.breakEvenPrice).toBeNull();
  });

  it("handles zero cost and zero deductions", () => {
    expect(calculateMenuPrice({ dishCost: 0, labourCost: 0, packagingCost: 0, ...RATES, marginPercent: 20 }).menuPrice).toBeNull();
    const plain = calculateMenuPrice({ ...COSTS, commissionPercent: 0, taxPercent: 0, discountPercent: 0, adsPercent: 0, marginPercent: 0 });
    expect(plain.breakEvenPrice).toBe(130);
    expect(plain.menuPrice).toBe(139);
  });

  it("rounds up to end in 9", () => {
    expect(roundUpToNine(375.72)).toBe(379);
    expect(roundUpToNine(379)).toBe(379);
    expect(roundUpToNine(379.01)).toBe(389);
    expect(roundUpToNine(380)).toBe(389);
    expect(roundUpToNine(3)).toBe(9);
    expect(roundUpToNine(0)).toBe(0);
  });
});

describe("online payout & profit calculator", () => {
  it("matches the worked example: ₹379 order", () => {
    const r = calculateOnlinePayout({ sellingPrice: 379, ...COSTS, ...RATES });
    expect(r.discount).toBeCloseTo(37.9, 10);
    expect(r.commission).toBeCloseTo(94.75, 10);
    expect(r.gstOnCommission).toBeCloseTo(17.055, 10);
    expect(r.ads).toBeCloseTo(18.95, 10);
    expect(r.gstOnAds).toBeCloseTo(3.411, 10);
    expect(r.payout).toBeCloseTo(206.934, 10);
    expect(r.totalCost).toBe(130);
    expect(r.profit).toBeCloseTo(76.934, 10);
    expect(r.profitPercent).toBeCloseTo(20.2992, 3);
    expect(r.payoutPercent).toBeCloseTo(54.6, 10);
  });

  it("waterfall ends at the profit", () => {
    const r = calculateOnlinePayout({ sellingPrice: 379, ...COSTS, ...RATES });
    expect(r.waterfall.at(-1)?.amount).toBeCloseTo(r.profit, 10);
    expect(r.waterfall.find((w) => w.key === "payout")?.running).toBeCloseTo(r.payout, 10);
  });

  it("flags loss-making orders and handles zero price", () => {
    expect(calculateOnlinePayout({ sellingPrice: 150, ...COSTS, ...RATES }).errors).toContain("This order loses money after all deductions.");
    const zero = calculateOnlinePayout({ sellingPrice: 0, ...COSTS, ...RATES });
    expect(zero.profitPercent).toBeNull();
    expect(zero.payoutPercent).toBeNull();
  });
});

describe("menu engineering calculator", () => {
  const items: MenuItemInput[] = Array.from({ length: 10 }, (_, i) => ({ id: `d${i}`, name: `Dish ${i}`, sellingPrice: 300 + i * 20, totalCost: 120, orders: i === 0 ? 5 : 100 }));

  it("uses the payout formula for profit per order", () => {
    const r = analyzeMenu([{ id: "a", name: "Biryani", sellingPrice: 379, totalCost: 130, orders: 10 }], RATES);
    expect(r.items[0].profitPerOrder).toBeCloseTo(76.934, 10);
    expect(r.items[0].totalProfit).toBeCloseTo(769.34, 8);
  });

  it("popularity line = (100% ÷ dishes) × 0.7, 7% with 10 dishes", () => {
    const r = analyzeMenu(items, RATES);
    expect(r.popularityLinePercent).toBeCloseTo(7, 10);
    const total = 5 + 9 * 100;
    expect(r.totalOrders).toBe(total);
    expect(r.items[0].menuMixPercent).toBeCloseTo((5 / total) * 100, 10);
    expect(r.items[0].popular).toBe(false);
    expect(r.items[1].popular).toBe(true);
  });

  it("average profit per order = total profit ÷ total orders", () => {
    const r = analyzeMenu(items, RATES);
    const sum = r.items.reduce((s, i) => s + i.totalProfit, 0);
    expect(r.totalProfit).toBeCloseTo(sum, 8);
    expect(r.averageProfitPerOrder).toBeCloseTo(sum / r.totalOrders, 10);
    r.items.forEach((i) => expect(i.profitable).toBe(i.profitPerOrder > 0 && i.profitPerOrder >= r.averageProfitPerOrder - 1e-9));
  });

  it("classifies Stars, Puzzles, Plowhorses and Dogs", () => {
    const r = analyzeMenu(
      [
        { id: "s", name: "Star", sellingPrice: 500, totalCost: 100, orders: 100 },
        { id: "p", name: "Puzzle", sellingPrice: 500, totalCost: 100, orders: 5 },
        { id: "h", name: "Plowhorse", sellingPrice: 200, totalCost: 100, orders: 100 },
        { id: "d", name: "Dog", sellingPrice: 200, totalCost: 100, orders: 5 },
      ],
      RATES,
    );
    expect(r.items.map((i) => i.category)).toEqual(["star", "puzzle", "plowhorse", "dog"]);
  });

  it("handles an empty menu", () => {
    const r = analyzeMenu([], RATES);
    expect(r.totalOrders).toBe(0);
    expect(r.averageProfitPerOrder).toBe(0);
    expect(r.popularityLinePercent).toBe(0);
  });

  it("round-trips the menu CSV", () => {
    const csv = menuItemsToCsv([{ id: "x", name: "Paneer, Tikka", sellingPrice: 299, totalCost: 110, orders: 42 }]);
    const back = parseMenuCsv(csv, () => "id1");
    expect(back.errors).toEqual([]);
    expect(back.items).toEqual([{ id: "id1", name: "Paneer, Tikka", sellingPrice: 299, totalCost: 110, orders: 42 }]);
    expect(parseMenuCsv("Dish,Price\nA,1").errors[0]).toMatch(/Missing column/);
  });
});
