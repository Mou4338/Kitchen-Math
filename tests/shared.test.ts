import { describe, expect, it } from "vitest";
import { compareScenario } from "@/lib/calculations/scenario";
import { formatINR, formatINRCompact, formatPercent, parseNumberInput } from "@/lib/formatters/number";
import { parseCsv, toCsv } from "@/lib/export/csv";
import { decodeState, encodeState } from "@/lib/share";

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
