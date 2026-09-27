/**
 * Single source of truth for every calculator: routing, SEO, cards, formulas and educational content.
 */

export type IconName = "payout" | "menuPricing" | "menuEngineering";

export type CalculatorSlug = "menu-pricing-calculator" | "online-sale-payout-calculator" | "menu-engineering-calculator";

export interface FAQ {
  q: string;
  a: string;
}

export interface CalculatorMeta {
  slug: CalculatorSlug;
  title: string;
  shortTitle: string;
  seoTitle: string;
  seoDescription: string;
  /** One-line summary shown under the page title. */
  summary: string;
  cardDescription: string;
  /** Short, numbered instructions shown in the "How to use" panel. */
  howTo: string[];
  icon: IconName;
  metrics: string[];
  keywords: string[];
  formula: { label: string; expression: string }[];
  education: {
    what: string;
    how: string;
    why: string;
    example: string;
    mistakes: string[];
    improve: string[];
  };
  faqs: FAQ[];
  related: CalculatorSlug[];
  isNew?: boolean;
}

export const CALCULATORS: CalculatorMeta[] = [
  {
    slug: "menu-pricing-calculator",
    title: "Menu Pricing Calculator",
    shortTitle: "Menu Pricing",
    seoTitle: "Menu Pricing Calculator for Zomato & Swiggy: Break-Even and Menu Price",
    seoDescription: "Price a dish from dish cost, labour and packaging after commission, GST, discount and ads. Get the break-even price and a menu price ending in 9 that keeps your margin. Free.",
    summary: "Turn your cost per order into a delivery-app price that covers commission, tax, discount and ads, and still keeps your margin.",
    cardDescription: "Break-even price and a margin-safe menu price, rounded up to end in 9.",
    howTo: [
      "Enter the dish cost, labour and PC (packaging) for one order.",
      "Enter your platform's commission %, tax % (GST, usually 18%), discount % and ads %.",
      "Set the margin % you want to keep.",
      "List the dish at the menu price. Never go below the break-even price.",
    ],
    icon: "menuPricing",
    metrics: ["Menu price", "Break-even price", "Total deductions %"],
    keywords: ["menu pricing calculator", "zomato price calculator", "swiggy menu price", "restaurant menu price", "break-even price"],
    formula: [
      { label: "Total cost", expression: "Dish cost + Labour + PC" },
      { label: "Total deductions %", expression: "Commission% × (1 + Tax%) + Discount% + Ads% × (1 + Tax%)" },
      { label: "Break-even price", expression: "Total cost ÷ (1 − Total deductions %)" },
      { label: "Menu price", expression: "Total cost ÷ (1 − Total deductions % − Margin %), rounded up to end in 9" },
      { label: "If deductions + margin ≥ 100%", expression: "No price works: reduce discount or margin" },
    ],
    education: {
      what: "A way to set delivery-app prices from your real cost per order instead of copying competitors or guessing.",
      how: "Every rupee of the selling price loses a fixed share to commission, discount and ads, with tax (GST) charged on the commission and ads. Dividing your total cost by what's left after those deductions gives the break-even price. Also leaving room for your margin gives the menu price, which is then rounded up to end in 9.",
      why: "Dine-in prices copied onto delivery apps often lose money once commission, discounts, ads and GST are taken out. Pricing from cost fixes that.",
      example: "Dish ₹100 + Labour ₹15 + PC ₹15 = ₹130 total cost. With 25% commission, 18% tax, 10% discount and 5% ads, deductions are 25% × 1.18 + 10% + 5% × 1.18 = 45.4%. Break-even = ₹130 ÷ 0.546 = ₹238.10. For a 20% margin: ₹130 ÷ (1 − 0.454 − 0.20) = ₹375.72, rounded up to ₹379. At ₹379 the payout is ₹206.93 and profit ₹76.93 (20.3%).",
      mistakes: ["Forgetting labour or packaging in the total cost.", "Ignoring GST on commission and ads.", "Running a big discount on a dish priced for no discount."],
      improve: ["Re-cost dishes whenever supplier prices change.", "Check the Online Payout calculator to confirm the profit at your final price.", "Keep discounts for slow hours so peak-hour prices stay profitable."],
    },
    faqs: [
      { q: "Why does the price end in 9?", a: "Prices like ₹379 read as cheaper than ₹380 and are standard on delivery apps. The price is always rounded up, so you never fall below your margin." },
      { q: "What does 'Reduce discount or margin' mean?", a: "Your deductions plus your margin add up to 100% or more of the price, so no price can cover them. Lower the discount, the ads or your margin until the total is below 100%." },
      { q: "Is tax charged on the whole price?", a: "In this calculator tax (GST) is charged on the commission and on the ads, which is how platforms bill them. GST the customer pays on food is collected separately." },
      { q: "What is the break-even price?", a: "The price at which the dish earns ₹0 after all deductions and costs. Selling below it loses money on every order." },
    ],
    related: ["online-sale-payout-calculator", "menu-engineering-calculator"],
  },
  {
    slug: "online-sale-payout-calculator",
    title: "Online Payout & Profit Calculator",
    shortTitle: "Online Payout",
    seoTitle: "Online Payout & Profit Calculator: Commission, GST, Discount & Ads per Order",
    seoDescription: "See what a Zomato or Swiggy order really pays you after discount, commission, ads and GST on both, and the profit left after dish, labour and packaging cost. Free.",
    summary: "See every deduction on a delivery order, what the platform pays you, and the profit you actually keep.",
    cardDescription: "Payout and profit per order, line by line from selling price to profit.",
    howTo: [
      "Enter the selling price on the delivery app.",
      "Enter your dish cost, labour and PC (packaging) for the order.",
      "Enter commission %, tax % (GST, usually 18%), discount % and ads %.",
      "Read the breakdown top to bottom: each deduction in rupees, the payout, and your profit per order.",
    ],
    icon: "payout",
    metrics: ["Payout", "Profit per order", "Profit %", "Payout %"],
    keywords: ["online order payout calculator", "zomato payout calculator", "swiggy commission calculator", "restaurant delivery profit", "commission gst calculator"],
    formula: [
      { label: "Discount", expression: "Selling price × Discount %" },
      { label: "Commission", expression: "Selling price × Commission %" },
      { label: "GST on commission", expression: "Commission × Tax %" },
      { label: "Ads", expression: "Selling price × Ads %" },
      { label: "GST on ads", expression: "Ads × Tax %" },
      { label: "Payout", expression: "Selling price − Discount − Commission − GST on commission − Ads − GST on ads" },
      { label: "Profit per order", expression: "Payout − (Dish cost + Labour + PC)" },
      { label: "Profit %", expression: "Profit ÷ Selling price × 100" },
      { label: "Payout %", expression: "Payout ÷ Selling price × 100" },
    ],
    education: {
      what: "A breakdown of one delivery-app order from the price the customer sees to the profit you keep.",
      how: "Discount, commission and ads are taken as a percentage of the selling price. Tax (GST) is added on the commission and on the ads. What's left is the payout the platform sends to your bank. Subtract your dish cost, labour and packaging to get the profit per order.",
      why: "Many owners judge delivery by the payout. The payout isn't profit: the food, labour and packaging still have to be paid for. This view shows whether each order really makes money.",
      example: "₹379 selling price with 10% discount, 25% commission, 5% ads and 18% tax: discount ₹37.90, commission ₹94.75, GST ₹17.06, ads ₹18.95, GST ₹3.41. Payout ₹206.93. Profit ₹206.93 − ₹130 cost = ₹76.93, which is 20.3%, matching the 20% margin from the Menu Pricing calculator.",
      mistakes: ["Treating the payout as profit.", "Forgetting GST on ads.", "Running the same discount at peak hours as at slow hours."],
      improve: ["Use the Menu Pricing calculator to set prices that cover every deduction.", "Negotiate commission once your volume gives you leverage.", "Keep only the ad types that bring profitable orders."],
    },
    faqs: [
      { q: "Is GST charged on the full order or on the commission?", a: "In this calculator the tax is charged on the platform's commission and on the ads. GST the customer pays on food is collected and deposited separately and is not part of your payout maths." },
      { q: "Why is my profit different from my payout?", a: "Payout is what the platform sends you. Profit is what's left after you also pay for the dish, labour and packaging." },
      { q: "What is a healthy profit per order?", a: "It depends on your cuisine and pricing. Set a target margin in the Menu Pricing calculator and check here that your real price meets it." },
    ],
    related: ["menu-pricing-calculator", "menu-engineering-calculator"],
  },
  {
    slug: "menu-engineering-calculator",
    title: "Menu Engineering Calculator",
    shortTitle: "Menu Engineering",
    seoTitle: "Menu Engineering Calculator: Profit per Order, Menu Mix & Popularity Line",
    seoDescription: "Find which dishes earn the most after commission, GST, discount and ads. Profit per order, total profit and menu mix for every dish, with Stars, Puzzles, Plowhorses and Dogs. Free.",
    summary: "See the profit per order, total profit and menu mix of every dish, then decide what to promote, reprice or remove.",
    cardDescription: "Profit per order, total profit and menu mix for every dish, with the popularity line.",
    howTo: [
      "Enter your commission %, tax %, discount % and ads % once. They apply to every dish.",
      "For each dish, enter the selling price, total cost (Dish + Labour + PC) and orders in the month, or import a CSV.",
      "Compare each dish's menu mix with the popularity line, and its profit per order with the average.",
      "Promote Puzzles, reprice Plowhorses, and review Dogs.",
    ],
    icon: "menuEngineering",
    metrics: ["Profit per order", "Total profit", "Menu mix %", "Popularity line"],
    keywords: ["menu engineering calculator", "menu matrix", "stars plowhorses puzzles dogs", "restaurant menu analysis", "menu mix"],
    formula: [
      { label: "Profit per order", expression: "Payout − Total cost (payout formula from the Online Payout calculator)" },
      { label: "Total profit", expression: "Profit per order × Orders" },
      { label: "Menu mix %", expression: "Dish orders ÷ Total orders of all dishes × 100" },
      { label: "Popularity line", expression: "(100% ÷ Number of dishes) × 0.7" },
      { label: "Average profit per order", expression: "Total profit of all dishes ÷ Total orders of all dishes" },
    ],
    education: {
      what: "A way to sort every dish by how well it sells and how much it earns per order after platform deductions.",
      how: "A dish is popular if its menu mix is at or above the popularity line: 70% of an equal share. With 10 dishes, a dish needs at least 7% of orders. A dish is high-profit if its profit per order is at or above the average profit per order across the menu.",
      why: "It shows which dishes deserve the best spots on your menu and in your ads, and which ones only keep the kitchen busy.",
      example: "With 10 dishes the popularity line is 7%. A biryani with 18% of orders and above-average profit per order is a Star. A tandoori platter with high profit but only 2% of orders is a Puzzle to promote.",
      mistakes: ["Judging dishes by food cost % instead of rupee profit per order.", "Leaving out labour and packaging from the total cost.", "Analysing too short a period; use a full month."],
      improve: ["Put Stars and Puzzles at the top of the menu with the best photos.", "Reprice Plowhorses in small steps.", "Retire or rework Dogs that complicate prep."],
    },
    faqs: [
      { q: "What CSV format does the import accept?", a: "Four columns with headers: Dish Name, Selling Price, Total Cost, Orders. Export a file first to get the template." },
      { q: "Why are commission, tax, discount and ads entered only once?", a: "They're usually the same for every dish on a platform. Profit per order for each dish uses the same payout formula with these rates." },
      { q: "How many dishes can I analyse?", a: "Up to 500. For best results, analyse one menu section, such as mains, at a time." },
    ],
    related: ["menu-pricing-calculator", "online-sale-payout-calculator"],
    isNew: true,
  },
];

export function getCalculator(slug: CalculatorSlug): CalculatorMeta {
  const c = CALCULATORS.find((x) => x.slug === slug);
  if (!c) throw new Error(`Unknown calculator: ${slug}`);
  return c;
}

export const calculatorPath = (slug: CalculatorSlug) => `/restaurant/${slug}`;
