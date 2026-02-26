import React, { useEffect, useState } from "react";
import {
  Phone,
  Smartphone,
  QrCode,
  CheckCircle2,
  Send,
  Calendar,
  Trophy,
  Target,
  Bot,
} from "lucide-react";
import { api } from "../api";

export default function WhatsAppView() {
  const [status, setStatus] = useState<{ connected: boolean; phone?: string }>({
    connected: false,
  });
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkStatus = async () => {
    try {
      const res = await api.getWhatsappStatus();
      setStatus(res);
      if (res.connected) setQrCode(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConnect = async () => {
    setLoading(true);
    try {
      const res = await api.whatsappLogin();
      setQrCode(res.qr_data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await api.whatsappLogout();
      setStatus({ connected: false });
      setQrCode(null);
    } catch (error) {
      console.error(error);
    }
  };

  const features = [
    { icon: Send, label: "Envio de confirmações de pagamento" },
    { icon: Calendar, label: "Lembretes automáticos de parcela" },
    { icon: Trophy, label: "Notificação de sorteio" },
    { icon: Target, label: "Monitor de indicações via QR Code" },
    { icon: Bot, label: "Luna IA — assistente no WhatsApp" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <Phone className="text-slate-300" size={32} />
          Conexão WhatsApp
        </h1>
        <p className="text-slate-500 mt-1">
          Gerencie a conexão do bot com seu número
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card flex flex-col items-center justify-center p-8 text-center h-full">
          <h2 className="text-xl font-bold text-white mb-6">
            Status da Conexão
          </h2>

          <div className="relative mb-6">
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${status.connected ? "border-white/20 bg-white/5" : "border-white/5 bg-transparent"}`}
            >
              <Smartphone
                size={40}
                className={status.connected ? "text-white" : "text-slate-500"}
              />
            </div>
            {status.connected && (
              <div className="absolute top-0 right-0 w-6 h-6 bg-white rounded-full border-4 border-slate-900 animate-pulse" />
            )}
          </div>

          <div
            className={`text-3xl font-black mb-2 ${status.connected ? "text-white" : "text-slate-500"}`}
          >
            {status.connected ? "Conectado" : "Desconectado"}
          </div>

          {status.connected && status.phone && (
            <div className="text-slate-400 font-medium mb-8 flex items-center gap-2">
              <Smartphone size={16} />
              {status.phone}
            </div>
          )}

          {status.connected && (
            <button
              onClick={handleDisconnect}
              className="px-6 py-2 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white font-bold transition-all"
            >
              Desconectar
            </button>
          )}
        </div>

        <div className="glass-card flex flex-col items-center justify-center p-8 text-center h-full">
          <h2 className="text-xl font-bold text-white mb-6">
            Conectar WhatsApp
          </h2>

          {status.connected ? (
            <div className="flex flex-col items-center justify-center h-48">
              <CheckCircle2 size={64} className="text-white mb-4" />
              <p className="text-lg font-bold text-white">
                WhatsApp conectado com sucesso!
              </p>
            </div>
          ) : qrCode ? (
            <div className="flex flex-col items-center justify-center">
              <div className="bg-white p-4 rounded-2xl mb-6 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                <img src={qrCode} alt="QR Code" className="w-48 h-48" />
              </div>
              <p className="text-slate-400 text-sm">
                Escaneie o QR Code com seu WhatsApp
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full">
              <div className="w-48 h-48 border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center mb-6 bg-white/5">
                <QrCode size={48} className="text-slate-500 mb-2" />
                <span className="text-sm text-slate-400 font-medium px-4 text-center">
                  Clique para gerar QR Code
                </span>
              </div>
              <button
                onClick={handleConnect}
                disabled={loading}
                className="bg-white hover:bg-slate-200 disabled:opacity-50 text-slate-950 px-8 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              >
                {loading ? "Gerando..." : "Gerar QR Code"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="glass-card">
        <h3 className="text-lg font-bold text-white mb-4">Funcionalidades</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                    <Icon size={20} className="text-slate-300" />
                  </div>
                  <span className="text-sm font-medium text-slate-200">
                    {f.label}
                  </span>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                    status.connected
                      ? "border border-white/20 text-white"
                      : "border border-white/5 text-slate-500"
                  }`}
                >
                  {status.connected ? "Ativo" : "Pendente"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
