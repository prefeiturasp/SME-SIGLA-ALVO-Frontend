export interface ICandidato {
  nome: string;
  classificacao_geral: number;
  classificacao_especial: number;
  classificacao_nna: number;
  [key: string]: any; // Permite campos adicionais do ConcursoCandidatoSerializer
}

export interface IBuscarPorUuidsPayload {
  uuids: string[];
}

export interface IBuscarPorUuidsResponse {
  results: ICandidato[];
  total?: number;
  uuids_enviados?: number;
  uuids_encontrados?: number;
}
