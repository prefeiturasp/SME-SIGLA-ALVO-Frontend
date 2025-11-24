import { useQuery } from "@tanstack/react-query";
import { API } from "../../../services";
import type { AxiosRequestConfig } from "axios";
 
export const useGetConcursoByUuid = (uuid: string, axiosRequestConfig?: AxiosRequestConfig) => {
  const { data: concursoData, isLoading: concursoIsLoading } = useQuery({
    queryKey: ["getConcursoByUuid", uuid],
    queryFn: ({ signal }) =>
      API.Concursos.getConcursoByUuid(uuid, { signal, ...axiosRequestConfig }).response,
    staleTime: 1000 * 60 * 5,
    retry: 0,
    enabled: !!uuid
  });
 
  return {
    concursoData,
    concursoIsLoading,
  };
};
 