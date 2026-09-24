import { describe, expect, it } from "vitest";
import { calculateHealth, scoreFoodCost, scoreLaborCost, scoreMarketing, simulateHealth, healthGrade } from "@/lib/calculations/healthCalculator";
import { DEFAULT_BENCHMARKS } from "@/lib/calculations/benchmarks";

const base = { openingStock: 120000, purchases: 380000, closingStock: 95000, foodSales: 1250000, staffSalaries: 320000, monthlySales: 1400000, marketingSpend: 42000 };

describe("health calculator", () => {
  it("calculates food cost % from stock movement", () => {
    const r = calculateHealth(base);
    expect(r.cogs).toBe(405000);
    expect(r.foodCostPercent).toBeCloseTo(32.4, 5);
  });

  it("calculates labor and marketing %", () => {
    const r = calculateHealth(base);
    expect(r.laborCostPercent).toBeCloseTo(22.857, 2);
    expect(r.marketingPercent).toBeCloseTo(3, 5);
  });

  it("calculates prime cost as (COGS + salaries) ÷ monthly sales", () => {
    const r = calculateHealth(base);
    expect(r.primeCostPercent).toBeCloseTo(((405000 + 320000) / 1400000) * 100, 5);
  });

  it("weights metric scores into a transparent health score", () => {
    const r = calculateHealth(base);
    // food 32.4% scores 93 (between 30 and 35), labor and marketing score 100
    expect(r.metrics.map((m) => m.score)).toEqual([93, 100, 100]);
    expect(r.healthScore).toBe(Math.round(93 * 0.45 + 100 * 0.35 + 100 * 0.2));
    expect(r.grade?.letter).toBe("A");
  });

  it("scores only metrics that were entered", () => {
    const r = calculateHealth({ ...base, staffSalaries: 0, marketingSpend: 0 });
    expect(r.laborCostPercent).toBeNull();
    expect(r.marketingPercent).toBeNull();
    expect(r.healthScore).toBe(93);
  });

  it("returns null instead of NaN/Infinity when sales are zero", () => {
    const r = calculateHealth({ ...base, foodSales: 0, monthlySales: 0 });
    expect(r.foodCostPercent).toBeNull();
    expect(r.laborCostPercent).toBeNull();
    expect(r.healthScore).toBeNull();
    expect(r.errors.length).toBeGreaterThan(0);
  });

  it("flags closing stock above opening + purchases", () => {
    const r = calculateHealth({ ...base, closingStock: 999999 });
    expect(r.foodCostPercent).toBeNull();
    expect(r.errors[0]).toMatch(/Closing stock/);
  });

  it("treats negative values as zero", () => {
    const r = calculateHealth({ ...base, marketingSpend: -5000 });
    expect(r.marketingPercent).toBeNull();
  });

  it("handles very large values", () => {
    const r = calculateHealth({ ...base, foodSales: 1e11, purchases: 3e10, openingStock: 0, closingStock: 0 });
    expect(r.foodCostPercent).toBeCloseTo(30, 5);
  });

  it("scoring functions follow the benchmark bands", () => {
    expect(scoreFoodCost(28)).toBe(100);
    expect(scoreFoodCost(35)).toBeCloseTo(85);
    expect(scoreFoodCost(40)).toBeCloseTo(50);
    expect(scoreFoodCost(80)).toBe(5);
    expect(scoreLaborCost(22)).toBe(100);
    expect(scoreLaborCost(35)).toBeCloseTo(45);
    expect(scoreMarketing(3)).toBe(100);
    expect(scoreMarketing(0)).toBe(40);
    expect(scoreMarketing(6)).toBeCloseTo(70);
  });

  it("respects custom benchmarks", () => {
    const custom = { ...DEFAULT_BENCHMARKS, foodCostMax: 30 };
    const r = calculateHealth(base, custom);
    expect(r.metrics[0].tone).toBe("watch");
  });

  it("grades scores", () => {
    expect(healthGrade(90).letter).toBe("A");
    expect(healthGrade(60).letter).toBe("C");
    expect(healthGrade(10).letter).toBe("E");
  });

  it("simulates a 2-point food cost reduction", () => {
    const s = simulateHealth(base, { foodCostChangePts: -2, salesChangePercent: 0, laborChangePercent: 0, marketingChangePercent: 0 });
    expect(s.foodCostSaving).toBeCloseTo(25000, 5);
    expect(s.scenario.foodCostPercent).toBeCloseTo(30.4, 5);
  });

  it("simulates +10% sales contribution after food cost", () => {
    const s = simulateHealth(base, { foodCostChangePts: 0, salesChangePercent: 10, laborChangePercent: 0, marketingChangePercent: 0 });
    expect(s.salesContribution).toBeCloseTo(1400000 * 0.1 * (1 - 0.324), 3);
  });
});
