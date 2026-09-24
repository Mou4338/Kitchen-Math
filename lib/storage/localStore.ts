/**
 * Safe localStorage access: never throws (private mode, blocked storage, SSR).
 * If the browser refuses to store something, the value is kept in memory for this tab so the UI still works.
 */
const memory = new Map<string, string | null>();

export const STORAGE_EVENT = "km-storage";

export function readRaw(key: string): string | null {
  if (typeof window === "undefined") return null;
  if (memory.has(key)) return memory.get(key) ?? null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function notify(key: string) {
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: key }));
}

export function readJson<T>(key: string, fallback: T): T {
  const raw = readRaw(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown): boolean {
  if (typeof window === "undefined") return false;
  const raw = JSON.stringify(value);
  let ok = true;
  try {
    window.localStorage.setItem(key, raw);
    memory.delete(key);
  } catch {
    memory.set(key, raw);
    ok = false;
  }
  notify(key);
  return ok;
}

export function removeKey(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
    memory.delete(key);
  } catch {
    memory.set(key, null);
  }
  notify(key);
}

/** Subscribe to changes made in this tab (our own event) or in other tabs (the native "storage" event). */
export function subscribeStorage(callback: () => void): () => void {
  window.addEventListener(STORAGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(STORAGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
