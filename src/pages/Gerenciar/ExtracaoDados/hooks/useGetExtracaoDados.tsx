import { useQuery } from "@tanstack/react-query";
import { API } from "../../../../services";
import type { IExtracaoDadosResponse } from "../../../../services/resources/relatorios/IExtracaoDados";

export const useGetExtracaoDados = (
  concursoUuid?: string,
  ano?: string,
  enabled: boolean = false
) => {
  const {
    data: extracaoDados,
    isLoading,
    isFetching,
    refetch,
    error,
  } = useQuery({
    queryKey: ["getExtracaoDados", concursoUuid, ano],
    queryFn: ({ signal }) =>
      API.Relatorios.getExtracaoDados(
        {
          concurso_uuid: concursoUuid!,
          ano: ano!,
        },
        { signal }
      ).response as Promise<IExtracaoDadosResponse>,
    enabled: enabled && Boolean(concursoUuid) && Boolean(ano),
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  return {
    extracaoDados,
    extracaoDadosIsLoading: isLoading || isFetching,
    extracaoDadosRefetch: refetch,
    extracaoDadosError: error,
  };
};
