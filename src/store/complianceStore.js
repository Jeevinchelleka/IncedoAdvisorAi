import { create } from "zustand";
import api from "@/lib/api";

const useComplianceStore = create((set) => ({
  alerts: [],
  stats: null,
  loading: false,
  error: null,

  fetchCompliance: async () => {
    set({ loading: true, error: null });
    try {
      const [alerts, stats] = await Promise.all([
        api.get("/compliance/alerts"),
        api.get("/compliance/stats"),
      ]);
      set({ alerts: alerts.data, stats: stats.data, loading: false });
    } catch (e) {
      console.error(e);
      set({ loading: false, error: "Failed to load compliance data" });
    }
  },
}));

export default useComplianceStore;
