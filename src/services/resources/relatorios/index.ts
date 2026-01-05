import type { AxiosRequestConfig } from "axios";
import { appAxiosRelatorios } from "../../axios";
import type { FormatoRelatorio, IRelatorioPayload } from "./IRelatorios";

export const URL = {
  postRelatorios: () => `/api/v1/relatorios/`,
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


