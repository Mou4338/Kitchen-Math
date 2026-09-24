"use client";

import { ArrowDown } from "lucide-react";
import type { ReactNode } from "react";
import type { Tone } from "@/lib/calculations/utils";
import { cn } from "@/lib/utils/cn";
import { toneText } from "@/lib/utils/tone";

/**
 * Inputs on the left, live results on the right (sticky on desktop).
 * On mobile the columns stack and a compact summary bar stays pinned to the bottom of the screen.
 */
export function CalculatorLayout({ inputs, results, summary }: { inputs: ReactNode; results: ReactNode; summary?: { label: string; value: string; tone?: Tone } }) {
  return (
    <>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-8">
        <div className="flex min-w-0 flex-col gap-5">{inputs}</div>
        <div id="results" className="flex min-w-0 scroll-mt-24 flex-col gap-5 lg:sticky lg:top-24">
          {results}
        </div>
      </div>
      {summary ? (
        <div className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-line bg-card/95 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+10px)] pt-2.5 shadow-lift backdrop-blur lg:hidden">
          <a href="#results" className="flex items-center justify-between gap-3">
            <span className="min-w-0">
              <span className="eyebrow block">{summary.label}</span>
              <span className={cn("tabular block truncate text-xl font-bold", toneText[summary.tone ?? "neutral"], !summary.tone && "text-ink")}>{summary.value}</span>
            </span>
            <span className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-accent px-3.5 text-sm font-medium text-accent-ink">
              Results <ArrowDown className="h-4 w-4" aria-hidden />
            </span>
          </a>
        </div>
      ) : null}
    </>
  );
}

/** A titled group of inputs. */
export function InputGroup({ title, description, children, icon, className }: { title: string; description?: string; children: ReactNode; icon?: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6", className)} aria-label={title}>
      <div className="mb-4 flex items-start gap-3">
        {icon ? <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-dark">{icon}</span> : null}
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          {description ? <p className="mt-0.5 text-sm text-muted">{description}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

export function FieldGrid({ children, cols = 2 }: { children: ReactNode; cols?: 1 | 2 | 3 }) {
  return <div className={cn("grid gap-4", cols === 2 && "sm:grid-cols-2", cols === 3 && "sm:grid-cols-2 xl:grid-cols-3")}>{children}</div>;
}

/** Section heading used between blocks below the calculator (visual analysis, scenario, insights). */
export function BlockTitle({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="mb-4 max-w-2xl">
      {eyebrow ? <p className="eyebrow mb-1.5 text-accent-dark">{eyebrow}</p> : null}
      <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
      {description ? <p className="mt-1.5 text-sm text-muted sm:text-base">{description}</p> : null}
    </div>
  );
}
