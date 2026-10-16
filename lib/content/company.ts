/**
 * Company services, taken from the Restaurant Growth Consulting Framework.
 * Edit text here; the home page and /services page update automatically.
 */
const u = (id: string, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=${w}`;
/** Tall crop of the same photo for phones (smart-cropped around the busiest part of the image). */
const portrait = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=entropy&q=80&w=900&h=1600`;
const slide = (id: string, alt: string) => ({ src: u(id, 2000), mobileSrc: portrait(id), alt });

export type ServiceIcon = "menu" | "pricing" | "ads" | "funnel" | "reviews" | "competitor";

export interface Service {
  id: string;
  number: string;
  title: string;
  summary: string;
  bullets: string[];
  icon: ServiceIcon;
  image: { src: string; alt: string };
}

export const SERVICES: Service[] = [
  {
    id: "menu-optimization", number: "01", title: "Menu Optimization", icon: "menu",
    summary: "Turn your menu into your best salesperson.",
    bullets: [
      "Better photos, descriptions and serving sizes",
      "Combos and add-ons around your bestsellers",
      "Remove dead items and add dishes customers are searching for",
    ],
    image: { src: "/images/services/menu-optimization.webp", alt: "A biryani listing before and after optimization: no photo and a one-line description versus a photo, full name, description, bestseller tag and serving size, lifting menu-to-cart from 5.7% to 9.1%" },
  },
  {
    id: "pricing-order-value", number: "02", title: "Pricing & Order Value", icon: "pricing",
    summary: "Price every dish for profit, and grow every basket.",
    bullets: [
      "Zomato-ready prices that cover commission, discounts and ads",
      "Smart price points across variants and combos",
      "Raise average order value with add-ons and minimum order value",
    ],
    image: { src: "/images/services/pricing-order-value.webp", alt: "Chicken biryani priced at ₹333.76 to keep a 20% profit with a break-even of ₹220.53, beside a basket where a raita add-on and gulab jamun combo raise order value from ₹334 to ₹502 and unlock free delivery" },
  },
  {
    id: "ads-discounts", number: "03", title: "Ads & Discounts", icon: "ads",
    summary: "Spend where it pays back, not by habit.",
    bullets: [
      "Check your ad spend and discounts against your targets",
      "Find which ad types actually bring profitable orders",
      "Cut waste and move budget to what works",
    ],
    image: { src: "/images/services/ads-discounts.webp", alt: "Orders per ₹1,000 of ad spend rising week by week, beside a comparison of profit per biryani order under three offers, where 10% off earns ₹43.64 more than 50% off" },
  },
  {
    id: "conversion-funnel", number: "04", title: "Conversion (Funnel)", icon: "funnel",
    summary: "Find where hungry customers drop off, and fix it.",
    bullets: [
      "Track every step from listing view → menu → cart → order",
      "Compare lunch, dinner and late-night performance",
      "Fix the weakest step first",
    ],
    image: { src: "/images/services/conversion-funnel.webp", alt: "Ordering funnel from 10,000 listing views to 610 orders with menu-to-cart as the weakest step, beside the fix that lifts menu-to-cart from 26% to 32% for 127 more orders from the same traffic" },
  },
  {
    id: "ratings-dish-performance", number: "05", title: "Ratings & Dish Performance", icon: "reviews",
    summary: "Know which dishes to scale, fix, boost or remove.",
    bullets: [
      "Combine sales and ratings for every dish",
      "Spot recurring complaints, cancellations and stock-outs",
      "Protect ratings during peak hours",
    ],
    image: { src: "/images/services/ratings-dish-performance.webp", alt: "Butter chicken rated 3.7 with its most common complaints, beside a scale, fix, boost or remove grid that sorts dishes by sales and rating" },
  },
  {
    id: "local-market-competitors", number: "06", title: "Local Market & Competitors", icon: "competitor",
    summary: "See what your area wants and where your customers go instead.",
    bullets: [
      "Popular dishes in your zone that are missing from your menu",
      "Competitor bestsellers, prices and offers",
      "Turn their gaps into your growth",
    ],
    image: { src: "/images/services/local-market-competitors-2.webp", alt: "Dishes in demand in your 3 km delivery zone that are missing from your menu, beside a rival watch comparing your biryani price with 3 nearby competitors and suggesting a ₹199 mini biryani bowl" },
  },
];

export const GROWTH_EQUATION = [
  { term: "Traffic", detail: "People who see your restaurant" },
  { term: "Conversion", detail: "Visitors who place an order" },
  { term: "AOV", detail: "Average value of each order" },
  { term: "Repeat orders", detail: "Customers who come back" },
];

export const PROCESS = [
  { title: "Diagnose", body: "We review your menu, pricing, ads, conversion, ratings, local market and competitors to find the one constraint holding growth back." },
  { title: "Prioritise", body: "Every opportunity is ranked by its potential impact, so effort goes where it moves orders and revenue most." },
  { title: "Act", body: "Insights become specific actions and experiments: menu changes, combos, price moves, ad and discount tweaks." },
  { title: "Measure", body: "We track the impact on orders, conversion, average order value and revenue, then pick the next constraint." },
];

export const COMPANY_IMAGES = {
  hero: { src: u("1753727471014-efe38840c7c7", 2000), alt: "Upscale restaurant interior with elegant dining tables" },
  /** Hero background slideshow: moody, upscale dining rooms and a busy kitchen. */
  heroSlides: [
    slide("1753727471014-efe38840c7c7", "Upscale restaurant interior with elegant dining tables"),
    slide("1721637713270-5470ea1d6389", "Chefs preparing food together in a restaurant kitchen"),
    slide("1782541370275-6761522e39d1", "Hands serving chicken biryani with lemon and sauce"),
    slide("1703793578040-07e1778b6b2c", "Dimly lit restaurant dining room"),
    slide("1663530761401-15eefb544889", "Chef finishing a plated dish with sauce"),
    slide("1517248135467-4c7edcad34c4", "Busy restaurant dining room in the evening"),
    slide("1661422586023-681ea60507e2", "Grand dining room lit by a chandelier"),
  ],
  team: { src: u("1517245386807-bb43f82c33c4"), alt: "Consultant walking a client through numbers on a laptop" },
  dish: { src: u("1772730064951-89b427965dbc", 900), alt: "Bowl of chicken tikka masala garnished with mint" },
  contact: { src: u("1632152133952-98b268dc4b86", 1800), alt: "Paper forms and a pen on a wooden table" },
  meeting: { src: u("1551135049-8a33b5883817", 1800), alt: "Team reviewing a plan on paper around a table" },
  ordering: { src: u("1663661759279-5edbf3d58e0c", 1200), alt: "Customer holding a phone to order food" },
  servicesHero: { src: "/images/heroes/tablet-insights.webp", alt: "Restaurant owner checking sales insights and best-selling items on a tablet beside a receipt printer" },
  /** Faint background photos behind the darker feature bands. */
  kitchen: { src: u("1721637713270-5470ea1d6389", 2000), alt: "" },
};

export const GLOSSARY: [string, string][] = [
  ["AOV", "Average order value: total sales ÷ number of orders."],
  ["MOV", "Minimum order value: the smallest basket a customer can check out."],
  ["Payout", "What the delivery platform sends to your bank after discount, commission with 18% GST, and ads."],
  ["Commissionable value", "Selling price minus discount plus packaging charge: the amount commission is charged on."],
];
