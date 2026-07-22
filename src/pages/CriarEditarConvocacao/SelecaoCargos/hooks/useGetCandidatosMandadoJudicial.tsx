// src/pages/CriarEditarConvocacao/SelecaoCargos/hooks/useGetCandidatosMandadoJudicial.tsx
import { useQuery } from "@tanstack/react-query";
import { API } from "../../../../services";

export const useGetCandidatosMandadoJudicial = (
  buscarCandidatos: boolean = false,
  parametros?: { concurso_uuid: string; codigo_cargo?: string; nome?: string }
) => {
  const { data: candidatosData, isLoading: candidatosIsLoading } = useQuery({
    queryKey: parametros
      ? ["getCandidatosHabilitadosMandadoJudicial", parametros]
      : ["getCandidatosHabilitadosMandadoJudicial"],
    queryFn: ({ signal }) => {
      if (parametros) {
        return API.Candidatos.getCandidatosHabilitadosMandadoJudicial(parametros, { signal }).response;
      }
      return Promise.resolve([]);
    },
    staleTime: 0,
    retry: 0,
    // A lista é editável pelo usuário (exclusão por linha); um refetch em
    // background não pode sobrescrever as exclusões já feitas
    refetchOnWindowFocus: false,
    enabled: buscarCandidatos && !!parametros, // Só executa quando buscarCandidatos for true e parametros existirem
  });

  return {
    candidatosData: candidatosData,
    candidatosIsLoading,
  };
};
