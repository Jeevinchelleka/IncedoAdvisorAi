import { create } from "zustand";
import api from "@/lib/api";

const useAnalyticsStore = create((set) => ({
  monthlyTransactions: [],
  transactionsByType: [],
  holdings: [],
  portfolios: [],
  loading: false,
  error: null,

  fetchAnalytics: async () => {
    set({ loading: true, error: null });
    try {
      const [monthly, byType, holdings, portfolios] = await Promise.all([
        api.get("/transactions/stats/monthly"),
        api.get("/transactions/stats/by-type"),
        api.get("/holdings"),
        api.get("/portfolios"),
      ]);
      set({
        monthlyTransactions: monthly.data,
        transactionsByType: byType.data,
        holdings: holdings.data,
        portfolios: portfolios.data,
        loading: false,
      });
    } catch (error) {
      console.error(error);
      set({ loading: false, error: "Failed to load analytics" });
    }
  },
}));

export default useAnalyticsStore;
