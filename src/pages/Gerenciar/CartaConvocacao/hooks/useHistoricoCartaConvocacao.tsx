import { useQuery } from "@tanstack/react-query";
import { API } from "../../../../services";
import type { IListRequest } from "../../../../types/IListRequest";
import type { PaginatedResponse } from "../../../../types/IListRequest";
import type { IHistoricoCartaConvocacao } from "../../../../services/resources/convocacao/IConvocacao";

const useHistoricoCartaConvocacao = (listRequest: IListRequest) => {
  const {
    data,
    isLoading: historicoIsLoading,
    refetch: historicoRefetch,
  } = useQuery({
    queryKey: ["getHistoricoCartaConvocacao", listRequest],
    queryFn: async ({ signal }) => {
      try {
        const data = await API.Convocacao.getHistoricoCartaConvocacao(listRequest, {
          signal,
        }).response;
        return data as PaginatedResponse<IHistoricoCartaConvocacao>;
      } catch {
        return { results: [], count: 0 } as PaginatedResponse<IHistoricoCartaConvocacao>;
      }
    },
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  const results = data?.results ?? [];
  const count = data?.count ?? 0;

  return {
    historicoData: { results, count },
    historicoIsLoading,
    historicoRefetch,
  };
};

export default useHistoricoCartaConvocacao;
