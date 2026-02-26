import React, { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { api, Participante } from "../api";
import RaffleWheel from "../components/RaffleWheel";
import { PROJECT_MONTHS } from "../components/Layout";

interface RoletaViewProps {
  turmaId: string | null;
}

export default function RoletaView({ turmaId }: RoletaViewProps) {
  const [elegiveis, setElegiveis] = useState<Participante[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(1);

  useEffect(() => {
    if (turmaId) {
      api.getElegiveis(turmaId).then(setElegiveis).catch(console.error);
    }
  }, [turmaId]);

  const handleSpinEnd = (winnerName: string) => {
    setIsSpinning(false);
    setWinner(winnerName);
  };

  const confirmWinner = async () => {
    if (!turmaId) return;
    try {
      await api.sortear(turmaId);
      setWinner(null);
      // Reload elegiveis
      const res = await api.getElegiveis(turmaId);
      setElegiveis(res);
    } catch (error) {
      console.error(error);
      alert("Erro ao confirmar sorteio.");
    }
  };

  if (!turmaId)
    return (
      <div className="text-slate-400">
        Selecione uma turma na barra lateral.
      </div>
    );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <Trophy className="text-amber-400" size={32} />
          Sorteio Mensal
        </h1>
        <p className="text-slate-500 mt-1">
          Gire a roleta para definir o próximo ganhador
        </p>
      </div>

      <div className="glass-card w-full max-w-md">
        <label className="block text-sm font-medium text-slate-400 mb-2">
          Mês de Referência
        </label>
        <select
          className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-white/30"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
        >
          {PROJECT_MONTHS.map((m, i) => (
            <option key={i} value={i + 1}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 glass-card flex flex-col items-center justify-center p-8">
          <RaffleWheel
            participants={elegiveis.map((p) => p.nome)}
            isSpinning={isSpinning}
            onSpinEnd={handleSpinEnd}
          />
          <button
            onClick={() => setIsSpinning(true)}
            disabled={isSpinning || elegiveis.length === 0}
            className="mt-8 bg-white hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 px-8 py-3 rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            {isSpinning ? "Sorteando..." : "Girar Roleta"}
          </button>
        </div>

        <div className="lg:col-span-5 glass-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Aptos</h2>
            <span className="border border-white/10 text-slate-300 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              {elegiveis.length} Aptos
            </span>
          </div>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {elegiveis.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 font-bold shrink-0">
                  {p.nome.charAt(0).toUpperCase()}
                </div>
                <div className="font-medium text-white">{p.nome}</div>
              </div>
            ))}
            {elegiveis.length === 0 && (
              <div className="text-center text-slate-500 py-8">
                Nenhum participante apto para sorteio.
              </div>
            )}
          </div>
        </div>
      </div>

      {winner && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-card w-full max-w-lg text-center p-8 border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
            <Trophy className="text-white mx-auto mb-6" size={64} />
            <h2 className="text-2xl font-bold text-slate-300 mb-2">
              Temos um ganhador!
            </h2>
            <div className="text-5xl font-black text-white mb-8 tracking-tight">
              {winner}
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setWinner(null)}
                className="px-6 py-3 rounded-xl text-slate-300 hover:bg-white/5 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmWinner}
                className="bg-white hover:bg-slate-200 text-slate-950 px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                Confirmar Vitória
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
