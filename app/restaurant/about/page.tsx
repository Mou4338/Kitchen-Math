import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { buttonClass } from "@/components/ui/Button";
import { BENCHMARK_NOTE } from "@/lib/calculations/benchmarks";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({ title: `About ${SITE.name}`, description: `Why ${SITE.name} exists, how the calculators work and how your data is handled.`, path: "/restaurant/about" });

const PRINCIPLES = [
  { title: "Transparent maths", body: "Every calculator shows its formula, and every score shows how it was built. No black boxes." },
  { title: "Honest benchmarks", body: `${BENCHMARK_NOTE} We label them as reference ranges, never as rules.` },
  { title: "Private by default", body: "Calculations run in your browser. Saved scenarios stay on your device. There is no account and no tracking of the numbers you enter." },
  { title: "Built for Indian restaurants", body: "Rupees, lakh and crore formatting, GST on platform commission, and examples that match how Indian outlets operate." },
];

export default function AboutPage() {
  return (
    <div className="container max-w-4xl pb-16 pt-6">
      <Breadcrumbs items={[{ name: "Restaurant tools", path: "/restaurant" }, { name: "About", path: "/restaurant/about" }]} />
      <header className="mb-10 mt-5">
        <h1 className="text-3xl font-semibold sm:text-4xl">Most restaurants don&apos;t fail on food. They fail on numbers.</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Net margins in Indian restaurants are often 5–10%. One unchecked point of food cost, an extra shift of staff or an untracked campaign can turn a profitable month into a loss. {SITE.name} puts the key numbers in front of owners for free, without software subscriptions or sign-ups.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        {PRINCIPLES.map((p) => (
          <div key={p.title} className="rounded-2xl border border-line bg-card p-6 shadow-card">
            <h2 className="text-lg font-semibold">{p.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 rounded-3xl bg-inverse p-6 text-on-inverse sm:p-8">
        <h2 className="text-xl font-semibold text-on-inverse">A note on estimates</h2>
        <p className="mt-2 text-sm leading-relaxed text-on-inverse/75">Results depend entirely on the numbers you enter and on simplified models. They are for planning and conversation, not financial, tax or legal advice. Check important decisions with your accountant.</p>
        <Link href="/restaurant#tools" className={buttonClass("accent", "md", "mt-5")}>Explore the calculators</Link>
      </div>
    </div>
  );
}
