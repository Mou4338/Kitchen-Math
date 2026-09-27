import type { MenuPricingForm, OnlinePayoutForm } from "@/lib/validators/schemas";
import type { MenuItemInput } from "@/lib/calculations/menuEngineeringCalculator";
import type { PlatformRates } from "@/lib/calculations/onlinePayoutCalculator";

/**
 * Example numbers every calculator opens with, so the first view is never empty. Clearly labelled as examples in the UI.
 * The pricing and payout examples match: ₹130 total cost at 25% commission, 10% discount, 5% ads, 18% tax
 * and a 20% margin gives a ₹379 menu price, which earns ₹76.93 (20.3%) per order.
 */
export const PLATFORM_DEFAULTS: PlatformRates = { commissionPercent: 25, taxPercent: 18, discountPercent: 10, adsPercent: 5 };

export const MENU_PRICING_DEFAULTS: MenuPricingForm = {
  dishCost: 100, labourCost: 15, packagingCost: 15, ...PLATFORM_DEFAULTS, marginPercent: 20,
};

export const ONLINE_PAYOUT_DEFAULTS: OnlinePayoutForm = {
  sellingPrice: 379, dishCost: 100, labourCost: 15, packagingCost: 15, ...PLATFORM_DEFAULTS,
};

export const MENU_ITEMS_DEFAULTS: MenuItemInput[] = [
  { id: "m1", name: "Chicken Biryani", sellingPrice: 379, totalCost: 130, orders: 640 },
  { id: "m2", name: "Paneer Butter Masala", sellingPrice: 349, totalCost: 120, orders: 420 },
  { id: "m3", name: "Dal Makhani", sellingPrice: 289, totalCost: 80, orders: 510 },
  { id: "m4", name: "Veg Hakka Noodles", sellingPrice: 229, totalCost: 75, orders: 150 },
  { id: "m5", name: "Mutton Rogan Josh", sellingPrice: 499, totalCost: 235, orders: 120 },
  { id: "m6", name: "Masala Papad", sellingPrice: 99, totalCost: 30, orders: 90 },
  { id: "m7", name: "Butter Naan", sellingPrice: 69, totalCost: 22, orders: 980 },
  { id: "m8", name: "Tandoori Platter", sellingPrice: 649, totalCost: 270, orders: 85 },
  { id: "m9", name: "Gulab Jamun (2 pc)", sellingPrice: 119, totalCost: 35, orders: 260 },
  { id: "m10", name: "Chicken 65", sellingPrice: 299, totalCost: 115, orders: 310 },
];
