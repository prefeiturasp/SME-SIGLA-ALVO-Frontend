import type { AxiosRequestConfig } from "axios";
import { appAxiosAdminUsuarios } from "../../../axios";
import type { IEsqueceuSenhaRequest, IEsqueceuSenhaResponse } from "./IEsqueceuSenha";

export type { IEsqueceuSenhaRequest, IEsqueceuSenhaResponse };

export const URL = {
  esqueceuSenha: () => `/api/v1/esqueci-minha-senha/`,
};

export const postEsqueceuSenha = (
  payload: IEsqueceuSenhaRequest,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosAdminUsuarios
    .post<IEsqueceuSenhaResponse>(URL.esqueceuSenha(), payload, {
      signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};
