export interface ICandidato {
  nome: string;
  classificacao_geral: number;
  classificacao_especial: number;
  classificacao_nna: number;
  categoria_efetiva?: 'GERAL' | 'NNA' | 'PCD';
  [key: string]: any; // Permite campos adicionais do ConcursoCandidatoSerializer
}

export interface ICandidatoMandadoJudicial {
  uuid: string;
  candidato: {
    uuid: string;
    nome: string;
    cpf: string;
  } | null;
  categoria_efetiva?: 'GERAL' | 'NNA' | 'PCD';
  classificacao: number | null;
  classificacao_pcd: number | null;
  classificacao_nna: number | null;
  codigo_cargo: string | null;
  reclassificacao_judicial: {
    desclassificado_de: string;
    motivo: string;
    criado_em: string;
  } | null;
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
