import { Crosshair, Filter, Megaphone, Star, Tag, UtensilsCrossed, type LucideIcon } from "lucide-react";
import type { ServiceIcon as Name } from "@/lib/content/company";

const ICONS: Record<Name, LucideIcon> = {
  menu: UtensilsCrossed,
  pricing: Tag,
  ads: Megaphone,
  funnel: Filter,
  reviews: Star,
  competitor: Crosshair,
};

export function ServiceIcon({ name, className }: { name: Name; className?: string }) {
  const Icon = ICONS[name];
  return <Icon className={className} aria-hidden />;
}
