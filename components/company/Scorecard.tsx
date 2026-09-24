"use client";

import Link from "next/link";
import { ArrowRight, Mail, RotateCcw } from "lucide-react";
import { useState } from "react";
import { CircularScore } from "@/components/charts/CircularScore";
import { StatusPill } from "@/components/ui/StatusPill";
import { scoreScorecard } from "@/lib/calculations/scorecardCalculator";
import type { Tone } from "@/lib/calculations/utils";
import { SERVICES } from "@/lib/content/company";
import { ANSWER_LABELS, SCORECARD, type AnswerValue } from "@/lib/content/scorecard";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils/cn";

const tone = (s: number | null): Tone => (s === null ? "neutral" : s >= 75 ? "good" : s >= 45 ? "watch" : "bad");
const BAND = { strong: "Strong foundations", developing: "Room to grow", early: "Big opportunities ahead" };
const BAR: Record<Tone, string> = { good: "bg-sage", watch: "bg-caution", bad: "bg-danger", neutral: "bg-line-strong" };

/** 18-question self-audit across the 9 service areas, with live scores and priorities. */
export function Scorecard() {
  const [answers, setAnswers] = useState<(AnswerValue | undefined)[][]>(() => SCORECARD.map((a) => a.questions.map(() => undefined)));
  const r = scoreScorecard(SCORECARD, answers);
  const set = (a: number, q: number, v: AnswerValue) => setAnswers(answers.map((row, i) => (i === a ? row.map((x, j) => (j === q ? v : x)) : row)));
  const progress = Math.round((r.answered / r.total) * 100);

  const emailBody = [
    "Hi, here are my Growth Scorecard results:",
    "",
    ...r.areas.map((a) => `${a.title}: ${a.score === null ? "not answered" : `${a.score}/100`}`),
    "",
    `Overall: ${r.overall ?? "—"}/100`,
    r.priorities.length ? `Top priorities: ${r.priorities.map((p) => p.title).join(", ")}` : "",
    "",
    "Restaurant name:",
    "City:",
  ].join("\n");

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.9fr)]">
      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border border-line bg-card p-4 shadow-card">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-semibold">{r.answered} of {r.total} answered</span>
            <button type="button" onClick={() => setAnswers(SCORECARD.map((a) => a.questions.map(() => undefined)))} className="inline-flex items-center gap-1.5 text-muted hover:text-ink"><RotateCcw className="h-4 w-4" aria-hidden /> Start over</button>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-wash" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Scorecard progress">
            <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {SCORECARD.map((area, ai) => {
          const svc = SERVICES.find((s) => s.id === area.serviceId);
          const sc = r.areas[ai].score;
          return (
            <fieldset key={area.serviceId} className="rounded-3xl border border-line bg-card p-5 shadow-card sm:p-6">
              <legend className="sr-only">{area.title}</legend>
              <div className="flex items-center justify-between gap-3">
                <p className="flex items-center gap-3 font-bold">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent-soft text-xs font-bold text-accent-dark">{svc?.number}</span>
                  {area.title}
                </p>
                {sc !== null ? <StatusPill tone={tone(sc)}>{sc}/100</StatusPill> : null}
              </div>
              <div className="mt-4 grid gap-4">
                {area.questions.map((q, qi) => (
                  <div key={q} className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-4">
                    <p className="text-sm leading-relaxed text-ink-soft">{q}</p>
                    <div className="grid grid-cols-3 gap-1 rounded-xl bg-wash p-1" role="radiogroup" aria-label={q}>
                      {ANSWER_LABELS.map((opt) => {
                        const on = answers[ai][qi] === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            role="radio"
                            aria-checked={on}
                            onClick={() => set(ai, qi, opt.value)}
                            className={cn(
                              "h-10 min-w-[4.5rem] rounded-lg px-3 text-sm font-semibold transition",
                              on ? (opt.value === 2 ? "bg-sage text-paper" : opt.value === 1 ? "bg-caution text-paper" : "bg-danger text-paper") : "text-muted hover:bg-card hover:text-ink",
                            )}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>
          );
        })}
      </div>

      <aside className="flex flex-col gap-4 lg:sticky lg:top-24" aria-live="polite">
        <div className="rounded-3xl bg-inverse p-6 text-on-inverse shadow-lift sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-bright">Your growth score</p>
          <div className="mt-4 flex items-center gap-5">
            <CircularScore value={r.overall} tone={tone(r.overall)} label="Growth score" size={108} />
            <div>
              <p className="text-2xl font-bold">{r.band ? BAND[r.band] : "Answer to see your score"}</p>
              <p className="mt-1 text-sm text-on-inverse/70">{r.complete ? "All 9 areas scored." : `${9 - r.areas.filter((a) => a.score !== null).length} areas still to answer.`}</p>
            </div>
          </div>
          <ul className="mt-6 grid gap-2.5">
            {r.areas.map((a) => (
              <li key={a.serviceId} className="grid grid-cols-[7.5rem_minmax(0,1fr)_2.5rem] items-center gap-3 text-sm">
                <span className="truncate text-on-inverse/80">{a.title}</span>
                <span className="h-2 overflow-hidden rounded-full bg-on-inverse/10"><span className={cn("block h-full rounded-full transition-all duration-500", BAR[tone(a.score)])} style={{ width: `${a.score ?? 0}%` }} /></span>
                <span className="tabular text-right font-semibold">{a.score ?? "—"}</span>
              </li>
            ))}
          </ul>
        </div>

        {r.priorities.length ? (
          <div className="rounded-3xl border border-line bg-card p-6 shadow-card">
            <h3 className="font-bold">Where to start</h3>
            <ol className="mt-4 grid gap-3">
              {r.priorities.map((p, i) => {
                const svc = SERVICES.find((s) => s.id === p.serviceId);
                return (
                  <li key={p.serviceId}>
                    <Link href={`/services#${p.serviceId}`} className="group flex gap-3 rounded-2xl border border-line p-3 transition hover:border-accent hover:bg-accent-soft/40">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-sm font-bold text-accent-ink">{i + 1}</span>
                      <span className="min-w-0">
                        <span className="block font-semibold">{svc?.title} <span className="font-normal text-muted">· {p.score}/100</span></span>
                        <span className="block text-sm text-muted">{svc?.summary}</span>
                      </span>
                      <ArrowRight className="ml-auto mt-1 h-4 w-4 shrink-0 text-accent transition-transform group-hover:translate-x-1" aria-hidden />
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
        ) : null}

        <a
          href={`mailto:${SITE.company.email}?subject=${encodeURIComponent("My Growth Scorecard results")}&body=${encodeURIComponent(emailBody)}`}
          className={cn("inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-5 font-semibold text-accent-ink shadow-glow transition hover:brightness-110", r.answered === 0 && "pointer-events-none opacity-50")}
          aria-disabled={r.answered === 0}
        >
          <Mail className="h-4 w-4" aria-hidden /> Send my results for a free review
        </a>
        <p className="text-center text-xs text-muted">Your answers stay in this browser until you choose to send them.</p>
      </aside>
    </div>
  );
}
