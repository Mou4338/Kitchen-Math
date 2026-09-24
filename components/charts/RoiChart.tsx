"use client";

import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { RoiPoint } from "@/lib/calculations/roiCalculator";
import { formatINR, formatINRCompact } from "@/lib/formatters/number";
import { CHART, tooltipStyle } from "@/lib/utils/colors";

export default function RoiChart({ data, investment }: { data: RoiPoint[]; investment: number }) {
  if (!data.length) return null;
  return (
    <div className="h-[280px] w-full" role="img" aria-label="Cumulative profit over time compared with the initial investment">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 16, right: 16, bottom: 8, left: 8 }}>
          <defs>
            <linearGradient id="roiFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART.good} stopOpacity={0.35} />
              <stop offset="100%" stopColor={CHART.good} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={CHART.grid} vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: CHART.tick }} stroke={CHART.axis} tickFormatter={(m: number) => `M${m}`} interval="preserveStartEnd" />
          <YAxis tickFormatter={(v: number) => formatINRCompact(v)} tick={{ fontSize: 11, fill: CHART.tick }} stroke={CHART.axis} width={64} />
          <Tooltip formatter={(value) => [formatINR(Number(value)), "Cumulative profit"]} labelFormatter={(l) => `Month ${l}`} contentStyle={tooltipStyle} />
          {investment > 0 ? <ReferenceLine y={investment} stroke={CHART.accent} strokeDasharray="5 4" label={{ value: `Investment ${formatINRCompact(investment)}`, position: "insideTopLeft", fontSize: 11, fill: CHART.accentDark }} /> : null}
          <Area type="monotone" dataKey="cumulativeProfit" stroke={CHART.good} strokeWidth={2.5} fill="url(#roiFill)" isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
