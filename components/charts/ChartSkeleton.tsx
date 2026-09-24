export function ChartSkeleton({ height = 280 }: { height?: number }) {
  return <div className="w-full animate-pulse rounded-xl bg-wash" style={{ height }} aria-hidden />;
}
