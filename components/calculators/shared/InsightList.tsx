import { Lightbulb, TriangleAlert, CircleCheck } from "lucide-react";
import type { Tone } from "@/lib/calculations/utils";
import { cn } from "@/lib/utils/cn";

export interface Insight {
  tone: Tone;
  title: string;
  body: string;
  impact?: string;
}

const ICON = { good: CircleCheck, watch: Lightbulb, bad: TriangleAlert, neutral: Lightbulb };
const COLOR: Record<Tone, string> = { good: "text-sage", watch: "text-caution", bad: "text-danger", neutral: "text-muted" };

export function InsightList({ insights, title = "Improvement opportunities" }: { insights: Insight[]; title?: string }) {
  if (!insights.length) return null;
  return (
    <section className="print-break rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6" aria-label={title}>
      <h2 className="text-base font-semibold sm:text-lg">{title}</h2>
      <ul className="mt-4 flex flex-col divide-y divide-line">
        {insights.map((i) => {
          const Icon = ICON[i.tone];
          return (
            <li key={i.title} className="flex gap-3 py-3 first:pt-0 last:pb-0">
              <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", COLOR[i.tone])} aria-hidden />
              <div className="min-w-0">
                <p className="font-medium">{i.title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-muted">{i.body}</p>
                {i.impact ? <p className="tabular mt-1.5 inline-block rounded-md bg-sage-soft px-2 py-1 text-xs font-semibold text-sage-dark">{i.impact}</p> : null}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-xs text-muted-light">Estimates based on the numbers you entered. Not a guarantee of results.</p>
    </section>
  );
}
