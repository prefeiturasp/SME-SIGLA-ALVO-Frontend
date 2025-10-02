import type { AxiosRequestConfig } from "axios";
import { appAxiosCandidatos } from "../../axios";
import type { ICandidato } from "./ICandidatos";
import type { PaginatedResponse } from "../../../types/IListRequest";
import queryParamsSerializer from "../../../utils/queryParamsSerializer";

export const URL = {
  getCandidatos: () => `/api/v1/candidatos/`,
  getCandidatosHabilitados: () => `/api/v1/habilitados/`,
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
  params: { geral: number; pcd: number; nna: number },
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
