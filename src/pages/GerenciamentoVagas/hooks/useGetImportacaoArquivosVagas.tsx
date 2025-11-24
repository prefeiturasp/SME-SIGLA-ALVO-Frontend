import { useQuery } from "@tanstack/react-query";
import { API } from "../../../services";
 import type { IListRequest } from "../../../types/IListRequest";


const useGetImportacaoArquivosVagas = (listRequest: IListRequest<unknown>) => {
   const { data: importacoesArquivosData, isLoading: importacoesArquivosIsLoading, refetch: importacoesArquivosRefetch } = useQuery({
    queryKey: ["getImportacaoArquivosVagas", listRequest],
    queryFn: ({ signal }) =>
      API.ImportacaoDados.getUltimasImportacoesArquivosVagas(
        listRequest,
        { signal }
      ).response,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });

  return {
    importacoesArquivosData,
    importacoesArquivosIsLoading,
    importacoesArquivosRefetch
  };
};

export default useGetImportacaoArquivosVagas;


