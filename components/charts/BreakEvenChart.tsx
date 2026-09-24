"use client";

import { CartesianGrid, Legend, Line, LineChart, ReferenceDot, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { BreakEvenChartPoint } from "@/lib/calculations/breakEvenCalculator";
import { formatINR, formatINRCompact } from "@/lib/formatters/number";
import { CHART, tooltipStyle } from "@/lib/utils/colors";

export default function BreakEvenChart({ data, breakEven, current }: { data: BreakEvenChartPoint[]; breakEven: number | null; current: number }) {
  if (!data.length) return <p className="rounded-xl bg-wash p-6 text-sm text-muted">Enter revenue and costs to draw the chart.</p>;
  return (
    <div className="h-[300px] w-full" role="img" aria-label="Revenue and total cost lines crossing at the break-even point">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 16, right: 16, bottom: 8, left: 8 }}>
          <CartesianGrid stroke={CHART.grid} vertical={false} />
          <XAxis dataKey="sales" type="number" domain={[0, "dataMax"]} tickFormatter={(v: number) => formatINRCompact(v)} tick={{ fontSize: 11, fill: CHART.tick }} stroke={CHART.axis} />
          <YAxis tickFormatter={(v: number) => formatINRCompact(v)} tick={{ fontSize: 11, fill: CHART.tick }} stroke={CHART.axis} width={64} />
          <Tooltip
            formatter={(value, name) => [formatINR(Number(value)), String(name)]}
            labelFormatter={(label) => `Sales ${formatINR(Number(label))}`}
            contentStyle={tooltipStyle}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="linear" dataKey="revenue" name="Revenue" stroke={CHART.good} strokeWidth={2.5} dot={false} isAnimationActive={false} />
          <Line type="linear" dataKey="totalCost" name="Total cost" stroke={CHART.bad} strokeWidth={2.5} dot={false} isAnimationActive={false} />
          <Line type="linear" dataKey="fixedCost" name="Fixed cost" stroke={CHART.neutral} strokeDasharray="5 5" strokeWidth={1.5} dot={false} isAnimationActive={false} />
          {current > 0 ? <ReferenceLine x={current} stroke={CHART.ink} strokeDasharray="3 3" label={{ value: "You", position: "top", fontSize: 11, fill: CHART.ink }} /> : null}
          {breakEven !== null ? <ReferenceDot x={breakEven} y={breakEven} r={6} fill={CHART.accent} stroke={CHART.card} strokeWidth={2} /> : null}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
