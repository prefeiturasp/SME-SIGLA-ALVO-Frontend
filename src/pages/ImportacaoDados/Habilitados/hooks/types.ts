export interface IImportacaoHabilitadosFiltros {
  concurso: string | undefined;
  arquivo: File | null;
  observacao?: string;
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
  observacao?: string;
}
