import { useQuery } from "@tanstack/react-query";
import { API } from "../services";
import type { IListRequest } from "../types/IListRequest";

const useConvocacao = (listRequest: IListRequest) => {
 
    const {
        data: processosConvocacaoData,
        isLoading: processosConvocacaoIsLoading,
      } = useQuery({
        queryKey: ["getProcessosConvocacao", listRequest],
        queryFn: ({ signal }) =>
          API.Convocacao.getProcessosConvocacao(listRequest, { signal }).response,
        staleTime: 1000 * 60 * 5,
        retry: 0,
      });

  return {
    processosConvocacaoData,
    processosConvocacaoIsLoading,
  };
};

export default useConvocacao;
