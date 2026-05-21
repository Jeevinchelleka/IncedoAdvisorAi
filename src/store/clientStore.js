import { create } from "zustand";
import api from "@/lib/api";

const useClientStore = create((set) => ({
  clients: [],
  riskDistribution: [],
  loading: false,
  error: null,

  fetchClients: async () => {
    set({ loading: true, error: null });
    try {
      const [clients, riskDist] = await Promise.all([
        api.get("/clients"),
        api.get("/clients/stats/risk-distribution"),
      ]);
      set({ clients: clients.data, riskDistribution: riskDist.data, loading: false });
    } catch (error) {
      console.error(error);
      set({ loading: false, error: "Failed to load clients" });
    }
  },
}));

export default useClientStore;
