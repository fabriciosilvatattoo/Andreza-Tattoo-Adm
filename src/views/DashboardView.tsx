import React, { useEffect, useState } from "react";
import {
  CreditCard,
  Users,
  DollarSign,
  Disc3,
  TrendingUp,
  Gift,
} from "lucide-react";
import { api, DashboardStats, Turma } from "../api";

interface DashboardViewProps {
  onNavigate: (view: string) => void;
  onSelectTurma: (id: string) => void;
}

export default function DashboardView({
  onNavigate,
  onSelectTurma,
}: DashboardViewProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [turmas, setTurmas] = useState<Turma[]>([]);

  useEffect(() => {
    api.getDashboard().then(setStats).catch(console.error);
    api.getTurmas().then(setTurmas).catch(console.error);
  }, []);

  if (!stats) return <div className="text-slate-400">Carregando...</div>;

  const metrics = [
    { label: "Turmas Ativas", value: stats.turmas_ativas, icon: CreditCard },
    { label: "Participantes", value: stats.total_participantes, icon: Users },
    {
      label: "Arrecadado",
      value: `R$ ${stats.total_arrecadado.toFixed(2)}`,
      icon: DollarSign,
    },
    { label: "Sorteios", value: stats.total_sorteios, icon: Disc3 },
    { label: "Indicadores", value: stats.total_indicadores, icon: TrendingUp },
    { label: "Vouchers Ativos", value: stats.vouchers_ativos, icon: Gift },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Dashboard</h1>
        <p className="text-slate-500 mt-1">Visão geral de todos os projetos</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div
              key={i}
              className={`glass-card flex items-stretch gap-4 hover:-translate-y-0.5 hover:bg-white/[0.04] transition-all duration-200`}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                <Icon size={20} className="text-slate-300" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  {m.label}
                </span>
                <span className="text-xl font-extrabold text-white">
                  {m.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="glass-card">
        <h2 className="text-lg font-bold text-white mb-4">Turmas</h2>
        <div className="space-y-2">
          {turmas.map((turma) => (
            <button
              key={turma.id}
              onClick={() => {
                onSelectTurma(turma.id);
                onNavigate("participantes");
              }}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-200 text-left"
            >
              <div>
                <div className="font-bold text-white">{turma.nome}</div>
                <div className="text-sm text-slate-400">
                  R$ {turma.valor_total.toFixed(2)} • {turma.num_parcelas}x R${" "}
                  {turma.valor_parcela.toFixed(2)}
                </div>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                  turma.status === "ativo"
                    ? "border-white/20 text-white"
                    : "border-white/5 text-slate-500"
                }`}
              >
                {turma.status.toUpperCase()}
              </span>
            </button>
          ))}
          {turmas.length === 0 && (
            <div className="text-center text-slate-500 py-4">
              Nenhuma turma encontrada.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
