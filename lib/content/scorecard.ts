/** Growth scorecard questions: two per service area of the consulting framework. */
export type AnswerValue = 0 | 1 | 2; // No · Partly · Yes

export interface ScorecardArea {
  serviceId: string;
  title: string;
  questions: string[];
}

export const SCORECARD: ScorecardArea[] = [
  { serviceId: "menu-optimization", title: "Menu", questions: ["Do all your dishes have good photos, clear descriptions and serving sizes?", "Have you removed items with zero sales in the last 90 days?"] },
  { serviceId: "pricing-aov", title: "Pricing & AOV", questions: ["Are your prices checked against competitors in your area?", "Do you use combos and add-ons to raise the average order value?"] },
  { serviceId: "ads-discounting", title: "Ads & discounts", questions: ["Do you know the return you get from each ad product you pay for?", "Is your discounting planned (not always-on for everyone)?"] },
  { serviceId: "funnel-optimization", title: "Funnel", questions: ["Do you track menu-to-order conversion (M2O)?", "Do you know which stage (I2M, M2C or C2O) loses the most customers?"] },
  { serviceId: "hyperlocal-intelligence", title: "Local demand", questions: ["Do you know which dishes sell well in your zone that you don't offer?", "Do you know how demand changes by mealtime in your area?"] },
  { serviceId: "reviews-product-performance", title: "Reviews & dishes", questions: ["Do you look at ratings and sales together for each dish?", "Do you track recurring customer complaints?"] },
  { serviceId: "competitor-intelligence", title: "Competitors", questions: ["Do you know where your customers order when they don't order from you?", "Do you know your main competitors' bestsellers and prices?"] },
  { serviceId: "operations-availability", title: "Operations", questions: ["Are your store and key items reliably available during peak hours?", "Do you track cancellations and stock-outs every week?"] },
  { serviceId: "measurement-execution", title: "Measurement", questions: ["Do you rank growth ideas by their potential impact before acting?", "Do you measure the result of each change on orders, AOV and revenue?"] },
];

export const ANSWER_LABELS: { value: AnswerValue; label: string }[] = [
  { value: 2, label: "Yes" },
  { value: 1, label: "Partly" },
  { value: 0, label: "No" },
];
