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
export interface IImportacaoVagasFiltros {
  cargo: string | undefined;
  arquivo: File | null;
}
export interface IImportacaoVagasPayload {
  cargo: string;
  arquivo: File;
  tipo: string;
}