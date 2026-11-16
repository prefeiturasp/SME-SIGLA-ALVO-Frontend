import type { IExtracaoDadosResponse } from "../../../../services/resources/relatorios/IExtracaoDados";
import { calcularVariacaoPercentual } from "./calcularVariacaoPercentual";

export type DreGraficoItem = {
  nome: string;
  valor: number | null;
};

export type DreGraficoComparativoItem = {
  dre: string;
  dreOriginal: string;
  ano: string;
  valor: number;
};

export type DreComparativoResumo = {
  dreOriginal: string;
  nome: string;
  anoAntigo: string;
  anoRecente: string;
  escolhasAnoAntigo: number;
  escolhasAnoRecente: number;
  vagasAnoAntigo: number;
  vagasAnoRecente: number;
  percentualAnoAntigo: number;
  percentualAnoRecente: number;
  variacaoEscolhasPercentual: number | null;
  variacaoVagasPercentual: number | null;
};

const DRE_NOME_REGEX = /diretoria\s+regional\s+de\s+educa[cç][aã]o/gi;

export const formatarNomeDre = (nome: string) =>
  nome.replace(DRE_NOME_REGEX, "DRE").replace(/\s+/g, " ").trim();

export const formatarNomeDreParaTabela = (nome: string) =>
  formatarNomeDre(nome).replace(/^DRE\s+/i, "").trim();

export const obterResumoComparativoPorTitulo = (
  resumos: DreComparativoResumo[],
  titulo?: string
): DreComparativoResumo | undefined => {
  if (!titulo) {
    return undefined;
  }

  const normalizarTituloDre = (valor: string) =>
    valor
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toUpperCase();

  const chave = normalizarTituloDre(titulo);

  return resumos.find(
    (resumo) => normalizarTituloDre(formatarNomeDre(resumo.dreOriginal)) === chave
  );
};

export const getDresDoAno = (
  data: IExtracaoDadosResponse | undefined,
  ano: string
) => data?.escolhas?.[ano]?.dres ?? [];

const getDresConsolidadas = (
  data: IExtracaoDadosResponse | undefined
) => data?.escolhas?.dres ?? [];

const calcularPercentualPreenchimento = (escolhas: number, vagas: number) =>
  vagas > 0 ? Math.round((escolhas / vagas) * 100) : 0;

const calcularPercentualPreenchimentoDecimal = (escolhas: number, vagas: number) =>
  vagas > 0 ? Math.round((escolhas / vagas) * 1000) / 10 : 0;

const obterMapaDresPorNome = (
  data: IExtracaoDadosResponse | undefined,
  ano: string
) =>
  Object.fromEntries(
    getDresDoAno(data, ano).map((dre) => [dre.nome, dre])
  );

export const mapDresComparativoPorDre = (
  data: IExtracaoDadosResponse | undefined,
  anos: string[]
): DreComparativoResumo[] => {
  if (!data || anos.length !== 2) {
    return [];
  }

  const [anoAntigo, anoRecente] = [...anos].sort((a, b) => a.localeCompare(b));
  const dresAntigo = obterMapaDresPorNome(data, anoAntigo);
  const dresRecente = obterMapaDresPorNome(data, anoRecente);
  const nomesOrdenados = [
    ...new Set([...Object.keys(dresAntigo), ...Object.keys(dresRecente)]),
  ].sort((a, b) =>
    formatarNomeDre(a).localeCompare(formatarNomeDre(b), "pt-BR")
  );

  return nomesOrdenados.map((dreOriginal) => {
    const antigo = dresAntigo[dreOriginal];
    const recente = dresRecente[dreOriginal];
    const escolhasAnoAntigo = antigo?.escolhas ?? 0;
    const escolhasAnoRecente = recente?.escolhas ?? 0;
    const vagasAnoAntigo = antigo?.vagas ?? 0;
    const vagasAnoRecente = recente?.vagas ?? 0;

    return {
      dreOriginal,
      nome: formatarNomeDreParaTabela(dreOriginal),
      anoAntigo: String(anoAntigo),
      anoRecente: String(anoRecente),
      escolhasAnoAntigo,
      escolhasAnoRecente,
      vagasAnoAntigo,
      vagasAnoRecente,
      percentualAnoAntigo: calcularPercentualPreenchimentoDecimal(
        escolhasAnoAntigo,
        vagasAnoAntigo
      ),
      percentualAnoRecente: calcularPercentualPreenchimentoDecimal(
        escolhasAnoRecente,
        vagasAnoRecente
      ),
      variacaoEscolhasPercentual: calcularVariacaoPercentual(
        escolhasAnoAntigo,
        escolhasAnoRecente
      ),
      variacaoVagasPercentual: calcularVariacaoPercentual(
        vagasAnoAntigo,
        vagasAnoRecente
      ),
    };
  });
};

export const mapDresParaGraficoComparativo = (
  resumos: DreComparativoResumo[],
  campo: "escolhas" | "vagas"
): DreGraficoComparativoItem[] =>
  resumos.flatMap((resumo) => [
    {
      dre: formatarNomeDre(resumo.dreOriginal),
      dreOriginal: resumo.dreOriginal,
      ano: String(resumo.anoAntigo),
      valor:
        campo === "escolhas"
          ? resumo.escolhasAnoAntigo
          : resumo.vagasAnoAntigo,
    },
    {
      dre: formatarNomeDre(resumo.dreOriginal),
      dreOriginal: resumo.dreOriginal,
      ano: String(resumo.anoRecente),
      valor:
        campo === "escolhas"
          ? resumo.escolhasAnoRecente
          : resumo.vagasAnoRecente,
    },
  ]);

const mapDreParaTabelaItem = (
  dre: { nome: string; escolhas: number; vagas: number }
): TabelaVagasDreItem => {
  const nome = formatarNomeDreParaTabela(dre.nome);

  return {
    key: nome,
    nome,
    escolhas: dre.escolhas,
    vagas: dre.vagas,
    percentualPreenchimento: calcularPercentualPreenchimento(
      dre.escolhas,
      dre.vagas
    ),
    modoComparativo: false,
  };
};

export const mapDresParaGraficoEscolhas = (
  data: IExtracaoDadosResponse | undefined,
  anos: string[]
): DreGraficoItem[] => {
  if (anos.length === 2) {
    return [];
  }

  return getDresDoAno(data, anos[0]).map((dre) => ({
    nome: formatarNomeDre(dre.nome),
    valor: dre.escolhas,
  }));
};

export const mapDresTodosParaGraficoEscolhas = (
  data: IExtracaoDadosResponse | undefined
): DreGraficoItem[] =>
  getDresConsolidadas(data).map((dre) => ({
    nome: formatarNomeDre(dre.nome),
    valor: dre.escolhas,
  }));

export const mapDresParaGraficoVagas = (
  data: IExtracaoDadosResponse | undefined,
  anos: string[]
): DreGraficoItem[] => {
  if (anos.length === 2) {
    return [];
  }

  return getDresDoAno(data, anos[0]).map((dre) => ({
    nome: formatarNomeDre(dre.nome),
    valor: dre.vagas,
  }));
};

export const mapDresTodosParaGraficoVagas = (
  data: IExtracaoDadosResponse | undefined
): DreGraficoItem[] =>
  getDresConsolidadas(data).map((dre) => ({
    nome: formatarNomeDre(dre.nome),
    valor: dre.vagas,
  }));

export type TabelaVagasDreItem = {
  key: string;
  nome: string;
  escolhas: number | null;
  vagas: number | null;
  percentualPreenchimento: number | null;
  modoComparativo: boolean;
};

export type TabelaVagasDreComparativoItem = DreComparativoResumo & {
  key: string;
};

export const mapDresParaTabelaComparativo = (
  resumos: DreComparativoResumo[]
): TabelaVagasDreComparativoItem[] =>
  resumos.map((resumo) => ({
    ...resumo,
    key: resumo.nome,
  }));

export const mapDresTodosParaTabela = (
  data: IExtracaoDadosResponse | undefined
): TabelaVagasDreItem[] =>
  getDresConsolidadas(data).map(mapDreParaTabelaItem);

export const mapDresParaTabela = (
  data: IExtracaoDadosResponse | undefined,
  anos: string[]
): TabelaVagasDreItem[] => {
  if (anos.length === 2) {
    return [];
  }

  return getDresDoAno(data, anos[0]).map(mapDreParaTabelaItem);
};
