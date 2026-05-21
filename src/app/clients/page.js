"use client";

import { useEffect } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import ClientTable from "@/components/clients/ClientTable";
import AllocationChart from "@/components/charts/AllocationChart";
import KpiCard from "@/components/dashboard/KpiCard";
import AIAssistantPanel from "@/components/ai/AIAssistantPanel";
import useClientStore from "@/store/clientStore";
import { formatCurrency } from "@/lib/format";
import { Users, TrendingUp, DollarSign, ShieldCheck } from "lucide-react";

export default function ClientsPage() {
  const { clients, riskDistribution, loading, fetchClients } = useClientStore();

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const totalAUM = clients.reduce((s, c) => s + (c.totalPortfolioValue || 0), 0);
  const avgNetWorth = clients.length
    ? clients.reduce((s, c) => s + (c.netWorth || 0), 0) / clients.length
    : 0;

  return (
    <DashboardShell rightPanel={<AIAssistantPanel />}>
      <div className="space-y-5 max-w-[1400px]">
        <div>
          <h1 className="text-2xl font-bold text-white">Client Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage and monitor your client relationships</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Total Clients"
            value={loading ? "—" : clients.length.toString()}
            icon={Users}
            color="blue"
            loading={loading}
          />
          <KpiCard
            title="Total Client AUM"
            value={loading ? "—" : formatCurrency(totalAUM, true)}
            icon={TrendingUp}
            color="green"
            loading={loading}
          />
          <KpiCard
            title="Avg Net Worth"
            value={loading ? "—" : formatCurrency(avgNetWorth, true)}
            icon={DollarSign}
            color="purple"
            loading={loading}
          />
          <KpiCard
            title="Risk Profiles"
            value={loading ? "—" : riskDistribution.length.toString()}
            icon={ShieldCheck}
            color="amber"
            loading={loading}
          />
        </div>

        {/* Risk Distribution + Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <ClientTable clients={clients} loading={loading} />
          </div>
          <div>
            <AllocationChart
              data={riskDistribution.map((d) => ({ name: d.name, value: d.value }))}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
