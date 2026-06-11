import type { IExtracaoDadosTodosResponse } from "../../../../services/resources/relatorios/IExtracaoDados";
import { formatarNomeDreParaTabela } from "./mapGraficosDre";

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
  ultimaAtualizacao: string;
};

type ConcursoOption = {
  value: string;
  label: string;
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
      autorizacoes: 0,
      ultimaAtualizacao: "-",
    }))
  );
};
