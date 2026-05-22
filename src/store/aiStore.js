import { create } from "zustand";
import api from "@/lib/api";

const useAIStore = create((set, get) => ({
  bookSummary: null,
  riskAnalysis: null,
  portfolioInsights: null,
  complianceCheck: null,
  revenueOpportunities: null,
  loading: {},
  error: null,

  fetchBookSummary: async () => {
    set((s) => ({ loading: { ...s.loading, bookSummary: true } }));
    try {
      const res = await api.get("/ai/book-summary");
      set((s) => ({ bookSummary: res.data, loading: { ...s.loading, bookSummary: false } }));
    } catch (e) {
      console.error(e);
      set((s) => ({ loading: { ...s.loading, bookSummary: false } }));
    }
  },

  fetchRiskAnalysis: async () => {
    set((s) => ({ loading: { ...s.loading, riskAnalysis: true } }));
    try {
      const res = await api.get("/ai/risk-analysis");
      set((s) => ({ riskAnalysis: res.data, loading: { ...s.loading, riskAnalysis: false } }));
    } catch (e) {
      console.error(e);
      set((s) => ({ loading: { ...s.loading, riskAnalysis: false } }));
    }
  },

  fetchPortfolioInsights: async () => {
    set((s) => ({ loading: { ...s.loading, portfolioInsights: true } }));
    try {
      const res = await api.get("/ai/portfolio-insights");
      set((s) => ({ portfolioInsights: res.data, loading: { ...s.loading, portfolioInsights: false } }));
    } catch (e) {
      console.error(e);
      set((s) => ({ loading: { ...s.loading, portfolioInsights: false } }));
    }
  },

  fetchComplianceCheck: async () => {
    set((s) => ({ loading: { ...s.loading, complianceCheck: true } }));
    try {
      const res = await api.get("/ai/compliance-check");
      set((s) => ({ complianceCheck: res.data, loading: { ...s.loading, complianceCheck: false } }));
    } catch (e) {
      console.error(e);
      set((s) => ({ loading: { ...s.loading, complianceCheck: false } }));
    }
  },

  fetchRevenueOpportunities: async () => {
    set((s) => ({ loading: { ...s.loading, revenueOpportunities: true } }));
    try {
      const res = await api.get("/ai/revenue-opportunities");
      set((s) => ({ revenueOpportunities: res.data, loading: { ...s.loading, revenueOpportunities: false } }));
    } catch (e) {
      console.error(e);
      set((s) => ({ loading: { ...s.loading, revenueOpportunities: false } }));
    }
  },
}));

export default useAIStore;
