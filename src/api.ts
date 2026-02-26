export interface DashboardStats {
  total_turmas: number;
  turmas_ativas: number;
  total_participantes: number;
  total_arrecadado: number;
  total_pendente: number;
  total_sorteios: number;
  total_indicadores: number;
  total_conversoes: number;
  vouchers_ativos: number;
}

export interface Turma {
  id: string;
  nome: string;
  valor_total: number;
  num_parcelas: number;
  valor_parcela: number;
  dia_pagamento: number;
  dia_sorteio: number;
  mes_atual: number;
  status: string;
  created_at: string;
}

export interface Participante {
  id: string;
  turma_id: string;
  nome: string;
  telefone: string;
  status: string;
  parcelas_pagas: number;
  total_pago: number;
  saldo_tatuagem: number;
  ja_sorteado: boolean;
  mes_sorteado: number | null;
  created_at: string;
}

export interface Parcela {
  id: string;
  participante_id: string;
  mes: number;
  valor: number;
  data_pagamento: string | null;
  status: string;
}

export interface Sorteio {
  id: string;
  turma_id: string;
  mes: number;
  vencedor_id: string;
  vencedor_nome: string;
  data_realizacao: string;
}

export interface Indicador {
  id: string;
  nome: string;
  telefone: string;
  documento_sufixo: string;
  codigo: string;
  link: string;
  qr_code_url: string;
  total_indicacoes: number;
  total_conversoes: number;
  created_at: string;
}

export interface Indicado {
  id: string;
  indicador_id: string;
  nome: string;
  status: string;
  origem: string;
  data: string;
}

export interface Voucher {
  id: string;
  codigo: string;
  comprador: string;
  cliente_id: string | null;
  valor_compra: number;
  valor_tatuagem: number;
  status: string;
  data_emissao: string;
  data_validade: string;
  usado_por: string | null;
}

export interface MensagemLog {
  id: string;
  tipo: string;
  destinatario_nome: string;
  destinatario_telefone: string;
  conteudo: string;
  status: string;
  created_at: string;
}

export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  total_gasto: number;
  created_at: string;
}

const API_BASE = "/api";

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Erro na requisição");
  }
  if (response.status === 204) return {} as T;
  return response.json();
}

export const api = {
  getDashboard: () => fetchApi<DashboardStats>("/dashboard"),

  getTurmas: () => fetchApi<Turma[]>("/turmas"),
  createTurma: (data: Partial<Turma>) =>
    fetchApi<Turma>("/turmas", { method: "POST", body: JSON.stringify(data) }),
  getTurma: (id: string) => fetchApi<Turma>(`/turmas/${id}`),
  updateTurma: (id: string, data: Partial<Turma>) =>
    fetchApi<Turma>(`/turmas/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteTurma: (id: string) =>
    fetchApi<void>(`/turmas/${id}`, { method: "DELETE" }),

  getParticipantes: (turmaId: string) =>
    fetchApi<Participante[]>(`/turmas/${turmaId}/participantes`),
  createParticipante: (turmaId: string, data: Partial<Participante>) =>
    fetchApi<Participante>(`/turmas/${turmaId}/participantes`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateParticipante: (id: string, data: Partial<Participante>) =>
    fetchApi<Participante>(`/participantes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteParticipante: (id: string) =>
    fetchApi<void>(`/participantes/${id}`, { method: "DELETE" }),
  pagarParcela: (id: string, meses: number = 1) =>
    fetchApi<Participante>(`/participantes/${id}/pagar?meses=${meses}`, {
      method: "POST",
    }),
  getParcelas: (id: string) =>
    fetchApi<Parcela[]>(`/participantes/${id}/parcelas`),

  getSorteios: (turmaId: string) =>
    fetchApi<Sorteio[]>(`/turmas/${turmaId}/sorteios`),
  getElegiveis: (turmaId: string) =>
    fetchApi<Participante[]>(`/turmas/${turmaId}/elegiveis`),
  sortear: (turmaId: string) =>
    fetchApi<Sorteio>(`/turmas/${turmaId}/sortear`, { method: "POST" }),

  getIndicadores: () => fetchApi<Indicador[]>("/indicadores"),
  createIndicador: (data: Partial<Indicador>) =>
    fetchApi<Indicador>("/indicadores", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getIndicados: (indicadorId: string) =>
    fetchApi<Indicado[]>(`/indicadores/${indicadorId}/indicados`),
  createIndicado: (data: Partial<Indicado>) =>
    fetchApi<Indicado>("/indicados", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getVouchers: () => fetchApi<Voucher[]>("/vouchers"),
  createVoucher: (data: Partial<Voucher>) =>
    fetchApi<Voucher>("/vouchers", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  utilizarVoucher: (id: string, usadoPor: string) =>
    fetchApi<Voucher>(
      `/vouchers/${id}/utilizar?usado_por=${encodeURIComponent(usadoPor)}`,
      { method: "POST" },
    ),

  getClientes: () => fetchApi<Cliente[]>("/clientes"),
  createCliente: (data: Partial<Cliente>) =>
    fetchApi<Cliente>("/clientes", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMensagens: () => fetchApi<MensagemLog[]>("/mensagens"),
  sendConfirmacao: (participanteId: string, data: any) =>
    fetchApi<any>(`/mensagens/confirmacao/${participanteId}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  sendLembrete: (turmaId: string, data: any) =>
    fetchApi<any>(`/mensagens/lembrete/${turmaId}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  sendSorteio: (turmaId: string, data: any) =>
    fetchApi<any>(`/mensagens/sorteio/${turmaId}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getWhatsappStatus: () =>
    fetchApi<{ connected: boolean; phone?: string }>("/whatsapp/status"),
  whatsappLogin: () =>
    fetchApi<{ qr_data: string }>("/whatsapp/login", { method: "POST" }),
  whatsappLogout: () =>
    fetchApi<{ status: string }>("/whatsapp/logout", { method: "POST" }),

  chatAgent: (message: string) =>
    fetchApi<{ response: string; timestamp: string }>("/agent/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),

  seed: (data: any) =>
    fetchApi<any>("/seed", { method: "POST", body: JSON.stringify(data) }),
};
