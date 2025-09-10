// src/pages/ProcessosConvocacao/hooks/useUltimasImportacoes.ts
import { useQuery } from "@tanstack/react-query";
import { API } from "../../../../../services";
import type { IFiltroProcessos } from "../../../../../services/resources/convocacao/IConvocacao";
import useListRequest from "../../../../../hooks/useListRequest";

export const useUltimasImportacoes = () => {
   
  const { listRequest, onAntTableChange } =
    useListRequest<IFiltroProcessos>({
      pagination: { page: 1, page_size: 10 },
    }); 
  

  const {
    data: processosConvocacaoData,
    isLoading: processosConvocacaoIsLoading,
  } = useQuery({
    queryKey: ["getProcessosConvocacao", listRequest],
    queryFn: ({ signal }) =>
      API.ImportacaoDados.getUltimasImportacoesArquivos(listRequest, { signal }).response,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });

  
  return {
    processosConvocacaoData,
    processosConvocacaoIsLoading,
    listRequest,
    onAntTableChange    
  };
};
