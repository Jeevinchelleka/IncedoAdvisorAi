"use client";

import { useState } from "react";
import { Search, ChevronUp, ChevronDown, User } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";

const riskColors = {
  Conservative: "bg-emerald-500/15 text-emerald-400",
  Moderate: "bg-blue-500/15 text-blue-400",
  Aggressive: "bg-red-500/15 text-red-400",
  "Very Aggressive": "bg-orange-500/15 text-orange-400",
};

export default function ClientTable({ clients = [], loading = false, onSelectClient }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const filtered = clients
    .filter((c) => {
      const q = search.toLowerCase();
      return (
        !q ||
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.riskProfile?.toLowerCase().includes(q) ||
        c.investmentGoal?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  const SortIcon = ({ col }) =>
    sortKey === col ? (
      sortDir === "asc" ? <ChevronUp size={12} className="text-blue-400" /> : <ChevronDown size={12} className="text-blue-400" />
    ) : (
      <ChevronDown size={12} className="text-gray-600" />
    );

  const cols = [
    { key: "firstName", label: "Client" },
    { key: "riskProfile", label: "Risk Profile" },
    { key: "totalPortfolioValue", label: "Portfolio Value" },
    { key: "portfolioCount", label: "Portfolios" },
    { key: "netWorth", label: "Net Worth" },
    { key: "investmentGoal", label: "Goal" },
    { key: "createdAt", label: "Joined" },
  ];

  if (loading) {
    return (
      <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5">
        <div className="h-5 w-24 bg-gray-800 rounded animate-pulse mb-5" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-14 bg-gray-800/50 rounded-xl animate-pulse mb-2" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
        <div>
          <h2 className="text-sm font-semibold text-white">All Clients</h2>
          <p className="text-xs text-gray-500 mt-0.5">{clients.length} total clients</p>
        </div>
        <div className="flex items-center gap-2 bg-[#111827] border border-[#1f2937] rounded-xl px-3 py-2 w-64">
          <Search size={14} className="text-gray-500 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients..."
            className="bg-transparent outline-none text-sm text-gray-300 placeholder-gray-600 w-full"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500 text-sm">
          {search ? "No clients match your search" : "No clients found"}
        </div>
      ) : (
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1f2937]">
                {cols.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="pb-3 px-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-300 transition-colors whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      <SortIcon col={col.key} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((client) => {
                const riskClass = riskColors[client.riskProfile] || "bg-gray-500/15 text-gray-400";
                return (
                  <tr
                    key={client.id}
                    onClick={() => onSelectClient && onSelectClient(client.id)}
                    className="border-b border-[#111827] hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-600/20 flex items-center justify-center shrink-0">
                          <User size={14} className="text-blue-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">
                            {client.firstName} {client.lastName}
                          </p>
                          <p className="text-[11px] text-gray-500">{client.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-2">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${riskClass}`}>
                        {client.riskProfile}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 font-semibold text-white tabular-nums">
                      {formatCurrency(client.totalPortfolioValue, true)}
                    </td>
                    <td className="py-3.5 px-2 text-gray-300 tabular-nums">{client.portfolioCount}</td>
                    <td className="py-3.5 px-2 text-gray-400 tabular-nums">
                      {formatCurrency(client.netWorth, true)}
                    </td>
                    <td className="py-3.5 px-2 text-gray-400 max-w-[140px] truncate">{client.investmentGoal}</td>
                    <td className="py-3.5 px-2 text-gray-500 text-xs whitespace-nowrap">
                      {formatDate(client.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
