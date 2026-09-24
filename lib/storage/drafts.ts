import { readJson, writeJson, removeKey } from "./localStore";
import { DEFAULT_BENCHMARKS, type Benchmarks } from "@/lib/calculations/benchmarks";

export const draftKey = (slug: string) => `km:draft:${slug}`;

/** Last-used inputs per calculator, so a refresh doesn't lose work. */
export function loadDraft<T>(slug: string): Partial<T> | null {
  return readJson<Partial<T> | null>(draftKey(slug), null);
}

export function saveDraft(slug: string, values: unknown) {
  writeJson(draftKey(slug), values);
}

export function clearDraft(slug: string) {
  removeKey(draftKey(slug));
}

export const BENCH_KEY = "km:benchmarks:v1";

/** Merge saved benchmark overrides (raw JSON string) with the defaults. Pure, safe for any input. */
export function parseBenchmarks(raw: string | null | undefined): Benchmarks {
  if (!raw) return DEFAULT_BENCHMARKS;
  try {
    const saved = JSON.parse(raw) as Partial<Benchmarks>;
    const out = { ...DEFAULT_BENCHMARKS };
    (Object.keys(DEFAULT_BENCHMARKS) as (keyof Benchmarks)[]).forEach((k) => {
      const v = saved?.[k];
      if (typeof v === "number" && Number.isFinite(v)) out[k] = v;
    });
    return out;
  } catch {
    return DEFAULT_BENCHMARKS;
  }
}

export function loadBenchmarks(): Benchmarks {
  return { ...DEFAULT_BENCHMARKS, ...readJson<Partial<Benchmarks>>(BENCH_KEY, {}) };
}

export function saveBenchmarks(b: Benchmarks) {
  writeJson(BENCH_KEY, b);
}

export function resetBenchmarks() {
  removeKey(BENCH_KEY);
}
