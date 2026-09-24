"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatINR, formatPercent } from "@/lib/formatters/number";
import { tooltipStyle } from "@/lib/utils/colors";

export interface DonutSlice {
  name: string;
  value: number;
  color: string;
}

export default function CostDonut({ slices, total, centerLabel, centerValue }: { slices: DonutSlice[]; total: number; centerLabel: string; centerValue: string }) {
  const data = slices.filter((s) => s.value > 0);
  if (!data.length || total <= 0) return <p className="rounded-xl bg-wash p-6 text-sm text-muted">Enter your sales and costs to see the breakdown.</p>;
  return (
    <div className="grid items-center gap-4 sm:grid-cols-[200px_minmax(0,1fr)]">
      <div className="relative mx-auto h-[200px] w-[200px]" role="img" aria-label={`Cost structure: ${data.map((d) => `${d.name} ${formatPercent((d.value / total) * 100)}`).join(", ")}`}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={2} stroke="none" isAnimationActive={false}>
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [formatINR(Number(value)), String(name)]} contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[11px] uppercase tracking-wider text-muted">{centerLabel}</span>
          <span className="tabular text-lg font-bold">{centerValue}</span>
        </div>
      </div>
      <ul className="flex flex-col gap-2 text-sm">
        {slices.map((s) => (
          <li key={s.name} className="grid grid-cols-[12px_minmax(0,1fr)_auto_auto] items-center gap-2.5">
            <span className="h-3 w-3 rounded-sm" style={{ background: s.color }} aria-hidden />
            <span className="truncate">{s.name}</span>
            <span className="tabular font-semibold">{formatINR(s.value)}</span>
            <span className="tabular w-14 text-right text-muted">{formatPercent(total > 0 ? (s.value / total) * 100 : null)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
