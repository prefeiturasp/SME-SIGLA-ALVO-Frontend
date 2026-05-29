import type { AxiosRequestConfig } from "axios";
import { appAxiosAdminUsuarios } from "../../axios";
import type {
  IMeusDadosResponse,
  IAlterarSenhaRequest,
  IAlterarEmailRequest,
  IBuscarUsuarioEolRequest,
  IBuscarUsuarioEolResponse,
  ICriarUsuarioRequest,
} from "./IUsuarios";

export type {
  IMeusDadosResponse,
  IAlterarSenhaRequest,
  IAlterarEmailRequest,
  IBuscarUsuarioEolRequest,
  IBuscarUsuarioEolResponse,
  ICriarUsuarioRequest,
};

export const URL = {
  meusDados: () => `/api/v1/meus-dados/`,
  alterarSenha: () => `/api/v1/alterar-senha/`,
  alterarEmail: () => `/api/v1/alterar-email/`,
  buscarUsuarioEol: () => `/api/v1/buscar-usuario-eol/`,
  criarUsuario: () => `/api/v1/criar-usuario/`,
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

export const postAlterarEmail = (
  payload: IAlterarEmailRequest,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosAdminUsuarios
    .post<{ detail: string }>(URL.alterarEmail(), payload, {
      signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return { response, abort };
};

export const postBuscarUsuarioEol = (
  payload: IBuscarUsuarioEolRequest,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosAdminUsuarios
    .post<IBuscarUsuarioEolResponse>(URL.buscarUsuarioEol(), payload, {
      signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return { response, abort };
};

export const postCriarUsuario = (
  payload: ICriarUsuarioRequest,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosAdminUsuarios
    .post<{ detail: string; user: string }>(URL.criarUsuario(), payload, {
      signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return { response, abort };
};
