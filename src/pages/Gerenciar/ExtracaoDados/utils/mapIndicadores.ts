import type {
  IExtracaoDadosCandidatosAno,
  IExtracaoDadosIndicadores,
  IExtracaoDadosResponse,
  IExtracaoDadosTodosResponse,
} from "../../../../services/resources/relatorios/IExtracaoDados";

export const INDICADORES_VAZIOS: IExtracaoDadosIndicadores = {
  habilitados: 0,
  listaEspecifica: 0,
  listaGeral: 0,
  listaPcd: 0,
  listaNna: 0,
  convocados: 0,
  escolhasRealizadas: 0,
  naoConvocados: 0,
  reconvocacoes: 0,
  semEscolha: 0,
  autorizacoes: 0,
};

const isCandidatosAno = (
  value: unknown
): value is IExtracaoDadosCandidatosAno =>
  typeof value === "object" &&
  value !== null &&
  "convocados" in value &&
  "nao-convocados" in value;

export const mapExtracaoDadosTodosToIndicadores = (
  data: IExtracaoDadosTodosResponse | undefined
): IExtracaoDadosIndicadores => {
  if (!data) {
    return INDICADORES_VAZIOS;
  }

  const { habilitados, convocados, "nao-convocados": naoConvocados } = data.candidatos;
  const { escolha, reconvocacao, "nao-escolha": semEscolha } = data.escolhas;

  const listaGeral = habilitados?.geral ?? 0;
  const listaPcd = habilitados?.pcd ?? 0;
  const listaNna = habilitados?.nna ?? 0;

  return {
    habilitados: habilitados?.total ?? 0,
    listaEspecifica: listaGeral + listaPcd + listaNna,
    listaGeral,
    listaPcd,
    listaNna,
    convocados: convocados ?? 0,
    escolhasRealizadas: escolha ?? 0,
    naoConvocados: naoConvocados ?? 0,
    reconvocacoes: reconvocacao ?? 0,
    semEscolha: semEscolha ?? 0,
    autorizacoes: data.concurso?.["autorizacoes-publicadas"] ?? 0,
  };
};

export const mapExtracaoDadosToIndicadores = (
  data: IExtracaoDadosResponse | undefined,
  ano: string
): IExtracaoDadosIndicadores => {
  if (!data || !ano) {
    return INDICADORES_VAZIOS;
  }

  const { habilitados } = data.candidatos;
  const candidatosAno = data.candidatos[ano];
  const escolhasAno = data.escolhas[ano];

  const listaGeral = habilitados?.geral ?? 0;
  const listaPcd = habilitados?.pcd ?? 0;
  const listaNna = habilitados?.nna ?? 0;

  return {
    habilitados: habilitados?.total ?? 0,
    listaEspecifica: listaGeral + listaPcd + listaNna,
    listaGeral,
    listaPcd,
    listaNna,
    convocados: isCandidatosAno(candidatosAno) ? candidatosAno.convocados : 0,
    escolhasRealizadas: escolhasAno?.escolha ?? 0,
    naoConvocados: isCandidatosAno(candidatosAno)
      ? candidatosAno["nao-convocados"]
      : 0,
    reconvocacoes: escolhasAno?.reconvocacao ?? 0,
    semEscolha: escolhasAno?.["nao-escolha"] ?? 0,
    autorizacoes: data.concurso?.["autorizacoes-publicadas"] ?? 0,
  };
};
