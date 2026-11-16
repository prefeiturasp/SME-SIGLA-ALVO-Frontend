/**
 * Tipos alinhados aos serializers do backend (exportacao vagas processo / vagas sigpec).
 */

export interface IExportacaoVagasPayload {
  processo_uuid: string;
  cargo_uuid: string;
  concurso_uuid?: string;
  concurso_nome?: string;
  /** Nome do processo (enviado pelo front para persistir e usar no nome do arquivo). */
  processo_nome?: string;
  /** Nome do cargo (enviado pelo front para persistir e usar no nome do arquivo). */
  cargo_nome?: string;
  /** Código do cargo (vindo de getCargosProcesso); evita chamada à API de convocação no create. */
  cargo_codigo?: number | string;
}

export interface IExportacaoVagasListItem {
  uuid: string;
  criado_em: string;
  atualizado_em: string;
  processo_uuid: string;
  cargo_uuid: string;
  concurso_uuid: string | null;
  concurso_nome: string | null;
  /** Nome do cargo (persistido no create; preenchido pelo backend na listagem quando vazio). */
  cargo_nome?: string | null;
  /** Nome/descrição do processo para exibição. */
  processo_nome?: string | null;
  /** Código do cargo (persistido no create quando enviado pelo front). */
  cargo_codigo?: number | null;
}

/** Filtros opcionais para listagem paginada de exportações (vagas-processo / vagas-sigpec). */
export interface IExportacaoVagasListFilters {
  processo_uuid?: string;
  cargo_uuid?: string;
  concurso_uuid?: string;
  concurso_nome?: string;
  search?: string;
  ordering?: string;
}

export type ExportacaoTipo = "vagas-processo" | "vagas-sigpec";

/** Payload para criação de exportação de candidatos por processo. */
export interface IExportacaoCandidatosPayload {
  processo_uuid: string;
  cargo_uuid: string;
  concurso_uuid?: string;
  concurso_nome?: string;
  /** Código do concurso (evita chamada à API de concursos no create). */
  concurso_codigo?: number | string;
  /** Data de criação do concurso (ex.: ISO). */
  concurso_data_criacao?: string;
  processo_nome?: string;
  cargo_nome?: string;
  cargo_codigo?: number | string;
}

/** Item da listagem de exportações de candidatos por processo. */
export interface IExportacaoCandidatosListItem {
  uuid: string;
  criado_em: string;
  atualizado_em: string;
  processo_uuid: string;
  cargo_uuid: string;
  concurso_uuid: string | null;
  concurso_nome: string | null;
  concurso_codigo?: number | null;
  concurso_data_criacao?: string | null;
  processo_nome?: string | null;
  cargo_nome?: string | null;
  cargo_codigo?: number | null;
}

/** Filtros para listagem de exportações de candidatos por processo. */
export interface IExportacaoCandidatosListFilters {
  processo_uuid?: string;
  cargo_uuid?: string;
  concurso_uuid?: string;
  search?: string;
  ordering?: string;
}

/** Payload para criação de exportação de lotes SIGPEC. */
export interface IExportacaoLotePayload {
  concurso_uuid: string;
  concurso_nome?: string;
  numero_lote?: number;
  lote_uuid: string;
  codigo_cargo?: string;
}

export type StatusExportacaoLote = "SUCESSO" | "ATENCAO" | "ERRO" | "PENDENTE" | "PROCESSANDO";

/** Item da listagem de histórico de exportações de lotes. */
export interface IExportacaoLoteListItem {
  uuid: string;
  criado_em: string;
  atualizado_em: string;
  concurso_uuid: string;
  concurso_nome: string;
  numero_lote: number | null;
  codigo_cargo: string | null;
  lote_uuid: string | null;
  nome_arquivo: string;
  status: StatusExportacaoLote;
}

/** Filtros para listagem de exportações de lotes. */
export interface IExportacaoLoteListFilters {
  concurso_uuid?: string;
  lote_uuid?: string;
  numero_lote?: number;
  concurso_nome?: string;
  ordering?: string;
}
