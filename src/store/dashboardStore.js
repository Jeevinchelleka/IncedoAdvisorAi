import { create } from "zustand";
import api from "@/lib/api";

const useDashboardStore = create((set) => ({
  summary: null,
  allocation: [],
  performance: [],
  riskAlerts: [],
  topHoldings: [],
  marketTicker: [],
  recommendations: [],
  clientSegments: [],
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const [
        summary,
        allocation,
        performance,
        riskAlerts,
        topHoldings,
        marketTicker,
        recommendations,
        clientSegments
      ] = await Promise.all([
        api.get("/dashboard/summary"),
        api.get("/dashboard/allocation"),
        api.get("/dashboard/performance"),
        api.get("/dashboard/risk-alerts"),
        api.get("/dashboard/top-holdings"),
        api.get("/dashboard/market-ticker"),
        api.get("/dashboard/recommendations"),
        api.get("/dashboard/client-segments"),
      ]);
      set({
        summary: summary.data,
        allocation: allocation.data,
        performance: performance.data,
        riskAlerts: riskAlerts.data,
        topHoldings: topHoldings.data,
        marketTicker: marketTicker.data,
        recommendations: recommendations.data,
        clientSegments: clientSegments.data,
        loading: false,
      });
    } catch (e) {
      console.error(e);
      set({ loading: false, error: "Failed to load dashboard data" });
    }
  },
}));

export default useDashboardStore;
