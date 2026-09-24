/** Encode calculator state into a URL-safe string (base64url of UTF-8 JSON). No backend needed. */
export function encodeState(state: unknown): string {
  const json = JSON.stringify(state);
  const bytes = new TextEncoder().encode(json);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeState<T = unknown>(encoded: string): T | null {
  try {
    const b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const bin = atob(padded);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as T;
  } catch {
    return null;
  }
}

export function buildShareUrl(path: string, state: unknown): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}${path}?s=${encodeState(state)}`;
}
