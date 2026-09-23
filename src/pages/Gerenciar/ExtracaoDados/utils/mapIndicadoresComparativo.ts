import type {
  IExtracaoDadosCandidatosAno,
  IExtracaoDadosContagem,
  IExtracaoDadosEscolhasAno,
  IExtracaoDadosIndicadorBreakdownComparativo,
  IExtracaoDadosIndicadorComparativoItem,
  IExtracaoDadosIndicadoresComparativo,
  IExtracaoDadosResponse,
} from "../../../../services/resources/relatorios/IExtracaoDados";
import { calcularVariacaoPercentual } from "./calcularVariacaoPercentual";
import { CONTAGEM_VAZIA, obterContagem } from "./mapIndicadores";
import { obterAutorizacoesDoAno } from "./obterAutorizacoesDoAno";

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

const somarListaEspecifica = (habilitados: {
  geral: number;
  pcd: number;
  nna: number;
}) => habilitados.geral + habilitados.pcd + habilitados.nna;

const montarBreakdownComparativo = (
  antigo: IExtracaoDadosContagem,
  recente: IExtracaoDadosContagem
): IExtracaoDadosIndicadorBreakdownComparativo[] => [
  {
    label: "Geral",
    valorAnoAntigo: antigo.geral,
    valorAnoRecente: recente.geral,
  },
  {
    label: "PCD",
    valorAnoAntigo: antigo.pcd,
    valorAnoRecente: recente.pcd,
  },
  {
    label: "NNA",
    valorAnoAntigo: antigo.nna,
    valorAnoRecente: recente.nna,
  },
];

const montarItemComparativo = (
  valorAnoAntigo: number,
  valorAnoRecente: number,
  breakdown?: IExtracaoDadosIndicadorBreakdownComparativo[]
): IExtracaoDadosIndicadorComparativoItem => ({
  valorAnoAntigo,
  valorAnoRecente,
  variacaoPercentual: calcularVariacaoPercentual(valorAnoAntigo, valorAnoRecente),
  ...(breakdown ? { breakdown } : {}),
});

const montarItemComparativoPorContagem = (
  antigo: IExtracaoDadosContagem,
  recente: IExtracaoDadosContagem
): IExtracaoDadosIndicadorComparativoItem =>
  montarItemComparativo(
    antigo.total,
    recente.total,
    montarBreakdownComparativo(antigo, recente)
  );

const montarItemArquivoConcurso = (
  valor: number
): IExtracaoDadosIndicadorComparativoItem => ({
  valorAnoAntigo: valor,
  valorAnoRecente: valor,
  valorUnico: valor,
  variacaoPercentual: 0,
});

const calcularPendentes = (
  convocados: IExtracaoDadosContagem,
  escolha: IExtracaoDadosContagem,
  semEscolha: IExtracaoDadosContagem,
  reconvocacao: IExtracaoDadosContagem
): IExtracaoDadosContagem => ({
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

export const mapExtracaoDadosToIndicadoresComparativo = (
  data: IExtracaoDadosResponse | undefined,
  anos: string[]
): IExtracaoDadosIndicadoresComparativo | null => {
  if (!data || anos.length !== 2) {
    return null;
  }

  const [anoAntigo, anoRecente] = [...anos].sort((a, b) => a.localeCompare(b));
  const habilitadosArquivo = data.candidatos.habilitados;
  const habilitadosTotalArquivo = habilitadosArquivo?.total ?? 0;
  const listaGeralArquivo = habilitadosArquivo?.geral ?? 0;
  const listaPcdArquivo = habilitadosArquivo?.pcd ?? 0;
  const listaNnaArquivo = habilitadosArquivo?.nna ?? 0;
  const listaEspecificaArquivo = somarListaEspecifica({
    geral: listaGeralArquivo,
    pcd: listaPcdArquivo,
    nna: listaNnaArquivo,
  });

  const candidatosAntigo = data.candidatos[anoAntigo];
  const candidatosRecente = data.candidatos[anoRecente];
  const escolhasAntigoRaw = data.escolhas[anoAntigo];
  const escolhasRecenteRaw = data.escolhas[anoRecente];
  const escolhasAntigo = isEscolhasAno(escolhasAntigoRaw)
    ? escolhasAntigoRaw
    : undefined;
  const escolhasRecente = isEscolhasAno(escolhasRecenteRaw)
    ? escolhasRecenteRaw
    : undefined;

  const convocadosAntigo = isCandidatosAno(candidatosAntigo)
    ? obterContagem(candidatosAntigo.convocados)
    : { ...CONTAGEM_VAZIA };
  const convocadosRecente = isCandidatosAno(candidatosRecente)
    ? obterContagem(candidatosRecente.convocados)
    : { ...CONTAGEM_VAZIA };
  const naoConvocadosAntigo = isCandidatosAno(candidatosAntigo)
    ? obterContagem(candidatosAntigo["nao-convocados"])
    : { ...CONTAGEM_VAZIA };
  const naoConvocadosRecente = isCandidatosAno(candidatosRecente)
    ? obterContagem(candidatosRecente["nao-convocados"])
    : { ...CONTAGEM_VAZIA };

  const escolhaAntigo = obterContagem(escolhasAntigo?.escolha);
  const escolhaRecente = obterContagem(escolhasRecente?.escolha);
  const reconvocacaoAntigo = obterContagem(escolhasAntigo?.reconvocacao);
  const reconvocacaoRecente = obterContagem(escolhasRecente?.reconvocacao);
  const semEscolhaAntigo = obterContagem(escolhasAntigo?.["nao-escolha"]);
  const semEscolhaRecente = obterContagem(escolhasRecente?.["nao-escolha"]);

  const autorizacoesAntigo = obterAutorizacoesDoAno(data.concurso, anoAntigo);
  const autorizacoesRecente = obterAutorizacoesDoAno(data.concurso, anoRecente);

  const pendentesAntigo = data.pendentes?.[anoAntigo]
    ? obterContagem(data.pendentes[anoAntigo])
    : calcularPendentes(
        convocadosAntigo,
        escolhaAntigo,
        semEscolhaAntigo,
        reconvocacaoAntigo
      );
  const pendentesRecente = data.pendentes?.[anoRecente]
    ? obterContagem(data.pendentes[anoRecente])
    : calcularPendentes(
        convocadosRecente,
        escolhaRecente,
        semEscolhaRecente,
        reconvocacaoRecente
      );

  return {
    modoComparativo: true,
    anoAntigo,
    anoRecente,
    habilitados: montarItemArquivoConcurso(habilitadosTotalArquivo),
    listaEspecifica: {
      ...montarItemArquivoConcurso(listaEspecificaArquivo),
      breakdown: [
        {
          label: "Geral",
          valorAnoAntigo: listaGeralArquivo,
          valorAnoRecente: listaGeralArquivo,
        },
        {
          label: "PCD",
          valorAnoAntigo: listaPcdArquivo,
          valorAnoRecente: listaPcdArquivo,
        },
        {
          label: "NNA",
          valorAnoAntigo: listaNnaArquivo,
          valorAnoRecente: listaNnaArquivo,
        },
      ],
    },
    convocados: montarItemComparativoPorContagem(
      convocadosAntigo,
      convocadosRecente
    ),
    escolhasRealizadas: montarItemComparativoPorContagem(
      escolhaAntigo,
      escolhaRecente
    ),
    naoConvocados: montarItemComparativoPorContagem(
      naoConvocadosAntigo,
      naoConvocadosRecente
    ),
    reconvocacoes: montarItemComparativoPorContagem(
      reconvocacaoAntigo,
      reconvocacaoRecente
    ),
    semEscolha: montarItemComparativoPorContagem(
      semEscolhaAntigo,
      semEscolhaRecente
    ),
    pendentesEscolha: montarItemComparativoPorContagem(
      pendentesAntigo,
      pendentesRecente
    ),
    autorizacoes: montarItemComparativo(autorizacoesAntigo, autorizacoesRecente),
  };
};
