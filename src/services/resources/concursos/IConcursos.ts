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
  banca_responsavel: string;
  status: string;
  situacao: ConcursoSituacao;
}

export type ConcursoStatus = "ATIVO" | "INATIVO";

// Situacao do ciclo de vida do concurso (distinta de status ATIVO/INATIVO).
// INCOMPLETO: cadastro iniciado (passo 1) e nao finalizado.
// COMPLETO: cadastro finalizado (ultimo passo do wizard).
// EM_ANDAMENTO: houve convocacao; edicao bloqueada.
// FINALIZADO / CANCELADO: reservados para uso futuro.
export type ConcursoSituacao =
  | "INCOMPLETO"
  | "COMPLETO"
  | "EM_ANDAMENTO"
  | "FINALIZADO"
  | "CANCELADO";

// Campos de publicacoes, resultados e vigencia (passos 2 e 3 do wizard).
// Todos opcionais/nullable, espelhando o backend (ConcursoSerializer).
export interface IConcursoCamposDetalhados {
  data_autorizacao: string | null;
  data_abertura: string | null;
  classificacao_final: string | null;
  link_edital: string;
  habilitados_geral: number | null;
  habilitados_nna: number | null;
  habilitados_pcd: number | null;
  retificacoes: string;
  data_homologacao: string | null;
  data_prorrogacao: string | null;
  vigencia_inicio: string | null;
  vigencia_fim: string | null;
}

// Retorno do endpoint de detalhe (ConcursoSerializer)
export interface IConcursoDetalhe extends IConcursoCamposDetalhados {
  uuid: string;
  nome: string;
  cargos: ICargos2[];
  numero_processo: string;
  codigo: number | null;
  banca_responsavel: string;
  status: ConcursoStatus;
  situacao: ConcursoSituacao;
}

export interface IConcursoPayload extends IConcursoCamposDetalhados {
  nome: string;
  cargos_ids: string[];
  numero_processo: string;
  banca_responsavel: string;
  status: ConcursoStatus;
  situacao?: ConcursoSituacao;
}

export interface IConcursoFiltros {
  nome?: string;
  codigo_cargo?: number;
  descricao_cargo?: string;
  numero_processo?: string;
  banca_responsavel?: string;
  status?: ConcursoStatus;
}
