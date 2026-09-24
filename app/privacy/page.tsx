import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({ title: "Privacy Policy", description: `How ${SITE.name} handles your data.`, path: "/privacy" });

export default function PrivacyPage() {
  return (
    <article className="container max-w-3xl pb-16 pt-10">
      <h1 className="text-3xl font-semibold sm:text-4xl">Privacy policy</h1>
      <p className="mt-2 text-sm text-muted">Last updated: September 2026</p>
      <div className="prose-km mt-8 space-y-6">
        <section>
          <h2 className="text-xl font-semibold">The short version</h2>
          <p className="mt-2">The numbers you enter are calculated in your browser. They are not sent to our servers. There is no account and no login.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">What is stored on your device</h2>
          <p className="mt-2">We use your browser&apos;s local storage to remember your last inputs for each calculator, any scenarios you save and any benchmark settings you change. You can delete them at any time from the Saved scenarios page or by clearing your browser data.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Share links</h2>
          <p className="mt-2">When you press Share, your inputs are encoded into the link itself. Anyone with the link can see those numbers, so share it only with people you trust.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Hosting and analytics</h2>
          <p className="mt-2">Our hosting provider may keep standard server logs such as IP address and pages visited. If you add an analytics service, update this section to describe it.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Contact</h2>
          <p className="mt-2">Questions: {SITE.contactEmail}</p>
        </section>
      </div>
    </article>
  );
}
