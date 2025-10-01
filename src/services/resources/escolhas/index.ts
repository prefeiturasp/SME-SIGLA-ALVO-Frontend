import type { AxiosRequestConfig } from "axios";
import { appAxiosEscolhas } from "../../axios";
import type { IEscolhas } from "./IEscolhas";
import type { PaginatedResponse } from "../../../types/IListRequest";
import queryParamsSerializer from "../../../utils/queryParamsSerializer";

export const URL = {
  getVagasEscolas: () => `/api/v1/vagas-escolas/`,
};

// TODO adicionar JWT no header Authorization
export const getVagasEscolas = (
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();
// vagas-escolas/?processo_convocacao_uuid=<uuid>&cargo_codigo=<str>&page=1&page_size=10
  const response = appAxiosEscolhas    
    .get<PaginatedResponse<IEscolhas>>(URL.getVagasEscolas(), {
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
