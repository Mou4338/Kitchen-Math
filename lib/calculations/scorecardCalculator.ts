import type { AnswerValue, ScorecardArea } from "@/lib/content/scorecard";

export interface AreaScore {
  serviceId: string;
  title: string;
  /** 0–100, or null if the area is not fully answered. */
  score: number | null;
  answered: number;
  total: number;
}

export interface ScorecardResult {
  areas: AreaScore[];
  /** Average of fully answered areas, 0–100. */
  overall: number | null;
  answered: number;
  total: number;
  complete: boolean;
  /** Up to three lowest-scoring areas (score < 100), weakest first. */
  priorities: AreaScore[];
  band: "strong" | "developing" | "early" | null;
}

/** answers[areaIndex][questionIndex] = 0 | 1 | 2, or undefined when unanswered. */
export function scoreScorecard(areas: ScorecardArea[], answers: (AnswerValue | undefined)[][]): ScorecardResult {
  const scored: AreaScore[] = areas.map((a, i) => {
    const row = answers[i] ?? [];
    const vals = a.questions.map((_, q) => row[q]).filter((v): v is AnswerValue => v === 0 || v === 1 || v === 2);
    const complete = vals.length === a.questions.length;
    return {
      serviceId: a.serviceId,
      title: a.title,
      score: complete ? Math.round((vals.reduce<number>((s, v) => s + v, 0) / (a.questions.length * 2)) * 100) : null,
      answered: vals.length,
      total: a.questions.length,
    };
  });
  const done = scored.filter((a) => a.score !== null);
  const overall = done.length ? Math.round(done.reduce((s, a) => s + (a.score as number), 0) / done.length) : null;
  const answered = scored.reduce((s, a) => s + a.answered, 0);
  const total = scored.reduce((s, a) => s + a.total, 0);
  const priorities = [...done].filter((a) => (a.score as number) < 100).sort((x, y) => (x.score as number) - (y.score as number)).slice(0, 3);
  return {
    areas: scored,
    overall,
    answered,
    total,
    complete: answered === total,
    priorities,
    band: overall === null ? null : overall >= 75 ? "strong" : overall >= 45 ? "developing" : "early",
  };
}
