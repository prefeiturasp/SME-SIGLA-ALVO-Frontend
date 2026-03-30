// src/pages/CriarEditarConvocacao/SelecaoCargos/hooks/useGetCandidatosCalculados.tsx
import { useQuery } from "@tanstack/react-query";
import { API } from "../../../../services";

export const useGetCandidatosCalculados = (
  buscarCandidatos: boolean = false,
  parametros?: { concurso_uuid: string; processo_uuid?: string; quantidade: number; codigo_cargo?: string }
) => {
  const { data: candidatosData, isLoading: candidatosIsLoading } = useQuery({
    queryKey: parametros 
      ? ["getCandidatosHabilitadosCalculados", parametros] 
      : ["getCandidatosCalculados"],
    queryFn: ({ signal }) => {
      if (parametros) {
        return API.Candidatos.getCandidatosHabilitadosCalculados(parametros, { signal }).response;
      }
      return Promise.resolve([]);
    },
    staleTime: 1000 * 60 * 5,
    retry: 0,
    enabled: buscarCandidatos && !!parametros, // Só executa quando buscarCandidatos for true e parametros existirem
  });
  return {
    candidatosData: candidatosData,
    candidatosIsLoading,
    fetchCandidatosNow: (params: { concurso_uuid: string; processo_uuid?: string; quantidade: number; codigo_cargo?: string }) =>
      API.Candidatos.getCandidatosHabilitadosCalculados(params).response,
  };
};

