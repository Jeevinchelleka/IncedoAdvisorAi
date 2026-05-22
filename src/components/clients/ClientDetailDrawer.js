"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, User, Phone, Mail, MapPin, Briefcase, Coins, ShieldAlert,
  Calendar, MessageSquare, Plus, FileText, CheckCircle2, TrendingUp, AlertTriangle
} from "lucide-react";
import api from "@/lib/api";
import { formatCurrency, formatDate, formatPct } from "@/lib/format";

const riskColors = {
  Conservative: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Moderate: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Aggressive: "bg-red-500/10 text-red-400 border-red-500/20",
  "Very Aggressive": "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

const sentimentColors = {
  Positive: "bg-emerald-500/10 text-emerald-400",
  Neutral: "bg-gray-500/10 text-gray-400",
  Negative: "bg-red-500/10 text-red-400",
};

export default function ClientDetailDrawer({ clientId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    api.get(`/clients/${clientId}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load client details:", err);
        setLoading(false);
      });
  }, [clientId]);

  if (!clientId) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Sliding Panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          className="relative w-full sm:w-[540px] md:w-[640px] bg-[#0b1120] border-l border-[#1f2937] shadow-2xl h-full flex flex-col z-10"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-[#1f2937] flex items-center justify-between shrink-0 bg-[#0c1325]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center">
                <User className="text-blue-400" size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  {loading ? "Loading..." : `${data?.firstName} ${data?.lastName}`}
                </h2>
                {!loading && data?.riskProfile && (
                  <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 mt-0.5 rounded-full border ${riskColors[data.riskProfile] || "bg-gray-800 text-gray-400 border-gray-700"}`}>
                    {data.riskProfile} Profile
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#111827] border border-[#1f2937] hover:border-gray-600 flex items-center justify-center text-gray-400 hover:text-white transition-all"
            >
              <X size={15} />
            </button>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center flex-col gap-3">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-gray-500">Retrieving client record...</p>
            </div>
          ) : !data ? (
            <div className="flex-1 flex items-center justify-center p-6 text-center">
              <p className="text-sm text-gray-500">Could not retrieve client details.</p>
            </div>
          ) : (
            <>
              {/* Tab Navigation */}
              <div className="flex border-b border-[#111827] px-5 bg-[#090e1a] shrink-0">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "portfolios", label: `Portfolios (${data.portfolios?.length || 0})` },
                  { id: "interactions", label: `Interactions (${data.interactions?.length || 0})` },
                  { id: "notes", label: `Notes (${data.notes?.length || 0})` }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all -mb-px ${
                      activeTab === t.id
                        ? "border-blue-500 text-blue-400"
                        : "border-transparent text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {activeTab === "overview" && (
                  <div className="space-y-4">
                    {/* Financial Summary KPIs */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-3.5">
                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">AUM</p>
                        <p className="text-base font-bold text-white mt-1 tabular-nums">
                          {formatCurrency(data.portfolios?.reduce((s, p) => s + (p.totalValue || 0), 0), true)}
                        </p>
                      </div>
                      <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-3.5">
                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Net Worth</p>
                        <p className="text-base font-bold text-white mt-1 tabular-nums">
                          {formatCurrency(data.netWorth, true)}
                        </p>
                      </div>
                      <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-3.5">
                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Goal</p>
                        <p className="text-xs font-semibold text-blue-400 mt-1.5 truncate" title={data.investmentGoal}>
                          {data.investmentGoal || "Not set"}
                        </p>
                      </div>
                    </div>

                    {/* Detailed Metadata Grid */}
                    <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-4 space-y-3.5">
                      <h3 className="text-xs font-semibold text-white uppercase tracking-wider text-gray-400">Client Demographics</h3>
                      <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                        <div className="flex items-center gap-2">
                          <MapPin size={13} className="text-gray-600 shrink-0" />
                          <div>
                            <p className="text-[10px] text-gray-500">Location</p>
                            <p className="text-gray-200 mt-0.5">{data.city || "N/A"}, {data.country || "US"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase size={13} className="text-gray-600 shrink-0" />
                          <div>
                            <p className="text-[10px] text-gray-500">Occupation</p>
                            <p className="text-gray-200 mt-0.5 truncate">{data.occupation || "N/A"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <User size={13} className="text-gray-600 shrink-0" />
                          <div>
                            <p className="text-[10px] text-gray-500">Age & Relationship</p>
                            <p className="text-gray-200 mt-0.5">{data.age ? `${data.age} yrs` : "N/A"} · {data.relationshipStatus || "Single"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Coins size={13} className="text-gray-600 shrink-0" />
                          <div>
                            <p className="text-[10px] text-gray-500">Annual Income</p>
                            <p className="text-gray-200 mt-0.5 tabular-nums">{formatCurrency(data.annualIncome)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={13} className="text-emerald-500/80 shrink-0" />
                          <div>
                            <p className="text-[10px] text-gray-500">KYC Status</p>
                            <p className="text-emerald-400 font-medium capitalize mt-0.5">{data.kycStatus || "Verified"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={13} className="text-gray-600 shrink-0" />
                          <div>
                            <p className="text-[10px] text-gray-500">Onboarding Date</p>
                            <p className="text-gray-200 mt-0.5">{formatDate(data.onboardingDate)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-4 space-y-3">
                      <h3 className="text-xs font-semibold text-white uppercase tracking-wider text-gray-400">Contact Details</h3>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          <Mail size={13} className="text-gray-500 shrink-0" />
                          <span className="text-gray-300 select-all">{data.email || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={13} className="text-gray-500 shrink-0" />
                          <span className="text-gray-300 select-all">{data.phone || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Risk Survey Insight */}
                    {data.riskAssessments?.length > 0 && (
                      <div className="bg-[#111827]/60 border border-[#1f2937] rounded-2xl p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-semibold text-white uppercase tracking-wider text-gray-400">Risk Suitability Score</h3>
                          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                            Score: {data.riskAssessments[0].riskToleranceScore}/10
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 leading-relaxed italic">
                          "{data.riskAssessments[0].notes || "Suitability check is verified. Time horizon is suitable for long-term compounding with liquidity check passed."}"
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "portfolios" && (
                  <div className="space-y-4">
                    {data.portfolios?.map((p) => {
                      const portHoldings = data.holdings?.filter(h => h.portfolioId === p.id) || [];
                      return (
                        <div key={p.id} className="bg-[#111827] border border-[#1f2937] rounded-2xl p-4 space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-sm font-bold text-white">{p.portfolioName}</h4>
                              <p className="text-[10px] text-gray-500 mt-0.5">Type: {p.portfolioType || "Balanced"} · Benchmark: {p.benchmark}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-blue-400 tabular-nums">{formatCurrency(p.totalValue, true)}</p>
                              <span className="text-[9px] text-emerald-400 font-medium">Perf: +{p.performanceScore}%</span>
                            </div>
                          </div>

                          {/* Mini Holdings list */}
                          {portHoldings.length > 0 && (
                            <div className="border-t border-[#1f2937]/60 pt-3 space-y-1.5">
                              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Holdings</p>
                              <div className="space-y-1">
                                {portHoldings.map((h, hi) => {
                                  const pnl = (((h.currentPrice - h.purchasePrice) / h.purchasePrice) * 100);
                                  const isPos = pnl >= 0;
                                  return (
                                    <div key={hi} className="flex items-center justify-between text-xs py-1 hover:bg-white/[0.01] px-1 rounded transition-colors">
                                      <div className="flex items-center gap-2">
                                        <span className="font-bold text-white">{h.symbol}</span>
                                        <span className="text-[10px] text-gray-500">Qty: {h.quantity}</span>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <span className="text-gray-400 tabular-nums">{formatCurrency(h.currentPrice * h.quantity)}</span>
                                        <span className={`text-[10px] font-medium tabular-nums ${isPos ? "text-emerald-400" : "text-red-400"}`}>
                                          {isPos ? "+" : ""}{pnl.toFixed(1)}%
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {(!data.portfolios || data.portfolios.length === 0) && (
                      <p className="text-xs text-gray-500 text-center py-6">No portfolios created for this client.</p>
                    )}
                  </div>
                )}

                {activeTab === "interactions" && (
                  <div className="space-y-4">
                    <div className="relative border-l border-[#1f2937] ml-2.5 pl-5 space-y-5 py-2">
                      {data.interactions?.map((i) => (
                        <div key={i.id} className="relative">
                          {/* Timeline dot */}
                          <div className={`absolute -left-[26px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[#0b1120] flex items-center justify-center bg-gray-500 ${
                            i.sentiment === "Positive" ? "bg-emerald-500" : i.sentiment === "Negative" ? "bg-red-500" : "bg-blue-500"
                          }`} />
                          <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-3.5">
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xs font-bold text-white">{i.subject || "Client Meeting"}</span>
                              <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${sentimentColors[i.sentiment] || "bg-gray-800 text-gray-400"}`}>
                                {i.sentiment || "Neutral"}
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-0.5">{formatDate(i.interactionDate)} · {i.interactionType || "Email"}</p>
                            <p className="text-xs text-gray-300 mt-2 leading-relaxed">{i.notes}</p>
                            {i.actionItems && (
                              <div className="mt-2.5 pt-2 border-t border-[#1f2937]/45 text-[11px]">
                                <span className="font-semibold text-amber-400">Action items: </span>
                                <span className="text-gray-400">{i.actionItems}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {(!data.interactions || data.interactions.length === 0) && (
                      <p className="text-xs text-gray-500 text-center py-6">No previous interactions logged.</p>
                    )}
                  </div>
                )}

                {activeTab === "notes" && (
                  <div className="space-y-3">
                    {data.notes?.map((n) => (
                      <div key={n.id} className={`border rounded-xl p-4 bg-[#111827] border-[#1f2937] hover:border-gray-700 transition-colors`}>
                        <div className="flex items-start justify-between">
                          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                            <FileText size={12} className="text-blue-400" />
                            {n.title || "Note"}
                          </h4>
                          <span className="text-[9px] text-gray-600">{formatDate(n.createdAt)}</span>
                        </div>
                        <p className="text-xs text-gray-300 mt-2 leading-relaxed whitespace-pre-wrap">{n.content}</p>
                      </div>
                    ))}
                    {(!data.notes || data.notes.length === 0) && (
                      <p className="text-xs text-gray-500 text-center py-6">No advisor notes recorded.</p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
