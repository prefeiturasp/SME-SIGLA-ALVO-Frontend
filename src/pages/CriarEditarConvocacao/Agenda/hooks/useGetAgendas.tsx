import { useQuery } from "@tanstack/react-query";
import { API } from "../../../../services";
import type { IListRequest } from "../../../../types/IListRequest";
import type { IAgendaFilters } from "../../../../services/resources/agenda/IAgenda";

export const useGetAgendas = (
  listRequest?: IListRequest<IAgendaFilters>,
  options?: { enabled?: boolean }
) => {
  const { data: agendasData, isLoading: agendasIsLoading } = useQuery({
    queryKey: ["getAgendas", listRequest],
    queryFn: ({ signal }) =>
      API.Agenda.getAgendas(listRequest, { signal }).response,
    staleTime: 1000 * 60 * 5,
    retry: 0,
    enabled: options?.enabled !== false && !!listRequest,
  });

  return {
    agendasData,
    agendasIsLoading,
  };
};
