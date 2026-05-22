"use client";

import { useState } from "react";
import { ShieldAlert, Info } from "lucide-react";
import { formatCurrency } from "@/lib/format";

const scenarios = [
  {
    id: "tech_correction",
    name: "Tech Correction",
    description: "Correction in high-flying tech sectors and digital assets.",
    shocks: { Equity: -0.20, Crypto: -0.35, Bond: 0.0, Other: -0.05 },
    color: "from-red-500/20 to-orange-500/10 border-red-500/30 text-red-400",
    badge: "bg-red-500/20 text-red-400",
  },
  {
    id: "rate_spike",
    name: "Rate Spike (+100bps)",
    description: "Federal Reserve hikes rates rapidly to combat inflation.",
    shocks: { Equity: -0.10, Crypto: -0.15, Bond: 0.05, Other: -0.02 },
    color: "from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-400",
    badge: "bg-amber-500/20 text-amber-400",
  },
  {
    id: "crypto_rally",
    name: "Crypto Bull Run",
    description: "A surge in institutional capital flow into digital assets.",
    shocks: { Equity: -0.02, Crypto: 0.50, Bond: -0.05, Other: 0.02 },
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400",
    badge: "bg-emerald-500/20 text-emerald-400",
  },
  {
    id: "global_recession",
    name: "Global Recession",
    description: "Macro downturn, contraction in manufacturing & consumption.",
    shocks: { Equity: -0.15, Crypto: -0.20, Bond: -0.10, Other: -0.08 },
    color: "from-rose-500/20 to-red-500/10 border-rose-500/30 text-rose-400",
    badge: "bg-rose-500/20 text-rose-400",
  },
];

export default function ScenarioSimulation({ holdings = [], loading = false }) {
  const [selectedScenario, setSelectedScenario] = useState(null);

  if (loading) {
    return (
      <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5 animate-pulse space-y-4">
        <div className="h-5 bg-gray-800/40 rounded w-1/3" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-20 bg-gray-800/40 rounded" />
          <div className="h-20 bg-gray-800/40 rounded" />
        </div>
      </div>
    );
  }

  // Calculate current baseline AUM
  const baselineAum = holdings.reduce((sum, h) => {
    const val = (h.quantity || 0) * (h.currentPrice || 0);
    return sum + val;
  }, 0);

  // Group holdings to identify impact
  const shockedHoldings = holdings.map((h) => {
    const assetType = h.assetType || "Equity";
    const val = (h.quantity || 0) * (h.currentPrice || 0);
    let shockVal = 0;

    if (selectedScenario) {
      const shocks = selectedScenario.shocks;
      if (assetType.toLowerCase().includes("crypto")) {
        shockVal = shocks.Crypto;
      } else if (assetType.toLowerCase().includes("bond") || assetType.toLowerCase().includes("fixed")) {
        shockVal = shocks.Bond;
      } else if (assetType.toLowerCase().includes("equity") || assetType.toLowerCase().includes("stock")) {
        shockVal = shocks.Equity;
      } else {
        shockVal = shocks.Other;
      }
    }

    const projectedVal = val * (1 + shockVal);
    const pnlChange = projectedVal - val;

    return {
      ...h,
      baselineValue: val,
      projectedValue: projectedVal,
      shockPercentage: shockVal * 100,
      pnlChange,
    };
  });

  const projectedAum = shockedHoldings.reduce((sum, h) => sum + h.projectedValue, 0);
  const aumChange = projectedAum - baselineAum;
  const pctChange = baselineAum > 0 ? (aumChange / baselineAum) * 100 : 0;

  // Aggregate by Asset Type for summary graph
  const assetTypesSummary = {};
  shockedHoldings.forEach((h) => {
    const type = h.assetType || "Other";
    if (!assetTypesSummary[type]) {
      assetTypesSummary[type] = { name: type, baseline: 0, projected: 0 };
    }
    assetTypesSummary[type].baseline += h.baselineValue;
    assetTypesSummary[type].projected += h.projectedValue;
  });

  return (
    <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5 space-y-5">
      <div>
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-blue-400" size={16} />
          <h2 className="text-sm font-semibold text-white">Interactive Stress-Testing Simulator</h2>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Simulate macro shocks across firm holdings to project AUM changes and asset-class vulnerability.
        </p>
      </div>

      {/* Scenario Picker */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {scenarios.map((sc) => {
          const isSelected = selectedScenario?.id === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => setSelectedScenario(isSelected ? null : sc)}
              className={`flex flex-col text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? `bg-gradient-to-br ${sc.color} scale-[1.02] shadow-lg`
                  : "bg-[#111827] border-[#1f2937] hover:border-gray-700"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-white">{sc.name}</span>
                {isSelected && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${sc.badge}`}>
                    Active
                  </span>
                )}
              </div>
              <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed flex-1">
                {sc.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Simulator Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric Cards */}
        <div className="md:col-span-1 bg-[#111827] border border-[#1f2937] rounded-xl p-4 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">AUM Projection</span>
            <div className="mt-2 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Baseline AUM:</span>
                <span className="text-white font-semibold tabular-nums">{formatCurrency(baselineAum, true)}</span>
              </div>
              <div className="flex justify-between text-xs border-t border-[#1f2937]/50 pt-1.5">
                <span className="text-gray-400">Projected AUM:</span>
                <span className={`font-bold tabular-nums ${aumChange >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {formatCurrency(projectedAum, true)}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1f2937]/50">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Expected Impact</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-xl font-bold tabular-nums ${aumChange >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {aumChange >= 0 ? "+" : ""}{formatCurrency(aumChange, true)}
              </span>
              <span className={`text-xs font-semibold tabular-nums ${aumChange >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                ({aumChange >= 0 ? "+" : ""}{pctChange.toFixed(2)}%)
              </span>
            </div>
            {selectedScenario && (
              <div className="mt-2.5 flex items-center gap-1.5 text-[9px] text-gray-500">
                <Info size={11} className="text-gray-500 shrink-0" />
                <span>Computed against {holdings.length} holdings across portfolios</span>
              </div>
            )}
          </div>
        </div>

        {/* Visual Shock Graph by Asset Type */}
        <div className="md:col-span-2 bg-[#111827] border border-[#1f2937] rounded-xl p-4 space-y-3 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Impact breakdown by asset class</span>
          </div>

          <div className="space-y-3.5 py-1">
            {Object.values(assetTypesSummary).map((sum) => {
              const classChange = sum.projected - sum.baseline;
              const classPct = sum.baseline > 0 ? (classChange / sum.baseline) * 100 : 0;
              const maxBaseline = Math.max(...Object.values(assetTypesSummary).map(s => s.baseline), 1);
              const pctWidth = (sum.baseline / maxBaseline) * 100;
              const projPctWidth = (sum.projected / maxBaseline) * 100;

              return (
                <div key={sum.name} className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-200 capitalize">{sum.name}</span>
                    <span className="text-gray-400 font-mono">
                      {formatCurrency(sum.baseline, true)} →{" "}
                      <span className={classChange >= 0 ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold"}>
                        {formatCurrency(sum.projected, true)} ({classChange >= 0 ? "+" : ""}{classPct.toFixed(1)}%)
                      </span>
                    </span>
                  </div>
                  {/* Gauge */}
                  <div className="h-2 bg-[#090e1a] rounded-full overflow-hidden relative border border-[#1f2937]">
                    {/* Baseline Bar */}
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-blue-500/40 rounded-full transition-all duration-300"
                      style={{ width: `${pctWidth}%` }}
                    />
                    {/* Projected Bar overlay */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 rounded-full transition-all duration-300 ${
                        classChange >= 0 ? "bg-emerald-500/60" : "bg-red-500/60"
                      }`}
                      style={{ width: `${projPctWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Affected Holdings Table */}
      {selectedScenario && (
        <div className="border border-[#1f2937] rounded-xl overflow-hidden bg-[#090e1a]/50">
          <div className="px-4 py-2.5 border-b border-[#1f2937] flex items-center justify-between">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Top Vulnerable Holdings under this scenario</span>
            <span className="text-[9px] text-amber-400 font-semibold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              Simulation Mode
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1f2937] text-[10px] text-gray-500 font-semibold bg-[#0d1325]">
                  <th className="py-2.5 px-3">Symbol</th>
                  <th className="py-2.5 px-3">Asset Class</th>
                  <th className="py-2.5 px-3">Baseline Value</th>
                  <th className="py-2.5 px-3">Projected Value</th>
                  <th className="py-2.5 px-3">Shock %</th>
                  <th className="py-2.5 px-3 text-right">Estimated Gain/Loss</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f2937]/50 text-gray-300">
                {shockedHoldings
                  .sort((a, b) => a.pnlChange - b.pnlChange) // Show worst impacted first
                  .slice(0, 5)
                  .map((h, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.01]">
                      <td className="py-2 px-3 font-bold text-white">{h.symbol}</td>
                      <td className="py-2 px-3 text-gray-400 capitalize">{h.assetType}</td>
                      <td className="py-2 px-3 tabular-nums">{formatCurrency(h.baselineValue, true)}</td>
                      <td className="py-2 px-3 tabular-nums">{formatCurrency(h.projectedValue, true)}</td>
                      <td className="py-2 px-3 font-medium text-amber-500 tabular-nums">
                        {h.shockPercentage >= 0 ? "+" : ""}{h.shockPercentage.toFixed(0)}%
                      </td>
                      <td className={`py-2 px-3 text-right font-bold tabular-nums ${h.pnlChange >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {h.pnlChange >= 0 ? "+" : ""}{formatCurrency(h.pnlChange, true)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
