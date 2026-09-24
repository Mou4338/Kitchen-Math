"use client";

import { useRef, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface TabItem {
  id: string;
  label: ReactNode;
  meta?: ReactNode;
}

/** Accessible tab list with arrow-key navigation. Panels are rendered by the parent. */
export function Tabs({ items, value, onChange, idPrefix, className }: { items: TabItem[]; value: string; onChange: (id: string) => void; idPrefix: string; className?: string }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (e.key === "ArrowRight") next = (index + 1) % items.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + items.length) % items.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = items.length - 1;
    else return;
    e.preventDefault();
    onChange(items[next].id);
    refs.current[next]?.focus();
  };
  return (
    <div role="tablist" className={cn("grid gap-1 rounded-xl bg-wash p-1", className)} style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
      {items.map((t, i) => {
        const selected = t.id === value;
        return (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            type="button"
            id={`${idPrefix}-tab-${t.id}`}
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel-${t.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => onKey(e, i)}
            className={cn(
              "flex min-h-[48px] flex-col items-center justify-center rounded-lg px-2 py-1.5 text-sm font-medium transition-colors",
              selected ? "bg-card text-ink shadow-card" : "text-muted hover:text-ink",
            )}
          >
            <span>{t.label}</span>
            {t.meta ? <span className="tabular text-xs text-muted">{t.meta}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
