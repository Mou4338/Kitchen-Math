import HealthCalculator from "@/components/calculators/health/HealthCalculator";
import { CalculatorPage } from "@/components/calculators/shared/CalculatorPage";
import { getCalculator } from "@/lib/content/calculators";
import { calculatorMetadata } from "@/lib/seo";

const meta = getCalculator("restaurant-health-calculator");

export const metadata = calculatorMetadata(meta);

export default function Page() {
  return (
    <CalculatorPage meta={meta}>
      <HealthCalculator />
    </CalculatorPage>
  );
}
