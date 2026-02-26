import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  Bell,
  Trophy,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { api, MensagemLog } from "../api";

interface MensagensViewProps {
  turmaId: string | null;
}

export default function MensagensView({ turmaId }: MensagensViewProps) {
  const [mensagens, setMensagens] = useState<MensagemLog[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadMensagens();
  }, []);

  const loadMensagens = () => {
    api.getMensagens().then(setMensagens).catch(console.error);
  };

  const handleGerarLembretes = async () => {
    if (!turmaId) return alert("Selecione uma turma primeiro.");
    try {
      await api.sendLembrete(turmaId, {});
      alert("Lembretes gerados com sucesso!");
      loadMensagens();
    } catch (error) {
      console.error(error);
      alert("Erro ao gerar lembretes.");
    }
  };

  const handleAvisoSorteio = async () => {
    if (!turmaId) return alert("Selecione uma turma primeiro.");
    try {
      await api.sendSorteio(turmaId, {});
      alert("Aviso de sorteio gerado com sucesso!");
      loadMensagens();
    } catch (error) {
      console.error(error);
      alert("Erro ao gerar aviso de sorteio.");
    }
  };

  const getBadgeColor = (tipo: string) => {
    switch (tipo) {
      case "confirmacao":
        return "border border-white/10 text-slate-300";
      case "lembrete":
        return "border border-white/10 text-slate-300";
      case "sorteio":
        return "border border-white/10 text-slate-300";
      default:
        return "border border-white/10 text-slate-300";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <MessageSquare className="text-slate-300" size={32} />
            Central de Mensagens
          </h1>
          <p className="text-slate-500 mt-1">
            Log de mensagens geradas e enviadas
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleGerarLembretes}
            className="bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all"
          >
            <Bell size={18} />
            Gerar Lembretes
          </button>
          <button
            onClick={handleAvisoSorteio}
            className="bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all"
          >
            <Trophy size={18} />
            Aviso de Sorteio
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {mensagens.map((msg) => {
          const isExpanded = expandedId === msg.id;
          return (
            <div
              key={msg.id}
              className="glass-card hover:bg-white/[0.04] transition-colors"
            >
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : msg.id)}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase shrink-0 ${getBadgeColor(msg.tipo)}`}
                  >
                    {msg.tipo}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white truncate">
                      {msg.destinatario_nome}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {isExpanded
                        ? msg.destinatario_telefone
                        : msg.conteudo.substring(0, 60) + "..."}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 pl-4">
                  <div className="text-xs text-slate-500 hidden sm:block">
                    {new Date(msg.created_at).toLocaleString("pt-BR")}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      msg.status === "enviado" ? "text-white" : "text-slate-500"
                    }`}
                  >
                    {msg.status}
                  </span>
                  {isExpanded ? (
                    <ChevronUp size={18} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={18} className="text-slate-400" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-white/5 animate-fade-in">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-slate-300 bg-black/20 p-4 rounded-xl border border-white/5">
                    {msg.conteudo}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
        {mensagens.length === 0 && (
          <div className="text-center text-slate-500 py-12 glass-card">
            Nenhuma mensagem registrada.
          </div>
        )}
      </div>
    </div>
  );
}
