"use client";

import { useEffect } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import KpiCard from "@/components/dashboard/KpiCard";
import AIAssistantPanel from "@/components/ai/AIAssistantPanel";
import AllocationChart from "@/components/charts/AllocationChart";
import useComplianceStore from "@/store/complianceStore";
import useDashboardStore from "@/store/dashboardStore";
import { formatDate } from "@/lib/format";
import { ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle2, Clock, XCircle } from "lucide-react";

const severityConfig = {
  Critical: { bg: "bg-red-500/10 border-red-500/20", text: "text-red-400", badge: "bg-red-500/20 text-red-400" },
  High:     { bg: "bg-orange-500/10 border-orange-500/20", text: "text-orange-400", badge: "bg-orange-500/20 text-orange-400" },
  Medium:   { bg: "bg-amber-500/10 border-amber-500/20", text: "text-amber-400", badge: "bg-amber-500/20 text-amber-400" },
  Low:      { bg: "bg-blue-500/10 border-blue-500/20", text: "text-blue-400", badge: "bg-blue-500/20 text-blue-400" },
};

const statusIcon = {
  open: <AlertTriangle size={13} className="text-amber-400" />,
  resolved: <CheckCircle2 size={13} className="text-emerald-400" />,
  pending: <Clock size={13} className="text-blue-400" />,
  closed: <XCircle size={13} className="text-gray-400" />,
};

export default function CompliancePage() {
  const { alerts, stats, loading, fetchCompliance } = useComplianceStore();
  const { topHoldings, fetchAll } = useDashboardStore();

  useEffect(() => {
    fetchCompliance();
    fetchAll();
  }, [fetchCompliance, fetchAll]);

  const critical = alerts.filter((a) => a.severity === "Critical").length;
  const high     = alerts.filter((a) => a.severity === "High").length;
  const open     = alerts.filter((a) => a.status !== "resolved" && a.status !== "closed").length;
  const resolved = alerts.filter((a) => a.status === "resolved").length;

  const concentrationViolations = topHoldings.filter((h) => (h.allocation || 0) > 25);

  return (
    <DashboardShell rightPanel={<AIAssistantPanel />}>
      <div className="space-y-5 max-w-[1400px]">
        <div>
          <h1 className="text-xl font-bold text-white">Compliance</h1>
          <p className="text-xs text-gray-500 mt-0.5">Risk monitoring and regulatory compliance</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard title="Total Alerts"    value={loading ? "—" : alerts.length.toString()} icon={ShieldAlert}  color="amber"  loading={loading} />
          <KpiCard title="Critical"        value={loading ? "—" : critical.toString()}       icon={AlertTriangle} color="amber" loading={loading} />
          <KpiCard title="Open"            value={loading ? "—" : open.toString()}           icon={Clock}        color="blue"   loading={loading} />
          <KpiCard title="Resolved"        value={loading ? "—" : resolved.toString()}       icon={ShieldCheck}  color="green"  loading={loading} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Alerts table */}
          <div className="lg:col-span-2 bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4">Compliance Alerts</h2>
            {loading ? (
              [1,2,3,4].map(i => <div key={i} className="h-16 bg-gray-800/40 rounded-xl animate-pulse mb-2" />)
            ) : alerts.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center">
                <ShieldCheck size={28} className="text-emerald-400 mb-2" />
                <p className="text-sm font-medium text-white">All Clear</p>
                <p className="text-xs text-gray-500 mt-1">No compliance alerts found</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                {alerts.map((alert, i) => {
                  const cfg = severityConfig[alert.severity] || severityConfig.Low;
                  return (
                    <div key={i} className={`border rounded-xl p-3.5 ${cfg.bg}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs font-semibold ${cfg.text}`}>{alert.alertMessage}</span>
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${cfg.badge}`}>
                              {alert.severity}
                            </span>
                          </div>
                          {alert.client && (
                            <p className="text-[11px] text-gray-400 mt-1">
                              Client: {alert.client.firstName} {alert.client.lastName}
                              {alert.client.riskProfile && ` · ${alert.client.riskProfile}`}
                            </p>
                          )}
                          <p className="text-[10px] text-gray-600 mt-1">{formatDate(alert.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {statusIcon[alert.status] || statusIcon.open}
                          <span className="text-[11px] text-gray-400 capitalize">{alert.status}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Severity distribution */}
          <div className="space-y-4">
            <AllocationChart
              data={stats?.bySeverity || []}
              loading={loading}
            />
            {/* Status breakdown */}
            {stats?.byStatus && stats.byStatus.length > 0 && (
              <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5">
                <h2 className="text-sm font-semibold text-white mb-3">By Status</h2>
                <div className="space-y-2">
                  {stats.byStatus.map((s, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {statusIcon[s.name] || statusIcon.open}
                        <span className="text-xs text-gray-300 capitalize">{s.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-white">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Concentration violations */}
        <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-white mb-1">Concentration Violations</h2>
          <p className="text-xs text-gray-500 mb-4">Holdings exceeding 25% allocation threshold</p>
          {concentrationViolations.length === 0 ? (
            <div className="flex items-center gap-2 text-emerald-400 text-sm">
              <CheckCircle2 size={16} />
              <span>No concentration violations detected</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {concentrationViolations.map((h, i) => (
                <div key={i} className="flex items-center justify-between bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-sm font-bold text-white">{h.symbol}</p>
                    <p className="text-xs text-gray-500">{h.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-400">{h.allocation?.toFixed(1)}%</p>
                    <p className="text-[10px] text-gray-600">Limit: 25%</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
