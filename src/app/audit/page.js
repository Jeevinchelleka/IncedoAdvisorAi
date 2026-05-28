"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import KpiCard from "@/components/dashboard/KpiCard";
import { formatDate } from "@/lib/format";
import api from "@/lib/api";
import { ClipboardList, Shield, Activity, CheckCircle2, XCircle, Filter } from "lucide-react";

const STATUS_STYLE = {
  success: "bg-emerald-500/15 text-emerald-400",
  failure: "bg-red-500/15 text-red-400",
};

const ROLE_STYLE = {
  admin:      "bg-red-500/15 text-red-400",
  advisor:    "bg-blue-500/15 text-blue-400",
  compliance: "bg-amber-500/15 text-amber-400",
  operations: "bg-purple-500/15 text-purple-400",
};

const ACTION_STYLE = {
  read:   "bg-gray-500/15 text-gray-400",
  write:  "bg-blue-500/15 text-blue-400",
  login:  "bg-emerald-500/15 text-emerald-400",
  delete: "bg-red-500/15 text-red-400",
};

export default function AuditPage() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState("");
  const [filterResource, setFilterResource] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/audit"),
      api.get("/audit/stats"),
    ]).then(([logsRes, statsRes]) => {
      setLogs(logsRes.data || []);
      setStats(statsRes.data || null);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = logs.filter(l =>
    (!filterRole     || l.userRole === filterRole) &&
    (!filterResource || l.resource === filterResource)
  );

  const uniqueRoles     = [...new Set(logs.map(l => l.userRole).filter(Boolean))];
  const uniqueResources = [...new Set(logs.map(l => l.resource).filter(Boolean))];

  return (
    <DashboardShell requiredRoles={["admin", "compliance"]}>
      <div className="space-y-5 max-w-[1400px]">
        <div>
          <h1 className="text-xl font-bold text-white">Audit Logs</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Complete audit trail of all system actions — admin &amp; compliance access only
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard title="Total Events"   value={loading ? "—" : (stats?.total || 0).toString()} icon={ClipboardList} color="blue"   loading={loading} />
          <KpiCard title="Successful"     value={loading ? "—" : (stats?.byStatus?.find(s => s.name === "success")?.value || 0).toString()} icon={CheckCircle2} color="green"  loading={loading} />
          <KpiCard title="Failures"       value={loading ? "—" : (stats?.byStatus?.find(s => s.name === "failure")?.value || 0).toString()} icon={XCircle}      color="amber"  loading={loading} />
          <KpiCard title="Active Roles"   value={loading ? "—" : uniqueRoles.length.toString()} icon={Shield}       color="purple" loading={loading} />
        </div>

        {/* Stats breakdown */}
        {stats && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* By Role */}
            <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-white mb-4">Activity by Role</h2>
              <div className="space-y-2.5">
                {stats.byRole?.sort((a, b) => b.value - a.value).map((r, i) => {
                  const max = Math.max(...stats.byRole.map(x => x.value));
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${ROLE_STYLE[r.name] || "bg-gray-500/15 text-gray-400"}`}>
                          {r.name}
                        </span>
                        <span className="text-xs font-semibold text-white">{r.value}</span>
                      </div>
                      <div className="h-1.5 bg-[#1f2937] rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${(r.value / max) * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* By Resource */}
            <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-white mb-4">Activity by Resource</h2>
              <div className="space-y-2">
                {stats.byResource?.sort((a, b) => b.value - a.value).slice(0, 8).map((r, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 capitalize">{r.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-[#1f2937] rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(r.value / Math.max(...stats.byResource.map(x => x.value))) * 100}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-white w-6 text-right">{r.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* By Action */}
            <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-white mb-4">Activity by Action</h2>
              <div className="space-y-2.5">
                {stats.byAction?.sort((a, b) => b.value - a.value).map((a, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${ACTION_STYLE[a.name] || "bg-gray-500/15 text-gray-400"}`}>
                      {a.name}
                    </span>
                    <span className="text-xs font-semibold text-white">{a.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filters + Log Table */}
        <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-blue-400" />
              <h2 className="text-sm font-semibold text-white">Event Log</h2>
              <span className="text-xs text-gray-500">({filtered.length} events)</span>
            </div>
            <div className="flex items-center gap-2">
              <Filter size={12} className="text-gray-500" />
              <select
                value={filterRole}
                onChange={e => setFilterRole(e.target.value)}
                className="bg-[#111827] border border-[#1f2937] rounded-xl px-3 py-1.5 text-xs text-gray-300 outline-none"
              >
                <option value="">All Roles</option>
                {uniqueRoles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <select
                value={filterResource}
                onChange={e => setFilterResource(e.target.value)}
                className="bg-[#111827] border border-[#1f2937] rounded-xl px-3 py-1.5 text-xs text-gray-300 outline-none"
              >
                <option value="">All Resources</option>
                {uniqueResources.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-gray-800/40 rounded-xl animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-sm">No audit events found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#1f2937]">
                    {["Time", "Role", "Action", "Resource", "Resource ID", "Status", "IP"].map(h => (
                      <th key={h} className="pb-3 px-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((log, i) => (
                    <tr key={i} className="border-b border-[#111827] hover:bg-white/[0.02]">
                      <td className="py-3 px-2 text-gray-500 whitespace-nowrap">{formatDate(log.createdAt)}</td>
                      <td className="py-3 px-2">
                        <span className={`px-1.5 py-0.5 rounded-full capitalize ${ROLE_STYLE[log.userRole] || "bg-gray-500/15 text-gray-400"}`}>
                          {log.userRole || "—"}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-1.5 py-0.5 rounded-full capitalize ${ACTION_STYLE[log.action] || "bg-gray-500/15 text-gray-400"}`}>
                          {log.action || "—"}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-gray-300 capitalize">{log.resource || "—"}</td>
                      <td className="py-3 px-2 text-gray-500 font-mono text-[10px] max-w-[100px] truncate">{log.resourceId || "—"}</td>
                      <td className="py-3 px-2">
                        <span className={`px-1.5 py-0.5 rounded-full ${STATUS_STYLE[log.status] || "bg-gray-500/15 text-gray-400"}`}>
                          {log.status || "—"}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-gray-600 font-mono text-[10px]">{log.ipAddress || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
