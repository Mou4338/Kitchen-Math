import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Receives form submissions from the website and appends them to a Google Sheet
 * through a Google Apps Script web app. Set these in .env.local (and in Vercel):
 *   GOOGLE_SHEETS_WEBHOOK_URL = the Apps Script "Web app" URL (ends in /exec)
 *   GOOGLE_SHEETS_SECRET      = the same secret you put in the script
 * Setup steps: google-apps-script/SETUP.md
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const text = (max: number) => z.string().trim().max(max).optional().default("");

const schema = z.object({
  formType: z.enum(["enquiry", "scorecard"]),
  name: z.string().trim().min(1, "Please add your name.").max(100),
  restaurant: z.string().trim().min(1, "Please add your restaurant's name.").max(120),
  phone: text(30),
  email: z.union([z.literal(""), z.string().trim().email("Please check your email address.").max(120)]).optional().default(""),
  city: text(60),
  platforms: z.array(z.string().max(40)).max(10).optional().default([]),
  message: text(2000),
  overallScore: z.number().min(0).max(100).nullable().optional(),
  areaScores: z.record(z.number().min(0).max(100).nullable()).optional(),
  priorities: z.array(z.string().max(80)).max(10).optional().default([]),
  page: text(200),
  website: text(200),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form." }, { status: 400 });
  }
  const d = parsed.data;

  // Honeypot filled in: pretend success so bots don't retry, but don't store it.
  if (d.website) return NextResponse.json({ ok: true });

  if (!d.phone && !d.email) {
    return NextResponse.json({ ok: false, error: "Please add a phone number or email so we can reply." }, { status: 400 });
  }

  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!url) {
    console.error("GOOGLE_SHEETS_WEBHOOK_URL is not set. See google-apps-script/SETUP.md");
    return NextResponse.json({ ok: false, error: "The form isn't connected yet. Please email or WhatsApp us instead." }, { status: 503 });
  }

  const row = {
    secret: process.env.GOOGLE_SHEETS_SECRET ?? "",
    formType: d.formType,
    submittedAt: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    name: d.name,
    restaurant: d.restaurant,
    phone: d.phone,
    email: d.email,
    city: d.city,
    platforms: d.platforms.join(", "),
    message: d.message,
    overallScore: d.overallScore ?? "",
    areaScores: d.areaScores ? Object.entries(d.areaScores).map(([k, v]) => `${k}: ${v ?? "—"}`).join(" | ") : "",
    priorities: d.priorities.join(", "),
    page: d.page,
    userAgent: req.headers.get("user-agent")?.slice(0, 200) ?? "",
  };

  const isDev = process.env.NODE_ENV !== "production";
  const fail = (detail: string) => {
    console.error(`[Google Sheets] ${detail}`);
    const msg = "We couldn't save your details just now. Please try again in a minute.";
    // On your computer (npm run dev) the form shows the exact reason; visitors on the live site never see it.
    return NextResponse.json({ ok: false, error: isDev ? `${msg} [Setup problem: ${detail}]` : msg }, { status: 502 });
  };

  if (!/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(url.trim())) {
    return fail("GOOGLE_SHEETS_WEBHOOK_URL must look like https://script.google.com/macros/s/…/exec (copy the Web app URL from Deploy → Manage deployments).");
  }

  let res: Response;
  try {
    res = await fetch(url.trim(), {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(row),
      redirect: "follow",
      cache: "no-store",
    });
  } catch (err) {
    return fail(`Couldn't reach Google (${err instanceof Error ? err.message : String(err)}). Check your internet connection.`);
  }

  const text = await res.text();
  let out: { ok?: boolean; error?: string } | null = null;
  try {
    out = JSON.parse(text);
  } catch {
    out = null;
  }

  if (out?.ok) return NextResponse.json({ ok: true });
  if (out?.error === "unauthorised") {
    return fail("The secret doesn't match. GOOGLE_SHEETS_SECRET must be exactly the same as SECRET in the script. If you changed SECRET after deploying, publish a new version: Deploy → Manage deployments → ✏️ → Version: New version → Deploy.");
  }
  if (out?.error) return fail(`The script returned an error: ${out.error}`);
  if (/<html/i.test(text)) {
    return fail(`Google returned a web page instead of the script's reply (HTTP ${res.status}). In Deploy → Manage deployments, set "Who has access" to "Anyone" and "Execute as" to "Me", and use the URL ending in /exec.`);
  }
  return fail(`Unexpected reply from Google (HTTP ${res.status}): ${text.slice(0, 120)}`);
}
