import { Crosshair, Filter, MapPin, Megaphone, PackageCheck, Star, Tag, Target, UtensilsCrossed, type LucideIcon } from "lucide-react";
import type { ServiceIcon as Name } from "@/lib/content/company";

const ICONS: Record<Name, LucideIcon> = {
  menu: UtensilsCrossed,
  pricing: Tag,
  ads: Megaphone,
  funnel: Filter,
  local: MapPin,
  reviews: Star,
  competitor: Crosshair,
  ops: PackageCheck,
  measure: Target,
};

export function ServiceIcon({ name, className }: { name: Name; className?: string }) {
  const Icon = ICONS[name];
  return <Icon className={className} aria-hidden />;
}
