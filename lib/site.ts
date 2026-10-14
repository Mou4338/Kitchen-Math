export const SITE = {
  name: "KitchenMath",
  tagline: "Know your restaurant numbers.",
  description:
    "Free calculators that help restaurant owners price dishes for profit, check online-order payouts and find their most profitable dishes.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  locale: "en_IN",
  contactEmail: "info@kitchenmath.in",
  /**
   * Company details shown on the home page and contact section.
   * Fill these in: empty values are simply hidden.
   */
  company: {
    division: "Restaurant Growth Consulting",
    email: "info@kitchenmath.in",
    /** e.g. "+91 98765 43210" */
    phone: "" as string,
    /** WhatsApp number with country code, digits only, e.g. "919876543210" */
    whatsapp: "" as string,
    /** e.g. "Bengaluru, India" */
    location: "Mumbai, India" as string,
    /** Full office address, shown in the contact section and used for directions. */
    address: "B Wing, 601 to 605, Raylon Arcade, Kondivita, J.B. Nagar, Andheri East, Mumbai, Maharashtra 400059",
    /** Short label for the map pin. */
    building: "Raylon Arcade",
    area: "J.B. Nagar, Andheri East",
    hours: "Mon – Sat, 10:00 – 19:00 IST. We reply to inquiries within one business day.",
  },
  /**
   * Optional photos. Put image files in /public/images and set the paths, e.g. "/images/owner.jpg".
   * Leave empty to use the built-in illustrations.
   */
  images: {
    welcome: "" as string,
  },
};
