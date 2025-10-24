import type { AxiosRequestConfig } from "axios";
import { appAxiosConcursos } from "../../axios";
import type { IConcurso } from "./IConcursos";
import type { PaginatedResponse } from "../../../types/IListRequest";
import queryParamsSerializer from "../../../utils/queryParamsSerializer";

export const URL = {
  getConcursos: () => `/api/v1/concursos/?formato=select`,
  getConcursoByUuid: (uuid: string) => `/api/v1/concursos/${uuid}/`,
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
    .get<IConcurso>(URL.getConcursoByUuid(uuid), {
      signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);
  return {
    response,
    abort,
  };
};