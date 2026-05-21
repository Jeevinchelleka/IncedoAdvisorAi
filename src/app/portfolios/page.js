"use client";

import { useEffect } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import PortfolioCard from "@/components/portfolios/PortfolioCard";
import AllocationChart from "@/components/charts/AllocationChart";
import HoldingsTable from "@/components/dashboard/HoldingsTable";
import KpiCard from "@/components/dashboard/KpiCard";
import AIAssistantPanel from "@/components/ai/AIAssistantPanel";
import usePortfolioStore from "@/store/portfolioStore";
import useDashboardStore from "@/store/dashboardStore";
import { formatCurrency } from "@/lib/format";
import { Briefcase, TrendingUp, BarChart2, Layers } from "lucide-react";

export default function PortfoliosPage() {
  const { portfolios, loading: pLoading, fetchPortfolios } = usePortfolioStore();
  const { allocation, topHoldings, loading: dLoading, fetchAll } = useDashboardStore();

  useEffect(() => {
    fetchPortfolios();
    fetchAll();
  }, [fetchPortfolios, fetchAll]);

  const loading = pLoading || dLoading;
  const totalValue = portfolios.reduce((s, p) => s + (p.totalValue || 0), 0);
  const avgRisk = portfolios.length
    ? portfolios.reduce((s, p) => s + (p.riskScore || 0), 0) / portfolios.length
    : 0;
  const avgPerf = portfolios.length
    ? portfolios.reduce((s, p) => s + (p.performanceScore || 0), 0) / portfolios.length
    : 0;

  return (
    <DashboardShell rightPanel={<AIAssistantPanel />}>
      <div className="space-y-5 max-w-[1400px]">
        <div>
          <h1 className="text-2xl font-bold text-white">Portfolio Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Monitor and analyze all client portfolios</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Total Portfolios"
            value={loading ? "—" : portfolios.length.toString()}
            icon={Briefcase}
            color="blue"
            loading={loading}
          />
          <KpiCard
            title="Total AUM"
            value={loading ? "—" : formatCurrency(totalValue, true)}
            icon={TrendingUp}
            color="green"
            loading={loading}
          />
          <KpiCard
            title="Avg Risk Score"
            value={loading ? "—" : avgRisk.toFixed(1)}
            icon={BarChart2}
            color="amber"
            loading={loading}
          />
          <KpiCard
            title="Avg Performance"
            value={loading ? "—" : `${avgPerf.toFixed(1)}%`}
            icon={Layers}
            color="purple"
            loading={loading}
          />
        </div>

        {/* Portfolio list + Allocation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-sm font-semibold text-white px-1">All Portfolios</h2>
            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-[#0b1120] border border-[#1f2937] rounded-2xl animate-pulse" />
              ))
            ) : portfolios.length === 0 ? (
              <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-8 text-center text-gray-500 text-sm">
                No portfolios found
              </div>
            ) : (
              portfolios.map((p) => <PortfolioCard key={p.id} portfolio={p} />)
            )}
          </div>
          <div>
            <AllocationChart data={allocation} loading={loading} />
          </div>
        </div>

        {/* Holdings */}
        <HoldingsTable holdings={topHoldings} loading={loading} />
      </div>
    </DashboardShell>
  );
}
