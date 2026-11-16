import { useQuery } from "@tanstack/react-query";
import { API } from "../../../services";

export const useGetVagasEscolas = (
  processoUuid?: string,
  enabled: boolean = false,
  cargoCodigo?: string
) => {
  const {
    data: dadosVagasNasEscolas,
    refetch: dadosVagasNasEscolasRefetch,
    isLoading: isLoadingVagasEscolas,
    isFetching: isFetchingVagasEscolas,
  } = useQuery({
    queryKey: ["getDadosVagasNasEscolas", processoUuid, cargoCodigo],
    queryFn: ({ signal }) =>
      API.Escolhas.getVagasEscolas(
        { processo_uuid: processoUuid as string, cargo_codigo: cargoCodigo ?? "" },
        { pagination: { page: 1, page_size: 1 }, filters: {} },
        { signal }
      ).response,
    enabled: Boolean(enabled && processoUuid),
    staleTime: 0,
    retry: 0,

  });
  return {
    dadosVagasNasEscolas,
    dadosVagasNasEscolasRefetch,
    isLoadingVagasEscolas,
    isFetchingVagasEscolas,
  };
};