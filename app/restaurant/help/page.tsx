import Link from "next/link";
import { ArrowRight, Download, FileSpreadsheet, FolderOpen, Info, Moon, Printer, Save, Share2, SlidersHorizontal } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { PAGE_IMAGES } from "@/lib/content/images";
import { PrivacyShield, StepAnalyze, StepEnter, StepSave } from "@/components/illustrations/Illustrations";
import { buttonClass } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { faqSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Help: How to Use the Restaurant Calculators",
  description: "Step-by-step guide to using the restaurant calculators: entering numbers, reading results, scenarios, saving, sharing, PDF and CSV export, and a glossary of terms.",
  path: "/restaurant/help",
});

const STEPS = [
  { Art: StepEnter, title: "1. Enter your numbers", body: "Every calculator opens with example numbers so you can see how it works. Replace them with your own figures from your books, POS or bank statements. Type plain numbers; commas are added for you (1,50,000)." },
  { Art: StepAnalyze, title: "2. Read your results", body: "Results update as you type. Each result shows the reference range, a coloured status and the rupee impact of any gap. On a phone, the key result stays pinned at the bottom of the screen; tap Results to jump to it." },
  { Art: StepSave, title: "3. Test, save and share", body: "Use Scenario mode to try a change (rent +10%, food cost −2 points) without touching your inputs. Then save it on this device, share a link, or download a PDF or CSV for your partner or accountant." },
];

const ACTIONS = [
  { Icon: Save, title: "Save", body: "Stores the numbers with a name you choose, on this device only. Find everything later under Saved scenarios (History)." },
  { Icon: FolderOpen, title: "Open a saved scenario", body: "The drop-down under the buttons loads any scenario you saved for this calculator." },
  { Icon: Share2, title: "Share", body: "Creates a link with your numbers inside it. Anyone with the link sees the same figures, so share it only with people you trust." },
  { Icon: Download, title: "PDF", body: "A clean report with your inputs, results, a chart, assumptions and reference ranges." },
  { Icon: FileSpreadsheet, title: "CSV", body: "Opens in Excel or Google Sheets. Menu Engineering can also import a CSV of your dishes." },
  { Icon: Printer, title: "Print", body: "Prints the results without menus and buttons." },
  { Icon: SlidersHorizontal, title: "Reference benchmarks", body: "In the Health calculator you can change the reference ranges to suit your format. They are saved on this device." },
  { Icon: Moon, title: "Light or dark theme", body: "Use the sun/moon button in the top bar to switch between white & blue and black & gold. Your choice is remembered." },
];

const GLOSSARY: [string, string][] = [
  ["COGS (cost of goods sold)", "The food you actually used: opening stock + purchases − closing stock."],
  ["Food cost %", "COGS as a share of food sales."],
  ["Labor cost %", "All salaries and benefits as a share of total sales."],
  ["Prime cost", "Food cost + labor cost, your two biggest controllable costs."],
  ["Contribution margin", "What's left of each rupee of sales after variable costs, available to pay fixed costs and profit."],
  ["Break-even", "The monthly sales at which you make neither profit nor loss."],
  ["Margin of safety", "How far sales can fall before you start losing money."],
  ["Payout", "What a delivery platform actually sends to your bank after its deductions."],
  ["GMV", "Gross merchandise value: the total value of orders before any deductions."],
  ["Menu mix (popularity)", "A dish's share of all dishes sold."],
  ["Payback period", "How many months of profit it takes to recover what you invested."],
];

const FAQS = [
  { q: "Do I need to create an account?", a: "No. Everything works without login. Your numbers are calculated in your browser and saved only on your device." },
  { q: "Why do the calculators already show numbers?", a: "They are example numbers so you can see how each tool works. Press “Clear all” to start blank, or “Example” to bring them back." },
  { q: "I see a red message under a field. What do I do?", a: "It means the value can't be used, for example a negative amount or a percentage above 100. Correct the number and the message disappears." },
  { q: "My saved scenarios disappeared.", a: "Saved scenarios live in your browser. Clearing browser data or using a private window removes them. Download a CSV or PDF to keep a permanent copy." },
  { q: "Are these results financial advice?", a: "No. They are estimates based on the numbers you enter. Reference ranges are indicative. Check important decisions with your accountant." },
];

export default function HelpPage() {
  return (
    <>
      <PageHero
        photo={PAGE_IMAGES.help}
        eyebrow="Help centre"
        title="Using the calculators,"
        accent="step by step"
        subtitle="Everything you need to go from your first number to a report you can share, in about two minutes of reading."
        crumbs={[{ name: "Home", path: "/" }, { name: "Tools", path: "/restaurant" }, { name: "Help", path: "/restaurant/help" }]}
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/restaurant/restaurant-health-calculator" className={buttonClass("accent", "lg")}>Try the Health calculator <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          <a href="#glossary" className="inline-flex h-12 items-center rounded-xl border border-on-inverse/30 px-5 font-medium text-on-inverse transition hover:bg-on-inverse/10">Glossary</a>
        </div>
      </PageHero>
    <div className="container pb-20 pt-4">

      <section className="mt-16" aria-labelledby="start">
        <h2 id="start" className="text-3xl font-semibold">Getting started</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {STEPS.map(({ Art, title, body }) => (
            <article key={title} className="rounded-3xl border border-line bg-card p-6 shadow-card">
              <Art className="mx-auto h-40 w-full max-w-[260px]" />
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16" aria-labelledby="colours">
        <h2 id="colours" className="text-3xl font-semibold">Reading your results</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ["bg-sage", "Green", "Within the reference range. Keep doing what you're doing."],
            ["bg-caution", "Amber", "Slightly outside the range. Worth a look this month."],
            ["bg-danger", "Red", "Well outside the range, or a loss. Act on this first."],
          ].map(([dot, name, text]) => (
            <div key={name} className="flex gap-3 rounded-2xl border border-line bg-card p-5 shadow-card">
              <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${dot}`} aria-hidden />
              <div>
                <p className="font-semibold">{name}</p>
                <p className="mt-1 text-sm text-ink-soft">{text}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 flex items-start gap-2 text-sm text-muted"><Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> Reference ranges are indicative. The right numbers for your outlet depend on format, city, cuisine and pricing.</p>
      </section>

      <section className="mt-16" aria-labelledby="actions">
        <h2 id="actions" className="text-3xl font-semibold">Buttons under every result</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ACTIONS.map(({ Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-line bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent-dark"><Icon className="h-5 w-5" aria-hidden /></span>
              <h3 className="mt-3 font-semibold">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 grid items-center gap-8 rounded-3xl bg-inverse p-6 text-on-inverse sm:p-10 md:grid-cols-[1fr_1.4fr]" aria-labelledby="privacy">
        <PrivacyShield className="mx-auto w-full max-w-[280px]" />
        <div>
          <h2 id="privacy" className="text-3xl font-semibold text-on-inverse">Your numbers stay with you</h2>
          <p className="mt-3 leading-relaxed text-on-inverse/75">Calculations run in your browser. Nothing you type is sent to a server. Saved scenarios, your last inputs and theme choice are kept in this browser only. Share links carry your numbers inside the link itself.</p>
        </div>
      </section>

      <section id="glossary" className="mt-16 scroll-mt-24" aria-labelledby="glossary-title">
        <h2 id="glossary-title" className="text-3xl font-semibold">Glossary</h2>
        <dl className="mt-6 grid gap-x-8 divide-y divide-line rounded-3xl border border-line bg-card px-6 shadow-card md:grid-cols-2 md:divide-y-0">
          {GLOSSARY.map(([term, def]) => (
            <div key={term} className="py-4 md:border-b md:border-line">
              <dt className="font-semibold">{term}</dt>
              <dd className="mt-1 text-sm text-ink-soft">{def}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-16" aria-labelledby="help-faq">
        <h2 id="help-faq" className="text-3xl font-semibold">Common questions</h2>
        <div className="mt-6 divide-y divide-line rounded-3xl border border-line bg-card shadow-card">
          {FAQS.map((f) => (
            <details key={f.q} className="group px-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium">
                {f.q}
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-dark transition-transform group-open:rotate-45" aria-hidden>+</span>
              </summary>
              <p className="pb-5 text-sm leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
        <JsonLd data={faqSchema(FAQS)} />
      </section>
    </div>
    </>
  );
}
