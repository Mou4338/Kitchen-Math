import { LayoutGrid, Smartphone, Tag, type LucideIcon } from "lucide-react";
import type { IconName } from "@/lib/content/calculators";

const ICONS: Record<IconName, LucideIcon> = {
  payout: Smartphone,
  menuPricing: Tag,
  menuEngineering: LayoutGrid,
};

export function CalculatorIcon({ name, className }: { name: IconName; className?: string }) {
  const Icon = ICONS[name];
  return <Icon className={className} aria-hidden />;
}
