"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import AIAssistantPanel from "@/components/ai/AIAssistantPanel";
import { Bot, Sparkles, Database, Brain, MessageSquare, Clock } from "lucide-react";
import api from "@/lib/api";
import { formatDate } from "@/lib/format";

const features = [
  { icon: Database, title: "Live Data Access", desc: "Queries clients, portfolios, holdings, transactions, compliance alerts, and market data in real time.", color: "blue" },
  { icon: Brain,    title: "Context-Aware",    desc: "Understands your portfolio context and provides personalized financial insights.", color: "purple" },
  { icon: Sparkles, title: "AI-Powered",       desc: "Powered by Gemini / OpenAI with retrieval-augmented generation for accurate answers.", color: "amber" },
];

const colorMap = {
  blue:   "bg-blue-600/10 border-blue-600/20 text-blue-400",
  purple: "bg-purple-600/10 border-purple-600/20 text-purple-400",
  amber:  "bg-amber-600/10 border-amber-600/20 text-amber-400",
};

const suggestions = [
  "What is the total AUM across all portfolios?",
  "Which clients have the highest risk profile?",
  "Show me the top holdings by allocation",
  "Are there any open compliance alerts?",
  "What AI recommendations exist for clients?",
  "List recent transactions",
  "Which symbols are in the market data?",
  "Show me research reports",
];

export default function AIAssistantPage() {
  const [conversations, setConversations] = useState([]);
  const [loadingConvs, setLoadingConvs] = useState(true);

  useEffect(() => {
    api.get("/conversations")
      .then((r) => setConversations(r.data || []))
      .catch(() => {})
      .finally(() => setLoadingConvs(false));
  }, []);

  return (
    <DashboardShell>
      <div className="max-w-[1400px] space-y-5">
        <div>
          <h1 className="text-xl font-bold text-white">AI Assistant</h1>
          <p className="text-xs text-gray-500 mt-0.5">Ask anything about your clients, portfolios, and market data</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main chat */}
          <div className="lg:col-span-2 bg-[#0b1120] border border-[#1f2937] rounded-2xl overflow-hidden" style={{ minHeight: "580px" }}>
            <AIAssistantPanel />
          </div>

          {/* Info panel */}
          <div className="space-y-4">
            {/* Capabilities */}
            <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Bot size={14} className="text-blue-400" />
                <h2 className="text-sm font-semibold text-white">Capabilities</h2>
              </div>
              <div className="space-y-3">
                {features.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${colorMap[f.color]}`}>
                        <Icon size={13} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">{f.title}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Suggested prompts */}
            <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-white mb-3">Suggested Questions</h2>
              <div className="space-y-1.5">
                {suggestions.map((s, i) => (
                  <div key={i} className="text-xs text-gray-400 bg-[#111827] border border-[#1f2937] rounded-xl px-3 py-2 hover:border-blue-600/30 hover:text-gray-200 cursor-pointer transition-all">
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* Past conversations */}
            <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare size={13} className="text-gray-400" />
                <h2 className="text-sm font-semibold text-white">Past Conversations</h2>
              </div>
              {loadingConvs ? (
                [1,2,3].map(i => <div key={i} className="h-10 bg-gray-800/40 rounded-xl animate-pulse mb-2" />)
              ) : conversations.length === 0 ? (
                <p className="text-xs text-gray-500">No conversations yet</p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {conversations.map((c, i) => (
                    <div key={i} className="bg-[#111827] border border-[#1f2937] rounded-xl px-3 py-2">
                      <p className="text-xs font-medium text-white truncate">{c.title || "Untitled"}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Clock size={10} className="text-gray-600" />
                        <span className="text-[10px] text-gray-600">{formatDate(c.createdAt)}</span>
                        <span className="text-[10px] text-gray-600">· {c.messages?.length || 0} messages</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
