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
import type { IListRequest } from "../../../types/IListRequest";
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
  postInclusaoVagasEscolas: () => `/api/v1/vagas-escolas/inclusao/`,
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