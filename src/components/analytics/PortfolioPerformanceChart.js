"use client";

import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, Cell,
} from "recharts";
import { formatCurrency } from "@/lib/format";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0b1120] border border-[#1f2937] rounded-xl p-3 shadow-xl">
      <p className="text-xs text-gray-400 truncate max-w-[160px]">{label}</p>
      <p className="text-sm font-bold text-white mt-1">{formatCurrency(payload[0]?.value, true)}</p>
      {payload[1] && (
        <p className="text-xs text-emerald-400 mt-0.5">Score: {payload[1]?.value?.toFixed(1)}%</p>
      )}
    </div>
  );
};

export default function PortfolioPerformanceChart({ portfolios = [], loading = false }) {
  const data = portfolios
    .filter(p => p.totalValue > 0)
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 10)
    .map(p => ({
      name: (p.portfolioName || "Unnamed").slice(0, 18),
      value: p.totalValue,
      score: p.performanceScore,
    }));

  if (loading) {
    return (
      <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5">
        <div className="h-4 w-44 bg-gray-800 rounded animate-pulse mb-6" />
        <div className="h-56 bg-gray-800/30 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-white">Portfolio Values</h2>
        <p className="text-xs text-gray-500 mt-0.5">Top portfolios by total value</p>
      </div>
      {data.length === 0 ? (
        <div className="h-56 flex items-center justify-center text-gray-500 text-sm">No portfolio data</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => formatCurrency(v, true)} width={55} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={36}>
              {data.map((_, i) => (
                <Cell key={i} fill={`hsl(${210 + i * 15}, 70%, 55%)`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
