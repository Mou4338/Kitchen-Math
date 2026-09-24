/**
 * Photos used on the home page.
 * All are free Unsplash photos (Unsplash License: free for commercial use, no attribution required).
 * To use your own photos: put files in /public/images and change `src` to e.g. "/images/my-kitchen.jpg".
 */
export interface Photo {
  src: string;
  alt: string;
  /** Page on Unsplash, kept for your records. */
  source?: string;
}

const u = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=1800`;

export const HERO_SLIDES: (Photo & { eyebrow: string; title: [string, string]; text: string; cta: { label: string; href: string } })[] = [
  {
    src: u("1556742393-d75f468bfcb0"),
    alt: "Café owner checking the day's numbers on a tablet at the counter",
    eyebrow: "Restaurant health check",
    title: ["Know Your Restaurant", "Numbers."],
    text: "Food cost, labor, marketing and prime cost in one place, with a clear health score and the next step to take. Free, private, and ready in under a minute.",
    cta: { label: "Check my restaurant", href: "/restaurant/restaurant-health-calculator" },
  },
  {
    src: u("1552566626-52f8b828add9"),
    alt: "Modern restaurant interior with booths and pendant lights",
    eyebrow: "Break-even & profit",
    title: ["Find the Sales You Need", "Every Day."],
    text: "See your monthly, daily and per-order break-even, your margin of safety, and how a rent hike or a slow month would change it.",
    cta: { label: "Find my break-even", href: "/restaurant/break-even-calculator" },
  },
  {
    src: u("1517248135467-4c7edcad34c4"),
    alt: "Busy dining room in the evening",
    eyebrow: "Online orders",
    title: ["See What Delivery Apps", "Really Leave You."],
    text: "Commission, 18% GST on commission, gateway fees, discounts, ads and food cost, deducted step by step down to your true profit per order.",
    cta: { label: "Check my payout", href: "/restaurant/online-sale-payout-calculator" },
  },
];

export const WELCOME_PHOTO: Photo = {
  src: u("1753351052617-62818ffc9173"),
  alt: "Two café owners standing proudly in their shop",
};

export const GALLERY: (Photo & { caption: string })[] = [
  { src: u("1622021142947-da7dedc7c39a"), alt: "Chef chopping vegetables in a professional kitchen", caption: "Kitchens that count every gram" },
  { src: u("1625398407796-82650a8c135f"), alt: "Traditional South Indian meal on a banana leaf", caption: "Menus priced from real plate cost" },
  { src: u("1554224155-6726b3ff858f"), alt: "Person checking bills with a pen and calculator", caption: "Monthly numbers, simplified" },
  { src: u("1555396273-367ea4eb4db5"), alt: "Warm rustic café interior with wooden tables", caption: "Cafés and bakeries" },
  { src: u("1565557623262-b51c2513a641"), alt: "Roti with curry served on a plate", caption: "Dine-in and delivery" },
  { src: u("1460925895917-afdab827c52f"), alt: "Laptop showing business charts", caption: "Clear reports to share" },
  { src: u("1414235077428-338989a2e8c0"), alt: "Beautifully plated restaurant dish", caption: "Every plate, costed right" },
];

/** Photo banners for every inner page (same style as the home hero). */
export interface PageHeroImage extends Photo {
  /** Headline split: first part in light blue (gold in dark mode), second part in white. */
  title: [string, string];
}

export const PAGE_HEROES: Record<string, PageHeroImage> = {
  "restaurant-health-calculator": { src: u("1622021142947-da7dedc7c39a"), alt: "Chef preparing food in a professional kitchen", title: ["Restaurant Health", "Calculator"] },
  "break-even-calculator": { src: u("1552566626-52f8b828add9"), alt: "Modern restaurant interior", title: ["Break-Even", "Calculator"] },
  "online-sale-payout-calculator": { src: u("1556740714-a8395b3bf30f"), alt: "Person checking online orders on a phone and tablet", title: ["Online Sale Payout", "& Profit Calculator"] },
  "menu-pricing-calculator": { src: u("1414235077428-338989a2e8c0"), alt: "Plated restaurant dish", title: ["Menu Pricing", "Calculator"] },
  "food-cost-calculator": { src: u("1532635211-8ec15f2ce05c"), alt: "Cook preparing food in a kitchen", title: ["Food Cost", "Calculator"] },
  "prime-cost-calculator": { src: u("1556745750-68295fefafc5"), alt: "Restaurant owner standing at the counter", title: ["Prime Cost", "Calculator"] },
  "profit-margin-calculator": { src: u("1460925895917-afdab827c52f"), alt: "Laptop showing business charts", title: ["Profit Margin", "Calculator"] },
  "restaurant-roi-calculator": { src: u("1753351052617-62818ffc9173"), alt: "Two café owners in their shop", title: ["Restaurant ROI", "Calculator"] },
  "menu-engineering-calculator": { src: u("1668236543090-82eba5ee5976"), alt: "Crispy dosa with chutneys and sambar", title: ["Menu Engineering", "Calculator"] },
  guides: { src: u("1454165804606-c3d57bc86b40"), alt: "Person working through numbers on a laptop", title: ["Restaurant Finance", "Guides"] },
  help: { src: u("1556742393-d75f468bfcb0"), alt: "Café owner using a tablet at the counter", title: ["Help &", "How-To"] },
  history: { src: u("1554224155-6726b3ff858f"), alt: "Bills with a pen and calculator", title: ["Saved", "Scenarios"] },
  about: { src: u("1555396273-367ea4eb4db5"), alt: "Warm café interior", title: ["About", "KitchenMath"] },
  privacy: { src: u("1626266061368-46a8f578ddd6"), alt: "Calculator and coffee on a desk", title: ["Privacy", "Policy"] },
  terms: { src: u("1707157284454-553ef0a4ed0d"), alt: "Office desk with financial charts", title: ["Terms of", "Use"] },
};

/** Banner photo for every inner page (calculators use their slug as the key). */
export const PAGE_IMAGES: Record<string, Photo> = {
  "restaurant-health-calculator": { src: u("1626266061368-46a8f578ddd6"), alt: "Owner working through the month's numbers with a calculator and coffee" },
  "break-even-calculator": { src: u("1580644043501-627f569f7e25"), alt: "Restaurant owner standing at the counter" },
  "online-sale-payout-calculator": { src: u("1556740714-a8395b3bf30f"), alt: "Online order being checked on a phone beside a tablet" },
  "menu-pricing-calculator": { src: u("1668236543090-82eba5ee5976"), alt: "Crispy dosa served with sambar and chutneys" },
  "food-cost-calculator": { src: u("1716816211590-c15a328a5ff0"), alt: "Table laid out with Indian spices" },
  "prime-cost-calculator": { src: u("1532635211-8ec15f2ce05c"), alt: "Chef cooking in a restaurant kitchen" },
  "profit-margin-calculator": { src: u("1707157284454-553ef0a4ed0d"), alt: "Desk with smartphone and financial charts" },
  "restaurant-roi-calculator": { src: u("1555953348-ab36203d4cad"), alt: "Barista pouring milk in a busy coffee shop" },
  "menu-engineering-calculator": { src: u("1466978913421-dad2ebd01d17"), alt: "Guests sharing dishes at a restaurant table" },
  guides: { src: u("1454165804606-c3d57bc86b40"), alt: "Hand with a pencil beside a laptop" },
  help: { src: u("1556740758-90de374c12ad"), alt: "Two people talking beside restaurant tables" },
  history: { src: u("1709880945165-d2208c6ad2ec"), alt: "Calculator on a table next to a laptop" },
  about: { src: u("1596797038530-2c107229654b"), alt: "Food cooking in a black pot" },
  privacy: { src: u("1554224155-6726b3ff858f"), alt: "Bills and a calculator on a desk" },
  terms: { src: u("1460925895917-afdab827c52f"), alt: "Laptop showing business charts" },
};
