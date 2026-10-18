import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { ToastProvider } from "@/components/ui/Toast";
import { SITE } from "@/lib/site";
import { MotionProvider } from "@/components/ui/Motion";

const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name}: Restaurant Profitability Calculators`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: { siteName: SITE.name, locale: SITE.locale, type: "website", images: [{ url: "/brand/kitchenmath-og.jpg", width: 1200, height: 630, alt: "KitchenMath: Restaurant growth on Zomato & Swiggy" }] },
  twitter: { card: "summary_large_image", images: ["/brand/kitchenmath-og.jpg"] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#08080A",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`dark ${GeistSans.variable} ${GeistMono.variable} ${serif.variable}`}>
      <body className="min-h-screen font-sans">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-inverse focus:px-4 focus:py-2 focus:text-on-inverse">
          Skip to content
        </a>
        <MotionProvider>
          <ToastProvider>
            <Header />
            <main id="main">{children}</main>
            <Footer />
            <FloatingActions />
          </ToastProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
