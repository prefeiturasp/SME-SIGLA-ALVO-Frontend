export interface ICargos {
  value: string;
  label: string;
  codigo: string;
}

export interface ICargos2 {
  uuid: string;
  nome: string;
  codigo: number;
}

// Retorno do endpoint em formato select (?formato=select)
export interface IConcurso {
  label: string;
  value: string;
  cargos: ICargos[];
}

// Retorno da listagem paginada (ConcursoListSerializer)
export interface IConcursoLista {
  uuid: string;
  nome: string;
  cargos: ICargos2[];
  cargos_descricao: string[];
  numero_processo: string;
  ano_edital: number | null;
  banca_responsavel: string;
  ativo: boolean;
}

// Retorno do endpoint de detalhe (ConcursoSerializer)
export interface IConcursoDetalhe {
  uuid: string;
  nome: string;
  cargos: ICargos2[];
  numero_processo: string;
  codigo: number | null;
  ano_edital: number | null;
  banca_responsavel: string;
  ativo: boolean;
}

export interface IConcursoPayload {
  nome: string;
  cargos_ids: string[];
  numero_processo: string;
  ano_edital: number | null;
  banca_responsavel: string;
  ativo: boolean;
}

export interface IConcursoFiltros {
  nome?: string;
  codigo_cargo?: number;
  descricao_cargo?: string;
  numero_processo?: string;
  ano_edital?: number;
  banca_responsavel?: string;
  ativo?: boolean;
}
