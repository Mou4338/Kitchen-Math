"use client";

import { RotateCcw, Eraser } from "lucide-react";
import type { ValueSource } from "@/lib/hooks/useCalculatorForm";
import { cn } from "@/lib/utils/cn";

const LABEL: Record<ValueSource, { text: string; cls: string }> = {
  example: { text: "Example numbers: replace them with yours", cls: "bg-accent-soft text-accent-dark" },
  yours: { text: "Your numbers, saved on this device", cls: "bg-sage-soft text-sage-dark" },
  shared: { text: "Opened from a shared link", cls: "bg-wash text-ink" },
  saved: { text: "Loaded from a saved scenario", cls: "bg-wash text-ink" },
};

export function SourceBar({ source, onExample, onClear }: { source: ValueSource; onExample: () => void; onClear: () => void }) {
  const l = LABEL[source];
  return (
    <div className="no-print flex flex-wrap items-center justify-between gap-2">
      <span className={cn("inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold", l.cls)}>{l.text}</span>
      <div className="flex gap-1.5">
        <button type="button" onClick={onExample} className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-muted hover:bg-wash hover:text-ink">
          <RotateCcw className="h-4 w-4" aria-hidden /> Example
        </button>
        <button type="button" onClick={onClear} className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-muted hover:bg-wash hover:text-ink">
          <Eraser className="h-4 w-4" aria-hidden /> Clear all
        </button>
      </div>
    </div>
  );
}
