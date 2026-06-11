import { useQuery } from "@tanstack/react-query";
import { API } from "../../../../services";
import type { IExtracaoDadosTodosResponse } from "../../../../services/resources/relatorios/IExtracaoDados";

export const useGetExtracaoDadosTodos = () => {
  const {
    data: extracaoDadosTodos,
    isLoading,
    isFetching,
    refetch,
    error,
  } = useQuery({
    queryKey: ["getExtracaoDadosTodos"],
    queryFn: ({ signal }) =>
      API.Relatorios.getExtracaoDadosTodos({ signal })
        .response as Promise<IExtracaoDadosTodosResponse>,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  return {
    extracaoDadosTodos,
    extracaoDadosTodosIsLoading: isLoading || isFetching,
    extracaoDadosTodosRefetch: refetch,
    extracaoDadosTodosError: error,
  };
};
