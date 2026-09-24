import { Activity, ChefHat, LayoutGrid, Landmark, Percent, Scale, Smartphone, Tag, TrendingUp, type LucideIcon } from "lucide-react";
import type { IconName } from "@/lib/content/calculators";

const ICONS: Record<IconName, LucideIcon> = {
  health: Activity,
  breakEven: Scale,
  payout: Smartphone,
  menuPricing: Tag,
  foodCost: ChefHat,
  primeCost: Percent,
  profitMargin: TrendingUp,
  roi: Landmark,
  menuEngineering: LayoutGrid,
};

export function CalculatorIcon({ name, className }: { name: IconName; className?: string }) {
  const Icon = ICONS[name];
  return <Icon className={className} aria-hidden />;
}
