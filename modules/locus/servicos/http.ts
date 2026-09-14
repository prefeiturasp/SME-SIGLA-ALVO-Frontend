import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";

function obterUrlBase(chave: string): string | undefined {
  if (typeof window !== "undefined" && window.__ENV__?.[chave]) {
    return window.__ENV__[chave];
  }
  return (import.meta.env as Record<string, string | undefined>)[chave];
}

const ROTAS_PUBLICAS = ["/api/v1/login/", "/api/v1/health/"];

function adicionarInterceptors(instancia: AxiosInstance): void {
  instancia.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const ehPublica = ROTAS_PUBLICAS.some((rota) =>
        config.url?.includes(rota),
      );

      if (!ehPublica) {
        const token = localStorage.getItem("TOKEN");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      return config;
    },
    (erro) => Promise.reject(erro),
  );

  instancia.interceptors.response.use(
    (resposta) => resposta,
    (erro) => {
      const status = erro.response?.status;
      const codigo = erro.response?.data?.code;

      if (status === 401 || codigo === "token_not_valid") {
        localStorage.removeItem("TOKEN");
        localStorage.removeItem("USUARIO");
      } else if (status === 403) {
        window.location.href = "/403";
      }

      return Promise.reject(erro);
    },
  );
}

export const http = axios.create({
  baseURL: obterUrlBase("VITE_LOCUS_API_URL"),
});

adicionarInterceptors(http);

export default http;
