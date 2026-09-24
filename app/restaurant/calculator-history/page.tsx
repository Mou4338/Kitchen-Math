import { PageHero } from "@/components/layout/PageHero";
import { PAGE_IMAGES } from "@/lib/content/images";
import { HistoryList } from "@/components/history/HistoryList";
import { pageMetadata } from "@/lib/seo";

export const metadata = {
  ...pageMetadata({ title: "Saved Scenarios & Calculator History", description: "View, rename, duplicate and delete the restaurant calculator scenarios saved on this device.", path: "/restaurant/calculator-history" }),
  robots: { index: false, follow: true },
};

export default function HistoryPage() {
  return (
    <>
      <PageHero
        photo={PAGE_IMAGES.history}
        eyebrow="Your history"
        title="Saved"
        accent="scenarios"
        subtitle="Everything you saved with the Save button, on this device. View, rename, duplicate, delete or export it. No account needed."
        crumbs={[{ name: "Home", path: "/restaurant" }, { name: "Saved scenarios", path: "/restaurant/calculator-history" }]}
        compact
      />
      <div className="container max-w-4xl pb-16 pt-10">
        <HistoryList />
      </div>
    </>
  );
}
