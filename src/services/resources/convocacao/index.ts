import type { AxiosRequestConfig } from "axios";
import { appAxiosProcessoConvocacao } from "../../axios";
import type { ISample, IProcessoConvocacao, IProcessoConvocacaoDetalhe, IPostProcessoConvocacaoPayload, IProcessoConvocacaoResumo, ICargoProcesso, ICartaConvocacaoPayload, ICartaConvocacaoResponse, IHistoricoCartaConvocacao, IHistoricoCartaConvocacaoDetalhe } from "./IConvocacao";
import type { IBackendWithSubOptions, IListRequest, PaginatedResponse } from "../../../types/IListRequest";
import queryParamsSerializer from "../../../utils/queryParamsSerializer";

export const URL = {
  getProcessosConvocacao: () => `/api/v1/processos-convocacao/`,
  getProcessoConvocacaoPorUUID: (uuid: string) => `/api/v1/processos-convocacao/${uuid}/`,
  getConcursosOptions: () => `/api/v1/processos-convocacao/filtros/`,
  postProcessoConvocacao: () => `/api/v1/processos-convocacao/`,
  patchProcessoConvocacao: (uuid: string) => `/api/v1/processos-convocacao/${uuid}/`,
  patchAtualizarPassoProcesso: (processoUuid: string) => `/api/v1/processos-convocacao/${processoUuid}/passo/`,
  deleteProcessoConvocacao: (uuid: string) => `/api/v1/processos-convocacao/${uuid}/`,
  getProcessoConvocacaoById:(uuid: string) => `/api/v1/processos-convocacao/${uuid}/`,
  postFinalizarProcessoConvocacao: (uuid: string) => `/api/v1/processos-convocacao/${uuid}/finalizar/`,
  getProcessosConvocacaoOptions: () => `/api/v1/processos-convocacao/?formato=select`,
  getCargos: () => `/api/v1/cargos/`,
  getCargosPorConcurso: (concursoUuid: string) => `/api/v1/cargos/concurso/${concursoUuid}/`,
  getCargosProcesso: (processoUuid: string) => `/api/v1/processos-convocacao/${processoUuid}/cargos/`,
  postCargosProcesso: (processoUuid: string) => `/api/v1/processos-convocacao/${processoUuid}/cargos/`,
  patchCargoProcesso: (processoUuid: string, cargoUuid: string) => `/api/v1/processos-convocacao/${processoUuid}/cargos/${cargoUuid}/`,
  deleteCargoProcesso: (processoUuid: string, cargoUuid: string) => `/api/v1/processos-convocacao/${processoUuid}/cargos/${cargoUuid}/`,
  postCartaConvocacao: () => `/api/v1/carta-convocacao/`,
  getHistoricoCartaConvocacao: () => `/api/v1/carta-convocacao/`,
  getDetalheCartaConvocacao: (uuid: string) => `/api/v1/carta-convocacao/${uuid}/`,
  createSample: () => `/api/v1/samples/`,
  editSample: (id: number) => `/api/v1/samples/${id}/`,
  deleteSample: (id: number) => `/api/v1/samples/${id}/`,
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

// DELETE processo de convocação por UUID
export const deleteProcessoConvocacao = (
  uuid: string,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosProcessoConvocacao
    .delete(URL.deleteProcessoConvocacao(uuid), {
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
export const getProcessoConvocacaoPorUUID = (
  uuid: string,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosProcessoConvocacao
    .get<IProcessoConvocacaoDetalhe>(URL.getProcessoConvocacaoPorUUID(uuid), {
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
  payload: IPostProcessoConvocacaoPayload,
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

export const patchProcessoConvocacao = (
  uuid: string,
  payload: Partial<IPostProcessoConvocacaoPayload>,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosProcessoConvocacao
    .patch<IProcessoConvocacao>(URL.patchProcessoConvocacao(uuid), payload, {
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

export const patchAtualizarPassoProcesso = (
  processoUuid: string,
  passo: 1 | 2 | 3 | 4,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosProcessoConvocacao
    .patch<IProcessoConvocacao>(URL.patchAtualizarPassoProcesso(processoUuid), { passo }, {
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
export const getProcessoConvocacaoById = (
  uuid: string,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosProcessoConvocacao
    .get<IProcessoConvocacaoResumo>(URL.getProcessoConvocacaoById(uuid), {
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

/**
 * Finaliza o processo de convocação (POST finalizar).
 * Backend valida se todos os convocados fizeram escolha; retorna 400 se houver pendente.
 */
export const postFinalizarProcessoConvocacao = (
  uuid: string,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosProcessoConvocacao
    .post<IProcessoConvocacao>(URL.postFinalizarProcessoConvocacao(uuid), {}, {
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
export const getProcessosConvocacaoOptions = (
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();
  const response = appAxiosProcessoConvocacao
   .get<IBackendWithSubOptions>(URL.getProcessosConvocacaoOptions(), {
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

/**
 * Busca os cargos de um processo de convocação
 */
export const getCargosProcesso = (
  processoUuid: string,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosProcessoConvocacao
    .get<any[]>(URL.getCargosProcesso(processoUuid), {
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
 * Salva os cargos de um processo de convocação
 */
export const postCargosProcesso = (
  processoUuid: string,
  payload: Array<ICargoProcesso>,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosProcessoConvocacao
    .post<any>(URL.postCargosProcesso(processoUuid), payload, {
      signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};


export const postCartaConvocacao = (
  payload: ICartaConvocacaoPayload,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosProcessoConvocacao
    .post<ICartaConvocacaoResponse>(URL.postCartaConvocacao(), payload, {
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

export const getHistoricoCartaConvocacao = (
  listRequest: IListRequest,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { pagination, filters, ...rest } = listRequest;
  const { signal, abort } = new AbortController();

  const response = appAxiosProcessoConvocacao
    .get<PaginatedResponse<IHistoricoCartaConvocacao>>(URL.getHistoricoCartaConvocacao(), {
      params: { ...pagination, ...filters, ...rest },
      paramsSerializer: queryParamsSerializer,
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((res) => res.data);

  return {
    response,
    abort,
  };
};

export const getDetalheCartaConvocacao = (
  uuid: string,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosProcessoConvocacao
    .get<IHistoricoCartaConvocacaoDetalhe>(URL.getDetalheCartaConvocacao(uuid), {
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((res) => res.data);

  return {
    response,
    abort,
  };
};

export const patchCargoProcesso = (
  processoUuid: string,
  cargoUuid: string,
  payload: Partial<ICargoProcesso>,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosProcessoConvocacao
    .patch(URL.patchCargoProcesso(processoUuid, cargoUuid), payload, {
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

export const deleteCargoProcesso = (
  processoUuid: string,
  cargoUuid: string,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosProcessoConvocacao
    .delete(URL.deleteCargoProcesso(processoUuid, cargoUuid), {
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};
