// src/pages/CriarEditarConvocacao/SelecaoCargos/hooks/useCandidatos.tsx
import { useQuery } from "@tanstack/react-query";
import { API } from "../../../../services";

export const useCandidatos = (
  buscarCandidatos: boolean = false,
  parametros?: { geral: number; pcd: number; nna: number, concurso_uuid: string }
) => {
  const { data: candidatosData, isLoading: candidatosIsLoading } = useQuery({
    queryKey: parametros 
      ? ["getCandidatosHabilitados", parametros] 
      : ["getCandidatos"],
    queryFn: ({ signal }) => {
      if (parametros) {
        return API.Candidatos.getCandidatosHabilitados(parametros, { signal }).response;
      }
      return API.Candidatos.getCandidatos({ signal }).response;
    },
    staleTime: 1000 * 60 * 5,
    retry: 0,
    enabled: buscarCandidatos, // Só executa quando buscarCandidatos for true
  });

  return {
    candidatosData: candidatosData,
    candidatosIsLoading,
  };
};
