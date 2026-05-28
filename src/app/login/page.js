"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { TrendingUp, Eye, EyeOff, AlertCircle, Shield } from "lucide-react";
import useAuthStore from "@/store/authStore";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Demo accounts shown on login page
const DEMO_ACCOUNTS = [
  { email: "john.advisor@test.com",     password: "password123", role: "advisor",    label: "Advisor" },
  { email: "sarah.compliance@test.com", password: "password123", role: "compliance", label: "Compliance" },
  { email: "mike.ops@test.com",         password: "password123", role: "operations", label: "Operations" },
  { email: "olivia.admin@test.com",     password: "password123", role: "admin",      label: "Admin" },
];

const ROLE_COLORS = {
  advisor:    "border-blue-600/30 text-blue-400 bg-blue-600/5 hover:bg-blue-600/10",
  compliance: "border-amber-600/30 text-amber-400 bg-amber-600/5 hover:bg-amber-600/10",
  operations: "border-purple-600/30 text-purple-400 bg-purple-600/5 hover:bg-purple-600/10",
  admin:      "border-red-600/30 text-red-400 bg-red-600/5 hover:bg-red-600/10",
};

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  const handleLogin = async (e, overrideEmail, overridePassword) => {
    e?.preventDefault();
    const loginEmail    = overrideEmail    || email;
    const loginPassword = overridePassword || password;

    if (!loginEmail || !loginPassword) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      // Login
      const loginRes = await axios.post(`${API}/auth/login`, { email: loginEmail, password: loginPassword });
      const { token, user: userData } = loginRes.data;

      // Fetch permissions with the new token
      const permRes = await axios.get(`${API}/auth/permissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      login(userData, token, permRes.data.permissions);
      router.push("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.error || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050816] px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
            <TrendingUp size={20} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">AdvisorAI</span>
        </div>

        {/* Card */}
        <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-7 shadow-2xl">
          <h1 className="text-xl font-bold text-white">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your advisor dashboard</p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-400 block mb-1.5">Email</label>
              <input
                type="email"
                placeholder="advisor@firm.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#111827] border border-[#1f2937] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-600/50 focus:ring-2 focus:ring-blue-600/10 transition-all"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-400 block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#111827] border border-[#1f2937] rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-600/50 focus:ring-2 focus:ring-blue-600/10 transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">
                <AlertCircle size={14} className="text-red-400 shrink-0" />
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>
        </div>

        {/* Demo accounts */}
        <div className="mt-4 bg-[#0b1120] border border-[#1f2937] rounded-2xl p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <Shield size={12} className="text-gray-500" />
            <p className="text-[11px] text-gray-500 font-medium">Demo accounts — click to sign in</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.role}
                onClick={() => handleLogin(null, acc.email, acc.password)}
                disabled={loading}
                className={`text-left px-3 py-2 rounded-xl border text-xs font-medium transition-all disabled:opacity-50 ${ROLE_COLORS[acc.role]}`}
              >
                <p className="font-semibold">{acc.label}</p>
                <p className="text-[10px] opacity-70 mt-0.5 truncate">{acc.email}</p>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-4">
          AdvisorAI · Role-Based Access Control · Zero-Trust Security
        </p>
      </div>
    </div>
  );
}
