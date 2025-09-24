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
  cargo: string | undefined;
  concurso_uuid?: string;
  concurso_nome?: string;
  arquivo: File | null;
  data_fechamento_modulo?: string;
  metodo_de_importacao: MetodoImportacao;
  opcoes_de_importacao?: string;
 }
export interface IImportacaoVagasPayload {
  opcoes_de_importacao?: string;
  concurso_nome?:string;
  concurso_uuid?:string;
  cargo?: string;
  arquivo: File;
  tipo?: string;  
}