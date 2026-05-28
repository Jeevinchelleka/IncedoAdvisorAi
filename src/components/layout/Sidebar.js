"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Briefcase, ShieldAlert,
  Bot, BarChart3, Settings, TrendingUp, LogOut, ClipboardList,
} from "lucide-react";
import useAuthStore from "@/store/authStore";

const NAV_ITEMS = [
  { label: "Dashboard",    href: "/dashboard",    icon: LayoutDashboard, resource: "dashboard" },
  { label: "Clients",      href: "/clients",      icon: Users,           resource: "clients" },
  { label: "Portfolios",   href: "/portfolios",   icon: Briefcase,       resource: "portfolios" },
  { label: "Analytics",    href: "/analytics",    icon: BarChart3,       resource: "analytics" },
  { label: "Compliance",   href: "/compliance",   icon: ShieldAlert,     resource: "compliance_alerts" },
  { label: "AI Assistant", href: "/ai-assistant", icon: Bot,             resource: "ai" },
];

const BOTTOM_ITEMS = [
  { label: "Audit Logs",   href: "/audit",        icon: ClipboardList,   roles: ["admin", "compliance"] },
  { label: "Settings",     href: "/settings",     icon: Settings,        resource: null },
];

const ROLE_CONFIG = {
  admin:      { label: "Admin",      color: "bg-red-500/20 text-red-400 border-red-500/30" },
  advisor:    { label: "Advisor",    color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  compliance: { label: "Compliance", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  operations: { label: "Operations", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
};

export default function Sidebar() {
  const pathname = usePathname();
  const { user, role, can, logout } = useAuthStore();
  const roleCfg = ROLE_CONFIG[role] || ROLE_CONFIG.advisor;

  const isVisible = (item) => {
    if (item.roles) return item.roles.includes(role);
    if (item.resource) return can(item.resource, "read");
    return true;
  };

  return (
    <div className="w-64 bg-[#0b1120] border-r border-[#1f2937] flex flex-col shrink-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-[#1f2937]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <TrendingUp size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">AdvisorAI</span>
        </div>
      </div>

      {/* User info + role badge */}
      {user && (
        <div className="px-4 py-3 border-b border-[#1f2937]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-600/20 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-blue-400">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${roleCfg.color}`}>
                {roleCfg.label}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-3 pt-2 pb-1">
          Navigation
        </p>
        {NAV_ITEMS.filter(isVisible).map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-blue-600/15 text-blue-400 border border-blue-600/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={17} className={active ? "text-blue-400" : ""} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-[#1f2937] space-y-0.5">
        {BOTTOM_ITEMS.filter(isVisible).map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active ? "bg-blue-600/15 text-blue-400" : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
