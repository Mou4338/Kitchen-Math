import { describe, expect, it } from "vitest";
import { applyBreakEvenScenario, breakEvenChartData, breakEvenRevenue, calculateBreakEven, BREAK_EVEN_IMPOSSIBLE } from "@/lib/calculations/breakEvenCalculator";

const base = { monthlyRevenue: 500000, variableCostPercent: 34, rent: 80000, salaries: 120000, utilities: 35000, otherFixed: 0, averageOrderValue: 350, daysOpen: 30 };

describe("break-even calculator", () => {
  it("computes contribution margin, break-even and net profit", () => {
    const r = calculateBreakEven(base);
    expect(r.fixedCosts).toBe(235000);
    expect(r.contributionMarginPercent).toBe(66);
    expect(r.breakEvenRevenue).toBeCloseTo(356060.606, 2);
    expect(r.netProfit).toBeCloseTo(95000, 5);
  });

  it("computes margin of safety in rupees and percent", () => {
    const r = calculateBreakEven(base);
    expect(r.marginOfSafety).toBeCloseTo(143939.39, 1);
    expect(r.marginOfSafetyPercent).toBeCloseTo(28.79, 1);
    expect(r.status).toBe("strong");
  });

  it("matches the reference dine-in example", () => {
    const r = calculateBreakEven({ monthlyRevenue: 800000, variableCostPercent: 25, rent: 150000, salaries: 250000, utilities: 50000 });
    expect(r.breakEvenRevenue).toBeCloseTo(600000, 5);
    expect(r.netProfit).toBeCloseTo(150000, 5);
    expect(r.marginOfSafetyPercent).toBeCloseTo(25, 5);
  });

  it("detects a restaurant operating below break-even", () => {
    const r = calculateBreakEven({ monthlyRevenue: 250000, variableCostPercent: 40, rent: 60000, salaries: 90000, utilities: 30000 });
    expect(r.breakEvenRevenue).toBeCloseTo(300000, 5);
    expect(r.marginOfSafety).toBeCloseTo(-50000, 5);
    expect(r.status).toBe("loss");
  });

  it("returns a clear error at 100% variable cost", () => {
    const r = calculateBreakEven({ ...base, variableCostPercent: 100 });
    expect(r.breakEvenRevenue).toBeNull();
    expect(r.status).toBe("impossible");
    expect(r.error).toBe(BREAK_EVEN_IMPOSSIBLE);
    expect(breakEvenRevenue(1000, 120)).toBeNull();
  });

  it("handles zero revenue without NaN", () => {
    const r = calculateBreakEven({ ...base, monthlyRevenue: 0 });
    expect(r.marginOfSafety).toBeNull();
    expect(r.marginOfSafetyPercent).toBeNull();
    expect(r.netMarginPercent).toBeNull();
    expect(r.status).toBe("incomplete");
  });

  it("computes daily and order targets plus the buffered sales target", () => {
    const r = calculateBreakEven(base);
    expect(r.dailyBreakEven).toBeCloseTo(356060.606 / 30, 2);
    expect(r.ordersPerDayToBreakEven).toBeCloseTo(356060.606 / 30 / 350, 3);
    expect(r.targetRevenue).toBeCloseTo(356060.606 * 1.2, 1);
  });

  it("supports decimal percentages", () => {
    const r = calculateBreakEven({ ...base, variableCostPercent: 33.5 });
    expect(r.breakEvenRevenue).toBeCloseTo(235000 / 0.665, 3);
  });

  it("applies scenarios", () => {
    const s = applyBreakEvenScenario(base, { revenueChangePercent: 10, variableCostChangePts: -2, rentChangePercent: 10, salaryChangePercent: 10 });
    expect(s.monthlyRevenue).toBeCloseTo(550000, 5);
    expect(s.variableCostPercent).toBe(32);
    expect(s.rent).toBeCloseTo(88000, 5);
    expect(s.salaries).toBeCloseTo(132000, 5);
  });

  it("produces chart points", () => {
    const pts = breakEvenChartData(base);
    expect(pts.length).toBe(15);
    expect(pts[0].totalCost).toBe(235000);
    expect(breakEvenChartData({ ...base, monthlyRevenue: 0, rent: 0, salaries: 0, utilities: 0 })).toEqual([]);
  });
});
