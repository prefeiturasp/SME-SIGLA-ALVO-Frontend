import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import type { IConcursoFormFields } from "../hooks/useConcursoForm";
import type { IPublicacoesResultadosFormFields } from "../hooks/usePublicacoesResultadosForm";
import type { IVigenciaFormFields } from "../hooks/useVigenciaForm";
import type {
  IConcursoDetalhe,
  IConcursoPayload,
} from "../../../../services/resources/concursos/IConcursos";

const FORMATO_DATA_API = "YYYY-MM-DD";

export const formatarDataApi = (
  data?: Dayjs | null
): string | null => {
  return data ? data.format(FORMATO_DATA_API) : null;
};

export const montarPayloadPasso1 = (
  passo1: IConcursoFormFields
): Partial<IConcursoPayload> => ({
  nome: passo1.nome,
  cargos_ids: passo1.cargos_ids,
  numero_processo: passo1.numero_processo,
  banca_responsavel: passo1.banca_responsavel,
  status: passo1.status,
});

export const montarPayloadStatus = (
  passo1: IConcursoFormFields
): Partial<IConcursoPayload> => ({
  status: passo1.status,
});

export const montarPayloadRetificacoesLiberada = (
  passo2: IPublicacoesResultadosFormFields
): Partial<IConcursoPayload> => ({
  retificacoes: passo2.retificacoes ?? "",
});

export const montarPayloadVigenciaLiberada = (
  passo3: IVigenciaFormFields
): Partial<IConcursoPayload> => {
  const [vigenciaInicio, vigenciaFim] = passo3.vigencia ?? [];

  return {
    data_prorrogacao: formatarDataApi(passo3.data_prorrogacao),
    vigencia_inicio: formatarDataApi(vigenciaInicio),
    vigencia_fim: formatarDataApi(vigenciaFim),
  };
};

export const montarPayloadPasso2 = (
  passo2: IPublicacoesResultadosFormFields
): Partial<IConcursoPayload> => ({
  data_autorizacao: formatarDataApi(passo2.data_autorizacao),
  data_abertura: formatarDataApi(passo2.data_abertura),
  classificacao_final: formatarDataApi(passo2.classificacao_final),
  link_edital: passo2.link_edital ?? "",
  habilitados_geral: passo2.habilitados_geral ?? null,
  habilitados_nna: passo2.habilitados_nna ?? null,
  habilitados_pcd: passo2.habilitados_pcd ?? null,
  retificacoes: passo2.retificacoes ?? "",
});

export const montarPayloadPasso3 = (
  passo3: IVigenciaFormFields
): Partial<IConcursoPayload> => {
  const [vigenciaInicio, vigenciaFim] = passo3.vigencia ?? [];

  return {
    data_homologacao: formatarDataApi(passo3.data_homologacao),
    data_prorrogacao: formatarDataApi(passo3.data_prorrogacao),
    vigencia_inicio: formatarDataApi(vigenciaInicio),
    vigencia_fim: formatarDataApi(vigenciaFim),
  };
};

const dataApiParaDayjs = (data: string | null): Dayjs | undefined =>
  data ? dayjs(data) : undefined;

export const detalheParaPasso2 = (
  detalhe: IConcursoDetalhe
): Partial<IPublicacoesResultadosFormFields> => ({
  data_autorizacao: dataApiParaDayjs(detalhe.data_autorizacao),
  classificacao_final: dataApiParaDayjs(detalhe.classificacao_final),
  data_abertura: dataApiParaDayjs(detalhe.data_abertura),
  link_edital: detalhe.link_edital ?? "",
  habilitados_geral: detalhe.habilitados_geral ?? undefined,
  habilitados_nna: detalhe.habilitados_nna ?? undefined,
  habilitados_pcd: detalhe.habilitados_pcd ?? undefined,
  retificacoes: detalhe.retificacoes ?? "",
});

export const detalheParaPasso3 = (
  detalhe: IConcursoDetalhe
): Partial<IVigenciaFormFields> => ({
  data_homologacao: dataApiParaDayjs(detalhe.data_homologacao),
  data_prorrogacao: dataApiParaDayjs(detalhe.data_prorrogacao) ?? null,
  vigencia:
    detalhe.vigencia_inicio && detalhe.vigencia_fim
      ? [dayjs(detalhe.vigencia_inicio), dayjs(detalhe.vigencia_fim)]
      : undefined,
});
