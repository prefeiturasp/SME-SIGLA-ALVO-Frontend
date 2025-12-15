// src/pages/CriarEditarConvocacao/SelecaoCargos/hooks/useGetCandidatosReposicao.tsx
import { useQuery } from "@tanstack/react-query";
import { API } from "../../../../services";

export const useGetCandidatosReposicao = (
  buscarCandidatos: boolean = false,
  parametros?: { concurso_uuid: string; geral?: number; pcd?: number; nna?: number; codigo_cargo?: string }
) => {
  const { data: candidatosData, isLoading: candidatosIsLoading } = useQuery({
    queryKey: parametros 
      ? ["getCandidatosHabilitadosReposicao", parametros] 
      : ["getCandidatosReposicao"],
    queryFn: ({ signal }) => {
      if (parametros) {
        return API.Candidatos.getCandidatosHabilitadosReposicao(parametros, { signal }).response;
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
    fetchCandidatosNow: (params: { concurso_uuid: string; geral?: number; pcd?: number; nna?: number; codigo_cargo?: string }) =>
      API.Candidatos.getCandidatosHabilitadosReposicao(params).response,
  };
};

