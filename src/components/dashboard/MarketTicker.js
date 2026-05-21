"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

export default function MarketTicker({ data = [] }) {
  if (!data.length) return null;

  return (
    <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl px-5 py-3 overflow-hidden">
      <div className="flex items-center gap-6 overflow-x-auto scrollbar-none">
        {data.map((item, i) => {
          const isPos = (item.dailyChange || 0) >= 0;
          return (
            <div key={i} className="flex items-center gap-3 shrink-0">
              <div>
                <span className="text-xs font-bold text-white">{item.symbol}</span>
                <span className="text-xs text-gray-400 ml-2">
                  ${Number(item.currentPrice).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${isPos ? "text-emerald-400" : "text-red-400"}`}>
                {isPos ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {isPos ? "+" : ""}{Number(item.dailyChange).toFixed(2)}%
              </div>
              {i < data.length - 1 && <div className="w-px h-4 bg-[#1f2937]" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
