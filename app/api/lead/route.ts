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

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(row),
      redirect: "follow",
      cache: "no-store",
    });
    const out = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (!res.ok || !out?.ok) {
      console.error("Google Sheets webhook failed", res.status, out);
      return NextResponse.json({ ok: false, error: "We couldn't save your details just now. Please try again in a minute." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Google Sheets webhook error", err);
    return NextResponse.json({ ok: false, error: "We couldn't save your details just now. Please try again in a minute." }, { status: 502 });
  }
}
