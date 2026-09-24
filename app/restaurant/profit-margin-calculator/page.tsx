import ProfitMarginCalculator from "@/components/calculators/profit-margin/ProfitMarginCalculator";
import { CalculatorPage } from "@/components/calculators/shared/CalculatorPage";
import { getCalculator } from "@/lib/content/calculators";
import { calculatorMetadata } from "@/lib/seo";

const meta = getCalculator("profit-margin-calculator");

export const metadata = calculatorMetadata(meta);

export default function Page() {
  return (
    <CalculatorPage meta={meta}>
      <ProfitMarginCalculator />
    </CalculatorPage>
  );
}
