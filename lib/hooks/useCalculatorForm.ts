"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch, type DefaultValues, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodTypeAny } from "zod";
import { decodeState } from "@/lib/share";
import { clearDraft, loadDraft, saveDraft } from "@/lib/storage/drafts";

export type ValueSource = "example" | "yours" | "shared" | "saved";

/** Keep only known numeric keys; anything invalid falls back to the default. */
export function pickNumbers<T extends Record<string, number>>(input: unknown, defaults: T): T {
  const out = { ...defaults };
  if (!input || typeof input !== "object") return out;
  (Object.keys(defaults) as (keyof T)[]).forEach((k) => {
    const v = (input as Record<string, unknown>)[k as string];
    if (typeof v === "number" && Number.isFinite(v)) out[k] = v as T[keyof T];
  });
  return out;
}

/**
 * Shared form state for every calculator:
 * - react-hook-form + zod validation (errors shown per field)
 * - loads shared state from ?s=… or the last draft on this device
 * - autosaves a draft after each edit
 * - exposes sanitized numeric values for the pure calculation functions
 */
export function useCalculatorForm<T extends Record<string, number>>(slug: string, schema: ZodTypeAny, defaults: T, keepOnClear: readonly string[] = []) {
  const form = useForm<T>({
    resolver: zodResolver(schema) as unknown as Resolver<T>,
    defaultValues: defaults as DefaultValues<T>,
    mode: "onChange",
  });
  const [source, setSource] = useState<ValueSource>("example");
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    const params = new URLSearchParams(window.location.search);
    const shared = params.get("s");
    if (shared) {
      const decoded = decodeState(shared);
      if (decoded) {
        const next = pickNumbers(decoded, defaults);
        form.reset(next);
        saveDraft(slug, next);
        setSource(params.get("from") === "saved" ? "saved" : "shared");
        void form.trigger();
        window.history.replaceState(null, "", window.location.pathname);
        return;
      }
    }
    const draft = loadDraft<T>(slug);
    if (draft) {
      form.reset(pickNumbers(draft, defaults));
      setSource("yours");
      void form.trigger();
    }
  }, [form, slug, defaults]);

  useEffect(() => {
    const sub = form.watch((values, info) => {
      if (info.type === "change") {
        saveDraft(slug, values);
        setSource("yours");
      }
    });
    return () => sub.unsubscribe();
  }, [form, slug]);

  const watched = useWatch({ control: form.control });
  const values = useMemo(() => pickNumbers(watched, defaults), [watched, defaults]);

  const loadValues = useCallback(
    (v: unknown, from: ValueSource = "saved") => {
      form.reset(pickNumbers(v, defaults));
      setSource(from);
      void form.trigger();
      if (from !== "example") saveDraft(slug, pickNumbers(v, defaults));
    },
    [form, defaults, slug],
  );

  const resetToExample = useCallback(() => {
    form.reset(defaults);
    clearDraft(slug);
    setSource("example");
  }, [form, defaults, slug]);

  const clearAll = useCallback(() => {
    const zero = Object.fromEntries(Object.keys(defaults).map((k) => [k, keepOnClear.includes(k) ? defaults[k] : 0])) as T;
    form.reset(zero);
    saveDraft(slug, zero);
    setSource("yours");
  }, [form, defaults, slug, keepOnClear]);

  const hasErrors = Object.keys(form.formState.errors).length > 0;

  return { form, control: form.control, values, source, loadValues, resetToExample, clearAll, hasErrors };
}
