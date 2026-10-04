import type { MenuPricingForm, OnlinePayoutForm } from "@/lib/validators/schemas";
import type { MenuItemInput } from "@/lib/calculations/menuEngineeringCalculator";
import type { PlatformRates } from "@/lib/calculations/onlinePayoutCalculator";

/**
 * Example numbers every calculator opens with, so the first view is never empty. Clearly labelled as examples in the UI.
 * The pricing and payout examples match: ₹130 total cost at 10% discount, 25% commission, 5% ads and 5% GST on food
 * with a 20% margin gives a ₹309 menu price, which earns ₹65.37 (21.2%) per order.
 */
export const PLATFORM_DEFAULTS: Required<PlatformRates> = { discountPercent: 10, commissionPercent: 25, adsPercent: 5, gstOnOrderPercent: 5, packagingCharge: 0 };

export const MENU_PRICING_DEFAULTS: MenuPricingForm = {
  dishCost: 100, labourCost: 15, packagingCost: 15, ...PLATFORM_DEFAULTS, marginPercent: 20,
};

export const ONLINE_PAYOUT_DEFAULTS: OnlinePayoutForm = {
  sellingPrice: 309, dishCost: 100, labourCost: 15, packagingCost: 15, ...PLATFORM_DEFAULTS,
};

export const MENU_ITEMS_DEFAULTS: MenuItemInput[] = [
  { id: "m1", name: "Chicken Biryani", sellingPrice: 379, dishCost: 100, labourCost: 15, packagingCost: 15, unitsSold: 640 },
  { id: "m2", name: "Paneer Butter Masala", sellingPrice: 349, dishCost: 92, labourCost: 15, packagingCost: 13, unitsSold: 420 },
  { id: "m3", name: "Dal Makhani", sellingPrice: 289, dishCost: 55, labourCost: 12, packagingCost: 13, unitsSold: 510 },
  { id: "m4", name: "Veg Hakka Noodles", sellingPrice: 229, dishCost: 50, labourCost: 12, packagingCost: 13, unitsSold: 150 },
  { id: "m5", name: "Mutton Rogan Josh", sellingPrice: 499, dishCost: 200, labourCost: 20, packagingCost: 15, unitsSold: 120 },
  { id: "m6", name: "Masala Papad", sellingPrice: 99, dishCost: 18, labourCost: 5, packagingCost: 7, unitsSold: 90 },
  { id: "m7", name: "Butter Naan", sellingPrice: 69, dishCost: 12, labourCost: 5, packagingCost: 5, unitsSold: 980 },
  { id: "m8", name: "Tandoori Platter", sellingPrice: 649, dishCost: 230, labourCost: 22, packagingCost: 18, unitsSold: 85 },
  { id: "m9", name: "Gulab Jamun (2 pc)", sellingPrice: 119, dishCost: 22, labourCost: 5, packagingCost: 8, unitsSold: 260 },
  { id: "m10", name: "Chicken 65", sellingPrice: 299, dishCost: 90, labourCost: 12, packagingCost: 13, unitsSold: 310 },
];
