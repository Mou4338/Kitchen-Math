"use client";

import { useSyncExternalStore } from "react";
import { readRaw, subscribeStorage } from "@/lib/storage/localStore";

/**
 * Reads a localStorage key as a raw string and re-renders when it changes.
 * Returns `undefined` on the server and during hydration, so server and client HTML match.
 */
export function useStorageRaw(key: string): string | null | undefined {
  return useSyncExternalStore(
    subscribeStorage,
    () => readRaw(key),
    () => undefined,
  );
}
