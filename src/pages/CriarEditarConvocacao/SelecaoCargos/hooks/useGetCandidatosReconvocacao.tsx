// src/pages/CriarEditarConvocacao/SelecaoCargos/hooks/useGetCandidatosReconvocacao.tsx
import { useQuery } from "@tanstack/react-query";
import { API } from "../../../../services";

export const useGetCandidatosReconvocacao = (
  buscarCandidatos: boolean = false,
  parametros?: { concurso_uuid: string; geral?: number; pcd?: number; nna?: number; codigo_cargo?: string }
) => {
  const { data: candidatosData, isLoading: candidatosIsLoading } = useQuery({
    queryKey: parametros 
      ? ["getCandidatosHabilitadosReconvocacao", parametros] 
      : ["getCandidatosReconvocacao"],
    queryFn: ({ signal }) => {
      if (parametros) {
        return API.Candidatos.getCandidatosHabilitadosReconvocacao(parametros, { signal }).response;
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
  };
};

