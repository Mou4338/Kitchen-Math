"use client";

import { CartesianGrid, ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis, Cell } from "recharts";
import type { MenuCategory, MenuItemResult } from "@/lib/calculations/menuEngineeringCalculator";
import { formatINR, formatNumber } from "@/lib/formatters/number";
import { CHART } from "@/lib/utils/colors";

export const CATEGORY_COLOR: Record<MenuCategory, string> = { star: CHART.good, puzzle: CHART.c1, plowhorse: CHART.accent, dog: CHART.bad };

interface Point {
  name: string;
  x: number;
  y: number;
  z: number;
  category: MenuCategory;
}

export default function MenuMatrixChart({ items, averageProfit, averageUnits }: { items: MenuItemResult[]; averageProfit: number; averageUnits: number }) {
  const data: Point[] = items.map((i) => ({ name: i.name, x: i.unitsSold, y: i.profitPerUnit, z: Math.max(1, i.totalProfit), category: i.category }));
  if (!data.length) return null;
  return (
    <div className="h-[340px] w-full" role="img" aria-label="Menu engineering matrix: units sold against profit per unit">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 16, right: 20, bottom: 24, left: 8 }}>
          <CartesianGrid stroke={CHART.grid} />
          <XAxis type="number" dataKey="x" name="Units sold" tick={{ fontSize: 11, fill: CHART.tick }} stroke={CHART.axis} label={{ value: "Units sold", position: "insideBottom", offset: -12, fontSize: 11, fill: CHART.tick }} />
          <YAxis type="number" dataKey="y" name="Profit per unit" tickFormatter={(v: number) => `₹${Math.round(v)}`} tick={{ fontSize: 11, fill: CHART.tick }} stroke={CHART.axis} width={56} />
          <ZAxis type="number" dataKey="z" range={[60, 420]} />
          <ReferenceLine x={averageUnits} stroke={CHART.ink} strokeDasharray="4 4" />
          <ReferenceLine y={averageProfit} stroke={CHART.ink} strokeDasharray="4 4" />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const p = payload[0].payload as Point;
              return (
                <div className="rounded-xl border border-line bg-card px-3 py-2 text-xs shadow-lift">
                  <p className="font-semibold">{p.name}</p>
                  <p>{formatNumber(p.x)} units sold</p>
                  <p>Profit {formatINR(p.y, 2)} / unit</p>
                </div>
              );
            }}
          />
          <Scatter data={data} isAnimationActive={false}>
            {data.map((d, i) => (
              <Cell key={`${d.name}-${i}`} fill={CATEGORY_COLOR[d.category]} fillOpacity={0.8} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
