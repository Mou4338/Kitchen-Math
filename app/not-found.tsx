import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="eyebrow text-accent-dark">404</p>
      <h1 className="mt-2 text-3xl font-semibold">This page isn&apos;t on the menu</h1>
      <p className="mt-2 text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <Link href="/restaurant" className={buttonClass("accent", "md", "mt-6")}>Back to all tools</Link>
    </div>
  );
}
