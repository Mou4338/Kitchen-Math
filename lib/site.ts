export const SITE = {
  name: "KitchenMath",
  tagline: "Know your restaurant numbers.",
  description:
    "Free calculators that help restaurant owners understand costs, margins, break-even sales and online-order profitability.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  locale: "en_IN",
  contactEmail: "hello@example.com",
  /**
   * Optional photos. Put image files in /public/images and set the paths, e.g. "/images/owner.jpg".
   * Leave empty to use the built-in illustrations.
   */
  images: {
    welcome: "" as string,
  },
};
