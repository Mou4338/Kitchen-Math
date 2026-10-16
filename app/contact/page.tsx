import { ContactDetails, ContactNextSteps } from "@/components/company/ContactDetails";
import { Check, ClipboardCheck, Sparkles } from "lucide-react";
import { ContactForm } from "@/components/company/ContactForm";
import { PageHero } from "@/components/layout/PageHero";
import { PAGE_IMAGES } from "@/lib/content/images";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: `Contact ${SITE.name}: Book a Free Restaurant Growth Audit`,
  description: `Email ${SITE.company.email}, visit our Mumbai office, or send your restaurant details for a free growth audit. We reply within one business day.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        photo={PAGE_IMAGES.contact}
        eyebrow="Contact"
        title="Talk to the"
        accent={`${SITE.name} team`}
        subtitle="Email us, visit the office, or tell us about your restaurant below. We reply within one business day."
        crumbs={[{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]}
      />
      <section className="py-14 sm:py-20" aria-label="Contact details and enquiry form">
       <div className="container">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
          <ContactDetails />
          <div id="enquiry" className="contact-card scroll-mt-24 overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,#19171B_0%,#121114_100%)] p-6 sm:p-9">
            <div className="flex items-start gap-4">
              <span className="contact-icon grid h-12 w-12 shrink-0 place-items-center rounded-2xl"><ClipboardCheck className="h-5 w-5" aria-hidden /></span>
              <div>
                <h2 className="text-xl font-extrabold text-white sm:text-2xl">Tell us about your restaurant</h2>
                <p className="mt-1 text-[15px] text-white/65">We reply by phone, WhatsApp or email.</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Free", "No obligation", "1 business day reply"].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5 rounded-full bg-star px-3 py-1 text-xs font-bold text-[#0F0A06]"><Check className="h-3.5 w-3.5" aria-hidden />{t}</span>
              ))}
            </div>
            <hr className="mt-6 h-px border-0 bg-white/[0.12]" aria-hidden />
            <p className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-star-text"><Sparkles className="h-3.5 w-3.5" aria-hidden />Your details</p>
            <div className="mt-4"><ContactForm tone="panel" /></div>
          </div>
        </div>
        <ContactNextSteps />
       </div>
      </section>
    </>
  );
}
