export const MetodoImportacao = {
  WebService: 1 as const,
  Arquivo: 2 as const,
};
export type MetodoImportacao = typeof MetodoImportacao[keyof typeof MetodoImportacao];

export interface IImportacaoHabilitadosFiltros {
  concurso: string | undefined;
  arquivo: File | null;
}

export interface IUltimaImportacaoHabilitados {
  arquivo: string;
  concurso: string;
  data_importacao: string;
}

export interface IImportacaoHabilitadosPayload {
  concurso: string;
  arquivo: File;
  tipo: string;
}
export interface IImportacaoVagasForm {
  processo_convocacao: string;
  arquivo: File | null;
 }
export interface IImportacaoVagasPayload {
  processo_nome?:string;
  processo_uuid?:string;
  arquivo: File;
}

export interface IInclusaoVagasEscolasPayload {
  processo_uuid: string;
  processo_nome: string;
  vagas: Array<{
    uuid: string;
    data_fechamento_modulo: string;
    cargo_codigo: number;
    cargo_descricao: string;
    codigo_eol: string;
    vagas_precarias: number;
    vagas_definitivas: number;
  }>;
}