import MenuPricingCalculator from "@/components/calculators/menu-pricing/MenuPricingCalculator";
import { CalculatorPage } from "@/components/calculators/shared/CalculatorPage";
import { getCalculator } from "@/lib/content/calculators";
import { calculatorMetadata } from "@/lib/seo";

const meta = getCalculator("menu-pricing-calculator");

export const metadata = calculatorMetadata(meta);

export default function Page() {
  return (
    <CalculatorPage meta={meta}>
      <MenuPricingCalculator />
    </CalculatorPage>
  );
}
