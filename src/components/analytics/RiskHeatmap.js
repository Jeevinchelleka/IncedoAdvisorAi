"use client";

import { formatCurrency, formatPct } from "@/lib/format";

const riskBand = (score) => {
  if (score >= 7) return { label: "High", color: "bg-red-500/20 text-red-400 border-red-500/30" };
  if (score >= 4) return { label: "Medium", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" };
  return { label: "Low", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" };
};

export default function RiskHeatmap({ portfolios = [], loading = false }) {
  if (loading) {
    return (
      <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5">
        <div className="h-5 w-32 bg-gray-800 rounded animate-pulse mb-5" />
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-20 bg-gray-800/50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-white">Portfolio Risk Heatmap</h2>
        <p className="text-xs text-gray-500 mt-0.5">Risk score vs portfolio value</p>
      </div>

      {portfolios.length === 0 ? (
        <div className="h-40 flex items-center justify-center text-gray-500 text-sm">
          No portfolio data available
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {portfolios.map((p) => {
            const band = riskBand(p.riskScore);
            return (
              <div
                key={p.id}
                className={`rounded-xl border p-3 ${band.color}`}
              >
                <p className="text-xs font-semibold truncate">{p.portfolioName}</p>
                <p className="text-lg font-bold mt-1">{formatCurrency(p.totalValue, true)}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[10px] font-medium opacity-80">{band.label} Risk</span>
                  <span className="text-[10px] opacity-70">Score: {p.riskScore?.toFixed(1)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
