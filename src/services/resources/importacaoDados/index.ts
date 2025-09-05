import type { AxiosRequestConfig } from "axios";
import { appAxiosImportaArquivos } from "../../axios";
import type { 
  IImportacaoFundacao
} from "./IImportacaoArquivos";
import type { PaginatedResponse } from "../../../types/IListRequest";
import queryParamsSerializer from "../../../utils/queryParamsSerializer";

export const URL = {
  getImportacaoArquivos: () => `/api/v1/importacao-arquivos/`,
  postImportacaoArquivos: () => `/api/v1/importacao-arquivos/`,
  getLayoutArquivos: () => `/api/v1/layouts/`,
};

// TODO adicionar JWT no header Authorization
export const postImportacaoArquivos = (
  payload: { concurso: string; arquivo: File; tipo: string },
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const formData = new FormData();
  formData.append('concurso', payload.concurso);
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

export const getLayoutArquivos = (
  params?: Record<string, any>,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosImportaArquivos
    .get<PaginatedResponse<IImportacaoFundacao>>(URL.getLayoutArquivos(), {
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
// export const createImportacao = (
//   importacaoData: IImportacaoRequest,
//   axiosRequestConfig?: AxiosRequestConfig
// ) => {
//   const { signal, abort } = new AbortController();
  
//   const formData = new FormData();
//   formData.append('concurso', importacaoData.concurso);
//   formData.append('arquivo', importacaoData.arquivo);
//   formData.append('ignorar_primeira_linha', importacaoData.ignorar_primeira_linha.toString());

//   const response = appAxiosFundacao
//     .post<IImportacaoResponse>(URL.createImportacao(), formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//       signal: axiosRequestConfig?.signal || signal,
//       ...axiosRequestConfig,
//     })
//     .then((response) => response.data);

//   return {
//     response,
//     abort,
//   };
// };

// // TODO adicionar JWT no header Authorization
// export const getImportacao = (
//   id: string,
//   axiosRequestConfig?: AxiosRequestConfig
// ) => {
//   const { signal, abort } = new AbortController();

//   const response = appAxiosFundacao
//     .get<IImportacaoFundacao>(URL.getImportacao(id), {
//       signal: axiosRequestConfig?.signal || signal,
//       ...axiosRequestConfig,
//     })
//     .then((response) => response.data);

//   return {
//     response,
//     abort,
//   };
// };

// // TODO adicionar JWT no header Authorization
// export const updateImportacao = (
//   id: string,
//   importacaoData: Partial<IImportacaoFundacao>,
//   axiosRequestConfig?: AxiosRequestConfig
// ) => {
//   const { signal, abort } = new AbortController();

//   const response = appAxiosFundacao
//     .put<IImportacaoFundacao>(URL.updateImportacao(id), importacaoData, {
//       signal: axiosRequestConfig?.signal || signal,
//       ...axiosRequestConfig,
//     })
//     .then((response) => response.data);

//   return {
//     response,
//     abort,
//   };
// };

// // TODO adicionar JWT no header Authorization
// export const deleteImportacao = (
//   id: string,
//   axiosRequestConfig?: AxiosRequestConfig
// ) => {
//   const { signal, abort } = new AbortController();

//   const response = appAxiosFundacao
//     .delete(URL.deleteImportacao(id), {
//       signal: axiosRequestConfig?.signal || signal,
//       ...axiosRequestConfig,
//     })
//     .then((response) => response.data);

//   return {
//     response,
//     abort,
//   };
// };

// // TODO adicionar JWT no header Authorization
// export const getHistoricoImportacoes = (
//   axiosRequestConfig?: AxiosRequestConfig
// ) => {
//   const { signal, abort } = new AbortController();

//   const response = appAxiosFundacao
//     .get<PaginatedResponse<IImportacaoFundacao>>(URL.getHistorico(), {
//       paramsSerializer: queryParamsSerializer,
//       signal,
//       ...axiosRequestConfig,
//     })
//     .then((response) => response.data);

//   return {
//     response,
//     abort,
//   };
// };

// // TODO adicionar JWT no header Authorization
// export const uploadArquivo = (
//   arquivo: File,
//   axiosRequestConfig?: AxiosRequestConfig
// ) => {
//   const { signal, abort } = new AbortController();
  
//   const formData = new FormData();
//   formData.append('arquivo', arquivo);

//   const response = appAxiosFundacao
//     .post<{ url: string; filename: string }>(URL.uploadArquivo(), formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//       signal: axiosRequestConfig?.signal || signal,
//       ...axiosRequestConfig,
//     })
//     .then((response) => response.data);

//   return {
//     response,
//     abort,
//   };
// };
