"use client";

import { useEffect } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import KpiCard from "@/components/dashboard/KpiCard";
import PerformanceChart from "@/components/charts/PerformanceChart";
import AllocationChart from "@/components/charts/AllocationChart";
import RiskAlerts from "@/components/dashboard/RiskAlerts";
import AIAssistantPanel from "@/components/ai/AIAssistantPanel";
import HoldingsTable from "@/components/dashboard/HoldingsTable";
import MarketTicker from "@/components/dashboard/MarketTicker";
import RecommendationsPanel from "@/components/dashboard/RecommendationsPanel";
import useDashboardStore from "@/store/dashboardStore";
import { formatCurrency, formatNumber, formatPct } from "@/lib/format";
import {
  Users, Briefcase, ArrowLeftRight, TrendingUp,
  ShieldAlert, BarChart2, Activity,
} from "lucide-react";

export default function DashboardPage() {
  const {
    summary, allocation, performance, riskAlerts,
    topHoldings, marketTicker, recommendations, clientSegments, loading, fetchAll,
  } = useDashboardStore();

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return (
    <DashboardShell rightPanel={<AIAssistantPanel />}>
      <div className="space-y-4 max-w-[1400px]">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Dashboard</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-1.5 animate-pulse">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            <span className="text-xs font-medium text-emerald-400">Live</span>
          </div>
        </div>

        {/* Market Ticker */}
        <MarketTicker data={marketTicker} />

        {/* KPI Cards — 6 cards from real data */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          <KpiCard
            title="Total Clients"
            value={loading ? "—" : formatNumber(summary?.totalClients)}
            icon={Users} color="blue" loading={loading}
          />
          <KpiCard
            title="Total AUM"
            value={loading ? "—" : formatCurrency(summary?.totalAssets, true)}
            icon={TrendingUp} color="green" loading={loading}
          />
          <KpiCard
            title="Portfolios"
            value={loading ? "—" : formatNumber(summary?.totalPortfolios)}
            icon={Briefcase} color="purple" loading={loading}
          />
          <KpiCard
            title="Transactions"
            value={loading ? "—" : formatNumber(summary?.totalTransactions)}
            icon={ArrowLeftRight} color="blue" loading={loading}
          />
          <KpiCard
            title="Avg Risk Score"
            value={loading ? "—" : `${summary?.avgRiskScore ?? "—"}/10`}
            icon={BarChart2} color="amber" loading={loading}
          />
          <KpiCard
            title="Open Alerts"
            value={loading ? "—" : formatNumber(summary?.openAlerts)}
            icon={ShieldAlert} color="amber" loading={loading}
          />
        </div>

        {/* Performance + Allocation + Client Segments */}
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div className="lg:col-span-2 xl:col-span-2">
            <PerformanceChart data={performance} loading={loading} />
          </div>
          <div>
            <AllocationChart data={allocation} loading={loading} />
          </div>
          <div>
            <AllocationChart
              title="Client Segments"
              subtitle="AUM by client risk profile"
              data={clientSegments.map(s => ({ name: s.name, value: s.aum }))}
              valueType="currency"
              loading={loading}
            />
          </div>
        </div>

        {/* Holdings + Risk Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <HoldingsTable holdings={topHoldings} loading={loading} />
          </div>
          <RiskAlerts alerts={riskAlerts} loading={loading} />
        </div>

        {/* AI Recommendations */}
        <RecommendationsPanel recommendations={recommendations} loading={loading} />

      </div>
    </DashboardShell>
  );
}
