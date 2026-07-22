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
    refetchOnWindowFocus: false,
    enabled: buscarCandidatos && !!parametros,
  });

  return {
    candidatosData: candidatosData,
    candidatosIsLoading,
  };
};
