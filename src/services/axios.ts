import axios from "axios";

export const appAxiosProcessoConvocacao = axios.create({
  baseURL: import.meta.env.VITE_PROCESSOS_CONVOCACAO_API_URL,
});

export const appAxiosConcursos = axios.create({
  baseURL: import.meta.env.VITE_CONCURSOS_API_URL,
});

export const appAxiosCandidatos = axios.create({
  baseURL: import.meta.env.VITE_CANDIDATOS_API_URL,
});

export const appAxiosImportaArquivos = axios.create({
  baseURL: import.meta.env.VITE_IMPORTACAO_ARQUIVOS_API_URL,
});
