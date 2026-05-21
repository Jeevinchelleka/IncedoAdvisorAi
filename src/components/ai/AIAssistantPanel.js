"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles, Plus } from "lucide-react";
import api from "@/lib/api";

const WELCOME = {
  id: "system",
  role: "assistant",
  content: "Hi! I'm AdvisorAI. Ask me anything about your portfolios, clients, holdings, transactions, compliance alerts, or market data — I have live access to your database.",
};

export default function AIAssistantPanel() {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const listRef = useRef(null);

  const chatHistory = useMemo(
    () => messages.filter((m) => !(m.role === "assistant" && m.id === "system")),
    [messages]
  );

  const scrollToBottom = () => {
    setTimeout(() => {
      if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
    }, 50);
  };

  const startNewChat = () => {
    setMessages([WELCOME]);
    setConversationId(null);
    setInput("");
  };

  const handleSend = async (e, overrideText) => {
    e?.preventDefault();
    const userMessage = (overrideText || input).trim();
    if (!userMessage || isLoading) return;

    const nextMessages = [
      ...messages,
      { id: `user-${Date.now()}`, role: "user", content: userMessage },
    ];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);
    scrollToBottom();

    try {
      // Call AI
      const response = await api.post("/ai/chat", {
        message: userMessage,
        history: chatHistory,
      });
      const aiContent = response.data.response;

      setMessages((cur) => [
        ...cur,
        { id: `ai-${Date.now()}`, role: "assistant", content: aiContent },
      ]);
      scrollToBottom();

      // Persist to DB
      try {
        if (!conversationId) {
          // Create new conversation
          const conv = await api.post("/conversations", {
            title: userMessage.slice(0, 60),
            messages: [
              { sender: "user", message: userMessage },
              { sender: "assistant", message: aiContent },
            ],
          });
          setConversationId(conv.data.id);
        } else {
          // Append messages
          await Promise.all([
            api.post(`/conversations/${conversationId}/messages`, { sender: "user", message: userMessage }),
            api.post(`/conversations/${conversationId}/messages`, { sender: "assistant", message: aiContent }),
          ]);
        }
      } catch {
        // Persistence failure is non-critical
      }
    } catch {
      setMessages((cur) => [
        ...cur,
        { id: `ai-err-${Date.now()}`, role: "assistant", content: "Sorry, I couldn't reach the AI service. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-[#1f2937] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-600/15 border border-blue-600/20 flex items-center justify-center">
            <Sparkles size={13} className="text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xs font-semibold text-white">AI Concierge</h2>
            <p className="text-[10px] text-gray-500">Live database access</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-[10px] text-emerald-400">Online</span>
            </div>
            <button
              onClick={startNewChat}
              className="w-6 h-6 rounded-lg bg-[#1f2937] hover:bg-[#374151] flex items-center justify-center transition-all"
              title="New chat"
            >
              <Plus size={12} className="text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
              msg.role === "user" ? "bg-blue-600/20 border border-blue-600/20" : "bg-[#1f2937] border border-[#374151]"
            }`}>
              {msg.role === "user"
                ? <User size={11} className="text-blue-400" />
                : <Bot size={11} className="text-gray-400" />}
            </div>
            <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
              msg.role === "user"
                ? "bg-blue-600 text-white rounded-tr-sm"
                : "bg-[#111827] border border-[#1f2937] text-gray-200 rounded-tl-sm"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#1f2937] border border-[#374151] flex items-center justify-center shrink-0">
              <Bot size={11} className="text-gray-400" />
            </div>
            <div className="bg-[#111827] border border-[#1f2937] rounded-2xl rounded-tl-sm px-3.5 py-2.5">
              <div className="flex items-center gap-1">
                {[0, 150, 300].map((d) => (
                  <div key={d} className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="px-3 py-3 border-t border-[#1f2937] shrink-0">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about portfolios, clients..."
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
