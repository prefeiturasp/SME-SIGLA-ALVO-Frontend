import type { AxiosRequestConfig } from "axios";
import { appAxiosProcessoConvocacao } from "../../axios";

export const URL = {
  postEnvioEmails: () => `/api/v1/envio-email/`,
  getEnvioEmailConteudo: () => `/api/v1/envio-email-conteudo/`,
};

export interface IPostEnvioEmailsPayload {
  processo_uuid: string;
  processo_nome: string;
  tipo: "CONVOCACAO" | "VAGAS" | "RESULTADOS";
  conteudo: string;
  assunto?: string;
}

export const postEnvioEmails = (
  payload: IPostEnvioEmailsPayload,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosProcessoConvocacao
    .post(URL.postEnvioEmails(), payload, {
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((res) => res.data);

  return {
    response,
    abort,
  };
};

export const getEnvioEmailConteudo = (
  tipo: string,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosProcessoConvocacao
    .get(URL.getEnvioEmailConteudo(), {
      params: { tipo },
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((res) => res.data);

  return {
    response,
    abort,
  };
};

