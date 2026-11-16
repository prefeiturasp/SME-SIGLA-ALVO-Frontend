import type {
  IExtracaoDadosCandidatosAno,
  IExtracaoDadosContagem,
  IExtracaoDadosEscolhasAno,
  IExtracaoDadosIndicadores,
  IExtracaoDadosResponse,
  IExtracaoDadosTodosResponse,
  IIndicadorDetalhado,
} from "../../../../services/resources/relatorios/IExtracaoDados";
import { obterAutorizacoesDoAno } from "./obterAutorizacoesDoAno";

export const CONTAGEM_VAZIA: IExtracaoDadosContagem = {
  total: 0,
  geral: 0,
  pcd: 0,
  nna: 0,
};

export const INDICADOR_DETALHADO_VAZIO: IIndicadorDetalhado = {
  total: 0,
  geral: 0,
  pcd: 0,
  nna: 0,
};

export const INDICADORES_VAZIOS: IExtracaoDadosIndicadores = {
  modoComparativo: false,
  habilitados: 0,
  listaEspecifica: 0,
  listaGeral: 0,
  listaPcd: 0,
  listaNna: 0,
  convocados: { ...INDICADOR_DETALHADO_VAZIO },
  escolhasRealizadas: { ...INDICADOR_DETALHADO_VAZIO },
  naoConvocados: { ...INDICADOR_DETALHADO_VAZIO },
  reconvocacoes: { ...INDICADOR_DETALHADO_VAZIO },
  semEscolha: { ...INDICADOR_DETALHADO_VAZIO },
  pendentesEscolha: { ...INDICADOR_DETALHADO_VAZIO },
  autorizacoes: 0,
};

const isCandidatosAno = (
  value: unknown
): value is IExtracaoDadosCandidatosAno =>
  typeof value === "object" &&
  value !== null &&
  "convocados" in value &&
  "nao-convocados" in value;

const isEscolhasAno = (value: unknown): value is IExtracaoDadosEscolhasAno =>
  typeof value === "object" &&
  value !== null &&
  "escolha" in value &&
  "reconvocacao" in value &&
  "nao-escolha" in value;

/** Normaliza contagem da API (objeto) para o shape padrão. */
export const obterContagem = (valor: unknown): IExtracaoDadosContagem => {
  if (
    typeof valor === "object" &&
    valor !== null &&
    "total" in valor &&
    typeof (valor as { total: unknown }).total === "number"
  ) {
    const contagem = valor as Partial<IExtracaoDadosContagem>;
    return {
      total: contagem.total ?? 0,
      geral: contagem.geral ?? 0,
      pcd: contagem.pcd ?? 0,
      nna: contagem.nna ?? 0,
    };
  }
  return { ...CONTAGEM_VAZIA };
};

export const contagemParaIndicador = (
  contagem: IExtracaoDadosContagem
): IIndicadorDetalhado => ({
  total: contagem.total,
  geral: contagem.geral,
  pcd: contagem.pcd,
  nna: contagem.nna,
});

/** Breakdown visual no padrão Habilitados (Geral / PCD / NNA). */
export const montarBreakdownIndicador = (
  indicador: IIndicadorDetalhado
): Array<{ label: string; value: number }> => [
  { label: "Geral", value: indicador.geral },
  { label: "PCD", value: indicador.pcd },
  { label: "NNA", value: indicador.nna },
];

const calcularPendentesDetalhado = (
  convocados: IExtracaoDadosContagem,
  escolha: IExtracaoDadosContagem,
  semEscolha: IExtracaoDadosContagem,
  reconvocacao: IExtracaoDadosContagem
): IIndicadorDetalhado => ({
  total: Math.max(
    0,
    convocados.total - escolha.total - semEscolha.total - reconvocacao.total
  ),
  geral: Math.max(
    0,
    convocados.geral - escolha.geral - semEscolha.geral - reconvocacao.geral
  ),
  pcd: Math.max(
    0,
    convocados.pcd - escolha.pcd - semEscolha.pcd - reconvocacao.pcd
  ),
  nna: Math.max(
    0,
    convocados.nna - escolha.nna - semEscolha.nna - reconvocacao.nna
  ),
});

const obterIndicadoresHabilitados = (
  habilitados: IExtracaoDadosContagem | undefined
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
    convocados: convocadosRaw,
    "nao-convocados": naoConvocadosRaw,
  } = data.candidatos;
  const {
    escolha: escolhaRaw,
    reconvocacao: reconvocacaoRaw,
    "nao-escolha": semEscolhaRaw,
  } = data.escolhas;

  const convocados = obterContagem(convocadosRaw);
  const naoConvocados = obterContagem(naoConvocadosRaw);
  const escolha = obterContagem(escolhaRaw);
  const reconvocacao = obterContagem(reconvocacaoRaw);
  const semEscolha = obterContagem(semEscolhaRaw);

  const pendentesEscolha = data.pendentes
    ? contagemParaIndicador(obterContagem(data.pendentes))
    : calcularPendentesDetalhado(convocados, escolha, semEscolha, reconvocacao);

  return {
    modoComparativo: false,
    ...obterIndicadoresHabilitados(habilitados),
    convocados: contagemParaIndicador(convocados),
    escolhasRealizadas: contagemParaIndicador(escolha),
    naoConvocados: contagemParaIndicador(naoConvocados),
    reconvocacoes: contagemParaIndicador(reconvocacao),
    semEscolha: contagemParaIndicador(semEscolha),
    pendentesEscolha,
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
  const escolhasAnoRaw = data.escolhas[ano];
  const escolhasAno = isEscolhasAno(escolhasAnoRaw) ? escolhasAnoRaw : undefined;

  const convocados = isCandidatosAno(candidatosAno)
    ? obterContagem(candidatosAno.convocados)
    : { ...CONTAGEM_VAZIA };
  const naoConvocados = isCandidatosAno(candidatosAno)
    ? obterContagem(candidatosAno["nao-convocados"])
    : { ...CONTAGEM_VAZIA };
  const escolha = obterContagem(escolhasAno?.escolha);
  const reconvocacao = obterContagem(escolhasAno?.reconvocacao);
  const semEscolha = obterContagem(escolhasAno?.["nao-escolha"]);

  const pendentesApi = data.pendentes?.[ano];
  const pendentesEscolha = pendentesApi
    ? contagemParaIndicador(obterContagem(pendentesApi))
    : calcularPendentesDetalhado(convocados, escolha, semEscolha, reconvocacao);

  return {
    modoComparativo: false,
    ...habilitadosBase,
    convocados: contagemParaIndicador(convocados),
    escolhasRealizadas: contagemParaIndicador(escolha),
    naoConvocados: contagemParaIndicador(naoConvocados),
    reconvocacoes: contagemParaIndicador(reconvocacao),
    semEscolha: contagemParaIndicador(semEscolha),
    pendentesEscolha,
    autorizacoes: obterAutorizacoesDoAno(data.concurso, ano, {
      permitirFallbackRaiz: true,
    }),
  };
};
