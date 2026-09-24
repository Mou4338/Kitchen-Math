/**
 * Single source of truth for every calculator: routing, SEO, cards, formulas and educational content.
 */

export type IconName = "health" | "breakEven" | "payout" | "menuPricing" | "foodCost" | "primeCost" | "profitMargin" | "roi" | "menuEngineering";

export type CalculatorSlug =
  | "restaurant-health-calculator"
  | "break-even-calculator"
  | "online-sale-payout-calculator"
  | "menu-pricing-calculator"
  | "food-cost-calculator"
  | "prime-cost-calculator"
  | "profit-margin-calculator"
  | "restaurant-roi-calculator"
  | "menu-engineering-calculator";

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
    slug: "restaurant-health-calculator",
    title: "Restaurant Health Calculator",
    shortTitle: "Restaurant Health",
    seoTitle: "Restaurant Health Calculator: Food, Labor & Marketing Cost % with Health Score",
    seoDescription:
      "Calculate food cost %, labor cost %, marketing cost % and prime cost for your restaurant, compare with reference benchmarks and get a transparent health score. Free, no login.",
    summary: "Work out your food, labor and marketing cost as a share of sales, then get one transparent health score with the next steps to improve it.",
    cardDescription: "Food, labor and marketing cost %, prime cost and a weighted health score with improvement ideas.",
    howTo: [
      "Pick a tab: Food cost, Labor cost or Marketing. You can fill one, two or all three.",
      "Food cost: enter stock at the start and end of the month, what you bought, and food sales for the same month.",
      "Labor and Marketing: enter the month's salaries or marketing spend and total monthly sales (shared by both tabs).",
      "Read your score and the coloured cards: green is within the reference range, amber needs a look, red needs action. Use “What happens if…” to test changes.",
    ],
    icon: "health",
    metrics: ["Food cost %", "Labor %", "Marketing %", "Health score"],
    keywords: ["restaurant health calculator", "food cost percentage", "labor cost calculator restaurant", "restaurant marketing cost", "restaurant health score"],
    formula: [
      { label: "Food cost %", expression: "((Opening stock + Purchases − Closing stock) ÷ Total food sales) × 100" },
      { label: "Labor cost %", expression: "(Total staff salaries ÷ Total monthly sales) × 100" },
      { label: "Marketing cost %", expression: "(Total marketing spend ÷ Total monthly sales) × 100" },
      { label: "Prime cost %", expression: "((Food consumed + Staff salaries) ÷ Total monthly sales) × 100" },
      { label: "Health score", expression: "Food score × 45% + Labor score × 35% + Marketing score × 20% (only metrics you entered)" },
    ],
    education: {
      what: "A quick check-up of the three controllable costs that decide most restaurant profits: ingredients, people and promotion. Each one is shown as a share of sales so you can compare month to month and against reference ranges.",
      how: "Food cost uses your stock movement: what you started with, plus what you bought, minus what is left. That's the food you actually used. Labor and marketing are divided by total monthly sales. Each metric gets a 0–100 score against its reference range and the scores are weighted into one number.",
      why: "Most Indian restaurants run on 5–10% net margins. One extra point of food cost on ₹10 lakh of sales is ₹10,000 a month. Tracking these three percentages every week catches problems before they reach your P&L.",
      example: "Opening stock ₹1,20,000 + purchases ₹3,80,000 − closing stock ₹95,000 = ₹4,05,000 food used. On ₹12,50,000 food sales that's 32.4% food cost. Salaries of ₹3,20,000 on ₹14,00,000 sales is 22.9% labor.",
      mistakes: [
        "Using purchases instead of stock movement, which makes food cost jump around month to month.",
        "Leaving out overtime, bonuses, PF/ESI and staff food from labor cost.",
        "Counting marketing only as paid ads and forgetting influencer visits, discounts and printed material.",
        "Checking once a quarter. Weekly checks catch waste and theft early.",
      ],
      improve: [
        "Standardise recipes and portion sizes with scoops and scales.",
        "Roster staff by hourly sales, not habit. Cross-train for slow shifts.",
        "Track cost per new customer for every marketing channel and cut what doesn't convert.",
        "Negotiate supplier rates monthly and use FIFO stock rotation.",
      ],
    },
    faqs: [
      { q: "What is a good food cost percentage for a restaurant?", a: "Many restaurants aim for 28–35% of food sales. Quick-service formats can run lower; premium seafood or meat-heavy menus often run higher and recover it through pricing. Treat 35% as a reference point, not a rule." },
      { q: "What is a good labor cost percentage?", a: "A common reference range is 20–25% of sales. Much lower can mean understaffing that hurts service; much higher usually points to scheduling that doesn't match demand." },
      { q: "How much should a restaurant spend on marketing?", a: "Around 2–4% of monthly sales is a common reference. New outlets often spend more in their first months to build awareness." },
      { q: "How is the health score calculated?", a: "Each metric gets a 0–100 score based on how far it sits from its reference range. Food counts 45%, labor 35% and marketing 20%. If you only enter one metric, the score uses only that one. You can see every sub-score on the page." },
      { q: "Can I change the benchmarks?", a: "Yes. Open “Reference benchmarks” on the calculator and set the ranges that fit your format. Your settings are saved on this device." },
    ],
    related: ["food-cost-calculator", "prime-cost-calculator", "profit-margin-calculator"],
  },
  {
    slug: "break-even-calculator",
    title: "Break-Even Calculator",
    shortTitle: "Break-Even",
    seoTitle: "Restaurant Break-Even Calculator: Calculate Monthly Break-Even Sales",
    seoDescription:
      "Find your restaurant's monthly and daily break-even sales, margin of safety and net profit. Test rent, salary, food cost and sales scenarios instantly. Free, no login.",
    summary: "See how much you need to sell each month, each day and in orders to cover every cost, and how far you are from the line.",
    cardDescription: "Monthly, daily and per-order break-even, margin of safety and scenario tests.",
    howTo: [
      "Enter your average monthly sales and raw material cost as a % of sales (include packaging and delivery commissions).",
      "Add your fixed monthly bills: rent, salaries, electricity and any loan EMIs.",
      "Add your average bill value to see how many orders a day you need.",
      "Check the loss/profit bar, then try the scenario buttons (Revenue −10%, Rent +10% …) before you commit to a change.",
    ],
    icon: "breakEven",
    metrics: ["Break-even sales", "Margin of safety", "Net profit", "Orders/day"],
    keywords: ["restaurant break-even calculator", "break-even point restaurant", "margin of safety", "contribution margin restaurant"],
    formula: [
      { label: "Contribution margin", expression: "100% − Raw material (variable) cost %" },
      { label: "Break-even sales", expression: "Fixed costs ÷ Contribution margin" },
      { label: "Margin of safety", expression: "Current revenue − Break-even sales" },
      { label: "Net profit", expression: "Revenue − Variable costs − Fixed costs" },
    ],
    education: {
      what: "The monthly sales at which your restaurant makes neither profit nor loss. Every rupee above it is profit; every rupee below it is a loss.",
      how: "Costs are split into variable costs that rise with sales (raw material, packaging, commissions) and fixed costs you pay regardless (rent, salaries, electricity, EMIs). Fixed costs divided by the share of each sale left after variable costs gives the break-even.",
      why: "Break-even turns vague worry into a target your team can chase: a number per day, or orders per day. It also tells you whether a rent hike, new hire or supplier change is affordable before you commit.",
      example: "Fixed costs ₹2,35,000 and raw material at 34% leave a 66% contribution margin. Break-even = ₹2,35,000 ÷ 0.66 = ₹3,56,061 a month, or about ₹11,869 a day.",
      mistakes: [
        "Treating delivery commissions as fixed. They rise with every order, so they belong in variable cost.",
        "Forgetting loan EMIs, licences and software subscriptions in fixed costs.",
        "Using a good month's revenue as normal. Test a slow month too.",
      ],
      improve: [
        "Reduce raw material cost with better buying and less waste. Each point lowers break-even.",
        "Move repeat customers to direct ordering to avoid commissions.",
        "Ask about revenue-share rent for slow months.",
        "Raise average order value with combos and add-ons.",
      ],
    },
    faqs: [
      { q: "What is a break-even point for a restaurant?", a: "The level of monthly sales where total revenue equals total costs, so profit is zero." },
      { q: "What is margin of safety?", a: "How far sales can fall before you start losing money, in rupees and as a percentage of current sales. Many owners treat 25% or more as comfortable and under 10% as risky." },
      { q: "What is a healthy contribution margin?", a: "Dine-in restaurants often run 60–70%. Delivery-heavy kitchens are often 40–55% once commissions are included as variable costs." },
      { q: "Why show orders per day?", a: "Your team can act on “52 orders today” more easily than on a monthly rupee target. Enter your average order value to see it." },
    ],
    related: ["profit-margin-calculator", "prime-cost-calculator", "restaurant-roi-calculator"],
  },
  {
    slug: "online-sale-payout-calculator",
    title: "Online Sale Payout & Profit Calculator",
    shortTitle: "Online Payout",
    seoTitle: "Online Order Payout & Profit Calculator: Commission, GST, Gateway, Ads & Food Cost",
    seoDescription:
      "See exactly what a food delivery order leaves you after commission, 18% GST on commission, gateway fees, discounts, ads and food cost. Compare platforms with direct orders. Free.",
    summary: "See where every rupee of an online order goes, what reaches your bank and what you actually keep, then compare platforms with direct orders.",
    cardDescription: "Order waterfall from customer price to true profit, platform comparison and monthly simulation.",
    howTo: [
      "Type the order value as shown on the delivery app.",
      "Set the commission, gateway, discount, ads and food cost sliders to match your contract (or type exact values).",
      "Read the waterfall top to bottom: every deduction with its ₹ amount, down to the profit you really keep.",
      "Scroll down to compare Platform A, Platform B and direct orders, and to see your whole month.",
    ],
    icon: "payout",
    metrics: ["Payout", "True profit", "Platform fees", "Monthly profit"],
    keywords: ["online order payout calculator", "food delivery commission calculator", "restaurant delivery profit", "commission gst calculator"],
    formula: [
      { label: "Payout", expression: "Order − Discount − Commission − (18% × Commission) − Gateway" },
      { label: "True profit", expression: "Payout − Ads − Food cost" },
      { label: "Profit %", expression: "True profit ÷ Order value × 100" },
    ],
    education: {
      what: "A breakdown of one delivery-app order from the price the customer sees to the profit you keep.",
      how: "Commission, gateway, discount, ads and food cost are applied as a percentage of the order value. GST at 18% is charged on the commission amount only. The platform settles the payout to your bank; ads and food cost come out of that.",
      why: "Many owners judge delivery by the payout amount. The payout isn't profit: ads and ingredients still have to be paid. This view shows whether online orders really make money.",
      example: "On a ₹1,000 order at 27% commission, 2% gateway, 10% discount, 10% ads and 30% food cost: commission ₹270, GST ₹48.60, gateway ₹20, discount ₹100, payout ₹561.40, ads ₹100, food ₹300, true profit ₹161.40 (16.1%).",
      mistakes: [
        "Running the same discount at peak hours as at slow hours.",
        "Keeping ads on without checking whether they bring extra orders.",
        "Using dine-in prices online without covering platform fees.",
      ],
      improve: [
        "Price online menus to cover fees. The Menu Pricing calculator shows the exact price.",
        "Negotiate commission once your volume gives you leverage.",
        "Put a direct-order card in every bag to build commission-free repeat business.",
      ],
    },
    faqs: [
      { q: "Is GST charged on the full order or on the commission?", a: "The 18% GST in this calculator is charged on the platform's commission only. GST the customer pays on food is collected and deposited separately and is not part of your payout maths." },
      { q: "Why is my profit different from my payout?", a: "Payout is what the platform sends you. Profit is what's left after you also pay for ads and the food itself." },
      { q: "What is a healthy profit on delivery orders?", a: "It varies by cuisine and pricing. Many operators aim for 10–15% true profit per order after all deductions. Anything near zero means you're mainly buying volume." },
      { q: "Are Platform A and B real platforms?", a: "They're placeholders. Enter the commission, ads and discount terms from your own contracts to compare them." },
    ],
    related: ["menu-pricing-calculator", "break-even-calculator", "profit-margin-calculator"],
  },
  {
    slug: "menu-pricing-calculator",
    title: "Menu Pricing Calculator",
    shortTitle: "Menu Pricing",
    seoTitle: "Restaurant Menu Pricing Calculator: Dine-In & Online Prices from Food Cost",
    seoDescription: "Price menu items from ingredient cost, target food cost and profit margin. Get recommended dine-in and online prices, minimum price and expected profit. Free.",
    summary: "Turn plate cost into a menu price for dine-in and online that meets your food cost and margin targets.",
    cardDescription: "Recommended dine-in and online prices, minimum price and profit per plate.",
    howTo: [
      "Enter the ingredient cost for one portion, plus prep cost and packaging if you want them covered.",
      "Set your target food cost % and target profit margin.",
      "Choose a price ending (₹…9, nearest ₹5 or ₹10).",
      "Use the dine-in price on your menu and the online price on delivery apps. Never go below the minimum price.",
    ],
    icon: "menuPricing",
    metrics: ["Dine-in price", "Online price", "Minimum price", "Profit/plate"],
    keywords: ["menu pricing calculator", "restaurant menu price", "food cost pricing", "online menu price"],
    formula: [
      { label: "Price from food cost", expression: "Ingredient cost ÷ Target food cost %" },
      { label: "Price from margin", expression: "(Ingredient + Prep cost) ÷ (1 − Target margin %)" },
      { label: "Dine-in price", expression: "The higher of the two, rounded up to a menu ending" },
      { label: "Online price", expression: "(Plate cost + Packaging) ÷ (1 − Commission × 1.18 − Gateway − Discount − Target margin)" },
    ],
    education: {
      what: "A way to set prices from real costs instead of copying competitors or guessing.",
      how: "Your dine-in price must meet both your food cost target and your profit margin target, so the calculator takes the stricter of the two. The online price also covers commission (plus 18% GST on it), gateway fees, discount and packaging.",
      why: "Under-priced best-sellers quietly drain profit, and online orders priced like dine-in often lose money. Pricing from cost fixes both.",
      example: "Ingredients ₹95 at a 30% food cost target gives ₹317, rounded to ₹319. With packaging ₹15 and 25% commission, 2% gateway and 10% discount, the online price that keeps a 25% margin is much higher.",
      mistakes: ["Forgetting oil, garnish and gravy base in ingredient cost.", "Ignoring packaging on delivery orders.", "Rounding prices down to look cheaper."],
      improve: ["Re-cost recipes whenever supplier prices change.", "Check competitor prices after costing and adjust the recipe if you're far above them.", "Keep a separate online menu."],
    },
    faqs: [
      { q: "What target food cost should I use?", a: "Many restaurants use 28–35%. Use lower targets for high-volume, low-prep items and higher for premium proteins." },
      { q: "Is the price before or after GST?", a: "Recommended prices are before GST. The customer price including GST is shown separately." },
      { q: "What is the minimum price?", a: "The price at which the item makes zero profit on that channel. Never sell below it." },
    ],
    related: ["menu-engineering-calculator", "food-cost-calculator", "online-sale-payout-calculator"],
    isNew: true,
  },
  {
    slug: "food-cost-calculator",
    title: "Food Cost Calculator",
    shortTitle: "Food Cost",
    seoTitle: "Restaurant Food Cost Calculator: COGS, Food Cost % and Waste-Adjusted Cost",
    seoDescription: "Calculate cost of goods sold, food cost percentage and gross profit from your stock counts. Adjust for waste, spoilage, staff meals and complimentary food. Free.",
    summary: "Measure food cost from your stock counts, then see how much of it went to waste, staff meals and freebies.",
    cardDescription: "COGS, food cost % and gross profit, adjusted for waste, spoilage and staff meals.",
    howTo: [
      "Count your stock at the start and end of the period and note what you bought in between.",
      "Enter food sales for the same period.",
      "Optional: add waste, spoilage, staff meals and free food to see how much food never earned money.",
      "Compare food cost with adjusted food cost; the gap is money you can recover.",
    ],
    icon: "foodCost",
    metrics: ["COGS", "Food cost %", "Gross profit", "Waste share"],
    keywords: ["food cost calculator", "restaurant cogs calculator", "food cost percentage formula", "restaurant waste"],
    formula: [
      { label: "Cost of goods sold (COGS)", expression: "Opening inventory + Purchases − Closing inventory" },
      { label: "Food cost %", expression: "COGS ÷ Food sales × 100" },
      { label: "Gross profit", expression: "Food sales − COGS" },
      { label: "Adjusted food cost %", expression: "(COGS − Waste − Spoilage − Staff meals − Complimentary) ÷ Food sales × 100" },
    ],
    education: {
      what: "The cost of the ingredients you actually used in a period, compared with what you sold.",
      how: "Count stock at the start and end of the period. Add purchases, subtract closing stock and you have COGS. Logging waste, spoilage, staff meals and complimentary food shows how much of COGS never earned a rupee.",
      why: "The gap between actual and adjusted food cost is money you can recover without raising a single price.",
      example: "₹1,50,000 + ₹4,20,000 − ₹1,10,000 = ₹4,60,000 COGS on ₹14,00,000 sales: 32.9%. Removing ₹40,000 of waste and staff food gives 30%.",
      mistakes: ["Estimating closing stock instead of counting it.", "Not recording waste daily.", "Mixing beverage and food costs."],
      improve: ["Keep a daily waste log at the pass.", "Use prep sheets based on sales forecasts.", "Rotate stock first-in, first-out."],
    },
    faqs: [
      { q: "How often should I count stock?", a: "Weekly for high-value items like meat, dairy and oil; monthly for everything else is a practical minimum." },
      { q: "Should staff meals count as food cost?", a: "They are a real cost. Tracking them separately shows your true menu food cost and your staff benefit cost." },
    ],
    related: ["restaurant-health-calculator", "prime-cost-calculator", "menu-pricing-calculator"],
    isNew: true,
  },
  {
    slug: "prime-cost-calculator",
    title: "Prime Cost Calculator",
    shortTitle: "Prime Cost",
    seoTitle: "Restaurant Prime Cost Calculator: Food + Labor as a % of Sales",
    seoDescription: "Calculate your restaurant's prime cost and prime cost percentage, and see what's left for rent, utilities and profit. Free, no login.",
    summary: "Add food and labor together, the two biggest costs you control, and see what's left to run the business.",
    cardDescription: "Food + labor as a share of revenue, with the operating margin that remains.",
    howTo: [
      "Enter the month's food cost (stock used, not purchases).",
      "Enter the month's total labor cost, including benefits.",
      "Enter total revenue for the same month.",
      "Read the gauge: the green band is the reference range. What's left pays rent, bills and profit.",
    ],
    icon: "primeCost",
    metrics: ["Prime cost", "Prime cost %", "Remaining margin"],
    keywords: ["prime cost calculator", "restaurant prime cost", "prime cost percentage"],
    formula: [
      { label: "Prime cost", expression: "Food cost + Labor cost" },
      { label: "Prime cost %", expression: "Prime cost ÷ Revenue × 100" },
      { label: "Remaining operating margin", expression: "Revenue − Prime cost" },
    ],
    education: {
      what: "Prime cost is food cost plus labor cost, usually the largest part of a restaurant's spending.",
      how: "Add the month's food cost (COGS) and total labor cost, then divide by revenue.",
      why: "Food and labor trade off against each other. A kitchen that preps more in-house has lower food cost but higher labor. Prime cost shows the combined picture.",
      example: "Food ₹4,60,000 + labor ₹3,30,000 = ₹7,90,000 on ₹14,00,000 revenue: 56.4%, leaving ₹6,10,000 for everything else.",
      mistakes: ["Using purchases instead of COGS.", "Leaving the owner's salary out of labor."],
      improve: ["Review food and labor together every week.", "Use prep and staffing plans built from the same sales forecast."],
    },
    faqs: [
      { q: "What is a good prime cost percentage?", a: "A common reference range is 55–65% of sales. Full-service restaurants tend to sit higher than quick-service." },
      { q: "Why isn't rent part of prime cost?", a: "Rent is largely fixed and negotiated rarely. Prime cost focuses on costs you can manage week to week." },
    ],
    related: ["restaurant-health-calculator", "profit-margin-calculator", "food-cost-calculator"],
    isNew: true,
  },
  {
    slug: "profit-margin-calculator",
    title: "Profit Margin Calculator",
    shortTitle: "Profit Margin",
    seoTitle: "Restaurant Profit Margin Calculator: Gross, Operating & Net Margin with P&L",
    seoDescription: "Build a simple restaurant P&L: gross profit, operating profit and net profit with margins and a visual waterfall. Free, no login.",
    summary: "Build a one-page P&L and see gross, operating and net margin, with a waterfall of where the money goes.",
    cardDescription: "Gross, operating and net profit with a full P&L waterfall.",
    howTo: [
      "Enter the month's revenue and food cost.",
      "Fill in each expense line; leave any you don't have at 0.",
      "Read gross, operating and net margin at the top.",
      "Follow the waterfall to see which cost takes the biggest bite, then test changes in Scenario mode.",
    ],
    icon: "profitMargin",
    metrics: ["Gross margin", "Operating margin", "Net margin"],
    keywords: ["restaurant profit margin calculator", "restaurant p&l", "net profit margin restaurant"],
    formula: [
      { label: "Gross profit", expression: "Revenue − Food cost" },
      { label: "Operating profit", expression: "Gross profit − (Labor + Rent + Utilities + Marketing + Delivery fees + Other)" },
      { label: "Net profit", expression: "Operating profit − Taxes" },
      { label: "Margin", expression: "Profit ÷ Revenue × 100" },
    ],
    education: {
      what: "A simplified monthly profit and loss statement for a restaurant.",
      how: "Start from revenue, subtract food cost for gross profit, subtract operating expenses for operating profit, then subtract taxes for net profit.",
      why: "Seeing every cost as a share of revenue shows which line to attack first.",
      example: "₹14,00,000 revenue, ₹4,60,000 food, ₹7,27,000 operating expenses and ₹45,000 taxes leaves ₹1,68,000 net profit: a 12% margin.",
      mistakes: ["Forgetting annual costs like licences and repairs. Spread them monthly.", "Mixing personal and business expenses."],
      improve: ["Set a target % of revenue for every cost line.", "Review the P&L monthly with your accountant."],
    },
    faqs: [
      { q: "What is a good net profit margin for a restaurant?", a: "Many well-run restaurants earn 5–10% net. Some formats, such as focused cloud kitchens or bars, can do better." },
      { q: "Should delivery commissions be an expense?", a: "Yes. Enter commissions and delivery fees in “Delivery & platform fees” so the P&L shows their full impact." },
    ],
    related: ["break-even-calculator", "prime-cost-calculator", "restaurant-roi-calculator"],
    isNew: true,
  },
  {
    slug: "restaurant-roi-calculator",
    title: "Restaurant ROI Calculator",
    shortTitle: "Restaurant ROI",
    seoTitle: "Restaurant ROI Calculator: Payback Period & Return on Investment",
    seoDescription: "Estimate monthly and annual ROI, payback period and annualised return on a new restaurant or outlet, with conservative, expected and optimistic scenarios. Free.",
    summary: "Estimate how quickly a new outlet pays back its investment and what return it earns, under three scenarios.",
    cardDescription: "Monthly and annual ROI, payback period and scenario analysis for a new outlet.",
    howTo: [
      "Enter everything you spent to open: fit-out, equipment, deposits, licences, launch costs.",
      "Enter expected monthly revenue and profit (profit can be negative in early months).",
      "Set a realistic monthly growth rate and how many months to project.",
      "Compare the Conservative, Expected and Optimistic cards before you decide.",
    ],
    icon: "roi",
    metrics: ["Payback", "Annual ROI", "Annualised return"],
    keywords: ["restaurant roi calculator", "restaurant payback period", "new restaurant investment return"],
    formula: [
      { label: "Monthly ROI", expression: "Monthly profit ÷ Initial investment × 100" },
      { label: "Annual ROI", expression: "First 12 months' profit (with growth) ÷ Initial investment × 100" },
      { label: "Payback period", expression: "Months until cumulative profit ≥ Initial investment" },
      { label: "Annualised return", expression: "((Investment + Total profit) ÷ Investment)^(12 ÷ Months) − 1" },
    ],
    education: {
      what: "A way to judge whether an outlet is worth the money you put in, and how long it takes to get it back.",
      how: "Monthly profit grows at the rate you set. The calculator adds it up month by month until it covers the investment, and projects the return over your chosen period.",
      why: "Two outlets can make the same monthly profit with very different investments. ROI and payback let you compare them fairly and plan loan repayments.",
      example: "₹35 lakh invested, ₹1.5 lakh monthly profit growing 1.5% a month pays back in a little under two years.",
      mistakes: ["Leaving out deposits, pre-opening salaries and marketing from the investment.", "Assuming month-one profit at full run-rate."],
      improve: ["Plan a ramp-up period in your numbers.", "Negotiate rent-free fit-out months to lower the investment."],
    },
    faqs: [
      { q: "What is a good payback period for a restaurant?", a: "Many investors look for 18–36 months for a new outlet, depending on format and risk." },
      { q: "Is ROI the same as profit margin?", a: "No. Margin compares profit with revenue; ROI compares profit with the money invested." },
    ],
    related: ["break-even-calculator", "profit-margin-calculator", "prime-cost-calculator"],
    isNew: true,
  },
  {
    slug: "menu-engineering-calculator",
    title: "Menu Engineering Calculator",
    shortTitle: "Menu Engineering",
    seoTitle: "Menu Engineering Calculator: Stars, Puzzles, Plowhorses & Dogs Matrix",
    seoDescription: "Classify menu items by popularity and contribution margin. See a visual matrix, profit per item and actions. CSV import and export. Free, no login.",
    summary: "Sort every dish by how well it sells and how much it earns, then decide what to promote, reprice or remove.",
    cardDescription: "Popularity × contribution matrix with CSV import/export and actions per dish.",
    howTo: [
      "Type each dish's selling price, food cost and units sold last month, or import a CSV.",
      "Watch each dish get a category: Star, Puzzle, Plowhorse or Dog.",
      "Use the matrix to spot dishes to promote (Puzzles) and to reprice (Plowhorses).",
      "Export a CSV to keep a copy or to update the numbers in Excel.",
    ],
    icon: "menuEngineering",
    metrics: ["Contribution margin", "Menu mix", "Quadrant"],
    keywords: ["menu engineering calculator", "menu matrix", "stars plowhorses puzzles dogs", "restaurant menu analysis"],
    formula: [
      { label: "Contribution margin", expression: "Selling price − Food cost" },
      { label: "Popularity (menu mix)", expression: "Units sold ÷ Total units sold × 100" },
      { label: "High popularity", expression: "Menu mix ≥ 70% × (100% ÷ Number of items)" },
      { label: "High contribution", expression: "Contribution ≥ Weighted average contribution" },
    ],
    education: {
      what: "A method (Kasavana–Smith) that puts each dish into one of four boxes based on popularity and profit per plate.",
      how: "A dish is popular if it sells at least 70% of an equal share. It is profitable if its rupee contribution is at or above the menu's weighted average.",
      why: "It shows which dishes deserve the best spots on your menu and which ones only make the kitchen busier.",
      example: "A biryani with ₹234 contribution selling 640 plates is a Star. A tandoori platter earning ₹399 but selling 85 is a Puzzle to promote.",
      mistakes: ["Judging dishes by food cost % instead of rupee contribution.", "Analysing too short a period; use at least a month."],
      improve: ["Put Stars and Puzzles in the top-right of the menu.", "Reprice Plowhorses in small steps.", "Retire Dogs that complicate prep."],
    },
    faqs: [
      { q: "What CSV format does the import accept?", a: "Four columns with headers: Item Name, Selling Price, Food Cost, Units Sold. Export a file first to get the template." },
      { q: "How many items can I analyse?", a: "Up to 500 items. For best results, analyse one menu section, such as mains, at a time." },
    ],
    related: ["menu-pricing-calculator", "food-cost-calculator", "restaurant-health-calculator"],
    isNew: true,
  },
];

export function getCalculator(slug: CalculatorSlug): CalculatorMeta {
  const c = CALCULATORS.find((x) => x.slug === slug);
  if (!c) throw new Error(`Unknown calculator: ${slug}`);
  return c;
}

export const calculatorPath = (slug: CalculatorSlug) => `/restaurant/${slug}`;
