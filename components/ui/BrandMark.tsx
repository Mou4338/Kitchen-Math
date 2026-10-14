import type { SVGProps } from "react";

/**
 * KitchenMath brand mark: a bowl carrying the ₹ sign with three rising bars (bowl colour, saffron, red).
 * Redrawn as a vector from the brand artwork (public/brand/kitchenmath-logo.png).
 * `bowl` and `rupee` colours default to the theme ink/paper so it works on light and dark.
 */
export function BrandMark({ bowl = "rgb(var(--ink))", rupee = "rgb(var(--paper))", ...props }: SVGProps<SVGSVGElement> & { bowl?: string; rupee?: string }) {
  return (
    <svg viewBox="356 300 368 360" aria-hidden focusable="false" {...props}>
      <rect x="458" y="398" width="39" height="70" rx="12" fill={bowl} />
      <rect x="521" y="360" width="38" height="108" rx="12" fill="#F2A93B" />
      <rect x="583" y="312" width="38" height="156" rx="12" fill="#E23744" />
      <rect x="367" y="480" width="346" height="18" rx="9" fill={bowl} />
      <path d="M387 489 H693 A153 158 0 0 1 387 489 Z" fill={bowl} />
      <text x="540" y="603" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="78" fontWeight="700" fill={rupee}>₹</text>
    </svg>
  );
}
