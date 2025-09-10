import type { AxiosRequestConfig } from "axios";
import { appAxiosConcursos } from "../../axios";
import type { ICargos } from "./ICargos";
import type { PaginatedResponse } from "../../../types/IListRequest";
import queryParamsSerializer from "../../../utils/queryParamsSerializer";

export const URL = {
  getCargos: () => `/api/v1/vagas/?formato=select`,
};


  

// TODO adicionar JWT no header Authorization
export const getCargos = (
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosConcursos
    .get<PaginatedResponse<ICargos>>(URL.getCargos(), {
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