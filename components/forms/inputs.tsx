"use client";

import { forwardRef, useState, type CSSProperties, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import { formatIndianInput, parseNumberInput } from "@/lib/formatters/number";

const shell =
  "group flex h-12 w-full items-center rounded-xl border bg-card transition-colors focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/15";

interface BaseProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> {
  value: number | null | undefined;
  onValueChange: (value: number) => void;
  invalid?: boolean;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

/**
 * Number input that shows Indian digit grouping (1,50,000) when not focused
 * and the raw number while typing. Empty input becomes 0.
 */
export const NumberInput = forwardRef<HTMLInputElement, BaseProps>(function NumberInput(
  { value, onValueChange, invalid, prefix, suffix, decimals = 2, className, onBlur, onFocus, placeholder = "0", ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState("");
  const numeric = typeof value === "number" && Number.isFinite(value) ? value : null;
  const display = focused ? draft : numeric === null || numeric === 0 ? "" : formatIndianInput(numeric);

  return (
    <div className={cn(shell, invalid ? "border-danger" : "border-line-strong", className)}>
      {prefix ? <span className="select-none pl-3.5 text-base font-medium text-muted" aria-hidden>{prefix}</span> : null}
      <input
        ref={ref}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        className="tabular h-full w-full min-w-0 flex-1 bg-transparent px-3 text-base font-semibold text-ink outline-none placeholder:font-normal placeholder:text-muted-light"
        value={display}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        onFocus={(e) => {
          setFocused(true);
          setDraft(numeric === null || numeric === 0 ? "" : String(Number(numeric.toFixed(decimals))));
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        onChange={(e) => {
          const raw = e.target.value;
          if (!/^-?[\d,₹\s]*\.?\d*$/.test(raw)) return; // ignore letters
          setDraft(raw);
          const parsed = parseNumberInput(raw);
          onValueChange(parsed === null ? 0 : parsed);
        }}
        {...rest}
      />
      {suffix ? <span className="select-none pr-3.5 text-sm font-medium text-muted" aria-hidden>{suffix}</span> : null}
    </div>
  );
});

export function CurrencyInput(props: Omit<BaseProps, "prefix">) {
  return <NumberInput prefix="₹" {...props} />;
}

export function PercentInput(props: Omit<BaseProps, "suffix">) {
  return <NumberInput suffix="%" decimals={2} placeholder="0.0" {...props} />;
}

export interface RangeSliderProps {
  id?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onValueChange: (value: number) => void;
  format?: (v: number) => string;
  label?: string;
  "aria-labelledby"?: string;
}

/** Large, touch-friendly native range slider (native keyboard + screen-reader support). */
export function RangeSlider({ id, value, min, max, step = 1, onValueChange, format = (v) => String(v), label, ...aria }: RangeSliderProps) {
  const safe = Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : min;
  const fill = max === min ? 0 : ((safe - min) / (max - min)) * 100;
  return (
    <div>
      <input
        id={id}
        type="range"
        className="km-range"
        min={min}
        max={max}
        step={step}
        value={safe}
        aria-label={label}
        aria-valuetext={format(safe)}
        style={{ "--fill": `${fill}%` } as CSSProperties}
        onChange={(e) => onValueChange(Number(e.target.value))}
        {...aria}
      />
      <div className="tabular -mt-1 flex justify-between text-[11px] text-muted-light" aria-hidden>
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}
