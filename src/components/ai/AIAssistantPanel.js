"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  Send, Bot, User, Loader2, Sparkles, Plus,
  Database, ChevronRight, History, X, RefreshCw, Mic, MicOff,
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

function MessageBubble({ msg, onSuggestionClick, streaming }) {
  const isUser   = msg.role === "user";
  const meta     = msg.metadata;
  const intentCfg = meta?.intent ? INTENT_LABELS[meta.intent] : null;

  return (
    <div className={`flex gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
        isUser ? "bg-blue-600/20 border border-blue-600/20" : "bg-[#1f2937] border border-[#374151]"
      }`}>
        {isUser ? <User size={11} className="text-blue-400" /> : <Bot size={11} className="text-gray-400" />}
      </div>

      <div className={`max-w-[88%] flex flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`}>
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

        <div className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-blue-600 text-white rounded-tr-sm"
            : "bg-[#111827] border border-[#1f2937] text-gray-200 rounded-tl-sm"
        }`}>
          {msg.content}
          {/* blinking cursor while streaming */}
          {streaming && !isUser && (
            <span className="inline-block w-1.5 h-3.5 bg-blue-400 rounded-sm ml-0.5 animate-pulse align-middle" />
          )}
        </div>

        {!isUser && !streaming && meta?.suggestions?.length > 0 && (
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

// ─── Voice Input Hook ─────────────────────────────────────────────────────────

function useVoiceInput({ onResult, onError }) {
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);

  const supported = typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const toggle = useCallback(() => {
    if (!supported) return onError?.("Voice input not supported in this browser.");

    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "en-US";
    rec.continuous = false;
    rec.interimResults = false;

    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      onResult?.(transcript);
    };
    rec.onerror = (e) => {
      onError?.(e.error === "not-allowed" ? "Microphone access denied." : "Voice error: " + e.error);
    };
    rec.onend = () => setListening(false);

    recRef.current = rec;
    rec.start();
    setListening(true);
  }, [listening, supported, onResult, onError]);

  return { listening, toggle, supported };
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://advsiorai-backend-production.up.railway.app";

export default function AIAssistantPanel() {
  const [messages,        setMessages]        = useState([WELCOME_MSG]);
  const [input,           setInput]           = useState("");
  const [isLoading,       setIsLoading]       = useState(false);
  const [streamingId,     setStreamingId]     = useState(null);
  const [conversationId,  setConversationId]  = useState(null);
  const [conversations,   setConversations]   = useState([]);
  const [showHistory,     setShowHistory]     = useState(false);
  const [loadingHistory,  setLoadingHistory]  = useState(false);
  const [voiceError,      setVoiceError]      = useState("");
  const listRef  = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    api.get("/conversations").then(r => setConversations(r.data || [])).catch(() => {});
  }, []);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
    }, 50);
  }, []);

  const { listening, toggle: toggleVoice, supported: voiceSupported } = useVoiceInput({
    onResult: (text) => { setInput(text); inputRef.current?.focus(); },
    onError:  (msg)  => { setVoiceError(msg); setTimeout(() => setVoiceError(""), 3000); },
  });

  const resumeConversation = async (conv) => {
    setLoadingHistory(true);
    setShowHistory(false);
    try {
      const res = await api.get(`/conversations/${conv.id}`);
      const restored = [
        WELCOME_MSG,
        ...(res.data.messages || []).map((m, i) => ({
          id: `hist-${i}`, role: m.sender === "user" ? "user" : "assistant",
          content: m.message || "", metadata: null,
        })),
      ];
      setMessages(restored);
      setConversationId(conv.id);
      scrollToBottom();
    } catch {}
    finally { setLoadingHistory(false); }
  };

  const startNewChat = () => {
    setMessages([WELCOME_MSG]);
    setConversationId(null);
    setInput("");
    setShowHistory(false);
    inputRef.current?.focus();
  };

  // ─── Streaming send ────────────────────────────────────────────────────────
  const sendMessage = async (text) => {
    const userMessage = (text || input).trim();
    if (!userMessage || isLoading) return;

    const userMsg = { id: `u-${Date.now()}`, role: "user", content: userMessage, metadata: null };
    const aiId    = `a-${Date.now()}`;
    const aiMsg   = { id: aiId, role: "assistant", content: "", metadata: null };

    setMessages(cur => [...cur, userMsg, aiMsg]);
    setInput("");
    setIsLoading(true);
    setStreamingId(aiId);
    scrollToBottom();

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    try {
      const res = await fetch(`${API_URL}/ai/chat/stream`, {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message: userMessage, conversationId }),
      });

      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let   buffer  = "";
      let   fullText = "";
      let   meta    = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const raw = line.slice(5).trim();
          if (!raw) continue;
          try {
            const parsed = JSON.parse(raw);
            if (parsed.token) {
              fullText += parsed.token;
              setMessages(cur =>
                cur.map(m => m.id === aiId ? { ...m, content: fullText } : m)
              );
              scrollToBottom();
            }
            if (parsed.intent || parsed.tables) {
              meta = { ...(meta || {}), intent: parsed.intent, tablesQueried: parsed.tables };
            }
            if (parsed.fullText !== undefined) {
              fullText = parsed.fullText;
              meta = { intent: parsed.intent, tablesQueried: parsed.tables };
            }
          } catch {}
        }
      }

      setMessages(cur => cur.map(m => m.id === aiId ? { ...m, content: fullText, metadata: meta } : m));

      // Persist to DB
      try {
        if (!conversationId) {
          const conv = await api.post("/conversations", {
            title: userMessage.slice(0, 60),
            messages: [
              { sender: "user",      message: userMessage },
              { sender: "assistant", message: fullText },
            ],
          });
          setConversationId(conv.data.id);
          setConversations(cur => [conv.data, ...cur]);
        } else {
          await Promise.all([
            api.post(`/conversations/${conversationId}/messages`, { sender: "user",      message: userMessage }),
            api.post(`/conversations/${conversationId}/messages`, { sender: "assistant", message: fullText }),
          ]);
        }
      } catch {}

    } catch (err) {
      const detail = err.message || "Could not reach the AI service.";
      setMessages(cur => cur.map(m => m.id === aiId ? { ...m, content: `⚠️ Error: ${detail}` } : m));
    } finally {
      setIsLoading(false);
      setStreamingId(null);
      scrollToBottom();
    }
  };

  return (
    <div className="h-full flex flex-col relative">
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
            <p className="text-[10px] text-gray-500">RAG · Gemini · Streaming · Live DB</p>
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
              streaming={msg.id === streamingId}
              onSuggestionClick={(s) => { setInput(s); inputRef.current?.focus(); }}
            />
          ))
        )}

        {isLoading && streamingId === null && (
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

      {/* Voice error toast */}
      {voiceError && (
        <div className="mx-3 mb-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 text-[11px] text-red-400">
          {voiceError}
        </div>
      )}

      {/* Input */}
      <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="px-3 py-3 border-t border-[#1f2937] shrink-0">
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-1 bg-[#111827] border border-[#1f2937] rounded-xl px-3 focus-within:border-blue-600/50 transition-all">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about portfolios, clients, compliance..."
              className="flex-1 bg-transparent py-2 text-xs text-gray-200 placeholder-gray-600 outline-none"
              disabled={isLoading}
            />
            {/* Voice button */}
            {voiceSupported && (
              <button
                type="button"
                onClick={toggleVoice}
                disabled={isLoading}
                title={listening ? "Stop listening" : "Voice input"}
                className={`shrink-0 w-6 h-6 flex items-center justify-center rounded-lg transition-all ${
                  listening
                    ? "text-red-400 bg-red-500/10 animate-pulse"
                    : "text-gray-500 hover:text-blue-400 hover:bg-blue-500/10"
                }`}
              >
                {listening ? <MicOff size={13} /> : <Mic size={13} />}
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-8 h-8 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-all shrink-0"
          >
            {isLoading
              ? <Loader2 size={13} className="text-white animate-spin" />
              : <Send size={13} className="text-white" />
            }
          </button>
        </div>
      </form>
    </div>
  );
}
