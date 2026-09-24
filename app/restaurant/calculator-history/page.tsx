import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { HistoryList } from "@/components/history/HistoryList";
import { pageMetadata } from "@/lib/seo";

export const metadata = {
  ...pageMetadata({ title: "Saved Scenarios & Calculator History", description: "View, rename, duplicate and delete the restaurant calculator scenarios saved on this device.", path: "/restaurant/calculator-history" }),
  robots: { index: false, follow: true },
};

export default function HistoryPage() {
  return (
    <div className="container max-w-4xl pb-16 pt-6">
      <Breadcrumbs items={[{ name: "Restaurant tools", path: "/restaurant" }, { name: "Saved scenarios", path: "/restaurant/calculator-history" }]} />
      <header className="mb-8 mt-5">
        <h1 className="text-3xl font-semibold sm:text-4xl">Saved scenarios</h1>
        <p className="mt-2 text-muted">Everything you saved with the Save button, on this device. No account needed.</p>
      </header>
      <HistoryList />
    </div>
  );
}
