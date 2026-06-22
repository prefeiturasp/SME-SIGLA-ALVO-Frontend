export interface IExtracaoDadosHabilitados {
  total: number;
  pcd: number;
  nna: number;
  geral: number;
}

export interface IExtracaoDadosCandidatosAno {
  convocados: number;
  "nao-convocados": number;
  habilitados?: IExtracaoDadosHabilitados;
}

export interface IExtracaoDadosEscolhasDre {
  nome: string;
  escolhas: number;
  vagas: number;
  codigo_cargo?: number;
  cargo_descricao?: string;
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
  ultima_escolha_em?: string | null;
}

export interface IExtracaoDadosEscolhasTodos extends IExtracaoDadosEscolhasAno {
  dres_concursos?: Record<string, IExtracaoDadosDreConcurso[]>;
  ultima_escolha_em?: string | null;
}

export interface IExtracaoDadosConcursoAno {
  "autorizacoes-publicadas": number;
}

export interface IExtracaoDadosConcursoCargo {
  uuid: string;
  nome: string;
  codigo: number;
  autorizacoes: number;
  data_autorizacao: string;
}

export interface IExtracaoDadosConcursoPorAno extends IExtracaoDadosConcursoAno {
  cargos?: IExtracaoDadosConcursoCargo[];
}

export interface IExtracaoDadosConcursoFiltrado {
  "autorizacoes-publicadas"?: number;
  cargos?: IExtracaoDadosConcursoCargo[];
  [ano: string]:
    | IExtracaoDadosConcursoPorAno
    | IExtracaoDadosConcursoCargo[]
    | number
    | undefined;
}

export interface IExtracaoDadosConcursoTodos extends IExtracaoDadosConcursoAno {
  cargos?: IExtracaoDadosConcursoCargo[];
}

export interface IExtracaoDadosEscolhasFiltrado extends Record<string, IExtracaoDadosEscolhasAno> {
  dres_concursos?: Record<string, IExtracaoDadosDreConcurso[]>;
  ultima_escolha_em?: string | null;
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

export interface IExtracaoDadosComparativoIndicadores {
  convocados: number | null;
  naoConvocados: number | null;
  escolhasRealizadas: number | null;
  reconvocacoes: number | null;
  semEscolha: number | null;
  autorizacoes: number | null;
}

export interface IExtracaoDadosComparativoDre {
  escolhas: number | null;
  vagas: number | null;
  percentualPreenchimento: number | null;
}

export interface IExtracaoDadosComparativo {
  anos: number[];
  indicadores: IExtracaoDadosComparativoIndicadores;
  dres: Record<string, IExtracaoDadosComparativoDre>;
}

export interface IExtracaoDadosFiltro {
  ano: number;
  processo_uuids: string[];
}

export interface IExtracaoDadosResponse {
  concurso_uuid: string;
  filtros: IExtracaoDadosFiltro[];
  candidatos: IExtracaoDadosCandidatos;
  escolhas: IExtracaoDadosEscolhasFiltrado;
  concurso: IExtracaoDadosConcursoFiltrado;
  comparativo?: IExtracaoDadosComparativo;
}

export interface IExtracaoDadosTodosResponse {
  candidatos: IExtracaoDadosCandidatosConsolidado;
  escolhas: IExtracaoDadosEscolhasTodos;
  concurso: IExtracaoDadosConcursoTodos;
}

export interface IExtracaoDadosParams {
  concurso_uuid: string;
  ano: string[];
}

export type IndicadorValor = number | null;

export interface IExtracaoDadosIndicadores {
  modoComparativo: false;
  habilitados: number;
  listaEspecifica: number;
  listaGeral: number;
  listaPcd: number;
  listaNna: number;
  convocados: IndicadorValor;
  escolhasRealizadas: IndicadorValor;
  naoConvocados: IndicadorValor;
  reconvocacoes: IndicadorValor;
  semEscolha: IndicadorValor;
  autorizacoes: IndicadorValor;
}

export interface IExtracaoDadosIndicadorComparativoItem {
  valorAnoAntigo: number;
  valorAnoRecente: number;
  variacaoPercentual: number | null;
  valorUnico?: number;
}

export interface IExtracaoDadosIndicadorBreakdownComparativo {
  label: string;
  valorAnoAntigo: number;
  valorAnoRecente: number;
}

export interface IExtracaoDadosIndicadoresComparativo {
  modoComparativo: true;
  anoAntigo: string;
  anoRecente: string;
  habilitados: IExtracaoDadosIndicadorComparativoItem;
  listaEspecifica: IExtracaoDadosIndicadorComparativoItem & {
    breakdown: IExtracaoDadosIndicadorBreakdownComparativo[];
  };
  convocados: IExtracaoDadosIndicadorComparativoItem;
  escolhasRealizadas: IExtracaoDadosIndicadorComparativoItem;
  naoConvocados: IExtracaoDadosIndicadorComparativoItem;
  reconvocacoes: IExtracaoDadosIndicadorComparativoItem;
  semEscolha: IExtracaoDadosIndicadorComparativoItem;
  autorizacoes: IExtracaoDadosIndicadorComparativoItem;
}
