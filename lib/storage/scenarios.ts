import { readRaw, writeJson } from "./localStore";

export const SCENARIOS_KEY = "km:scenarios:v1";

export interface SavedScenario {
  id: string;
  /** Calculator slug, e.g. "break-even-calculator". */
  calculator: string;
  calculatorTitle: string;
  name: string;
  /** Raw calculator inputs. */
  values: unknown;
  /** Headline result shown in history, e.g. "Break-even ₹3,45,000". */
  keyResult: string;
  createdAt: string;
  updatedAt: string;
}

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/** Parse the raw stored JSON into a sorted scenario list. Pure, safe for any input. */
export function parseScenarios(raw: string | null | undefined, calculator?: string): SavedScenario[] {
  if (!raw) return [];
  let all: unknown;
  try {
    all = JSON.parse(raw);
  } catch {
    return [];
  }
  const valid = Array.isArray(all)
    ? (all as SavedScenario[]).filter((s) => s && typeof s.id === "string" && typeof s.updatedAt === "string" && typeof s.name === "string")
    : [];
  return (calculator ? valid.filter((s) => s.calculator === calculator) : valid).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function listScenarios(calculator?: string): SavedScenario[] {
  return parseScenarios(readRaw(SCENARIOS_KEY), calculator);
}

function writeAll(list: SavedScenario[]) {
  return writeJson(SCENARIOS_KEY, list);
}

export function saveScenario(input: Omit<SavedScenario, "id" | "createdAt" | "updatedAt">): SavedScenario | null {
  const now = new Date().toISOString();
  const item: SavedScenario = { ...input, name: input.name.trim() || "Untitled scenario", id: newId(), createdAt: now, updatedAt: now };
  return writeAll([item, ...listScenarios()]) ? item : null;
}

export function updateScenario(id: string, patch: Partial<Pick<SavedScenario, "name" | "values" | "keyResult">>) {
  const list = listScenarios().map((s) => (s.id === id ? { ...s, ...patch, updatedAt: new Date().toISOString() } : s));
  return writeAll(list);
}

export function renameScenario(id: string, name: string) {
  return updateScenario(id, { name: name.trim() || "Untitled scenario" });
}

export function duplicateScenario(id: string): SavedScenario | null {
  const src = listScenarios().find((s) => s.id === id);
  if (!src) return null;
  return saveScenario({ calculator: src.calculator, calculatorTitle: src.calculatorTitle, name: `${src.name} (copy)`, values: src.values, keyResult: src.keyResult });
}

export function deleteScenario(id: string) {
  return writeAll(listScenarios().filter((s) => s.id !== id));
}

export function getScenario(id: string): SavedScenario | undefined {
  return listScenarios().find((s) => s.id === id);
}
