import type {
  IExtracaoDadosIndicadorComparativoItem,
  IExtracaoDadosIndicadoresComparativo,
  IExtracaoDadosResponse,
} from "../../../../services/resources/relatorios/IExtracaoDados";
import { calcularVariacaoPercentual } from "./calcularVariacaoPercentual";
import { obterAutorizacoesDoAno } from "./obterAutorizacoesDoAno";

const isCandidatosAno = (
  value: unknown
): value is {
  convocados: number;
  "nao-convocados": number;
} =>
  typeof value === "object" &&
  value !== null &&
  "convocados" in value &&
  "nao-convocados" in value;

const somarListaEspecifica = (habilitados: {
  geral: number;
  pcd: number;
  nna: number;
}) => habilitados.geral + habilitados.pcd + habilitados.nna;

const montarItemComparativo = (
  valorAnoAntigo: number,
  valorAnoRecente: number
): IExtracaoDadosIndicadorComparativoItem => ({
  valorAnoAntigo,
  valorAnoRecente,
  variacaoPercentual: calcularVariacaoPercentual(valorAnoAntigo, valorAnoRecente),
});

const montarItemArquivoConcurso = (
  valor: number
): IExtracaoDadosIndicadorComparativoItem => ({
  valorAnoAntigo: valor,
  valorAnoRecente: valor,
  valorUnico: valor,
  variacaoPercentual: 0,
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
  const escolhasAntigo = data.escolhas[anoAntigo];
  const escolhasRecente = data.escolhas[anoRecente];

  const convocadosAntigo = isCandidatosAno(candidatosAntigo)
    ? candidatosAntigo.convocados
    : 0;
  const convocadosRecente = isCandidatosAno(candidatosRecente)
    ? candidatosRecente.convocados
    : 0;
  const naoConvocadosAntigo = isCandidatosAno(candidatosAntigo)
    ? candidatosAntigo["nao-convocados"]
    : 0;
  const naoConvocadosRecente = isCandidatosAno(candidatosRecente)
    ? candidatosRecente["nao-convocados"]
    : 0;

  const autorizacoesAntigo = obterAutorizacoesDoAno(data.concurso, anoAntigo);
  const autorizacoesRecente = obterAutorizacoesDoAno(data.concurso, anoRecente);

  // Pendentes de escolha por ano: convocados que ainda nao registraram nenhuma
  // situacao de escolha (escolha, nao-escolha ou reconvocacao). Nunca negativo.
  const pendentesAntigo = Math.max(
    0,
    convocadosAntigo -
      (escolhasAntigo?.escolha ?? 0) -
      (escolhasAntigo?.["nao-escolha"] ?? 0) -
      (escolhasAntigo?.reconvocacao ?? 0)
  );
  const pendentesRecente = Math.max(
    0,
    convocadosRecente -
      (escolhasRecente?.escolha ?? 0) -
      (escolhasRecente?.["nao-escolha"] ?? 0) -
      (escolhasRecente?.reconvocacao ?? 0)
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
    convocados: montarItemComparativo(convocadosAntigo, convocadosRecente),
    escolhasRealizadas: montarItemComparativo(
      escolhasAntigo?.escolha ?? 0,
      escolhasRecente?.escolha ?? 0
    ),
    naoConvocados: montarItemComparativo(naoConvocadosAntigo, naoConvocadosRecente),
    reconvocacoes: montarItemComparativo(
      escolhasAntigo?.reconvocacao ?? 0,
      escolhasRecente?.reconvocacao ?? 0
    ),
    semEscolha: montarItemComparativo(
      escolhasAntigo?.["nao-escolha"] ?? 0,
      escolhasRecente?.["nao-escolha"] ?? 0
    ),
    pendentesEscolha: montarItemComparativo(pendentesAntigo, pendentesRecente),
    autorizacoes: montarItemComparativo(autorizacoesAntigo, autorizacoesRecente),
  };
};
