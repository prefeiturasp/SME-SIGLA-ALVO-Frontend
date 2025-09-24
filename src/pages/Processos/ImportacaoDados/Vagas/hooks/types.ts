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
  concurso: string | undefined;
  arquivo: File | null;
  data_fechamento_modulo?: string;
  metodo_de_importacao: number;
  opcoes_de_importacao?: string;
 }
export interface IImportacaoVagasPayload {
  opcoes_de_importacao?: string;
  concurso_nome?:string;
  concurso_uuid?:string;
  cargo?: string;
  arquivo: File;
  tipo: string;  
}