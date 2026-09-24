import { describe, expect, it } from "vitest";
import { calculateGrowth, monthlyRevenue } from "@/lib/calculations/growthCalculator";
import { scoreScorecard } from "@/lib/calculations/scorecardCalculator";
import { SCORECARD } from "@/lib/content/scorecard";

const base = { monthlyVisitors: 20000, conversionPercent: 12, averageOrderValue: 400, ordersPerCustomer: 1.25 };
const none = { trafficPercent: 0, conversionPercent: 0, aovPercent: 0, repeatPercent: 0 };

describe("growth equation", () => {
  it("multiplies traffic × conversion × AOV × repeat", () => {
    expect(monthlyRevenue(base)).toBeCloseTo(20000 * 0.12 * 400 * 1.25, 6);
    const r = calculateGrowth(base, none);
    expect(r.customers).toBeCloseTo(2400, 6);
    expect(r.orders).toBeCloseTo(3000, 6);
    expect(r.revenueGain).toBeCloseTo(0, 6);
  });

  it("compounds: +10% on all four levers is +46.41%", () => {
    const r = calculateGrowth(base, { trafficPercent: 10, conversionPercent: 10, aovPercent: 10, repeatPercent: 10 });
    expect(r.revenueGainPercent).toBeCloseTo(46.41, 6);
    const singles = r.singleLeverGain.reduce((s, x) => s + x.gain, 0);
    expect(singles).toBeCloseTo(r.revenue * 0.4, 4);
    expect(r.compoundingBonus).toBeCloseTo(r.revenue * 0.0641, 4);
  });

  it("caps conversion at 100% and handles zero/negative input", () => {
    const r = calculateGrowth({ ...base, conversionPercent: 95 }, { ...none, conversionPercent: 50 });
    expect(r.newCustomers).toBeCloseTo(20000, 6);
    const z = calculateGrowth({ monthlyVisitors: 0, conversionPercent: -5, averageOrderValue: 400, ordersPerCustomer: 1 }, none);
    expect(z.revenue).toBe(0);
    expect(z.revenueGainPercent).toBeNull();
  });
});

describe("growth scorecard", () => {
  it("scores areas, overall and priorities", () => {
    const answers = SCORECARD.map((_, i) => (i === 0 ? [0, 0] : i === 1 ? [1, 1] : i === 2 ? [2, 1] : [2, 2])) as (0 | 1 | 2)[][];
    const r = scoreScorecard(SCORECARD, answers);
    expect(r.complete).toBe(true);
    expect(r.areas[0].score).toBe(0);
    expect(r.areas[1].score).toBe(50);
    expect(r.areas[2].score).toBe(75);
    expect(r.priorities.map((p) => p.serviceId)).toEqual(["menu-optimization", "pricing-aov", "ads-discounting"]);
    expect(r.overall).toBe(Math.round((0 + 50 + 75 + 100 * 6) / 9));
  });

  it("ignores unfinished areas and handles no answers", () => {
    const r = scoreScorecard(SCORECARD, [[2]]);
    expect(r.overall).toBeNull();
    expect(r.answered).toBe(1);
    expect(r.band).toBeNull();
  });
});
