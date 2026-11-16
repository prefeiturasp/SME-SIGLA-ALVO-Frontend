import { useQuery } from "@tanstack/react-query";
import { API } from "../../../services";
import type { IBuscarEscolasParams } from '../../../services/resources/escolhas/IEscolhas';

export const useGetEscolasPorDre = (params?: IBuscarEscolasParams, enabled: boolean = false) => {
  const {
    data: escolas,
    refetch: fetchEscolas,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["getEscolas", params?.dre__codigo, params?.nome],
    queryFn: ({ signal }) =>
      API.Escolhas.getEscolas(params!, { signal }).response,
    enabled: Boolean(enabled && params?.dre__codigo),
    staleTime: 0,
    retry: 0,
  });

  return {
    escolas: escolas?.results || [],
    isLoading,
    isFetching,
    error,
    fetchEscolas,
  };
};
