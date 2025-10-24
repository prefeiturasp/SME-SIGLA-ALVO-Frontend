import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const getEnv = (key: string, fallback: string) => {
  // No Vite, as variáveis de ambiente são acessadas através de import.meta.env
  // e devem ter o prefixo VITE_
  const viteKey = `VITE_${key}`;
  const envValue = import.meta.env[viteKey];
  return envValue || fallback;
};

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
      // Verificar se a URL é pública (não precisa de token)
      const isPublicUrl = PUBLIC_URLS.some(url => config.url?.includes(url));
      
      if (!isPublicUrl) {
        // Pegar token do localStorage
        const token = localStorage.getItem('TOKEN');
        
        if (token) {
          // Adicionar token no header Authorization
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
        // Token inválido ou expirado - limpar localStorage e redirecionar para login
        localStorage.removeItem('TOKEN');
        localStorage.removeItem('USUARIO');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

export const appAxiosProcessoConvocacao = axios.create({
  baseURL: getEnv("PROCESSOS_CONVOCACAO_API_URL", "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-convocacao"),
});
// addAuthInterceptor(appAxiosProcessoConvocacao);

export const appAxiosConcursos = axios.create({
  baseURL: getEnv("CONCURSOS_API_URL", "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos"),
});
// addAuthInterceptor(appAxiosConcursos);

export const appAxiosCandidatos = axios.create({
  baseURL: getEnv("CANDIDATOS_API_URL", "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-candidatos"),
});
// addAuthInterceptor(appAxiosCandidatos);

export const appAxiosImportaArquivos = axios.create({
  baseURL: getEnv("IMPORTACAO_ARQUIVOS_API_URL", "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-importa-arquivos"),
});
// addAuthInterceptor(appAxiosImportaArquivos);

export const appAxiosAdminUsuarios = axios.create({
  baseURL: getEnv("ADMIN_USUARIOS_API_URL", "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-admin-usuarios"),
});
// addAuthInterceptor(appAxiosAdminUsuarios);

export const appAxiosEscolhas = axios.create({
  baseURL: getEnv("ESCOLHAS_API_URL", "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-escolha"),
});
// addAuthInterceptor(appAxiosEscolhas);

export const appAxiosAgenda = axios.create({
  baseURL: getEnv("AGENDA_API_URL", "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-agenda"),
});
// addAuthInterceptor(appAxiosAgenda);
