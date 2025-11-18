import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../../services";
import type { PaginatedResponse } from "../../../types/IListRequest";
import type { IAgenda } from "../../../services/resources/agenda/IAgenda";
import type { UseGetAgendasPorProcessoConvocacaoParams } from "./types";

export const useGetAgendasPorProcessoConvocacao = ({
  processoUuid,
  enabled = true,
}: UseGetAgendasPorProcessoConvocacaoParams) => {
  const queryEnabled = enabled && Boolean(processoUuid);

  const {
    data: agendasData,
    isLoading: agendasIsLoading,
    error: agendasError,
    refetch: refetchAgendas,
  } = useQuery({
    queryKey: ["getAgendasPorProcessoConvocacao", processoUuid],
    queryFn: ({ signal }) =>
      API.Agenda.getAgendas(
        {
          pagination: { page: 1, page_size: 100 },
          filters: { processo_convocacao_uuid: processoUuid! },
        },
        { signal }
      ).response as Promise<PaginatedResponse<IAgenda>>,
    enabled: queryEnabled,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });

  const agendasList = useMemo(
    () => agendasData?.results ?? [],
    [agendasData?.results]
  );

  return {
    agendasData,
    agendasList,
    agendasIsLoading,
    agendasError,
    refetchAgendas,
  };
};


