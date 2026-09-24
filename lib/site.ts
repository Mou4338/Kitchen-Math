export const SITE = {
  name: "KitchenMath",
  tagline: "Know your restaurant numbers.",
  description:
    "Free calculators that help restaurant owners understand costs, margins, break-even sales and online-order profitability.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  locale: "en_IN",
  contactEmail: "hello@example.com",
  /**
   * Company details shown on the home page and contact section.
   * Fill these in: empty values are simply hidden.
   */
  company: {
    division: "Restaurant Growth Consulting",
    email: "hello@example.com",
    /** e.g. "+91 98765 43210" */
    phone: "" as string,
    /** WhatsApp number with country code, digits only, e.g. "919876543210" */
    whatsapp: "" as string,
    /** e.g. "Bengaluru, India" */
    location: "India" as string,
  },
  /**
   * Optional photos. Put image files in /public/images and set the paths, e.g. "/images/owner.jpg".
   * Leave empty to use the built-in illustrations.
   */
  images: {
    welcome: "" as string,
  },
};
