import type { AxiosRequestConfig } from "axios";
import { appAxiosCandidatos } from "../../axios";
import type { ICandidato, IBuscarPorUuidsPayload, IBuscarPorUuidsResponse } from "./ICandidatos";
import type { PaginatedResponse } from "../../../types/IListRequest";
import queryParamsSerializer from "../../../utils/queryParamsSerializer";

export const URL = {
  getCandidatos: () => `/api/v1/candidatos/`,
  getCandidatoByUuid: (uuid: string) => `/api/v1/candidatos/${uuid}/`,
  getCandidatosHabilitados: () => `/api/v1/habilitados/`,
  postHabilitadoEliminar: () => `/api/v1/habilitados/eliminar/`,
  postReclassificar: () => `/api/v1/habilitados/reclassificar/`,
  getCandidatosHabilitadosReposicao: () => `/api/v1/habilitados/reposicao/`,
  getCandidatosHabilitadosReconvocacao: () => `/api/v1/habilitados/reconvocacao/`,
  getCandidatosHabilitadosCalculados: () => `/api/v1/habilitados/calculados/`,
  patchCandidatosHabilitadosConvocados: () => `/api/v1/habilitados/convocar/`,
  patchCandidatosHabilitadosDesconvocados: () => `/api/v1/habilitados/desconvocar/`,
  postBuscarPorUuids: () => `/api/v1/habilitados/buscar-por-uuids/`,
  getParametrizacao: () => `/api/v1/parametrizacao/`,
  patchParametrizacao: (uuid?: string) => uuid ? `/api/v1/parametrizacao/${uuid}/` : `/api/v1/parametrizacao/`,
};

// TODO adicionar JWT no header Authorization
export const getCandidatos = (
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosCandidatos    
    .get<PaginatedResponse<ICandidato>>(URL.getCandidatos(), {
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

/** Resposta do GET /api/v1/candidatos/{uuid}/ (detalhe do candidato). */
export interface ICandidatoDetalhe {
  uuid?: string;
  nome?: string;
  cpf?: string;
  email?: string;
  telefone?: string;
  celular?: string;
  rg?: string;
  registro_funcional?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  concursos?: Array<{ concurso_uuid?: string; descricao_cargo?: string; [key: string]: unknown }>;
  [key: string]: unknown;
}

export const getCandidatoByUuid = (
  uuid: string,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosCandidatos
    .get<ICandidatoDetalhe>(URL.getCandidatoByUuid(uuid), {
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((res) => res.data);

  return {
    response,
    abort,
  };
};

/** Payload para PATCH /api/v1/candidatos/{uuid}/ (atualização parcial). */
export interface IPatchCandidatoPayload {
  email?: string;
  telefone?: string;
  celular?: string;
  [key: string]: unknown;
}

export const patchCandidatoByUuid = (
  uuid: string,
  payload: IPatchCandidatoPayload,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosCandidatos
    .patch<ICandidatoDetalhe>(URL.getCandidatoByUuid(uuid), payload, {
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((res) => res.data);

  return {
    response,
    abort,
  };
};

// POST eliminar habilitado
export const postHabilitadoEliminar = (
  payload: { candidato_uuid: string; motivo: string },
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosCandidatos
    .post(URL.postHabilitadoEliminar(), payload, {
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

// POST reclassificar candidato
export const postReclassificarCandidato = (
  payload: { candidato_uuid: string; desclassificar_de: string; motivo: string },
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosCandidatos
    .post(URL.postReclassificar(), payload, {
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

// TODO adicionar JWT no header Authorization
export const getCandidatosHabilitados = (
  params?: Record<string, unknown>,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  // Remove campos indefinidos/nulos para não poluir a query
  const safeParams =
    params && typeof params === "object"
      ? Object.fromEntries(
          Object.entries(params).filter(
            ([, value]) => value !== undefined && value !== null
          )
        )
      : undefined;

  const response = appAxiosCandidatos
    .get<PaginatedResponse<ICandidato>>(URL.getCandidatosHabilitados(), {
      params: safeParams,
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

// TODO adicionar JWT no header Authorization
export const getCandidatosHabilitadosReposicao = (
  params: { concurso_uuid: string; geral?: number; pcd?: number; nna?: number; codigo_cargo?: string },
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosCandidatos
    .get<ICandidato[]>(URL.getCandidatosHabilitadosReposicao(), {
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

// TODO adicionar JWT no header Authorization
export const getCandidatosHabilitadosReconvocacao = (
  params: { concurso_uuid: string; geral?: number; pcd?: number; nna?: number; codigo_cargo?: string },
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosCandidatos
    .get<ICandidato[]>(URL.getCandidatosHabilitadosReconvocacao(), {
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

// TODO adicionar JWT no header Authorization
export const getCandidatosHabilitadosCalculados = (
  params: { concurso_uuid: string; quantidade: number; codigo_cargo?: string },
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosCandidatos
    .get<ICandidato[]>(URL.getCandidatosHabilitadosCalculados(), {
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

// TODO adicionar JWT no header Authorization
export const patchCandidatosHabilitadosConvocados = (
  payload: { concurso_uuid: string; processo_uuid: string; candidatos: string[]; foi_convocado: boolean },
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosCandidatos
    .patch(URL.patchCandidatosHabilitadosConvocados(), payload, {
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

export const patchCandidatosHabilitadosDesconvocados = (
  payload: { codigo_cargo: string; processo_uuid: string; },
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosCandidatos
    .patch(URL.patchCandidatosHabilitadosDesconvocados(), payload, {
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

// TODO adicionar JWT no header Authorization
export const postBuscarPorUuids = (
  payload: IBuscarPorUuidsPayload,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosCandidatos
    .post<IBuscarPorUuidsResponse>(URL.postBuscarPorUuids(), payload, {
      params: { order_by: "ranking_escolha", ...(axiosRequestConfig?.params as any) },
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

export interface IConcursoCandidatosLote {
  uuid: string;
  concurso_uuid: string;
  concurso_nome: string;
  criado_em: string;
}

export const getLotes = (
  concurso_uuid: string,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();
  const response = appAxiosCandidatos
    .get<IConcursoCandidatosLote[]>('/api/v1/lotes/', {
      params: { concurso_uuid },
      signal: axiosRequestConfig?.signal ?? signal,
      ...axiosRequestConfig,
    })
    .then((res) => res.data);
  return { response, abort };
};

export interface INumeroLote {
  numero_lote: number;
  lote_uuid: string;
}

export interface ICargoLote {
  codigo_cargo: string;
  descricao_cargo: string;
}

export const getNumerosLote = (
  concurso_uuid: string,
  codigo_cargo?: string,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();
  const params: Record<string, string> = { concurso_uuid };
  if (codigo_cargo) params.codigo_cargo = codigo_cargo;
  const response = appAxiosCandidatos
    .get<INumeroLote[]>('/api/v1/habilitados/numeros-lote/', {
      params,
      signal: axiosRequestConfig?.signal ?? signal,
      ...axiosRequestConfig,
    })
    .then((res) => res.data);
  return { response, abort };
};

export const getCargosLote = (
  concurso_uuid: string,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();
  const response = appAxiosCandidatos
    .get<ICargoLote[]>('/api/v1/habilitados/cargos/', {
      params: { concurso_uuid },
      signal: axiosRequestConfig?.signal ?? signal,
      ...axiosRequestConfig,
    })
    .then((res) => res.data);
  return { response, abort };
};

// GET Parametrizacao do MS-Candidatos
export const getParametrizacaoCandidatos = (
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosCandidatos
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

// PATCH Parametrizacao do MS-Candidatos
export const patchParametrizacaoCandidatos = (
  payload: Record<string, any>,
  uuid?: string,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosCandidatos
    .patch(URL.patchParametrizacao(uuid), payload, {
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

