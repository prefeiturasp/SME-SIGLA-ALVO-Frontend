import type { AxiosRequestConfig } from "axios";
import { appAxiosEscolhas } from "../../axios";
import type {
  IEscolhasFiltro,
  IDREsResponse,
  IEscolasResponse,
  IBuscarDREsParams,
  IBuscarEscolasParams,
  ISalvarEscolhaPayload,
} from "./IEscolhas";
import type { IListRequest, PaginatedResponse } from "../../../types/IListRequest";
import queryParamsSerializer from "../../../utils/queryParamsSerializer";
import type {  IVagasResponse } from "../convocacao/IConvocacao";
import type { IInclusaoVagasEscolasPayload } from "../../../pages/GerenciamentoVagas/hooks/types";

export const URL = {
  getVagasEscolas: () => `/api/v1/vagas-escolas/`,
  patchVagasEscolasUtilizadas: () => `/api/v1/vagas-escolas/utilizadas/`,
  getDREs: () => `/api/v1/dres/`,
  getEscolas: () => `/api/v1/escolas/`,
  postBuscarEscolhasPorCandidatos: () => `/api/v1/escolhas/busca/`,
  postEscolhas: () => `/api/v1/escolhas/`,
  getBuscarCandidatos: () => `/api/v1/escolhas/buscar-candidatos/`,
  getEscolhas: () => `/api/v1/escolhas/`,
  postInclusaoVagasEscolas: () => `/api/v1/vagas-escolas/inclusao/`,
  getParametrizacao: () => `/api/v1/parametrizacao/`,
  patchParametrizacao: () => `/api/v1/parametrizacao/bulk/`,
};

// TODO adicionar JWT no header Authorization
export const getVagasEscolas = (
  params: IEscolhasFiltro,
  listRequest: IListRequest,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();
  const { pagination, filters, ...rest } = listRequest;
  const response = appAxiosEscolhas    
    .get<IVagasResponse>(URL.getVagasEscolas(), {
      params: { ...pagination, ...filters, ...rest, ...params },      
      paramsSerializer: queryParamsSerializer,
      signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

export const postBuscarEscolhasPorCandidatos = (
  candidatoUuids: string[],
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosEscolhas
    .post(URL.postBuscarEscolhasPorCandidatos(), { candidato_uuid: candidatoUuids }, {
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

// PATCH vagas-escolas utilizadas
export const patchVagasEscolasUtilizadas = (
  payload: Array<{ uuid: string; foi_utilizada: boolean; vagas_precarias_utilizadas?: number | null; vagas_definitivas_utilizadas?: number | null }>,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();
  const response = appAxiosEscolhas
    .patch(URL.patchVagasEscolasUtilizadas(), payload, {
      signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

// GET DREs do MS-Escolhas
export const getDREs = (
  params: IBuscarDREsParams = {},
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();
  const response = appAxiosEscolhas
    .get<IDREsResponse>(URL.getDREs(), {
      params: { page_size: 100, ...params },
      paramsSerializer: queryParamsSerializer,
      signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

// GET Escolas do MS-Escolhas
export const getEscolas = (
  params: IBuscarEscolasParams,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();
  
  const response = appAxiosEscolhas
    .get<IEscolasResponse>(URL.getEscolas(), {
      params: { ...params },
      paramsSerializer: queryParamsSerializer,
      signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

// POST Inclusão de Vagas Escolas
export const postInclusaoVagasEscolas = (
  payload: IInclusaoVagasEscolasPayload,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();
  const response = appAxiosEscolhas
    .post(URL.postInclusaoVagasEscolas(), payload, {
      signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

    return {
      response,
      abort,
    };
  };

export const postEscolha = (
  payload: ISalvarEscolhaPayload,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();
  const response = appAxiosEscolhas
    .post(URL.postEscolhas(), payload, {
      signal: axiosRequestConfig?.signal ?? signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

// GET Parametrizacao do MS-Escolhas
export const getParametrizacaoEscolhas = (
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosEscolhas
    .get(URL.getParametrizacao(), {
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

// PATCH Parametrizacao do MS-Escolhas
export const patchParametrizacaoEscolhas = (
  payload: Record<string, any>,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosEscolhas
    .patch(URL.patchParametrizacao(), payload, {
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

/** Params para buscar candidatos (pelo menos um obrigatório). */
export type IBuscarCandidatosParams = {
  nome?: string;
  cpf?: string;
  rg?: string;
  registro_funcional?: string;
};

/** Item de reclassificação retornado pelo MS-Candidatos (ConcursoCandidatoSerializer). */
export type ReclassificacaoItem = {
  uuid?: string;
  desclassificado_de?: string;
  processo_uuid?: string | null;
  motivo?: string;
  executado_por?: string;
  criado_em?: string | null;
};

/** Dados de eliminação do candidato no concurso (MS-Candidatos). */
export type EliminacaoItem = {
  eliminado?: boolean;
  eliminado_em?: string | null;
  eliminado_motivo?: string;
  eliminado_por?: string;
  processo_uuid?: string | null;
  motivo_historico?: string;
};

/** Resposta do backend: lista de candidatos com concursos (MS-Candidatos). */
export type CandidatoConcursoItem = {
  uuid?: string;
  nome?: string;
  cpf?: string;
  rg?: string;
  registro_funcional?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  telefone?: string;
  celular?: string;
  concursos?: Array<{
    concurso_uuid?: string;
    concurso_nome?: string;
    concurso_candidato_uuid?: string;
    descricao_cargo?: string;
    codigo_cargo?: string;
    classificacao?: number | null;
    classificacao_pcd?: number | null;
    classificacao_nna?: number | null;
    categoria_efetiva?: string | null;
    reclassificacoes?: ReclassificacaoItem[];
    eliminado?: boolean;
    eliminado_em?: string | null;
    eliminado_motivo?: string;
    eliminado_por?: string;
  }>;
};

/** GET buscar candidatos (escolhas/buscar-candidatos -> MS-Candidatos). */
export const getBuscarCandidatos = (
  params: IBuscarCandidatosParams,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();
  const response = appAxiosEscolhas
    .get<CandidatoConcursoItem[]>(URL.getBuscarCandidatos(), {
      params: { ...params },
      paramsSerializer: queryParamsSerializer,
      signal: axiosRequestConfig?.signal ?? signal,
      ...axiosRequestConfig,
    })
    .then((res) => res.data);

  return {
    response,
    abort,
  };
};

/** Params para listar escolhas (filtros do EscolhaViewSet). */
export type IListaEscolhasParams = {
  candidato_uuid?: string;
  concurso_uuid?: string;
  vaga_escola__cargo_codigo?: string;
};

/** Item de escolha retornado pela listagem (EscolhaListSerializer). */
export type EscolhaListItem = {
  uuid?: string;
  candidato_uuid?: string;
  situacao?: string;
  tipo_vaga?: string | null;
  e_retardatario?: boolean;
  vaga_escola_uuid?: string | null;
  vaga_escola?: {
    uuid?: string;
    cargo_codigo?: string;
    cargo_descricao?: string;
    escola?: { nome_oficial?: string; codigo_eol?: string; dre?: { nome?: string; sigla?: string } };
  } | null;
  historico?: Array<{ uuid?: string; situacao_anterior?: string; situacao_nova?: string; criado_em?: string }>;
  criado_em?: string;
  atualizado_em?: string;
};

/** GET listagem de escolhas com filtros (candidato_uuid, concurso_uuid, vaga_escola__cargo_codigo). */
export const getListaEscolhas = (
  params: IListaEscolhasParams,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();
  const response = appAxiosEscolhas
    .get<PaginatedResponse<EscolhaListItem>>(URL.getEscolhas(), {
      params: { page_size: 100, ...params },
      paramsSerializer: queryParamsSerializer,
      signal: axiosRequestConfig?.signal ?? signal,
      ...axiosRequestConfig,
    })
    .then((res) => res.data);

  return {
    response,
    abort,
  };
};