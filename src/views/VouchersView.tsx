import React, { useEffect, useState } from "react";
import { Ticket, DollarSign, CheckCircle2, XCircle } from "lucide-react";
import { api, Voucher } from "../api";

export default function VouchersView() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [newComprador, setNewComprador] = useState("");
  const [newCredito, setNewCredito] = useState<number>(250);

  useEffect(() => {
    loadVouchers();
  }, []);

  const loadVouchers = () => {
    api.getVouchers().then(setVouchers).catch(console.error);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const valorCompra = newCredito === 250 ? 180 : 350;
    try {
      await api.createVoucher({
        comprador: newComprador,
        valor_compra: valorCompra,
        valor_tatuagem: newCredito,
      });
      setNewComprador("");
      setNewCredito(250);
      loadVouchers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUtilizar = async (id: string) => {
    const usadoPor = prompt("Nome de quem utilizou o voucher:");
    if (usadoPor) {
      try {
        await api.utilizarVoucher(id, usadoPor);
        loadVouchers();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const ativos = vouchers.filter((v) => v.status === "ativo");
  const utilizados = vouchers.filter((v) => v.status === "utilizado");
  const caixa = ativos.reduce((acc, v) => acc + v.valor_compra, 0);
  const creditoTattoo = ativos.reduce((acc, v) => acc + v.valor_tatuagem, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <Ticket className="text-slate-300" size={32} />
          Tattoo Currency
        </h1>
        <p className="text-slate-500 mt-1">Emissão e controle de Vouchers</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card flex flex-col justify-center items-center text-center">
          <Ticket className="text-slate-300 mb-2" size={24} />
          <span className="text-2xl font-extrabold text-white">
            {ativos.length}
          </span>
          <span className="text-[10px] text-slate-400 uppercase font-bold">
            Ativos
          </span>
        </div>
        <div className="glass-card flex flex-col justify-center items-center text-center">
          <DollarSign className="text-slate-300 mb-2" size={24} />
          <span className="text-2xl font-extrabold text-white">
            R$ {caixa.toFixed(2)}
          </span>
          <span className="text-[10px] text-slate-400 uppercase font-bold">
            Caixa
          </span>
        </div>
        <div className="glass-card flex flex-col justify-center items-center text-center">
          <DollarSign className="text-slate-300 mb-2" size={24} />
          <span className="text-2xl font-extrabold text-white">
            R$ {creditoTattoo.toFixed(2)}
          </span>
          <span className="text-[10px] text-slate-400 uppercase font-bold">
            Crédito Tattoo
          </span>
        </div>
        <div className="glass-card flex flex-col justify-center items-center text-center">
          <CheckCircle2 className="text-slate-400 mb-2" size={24} />
          <span className="text-2xl font-extrabold text-white">
            {utilizados.length}
          </span>
          <span className="text-[10px] text-slate-400 uppercase font-bold">
            Utilizados
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 glass-card h-fit">
          <h2 className="text-xl font-bold text-white mb-4">Emitir Voucher</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Comprador
              </label>
              <input
                required
                type="text"
                value={newComprador}
                onChange={(e) => setNewComprador(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-white/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Crédito Tattoo
              </label>
              <select
                value={newCredito}
                onChange={(e) => setNewCredito(Number(e.target.value))}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-white/30"
              >
                <option value={250}>R$ 250,00</option>
                <option value={500}>R$ 500,00</option>
              </select>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-sm text-slate-400 mb-1">Preço a pagar</div>
              <div className="text-3xl font-black text-white">
                R$ {newCredito === 250 ? "180,00" : "350,00"}
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-white hover:bg-slate-200 text-slate-950 px-4 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              Confirmar Emissão
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {vouchers.map((v) => (
            <div
              key={v.id}
              className="glass-card flex flex-col sm:flex-row items-center gap-4 hover:-translate-y-0.5 hover:bg-white/[0.06] transition-all duration-200"
            >
              <div className="w-full sm:w-32 h-24 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center shrink-0">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  Crédito
                </span>
                <span className="text-2xl font-black text-white">
                  R${v.valor_tatuagem}
                </span>
              </div>

              <div className="flex-1 w-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-mono text-sm text-slate-300 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                    {v.codigo}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border border-white/10 text-slate-300`}
                  >
                    {v.status}
                  </span>
                </div>
                <div className="text-sm text-white font-medium mb-1">
                  Comprador: {v.comprador}
                </div>
                <div className="text-xs text-slate-500">
                  Validade:{" "}
                  {new Date(v.data_validade).toLocaleDateString("pt-BR")}
                  {v.usado_por && ` • Usado por: ${v.usado_por}`}
                </div>
              </div>

              {v.status === "ativo" && (
                <button
                  onClick={() => handleUtilizar(v.id)}
                  className="w-full sm:w-auto px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white transition-colors"
                >
                  Utilizar
                </button>
              )}
            </div>
          ))}
          {vouchers.length === 0 && (
            <div className="text-center text-slate-500 py-8 glass-card">
              Nenhum voucher emitido.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
