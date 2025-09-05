import axios from "axios";

const getEnv = (key: string, fallback: string) => {
  const viteVal = (typeof import.meta !== "undefined" && (import.meta as any)?.env?.[key]) as string | undefined;
  if (viteVal) return viteVal;
  const nodeVal = (typeof process !== "undefined" && process.env && (process.env as any)[key]) as string | undefined;
  return nodeVal || fallback;
};

export const appAxiosProcessoConvocacao = axios.create({
  baseURL: getEnv("PROCESSOS_CONVOCACAO_API_URL", "http://127.0.0.1:8000"),
});

export const appAxiosConcursos = axios.create({
  baseURL: getEnv("CONCURSOS_API_URL", "http://127.0.0.1:8001"),
});

export const appAxiosCandidatos = axios.create({
  baseURL: getEnv("CANDIDATOS_API_URL", "http://127.0.0.1:8002"),
});

export const appAxiosImportaArquivos = axios.create({
  baseURL: getEnv("IMPORTACAO_ARQUIVOS_API_URL", "http://127.0.0.1:8002"),
});




