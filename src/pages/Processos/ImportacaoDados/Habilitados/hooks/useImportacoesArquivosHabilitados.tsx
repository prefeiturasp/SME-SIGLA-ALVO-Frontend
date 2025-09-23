import { useQuery } from "@tanstack/react-query";
import { API } from "../../../../../services";

interface UseImportacoesArquivosHabilitadosParams {
  page?: number;
  pageSize?: number;
}

const useImportacoesArquivosHabilitados = (params?: UseImportacoesArquivosHabilitadosParams) => {
  const { page = 1, pageSize = 10 } = params || {};
  
  // Query para buscar importações com parâmetros
  const { data: importacoesArquivos, isLoading: importacoesArquivosIsLoading } = useQuery({
    queryKey: ["getImportacaoArquivosHabilitados", page, pageSize],
    queryFn: ({ signal }) =>
      API.ImportacaoDados.getImportacaoArquivosHabilitados(
         { page, page_size: pageSize },
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
