import { useQuery } from "@tanstack/react-query";
import { getCandidatosHabilitados } from "../../../services/resources/candidatos";
import type { AxiosRequestConfig } from "axios";

export const useGetHablitados = (
  params: Record<string, unknown> | undefined,
  enabled: boolean,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: ["getHabilitados", params],
    queryFn: ({ signal }) =>
      getCandidatosHabilitados(params, { signal, ...axiosRequestConfig }).response,
    staleTime: 1000 * 60 * 5,
    retry: 0,
    enabled,
  });

  return {
    habilitadosData: data as unknown,
    habilitadosIsLoading: isLoading,
    habilitadosIsFetching: isFetching,
    habilitadosRefetch: refetch,
    habilitadosError: error,
  };
};

