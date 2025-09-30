import type { AxiosRequestConfig } from "axios";
import { appAxiosProcessoConvocacao } from "../../axios";
import type { ISample, IProcessoConvocacao, ICreateProcessoConvocacaoPayload } from "./IConvocacao";
import type { IBackendWithSubOptions, IListRequest, PaginatedResponse } from "../../../types/IListRequest";
import queryParamsSerializer from "../../../utils/queryParamsSerializer";

export const URL = {
  getProcessosConvocacao: () => `/api/v1/processos-convocacao/`,
  getConcursosOptions: () => `/api/v1/processos-convocacao/filtros/`,
  postProcessoConvocacao: () => `/api/v1/processos-convocacao/`,
  createSample: () => `api/v1/sample/create`,
  editSample: (id:number) => `api/v1/sample/update/${id}/`,
  deleteSample: (id:number) => `api/v1/sample/delete/${id}/`,
  getCargos: () => `/api/v1/cargos/`,
  getCargosPorConcurso: (concursoUuid: string) => `/api/v1/cargos/concurso/${concursoUuid}/`,
};


  

// TODO adicionar JWT no header Authorization
export const getProcessosConvocacao = (
  listRequest: IListRequest,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { pagination, filters, ...rest } = listRequest;
  const { signal, abort } = new AbortController();

  const response = appAxiosProcessoConvocacao
    .get<PaginatedResponse<IProcessoConvocacao>>(URL.getProcessosConvocacao(), {
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

// TODO adicionar JWT no header Authorization
export const postProcessoConvocacao = (
  payload: ICreateProcessoConvocacaoPayload,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosProcessoConvocacao
    .post<IProcessoConvocacao>(URL.postProcessoConvocacao(), payload, {
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

export const createSample = (
  NewSample: IProcessoConvocacao,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosProcessoConvocacao
    .post<IProcessoConvocacao>(URL.createSample(), NewSample, {
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};


export const editSample = (
  NewSample: ISample,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosProcessoConvocacao
    .put<ISample>(URL.editSample(NewSample.id!), NewSample, {
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};



export const deleteSample = (
  id: number,
  axiosRequestConfig?: AxiosRequestConfig
) => {
   const { signal, abort } = new AbortController();

  const response = appAxiosProcessoConvocacao
    .delete(URL.deleteSample(id),  {
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

// TODO adicionar JWT no header Authorization
export const getConcursosOptions = (
   axiosRequestConfig?: AxiosRequestConfig
) => {
   const { signal, abort } = new AbortController();

  const response = appAxiosProcessoConvocacao
    .get<IBackendWithSubOptions>(URL.getConcursosOptions(), {
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
export const getCargosData = (
   axiosRequestConfig?: AxiosRequestConfig
) => {
   const { signal, abort } = new AbortController();

  const response = appAxiosProcessoConvocacao
    .get<IBackendWithSubOptions[]>(URL.getCargos(), {
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
export const getCargosPorConcursoData = (
  concursoUuid: string,
  axiosRequestConfig?: AxiosRequestConfig
) => {
   const { signal, abort } = new AbortController();

  const response = appAxiosProcessoConvocacao
    .get<IBackendWithSubOptions[]>(URL.getCargosPorConcurso(concursoUuid), {
       signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};
