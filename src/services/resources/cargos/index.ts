import type { AxiosRequestConfig } from "axios";
import { appAxiosConcursos } from "../../axios";
import type { ICargos } from "./ICargos";
import type { IAutorizacaoPublicada } from "./IAutorizacaoPublicada";
import type { PaginatedResponse } from "../../../types/IListRequest";
import queryParamsSerializer from "../../../utils/queryParamsSerializer";

export const URL = {
  getCargosAutorizacoesPublicadas: () => `/api/v1/cargos/autorizacoes-publicadas/`,
  getAutorizacoesPublicadasPorCargo: (cargoUuid: string) => `/api/v1/autorizacoes-publicadas/?cargo__uuid=${cargoUuid}`,
  postAutorizacaoPublicada: () => `/api/v1/autorizacoes-publicadas/`,
  patchAutorizacaoPublicada: (uuid: string) => `/api/v1/autorizacoes-publicadas/${uuid}/`,
  deleteAutorizacaoPublicada: (uuid: string) => `/api/v1/autorizacoes-publicadas/${uuid}/`,
};


  

// TODO adicionar JWT no header Authorization
export const getCargosAutorizacoesPublicadas = (
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosConcursos
    .get<PaginatedResponse<ICargos>>(URL.getCargosAutorizacoesPublicadas(), {
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

export const getAutorizacoesPublicadasPorCargo = (
  cargoUuid: string,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosConcursos
    .get<PaginatedResponse<IAutorizacaoPublicada>>(URL.getAutorizacoesPublicadasPorCargo(cargoUuid), {
      signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

export const postAutorizacaoPublicada = (
  payload: unknown,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosConcursos
    .post(URL.postAutorizacaoPublicada(), payload, {
      signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

export const patchAutorizacaoPublicada = (
  uuid: string,
  payload: unknown,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosConcursos
    .patch(URL.patchAutorizacaoPublicada(uuid), payload, {
      signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

export const deleteAutorizacaoPublicada = (
  uuid: string,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosConcursos
    .delete(URL.deleteAutorizacaoPublicada(uuid), {
      signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};