import { useQuery } from "@tanstack/react-query";
import { API } from "../services";


const useImportacoesArquivosHabilitados = () => {
  // Query para buscar importações com parâmetros
  const { data: importacoesArquivos, isLoading: importacoesArquivosIsLoading } = useQuery({
    queryKey: ["getImportacaoArquivosHabilitados"],
    queryFn: ({ signal }) =>
      API.ImportacaoDados.getImportacaoArquivosHabilitados(
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
