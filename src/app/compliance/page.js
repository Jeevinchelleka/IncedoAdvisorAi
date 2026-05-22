"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import KpiCard from "@/components/dashboard/KpiCard";
import AIAssistantPanel from "@/components/ai/AIAssistantPanel";
import AllocationChart from "@/components/charts/AllocationChart";
import AlertTable from "@/components/compliance/AlertTable";
import useComplianceStore from "@/store/complianceStore";
import useDashboardStore from "@/store/dashboardStore";
import { ShieldAlert, ShieldCheck, AlertTriangle, Clock, Search } from "lucide-react";

export default function CompliancePage() {
  const { alerts, stats, loading, fetchCompliance } = useComplianceStore();
  const { topHoldings, fetchAll } = useDashboardStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetchCompliance();
    fetchAll();
  }, [fetchCompliance, fetchAll]);

  const critical = alerts.filter((a) => a.severity === "Critical").length;
  const high     = alerts.filter((a) => a.severity === "High").length;
  const open     = alerts.filter((a) => a.status !== "resolved" && a.status !== "closed").length;
  const resolved = alerts.filter((a) => a.status === "resolved").length;

  const concentrationViolations = topHoldings.filter((h) => (h.allocation || 0) > 25);

  // Derive unique alert types dynamically
  const uniqueTypes = ["all", ...new Set(alerts.map((a) => a.alertType).filter(Boolean))];

  // Filter alerts
  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      search.trim() === "" ||
      alert.alertMessage?.toLowerCase().includes(search.toLowerCase()) ||
      `${alert.client?.firstName} ${alert.client?.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      alert.client?.email?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || alert.status === statusFilter;
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
    const matchesType = typeFilter === "all" || alert.alertType === typeFilter;

    return matchesSearch && matchesStatus && matchesSeverity && matchesType;
  });

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

        {/* Filter bar */}
        <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search alerts by client name, email, or message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#111827] border border-[#1f2937] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-[#111827] border border-[#1f2937] rounded-xl px-2.5 py-1.5">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-xs text-gray-300 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-[#111827]">All</option>
                <option value="open" className="bg-[#111827]">Open</option>
                <option value="investigating" className="bg-[#111827]">Investigating</option>
                <option value="resolved" className="bg-[#111827]">Resolved</option>
                <option value="closed" className="bg-[#111827]">Closed</option>
              </select>
            </div>

            {/* Severity Filter */}
            <div className="flex items-center gap-1.5 bg-[#111827] border border-[#1f2937] rounded-xl px-2.5 py-1.5">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Severity:</span>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-transparent text-xs text-gray-300 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-[#111827]">All</option>
                <option value="Critical" className="bg-[#111827]">Critical</option>
                <option value="High" className="bg-[#111827]">High</option>
                <option value="Medium" className="bg-[#111827]">Medium</option>
                <option value="Low" className="bg-[#111827]">Low</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-1.5 bg-[#111827] border border-[#1f2937] rounded-xl px-2.5 py-1.5">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Type:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-transparent text-xs text-gray-300 font-semibold focus:outline-none cursor-pointer capitalize"
              >
                {uniqueTypes.map((t) => (
                  <option key={t} value={t} className="bg-[#111827]">
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Alerts table */}
          <div className="lg:col-span-2 space-y-4">
            <AlertTable alerts={filteredAlerts} loading={loading} />
          </div>

          {/* Severity & Status distribution */}
          <div className="space-y-4">
            <AllocationChart
              title="Alerts by Severity"
              data={stats?.bySeverity || []}
              loading={loading}
            />
            {/* Status breakdown */}
            {stats?.byStatus && stats.byStatus.length > 0 && (
              <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5">
                <h2 className="text-sm font-semibold text-white mb-3">By Status</h2>
                <div className="space-y-2.5">
                  {stats.byStatus.map((s, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
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
              <ShieldCheck size={16} />
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
