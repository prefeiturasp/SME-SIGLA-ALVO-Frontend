import type { AxiosRequestConfig } from "axios";
import { appAxiosAdminUsuarios } from "../../axios";
import type {
  IGruposDisponiveisResponse,
  IPatchUsuarioRequest,
  IPatchUsuarioResponse,
  IUpdateGrupoUsuariosRequest,
  IUsuariosComGruposResponse,
  IUsuarioPermissoes,
  IUsuarioPermissoesRequest,
} from "./IPermissoes";
import queryParamsSerializer from "../../../utils/queryParamsSerializer";

export type {
  IGruposDisponiveisResponse,
  IPatchUsuarioRequest,
  IPatchUsuarioResponse,
  IUpdateGrupoUsuariosRequest,
  IUsuariosComGruposResponse,
  IUsuarioPermissoes,
  IUsuarioPermissoesRequest,
};

export const URL = {
  getPermissoesPorUsuarioEModel: () => `/api/v1/usuarios/permissoes/`,
  usuariosComGrupos: () => `/api/v1/usuarios/grupos/`,
  gruposDisponiveis: () => `/api/v1/grupos/`,
  gerenciarUsuariosGrupo: () => `/api/v1/grupos/usuarios/`,
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

// ===== Funções migradas de resources/adminUsuarios/index.ts =====

export const getUsuariosComGrupos = (
  params?: { usuario?: string },
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();
  const response = appAxiosAdminUsuarios
    .get<IUsuariosComGruposResponse>(URL.usuariosComGrupos(), {
      params,
      paramsSerializer: queryParamsSerializer,
      signal,
      ...axiosRequestConfig,
    })
    .then((r) => r.data);

  return { response, abort };
};

export const patchUsuario = (data: IPatchUsuarioRequest, axiosRequestConfig?: AxiosRequestConfig) => {
  const { signal, abort } = new AbortController();
  const response = appAxiosAdminUsuarios
    .patch<IPatchUsuarioResponse>(URL.usuariosComGrupos(), data, {
      signal,
      ...axiosRequestConfig,
    })
    .then((r) => r.data);

  return { response, abort };
};

export const getGruposDisponiveis = (axiosRequestConfig?: AxiosRequestConfig) => {
  const { signal, abort } = new AbortController();
  const response = appAxiosAdminUsuarios
    .get<IGruposDisponiveisResponse>(URL.gruposDisponiveis(), {
      signal,
      ...axiosRequestConfig,
    })
    .then((r) => r.data);

  return { response, abort };
};

export const putGerenciarUsuariosGrupo = (
  data: IUpdateGrupoUsuariosRequest,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();
  const response = appAxiosAdminUsuarios
    .put(URL.gerenciarUsuariosGrupo(), data, {
      signal,
      ...axiosRequestConfig,
    })
    .then((r) => r.data);

  return { response, abort };
};
