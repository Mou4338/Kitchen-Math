import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { PageHero } from "@/components/layout/PageHero";
import { PAGE_IMAGES } from "@/lib/content/images";

export const metadata = pageMetadata({ title: "Privacy Policy", description: `How ${SITE.name} handles your data.`, path: "/privacy" });

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        photo={PAGE_IMAGES.privacy}
        eyebrow="Legal"
        title="Privacy"
        accent="policy"
        subtitle="Last updated: September 2026"
        crumbs={[{ name: "Home", path: "/" }, { name: "Privacy", path: "/privacy" }]}
        compact
      />
    <div className="section-warm"><article className="container max-w-3xl pb-16 pt-10">
      <div className="prose-km mt-8 space-y-4">
        <section className="card-glow rounded-3xl border border-line bg-card p-6 shadow-card">
          <h2 className="flex items-center gap-3 text-xl font-semibold"><span className="brand-gradient h-6 w-1.5 shrink-0 rounded-full" aria-hidden />The short version</h2>
          <p className="mt-2">The numbers you enter are calculated in your browser. They are not sent to our servers. There is no account and no login.</p>
        </section>
        <section className="card-glow rounded-3xl border border-line bg-card p-6 shadow-card">
          <h2 className="flex items-center gap-3 text-xl font-semibold"><span className="brand-gradient h-6 w-1.5 shrink-0 rounded-full" aria-hidden />What is stored on your device</h2>
          <p className="mt-2">We use your browser&apos;s local storage to remember your last inputs for each calculator, and any scenarios you save. You can delete them at any time from the Saved scenarios page or by clearing your browser data.</p>
        </section>
        <section className="card-glow rounded-3xl border border-line bg-card p-6 shadow-card">
          <h2 className="flex items-center gap-3 text-xl font-semibold"><span className="brand-gradient h-6 w-1.5 shrink-0 rounded-full" aria-hidden />Share links</h2>
          <p className="mt-2">When you press Share, your inputs are encoded into the link itself. Anyone with the link can see those numbers, so share it only with people you trust.</p>
        </section>
        <section className="card-glow rounded-3xl border border-line bg-card p-6 shadow-card">
          <h2 className="flex items-center gap-3 text-xl font-semibold"><span className="brand-gradient h-6 w-1.5 shrink-0 rounded-full" aria-hidden />Hosting and analytics</h2>
          <p className="mt-2">Our hosting provider may keep standard server logs such as IP address and pages visited. If you add an analytics service, update this section to describe it.</p>
        </section>
        <section className="card-glow rounded-3xl border border-line bg-card p-6 shadow-card">
          <h2 className="flex items-center gap-3 text-xl font-semibold"><span className="brand-gradient h-6 w-1.5 shrink-0 rounded-full" aria-hidden />Contact</h2>
          <p className="mt-2">Questions: {SITE.contactEmail}</p>
        </section>
      </div>
    </article></div>
    </>
  );
}
