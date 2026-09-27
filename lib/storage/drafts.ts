import { readJson, writeJson, removeKey } from "./localStore";

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
