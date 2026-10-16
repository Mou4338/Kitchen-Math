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
  /** "contain": show the whole picture on the right of a banner instead of filling (and cropping) it. */
  /** CSS object-position for the banner crop, e.g. "right" for wide banners with the subject on the right. */
  position?: string;
  fit?: "cover" | "contain";
  /** Width ÷ height of the picture, needed with fit "contain". */
  aspect?: number;
}

const u = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=1800`;

export const HERO_SLIDES: (Photo & { eyebrow: string; title: [string, string]; text: string; cta: { label: string; href: string }; /** Darken the photo's right edge (for photos with a bright edge). */ fadeRight?: boolean })[] = [
  {
    src: u("1551288049-bebda4e38f71"),
    alt: "Performance analytics and sales graphs on a laptop screen",
    fadeRight: true,
    eyebrow: "Menu pricing",
    title: ["Price Every Dish", "for Profit."],
    text: "Enter dish cost, labour and packaging with your discount, commission and ads. Get the exact break-even price and the price that keeps your margin.",
    cta: { label: "Price my dish", href: "/restaurant/menu-pricing-calculator" },
  },
  {
    src: u("1517248135467-4c7edcad34c4"),
    alt: "Busy dining room in the evening",
    eyebrow: "Online payout & profit",
    title: ["See What Delivery Apps", "Really Leave You."],
    text: "Discount, commission, ads and GST on both, deducted line by line down to your payout and profit per order.",
    cta: { label: "Check my payout", href: "/restaurant/online-sale-payout-calculator" },
  },
  {
    src: u("1552566626-52f8b828add9"),
    alt: "Modern restaurant interior with booths and pendant lights",
    eyebrow: "Menu engineering",
    title: ["Know Which Dishes", "Earn the Most."],
    text: "Payout and profit per unit and total profit for every dish, sorted into Stars, Plow Horses, Puzzles and Dogs.",
    cta: { label: "Analyse my menu", href: "/restaurant/menu-engineering-calculator" },
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
  /** Headline split: first part in red, second part in white. */
  title: [string, string];
}

export const PAGE_HEROES: Record<string, PageHeroImage> = {
  "online-sale-payout-calculator": { src: u("1556740714-a8395b3bf30f"), alt: "Person checking online orders on a phone and tablet", title: ["Online Sale Payout", "& Profit Calculator"] },
  "menu-pricing-calculator": { src: u("1414235077428-338989a2e8c0"), alt: "Plated restaurant dish", title: ["Menu Pricing", "Calculator"] },
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
  "online-sale-payout-calculator": { src: "/images/heroes/online-payout-banner.webp", position: "right", alt: "Restaurant partner app on a tablet and phone showing live delivery orders, bills and rider status" },
  "menu-pricing-calculator": { src: "/images/heroes/menu-pricing-banner.webp", position: "right", alt: "Guest holding an open restaurant menu with starters, mains, desserts and dish photos" },
  "menu-engineering-calculator": { src: u("1547573854-74d2a71d0826"), alt: "Table spread with many plates of beautifully presented dishes" },
  guides: { src: u("1454165804606-c3d57bc86b40"), alt: "Hand with a pencil beside a laptop" },
  help: { src: u("1759752393975-7ca7b302fcc6"), alt: "Hands typing on a laptop with a spreadsheet of figures on screen" },
  history: { src: u("1626266061368-46a8f578ddd6"), alt: "Hands working through numbers on a calculator at a desk" },
  about: { src: u("1653259038915-7cf0b7a4dd6c"), alt: "Elegant, softly lit restaurant dining room with a view over the city" },
  privacy: { src: u("1554224155-6726b3ff858f"), alt: "Bills and a calculator on a desk" },
  terms: { src: u("1460925895917-afdab827c52f"), alt: "Laptop showing business charts" },
  contact: { src: u("1517245386807-bb43f82c33c4"), alt: "Consultant walking a client through numbers on a laptop" },
};
