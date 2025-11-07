  
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
}

export interface IAgendaCreate {
  uuid?: string; // UUID opcional para permitir envio de agendas existentes no POST
  processo_convocacao_uuid: string;
  processo_convocacao_nome: string;
  cargo_uuid: string;
  cargo_nome: string;
  data_escolha?: string;
  modalidade?: 'Presencial' | 'Online' | null;
  escolha_em?: string | null;
  nomeacao_em?: string | null;
  classificacao?: number | null;
  sessao?: string | null;
  retardatario?: boolean | null;
  hora_convocacao_inicio?: string | null;
  hora_convocacao_fim?: string | null;
}

export interface IAgendaFilters {
  processo_convocacao_uuid?: string;
  cargo_uuid?: string;
  search?: string; // Busca por processo_convocacao_nome ou cargo_nome
}
 