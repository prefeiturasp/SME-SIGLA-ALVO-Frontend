import { useQuery } from "@tanstack/react-query";
import { API } from "../../../services";
import type { AxiosRequestConfig } from "axios";
 
const STALE_TIME_PADRAO = 5 * 60 * 1000;

export const useGetConcursoByUuid = (
  uuid: string,
  axiosRequestConfig?: AxiosRequestConfig,
  staleTime: number = STALE_TIME_PADRAO
) => {
  const { data: concursoData, isLoading: concursoIsLoading } = useQuery({
    queryKey: ["getConcursoByUuid", uuid],
    queryFn: ({ signal }) =>
      API.Concursos.getConcursoByUuid(uuid, { signal, ...axiosRequestConfig }).response,
    staleTime: 0,
    retry: 0,
    enabled: !!uuid
  });
 
  return {
    concursoData,
    concursoIsLoading,
  };
};
 