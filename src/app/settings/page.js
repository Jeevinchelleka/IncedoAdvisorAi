"use client";

import DashboardShell from "@/components/layout/DashboardShell";
import { User, Bell, Shield, Database, Palette, Key } from "lucide-react";

const sections = [
  {
    icon: User,
    title: "Profile",
    desc: "Manage your advisor profile and personal information",
    color: "blue",
    fields: [
      { label: "Full Name", placeholder: "Your name", type: "text" },
      { label: "Email", placeholder: "your@email.com", type: "email" },
      { label: "Phone", placeholder: "+1 (555) 000-0000", type: "tel" },
    ],
  },
  {
    icon: Bell,
    title: "Notifications",
    desc: "Configure alert preferences and notification channels",
    color: "amber",
    toggles: [
      { label: "Risk Alerts", desc: "Get notified when holdings exceed concentration limits" },
      { label: "Portfolio Updates", desc: "Daily portfolio performance summaries" },
      { label: "Client Activity", desc: "Alerts for significant client portfolio changes" },
    ],
  },
  {
    icon: Shield,
    title: "Security",
    desc: "Password and authentication settings",
    color: "green",
    fields: [
      { label: "Current Password", placeholder: "••••••••", type: "password" },
      { label: "New Password", placeholder: "••••••••", type: "password" },
    ],
  },
];

const colorMap = {
  blue: "bg-blue-600/10 border-blue-600/20 text-blue-400",
  amber: "bg-amber-600/10 border-amber-600/20 text-amber-400",
  green: "bg-emerald-600/10 border-emerald-600/20 text-emerald-400",
  purple: "bg-purple-600/10 border-purple-600/20 text-purple-400",
};

export default function SettingsPage() {
  return (
    <DashboardShell>
      <div className="max-w-2xl space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your account and application preferences</p>
        </div>

        {sections.map((section, i) => {
          const Icon = section.icon;
          return (
            <div key={i} className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${colorMap[section.color]}`}>
                  <Icon size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">{section.title}</h2>
                  <p className="text-xs text-gray-500">{section.desc}</p>
                </div>
              </div>

              {section.fields && (
                <div className="space-y-3">
                  {section.fields.map((f, j) => (
                    <div key={j}>
                      <label className="text-xs font-medium text-gray-400 block mb-1.5">{f.label}</label>
                      <input
                        type={f.type}
                        placeholder={f.placeholder}
                        className="w-full bg-[#111827] border border-[#1f2937] rounded-xl px-4 py-2.5 text-sm text-gray-300 placeholder-gray-600 outline-none focus:border-blue-600/50 focus:ring-2 focus:ring-blue-600/10 transition-all"
                      />
                    </div>
                  ))}
                  <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all">
                    Save Changes
                  </button>
                </div>
              )}

              {section.toggles && (
                <div className="space-y-3">
                  {section.toggles.map((t, j) => (
                    <div key={j} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium text-white">{t.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
                      </div>
                      <button className="w-10 h-5 bg-blue-600 rounded-full relative transition-all">
                        <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </DashboardShell>
  );
}
