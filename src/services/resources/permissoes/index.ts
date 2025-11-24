import type { AxiosRequestConfig } from "axios";
import { appAxiosAdminUsuarios } from "../../axios";
import type {  IUsuarioPermissoes, IUsuarioPermissoesRequest } from "./IPermissoes";
import queryParamsSerializer from "../../../utils/queryParamsSerializer";

export type { IUsuarioPermissoes };

export const URL = {
  getPermissoesPorUsuarioEModel: () => `/api/v1/usuarios/permissoes/`,
};



export const getPermissoesPorUsuarioEModel = (
  params: IUsuarioPermissoesRequest,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();
  const response = appAxiosAdminUsuarios
    .get<IUsuarioPermissoes>(URL.getPermissoesPorUsuarioEModel(), {
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
