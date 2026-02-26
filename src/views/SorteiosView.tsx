import React, { useEffect, useState } from "react";
import { Clock, Trophy } from "lucide-react";
import { api, Sorteio } from "../api";
import { PROJECT_MONTHS } from "../components/Layout";

interface SorteiosViewProps {
  turmaId: string | null;
}

export default function SorteiosView({ turmaId }: SorteiosViewProps) {
  const [sorteios, setSorteios] = useState<Sorteio[]>([]);

  useEffect(() => {
    if (turmaId) {
      api.getSorteios(turmaId).then(setSorteios).catch(console.error);
    }
  }, [turmaId]);

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
          <Clock className="text-sky-400" size={32} />
          Histórico de Sorteios
        </h1>
        <p className="text-slate-500 mt-1">
          Acompanhe os ganhadores anteriores
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorteios.map((sorteio, idx) => (
          <div
            key={sorteio.id}
            className="glass-card hover:-translate-y-0.5 hover:bg-white/[0.06] transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                {PROJECT_MONTHS[sorteio.mes - 1] || `Mês ${sorteio.mes}`}
              </div>
              <Trophy className="text-slate-300" size={20} />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 font-bold text-xl shrink-0">
                {sorteio.vencedor_nome.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-lg font-bold text-white">
                  {sorteio.vencedor_nome}
                </div>
                <div className="text-xs text-slate-500">
                  Sorteado em{" "}
                  {new Date(sorteio.data_realizacao).toLocaleDateString(
                    "pt-BR",
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {sorteios.length === 0 && (
          <div className="col-span-full text-center text-slate-500 py-12 glass-card">
            Nenhum sorteio realizado ainda nesta turma.
          </div>
        )}
      </div>
    </div>
  );
}
