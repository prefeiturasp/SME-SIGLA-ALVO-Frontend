import { useQuery } from "@tanstack/react-query";
import { API } from "../services";


const useImportacaoArquivosVagas = () => {
  // Query para buscar importações com parâmetros
   // Query para buscar importações com parâmetros
   const { data: importacoesArquivosData, isLoading: importacoesArquivosIsLoading, refetch: importacoesArquivosRefetch } = useQuery({
    queryKey: ["getImportacaoArquivosVagas"],
    queryFn: ({ signal }) =>
      API.ImportacaoDados.getUltimasImportacoesArquivosVagas(
        {
          tipo: "VAGAS",
        },
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

export default useImportacaoArquivosVagas;


