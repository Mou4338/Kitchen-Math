import FoodCostCalculator from "@/components/calculators/food-cost/FoodCostCalculator";
import { CalculatorPage } from "@/components/calculators/shared/CalculatorPage";
import { getCalculator } from "@/lib/content/calculators";
import { calculatorMetadata } from "@/lib/seo";

const meta = getCalculator("food-cost-calculator");

export const metadata = calculatorMetadata(meta);

export default function Page() {
  return (
    <CalculatorPage meta={meta}>
      <FoodCostCalculator />
    </CalculatorPage>
  );
}
