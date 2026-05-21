"use client";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardShell({ children, rightPanel }) {
  return (
    <div className="h-screen bg-[#050816] text-white flex overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar />

        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6 min-w-0">{children}</main>

          {rightPanel && (
            <aside className="w-[360px] shrink-0 border-l border-[#1f2937] bg-[#0b1120] hidden xl:flex xl:flex-col overflow-hidden">
              {rightPanel}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
