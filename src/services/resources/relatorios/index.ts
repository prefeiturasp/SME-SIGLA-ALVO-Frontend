import type { AxiosRequestConfig } from "axios";
import { appAxiosRelatorios } from "../../axios";
import type { FormatoRelatorio, IRelatorioPayload } from "./IRelatorios";

export const URL = {
  postRelatorios: () => `/api/v1/relatorios/`,
  getParametrizacao: () => `/api/v1/parametrizacao/`,
  patchParametrizacao: (uuid?: string) => uuid ? `/api/v1/parametrizacao/${uuid}/` : `/api/v1/parametrizacao/`,
  getPersonalizacao: () => `/api/v1/relatorios/personalizacao/`,
  patchPersonalizacao: (uuid?: string) => uuid ? `/api/v1/relatorios/personalizacao/${uuid}/` : `/api/v1/relatorios/personalizacao/`,
};

/**
 * POST para gerar relatórios
 * Param formato é opcional. Ex: "pdf" | "csv" | "xlsx"
 */
export const postRelatorio = (
  payload: IRelatorioPayload,
  formato?: FormatoRelatorio,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosRelatorios
    .post(URL.postRelatorios(), payload, {
      params: formato ? { formato } : undefined,
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((res) => res.data);

  return {
    response,
    abort,
  };
};

// GET Parametrizacao do MS-Relatorios
export const getParametrizacaoRelatorios = (
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosRelatorios
    .get(URL.getParametrizacao(), {
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

// PATCH Parametrizacao do MS-Relatorios
export const patchParametrizacaoRelatorios = (
  payload: FormData | Record<string, any>,
  uuid?: string,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const config: AxiosRequestConfig = {
    signal: axiosRequestConfig?.signal || signal,
    ...axiosRequestConfig,
  };

  if (payload instanceof FormData) {
    config.headers = {
      ...config.headers,
      'Content-Type': 'multipart/form-data',
    };
  }

  const response = appAxiosRelatorios
    .patch(URL.patchParametrizacao(uuid), payload, config)
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

// GET Personalização do relatório
export const getPersonalizacaoRelatorio = (
  processoUuid: string,
  tipoRelatorio: string,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosRelatorios
    .get(URL.getPersonalizacao(), {
      params: {
        processo_uuid: processoUuid,
        tipo: tipoRelatorio,
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

// PATCH Personalização do relatório
export const patchPersonalizacaoRelatorio = (
  processoUuid: string,
  tipoRelatorio: string,
  payload: {
    usar_cabecalho: boolean;
    usar_logotipo: boolean;
    cabecalho: string;
    texto_final: string;
    uuid?: string | null;
  },
  uuid?: string,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosRelatorios
    .patch(
      URL.patchPersonalizacao(uuid),
      {
        processo_uuid: processoUuid,
        tipo: tipoRelatorio,
        ...payload,
        uuid: payload.uuid !== undefined ? payload.uuid : null,
      },
      {
        signal: axiosRequestConfig?.signal || signal,
        ...axiosRequestConfig,
      }
    )
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};


