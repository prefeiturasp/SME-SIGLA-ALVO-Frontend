import axios from "axios";

const getEnv = (key: string, fallback: string) => {
  const nodeVal = (typeof process !== "undefined" && process.env && (process.env as any)[key]) as string | undefined;
  return nodeVal || fallback;
};

export const appAxiosProcessoConvocacao = axios.create({
  baseURL: getEnv("PROCESSOS_CONVOCACAO_API_URL", "http://localhost:8000"),
  // baseURL: getEnv("PROCESSOS_CONVOCACAO_API_URL", "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-convocacao"),
});

export const appAxiosConcursos = axios.create({
  baseURL: getEnv("CONCURSOS_API_URL", "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos"),
});

export const appAxiosCandidatos = axios.create({
  baseURL: getEnv("CANDIDATOS_API_URL", "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-candidatos"),
});

export const appAxiosImportaArquivos = axios.create({
  baseURL: getEnv("IMPORTACAO_ARQUIVOS_API_URL", "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-importa-arquivos"),
});
