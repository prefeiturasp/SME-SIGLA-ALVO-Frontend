  
export interface IAgenda {
  uuid: string;
  processo_convocacao_uuid: string;
  processo_convocacao_nome: string;
  cargo_uuid: string;
  cargo_nome: string;
  data_escolha: string;
  modalidade?: 'Presencial' | 'Online' | null;
  escolha_em?: string | null; 
  nomeacao_em?: string | null; 
  classificacao?: number | null;
  sessao?: string | null;
  retardatario?: boolean | null;
  hora_convocacao_inicio?: string | null; 
  hora_convocacao_fim?: string | null; 
  criado_em: string;
  atualizado_em: string;
  candidatos_uuids?: string[]; // opcional: pode vir no agendasData
}

export interface IAgendaCreate {
  uuid?: string; // UUID opcional para permitir envio de agendas existentes no POST
  // Para criação em lote, estes campos vão na raiz do payload
  // e não em cada agenda individual.
  processo_convocacao_uuid?: string;
  processo_convocacao_nome?: string;
  cargo_uuid?: string;
  cargo_nome?: string;
  cargo_codigo?: string;
  data_escolha?: string;
  modalidade?: 'PRESENCIAL' | 'ONLINE' | null;
  escolha_em?: string | null;
  nomeacao_em?: string | null;
  classificacao?: number | null;
  sessao?: string | null;
  retardatario?: boolean | null;
  hora_convocacao_inicio?: string | null;
  hora_convocacao_fim?: string | null;
  candidatos_uuids?: string[]; // fatia de candidatos atribuída a esta agenda (opcional)
}

export interface IAgendaFilters {
  processo_convocacao_uuid?: string;
  cargo_uuid?: string;
  search?: string; // Busca por processo_convocacao_nome ou cargo_nome
}

// Payload para criação em lote: envia todos os candidatos em nível superior
// e a lista de agendas (sem candidatos fatiados por agenda).
export interface IAgendaBulkCreatePayload {
  processo_convocacao_uuid: string;
  processo_convocacao_nome: string;
  modalidade?: 'PRESENCIAL' | 'ONLINE' | null;
  candidatos_uuids: string[];
  agendas: IAgendaCreate[];
}
 