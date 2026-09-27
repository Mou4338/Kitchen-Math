"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Loader2, RotateCcw, Send } from "lucide-react";
import { useState } from "react";
import { CircularScore } from "@/components/charts/CircularScore";
import { StatusPill } from "@/components/ui/StatusPill";
import { scoreScorecard } from "@/lib/calculations/scorecardCalculator";
import type { Tone } from "@/lib/calculations/utils";
import { SERVICES } from "@/lib/content/company";
import { ANSWER_LABELS, SCORECARD, type AnswerValue } from "@/lib/content/scorecard";
import { submitLead } from "@/lib/leads";
import { cn } from "@/lib/utils/cn";

const tone = (s: number | null): Tone => (s === null ? "neutral" : s >= 75 ? "good" : s >= 45 ? "watch" : "bad");
const BAND = { strong: "Strong foundations", developing: "Room to grow", early: "Big opportunities ahead" };
const BAR: Record<Tone, string> = { good: "bg-sage", watch: "bg-caution", bad: "bg-danger", neutral: "bg-line-strong" };

/** Two questions per service area, with live scores, priorities and a "send my results" form. */
export function Scorecard() {
  const [answers, setAnswers] = useState<(AnswerValue | undefined)[][]>(() => SCORECARD.map((a) => a.questions.map(() => undefined)));
  const r = scoreScorecard(SCORECARD, answers);
  const set = (a: number, q: number, v: AnswerValue) => setAnswers(answers.map((row, i) => (i === a ? row.map((x, j) => (j === q ? v : x)) : row)));
  const progress = Math.round((r.answered / r.total) * 100);

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
              <p className="mt-1 text-sm text-on-inverse/70">{r.complete ? `All ${SCORECARD.length} areas scored.` : `${SCORECARD.length - r.areas.filter((a) => a.score !== null).length} areas still to answer.`}</p>
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

        <SendResults result={r} />
      </aside>
    </div>
  );
}

type ScoreResult = ReturnType<typeof scoreScorecard>;

/** Saves the visitor's contact details and scores to Google Sheets (via /api/lead). */
function SendResults({ result: r }: { result: ScoreResult }) {
  const [name, setName] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);
  const field = "h-11 w-full rounded-xl border border-line-strong bg-card px-3.5 text-sm text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/15";
  const disabled = r.answered === 0;

  if (status === "sent") {
    return (
      <div role="status" className="flex items-start gap-3 rounded-3xl border border-sage/30 bg-sage-soft p-5">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-sage-dark" aria-hidden />
        <p className="text-sm"><b>Results sent.</b> We&apos;ll review them and get back to you with where to start.</p>
      </div>
    );
  }

  return (
    <form
      className="grid gap-3 rounded-3xl border border-line bg-card p-5 shadow-card"
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        if (!name.trim() || !restaurant.trim() || !phone.trim()) {
          setError("Please add your name, restaurant and phone number.");
          return;
        }
        setError(null);
        setStatus("sending");
        const res = await submitLead({
          formType: "scorecard",
          name, restaurant, phone, city, website,
          overallScore: r.overall,
          areaScores: Object.fromEntries(r.areas.map((a) => [a.title, a.score])),
          priorities: r.priorities.map((p) => p.title),
        });
        if (res.ok) setStatus("sent");
        else { setStatus("idle"); setError(res.error); }
      }}
    >
      <h3 className="font-bold">Get a free review of your results</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <input aria-label="Your name" placeholder="Your name *" value={name} onChange={(e) => setName(e.target.value)} className={field} autoComplete="name" maxLength={100} />
        <input aria-label="Restaurant name" placeholder="Restaurant name *" value={restaurant} onChange={(e) => setRestaurant(e.target.value)} className={field} autoComplete="organization" maxLength={120} />
        <input aria-label="Phone or WhatsApp" placeholder="Phone / WhatsApp *" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={field} autoComplete="tel" maxLength={30} />
        <input aria-label="City" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className={field} autoComplete="address-level2" maxLength={60} />
      </div>
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>
      {error ? <p role="alert" className="text-sm font-medium text-danger">{error}</p> : null}
      <button
        type="submit"
        disabled={disabled || status === "sending"}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-5 font-semibold text-accent-ink shadow-glow transition hover:brightness-110 disabled:opacity-50"
      >
        {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
        {status === "sending" ? "Sending…" : "Send my results"}
      </button>
      <p className="text-center text-xs text-muted">{disabled ? "Answer at least one question first." : "Your answers stay in this browser until you send them."}</p>
    </form>
  );
}
