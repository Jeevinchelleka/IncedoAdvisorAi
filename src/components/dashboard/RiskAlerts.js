"use client";

import { AlertTriangle, AlertCircle, Info, ShieldAlert } from "lucide-react";

const severityConfig = {
  Critical: {
    icon: ShieldAlert,
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "text-red-400",
    badge: "bg-red-500/20 text-red-400",
    dot: "bg-red-500",
  },
  High: {
    icon: AlertTriangle,
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    text: "text-orange-400",
    badge: "bg-orange-500/20 text-orange-400",
    dot: "bg-orange-500",
  },
  Medium: {
    icon: AlertCircle,
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    badge: "bg-amber-500/20 text-amber-400",
    dot: "bg-amber-500",
  },
  Low: {
    icon: Info,
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
    badge: "bg-blue-500/20 text-blue-400",
    dot: "bg-blue-500",
  },
};

export default function RiskAlerts({ alerts = [], loading = false }) {
  if (loading) {
    return (
      <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5 h-full">
        <div className="h-5 w-28 bg-gray-800 rounded animate-pulse mb-4" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-800/50 rounded-xl animate-pulse mb-3" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-white">Risk Alerts</h2>
        {alerts.length > 0 && (
          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-medium">
            {alerts.length}
          </span>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
            <ShieldAlert size={18} className="text-emerald-400" />
          </div>
          <p className="text-sm font-medium text-white">All Clear</p>
          <p className="text-xs text-gray-500 mt-1">No risk alerts detected</p>
        </div>
      ) : (
        <div className="space-y-2.5 overflow-y-auto flex-1">
          {alerts.map((alert, i) => {
            const cfg = severityConfig[alert.severity] || severityConfig.Low;
            const Icon = cfg.icon;
            return (
              <div
                key={i}
                className={`${cfg.bg} border ${cfg.border} rounded-xl p-3.5`}
              >
                <div className="flex items-start gap-2.5">
                  <Icon size={15} className={`${cfg.text} mt-0.5 shrink-0`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-white truncate">{alert.title}</p>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0 ${cfg.badge}`}>
                        {alert.severity}
                      </span>
                    </div>
                    {alert.detail && (
                      <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{alert.detail}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
