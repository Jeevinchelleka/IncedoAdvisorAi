import { create } from "zustand";
import api from "@/lib/api";

const usePortfolioStore = create((set) => ({
  portfolios: [],
  loading: false,
  error: null,

  fetchPortfolios: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/portfolios");
      set({ portfolios: res.data, loading: false });
    } catch (error) {
      console.error(error);
      set({ loading: false, error: "Failed to load portfolios" });
    }
  },
}));

export default usePortfolioStore;
