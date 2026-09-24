import MenuEngineeringCalculator from "@/components/calculators/menu-engineering/MenuEngineeringCalculator";
import { CalculatorPage } from "@/components/calculators/shared/CalculatorPage";
import { getCalculator } from "@/lib/content/calculators";
import { calculatorMetadata } from "@/lib/seo";

const meta = getCalculator("menu-engineering-calculator");

export const metadata = calculatorMetadata(meta);

export default function Page() {
  return (
    <CalculatorPage meta={meta}>
      <MenuEngineeringCalculator />
    </CalculatorPage>
  );
}
