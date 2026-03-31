import type { AxiosRequestConfig } from "axios";
import { appAxiosImportaArquivos } from "../../axios";
import type { 
  IGetLayout,
  IImportacaoFundacao,
  IUltimasImportacoesVagas,
  IErroImportacaoResposta,
  IImportacaoEscolhasPayload,
  IImportacaoEscolhasResponse,
  IUltimasImportacoesEscolhas
} from "./IImportacaoArquivos";
import type { IListRequest, PaginatedResponse } from "../../../types/IListRequest";
import queryParamsSerializer from "../../../utils/queryParamsSerializer";
import type { IImportacaoVagasPayload } from "../../../pages/Processos/ImportacaoDados/Vagas/hooks/types";

export const URL = {
  getLayout: () => `/api/v1/layouts/`,
  getLayoutDownload: () => `/api/v1/layouts/download/`,
  getImportacaoArquivos: () => `/api/v1/importacao-arquivo/`,
  postImportacaoArquivosHabilitados: () => `/api/v1/importacao-arquivo/habilitados/`,
  getImportacaoArquivosHabilitados: () => `/api/v1/importacao-arquivo/habilitados/`,
  getErrosHabilitados: () => `/api/v1/importacao-arquivo/habilitados/erros/`,
  getErrosHabilitadosDownload: () => `/api/v1/importacao-arquivo/habilitados/erros/download/`,
  getUltimasImportacoesArquivosVagas: () => `/api/v1/importacao-arquivo/vagas/`,
  postImportacaoArquivosVagas: () => `/api/v1/importacao-arquivo/vagas/`,
  getErrosVagas: () => `/api/v1/importacao-arquivo/vagas/erros/`,
  getErrosVagasDownload: () => `/api/v1/importacao-arquivo/vagas/erros/download/`,
  postImportacaoEscolhas: () => `/api/v1/importacao-escolhas/`,
  getImportacaoEscolhas: () => `/api/v1/importacao-escolhas/`,
  getErrosEscolhas: () => `/api/v1/importacao-escolhas/erros/`,
  getErrosEscolhasDownload: () => `/api/v1/importacao-escolhas/erros/download/`,
  postImportacaoLotes: () => `/api/v1/importacao/lotes/`,
  getImportacaoLotes: () => `/api/v1/importacao/lotes/`,
};

export const postImportacaoArquivosVagas = (
  payload: IImportacaoVagasPayload,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

 
  const response = appAxiosImportaArquivos
    .post<IImportacaoFundacao>(URL.postImportacaoArquivosVagas(), payload, {
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
  payload: { cargo?: string; arquivo: File; tipo: string, concurso_uuid:string, concurso_nome: string },
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
  params?: Record<string, any>,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();
  const response = appAxiosImportaArquivos
    .get<PaginatedResponse<IImportacaoFundacao>>(URL.getImportacaoArquivosHabilitados(), {
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



export const getUltimasImportacoesArquivosVagas = (
  listRequest: IListRequest<unknown>,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { pagination, ...rest } = listRequest;
  const { signal, abort } = new AbortController();

  const response = appAxiosImportaArquivos
    .get<PaginatedResponse<IUltimasImportacoesVagas>>(URL.getUltimasImportacoesArquivosVagas(), {
      params: { ...pagination, ...rest },
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

// Download do layout (CSV) - retorna Blob
export const getLayoutDownload = (
  params?: Record<string, any>,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosImportaArquivos
    .get<Blob>(URL.getLayoutDownload(), {
      params,
      paramsSerializer: queryParamsSerializer,
      responseType: 'blob',
      signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

// Buscar erros de habilitados
export const getErrosHabilitados = (
  importacao_uuid: string,
  params?: Record<string, any>,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();
  const response = appAxiosImportaArquivos
    .get<PaginatedResponse<IErroImportacaoResposta>>(
      URL.getErrosHabilitados(),
      {
        params: { importacao_uuid, ...params },
        paramsSerializer: queryParamsSerializer,
        signal,
        ...axiosRequestConfig,
      }
    )
    .then((response) => response.data);
  return {
    response,
    abort,
  };
};

// Download erros de habilitados - retorna Blob
export const getErrosHabilitadosDownload = (
  importacao_uuid: string,
  params?: Record<string, any>,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();
  const response = appAxiosImportaArquivos
    .get<Blob>(URL.getErrosHabilitadosDownload(), {
      params: { importacao_uuid, ...params },
      paramsSerializer: queryParamsSerializer,
      responseType: 'blob',
      signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);
  return {
    response,
    abort,
  };
};

// Buscar erros de vagas
export const getErrosVagas = (
  importacao_uuid: string,
  params?: Record<string, any>,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();
  const response = appAxiosImportaArquivos
    .get<PaginatedResponse<IErroImportacaoResposta>>(
      URL.getErrosVagas(),
      {
        params: { importacao_uuid, ...params },
        paramsSerializer: queryParamsSerializer,
        signal,
        ...axiosRequestConfig,
      }
    )
    .then((response) => response.data);
  return {
    response,
    abort,
  };
};

// Download erros de vagas - retorna Blob
export const getErrosVagasDownload = (
  importacao_uuid: string,
  params?: Record<string, any>,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();
  const response = appAxiosImportaArquivos
    .get<Blob>(URL.getErrosVagasDownload(), {
      params: { importacao_uuid, ...params },
      paramsSerializer: queryParamsSerializer,
      responseType: 'blob',
      signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);
  return {
    response,
    abort,
  };
};

// Importação de escolhas
export const postImportacaoEscolhas = (
  payload: IImportacaoEscolhasPayload,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosImportaArquivos
    .post<IImportacaoEscolhasResponse>(URL.postImportacaoEscolhas(), payload, {
      headers: {
        'Content-Type': 'application/json',
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

// Buscar importações de escolhas
export const getImportacaoEscolhas = (
  listRequest: IListRequest<unknown>,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { pagination, ...rest } = listRequest;
  const { signal, abort } = new AbortController();

  const response = appAxiosImportaArquivos
    .get<PaginatedResponse<IImportacaoEscolhasResponse>>(URL.getImportacaoEscolhas(), {
      params: { ...pagination, ...rest },
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

// Buscar erros de escolhas
export const getErrosEscolhas = (
  importacao_uuid: string,
  params?: Record<string, any>,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();
  const response = appAxiosImportaArquivos
    .get<PaginatedResponse<IErroImportacaoResposta>>(
      URL.getErrosEscolhas(),
      {
        params: { importacao_uuid, ...params },
        paramsSerializer: queryParamsSerializer,
        signal,
        ...axiosRequestConfig,
      }
    )
    .then((response) => response.data);
  return {
    response,
    abort,
  };
};

export const postImportacaoLotes = (
  payload: { arquivo: File; concurso_uuid: string; concurso_nome?: string },
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const formData = new FormData();
  formData.append('arquivo', payload.arquivo);
  formData.append('concurso_uuid', payload.concurso_uuid);
  if (payload.concurso_nome) formData.append('concurso_nome', payload.concurso_nome);

  const response = appAxiosImportaArquivos
    .post(URL.postImportacaoLotes(), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return { response, abort };
};

export const getImportacaoLotes = (
  params?: Record<string, any>,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();
  const response = appAxiosImportaArquivos
    .get(URL.getImportacaoLotes(), {
      params,
      paramsSerializer: queryParamsSerializer,
      signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);
  return { response, abort };
};

// Download erros de escolhas - retorna Blob
export const getErrosEscolhasDownload = (
  importacao_uuid: string,
  params?: Record<string, any>,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();
  const response = appAxiosImportaArquivos
    .get<Blob>(URL.getErrosEscolhasDownload(), {
      params: { importacao_uuid, ...params },
      paramsSerializer: queryParamsSerializer,
      responseType: 'blob',
      signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);
  return {
    response,
    abort,
  };
};
