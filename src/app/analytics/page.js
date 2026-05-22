"use client";

import { useEffect } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import KpiCard from "@/components/dashboard/KpiCard";
import ProfitLossChart from "@/components/analytics/ProfitLossChart";
import ExposureChart from "@/components/analytics/ExposureChart";
import RiskHeatmap from "@/components/analytics/RiskHeatmap";
import HoldingsPnLChart from "@/components/analytics/HoldingsPnLChart";
import PortfolioPerformanceChart from "@/components/analytics/PortfolioPerformanceChart";
import AllocationChart from "@/components/charts/AllocationChart";
import AIAssistantPanel from "@/components/ai/AIAssistantPanel";
import ScenarioSimulation from "@/components/analytics/ScenarioSimulation";
import useAnalyticsStore from "@/store/analyticsStore";
import useDashboardStore from "@/store/dashboardStore";
import useMarketStore from "@/store/marketStore";
import { formatCurrency, formatNumber, formatDate, formatPct } from "@/lib/format";
import { BarChart2, ArrowLeftRight, TrendingUp, TrendingDown, BookOpen, Activity } from "lucide-react";

export default function AnalyticsPage() {
  const { monthlyTransactions, transactionsByType, holdings, portfolios, loading: aLoading, fetchAnalytics } = useAnalyticsStore();
  const { allocation, loading: dLoading, fetchAll } = useDashboardStore();
  const { marketData, researchReports, loading: mLoading, fetchMarket } = useMarketStore();

  useEffect(() => {
    fetchAnalytics();
    fetchAll();
    fetchMarket();
  }, [fetchAnalytics, fetchAll, fetchMarket]);

  const loading = aLoading || dLoading;

  const totalBuyVol  = monthlyTransactions.reduce((s, m) => s + (m.buy  || 0), 0);
  const totalSellVol = monthlyTransactions.reduce((s, m) => s + (m.sell || 0), 0);
  const totalTxCount = monthlyTransactions.reduce((s, m) => s + (m.count || 0), 0);
  const uniqueSymbols = [...new Set(holdings.map(h => h.symbol))].length;

  // Best and worst holding by P&L
  const holdingsWithPnl = holdings
    .filter(h => h.purchasePrice > 0)
    .map(h => ({ ...h, pnl: ((h.currentPrice - h.purchasePrice) / h.purchasePrice) * 100 }));
  const bestHolding  = holdingsWithPnl.sort((a, b) => b.pnl - a.pnl)[0];
  const worstHolding = holdingsWithPnl.sort((a, b) => a.pnl - b.pnl)[0];

  return (
    <DashboardShell rightPanel={<AIAssistantPanel />}>
      <div className="space-y-5 max-w-[1400px]">
        <div>
          <h1 className="text-xl font-bold text-white">Analytics</h1>
          <p className="text-xs text-gray-500 mt-0.5">Portfolio, transaction, and market intelligence</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard title="Buy Volume"     value={loading ? "—" : formatCurrency(totalBuyVol, true)}  icon={TrendingUp}    color="green"  loading={loading} />
          <KpiCard title="Sell Volume"    value={loading ? "—" : formatCurrency(totalSellVol, true)} icon={TrendingDown}  color="amber"  loading={loading} />
          <KpiCard title="Transactions"   value={loading ? "—" : formatNumber(totalTxCount)}         icon={ArrowLeftRight} color="blue"  loading={loading} />
          <KpiCard title="Unique Symbols" value={loading ? "—" : uniqueSymbols.toString()}           icon={BarChart2}     color="purple" loading={loading} />
        </div>

        {/* Best/Worst holding callouts */}
        {!loading && (bestHolding || worstHolding) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bestHolding && (
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Best Performer</p>
                  <p className="text-sm font-bold text-white mt-0.5">{bestHolding.symbol} <span className="text-xs text-gray-400">({bestHolding.assetType})</span></p>
                  <p className="text-xs text-gray-400 mt-0.5">${bestHolding.purchasePrice} → ${bestHolding.currentPrice}</p>
                </div>
                <p className="text-2xl font-bold text-emerald-400 font-mono">+{bestHolding.pnl.toFixed(1)}%</p>
              </div>
            )}
            {worstHolding && worstHolding.symbol !== bestHolding?.symbol && (
              <div className="bg-red-500/5 border border-red-500/20 rounded-2xl px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Worst Performer</p>
                  <p className="text-sm font-bold text-white mt-0.5">{worstHolding.symbol} <span className="text-xs text-gray-400">({worstHolding.assetType})</span></p>
                  <p className="text-xs text-gray-400 mt-0.5">${worstHolding.purchasePrice} → ${worstHolding.currentPrice}</p>
                </div>
                <p className="text-2xl font-bold text-red-400 font-mono">{worstHolding.pnl.toFixed(1)}%</p>
              </div>
            )}
          </div>
        )}

        {/* Interactive Stress Test Simulator */}
        <ScenarioSimulation holdings={holdings} loading={loading} />

        {/* Holdings P&L + Portfolio Values */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <HoldingsPnLChart holdings={holdings} loading={loading} />
          <PortfolioPerformanceChart portfolios={portfolios} loading={loading} />
        </div>

        {/* Transaction Volume + Exposure */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ProfitLossChart data={monthlyTransactions} loading={loading} />
          <ExposureChart data={allocation} loading={loading} />
        </div>

        {/* Risk Heatmap + Allocation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <RiskHeatmap portfolios={portfolios} loading={loading} />
          </div>
          <AllocationChart data={allocation} loading={loading} />
        </div>

        {/* Market Data */}
        {marketData.length > 0 && (
          <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={14} className="text-blue-400" />
              <h2 className="text-sm font-semibold text-white">Live Market Data</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1f2937]">
                    {["Symbol", "Price", "Daily Change", "Volume", "Updated"].map(h => (
                      <th key={h} className="pb-3 px-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {marketData.map((m, i) => {
                    const isPos = (m.dailyChange || 0) >= 0;
                    return (
                      <tr key={i} className="border-b border-[#111827] hover:bg-white/[0.02]">
                        <td className="py-3 px-2 font-bold text-white">{m.symbol}</td>
                        <td className="py-3 px-2 text-white tabular-nums">${Number(m.currentPrice).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                        <td className={`py-3 px-2 font-medium tabular-nums ${isPos ? "text-emerald-400" : "text-red-400"}`}>
                          {isPos ? "+" : ""}{Number(m.dailyChange).toFixed(2)}%
                        </td>
                        <td className="py-3 px-2 text-gray-400 tabular-nums">{formatNumber(m.volume)}</td>
                        <td className="py-3 px-2 text-gray-500 text-xs">{formatDate(m.updatedAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Transaction type breakdown */}
        {transactionsByType.length > 0 && (
          <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4">Transaction Breakdown by Type</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {transactionsByType.map((t, i) => (
                <div key={i} className="bg-[#111827] border border-[#1f2937] rounded-xl p-4">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">{t.name}</p>
                  <p className="text-xl font-bold text-white mt-1">{formatNumber(t.count)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatCurrency(t.volume, true)} volume</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Research Reports */}
        {researchReports.length > 0 && (
          <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={14} className="text-blue-400" />
              <h2 className="text-sm font-semibold text-white">Research Reports</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {researchReports.map((r, i) => (
                <div key={i} className="bg-[#111827] border border-[#1f2937] rounded-xl p-4 hover:border-gray-600 transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-white">{r.title}</p>
                    {r.category && (
                      <span className="text-[10px] bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded-full shrink-0">{r.category}</span>
                    )}
                  </div>
                  {r.content && <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">{r.content}</p>}
                  <p className="text-[10px] text-gray-600 mt-2">{formatDate(r.uploadedAt)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
