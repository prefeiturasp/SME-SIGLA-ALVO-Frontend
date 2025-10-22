import type { AxiosRequestConfig } from "axios";
import { appAxiosAgenda } from "../../axios";
import type { PaginatedResponse } from "../../../types/IListRequest";
import queryParamsSerializer from "../../../utils/queryParamsSerializer";
import type {  ICandidatosClassificados, IAgenda } from "./IAgenda";

export const URL = {
    getAgenda: (processoUuid: string) => `/api/v1/agendas/?processo_uuid=${processoUuid}`,
};


  

// TODO adicionar JWT no header Authorization
export const getAgenda = (
  processoUuid: string,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosAgenda
    .get<IAgenda[]>(URL.getAgenda(processoUuid), {
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