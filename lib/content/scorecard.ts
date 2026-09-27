/** Growth scorecard questions: two per service area. */
export type AnswerValue = 0 | 1 | 2; // No · Partly · Yes

export interface ScorecardArea {
  serviceId: string;
  title: string;
  questions: string[];
}

export const SCORECARD: ScorecardArea[] = [
  { serviceId: "menu-optimization", title: "Menu", questions: ["Do all your dishes have good photos, clear descriptions and serving sizes?", "Have you removed dead items and added dishes customers are searching for?"] },
  { serviceId: "pricing-order-value", title: "Pricing & order value", questions: ["Do your online prices cover commission, discounts and ads?", "Do you use add-ons, combos or a minimum order value to raise average order value?"] },
  { serviceId: "ads-discounts", title: "Ads & discounts", questions: ["Do you check ad spend and discounts against a target every month?", "Do you know which ad types bring profitable orders?"] },
  { serviceId: "conversion-funnel", title: "Conversion", questions: ["Do you track listing view → menu → cart → order?", "Do you compare lunch, dinner and late-night performance?"] },
  { serviceId: "ratings-dish-performance", title: "Ratings & dishes", questions: ["Do you look at sales and ratings together for each dish?", "Do you track recurring complaints, cancellations and stock-outs?"] },
  { serviceId: "local-market-competitors", title: "Local market & competitors", questions: ["Do you know which popular dishes in your zone are missing from your menu?", "Do you know your competitors' bestsellers, prices and offers?"] },
];

export const ANSWER_LABELS: { value: AnswerValue; label: string }[] = [
  { value: 2, label: "Yes" },
  { value: 1, label: "Partly" },
  { value: 0, label: "No" },
];
