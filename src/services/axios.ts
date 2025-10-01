import axios from "axios";

const getEnv = (key: string, fallback: string) => {
  // No Vite, as variáveis de ambiente são acessadas através de import.meta.env
  // e devem ter o prefixo VITE_
  const viteKey = `VITE_${key}`;
  const envValue = import.meta.env[viteKey];
  return envValue || fallback;
};

export const appAxiosProcessoConvocacao = axios.create({
  baseURL: getEnv("PROCESSOS_CONVOCACAO_API_URL", "http://127.0.0.1:8000"),
});

export const appAxiosConcursos = axios.create({
  baseURL: getEnv("CONCURSOS_API_URL", "http://localhost:8001"),
});

export const appAxiosCandidatos = axios.create({
  baseURL: getEnv("CANDIDATOS_API_URL", "http://localhost:8002"),
});

export const appAxiosImportaArquivos = axios.create({
  baseURL: getEnv("IMPORTACAO_ARQUIVOS_API_URL", "http://localhost:8003"),
});
