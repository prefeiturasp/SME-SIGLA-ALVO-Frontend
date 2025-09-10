import type { AxiosRequestConfig } from "axios";
import { appAxiosImportaArquivos } from "../../axios";
import type { 
  IImportacaoFundacao,
  IUltimasImportacoesVagas
} from "./IImportacaoArquivos";
import type { PaginatedResponse } from "../../../types/IListRequest";
import queryParamsSerializer from "../../../utils/queryParamsSerializer";

export const URL = {
  getUltimasImportacoesArquivos: () => `/api/v1/importacao-arquivos/`,
  getImportacaoArquivos: () => `/api/v1/importacao-arquivos/`,
  postImportacaoArquivos: () => `/api/v1/importacao-arquivos/`,
};

//TODO Deixar genérico
// TODO adicionar JWT no header Authorization
export const postImportacaoArquivos = (
  payload: { cargo: string; arquivo: File; tipo: string },
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const formData = new FormData();
  formData.append('cargo', payload.cargo);
  formData.append('arquivo', payload.arquivo);
  formData.append('tipo', payload.tipo);
  const response = appAxiosImportaArquivos
    .post<IImportacaoFundacao>(URL.postImportacaoArquivos(), formData, {
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
export const getImportacaoArquivos = (
  params?: Record<string, any>,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosImportaArquivos
    .get<PaginatedResponse<IImportacaoFundacao>>(URL.getImportacaoArquivos(), {
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
export const getUltimasImportacoesArquivos = (
  params?: Record<string, any>,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosImportaArquivos
    .get<PaginatedResponse<IUltimasImportacoesVagas>>(URL.getUltimasImportacoesArquivos(), {
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
