# KitchenMath: Restaurant Profitability Toolkit

Free, private, mobile-first calculators that help Indian restaurant owners price dishes for delivery apps, check online-order payouts and profit, and find their most profitable dishes. No login is needed and every calculation runs in the browser. Enquiry and scorecard forms are saved to a Google Sheet.

---

## 1. What this project is

A Next.js website with **3 calculators** (Menu Pricing, Online Payout & Profit, Menu Engineering), saved scenarios, sharing, and PDF/CSV export. All maths lives in pure, unit-tested TypeScript functions under `lib/calculations/`. The UI never does its own maths.

| Route | What it does |
|---|---|
| `/` | Company home: consulting services, process, free-tools showcase, contact |
| `/services` | The 6 services, growth equation, glossary |
| `/growth-scorecard` | Free 12-question self-audit (2 per service), scores per area, top 3 priorities, "send my results" form → Google Sheet |
| `/restaurant` | Tools home and calculator collection |
| `/restaurant/menu-pricing-calculator` | Break-even price and menu price (rounded up to end in 9) from cost, commission, tax, discount, ads and margin |
| `/restaurant/online-sale-payout-calculator` | Discount → commissionable value → commission + 18% GST → customer GST → ads → payout → profit, profit % and payout % |
| `/restaurant/menu-engineering-calculator` | Payout and profit per unit, total profit and Star / Plow Horse / Puzzle / Dog for every dish (vs menu averages); CSV import/export |
| `/restaurant/calculator-history` | Saved scenarios: view, rename, duplicate, delete, export |
| `/restaurant/help` | How-to guide, buttons explained, glossary, FAQs |
| `/restaurant/guides`, `/restaurant/about`, `/privacy`, `/terms` | Content pages |
| `/api/lead` | Receives the enquiry and scorecard forms and appends them to Google Sheets |

`/` is the company home page (Restaurant Growth Consulting): hero, approach, about, the 6 services, how we work, scorecard link, free-tools showcase and a contact/enquiry form that saves to Google Sheets. `/services` details every service.

**Company home extras:** Growth Scorecard link, FAQ, and floating "Book a free audit" / WhatsApp and back-to-top buttons on every page.

**Company details:** edit `SITE.company` in `lib/site.ts` (email, phone, WhatsApp, location). Service text lives in `lib/content/company.ts`.

## 2. Features

- **Three calculators** with the exact formulas listed on each page (Formula section) and in `lib/calculations/`.
- **Forms → Google Sheets**: the enquiry form and the scorecard results go to your sheet through `/api/lead` and a Google Apps Script. Setup: `google-apps-script/SETUP.md`.
- **Live results** that update as you type. Indian number formatting (₹1,50,000 · ₹4.25L · ₹1.2Cr). NaN and Infinity are never shown.
- **Results explained**: every deduction in rupees, with insights on what to change.
- **Scenario Mode** on every calculator, with a current-vs-scenario table and green/red indicators.
- **Save on this device** (localStorage): multiple named scenarios, plus rename, duplicate and delete.
- **Share links**: calculator state is encoded in the URL, with no backend.
- **Download PDF** (inputs, results, chart, assumptions, benchmarks, disclaimer), **CSV export**, **Print**, **Copy results**.
- **Charts**: payout waterfall, menu-engineering matrix, circular score (scorecard).
- **Mobile-first**: single column, sticky bottom result bar, large touch targets, easy sliders, hamburger menu.
- **Accessibility**: semantic HTML, labelled inputs, error messages linked to fields, keyboard-friendly tabs and sliders, visible focus, skip link, reduced-motion support.
- **SEO**: unique titles and descriptions, canonical URLs, Open Graph and Twitter tags, sitemap, robots, plus JSON-LD for WebApplication, FAQPage, BreadcrumbList and WebSite.

## Calculator logic

All three calculators share one payout function, `calculateOnlinePayout` in `lib/calculations/onlinePayoutCalculator.ts`:

```
Discount          = Selling price × Discount %
CV                = Selling price − Discount + Packaging charge
Commission        = CV × Commission %
GST on commission = Commission × 18%            (fixed, not an input)
Customer GST      = CV × GST on food %          (usually 5%)
Net sales         = CV + Customer GST
Ads               = Net sales × Ads %
Payout            = Net sales − Commission − GST on commission − Ads
Profit            = Payout − (Dish cost + Labour + Packaging cost)
```

- **Menu Pricing** solves it backwards: `factor = (1 − d) × ((1 + g) × (1 − a) − 1.18 × c) − m`, `price = Total cost ÷ factor` (break-even with m = 0), rounded **up** to end in 9.
- **Menu Engineering** runs every dish through the payout function, then compares profit per unit and units sold with their simple averages: Star, Plow Horse, Puzzle or Dog.

## Look & feel

- **Two themes:** white & blue (light) and black & gold (dark). Visitors switch with the sun/moon button in the header. The choice is remembered, and the first visit follows the device setting. All colours live as CSS variables in `app/globals.css` (`:root` for light, `.dark` for dark). Change them there and the whole site updates.
- **Typography:** Geist for text and numbers, with an *Instrument Serif* italic accent in headlines (`className="accent-serif"`).
- **Illustrations:** custom, theme-aware SVG illustrations in `components/illustrations/Illustrations.tsx`, with no stock photos to license.
- **Photos:** the home page uses free Unsplash photos (Unsplash License: free for commercial use, no credit required), listed in `lib/content/images.ts`: 3 hero slides, the welcome photo and 6 gallery photos. To use your own, put files in `public/images/` and change each `src` to e.g. `"/images/kitchen.jpg"`. Remote photos need an internet connection. For a fully offline site, download them into `public/images/` and update the paths.
- **Home page layout:** a photo hero slider (arrows, dots, swipe, autoplay that pauses on hover), a quick-facts strip, "Welcome to KitchenMath" with a blob-shaped duotone photo, an "Our Calculators" card grid, How it works, a "Built for Real Restaurants" photo gallery and a call-to-action band.
- **Guidance for users:** every calculator has a "How to use this calculator" panel (edit the steps in `lib/content/calculators.ts` → `howTo`), ⓘ tooltips on each field, and a full Help page at `/restaurant/help`.
- **Motion:** gentle reveal-on-scroll, numbers that glide to new values, and hover lift on cards. All of it is switched off automatically for visitors who prefer reduced motion.

> The serif font is loaded with `next/font/google`, so `npm run build` needs an internet connection the first time. Vercel always has one.

## 3. Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS · hand-built shadcn-style UI components · Lucide icons · Recharts · React Hook Form + Zod · Framer Motion (header menus only) · jsPDF + jspdf-autotable (loaded only when you click PDF) · Vitest.

No database, no auth, no API routes, no extra services. Nothing is needed for v1.

## 4. Installation

Requirements: **Node.js 20.9 or newer** (Node 22 LTS recommended) and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## 5. Windows setup (step by step)

1. Install **Node.js LTS** from https://nodejs.org (tick “Add to PATH”). Restart your computer if `node -v` isn't recognised.
2. Install **VS Code** from https://code.visualstudio.com.
3. Unzip this project to a simple path, e.g. `C:\projects\kitchenmath`. Avoid OneDrive-synced folders.
4. Open **VS Code** and go to **File → Open Folder…**, then pick the `kitchenmath` folder.
5. Open the terminal: **Terminal → New Terminal** (or press <kbd>Ctrl</kbd>+<kbd>`</kbd>).
6. Run:
   ```powershell
   npm install
   ```
7. Then run:
   ```powershell
   npm run dev
   ```
8. Open **http://localhost:3000** in your browser.

If PowerShell says *“running scripts is disabled on this system”*, run this once and try again:
```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```
Or switch the VS Code terminal to **Command Prompt** using the ˅ next to the + in the terminal panel.

## 6. VS Code setup

When you open the folder, VS Code suggests the recommended extensions (`.vscode/extensions.json`): ESLint, Tailwind CSS IntelliSense, Prettier and Vitest. Click **Install All**. The workspace uses the project's own TypeScript version.

## 7. Environment variables

The calculators need nothing to run locally. To save form submissions to Google Sheets, follow **`google-apps-script/SETUP.md`** (about 5 minutes) and add the two `GOOGLE_SHEETS_*` variables below. For production, also set your public URL so canonical links, the sitemap and share links are correct:

```bash
# macOS / Linux
cp .env.example .env.local
# Windows (Command Prompt or PowerShell)
copy .env.example .env.local
```

| Variable | Example | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://kitchenmath.in` | Canonical URLs, sitemap, Open Graph |
| `GOOGLE_SHEETS_WEBHOOK_URL` | `https://script.google.com/macros/s/…/exec` | Where form submissions are sent (your Apps Script web app) |
| `GOOGLE_SHEETS_SECRET` | `km-7f3a9c21e84b4d0f` | Must match `SECRET` in the Apps Script. Keeps others from writing to your sheet |

Without the Google Sheets variables the forms show "The form isn't connected yet. Please email or WhatsApp us instead."

## 8. Development

```bash
npm run dev        # start dev server at http://localhost:3000
npm run lint       # ESLint (runs `eslint .`; Next 16 removed `next lint`)
npm run typecheck  # TypeScript, no emit
```

Useful places to edit:

| To change… | Edit |
|---|---|
| Brand name, tagline, contact email | `lib/site.ts` |
| Colours, radius, shadows | `tailwind.config.ts` |
| Calculator titles, SEO text, formulas, FAQs, guides | `lib/content/calculators.ts` |
| Example numbers each calculator opens with | `lib/content/defaults.ts` |
| Reference benchmarks | `lib/calculations/benchmarks.ts` |
| Any formula | `lib/calculations/*.ts` (then run `npm test`) |

> Don't run `npm audit fix --force`. It can swap major versions of Next.js and break the project. Use `npm update` instead.

## 9. Production build

```bash
npm run build
npm run start      # serves the production build at http://localhost:3000
```

## 10. Testing

```bash
npm test           # run all tests once
npm run test:watch # re-run on save
```

Tests live in `tests/` and cover every formula: the shared payout calculation (discount, commissionable value, commission, 18% GST on commission, customer GST, net sales, ads on net sales, payout, profit, profit %, payout %) with the ₹309 worked example and a packaging charge, the menu price solved backwards (break-even, margin-safe price, rounding up to end in 9, the no-price case), menu engineering (profit per unit, total profit, simple averages, Star / Plow Horse / Puzzle / Dog), menu CSV import/export, scenario comparison, formatters and share-link encoding.

## 11. Deployment to Vercel

1. Push the project to a GitHub repository.
2. Go to https://vercel.com, click **Add New → Project** and import the repository. Vercel detects Next.js automatically.
3. Under **Environment Variables**, add `NEXT_PUBLIC_SITE_URL` = your final domain (e.g. `https://kitchenmath.in`), plus `GOOGLE_SHEETS_WEBHOOK_URL` and `GOOGLE_SHEETS_SECRET` (see `google-apps-script/SETUP.md`).
4. Click **Deploy**. Every push to `main` redeploys automatically.
5. Optional: add a custom domain under **Project → Settings → Domains**.

---

## Project structure

```
app/                       Routes (App Router)
  restaurant/              Landing + 3 calculators + history, guides, about
  api/lead/                Form submissions → Google Sheets
  privacy/ terms/          Legal pages
  layout.tsx globals.css   Shell, fonts, design tokens
  sitemap.ts robots.ts     SEO
components/
  calculators/             One folder per calculator + shared/ (layout, actions, scenario, insights)
  charts/                  Recharts charts (lazy-loaded) and lightweight SVG/HTML charts
  dashboard/               Example preview used on the home page
  forms/                   Currency/percent/number inputs, sliders, RHF field wrappers
  layout/                  Header, footer, breadcrumbs
  content/                 Formula, education, FAQ, related calculators, cards
  history/                 Saved-scenario list
  ui/                      Buttons, cards, tabs, tooltips, toasts, icons
lib/
  calculations/            Pure, tested maths (one file per calculator)
  formatters/              Indian currency/percent formatting and parsing
  validators/              Zod schemas
  storage/                 localStorage (drafts, scenarios, benchmarks)
  pdf/ export/             PDF report, CSV import/export
  hooks/                   useCalculatorForm (RHF + Zod + drafts + share links)
  content/                 Calculator registry and example defaults
types/                     Shared types
tests/                     Vitest unit tests
google-apps-script/        Code.gs + SETUP.md for the Google Sheet
```

## Disclaimer

Results are estimates for planning, based on the numbers entered. Benchmarks are indicative. Nothing in this app is financial, tax or legal advice.
