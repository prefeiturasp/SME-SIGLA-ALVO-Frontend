import type { AxiosRequestConfig } from "axios";
import { appAxiosAdminUsuarios } from "../../axios";
import type { IMeusDadosResponse, IAlterarSenhaRequest } from "./IUsuarios";

export type { IMeusDadosResponse, IAlterarSenhaRequest };

export const URL = {
  meusDados: () => `/api/v1/meus-dados/`,
  alterarSenha: () => `/api/v1/alterar-senha/`,
};

export const getMeusDados = (axiosRequestConfig?: AxiosRequestConfig) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosAdminUsuarios
    .get<IMeusDadosResponse>(URL.meusDados(), {
      signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return { response, abort };
};

export const postAlterarSenha = (
  payload: IAlterarSenhaRequest,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosAdminUsuarios
    .post<{ detail: string }>(URL.alterarSenha(), payload, {
      signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return { response, abort };
};
