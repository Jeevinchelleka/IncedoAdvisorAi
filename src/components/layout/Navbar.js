"use client";

import { Bell, Search, ChevronDown, Shield, X, Wifi, WifiOff } from "lucide-react";
import { useState } from "react";
import useAuthStore from "@/store/authStore";
import { useRealtime } from "@/hooks/useRealtime";

const ROLE_COLORS = {
  admin:      "text-red-400",
  advisor:    "text-blue-400",
  compliance: "text-amber-400",
  operations: "text-purple-400",
};

const NOTIF_STYLES = {
  warning: "border-l-amber-400 bg-amber-500/5",
  error:   "border-l-red-400   bg-red-500/5",
  success: "border-l-emerald-400 bg-emerald-500/5",
  info:    "border-l-blue-400  bg-blue-500/5",
};

export default function Navbar() {
  const [searchFocused,  setSearchFocused]  = useState(false);
  const [showNotifs,     setShowNotifs]     = useState(false);
  const { user, role } = useAuthStore();
  const { notifications, connected, dismiss, dismissAll } = useRealtime();
  const roleColor  = ROLE_COLORS[role] || "text-gray-400";
  const unreadCount = notifications.length;

  return (
    <header className="h-16 border-b border-[#1f2937] bg-[#0b1120]/80 backdrop-blur-sm flex items-center justify-between px-6 shrink-0 sticky top-0 z-10">

      {/* Search */}
      <div className={`flex items-center gap-2.5 bg-[#111827] rounded-xl px-4 py-2.5 w-72 border transition-all ${
        searchFocused ? "border-blue-600/50 shadow-[0_0_0_3px_rgba(59,130,246,0.1)]" : "border-[#1f2937]"
      }`}>
        <Search size={15} className="text-gray-500 shrink-0" />
        <input
          placeholder="Search clients, portfolios..."
          className="bg-transparent outline-none text-sm text-gray-300 placeholder-gray-600 w-full"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>

      <div className="flex items-center gap-3">
        {/* Real-time connection indicator */}
        <div className="hidden sm:flex items-center gap-1.5">
          {connected
            ? <><Wifi size={11} className="text-emerald-400" /><span className="text-[10px] text-emerald-400">Live</span></>
            : <><WifiOff size={11} className="text-gray-600" /><span className="text-[10px] text-gray-600">Offline</span></>
          }
        </div>

        {/* Role badge */}
        {role && (
          <div className="hidden sm:flex items-center gap-1.5 bg-[#111827] border border-[#1f2937] rounded-xl px-3 py-1.5">
            <Shield size={12} className={roleColor} />
            <span className={`text-xs font-medium capitalize ${roleColor}`}>{role}</span>
          </div>
        )}

        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(v => !v)}
            className="relative w-9 h-9 rounded-xl bg-[#111827] border border-[#1f2937] flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition-all"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center px-1 ring-2 ring-[#0b1120]">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {showNotifs && (
            <div className="absolute right-0 top-11 w-80 bg-[#0f1929] border border-[#1f2937] rounded-2xl shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#1f2937]">
                <span className="text-xs font-semibold text-white">Notifications {unreadCount > 0 && `(${unreadCount})`}</span>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button onClick={dismissAll} className="text-[10px] text-gray-500 hover:text-white transition-colors">
                      Clear all
                    </button>
                  )}
                  <button onClick={() => setShowNotifs(false)}>
                    <X size={13} className="text-gray-500 hover:text-white" />
                  </button>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-8">No notifications</p>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={`flex items-start gap-3 px-4 py-3 border-b border-[#1f2937] border-l-2 ${NOTIF_STYLES[n.type] || NOTIF_STYLES.info}`}>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white">{n.title}</p>
                        {n.body && <p className="text-[11px] text-gray-400 mt-0.5 truncate">{n.body}</p>}
                        <p className="text-[10px] text-gray-600 mt-1">
                          {n.timestamp ? new Date(n.timestamp).toLocaleTimeString() : ""}
                        </p>
                      </div>
                      <button onClick={() => dismiss(n.id)} className="shrink-0 text-gray-600 hover:text-white mt-0.5">
                        <X size={11} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User */}
        <button className="flex items-center gap-2.5 bg-[#111827] border border-[#1f2937] rounded-xl px-3 py-2 hover:border-gray-600 transition-all">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-xs font-bold text-white">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-white leading-none">{user?.name || "User"}</p>
            <p className={`text-[10px] mt-0.5 capitalize ${roleColor}`}>{role}</p>
          </div>
          <ChevronDown size={13} className="text-gray-500" />
        </button>
      </div>
    </header>
  );
}
