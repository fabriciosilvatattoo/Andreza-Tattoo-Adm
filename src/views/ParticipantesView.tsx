import React, { useEffect, useState } from "react";
import {
  Users,
  Search,
  CheckCircle2,
  Send,
  ArrowRightLeft,
  UserX,
  AlertTriangle,
} from "lucide-react";
import { api, Participante, Turma } from "../api";

interface ParticipantesViewProps {
  turmaId: string | null;
}

export default function ParticipantesView({ turmaId }: ParticipantesViewProps) {
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [turma, setTurma] = useState<Turma | null>(null);
  const [search, setSearch] = useState("");
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newNome, setNewNome] = useState("");
  const [newTelefone, setNewTelefone] = useState("");

  useEffect(() => {
    if (turmaId) {
      api.getTurma(turmaId).then(setTurma).catch(console.error);
      loadParticipantes();
    }
  }, [turmaId]);

  const loadParticipantes = () => {
    if (turmaId) {
      api.getParticipantes(turmaId).then(setParticipantes).catch(console.error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turmaId) return;
    try {
      await api.createParticipante(turmaId, {
        nome: newNome,
        telefone: newTelefone,
      });
      setIsNewModalOpen(false);
      setNewNome("");
      setNewTelefone("");
      loadParticipantes();
    } catch (error) {
      console.error(error);
    }
  };

  const handlePagar = async (id: string) => {
    try {
      await api.pagarParcela(id);
      loadParticipantes();
    } catch (error) {
      console.error(error);
    }
  };

  const filtered = participantes.filter(
    (p) =>
      p.nome.toLowerCase().includes(search.toLowerCase()) ||
      p.telefone.includes(search),
  );

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      ativo: "bg-emerald-500/20 text-emerald-400",
      inadimplente: "bg-red-500/20 text-red-400",
      sorteado: "bg-amber-500/20 text-amber-400",
      desistente: "bg-slate-500/20 text-slate-400",
      quitado: "bg-teal-500/20 text-teal-400",
    };
    return (
      <span
        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${styles[status] || styles.ativo}`}
      >
        {status}
      </span>
    );
  };

  if (!turmaId)
    return (
      <div className="text-slate-400">
        Selecione uma turma na barra lateral.
      </div>
    );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Participantes</h1>
          <p className="text-slate-500 mt-1">
            {turma?.nome} • {participantes.length} inscritos
          </p>
        </div>
        <button
          onClick={() => setIsNewModalOpen(true)}
          className="bg-white hover:bg-slate-200 text-slate-950 px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all"
        >
          <Users size={18} />
          Novo Participante
        </button>
      </div>

      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          size={20}
        />
        <input
          type="text"
          placeholder="Buscar por nome ou telefone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-white/30 transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((p) => {
          const progress = turma
            ? (p.parcelas_pagas / turma.num_parcelas) * 100
            : 0;
          return (
            <div
              key={p.id}
              className="glass-card group hover:-translate-y-0.5 hover:bg-white/[0.06] transition-all duration-200 relative overflow-hidden"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 font-bold text-lg shrink-0">
                  {p.nome.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-white truncate">{p.nome}</h3>
                    {getStatusBadge(p.status)}
                  </div>
                  <p className="text-xs text-slate-500">{p.telefone}</p>
                </div>
              </div>

              <div className="space-y-1.5 mb-4">
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500">
                  {p.parcelas_pagas} de {turma?.num_parcelas} parcelas — R${" "}
                  {p.total_pago.toFixed(2)} pago
                </p>
              </div>

              {/* Hover Actions */}
              <div className="absolute inset-x-0 bottom-0 p-3 bg-slate-900/95 backdrop-blur-md border-t border-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-200 flex justify-around">
                <button
                  onClick={() => handlePagar(p.id)}
                  className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Pagar Parcela"
                >
                  <CheckCircle2 size={20} />
                </button>
                <button
                  onClick={() =>
                    window.open(
                      `https://wa.me/${p.telefone.replace(/\D/g, "")}`,
                    )
                  }
                  className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="WhatsApp"
                >
                  <Send size={20} />
                </button>
                <button
                  className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Transferir Vaga"
                >
                  <ArrowRightLeft size={20} />
                </button>
                <button
                  className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Desistência"
                >
                  <UserX size={20} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Novo Participante */}
      {isNewModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-md animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-4">
              Novo Participante
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Nome
                </label>
                <input
                  required
                  type="text"
                  value={newNome}
                  onChange={(e) => setNewNome(e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-white/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Telefone
                </label>
                <input
                  required
                  type="text"
                  value={newTelefone}
                  onChange={(e) => setNewTelefone(e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-white/30"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-300 hover:bg-white/5 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-white hover:bg-slate-200 text-slate-950 px-4 py-2 rounded-xl font-medium transition-all"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
