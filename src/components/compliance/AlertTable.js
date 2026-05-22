"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, Clock, XCircle, ShieldAlert, X, Check } from "lucide-react";
import useComplianceStore from "@/store/complianceStore";
import { formatDate } from "@/lib/format";

const severityConfig = {
  Critical: { badge: "bg-red-500/10 text-red-400 border border-red-500/20" },
  High:     { badge: "bg-orange-500/10 text-orange-400 border border-orange-500/20" },
  Medium:   { badge: "bg-amber-500/10 text-amber-400 border border-amber-500/20" },
  Low:      { badge: "bg-blue-500/10 text-blue-400 border border-blue-500/20" },
};

const statusConfig = {
  open: { text: "text-amber-400 bg-amber-500/5 border border-amber-500/15", icon: <AlertTriangle size={13} className="text-amber-400 shrink-0" /> },
  resolved: { text: "text-emerald-400 bg-emerald-500/5 border border-emerald-500/15", icon: <CheckCircle2 size={13} className="text-emerald-400 shrink-0" /> },
  pending: { text: "text-blue-400 bg-blue-500/5 border border-blue-500/15", icon: <Clock size={13} className="text-blue-400 shrink-0" /> },
  investigating: { text: "text-purple-400 bg-purple-500/5 border border-purple-500/15", icon: <Clock size={13} className="text-purple-400 shrink-0" /> },
  closed: { text: "text-gray-400 bg-gray-500/5 border border-gray-500/15", icon: <XCircle size={13} className="text-gray-400 shrink-0" /> },
};

export default function AlertTable({ alerts = [], loading = false }) {
  const { updateAlert } = useComplianceStore();
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [status, setStatus] = useState("resolved");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const handleResolveOpen = (alert) => {
    setSelectedAlert(alert);
    setStatus(alert.status || "resolved");
    setNotes(alert.notes || "");
  };

  const handleResolveSave = async () => {
    if (!selectedAlert) return;
    setSaving(true);
    try {
      await updateAlert(selectedAlert.id, status, notes);
      setSelectedAlert(null);
    } catch (err) {
      console.error("Failed to update alert:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative">
      <div className="overflow-x-auto w-full border border-[#1f2937]/60 rounded-2xl bg-[#0b1120]/40 backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#1f2937]/80 text-[10px] uppercase tracking-wider text-gray-500 font-semibold bg-[#090e1a]">
              <th className="py-3 px-4">Alert Message</th>
              <th className="py-3 px-4">Client</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Created At</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1f2937]/45 text-xs text-gray-300">
            {loading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-4"><div className="h-4 bg-gray-800/40 rounded w-48" /></td>
                  <td className="py-4 px-4"><div className="h-4 bg-gray-800/40 rounded w-24" /></td>
                  <td className="py-4 px-4"><div className="h-6 bg-gray-800/40 rounded w-16" /></td>
                  <td className="py-4 px-4"><div className="h-4 bg-gray-800/40 rounded w-20" /></td>
                  <td className="py-4 px-4"><div className="h-6 bg-gray-800/40 rounded w-20" /></td>
                  <td className="py-4 px-4"><div className="h-4 bg-gray-800/40 rounded w-28" /></td>
                  <td className="py-4 px-4 text-right"><div className="h-8 bg-gray-800/40 rounded w-16 ml-auto" /></td>
                </tr>
              ))
            ) : alerts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-gray-500">
                  No alerts match your filter criteria.
                </td>
              </tr>
            ) : (
              alerts.map((alert) => {
                const sevCfg = severityConfig[alert.severity] || severityConfig.Low;
                const staCfg = statusConfig[alert.status] || statusConfig.open;
                return (
                  <tr
                    key={alert.id}
                    className="hover:bg-white/[0.01] transition-colors"
                  >
                    <td className="py-3.5 px-4 font-medium text-white max-w-[280px] break-words">
                      {alert.alertMessage}
                    </td>
                    <td className="py-3.5 px-4">
                      {alert.client ? (
                        <div>
                          <p className="font-semibold text-gray-200">
                            {alert.client.firstName} {alert.client.lastName}
                          </p>
                          <p className="text-[10px] text-gray-500">{alert.client.email}</p>
                        </div>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${sevCfg.badge}`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-gray-400 font-medium">
                      {alert.alertType || "General"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${staCfg.text}`}>
                        {staCfg.icon}
                        {alert.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-400 font-mono">
                      {formatDate(alert.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleResolveOpen(alert)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-600/10 border border-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all duration-200"
                      >
                        Resolve
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Resolution Modal */}
      <AnimatePresence>
        {selectedAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAlert(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            {/* Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-[#0b1120] border border-[#1f2937] rounded-2xl shadow-2xl p-5 z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#1f2937]/80 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="text-blue-400" size={18} />
                  <h3 className="text-sm font-bold text-white">Resolve Compliance Alert</h3>
                </div>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="w-7 h-7 rounded-lg bg-[#111827] border border-[#1f2937] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-3.5">
                <div className="bg-[#111827] border border-[#1f2937]/60 rounded-xl p-3">
                  <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Alert Details</p>
                  <p className="text-xs text-white mt-1 font-medium leading-relaxed">{selectedAlert.alertMessage}</p>
                  {selectedAlert.client && (
                    <p className="text-[10px] text-gray-400 mt-1.5">
                      Client: {selectedAlert.client.firstName} {selectedAlert.client.lastName}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Status</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["open", "investigating", "resolved"].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setStatus(st)}
                        className={`py-2 px-2 text-xs font-semibold rounded-xl border capitalize transition-all ${
                          status === st
                            ? "bg-blue-600/10 border-blue-500 text-blue-400 font-bold"
                            : "bg-[#111827] border-[#1f2937] text-gray-400 hover:bg-[#111827]/80"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Resolution Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Enter compliance action taken, findings, or notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-[#111827] border border-[#1f2937] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors resize-none placeholder-gray-600"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="flex-1 py-2.5 text-xs font-semibold rounded-xl border border-[#1f2937] text-gray-400 hover:text-white transition-colors bg-[#111827]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResolveSave}
                  disabled={saving}
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all flex items-center justify-center gap-1.5"
                >
                  {saving ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check size={14} />
                      Save
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
