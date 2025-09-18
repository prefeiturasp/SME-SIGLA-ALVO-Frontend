// src/pages/Processos/NovaConvocacaoCandidatos/hooks/useConcursos.tsx
import { useQuery } from "@tanstack/react-query";
import { API } from "../services";

export const useConcursosOptions = () => {

  const { data: concursosOptions, isLoading: concursosOptionsIsLoading } = useQuery({
    queryKey: ["getConcursosOptions"],
    queryFn: ({ signal }) =>
      API.Convocacao.getConcursosOptions({ signal }).response,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });

  

  return {
    concursosOptions: concursosOptions || [],
    concursosOptionsIsLoading,
  };
};
