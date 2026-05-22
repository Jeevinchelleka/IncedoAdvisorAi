"use client";

import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, Cell, ReferenceLine,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value;
  const isPos = val >= 0;
  return (
    <div className="bg-[#0b1120] border border-[#1f2937] rounded-xl p-3 shadow-xl">
      <p className="text-xs font-bold text-white">{label}</p>
      <p className={`text-sm font-bold mt-1 ${isPos ? "text-emerald-400" : "text-red-400"}`}>
        {isPos ? "+" : ""}{val?.toFixed(1)}%
      </p>
    </div>
  );
};

export default function HoldingsPnLChart({ holdings = [], loading = false }) {
  const data = holdings
    .filter(h => h.purchasePrice > 0)
    .map(h => ({
      symbol: h.symbol,
      pnl: parseFloat((((h.currentPrice - h.purchasePrice) / h.purchasePrice) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.pnl - a.pnl);

  if (loading) {
    return (
      <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5">
        <div className="h-4 w-40 bg-gray-800 rounded animate-pulse mb-6" />
        <div className="h-56 bg-gray-800/30 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-white">Holdings P&L %</h2>
        <p className="text-xs text-gray-500 mt-0.5">Unrealized gain/loss per holding</p>
      </div>
      {data.length === 0 ? (
        <div className="h-56 flex items-center justify-center text-gray-500 text-sm">No holdings data</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis dataKey="symbol" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#374151" strokeDasharray="3 3" />
            <Bar dataKey="pnl" radius={[4, 4, 0, 0]} maxBarSize={36}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.pnl >= 0 ? "#10b981" : "#ef4444"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
