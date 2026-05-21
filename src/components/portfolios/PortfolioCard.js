"use client";

import { TrendingUp, TrendingDown, Briefcase, BarChart2 } from "lucide-react";
import { formatCurrency, formatPct, formatDate } from "@/lib/format";

const riskColor = (score) => {
  if (score >= 7) return "text-red-400 bg-red-500/10 border-red-500/20";
  if (score >= 4) return "text-amber-400 bg-amber-500/10 border-amber-500/20";
  return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
};

const riskLabel = (score) => {
  if (score >= 7) return "High Risk";
  if (score >= 4) return "Moderate";
  return "Conservative";
};

export default function PortfolioCard({ portfolio }) {
  const perf = portfolio.performanceScore || 0;
  const isPos = perf >= 0;
  const rc = riskColor(portfolio.riskScore);

  return (
    <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5 hover:border-gray-700 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-600/20 flex items-center justify-center shrink-0">
            <Briefcase size={17} className="text-blue-400" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-white text-sm truncate">{portfolio.portfolioName}</p>
            <p className="text-xs text-gray-500 mt-0.5">{portfolio.holdingsCount || 0} holdings · Created {formatDate(portfolio.createdAt)}</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-bold text-white">{formatCurrency(portfolio.totalValue, true)}</p>
          <div className={`flex items-center justify-end gap-1 mt-0.5 ${isPos ? "text-emerald-400" : "text-red-400"}`}>
            {isPos ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span className="text-xs font-medium">{formatPct(perf)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border ${rc}`}>
          <BarChart2 size={11} />
          {riskLabel(portfolio.riskScore)} ({portfolio.riskScore?.toFixed(1)})
        </div>
        <div className="text-xs text-gray-500">
          Holdings value: {formatCurrency(portfolio.holdingsValue, true)}
        </div>
      </div>
    </div>
  );
}
