import type { Tone } from "@/lib/calculations/utils";
import { CHART } from "./colors";

export const toneText: Record<Tone, string> = {
  good: "text-sage-dark",
  watch: "text-caution",
  bad: "text-danger",
  neutral: "text-muted",
};

export const toneBg: Record<Tone, string> = {
  good: "bg-sage-soft text-sage-dark",
  watch: "bg-caution-soft text-caution",
  bad: "bg-danger-soft text-danger",
  neutral: "bg-wash text-muted",
};

export const toneFill: Record<Tone, string> = {
  good: CHART.good,
  watch: CHART.watch,
  bad: CHART.bad,
  neutral: CHART.neutral,
};
