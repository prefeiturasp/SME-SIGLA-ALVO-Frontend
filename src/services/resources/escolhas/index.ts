import type { AxiosRequestConfig } from "axios";
import { appAxiosEscolhas } from "../../axios";
import type { IEscolhas, IEscolhasFiltro } from "./IEscolhas";
import type { IListRequest, PaginatedResponse } from "../../../types/IListRequest";
import queryParamsSerializer from "../../../utils/queryParamsSerializer";
import type {  IVagasResponse } from "../convocacao/IConvocacao";

export const URL = {
  getVagasEscolas: () => `/api/v1/vagas-escolas/`,
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
