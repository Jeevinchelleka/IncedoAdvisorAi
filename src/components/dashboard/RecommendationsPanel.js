"use client";

import { Sparkles, TrendingUp, ShieldAlert, BarChart2, Lightbulb } from "lucide-react";
import { formatDate } from "@/lib/format";

const typeIcon = {
  buy: TrendingUp,
  sell: TrendingUp,
  rebalance: BarChart2,
  risk: ShieldAlert,
  default: Lightbulb,
};

const typeColor = {
  buy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  sell: "text-red-400 bg-red-500/10 border-red-500/20",
  rebalance: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  risk: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  default: "text-purple-400 bg-purple-500/10 border-purple-500/20",
};

export default function RecommendationsPanel({ recommendations = [], loading = false }) {
  if (loading) {
    return (
      <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5">
        <div className="h-4 w-36 bg-gray-800 rounded animate-pulse mb-4" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-800/40 rounded-xl animate-pulse mb-2" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={14} className="text-purple-400" />
        <h2 className="text-sm font-semibold text-white">AI Recommendations</h2>
        {recommendations.length > 0 && (
          <span className="ml-auto text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
            {recommendations.length}
          </span>
        )}
      </div>

      {recommendations.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
          No recommendations yet
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto flex-1">
          {recommendations.map((rec, i) => {
            const typeKey = (rec.recommendationType || "").toLowerCase();
            const colorClass = typeColor[typeKey] || typeColor.default;
            const Icon = typeIcon[typeKey] || typeIcon.default;
            const confidence = rec.confidenceScore ? Math.round(rec.confidenceScore * 100) : null;

            return (
              <div key={i} className="bg-[#111827] border border-[#1f2937] rounded-xl p-3.5">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ${colorClass}`}>
                      <Icon size={11} />
                    </div>
                    <span className={`text-[11px] font-semibold uppercase tracking-wide ${colorClass.split(" ")[0]}`}>
                      {rec.recommendationType || "General"}
                    </span>
                  </div>
                  {confidence !== null && (
                    <span className="text-[10px] text-gray-500 shrink-0">{confidence}% confidence</span>
                  )}
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">{rec.recommendationText}</p>
                {rec.client && (
                  <p className="text-[11px] text-gray-500 mt-1.5">
                    → {rec.client.firstName} {rec.client.lastName}
                  </p>
                )}
                {rec.reasoning && (
                  <p className="text-[11px] text-gray-600 mt-1 italic">{rec.reasoning}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
