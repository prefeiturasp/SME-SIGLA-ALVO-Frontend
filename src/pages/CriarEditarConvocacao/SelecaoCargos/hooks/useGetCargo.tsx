import { useQuery } from "@tanstack/react-query";
import { API } from "../../../../services";

export const useGetCargo = (
  processoUuid?: string,
  enabled: boolean = true
) => {
  const { data: cargosData, isLoading: cargosIsLoading, refetch: cargosRefetch } = useQuery({
    queryKey: ["getCargosProcesso", processoUuid],
    queryFn: ({ signal }) =>
      API.Convocacao.getCargosProcesso(processoUuid!, { signal }).response,
    enabled: enabled && !!processoUuid,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });

  const carregarCargos = () => {
    if (processoUuid) {
      cargosRefetch();
    }
  };

  return {
    cargosData,
    cargosIsLoading,
    carregarCargos,
  };
};

