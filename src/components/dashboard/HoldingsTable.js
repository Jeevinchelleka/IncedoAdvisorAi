"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatCurrency, formatPct } from "@/lib/format";

const assetTypeColors = {
  Equity: "bg-blue-500/15 text-blue-400",
  equity: "bg-blue-500/15 text-blue-400",
  Crypto: "bg-purple-500/15 text-purple-400",
  crypto: "bg-purple-500/15 text-purple-400",
  Bond: "bg-emerald-500/15 text-emerald-400",
  bond: "bg-emerald-500/15 text-emerald-400",
  Bonds: "bg-emerald-500/15 text-emerald-400",
  ETF: "bg-amber-500/15 text-amber-400",
  etf: "bg-amber-500/15 text-amber-400",
  Cash: "bg-gray-500/15 text-gray-400",
  cash: "bg-gray-500/15 text-gray-400",
};

export default function HoldingsTable({ holdings = [], loading = false }) {
  if (loading) {
    return (
      <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5">
        <div className="h-5 w-36 bg-gray-800 rounded animate-pulse mb-5" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 bg-gray-800/50 rounded-xl animate-pulse mb-2" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-white">Top Holdings</h2>
          <p className="text-xs text-gray-500 mt-0.5">By allocation weight</p>
        </div>
        <span className="text-xs text-gray-500">{holdings.length} positions</span>
      </div>

      {holdings.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">No holdings data available</p>
      ) : (
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-[#1f2937]">
                {["Symbol", "Type", "Qty", "Avg Cost", "Current", "Value", "Alloc", "P/L"].map((h) => (
                  <th key={h} className="pb-3 px-1 text-[11px] font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {holdings.map((h, i) => {
                const pnl = h.pnl ?? (h.purchasePrice > 0 ? ((h.currentPrice - h.purchasePrice) / h.purchasePrice) * 100 : 0);
                const isPos = pnl >= 0;
                const typeClass = assetTypeColors[h.type] || assetTypeColors[h.assetType] || "bg-gray-500/15 text-gray-400";
                return (
                  <tr key={i} className="border-b border-[#111827] hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-1 font-semibold text-white">{h.symbol}</td>
                    <td className="py-3.5 px-1">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${typeClass}`}>
                        {h.type || h.assetType}
                      </span>
                    </td>
                    <td className="py-3.5 px-1 text-gray-300 tabular-nums">{h.quantity?.toLocaleString()}</td>
                    <td className="py-3.5 px-1 text-gray-400 tabular-nums">{formatCurrency(h.purchasePrice)}</td>
                    <td className="py-3.5 px-1 text-gray-300 tabular-nums">{formatCurrency(h.currentPrice)}</td>
                    <td className="py-3.5 px-1 text-white font-medium tabular-nums">{formatCurrency(h.value)}</td>
                    <td className="py-3.5 px-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${Math.min(h.allocation, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 tabular-nums">{h.allocation?.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-1">
                      <div className={`flex items-center gap-1 ${isPos ? "text-emerald-400" : "text-red-400"}`}>
                        {isPos ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        <span className="text-xs font-medium tabular-nums">{formatPct(pnl)}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
