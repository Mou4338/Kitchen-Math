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
    seoTitle: "Menu Pricing Calculator for Zomato & Swiggy: Break-Even and Margin-Safe Price",
    seoDescription: "Price a dish from dish cost, labour and packaging after discount, commission, 18% GST on commission, ads and GST on food. Get the break-even price and a margin-safe price ending in 9. Free.",
    summary: "Work the payout formula backwards: find the break-even price and the margin-safe price for any dish on a delivery app.",
    cardDescription: "Break-even price and a margin-safe recommended price, rounded up to end in 9.",
    howTo: [
      "Enter the dish cost, labour and packaging cost for one order.",
      "Enter your discount %, commission %, ads % and GST on food % (usually 5%). GST on commission is fixed at 18%.",
      "Set the margin % you want to keep.",
      "List the dish at the recommended price, and never below the break-even price.",
    ],
    icon: "menuPricing",
    metrics: ["Recommended price", "Break-even price", "Expected profit"],
    keywords: ["menu pricing calculator", "zomato price calculator", "swiggy menu price", "restaurant menu price", "break-even price"],
    formula: [
      { label: "Total cost", expression: "Dish cost + Labour + Packaging cost" },
      { label: "factor", expression: "(1 − Discount) × ((1 + GST on food) × (1 − Ads) − 1.18 × Commission) − Margin" },
      { label: "Break-even price", expression: "Total cost ÷ factor, with Margin = 0" },
      { label: "Recommended price", expression: "Total cost ÷ factor at your margin, rounded up to end in 9" },
      { label: "If factor ≤ 0", expression: "No price can cover costs at this margin" },
    ],
    education: {
      what: "A way to set delivery-app prices from your real cost per order instead of copying competitors or guessing.",
      how: "It runs the Online Payout formula backwards. For every rupee of selling price, the discount comes off first, then commission plus 18% GST on it and ads, while the customer GST is added. What's left is the factor. Dividing your total cost by it gives the price.",
      why: "Dine-in prices copied onto delivery apps often lose money once discounts, commission, GST and ads are taken out. Pricing from cost fixes that.",
      example: "Dish ₹100 + Labour ₹15 + Packaging ₹15 = ₹130. With 10% discount, 25% commission, 5% ads and 5% GST on food, factor = 0.9 × (1.05 × 0.95 − 1.18 × 0.25) = 0.63225. Break-even = ₹130 ÷ 0.63225 = ₹205.61. For a 20% margin: ₹130 ÷ 0.43225 = ₹300.75, rounded up to ₹309. At ₹309 the payout is ₹195.37 and profit ₹65.37 (21.2%).",
      mistakes: ["Forgetting labour or packaging in the total cost.", "Mixing up your packaging cost with the packaging charge to the customer.", "Running a big discount on a dish priced for no discount."],
      improve: ["Re-cost dishes whenever supplier prices change.", "Check the Online Payout calculator to confirm the profit at your final price.", "Keep discounts for slow hours so peak-hour prices stay profitable."],
    },
    faqs: [
      { q: "Why does the price end in 9?", a: "Prices like ₹309 read as cheaper than ₹310 and are standard on delivery apps. The price is always rounded up, never down, so you never fall below your margin." },
      { q: "Why is GST on commission fixed at 18%?", a: "Platforms charge 18% GST on their commission. It isn't something you choose, so it's built in to avoid mistakes." },
      { q: "What if it says no price can cover costs?", a: "Your discount, commission and ads leave too little of each rupee to cover cost plus margin. Lower the discount, ads or margin." },
      { q: "What is the break-even price?", a: "The price at which the dish earns ₹0 after all deductions and costs. Selling below it loses money on every order." },
    ],
    related: ["online-sale-payout-calculator", "menu-engineering-calculator"],
  },
  {
    slug: "online-sale-payout-calculator",
    title: "Online Payout & Profit Calculator",
    shortTitle: "Online Payout",
    seoTitle: "Online Payout & Profit Calculator: Commission, GST, Discount & Ads per Order",
    seoDescription: "See what a Zomato or Swiggy order really pays you: discount, commissionable value, commission with 18% GST, customer GST, ads, payout and profit after dish, labour and packaging cost. Free.",
    summary: "Follow one delivery order from selling price to payout to profit, in the same order the platform shows it.",
    cardDescription: "Payout and profit per order, step by step from selling price to profit.",
    howTo: [
      "Enter the selling price and any packaging charge you add for the customer.",
      "Enter discount %, commission %, ads % and GST on food % (usually 5%). GST on commission is fixed at 18%.",
      "Enter your dish cost, labour and packaging cost.",
      "Read the breakdown top to bottom: discount, commissionable value, commission and GST, customer GST, ads, payout, then profit.",
    ],
    icon: "payout",
    metrics: ["Payout", "Profit per order", "Profit %", "Payout %"],
    keywords: ["online order payout calculator", "zomato payout calculator", "swiggy commission calculator", "restaurant delivery profit", "commission gst calculator"],
    formula: [
      { label: "Discount", expression: "Selling price × Discount %" },
      { label: "Commissionable value (CV)", expression: "Selling price − Discount + Packaging charge" },
      { label: "Commission", expression: "CV × Commission %" },
      { label: "GST on commission", expression: "Commission × 18%" },
      { label: "Customer GST", expression: "CV × GST on food %" },
      { label: "Net sales", expression: "CV + Customer GST (what the customer pays)" },
      { label: "Ads", expression: "Net sales × Ads %" },
      { label: "Payout", expression: "Net sales − Commission − GST on commission − Ads" },
      { label: "Profit", expression: "Payout − (Dish cost + Labour + Packaging cost)" },
      { label: "Profit % / Payout %", expression: "Profit ÷ Selling price × 100 / Payout ÷ Selling price × 100" },
    ],
    education: {
      what: "A breakdown of one delivery-app order from the price on the menu to the profit you keep.",
      how: "The discount comes off the selling price first; any packaging charge is added to give the commissionable value. Commission and 18% GST on it come off that. The customer's GST is added to reach net sales, and ads are taken as a share of net sales. What's left is the payout; subtract your costs for profit.",
      why: "Many owners judge delivery by the payout. The payout isn't profit: the food, labour and packaging still have to be paid for. This view shows whether each order really makes money.",
      example: "₹309 selling price, 10% discount, 25% commission, 5% ads, 5% GST on food: discount ₹30.90, CV ₹278.10, commission ₹69.53, GST on commission ₹12.51, customer GST ₹13.91, net sales ₹292.01, ads ₹14.60. Payout ₹195.37. Profit ₹195.37 − ₹130 = ₹65.37 (21.2%).",
      mistakes: ["Treating the payout as profit.", "Mixing up your packaging cost with the packaging charge to the customer.", "Running the same discount at peak hours as at slow hours."],
      improve: ["Use the Menu Pricing calculator to set prices that cover every deduction.", "Negotiate commission once your volume gives you leverage.", "Keep only the ad types that bring profitable orders."],
    },
    faqs: [
      { q: "What is the commissionable value?", a: "Selling price minus discount plus any packaging charge. The platform's commission is worked out on this amount." },
      { q: "Why is customer GST added to the payout?", a: "This calculator follows the platform's estimated-payout breakdown, where net sales include the customer's GST on food before commission, GST on commission and ads come off." },
      { q: "Why is my profit different from my payout?", a: "Payout is what the platform sends you. Profit is what's left after you also pay for the dish, labour and packaging." },
    ],
    related: ["menu-pricing-calculator", "menu-engineering-calculator"],
  },
  {
    slug: "menu-engineering-calculator",
    title: "Menu Engineering Calculator",
    shortTitle: "Menu Engineering",
    seoTitle: "Menu Engineering Calculator: Stars, Plow Horses, Puzzles & Dogs from Real Payouts",
    seoDescription: "Find which dishes earn the most after discount, commission, GST and ads. Payout and profit per unit, total profit and a Star / Plow Horse / Puzzle / Dog category for every dish. Free.",
    summary: "Run every dish through the same payout calculation, then sort the menu into Stars, Plow Horses, Puzzles and Dogs.",
    cardDescription: "Profit per unit, total profit and a category for every dish, from real payout maths.",
    howTo: [
      "Enter your discount %, commission %, ads %, GST on food % and packaging charge once. They apply to every dish.",
      "For each dish, enter the selling price, dish cost, labour, packaging cost and units sold, or import a CSV.",
      "Each dish gets a category by comparing its profit per unit and units sold with the menu averages.",
      "Promote Puzzles, reprice Plow Horses, and review Dogs.",
    ],
    icon: "menuEngineering",
    metrics: ["Profit per unit", "Total profit", "Category"],
    keywords: ["menu engineering calculator", "menu matrix", "stars plow horses puzzles dogs", "restaurant menu analysis", "zomato menu profit"],
    formula: [
      { label: "Profit per unit", expression: "Payout − (Dish cost + Labour + Packaging cost), using the Online Payout formula" },
      { label: "Total profit", expression: "Profit per unit × Units sold" },
      { label: "Average profit", expression: "Simple average of profit per unit across dishes" },
      { label: "Average popularity", expression: "Simple average of units sold across dishes" },
      { label: "Star / Plow Horse / Puzzle / Dog", expression: "Profit ≥ average and units ≥ average → Star; profit < average, units ≥ average → Plow Horse; profit ≥ average, units < average → Puzzle; otherwise Dog" },
    ],
    education: {
      what: "A way to sort every dish by how well it sells and how much it earns per unit after platform deductions.",
      how: "Each dish runs through the same payout calculation as the Online Payout calculator. Its profit per unit is compared with the average across the menu, and its units sold with the average units sold.",
      why: "It shows which dishes deserve the best spots on your menu and in your ads, and which ones only keep the kitchen busy.",
      example: "A biryani selling 640 units with profit per unit above the menu average is a Star. A tandoori platter with high profit per unit but only 85 units sold is a Puzzle to promote.",
      mistakes: ["Judging dishes by food cost % instead of rupee profit per unit.", "Leaving out labour and packaging cost.", "Analysing too short a period; use a full month."],
      improve: ["Put Stars and Puzzles at the top of the menu with the best photos.", "Reprice Plow Horses in small steps.", "Retire or rework Dogs that complicate prep."],
    },
    faqs: [
      { q: "What CSV format does the import accept?", a: "Columns with headers: Dish Name, Selling Price, Dish Cost, Labour, Packaging Cost, Units Sold. Export a file first to get the template. Older files with a single cost column still import." },
      { q: "Why are commission, discount, ads and GST entered only once?", a: "They're usually the same for every dish on a platform, so every dish uses the same rates in the payout calculation." },
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
