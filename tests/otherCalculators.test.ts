import { describe, expect, it } from "vitest";
import { calculateMenuPrice, roundMenuPrice } from "@/lib/calculations/menuPricingCalculator";
import { calculateFoodCost, calculateFoodCostPercent } from "@/lib/calculations/foodCostCalculator";
import { calculatePrimeCost } from "@/lib/calculations/primeCostCalculator";
import { calculateProfitMargin } from "@/lib/calculations/profitMarginCalculator";
import { calculateRoi, roiScenarios } from "@/lib/calculations/roiCalculator";
import { analyzeMenu } from "@/lib/calculations/menuEngineeringCalculator";
import { compareScenario } from "@/lib/calculations/scenario";
import { calculateSnapshot } from "@/lib/calculations/snapshotCalculator";
import { formatINR, formatINRCompact, formatPercent, parseNumberInput } from "@/lib/formatters/number";
import { parseMenuCsv, menuItemsToCsv } from "@/lib/export/menuCsv";
import { parseCsv, toCsv } from "@/lib/export/csv";
import { decodeState, encodeState } from "@/lib/share";

describe("menu pricing", () => {
  it("rounds prices to menu endings", () => {
    expect(roundMenuPrice(316.67, "9")).toBe(319);
    expect(roundMenuPrice(319, "9")).toBe(319);
    expect(roundMenuPrice(319.5, "9")).toBe(329);
    expect(roundMenuPrice(301, "5")).toBe(305);
    expect(roundMenuPrice(301, "10")).toBe(310);
    expect(roundMenuPrice(300.2, "none")).toBe(301);
    expect(roundMenuPrice(0, "9")).toBe(0);
    // never rounds below the calculated price, but ignores floating-point noise
    expect(roundMenuPrice(317.0012, "none")).toBe(318);
    expect(roundMenuPrice(300.0000000001, "none")).toBe(300);
    expect(roundMenuPrice(0.1 * 3 * 1000, "10")).toBe(300);
  });

  it("always meets the food cost and margin targets after rounding", () => {
    for (let i = 0; i < 500; i++) {
      const input = { ingredientCost: 1 + (i * 37) % 499, packagingCost: (i * 7) % 40, prepLaborCost: (i * 13) % 90, commissionPercent: (i * 3) % 32, gatewayPercent: 2, gstPercent: 5, targetFoodCostPercent: 20 + (i % 25), targetProfitMarginPercent: (i * 11) % 35, discountPercent: i % 12, rounding: (["none", "9", "5", "10"] as const)[i % 4] };
      const r = calculateMenuPrice(input);
      expect(r.dineIn.foodCostPercent! <= input.targetFoodCostPercent + 1e-9).toBe(true);
      expect(r.dineIn.profitMarginPercent! >= input.targetProfitMarginPercent - 1e-9).toBe(true);
      if (r.online.price !== null) expect(r.online.profitMarginPercent! >= input.targetProfitMarginPercent - 1e-9).toBe(true);
    }
  });

  it("prices dine-in from the stricter of food cost and margin targets", () => {
    const r = calculateMenuPrice({ ingredientCost: 90, packagingCost: 15, prepLaborCost: 20, commissionPercent: 25, gatewayPercent: 2, gstPercent: 5, targetFoodCostPercent: 30, targetProfitMarginPercent: 25, discountPercent: 10, rounding: "none" });
    expect(r.priceFromFoodCost).toBeCloseTo(300, 6);
    expect(r.priceFromMargin).toBeCloseTo(110 / 0.75, 6);
    expect(r.dineIn.price).toBe(300);
    expect(r.dineIn.priceWithGst).toBeCloseTo(315, 6);
    expect(r.dineIn.expectedProfit).toBeCloseTo(190, 6);
    expect(r.dineIn.foodCostPercent).toBeCloseTo(30, 6);
    expect(r.dineIn.minimumPrice).toBeCloseTo(110, 6);
  });

  it("prices online to cover commission+GST, gateway, discount and the target margin", () => {
    const r = calculateMenuPrice({ ingredientCost: 90, packagingCost: 15, prepLaborCost: 20, commissionPercent: 25, gatewayPercent: 2, gstPercent: 5, targetFoodCostPercent: 30, targetProfitMarginPercent: 25, discountPercent: 10, rounding: "none" });
    const fee = 0.25 * 1.18 + 0.02 + 0.1;
    expect(r.online.price).toBe(Math.ceil(125 / (1 - fee - 0.25)));
    expect(r.online.profitMarginPercent!).toBeGreaterThanOrEqual(25);
    expect(r.online.minimumPrice).toBeCloseTo(125 / (1 - fee), 6);
  });

  it("reports an error when fees and margin reach 100%", () => {
    const r = calculateMenuPrice({ ingredientCost: 90, packagingCost: 0, prepLaborCost: 0, commissionPercent: 60, gatewayPercent: 2, gstPercent: 5, targetFoodCostPercent: 30, targetProfitMarginPercent: 30, discountPercent: 10, rounding: "9" });
    expect(r.online.price).toBeNull();
    expect(r.errors.join(" ")).toMatch(/100%/);
  });
});

describe("food cost", () => {
  it("calculates COGS, food cost % and gross profit", () => {
    const r = calculateFoodCost({ openingInventory: 150000, purchases: 420000, closingInventory: 110000, foodSales: 1400000 });
    expect(r.cogs).toBe(460000);
    expect(r.foodCostPercent).toBeCloseTo(32.857, 2);
    expect(r.grossProfit).toBe(940000);
    expect(calculateFoodCostPercent(150000, 420000, 110000, 1400000)).toBeCloseTo(32.857, 2);
  });

  it("adjusts for waste, spoilage, staff meals and complimentary food", () => {
    const r = calculateFoodCost({ openingInventory: 150000, purchases: 420000, closingInventory: 110000, foodSales: 1400000, waste: 12000, spoilage: 8000, staffMeals: 15000, complimentary: 5000 });
    expect(r.nonRevenueUsage).toBe(40000);
    expect(r.adjustedCogs).toBe(420000);
    expect(r.adjustedFoodCostPercent).toBeCloseTo(30, 6);
  });

  it("handles zero sales and impossible stock", () => {
    expect(calculateFoodCost({ openingInventory: 100, purchases: 0, closingInventory: 0, foodSales: 0 }).foodCostPercent).toBeNull();
    const bad = calculateFoodCost({ openingInventory: 0, purchases: 0, closingInventory: 500, foodSales: 1000 });
    expect(bad.foodCostPercent).toBeNull();
    expect(bad.errors.length).toBe(1);
  });
});

describe("prime cost", () => {
  it("adds food and labor and compares to revenue", () => {
    const r = calculatePrimeCost({ foodCost: 460000, laborCost: 330000, revenue: 1400000 });
    expect(r.primeCost).toBe(790000);
    expect(r.primeCostPercent).toBeCloseTo(56.43, 2);
    expect(r.remainingMargin).toBe(610000);
    expect(r.tone).toBe("good");
  });
  it("handles zero revenue", () => {
    const r = calculatePrimeCost({ foodCost: 10, laborCost: 10, revenue: 0 });
    expect(r.primeCostPercent).toBeNull();
    expect(r.errors.length).toBe(1);
  });
});

describe("profit margin", () => {
  it("builds gross, operating and net profit", () => {
    const r = calculateProfitMargin({ revenue: 1400000, foodCost: 460000, labor: 330000, rent: 150000, utilities: 60000, marketing: 42000, deliveryFees: 90000, otherExpenses: 55000, taxes: 45000 });
    expect(r.grossProfit).toBe(940000);
    expect(r.operatingExpenses).toBe(727000);
    expect(r.operatingProfit).toBe(213000);
    expect(r.netProfit).toBe(168000);
    expect(r.netMarginPercent).toBeCloseTo(12, 6);
    expect(r.waterfall[r.waterfall.length - 1].running).toBe(168000);
  });
});

describe("ROI", () => {
  it("computes ROI and payback without growth", () => {
    const r = calculateRoi({ initialInvestment: 1200000, monthlyRevenue: 1000000, monthlyProfit: 100000, monthlyGrowthPercent: 0 });
    expect(r.monthlyRoiPercent).toBeCloseTo(8.333, 2);
    expect(r.annualRoiPercent).toBeCloseTo(100, 6);
    expect(r.paybackMonths).toBeCloseTo(12, 6);
    expect(r.netMarginPercent).toBeCloseTo(10, 6);
  });
  it("pays back faster with growth", () => {
    const flat = calculateRoi({ initialInvestment: 1200000, monthlyRevenue: 1000000, monthlyProfit: 100000, monthlyGrowthPercent: 0 });
    const grow = calculateRoi({ initialInvestment: 1200000, monthlyRevenue: 1000000, monthlyProfit: 100000, monthlyGrowthPercent: 3 });
    expect(grow.paybackMonths!).toBeLessThan(flat.paybackMonths!);
  });
  it("handles zero or negative profit", () => {
    const r = calculateRoi({ initialInvestment: 1000000, monthlyRevenue: 500000, monthlyProfit: -10000, monthlyGrowthPercent: 0 });
    expect(r.paybackMonths).toBeNull();
    expect(r.message).toMatch(/not paid back/);
    expect(calculateRoi({ initialInvestment: 0, monthlyRevenue: 0, monthlyProfit: 0, monthlyGrowthPercent: 0 }).monthlyRoiPercent).toBeNull();
  });
  it("builds three scenarios", () => {
    expect(roiScenarios({ initialInvestment: 1e6, monthlyRevenue: 5e5, monthlyProfit: 5e4, monthlyGrowthPercent: 1 }).length).toBe(3);
  });
});

describe("menu engineering", () => {
  const items = [
    { id: "1", name: "A", sellingPrice: 300, foodCost: 90, unitsSold: 500 },
    { id: "2", name: "B", sellingPrice: 150, foodCost: 60, unitsSold: 500 },
    { id: "3", name: "C", sellingPrice: 400, foodCost: 100, unitsSold: 20 },
    { id: "4", name: "D", sellingPrice: 100, foodCost: 60, unitsSold: 10 },
  ];
  it("classifies items into the four quadrants", () => {
    const r = analyzeMenu(items);
    const cat = Object.fromEntries(r.items.map((i) => [i.name, i.category]));
    expect(cat).toEqual({ A: "star", B: "plowhorse", C: "puzzle", D: "dog" });
    expect(r.popularityThresholdPercent).toBeCloseTo(17.5, 6);
  });
  it("handles an empty menu", () => {
    const r = analyzeMenu([]);
    expect(r.totalUnits).toBe(0);
    expect(r.overallFoodCostPercent).toBeNull();
  });
  it("round-trips CSV and rejects invalid files", () => {
    const csv = menuItemsToCsv(items);
    const parsed = parseMenuCsv(csv);
    expect(parsed.errors).toEqual([]);
    expect(parsed.items.map((i) => i.name)).toEqual(["A", "B", "C", "D"]);
    expect(parseMenuCsv("foo,bar\n1,2").errors[0]).toMatch(/Missing column/);
    expect(parseMenuCsv("").errors.length).toBe(1);
    const withBad = parseMenuCsv("Item Name,Selling Price,Food Cost,Units Sold\nX,abc,10,5\nY,100,-2,5\nZ,\"1,200\",300,4");
    expect(withBad.items.length).toBe(1);
    expect(withBad.items[0].sellingPrice).toBe(1200);
    expect(withBad.errors.length).toBe(2);
  });
});

describe("scenario comparison", () => {
  it("colours changes by the direction that is better", () => {
    const rows = compareScenario([
      { label: "Profit", current: 100, scenario: 150, format: "inr", better: "up" },
      { label: "Cost", current: 100, scenario: 150, format: "inr", better: "down" },
      { label: "Same", current: 100, scenario: 100, format: "inr", better: "up" },
      { label: "Missing", current: null, scenario: 100, format: "inr", better: "up" },
    ]);
    expect(rows.map((r) => r.tone)).toEqual(["good", "bad", "neutral", "neutral"]);
    expect(rows[3].change).toBeNull();
  });
});

describe("snapshot", () => {
  it("summarises the restaurant", () => {
    const r = calculateSnapshot({ monthlyRevenue: 1000000, foodCost: 320000, laborCost: 230000, marketing: 30000, rent: 120000, otherCosts: 90000 });
    expect(r.primeCostPercent).toBeCloseTo(55, 6);
    expect(r.estimatedProfit).toBe(210000);
    expect(r.breakEvenRevenue).toBeCloseTo(470000 / 0.68, 4);
  });
});

describe("formatters, csv and sharing", () => {
  it("formats Indian rupees", () => {
    expect(formatINR(150000)).toBe("₹1,50,000");
    expect(formatINR(1250000)).toBe("₹12,50,000");
    expect(formatINR(-5000)).toBe("−₹5,000");
    expect(formatINR(561.4, 2)).toBe("₹561.40");
    expect(formatINR(NaN)).toBe("—");
    expect(formatINR(Infinity)).toBe("—");
    expect(formatINRCompact(356060)).toBe("₹3.56L");
    expect(formatINRCompact(12500000)).toBe("₹1.25Cr");
    expect(formatPercent(32.4)).toBe("32.4%");
    expect(formatPercent(30)).toBe("30%");
    expect(formatPercent(null)).toBe("—");
  });
  it("parses user input", () => {
    expect(parseNumberInput("1,50,000")).toBe(150000);
    expect(parseNumberInput("₹ 2,500.50")).toBe(2500.5);
    expect(parseNumberInput("-300")).toBe(-300);
    expect(parseNumberInput("")).toBeNull();
    expect(parseNumberInput("abc")).toBeNull();
  });
  it("round-trips CSV with quotes and commas", () => {
    const rows = [["a", "b,c", 'say "hi"'], ["1", "2", "3"]];
    expect(parseCsv(toCsv(rows))).toEqual(rows);
  });
  it("encodes and decodes share state including unicode", () => {
    const state = { name: "Café ₹", n: 1.5 };
    expect(decodeState(encodeState(state))).toEqual(state);
    expect(decodeState("%%%not-valid")).toBeNull();
  });
});
