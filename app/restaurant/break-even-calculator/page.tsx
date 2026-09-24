import BreakEvenCalculator from "@/components/calculators/break-even/BreakEvenCalculator";
import { CalculatorPage } from "@/components/calculators/shared/CalculatorPage";
import { getCalculator } from "@/lib/content/calculators";
import { calculatorMetadata } from "@/lib/seo";

const meta = getCalculator("break-even-calculator");

export const metadata = calculatorMetadata(meta);

export default function Page() {
  return (
    <CalculatorPage meta={meta}>
      <BreakEvenCalculator />
    </CalculatorPage>
  );
}
