/**
 * Company services, taken from the Restaurant Growth Consulting Framework.
 * Edit text here; the home page and /services page update automatically.
 */
const u = (id: string, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=${w}`;

export type ServiceIcon = "menu" | "pricing" | "ads" | "funnel" | "local" | "reviews" | "competitor" | "ops" | "measure";

export interface Service {
  id: string;
  number: string;
  title: string;
  summary: string;
  bullets: string[];
  icon: ServiceIcon;
  image: { src: string; alt: string };
  group: "core" | "lever";
}

export const SERVICES: Service[] = [
  {
    id: "menu-optimization", number: "01", title: "Menu Optimization", icon: "menu", group: "core",
    summary: "Turn your menu into your best salesperson: clear, complete, and built around what sells.",
    bullets: [
      "Menu score: images, descriptions and serving sizes",
      "Variants, relevant add-ons and preparation options",
      "Combos around high-selling products",
      "Hero-product placement by mealtime",
      "Remove zero-sales items from the last 90 days",
      "Use null-search demand to identify menu opportunities",
    ],
    image: { src: u("1589302168068-964664d93dc0"), alt: "Plated biryani ready to serve" },
  },
  {
    id: "pricing-aov", number: "02", title: "Pricing & AOV", icon: "pricing", group: "core",
    summary: "Price for your positioning and grow the value of every basket.",
    bullets: [
      "Competitive pricing aligned with market positioning",
      "Price architecture across variants and combos",
      "Use MOV strategically to encourage higher basket values",
      "Identify opportunities to increase AOV through add-ons and combos",
    ],
    image: { src: u("1563379091339-03b21ab4a4f8"), alt: "Two plates of food served as a combo" },
  },
  {
    id: "ads-discounting", number: "03", title: "Ads & Discounting", icon: "ads", group: "core",
    summary: "Spend on ads and discounts where they pay back, not by habit.",
    bullets: [
      "Benchmark current ad spend against your target",
      "Evaluate performance across different ad products",
      "Optimize ad investment based on returns",
      "Benchmark current discounting against the intended strategy",
      "Use targeted discounts where a non-discounting strategy is preferred",
    ],
    image: { src: u("1760888549280-4aef010720bd"), alt: "Hand holding a phone with a food ordering app" },
  },
  {
    id: "funnel-optimization", number: "04", title: "Funnel Optimization", icon: "funnel", group: "core",
    summary: "Find exactly where hungry customers drop off, and fix that step first.",
    bullets: [
      "Track I2M, M2C, C2O and M2O",
      "Compare funnel performance across mealtimes",
      "Identify the biggest conversion drop-off",
      "Build actions to improve the weakest stage of the funnel",
    ],
    image: { src: u("1625463006115-09f08489f591"), alt: "Two friends laughing while choosing food on a phone" },
  },
  {
    id: "hyperlocal-intelligence", number: "05", title: "Hyperlocal Intelligence", icon: "local", group: "core",
    summary: "Understand what your city and delivery zone actually want to eat.",
    bullets: [
      "Identify products working in the city and zone that are missing from the menu",
      "Understand cuisine × AOV × mealtime demand patterns",
      "Benchmark funnel performance against local competitors",
      "Identify competitor bestsellers and demand gaps",
    ],
    image: { src: u("1572195577046-2f25894c06fc"), alt: "Delivery rider on a scooter in the city" },
  },
  {
    id: "reviews-product-performance", number: "06", title: "Reviews & Product Performance", icon: "reviews", group: "core",
    summary: "Know which dishes to scale, fix, boost or remove, using sales and ratings together.",
    bullets: [
      "High sales + high rating → Scale",
      "High sales + low rating → Fix",
      "Low sales + high rating → Boost",
      "Low sales + low rating → Remove",
      "Identify recurring customer complaints and patterns",
    ],
    image: { src: u("1755811248324-c70c1f10a7fd"), alt: "Guests enjoying a variety of dishes at a round table" },
  },
  {
    id: "competitor-intelligence", number: "07", title: "Competitor Intelligence", icon: "competitor", group: "core",
    summary: "See where customers order when they don't order from you, and win them back.",
    bullets: [
      "Identify where customers order when they do not order from us",
      "Understand competitor product and price strengths",
      "Find gaps in menu, offers and positioning",
      "Turn competitive gaps into actionable growth opportunities",
    ],
    image: { src: u("1564808868420-8aff5890528b"), alt: "Busy food court seen from above" },
  },
  {
    id: "operations-availability", number: "08", title: "Operations & Availability", icon: "ops", group: "lever",
    summary: "Make sure the kitchen can deliver on the growth strategy, especially at peak.",
    bullets: [
      "Track store/item availability during peak demand",
      "Identify cancellations, stock-outs and recurring fulfilment issues",
      "Ensure the operational experience supports the growth strategy",
    ],
    image: { src: u("1600728619239-d2a73f7aa541"), alt: "Packed delivery order in a paper bag" },
  },
  {
    id: "measurement-execution", number: "09", title: "Measurement & Execution", icon: "measure", group: "lever",
    summary: "Turn insights into prioritised actions, and prove the impact in numbers.",
    bullets: [
      "Prioritize opportunities by potential impact",
      "Convert insights into specific actions and experiments",
      "Track impact on orders, M2O, AOV and revenue",
    ],
    image: { src: u("1553877522-43269d4ea984"), alt: "Person reviewing results on a laptop" },
  },
];

export const GROWTH_EQUATION = [
  { term: "Traffic", detail: "People who see your restaurant" },
  { term: "Conversion", detail: "Visitors who place an order" },
  { term: "AOV", detail: "Average value of each order" },
  { term: "Repeat orders", detail: "Customers who come back" },
];

export const PROCESS = [
  { title: "Diagnose", body: "We review your menu, pricing, ads, funnel, reviews, local demand and competitors to find the one constraint holding growth back." },
  { title: "Prioritise", body: "Every opportunity is ranked by its potential impact, so effort goes where it moves orders and revenue most." },
  { title: "Act", body: "Insights become specific actions and experiments: menu changes, combos, price moves, ad and discount tweaks." },
  { title: "Measure", body: "We track the impact on orders, menu-to-order conversion (M2O), AOV and revenue, then pick the next constraint." },
];

export const FUNNEL = [
  { code: "I2M", name: "Impression → Menu", body: "Of the people who see your listing, how many open your menu." },
  { code: "M2C", name: "Menu → Cart", body: "Of the people who open your menu, how many add something to the cart." },
  { code: "C2O", name: "Cart → Order", body: "Of the people with a cart, how many complete the order." },
  { code: "M2O", name: "Menu → Order", body: "The overall conversion from opening your menu to placing an order." },
];

export const PRODUCT_MATRIX = [
  { action: "Scale", when: "High sales · High rating", tone: "good" as const },
  { action: "Fix", when: "High sales · Low rating", tone: "watch" as const },
  { action: "Boost", when: "Low sales · High rating", tone: "neutral" as const },
  { action: "Remove", when: "Low sales · Low rating", tone: "bad" as const },
];

export const COMPANY_IMAGES = {
  hero: { src: u("1617347454431-f49d7ff5c3b1", 2000), alt: "Delivery rider on a scooter riding through the city at night" },
  team: { src: u("1758518731706-be5d5230e5a5"), alt: "Consulting team collaborating in a modern office" },
  dish: { src: u("1631515243349-e0cb75fb8d3a", 900), alt: "Bowl of rice and meat" },
  contact: { src: u("1714974528737-3e6c7e4d11af", 1800), alt: "Team meeting around a table" },
  servicesHero: { src: u("1542744173-8e7e53415bb0", 2000), alt: "Consultant presenting to a restaurant team" },
};

export const GLOSSARY: [string, string][] = [
  ["AOV", "Average order value: total sales ÷ number of orders."],
  ["MOV", "Minimum order value: the smallest basket a customer can check out."],
  ["I2M", "Impression to menu: the share of people who see your listing and open your menu."],
  ["M2C", "Menu to cart: the share of menu visitors who add an item to the cart."],
  ["C2O", "Cart to order: the share of carts that become orders."],
  ["M2O", "Menu to order: the overall conversion from menu visit to order."],
  ["Null search", "Searches on a platform that returned no matching dish: unmet demand you can serve."],
];
