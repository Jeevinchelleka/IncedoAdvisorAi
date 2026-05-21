import { TrendingUp, TrendingDown } from "lucide-react";

export default function KpiCard({ title, value, change, icon: Icon, color = "blue", loading = false }) {
  const isPositive = typeof change === "string" ? change.startsWith("+") : change >= 0;
  const isNeutral = change === null || change === undefined || change === "—";

  const colorMap = {
    blue: { bg: "bg-blue-600/10", text: "text-blue-400", icon: "text-blue-500", border: "border-blue-600/20" },
    green: { bg: "bg-emerald-600/10", text: "text-emerald-400", icon: "text-emerald-500", border: "border-emerald-600/20" },
    purple: { bg: "bg-purple-600/10", text: "text-purple-400", icon: "text-purple-500", border: "border-purple-600/20" },
    amber: { bg: "bg-amber-600/10", text: "text-amber-400", icon: "text-amber-500", border: "border-amber-600/20" },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5 hover:border-gray-700 transition-all group">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
          {loading ? (
            <div className="mt-3 h-8 w-28 bg-gray-800 rounded-lg animate-pulse" />
          ) : (
            <p className="mt-2 text-2xl font-bold text-white tracking-tight truncate">{value}</p>
          )}
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center shrink-0 ml-3`}>
            <Icon size={18} className={c.icon} />
          </div>
        )}
      </div>

      {!isNeutral && (
        <div className="mt-3 flex items-center gap-1.5">
          {isPositive ? (
            <TrendingUp size={13} className="text-emerald-400" />
          ) : (
            <TrendingDown size={13} className="text-red-400" />
          )}
          <span className={`text-xs font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
            {change}
          </span>
          <span className="text-xs text-gray-600">vs last period</span>
        </div>
      )}
    </div>
  );
}
