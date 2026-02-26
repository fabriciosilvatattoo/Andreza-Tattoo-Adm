import React, { useState, useRef, useEffect } from "react";
import { Bot, Sparkles, Send } from "lucide-react";
import { api } from "../api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export default function AssistenteView() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Olá! Eu sou a Luna, sua assistente virtual. Como posso ajudar com o consórcio hoje?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await api.chatAgent(userMsg.content);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: res.response,
        timestamp: res.timestamp,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Desculpe, ocorreu um erro ao processar sua mensagem.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)] flex flex-col">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <Bot className="text-slate-300" size={32} />
          Assistente IA
          <Sparkles className="text-slate-400" size={24} />
        </h1>
        <p className="text-slate-500 mt-1">
          Converse com a Luna sobre o consórcio
        </p>
      </div>

      <div className="glass-card flex-1 flex flex-col overflow-hidden p-0 relative">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-black/20 rounded-t-2xl">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] md:max-w-[70%] p-4 ${
                  msg.role === "user"
                    ? "bg-white/10 border border-white/20 rounded-2xl rounded-tr-sm text-white"
                    : "bg-white/[0.05] border border-white/[0.08] rounded-2xl rounded-tl-sm text-slate-200"
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </p>
                <div
                  className={`text-[10px] mt-2 opacity-50 ${msg.role === "user" ? "text-right" : "text-left"}`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
                <div
                  className="w-2 h-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-slate-900/80 backdrop-blur-md border-t border-white/10 rounded-b-2xl">
          <form onSubmit={handleSend} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte qualquer coisa sobre o consórcio..."
              className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-white/30 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-white hover:bg-slate-200 disabled:opacity-50 text-slate-950 p-3 rounded-xl transition-all flex items-center justify-center shrink-0"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
