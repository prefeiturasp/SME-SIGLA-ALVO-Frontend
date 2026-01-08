// src/pages/Processos/NovaConvocacaoCandidatos/hooks/useConcursos.tsx
import { useQuery } from "@tanstack/react-query";
import { API } from "../../../../services";

export const useProcessosConvocacaoOptions = () => {

  const { data: processosConvocacaoOptions, isLoading: processosConvocacaoOptionsIsLoading } = useQuery({
    queryKey: ["getProcessosConvocacaoOptions"],
    queryFn: ({ signal }) =>
      API.Convocacao.getProcessosConvocacaoOptions({ signal }).response,
    // staleTime: 1000 * 60 * 5,
    retry: 0,
  });

  return {
    processosConvocacaoOptions: processosConvocacaoOptions || [],
    processosConvocacaoOptionsIsLoading,
  };
};
