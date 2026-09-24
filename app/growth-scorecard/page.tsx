import { Scorecard } from "@/components/company/Scorecard";
import { PageHero } from "@/components/layout/PageHero";
import { COMPANY_IMAGES } from "@/lib/content/company";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Free Restaurant Growth Scorecard: 2-Minute Self-Audit",
  description: "Answer 18 quick questions across menu, pricing, ads, funnel, local demand, reviews, competitors, operations and measurement to see where your restaurant can grow fastest.",
  path: "/growth-scorecard",
});

export default function GrowthScorecardPage() {
  return (
    <>
      <PageHero
        photo={COMPANY_IMAGES.meeting}
        eyebrow="Free self-audit · 2 minutes"
        title="Growth"
        accent="scorecard"
        subtitle="Answer 18 quick questions across the 9 areas of our framework. You'll see a score for each area and where to start, instantly."
        crumbs={[{ name: "Home", path: "/" }, { name: "Growth scorecard", path: "/growth-scorecard" }]}
        compact
      />
      <div className="container py-10 sm:py-14">
        <Scorecard />
      </div>
    </>
  );
}
