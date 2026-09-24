"use client";

import Link from "next/link";
import { ChevronDown, Lightbulb } from "lucide-react";
import { useStorageRaw } from "@/lib/hooks/useStorageRaw";
import { writeJson } from "@/lib/storage/localStore";
import { cn } from "@/lib/utils/cn";

/**
 * "How to use this calculator": numbered steps plus a colour legend.
 * Open on the first visit; the visitor's open/closed choice is remembered on this device.
 */
export function HowToUse({ slug, steps }: { slug: string; steps: string[] }) {
  const key = `km:howto:${slug}`;
  const raw = useStorageRaw(key);
  const open = raw !== '"closed"';
  const toggle = () => writeJson(key, open ? "closed" : "open");

  return (
    <section className="no-print overflow-hidden rounded-2xl border border-accent/25 bg-accent-soft/60" aria-labelledby={`${slug}-howto`}>
      <button type="button" onClick={toggle} aria-expanded={open} aria-controls={`${slug}-howto-body`} className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left">
        <span className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-accent-ink"><Lightbulb className="h-[18px] w-[18px]" aria-hidden /></span>
          <span>
            <span id={`${slug}-howto`} className="block font-semibold">How to use this calculator</span>
            <span className="block text-xs text-muted">{steps.length} quick steps · takes under a minute</span>
          </span>
        </span>
        <ChevronDown className={cn("h-5 w-5 text-muted transition-transform duration-300", open && "rotate-180")} aria-hidden />
      </button>
      <div id={`${slug}-howto-body`} hidden={!open} className="px-5 pb-5">
        <ol className="grid gap-3 sm:grid-cols-2">
          {steps.map((s, i) => (
            <li key={s} className="flex gap-3 rounded-xl bg-card p-3.5 shadow-card">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-inverse text-xs font-bold text-accent-bright">{i + 1}</span>
              <span className="text-sm leading-relaxed text-ink-soft">{s}</span>
            </li>
          ))}
        </ol>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
          <span className="font-semibold text-ink-soft">Colours:</span>
          <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-sage" aria-hidden /> within reference range</span>
          <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-caution" aria-hidden /> worth a look</span>
          <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-danger" aria-hidden /> needs action</span>
          <span>Hover or tap <b className="font-semibold text-ink-soft">ⓘ</b> next to any field for an explanation.</span>
          <Link href="/restaurant/help" className="font-semibold text-accent-dark hover:underline">Full help guide →</Link>
        </div>
      </div>
    </section>
  );
}
