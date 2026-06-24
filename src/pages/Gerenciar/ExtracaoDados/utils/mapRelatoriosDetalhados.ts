import dayjs from "dayjs";
import type {
  IExtracaoDadosConcursoCargo,
  IExtracaoDadosConcursoFiltrado,
  IExtracaoDadosResponse,
  IExtracaoDadosTodosResponse,
} from "../../../../services/resources/relatorios/IExtracaoDados";
import { formatarNomeDreParaTabela } from "./mapGraficosDre";

const formatarUltimaEscolha = (data?: string | null) => {
  if (!data) {
    return "-";
  }

  const parsed = dayjs(data);
  if (!parsed.isValid()) {
    return "-";
  }

  return parsed.format("DD/MM/YYYY HH:mm");
};

const formatarDataAutorizacao = (data?: string | null) =>
  data ? dayjs(data).format("DD/MM/YYYY") : "-";

export type RelatorioDetalhadoDetalheAno = {
  escolhas: number;
  naoEscolhas: number;
  autorizacoes: number;
};

export type RelatorioDetalhadoItem = {
  key: string;
  concursoUuid: string;
  concurso: string;
  cargo: string;
  codigoCargo?: number;
  dre: string;
  dreOriginal: string;
  escolhas: number;
  naoEscolhas: number;
  autorizacoes: number;
  data_autorizacao: string;
  detalhePorAno?: Record<string, RelatorioDetalhadoDetalheAno>;
};

export type AutorizacaoPublicadaItem = {
  key: string;
  cargo: string;
  quantidade: number;
  data_autorizacao: string;
};

type ConcursoOption = {
  value: string;
  label: string;
};

const isConcursoAno = (
  value: unknown
): value is {
  "autorizacoes-publicadas": number;
  cargos?: IExtracaoDadosConcursoCargo[];
} =>
  typeof value === "object" &&
  value !== null &&
  "autorizacoes-publicadas" in value;

const codigosCargoIguais = (
  codigoA?: number | null,
  codigoB?: number | null
) =>
  codigoA != null &&
  codigoB != null &&
  Number(codigoA) === Number(codigoB);

const obterCargoAutorizacaoNoAno = (
  concurso: IExtracaoDadosConcursoFiltrado | undefined,
  ano: string,
  codigoCargo?: number
): IExtracaoDadosConcursoCargo | undefined => {
  if (codigoCargo == null) {
    return undefined;
  }

  const dadosAno = concurso?.[ano];
  if (isConcursoAno(dadosAno)) {
    const cargoAno = dadosAno.cargos?.find((item) =>
      codigosCargoIguais(item.codigo, codigoCargo)
    );
    if (cargoAno) {
      return cargoAno;
    }
  }

  return concurso?.cargos?.find(
    (item) =>
      codigosCargoIguais(item.codigo, codigoCargo) &&
      item.data_autorizacao?.slice(0, 4) === ano
  );
};

const obterAutorizacoesCargo = (
  concurso: IExtracaoDadosConcursoFiltrado | undefined,
  anos: string[],
  codigoCargo?: number
): { autorizacoes: number } => {
  if (codigoCargo == null) {
    return { autorizacoes: 0 };
  }

  const cargosPorAno = anos
    .map((ano) => obterCargoAutorizacaoNoAno(concurso, ano, codigoCargo))
    .filter((cargo): cargo is IExtracaoDadosConcursoCargo => Boolean(cargo));

  if (!cargosPorAno.length) {
    const cargoLegado = concurso?.cargos?.find((item) =>
      codigosCargoIguais(item.codigo, codigoCargo)
    );

    return {
      autorizacoes: cargoLegado?.autorizacoes ?? 0,
    };
  }

  if (anos.length === 1) {
    return {
      autorizacoes: cargosPorAno[0].autorizacoes,
    };
  }

  return {
    autorizacoes: cargosPorAno.reduce(
      (total, cargo) => total + (Number(cargo.autorizacoes) || 0),
      0
    ),
  };
};

const montarDetalhePorAno = (
  data: IExtracaoDadosResponse,
  anos: string[],
  dreOriginal: string,
  codigoCargo?: number
): Record<string, RelatorioDetalhadoDetalheAno> | undefined => {
  if (anos.length !== 2) {
    return undefined;
  }

  return anos.reduce<Record<string, RelatorioDetalhadoDetalheAno>>((acc, ano) => {
    const dreAno = data.escolhas[ano]?.dres?.find((dre) => dre.nome === dreOriginal);
    const autorizacoesCargo = obterCargoAutorizacaoNoAno(
      data.concurso,
      ano,
      codigoCargo
    );

    acc[ano] = {
      escolhas: dreAno?.escolhas ?? 0,
      naoEscolhas: Math.max((dreAno?.vagas ?? 0) - (dreAno?.escolhas ?? 0), 0),
      autorizacoes: autorizacoesCargo?.autorizacoes ?? 0,
    };

    return acc;
  }, {});
};

const somarDetalhePorAno = (
  detalhePorAno: Record<string, RelatorioDetalhadoDetalheAno> | undefined,
  campo: keyof RelatorioDetalhadoDetalheAno
) =>
  detalhePorAno
    ? Object.values(detalhePorAno).reduce((total, detalhe) => total + detalhe[campo], 0)
    : 0;

export const mapCargosParaAutorizacoesPublicadas = (
  cargos: IExtracaoDadosConcursoCargo[] | undefined
): AutorizacaoPublicadaItem[] =>
  (cargos ?? []).map((cargo) => ({
    key: cargo.uuid,
    cargo: cargo.nome,
    quantidade: cargo.autorizacoes,
    data_autorizacao: formatarDataAutorizacao(cargo.data_autorizacao),
  }));

/**
 * Monta as autorizacoes publicadas a partir do concurso filtrado, cujos cargos
 * vivem aninhados nos blocos por ano (concurso[ano].cargos) e nao na raiz.
 *
 * Gera uma linha por cargo de cada ano selecionado, preservando todas as
 * secoes de "autorizacoes-publicadas" presentes na resposta (um mesmo cargo
 * que aparece em dois anos rende duas linhas, uma por ano). Quando nenhum bloco
 * de ano possui cargos, cai para os cargos da raiz.
 */
export const mapConcursoFiltradoParaAutorizacoesPublicadas = (
  concurso: IExtracaoDadosConcursoFiltrado | undefined,
  anos: string[]
): AutorizacaoPublicadaItem[] => {
  const itens = anos.flatMap((ano) => {
    const dadosAno = concurso?.[ano];
    if (!isConcursoAno(dadosAno)) {
      return [];
    }

    return (dadosAno.cargos ?? []).map((cargo) => ({
      key: `${ano}-${cargo.uuid}`,
      cargo: cargo.nome,
      quantidade: Number(cargo.autorizacoes) || 0,
      data_autorizacao: formatarDataAutorizacao(cargo.data_autorizacao),
    }));
  });

  if (!itens.length) {
    return mapCargosParaAutorizacoesPublicadas(concurso?.cargos);
  }

  return itens;
};

export const mapDresConcursosParaRelatoriosDetalhados = (
  data: IExtracaoDadosTodosResponse | undefined,
  concursosOptions: ConcursoOption[]
): RelatorioDetalhadoItem[] => {
  const dresConcursos = data?.escolhas?.dres_concursos;

  if (!dresConcursos) {
    return [];
  }

  const concursosMap = new Map(concursosOptions.map((concurso) => [concurso.value, concurso.label]));

  return Object.entries(dresConcursos).flatMap(([concursoUuid, itens]) => {
    const ultimaEscolhaConcurso = data?.escolhas?.ultima_escolha_em;

    return itens.map((item, index) => {
      const cargoInfo =
        item.codigo_cargo != null
          ? data?.concurso?.cargos?.find((cargo) =>
              codigosCargoIguais(cargo.codigo, item.codigo_cargo)
            )
          : undefined;

      return {
        key: `${concursoUuid}-${item.codigo_cargo ?? index}-${item.nome}`,
        concursoUuid,
        concurso: concursosMap.get(concursoUuid) ?? concursoUuid,
        cargo: item.cargo_descricao ?? "-",
        codigoCargo: item.codigo_cargo,
        dre: formatarNomeDreParaTabela(item.nome),
        dreOriginal: item.nome,
        escolhas: item.escolhas,
        naoEscolhas: Math.max(item.vagas - item.escolhas, 0),
        autorizacoes: cargoInfo?.autorizacoes ?? 0,
        data_autorizacao: formatarUltimaEscolha(
          item.ultima_escolha_em ?? ultimaEscolhaConcurso
        ),
      };
    });
  });
};

export const mapDresParaRelatoriosDetalhados = (
  data: IExtracaoDadosResponse | undefined,
  anos: string[],
  concursoUuid: string,
  concursosOptions: ConcursoOption[]
): RelatorioDetalhadoItem[] => {
  const dresConcursos = data?.escolhas?.dres_concursos;
  const itens = dresConcursos?.[concursoUuid];

  if (!itens?.length || !data) {
    return [];
  }

  const concursosMap = new Map(concursosOptions.map((concurso) => [concurso.value, concurso.label]));
  const concurso = concursosMap.get(concursoUuid) ?? concursoUuid;
  const ultimaEscolhaConcurso = data.escolhas.ultima_escolha_em;

  return itens.map((item, index) => {
    const detalhePorAno = montarDetalhePorAno(
      data,
      anos,
      item.nome,
      item.codigo_cargo
    );
    const cargoInfo = obterAutorizacoesCargo(
      data.concurso,
      anos,
      item.codigo_cargo
    );
    const escolhas =
      anos.length === 2 && detalhePorAno
        ? somarDetalhePorAno(detalhePorAno, "escolhas")
        : item.escolhas;
    const naoEscolhas =
      anos.length === 2 && detalhePorAno
        ? somarDetalhePorAno(detalhePorAno, "naoEscolhas")
        : Math.max(item.vagas - item.escolhas, 0);

    return {
      key: `${concursoUuid}-${item.codigo_cargo ?? index}-${item.nome}`,
      concursoUuid,
      concurso,
      cargo: item.cargo_descricao ?? "-",
      codigoCargo: item.codigo_cargo,
      dre: formatarNomeDreParaTabela(item.nome),
      dreOriginal: item.nome,
      escolhas,
      naoEscolhas,
      autorizacoes: cargoInfo.autorizacoes,
      data_autorizacao: formatarUltimaEscolha(
        item.ultima_escolha_em ?? ultimaEscolhaConcurso
      ),
      detalhePorAno,
    };
  });
};

export const montarSubtituloRelatoriosDetalhados = (anos?: string[]) => {
  if (anos?.length === 2) {
    const [anoAntigo, anoRecente] = [...anos].sort((a, b) => a.localeCompare(b));
    return `Lista consolidada por concurso, cargo e DRE dos anos ${anoAntigo} e ${anoRecente}.`;
  }

  if (anos?.length === 1) {
    return `Lista consolidada por concurso, cargo e DRE do ano ${anos[0]}.`;
  }

  return "Lista consolidada por concurso, cargo e DRE.";
};
