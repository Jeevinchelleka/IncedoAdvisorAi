"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  Send, Bot, User, Loader2, Sparkles, Plus,
  Database, ChevronRight, History, X, RefreshCw,
} from "lucide-react";
import api from "@/lib/api";
import { formatDate } from "@/lib/format";

// ─── Constants ────────────────────────────────────────────────────────────────

const WELCOME_MSG = {
  id: "welcome",
  role: "assistant",
  content: "Hi! I'm AdvisorAI — your intelligent financial concierge.\n\nI have live access to your clients, portfolios, holdings, transactions, compliance alerts, recommendations, market data, and research reports.\n\nAsk me anything and I'll retrieve the exact data to give you accurate answers.",
  metadata: null,
};

const INTENT_LABELS = {
  ADVISOR_PRODUCTIVITY:  { label: "Advisor Productivity", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  CLIENT_INTELLIGENCE:   { label: "Client Intelligence",  color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  PORTFOLIO_INSIGHTS:    { label: "Portfolio Insights",   color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  CONVERSATIONAL_SEARCH: { label: "Data Search",          color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
  COMPLIANCE:            { label: "Compliance",           color: "text-red-400 bg-red-500/10 border-red-500/20" },
  REVENUE_ENABLEMENT:    { label: "Revenue",              color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  GENERAL:               { label: "General",              color: "text-gray-400 bg-gray-500/10 border-gray-500/20" },
};

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({ msg, onSuggestionClick }) {
  const isUser = msg.role === "user";
  const meta = msg.metadata;
  const intentCfg = meta?.intent ? INTENT_LABELS[meta.intent] : null;

  return (
    <div className={`flex gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
        isUser ? "bg-blue-600/20 border border-blue-600/20" : "bg-[#1f2937] border border-[#374151]"
      }`}>
        {isUser ? <User size={11} className="text-blue-400" /> : <Bot size={11} className="text-gray-400" />}
      </div>

      <div className={`max-w-[88%] flex flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`}>
        {/* Intent + sources badge */}
        {!isUser && intentCfg && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${intentCfg.color}`}>
              {intentCfg.label}
            </span>
            {meta?.tablesQueried?.length > 0 && (
              <span className="flex items-center gap-1 text-[10px] text-gray-600">
                <Database size={9} />
                {meta.tablesQueried.slice(0, 3).join(", ")}
                {meta.tablesQueried.length > 3 && ` +${meta.tablesQueried.length - 3}`}
              </span>
            )}
          </div>
        )}

        {/* Bubble */}
        <div className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-blue-600 text-white rounded-tr-sm"
            : "bg-[#111827] border border-[#1f2937] text-gray-200 rounded-tl-sm"
        }`}>
          {msg.content}
        </div>

        {/* Follow-up suggestions */}
        {!isUser && meta?.suggestions?.length > 0 && (
          <div className="space-y-0.5">
            {meta.suggestions.slice(0, 3).map((s, i) => (
              <button
                key={i}
                onClick={() => onSuggestionClick(s)}
                className="flex items-center gap-1 text-[10px] text-gray-600 hover:text-blue-400 transition-colors"
              >
                <ChevronRight size={9} />
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── History Sidebar ──────────────────────────────────────────────────────────

function HistorySidebar({ conversations, onSelect, onClose, activeId }) {
  return (
    <div className="absolute inset-0 bg-[#0b1120] z-10 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#1f2937]">
        <div className="flex items-center gap-2">
          <History size={13} className="text-gray-400" />
          <span className="text-xs font-semibold text-white">Conversation History</span>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
          <X size={14} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {conversations.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-8">No past conversations</p>
        ) : (
          conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelect(c)}
              className={`w-full text-left bg-[#111827] border rounded-xl px-3 py-2.5 hover:border-blue-600/30 transition-all ${
                activeId === c.id ? "border-blue-600/40 bg-blue-600/5" : "border-[#1f2937]"
              }`}
            >
              <p className="text-xs font-medium text-white truncate">{c.title || "Untitled"}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-gray-600">{formatDate(c.createdAt)}</span>
                <span className="text-[10px] text-gray-600">· {c.messages?.length || 0} msgs</span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

export default function AIAssistantPanel() {
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  // Load conversation list on mount
  useEffect(() => {
    api.get("/conversations")
      .then(r => setConversations(r.data || []))
      .catch(() => {});
  }, []);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
    }, 50);
  }, []);

  // Resume a past conversation — load all messages from DB
  const resumeConversation = async (conv) => {
    setLoadingHistory(true);
    setShowHistory(false);
    try {
      const res = await api.get(`/conversations/${conv.id}`);
      const dbMessages = res.data.messages || [];
      const restored = [
        WELCOME_MSG,
        ...dbMessages.map((m, i) => ({
          id: `hist-${i}`,
          role: m.sender === "user" ? "user" : "assistant",
          content: m.message || "",
          metadata: null,
        })),
      ];
      setMessages(restored);
      setConversationId(conv.id);
      scrollToBottom();
    } catch (e) {
      console.error("Failed to load conversation:", e.message);
    } finally {
      setLoadingHistory(false);
    }
  };

  const startNewChat = () => {
    setMessages([WELCOME_MSG]);
    setConversationId(null);
    setInput("");
    setShowHistory(false);
    inputRef.current?.focus();
  };

  const sendMessage = async (text) => {
    const userMessage = (text || input).trim();
    if (!userMessage || isLoading) return;

    const userMsg = { id: `u-${Date.now()}`, role: "user", content: userMessage, metadata: null };
    setMessages(cur => [...cur, userMsg]);
    setInput("");
    setIsLoading(true);
    scrollToBottom();

    try {
      const res = await api.post("/ai/chat", {
        message: userMessage,
        history: [],           // Backend loads from DB via conversationId
        conversationId,        // Pass so backend can load full history
      });

      const { response, metadata } = res.data;
      const aiMsg = { id: `a-${Date.now()}`, role: "assistant", content: response, metadata };
      setMessages(cur => [...cur, aiMsg]);
      scrollToBottom();

      // Persist to DB
      try {
        if (!conversationId) {
          const conv = await api.post("/conversations", {
            title: userMessage.slice(0, 60),
            messages: [
              { sender: "user",      message: userMessage },
              { sender: "assistant", message: response },
            ],
          });
          setConversationId(conv.data.id);
          // Refresh conversation list
          setConversations(cur => [conv.data, ...cur]);
        } else {
          await Promise.all([
            api.post(`/conversations/${conversationId}/messages`, { sender: "user",      message: userMessage }),
            api.post(`/conversations/${conversationId}/messages`, { sender: "assistant", message: response }),
          ]);
        }
      } catch { /* non-critical */ }

    } catch (err) {
      const detail = err?.response?.data?.detail || err?.response?.data?.error || "Could not reach the AI service.";
      setMessages(cur => [...cur, {
        id: `err-${Date.now()}`, role: "assistant",
        content: `⚠️ Error: ${detail}`, metadata: null,
      }]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* History Sidebar */}
      {showHistory && (
        <HistorySidebar
          conversations={conversations}
          onSelect={resumeConversation}
          onClose={() => setShowHistory(false)}
          activeId={conversationId}
        />
      )}

      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1f2937] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-600/15 border border-blue-600/20 flex items-center justify-center">
            <Sparkles size={13} className="text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xs font-semibold text-white">AI Concierge</h2>
            <p className="text-[10px] text-gray-500">Semantic RAG · Gemini · Live DB</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-[10px] text-emerald-400">Online</span>
            </div>
            <button
              onClick={() => setShowHistory(v => !v)}
              className="w-6 h-6 rounded-lg bg-[#1f2937] hover:bg-[#374151] flex items-center justify-center transition-all"
              title="Conversation history"
            >
              <History size={11} className="text-gray-400" />
            </button>
            <button
              onClick={startNewChat}
              className="w-6 h-6 rounded-lg bg-[#1f2937] hover:bg-[#374151] flex items-center justify-center transition-all"
              title="New chat"
            >
              <Plus size={11} className="text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Resumed conversation banner */}
      {conversationId && messages.length > 1 && (
        <div className="px-4 py-1.5 bg-blue-600/5 border-b border-blue-600/10 flex items-center justify-between">
          <span className="text-[10px] text-blue-400">Continuing previous conversation</span>
          <button onClick={startNewChat} className="text-[10px] text-gray-500 hover:text-white flex items-center gap-1">
            <RefreshCw size={9} /> New chat
          </button>
        </div>
      )}

      {/* Messages */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {loadingHistory ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={18} className="text-blue-400 animate-spin" />
          </div>
        ) : (
          messages.map(msg => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              onSuggestionClick={(s) => {
                setInput(s);
                inputRef.current?.focus();
              }}
            />
          ))
        )}

        {isLoading && (
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#1f2937] border border-[#374151] flex items-center justify-center shrink-0">
              <Bot size={11} className="text-gray-400" />
            </div>
            <div className="bg-[#111827] border border-[#1f2937] rounded-2xl rounded-tl-sm px-3.5 py-2.5">
              <div className="flex items-center gap-1">
                {[0, 150, 300].map(d => (
                  <div key={d} className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="px-3 py-3 border-t border-[#1f2937] shrink-0">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about portfolios, clients, compliance..."
            className="flex-1 bg-[#111827] border border-[#1f2937] rounded-xl px-3.5 py-2 text-xs text-gray-200 placeholder-gray-600 outline-none focus:border-blue-600/50 transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-8 h-8 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-all shrink-0"
          >
            {isLoading
              ? <Loader2 size={13} className="text-white animate-spin" />
              : <Send size={13} className="text-white" />}
          </button>
        </div>
      </form>
    </div>
  );
}
