import OnlinePayoutCalculator from "@/components/calculators/online-payout/OnlinePayoutCalculator";
import { CalculatorPage } from "@/components/calculators/shared/CalculatorPage";
import { getCalculator } from "@/lib/content/calculators";
import { calculatorMetadata } from "@/lib/seo";

const meta = getCalculator("online-sale-payout-calculator");

export const metadata = calculatorMetadata(meta);

export default function Page() {
  return (
    <CalculatorPage meta={meta}>
      <OnlinePayoutCalculator />
    </CalculatorPage>
  );
}
