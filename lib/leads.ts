/**
 * Sends a form submission to /api/lead, which forwards it to your Google Sheet.
 * See google-apps-script/SETUP.md for the one-time sheet setup.
 */
export type LeadFormType = "enquiry" | "scorecard";

export interface LeadPayload {
  formType: LeadFormType;
  name: string;
  restaurant: string;
  phone?: string;
  email?: string;
  city?: string;
  platforms?: string[];
  message?: string;
  /** Scorecard only: overall score and a score per area. */
  overallScore?: number | null;
  areaScores?: Record<string, number | null>;
  priorities?: string[];
  /** Honeypot: real visitors never fill this. */
  website?: string;
}

export async function submitLead(payload: LeadPayload): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, page: typeof window !== "undefined" ? window.location.pathname : "" }),
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    if (res.ok && data.ok) return { ok: true };
    return { ok: false, error: data.error || "We couldn't send your details. Please try again." };
  } catch {
    return { ok: false, error: "No internet connection. Please check it and try again." };
  }
}
