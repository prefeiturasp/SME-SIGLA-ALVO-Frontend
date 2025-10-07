import type { AxiosRequestConfig } from "axios";
import { appAxiosAdminUsuarios } from "../../../axios";
import type { INovaSenhaRequest, INovaSenhaResponse } from "./INovaSenha";

export type { INovaSenhaRequest, INovaSenhaResponse };

export const URL = {
  novaSenha: () => `/api/v1/criar-nova-senha/`,
};

export const postNovaSenha = (
  payload: INovaSenhaRequest,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosAdminUsuarios
    .post<INovaSenhaResponse>(URL.novaSenha(), payload, {
      signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

