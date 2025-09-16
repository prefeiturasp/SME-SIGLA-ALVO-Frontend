import type { AxiosRequestConfig } from "axios";
import { appAxiosImportaArquivos } from "../../axios";
import type { 
  IGetLayout,
  IImportacaoFundacao,
  IUltimasImportacoesVagas
} from "./IImportacaoArquivos";
import type { PaginatedResponse } from "../../../types/IListRequest";
import queryParamsSerializer from "../../../utils/queryParamsSerializer";

export const URL = {
  getLayout: () => `/api/v1/layouts/`,  
  getImportacaoArquivos: () => `/api/v1/importacao-arquivo/`,
  postImportacaoArquivosHabilitados: () => `/api/v1/importacao-arquivo/habilitados/`,
  getImportacaoArquivosHabilitados: () => `/api/v1/importacao-arquivo/habilitados/`,
  getUltimasImportacoesArquivosVagas: () => `/api/v1/importacao-arquivo/vagas/`,
  postImportacaoArquivosVagas: () => `/api/v1/importacao-arquivo/vagas/`,
};

export const postImportacaoArquivosVagas = (
  payload: { arquivo: File; tipo: string },
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const formData = new FormData();

  formData.append('arquivo', payload.arquivo);
   const response = appAxiosImportaArquivos
    .post<IImportacaoFundacao>(URL.postImportacaoArquivosVagas(), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
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
export const postImportacaoArquivosHabilitados = (
  payload: { cargo?: string; arquivo: File; tipo: string, concurso_uuid:string },
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const formData = new FormData();

  if(payload.cargo)formData.append('cargo', payload.cargo);
  formData.append('arquivo', payload.arquivo);
  formData.append('concurso_uuid', payload.concurso_uuid);
  formData.append('concurso_nome', payload.concurso_nome);

  const response = appAxiosImportaArquivos
    .post<IImportacaoFundacao>(URL.postImportacaoArquivosHabilitados(), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

// // TODO adicionar JWT no header Authorization
export const getImportacaoArquivosHabilitados = (
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();
  const response = appAxiosImportaArquivos
    .get<PaginatedResponse<IImportacaoFundacao>>(URL.getImportacaoArquivosHabilitados(), {
      signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);
  return {
    response,
    abort,
  };
};


// // TODO adicionar JWT no header Authorization
export const getUltimasImportacoesArquivosVagas = (
  params?: Record<string, any>,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosImportaArquivos
    .get<PaginatedResponse<IUltimasImportacoesVagas>>(URL.getUltimasImportacoesArquivosVagas(), {
      params,
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



// // TODO adicionar JWT no header Authorization
export const getLayout = (
  params?: Record<string, any>,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosImportaArquivos
    .get<PaginatedResponse<IGetLayout>>(URL.getLayout(), {
      params,
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
