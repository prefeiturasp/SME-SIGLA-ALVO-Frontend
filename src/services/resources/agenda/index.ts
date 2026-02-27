import type { AxiosRequestConfig } from "axios";
import { appAxiosAgenda } from "../../axios";
import type { IListRequest, PaginatedResponse } from "../../../types/IListRequest";
import queryParamsSerializer from "../../../utils/queryParamsSerializer";
import type { IAgenda, IAgendaCreate, IAgendaFilters } from "./IAgenda";

export const URL = {
  getAgendas: () => `/api/v1/agendas/`,
  getAgendaByUuid: (uuid: string) => `/api/v1/agendas/${uuid}/`,
  postAgenda: () => `/api/v1/agendas/`,
  patchAgenda: (uuid: string) => `/api/v1/agendas/${uuid}/`,
  putAgenda: (uuid: string) => `/api/v1/agendas/${uuid}/`,
  deleteAgenda: (uuid: string) => `/api/v1/agendas/${uuid}/`,
};

/**
 * Lista agendas com paginação e filtros
 */
export const getAgendas = (
  listRequest?: IListRequest<IAgendaFilters>,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { pagination, filters, ...rest } = listRequest || {};
  const { signal, abort } = new AbortController();

  const response = appAxiosAgenda
    .get<PaginatedResponse<IAgenda>>(URL.getAgendas(), {
      params: { ...pagination, ...filters, ...rest },
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

/**
 * Busca uma agenda específica por UUID
 */
export const getAgendaByUuid = (
  uuid: string,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosAgenda
    .get<IAgenda>(URL.getAgendaByUuid(uuid), {
      signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

/**
 * Cria uma ou várias agendas (aceita lista de dicionários)
 */
export const postAgenda = (
  payload: IAgendaCreate | IAgendaCreate[],
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  // Se não for array, converte para array
  const payloadArray = Array.isArray(payload) ? payload : [payload];

  const response = appAxiosAgenda
    .post<IAgenda[]>(URL.postAgenda(), payloadArray, {
      signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

/**
 * Atualiza parcialmente uma agenda
 */
export const patchAgenda = (
  uuid: string,
  payload: Partial<IAgendaCreate>,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosAgenda
    .patch<IAgenda>(URL.patchAgenda(uuid), payload, {
      signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

/**
 * Atualiza completamente uma agenda
 */
export const putAgenda = (
  uuid: string,
  payload: IAgendaCreate,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosAgenda
    .put<IAgenda>(URL.putAgenda(uuid), payload, {
      signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

/**
 * Deleta uma agenda
 */
export const deleteAgenda = (
  uuid: string,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosAgenda
    .delete(URL.deleteAgenda(uuid), {
      signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};