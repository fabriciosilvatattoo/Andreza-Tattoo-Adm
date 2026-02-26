import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Disc3,
  Trophy,
  Target,
  Ticket,
  MessageSquare,
  Phone,
  Bot,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { api, Turma } from "../api";

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
  selectedTurmaId: string | null;
  onSelectTurma: (id: string) => void;
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "participantes", label: "Participantes", icon: Users },
  { id: "roleta", label: "Roleta", icon: Disc3 },
  { id: "sorteios", label: "Sorteios", icon: Trophy },
  { id: "indicacoes", label: "Indicações", icon: Target },
  { id: "vouchers", label: "Vouchers", icon: Ticket },
  { id: "mensagens", label: "Mensagens", icon: MessageSquare },
  { id: "whatsapp", label: "WhatsApp", icon: Phone },
  { id: "assistente", label: "Assistente IA", icon: Bot },
];

export const PROJECT_MONTHS = [
  "Julho/2025",
  "Agosto/2025",
  "Setembro/2025",
  "Outubro/2025",
  "Novembro/2025",
  "Dezembro/2025",
  "Janeiro/2026",
  "Fevereiro/2026",
  "Março/2026",
  "Abril/2026",
  "Maio/2026",
  "Junho/2026",
];

export default function Layout({
  children,
  currentView,
  onNavigate,
  selectedTurmaId,
  onSelectTurma,
}: LayoutProps) {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(1);

  useEffect(() => {
    api.getTurmas().then(setTurmas).catch(console.error);
  }, []);

  useEffect(() => {
    if (turmas.length > 0 && !selectedTurmaId) {
      onSelectTurma(turmas[0].id);
    }
  }, [turmas, selectedTurmaId, onSelectTurma]);

  const handleMonthChange = (delta: number) => {
    setSelectedMonth((prev) => Math.max(1, Math.min(12, prev + delta)));
  };

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 fixed left-0 top-0 bottom-0 bg-slate-900/60 backdrop-blur-xl border-r border-white/[0.06] z-50">
        <div className="p-6 flex justify-center">
          <img
            src="https://xvagvpdrpsaarhqsjbnn.supabase.co/storage/v1/object/public/imagemns/ANDREZA/Logo-andreza.png"
            alt="Andreza Tattoo"
            className="w-44 h-auto object-contain drop-shadow-[0_0_24px_rgba(255,255,255,0.05)] opacity-90"
          />
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? "bg-white/10 text-white border-l-[3px] border-white"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-white/[0.06]">
          <div className="glass-card !p-3 space-y-3">
            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1 block">
                Turma Ativa
              </label>
              <select
                className="w-full bg-slate-950/50 border border-white/10 rounded-md px-2 py-1.5 text-sm text-white focus:outline-none focus:border-white/30"
                value={selectedTurmaId || ""}
                onChange={(e) => onSelectTurma(e.target.value)}
              >
                {turmas.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1 block">
                Mês Atual: {selectedMonth} / 12
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleMonthChange(-1)}
                  className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white"
                >
                  <ChevronLeft size={16} />
                </button>
                <select
                  className="flex-1 bg-slate-950/50 border border-white/10 rounded-md px-2 py-1 text-xs text-white focus:outline-none focus:border-white/30"
                  value={selectedMonth - 1}
                  onChange={(e) => setSelectedMonth(Number(e.target.value) + 1)}
                >
                  {PROJECT_MONTHS.map((m, i) => (
                    <option key={i} value={i}>
                      {m}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleMonthChange(1)}
                  className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-xl border-t border-white/[0.06] z-50 flex justify-around items-center h-16 px-2">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`p-3 rounded-xl transition-all ${
                isActive
                  ? "text-white bg-white/10"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Icon size={24} />
            </button>
          );
        })}
      </nav>

      {/* Main Content */}
      <main className="flex-1 md:ml-60 p-4 md:p-8 pb-24 md:pb-8">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
