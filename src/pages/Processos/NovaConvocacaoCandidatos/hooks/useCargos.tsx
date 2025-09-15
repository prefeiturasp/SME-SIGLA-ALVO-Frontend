// src/pages/Processos/NovaConvocacaoCandidatos/hooks/useConcursos.tsx
import { useQuery } from "@tanstack/react-query";
import { API } from "../../../../services";

export const useCargos= () => {
  const { data: cargosData, isLoading: cargosIsLoading } = useQuery({
    queryKey: ["getCargos"],
    queryFn: ({ signal }) =>
      API.Cargos.getCargos({ signal }).response,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 0,
  });

  return {
    cargosData: cargosData || [],
    cargosIsLoading
  };
};
