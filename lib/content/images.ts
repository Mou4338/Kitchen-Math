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
