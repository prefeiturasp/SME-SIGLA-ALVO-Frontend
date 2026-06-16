import type {
  IExtracaoDadosEscolhasDre,
  IExtracaoDadosResponse,
  IExtracaoDadosTodosResponse,
} from "../../../../services/resources/relatorios/IExtracaoDados";

export type DreGraficoItem = {
  nome: string;
  valor: number;
};

const DRE_NOME_REGEX = /diretoria\s+regional\s+de\s+educa[cç][aã]o/gi;

export const formatarNomeDre = (nome: string) =>
  nome.replace(DRE_NOME_REGEX, "DRE").replace(/\s+/g, " ").trim();

export const formatarNomeDreParaTabela = (nome: string) =>
  formatarNomeDre(nome).replace(/^DRE\s+/i, "").trim();

export const getDresDoAno = (
  data: IExtracaoDadosResponse | undefined,
  ano: string
) => data?.escolhas?.[ano]?.dres ?? [];

const getDresConsolidadas = (
  data: IExtracaoDadosTodosResponse | undefined
): IExtracaoDadosEscolhasDre[] => data?.escolhas?.dres ?? [];

const mapDreParaTabelaItem = (dre: IExtracaoDadosEscolhasDre): TabelaVagasDreItem => {
  const nome = formatarNomeDreParaTabela(dre.nome);
  const percentualPreenchimento =
    dre.vagas > 0 ? Math.round((dre.escolhas / dre.vagas) * 100) : 0;

  return {
    key: nome,
    nome,
    escolhas: dre.escolhas,
    vagas: dre.vagas,
    percentualPreenchimento,
  };
};

export const mapDresParaGraficoEscolhas = (
  data: IExtracaoDadosResponse | undefined,
  ano: string
): DreGraficoItem[] =>
  getDresDoAno(data, ano).map((dre) => ({
    nome: formatarNomeDre(dre.nome),
    valor: dre.escolhas,
  }));

export const mapDresTodosParaGraficoEscolhas = (
  data: IExtracaoDadosTodosResponse | undefined
): DreGraficoItem[] =>
  getDresConsolidadas(data).map((dre) => ({
    nome: formatarNomeDre(dre.nome),
    valor: dre.escolhas,
  }));

export const mapDresParaGraficoVagas = (
  data: IExtracaoDadosResponse | undefined,
  ano: string
): DreGraficoItem[] =>
  getDresDoAno(data, ano).map((dre) => ({
    nome: formatarNomeDre(dre.nome),
    valor: dre.vagas,
  }));

export const mapDresTodosParaGraficoVagas = (
  data: IExtracaoDadosTodosResponse | undefined
): DreGraficoItem[] =>
  getDresConsolidadas(data).map((dre) => ({
    nome: formatarNomeDre(dre.nome),
    valor: dre.vagas,
  }));

export type TabelaVagasDreItem = {
  key: string;
  nome: string;
  escolhas: number;
  vagas: number;
  percentualPreenchimento: number;
};

export const mapDresTodosParaTabela = (
  data: IExtracaoDadosTodosResponse | undefined
): TabelaVagasDreItem[] =>
  getDresConsolidadas(data).map(mapDreParaTabelaItem);

export const mapDresParaTabela = (
  data: IExtracaoDadosResponse | undefined,
  ano: string
): TabelaVagasDreItem[] =>
  getDresDoAno(data, ano).map(mapDreParaTabelaItem);
