import { useQuery } from "@tanstack/react-query";
import { API } from "../../../../../services";
import type { IListRequest } from "../../../../../types/IListRequest";

const useImportacoesArquivosHabilitados = (listRequest: IListRequest) => {
  // Query para buscar importações com parâmetros
  const { data: importacoesArquivos, isLoading: importacoesArquivosIsLoading } = useQuery({
    queryKey: ["getImportacaoArquivosHabilitados", listRequest],
    queryFn: ({ signal }) =>
      API.ImportacaoDados.getImportacaoArquivosHabilitados(
         listRequest,
         { signal }
      ).response,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });

  return {
    importacoesArquivos,
    importacoesArquivosIsLoading,
  };
};

export default useImportacoesArquivosHabilitados;
