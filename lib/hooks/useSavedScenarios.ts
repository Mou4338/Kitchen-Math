"use client";

import { useMemo } from "react";
import { parseScenarios, SCENARIOS_KEY, type SavedScenario } from "@/lib/storage/scenarios";
import { useStorageRaw } from "./useStorageRaw";

/** Live list of saved scenarios (optionally for one calculator). `ready` is false until the browser has loaded them. */
export function useSavedScenarios(calculator?: string): { scenarios: SavedScenario[]; ready: boolean } {
  const raw = useStorageRaw(SCENARIOS_KEY);
  const scenarios = useMemo(() => parseScenarios(raw, calculator), [raw, calculator]);
  return { scenarios, ready: raw !== undefined };
}
