import type { AxiosRequestConfig } from "axios";
import { appAxiosCandidatos } from "../../axios";
import type { ICandidato, IBuscarPorUuidsPayload, IBuscarPorUuidsResponse } from "./ICandidatos";
import type { PaginatedResponse } from "../../../types/IListRequest";
import queryParamsSerializer from "../../../utils/queryParamsSerializer";

export const URL = {
  getCandidatos: () => `/api/v1/candidatos/`,
  getCandidatosHabilitados: () => `/api/v1/habilitados/`,
  patchCandidatosHabilitadosConvocados: () => `/api/v1/habilitados/convocar/`,
  patchCandidatosHabilitadosDesconvocados: () => `/api/v1/habilitados/desconvocar/`,
  postBuscarPorUuids: () => `/api/v1/habilitados/buscar-por-uuids/`,
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

// TODO adicionar JWT no header Authorization
export const getCandidatosHabilitados = (
  params: { geral: number; pcd: number; nna: number; concurso_uuid?: string },
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosCandidatos
    .get<PaginatedResponse<ICandidato>>(URL.getCandidatosHabilitados(), {
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
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

