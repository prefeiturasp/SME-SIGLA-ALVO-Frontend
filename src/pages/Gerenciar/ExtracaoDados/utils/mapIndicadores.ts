import type {
  IExtracaoDadosCandidatosAno,
  IExtracaoDadosIndicadores,
  IExtracaoDadosResponse,
  IExtracaoDadosTodosResponse,
} from "../../../../services/resources/relatorios/IExtracaoDados";
import { obterAutorizacoesDoAno } from "./obterAutorizacoesDoAno";

export const INDICADORES_VAZIOS: IExtracaoDadosIndicadores = {
  modoComparativo: false,
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
  pendentesEscolha: 0,
  autorizacoes: 0,
};

const isCandidatosAno = (
  value: unknown
): value is IExtracaoDadosCandidatosAno =>
  typeof value === "object" &&
  value !== null &&
  "convocados" in value &&
  "nao-convocados" in value;

/**
 * Pendentes de escolha: convocados que ainda nao registraram nenhuma situacao
 * de escolha (escolha, nao-escolha ou reconvocacao). Valores nulos sao tratados
 * como 0 e o resultado nunca e negativo.
 */
const calcularPendentes = (
  convocados: number | null,
  escolhas: number | null,
  semEscolha: number | null,
  reconvocacoes: number | null
): number =>
  Math.max(
    0,
    (convocados ?? 0) -
      (escolhas ?? 0) -
      (semEscolha ?? 0) -
      (reconvocacoes ?? 0)
  );

const obterIndicadoresHabilitados = (
  habilitados: IExtracaoDadosResponse["candidatos"]["habilitados"] | undefined
) => {
  const listaGeral = habilitados?.geral ?? 0;
  const listaPcd = habilitados?.pcd ?? 0;
  const listaNna = habilitados?.nna ?? 0;

  return {
    habilitados: habilitados?.total ?? 0,
    listaEspecifica: listaGeral + listaPcd + listaNna,
    listaGeral,
    listaPcd,
    listaNna,
  };
};

export const mapExtracaoDadosTodosToIndicadores = (
  data: IExtracaoDadosTodosResponse | undefined
): IExtracaoDadosIndicadores => {
  if (!data) {
    return INDICADORES_VAZIOS;
  }

  const {
    habilitados,
    convocados,
    "nao-convocados": naoConvocados,
  } = data.candidatos;
  const { escolha, reconvocacao, "nao-escolha": semEscolha } = data.escolhas;

  return {
    modoComparativo: false,
    ...obterIndicadoresHabilitados(habilitados),
    convocados: convocados ?? 0,
    escolhasRealizadas: escolha ?? 0,
    naoConvocados: naoConvocados ?? 0,
    reconvocacoes: reconvocacao ?? 0,
    semEscolha: semEscolha ?? 0,
    pendentesEscolha: calcularPendentes(
      convocados,
      escolha,
      semEscolha,
      reconvocacao
    ),
    autorizacoes: data.concurso?.["autorizacoes-publicadas"] ?? 0,
  };
};

export const mapExtracaoDadosToIndicadores = (
  data: IExtracaoDadosResponse | undefined,
  anos: string[]
): IExtracaoDadosIndicadores => {
  if (!data || !anos.length) {
    return INDICADORES_VAZIOS;
  }

  const habilitadosBase = obterIndicadoresHabilitados(data.candidatos.habilitados);

  const ano = anos[0];
  const candidatosAno = data.candidatos[ano];
  const escolhasAno = data.escolhas[ano];

  const convocados = isCandidatosAno(candidatosAno)
    ? candidatosAno.convocados
    : 0;
  const escolhasRealizadas = escolhasAno?.escolha ?? 0;
  const reconvocacoes = escolhasAno?.reconvocacao ?? 0;
  const semEscolha = escolhasAno?.["nao-escolha"] ?? 0;

  return {
    modoComparativo: false,
    ...habilitadosBase,
    convocados,
    escolhasRealizadas,
    naoConvocados: isCandidatosAno(candidatosAno)
      ? candidatosAno["nao-convocados"]
      : 0,
    reconvocacoes,
    semEscolha,
    pendentesEscolha: calcularPendentes(
      convocados,
      escolhasRealizadas,
      semEscolha,
      reconvocacoes
    ),
    autorizacoes: obterAutorizacoesDoAno(data.concurso, ano, {
      permitirFallbackRaiz: true,
    }),
  };
};
