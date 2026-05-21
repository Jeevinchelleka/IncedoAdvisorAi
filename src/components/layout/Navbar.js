"use client";

import { Bell, Search, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="h-16 border-b border-[#1f2937] bg-[#0b1120]/80 backdrop-blur-sm flex items-center justify-between px-6 shrink-0 sticky top-0 z-10">
      {/* Search */}
      <div
        className={`flex items-center gap-2.5 bg-[#111827] rounded-xl px-4 py-2.5 w-72 border transition-all ${
          searchFocused ? "border-blue-600/50 shadow-[0_0_0_3px_rgba(59,130,246,0.1)]" : "border-[#1f2937]"
        }`}
      >
        <Search size={15} className="text-gray-500 shrink-0" />
        <input
          placeholder="Search clients, portfolios..."
          className="bg-transparent outline-none text-sm text-gray-300 placeholder-gray-600 w-full"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl bg-[#111827] border border-[#1f2937] flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition-all">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-[#0b1120]" />
        </button>

        {/* User */}
        <button className="flex items-center gap-2.5 bg-[#111827] border border-[#1f2937] rounded-xl px-3 py-2 hover:border-gray-600 transition-all">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-xs font-bold text-white">
            A
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-white leading-none">Advisor</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Admin</p>
          </div>
          <ChevronDown size={13} className="text-gray-500" />
        </button>
      </div>
    </header>
  );
}
