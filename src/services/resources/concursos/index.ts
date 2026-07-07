import type { AxiosRequestConfig } from "axios";
import { appAxiosConcursos } from "../../axios";
import type {
  IConcurso,
  IConcursoDetalhe,
  IConcursoLista,
  IConcursoPayload,
} from "./IConcursos";
import type { IListRequest, PaginatedResponse } from "../../../types/IListRequest";
import queryParamsSerializer from "../../../utils/queryParamsSerializer";

export const URL = {
  getConcursos: () => `/api/v1/concursos/?formato=select`,
  listarConcursos: () => `/api/v1/concursos/`,
  getConcursoByUuid: (uuid: string) => `/api/v1/concursos/${uuid}/`,
  postConcurso: () => `/api/v1/concursos/`,
  patchConcurso: (uuid: string) => `/api/v1/concursos/${uuid}/`,
};


  

// TODO adicionar JWT no header Authorization
export const getConcursos = (
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosConcursos
    .get<PaginatedResponse<IConcurso>>(URL.getConcursos(), {
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
export const getConcursoByUuid = (
  uuid: string,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosConcursos
    .get<IConcursoDetalhe>(URL.getConcursoByUuid(uuid), {
      signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);
  return {
    response,
    abort,
  };
};

export const listarConcursos = (
  listRequest: IListRequest,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { pagination, filters, ...rest } = listRequest;
  const { signal, abort } = new AbortController();

  const response = appAxiosConcursos
    .get<PaginatedResponse<IConcursoLista>>(URL.listarConcursos(), {
      params: { ...pagination, ...filters, ...rest },
      paramsSerializer: queryParamsSerializer,
      signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return { response, abort };
};

export const postConcurso = (
  payload: IConcursoPayload,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosConcursos
    .post<IConcursoLista>(URL.postConcurso(), payload, {
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return { response, abort };
};

export const patchConcurso = (
  uuid: string,
  payload: Partial<IConcursoPayload>,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosConcursos
    .patch<IConcursoLista>(URL.patchConcurso(uuid), payload, {
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return { response, abort };
};
