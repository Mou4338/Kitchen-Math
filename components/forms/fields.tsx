"use client";

import { useId, type ReactNode } from "react";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { InfoTip } from "@/components/ui/InfoTip";
import { cn } from "@/lib/utils/cn";
import { CurrencyInput, NumberInput, PercentInput, RangeSlider } from "./inputs";

export function FieldShell({ id, label, tooltip, hint, error, children, className, trailing }: { id: string; label: string; tooltip?: string; hint?: string; error?: string; children: ReactNode; className?: string; trailing?: ReactNode }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <label htmlFor={id} className="text-sm font-medium text-ink">{label}</label>
          {tooltip ? <InfoTip text={tooltip} label={`About ${label}`} /> : null}
        </div>
        {trailing}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-danger">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

/** Props shared by every form-bound field. `name` is checked against the form's own fields. */
interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  tooltip?: string;
  hint?: string;
  className?: string;
}

export function CurrencyField<T extends FieldValues>({ control, name, label, tooltip, hint, className }: FormFieldProps<T>) {
  const id = useId();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FieldShell id={id} label={label} tooltip={tooltip} hint={hint} error={fieldState.error?.message} className={className}>
          <CurrencyInput
            id={id}
            name={field.name}
            value={Number(field.value)}
            onValueChange={field.onChange}
            onBlur={field.onBlur}
            invalid={!!fieldState.error}
            aria-describedby={fieldState.error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          />
        </FieldShell>
      )}
    />
  );
}

export function PercentField<T extends FieldValues>({ control, name, label, tooltip, hint, className }: FormFieldProps<T>) {
  const id = useId();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FieldShell id={id} label={label} tooltip={tooltip} hint={hint} error={fieldState.error?.message} className={className}>
          <PercentInput
            id={id}
            name={field.name}
            value={Number(field.value)}
            onValueChange={field.onChange}
            onBlur={field.onBlur}
            invalid={!!fieldState.error}
            aria-describedby={fieldState.error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          />
        </FieldShell>
      )}
    />
  );
}

export function NumberField<T extends FieldValues>({ control, name, label, tooltip, hint, className, suffix, prefix }: FormFieldProps<T> & { suffix?: string; prefix?: string }) {
  const id = useId();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FieldShell id={id} label={label} tooltip={tooltip} hint={hint} error={fieldState.error?.message} className={className}>
          <NumberInput
            id={id}
            name={field.name}
            value={Number(field.value)}
            onValueChange={field.onChange}
            onBlur={field.onBlur}
            invalid={!!fieldState.error}
            suffix={suffix}
            prefix={prefix}
            aria-describedby={fieldState.error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          />
        </FieldShell>
      )}
    />
  );
}

/** Slider + exact number box, bound to the form. */
export function SliderField<T extends FieldValues>({ control, name, label, tooltip, hint, className, min, max, step = 0.5, unit = "%" }: FormFieldProps<T> & { min: number; max: number; step?: number; unit?: string }) {
  const id = useId();
  const fmt = (v: number) => `${Number(v.toFixed(2))}${unit}`;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FieldShell
          id={`${id}-num`}
          label={label}
          tooltip={tooltip}
          hint={hint}
          error={fieldState.error?.message}
          className={className}
          trailing={
            <NumberInput
              id={`${id}-num`}
              value={Number(field.value)}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
              suffix={unit}
              invalid={!!fieldState.error}
              className="h-10 w-28"
              aria-label={`${label} exact value`}
            />
          }
        >
          <RangeSlider value={Number(field.value) || 0} min={min} max={max} step={step} onValueChange={field.onChange} format={fmt} label={label} />
        </FieldShell>
      )}
    />
  );
}

/** Uncontrolled-by-form slider for scenario controls. */
export function ScenarioSlider({ label, value, onChange, min, max, step = 1, format }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; step?: number; format: (v: number) => string }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-3 text-sm">
        <label id={`${id}-label`} htmlFor={id} className="font-medium">{label}</label>
        <span className={cn("tabular rounded-md px-2 py-0.5 text-xs font-semibold", value === 0 ? "bg-wash text-muted" : "bg-accent-soft text-accent-dark")}>{format(value)}</span>
      </div>
      <RangeSlider id={id} value={value} min={min} max={max} step={step} onValueChange={onChange} format={format} aria-labelledby={`${id}-label`} />
    </div>
  );
}
