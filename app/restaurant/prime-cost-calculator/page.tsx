import PrimeCostCalculator from "@/components/calculators/prime-cost/PrimeCostCalculator";
import { CalculatorPage } from "@/components/calculators/shared/CalculatorPage";
import { getCalculator } from "@/lib/content/calculators";
import { calculatorMetadata } from "@/lib/seo";

const meta = getCalculator("prime-cost-calculator");

export const metadata = calculatorMetadata(meta);

export default function Page() {
  return (
    <CalculatorPage meta={meta}>
      <PrimeCostCalculator />
    </CalculatorPage>
  );
}
