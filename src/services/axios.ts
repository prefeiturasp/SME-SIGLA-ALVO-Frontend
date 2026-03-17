import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";

// Em runtime (Docker/Rancher) as URLs vêm de window.__ENV__ (env.js gerado pelo entrypoint); localmente de import.meta.env
function getBaseUrl(key: string): string | undefined {
  const w = window as Window & { __ENV__?: Record<string, string> };
  if (w.__ENV__?.[key]) return w.__ENV__[key];
  return (import.meta.env as Record<string, string | undefined>)[key];
}

// URLs que NÃO devem ter o token no header
const PUBLIC_URLS = [
  '/api/v1/login/',
  '/api/v1/esqueci-minha-senha/',
  '/api/v1/criar-nova-senha/',
];

// Função para adicionar interceptor de autenticação
const addAuthInterceptor = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const isPublicUrl = PUBLIC_URLS.some(url => config.url?.includes(url));
      
      if (!isPublicUrl) {
        const token = localStorage.getItem('TOKEN');
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor de resposta para tratar erros 401 (não autorizado)
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('TOKEN');
        localStorage.removeItem('USUARIO');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

export const appAxiosProcessoConvocacao = axios.create({
  baseURL: getBaseUrl("VITE_PROCESSOS_CONVOCACAO_API_URL"),
});
addAuthInterceptor(appAxiosProcessoConvocacao);
 
export const appAxiosConcursos = axios.create({
  baseURL: getBaseUrl("VITE_CONCURSOS_API_URL"),
});
addAuthInterceptor(appAxiosConcursos);
 
export const appAxiosCandidatos = axios.create({
  baseURL: getBaseUrl("VITE_CANDIDATOS_API_URL"),
});
addAuthInterceptor(appAxiosCandidatos);
 
export const appAxiosImportaArquivos = axios.create({
  baseURL: getBaseUrl("VITE_IMPORTACAO_ARQUIVOS_API_URL"),
});
addAuthInterceptor(appAxiosImportaArquivos);
 
export const appAxiosAdminUsuarios = axios.create({
  baseURL: getBaseUrl("VITE_ADMIN_USUARIOS_API_URL"),
});
addAuthInterceptor(appAxiosAdminUsuarios);
 
export const appAxiosEscolhas = axios.create({
  baseURL: getBaseUrl("VITE_ESCOLHAS_API_URL"),
});
addAuthInterceptor(appAxiosEscolhas);
 
export const appAxiosAgenda = axios.create({
  baseURL: getBaseUrl("VITE_AGENDA_API_URL"),
});
addAuthInterceptor(appAxiosAgenda);

export const appAxiosRelatorios = axios.create({
  baseURL: getBaseUrl("VITE_RELATORIOS_API_URL"),
});
addAuthInterceptor(appAxiosRelatorios);
