// src/pages/Processos/NovaConvocacaoCandidatos/hooks/useConcursos.tsx
import { useQuery } from "@tanstack/react-query";
import { API } from "../services";

export const useConcursos = () => {
  const { data: concursosData, isLoading: concursosOptionsIsLoading } = useQuery({
    queryKey: ["getConcursos"],
    queryFn: ({ signal }) =>
      API.Concursos.getConcursos({ signal }).response,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 0,
  });

  return {
    concursosData: concursosData || [],
    concursosOptionsIsLoading,
  };
};
