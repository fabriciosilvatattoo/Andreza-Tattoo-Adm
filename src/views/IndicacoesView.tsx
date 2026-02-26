import React, { useEffect, useState } from "react";
import {
  Target,
  TrendingUp,
  Users,
  Award,
  Link as LinkIcon,
  QrCode,
} from "lucide-react";
import { api, Indicador, Indicado } from "../api";

export default function IndicacoesView() {
  const [indicadores, setIndicadores] = useState<Indicador[]>([]);
  const [selectedIndicador, setSelectedIndicador] = useState<string | null>(
    null,
  );
  const [indicados, setIndicados] = useState<Indicado[]>([]);

  const [newNome, setNewNome] = useState("");
  const [newTelefone, setNewTelefone] = useState("");
  const [newDoc, setNewDoc] = useState("");

  useEffect(() => {
    loadIndicadores();
  }, []);

  const loadIndicadores = () => {
    api.getIndicadores().then(setIndicadores).catch(console.error);
  };

  useEffect(() => {
    if (selectedIndicador) {
      api
        .getIndicados(selectedIndicador)
        .then(setIndicados)
        .catch(console.error);
    } else {
      setIndicados([]);
    }
  }, [selectedIndicador]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createIndicador({
        nome: newNome,
        telefone: newTelefone,
        documento_sufixo: newDoc,
      });
      setNewNome("");
      setNewTelefone("");
      setNewDoc("");
      loadIndicadores();
    } catch (error) {
      console.error(error);
    }
  };

  const totalIndicadores = indicadores.length;
  const totalLeads = indicadores.reduce(
    (acc, ind) => acc + ind.total_indicacoes,
    0,
  );
  const totalConversoes = indicadores.reduce(
    (acc, ind) => acc + ind.total_conversoes,
    0,
  );
  const totalPremios = Math.floor(totalConversoes / 3);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <Target className="text-teal-400" size={32} />
          Sistema de Indicação
        </h1>
        <p className="text-slate-500 mt-1">Gerencie o programa TattooFlow</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card flex flex-col justify-center items-center text-center">
          <Users className="text-slate-300 mb-2" size={24} />
          <span className="text-2xl font-extrabold text-white">
            {totalIndicadores}
          </span>
          <span className="text-[10px] text-slate-400 uppercase font-bold">
            Indicadores
          </span>
        </div>
        <div className="glass-card flex flex-col justify-center items-center text-center">
          <TrendingUp className="text-slate-300 mb-2" size={24} />
          <span className="text-2xl font-extrabold text-white">
            {totalLeads}
          </span>
          <span className="text-[10px] text-slate-400 uppercase font-bold">
            Total Leads
          </span>
        </div>
        <div className="glass-card flex flex-col justify-center items-center text-center">
          <Target className="text-slate-300 mb-2" size={24} />
          <span className="text-2xl font-extrabold text-white">
            {totalConversoes}
          </span>
          <span className="text-[10px] text-slate-400 uppercase font-bold">
            Conversões
          </span>
        </div>
        <div className="glass-card flex flex-col justify-center items-center text-center">
          <Award className="text-slate-300 mb-2" size={24} />
          <span className="text-2xl font-extrabold text-white">
            {totalPremios}
          </span>
          <span className="text-[10px] text-slate-400 uppercase font-bold">
            Prêmios (1 a cada 3)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 glass-card h-fit">
          <h2 className="text-xl font-bold text-white mb-4">Novo Indicador</h2>
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
                WhatsApp
              </label>
              <input
                required
                type="text"
                value={newTelefone}
                onChange={(e) => setNewTelefone(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-white/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Doc (4 dígitos)
              </label>
              <input
                type="text"
                maxLength={4}
                value={newDoc}
                onChange={(e) => setNewDoc(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-white/30"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-white hover:bg-slate-200 text-slate-950 px-4 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              Gerar Link & QR Code
            </button>
          </form>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="glass-card overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-400">
                  <th className="pb-3 font-bold">Indicador</th>
                  <th className="pb-3 font-bold text-center">Leads</th>
                  <th className="pb-3 font-bold text-center">Conv.</th>
                  <th className="pb-3 font-bold">Progresso</th>
                  <th className="pb-3 font-bold text-center">QR</th>
                </tr>
              </thead>
              <tbody>
                {indicadores.map((ind) => {
                  const progress = ((ind.total_conversoes % 3) / 3) * 100;
                  const isSelected = selectedIndicador === ind.id;
                  return (
                    <tr
                      key={ind.id}
                      onClick={() =>
                        setSelectedIndicador(isSelected ? null : ind.id)
                      }
                      className={`border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${isSelected ? "bg-white/10" : ""}`}
                    >
                      <td className="py-3">
                        <div className="font-bold text-white">{ind.nome}</div>
                        <div className="text-xs text-slate-500 font-mono">
                          {ind.codigo}
                        </div>
                      </td>
                      <td className="py-3 text-center text-white">
                        {ind.total_indicacoes}
                      </td>
                      <td className="py-3 text-center text-white font-bold">
                        {ind.total_conversoes}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-800 border border-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-white rounded-full"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-400">
                            {ind.total_conversoes % 3}/3
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(ind.qr_code_url);
                          }}
                          className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors inline-block"
                        >
                          <QrCode size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {indicadores.length === 0 && (
              <div className="text-center text-slate-500 py-8">
                Nenhum indicador cadastrado.
              </div>
            )}
          </div>

          {selectedIndicador && (
            <div className="glass-card animate-fade-in">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Users size={20} className="text-sky-400" />
                Indicados
              </h3>
              <div className="space-y-2">
                {indicados.map((ind) => (
                  <div
                    key={ind.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
                  >
                    <div>
                      <div className="font-medium text-white">{ind.nome}</div>
                      <div className="text-xs text-slate-500">
                        {new Date(ind.data).toLocaleDateString("pt-BR")} •
                        Origem: {ind.origem}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border border-white/10 text-slate-300`}
                    >
                      {ind.status}
                    </span>
                  </div>
                ))}
                {indicados.length === 0 && (
                  <div className="text-center text-slate-500 py-4">
                    Nenhum indicado registrado para este indicador.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
