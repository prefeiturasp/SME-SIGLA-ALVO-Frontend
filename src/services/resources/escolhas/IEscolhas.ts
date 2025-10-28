export interface IEscolhas {
  uuid: string;
  data_fechamento_modulo: string;
  cargo_codigo: number;
  cargo_descricao: string;
  vagas_precarias: number;
  vagas_definitivas: number;
  status: string;
  escola_uuid: string;
  concurso_nome: string;
  concurso_uuid: string;    
}

export interface IEscolhasFiltro {
  processo_uuid: string;
  cargo_codigo: string;
}

// Interfaces para integração com MS-Escolhas
export interface IDRE {
  uuid: string;
  codigo: string;
  nome: string;
}

export interface IDREsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IDRE[];
}

export interface IEscola {
  uuid: string;
  codigo_eol: string;
  dre: {
    nome: string;
    uuid: string;
    codigo: string;
  };
  nome_oficial: string;
  vagas_definitivas: number;
  vagas_precarias: number;
  tipo_ue: string;
}

export interface IEscolasResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IEscola[];
}

export interface IBuscarDREsParams {
  page_size?: number;
}

export interface IBuscarEscolasParams {
  dre__codigo: string;
  nome?: string;
  page_size?: number;
}
