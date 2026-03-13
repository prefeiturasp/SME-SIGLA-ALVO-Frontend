import type { AxiosRequestConfig } from "axios";
import { appAxiosImportaArquivos } from "../../axios";
import type { IListRequest, PaginatedResponse } from "../../../types/IListRequest";
import queryParamsSerializer from "../../../utils/queryParamsSerializer";
import type {
  IExportacaoVagasListItem,
  IExportacaoVagasListFilters,
  IExportacaoVagasPayload,
  IExportacaoCandidatosPayload,
  IExportacaoCandidatosListItem,
  IExportacaoCandidatosListFilters,
  ExportacaoTipo,
} from "./types";

const BASE_VAGAS_PROCESSO = "/api/v1/exportacao/vagas-processo";
const BASE_VAGAS_SIGPEC = "/api/v1/exportacao/vagas-sigpec";
const BASE_CANDIDATOS_PROCESSO = "/api/v1/exportacao/candidatos-processo";

export const URL = {
  listVagasProcesso: () => `${BASE_VAGAS_PROCESSO}/`,
  createVagasProcesso: () => `${BASE_VAGAS_PROCESSO}/`,
  downloadVagasProcesso: (uuid: string) => `${BASE_VAGAS_PROCESSO}/${uuid}/download/`,
  listVagasSigpec: () => `${BASE_VAGAS_SIGPEC}/`,
  createVagasSigpec: () => `${BASE_VAGAS_SIGPEC}/`,
  downloadVagasSigpec: (uuid: string) => `${BASE_VAGAS_SIGPEC}/${uuid}/download/`,
  listCandidatosProcesso: () => `${BASE_CANDIDATOS_PROCESSO}/`,
  createCandidatosProcesso: () => `${BASE_CANDIDATOS_PROCESSO}/`,
  downloadCandidatosProcesso: (uuid: string) => `${BASE_CANDIDATOS_PROCESSO}/${uuid}/download/`,
};

function getDownloadUrl(tipo: ExportacaoTipo, uuid: string): string {
  return tipo === "vagas-processo"
    ? URL.downloadVagasProcesso(uuid)
    : URL.downloadVagasSigpec(uuid);
}

export const getListExportacaoVagasProcesso = (
  listRequest: IListRequest<IExportacaoVagasListFilters>,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { pagination, filters, ...rest } = listRequest;
  const params = { ...pagination, ...filters, ...rest };
  const { signal, abort } = new AbortController();
  const response = appAxiosImportaArquivos
    .get<PaginatedResponse<IExportacaoVagasListItem>>(URL.listVagasProcesso(), {
      params,
      paramsSerializer: queryParamsSerializer,
      signal,
      ...axiosRequestConfig,
    })
    .then((res) => res.data);
  return { response, abort };
};

export const getListExportacaoVagasSigpec = (
  listRequest: IListRequest<IExportacaoVagasListFilters>,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { pagination, filters, ...rest } = listRequest;
  const params = { ...pagination, ...filters, ...rest };
  const { signal, abort } = new AbortController();
  const response = appAxiosImportaArquivos
    .get<PaginatedResponse<IExportacaoVagasListItem>>(URL.listVagasSigpec(), {
      params,
      paramsSerializer: queryParamsSerializer,
      signal,
      ...axiosRequestConfig,
    })
    .then((res) => res.data);
  return { response, abort };
};

export const postCreateExportacaoVagasProcesso = (
  payload: IExportacaoVagasPayload,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();
  const response = appAxiosImportaArquivos
    .post<Blob>(URL.createVagasProcesso(), payload, {
      headers: { "Content-Type": "application/json" },
      responseType: "blob",
      signal: axiosRequestConfig?.signal ?? signal,
      ...axiosRequestConfig,
    })
    .then((res) => {
      const blob = res.data;
      const filename = parseFilenameFromContentDisposition(
        res.headers["content-disposition"],
        "exportacao-vagas-processo.txt"
      );
      return { blob, filename };
    });
  return { response, abort };
};

export const postCreateExportacaoVagasSigpec = (
  payload: IExportacaoVagasPayload,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();
  const response = appAxiosImportaArquivos
    .post<Blob>(URL.createVagasSigpec(), payload, {
      headers: { "Content-Type": "application/json" },
      responseType: "blob",
      signal: axiosRequestConfig?.signal ?? signal,
      ...axiosRequestConfig,
    })
    .then((res) => {
      const blob = res.data;
      const filename = parseFilenameFromContentDisposition(
        res.headers["content-disposition"],
        "exportacao-vagas-sigpec.txt"
      );
      return { blob, filename };
    });
  return { response, abort };
}

export const getListExportacaoCandidatosProcesso = (
  listRequest: IListRequest<IExportacaoCandidatosListFilters>,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { pagination, filters, ...rest } = listRequest;
  const params = { ...pagination, ...filters, ...rest };
  const { signal, abort } = new AbortController();
  const response = appAxiosImportaArquivos
    .get<PaginatedResponse<IExportacaoCandidatosListItem>>(URL.listCandidatosProcesso(), {
      params,
      paramsSerializer: queryParamsSerializer,
      signal,
      ...axiosRequestConfig,
    })
    .then((res) => res.data);
  return { response, abort };
};

export const postCreateExportacaoCandidatosProcesso = (
  payload: IExportacaoCandidatosPayload,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();
  const response = appAxiosImportaArquivos
    .post<Blob>(URL.createCandidatosProcesso(), payload, {
      headers: { "Content-Type": "application/json" },
      responseType: "blob",
      signal: axiosRequestConfig?.signal ?? signal,
      ...axiosRequestConfig,
    })
    .then((res) => {
      const blob = res.data;
      const filename = parseFilenameFromContentDisposition(
        res.headers["content-disposition"],
        "exportacao-candidatos-processo.txt"
      );
      return { blob, filename };
    });
  return { response, abort };
};

/**
 * Faz GET no endpoint de download e retorna o Blob + filename.
 * O download no navegador é disparado pelo hook (mesmo padrão da Importação).
 */
function parseFilenameFromContentDisposition(
  contentDisposition: string | undefined,
  fallback: string
): string {
  if (!contentDisposition) return fallback;
  const quoted = /filename="([^"]*)"/.exec(contentDisposition);
  const unquoted = /filename=([^;\s]+)/.exec(contentDisposition);
  if (quoted?.[1]) return quoted[1].trim();
  if (unquoted?.[1]) return unquoted[1].trim();
  return fallback;
}

export const downloadExportacao = (
  tipo: ExportacaoTipo,
  uuid: string,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const url = getDownloadUrl(tipo, uuid);
  const { signal, abort } = new AbortController();
  const response = appAxiosImportaArquivos
    .get<Blob>(url, {
      responseType: "blob",
      signal: axiosRequestConfig?.signal ?? signal,
      ...axiosRequestConfig,
    })
    .then((res) => {
      const blob = res.data;
      const filename = parseFilenameFromContentDisposition(
        res.headers["content-disposition"],
        `exportacao-${tipo}-${uuid}.txt`
      );
      return { blob, filename };
    });
  return { response, abort };
};

export const downloadExportacaoCandidatosProcesso = (
  uuid: string,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const url = URL.downloadCandidatosProcesso(uuid);
  const { signal, abort } = new AbortController();
  const response = appAxiosImportaArquivos
    .get<Blob>(url, {
      responseType: "blob",
      signal: axiosRequestConfig?.signal ?? signal,
      ...axiosRequestConfig,
    })
    .then((res) => {
      const blob = res.data;
      const filename = parseFilenameFromContentDisposition(
        res.headers["content-disposition"],
        `exportacao-candidatos-processo-${uuid}.txt`
      );
      return { blob, filename };
    });
  return { response, abort };
};

export type {
  IExportacaoVagasListItem,
  IExportacaoVagasListFilters,
  IExportacaoVagasPayload,
  IExportacaoCandidatosPayload,
  IExportacaoCandidatosListItem,
  IExportacaoCandidatosListFilters,
  ExportacaoTipo,
};
