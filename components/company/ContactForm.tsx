"use client";

import { Check, CheckCircle2, Loader2, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { submitLead } from "@/lib/leads";
import { SITE } from "@/lib/site";

const PLATFORMS = ["Swiggy", "Zomato", "Own website / app", "Dine-in only"];

/** Enquiry form. Submissions are saved to Google Sheets through /api/lead. */
/** tone="saffron": ivory fields, dark ink labels and a black submit button, for use on a solid saffron card. */
export function ContactForm({ tone = "default" }: { tone?: "default" | "saffron" } = {}) {
  const sf = tone === "saffron";
  const [name, setName] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  // A topic picked on the Contact page arrives as ?topic=… and pre-fills the message.
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("topic");
    if (t) setMessage(`I'd like to discuss: ${t.slice(0, 80)}.\n`);
  }, []);

  const field = sf
    ? "h-12 w-full rounded-xl border border-white/60 bg-[#FFF8EC]/90 px-4 text-[15px] font-medium text-[#0F0A06] shadow-[inset_0_1px_3px_rgb(90_45_0/0.15),0_1px_0_rgb(255_255_255/0.5)] outline-none transition placeholder:text-[#0F0A06]/45 hover:border-black/30 focus:border-[#0F0A06] focus:bg-white focus:ring-4 focus:ring-black/10"
    : "h-12 w-full rounded-xl border border-line bg-wash px-4 text-sm text-ink outline-none transition placeholder:text-muted-light hover:border-line-strong focus:border-accent focus:bg-card focus:ring-4 focus:ring-accent/15";
  const label = sf ? "grid gap-1.5 text-sm font-bold text-[#0F0A06]" : "grid gap-1.5 text-sm font-medium";

  if (status === "sent") {
    return (
      <div role="status" className="flex flex-col items-start gap-3 rounded-2xl border border-sage/30 bg-sage-soft p-6">
        <CheckCircle2 className="h-8 w-8 text-sage-dark" aria-hidden />
        <p className="text-lg font-semibold">Thank you, {name.split(" ")[0] || "we've got it"}!</p>
        <p className="text-sm text-ink-soft">We&apos;ve received your details for {restaurant} and will get back to you within one working day.</p>
        <button
          type="button"
          className="text-sm font-medium text-accent-dark hover:underline"
          onClick={() => { setStatus("idle"); setMessage(""); }}
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      className="grid gap-4"
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        if (!name.trim() || !restaurant.trim()) {
          setError("Please add your name and your restaurant's name.");
          return;
        }
        if (!phone.trim() && !email.trim()) {
          setError("Please add a phone number or email so we can reply.");
          return;
        }
        if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
          setError("Please check your email address.");
          return;
        }
        setError(null);
        setStatus("sending");
        const res = await submitLead({
          formType: "enquiry",
          name, restaurant, phone, email, city, platforms,
          message: message || "I'd like a free growth audit for my restaurant.",
          website,
        });
        if (res.ok) setStatus("sent");
        else { setStatus("idle"); setError(res.error); }
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>Your name *<input value={name} onChange={(e) => setName(e.target.value)} className={field} autoComplete="name" maxLength={100} required /></label>
        <label className={label}>Restaurant name *<input value={restaurant} onChange={(e) => setRestaurant(e.target.value)} className={field} autoComplete="organization" maxLength={120} required /></label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>Phone / WhatsApp<input type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={field} autoComplete="tel" maxLength={30} placeholder="e.g. 98765 43210" /></label>
        <label className={label}>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} autoComplete="email" maxLength={120} /></label>
      </div>
      <label className={label}>City<input value={city} onChange={(e) => setCity(e.target.value)} className={field} autoComplete="address-level2" maxLength={60} placeholder="e.g. Pune" /></label>
      {/* Honeypot: hidden from people, filled by bots */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
      </div>
      <fieldset>
        <legend className={sf ? "text-sm font-bold text-[#0F0A06]" : "text-sm font-medium"}>Where do you sell?</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {PLATFORMS.map((p) => {
            const on = platforms.includes(p);
            return (
              <button
                key={p}
                type="button"
                aria-pressed={on}
                onClick={() => setPlatforms(on ? platforms.filter((x) => x !== p) : [...platforms, p])}
                className={`inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition ${sf ? (on ? "border-[#0F0A06] bg-[#0F0A06] text-star" : "border-black/20 bg-[#FFF8EC] text-[#0F0A06] hover:border-black/40") : on ? "border-accent bg-accent text-accent-ink shadow-glow" : "border-line bg-wash text-ink-soft hover:border-line-strong hover:text-ink"}`}
              >
                {on ? <Check className="h-3.5 w-3.5" aria-hidden /> : null}
                {p}
              </button>
            );
          })}
        </div>
      </fieldset>
      <label className={label}>What would you like to improve?
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} maxLength={2000} className={`${field} h-auto py-3`} placeholder="e.g. More orders at dinner, better ratings, lower ad spend…" />
      </label>
      {error ? (
        <p role="alert" className="text-sm font-medium text-danger">
          {error}{" "}
          <a className="underline" href={`mailto:${SITE.company.email}`}>Or email us</a>.
        </p>
      ) : null}
      <button type="submit" disabled={status === "sending"} className={`mt-2 inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl px-6 text-base font-semibold transition ${sf ? "bg-[linear-gradient(180deg,#2A2018,#0F0A06)] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_18px_32px_-14px_rgb(0_0_0/0.75)] hover:-translate-y-0.5 [&_svg]:text-star" : "brand-gradient text-accent-ink shadow-glow [text-shadow:0_1px_2px_rgb(0_0_0/0.28)] hover:brightness-110"} active:scale-[0.98] disabled:opacity-70`}>
        {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
        {status === "sending" ? "Sending…" : "Request my free growth audit"}
      </button>
      <p className={sf ? "text-center text-xs font-medium text-[#0F0A06]/75" : "text-center text-xs text-muted"}>We only use your details to reply to this enquiry.</p>
    </form>
  );
}
