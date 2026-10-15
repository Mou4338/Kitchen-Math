import { ContactDetails, ContactNextSteps } from "@/components/company/ContactDetails";
import { Check, ClipboardCheck } from "lucide-react";
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
          <div id="enquiry" className="saffron-solid scroll-mt-24 rounded-3xl p-6 sm:p-10">
            <div className="flex items-start gap-4">
              <span className="ink-badge grid h-12 w-12 shrink-0 place-items-center rounded-2xl"><ClipboardCheck className="h-5 w-5" aria-hidden /></span>
              <div>
                <h2 className="text-2xl font-extrabold text-[#0F0A06] sm:text-[28px]">Tell us about your restaurant</h2>
                <p className="mt-1 text-[15px] font-medium text-[#0F0A06]/80">We reply by phone, WhatsApp or email.</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Free", "No obligation", "1 business day reply"].map((t) => (
                <span key={t} className="saffron-glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-[#0F0A06]"><Check className="h-3.5 w-3.5" aria-hidden />{t}</span>
              ))}
            </div>
            <div className="mt-6 border-t border-dashed border-black/30 pt-6"><ContactForm tone="saffron" /></div>
          </div>
        </div>
        <ContactNextSteps />
       </div>
      </section>
    </>
  );
}
