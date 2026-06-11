export interface IExtracaoDadosHabilitados {
  total: number;
  pcd: number;
  nna: number;
  geral: number;
}

export interface IExtracaoDadosCandidatosAno {
  convocados: number;
  "nao-convocados": number;
}

export interface IExtracaoDadosEscolhasDre {
  nome: string;
  escolhas: number;
  vagas: number;
}

export interface IExtracaoDadosEscolhasAno {
  escolha: number;
  reconvocacao: number;
  "nao-escolha": number;
  dres: IExtracaoDadosEscolhasDre[];
}

export interface IExtracaoDadosDreConcurso {
  nome: string;
  escolhas: number;
  vagas: number;
  codigo_cargo?: number;
  cargo_descricao?: string;
}

export interface IExtracaoDadosEscolhasTodos extends IExtracaoDadosEscolhasAno {
  dres_concursos?: Record<string, IExtracaoDadosDreConcurso[]>;
}

export interface IExtracaoDadosConcursoAno {
  "autorizacoes-publicadas": number;
}

export interface IExtracaoDadosCandidatos {
  habilitados: IExtracaoDadosHabilitados;
  [ano: string]: IExtracaoDadosHabilitados | IExtracaoDadosCandidatosAno;
}

export interface IExtracaoDadosCandidatosConsolidado {
  habilitados: IExtracaoDadosHabilitados;
  convocados: number;
  "nao-convocados": number;
}

export interface IExtracaoDadosResponse {
  candidatos: IExtracaoDadosCandidatos;
  escolhas: Record<string, IExtracaoDadosEscolhasAno>;
  concurso: Record<string, IExtracaoDadosConcursoAno>;
}

export interface IExtracaoDadosTodosResponse {
  candidatos: IExtracaoDadosCandidatosConsolidado;
  escolhas: IExtracaoDadosEscolhasTodos;
  concurso: IExtracaoDadosConcursoAno;
}

export interface IExtracaoDadosParams {
  concurso_uuid: string;
  ano: string;
}

export interface IExtracaoDadosIndicadores {
  habilitados: number;
  listaEspecifica: number;
  listaGeral: number;
  listaPcd: number;
  listaNna: number;
  convocados: number;
  escolhasRealizadas: number;
  naoConvocados: number;
  reconvocacoes: number;
  semEscolha: number;
  autorizacoes: number;
}
