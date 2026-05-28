import { create } from "zustand";
import api from "@/lib/api";

const useAuthStore = create((set, get) => ({
  user: null,
  permissions: {},
  role: null,
  loading: true,
  initialized: false,

  // Load user from token on app start
  init: async () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) {
      set({ loading: false, initialized: true });
      return;
    }
    try {
      const [meRes, permRes] = await Promise.all([
        api.get("/auth/me"),
        api.get("/auth/permissions"),
      ]);
      set({
        user: meRes.data,
        role: meRes.data.role,
        permissions: permRes.data.permissions,
        loading: false,
        initialized: true,
      });
    } catch {
      localStorage.removeItem("token");
      set({ user: null, role: null, permissions: {}, loading: false, initialized: true });
    }
  },

  login: (user, token, permissions) => {
    localStorage.setItem("token", token);
    set({ user, role: user.role, permissions, loading: false, initialized: true });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, role: null, permissions: {}, initialized: true });
    window.location.href = "/login";
  },

  // Check if current role can perform action on resource
  can: (resource, action = "read") => {
    const { permissions } = get();
    return permissions[resource]?.includes(action) ?? false;
  },
}));

export default useAuthStore;
