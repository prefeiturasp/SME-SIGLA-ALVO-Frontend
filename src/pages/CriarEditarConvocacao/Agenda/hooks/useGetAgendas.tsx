import { useQuery } from "@tanstack/react-query";
import { API } from "../../../../services";
import type { IListRequest } from "../../../../types/IListRequest";
import type { IAgendaFilters } from "../../../../services/resources/agenda/IAgenda";

export const useGetAgendas = (
  listRequest?: IListRequest<IAgendaFilters>,
  options?: { enabled?: boolean }
) => {
  const pcUuid = listRequest?.filters?.processo_convocacao_uuid;
  const page = listRequest?.pagination?.page ?? 1;
  const pageSize = listRequest?.pagination?.page_size ?? 100;
  const { data: agendasData, isLoading: agendasIsLoading } = useQuery({
    // Usar chaves primitivas estáveis no queryKey para evitar recomputes desnecessários
    queryKey: ["getAgendas", pcUuid, page, pageSize],
    queryFn: ({ signal }) =>
      API.Agenda.getAgendas(listRequest, { signal }).response,
    staleTime: 1000 * 60 * 5,
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    keepPreviousData: true,
    enabled: options?.enabled !== false && !!listRequest,
  });

  return {
    agendasData,
    agendasIsLoading,
  };
};
