import type { AxiosRequestConfig } from "axios";
import { appAxiosCandidatos } from "../../axios";
import type { ICandidato, IBuscarPorUuidsPayload, IBuscarPorUuidsResponse } from "./ICandidatos";
import type { PaginatedResponse } from "../../../types/IListRequest";
import queryParamsSerializer from "../../../utils/queryParamsSerializer";

export const URL = {
  getCandidatos: () => `/api/v1/candidatos/`,
  getCandidatosHabilitados: () => `/api/v1/habilitados/`,
  postHabilitadoEliminar: () => `/api/v1/habilitados/eliminar/`,
  postReclassificar: () => `/api/v1/habilitados/reclassificar/`,
  getCandidatosHabilitadosReposicao: () => `/api/v1/habilitados/reposicao/`,
  getCandidatosHabilitadosReconvocacao: () => `/api/v1/habilitados/reconvocacao/`,
  getCandidatosHabilitadosCalculados: () => `/api/v1/habilitados/calculados/`,
  patchCandidatosHabilitadosConvocados: () => `/api/v1/habilitados/convocar/`,
  patchCandidatosHabilitadosDesconvocados: () => `/api/v1/habilitados/desconvocar/`,
  postBuscarPorUuids: () => `/api/v1/habilitados/buscar-por-uuids/`,
  getParametrizacao: () => `/api/v1/parametrizacao/`,
  patchParametrizacao: (uuid?: string) => uuid ? `/api/v1/parametrizacao/${uuid}/` : `/api/v1/parametrizacao/`,
};

// TODO adicionar JWT no header Authorization
export const getCandidatos = (
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosCandidatos    
    .get<PaginatedResponse<ICandidato>>(URL.getCandidatos(), {
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

// POST eliminar habilitado
export const postHabilitadoEliminar = (
  payload: { candidato_uuid: string; motivo: string },
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosCandidatos
    .post(URL.postHabilitadoEliminar(), payload, {
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

// POST reclassificar candidato
export const postReclassificarCandidato = (
  payload: { candidato_uuid: string; desclassificar_de: string; motivo: string },
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosCandidatos
    .post(URL.postReclassificar(), payload, {
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

// TODO adicionar JWT no header Authorization
export const getCandidatosHabilitados = (
  params?: Record<string, unknown>,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  // Remove campos indefinidos/nulos para não poluir a query
  const safeParams =
    params && typeof params === "object"
      ? Object.fromEntries(
          Object.entries(params).filter(
            ([, value]) => value !== undefined && value !== null
          )
        )
      : undefined;

  const response = appAxiosCandidatos
    .get<PaginatedResponse<ICandidato>>(URL.getCandidatosHabilitados(), {
      params: safeParams,
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

// TODO adicionar JWT no header Authorization
export const getCandidatosHabilitadosReposicao = (
  params: { concurso_uuid: string; geral?: number; pcd?: number; nna?: number; codigo_cargo?: string },
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosCandidatos
    .get<ICandidato[]>(URL.getCandidatosHabilitadosReposicao(), {
      params,
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

// TODO adicionar JWT no header Authorization
export const getCandidatosHabilitadosReconvocacao = (
  params: { concurso_uuid: string; geral?: number; pcd?: number; nna?: number; codigo_cargo?: string },
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosCandidatos
    .get<ICandidato[]>(URL.getCandidatosHabilitadosReconvocacao(), {
      params,
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

// TODO adicionar JWT no header Authorization
export const getCandidatosHabilitadosCalculados = (
  params: { concurso_uuid: string; quantidade: number; codigo_cargo?: string },
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosCandidatos
    .get<ICandidato[]>(URL.getCandidatosHabilitadosCalculados(), {
      params,
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

// TODO adicionar JWT no header Authorization
export const patchCandidatosHabilitadosConvocados = (
  payload: { concurso_uuid: string; processo_uuid: string; candidatos: string[]; foi_convocado: boolean },
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosCandidatos
    .patch(URL.patchCandidatosHabilitadosConvocados(), payload, {
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

export const patchCandidatosHabilitadosDesconvocados = (
  payload: { codigo_cargo: string; processo_uuid: string; },
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosCandidatos
    .patch(URL.patchCandidatosHabilitadosDesconvocados(), payload, {
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

// TODO adicionar JWT no header Authorization
export const postBuscarPorUuids = (
  payload: IBuscarPorUuidsPayload,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosCandidatos
    .post<IBuscarPorUuidsResponse>(URL.postBuscarPorUuids(), payload, {
      params: { order_by: "ranking_escolha", ...(axiosRequestConfig?.params as any) },
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

// GET Parametrizacao do MS-Candidatos
export const getParametrizacaoCandidatos = (
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosCandidatos
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

// PATCH Parametrizacao do MS-Candidatos
export const patchParametrizacaoCandidatos = (
  payload: Record<string, any>,
  uuid?: string,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosCandidatos
    .patch(URL.patchParametrizacao(uuid), payload, {
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

