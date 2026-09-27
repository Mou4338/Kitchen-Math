/**
 * Company services, taken from the Restaurant Growth Consulting Framework.
 * Edit text here; the home page and /services page update automatically.
 */
const u = (id: string, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=${w}`;

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
    image: { src: u("1589302168068-964664d93dc0"), alt: "Plated biryani ready to serve" },
  },
  {
    id: "pricing-order-value", number: "02", title: "Pricing & Order Value", icon: "pricing",
    summary: "Price every dish for profit, and grow every basket.",
    bullets: [
      "Zomato-ready prices that cover commission, discounts and ads",
      "Smart price points across variants and combos",
      "Raise average order value with add-ons and minimum order value",
    ],
    image: { src: u("1563379091339-03b21ab4a4f8"), alt: "Two plates of food served as a combo" },
  },
  {
    id: "ads-discounts", number: "03", title: "Ads & Discounts", icon: "ads",
    summary: "Spend where it pays back, not by habit.",
    bullets: [
      "Check your ad spend and discounts against your targets",
      "Find which ad types actually bring profitable orders",
      "Cut waste and move budget to what works",
    ],
    image: { src: u("1760888549280-4aef010720bd"), alt: "Hand holding a phone with a food ordering app" },
  },
  {
    id: "conversion-funnel", number: "04", title: "Conversion (Funnel)", icon: "funnel",
    summary: "Find where hungry customers drop off, and fix it.",
    bullets: [
      "Track every step from listing view → menu → cart → order",
      "Compare lunch, dinner and late-night performance",
      "Fix the weakest step first",
    ],
    image: { src: u("1625463006115-09f08489f591"), alt: "Two friends laughing while choosing food on a phone" },
  },
  {
    id: "ratings-dish-performance", number: "05", title: "Ratings & Dish Performance", icon: "reviews",
    summary: "Know which dishes to scale, fix, boost or remove.",
    bullets: [
      "Combine sales and ratings for every dish",
      "Spot recurring complaints, cancellations and stock-outs",
      "Protect ratings during peak hours",
    ],
    image: { src: u("1755811248324-c70c1f10a7fd"), alt: "Guests enjoying a variety of dishes at a round table" },
  },
  {
    id: "local-market-competitors", number: "06", title: "Local Market & Competitors", icon: "competitor",
    summary: "See what your area wants and where your customers go instead.",
    bullets: [
      "Popular dishes in your zone that are missing from your menu",
      "Competitor bestsellers, prices and offers",
      "Turn their gaps into your growth",
    ],
    image: { src: u("1572195577046-2f25894c06fc"), alt: "Delivery rider on a scooter in the city" },
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
  /** Hero background slideshow: elegant, upscale dining rooms. */
  heroSlides: [
    { src: u("1753727471014-efe38840c7c7", 2000), alt: "Upscale restaurant interior with elegant dining tables" },
    { src: u("1661422586023-681ea60507e2", 2000), alt: "Grand dining room lit by a chandelier" },
    { src: u("1741852197045-cc35920a3aa0", 2000), alt: "Elegant restaurant dining room" },
  ],
  team: { src: u("1758518731706-be5d5230e5a5"), alt: "Consulting team collaborating in a modern office" },
  dish: { src: u("1631515243349-e0cb75fb8d3a", 900), alt: "Bowl of rice and meat" },
  contact: { src: u("1758518731462-d091b0b4ed0d", 1800), alt: "Business partners shaking hands over an agreement" },
  meeting: { src: u("1714974528737-3e6c7e4d11af", 1800), alt: "Team meeting around a table" },
  ordering: { src: u("1663661759279-5edbf3d58e0c", 1200), alt: "Customer holding a phone to order food" },
  servicesHero: { src: u("1542744173-8e7e53415bb0", 2000), alt: "Consultant presenting to a restaurant team" },
};

export const GLOSSARY: [string, string][] = [
  ["AOV", "Average order value: total sales ÷ number of orders."],
  ["MOV", "Minimum order value: the smallest basket a customer can check out."],
  ["Payout", "What the delivery platform sends to your bank after discount, commission, ads and GST on them."],
  ["Menu mix", "A dish's share of all orders: dish orders ÷ total orders × 100."],
];
