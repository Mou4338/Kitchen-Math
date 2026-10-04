import { z } from "zod";

const MAX_AMOUNT = 1e12; // ₹1 lakh crore

/** Rupee amount: non-negative, finite, sensible size. */
export const amount = (label = "This amount") =>
  z
    .number({ invalid_type_error: `${label} must be a number` })
    .finite(`${label} must be a number`)
    .min(0, `${label} can't be negative`)
    .max(MAX_AMOUNT, `${label} is too large`);

/** Percentage between 0 and `max` (default 100). */
export const percent = (label = "This percentage", max = 100) =>
  z
    .number({ invalid_type_error: `${label} must be a number` })
    .finite(`${label} must be a number`)
    .min(0, `${label} can't be negative`)
    .max(max, `${label} can't be more than ${max}%`);

export const count = (label = "This value", max = 1e7) =>
  z.number({ invalid_type_error: `${label} must be a number` }).finite().min(0, `${label} can't be negative`).max(max, `${label} is too large`);

const platformRates = {
  discountPercent: percent("Discount"),
  commissionPercent: percent("Commission"),
  adsPercent: percent("Ads"),
  packagingCharge: amount("Packaging charge"),
};

const orderCosts = {
  dishCost: amount("Dish cost"),
  labourCost: amount("Labour"),
  packagingCost: amount("Packaging cost"),
};

export const menuPricingSchema = z.object({
  ...orderCosts,
  ...platformRates,
  marginPercent: percent("Margin", 99),
});
export type MenuPricingForm = z.infer<typeof menuPricingSchema>;

export const onlinePayoutSchema = z.object({
  sellingPrice: amount("Selling price"),
  ...orderCosts,
  ...platformRates,
});
export type OnlinePayoutForm = z.infer<typeof onlinePayoutSchema>;

export const platformRatesSchema = z.object(platformRates);

export const menuItemSchema = z.object({
  id: z.string(),
  name: z.string().max(80),
  sellingPrice: amount("Price"),
  dishCost: amount("Dish cost"),
  labourCost: amount("Labour"),
  packagingCost: amount("Packaging cost"),
  unitsSold: count("Units sold"),
});
export const menuItemsSchema = z.array(menuItemSchema).max(500);
