import { isFiniteNumber } from "../formatters/number";

export type MetricFormat = "inr" | "percent" | "number" | "months";

export interface ScenarioMetric {
  label: string;
  current: number | null;
  scenario: number | null;
  format: MetricFormat;
  /** Whether an increase is good ("up"), bad ("down") or neither ("neutral"). */
  better: "up" | "down" | "neutral";
}

export interface ScenarioRow extends ScenarioMetric {
  change: number | null;
  tone: "good" | "bad" | "neutral";
}

/** Compare current vs scenario values and colour-code the direction of change. */
export function compareScenario(metrics: ScenarioMetric[]): ScenarioRow[] {
  return metrics.map((m) => {
    const change = isFiniteNumber(m.current) && isFiniteNumber(m.scenario) ? m.scenario - m.current : null;
    let tone: ScenarioRow["tone"] = "neutral";
    if (change !== null && Math.abs(change) > 1e-9 && m.better !== "neutral") {
      tone = (change > 0) === (m.better === "up") ? "good" : "bad";
    }
    return { ...m, change, tone };
  });
}
