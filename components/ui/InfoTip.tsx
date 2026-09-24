"use client";

import { Info } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

/** Accessible explanation popover: opens on hover, focus or tap; closes on Escape or outside click. */
export function InfoTip({ text, label = "More information", className }: { text: string; label?: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <span ref={ref} className={cn("relative inline-flex", className)} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-label={label}
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="grid h-5 w-5 place-items-center rounded-full text-muted-light transition-colors hover:text-ink focus-visible:text-ink"
      >
        <Info className="h-4 w-4" aria-hidden />
      </button>
      {open ? (
        <span
          role="tooltip"
          id={id}
          className="absolute bottom-[calc(100%+8px)] left-1/2 z-40 w-64 max-w-[80vw] -translate-x-1/2 animate-fade-in rounded-xl bg-inverse px-3 py-2.5 text-left text-xs font-normal leading-relaxed text-on-inverse shadow-lift"
        >
          {text}
        </span>
      ) : null}
    </span>
  );
}
