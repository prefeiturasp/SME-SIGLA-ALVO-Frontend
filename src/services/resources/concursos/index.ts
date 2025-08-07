import type { AxiosRequestConfig } from "axios";
import { appAxiosConcursos } from "../../axios";
import type { IConcursoOptions } from "./IConcursos";

export const URL = {
  getConcursos: () => `/api/v1/concursos`,
};


  


// TODO adicionar JWT no header Authorization
export const getConcursosOptions = (
   axiosRequestConfig?: AxiosRequestConfig
) => {
   const { signal, abort } = new AbortController();

  const response = appAxiosConcursos
    .get<IConcursoOptions[]>(URL.getConcursos(), {
       signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};
