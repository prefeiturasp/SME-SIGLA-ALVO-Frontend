export interface IImportacaoHabilitadosFiltros {
  concurso: string | undefined;
  arquivo: File | null;
}

export interface IUltimaImportacaoHabilitados {
  arquivo: string;
  concurso: string;
}

export interface IImportacaoHabilitadosPayload {
  concurso_nome: string;
  concurso_uuid: string;
  arquivo: File;
  tipo: string;
}
