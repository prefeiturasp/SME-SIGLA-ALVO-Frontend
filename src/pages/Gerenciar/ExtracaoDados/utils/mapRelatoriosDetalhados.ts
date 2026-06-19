import dayjs from "dayjs";
import type {
  IExtracaoDadosConcursoCargo,
  IExtracaoDadosResponse,
  IExtracaoDadosTodosResponse,
} from "../../../../services/resources/relatorios/IExtracaoDados";
import { formatarNomeDreParaTabela } from "./mapGraficosDre";

const formatarDataAutorizacao = (data?: string) =>
  data ? dayjs(data).format("DD/MM/YYYY") : "-";

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

export const mapCargosParaAutorizacoesPublicadas = (
  cargos: IExtracaoDadosConcursoCargo[] | undefined
): AutorizacaoPublicadaItem[] =>
  (cargos ?? []).map((cargo) => ({
    key: cargo.uuid,
    cargo: cargo.nome,
    quantidade: cargo.autorizacoes,
    data_autorizacao: formatarDataAutorizacao(cargo.data_autorizacao),
  }));

export const mapDresConcursosParaRelatoriosDetalhados = (
  data: IExtracaoDadosTodosResponse | undefined,
  concursosOptions: ConcursoOption[]
): RelatorioDetalhadoItem[] => {
  const dresConcursos = data?.escolhas?.dres_concursos;

  if (!dresConcursos) {
    return [];
  }

  const concursosMap = new Map(concursosOptions.map((concurso) => [concurso.value, concurso.label]));

  return Object.entries(dresConcursos).flatMap(([concursoUuid, itens]) =>
    itens.map((item, index) => ({
      key: `${concursoUuid}-${item.codigo_cargo ?? index}-${item.nome}`,
      concursoUuid,
      concurso: concursosMap.get(concursoUuid) ?? concursoUuid,
      cargo: item.cargo_descricao ?? "-",
      codigoCargo: item.codigo_cargo,
      dre: formatarNomeDreParaTabela(item.nome),
      dreOriginal: item.nome,
      escolhas: item.escolhas,
      naoEscolhas: Math.max(item.vagas - item.escolhas, 0),
    }))
  );
};

export const mapDresParaRelatoriosDetalhados = (
  data: IExtracaoDadosResponse | undefined,
  _ano: string,
  concursoUuid: string,
  concursosOptions: ConcursoOption[]
): RelatorioDetalhadoItem[] => {
  const dresConcursos = data?.escolhas?.dres_concursos;
  const itens = dresConcursos?.[concursoUuid];

  if (!itens?.length) {
    return [];
  }

  const concursosMap = new Map(concursosOptions.map((concurso) => [concurso.value, concurso.label]));
  const concurso = concursosMap.get(concursoUuid) ?? concursoUuid;

  return itens.map((item, index) => ({
    key: `${concursoUuid}-${item.codigo_cargo ?? index}-${item.nome}`,
    concursoUuid,
    concurso,
    cargo: item.cargo_descricao ?? "-",
    codigoCargo: item.codigo_cargo,
    dre: formatarNomeDreParaTabela(item.nome),
    dreOriginal: item.nome,
    escolhas: item.escolhas,
    naoEscolhas: Math.max(item.vagas - item.escolhas, 0),
  }));
};
