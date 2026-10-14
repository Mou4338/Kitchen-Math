import { ContactDetails, ContactNextSteps } from "@/components/company/ContactDetails";
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
          <div id="enquiry" className="red-edge-glow scroll-mt-24 rounded-3xl border border-white/10 bg-card p-6 sm:p-10">
            <h2 className="text-2xl font-bold">Tell us about your restaurant</h2>
            <p className="mt-1 text-sm text-muted">We reply by phone, WhatsApp or email.</p>
            <div className="mt-6 border-t border-line pt-6"><ContactForm /></div>
          </div>
        </div>
        <ContactNextSteps />
       </div>
      </section>
    </>
  );
}
