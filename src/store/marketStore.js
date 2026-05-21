import { create } from "zustand";
import api from "@/lib/api";

const useMarketStore = create((set) => ({
  marketData: [],
  researchReports: [],
  loading: false,

  fetchMarket: async () => {
    set({ loading: true });
    try {
      const [market, research] = await Promise.all([
        api.get("/market"),
        api.get("/research"),
      ]);
      set({ marketData: market.data, researchReports: research.data, loading: false });
    } catch (e) {
      console.error(e);
      set({ loading: false });
    }
  },
}));

export default useMarketStore;
