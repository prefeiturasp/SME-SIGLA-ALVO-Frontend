import type { AxiosRequestConfig } from "axios";
import { appAxiosEscolhas } from "../../axios";
import type { IEscolhasFiltro } from "./IEscolhas";
import type { IListRequest } from "../../../types/IListRequest";
import queryParamsSerializer from "../../../utils/queryParamsSerializer";
import type {  IVagasResponse } from "../convocacao/IConvocacao";

export const URL = {
  getVagasEscolas: () => `/api/v1/vagas-escolas/`,
  patchVagasEscolasUtilizadas: () => `/api/v1/vagas-escolas/utilizadas/`,
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
