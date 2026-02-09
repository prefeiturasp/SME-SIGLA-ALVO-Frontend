import type { AxiosRequestConfig } from "axios";
import { appAxiosRelatorios } from "../../axios";
import type { FormatoRelatorio, IRelatorioPayload } from "./IRelatorios";

export const URL = {
  postRelatorios: () => `/api/v1/relatorios/`,
  getAtaEscolhaCargos: () => `/api/v1/relatorios/ata-escolha-cargos/`,
  getParametrizacao: () => `/api/v1/parametrizacao/`,
  patchParametrizacao: (uuid?: string) => uuid ? `/api/v1/parametrizacao/${uuid}/` : `/api/v1/parametrizacao/`,
  getPersonalizacao: () => `/api/v1/personalizacao/`,
  patchPersonalizacao: (uuid?: string) => uuid ? `/api/v1/personalizacao/${uuid}/` : `/api/v1/personalizacao/`,
};

/**
 * POST para gerar relatórios
 * Param formato é opcional. Ex: "pdf" | "csv" | "xlsx"
 */
export const postRelatorio = (
  payload: IRelatorioPayload,
  formato?: FormatoRelatorio,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosRelatorios
    .post(URL.postRelatorios(), payload, {
      params: formato ? { formato } : undefined,
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((res) => res.data);

  return {
    response,
    abort,
  };
};

/** GET cargos do processo para Ata de Escolha (modal de seleção) */
export const getAtaEscolhaCargos = (
  processoUuid: string,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();
  const response = appAxiosRelatorios
    .get(URL.getAtaEscolhaCargos(), {
      params: { processo_uuid: processoUuid },
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((res) => res.data as { cargos: Array<{ cargo_codigo: string; cargo_nome: string }> });
  return { response, abort };
};

// GET Parametrizacao do MS-Relatorios
export const getParametrizacaoRelatorios = (
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosRelatorios
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

// PATCH Parametrizacao do MS-Relatorios
export const patchParametrizacaoRelatorios = (
  payload: FormData | Record<string, any>,
  uuid?: string,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const config: AxiosRequestConfig = {
    signal: axiosRequestConfig?.signal || signal,
    ...axiosRequestConfig,
  };

  if (payload instanceof FormData) {
    config.headers = {
      ...config.headers,
      'Content-Type': 'multipart/form-data',
    };
  }

  const response = appAxiosRelatorios
    .patch(URL.patchParametrizacao(uuid), payload, config)
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

// GET Personalização do relatório
export const getPersonalizacaoRelatorio = (
  tipoRelatorio: string,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosRelatorios
    .get(URL.getPersonalizacao(), {
      params: {
        tipo: tipoRelatorio,
      },
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

// PATCH Personalização do relatório
export const patchPersonalizacaoRelatorio = (
  tipoRelatorio: string,
  payload: {
    usar_cabecalho_padrao: boolean;
    usar_logotipo: boolean;
    cabecalho: string;
    texto_final: string;
    cabecalho_capa_ata?: string;
    uuid?: string | null;
  },
  uuid?: string,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosRelatorios
    .patch(
      URL.patchPersonalizacao(uuid),
      {
        tipo: tipoRelatorio,
        usar_cabecalho_padrao: payload.usar_cabecalho_padrao,
        usar_logotipo: payload.usar_logotipo,
        cabecalho: payload.cabecalho,
        texto_final: payload.texto_final,
        ...(payload.cabecalho_capa_ata !== undefined
          ? { cabecalho_capa_ata: payload.cabecalho_capa_ata }
          : {}),
        uuid: payload.uuid !== undefined ? payload.uuid : null,
      },
      {
        signal: axiosRequestConfig?.signal || signal,
        ...axiosRequestConfig,
      }
    )
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};


