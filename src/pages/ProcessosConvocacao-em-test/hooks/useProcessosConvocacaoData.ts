import { useQuery } from "@tanstack/react-query";
import { API } from "../../../services";
 
export const useProcessosConvocacaoData = (listRequest: any) => {
  const concursosQuery = useQuery({
    queryKey: ["getConcursosData"],
    queryFn: ({ signal }) => API.Convocacao.getConcursosData({ signal }).response,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });

  const processosQuery = useQuery({
    queryKey: ["getProcessosConvocacao", listRequest],
    queryFn: ({ signal }) => API.Convocacao.getProcessosConvocacao(listRequest, { signal }).response,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });

  return { concursosQuery, processosQuery };
};
