import type { AxiosRequestConfig } from "axios";
import { appAxiosAdminUsuarios } from "../../axios";
import type { ILoginRequest, ILoginResponse } from "./ILogin";

export type { ILoginRequest, ILoginResponse };

export const URL = {
  login: () => `/api/v1/login/`,
};

export const postLogin = (
  payload: ILoginRequest,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosAdminUsuarios
    .post<ILoginResponse>(URL.login(), payload, {
      signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};
